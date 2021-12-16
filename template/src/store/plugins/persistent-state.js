/**
 * 持久化插件 约定types以"$$"结尾的，需要持久化到localStorage
 * Created by ligang on 2018/6/1.
 */

const identifier = "$$";

export default function (store) {
  // 当 store 初始化后调用
  store.subscribe((mutation) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    let { type, payload } = mutation;
    if (type.endsWith(identifier)) {
      if (typeof payload === "object") {
        payload = JSON.stringify(payload);
      }

      window.localStorage.setItem(type, payload);
    }
  });
}
