<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 20px"
		>
			<FinancingAdvanceDetailTop
				handleType="detail"
				:detailData="detailData"
				:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
			></FinancingAdvanceDetailTop>
		</a-card>
		<div class="line"></div>
		<a-card
			:bordered="false"
			style="padding-top: 10px"
		>
			<a-tabs @change="tabChange">
				<a-tab-pane
					key="info"
					tab="融资信息"
				>
					<FinancingAdvanceBaseInfo
						:detailData="detailData"
						@downAll="downAll"
						@downPDF="downPDF"
						@viewPDF="viewPDF"
					>
					</FinancingAdvanceBaseInfo>
				</a-tab-pane>

				<a-tab-pane
					key="send"
					tab="放还款信息"
				>
					<FinancingAdvanceSendAndPay
						:sendAndPayInfo="sendAndPayInfo"
						:API_FinancingJRSync="API_FinancingJRSync"
						@syncLoan="getSendAndPay"
					></FinancingAdvanceSendAndPay>
				</a-tab-pane>

				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<Log :list="detailData.operateLog"></Log>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import FinancingAdvanceDetailTop from '@sub/financing/financingAdvanceDetailTop';
import FinancingAdvanceBaseInfo from '@sub/financing/financingAdvanceBaseInfo';
import FinancingAdvanceSendAndPay from '@sub/financing/financingAdvanceSendAndPay';
import Log from '@sub/financing/Log';
import {
	API_FinancingDetailFK,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile,
	API_GetFinancingStatusTip,
	API_FinancingAdvanceDouDetail,
	API_FinancingJRSync
} from '@/v2/center/financing/api/index.js';
import comDownload from '@sub/utils/comDownload.js';
export default {
	data() {
		return {
			detailData: { contractList: [] },
			operatorInfo: {},
			sendAndPayInfo: {}
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		API_GetFinancingStatusTip,
		API_FinancingJRSync,
		async getDetail() {
			const res = await API_FinancingAdvanceDouDetail({ financingApplyId: this.$route.query.id });
			this.detailData = res.data || {};
			this.getSendAndPay();
		},
		// 获取放还款信息
		async getSendAndPay() {
			const res = await API_FinancingDetailFK({ financingApplyId: this.$route.query.id });
			//  API_FinancingDetailFK
			this.sendAndPayInfo = res.data;
		},

		tabChange() {},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.$route.query.id
			}).then(res => {
				const name = `${this.detailData.loanerName}-${this.detailData.bankName}-${this.detailData.serialNo}.zip`;
				comDownload(res, undefined, name);
			});
		},
		downPDF(record) {
			API_FinancingDetaildownloadFile({
				contractFileId: record.id
			}).then(res => {
				const fileFormat = record.url.split('?')[0].split('.').pop().toLowerCase();
				const name = `${record.name}-${this.detailData.serialNo}.${fileFormat}`;
				comDownload(res, '', name);
			});
		},
		viewPDF(record) {
			window.open(record.url, '_blank');
		}
	},
	components: {
		Breadcrumb,
		FinancingAdvanceDetailTop,
		FinancingAdvanceBaseInfo,
		FinancingAdvanceSendAndPay,
		Log
	}
};
</script>

<style scoped lang="less">
.line {
	background: #f3f5f6;
	height: 20px;
}
</style>
