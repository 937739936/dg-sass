<template>
	<a-modal
		:title="title"
		destroyOnClose
		:maskClosable="false"
		:width="650"
		:visible="visible"
		:confirmLoading="confirmLoading"
		okText="确定"
		cancelText="取消"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<a-form
			v-bind="formLayout"
			:form="form"
		>
			<a-row>
				<a-form-item label="账户名称">
					<a-input
						v-decorator="[
							'accountName',
							{
								rules: [{ required: true, message: `账户名称必填` }]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="银行账号">
					<a-input
						v-decorator="[
							'accountNo',
							{
								rules: [
									{ required: true, message: `银行账号必填` },
									{ pattern: /^\d+$/, message: '银行账号只能是数字' }
								]
							}
						]"
					/>
				</a-form-item>
			</a-row>
			<a-row>
				<a-form-item label="账户类型">
					<a-select
						v-decorator="[
							'accountType',
							{
								rules: [{ required: true, message: '账户类型必填', type: 'string' }]
							}
						]"
					>
						<a-select-option
							v-for="(items, index) in selectData.singleCode"
							:key="index"
							:value="items.value"
							>{{ items.text }}</a-select-option
						>
					</a-select>
				</a-form-item>
			</a-row>
			<a-row>
				<a-form-item label="银行名称">
					<a-auto-complete
						v-decorator="[
							'bankName',
							{
								rules: [{ required: true, message: '银行名称必填', type: 'string' }]
							}
						]"
						@change="
							form.resetFields(['subbranchName']);
							// selectData.provice = null;
							// selectData.city = null;
							selectData.branchList = [];
						"
						:dataSource="selectData.bankList"
						placeholder="输入银行名称"
						@focus="getBankList"
						:filterOption="filterOption"
					/>
				</a-form-item>
			</a-row>

			<a-row>
				<a-form-item label="开户省">
					<a-select
						:notFoundContent="selectData.provice ? '暂无数据' : '加载中...'"
						placeholder="选择开户省"
						@focus="getProvList"
						@change="
							form.resetFields(['city', 'subbranchName']);
							selectData.city = null;
							selectData.branchList = [];
						"
						v-decorator="[
							'province',
							{
								rules: [{ required: true, message: '开户省必填', type: 'string' }]
							}
						]"
					>
						<a-select-option
							v-for="(item, index) in selectData.provice"
							@click="changeProvince(item.name)"
							:key="item.code"
							:value="item.code"
							>{{ item.name }}</a-select-option
						>
					</a-select>
				</a-form-item>
			</a-row>

			<a-row>
				<a-form-item label="开户城市">
					<a-select
						placeholder="请先选择开户省，再选择开户城市"
						:notFoundContent="selectData.city ? '暂无数据' : '加载中...'"
						@focus="getCityList"
						@change="
							form.resetFields(['subbranchName']);
							selectData.branchList = [];
						"
						v-decorator="[
							'city',
							{
								rules: [{ required: true, message: '开户城市必填', type: 'string' }]
							}
						]"
					>
						<a-select-option
							v-for="(item, index) in selectData.city"
							@click="changeCity(item.name)"
							:key="item.code"
							:value="item.code"
							>{{ item.name }}</a-select-option
						>
					</a-select>
				</a-form-item>
			</a-row>

			<a-row>
				<a-form-item label="开户行名称">
					<a-select
						showSearch
						v-decorator="[
							'subbranchName',
							{
								rules: [{ required: true, message: '开户行名称必填', type: 'string' }]
							}
						]"
						placeholder="输入开户行关键字"
						@search="searchBranchList"
					>
						<!-- <template slot="dataSource"> -->
						<a-select-option
							v-for="obj in selectData.branchList"
							:key="obj.bankCode"
							:value="obj.bankCode + ',' + obj.lname"
							>{{ obj.lname }}</a-select-option
						>
						<!-- <a-select-option
                disabled
                :key="9999"
                :value="'more'"
                class="select-show-all"
                v-if="selectData.branchList.length >= 10">
                <a href="javascript:void(0)" class="more-btn" @click="loadMore">
                  {{ loadMoreText }}
                </a>
              </a-select-option> -->
						<!-- </template> -->
					</a-select>
				</a-form-item>
			</a-row>
			<a-row>
				<a-form-item label="备注">
					<a-input
						placeholder="可输入账户限额等信息"
						:maxLength="100"
						v-decorator="['remark']"
					/>
				</a-form-item>
			</a-row>
		</a-form>
	</a-modal>
</template>
<script>
import { API_BIZPROVINCELIST, API_BIZCITYLIST } from '@/v2/center/person/api';
import {
	API_COMPANYACCOUNT,
	API_COMPANYACCOUNTEDIT,
	API_COMPANYACCOUNTLISTBANK,
	API_COMPANYACCOUNTLISTSUBBRANCH
} from '@/v2/api/account';
import { filterCodeByValueName, filterCodeByTextName, filterCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			id: '',
			province: '',
			city: '',
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 15
				}
			},

			bankList: [],
			title: '添加银行账户',
			visible: false,
			confirmLoading: false,
			type: 'add',
			editItems: null,
			selectData: {
				singleCode: filterCodeByKey('bankAccountTypeDict'),
				bankList: null,
				provice: null,
				city: null,
				branchList: []
			},
			currentSelectPage: 1,
			loadMoreText: '查看更多',
			timer: null,
			getBranchDone: true
		};
	},

	created() {
		this.getBankList();
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	methods: {
		changeProvince(name) {
			this.province = name;
		},
		changeCity(name) {
			this.city = name;
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},

		showModal(type, data) {
			this.id = (data && data.id) || '';
			if (data) this.editItems = data;
			this.visible = true;
			this.type = type;
			if (type == 'add') {
				this.form.resetFields();
				this.title = '添加银行卡';
				this.editItems = null;
				this.$nextTick(() => {
					this.form.setFieldsValue({
						accountName: this.VUEX_ST_COMPANYSUER.companyName
					});
				});
			}
			if (type == 'modify') {
				this.title = '修改银行卡';
				let { bankName, city, no, province, type, subbranchName, name } = this.editItems;
				this.selectData.branchList = [
					{
						bankCode: this.editItems.subbranchNo,
						lname: this.editItems.subbranchName
					}
				];
				type = filterCodeByValueName(type, 'bank_account_type');
				this.$nextTick(() => {
					this.form.setFieldsValue({
						...this.editItems,
						province: this.editItems.provinceCode,
						city: this.editItems.cityCode
					});
					this.province = province;
					this.city = city;
					setTimeout(() => {
						if (this.id) {
							this.getProvList();
							this.getCityList();
						}
					}, 300);
				});
			}
		},

		handleCancel() {
			this.visible = false;
		},

		handleOk() {
			this.$nextTick(() => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						if (this.selectData && this.selectData.bankList && !this.selectData.bankList.includes(values.bankName)) {
							this.form.setFields({
								['bankName']: {
									value: values.bankName,
									errors: [
										{
											message: '请选择下拉列表内的银行名称',
											field: 'bankName'
										}
									]
								}
							});
							return;
						}
						if (values.subbranchName.indexOf(',') == -1 && this.selectData.branchList && this.selectData.branchList.length) {
							values.subbranchName = this.selectData.branchList[0].bankCode + ',' + values.subbranchName;
						}
						let getBranchResult = this.selectData.branchList.some(item => {
							return item.lname == values.subbranchName.split(',')[1];
						});
						if (this.selectData && this.selectData.branchList && !getBranchResult) {
							this.form.setFields({
								['subbranchName']: {
									value: values.subbranchName.split(',')[1],
									errors: [
										{
											message: '请选择下拉列表内的开户行名称',
											field: 'subbranchName'
										}
									]
								}
							});
							return;
						}
						values.subbranchNo = values.subbranchName.split(',')[0];
						values.subbranchName = values.subbranchName.split(',')[1];
						if (this.type == 'add') {
							this.addBankAccount(values);
						} else {
							if (filterCodeByTextName(values.type, 'bank_account_type') == this.editItems.type) {
								values.type = this.editItems.type;
							}
							this.modifyBankAccount(values);
						}
						// this.form.setFieldsValue({id, idcard, name, area, address, mobile})
					}
				});
			});
		},

		addBankAccount(data) {
			const { province, city } = data;
			API_COMPANYACCOUNT({
				...data,
				province: this.province,
				city: this.city,
				provinceCode: province,
				cityCode: city
			}).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.form.resetFields();
					this.visible = false;

					this.$emit('change');
				}
			});
		},

		modifyBankAccount(data) {
			const { province, city } = data;
			API_COMPANYACCOUNTEDIT(
				{
					...data,
					province: this.province,
					city: this.city,
					provinceCode: province,
					cityCode: city
				},
				this.id
			).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.visible = false;
					this.$emit('change');
				}
			});
		},

		getBankList() {
			if (this.selectData.bankList && this.selectData.bankList.length) return;
			API_COMPANYACCOUNTLISTBANK().then(res => {
				if (res.success) {
					this.selectData.bankList = res.data;
				}
			});
		},

		getProvList() {
			this.form.validateFields([], (err, values) => {
				if (!err) {
					API_BIZPROVINCELIST({ countryCode: 1, containsAll: true }).then(res => {
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.selectData.provice = res.result;
					});
				}
			});
		},

		getCityList() {
			this.form.validateFields(['province'], (err, values) => {
				if (!err) {
					API_BIZCITYLIST({
						provinceCode: encodeURIComponent(values.province),
						containsAll: true
					}).then(res => {
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.selectData.city = res.result;
					});
				}
			});
		},
		searchBranchList: debounce(function (v) {
			if (!v) {
				return;
			}
			this.form.validateFields(['bankName', 'province', 'city'], (err, values) => {
				if (!err) {
					API_COMPANYACCOUNTLISTSUBBRANCH({
						bankName: values.bankName,
						province: this.province,
						city: this.city,
						subbranchName: v
					}).then(res => {
						if (res.success) {
							this.selectData.branchList = res.data;
						}
					});
				}
			});
		}, 300)
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
