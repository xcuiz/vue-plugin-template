/*
 * @Author: your name
 * @Date: 2020-09-23 14:38:31
 * @LastEditTime: 2020-11-19 14:46:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/explore/timeConfig.js
 */
// switch (quickTime) {
//   'today':'今天',
//   '1min':'最近1分钟',
//   '1day':'最近1天',
//   'yesterday':'昨天',
//   '10min':'最近10分钟',
//   '7day':'最近7天',
//   'thisweek':'本周',
//   '15min':'最近15分钟',
//   '30day':'最近30天',
//   'lastweek':'上周',
//   '30min':'最近30分钟',
//  '3mon':'最近3个月' ,
//   'thismonth':'本月',
//   '1hour':'最近1小时',
//   '6mon':'最近6个月'
// 'lastmonth':'上月'

//  '4hour':'最近4小时'
//   case '1year':
//     return '最近1年'
//   case 'thisyear':
//     return '本年'
//   case '12hour':
//     return '最近12小时'
//   case 'all':
//     return '所有时间'
//   case 'lastyear':
//     return '去年'
//   default:
//     return ''
// }
export const quickTimeList = [
  {
    key: "today",
    value: "今天",
  },
  {
    key: "1min",
    value: "最近1分钟",
  },
  {
    key: "1day",
    value: "最近1天",
  },
  {
    key: "yesterday",
    value: "昨天",
  },
  {
    key: "10min",
    value: "最近10分钟",
  },
  {
    key: "7day",
    value: "最近7天",
  },
  {
    key: "thisweek",
    value: "本周",
  },
  {
    key: "15min",
    value: "最近15分钟",
  },
  {
    key: "30day",
    value: "最近30天",
  },
  {
    key: "lastweek",
    value: "上周",
  },
  {
    key: "30min",
    value: "最近30分钟",
  },
  {
    key: "3mon",
    value: "最近3个月",
  },
  {
    key: "thismonth",
    value: "本月",
  },
  {
    key: "1hour",
    value: "最近1小时",
  },
  {
    key: "6mon",
    value: "最近6个月",
  },
  {
    key: "lastmonth",
    value: "上月",
  },
  {
    key: "4hour",
    value: "最近4小时",
  },
  {
    key: "1year",
    value: "最近1年",
  },
  {
    key: "thisyear",
    value: "本年",
  },
  {
    key: "12hour",
    value: "最近12小时",
  },

  {
    key: "all",
    value: "所有时间",
  },
  {
    key: "lastyear",
    value: "去年",
  },
];
// 计算输入框展示的时间文本
export const getTimeText = (
  { startTime, endTime, quickTime, params = {} } = {},
  quickTimeList = [],
  timeUnitSource = []
) => {
  let text;
  if (quickTime) {
    text = quickTimeList.find(({ key }) => key === quickTime).value;
    return text;
  }
  if (!params) {
    return;
  }
  const { type, firstTime, lastTime } = params;

  switch (type) {
    case "quickTime":
      text = firstTime;
      break;
    case "relativeTime":
      {
        // 1 天前---> 前 + 1 + 天
        // 获取timeUnitSource中code对应的label名称
        let unitName = timeUnitSource.find(({ key }) => key === lastTime).value;
        // 删除最后一个字--即 ‘天’
        let name = unitName.substring(0, unitName.length - 1);

        text = "前" + firstTime + name;
      }
      break;
    case "realTime":
      text =
        firstTime + timeUnitSource.find(({ key }) => key === lastTime).value;
      break;
    default:
      text =
        endTime && startTime
          ? startTime + " 至 " + endTime
          : startTime || endTime;
  }
  return text;
};
