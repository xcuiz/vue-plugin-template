import RouteListener from "./parser/RouteListener";
import { $visitorFilterField, logicTypesConfig, EMPTY_ERROR } from "./config";
import RouteParser from "./parser/RouteParser";
import Validate from "./validate";
// g4文件中，大写字母开通，不匹配时，会出现<missing ....>
const $G4_CLASS_EMPTY_MSG = "<missing";
class Vistor extends RouteListener {
  analysisList = []; // 解析数据列表
  treeList = []; // 树状结构数据
  voList = {}; // 实体对象table的字段名对象（对每个动作生成的table结构进行记录）
  currentAnalysisIsAble = true; // 当前analysis是否可用
  lastParent = undefined; // 保存上一次的父级id数据
  id = 0; // 数据解析id
  existList = {}; // 当前存在的数据（作为缓存使用）
  lastDatasource = undefined;

  /**
   * @param {array} fieldsList 表字段列表
   * @param {array} excuteErrorList 外层传递执行错误列表
   */
  constructor({ fieldsList = [], excuteErrorList = [], globalVars = [] }) {
    super();
    this.fieldList = fieldsList;
    this.validate = new Validate();
    this.variableList = globalVars;
    this.excuteErrorList = excuteErrorList;
    this.root = this.lastParent = {
      key: "0",
      tableList: this.fieldList,
    };
  }
  /**
   * DataSource进入数据源，对如下规则进行处理
   * dataSource :'source:' beansDescription;
   * beansDescription: ('{' (bean (',' bean)*)? ','? '}')? ;
   * bean:  (key=beanName '=' value= beanValue)
   */
  enterDataSource(sourceTree) {
    // 获取数据源的子节点数据
    const beans = sourceTree.bean();
    if (!beans) {
      this.currentAnalysisIsAble = false;
      return;
    }
    const children = beans.beanLiteral();
    if (children && children.length) {
      const datasource = this._setBeansDescToMap(
        children,
        "Literal",
        "beanValue",
        beans
      );
      // 判断有DataSource数据处理(只有自选数据和事件数据可以使用)
      if (
        Object.keys(datasource.fieldMap).length &&
        ["origin", "event"].indexOf(datasource.fieldMap.sourceType) !== -1
      ) {
        // 父级等于root
        this.lastParent = this.root;
        const res = {
          type: "source",
          pId: "0",
          tableList: this.fieldList,
          variableList: this.variableList,
          parentVariableList: this.variableList,
          ...datasource.fieldMap,
        };
        // 将该解析添加进json树种(解析parser对象，用于错误定位)
        this._pushList(res, sourceTree, datasource.sourceMap);
        // 添加空节点
        this._entryEmptyNode(sourceTree);
      } else {
        // 如果不满足，退出当前数据源解析
        this.currentAnalysisIsAble = false;
      }
    }
  }
  /**
   * 进入groupby，对如下规则进行处理
   * groupByname:literal (','literal)?;
   * literal: stringLiteral;
   */
  enterAggregate(sourceTree) {
    // 当前analysis不可用
    if (!this.currentAnalysisIsAble) return;
    // 获取数据源的子节点数据
    const groupValue = sourceTree.groupValue();
    // 获取所有解析树
    const parserErrorList = [];
    // 判断value数据不存在 @fixme g4 支持太low
    const children =
      groupValue && groupValue.array().getText()
        ? groupValue.array().String()
        : [];
    // 统计字段添加(groupby自动添加的字段)
    const countField = [{ type: "long", name: "统计", field: "count" }];
    const groupbyList = children.reduce((list, tree) => {
      // goupby 满足条件 groupByname:keyLiteral (','keyLiteral)?; 获取keyLiteral
      const text = tree.getText();
      if (text) {
        list.push(this._resetCharts(text));
      }
      parserErrorList.push(tree);
      return list;
    }, []);
    const res = {
      type: "groupBy",
      pId: this.lastParent.key,
      tableList: this.fieldList
        .filter((item) => groupbyList.indexOf(item.field) !== -1)
        .concat(countField),
      variableList: this.variableList,
      parentVariableList: this.variableList,
      value: groupbyList,
    };
    // 将该解析添加进json树种
    this._pushList(res, sourceTree, parserErrorList);
    // 添加空节点
    this._entryEmptyNode(sourceTree);
  }
  /**
   * Filter 进入过滤器，对如下规则进行处理
   * filter : filterStat':'(literal binaryOperator)? literal;
   * filterStat:'filter_low'|'filter_high';
   * binaryOperator:   '='|   '<'|   '>'|   '<='|   '>=';
   * literal:   stringLiteral;
   */
  enterFilter(sourceTree) {
    // 当前analysis不可用
    if (!this.currentAnalysisIsAble) return;
    // 操作符
    let value = sourceTree.getText().replace("filter:", "");
    const quoteList = []; // 记录使用引用值
    const parserList = []; // 标记parser对象，用于错误处理
    // 获取所有引用
    sourceTree.fil().forEach((ctx) => {
      const valueCtxList = ctx.filterValue();
      // 添加识别的引用
      if (valueCtxList && valueCtxList.length) {
        valueCtxList.forEach((valueCtx) => {
          const quote = valueCtx.Quote();
          if (quote) {
            // 引用名称
            quoteList.push(quote.getText());
            // 引用名称对应parser位置
            parserList.push(quote);
          }
        });
      }
    });
    // 将该解析添加进json树种
    let res = {
      type: "filter",
      pId: this.lastParent.key,
      tableList: this.lastParent.tableList,
      variableList: this.variableList,
      parentVariableList: this.variableList,
      value: value || "",
      quoteList,
    };
    this._pushList(res, sourceTree, parserList);
    // 添加空节点
    this._entryEmptyNode(sourceTree);
  }
  /**
   * 进入排序 进入过滤器，对如下规则进行处理
   * sort:'sort:' sortStat   literal;
   * sortStat:('+'|'-');
   * literal:   stringLiteral;
   */
  enterSort(sourceTree) {
    // 当前analysis不可用
    if (!this.currentAnalysisIsAble) return;
    let field = sourceTree.Literal();
    let sortStat = sourceTree.SortStat();
    field =
      field && field.getText().indexOf($G4_CLASS_EMPTY_MSG) === -1
        ? this._resetCharts(field.getText())
        : undefined;
    sortStat =
      sortStat && sortStat.getText().indexOf($G4_CLASS_EMPTY_MSG) === -1
        ? this._resetCharts(sortStat.getText())
        : undefined;
    const res = {
      type: "sort",
      pId: this.lastParent.key,
      tableList: this.lastParent.tableList,
      variableList: this.variableList,
      parentVariableList: this.variableList,
      field,
      sortStat,
    };
    this._pushList(res, sourceTree);
    // 添加空节点
    this._entryEmptyNode(sourceTree);
  }
  // 进入展示
  enterExhibit(sourceTree) {
    // 当前analysis不可用
    if (!this.currentAnalysisIsAble) return;
    let resultType = sourceTree.exhibitValue();
    if (resultType) {
      resultType = this._resetCharts(resultType.getText());
      // 将该解析添加进json树种
      const res = {
        type: "exhibit",
        pId: this.lastParent.key,
        addDisable: true, // 对展示按钮控制，展示操作，添加按钮隐藏
        tableList: this.lastParent.tableList,
        variableList: this.variableList,
        parentVariableList: this.variableList,
        value: resultType,
      };
      this._pushList(res, sourceTree);
      // 当进入展示配置后，后续配置不可用
      this.currentAnalysisIsAble = false;
    }
  }
  // 进入变量标记
  enterVariable(sourceTree) {
    // 当前analysis不可用
    if (!this.currentAnalysisIsAble) return;
    let beans = sourceTree.beans();
    const bean = beans ? beans.bean() : [];
    const variableList = [];
    const parserList = [];
    // 变量类型处理正则匹配
    const typeReg = new RegExp(
      `^(${logicTypesConfig.variable.variaTypeEum.join("|")})(\\d+)$`
    );
    bean.forEach((source) => {
      const children = source.beanLiteral();
      let variable = {};
      const variableMap = this._setBeansDescToMap(
        children,
        "Literal",
        "beanValue",
        source
      );
      variable = variableMap.fieldMap;
      // 是否存在line数据
      if (variable.line) {
        const match = `${variable.line}`.match(typeReg);
        // 是否匹配数据
        if (match) {
          variable.line = match[2];
          variable.type = match[1];
        }
      }
      // 标记名队列
      variableList.push(variable);
      // parser对象队列
      parserList.push(variableMap.sourceMap);
    });
    // 获取父级变量列表
    const parentVariableList = this.variableList;
    // 将该解析添加进json树种
    this.variableList = this.variableList.concat(variableList);
    const res = {
      type: "variable",
      pId: this.lastParent.key,
      tableList: this.lastParent.tableList,
      value: variableList,
      variableList: this.variableList,
      parentVariableList,
    };
    this._pushList(res, sourceTree, parserList);
    // 添加空节点
    this._entryEmptyNode(sourceTree);
  }
  // 退出数据源
  exitAnalysis() {
    this.currentAnalysisIsAble = true;
  }
  // 进入当前树的解析
  enterAnalysis(sourceTree) {
    const datasource = sourceTree.dataSource();
    // 判断当前数据源不可用
    if (!datasource || !datasource.getText().startsWith("source")) {
      this.currentAnalysisIsAble = false;
      // 添加空节点（source数据源添加节点）
      sourceTree.stop &&
        this._entryEmptyNode(sourceTree, sourceTree.stop.stop - 2, "0");
    } else {
      this.currentAnalysisIsAble = true;
    }
  }
  // 退出整个解析
  exitAnalysises() {
    // 将list解析成树
    this.treeList = this.listToTree(this.analysisList);
    // 删除最后一条多余数据，默认退出Analysis之后，索引值和数据会增加
  }

  /**
   * 添加空节点
   * @param {object} sourceTree 需要查找的parser数据
   * @param {number} startIndex 起始查找位置
   * @param {string} pId 父级key值
   */
  _entryEmptyNode(
    sourceTree,
    startIndex = sourceTree.stop.stop,
    pId = this.lastParent.key
  ) {
    // 获取当前父节点最后一个节点位置作为截取位置
    let endIndex =
      sourceTree.constructor === RouteParser.AnalysisContext
        ? sourceTree.stop.stop
        : sourceTree.parentCtx.stop.stop;
    const getInputStream = sourceTree.start.getInputStream();
    // 截取文本，获取从startIndex到当前source结尾
    const str = getInputStream.getText(startIndex + 1, endIndex);
    // 判断当前节点为空节点(空节点不需要排重处理)
    if (str.trim() === "|]") {
      const res = {
        pId: pId,
        addDisable: true, // 对展示按钮控制，展示操作，添加按钮隐藏
        key:
          pId === "0"
            ? `${++this.id}`
            : `${pId}_${
                this.analysisList.filter((item) => item.pId === pId).length + 1
              }`,
        // 空节点默认添加节点错误
        error: {
          [EMPTY_ERROR]: true,
        },
      };
      this.analysisList.push(res);
    }
  }

  /**
   * 处理beansDescription数据为map数据
   * beansDescription: ('{' (bean (',' bean)*)? ','? '}')? ;
   * bean:  (key=beanName '=' value= beanValue);
   * @param {array} treeList
   * @param {array|string} keyList key名获取的属性名列表（其中一个满足就可以）
   * @param {array|string} valueNameList value名获取的属性名列表（其中一个满足就可以）
   */
  _setBeansDescToMap(
    treeList,
    keyList = "name",
    valueNameList = "value",
    parentCtx
  ) {
    // 获取某个属性值
    function _getValue(tree, keyList) {
      let key;
      if (typeof keyList === "string") {
        key = tree[keyList]();
      } else {
        // 遍历keyList，获取key值
        keyList.some((name) => {
          const node = tree[name]();
          if (node) {
            key = node;
            return true;
          }
        });
      }
      return key;
    }
    // 设置source列表，用于后续获取parser对象
    const sourceMap = {
      // 当前父级parser节点
      $parentCtx: parentCtx,
    };
    const fieldMap = treeList.reduce((map, tree) => {
      // 获取beansDescription的数据，beansDescription有key和value两个tree组装
      let key = _getValue(tree, keyList);
      if (!key) return map;
      let value = _getValue(tree, valueNameList);
      if (key && value) {
        // 设置parser对象，用于错误处理
        sourceMap[key] = value;
        key = this._resetCharts(key.getText ? key.getText() : key.text);
        value = this._resetCharts(value.getText ? value.getText() : value.text);
        // 将该组数据添加到DataSource
        map[key] = value;
      }
      return map;
    }, {});
    return {
      sourceMap, // parser对象
      fieldMap, // 处理的key=》value对象
    };
  }

  /**
   * 对字符串和数值数据进行处理
   * @param {string} str 要处理的字符串
   * @param {string} strWarpper 字符串包围符号
   */
  _resetCharts(str, strWarpper = "") {
    const isString = str.match(/(["'])([^"']*)\1/);
    const isNumber = str.match(
      /^[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/
    );
    const isArray = str.match(/^\[|\]$/);
    // 判断是数组格式，处理数组合适
    if (isArray) {
      const strArr = str.replace(/^\[|\]$/g, "");
      let res = [];
      if (strArr) {
        res = strArr
          .split(",")
          .map((item) => this._resetCharts(item, strWarpper));
      }
      return res;
    } else if (isString && isString[2]) {
      str = `${strWarpper}${isString[2]}${strWarpper}`;
    } else if (isNumber) {
      str = Number(str);
    }
    return str;
  }
  /**
   * 重置当前listener，主要用于外部使用单例listener
   */
  reset() {
    this.currentAnalysisIsAble = true;
    this.analysisList = [];
    this.lastParent = undefined;
    this.existList = {};
    this.id = 0;
  }
  /**
   * 获取数据的id,并将数据插入队列
   * @param {Object} data 要获取id和pid的数据
   * @param {object[]} ctx visitor 访问parser树上下文对象
   * @param {object|array} parserErrorList 解析parser对象，用于错误定位
   */
  _pushList(data, ctx, parserErrorList) {
    // 过滤多余属性数据
    const keepData = Object.entries(data).filter(
      ([key]) => $visitorFilterField.indexOf(key) === -1
    );
    const str = JSON.stringify(keepData);
    let id = this.existList[str];
    // 判断source数据且存在相同的情况时，判断如果上次数据源和这次不同，则不相同
    if (id && data.type === "source") {
      const lastDs = Object.entries(this.lastDatasource).filter(
        ([key]) => $visitorFilterField.indexOf(key) === -1
      );
      if (str !== JSON.stringify(lastDs)) {
        id = undefined;
      }
    }
    if (id) {
      // 如果缓存id存在，直接获取id
      // data.key = id
      // 直接使用历史数据(尽量使用缓存中的数据，避免相同key值，由于语句过多导致过多对象被引用而浪费空间， @note: 需要对每个动作variableList数据进行处理，避免使用父级数据的variableList)
      const existArr = this.analysisList.filter((item) => item.key === id);
      if (existArr && existArr.length) {
        data = existArr[0];
      }
    } else {
      // 如果缓存不存在，添加缓存,并且推入数据列表
      data.key =
        data.pId === "0"
          ? `${++this.id}`
          : `${this.lastParent.key}_${
              this.analysisList.filter(
                (item) => item.pId === this.lastParent.key
              ).length + 1
            }`; // 不能使用时间戳，某些节点会在相同时间创建
      this.existList[str] = data.key;
      this.analysisList.push(data);
      // 对该数据进行校验
      this.validate.valid(
        data,
        this.lastParent,
        ctx,
        parserErrorList,
        this.excuteErrorList
      );
    }
    // 记录父级数据
    this.lastParent = data;
    // 记录最新一次的DataSource数据
    data.type === "source" && (this.lastDatasource = data);
  }

  /**
   * 把返回的数据集转换成Tree
   * @param {array<object>} list 要转换的数据集
   * @param {string} id 子集标记id
   * @param {string} pid parent标记字段
   * @param {string} child 子集生成对象name
   * @param {string} root顶级节点的id
   */
  listToTree(list, id = "key", pid = "pId", child = "children", root = "0") {
    // 创建Tree
    const tree = [];
    if (Array.isArray(list)) {
      // 创建基于主键的数组引用
      var refer = {};
      list.forEach((data) => {
        refer[data[id]] = data;
      });
      list.forEach((data) => {
        // 判断是否存在parent
        var parentId = data[pid];
        if (root === parentId) {
          tree.push(data);
        } else {
          if (typeof refer[parentId] !== "undefined") {
            var parent = refer[parentId];
            if (typeof parent[child] === "undefined") {
              parent[child] = [];
            }
            parent[child].push(data);
          }
        }
      });
    }
    return tree;
  }
}

export default Vistor;
