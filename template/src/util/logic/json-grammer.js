// 在json书中需要过滤的字段
import { $filterHideFiled } from "./config";
import { checkValueIsEmpty } from "./util";
/**
 * 获取逻辑语法
 * @param {array<object>} list json树
 */
export default function getLogicGrammar(list) {
  // 获取所有逻辑语句
  const logicList = jsonToLogic(list);
  // 添加尾部结束标志
  const endText = "]";
  if (logicList && logicList.length) {
    return logicList
      .map((item) => {
        // 补全尾部标志
        item += endText;
        return item;
      })
      .join("\n\n");
  }
  return "";
}
/**
 * 将json树转logic语句
 * @param {array<object>} list json树
 * @param {string} prefix 文本前缀
 * @param {array} list 要返回的逻辑语句
 */
function jsonToLogic(data = [], prefix = "analysis[", list = []) {
  return data.reduce((list, item) => {
    const { type } = item;
    const text = `${prefix}${type === "source" ? "" : "|"}${getText(item)}`;
    if (item.children && item.children.length) {
      jsonToLogic(item.children, text, list);
    } else {
      list.push(text);
    }
    return list;
  }, list);
}

/**
 * 获取相应的文本
 * @param {object} data
 */
function getText(data) {
  const { type } = data;
  switch (type) {
    case "source":
      return _sourceSet(data);
    case "groupBy":
      return _groupBySet(data);
    case "filter":
      return _filterSet(data);
    case "sort":
      return _sortSet(data);
    case "exhibit":
      return _exhibitSet(data);
    case "variable":
      return _variableSet(data);
    default:
      return "";
  }
}

/**
 * 处理Source
 * @param {object} data
 * source:{id="dcdcdsc",startTime=1551024000000,endTime=1551110400000}
 */
function _sourceSet(data) {
  let text = "source:{\n";
  Object.entries(data)
    .filter(([key]) => $filterHideFiled.indexOf(key) === -1)
    .forEach(([key, value], index) => {
      if (!checkValueIsEmpty(value, ["array"])) {
        text += `${index !== 0 ? ",\n" : ""}${key}=${_getCharts(value, `"`)}`;
      }
    });
  text += "\n}";
  return text;
}

/**
 * 处理groupby
 * @param {object} data
 * groupBy:  name ,create_time
 */
function _groupBySet(data) {
  let text = "groupBy:";
  if (data.value && data.value.length) {
    text += "[";
    data.value.forEach((value, index) => {
      text += `${index !== 0 ? "," : ""}${_getCharts(value, `"`)}`;
    });
    text += "]";
  }
  return text;
}

/**
 * 处理filter
 * @param {object} data
 * filter_low:severity="low" filter_high:severity="low"
 */
function _filterSet(data) {
  const text = `filter:${data.value || ""}`;
  return text;
}

/**
 * 处理sort
 * @param {object} data
 * sort: +create_time
 */
function _sortSet(data) {
  const text = `sort:${data.sortStat || ""}${data.field || ""}`;
  return text;
}

/**
 * 处理exhibit
 * @param {object} data
 * exhibit:{ topN = 5}
 */
function _exhibitSet(data) {
  let text = `exhibit:${data.value || ""}`;
  return text;
}

/**
 * 处理variable 标记变量
 * variable:'variable:['varia(','varia)*']';
 * varia:'{name='name=keyLiteral',field='field=keyLiteral',line='line=('top'|'last')intLiteral',value='value=keyLiteral '}';
 */
function _variableSet(data) {
  let text = `variable:[`;
  // 判读是否除line属性以外的其他属性
  let isHasProp = false;
  data.value.forEach((item, i) => {
    text += `{\n`;
    Object.entries(item)
      .filter(
        ([name, value]) =>
          !checkValueIsEmpty(value) && name !== "line" && name !== "type"
      )
      .forEach(([name, value], index) => {
        // 变量需要对line和type属性合并为一个
        text += `${index === 0 ? "" : ",\n"}${name}=${_getCharts(value, `"`)}`;
        isHasProp = true;
      });
    // 合并line和type属性
    if (item.line || item.type) {
      text += `${isHasProp ? ",\n" : ""}line="${_getCharts(
        item.type
      )}${_getCharts(item.line)}"`;
    }
    text += `\n}${i !== data.value.length - 1 ? ",\n" : ""}`;
  });
  text += "]";
  return text;
}
/**
 * 对字符串和数值数据进行处理
 * @param {string} str 要处理的字符串
 * @param {string} strWarpper 字符串包围符号
 */
function _getCharts(str, strWarpper = "") {
  // 处理字符串
  if (typeof str === "string") {
    if (str.match(/[a-zA-Z_]?/)) {
      str = `${strWarpper}${str.replace(/^"|"$/g, "")}${strWarpper}`;
    }
  } else if (Array.isArray(str)) {
    // 处理数组
    str = `[${str.map((item) => _getCharts(item, strWarpper))}]`;
  } else if (typeof str === "undefined") {
    str = "";
  }
  return str;
}
