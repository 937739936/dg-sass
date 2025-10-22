<template>
	<div class="invoice-batch-excel">
		<div class="invoice-batch-content">
			<p class="title-sub">
				<b>操作指南</b>
			</p>
			<ul class="guide-list">
				<li>1. 该功能仅支持上传EXCEL文件（*.xls或*.xlsx），请下载模板填写后上传</li>
				<li>2. 请务必将必填字段填写准确完整，否则可能识别、添加失败</li>
			</ul>
			<p class="title-sub"><b>上传EXCEL</b></p>
			<div class="file-wrap">
				<div class="file-content">
					<a-upload
						:disabled="isScanned"
						accept=".xls,.xlsx"
						:action="action"
						:multiple="false"
						:headers="headers"
						:fileList="fileList"
						@change="handleChange"
						:beforeUpload="beforeUpload"
						name="multiFile"
					>
						<a-button :disabled="isScanned"><a-icon type="upload" />上传文件</a-button>
					</a-upload>
				</div>
				<a
					:href="publicPath + 'files/invoice/tradeInvoiceTemplate.xlsx'"
					class="downloadTemplate"
					>模板下载</a
				>
			</div>

			<!--发票分拆信息-start-->
			<div v-if="dataSource && dataSource.length > 0">
				<div class="border-title">发票分拆信息</div>
				<split-invoice-info
					type="order"
					:dataSource="dataSource"
					ref="splitInvoiceInfo"
				/>
			</div>
			<!--发票分拆信息-end-->

			<!--批量识别结果查询-start-->
			<p class="title-sub">
				<b>批量识别结果查询</b
				><a-button
					type="primary"
					ghost
					class="refresh-btn"
					@click.native="refreshList"
					><a-icon type="reload" />手动刷新</a-button
				>
			</p>
			<div class="table-wrap">
				<a-table
					:columns="columns"
					:dataSource="resultData"
					:pagination="pagination"
					:rowKey="record => record.id"
					@change="handleTableChange"
				>
					<template
						slot="operation"
						slot-scope="text, record"
						v-if="record.status != '处理中'"
					>
						<a
							href="javascript:;"
							class="edit-btn"
							@click="tableOperation(record)"
							>详情</a
						>
						<!--<span class="line">|</span>
            <a href="javascript:;" class="edit-btn" @click="tableOperation(record,'deal')">处理</a>-->
					</template>
				</a-table>
			</div>
			<!--批量识别结果查询-end-->
		</div>

		<a-modal
			centered
			title="上传结果"
			v-model="modalIdentifyIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-identify"
			:closable="false"
		>
			<p class="info-text">{{ uploadResultText }}</p>
			<template slot="footer">
				<a-button
					type="primary"
					@click="modalIdentifyIsShow = false"
					>确定</a-button
				>
			</template>
		</a-modal>

		<a-modal
			centered
			title="EXCEL识别结果"
			v-model="modalIdentifyBatchIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-identify-batch"
			:closable="false"
			width="950px"
		>
			<div class="batch-info">
				<h3>
					批次号：<b>{{ invoiceBatchNo }}</b>
				</h3>
				<p v-if="invoiceBatchInfo">
					<span
						>总数<b>{{ invoiceBatchDetail.total }}</b></span
					>
					<span
						>添加成功数<b class="success">{{ invoiceBatchDetail.successNum }}</b></span
					>
					<span
						>添加失败数<b class="fail">{{ invoiceBatchDetail.failNum }}</b></span
					>
					<span
						>识别成功数<b class="success">{{ invoiceBatchDetail.scanSucc }}</b></span
					>
					<span
						>识别失败数<b class="fail">{{ invoiceBatchDetail.scanFail }}</b></span
					>
				</p>
			</div>
			<div class="table-wrap">
				<a-table
					:columns="batchColumns"
					:dataSource="invoiceBatchResultData"
					:pagination="batchPagination"
					:rowKey="record => record.id"
					@change="modalHandleTableChange"
				>
					<template
						slot="operation"
						slot-scope="text, record"
					>
						<a-popconfirm
							v-if="invoiceBatchResultData.length"
							title="确定忽略该条记录吗?"
							@confirm="() => deleteRecord(record)"
							okText="确定"
							cancelText="取消"
						>
							<a
								href="javascript:;"
								class="edit-btn"
								>忽略</a
							>
						</a-popconfirm>
						<span class="line">|</span>
						<a
							class="edit-btn"
							@click.prevent="reAdd(record)"
							>重新验证</a
						>
					</template>
				</a-table>
			</div>

			<template slot="footer">
				<a-button
					type="primary"
					@click="confirmModal"
					>确定</a-button
				>
			</template>
		</a-modal>

		<div class="btn-wrap">
			<a-button
				v-if="dataSource.length > 0"
				type="primary"
				@click="submitInvoiceInfo"
				>确定</a-button
			>
			<a-button @click="$router.go(-1)">返回</a-button>
		</div>
	</div>
</template>

<script>
import {
	API_postInvoiceDoExcelBatchScan,
	API_GETCURRENTENV,
	API_InvoiceBatchExcelList,
	API_InvoiceBatchExcelItemList,
	API_InvoiceBatchExcelDelete,
	API_InvoiceReAddExcel,
	API_InvoiceBatchOperateExcelItemList,
	API_postInvoiceDoBatchInvoiceOrderRelSave
} from '@/v2/center/trade/api/invoice';
import { mapGetters } from 'vuex';
import SplitInvoiceInfo from './SplitInvoiceInfo';
export default {
	name: 'InvoiceBatchPic',
	data() {
		return {
			fileList: [],
			columns: [
				{ title: '发票批次号', dataIndex: 'no', width: '120px' },
				{ title: '识别开始时间', dataIndex: 'beginTime', width: '140px' },
				{ title: '识别完成时间', dataIndex: 'endTime', width: '140px' },
				{ title: '文件总数', dataIndex: 'total', width: '110px' },
				{ title: '添加成功数', dataIndex: 'successNum', width: '140px' },
				{ title: '添加失败数', dataIndex: 'failNum', width: '140px' },
				{ title: '状态', dataIndex: 'status', width: '120px' },
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation',
					width: '70px'
				}
			],
			batchColumns: [
				{ title: '发票代码', dataIndex: 'code', width: '120px' },
				{ title: '发票号码', dataIndex: 'no', width: '120px' },
				{ title: '购方名称', dataIndex: 'buyerName', width: '120px' },
				{ title: '销方名称', dataIndex: 'sellerName', width: '120px' },
				{ title: '开票日期', dataIndex: 'issuedDate', width: '120px' },
				{ title: '查验结果', dataIndex: 'result', width: '120px' },
				{ title: '添加结果', dataIndex: 'status', width: '120px' }
			],
			dataSource: [],
			pagination: {},
			batchPagination: {},
			resultData: [],
			file: '',
			action: API_postInvoiceDoExcelBatchScan,
			modalIdentifyIsShow: false,
			uploadAmount: 0,
			completeAmount: 0,
			modalIdentifyBatchIsShow: false,
			invoiceBatchResultData: [],
			invoiceBatchNo: '',
			invoiceBatchDetail: {},
			invoiceBatchInfo: false,
			batchId: '',
			header: {},
			publicPath: process.env.BASE_URL,
			uploadResultText: '',
			tableTarget: '',
			isScanned: false
		};
	},
	mounted() {
		this.getList();
		this.header = {
			authorization: this.VUEX_ST_TOKEN
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	components: { SplitInvoiceInfo },
	methods: {
		beforeUpload(file) {
			this.uploadAmount++;
			const fileType = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
			const isExcel = fileType == 'xlsx' || fileType == 'xls';
			const isLt8M = file.size / 1024 / 1024 < 10;

			if (!isExcel) this.$message.error('仅支持xlsx的格式');
			if (!isLt8M) this.$message.error('不能大于10M');

			return new Promise((resolve, reject) => {
				if (isExcel && isLt8M) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		handleChange(info) {
			let fileList = [...info.fileList];
			fileList = fileList.map(file => {
				if (file.response && file.response.success) {
					file.url = API_GETCURRENTENV(file.response.result.url);
				}

				return file;
			});
			this.fileList = fileList;

			if (info.file.status === 'done') {
				this.completeAmount++;
				if (this.completeAmount == this.uploadAmount) {
					this.count();
					this.completeAmount = 0;
					this.uploadAmount = 0;
				}

				let resp = info.file.response || {};
				if (resp.success) this.dataSource = resp.result || [];
			}
		},
		count() {
			let result = [];
			this.fileList.forEach(item => {
				if (item.response) {
					if (item.response.success) {
						this.isScanned = true;
						this.$parent.isScanned = true;
						this.modalIdentifyIsShow = true;
						this.uploadResultText = item.response.message;
						this.refreshList();
					} else {
						this.$message.error(item.response.message);
					}
				}
			});
			this.fileList = result;
		},
		getList(params) {
			API_InvoiceBatchExcelList(params).then(res => {
				if (res.success) {
					res.result.records.map(item => {
						if (item.status == '0') {
							item.status = '等待处理';
						} else if (item.status == '2') {
							item.status = '处理完成';
						} else {
							item.status = '处理中';
						}
					});
					this.resultData = res.result.records;

					const pagination = {
						total: res.result.total,
						pageSize: res.result.size,
						pageNo: res.result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${res.result.current}页 `;
						}
					};
					this.pagination = pagination;
				}
			});
		},
		getBatchItemList(record) {
			this.invoiceBatchResultData = [];
			this.batchId = record.id;
			this.invoiceBatchDetail = record || {};
			this.invoiceBatchNo = record.no;

			let bodyObj = Object.assign(
				{ batchId: record.id },
				{ pageSize: this.batchPagination.pageSize || 10, pageNo: this.batchPagination.pageNo || 1 }
			);
			if (this.tableTarget == 'deal') {
				API_InvoiceBatchOperateExcelItemList(bodyObj).then(res => {
					if (res.success) {
						this.modalIdentifyBatchIsShow = true;
						this.invoiceBatchInfo = false;
						res.result.records.map(item => {
							if (item.result == '0') {
								item.result = '成功';
							} else if (item.result == '2') {
								item.result = '验真失败';
							} else {
								item.result = '识别失败';
							}

							if (item.status == '0') {
								item.status = '添加成功';
							} else if (item.status == '2') {
								item.status = '发票已存在';
							} else if (item.status == '3') {
								item.status = '无关发票';
							} else {
								item.status = '添加失败';
							}
						});
						// 是否需要操作列
						this.batchColumnsControl(true);
						this.invoiceBatchResultData = res.result.records;
						const pagination = {
							total: res.result.total,
							pageSize: res.result.size,
							showTotal: function (total) {
								return `共${total}条记录 第${res.result.current}页 `;
							}
						};
						this.batchPagination = pagination;
					}
				});
			} else {
				API_InvoiceBatchExcelItemList(bodyObj).then(res => {
					if (res.success) {
						this.modalIdentifyBatchIsShow = true;
						this.invoiceBatchInfo = true;
						res.result.records.map(item => {
							if (item.result == '0') {
								item.result = '成功';
							} else if (item.result == '2') {
								item.result = '验真失败';
							} else {
								item.result = '识别失败';
							}

							if (item.status == '0') {
								item.status = '添加成功';
							} else if (item.status == '2') {
								item.status = '发票已存在';
							} else if (item.status == '3') {
								item.status = '无关发票';
							} else {
								item.status = '添加失败';
							}
						});
						// 是否需要操作列
						this.batchColumnsControl(false);

						this.invoiceBatchResultData = res.result.records;
						const pagination = {
							total: res.result.total,
							pageSize: res.result.size,
							showTotal: function (total) {
								return `共${total}条记录 第${res.result.current}页 `;
							}
						};
						this.batchPagination = pagination;
					}
				});
			}
		},
		batchColumnsControl(type) {
			this.batchColumns.forEach((item, index) => {
				if (item.title == '操作') {
					this.batchColumns.splice(index, 1);
				}
			});
			if (type) {
				this.batchColumns.push({
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation',
					width: '160px'
				});
			}
		},
		deleteRecord(record) {
			API_InvoiceBatchExcelDelete({ ids: record.id }).then(res => {
				if (res.success) {
					this.$message.success('删除成功');
					this.invoiceBatchResultData = this.invoiceBatchResultData.filter(item => {
						return item.id != record.id;
					});
					this.getList();
				}
			});
		},
		confirmModal() {
			this.modalIdentifyBatchIsShow = false;
			this.batchPagination = {
				current: 1
			};
		},
		reAdd(record) {
			API_InvoiceReAddExcel({ itemId: record.id }).then(res => {
				if (res.success) {
					this.$message.success('识别成功');
					this.invoiceBatchResultData = this.invoiceBatchResultData.filter(item => {
						return item.id != record.id;
					});
					this.getList();
				}
			});
		},
		modalHandleTableChange(pagination) {
			this.batchPagination.pageNo = pagination.current;
			this.getBatchItemList({ id: this.batchId });
		},
		handleTableChange(pagination) {
			this.pagination['pageNo'] = pagination.current;
			this.getList({ pageNo: this.pagination.pageNo });
		},
		refreshList() {
			let pageNo = this.pagination.pageNo || 1;
			this.getList({ pageNo: pageNo });
		},
		tableOperation(id, type) {
			this.tableTarget = type;
			//表格操作处理
			this.getBatchItemList(id);
		},
		// 保存发票信息
		submitInvoiceInfo() {
			let splitData = this.$refs.splitInvoiceInfo.checkSplitAmount();
			if (!splitData) return false;

			if (splitData && splitData.length > 0) {
				API_postInvoiceDoBatchInvoiceOrderRelSave(splitData).then(resp => {
					if (resp.success) {
						this.$message.success('保存成功');
						this.$router.push('myInvoiceList');
					}
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.invoice-batch-excel {
	.border-title {
		font-size: 18px;
		color: #565656;
		padding-bottom: 10px;
		border-bottom: 1px solid #ddd;
		&:before {
			content: '';
			display: inline-block;
			position: relative;
			top: -1px;
			vertical-align: middle;
			width: 2px;
			height: 16px;
			background: #2a7aff;
			margin-right: 10px;
		}
	}
	.invoice-batch-content {
		padding: 0px 14px;
		.title-sub {
			font-size: 16px;
			color: #666;
			padding: 20px 0;
		}
		.guide-list {
			li {
				margin-bottom: 4px;
			}
		}
		.file-wrap {
			margin: 20px 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: flex-start;
			position: relative;
			.file-content {
				width: 300px;
				.ant-upload-list {
					max-height: 300px;
					padding: 10px 0;
					overflow-y: auto;
				}
			}
			.downloadTemplate {
				position: absolute;
				left: 100px;
				top: 6px;
			}
		}
	}
	.refresh-btn {
		margin-left: 20px;
	}
	.line {
		display: inline-block;
		padding: 0 4px;
	}
	.downloadTemplate {
		display: inline-block;
		margin-left: 30px;
		font-size: 14px;
	}
}
.modal-identify {
	width: 500px;
	.info-text {
		margin-bottom: 10px;
		font-size: 16px;
		span {
			display: inline-block;
			padding: 0 4px;
		}
	}
	.fail-wrap {
		display: flex;
		flex-direction: row;
		.desc {
			width: 100px;
		}
		.file-name {
			span {
				display: block;
				margin-bottom: 10px;
			}
		}
	}
}
.modal-identify-batch {
	width: 90% !important;
	.batch-info {
		h3 {
			margin-bottom: 10px;
			font-size: 24px;
		}
		p {
			margin-bottom: 20px;
			font-size: 16px;
			span {
				display: inline-block;
				padding-right: 10px;
				b {
					padding: 0 4px;
					&.success {
						color: green;
					}
					&.fail {
						color: red;
					}
				}
			}
		}
	}
	.line {
		display: inline-block;
		padding: 0 4px;
	}
}
</style>
