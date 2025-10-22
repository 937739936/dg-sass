<template>
	<div style="width: 100%">
		<!-- 仓储端不展示 -->
		<div v-if="!isWarehouse">
			<div class="slTitleAssis">销售合同信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="合同编号">
					<div
						@mouseenter="copyNow = true"
						@mouseleave="copyNow = false"
					>
						<a
							@click="goContract"
							href="javascript:;"
							>{{ contractInfo.contractNo || '-' }}</a
						>
						<Copy
							v-if="contractInfo.contractNo"
							class="cur"
							v-show="!copyNow"
						></Copy>
						<span
							v-if="contractInfo.contractNo"
							v-show="copyNow"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="contractInfo.contractNo"
						>
							<CopyNow class="cur"></CopyNow>
						</span>
					</div>
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.sellerName"
					label="卖方企业"
					>{{ contractInfo.sellerName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.buyerName"
					label="买方企业"
				>
					<span>{{ contractInfo.buyerName || '-' }}</span>
				</a-descriptions-item>

				<a-descriptions-item
					v-if="contractInfo.goodsName"
					label="品名"
				>
					{{ contractInfo.goodsName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item :label="contractInfo.contractType == 'OFFLINE' ? '合同价格' : '基准价格'">
					<span v-if="contractInfo.followTheMarket">随行就市</span>
					<span
						v-if="
							contractInfo.basePrice !== undefined &&
							contractInfo.basePrice !== null &&
							!contractInfo.followTheMarket &&
							!contractInfo.basePriceDesc
						"
					>
						<i v-if="contractInfo.basePrice == '随行就市' || contractInfo.basePrice == 0">随行就市</i>
						<i v-else>{{ contractInfo.basePrice | formatMoney(2) }} 元/吨</i>
					</span>
					<i v-if="contractInfo.basePriceDesc && !contractInfo.followTheMarket">{{ contractInfo.basePriceDesc || '-' }}</i>
				</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.quantity"
					label="数量"
				>
					<span
						>{{ contractInfo.quantity ? formatMoney(contractInfo.quantity, 4) + '吨' : '-' }}
						<i v-if="contractInfo.quantityOffset">(±{{ contractInfo.quantityOffset }}%)</i>
					</span>
				</a-descriptions-item>
				<a-descriptions-item label="交货期限">{{
					contractInfo.startDate ? `${contractInfo.startDate} 至${contractInfo.endDate}` : '-'
				}}</a-descriptions-item>
				<a-descriptions-item
					v-if="contractInfo.transportModeDesc"
					label="运输方式"
					>{{ contractInfo.transportModeDesc || '-' }}</a-descriptions-item
				>
				<a-descriptions-item
					v-if="contractInfo.consigneeCompanyName"
					label="收货人"
					>{{ contractInfo.consigneeCompanyName || '-' }}</a-descriptions-item
				>
			</a-descriptions>
		</div>

		<div>
			<div class="slTitleAssis">仓单提货信息</div>
			<a-alert
				class="a-alert"
				type="info"
			>
				<template slot="message">
					<div class="alert-wrapper">
						<div class="alert-icon">
							<img
								src="@sub/assets/imgs/trade/warning.png"
								style="width: 16px; height: 16px"
								alt=""
							/>
						</div>
						<span
							class="alert-message"
							v-html="
								`若仓单全部提货，则仓储方审核通过后线下出库，原仓单状态会更新为“已出库”；<br/>
					若仓单部分提货，则原仓单会拆分为存货子仓单、出库子仓单，仓储方审核通过盖章后线下出库，原仓单状态更新为“已核销”，出库子仓单状态会更新为“已出库”，存货子仓单状态更新为“生效中”；`
							"
						></span>
					</div>
				</template>
			</a-alert>
			<a-table
				rowKey="name"
				class="new-table"
				:columns="deliveryColumns"
				:dataSource="detailData.deliveryInfo"
				:pagination="false"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
				:scroll="{ x: true }"
			>
				<template
					slot="no"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="viewReceipt(record.warehouseReceiptFilePath)"
						>{{ text }}</a
					>
				</template>
				<template
					slot="no1"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="viewReceipt(record.outBoundChildFilePath)"
						>{{ text }}</a
					>
				</template>
				<template
					slot="no2"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="viewReceipt(record.inventoryChildFilePath)"
						>{{ text }}</a
					>
				</template>
				<template
					slot="warehouseGoodsAllocationName"
					slot-scope="text"
				>
					<a-tooltip v-if="text">
						<template slot="title">{{ text }}</template>
						<p class="omit">{{ text || '-' }}</p>
					</a-tooltip>
					<span v-else>-</span>
				</template>
			</a-table>
		</div>
		<div>
			<div class="slTitleAssis">提货详细信息</div>
			<LadingInfoDetailView :detailData="detailData"></LadingInfoDetailView>
		</div>

		<!-- 仓储端-提货记录详情页不展示该模块信息 -->
		<div v-if="!isWarehouse">
			<div class="slTitleAssis">附件信息</div>
			<div class="table-box">
				<a-table
					:columns="filesColumns"
					class="new-table file-table"
					:bordered="false"
					rowKey="id"
					:dataSource="attachments || []"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<div
						slot="fileSerialNo"
						slot-scope="text, record"
					>
						<div
							v-for="(item, index) in record.fileList"
							:key="index"
							style="display: inline-block; color: var(--primary-color)"
						>
							<a-tooltip>
								<template slot="title">
									<span>上传时间：{{ item.createdDate }}</span>
								</template>
								<a
									class="fileName"
									@click="filePreview(item)"
									>{{ item.name }}</a
								>
							</a-tooltip>
							<span
								v-if="index != record.fileList.length - 1"
								style="color: rgba(233, 239, 252, 1); margin: 0 14px"
							>
								|
							</span>
						</div>
					</div>
					<div
						slot="action"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							@click="download(items)"
						>
							下载</a
						>
					</div>
				</a-table>
			</div>
		</div>
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
			:forceRender="true"
			:destroyOnClose="true"
		>
			<div class="content">
				<pdf-preview :url="currentPdf"></pdf-preview>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import LadingInfoDetailView from './LadingInfoDetailView';
import PdfPreview from '@sub/components/pdf/index.vue';
import { Copy, CopyNow } from '@sub/components/svg/index';

const filesColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeDesc' },
	{ title: '文件编号', scopedSlots: { customRender: 'fileSerialNo' } },
	{ title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];

const deliveryColumns = [
	{ title: '原仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'no' } },
	{ title: '原持有人', dataIndex: 'bailorCompanyName', customRender: t => t || '-' },
	{ title: '提货方', dataIndex: 'deliveryCompanyName', customRender: t => t || '-' },
	{ title: '货物名称', dataIndex: 'goodsName', customRender: t => t || '-' },
	{ title: '仓房-货位', dataIndex: 'warehouseGoodsAllocationName', customRender: t => t || '-' },
	{ title: '原仓单数量（吨）', dataIndex: 'quantity', customRender: t => formatMoney(t, 4) },
	{
		title: '出库仓单编号',
		dataIndex: 'outBoundChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'no1' }
	},
	{ title: '出库仓单数量（吨）', dataIndex: 'outBoundQuantity', customRender: t => formatMoney(t, 4) },
	{ title: '存货子仓单编号', dataIndex: 'inventoryChildWarehouseReceiptNo', scopedSlots: { customRender: 'no2' } },
	{
		title: '存货子仓单数量（吨）',
		dataIndex: 'inventoryQuantity',
		customRender: t => {
			if (t == 0) {
				return '-';
			}
			return formatMoney(t, 4);
		}
	}
];
export default {
	props: {
		detailData: {
			default: () => {
				return {};
			}
		},
		type: {
			default: 'rest'
		}
	},
	components: {
		Copy,
		CopyNow,
		LadingInfoDetailView,
		PdfPreview
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		}
	},

	watch: {
		detailData: {
			handler(v) {
				let attachments = [];
				this.contractInfo = v.contractInfo;
				let attachDTOList = v.warehouseReceiptAttachmentList ?? [];
				if (attachDTOList.length > 0) {
					attachments.push({
						type: 'PAYABLE_VOUCHER',
						fileTypeDesc: '付款凭证',
						fileList: attachDTOList
					});
				}
				let deliveryDTOList = v.waitSignAttachmentList ?? [];
				if (deliveryDTOList.length > 0) {
					attachments.push({
						type: 'WAREHOUSE_RECEIPT',
						fileTypeDesc: '电子仓单',
						fileList: deliveryDTOList
					});
				}
				this.attachments = attachments;
			}
		}
	},
	data() {
		return {
			copyNow: false,
			filesColumns,
			deliveryColumns,
			contractInfo: {},
			attachments: [],
			previewVisible: false,
			currentPdf: ''
		};
	},

	methods: {
		formatMoney,
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},

		// 去往合同详情
		goContract() {
			let type = 'BUY';
			let contractType = this.contractInfo.contractType;
			let orderContractId = this.contractInfo.orderContractId;

			let path = null;
			if (this.type == 'rest') {
				path = `/center/contract/${type.toLowerCase()}/${contractType.toLowerCase()}/detail?id=${orderContractId}&type=${type}`;
			} else {
				path = `/sys/contract/${contractType.toLowerCase()}/detail?id=${orderContractId}`;
				if (contractType == 'OFFLINE') {
					path += `&contractNo=${this.contractInfo.orderNo}`;
				}
			}
			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		},

		viewReceipt(filePath) {
			if (!filePath) {
				return;
			}
			this.currentPdf = filePath;
			this.previewVisible = true;
		},
		download(item) {
			this.$emit('download', item);
		},
		filePreview(data) {
			this.$emit('filePreview', data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.a-alert {
	display: inline-block;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid #d0dfff;
	border-radius: 4px;
	width: 100%;
	margin-bottom: 24px;
	.alert-wrapper {
		display: flex;
		flex-direction: row;
	}
	.alert-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-right: 12px;
	}
	.alert-message {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		letter-spacing: 0;
		line-height: 18px;
	}
}

::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding: 0 !important;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		// width: inherit;
		width: 22%;
	}
}

/deep/ .ant-table {
	th,
	td {
		white-space: nowrap;
	}
}
.new-table {
	margin-top: 0px;
}
.file-table {
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
		width: 88px;
	}
	/deep/ .ant-table-fixed-columns-in-body {
		border-left: 1px solid #e5e6eb;
		width: 88px;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
.slTitleAssis {
	margin-bottom: 30px;
}
.file-box {
	display: flex;
	margin-bottom: 20px;
	margin-top: 30px;
	align-items: center;
	// .slTitleAssis {
	// 	margin-top: 0;
	// 	margin-right: 20px;
	// }
	.btn {
		height: 28px;
		width: 88px;
	}
}
.goods-tips {
	margin-top: 20px;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	span:nth-child(2n) {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
	}
}
</style>
