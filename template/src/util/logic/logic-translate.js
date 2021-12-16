// 定义logic显示语言包
import { logicTypesConfig, $errorLang } from "./config";

/**
 * 显示自定义类型展示的文本
 * @param {string} type logic 类型
 * @param {object|array} data data数据
 */
export function getShowText(type, data) {
  if (!type) return;
  let value;
  switch (type) {
    case "source": {
      // 处理数据类型
      const { sourceType, timeType } = data;
      // 事件数据和自选数据类型区分
      const langType =
        sourceType === "event"
          ? `source_${sourceType}`
          : `source_${sourceType}_${timeType}`;
      return translate("logic", langType, data);
    }
    // 展示数据类型的处理
    case "exhibit":
      return translate("logic", type, [
        logicTypesConfig.exhibit.types[data.value],
      ]);
    case "sort": {
      // 处理排序条件
      const { sortStat } = data;
      data.sort = logicTypesConfig.sort.sortType[sortStat];
      return translate("logic", "sort", data);
    }
    case "variable":
      // 处理标记变量
      value = data.value;
      return translate(
        "logic",
        `variable`,
        value
          .filter((item) => item.name)
          .reduce(
            (list, item, index) => {
              list[0] += `${index > 0 ? "," : ""}$${item.name}`;
              return list;
            },
            [""]
          )
      );
    default:
      return translate("logic", ...arguments);
  }
}
/**
 * 获取逻辑动作配置错误，配置错误的文字提示
 * @param {object} error error对象
 */
export function getErrorText(error) {
  if (!error) return;
  let textArr = [];
  Object.entries(error).forEach(([key, value]) => {
    textArr.push(translate("error", key, value));
  });
  return textArr.join(`<br>`);
}
/**
 * 编辑器逐行显示错误信息
 * @param {string} type 错误类型
 * @param {string|array} value 要显示的错误值
 */
export function getSingleErrorText(type, value) {
  if (!type) return;
  if (!Array.isArray(value)) {
    value = [value];
  }
  return translate("error", type, value);
}
/**
 * 文本替换方法
 * @param {string} type 要替换的logic 类型
 * @param {string} translateType 需要翻译的类型 logic => 默认逻辑操作显示文本 error => 错误显示文本
 * @param {any} args 接受的其他形参
 * @example translate('groupby', {type: 'groupby', value: [1,3,5]}) => 分类统计，根据"1，3,5"字段
 */
export function translate(translateType = "logic", type, ...args) {
  let str = "";
  if (translateType === "logic") {
    // souce数据源和其他动作区分
    const $lang =
      args[0].type === "source"
        ? logicTypesConfig.source[type]
        : logicTypesConfig[type];
    str = $lang && $lang.lang ? $lang.lang : false;
  } else if (translateType === "error") {
    str = $errorLang[type];
  }
  if (!str) return;
  // 形参处理
  if (args.length === 1 && typeof args[0] === "object") {
    args = args[0];
  } else {
    args = {};
  }
  if (!args || !args.hasOwnProperty) {
    args = {};
  }
  let RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;
  return str.replace(RE_NARGS, (match, prefix, i, index) => {
    let result = "";
    if (str[index - 1] === "{" && str[index + match.length] === "}") {
      return i;
    } else {
      result = args.hasOwnProperty(i) ? args[i] : match;
      if (!result) {
        return "";
      }
      return result;
    }
  });
}
