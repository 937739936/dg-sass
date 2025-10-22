import ENV from "@/v2/config/env";
import request from "@/api/request";

function comDownload(res, url, name) {
  let title = name;
  if (!name && url) {
    // 这里主要是为了解决window和mac返回路径中斜线不一致的问题，window返回的路径以'\'分割，mac返回路径以'/'分割
    // 这个问题目前只有本地有问题，线上服务器是linux系统，使用的是'/'
    if (url.lastIndexOf("/") > url.lastIndexOf("\\")) {
      title = url.substring(url.lastIndexOf("/") + 1);
    } else if (url.indexOf("\\") > -1) {
      title = url.substring(url.lastIndexOf("\\") + 1);
    }
  }

  if ("msSaveOrOpenBlob" in navigator) {
    // 判断是ie的浏览器，调用ie文件下载的方法
    const blob = new Blob([res]);
    window.navigator.msSaveOrOpenBlob(blob, title);
  } else {
    let elink = document.createElement("a");
    elink.download = title;
    elink.style.display = "none";
    let blob = new Blob([res]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  }
}

/**
 * 文件下载
 * @function downlodFile
 * @params {String} url: 文件下载api地址
 * @params {data}   data: 文件下载请求所需参数
 * @params {method} method: 文件下载api方法
 * @return {void}
*/

const downlodFile = (url, data, method = "POST",callback) => {
  if(!url.startsWith("/dg-station-api")){
    url = `${ENV.BASE_API}${url}`
  }
  request(url, data, method, 1, "blob").then((res) => {
    if (res.data) {
      // const contentDisposition = res.headers["content-disposition"];
      // const fileName = contentDisposition.split("=")[1].replace(/(^")|("$)/g, "");
      comDownload(res.data, null, res.name);
      if(callback){
        callback()
      }
    }
  }).catch(() => {
    if(callback){
      callback()
    }
  });
};

export default downlodFile;
