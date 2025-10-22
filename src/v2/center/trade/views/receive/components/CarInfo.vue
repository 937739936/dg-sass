<template>
	<!-- 收发货车辆信息-->
	<div id="carInfo">
		<div
			class="sub-title"
			:class="isReceive ? 'sub-title-small' : ''"
		>
			运输信息
			<template v-if="!disabled">
				<a-button
					@click="add"
					style="margin-left: 25px"
					type="primary"
					ghost
				>
					新增
				</a-button>
				<a-button
					@click="popCarList"
					style="margin-left: 25px"
				>
					选择已有车辆信息
				</a-button>
			</template>
		</div>
		<div
			:class="isDetail ? '' : 'train-times-wrap'"
			style="margin-top: 20px"
		>
			<a-form-model
				ref="ruleForm"
				:model="form"
				:rules="rules"
				style="margin-bottom: 30px"
			>
				<a-table
					:class="release ? 'release' : 'receive'"
					:dataSource="form.tableDataSource"
					:columns="columns"
					class="new-table"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="plateNumber"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.plateNumber'"
							v-if="!disabled && record.type == 'HAND'"
							:rules="rules.plateNumber"
						>
							<div>
								<a-input
									autocomplete="off"
									v-model="record.plateNumber"
									@blur="handleSubmit"
								>
									<div slot="suffix">
										<a-popover>
											<template slot="content">
												<div class="vector">
													<ul>
														<li
															v-for="item in S.split('')"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<ul>
														<li
															v-for="item in N.split('')"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<ul>
														<li
															v-for="item in Z.split('')"
															@click="keyEnter(record, item)"
														>
															{{ item }}
														</li>
													</ul>
													<img
														src="~@/v2/assets/imgs/receive/delete.png"
														alt=""
														class="delete-item"
														@click="delEnter(record)"
													/>
												</div>
											</template>
											<img
												src="~@/v2/assets/imgs/receive/vector.png"
												alt=""
												style="width: 15px"
											/>
										</a-popover>
									</div>
								</a-input>
							</div>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="deliverDate"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.deliverDate'"
							v-if="(!disabled && record.type == 'HAND') || (transInfo.dataSource == 3 && !record.deliverDate)"
							:rules="rules.deliverDate"
						>
							<a-date-picker
								style="width: 100%"
								showTime
								placeholder="请选择发车时间"
								format="YYYY-MM-DD HH:mm"
								valueFormat="YYYY-MM-DD HH:mm"
								@blur="handleSubmit"
								:disabled-date="startVal => disabledStartDate(record, startVal)"
								v-model="record.deliverDate"
							>
							</a-date-picker>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="arriveDate"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.arriveDate'"
							v-if="(!disabled || $route.query.from) && record.type == 'HAND'"
							:rules="rules.arriveDate"
						>
							<a-date-picker
								style="width: 100%"
								:disabled="received || isDetail"
								showTime
								placeholder="请选择到站时间"
								@blur="handleSubmit"
								:disabled-date="endVal => disabledEndDate(record, endVal)"
								:disabled-time="endVal => disabledEndDateTime(record, endVal)"
								valueFormat="YYYY-MM-DD HH:mm"
								format="YYYY-MM-DD HH:mm"
								v-model="record.arriveDate"
							>
							</a-date-picker>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="deliverQuantity"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="deliverQuantity"
							:prop="'tableDataSource.' + index + '.deliverQuantity'"
							v-if="!disabled && record.type == 'HAND'"
							:rules="rules.deliverQuantity"
						>
							<a-input-number
								style="width: 100%"
								@blur="handleSubmit"
								v-model="record.deliverQuantity"
								:disabled="isDetail"
							/>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="ticketNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="ticketNo"
							:prop="'tableDataSource.' + index + '.ticketNo'"
							v-if="!disabled && record.type == 'HAND'"
							:rules="rules.ticketNo"
						>
							<a-input v-model="record.ticketNo" />
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="storageRecordSerialNo"
						slot-scope="text, record"
					>
						<a
							v-if="authFlag"
							href="javascript:;"
							@click="jumpStorehouseDetail(record.storageRecordId)"
							>{{ record.storageRecordSerialNo }}</a
						>
						<span v-else>{{ record.storageRecordSerialNo }}</span>
					</template>
					<template
						slot="operation"
						v-if="!disabled"
						slot-scope="text, record, index"
					>
						<a-space>
							<a-popconfirm
								title="确定删除该条运输信息?"
								okText="确定"
								cancelText="取消"
								@confirm="onDelete(index)"
								v-if="!disabled"
							>
								<a
									href="javascript:;"
									class="delete-btn"
									>删除</a
								>
							</a-popconfirm>
						</a-space>
					</template>
				</a-table>
			</a-form-model>
			<CarList
				ref="carList"
				@getCarList="getCarList"
			/>
		</div>
	</div>
</template>

<script>
import CarList from './CarList.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
let S = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领';
let N = '0123456789';
let Z = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
import { subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
export default {
	name: 'CarInfo',
	props: {
		transInfo: {
			type: Object,
			default: function () {
				return {};
			}
		},
		datas: {
			type: Array,
			default: function () {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: function () {
				return false;
			}
		},
		type: {
			type: String,
			default: '' //默认空，详情，可添加删除，收货不可添加删除
		},
		popCar: {
			type: Object,
			default: function () {
				return { show: false };
			} //是否可以选择选择已有数据
		},
		selectContractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		received: {
			type: Boolean,
			default: function () {
				return false;
			}
		},
		inCoalPlanSerialNoList: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		authFlag() {
			return (
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage:storage')
			);
		},
		//发货
		release() {
			return this.type == 'release';
		},
		//收货
		receive() {
			return this.type == 'receive';
		}
	},
	components: {
		CarList
	},
	watch: {
		datas(e) {
			if (e?.length) {
				this.form.tableDataSource = e;
			}
		}
	},
	data() {
		return {
			S,
			N,
			Z, // 车牌号
			dataSource: [],
			columns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber',
					scopedSlots: { customRender: 'plateNumber' }
				},
				{
					title: '发货数量(吨)',
					dataIndex: 'deliverQuantity',
					scopedSlots: { customRender: 'deliverQuantity' }
				},
				{
					title: '发车时间',
					dataIndex: 'deliverDate',
					scopedSlots: { customRender: 'deliverDate' }
				},
				{
					title: '到站时间',
					dataIndex: 'arriveDate',
					scopedSlots: { customRender: 'arriveDate' }
				},
				{
					title: '运单号',
					dataIndex: 'ticketNo',
					scopedSlots: { customRender: 'ticketNo' }
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					align: 'center',
					dataIndex: 'operation'
				}
			],
			form: {
				tableDataSource: []
			},
			rules: {
				plateNumber: [
					{ required: true, message: '请输入车牌号', trigger: ['change', 'blur'] },
					{
						pattern:
							/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/,
						message: '请输入正确的车牌号',
						trigger: ['change', 'blur']
					}
				],
				deliverQuantity: [
					{ required: true, message: '请输入发货量', trigger: ['change', 'blur'] },
					{
						pattern: /(^((\d{0,2})|([1]\d{0,2})|0)(\.\d{0,2})?$)|(^([2][0]{0,2})(\.[0]{0,2})?$)/,
						message: '发货量为数字，最大200，最多两位小数',
						trigger: ['change', 'blur']
					}
				],
				ticketNo: [{ pattern: /^.{0,30}$/, message: '最大输入30个字符' }],
				deliverDate: [{ required: true, message: '请选择发车时间', trigger: ['change', 'blur'] }],
				arriveDate: [{ required: this.receive, message: '请选择到站时间', trigger: ['change', 'blur'] }]
			},
			isReceive: this.$route.query.from === 'receive',
			isDetail: this.$route.fullPath.includes('detail')
		};
	},
	mounted() {
		if (this.disabled) {
			this.columns = this.columns.filter(item => {
				return item.dataIndex != 'operation';
			});
			this.form.tableDataSource = this.datas;
		}
		// 判断是否有上下煤计划
		if (!this.transInfo.coalPlanId) return;
		let arr = this.columns.filter(items => {
			return items.title == '入库单号';
		});
		if (!arr.length) {
			let obj = { title: '入库单号', dataIndex: 'storageRecordSerialNo', scopedSlots: { customRender: 'storageRecordSerialNo' } };
			this.columns.splice(this.columns.length - 1, 1, obj);
		}
	},
	methods: {
		add() {
			this.form.tableDataSource.push({
				type: 'HAND',
				plateNumber: '',
				dateNow: Date.now()
			});
		},
		handleSubmit() {
			let val = false;
			new Promise(() => {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						val = true;
					}
				});
			});
			return val;
		},
		keyEnter(record, item) {
			record.plateNumber = record.plateNumber ? `${record.plateNumber}${item}` : item;
			this.handleSubmit();
		},
		delEnter(record) {
			if (record.plateNumber) {
				record.plateNumber = record.plateNumber.slice(0, record.plateNumber.length - 1);
			}
			this.handleSubmit();
		},
		disabledStartDate(record, startValue) {
			const endValue = record.arriveDate;
			if (!startValue || !endValue) {
				return false;
			}
			return startValue.valueOf() > moment(endValue).valueOf();
		},
		disabledEndDate(record, endValue) {
			const startValue = record.deliverDate;
			if (!endValue || !startValue) {
				return false;
			}
			return (
				endValue &&
				(moment(endValue).format('YYYY-MM-DD') < moment(record.deliverDate).format('YYYY-MM-DD') ||
					moment(endValue).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD'))
			);
		},
		onDelete(key) {
			this.form.tableDataSource = this.form.tableDataSource.filter((item, index) => index !== key);
			this.$message.success('删除成功');
		},
		//选择已有发运车辆
		popCarList() {
			let carNoList = [];
			this.form.tableDataSource.forEach(item => {
				carNoList.push(item.id);
			});
			if (!this.selectContractInfo.orderSerialNo) {
				this.$message.error('请先关联销售合同');
				return;
			}
			this.$refs.carList.showModal(carNoList, this.selectContractInfo.orderSerialNo, this.popCar.batchNo);
		},
		//已有发运车辆确认
		getCarList(selectedCarNoList, selectedCarNoData) {
			// 先剔除数据中本次取消的合同
			let dataSource = this.form.tableDataSource.filter(item => {
				return !item.id || (item.id && selectedCarNoList.includes(item.id));
			});
			//处理新增
			let selectedCarNoDataNew = selectedCarNoData.filter(item => {
				return !dataSource.some(items => {
					return items.id == item.id;
				});
			});
			selectedCarNoDataNew = selectedCarNoDataNew.map(item => {
				return {
					...item,
					orderSerialNo: this.popCar.orderSerialNo
				};
			});
			dataSource = dataSource.concat(selectedCarNoDataNew);
			this.form.tableDataSource = dataSource;
		},
		rangeHours(start, end, value, chooseday, day) {
			const result = [];
			if (chooseday === day) {
				for (let i = start; i < end; i++) {
					if (i > value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeMinutes(start, end, value, chooseday, day, chooseh, h) {
			const result = [];
			if (chooseday === day && chooseh === h) {
				for (let i = start; i < end; i++) {
					if (i > value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeHours1(start, end, value, chooseday, day) {
			const result = [];
			if (chooseday === day) {
				for (let i = start; i < end; i++) {
					if (i < value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		rangeMinutes1(start, end, value, chooseday, day, chooseh, h) {
			const result = [];
			if (chooseday === day && chooseh === h) {
				for (let i = start; i < end; i++) {
					if (i <= value) {
						result.push(i);
					}
				}
			}
			return result;
		},
		disabledEndDateTime(record, date) {
			const choosetime = moment(date).format('HH-mm-ss');
			const chooseday = parseInt(moment(date).format('YYYY-MM-DD').split('-')[2]);
			const chooseh = parseInt(choosetime.split('-')[0]);
			if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
				const nowtime = moment().format('HH-mm-ss');
				const day = parseInt(moment().format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
			if (moment(date).format('YYYY-MM-DD') === moment(record.deliverDate).format('YYYY-MM-DD')) {
				const nowtime = moment(record.deliverDate).format('HH-mm-ss');
				const day = parseInt(moment(record.deliverDate).format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours1(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes1(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
		},
		jumpStorehouseDetail(id) {
			// 入库详情
			const { stationId, stationCompanyUscc } = this.transInfo;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/IN/records/detail',
				query: {
					id
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');

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

.sub-title-small {
	font-size: 14px;
	padding-left: 0;
	margin-bottom: -10px;
	&:before {
		display: none;
	}
}

/deep/ .ant-form-item {
	margin-bottom: 0;
}

/deep/ .train-times-wrap .ant-table-column-title {
	&:before {
		content: '*';
		float: left;
		font-size: 14px;
		display: block;
		color: #f65927;
		margin-right: 4px;
	}
}

/deep/ [key='operation'] .ant-table-column-title,
/deep/ [key='ticketNo'] .ant-table-column-title {
	&:before {
		display: none;
	}
}

//发货到站时间不用填
.release /deep/ [key='arriveDate'] .ant-table-column-title {
	&:before {
		display: none;
	}
}

/deep/ .ant-form-item {
	margin-bottom: 0;
}
/deep/.ant-table-thead > tr > th {
	padding: 10px 16px !important;
}
/deep/ .ant-table-tbody > tr > td {
	padding: 12px 16px !important;
}
/deep/ .has-error .ant-form-explain,
.has-error .ant-form-split {
	position: absolute;
	bottom: -14px;
}
/deep/ .ant-form-explain {
	position: absolute;
}
/deep/ .ant-table-body {
	overflow-y: hidden;
}

//车牌号弹窗
.vector {
	width: 268px;
	height: 410px;
	position: relative;
	color: #000000cc;
	ul {
		display: flex;
		flex-wrap: wrap;
		li {
			margin-right: 16px;
			width: 24px;
			height: 24px;
			font-size: 14px;
			line-height: 24px;
			cursor: pointer;
			border-radius: 4px;
			text-align: center;
			margin-bottom: 14px;
			&:nth-child(7n + 7) {
				margin-right: 0;
			}
			&:hover {
				background-color: @primary-color;
				color: #ffffff;
			}
		}
	}
	.delete-item {
		height: 12px;
		position: absolute;
		right: 11px;
		bottom: 11px;
		cursor: pointer;
	}
}
</style>
