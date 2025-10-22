<template>
	<div class="contentBox">
		<div class="content">
			<!-- 编辑模块 -->
			<template v-if="editFlag">
				<p class="title">
					数质量凭证信息<span
						class="redTips"
						v-if="editFlag"
						>必须存在附件</span
					>
				</p>

				<!-- 汽运--磅单、磅单明细、化验凭证、其他凭证 -->
				<div
					class="partBox"
					v-if="recvInfo && autoData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'RECEIVE_WEIGHT_NOTES'"
								@click="
									() => {
										fileTypeOne = 'RECEIVE_WEIGHT_NOTES';
									}
								"
								>磅单</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'RECEIVE_WEIGHT_NOTES_DETAIL'"
								@click="
									() => {
										fileTypeOne = 'RECEIVE_WEIGHT_NOTES_DETAIL';
									}
								"
								>磅单明细</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'RECEIVE_TEST_CREDENTIALS'"
								@click="
									() => {
										fileTypeOne = 'RECEIVE_TEST_CREDENTIALS';
									}
								"
								>化验凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeOne != 'RECEIVE_OTHER_CREDENTIALS'"
								@click="
									() => {
										fileTypeOne = 'RECEIVE_OTHER_CREDENTIALS';
									}
								"
								>其他凭证</a-button
							>
						</div>
						<span>注：需【20%及以上磅单+磅单明细】</span>
					</div>
					<span>收货编号</span>
					<a-table
						:pagination="false"
						:columns="deliverColumns"
						:data-source="autoData"
						:scroll="{ x: true }"
						rowKey="index"
						:row-selection="rowSelectionOne"
					></a-table>
					<Upload
						ref="upload"
						:receivalVO="receivalVO"
						@uploadFiles="getUploadFiles"
						:type="fileTypeOne"
						btnText="选择文件"
						:selectedRows="selectedRowsOne"
						mode="quality1"
						:allowFormat="
							fileTypeOne == 'RECEIVE_WEIGHT_NOTES_DETAIL'
								? ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls']
								: ['png', 'jpeg', 'jpg', 'gif', 'pdf']
						"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 火运称重凭证、化验凭证类型 -->
				<div
					class="partBox"
					v-if="recvInfo && trainData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								:ghost="fileTypeTwo != 'RECEIVE_WEIGHT'"
								@click="
									() => {
										fileTypeTwo = 'RECEIVE_WEIGHT';
									}
								"
								>称重凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeTwo != 'RECEIVE_TEST_CREDENTIALS'"
								@click="
									() => {
										fileTypeTwo = 'RECEIVE_TEST_CREDENTIALS';
									}
								"
								>化验凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileTypeTwo != 'RECEIVE_OTHER_CREDENTIALS'"
								@click="
									() => {
										fileTypeTwo = 'RECEIVE_OTHER_CREDENTIALS';
									}
								"
								>其他凭证</a-button
							>
						</div>
					</div>
					<span>收货编号</span>
					<a-table
						:pagination="false"
						:columns="deliverColumns"
						:data-source="trainData"
						:scroll="{ x: true }"
						rowKey="index"
						:row-selection="rowSelectionTwo"
					></a-table>
					<Upload
						:allowedFileTypes="allowedFileTypes"
						:receivalVO="receivalVO"
						@uploadFiles="getUploadFiles"
						:type="fileTypeTwo"
						btnText="选择文件"
						:selectedRows="selectedRowsTwo"
						:allowFormat="['png', 'jpeg', 'jpg', 'gif', 'pdf']"
						mode="quality2"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>
				<!-- 船运--动力煤  称重凭证、化验凭证、其他凭证-->
				<div
					class="partBox"
					v-if="recvInfo && shipData.length"
				>
					<div class="littleTitle">
						<p>单据类型</p>
						<div class="typeBox">
							<a-button
								type="primary"
								:ghost="fileType != 'RECEIVE_WEIGHT'"
								@click="
									() => {
										fileType = 'RECEIVE_WEIGHT';
									}
								"
								>称重凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileType != 'RECEIVE_TEST_CREDENTIALS'"
								@click="
									() => {
										fileType = 'RECEIVE_TEST_CREDENTIALS';
									}
								"
								>化验凭证</a-button
							>
							<a-button
								type="primary"
								:ghost="fileType != 'RECEIVE_OTHER_CREDENTIALS'"
								@click="
									() => {
										fileType = 'RECEIVE_OTHER_CREDENTIALS';
									}
								"
								>其他凭证</a-button
							>
						</div>
					</div>
					<template v-if="recvInfo.recvList">
						<span>批次号</span>
						<a-table
							:pagination="false"
							:columns="deliverColumns"
							:data-source="shipData"
							:scroll="{ x: true }"
							rowKey="index"
							:row-selection="rowSelectionThree"
						></a-table>
					</template>
					<div v-else>暂无数据</div>
					<Upload
						@uploadFiles="getUploadFiles"
						:receivalVO="receivalVO"
						:type="fileType"
						btnText="选择文件"
						:selectedRows="selectedRowsThree"
						mode="quality3"
					></Upload>
					<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				</div>

				<!-- 附件展示 -->
				<template v-if="recvInfo && recvInfo.attachList">
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
				</template>
			</template>

			<!-- 详情模块 -->
			<template v-if="!editFlag">
				<p class="title">数质量信息</p>
				<p class="sub-title">附件信息</p>
				<template v-if="recvInfo.attachList">
					<a-table
						:pagination="false"
						:columns="noFileName ? noFileNameFilesColumns : filesColumns"
						:data-source="filterLockFile(recvInfo.attachList)"
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
				<div v-else>暂无数据</div>
			</template>
		</div>
	</div>
</template>
<script>
import Upload from '../common/Upload.vue';
import { filterLockFile } from '@/untils/factory.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import _ from 'lodash';
export default {
	name: 'QualityDocument',
	data() {
		return {
			filterLockFile,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' }
			], // 附件详情表头
			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' }
			],

			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			deliverColumns: [
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
				{ title: '品名', dataIndex: 'goodName', key: 'goodName' },
				{ title: '发货数量(吨)', dataIndex: 'deliverQuntity', key: 'deliverQuntity' },
				{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
				{ title: '收货编号', dataIndex: 'recvNo', key: 'recvNo' },
				{ title: '收货数量(吨)', dataIndex: 'recvQuntity', key: 'recvQuntity' },
				{ title: '收货日期', dataIndex: 'recvDate', key: 'recvDate' },
				{
					title: '发运方式',
					dataIndex: 'transferType',
					key: 'transferType',
					customRender: text => {
						return filterCodeByValueName(text, 'despatchTypeDict') || text;
					}
				}
			], // 发货数据表头
			fileInfos: [], // 附件信息
			allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
			fileType: 'RECEIVE_WEIGHT', //船运默认称重凭证
			fileTypeOne: 'RECEIVE_WEIGHT_NOTES', // 汽运默认附件类型为磅单
			fileTypeTwo: 'RECEIVE_WEIGHT', // 火运默认附件类型为称重凭证
			selectedRowsOne: [],
			selectedRowsTwo: [],
			selectedRowsThree: [],
			hideTips: false,
			assetsConfig: {},
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	props: ['editFlag', 'recvInfo', 'noFileName', 'receivalVO', 'isChange'],
	filters: {
		filterCodeByValueName
	},
	components: {
		Upload
	},
	watch: {
		recvInfo: function (data) {
			if (this.editFlag) {
				// 编辑情况下，给表格数据初始化
				this.editFilesList = Object.assign([], (this.recvInfo || {}).attachList || []);
			}
		}
	},
	mounted() {
		if (this.editFlag) {
			// 编辑情况下，给表格数据初始化
			this.editFilesList = Object.assign([], (this.recvInfo || {}).attachList || []);
		}
	},
	computed: {
		autoData() {
			return this.recvInfo?.recvList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.AUTOMOBILE) || [];
		},
		trainData() {
			return this.recvInfo?.recvList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.TRAIN) || [];
		},
		shipData() {
			return this.recvInfo?.recvList?.filter(item => item.transferType == this.CONSTANTS.despatchModeDict.SHIP) || [];
		},
		rowSelectionOne() {
			const t = this;
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsOne = selectedRows;
				}
			};
		},
		rowSelectionTwo() {
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsTwo = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsTwo = selectedRows;
				}
			};
		},
		rowSelectionThree() {
			return {
				type: 'checkbox',
				onSelect: (record, selected, selectedRows) => {
					this.selectedRowsThree = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					this.selectedRowsThree = selectedRows;
				}
			};
		}
	},
	methods: {
		getUploadFiles(data, type, mode) {
			// 上传文件 获取附件数据
			this.fileInfos = data;
			let selectedArr =
				mode == 'quality1' ? this.selectedRowsOne : mode == 'quality2' ? this.selectedRowsTwo : this.selectedRowsThree;

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			let obj = this.recvInfo;
			for (var i in data) {
				if (obj && obj.attachList) {
					obj.attachList.forEach(item => {
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
					element.receiveNo = item.recvNo;
					element.transType = item.transferType;
					// debugger
					this.recvInfo.attachList.push(element);
					// 对编辑模块数据进行更新
					if (this.editFlag) {
						this.editFilesList.push(element);
					}
				}
			}
		},

		deleteFiles(items) {
			// 删除附件
			let arr = this.recvInfo.attachList;
			let changeArr = this.editFilesList;
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.batchNo == items.batchNo &&
					element.receiveNo == items.receiveNo &&
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
					element.receiveNo == items.receiveNo &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		onSubmit() {
			if (this.recvInfo && (this.recvInfo.attachList || []).filter(r => r.delFlag == 0).length) {
				// this.recvInfo.attachList = this.editFilesList
				return this.recvInfo;
			} else {
				this.$message.error('数质量凭证缺少相关附件');
				return false;
			}
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
