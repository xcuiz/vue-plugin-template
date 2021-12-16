import { post } from "../common/methods";
import { PAGE_TYPE } from "../common/js/constant";
import { getRealPageType } from "../common/js/util";

// 数量统计
export function getProfileAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
    case PAGE_TYPE.OVERVIEW_ANALYSIS:
      url = `/gov/api/insight/overview/${realPageType}/statistic`;
      break;
  }
  return post(url, params);
}

// 最新异常/威胁
export function getLatestAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/latest`;
      break;
  }
  return post(url, params);
}

// 获取排行数据
export function getRankDataAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/rank`;
      break;
  }
  return post(url, params);
}

// 威胁相关的用户/数据/程序...
export function getThreatRelatedAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/threat`;
      break;
  }
  return post(url, params);
}

// 异常相关用户/数据/程序...
export function getExceptionRelatedAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/anomaly`;
      break;
  }
  return post(url, params);
}

// 异常/威胁分类，用户类型/应用类型/数据类型/设备类型
export function getCategoryAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/type`;
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
      url = `/gov/api/insight/overview/${realPageType}/type`;
      break;
  }
  return post(url, params);
}

// 用户在职状态
export function getJobStateAsync(params) {
  let url = "/gov/api/insight/overview/user/jobstate";
  return post(url, params);
}

// 用户地址
export function getAddressAsync(params) {
  let url = "/gov/api/insight/overview/user/location";
  return post(url, params);
}

// 部门
export function getDepartmentAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
      url = `/gov/api/insight/overview/${realPageType}/dept`;
      break;
  }
  return post(url, params);
}

// 价值
export function getValueAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_DEVICE:
      url = `/gov/api/insight/overview/${realPageType}/value`;
      break;
  }
  return post(url, params);
}

// 评分
export function getScoreAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
      url = "/gov/api/insight/anomaly/overview/risklevel";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/risklevel`;
      break;
  }
  return post(url, params);
}

// 首页用户状态
export function getUserStatusAsync(param) {
  let url = "/gov/api/home/user/source";
  return post(url, param);
}

// 首页设备状态
export function getDeviceStatusAsync(params) {
  let url = "/gov/api/home/device/source";
  return post(url, params);
}

// 异常组成的威胁/威胁中的异常
export function getOppositeAsync(pageType, params) {
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
      url = "/gov/api/insight/anomaly/overview/threat";
      break;
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = "/gov/api/insight/threat/overview/anomaly";
      break;
  }
  return post(url, params);
}

// 异常/威胁/用户/应用/数据/程序/设备观察列表
export function getWatchAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/watchlist`;
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/watchlist`;
      break;
  }
  return post(url, params);
}

// 用户观察列表中的异常
export function getUserWatchAsync(pageType, params) {
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
      url = "/gov/api/insight/anomaly/overview/userwatchlist";
      break;
  }
  return post(url, params);
}

// 异常/威胁时间表
export function getTimeLineAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_THREAT:
      url = `/gov/api/insight/${realPageType}/overview/timeline`;
      break;
  }
  return post(url, params);
}

// 异常趋势
export function getExceptionTrendDataAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_EXCEPTION:
    case PAGE_TYPE.OVERVIEW_HOME:
      url = "/gov/api/insight/anomaly/overview/trend";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/trend`;
      break;
    // url = '/api/insight/overview/application/trend'
    // break
  }
  return post(url, params);
}

// 威胁趋势
export function getThreatTrendDataAsync(pageType, params) {
  let realPageType = getRealPageType(pageType);
  let url = "";
  switch (pageType) {
    case PAGE_TYPE.OVERVIEW_THREAT:
    case PAGE_TYPE.OVERVIEW_HOME:
      url = "/gov/api/insight/threat/overview/trend";
      break;
    case PAGE_TYPE.OVERVIEW_USER:
    case PAGE_TYPE.OVERVIEW_DEVICE:
    case PAGE_TYPE.OVERVIEW_DATA:
    case PAGE_TYPE.OVERVIEW_APPLICATION:
    case PAGE_TYPE.OVERVIEW_PROGRAM:
      url = `/gov/api/insight/overview/${realPageType}/threattrend`;
      break;
    // url = '/api/insight/overview/application/threattrend'
    // break
  }
  return post(url, params);
}

// 威胁现状
export function getSituationAsync(params) {
  let url = "/gov/api/insight/threat/overview/risklevel";
  return post(url, params);
}

// 威胁处置排行
export function getDisposeAsync(params) {
  let url = "/gov/api/insight/threat/overview/surveyRank";
  return post(url, params);
}

// 设备状态
export function getDeviceStateAsync(params) {
  let url = "/gov/api/insight/overview/device/state";
  return post(url, params);
}

// 登录成功设备类型
export function getSuccessDataAsync(params) {
  let url = "/gov/api/insight/overview/analysis/devicesucc";
  return post(url, params);
}

// 被访问的数据类型
export function getAccessDataAsync(params) {
  let url = "/gov/api/insight/overview/analysis/visitdata";
  return post(url, params);
}

// 登录失败用户
export function getFailUserDataAsync(params) {
  let url = "/gov/api/insight/overview/analysis/userfail";
  return post(url, params);
}

// 登录失败设备
export function getFailDeviceDataAysnc(params) {
  let url = "/gov/api/insight/overview/analysis/devicefail";
  return post(url, params);
}

// 原设备传输
export function getSourceDeviceDataAsync(params) {
  let url = "/gov/api/insight/overview/analysis/srcdevice";
  return post(url, params);
}

// 目标设备传输
export function getTargetDeviceDataAsync(params) {
  let url = "/gov/api/insight/overview/analysis/dstdevice";
  return post(url, params);
}

// 首页统计数据
export function getIndexSignboardAsync(params) {
  let url = "/gov/api/home/statistics";
  return post(url, params);
}
