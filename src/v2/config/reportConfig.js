/**
 * 生产环境除外，其他打点默认uat环境
 * 由于打点sdk判断了当前域名和打点平台配置域名相等才会打点，所以只有在uat和生产环境才会打点
*/
export const reportEnv = {
  production: "prod",
  test1: "uat",
  test2: "uat",
  test3: "uat",
  test4: "uat",
  development: "uat", 
};

export const appidMap = {
  uat: {
    host: "uat-trade.shanghaishulian.com",
    appid: "j21423aqq4",
  },
  prod: {
    host: "www.shdatalink.com",
    appid: "1jsaa5q2ww",
  },
};
const ENV = process.env.VUE_APP_NODE_ENV_CONFIG == 'production' ? 'prod': 'uat';
export const reportSDKConfig = appidMap[ENV];
export const reportConfigEnv = reportEnv[process.env.VUE_APP_NODE_ENV_CONFIG];