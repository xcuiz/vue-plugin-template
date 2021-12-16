/*
 * @Author: your name
 * @Date: 2020-08-06 14:18:17
 * @LastEditTime: 2020-08-13 14:33:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/util/download.js
 */
import { request } from "@/plugin/request.js";

const downloadBlob = (blob, fileName) => {
  const DEFAULT_FILENAME = "file";
  let fileNameFromHeaders;
  try {
    fileNameFromHeaders = decodeURIComponent(
      blob.headers["content-disposition"].split(";")[1].split("=")[1]
    );
  } catch (error) {
    fileNameFromHeaders = DEFAULT_FILENAME;
  }
  fileName = fileName || fileNameFromHeaders || DEFAULT_FILENAME;
  const url = window.URL.createObjectURL(blob.data);
  let tagA = document.createElement("a");
  tagA.setAttribute("download", fileName);
  tagA.setAttribute("href", url);
  tagA.click();
  // 释放
  tagA = null;
  window.URL.revokeObjectURL(url);
};
/**
 *
 * @param {string} fileName 下载的文件名
 * @param {string} href 下载接口url地址
 * @param {string} method 接口请求方式 get、post
 * @param {*} data 传参
 */
// 文件下载
export default function (fileName, href, method = "get", data) {
  // let href = `/gov/api/system/temp/filedownload/${encodeURIComponent(fileName)}`
  // if (permanent) {
  //   href = `/gov/api/system/permanent/filedownload?fileName=${encodeURIComponent(fileName)}`
  // }

  // 请求并下载文件
  request(
    {
      url: href,
      method,
      data,
    },
    {
      responseType: "blob",
    }
  ).then((blob) => {
    downloadBlob(blob, fileName);
  });
}

export { downloadBlob };
