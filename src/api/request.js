import axios from "axios";
import store from "@/store";
import ENV from "./env";
import qs from "qs";
import { message } from "ant-design-vue";
import storage from "@sub/utils/storage";
import getBlobFileName from "@/v2/utils/getBlobFileName";


const contentTypeList = {
  1: "application/x-www-form-urlencoded",
  2: "application/json;charset=UTF-8",
  3: "multipart/form-data",
};
const pendingMap = new Map();
/**
 * @function getPendingKey - 生成单次请求唯一的key
 * @params {Object} - config
 * @returns {String} 单次请求唯一的key
*/
function getPendingKey(config) {
  let { url, method, params, data, headers } = config;
  if (typeof data === "string" && headers['Content-Type'] !== 'application/x-www-form-urlencoded') {
    data = data ? JSON.parse(data) : data;
  } // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&").toLowerCase();
}
/**
 * @function addPending - 储存每个请求唯一值, cancel()方法, 用于取消请求
 * @params {Object} - config
 * @returns {void}
*/
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}
/**
 * @function removePending - 删除重复请求
 * @params {String} - config
 * @returns {void}
*/
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    // const cancelToken = pendingMap.get(pendingKey);
    // cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

axios.defaults.withCredentials = true;
// 拦截器
axios.interceptors.request.use(
  (config) => {
    axios.defaults.timeout = config.timeout || 120 * 1000;
    config.headers["Authorization"] = storage.session.get("VUEX_ST_TOKEN") || "";
    config.headers["Device"] = storage.session.get('loginUniqueId') || "";//设备ID
    config.headers["Source"] = "PC";
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    // removePending(config);
    // addPending(config);
    if (config.data && config.data.attachment) {
      let temp = config.data.attachment.split(",");
      if (temp.length) {
        temp = temp.map((el) => {
          return el.replace(ENV.BASE_NET, "");
        });
        config.data.attachment = temp.join(",");
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    removePending(res.config);
    if (res.status === 200) {
      const response = getBlobFileName(res);

      if (response?.data?.result?.attachment) {
        let temp = response?.data?.result?.attachment?.split(",");
        if (temp.length) {
          temp = temp.map((el) => {
            return ENV.BASE_NET + el;
          });
          response.data.result.attachment = temp?.join(",");
        }
      }
      return response.data;
    } else {
      return Promise.reject(res);
    }
  },
  (error) => {
    error.config && removePending(error.config);
    const errorMessage = error?.response?.data?.error?.message || `请求错误${JSON.stringify(error?.response?.data?.error)}`;
    if (error?.response?.data instanceof Blob) {
      // 将blob文件流转换成json
      const reader = new FileReader();
      reader.onload = () => {
        const str = JSON.parse(reader.result).error?.message;
        message.error(str);
      };
      reader.readAsText(error.response.data);
    }
    const code = Number(error?.response?.status);
    switch (true) {
      case code === 400:
        message.error(`${errorMessage}`);
        break;
      case code === 401:
        message.error("登录失效请重新登录").then(() => {
          store.commit("user/USER_LOGIN_401");
        });
        break;
      case code === 404:
        // message.error({
        //   content: `code: ${code}, message: 请求资源不存在11${JSON.stringify(error?.response)}`,
        //   duration: 1
        // });
        break;
      case code === 409:
        message.error(errorMessage);
        break;
      case code === 500:
        message.error(`code: ${code}, message: ${error?.response?.statusText}`);
        break;
      default:
        break;
    }
    if(!error.response) {
      return Promise.reject('请求失败');
    }
    return Promise.reject(error.response || {reason:'重复请求', ...error});
  }
);

// ajax 二次封装

export default function request(url, data = {}, method = "POST", type = 1, blob = "json", timeout = 120 * 1000) {
  // if(!navigator.onLine) {
  //   message.error('网络错误,请检查网络设置!');
  //   return Promise.resolve({success: false, data: null});
  // }
  // const paramsData = trimObjectValues(data);
  let params = method === "POST" || method === "PUT" ? "data" : "params";
  const config = {
    url,
    method,
    [params]: params == "data" && type === 1 ? qs.stringify(data) : data,
    headers: {
      "Content-Type": contentTypeList[type],
    },
    responseType: blob,
    timeout,
  };
  if(pendingMap.has(getPendingKey(config)) && !(data instanceof FormData)) {
    return Promise.reject({reason: '重复请求', config});
  }
  addPending(config);
  return sendHttpRequest(config);
}

function sendHttpRequest(config){
  return new Promise((reslove, reject) => {
    axios(config)
      .then((res) => {

        reslove(res);
      })
      .catch((err) => {
        reject(err);
      })
  });
}
