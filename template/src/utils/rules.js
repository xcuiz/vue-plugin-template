/*
 * @Author: your name
 * @Date: 2020-04-21 16:11:00
 * @LastEditTime: 2020-12-11 10:44:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/utils/rules.js
 */

// 效验特殊字符
export const checkChar = /(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,，]{1,250}$)/;

// 效验电话
export const checkMob = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

// 效验qq
export const checkQQ = /^[1-9][0-9]{4,10}$/;

// 效验微信号
export const checkWx = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;

// 效验邮箱
// eslint-disable-next-line no-useless-escape
export const checkEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

// 效验手机号码
export const checkTel = /^1[34578]\d{9}$/;

// 效验身份证
export const checkIdCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

// 效验url
// eslint-disable-next-line no-useless-escape
export const checkUrl = /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// 效验Ip4
export const checkIp4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// 效验十六进制颜色正则
export const checkRgb = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

// 只能输入字母下划线，且字母开头结尾，不能__两个下划线相连
export const checkLetterAndUnderline = /^[A-Za-z]([A-Za-z]|_[A-Za-z])*$/;

// 正数 /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
export const positive = /^((0\.\d+)|(([1-9]\d*)(\.\d+)?))$/;

// 正整数
export const positiveInteger = /^[1-9]\d*$/;

// 整数
export const integer = /^-?[1-9]\d*$/;

// 只含有汉字、数字、字母、下划线，下划线位置不限
export const checkLetterLine = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;

// 只含有数字、字母、下划线，下划线位置不限
export const checkEnLetterLine = /^\w+$/;
