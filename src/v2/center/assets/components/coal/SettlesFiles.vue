<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="settleInfo"
		>
			<p class="title">结算单材料信息</p>
			<p class="sub-title">附件信息</p>
			<!-- 编辑模块 -->
			<template v-if="editFlag">
				<Upload
					@uploadFiles="getUploadFiles"
					type="PAYABLE_VOUCHER"
					btnText="上传付款凭证"
					:receivalVO="receivalVO"
				></Upload>
				<Upload
					@uploadFiles="getUploadFiles"
					type="SETTLEMENT"
					btnText="上传结算对账单"
					:receivalVO="receivalVO"
				></Upload>

				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="editFilesList"
					:scroll="{ x: true }"
					rowKey="index"
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
						slot-scope="action, items"
					>
						<a-popconfirm
							v-if="!items.locked"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
			</template>
			<!-- 详情模块 -->
			<template v-if="!editFlag">
				<a-table
					:pagination="false"
					:columns="noFileName ? noFileNameFilesColumns : filesColumns"
					:data-source="filterLockFile(settleInfo.list)"
					:scroll="{ x: true }"
					rowKey="index"
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
import { filterLockFile } from '@/untils/factory.js';
export default {
	name: 'SettlesFiles',
	data() {
		return {
			filterLockFile,
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
			fileInfos: [], // 附件信息
			fileType: '大票', // 默认附件类型为大票
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	props: ['editFlag', 'settleInfo', 'noFileName', 'receivalVO'],
	components: {
		Upload
	},
	watch: {
		settleInfo: function () {
			if (this.editFlag) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.settleInfo || {}).list || []);
			}
		}
	},
	mounted() {
		if (this.editFlag) {
			// 编辑情况下，给表格数据初始化
			this.editFilesList = Object.assign([], (this.settleInfo || {}).list || []);
		}
	},
	methods: {
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			this.fileInfos = data;

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			let obj = this.settleInfo;
			for (var i in data) {
				if (obj && obj.list) {
					obj.list.forEach(item => {
						if (
							item.md5Hex == data[i].md5Hex &&
							item.delFlag == data[i].delFlag &&
							item.name == data[i].name &&
							item.type == data[i].type
						) {
							this.$message.error('同类型的附件不能上传相同的文件');
							sameFlag = false;
						}
					});
				}
			}
			if (!sameFlag) return;
			this.$message.success('添加成功');
			// 判断相同类型下不可上传文件名相同且内容相同的文件--end

			for (let j = 0; j < this.fileInfos.length; j++) {
				let element = { ...this.fileInfos[j] };
				this.settleInfo.list.push(element);
				// 对编辑模块数据进行更新
				if (this.editFlag) {
					this.editFilesList.push(element);
				}
			}
		},
		deleteFiles(items) {
			// 删除附件
			let arr = this.settleInfo.list;
			let changeArr = this.editFilesList;
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach(element => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		onSubmit() {
			return this.settleInfo || { list: [] };
			//this.$emit('toSubmit', this.otherInfo)
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
