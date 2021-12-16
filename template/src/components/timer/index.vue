<!--
 * @Author: yincheng
 * @Date: 2021-05-31 16:02:29
 * @LastEditors: yincheng
 * @LastEditTime: 2021-06-01 13:41:31
-->
<template>
  <!-- 定时器 -->
  <span v-show="show" class="ai_jessica_timer">
    <!-- 标题 -->
    <span class="ai_jessica_timer-title">{{ title }}</span>
    <span
      v-show="state === 'stop'"
      class="ai_jessica_timer-operate play"
      @click="changeState(state)"
    >
      <i
        class="el-icon-video-play"
        style="font-weight: bold; color: rgb(75, 159, 233)"
      ></i>
      启动定时刷新
    </span>
    <span
      v-show="state === 'play'"
      class="ai_jessica_timer-operate stop"
      @click="changeState(state)"
    >
      <i
        class="el-icon-video-pause"
        style="font-weight: bold; color: rgb(244, 94, 95)"
      ></i>
      暂停定时刷新
    </span>
    <!-- 定时器 -->
    <el-popover
      v-model="popoverShow"
      placement="bottom"
      trigger="hover"
      popper-class="ai_jessica_timer-popper"
    >
      <!-- 刷新时间列表 -->
      <ul class="ai_jessica_timer-interval">
        <li
          v-for="item in intervalList"
          :key="item.val"
          class="interval-item"
          :class="{ active: item.active }"
          @click="changeInterval(item)"
        >
          <span class="number">{{ item.format }}</span>
          <i class="unit">{{ item.val >= 60 ? "分钟" : "秒" }}</i>
        </li>
      </ul>
      <span slot="reference" class="ai_jessica_timer-clock">
        <span class="number">{{ format[0] }}</span>
        <span class="number">{{ format[1] }}</span>
        <span class>:</span>
        <span class="number">{{ format[2] }}</span>
        <span class="number">{{ format[3] }}</span>
        <span class="arrow">
          <i class="el-icon-caret-bottom"></i>
        </span>
      </span>
    </el-popover>
  </span>
</template>

<script>
export default {
  name: "AiJessicaWidget",
  props: {
    state: {
      type: String,
      default: "stop",
    },
    title: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: 0,
    },
    interval: {
      type: Array,
      default: function () {
        return [5, 30, 60, 300];
      },
    },
  },
  data() {
    return {
      // 显示
      show: false,
      // 时间间隔弹出面板是否可见
      popoverShow: false,
      // 时间格式化
      format: [0, 0, 0, 0],
      // 当前倒计时时间
      currentTime: this.value,
      // 时间间隔列表
      intervalList: [],
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.load();
  },
  destroyed() {
    this.clear();
  },
  methods: {
    stop() {
      this.$emit("update:state", "stop");
      clearInterval(this.intervalId);
    },
    play() {
      this.$emit("update:state", "play");
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.formatTime(this.currentTime);
        this.currentTime -= 1;
        // 归零, 从头再来
        if (this.currentTime < 0) {
          this.currentTime = this.intervalList.find((d) => d.active).val;
          this.$emit("refresh", this.currentTime);
        }
      }, 1000);
    },
    // 切换状态
    changeState(state) {
      if (state === "play") {
        this.stop();
      } else {
        this.play();
      }
    },
    // 切换时间间隔
    changeInterval(item) {
      // 设置选中
      this.intervalList.forEach((d) => (d.active = false));
      item.active = true;
      // 关闭弹出面板
      this.popoverShow = false;
      // 更新时间
      this.$emit("update:value", item.val);
      // 设置时间
      this.currentTime = item.val;
      this.formatTime(item.val);
      // 开始播放
      this.play();
    },
    clear() {
      clearInterval(this.intervalId);
    },
    // 格式化显示时间
    formatTime(time) {
      if (time > 0) {
        let minute = Math.floor(time / 60);
        minute = minute < 10 ? "0" + minute : minute;
        let second = time % 60;
        second = second < 10 ? "0" + second : second;
        this.format = Array.from(minute + second);
      }
    },
    load() {
      if (this.state === "play") {
        this.play();
      }
      if (this.interval) {
        this.intervalList = this.interval.map((d) => {
          return {
            val: d,
            format: d >= 60 ? d / 60 : d,
            unit: d >= 60 ? "分钟" : "秒",
            active: this.state === "play" ? d === this.value : false,
          };
        });
      }
      this.show = true;
    },
  },
};
</script>

<style>
.ai_jessica_timer {
  position: relative;
  height: 28px;
  margin: 0 10px;
  vertical-align: middle;
  /* display: inline-block; */
  display: flex;
  align-items: center;
  line-height: normal;
}

/* 点像素 字体 */
@font-face {
  font-family: DS-DIGI;
  src: url("~@/assets/fonts/DS-DIGI.TTF");
}

.ai_jessica_timer-title {
  font-size: 14px;
}

/* 暂停 & 启动 */
.ai_jessica_timer-operate {
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  margin: 0 10px;
  width: 106px;
}
.ai_jessica_timer-operate .iconfont {
  font-size: 16px;
  vertical-align: middle;
  margin-right: 5px;
}
.ai_jessica_timer-operate.play .iconfont {
  color: rgba(75, 159, 233, 1);
}
.ai_jessica_timer-operate.stop .iconfont {
  color: rgba(244, 94, 95, 1);
}

/* 定时间隔列表 */
.ai_jessica_timer-popper {
  padding: 10px 0;
  min-width: 120px;
}

.ai_jessica_timer-popper .ai_jessica_timer-interval {
}

.ai_jessica_timer-popper .ai_jessica_timer-interval .interval-item {
  height: 28px;
  line-height: 28px;
  padding: 0 15px;
  cursor: pointer;
}

.ai_jessica_timer-popper .ai_jessica_timer-interval .interval-item .number {
  font-size: 14px;
  font-weight: 500;
  margin-right: 5px;
}

.ai_jessica_timer-popper .ai_jessica_timer-interval .interval-item .unit {
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
}

.ai_jessica_timer-popper .ai_jessica_timer-interval .interval-item:hover {
  background: linear-gradient(
    0deg,
    rgba(30, 159, 242, 0.9),
    rgba(53, 176, 255, 0.9)
  );
  color: #fff;
}

.ai_jessica_timer-popper .ai_jessica_timer-interval .interval-item.active {
  background: linear-gradient(
    0deg,
    rgba(30, 159, 242, 1),
    rgba(53, 176, 255, 1)
  );
  color: #fff;
}

/* 计时器 */
.ai_jessica_timer-clock {
  font-family: "Altia7Segment", "Altia 7 Segment";
  font-size: 16px;
  cursor: pointer;
  color: #3f3f3f;
  display: flex;
  align-items: center;
}

.ai_jessica_timer-clock:hover {
}

.ai_jessica_timer-clock span {
  /* margin: 0 3px;
  font-weight: 600; */
}

.ai_jessica_timer-clock .number {
  /* padding: 5px 0;
  display: inline-block;
  text-align: center;
  width: 24px;
  height: 32px;
  border: 1px solid #eee;
  color: #4b9fe9;
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.1); */
}

.ai_jessica_timer-clock .arrow {
  color: #9facbd;
  font-size: 14px;
}
</style>
