<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="typeName"
				:dataSource="filetypeDataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
			<template
					slot="typeName"
					slot-scope="text, record"
				>
					<div class="type-name-column">
						<div class="type-name">
							<div class="required-mark">{{ record.isRequired ? '*' : '' }}</div>
							<span class="type-name-text"> {{ text }}</span>
						</div>
						<!-- 预留上传按钮-->
					</div>
				</template>
				<template
					slot="fileList"
					slot-scope="name, record"
				>
					<div class="file-names-column">
						<div
							v-for="(item, index) in record.fileList"
							:key="index"
							class="file-name"
						>
							<a-tooltip>
								<template
									v-if="item.uploadTime"
									slot="title"
								>
									上传时间：{{ item.uploadTime }}
								</template>
								<span @click="filePreview(item)">{{ item.fileName }}</span>
							</a-tooltip>
						</div>
					</div>
				</template>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						class="download-Btn"
						@click="downloadAttachmentFile(record)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OffLineAttachmentTable',
	props: {
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
	computed: {
		filetypeDataSource() {
			let groupedByType = this.dataSource.reduce((acc, item) => {
				// 如果acc中没有该type的key，则初始化为一个空数组
				acc[item.type] = acc[item.type] || [];
				// 将当前item添加到对应type的数组中
				acc[item.type].push(item);
				// 返回累加器对象
				return acc;
			}, []);
			const groupedAsArray = Object.keys(groupedByType).map(type => ({
				type,
				typeName: groupedByType[type][0].typeName,
				fileList: groupedByType[type]
			}));
			return groupedAsArray;
		}
	},
	methods: {
		// 下载附件
		downloadAttachmentFile(record) {
			this.$emit('downloadAttachmentFile', record);
		},
		//查看附件
		filePreview(data) {
			this.$emit('handlePreview', data)
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '单据类型',
		dataIndex: 'typeName',
		scopedSlots: { customRender: 'typeName' }, // 自定义序号列内容渲染
		width: 152
	},
	{
		title: '文件名称',
		dataIndex: 'fileList',
		scopedSlots: { customRender: 'fileList' } // 自定义序号列内容渲染
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: { customRender: 'action' }, // 自定义序号列内容渲染
		width: 90,
		fixed: 'right'
	}
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
	.download-Btn {
		font-size: 14px;
		color: @primary-color;
		cursor: pointer;
	}
	.type-name-column {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		.type-name {
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			.type-name-text {
				flex: 1;
			}
			.required-mark {
				flex-shrink: 1;
				color: red;
				vertical-align: middle;
				width: 12px;
			}
		}
	}
	.file-names-column {
		display: inline-block;
		white-space: normal;
		color: @primary-color;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 14px; /* 100% */
		.file-name {
			display: inline-block;
			border-right: 1px solid #e9effc;
			padding: 0px 14px;
			line-height: 14px;
			padding-left: 0;
			margin: 6px 0;
			margin-right: 14px;
			cursor: pointer;
			&:first-child {
				padding-left: 0;
			}
			&:last-child {
				border: 0;
				// padding-left: 0;
			}
		}
	}
}
</style>
<style lang="less" scoped>
.sub-table-container {
	.new-table {
		margin-top: 20px;
		/deep/ .ant-table-tbody > tr:nth-child(2n) {
			background: #fff;
		}
		/deep/ .ant-table-thead > tr > th {
			padding: 10px 30px;
		}
		/deep/ .ant-table-tbody > tr > td {
			padding: 10px 30px;
			border-bottom: 1px solid #e5e6eb;
			border-left: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-thead > tr > th:first-child {
			padding: 10px 20px;
		}
		/deep/ .ant-table-tbody > tr > td:first-child {
			padding: 4px 8px;
			border-left: none;
		}
		/deep/ .ant-table-fixed-right .ant-table-thead > tr > th {
			padding: 10px 10px;
			text-align: center;
		}
		/deep/ .ant-table-fixed-right .ant-table-tbody > tr > td {
			padding: 4px 10px;
			text-align: center;
		}
	}
}
</style>