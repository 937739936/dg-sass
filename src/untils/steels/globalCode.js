import store from "@/store";

// 钢材项目专用转换
export function filterCodeByLableName(text, name) {
  let result = "";
  const data = store.getters["config/VUEX_ST_ALLCODE"][name];
  if (data && data.length) {
    data.map((el) => {
      if (el.label == text) {
        result = el.value;
      }
    });
  }
  return result;
}

export function filterSteelsCodeByKey(name) {
  const data = store.getters["config/VUEX_ST_ALLCODE"][name];
  if (data && data.length) {
    return data;
  } else {
    return [];
  }
}
export function filterCodeByValueName(value, name) {
  let result = "";
  const data = store.getters["config/VUEX_ST_ALLCODE"][name];
  if (data && data.length) {
    data.map((el) => {
      if (el.value == value) {
        result = el.label;
      }
    });
  }
  return result;
}
