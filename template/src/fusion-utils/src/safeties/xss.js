import xss from 'xss'

/**
 * 防止xss攻击
 * 约定规则，如果需要渲染的标签全部以：identifier（idss-）标签名为标记
 */
export const $xss = function (source, identifier = 'idss-') {
  return xss(source, {
    onTag (tag, html, options) {
      if (tag.startsWith(identifier)) {
        return html.replace(new RegExp(`${identifier}(.*)`, 'g'), '$1')
      } else {
        return xss.escapeHtml(html)
      }
    }
  })
}
