/*
 * @Author: your name
 * @Date: 2020-06-28 13:37:54
 * @LastEditTime: 2020-07-03 11:02:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/system/accountPermissions/role/create/config.js
 */
export const config = {
  step1: {
    component: "selectTree",
    name: "继承",
    model: "extend",
    type: "extend",
  },
  step2: {
    component: "selectTree",
    name: "功能",
    model: "function",
    type: "function",
  },
  step3: {
    component: "selectTree",
    name: "数仓集",
    model: "chs",
  },
  step4: {
    component: "severalTmp",
    name: "数仓集",
    model: "chCondition",
    type: "ch",
  },
  step5: {
    component: "selectTree",
    name: "索引集",
    model: "ess",
  },
  step6: {
    component: "severalTmp",
    name: "索引集",
    model: "esCondition",
    type: "es",
  },
};
