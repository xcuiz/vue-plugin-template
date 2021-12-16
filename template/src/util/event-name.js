/*
避免事件名称冲突
*/

// 消息中心 模块
const MESSAGE_CENTER = {
  WEBSOCKET_UNREAD_MSG_SINGLE: "websocket/unread_msg_single",
  WEBSOCKET_UNREAD_MSG_CNT: "websocket/unread_msg_cnt",
};

// 模型监控 模块
const EVENT_MONITOR = {
  WEBSOCKET_MONITOR_STATUS: `websocket/monitor_status`,
};

// 事件溯源 模块
const EVENT_SOURCE = {
  WEBSOCKET_SOURCE_TASK_RUN_STATUS: `websocket/source_task_run_status`,
};

// 资产管理 模块
const ASSET = {
  WEBSOCKET_ASSET_ANALYSIS: `websocket/asset-analysis`,
  WEBSOCKET_ASSET_SYNCRONIZE: `websocket/asset-syncronize`,
};

// 情报信息 模块
const INFO = {
  WEBSOCKET_INFO_PARSE: "websocket/ti_analysis",
};

export { MESSAGE_CENTER, EVENT_MONITOR, EVENT_SOURCE, ASSET, INFO };
