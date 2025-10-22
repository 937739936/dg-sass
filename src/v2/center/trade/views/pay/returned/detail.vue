<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<ReturnedDetail
			:logList="logList"
			:detailInfo="detailInfo"
			@handlePreview="handlePreview"
			@goBusinessLine="goBusinessLine"
			@goSellContract="goSellContract"
			@download="downloadReturnedFile"
		></ReturnedDetail>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import Breadcrumb from '@/v2/components/breadcrumb/index';

import ReturnedDetail from '@sub/trade/pay/ReturnedDetail.vue';
import comDownload from '@sub/utils/comDownload.js';
import { getReturnedDetail, getReturnedLogList, downloadReturnedFile } from '@/v2/center/trade/api/pay';
import moment from 'moment';

export default {
	data() {
		return {
			detailInfo: {
				attachmentList: [],
				collectionFlowVo: {},
				collectionFlowClaimedVoList: []
			},
			logList: [],
			previewImg: ''
		};
	},
	mounted() {
		this.getReturnedDetail();
		this.getReturnedLogList();
	},
	methods: {
		// 获取详情
		async getReturnedDetail() {
			const params = {
				collectionNo: this.$route.query.receiveSerialNo
			};
			const res = await getReturnedDetail(params);
			this.detailInfo = res.data || {};
		},
		// 获取操作记录
		async getReturnedLogList() {
			const params = {
				receiveSerialNo: this.$route.query.receiveSerialNo
			};
			const res = await getReturnedLogList(params);
			this.logList = res.data || [];
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		// 业务线
		goBusinessLine(items) {
			let routerData = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.upOrderNo,
					downOrderNo: items.downOrderNo,
					businessLineType: items.businessLineType,
					businessLineNo: items.businessLineNo,
					contractType: 0,
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					downstreamActiveIndex: 0
				}
			});
			window.open(routerData.href, '_blank');
		},
		// 销售合同
		goSellContract(item) {
			const contractType = (item.contractType || 'OFFLINE').toLowerCase();
			window.open(`/center/contract/sell/${contractType}/detail?id=${item.terminalContractId}&type=sell`);
		},
		async downloadReturnedFile() {
			const params = {
				receiveSerialNo: this.$route.query.receiveSerialNo
			};

			const res = await downloadReturnedFile(params);
			// 回款凭证-回款编号-收款方-回款方-回款日期-回款金额
			const info = this.detailInfo.collectionFlowVo;
			const name = `回款凭证-${info.receiveSerialNo}-${info.receiveCompanyName}-${info.paymentCompanyName}-${moment().format('yyyy-MM-DD')}-${info.receiveAmount}`;
			if (this.detailInfo.attachmentList.length > 1) {
				comDownload(res, undefined, `${name}.zip`);
			} else {
				const item = this.detailInfo.attachmentList[0];
				const fileFormat = item.name.split('.').pop().toLowerCase();
				comDownload(res, undefined, `${name}.${fileFormat}`);
			}
		}
	},
	components: {
		Breadcrumb,
		ReturnedDetail
	}
};
</script>

<style scoped lang="less"></style>
