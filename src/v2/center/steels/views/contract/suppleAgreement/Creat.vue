<template>
	<div>
		<div class="s-title">
			<span>{{ id ? '编辑' : '新增' }}补充协议</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div>
			<a-form
				:form="form"
				class="form"
				labelAlign="left"
				layout="inline"
			>
				<h3 class="title">补充协议</h3>
				<div>
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col :span="12">甲方（买方）：{{ contractDetail.buyCompanyName }}</a-col>
						<a-col
							:span="12"
							class="tr"
						>
							<a-form-model-item
								label="签订日期"
								:colon="false"
							>
								<a-date-picker
									:getPopupContainer="getPopupContainer"
									:allowClear="false"
									@change="handleSignDate"
									v-decorator="['signDate', { rules: [{ required: true, message: '请输入签订日期' }] }]"
									format="YYYY-MM-DD"
									style="width: 100%"
								/>
							</a-form-model-item>
						</a-col>
					</a-row>
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col :span="12">乙方（卖方）：{{ contractDetail.sellCompanyName }}</a-col>
						<a-col
							:span="12"
							class="tr"
						>
							<span style="margin-right: 118px">签订地点：{{ contractDetail.contractSignPlace }}</span>
						</a-col>
					</a-row>
				</div>
				<p class="desc indent">
					鉴于甲乙双方于{{ moment(contractDetail.signDate).format('LL') }}签订了编号为
					<span>{{ contractDetail.contractNo }}</span> 的《{{ contractDetail.contractName }}》
					<span v-if="contractDetail.completedSupplementalAgreement">{{ contractDetail.completedSupplementalAgreement }}</span>
					(以下合称“原合同”)，现经过甲乙双协商沟通一致，对原合同进行补充约定，以资各方共同遵守。
				</p>
				<p class="indent">一、对采购物资明细约定<span class="red">（如无变动，无需操作）</span></p>
				<div>
					<!-- 采购明细表 -->
					<PurchaseDetails
						v-if="handleType == 2"
						ref="purchaseDetails"
						:steelType="[$route.query.steelType]"
						:appointSpec="contractDetail.appointSpec"
						:selectedData="purchaseDetailsData"
						:editable="editable"
						:agreementDetail="agreementDetail"
					/>

					<PurchaseDetails02
						v-if="handleType == 3"
						:type="contractDetail.contractType == 'BUY' ? 'sell' : 'buy'"
						ref="purchaseDetails"
						:noTitle="true"
						:steelType="[$route.query.steelType]"
						:appointSpec="contractDetail.appointSpec"
						:selectedData="purchaseDetailsData"
						:editable="editable"
					/>

					<PurchaseDetailsRECEIVABLE_STEEL_BUY_002
						v-if="handleType == 8"
						:type="contractDetail.contractType == 'BUY' ? 'sell' : 'buy'"
						ref="purchaseDetails"
						:noTitle="true"
						:steelType="[$route.query.steelType]"
						:appointSpec="contractDetail.appointSpec"
						:selectedData="purchaseDetailsData"
						:editable="editable"
					/>

					<ScrapSteelPurchaseDetails
						v-if="handleType === 1"
						ref="scrapSteelPurchaseDetails"
						:selectedData="purchaseDetailsData"
						:editable="editable"
					/>
				</div>

				<p class="indent">
					二、变更合同期限 <span v-if="handleType != 1">、收货人信息</span>
					<span class="red">（如有变动，请先勾选变更的字段）</span>
				</p>
				<div class="checkbox mt16">
					<a-form-model-item
						label=""
						:colon="false"
					>
						<a-checkbox-group
							v-decorator="['changeContent', { rules: [{ required: false, message: '请选择需要修改的内容' }] }]"
							@change="checkChange"
						>
							<a-checkbox
								:value="item.value"
								:key="item.value"
								v-for="item in checkboxOptions"
							>
								{{ item.label }}
							</a-checkbox>
						</a-checkbox-group>
					</a-form-model-item>
				</div>
				<template>
					<table
						class="table"
						cellspacing="0"
						cellpadding="0"
						v-if="changeContent().length > 0"
					>
						<tbody>
							<tr>
								<th width="5%">序号</th>
								<th width="10%">字段名称</th>
								<th width="16%">基于原合同条款</th>
								<th width="20%">变更前</th>
								<th width="30%">变更后</th>
								<th>变更说明</th>
							</tr>
							<template v-for="(item, index) in changeContent()">
								<!-- 合同期限 -->
								<tr
									v-if="item === 'effectiveDate'"
									:key="index"
								>
									<td>{{ index + 1 }}</td>
									<td>合同期限</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												v-decorator="[
													'effectiveDate-regulation',
													{
														rules: [
															{ required: true, message: '请输入合同条款' },
															{ max: 20, message: '合同条款长度不能超过20个字符' }
														]
													}
												]"
												style="width: 100%"
											/>
										</a-form-model-item>
									</td>
									<td>{{ contractDetail.effectiveStartDate }}~{{ contractDetail.effectiveEndDate }}</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-range-picker
												:allowClear="false"
												v-decorator="['effectiveDate', { rules: [{ required: true, message: '请选择合同期限' }, { validator }] }]"
												format="YYYY-MM-DD"
											/>
										</a-form-model-item>
									</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												style="width: 100%"
												placeholder="请输入变更说明"
												v-decorator="[
													'effectiveDate-description',
													{ rules: [{ max: 200, message: '变更说明长度不能超过200个字符' }] }
												]"
											/>
										</a-form-model-item>
									</td>
								</tr>
								<!-- 甲方收货人 -->
								<tr
									v-if="item === 'buyerContactId'"
									:key="index"
								>
									<td>{{ index + 1 }}</td>
									<td>{{ handleType == 3 ? '甲方联系人' : '甲方收货人' }}</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												v-decorator="[
													'buyerContactId-regulation',
													{
														rules: [
															{ required: true, message: '请输入合同条款' },
															{ max: 20, message: '合同条款长度不能超过20个字符' }
														]
													}
												]"
												style="width: 100%"
											/>
										</a-form-model-item>
									</td>
									<td>
										<p>姓名：{{ contractDetail.buyerContactName }}</p>
										<p>手机号：{{ contractDetail.buyerContactPhone }}</p>
										<p>身份证号：{{ contractDetail.buyerContactIdCard }}</p>
									</td>

									<td>
										<a-form-model-item
											label="姓名"
											:colon="false"
										>
											<a-select
												:disabled="disabled"
												@select="contactOneSelect"
												@dropdownVisibleChange="dropdownVisibleChangeOne"
												placeholder="请选择甲方收货人"
												v-decorator="[
													'buyerContactId',
													{
														rules: [{ required: true, message: '甲方收货人必填' }, { validator }],
														validateTrigger: 'change'
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
										</a-form-model-item>

										<template v-if="form.getFieldValue('buyerContactId')">
											<p>手机号：{{ receiverPhone }}</p>
											<p>身份证号：{{ receiverIdCard }}</p>
										</template>
									</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												style="width: 100%"
												placeholder="请输入变更说明"
												v-decorator="[
													'buyerContactId-description',
													{ rules: [{ max: 200, message: '变更说明长度不能超过200个字符' }] }
												]"
											/>
										</a-form-model-item>
									</td>
								</tr>
								<!-- 乙方联系人 -->
								<tr
									v-if="item === 'sellerContactId'"
									:key="index"
								>
									<td>{{ index + 1 }}</td>
									<td>乙方联系人</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												v-decorator="[
													'sellerContactId-regulation',
													{
														rules: [
															{ required: true, message: '请输入合同条款' },
															{ max: 20, message: '合同条款长度不能超过20个字符' }
														]
													}
												]"
												style="width: 100%"
											/>
										</a-form-model-item>
									</td>
									<td>
										<p>姓名：{{ contractDetail.sellerContactName }}</p>
										<p>手机号：{{ contractDetail.sellerContactPhone }}</p>
										<p>邮箱：{{ contractDetail.sellerContactEmail }}</p>
									</td>
									<td>
										<a-form-model-item
											label="姓名"
											:colon="false"
										>
											<a-select
												:disabled="disabled"
												@select="contactSecondSelect"
												@dropdownVisibleChange="dropdownVisibleChangeTwo"
												placeholder="请选择乙方联系人"
												v-decorator="[
													'sellerContactId',
													{
														rules: [{ required: true, message: '乙方联系人必填' }, { validator }],
														validateTrigger: 'change'
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
										</a-form-model-item>
										<template v-if="form.getFieldValue('sellerContactId')">
											<p>手机号：{{ contactsPhone }}</p>
											<!-- 判断 仓押业务 -->
										</template>
									</td>
									<td>
										<a-form-model-item
											label=""
											:colon="false"
										>
											<a-input
												style="width: 100%"
												placeholder="请输入变更说明"
												v-decorator="[
													'sellerContactId-description',
													{ rules: [{ max: 200, message: '变更说明长度不能超过200个字符' }] }
												]"
											/>
										</a-form-model-item>
									</td>
								</tr>
							</template>
						</tbody>
					</table>
				</template>
			</a-form>

			<p class="indent mt16 mb16">三、对其他事项的补充约定</p>
			<div>
				<ContractTemplate
					type="1"
					value="otherAppointHtmlStr"
					:getData="getData"
					:problemList="problemList"
					:defaultValue="supplementalAgreement"
				/>
			</div>

			<a-row
				style="margin-top: 50px"
				type="flex"
				justify="center"
			>
				<a-space>
					<a-button
						:disabled="disabled"
						ghost
						type="primary"
						@click="goBack"
						>取消</a-button
					>
					<a-button
						:disabled="disabled"
						ghost
						type="primary"
						@click="save(1)"
						>存草稿</a-button
					>
					<a-button
						:disabled="disabled"
						type="primary"
						@click="save(2)"
						>预览</a-button
					>
					<a-button
						:disabled="disabled"
						type="primary"
						@click="save(3)"
						>提交</a-button
					>
				</a-space>
			</a-row>
		</div>
		<a-modal
			title="补充协议"
			width="1000px"
			v-model="visible"
			@cancel="visible = false"
		>
			<template slot="footer">
				<a-button
					type="primary"
					@click="downFile()"
					>下载PDF</a-button
				>
			</template>
			<PdfPreview
				:url="pdfUrl"
				type="base64"
			/>
		</a-modal>
		<a-modal
			title="敏感词提示"
			:visible="problemVisible"
			@cancel="problemVisible = false"
		>
			<p style="margin-bottom: 24px">
				您提交的数据中存在以下敏感词，建议您进行修改，如不修改，可能影响您合同后续的执行或融资，建议您线下先和平台运营或风控做好确认。
			</p>
			<p>敏感词列表：</p>
			<p>
				{{ problemList.join('、') }}
			</p>
			<div slot="footer">
				<a-button @click="continueNext">继续执行下一步</a-button>
				<a-button
					type="primary"
					@click="problemVisible = false"
					>返回修改</a-button
				>
			</div>
		</a-modal>
	</div>
</template>
<script lang="jsx">
import {
	API_SupplementalAgreementSaveDraft,
	API_SupplementalAgreementUpdateToSave,
	API_SupplementalAgreementPreview,
	API_SupplementalAgreementSubmit,
	API_SupplementalAgreementModifyDetail,
	API_SupplementalAgreementContractDetail
} from '@/v2/api/steels.js';
import { API_COMPANYLINKMANFINDBYCOMPANYID } from '@/v2/api/account';
import ContractTemplate from '@/v2/components/template/index.vue';

import PdfPreview from '@sub/components/pdf/index.vue';
import { labelCol, wrapperCol } from '@/v2/config/layoutConfig';
import { getPopupContainer, down } from '@/v2/utils/factory.js';
import moment from 'moment';
import { delay } from 'lodash';
import { mapGetters } from 'vuex';
import PurchaseDetails from './components/PurchaseDetails.vue';
import PurchaseDetails02 from '@/v2/center/steels/components/PurchaseDetails02.vue';
import PurchaseDetailsRECEIVABLE_STEEL_BUY_002 from '@/v2/center/steels/components/PurchaseDetailsRECEIVABLE_STEEL_BUY_002';

import ScrapSteelPurchaseDetails from '@/v2/center/steels/components/ScrapSteelPurchaseDetails.vue';
import { cloneDeep } from 'lodash';
import { API_SensitiveWordsCheck } from '@/v2/api';

const columns = [
	{ title: '序号', dataIndex: 'mobile1' },
	{ title: '基于原合同条款', dataIndex: 'mobile11' },
	{ title: '变更前', dataIndex: 'mobile111' },
	{ title: '变更后', dataIndex: 'mobile12' },
	{ title: '变更说明', dataIndex: 'mobile123' }
];

const checkboxOptions2 = [
	{ label: '合同期限', value: 'effectiveDate' },
	{ label: '甲方联系人', value: 'buyerContactId' },
	{ label: '乙方联系人', value: 'sellerContactId' }
];
const checkboxOptions = [
	{ label: '合同期限', value: 'effectiveDate' },
	{ label: '甲方收货人', value: 'buyerContactId' },
	{ label: '乙方联系人', value: 'sellerContactId' }
];

export default {
	name: 'SuppleAgreementCreat',
	components: {
		ContractTemplate,
		PdfPreview,
		PurchaseDetails,
		PurchaseDetails02,
		ScrapSteelPurchaseDetails,
		PurchaseDetailsRECEIVABLE_STEEL_BUY_002
	},

	data() {
		return {
			columns,
			getPopupContainer,
			labelCol,
			wrapperCol,
			moment,
			contractId: '',
			visible: false,
			pdfUrl: '',
			form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
			loading: false,
			signContent: '',
			id: '',
			agreementDetail: {},
			url: '',
			supplementalAgreement: '',
			oldValue: {},
			buyerContactIdItem: [],
			transportModeDict: [],
			placeData: [],
			contractDetail: {},
			contractNo: '',
			completedSuppleAgreement: {},
			formDataIsChanged: false,
			currentStep: 1,
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写补协信息'
				},
				{
					title: '完成'
				}
			],
			contactOneList: [], // 甲方收货人

			contactSecondList: [], // 乙方联系人
			contactOneInfo: {},
			contactSecondInfo: {},
			receiverPhone: '', // 修改后甲方收货人手机号
			receiverIdCard: '', // 修改后甲方收货人身份证号
			contactsPhone: '', // 修改后乙方联系人电话
			purchaseDetailsData: [], //采购明细数据
			editable: true, // 采购明细表是否可编辑，默认可编辑
			confirmOperation: {
				continue: false,
				type: ''
			},
			problemList: [],
			problemVisible: false
		};
	},
	watch: {
		purchaseDetailsData: function (data) {
			this.purchaseDetailsData = data;
		}
	},
	computed: {
		disabled() {
			return this.loading;
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		checkboxOptions() {
			if (this.handleType == 1) {
				return [{ label: '合同期限', value: 'effectiveDate' }];
			}
			if (this.handleType == 3) {
				return checkboxOptions2;
			}
			return checkboxOptions;
		},
		// 是否仓押
		isWarehouse() {
			const flag = ['FINISHED_STEEL_BUY_002', 'FINISHED_STEEL_SELL_001'].includes(this.$route.query.contractTemplate);
			return flag;
		},
		handleType() {
			if (this.$route.query.contractTemplate == 'RECEIVABLE_STEEL_BUY_002') {
				return 8;
			}
			if (this.$route.query.steelType == 'SCRAP_STEEL') {
				return 1;
			}
			if (this.contractDetail.contractTemplate == 'STEEL_PROFILE') {
				return 2;
			}
			return 3;
		}
	},

	created() {
		const { id, contractNo, contractId } = this.$route.query;
		this.contractNo = contractNo;
		this.id = id;
		this.contractId = contractId;
		this.getContractDetail();
		if (this.id) {
			// 修改获取补协详情
			this.getAgreementDetail();
		}
	},

	methods: {
		openNewPage() {
			const { buyCompanyName, sellCompanyName, supplementalAgreementNo } = this.contractDetail;
			const { href } = this.$router.resolve({
				path: '/center/contract/detail',
				query: {
					contractNo: this.contractNo,
					contractId: this.contractId,
					zipFileName: `${this.contractNo}-${buyCompanyName}-${sellCompanyName}.zip`,
					no: supplementalAgreementNo,
					newTab: 'newTab'
				}
			});
			window.open(href);
		},

		downFile() {
			down(`data:application/pdf;base64,${this.pdfUrl}`, '补充协议.pdf');
		},

		handleSignDate(value) {
			if (!value) {
				return;
			}
			if (value.format('x') < this.maxSignDateTimeStamp) {
				const preValue = this.form.getFieldValue('signDate');
				this.$message.error(`签订日期不能小于${moment(this.maxSignDateTimeStamp).format('LL')}`);
				this.$nextTick(() => {
					if (preValue) {
						this.form.setFieldsValue({ signDate: preValue });
						return;
					}
					this.form.resetFields(['signDate']);
				});
			}
		},
		goBack() {
			this.$router.go(-1);
		},
		onValuesChange(props, values) {
			this.formDataIsChanged = true;
		},
		validator(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			const text = '变更前与变更后数据不能一致，请重新填写';
			if (rule.field === 'effectiveDate') {
				if (
					this.contractDetail.effectiveStartDate === value[0].format('YYYY-MM-DD') &&
					this.contractDetail.effectiveEndDate === value[1].format('YYYY-MM-DD')
				) {
					callback(text);
				}
				callback();
				return;
			}
			if (rule.field === 'buyerContactId') {
				if (this.contractDetail.buyerContactId === value) {
					callback(text);
				}
				callback();
				return;
			}
			if (rule.field === 'sellerContactId') {
				if (this.contractDetail.sellerContactId === value) {
					callback(text);
				}
				callback();
				return;
			}
			callback();
		},

		getContractDetail() {
			// 获取合同详情
			this.loading = true;
			API_SupplementalAgreementContractDetail({ contractNo: this.contractNo })
				.then(res => {
					if (res.success) {
						this.contractDetail = res.data;
						if (!this.id) {
							this.purchaseDetailsData = res.data.contractPurchaseList;
							this.agreementDetail = res.data;
						}
						this.loading = false;
					}
				})
				.catch(() => {
					this.loading = false;
				});
		},

		getAgreementDetail() {
			// 修改补充协议 获取详情
			API_SupplementalAgreementModifyDetail({ id: this.id })
				.then(res => {
					if (res.success) {
						const agreementDetail = res.data;
						this.agreementDetail = res.data;
						this.supplementalAgreement = agreementDetail.signContent;
						this.purchaseDetailsData = agreementDetail.purchaseList;
						if (this.isWarehouse) {
							this.getReceiveList2();
							this.getContactList2();
						} else {
							this.getReceiveList();
							this.getContactList();
						}

						delay(() => {
							this.formDataIsChanged = false;
						}, 1150);
						const changeContent = agreementDetail.changeItems.map(item => item.fieldName);
						let fields = {
							signDate: moment(agreementDetail.signDate)
						};
						this.$nextTick(() => {
							this.form.setFieldsValue(fields);
							this.form.setFieldsValue({ changeContent, ...fields });
						});
						if (agreementDetail.changeItems && agreementDetail.changeItems.length > 0) {
							agreementDetail.changeItems.forEach(item => {
								const fieldName = item.fieldName;
								fields = {
									...fields,
									[`${fieldName}-regulation`]: item.regulation,
									[`${fieldName}-description`]: item.description
								};
								item.itemDetails.forEach(i => {
									switch (fieldName) {
										case 'effectiveDate':
											if (i.itemName === 'effectiveStartDate') {
												fields = {
													...fields,
													effectiveDate: fields.effectiveDate || []
												};
												fields.effectiveDate[0] = moment(i.value);
											}
											if (i.itemName === 'effectiveEndDate') {
												fields = {
													...fields,
													effectiveDate: fields.effectiveDate || []
												};
												fields.effectiveDate[1] = moment(i.value);
											}
											break;
										case 'buyerContactId':
											if (i.itemName === 'buyerContactId') {
												fields = {
													...fields,
													buyerContactId: fields.buyerContactId || []
												};
												fields.buyerContactId = i.value;
												let timer = setInterval(() => {
													if (this.contactSecondList.length > 0) {
														this.contactSecondSelect(i.value);
														clearInterval(timer);
													}
												}, 500);
											}
											break;
										case 'sellerContactId':
											if (i.itemName === 'sellerContactId') {
												fields = {
													...fields,
													sellerContactId: fields.sellerContactId || []
												};

												fields.sellerContactId = i.value;
												let timer = setInterval(() => {
													if (this.contactSecondList.length > 0) {
														this.contactSecondSelect(i.value);
														clearInterval(timer);
													}
												}, 500);
											}
											break;
									}
								});
							});
						}
						let timer2 = setInterval(() => {
							if (this.contactOneList.length > 0) {
								this.$nextTick(() => {
									this.form.setFieldsValue(fields);
									this.formDataIsChanged = false;
									this.$nextTick(() => {
										this.form.setFieldsValue(fields);
										this.formDataIsChanged = false;
									});
								});
								clearInterval(timer2);
							}
						}, 500);
					}
				})
				.finally(() => {
					delay(() => {
						this.loading = false;
					}, 1000);
				});
		},

		changeContent() {
			// 选中修改项
			const changeContent = this.form.getFieldValue('changeContent') || [];
			const changeContentReorder = [];
			this.checkboxOptions.forEach(item => {
				if (changeContent.includes(item.value)) {
					changeContentReorder.push(item.value);
				}
			});
			return changeContentReorder;
		},

		handleChangeItemsData(value) {
			const changeContent = this.changeContent();
			const data = [];
			let fieldCNameDict = {};
			if (this.handleType == 2) {
				fieldCNameDict = {
					effectiveDate: '合同期限',
					buyerContactId: '甲方收货人',
					sellerContactId: '乙方联系人'
				};
			} else {
				fieldCNameDict = {
					effectiveDate: '合同期限',
					buyerContactId: '乙方联系人',
					sellerContactId: '甲方联系人'
				};
			}
			changeContent.forEach((item, index) => {
				let itemDetails = [];
				switch (item) {
					case 'effectiveDate':
						itemDetails = [
							{
								itemName: 'effectiveStartDate',
								itemCName: '合同期限开始',
								oldValue: this.contractDetail.effectiveStartDate,
								value: value[item][0].format('YYYY-MM-DD')
							},
							{
								itemName: 'effectiveEndDate',
								itemCName: '合同期限结束',
								oldValue: this.contractDetail.effectiveEndDate,
								value: value[item][1].format('YYYY-MM-DD')
							}
						];
						break;
					case 'buyerContactId':
						itemDetails = [
							{
								itemName: 'buyerContactId',
								itemCName: '乙方方收货人',
								oldValue: this.contractDetail.buyerContactId,
								value: value[item]
							}
						];

						break;
					case 'sellerContactId':
						itemDetails = [
							{
								itemName: 'sellerContactId',
								itemCName: '甲方联系人',
								oldValue: this.contractDetail.sellerContactId,
								value: value[item]
							}
						];
						break;
					default:
						break;
				}

				const valueItem = {
					itemDetails,
					serialNumber: index + 1, // 序号
					fieldName: item, // 变更字段
					fieldCName: fieldCNameDict[item],
					regulation: value[`${item}-regulation`], // 变更条列
					description: value[`${item}-description`] // 变更说明
				};
				data.push(valueItem);
			});

			return data;
		},

		save(v) {
			this.confirmOperation.type = v; // 缓存类型, 关键词时校验使用
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					switch (this.$route.query.steelType) {
						case 'FINISHED_STEEL':
							if (!this.$refs.purchaseDetails.save()) {
								return;
							}
							break;
						case 'SCRAP_STEEL':
							if (!this.$refs.scrapSteelPurchaseDetails.save()) {
								return;
							}
							break;
						default:
							break;
					}

					if (this.signContent.length > 5000) {
						this.$error({
							title: '补充约定长度不能超过5000个字符',
							okText: '确定',
							onOk() {}
						});
						return;
					}
					typeof this.signContent === 'string'
						? this.signContent.replace(/<\/?mgc.*?>/g, '').replace(/style="background-color: rgb\(255, 255, 0\);"/g, '')
						: this.signContent;
					let result = await this.checkProblem([this.signContent]);
					if (result && result.length && !this.confirmOperation.continue && this.confirmOperation.type != 2) {
						this.problemVisible = true;
						return;
					}
					const changeItems = this.handleChangeItemsData(values);

					const purchaseDetailsData = cloneDeep(this.purchaseDetailsData);
					(purchaseDetailsData || []).forEach(item => {
						item.materialName = Array.isArray(item.materialName) ? item.materialName : item.materialName.split(',');
						if (item.acceptancePrevail) {
							delete item.quantity;
						}
					});

					const params = {
						contractNo: this.contractNo,
						orderNo: this.$route.query.orderSerialNo,
						signDate: values.signDate.format('YYYY-MM-DD'),
						signContent: this.signContent,
						signAddress: this.contractDetail.contractSignPlace,
						changeItems,
						purchaseList: purchaseDetailsData
					};
					params.signContent =
						typeof params.signContent === 'string'
							? params.signContent.replace(/<\/?mgc.*?>/g, '').replace(/style="background-color: rgb\(255, 255, 0\);"/g, '')
							: params.signContent;
					if (this.id) {
						params.id = this.id;
					}
					this.loading = true;
					switch (v) {
						case 1: // 保存草稿
							this.toSaveDraft(params);
							break;
						case 2: // 预览
							this.toPreview(params);
							break;
						case 3: // 提交
							this.toPush(params);
							break;
					}
				}
			});
		},

		toSaveDraft(params) {
			// 保存草稿
			let API = this.$route.query.id ? API_SupplementalAgreementUpdateToSave : API_SupplementalAgreementSaveDraft;
			API(params)
				.then(res => {
					if (res.success && res.data) {
						this.$message.success('保存成功');
						this.$router.push({
							path: '/center/steels/suppleAgreement/list'
						});
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},

		toPreview(params) {
			// 预览
			API_SupplementalAgreementPreview(params)
				.then(res => {
					if (res.success) {
						this.visible = true;
						this.pdfUrl = res.data;
						// var iframe = "<iframe width='100%' height='100%' src='" + 'data:application/pdf;base64,' + res.data + "'></iframe>"
						// var x = window.open()
						// x.document.open()
						// x.document.write(iframe)
						// x.document.close()

						// // 模态窗口
						// // 二进制流
					}
				})
				.finally(() => (this.loading = false));
		},

		toPush(params) {
			// 提交
			this.$confirm({
				centered: true,
				title: '请确认数据填写无误，是否提交?',
				// content: '',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_SupplementalAgreementSubmit({ ...params, orderNo: this.$route.query.orderSerialNo })
						.then(res => {
							if (res.success && res.data) {
								this.$message.success('提交成功');
								this.$router.push({
									path: '/center/steels/suppleAgreement/list'
								});
							}
						})
						.finally(() => {
							this.loading = false;
						});
				},
				onCancel: () => (this.loading = false)
			});
		},

		getData(data) {
			this.onValuesChange();
			if (data.data.replace(/<[^>]+>/g, '') == '') {
				this.signContent = '';
			} else {
				this.signContent = data.data;
			}
		},

		dropdownVisibleChangeOne(v) {
			// 下拉获取甲方收货人
			if (!v) return;
			if (this.isWarehouse) {
				this.getReceiveList2();
			} else {
				this.getReceiveList();
			}
		},
		dropdownVisibleChangeTwo(v) {
			// 下拉获取乙方联系人
			if (!v) return;
			if (this.isWarehouse) {
				this.getContactList2();
			} else {
				this.getContactList();
			}
		},
		async getReceiveList() {
			// 获取甲方收货人
			let resone = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.VUEX_ST_COMPANYSUER.companyId
			});
			this.contactOneList = resone.success ? resone.data : [];
		},
		async getContactList() {
			// 获取乙方联系人
			let ressec = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.contractDetail.sellCompanyId || this.agreementDetail.sellCompanyId
			});
			this.contactSecondList = ressec.success ? ressec.data : [];
		},
		// 仓押业务
		async getReceiveList2() {
			// 获取甲方收货人

			let resone = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.contractDetail.sellCompanyId || this.agreementDetail.sellCompanyId
			});
			this.contactOneList = resone.success ? resone.data : [];
		},
		async getContactList2() {
			// 获取乙方联系人
			let ressec = await API_COMPANYLINKMANFINDBYCOMPANYID({
				companyId: this.contractDetail.buyCompanyId || this.agreementDetail.buyCompanyId
			});
			this.contactSecondList = ressec.success ? ressec.data : [];
		},

		contactOneSelect(v) {
			// 选择甲方收货人
			if (!v) return;
			this.contactOneList.forEach(item => {
				if (item.id == v) {
					this.contactOneInfo = item;
					this.receiverPhone = item.contactPhone;
					this.receiverIdCard = item.contactIdCard;
				}
			});
		},
		contactSecondSelect(v) {
			// 选择乙方联系人
			if (!v) return;
			this.contactSecondList.forEach(item => {
				if (item.id == v) {
					this.contactSecondInfo = item;
					this.contactsPhone = item.contactPhone;
				}
			});
		},

		checkChange(checkedList) {
			// 变更合同期限、收货人信息
			if (checkedList.includes('buyerContactId')) {
				this.getReceiveList();
			}
			if (checkedList.includes('sellerContactId')) {
				this.getContactList();
			}
		},
		async checkProblem(content) {
			let res = await API_SensitiveWordsCheck({ content });
			if (res.success) {
				this.problemList = res.data;
			}
			return Promise.resolve(this.problemList.sort((a, b) => b.length - a.length));
		},
		continueNext() {
			this.problemVisible = false;
			this.confirmOperation.continue = true;
			this.save(this.confirmOperation.type);
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .select-template {
	display: none;
}
::v-deep .ant-input-number {
	width: auto;
}
.form {
	::v-deep .ant-form-item {
		margin: 0;
	}
}
.table {
	width: 100%;
}
.title {
	padding: 15px 0px;
	text-align: center;
}
.desc {
	margin: 20px 0px;
}
.indent {
	text-indent: 2em;
}
.checkbox {
	padding-left: 2em;
}
.red {
	color: #f5222d;
}
th {
	background: #fafafa;
}
th,
td {
	padding: 8px;
	overflow-wrap: break-word;
	border-bottom: 1px solid #e8e8e8;
}
.ant-select {
	width: 200px;
}
</style>
