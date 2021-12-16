<template>
  <div class="realtime-event">
    <!-- 暂无数据 -->
    <div class="noData" v-if="!Object.keys(data).length || !data">
      <span>暂无数据</span>
    </div>
    <!-- 数据存在 -->
    <div
      class="hasData"
      :style="layout === 'horizontal' ? {display: 'flex'} : {}"
      v-else>
      <!-- title(加了toptip防止屏幕缩小时出现的换行问题影响展示效果) -->
      <!-- 自定义优先级最高，如果不存在就取title值 -->
      <div class="descript-formdate" v-if="isShowTitle" :style="titleStyle">
        <!-- 自定义title -->
        <slot name="title" v-if="$scopedSlots.title" :leftTitle="data.title"></slot>
        <idss-tooltip
          :content="`${dealData.title}`"
          placement="top"
          :over-width-display="true"
          v-else>
          <div class="title-tootip">{{ dealData.title }}</div>
        </idss-tooltip>
      </div>
      <!-- 右侧事件名称 -->
      <div class="descript-title">
        <div
          class="descript-name"
          v-for="(val, index) in dealData.data"
          :key="index">
          <slot name="name" v-if="$scopedSlots.name" :rightName="val"></slot>
          <div
            class="descript-circle"
            v-if="
              isShowEventName && layout === 'horizontal' && !$scopedSlots.name
            "
            :style="eventNameStyle">
            <div class="circle" :class="val.severirty"></div>
            <span :class="`text-${val.severirty}`">{{ val.name }}</span>
          </div>
          <div
            :class="
              layout === 'horizontal'
                ? 'descript-text'
                : 'descript-vertical-text'
            ">
            <slot
              name="textDescript"
              v-if="$scopedSlots.textDescript"
              :detialDescript="val"></slot>
            <span
              v-for="(v, i) in Object.keys(textDescript)"
              :key="i"
              v-text="`${textDescript[v]}${val[v]}`"
              :style="dealStyle(textDescriptStyle[v])"
              v-else>
            </span>
            <span v-if="layout !== 'horizontal'" :class="val.severirty">{{
              val.type
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @cnName 实时攻击事件列表
 * @props {Object} data $$_数据项
 * @props {String} layout $cn_布局格式
 * @props {Boolean} isShowTitle $cn_是否显示左侧title
 * @props {Boolean} isShowEventName $cn_是否显示右侧name
 * @props {Object} titleStyle $cn_自定义左侧title样式
 * @props {Object} eventNameStyle $cn_自定义右侧name样式
 * @props {Object} textDescript $cn_右侧事件描述
 * @props {object} textDescriptStyle $cn_右侧事件描述样式
*/
import { IdssTooltip } from './../commons'
export default {
  name: 'idss-realtime-event',
  components: { IdssTooltip },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler: function (val) {
        /**
         * 数据处理（如果val中data存在且类型是Array则不处理，其他则处理）
         */
        if (val.data && Array.isArray(val.data)) {
          this.dealData = val
        } else {
          this.dealData = { title: val.title || '', data: [val] }
        }
      }
    }
  },
  data () {
    return {
      /**
       * 数据结构 dealData: { title: '', data: [{ 字段1: '', 字段2: '' }]}
      */
      dealData: {} // 处理后的数据
    }
  },
  props: {
    // 列表数据
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 上下布局显示/左右布局显示
    layout: {
      type: String,
      default: 'horizontal'
    },
    // 是否显示title
    isShowTitle: {
      type: Boolean,
      default: true
    },
    // 控制显示当layout = 'horizontal' 右侧title
    isShowEventName: {
      type: Boolean,
      default: true
    },
    // title样式
    titleStyle: {
      type: Object
    },
    // 事件名称样式
    eventNameStyle: {
      type: Object
    },
    // 文字描述标题
    textDescript: {
      type: Object,
      default: function () {
        return {
          'source': '源IP：',
          'type': '攻击类型：',
          'target': '被攻击IP：',
          'count': '发生'
        }
      }
    },
    // 文字描述样式
    textDescriptStyle: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    // 样式处理
    dealStyle (style) {
      return style
    }
  }
}
</script>
<style lang="postcss" scoped>
.realtime-event {
  /* 暂无数据 */
  & .noData {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 数据存在 */
  & .hasData {
    margin-bottom: 10px;
    padding: 0px 5px;
    /* title样式 */
    & .descript-formdate {
      overflow: hidden;
      & .title-tootip {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    /* 横向布局 */
    & .descript-title {
      & .descript-name {
        & .descript-circle {
          padding: 0px 10px;
          display: flex;
          align-items: center;
          & .circle {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin: 0px 5px 0px 0px;
            float: left;
          }
        }
      }
      /* circle等级颜色(依照等级配置五种颜色） */
      & .info {
        background: rgba(123, 140, 161, 0.8);
      }
      & .low {
        background: rgba(40, 168, 239, 0.8);
      }
      & .medium {
        background: rgba(255, 202, 58, 0.8);
      }
      & .high {
        background: rgba(245, 135, 25, 0.8);
      }
      & .critical {
        background: rgba(243, 97, 59, 0.8);
      }
      /* circle等级字体颜色（title） */
      & .text-info {
        color: rgba(123, 140, 161, 0.8);
      }
      & .text-low {
        color: rgba(40, 168, 239, 0.8);
      }
      & .text-medium {
        color: rgba(255, 202, 58, 0.8);
      }
      & .text-high {
        color: rgba(245, 135, 25, 0.8);
      }
      & .text-critical {
        color: rgba(243, 97, 59, 0.8);
      }
      /* hover样式 */
      & .descript-circle:hover {
        & .info {
          background: rgba(123, 140, 161, 1);
        }
        & .low {
          background: rgba(40, 168, 239, 1);
        }
        & .medium {
          background: rgba(255, 202, 58, 1);
        }
        & .high {
          background: rgba(245, 135, 25, 1);
        }
        & .critical {
          background: rgba(243, 97, 59, 1);
        }
        & .text-info {
          color: rgba(123, 140, 161, 1);
        }
        & .text-low {
          color: rgba(40, 168, 239, 1);
        }
        & .text-medium {
          color: rgba(255, 202, 58, 1);
        }
        & .text-high {
          color: rgba(245, 135, 25, 1);
        }
        & .text-critical {
          color: rgba(243, 97, 59, 1);
        }
      }
      /* 纵向布局hover */
      & .info:hover {
        background: rgba(123, 140, 161, 1);
      }
      & .low:hover {
        background: rgba(40, 168, 239, 1);
      }
      & .medium:hover {
        background: rgba(255, 202, 58, 1);
      }
      & .high:hover {
        background: rgba(245, 135, 25, 1);
      }
      & .critical:hover {
        background: rgba(243, 97, 59, 1);
      }
      & .descript-text {
        margin-left: 19px;
        & span {
          padding: 0px 8px 0px 0px;
        }
      }
    }
    /* 纵向布局 */
    & .descript-vertical-text {
      & span {
        padding: 0px 8px 0px 0px;
      }
    }
  }
}
</style>
