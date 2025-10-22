<template>
	<div class="table-box">
		<a-table
			:columns="filesColumns"
			bordered
			class="new-table"
			:rowKey="(record, index) => String(index)"
			:dataSource="fileList"
			:pagination="false"
		>
			<template
				slot="fileList"
				slot-scope="text, record"
			>
				<span class="preview-box">
					<a-tooltip
						v-for="(item, i) in record.fileList"
						:key="i"
					>
						<template slot="title"> {{ item.transferName }} </template>
						<a
							href="javascript:;"
							class="preview"
							@click="handlePreview(item)"
						>
							{{ item.fileName || item.name }}
						</a>
					</a-tooltip>
				</span>
			</template>
			<template
				slot="action"
				slot-scope="text, items"
			>
				<a
					href="javascript:;"
					@click="download(items)"
					v-if="downFileAllParent"
				>
					下载
				</a>
			</template>
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
					:checked="Boolean(record[lockedKey])"
					@change="onChange(record)"
				/>
			</template>
		</a-table>
		<ImageViewer ref="imageViewer" />
		<DepositPaymentUpload
			ref="depositPaymentUpload"
			handleType="detail"
		>
		</DepositPaymentUpload>
	</div>
</template>

<script>
import ImageViewer from '@sub/components/viewer/image.vue';
import comDownload from '@sub/utils/comDownload.js';
import DepositPaymentUpload from './DepositPaymentUpload.vue';

const filesRestColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const filesAdminColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' },
	{
		dataIndex: 'locked',
		slots: { title: 'lockedTitle' },
		scopedSlots: { customRender: 'locked' },
		width: '16%',
		align: 'center'
	}
];
export default {
	name: 'FileList',
	components: {
		ImageViewer,
		DepositPaymentUpload
	},
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		locked: {
			type: Boolean,
			default: false
		}
	},
	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		downFileAllParent: { form: 'downFileAllParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	data() {
		return {};
	},
	computed: {
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		filesColumns() {
			if (this.type === 'admin') {
				return filesAdminColumns;
			}
			if (this.disabled) {
				return filesRestColumns.filter(item => item.dataIndex !== 'action');
			}
			return filesRestColumns;
		},
		fileList() {
			let list = this.list || [];
			if (this.type === 'admin') {
				return list.map(item => {
					return {
						...item,
						typeDesc: item.typeDesc || item.itemDestc,
						type: item.type || item.item,
						fileList: [item]
					};
				});
			}
			let obj = {};
			list.forEach(el => {
				if (!obj[el.type]) {
					obj[el.type] = {
						fileList: [],
						typeDesc: el.typeDesc || el.itemDestc,
						locked: el[this.lockedKey],
						type: el.type
					};
				}
				obj[el.type].fileList.push(el);
			});
			list = [];
			for (let k in obj) {
				list.push(obj[k]);
			}
			return list;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.fileList.length) {
				let locked = this.fileList.every(item => Boolean(item[this.lockedKey]));
				return locked;
			}
			return false;
		}
	},
	watch: {},
	methods: {
		handlePreview(items) {
			// 如果类型是保证金支付凭证
			if (items.type === 'PAYMENT_BZJ_ZF_PJ') {
				this.$refs.depositPaymentUpload.editOpen(items);
				return;
			}
			this.$refs.imageViewer.showFile(items);
		},
		download(record) {
			let fileList = record.fileList;
			let files = fileList.map(item => item.path);
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
			let params = { type: record.type, fileId: fileId, lock: Boolean(!record[this.lockedKey]) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		onChangeAll() {
			let fileId = '';
			if (this.fileList?.length) {
				let arr = [];
				this.fileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: this.list, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');

.new-table {
	margin-top: 20px;
	/deep/ .ant-table-tbody > tr {
		background: #fff !important;
		&.ant-table-row-hover {
			background: #fff !important;
			td {
				background: none !important;
			}
		}
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
	/deep/ .ant-table-tbody > tr:last-child > td {
		// border-bottom: 0;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(2) {
		// padding-bottom: 0;
	}

	.preview {
		cursor: pointer;
		padding-right: 14px;
		padding-left: 14px;
		border-left: 1px solid #e9effc;
	}
	.preview-box {
		.preview:first-child {
			padding-left: 0;
			border-left: 0;
		}
	}
}
</style>
