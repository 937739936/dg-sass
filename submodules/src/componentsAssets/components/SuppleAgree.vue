<template>
	<div class="attachment">
		<a-table
			class="new-table bordered"
			:columns="columns"
			bordered
			:data-source="dataSource"
			:rowKey="(record, index) => index"
			:pagination="false"
			v-bind="tableKeys"
		>
			<template slot="typeName"> 补充协议 </template>
			<div
				slot="fileList"
				slot-scope="text, record"
			>
				<div class="name-box">
					<div
						v-for="(item, i) in record.fileList"
						:key="i"
						class="name detail"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.uploadTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}</span
							>
						</a-tooltip>
					</div>
				</div>
			</div>

			<div
				slot="remark"
				slot-scope="text, record"
			>
				<div v-show="record.signDate">
					<p class="remark-item">
						<span class="remark-top">补协签订日期：</span>
						<span>{{ record.signDate }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协签章状态：</span>
						<span>{{ record.signStatus == 2 ? '双签' : '单签' }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协执行日期：</span>
						<span>{{ record.executionDateStart }} 至 {{ record.executionDateEnd }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">变更项目信息：</span>
						<span>
							<span
								v-for="(item, i) in record.changeItem"
								:key="i"
								>{{ item.text }} {{ i == record.changeItem.length - 1 ? '' : '、' }}</span
							></span
						>
					</p>
				</div>
			</div>
			<div
				slot="action"
				slot-scope="text, record, index"
			>
				<div class="btn-box">
					<a-space>
						<a
							href="javascript:;"
							@click="look(record, index)"
							v-if="editFlag"
							>查看</a
						>
						<a
							href="javascript:;"
							v-else
							@click="download(record)"
							>下载</a
						>
					</a-space>
				</div>
			</div>

			<template slot="lockedTitle">
				锁定
				<a-switch
					:checked="lockedAll"
					@change="onChangeAll"
					:disabled="!locked"
				/>
			</template>
			<template
				slot="locked"
				slot-scope="text, record"
			>
				<a-switch
					:disabled="!locked"
					:checked="lockedTypeAll(record)"
					@change="onChange(record)"
				/>
			</template>
			<!-- <template v-if="type === 'admin'">
        <div slot="expandedRowRender" slot-scope="record">
          <a-table
            :columns="expandedChangeColumns"
            :dataSource="record.changeItemDetail.list"
            :pagination="false"
            v-if="record.changeItemDetail && record.changeItemDetail.list && record.changeItemDetail.list.length"
          >
          </a-table>
          <p style="text-align: center; line-height: 84px" v-else>暂无数据</p>
        </div>
      </template> -->
		</a-table>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import ImageViewer from '@sub/components/viewer/image.vue';
import comDownload from '@sub/utils/comDownload.js';
import { h } from 'vue';

const filesRestColumns = [
	{ title: '单据类型', dataIndex: 'typeName', scopedSlots: { customRender: 'typeName' }, width: 120 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 380 },
	{ title: '操作', dataIndex: 'action', align: 'center', scopedSlots: { customRender: 'action' }, width: 120 }
];
const filesAdminColumns = [
	{ title: '单据类型', dataIndex: 'typeName', scopedSlots: { customRender: 'typeName' }, width: 140 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 380 },
	{
		dataIndex: 'locked',
		width: 120,
		slots: { title: 'lockedTitle' },
		scopedSlots: { customRender: 'locked' },
		width: '16%',
		align: 'center'
	}
];
const expandedChangeColumns = [
	{
		title: '变更项',
		dataIndex: 'name',
		align: 'center'
	},
	{
		title: '变更前结果',
		dataIndex: 'before.text',
		align: 'center',
		customRender: (text, record) => {
			if (record?.after?.text && !record?.before?.text) {
				return '无';
			} else {
				return record?.before?.text;
			}
		}
	},
	{
		title: '变更后结果',
		dataIndex: 'after.text',
		align: 'center'
	}
];
export default {
	props: {
		locked: {
			type: Boolean,
			default: false
		},
		editFlag: {
			type: Boolean,
			default: false
		},
		downContract: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},

	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' },
		serialNo: { form: 'serialNo', default: null },
		downFileAllParent: { form: 'downFileAllParent', default: null }
	},
	data() {
		return {
			dataSource: [],
			previewImg: '',
			fileList: [],
			expandedChangeColumns
		};
	},
	computed: {
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		columns() {
			if (this.type === 'admin') {
				return filesAdminColumns;
			}
			return filesRestColumns;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.dataSource.length) {
				let locked = this.dataSource.every(item => item.supplementalFile.every(items => Boolean(items[this.lockedKey])));
				return locked;
			}
			return false;
		},
		tableKeys() {
			if (this.type === 'admin') {
				let that = this;
				let h = this.$createElement;
				return {
					expandRowByClick: true,
					expandIconAsCell: false,
					expandedRowRender: record => {
						if (record?.changeItemDetail?.list?.length) {
							return h('a-table', {
								props: {
									columns: that.expandedChangeColumns,
									dataSource: record.changeItemDetail.list,
									pagination: false
								},
								style: { margin: 0 }
							});
						} else {
							return <p style="text-align: center; line-height: 84px">暂无数据</p>;
						}
					}
				};
			} else {
				return {};
			}
		}
	},
	watch: {
		downContract: {
			deep: true,
			immediate: true,
			handler(data) {
				this.init(data);
			}
		}
	},
	methods: {
		init(info) {
			this.detailInfo = info;
			const supplementalInfo = (info?.supplementalInfo || []).map(el => {
				let changeItemList = [];
				let Obj = {};
				let changeItem = (el.changeItem && el.changeItem.split(',')) || [];

				let changeItemDesc = (el.changeItemDesc && el.changeItemDesc.split(',')) || [];

				changeItem.forEach((el2, i) => {
					changeItemList.push({ value: el2, text: changeItemDesc[i] });
				});

				Obj.executeDate = [el.executionDateStart, el.executionDateEnd];
				Obj.supplementalFile = el.supplementalFile || [];
				Obj.supplementalFile.forEach(el2 => {
					el2.fileName = el2.name;
				});
				Obj.changeItem = changeItemList;

				Obj.fileList = el.supplementalFile;
				return { ...el, ...Obj };
			});

			if (supplementalInfo.length) {
				this.dataSource = supplementalInfo;
			} else {
				this.dataSource = [];
			}
		},
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		// 判断此类是否锁定
		lockedTypeAll(record) {
			let locked = record.fileList.every(item => Boolean(item[this.lockedKey]));
			return Boolean(locked);
		},
		// 去往补充协议详情
		look(item) {
			let path;
			if (this.type == 'rest') {
				path = `/center/contract/agreement/downSuppleDetail?id=${item.supplementalAgreementId}`;
				window.open(path);
			}
		},
		download(record) {
			console.log(record);
			let fileList = record.fileList;
			let files = fileList.map(item => item.url);
			let zipFileName = '';
			if (files.length === 0) {
				return;
			}
			if (files.length === 1) {
				zipFileName = fileList[0].transferName;
			} else {
				zipFileName = (record.typeDesc || record.itemDestc) + '.zip';
			}
			if (this.serialNo) {
				zipFileName = `${this.serialNo()}-${zipFileName}`;
			}
			files = files.join(',');
			if (this.downFileAllParent) {
				this.downFileAllParent({ zipFileName, files }).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},

		onChange(record) {
			let fileId = '';
			if (record.fileList?.length) {
				let arr = [];
				record.fileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			} else {
				fileId = record.id;
			}
			if (!fileId) {
				return;
			}
			let params = { type: record.type, fileId: fileId, lock: !this.lockedTypeAll(record) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		onChangeAll() {
			let fileId = '';
			let fileList = [];
			if (this.dataSource?.length) {
				let arr = [];
				this.dataSource.forEach(pro => {
					if (pro.supplementalFile?.length) {
						pro.supplementalFile.map(item => {
							arr.push(item.id);
							fileList.push(item);
						});
					}
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		}
	},
	components: {
		ImageViewer
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	width: 100%;
	.title {
		margin-top: 30px;
		margin-bottom: 16px;
		color: #77889d;
	}
	.tips {
		padding: 10px 12px;
		background: #e1eafe;
		border: 1px solid #d0dfff;
		border-radius: 4px;
		font-size: 12px;
		line-height: 22px;
		position: relative;
	}
	.handle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000;
	}
	.btn {
		color: @primary-color;
		cursor: pointer;
	}
	.red {
		color: red;
		vertical-align: middle;
	}
	.df {
		display: flex;
		align-items: center;
	}
	.name-box {
		display: flex;
		flex-wrap: wrap;
	}
	.name {
		background: #f3f5f6;
		border-radius: 4px;
		padding: 6px;
		display: flex;
		align-items: center;
		color: @primary-color;
		margin-right: 14px;
		margin-bottom: 10px;
	}
	.detail {
		background: #fff;
		display: inline-block;
		white-space: break-spaces;
		max-width: 300px;
		.preview {
			cursor: pointer;
			padding-right: 14px;
			padding-left: 14px;
			border-left: 1px solid #e9effc;
		}
		.preview:first-child {
			padding-left: 0;
			border-left: 0;
		}
	}
	.del {
		width: 14px;
		cursor: pointer;
		margin-left: 8px;
	}
}
.title-box {
	display: flex;
	align-items: center;
	.icon {
		color: @primary-color;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 5px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
	margin-top: 20px;
}
.icon {
	width: 16px;
	height: 16px;
	img {
		width: 16px;
		height: 16px;
	}
}
.upload {
	color: @primary-color;
	background: #fff;
	border: 1px solid @primary-color;
	height: 24px;
	width: 64px;
}
.type {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.preview {
	cursor: pointer;
}
::v-deep .ant-modal-body {
	padding-top: 30px;
}
::v-deep .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.new-table {
	::v-deep .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	::v-deep .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		height: 48px;
		::v-deep .ant-table-expanded-row {
			margin: 0;
		}
	}
	::v-deep .ant-table-tbody > tr:first-child > td:first-child {
		height: 48px;
	}
	::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
		background: #fff !important;
	}
}
.remark-item {
	color: #77889d;
	font-size: 14px;
	line-height: 22px;
}
.btn-box {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
