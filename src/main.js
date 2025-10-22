/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
import './untils/polyfill';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
import 'ant-design-vue/dist/antd.less';
import Vue from 'vue';
import App from './App.vue';
import router from '@/v2/router/index';
import store from './store';
import MetaInfo from 'vue-meta-info';
import 'assets/base/base.css';
import 'assets/styl/common.styl';
import 'assets/base/table.css';
import 'assets/base/upload.less';
import 'assets/base/reset.less';
import '@/v2/style/common.less';
import 'assets/base/tooltip.less';
import 'assets/base/style.less';
import '@/v2/style/detail.less';
import '@/v2/style/theme.less';

import * as echarts from 'echarts';
import storage from '@sub/utils/storage';
import './assets/iconfont/iconfont.css';
import './assets/menu-icon/iconfont.css';
import '@/assets/base/thymeleaf.less';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import constants from '@sub/utils/constants';
import constantsSteels from '@sub/utils/steelConstants.js';
import vauth from '@sub/directive/permission'; // 引入权限自定义指令
import vdbc from '@sub/directive/debounceclick'; // 引入权限自定义指令
import inputTip from '@sub/directive/inputTipUnit';
import nullValue from '@sub/directive/nullValue';
import mainTip from '@sub/directive/mainTip';
import wrapForm from '@sub/utils/wrapForm.js';
import '@/v2/config/htmlDocument';
// import '@/v2/utils/fileProxy';
import * as filters from '@sub/filters';
import * as Sentry from '@sentry/vue';

// import '@/v2/utils/fileProxy';
import RsaDecrypt from '@/v2/utils/rsa';
const RsaDecryptDis = new RsaDecrypt();
RsaDecryptDis.init();
RsaDecryptDis.registerHooks();
Vue.prototype.$RsaDecrypt = RsaDecryptDis;

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]); //插入过滤器名和对应方法
});
moment.locale('zh-cn');
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { ConfigProvider, message, Modal } from 'ant-design-vue';
import antdv from 'ant-design-vue';
import { reportSDKConfig } from '@/v2/config/reportConfig';
// import '@/v2/utils/service'

import TableTooltip from '@/components/tooltip/index.js';
Vue.use(TableTooltip);

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

Vue.use(ConfigProvider);
Vue.use(vauth);
Vue.use(inputTip);
Vue.use(mainTip);
Vue.use(nullValue);
Vue.use(vdbc);
Vue.use(Viewer);
Vue.use(MetaInfo);
Vue.use(antdv);

Number.prototype.toNumberString = function (min = 0, max = 4) {
	if (this !== 0 && !this) {
		return null;
	}
	return this.toLocaleString(undefined, {
		minimumFractionDigits: min,
		maximumFractionDigits: max
	});
};
Vue.filter('toNumberString', function (val, min = 0, max = 4) {
	if (val !== 0 && !val) {
		return null;
	}
	return val.toLocaleString(undefined, {
		minimumFractionDigits: min,
		maximumFractionDigits: max
	});
});

Vue.prototype.$echarts = echarts;
Vue.prototype.$storage = storage;
Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.config.productionTip = false;
Vue.prototype.CONSTANTS = constants;
Vue.prototype.CONSTANTSSTEELS = constantsSteels;
Vue.prototype.$eventBus = new Vue();

// 修改setField方法，避免告警
const oldcreateForm = Vue.prototype.$form.createForm;
Vue.prototype.$form.createForm = (...args) => {
	let obj = oldcreateForm.apply(this, args);
	return wrapForm(obj);
};
// 初始化数据上报
window.reportUtil = new window.ReportSDK({
	...reportSDKConfig
}).init();

// message全局样式配置
message.config({
	top: `50%`,
	duration: 3,
	maxCount: 1
});

new Vue({
	store,
	router,
	// components: { zhCN },
	data() {
		return {
			// locale: zhCN
		};
	},
	render: h => h(App),
	mounted() {
		document.dispatchEvent(new Event('render-event'));
	}
}).$mount('#app');

if (window.location.host === 'www.shdatalink.com') {
	Sentry.init({
		Vue: Vue,
		autoSessionTracking: false,
		release: 'rest-use-version',
		ignoreErrors: [
			/ChunkLoadError/,
			'UnhandledRejection',
			'ChunkLoadError',
			/Request failed with status code 409/,
			/Request failed with status code 500/,
			/Error: Network Error/
		],
		dsn: 'https://652e113a272148108cc242b9349ad18f@sentry.shanghaishulian.com/3'
	});
}
