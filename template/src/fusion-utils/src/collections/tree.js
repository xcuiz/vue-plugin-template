/**
 * 通过父节点查找字节点
 * @param {*} tree 被查找的tree
 * @param {*} nodeId 查找tree中的node 这个是tree每个节点的唯一标识
 * @param {string} [opt={ id:'id', name: 'name', children: 'children' }] 查找tree的结构
 * @returns 返回被找到的当前节点和父节点
 */
export const searchTreeByNode = function (tree, nodeId, opt = { id: 'id', name: 'name', children: 'children' }) {
  let parentNode = null
  let node = null
  function getNode (tree, nodeId) {
    for (var i = 0; i < tree.length; i++) {
      if (node) break
      var obj = tree[i]
      // 没有就下一个
      if (!obj) {
        continue
      }
      // 2.有节点就开始找，一直递归下去
      if (obj[opt.id] === nodeId) {
        // 找到了与nodeId匹配的节点，结束递归
        node = obj
        break
      } else {
        // 3.如果有子节点就开始找
        if (obj.children) {
          // 4.递归前，记录当前节点，作为parent 父亲
          parentNode = obj
          // 递归往下找
          getNode(obj.children, nodeId)
        } else {
          // 跳出当前递归，返回上层递归
          continue
        }
      }
    }
    // 5.如果木有找到父节点，置为null，因为没有父亲
    if (!node) {
      parentNode = null
    }
    // 6.返回结果obj
    return {
      parentNode: parentNode,
      node: node
    }
  }
  return getNode(tree, nodeId)
}
