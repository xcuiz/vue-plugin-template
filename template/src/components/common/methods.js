import { request, requestAll } from "@/plugin/request";

export function get(url, params = {}, config = {}, options = {}, all = false) {
  let reqConfig = Object.assign({}, config, {
    url,
    method: "get",
    data: params,
  });
  if (all) {
    return requestAll(reqConfig, options);
  }
  return request(reqConfig, options);
}

export function post(url, params = {}, config = {}, options = {}, all = false) {
  let reqConfig = Object.assign({}, config, {
    url,
    method: "post",
    data: params,
  });
  if (all) {
    return requestAll(reqConfig, options);
  }
  return request(reqConfig, options);
}
