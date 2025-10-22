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
					<a-form-model-item
						prop="shipperName"
						label="铁路托运人"
					>
						<a-select
							:getPopupContainer="getPopupContainer"
							placeholder="铁路托运人"
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
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						prop="serialNo"
						label="运单号"
						:colon="false"
					>
						<a-input
							placeholder="运单号"
							autocomplete="off"
							v-model="params.serialNo"
							@blur="getTrainInfo"
							@change="e => handleSerialNoChange(e)"
						/>
					</a-form-model-item>
				</a-col>
				<a-col
					:span="8"
					class="row flexDiv"
				>
					<a-form-model-item
						prop="deliverQuantity"
						label="发货数量(吨)"
					>
						<a-input
							:disabled="inputDisabled"
							placeholder="发货数量(吨)"
							autocomplete="off"
							v-model="params.deliverQuantity"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						prop="trainNum"
						label="车数"
						:colon="false"
					>
						<a-input-number
							:disabled="inputDisabled"
							placeholder="车数"
							autocomplete="off"
							:min="1"
							:precision="0"
							v-model="params.trainNum"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="8">
					<a-form-model-item
						label="发货日期"
						:colon="false"
						prop="deliverDate"
					>
						<a-date-picker
							:disabled-date="disabledDate"
							:disabled="inputDisabled"
							v-model="params.deliverDate"
						/>
					</a-form-model-item>
				</a-col>
				<template v-if="!isLYGJ">
					<a-col :span="8">
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
								<a-select-option
									:value="item"
									:key="index"
									v-for="(item, index) in params.deliveryStationList"
								>
									{{ item }}
								</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col :span="8">
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
								<a-select-option
									:value="item"
									:key="index"
									v-for="(item, index) in params.arriveStationList"
								>
									{{ item }}
								</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col :span="8">
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
					</a-col>
				</template>
				<!-- 联运管家，发站、到站、铁路计划号不可填写，数据从运单信息里取-->
				<template v-if="isLYGJ">
					<a-col :span="8">
						<a-form-model-item
							label="发站"
							prop="departureStation"
							:colon="false"
						>
							<a-input
								disabled
								autocomplete="off"
								v-model="trainInfoData.departureStation"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="8">
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
					</a-col>
					<a-col :span="8">
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
					</a-col>
				</template>
			</a-row>
		</a-form-model>
		<TrainInfo
			:data-source="fireDetailDtoList"
			ref="trainInfo"
			v-if="!isLYGJ"
			:firstTransTicketNo="params.serialNo"
			@changeFirstTransTicketNo="changeFirstTransTicketNo"
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
	</div>
</template>

<script>
const serialNoRegExp = /^[0-9A-Z]{12,13}$/;
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_getDeliverInfoTrains, API_getApiTrainDeliverShipper } from '@/v2/center/trade/api/receive';
import moment from 'moment';
import { mapGetters } from 'vuex';
import { directGoodsTransferTypes } from '@/v2/utils/goodsTransfer/basicInfo.js';
import TrainInfo from '@/v2/center/logisticSupervise/views/receive/components/TrainInfo';
import TrainInfoLYGJ from '@/v2/center/logisticSupervise/views/receive/components/TrainInfoLYGJ';
import { getPopupContainer } from '@/v2/utils/factory.js';
import reg from '@sub/utils/reg.js';
import Attachment from './Attachment.vue';
import message from '@/v2/router/module/message';

export default {
	name: 'ReleaseTrain',
	components: {
		TrainInfo,
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
			let regs2 = /^\d+(\.\d{0,2})?$/;
			if (!regs2.test(value) || Number(value) >= rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			getPopupContainer,
			directGoodsTransferTypes,
			params: {
				logisticSuperviserName: [],
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
					{ validator: validateQuantity, max: 100000000, message: '发货数量不大于10000000吨，最多两位小数', trigger: 'change' }
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
				logisticSuperviserName: [{ required: false, message: '请输入收货人', trigger: 'change' }]
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
				logisticSuperviserName: [{ required: false, message: '请输入收货人', trigger: 'change' }],
				deliverName: [{ required: true, message: '请输入发货人', trigger: 'change' }],
				deliverQuantity: [
					{ required: true, message: '请输入发货数量', trigger: 'change' },
					{ validator: validateQuantity, max: 100000000, message: '发货数量不大于10000000吨，最多两位小数', trigger: 'change' }
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
		}
	},
	methods: {
		initAttach(list) {
			this.$refs.attachment.init(list);
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		submitReleaseForm() {
			return new Promise(resolve => {
				this.$refs.releaseForm.validate(async err => {
					if (!this.isLYGJ) {
						let deliveryInfoShip = this.$refs.trainInfo.form.tableDataSource;
						if (deliveryInfoShip.length < 1) {
							this.$message.error('请录入至少一条运输信息');
							resolve(false);
						}
						let trainInfoVlidator = await this.$refs.trainInfo.handleSubmit();
						if (!trainInfoVlidator) {
							resolve(false);
						}
					}
					const attachList = this.$refs.attachment.save();
					if (!attachList) {
						resolve(false);
					}
					if (err) {
						let deliverDate = moment(this.params.deliverDate).format('YYYY-MM-DD');
						let bodyObj = {
							orderId: this.$route.query.orderId,
							transInfo: [
								{
									trainNum: this.params.trainNum,
									railwayPlanNo: this.params.railwayPlanNo,
									deliverDate,
									transType: 1,
									deliverQuantity: this.params.deliverQuantity,
									fireDetailDtoList: this.isLYGJ ? [] : this.$refs.trainInfo.form.tableDataSource,
									submit: true,
									departureTime: this.departureTime,
									handInput: this.isLYGJ ? (deliverDate == this.departureTime ? 0 : 2) : 1,
									fileInfoList: attachList
								}
							]
						};

						Object.assign(bodyObj.transInfo[0], {
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
							Object.assign(bodyObj.transInfo[0], {
								fireDetailDtoList: deliverWaybillInfoResp, // 新数据联运管家
								arriveStation: this.trainInfoData.arriveStation,
								deliveryStation: this.trainInfoData.departureStation,
								railwayPlanNo: this.trainInfoData.demandNo,
								deliverDate: this.params.deliverDate
							});
						}
						if (this.params.logisticSuperviserName) {
							bodyObj.logisticSuperviserName = this.params.logisticSuperviserName.join(',');
						}
						resolve(bodyObj);
					}
				});
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
				}
			});
			this.params.shipperName = val;
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

							$('.flexDiv .ant-form-item-control input').addClass('tipsBlue'); // 输入框高亮
						} else {
							this.$set(this.params, 'deliverQuantity', null);
							this.$set(this.params, 'trainNum', null);
							if (this.isWholeTrain) {
								$('.flexDiv .ant-form-item-control input').removeClass('tipsBlue');
							}
							this.isWholeTrain = false; // 不是整列运输
						}
					} else {
						this.params.deliveryStationList = this.transferData(this.selectContractInfo.origin || '[]');
						this.params.arriveStationList = this.transferData(this.selectContractInfo.destination || '[]');
						this.params.deliveryStation =
							this.params.deliveryStationList.length === 1 ? this.params.deliveryStationList[0] : undefined;
						this.params.arriveStation = this.params.arriveStationList.length === 1 ? this.params.arriveStationList[0] : undefined;
						this.inputDisabled = false;
						this.isLYGJ = false; // 不是联运管家,是神华外购

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
					this.$set(this.params, 'logisticSuperviserName', null);
				}
			});
		},
		// 运单号发生变化
		handleSerialNoChange(e) {
			let serialNo = e.target.value;
			if (!this.isLYGJ) {
				this.$refs.trainInfo.setFirstTransTicketNo(serialNo);
			}
		},
		// 改变第一条运单号
		changeFirstTransTicketNo(val) {
			this.$set(this.params, 'serialNo', val);
			this.$refs.releaseForm.validateField('serialNo',(message)=>{});
		},
		
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding: 0;
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
}

.ant-col {
	min-height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
</style>
