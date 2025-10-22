<template>
	<div>
		<a-form-model
			ref="releaseForm"
			:rules="isLYGJ ? rulesLYGJ : rules"
			:model="params"
			class="slFormDetail"
		>
			<a-row>
				<a-col
					:span="8"
					class="flexDivShipperName"
				>
					<a-row>
						<a-form-model-item
							prop="shipperName"
							label="托运人"
							:colon="false"
						>
							<a-select
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								placeholder="托运人"
								v-model="params.shipperName"
								show-search
								:default-active-first-option="false"
								:show-arrow="false"
								:filter-option="false"
								@select="handleShipperNameSelect"
								@search="handleShipperNameSearch"
								@focus="handleShipperNameSearch"
							>
								<a-spin
									v-if="fetching"
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
						</a-form-model-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-model-item
							prop="serialNo"
							label="运单号"
							:colon="false"
						>
							<a-input
								placeholder="运单号"
								autocomplete="off"
								v-model="params.serialNo"
								@blur="serialNoChange"
							/>
						</a-form-model-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					class="row flexDiv"
				>
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-model-item
							prop="deliverQuantity"
							label="发货数量(吨)"
							:colon="false"
						>
							<a-input
								:disabled="inputDisabled"
								placeholder="发货数量(吨)"
								autocomplete="off"
								v-model="params.deliverQuantity"
								@focus="quantityFocus"
							/>
						</a-form-model-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row>
						<a-form-model-item
							prop="trainNum"
							label="车数"
							:colon="false"
						>
							<a-input
								:disabled="inputDisabled"
								placeholder="车数"
								autocomplete="off"
								v-model="params.trainNum"
								@focus="trainNumFocus"
							/>
						</a-form-model-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-model-item
							label="发货日期"
							:colon="false"
							prop="deliverDate"
						>
							<a-date-picker
								:disabled-date="disabledDate"
								:disabled="inputDisabled"
								v-model="params.deliverDate"
								@change="getTime"
							/>
						</a-form-model-item>
					</a-row>
				</a-col>
				<template v-if="!isLYGJ">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-model-item
								label="发站"
								prop="deliveryStation"
								:colon="false"
							>
								<a-select
									mode="tags"
									v-model="params.deliveryStation"
									:getPopupContainer="getPopupContainer"
								>
									<template v-for="(item, index) in params.deliveryStationList">
										<a-select-option
											:value="item"
											:key="index"
											>{{ item }}</a-select-option
										>
									</template>
								</a-select>
							</a-form-model-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-model-item
								prop="arriveStation"
								label="到站"
								:colon="false"
							>
								<a-select
									mode="tags"
									v-model="params.arriveStation"
									:getPopupContainer="getPopupContainer"
								>
									<template v-for="(item, index) in params.arriveStationList">
										<a-select-option
											:value="item"
											:key="index"
											>{{ item }}</a-select-option
										>
									</template>
								</a-select>
							</a-form-model-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-model-item
								label="铁路计划号"
								:colon="false"
								prop="railwayPlanNo"
							>
								<a-input
									autocomplete="off"
									:maxLength="32"
									v-model="params.railwayPlanNo"
								/>
							</a-form-model-item>
						</a-row>
					</a-col>
				</template>
				<!-- 联运管家，发站、到站、铁路计划号不可填写，数据从运单信息里取-->
				<template v-if="isLYGJ">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-model-item
								label="发站"
								prop="departureStation"
								:colon="false"
							>
								<a-input
									disabled
									autocomplete="
                  off"
									v-model="trainInfoData.departureStation"
								/>
							</a-form-model-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row>
							<a-form-model-item
								label="到站"
								:colon="false"
								prop="arriveStation"
							>
								<a-input
									disabled
									autocomplete="off"
									v-model="trainInfoData.arriveStation"
								/>
							</a-form-model-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-model-item
								label="铁路计划号"
								:colon="false"
								prop="demandNo"
							>
								<a-input
									disabled
									autocomplete="off"
									v-model="trainInfoData.demandNo"
								/>
							</a-form-model-item>
						</a-row>
					</a-col>
				</template>
			</a-row>
		</a-form-model>
		<TrainInfo
			:data-source="fireDetailDtoList"
			ref="trainInfo"
			v-if="!isLYGJ"
		/>
		<TrainInfoLYGJ
			:datas="trainInfoData"
			:params="params"
			v-if="isLYGJ"
		/>
		<Attachment
			:list="fileType"
			ref="attachment"
		></Attachment>
		<!-- <FileTable
        :add-type="fileType"
        :fileData="attachments"
        @fileChange="attachmentsChange"
        :requireTip="requireTip"
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
				@click="submitReleaseForm"
				>提交</a-button
			>
		</div>
		<ConfirmReturn ref="confirmReturn" />
	</div>
</template>

<script>
const serialNoRegExp = /^[0-9A-Z]{12,13}$/;

import { filterCodeByValueName } from '@sub/utils/globalCode.js';

import {
	API_DELIVERYSAVE,
	API_getApiTrainDeliverShipper,
	API_saveTrainDeliverShipper,
	API_getDeliverInfoTrains
} from '@/v2/center/trade/api/receive';

import moment from 'moment';
import { mapGetters } from 'vuex';
import { directGoodsTransferTypes } from '@/v2/utils/goodsTransfer/basicInfo.js';
import FileTable from '@/v2/center/trade/views/receive/components/FileTable';
import TrainInfo from '@/v2/center/trade/views/receive/components/TrainInfo';
import TrainInfoLYGJ from '@/v2/center/trade/views/receive/components/TrainInfoLYGJ';
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn';
import { getPopupContainer } from '@/v2/utils/factory.js';
import Attachment from './Attachment.vue';
import reg from '@sub/utils/reg.js';

export default {
	name: 'ReleaseTrain',
	components: {
		TrainInfo,
		FileTable,
		ConfirmReturn,
		TrainInfoLYGJ,
		Attachment
	},
	props: {
		selectContractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		fireDetailDtoList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		let validatePass = (rule, value, callback) => {
			if (value.includes(' ')) {
				return callback(new Error('输入数字/大写字母/数字大写字母组合'));
			}
			// 校验运单号
			if (value.length != 12 && value.length != 13) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		let validateQuantity = (rule, value, callback) => {
			// 校验发货数量
			let regs2 = /^\d+(\.\d{0,3})?$/;
			if (!regs2.test(value) || Number(value) >= rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			getPopupContainer,
			directGoodsTransferTypes,
			steps: [{ title: '选择销售订单' }, { title: '填写发货信息' }, { title: '完成' }],
			params: {
				receiverName: [],
				arriveStation: '',
				arriveStationList: [],
				deliveryStation: '',
				deliveryStationList: []
			},
			query: {}, // url参数
			rulesLYGJ: {
				// 联运管家
				shipperName: [{ required: true, message: '请输入托运人', trigger: 'change' }],
				deliverName: [{ required: true, message: '请输入发货人', trigger: 'change' }],
				deliverQuantity: [
					{ required: true, message: '请输入发货数量', trigger: 'change' },
					{ validator: validateQuantity, max: 100000000, message: '发货数量不大于10000000吨，最多三位小数', trigger: 'change' }
				],
				trainNum: [
					{ required: true, message: '请输入车数', trigger: 'change' },
					{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '车数为正整数', trigger: 'change' }
				],
				serialNo: [
					{ required: true, message: '请输入运单号', trigger: 'change' },
					{ validator: validatePass, trigger: 'blur', msg: '运单号为12位或者13位' },
					{ pattern: serialNoRegExp, message: '输入数字/大写字母/数字大写字母组合', trigger: 'change' }
				],
				deliverDate: [{ required: true, message: '请输入发货日期', trigger: 'change' }],
				receiverName: [{ required: false, message: '请输入收货人', trigger: 'change' }]
			},
			rules: {
				serialNo: [
					{ required: true, message: '请输入运单号', trigger: 'change' },
					{ validator: validatePass, trigger: 'blur', max: 99999, msg: '运单号为12位或者13位' }
				],
				shipperName: [{ required: true, message: '请输入托运人', trigger: 'change' }],
				deliveryStation: [
					{ required: true, message: '请输入发站', trigger: 'change' },
					{ validator: this.validateDeliveryStation, trigger: ['change', 'blur'] }
				],
				arriveStation: [{ required: true, message: '请输入到站', trigger: 'change' }],
				receiverName: [{ required: false, message: '请输入收货人', trigger: 'change' }],
				deliverName: [{ required: true, message: '请输入发货人', trigger: 'change' }],
				deliverQuantity: [
					{ required: true, message: '请输入发货数量', trigger: 'change' },
					{ validator: validateQuantity, max: 100000000, message: '发货数量不大于10000000吨，最多三位小数', trigger: 'change' }
				],
				deliverDate: [{ required: true, message: '请输入发货日期', trigger: 'change' }],
				trainNum: [
					{ required: true, message: '请输入车数', trigger: 'change' },
					{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '车数为正整数', trigger: 'change' }
				]
			},
			shipperNameList: [], // 托运人列表
			fileInfos: [],
			dataSource: [],
			previewVisible: false,
			previewImage: '',
			fetching: false,
			timer: null,
			filterCodeByValueName: filterCodeByValueName,
			columns: [
				{
					title: '运单号',
					dataIndex: 'transTicketNo'
				},
				{
					title: '车种',
					dataIndex: 'trainType'
				},
				{
					title: '车号',
					dataIndex: 'trainNo'
				},
				{
					title: '票重（吨）',
					dataIndex: 'weight'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			trainInfoData: '', // 车皮信息
			isLYGJ: true, // 是否是联运管家
			departureTime: null, // 联运管家返回的发车时间
			pushFlag: false, // 判断是否属于人工手工输入托运人
			quantityTipsVisible: false, // 发货数量提示展示
			trainNumTipsVisible: false, // 车数提示展示
			shipperNameTipsVisible: false, // 托运人提示展示
			isWholeTrain: false, // 是否是整列运输
			serialNo: '', // 初始运单号
			shipperNameOld: '', // 初始托运人
			inputDisabled: false, // 手动录入信息是否开放输入
			fileType: [
				{
					key: 'DP',
					label: '大票',
					required: true,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				},
				{
					key: 'CHB',
					label: '车号表',
					required: true,
					fileType: 'fileType24',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp,.xlsx,.xls,.XLSX,.XLS'
				},
				{
					key: 'OTHER',
					label: '其他凭证',
					required: false,
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
				}
			],
			attachments: [],
			requireTip: '其中“车号表”同时支持xlsx，xls格式'
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		trainInfoData(data) {
			this.trainInfoData = data;
		},
		isLYGJ(data) {
			// 是否是联运管家true或者神华外购false
			this.isLYGJ = data;
		}
	},
	methods: {
		initAttach(list) {
			this.$refs.attachment.init(list);
		},
		moment(val) {
			return moment(val).locale('zh-cn').format('YYYY-MM-DD');
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		submitReleaseForm() {
			this.$refs.releaseForm.validate(async err => {
				if (!this.isLYGJ) {
					let deliveryInfoShip = this.$refs.trainInfo.form.tableDataSource;
					if (deliveryInfoShip.length < 1) {
						this.$message.error('请录入至少一条运输信息');
						return false;
					}
					let trainInfoVlidator = await this.$refs.trainInfo.handleSubmit();
					if (!trainInfoVlidator) {
						return;
					}
				}
				const attachList = this.$refs.attachment.save();
				if (!attachList) {
					return;
				}

				if (err) {
					let transInfo = {
							trainNum: this.params.trainNum,
							railwayPlanNo: this.params.railwayPlanNo,
							deliverDate: this.moment(this.params.deliverDate),
							transType: 1,
							deliverQuantity: this.params.deliverQuantity,
							fireDetailDtoList: this.isLYGJ ? [] : this.$refs.trainInfo.form.tableDataSource,
							submit: true,
							departureTime: this.departureTime,
							handInput: this.isLYGJ ? (this.params.deliverDate.split(' ')[0] == this.departureTime ? 0 : 2) : 1,
							fileInfoList: attachList
						}
					let bodyObj = {
						deliverId: this.$route.query.deliverId,
						orderId: this.$route.query.orderId,
						transInfo: [],
					};

					Object.assign(transInfo, {
						serialNo: this.params.serialNo,
						shipperName: this.params.shipperName,
						shipperUscc: this.params.shipperUscc, // 托运人的uscc
						deliveryStation: Array.isArray(this.params.deliveryStation)
							? this.params.deliveryStation.join(',')
							: this.params.deliveryStation,
						arriveStation: Array.isArray(this.params.arriveStation)
							? this.params.arriveStation.join(',')
							: this.params.arriveStation
					});
					if (this.isLYGJ) {
						let deliverWaybillInfoResp = [
							{
								transTicketNo: this.trainInfoData.serialNo,
								deliverQuantity: this.trainInfoData.weight,
								trainNo: this.trainInfoData.carNumber,
								trainType: this.trainInfoData.carType
							}
						];
						Object.assign(transInfo, {
							fireDetailDtoList: deliverWaybillInfoResp, // 新数据联运管家
							arriveStation: this.trainInfoData.arriveStation,
							deliveryStation: this.trainInfoData.departureStation,
							railwayPlanNo: this.trainInfoData.demandNo,
							deliverDate: this.params.deliverDate
						});
					}
					if (this.params.receiverName) {
						bodyObj.receiverName = this.params.receiverName.join(',');
					}
					bodyObj.deliveryPlace = this.selectContractInfo.deliveryPlace;
					bodyObj.unloadGoodsPlace = this.selectContractInfo.unloadGoodsPlace;
					bodyObj.transInfo.push(transInfo);
					let that = this;
					this.openModel(that, bodyObj);
					// if(this.verifyFile()){
					//   this.openModel(that,bodyObj)
					// }
				}
			});
		},
		// 校验发站
		validateDeliveryStation(rule, value, callback) {
			if (value) {
				if (Array.isArray(value) && value.length > 1) {
					callback('只能选择一个发站');
				}
			}
			callback();
		},
		openModel(that, obj) {
			that.$confirm({
				centered: true,
				title: '请确认发货信息无误并提交发货申请吗？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					return API_DELIVERYSAVE(obj)
						.then(res => {
							if (res.success) {
								if (obj.transInfo.handInput != 1 && that.$route.query.orderId) {
									that.$confirm({
										closable: true,
										content: '您可以直接开具货转凭证，是否前往开具？',
										okText: '立即前往',
										onOk() {
											that.$router.push({
												path: '/center/transfer/goodsTransfer/apply',
												query: {
													orderType: 'ONLINE',
													serialId: obj.orderId,
													serialNo: obj.serialNo,
												}
											});
										},
										cancelText: '暂不开具',
										onCancel() {
											that.$message.success('发货申请提交成功');
											that.$router.push('/center/receive/send/list');
										}
									});
								} else {
									that.$router.push('/center/receive/send/list');
								}
							}
						})
						.finally(() => {});
				},
				onCancel() {}
			});
		},
		transferData(str) {
			// 新数据为json字符串，老数据为string
			if (typeof str == 'string') {
				try {
					var obj = JSON.parse(str);
					if (typeof obj == 'object' && obj) {
						return obj;
					}
				} catch (e) {
					return str.split(',');
				}
			}
		},
		handleShipperNameSelect(val) {
			// 选中托运人
			this.shipperNameList.forEach(item => {
				if (item.name == val) {
					this.params.code = item.code;
					this.params.shipperUscc = item.uscc;
					this.shipperNameTipsVisible = item.new ? true : this.pushFlag; // 如果选择的是人工手动输入的，则显示托运人提示框
					//不再推送
					if (!this.params.serialNo) return;
					this.getTrainInfo();
					if (!item.existed) {
						// 如果不存在则推送
						API_saveTrainDeliverShipper({
							shipperName: val
						}).then(res => {
							if (res.success) {
								this.params.code = res.data.code;
								if (!this.params.serialNo) return;
								this.getTrainInfo();
							}
						});
					} else {
						if (!this.params.serialNo) return;
						this.getTrainInfo();
					}
				}
			});
			this.params.shipperName = val;
		},
		serialNoChange() {
			this.$refs.releaseForm.validateField(['serialNo'], (err) => {
				if (!err) {
					this.handleShipperNameSelect(this.params.shipperName);
				}
			});
		},
		handleShipperNameSearch(name) {
			if (!name) return;
			if (!reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾');
				return;
			}
			//获取托运人列表（数据来源已存在和企查查获得）
			this.shipperNameTipsVisible = false; // 不展示托运人提示
			this.shipperNameList = [];
			this.fetching = true;
			API_getApiTrainDeliverShipper({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.shipperNameList = res.data || [];
				}
			});
		},
		getTrainInfo() {
			// 根据运单号获取车皮信息
			let obj = {};
			(obj.shipperName = this.params.shipperName), (obj.serialNo = this.params.serialNo);
			obj.code = this.params.code;
			obj.dataSource = 1;
			obj.companyUserId = this.VUEX_ST_COMPANYSUER.companyId;
			if (!this.params.shipperName) {
				this.$message.error('托运人不能为空');
				return;
			} else if (!this.params.serialNo) {
				this.$message.error('运单号不能为空');
				return;
			} else if (this.params.serialNo.length != 13 && this.params.serialNo.length != 12) {
				this.$message.error('请输入12位或者13位运单号');
				return;
			} 
			// else if (!this.params.code) {
			// 	this.$message.error('托运人编号为空');
			// 	return;
			// }
			if (!serialNoRegExp.test(this.params.serialNo)) {
				this.$message.error('输入数字/大写字母/数字大写字母组合');
				return;
			}
			if (!(this.serialNo != this.params.serialNo || this.shipperNameOld != this.params.shipperName)) return;
			this.serialNo = this.params.serialNo;
			this.shipperNameOld = this.params.shipperName;
			API_getDeliverInfoTrains({
				shipperName: this.params.shipperName,
				code: this.params.code,
				serialNo: this.params.serialNo
			}).then(async res => {
				// success=true,有data对象是联运管家返回数据，无data是神华外购,
				// code为303，302,运单号不存在，弹出提示,不放开其他信息填写
				if (res.success) {
					if (res.data) {
						this.inputDisabled = false;
						this.$set(this.params, 'deliverDate', moment(res.data.departureTime));
						this.isLYGJ = true;
						this.trainInfoData = res.data;
						this.params.deliverDate = res.data.departureTime.split(' ')[0];
						this.departureTime = res.data.departureTime.split(' ')[0];
						if (res.data.carType == '整列运输') {
							this.isWholeTrain = true; // 是整列运输
							//修改时，如果是整列运输，车数和发货数量不覆盖
							if (this.$route.query.deliverId) {
								return;
							}
							this.$set(this.params, 'deliverQuantity', res.data.weight);
							this.$set(this.params, 'trainNum', res.data.trainNum);
							this.quantityTipsVisible = true; // 展示发货数量、车数提示语
							this.trainNumTipsVisible = true;
							$('.flexDiv .ant-form-item-control input').addClass('tipsBlue'); // 输入框高亮
						} else {
							this.quantityTipsVisible = false; // 不展示发货数量、车数提示语
							this.trainNumTipsVisible = false;
							this.$set(this.params, 'deliverQuantity', null);
							this.$set(this.params, 'trainNum', null);
							if (this.isWholeTrain) {
								$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
							}
							this.isWholeTrain = false; // 不是整列运输
						}
					} else {
						this.params.deliveryStationList = this.transferData(this.selectContractInfo.deliveryStationList || '[]');
						this.params.arriveStationList = this.transferData(this.selectContractInfo.arriveStationList || '[]');
						this.params.deliveryStation =
							this.params.deliveryStationList.length === 1 ? this.params.deliveryStationList[0] : undefined;
						this.params.arriveStation = this.params.arriveStationList.length === 1 ? this.params.arriveStationList[0] : undefined;
						this.inputDisabled = false;
						this.isLYGJ = false; // 不是联运管家,是神华外购
						this.quantityTipsVisible = false; // 不展示发货数量、车数提示语
						this.trainNumTipsVisible = false;
						this.$set(this.params, 'deliverQuantity', null);
						this.$set(this.params, 'trainNum', null);
						this.$set(this.params, 'deliverDate', null);
						if (this.isWholeTrain) {
							$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
						}
						this.isWholeTrain = false; // 不是整列运输
					}
				} else {
					//特殊情况下 展示特殊提示，且不允许用户输入
					this.isLYGJ = true;
					this.$message.error(res.error.message);
					this.inputDisabled = true;
					this.$set(this.params, 'deliverQuantity', null);
					this.$set(this.params, 'trainNum', null);
					this.$set(this.params, 'deliverDate', null);
					this.trainInfoData = '';
					this.$set(this.params, 'receiverName', null);
				}
			});
		},
		getTime(value, dateString) {
			// 发货日期修改
			this.$set(this.params, 'deliverDate', dateString);
		},
		quantityFocus() {
			// 发货数量获取焦点
			this.quantityTipsVisible = false;
			$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
		},
		trainNumFocus() {
			// 车数获取焦点
			this.trainNumTipsVisible = false;
			$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		},
		goBack() {
			this.$refs.confirmReturn.init('/center/receive/send/list');
		},
		verifyFile() {
			let fileType = '';
			let success = true;
			this.attachments.map(item => {
				fileType += item.typeName;
			});
			this.fileType
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(item.label)) {
						this.$message.error(`请上传${item.label}`);
						success = false;
					}
				});
			return success;
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
}

.submit-btn {
	text-align: center;
	margin-top: 52px;

	.ant-btn {
		margin: 0 10px;
		width: 114px;
		height: 38px;
		line-height: 38px;
	}
}
</style>
