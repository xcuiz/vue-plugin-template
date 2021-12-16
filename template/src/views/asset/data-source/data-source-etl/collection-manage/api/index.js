import { request } from "@/plugin/request";

export const getPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/collect/page",
    data,
  });

export const getScripts = () =>
  request({
    method: "get",
    url: "/gov/api/etl/collect/getScript",
  });

export const getTables = () =>
  request({
    method: "get",
    url: "/gov/api/etl/collect/getTable",
  });

export const getTableFields = (tableId) =>
  request({
    method: "get",
    url: `/gov/api/etl/collect/getTableCol/${tableId}`,
  });

export const getScriptFields = (sriptId) =>
  request({
    method: "get",
    url: `/gov/api/etl/collect/result/${sriptId}`,
  });

export const getDataTypes = () =>
  request({
    method: "get",
    url: "/gov/api/etl/collect/getDataType",
  });

export const addCollect = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/collect/create",
    data,
  });

export const updateCollect = (id, data) =>
  request({
    method: "put",
    url: `/gov/api/etl/collect/${id}`,
    data,
  });

export const getCollect = (id) =>
  request({
    method: "get",
    url: `/gov/api/etl/collect/${id}`,
  });

export const operateCollect = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/collect/operate",
    data,
  });
