/*
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
 */
import Vue from 'vue';
import Router from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import { hasAuth } from '@/v2/utils/checkAuth';
import storage from '@sub/utils/storage';
import store from '@/store';
import reportCode from '@/v2/config/reportCode';
import qs from 'qs';

Vue.use(Router);
Vue.prototype.$confirm = Modal;

import centerRouter from './centerRouter';
import unAuthRouter from './unAuthRouter';

let routes = [centerRouter];
// const autoLogoutPath = [  "/act", "/solution", "/case", "/join", "/login"];
// const autoLogoutPath = [  "/login"];

routes = unAuthRouter.concat(routes);

let routers = new Router({
	mode: 'history',
	base: process.env.VUE_APP_BASE_ND_PATH || '',
	fallback: false,
	routes
});

// 解决NavigationDuplicated错误
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err);
};
// 导航守卫
routers.beforeEach(async (to, from, next) => {
	setTimeout(() => {
		var _hmt = _hmt || [];
		(function () {
			//每次执行前，先移除上次插入的代码
			const baiduTjElem = document.getElementById('baidu_tj');
			if (baiduTjElem) {
				baiduTjElem.parentNode.removeChild(baiduTjElem);
			}
			var hm = document.createElement('script');
			hm.src = 'https://hm.baidu.com/hm.js?ff7212e2d7fdbc572c0d0f3dc1b42b66';
			hm.id = 'baidu_tj';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(hm, s);
		})();
	}, 0);
	try {
		window.reportUtil.reportEvent(reportCode?.PV);
	} catch (error) {
		throw new Error(error);
	}
	if (
		!storage.session.get('VUEX_ST_TOKEN') &&
		unAuthRouter.every(el => {
			return el.name != to.name;
		})
	) {
		window.location.href = `/login/?${qs.stringify({ redirectUrl: to.path, ...to.query })}`;
		return;
	}
	let userAuth = store.getters['user/VUEX_ST_USERAUTH'];
	// if (["/center/account/company/info/certified", "/center/account/person/info", "/center/account/person/safety", "/center/account/company/info", "/center/account/company/password/edit"].includes(to.path)) {
	//   next();
	//   await store.dispatch("user/VUEX_USER_TOKEN");
	// }
	if (to.path === '/center/admin/invoice/in/list' && !userAuth.includes('kitInvoice')) {
		message.warn('您没有该系统权限').then(() => {
			next('/center/account/person/info');
		});
	}
	if (to.path === '/center/logisticsPlatform/in/list') {
		next('/center/logisticsPlatform/in');
	}
	if (to.path === '/center/logisticsPlatform/out/list') {
		next('/center/logisticsPlatform/out');
	}
	// 对于配置了权限的路由，当前用户没有权限就跳转到首页
	if (to.meta && to.meta.authCode) {
		if (hasAuth(to.meta.authCode)) {
			next();
		} else {
			next('/home');
		}
	}

	next();
});
routers.onError(error => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	const targetPath = routers.history.pending.fullPath;
	if (isChunkLoadFailed) {
		routers.replace(targetPath);
	}
});

export default routers;
