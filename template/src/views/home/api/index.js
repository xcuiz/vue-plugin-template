/*
 * @Author: yincheng
 * @Date: 2021-04-28 19:36:00
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-28 19:36:44
 */
import { request } from "@/plugin/request";

export const getJobPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/job/page",
    data,
  });
