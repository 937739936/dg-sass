import {
	API_GETORDERZHIBIAOCODE,
	API_GETALLCODE,
	API_SteelsAllCode,
	API_DICT,
	API_GETORDERCODE,
	API_STATION_ALLCODE
} from '@/v2/api/config';
import merge from 'lodash/merge';

// 转换新旧字段使用
const changeKeyList = {
	coalTypeDict: 'goods_type',
	deliveryGoodsModeDist: 'order_delivery_type',
	serviceFeePayModeDict: 'service_pay_type',
	orderTabTypeDict: 'orderTabTypeDict',
	orderStatusDict: 'order_status',
	despatchTypeDict: 'despatchTypeDict',
	financingStatusDict: 'financingStatusDict',
	repayApplyStatusDict: 'repayApplyStatusDict',
	receivableStatusDict: 'receivableStatusDict',
	loanStatusDict: 'loanStatusDict',
	loanTypeData: 'loanTypeData'
};

const config = {
	namespaced: true,
	state: () => ({
		VUEX_ST_ORDERZHIBIAOCODE: {},
		VUEX_ST_RECEIVEZHIBIAOCODE: {},
		VUEX_ST_ALLCODE: {},
		VUEX_ST_STEELSALLCODE: {},
		VUEX_ST_LOADING: false,
		VUEX_ST_STATIONALLCODE: {},
		VUEX_ST_ATTACH_TYPE_ENUM: {}
	}),
	mutations: {
		VUEX_MU_LOADING(state, payload) {
			state.VUEX_ST_LOADING = payload;
		},
		VUEX_ST_ORDERZHIBIAOCODE(state, payload) {
			state.VUEX_ST_ORDERZHIBIAOCODE = payload;
		},
		VUEX_ST_RECEIVEZHIBIAOCODE(state, payload) {
			state.VUEX_ST_RECEIVEZHIBIAOCODE = payload;
		},
		VUEX_ST_ALLCODE(state, payload) {
			state.VUEX_ST_ALLCODE = payload;
		},
		VUEX_ST_STEELSALLCODE(state, payload) {
			state.VUEX_ST_STEELSALLCODE = payload;
		},
		VUEX_ST_STATIONALLCODE(state, payload) {
			state.VUEX_ST_STATIONALLCODE = payload;
		},
		VUEX_MU_ATTACH_TYPE_ENUM(state, payload) {
			state.VUEX_ST_ATTACH_TYPE_ENUM = payload;
		}
	},
	actions: {
		VUEX_AT_GETALLCODE({ commit, state }) {
			let p1 = API_GETORDERZHIBIAOCODE({ businessType: 'order' }).then(res => {
				if (res.success) {
					commit('VUEX_ST_ORDERZHIBIAOCODE', res.data);
				}
			});
			let p2 = API_GETORDERZHIBIAOCODE({ businessType: 'deliver' }).then(res => {
				if (res.success) {
					commit('VUEX_ST_RECEIVEZHIBIAOCODE', res.data);
				}
			});
			let p3 = API_GETALLCODE().then(res => {
				if (res.success) {
					for (const key in changeKeyList) {
						if (res.result[changeKeyList[key]]) {
							delete res.result[changeKeyList[key]];
						}
					}
					commit('VUEX_ST_ALLCODE', merge(state.VUEX_ST_ALLCODE, res.result));
				}
			});
			let p4 = API_GETORDERCODE().then(_res => {
				if (_res.success) {
					let d = _res.data;
					commit('VUEX_MU_ATTACH_TYPE_ENUM', d.attachTypeDict);
					let obj = {};
					// 将两个字典拼成一个对象供前端调用（后端规定要2个字典）
					for (let key in d) {
						if (typeof d[key] == 'object') {
							let _d = d[key];
							let arr = [];
							for (var _key in _d) {
								if (typeof _d[_key] == 'string') {
									arr.push({
										label: _d[_key],
										text: _d[_key],
										value: _key
									});
								} else if (typeof _d[_key] == 'object' && !Array.isArray(_d[_key])) {
									arr.push({
										label: _d[_key].desc,
										text: _d[_key].desc,
										value: _d[_key].backStatusSet || _key,
										message: _d[_key].message,
										key: _key
									});
								}
							}
							obj[changeKeyList[key] || key] = arr;
						}
					}
					// 运输方式单独抽离
					let transportModeDict = d.transportModeDict;
					var transportObj = {};
					for (var item in transportModeDict) {
						var array = [];
						transportModeDict[item].forEach(_item => {
							for (var j in _item) {
								array.push({
									label: _item[j],
									text: _item[j],
									value: j
								});
							}
						});
						transportObj['transportModeDict' + item] = array;
					}
					commit('VUEX_ST_ALLCODE', merge(state.VUEX_ST_ALLCODE, obj, transportObj));
				}
			});
			let p5 = API_SteelsAllCode().then(res => {
				if (res.success) {
					commit('VUEX_ST_ALLCODE', { ...state.VUEX_ST_ALLCODE, ...res.data });
					commit('VUEX_ST_STEELSALLCODE', res.data);
				}
			});
			let p6 = API_DICT().then(res => {
				if (res.success) {
					const data = res.data;
					const dict = {};
					for (const key in data) {
						if (typeof data[key] == 'object') {
							const _data = data[key];
							const arr = [];
							for (var _key in _data) {
								if (typeof _data[_key] == 'string') {
									arr.push({
										label: _data[_key],
										text: _data[_key],
										value: _key
									});
								}
							}
							dict[key] = arr;
						}
					}
					commit('VUEX_ST_ALLCODE', { ...state.VUEX_ST_ALLCODE, ...dict });
				}
			});
			let station_dict = API_STATION_ALLCODE().then(res => {
				if (res.success) {
					commit('VUEX_ST_STATIONALLCODE', res.data);
				}
			});
			return Promise.all([p1, p2, p3, p4, p5, p6, station_dict]);
		}
	},
	getters: {
		VUEX_ST_LOADING(state) {
			return state.VUEX_ST_LOADING;
		},
		VUEX_ST_ALLCODE(state) {
			return state.VUEX_ST_ALLCODE;
		},
		VUEX_ST_STEELSALLCODE(state) {
			return state.VUEX_ST_STEELSALLCODE;
		},
		VUEX_ST_ORDERZHIBIAOCODE(state) {
			return state.VUEX_ST_ORDERZHIBIAOCODE;
		},
		VUEX_ST_RECEIVEZHIBIAOCODE(state) {
			return state.VUEX_ST_RECEIVEZHIBIAOCODE;
		},
		VUEX_ST_STATIONALLCODE(state) {
			return state.VUEX_ST_STATIONALLCODE;
		},
		VUEX_ST_ATTACH_TYPE_ENUM(state) {
			return state.VUEX_ST_ATTACH_TYPE_ENUM;
		}
	}
};

export default config;
