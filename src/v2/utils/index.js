import qs from "qs";
const filterArr = ["{", "[", "("];
import { cloneDeep } from "lodash";

/**
 * @function checkDataType 判断数据类型
 * @return {} 返回要判断的数据类型
 */

const checkDataType = (data) => {
  return Object.prototype.toString.call(data);
};

/**
 * @function getQueryString 获取url中的参数
 * @param {String} name 参数名称
 * @return {String} 参数值
 */
const getQueryString = (name) => {
  const urlStr = window.location.search.split("?")[1];
  return qs.parse(urlStr)[name];
};

/**
 *  ■ 自动去除空格（字符串中所有的空格）；
    ■ 将“——”、“—”、“---”、“--”全部替换为“-”；
    ■ 将中文括号“（）”替换为英文括号“()”；
    ■ 将“【】”、“『』”、“「」”、“〔〕”替换为“[]”
 * @function filterContractNo 过滤合同号中的特殊字符
 * @param {String} no 合同号码
 * @param {String} no 过滤之后的合同号码
 */
const filterContractNo = (no) => {
  let res = no
    .replace(/——|—|---|--/g, "-")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/【|『|「|〔/g, "[")
    .replace(/】|』|」|〕/g, "]");
  if (res[0] === "{" && res[res.length - 1] === "}") {
    res = res.slice(1, res.length - 1);
  }
  if (res[0] === "[" && res[res.length - 1] === "]") {
    res = res.slice(1, res.length - 1);
  }
  if (res[0] === "(" && res[res.length - 1] === ")") {
    res = res.slice(1, res.length - 1);
  }
  if (!filterArr.includes(res[0]) && !filterArr.includes(res[res.length - 1])) {
    return res;
  } else {
    filterContractNo(res);
  }
};

/**
 * js数字千位分割
 * @function splitNum
 * @param {Number}
 * @return {String}
 */
const splitNum = (num) => {
  if (num) {
    return num.toString().replace(/\d+/, (n) => {
      return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
        return $1 + ",";
      });
    });
  } else {
    return "";
  }
};

/**
 * 去除小数末尾0
 * @function toPrecision
 */
const toPrecision = (str) => {
  if (!/^[0-9.]+$/g.test(str)) {
    return "0";
  }
  while (str.includes(".") && (str.endsWith(".") || str.endsWith("0"))) {
    str = str.slice(0, -1);
  }
  return str;
};

/**
 * 金额保留两位小数
 * 数量保留四位小数
 * 末尾0不显示
 * @function formateNumber
 * @param {Number | String} 要处理的数
 * @param {String} 保留的小数位
 * @return {Number} 处理后的数
 */
const formateNumber = (number, len = 2) => {
  if (!number) return 0;
  const numberFixed = Number(number).toFixed(len).toString();
  return splitNum(toPrecision(numberFixed));
};

/**
 * 过滤对象中所有value的前后空格
 * @function trimObjectValues
 * @param {Object} 要处理的对象
 * @returns {Object} 处理之后的对象
 */

const trimObjectValues = (obj) => {
  const tempObj = obj;
  if (Object.keys(tempObj).length) {
    trimData(obj);
  }
  return tempObj;
};

const trimData = (data) => {
  for (let field in data) {
    if (typeof data[field] === "string") {
      data[field] = data[field].trim();
    }
    if (typeof data[field] === "number") {
      data[field] = Number(data[field].toString().trim());
    }
    if (typeof data[field] === "object") {
      trimData(data[field]);
    }
  }
};

const setCookie = (cname, cvalue, exdays) => {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};
const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
};

/**
 * 
*/
const numUnitList = [
  "万",
  "亿",
  "兆",
  "京",
  "垓",
  "秭",
  "穰",
  "沟",
  "涧",
  "正",
  "载",
  "极",
  "恒河沙",
  "那由他",
  "无量",
  "大数",
  "无穷大",
];
export const computeUnit = (val) => {
  let num = Number(val);
  if (!num || num < 1000) {
    return "";
  }
  
  let numValueList = numUnitList.map((item, index) => {
    return Math.pow(2, 2 + index);
  });
  let unit = "";
  while (num >= Math.pow(10, 4) && unit !== "无穷大") {
    let index = numValueList.findIndex((item) => Math.pow(10, item) > num);
    if (index < 0) {
      unit = "无穷大";
    } else {
      unit = numUnitList[index - 1] + unit;
    }
    num = num / Math.pow(10, numValueList[index - 1]);
  }
  if (unit === "无穷大") {
    return unit;
  }
  let minUnitList = ["", "十", "百", "千"];
  let i = 0;
  let minUnit = "";
  while (num >= 10) {
    minUnit = minUnitList[i + 1];
    i++;
    num = num / 10;
  }
  unit = minUnit + unit;
  return unit;
};

export { checkDataType, getQueryString, filterContractNo, splitNum, formateNumber, trimObjectValues, setCookie, getCookie };
