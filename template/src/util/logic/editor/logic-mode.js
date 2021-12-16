import ace from "ace-builds";
import langTools from "ace-builds/src-noconflict/ext-language_tools";
import { logicTypesConfig } from "../config";
/**
 * 获取mode
 * @param {array} filedList 字段名
 */
export function getMode(filedList = []) {
  // 获取当前可用动作
  const filterType = Object.keys(logicTypesConfig);
  const filedNameList = filedList.reduce((arr, item) => {
    arr.push(item.field);
    return arr;
  }, []);
  // 高亮配置处理
  ace.define(
    "ace/mode/logic_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (acequire, exports) {
      const oop = acequire("../lib/oop");
      const TextHighlightRules = acequire("./text_highlight_rules")
        .TextHighlightRules;
      const MyHighlightRules = function () {
        const keywordMapper = this.createKeywordMapper(
          {
            "entity.name.tag": filedNameList.join("|"),
            "storage.type": "analysis",
            "keyword.operator": "+|-|=|>|<|<=|>=|like",
            "support.other": "|",
            "paren.lparen": "[|{",
            "paren.rparen": "]|}",
            "variable.language": filterType.join("|"),
          },
          "identifier",
          false
        );
        // @HACK 重置关键字，将自动补全的关键字模块处理掉
        // https://github.com/ajaxorg/ace/blob/9b5b63d1dc7c1b81b58d30c87d14b5905d030ca5/lib/ace/mode/text_highlight_rules.js#L225
        this.$keywordList = [];
        this.$rules = {
          start: [
            { token: "string", regex: `(["'])(?:(?:\\\\.)|(?:[^"\\\\]))*?\\1` },
            { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            {
              token: "keyword.operator",
              regex: "!|%|\\\\|/|\\*|\\-|\\+|~=|==|<>|!=|<=|>=|=|<|>|&&|\\|\\|",
            },
            { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\|\\." },
            { token: "paren.lparen", regex: "[[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { token: "text", regex: "\\s+" },
            { token: keywordMapper, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
          ],
        };
      };
      oop.inherits(MyHighlightRules, TextHighlightRules);
      exports.MyHighlightRules = MyHighlightRules;
    }
  );
  // logic mode添加
  ace.define(
    "ace/mode/logic",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/logic_highlight_rules",
      "ace/worker/worker_client",
      "ace/mode/behaviour/cstyle",
      "ace/mode/folding/cstyle",
    ],
    function (require, exports) {
      const oop = require("../lib/oop");
      const TextMode = require("./text").Mode;
      const MyHighlightRules = require("./logic_highlight_rules")
        .MyHighlightRules;
      const WorkerClient = require("../worker/worker_client").WorkerClient;
      const CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
      const CStyleFoldMode = require("./folding/cstyle").FoldMode;
      const Mode = function () {
        this.HighlightRules = MyHighlightRules;
        // $behaviour 在emmet中起作用
        this.$behaviour = new CstyleBehaviour();
        // 代码收缩
        this.foldingRules = new CStyleFoldMode();
      };
      oop.inherits(Mode, TextMode);
      (function () {
        this.createWorker = function (session) {
          // 借助jsonworker来处理logic错误，因为json会一直抛错
          var worker = new WorkerClient(
            ["ace"],
            "ace/mode/json_worker",
            "JsonWorker"
          );
          worker.attachToDocument(session.getDocument());
          // 错误接受数据处理
          // worker.on('annotate', function (results, worker) {
          //   // const input = worker.$doc.getValue()
          //   console.log(worker)
          //   const input = worker.$doc.getValue()
          //   const annotations = logicListener.getLogicList(input, filedList).errorList
          //   session.setAnnotations(annotations)
          // })
          worker.on("terminate", function () {
            session.clearAnnotations();
          });
          return worker;
        };
        this.$id = "ace/mode/logic";
      }.call(Mode.prototype));
      exports.Mode = Mode;
    }
  );
  // 添加自动补全
  langTools.addCompleter({
    getCompletions(editor, session, pos, prefix, callback) {
      // 自动补全列表
      const autoList = filedNameList.map((field) => ({
        name: field,
        value: field,
        score: 0,
        meta: "字段",
      }));
      // 动作类型添加
      autoList.push(
        ...filterType.map((item) => ({
          name: item,
          value: item,
          score: 1,
          meta: "动作",
        }))
      );
      autoList.push({
        name: "analysis",
        value: "analysis",
        score: 1,
        meta: "分析",
      });
      if (prefix.length === 0) {
        callback(null, []);
        return;
      }
      // 将字段名称添加进自动补全
      callback(null, autoList);
    },
  });
}
