const rule = {
  required: true,
  trigger: "submit",
  validator: (rule, value, callback) => {
    const { executeType, executeCron, executeConfig } = value;
    const { time, day, week, month } = executeConfig;
    let message;
    switch (executeType) {
      case "day":
        if (!time) {
          message = "请选择时间";
        }
        break;
      case "week":
        if (!time) {
          message = "请选择时间";
        } else if (!week) {
          message = "请选择星期";
        }
        break;
      case "month":
        if (!time) {
          message = "请选择时间";
        } else if (!day) {
          message = "请选择日期";
        }
        break;
      case "year":
        if (!time) {
          message = "请选择时间";
        } else if (!day) {
          message = "请选择日期";
        } else if (!month) {
          message = "请选择月份";
        }
        break;
      case "cron":
        if (!executeCron) {
          message = "请输入Cron表达式";
        }
        break;
      default:
        break;
    }
    if (message) {
      callback(message);
    } else {
      callback();
    }
  },
};

export default rule;
