<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">
				核算表信息<span
					class="redTips"
					v-if="editFlag"
					>必须存在附件</span
				>
			</p>
			<p class="sub-title">附件信息</p>
			<!-- 编辑模块 -->
			<template v-if="editFlag || editFile">
				<!-- accountInfo.accountingSeal=1核算表需要盖章 -->
				<Upload
					:receivalVO="receivalVO"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_ACCOUNTING_TABLE"
					uploadText="核算表截图"
					btnText="上传核算表截图"
					:allowFormat="['png', 'jpeg', 'jpg']"
				></Upload>
				<Upload
					:receivalVO="receivalVO"
					@uploadFiles="getUploadFiles"
					type="PAYMENT_ACCOUNTING_TABLE"
					uploadText="Excel版核算表"
					btnText="上传Excel版核算表"
					:allowFormat="['xls', 'xlsx']"
				></Upload>
				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<!--                <a :href="publicPath + 'files/核算表模板-平安银行池保理.xls'" style="float: right;margin-top: 10px;">下载核算表模板</a>-->
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="type"
						slot-scope="type"
					>
						{{ CONSTANTS.fileType[type] }}
					</template>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
					<template
						slot="action"
						slot-scope="action, items, index"
					>
						<a-popconfirm
							v-if="!items.locked && (items.editFlag == null || items.editFlag == 1)"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items, index)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
			</template>
			<!-- 详情模块 -->
			<template v-if="!editFlag && !editFile">
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="type"
						slot-scope="type"
					>
						{{ CONSTANTS.fileType[type] }}
					</template>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
				</a-table>
			</template>
		</div>
	</div>
</template>
<script>
import Upload from '../common/Upload.vue';
export default {
	name: 'AccountsTable',
	data() {
		return {
			publicPath: process.env.BASE_URL,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],
			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			fileListDataSource: []
		};
	},
	props: ['editFlag', 'accountInfo', 'editFile', 'receivalVO'],
	components: {
		Upload
	},
	watch: {
		accountInfo: function () {
			this.dealEditData();
		}
	},
	mounted() {
		this.dealEditData();
	},
	methods: {
		dealEditData() {
			if (!this.accountInfo) return;
			this.fileListDataSource = this.accountInfo.list || [];
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据

			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
		},
		deleteFiles(items, _index) {
			// 删除附件
			this.fileListDataSource[_index].delFlag = 1;
		},

		onSubmit() {
			if (this.fileListDataSource.filter(r => r.delFlag == 0).length) {
				return {
					list: this.fileListDataSource
				};
			} else {
				this.$message.error('核算表缺少相关附件');
				return false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;
	.content {
		padding: 0 15px;
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		p {
			margin-bottom: 15px;
		}
		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
		.redTips {
			color: #f24e4d !important;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			display: inline-block;
			float: right;
			margin-right: 15px;
		}
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
