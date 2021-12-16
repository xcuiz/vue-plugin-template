import "./flowgrid.css";
import flowgrid from "./flowgrid.js";
export default {
  install(Vue) {
    Vue.component("idss-flowgrid-container", flowgrid.fgContainer);
    Vue.component("idss-flowgrid-item", flowgrid.fgItem);
  },
};

export const flowgridContainer = flowgrid.fgContainer;
export const flowgridItem = flowgrid.fgItem;
