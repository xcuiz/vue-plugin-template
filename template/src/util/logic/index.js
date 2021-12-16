import antlr4 from "antlr4/index";
import RouteLexer from "./parser/RouteLexer";
import RouteParser from "./parser/RouteParser";
import Visitor from "./visitor.js";
import LogicErrorListener from "./custom-error";
export default class LogicList {
  // lexerErrorListener = new LogicErrorListener()
  // 自定义错误监听实例，监听全局语句（默认和自定义）错误
  parserErrorListener = new LogicErrorListener();
  parseTreeWalker = new antlr4.tree.ParseTreeWalker();
  /**
   * 通过string获取分析逻辑的map tree结构
   * @param {string} input 逻辑语句
   * @param {array} fieldsList 字段列表
   * @param {array} excuteErrorList 外部接口执行错误对象列表
   * @param {array} globalVars 全局变量
   */
  getLogicList({
    input = "",
    fieldsList = [],
    excuteErrorList = [],
    globalVars = [],
  }) {
    const chars = new antlr4.InputStream(input);
    const lexer = new RouteLexer(chars);
    lexer.removeErrorListeners();
    // 重置错误监听
    // lexerErrorListener.reset()
    // 将外部接口执行错误对象列表 添加到错误列表
    this.parserErrorListener.reset(excuteErrorList);
    // 添加监听错误
    lexer.addErrorListener(this.parserErrorListener);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new RouteParser(tokens);
    // 删除原有错误监听
    parser.removeErrorListeners();
    // 重置错误监听
    // this.parserErrorListener.reset()
    // 添加监听错误
    parser.addErrorListener(this.parserErrorListener);
    parser.buildParseTrees = true;
    // 获取解析树，analysises为logic中g4模型中定义入口
    const tree = parser.analysises();
    // 重置visitor
    // printer.reset()
    // 开始解析g4模型定义的各个动作，同时将执行错误放到解析中
    const printer = new Visitor({ fieldsList, excuteErrorList, globalVars });
    this.parseTreeWalker.walk(printer, tree);
    // 获得antlr4 解析的list分析语句
    // this.list = printer.treeList
    // this.errorList = this.parserErrorListener.errorList
    const res = {
      input,
      list: printer.treeList,
      analysisList: printer.analysisList,
      errorList: this.parserErrorListener.errorList,
      excuteErrorList,
    };
    return res;
  }
}
