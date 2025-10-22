<template>
	<div class="contentBox">
		<div class="content">
			<!-- 编辑模块 -->
			<template v-if="editFlag || editFile">
				<p class="title">
					数质量凭证信息<span
						class="redTips"
						v-if="editFlag"
						>必须存在附件</span
					>
				</p>
				<div class="partBox">
					<template v-if="VUEX_MANUAL_ASSET_OBJ.transportMode == 'AUTOMOBILE'">
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_WEIGHT_NOTES"
							btnText="上传磅单"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_WEIGHT_NOTES_DETAIL"
							btnText="上传磅单明细"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_TEST_CREDENTIALS"
							btnText="上传化验凭证"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_OTHER_CREDENTIALS"
							btnText="上传其他凭证"
						></Upload>
					</template>
					<template v-if="VUEX_MANUAL_ASSET_OBJ.transportMode == 'SHIP'">
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_TEST_CREDENTIALS"
							btnText="上传化验凭证"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_WEIGHT"
							btnText="上传称重凭证"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_HARBOR_TRANSFER_VOUCHER"
							btnText="上传港口货转凭证"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_OTHER_CREDENTIALS"
							btnText="上传其他凭证"
						></Upload>
					</template>
					<template v-if="VUEX_MANUAL_ASSET_OBJ.transportMode == 'TRAIN'">
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_TEST_CREDENTIALS"
							btnText="上传化验凭证"
						></Upload>
						<Upload
							@uploadFiles="getUploadFiles"
							type="MANUAL_RECEIVE_WEIGHT"
							btnText="上传称重凭证"
						></Upload>
					</template>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>
				<!-- 附件展示 -->
				<template>
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
			</template>

			<!-- 详情模块 -->
			<template v-if="!editFlag && !editFile">
				<p class="title">数质量凭证信息</p>
				<p class="sub-title">附件信息</p>
				<template>
					<a-table
						:pagination="false"
						:columns="filesColumns"
						:data-source="
							isZf
								? filterLockFile(fileListDataSource.filter(item => item.delFlag == 0))
								: fileListDataSource.filter(item => item.delFlag == 0)
						"
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
			</template>
		</div>
	</div>
</template>
<script>
import Upload from '../common/Upload.vue';
import { mapGetters } from 'vuex';
import { filterLockFile } from '@/untils/factory.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
export default {
	name: 'QualityDocument',
	data() {
		return {
			filterLockFile,
			isZf: this.$route.path === '/center/assets/receivable/JR/detail' || this.$route.path === '/oaReceivableDetail',
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
			fileListDataSource: []
		};
	},
	props: ['editFlag', 'recvInfo', 'contractInfo', 'receivalVO', 'editFile'],
	filters: {
		filterCodeByValueName
	},
	components: {
		Upload
	},
	watch: {
		recvInfo: function () {
			this.dealEditData();
		},
		VUEX_MANUAL_ASSET_OBJ: function (v) {
			if (!v.isFirst) {
				this.fileListDataSource.forEach(item => {
					item.delFlag = 1;
				});
			}
		}
	},
	mounted() {
		this.dealEditData();
	},

	computed: {
		...mapGetters('business', {
			VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
		})
	},
	methods: {
		dealEditData() {
			if (!this.recvInfo) return;

			this.fileListDataSource = this.recvInfo.list || [];
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
		onSubmitList() {
			return this.fileListDataSource || [];
		},
		onSubmit() {
			if (this.fileListDataSource.filter(item => item.delFlag == 0).length == 0) {
				this.$message.error('数质量凭证缺少附件');
				return false;
			}
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
	color: #383a3f;
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
		p {
			margin-bottom: 15px;
		}
		.partBox {
			margin-bottom: 30px;
			.littleTitle {
				margin-bottom: 10px;
				margin-top: 15px;
				p {
					line-height: 28px;
					display: inline-block;
				}
				.typeBox {
					margin-left: 52px;
					display: inline-block;
					button {
						height: 28px;
						margin-right: 10px;
					}
				}
				span {
					float: right;
					color: #6b6f76;
					font-size: 12px;
					line-height: 28px;
				}
			}
			::v-deep.ant-table-wrapper {
				margin: 12px 0 10px 0;
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
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		display: inline-block;
		margin-right: 15px;
		float: right;
	}
	::v-deep.ant-btn {
		height: 28px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
