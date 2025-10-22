<template>
	<div id="shipInfo">
		<div
			class="sub-title"
			:class="isReceive ? 'sub-title-small' : ''"
		>
			运输信息
			<a-button
				type="primary"
				ghost
				v-if="!disabled"
				@click="addShipInfo"
				style="margin-left: 25px"
			>
				新增信息
			</a-button>
		</div>
		<div
			:class="isDetail ? '' : 'train-times-wrap'"
			style="margin-top: 20px"
		>
			<a-form-model
				ref="ruleForm"
				class="slFormDetail"
				:model="form"
				:rules="rules"
				style="margin-bottom: 30px"
				:class="setStyle(form.tableDataSource)"
			>
				<a-table
					:dataSource="form.tableDataSource"
					:columns="columns"
					:pagination="false"
					class="new-table"
					:rowKey="(item, index) => String(index)"
					:scroll="{ x: true }"
				>
					<template
						slot="identifierNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.identifierNo'"
							:rules="rules.identifierNo"
							v-if="!disabled"
						>
							<a-input
								v-model="record.identifierNo"
								@blur="blurMMSI(record)"
							/>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="shipName"
						slot-scope="text, record"
					>
						<a-form-model-item
							ref="shipName"
							v-if="!disabled"
						>
							<a-tooltip>
								<template #title>{{ record.shipName }}</template>
								<a-input
									v-model="record.shipName"
									:maxLength="200"
								/>
								<span style="opacity: 0">t</span>
							</a-tooltip>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="deliverQuantity"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.deliverQuantity'"
							:rules="rules.deliverQuantity"
							v-if="!disabled"
						>
							<a-space>
								<a-input-number
									v-model="record.deliverQuantity"
									@blur="handleSubmit"
								/>
								<a-tooltip>
									<template #title>船运业务中，若不填写装货量直接提交，则进入装货中状态</template>
									<i
										class="iconfont icon-liebiaobiaotou-shuoming"
										style="font-size: 12px"
									></i>
								</a-tooltip>
							</a-space>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="voyageNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.voyageNo'"
							:rules="rules.voyageNo"
							v-if="!disabled"
						>
							<a-input v-model="record.voyageNo" />
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="originPortName"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.originPortName'"
							:rules="rules.originPortName"
							v-if="!disabled"
						>
							<a-input
								placeholder="船舶始发港口名称"
								style="width: 200px"
								v-model="record.originPortName"
							/>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="originPortInTime"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="originPortInTime"
							:prop="'tableDataSource.' + index + '.originPortInTime'"
							:rules="rules.originPortInTime"
							v-if="!disabled"
						>
							<a-date-picker
								showTime
								format="YYYY-MM-DD HH:mm"
								:disabled-date="disabledDate"
								:disabled-time="disabledDateTime"
								placeholder="请选择到达始发港时间"
								v-model="record.originPortInTime"
							/>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="destinationPortName"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.destinationPortName'"
							:rules="rules.destinationPortName"
							v-if="!disabled"
						>
							<a-input
								readOnly
								placeholder="船舶目的港口名称"
								style="width: 200px"
								@click="checkPort(index, 'destination')"
								v-model="record.destinationPortName"
							/>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="destinationPortInTime"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="destinationPortInTime"
							:prop="'tableDataSource.' + index + '.destinationPortInTime'"
							v-if="(!disabled || $route.query.from) && record.arrived"
						>
							<a-date-picker
								showTime
								:disabled="received"
								:disabled-date="endVal => disabledEndDate(record, endVal)"
								:disabled-time="endVal => disabledEndDateTime(record, endVal)"
								format="YYYY-MM-DD HH:mm"
								placeholder="请选择到达目的港时间"
								v-model="record.destinationPortInTime"
							/>
						</a-form-model-item>
						<span v-else>
							{{ text || '-' }}
						</span>
					</template>
					<template
						slot="arrived"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="arrived"
							:prop="'tableDataSource.' + index + '.arrived'"
							v-if="!isDetail"
						>
							<a-radio-group
								v-model="record.arrived"
								:disabled="received || isDetail"
								@change="val => changeArrived(record, val)"
							>
								<a-radio :value="true"> 是 </a-radio>
								<a-radio :value="false"> 否 </a-radio>
							</a-radio-group>
						</a-form-model-item>
						<div v-else>
							{{ record.destinationPortInTime ? '是' : '否' }}
						</div>
					</template>
					<a-space
						slot="action"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="jumpToShipTail(record)"
							>轨迹查询</a
						>
						<a
							href="javascript:;"
							@click="jumpToMonitor(record)"
							>监控查询</a
						>
					</a-space>
					<template
						slot="operation"
						slot-scope="text, record, index"
					>
						<a-space>
							<a-popconfirm
								title="确定删除该条运输信息?"
								okText="确定"
								cancelText="取消"
								@confirm="onDelete(record, index)"
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
			<CheckPort
				ref="checkPort"
				@selectPort="selectPort"
			></CheckPort>
		</div>
	</div>
</template>

<script>
import { API_getDeliverGetRpcShip, API_GetShipTrackFlag, API_checkUsedInMonitor } from '@/v2/center/trade/api/receive';
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import CheckPort from './CheckPort';
import moment from 'moment';

export default {
	name: 'shipInfo',
	components: {
		CheckPort
	},
	props: {
		dataSource: {
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
		received: {
			type: Boolean,
			default: function () {
				return false;
			}
		},
		status: {
			//发货信息状态
			type: Number,
			default: function () {
				return 0;
			}
		},
		deliverId: {
			type: String,
			default: function () {
				return '';
			}
		}
	},
	watch: {
		dataSource: function (data) {
			this.form.tableDataSource = data;
		}
	},
	data() {
		return {
			columns: [
				{
					title: '船舶MMSI',
					dataIndex: 'identifierNo',
					scopedSlots: { customRender: 'identifierNo' },
					width: 150
				},
				{
					title: '船舶名称',
					dataIndex: 'shipName',
					scopedSlots: { customRender: 'shipName' }
				},
				{
					title: '装货量（吨）',
					dataIndex: 'deliverQuantity',
					scopedSlots: { customRender: 'deliverQuantity' }
				},
				{
					title: '航次号',
					dataIndex: 'voyageNo',
					scopedSlots: { customRender: 'voyageNo' }
				},
				{
					title: '始发港',
					dataIndex: 'originPortName',
					scopedSlots: { customRender: 'originPortName' }
				},
				{
					title: '到达始发港时间',
					dataIndex: 'originPortInTime',
					scopedSlots: { customRender: 'originPortInTime' }
				},
				{
					title: '目的港',
					dataIndex: 'destinationPortName',
					scopedSlots: { customRender: 'destinationPortName' }
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			modifyStatus: false,
			shipInfoform: this.$form.createForm(this),
			filterCodeByTextName: filterCodeByTextName,
			originPortInTimeData: [],
			shipId: '', // 船舶id
			beforeIdentifierNo: '',
			beforeOriginPort: '',
			beforeDestinatioPort: '',
			tableDataSource: this.dataSource,
			record: {}, // 编辑的对象
			form: {
				tableDataSource: []
			},
			mapIndex: {}, //记录选择地图时，所对应的数据
			rules: {
				identifierNo: [
					{
						required: true,
						message: '船舶MMSI必填',
						trigger: ['change', 'blur']
					},
					{ pattern: /^\d{9}$/, message: '请录入正确的九位MMSI码' }
				],
				deliverQuantity: [
					{ required: false, message: '装货量必填', trigger: ['change', 'blur'] },
					{ pattern: /^\d+(\.\d{0,3})?$/, message: '正数，最多精确到小数点后三位小数' },
					{ validator: this.validDeliverQuantity }
				],
				voyageNo: [{ pattern: /^.{0,30}$/, message: '最大输入30个字符' }],
				originPortName: [
					{
						required: true,
						message: '始发港必填',
						trigger: ['change']
					}
				],
				originPortInTime: [
					{
						required: true,
						message: '到达时间必填',
						trigger: ['change', 'blur']
					}
				],
				destinationPortName: [
					{
						required: true,
						message: '目的港必填',
						trigger: ['change']
					}
				],
				destinationPortInTime: [
					{
						required: this.$route.query.from,
						message: '目的港必填',
						trigger: ['change', 'blur']
					}
				],
				arrived: [{ required: true, message: '是否到达目的港必填' }]
			},
			editKey: [],
			isReceive: this.$route.query.from === 'receive',
			isDetail: this.$route.fullPath.includes('detail')
		};
	},
	mounted() {
		if (this.disabled) {
			this.columns = this.columns.filter(item => {
				return item.dataIndex != 'operation';
			});
			if (this.isReceive) {
				//如果时收货查看
				this.columns.push(
					{ title: '到达目的港时间', dataIndex: 'destinationPortInTime', scopedSlots: { customRender: 'destinationPortInTime' } },
					{ title: '是否到达目的港', dataIndex: 'arrived', align: 'center', scopedSlots: { customRender: 'arrived' } },
					{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
				);
			} else if ([2, 3, 4, 13].includes(this.status)) {
				//如果时发货查看，状态为待收货(2,3)和已收货的有操作列
				this.columns.push({
					title: '操作',
					dataIndex: 'action',
					scopedSlots: { customRender: 'action' }
				});
			}
			this.form.tableDataSource = this.dataSource;
		}
	},
	methods: {
		moment,
		validDeliverQuantity(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (value > 99999999) {
				callback('装货量不能大于99999999');
			}
			callback();
		},
		blurMMSI(record) {
			const identifierNo = record.identifierNo;
			this.handleSubmit();
			let reg = /^\d{9}$/;
			if (reg.test(identifierNo)) {
				record.shipName = '';
				API_getDeliverGetRpcShip({ mmsi: identifierNo }).then(res => {
					if (res.success) {
						this.shipId = res.result.shipId;
						record.shipName = res.result.shipName;
					}
				});
			}
		},
		//选择始发港和目的港
		checkPort(index, type) {
			let circle = {};
			this.mapIndex = index;
			let data = this.form.tableDataSource[index];
			if (type == 'origin') {
				//如果是始发港，获取始发港地址信息
				circle = {
					name: data.originPortName,
					address: data.originPortDetailAddress,
					lat: data.originPortLat,
					lon: data.originPortLon,
					radius: data.originPortElectronicFenceRadius || 5,
					type
				};
			} else if (type == 'destination') {
				//如果是目的港，获取目的港地址信息
				circle = {
					name: data.destinationPortName,
					address: data.destinationPortDetailAddress,
					lat: data.destinationPortLat,
					lon: data.destinationPortLon,
					radius: data.destinationPortElectronicFenceRadius || 5,
					type
				};
			}
			this.$refs.checkPort.show(circle);
		},
		//选择港口
		selectPort(port) {
			let index = this.mapIndex;
			let data = this.form.tableDataSource[index];
			//如果类型是始发港
			if (port.type == 'origin') {
				data = {
					...data,
					originPortName: port.name,
					originPortDetailAddress: port.address,
					originPortLat: port.lat,
					originPortLon: port.lon,
					originPortElectronicFenceRadius: port.radius
				};
			} else if (port.type == 'destination') {
				data = {
					...data,
					destinationPortName: port.name,
					destinationPortDetailAddress: port.address,
					destinationPortLat: port.lat,
					destinationPortLon: port.lon,
					destinationPortElectronicFenceRadius: port.radius
				};
			}
			this.$set(this.form.tableDataSource, index, data);
			this.handleSubmit();
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
		// 到达始发港时间限制
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		disabledDateTime(date) {
			// 选中的时间
			const choosetime = moment(date).format('HH-mm-ss');
			const chooseday = parseInt(moment(date).format('YYYY-MM-DD').split('-')[2]);
			const chooseh = parseInt(choosetime.split('-')[0]);
			// 当前时间
			const nowtime = moment().format('HH-mm-ss');
			const day = parseInt(moment().format('YYYY-MM-DD').split('-')[2]);
			const h = parseInt(nowtime.split('-')[0]);
			const m = parseInt(nowtime.split('-')[1]);
			return {
				disabledHours: () => this.rangeHours(0, 24, h, chooseday, day),
				disabledMinutes: () => this.rangeMinutes(0, 60, m, chooseday, day, chooseh, h)
			};
		},
		// 到达目的港时间限制
		disabledEndDate(record, endValue) {
			const startValue = record.originPortInTime;
			if (!endValue || !startValue) {
				return false;
			}
			return (
				endValue &&
				(moment(endValue).format('YYYY-MM-DD') < moment(record.originPortInTime).format('YYYY-MM-DD') ||
					moment(endValue).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD'))
			);
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
			if (moment(date).format('YYYY-MM-DD') === moment(record.originPortInTime).format('YYYY-MM-DD')) {
				const nowtime = moment(record.originPortInTime).format('HH-mm-ss');
				const day = parseInt(moment(record.originPortInTime).format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours1(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes1(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
		},
		setStyle(dataSource) {
			return dataSource.length % 2 == 0 ? 'cover-bar' : 'white-bar';
		},
		// -------
		// -------
		jumpToShipTail(record) {
			// 船运轨迹优化，收货前后均可查看物流轨迹
			API_GetShipTrackFlag({
				deliveryId: this.deliverId,
				mmsi: record.identifierNo
			}).then(res => {
				if (res.success) {
					window.open(
						'/logistics/LogisticsDetailShip?mmsi=' +
							record.identifierNo +
							'&shipName=' +
							record.shipName +
							'&deliveryId=' +
							this.deliverId +
							'&type=historyLocation'
					);
				} else {
					this.$message.error(res.message || '');
				}
			});
		},
		//监控查询
		jumpToMonitor(record) {
			window.open(
				'/logistics/monitoringShip?mmsi=' + record.identifierNo + '&deliveryId=' + this.deliverId + '&shipId=' + record.id
			);
		},
		changeArrived(record, val) {
			if (!val.target.value) {
				record.destinationPortInTime = undefined;
			}
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
		addShipInfo() {
			let obj = {
				key: new Date().getTime(),
				identifierNo: undefined,
				shipName: undefined,
				voyageNo: undefined,
				deliverQuantity: undefined,
				originPortName: undefined,
				originPortInTime: undefined,
				destinationPortName: undefined
			};
			this.editKey.push(obj.key);
			this.form.tableDataSource.push(obj);
		},
		onDelete(data, key) {
			if (!data.id) {
				this.form.tableDataSource = this.form.tableDataSource.filter((item, index) => index !== key);
				this.$message.success('删除成功');
				return;
			}
			API_checkUsedInMonitor(data.id).then(({ success, data }) => {
				if (!success) {
					return;
				}
				if (!data) {
					this.$message.error('该船舶尚未结束监控，请前往数链APP中申请结束监控并审核通过后再进行删除');
					return;
				}
				this.form.tableDataSource = this.form.tableDataSource.filter((item, index) => index !== key);
				this.$message.success('删除成功');
			});
		},
		hide() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					this.editKey = [];
				} else {
					return false;
				}
			});
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

.modal-ship-info {
	::v-deep.ant-modal-content {
		width: 560px !important;
	}

	::v-deep.ant-form-item-label {
		width: 120px !important;
		display: inline-block;
		text-align: right;
	}

	::v-deep.row {
		margin-bottom: 18px;
	}

	::v-deep.ant-form-explain {
		position: absolute !important;
	}

	::v-deep.ant-form-item-with-help {
		margin-bottom: 0px;
	}

	input {
		width: 300px;
	}

	::v-deep.ant-select {
		width: 300px;
	}

	::v-deep.ant-calendar-picker {
		width: 300px;
	}

	::v-deep.ant-modal-body {
		padding: 12px 24px;
	}

	::v-deep.ant-modal-header {
		padding: 12px 24px;
	}
}

.line {
	padding: 0 10px;
}
/deep/ .ant-form-explain {
	position: absolute;
}
/deep/ .ant-table-body {
	overflow-y: hidden;
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

/deep/ [key='shipName'] .ant-table-column-title,
/deep/ [key='voyageNo'] .ant-table-column-title,
/deep/ [key='operation'] .ant-table-column-title,
/deep/ [key='action'] .ant-table-column-title {
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
/deep/.ant-table-fixed td,
/deep/.ant-table-fixed th {
	white-space: nowrap;
}
/deep/ .cover-bar ::-webkit-scrollbar {
	background: #f3f5f6;
}
/deep/ .ant-table-tbody > tr > td {
	padding: 12px 16px !important;
}
</style>
