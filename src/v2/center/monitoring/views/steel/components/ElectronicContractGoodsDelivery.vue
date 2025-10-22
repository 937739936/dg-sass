<template>
	<div>
		<a-tabs default-active-key="1">
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
								<a @click="jumpPage('/center/steels/goodsTransfer/goodsTransferApplyDetail', record)">查看</a>
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
			<a-tab-pane
				key="0"
				tab="提货申请"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="tiApplyColumns"
						:data-source="tiApplyList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpPage('/center/take/goods/step', record)">查看</a>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="2"
				tab="提单"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="tiColumns"
						:data-source="tiList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpPage('/center/take/order/step', { ...record, id: record.serialNo })">查看</a>
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
			<a-tab-pane
				key="3"
				tab="放货通知单"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="letColumns"
						:data-source="letterNoticeList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpPage2('/center/steels/goodsTransfer/letterNotice/detail', { id: record.id })">查看</a>
								<a
									v-if="record.pdfPath"
									@click="downFile2(record.pdfPath)"
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
import { API_DOWNLPREVIEWTE } from '@/api';
import comDownload from '@sub/utils/comDownload.js';
const tiApplyColumns = [
	{ title: '提货申请单号', dataIndex: 'serialNo' },
	{ title: '申请提货企业', dataIndex: 'buyCompanyName' },
	{ title: '申请提货总数量(吨)', dataIndex: 'quantityTotal' },
	{ title: '钢材种类', dataIndex: 'steelType' },
	{ title: '提货方式', dataIndex: 'takeType' },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 150 }
];
const tiColumns = [
	{ title: '提货单号', dataIndex: 'serialNo' },
	{ title: '提单开具时间', dataIndex: 'issueDate' },
	{ title: '提货数量(吨)', dataIndex: 'quantityTotal' },
	{ title: '制单员', dataIndex: 'makePaperName' },
	{ title: '提单有效期', dataIndex: 'takeStartDate', customRender: (v, r) => r.takeStartDate + '-' + r.takeEndDate },
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
// 放货通知单
const letColumns = [
	{
		title: '放货单号',
		dataIndex: 'releaseNo'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		key: 'statusDesc'
	},
	{
		title: '卖方企业名称',
		dataIndex: 'sellCompanyName'
	},
	{
		title: '买方企业名称',
		dataIndex: 'buyCompanyName'
	},
	{
		title: '放货数量(吨)',
		dataIndex: 'quantity'
	},
	{
		title: '放货通知单开具时间',
		dataIndex: 'createdDate'
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: {
			customRender: 'action'
		},
		fixed: 'right'
	}
];
export default {
	name: 'ElectronicContractGoodsDelivery',
	props: ['contractData', 'handleType'],
	data() {
		return {
			goodsTransferColumns,
			tiApplyColumns,
			tiColumns,
			letColumns,
			tiList: [],
			statisticsShipment: {},
			goodsTransfer: {},
			tiApplyList: [],
			goodsTransferList: [],
			// 放货通知单
			letterNoticeList: []
		};
	},
	watch: {
		contractData: {
			handler(data) {
				this.statisticsShipment = data.statisticsShipment;
				this.tiApplyList = data.takeDeliveryApplyList;
				this.tiList = data.takeDeliveryList;
				this.goodsTransfer = data.goodsTransfer || {};
				this.goodsTransferList = this.goodsTransfer.goodsTransferList || [];
				this.letterNoticeList = data.transferReleaseList || [];
			},
			deep: true,
			immediate: true
		}
	},
	created() {},
	methods: {
		jumpPage(path, query) {
			const { href } = this.$router.resolve({
				path,
				query: {
					serialNo: query.serialNo,
					contractId: this.contractData.contractId,
					contractNo: this.contractData.contractNo,
					id: query.id,
					type: 'preview',
					status: '7'
				}
			});
			window.open(href);
		},
		jumpPage2(path, query) {
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
		},
		downFile2(url) {
			API_DOWNLPREVIEWTE(`/${url}`).then(res => {
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
