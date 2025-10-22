<template>
	<div class="invoice-batch-pic">
		<a-form-model
			ref="formModel"
			:model="form"
			:rules="rules"
			:label-col="labelCol"
			:wrapper-col="wrapperCol"
		>
			<a-row>
				<a-col :span="10">
					<a-form-model-item
						:label-col="labelShort"
						prop="orderSerialNo"
						label="关联订单"
					>
						<a-input
							:disabled="isScanned"
							readOnly
							v-model="form.orderSerialNo"
							@click="openOrderModal"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="10">
					<a-form-model-item label="结算类型">
						<a-input
							disabled
							:value="filterCodeByValueName(form.settlementType, 'settleModeDict')"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
			<div class="invoice-batch-content">
				<p class="title-sub">
					<b>操作指南</b>
				</p>
				<ul class="guide-list">
					<li>1. 该功能仅支持上传文件夹，请确保文件中仅有发票图片，并无其他文件，单次最大可对200张发票进行识别。</li>
					<li>2. 支持的发票图片格式为jpg，jpeg，png，bmp，gif。</li>
					<li>3. 图片大小在200KB左右，不得大于10M；位深度24以上，扫描图像分辨率不得低于200DPI。</li>
					<li>4. 在批量识别结果查询列表中选择相应批次号点击查看该次识别结果。</li>
				</ul>
				<p class="title-sub"><b>批量上传图片</b></p>
			</div>

			<a-row>
				<a-col :span="10">
					<!--  1)	一票结算时，发票类型默认勾选为贸易发票且不允许修改  2)	两票结算时，系统默认为贸易发票且允许修改为运费发票-->
					<a-form-model-item
						class="no-bottom-item"
						prop="addInvoiceType"
						:label-col="labelShort"
						label="发票类型"
					>
						<a-select
							@change="handleInvoiceTypeChange"
							v-model="form.invoiceType"
							:disabled="isScanned || form.settlementType == 'ONE_TICKET'"
							placeholder="请选择新增方式"
						>
							<a-select-option
								v-for="item in invoiceTypeList"
								:key="item.value"
								:value="item.value"
								>{{ item.text }}</a-select-option
							>
						</a-select>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>

		<div class="invoice-batch-content">
			<div class="file-wrap">
				<div
					id="uploadListenerID"
					class="file-content"
				>
					<a-upload
						:disabled="isScanned"
						accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp"
						:action="action"
						:multiple="true"
						:fileList="fileList"
						:headers="headers"
						@change="handleChange"
						:beforeUpload="beforeUpload"
						name="multiFile"
					>
						<a-button :disabled="isScanned"><a-icon type="upload" />上传文件</a-button>
					</a-upload>
				</div>
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
			<!--发票分拆信息-start-->

			<!--批量识别结果查询-start-->
			<p class="title-sub">
				<b>批量识别结果查询</b>
				<a-button
					type="primary"
					ghost
					class="refresh-btn"
					@click.native="refreshList"
				>
					<a-icon type="reload" />手动刷新
				</a-button>
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
							class="edit-btn"
							@click.prevent="getBatchItemList(record)"
							>详情</a
						>
						<!--<span class="line">|</span>
            <a class="edit-btn" @click.prevent="getBatchItemList(record,'deal')">处理</a>-->
					</template>
				</a-table>
			</div>
			<!--批量识别结果查询-end-->
		</div>

		<a-modal
			centered
			title="图片上传结果，是否继续操作"
			v-model="modalIdentifyIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-identify"
			width="900px"
			:closable="false"
		>
			<p class="info-text">
				成功上传<span style="color: green">{{ successAmount }}</span
				>张，出错<span style="color: red">{{ falseAmount }}</span
				>张
			</p>
			<div
				class="fail-wrap"
				v-if="falseAmount != 0"
			>
				<p class="desc"><b>出错文件名：</b></p>
				<p class="file-name">
					<span
						v-for="(i, index) in fileListFailFileName"
						:key="index"
						>{{ i }}</span
					>
				</p>
			</div>
			<template slot="footer">
				<a-button
					type="primary"
					@click="confirm"
					:loading="confirmloading"
					>确定</a-button
				>
				<a-button
					@click="
						modalIdentifyIsShow = false;
						fileList = [];
					"
					>取消</a-button
				>
			</template>
		</a-modal>

		<a-modal
			centered
			title="图片批量识别结果"
			v-model="modalIdentifyBatchIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-identify-batch"
			width="900px"
			:closable="false"
		>
			<div class="batch-info">
				<h3>
					批次号：<b>{{ invoiceBatchNo }}</b>
				</h3>
				<p v-if="invoiceBatchInfo">
					<span
						>图片总数<b>{{ invoiceBatchDetail.total }}</b></span
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
							href="javascript:;"
							class="edit-btn"
							@click="reAdd(record)"
							>重新添加</a
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

		<link-order
			:single="true"
			@update="handleSelectConfirm"
			ref="linkedOrder"
		/>

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
	API_INVOICEBATCHUPLOAD_IMG,
	API_GETCURRENTENV,
	API_INVOICEBATCHSAVE,
	API_INVOICEBATCHLIST,
	API_INVOICEBATCHITEMLIST,
	API_INVOICEBATCHOPERATEITEMLIST,
	API_INVOICEBATCHITEMDELETE,
	API_INVOICEREADD,
	API_postInvoiceDoBatchInvoiceOrderRelSave
} from '@/v2/center/trade/api/invoice';
import { filterCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import LinkOrder from './LinkOrder';
import SplitInvoiceInfo from './SplitInvoiceInfo';
export default {
	name: 'InvoiceBatchPic',
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			dataSource: [],
			labelCol: { span: 10 },
			labelShort: { span: 5 },
			wrapperCol: { span: 14 },
			form: {},
			rules: {
				orderSerialNo: [{ required: true, message: '关联订单必选', trigger: ['change', 'blur'] }]
			},
			orderDetail: {}, // 图片关联订单
			fileList: [],
			columns: [
				{ title: '发票批次号', dataIndex: 'no' },
				{ title: '识别开始时间', dataIndex: 'beginTime' },
				{ title: '识别完成时间', dataIndex: 'endTime' },
				{ title: '文件总数', dataIndex: 'total' },
				{ title: '添加成功数', dataIndex: 'successNum' },
				{ title: '添加失败数', dataIndex: 'failNum' },
				{ title: '状态', dataIndex: 'status' },
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation',
					width: '70px'
				}
			],
			batchColumns: [
				{ title: '图片名称', dataIndex: 'name' },
				{ title: '发票代码', dataIndex: 'code' },
				{ title: '发票号码', dataIndex: 'no' },
				{ title: '购方名称', dataIndex: 'buyerName' },
				{ title: '销方名称', dataIndex: 'sellerName' },
				{ title: '开票日期', dataIndex: 'issuedDate' },
				{ title: '查验结果', dataIndex: 'result' },
				{ title: '添加结果', dataIndex: 'status' }
			],
			pagination: {},
			batchPagination: {},
			resultData: [],
			file: '',
			action: API_INVOICEBATCHUPLOAD_IMG,
			modalIdentifyIsShow: false,
			// percent: 0,
			fileListFail: [],
			fileListFailFileName: [],
			// timer : null,
			// totalAmount : 0,
			successAmount: 0,
			falseAmount: 0,
			uploadAmount: 0,
			completeAmount: 0,
			modalIdentifyBatchIsShow: false,
			invoiceBatchResultData: [],
			invoiceBatchNo: '',
			invoiceBatchDetail: {},
			invoiceBatchInfo: false,
			batchId: '',
			header: {},
			isScanned: false,
			ele: null,
			confirmloading: false,
			invoiceTypeList: filterCodeByKey('invoice_type') // 发票类型
		};
	},
	mounted() {
		this.form.invoiceType = '1';
		this.getList();
		this.header = {
			authorization: this.VUEX_ST_TOKEN
		};
		this.ele = document.getElementById('uploadListenerID');
		// 使用事件捕获，在触发上传之前校验是否有关联订单
		this.ele.addEventListener('click', this.uploadListener, true);
	},
	components: {
		LinkOrder,
		SplitInvoiceInfo
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
	methods: {
		uploadListener(e) {
			if (!this.form.orderSerialNo && e.target.nodeName === 'BUTTON') {
				e.stopPropagation();
				this.$refs.formModel.validate();
			}
		},
		// 关联订单
		openOrderModal() {
			let ids = [];
			if (this.orderDetail && this.orderDetail.orderId) ids = [this.orderDetail];
			this.$refs.linkedOrder.init(ids);
		},
		// 选择关联订单回调
		handleSelectConfirm(rows) {
			if (!rows || rows.length === 0) {
				this.ele.addEventListener('click', this.uploadListener, true);
				return false;
			} else {
				this.ele.removeEventListener('click', this.uploadListener, true);
			}
			let row = rows[0];
			this.form.invoiceType = '1'; // 修改关联订单后，将发票类型重置为1-贸易发票
			this.orderDetail = row;
			this.form.orderSerialNo = row.orderSerialNo;
			this.form.settlementType = row.settlementType;
			this.form = { ...this.form };
		},
		beforeUpload(file) {
			const isIMG =
				file.type === 'image/jpeg' ||
				file.type === 'image/jpg' ||
				file.type === 'image/png' ||
				file.type === 'image/bmp' ||
				file.type === 'image/gif';
			const isLt = file.size / 1024 / 1024 < 10;

			if (!isIMG) this.$message.error('仅支持bmp，jpeg，jpg，png，gif的格式');
			if (!isLt) this.$message.error('图片不能大于10M');

			return new Promise((resolve, reject) => {
				if (isIMG && isLt) {
					this.uploadAmount++;
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
			}
		},
		count() {
			this.successAmount = 0;
			this.falseAmount = 0;
			this.fileListFailFileName = [];

			let result = [];
			let fileListFail = [];
			this.fileList.forEach(item => {
				if (item.response && item.response.success) {
					this.successAmount++;
				} else {
					this.falseAmount++;
					fileListFail.push(item);
				}
				result.push(item);
			});
			this.fileList = result;

			fileListFail.forEach(file => {
				if (file.response && !file.response.success) {
					this.fileListFailFileName.push(file.response.result.name);
				}
			});

			this.modalIdentifyIsShow = true;
		},
		confirm() {
			this.confirmloading = true;
			// 获取id
			let ids = this.fileList.map(item => {
				return item.response.result.id;
			});
			let params = {
				invoiceType: this.form.invoiceType,
				orderSerialNo: this.form.orderSerialNo,
				items: ids.join(',')
			};

			API_INVOICEBATCHSAVE(params).then(res => {
				if (res.success) {
					this.$parent.isScanned = true;
					this.isScanned = true;
					this.dataSource = res.result || [];
					this.fileList = [];
					this.$message.success('识别成功');
					this.modalIdentifyIsShow = false;
					this.confirmloading = false;
					this.getList();
				}
			});
		},
		dealItem(item, type) {
			let str = '';
			if (type === 1) {
				switch (item.status) {
					case '0':
						str = '等待处理';
						break;
					case '2':
						str = '处理完成';
						break;
					default:
						str = '处理中';
				}
			}
			if (type === 2) {
				switch (item.result) {
					case '0':
						str = '成功';
						break;
					case '2':
						str = '验真失败';
						break;
					default:
						str = '识别失败';
				}
			}
			if (type === 3) {
				switch (item.status) {
					case '0':
						str = '添加成功';
						break;
					case '2':
						str = '发票已存在';
						break;
					case '3':
						str = '无关发票';
						break;
					default:
						str = '添加失败';
				}
			}
			return str;
		},
		getList(params) {
			API_INVOICEBATCHLIST(params).then(res => {
				if (res.success) {
					let records = (res.result && res.result.records) || [];
					records.forEach(item => {
						item.status = this.dealItem(item, 1);
					});
					this.resultData = records;

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
		getBatchItemList(record, type) {
			this.invoiceBatchResultData = [];
			this.batchId = record.id;
			this.invoiceBatchDetail = record || {};
			this.invoiceBatchNo = record.no;

			let bodyObj = Object.assign({ batchId: record.id }, this.batchPagination);
			if (type == 'deal') {
				API_INVOICEBATCHOPERATEITEMLIST(bodyObj).then(res => {
					if (res.success) {
						this.modalIdentifyBatchIsShow = true;
						this.invoiceBatchInfo = false;
						res.result.records.map(item => {
							item.result = this.dealItem(item, 2);
							item.status = this.dealItem(item, 3);
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
				API_INVOICEBATCHITEMLIST(bodyObj).then(res => {
					if (res.success) {
						this.modalIdentifyBatchIsShow = true;
						this.invoiceBatchInfo = true;
						res.result.records.map(item => {
							item.result = this.dealItem(item, 2);
							item.status = this.dealItem(item, 3);
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
				if (item.title == '操作') this.batchColumns.splice(index, 1);
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
			API_INVOICEBATCHITEMDELETE({ ids: record.id }).then(res => {
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
			API_INVOICEREADD({ itemId: record.id }).then(res => {
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
			this.getBatchItemList({ id: this.batchId }, 'deal');
		},
		handleTableChange(pagination) {
			this.pagination['pageNo'] = pagination.current;
			this.getList({ pageNo: this.pagination.pageNo });
		},
		refreshList() {
			let pageNo = this.pagination.pageNo || 1;
			this.getList({ pageNo: pageNo });
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
		},
		handleInvoiceTypeChange(val) {
			this.form = {
				...this.form,
				invoiceType: val
			};
		}
	},
	beforeDestroy() {
		// 销毁组件之前移除自定义监听事件
		this.ele.removeEventListener('click', this.uploadListener, true);
	}
};
</script>

<style lang="less" scoped>
.invoice-batch-pic {
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
			margin: 10px 0px 20px 0px;
			.file-content {
				width: 100%;
				::v-deep.ant-upload-list {
					display: flex;
					flex-wrap: wrap;
					align-items: flex-start;
					padding: 10px 0;
					overflow-y: auto;
				}
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
	::v-deep.no-bottom-item.ant-form-item {
		margin-bottom: 0px !important;
	}
	::v-deep.ant-table-thead > tr > th,
	::v-deep.ant-table-tbody > tr > td {
		padding: 16px 8px;
	}
}
.modal-identify {
	/*width: 500px;*/
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
	::v-deep.ant-table-thead > tr > th,
	::v-deep.ant-table-thead > tr > th {
		white-space: nowrap;
	}
	::v-deep.ant-table-tbody > tr > td {
		padding: 16px 10px;
	}
}
.modal-identify-batch {
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
	::v-deep.ant-table-thead > tr > th,
	::v-deep.ant-table-thead > tr > th {
		white-space: nowrap;
	}
	::v-deep.ant-table-tbody > tr > td {
		padding: 16px 10px;
	}
}
</style>
