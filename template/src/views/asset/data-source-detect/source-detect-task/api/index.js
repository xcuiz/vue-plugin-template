import { request } from "@/plugin/request";

export const getJobPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/page",
    data,
  });

export const getListFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/dataJob",
  });

export const getSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/dataJob/${code}`,
  });

export const postJobDelete = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/delete",
    data,
  });

export const getAssetProbe = (assetId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/queryProbe/${assetId}`,
  });

export const getAssets = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/queryAsset",
    data,
  });

export const addJob = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/create",
    data,
  });

export const updateJob = (jobId, data) =>
  request({
    method: "put",
    url: `/gov/api/data/job/${jobId}`,
    data,
  });

export const getTaskPage = (jobId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/${jobId}/task/page`,
    data,
  });

export const getJobDetail = (jobId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/${jobId}`,
  });

export const getSensitiveDataTop = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/task/${taskId}/sensitiveDataTop`,
  });

export const getAssetCheckPage = (taskId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/task/${taskId}/assetCheck`,
    data,
  });

export const getReportDetail = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/task/${taskId}`,
  });

export const getAssetReportDetail = (assetId, taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/${taskId}/asset/${assetId}/report`,
  });

export const getAssetDataListPage = (assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/asset/${assetId}/dataList`,
    data,
  });

export const getAssetDBListPage = (taskId, assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/${taskId}/asset/${assetId}/dataList`,
    data,
  });

export const getAssetFileListPage = (taskId, assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/${taskId}/asset/${assetId}/fileList`,
    data,
  });

export const getAssetDBFields = (id, assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/asset/${assetId}/data/${id}`,
    data,
  });

export const getTaskProgress = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/task/${taskId}/runProcess`,
  });

export const getAggFilters = () =>
  request({
    method: "get",
    url: "/gov/api/common/agg/filter/dataJob",
  });

export const getAggData = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/agg",
    data,
  });

export const getSelectFeature = () =>
  request({
    method: "get",
    url: "/gov/api/data/job/selectFeature",
  });

export const getAssetStorageMode = () =>
  request({
    method: "get",
    url: "/gov/api/asset/list/assetStorageMode",
  });

export const getAssetTypes = (code) =>
  request({
    method: "get",
    url: `/gov/api/asset/list/assetType/${code}`,
  });

export const getDaqTaskRunProcess = (taskId, data) =>
  request({
    method: "post",
    url: `/gov/api/data/job/task/${taskId}/daqTaskRunProcess`,
    data,
  });

export const getScanResult = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/task/${taskId}/scanResult`,
  });

export const getDBPageFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetDbTable",
  });

export const getFilePageFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetFile",
  });

export const getDBPageSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetDbTable/${code}`,
  });

export const getFilePageSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetFile/${code}`,
  });

export const getDBColFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetDbTableColumn",
  });

export const getDBColSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetDbTableColumn/${code}`,
  });

export const getAsset = (assetId) =>
  request({
    method: "get",
    url: `/gov/api/asset/list/detail/${assetId}`,
  });

export const downloadReport = (taskId) =>
  request(
    {
      method: "get",
      url: `/gov/api/data/job/task/${taskId}/downloadReport`,
    },
    {
      responseType: "blob",
    }
  );

export const operateTask = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/task/batchOperate",
    data,
  });

export const operateParentTask = (taskId, operateType) =>
  request({
    method: "post",
    url: `/gov/api/data/job/${operateType}`,
    data: {
      idList: [taskId],
    },
  });

export const getStatistics = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/data/job/task/${taskId}/taskScanStatistics`,
  });

export const getdataStructurePage = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/asset/dataStructure",
    data,
  });
