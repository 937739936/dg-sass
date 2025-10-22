<template>
	<div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
			@submit="handleSubmit"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="乙方（卖方）">
						<!-- 选择框 -->
						<a-select
							:disabled="!isBuyContract"
							:getPopupContainer="getPopupContainer"
							showSearch
							:notFoundContent="!buyerOrSellerData.length ? '加载中...' : null"
							:defaultActiveFirstOption="false"
							:filter-option="filterOption"
							v-decorator="[
								`sellerCompanyName`,
								{
									initialValue: VUEX_ST_COMPANYSUER.companyName,
									rules: [
										{
											required: true,
											message: `乙方（卖方）必填`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in buyerOrSellerData"
								:key="index"
								:value="items.bizLicenseNo"
							>
								{{ items.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="businessType != 'OTHER'"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="上游实际负责人">
							<!-- 选择框 -->
							<a-select
								placeholder="请选择上游实际负责人"
								:disabled="isOa"
								:getPopupContainer="getPopupContainer"
								showSearch
								:notFoundContent="!upDownUserList.length ? '加载中...' : null"
								:filterOption="filterOption"
								:defaultActiveFirstOption="false"
								v-decorator="[
									`directorBusinessOwnershipId`,
									{
										rules: [
											{
												required: true,
												message: `上游实际负责人必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in upDownUserList"
									:key="index"
									:value="items.id"
								>
									{{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="businessType != 'OTHER'"
				>
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item
							label="下游实际负责人"
							required
						>
							<!-- 选择框 -->
							<a-select
								placeholder="请选择下游实际负责人"
								:disabled="isOa"
								:getPopupContainer="getPopupContainer"
								showSearch
								:notFoundContent="!upDownUserList.length ? '加载中...' : null"
								:filterOption="filterOption"
								:defaultActiveFirstOption="false"
								v-decorator="[
									`terminalDirectorId`,
									{
										rules: [
											{
												required: true,
												message: `下游实际负责人必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in upDownUserList"
									:key="index"
									:value="items.id"
								>
									{{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						:justify="businessType == 'OTHER' ? 'center' : 'start'"
					>
						<a-form-item label="甲方（买方）">
							<!-- 选择框 -->
							<a-select
								placeholder="请选择甲方（买方）"
								:disabled="isBuyContract"
								:getPopupContainer="getPopupContainer"
								showSearch
								:defaultActiveFirstOption="false"
								:filter-option="filterOption"
								@change="getBussinessAcceptList"
								:notFoundContent="!buyerOrSellerData.length ? '加载中...' : null"
								v-decorator="[
									`buyerUscc`,
									{
										rules: [
											{
												required: true,
												message: `甲方（买方）必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in buyerOrSellerData"
									:key="index"
									:value="items.bizLicenseNo"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					style="display: none"
				>
					<a-form-item label="乙方（卖方）企业uscc">
						<!-- 选择框 -->
						<a-select
							:disabled="!isBuyContract"
							:getPopupContainer="getPopupContainer"
							showSearch
							:notFoundContent="!buyerOrSellerData.length ? '加载中...' : null"
							:defaultActiveFirstOption="false"
							:filter-option="filterOption"
							v-decorator="[
								`sellerUscc`,
								{
									initialValue: VUEX_ST_COMPANYSUER.companyUscc,
									rules: [
										{
											required: true,
											message: `乙方（卖方）必填`,
											type: 'string'
										}
									]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in buyerOrSellerData"
								:key="index"
								:value="items.bizLicenseNo"
							>
								{{ items.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						:justify="businessType == 'OTHER' ? 'end' : 'center'"
					>
						<a-form-item label="买方业务接收人">
							<!-- 选择框 -->
							<a-select
								placeholder="请选择买方业务接收人"
								:getPopupContainer="getPopupContainer"
								showSearch
								:notFoundContent="!bussinessAcceptList.length ? '加载中...' : null"
								:filterOption="filterOption"
								:defaultActiveFirstOption="false"
								v-decorator="[
									`buyerUserMobile`,
									{
										rules: [
											{
												required: true,
												message: `买方业务接收人必填`,
												type: 'string'
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in bussinessAcceptList"
									:key="index"
									:value="items.mobile"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<ConfirmModal
			ref="confirmModal"
			okText="确认"
			:cancelBtnVisible="false"
		></ConfirmModal>
	</div>
</template>

<script>
import { getPopupContainer, filterOption } from '@/v2/utils/factory.js';
import {
	API_listTerminalDirector,
	API_listBusinessUserAccept,
	API_validCompanyIsInRiskBlack,
	API_GETBUYERLIST
} from '@/v2/center/trade/api/contract';
import { API_GET_COMPANYINFO_BY_USCC } from '@/v2/api/common';
import { mapGetters, mapMutations } from 'vuex';
import ConfirmModal from '@/v2/components/modal/ConfirmModal.vue';

export default {
	props: {
		isBuyContract: {
			type: Boolean,
			default: false
		},
		isOa: {
			type: Boolean,
			default: false
		}
	},
	components: {
		ConfirmModal
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'buyAndSell' }),
			buyerOrSellerData: [],
			upDownUserList: [],
			bussinessAcceptList: [],
			contractInfo: {},
			businessType: ''
		};
	},
	watch: {
		VUEX_GET_CONTRACT_DATA: {
			handler(newVal) {
				if (!Object.keys(newVal).length) return;
				this.businessType = newVal?.contract?.businessType;
			},
			immediate: true,
			deep: true
		},
		buyerOrSellerData: {
			handler() {},
			immediate: true,
			deep: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_CONTRACT_OTHER_DATA: 'VUEX_GET_CONTRACT_OTHER_DATA'
		})
	},
	mounted() {
		if (!this.isOa && !this.$route.query.id) {
			this.initFormData();
		}
		this.getCompanyInfo(this.VUEX_ST_COMPANYSUER?.company?.uscc, 'sell');
	},
	methods: {
		getPopupContainer,
		filterOption,
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA'
		}),
		updateBusinessType(type) {
			this.businessType = type;
		},
		getCompanyInfo(uscc, type) {
			API_GET_COMPANYINFO_BY_USCC({
				uscc
			}).then(res => {
				if (res.success) {
					if (type == 'buy') {
						this.contractInfo['buyPersonName'] = res.data.legalPersonName;
						this.contractInfo['buyerCompanyAddress'] = res.data.address;
					} else {
						this.contractInfo['sellerPersonName'] = res.data.legalPersonName;
						this.contractInfo['sellerCompanyAddress'] = res.data.address;
					}
				}
			});
		},
		handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
						this.VUEX_SET_STEP1_CONTRACT_DATA({
							acceptUser: {
								sellerCompanyUserId: this.VUEX_ST_COMPANYSUER.companyUserId,
								sellerUserMobile: this.VUEX_ST_PERSONALLINFO.mobile,
								sellerUserName: this.VUEX_ST_PERSONALLINFO.name,
								buyerCompanyUserId: this.bussinessAcceptList.filter(item => item.mobile === value.buyerUserMobile)[0].id,
								buyerUserMobile: value.buyerUserMobile,
								buyerUserName: this.bussinessAcceptList.filter(item => item.mobile === value.buyerUserMobile)[0].name
							}
						});
						this.VUEX_SET_STEP1_CONTRACT_DATA({
							contract: {
								...value,
								// 保存企业信息，提交订单需要
								buyCompanyUscc: value.buyerUscc,
								sellerName: this.VUEX_ST_COMPANYSUER.companyName,
								sellerCompanyName: this.VUEX_ST_COMPANYSUER.companyName,
								buyerName: this.buyerOrSellerData.filter(item => item.bizLicenseNo === value.buyerUscc)[0].name,
								buyerCompanyName: this.buyerOrSellerData.filter(item => item.bizLicenseNo === value.buyerUscc)[0].name,
								sellerCompanyId: this.VUEX_ST_COMPANYSUER.companyId,
								buyerCompanyId: this.buyerOrSellerData.filter(item => item.bizLicenseNo === value.buyerUscc)[0].id,
								...this.contractInfo
							}
						});
						resolve(true);
					} else {
						resolve(false);
					}
				});
			});
		},
		initFormData() {
			return new Promise(async resolve => {
				this.$emit('loading', true);
				await this.getBuyAndSellList();
				await this.getUpDownUserList();
				const newVal = this.VUEX_GET_CONTRACT_DATA;
				const uscc = newVal?.contract?.buyCompanyUscc || newVal?.contract?.buyerUscc;
				await this.getBussinessAcceptList(uscc);
				this.$nextTick(() => {
					this.form.setFieldsValue({
						sellerCompanyName: this.VUEX_ST_COMPANYSUER.companyName,
						...newVal.acceptUser,
						...newVal.contract,
						sellerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
						buyerUscc: uscc
					});
					const directorBusinessOwnershipId = this.VUEX_GET_CONTRACT_DATA?.contract?.directorBusinessOwnershipId; //上游实际负责人
					const terminalDirectorId = this.VUEX_GET_CONTRACT_DATA?.contract?.terminalDirectorId; //下游实际负责人
					const buyerUserMobile =
						this.VUEX_GET_CONTRACT_DATA?.contract?.buyerUserMobile || this.VUEX_GET_CONTRACT_DATA?.acceptUser?.buyerUserMobile;
					const bussinessAcceptIdsList = this.bussinessAcceptList?.map(item => item.mobile);
					if (!this.upDownUserList.find(item => item.id == directorBusinessOwnershipId)) {
						this.form.setFieldsValue({
							directorBusinessOwnershipId: undefined
						});
					}
					if (!this.upDownUserList.find(item => item.id == terminalDirectorId)) {
						this.form.setFieldsValue({
							terminalDirectorId: undefined
						});
					}
					if (!buyerUserMobile || !bussinessAcceptIdsList.includes(buyerUserMobile)) {
						this.form.setFieldsValue({
							buyerUserMobile: undefined
						});
					}
					this.$emit('loading', false);
					resolve(true);
				});
			});
		},
		// 获取甲方
		async getBuyAndSellList() {
			await API_GETBUYERLIST({
				searchKeys: ''
			}).then(res => {
				if (res.success) {
					this.buyerOrSellerData = res.data;
				}
			});
		},
		// 获取上游负责人
		async getUpDownUserList() {
			await API_listTerminalDirector().then(res => {
				if (res.success) {
					this.upDownUserList = res.data;
				}
			});
		},
		// 获取买方业务接收人uscc
		getBussinessAcceptList(uscc) {
			if (!uscc) return;
			this.judgeFunc(uscc);
			this.getCompanyInfo(uscc, 'buy');
			this.form.setFieldsValue({
				buyerUserMobile: undefined
			});
			this.$emit('companyChange', this.buyerOrSellerData.filter(item => item.bizLicenseNo === uscc)[0]?.id);
			return API_listBusinessUserAccept({
				companyUscc: uscc
			}).then(res => {
				if (res.success) {
					this.bussinessAcceptList = res.data;
				}
			});
		},
		judgeFunc(uscc) {
			API_validCompanyIsInRiskBlack({
				companyUscc: uscc
			}).then(res => {
				if (res.success && res.result) {
					const modalObj = {
						modalTitle: '提示',
						modalText: res.result
					};
					this.$refs.confirmModal.showModal(modalObj);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
</style>
