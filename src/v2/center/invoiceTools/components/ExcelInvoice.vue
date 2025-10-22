<template>
	<div>
		<div>
			<div class="excels-upload">
				<a-upload
					name="file"
					:multiple="true"
					:accept="accept"
					:headers="headers"
					@preview="handlePreview"
					:fileList="fileListinvoiceExcel"
					:beforeUpload="beforeUpload"
					:remove="remove"
					:customRequest="customRequest"
					@change="handleChangeinvoiceExcel"
				>
					<a-button type="primary"><a-icon type="upload" />上传文件</a-button>
				</a-upload>
				<span class="down-file">
					<!-- 运费发票 -->
					<a
						v-if="type == '1'"
						:href="publicPath + 'files/invoice/tradeInvoiceTemplate-v3.xlsx'"
						class="downloadTemplate"
						>模板下载</a
					>
					<!-- 贸易发票 -->
					<a
						v-else
						:href="publicPath + 'files/invoice/transportInvoiceTemplate-v3.xlsx'"
						class="downloadTemplate"
						>模板下载</a
					>
				</span>
			</div>
			<a-divider />
			<a-row
				style="margin-bottom: 15px"
				type="flex"
				justify="space-between"
			>
				<a-col> 发票总数：{{ total }} </a-col>
				<a-col> 识别失败张数：{{ failTotal }} </a-col>
				<a-col>
					<a-button
						ghost
						type="primary"
						style="margin-right: 16px"
						@click="toExport(true)"
						>导出全部</a-button
					>
					<a-button
						ghost
						type="primary"
						@click="toExport(false)"
						>导出失败发票</a-button
					>
				</a-col>
			</a-row>
			<a-table
				:columns="columns"
				:rowKey="record => (record.contractNo ? record.contractNo + record.no : record.no)"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<span
					:class="text === 0 ? 'y' : 'r'"
					slot="scanStatus"
					slot-scope="text, records"
				>
					{{ ['验证成功', '验证失败'][text] }}
				</span>
			</a-table>
			<div
				class="tc"
				style="margin-top: 20px"
			>
				<a-button
					class="width126px-height44px-button"
					type="primary"
					@click="next"
					>下一步</a-button
				>
			</div>
		</div>
		<a-modal
			class="modal"
			:header="null"
			:footer="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="confirmModal"
				style="display: block; margin: 30px auto 0"
				>确定</a-button
			>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import axios from 'axios';
import { API_UPLOAD_EXCELSCAN, API_InvoiceListExcelScanAll, API_InvoiceExportXls } from '@/v2/center/invoiceTools/api';
import { handleUploadChange } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';

const tradeColumns = [
	{
		title: '发票代码',
		fixed: '',
		dataIndex: 'code'
	},
	{
		title: '发票号码',
		dataIndex: 'no'
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		customRender(text) {
			return moment(text).format('YYYY-MM-DD');
		}
	},
	{
		title: '发票金额（不含税）（元）',
		dataIndex: 'taxExcludedAmount'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		customRender(text) {
			return text?.toLocaleString();
		}
	},
	{
		title: '状态',
		dataIndex: 'scanStatus',
		scopedSlots: { customRender: 'scanStatus' }
	},
	{
		title: '失败原因',
		dataIndex: 'scanReason',
		fixed: 'right',
		width: 150
	}
];

export default {
	props: {
		data: {
			type: Object,
			default: () => {
				return {};
			}
		},
		type: {
			type: String,
			default: ''
		}
	},
	components: {},
	data() {
		return {
			step: 1,
			columns: [],
			tradeColumns,
			total: 0,
			failTotal: 0,
			dataExcelScanSuccess: [],
			dataSource: [],
			accept: '.xls,.xlsx',
			previewImg: '',
			header: {
				Authorization: this.VUEX_ST_TOKEN
			},
			action: API_UPLOAD_EXCELSCAN,
			uploadKeyList: ['invoiceExcel'],
			fileListinvoiceExcel: [],
			publicPath: process.env.BASE_URL,
			strMsg: '', // 上传发票状态错误提示信息内容
			visible: false // 上传发发票状态错误提示信息弹窗
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
	created() {
		this.columns = this.tradeColumns;
		this.uploadKeyList.forEach(item => {
			this[`handleChange${item}`] = info => {
				handleUploadChange.call(this, info, item, this.setInvoiceExcelList);
			};
			this[item] = item;
		});
	},

	watch: {
		dataSource() {
			// scanStatus 0-成功 1失败
			this.failTotal = 0;
			this.total = this.dataSource.length;
			this.dataSource.forEach(item => {
				if (item.scanStatus === 1) {
					this.failTotal += 1;
				}
			});
		}
	},
	methods: {
		customRequest(data) {
			// 自定以excel附件上传函数，弹窗弹出错误提示
			const formData = new FormData();
			formData.append('file', data.file);
			let that = this;
			axios({
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: this.VUEX_ST_TOKEN,
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
					Source: 'PC'
				},
				responseType: 'json',
				url: '/dg-trade-api/api/kit/invoice/upload/excelScan?invoiceType=' + this.type,
				data: formData,
				method: 'post'
			})
				.then(response => {
					if (!response.data) {
						that.strMsg = '';
						let arr = response.data.split(';');
						if (arr.length > 0) {
							arr.forEach(item => {
								that.strMsg += item + '</br>';
							});
						}
						that.fileListinvoiceExcel = [];
						that.visible = true;
						that.dataSource = [];
					} else {
						this.fileListinvoiceExcel = [
							{
								name: data.file.name,
								uid: -1,
								status: 'done',
								url: ''
							}
						];
						this.getInvoiceListExcelScanAll();
						that.visible = false;
					}
				})
				.catch(function (error) {
					that.visible = false;
				});
		},
		confirmModal() {
			// 发票弹窗展示 消失
			this.visible = false;
		},

		save() {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确认要保存该发票吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {},
				onCancel() {}
			});
		},

		toExport(exportAll) {
			if (this.dataSource.length <= 0) {
				this.$message.info('请上传Excel文件进行识别');
				return;
			}
			const fileName = exportAll ? '上传发票清单' : '验证失败发票清单';
			const params = {
				fileName,
				exportAll
			};
			API_InvoiceExportXls(params).then(res => {
				comDownload(res, undefined, `${fileName}.xls`);
			});
		},

		setInvoiceExcelList(v, info, type) {
			if (v) {
				this.fileListinvoiceExcel = [
					{
						name: v.file.name,
						uid: -1,
						status: 'done',
						url: ''
					}
				];
				this.getInvoiceListExcelScanAll();
			} else {
				this.fileListinvoiceExcel = [
					{
						name: info.file.name,
						uid: -1,
						status: 'error',
						url: ''
					}
				];
			}
		},

		getInvoiceListExcelScanAll() {
			API_InvoiceListExcelScanAll().then(res => {
				if (res.success) {
					this.dataSource = res.data;
				}
			});
		},
		next() {
			if (this.dataSource.length <= 0) {
				this.$message.info('请上传Excel文件进行识别');
				return;
			}
			if (this.failTotal === this.total) {
				this.$message.info('没有识别成功的发票');
				return;
			}
			if (this.$route.path.indexOf('transport') >= 0) {
				this.$router.push({
					path: '/center/admin/invoice/transport/add/relation',
					query: {
						type: 'excel'
					}
				});
			} else {
				this.$router.push({
					path: '/center/admin/invoice/in/add/relation',
					query: {
						type: 'excel'
					}
				});
			}
		},

		changeStep(v) {
			if (v == 1) {
				this.step = 1;
				this.dataSource = [];
				this.fileListinvoiceExcel = [];
			}
			this.$emit('changeStep', v);
		},

		beforeUpload(file) {
			const limitFileSize = 10;
			const isSupportFileType =
				file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'application/vnd.ms-excel';
			if (!isSupportFileType) {
				this.$message.error('仅支持xls,xlsx的文件格式');
			}
			const isLimitFileSize = file.size / 1024 / 1024 <= limitFileSize;
			if (!isLimitFileSize) {
				this.$message.error(`文件大小不能超过${limitFileSize}M`);
			}
			return isSupportFileType && isLimitFileSize;
		},

		handlePreview() {},

		remove() {
			// 删除上传的excel附件，相应的删除
			this.dataSource = [];
		}
	}
};
</script>
<style lang="less" scoped>
.y {
	color: #37a193;
}
.r {
	color: #e35149;
}
.wrapper {
	background-color: #f4f5f8;
	margin: -10px -20px;
	// style="margin: -20px; margin-top: -10px;"
}
.title {
	font-size: 12px;
	color: #383a3f;
	text-align: left;
	line-height: 18px;
}
.label {
	padding-right: 56px;
	font-size: 12px;
	color: #383a3f;
	text-align: left;
}
::v-deep {
	.example,
	.ant-upload.ant-upload-select-picture-card,
	.ant-upload-list-picture-card-container,
	.ant-upload-list-item-list-type-picture-card {
		width: 240px;
		height: 150px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-card-head-title:before {
		position: absolute;
		content: '';
		display: block;
		width: 2px;
		height: 15px;
		background: #0053db;
		top: 21px;
		left: 0;
	}
}
.des {
	font-size: 12px;
	color: #6b6f76;
	line-height: 20px;
}
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
.invoice-img {
	img {
		cursor: pointer;
		width: 240px;
		height: 150px;
	}
}
.excels-upload {
	width: 600px;
	position: relative;
	> .down-file {
		position: absolute;
		top: 6px;
		left: 120px;
	}
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/common.less');
</style>
