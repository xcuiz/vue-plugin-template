import { request } from "@/plugin/request";

export const getIpPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/ip/page",
    data,
  });

export const deleteIp = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/ip/delete",
    data,
  });

export const getIp = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/ip/${id}`,
  });

export const addIp = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/ip/create",
    data,
  });

export const updateIp = (id, data) =>
  request({
    method: "put",
    url: `/gov/api/asset/ip/${id}`,
    data,
  });

export const getCommonSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/${type}/select`,
  });

export const getListFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/asset/ip/listFilter",
  });

export const getFilterOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/ip/filter/${type}`,
  });

export const getAggFilters = () =>
  request({
    method: "get",
    url: "/gov/api/asset/ip/aggFilter",
  });

export const getAggData = (type, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/ip/agg/${type}`,
    data,
  });
