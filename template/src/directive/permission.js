import store from "@/store";

export default {
  name: "permission",
  /**
   * bingdiung.arg 模块名称
   * bingdiung.modifiers 对应的使用权限项。理论上只能传递下面中的一个权限
   * {
   *  get
   *  post
   *  put
   *  delete
   * }
   * @param {*} el
   * @param {*} bingdiung
   */
  hooks: {
    inserted(el, binding) {
      // 模块名称
      const moduleName = binding.value || binding.arg;
      // 具体方法
      const modifiers = binding.modifiers;
      const permit = getPermission(moduleName);
      let hasPermit = false;

      let curModifierPermit = permit[Object.keys(modifiers)[0]];
      // 注意这里有false的情况，需要和undefined界分
      if (curModifierPermit !== undefined) {
        hasPermit = curModifierPermit;
      }

      // !hasPermit && (el.parentNode && el.parentNode.removeChild(el))
      if (!hasPermit) {
        // el.style.display = 'none' // 避免 el.parentNode 为 null 时，
        el.parentNode && el.parentNode.removeChild(el);
      }
    },
  },
};

/**
 * 将10进制解析为2进制表示。
 * e.g
 *  15 => 1111
 *  5 => 0101
 * 转换为2进制后 始终会保持4位长度。
 *
 * 从右至左数！！！转换后的二进制字符串与权限的关系表示:
 * 第1位代表查询
 * 第2位代表添加
 * 第3位代表更新
 * 第4位代表删除
 *
 * 0 代表没有权限，1代表有权限。所以根据对应的位置上的01就可以获取对应的权限
 *
 * e.g
 * 0001 (前三位是0最后一位是1) 表示只拥有读的权限
 * 0011 表示拥有查询和增加的权限
 * @param {*} perm
 */
function resolvePerm(perm) {
  // 将10进制转换为 2 进制的权限表示
  const binaryPermission = perm.toString(2).padStart(4, "0");
  return {
    get: !!+binaryPermission[3],
    post: !!+binaryPermission[2],
    put: !!+binaryPermission[1],
    delete: !!+binaryPermission[0],
  };
}

/**
 * 根据模块名称在 vuex 中获取对应的权限
 * @param {*} moduleName
 */
export function getPermission(moduleName) {
  const permissionMap = store.state.permission.permission;
  if (permissionMap[moduleName]) {
    return resolvePerm(permissionMap[moduleName]);
  } else {
    return {
      get: false,
      post: false,
      put: false,
      delete: false,
    };
  }
}
