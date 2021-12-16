import { Bus } from 'vue-happy-bus'
const HEART_CHECK_TIMEOUT = 20000

let socket
let userId
let reTryCount
/**
 * 初始化 socket 连接， 必须传递user id
 * @params {*} id 用户id
 * @params options 配置项，如url等
 * @param {string} options.messageName 消息的属性名 默认content
 */
async function init (uid, options = { messageName: 'content' }) {
  userId = uid
  // 用户未登录或者已连接成功，返回
  if (!userId || (socket && socket.readyState === socket.OPEN)) return
  // 设置消息的属性名 默认content
  const messageName = options.messageName || 'content'
  let authToken = window.localStorage.getItem(`base/token$$`)
  if (process.env.NODE_ENV !== 'production' && /(ws|wss)/.test(options.url)) {
    console.error('websocket传入路径错误!!!为了适应HTTPS的情况, 请注意在传入路径option.url的时候【不要】携带协议名ws或wss, eg: /websocket/yourUrl')
    return
  }
  const currentProtocol = document.location.protocol === 'http:' ? 'ws' : 'wss'
  socket = new WebSocket(`${currentProtocol}://${location.host}${options.url || `/websocket/${userId}?authToken=${authToken}`}`)

  // 连接建立时触发
  socket.onopen = () => {
    // send('inline', {name: 'test'})
    console.log('socket 已连接')
    // 连接成功后重置重连次数阈值
    reTryCount = 0
  }

  // 监听服务推送来的消息，客户端接收服务端数据时触发
  socket.onmessage = event => {
    const data = JSON.parse(event.data)
    // 收到任何消息，重新开始倒计时心跳检测
    if (data.type) {
      heartCheck.reset().start()
    }
    Bus.$emit('websocket/' + data.type, data[messageName])
  }

  // 连接关闭时触发
  socket.onclose = (event) => {
    console.log('socket 断开连接')
    // 登录状态下进行重连
    if (userId && reTryCount < 5) {
      // 连接断开进行重连
      setTimeout(() => {
        reTryCount++
        console.log(`socket 进行第${reTryCount}次重连`)
        init(userId, options)
      }, HEART_CHECK_TIMEOUT)
    } else {
      heartCheck.reset()
      console.error('socket 多次重连失败！已停止继续重连！')
    }
  }

  // 通信发生错误时触发
  socket.onerror = (err) => {
    console.log('websocket 链接发生错误', err)
  }
}

/**
 * 推送消息到服务器
 * @param {string} type socket类型
 * @param {object} content 消息内容
 * @param {string} messageName 消息的属性名 默认content
 */
function send (type, content, messageName = 'content') {
  if (!socket || socket.readyState !== socket.OPEN) {
    console.error('socket 没有连接到服务器，无法推送')
    return false
  }

  // 推送到服务器
  socket.send(JSON.stringify({
    type,
    [messageName]: content
  }))
  return true
}

// 心跳监测
const heartCheck = {
  timeout: HEART_CHECK_TIMEOUT,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function () {
    this.timeoutObj = setTimeout(() => {
      send('ping', 'In?')
      this.serverTimeoutObj = setTimeout(() => {
        send('ping', 'In?')
        // 重新开始检测
        this.reset().start()
      }, this.timeout)
    }, this.timeout)
  }
}

// 第一次连接
// init()

export default {
  install (Vue) {
    Vue.prototype.$socketInit = init
    Vue.prototype.$socketSend = send
    /**
     * 获取当前 socket 是否与服务器处于正常连接状态
     * true 正常连接
     * false 断开连接
     */
    Vue.prototype.$socketIsOpen = _ => {
      return socket && socket.readyState === socket.OPEN
    }
    // 关闭链接
    Vue.prototype.$socketClose = _ => {
      socket && socket.close()
    }
  }
}
export {
  send
}
