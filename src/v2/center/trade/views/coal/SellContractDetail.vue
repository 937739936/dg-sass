<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>销售合同</span>
		</div>
		<a-card :bordered="false">
			<template #title><b>基本信息</b></template>
			<template #extra>状态:{{ data.statusDesc }}</template>
			<a-descriptions :column="2">
				<a-descriptions-item label="买方企业名称">{{ data.buyerName }}</a-descriptions-item>
				<a-descriptions-item label="买方统一社会信用代码">{{ data.buyerBizNo }}</a-descriptions-item>
				<a-descriptions-item label="卖方企业名称">{{ data.sellerName }}</a-descriptions-item>
				<a-descriptions-item label="合同编号">{{ data.paperContractNo }}</a-descriptions-item>
				<a-descriptions-item label="煤种">{{ data.coalTypeDesc }}</a-descriptions-item>
				<a-descriptions-item label="品名">{{ data.goodsName }}</a-descriptions-item>
				<a-descriptions-item label="合同单价(元/吨)">{{
					data.followTheMarket ? '随行就市' : data.contractPrice
				}}</a-descriptions-item>
				<a-descriptions-item label="合同数量(吨)">{{ data.contractQuantity }}</a-descriptions-item>
				<a-descriptions-item label="合同总价(元)">{{ data.contractAmount }}</a-descriptions-item>
				<a-descriptions-item label="签订日期">{{ data.contractSignTime }}</a-descriptions-item>
				<a-descriptions-item label="合同有效期">{{ data.execDateStart }} 至 {{ data.execDateEnd }}</a-descriptions-item>
				<a-descriptions-item label="合同类型">{{ data.contractTermTypeDesc }}</a-descriptions-item>
				<a-descriptions-item label="合同签章状态">{{ data.signStatusDesc }}</a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ data.terminalDelivery.transportModeDesc }}</a-descriptions-item>
				<template v-if="data.terminalDelivery.transportMode == 'AUTOMOBILE_AND_TRAIN'">
					<a-descriptions-item label="发站">{{ data.terminalDelivery.trainSendStationName }}</a-descriptions-item>
					<a-descriptions-item label="到站">{{ data.terminalDelivery.trainArriveStationName }}</a-descriptions-item>
					<a-descriptions-item label="托运人">{{ data.terminalDelivery.consignorCompanyName }}</a-descriptions-item>
					<a-descriptions-item label="发货地址">{{ data.terminalDelivery.sendGoodsAddress }}</a-descriptions-item>
					<a-descriptions-item label="收货地址">{{ data.terminalDelivery.receiveGoodsAddress }}</a-descriptions-item>
				</template>
				<template v-if="data.terminalDelivery.transportMode == 'AUTOMOBILE'">
					<a-descriptions-item label="发货地址">{{ data.terminalDelivery.sendGoodsAddress }}</a-descriptions-item>
					<a-descriptions-item label="收货地址">{{ data.terminalDelivery.receiveGoodsAddress }}</a-descriptions-item>
				</template>
				<template v-if="data.terminalDelivery.transportMode == 'TRAIN'">
					<a-descriptions-item label="发站">{{ data.terminalDelivery.trainSendStationName }}</a-descriptions-item>
					<a-descriptions-item label="到站">{{ data.terminalDelivery.trainArriveStationName }}</a-descriptions-item>
					<a-descriptions-item label="托运人">{{ data.terminalDelivery.consignorCompanyName }}</a-descriptions-item>
				</template>
				<template v-if="data.terminalDelivery.transportMode == 'SHIP'">
					<a-descriptions-item label="装货港">{{ data.terminalDelivery.shipLoadingPortName }}</a-descriptions-item>
					<a-descriptions-item label="卸货港">{{ data.terminalDelivery.shipDischargingPortName }}</a-descriptions-item>
				</template>
				<a-descriptions-item label="收货人名称">{{ data.terminalDelivery.consigneeCompanyName }}</a-descriptions-item>
				<a-descriptions-item label="业务类型">{{ data.businessTypeDesc }}</a-descriptions-item>
			</a-descriptions>
		</a-card>
		<a-card
			style="margin-top: 10px"
			:bordered="false"
		>
			<template #title><b>上传合同附件</b></template>
			<OfflineCotractFilesTable
				:contractAttachment="data.contractAttachment || []"
				:supplementalInfo="data.supplementalInfo || []"
			/>
		</a-card>
		<a-card
			style="margin-top: 10px"
			:bordered="false"
		>
			<div style="margin-top: 10px; text-align: center">
				<a-button @click="goback">返回</a-button>
				<template v-if="data.status == 'WAIT_CONFIRM'">
					<a-button
						style="margin-left: 20px"
						@click="rejectModal"
						type="danger"
						ghost
						>驳回</a-button
					>
					<a-button
						type="primary"
						style="margin-left: 20px"
						@click="doConfirm"
						v-auth="'coalMineDgChain:contract:sellContract:confirm'"
						>确认</a-button
					>
				</template>
			</div>
		</a-card>

		<a-modal
			title="提示"
			:visible="rejectVisible"
			:destroyOnClose="true"
			@cancel="rejectModal"
			@ok="doReject"
		>
			<a-form>
				<a-form-item
					label="请输入驳回原因(如日期错误、数量错误、单据错误等)"
					required
				>
					<a-textarea
						:auto-size="{ minRows: 4, maxRows: 6 }"
						v-model="reason"
						:maxLength="200"
					></a-textarea>
				</a-form-item>
			</a-form>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import {
	getSellContractDetail,
	doRejectSellContract,
	doConfirmSellContract,
	API_GETCURRENTENV,
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR
} from '@/v2/center/trade/api/coal';
import comDownload from '@sub/utils/comDownload.js';
import OfflineCotractFilesTable from '@/v2/center/monitoring/components/OfflineCotractFilesTable';
const columns = [
	{
		title: '文件类型',
		key: 'typeName',
		dataIndex: 'typeName'
	},
	{
		title: '文件格式',
		key: 'ext',
		dataIndex: 'ext'
	},
	{
		title: '文件名',
		key: 'fileName',
		dataIndex: 'fileName'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	data() {
		return {
			rejectVisible: false,
			id: this.$route.query.id,
			data: {
				terminalDelivery: {}
			},
			columns,
			API_GETCURRENTENV,
			reason: '',
			previewImg: ''
		};
	},
	components: {
		OfflineCotractFilesTable
	},
	mounted() {
		this.doFetch();
	},
	methods: {
		doFetch() {
			getSellContractDetail(this.id).then(res => {
				let data = res.data;
				this.data = data;
				this.data.terminalDelivery = data.terminalDelivery || {};
			});
		},
		doReject() {
			let reason = this.reason;
			if (!reason || !reason.replace(/\s/g, '')) {
				this.$message.error('请输入驳回原因');
				return;
			}
			doRejectSellContract({ id: this.data.id, reason }).then(res => {
				if (!res.success) {
					return;
				}
				this.$message.success('操作成功');
				this.rejectModal();
				this.$router.back();
			});
		},
		doConfirm() {
			this.$confirm({
				title: '提交确认',
				content: '请确认合同信息无误',
				onOk: () => {
					doConfirmSellContract(this.data.id).then(res => {
						if (!res.success) {
							return Promise.reject();
						}
						this.$message.success('操作成功');
						this.$router.back();
						return Promise.resolve();
					});
				}
			});
		},
		download(record) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(record.fileUrl)).then(res => {
				comDownload(res, null, record.fileName);
			});
		},
		rejectModal() {
			this.rejectVisible = !this.rejectVisible;
			this.reason = '';
		},
		goback() {
			this.$router.back();
		},
		//查看附件
		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.fileUrl;
			}
			if (data.url) {
				url = data.url;
			} else if (data.fileUrl) {
				url = data.fileUrl;
			}
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	}
};
</script>
<style lang="less" scoped>
.main-content-inner {
	background-color: transparent;
}
</style>
