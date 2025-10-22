<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="goodTransferInfo"
		>
			<p class="title">货转凭证信息</p>
			<!-- 运输方式为动力煤船运-->
			<div
				class="partBox"
				v-if="
					editFlag &&
					contractInfo.upContract.coalType == 'STEAM_COAL' &&
					deliverInfo.deliverList.filter(item => item.transferType == CONSTANTS.despatchModeDict.SHIP).length > 0
				"
			>
				<div class="littleTitle">
					<p>单据类型</p>
					<div class="typeBox">
						<a-button type="primary">货权转移证明</a-button>
					</div>
				</div>
				<template v-if="deliverInfo.deliverList">
					<span>批次号</span>
					<a-table
						:pagination="false"
						:columns="deliverColumns"
						:data-source="deliverInfo.deliverList.filter(item => item.transferType == CONSTANTS.despatchModeDict.SHIP)"
						:scroll="{ x: true }"
						rowKey="index"
						:row-selection="rowSelectionOne"
					></a-table>
				</template>
				<div v-else>暂无数据</div>
				<Upload
					:receivalVO="receivalVO"
					@uploadFiles="getUploadFiles"
					type="GOOD_TRANSFER_CERTIFICATION"
					btnText="选择文件"
					:selectedRows="selectedRowsOne"
					mode="transfer"
				></Upload>
				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
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
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
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
			</div>
			<div v-else>
				<p class="sub-title">附件信息</p>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="noFileName ? noFileNameFilesColumns : filesColumns"
					:data-source="filterLockFile(goodTransferInfo.list)"
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
			</div>
		</div>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { filterLockFile } from '@/untils/factory.js';
import Upload from './Upload.vue';
export default {
	name: 'GoodsTransferDocument',
	props: ['goodTransferInfo', 'contractInfo', 'deliverInfo', 'editFlag', 'noFileName', 'receivalVO'],
	data() {
		return {
			filterLockFile,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 200 }
			],

			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 200 }
			],
			deliverColumns: [
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '品名', dataIndex: 'goodName', key: 'goodName' },
				{ title: '发货数量(吨)', dataIndex: 'deliverQuntity', key: 'deliverQuntity' },
				{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
				{
					title: '发运方式',
					dataIndex: 'transferType',
					key: 'transferType',
					customRender: text => {
						return filterCodeByValueName(text, 'despatchTypeDict') || text;
					}
				}
			], // 发货数据表头
			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			selectedRowsOne: [],
			fileInfos: [], // 附件信息
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	components: {
		Upload
	},
	watch: {
		goodTransferInfo: function () {
			if (
				this.editFlag &&
				this.contractInfo.upContract.coalType == 'STEAM_COAL' &&
				this.deliverInfo.deliverList.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.SHIP).length > 0
			) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.goodTransferInfo || {}).list || []);
			}
		}
	},
	mounted() {
		if (
			this.editFlag &&
			this.contractInfo.upContract.coalType == 'STEAM_COAL' &&
			this.deliverInfo.deliverList.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.SHIP).length > 0
		) {
			// 编辑情况下，给表格数据初始化
			this.editFilesList = Object.assign([], (this.goodTransferInfo || {}).list || []);
		}
	},
	computed: {
		rowSelectionOne() {
			return {
				type: 'radio',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				}
			};
		}
	},
	methods: {
		getUploadFiles(data, type) {
			// 上传文件 获取附件数据
			this.fileInfos = data;
			let selectedArr = this.selectedRowsOne;

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let obj = this.goodTransferInfo;
			let sameFlag = true;
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

			for (let i = 0; i < selectedArr.length; i++) {
				let item = selectedArr[i];
				for (let j = 0; j < this.fileInfos.length; j++) {
					let element = { ...this.fileInfos[j] };
					element.batchNo = item.batchNo;
					this.goodTransferInfo.list.push(element);
					// 对编辑模块数据进行更新
					if (this.editFlag) {
						this.editFilesList.push(element);
					}
				}
			}
		},
		deleteFiles(items) {
			// 删除附件
			let arr = this.goodTransferInfo.list;
			let changeArr = this.editFilesList;
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.batchNo == items.batchNo &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach((element, index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.batchNo == items.batchNo &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		onSubmit() {
			return this.goodTransferInfo || { list: [] };
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
	.partBox {
		margin-bottom: 30px;
		.littleTitle {
			margin-bottom: 10px;
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
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
