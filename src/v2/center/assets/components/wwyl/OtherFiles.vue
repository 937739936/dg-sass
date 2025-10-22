<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">其他材料信息</p>
			<p class="sub-title">附件信息</p>
			<!-- 编辑模块 -->
			<template v-if="editFlag || editFile">
				<template v-if="paymentType != 'receivable-shanmei-down'">
					<Upload
						@uploadFiles="getUploadFiles"
						type="MANUAL_PAYMENT_AGENT_CERTIFICATION"
						btnText="上传代发证明"
					></Upload>
					<Upload
						@uploadFiles="getUploadFiles"
						type="MANUAL_PAYMENT_ENTRUSTED_SETTLEMENT_LETTER"
						btnText="上传委托结算函"
					></Upload>
					<Upload
						@uploadFiles="getUploadFiles"
						type="MANUAL_CONTRACT_OTHER_MATERIALS"
						btnText="上传上游其他材料"
					></Upload>
				</template>
				<Upload
					@uploadFiles="getUploadFiles"
					type="MANUAL_TERMINAL_CONTRACT_OTHER_MATERIALS"
					btnText="上传下游其他材料"
				></Upload>

				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
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
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） 删除按钮应隐藏-->
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
// import {filterLockFile} from "@/untils/factory.js"
export default {
	name: 'OtherFiles',
	data() {
		return {
			fileListDataSource: [],
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],

			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	props: ['editFlag', 'otherInfo', 'editFile', 'receivalVO', 'paymentType'],
	components: {
		Upload
	},
	watch: {
		otherInfo: function () {
			this.dealEditData();
		}
	},
	mounted() {
		this.dealEditData();
	},
	methods: {
		dealEditData() {
			if (!this.otherInfo) return;
			this.fileListDataSource = this.otherInfo.list || [];
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
			return {
				list: this.fileListDataSource
			};
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
