import { get, post } from "../common/methods";
import { request } from "@/plugin/request";
import {
  PAGE_TYPE,
  COLLECT_FILTER_TYPE,
  CONFIG_INFO_FILTER_TYPE,
  DATABASE_MANAGE_FILTER_TYPE,
  SLOW_SQL_FILTER_TYPE,
} from "../common/js/constant";
import { getRealPageType } from "../common/js/util";
// 获取所有的过滤器列表
export function getFilterTypesAsync(pageType) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
      url = `/gov/api/insight/${realPageType}/filtertype`;
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_PROGRAM:
    case PAGE_TYPE.LIST_DATA:
      url = `/gov/api/insight/list/filtertype/${realPageType}`;
      break;
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
      url = "/gov/api/insight/anomaly/overview/filtertype";
      break;
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = "/gov/api/insight/threat/overview/filtertype";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/list/overview/filtertype/${realPageType}`;
      break;
    case PAGE_TYPE.DETAIL_USER_GROUP:
    case PAGE_TYPE.DETAIL_DEVICE_GROUP:
      url = `/gov/api/insight/list/filtertype/${realPageType}`;
      break;
    case PAGE_TYPE.COLLECT_CONTROL:
      return Promise.resolve(COLLECT_FILTER_TYPE);
    case PAGE_TYPE.CONFIG_INFO:
      return Promise.resolve(CONFIG_INFO_FILTER_TYPE);
    case PAGE_TYPE.DATABASE_MANAGE:
      return Promise.resolve(DATABASE_MANAGE_FILTER_TYPE);
    case PAGE_TYPE.SLOW_SQL:
      return Promise.resolve(SLOW_SQL_FILTER_TYPE);
  }

  // 加载过滤器列表
  return get(url);
}

// 保存过滤条件
export function saveFilterConditionAsync(
  pageType,
  { name = "", desc = "", conditions = [] }
) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  let type = "";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
      url = `/gov/api/insight/${realPageType}/savefiltercondition`;
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_PROGRAM:
    case PAGE_TYPE.LIST_DATA:
      type = realPageType;
      url = "/gov/api/insight/list/savefiltercondition";
      break;
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/savefiltercondition`;
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
    case PAGE_TYPE.DETAIL_USER_GROUP:
    case PAGE_TYPE.DETAIL_DEVICE_GROUP:
      type = realPageType;
      url = "/gov/api/insight/list/overview/savefiltercondition";
      break;
  }
  return post(url, { name, desc, type, conditions }, {}, {}, true);
}

// 获取所有已保存的过滤条件
export function getSavedFiltersAsync(pageType) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  let method = "";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
      url = `/gov/api/insight/${realPageType}/filtercondition`;
      method = "post";
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_PROGRAM:
    case PAGE_TYPE.LIST_DATA:
      url = `/gov/api/insight/list/filtercondition/${realPageType}`;
      method = "get";
      break;
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/filtercondition`;
      method = "get";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
    case PAGE_TYPE.DETAIL_USER_GROUP:
    case PAGE_TYPE.DETAIL_DEVICE_GROUP:
      url = `/gov/api/insight/list/overview/filtercondition/${realPageType}`;
      method = "get";
      break;
  }
  if (method === "post") {
    return post(url);
  } else {
    return get(url);
  }
}

// 删除某过滤条件
export function deleteSavedFilterAsync(pageType, id) {
  let realPageType = getRealPageType(pageType);
  id = id.toString();
  let url = "";
  let data = {};
  let method = "delete";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
    case "threat":
      url = `/gov/api/insight/${realPageType}/filtercondition/` + id;
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_PROGRAM:
    case PAGE_TYPE.LIST_DATA:
    case PAGE_TYPE.DETAIL_USER_GROUP:
    case PAGE_TYPE.DETAIL_DEVICE_GROUP:
      url = "/gov/api/insight/list/filtercondition";
      data = {
        id,
        type: realPageType,
      };
      break;
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/filtercondition/${id}`;
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = "/gov/api/insight/list/filtercondition/";
      method = "post";
      data = {
        id,
        type: realPageType,
      };
      break;
  }
  return request({
    url,
    method,
    data,
  });
}

// 恢复某一保存的过滤条件
export function getSavedFilterDetailAsync(pageType, id) {
  let realPageType = getRealPageType(pageType);
  id = id.toString();
  let url = "";
  let method = "";
  let data = {};
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
      url = `/gov/api/insight/${realPageType}/conditiondetail/` + id;
      method = "get";
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_DATA:
    case PAGE_TYPE.LIST_PROGRAM:
      url = `/gov/api/insight/list/conditiondetail`;
      method = "post";
      data = {
        id,
        type: realPageType,
      };
      break;
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/conditiondetail/${id}`;
      method = "get";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
    case PAGE_TYPE.DETAIL_USER_GROUP:
    case PAGE_TYPE.DETAIL_DEVICE_GROUP:
      url = " /api/insight/list/conditiondetail/";
      method = "post";
      data = {
        id,
        type: realPageType,
      };
      break;
  }
  if (method === "post") {
    return post(url, data);
  } else {
    return get(url);
  }
}

// 查询过滤器对应的选项
export function getFilterTypeValueAsync(filterMode, filterSource, sourceUrl) {
  let url = "/gov/api/insight/anomaly/filtertypevalue";
  if (sourceUrl) {
    url = sourceUrl;
  }
  return post(url, { filterMode, filterSource });
}

// 查询运算符
export function getFilterOperatorAsync() {
  let url = "/gov/api/insight/anomaly/filteroperator";
  return get(url);
}
