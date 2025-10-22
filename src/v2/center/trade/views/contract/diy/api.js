import request from '@/api/request';
import store from 'store';

const apiMap = {
	buyerContactsId: {
		api: '/dg-user-api/api/company/linkman/findByCompanyId',
		params: {
			companyId: ''
		},
		feilds: { label: 'contactName', value: 'id' }
	},
	sellerContactsId: {
		api: '/dg-user-api/api/company/linkman/findByCompanyId',
		params: {
			companyId: ''
		},
		feilds: { label: 'contactName', value: 'id' }
	},
	buyerBankAccountId: {
		api: '/dg-user-api/api/company/account/list',
		params: {
			uscc: ''
		},
		feilds: { label: 'bankName', value: 'id' }
	},
	sellerBankAccountId: {
		api: '/dg-user-api/api/company/account/list',
		params: {
			uscc: ''
		},
		feilds: { label: 'bankName', value: 'id' }
	},
	departureStation: {
		api: '/dg-trade-api/api/area/bizStationList',
		params: {
			keywords: ''
		},
		feilds: { label: 'name', value: 'name' }
	},
	trainSendStationName: {
		api: '/dg-trade-api/api/area/bizStationList',
		params: {
			keywords: ''
		},
		feilds: { label: 'name', value: 'name' }
	},
	trainArriveStationName: {
		api: '/dg-trade-api/api/area/bizStationList',
		params: {
			keywords: ''
		},
		feilds: { label: 'name', value: 'name' }
	}
};

const getConfigData = async item => {
	const { acceptUser, contract } = store.getters['contract/VUEX_GET_CONTRACT_DATA'];
	const sellerUscc = contract?.sellerUscc || contract?.sellerCompanyUscc;
	const buyerUscc = contract?.buyerUscc || contract?.buyCompanyUscc;
	const sellerCompanyId = acceptUser?.sellerCompanyId || contract?.sellerCompanyId;
	const buyerCompanyId = acceptUser?.buyerCompanyId || contract?.buyerCompanyId;

	const type = item.label;
	if (!apiMap[type]?.api) {
		return;
	}
	if (type === 'buyerContactsId') {
		apiMap[type].params.companyId = buyerCompanyId;
	}
	if (type === 'sellerContactsId') {
		apiMap[type].params.companyId = sellerCompanyId;
	}
	if (type === 'buyerBankAccountId') {
		apiMap[type].params.uscc = buyerUscc;
	}
	if (type === 'sellerBankAccountId') {
		apiMap[type].params.uscc = sellerUscc;
	}
	if (Object.keys(apiMap[type].params)[0] === 'keywords') {
		apiMap[type].params = {
			keywords: item.words
		};
	}
	return new Promise(async resolve => {
		const result = await request(`${apiMap[type].api}`, apiMap[type].params, 'GET');
		if (result.result) {
			result.data = result.result;
		}
		const { data } = result;
		if (apiMap[type].feilds && data?.length) {
			data.forEach(item => {
				item.label = item[apiMap[type].feilds.label];
				item.value = item[apiMap[type].feilds.value];
			});
		}
		store.commit('contract/VUEX_SET_FORM_SCHEMA', { item, data: data || [] });
		store.commit('contract/VUE_SET_OPTIONS_LIST_OTHER', data);
		store.commit('contract/VUEX_SET_BANK_CONTACTS', data);
		resolve(true);
	});
};

export default getConfigData;
