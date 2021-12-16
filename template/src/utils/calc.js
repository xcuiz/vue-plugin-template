/*
 * @Author: your name
 * @Date: 2020-10-14 15:38:28
 * @LastEditTime: 2020-10-14 15:49:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/utils/calc.js
 */
/**
 *
 * @param {Array} tree 树结构list
 * @param {Function} func 条件函数  return boolean值的函数
 * @returns {Object} 返回的树节点
 */
const treeFind = (tree, func) => {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.children) {
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return null;
};
export { treeFind };
