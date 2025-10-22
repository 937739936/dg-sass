<template>
	<a-modal
		title="累计出库记录"
		width="1000px"
		destroyOnClose
		v-model="visible"
	>
		<template slot="footer">
			<a-button @click="handleCancel">关闭</a-button>
		</template>
		<div class="content">
			<a-table
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="attach"
					slot-scope="text"
				>
					<span
						class="g"
						v-if="text"
						>有</span
					>
					<span
						class="r"
						v-else
						>无</span
					>
				</template>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a
						style="margin-right: 10px"
						@click="jumpPage(record.id)"
						>查看</a
					>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</a-modal>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { API_OutWarehouseReceiptSelectGoodsOutPageByDeliveryNum } from '@/v2/center/storage/api';
import moment from 'moment';

const columns = [
	{
		title: '出库流水号',
		dataIndex: 'serialNumber'
	},
	{
		title: '出库时间',
		dataIndex: 'storageTime'
	},
	{
		title: '商品名称',
		dataIndex: 'grainName'
	},
	{
		title: '商品等级',
		dataIndex: 'grainLevel'
	},
	{
		title: '商品数量(KG)',
		dataIndex: 'clearingWeight'
	},
	{
		title: '库点',
		dataIndex: 'depotPoint'
	},
	{
		title: '仓房',
		dataIndex: 'storehouse'
	},
	{
		title: '权属企业',
		dataIndex: 'coreCompany'
	},
	{
		title: '有无附件',
		dataIndex: 'attach',
		width: 100,
		scopedSlots: { customRender: 'attach' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 120,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'outRecord',

	components: {
		iPagination
	},

	data() {
		return {
			moment,
			columns,
			dataSource: [],
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			visible: false,
			form: this.$form.createForm(this),
			deliveryNum: ''
		};
	},
	methods: {
		showModal(deliveryNum) {
			this.visible = true;
			this.deliveryNum = deliveryNum;
			this.getList();
		},

		handleCancel() {
			this.visible = false;
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			const params = {
				pageNo: pageNo,
				pageSize: pageSize,
				deliveryNum: this.deliveryNum
			};
			API_OutWarehouseReceiptSelectGoodsOutPageByDeliveryNum(params).then(res => {
				if (res.success) {
					this.dataSource = res.data.list;
					this.pagination.total = res.data.total;
				}
			});
		},
		jumpPage(id) {
			this.$router.push({
				path: `/center/storageCenter/out/detail`,
				query: {
					id
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.content {
	max-height: 500px;
	overflow: auto;
}
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
</style>
