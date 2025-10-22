<template>
	<modalMain
		ref="modalMain"
		:width="1340"
		title="结算单作废"
		:loading="loading"
		@verify="modalMainOK"
	>
		<span class="tip">
			{{ tip }}
		</span>
		<SettleOA
			ref="oa"
			:span="8"
			v-if="OAAuditOption.existOA"
			:auditChain="OAAuditOption.auditChainAndOperator"
		/>
		<pdf-preview
			v-if="result"
			:url="result"
		></pdf-preview>
	</modalMain>
</template>
<script>
import modalMain from '@/v2/components/modalInfo/main';
import PdfPreview from '@sub/components/pdf/index.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETINVALIDTemplate, API_GETINVALIDSave } from '@/v2/center/trade/api/settle';
import SettleOA from './SettleOA';
export default {
	components: { modalMain, PdfPreview, SettleOA },
	data() {
		let { meta } = this.$route;
		return {
			id: '',
			meta, //获取title
			form: this.$form.createForm(this),
			coalCcsMsList: [],
			systemVOList: [],
			result: '',
			OAAuditOption: {},
			loading: false,
			tip: ''
		};
	},
	computed: {
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		}
	},
	mounted() {},
	methods: {
		getPopupContainer,
		//打开弹框
		show(id) {
			this.id = id;
			this.result = '';
			this.$refs.modalMain.open();
			// 获取结算单作废确认书
			API_GETINVALIDTemplate({ statementId: id }).then(res => {
				if (res.success) {
					let data = res.data;
					let OAAuditOption = {};
					if (this.type == 'buy') {
						OAAuditOption = data.buyerOAAuditOption;
					} else if (this.type == 'sell') {
						OAAuditOption = data.sellerOAAuditOption;
					}
					this.OAAuditOption = OAAuditOption;
					if (OAAuditOption.existOA) {
						this.tip =
							'注：提交后，结算单将进入“冻结中”状态，作废确认书将推送OA进行审核，审核通过后可以进行盖章，然后由对方进行确认盖章，双方盖章后，完成结算单作废，确认提交吗？';
					} else {
						this.tip =
							'注：提交后，结算单将进入“冻结中”状态，并请对作废确认书进行盖章，然后由对方进行确认盖章，双方盖章后，完成结算单作废，确认提交吗？';
					}
					this.result = data.attachment[0]?.filePath;
				}
			});
		},
		//提交
		async modalMainOK() {
			let params = { statementId: this.id };
			if (this.OAAuditOption.existOA) {
				let handleSubmit = await this.$refs.oa.handleSubmit();
				if (handleSubmit) {
					params = {
						...params,
						...handleSubmit
					};
				}
			}
			this.loading = true;
			API_GETINVALIDSave(params)
				.then(res => {
					if (res.success) {
						// 提交成功，刷新列表
						this.$message.success('已发起结算单作废流程');
						this.$emit('change');
					}
				})
				.finally(() => {
					this.loading = false;
					this.$refs.modalMain.close();
				});
		},
		selectChange(id) {
			this.systemVOList = this.coalCcsMsList.find(item => {
				return item.chainCode === id;
			})?.systemVOList;
		}
	}
};
</script>
<style lang="less" scoped>
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	line-height: 22px;
}
</style>
