<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>发货详情</span>
			<a-button
				type="primary"
				@click="$router.push('/center/steels/receive/deliver/list')"
				><div>返回</div></a-button
			>
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
								{{ items.label }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="发货日期">
						<a-date-picker
							disabled
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
						<a-input
							disabled
							v-decorator="[`steelTypeDesc`]"
						></a-input>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>

		<!-- 发货明细 -->
		<div class="title"><i class="title_icon"></i>发货明细</div>
		<a-table
			:pagination="false"
			:columns="buyDetailsColumns"
			:data-source="detailData && detailData.shipmentParticularsList"
			:scroll="{ x: true }"
			:rowKey="
				(record, index) => {
					return record.id;
				}
			"
		>
		</a-table>

		<!-- 发货附件信息 -->
		<div class="title"><i class="title_icon"></i>发货附件信息</div>
		<div class="upload-wrap">
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="false"
					@uploadFiles="getUploadFiles"
					:fileDataSource="fileDataSource"
					:type="'deliver'"
				></CustomUpload>
			</div>
		</div>

		<div class="btn-wrap">
			<a-button @click="$router.push('/center/steels/receive/deliver/list')">返回</a-button>
			<a-button
				type="primary"
				@click="handleSubmit"
				v-if="$route.query.flag === 'submit'"
				>提交</a-button
			>
		</div>
	</div>
</template>

<script>
import { API_SteelsDeliverSubmit, API_SteelsDeliverDetail } from '@/v2/center/steels/api/receive.js';

import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

export default {
	name: 'ReleaseApplyList',
	data() {
		return {
			tableWidth: { x: 0 },
			currentStep: 1,
			steps: [{ title: '选择销售合同' }, { title: '填写发货信息' }, { title: '完成' }],
			form: this.$form.createForm(this),
			deliveryData: filterSteelsCodeByKey('transportMode'),
			fileDataSource: [],
			fileInfos: [],
			detailData: {},
			shipmentDate: null
		};
	},
	components: {
		CustomUpload
	},
	computed: {
		buyDetailsColumns() {
			if (this.detailData.contractTemplate === 'RECEIVABLE_STEEL_BUY_002') {
				return [
					{
						title: '序号',
						customRender: (text, record, index) => `${index + 1}`
					},
					{
						title: '物资名称',
						dataIndex: 'materialName',
						key: 'materialName'
					},
					{
						title: '规格',
						dataIndex: 'specs',
						key: 'specs'
					},
					{
						title: '材质',
						dataIndex: 'materialTexture',
						key: 'materialTexture'
					},
					{
						title: '件数',
						dataIndex: 'pieceQuantity',
						key: 'pieceQuantity'
					},
					{
						title: '数量(吨)',
						dataIndex: 'quantity',
						key: 'quantity'
					},
					{
						title: '收货地址',
						dataIndex: 'deliveryAddress',
						key: 'deliveryAddress'
					}
				];
			}
			if (this.$route.query.steelType === 'SCRAP_STEEL' || this.detailData.steelType == 'SCRAP_STEEL') {
				return [
					{ title: '序号', customRender: (text, record, index) => `${index + 1}` },
					{ title: '品种', dataIndex: 'materialName' },
					{ title: '数量', dataIndex: 'quantity', customRender: text => text || '-' },
					{ title: '收货地址', dataIndex: 'deliveryAddress' }
				];
			}
			return [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '物资名称',
					dataIndex: 'materialName',
					key: 'materialName'
				},
				{
					title: '规格',
					dataIndex: 'specs',
					key: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture',
					key: 'materialTexture'
				},
				{
					title: '数量(吨)',
					dataIndex: 'quantity',
					key: 'quantity'
				},
				{
					title: '收货地址',
					dataIndex: 'deliveryAddress',
					key: 'deliveryAddress'
				}
			];
		}
	},
	mounted() {
		API_SteelsDeliverDetail(this.$route.query.deliverId).then(res => {
			if (res.success) {
				this.detailData = res.data;
				if (['RECEIVABLE_STEEL_BUY_002'].includes(this.detailData.contractTemplate)) {
					this.detailData.shipmentParticularsList.map(i => {
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
						that.form.setFieldsValue(that.detailData);
					});
				});
				// 附件信息修改为通用格式
				this.fileDataSource = res.data.receiptShipmentAttachList;
				if (res.data.receiptShipmentAttachList.length > 0) {
					this.fileDataSource = [];
					res.data.receiptShipmentAttachList.forEach(item => {
						let pro = {};
						pro.id = item.fileId;
						pro.typeName = this.CONSTANTSSTEELS.deliverFileDict[item.attachmentType];
						pro.key = item.attachmentType;
						pro.path = item.attachmentPath;
						pro.name = item.name;
						pro.url = item.attachmentPath;
						this.fileDataSource.push(pro);
					});
				}
			}
		});
	},
	methods: {
		getShipmentDate(value, dateString) {
			// 双签日期
			this.shipmentDate = dateString;
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		handleSubmit() {
			this.form.validateFields(err => {
				if (!err) {
					let obj = {};
					if (this.fileInfos.length === 0) {
						this.$message.error('请上传上游钢材买卖合同');
						return;
					} else {
						obj.receiptShipmentAttachList = [];
						this.fileInfos.forEach(item => {
							let pro = {};
							pro.attachmentType = 'REINFORCEMENT_PLAN';
							pro.fileId = item.id;
							obj.receiptShipmentAttachList.push(pro);
						});
					}
					obj.shipmentParticularsList = this.detailData.shipmentParticularsList;
					if (['RECEIVABLE_STEEL_BUY_002'].includes(this.detailData.contractTemplate)) {
						obj.shipmentParticularsList.map(i => {
							i.pieceQuantity = i.pieceQuantity == '/' ? null : i.pieceQuantity;
						});
					}
					obj.contractNo = this.detailData.contractNo;

					obj.shipmentDate = this.detailData.shipmentDate;
					obj.id = this.$route.query.deliverId;
					const that = this;
					that.$confirm({
						centered: true,
						title: `确定提交发货申请?`,
						okText: '确定',
						cancelText: '取消',
						onOk() {
							API_SteelsDeliverSubmit(obj).then(res => {
								if (res.success) {
									that.$router.push({
										path: '/center/steels/receive/deliver/list'
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
</style>
