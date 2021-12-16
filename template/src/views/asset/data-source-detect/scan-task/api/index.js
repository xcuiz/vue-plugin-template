import { request } from "@/plugin/request";

export const getJobPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/job/page",
    data,
  });

export const getTaskPage = (jobId, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/job/${jobId}/task/page`,
    data,
  });

export const getCount = () =>
  request({
    method: "get",
    url: "/gov/api/asset/job/count",
  });

export const getProbes = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/job/queryProbe",
    data,
  });

export const getNetdistrict = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/netdistrict/queryNetdistrict",
    data,
  });

export const getPortGroup = (data) =>
  request({
    method: "post",
    url: "/gov/api/portGroup/page",
    data,
  });

export const addJob = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/job/create",
    data,
  });

export const updateJob = (jobId, data) =>
  request({
    method: "put",
    url: `/gov/api/asset/job/${jobId}`,
    data,
  });

export const getJobDetail = (jobId) =>
  request({
    method: "get",
    url: `/gov/api/asset/job/${jobId}`,
  });

export const operateTask = (taskId, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/job/operate/${taskId}`,
    data,
  });

export const operateParentTask = (taskId, operateType) =>
  request({
    method: "post",
    url: `/gov/api/asset/job/${operateType}`,
    data: {
      idList: [taskId],
    },
  });

export const getTask = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/asset/job/task/${taskId}`,
  });

export const getTaskAssetPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/job/task/assetPage",
    data,
  });

export const getFilters = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetJob",
  });

export const getFilterOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/job/filter/${type}`,
  });

export const getCommonSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/${type}/select`,
  });

export const getIpList = () =>
  request({
    method: "get",
    url: "/gov/api/asset/ip/list",
  });

export const getTaskProgress = (taskId) =>
  request({
    method: "get",
    url: `/gov/api/asset/job/task/${taskId}/runProcess`,
  });

export const deleteJob = (data) =>
  request({
    method: "post",
    url: "/gov/api/data/job/delete",
    data,
  });

export const downloadReport = (taskId) =>
  request(
    {
      method: "get",
      url: `/gov/api/asset/job/task/${taskId}/downloadReport`,
    },
    {
      responseType: "blob",
    }
  );

export const getSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/probe/getSelect/${type}`,
  });
