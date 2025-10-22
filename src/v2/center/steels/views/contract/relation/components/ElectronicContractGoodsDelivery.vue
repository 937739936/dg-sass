<template>
	<div>
		<a-tabs default-active-key="1">
			<a-tab-pane
				key="0"
				tab="收发货信息"
				v-if="handleType == 1"
			>
				<div style="width: 100%">
					<!-- <p class="mb8" v-if="deliveryData.remark">
            注：此收发货信息为饮用
          </p> -->
					<div class="mb8">
						<span class="mr16">合同数量：{{ statisticsShipment.contractQuantity }}</span>
						<span class="mr16">已发货：{{ statisticsShipment.shippedQuantity }}吨</span>
						<span class="mr16">已收货：{{ statisticsShipment.receivedQuantity }}吨</span>
						<span class="mr16">待收货：{{ statisticsShipment.scheduledQuantity }}吨</span>
					</div>
					<a-table
						:pagination="false"
						:columns="deliveryColumns"
						:data-source="shipmentList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a
									v-if="record.status === 'RECEIVED'"
									@click="
										jumpPage('/center/steels/receive/receipt/detail', {
											deliverId: record.id
										})
									"
									>查看</a
								>
								<a
									v-if="record.status === 'SHIPPED'"
									@click="
										jumpPage('/center/steels/receive/deliver/detail', {
											deliverId: record.id
										})
									"
									>查看</a
								>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="货转"
			>
				<div style="width: 100%">
					<div class="mb8">
						<span class="mr16">货转次数：{{ goodsTransfer.count }}</span>
						<span class="mr16">货转总数量：{{ goodsTransfer.quantitySum }}吨</span>
						<!-- <span class="mr16">货转次数：{{ goodsTransferList.length }}</span>
            <span>货转总数量：{{ goodsTransferStatistics.goodsTransferQuantity }}吨</span> -->
					</div>
					<a-table
						:pagination="false"
						:columns="goodsTransferColumns"
						:data-source="goodsTransferList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpPage('/center/steels/goodsTransfer/goodsTransferApplyDetail', { id: record.id })">查看</a>
								<a
									v-if="record.pdfPath"
									@click="downFile(record.pdfPath)"
									>下载</a
								>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
import { API_DOWNLPREVIEWTE } from '@/v2/api';
import comDownload from '@sub/utils/comDownload.js';

const deliveryColumns = [
	{ title: '批次号', dataIndex: 'shipmentNo' },
	{ title: '发货日期', dataIndex: 'shipmentDate' },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{ title: '发货数量(吨)', dataIndex: 'quantity' },
	{ title: '收货数量(吨)', dataIndex: 'receiptQuantity' },
	{ title: '状态', dataIndex: 'statusDesc' },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 150 }
];
const goodsTransferColumns = [
	{
		title: '货转编号',
		dataIndex: 'transferNo',
		key: 'no'
	},
	{
		title: '货转开具时间',
		dataIndex: 'transferProcessTime',
		key: 'signTime'
	},
	{
		title: '货转数量(吨)',
		dataIndex: 'transferQuantity',
		key: 'goodsTransferQuantity',
		align: 'center'
	},
	{
		title: '钢材种类',
		dataIndex: 'steelType'
	},
	{
		title: '运输方式',
		dataIndex: 'transportMode',
		key: 'transportModeDesc'
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'ElectronicContractGoodsDelivery',
	props: ['contractData', 'handleType'],
	data() {
		return {
			goodsTransferColumns,
			deliveryColumns,
			statisticsShipment: {},
			goodsTransfer: {},
			shipmentList: [],
			goodsTransferList: []
		};
	},
	watch: {
		contractData: function (data) {
			this.statisticsShipment = data.statisticsShipment;
			this.shipmentList = data.statisticsShipment.shipmentList;
			this.goodsTransfer = data.goodsTransfer;
			this.goodsTransferList = data.goodsTransfer.goodsTransferList;
		}
	},
	created() {
		this.statisticsShipment = this.contractData.statisticsShipment ? this.contractData.statisticsShipment : {};
		this.shipmentList = this.contractData.statisticsShipment ? this.contractData.statisticsShipment.shipmentList : [];

		this.goodsTransfer = this.contractData.goodsTransfer ? this.contractData.goodsTransfer : {};
		this.goodsTransferList = this.contractData.goodsTransfer ? this.contractData.goodsTransfer.goodsTransferList : [];
	},
	methods: {
		jumpPage(path, query) {
			const { href } = this.$router.resolve({
				path,
				query
			});
			window.open(href);
		},
		downFile(url) {
			API_DOWNLPREVIEWTE(`${url}`).then(res => {
				comDownload(res, url);
			});
		}
	}
};
</script>
<style scoped>
.tab-title {
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding-bottom: 6px;
}
</style>
