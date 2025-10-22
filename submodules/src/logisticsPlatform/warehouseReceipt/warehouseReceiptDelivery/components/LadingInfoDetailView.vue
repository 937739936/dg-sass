<template>
	<div>
		<div class="infoView">
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="提货日期">
					<span>{{ getDate() }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货数量">
					<span>{{ quantityText() }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货地点">
					<span>{{ detailData.place || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货联系人">
					<span>{{ detailData.contactName || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货人联系方式">
					<span>{{ detailData.contactMode || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货联系人身份证号">
					<span>{{ detailData.idNo || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="提货工具">
					<span>{{ detailData.transTypeDesc || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="备注信息">
					<span v-if="detailData.remark">
						<TextOverFlow
							:content="detailData.remark"
							:maxWidth="infoMaxWidth"
						/>
					</span>
					<span v-else>-</span>
				</a-descriptions-item>
			</a-descriptions>
		</div>

		<div class="table-box">
			<a-table
				:columns="getColumns(this.detailData.transTypeDesc)"
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
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { formatMoney } from '@sub/filters';

export default {
	components: { TextOverFlow },
	props: {
		detailData: Object
	},
	data() {
		return {
			infoMaxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸

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
	watch: {
		clientWidth: {
			handler: function () {
				this.getInfoMaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		formatMoney,
		getDate() {
			if (this.detailData?.beginDate) {
				return (this.detailData.beginDate || '') + ' 至 ' + (this.detailData.endDate || '');
			}
			return '-';
		},
		quantityText() {
			let quantity = formatMoney(this.detailData.quantity, 4);
			return `${quantity}` + '吨';
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
		},
		getInfoMaxWidth() {
			if (this.clientWidth < 1600) {
				this.infoMaxWidth = 215;
			} else if (this.clientWidth < 1920) {
				this.infoMaxWidth = 280;
			} else if (this.clientWidth < 2160) {
				this.infoMaxWidth = 365;
			} else if (this.clientWidth < 3000) {
				this.infoMaxWidth = 440;
			} else {
				this.infoMaxWidth = 720;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>

<style lang="less" scoped>
.infoView {
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
			white-space: nowrap;
		}
		.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
			padding-left: 12px;
			padding-right: 12px;
			// width: inherit;
			width: 22%;
		}
	}

	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}

	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	.textOverflow {
		position: relative;
		top: 2px;
		left: 0;
	}
}
</style>
