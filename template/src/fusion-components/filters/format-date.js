/**
 * 格式化时间
 * Created by ligang on 2018/8/13.
 */
import { formatDate } from '../util/base.js'
import dayjs from 'dayjs'

export default function (value, options) {
  if (!value) return value
  options = options || 'yyyy-MM-dd hh:mm:ss'
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  // if (typeof (value) === 'string') value = parseInt(value)
  
  // return formatDate.call(new Date(value), options)
}
