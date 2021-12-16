<template>
  <div class="risk-slider-container">
    <el-slider
      class="risk-slider"
      :class="riskColor"
      :value="value"
      :step="1"
      :max="10"
      :min="1"
      show-stops
      @input="handleChange"
    >
    </el-slider>
    <span class="riskScore" :style="{ color: riskScoreColor }">
      {{ value }}
    </span>
  </div>
</template>

<script>
import { getRiskColor } from "@/components/config.js";
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      riskScore: 1,
    };
  },
  computed: {
    riskColor() {
      let num = parseFloat(this.value);
      let riskLevel = "low";
      if (num >= 8) {
        riskLevel = "high";
      } else if (num >= 5 && num < 8) {
        riskLevel = "medium";
      }
      return riskLevel;
    },
    /**
     * 分数颜色，和css颜色一致
     */
    riskScoreColor() {
      return getRiskColor(this.value);
    },
  },
  methods: {
    handleChange(val) {
      this.$emit("change", val);
    },
  },
};
</script>

<style lang="postcss" scoped>
.risk-slider-container {
  --risk-low: #f9d446;
  --risk-medium: #ff9900;
  --risk-high: #fe3235;
  display: flex;
  align-items: center;
  .risk-slider {
    &.el-slider {
      width: 300px;
      display: inline-block;
      &.low {
        >>> .el-slider__bar {
          background-color: var(--risk-low);
        }
        >>> .el-slider__button {
          border-color: var(--risk-low);
        }
      }
      &.medium {
        >>> .el-slider__bar {
          background-color: var(--risk-medium);
        }
        >>> .el-slider__button {
          border-color: var(--risk-medium);
        }
      }
      &.high {
        >>> .el-slider__bar {
          background-color: var(--risk-high);
        }
        >>> .el-slider__button {
          border-color: var(--risk-high);
        }
      }
    }
  }
  .riskScore {
    margin-left: 20px;
  }
}
</style>
