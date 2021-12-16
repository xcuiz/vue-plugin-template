/*
 * @Author: your name
 * @Date: 2021-03-08 10:31:25
 * @LastEditTime: 2021-04-01 20:12:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\resource-claim\api\index.js
 */

import { request } from "@/plugin/request";
export const getDataResourceList = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/claim/page",
    data,
  });

// 过滤
export const getListFilterFields = () =>
  request({
    method: "get",
    url: "/gov/api/common/page/filter/assetClaim",
  });

export const getFilterValue = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetClaim/${code}`,
  });
//

export const deleteResourceList = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/claim/delete`,
    data,
  });

export const ImportFile = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/claim/import`,
    data,
  });

export const downloadTemplate = (type) => {
  return request(
    {
      method: "get",
      url: `/gov/api/asset/list/download/${type}`,
    },
    {
      responseType: "blob",
    }
  );
};

export const claimResource = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/claim/claim`,
    data,
  });

export const getSelectOptions = (type) =>
  request({
    method: "get",
    url: `/gov/api/asset/list/dict/${type}`,
  });

export const getSelDataTypeList = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/cascade`,
    data,
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

export const getSelectNetdistrictSel = () =>
  request({
    method: "get",
    url: "/gov/api/asset/netdistrict/select",
  });

export const getSinsitiveConfig = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/claim/detail/${id}`,
  });

export const extendConfig = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/extConfig`,
    data,
  });

export const getFormExtConfigList = (type) => {
  return request({
    method: "get",
    url: `/gov/api/asset/list/${type}`,
  });
};

export const claimAddOrEdit = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/claim/claim`,
    data,
  });

export const getReaourcePool = () =>
  request({
    method: "get",
    url: "/gov/api/asset/resourcePool/select",
  });

export const getAuthType = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/authType`,
    data,
  });

// 聚合
export const getAggData = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/claim/agg",
    data,
  });
export const getAggFilters = () =>
  request({
    method: "get",
    url: "/gov/api/common/agg/filter/assetClaim",
  });
