<template>
	<div class="slMain">
		<Breadcrumb :routes="routes" />
		<a-card
			:bordered="false"
			class="a-card-border-bottom"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>新增发货计划</span>
			</div>
			<div>
				<div class="slTitleAssis">基本信息</div>
				<a-form
					:form="baseInfoForm"
					:colon="false"
					class="slFormDetail"
				>
					<a-row>
						<a-col :span="8">
							<a-form-item label="发货企业">
								<a-select
									:getPopupContainer="getPopupContainer"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									@select="handleDeliverCompanySelect"
									@search="handleDeliverCompanySearch"
									v-decorator="[
										`sellCompanyName`,
										{
											validateTrigger: 'blur',
											rules: [
												{
													required: true,
													message: `请填写发货企业`
												},
												{ validator: validSellCompanyName }
											]
										}
									]"
								>
									<a-spin
										v-if="fetching"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in deliverCompanyList"
										:key="item.name"
										:title="item.name"
										:value="item.name"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收货仓库">
								<a-select
									:getPopupContainer="getPopupContainer"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									@search="handleWareHouseSearch"
									@focus="handleWareHouseSearch"
									v-decorator="[
										`warehouseId`,
										{
											rules: [
												{
													required: true,
													message: `请选择收货仓库`
												}
											]
										}
									]"
								>
									<a-spin
										v-if="fetching1"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in wareHouseList"
										:key="item.warehouseId"
										:title="item.warehouseAbbr"
										:value="item.warehouseId"
									>
										{{ item.warehouseAbbr }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="货主企业">
								<a-input
									disabled
									v-model="VUEX_ST_COMPANYSUER.companyName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="运输方式">
								<a-select
									:getPopupContainer="getPopupContainer"
									showSearch
									:defaultActiveFirstOption="false"
									v-decorator="[
										`transportMode`,
										{
											initialValue: 'TRAIN',
											rules: [
												{
													required: true,
													message: `请选择运输方式`
												}
											]
										}
									]"
								>
									<a-select-option
										v-for="(items, index) in transTypeList"
										:key="index"
										:value="items.value"
									>
										{{ items.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="到库通知人员">
								<a-select
									mode="multiple"
									:getPopupContainer="getPopupContainer"
									show-search
									:default-active-first-option="false"
									:show-arrow="false"
									:filter-option="false"
									@search="handlePersonSearch"
									v-decorator="[
										`noticeUsers`,
										{
											rules: [
												{
													required: true,
													message: `请选择到库通知人员`
												}
											]
										}
									]"
								>
									<a-spin
										v-if="fetching2"
										slot="notFoundContent"
										size="small"
									/>
									<a-select-option
										v-for="item in oaUserNameList"
										:key="item.id"
										:title="item.text"
									>
										{{ item.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="上游合同号">
								<a-input
									autocomplete="off"
									v-decorator="[
										`contractNo`,
										{
											validateTrigger: 'change',
											rules: [
												{
													required: true,
													message: `请填写上游合同号`
												},
												{ validator: validLength }
											]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
				<DeliverDetails
					ref="deliverDetails"
					:transportMode="baseInfoForm.getFieldValue('transportMode')"
					:datas="particularsList"
				/>
				<!-- 只有火运展示 -->
				<template v-if="baseInfoForm.getFieldValue('transportMode') === 'TRAIN'">
					<div class="slTitleAssis">发货信息</div>
					<a-form
						:form="deliverInfoForm"
						:colon="false"
						class="slFormDetail"
					>
						<a-row>
							<a-col :span="8">
								<a-form-item label="托运人名称">
									<a-select
										:getPopupContainer="getPopupContainer"
										show-search
										:default-active-first-option="false"
										:show-arrow="false"
										:filter-option="false"
										@select="handleShipperNameSelect"
										@search="handleShipperNameSearch"
										v-decorator="[
											`consignor`,
											{
												rules: [
													{
														required: true,
														message: `请输入托运人名称`
													}
												]
											}
										]"
									>
										<a-spin
											v-if="fetching3"
											slot="notFoundContent"
											size="small"
										/>
										<a-select-option
											v-for="item in shipperNameList"
											:key="item.name"
											:title="item.name"
											>{{ item.name }}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="8">
								<a-form-item label="运单号">
									<a-input
										autocomplete="off"
										v-decorator="[
											`waybillNo`,
											{
												validateTrigger: 'change',
												rules: [
													{
														required: true,
														message: `请输入运单号`
													},
													{ validator: validWaybillNo }
												]
											}
										]"
									>
									</a-input>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</template>
				<div class="slTitleAssis">
					附件信息
					<a-button
						type="primary"
						ghost
						style="margin-left: 30px"
						@click="addFiles"
						>新增附件</a-button
					>
				</div>
				<div class="upload-wrap">
					<FileUpload
						:ifEditable="true"
						@uploadFiles="getUploadFiles"
						:fileDataSource="fileDataSource"
						:type="'deliverPlan'"
						:transType="baseInfoForm.getFieldValue('transportMode')"
						ref="uploadFiles"
					>
					</FileUpload>
				</div>
			</div>
			<div class="btn-wrap">
				<a-button @click="$router.push('/center/steels/deliverPlan/list')">取消</a-button>
				<a-button
					type="primary"
					@click="handleSubmit('save')"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="handleSubmit('submit')"
					>提交</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/center/steels/components/Breadcrumb.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import DeliverDetails from './components/DeliverDetails.vue';
import FileUpload from './components/FileUpload.vue';
import reg from '@sub/utils/reg.js'
import {
	API_CommonCompanySearch,
	API_WarehouseContract,
	API_ShipmentPlanSave,
	API_ShipmentPlanSubmit,
	API_ShipmentPlanDetail
} from '@/v2/center/steels/api/deliverPlan.js';
import { API_GETOAUSERBYKEYWORD } from '@/v2/center/steels/api';
import { API_getApiTrainDeliverShipper, API_saveTrainDeliverShipper } from '@/v2/center/trade/api/receive';
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';

export default {
	name: 'ReleaseApplyList',
	data() {
		this.handlePersonSearch = debounce(this.handlePersonSearch, 800);
		return {
			getPopupContainer,
			baseInfoForm: this.$form.createForm(this),
			deliverInfoForm: this.$form.createForm(this),
			fetching: false,
			fetching1: false,
			fetching2: false,
			fetching3: false,
			deliverCompanyList: [],
			wareHouseList: [],
			shipperNameList: [],
			transTypeList: [
				{
					value: 'TRAIN',
					name: '火运'
				},
				{
					value: 'TRUCKS',
					name: '汽运'
				}
			],
			oaUserNameList: [],
			routes: [
				{
					path: '',
					name: '发货计划管理'
				},
				{
					path: '/center/steels/deliverPlan/list',
					name: '发货计划'
				},
				{
					path: '/center/steels/deliverPlan/add',
					name: '新增发货计划'
				}
			],
			fileInfos: [],
			fileDataSource: [],
			fileType: {
				TRAIN: [
					{
						key: 'SHIPMENT_PLAN_PARTICULARS',
						label: '钢厂发货计划清单',
						required: true
					},
					{
						key: 'RAILWAY_TICKET',
						label: '大票',
						required: true
					}
				],
				TRUCKS: [
					{
						key: 'SHIPMENT_PLAN_PARTICULARS',
						label: '钢厂发货计划清单',
						required: true
					}
				]
			},
			detail: {},
			particularsList: [],
			targetDeliverCompany: {} // 被选中的发货企业
		};
	},
	components: {
		Breadcrumb,
		DeliverDetails,
		FileUpload
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		} else {
			this.$nextTick(() => {
				this.baseInfoForm.setFieldsValue({
					transportMode: 'TRAIN'
				});
			});
		}
	},
	methods: {
		initFormData() {
			return new Promise(async (resolve, reject) => {
				await this.handleDeliverCompanySearch(this.detail.sellCompanyName);
				await this.handleWareHouseSearch(this.detail.warehouseAbbreviation);
				await this.handleDeliverCompanySelect(this.detail.sellCompanyName);
				this.$nextTick(() => {
					this.baseInfoForm.setFieldsValue({
						sellCompanyName: this.detail.sellCompanyName,
						warehouseId: this.detail.warehouseId.toString(),
						contractNo: this.detail.contractNo,
						transportMode: this.detail.transportMode,
						noticeUsers: this.oaUserNameList.map(el => {
							return el.text;
						})
					});
					if (this.detail.transportMode === 'TRAIN') {
						setTimeout(() => {
							this.deliverInfoForm.setFieldsValue({
								consignor: this.detail.consignor,
								waybillNo: this.detail.waybillNo
							});
						}, 0);
					}
				});
				// 复制的合同存在合同模板被删除的可能
				resolve(true);
			});
		},
		getDetail() {
			API_ShipmentPlanDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detail = res.data || {};
					if (this.detail.noticeUsers.length) {
						this.oaUserNameList = this.detail.noticeUsers.map(el => {
							if (el.noticeName) {
								return {
									text: `${el.noticeName}-${el.noticePhone}`,
									id: `${el.noticeName}-${el.noticePhone}`
								};
							} else {
								return {
									text: `${el.noticePhone}`,
									id: `${el.noticePhone}`
								};
							}
						});
					}
					this.fileDataSource = this.detail.attachList || [];
					this.fileInfos = this.detail.attachList || [];
					this.particularsList = this.detail.particularsList || [];
					this.initFormData();
				}
			});
		},
		validMobile(rule, value, callback) {
			var numReg = /^[0-9]*$/;
			if (value && numReg.test(value)) {
				if (!/^1[3456789]\d{9}$/.test(value)) {
					callback('请输入正确的手机号');
				}
				callback();
			}
			callback();
		},
		validLength(rule, value, callback) {
			if (value && value.length && value.length > 60) {
				callback('长度要在1和60之间');
			} else {
				callback();
			}
		},
		validWaybillNo(rule, value, callback) {
			if (value) {
				if (value.length !== 12 && value.length !== 13) {
					callback('运单号为12位或者13位');
				}
				if (!/^[A-Z0-9]+$/.test(value)) {
					callback('请输入数字/大写字母/数字大写字母结合');
				}
				callback();
			}
			callback();
		},
		validSellCompanyName(rule, value, callback) {
			if (value) {
				if (!this.deliverCompanyList.length) {
					callback('没有找到匹配结果');
				} else {
					this.deliverCompanyList.forEach(item => {
						if (item.name === value) {
							this.targetDeliverCompany = item;
							if (!this.targetDeliverCompany.status) {
								callback('该企业状态异常，无法添加，请核对。');
							} else {
								callback();
							}
						}
					});
				}
			}
			callback();
		},
		addFiles() {
			this.$refs.uploadFiles.addFileType();
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		handleDeliverCompanySelect(val) {
			this.deliverCompanyList.forEach(item => {
				if (item.name === val) {
					this.targetDeliverCompany = item;
				}
			});
		},
		handleDeliverCompanySearch(name) {
			//获取发货企业列表
			if (!name) return;
			this.fetching = true;
			return API_CommonCompanySearch({
				query: name
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.deliverCompanyList = res.data || [];
					if (!this.deliverCompanyList.length) {
						this.$message.error('没有找到匹配结果');
					}
				}
			});
		},
		handleWareHouseSearch(name) {
			//获取仓库列表
			this.fetching1 = true;
			return API_WarehouseContract({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching1 = false;
					this.wareHouseList = res.data || [];
					if (!this.wareHouseList.length) {
						this.$message.error('没有找到匹配结果');
					}
				}
			});
		},
		async handlePersonSearch(value) {
			// 获取到库通知人员
			if (!value) return;
			var numReg = /^[0-9]*$/;
			let phoneFlag = false;
			if (numReg.test(value)) {
				if (!/^1[3456789]\d{9}$/.test(value)) {
					this.$message.error('请输入正确的手机号');
					return;
				}
				phoneFlag = true;
			}
			const params = {
				systemCode: 'CCS_OA',
				keyword: value,
				withNotFoundException: 0
			};
			this.fetching2 = true;
			try {
				const res = await API_GETOAUSERBYKEYWORD(params);
				const list = res.data || [];
				if (!list.length) {
					if (!phoneFlag) {
						this.$message.error('没有找到匹配结果');
						return;
					} else {
						this.oaUserNameList = [
							{
								text: value,
								id: value
							}
						];
						return;
					}
				}
				this.oaUserNameList = list.map(el => {
					return {
						text: `${el.USERNAME}-${el.MOBILE}`,
						id: `${el.USERNAME}-${el.MOBILE}`
					};
				});
				this.fetching2 = false;
			} catch (error) {
				this.fetching2 = false;
			}
		},
		handleShipperNameSelect(val) {
			// 选中托运人
			this.shipperNameList.forEach(item => {
				if (item.name == val) {
					if (!item.existed) {
						// 如果不存在则推送
						API_saveTrainDeliverShipper({
							shipperName: val
						}).then(() => {});
					}
				}
			});
		},
		handleShipperNameSearch(name) {
			//获取托运人名称
			if(!name) return
			if(!reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾')
				return
			}
			this.fetching3 = true;
			API_getApiTrainDeliverShipper({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching3 = false;
					this.shipperNameList = res.data || [];
				}
			});
		},
		verifyFile() {
			let transType = this.baseInfoForm.getFieldValue('transportMode');
			let fileType = '';
			let success = true;
			this.fileInfos.map(item => {
				fileType += item.attachmentType;
			});
			this.fileType[transType]
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(item.key)) {
						this.$message.error(`请上传${item.label}附件`);
						success = false;
					}
				});
			return success;
		},
		handleSubmit(type) {
			this.baseInfoForm.validateFieldsAndScroll((err, val) => {
				if (!err) {
					// 校验发运明细
					let dataSource = this.$refs.deliverDetails.form.tableDataSource;
					let detailsValid = this.$refs.deliverDetails.handleSubmit();
					if (!detailsValid) {
						return;
					}
					let dataObj = Object.assign({}, val);
					dataObj.id = this.$route.query.id || '';
					(dataObj.sellCompanyUscc = this.targetDeliverCompany.creditCode), (dataObj.particularsList = dataSource);
					let bondLetterLinkmanList = [];
					if (val.noticeUsers && val.noticeUsers.length) {
						val.noticeUsers.forEach(el => {
							const arr = el.split('-');
							let obj = {};
							if (arr.length > 1) {
								obj = {
									noticeName: arr[0],
									noticePhone: arr[1]
								};
							} else {
								obj = {
									noticePhone: arr[0]
								};
							}
							bondLetterLinkmanList.push(obj);
						});
						dataObj.noticeUsers = bondLetterLinkmanList;
					}
					let transType = this.baseInfoForm.getFieldValue('transportMode');
					//校验发货信息
					if (transType === 'TRAIN') {
						this.deliverInfoForm.validateFieldsAndScroll((error, values) => {
							if (!error) {
								dataObj.consignor = values.consignor;
								dataObj.waybillNo = values.waybillNo;
								// 校验附件
								if (!this.verifyFile()) {
									return;
								}
								dataObj.attachList = this.fileInfos;
								this.save(dataObj, type);
							}
						});
					} else {
						// 校验附件
						if (!this.verifyFile()) {
							return;
						}
						dataObj.attachList = this.fileInfos;
						this.save(dataObj, type);
					}
				}
			});
		},
		save(dataObj, type) {
			let API = type === 'save' ? API_ShipmentPlanSave : API_ShipmentPlanSubmit;
			API(dataObj).then(res => {
				if (res.success) {
					this.$message.success(type === 'save' ? '保存成功' : '提交成功');
					this.$router.push('/center/steels/deliverPlan/list');
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
.upload-wrap {
	margin-top: 20px;
}
/deep/.ant-select-selection__rendered,
/deep/.ant-select-selection {
	height: auto !important;
}
/deep/.ant-select-dropdown {
	top: 26px !important;
}
</style>
