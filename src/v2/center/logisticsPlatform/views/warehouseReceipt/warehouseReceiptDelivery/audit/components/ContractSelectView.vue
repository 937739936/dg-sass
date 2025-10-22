<template>
	<div class="business-line">
		<a-alert
			class="a-alert"
			type="info"
		>
			<template slot="message">
				<div class="alert-wrapper">
					<div class="alert-icon">
						<img
							src="@/assets/imgs/warning/warning.png"
							style="width: 16px; height: 16px"
							alt=""
						/>
					</div>
					<span
						class="alert-message"
						v-html="`下表展示当前销售合同关联业务线所对应的采购合同`"
					></span>
				</div>
			</template>
		</a-alert>
		<a-table
			class="new-table"
			:bordered="false"
			:columns="columns"
			:rowKey="record => record.businessLineNo"
			:dataSource="dataSource"
			:pagination="false"
			:scroll="{ y: dataSource.length > 5 ? 210 : false }"
			:customRow="onClickRow"
			:rowSelection="action == 'view' ? null : { type: 'radio', onChange: onSelected, selectedRowKeys: selectedRowKeys }"
		>
			<template
				slot="contractNo"
				slot-scope="text, record"
			>
				<a
					@click="viewContractDetail(record)"
					v-if="isCoreCompany"
					>{{ text }}</a
				>
				<span v-else>{{ text }}</span>
			</template>
		</a-table>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
const columns = [
	{
		title: '采购合同编号',
		key: 'buyerContractNo',
		dataIndex: 'buyerContractNo',
		width: 200,
		scopedSlots: { customRender: 'contractNo' }
	},
	{
		title: '卖方企业名称',
		key: 'sellerName',
		dataIndex: 'sellerName'
	},
	{
		title: '关联业务线名称',
		key: 'businessLineName',
		dataIndex: 'businessLineName'
	},
	{
		title: '业务线号',
		key: 'businessLineNo',
		dataIndex: 'businessLineNo'
	}
];
export default {
	props: ['type', 'action'],
	data() {
		return {
			columns,
			tableLoading: false,
			dataSource: [],
			selectedRowKeys: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.company?.companyType == 'CORE_COMPANY';
		}
	},
	created() {},
	mounted() {},
	methods: {
		setData(list) {
			this.dataSource = list || [];
			if (this.dataSource.length == 1) {
				this.selectedRowKeys = this.dataSource.map(item => item.businessLineNo);
				this.change();
			}
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.businessLineNo];
						this.change();
						// this.$forceUpdate();
					}
				}
			};
		},
		onSelected(key, selectedRows) {
			this.selectedRowKeys = selectedRows.map(item => item.businessLineNo);
			this.change();
		},
		change() {
			this.$emit(
				'change',
				this.selectedRowKeys[0],
				this.dataSource.find(item => item.businessLineNo == this.selectedRowKeys[0])
			);
		},
		viewContractDetail(record) {
			this.$emit('viewContractDetail', record);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.business-line {
	.new-table {
		margin-top: 20px !important;
		::v-deep {
			.ant-table-row {
				cursor: pointer;
			}
		}
	}
}
.a-alert {
	display: inline-block;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid #d0dfff;
	border-radius: 4px;
	width: 100%;
	// margin-bottom: 24px;
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
</style>
