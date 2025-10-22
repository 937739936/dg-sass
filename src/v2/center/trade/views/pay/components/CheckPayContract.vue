<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="付款合同"
			placement="right"
			:visible="orderRelationModal"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<div class="tips-box">
				<p>{{ info.placeholder }}</p>
				<p>原因：{{ info.reason }}</p>
			</div>
			<div class="tabs-box">
				<a-tabs
					v-model="tab"
					@change="resetValuesRelation"
				>
					<a-tab-pane
						key="contract"
						tab="未完结合同"
						v-if="info.existContractUnFinish"
					>
					</a-tab-pane>
					<a-tab-pane
						key="statement"
						tab="未结清服务费结算单"
						v-if="info.existServiceFeeUnPay"
					>
					</a-tab-pane>
				</a-tabs>
				<div
					class="export-box"
					@click="exportFile"
				>
					<img
						class="export-icon"
						src="@/v2/assets/imgs/common/export_icon.png"
						alt=""
					/>
					<span class="export-text">数据导出</span>
				</div>
			</div>

			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:dataSource="relationOrderList"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.id"
					:loading="loading"
				>
					<template
						slot="contractNo"
						slot-scope="action, item"
					>
						<span v-if="item.contractNo.length <= 1">{{ item.contractNo.join(',') }}</span>
						<span v-else>
							<a-tooltip>
								<template slot="title">
									{{ item.contractNo.join(',') }}
								</template>
								{{ item.contractNo[0] }}...
							</a-tooltip>
						</span>
					</template>
					<template
						slot="buyerName"
						slot-scope="action, item"
					>
						<span v-if="item.buyerName.length <= 1">{{ item.buyerName.join(',') }}</span>
						<span v-else>
							<a-tooltip>
								<template slot="title">
									{{ item.buyerName.join(',') }}
								</template>
								{{ item.buyerName[0] }}...
							</a-tooltip>
						</span>
					</template>
					<template
						slot="sellerName"
						slot-scope="action, item"
					>
						<span v-if="item.sellerName.length <= 1">{{ item.sellerName.join(',') }}</span>
						<span v-else>
							<a-tooltip>
								<template slot="title">
									{{ item.sellerName.join(',') }}
								</template>
								{{ item.sellerName[0] }}...
							</a-tooltip>
						</span>
					</template>
					<template
						slot="businessManager"
						slot-scope="action, item"
					>
						<span v-if="item.businessManager.length <= 1">{{ item.businessManager.join(',') }}</span>
						<span v-else>
							<a-tooltip>
								<template slot="title">
									{{ item.businessManager.join(',') }}
								</template>
								{{ item.businessManager[0] }}...
							</a-tooltip>
						</span>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="relation-contract-modal-btn"
						style="margin-right: 10px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						style="width: 118px"
						type="primary"
						v-if="!info.canPayment"
						@click="onClose"
						>确定</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						style="width: 118px"
						type="primary"
						v-else
						@click="handleSubmit"
						>继续付款</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getContractUnFinishList, getServiceFeeUnPayList, exportLimitData } from '@/v2/center/trade/api/pay';

import { getPopupContainer } from '@/v2/utils/factory.js';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';

const columns1 = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left' },
	{ title: '买方企业名称', dataIndex: 'buyerName' },
	{ title: '卖方企业名称', dataIndex: 'sellerName' },
	{ title: '业务负责人', dataIndex: 'businessManager' },
	{ title: '交货期限', dataIndex: 'deliveryPeriod' }
];
const columns2 = [
	{ title: '服务费结算单号', dataIndex: 'serialNo', fixed: 'left' },
	{ title: '结算日期', dataIndex: 'createDate' },
	{ title: '结算单状态', dataIndex: 'statusText' },
	{ title: '服务费总金额', dataIndex: 'serviceFeeAmount' },
	{ title: '收款情况', dataIndex: 'chargeStatusText' },
	{ title: '收款金额', dataIndex: 'receiveAmount' },
	{ title: '关联合同编号', dataIndex: 'contractNo', scopedSlots: { customRender: 'contractNo' } },
	{ title: '买方企业名称', dataIndex: 'buyerName', scopedSlots: { customRender: 'buyerName' } },
	{ title: '卖方企业名称', dataIndex: 'sellerName', scopedSlots: { customRender: 'sellerName' } },
	{ title: '业务负责人', dataIndex: 'businessManager', scopedSlots: { customRender: 'businessManager' } }
];
export default {
	name: 'RelationContract',
	props: {
		currentRow: {
			default: () => {
				return {};
			}
		}
	},
	computed: {
		//电子合同，线下合同表头不同
		columns() {
			if (this.tab == 'contract') {
				return columns1;
			}
			return columns2;
		}
	},
	data() {
		return {
			getPopupContainer,
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			selected: {}, // 关联合同被选中的数据
			tab: 'contract', //合同类型，电子on,线下off
			loading: false,
			info: {}
		};
	},
	components: {
		iPagination
	},
	methods: {
		getRelationOrderList(data) {
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const Api = this.tab == 'contract' ? getContractUnFinishList : getServiceFeeUnPayList;

			const params = {
				...this.searchModalParamsRelation,
				orderNo: this.currentRow.orderNo,
				pageNo: this.paginationRelation.pageNo || 1,
				pageSize: this.paginationRelation.pageSize || 10
			};

			Api(params)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						if (this.tab != 'contract') {
							result.records.forEach(el => {
								el.contractNo = el.contractNo.split(',');
								el.buyerName = el.buyerName.split(',');
								el.sellerName = el.sellerName.split(',');
								el.businessManager = el.businessManager.split(',');
							});
						}
						this.relationOrderList = result.records;
						const paginationRelation = {
							total: result.total,
							pageSize: result.size,
							current: result.current,
							pageNo: result.current,
							showTotal: function (total) {
								return `共${total}条记录 第${result.current}页 `;
							}
						};
						this.paginationRelation = paginationRelation;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showDrawer(info) {
			this.info = info;
			if (info.existContractUnFinish) {
				this.tab = 'contract';
			} else if (info.existServiceFeeUnPay) {
				this.tab = 'statement';
			} else {
				this.tab = 'contract';
			}
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		handleSubmit() {
			this.orderRelationModal = false;
			this.$emit('continue', true);
		},
		async exportFile() {
			const params = {
				orderNo: this.currentRow.orderNo,
				existContractUnFinish: this.info.existContractUnFinish,
				existServiceFeeUnPay: this.info.existServiceFeeUnPay
			};
			let name = '';
			if (this.info.existContractUnFinish) {
				name = '团队未完结合同清单.xls';
			}
			if (this.info.existServiceFeeUnPay) {
				name = '未结清服务费结算单清单.xls';
			}
			if (this.info.existServiceFeeUnPay && this.info.existContractUnFinish) {
				name = '团队未完结合同&未结清服务费结算单清单.xls';
			}
			const res = await exportLimitData(params);
			comDownload(res, undefined, name);
		},
		onClose() {
			this.orderRelationModal = false;
			this.selectedRowKeys = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
.slDrawer {
	/deep/ .table-box .new-table .ant-table-thead > tr > th:first-child {
		padding: 12px;
	}
	/deep/ .table-box .new-table .ant-table-tbody > tr > td:first-child {
		padding: 12px !important;
	}
}
.tabs-box {
	position: relative;
}
.export-box {
	position: absolute;
	right: 0;
	top: 16px;
	text-align: right;
	cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: -2px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: #4682f3;
		line-height: 20px;
	}
}
.tips-box {
	border-radius: 4px;
	background: #f3f6fb;
	padding: 14px;
	color: #77889d;
	font-size: 14px;
	margin-top: 20px;
	margin-bottom: 30px;
	p:first-child {
		color: rgba(0, 0, 0, 0.8);
		font-family: PingFang SC;
		font-size: 16px;
		margin-bottom: 14px;
		font-weight: 600;
	}
}
</style>
