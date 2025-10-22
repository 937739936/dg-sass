<template>
	<div>
		<a-descriptions
			bordered
			:column="3"
			size="middle"
		>
			<a-descriptions-item label="提货日期">
				{{ getDate() }}
			</a-descriptions-item>
			<a-descriptions-item label="提货数量">
				<span style="color: #F46332">{{ detailData.quantity | formatMoney(4) }}吨</span>
			</a-descriptions-item>
			<a-descriptions-item label="提货地点">
				{{ detailData.place || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="提货联系人">
				{{ detailData.contactName || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="提货人联系方式">
				{{ detailData.contactMode || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="提货联系人身份证号">
				{{ detailData.idNo || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="提货工具">
				{{ detailData.transTypeDesc || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="备注">
				{{ detailData.remark || '-' }}
			</a-descriptions-item>
		</a-descriptions>

		<div class="table-box">
			<a-table
				:columns="getColumns(detailData.transTypeDesc)"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="detailData.transInfoList || []"
				:pagination="false"
				:scroll="{ x: true }"
			>
			</a-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LadingInfoDetailView',
	props: {
		detailData: Object
	},
	data() {
		return {
			transColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '发站',
					dataIndex: 'deliveryStation'
				},
				{
					title: '到站',
					dataIndex: 'arriveStation'
				},
				{
					title: '收货人',
					dataIndex: 'receiverName'
				},
				{
					title: '托运人',
					dataIndex: 'shipperName'
				}
			],

			carColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
				}
			],

			shipColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '船舶MMSI',
					dataIndex: 'shipNo'
				},
				{
					title: '船舶名称',
					dataIndex: 'shipName'
				}
			]
		};
	},
	mounted() {},
	computed: {},
	watch: {},
	methods: {
		getDate() {
			if (this.detailData?.beginDate && this.detailData?.endDate) {
				return this.detailData.beginDate + ' 至 ' + this.detailData.endDate;
			}
			return '';
		},
		getColumns(type) {
			if (type == '火运') {
				return this.transColumns;
			} else if (type == '汽运') {
				return this.carColumns;
			} else if (type == '船运') {
				return this.shipColumns;
			} else {
				return [];
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0 !important;
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
</style>
