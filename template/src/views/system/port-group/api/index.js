/*
 * @Author: yincheng
 * @Date: 2021-04-30 10:58:17
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-30 11:27:52
 */
import { request } from "@/plugin/request";

export const getPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/portGroup/page",
    data,
  });

export const deletePortGroup = (data) =>
  request({
    method: "post",
    url: "/gov/api/portGroup/delete",
    data,
  });

export const addPortGroup = (data) =>
  request({
    method: "post",
    url: "/gov/api/portGroup/creat",
    data,
  });

export const updatePortGroup = (id, data) =>
  request({
    method: "post",
    url: `/gov/api/portGroup/update/${id}`,
    data,
  });

export const getPortGroup = (id) =>
  request({
    method: "get",
    url: `/gov/api/portGroup/info/${id}`,
  });
