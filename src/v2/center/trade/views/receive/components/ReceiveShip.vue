<template>
	<div id="shipInfo">
		<div class="train-times-wrap">
			<a-form-model
				ref="ruleForm"
				:model="form"
				:rules="rules"
				style="margin-bottom: 30px"
			>
				<a-table
					:dataSource="form.tableDataSource"
					:columns="columns"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
					:scroll="{ x: true }"
				>
					<template
						slot="operation"
						slot-scope="text, record, index"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							>轨迹查询</a
						>
					</template>
				</a-table>
			</a-form-model>
		</div>
	</div>
</template>

<script>
import { API_getDeliverGetRpcShip, API_GetPortList, API_GetPortTimeList } from '@/v2/center/trade/api/receive';
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import moment from 'moment';
import { debounce } from 'lodash';

export default {
	name: 'shipInfo',
	props: {
		freightPayType: {
			required: true,
			default: true
		},
		dataSource: {
			type: Array,
			default: function () {
				return [];
			}
		},
		disabled: {}
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
			columns: [
				{ title: '船舶MMSI', dataIndex: 'identifierNo' },
				{ title: '船舶名称', dataIndex: 'shipName' },
				{ title: '装货量（吨）', dataIndex: 'deliverQuantity' },
				{ title: '航次号', dataIndex: 'voyageNo' },
				{ title: '始发港', dataIndex: 'originPortName' },
				{ title: '到达始发港时间', dataIndex: 'originPortInTime' },
				{ title: '目的港', dataIndex: 'destinationPortName' },
				{ title: '到达目的港时间', dataIndex: 'destinationPortName', scopedSlots: { customRender: 'destinationPortName' } },
				{ title: '操作', scopedSlots: { customRender: 'operation' }, dataIndex: 'operation' }
			],
			modalShipInfoIsShow: false,
			modifyIndex: 0,
			modifyStatus: false,
			shipInfoform: this.$form.createForm(this),
			filterCodeByTextName: filterCodeByTextName,
			fetching: false,
			originPortNameList: [],
			originPortInTimeData: [],
			destinationPortNameList: [],
			shipId: '', // 船舶id
			beforeIdentifierNo: '',
			beforeOriginPort: '',
			beforeDestinatioPort: '',
			tableDataSource: this.dataSource,
			record: {}, // 编辑的对象
			form: {
				tableDataSource: [
					{
						identifierNo: 111
					}
				]
			},
			rules: {
				originPortName: [{ required: true, message: '始发港必填', trigger: 'change' }]
			},
			editKey: []
		};
	},
	methods: {
		moment,
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
		identifierNoBlur(record) {
			record.shipName = new Date();
		},
		completeRecord() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
				} else {
					return false;
				}
			});
		},
		// editShipInfo: function (record, index) {
		//   this.record = record;
		//   this.modalShipInfoIsShow = true;
		//   this.modifyIndex = index;
		//   (this.originPortNameList = []),
		//       (this.originPortInTimeData = []),
		//       (this.destinationPortNameList = []),
		//       this.$nextTick(() => {
		//         if (typeof record.key != "undefined") {
		//           this.modifyStatus = true;
		//           // 保留编辑前的mmsi、始发港、目的港
		//           this.beforeIdentifierNo = record.identifierNo;
		//           this.beforeOriginPort = record.originPortName;
		//           this.beforeDestinatioPort = record.destinationPortName;
		//           // 编辑时恢复数据
		//           this.shipInfoform.setFieldsValue({
		//             ...record,
		//           });
		//           this.shipId = record.shipId;
		//           if (record.originPortName) this.handleStartPortSelect(record.originPortName, "first");
		//           if (record.destinationPortName) this.handleEndPortSelect(record.destinationPortName, "first");
		//         }
		//       });
		// },
		modalFormSubmit: debounce(function (e) {
			e.preventDefault();
			this.shipInfoform.validateFields((err, values) => {
				if (!err) {
					if (values.originPortName === values.destinationPortName) {
						this.$message.error('始发港与目的港不能相同！');
						return;
					}
					values.originPortInTime =
						typeof values.originPortInTime === 'object'
							? values.originPortInTime.format('YYYY-MM-DD HH:mm')
							: values.originPortInTime;
					if (values.destinationPortInTime) {
						values.destinationPortInTime =
							typeof values.destinationPortInTime === 'object'
								? values.destinationPortInTime.format('YYYY-MM-DD HH:mm')
								: values.destinationPortInTime;
					}
					values.shipId = this.shipId;
					let obj = {
						...values,
						key: new Date().getTime()
					};
					API_getDeliverGetRpcShip({
						mmsi: values.identifierNo
					}).then(res => {
						if (res.result) {
							obj.shipName = res.result && res.result.shipName;
							this.shipInfoform.setFieldsValue({
								shipName: res.result.shipName
							});
							if (!this.modifyStatus) {
								this.$message.success('添加成功');
								this.tableDataSource.push(obj);
							} else {
								this.$message.success('修改成功');
								this.tableDataSource.splice(this.modifyIndex, 1, obj);
							}
							this.modifyStatus = false;
							this.modalShipInfoIsShow = false;
							this.shipInfoform.resetFields();
							this.$emit('dataSource', this.tableDataSource);
						}
					});
				}
			});
		}),
		modalCancel: function () {
			this.modifyStatus = false;
			this.shipInfoform.resetFields();
		},
		onDelete: function (key) {
			const dataSource = [...this.form.tableDataSource];
			this.form.tableDataSource = dataSource.filter(item => item.key !== key);
			this.$message.success('删除成功');
			this.$emit('dataSource', this.form.tableDataSource);
		},
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

		validateMMSI(rule, value, callback) {
			// 船舶真实性检查，返回船舶名称
			let passFlag = true;
			if (this.tableDataSource.length > 0) {
				this.tableDataSource.forEach(item => {
					if (this.modifyStatus) {
						if (item.identifierNo != this.beforeIdentifierNo) {
							passFlag = passFlag && !(item.identifierNo == value);
						}
					} else {
						passFlag = passFlag && !(item.identifierNo == value);
					}
				});
			}
			if (!passFlag) {
				callback('当前发货批次下已添加该船舶，无法重复添加');
				return;
			}
			callback();
		},
		blurMMSI(record) {
			const identifierNo = record.identifierNo;
			let reg = /^\d{9}$/;
			if (reg.test(identifierNo)) {
				record.shipName = '';
				API_getDeliverGetRpcShip({ mmsi: identifierNo }).then(res => {
					if (res.success) {
						this.shipId = res.result.shipId;
						record.shipName = res.result.shipName;
						// 编辑时若修改了mmsi,则所有值重置
						if (this.modifyStatus) {
							if (identifierNo != this.beforeIdentifierNo) {
								this.shipInfoform.setFieldsValue({
									originPortName: null,
									originPortInTime: null,
									destinationPortName: null,
									destinationPortInTime: null
								});
							}
						}
					}
				});
			}
		},

		handleStartPortSearch: debounce(function (name) {
			//获取始发港口名称
			this.shipInfoform.validateFields(['identifierNo'], err => {
				if (!err) {
					if (name && name.length > 100) {
						this.$message.error('始发港名城不能超过100个字符！');
						return;
					}
					this.fetching = true;
					API_GetPortList({
						keyword: name
					}).then(res => {
						this.fetching = false;
						this.originPortNameList = [];
						this.originPortNameList = res.result || [];
						if (!this.originPortNameList.length) {
							this.originPortNameList.unshift(name);
						} else {
							let flag = true;
							this.originPortNameList.forEach(item => {
								flag = flag && item != name;
							});
							if (flag) {
								this.originPortNameList.unshift(name);
							}
						}
					});
				}
			});
		}),
		handleStartPortSelect(record, type) {
			// 选中始发港口名称,获取到达始发港时间数据
			// 始发港每换一个新值，就清除始发港时间
			if (record.originPortInTime != this.beforeOriginPort) {
				record.originPortInTime = null;
			}
			API_GetPortTimeList({
				portName: record.originPortName,
				mmsi: record.identifierNo
			}).then(res => {
				this.originPortInTimeData = res.result;
				if (this.originPortInTimeData.length === 1) {
					let flag = true;
					if (record.destinationPortInTime) {
						let start = new Date(this.originPortInTimeData[0]).getTime();
						let end = new Date(record.destinationPortInTime.getTime());
						if (start >= end) {
							flag = false;
						}
					}
					if (flag) {
						record.originPortInTime = this.originPortInTimeData[0];
					}
				}
				if (this.modifyStatus && type == 'first') {
					// 编辑首次进入恢复默认值
					this.shipInfoform.setFieldsValue({
						originPortInTime: this.record.originPortInTime
					});
				}
				this.beforeOriginPort = record.originPortInTime;
			});
		},
		originPortInTimeFocus() {
			// 到达港时间获取焦点
			this.shipInfoform.validateFields(['originPortName'], err => {
				if (!err) {
					console.log('success');
				}
			});
		},
		handleEndPortSearch(name) {
			//获取到达港口名称
			this.shipInfoform.validateFields(['identifierNo', 'originPortName', 'originPortInTime'], err => {
				if (!err) {
					if (name && name.length > 100) {
						this.$message.error('目的港名称不能超过100个字符！');
						return;
					}
					this.fetching = true;
					API_GetPortList({
						keyword: name
					}).then(res => {
						this.fetching = false;
						this.destinationPortNameList = [];
						this.destinationPortNameList = res.result || [];
						if (!this.destinationPortNameList.length) {
							this.destinationPortNameList.unshift(name);
						} else {
							let flag = true;
							this.destinationPortNameList.forEach(item => {
								flag = flag && item != name;
							});
							if (flag) {
								this.destinationPortNameList.unshift(name);
							}
						}
					});
				}
			});
		},
		disabledDate(current) {
			// 收货日期大于等于该批次的发货日期且小于等于当天日期
			return current && current > moment().endOf('day');
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

.train-times-wrap {
	margin-top: 20px;
	font-size: 0;
	/deep/ .ant-form-item {
		//margin-bottom: 0;
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
/deep/ .ant-table-column-title {
	&:before {
		content: '*';
		float: left;
		font-size: 14px;
		display: block;
		color: #f65927;
		margin-right: 4px;
	}
}
/deep/ [key='shipName'] .ant-table-column-title {
	&:before {
		display: none;
	}
}
/deep/ [key='voyageNo'] .ant-table-column-title {
	&:before {
		display: none;
	}
}
</style>
