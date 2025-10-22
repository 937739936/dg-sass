<template>
	<div style="width: 100%">
		<div class="s-title">
			<span v-if="$route.query.type === 'edit'">修改补录合同</span>
			<span v-else-if="$route.query.type === 'detail'">补录合同详情</span>
			<span v-else>采购合同补录</span>
		</div>
		<div>
			<relation-order
				style="width: 100%"
				v-show="oaflag"
				:showRelation="false"
				:oaflag="oaflag"
				:OAData="false"
				ref="relation"
				:isOa="isDetail || handleType"
				:resultDetail="detailData"
			/>
		</div>
		<a-row>
			<h3 style="margin: 30px 0">基本信息</h3>
		</a-row>
		<a-form
			:form="form"
			@submit="handleSubmit"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-row>
				<a-col :span="12">
					<a-form-item label="上游企业名称">
						<a-select
							show-search
							:disabled="isDetail || handleType"
							placeholder="请输入上游企业名称"
							style="width: 100%"
							:filter-option="false"
							:default-active-first-option="false"
							:not-found-content="fetching ? undefined : null"
							@search="getCompanyInfo"
							@select="handleSelect"
							v-decorator="[
								'sellCompanyName',
								{
									rules: [{ required: true, message: '上游企业名称必填' }]
								}
							]"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="(item, i) in companyList"
								:key="item.name"
							>
								{{ item.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="社会统一信用代码">
						<a-col span="24">
							<a-input
								style="width: 100%"
								disabled
								v-decorator="[
									`sellCompanyUscc`,
									{
										rules: [{ required: true, message: `社会统一信用代码必填` }]
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="上游纸质合同编号">
						<a-col span="24">
							<a-input
								@change="changeContractNo"
								style="width: 100%"
								placeholder="请输入上游纸质合同编号"
								:disabled="isDetail || handleType"
								v-decorator="[
									`contractNo`,
									{
										rules: [{ required: true, message: `上游纸质合同编号必填` }]
									}
								]"
							/>
						</a-col>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="合同期限">
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							@change="getTimeEnd"
							:disabled="isDetail || handleType"
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
					<a-form-item label="钢材种类">
						<a-select
							placeholder="请选择"
							mode="multiple"
							:disabled="handleType || $route.query.type === 'detail'"
							:getPopupContainer="getPopupContainer"
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
					<a-form-item label="合同签订状态">
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:disabled="isDetail || handleType"
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
				<a-col :span="12">
					<a-form-item label="合同总数量（吨）">
						<a-col span="24">
							<a-input-number
								style="width: 100%"
								placeholder=""
								:disabled="true"
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
					<a-form-item label="合同签订日期">
						<a-date-picker
							format="YYYY-MM-DD"
							:allowClear="false"
							:disabled="isDetail || handleType"
							v-decorator="['contractSignDate', { rules: [{ required: true, message: '请输入合同签订日期' }] }]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="业务类型">
						<!-- 没有选择卖方之前资金来源没有数据 -->
						<a-select
							placeholder="请选择"
							:disabled="isDetail || handleType"
							v-decorator="[
								`businessType`,
								{
									rules: [{ required: true, message: `业务类型`, type: 'string' }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in contractBusinessData"
								:key="index"
								:value="items.value"
								>{{ items.label }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="是否承兑付款业务">
						<a-radio-group
							:disabled="isDetail || handleType"
							v-decorator="[
								`acceptancePayment`,
								{
									initialValue: 0,
									rules: [{ required: true, message: `请选择` }]
								}
							]"
						>
							<a-radio :value="0">否</a-radio>
							<a-radio :value="1">是</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
				<!-- 业务经理 -->
				<a-col :span="12">
					<a-form-model-item
						label="业务经理"
						prop="assetTeamTraderId"
					>
						<a-select
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:filter-option="handleChangeTrader"
							:disabled="isDetail || handleType"
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
					v-if="!isOldData"
				>
					<a-form-item label="是否指定规格">
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
				<a-col
					:span="12"
					v-if="form.getFieldValue('businessType') == 'AFFILIATED_BUSINESS'"
				>
					<a-form-item label="是否入库">
						<a-select
							placeholder="请选择"
							:disabled="isDetail || handleType"
							v-decorator="[
								`deliveryMode`,
								{
									rules: [{ required: true, message: `是否入库必填`, type: 'string' }]
								}
							]"
						>
							<a-select-option value="FACTORY_MENTION">厂提</a-select-option>
							<a-select-option value="WAREHOUSING">入库</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!-- 单签合同 -->
				<a-col
					:span="12"
					v-if="handleType"
				>
					<a-form-item
						label="单签合同"
						:label-col="{ span: 6 }"
						:wrapper-col="{ span: 16 }"
					>
						<a-col span="24">
							<a
								href="javascript:;"
								style="margin-left: 5px"
								v-for="(item, i) in singleContract"
								:key="i"
								@click="download(item)"
							>
								{{ item.name }} 下载
							</a>
						</a-col>
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
			<PurchaseDetailsOther
				ref="purchaseDetailsOther"
				type="buySupplement"
				titleName="货物明细"
				:steelType="form.getFieldValue('steelType') || []"
				:contractTemplate="form.getFieldValue('contractTemplate')"
				:appointSpec="form.getFieldValue('appointSpec')"
				:selectedData="purchaseDetailsData"
				:businessType="form.getFieldValue('businessType')"
				@change="getPurchaseData"
				:editable="!isDetail && !handleType"
				from="supplement"
				:resultDetail="detailData"
			/>
		</div>
		<a-row>
			<h3 style="margin: 30px 0">
				{{ handleType ? '双签合同附件' : '补录附件信息' }}
			</h3>
		</a-row>
		<div class="upload-wrap">
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="!isDetail || handleType"
					@uploadFiles="getUploadFiles"
					:columns="columns"
					:fileDataSource="fileDataSource"
					:type="'buyContract'"
				></CustomUpload>
			</div>
		</div>
		<div v-if="isDetail && !handleType">
			<a-row>
				<h3 style="margin: 30px 0">操作历史</h3>
			</a-row>
			<Log :logList="detailData.contractOperationList"></Log>
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
				<a-button @click.native="$router.back()">返回</a-button>
				<!-- 单签的保存和提交 -->
				<template v-if="!handleType && !isDetail">
					<a-button
						type="primary"
						@click="handleSubmit('save')"
						:loading="loadingSubmit"
						style="margin-left: 50px"
					>
						保存
					</a-button>
					<a-button
						type="primary"
						@click="handleSubmit('submit')"
						:loading="loadingSubmit"
						style="margin-left: 50px"
					>
						提交
					</a-button>
				</template>
				<template v-if="handleType && !isDetail">
					<a-button
						type="primary"
						@click="saveDouble('submit')"
						:loading="loadingSubmit"
						style="margin-left: 50px"
					>
						提交
					</a-button>
				</template>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory';
import { mapGetters } from 'vuex';
import {
	API_SteelsAdditionalContractSave,
	API_SteelsAdditionalContractSubmit,
	API_SteelsAdditionalContractDetail,
	saveUploadDoubleSigned,
	getOAAuditCode,
	getAdditionalBusinessTypeList
} from '@/v2/center/steels/api/contract.js';
import {
	API_GetCompanyName,
	API_getCommonDownload,
	API_GETOAUSERBYKEYWORD,
	API_GETOAAUDITCODELIST,
	API_COMPANYOACHECK
} from '@/v2/center/steels/api';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import Log from '@/v2/center/steels/components/Log.vue';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import PurchaseDetailsOther from '@/v2/center/steels/components/PurchaseDetailsOther.vue';
import { debounce } from 'lodash';
import { cloneDeep } from 'lodash';
import RelationOrder from '../components/RelationOrder.vue';
import contract from '@/v2/center/steels/mixins/contract.js';
const viewHandleColumns = [
	{ title: '操作类型', key: 'operateType', dataIndex: 'operateType' },
	{ title: '操作内容', key: 'operateContent', dataIndex: 'operateContent' },
	{ title: '操作时间', key: 'createDate', dataIndex: 'createDate' }
];
export default {
	mixins: [contract],
	data() {
		return {
			getPopupContainer,
			steelType: filterSteelsCodeByKey('upAdditionalSteelType'),
			form: this.$form.createForm(this),
			companyNameInfo: [], // 企业名称列表
			contractSignStatusData: filterSteelsCodeByKey('additionalContractSignStatus'),
			fileDataSource: [],
			fileInfos: [],
			singleContract: [],
			params: {
				effectiveStartDate: '',
				effectiveEndDate: ''
			},
			// 详情
			detailData: {},
			companyList: [],

			// 业务
			contractBusinessData: [],
			fetching: false,
			viewHandleColumns,
			disabled: false,
			columns: null,
			// 发起人
			oaInfo: {},
			oaUserNameList: [],
			systemCode: '',
			curOperator: {},
			oaflag: false,
			loadingSubmit: false,
			loadingSave: false,
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
	watch() {},
	mounted() {
		/** 采购合同补录 没有废钢类型 且业务类型只有代采和 代采+ 仓押 */
		if (this.$route.query.type == 'detail') {
			this.columns = [
				{
					title: '类型',
					dataIndex: 'typeName',
					width: '40%'
				},
				{
					title: '合同签订状态',
					dataIndex: 'contractSignStatusDesc',
					width: '30%'
				},
				{
					title: '操作',
					width: '30%',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			];
		}
		if (this.$route.query.contractId) {
			this.getDetail();
		} else {
			this.handleSearchTrader();
		}
		this.getAdditionalBusinessTypeList();
		this.checkOA();
	},
	components: {
		CustomUpload,
		Log,
		RelationOrder,
		PurchaseDetailsOther
	},
	methods: {
		moment,
		async getDetail() {
			const res = await API_SteelsAdditionalContractDetail({ id: this.$route.query.contractId });
			this.detailData = res.data;
			this.detailData.appointSpec = String(this.detailData.appointSpec || 0);
			// 附件信息修改为通用格式
			const attachmentList = res.data.attachmentList || [];
			const newAttachmentList = attachmentList.map(item => {
				let pro = {};
				pro.id = item.fileId;
				pro.typeName = item.attachmentTypeDesc;
				pro.key = item.attachmentType;
				pro.path = item.attachmentPath;
				pro.name = item.originalFileName;
				pro.url = item.attachmentPath;
				return { ...item, ...pro };
			});
			if (!this.handleType) {
				this.fileDataSource = newAttachmentList;
			} else {
				this.singleContract = newAttachmentList;
			}
			this.curOperator = { operatorName: res.data.operatorName, operatorMobile: res.data.operatorMobile };
			this.params.effectiveStartDate = this.detailData.effectiveStartDate;
			this.params.effectiveEndDate = this.detailData.effectiveEndDate;
			this.detailData.date = [
				moment(this.detailData.effectiveStartDate, 'YYYY-MM-DD'),
				moment(this.detailData.effectiveEndDate, 'YYYY-MM-DD')
			];
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
			this.handleSearchTrader(`${this.detailData.assetTeamId}-${this.detailData.assetTeamTraderId}` || null);

			/** 货物明细 */
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
						this.companyList = res.data;
					}
				})
				.finally(() => (this.fetching = false));
		},
		handleSelect(e) {
			if (!this.companyList.length) return;
			const item = this.companyList.find(el => el.name == e);
			this.form.setFieldsValue({ sellCompanyUscc: item.creditCode });
		},
		// 保存单签合同
		handleSubmit(type) {
			let relationFlag = false;
			if (this.$refs.relation) {
				this.$refs.relation.relationForm.validateFieldsAndScroll(error => {
					if (!error) {
						relationFlag = true;
					}
				});
			}
			if (this.$refs.purchaseDetailsOther) {
				if (!this.$refs.purchaseDetailsOther.save()) {
					return;
				}
			}
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					if (!relationFlag) {
						return;
					}
					let obj = { ...values, ...this.curOperator };
					if (values.assetTeamTraderId) {
						const arr = values.assetTeamTraderId.split('-');
						obj.assetTeamTraderId = arr[1];
						obj.assetTeamId = arr[0];
					}
					obj.effectiveStartDate = this.params.effectiveStartDate;
					obj.effectiveEndDate = this.params.effectiveEndDate;
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
					obj.contractSignDate =
						typeof values.contractSignDate == 'string' ? values.contractSignDate : values.contractSignDate.format('YYYY-MM-DD');
					obj.contractCategory = 'UP';
					obj.auditChainAndOperator = this.$refs.relation.auditChainAndOperator;
					// 货物明细
					let warehouseArr = [];
					if (this.$refs.purchaseDetailsOther) {
						warehouseArr = cloneDeep(this.$refs.purchaseDetailsOther.save()?.resultArr);
						obj.totalTaxAmount = this.$refs.purchaseDetailsOther.save()?.totalTaxAmount || 0;
					}
					obj.contractPurchaseList = cloneDeep(warehouseArr);

					obj.contractPurchaseList.forEach(el => {
						el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
						el.theoreticalWeight = el.theoreticalWeight == '/' ? '' : el.theoreticalWeight;
						// 如果是指定规格则 ；品名转换成数组
						if (values.appointSpec == 1 && !Array.isArray(el.materialName)) {
							el.materialName = [el.materialName];
						}
					});

					let res = await API_GetCompanyName({ name: values.sellCompanyName });
					let companyData = res.data || null;
					if (!companyData) {
						this.$message.error('上游企业验证未通过');
						return;
					}
					if (this.disabled) {
						return;
					}
					this.disabled = true;
					if (companyData) {
						let API = API_SteelsAdditionalContractSave;
						if (this.$route.query.type === 'edit') {
							obj.id = this.$route.query.contractId;
						}
						if (type == 'submit') {
							API = API_SteelsAdditionalContractSubmit;
						}
						try {
							await API(obj);
							this.disabled = false;
							this.$message.success('补录成功！');
							this.$router.go(-1);
						} catch (error) {
							this.disabled = false;
						}
					}
				}
			});
		},
		// 保存双签合同
		async saveDouble() {
			const obj = {
				id: this.$route.query.contractId
			};
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
			if (this.disabled) {
				return;
			}
			this.disabled = true;
			try {
				const res = await saveUploadDoubleSigned(obj);
				this.$message.success('补录成功！');
				this.disabled = false;
				this.$router.go(-1);
			} catch (error) {
				this.disabled = false;
			}
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
		download(item) {
			API_getCommonDownload(item.url).then(res => {
				comDownload(res, null, item.name);
			});
		},
		async getOAAuditCode() {
			const res = await getOAAuditCode();
			this.oaInfo = res.data;
			this.getSystemCode();
		},
		handleSearchYu: debounce(function (v) {
			if (!v) {
				return;
			}
			API_GETOAUSERBYKEYWORD({ keyword: v, systemCode: this.systemCode }).then(res => {
				this.oaUserNameList = (res.data || []).map(item => {
					return {
						text: item.USERNAME + '(' + item.DEPARTMENTPATHNAME + ')',
						value: item.USERNAME + ',' + item.MOBILE,
						operatorMobile: item.MOBILE,
						operatorName: item.USERNAME
					};
				});
			});
		}, 300),
		changeOperator(v) {
			const { operatorName, operatorMobile } = v;
			this.curOperator = { operatorName, operatorMobile };
		},
		// 判断是否对接oA
		async checkOA() {
			const res = await API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc, industryType: 'STEEL' });
			this.oaflag = res.result;
			if (res.result) {
				this.$refs.relation && this.$refs.relation.getoaauditcodelist(this.oaflag);
				this.getOAAuditCode();
			}
			this.$nextTick(() => {
				if (this.detailData.operatorName) {
					this.form.setFieldsValue({ operatorName: this.detailData.operatorName });
					const { operatorName, operatorMobile } = this.detailData;
					this.curOperator = { operatorName, operatorMobile };
				}
			});
		},
		async getSystemCode() {
			const res = await API_GETOAAUDITCODELIST({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc, industryType: 'STEEL' });
			if (res.data && res.data[0].systemVOList && res.data[0].systemVOList[0].systemCode) {
				this.systemCode = res.data[0].systemVOList[0].systemCode;
			}
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
			const res = await getAdditionalBusinessTypeList({ contractType: 'BUY' });

			this.contractBusinessData = res.data;
		},
		// 获取素材明细
		getPurchaseData(quantity, list) {
			quantity = quantity?.toFixed(4);
			this.form.setFieldsValue({ quantity });
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
