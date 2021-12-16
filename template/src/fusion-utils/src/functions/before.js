/**
* 在 fn 函数前执行 beforefn 函数
*/
export const before = function (fn, beforefn) {
  return function () {
    if (beforefn.apply(this, arguments) === false) {
      return
    }
    return fn.apply(this, arguments)
  }
}
