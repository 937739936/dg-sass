<template>
	<div class="slMain">
		<Breadcrumb @routeChange="routeChange" />
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ titleType }}线下运输合同</span>
			</div>
			<a-form
				:form="formContract"
				class="slFormDetail"
				:colon="false"
				@submit="handleSubmitContract"
			>
				<div>
					<div class="slTitleAssis">合同信息</div>
					<a-row>
						<a-col :span="8">
							<a-form-item label="业务线关联">
								<a-input
									placeholder="请选择业务线关联"
									@click="showRelationOrderList"
									v-decorator="[
										`businessLineNo`,
										{
											rules: [
												{
													required: true,
													message: `业务线关联必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="承运人">
									<a-select
										placeholder="请选择承运人"
										:filter-option="filterOption"
										:getPopupContainer="getPopupContainer"
										showSearch
										:defaultActiveFirstOption="false"
										:notFoundContent="!buyerOrSellerData.length ? '加载中...' : null"
										@change="selectCompanyChange"
										v-decorator="[
											`consigneeCompanyUscc`,
											{
												rules: [
													{
														required: true,
														message: `承运人必填`
													}
												]
											}
										]"
									>
										<a-select-option
											v-for="(items, index) in shipperList"
											:key="index"
											:value="items.text"
										>
											{{ items.value }}
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
								<a-form-item label="托运人">
									<!-- 选择框 -->
									<a-select
										disabled
										v-decorator="[
											`buyerCompanyName`,
											{
												initialValue: VUEX_ST_COMPANYSUER.companyUscc,
												rules: [
													{
														required: true,
														message: `托运人必填`,
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
						<a-col :span="8">
							<a-form-item label="合同编号">
								<a-input
									placeholder="请输入合同编号"
									:maxLength="50"
									v-decorator="[
										`paperContractNo`,
										{
											rules: [
												{
													required: true,
													message: `合同编号必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="合同有效期">
									<a-range-picker
										:placeholder="['开始日期', '结束日期']"
										v-decorator="[
											`execDate`,
											{
												rules: [
													{
														required: true,
														message: `合同有效期必填`
													}
												]
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
								<a-form-item label="合同类型">
									<a-select
										placeholder="请选择合同类型"
										v-decorator="[
											`contractTermType`,
											{
												rules: [
													{
														required: true,
														message: `合同类型必填`
													}
												]
											}
										]"
									>
										<a-select-option
											v-for="(items, index) in contractTimeTypeList"
											:key="index"
											:value="items.value"
										>
											{{ items.text }}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-form-item label="合同签章状态">
								<a-select
									disabled
									placeholder="请输入合同签章状态"
									v-decorator="[
										`signStatus`,
										{
											initialValue: 2,
											rules: [
												{
													required: true,
													message: `合同签章状态必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in signStatusList"
										:key="index"
										:value="items.value"
									>
										{{ items.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="签订日期">
									<a-date-picker
										format="YYYY-MM-DD"
										placeholder="请选择签订日期"
										v-decorator="[
											`contractSignTime`,
											{
												rules: [
													{
														required: true,
														message: `签订日期必填`
													}
												]
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
								<a-form-item label="运输公司收款账户">
									<a-select
										placeholder="请选择运输公司收款账户"
										v-decorator="[
											`receivableBankAccountId`,
											{
												rules: [
													{
														required: true,
														message: `运输公司收款账户必填`
													}
												]
											}
										]"
									>
										<a-select-option
											v-for="(items, index) in huikuanAccountList"
											:key="index"
											:value="items.id"
										>
											{{ items.subbranchName }}/{{ items.subbranchNo }}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-form-item label="业务负责人">
								<!-- 选择框 -->
								<a-select
									placeholder="请选择业务负责人"
									show-search
									:getPopupContainer="getPopupContainer"
									:notFoundContent="!optionList.length ? '暂无数据' : '加载中...'"
									:filter-option="filterOption"
									v-decorator="[
										`businessDirectorId`,
										{
											rules: [
												{
													required: true,
													message: `业务负责人必填`,
													type: 'string'
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in assetTeamTraderList"
										:key="index"
										:value="items.id"
									>
										{{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div>
					<div class="slTitleAssis">运输信息</div>
					<a-row>
						<a-col :span="8">
							<a-form-item label="运输方式">
								<a-select
									placeholder="请选择运输方式"
									v-decorator="[
										`transportMode`,
										{
											rules: [
												{
													required: true,
													message: `运输方式必填`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in transportMode"
										:key="index"
										:value="items.value"
									>
										{{ items.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="center"
							>
								<a-form-item label="起运地">
									<a-input
										placeholder="请输入起运地"
										:maxLength="100"
										v-decorator="[
											`origin`,
											{
												rules: [
													{
														required: true,
														message: `起运地必填`
													}
												]
											}
										]"
									>
									</a-input>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="end"
							>
								<a-form-item label="目的地">
									<a-input
										placeholder="请输入目的地"
										:maxLength="100"
										v-decorator="[
											`destination`,
											{
												rules: [
													{
														required: true,
														message: `目的地必填`
													}
												]
											}
										]"
									>
									</a-input>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-row
								type="flex"
								justify="start"
							>
								<a-form-item label="合同价格（元/吨）">
									<a-input-number
										placeholder="请输入合同价格"
										:max="999999999.99"
										:min="0"
										v-decorator="[
											`contractPrice`,
											{
												rules: [
													{
														required: true,
														message: `合同价格必填`
													}
												]
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
								<a-form-item label="运输吨数">
									<a-input-number
										placeholder="请输入运输吨数"
										:max="9999999999.9999"
										:min="0"
										v-decorator="[
											`contractQuantity`,
											{
												rules: [
													{
														required: false,
														message: `运输吨数必填`
													}
												]
											}
										]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
					</a-row>
				</div>
			</a-form>

			<div>
				<div class="file-title-wrap">
					<div class="slTitleAssis">附件信息</div>
					<a-button
						type="primary"
						@click="addContractFiles"
						>新增</a-button
					>
				</div>
				<p class="upload-tips">可支持格式为pdf，jpg，jpeg，png，bmp的附件，单个附件大小不得超过100M的文件</p>
				<div class="upload-file-wrap">
					<OfflineContractFilesUpload
						ref="OfflineContractFilesDrawer"
						:ifEditable="true"
						@uploadFiles="getUploadFiles(arguments)"
						:uploadFilesJudge="getUploadFilesJudge"
						:fileDataSource="offlinefileDataSource"
						:uploadFileList="uploadFileList"
						contractType="transport"
					/>
				</div>
			</div>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="save(0)"
						:loading="loadingSave"
						v-if="contractStatus !== 'EXECUTING'"
						>保存</a-button
					>
					<a-button
						type="primary"
						@click="save(1)"
						:loading="loadingSubmit"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<BusinessLine
			:type="this.$route.query.type === 'SELL' ? 'buy' : 'sell'"
			ref="BusinessLine"
			@detail="getRelationOrderDetail"
			:businessLineId="businessLineId"
		/>
		<ConfirmReturn ref="confirmReturn" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETBUYERLIST } from '@/v2/center/trade/api/contract';
import BusinessLine from '../components/BusinessLine.vue';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_STATION } from '@/v2/center/assets/api/index.js';
import OfflineContractFilesUpload from '@/v2/center/trade/views/contract/components/OfflineContractFilesUpload'; // 合同附件上传
import { API_COMPANYACCOUNTLIST } from '@/v2/center/assets/api/index.js';
import {
	API_Save,
	API_getlogisticsList,
	API_contractDetail,
	API_get_businessOwnerList
} from '@/v2/center/trade/api/transportContract';
import moment from 'moment';
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn'; //返回确认弹框
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

export default {
	data() {
		return {
			formContract: this.$form.createForm(this, { name: 'formContract' }),
			buyerOrSellerData: [],
			fileDataSource: [],
			resultDetail: {},
			contractTimeTypeList: filterCodeByKey('contractTermEnums'), //合同类型
			transportMode: [
				{ name: '汽运和火运', value: 'AUTOMOBILE_AND_TRAIN' },
				{ name: '汽运', value: 'AUTOMOBILE' },
				{ name: '火运', value: 'TRAIN' },
				{ name: '船运', value: 'SHIP' }
			],
			stationListStart: [],
			stationListEnd: [],
			loadingFetch: [0, 0],
			offlinefileDataSource: {},
			huikuanAccountList: [],
			businessLineId: '',
			attachmentReq: [],
			uploadFileList: [
				{
					value: 'OFFLINE_CONTRACT',
					label: '线下合同'
				},
				{
					value: 'OTHER',
					label: '其他附件'
				}
			],
			signStatusList: [
				{ value: 1, text: '单签' },
				{ value: 2, text: '双签' }
			],
			loadingSave: false,
			loadingSubmit: false,
			shipperList: [],
			optionList: [],
			assetTeamTraderList: [],
			contractStatus: null
		};
	},
	mounted() {
		this.getBuyAndSellList();
		this.getBuyerList();
		this.editToGetDetails();
		this.getBusinessOwnerList();
	},
	methods: {
		getPopupContainer,
		getBusinessOwnerList() {
			API_get_businessOwnerList().then(res => {
				if (res.success) {
					this.assetTeamTraderList = res.data;
				}
			});
		},
		routeChange(val) {
			if (this.formContract.isFieldsTouched()) {
				this.$refs.confirmReturn.init(val);
			} else {
				this.$router.push(val);
			}
		},
		editToGetDetails() {
			if (this.$route.query.id) {
				API_contractDetail({
					id: this.$route.query.id
				}).then(res => {
					if (res.success) {
						this.contractStatus = res.data.status;
						this.selectCompanyChange(res.data.consigneeCompanyUscc);
						this.$nextTick(() => {
							this.formContract.setFieldsValue({
								...res.data,
								execDate: [res.data.execDateStart, res.data.execDateEnd],
								contractQuantity: res.data.contractQuantity || null,
								...res.data.contractExtendInfo
							});
						});
						if (res.data.contractAttachment) {
							this.attachmentReq = TableRowSpanFunc(res.data.contractAttachment, 'typeName');
							this.attachmentReq = this.attachmentReq.map(item => {
								// item.url = item.typeName;
								return item;
							});
							this.offlinefileDataSource = {
								contractFileData: this.attachmentReq,
								supplementalInfo: []
							};
						}
					}
				});
			}
		},
		selectCompanyChange(uscc) {
			this.formContract.setFieldsValue({
				receivableBankAccountId: undefined
			});
			this.getBankAccount(uscc);
		},
		// 新增合同附件
		addContractFiles() {
			this.$refs.OfflineContractFilesDrawer.addFileType();
		},
		getBankAccount(companyUscc) {
			API_COMPANYACCOUNTLIST({ uscc: companyUscc }).then(res => {
				if (res.success) {
					this.huikuanAccountList = res.data;
				}
			});
		},
		handleSubmitContract() {},
		handleSubmitTrans() {},
		handleSearch(value, type) {
			this.$set(this.loadingFetch, type, 1);
			API_STATION({
				keywords: encodeURIComponent(value)
			})
				.then(res => {
					if (res.success) {
						if (type == 0) {
							this.stationListStart = res.result;
						} else {
							this.stationListEnd = res.result;
						}
					}
				})
				.finally(() => {
					this.$set(this.loadingFetch, type, 0);
				});
		},
		handleChange(value, type) {
			this.$set(this.loadingFetch, type, 1);
			API_STATION({
				keywords: encodeURIComponent(value)
			})
				.then(res => {
					if (res.success) {
						if (type == 0) {
							this.stationListStart = res.result;
						} else {
							this.stationListEnd = res.result;
						}
					}
				})
				.finally(() => {
					this.$set(this.loadingFetch, type, 0);
				});
		},
		getUploadFiles(data) {
			this.attachmentReq = data[0];
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		// 获取买方
		getBuyerList() {
			API_GETBUYERLIST({}).then(res => {
				if (res.success) {
					this.buyerOrSellerData = res.data.concat([
						{
							bizLicenseNo: this.VUEX_ST_COMPANYSUER.companyUscc,
							name: this.VUEX_ST_COMPANYSUER.companyName
						}
					]);
				}
			});
		},
		// 获取物流企业
		getBuyAndSellList() {
			return API_getlogisticsList({
				searchKeys: ''
			}).then(res => {
				if (res.success) {
					this.shipperList = res.data;
				}
			});
		},
		showRelationOrderList() {
			this.$refs.BusinessLine.showRelationOrderList();
		},
		// 关联业务线
		getRelationOrderDetail(item) {
			if (item.businessLineNo) {
				this.businessLineId = item.id;
				this.formContract.setFieldsValue({
					businessLineNo: item.businessLineNo
				});
			}
		},
		//附件上传判断是否符合规范
		getUploadFilesJudge(data, type) {
			//如果附件类型是线下合同,补充协议只能一个pdf或多张图片
			let data1 = data.filter(item => {
				return item.type == type;
			});
			if (
				data1.length > 1 &&
				data1.some(item => {
					let ext = item.url.substr(item.url.lastIndexOf('.') + 1);
					return ['pdf'].indexOf(ext.toLowerCase()) !== -1;
				})
			) {
				return true;
			} else {
				return true;
			}
		},
		// 判断当前form是否有值
		currentFormHasValue() {
			const tempObj = this.formContract.getFieldsValue();
			delete tempObj.buyerCompanyName;
			delete tempObj.signStatus;
			const result = [];
			for (const key in tempObj) {
				result.push(tempObj[key]);
			}
			let flag = false;
			for (let i = 0; i < result.length; i++) {
				if (result[i]) {
					flag = true;
					break;
				}
			}
			return flag;
		},
		cancel() {
			// 如果是从业务线详情进入的 直接返回业务线
			if (this.$route.query.source == 'business') {
				this.$router.back();
				return;
			}
			if (this.formContract.isFieldsTouched()) {
				this.$refs.confirmReturn.init('/center/contract/transport/list');
			} else {
				this.$router.back();
			}
		},
		postData(value, type) {
			const accountInfo = this.huikuanAccountList.filter(item => item.id == value.receivableBankAccountId)[0] || {};
			const consigneeCompanyInfo = this.shipperList.filter(item => item.text == value.consigneeCompanyUscc)[0] || {};
			API_Save({
				id: this.$route.query.id || null,
				submit: Boolean(type),
				...value,
				attachmentReq: this.attachmentReq,
				execDateStart: value.execDate?.length ? moment(value?.execDate[0]).format('YYYY-MM-DD') : null,
				execDateEnd: value.execDate?.length ? moment(value?.execDate[1]).format('YYYY-MM-DD') : null,
				contractSignTime: value.contractSignTime ? moment(value.contractSignTime).format('YYYY-MM-DD') : null,
				receivableAccountNo: accountInfo.accountNo,
				receivableAccountName: accountInfo.accountName,
				receivableAccountBank: accountInfo.bankName,
				consigneeCompanyName: consigneeCompanyInfo.value,
				sellerName: consigneeCompanyInfo.value,
				sellerUscc: consigneeCompanyInfo.text,
				buyerName: this.VUEX_ST_COMPANYSUER.companyName,
				buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc
			})
				.then(res => {
					if (res.success) {
						const message = type == 0 ? '保存成功' : '提交成功';
						this.$message.success(message).then(() => {
							this.$router.back();
						});
					}
				})
				.finally(() => {
					if (type) {
						this.loadingSubmit = false;
					} else {
						this.loadingSave = false;
					}
				});
		},
		async save(type) {
			this.formContract.validateFieldsAndScroll((err, value) => {
				if (!err) {
					if (type) {
						this.loadingSubmit = true;
					} else {
						this.loadingSubmit = false;
					}
					this.postData(value, type);
				}
			});
		}
	},
	components: {
		Breadcrumb,
		BusinessLine,
		OfflineContractFilesUpload,
		ConfirmReturn
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		titleType() {
			return this.$route.query.id ? '编辑' : '新增';
		}
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding-top: 0;
}
.slTitleAssis {
	margin-bottom: 20px;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.slMain {
	/deep/ .ant-calendar-range-picker-input {
		text-align: center !important;
	}
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 999;
}
.upload-file-wrap {
	margin-top: 20px;
}
.upload-tips {
	width: 100%;
	height: 16px;
	line-height: 16px;
	margin-top: 20px;
	color: #77889d;
}
.content {
	padding-bottom: 64px;
}
.file-title-wrap {
	width: 100%;
	height: 32px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
</style>
