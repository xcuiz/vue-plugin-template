import dayjs from "dayjs";

export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(date).format(format);
};

export default {
  install(Vue) {
    Vue.prototype.$formatDate = formatDate;
  },
};
