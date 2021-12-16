import { request } from "@/plugin/request";

export const getProbePage = (data) =>
  request({
    method: "post",
    url: "/gov/api/probe/page",
    data,
  });

export const getListFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/probe",
  });

export const getFilterOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/probe/${code}`,
  });

export const getSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/probe/getSelect/${type}`,
  });

export const postProbeDelete = (data) =>
  request({
    method: "post",
    url: "/gov/api/probe/delete",
    data,
  });

export const getProbeStatus = (id) =>
  request(
    {
      method: "get",
      url: `/gov/api/probe/test/${id}`,
    },
    {
      raw: true,
    }
  );

export const addProde = (data) =>
  request({
    method: "post",
    url: "/gov/api/probe/create",
    data,
  });

export const updateProbe = (data, id) =>
  request({
    method: "put",
    url: `/gov/api/probe/${id}`,
    data,
  });

export const getProbeConfig = (id) =>
  request({
    method: "get",
    url: `/gov/api/probe/${id}`,
  });

export const getProbeDetail = (id) =>
  request({
    method: "get",
    url: `/gov/api/probe/detail/${id}`,
  });

export const getProbeMonitor = (id, data) =>
  request({
    method: "post",
    url: `/gov/api/probe/monitor/${id}`,
    data,
  });

export const getAggFilters = () =>
  request({
    method: "get",
    url: "/gov/api/common/agg/filter/probe",
  });

export const getAggData = (data) =>
  request({
    method: "post",
    url: "/gov/api/probe/agg",
    data,
  });

export const getScanTask = (probeId, data) =>
  request({
    method: "post",
    url: `/gov/api/probe/${probeId}/scanTask`,
    data,
  });

export const getTplPage = (probeId, data) =>
  request({
    method: "post",
    url: `/gov/api/probe/${probeId}/temp/page`,
    data,
  });

export const syncTpl = (probeId) =>
  request({
    method: "get",
    url: `/gov/api/probe/${probeId}/temp/sync`,
  });

export const getProbeType = (code) =>
  request({
    method: "get",
    url: `/gov/api/probe/queryProbeType/${code}`,
  });

export const testProbe = (data) =>
  request({
    method: "post",
    url: `/gov/api/probe/telnet`,
    data,
  });
