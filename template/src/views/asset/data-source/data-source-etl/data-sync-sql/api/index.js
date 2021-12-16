/*
 * @Author: yincheng
 * @Date: 2021-04-30 11:54:55
 * @LastEditors: yincheng
 * @LastEditTime: 2021-05-08 16:57:09
 */
import { request } from "@/plugin/request";

export const addSync = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/sql/create",
    data,
  });

export const updateSync = (id, data) =>
  request({
    method: "put",
    url: `/gov/api/etl/sql/${id}`,
    data,
  });

export const getSync = (id) =>
  request({
    method: "get",
    url: `/gov/api/etl/sql/${id}`,
  });

export const getSyncPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/sql/page",
    data,
  });

export const operateSync = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/sql/operate",
    data,
  });

export const getRecordPage = (id, data) =>
  request({
    method: "post",
    url: `/gov/api/etl/sql/${id}/syncExecute`,
    data,
  });

export const executeAgain = (sqlId) =>
  request({
    method: "get",
    url: `/gov/api/etl/sql/${sqlId}/executeAgain`,
  });

export const getLog = (id) =>
  request({
    method: "get",
    url: `/gov/api/etl/sql/queryLog/${id}`,
  });
