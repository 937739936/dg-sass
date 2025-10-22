<template>
	<div>
		<template v-if="deliverRecordList && deliverRecordList.length">
			<div class="slTitleAssis">选择货物批次</div>
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				:dataSource="deliverRecordList"
				:pagination="false"
				rowKey="batchNo"
				:rowSelection="rowSelection"
			>
				<template
					slot="batchNo"
					slot-scope="text, record"
				>
					<a @click="
						jumpPage(
							'/center/receive/accept/detail',
							record.status == 2 ? {
								deliverId: record.id,
								form: 'receive',
							} :
							{
								receiveId: record.receiveId,
								form: 'receive',
							}
						)
					">{{ text }}</a>
				</template>
				<template
					slot="statusDesc"
					slot-scope="text, record"
				>
					<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
				</template>
			</a-table>
			<a-space v-if="deliverTotal.batchTotal" :size="20" class="totalRow">
				<span>发货批次数<em>{{deliverTotal.batchTotal}}</em></span>
				<span>票重<em>{{deliverTotal.deliverQuantityTotal | formatMoney(2)}}</em>&nbsp;吨</span>
				<span>衡重<em>{{deliverTotal.receiveQuantityTotal | formatMoney(2)}}</em>&nbsp;吨</span>
				<span v-if="deliverTotal.trainNumTotal">车数<em>{{deliverTotal.trainNumTotal | formatMoney(2)}}</em></span>
			</a-space>
		</template>
		<template v-else>
			<template v-if="goodsTransferRecordList && goodsTransferRecordList.length">
				<div class="slTitleAssis">选择货转</div>
				<a-table
					:columns="goodsTransfercolumns"
					class="new-table"
					:bordered="false"
					:dataSource="goodsTransferRecordList"
					:pagination="false"
					rowKey="goodsTransferNo"
					:rowSelection="rowSelectionTwo"
				>
					<template
						slot="goodsTransferNo"
						slot-scope="text, record"
					>
						<a @click="
							jumpPage(
								'/center/transfer/goodsTransfer/detail',
								{
									goodsTransferNo: record.goodsTransferNo,
								}
							)
						">{{ text }}</a>
					</template>
					<template
						slot="statusDesc"
						slot-scope="text, record"
					>
						<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
					</template>
				</a-table>
				<a-space v-if="goodsTransferTotal.batchTotal" :size="20" class="totalRow">
					<span>货物批次数<em>{{goodsTransferTotal.batchTotal}}</em></span>
					<span>货转数量<em>{{goodsTransferTotal.goodsTransferQuantityTotal | formatMoney(2)}}</em>&nbsp;吨</span>
				</a-space>
			</template>
			<template v-else>
				<div class="slTitleAssis">选择货物批次</div>
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					:dataSource="deliverRecordList"
					:pagination="false"
					rowKey="batchNo"
				>
				</a-table>
			</template>
		</template>
	</div>
</template>

<script>
import _ from 'lodash';
import { formatMoney } from '@sub/filters';
import {
	API_PaymentCreateDeliverGoodsTrans
} from '@/v2/center/trade/api/pay';
const columns = [
	{ title: '发货批次号', dataIndex: 'batchNo', scopedSlots: {
		customRender: 'batchNo'
	}, },
	{ title: '运输方式', dataIndex: 'despatchTypeDesc',},
	{ title: '发货数量（吨）', dataIndex: 'deliverQuantity', },
	{ title: '收货数量（吨）', dataIndex: 'receiveQuantity' },
	{ title: '发货日期', dataIndex: 'deliverDate' },
	{ title: '最后收货日期', dataIndex: 'lastReceiveDate' },
	{ title: '货转开具标识', dataIndex: 'goodsTransferFlag',
		customRender(text) {
			return text === 0 ? '未开具' : (text === 1 ? '部分开具' : '已开具')
		}
	},
	{ title: '状态', dataIndex: 'statusDesc',scopedSlots: {
		customRender: 'statusDesc'
	} },
];
const goodsTransfercolumns = [
	{ title: '货转编号', dataIndex: 'goodsTransferNo',scopedSlots: {
		customRender: 'goodsTransferNo'
	}, },
	{ title: '发运方式', dataIndex: 'transTypeDesc',},
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', },
	{ title: '货转日期', dataIndex: 'signDate' },
	{ title: '收货人', dataIndex: 'receiverName', },
	{ title: '状态', dataIndex: 'statusDesc',scopedSlots: {
		customRender: 'statusDesc'
	} },
];

export default {
	data() {
		return {
			columns,
			goodsTransfercolumns,
			deliverRecordList: [],
			selectedRowKeys: [],
			selectedRows: [],
			goodsTransferRecordList: [], 
			selectedRowKeys2: [],
			selectedRows2: [],
			deliverTotal: {
				batchTotal: 0,
				deliverQuantityTotal: 0,
				receiveQuantityTotal: 0,
				trainNumTotal: 0
			},
			goodsTransferTotal: {
				batchTotal: 0,
				goodsTransferQuantityTotal: 0,
			},
		}
	},
	watch: {
		'selectedRows': function(data) {
			this.computedTotal();
		},
		'selectedRows2': function(data) {
			this.computedTotal2();
		}
	},
	computed: {
		rowSelection() {
			return {
				type: 'checkbox',
				selectedRowKeys: this.selectedRows.map(i => i.batchNo),
				onSelect: (record, selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'batchNo');
					} else {
						this.selectedRows = this.selectedRows.filter(o => o.batchNo != record.batchNo);
					}
				},
				onSelectAll: (selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'batchNo');
					} else {
						this.selectedRows = [];
					}
					
				}
			};
		},
		rowSelectionTwo() {
			return {
				type: 'checkbox',
				selectedRowKeys: this.selectedRows2.map(i => i.goodsTransferNo),
				onSelect: (record, selected, selectedRows2) => {
					if (selected) {
						this.selectedRows2 = _.uniqBy([...this.selectedRows2, ...selectedRows2], 'goodsTransferNo');
					} else {
						this.selectedRows2 = this.selectedRows2.filter(o => o.goodsTransferNo != record.goodsTransferNo);
					}
				},
				onSelectAll: (selected, selectedRows2) => {
					if (selected) {
						this.selectedRows2 = _.uniqBy([...this.selectedRows2, ...selectedRows2], 'goodsTransferNo');
					} else {
						this.selectedRows2 = []
					}
					
				}
			};
		}
	},
	mounted() {
	},
	methods: {
		async init(payType, paymentType) {
			const res = await API_PaymentCreateDeliverGoodsTrans({
				serialNo: this.$route.query.serialNo,
				contractType:  this.$route.query.contractType,
				payType: payType,
				paymentType: paymentType,
			})
			if (!res.success) return
			this.goodsTransferRecordList = res.data.goodsTransferRecordList || []
			this.deliverRecordList = res.data.deliverRecordList || []
		},
		async edit (payType, paymentType, deliverGoodsTransVO) {
			return new Promise(async resolve => {
				await this.init(payType, paymentType)
				this.selectedRows = deliverGoodsTransVO.deliverRecordList || []
				this.selectedRows2 = deliverGoodsTransVO.goodsTransferRecordList || []
				resolve()
			})
		},
		computedTotal() {
			if (this.deliverRecordList?.length) {
				this.$emit('changeGoodsInfo', this.selectedRows)
			}
			this.deliverTotal.batchTotal = this.selectedRows.length;
			if (!this.selectedRows.length) return
			this.deliverTotal.deliverQuantityTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.deliverQuantity) || 0);
			}, 0);
			this.deliverTotal.receiveQuantityTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.receiveQuantity) || 0);
			}, 0);
			this.deliverTotal.trainNumTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.trainNum) || 0);
			}, 0);
		},
		computedTotal2() {
			if (this.goodsTransferRecordList?.length) {
				this.$emit('changeGoodsInfo', this.selectedRows2)
			}
			this.goodsTransferTotal.batchTotal = this.selectedRows2.length;
			if (!this.selectedRows2.length) return
			this.goodsTransferTotal.goodsTransferQuantityTotal = this.selectedRows2.reduce((pre, cur) => {
				return pre + (Number(cur.goodsTransferQuantity) || 0);
			}, 0);
		},
		jumpPage(path, query) {
			let routeUrl = this.$router.resolve({
				path,
				query
			});
			window.open(routeUrl.href, '_blank');
		},
		save(type) {
			this.selectedRowKeys = this.selectedRows.map(i => i.batchNo)
			this.selectedRowKeys2 = this.selectedRows2.map(i => i.goodsTransferNo)
			if (type === 'save') {
				return {
					deliveryNoList: this.selectedRowKeys,
					goodsTransferNoList: this.selectedRowKeys2
				}
			}
			// 有货物信息
			if (this.deliverRecordList.length) {
				if (!this.selectedRowKeys.length) {
					this.$message.error('请选择货物批次')
					return false
				} else {
					return {
						deliveryNoList: this.selectedRowKeys,
						goodsTransferNoList: null
					}
				}
			} else if (this.goodsTransferRecordList.length) {
				if (!this.selectedRowKeys2.length) {
					this.$message.error('请选择货转')
					return false
				} else {
					return {
						deliveryNoList: null,
						goodsTransferNoList: this.selectedRowKeys2
					}
				}
			} else {
				this.$message.error('当前合同缺少有效的发运批次，无法进行预结算付款')
				return false
			}
		}
	}
};
</script>
<style lang="less" scoped>
	@import url('~@/v2/style/table-cover.less');
	</style>
<style lang="less" scoped>
.slTitleAssis {
  margin-top: 50px;
  margin-bottom: 20px;
}
.new-table {
	margin-top: 10px;
	::v-deep.ant-empty-image::after{
		content: "当前合同缺少有效的发运批次，无法进行预结算付款";
		display: flex;
		justify-content: center;
	}
	::v-deep.ant-empty-normal{
		.ant-empty-description {
			display: none;
		}
	}
}
.totalRow {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
	span {
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: rgba(119, 136, 157, 1);
		display: inline-block;
		em {
			display: inline-block;
			margin-left: 10px;
			font-style: normal;
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;
			line-height: 26px;
			text-align: left;
			color: rgba(244, 99, 50, 1);
		}
	}
}
.status-tag {
	display: inline-block;
	padding: 0 6px;
	height: 20px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 20px;
	background: #c1d7ff;
	color: #4682f3;
	&.status-1 {
		background: #c9daff;
		color: #596fa0;
	}
	&.status-2 {
		background: #ffdbc8;
		color: #ff7937;
	}
	&.status-3 {
		background: #f8dde8;
		color: #db81a5;
	}
	&.status-4 {
		background: #c5ecdd;
		color: #3eb384;
	}
	&.status-5 {
		background: #e0e0e0;
		color: #a8a8a8;
	}
	&.status-WAIT_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	/* //审批中 */
	&.status-AUDITING {
		background: #ffdbc8;
		color: #ff7937;
	}
	/* //待签约 */
	&.status-UNSEAL {
		background: #f8dde8;
		color: #db81a5;
	}
	/* //已签约 */
	&.status-SEALED {
		background: #c5ecdd;
		color: #3eb384;
	}
	/* //已作废 */
	&.status-INVALID {
		background: #e0e0e0;
		color: #a8a8a8;
	}
	/* //退回 */
	&.status-APPROVAL_FAIL {
		background: #d2dfea;
		color: #7590b9;
	}
	/* //驳回 */
	&.status-REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
}
</style>
