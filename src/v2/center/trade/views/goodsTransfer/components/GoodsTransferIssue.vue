<template>
	<div>
		<div class="sub">
			<div class="slTitleAssis">货转证明</div>
			<a-form
				:form="form"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8" :style="form.getFieldValue('goodsTransferIssueMethod') === 'REFERRED_GOODS_TRANSFER' ? 'height: 52px':'height: 82px'">
						<a-form-item label="货转开具方式">
							<a-radio-group
								v-decorator="['goodsTransferIssueMethod', formRules.goodsTransferIssueMethod]">
								<a-space :size="72">
									<a-radio value="REFERRED_GOODS_TRANSFER" v-if="goodsTransferType === 'GOODS_TRANSFER_REFERRED' && $route.query.orderType === 'OFFLINE'">复用上游货转</a-radio>
									<a-radio value="ONLINE_GOODSTRANSFER">电子货转</a-radio>
									<a-radio value="OFFLINE_GOODSTRANSFER">线下货转</a-radio>
								</a-space>
							</a-radio-group>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row v-if="form.getFieldValue('goodsTransferIssueMethod') === 'REFERRED_GOODS_TRANSFER' && $route.query.orderType === 'OFFLINE'">
					<Referreds
						ref="referreds"
						:transType="transType || ''"
						:selectIdList="selectIdList"
						@electNoChange="electNoChange"
						:dataSource="dataSource"
					/>
				</a-row>
				<a-row>
					<a-col :span="8" v-if="form.getFieldValue('goodsTransferIssueMethod') === 'REFERRED_GOODS_TRANSFER'">
						<a-form-item
							label="货转开具日期"
							style="width: 90%"
						>
							<a-date-picker
								:getCalendarContainer="getPopupContainer"
								valueFormat="YYYY-MM-DD"
								placeholder="货转开具日期需大于等于上游货转开具日期"
								v-decorator="['signDate', formRules.signDate]"
								class="sign-date-wrap"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8" v-else>
						<a-form-item label="货转开具日期">
							<a-date-picker
								placeholder="请选择货转开具日期"
								:disabled-date="disabledDate"
								:getPopupContainer="getPopupContainer"
								:defaultPickerValue="defaultPickerValue"
								valueFormat="YYYY-MM-DD"
								v-decorator="['signDate', formRules.signDate]"
							/>
						</a-form-item>
					</a-col>
					<!-- 线下货转填写开具数量 -->
					<a-col
						:span="8"
						v-show="Method == 'OFFLINE_GOODSTRANSFER'"
					>
						<a-form-item label="货转开具数量">
							<a-input-number
								placeholder="请输入数量(吨)"
								v-decorator="['goodsTransferQuantity', formRules.goodsTransferQuantity]"
								:min="0.0001"
								:step="0.0001"
								:precision="4"
								:max="9999999999.9999"
							/>
						</a-form-item>
					</a-col>
					<!--template v-show无效，又要保证数据结构 -->
					<a-col
						:span="8"
						v-show="!type && Method == 'ONLINE_GOODSTRANSFER'"
					>
						<a-form-item label="交货量(吨)">
							<a-input-number
								placeholder="请输入交货量(吨)"
								v-decorator="['deliverQuantity', formRules.deliverQuantity]"
								:min="0.0001"
								:step="0.0001"
								:precision="4"
								:max="9999999999.9999"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-show="!type && Method == 'ONLINE_GOODSTRANSFER'"
					>
						<a-form-item label="交货日期">
							<a-date-picker
								placeholder="请选择交货日期"
								valueFormat="YYYY-MM-DD"
								:getPopupContainer="getPopupContainer"
								v-decorator="['deliveryDate', formRules.deliveryDate]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-show="!type && Method == 'ONLINE_GOODSTRANSFER'"
					>
						<a-form-item label="交货地点">
							<a-input
								placeholder="请输入交货地点"
								:maxLength="50"
								v-decorator="['deliveryPlace', formRules.deliveryPlace]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-show="!type && Method == 'ONLINE_GOODSTRANSFER'"
					>
						<a-form-item label="收货人">
							<a-input
								placeholder="请输入收货人"
								:maxLength="50"
								v-decorator="['receiverName', formRules.receiverName]"
							/>
						</a-form-item>
					</a-col>

					<a-col :span="8" v-if="isBelongTieRui && Method === 'OFFLINE_GOODSTRANSFER'">
						<a-form-item
							label="签章状态"
							style="width: 90%"
						>
							<a-select
								placeholder="请选择签章状态"
								v-decorator="[
									`signStatus`,
									{
										rules: [
											{ required: true, message: `签章状态必填` },
										]
									}
								]"
							>
								<a-select-option value="UN_SIGN">待签署</a-select-option>
								<a-select-option value="SIGNED">已签署</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<FileTable
			v-show="fileType == 1"
			:add-type="fileType1"
			ref="fileTable"
			:fileData="fileInfoList1"
			@fileChange="fileInfoListChange1"
		/>
		<FileTable
			v-show="fileType == 2"
			:add-type="fileType2"
			ref="fileTable"
			:fileData="fileInfoList2"
			@fileChange="fileInfoListChange2"
		/>
	</div>
</template>

<script>
import FileTable from '@/v2/center/trade/views/receive/components/FileTable'; // 附件展示
import { getPopupContainer } from '@/v2/utils/factory.js';
import Referreds from './Referreds';
import moment from 'moment';
import { mapGetters } from "vuex";
export default {
	components: {
		FileTable,
		Referreds
	},
	props: {
		signTimeLength: {
			type: Array,
			default: () => {
				return [];
			}
		},
		goodsTransferType: {
			type: String,
			default: () => {
				return '';
			}
		},
		transType: {
			type: String,
			default: () => {
				return '';
			}
		},
		selectIdList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		dataSource: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			Method: null, //开具线上还是线下，ONLINE_GOODSTRANSFER线上，OFFLINE_GOODSTRANSFER线下、
			fileType1: [
				{
					key: 'HQZYZM',
					label: '货转证明',
					required: true
				}
			],
			fileType2: [
				{
					key: 'HQZY_QUANTITY_PZ',
					label: '货转数量凭证',
					required: true
				}
			],
			fileInfoList1: [],
			fileInfoList2: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
		}),
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051';
		},
		//默认日期面板
		defaultPickerValue() {
			if (this.signTimeLength.length) {
				return moment(this.signTimeLength[0]);
			} else {
				return moment();
			}
		},
		//有无运输方式
		type() {
			// NONE无需运输
			if ((this.transType == 'NONE' && this.$route.query.orderType === 'ONLINE') || this.$route.query.orderType === 'OFFLINE') {
				return false;
			} else {
				return true;
			}
		},
		//上传文件类型
		fileType() {
			// 如果是无需运输，电子货转附件类型为货转数量凭证
			let { type, Method } = this;
			if (!type && Method == 'ONLINE_GOODSTRANSFER') {
				return 2;
			} else if (Method == 'OFFLINE_GOODSTRANSFER') {
				//如果是线下上传货转证明
				return 1;
			} else {
				return '';
			}
		},
		formRules() {
			let { type, Method } = this;
			return {
				goodsTransferIssueMethod: {
					rules: [
						{
							required: true,
							message: `货转开具方式必填`
						}
					]
				},
				signDate: {
					rules: [
						{
							required: true,
							message: `请选择货转开具日期`
						}
					]
				},
				goodsTransferQuantity: {
					rules: [
						{
							required: Method == 'OFFLINE_GOODSTRANSFER',
							message: `货转开具数量必填`
						}
					]
				},
				deliverQuantity: {
					rules: [
						{
							required: !type && Method == 'ONLINE_GOODSTRANSFER',
							message: `请输入交货量(吨)`
						}
					]
				},
				deliveryDate: {
					rules: [
						{
							required: !type && Method == 'ONLINE_GOODSTRANSFER',
							message: `请选择交货日期`
						}
					]
				},
				deliveryPlace: {
					rules: [
						{
							required: !type && Method == 'ONLINE_GOODSTRANSFER',
							message: `请选择交货地点`,
							whitespace: true
						}
					]
				},
				receiverName: {
					rules: [
						{
							required: !type && Method == 'ONLINE_GOODSTRANSFER',
							message: `请输入收货人`,
							whitespace: true
						}
					]
				}
			};
		}
	},
	methods: {
		getPopupContainer,
		// 线下合同-选中复用上游货转的货转信息后的回调函数
		electNoChange(val) {
			if (this.$refs.referreds) {
				this.$refs.referreds.selectedRows = [];
			}
			this.$refs.referreds.selectedRows = val.data;
			this.$emit('offLineCallback', val)
		},
		//时间范围限制
		disabledDate(current) {
			if (this.signTimeLength.length) {
				return (
					current.valueOf() < moment(this.signTimeLength[0]).valueOf() ||
					current.valueOf() >= moment(this.signTimeLength[1]).add(1, 'd').valueOf()
				);
			} else {
				return false;
			}
		},
		onValuesChange(props, values) {
			//货转开具方式发生变更
			if (values.hasOwnProperty('goodsTransferIssueMethod')) {
				this.Method = values.goodsTransferIssueMethod;
			}
		},
		fileInfoListChange1(list) {
			this.fileInfoList1 = list;
		},
		fileInfoListChange2(list) {
			this.fileInfoList2 = list;
		},
		//获取数据外部调用-不校验
		save(form = this.form.getFieldsValue()) {
			let fileInfoList = [];
			if (this.fileType) {
				fileInfoList = this[`fileInfoList${this.fileType}`];
			}
			let params = {
				goodsTransferIssueMethod: form.goodsTransferIssueMethod,
				signDate: form.signDate,
				goodsTransferQuantity: form.goodsTransferQuantity,
				detailNotTransport: {
					deliverQuantity: form.deliverQuantity,
					deliveryDate: form.deliveryDate,
					deliveryPlace: form.deliveryPlace,
					receiverName: form.receiverName
				},
				fileInfoList
			};
			if (this.isBelongTieRui && this.form.getFieldValue('goodsTransferIssueMethod') === 'OFFLINE_GOODSTRANSFER') {
				params.signStatus = form.signStatus
			}
			return params;
		},
		//获取数据外部调用-校验
		submit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((error, values) => {
					if (!error) {
						let fileInfoList = [];
						if (this.fileType) {
							fileInfoList = this[`fileInfoList${this.fileType}`];
							if (!fileInfoList.length) {
								this.$message.error('请上传附件信息');
								resolve(false);
							}
						}
						let params = this.save(values);
						resolve(params);
					} else {
						resolve(false);
					}
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
.sub {
	margin-bottom: 30px;
	.slTitleAssis {
		margin: 0 0 20px;
	}
}
.slFormDetail {
	padding: 0;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
</style>
