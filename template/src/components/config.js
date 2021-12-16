/*
 * @Author: your name
 * @Date: 2020-06-21 17:05:15
 * @LastEditTime: 2020-11-26 16:22:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/components/graphCharts/config.js
 */
// 根据type获取对应的图标，如果无，则返回 空

export const iconConfig = {
  user: "iconpeople",
  device: "iconmonitor",
  app: "iconapp",
  data: "icondata21",
  program: "icontreaty",
  anomaly: "iconalarm",
  threat: "iconthreaten1",
};
// 根据类型，判断跳转的页面
export const Links = {
  user: "insight-user-detail",
  device: "insight-device-detail",
  app: "insight-application-detail",
  data: "insight-data-detail",
  program: "insight-program-detail",
  anomaly: "exception-detail",
  threat: "threat-detail",
};

// 风险颜色
const riskColor = {
  low: "#F9D446",
  medium: "#FF9900",
  high: "#fe3235",
};
/**
 * 获取风险颜色
 * @param {Number| String} item 风险数值
 * @returns {String} 颜色
 */
export const getRiskColor = (item) => {
  let num = parseFloat(item);
  let riskLevel = "low";
  if (num >= 8) {
    riskLevel = "high";
  } else if (num >= 5 && num < 8) {
    riskLevel = "medium";
  }
  return riskColor[riskLevel];
};

// 二级目录映射
export const typeDicts = {
  user: "用户",
  device: "设备",
  application: "应用",
  data: "数据",
  program: "程序",
};

// 用户组详情-字典项
export const userGroupInfoDicts = {
  account: "账号名",
  accountType: "账号类型",
  deviceIp: "所属设备IP",
  appName: "所属应用名称",
  accountStatus: "账号状态",
  accountGroup: "账号组",
  accountCreateTime: "创建时间",
  lastLoginTime: "最后登录时间",
  validTime: "账号生效时间",
  inValidTime: "账号失效时间",
};

// 用户详情-用户信息字典项
const userInfoDicts = {
  status: "在职状态",
  deptName: "所属部门",
  station: "所属岗位",
  type: "员工类型",
  location: "所在地理位置",
  telephone: "办公号码",
  email: "邮箱",
};
// 设备详情-信息字典项
const deviceInfoDicts = {
  deviceIp: "设备IP",
  deviceType: "设备类型",
  deviceValue: "设备价值",
  deptName: "所属部门",
  deviceOwner: "资产责任人",
  deviceVendor: "厂商名称",
};

// 应用详情-信息字典项
const applicationInfoDicts = {
  appIp: "应用所属ip",
  appPort: "应用所属端口",
  appUrl: "应用URL",
  appType: "应用类型",
  deptName: "所属部门名称",
  appValue: "应用价值",
};

// 数据详情-信息字典项
const dataInfoDicts = {
  dataType: "数据类型",
  dataHash: "数据哈希值",
  dataValue: "数据价值",
  dataSensitive: "敏感内容",
  dataIp: "所属ip",
  deptName: "所属部门名称",
  dataOwner: "所属负责人",
};

// 程序详情-信息字典项--暂无
const programInfoDicts = {
  1: "应用所属ip",
  2: "应用所属端口",
  3: "应用URL",
  4: "应用类型",
  5: "所属部门名称",
  6: "应用价值",
};
// 根据类别去 用户、设备、数据 等用户信息字典项
export const getTypeInfoDicts = (type) => {
  switch (type) {
    case "user":
      return userInfoDicts;
    case "device":
      return deviceInfoDicts;
    case "application":
      return applicationInfoDicts;
    case "data":
      return dataInfoDicts;
    case "program":
      return programInfoDicts;
    default:
      return userInfoDicts;
  }
};
// group配置
const userGroup = {
  title: "用户组信息", // 标题
  name: "HR用户组", // 用户名--后续改为接口获取，目前写死
  des:
    "检查与外部系统相关的用户行为，例如访问的网站类型和网络连接，风险排行表示该用户在全部用户中的风险排行。", // 描述
  columnList: [
    {
      // 弹窗table对应的column
      key: "name",
      name: "用户名",
    },
    {
      key: "uuid",
      name: "唯一标识",
    },
  ],
  footer: "个用户", // 弹窗footer
};

const deviceGroup = {
  title: "设备组信息",
  name: "设备部门组",
  des: "设备组是基于设备基础信息表中维护的部门划分的组。",
  columnList: [
    {
      key: "name",
      name: "设备名",
    },
    {
      key: "uuid",
      name: "唯一标识",
    },
  ],
  footer: "台设备",
};

export const getGroupInfo = (type) => {
  let group;
  switch (type) {
    case "user":
      group = userGroup;
      break;
    case "device":
      group = deviceGroup;
      break;

    default:
      group = userGroup;
      break;
  }
  return group;
};
