/**
 * 浏览器存储对象方法
 * storage.session/storage.local
*/
const sessionStorage = window.sessionStorage;
const localStorage = window.localStorage;
const storage = {
  session: {
    /**
     * @function has
     * @params {String} 要存储的name
     * @return {Boolean} 存在true 不存在false
    */
    has(name) {
      if (!sessionStorage.getItem(name) && !sessionStorage.getItem(name + "_obj")) {
        return false;
      }
      return true;
    },
    /**
     * @function get
     * @params {String} 要获取的对象的name，判断要获取的值是不是一个对象，是：需要反序列化返回
     * @return {any} 存在返回值 不存在null
    */
    get(name) {
      if (this.has(name)) {
        if (Object.keys(sessionStorage).includes(name + "_obj")) {
          return JSON.parse(sessionStorage.getItem(name + "_obj"));
        } else {
          return sessionStorage.getItem(name);
        }
      } else {
        return null;
      }
    },
    /**
     * 如果存储的是一个对象，先序列化，并且在key上添加_obj的标识
     * @function set
     * @return {void}
    */
    set(name, value) {
      if (typeof value === "object" || typeof value === "number") {
        sessionStorage.setItem(name + "_obj", JSON.stringify(value));
      } else {
        sessionStorage.setItem(name, value);
      }
    },
    /**
     * @function remove
     * @return {Boolean} 存在并且删除返回true，不存在返回false
    */
    remove(name) {
      if (this.has(name)) {
        sessionStorage.removeItem(name);
        sessionStorage.removeItem(`${name}_obj`);
        return true;
      } else {
        return false;
      }
    },
    /**
     * @function clear
     * @return {void}
    */
    clear() {
      sessionStorage.clear();
    },
  },
  local: {
    has(name) {
      if (!localStorage.getItem(name) && !localStorage.getItem(name + "_obj")) {
        return false;
      }
      return true;
    },
    get(name) {
      if (this.has(name)) {
        if (Object.keys(localStorage).includes(name + "_obj")) {
          return JSON.parse(localStorage.getItem(name + "_obj"));
        } else {
          return localStorage.getItem(name);
        }
      } else {
        return null;
      }
    },
    set(name, value) {
      if (typeof value === "object" || typeof value === "number") {
        localStorage.setItem(name + "_obj", JSON.stringify(value));
      } else {
        localStorage.setItem(name, value);
      }
    },
    remove(name) {
      if (this.has(name)) {
        localStorage.removeItem(name);
        localStorage.removeItem(`${name}_obj`);
        return true;
      } else {
        return false;
      }
    },
    clear() {
      const contractListGuide = localStorage.getItem('contractListGuide');
      const contractCreateGuide = localStorage.getItem('contractCreateGuide');
      localStorage.clear();
      if(contractListGuide) {
        localStorage.setItem('contractListGuide', contractListGuide);
      }
      if(contractCreateGuide) {
        localStorage.setItem('contractCreateGuide', contractCreateGuide);
      }
    },
  },
};

export default storage;
