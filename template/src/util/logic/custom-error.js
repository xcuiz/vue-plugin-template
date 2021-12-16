import { ConsoleErrorListener } from "antlr4/error/ErrorListener";
import RouteParser from "./parser/RouteParser";
import { Token } from "antlr4/Token";
// 逻辑分析动作构造函数
const logicTypes = [
  RouteParser.DataSourceContext,
  RouteParser.AggregateContext,
  RouteParser.VariableContext,
  RouteParser.FilterContext,
  RouteParser.SortContext,
  RouteParser.ExhibitContext,
];
class LogicErrorListener extends ConsoleErrorListener {
  errorList = [];
  constructor() {
    super();
  }
  /**
   * 接受错误处理
   * @param {number} line 行号
   * @param {number} column 列号
   * @param {string} msg 错误消息
   */
  syntaxError(recognizer, offendingSymbol, line, column, msg) {
    // 标记错误的文本
    const markText = offendingSymbol
      ? this.getTokenErrorDisplay(offendingSymbol)
      : "";
    msg = this._getCnText(msg);
    const error = {
      row: line - 1,
      column: column,
      markText,
      text: msg,
      type: "error",
    };
    // 为原生g4错误反馈给上级
    let parent = recognizer._ctx ? recognizer._ctx.parentCtx : undefined;
    // 判断当前ctx为基础动作中的任意一个构造函数的实例DataSourceContext、AggregateContext、VariableContext、FilterContext、SortContext、ExhibitContext
    while (parent && logicTypes.indexOf(parent.constructor) === -1) {
      parent = parent.parentCtx;
    }
    // 为祖级parsertree添加属性，用于为json流程图中获取到原生错误
    if (
      parent &&
      !parent.nativeError &&
      logicTypes.indexOf(parent.constructor) > -1
    ) {
      parent.nativeError = error;
    }
    // 将错误添加到错误列表
    this.errorList.push(error);
  }
  // 用于获取antlr4中错误定位对应的文本
  // https://github.com/antlr/antlr4/blob/98dc2c0f0249a67b797b151da3adf4ffbc1fd6a1/runtime/JavaScript/src/antlr4/error/ErrorStrategy.js#L554
  getTokenErrorDisplay(t) {
    if (t === null) {
      return "<no token>";
    }
    var s = t.text;
    if (s === null) {
      if (t.type === Token.EOF) {
        s = "<EOF>";
      } else {
        s = `<${t.type}>`;
      }
    }
    return this.escapeWSAndQuote(s);
  }
  // https://github.com/antlr/antlr4/blob/98dc2c0f0249a67b797b151da3adf4ffbc1fd6a1/runtime/JavaScript/src/antlr4/error/ErrorStrategy.js#L569
  escapeWSAndQuote(s) {
    s = s.replace(/\n/g, "\\n");
    s = s.replace(/\r/g, "\\r");
    s = s.replace(/\t/g, "\\t");
    return s;
  }

  /**
   * 清除错误列表，方便使用单例模式
   * @param {array} excuteErrorList 额外执行的错误列表
   */
  reset(excuteErrorList = []) {
    this.errorList = [...excuteErrorList];
  }
  /**
   * 将antlr4的英文错误转化为中文
   * @fixme antlr4 不支持国际化，只能暂时处理
   */
  _getCnText(text) {
    return text
      .replace(
        /(^|\b)(token recognition error|no viable alternative at input|mismatched|input|expecting|Identifier|missing|at|extraneous|rule)($|\b)/g,
        function ($0, $1, $2) {
          switch ($2) {
            case "token recognition error":
              return "令牌识别错误";
            case "no viable alternative at input":
              return "在输入时没有可行的替代方案";
            case "mismatched":
              return "不匹配的";
            case "input":
              return "输入";
            case "expecting":
              return "期望";
            case "Identifier":
              return "标志符";
            case "missing":
              return "丢失";
            case "at":
              return "在";
            case "extraneous":
              return "无关的";
            case "rule":
              return "规则";
          }
        }
      )
      .replace(/\s/g, "");
  }
}

export default LogicErrorListener;
