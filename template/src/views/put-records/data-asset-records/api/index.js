/*
 * @Author: your name
 * @Date: 2021-03-10 15:22:03
 * @LastEditTime: 2021-03-24 14:04:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\put-records\data-asset-records\apj\index.js
 */
import { request } from "@/plugin/request";

export const getListFilterFields = (moduleCode = "dataFiling") =>
  request({
    method: "get",
    url: `/gov/api/common/page/filter/${moduleCode}`,
  });
export const getFilterOptions = (code, moduleCode = "dataFiling") =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/${moduleCode}/${code}`,
  });

export const getAggFilters = (moduleCode = "dataFiling") =>
  request({
    method: "get",
    url: `/gov/api/common/agg/filter/${moduleCode}`,
  });

export const getAggData = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/filing/agg",
    data,
  });

export const getFilingPage = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/filing/page",
    data,
  });

export const getRechrdDetail = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/filing/detail/${id}`,
  });

export const getSelectNetdistrictSel = () =>
  request({
    method: "get",
    url: "/gov/api/asset/netdistrict/select",
  });

export const getSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/list/dict/${type}`,
  });

export const getReaourcePool = () =>
  request({
    method: "get",
    url: "/gov/api/asset/resourcePool/select",
  });

export const getSelectDept = () =>
  request({
    method: "get",
    url: "/gov/api/asset/dept/select",
  });
export const getSelectBusinessSys = () =>
  request({
    method: "get",
    url: "/gov/api/asset/businessSys/select",
  });

export const getSensitiveInfo = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/filing/sensitive",
    data,
  });

export const getSensitiveField = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/filing/sensitiveField/${id}`,
  });

export const postRecord = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/filing/record",
    data,
  });
export const deleteRecordList = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/filing/delete`,
    data,
  });

export const ImportFile = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/filing/import`,
    data,
  });

export const downloadTemplate = (type) => {
  return request(
    {
      method: "get",
      url: `/gov/api/asset/filing/download/${type}`,
    },
    {
      responseType: "blob",
    }
  );
};

export const getFilingData = (filingId) =>
  request({
    method: "get",
    url: `/gov/api/asset/filing/info/${filingId}`,
  });

export const getFilinInfo = (filingId) =>
  request({
    method: "get",
    url: `/gov/api/asset/filing/info/${filingId}/detail`,
  });

export const getFilingRecord = (filingId) =>
  request({
    method: "get",
    url: `/gov/api/asset/filing/info/${filingId}/record`,
  });

export const getFilingFileListPage = (assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/${assetId}/fileList`,
    data,
  });

export const getFilingDbListPage = (assetId, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/${assetId}/dataList`,
    data,
  });

export const getDBPageFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetInfoData",
  });

export const getFilePageFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetInfoFile",
  });

export const getDBPageSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetInfoData/${code}`,
  });

export const getFilePageSelectOptions = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetInfoFile/${code}`,
  });

export const getDBFields = (tableId, data) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/tableCol/${tableId}`,
    data,
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

export const getSensitiveList = (data) =>
  request({
    url: "/gov/api/asset/filing/sensitive",
    method: "POST",
    data,
  });

export const getFilterByModuleCode = (moduleCode) =>
  request({
    url: `/gov/api/common/page/filter/${moduleCode}`,
    method: "GET",
  });
