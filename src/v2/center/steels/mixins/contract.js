import { getTraderList } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			traderList: [],
			assetTeamTraderName: '',
			assetTeamTraderPhone: ''
		};
	},
	methods: {
		handleSearchTrader(keyId = '') {
			if (this.form && keyId) {
				this.form.assetTeamTraderId = keyId;
			}
			getTraderList({
				keyWord: ''
			}).then(res => {
				if (res.success) {
					res.data.forEach(el => {
						el.keyId = `${el.assetTeamId}-${el.userId}`;
					});
					this.traderList = res.data;

					// if(this.form.setFieldsValue) {
					//   this.form.setFieldsValue({
					//     assetTeamTraderName: this.handleChangeTraderName(assetTeamTraderId)
					//   });
					// } else {
					//   this.form.assetTeamTraderId = assetTeamTraderId
					// }
				}
			});
		},
		handleChangeTraderName(value) {
			this.assetTeamTraderName = this.traderList.filter(item => item.keyId == value)[0]?.realname;
			this.assetTeamTraderPhone = this.traderList.filter(item => item.keyId == value)[0]?.phone;
			return `${this.assetTeamTraderName || ''},${this.assetTeamTraderPhone || ''}`;
		},
		handleChangeTrader(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		}
	}
};
