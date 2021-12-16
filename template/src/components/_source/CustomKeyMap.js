import CodeMirror from "codemirror/lib/codemirror";
import { request } from "@/plugin/request";

const cmds = CodeMirror.commands;
var keyMap = CodeMirror.keyMap;

/**
 * 当前行和下一行内容交换
 * @param {*} cm
 */
cmds.changeDown = (cm) => {
  cm.operation(function () {
    const { line: lineNumber, ch } = cm.getCursor();
    const allLine = cm.lineCount();

    if (lineNumber === allLine - 1) {
      return;
    }

    const nextLineNumber = lineNumber + 1;

    const currentLine = cm.getLine(lineNumber);
    const nextLine = cm.getLine(nextLineNumber);

    const currentLineLength = currentLine.length;
    const nextLineLength = nextLine.length;

    cm.replaceRange(
      currentLine,
      { line: nextLineNumber, ch: 0 },
      { line: nextLineNumber, ch: nextLineLength }
    );
    cm.replaceRange(
      nextLine,
      { line: lineNumber, ch: 0 },
      { line: lineNumber, ch: currentLineLength }
    );
    cm.setCursor({ line: nextLineNumber, ch });
  });
};

/**
 * 当前行和上一行内容交换
 * @param {*} cm
 */
cmds.changeUp = (cm) => {
  cm.operation(function () {
    const { line: lineNumber, ch } = cm.getCursor();

    if (lineNumber === 0) {
      return;
    }

    const prevLineNumber = lineNumber - 1;

    const currentLine = cm.getLine(lineNumber);
    const prevLine = cm.getLine(prevLineNumber);

    const currentLineLength = currentLine.length;
    const prevLineLength = prevLine.length;

    cm.replaceRange(
      currentLine,
      { line: prevLineNumber, ch: 0 },
      { line: prevLineNumber, ch: prevLineLength }
    );
    cm.replaceRange(
      prevLine,
      { line: lineNumber, ch: 0 },
      { line: lineNumber, ch: currentLineLength }
    );
    cm.setCursor({ line: prevLineNumber, ch });
  });
};

/**
 * 复制当前行到下一行
 * @param {*} cm
 */
cmds.addLineByUp = (cm) => {
  cm.operation(function () {
    const { line: lineNumber, ch } = cm.getCursor();

    const currentLine = cm.getLine(lineNumber);
    const len = currentLine.length;

    cm.setCursor({ line: lineNumber, ch: len });

    cm.execCommand("newlineAndIndent");

    const nextLineNumber = lineNumber + 1;
    const nextLineLength = len;

    cm.replaceRange(
      currentLine,
      { line: nextLineNumber, ch: 0 },
      { line: nextLineNumber, ch: nextLineLength }
    );
    cm.setCursor({ line: lineNumber, ch });
  });
};

/**
 * 复制当前行到上一行
 * @param {*} cm
 */
cmds.addLineByDown = (cm) => {
  cm.operation(function () {
    const { line: lineNumber, ch } = cm.getCursor();

    const currentLine = cm.getLine(lineNumber);
    const len = currentLine.length;

    cm.setCursor({ line: lineNumber, ch: len });

    cm.execCommand("newlineAndIndent");

    const nextLineNumber = lineNumber + 1;
    const nextLineLength = len;

    cm.replaceRange(
      currentLine,
      { line: nextLineNumber, ch: 0 },
      { line: nextLineNumber, ch: nextLineLength }
    );
    cm.setCursor({ line: nextLineNumber, ch });
  });
};

/**
 * 自定义格式化
 */
cmds.formatGpl = async (cm) => {
  const gpl = cm.getValue();
  const result = await request({
    url: "/gov/api/insight/anomalyModel/format",
    method: "POST",
    data: {
      gpl,
    },
  });

  cm.setValue(result);
};

keyMap.pcGpl = {
  "Alt-Down": "changeDown",
  "Alt-Up": "changeUp",
  "Shift-Alt-Up": "addLineByUp",
  "Shift-Alt-Down": "addLineByDown",
  "Shift-Alt-L": "formatGpl",
};

CodeMirror.normalizeKeyMap(keyMap.pcGpl);

keyMap.macGpl = {
  "Cmd-Down": "changeDown",
  "Cmd-Up": "changeUp",
  "Shift-Cmd-Up": "addLineByUp",
  "Shift-Cmd-Down": "addLineByDown",
  "Shift-Cmd-L": "formatGpl",
};

CodeMirror.normalizeKeyMap(keyMap.macGpl);

var mac = keyMap.default === keyMap.macDefault;
keyMap.gpl = mac ? keyMap.macGpl : keyMap.pcGpl;
