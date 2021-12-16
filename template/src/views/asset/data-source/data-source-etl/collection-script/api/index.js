import { request } from "@/plugin/request";

export const getPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/script/page",
    data,
  });

export const addScript = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/script/create",
    data,
  });

export const updateScript = (id, data) =>
  request({
    method: "put",
    url: `/gov/api/etl/script/${id}`,
    data,
  });

export const getScript = (id) =>
  request({
    method: "get",
    url: `/gov/api/etl/script/${id}`,
  });

export const operateScript = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/script/operate",
    data,
  });

export const executeScript = (data) =>
  request({
    method: "post",
    url: "/gov/api/etl/script/execute",
    data,
  });
