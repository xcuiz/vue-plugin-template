import { get, post } from "../common/methods";
import { PAGE_TYPE } from "../common/js/constant";
import { getRealPageType } from "../common/js/util";

// 获取所有的列
export function getAllColumnsAsync(pageType) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.RULE_RECYCLE_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
    case PAGE_TYPE.DETAIL_USER_EXCEPTION:
    case PAGE_TYPE.DETAIL_USER_THREAT:
    case PAGE_TYPE.DETAIL_DEVICE_EXCEPTION:
    case PAGE_TYPE.DETAIL_DEVICE_THREAT:
    case PAGE_TYPE.DETAIL_APPLICATION_EXCEPTION:
    case PAGE_TYPE.DETAIL_APPLICATION_THREAT:
    case PAGE_TYPE.DETAIL_DATA_EXCEPTION:
    case PAGE_TYPE.DETAIL_DATA_THREAT:
    case PAGE_TYPE.DETAIL_PROGRAM_EXCEPTION:
    case PAGE_TYPE.DETAIL_PROGRAM_THREAT:
      url = `/gov/api/insight/${realPageType}/${realPageType}field`;
      break;
    case PAGE_TYPE.DETAIL_EXCEPTION:
      url = "/gov/api/insight/threat/threatfield";
      break;
    case PAGE_TYPE.DETAIL_THREAT:
      url = "/gov/api/insight/anomaly/anomalyfield";
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_DATA:
    case PAGE_TYPE.LIST_PROGRAM:
      url = `/gov/api/insight/list/optionfield/${realPageType}`;
      break;
  }
  return get(url);
}

getListDataAsync.getConfig = function (pageType) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  let params = {};
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
    case PAGE_TYPE.DETAIL_USER_EXCEPTION:
    case PAGE_TYPE.DETAIL_USER_THREAT:
    case PAGE_TYPE.DETAIL_DEVICE_EXCEPTION:
    case PAGE_TYPE.DETAIL_DEVICE_THREAT:
    case PAGE_TYPE.DETAIL_APPLICATION_EXCEPTION:
    case PAGE_TYPE.DETAIL_APPLICATION_THREAT:
    case PAGE_TYPE.DETAIL_DATA_EXCEPTION:
    case PAGE_TYPE.DETAIL_DATA_THREAT:
    case PAGE_TYPE.DETAIL_PROGRAM_EXCEPTION:
    case PAGE_TYPE.DETAIL_PROGRAM_THREAT:
      url = `/gov/api/insight/${realPageType}/${realPageType}info`;
      break;
    case PAGE_TYPE.RULE_RECYCLE_EXCEPTION:
      params = { anomalyStatus: 2 };
      url = `/gov/api/insight/${realPageType}/${realPageType}info`;
      break;
    case PAGE_TYPE.DETAIL_EXCEPTION:
      url = `/gov/api/insight/threat/threatinfo`;
      break;
    case PAGE_TYPE.DETAIL_THREAT:
      url = `/gov/api/insight/anomaly/anomalyinfo`;
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_DATA:
    case PAGE_TYPE.LIST_PROGRAM:
      {
        let type = realPageType === "application" ? "app" : realPageType;
        url = `/gov/api/insight/list/${type}`;
      }
      break;
  }
  return {
    url,
    params,
    method: "post",
  };
};
// 获取列表数据
export function getListDataAsync(pageType, params) {
  let config = getListDataAsync.getConfig(pageType);
  return post(
    config.url,
    { ...config.params, ...params },
    {},
    { isCancel: true }
  );
}

// 下载
export function downloadAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.LIST_EXCEPTION:
    case PAGE_TYPE.LIST_THREAT:
      url = `/gov/api/insight/${realPageType}/download`;
      break;
    case PAGE_TYPE.LIST_USER:
    case PAGE_TYPE.LIST_DEVICE:
    case PAGE_TYPE.LIST_APPLICATION:
    case PAGE_TYPE.LIST_DATA:
    case PAGE_TYPE.LIST_PROGRAM:
      {
        let type = realPageType === "application" ? "app" : realPageType;
        url = `/gov/api/insight/list/${type}download`;
      }
      break;
  }
  return post(url, params, {}, { responseType: "blob" });
}

// 保存用户所选的字段
export function saveUserOperateColumns(type, selectFields = []) {
  const fields = selectFields.map((item) => item.code);
  let url = `/gov/api/insight/anomaly/selectField`;
  return post(url, { type, selectFields: fields }, {}, { isCancel: true });
}
