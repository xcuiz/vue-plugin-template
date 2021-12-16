| option | 图表通用配置项，同 echarts option，更多配置项请参考 [echarts配置项](https://www.echartsjs.com/zh/option.html#title) | Object | --- | undefined |
| is-debugger| 当前图表是否debugger状态（debugger状态，控制台会打印option配置） | Boolean| true,false | `false` |
| is-clear| data发生变化图表重新渲染时是否调用chart.clear() | Boolean | --- | false| 
| default-cursor    | 是否使用手型控制 | Boolean | true,false | `false` | 
| is-svg-render| 是否使用svg渲染[官方介绍](https://www.echartsjs.com/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20Canvas%20%E6%88%96%E8%80%85%20SVG%20%E6%B8%B2%E6%9F%93) | Boolean | true,false | `false`| 
| keep-animate| 是否渲染起见一直保持animate状态(如果需要实时动画，需要设置为true,[具体详情可见](/echarts-components/charts-quikstart#xing-neng-xiang-guan))  | Boolean | true,false | **true**`(idss-calendar-scatter-chart/geo地理坐标系/idss-gauge-chart/idss-multi-gauge-chart/idss-graph-chart/idss-word-cloud-chart)`  **false**` (上述图表之外其他图表默认值均为false)`| 
| is-use-default-data-factory| 是否使用内置的dataFactory函数(不同的图表已经默认内置不同的数据处理函数) | Boolean | - | `Vue.prototype.$CHARTS_CONFIG.isUseDefaultDataFactory || true` <font style="background: lightgreen;">idss-bar-mirror-chart因为数据自定义程度比较高，默认使用false</font>| 
| data-decorate | 对即将渲染的数据进行修改和装饰，用于修改[自定义展示数据](/echarts-components/radar/radar#duo-wei-lei-da-tu),`参数为data,即将渲染的data全量数据`， 示例：`function (data) {return data}` | Function | - | - |
| empty-text| 暂无数据默认展示文本,[具体可见](/mixins-components/empty-data) | String | - | `Vue.prototype.$COMPONENTS_CONFIG.empty || '暂无数据'`| 
| empty-icon| 暂无数据默认展示图标,[具体可见](/mixins-components/empty-data) | String | - | `Vue.prototype.$COMPONENTS_CONFIG.icon || 'zanwushuju'`| 
| empty-custom-class| 暂无数据自定义样式,[具体可见](/mixins-components/empty-data) | String | - | ``| 
