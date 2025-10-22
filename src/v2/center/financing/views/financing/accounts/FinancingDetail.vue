<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 20px"
		>
			<FinancingDetailTop
				:detailData="detailData"
				:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
			></FinancingDetailTop>
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
					<FinancingBaseInfo
						:detailData="detailData"
						:operatorInfo="operatorInfo"
						@downAll="downAll"
						@downPDF="downPDF"
						@viewPDF="viewPDF"
					>
					</FinancingBaseInfo>
				</a-tab-pane>

				<a-tab-pane
					key="send"
					tab="放还款信息"
				>
					<FinancingSendAndPay
						:sendAndPayInfo="sendAndPayInfo"
						:API_FinancingJRSync="API_FinancingJRSync"
						@syncLoan="getSendAndPay"
					></FinancingSendAndPay>
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
import FinancingDetailTop from '@sub/financing/financingDetailTop';
import FinancingBaseInfo from '@sub/financing/financingBaseInfo';
import FinancingSendAndPay from '@sub/financing/financingSendAndPay';
import Log from '@sub/financing/Log';
import {
	API_FinancingDetail,
	API_FinancingDetailFK,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile,
	API_GetFinancingStatusTip,
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
			const res = await API_FinancingDetail({ financingApplyId: this.$route.query.id });
			this.detailData = res.data || {};
			// this.rongziDataSource = [res.data];
			// this.xieyiDataSource = res.data.contractList || [];
			/** 获取审批流程 */
			this.operatorInfo = {};
			if (this.detailData.auditChainAndOperator) {
				this.operatorInfo = this.detailData.auditChainAndOperator.operatorInfo[0];
			}
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
			// 融资方名称+出资机构+融资编号
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.$route.query.id
			}).then(res => {
				const name = `${this.detailData.loanerName}-${this.detailData.bankName}-${this.detailData.serialNo}.zip`;
				comDownload(res, undefined, name);
			});
		},
		downPDF(record) {
			console.log(record);
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
		FinancingDetailTop,
		FinancingBaseInfo,
		FinancingSendAndPay,
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
