<template>
	<div class="FinancingApply slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收融资申请</span
				>
			</div>
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				资产信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="应收账款流水号">
					{{ receivableInfo.serialNo }}
					<span @click="editReceivable"><Edit style="cursor: pointer"></Edit></span>
				</a-descriptions-item>
				<a-descriptions-item label="应收账款金额">￥{{ formatMoney(receivableInfo.amount) }}</a-descriptions-item>
				<a-descriptions-item label="拟融资金额">￥{{ formatMoney(receivableInfo.planFinancingAmount) }}</a-descriptions-item>
				<a-descriptions-item label="合同编号">{{ receivableInfo.contractNo || '-' }}</a-descriptions-item>
				<a-descriptions-item label="买方名称">{{ receivableInfo.buyerName || '-' }}</a-descriptions-item>
				<a-descriptions-item label="卖方名称">{{ receivableInfo.sellerName || '-' }}</a-descriptions-item>
			</a-descriptions>
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				融资信息
			</div>
			<a-form
				:form="financingApplyForm"
				class="slFormDetail"
				:colon="false"
				style="padding-top: 0"
			>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="资金类型">
								<a-input
									style="width: 364px"
									:disabled="true"
									placeholder="资金类型"
									v-decorator="[
										`productItemType`,
										{
											initialValue: receivableInfo.productItemName,
											rules: [{ required: true, message: `请输入买方企业名称` }]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="出资机构">
								<a-input
									style="width: 364px"
									:disabled="true"
									placeholder="资金类型"
									v-decorator="[
										`bankName`,
										{
											initialValue: receivableInfo.bankName
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="预计融资到期日">
								<a-input
									style="width: 364px"
									:disabled="true"
									v-decorator="[
										`endDate`,
										{
											initialValue: receivableInfo.endDate
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="融资利率（%）">
								<a-select
									style="width: 364px"
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
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="融资比例（%）">
								<a-select
									style="width: 364px"
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
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="融资金额（元）">
								<a-input
									style="width: 364px"
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
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="逾期日利率（%）">
								<a-select
									style="width: 364px"
									v-decorator="[
										'overdueRate',
										{
											rules: [{ required: true, message: `逾期日利率必填` }],
											validateTrigger: 'change'
										}
									]"
									placeholder="请选择逾期日利率"
								>
									<a-select-option
										v-for="(items, index) in yuqiData"
										:key="index"
										:value="items.value"
										>{{ items.text }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<FinancingApplyDraw
			ref="financingApplyDraw"
			type="apply"
			:isShangHai="true"
		></FinancingApplyDraw>
		<TipModal
			ref="tipModal"
			@ok="saveConfirm"
			title="确认提交"
		>
			<div class="tip-box">
				<p>确定要提交该笔应收融资申请吗？</p>
				<p>
					拟融资金额：<span style="margin-right: 50px">￥{{ formatMoney(receivableInfo.amount) }}元</span>
				</p>
			</div>
		</TipModal>
		<div class="slDetailBottom">
			<a-space>
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
			</a-space>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ENV from '@/v2/config/env';
import { formatMoney } from '@sub/filters';
import { Edit } from '@sub/components/svg/index';
import FinancingApplyDraw from '@/v2/center/financing/components/FinancingApplyDraw.vue';
import TipModal from '@sub/components/DelModal.vue';
import {
	API_FinancingApplyreceivableList,
	API_FinancingApplycompanyCredit,
	API_FinancingCoreCompanyApplySave
} from '@/v2/center/financing/api/index.js';

export default {
	name: 'FinancingApply',
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			receivableListVisible: false,
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
			quantityShow: false
		};
	},
	components: {
		Breadcrumb,
		Edit,
		FinancingApplyDraw,
		TipModal
	},
	computed: {
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
		},
		receivableInfo() {
			return this.$store.state.financing.receivableInfo;
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		}
	},
	watch: {
		receivableInfo: {
			handler(info) {
				this.setFormData();
			},
			deep: true,
			immediate: true
		}
	},

	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';
	},
	methods: {
		formatMoney,
		editReceivable() {
			this.$refs.financingApplyDraw.showRelationOrderList();
		},
		changeQuantity(e) {
			let val = e.target ? e.target.value : e;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		changeQuantityFocus(e) {
			const val = e.target.value;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		computeUnit(val) {
			if (val >= 1000 && val < 10000) {
				return '千';
			} else if (val > 10000 && val <= 100000) {
				return '万';
			} else if (val > 100000 && val <= 1000000) {
				return '十万';
			} else if (val > 1000000 && val <= 10000000) {
				return '百万';
			} else {
				return '百万';
			}
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
		setFormData() {
			let record = this.receivableInfo;
			this.financingApplyForm.resetFields();
			// 回显应收账款数据
			this.receivableDataSource = [record];
			this.financingApplyForm.setFieldsValue({
				receivableSerialNo: record.serialNo,
				amount: record.planFinancingAmount,
				bankName: record.bankName,
				sellerName: record.sellerName
			});

			// 回显融资信息数据
			this.getRongZiDetail(record);

			this.fangkuanData = record;
		},
		sumbitApply() {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					receivableId: this.fangkuanData.id,
					...values
				};
				this.$refs.tipModal.open();
			});
		},
		saveConfirm() {
			this.financingApplyForm.validateFields((error, values) => {
				if (error) return;
				var params = {
					receivableId: this.fangkuanData.id,
					...values
				};
				this.$refs.tipModal.open();

				API_FinancingCoreCompanyApplySave(params).then(res => {
					if (res.success) {
						this.$router.push('/center/financing/financingList');
					}
				});
			});
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.serialNo];

						this.receivableListVisible = false;

						this.setFormData(record);
					}
				}
			};
		},

		getRongZiDetail(record) {
			API_FinancingApplycompanyCredit({ receivableId: record.id }).then(res => {
				if (res.success) {
					let data = res.data || {};
					//INVOICE(“发票结算”),PROOF(“无票结算”);
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
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
	}
}
::v-deep .fangkuan-select .ant-select-arrow {
	top: 23%;
}
::v-deep .fangkuan-select .ant-select-selection {
	height: 65px;
}
.slDetailBottom {
	width: 100%;
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
