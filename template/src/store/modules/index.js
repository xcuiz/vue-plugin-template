/*
 * @Author: your name
 * @Date: 2020-03-19 20:41:47
 * @LastEditTime: 2020-07-20 17:07:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/store/modules/index.js
 */
/**
 * Created by ligang on 2018/6/1.
 */
import base from "./base";
import global from "./global";
import tagsView from "./tags-view";
import permission from "./permission";
import system from "./system";
import insight from "./insight";

export default {
  base,
  permission,
  tagsView,
  system,
  global,
  insight,
};
