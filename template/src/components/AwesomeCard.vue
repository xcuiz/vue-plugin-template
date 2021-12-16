<template>
  <el-card class="awesome-card" :shadow="shadow">
    <slot name="header">
      <header v-if="header" slot="header">
        <h1>{{ header }}</h1>
      </header>
    </slot>
    <div class="awesome-card_body-wrapper">
      <slot>
        <div class="awesome-card_body-empty">暂无数据</div>
      </slot>
    </div>
    <slot name="footer">
      <footer v-if="footer" :class="{ white: whiteFooter }">
        <span class="text">{{ footer.text }} </span>
        <el-link
          v-show="footer.more"
          class="more"
          :underline="false"
          @click="$emit('show-more')"
          >查看更多<i class="el-icon-arrow-right"></i
        ></el-link>
      </footer>
    </slot>
  </el-card>
</template>

<script>
/* Attributes:
 * 参数        说明                                                        类型         默认
 * header      设置 header，也可以通过 slot#header 传入 DOM(此时header失效)  string       -
 * shadow      设置阴影显示时机，可选值 always / hover / never              string      hover
 * footer      设置footer，内可选两个属性: text/more，分别为文字和链接        object      null
 */
export default {
  name: "AwesomeCard",
  props: {
    header: {
      type: String,
      required: false,
    },
    shadow: {
      type: String,
      required: false,
      default: "hover",
      validator(val) {
        return ["always", "hover", "never"].indexOf(val) !== -1;
      },
    },
    footer: {
      type: Object,
      required: false,
      default() {
        return null;
      },
      validator(obj) {
        const text = obj.hasOwnProperty("text");
        const more = obj.hasOwnProperty("more");
        return obj == null || text || (text && more);
      },
    },
    whiteFooter: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      required: false,
      default: 240,
    },
  },
};
</script>

<style scoped lang="postcss">
.awesome-card {
  border: none;
  transition: all 0.2s !important;

  &.is-hover-shadow {
    box-shadow: var(--shadow-dark);
  }

  >>> .el-card__header {
    /* padding: 0 14px;
      height: 46px;
      line-height: 46px; */
    padding: 12px 20px;
    border-bottom: none;

    header {
      h1 {
        font-size: var(--font-size-13);
        font-weight: 700;
        display: inline-block;
        cursor: default;
      }
    }
  }

  >>> .el-card__body {
    padding: 0;

    .awesome-card_body-empty {
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #c0c4cc;
    }

    > footer {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      padding: 0 16px 0 19px;
      border-top: 1px dashed #f2f6fc;

      &.white {
        border-top-color: transparent;

        &:after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }

      .text {
        font-size: var(--font-size-12);
        font-weight: 400;
        color: #9c9c9c;
      }

      .more {
        font-size: var(--font-size-12);
        font-weight: 400;
        color: #4a90e2;

        i {
          font-weight: 500;
        }

        &:hover {
          font-weight: 700;

          i {
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
