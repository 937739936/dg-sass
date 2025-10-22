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
						<span v-if="text == 3">全部收货(本次收货数量为0)</span>
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
				:contractVo="contractVo"
				:disabled="true"
				:deliverList="deliverList"
				@selectDeliver="selectDeliver"
				:deliverId="deliverId"
				ref="deliverInfo"
			/>
			<div class="sub-title">收货信息</div>
			<!-- <a-row style="margin-top: 24px;line-height: 18px">
        <div style="min-width: 376px;display: inline-block">
          <span class="icon">批</span>
          <span class="label">勾选发货批次</span>
          <span class="value">{{ selectBatchNo.join(',') }}</span>
        </div>
        <div style="display: inline-block;margin-left: 44px;">
          <span class="icon">数</span>
          <span class="label">累计已收货数量</span>
          <span class="value">{{ receiveTotal }}(吨)</span>
        </div>
      </a-row> -->
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
									{ rules: [{ required: true, message: '请选择收货方式' }], validateTrigger: 'change' }
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
								<a-radio
									value="ALL_RECEIVE_NO_QUANTITY"
									v-if="!$route.query.first"
								>
									<span style="color: rgba(0, 0, 0, 0.8)"> 全部收货(本次收货数量为0) </span>
									<a-tooltip>
										<template slot="title"> 指选择的发货批次（非合同）已经全部收货完成，且本次不新增收货信息 </template>
										<a-icon
											type="question-circle"
											style="font-size: 14px; color: rgba(0, 0, 0, 0.3)"
										/>
									</a-tooltip>
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="36" v-if="form.getFieldValue('receiveType') != 'ALL_RECEIVE_NO_QUANTITY'">
					<a-col :span="8">
							<a-row>
								<a-form-item
									label="收货数量（吨）"
									required
								>
									<a-input-number
										placeholder="请输入收货数量（吨）"
										@blur="blurReceiveQuantity"
										@change="calculateTotalPrice"
										v-decorator="[
											'receiveQuantity',
											{
												rules: [
													{
														required: true,
														message: '收货数量必填'
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
							</a-row>
						</a-col>
				</a-row>
				<!-- 判断是否是仓押 -->
				<!-- v-if="contractVo.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE'" -->
				<a-row v-if="contractVo.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE'">
					<a-col :span="8">
						<a-row>
							<a-form-item
								label="货物是否入库"
								required
							>
								<a-radio-group
									@change="changeInStoraged"
									v-decorator="['inStoraged', { rules: [{ required: true, message: '请选择' }], validateTrigger: 'change' }]"
								>
									<a-radio :value="true"> 是</a-radio>
									<a-radio :value="false"> 否 </a-radio>
								</a-radio-group>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="form.getFieldValue('inStoraged')"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="站台"
								required
							>
								<a-select
									:disabled="isSelectStation"
									@change="getInOutHistoryList"
									v-decorator="[
										'stationId',
										{
											rules: [{ required: true, message: '请选择站台' }]
										}
									]"
									placeholder="请选择站台"
								>
									<a-select-option
										v-for="item in stationList"
										:key="item.id"
										:value="item.id"
									>
										{{ item.name }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							:justify="form.getFieldValue('inStoraged') ? 'end' : 'center'"
						>
							<a-form-item
								label="品名"
								required
							>
								<a-auto-complete
									placeholder="请输入品名"
									:data-source="historyGoodList"
									:maxLength="200"
									:filterOption="filterOption"
									v-decorator="[
										'goodsName',
										{
											rules: [{ required: true, message: '品名必填' }, { validator: checkLength }]
										}
									]"
								>
								</a-auto-complete>
							</a-form-item>
						</a-row>
					</a-col>
					<template v-if="form.getFieldValue('receiveType') == 'ALL_RECEIVE' || form.getFieldValue('receiveType') == 'PART_RECEIVE'">
						<a-col :span="8">
							<a-row >
								<a-form-item :label="`入库单价(元/吨)`">
									<a-input-number
										:placeholder="`请输入煤种单价`"
										:min="0.00"
										:precision="2"
										:max="99999999.99"
										@change="calculateTotalPrice"
										v-decorator="[
											`price`,
											{
												rules: [{ required: true, message: `请填写煤种单价` }]
											}
										]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col :span="8">
							<a-row
							>
								<a-form-item :label="`入库货值`">
									<a-input
										placeholder=""
										:min="0.01"
										:precision="2"
										:disabled="true"
										v-decorator="[`tempTotalPrice`]"
									/>
								</a-form-item>
							</a-row>
						</a-col>
					</template>
				</a-row>
			</a-form>
			<Attachment
				ref="attachment"
				v-if="form.getFieldValue('receiveType') != 'ALL_RECEIVE_NO_QUANTITY'"
				:list="fileTypeList"
			></Attachment>
			<!-- 当前汽运并且是应收业务 -->
			<WeightAttachment
				ref="weightAttachment"
				v-if="isAccountAndCar && form.getFieldValue('receiveType') != 'ALL_RECEIVE_NO_QUANTITY'"
				:list="weightFileType"
			></WeightAttachment>
			<!-- <FileTable
          v-if="form.getFieldValue('receiveType')!='ALL_RECEIVE_NO_QUANTITY'"
          :add-type="fileType"
          ref="fileTable"
          :requireTip="requireTip"
          :fileData="attachments"
          @fileChange="attachmentsChange"
      /> -->
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
		<ConfirmReturn ref="confirmReturn" />
		<ConfirmAccept
			ref="confirmAccept"
			@submit="submit"
		/>
		<FileLook ref="fileLook"></FileLook>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index'; // 面包屑导航
import ContractGl from '@/v2/center/trade/views/receive/components/ContractGl'; //合同信息
import DeliverInfo from '@/v2/center/trade/views/receive/components/DeliverInfo'; //发货信息
import FileTable from '@/v2/center/trade/views/receive/components/FileTable'; // 附件展示
import FileLook from './components/FileLook'; // 附件查看
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn'; //返回确认弹框
import {
	API_getReceiveRecordInfo,
	API_RECEIVESAVE,
	dispatchDriverSaveOrUpdate,
	getStationList,
	getAddStationList
} from '@/v2/center/trade/api/receive';
import { receivedColumns } from './columns/columns.js';
import { mapGetters } from 'vuex';
import ConfirmAccept from '@/v2/center/trade/views/receive/components/ConfirmAccept';
import { getInOutHistoryList } from '@/v2/center/logisticsPlatform/api/inout.js';
import moment from 'moment';
import Attachment from './components/Attachment.vue';
// 磅单明细上传
import WeightAttachment from './components/weightAttachment.vue';

// 不同运输方式对应的收货附件
const fileTypeDict = {
	SHIP: [
		{
			key: 'CZPZ',
			type: 'CZPZ',
			label: '称重凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【化验凭证】【磅单】【其他凭证】：支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M'
		},
		{ key: 'HYPZ', label: '化验凭证', required: true, accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' },
		{ key: 'OTHER', label: '其他凭证', accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' }
	],
	TRAIN: [
		{
			key: 'HYPZ',
			label: '化验凭证',
			required: true,
			accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
			tip: '【化验凭证】【其他凭证】：支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M'
		},
		{ key: 'CZPZ', label: '称重凭证', required: true, accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' }
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
			currentTransType: '',
			deliverId: this.$route.query.deliverId,
			// 站台列表
			stationList: [],
			// 是否已经选择了站台
			isSelectStation: false,
			historyGoodList: [],
			// 选择的站台
			stationInfo: {},
			// 磅单明细上传
			weightFileType: [
				{
					key: 'BDMX',
					label: '磅单明细',
					required: true,
					fileType: 'fileType24',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp,.xlsx，.xls',
					tip: '【磅单明细】支持上传jpg，jpeg，png，bmp，pdf，xlsx，xls的附件，单个附件大小不超过100M '
				}
			]
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		DeliverInfo,
		FileTable,
		ConfirmReturn,
		FileLook,
		ConfirmAccept,
		Attachment,
		WeightAttachment
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
		// 判断是否 选择的发货批次是汽运 并且是 合同业务类型是应收
		isAccountAndCar() {
			const flag = this.selectedRows.some(el => el.transInfo.transType == 2);
			return this.contractVo.businessType == 'ACCOUNT_RECEIVABLE' && flag;
		},
		fileTypeList() {
			if (this.isAccountAndCar) {
				return [
					{
						key: 'HYPZ',
						label: '化验凭证',
						required: true,
						accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
						tip: '【化验凭证】【磅单】【其他凭证】：支持上传jpg，jpeg，png，bmp，pdf的附件，单个附件大小不超过100M '
					},
					{ key: 'BD', label: '磅单', required: true, accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' },

					{ key: 'OTHER', label: '其他凭证', accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp' }
				];
			}
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
		// 获取历史坑/矿口历史记录
		async getInOutHistoryList(stationId) {
			const params = {
				stationId,
				type: ['GOODS']
			};
			const res = await getInOutHistoryList(params);

			this.historyGoodList = res.data.filter(el => el.type == 'GOODS').map(el => el.name);
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		async init() {
			const res = await API_getReceiveRecordInfo({ deliverId: this.$route.query.deliverId });
			this.contractVo = res.result.contractVo;
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
			await this.getStationList();
			this.getAddStationList();
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
				// 汽运和火运要根据他选择的发货信息调整对应的收货附件
				// if(this.contractVo.transType === 'AUTOMOBILE_AND_TRAIN'){
				//   // 1 火运 2 汽运 3 船运
				//   let selectItemTransType = item.transInfo.transType == 1 ? 'TRAIN' : 'AUTOMOBILE'
				//   if(this.currentTransType && this.currentTransType!= selectItemTransType){
				//     this.$refs.fileTable.emptyFileData()
				//   }
				//   this.currentTransType = selectItemTransType

				//   this.fileType = this.fileTypeDict[selectItemTransType]
				// }
				const info = {
					1: 'TRAIN',
					2: 'AUTOMOBILE',
					3: 'SHIP'
				};

				this.$refs.attachment && this.$refs.attachment.clearData();
				// 清空附件
				this.fileType = this.fileTypeDict[info[item.transInfo.transType]];

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
		async submitArriveDate(record) {
			await dispatchDriverSaveOrUpdate({
				orderType: 'ONLINE',
				...record,
				orderSerialNo: this.contractVo.orderSerialNo,
				type: 'HAND'
			});
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
					// 不能是应收 汽运
				} else if (item.transInfo.transType == 2 && this.contractVo.businessType != 'ACCOUNT_RECEIVABLE') {
					item.transInfo?.automobileDetailDtoList?.map(i => {
						if (i.arriveDate) {
							i.arriveDate = moment(i.arriveDate).format('YYYY-MM-DD HH:mm:ss');
						} else {
							error = true;
							this.$message.error('到站时间必填');
						}
					});
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
						// 应收 汽运业务 磅单明细
						if (this.isAccountAndCar) {
							const obj = this.$refs.weightAttachment.save();

							if (!obj) {
								return;
							}
							attachList = [...attachList, ...obj.newAttachList];
							obj.vehicleInfoList.forEach(el => {
								vehicleInfoList.push({
									...el,
									plateNumberList: el.plateNumberList.map(el => el.plateNumber)
								});
							});
						}

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
							orderId: this.contractVo.orderId,
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
					/** 判断汽运 */
					const tplArr = this.selectedRows.filter(el => el.transInfo.transType == 2);

					if (tplArr.length && !this.isAccountAndCar) {
						let promiseAllList = [];
						this.selectedRows.map(item => {
							item.transInfo?.automobileDetailDtoList?.map(i => {
								promiseAllList.push(this.submitArriveDate(i));
							});
						});
						Promise.all(promiseAllList).then(() => {
							this.submitInfo(values, submitObj);
						});
					} else {
						this.submitInfo(values, submitObj);
					}
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
						that.$router.push('/center/receive/accept/list');
					}
				});
			}
		},
		verifyFile() {
			let fileType = '';
			let success = true;
			this.attachments.map(item => {
				fileType += `${item.typeName}${item.type}`;
			});
			this.fileType
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(`${item.label}${item.key}`)) {
						this.$message.error(`请上传${item.label}`);
						success = false;
					}
				});
			return success;
		},
		fileLook(data) {
			this.$refs.fileLook.fileLook(data);
		},
		submit(submitObj) {
			API_RECEIVESAVE(submitObj).then(res => {
				if (res.success) {
					this.$message.success('提交成功');
					this.$router.push('/center/receive/accept/list');
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
			this.$refs.confirmReturn.init('/center/receive/accept/list');
		},
		jumpNewPage(record) {
			let routeUrl = this.$router.resolve({
				path: '/center/receive/accept/detail',
				query: {
					receiveId: record.receiveId
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		// 新增的时候获取站台列表
		async getAddStationList() {
			const res = await getAddStationList();
			const list = res.data || [];
			// 如果当前已经有站台 获取所有的站台列表
			if (this.isSelectStation) {
				this.stationList = list;
				return;
			}
			// 1. 货物是否入库为”是“时，展示“站台”录入项，如运输方式为汽运支持选择该企业已关联的未改造站台，如运输方式为火运/船运支持选择全部企业已关联的站台
			// 判断当前合同运输方式
			if (this.$route.query.transType == 'AUTOMOBILE') {
				this.stationList = list.filter(el => el.stationStatus == 'IN_PROGRESS');
			} else {
				this.stationList = list;
			}
			this.form.setFieldsValue({
				inStoraged: true
			});
		},
		// 更改是否入库
		changeInStoraged(e) {
			// this.getStationList()
			if (e.target.value && this.stationInfo.bid) {
				this.form.setFieldsValue({
					inStoraged: true
				});
				this.$nextTick(() => {
					this.form.setFieldsValue({
						stationId: this.stationInfo.bid
					});
					this.getInOutHistoryList(this.stationInfo.bid);
				});
			}
		},
		// 获取选择的站台信息
		async getStationList() {
			const params = {
				contractNo: this.contractVo.contractNo,
				contractType: 'ONLINE',
				sourceType: 'RECEIVE_GOODS_ADD'
			};
			const res = await getStationList(params);
			this.stationInfo = res.data || {};
			const info = res.data || {};
			this.isSelectStation = !!info.bid;
			if (this.isSelectStation) {
				this.form.setFieldsValue({
					inStoraged: true
				});
				this.$nextTick(() => {
					this.form.setFieldsValue({
						stationId: info.bid
					});
					this.getInOutHistoryList(info.bid);
				});
			}
		},
		// 计算货值
		calculateTotalPrice() {
			this.$nextTick(() => {
				const { receiveQuantity, price } = this.form.getFieldsValue(['receiveQuantity', 'price']);
				const weightNumber = Number(receiveQuantity); 
				const priceNumber = Number(price); 
				if (isNaN(weightNumber) || isNaN(priceNumber)) {
					return;
				}
				if (weightNumber && price) {
					let tempTotalPrice = weightNumber * price;
					// 保留两位小数
					tempTotalPrice = Math.round(tempTotalPrice * 100) / 100;
					this.form.setFieldsValue({ tempTotalPrice });
				}
			});
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
.slFormDetail {
	.ant-row {
		.ant-col-8:nth-child(3n + 1) {
			display: flex;
			justify-content: left;
		}
		.ant-col-8:nth-child(3n + 2) {
			display: flex;
			justify-content: center;
		}
		.ant-col-8:nth-child(3n) {
			display: flex;
			justify-content: right;
		}
	}
	.ant-form-item-with-help {
			margin-bottom: 8px;
	}
}
</style>
