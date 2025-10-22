<template>
	<a-form
		ref="contactForm"
		:form="contactForm"
		:hideRequiredMark="VUEX_ST_ORDERCREATEINFO.flag == 'edit'"
		id="contactForm"
	>
		<a-row>
			<div class="template-btn-wrap">
				<h3 style="margin: 30px 0; font-size: 18px">联系人信息<span class="red-sim">（订单提交时，必须填写）</span></h3>
			</div>
			<a-row>
				<a-col :span="12">
					<a-form-item
						label="甲方（买方）联系人"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-select
							:disabled="disabled"
							@select="contactOneSelect"
							@dropdownVisibleChange="dropdownVisibleChange"
							placeholder="请选择甲方（买方）联系人"
							v-model="mybuyerContactsId"
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
			</a-row>

			<a-row>
				<a-col :span="12">
					<a-form-item
						label="甲方联系人姓名"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'firstPartyContactName',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `甲方联系人姓名必填`
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="甲方联系人手机号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'firstPartyContactPhone',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `甲方联系人手机号必填`
										},
										{
											pattern: /^1[3456789]\d{9}$/,
											message: '手机号格式不正确请重新输入！'
										}
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="甲方联系人所在区"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							v-decorator="[
								'firstPartyContactArea',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `甲方联系人所在地区必填`
										}
									]
								}
							]"
							placeholder=""
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="甲方联系人详细地址"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'firstPartyContactAddress',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `甲方联系人详细地址必填`
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="甲方联系人电子邮箱"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'firstPartyContactEmail',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `甲方联系人电子邮箱必填`
										},
										{ type: 'email', message: '邮箱格式不正确' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="12">
					<a-form-item
						label="乙方（卖方）联系人"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-select
							:disabled="disabled"
							@select="contactSecondSelect"
							@dropdownVisibleChange="dropdownVisibleChange"
							placeholder="请选择乙方（卖方）联系人"
							v-model="mysellerContactsId"
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
			</a-row>
			<a-row>
				<a-col :span="12">
					<a-form-item
						label="乙方联系人姓名"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'secondPartyContactName',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `乙方联系人姓名必填`
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="乙方联系人手机号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'secondPartyContactPhone',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `乙方联系人手机号必填`
										},
										{
											pattern: /^1[3456789]\d{9}$/,
											message: '手机号格式不正确请重新输入！'
										}
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="乙方联系人所在地区"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							v-decorator="[
								'secondPartyContactArea',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `乙方联系人所在地区必填`
										}
									]
								}
							]"
							placeholder=""
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="乙方联系人详细地址"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'secondPartyContactAddress',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `乙方联系人详细地址必填`
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="乙方联系人电子邮箱"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							placeholder=""
							v-decorator="[
								'secondPartyContactEmail',
								{
									rules: [
										{
											required: VUEX_ST_ORDERCREATEINFO.flag == 'submit',
											message: `乙方联系人电子邮箱必填`
										},
										{ type: 'email', message: '邮箱格式不正确' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-row>
	</a-form>
</template>
<script>
import { mapGetters } from 'vuex';
import { API_COMPANYLINKMANFINDBYCOMPANYID } from '@/v2/api/account';

export default {
	name: 'ContactInfoForm',
	computed: {
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {},
	props: ['disabled', 'buyerContactsId', 'sellerContactsId', 'sellerId', 'buyerId'],
	data() {
		return {
			contactForm: this.$form.createForm(this),
			mybuyerContactsId: this.buyerContactsId,
			mysellerContactsId: this.sellerContactsId,
			contactOneList: [],
			contactSecondList: []
		};
	},

	mounted() {
		this.getContactList(true);
	},
	methods: {
		dropdownVisibleChange(v) {
			if (!v) return;
			this.getContactList();
		},
		getFormValue() {
			return {
				buyerContactsId: this.mybuyerContactsId,
				sellerContactsId: this.mysellerContactsId
			};
		},
		async getContactList(init) {
			let resone = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.buyerId
			});
			this.contactOneList = resone.success ? resone.data : [];

			let ressec = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.sellerId
			});
			this.contactSecondList = ressec.success ? ressec.data : [];

			if (init) {
				this.contactOneSelect(this.buyerContactsId);
				this.contactSecondSelect(this.sellerContactsId);
			}
		},
		contactSecondSelect(v) {
			if (!v) return;
			let currentItem = null;

			this.contactSecondList.forEach(item => {
				if (item.id == v) {
					this.mysellerContactsId = item.id;
					currentItem = item;
				}
			});
			if (!currentItem) {
				this.mysellerContactsId = null;
				return;
			}

			this.contactForm.setFieldsValue({
				secondPartyContactName: currentItem.contactName,
				secondPartyContactPhone: currentItem.contactPhone,
				secondPartyContactArea: currentItem.contactArea,
				secondPartyContactAddress: currentItem.contactAddress,
				secondPartyContactEmail: currentItem.contactEmail
			});
		},
		contactOneSelect(v) {
			if (!v) return;
			let currentItem = null;

			this.contactOneList.forEach(item => {
				if (item.id == v) {
					this.mybuyerContactsId = item.id;
					currentItem = item;
				}
			});

			if (!currentItem) {
				this.mybuyerContactsId = null;
				return;
			}

			this.contactForm.setFieldsValue({
				firstPartyContactName: currentItem.contactName,
				firstPartyContactPhone: currentItem.contactPhone,
				firstPartyContactArea: currentItem.contactArea,
				firstPartyContactAddress: currentItem.contactAddress,
				firstPartyContactEmail: currentItem.contactEmail
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
