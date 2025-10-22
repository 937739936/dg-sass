<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">还款登记</span>
			</div>
			<div class="slTitleAssis">放款信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资编号">{{ financingData.financingApplySerialNo }}</a-descriptions-item>
				<a-descriptions-item label="出资机构">{{ financingData.bankName }}</a-descriptions-item>
				<a-descriptions-item label="逾期利率">{{ financingData.overdueRate }}%</a-descriptions-item>
				<a-descriptions-item label="融资放款日期">{{ financingData.beginDate }}</a-descriptions-item>
				<a-descriptions-item label="融资方">{{ financingData.financier }}</a-descriptions-item>
				<a-descriptions-item label="融资利率">{{ financingData.rate }}%</a-descriptions-item>
				<a-descriptions-item label="放款金额">
					<span style="color: #f46332"> ¥{{ formatMoney(financingData.finAmount) }} </span>
				</a-descriptions-item>
				<!-- <a-descriptions-item label="放款金额(元)">{{ financingData.finAmount }}</a-descriptions-item> -->
				<a-descriptions-item label="融资到期日期">{{ financingData.endDate }}</a-descriptions-item>
			</a-descriptions>
			<div class="slTitleAssis">还款登记</div>
			<a-form
				:form="applyForm"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="还款总额(元)">
							<a-input
								disabled
								v-inputTip
								prefix="￥"
								:value="getTotal()"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="未还本金(元)">
							<a-input
								disabled
								v-inputTip
								prefix="￥"
								:value="financingData.unPayPrincipal || '-'"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="还款日期">
							<a-date-picker
								:getCalendarContainer="getPopupContainer"
								:disabled-date="disabledDate"
								v-decorator="[
									`repayDate`,
									{
										rules: [{ required: true, message: `请选择还款日期` }],
										validateTrigger: 'change'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-form-item label="还款本金(元)">
							<a-input
								v-inputTip
								prefix="￥"
								placeholder="请输入还款本金"
								@change="v => principalChange(v)"
								v-decorator="[
									`principal`,
									{
										rules: [
											{ required: true, message: `还款本金必填` },
											{
												pattern: numberReg,
												message: '请输入数字，最多两位小数'
											},
											{
												validator: validator,
												message: `还款本金超出未还本金，请核对后提交`
											}
										],
										validateTrigger: 'change'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="还款利息(元)">
							<a-input
								v-inputTip
								prefix="￥"
								v-if="financingData.forwardCharge == 1"
								disabled
								:value="0"
							/>
							<a-input
								v-else
								v-inputTip
								prefix="￥"
								placeholder="请输入还款利息"
								v-decorator="[
									`interest`,
									{
										rules: [
											{ required: true, message: `还款利息必填` },
											{
												pattern: numberReg,
												message: '请输入数字，最多两位小数'
											}
										],
										validateTrigger: 'change'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="其他费用(元)">
							<a-input
								v-inputTip
								prefix="￥"
								placeholder="请输入其他费用"
								v-decorator="[
									`serviceCharge`,
									{
										rules: [
											{ required: true, message: `其他费用必填` },
											{
												pattern: numberReg,
												message: '请输入数字，最多两位小数'
											}
										],
										validateTrigger: 'change'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<template v-if="hasReplyList">
				<div class="slTitleAssis">还款登记</div>
				<div style="color: red; margin-bottom: 30px">可登记还款本金合计(元)：{{ countSum() }}</div>
				<a-row>
					<a-table
						rowKey="id"
						class="new-table"
						:columns="fangkuanApply"
						:dataSource="fangkuanApplyDataSource"
						:pagination="false"
						:defaultExpandAllRows="true"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="serialNo"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="$router.push('/center/loan/loanApplyDetail?id=' + record.id + '')"
							>
								{{ text }}
							</a>
						</div>
					</a-table>
				</a-row>
			</template>
			<div class="butSub">
				<a-button
					type="primary"
					ghost
					@click="$router.back()"
					style="margin-right: 20px"
					>返回</a-button
				>
				<a-button
					type="primary"
					@click="save"
					>提交</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GetLoanHuanDetail, API_LoanHuanSave } from '@/v2/center/financing/api/index.js';
import { getPopupContainer } from '@/untils/factory.js';
import { formatMoney } from '@sub/filters';
import Breadcrumb from '@/v2/components/breadcrumb/index';
const customRender = text => text || '-'; //空数据用-代替
export default {
	name: 'LoanHuanHn',
	data() {
		return {
			getPopupContainer,
			formatMoney,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			financingData: {},
			huanfix: '', // 本次还款利息
			fangkuanApplyDataSource: [],
			hasReplyList: false,
			fangkuanApply: [
				{
					title: '还款申请编号',
					dataIndex: 'serialNo',
					scopedSlots: { customRender: 'serialNo' }
				},
				{
					title: '融资方',
					dataIndex: 'financier',
					customRender
				},
				{
					title: '核心企业',
					dataIndex: 'buyerName',
					customRender
				},
				{
					title: '还款申请金额(元)',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '已登记还款本金(元)',
					dataIndex: 'registeredAmount'
				},
				{
					title: '可登记还款本金(元)',
					dataIndex: 'statusText',
					customRender: (v, r) => (r.repayPrincipal - r.registeredAmount).toFixed(2)
				},
				{
					title: '本次登记还款本金(元)',
					dataIndex: 'thisPrincipal'
				}
			]
		};
	},
	components: { Breadcrumb },
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getLoanHuanDetail();
	},

	methods: {
		getLoanHuanDetail() {
			API_GetLoanHuanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.financingData = res.data;
					//   this.applyForm.setFieldsValue({ 'endDate': this.financingData.endDate })
					this.fangkuanApplyDataSource = res.data.repayApplyList || [];
					this.hasReplyList = this.financingData.repayApplyFlag != 'IGNORE';
				}
			});
		},
		principalChange(e) {
			var v = Number(e.target.value);
			var i = 0;

			while (v > 0 && i < this.fangkuanApplyDataSource.length) {
				let cur = this.fangkuanApplyDataSource[i];
				let can = (cur.repayPrincipal - cur.registeredAmount).toFixed(2);

				if (v >= can) {
					cur.thisPrincipal = can;
					v = v - can;
					i++;
				} else {
					cur.thisPrincipal = v;
					break;
				}
			}
		},
		getTotal() {
			let v =
				Number(this.applyForm.getFieldValue('principal') || 0) +
				Number(this.applyForm.getFieldValue('interest') || 0) +
				Number(this.applyForm.getFieldValue('serviceCharge') || 0);
			return v.toFixed(2);
		},

		validator(rule, value, callback) {
			value = Number(value);
			var finAmount = this.financingData.unPayPrincipal || 0;
			if (value > finAmount) {
				callback(true);
			}
			callback();
		},
		countSum() {
			let v = 0;
			this.fangkuanApplyDataSource.forEach(item => {
				v = v + Number((item.repayPrincipal - item.registeredAmount).toFixed(2));
			});
			return v;
		},
		disabledDate() {
			// 时间限制在融资起息日和融资到期日之间
			//   var start = moment(this.financingData.beginDate).add(1, 'd').valueOf() > value
			//   var end = moment(this.financingData.endDate).add(1, 'd').valueOf() < value
			return false;
		},
		save() {
			this.applyForm.validateFields((error, values) => {
				if (error) return;
				if (this.hasReplyList && values.principal > this.countSum()) {
					this.$message.error('本次可登记的还款本金≤' + this.countSum() + '元，超出部分请先完成还款申请');
					return;
				}
				this.$confirm({
					centered: true,
					title: '确定提交吗?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						var repayDate = this.applyForm.getFieldValue('repayDate').format('YYYY-MM-DD');
						var repayApplyRegisterVoList = this.fangkuanApplyDataSource
							.map(o => {
								return { applyId: o.id, principal: o.thisPrincipal };
							})
							.filter(r => r.principal);
						if (repayApplyRegisterVoList.length == 0) {
							repayApplyRegisterVoList = null;
						}
						API_LoanHuanSave({
							...values,
							interest: this.financingData.forwardCharge == 1 ? 0 : values.interest,
							loanId: this.loanId,
							repayDate: repayDate,
							repayApplyRegisterVoList
						}).then(res => {
							if (res.data) {
								this.$message.success('还款登记成功');
								this.$router.back();
							}
						});
					}
					// onCancel() {}
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
		background-color: #f3f5f6;
		color: #77889d;
		min-height: 48px;
		padding: 12px;
	}

	/deep/ .ant-descriptions-bordered .ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		min-height: 48px;
		padding: 12px;
	}
	/deep/.ant-form-item {
		width: 364px;
		.ant-form-explain {
			font-size: 14px !important;
		}
	}
	.butSub {
		margin-top: 30px;
		text-align: center;
		button {
			padding: 0 30px;
		}
	}
}
</style>
