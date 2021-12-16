/**
 * Mock服务，依赖Koa
 * 1. 请求URL路径（动态)
 * 2. JSON注释问题
 * 3. Get/Post问题
 * 4. Mock手动填写
 * Created by ligang on 2018/5/30.
 */

const path = require('path')
const fs = require('fs')
const http = require('http')

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
let jsonfile = require('jsonfile')
jsonfile.spaces = 4

const app = new Koa()
const router = new Router()

router.use('*', function (ctx, next) {
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

app.use(bodyParser())

app.use(async ctx => {
  let url = ctx.request.url
  console.log(url)
  const replaceAPI = ctx.request.url.startsWith('/api')
  let filePath = path.join(__dirname, (replaceAPI ? ctx.request.path.replace('/api/', '') : ctx.request.path).replace('/query', '').replace(/\/delete$/, '') + '.json')
  let data

  console.log(filePath)

  if (fs.existsSync(filePath)) {
    try {
      data = jsonfile.readFileSync(filePath)
    } catch (err) {
      console.error('request: ' + url + ' fail!!!')
    }
  } else {
    console.warn('request: ' + url + ' not exist!!!!')
  }

  // 延迟1s
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 300)
  })

  ctx.set('Content-Type', 'application/json')
  ctx.body = data
})

const port = 18080
const server = http.createServer(app.callback())
server.listen(port)
console.log(`'localhost:${port} listen!!!`)

// WebSocket 服务
const WebSocketServer = require('websocket').server

// 开启 socket 服务
const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
})

wsServer.on('request', function (request) {
  const connection = request.accept('', request.origin)
  console.log(new Date() + ' Connection accepted.')
  // 客户端消息监听
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data)
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
    }
  })
  // 监听关闭
  connection.on('close', function (reasonCode, description) {
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.')
  })
  // websocket 链接成功
  connection.sendUTF(
    JSON.stringify({
      type: 'login_in_success',
      content: {
        msg: '欢迎光临:用户 4 连接 WebSocket 成功......当前用户数量为:1',
        userId: '4',
        onLine: 1
      }
    })
  )
  // socket 消息推送
  setInterval(() => {
    connection.sendUTF(
      JSON.stringify({
        type: 'unread_msg_single',
        content: {
          messageType: '站内消息',
          sendType: '规则引擎',
          id: '6135682c-3b03-4750-9382-0e6a559e6af6',
          text: `收拾回家，测试信息，测试信息，测试信息，测试<br/>信息，测试信息，测试信息，测试信息，测试信息，测试信息，测试信息，测试信息，测试信息`,
          title: '困了..',
          status: '0',
          sendTime: '2018-08-09 16:42:18'
        }
      })
    )
  }, 5 * 60 * 1000)
  // socket 消息推送：资产管理 》 批量导入
  // setInterval(() => {
  //   connection.sendUTF(JSON.stringify({
  //     type: 'asset-analysis',
  //     content: {
  //       'token': '6722-11e9-958c-fbb0eb033c12',
  //       'successCnt': 17954,
  //       'total': 20000,
  //       'failCnt': 17954,
  //       'errorRowNo': [new Date()],
  //       'status': '0'
  //     }
  //   }))
  // }, 1000)
  // socket 消息推送：资产同步 ---》 获取同步数据
  setInterval(() => {
    connection.sendUTF(
      JSON.stringify({
        type: 'asset-syncronize',
        content: {
          totalCount: 100,
          updateCount: 98,
          insertCount: 2,
          status: 2,
          success: true,
          step: 'asbcsseff'
        }
      })
    )
  }, 1000)
})
