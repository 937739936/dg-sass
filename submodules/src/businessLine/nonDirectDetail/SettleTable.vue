<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template
					slot="status"
					slot-scope="text, items"
				>
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
					<a-space :size="20">
						<a
							v-if="platformType === 'ADMIN'"
							href="javascript:;"
							@click="goSettleDetail(items)"
							>详情</a
						>
						<a
							href="javascript:;"
							@click="downloadSettleFile(items)"
							>下载</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
export default {
	name: 'SettleTable',
	inject: ['platformType'],
	props: {
		title: {
			type: String,
			default: ''
		},
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	components: {},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	computed: {},
	methods: {
		// 跳转到结算详情页
		goSettleDetail(item) {
			let path;
			if (item.dataType == 'ONLINE') {
				path = `/sys/statement/electronic/detail?id=${item.id}`;
			} else {
				path = `/sys/statement/offline/detail?id=${item.id}`;
			}
			window.open(path, '_blank');
		},
		// 下载结算文件
		downloadSettleFile(item) {
			this.$emit('downloadSettleFile', item);
		},
		handlePreview(item) {
			this.$emit('handlePreview', item.fileUrl, item);
		},
		// 判断当前否是office
		isOffice(item) {
			const arr = ['xls', 'xlsx', 'doc', 'docx'];
			const fileFormat = item.fileUrl.split('?')[0].split('.').pop().toLowerCase();
			return arr.includes(fileFormat);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';

// colums
const columns = [
	{ title: '结算单编号', dataIndex: 'serialNo', customRender },
	{ title: '结算日期', dataIndex: 'confirmTime', customRender },
	{ title: '结算金额(元)', dataIndex: 'settleAmount', customRender: t => formatMoney(t) },
	{ title: '结算单价(元/吨)', dataIndex: 'settleUnitPrice', customRender: t => formatMoney(t) },
	{ title: '结算数量(吨)', dataIndex: 'settleQuantity', customRender: t => formatMoney(t) },
	{ title: '运输方式', dataIndex: 'transTypeDesc', customRender },
	{ title: '结算状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
	{ title: '结算附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
			// text-overflow: ellipsis;
			// overflow: hidden;
		}
	}
	.table-box {
		margin-top: 0px;
	}
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
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
}
</style>
