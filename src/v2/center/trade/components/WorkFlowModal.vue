<template>
	<modalMain
		ref="modalMain"
		:title="title"
		@close="handleCancel"
		:loading="modalLoading"
		width="440px"
		@verify="handleSubmit"
	>
		<div class="workflow-model slMain">
			<p class="desc">{{ desc }}</p>
			<a-alert
				:message="`注：${tipMessage}`"
				type="info"
				v-if="tipMessage"
				show-icon
			>
				<img
					src="~@/v2/assets/imgs/common/info_icon.png"
					width="16"
					alt=""
				/>
			</a-alert>
			<a-form
				:form="form"
				class="slFormDetail"
				@submit="handleSubmit"
			>
				<a-row
					:span="24"
					v-if="showTip"
				>
					<a-form-item
						label=""
						style="margin-bottom: 0"
					>
						<a-checkbox
							@change="offlineApprovalChange"
							v-decorator="[
								`offlineApproval`,
								{
									initialValue: false,
									rules: [
										{
											required: false,
											message: ``
										}
									]
								}
							]"
							>本次为线下审核或线下已审核</a-checkbox
						>
					</a-form-item>
				</a-row>
				<a-row>
					<a-col
						:span="24"
						v-show="coalCcsMsList.length > 1"
					>
						<a-form-item label="审批流程选择">
							<a-select
								:disabled="offlineApprovalValue"
								placeholder="请选择审批流"
								:getPopupContainer="getPopupContainer"
								:notFoundContent="!coalCcsMsList.length ? '暂无数据' : '加载中...'"
								v-decorator="[
									`chainCode`,
									{
										rules: [
											{
												required: true,
												message: `审批流程必填`,
												type: 'string'
											}
										]
									}
								]"
								@change="e => selectChange(e, 0)"
							>
								<a-select-option
									v-for="(items, index) in coalCcsMsList"
									:key="index"
									:value="items.chainCode"
								>
									{{ items.chainName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="24"
						v-for="(item, index) in systemVOList"
						:key="index"
					>
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item :label="item.systemName">
								<workflow-oa
									:disabled="offlineApprovalValue"
									:placeholder="'请选择' + item.systemName"
									v-decorator="[
										item.systemCode,
										{
											rules: [{ required: true, message: `${item.systemName}必填` }],
											validateTrigger: 'change'
										}
									]"
									@select="getSelectValue"
									:system="item"
									:ref="item.systemCode"
									:valueDefault="defaultRelationValue[item.systemCode]"
									:value="defaultRelationValue[item.systemCode]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</div>
	</modalMain>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import modalMain from '@/v2/components/modalInfo/main';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_checkContractStopConfirmOA, API_GETOAAUDITCODELIST } from '@/v2/center/trade/api/contract';
import workflowOa from '@/v2/components/workflow.vue';

export default {
	props: {
		desc: {
			type: String,
			default:
				'你的企业已对接OA，请确认流程发起人，提交后将推送OA审核， 审核通过后，将由你方进行盖章，然后由对方进行确认盖章，双方盖章后，合同终止完成。'
		},
		auditChainAndOperator: {
			type: Object,
			default: () => {}
		},
		showTip: {
			type: Boolean,
			default: false
		},
		repeatOA: {
			type: Array,
			default: () => {
				//判断流程重复时，所选流程是否在此流程中
				return [];
			}
		},
		title: {
			type: String,
			default: '确认提交'
		},
		orderId: {
			type: [String, Number],
			default: ''
		},
		action: {
			type: Function,
			default: API_checkContractStopConfirmOA
		},
		bizType: {
			type: String,
			default: 'CONTRACT_TERMINATE'
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'workFlow' }),
			coalCcsMsList: [],
			systemVOList: [],
			defaultRelationValue: {},
			tipMessage: '',
			modalLoading: false,
			offlineApprovalValue: false
		};
	},
	components: {
		workflowOa,
		modalMain
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		})
	},
	mounted() {},
	methods: {
		getPopupContainer,
		offlineApprovalChange(e) {
			this.offlineApprovalValue = e.target.checked;
		},
		initFormData() {
			this.$nextTick(() => {
				if (this.auditChainAndOperator && Object.keys(this.auditChainAndOperator).length) {
					let itemList = {};
					this.auditChainAndOperator?.operatorInfo?.forEach(item => {
						itemList = {
							...itemList,
							[item.systemCode]: {
								...item
							}
						};
					});
					this.selectChange(this.auditChainAndOperator.chainCode, 1);
					this.defaultRelationValue = itemList;
					this.form.setFieldsValue({
						...this.auditChainAndOperator
					});
					this.$nextTick(() => {
						for (const key in this.defaultRelationValue) {
							this.form.setFieldsValue({
								[key]: this.defaultRelationValue[key].operatorName + '-' + this.defaultRelationValue[key].operatorMobile
							});
						}
					});
				}
			});
		},
		showModal() {
			this.$refs.modalMain.open();
			this.getOaDataList();
		},
		handleCancel() {
			this.$refs.modalMain.close();
		},
		justifyFlex(index) {
			let type = 'start';
			if (this.coalCcsMsList.length == 1) {
				type = 'start';
			} else {
				if (index == 0) {
					type = 'center';
				} else {
					type = 'end';
				}
			}
			return type;
		},
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA'
		}),
		// 审批流信息重复性检测
		checkOaRepeatList() {
			if (!this.showTip) {
				return;
			}
			const value = this.form.getFieldsValue();
			//如果判断所选流程是否在查重流程中
			if (this.repeatOA?.length) {
				let system = this.repeatOA.filter(item => value.hasOwnProperty(item.systemCode));
				if (system?.length) {
					let str = system
						.map(item => {
							return item.systemCode;
						})
						.toString();
					this.tipMessage = `该结算单已通过${str}审批，本次${str}将不再审批`;
				} else {
					this.tipMessage = '';
				}
			} else if (this.orderId) {
				this.action({
					orderId: this.orderId,
					chainCode: value.chainCode,
					bizType: this.bizType
				}).then(res => {
					if (res.success) {
						this.tipMessage = res.data;
					}
				});
			}
		},
		handleSubmit() {
			return new Promise(resolve => {
				if (this.offlineApprovalValue) {
					this.$emit('submit', null);
					resolve(null);
					return;
				}
				this.form.validateFields((err, value) => {
					if (!err) {
						const result = {
							chainName: this.coalCcsMsList.filter(item => item.chainCode == value.chainCode)[0].chainName,
							chainCode: value.chainCode,
							operatorInfo: this.selectValueMap()
						};
						this.$emit('submit', result);
						resolve(result);
					} else {
						resolve(false);
					}
				});
			});
		},
		getOaDataList() {
			API_GETOAAUDITCODELIST().then(res => {
				if (res.success) {
					this.coalCcsMsList = res.data;
					this.initFormData();
					if (res.data.length === 1) {
						this.$nextTick(() => {
							this.form.setFieldsValue({
								chainCode: res.data[0].chainCode,
								chainName: res.data[0].chainName
							});
							this.selectChange(res.data[0].chainCode, 1);
						});
					}
				}
			});
		},
		selectChange(id, type = 0) {
			this.systemVOList = this.coalCcsMsList.filter(item => item.chainCode === id)[0].systemVOList;
			if (type == 0) {
				this.defaultRelationValue = {};
			}
			this.$nextTick(() => {
				this.checkOaRepeatList();
			});
		},
		selectValueMap() {
			let result = [];
			for (const key in this.defaultRelationValue) {
				result.push(this.defaultRelationValue[key]);
			}
			return result;
		},
		getSelectValue(item) {
			this.defaultRelationValue[item.systemCode] = item;
			this.$nextTick(() => {
				this.checkOaRepeatList();
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-form-item {
	width: 100%;
	margin-bottom: 20px;
}
.workflow-model {
	margin: 0;
	background: none;
	color: rgba(0, 0, 0, 0.4);
	.desc {
		color: rgba(0, 0, 0, 0.4);
	}
	/deep/.ant-alert-info {
		margin-top: 20px;
		border: 1px solid rgba(229, 230, 235, 1);
		background: rgba(243, 247, 255, 1);
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
		letter-spacing: 0px;
		text-align: left;
		color: rgba(0, 0, 0, 0.8);
		.ant-alert-icon {
			left: 11px;
		}
	}
	.slFormDetail {
		.ant-form-item {
			/deep/.ant-form-item-label {
				.ant-form-item-required {
					color: rgba(0, 0, 0, 0.4) !important;
				}
			}
		}
	}
}
</style>
