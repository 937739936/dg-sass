<template>
	<div class="release-applylist">
		<div class="s-title">
			<span>收货详情</span>
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
							v-decorator="[`contractQuantity`]"
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
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="resultList"
			:scroll="{ x: true }"
			:rowKey="record => record.id"
		>
			<div
				slot="expandedRowRender"
				slot-scope="record"
				style="margin: 0"
			>
				<a-table
					:pagination="false"
					:columns="detailsColumns"
					:data-source="record.shipmentParticularsList"
					:scroll="{ x: true }"
					:rowKey="record => record.id"
				>
				</a-table>
			</div>
		</a-table>

		<!-- 收货附件信息 -->
		<div class="title"><i class="title_icon"></i>收货附件信息</div>
		<div class="upload-wrap">
			<div class="upload-block">
				<CustomUpload
					:isNeedRotate="true"
					:ifEditable="false"
					:fileDataSource="receiveFileDataSource"
					:type="'receive'"
				></CustomUpload>
			</div>
		</div>

		<div class="btn-wrap">
			<a-button @click="$router.push('/center/steels/receive/receipt/list')">返回</a-button>
		</div>
	</div>
</template>

<script>
import { API_SteelsReceiveDetail } from '@/v2/center/steels/api/receive.js';

import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
export default {
	name: 'ReleaseApplyList',
	data() {
		return {
			tableWidth: { x: 0 },
			form: this.$form.createForm(this),
			receiveForm: this.$form.createForm(this),
			fileDataSource: [],
			fileInfos: [],
			detailData: null,
			receiveDate: null,
			resultList: [],
			columns: [
				{ title: '收货编号', dataIndex: 'receiptNo', key: 'receiptNo' },
				{ title: '收货重量（吨）', dataIndex: 'receiptQuantity', key: 'receiptQuantity' },
				{ title: '收货日期', dataIndex: 'receiptDate', key: 'receiptDate' }
			],
			deliveryData: filterSteelsCodeByKey('transportMode'),
			receiveFileDataSource: [],
			detailsData: [],
			detailsColumns: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{ title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
				{ title: '规格', dataIndex: 'specs', key: 'specs' },
				{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
				{ title: '发货数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '收货地址', dataIndex: 'deliveryAddress', key: 'deliveryAddress' },
				{ title: '收货数量（吨）', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
				{ title: '结算单价（元/吨）', dataIndex: 'settlementAmount', key: 'settlementAmount' }
			]
		};
	},
	components: {
		CustomUpload
	},
	computed: {},
	mounted() {
		if (this.$route.query.steelType === 'SCRAP_STEEL') {
			this.detailsColumns = [
				{ title: '序号', customRender: (text, record, index) => `${index + 1}` },
				{ title: '品种', dataIndex: 'materialName' },
				{ title: '发货数量（吨）', dataIndex: 'quantity' },
				{ title: '收货地址', dataIndex: 'deliveryAddress' },
				{ title: '收货数量（吨）', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
				{ title: '结算单价（元/吨）', dataIndex: 'settlementAmount', key: 'settlementAmount' }
			];
		}

		if (this.$route.query.deliverId) {
			API_SteelsReceiveDetail(this.$route.query.deliverId).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.detailData.date = [
						moment(this.detailData.effectiveStartDate, 'YYYY-MM-DD'),
						moment(this.detailData.effectiveEndDate, 'YYYY-MM-DD')
					];
					this.$nextTick(function () {
						let that = this;
						setTimeout(function () {
							that.form.setFieldsValue({ ...that.detailData, contractQuantity: that.detailData.contractQuantity || '-' });
						});
					});
					// 发货附件信息修改为通用格式
					this.fileDataSource = res.data.shipmentAttachList;
					if (res.data.shipmentAttachList.length > 0) {
						this.fileDataSource = [];
						res.data.shipmentAttachList.forEach(item => {
							let pro = {};
							(pro.id = item.fileId), (pro.typeName = this.CONSTANTSSTEELS.deliverFileDict[item.attachmentType]);
							(pro.key = item.attachmentType),
								(pro.path = item.attachmentPath),
								(pro.name = item.name),
								(pro.url = item.attachmentPath),
								this.fileDataSource.push(pro);
						});
					}
					// 收货信息
					this.resultList = res.data.receiptResp;
					this.detailsData = res.data.receiptResp[0].shipmentParticularsList;
					// 收货附件信息修改为通用格式
					this.receiveFileDataSource = res.data.receiptShipmentAttachList;
					if (res.data.receiptShipmentAttachList.length > 0) {
						this.receiveFileDataSource = [];
						res.data.receiptShipmentAttachList.forEach(item => {
							let pro = {};
							(pro.id = item.fileId), (pro.typeName = this.CONSTANTSSTEELS.deliverFileDict[item.attachmentType]);
							(pro.key = item.attachmentType),
								(pro.path = item.attachmentPath),
								(pro.name = item.name),
								(pro.url = item.attachmentPath),
								this.receiveFileDataSource.push(pro);
						});
					}
					if (this.detailData.contractTemplate === 'RECEIVABLE_STEEL_BUY_002') {
						this.detailsColumns = [
							{
								title: '序号',
								dataIndex: '',
								key: 'rowIndex',
								customRender: function (t, r, index) {
									return parseInt(index) + 1;
								}
							},
							{ title: '物资名称', dataIndex: 'materialName', key: 'materialName' },
							{ title: '规格', dataIndex: 'specs', key: 'specs' },
							{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
							{
								title: '发货件数',
								dataIndex: 'pieceQuantity',
								customRender: function (t, r, index) {
									return t || '/';
								}
							},
							{ title: '发货数量（吨）', dataIndex: 'quantity', key: 'quantity' },
							{ title: '收货地址', dataIndex: 'deliveryAddress', key: 'deliveryAddress' },
							{
								title: '收货件数',
								dataIndex: 'receivePieceQuantity',
								customRender: function (t, r, index) {
									return t || '/';
								}
							},
							{ title: '收货数量（吨）', dataIndex: 'receiveQuantity', key: 'receiveQuantity' }
						];
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
