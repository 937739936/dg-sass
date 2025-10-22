<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>发货申请</span>
			<a-button
				type="primary"
				@click="$router.push('/center/steels/receive/deliver/list')"
			>
				<div>返回</div>
			</a-button>
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
		<!-- 基本信息 -->
		<div class="title"><i class="title_icon"></i>基本信息</div>
		<a-form
			:form="form"
			@submit="handleSubmit"
			:label-col="{
				span: 6
			}"
			:wrapper-col="{
				span: 12
			}"
		>
			<a-row>
				<a-col :span="12">
					<a-form-item label="合同编号">
						<a-input
							disabled
							v-decorator="[`contractNo`]"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="合同期限">
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							disabled
							v-decorator="[`date`]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="合同总数量(吨)">
						<a-input
							disabled
							v-decorator="[`contractQuantity`]"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="12" v-if="$route.query.flag === 'add'">
          <a-form-item
            label="合同总数量(吨)"
          >
            <a-input
            disabled
            v-decorator="[`quantity`]">
            </a-input>
          </a-form-item>
        </a-col> -->
				<a-col :span="12">
					<a-form-item label="运输方式">
						<a-select
							disabled
							v-decorator="[`transportMode`]"
						>
							<a-select-option
								v-for="(items, index) in deliveryData"
								:key="index"
								:value="items.value"
							>
								{{ items.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="发货日期">
						<a-date-picker
							placeholder="请选择"
							format="YYYY-MM-DD"
							@change="getShipmentDate"
							v-decorator="[
								'shipmentDate',
								{
									rules: [{ required: true, message: '发货日期必填' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="钢材种类">
						<a-select
							disabled
							v-decorator="[`steelType`]"
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
			</a-row>
		</a-form>
		<!-- 发货明细 -->
		<div class="title"><i class="title_icon"></i>发货明细</div>
		<div>
			<!-- 采购明细表 -->
			<PurchaseDetails
				v-if="['RECEIVABLE_STEEL_BUY_002', 'STEEL_PROFILE'].includes(detailData.contractTemplate)"
				ref="purchaseDetails"
				:selectedData="purchaseDetailsData"
				:contractTemplate="detailData.contractTemplate"
				:editable="editable"
			/>
			<ScrapSteelPurchaseDetails
				v-if="$route.query.steelType === 'SCRAP_STEEL'"
				ref="scrapSteelPurchaseDetails"
				:isNeedDeliveryAddress="true"
				:isNeedAcceptancePrevail="false"
				:isNeedPresetUnitPrice="false"
				:selectedData="purchaseDetailsData"
				:editable="editable"
			/>
		</div>

		<!-- 发货附件信息 -->
		<div class="title"><i class="title_icon"></i>发货附件信息</div>
		<div
			class="upload-wrap"
			v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(detailData.contractTemplate)"
		>
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:isScrapSteel="$route.query.steelType === 'SCRAP_STEEL'"
					:ifEditable="$route.query.type !== 'detail'"
					@uploadFiles="getUploadFiles"
					:fileDataSource="fileDataSource"
					:type="'deliver'"
				></CustomUpload>
			</div>
		</div>
		<FileTable
			v-if="['RECEIVABLE_STEEL_BUY_002'].includes(detailData.contractTemplate)"
			:add-type="fileType"
			@fileChange="getUploadFiles"
			:fileData="fileInfos"
		/>

		<div class="btn-wrap">
			<a-button @click="$router.push('/center/steels/receive/deliver/list')">返回</a-button>
			<a-button @click="handleSubmit('save')">保存</a-button>
			<a-button
				type="primary"
				@click="handleSubmit('submit')"
				>提交</a-button
			>
		</div>
	</div>
</template>

<script>
import {
	API_SteelsDeliverSave,
	API_SteelsDeliverUpdateToSave,
	API_SteelsDeliverSubmit,
	API_SteelsDeliverDetail,
	API_SteelsDeliverContractDetail
} from '@/v2/center/steels/api/receive.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

import PurchaseDetails from './components/PurchaseDetails.vue';
import ScrapSteelPurchaseDetails from '@/v2/center/steels/components/ScrapSteelPurchaseDetails.vue';
import FileTable from '@/v2/center/steels/views/receive/deliver/components/FileTable';

export default {
	name: 'ReleaseApplyList',
	data() {
		return {
			tableWidth: { x: 0 },
			currentStep: 1,
			steps: [{ title: '选择销售合同' }, { title: '填写发货信息' }, { title: '完成' }],
			form: this.$form.createForm(this),
			deliveryData: filterSteelsCodeByKey('transportMode'),
			steelType: filterSteelsCodeByKey('steelType'),
			fileDataSource: [],
			fileInfos: [],
			detailData: {},
			shipmentDate: null,
			editable: true,
			purchaseDetailsData: [],
			fileType: [
				{
					key: 'TRANSPORT',
					label: '运输凭证',
					required: true
				}
			]
		};
	},
	components: {
		CustomUpload,
		FileTable,
		PurchaseDetails,
		ScrapSteelPurchaseDetails
	},
	computed: {},
	mounted() {
		if (this.$route.query.deliverId) {
			API_SteelsDeliverDetail(this.$route.query.deliverId).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.purchaseDetailsData = res.data.shipmentParticularsList;
					if (['RECEIVABLE_STEEL_BUY_002'].includes(this.detailData.contractTemplate)) {
						this.purchaseDetailsData.map(i => {
							i.pieceQuantity = i.pieceQuantity || '/';
						});
					}
					this.detailData.date = [
						moment(this.detailData.effectiveStartDate, 'YYYY-MM-DD'),
						moment(this.detailData.effectiveEndDate, 'YYYY-MM-DD')
					];
					this.$nextTick(function () {
						let that = this;
						setTimeout(function () {
							that.form.setFieldsValue({
								...that.detailData,
								contractQuantity: that.detailData.contractQuantity || '-'
							});
						});
					});
					// 附件信息修改为通用格式钢材种类
					this.fileDataSource = res.data.receiptShipmentAttachList;
					if (res.data.receiptShipmentAttachList.length > 0) {
						this.fileDataSource = [];
						res.data.receiptShipmentAttachList.forEach(item => {
							let pro = {};
							(pro.id = item.fileId), (pro.typeName = this.CONSTANTSSTEELS.deliverFileDict[item.attachmentType]);
							(pro.key = item.attachmentType),
								(pro.path = item.attachmentPath),
								(pro.name = item.originalFileName || item.name),
								(pro.url = item.attachmentPath),
								this.fileDataSource.push(pro);
						});
					}
					this.fileInfos = this.fileDataSource;
					this.shipmentDate = this.detailData.shipmentDate;
				}
			});
		} else {
			API_SteelsDeliverContractDetail(this.$route.query.contractId).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.purchaseDetailsData = res.data.contractPurchaseList;

					if (this.detailData.steelType === 'SCRAP_STEEL') {
						this.purchaseDetailsData.forEach(item => {
							item.deliveryAddress = '';
							if (item.acceptancePrevail) {
								item.quantity = '';
							}
						});
					}
					this.detailData.date = [
						moment(this.detailData.effectiveStartDate, 'YYYY-MM-DD'),
						moment(this.detailData.effectiveEndDate, 'YYYY-MM-DD')
					];
					this.$nextTick(function () {
						let that = this;
						setTimeout(function () {
							that.form.setFieldsValue({
								...that.detailData,
								contractQuantity: that.detailData.contractQuantity || '-'
							});
						});
					});
					this.shipmentDate = this.detailData.shipmentDate;
				}
			});
		}
	},
	methods: {
		getShipmentDate(value, dateString) {
			// 发货日期
			this.shipmentDate = dateString;
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		handleSubmit(type) {
			this.form.validateFieldsAndScroll(err => {
				if (!err) {
					let obj = {};

					// 校验明细表
					// if (!this.$refs.purchaseDetails.save()) {
					// 	return
					// }
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

					// 校验附件
					if (this.detailData.contractTemplate === 'RECEIVABLE_STEEL_BUY_002') {
						if (this.fileInfos.length === 0) {
							this.$message.error('请上传运输凭证');
							return;
						}
					} else {
						if (this.fileInfos.length === 0 && this.$route.query.steelType !== 'SCRAP_STEEL') {
							this.$message.error('请上传上游钢筋计划');
							return;
						}
					}

					obj.receiptShipmentAttachList = [];
					this.fileInfos.forEach(item => {
						let pro = {};
						pro.attachmentType = item.key;
						pro.fileId = item.id;
						obj.receiptShipmentAttachList.push(pro);
					});

					obj.shipmentParticularsList =
						(this.$refs.purchaseDetails && this.$refs.purchaseDetails.save()) ||
						(this.$refs.scrapSteelPurchaseDetails && this.$refs.scrapSteelPurchaseDetails.save());
					obj.shipmentParticularsList.forEach(item => {
						item.materialName = Array.isArray(item.materialName) ? item.materialName.join('') : item.materialName;
					});

					if (['RECEIVABLE_STEEL_BUY_002'].includes(this.detailData.contractTemplate)) {
						obj.shipmentParticularsList.map(i => {
							i.pieceQuantity = i.pieceQuantity == '/' ? null : i.pieceQuantity;
						});
					}

					obj.contractNo = this.detailData.contractNo;
					obj.shipmentDate = this.shipmentDate;
					let API = type === 'save' ? API_SteelsDeliverSave : API_SteelsDeliverSubmit;
					if (this.$route.query.flag === 'edit') {
						// 修改
						obj.id = this.$route.query.deliverId;
						if (type === 'save') {
							API = API_SteelsDeliverUpdateToSave; // 修改后保存
						}
					}
					if (type === 'submit') {
						const that = this;
						that.$confirm({
							centered: true,
							title: `确定提交发货申请?`,
							okText: '确定',
							cancelText: '取消',
							onOk() {
								API(obj).then(res => {
									if (res.success) {
										that.$router.push({
											path: '/center/steels/receive/deliver/list'
										});
									}
								});
							},
							onCancel() {}
						});
					} else {
						API(obj).then(res => {
							if (res.success) {
								this.$router.push({
									path: '/center/steels/receive/deliver/list'
								});
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.release-applylist {
	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin: 15px 0 30px 0;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}
}

::v-deep.ant-calendar-picker {
	width: 100%;
}
</style>
