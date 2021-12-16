import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import { getMode } from "./logic-mode.js";
import snippet from "./logic-snippets";
/**
 * 设置mode，传入业务参数数据
 * @param {array} filedList 字段名
 * @param {array} ctx 错误数据对象上下文
 */
export function setEditorMode(filedList) {
  ace.config.setModuleUrl("ace/snippets/logic", snippet());
  ace.config.setModuleUrl("ace/mode/logic", getMode(filedList));
}
