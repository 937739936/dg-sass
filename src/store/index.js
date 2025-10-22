import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import storage from "@sub/utils/storage";
Vue.use(Vuex);

const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

 const store = new Vuex.Store({
  modules,
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
});
// window.addEventListener('storage', () => {
//   try{
//     let vuex_companyId = store.getters['user/VUEX_ST_COMPANYSUER']?.companyId;
//     let vuex_mobile = store.getters['user/VUEX_ST_PERSONALLINFO']?.mobile;
//     let user = JSON.parse(storage.local.get("vuex"))?.user;

//     let local_companyId = user?.VUEX_ST_COMPANYSUER?.companyId;
//     let local_mobile = user?.VUEX_ST_PERSONALLINFO?.mobile;
//     if(local_companyId != vuex_companyId || vuex_mobile != local_mobile){
//       // store.dispatch('user/VUEX_USER_PERSONAL_DETAILS');
//       location.reload();
//     }
//   }catch(e){}
  
// });

export default store
