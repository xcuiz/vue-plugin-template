import ace from "ace-builds";
import { snippetText } from "../config";
export default function () {
  // 添加逻辑片段
  ace.define(
    "ace/snippets/logic",
    ["require", "exports", "module"],
    (require, exports) => {
      exports.snippetText = snippetText;
      exports.scope = "logic";
    }
  );
}
