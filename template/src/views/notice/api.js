import { request } from "@/plugin/request";

export const getMessageList = (data) =>
  request({
    method: "post",
    url: "/gov/api/sys/message/pagequery",
    data,
  });

export const readMessage = (data) =>
  request({
    method: "post",
    url: "/gov/api/sys/message/read",
    data,
  });

export const deleteMessage = (data) =>
  request({
    method: "post",
    url: "/gov/api/sys/message/delete",
    data,
  });

export const getMessageNum = (data) =>
  request({
    method: "post",
    url: "/gov/api/sys/message/agg",
    data,
  });
