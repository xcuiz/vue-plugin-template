import html2canvas from 'html2canvas'
import JsPDF from './jspdf.min.js'
export default class SavePDF {
  constructor (el, fileName, type) {
    // 要导出的元素
    this.$el = el
    // 导出的文件名称
    this.fileName = fileName
    // 导出pdf的处理类型
    this.type = type || 'original'
    // jsPDF的实例化
    this.jsDoc = undefined
    // 元素的截图
    this.canvas = undefined
  }
  /**
   * a4 的宽高为: [595.28, 841.89]
   * 图片的宽高可能存在这种情况:
   * 1. 宽度大于高度 比如横向的a4纸
   * 2. 正常宽高，比如竖向的a4纸
   * 3. 宽度正常，高度非常的高，一张a4纸都放不下的那种
   *
   * 需要根据宽高的情况来生成对应的模板
   * 对于第一种情况 生成的横向的模板
   * 对于第二种情况 正常a4模板
   * 对于第三章情况... 比较恶心了 有下面几种情况
   *  1. 生成一个和图片宽高一样的模板，类似于一张长图
   *  2. 将图片按等比缩放，放入一张a4纸里面
   *  3. 按a4纸高度将图片 分页，但是 分页的缺陷是一刀切，无论切割的地方有没有内容...
   * 以上三种处理情况并不是只对应长图情况。
   *
   * type的三种模式:
   *  original
   *  pagination
   *  zoom
   */
  async addToPdf () {
    if (!this.canvas) {
      await this.shooting()
    }
    // 获取 元素的 宽高
    const { width, height } = this.$el.getBoundingClientRect()

    // 设置 jsPdf 插件的配置项
    const pdfConfig = {
      // pdf模板长度单位
      unit: 'pt',
      // 如果是选择 original 设定原始宽高的模板，其他两种情况都使用a4模板
      format: this.type === 'original' ? [width + 20, height + 20] : 'a4',
      // 设置模板横竖方向
      orientation: {
        // Orientation of the new page. Possible values are "portrait" or "landscape"  (or shortcuts "p" (Default), "l")
        // portrait 竖向 landscape 横向
        // 如果宽度大于高度，设置为横向
        landscape: width > height ? 'l' : 'p'
      }
    }

    this.jsDoc = new JsPDF(pdfConfig)

    // a4纸的 宽高 [595.28, 841.89]
    const a4Height = 841.89
    const a4Width = 595.28
    // a4宽度与实际宽度的百分比
    const widthPercentage = a4Width / width
    // 添加图片
    // 分页的情况
    if (this.type === 'pagination') {
      // 把整张图片按a4纸的高度 切开 放入多个模板中
      // 把宽度缩到 595.28 比例为 595.28 / width
      // 所以高度为 595.28 / width * height
      // 所以第一页的放置的高度是 0 - 841.89 * 1
      // 第二页的高度是 841.89 - 841.89 * 2
      // 以此类推
      let pageHight = widthPercentage * height
      let pageNum = 0
      while (pageHight > 0) {
        // 参数说明
        // 添加的图片, 图片格式, left 偏移值, top 偏移值, 宽度, 高度
        this.jsDoc.addImage(this.canvas, 'JPEG', 0, -a4Height * pageNum, a4Width, widthPercentage * height)
        // 添加新一页模板 默认是 a4
        pageHight -= a4Height
        pageHight > 0 && this.jsDoc.addPage()
        pageNum++
      }
    } else {
      // 不分页，只占用一张模板
      if (this.type === 'original') {
        // 不缩放，模板与元素截图原始大小一致
        this.jsDoc.addImage(this.canvas, 'JPEG', 10, 10, width, height)
      } else if (this.type === 'zoom') {
        // 整个图片放到一个a4纸大小的模板中
        // 需要考虑页面过高的情况
        // 对比 a4宽与实际宽 a4高与实际高的比例
        // 这两个比例值 哪个小用哪个
        // 比如 宽度比例是 0.5 高度比例是 0.4
        // 那么 模板上体现的页面宽度为 实际宽度 * 0.4
        const heightPercentage = a4Height / height

        if (widthPercentage > heightPercentage) {
          // 页面过高的时候
          this.jsDoc.addImage(this.canvas, 'JPEG', 0, 0, heightPercentage * width, a4Height)
        } else {
          this.jsDoc.addImage(this.canvas, 'JPEG', 0, 0, a4Width, widthPercentage * height)
        }
      }
    }
  }

  // 截图，将 el 转换为 canvas
  shooting () {
    if (!this.$el) {
      throw new Error('请指定 el 属性, 告诉我要对哪个元素进行截图。')
    }
    return html2canvas(this.$el).then(canvas => {
      this.canvas = canvas
      return Promise.resolve(canvas)
    })
  }

  // 转换为 uri string ，以便在iframe中预览
  output () {
    return this.jsDoc.output('datauristring')
  }

  // 保存pdf
  save (fileName) {
    fileName = fileName || this.fileName || new Date().toLocaleString()
    if (this.jsDoc) {
      this.jsDoc.save(fileName + '.pdf')
    } else {
      throw new Error('jsDoc 未初始化.')
    }
  }

  // 直接导出，截图->添加图片->保存到pdf
  async justSave () {
    await this.shooting()
    this.addToPdf()
    this.save()
    return Promise.resolve()
  }

  setEl (el) {
    this.$el = el
  }

  setType (type) {
    this.type = type
  }
}
