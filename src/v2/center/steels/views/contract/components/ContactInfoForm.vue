<template>
	<a-form
		ref="contactForm"
		:form="contactForm"
		:hideRequiredMark="VUEX_ST_ORDERCREATEINFO.flag == 'edit'"
		id="contactForm"
		:label-col="{
			span: 6
		}"
		:wrapper-col="{
			span: 16
		}"
	>
		<a-row>
			<div class="template-btn-wrap">
				<h3 style="margin: 30px 0; font-size: 18px">联系人信息<span class="red-sim">（合同提交时，必须填写）</span></h3>
			</div>
			<a-row>
				<a-col :span="12">
					<a-form-item :label="tipInfo.aName">
						<a-select
							:disabled="disabled"
							@select="contactOneSelect"
							@dropdownVisibleChange="dropdownVisibleChange"
							placeholder="请选择甲方"
							v-decorator="[
								'firstPartyContactName',
								{
									rules: [{ required: true, message: '甲方联系人必填' }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in contactOneList"
								:key="index"
								:value="items.id"
							>
								<p>{{ items.contactName }}</p>
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item :label="tipInfo.aTel">
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'firstPartyContactPhone',
								{
									rules: [
										{ required: true, message: `手机号必填` },
										{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确请重新输入！' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					v-if="contractTemplate == 'STEEL_PROFILE'"
				>
					<a-form-item label="甲方收货人身份证号">
						<a-input
							:disabled="true"
							v-decorator="[
								'firstPartyContactIdCard',
								{
									rules: [{ required: true, message: `甲方收货人身份证号` }]
								}
							]"
							placeholder=""
						/>
					</a-form-item>
				</a-col>
				<div v-if="!['STEEL_PROFILE'].includes(contractTemplate)">
					<a-col
						:span="12"
						v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(contractTemplate)"
					>
						<a-form-item label="微信">
							<a-input
								:disabled="$route.query.type == 'detail'"
								v-decorator="[
									'firstPartyWechatId',
									{
										rules: [{ required: true, message: `微信必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(contractTemplate)"
					>
						<a-form-item label="联系邮箱">
							<a-input
								:disabled="true"
								v-decorator="[
									'firstPartyContactEmail',
									{
										rules: [{ required: true, message: `联系邮箱必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="甲方联系人地址">
							<a-input
								:disabled="true"
								v-decorator="[
									'firstPartyContactAddress',
									{
										rules: [{ required: true, message: `甲方联系人地址必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
				</div>
			</a-row>
			<a-row>
				<a-col :span="12">
					<a-form-item :label="tipInfo.bName">
						<a-select
							:disabled="disabled"
							@select="contactSecondSelect"
							@dropdownVisibleChange="dropdownVisibleChange"
							placeholder="请选择乙方联系人"
							v-decorator="[
								'secondPartyContactName',
								{
									rules: [{ required: true, message: `乙方联系人姓名必填` }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in contactSecondList"
								:key="index"
								:value="items.id"
							>
								<p>{{ items.contactName }}</p>
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item :label="tipInfo.bTel">
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'secondPartyContactPhone',
								{
									rules: [
										{ required: true, message: `乙方联系人手机号必填` },
										{ pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确请重新输入！' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<div v-if="!['STEEL_PROFILE'].includes(contractTemplate)">
					<a-col
						:span="12"
						v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(contractTemplate)"
					>
						<a-form-item label="微信">
							<a-input
								:disabled="$route.query.type == 'detail'"
								v-decorator="[
									'secondPartyWechatId',
									{
										rules: [{ required: true, message: `微信必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(contractTemplate)"
					>
						<a-form-item label="联系邮箱">
							<a-input
								:disabled="true"
								v-decorator="[
									'secondPartyContactEmail',
									{
										rules: [{ required: true, message: `联系邮箱必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="乙方联系人地址">
							<a-input
								:disabled="true"
								v-decorator="[
									'secondPartyContactAddress',
									{
										rules: [{ required: true, message: `乙方联系人地址必填` }]
									}
								]"
								placeholder=""
							/>
						</a-form-item>
					</a-col>
				</div>
			</a-row>
		</a-row>
	</a-form>
</template>
<script>
import { mapGetters } from 'vuex';
import { API_COMPANYLINKMANFINDBYCOMPANYID } from '@/v2/center/steels/api/contract.js';
export default {
	name: 'ContactInfoForm',
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		}),
		tipInfo() {
			const obj = {
				FINISHED_STEEL_BUY_002: {
					aName: '甲方联系人',
					aTel: '甲方联系人手机号',
					bName: '乙方联系人',
					bTel: '乙方联系人手机号'
				},
				FINISHED_STEEL_BUY_004: {
					aName: '甲方联系人',
					aTel: '甲方联系人手机号',
					bName: '乙方联系人',
					bTel: '乙方联系人手机号'
				},

				STEEL_PROFILE: {
					aName: '甲方指定收货人',
					aTel: '甲方收货人手机号',
					bName: '乙方联系人姓名',
					bTel: '乙方联系人手机号'
				}
			};
			return obj[this.contractTemplate] || obj.FINISHED_STEEL_BUY_002;
		}
	},
	components: {},
	props: [
		'disabled',
		'type',
		'contactData',
		'contractTemplate',
		// 甲方合同
		'partyAContactId',
		// 乙方合同
		'partyBContactId',
		// 乙方
		'partyB',
		// 甲方
		'partyA',
		// 后台坑爹 定义有问题
		'partyAWechatId',
		'partyBWechatId'
	],
	data() {
		return {
			contactForm: this.$form.createForm(this),
			mybuyerContactId: this.partyAContactId,
			mysellerContactId: this.partyBContactId,
			contactOneList: [],
			contactSecondList: []
		};
	},
	watch: {
		partyB: {
			handler(val) {
				if (!val) return;
				this.contactForm.setFieldsValue({
					secondPartyContactName: null,
					secondPartyContactPhone: null,
					secondPartyContactAddress: null,
					secondPartyContactEmail: null,
					secondPartyWechatId: null
				});
				this.getContactList(true);
			},
			deep: true,
			immediate: true
		},
		partyA: {
			handler(val) {
				if (!val) return;
				this.contactForm.setFieldsValue({
					firstPartyContactName: null,
					firstPartyContactPhone: null,
					firstPartyContactAddress: null,
					firstPartyContactEmail: null,
					firstPartyWechatId: null
				});
				this.getContactList(true);
			},
			deep: true,
			immediate: true
		}
	},

	mounted() {
		// this.getContactList(true)
	},
	methods: {
		dropdownVisibleChange(v) {
			if (!v) return;
			this.getContactList();
		},
		getFormValue() {
			const info = this.contactForm.getFieldsValue();
			return {
				buyerContactId: this.mybuyerContactId,
				sellerContactId: this.mysellerContactId,
				...info
			};
		},
		async getContactList(init) {
			let resone = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.partyA
			});
			this.contactOneList = resone.success ? resone.data : [];
			if (this.partyB) {
				let ressec = await API_COMPANYLINKMANFINDBYCOMPANYID({
					companyId: this.partyB
				});
				this.contactSecondList = ressec.success ? ressec.data : [];
			}
			if (init) {
				this.contactOneSelect(this.partyAContactId);
				this.contactSecondSelect(this.partyBContactId);
			}
		},
		contactSecondSelect(v) {
			if (!v) return;

			let currentItem = null;
			this.contactSecondList.forEach(item => {
				if (item.id == v) {
					this.mysellerContactId = item.id;
					currentItem = item;
				}
			});
			if (!currentItem) {
				this.mysellerContactId = null;
				return;
			}

			this.contactForm.setFieldsValue({
				secondPartyContactName: currentItem.contactName,
				secondPartyContactPhone: currentItem.contactPhone,
				secondPartyContactAddress: currentItem.contactArea + currentItem.contactAddress,
				secondPartyContactEmail: currentItem.contactEmail,
				secondPartyWechatId: currentItem.wechatId || this.partyBWechatId || currentItem.contactPhone
			});
		},
		contactOneSelect(v) {
			if (!v) return;
			let currentItem = null;

			this.contactOneList.forEach(item => {
				if (item.id == v) {
					this.mybuyerContactId = item.id;
					currentItem = item;
				}
			});

			if (!currentItem) {
				this.mybuyerContactId = null;
				return;
			}
			this.contactForm.setFieldsValue({
				firstPartyContactName: currentItem.contactName,
				firstPartyContactPhone: currentItem.contactPhone,
				firstPartyContactIdCard: currentItem.contactIdCard,
				firstPartyContactAddress: currentItem.contactArea + currentItem.contactAddress,
				firstPartyContactEmail: currentItem.contactEmail,
				firstPartyWechatId: currentItem.wechatId || this.partyAWechatId || currentItem.contactPhone
			});
		}
	}
};
</script>

<style lang="less">
.templateModal {
	over-flow: scroll;

	.search-wrap {
		padding: 0;
		margin-bottom: 12px;

		.row {
			margin-bottom: 12px;

			.ant-row {
				width: 100%;

				.ant-form-item-label {
					text-align: left;
				}
			}
		}
	}
}

#contactForm {
	.template-btn-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	button {
		margin-left: 20px;
	}

	.s-modal {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 100;

		& > div {
			height: 100%;
			width: 800px;
			margin: 0 auto;
			overflow: hidden;
		}

		.content {
			background: #fff;
			height: auto;
			max-height: 750px;
			overflow: hidden;
			overflow-y: auto;
			padding: 0 30px;
			border-radius: 8px;
			position: relative;
		}

		.btn {
			width: 90%;
			margin: 20px 0;
			text-align: right;
		}
	}

	.s-modal {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 100;

		& > div {
			height: 100%;
		}

		.content {
			background: #fff;
			width: 400px;
			height: auto;
			max-height: 750px;
			overflow: hidden;
			overflow-y: auto;
			background: #ffffff;
			padding: 0 30px;
			border-radius: 8px;
			position: relative;
		}

		.btn {
			width: 90%;
			margin: 20px 0;
			background: #fff;
		}
	}
}
</style>
