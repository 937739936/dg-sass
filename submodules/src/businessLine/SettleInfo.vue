<template>
	<div class="settle-info">
		<a-button
			type="primary"
			v-if="isAddAuth && !isBank && type == 'rest'"
			ghost
			class="slBtn"
			@click="addSettle"
		>
			{{ contractType == 'trans' ? '新增运输结算单' : '新增线下结算单' }}
		</a-button>
		<!-- 结算单信息 -->
		<div class="table-box">
			<a-table
				:columns="settleColumns"
				class="new-table"
				:bordered="false"
				rowKey="no"
				:scroll="{ x: 400 }"
				:dataSource="list"
				:pagination="false"
			>
				<template
					slot="status"
					slot-scope="text, items"
				>
					<!-- 状态 -->
					<span
						class="status"
						:class="`status-${items.status}`"
						>{{ items.statusName }}</span
					>
				</template>
				<template
					slot="attachmentList"
					slot-scope="text, items"
				>
					<!-- 状态 -->
					<template v-if="text && text.length">
						<template v-if="items.attachmentList.length == 1">
							<a
								href="javascript:;"
								@click="handlePreview(items.attachmentList[0])"
								>{{ items.attachmentList[0].fileName }}</a
							>
						</template>
						<a-tooltip v-else>
							<template slot="title">
								<p
									class="curp"
									href="javascript:;"
									:key="index"
									v-for="(fileItem, index) in items.attachmentList"
								>
									<a
										class="cff"
										href="javascript:;"
										v-if="!isOffice(fileItem)"
										@click="handlePreview(fileItem)"
										>{{ fileItem.fileName }}</a
									>
									<a
										class="cff"
										v-else
										:href="fileItem.fileUrl"
										:download="fileItem.fileName"
										>{{ fileItem.fileName }}</a
									>
								</p>
							</template>
							<a
								href="javascript:;"
								v-if="!isOffice(items.attachmentList[0])"
								@click="handlePreview(items.attachmentList[0])"
								>{{ items.attachmentList[0].fileName }}</a
							>
							<a
								:href="items.attachmentList[0].fileUrl"
								v-else
								:download="items.attachmentList[0].fileName"
								>{{ items.attachmentList[0].fileName }}</a
							>
						</a-tooltip>
					</template>
				</template>

				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						style="margin-right: 20px"
						v-if="type == 'rest' && !isBank"
						@click="goSettleDetail(items)"
						>详情</a
					>

					<a
						href="javascript:;"
						style="margin-right: 20px"
						v-if="type == 'admin'"
						@click="goAdminSettleDetail(items)"
						>详情</a
					>

					<a
						href="javascript:;"
						@click="downloadSettleFile(items)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
// colums
const columns = [
	{ title: '结算单编号', dataIndex: 'serialNo', width: 250 },
	{ title: '结算日期', dataIndex: 'confirmTime', width: 150 },
	{ title: '结算金额(元)', dataIndex: 'settleAmount', width: 150, customRender: t => formatMoney(t) },
	{ title: '结算单价(元/吨)', dataIndex: 'settleUnitPrice', width: 150, customRender: t => formatMoney(t) },
	{ title: '结算数量(吨)', dataIndex: 'settleQuantity', width: 150, customRender: t => formatMoney(t) },
	{ title: '运输方式', dataIndex: 'transTypeDesc', width: 150 },
	{ title: '结算状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
	{ title: '结算附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' }, width: 200 },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 130, fixed: 'right' }
];

export default {
	props: {
		// 结算单信息
		settleApi: {},
		contractType: {
			default: 'buy'
		},
		contractInfo: {
			default: () => {
				return {};
			}
		},
		// 金融机构
		isBank: {
			default: false
		},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			list: []
		};
	},
	computed: {
		isAddAuth() {
			// 完结审批中”、“已完结
			if (this.contractType == 'trans') {
				return true;
			}
			if (this.contractType != 'trans') {
				return !['COMPLETED_AUDITING', 'COMPLETED'].includes(this.contractInfo.status) && this.contractInfo.paperContractNo;
			}
			return false;
		},
		settleColumns() {
			if (this.contractType == 'trans') {
				return [
					{ title: '结算单编号', dataIndex: 'serialNo', width: 250 },
					{ title: '结算日期', dataIndex: 'confirmTime', width: 150 },
					{ title: '结算金额(元)', dataIndex: 'settleAmount', width: 150, customRender: t => formatMoney(t) },
					{ title: '结算数量(吨)', dataIndex: 'settleQuantity', width: 150, customRender: t => formatMoney(t) },
					{ title: '运输方式', dataIndex: 'transTypeDesc', width: 150 },
					{ title: '结算状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
					{ title: '结算附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' }, width: 200 },
					{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 130, fixed: 'right' }
				];
			}
			return columns;
		}
	},
	mounted() {
		this.getList();
	},
	methods: {
		async getList() {
			const params = {
				businessLineNo: this.$route.query.businessLineNo,
				...this.$route.query
			};

			const res = await this.settleApi(params);
			this.list = res.data || [];
		},
		// 结算详情
		goSettleDetail(item) {
			let path;
			let query = {};
			if (item.dataType == 'ONLINE') {
				path = `/center/settle/${this.contractType}/onlinedetail`;
				query.id = item.id;
			} else {
				query.id = item.id;
				path = `/center/settle/${this.contractType}/offlinedetail`;
			}

			if (this.contractType == 'trans') {
				query.statementId = item.id;
				path = `/center/settle/transport/detail`;
			}

			const routeData = this.$router.resolve({
				path,
				query
			});

			window.open(routeData.href, '_blank');
		},
		// admin 结算详情
		goAdminSettleDetail(item) {
			let path;
			if (item.dataType == 'ONLINE') {
				path = `/sys/statement/electronic/detail?id=${item.id}`;
			} else {
				path = `/sys/statement/offline/detail?id=${item.id}`;
			}
			if (this.contractType == 'trans') {
				path = `/sys/statement/trans/detail?id=${item.id}`;
			}
			window.open(path, '_blank');
		},
		handlePreview(item) {
			this.$emit('handlePreview', item.fileUrl, item);
		},
		downloadSettleFile(item) {
			this.$emit('downloadSettleFile', item, this.contractType);
		},
		// 新增结算单
		addSettle() {
			let path = `/center/settle/${this.contractType}/offlineadd?contractNo=${this.contractInfo.orderNo}`;
			if (this.contractType == 'trans') {
				path = `/center/settle/transport/add?contractId=${this.contractInfo.id}`;
			}
			this.$router.push({
				path
			});
			// window.open(path, '_blank')
		},
		// 判断当前否是office
		isOffice(item) {
			const arr = ['xls', 'xlsx', 'doc', 'docx'];
			const fileFormat = item.fileUrl.split('?')[0].split('.').pop().toLowerCase();
			return arr.includes(fileFormat);
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.settle-info {
	margin-top: 30px;
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
	}
}
//待确认
.status-WAI_CONFIRM {
	background: #c9daff;
	color: #596fa0;
}
//已签约
.status-EFFECTIVE {
	background: #c5ecdd;
	color: #3eb384;
}
//驳回
.status-REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
.curp {
	cursor: pointer;
	margin-bottom: 10px;
}
.cff {
	color: #fff;
}
</style>
