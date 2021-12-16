
/**
* 在 fn 函数执行后执行 afterfn 函数
*/
export const after = function (fn, afterfn) {
  return function () {
    // 原函数执行，这里不考虑异步
    let result = fn.apply(this, arguments)
    afterfn.apply(this, arguments)
    return result
  }
}
