<template>
  <div class="time-config-container">
    <widget-group hide-shadow padding="10px 20px 20px 10px">
      <div class="time-header">时间配置</div>
      <div class="current-time-box">
        <div class="current-text">当前系统时间:</div>
        <div class="current-time">{{ currentTime }}</div>
      </div>
      <div class="ntp-server-config">
        <div class="ntp-header">
          <div class="ntp-header-title">NTP服务器配置</div>
          <el-button type="primary" size="small" @click="saveTimeConfig"
            >保存</el-button
          >
        </div>
        <div class="ntp-form">
          <el-form
            ref="ntpForm"
            size="mini"
            :model="ntpModel"
            :rules="ntpRules"
            label-width="120px"
            primary
          >
            <el-form-item label="服务器地址:" prop="ntpServer">
              <el-input v-model="ntpModel.ntpServer"></el-input>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="同步频率:" prop="timeInterval">
                <el-input-number
                  v-model="ntpModel.timeInterval"
                  :min="1"
                  :step="1"
                  :step-strictly="true"
                  controls-position="right"
                  size="mini"
                ></el-input-number>
                <!-- <el-input v-model="ntpModel.timeInterval" type="number"></el-input> -->
              </el-form-item>
              <el-form-item label="" label-width="0" prop="timeUnit">
                <el-select v-model="ntpModel.timeUnit" placeholder="请选择">
                  <el-option
                    v-for="unit of units"
                    :key="unit.value"
                    :label="unit.label"
                    :value="unit.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </widget-group>
  </div>
</template>

<script>
import WidgetGroup from "@/components/widget-group";
export default {
  name: "TimeConfig",
  components: {
    WidgetGroup,
  },
  data() {
    return {
      currentTime: "",
      ntpModel: {
        // ntp服务器地址
        ntpServer: "",
        // 时间间隔
        timeInterval: "",
        // 间隔单位
        timeUnit: "",
      },
      units: [
        {
          label: "时",
          value: "hour",
        },
        {
          label: "分",
          value: "minute",
        },
        {
          label: "秒",
          value: "second",
        },
      ],
      ntpRules: {
        /*
        ntpServer: [{
          required: true,
          message: '请输入服务器地址',
          trigger: 'blur'
        }
        // , {
        //   required: true,
        //   trigger: 'blur',
        //   validator: (rule, value, callback) => {
        //     const IP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        //     if (IP.test(value)) {
        //       callback()
        //     } else {
        //       callback('服务器地址格式不正确')
        //     }
        //   }
        // }
        ],
        timeInterval: [{
          required: true,
          message: '请输入同步频率',
          trigger: 'blur'
        }],
        timeUnit: [{
          required: true,
          message: '请输入同步频率的单位',
          trigger: 'blur'
        }]
        */
      },
    };
  },
  created() {
    this.intervalGet();
    this.getTimeConfig();
  },
  methods: {
    /**
     * 每隔一分钟获取一次系统时间
     */
    intervalGet() {
      this.getSystemTime();
      const timer = setInterval(this.getSystemTime, 5 * 1000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    /**
     * 获取系统时间
     */
    async getSystemTime() {
      try {
        const result = await this.$request({
          url: "/gov/api/sys/time/systemtime",
          method: "GET",
        });

        if (result) {
          this.currentTime = result;
        }
      } catch (e) {
        this.$message.error("获取当前系统时间失败");
      }
    },
    /**
     * 获取时间配置
     */
    async getTimeConfig() {
      try {
        const { ntpServer, timeInterval, timeUnit } = await this.$request({
          url: "/gov/api/sys/time/timecfg",
          method: "GET",
        });
        if (ntpServer) {
          this.ntpModel.ntpServer = ntpServer;
        }
        if (timeInterval) {
          this.ntpModel.timeInterval = timeInterval;
        }
        if (timeUnit) {
          this.ntpModel.timeUnit = timeUnit;
        }
      } catch (e) {
        this.$message.error("获取时间配置失败");
      }
    },
    /**
     * 保存时间配置
     */
    saveTimeConfig() {
      this.$refs["ntpForm"].validate(async (valid) => {
        if (valid) {
          try {
            const { ntpServer, timeInterval, timeUnit } = this.ntpModel;
            await this.$request({
              url: "/gov/api/sys/time/timecfg",
              method: "POST",
              data: {
                ntpServer,
                timeInterval:
                  timeInterval || timeInterval === 0 ? timeInterval + "" : "",
                timeUnit,
              },
            });
            this.$message.success("保存时间配置成功");

            this.getTimeConfig();
          } catch (e) {
            this.$message.error("保存时间配置失败");
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.time-config-container {
  padding: 10px 15px;

  .time-header {
    padding-top: 10px;
    padding-bottom: 20px;
    font-size: var(--font-size-16);
    font-weight: bold;
    line-height: 1;
  }

  .current-time-box {
    display: flex;

    .current-text {
      padding-right: 10px;
    }
  }

  .ntp-server-config {
    .ntp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid rgb(238, 238, 238);
      padding-bottom: 10px;
      .ntp-header-title {
        font-weight: bold;
      }
    }

    .ntp-form {
      padding: 15px 0;

      .el-input-number {
        width: 200px;
        .el-input {
          width: auto;
        }
      }

      .el-select {
        margin-left: 10px;
        .el-input {
          width: 120px;
        }
      }
    }
  }
}
</style>
