<template>
	<div style="width: 100%">
		<template v-if="isShowInfo">
			<div
				class="slTitleAssis"
				style="margin-bottom: 30px"
			>
				协议信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="协议期限"
					>{{ detailData.effectiveStartDate }} 至 {{ detailData.effectiveEndDate }}</a-descriptions-item
				>
				<a-descriptions-item label="签订日期">{{ detailData.signDate }} </a-descriptions-item>
				<a-descriptions-item label="签章状态">
					<span class="status">{{ detailData.signStatusText }}</span>
				</a-descriptions-item>

				<a-descriptions-item label="仓储合同编号">
					{{ detailData.stationLeaseContractNo }}
				</a-descriptions-item>
				<a-descriptions-item label="存储时间"
					>{{ detailData.effectiveStartDate }} 至 {{ detailData.effectiveEndDate }}
				</a-descriptions-item>
				<a-descriptions-item label="仓储地址">{{ detailData.storageCompanyAddress }}</a-descriptions-item>
			</a-descriptions>
		</template>

		<!-- 电子协议附件 -->
		<div class="file-box">
			<div class="slTitleAssis">附件信息</div>
		</div>
		<a-row v-if="detailData.type == 'ONLINE'">
			<a-table
				rowKey="name"
				class="new-table"
				:columns="fileColumns"
				:dataSource="detailData.attachments"
				:pagination="false"
				:scroll='{x:true}'
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<a
							href="javascript:;"
							@click="viewPDF(record)"
							>查看</a
						>
						<a
							href="javascript:;"
							style="margin-left: 24px"
							@click="downPDF(record)"
							>下载</a
						>
					</a-space>
				</div>
			</a-table>
		</a-row>
		<!-- 补充协议附件 -->
		<div
			class="table-box"
			v-if="detailData.type == 'OFFLINE'"
		>
			<a-table
				:columns="suppleFileColumns"
				class="new-table new-table2"
				:bordered="false"
				rowKey="no"
				:scroll='{x:true}'
				:dataSource="suppleFileList"
				:pagination="false"
			>
				<template
					slot="name"
					slot-scope="text, items"
				>
				<span
						v-for="(item, i) in items.fileList"
						:key="i"
						class="name detail"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.createdDate || item.uploadTime}}</span>
							</template>
							<a
								href="javascript:;"
								style="margin-right:5px"
								@click="viewPDF(item)"
								>{{ item.name }}</a
							>
						</a-tooltip>
					</span>
					<!-- <a-tooltip>
						<template
							slot="title"
							v-if="items.createdDate"
						>
							上传时间：{{ items.createdDate }}
						</template>
						<a
							href="javascript:;"
							@click="viewPDF(items)"
							>{{ items.name }}</a
						>
					</a-tooltip> -->
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						@click="downSupplePDF(items)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
const fileColumns = [
	{
		title: '文件类型',
		dataIndex: 'attachmentTypeText'
	},
	{
		title: '文件名称',
		dataIndex: 'name'
	},
	{
		title: '文件编号',
		dataIndex: 'no'
	},
	{
		title: '签订日期',
		dataIndex: 'signDate'
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 160,
		fixed: 'right',
	}
];
// 和运输合同
const suppleFileColumns = [
	{ title: '文件类型', dataIndex: 'attachmentTypeText', width: '20%' },
	{ title: '文件名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
export default {
	props: {
		detailData: {
			default: () => {
				return { feeList: [], contractList: [] };
			}
		},
		operatorInfo: {
			default: () => {
				return {};
			}
		},
		type: {
			default: 'rest'
		},
		isShowInfo: {
			default: true,
		}
	},
	components: {},

	computed: {
		// 补充协议的附件
		suppleFileList() {
			const obj = {};
			const list = this.detailData.attachments || [];
			list.forEach(el => {
				if (!obj[el.attachmentType]) {
					obj[el.attachmentType] = { fileList: [], attachmentTypeText: el.attachmentTypeText, typeName: el.typeName, name: el.name };
				}
				obj[el.attachmentType].fileList.push(el);
			});
			const contractList = [];
			for (let k in obj) {
				contractList.push(obj[k]);
			}
			return contractList;
		}
	},
	data() {
		return {
			fileColumns,
			suppleFileColumns
		};
	},

	methods: {
		downPDF(item) {
			this.$emit('download', item);
		},
		downSupplePDF(item) {
			this.$emit('downSupplePDF', item);
		},
		viewPDF(item) {
			this.$emit('viewPDF', item);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
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
		width: 19%;
	}
}
.trade {
	/deep/ .ant-descriptions-item-content {
		width: 40%;
	}
}
.bank-account-box {
	margin-top: 10px;
	::v-deep.ant-row-flex {
		flex-wrap: nowrap !important;
	}
	::v-deep.textOverflow {
		left: 0;
	}
	.bank-account-item {
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		border-radius: 6px;
		margin-right: 50px;
		line-height: 24px;
		width: 350px;
		.bank-account-title {
			margin-bottom: 10px;
			line-height: 22px;
		}
		.bank-account-icon {
			width: 30px;
			height: 22px;
			vertical-align: top;
		}
		::v-deep.ant-col {
			.label {
				color: rgba(0, 0, 0, 0.4);
			}
		}
		.title {
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #77889d;
			margin-left: 10px;
		}
	}
	.bank-account-item.first {
		background: #f0f8ff;
	}
	.bank-account-item.second {
		background: #fff9e9;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	// margin-left: 4px;
	background: #F1FCFA;
	color: #43C0A2;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.new-table {
	/deep/ tbody {
		tr td:last-child {
			border-left: 1px solid #e5e6eb;
		}
	}
}
.cost-table {
	/deep/ .ant-table-thead {
		tr th {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb;
		}
		tr th:first-child {
			background: #f3f5f6;
			border-left: 0;
		}
	}
	/deep/ tbody {
		tr td {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb !important;
		}
		tr td:first-child {
			border-left: 0;
			background: #f3f5f6;
		}
		tr:last-child td {
			// border-bottom: 0 !important;
		}
		tr:nth-child(2n) {
			background: #fff !important;
		}
	}
}
.file-box {
	display: flex;
	margin-bottom: 20px;
	margin-top: 30px;
	align-items: center;
	.slTitleAssis {
		margin-top: 0;
		margin-right: 20px;
	}
	.btn {
		height: 28px;
		width: 88px;
	}
}
.new-table2 {
	::v-deep .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	::v-deep .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	::v-deep .ant-table-tbody > tr > td {
		border-right: 1px solid #e5e6eb;
	}
	::v-deep .ant-table-tbody > tr > td:nth-child(2) {
		border-right: 0;
	}
	::v-deep .ant-table-tbody > tr > :last-child {
		border-right: 0;
	}
}
</style>
