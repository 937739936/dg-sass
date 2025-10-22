<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="回款编号">
							<a-input
								style="width: 100%"
								:maxLength="30"
								placeholder="请输入银行流水编号或OA收款编号"
								:disabled="isEdit"
								v-decorator="[
									`receiveSerialNo`,
									{
										rules: [{ required: true, message: `回款编号必填` }],
										validateTrigger: ['blur']
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
						<a-form-item label="回款方式">
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'collectionType',
									{
										rules: [{ required: true, message: '回款方式必选' }]
									}
								]"
								placeholder="请选择回款方式"
							>
								<a-select-option
									v-for="item in VUEX_ST_ALLCODE.collectionTypeDict"
									:key="item.value"
									:value="item.value"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="回款方">
							<a-select
								:getPopupContainer="getPopupContainer"
								showSearch
								placeholder="请选择回款方"
								:notFoundContent="returnedList ? '暂无数据' : '加载中...'"
								:filterOption="false"
								:defaultActiveFirstOption="false"
								@search="getReturnedList"
								@focus="getReturnedList"
								@select="e => handleSelect(e, 'add')"
								v-decorator="[
									`paymentBizNo`,
									{
										rules: [{ required: true, message: `回款方必选` }]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in returnedList"
									:key="index"
									:value="items.terminalUscc"
									>{{ items.terminalName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="回款方账号名称">
							<a-auto-complete
								placeholder="请选择回款方账号名称"
								:getPopupContainer="getPopupContainer"
								:maxLength="2"
								@focus=""
								v-decorator="[
									'paymentName',
									{
										rules: [{ required: true, message: '回款方账号名称必填' }]
									}
								]"
								option-label-prop="value"
								@select="changeBankNo"
							>
								<template slot="dataSource">
									<a-select-option
										v-for="(item, i) in returnedBankList"
										:key="i"
										:value="String(item.id)"
									>
										<div class="receiveOption">
											<p class="optionMain">
												{{ item.paymentAccountName }} <span v-if="item.paymentAccountBank">({{ item.paymentAccountBank }})</span>
											</p>
											<p
												style="color: rgba(0, 0, 0, 0.4); fontsize: 12px"
												v-if="item.paymentAccountNo"
											>
												{{ item.paymentAccountNo }}
											</p>
										</div>
									</a-select-option>
								</template>
							</a-auto-complete>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="回款方开户行">
							<a-input
								style="width: 100%"
								:maxLength="50"
								placeholder="请填写回款方开户行"
								v-decorator="[
									`paymentAccountBank`,
									{
										rules: [{ required: false, message: `回款方开户行必填` }],
										validateTrigger: ['blur']
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
						<a-form-item label="回款方银行账号">
							<a-tooltip
								placement="topLeft"
								:visible="bankNoShow && !!unit"
							>
								<template slot="title">
									{{ unit }}
								</template>
								<div class="columns-title">
									<a-input
										style="width: 100%"
										:maxLength="50"
										placeholder="请填写回款方银行账号"
										@focus="showBankUnit"
										@change="showBankUnit"
										@blur="bankNoShow = false"
										v-decorator="[
											`paymentAccount`,
											{
												rules: [{ required: false, message: `回款方银行账号必填` }, { validator: checkNumber }],
												validateTrigger: ['blur']
											}
										]"
									/>
								</div>
							</a-tooltip>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="收款账号名称">
							<a-select
								:getPopupContainer="getPopupContainer"
								@change="changeAccountName"
								v-decorator="[
									'receiveName',
									{
										rules: [{ required: true, message: '收款账号名称必填' }]
									}
								]"
								placeholder="请选择收款账号名称"
							>
								<a-select-option
									v-for="item in collectionAccountList"
									:key="item.accountNo"
									:value="item.accountNo"
								>
									<p class="optionMain">
										{{ item.accountName }} <span>({{ item.subbranchName }})</span>
									</p>
									<p style="color: rgba(0, 0, 0, 0.4); fontsize: 12px">{{ item.accountNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="收款账号开户行">
							<a-input
								style="width: 100%"
								:disabled="true"
								placeholder="请填写收款账号开户行"
								v-decorator="[
									`receiveAccountBank`,
									{
										rules: [{ required: true, message: `收款账号开户行必填` }],
										validateTrigger: ['blur']
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
						<a-form-item label="收款账号">
							<a-input
								style="width: 100%"
								:disabled="true"
								placeholder="请填写收款账号"
								v-decorator="[
									`receiveAccount`,

									{
										rules: [{ required: true, message: `收款账号必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item
							label="回款日期"
							:colon="false"
						>
							<a-date-picker
								style="width: 100%"
								placeholder="请选择回款日期"
								:allowClear="false"
								valueFormat="YYYY-MM-DD"
								:disabled-date="disabledDate"
								v-decorator="[
									`receiveDate`,
									{
										rules: [{ required: true, message: `回款日期必填` }]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
							<span
								slot="extra"
								v-if="execDateDevMax"
							>
								<span v-if="execDateDevMax"> 回款日期与当前日期偏差较多，如果实际如此，请忽略提示 </span>
							</span>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="回款金额">
							<a-tooltip
								placement="topLeft"
								:visible="priceShow && !!priceUnit"
							>
								<template slot="title">
									{{ priceUnit }}
								</template>
								<a-input-number
									placeholder="请输入银行转账金额"
									@focus="showPrice"
									@change="showPrice"
									:min="0.01"
									:precision="2"
									@blur="priceShow = false"
									:max="9999999999.0"
									v-decorator="[
										`receiveAmount`,
										{
											rules: [{ required: true, message: `回款金额必填` }]
										}
									]"
								/>
							</a-tooltip>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';

import { getCollectionAccountList, getCollectionAccountMemory } from '@/v2/center/trade/api/pay';
import { API_COMPANYACCOUNTLIST } from '@/v2/center/trade/api/collectionFlow';
import { mapGetters } from 'vuex';
import moment from 'moment';
// 处理银行卡分为
const formatAccountNumber = accountNumber => {
	// 去除所有空格
	accountNumber = accountNumber.replace(/\s/g, '');
	// 每4个数字加一个空格
	let formattedAccountNumber = '';
	for (let i = 0; i < accountNumber.length; i++) {
		if (i % 4 === 0 && i !== 0) {
			formattedAccountNumber += ' ';
		}
		formattedAccountNumber += accountNumber[i];
	}

	return formattedAccountNumber;
};
export default {
	data() {
		return {
			form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
			info: {},
			returnedList: [],
			returnedBankList: [],
			/** 银行号处理 unit */
			bankNoShow: false,
			unit: '',
			execDateDevMax: false,
			// 金额
			priceShow: false,
			priceUnit: '',
			// 收款账号
			collectionAccountList: []
		};
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isEdit() {
			return !!this.$route.query.id;
		}
	},
	mounted() {
		this.getCollectionAccount();
	},
	methods: {
		getPopupContainer,

		disabledDate(current) {
			return current && current > moment().endOf('day');
		},

		async init(info) {
			this.form.setFieldsValue(info);
			this.info = info;
			await this.getReturnedList();
			await this.getCollectionAccount();
			const flag = this.returnedList.some(el => el.terminalUscc == info.paymentBizNo);
			if (flag) {
				this.handleSelect(info.paymentBizNo, 'edit');
			} else {
				this.$message.warning('当前回款方未维护');
				this.form.setFieldsValue({ paymentBizNo: undefined });
			}

			this.changeAccountName(info.receiveAccount);
		},
		// 获取回款方
		async getReturnedList(data) {
			this.returnedList = null;
			const res = await getCollectionAccountList({ terminalName: data });
			this.returnedList = res.data;
		},
		// 获取历史记录
		async getCollectionAccountMemory(paymentCompanyName) {
			const params = {
				paymentCompanyName
			};
			const res = await getCollectionAccountMemory(params);
			this.returnedBankList = res.data;
			if (this.returnedBankList.length == 0) {
				this.returnedBankList.push({ paymentAccountName: paymentCompanyName, id: 1 });
				this.form.setFieldsValue({
					paymentName: paymentCompanyName
				});
			}
		},
		getCollectionAccount() {
			// 获取回款账户
			API_COMPANYACCOUNTLIST({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc
			}).then(res => {
				if (res.success) {
					this.collectionAccountList = res.data;
				}
			});
		},
		// 收款账号
		changeAccountName(val) {
			/** 获取收款数据 */
			const item = this.collectionAccountList.find(el => val == el.accountNo) || {};

			this.$nextTick(() => {
				this.form.setFieldsValue({
					receiveAccountBank: item.subbranchName,
					receiveName: item.accountName,
					receiveAccount: item.accountNo
				});
			});
		},
		sendPrice(val) {
			this.$emit('sendPrice', val);
		},

		handleSelect(value, type) {
			// 获取回款方名称
			const item = this.returnedList.find(el => el.terminalUscc == value) || {};

			this.getCollectionAccountMemory(item.terminalName);
			item.handleType = type || '';
			this.$emit('updatePayment', item);

			/** 更新回款方 */
			// if(type != 'edit') {
			//    this.$emit('updatePayment', item )
			// }
		},
		clearHistoryList(value) {},
		changeBankNo(value) {
			// 选择以后同步更新 回款开户行 和 回款银行账号
			const item = this.returnedBankList.find(el => el.id == value) || {};
			this.form.setFieldsValue({
				paymentAccountBank: item.paymentAccountBank,
				paymentAccount: item.paymentAccountNo,
				paymentName: item.paymentAccountName
			});
		},
		async checkLength(rule, value, callback) {
			if (value && value.length > 50) {
				callback('长度需在 1-50 字之间');
			} else {
				callback();
			}
		},
		// 检测是否未数字
		checkNumber(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (value.length < 5) {
					callback('长度需要在 5 和 50之间');
				} else if (!/^[1-9]\d{4,49}$/.test(value)) {
					callback('请输入正确银行账号');
				} else {
					callback();
				}
			}
		},
		showBankUnit(e) {
			const value = e.target ? e.target.value : e;
			if (!value) {
				this.bankNoShow = false;
				this.unit = '';
				return;
			}

			this.bankNoShow = true;
			this.unit = formatAccountNumber(value);
		},
		computeUnit(val) {
			this.priceUnit = '';
			if (val >= 1000 && val < 10000) {
				this.priceUnit = '千';
			} else if (val > 10000 && val <= 100000) {
				this.priceUnit = '万';
			} else if (val > 100000 && val <= 1000000) {
				this.priceUnit = '十万';
			} else if (val > 1000000 && val <= 10000000) {
				this.priceUnit = '百万';
			} else if (val > 10000000 && val <= 100000000) {
				this.priceUnit = '千万';
			} else if (val > 100000000 && val <= 1000000000) {
				this.priceUnit = '亿';
			} else if (val > 1000000000 && val <= 10000000000) {
				this.priceUnit = '十亿';
			} else if (val > 10000000000) {
				this.priceUnit = '百亿';
			}
		},
		showPrice(e) {
			if (!e) {
				return;
			}
			const value = e.target ? e.target.value : e;

			this.$emit('sendPrice', value);
			if (!value || value < 1000) {
				this.priceShow = false;
				this.priceUnit = '';
				return;
			}

			this.priceShow = true;
			this.computeUnit(value);
		},
		onValuesChange(props, values) {
			if (values.hasOwnProperty('receiveDate')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.receiveDate).diff(moment(), 'days')) > 30) {
					this.execDateDevMax = true;
				} else {
					this.execDateDevMax = false;
				}
			}
		},
		save() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						/** 收款账号名称 */
						const item = this.collectionAccountList.find(el => values.receiveAccount == el.accountNo) || {};

						/** 获取回款方 */
						const paymentItem = this.returnedList.find(el => el.terminalUscc == values.paymentBizNo) || {};

						resolve({
							...values,
							receiveName: item.accountName,
							receiveAccount: item.accountNo,
							paymentCompanyName: paymentItem.terminalName || this.info.paymentCompanyName
						});
					} else {
						resolve(false);
					}
				});
			});
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.ant-col {
	height: 82px;
	// margin-bottom: 10px
}
.col-height.ant-col {
	height: inherit;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.calendar,
.select {
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: middle;
	background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
	background-size: contain;
	line-height: 38px !important;
	top: 40%;
}
.receiveOption {
	// display:-webkit-box;
	// display:-webkit-flex;
	// display:-ms-flexbox;
	// display:flex;
	// align-items:center;
	// justify-content:space-between;

	.optionIcon {
		width: 20px;
		i {
			display: none;
		}
	}
	&:hover {
		.optionIcon {
			i {
				display: block;
			}
		}
	}
}
.optionMain {
	display: inline-block;
	width: 100%;
	// max-width: calc(100% - 20px);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
