import {
  logicTypesConfig,
  MISS_FIELDS,
  VARIABLE_VALUE_MISS_FIELDS,
  VARIABALE_NAME_DUPLICATE,
  FIELD_NOT_MATCH,
  FORMAT_ERROR,
  FILTER_QUOTE_ERROE,
  PARENT_ERROR,
  EXCUTE_ERROR,
  VARIABLE_LINE_FORMAT_ERROR,
} from "./config";
import { checkValueIsEmpty } from "./util";
import { getErrorText, getSingleErrorText } from "./logic-translate";
import token from "antlr4/Token";
const CommonToken = token.CommonToken;

/**
 * 对visitor生成的json数据进行校验
 * 校验字段缺失、某些动作值设置有误等
 * @param {object} data 需要被校验的数据
 * @param {object} parentData 父级数据
 * @param {object|array} parserList 错误处理子节点定位parser对象
 */
export default class Validate {
  data = undefined; // 需要被校验的数据
  parentData = undefined; // 父级数据
  type = undefined; // 当前被校验数据的数据类型
  ctx = undefined;

  /**
   * 内部初始化函数，内部校验函数
   * @param {object} data 当前parser解析的数据
   * @param {object} parentData 该parser节点的父级数据
   * @param {object} parserErrorList 错误处理子节点定位parser对象
   * @param {array} excuteErrorList 外部接口执行错误对象列表
   */
  valid(
    data = {},
    parentData = {},
    ctx = {},
    parserErrorList = {},
    excuteErrorList = []
  ) {
    this.data = data;
    this.type = this.data.type;
    this.parentData = parentData;
    this.ctx = ctx;
    this.parserErrorList = parserErrorList; // 错误处理子节点定位parser对象
    // 获取g4默认返回的错误
    if (this.ctx.nativeError) {
      this.data.error = {
        [FORMAT_ERROR]: this.data.key,
      };
      return this.data;
    }
    // 接口执行错误的处理
    const isExcuteErrorIndex = excuteErrorList.findIndex(
      (item) => item.key === this.data.key
    );
    if (isExcuteErrorIndex > -1) {
      this.data.error = {
        [EXCUTE_ERROR]: [excuteErrorList[isExcuteErrorIndex].text],
      };
      return this.data;
    }
    // 父级数据存在错误，导致子级继承存在错误
    if (this.parentData && this.parentData.error) {
      this.data.error = {
        [PARENT_ERROR]: this.parentData.key,
      };
      return this.data;
    }
    let missFields = this._checkRequiredField(this.data);
    let validateErrorRes; // 校验错误返回对象
    // 字段缺失校验
    if (missFields && missFields.length) {
      this.data.error = {
        [MISS_FIELDS]: [missFields.join(",")],
      };
      // 调用parser的错误提示接口（全局字段缺失，提示错误）
      this.ctx.parser.notifyErrorListeners(
        getErrorText(this.data.error),
        this.ctx.start,
        this.ctx
      );
      return this.data;
    }
    // 部分逻辑动作校验处理
    if (this.type && this[`_${this.type}Validate`]) {
      validateErrorRes = this[`_${this.type}Validate`](
        this.data,
        this.parentData
      );
    }
    // 校验错误，返回错误
    if (validateErrorRes) {
      return validateErrorRes;
    }
    // 默认返回data对象
    return this.data;
  }
  /**
   * 校验标记变量 (@TODO test)
   * @return {object|boolean} 存在错误返回对象
   */
  _variableValidate() {
    // 标记重名数据
    let duplicateNames = [];
    // 标记不匹配字段
    let unMatched = [];
    // 标记line 规则不匹配
    let unFormatLines = [];
    // 获取所有声明的标记变量名
    const allVariableList = this.data.variableList;
    // 获取对象丢失属性
    let missFields = new Set(
      this.data.value.reduce((arr, item, index) => {
        // 获取不匹配字段名（单独标记错误）
        const notMatchArr = this._checkUnMatchFields(
          item.field,
          this.parentData.tableList
        );
        if (notMatchArr && notMatchArr.length) {
          unMatched.push(...notMatchArr);
          const recognizer = this._getErorrParserObj(
            this.parserErrorList[index]["field"].start,
            item.field,
            1
          );
          this.ctx.parser.notifyErrorListeners(
            getSingleErrorText(FIELD_NOT_MATCH, item.field),
            recognizer,
            this.ctx
          );
        }

        // 获取重复标记名（单独标记错误）
        if (
          item.name &&
          allVariableList.filter((varable) => varable.name === item.name)
            .length > 1
        ) {
          duplicateNames.push(item.name);
          const recognizer = this._getErorrParserObj(
            this.parserErrorList[index]["name"].start,
            item.name,
            1
          );
          this.ctx.parser.notifyErrorListeners(
            getSingleErrorText(VARIABALE_NAME_DUPLICATE, item.name),
            recognizer,
            this.ctx
          );
        }
        // 添加必填项校验
        const missRequiredField = this._checkRequiredField(
          item,
          "variable_value"
        );
        if (missRequiredField && missRequiredField.length) {
          arr.push(...missRequiredField);
          // 在父级定位出提示错误
          this.ctx.parser.notifyErrorListeners(
            getSingleErrorText(VARIABLE_VALUE_MISS_FIELDS, missRequiredField),
            this.parserErrorList[index]["$parentCtx"].start,
            this.ctx
          );
        }
        // line 格式校验
        if (this.parserErrorList[index]["line"] && (!item.line || !item.type)) {
          const lineStr = `${item.type || ""}${item.line || ""}`;
          unFormatLines.push(lineStr);
          const recognizer = this._getErorrParserObj(
            this.parserErrorList[index]["line"].start,
            lineStr,
            1
          );
          this.ctx.parser.notifyErrorListeners(
            getSingleErrorText(VARIABLE_LINE_FORMAT_ERROR, item.line),
            recognizer,
            this.ctx
          );
        }
        return arr;
      }, [])
    );
    missFields = Array.from(missFields);
    unMatched = Array.from(new Set(unMatched));
    duplicateNames = Array.from(new Set(duplicateNames));
    // 判断字段缺失/字段不匹配/重名
    if (
      missFields.length ||
      unMatched.length ||
      duplicateNames.length ||
      unFormatLines.length
    ) {
      this.data.error = {};
      // 丢失属性校验
      missFields.length &&
        (this.data.error[VARIABLE_VALUE_MISS_FIELDS] = [missFields.join(",")]);
      // 不匹配字段校验
      unMatched.length &&
        (this.data.error[FIELD_NOT_MATCH] = [unMatched.join(",")]);
      // 重复标记名校验
      duplicateNames.length &&
        (this.data.error[VARIABALE_NAME_DUPLICATE] = [
          duplicateNames.join(","),
        ]);
      // 不匹配line格式
      unFormatLines.length &&
        (this.data.error[VARIABLE_LINE_FORMAT_ERROR] = unFormatLines);
      return this.data;
    }
  }
  /**
   * filter 输入文本格式校验 引用校验
   * @return {object|boolean} 存在错误返回对象
   */
  _filterValidate() {
    // 判断当前引用是否声明
    if (this.data.quoteList && this.data.quoteList.length) {
      const notMatchQuote = [];
      // 筛选使用引用中数据未被使用
      this.data.quoteList.forEach((quote, index) => {
        const isContainQuote = this.data.parentVariableList.some(
          (item) => `$${item.name}` === quote
        );
        // 判断当前引用未被声明
        if (!isContainQuote) {
          notMatchQuote.push(quote);
          // 获取错误对象(单独标记)
          const recognizer = this._getErorrParserObj(
            this.parserErrorList[index].symbol,
            quote
          );
          this.ctx.parser.notifyErrorListeners(
            getSingleErrorText(FILTER_QUOTE_ERROE, quote),
            recognizer,
            this.ctx
          );
        }
      });
      // 判断未被声明的变量，抛出错误
      if (notMatchQuote.length) {
        this.data.error = {
          [FILTER_QUOTE_ERROE]: [notMatchQuote.join(",")],
        };
        return this.data;
      }
    }
  }
  /**
   * sort 不匹配字段校验
   * @return {object|boolean} 存在错误返回对象
   */
  _sortValidate() {
    // 标记不匹配字段
    let unMatched = this._checkUnMatchFields(
      this.data.field,
      this.parentData.tableList
    );
    // 判断字段缺失
    if (unMatched.length) {
      this.data.error = {
        [FIELD_NOT_MATCH]: [unMatched.join(",")],
      };
      // 获取错误对象(单独标记)
      const recognizer = this._getErorrParserObj(
        this.ctx.Literal().symbol,
        this.data.field
      );
      this.ctx.parser.notifyErrorListeners(
        getSingleErrorText(FIELD_NOT_MATCH, unMatched),
        recognizer,
        this.ctx
      );
      return this.data;
    }
  }

  /**
   * groupBy 不匹配字段校验
   * @return {object|boolean} 存在错误返回对象
   */
  _groupByValidate() {
    // 标记不匹配字段
    let unMatched = this._checkUnMatchFields(
      this.data.value,
      this.parentData.tableList
    );

    // 判断字段缺失
    if (unMatched.length) {
      this.data.error = {
        [FIELD_NOT_MATCH]: [unMatched.join(",")],
      };
      // 获取错误对象
      unMatched.forEach((name) => {
        // 匹配当前索引位置
        const nameIndex = this.data.value.indexOf(name);
        // 获取错误对象(单独标记)
        const recognizer = this._getErorrParserObj(
          this.parserErrorList[nameIndex].symbol,
          name,
          1
        );
        this.ctx.parser.notifyErrorListeners(
          getSingleErrorText(FIELD_NOT_MATCH, name),
          recognizer,
          this.ctx
        );
      });
      return this.data;
    }
  }

  /**
   * 获取要展示错误的对象，用于抛出错误
   * @param {object} source 错误parser对象
   * @param {string} value 抛出错误的文本
   * @param {number} offsetIndex 偏移位置
   */
  _getErorrParserObj(source, value, offsetIndex = 0) {
    const startIndex = source.start + offsetIndex;
    const endIndex = startIndex + (value.length - 1);
    // @FIXME hack方式处理，CommonToken返回对象中，line和column总是存在bug
    const recognizer = new CommonToken(
      source.source,
      source.type,
      source.channel,
      startIndex,
      endIndex
    );
    recognizer.line = source.line;
    recognizer.column = source.column + offsetIndex;
    return recognizer;
  }
  /**
   * 校验不匹配的字段
   * @param {object|string} checkFields 需要被校验的数据
   * @param {object} legalFields 合法字段
   * @return {array} 不匹配的字段
   */
  _checkUnMatchFields(checkFields = [], legalFields = []) {
    // 判断字段传输为字符串的处理
    if (typeof checkFields === "string" && checkFields)
      checkFields = [checkFields];
    if (!checkFields || !checkFields.length) return;
    const unMatched = [];
    // 查找不匹配的字段
    checkFields.forEach((name) => {
      if (!legalFields.some((item) => item.field === name)) {
        unMatched.push(name);
      }
    });
    return unMatched;
  }
  /**
   * 校验必填属性是否存在
   * @param {object} data 需要被校验的数据
   * @param {string} subType 校验数据的子类型
   * @param {string} type 当前需要检验的数据类型
   * @return {array} 返回确实字段名的数组
   */
  _checkRequiredField(data, subType, type = this.type) {
    const res = [];
    // 判断当前类型不存在、当前数据类型不存在
    if (!type || Object.keys(logicTypesConfig).indexOf(type) === -1) return res;
    let requiredFields = [];
    // 获取所有必填项数据
    if (type === "source") {
      // 对source数据处理
      const { sourceType, timeType } = data;
      const typeName = `source${sourceType ? "_" + sourceType : ""}${
        timeType ? "_" + timeType : ""
      }`;
      requiredFields = logicTypesConfig.source[typeName].required;
    } else if (type && !subType) {
      // 非子类数据处理
      requiredFields = logicTypesConfig[type].required;
    } else if (type && subType) {
      // 子类数据处理
      requiredFields = logicTypesConfig[type][subType].required;
    }
    // 判断当前校验字段中是否满足一个不存在条件
    requiredFields.filter((name) => {
      const isNotContain =
        !data.hasOwnProperty(name) || checkValueIsEmpty(data[name]);
      if (isNotContain) {
        res.push(name);
      }
    });
    return res;
  }
}
