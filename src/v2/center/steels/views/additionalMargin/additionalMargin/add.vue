<template>
	<div class="new-detail">
		<div class="steps-wrap">
			<SlStep
				:currentStep="1"
				:list="steps"
			></SlStep>
		</div>
		<MySteelInfo
			v-if="isMySteel"
			:contract="materialInfo.contract"
			:marketPrice="materialInfo.marketPrice"
			:bondCalcInfo="materialInfo.bondCalcInfo"
		></MySteelInfo>
		<OtherInfo
			v-else
			:contract="materialInfo.contract"
		></OtherInfo>
		<div
			class="new-detail-content detail-form"
			style="margin-top: 70px; padding-top: 0px"
		>
			<h2>追保信息</h2>
			<a-form
				:form="form"
				style="margin-top: 20px"
				v-bind="formItemLayout"
				labelAlign="left"
			>
				<a-row class="df form">
					<a-form-item label="追保金额">
						<a-input-number
							style="width: 100%"
							:precision="2"
							:min="0"
							v-decorator="[`amount`, { rules: [{ required: true, message: `请输入追保金额` }] }]"
						/>
					</a-form-item>
					<!-- 收款账号 -->
					<a-form-item label="收款账号">
						<a-select
							placeholder="请选择"
							style="width: 100%"
							@change="changeBank"
							:getPopupContainer="getPopupContainer"
							v-decorator="[`receiveBankAccountId`, { rules: [{ required: true, message: `请选择收款账号`, type: 'string' }] }]"
						>
							<i
								slot="suffixIcon"
								class="icon-gengduoshaixuan-xialajiantou1 iconfont"
								style="fontsize: 14px; color: #000"
							/>
							<a-select-option
								v-for="(items, index) in bankList"
								:key="index"
								:value="items.id"
								>{{ items.accountName }}</a-select-option
							>
						</a-select>
					</a-form-item>
					<a-form-item label="开户行">
						<a-input
							disabled
							style="width: 100%"
							v-decorator="[`receiveBankName`]"
						/>
					</a-form-item>
					<!-- 签发日期 -->
					<a-form-item label="签发日期">
						<a-date-picker
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							:allowClear="false"
							style="width: 100%"
							v-decorator="[
								'signDate',

								{ rules: [{ required: true, message: '请选择签发日期' }], initialValue: moment().format('YYYY-MM-DD') }
							]"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-date-picker>
					</a-form-item>
					<!-- 追保截止日期 -->
					<a-form-item label="追保截止日期">
						<a-date-picker
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							:allowClear="false"
							style="width: 100%"
							v-decorator="['deadLineDate']"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-date-picker>
					</a-form-item>
					<a-form-item label="账号">
						<a-input
							disabled
							style="width: 100%"
							v-decorator="[`receiveBankCardNo`]"
						/>
					</a-form-item>
				</a-row>
			</a-form>
		</div>
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-col
				span="24"
				style="text-align: center"
			>
				<a-button
					type="primary"
					class="btn"
					@click="handleSubmit('preview')"
				>
					追保函预览</a-button
				>
				<a-button
					class="btn"
					@click.native="$router.back()"
					style="margin-left: 50px"
					>取消</a-button
				>
				<a-button
					type="primary"
					class="btn btn1"
					@click="handleSubmit('submit')"
					style="margin-left: 50px"
				>
					提交</a-button
				>
			</a-col>
		</a-row>
		<PdfView ref="pdfView"></PdfView>
	</div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import {
	getMaterialDetail,
	saveBondLetter,
	submitBondLetter,
	previewBondLetter
} from '@/v2/center/steels/api/additionalMargin.js';
import { getPopupContainer } from '@/untils/factory.js';
import { API_COMPANYACCOUNTLISTBYCOMPANYID } from '@/v2/center/steels/api/contract.js';
import PdfView from '../components/pdfView.vue';
import OtherInfo from '@sub/components/steels/OtherInfo.vue';
import MySteelInfo from '@sub/components/steels/MySteelInfo.vue';
import SlStep from '@sub/components/ui-new/sl-step.vue';
import moment from 'moment';
export default {
	data() {
		return {
			formItemLayout: {
				labelCol: { span: 6 },
				wrapperCol: { span: 16 }
			},
			getPopupContainer,
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写追保信息'
				},
				{
					title: '完成'
				}
			],
			form: this.$form.createForm(this),
			// 银行列表
			bankList: [],
			materialInfo: {
				contract: {},
				marketPrice: [],
				bondCalcInfo: {}
			},
			moment
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isMySteel() {
			return this.$route.query.marketPriceSource == 'MYSTEEL_COM';
		}
	},
	mounted() {
		this.getMaterialDetail();
		this.getBankList();
		// 默认签发日期
	},
	methods: {
		// 获取合同详情
		async getMaterialDetail() {
			const params = {
				contractId: this.$route.query.contractId
			};
			const res = await getMaterialDetail(params);
			this.materialInfo = res.data;
			if (this.isMySteel) {
				const info = this.materialInfo.bondCalcInfo || { baseUnitPrice: 0, marketUnitPrice: 0, noCollectionQuantity: 0 };
				const amount = ((info.baseUnitPrice - info.marketUnitPrice) * info.noCollectionQuantity).toFixed(2);
				this.$nextTick(() => {
					this.form.setFieldsValue({ amount });
				});
			}
		},
		// 获取银行账号
		async getBankList(companyId) {
			const params = {
				companyId: this.VUEX_ST_COMPANYSUER.companyId
			};
			const res = await API_COMPANYACCOUNTLISTBYCOMPANYID(params);
			this.bankList = res.data;
		},
		changeBank(id) {
			const item = this.bankList.find(el => el.id == id);
			this.form.setFieldsValue({
				receiveBankName: item.subbranchName,
				receiveBankCardNo: item.accountNo
			});
		},
		handleSubmit(type) {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					const params = {
						...values,
						contractId: this.$route.query.contractId
					};
					if (this.$route.query.id) {
						params.id = this.$route.query.id;
					}

					if (values.deadLineDate) {
						const num = moment(values.deadLineDate).diff(moment(values.signDate), 'days');
						if (num < 0) {
							this.$message.error('追保截止日期不能早于签发日期');
							return;
						}
					}
					const item = this.bankList.find(el => el.id == params.receiveBankAccountId) || {};
					params.receiveAccountName = item.accountName;

					if (type == 'preview') {
						const res = await previewBondLetter(params);
						this.$refs.pdfView.show(res.data);
					}
					if (type == 'submit') {
						this.$confirm({
							centered: true,
							title: '确定提交?',
							okText: '确定',
							cancelText: '取消',
							onOk: async () => {
								await submitBondLetter(params);
								this.$message.success('操作成功');
								// this.$router.go(-1)
								this.$router.push({
									path: '/center/steels/additionalMargin/additionalMargin/list'
								});
							},
							onCancel() {}
						});
					}
				}
			});
		}
	},
	components: {
		PdfView,
		OtherInfo,
		MySteelInfo,
		SlStep
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-form-item-label {
}
/deep/ label {
	color: rgba(0, 0, 0, 0.8) !important;
}
.df {
	display: flex;
	flex-wrap: wrap;
	/deep/ .ant-form-item {
		width: 33%;
		display: flex;
		flex-direction: column;
	}
}
/deep/ .form {
	.ant-form-item-control {
		width: 364px;
	}
	.ant-form-item-control,
	.ant-input,
	.ant-select,
	.ant-input-number,
	.ant-select-selection {
		height: 40px;
	}
	.ant-select-selection__rendered,
	.ant-select-selection-selected-value,
	.ant-input-number-input {
		height: 40px;
		line-height: 40px;
		color: rgba(0, 0, 0, 0.8);
	}
	.ant-input-number,
	.ant-input,
	.ant-select-selection {
		border-radius: 6px;
		border: 1px solid rgba(139, 157, 184, 0.3);
	}
	.ant-input-disabled {
		background: #f0f3fb;
	}
}
.calendar {
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: middle;
	background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
	background-size: contain;
	line-height: 38px !important;
	top: 40%;
}
.btn {
	width: 126px;
	height: 44px;
	background: #ffffff;
	border-radius: 6px;
	border: 1px solid @primary-color;
	color: @primary-color;
}
.btn1 {
	background: @primary-color;
	color: #fff;
}
</style>
