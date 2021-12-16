<template>
  <el-card shadow="hover">
    <div
      class="card-data-container"
      :class="{ 'has-four': info.threeTitle && info.fourTitle }"
    >
      <div class="total-box">
        <div class="total-title">
          <span class="main-title">{{ info.title }}</span>
          <span class="sub-title">{{ info.subTitle }}</span>
        </div>
        <div class="total-count" @click="$emit('total-trigger', info)">
          {{ info.total | thousandFilter }}
        </div>
      </div>
      <div class="card-count">
        <div class="one-count-box">
          <div class="count-wrapper">
            <div class="one-count-title wrapper-title">{{ info.oneTitle }}</div>
            <div class="one-count" @click="$emit('one-trigger', info)">
              {{ info.oneCount | thousandFilter }}
            </div>
          </div>
          <div v-if="info.threeTitle" class="count-wrapper three-wrapper">
            <div class="three-count-title wrapper-title">
              {{ info.threeTitle }}
            </div>
            <div class="three-count" @click="$emit('three-trigger', info)">
              {{ info.threeCount | thousandFilter }}
            </div>
          </div>
        </div>
        <div class="two-count-box">
          <div class="count-wrapper">
            <div class="two-count-title wrapper-title">{{ info.twoTitle }}</div>
            <div class="two-count" @click="$emit('two-trigger', info)">
              {{ info.twoCount | thousandFilter }}
            </div>
          </div>
          <div v-if="info.fourTitle" class="count-wrapper four-wrapper">
            <div class="four-count-title wrapper-title">
              {{ info.fourTitle }}
            </div>
            <div class="four-count" @click="$emit('four-trigger', info)">
              {{ info.fourCount | thousandFilter }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { thousandSplit } from "@/utils/common";

export default {
  name: "ThirdDataCard",
  filters: {
    thousandFilter(val) {
      return thousandSplit(val);
    },
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        total: 0,
        title: "",
        subTitle: "",
        oneCount: 0,
        oneTitle: "",
        twoCount: 0,
        twoTitle: "",
        ThreeCount: 0,
        ThreeTitle: "",
        fourCount: 0,
        fourTitle: "",
      }),
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="postcss">
.card-data-container {
  height: 220px;
  display: flex;
  flex-direction: column;
  .total-box {
    padding-bottom: 10px;
    padding-left: 10px;
    .total-title {
      .main-title {
        font-size: 16px;
      }
      .sub-title {
        font-size: 16px;
      }
    }

    .total-count {
      margin-top: 20px;
      color: #000;
      font-size: 36px;
      font-weight: 700;
      cursor: pointer;
    }
  }

  &.has-four {
    .total-box {
      padding-bottom: 16px;
      .main-title {
        font-size: 16px;
      }
      .sub-title {
        font-size: 16px;
      }
      .total-count {
        font-size: 30px;
        margin-top: 14px;
      }
    }

    .one-count-title,
    .two-count-title,
    .three-count-title,
    .four-count-title {
      font-size: 14px;
    }

    .card-count {
      .one-count,
      .two-count,
      .three-count,
      .four-count {
        font-size: 18px;
        margin-top: 4px !important;
      }
    }
  }

  .card-count {
    display: flex;
    width: 100%;
    font-size: 16px;
    flex: 1;
    display: flex;
    align-items: center;

    .count-wrapper {
      width: 100px;

      &.three-wrapper,
      &.four-wrapper {
        margin-top: 10px;
      }
    }

    .one-count-box {
      flex: 1;
      border-right: 1px solid #f1f1f1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .one-count,
      .three-count {
        margin-top: 8px;
        color: #0ebea5;
        cursor: pointer;
        font-size: 24px;
        font-weight: 700;
      }

      .one-count {
        margin-top: 18px;
      }
    }

    .two-count-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 20px;

      .two-count,
      .four-count {
        margin-top: 8px;
        color: #4a90e2;
        cursor: pointer;
        font-size: 24px;
        font-weight: 700;
      }

      .two-count {
        margin-top: 18px;
      }
    }
  }
}

@media screen and (max-width: 1500px) {
  .card-data-container {
    .total-box {
      .total-title {
        .main-title {
          font-size: 14px;
        }
        .sub-title {
          font-size: 14px;
        }
      }
      .total-count {
        font-size: 28px;
      }
    }

    .card-count {
      .count-wrapper {
        width: 80px;
      }

      .one-count-title,
      .two-count-title,
      .three-count-title,
      .four-count-title {
        font-size: 12px;
      }
      .one-count,
      .two-count,
      .three-count,
      .four-count {
        font-size: 14px;
      }
    }
    &.has-four {
      .total-box {
        .total-title {
          .main-title {
            font-size: 12px;
          }
          .sub-title {
            font-size: 12px;
          }
        }
        .total-count {
          font-size: 28px;
        }
      }

      .card-count {
        .one-count-title,
        .two-count-title,
        .three-count-title,
        .four-count-title {
          font-size: 12px;
        }
        .one-count,
        .two-count,
        .three-count,
        .four-count {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
