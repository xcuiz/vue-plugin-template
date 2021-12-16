<template>
  <div class="add-filter-container">
    <el-popover
      v-model="visible"
      class="popover-button"
      placement="bottom"
      width="180"
      trigger="click"
      popper-class="add-filter-popover-container"
      :visible-arrow="false"
    >
      <!-- 下拉框内容区域 -->
      <div class="popover-wrapper">
        <ul v-if="fields.length" class="filter-list">
          <li v-for="item in fields" :key="item.code" class="filter-item">
            <p class="group-name">
              <i class="el-icon-info"></i>
              <span>{{ item.name }}</span>
            </p>
            <ul class="sub-list">
              <li
                v-for="subItem in item.children"
                :ref="'subItems' + subItem.code"
                :key="subItem.code"
                class="sub-item"
                :style="itemStyle(subItem.code)"
                @click="handleItemClick(subItem)"
              >
                <span class="text">{{ subItem.name }}</span>
                <i
                  v-show="isChecked(subItem.code)"
                  class="check el-icon-check"
                ></i>
              </li>
            </ul>
          </li>
        </ul>
        <div v-else class="empty">暂无数据</div>
      </div>
      <!--触发下拉弹出的button-->
      <el-button
        slot="reference"
        title="添加过滤器"
        size="mini"
        class="button"
        icon="el-icon-s-operation"
        plain
        >过滤
      </el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "AddFilter",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false, // popover 可见性
    };
  },
  methods: {
    handleItemClick(data) {
      const { code } = data;
      const checked = this.isChecked(code);

      const payload = checked
        ? this.value.filter((item) => item !== code)
        : this.value.concat([code]);

      this.$emit("input", payload);
      this.$emit("item-click", data);
      setTimeout(() => {
        this.visible = false; // popover 弹框消失
      }, 300);
    },

    isChecked(code) {
      return this.value.indexOf(code) !== -1;
    },

    itemStyle(code) {
      let color = this.isChecked(code) ? "#999" : "#606266";
      return {
        color,
      };
    },
  },
};
</script>
<!--scoped-->
<style scoped lang="postcss">
.add-filter-container {
  display: inline-block;
  vertical-align: top;

  .popover-button {
    .button {
      width: 61px;
      height: 28px;
      line-height: 28px;
      padding: 0;
      color: #3c5679;
      border: 1px solid #b5bfcc;
      transition: all 0.2s;

      &:hover {
        box-shadow: 1px 2px 3px 0.06px;
        color: #fff;
        background-color: rgba(74, 144, 226, 1);
      }

      >>> i {
        font-size: var(--font-size-14);
      }

      >>> span {
        font-size: var(--font-size-14);
        margin-left: 2px;
      }
    }
  }
}
</style>
<!--global:慎用，加前缀-->
<style lang="postcss">
.add-filter-popover-container {
  margin-top: 5px !important;
  padding: 0;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .popover-wrapper {
    .filter-list {
      padding: 5px 20px 5px 10px;
      max-height: 412px;
      overflow: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 4px;
      }

      /*滚动条滑块*/

      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.2);
      }

      /*滚动条轨道*/

      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        background: rgba(255, 255, 255, 0);
      }

      .filter-item {
        .group-name {
          height: 30px;
          line-height: 30px;
          color: #8b9aaf;
          font-size: var(--font-size-13);

          span {
            margin-left: 5px;
          }
        }

        .sub-list {
          padding-left: 10px;

          .sub-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 25px;
            line-height: 25px;
            cursor: pointer;
            font-size: var(--font-size-13);
          }
        }
      }
    }

    .empty {
      font-size: var(--font-size-13);
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
}
</style>
