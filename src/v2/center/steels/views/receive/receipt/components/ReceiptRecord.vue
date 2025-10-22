<template>
	<a-modal
		centered
		title="请选择要撤销的收货记录"
		:visible="visible"
		width="800px"
		@ok="save()"
		@cancel="() => (visible = false)"
	>
		<a-table
			:rowSelection="rowSelection"
			:columns="columns"
			:rowKey="record => record.id"
			:dataSource="resultList"
			:pagination="false"
			:loading="loading"
			:scroll="{ x: true }"
		>
			<span
				slot="downstreamCompanyAbbr"
				slot-scope="downstreamCompanyAbbr"
			>
				{{ downstreamCompanyAbbr || '-' }}
			</span>
			<span
				slot="deliveryDateEnd"
				slot-scope="deliveryType, items"
			>
				<p v-if="items.effectiveEndDate">{{ items.effectiveStartDate }}～{{ items.effectiveEndDate }}</p>
			</span>
		</a-table>
	</a-modal>
</template>
<script>
import { API_SteelsReceiveCancelShipment, API_SteelsReceiveFindAllReceiveRecords } from '@/v2/center/steels/api/receive.js';
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
const columns = [
	{
		title: '收货编号',
		dataIndex: 'receiptNo',
		width: 135
	},
	{
		title: '收货日期',
		dataIndex: 'receiptDate',
		width: 135
	},
	{
		title: '收货数量（吨）',
		dataIndex: 'receiptQuantity',
		width: 150
	}
];
export default {
	name: 'ReceiptRecord',
	data() {
		return {
			colSpan,
			formLayout,
			steelType: '',
			currentStep: 0,
			visible: false,
			steps: [{ title: '选择待收货的发货申请' }, { title: '填写收货信息' }, { title: '完成' }],
			columns,
			resultList: [],
			// pagination:{},
			loading: false,
			selectedRowKeys: [],
			params: {
				contractNo: '',
				sellCompanyName: '',
				quantityLower: null,
				quantityUpper: null,
				downstreamCompanyAbbr: ''
			},
			contractTemplate: '',
			pagination: {
				type: 'SteelsReceiveConfirmList',
				total: 0, // 总条数
				pageNo: 1
			},
			deliverId: ''
		};
	},
	components: {
		iPagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys: selectedRowKeys,
				onChange: record => {
					this.selectedRowKeys = record;
				}
			};
		}
	},
	methods: {
		save() {
			API_SteelsReceiveCancelShipment({ idList: this.selectedRowKeys }).then(res => {
				if (res.success && res.data) {
					this.visible = false;
					this.$message.success('撤销成功');
					this.$emit('change');
				}
			});
		},
		showModal(id) {
			this.visible = true;
			this.selectedRowKeys = [];
			this.resultList = [];
			this.getList(id);
		},
		next() {
			if (this.deliverId == '') {
				this.$message.error('请先选择一条行数据');
			} else {
				this.$router.push({
					path: '/center/steels/receive/receipt/receiveApply',
					query: {
						deliverId: this.deliverId,
						flag: 'add',
						steelType: this.steelType
					}
				});
			}
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.deliverId = record.id;
						this.steelType = record.steelType;
					}
				}
			};
		},
		getList(id) {
			API_SteelsReceiveFindAllReceiveRecords(id).then(res => {
				if (res.success) {
					this.resultList = res.data;
				}
			});
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.params = {
				contractNo: '',
				sellCompanyName: '',
				quantityLower: null,
				quantityUpper: null,
				downstreamCompanyAbbr: ''
			};
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>
