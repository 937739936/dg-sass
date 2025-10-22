<template>
	<a-modal
		width="1130px"
		:visible="visible"
		:footer="null"
		:title="null"
		centered
		@cancel="triggerVisible"
		destroyOnClose
	>
		<div class="title">
			<span
				v-for="item in onlineList"
				:key="item.text"
				:class="{ active: defaultParams.orderType == item.value }"
				@click="changeType(item.value)"
				>{{ item.text }}</span
			>
		</div>
		<div style="padding: 20px">
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				style="margin-bottom: 20px; margin-top: -20px"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
			></SlFormNew>
			<a-table
				class="new-table"
				:columns="columns"
				style="margin-bottom: 20px"
				:bordered="false"
				rowKey="serialNo"
				:rowSelection="rowSelection"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:loading="loading"
			>
				<span
					slot="Amount"
					slot-scope="text"
				>
					{{ text | formatMoney(2) }}
				</span>
				<template
					slot="zxq"
					slot-scope="text, record"
				>
					{{ record.deliveryDateBegin }}
					<span v-if="record.deliveryDateEnd"> ~{{ record.deliveryDateEnd }} </span>
				</template>
			</a-table>
			<i-pagination
				style="margin-bottom: 30px"
				:defaultPageSize="5"
				:pagination="pagination"
				:pageSizeOptions="['5', '10', '20', '30', '40', '50']"
				size="small"
				@change="getList"
			/>
			<div class="footer">
				<a-button
					type="primary"
					:loading="loading"
					@click="goApply"
				>
					确认
				</a-button>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_goodsTransferApplyList } from '@/v2/center/trade/api/goodsTransfer';
import { selectContractColumns } from '../columns/columns.js';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方企业',
		type: 'input',
		placeholder: '请输入买方企业'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人'
	}
];

const onlineList = [
	{
		text: '电子合同',
		value: 'ONLINE'
	},
	{
		text: '线下合同',
		value: 'OFFLINE'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineList,
			defaultParams: {
				orderType: 'ONLINE' //默认电子合同
			},
			searchList,
			columns: selectContractColumns,
			visible: false,
			pageSize: 5,
			url: {},
			selectedRowKeys: []
		};
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRows = [];
		}
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				columnWidth: 29,
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.serialNo];
				}
			};
		}
	},
	methods: {
		init() {
			this.url.list = API_goodsTransferApplyList;
			this.searchParams = {};
			this.getList(1);
			this.triggerVisible();
		},
		triggerVisible() {
			this.selectedRowKeys = [];
			this.visible = !this.visible;
		},
		// 修改合同类型
		changeType(val) {
			this.selectedRowKeys = [];
			this.defaultParams.orderType = val;
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.serialNo];
					}
				}
			};
		},
		goApply() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择合同信息');
				return;
			}
			let serialNo = this.selectedRowKeys[0];
			let serial = this.dataSource.find(item => {
				return item.serialNo == serialNo;
			});
			let { serialId, orderType } = serial;
			this.triggerVisible();
			this.$emit('ok', { serialId, orderType, serialNo });
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
	span {
		display: inline-block;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		margin-right: 30px;
		cursor: pointer;
		position: relative;
		&.active {
			font-weight: 500;
			&::after {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 2px;
				background: @primary-color;
				border-radius: 1px;
				content: '';
			}
		}
	}
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}

.footer {
	text-align: right;

	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
		height: 34px;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}
</style>
