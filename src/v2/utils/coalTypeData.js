import store from "@/store";
// 根据煤种不同，基准质量指标不同（由后端字典接口返回）

export const transformZhiBiao = (data) => {
  // 后台返回的字典转换成前端需要的格式

  let obj = {};
  for (let key in data) {
    let array = [];
    let c = data[key] || [];
    c.forEach((item, index) => {
      let type = item.ext1 ? "range" : "number";
      if (type == "range") {
        let res = {
          show: index < 4 ? true : false,
          label: item.title,
          type: "range",
          first_value: item.name,
          last_value: item.ext1,
          require: item.nullable,
          int: item.isInteger,
          first: {
            min: item.rangeMin,
            max: item.rangeMax,
          },
          last: {
            min: item.rangeMin,
            max: item.rangeMax,
          },
          placeholder: item.placeholder,
          errorStr: item.errorMsg,
          checkValid: item.checkValid,
          decimalPlace: item.decimalPlace,
          symbol: item.symbol,
        };
        array.push(res);
      } else {
        let res = {
          show: index < 4 ? true : false,
          label: item.title,
          type: "number",
          value: item.name,
          require: item.nullable,
          int: item.isInteger,
          min: item.rangeMin,
          max: item.rangeMax,
          placeholder: item.placeholder,
          errorStr: item.errorMsg,
          checkValid: item.checkValid,
          decimalPlace: item.decimalPlace,
          symbol: item.symbol,
        };
        array.push(res);
      }
    });
    obj[key] = array;
  }

  return obj;
};

const obj = {
  order: transformZhiBiao(store.getters['config/VUEX_ST_ORDERZHIBIAOCODE']),
  receive: transformZhiBiao(store.getters['config/VUEX_ST_RECEIVEZHIBIAOCODE']),
};

export default obj;
