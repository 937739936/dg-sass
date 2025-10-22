<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				填写收货信息
			</span>
			<div
				class="sub-title"
				style="margin-bottom: 20px"
			>
				合同信息
			</div>
			<ContractGl
				:contractVo="contractVo"
				:disabled="true"
			/>

			<div
				v-if="receiveList.length && !this.$route.query.first"
				style="margin-bottom: 30px"
			>
				<div class="sub-title">已收货信息</div>
				<a-table
					style="margin-top: 20px"
					:columns="receivedColumns"
					class="new-table ready-sh"
					:bordered="false"
					:scroll="{ x: true }"
					:dataSource="receiveList"
					:pagination="false"
				>
					<div
						slot="receiveNo"
						slot-scope="text, record"
					>
						<a
							@click="jumpNewPage(record)"
							style="color: #333"
						>
							{{ text }}
						</a>
					</div>
					<div
						slot="receiveType"
						slot-scope="text"
					>
						<span v-if="text == 1">部分收货</span>
						<span v-if="text == 2">全部收货</span>
					</div>
					<div
						slot="fileInfoList"
						slot-scope="text"
					>
						<span
							v-for="(item, index) in text"
							@click="fileLook(item)"
							:key="index"
							class="fileName"
						>
							<a-tooltip :title="item.typeName">
								<a>
									{{ item.name }}
								</a>
							</a-tooltip>
						</span>
					</div>
				</a-table>
			</div>
			<div
				class="sub-title"
				style="margin-top: 20px"
			>
				发货信息
			</div>
			<DeliverInfo
				:deliverList="deliverList"
				:contractVo="contractVo"
				:deliverId="deliverId"
				disabled
				@selectDeliver="selectDeliver"
				ref="deliverInfo"
			/>
			<div class="sub-title">收货信息</div>
			<a-form
				:form="form"
				:colon="false"
				class="slFormDetail"
			>
				<a-row :gutter="36">
					<a-col :span="24">
						<a-form-item
							label="收货方式"
							:colon="false"
							style="width: 100%"
						>
							<a-radio-group
								v-decorator="[
									'receiveType',
									{ 
										initialValue: $route.query.first === 'true' ? 'ALL_RECEIVE' : null,
										rules: [{ required: true, message: '请选择收货方式' }], validateTrigger: 'change' }
								]"
							>
								<a-radio value="PART_RECEIVE">
									<span style="color: rgba(0, 0, 0, 0.8)"> 部分收货 </span>
									<a-tooltip>
										<template slot="title"> 指选择的发货批次（非合同）只有部分数量进行了收货，该批次并没有进行全部收货 </template>
										<a-icon
											type="question-circle"
											style="font-size: 14px; color: rgba(0, 0, 0, 0.3)"
										/>
									</a-tooltip>
								</a-radio>
								<a-radio
									value="ALL_RECEIVE"
									style="margin: 0 36px"
								>
									<span style="color: rgba(0, 0, 0, 0.8)"> 全部收货 </span>
									<a-tooltip>
										<template slot="title"> 指选择的发货批次（非合同）已经全部收货完成 </template>
										<a-icon
											type="question-circle"
											style="font-size: 14px; color: rgba(0, 0, 0, 0.3)"
										/>
									</a-tooltip>
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<template v-if="form.getFieldValue('receiveType') != 'ALL_RECEIVE_NO_QUANTITY'">
						<a-col :span="8">
							<a-form-item
								label="收货数量（吨）"
								required
							>
								<a-input
									placeholder="请输入收货数量（吨）"
									@blur="blurReceiveQuantity"
									v-decorator="[
										'receiveQuantity',
										{
											rules: [
												{
													required: true,
													message: '收货数量必填'
												},
												{
													validator: validNumber({ float: 4, min: 0, max: 99999999.9999 })
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item
								label="收货日期"
								required
							>
								<a-date-picker
									placeholder="请选择收货日期"
									:disabled-date="disabledDate"
									value-format="YYYY-MM-DD"
									v-decorator="[
										'receiveDate',
										{
											rules: [
												{
													required: true,
													message: '收货日期必填'
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收货化验热值(kcal/kg)">
								<a-input-number
									placeholder="请输入1000-7500之间整数"
									autocomplete="off"
									v-decorator="[
										'receiveDynamicsFields.receiveCheckCalorificValue',
										{
											rules: [
												{
													required: false,
													message: '请输入1000-7500之间整数',
													validator: validNumber({ float: 0, min: 1000, max: 7500, containMin: true })
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</template>
				</a-row>
			</a-form>
			<Attachment
				ref="attachment"
				v-if="form.getFieldValue('receiveType') != 'ALL_RECEIVE_NO_QUANTITY'"
				:list="fileTypeList"
			></Attachment>
			<div class="submit-btn">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="handleSubmit"
					>提交</a-button
				>
			</div>
		</a-card>
		<ConfirmAccept
			ref="confirmAccept"
			@submit="submit"
		/>
		<FileLook ref="fileLook"></FileLook>
	</div>
</template>
<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { validNumber } from '@/v2/utils/validForm';
import breadcrumb from '@/v2/components/breadcrumb/index'; // 面包屑导航
import ContractGl from '@/v2/center/logisticSupervise/views/receive/components/ContractGl'; //合同信息
import DeliverInfo from '@/v2/center/logisticSupervise/views/receive/components/DeliverInfo'; //发货信息
import ConfirmAccept from '@/v2/center/logisticSupervise/views/receive/components/ConfirmAccept';
import Attachment from '@/v2/center/logisticSupervise/views/receive/components/Attachment.vue';
import FileTable from '@/v2/center/logisticSupervise/views/receive/components/FileTable'; // 附件展示
import FileLook from '@/v2/center/logisticSupervise/views/receive/components/FileLook'; // 附件查看
import { API_getReceiveRecordInfo, API_RECEIVESAVE } from '@/v2/center/trade/api/receive';
import { receivedColumns } from './columns/columns.js';

// 不同运输方式对应的收货附件
const fileTypeDict = {
	SHIP: [
		{
			key: 'HYPZ',
			label: '化验凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【化验凭证】【称重凭证】【其他凭证】：支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M'
		},
		{
			key: 'CZPZ',
			type: 'CZPZ',
			label: '称重凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
		},
		{ key: 'OTHER', label: '其他凭证', accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' }
	],
	TRAIN: [
		{
			key: 'HYPZ',
			label: '化验凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【化验凭证】【称重凭证】【其他凭证】：支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M'
		},
		{ key: 'CZPZ', label: '称重凭证', required: true, accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' },
		{ key: 'OTHER', label: '其他凭证', accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' }
	],
	AUTOMOBILE: [
		{
			key: 'HYPZ',
			label: '化验凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【化验凭证】支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M '
		},
		{
			key: 'BD',
			label: '磅单',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【磅单】支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M '
		},
		{
			key: 'BDMX',
			label: '磅单明细',
			required: true,
			fileType: 'fileType24',
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.xlsx,.xls,.bmp',
			tip: '【磅单明细】支持上传jpg，jpeg，png，bmp，pdf，xlsx，xls的附件，单个附件大小不超过100M '
		},
		{
			key: 'OTHER',
			label: '其他凭证',
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【其他凭证】支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M '
		}
	]
};
export default {
	data() {
		return {
			fileTypeDict,
			receivedColumns,
			form: this.$form.createForm(this),
			attachments: [],
			contractVo: {},
			deliverList: [],
			selectedRows: [],
			selectBatchNo: [],
			receiveTotal: 0, //勾选的发货批次累计已收货数量
			receiveTotalReamin: 0, //勾选的发货批次剩余的可发货量
			fileType: [],
			deliverBatchIdList: [],
			shipListMap: {}, //船运收货特有
			receiveList: [],
			deliverId: this.$route.query.deliverId,
			validNumber
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		DeliverInfo,
		FileTable,
		FileLook,
		ConfirmAccept,
		Attachment
	},
	computed: {
		requireTip() {
			//当附件类型有磅单时给对应提示
			if (
				this.fileType &&
				this.fileType.find(item => {
					return item.key == 24;
				})
			) {
				return '其中“磅单明细”同时支持xlsx，xls格式';
			} else {
				return '';
			}
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		fileTypeList() {
			return this.fileType;
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		async checkLength(rule, value, callback) {
			if (value && value.length > 200) {
				callback('长度需在 1-200 字之间');
			} else {
				callback();
			}
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		async init() {
			const res = await API_getReceiveRecordInfo({ deliverId: this.$route.query.deliverId });
			this.contractVo = res.result.offlineContractDetailVO;
			this.receiveList = res.result.receiveList;
			// 继续收货时，接口返回的船运信息 "到港时间"会带出上次填写的日期，如果到岗日期有值，是否到岗显示true
			res.result.deliverList.map(i => {
				i.transInfo.shipDetailDtoList = i.transInfo.shipDetailDtoList || [];
				i.transInfo.shipDetailDtoList.map(item => {
					if (item.destinationPortInTime) {
						item.arrived = true;
					}
				});
			});
			this.deliverList = res.result.deliverList;
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		},
		selectDeliver(selectedRows) {
			this.selectedRows = selectedRows;
			this.form.setFieldsValue({
				receiveDate: undefined
			});
			this.selectBatchNo = [];
			this.deliverBatchIdList = [];
			this.receiveTotal = 0;
			this.receiveTotalReamin = 0;
			this.selectedRows.map(item => {
				const info = {
					1: 'TRAIN',
					2: 'AUTOMOBILE',
					3: 'SHIP'
				};
				this.$refs.attachment && this.$refs.attachment.clearData();
				// 清空附件
				this.fileType = this.fileTypeDict[info[item.transInfo.transType]];
				// 终端发运时附件非必填
				this.fileType.forEach(pro=> {
					if(pro.key !== 'OTHER') {
						pro.required = item?.transInfo?.deliverDynamicsFields?.deliveryDespatchType !== "TERMINAL_DELIVERY"
					}
				})
				// 确认收货时，默认全部收货。取全部发货数量
				if (this.$route.query.first === 'true' && item?.transInfo?.deliverQuantity) {
					this.form.setFieldsValue({
						receiveQuantity: item?.transInfo?.deliverQuantity
					})
				}
				this.selectBatchNo.push(item.deliverNo);
				this.deliverBatchIdList.push(item.deliverId);
				this.receiveTotal += item.receiveQuantity;
				this.receiveTotalReamin += item.transInfo.deliverQuantity - item.receiveQuantity;
			});
			this.autoSelectReceiveType();
		},
		autoSelectReceiveType() {
			if (!this.form.getFieldValue('receiveType') && this.form.getFieldValue('receiveQuantity')) {
				if (this.receiveTotalReamin > this.form.getFieldValue('receiveQuantity')) {
					this.form.setFieldsValue({
						receiveType: 'PART_RECEIVE'
					});
				} else {
					this.form.setFieldsValue({
						receiveType: 'ALL_RECEIVE'
					});
				}
			}
		},
		blurReceiveQuantity() {
			this.autoSelectReceiveType();
		},
		async handleSubmit() {
			let error = false;
			if (!this.deliverBatchIdList.length) {
				this.$message.error('请勾选至少一条发货数据');
				return;
			}

			this.shipListMap = {};
			this.selectedRows.map(item => {
				item.transInfo.shipDetailDtoList = item.transInfo.shipDetailDtoList || [];
				// 船运
				if (item.transInfo.transType == 3) {
					item.transInfo.shipDetailDtoList.map(i => {
						i.destinationPortInTime = i.destinationPortInTime
							? moment(i.destinationPortInTime).format('YYYY-MM-DD HH:mm:ss')
							: undefined;
						if (!i.hasOwnProperty('arrived')) {
							error = true;
							this.$message.error('是否到达目的港必填');
						} else {
							if (i.arrived && !i.destinationPortInTime) {
								error = true;
								this.$message.error('到达目的港时间必填');
							}
						}
					});
					let obj = {};
					obj[item.deliverId] = item.transInfo.shipDetailDtoList;
					Object.assign(this.shipListMap, obj);
				}
			});
			if (error) {
				return;
			}

			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let submitObj = {};
					if (values.receiveType != 'ALL_RECEIVE_NO_QUANTITY') {
						let attachList = this.$refs.attachment.save();

						let vehicleInfoList = [];

						if (!attachList) {
							return;
						}
						this.attachments = attachList.map(el => {
							return {
								...el,
								key: el.type
							};
						});
						submitObj = {
							orderId: this.contractVo.id,
							deliverBatchIdList: this.deliverBatchIdList,
							receiveDate: moment(values.receiveDate).format('YYYY-MM-DD'),
							receiveQuantity: values.receiveQuantity,
							receiveType: values.receiveType,
							fileInfoList: this.attachments,
							shipListMap: this.shipListMap,
							...values,
							vehicleInfoList
						};
					} else {
						submitObj = {
							orderId: this.contractVo.orderId,
							deliverBatchIdList: this.deliverBatchIdList,
							receiveType: values.receiveType,
							shipListMap: this.shipListMap,
							...values
						};
					}
					this.submitInfo(values, submitObj);
				}
			});
		},
		submitInfo(values, submitObj) {
			let that = this;
			if (values.receiveQuantity >= this.receiveTotalReamin && values.receiveType == 'PART_RECEIVE') {
				let content =
					'<div>确认本次收货方式为"部分收货" <br>本次收货数量大于等于已勾选发货批次发货数量，收货方式建议为"全部收货"</div>';
				this.$refs.confirmAccept.init(submitObj, content);
			} else if (
				(values.receiveQuantity || 0) < this.receiveTotalReamin &&
				(values.receiveType == 'ALL_RECEIVE' || values.receiveType == 'ALL_RECEIVE_NO_QUANTITY')
			) {
				let content =
					'<div>确认本次收货方式为"全部收货" <br>本次收货数量小于已勾选发货批次发货数量，收货方式建议"部分收货"</div>';
				this.$refs.confirmAccept.init(submitObj, content);
			} else {
				API_RECEIVESAVE(submitObj).then(res => {
					if (res.success) {
						that.$message.success('提交成功');
						that.$router.push('/center/logisticSupervise/receive/send/list');
					}
				});
			}
		},
		fileLook(data) {
			this.$refs.fileLook.fileLook(data);
		},
		submit(submitObj) {
			API_RECEIVESAVE(submitObj).then(res => {
				if (res.success) {
					this.$message.success('提交成功');
					this.$router.push('/center/logisticSupervise/receive/send/list');
				}
			});
		},
		// 收货日期需要大于最近的发货日期，发货信息排序按照日期由近到远直接取[0]
		disabledDate(endValue) {
			const startValue = this.selectedRows.length ? this.selectedRows[this.selectedRows.length - 1].transInfo.deliverDate : null;
			if (!startValue) {
				return false;
			}
			return (
				(endValue && moment(endValue).format('YYYY-MM-DD') < moment(startValue).format('YYYY-MM-DD')) ||
				moment(endValue).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD')
			);
		},
		goBack() {
			this.$router.back();
		},
		jumpNewPage(record) {
			let routeUrl = this.$router.resolve({
				path: '/center/logisticSupervise/receive/send/detail',
				query: {
					receiveId: record.receiveId
				}
			});
			window.open(routeUrl.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.submit-btn {
	text-align: center;
	margin-top: 52px;
	margin-bottom: 36px;

	.ant-btn {
		margin: 0 10px;
		width: 114px;
		height: 38px;
		line-height: 38px;
	}
}

.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}

.icon {
	width: 18px;
	height: 18px;
	display: inline-block;
	background: rgb(238, 243, 253);
	border-radius: 4px;
	line-height: 18px;
	text-align: center;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 12px;
	color: @primary-color;
	margin-right: 4px;
	vertical-align: top;
}

.label {
	font-weight: 400;
	font-size: 14px;
	line-height: 18px;
	margin-right: 4px;
	color: rgba(0, 0, 0, 0.8);
}

.value {
	color: #77889d;
}
.ant-form-item {
	width: 364px;
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
.fileName {
	border-right: 1px solid #e9effc;
	display: inline-block;
	height: 20px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 48%;
	&:nth-child(2n + 2) {
		border-right: 0;
		padding-left: 10%;
	}
	&:last-child {
		border-right: 0;
	}
}
/deep/ .ready-sh .ant-table {
	td, 
	th {
		white-space: nowrap;
	}
}
/deep/ .ready-sh .ant-table td {
	&:last-child {
		white-space: break-spaces;
	}
}
</style>
