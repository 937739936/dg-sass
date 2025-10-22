<template>
	<div id="shipInfo">
		<div class="title"><i class="title_icon"></i>船舶信息</div>
		<div class="train-times-wrap">
			<a-form :form="form">
				<a-table
					:dataSource="tableDataSource"
					:columns="columnsShip"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
					:scroll="{ x: true }"
				>
					<span slot="customTitles"
						><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
						>是否到达目的港</span
					>
					<template
						slot="flagVal"
						slot-scope="text, record, index"
					>
						<a-form-item
							:validate-status="getFieldStatus(record.id, record.flag).validateStatus"
							:help="getFieldStatus(record.id, record.flag).errorMsg"
						>
							<a-radio-group
								v-model="record.flag"
								@change="handleFlagChange(record.flag, record, index)"
							>
								<a-radio :value="1">是</a-radio>
								<a-radio :value="2">否</a-radio>
							</a-radio-group>
						</a-form-item>
					</template>
					<span
						slot="operation"
						slot-scope="text, record"
					>
						<!-- 业务类型为其他时展示轨迹信息 -->
						<template v-if="businessType != 'OTHER'">
							<a
								href="javascript:;"
								@click="jumpToShipTail(record)"
								>轨迹查询</a
							>
						</template>
					</span>
				</a-table>
			</a-form>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="请补录到达目的港时间"
				centered
				v-model="modalShipInfoIsShow"
				okText="提交"
				cancelText="取消"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="modal-ship-info"
			>
				<a-form
					:form="shipInfoform"
					@submit="modalFormSubmit"
					layout="inline"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="船舶MMSI"
								:colon="true"
							>
								<a-input
									disabled
									v-decorator="['identifierNo']"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="船舶名称"
								:colon="false"
							>
								<a-input
									v-decorator="['shipName']"
									disabled
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="装货量(吨)"
								:colon="true"
							>
								<a-input
									disabled
									v-decorator="['deliverQuantity']"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="航次号"
								:colon="true"
							>
								<a-input
									disabled
									v-decorator="['voyageNo']"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="始发港"
								:colon="true"
							>
								<a-input
									disabled
									v-decorator="['originPortName']"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="到达始发港时间"
								:colon="true"
							>
								<a-input
									disabled
									v-decorator="['originPortInTime']"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="目的港"
								:colon="true"
							>
								<a-select
									disabled
									placeholder="船舶目的港口名称"
									v-decorator="['destinationPortName']"
									@select="v => handleEndPortSelect(v, 'end')"
								>
									<a-select-option
										v-for="item in destinationPortNameList"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="到达目的港时间"
								:colon="true"
							>
								<a-date-picker
									v-if="!destinationPortInTimeData.length || destinationPortInTimeData.length === 1"
									:show-time="{ format: 'HH:mm' }"
									format="YYYY-MM-DD HH:mm"
									:getCalendarContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									:disabled-date="disabledDate"
									:disabled-time="disabledDateTime"
									placeholder="请选择到达目的港时间"
									v-decorator="[
										'destinationPortInTime',
										{
											validateTrigger: 'change',
											rules: [{ required: true, message: '请选择到达目的港时间' }, { validator: validateTime }]
										}
									]"
									:disabled="!Boolean(shipInfoform.getFieldValue('destinationPortName'))"
									@focus="destinationPortInTimeFocus"
								/>
								<a-select
									v-else
									:allowClear="true"
									:getPopupContainer="
										triggerNode => {
											return triggerNode.parentNode || document.body;
										}
									"
									placeholder="请选择到达目的港时间"
									v-decorator="[
										'destinationPortInTime',
										{
											validateTrigger: 'change',
											rules: [{ required: true, message: '请选择到达目的港时间' }, { validator: validateTime }]
										}
									]"
									show-search
									:default-active-first-option="false"
									:filter-option="false"
									@focus="destinationPortInTimeFocus"
								>
									<a-select-option
										v-for="item in destinationPortInTimeData"
										:key="item"
										:title="item"
										>{{ item }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
				<p style="color: red">温馨提示：如果确认船已到达目的港，请选择或录入到达目的港时间</p>
			</a-modal>
		</div>
	</div>
</template>

<script>
import { API_GetPortTimeList } from '@/v2/center/trade/api/receive';
import moment from 'moment';
import { debounce } from 'lodash';
export default {
	name: 'shipInfo',
	props: {
		dataSource: {
			type: Array,
			default: function () {
				return [];
			}
		},
		businessType: {
			type: String,
			default: ''
		}
	},
	watch: {
		dataSource: function (data) {
			// 发运信息补录切换合同，船舶信息更新
			this.tableDataSource = data;
		}
	},
	computed: {},
	data() {
		return {
			columnsShip: [
				{ title: '船舶名称', dataIndex: 'shipName' },
				{ title: '船舶MMSI', dataIndex: 'identifierNo' },
				{ title: '装货量（吨）', dataIndex: 'deliverQuantity' },
				{ title: '航次号', dataIndex: 'voyageNo' },
				{ title: '始发港', dataIndex: 'originPortName' },
				{ title: '到达始发港时间', dataIndex: 'originPortInTime' },
				{ title: '目的港', dataIndex: 'destinationPortName' },
				{ title: '到达目的港时间', dataIndex: 'destinationPortInTime' },
				{
					slots: { title: 'customTitles' },
					dataIndex: 'flagVal',
					key: 'flagVal',
					scopedSlots: {
						customRender: 'flagVal'
					}
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					fixed: 'right'
				}
			],
			modalShipInfoIsShow: false,
			modifyIndex: 0,
			shipInfoform: this.$form.createForm(this),
			destinationPortNameList: [],
			destinationPortInTimeData: [],
			beforeDestinatioPort: '',
			tableDataSource: this.dataSource,
			record: {}, // 编辑的对象
			form: this.$form.createForm(this)
		};
	},
	methods: {
		moment,
		editShipInfo: function (record, index) {
			this.record = record;
			this.modalShipInfoIsShow = true;
			this.modifyIndex = index;
			(this.destinationPortNameList = []),
				(this.destinationPortInTimeData = []),
				this.$nextTick(() => {
					if (typeof record.key != 'undefined') {
						// 编辑时恢复数据
						this.shipInfoform.setFieldsValue({
							...record
						});
						if (record.destinationPortName) this.handleEndPortSelect(record.destinationPortName, 'first');
					}
				});
		},
		modalFormSubmit: debounce(function (e) {
			e.preventDefault();
			this.shipInfoform.validateFields((err, values) => {
				if (!err) {
					if (values.destinationPortInTime) {
						values.destinationPortInTime =
							typeof values.destinationPortInTime === 'object'
								? values.destinationPortInTime.format('YYYY-MM-DD HH:mm')
								: values.destinationPortInTime;
					}
					let obj = {
						...values,
						key: new Date().getTime(),
						flag: 1,
						id: this.record.id
					};
					this.tableDataSource.splice(this.modifyIndex, 1, obj);
					this.modalShipInfoIsShow = false;
					this.shipInfoform.resetFields();
				}
			});
		}),
		modalCancel: function () {
			this.modifyStatus = false;
			this.shipInfoform.resetFields();
		},

		handleEndPortSelect(val, type) {
			// 选中到达港口名称,获取到达时间数据
			// 到达港每换一个新值，就清除到达港时间
			if (val != this.beforeDestinatioPort) {
				this.shipInfoform.setFieldsValue({ destinationPortInTime: null });
			}
			API_GetPortTimeList({
				portName: val,
				mmsi: this.shipInfoform.getFieldValue('identifierNo')
			}).then(res => {
				this.destinationPortInTimeData = res.result;
				if (this.destinationPortInTimeData.length === 1) {
					let flag = true;
					if (this.shipInfoform.getFieldValue('originPortInTime')) {
						let start = new Date(this.shipInfoform.getFieldValue('originPortInTime')).getTime();
						let end = new Date(this.destinationPortInTimeData[0]).getTime();
						if (start >= end) {
							flag = false;
						}
					}
					if (flag) {
						this.shipInfoform.setFieldsValue({ destinationPortInTime: this.destinationPortInTimeData[0] });
					}
				}
				if (type == 'first') {
					// 编辑首次进入恢复默认值
					this.shipInfoform.setFieldsValue({
						destinationPortInTime: this.record.destinationPortInTime
					});
				}
				this.beforeDestinatioPort = val;
			});
		},
		destinationPortInTimeFocus() {
			// 到达港时间获取焦点
			this.shipInfoform.validateFields(['destinationPortName'], err => {
				if (!err) {
				}
			});
		},
		validateTime(rule, value, callback) {
			// 校验时间，到达目的港时间必须大于到达始发港时间
			if (this.shipInfoform.getFieldValue('originPortInTime') && value) {
				let start = new Date(this.shipInfoform.getFieldValue('originPortInTime')).getTime();
				let end = new Date(value).getTime();
				if (start >= end) {
					callback('到达目的港时间必须大于到达始发港时间');
					return;
				} else {
					callback();
				}
			} else {
				callback();
			}
		},
		disabledDate(current) {
			// 小于等于当天日期，大于到达始发港时间
			return (
				current &&
				(moment(current).format('YYYY-MM-DD') < moment(this.record.originPortInTime).format('YYYY-MM-DD') ||
					moment(current).format('YYYY-MM-DD') > moment().format('YYYY-MM-DD'))
			);
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
		disabledDateTime(date) {
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
			if (moment(date).format('YYYY-MM-DD') === moment(this.record.originPortInTime).format('YYYY-MM-DD')) {
				const nowtime = moment(this.record.originPortInTime).format('HH-mm-ss');
				const day = parseInt(moment(this.record.originPortInTime).format('YYYY-MM-DD').split('-')[2]);
				const h = parseInt(nowtime.split('-')[0]);
				const m = parseInt(nowtime.split('-')[1]);
				return {
					disabledHours: () => this.rangeHours1(0, 24, h, chooseday, day),
					disabledMinutes: () => this.rangeMinutes1(0, 60, m, chooseday, day, chooseh, h),
					disabledSeconds: () => []
				};
			}
		},
		deleteTime(record, index) {
			this.tableDataSource.forEach((item, indent) => {
				if (index === indent) {
					item.destinationPortInTime = null;
				}
			});
		},
		getFieldStatus(id, val) {
			if (!val) {
				return {
					errorMsg: '',
					validateStatus: 'error'
				};
			} else {
				return {
					errorMsg: '',
					validateStatus: 'success'
				};
			}
		},
		handleFlagChange(value, record, index) {
			if (value == 1) {
				this.editShipInfo(record, index);
			} else {
				this.deleteTime(record, index);
			}
		},
		save() {
			// 外部父组件保存调用 error不传值
			let isPass = true;
			for (let i = 0; i < this.tableDataSource.length; i++) {
				let project = this.tableDataSource[i];
				for (let pro in project) {
					if (pro === 'flag') {
						if (this.getFieldStatus(pro, project.flag).validateStatus !== 'success') {
							isPass = isPass && false;
							break;
						} else {
							isPass = isPass && true;
						}
					}
				}
			}
			if (!isPass) {
				this.$message.error('请在【船舶信息】中选择是否到达目的港');
				return null;
			} else {
				let timeFlag = true;
				if (this.tableDataSource.length) {
					this.tableDataSource.forEach(item => {
						if (item.flag === 1) {
							if (!item.destinationPortInTime) {
								timeFlag = timeFlag && false;
							}
						}
					});
				}
				if (!timeFlag) {
					this.$message.error('到达目的港时间必选！');
					return null;
				} else {
					let shipList = [];
					if (this.tableDataSource.length) {
						this.tableDataSource.forEach(item => {
							let obj = {};
							obj.id = item.id;
							obj.arrived = item.flag === 1;
							obj.destinationPortInTime = item.destinationPortInTime;
							shipList.push(obj);
						});
					}
					return shipList;
				}
			}
		},
		jumpToShipTail(record) {
			this.$emit('jumpToShipTail', record);
		}
	}
};
</script>

<style lang="less">
#shipInfo {
	.remarks {
		color: #ff1515;
		font-size: 16px;
		padding-left: 44px;
	}
	.train-times-wrap {
		margin-bottom: 30px;
		font-size: 0;
	}
	.add-wrap {
		width: 100%;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;
		font-size: 14px;
		i {
			font-size: 20px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			position: relative;
			top: -2px;
		}
		&:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}
}
</style>
<style lang="less" scoped>
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
</style>
