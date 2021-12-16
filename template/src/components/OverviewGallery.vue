<template>
  <div class="overview-gallery-container">
    <div class="placeholder"></div>
    <ul class="overview-gallery" :class="{ mini: sticky }">
      <li
        v-for="(item, index) in list"
        :key="item.router"
        ref="items"
        class="item"
        :class="{ active: current === item.router }"
        @click="choose(item, index)"
      >
        <i class="iconfont" :class="item.icon"></i>
        <p class="text">{{ item.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { animateCSS } from "./common/js/util";
import $ from "jquery";

export default {
  name: "OverviewGallery",
  props: {
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [
        {
          icon: "iconbingtutongji",
          text: "分析",
          router: "visual-analysis-overview",
        },
        {
          icon: "iconjinggao-mianxing",
          text: "威胁",
          router: "visual-threat-overview",
        },
        {
          icon: "iconalarm1",
          text: "异常",
          router: "visual-exception-overview",
        },
        {
          icon: "iconpeople",
          text: "用户",
          router: "visual-user-overview",
        },
        {
          icon: "icondiannao",
          text: "设备",
          router: "visual-device-overview",
        },
        {
          icon: "icondata21",
          text: "数据",
          router: "visual-data-overview",
        },
        {
          icon: "iconyingyong2",
          text: "应用",
          router: "visual-application-overview",
        },
        {
          icon: "iconprogram1",
          text: "程序",
          router: "visual-program-overview",
        },
      ],
      current: "visual-analysis-overview",
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.current = val.name;
        // $('.app-main-container').scrollTop(0)
      },
      immediate: true,
    },
  },
  mounted() {
    this.$container = $(".app-main-container");
  },
  methods: {
    choose(item, index) {
      if (item.router === this.current) {
        animateCSS(this.$refs.items[index], "shake");
        return;
      }
      this.current = item.router;
      let $container = this.$container;
      let top = $container.scrollTop();
      if (top >= 150) {
        this.interval = setInterval(() => {
          if (top >= 35) {
            top -= 35;
            $container.scrollTop(top);
          } else {
            $container.scrollTop(0);
            clearInterval(this.interval);
            setTimeout(() => {
              this.$router.push({ name: item.router });
            }, 180);
          }
        }, 10);
      } else {
        this.$router.push({ name: item.router });
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.overview-gallery-container {
  position: relative;
}

.placeholder {
  height: 100px;
  background-color: rgb(229, 232, 237);
}

.overview-gallery {
  position: absolute;
  top: 0;
  background-color: rgb(229, 232, 237);
  height: 100px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  transition: all 0.2s;
  z-index: 1;
  width: 100%;
  margin-bottom: 6px;

  /*&:before {
      content: " ";
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(12px);
    }*/

  &.mini {
    height: 50px;
    position: fixed;
    justify-content: center;
    /*background-color: transparent;*/
    /*background-image: linear-gradient(-141deg, rgba(159, 184, 173, 0.1) 0%, rgba(31, 200, 219, 0.1) 51%, rgba(44, 181, 232, 0.1) 75%);*/
    top: 78px;
    left: 0;

    /*&:before {
        background: rgba(213, 216, 221, 0.6);
      }*/

    .item {
      height: 30px;
      width: 72px;
      margin: 0 7px;

      &.active {
        .text {
          display: block;
        }

        .iconfont {
          display: none;
        }
      }

      &:hover {
        .text {
          display: block;
        }

        .iconfont {
          display: none;
        }
      }

      .text {
        display: none;
      }

      .iconfont {
        font-size: 20px;
      }
    }
  }

  .item {
    width: 120px;
    height: 80px;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    margin: 0 6px;
    border-radius: 2px;

    &.active {
      background-color: #1e78d2;

      .text {
        color: #fff;
      }

      .iconfont {
        color: #fff;
      }
    }

    &:hover {
      background-color: #1e78d2;

      .text {
        color: #fff;
      }

      .iconfont {
        color: #fff;
      }
    }

    .iconfont {
      font-size: 25px;
      color: #b0bcd4;
    }

    .text {
      color: #555;
      font-size: 14px;
    }
  }
}
</style>
