<template>
	<div style="width: 100%">
		<!-- 仓储端不展示 -->
		<template v-if="!isWarehouse && contractInfo">
			<div class="slTitleAssis">采购合同信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="合同编号">
					<a
						@click="goContract"
						href="javascript:;"
						>{{ contractInfo.contractNo || '-' }}</a
					>
					<span
						@mouseenter="copyVisible = true"
						@mouseleave="copyVisible = false"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="contractInfo.contractNo"
					>
						<Copy
							class="cur"
							v-show="!copyVisible"
						></Copy>
						<span
							v-show="copyVisible"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="contractInfo.contractNo"
						>
							<CopyNow class="cur"></CopyNow>
						</span>
					</span>
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
					{{ contractInfo.goodsName }}
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
				<a-descriptions-item label="数量">
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
		</template>
		<div class="slTitleAssis">货物信息</div>
		<a-table
			rowKey="id"
			class="new-table"
			:columns="goodsColumns"
			:dataSource="detailData.inStorageList"
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
					@click="goInDetail(record)"
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
		<div class="goods-tips">
			<span>入库数量：</span>
			<span>{{ detailData.quantity | formatMoney(4) }}吨</span>
			<span style="margin-left: 30px">损耗标准：</span>
			<span v-if="!detailData.lossStandardType">-</span>
			<span v-else-if="detailData.lossStandardType == 'TEXT'">{{ detailData.lossStandard }}</span>
			<span v-else>±{{ detailData.lossStandard }}%</span>
		</div>
		<div v-if="detailData.productIndicatorList && detailData.productIndicatorList.length">
			<div class="slTitleAssis">质量指标</div>
			<a-descriptions
				bordered
				:column="3"
				class="indicator-desc"
				size="middle"
			>
				<a-descriptions-item
					:key="index"
					v-for="(item, index) in detailData.productIndicatorList"
					:label="`${item.indicatorName}`"
				>
					<span v-if="item.inputType == 'RANGE'">{{ item.value1 }} - {{ item.value2 }}</span>
					<span v-else>{{ item.symbol }} {{ item.value1 }} </span>
				</a-descriptions-item>
			</a-descriptions>
		</div>
		<div class="slTitleAssis">仓储合同信息</div>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="仓储合同编号">
				{{ detailData.warehouseContractNo || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="存储期间"
				>{{ detailData.storageTimeStart }} - {{ detailData.storageTimeEnd }}
			</a-descriptions-item>
			<a-descriptions-item label="仓储费用">
				<span>￥{{ detailData.storageFees | formatMoney }}</span>
			</a-descriptions-item>
		</a-descriptions>
		<div v-if="insuranceInfo">
			<div class="slTitleAssis">保险信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="保险险种">{{ insuranceInfo.insuranceTypeDesc || '-' }} </a-descriptions-item>
				<a-descriptions-item
					label="保险自定义"
					v-if="insuranceInfo.insuranceTypeHandInput"
					>{{ insuranceInfo.insuranceTypeHandInput }}
				</a-descriptions-item>
				<a-descriptions-item label="保险单号">
					<span>{{ insuranceInfo.policyNo || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="保险人">
					<span>{{ insuranceInfo.policyHolder || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="被保险人">
					<span>{{ insuranceInfo.insurant || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="保险期限">
					<span>{{ insuranceInfo.insurancePeriodStart }} - {{ insuranceInfo.insurancePeriodEnd }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="保险金额">
					<span v-if="insuranceInfo.insuranceAmount">￥{{ insuranceInfo.insuranceAmount | formatMoney }}</span>
					<span v-else>-</span>
				</a-descriptions-item>
			</a-descriptions>
		</div>

		<div class="file-title">
			<div class="slTitleAssis">附件信息</div>
			<a-button
				type="primary"
				class="btn"
				ghost
				@click="downloadAll"
			>
				一键下载
			</a-button>
		</div>
		<div>
			<a-table
				rowKey="name"
				class="new-table file-table"
				:columns="fileColumns"
				:dataSource="detailData.warehouseReceiptAttachmentList"
				:pagination="false"
				:defaultExpandAllRows="true"
				:scroll="{ x: true }"
				:locale="{ emptyText: '暂无数据' }"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<a
							href="javascript:;"
							@click="viewPDF(record)"
							>查看</a
						>
						<a
							href="javascript:;"
							@click="downPDF(record)"
							>下载</a
						>
					</a-space>
				</div>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { Copy, CopyNow } from '@sub/components/svg/index';

const customRender = t => t || '-';
const fileColumns = [
	{
		title: '文件类型',
		dataIndex: 'fileTypeDesc',
		customRender
	},
	{
		title: '文件名称',
		dataIndex: 'name',
		customRender
	},
	{
		title: '文件编号',
		dataIndex: 'fileNo',
		customRender
	},
	{
		title: '签订日期',
		dataIndex: 'signDate',
		customRender
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 120,
		align: 'left',
		fixed: 'right'
	}
];
const goodsColumns = [
	{ title: '入库编号', dataIndex: 'inStorageNo', scopedSlots: { customRender: 'no' } },
	{ title: '入库日期', dataIndex: 'storageDate' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '入库数量(吨)', dataIndex: 'quantity', customRender: t => formatMoney(t, 4) },
	{ title: '发货单位', dataIndex: 'receiveCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '仓房-货位', dataIndex: 'warehouseGoodsAllocationName', scopedSlots: { customRender: 'warehouseGoodsAllocationName' } }
];

export default {
	props: {
		detailData: {
			default: {}
		},
		operatorInfo: {},
		type: {
			default: 'rest'
		}
	},
	components: {
		Copy,
		CopyNow
	},
	watch: {
		detailData: {
			handler(val) {
				this.contractInfo = val.contractInfo;
				this.insuranceInfo = val.insuranceInfo;
			}
		}
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
	data() {
		return {
			copyVisible: false,
			fileColumns,
			goodsColumns,
			contractInfo: null,
			insuranceInfo: null
		};
	},

	methods: {
		formatMoney,

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
		// 入库详情
		goInDetail(item) {
			if (this.type == 'rest') {
				let path = `/center/logisticsPlatform/in/detail?id=${item.id}`;
				window.open(path, '_blank');
			} else {
				let path = `/logisticsPlatform/in/detail?id=${item.id}`;
				window.open(path, '_blank');
			}
		},

		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},

		viewPDF(item) {
			this.$emit('viewPDF', item);
		},
		downloadAll() {
			this.$emit('downloadAll');
		},
		downPDF(item) {
			this.$emit('download', item);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.slTitleAssis {
	margin-bottom: 30px;
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
		width: 22%;
	}
}
.indicator-desc {
	::v-deep.ant-descriptions-item-label {
		width: 200px;
		max-width: 200px;
	}
	::v-deep.ant-descriptions-item-content {
		width: inherit;
	}
}
.new-table {
	::v-deep.ant-table {
		th,
		td {
			white-space: nowrap;
		}
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
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
.file-table {
	/deep/ .ant-table-fixed-columns-in-body {
		border-left: 1px solid #e5e6eb;
		width: 88px;
	}
}
.file-title {
	display: flex;
	align-items: center;
	.btn {
		height: 28px;
		width: 88px;
		margin-left: 20px;
	}
}
</style>
