<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">收款确认</span>
			</div>
			<div class="slTitleAssis">融资信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资编号">
					{{ fangkuanData.financingSerialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="融资方">
					{{ fangkuanData.financier }}
				</a-descriptions-item>
				<a-descriptions-item label="融资利率（%）">
					{{ fangkuanData.rate }}
				</a-descriptions-item>
				<a-descriptions-item label="出资机构">
					{{ fangkuanData.bankName }}
				</a-descriptions-item>
				<a-descriptions-item label="应收账款流水号">
					{{ fangkuanData.receivableSerialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="融资金额（元）">
					{{ fangkuanData.applyAmount }}
				</a-descriptions-item>
				<a-descriptions-item label="放款金额（元）">
					{{ fangkuanData.finAmount }}
				</a-descriptions-item>
				<a-descriptions-item label="逾期利率（%）">
					{{ fangkuanData.overdueRate }}
				</a-descriptions-item>
				<a-descriptions-item label="融资起息日">
					{{ fangkuanData.beginDate }}
				</a-descriptions-item>
				<a-descriptions-item label="融资到期日">
					{{ fangkuanData.endDate }}
				</a-descriptions-item>
			</a-descriptions>

			<div class="slTitleAssis">还款申请信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="本次还款本金（元）">
					{{ fangkuanData.repayPrincipal }}
				</a-descriptions-item>
				<a-descriptions-item label="还款日期">
					{{ fangkuanData.repayDate }}
				</a-descriptions-item>
				<a-descriptions-item label="收款方账号">
					{{ fangkuanData.receiveAccNo }}
				</a-descriptions-item>

				<a-descriptions-item label="未还本金（元）">
					{{ fangkuanData.unPayPrincipal }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收款方开户行"
					style="margin-top: 40px"
				>
					{{ fangkuanData.receiveAccBank }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收款方开户名"
					style="margin-top: 40px"
				>
					{{ fangkuanData.receiveAccName }}
				</a-descriptions-item>
			</a-descriptions>
			<a-row>
				<span style="color: red"
					>注：请及时进行收款确认操作，如果超过{{ fangkuanData.ed }}天仍未操作，系统将自动完成收款确认，目前还剩{{
						calcTimeStr
					}}</span
				>
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
					ghost
					@click="cancelApply"
					style="margin-right: 30px"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click="sumbitApply"
					v-debounceclick
					>确认收款</a-button
				>
			</div>
		</a-card>
		<a-modal
			:visible="rejectVisible"
			okText="确定"
			title="驳回"
			@cancel="
				() => {
					rejectVisible = false;
				}
			"
			@ok="handleRejectApply"
			width="30%"
		>
			<a-form :form="form">
				<a-row>
					<a-row>
						<a-col :span="24">
							<a-form-item label="请输入驳回原因">
								<a-textarea
									placeholder="请输入驳回原因"
									:auto-size="{ minRows: 3 }"
									v-decorator="[
										'reason',
										{
											rules: [
												{ required: true, message: '驳回原因必填' },
												{ max: 200, message: '驳回原因不能超过200个字' }
											],
											validateTrigger: 'blur'
										}
									]"
								>
								</a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</a-row>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import { API_GetLoanApplyDetail, API_GetLoanApplyReceipt } from '@/v2/center/financing/api/index.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import { getPopupContainer } from '@/untils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	name: 'LoanReceipt',
	data() {
		return {
			rejectVisible: false,
			getPopupContainer,
			form: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			fangkuanDataSource: [],
			fangkuanData: {},
			huikuanAccountList: [],
			calcTimeStr: '',
			huanfix: '' // 本次还款利息
		};
	},
	components: { Breadcrumb },

	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
		cancelApply() {
			this.rejectVisible = true;
		},
		handleRejectApply() {
			this.form.validateFields((error, values) => {
				if (error) return;
				API_GetLoanApplyReceipt({
					auditResult: 'REJECT',
					applyId: this.loanId,
					auditOpinion: values.reason
				}).then(r => {
					if (r.success) {
						this.$message.success('操作成功');
						this.$router.back();
					}
				});
			});
		},
		sumbitApply() {
			this.$confirm({
				centered: true,
				title: '收款确认',
				okText: '确定',
				content: '请确认还款申请信息无误并已收到款项',
				cancelText: '取消',
				onOk: () => {
					API_GetLoanApplyReceipt({
						auditResult: 'PASS',
						applyId: this.loanId
					}).then(r => {
						if (r.success) {
							this.$message.success('操作成功');
							this.$router.back();
						}
					});
				},
				onCancel() {}
			});
		},
		calcTime() {
			let time = moment(this.fangkuanData.createDate).add(this.fangkuanData.ed, 'days').diff(moment(), 'seconds');

			let t = time;
			let d = Math.floor(t / (24 * 3600)); //剩余天数，如果需要可以自行补上
			let h = Math.floor((t - 24 * 3600 * d) / 3600) + d * 24;
			let _h = Math.floor((t - 24 * 3600 * d) / 3600); //保留天数后得小时
			let m = Math.floor((t - 24 * 3600 * d - _h * 3600) / 60);
			let s = Math.floor(t - 24 * 3600 * d - _h * 3600 - m * 60);

			this.calcTimeStr = d + '天' + _h + '时' + m + '分' + s + '秒';
		},
		getDetail() {
			API_GetLoanApplyDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data;
					this.fangkuanData.ed = filterCodeByKey('repay_receive_auto_expire')[0].value;

					setInterval(() => {
						this.calcTime();
					}, 1000);
					this.calcTime();

					this.fangkuanDataSource = res.data.repayList || [];
				}
			});
		}
	}
};
</script>

<style lang="less">
.LoanReceipt {
	.fangkuan-select .ant-select-selection {
		height: 65px;
	}
	.fangkuan-select .ant-select-arrow {
		top: 23%;
	}

	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	.ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	form .ant-form-item:not(.ant-form-item-with-help) {
		margin-bottom: 24px;
	}
	form .ant-form-item.ant-form-item-with-help {
		margin-bottom: 5px;
	}

	margin: -20px;
	background-color: #f4f5f8;
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
	.ant-form-item-control {
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
	.ant-form-item-label {
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
