<template>
  <div class="filter-bar-container">
    <div>
      <!-- 选择时间 -->
      <TimeController
        v-if="hasTimeControl"
        :time-info="timeInfo"
        @change="handleTimeChange"
      />
      <transition-group name="list-complete">
        <component
          :is="getComponentByMode(item.filterMode)"
          v-for="item in selectedFilterList"
          :key="item.code"
          :title="item.name"
          :meta="item"
          class="list-complete-item"
          :class="{ animated: hasAnimated }"
          :compare-options="compareOptions"
          @trigger="handleTrigger"
          @delete-filter="handleDelete"
        >
        </component>
        <div key="filter-operators" class="list-complete-item">
          <AddFilter
            :page-type="pageType"
            :selected-filters="selectedFilters"
            @add-filter="handleAddFilter"
          />
          <el-popconfirm
            popper-class="filter-bar-clear-all-confirm"
            title="确定要删除所有过滤器吗？"
            @onConfirm="handleClearAllClick"
          >
            <div
              v-show="selectedFilters.length > 0"
              slot="reference"
              class="clear-all"
              title="清除全部过滤器"
            >
              清除全部
            </div>
          </el-popconfirm>
        </div>
        <!-- 添加过滤 -->
      </transition-group>
    </div>
  </div>
</template>
<script>
import MultiSelect from "@/components/MultiSelect";
import ScoreSelect from "@/components/ScoreSelect";
import NumberSelect from "@/components/NumberSelect";
import TimeSelect from "@/components/TimeSelect";
import SearchSelect from "@/components/SearchSelect";
import AddFilter from "@/components/AddFilter";
import SaveDialog from "@/components/SaveDialog";
import SavedFilters from "@/components/SavedFilters";
import ExploreTime from "@/components/exploreTime";
import OperateBar from "@/components/OperateBar";
import BusFactory from "vue-happy-bus";
import { deepClone } from "./common/js/util";
import { mapGetters, mapMutations } from "vuex";
import { INSIGHT } from "@/store/type";
import {
  saveFilterConditionAsync,
  getFilterTypeValueAsync,
  getFilterTypesAsync,
} from "./api/filter";
import { ALL_PAGE_TYPE_MIXIN, VALUE_LIST_MIXIN } from "./common/js/mixins";
import { BUS, FILTER_MODE, TIME, PAGE_TYPE } from "./common/js/constant";
import TimeController from "@/components/TimeController";

// filterMode 与过滤器组件的映射
const COMPONENT_MAP = {
  1: "multi-select",
  2: "multi-select",
  3: "multi-select",
  4: "score-select",
  5: "number-select",
  6: "time-select",
  7: "search-select",
};

// const TIME_MAP = {
//   '1hour': '最近1小时',
//   '1day': '最近1天',
//   '7day': '最近7天',
//   '30day': '最近30天',
//   '3mon': '最近3个月',
//   '6mon': '最近6个月',
//   '1year': '最近1年',
//   'all': '所有时间'
// }

export default {
  name: "FilterBar",
  components: {
    TimeController,
    MultiSelect,
    AddFilter,
    SaveDialog,
    SavedFilters,
    ScoreSelect,
    NumberSelect,
    TimeSelect,
    SearchSelect,
    ExploreTime,
    OperateBar,
  },
  mixins: [ALL_PAGE_TYPE_MIXIN, VALUE_LIST_MIXIN],
  props: {
    paramCanBeSavedFilters: {
      // 直接传递给过滤栏条件
      type: Array,
      default() {
        return [];
      },
    },
    paramTimeInfo: {
      // 直接传递给过滤栏时间
      type: Object,
      default: null,
    },
    paramFilterInfo: {
      // 直接传递给过滤栏，覆盖可能存在的过滤器
      type: Object,
      default: null,
    },
    paramFiltersInfo: {
      // 多个过滤信息，直接传递给过滤栏，覆盖可能存在的过滤器
      type: Array,
      default: null,
    },
    // 是否显示所有时间过滤
    hasTimeControl: {
      type: Boolean,
      default: true,
    },
    // 是否显示对过滤条件的增删查
    hasSaveFilter: {
      type: Boolean,
      default: true,
    },
    showOperateBar: {
      type: Boolean,
      default: false,
    },
    compareOptions: {
      type: Array,
      default: () => [],
    },
    hasAnimated: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 是否显示保存对话框
      saveDialogVisible: false,
      // showExploreTime: false,
      // exploreTimeText: '', // 显示的文本
      bus: BusFactory(this),
    };
  },
  computed: {
    ...mapGetters("insight", [
      "selectedFilters",
      "canBeSavedFilters",
      "timeInfo",
    ]),
    selectedFilterList() {
      return deepClone(this.selectedFilters);
    },
    isDetail() {
      return this.pageType.startsWith("detail-");
    },
    showDispose() {
      return (
        [PAGE_TYPE.LIST_EXCEPTION, PAGE_TYPE.LIST_THREAT].indexOf(
          this.pageType
        ) !== -1
      );
    },
  },
  async mounted() {
    if (this.paramTimeInfo == null) {
      this._setTimeInfo();
    } else {
      // 直接使用现成的
      this._setTimeInfoUsingParam();
    }
    if (
      this.paramCanBeSavedFilters.length === 0 &&
      this.paramFilterInfo == null &&
      this.paramFiltersInfo == null
    ) {
      this._addRecoverDataToSelectedFilters();
    } else {
      // 直接使用现成的
      this._setCanBeSavedFiltersWithRecoverSelectedFiltersUsingParam();
    }
  },
  methods: {
    ...mapMutations("insight", {
      /* selectedFilters */
      pushToSelectedFilters: INSIGHT.PUSH_TO_SELECTED_FILTERS,
      clearSelectedFilters: INSIGHT.CLEAR_SELECTED_FILTERS,
      deleteSelectedFiltersItem: INSIGHT.DELETE_SELECTED_FILTERS_ITEM,
      replaceSelectedFiltersItem: INSIGHT.REPLACE_SELECTED_FILTERS_ITEM,
      setSelectedFilters: INSIGHT.SET_SELECTED_FILTERS,
      /* canBeSavedFilters */
      clearCanBeSavedFilters: INSIGHT.CLEAR_CAN_BE_SAVED_FILTERS,
      deleteCanBeSavedFiltersItem: INSIGHT.DELETE_CAN_BE_SAVED_FILTERS_ITEM,
      replaceCanBeSavedFiltersItem: INSIGHT.REPLACE_CAN_BE_SAVED_FILTERS_ITEM,
      pushToCanBeSavedFilters: INSIGHT.PUSH_TO_CAN_BE_SAVED_FILTERS,
      setCanBeSavedFilters: INSIGHT.SET_CAN_BE_SAVED_FILTERS,
      setTimeInfo: INSIGHT.SET_TIME_INFO,
    }),
    /**
     * 处理<AddFilter>组件@add-filter事件
     *
     * @param filter 刚被选中的过滤器，类型为 Filter
     *
     */
    handleAddFilter(filter) {
      // this.selectedFilters.push(filter)
      this.pushToSelectedFilters(filter);
    },
    // 清除全部
    handleClearAllClick() {
      // this.selectedFilters = []
      this.clearSelectedFilters();
      if (this.canBeSavedFilters.length > 0) {
        // this.canBeSavedFilters = []
        this.clearCanBeSavedFilters();
        BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
          data: [],
          conditionId: "",
          recoverFromVuex: false,
        });
      }
      setTimeout(() => {
        this.$notify({
          title: "清除成功",
          message: "已清除全部过滤器",
          type: "success",
        });
      }, 500);
    },
    handleTimeChange(timeInfo) {
      this.setTimeInfo(timeInfo);
      BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
        data: this.timeInfo,
        recoverFromVuex: false,
      });
    },
    /*
    handleSelectTime (text, code) {
      this.exploreTimeText = text
      this.showExploreTime = false
      const timeInfo = {
        startTime: '',
        endTime: '',
        quickTime: code
      }
      if (equals(timeInfo, this.timeInfo)) {
        this.$message({
          message: '时间信息没有改变',
          type: 'warning'
        })
        return
      }
      this.setTimeInfo(timeInfo)
      BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
        data: deepClone(this.timeInfo),
        recoverFromVuex: false
      })
    },
    */
    /*
    handleConfirmTime (startTime, endTime) {
      let startIndex = startTime.lastIndexOf('.000')
      let endIndex = endTime.lastIndexOf('.000')
      startTime = startTime.substring(0, startIndex)
      endTime = endTime.substring(0, endIndex)
      this.exploreTimeText = startTime + '-' + endTime
      this.showExploreTime = false
      const timeInfo = {
        startTime,
        endTime,
        quickTime: ''
      }
      if (equals(timeInfo, this.timeInfo)) {
        this.$message('时间信息没有改变')
        return
      }
      this.setTimeInfo(timeInfo)
      BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
        data: deepClone(this.timeInfo),
        recoverFromVuex: false
      })
    },
    */
    // 显示保存对话框
    handleGoToSave() {
      if (this.canBeSavedFilters.length === 0) {
        this.$message({
          message: "当前没有可保存的过滤条件",
          type: "warning",
        });
        return;
      }
      this.saveDialogVisible = true;
    },
    // 根据 filterMode 获取组件名
    getComponentByMode(filterMode) {
      return COMPONENT_MAP[filterMode];
    },
    // 保存当前所有的过滤条件
    async handleSave(saveForm) {
      let conditions = [];
      this.canBeSavedFilters.map((filter) => {
        let {
          code,
          filterMode,
          status: { startValue, endValue, operator, options },
        } = filter;
        const valueList = this._getValueListByOptions(options);
        conditions.push({
          code,
          startValue,
          endValue,
          operator,
          filterMode,
          valueList,
        });
      });
      const { name, desc } = saveForm;
      const res = await saveFilterConditionAsync(this.pageType, {
        name,
        desc,
        conditions,
      });
      if (res.status === "success") {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
        });
      }
    },
    // 某下拉框消失时，触发（被触发，说明有实质性操作）
    handleTrigger(filter) {
      const { filterMode, code: filterCode } = filter;
      // 判断该过滤器是否已经存在
      let targetFilterIndex = this.canBeSavedFilters.findIndex((filter) => {
        return filter.code === filterCode;
      });
      const isExist = targetFilterIndex !== -1;

      let flag = false;
      if (this._isMultiSelect(filterMode)) {
        // 如果是多选组件
        const { allUnchecked } = filter.remarks;
        if (isExist && allUnchecked) {
          // 存在且都未选中，直接从canBeSavedFilters中移除该过滤器
          // this.canBeSavedFilters.splice(targetFilterIndex, 1)
          this.deleteCanBeSavedFiltersItem(targetFilterIndex);
          flag = true;
        }
      }
      if (!flag) {
        if (isExist) {
          // 存在则替换
          // this.canBeSavedFilters.splice(targetFilterIndex, 1, filterData)
          this.replaceCanBeSavedFiltersItem({
            index: targetFilterIndex,
            newFilter: filter,
          });
        } else {
          // 不存在则添加
          // this.canBeSavedFilters.push(filter)
          this.pushToCanBeSavedFilters(filter);
        }
      }
      BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
        data: deepClone(this.canBeSavedFilters),
        conditionId: "",
        recoverFromVuex: false,
      });
    },
    // 删除某个过滤器
    handleDelete(filterCode) {
      let index = this.selectedFilters.findIndex((filter) => {
        return filter.code === filterCode;
      });
      if (index !== -1) {
        // this.selectedFilters.splice(index, 1)
        this.deleteSelectedFiltersItem(index);
      }
      index = this.canBeSavedFilters.findIndex((filter) => {
        return filter.code === filterCode;
      });
      if (index !== -1) {
        // this.canBeSavedFilters.splice(index, 1)
        this.deleteCanBeSavedFiltersItem(index);
        BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
          data: deepClone(this.canBeSavedFilters),
          conditionId: "",
          recoverFromVuex: false,
        });
      }
    },
    // 点击某已保存过滤条件，恢复
    async handleRecover(detailList, conditionId) {
      this._recoverSelectedFilters(detailList);
      this._recoverCanBeSavedFilters(detailList, conditionId);
    },
    // 从详情页返回时，从 vuex 中的 canBeSavedFilters 中为 selectedFilters 添加 recoverData
    async _addRecoverDataToSelectedFilters() {
      if (this.canBeSavedFilters.length > 0) {
        let selectedFilters = deepClone(this.selectedFilters);
        selectedFilters = await Promise.all(
          selectedFilters.map(async (filter) => {
            let targetFilter = this.canBeSavedFilters.find((item) => {
              return item.code === filter.code;
            });
            if (targetFilter) {
              let {
                filterMode,
                /* sourceValue, */ status: {
                  operator,
                  startValue,
                  endValue,
                  options,
                },
              } = targetFilter;
              let recoverData;
              if (this._isMultiSelect(filterMode)) {
                // 多选组件
                recoverData = {
                  options: deepClone(options),
                };
              } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
                // 分值组件
                recoverData = {
                  startValue,
                  endValue,
                };
              } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
                // 数值组件
                recoverData = {
                  operator,
                  startValue,
                  endValue,
                };
              } else if (filterMode === FILTER_MODE.TIME_SELECT) {
                // 时间组件
                recoverData = {
                  operator,
                  startValue,
                  endValue,
                };
              } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
                // 搜索组件
                recoverData = {
                  startValue,
                };
              }
              this.$set(filter, "recoverData", recoverData);
            }
            return filter;
          })
        );
        this.setSelectedFilters(selectedFilters);
        BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
          data: deepClone(this.canBeSavedFilters),
          conditionId: "",
          recoverFromVuex: true, // 为true表示是从Vuex恢复
        });
      }
    },
    // 使用现成的恢复canBeSavedFilters和selectedFilters
    async _setCanBeSavedFiltersWithRecoverSelectedFiltersUsingParam() {
      let canBeSavedFilters = deepClone(this.paramCanBeSavedFilters);
      let selectedFilters = await Promise.all(
        canBeSavedFilters.map(async (filter) => {
          let {
            filterMode,
            /* sourceValue, */ status: {
              operator,
              startValue,
              endValue,
              options,
            },
          } = filter;
          let recoverData;
          if (this._isMultiSelect(filterMode)) {
            // 多选组件
            recoverData = {
              options: deepClone(options),
            };
          } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
            // 分值组件
            recoverData = {
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
            // 数值组件
            recoverData = {
              operator,
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.TIME_SELECT) {
            // 时间组件
            recoverData = {
              operator,
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
            // 搜索组件
            recoverData = {
              startValue,
            };
          }
          this.$set(filter, "recoverData", recoverData);
          return filter;
        })
      );
      this.setCanBeSavedFilters(canBeSavedFilters);
      this.setSelectedFilters(selectedFilters);

      let filtersInfo = [];
      if (this.paramFiltersInfo) {
        filtersInfo = deepClone(this.paramFiltersInfo);
      }
      if (this.paramFilterInfo) {
        filtersInfo.push(this.paramFilterInfo);
      }
      // 覆盖或添加新的过滤器
      if (filtersInfo.length > 0) {
        await Promise.all(
          filtersInfo.map(async (currentFilterInfo) => {
            const filterList = await getFilterTypesAsync(this.pageType);
            let { type, value } = currentFilterInfo;
            let targetFilter = null;
            filterList.map((group) => {
              group.children.map((child) => {
                if (child.name === type) {
                  targetFilter = deepClone(child);
                }
              });
            });

            let { filterMode, sourceValue } = targetFilter;
            let other = {};
            if (this._isMultiSelect(filterMode)) {
              // 多选组件
              let data;
              try {
                data = await getFilterTypeValueAsync(filterMode, sourceValue);
              } catch (e) {
                data = {
                  tree: [],
                  list: [],
                };
              }

              let options =
                filterMode === FILTER_MODE.MULTI_SELECT_3
                  ? data.tree
                  : data.list;
              let valueList = [];
              if (filterMode !== FILTER_MODE.MULTI_SELECT_3) {
                // 只有一级列表（多选1和多选2）
                options.map((option) => {
                  if (value === option.name) {
                    valueList = [option.code];
                  }
                });
              } else {
                // 有二级列表（多选3）
                options.map((option) => {
                  option.children.map((child) => {
                    if (value === child.name) {
                      valueList = [child.code];
                    }
                  });
                });
              }
              other = {
                status: {
                  options: this._getOptionsByValueList(
                    filterMode,
                    options,
                    valueList
                  ),
                },
                remarks: {
                  allUnchecked: false,
                },
              };
            } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
              // 分值组件
              other = {
                status: {
                  // startValue,
                  // endValue
                },
              };
            } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
              // 数值组件
              other = {
                status: {
                  // operator,
                  // startValue,
                  // endValue
                },
              };
            } else if (filterMode === FILTER_MODE.TIME_SELECT) {
              // 时间组件
              let [startTime, endTime] = this._getDateTimeField(value);
              other = {
                status: {
                  operator: "between",
                  startValue: startTime,
                  endValue: endTime,
                },
              };
            } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
              // 搜索组件
              other = {
                status: {
                  startValue: value,
                },
              };
            }
            let filter = Object.assign({}, targetFilter, other);

            let selectedFilter = deepClone(filter);
            let {
              status: { operator, startValue, endValue, options },
            } = selectedFilter;
            filterMode = selectedFilter.filterMode;
            let recoverData = {};
            if (this._isMultiSelect(filterMode)) {
              // 多选组件
              recoverData = {
                options: deepClone(options),
              };
            } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
              // 分值组件
              recoverData = {
                startValue,
                endValue,
              };
            } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
              // 数值组件
              recoverData = {
                operator,
                startValue,
                endValue,
              };
            } else if (filterMode === FILTER_MODE.TIME_SELECT) {
              // 时间组件
              recoverData = {
                operator,
                startValue,
                endValue,
              };
            } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
              // 搜索组件
              recoverData = {
                startValue,
              };
            }
            this.$set(selectedFilter, "recoverData", recoverData);

            let exist = false;
            for (let i = 0; i < this.canBeSavedFilters.length; i++) {
              // 存在则替换
              let item = this.canBeSavedFilters[i];
              if (item.code === filter.code) {
                exist = true;
                this.replaceCanBeSavedFiltersItem({
                  index: i,
                  newFilter: filter,
                });
                this.replaceSelectedFiltersItem({
                  index: i,
                  newFilter: selectedFilter,
                });
              }
            }
            if (!exist) {
              // 不存在则添加
              this.pushToCanBeSavedFilters(filter);
              this.pushToSelectedFilters(selectedFilter);
            }

            BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
              data: deepClone(this.canBeSavedFilters),
              conditionId: "",
              jumpFromOverview: true, // 为true表示是从overview跳转过来的
            });
          })
        );
      } else {
        BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
          data: deepClone(this.canBeSavedFilters),
          conditionId: "",
          jumpFromOverview: true, // 为true表示是从overview跳转过来的
        });
      }
    },
    // 设置timeInfo
    _setTimeInfo() {
      if (this.timeInfo == null) {
        // 第一次进入
        this.setTimeInfo({
          startTime: "",
          endTime: "",
          quickTime: TIME.DEFAULT_QUICK_TIME,
        });
        // this.exploreTimeText = TIME_MAP[TIME.DEFAULT_QUICK_TIME]
        // 第一次进入不触发
        // BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
        //   data: deepClone(this.timeInfo),
        //   recoverFromVuex: false
        // })
      } else {
        // 从 vuex 中恢复
        // const { startTime, endTime, quickTime } = this.timeInfo
        // if (quickTime !== '') {
        //   this.exploreTimeText = TIME_MAP[quickTime]
        // } else {
        //   this.exploreTimeText = startTime + ' - ' + endTime
        // }
        BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
          data: deepClone(this.timeInfo),
          recoverFromVuex: true,
        });
      }
    },
    // 使用现成的恢复timeInfo
    _setTimeInfoUsingParam() {
      this.setTimeInfo(deepClone(this.paramTimeInfo));
      // const { startTime, endTime, quickTime } = this.timeInfo
      // if (quickTime !== '') {
      //   this.exploreTimeText = TIME_MAP[quickTime]
      // } else {
      //   this.exploreTimeText = startTime + ' - ' + endTime
      // }
      BusFactory.$emit(BUS.TIME_INFO_CHANGE, {
        data: deepClone(this.timeInfo),
        jumpFromOverview: true,
      });
    },
    // 点击已保存，恢复selectedFilters
    async _recoverSelectedFilters(detailList) {
      // this.selectedFilters = []
      this.clearSelectedFilters();
      let list = [];
      await Promise.all(
        detailList.map(async (filter) => {
          let {
            code,
            filterMode,
            name,
            sourceValue,
            operator,
            startValue,
            endValue,
            valueList,
          } = filter;
          let recoverData;
          if (this._isMultiSelect(filterMode)) {
            // 多选组件
            let data;
            try {
              data = await getFilterTypeValueAsync(filterMode, sourceValue);
            } catch (e) {
              data = {
                tree: [],
                list: [],
              };
            }

            let options =
              filterMode === FILTER_MODE.MULTI_SELECT_3 ? data.tree : data.list;
            recoverData = {
              options: this._getOptionsByValueList(
                filterMode,
                options,
                valueList
              ),
            };
          } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
            // 分值组件
            recoverData = {
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
            // 数值组件
            recoverData = {
              operator,
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.TIME_SELECT) {
            // 时间组件
            recoverData = {
              operator,
              startValue,
              endValue,
            };
          } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
            // 搜索组件
            recoverData = {
              startValue,
            };
          }

          list.push({
            code,
            filterMode,
            name,
            sourceValue,
            recoverData,
          });
          return filter;
        })
      );
      // this.selectedFilters = list
      this.setSelectedFilters(list);
    },
    // 点击已保存，恢复canBeSavedFilters
    async _recoverCanBeSavedFilters(detailList, conditionId) {
      // this.canBeSavedFilters = []
      this.clearCanBeSavedFilters();
      let list = [];
      // 根据恢复 canBeSavedFilters
      await Promise.all(
        detailList.map(async (filter) => {
          let {
            code,
            filterMode,
            name,
            sourceValue,
            operator,
            startValue,
            endValue,
            valueList,
          } = filter;
          let filterItem = {
            code,
            filterMode,
            sourceValue,
            name,
          };
          let other = {};
          if (this._isMultiSelect(filterMode)) {
            // 多选组件
            let data;
            try {
              data = await getFilterTypeValueAsync(filterMode, sourceValue);
            } catch (e) {
              data = {
                tree: [],
                list: [],
              };
            }

            let options =
              filterMode === FILTER_MODE.MULTI_SELECT_3 ? data.tree : data.list;
            other = {
              status: {
                options: this._getOptionsByValueList(
                  filterMode,
                  options,
                  valueList
                ),
              },
              remarks: {
                allUnchecked: false,
              },
            };
          } else if (filterMode === FILTER_MODE.SCORE_SELECT) {
            // 分值组件
            other = {
              status: {
                startValue,
                endValue,
              },
            };
          } else if (filterMode === FILTER_MODE.NUMBER_SELECT) {
            // 数值组件
            other = {
              status: {
                operator,
                startValue,
                endValue,
              },
            };
          } else if (filterMode === FILTER_MODE.TIME_SELECT) {
            // 时间组件
            other = {
              status: {
                operator,
                startValue,
                endValue,
              },
            };
          } else if (filterMode === FILTER_MODE.SEARCH_SELECT) {
            // 搜索组件
            other = {
              status: {
                startValue,
              },
            };
          }

          list.push(Object.assign({}, filterItem, other));
        })
      );
      // this.canBeSavedFilters = list
      this.setCanBeSavedFilters(list);
      BusFactory.$emit(BUS.CAN_BE_SAVED_FILTERS_CHANGE, {
        data: deepClone(this.canBeSavedFilters),
        conditionId,
        recoverFromVuex: false,
      });
    },
    // 根据valueList获取options
    // _getOptionsByValueList (filterMode, options, valueList) {
    //   if (!this._isMultiSelect(filterMode)) {
    //     return []
    //   }
    //   // 恢复子选项的选中状态
    //   if (filterMode !== FILTER_MODE.MULTI_SELECT_3) { // 只有一级列表（多选1和多选2）
    //     return options.map(option => {
    //       option.checked = valueList.indexOf(option.code) !== -1
    //       return option
    //     })
    //   } else { // 有二级列表（多选3）
    //     return options.map(option => {
    //       option.children = option.children.map(child => {
    //         child.checked = valueList.indexOf(child.code) !== -1
    //         return child
    //       })
    //       option.checked = option.children.every(child => {
    //         return child.checked
    //       })
    //       return option
    //     })
    //   }
    // },
    // 判断是否是多选
    _isMultiSelect(filterMode) {
      return (
        filterMode === FILTER_MODE.MULTI_SELECT_1 ||
        filterMode === FILTER_MODE.MULTI_SELECT_2 ||
        filterMode === FILTER_MODE.MULTI_SELECT_3
      );
    },
    // 格式化时间段
    _getDateTimeField(date) {
      let year = parseInt(date.split("-")[0]);
      let month = parseInt(date.split("-")[1]);
      let count = 0;
      let leap = false;
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        leap = true;
      }
      switch (month) {
        case 1:
          count = 31;
          break;
        case 2:
          count = leap ? 29 : 28;
          break;
        case 3:
          count = 31;
          break;
        case 4:
          count = 30;
          break;
        case 5:
          count = 31;
          break;
        case 6:
          count = 30;
          break;
        case 7:
        case 8:
          count = 31;
          break;
        case 9:
          count = 30;
          break;
        case 10:
          count = 31;
          break;
        case 11:
          count = 30;
          break;
        case 12:
          count = 31;
          break;
      }
      if (date.length === 7) {
        return [date + "-01 00:00:00", date + `-${count} 23:59:59`];
      } else if (date.length === 10) {
        return [date + " 00:00:00", date + " 23:59:59"];
      } else {
        return [date, date];
      }
    },
  },
};
</script>
<style scoped lang="postcss">
.list-complete-item {
  vertical-align: top;
  display: inline-block;

  &.animated {
    transition: all 0.5s;
  }
}

.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.list-complete-leave-active {
  position: absolute;
}

.filter-bar-container {
  position: relative;
  width: 100%;
  min-height: 28px;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;

  .mask {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  /*.time-select-input {*/
  /*outline: none;*/
  /*width: 168px !important;*/
  /*}*/

  .multi-select-container,
  .score-select-container,
  .number-select-container,
  .add-filter-container,
  .time-select-container,
  .search-select-container,
  .saved-filters-container {
    margin-right: 10px;
    margin-bottom: 15px;
  }

  .clear-all {
    display: inline-block;
    font-size: var(--font-size-13);
    font-weight: 400;
    line-height: 24px;
    margin-top: 2px;
    color: #4a90ea;
    transition: all 0.1s;

    &:hover {
      cursor: pointer;
      font-weight: 500;
      color: #4783d8;
    }
  }
}
</style>
<style lang="postcss">
.filter-bar-clear-all-confirm {
  .el-popconfirm__action {
    margin-top: 10px;
  }
}
</style>
