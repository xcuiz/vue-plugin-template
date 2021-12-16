/**
 * Created by ligang on 2018/5/30.
 */
import { data2Cartesian } from "@/fusion-charts/data-factory";
import { $xss as xss } from "fusion-utils";
import filter from "@/mixins/filter.js";

export default {
  data() {
    return {
      // loading对象
      loading: {},
      TABLE_HEIGHT: {
        HIGH: 653,
        NORMAL: 330,
      },
      sortOrders: ["ascending", "descending"], // elementUI table-column 排序方式
      globalTime: {
        timeFlag: 2, // 日历时间标识 1:无 2:固定时间 3:相对时间
        startTime: +new Date().setHours(0, 0, 0, 0) - 24 * 3600 * 1000, // 开始时间（时间标识为2时，其他为空）
        endTime: +new Date().setHours(0, 0, 0, 0), // 结束时间（时间标识为2时，其他为空）
        timeInterval: 1, // 间隔（时间标识为3时，其他为空）
        timeUnit: "d", // 间隔单位（时间标识为3时，其他为空）s:秒 m:分 h:时 d:天 w:周 M:月
      },
    };
  },
  methods: {
    /**
     * 对内容进行处理，方式xss攻击
     */
    $xss(source) {
      return xss(source);
    },
    /**
     * 消息提示弹框
     * @param message 提示消息
     * @param type  消息类型 success/warning/info/error
     */
    globalTimeReset() {
      this.globalTime = {
        timeFlag: 2, // 日历时间标识 1:无 2:固定时间 3:相对时间
        startTime: +new Date().setHours(0, 0, 0, 0) - 24 * 3600 * 1000, // 开始时间（时间标识为2时，其他为空）
        endTime: +new Date().setHours(0, 0, 0, 0), // 结束时间（时间标识为2时，其他为空）
        timeInterval: 1, // 间隔（时间标识为3时，其他为空）
        timeUnit: "d", // 间隔单位（时间标识为3时，其他为空）s:秒 m:分 h:时 d:天 w:周 M:月
      };
    },

    /**
     * 消息提示弹框
     * @param message 提示消息
     * @param type  消息类型 success/warning/info/error
     */
    showMessage(
      message = "恭喜你，提交成功！",
      type = "success",
      options = { duration: 1500 }
    ) {
      this.$message({
        message: message,
        type: type,
        ...options,
      });
      return new Promise((resolve) => {
        setTimeout(() => resolve(), options.duration);
      });
    },
    /*
     * confirm 提示框
     * @param message
     * @param title
     * @param confirmButtonText
     * @param cancelButtonText
     * @param type
     */
    confirmBox({
      message = "确定删除该行数据吗？",
      title = "提示",
      confirmButtonText = "确定",
      cancelButtonText = "取消",
      type = "warning",
      isRejectCallback = false,
      cancelMessage = "已取消删除",
    } = {}) {
      return new Promise((resolve, reject) => {
        this.$confirm(message, title, {
          confirmButtonText,
          cancelButtonText,
          type,
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            isRejectCallback && reject(new Error());
            cancelMessage && this.showMessage(cancelMessage, "info");
            return false;
          });
      });
    },
    /**
     * 通用，当日历控件值发生变化时候触发
     * @param
     */
    timeChange(params) {
      let { mode, startTime, endTime, timeInterval, timeUnit } = params;
      switch (mode) {
        case "absolute":
          this.globalTime = Object.assign(
            {},
            {
              timeFlag: 2,
              startTime: startTime,
              endTime: endTime,
            }
          );
          break;
        case "relative":
          this.globalTime = Object.assign(
            {},
            {
              timeFlag: 3,
              timeInterval: timeInterval,
              timeUnit: timeUnit,
            }
          );
          break;
      }
    },
    /**
     * 通用表格请求
     * @param url  请求地址
     * @param currentObj  当前数据对象
     * @param params      请求参数
     * @param isPromptError 是否显示错误提示
     */
    async requestTable(
      data = {},
      options = { noTime: false, isPromptError: true }
    ) {
      let { url, currentObj, tag, params = {} } = data;
      params = JSON.parse(JSON.stringify(params));
      // 删除tableChange方法中init添加非请求参数
      delete params.isNotInitFirstLoad;
      let query = Object.assign(
        {
          pageNum: currentObj.pageNum || 1, // 当前页码
          pageSize: currentObj.pageSize || 20, // 每页条数
          sorts: currentObj.sorts, // 排序字段
        },
        params
      );

      // 需请求时间参数
      if (!options.noTime) {
        query = Object.assign({}, { ...this.globalTime }, query);
      }

      // 补充字段
      currentObj.data || this.$set(currentObj, "data", []);
      currentObj.total || this.$set(currentObj, "total", 0);
      currentObj.pageNum || this.$set(currentObj, "pageNum", 1);
      currentObj.pageSize || this.$set(currentObj, "pageSize", 20);

      let content = await this.$request(
        { method: "post", url: url, data: query, tag: tag },
        { tag: options.tag, isPromptError: options.isPromptError }
      );
      if (Array.isArray(content.data)) {
        for (let item of content.data) {
          if (Array.isArray(item.trend)) {
            item.trend = data2Cartesian(item.trend);
          }
        }
        return Object.assign(currentObj, content);
      }
      // 无数据
      return Object.assign(currentObj, { total: 0, data: [] });
    },
    /**
     * 通用表格（分页、排序、改变每页展示条数）
     * @param params  参数
     * @param currentObj 当前数据对象
     * @param initMethod 请求数据方法
     * |方法名|作用|
     * |:---|:---|
     * |pageChange|页码发生改变重新获取表格数据|
     * |refresh|点击刷新按钮重新获取表格数据|
     * |sizeChange|每页展示条数发生改变重新获取表格数据|
     * |submit|点击提交按钮重新获取表格数据|
     * |init|初始化时判断是否存在默认排序,避免重复获取数据|
     * |default|默认排序|
     */
    async tableChange(params = {}, currentObj, initMethod) {
      let { type, pageNum, pageSize, order, prop } = params;
      if (currentObj.pageNum === undefined) {
        this.$set(currentObj, "pageNum", 1);
      }
      switch (type) {
        case "pageChange": // 页码发生改变
          this.$set(currentObj, "pageNum", pageNum);
          await initMethod();
          break;
        case "refresh":
          await initMethod();
          break;
        case "sizeChange": // 每页展示条数发生改变
          this.$set(currentObj, "pageSize", pageSize);
          await initMethod();
          break;
        case "submit": // 判断是否点了查询按钮，重新拉取数据（elementUi 已修复current-page非用户交互触发bug）
          currentObj.pageNum = 1;
          await initMethod();
          break;
        case "init": // 判断是否存在默认排序
          // if (!params.defaultSort) {
          //   initMethod()
          // }
          // 处理init第一次不加载，后续都调用回调（处理菜单栏刷新操作）
          // if (currentObj.isNotInitFirstLoad || !params.defaultSort) {
          await initMethod();
          // }
          break;
        default:
          // 排序
          currentObj.sorts =
            order && (order === "ascending" ? [prop] : [`-${prop}`]);
          currentObj.pageNum = 1;
          await initMethod();
      }
      // isNotInitFirstLoad 是否是第一次调用init类型函数
      // currentObj.isNotInitFirstLoad = true
    },
  },
  mixins: [filter],
  // filters: {
  //   formateTableData (val) {
  //     return (typeof val === 'number') ? val : val || '-'
  //   }
  // }
};
