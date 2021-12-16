/**
 * 操作 animate.css
 *
 * */
function animateCSS(node, animationName, callback) {
  node.classList.add("animated", "fast", animationName);

  function handleAnimationEnd() {
    node.classList.remove("animated", "fast", animationName);
    node.removeEventListener("animationend", handleAnimationEnd);

    if (typeof callback === "function") callback();
  }

  node.addEventListener("animationend", handleAnimationEnd);
}

/**
 * 深拷贝
 * @param {Object} obj 要拷贝的对象
 */
function deepClone(obj = {}) {
  if (typeof obj !== "object" || obj == null) {
    // obj 是 null ，或者不是对象和数组，直接返回
    return obj;
  }

  // 初始化返回结果
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }

  for (let key in obj) {
    // 保证 key 不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 递归调用！！！
      result[key] = deepClone(obj[key]);
    }
  }

  // 返回结果
  return result;
}

// 时间格式化
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

const compareObjects = (arr1, arr2) => {
  if (Array.isArray(arr1) && Array.isArray(arr2)) {
    // a man's array does not look like a girl's array
    if (arr1.length !== arr2.length) return false;
  }

  const keys = Object.keys(arr1);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(arr1[key])) {
      if (Array.isArray(arr2[key])) {
        // a man has an array, a girl has a different array
        if (!compare(arr1[key], arr2[key])) return false;
        // a man may share an array with a girl
        continue;
      }
      // a man has an array, a girl does not
      return false;
    }

    // account for date objects
    if (arr1[key] instanceof Date) {
      if (arr2[key] instanceof Date) {
        if (arr1[key].valueOf() !== arr2[key].valueOf()) return false;
        continue;
      }
      return false;
    }

    // account for regexp
    if (arr1[key] instanceof RegExp) {
      if (arr2[key] instanceof RegExp) {
        if (arr1[key].toString() !== arr2[key].toString()) return false;
        continue;
      }
      return false;
    }

    if (typeof arr1[key] === "object") {
      if (typeof arr2[key] === "object" && !Array.isArray(arr2[key])) {
        // a man has an object, a girl has a different object
        if (!compare(arr1[key], arr2[key])) return false;
        continue;
      }
      // a man has an object, a girl does not
      return false;
    }
    // a man has values that a girl does not share
    if (arr1[key] !== arr2[key]) return false;
  }

  return true;
};

const compare = (a, b) => {
  if (
    a &&
    b &&
    ((Array.isArray(a) && Array.isArray(b)) ||
      (typeof a === "object" && typeof b === "object")) &&
    a.length === b.length
  ) {
    return compareObjects(a, b);
  }
  return false;
};

const equals = compare;

function isNumber(val) {
  let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  return regPos.test(val) || regNeg.test(val);
}

// 去除pageType前缀，并符合 api 请求所需的形式(anomaly)
function getRealPageType(pageType) {
  if (pageType === "detail-user-group") {
    return "userGroup";
  }
  if (pageType === "detail-device-group") {
    return "deviceGroup";
  }
  let arr = pageType.split("-");
  let len = arr.length;
  let res = arr[len - 1];
  if (res === "exception") {
    res = "anomaly";
  }
  return res;
}

export { deepClone, animateCSS, dateFormat, isNumber, getRealPageType, equals };
