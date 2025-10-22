<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>收货确认</span>
			<a-button
				type="primary"
				@click="$router.push('/center/steels/receive/receipt/list')"
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
							v-decorator="[`quantity`]"
						>
						</a-input>
					</a-form-item>
				</a-col>
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
							disabled
							placeholder="请选择"
							format="YYYY-MM-DD"
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

		<!-- 发货附件信息 -->
		<div class="title"><i class="title_icon"></i>发货附件信息</div>
		<div class="upload-wrap">
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="false"
					:fileDataSource="fileDataSource"
					:type="'deliver'"
				></CustomUpload>
			</div>
		</div>

		<!-- 收货信息 -->
		<div class="title"><i class="title_icon"></i>收货信息</div>
		<a-form
			:form="receiveForm"
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
					<a-form-item label="收货日期">
						<a-date-picker
							placeholder="请选择"
							format="YYYY-MM-DD"
							:disabled-date="disabledDate"
							@change="getReceiveDate"
							v-decorator="[
								'receiveDate',
								{
									rules: [{ required: true, message: '发货日期必填' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div>
			<h2 style="font-size: 18px; margin: 10px 0">填写收货数量</h2>
			<!-- 采购明细表 -->
			<purchase-details
				v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(detailData.contractTemplate)"
				ref="purchaseDetails"
				:isReceipt="true"
				:steelType="this.$route.query.steelType"
				:selectedData="purchaseDetailsData"
				:editable="editable"
			/>
			<PurchaseDetailsBuy002
				v-if="['RECEIVABLE_STEEL_BUY_002'].includes(detailData.contractTemplate)"
				ref="purchaseDetails"
				:isReceipt="true"
				:steelType="this.$route.query.steelType"
				:selectedData="purchaseDetailsData"
				:editable="editable"
			/>
		</div>

		<!-- 收货附件信息 -->
		<div class="title"><i class="title_icon"></i>收货附件信息</div>
		<div
			class="upload-wrap"
			v-if="!['RECEIVABLE_STEEL_BUY_002'].includes(detailData.contractTemplate)"
		>
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="true"
					@uploadFiles="getUploadFiles"
					:isScrapSteel="$route.query.steelType === 'SCRAP_STEEL'"
					:fileDataSource="receivefileDataSource"
					:type="'receive'"
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
			<a-button @click="$router.push('/center/steels/receive/receipt/list')">返回</a-button>
			<a-button
				type="primary"
				@click="handleSubmit"
				>提交</a-button
			>
		</div>
		<a-modal
			centered
			title="请选择收货方式"
			:visible="visible"
			@ok="save()"
			@cancel="() => (visible = false)"
		>
			<a-form
				:form="receivingModeForm"
				v-bind="formLayout"
			>
				<a-form-item
					label="收货方式"
					:colon="false"
				>
					<a-radio-group
						v-decorator="[
							`receiveStatus`,
							{
								rules: [{ required: true, message: '请选择收货方式', whitespace: true }],
								validateTrigger: 'blur'
							}
						]"
					>
						<a-radio value="PORTION_RECEIVE">部分收货</a-radio>
						<a-radio value="RECEIVED">全部收货</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
			<p class="mb8 r">注释</p>
			<p class="r">部分收货：指选择的发货批次（非合同）只有部分数量进行了收货，该批次并没有进行全部收货。</p>
			<p class="r">部分收货：指选择的发货批次（非合同）只有部分数量进行了收货，该批次并没有进行全部收货。</p>
		</a-modal>
	</div>
</template>

<script>
import { API_SteelsDeliverDetail, API_SteelsReceiveSubmit } from '@/v2/center/steels/api/receive.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import PurchaseDetails from './components/PurchaseDetails.vue';
import PurchaseDetailsBuy002 from './components/PurchaseDetailsBuy002.vue';
import FileTable from '@/v2/center/steels/views/receive/deliver/components/FileTable';

export default {
	name: 'ReleaseApplyList',
	data() {
		return {
			formLayout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
			tableWidth: { x: 0 },
			currentStep: 1,
			obj: {},
			steps: [{ title: '选择待收货的发货申请' }, { title: '填写收货信息' }, { title: '完成' }],
			visible: false,
			steelType: filterSteelsCodeByKey('steelType'),
			form: this.$form.createForm(this),
			receivingModeForm: this.$form.createForm(this),
			receiveForm: this.$form.createForm(this),
			deliveryData: filterSteelsCodeByKey('transportMode'),
			fileDataSource: [],
			attachments: [],
			fileInfos: [],
			detailData: {},
			receiveDate: null,
			receivefileDataSource: [],
			editable: true,
			purchaseDetailsData: [],
			fileType: [
				{
					key: 'DOWNSTREAM_DOCUMENTS',
					label: '下游收货凭证',
					required: true
				}
			]
		};
	},
	components: {
		CustomUpload,
		PurchaseDetails,
		PurchaseDetailsBuy002,
		FileTable
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
							i.receiveQuantity = i.quantity || null;
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
								quantity: that.detailData.quantity || '-'
							});
						});
					});
					// 附件信息修改为通用格式
					this.fileDataSource = res.data.receiptShipmentAttachList;
					if (res.data.receiptShipmentAttachList.length > 0) {
						this.fileDataSource = [];
						res.data.receiptShipmentAttachList.forEach(item => {
							let pro = {};
							(pro.id = item.fileId), (pro.typeName = this.CONSTANTSSTEELS.deliverFileDict[item.attachmentType]);
							(pro.key = item.attachmentType),
								(pro.path = item.attachmentPath),
								(pro.name = item.name),
								(pro.url = item.attachmentPath),
								this.fileDataSource.push(pro);
						});
					}
					// this.fileInfos = this.fileDataSource
				}
			});
		}
	},
	methods: {
		moment,
		disabledDate(value) {
			var start = moment(this.detailData.shipmentDate).add(0, 'd').valueOf() > value;
			return start;
		},
		getReceiveDate(value, dateString) {
			// 收货日期
			this.receiveDate = dateString;
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		save() {
			this.receivingModeForm.validateFields((err, values) => {
				if (!err) {
					API_SteelsReceiveSubmit({ ...this.obj, ...values })
						.then(res => {
							if (res.success) {
								this.$router.push({
									path: '/center/steels/receive/receipt/list'
								});
							}
						})
						.finally(() => {
							this.visible = false;
						});
				}
			});
		},
		handleSubmit() {
			this.obj = {};
			this.receiveForm.validateFieldsAndScroll(err => {
				if (!err) {
					let obj = {};
					// 校验明细表
					if (!this.$refs.purchaseDetails.save()) {
						return;
					}

					// 附件校验
					if (this.fileInfos.length === 0) {
						this.$message.error('请上传收货附件');
						return;
					} else {
						obj.receiptShipmentAttachList = [];
						let type = [];
						this.fileInfos.forEach(item => {
							let pro = {};
							pro.attachmentType = item.key;
							pro.fileId = item.id;
							obj.receiptShipmentAttachList.push(pro);
							type.push(item.key);
						});
						if (this.detailData.contractTemplate !== 'RECEIVABLE_STEEL_BUY_002') {
							if (this.$route.query.steelType !== 'SCRAP_STEEL') {
								if (!type.includes('UPSTREAM_DOCUMENTS')) {
									this.$message.error('请上传上游收货凭证');
									return;
								}
								if (!type.includes('DOWNSTREAM_DOCUMENTS')) {
									this.$message.error('请上传下游收货凭证');
									return;
								}
							}

							if (this.$route.query.steelType === 'SCRAP_STEEL') {
								if (!type.includes('WEIGHING_LIST')) {
									this.$message.error('过磅单');
									return;
								}
							}
						}
					}

					obj.shipmentParticularsList = this.$refs.purchaseDetails.save();

					obj.shipmentNo = this.detailData.shipmentNo;
					obj.receiveParticularsList = this.$refs.purchaseDetails.save();
					if (['RECEIVABLE_STEEL_BUY_002'].includes(this.detailData.contractTemplate)) {
						obj.receiveParticularsList.map(i => {
							i.receivePieceQuantity = i.receivePieceQuantity == '/' ? null : i.receivePieceQuantity;
						});
					}
					obj.receiveDate = this.receiveDate;

					const that = this;
					this.obj = obj;
					if (this.$route.query.steelType === 'SCRAP_STEEL') {
						this.visible = true;
						return;
					}

					that.$confirm({
						centered: true,
						title: `确定提交收货确认?`,
						okText: '确定',
						cancelText: '取消',
						onOk() {
							API_SteelsReceiveSubmit({ ...obj, receiveStatus: 'RECEIVED' }).then(res => {
								if (res.success) {
									that.$router.push({
										path: '/center/steels/receive/receipt/list'
									});
								}
							});
						},
						onCancel() {}
					});
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

.r {
	color: #ff4d4f;
}
</style>
