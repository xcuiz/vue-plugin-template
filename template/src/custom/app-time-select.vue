<!--
 * @Author: your name
 * @Date: 2020-07-20 16:30:57
 * @LastEditTime: 2020-07-21 11:13:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/custom/app-time-select.vue
-->
<template>
  <el-dropdown class="timeSelect" placement="bottom-start">
    <el-button size="medium">
      <idss-icon-svg name="system" />
      范围
    </el-button>
    <el-dropdown-menu slot="dropdown" class="time-select-dropdown-menu">
      <el-dropdown-item
        v-for="item in source"
        :key="item.key"
        :class="{ selected: item.key === value }"
        :label="item.label"
        @click.native="handleClick(item.key)"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AppTimeSelect",
  data() {
    return {
      value: "",
      source: [
        {
          key: "all",
          label: "全部时间",
        },
        {
          key: "1year",
          label: "最近12个月",
        },
        {
          key: "6mon",
          label: "最近6个月",
        },
        {
          key: "30day",
          label: "最近30天",
        },
        {
          key: "7day",
          label: "最近7天",
        },
      ],
    };
  },
  methods: {
    ...mapActions(global, []),
    handleClick(val) {
      this.value = val;
      this.$store.commit("global/globalTime", val);
    },
  },
};
</script>

<style lang="postcss">
.el-dropdown-menu.time-select-dropdown-menu.el-popper {
  z-index: var(--app-menu-z-index);
  --app-menu-item-sub-height: 32px;
  --app-menu-item-sub-bg: var(--guan-10-a80);
  --app-menu-item-sub-bg-hover: var(--guan-highlight-6-a40);

  background-color: var(--app-menu-item-sub-bg);
  &.el-popper[x-placement^="bottom"] {
    margin-top: 6px;
    border-radius: 0;
    border: 0;
  }
  &[x-placement^="bottom"] {
    .popper__arrow {
      display: none;
      &::after {
        display: none;
      }
    }
  }

  .el-dropdown-menu__item {
    height: var(--app-menu-item-sub-height);
    color: #fff;
    &:not(.is-disabled):hover {
      background-color: var(--app-menu-item-sub-bg-hover);
      color: #fff;
    }
    &.selected {
      background-color: var(--app-menu-item-sub-bg-hover);
    }
  }
}
</style>
<style scoped lang="postcss">
.timeSelect {
  .el-button {
    background: transparent;
    border: none;
    color: #fff;
    >>> .idss-svg-icon {
      width: 16px;
      height: 15px;
      margin-right: 5px;
      fill: var(--white);
    }
  }
}
</style>
