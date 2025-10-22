<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="提交确认"
		@cancel="close"
		@ok="handleSubmit"
		width="450px"
	>
		<p class="reminder-tips">
			你的企业已对接OA，请确认流程发起人，提交后将推送OA审批。
		</p>

		<div
			class="tip-box"
			v-if="repetitionList.length"
		>
			<ConfirmIcon></ConfirmIcon>
			<div>
				<span>注：</span>
				<span
					v-for="(str, i) in repetitionList"
					:key="i"
					>{{ str }};</span
				>
			</div>
		</div>
		<div
			class="check-box"
		>
			<a-checkbox v-model="offlineApprovalFlag"> 本次为线下审批或线下已审批 </a-checkbox>
		</div>
		<a-form
			:form="form"
			class="slFormDetail"
			@submit="handleSubmit"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="审批流程">
						<a-select
							placeholder="请选择审批流"
							:getPopupContainer="getPopupContainer"
							:disabled="offlineApprovalFlag"
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
							@change="selectChange"
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
			</a-row>
			<a-row
				v-for="(item, index) in systemVOList"
				:key="index"
			>
				<a-form-item :label="item.systemName">
					<workflow-oa
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
						:disabled="offlineApprovalFlag"
						:ref="item.systemCode"
						:valueDefault="defaultRelationValue[item.systemCode]"
						:value="defaultRelationValue[item.systemCode]"
					/>
				</a-form-item>
			</a-row>
		</a-form>
	</a-modal>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETOAAUDITCODELIST } from '@/v2/center/trade/api/contract';
import workflowOa from '@/v2/components/workflow.vue';
import { cloneDeep } from 'lodash';
import { ConfirmIcon } from "@sub/components/svg"
export default {
	props: {
		type: {
			default: ''
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'workFlow' }),
			coalCcsMsList: [],
			systemVOList: [],
			defaultRelationValue: {},
			visible: false,
			info: {},
			repetitionList: [],
			/** 回显的数据 */
			echoInfo: {},
			offlineApprovalFlag: false
		};
	},
	components: {
		workflowOa,
		ConfirmIcon
	},
	computed: {
		// 发起方审批流程
		initiatorOperatorInfo() {
			if (!this.info.isInitiatorOa) {
				return [];
			}
			if (this.info.initiatorAuditChainAndOperator) {
				return this.info.initiatorAuditChainAndOperator.operatorInfo;
			}
			return [];
		},
		// 判断是否全流程相同
		isAllSame() {
			return this.repetitionList.length == this.systemVOList.length;
		}
	},
	mounted() {},
	methods: {
		getPopupContainer,
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA'
		}),
		show(info = {}, echoInfo) {
			this.info = info;
			this.offlineApprovalFlag = false;
			/** 获取自己的 审批流程 */
			this.echoInfo = echoInfo;
			this.visible = true;
			this.getOaDataList();
		},
		handleSubmit() {
			if (this.offlineApprovalFlag) {
				this.$emit('updateFunc', {}, this.isAllSame, true);
				return;
			}
			return new Promise(resolve => {
				this.form.validateFields((err, value) => {
					if (!err) {
						const auditChainAndOperator = {
							chainName: this.coalCcsMsList.filter(item => item.chainCode == value.chainCode)[0].chainName,
							chainCode: value.chainCode,
							operatorInfo: this.selectValueMap()
						};

						this.$emit('updateFunc', auditChainAndOperator, this.isAllSame, false);
						resolve(true);
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

					// this.initFormData();
					if (res.data.length === 1) {
						this.selectChange(res.data[0].chainCode);
						this.form.setFieldsValue({
							chainCode: res.data[0].chainCode,
							chainName: res.data[0].chainName
						});
					}
					if (this.echoInfo) {
						this.initData();
					}
				}
			});
		},
		initData() {
			let data = cloneDeep(this.echoInfo);
			this.selectChange(data.chainCode, 'init');
			this.form.setFieldsValue({
				chainCode: data.chainCode,
				chainName: data.chainName
			});

			let itemList = {};
			data.operatorInfo?.map(item => {
				itemList[item.systemCode] = item;
			});
			this.defaultRelationValue = itemList;
			this.form.setFieldsValue({
				...data
			});

			this.$nextTick(() => {
				for (const key in this.defaultRelationValue) {
					this.form.setFieldsValue({
						[key]: this.defaultRelationValue[key].operatorName + '-' + this.defaultRelationValue[key].operatorMobile
					});
				}
			});

			// data?.operatorInfo?.forEach(el => {
			//   this[`handleSearchYu${el.systemCode}`] = () => {
			//     this.handleSearchYu(el, el.systemCode);
			//   };
			// })
			// this.chainCodeChange(data)
		},
		getSystemVOListFromList(chainCode) {
			for (let i = 0; i < this.coalCcsMsList.length; i++) {
				if (this.coalCcsMsList[i].chainCode === chainCode) {
					return this.coalCcsMsList[i].systemVOList;
				}
			}
		},
		chainCodeChange(v, isNeedEmpty = false) {
			this.systemVOList = v.systemVOList || this.getSystemVOListFromList(v.key || v.chainCode);
			this.auditChainAndOperator = {
				chainName: v?.label?.replace(/\n|\s/g, '') || v?.chainName,
				chainCode: v.key || v.chainCode,
				operatorInfo: isNeedEmpty ? [] : this.auditChainAndOperator.operatorInfo
			};

			(this.systemVOList || []).forEach(item => {
				this[`handleSearchYu${item.systemCode}`] = v => {
					this.handleSearchYu(v, item.systemCode);
				};
			});
			if (!isNeedEmpty) {
				this.systemVOListOri = this.systemVOList;
			}
		},
		close() {
			this.visible = false;
		},
		selectChange(id, type) {
			this.systemVOList = this.coalCcsMsList.filter(item => item.chainCode === id)[0].systemVOList;
			if (type != 'init') {
				const obj = {};
				this.systemVOList.forEach(el => {
					obj[el.systemCode] = undefined;
					this.defaultRelationValue[el.systemCode] = undefined;
				});
				this.$nextTick(() => {
					this.form.setFieldsValue(obj);
				});
			}

			this.repetitionList = [];
			this.systemVOList.forEach(el => {
				const flag = this.initiatorOperatorInfo.some(el2 => el2.systemCode == el.systemCode);
				if (flag) {
					const str = `${el.systemCode}已对该补协做过审批，本次将自动跳过${el.systemCode}审批`;
					this.repetitionList.push(str);
				}
			});
		},
		selectValueMap() {
			let result = [];
			for (const key in this.defaultRelationValue) {
				const flag = this.systemVOList.some(el => el.systemCode == key);
				if (flag) {
					result.push(this.defaultRelationValue[key]);
				}
			}
			return result;
		},
		getSelectValue(item) {
			this.defaultRelationValue[item.systemCode] = item;
		}
	}
};
</script>

<style lang="less" scoped>
.ant-form-item {
	width: 364px;
}
.check-box {
	font-size: 14px;
	margin-top: 20px;
	/deep/ .ant-checkbox-inner {
		border-radius: 4px;
	}
	/deep/ .ant-checkbox + span {
		color: var(--text-80, rgba(0, 0, 0, 0.8));
	}
}
.tip-box {
	margin-top: 20px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	background: #f3f7ff;
	padding: 12px;
	display: flex;
	align-items: flex-start;
	color: rgba(0, 0, 0, 0.8);
	img {
		position: relative;
		top: 3px;
		margin-right: 12px;
	}
}
.slModal {
	/deep/ .ant-modal-header {
		padding-left: 20px;
		padding-right: 20px;
	}
	/deep/ .ant-modal-body {
		padding-left: 20px;
		padding-right: 20px;
	}
	/deep/ .ant-btn-primary {
		margin-left: 20px;
	}
}
</style>
