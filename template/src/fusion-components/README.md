${toc}
# [Fusion Copmponets](http://10.10.10.8/IDSS-FE/fusion-components)

Fusion Copmponets 组件库基于Vue、ElementUI开发，需要主项目安装Vue及ElementUI相关依赖。

```shell

$ npm install vue -S
$ npm install element-ui -S
```

```javascript

// main.js
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
```

## 目录结构说明

    ├── commons            公共基础组件
    ├── dashboard          大屏公共组件
    ├── directives         公共指令
    ├── filters            公共过滤器
    ├── plugins            公共插件
    ├── mixins             混入


组件库会以**git subtree**的形式与主项目做结合，具体说明请见：[组件库管理说明](http://10.10.10.8/IDSS-FE/FE/blob/master/standard/%E7%BB%84%E4%BB%B6%E5%BA%93%E7%AE%A1%E7%90%86%E8%AF%B4%E6%98%8E.md)

## 安装组件库

### 在主项目中以subtree形式添加组件库

```shell
# 添加组件库 remote
$ git remote add fusion-components git@10.10.10.8:IDSS-FE/fusion-components.git
# 将 components 子项目 添加到项目src/components 中
$ git subtree add --prefix=src/fusion-components fusion-components master

# 获取 components 子项目最新代码
$ git subtree pull --prefix=src/fusion-components fusion-components master
```

### 将subtree引入的项目添加到workspace中

package.json中添加如下代码，idss-components 为当前 `fusions-components` 的路径。[workspace介绍](https://classic.yarnpkg.com/zh-Hans/docs/workspaces)

``` json

"workspaces": [
  "idss-components/fusions-components"
]
```

 > 配置好依赖之后，通过在终端执行`yarn`后，项目中可以直接饮用该`fusions-components`包

## 组件使用

### 方式一：全量引入

```javascript
// main.js中引入全量组件库，包括组件、过滤器和指令
import fusionComponents from 'fusions-components'
// 默认全量引入
Vue.use(fusionComponents)

```
### 方式二：按需引入

**当主项目中，需要依赖的组件、指令等个数有限，强烈建议单独引入，便于webpack打包减少体积！**

> *下述已单独引入分页组件为例*

[组件按需加载路径请查看](http://10.10.10.8/IDSS-FE/fusion-components/tree/master/lib)

```javascript
// 获取通用组件组件方式 通过'fusions-components/lib/components'
import {
    IdssTooltip,
    IdssCollapse,
    IdssSlideAside,
    IdssStaticFrame,
    IdssDbDiagram,
    IdssDynamicForm,
    IdssElementResizeable,
    IdssFlowChart,
    IdssAceEditor,
    IdssContextMenu,
    IdssCountDown,
    IdssCustomDropdown,
    IdssDragContainer,
    IdssIconSvg,
    IdssInsertInput,
    IdssMultiTab,
    IdssNoData,
    IdssPagination,
    IdssRichTextEditor,
    IdssSavePdf,
    IdssSelectTree,
    IdssSwiperSlide,
    IdssSwiper,
    IdssTableRolling,
    IdssWidget,
    IdssRouterKeepAlive,
    IdssSingleValue,
    IdssStepsView
} from 'fusions-components/lib/components'

// 获取大屏组件方式 通过'fusions-components/lib/dashboard-components'
import {
    IdssCarouselPanel,
    IdssHoneycombChart,
    IdssDrawerTable,
    IdssGradientBar,
    IdssAtomLine,
    IdssClock,
    IdssCountTo,
    IdssDbStep,
    IdssListItem,
    IdssNeonLights,
    IdssTableList,
    IdssTriangleBox,
    IdssKillChain,
    IdssRealtimeEvent,
    IdssBarSvg,
    IdssCombinationBar,
    IdssDbSvg
} from 'fusions-components/lib/dashboard-components'


// main.js中引入pagination，并注册到全局
Vue.component(IdssPagination.name, IdssPagination)

// 获取filter中暴露的函数
import {
    formatByte,
    formatDate,
    formatNumber,
    formatTime
} from 'fusions-components/lib/filters'

// 获取directives中暴露的指令
import {
    clipBoard,
    dragTable,
    isDrag,
    focus,
    idssPopper,
    responseDialog,
    iscroll,
    idssTooltip
} from 'fusions-components/lib/directives'

// 获取mixins中暴露的service 混入
import { vueEmptyDataService, delayRenderService } from 'fusions-components/lib/mixins'

// 获取pulgins暴露的插件
import { vueExtend, routerExtend, socket } from 'fusions-components/lib/pulgins'
```

### 方式三：局部注册组件的方式

```javascript

// 只引入局部组件、指令、过滤器方式
import fusionComponents from 'fusions-components/lib'
import {IdssDbDiagram, IdssDynamicForm, IdssElementResizeable} from 'fusions-components/lib/components'
import { formatByte, formatDate, formatNumber, formatTime } from 'fusions-components/lib/filters'
import {isDrag, focus, idssPopper, responseDialog } from 'fusions-components/lib/directives'

Vue.ues(fusionComponents, {
    components: {IdssDbDiagram, IdssDynamicForm, IdssElementResizeable},
    filters: {formatByte, formatDate, formatNumber, formatTime},
    directives: {isDrag, focus, idssPopper, responseDialog }
})

```

## 组件换肤

[主题切换](/guide/custom-theme)
[换肤变量的定义和使用](/guide/skin-change)

#### 组件依赖的CSS颜色变量使用说明

为了满足组件库换肤需求，组件开发中的颜色值要使用UI规范中所定义的变量，在项目中也会引入同样的变量。

注意：使用变量时要加入静默值，防止组件单独使用时样式错乱，例 `var(--font-size-6, 12px)`


## 组件库开发说明

如果是新的组件，请仔细考量其通用性、扩展性，避免存在业务逻辑。如果是对已有组件进行改造，要经过相关组件开发作者确认后，方可提交，组件开发作者可在Demo站的右上角查看，如下图。**这里严禁做破坏性提交（非兼容升级），所有修改必须及时反映到Demo上，Demo项目地址 http://10.10.10.8/IDSS-FE/demo-collection！！！**

![组件作者](/docs/示例-组件作者.png)

#### 开发规范

- 1. 所有组件名称和属性使用中横线（“-”）表示< eg: `idss-pagination、table-data`>。
- 2. 基础组件可按照功能类别进行拆分到不同文件夹中。
- 3. 对于组件的输入和输出需要严格控制，避免冗余和歧义。
- 4. 组件库中要用的颜色等变量，要严格根据UI规范来，同时要加上静默值，例 `var(--font-size-6, 12px)`。
- 5. 组件开发中需要调用组件库内其他组件或者过滤器时，要手动引入，不可直接使用。示例如下。
        ```js

        import { IdssTooltip } from './index.js'
        export default {
            name: 'idss-widget',
            components: { IdssTooltip }
        }
        ```
- 6. 组件开发完成之后，要在组件类别的文件夹下的index.js(例: commons/index.js)中手动导出，且要注意顺序问题。
        ```js
        /**
         * @note 开发者注意，暴露组件时，存在依赖关系的，一定要被依赖的前置，大颗粒度、大功能的组件后置
        * 原因：后置加载的组件在加载时，如果前置以来的组件没有被引入时，会报错
        */

        // 基础功能单元的组件，svg/tooltip/SelectTree等比较基础的组件
        export { default as IdssTooltip } from './idss-tooltip.vue'
        export { default as IdssIconSvg } from './idss-icon-svg.vue'
        export { default as IdssContextMenu } from './idss-context-menu.vue'
        export { default as IdssCollapse } from './collapse/idss-collapse.vue'
        export { default as IdssCustomDropdown } from './idss-custom-dropdown.vue'
        export { default as IdssDragContainer } from './idss-drag-container.vue'
        export { default as IdssInsertInput } from './idss-insert-input.vue'
        export { default as IdssCountDown } from './idss-count-down.vue'
        export { default as IdssSelectTree } from './idss-select-tree.vue'

        // 大功能、容器类的组件集合存放处
        export { default as IdssWidget } from './idss-widget.vue'
        export { default as IdssSlideAside } from './collapse/idss-slide-aside.vue'
        export { default as IdssStaticFrame } from './collapse/idss-static-frame.vue'
        export { default as IdssElementResizeable } from './element-resizeable.vue'
        export { default as IdssFlowChart } from './flow-chart.vue'
        export { default as IdssAceEditor } from './idss-ace-editor.vue'
        export { default as IdssMultiTab } from './idss-multi-tab.vue'
        export { default as IdssNoData } from './idss-no-data.vue'
        export { default as IdssPagination } from './idss-pagination.vue'
        export { default as IdssRichTextEditor } from './idss-rich-text-editor.vue'
        export { default as IdssSavePdf } from './idss-save-pdf.vue'
        export { default as IdssSwiperSlide } from './idss-swiper-slide.vue'
        export { default as IdssSwiper } from './idss-swiper.vue'
        export { default as IdssTableRolling } from './idss-table-rolling.vue'
        export { default as IdssRouterKeepAlive } from './router-keep-alive.vue'
        export { default as IdssSingleValue } from './single-value/idss-single-value.vue'
        export { default as IdssStepsView } from './steps-views/idss-steps-view.vue'
        export { default as IdssDbDiagram } from './db-diagram/db-diagram.vue'
        export { default as IdssDynamicForm } from './dynamic-form.vue'
        ```

- 7. `filters/directives`开发时格式发生变化，filters中原有的`handler`和directives中的`hooks`结构去除
  ``` js

    // filter formatNumber
    export default function (value, type = 'en') {
        // 区分是中文单位还是英文单位
        let unitType = {
            'en': ['B', 'M', 'K'],
            'zh': ['十亿', '百万', '千']
        }
        let val = Math.round(value)
        if (val >= 1000000000 || val <= -1000000000) {  // 十亿级别
            return Math.round(val / 1000000000 * 100) / 100 + unitType[type][0]
        } else if (val >= 1000000 || val <= -1000000) { // 百万级
            return Math.round(val / 1000000 * 100) / 100 + unitType[type][1]
        } else if (val >= 1000 || val <= -1000) { // 千级
            return Math.round(val / 1000 * 100) / 100 + unitType[type][2]
        } else { // 取整
            return val
        }
    }


    // directive isDrag
    export default {
        name: 'isDrag',
        inserted (el, binding, vNode) {
            ...
        },

        bind (el, binding, vNode) {
            ...
        },
        // 组件发生变更
        componentUpdated: function (el, binding) {
            ...
        },

        unbind (el, bindding, vNode) {
            ...
        }
    }
  ```
- 8. 暂无数据`vueEmptyDataService`以及组件`idss-no-data`使用时，需要遵循一个规则，[具体请查看](/mixins-components/empty-data)
    * 1. 组件通过mixins `vueEmptyDataService`方式扩展
    * 2. 业务使用时，使用`idss-no-data`组件
#### 组件开发示例

对于同一组件，具有多种展现形式，这里推荐大家使用tmpl模板方式，解耦且便于维护；对于不能涵盖的情况，可以新增模块进行处理！

示例：[单值](http://10.10.10.8/IDSS-FE/fusion-components/tree/master/commons/single-value)

```html
<component v-bind:is="tmpl" v-bind="$attrs">
    <template v-for="(item, name) in $slots">
        <template :slot="name">
            <slot :name="name"></slot>
        </template>
    </template>
</component>
<script>
export default {
    name: 'idss-single-value',
    props: {
        /**
         * 魔板名称
         * title-value 标题-值显示魔板
         * title-value-horizontal 标题-值显示魔板 左右展示
         * title-value-desc 标题-值-值描述魔板
         * title-value-desc-vertical 标题-值-值描述魔板 左右-下展示布局
         * panel-value-view 四宫格的展示情况，主要拆分为左右两宫格，左右继续拆分两个子宫格
         * progress-value-view 进度条的展示情况，主要拆分为左栏，右侧上下两栏
         * progress-value-reverse 进度条的展示左右翻转情况，主要拆分为左侧上下两栏，右侧一栏
         */
        tmpl: {
          type: String,
          default: ''
        }
    }
}
</script>
```

#### 提交
```shell

# 将本地修改提交到 fusion-components 子项目
$ git subtree push --prefix=src/fusion-components fusion-components master
```
