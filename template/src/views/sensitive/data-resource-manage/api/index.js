/*
 * @Author: your name
 * @Date: 2021-02-25 11:02:17
 * @LastEditTime: 2021-08-26 14:30:25
 * @LastEditors: fxk
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\data-resource-manage\api\index.js
 */

import { request } from "@/plugin/request";
export const getDataResourceList = (data) =>
  request({
    method: "post",
    url: "/gov/api/asset/list/page",
    data,
  });

export const getResourceType = (data) => {
  return request({
    method: "post",
    url: "/gov/api/asset/list/groupByType",
    data,
  });
};
export const getBusinessSystem = (data) => {
  return request({
    method: "post",
    url: "/gov/api/asset/list/groupByBusiness",
    data,
  });
};

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
export const sinsitiveAddOrEdit = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/addOrEdit`,
    data,
  });

export const getSinsitiveConfig = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/list/detail/${id}`,
  });

export const getListFilterFields = () =>
  request({
    method: "get",
    url: `/gov/api/common/page/filter/assetManager`,
  });

export const getFilterValue = (code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/assetManager/${code}`,
  });

export const getSelDataTypeList = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/cascade`,
    data,
  });

export const extendConfig = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/extConfig`,
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

export const getFormExtConfigList = (type) => {
  return request({
    method: "get",
    url: `/gov/api/asset/list/${type}`,
  });
};

export const deleteResourceList = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/delete`,
    data,
  });

export const ImportFile = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/import`,
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

export const getAuthType = (data) =>
  request({
    method: "post",
    url: `/gov/api/asset/list/authType`,
    data,
  });

// 详情接口
export const getSinsitiveDetail = (id) =>
  request({
    method: "get",
    url: `/gov/api/asset/info/${id}`,
  });

export const getDetailDataFilter = (filterName) =>
  request({
    method: "get",
    url: `/gov/api/common/page/filter/${filterName}`,
  });

export const getDetailDataFilterCode = (model, code) =>
  request({
    method: "get",
    url: `/gov/api/common/filter/value/${model}/${code}`,
  });

export const getDetailData = (data, id) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/${id}/dataList`,
    data,
  });

export const getDetailSubData = (data, tableId) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/tableFields/${tableId}`,
    data,
  });
export const getDetailFile = (data, id) =>
  request({
    method: "post",
    url: `/gov/api/asset/info/${id}/fileList`,
    data,
  });
