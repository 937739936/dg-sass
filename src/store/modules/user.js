import { API_PERMISSION, API_LOGOUT, API_USERCOMPANYSERVICE } from '@/v2/api/account';
import { API_PERSONALDETAIL, API_LOGIN_FREE_PASSWORD, API_REFRESH_TOKEN } from 'api/account';
import { API_ISTERMINALDIRECTOR } from 'api';
import storage from '@sub/utils/storage';
import menu from '@/v2/config/menu';
import authRouter from '@/config/authRouter';
import filterAuth from '@/untils/filterAuth';
import { getQueryString, getCookie, setCookie } from '@/v2/utils/index';
import reportCode from '@/v2/config/reportCode';

const defaultState = {
	VUEX_ST_COMPANYSUER: {}, // 默认企业
	VUEX_ST_PERSONALLINFO: {}, // 所在的全部企业
	VUEX_ST_TOKEN: '', // token
	VUEX_ST_EDITCOMPANYPROFILE: {}, // 编辑的企业详情
	VUEX_ST_COMPANYRELEVANCE: {}, // 企业认证资料存储
	VUEX_ST_BACKURL: '', // 登录返回地址
	VUEX_ST_UNREADLIST: [], // 获取未读信息
	VUEX_ST_USERAUTH: [],
	VUEX_GE_CENTERMENUS: [],
	VUEX_GE_CENTERMENUSMAP: [],
	VUEX_ST_CURRENT_PATH: '',
	VUEX_CURRENT_PLATEFORM: {},
	VUEX_COMPANY_SERVICES: []
};
const user = {
	namespaced: true,
	state: () => defaultState,
	mutations: {
		VUEX_COMPANY_SERVICES(state, data) {
			state.VUEX_COMPANY_SERVICES = data;
		},
		VUEX_MU_CURRENT_PATH(state, data) {
			state.VUEX_ST_CURRENT_PATH = data;
		},
		VUEX_MU_COMPANYSUER(state, data) {
			state.VUEX_ST_COMPANYSUER = data;
		},
		VUEX_MU_PERSONALLINFO(state, data) {
			state.VUEX_ST_PERSONALLINFO = data;
		},
		VUEX_MU_USERTOKEN(state, data) {
			state.VUEX_ST_TOKEN = data;
			storage.session.set('VUEX_ST_TOKEN', data);
		},
		// 编辑的企业信息
		VUEX_MU_EDITCOMPANTPROFILE(state, data) {
			state.VUEX_ST_EDITCOMPANYPROFILE = data;
		},
		// 企业认证资料存储
		VUEX_MU_COMPANYRELEVANCE(state, data) {
			state.VUEX_ST_COMPANYRELEVANCE = data;
		},
		VUEX_MU_BACKURL(state, data) {
			state.VUEX_ST_BACKURL = data;
		},
		VUEX_MU_UNREADLIST(state, data) {
			state.VUEX_ST_UNREADLIST = data;
		},
		SET_PERMISSION_LIST(state, data) {
			state.VUEX_ST_USERAUTH = data;
		},
		SET_VUEX_GE_CENTERMENUS(state, data) {
			const menu = state.VUEX_GE_CENTERMENUSMAP;
			const current = data && data.matched ? data.matched[1] : null;
			if (current?.meta?.authCode) {
				for (let i = 0; i < menu.length; i++) {
					if (current.meta?.authCode === menu[i].authCode) {
						state.VUEX_GE_CENTERMENUS = menu[i].menuList;
						return;
					}
				}
			} else {
				if (menu && menu.length) {
					for (let i = 0; i < menu.length; i++) {
						if (menu[i].menuList && menu[i].menuList.length) {
							for (let j = 0; j < menu[i].menuList.length; j++) {
								if (menu[i].menuList[j].link && menu[i].menuList[j].link.indexOf(data.path) >= 0) {
									state.VUEX_GE_CENTERMENUS = menu[i].menuList;
								} else if (menu[i].menuList[j].children && menu[i].menuList[j].children.length) {
									for (let k = 0; k < menu[i].menuList[j].children.length; k++) {
										if (menu[i].menuList[j].children[k].link.indexOf(data.path) >= 0) {
											state.VUEX_GE_CENTERMENUS = menu[i].menuList;
										}
									}
								}
							}
						}
					}
				}
			}
		},
		SET_VUEX_GE_CENTERMENUSMAP(state, data) {
			state.VUEX_GE_CENTERMENUSMAP = data;
		},
		USER_LOGIN_401(state) {
			storage.session.clear();
			storage.local.clear();
			Object.assign(state, defaultState);
			window.location.href = '/login';
		},
		SET_VUEX_CURRENT_PLATEFORM(state, data) {
			state.VUEX_CURRENT_PLATEFORM = data;
		}
	},
	actions: {
		VUEX_USER_LOGOUT() {
			API_LOGOUT().then(res => {
				if (res.success) {
					storage.session.clear();
					storage.local.clear();
					const redirect_url = getQueryString('redirect_url');
					if (redirect_url) {
						window.location.href = redirect_url;
						return;
					}
					window.location.href = '/login';
				}
			});
		},
		VUEX_USER_TOKEN({ commit, state }) {
			return new Promise(async resolve => {
				// 更新token
				let resToekn = await API_REFRESH_TOKEN();
				if (resToekn.success) {
					const { token } = resToekn.data;
					if (state.VUEX_ST_TOKEN !== token) {
						// 如果token不一致，更新token，重载
						commit('VUEX_MU_USERTOKEN', token);
						location.reload(true);
						resolve(true);
					}
				}
				resolve(false);
			});
		},
		async VUEX_USER_PERSONAL_DETAILS({ commit }) {
			const personalDetail = API_PERSONALDETAIL().then(res => {
				return res;
			});
			const getTerminalDirector = API_ISTERMINALDIRECTOR().then(res => {
				return res;
			});

			return Promise.all([personalDetail, getTerminalDirector]).then(values => {
				const [personaldetail, terminalDirector] = values;

				const personalId = personaldetail.data.personal.id;
				const traceId = `${personalId}_${new Date().getTime()}`;
				const TRACE_ID_NAME = `TRACE_ID_${personalId}`;
				if (!getCookie(TRACE_ID_NAME)) {
					setCookie(TRACE_ID_NAME, traceId, 1);
					window.reportUtil.reportEvent(`${reportCode?.UV}&personalId=${personalId}`, {
						traceId,
						pathname: window.location.pathname
					});
				}
				const companyUser = personaldetail?.data?.companyUser;
				let directorFlag = false;
				if (terminalDirector.success && terminalDirector.data) {
					directorFlag = true;
				}
				if (companyUser) {
					API_USERCOMPANYSERVICE().then(({ success, data }) => {
						if (!success) {
							return [];
						}
						commit('VUEX_COMPANY_SERVICES', data.serviceList || []);
					});
					const { id, companyType, uscc, name } = companyUser.company;
					const companyUserRoles = (companyUser.roles || []).map(item => {
						return item.code.toLowerCase();
					});
					if (directorFlag) {
						companyUserRoles.push('directorFlag');
					}
					//判断是否为陕煤系公司--start
					let belongsShanMei = false
					let host = window.location.host
					switch (host) {
						case 'localhost:7777':
							belongsShanMei = companyUser.company?.group?.code === 'JT0039'
							break;
						case 'test1-trade.shanghaishulian.com':
							belongsShanMei = companyUser.company?.group?.code === 'JT0039'
							break;
						case 'uat-trade.shanghaishulian.com':
							belongsShanMei = companyUser.company?.group?.code === 'JT0048'
							break;
						case 'www.shdatalink.com':
							belongsShanMei = companyUser.company?.group?.code === 'JT0002'
							break;
						case 'sxsm.shdatalink.com':
							belongsShanMei = companyUser.company?.group?.code === 'JT0002'
							break;
						default:
							break;
					}
					companyUser.belongsShanMei = belongsShanMei
					//判断是否为陕煤系公司--end
					const companyUserData = {
						...companyUser,
						companyId: id,
						companyType,
						companyUscc: uscc,
						companyUserRoles,
						companyName: name,
						companyUserId: companyUser.id,
						directorFlag
					};
					commit('VUEX_MU_COMPANYSUER', companyUserData);
				}
				const personal = personaldetail?.data?.personal;
				if (personal) {
					commit('VUEX_MU_PERSONALLINFO', {
						...personal,
						companys: personal.companyUserList,
						curCompanyId: companyUser && companyUser.company ? companyUser.company.id : ''
					});
				}
			});
		},
		VUEX_PERMISSION_LIST({ commit, state }) {
			return API_PERMISSION().then(res => {
				if (res.success) {
					if (!res.data.includes('kitInvoice')) {
						window.changeToastClassIconSingle && window.changeToastClassIconSingle();
						storage.session.set('loginType', 'normal');
					} else {
						window.changeToastClassIconNormal && window.changeToastClassIconNormal();
					}
					// 这个地方因为企业管理和密码管理服务端不是按照权限点划分的，没有authCode，为了统一处理菜单，前端添加了这两个code
					res.data.push('company', 'company:password');
					commit('SET_PERMISSION_LIST', filterAuth(state.VUEX_ST_COMPANYSUER, res.data, authRouter, state.VUEX_ST_PERSONALLINFO));
					commit('SET_VUEX_GE_CENTERMENUSMAP', menu.VUEX_GE_CENTERMENUSMAP(state));
					const pathArr = window.location.pathname.split('/');
					commit('SET_VUEX_GE_CENTERMENUS', { path: `/${pathArr[1]}/${pathArr[2]}/` });
				}
			});
		},
		VUEX_LOGIN_BY_ACCESS_TOKEN() {
			return API_LOGIN_FREE_PASSWORD({
				secret: getQueryString('access_token'),
				formSource: getQueryString('source')
			});
		}
	},
	getters: {
		VUEX_COMPANY_SERVICES(state) {
			return state.VUEX_COMPANY_SERVICES;
		},
		VUEX_ST_COMPANYSUER(state) {
			return state.VUEX_ST_COMPANYSUER;
		},
		VUEX_ST_PERSONALLINFO(state) {
			return state.VUEX_ST_PERSONALLINFO;
		},
		VUEX_ST_EDITCOMPANYPROFILE(state) {
			return state.VUEX_ST_EDITCOMPANYPROFILE;
		},
		VUEX_ST_USERAUTH(state) {
			return state.VUEX_ST_USERAUTH;
		},
		VUEX_GE_CENTERMENUS(state) {
			return state.VUEX_GE_CENTERMENUS;
		},
		VUEX_GE_CENTERMENUSMAP(state) {
			return state.VUEX_GE_CENTERMENUSMAP;
		},
		VUEX_ST_TOKEN(state) {
			return state.VUEX_ST_TOKEN;
		},
		VUEX_ST_BACKURL(state) {
			return state.VUEX_ST_BACKURL;
		},
		VUEX_ST_UNREADLIST(state) {
			return state.VUEX_ST_UNREADLIST;
		},
		VUEX_ST_COMPANYRELEVANCE(state) {
			return state.VUEX_ST_COMPANYRELEVANCE;
		},
		VUEX_GE_CURRENT_PATH(state) {
			return state.VUEX_ST_CURRENT_PATH;
		},
		VUEX_CURRENT_PLATEFORM(state) {
			return state.VUEX_CURRENT_PLATEFORM;
		}
	}
};

export default user;
