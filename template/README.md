# argus-fe

> 观安前端

<h3>请确保代码的整洁性，要优雅~~~</h3>

## 开发注意事项

- 开发分辨率统一按照宽度1250px
- 字体统一采用rem方式，默认根字体为10px(便于计算)
- 布局尽量采用elementUI提供方式，非必要情况下不要使用浮动布局，禁止乱使用z-index
- 所有图表无业务性特殊要求，以封装好的组件为基础
- 相同的图表返回的数据格式必须一致，统一参照`charts-demo.vue`及`mock/charts-demo`，相关数据转换方法参照`util/data-factory.js`
- 表格初始化、分页、排序、改变页码大小等采用系统中已封装好的通用方法<tableChange>，所有表格增加border、stripe，控制列宽度使用 `:min-width="**"`，必要时增加`show-overflow-tooltip`
- 表格中的文字类链接，使用`<el-button type="text" size="small" custom>链接</el-button>`来统一控制样式
- 所有颜色值从模块代码中抽离，统一放到`styles/_var.css`中（图表抽离到`theme.js`中），便于后续动态换肤统一处置
- 覆盖elementUI的所有样式放到`styles/element_cover.css`中，以模块划分（全局除外）；需要在自己模块覆盖的，需要增加当前模块的标识
- 模块私有样式增加scoped，或者以当前模块最外层标记开始编写。**无需样式的模块，不要添加`<style>`标签，以减少webpack打包后的文件大小**
- Vuex中按照模块划分，所有方法统一定义到`type.js`中，约定types以"$$"结尾的，需要持久化到localStorage
- 路由全部采用异步加载方式 `component: () => import('@/views/demo/charts')`，其中path使用中划线'-'，name需要全局唯一
- 使用`v-loading`代替`v-loading.body`避免，页面切换上个页面loading依然存在的问题
- 所有提交遵循<Angular信息规范>，便于生成统一的changelog
- 单文件组件的文件名应该要么始终是[单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)](https://cn.vuejs.org/v2/style-guide/#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%96%87%E4%BB%B6%E7%9A%84%E5%A4%A7%E5%B0%8F%E5%86%99-%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90)

## 路由说明

| 字段   | 属性            | 说明             |
| ---- | ------------- | -------------- |
| name | -             | 路由名称，确保唯一性     |
| icon | -             | 图标名称           |
| meta | title         | tab标签展示名称        |
| meta | noCache       | true，tab切换请求数据（默认缓存keep-alive） |
| meta | hidden        | true，隐藏菜单      |
| meta | noRequireAuth | true，无需权限直接挂载  |
| meta | outOfViews    | true, 无需挂载到 tags-views |
| meta | noRefresh     | true, 无需刷新此页面  |
| meta | manageFree    | true, 不在操作权限数中展示 |
| meta | lastMenuTag   | true, 4级路由菜单（洞察定制化需求）
**关于路由的特别说明：标品中按产品需求新增了tags切换，且需要缓存状态。我们采用了`<keep-alive :include=[]>`的方式进行处理**

> 匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称 (父组件 components 选项的键值)。匿名组件不能被匹配。 --引自[Vue官网Keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)

**要求大家在配置路由时，其name属性要唯一，以所属模块开头，同时相应的views.vue文件中的name值要与路由中配置的name值一致！！！**

### 路由配置更新后需要做的事情

当你的模块路由发生了变化，如新加了页面、删除了页面或者修改了 titile，请按下面步骤操作：

  1. 放开 `src/router/index.js`中的一行代码的注释:

     ```js
        // 根据路由配置生成菜单，路由发生变化后请放开此行注释，具体操作请查看 README !!!
        require('./generateMenus.js').default(routers)
     ```

     generateMenus.js 会根据路由配置，**生成一条后台使用的路由树(在浏览器的控制台会打印出来)**，后台会根据这条数据作为基本的权限，所以当你的模块路由发生了以上变化，一定要跟新此数据。

     **不然后台在生产环境或测试环境你变更的页码会导致404**

  2. 打开浏览器控制，将打印的路由树粘贴到`config/routers-menus.json`中
  3. 将`config/routers-menus.json`提交到 git 远程仓库。
  4. **重要的是，一定要告知后台数据更新了**

### 路由原型扩展

```javascript
/**
 * 扩展VueRouter原型，关闭tags并且跳转
 */
Router.prototype.replaceTagPush = function (to, from, onComplete, onAbort) {
  if (from) {
    let {name, query} = from
    Bus.$emit(EventName.TAGS_VIEW_CLOSE, {name, _r: query._r})
  }
  this.push(to, onComplete, onAbort)
}
```

调用：`this.$router.replaceTagPush(path, this.$route)`

适用业务场景：某一模块添加或编辑为单独页面，其他模块下钻到此，添加或编辑完成后跳转到该模块列表页面！【事件看板 => 新建溯源任务 => 事件溯源】
> 区分：列表到添加页面，添加完成应该回到刚列表页，非打开新Tag！【用户画像 => 群体(个体)用户画像 => (返回)用户画像】

### 基础路由配置

路由信息（以charts.vue为例）

```javascript
{
  path: 'charts',
  name: 'demo-charts',
  component: () => import('@/views/demo/charts'),
  meta: {title: '图表示例'}
},
```

相关views文件配置（charts.vue）：

```javascript
export default {
    name: 'demo-charts',
    mixins: [globalMixins],
    ...
}
```

## axios配置说明

```javascript
let {status, content, errorCode, message} = res.data
if (status === 'success') {
    // 成功返回content内容
    resolve(content)
} else {
    /* eslint-disable prefer-promise-reject-errors */
    reject({
        errorCode: errorCode,
        message: message
    })
}
```

## 错误处理原则

- 语法错误，提交前查看控制台，是否有相关问题（ESLint协助）；
- 可预见情况下的错误，内部使用try...catch或者Promise.catch直接处理
- 404、500 HTTP的`Status Code`统一使用axios统一拦截处理（权限模块完成后，添加该机制）
- 预料之外的全局捕获处理，会对全局运行时错误捕获以及promise.reject未进行处理的错误进行捕获 `src/monitor`模块

```javascript
process.env.NODE_ENV !== 'production' || window.isDebug
```

开发模式下，所有错误直接捕获抛出；如果需要线上调试，请打开控制台输入`window.isDebug = true`，否则会隐藏所有错误~~
关于错误日志的级别分类、错误日志上报等问题，由于时间问题，后续评估考量后，统一处理~~
注意：webpack打包线上模式时，特开启了console.error输出机制`pure_funcs: ['console.log', 'console.warn', 'console.info']`，非必要条件谨慎使用`console.error`

> 需要格外注意的是：【预料之外的全局捕获】对于`async...await`未进行`try...catch`的`Promise.reject`的错误，并不能拦截（如果有好的方案，请联系@李刚）

### 页面处理错误

方式一：Promise【推荐】

```javascript
this.$request({}).then((content) => {}, (error) => {})
```

方式二：async...await

```javascript
try {
  let content = await this.$request({})
} catch (error) {}
```

**注意：对于V8来说，try...catch中的代码段不会进行任何优化操作，所以这里建议使用第一种方式！！！**

### 接收后台错误信息

[Demo请查看示例-表单](http://localhost:8088/demo/form)

```html
 <el-form :model="form" :rules="rules">
  <el-form-item label="名字" prop="name" :error="formError.name">
    <el-input v-model="form.name" @focus="formError.name = ''"></el-input>
  </el-form-item>
  <el-form-item>
    ...
  </el-form-item>
 </el-form>
```

```javascript
import { getErrorMsgByEnd } from '@/util/base'

this.formError = {}
try {
  await this.$request({})
  this.showMessage('成功！')
} catch (error) {
  this.formError = getErrorMsgByEnd(error)
}
```

## 颜色值

|图表|颜色值位置|变量|
|----|---|----|
|图表|src/components/charts/theme.js|COLOR|
|危机|src/styles/_var.css|--color-emergency|
|高  |src/styles/_var.css|--color-high|
|中 |src/styles/_var.css|--color-medium|
|低 |src/styles/_var.css|--color-low|

## 图表说明

> 要求：全部颜色值抽离到`theme.js`中，container中包含了较通用的legend和grid配置，如果无特殊要求直接沿用，否则单独配置
> 所有图表数据格式按照名称单独封装到`mock/charts-demo`下，展示封装到`views/demo/charts`下，名称写到readme中，便于统一维护和查找
> **全部放到`components/charts`下，组件命名为idss-*-chart** Demo地址：<http://localhost:8080/#/demo/charts>

| 图表Name                            | 图表说明         |
| ----------------------------------- | ------------ |
| idss-bar-chart                      | 柱状图          |
| idss-bar-h-chart                    | 横向柱状图        |
| idss-bar-mini-chart                 | mini柱状图(表格内) |
| idss-bar-stack-chart                | 堆积柱状图        |
| idss-bar-h-stack-chart              | 横向堆积柱状图      |
| idss-topn-chart                     | topN         |
| idss-line-chart                     | 趋势图          |
| idss-line-mini-chart                | mini趋势图(表格内) |
| idss-line-stack-chart               | 堆积趋势图        |
| idss-pie-chart                      | 饼图           |
| idss-round-pie-chart                | 环形图    |
| idss-radar-chart                    | 雷达图          |
| idss-gauge-chart                    | 仪表盘          |
| idss-graph-chart                    | 基础关系图        |
| idss-quadrant-chart                 | 象限图          |
| idss-parallel-chart                 | 平行坐标系        |
| idss-tree-chart                     | 横向树图         |
| idss-calendar-heatmap-chart         | 日历热图    |
| idss-calendar-effect-scatter-chart  | 日历[涟漪特效动画的散点（气泡）图]         |
| idss-map-china-scatter-chart        | 中国攻击图        |
| idss-map-province-chart             | 省份地图         |
| idss-map-world-chart                | 世界地图         |
| idss-line-baseline-chart            | 曲线基线图        |
| idss-bar-line-chart                 | 柱状图图及曲线组合    |
| idss-tree-map-chart                 | TreeMap图表    |
| idss-sankey-chart                   | 桑籍图          |
| idss-number-chart                   | 数值           |
| idss-url-chart                      | URL          |
| idss-regression-chart               | 散点图回归线      |
| idss-scatter-chart                  | 普通散点图      |
| idss-pie-legend-description         |  饼状图图例说明组件   |

## 过滤器说明

| 插件 | 说明     | 默认值 |
| --- | -------- | -------- |
| formatDate | 日期格式化 | 'yyyy-MM-dd hh:mm:ss' |
| formatNumber | 数值格式化 百万级(M)、千级(K) | 无 |
| formatTime | 时间戳格式化 秒、分钟、小时、天、月 | 无 |

## 插件说明

| 插件              | 地址                                     |
| --------------- | -------------------------------------- |
| 异步请求插件【axios】   | <https://github.com/axios/axios>         |
| 验证插件【validator】 | <https://github.com/chriso/validator.js> |
| 滚动条插件【iscroll】  | <https://github.com/cubiq/iscroll>       |
| 列表拖拽【Vue.Draggable】| <https://github.com/SortableJS/Vue.Draggable> |

## 通用业务组件说明

> **全部放到`components/commons`下 Demo地址：<http://localhost:8080/#/demo/components>**

| 组件Name                | 组件说明        |
| ---------------------  | ----------- |
| idss-upload            | 文件上传        |
| idss-time-select       | 时间控件        |
| idss-time-select-drag  | 可拖拽的时间控件 |
| idss-drag-container    | 拖拽字段选择      |
| idss-collapse-item     | 可折叠面板(更多条件) |
| idss-single-val        | 单值          |
| idss-rich-text-editor  | 富文本编辑器      |
| idss-pagination        | 分页          |
| idss-steps-view        | 多步骤条        |
| idss-steps-list        | 多步骤列表       |
| idss-scroll-table      | 图表滚动加载      |
| idss-rolling-table     | 图表自动滚动      |
| idss-collapse          | 可折叠面板(功能按钮) |
| idss-select-tree-filter| 下拉框可以模糊搜索的树型控件|
| idss-context-menu      | 右击菜单 |
| idss-data-label        | 数据标签 |
| idss-slide-aside       | 侧边栏收起展开 |

### 滚动条

1. 优先使用elementUI内置滚动条

    ```html
     <el-scrollbar style="height: 100px;">
        内容
     </el-scrollbar>
    ```

2. elementUI无法满足的情况下，使用自封装的iscroll指令

    ```html
    <div style="height: 100px;" v-iscroll="config">
        <div>
            内容
        </div>
    </div>
    ```

    需要注意的，iscroll插件只会对`children[0]`的元素增加滚动条

### socket 使用

1. 监听: 可直接使用 `@/util/bus.js` 进行监听, 注意socket的所有事件都以 `webscoket/` 开头(因为公用一个 bus 系统，避免冲突), 后面跟着对应的 API 接口名称(详细可查看`plugin/socket.js`中的封装实现)。

2. 推送：已在 vue 原型上绑定了 `$socketSend(type, content)` 方法。 `type` 为对应的后台接收接口名称，`content`为推送的具体内容，格式按照后台给出的对应接口来写。

如 `src/viewsdemo/socket.vue` 中的示例:

```javascript
// 'websocket/' + 'test'，test 为后台规定的业务接口名称
this.bus.$on('websocket/test', async data => {
  // do something
  console.log(data)
})

// 如果想给服务器推送消息
this.$socketSend('type', {
  // content 内容
})
```

| socket 监听事件名称 | 推送时机 | 备注 |
| ---------------- | --- | -- |
| login_in_success | socket 链接成功后推送 | - |
| unread_msg_single | 实时消息推送 | - |
| unread_msg_cnt | 未读消息数量发生变化时 | - |
| source_task_run_status | 威胁溯源任务状态发生变化时 | - |
| monitor_status | 模型监控状态发生变化时 | - |

### element样式覆盖

1.只需要给其父级加一个类名然后加上空格>>>空格，然后紧跟着你要修改的element里面的类名.

比如：

```javascript
.parent(父级类名) >>> .el-table(element里面的类名){
    ...
}
```

需要注意的是而对于less或者sass等预编译，是不支持`>>>`操作符的，可以使用`/deep/`来替换`>>>`操作符

### 可折叠面板

1.有单个title和多个功能按钮的情况下

```html
<idss-collapse>
  <template slot="title">  // 标题区
    <span>筛选条件</span>
  </template>
  <template slot="feature-btns">  // 功能按钮区
    <button>按钮1</button>
    <button>按钮2</button>
    <button>按钮3</button>
  </template>
  <template>    // 内容区
     具体内容...
  </template>
</idss-collapse>

```

2.有多个标题的情况

```html
<idss-collapse>
  <template slot="title">
    <el-row>
      <el-col :span="16">标题一</el-col>
      <el-col :span="8">标题二</el-col>
    </el-row>
  </template>
  <template>
     内容区...
  </template>
</idss-collapse>
```

## tooltip提示框

1. 默认使用element-ui中的tooltip组件 el-tooltip
2. 由于element的tooltip不支持字符串无溢出状态时，tooltip不显示的需求，所以在el-tooltip基础上封装了idss-tooltip，该组件继承el-tooltip所有属性，添加了一个**over-width-display**属性

  > over-width-display属性为true时，tooltip只在文本溢出时展示; false时，与tooltip展示相同
  > 该组件通过dom的scrollWidth和offsetWidth的大小对比进行判断，所以要求content必须为块级/行内块元素,文本溢出通过当前元素控制，不通过父级元素控制

   ``` html
    <idss-tooltip
      content="我是content我是content我是content我是content我是content"
      placement="top"
      :over-width-display="true">
      我是content
    </idss-tooltip>
   ```

## 图标引入说明

图标统一采用[iconfont](http://www.iconfont.cn/)，由【设计师】统一管理。统一引入方式有两种：

**方式一：单个svg引入**
将独立的svg图标加到`src/assets/icons`

**方式二：全部替换引入**
下载`//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js`放到`src/assets/icons`下

具体引入方式：[图标导入流程](http://10.10.10.8/IDSS-FE/FE/blob/master/process/%E5%9B%BE%E6%A0%87%E5%AF%BC%E5%85%A5%E6%B5%81%E7%A8%8B.md)

**删除按钮hover样式引入方式**

  1. 组件idss-icon-svg 引用icon为 **delete-hover**
  2. 为需要hover样式的父级添加class名 **idss-svg_delete-hover**

  ``` html
    <button type="text" class="idss-button-icon idss-svg_delete-hover" @click="deleteUser(multiSelect)">
      <idss-icon-svg name="delete-hover"></idss-icon-svg>
      删除
    </button>
  ```

## 上传/下载 通用处理说明

### 上传

**方式一：** 自定义组件

``` javascript
  <idss-upload ref="upload" multiple url="/gov/api/charts-demo/multi"></idss-upload>
  <el-button @click="$refs.upload.submit()">上传</el-button>
```

**方式二：** ElementUI方式，注意需要在headers中增加token信息

```html
<el-upload
  ...
  :headers="{
    token: $store.getters['base/token$$']
  }">
```

### 下载

下载使用通用接口。分为两个步骤:

  1. 发起正常接口请求，后台会返回一个文件名。
  2. 使用后台返回的文件名当作参数调用 download 方法

```javascript
import download from '@/util/download.js'
// ...
const content = await this.$request({
  // 请求内容
})
// 下载文件，fileName 是后台统一规定的，在 content 中包裹一层。
download(content.fileName)
```

## FAQ

Q：项目启动报错，缺少部分依赖或依赖冲突<br>
A：删除掉node_modules，重新安装依赖

Q：git merge操作失败，提示commit信息格式不对<br>
A：merge也会执行git的commit-msg钩子，所以依然需要满足格式 例子：`git merge --no-ff develop -m "merge(develop): 合并develop分支"`

Q：表格数据，某行被删除后如何操作？<br>
A：删除数据后，需设置表格页面为1，并重新请求表格数据，即requestTable:submit

Q：缓存页面、增加刷新按钮、隐藏菜单、排除权限控制等改如何处理？<br>
A：详细查看上述<路由说明>进行处理

Q：增加了刷新按钮，但是点击无效果？<br>
A：相关页面中需要添加init方法，刷新会统一调取init方法

## TODO

- [ ] 模块父模块，模块共享组件可以只加载一次
- [x] 柱状图、曲线图切换
- [x] 左右区域收起展开
- [x] 浏览器兼容性问题排查及处理（chrome、firefox）
- [x] 关键字+更多
- [x] 饼图默认选中第一个类别 <http://10.10.10.8/argus/argus-fe/issues/19>
- [x] 依赖版本锁定
- [x] 图表框选数据范围（参考其他，给出Demo）
- [x] Git开发及版本控制（git-flow，后续开发版本、分支、上线时间差异处理方案）
- [x] immutable的必要性（项目适合度、优劣，给出可以适合场景、不适合场景，出Demo）
- [ ] 动态换肤机制（考量1.1是否为最优，确认后加到项目中）
- [ ] webpack优化，开发模式dll等（分析确认原因，给出相应的解决方案，项目中尝试）
- [ ] HTTPS
- [ ] 前端日志体系(日志规范)
- [ ] 表格无限滚动加载(删除DOM)【延后处理】
- [ ] lenged 横向展示时分两行【延后处理】
- [x] 复盘

## 常用链接

- [Vue官网](https://cn.vuejs.org/)
- [Vue-router](https://router.vuejs.org/zh/)
- [ElementUI](http://element.eleme.io/)
- [echarts](http://echarts.baidu.com/)
- [兼容性查询](https://caniuse.com/)
