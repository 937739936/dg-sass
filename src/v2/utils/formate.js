import moment from "moment";

function checkType(value) {
  return Object.prototype.toString.call(value);
}

/**
 * @function formateDate
 * @params {Object} date: 要格式化的日期
 * @params {String} type: 要格式化的日期格式,默认格式"YYYY-MM-DD"
 * @return {String} 返回格式化后的日期
*/
export const formateDate = (date, type = "YYYY-MM-DD") => {
  if (date && checkType(date) === "[object Date]") {
    return moment(date).format(type);
  } else {
    throw new Error("日期不存在或日期格式不合法");
  }
};
