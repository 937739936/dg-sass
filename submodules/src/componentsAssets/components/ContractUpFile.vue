<template>
	<div class="table-box">
		<a-table
			:columns="filesColumns"
			class="new-table"
			bordered
			:rowKey="(record, index) => String(index)"
			:dataSource="contractFileList"
			:pagination="false"
		>
			<template
				slot="name"
				slot-scope="text, record"
			>
				<a
					@click="handlePreview(record)"
					v-if="record.path"
				>
					{{ text }}
				</a>
				<span v-else> {{ text }} </span>
			</template>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a-space :size="20">
					<a
						@click="viewContractDetail(record)"
						v-if="record.path && showContract"
					>
						查看
					</a>
					<a
						@click="downloadPdf(record)"
						v-if="record.path"
					>
						下载
					</a>
				</a-space>
			</template>
			<template slot="lockedTitle">
				锁定
				<a-switch
					:checked="lockedAll"
					:disabled="!locked"
					@change="onChangeAll"
				/>
			</template>
			<template
				slot="locked"
				slot-scope="text, record"
			>
				<a-switch
					v-if="locked"
					:checked="Boolean(record[lockedKey])"
					:disabled="['CONTRACT'].includes(record.type)"
					@change="onChange(record)"
				/>
				<a-switch
					v-else
					:checked="Boolean(record[lockedKey])"
					disabled
				/>
			</template>
		</a-table>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import ImageViewer from '@sub/components/viewer/image.vue';
import comDownload from '@sub/utils/comDownload.js';
const filesRestColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '文件名称', dataIndex: 'name', width: '25%' },
	{ title: '文件编号', dataIndex: 'no', width: '25%' },
	{ title: '签订日期', dataIndex: 'signTime', width: '19%' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '16%', align: 'center' }
];
const filesAdminColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc' },
	{ title: '文件名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '文件编号', dataIndex: 'no' },
	{ title: '签订日期', dataIndex: 'signTime' },
	{
		dataIndex: 'locked',
		slots: { title: 'lockedTitle' },
		scopedSlots: { customRender: 'locked' },
		width: '200',
		align: 'center'
	}
];
export default {
	name: 'ContractUpFile',
	components: {
		ImageViewer
	},
	props: {
		contract: {
			type: Object,
			default: () => {
				return {};
			}
		},
		editFlag: {
			type: Boolean,
			default: false
		},
		showContract: {
			type: Boolean,
			default: true
		},
		locked: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	computed: {
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		contractFileList() {
			return this.contract.list || [];
		},
		//
		// 判断所有文件锁定
		lockedAll() {
			if (this.contractFileList.length) {
				let locked = this.contractFileList.every(item => Boolean(item[this.lockedKey]));
				return locked;
			}
			return false;
		},
		filesColumns() {
			if (this.type === 'rest') {
				return filesRestColumns;
			}
			return filesAdminColumns;
		}
	},
	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		downFileParent: { form: 'downFileParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	watch: {},
	methods: {
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		viewContractDetail(record) {
			// 如果是线下合同
			if (record.module === 'OFFLINE_CONTRACT') {
				this.handlePreview(record);
				return;
			}
			// 电子合同 查看-跳转到合同详情
			let routeUrl = this.$router.resolve({
				path: `/center/contract/buy/agreement/pdf/detail`,
				query: {
					contractNo: this.contract.contractNo,
					contractId: this.contract.orderId,
					zipFileName: this.contract.contractNo + '-' + this.contract.sellerName + '-' + this.contract.buyerName + '.zip',
					no: record.orderNo,
					newTab: 'newTab'
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		downloadPdf(record) {
			// 资产流水号-文件转换名
			let name = record.transferName;
			if (this.serialNo) {
				name = `${this.serialNo()}-${name}`;
			}
			if (this.downFileParent) {
				this.downFileParent(record.path).then(res => {
					comDownload(res, null, name);
				});
			} else {
				this.$message.warning('数据异常');
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
			// 过滤掉合同部分
			let contractFileList = this.contractFileList.filter(item => !['CONTRACT'].includes(item.type));
			if (contractFileList?.length) {
				let arr = [];
				contractFileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: contractFileList, lock: Boolean(!this.lockedAll) };
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
}
</style>
