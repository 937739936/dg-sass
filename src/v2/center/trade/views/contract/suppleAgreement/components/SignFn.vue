<template>
	<div>
		<SignModal ref="signModal" />
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
import { sign } from '@/v2/utils/sign.js';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import { receiverConfirm, signToConfirm, getPdfHashList, autoSignature } from '@/v2/center/trade/api/suppleAgreement';

export default {
	data() {
		return {
			id: '',
			isInitiator: false
		};
	},
	created() {
		this.id = this.$route.query.id;

		this.isInitiator = this.$route.query.isInitiator == 'true' ? true : false;
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		sign() {
			let obj = {
				industryType: 'COAL', // 行业 COAL代表煤块
				moduleSealType: 2, //模块编码 2代表补充协议
				moduleSealTypeDetail: this.isInitiator ? 1 : 2, //1盖章 2确定盖章
				isInitiator: this.isInitiator
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const self = this;
				const isOrderModule = true;
				sign.call(self, self.ukeySign, self.changeDataStatus, self.goBack, isOrderModule);
			}
		},
		// ukey盖章
		ukeySign(obj) {
			return getPdfHashList({
				isInitiator: this.isInitiator,
				supplementalAgreementId: this.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		goBack() {
			this.$router.push({
				path: '/center/contract/agreement/list'
			});
		},

		// 修改数据状态
		async changeDataStatus() {
			const res = await signToConfirm({ id: this.id, isInitiator: this.isInitiator });
			return res;
		},

		// 自动托管盖章
		async autoSignature() {
			this.signLoading = true;
			try {
				const res = await autoSignature({
					supplementalAgreementId: this.id,
					isInitiator: this.isInitiator,
					cfcaSealList: this.cfcaSealList
				});
				this.signLoading = false;
				this.$message.success({
					content: '盖章完成',
					duration: 5
				});
				await this.changeDataStatus();
				// this.$emit('successSign')
				this.goBack();
			} catch (error) {
				this.signLoading = false;
				this.$message.error('签署失败，请联系管理员');
			}
		}
	},
	components: {
		ChooseStamp,
		SignModal
	}
};
</script>

<style scoped></style>
