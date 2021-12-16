/**
 * 获取当前元素的样式
 * @param {object<node>} dom dom元素
 * @param {string} attr dom样式名
 */
export function getDomStyle(dom, attr) {
  // 判断dom是否为dom节点元素
  if (
    !(
      dom &&
      typeof dom === "object" &&
      dom.nodeType === 1 &&
      typeof dom.nodeName === "string"
    )
  ) {
    return;
  }
  // 将属性转成小驼峰
  attr = attr.replace(/-(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
  // 主流浏览器
  if (getComputedStyle) {
    return getComputedStyle(dom, null)[attr];
  } else if (dom.currentStyle) {
    if (attr === "float") {
      return dom.currentStyle.getAttribute("styleFloat");
      // 取高宽使用 getBoundingClientRect
    } else if (
      (attr === "width" || attr === "height") &&
      dom.currentStyle[attr] === "auto"
    ) {
      let clientRect = dom.getBoundingClientRect();
      return clientRect[attr] + "px";
    }
    // 其他样式，无需特殊处理
    return dom.currentStyle.getAttribute(attr);
  }
}

/**
 * 提取html内容 如：span style=\"00DB00\">192.168.200.90</span>
 * @param content
 * @returns {*}
 */
export function extractHtmlContent(content) {
  let extractReg = /<.*?>(.+)<\/.*?>/;
  let extractAry = extractReg.exec(content);
  // 匹配不成功 192.168.200.90
  if (!extractAry) {
    return content;
  }
  return extractAry[1];
}

/**
 * 获取css global变量
 * @param {string} name 变量名称
 * @returns {string}
 */
export function getRootPropertyValue(name) {
  let rootStyles;
  if (getComputedStyle) {
    rootStyles = getComputedStyle(document.body);
  } else if (document.body.currentStyle) {
    rootStyles = document.body.currentStyle;
  }
  return rootStyles.getPropertyValue(name);
}
