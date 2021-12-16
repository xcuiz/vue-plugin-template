/**
 * 该vuex插件的作用为初始化一些action
 */
import { DASHBOARD } from "../type";
import { Bus } from "@/fusion-components/util/bus.js";

const initActionList = [
  "dashboard/" + DASHBOARD.COLUMNS_RULE,
  "dashboard/" + DASHBOARD.IS_PROXY,
];

export default function (store) {
  for (let action of initActionList) {
    Bus.$once(action, () => {
      store.dispatch(action);
    });
  }
}
