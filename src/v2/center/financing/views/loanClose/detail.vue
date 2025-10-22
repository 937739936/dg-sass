<template>
	<div class="slMain">
		<Detail
			:type="type"
			:detailData="detailData"
			@download="download"
			@viewPDF="viewPDF"
		></Detail>
	</div>
</template>

<script>
import Detail from '@sub/financing/loanClose/Detail';
import comDownload from '@sub/utils/comDownload.js';
import { downloadLoanCloseFile, getLoanCloseDetail } from '@/v2/center/financing/api/loanClose.js';
export default {
	data() {
		return {
			type: 'rest',
			detailData: {
				settlementAgreementVO: {
					serialNo: '',
					financingApplyNoList: []
				},
				repayList: []
			}
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const params = {
				settlementAgreementId: this.$route.query.id
			};
			const res = await getLoanCloseDetail(params);

			this.detailData = res.data;
			// 处理融资编号
		},
		download(record) {
			const params = {
				settlementAgreementIdList: [record.id],
				toSealCompanyType: this.isBank ? 1 : 2
			};
			downloadLoanCloseFile(params).then(res => {
				comDownload(res.data, '', res.name);
			});
		},
		viewPDF(record) {
			window.open(record.fileUrl, '_blank');
		}
	},
	components: {
		Detail
	}
};
</script>

<style scoped lang="less"></style>
