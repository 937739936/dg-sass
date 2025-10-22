import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import 'moment/dist/locale/zh-cn'

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import antdv from 'ant-design-vue'
import vdbc from './directive/debounceclick' // 引入权限自定义指令
import Viewer from 'v-viewer'
import wrapForm  from  '@sub/utils/wrapForm.js';
import  moment from 'moment'
import './style/detail.less'
import './style/table.less'
import './style/style.less'


moment.locale('zh-cn')
Vue.use(antdv)
Vue.use(vdbc)
Vue.use(Viewer)

// 修改setField方法，避免告警
const oldcreateForm = Vue.prototype.$form.createForm
Vue.prototype.$form.createForm = (...args)=>{
    let obj = oldcreateForm.apply(this,args)
    return wrapForm(obj)
}

Vue.config.productionTip = false

new Vue({
  data () {
    return {
      locale: zhCN
    }
  },
  render: h => h(App),
}).$mount('#app')
