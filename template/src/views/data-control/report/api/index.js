import { request } from "@/plugin/request";

export const getReportConfigList = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/report/page",
    data,
  });

export const operateReport = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/report/operate",
    data,
  });

export const getReportExecuteList = (reportId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/report/${reportId}/sendFile/page`,
    data,
  });

export const downloadReportFile = (id) =>
  request(
    {
      method: "get",
      url: `/gov/api/data/report/download/${id}`,
    },
    {
      responseType: "blob",
    }
  );

export const deleteReportFile = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/report/sendFile/delete",
    data,
  });

export const sendReportFile = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/report/sendFile/sendAgain",
    data,
  });

export const addReportConfig = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/report/create",
    data,
  });

export const getReportConfig = (reportId) =>
  request({
    method: "get",
    url: `/gov/api/data/report/${reportId}`,
  });

export const updateReportConfig = (reportId, data) =>
  request({
    method: "put",
    url: `/gov/api/data/report/${reportId}`,
    data,
  });

export const getCommonSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/${type}/select`,
  });

export const getDBOptions = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/assetType/selectByStorage",
    data,
  });
