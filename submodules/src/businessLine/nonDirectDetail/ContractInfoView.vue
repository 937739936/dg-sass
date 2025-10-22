<template>
	<div class="contract-info">
		<div class="slTitleAssis">基础信息</div>
		<BaseInfoDescriptions
			:dataSource="contractBaseInfoItems"
			bordered
			class="contract-info-descriptions"
		>
			<template slot="contractNo">
				<div
					class="contract-no"
					:style="{ color: platformType === 'ADMIN' ? '#1890ff' : '#000000cc' }"
				>
					<TextOverflowTooltip :tipText="contractNo">
						<a
							href="javascript:;"
							class="no-text"
							@click="goContractDetail"
							v-if="platformType === 'ADMIN'"
							>{{ contractNo }}</a
						>
						<span
							href="javascript:;"
							class="no-text"
							v-else
							>{{ contractInfoNotEmpty.contractNo }}</span
						>
					</TextOverflowTooltip>
					<span
						class="long"
						v-if="contractInfoNotEmpty.contractTermType == 'LONG_TERM_CONTRACT'"
						>长协</span
					>
					<span
						class="long"
						v-if="contractInfoNotEmpty.signStatus == 2"
						>双签</span
					>
					<span
						class="long"
						v-if="contractInfoNotEmpty.signStatus == 1"
						>单签</span
					>
				</div>
			</template>
		</BaseInfoDescriptions>
		<div
			class="slTitleAssis"
			style="margin-top: 30px"
		>
			合同附件
			<a-button
				type="primary"
				ghost
				class="slBtn"
				v-if="isShowAllDownloadBtn"
				style="margin-left: 25px"
				@click="downloadAllContractFile"
				>一键下载</a-button
			>
		</div>
		<OnLineAttachmentTable
			v-if="orderType === 'ONLINE'"
			:dataSource="contractDetailFileRespList"
			@downloadAttachmentFile="downloadAttachmentFile"
			@viewContractDetail="viewContractDetail"
		/>
		<OffLineAttachmentTable
			v-if="orderType === 'OFFLINE'"
			:dataSource="contractAttachment"
			@downloadAttachmentFile="downloadAttachmentFile"
			@handlePreview="handlePreview"
		/>
	</div>
</template>

<script>
import { formatAccountNumber } from '@sub/utils/factory.js';
import { formatMoney } from '@sub/filters';
import BaseInfoDescriptions from './BaseInfoDescriptions.vue';
import OnLineAttachmentTable from './OnLineAttachmentTable.vue';
import OffLineAttachmentTable from './OffLineAttachmentTable.vue';
import TextOverflowTooltip from './TextOverflowTooltip';
export default {
	name: 'ContractInfoView',
	components: {
		BaseInfoDescriptions,
		OnLineAttachmentTable,
		OffLineAttachmentTable,
		TextOverflowTooltip
	},
	inject: ['platformType'],
	props: {
		contract: {
			type: Object,
			required: true
		},
		orderType: {
			type: String,
			required: true
		}
	},
	data() {
		return {};
	},
	computed: {
		contractInfoNotEmpty() {
			return this.contract || {};
		},
		contractNo() {
			return this.contractInfoNotEmpty.paperContractNo || this.contractInfoNotEmpty.contractNo;
		},
		contractBaseInfoItems() {
			const contractInfo = this.contract || {};
			let items = [
				{
					label: '合同编号',
					value: '-',
					scopedSlots: {
						customRender: 'contractNo'
					}
				},
				{
					label: '买方企业',
					value: contractInfo.buyerCompanyName || '-'
				},
				{
					label: '卖方企业',
					value: contractInfo.sellerCompanyName || '-'
				},
				{
					label: '签订日期',
					value: contractInfo.contractSignDate || '-'
				},
				{
					label: '业务类型',
					value: contractInfo.businessTypeDesc || '-'
				}
			];
			if (contractInfo.contractDoubleSignDate) {
				items.push({
					label: '双签合同签订日期',
					value: contractInfo.contractDoubleSignDate || '-'
				});
			}
			let contractQuantity = '-';
			if (contractInfo.contractQuantity) {
				contractQuantity = formatMoney(contractInfo.contractQuantity) + '吨';
				if (contractInfo.quantityOffset) {
					contractQuantity += `(±${contractInfo.quantityOffset}%)`;
				}
			}
			let deliveryDate = '-';
			if (contractInfo.deliveryDateBegin) {
				deliveryDate = contractInfo.deliveryDateBegin + '至' + contractInfo.deliveryDateEnd;
			}
			let contractPriceText = '-';
			if (contractInfo.paperContractNo) {
				// 线下
				contractPriceText = contractInfo.followTheMarket
					? '随行就市'
					: contractInfo.contractPrice
					? formatMoney(contractInfo.contractPrice) + '元/吨'
					: '-';
			} else {
				// 电子
				contractPriceText = contractInfo.contractPrice
					? formatMoney(contractInfo.contractPrice) + '元/吨'
					: contractInfo.contractPriceDesc || '-';
			}
			items = items.concat([
				{
					label: '品名',
					value: contractInfo.goodsName || '-'
				},
				{
					label: contractInfo.paperContractNo ? '合同价格' : '基准价格',
					value: contractPriceText
				},
				{
					label: contractInfo.paperContractNo ? '合同数量' : '数量',
					value: contractQuantity
				},
				{
					label: '交货期限',
					value: deliveryDate
				},
				{
					label: '运输方式',
					value: contractInfo.transTypeName || '-'
				}
			]);
			if (!contractInfo.paperContractNo) {
				items.push({
					label: '交货方式',
					value: contractInfo.deliveryModeDesc || '-'
				});
			}
			if (contractInfo.trainSendStationName) {
				items.push({
					label: '发站',
					value: contractInfo.trainSendStationName
				});
			}
			if (contractInfo.trainArriveStationName) {
				items.push({
					label: '到站',
					value: contractInfo.trainArriveStationName
				});
			}
			if (contractInfo.consignorCompanyName) {
				items.push({
					label: '托运人',
					value: contractInfo.consignorCompanyName
				});
			}
			if (contractInfo.consigneeCompanyName) {
				items.push({
					label: '收货人',
					value: contractInfo.consigneeCompanyName
				});
			}
			if (contractInfo.sendGoodsAddress) {
				items.push({
					label: '发货地址',
					value: contractInfo.sendGoodsAddress
				});
			}
			if (contractInfo.receiveGoodsAddress) {
				items.push({
					label: '收货地址',
					value: contractInfo.receiveGoodsAddress
				});
			}
			if (contractInfo.shipLoadingPortName) {
				items.push({
					label: '始发港',
					value: contractInfo.shipLoadingPortName
				});
			}
			if (contractInfo.shipDischargingPortName) {
				items.push({
					label: '卸货港',
					value: contractInfo.shipDischargingPortName
				});
			}
			if (contractInfo.receivableAccount) {
				items.push({
					label: '回款账户',
					value: contractInfo.receivableAccount
				});
			}
			if (contractInfo.receivableBankName) {
				items.push({
					label: '回款开户行',
					value: contractInfo.receivableBankName
				});
			}
			if (contractInfo.receivableBankNo) {
				items.push({
					label: '回款账号',
					value: formatAccountNumber(contractInfo.receivableBankNo)
				});
			}
			return items;
		},
		// 电子附件附件信息
		contractDetailFileRespList() {
			return this.contractInfoNotEmpty.contractDetailFileRespList || [];
		},
		// 线下合同附件信息
		contractAttachment() {
			return this.contractInfoNotEmpty.contractAttachment || [];
		},
		// 是否显示一键下载按钮
		isShowAllDownloadBtn() {
			if (this.contractDetailFileRespList.length > 0 || this.contractAttachment.length > 0) {
				return true;
			}
			return false;
		}
	},
	methods: {
		formatMoney,
		formatAccountNumber,
		// 一键下载合同附件
		downloadAllContractFile() {
			this.$emit('downloadAllContractFile', this.contractInfoNotEmpty);
		},
		goContractDetail() {
			let contractInfo = this.contractInfoNotEmpty;
			let path = `/sys/contract/online/detail?id=${contractInfo.id}`;
			if (contractInfo.paperContractNo) {
				path = `/sys/contract/offline/detail?id=${contractInfo.id}&contractNo=${contractInfo.orderNo}`;
			}
			const routeData = this.$router.resolve({
				path
			});
			window.open(routeData.href, '_blank');
		},
		// 电子合同查看
		viewContractDetail(record) {
			let path = '';
			if (this.platformType == 'REST') {
				return;
				// path = `/center/contract/${this.contractType.toLowerCase()}/agreement/pdf/detail`;
			} else {
				path = '/sys/contract/preview';
			}
			// 电子合同 查看-跳转到合同详情
			let routeUrl = this.$router.resolve({
				path: path,
				query: {
					contractNo: this.contractInfoNotEmpty.contractNo,
					contractId: this.contractInfoNotEmpty.id,
					zipFileName:
						this.contractInfoNotEmpty.contractNo +
						'-' +
						this.contractInfoNotEmpty.sellerCompanyName +
						'-' +
						this.contractInfoNotEmpty.buyerCompanyName +
						'.zip',
					no: record.no,
					newTab: 'newTab'
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		// 下载附件
		downloadAttachmentFile(item) {
			this.$emit('downloadAttachmentFile', item, this.contractInfoNotEmpty);
		},
		// 预览附件
		handlePreview(item) {
			this.$emit('handlePreview', item.fileUrl, this.contractInfoNotEmpty);
		}
	}
};
// 线上采购合同和销售合同

const onlineColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeText', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileName', width: '25%' },
	{ title: '文件编号', dataIndex: 'no', width: '25%' },
	{ title: '签订日期', dataIndex: 'signTime', width: '19%' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'left', fixed: 'right' }
];
// 线下采购合同和销售合同
const offlineColumns = [
	{ title: '单据类型', dataIndex: 'typeName', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.contract-info {
	.slTitleAssis {
		margin-top: 0;
	}
	.contract-info-descriptions {
		margin-top: 30px;
	}
	.new-table2 {
		::v-deep .ant-table-tbody > tr:nth-child(2n) {
			background: #fff;
		}
		::v-deep .ant-table-tbody > tr > td {
			border-bottom: 1px solid #e5e6eb;
			padding: 8px 12px;
		}
		::v-deep .ant-table-tbody > tr > td {
			border-right: 1px solid #e5e6eb;
		}
		::v-deep .ant-table-tbody > tr > :last-child {
			border-right: 0;
		}
	}
	.contract-no {
		display: flex;
		flex-direction: row;
		align-items: center;
		.no-text {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.long {
			flex-shrink: 0;
			display: inline-block;
			border-radius: 4px;
			border: 1px solid @primary-color;
			background: #fff;
			color: @primary-color;
			font-family: PingFang SC;
			font-size: 12px;
			width: 36px;
			height: 20px;
			text-align: center;
			margin-left: 8px;
		}
	}
}
</style>