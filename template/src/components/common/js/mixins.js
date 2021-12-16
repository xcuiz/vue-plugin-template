import { isNumber, deepClone, animateCSS } from "./util";
import $ from "jquery";
import {
  getLatestAsync,
  getCategoryAsync,
  getScoreAsync,
  getOppositeAsync,
  getWatchAsync,
  getUserWatchAsync,
  getTimeLineAsync,
  getExceptionTrendDataAsync,
  getThreatTrendDataAsync,
  getSituationAsync,
  getDisposeAsync,
  getRankDataAsync,
  getThreatRelatedAsync,
  getExceptionRelatedAsync,
  getJobStateAsync,
  getAddressAsync,
  getDepartmentAsync,
  getValueAsync,
  getProfileAsync,
  getDeviceStateAsync,
  getSuccessDataAsync,
  getAccessDataAsync,
  getFailUserDataAsync,
  getFailDeviceDataAysnc,
  getTargetDeviceDataAsync,
  getSourceDeviceDataAsync,
  getUserStatusAsync,
  getDeviceStatusAsync,
} from "@/components/api/overview";

import { PAGE_TYPE, FILTER_MODE } from "./constant";
import { mapMutations } from "vuex";
import { INSIGHT } from "@/store/type";

import storage from "good-storage";

const ALL_PAGE_TYPE_MIXIN = {
  props: {
    pageType: {
      type: String,
      required: false,
      validator(pageType) {
        let res = [];
        for (let key in PAGE_TYPE) {
          if (PAGE_TYPE.hasOwnProperty(key)) {
            res.push(PAGE_TYPE[key]);
          }
        }
        return res.indexOf(pageType) !== -1;
      },
    },
  },
};

const LIST_PAGE_TYPE_MIXIN = {
  props: {
    toPageType: {
      // 要前往的列表页面
      type: String,
      required: false,
      validator(pageType) {
        return (
          [
            PAGE_TYPE.LIST_USER,
            PAGE_TYPE.LIST_APPLICATION,
            PAGE_TYPE.LIST_DATA,
            PAGE_TYPE.LIST_DEVICE,
            PAGE_TYPE.LIST_PROGRAM,
            PAGE_TYPE.LIST_EXCEPTION,
            PAGE_TYPE.LIST_THREAT,
          ].indexOf(pageType) !== -1
        );
      },
    },
  },
};

const IS_DETAIL_MIXIN = {
  computed: {
    isDetail() {
      return this.pageType.startsWith("detail-");
    },
  },
};

const DETAIL_ID_MIXIN = {
  props: {
    detailId: {
      type: String,
      required: false,
      default: "",
    },
  },
};

const GET_DETAIL_ID_MIXIN = {
  methods: {
    getDetailIdObj(pageType, detailId) {
      let detailIdObj = {};
      switch (pageType) {
        case PAGE_TYPE.DETAIL_EXCEPTION:
          detailIdObj = {
            anomalyId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_THREAT:
          detailIdObj = {
            threatId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_USER_EXCEPTION:
        case PAGE_TYPE.DETAIL_USER_THREAT:
          detailIdObj = {
            userId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_APPLICATION_EXCEPTION:
        case PAGE_TYPE.DETAIL_APPLICATION_THREAT:
          detailIdObj = {
            appId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_PROGRAM_EXCEPTION:
        case PAGE_TYPE.DETAIL_PROGRAM_THREAT:
          detailIdObj = {
            programId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_DATA_EXCEPTION:
        case PAGE_TYPE.DETAIL_DATA_THREAT:
          detailIdObj = {
            dataId: detailId,
          };
          break;
        case PAGE_TYPE.DETAIL_DEVICE_EXCEPTION:
        case PAGE_TYPE.DETAIL_DEVICE_THREAT:
          detailIdObj = {
            deviceId: detailId,
          };
          break;
      }
      return detailIdObj;
    },
  },
};

const VALUE_LIST_MIXIN = {
  methods: {
    /**
     * 判断一个列表选项是否有子列表
     * @param option
     * @returns {*|boolean}
     */
    haveChildren(option) {
      return option.children && option.children.length > 0;
    },
    // 获取valueList
    _getValueListByOptions(options = []) {
      const res = [];
      if (options.length === 0) {
        return res;
      }
      options.map((option) => {
        if (this.haveChildren(option)) {
          // 有二级列表
          option.children.map((child) => {
            if (child.checked) {
              res.push(child.code);
            }
          });
        } else {
          // 只有一级列表
          if (option.checked) {
            res.push(option.code);
          }
        }
      });
      return res;
    },
    // 根据valueList获取options
    _getOptionsByValueList(filterMode, options, valueList) {
      if (!this._isMultiSelect(filterMode)) {
        return [];
      }
      // 恢复子选项的选中状态
      if (filterMode !== FILTER_MODE.MULTI_SELECT_3) {
        // 只有一级列表（多选1和多选2）
        return options.map((option) => {
          option.checked = valueList.indexOf(option.code) !== -1;
          return option;
        });
      } else {
        // 有二级列表（多选3）
        return options.map((option) => {
          option.children = option.children.map((child) => {
            child.checked = valueList.indexOf(child.code) !== -1;
            return child;
          });
          option.checked = option.children.every((child) => {
            return child.checked;
          });
          return option;
        });
      }
    },
  },
};

const formatTableDataMixin = {
  methods: {
    // 格式化表格数据
    _formatTableData(tableData) {
      return tableData.map((row) => {
        // row为一行的数据
        for (let key in row) {
          if (row.hasOwnProperty(key)) {
            // 遍历row中的每一个属性
            let value = row[key]; // key 为属性名，value 为属性值
            if (value instanceof Array) {
              // 默认后台返回的每一个属性的值都为数组
              if (value.length === 1) {
                // 数组长度为1，除了参与者、异常类型、威胁类型，其余属性直接去掉数组，抹平
                if (
                  key !== "participator" &&
                  key !== "mt_insight_anomaly_base_name" &&
                  key !== "mt_insight_threat_base_name"
                ) {
                  if (isNumber(value[0]) && !key.endsWith("_name")) {
                    // 将数值型的转为数字类型 不对_name字段处理
                    row[key] = parseFloat(value[0]);
                  } else {
                    // 其余类型的字符串直接赋值
                    row[key] = value[0];
                  }
                }
              } else if (value.length === 0) {
                // 数组长度为0，表示空
                if (this.isScore(key)) {
                  row[key] = 0;
                } else {
                  row[key] = "";
                }
              } else {
                // 多个元素
                row[key] = value.map((item) => {
                  if (isNumber(item)) {
                    item = parseFloat(item);
                  }
                  return item;
                });
              }
            }
          }
        }
        return row;
      });
    },
  },
};

const cellDataMixin = {
  methods: {
    // 获取每个单元格数据
    getCellData(scope, column) {
      return scope.row[this.fieldKey(column)];
    },
    fieldKey(column) {
      if (column.field === "participator") {
        return column.field;
      }
      return column.fromTable + "_" + column.field;
    },
    // 是否是score
    isScore(field) {
      return !!field.endsWith("_score");
    },
    isSortable(code) {
      const codesWithPageType = {
        "list-exception": [
          "anomalyName",
          "anomalyData",
          "anomalyScore",
          "anomalyModel",
          "anomalyStartTime",
          "anomalyEndTime",
          "anomalyFundTime",
        ],
        "list-threat": [
          "threatName",
          "threatData",
          "threatScore",
          "threatModel",
          "threatStartTime",
          "threatEndTime",
          "threatFundTime",
          "threatSummary",
        ],
        "list-user": [
          "userName",
          "accountName",
          "userEmail",
          "userCellPhone",
          "userPhone",
          "userState",
          "userType",
          "jobState",
          "userAnomalyNum",
          "userThreatNum",
          "userScore",
          "userStation",
          "userDept",
          "userLocation",
          "userLogin",
          "userDevice",
          "userApp",
        ],
        "list-device": [
          "deviceName",
          "deviceIP",
          "deviceType",
          "deviceState",
          "deviceAnomalyNum",
          "deviceThreatNum",
          "deviceScore",
          "deviceDept",
          "deviceOwner",
          "deviceNet",
          "deviceVendor",
          "deviceValue",
          "deviceUUID",
        ],
        "list-application": [
          "appName",
          "appType",
          "appAnomalyNum",
          "appThreatNum",
          "appScore",
          "appDept",
          "appNet",
          "appOwner",
          "appVendor",
          "appValue",
          "appIP",
          "appPort",
          "appURL",
          "appUUID",
        ],
        "list-program": [
          "programName",
          "programAnomalyNum",
          "programThreatNum",
          "programScore",
        ],
        "list-data": [
          "dataName",
          "dataType",
          "dataState",
          "dataAnomalyNum",
          "dataThreatNum",
          "dataScore",
          "dataDept",
          "dataOwner",
          "dataTable",
          "dataBase",
          "dataApp",
          "dataIP",
          "dataValue",
          "dataUUID",
        ],
      };
      // 异常回收站与异常列表一致 复用异常列表配置
      codesWithPageType["rule-recycle-exception"] =
        codesWithPageType["list-exception"];
      const sortableCodes = codesWithPageType[this.pageType] || [];
      return sortableCodes.indexOf(code) !== -1;
    },
    isUser(field) {
      return !!field.endsWith("person_name");
    },
    isDevice(field) {
      return !!field.endsWith("device_name");
    },
    isApp(field) {
      return !!field.endsWith("app_name");
    },
    isData(field) {
      return !!field.endsWith("data_name");
    },
    isProgram(field) {
      return !!field.endsWith("program_name");
    },
  },
};

const LOADING_DELAY = 1000;
const OVERVIEW_MIXIN = {
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      successData: {
        // 分析总览，登录成功设备类型
        data: [],
        loading: true,
      },
      accessData: {
        // 分析总览，被访问的数据类型
        data: [],
        loading: true,
      },
      failUserData: {
        // 分析总览，登录失败的用户
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      failDeviceData: {
        // 分析总览，登录失败的设备
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      sourceDeviceData: {
        // 分析总览，源设备传输数据
        data: [],
        total: 0,
        totalNum: 0,
        top: 0,
        loading: true,
      },
      targetDeviceData: {
        // 分析总览，目标设备传输数据
        data: [],
        total: 0,
        totalNum: 0,
        top: 0,
        loading: true,
      },
      latestData: {
        // 最新异常/威胁
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      homeLatestThreatData: {
        // 首页最新威胁
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      homeLatestExceptionData: {
        // 首页最新异常
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      categoryData: {
        // 异常/威胁分类，用户在职状态/应用类型/数据类型/设备类型
        data: [],
        loading: true,
      },
      scoreData: {
        // 异常/威胁评分
        data: [],
        loading: true,
      },
      userStatusData: {
        // 用户状态
        data: [],
        loading: true,
      },
      deviceStatusData: {
        // 设备状态
        data: [],
        loading: true,
      },
      oppositeData: {
        // 异常组成的威胁/威胁中的异常
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      watchData: {
        // 异常/威胁观察列表
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      userWatchData: {
        // 用户观察列表中的异常
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      timelineData: {
        // 异常/威胁时间表
        data: [],
        loading: true,
      },
      exceptionTrendData: {
        // 异常趋势
        data: {},
        loading: true,
      },
      threatTrendData: {
        // 威胁趋势
        data: {},
        loading: true,
      },
      situationData: {
        // 威胁现状
        data: {},
        loading: true,
      },
      disposeData: {
        // 威胁处置
        data: {},
        loading: true,
      },
      /* 其他总览页面数据 */
      rankData: {
        // 排行数据
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      homeUserRankData: {
        // 首页用户排行
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      homeDeviceRankData: {
        // 首页设备排行
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      threatRelatedData: {
        // 威胁相关用户/设备/数据...
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      exceptionRelatedData: {
        // 异常相关用户/设备/数据...
        data: [],
        total: 0,
        top: 0,
        loading: true,
      },
      jobStateData: {
        // 用户在职状态
        data: [],
        loading: true,
      },
      deviceStateData: {
        // 设备状态
        data: [],
        loading: true,
      },
      addressData: {
        // 用户地址
        data: [],
        loading: true,
      },
      departmentData: {
        // 部门
        data: [],
        loading: true,
      },
      valueData: {
        // 价值
        data: [],
        loading: true,
      },
      profileData: [
        // 数量统计数据
        // 总数
        {
          loading: true,
        },
        // 威胁
        {
          loading: true,
        },
        // 异常
        {
          loading: true,
        },
      ],
    };
  },
  created() {
    this._setData();
  },
  methods: {
    handleJump(params) {
      this.$emit("jump", params);
    },
    handleTimelineSelect(params) {
      this.$message({
        message: '你点击了 "' + params + '", 跳转功能稍后实现',
        type: "success",
      });
    },
    handleSelect(name) {
      let str = "";
      if (typeof name === "object") {
        for (let key in name) {
          if (name.hasOwnProperty(key)) {
            str += key + ": " + name[key] + " ";
          }
        }
      } else {
        str = name;
      }
      this.$message({
        message: '你点击了 "' + str + '", 跳转功能稍后实现',
        type: "success",
      });
    },
    // 彩蛋：点击每个卡片的标题，添加动画
    handleClick($event) {
      const animation = ["zoomInUp", "jello", "heartBeat", "rubberBand"];
      if (this.index === undefined) {
        this.index = 0;
      }
      const target = $event.target;
      if (target.tagName.toLowerCase() === "h1") {
        let col = target.parentNode.parentNode.parentNode.parentNode;
        col.style.zIndex = "1000000";
        col.style.position = "relative";
        animateCSS(col, animation[this.index % animation.length], () => {
          col.style.zIndex = "";
          col.style.position = "";
        });
        this.index += 1;
      } else {
        const $target = $($event.target);
        let $card = $target.parents(".profile-card-awesome-card");
        if ($card.length === 0) {
          return;
        }
        $card.css("z-index", 1000000);
        $card.css("position", "relative");
        animateCSS($card.get(0), "bounce", () => {
          $card.css("z-index", "");
          $card.css("position", "");
        });
      }
    },

    /* ======= 获取数据 ======== */

    // 登录成功设备类型
    async _getSuccessData() {
      let res;
      try {
        res = await getSuccessDataAsync(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
        };
      }
      setTimeout(() => {
        this.successData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 登录失败用户
    async _getFailUserData() {
      let res;
      try {
        res = await getFailUserDataAsync(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
          topN: 10,
        };
      }
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.failUserData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 登录失败目标设备
    async _getFailDeviceData() {
      let res;
      try {
        res = await getFailDeviceDataAysnc(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
          topN: 10,
        };
      }
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.failDeviceData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 被访问的数据类型
    async _getAccessData() {
      let res;
      try {
        res = await getAccessDataAsync(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
        };
      }
      setTimeout(() => {
        this.accessData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 源设备传输数据
    async _getSourceDeviceData() {
      let res;
      try {
        res = await getSourceDeviceDataAsync(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
          totalNum: 0,
        };
      }

      let { data, total, totalNum, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.sourceDeviceData = { data, total, totalNum, top, loading };
      }, LOADING_DELAY);
    },
    // 目标设备传输数据
    async _getTargetDeviceData() {
      let res;
      try {
        res = await getTargetDeviceDataAsync(this.params);
      } catch (e) {
        res = {
          data: [],
          total: 0,
          totalNum: 0,
        };
      }
      let { data, total, totalNum, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.targetDeviceData = { data, total, totalNum, top, loading };
      }, LOADING_DELAY);
    },
    // 获取数量统计数据
    async _getProfileData() {
      let res;
      try {
        res = await getProfileAsync(this.pageType, this.params);
        if (this.pageType === PAGE_TYPE.OVERVIEW_ANALYSIS) {
          // 分析总览返回的数据格式化
          res = {
            total: {
              num: res.loginFail,
            },
            threat: {
              num: res.inactiveUser,
            },
            anomaly: {
              num: res.dataTransform,
            },
          };
        }
      } catch (e) {
        res = {
          total: {
            num: 0,
          },
          threat: {
            num: 0,
          },
          anomaly: {
            num: 0,
          },
        };
      }
      setTimeout(() => {
        this.profileData = [
          {
            data: res.total,
            loading: false,
          },
          {
            data: res.threat,
            loading: false,
          },
          {
            data: res.anomaly,
            loading: false,
          },
        ];
      }, LOADING_DELAY);
    },
    // 获取最新异常/威胁数据
    async _getLatestData() {
      let res = await getLatestAsync(this.pageType, this.params);
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.latestData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 首页最新威胁
    async _getHomeLatestThreatData() {
      let res = await getLatestAsync("overview-threat", {
        ...this.params,
        queryType: "index",
      });
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.homeLatestThreatData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 首页最新异常
    async _getHomeLatestExceptionData() {
      let res = await getLatestAsync("overview-exception", {
        ...this.params,
        queryType: "index",
      });
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.homeLatestExceptionData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 获取排行数据
    async _getRankData() {
      let res = await getRankDataAsync(this.pageType, this.params);
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.rankData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 首页用户评分排行
    async _getHomeUserRankData() {
      let res = await getRankDataAsync("overview-user", {
        ...this.params,
        queryType: "index",
      });
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.homeUserRankData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 首页设备评分排行
    async _getHomeDeviceRankData() {
      let res = await getRankDataAsync("overview-device", {
        ...this.params,
        queryType: "index",
      });
      let { data, total, topN: top } = res;
      data = this._formatInformationTableData(data);
      let loading = false;
      setTimeout(() => {
        this.homeDeviceRankData = { data, total, top, loading };
      }, LOADING_DELAY);
    },
    // 获取威胁相关的用户/数据/程序...
    async _getThreatRelatedData() {
      let res = await getThreatRelatedAsync(this.pageType, this.params);
      this._setProgressTableData("threatRelatedData", res);
    },
    // 获取异常相关的用户/数据/程序...
    async _getExceptionRelatedData() {
      let res = await getExceptionRelatedAsync(this.pageType, this.params);
      this._setProgressTableData("exceptionRelatedData", res);
    },
    // 获取异常/威胁分类
    async _getCategoryData() {
      let res = await getCategoryAsync(this.pageType, this.params);
      setTimeout(() => {
        this.categoryData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 获取评分
    async _getScoreData() {
      let res = await getScoreAsync(this.pageType, this.params);
      setTimeout(() => {
        this.scoreData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 获取用户状态(首页)
    async _getUserStatusData() {
      let res = await getUserStatusAsync(this.params);
      let data = [];
      let { known, unknown } = res;

      data.push({
        name: "未知",
        value: unknown && unknown.num ? unknown.num : 0,
      });

      data.push({
        name: "已知",
        value: known && known.num ? known.num : 0,
      });

      // if (known && known.num > 0) {
      //   data.push({ name: '已知', value: res.known.num })
      // }
      // if (unknown && unknown.num > 0) {
      //   data.push({ name: '未知', value: res.unknown.num })
      // }
      res.data = data;
      setTimeout(() => {
        this.userStatusData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 获取设备状态(首页)
    async _getDeviceStatusData() {
      let res = await getDeviceStatusAsync(this.params);
      let data = [];
      let { known, unknown } = res;

      data.push({
        name: "未知",
        value: unknown && unknown.num ? unknown.num : 0,
      });

      data.push({
        name: "已知",
        value: known && known.num ? known.num : 0,
      });

      // if (known && known.num > 0) {
      //   data.push({ name: '已知', value: res.known.num })
      // }
      // if (unknown && unknown.num > 0) {
      //   data.push({ name: '未知', value: res.unknown.num })
      // }
      res.data = data;
      setTimeout(() => {
        this.deviceStatusData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },

    // 获取价值数据
    async _getValueData() {
      let res = await getValueAsync(this.pageType, this.params);
      setTimeout(() => {
        this.valueData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 用户在职状态
    async _getJobStateData() {
      let res = await getJobStateAsync(this.params);
      setTimeout(() => {
        this.jobStateData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 设备状态
    async _getDeviceStateData() {
      let res = await getDeviceStateAsync(this.params);
      setTimeout(() => {
        this.deviceStateData = {
          data: res,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 异常组成的威胁/威胁中的异常
    async _getOppositeData() {
      const res = await getOppositeAsync(this.pageType, this.params);
      this._setProgressTableData("oppositeData", res);
    },
    // 异常/威胁观察列表
    async _getWatchData() {
      const res = await getWatchAsync(this.pageType, this.params);
      this._setProgressTableData("watchData", res);
    },
    // 用户观察列表中的异常
    async _getUserWatchData() {
      const res = await getUserWatchAsync(this.pageType, this.params);
      this._setProgressTableData("userWatchData", res);
    },
    // 异常/威胁时间表
    async _getTimelineData() {
      const res = await getTimeLineAsync(this.pageType, this.params);
      const dataset = [];

      res.map((column) => {
        column.anomalyTypeList.map((item) => {
          dataset.push([column.time, item.anomalyType, item.num, item.score]);
        });
      });
      setTimeout(() => {
        this.timelineData = {
          data: dataset,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 异常趋势
    async _getExceptionTrendData(params = {}) {
      const res = await getExceptionTrendDataAsync(this.pageType, {
        ...this.params,
        ...params,
      });
      setTimeout(() => {
        this.exceptionTrendData = {
          data: res,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 威胁趋势
    async _getThreatTrendData(params = {}) {
      const res = await getThreatTrendDataAsync(this.pageType, {
        ...this.params,
        ...params,
      });
      setTimeout(() => {
        this.threatTrendData = {
          data: res,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 威胁现状
    async _getSituationData() {
      const res = await getSituationAsync(this.params);
      setTimeout(() => {
        this.situationData = {
          data: res,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 威胁处置
    async _getDisposeData() {
      const res = await getDisposeAsync(this.params);
      setTimeout(() => {
        this.disposeData = {
          data: res,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 用户地址
    async _getAddressData() {
      const res = await getAddressAsync(this.params);
      setTimeout(() => {
        this.addressData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 部门
    async _getDepartmentData() {
      const res = await getDepartmentAsync(this.pageType, this.params);
      setTimeout(() => {
        this.departmentData = {
          data: res.data,
          total: res.total,
          loading: false,
        };
      }, LOADING_DELAY);
    },
    // 格式化最新异常和最新威胁表格数据
    _formatInformationTableData(data) {
      let res = [];
      let { round, floor } = Math;
      data.map((item) => {
        res.push({
          name: item.name,
          time: item.fundTime,
          score: floor(round(item.riskScore)),
          threatCount: item.threatNum,
          anomalyCount: item.anomalyNum,
          id: item.id,
          count: item.count ? item.count : 0,
        });
      });
      return res;
    },
    // 设置表格型卡片数据
    _setProgressTableData(dataName, res) {
      const data = [];
      let total = 0;
      res.series.map((item) => {
        total += item;
      });
      for (let i = 0; i < res.total; i++) {
        data.push({
          name: res.yAxis[i],
          count: res.series[i],
          percentage: (res.series[i] / total) * 100,
        });
      }

      let tmpData = deepClone(data);
      tmpData = tmpData.map((item) => {
        item.percentage = 0;
        return item;
      });

      setTimeout(() => {
        this[dataName] = {
          data: tmpData,
          total: res.total,
          totalCount: res.totalCnt,
          loading: false,
        };
        setTimeout(() => {
          this[dataName] = Object.assign({}, this[dataName], { data });
        }, 400);
      }, LOADING_DELAY);
    },
    _resetAllState() {
      Object.assign(this.$data, this.$options.data());
    },
  },
  watch: {
    params() {
      this._resetAllState();
      this._setData();
    },
  },
};

// 不过不是目标路由页面，则清除所有 Vuex 状态
// 不传，则直接清空
const CLEAR_ALL_STATE__FUNC = function (targetRouteName = "") {
  return {
    beforeRouteLeave(to, from, next) {
      if (to.name !== targetRouteName) {
        this.resetAllState();
      }
      next();
    },
    methods: {
      ...mapMutations("insight", {
        resetAllState: INSIGHT.RESET_ALL_STATE,
      }),
    },
  };
};

const EXACT_INFO_MIXIN = {
  props: {
    exactInfo: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
};

const GET_LIST_PAGE_URL_MIXIN = {
  methods: {
    _getListPageUrl(pageType) {
      let url = "";
      switch (pageType) {
        case PAGE_TYPE.LIST_USER:
          url = "/insight/user/list";
          break;
        case PAGE_TYPE.LIST_APPLICATION:
          url = "/insight/application/list";
          break;
        case PAGE_TYPE.LIST_DATA:
          url = "/insight/data/list";
          break;
        case PAGE_TYPE.LIST_DEVICE:
          url = "/insight/device/list";
          break;
        case PAGE_TYPE.LIST_PROGRAM:
          url = "/insight/program/list";
          break;
        case PAGE_TYPE.LIST_EXCEPTION:
          url = "/insight/exception/list";
          break;
        case PAGE_TYPE.LIST_THREAT:
          url = "/insight/threat/list";
          break;
      }
      return url;
    },
  },
};

const SET_EXACT_INFO_MIXIN = {
  data() {
    return {
      exactInfo: null, // 特定的信息，如从用户详情查询跳转至特定的用户相关列表
    };
  },
  computed: {
    alertText() {
      if (this.exactInfo) {
        let { type, id, name } = this.$route.query;
        switch (type) {
          case "user":
            type = "用户";
            break;
          case "device":
            type = "设备";
            break;
          case "application":
            type = "应用";
            break;
          case "data":
            type = "数据";
            break;
          case "program":
            type = "程序";
            break;
          default:
            type = "未知类型";
            break;
        }
        return `当前显示的是${type}：${name}（${id}）的相关列表`;
      }
      return "";
    },
  },
  created() {
    let { type, id, name } = this.$route.query;
    let types = ["user", "device", "data", "application", "program"];
    if (
      type !== undefined &&
      id !== undefined &&
      name !== undefined &&
      types.indexOf(type) !== -1
    ) {
      let key = `${type}Id`;
      this.exactInfo = {
        [key]: id,
      };
    } else {
      this.exactInfo = null;
    }
  },
};

const JUMP_LIST_INDEX_MIXIN = {
  data() {
    return {
      showJumpAlert: false,
      paramCanBeSavedFilters: [],
      paramTimeInfo: null,
      paramAggInfo: null,
      paramFilterInfo: null,
      paramFiltersInfo: null,
      paramHiddenFilterInfo: null,
    };
  },
  computed: {
    hiddenFilterAlertText() {
      let { type, value, hidden } = this.paramHiddenFilterInfo;
      if (hidden) {
        return `当前显示的是 “${type}：${value}” 的相关列表`;
      }
      return "";
    },
  },
  created() {
    let jumpData = storage.get("jumpData");
    if (jumpData) {
      this.showJumpAlert = true;
      let {
        filterBar,
        timeInfo,
        aggInfo,
        filterInfo,
        filtersInfo,
      } = jumpData.params;
      if (filterBar) {
        this.paramCanBeSavedFilters = jumpData.data.filterBar;
      }
      if (timeInfo) {
        this.paramTimeInfo = jumpData.data.timeInfo;
      }
      if (aggInfo) {
        this.paramAggInfo = jumpData.data.aggInfo;
      }
      if (filterInfo) {
        let { hidden } = jumpData.data.filterInfo;
        if (hidden) {
          this.paramHiddenFilterInfo = jumpData.data.filterInfo;
        } else {
          this.paramFilterInfo = jumpData.data.filterInfo;
        }
      }
      if (filtersInfo) {
        this.paramFiltersInfo = jumpData.data.filtersInfo;
      }
      storage.remove("jumpData");
    }
  },
};
export {
  ALL_PAGE_TYPE_MIXIN,
  LIST_PAGE_TYPE_MIXIN,
  IS_DETAIL_MIXIN,
  VALUE_LIST_MIXIN,
  DETAIL_ID_MIXIN,
  GET_DETAIL_ID_MIXIN,
  formatTableDataMixin,
  cellDataMixin,
  OVERVIEW_MIXIN,
  CLEAR_ALL_STATE__FUNC,
  EXACT_INFO_MIXIN,
  SET_EXACT_INFO_MIXIN,
  JUMP_LIST_INDEX_MIXIN,
  GET_LIST_PAGE_URL_MIXIN,
};
