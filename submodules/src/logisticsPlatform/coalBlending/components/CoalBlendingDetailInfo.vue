<template>
	<div class="coal-blending-info">
		<a-form-model
			ref="baseInfoForm"
			:model="detailInfoNotEmpty"
			class="slFormDetail"
		>
			<a-row class="row">
				<a-col :span="8">
					<a-form-model-item
						label="配煤类型"
						prop="type"
					>
						<a-radio-group
							v-model="detailInfoNotEmpty.type"
							:disabled="true"
						>
							<a-radio value="BLENDING_COAL">掺配</a-radio>
							<a-radio value="WASH_COAL">洗煤</a-radio>
						</a-radio-group>
					</a-form-model-item>
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						label="配煤日期"
						prop="blendingDate"
					>
						<a-date-picker
							v-model="detailInfoNotEmpty.blendingDate"
							placeholder="请选择配煤日期"
							valueFormat="YYYY-MM-DD"
							format="YYYY-MM-DD"
							:disabled="true"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>
		<div class="step-wrapper">
			<div class="step-title">
				<div class="step-line"></div>
				<a-icon type="check-circle" theme="filled" style="font-size: 20px;color: var(--primary-color)"/>
				<span class="complete-text">选择煤种</span>
			</div>
			<div class="coal-type-table-wrapper">
				<a-table
					class="new-table"
					:dataSource="detailInfoNotEmpty.detailList || []"
					:columns="coalTypeColumns"
					:pagination="false"
					:scroll="{ x: true }"
					:rowKey="(record, index) => index"
				></a-table>
			</div>
		</div>
		<div class="step-wrapper">
			<div class="step-title">
				<div class="step-line"></div>
				<a-icon type="check-circle" theme="filled" style="font-size: 20px;color: var(--primary-color)"/>
				<span class="complete-text">出煤信息</span>
			</div>
			<div :class="detailInfoNotEmpty.type === 'WASH_COAL' ? 'produce-coal-table-wrapper' : ''">
				<a-table
					class="new-table"
					:dataSource="detailInfoNotEmpty.extractionList || []"
					:columns="produceCoalListColumns"
					:pagination="false"
					:scroll="{ x: true }"
					:rowKey="(record, index) => index"
				>
					<template slot="action">
						<a-space :size="24">
							<a @click="saveCoalTypeTable()">修改</a>
						</a-space>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CoalBlendingDetailInfo',
	props: {
		detailInfo: {
			type: Object,
			default: () => ({})
		},
		// 是否是站台管理服务
		isManager: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			formModel: {
				type: 'BLENDING_COAL',
				blendingDate: ''
			},
		};
	},
	computed: {
		detailInfoNotEmpty() {
			return this.detailInfo || {};
		},
		coalTypeColumns() {
			let list = [...coalTypeColumns]
			if (this.isManager) {
				list.splice(1, 1);
			}
			return [...list];
		},
		produceCoalListColumns() {
			let list = [];
			if (this.detailInfoNotEmpty.type === 'WASH_COAL') {
				list = washProduceCoalColumns(this);
			} else {
				list = produceCoalColumns;
			}
			return [...list];
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const coalTypeColumns = [
	{
		title: '配煤库存信息',
		dataIndex: 'coalTypeInventory',
		customRender: (text, item) => {
			return `${item.goodsName || item.coalType}-${item.houseName}&${item.goodsAllocationName}-${item.inventoryQuantity}`;
		},
		width: '35%'
	},
	{
		title: '煤种单价(元/吨) ',
		dataIndex: 'price',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '配煤数量(吨) ',
		dataIndex: 'quantity',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '占总配煤比例',
		dataIndex: 'ratio',
		customRender: (text, item) => {
			if (text) {
				return `${text}%`;
			}
			return '-';
		}
	}
];

// 掺配出煤信息表头
const produceCoalColumns = [
	{
		title: '出煤品名',
		dataIndex: 'coalType',
		customRender: (text, record) => {
			let coalType = record.coalType || '-';
			if (record.goodsName) {
				coalType = record.goodsName;
			}
			return coalType;
		}
	},
	{
		title: '出煤总量(吨) ',
		dataIndex: 'coalQuantity',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '出煤单价(元/吨) ',
		dataIndex: 'price',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '仓房&货位',
		dataIndex: 'houseName',
		customRender: (text, record) => {
			return record.houseName + '&' + record.goodsAllocationName;
		}
	}
];

// 洗煤出煤信息表头
const washProduceCoalColumns = that => {
	return [
		{
			title: '出煤品名',
			dataIndex: 'coalType',
			customRender: (text, record) => {
				let coalType = record.coalType || '-';
				if (record.goodsName) {
					coalType = record.goodsName;
				}
				return coalType;
			}
		},
		{
			title: '出煤量(吨) ',
			dataIndex: 'coalQuantity',
			customRender: text => {
				if (text) {
					return text.toFixed(2);
				}
				return '-';
			}
		},
		{
			title: '出煤单价(元/吨) ',
			dataIndex: 'price',
			customRender: text => {
				if (text) {
					return text.toFixed(2);
				}
				return '-';
			}
		},
		{
			title: '仓房&货位',
			dataIndex: 'houseName',
			customRender: (text, record) => {
				return record.houseName + '&' + record.goodsAllocationName;
			}
		},
		{
			title: '洗煤回收率',
			dataIndex: 'coalRecovery',
			customRender: (text, row, index) => {
				let recovery = that.detailInfoNotEmpty.coalRecovery;
				let recoveryText = recovery ? `${recovery}%` : '-';
				if (recovery || recovery == 0) {
					recoveryText = `${recovery}%`;
				}
				return {
					children: recoveryText,
					attrs: {
						rowSpan: index == 0 ? that.detailInfoNotEmpty.extractionList.length : 0
					}
				};
			}
		},
		{
			title: '出煤总量(吨) ',
			dataIndex: 'coalTotalQuantity',
			customRender: (text, row, index) => {
				return {
					children: `${that.detailInfoNotEmpty.coalTotalQuantity || '-'}`,
					attrs: {
						rowSpan: index == 0 ? that.detailInfoNotEmpty.extractionList.length : 0
					}
				};
			}
		}
	];
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.new-table {
	margin-left: 32px;
	margin-top: 20px;
}
.coal-type-table-wrapper {
	.new-table {
		/deep/ .ant-table-fixed-right .ant-table-tbody > tr > td:nth-last-child(1) {
			border-left: 1px solid #e5e6eb;
		}
		/deep/ .ant-empty-normal {
			margin: 0;
		}
	}
}
.produce-coal-table-wrapper {
	.new-table {
		/deep/ .ant-table-tbody > tr:nth-child(2n) {
			background: #fff;
		}
		/deep/ .ant-table-tbody > tr:last-child td {
			border-bottom: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-tbody > tr:first-child td:nth-last-child(2),
		/deep/ .ant-table-tbody > tr:first-child td:nth-last-child(1) {
			border-bottom: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-fixed-right {
			.ant-table-tbody > tr:first-child td:nth-child(1) {
				border-bottom: 1px solid #e5e6eb;
			}
		}
		/deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
			background-color: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-body .ant-table-row-hover > td {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover {
			background: #fff !important;
		}

		/deep/.ant-table-fixed .ant-table-row-hover > td {
			background: #fff !important;
		}
	}
}
</style>

<style lang="less" scoped>
.coal-blending-info {
	.slFormDetail {
		padding: 0 0;
		.ant-row {
			.ant-col-8:nth-child(3n + 1) {
				display: flex;
				justify-content: left;
			}
			.ant-col-8:nth-child(3n + 2) {
				display: flex;
				justify-content: center;
			}
			.ant-col-8:nth-child(3n) {
				display: flex;
				justify-content: right;
			}
		}
		.ant-form-item {
			width: 364px;
		}
	}
	.step-wrapper {
		position: relative;
		padding: 13px 0 0;
		.step-title {
			line-height: 1;
			vertical-align: middle;
			.anticon {
				position: relative;
				top: 2px;
				z-index: 2;
				margin-right: 12px;
				vertical-align: middle;
				line-height: 20px;
			}
			span {
				font-size: 14px;
				font-family: 'PingFang SC';
				color: #00000066;
				font-weight: 400;
				vertical-align: middle;
			}
			.complete-text {
				line-height: 1;
				color: #000000cc;
				font-weight: 500;
				vertical-align: middle;
			}
		}
	}
	.step-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 9px;
		height: 46px;
		background: #e5e6eb;
		width: 1px;
		z-index: 0;
	}
	.add-icon {
		width: 12px;
		height: 12px;
		margin-right: 2px;
		margin-bottom: 2px;
	}
	.coal-type-table-wrapper {
		padding-bottom: 27px;
		margin-top: 20px;
		position: relative;
		.action-box {
			position: absolute;
			top: -47px;
			right: 0;
			display: flex;
			.action-btn {
				height: 32px;
				min-width: 62px;
				line-height: 32px;
				padding: 0 17px !important;
			}
		}
		.produce-coal-box {
			position: absolute;
			bottom: -25px;
			// top: 20px;
			right: 0;
			z-index: 1;
			// margin-top: 20px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 14px;
			color: #77889d;
			.tip-icon {
				width: 12px;
				height: 12px;
				margin-left: 4px;
			}
			/deep/ .ant-input-number {
				input {
					width: 110px;
					text-align: center;
				}
			}
		}
	}
	.coal-type-table-wrapper:before {
		content: '';
		position: absolute;
		top: -20px;
		left: 9px;
		bottom: 0;
		background: #e5e6eb;
		width: 1px;
		z-index: 0;
	}
}
</style>