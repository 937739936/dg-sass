<template>
	<div style="width: 100%">
		<div class="s-title">
			<span v-if="$route.query.type === 'add'">销售合同补录</span>
			<span v-if="$route.query.type === 'edit' || editInExecution">修改补录合同</span>
			<span v-if="$route.query.type === 'detail'">补录合同详情</span>
		</div>
		<div>
			<relation-order
				style="width: 50%"
				v-show="true"
				:showRelation="false"
				:oaflag="true"
				:OAData="false"
				ref="relation"
				:isOa="$route.query.type === 'detail'"
				:resultDetail="{}"
				v-if="false"
			/>
		</div>
		<a-row>
			<h3 style="margin: 30px 0">基本信息</h3>
		</a-row>
		<a-form
			:form="form"
			@submit="handleSubmit"
		>
			<a-row>
				<a-col :span="12">
					<a-form-item
						label="下游企业名称"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							show-search
							:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
							placeholder="请输入下游企业名称"
							style="width: 100%"
							:filter-option="false"
							:default-active-first-option="false"
							:not-found-content="fetching ? undefined : null"
							@search="getCompanyInfo"
							@select="handleSelect"
							v-decorator="[
								'buyCompanyName',
								{
									rules: [{ required: true, message: '下游企业名称必填' }]
								}
							]"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in companyList"
								:key="item.name"
							>
								{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="社会统一信用代码"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-col span="24">
							<a-input
								style="width: 100%"
								disabled
								v-decorator="[
									`buyCompanyUscc`,
									{
										rules: [{ required: true, message: `社会统一信用代码必填` }]
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="下游纸质合同编号"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-col span="24">
							<a-input
								@change="changeContractNo"
								style="width: 100%"
								placeholder="请输入下游纸质合同编号"
								:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
								v-decorator="[
									`contractNo`,
									{
										rules: [{ required: true, message: `下游纸质合同编号必填` }]
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="合同期限"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							@change="getTimeEnd"
							:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
							v-decorator="[
								'date',
								{
									rules: [{ type: 'array', required: true, message: '合同期限必填' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="合同金额（元）"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-col span="24">
							<a-input
								style="width: 100%"
								placeholder="请输入合同金额"
								:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
								v-decorator="[
									`amount`,
									{
										rules: [
											{ required: true, message: '合同金额必填' },
											{
												pattern: /^(?!0\.000)([0-9]{1,9}(\.[0-9]{1,3})?)$/,
												message: '输入范围0-999999999,最多3位小数'
											}
										]
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="钢材种类"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							placeholder="请选择"
							:disabled="$route.query.type === 'detail'"
							:getPopupContainer="getPopupContainer"
							mode="multiple"
							@change="handleChangeSteelType"
							v-decorator="[
								`steelType`,
								{
									initialValue: ['FINISHED_STEEL'],
									rules: [{ required: true, message: `钢材种类必填` }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in steelType"
								:key="index"
								:value="items.value"
							>
								{{ items.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="业务类型"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							placeholder="请选择"
							:disabled="$route.query.type === 'detail' || editInExecution || (form.getFieldValue('steelType') && form.getFieldValue('steelType').includes('SCRAP_STEEL'))"
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								`businessType`,
								{
									rules: [{ required: true, message: `业务类型必填`, type: 'string' }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in contractBusinessData"
								:key="index"
								:value="items.value"
							>
								{{ items.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="合同签订状态"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
							v-decorator="[
								`contractSignStatus`,
								{
									rules: [{ required: true, message: `合同签订状态必填`, type: 'string' }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in contractSignStatusData"
								:key="index"
								:value="items.value"
							>
								{{ items.label }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</a-col>
				<!-- 业务经理 -->
				<a-col :span="12">
					<a-form-model-item
						label="业务经理"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:filter-option="handleChangeTrader"
							:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
							v-decorator="[
								`assetTeamTraderId`,
								{
									rules: [{ required: true, message: `请选择业务经理`, type: 'string' }]
								}
							]"
							@change="handleChangeTraderName"
						>
							<a-select-option
								v-for="(d, i) in traderList"
								:key="i"
								:value="d.keyId"
							>
								{{ d.realname }},{{ d.phone }}
							</a-select-option>
						</a-select>
					</a-form-model-item>
				</a-col>

				<a-col
					:span="12"
					v-if="form.getFieldValue('contractSignStatus') === 'DOUBLE_SIGN'"
				>
					<a-form-item
						label="双签合同获得日期"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-date-picker
							format="YYYY-MM-DD"
							:allowClear="false"
							:disabled="$route.query.type === 'detail' || editInExecution"
							v-decorator="['doubleSignTime', { rules: [{ required: true, message: '请输入双签合同获得日期' }] }]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					v-if="checkIsContainSteeltype('SCRAP_STEEL') == true"
				>
					<a-col span="16">
						<a-form-item
							label="合同总数量（吨）"
							:label-col="{
								span: 9
							}"
							:wrapper-col="{
								span: 15
							}"
						>
							<a-radio-group
								:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
								v-decorator="[
									`acceptancePrevail`,
									{
										initialValue: false,
										rules: [{ required: true, message: `` }],
										validateTrigger: 'blur'
									}
								]"
							>
								<a-radio :value="false">自定义数值</a-radio>
								<a-radio :value="true">以验收数量为准</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<a-col
						span="8"
						v-if="!form.getFieldValue('acceptancePrevail')"
					>
						<a-form-item
							label=""
							:label-col="{
								span: 6
							}"
							:wrapper-col="{
								span: 16
							}"
						>
							<a-col span="24">
								<a-input-number
									style="width: 100%"
									placeholder="请输入合同总数量"
									:disabled="$route.query.type === 'detail' || doubleSign"
									v-decorator="[
										`quantity`,
										{
											rules: [{ required: true, message: `合同总数量必填` }, { validator: validateIndex }],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-col>
						</a-form-item>
					</a-col>
				</a-col>
				<a-col
					:span="12"
					v-else
				>
					<a-form-item
						label="合同总数量（吨）"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-col span="24">
							<a-input-number
								style="width: 100%"
								placeholder="请输入合同总数量"
								:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
								v-decorator="[
									`quantity`,
									{
										rules: [{ required: true, message: `合同总数量必填` }, { validator: validateIndex }],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="运输方式"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<template v-if="$route.query.type === 'detail' || doubleSign">
							<a-input
								style="width: 100%"
								disabled
								v-decorator="[
									`transportModeDesc`,
									{
										rules: [{ required: true }]
									}
								]"
							/>
						</template>
						<template v-else>
							<a-select
								:getPopupContainer="getPopupContainer"
								placeholder="请选择"
								:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
								v-decorator="[
									`transportMode`,
									{
										rules: [{ required: true, message: `运输方式必填`, type: 'string' }]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in deliveryData"
									:key="index"
									:value="items.value"
								>
									{{ items.label }}</a-select-option
								>
							</a-select>
						</template>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="合同签订日期"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-date-picker
							format="YYYY-MM-DD"
							:allowClear="false"
							:disabled="$route.query.type === 'detail' || doubleSign || editInExecution"
							v-decorator="['contractSignDate', { rules: [{ required: true, message: '请输入合同签订日期' }] }]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					v-if="!isOldData"
				>
					<a-form-item label="是否指定规格"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}">
						<a-select
							placeholder="请选择"
							:disabled="isDetail || handleType"
							v-decorator="[
								`appointSpec`,
								{
									rules: [{ required: true, message: `是否指定规格必填`, type: 'string' }]
								}
							]"
						>
							<a-select-option value="0">否</a-select-option>
							<a-select-option value="1">是</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<!-- <a-row>
		<h3 style="margin: 30px 0">
			货物信息
		</h3>
		</a-row> -->
		<div v-if="!isOldData">
			<!-- 废钢采购明细表 -->
			<ScrapSteelPurchaseDetails
				v-if="form.getFieldValue('steelType') && form.getFieldValue('steelType').includes('SCRAP_STEEL')"
				ref="scrapSteelPurchaseDetails"
				:steelType="form.getFieldValue('steelType') || []"
				:appointSpec="form.getFieldValue('appointSpec')"
				:selectedData="purchaseDetailsData"
				:editable="!isDetail && !handleType"
				type="sellSupplement"
			/>
			<PurchaseDetailsOther
				v-else
				ref="purchaseDetailsOther"
				type="sellSupplement"
				titleName="货物明细"
				:steelType="form.getFieldValue('steelType') || []"
				:contractTemplate="form.getFieldValue('contractTemplate')"
				:appointSpec="form.getFieldValue('appointSpec')"
				:selectedData="purchaseDetailsData"
				@change="getPurchaseData"
				:editable="!isDetail && !handleType"
				from="supplement"
				:resultDetail="detailData"
			/>
		</div>

		<a-row>
			<h3 style="margin: 30px 0">附件信息</h3>
		</a-row>
		<div class="upload-wrap">
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="$route.query.type !== 'detail'"
					@uploadFiles="getUploadFiles"
					:fileDataSource="fileDataSource"
					:type="'contract'"
				></CustomUpload>
			</div>
		</div>
		<!-- 按钮组 -->
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-col
				span="24"
				style="text-align: center"
			>
				<a-button
					@click.native="$router.back()"
					style="margin-left: 50px"
					>取消</a-button
				>
				<template v-if="$route.query.type !== 'detail' && !doubleSign && !editInExecution">
					<a-button
						type="primary"
						@click="handleSubmit('save')"
						style="margin-left: 50px"
					>
						保存
					</a-button>
					<a-button
						type="primary"
						@click="handleSubmit('submit')"
						style="margin-left: 50px"
					>
						提交
					</a-button>
				</template>
				<a-button
					v-if="doubleSign"
					type="primary"
					@click="saveDouble('submit')"
					style="margin-left: 50px"
				>
					提交
				</a-button>
				<a-button
					v-if="editInExecution"
					type="primary"
					@click="handleSubmit('submit')"
					style="margin-left: 50px"
				>
					确定
				</a-button>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import {
	API_SteelsAdditionalContractSave,
	API_SteelsAdditionalContractDetail,
	API_SteelsAdditionalContractUpdateToSave,
	getOAAuditCode,
	getAdditionalBusinessTypeList,
	API_SteelsAdditionalContractSubmit,
	saveUploadDoubleSigned
} from '@/v2/center/steels/api/contract.js';
import { API_GetCompanyName, API_COMPANYOACHECK, API_GETOAAUDITCODELIST } from 'api';
import { API_SteelsAllCode } from '@/v2/api/steels.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import RelationOrder from '../components/RelationOrder.vue';
import contract from '@/v2/center/steels/mixins/contract.js';
import PurchaseDetailsOther from '@/v2/center/steels/components/PurchaseDetailsOther.vue';
import ScrapSteelPurchaseDetails from '@/v2/center/steels/components/ScrapSteelPurchaseDetails.vue';
import { cloneDeep } from 'lodash';
export default {
	mixins: [contract],
	data() {
		return {
			getPopupContainer,
			// steelType: filterSteelsCodeByKey("steelType"),
			steelType: [
				{ value: 'FINISHED_STEEL', label: '建材' },
				{ value: 'SCRAP_STEEL', label: '废钢' }
			],
			form: this.$form.createForm(this),
			companyNameInfo: [], // 企业名称列表
			contractSignStatusData: filterSteelsCodeByKey('additionalContractSignStatus'),
			deliveryData: filterSteelsCodeByKey('salesSupplementTransportMode'),
			fileDataSource: [],
			fileInfos: [],
			params: {
				effectiveStartDate: '',
				effectiveEndDate: ''
			},
			detailData: {},
			companyList: [],
			fetching: false,
			oaflag: false,
			contractBusinessData: [],
			doubleSign: this.$route.query.doubleSign, // 上传双签合同。禁止编辑除了双签合同获得日期以及附件外的其他字段
			editInExecution: this.$route.query.type === 'in_execution', // 上传双签合同。禁止编辑除了双签合同获得日期以及附件外的其他字段
			purchaseDetailsData: []
		};
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 上传双签合同
		handleType() {
			return this.$route.query.handleType == 1;
		},
		isDetail() {
			return this.$route.query.type == 'detail';
		},
		// 判断是否是旧数据
		isOldData() {
			return this.isDetail && !this.purchaseDetailsData.length;
		}
	},
	mounted() {
		if (this.$route.query.contractId) {
			API_SteelsAdditionalContractDetail({ id: this.$route.query.contractId }).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.detailData.appointSpec = String(this.detailData.appointSpec || 0);
					// 附件信息修改为通用格式
					this.fileDataSource = res.data.attachmentList;
					if (res.data.attachmentList.length > 0) {
						this.fileDataSource = [];
						res.data.attachmentList.forEach(item => {
							let pro = {};
							(pro.id = item.fileId), (pro.typeName = '下游钢材买卖合同');
							(pro.key = item.attachmentType),
								(pro.path = item.attachmentPath),
								(pro.name = item.originalFileName),
								(pro.url = item.attachmentPath),
								this.fileDataSource.push(pro);
						});
					}
					this.params.effectiveStartDate = this.detailData.effectiveStartDate;
					this.params.effectiveEndDate = this.detailData.effectiveEndDate;
					this.detailData.steelType = this.detailData.steelType;
					this.detailData.date = [
						moment(this.detailData.effectiveStartDate, 'YYYY-MM-DD'),
						moment(this.detailData.effectiveEndDate, 'YYYY-MM-DD')
					];

					this.handleSearchTrader(`${this.detailData.assetTeamId}-${this.detailData.assetTeamTraderId}` || null);

					if (this.doubleSign) {
						this.detailData.contractSignStatus = 'DOUBLE_SIGN';
						this.fileDataSource = [];
					}
					this.form.setFieldsValue(this.detailData);
					this.$nextTick(() => {
						this.form.setFieldsValue({
							...this.detailData,
							assetTeamTraderId: this.detailData.assetTeamId
								? `${this.detailData.assetTeamId}-${this.detailData.assetTeamTraderId}`
								: ''
						});
					});
					this.purchaseDetailsData = res.data.contractPurchaseList;
				}
			});
		} else {
			this.handleSearchTrader();
		}
		this.getAdditionalBusinessTypeList();
		this.getSteelTypeList();
	},
	components: {
		RelationOrder,
		CustomUpload,
		PurchaseDetailsOther,
		ScrapSteelPurchaseDetails,
	},
	methods: {
		moment,
		// 获取素材明细
		getPurchaseData(quantity, list) {
			quantity = quantity?.toFixed(4)
			this.form.setFieldsValue({ quantity });
		},
		handleChangeSteelType(e) {
			// 包含废钢，业务类型只能选择应收
			this.form.setFieldsValue({
				businessType: e.includes('SCRAP_STEEL') ? 'ACCOUNT_RECEIVABLE' : ''
			})
			if (e.includes('SCRAP_STEEL')) {
				this.form.setFieldsValue({
					steelType: ['SCRAP_STEEL']
				})
			}
		},
		async getSystemCode() {
			const res = await API_GETOAAUDITCODELIST({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				industryType: 'STEEL'
			});
			if (res.data && res.data[0].systemVOList && res.data[0].systemVOList[0].systemCode) {
				this.systemCode = res.data[0].systemVOList[0].systemCode;
			}
		},
		async getOAAuditCode() {
			const res = await getOAAuditCode();
			this.oaInfo = res.data;
			this.getSystemCode();
		},
		// 判断是否对接oA
		async checkOA() {
			const res = await API_COMPANYOACHECK({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				industryType: 'STEEL'
			});
			this.oaflag = res.result;
			if (res.result) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
				this.getOAAuditCode();
			}
			this.$nextTick(() => {
				if (this.detailData.operatorName) {
					this.form.setFieldsValue({
						operatorName: this.detailData.operatorName
					});
					const { operatorName, operatorMobile } = this.detailData;
					this.curOperator = { operatorName, operatorMobile };
				}
			});
		},
		// 获取合同期限
		getTimeEnd(value, dateString) {
			this.params.effectiveStartDate = dateString[0];
			this.params.effectiveEndDate = dateString[1];
		},
		getCompanyInfo(v) {
			// 获取公司社会代码
			if (!v) {
				return;
			}
			this.fetching = true;
			API_GetCompanyName({ name: v })
				.then(res => {
					if (res.success) {
						setTimeout(() => {
							this.companyList = res.data;
						}, 50);
					}
				})
				.finally(() => (this.fetching = false));
		},
		handleSelect(e) {
			if (this.companyList.length > 0) {
				this.companyList.forEach(item => {
					if (item.name === e) {
						this.form.setFieldsValue({ buyCompanyUscc: item.creditCode });
					}
				});
			}
		},
		handleSubmit(type) {
			if (this.$refs.purchaseDetailsOther) {
				if (!this.$refs.purchaseDetailsOther.save()) {
					return;
				}
			}
			if(this.$refs.purchaseDetailsOther) {
				if(!this.$refs.purchaseDetailsOther.save()) {
					return
				}
			}

			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let obj = values;
					if (values.assetTeamTraderId) {
						const arr = values.assetTeamTraderId.split('-');
						obj.assetTeamTraderId = arr[1];
						obj.assetTeamId = arr[0];
					}
					obj.effectiveStartDate = this.params.effectiveStartDate;
					obj.effectiveEndDate = this.params.effectiveEndDate;
					if (this.fileInfos.length === 0) {
						// this.$message.error("请上传上游钢材买卖合同")
						this.$message.error('请上传下游钢材买卖合同');
						return;
					} else {
						obj.attachmentList = [];
						this.fileInfos.forEach(item => {
							let pro = {};
							pro.attachmentType = 'STEEL_BUSINESS_CONTRACT';
							pro.fileId = item.id;
							obj.attachmentList.push(pro);
						});
					}
					obj.contractSignDate =
						typeof values.contractSignDate == 'string' ? values.contractSignDate : values.contractSignDate.format('YYYY-MM-DD');
					obj.doubleSignTime = values.doubleSignTime
						? typeof values.doubleSignTime == 'string'
							? values.doubleSignTime
							: values.doubleSignTime.format('YYYY-MM-DD')
						: undefined;
					obj.contractCategory = 'DOWN';
					obj.steelType = values.steelType;
					// 货物明细
					let warehouseArr = [];
						if (this.$refs.purchaseDetailsOther) {
							warehouseArr = cloneDeep(this.$refs.purchaseDetailsOther.save()?.resultArr);
							obj.totalTaxAmount = this.$refs.purchaseDetailsOther.save()?.totalTaxAmount || 0
							obj.contractPurchaseList = cloneDeep(warehouseArr)
						}
					if (this.$refs.scrapSteelPurchaseDetails) {
						obj.contractPurchaseList = cloneDeep(this.$refs.scrapSteelPurchaseDetails.save());
					}

					obj.contractPurchaseList.forEach(el => {
						el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
						el.theoreticalWeight = el.theoreticalWeight == '/' ? '' : el.theoreticalWeight;
						// 如果是指定规格则 ；品名转换成数组
						if (values.appointSpec == 1 && !Array.isArray(el.materialName)) {
							el.materialName = [el.materialName];
						}
						if (this.$refs.scrapSteelPurchaseDetails) {
							el.materialName = [el.materialName]
						}
					});
					// 	提交时校验企查查接口 若查询不到则不允许提交
					API_GetCompanyName({ name: values.buyCompanyName }).then(res => {
						let companyData = res.data || null;
						if (companyData) {
							let API = API_SteelsAdditionalContractSave;
							if (this.$route.query.type === 'edit' || this.editInExecution) {
								obj.id = this.$route.query.contractId;
							}
							if (type == 'submit') {
								API = API_SteelsAdditionalContractSubmit;
							}
							API(obj).then(res => {
								if (res.success) {
									this.$message.success('补录成功！');
									this.$router.push({
										path: '/center/steels/contract/sell/list'
									});
								}
							});
						}
					});
				}
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		validateIndex(rule, value, callback) {
			if (value) {
				let reg = /^(\d+)(.\d{0,4})?$/;
				if (!reg.test(value) || value >= 10000000) {
					callback('数量不超过10000000吨，最多四位小数');
				}
			}
			callback();
		},
		changeContractNo(e) {
			if (e.target.value) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						contractNo: e.target.value.replace(/\s*/g, '')
					});
				});
			}
		},
		// 获取补录业务类型
		async getAdditionalBusinessTypeList() {
			const res = await getAdditionalBusinessTypeList({ contractType: 'SELL' });

			this.contractBusinessData = res.data;
		},
		// 保存双签合同
		async saveDouble() {
			const obj = {
				id: this.$route.query.contractId
			};
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					obj.doubleSignTime =
						typeof values.doubleSignTime == 'string' ? values.doubleSignTime : values.doubleSignTime.format('YYYY-MM-DD');
				}
			});
			if (!this.fileInfos.length) {
				this.$message.error('请上传钢材买卖合同');
				return;
			}
			obj.attachmentList = [];
			this.fileInfos.forEach(item => {
				let pro = {};
				pro.attachmentType = 'STEEL_BUSINESS_CONTRACT';
				pro.fileId = item.id;
				obj.attachmentList.push(pro);
			});
			await saveUploadDoubleSigned(obj);
			this.$message.success('补录成功！');
			this.$router.go(-1);
		},
		// 获取钢材种类
		async getSteelTypeList() {
			const res = await API_SteelsAllCode();
			this.steelType = res.data.steelType;
			// this.steelTypeInfo = this.steelTypeList.find(el => el.value == 'FINISHED_STEEL')
		},
		checkIsContainSteeltype(type) {
			const selectSteelTypeList = this.form.getFieldValue('steelType');
			if (!selectSteelTypeList) {
				return;
			}

			if (selectSteelTypeList.indexOf(type) == -1) {
				return false;
			}
			return true;
		}
	}
};
</script>
<style lang="stylus" scoped>
::v-deep.ant-col-12 {
  height: 60px;
  margin-bottom: 10px;
}

::v-deep.ant-calendar-picker {
  width: 100%;
}
</style>
