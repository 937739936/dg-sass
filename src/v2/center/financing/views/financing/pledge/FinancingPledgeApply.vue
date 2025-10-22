<template>
	<div class="FinancingApply">
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>货押融资申请</span>
			</div>
		</div>
		<a-form :form="financingApplyForm">
			<div class="rz-content">
				<div class="title">资产信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="请选择资产">
							<a-input
								readOnly
								@click="showReceivableList"
								v-decorator="[
									'receivableSerialNo',
									{
										validateTrigger: 'change',
										rules: [{ required: true, message: '请选择资产' }]
									}
								]"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-table
						:columns="receivableList"
						:dataSource="receivableDataSource"
						bordered
						:scroll="{ x: true }"
						:pagination="false"
						:rowKey="record => record.serialNo"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="serialNo"
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
							{{ fangkuanData.bankName || '-' }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="融资申请金额（元）">
							<a-input
								placeholder="请输入融资申请金额"
								v-decorator="[
									`amount`,
									{
										rules: [
											{ required: true, message: `融资申请金额必填` },
											{ pattern: numberRegN, message: '请输入数字，最多两位小数' },
											{ type: 'number', message: `请输入数字`, transform: v => Number(v) },
											{ validator: amountvalidator }
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>

					<a-col :span="12">
						<a-form-item label="预计融资起息日">
							<a-date-picker
								v-decorator="[
									`beginDate`,
									{
										rules: [
											{
												required: true,
												message: `预计融资起息日必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>

					<a-col :span="12">
						<a-form-item label="预计融资到期日">
							<a-date-picker
								v-decorator="[
									`endDate`,
									{
										rules: [
											{
												required: true,
												message: `预计融资到期日必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="是否可提前还款">
							<a-radio-group
								name="radioGroup"
								v-decorator="[
									`prepayment`,
									{
										rules: [
											{
												required: true,
												message: `是否可提前还款必填`
											}
										]
									}
								]"
							>
								<a-radio value="1">是</a-radio>
								<a-radio value="0">否</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="可提前还款日">
							<a-date-picker
								:disabled="financingApplyForm.getFieldValue('prepayment') == 0"
								v-decorator="[
									`prepaymentDate`,
									{
										rules: [
											{
												required: !(financingApplyForm.getFieldValue('prepayment') == 0),
												message: `还款日期`
											}
										],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row style="margin-bottom: 20px; margin-top: 20px; border-top: 1px solid #ccc"></a-row>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="融资收款账号">
							<a-select
								style="width: 220px; height: 65px"
								class="fangkuan-select"
								v-decorator="[
									'loanAccountId',
									{
										rules: [
											{
												required: true,
												message: `融资收款账号必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('f', v)"
								placeholder="请选择融资收款账号"
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
						<a-form-item label="资金监管账号">
							<a-select
								style="width: 220px; height: 65px"
								class="fangkuan-select"
								v-decorator="[
									'fundAccountId',
									{
										rules: [
											{
												required: true,
												message: `资金监管账号必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('j', v)"
								placeholder="请选择资金监管账号"
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
						<a-form-item label="资金方收款账号">
							<a-select
								style="width: 220px; height: 65px"
								class="fangkuan-select"
								v-decorator="[
									'acctAccountId',
									{
										rules: [
											{
												required: true,
												message: `资金方收款账号必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('h', v)"
								placeholder="请选择资金方收款账号"
							>
								<a-select-option
									v-for="(items, index) in huikuanAccountList"
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
						<a-form-item label="融资收款账号开户名">
							{{ fangkuanData.fangkuanname }}
						</a-form-item>
						<a-form-item
							label="资金监管账号开户名"
							style="margin-top: 48px"
						>
							{{ fangkuanData.jianname }}
						</a-form-item>
						<a-form-item
							label="资金方收款账号开户名"
							style="margin-top: 55px"
						>
							{{ fangkuanData.huikuanname }}
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="融资收款账号开户行">
							{{ fangkuanData.fangkuanhang }}
						</a-form-item>
						<a-form-item
							label="资金监管账号开户行"
							style="margin-top: 48px"
						>
							{{ fangkuanData.jianhang }}
						</a-form-item>
						<a-form-item
							label="资金方收款账号开户行"
							style="margin-top: 55px"
						>
							{{ fangkuanData.huikuanhang }}
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
				<div class="title">费用明细</div>
				<a-row>
					<a-col :span="12">
						<a-form-item label="融资利率（%）">
							{{ feeData.rate }}
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="逾期利率（%）">
							{{ feeData.overdueRate }}
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="宽限期利率（%）">
							{{ feeData.gracePeriodRate }}
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="宽限期（天）">
							{{ feeData.gracePeriodDay }}
						</a-form-item>
					</a-col>
				</a-row>
				<div
					v-for="(item, index) in feeData.feeList || []"
					:key="index"
					style="margin-top: 10px"
				>
					<div style="font-size: 14px; margin-bottom: 10px">{{ item.feeTypeText }}</div>
					<a-row>
						<a-col :span="12">
							<a-form-item label="是否收取">
								{{ item.isFeeText || '-' }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="计费规则">
								{{ item.serviceMethodText || '-' }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="计费方式">
								{{ item.feeModeText || '-' }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="费率（%）">
								{{ item.rate || '-' }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="收取方式">
								{{ item.collectionMethodText || '-' }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							v-if="item.incomeByDayText"
						>
							<a-form-item label="是否按日计息">
								{{ item.incomeByDayText || '-' }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
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
			</div>

			<FinancingLiu
				ref="FinancingLiu"
				bizType="MORTGAGE_FINANCING_APPLY"
			/>

			<div style="text-align: center; padding-bottom: 40px; margin-top: -10px; background-color: #fff">
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
		</a-form>

		<a-modal
			:visible="receivableListVisible"
			:width="1300"
			dialogClass="receivableListModel"
			@cancel="
				() => {
					receivableListVisible = false;
				}
			"
			@ok="okModel"
		>
			<a-row style="margin-top: 20px">
				<a-form
					:label-col="{
						span: 8
					}"
					:wrapper-col="{
						span: 14
					}"
				>
					<a-col
						:span="9"
						class="row"
					>
						<a-form-item label="货押资产编号">
							<a-input
								v-model="queryParams.serialNo"
								placeholder="请输入货押资产编号"
							></a-input>
						</a-form-item>
						<a-form-item label="仓储企业">
							<a-input
								v-model="queryParams.warehouseCompanyName"
								placeholder="请输入仓储企业"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="9"
						class="row"
					>
						<a-form-item label="金融机构">
							<a-select
								v-model="queryParams.bankUscc"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in chuziData"
									:key="index"
									:value="items.value"
								>
									{{ items.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="货押资产申请日">
							<a-range-picker
								v-model="queryParams.time1"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getTime"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="6"
						class="row"
					>
						<a-form-item
							label=" "
							:colon="false"
						></a-form-item>
						<a-form-item
							label=" "
							:colon="false"
						>
							<a-button
								type="primary"
								@click.native="getReceivableList"
								>查询</a-button
							>
							<a-button
								style="margin-left: 20px"
								@click.native="resetValues"
								>重置</a-button
							>
						</a-form-item>
					</a-col>
				</a-form>
			</a-row>
			<a-row>
				<a-table
					:columns="receivableList"
					:dataSource="receivableListDataSource"
					bordered
					:pagination="true"
					:scroll="{ x: true }"
					:rowKey="record => record.serialNo"
					@change="handleTableChange"
					:rowSelection="rowSelection"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</a-row>
		</a-modal>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import {
	API_FinancingApplyreceivableListPledge,
	API_FinancingApplyXieyi,
	API_COMPANYACCOUNTLIST,
	API_FinancingApplyXieyiDownAll,
	API_FinancingApplyXieyiView,
	API_FinancingApplyXieyiDown,
	API_FinancingApplySave,
	API_FinancingApplypledge,
	API_FinancingbankList
} from '@/v2/center/financing/api/index.js';
import _ from 'lodash';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import PdfPreview from '@sub/components/pdf/index.vue';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
export default {
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			receivableListVisible: false,
			receivableListDataSource: [],
			receivableDataSource: [],
			xieyiDataSource: [],
			BASE_NET: ENV.BASE_NET,
			fangkuanData: {},
			fangkuanAccountList: [],
			huikuanAccountList: [],
			jianguanAccountList: [],
			financingApplyFeeCollectionData: filterCodeByKey('financingApplyFeeCollectionDict'),
			numberReg: /^100$|^(\d|[1-9]\d)(\.\d{1,2})?$/,
			numberRegN: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			feeData: {},
			queryParams: {
				contractNo: null,
				buyerName: null,
				serialNo: null,
				terminalName: null,
				pageSize: 10,
				pageNo: 1
			},
			selectedRowKeys: [],
			chuziData: [],
			receivableList: [
				{
					title: '货押资产编号',
					dataIndex: 'serialNo',
					key: 'serialNo',
					fixed: 'left',
					scopedSlots: { customRender: 'serialNo' }
				},
				{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
				{ title: '货主名称', dataIndex: 'sellerName', key: 'sellerName' },
				{ title: '仓储企业', dataIndex: 'warehouseCompanyName', key: 'warehouseCompanyName' },
				{ title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity' },
				{ title: '质押货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
				{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
				{ title: '拟融资金额（元）', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount' },
				{ title: '货押资产申请日期', dataIndex: 'requestTime', key: 'requestTime' }
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
		PdfPreview,
		FinancingLiu
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.serialNo];

					this.currentRecord = record; // eslint-disable-line
				}
			};
		}
	},

	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';

		this.getReceivableList();
		this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');
		API_FinancingbankList().then(res => {
			var list = res.data || [];
			list.forEach(item => {
				this.chuziData.push({
					text: item.name,
					value: item.bizLicenseNo
				});
			});
		});
	},
	methods: {
		okModel() {
			if (this.currentRecord) {
				this.setFormData(this.currentRecord);
			}

			this.receivableListVisible = false;
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
				if (type == 'f' || type == 'j') {
					this.fangkuanAccountList = _array;
					this.jianguanAccountList = _array;
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
			} else if (type == 'j') {
				this.jianguanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});

				this.fangkuanData.jianhang = currentObj.bankName;
				this.fangkuanData.jianname = currentObj.bankAccountName;
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

		resetValues() {
			this.queryParams = {
				warehouseCompanyName: null,
				serialNo: null,
				bankUscc: null,
				pageSize: 10,
				pageNo: 1
			};
			this.getReceivableList();
		},
		handleTableChange() {
			this.getReceivableList();
		},
		amountvalidator(rule, value, callback) {
			if (
				this.receivableDataSource &&
				this.receivableDataSource.length &&
				value > this.receivableDataSource[0].planFinancingAmount
			) {
				callback('融资金额不能大于拟融资金额');
				return;
			}
			callback();
		},

		showReceivableList() {
			this.receivableListVisible = true;
			this.getReceivableList();
		},
		getReceivableList() {
			API_FinancingApplyreceivableListPledge({
				...this.queryParams,
				time1: null
			}).then(res => {
				this.receivableListDataSource = res.data.records || [];
				if (this.financingApplyId && !this.hasInit) {
					this.hasInit = true;
					// debugger
					let record = _.find(this.receivableListDataSource, { id: Number(this.financingApplyId) });
					this.setFormData(record);
				}
			});
		},

		setFormData(record) {
			this.financingApplyForm.resetFields();
			// 回显预付账款数据
			this.receivableDataSource = [record];
			setTimeout(() => {
				this.financingApplyForm.setFieldsValue({
					receivableSerialNo: record.serialNo,
					amount: record.planFinancingAmount
				});
			}, 400);

			this.fangkuanData = record;
			this.getBankAccount(record.bankUscc, 'h');

			// 回显融资附件列表

			this.getDetail(record.id);
		},
		viewPDF(record, type) {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.getParams(values),
					contractType: record.contractType
				};
				if (type == 'down') {
					API_FinancingApplyXieyiDown(params).then(res => {
						comDownload(res, null, record.name + '.pdf');
					});
				} else if (type == 'view') {
					API_FinancingApplyXieyiView(params).then(res => {
						if (res.data) {
							window.open(res.data, '_blank');
						}
					});
				} else {
					API_FinancingApplyXieyiDownAll(params).then(res => {
						comDownload(res, null, '融资协议.zip');
					});
				}
			});
		},

		getParams(values) {
			var params = {
				...this.fangkuanData,
				receivableId: this.fangkuanData.id,
				...values,
				prepaymentDate: values.prepaymentDate ? values.prepaymentDate.format('YYYY-MM-DD') : null,
				beginDate: values.beginDate.format('YYYY-MM-DD'),
				endDate: values.endDate.format('YYYY-MM-DD'),

				...this.feeData
			};

			return params;
		},
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/pledge/detail',
				query: {
					id: record.id
				}
			});

			window.open(href, '_new');
		},
		async sumbitApply() {
			let auditChainAndOperator = null;
			try {
				auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
			} catch (e) {
				auditChainAndOperator = e;
			}

			if (!auditChainAndOperator) {
				return;
			}
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					...this.getParams(values),
					auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
				};

				this.$confirm({
					centered: true,
					content: '系统将进行融资申请提交，请确保信息无误',
					okText: '确定',
					icon: 'info-circle',
					title: '确认提示',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						API_FinancingApplySave(params).then(res => {
							if (res.data) {
								this.$message.success('操作成功');
								this.$router.back();
							}
						});
					},
					onCancel() {}
				});
			});
		},

		getTime(value, dateString) {
			this.queryParams.requestDateBegin = dateString[0];
			this.queryParams.requestDateEnd = dateString[1];
		},

		getDetail(receivableId) {
			API_FinancingApplyXieyi({ receivableId: receivableId }).then(res => {
				if (res.success) {
					this.xieyiDataSource = res.data || [];
				}
			});

			API_FinancingApplypledge({ assetId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.feeData = res.data || {};
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
		width: 250px;
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
			width: 130px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
