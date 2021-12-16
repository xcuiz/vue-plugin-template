/*
 * @Author: your name
 * @Date: 2020-05-20 13:55:20
 * @LastEditTime: 2020-05-29 16:42:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/dolphinScheduler/fileManagement/pages/file/pages/_source/common.js
 */
/**
 * Create file type
 */
let filtTypeArr = [
  "txt",
  "log",
  "sh",
  "conf",
  "cfg",
  "py",
  "java",
  "sql",
  "xml",
  "hql",
  "properties",
];

const handlerSuffix = {
  ".txt": "textile",
  ".log": "textile",
  ".sh": "shell",
  ".conf": "textile",
  ".cfg": "textile",
  ".py": "python",
  ".java": "textile",
  ".sql": "sql",
  ".hql": "sql",
  ".xml": "xml",
  ".properties": "textile",
};
export { filtTypeArr, handlerSuffix };
