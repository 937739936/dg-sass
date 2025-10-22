<template>
	<div class="FinancingApply">
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>票据融资申请</span>
			</div>
		</div>
		<a-form :form="financingApplyForm">
			<div class="rz-content">
				<div class="title">票据信息</div>
				<a-row>
					<a-table
						:columns="receivable"
						:dataSource="receivableDataSource"
						bordered
						:pagination="false"
						:rowKey="record => record.receivableSerialNo"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="billNo"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="openAssets(record)"
								>{{ text }}</a
							>
						</div>
					</a-table>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">融资信息</div>
				<a-row>
					<a-col :span="12">
						<a-form-item label="出资机构">
							{{ fangkuanData.bankName }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="融资比例（%）">
							<a-select
								style="width: 200px"
								v-decorator="[
									'financingRatio',
									{
										rules: [{ required: true, message: `融资比例必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择融资比例"
							>
								<a-select-option
									v-for="(items, index) in biliData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="融资利率（%）">
							<a-select
								style="width: 200px"
								v-decorator="[
									'rate',
									{
										rules: [{ required: true, message: `融资利率必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择融资利率"
							>
								<a-select-option
									v-for="(items, index) in lilvData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="逾期利率（%）">
							<a-select
								style="width: 200px"
								v-decorator="[
									'overdueRate',
									{
										rules: [{ required: true, message: `逾期利率必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择逾期利率"
							>
								<a-select-option
									v-for="(items, index) in yuqiData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-form-item label="融资金额（元）">
						<a-input
							placeholder="请输入融资金额"
							v-decorator="[
								`amount`,
								{
									rules: [
										{ required: true, message: `融资金额必填` },
										{ type: 'number', message: `请输入数字`, transform: v => Number(v) },
										{ validator: amountvalidator }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-row>

				<a-row style="margin-bottom: 20px; margin-top: 20px; border-top: 1px solid #ccc"></a-row>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="收款账号">
							<a-select
								style="width: 220px; height: 65px"
								class="fangkuan-select"
								v-decorator="[
									'loanAccountId',
									{
										rules: [{ required: true, message: `收款账号必填` }],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('f', v)"
								placeholder="请选择收款账号"
							>
								<a-select-option
									v-for="(items, index) in fangkuanAccountList"
									:key="index"
									:value="items.value"
								>
									<p>{{ items.bankName }}</p>
									<p>{{ items.bankNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="收款账号开户名">
							{{ fangkuanData.fangkuanname }}
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="收款账号开户行">
							{{ fangkuanData.fangkuanhang }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-form-item label="融资说明">
						<a-textarea
							style="width: 600px; height: 80px"
							placeholder="请输入融资说明(不超过100字)"
							:maxLength="100"
							v-decorator="[
								`remark`,
								{
									rules: [{ required: false, message: `` }],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">融资协议</div>
				<a-row>
					<a-button
						type="primary"
						ghost
						class="downbtn"
						@click="viewPDF({}, 'all')"
						>下载所有协议</a-button
					>
					<a-table
						rowKey="name"
						:columns="xieyi"
						:dataSource="xieyiDataSource"
						:pagination="false"
						:defaultExpandAllRows="true"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="action"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								style="margin-right: 10px"
								@click="viewPDF(record, 'view')"
								>查看</a
							>
							<a
								href="javascript:;"
								@click="viewPDF(record, 'down')"
								>下载</a
							>
						</div>
					</a-table>
				</a-row>
				<div style="text-align: center; margin-top: 30px">
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="sumbitApply"
						>提交</a-button
					>
				</div>
			</div>
		</a-form>
		<a-modal
			centered
			title="查看协议"
			:width="1000"
			v-model="modalPdfIsShow"
			:mask="true"
			:footer="null"
			:maskClosable="false"
			class="modal-pdf"
		>
			<pdf-preview :url="modalPdfUrl"></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import {
	API_GetAdvancePayableList,
	API_FinancingApplyAdvanceXieyi,
	API_FinancingCounterfoilApplyDetail,
	API_COMPANYACCOUNTLIST,
	API_FinancingsellerList,
	API_FinancingCounterfoilFileList,
	API_FinancingApplycompanyCredit,
	API_FinancingCounterfoilApplyXieyiView,
	API_FinancingCounterfoilApplyXieyiDown,
	API_FinancingCounterfoilApplyXieyiDownAll,
	API_FinancingCounterApplySave
} from '@/v2/center/financing/api/index.js';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import PdfPreview from '@sub/components/pdf/index.vue';
export default {
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			receivableListVisible: false,
			sellerNameList: [],
			receivableListDataSource: [],
			receivableDataSource: [],
			modalPdfIsShow: false,
			xieyiDataSource: [],
			modalPdfUrl: '',
			BASE_NET: ENV.BASE_NET,
			fangkuanData: {},
			biliData: [],
			lilvData: [],
			yuqiData: [],
			fangkuanAccountList: [],
			huikuanAccountList: [],

			selectedRowKeys: [],
			receivable: [
				{
					title: '云票编号',
					dataIndex: 'billNo',
					scopedSlots: { customRender: 'billNo' }
				},
				{
					title: '开立方',
					dataIndex: 'issuerName'
				},
				{
					title: '转让方',
					dataIndex: 'transferName'
				},

				{
					title: '接收方',
					dataIndex: 'receiverName'
				},
				{
					title: '云票金额（元）',
					dataIndex: 'billAmount'
				},
				{
					title: '开立日期',
					dataIndex: 'issueDate'
				},
				{
					title: '承诺付款日',
					dataIndex: 'acceptanceDate'
				}
			],
			xieyi: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '合同名称',
					dataIndex: 'name'
				},
				{
					title: '状态',
					dataIndex: 'statusText'
				},
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			]
		};
	},
	components: {
		PdfPreview
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	mounted() {
		this.billId = this.$route.query.id || 'xx';

		this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');

		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/counterfoil/record/yunDetail',
				query: {
					id: record.id
				}
			});

			window.open(href, '_new');
		},

		getBankAccount(companyUscc, type) {
			API_COMPANYACCOUNTLIST({ uscc: companyUscc }).then(res => {
				let data = res.data || [];
				let _array = [];
				data.forEach(item => {
					_array.push({
						bankName: item.subbranchName,
						bankNo: item.accountNo,
						value: item.id,
						bankAccountName: item.accountName
					});
				});
				if (type == 'f') {
					this.fangkuanAccountList = _array;
				} else {
					this.huikuanAccountList = _array;
				}
			});
		},
		selectAccount(type, c) {
			var currentObj = {};
			if (type == 'f') {
				this.fangkuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});

				this.fangkuanData.fangkuanhang = currentObj.bankName;
				this.fangkuanData.fangkuanname = currentObj.bankAccountName;
			} else {
				this.huikuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});
				this.fangkuanData.huikuanhang = currentObj.bankName;
				this.fangkuanData.huikuanname = currentObj.bankAccountName;
			}
		},

		amountvalidator(rule, value, callback) {
			if (this.receivableDataSource && this.receivableDataSource.length && value > this.receivableDataSource[0].billAmount) {
				callback('融资金额不能大于票据金额');
				return;
			}
			callback();
		},

		setFormData(record) {
			this.financingApplyForm.resetFields();
			// 回显预付账款数据
			this.receivableDataSource = [record];

			// 回显融资信息数据
			this.getRongZiDetail(record);

			this.fangkuanData = record;
			this.getBankAccount(record.bankUscc, 'h');
		},
		viewPDF(record, type) {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.fangkuanData,
					contractType: record.contractType,
					...values,
					billId: this.billId
				};
				if (type == 'down') {
					API_FinancingCounterfoilApplyXieyiDown(params).then(res => {
						comDownload(res, null, record.name + '.pdf');
					});
				} else if (type == 'view') {
					API_FinancingCounterfoilApplyXieyiView(params).then(res => {
						if (res.data) {
							this.modalPdfIsShow = true;
							this.modalPdfUrl = res.data;
						}
					});
				} else {
					API_FinancingCounterfoilApplyXieyiDownAll(params).then(res => {
						comDownload(res, null, '融资协议.zip');
					});
				}
			});
		},

		sumbitApply() {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.fangkuanData,
					...values,
					billId: this.billId
				};

				this.$confirm({
					centered: true,
					content: '系统将对融资合同进行签章，请确保信息无误',
					okText: '确定',
					icon: 'info-circle',
					title: '确认提示',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						API_FinancingCounterApplySave(params).then(res => {
							if (res.data) {
								if (
									this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
									this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
								) {
									this.$router.push('/center/financing/financingCounterfoilSign?id=' + res.data);
								} else {
									this.$message.success('操作成功');
									this.$router.push('/center/financing/financingCounterfoilList');
								}
							}
						});
					},
					onCancel() {}
				});
			});
		},

		getRongZiDetail(record) {
			API_FinancingApplycompanyCredit({ receivableId: record.receivableId }).then(res => {
				if (res.success) {
					let data = res.data || {};
					// //INVOICE(“发票结算”),PROOF(“无票结算”);
					let bili = record.type == 'INVOICE' ? data.ticketFinancingPercentage : data.noTicketFinancingPercentage;
					this.biliData = [
						{
							text: bili,
							value: bili
						}
					];
					this.lilvData = [
						{
							text: data.rate,
							value: data.rate
						}
					];
					this.yuqiData = [
						{
							text: data.overdueRate,
							value: data.overdueRate
						}
					];
				}
			});
		},
		getDetail() {
			API_FinancingCounterfoilApplyDetail({ billId: this.billId }).then(res => {
				if (res.success) {
					this.setFormData(res.data);
				}
			});
			API_FinancingCounterfoilFileList({ billId: this.billId }).then(res => {
				if (res.success) {
					this.xieyiDataSource = res.data || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.receivableListModel {
	::v-deep .ant-form-item {
		margin-bottom: 15px;
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
.FinancingApply {
	.downbtn {
		margin-bottom: 14px;
	}
	::v-deep .ant-tabs-bar {
		background-color: #fff;
		margin-bottom: 0;
		border: none;
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	::v-deep .ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	form .ant-form-item {
		margin-bottom: 24px;
	}
	form .ant-form-item.ant-form-item-with-help {
		margin-bottom: 5px;
	}
	margin: -20px;
	background-color: #f4f5f8;
	.fangkuan-select ::v-deep .ant-select-selection {
		height: 65px;
	}
	.fangkuan-select ::v-deep .ant-select-arrow {
		top: 23%;
	}
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
	}
	::v-deep .ant-form-item-control {
		input,
		textarea {
			width: 254px;
		}
	}
	.textarea-wrap {
		textarea {
			width: 720px;
			text-align: left !important;
		}
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
