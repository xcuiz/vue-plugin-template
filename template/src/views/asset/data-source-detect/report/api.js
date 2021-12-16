/*
 * @Author: yincheng
 * @Date: 2021-08-10 15:02:37
 * @LastEditors: yincheng
 * @LastEditTime: 2021-08-13 10:04:47
 */
import { request } from "@/plugin/request";

export const getReportConfigList = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/config/page",
    data,
  });

export const deleteReportConfig = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/config/delete",
    data,
  });
export const getReportExecuteList = (reportId, data) =>
  request({
    method: "post",
    url: `/gov/api/audit/send/${reportId}/page`,
    data,
  });

export const downloadReportFile = (sendId) =>
  request(
    {
      method: "get",
      url: `/gov/api/audit/report/download/${sendId}`,
    },
    {
      responseType: "blob",
    }
  );

export const deleteReportFile = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/send/delete",
    data,
  });

export const sendReportFile = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/execute/sendAgain",
    data,
  });

export const getReportLogList = (reportId, data) =>
  request({
    method: "post",
    url: `/gov/api/audit/record/page/${reportId}`,
    data,
  });

export const updateReportConfigStatus = (data) =>
  request({
    method: "post",
    url: `/gov/api/audit/config/operate`,
    data,
  });

export const saveReportConfig = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/config/save",
    data,
  });

export const getReportConfig = (reportId) =>
  request({
    method: "get",
    url: `/gov/api/audit/config/${reportId}`,
  });

export const getPreviewData = (data) =>
  request({
    method: "post",
    url: "/gov/api/audit/preview/sql",
    data,
  });

export const executeNow = (id) =>
  request({
    method: "get",
    url: `/gov/api/audit/config/execute/${id}`,
  });
