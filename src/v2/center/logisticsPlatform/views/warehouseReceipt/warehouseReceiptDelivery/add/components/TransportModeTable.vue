<template>
	<div>
		<a-form-model
			v-if="this.selectTransportMode"
			:form="form"
			ref="ruleForm"
			class="slFormDetail"
			:model="formModel"
			:rules="rules"
		>
			<a-table
				v-if="!(isAutoMobile && !showAutomobileTable)"
				class="new-table"
				:dataSource="formModel.ladingTransInfoList"
				:columns="columns"
				:pagination="false"
			>
				<template slot="shipNoTitle">
					<span class="requiredTableTitle">*</span>
					<span>船舶MMSI</span>
				</template>
				<template
					slot="shipNo"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'ladingTransInfoList.' + index + '.shipNo'"
						:rules="rules.shipNo"
						:labelCol="{ span: 8 }"
					>
						<a-input
							placeholder="请输入船舶MMSI"
							:maxLength="255"
							style="width: 250px"
							v-model="record.shipNo"
							@blur="blurMMSI(record)"
						/>
					</a-form-model-item>
				</template>
				<template
					slot="shipName"
					slot-scope="shipName"
				>
					<a-form-model-item>
						<span>{{ shipName }}</span>
					</a-form-model-item>
				</template>

				<template slot="deliveryStationTitle">
					<span class="requiredTableTitle">*</span>
					<span>发站</span>
				</template>
				<template
					slot="deliveryStation"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'ladingTransInfoList.' + index + '.deliveryStation'"
						:rules="rules.deliveryStation"
						:labelCol="{ span: 8 }"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="record.deliveryStation && record.deliveryStation.length > 0"
							>
								<span>{{ record.deliveryStation }}</span>
							</template>

							<a-input
								placeholder="请输入发站"
								:maxLength="255"
								style="width: 180px"
								v-model="record.deliveryStation"
							/>
						</a-tooltip>
					</a-form-model-item>
				</template>

				<template slot="arriveStationTitle">
					<span class="requiredTableTitle">*</span>
					<span>到站</span>
				</template>
				<template
					slot="arriveStation"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'ladingTransInfoList.' + index + '.arriveStation'"
						:rules="rules.arriveStation"
						:labelCol="{ span: 8 }"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="record.arriveStation && record.arriveStation.length > 0"
							>
								<span>{{ record.arriveStation }}</span>
							</template>
							<a-input
								placeholder="请输入到站"
								:maxLength="255"
								style="width: 180px"
								v-model="record.arriveStation"
							/>
						</a-tooltip>
					</a-form-model-item>
				</template>

				<template
					slot="receiverName"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'ladingTransInfoList.' + index + '.receiverName'"
						:rules="rules.receiverName"
						:labelCol="{ span: 8 }"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="record.receiverName && record.receiverName.length > 0"
							>
								<span>{{ record.receiverName }}</span>
							</template>
							<a-input
								placeholder="请输入收货人"
								:maxLength="255"
								style="width: 180px"
								v-model="record.receiverName"
							/>
						</a-tooltip>
					</a-form-model-item>
				</template>

				<template
					slot="shipperName"
					slot-scope="text, record, index"
				>
					<a-form-model-item
						:prop="'ladingTransInfoList.' + index + '.shipperName'"
						:rules="rules.shipperName"
						:labelCol="{ span: 8 }"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="record.shipperName && record.shipperName.length > 0"
							>
								<span>{{ record.shipperName }}</span>
							</template>
							<a-input
								placeholder="请输入托运人"
								:maxLength="255"
								style="width: 180px"
								v-model="record.shipperName"
							/>
						</a-tooltip>
					</a-form-model-item>
				</template>

				<div
					slot="action"
					slot-scope="action, record, index"
				>
					<!-- 待提交 -->
					<template>
						<a-space :size="24">
							<a
								v-if="!isAutoMobile"
								href="javascript:void(0)"
								@click="addTransItem()"
								>新增</a
							>
							<a-popconfirm
								v-if="isAutoMobile || index != 0"
								title="确认删除该条信息？"
								placement="topRight"
								@confirm="deleteTransItem(index)"
							>
								<a href="#">删除</a>
							</a-popconfirm>
						</a-space>
					</template>
				</div>
			</a-table>
		</a-form-model>
	</div>
</template>

<script>
import { API_getDeliverGetRpcShip } from '@/v2/center/trade/api/receive';
export default {
	name: 'TransportModeTable',
	props: {
		// 新建 放货指令 无需填写车牌号信息
		showAutomobileTable: {
			type: Boolean,
			default: true
		},
		transportModeInfo: {
			type: Object,
			default: () => {
				return {
					selectTransportMode: undefined,
					oldLadingTransInfoList: []
				};
			}
		}
	},
	data() {
		return {
			form: this.$form.createForm(this),
			formModel: {
				ladingTransInfoList: []
			},
			columns: [],
			rules: {
				shipNo: [
					{
						required: true,
						message: '船舶MMSI必填',
						trigger: ['change', 'blur']
					},
					{ pattern: /^\d{9}$/, message: '请录入正确的九位MMSI码' }
				]
			}
		};
	},
	computed: {
		transportModeInfoProps: function () {
			return this.transportModeInfo;
		},
		selectTransportMode: function () {
			return this.transportModeInfoProps.selectTransportMode;
		},
		isAutoMobile: function () {
			return this.selectTransportMode == 'AUTOMOBILE';
		}
		// propsLadingTransInfoList: function () {
		//   return this.oldLadingTransInfoList ?? [];
		// },
	},
	watch: {
		transportModeInfoProps: {
			immediate: true,
			handler(newTransportMode) {
				this.configTransportColumnsAndDataSource(newTransportMode.selectTransportMode, [
					...newTransportMode.oldLadingTransInfoList
				]);
			}
		}
	},
	methods: {
		configTransportColumnsAndDataSource(newTransportMode, oldList) {
			// 为什么抽成方法因为在初始化数据时selectTransportMode的监听会在 ladingTransInfoList之后
			let columns = [];
			let ladingTransInfoList = [];
			let rules = {};
			if (newTransportMode == 'AUTOMOBILE') {
				columns = carColumns;
			} else if (newTransportMode == 'TRAIN') {
				columns = trainColumns;
				ladingTransInfoList = [
					{
						deliveryStation: '',
						arriveStation: '',
						receiverName: '',
						shipperName: ''
					}
				];
				rules = {
					deliveryStation: [
						{
							required: true,
							message: '发站必填',
							trigger: ['blur']
						}
					],
					arriveStation: [
						{
							required: true,
							message: '到站必填',
							trigger: ['blur']
						}
					]
				};
			} else if (newTransportMode == 'SHIP') {
				rules = {
					shipNo: [
						{
							required: true,
							message: '船舶MMSI必填',
							trigger: ['change', 'blur']
						},
						{ pattern: /^\d{9}$/, message: '请录入正确的九位MMSI码' }
					]
				};
				columns = shipColumns;
				ladingTransInfoList = [
					{
						shipNo: '',
						shipName: ''
					}
				];
			}
			if (oldList.length > 0) {
				ladingTransInfoList = oldList;
			}
			this.rules = rules;
			this.columns = columns;
			this.formModel = { ladingTransInfoList };
		},
		addCarItems(inputCarNumber) {
			// 新增运输方式条目
			let inputCarNumberString = inputCarNumber.replaceAll('，', ',').toUpperCase();

			let ladingTransInfoList = [...this.formModel.ladingTransInfoList];
			let carNumberList = inputCarNumberString.split(',');
			for (const item of carNumberList) {
				var carNumber = item.trim();
				let isContain = false;
				ladingTransInfoList.map(carInfo => {
					if (carInfo.plateNumber == carNumber) {
						isContain = true;
					}
				});
				if (isContain) {
					// return;
					continue;
				}
				let isT =
					/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(
						carNumber
					);
				if (isT) {
					ladingTransInfoList.push({
						plateNumber: carNumber,
						transType: this.selectTransportMode
					});
				} else {
					// this.$message.error(`${carNumber}车牌格式不正确`);
				}
			}
			this.formModel.ladingTransInfoList = ladingTransInfoList;
		},
		addTransItem() {
			let newItem;
			// 新增运输方式条目
			if (this.selectTransportMode == 'TRAIN') {
				newItem = {
					deliveryStation: '',
					arriveStation: '',
					receiverName: '',
					shipperName: '',
					transType: this.selectTransportMode
				};
			} else if (this.selectTransportMode == 'SHIP') {
				newItem = {
					shipNo: '',
					shipName: '',
					transType: this.selectTransportMode
				};
			}
			let ladingTransInfoList = this.formModel.ladingTransInfoList;
			ladingTransInfoList.push(newItem);
			this.formModel.ladingTransInfoList = ladingTransInfoList;
		},
		deleteTransItem(index) {
			// 删除运输方式条目
			let ladingTransInfoList = this.formModel.ladingTransInfoList;
			ladingTransInfoList.splice(index, 1);
			this.formModel.ladingTransInfoList = ladingTransInfoList;
		},
		blurMMSI(record) {
			const shipNo = record.shipNo;
			let reg = /^\d{9}$/;
			if (reg.test(shipNo)) {
				record.shipName = '';
				API_getDeliverGetRpcShip({ mmsi: shipNo }).then(res => {
					if (res.success) {
						this.shipId = res.result.shipId;
						record.shipName = res.result.shipName;
					}
				});
			}
		},
		async onValidateLadingTransInfoList() {
			return new Promise((resolve, reject) => {
				let ladingTransInfoList = this.formModel.ladingTransInfoList;
				if (this.isAutoMobile) {
					resolve(ladingTransInfoList);
					return;
				}
				// 校验并获取信息
				this.$refs.ruleForm.validate(isValid => {
					if (!isValid) {
						reject('运输信息存在错误');
					} else {
						resolve(ladingTransInfoList);
					}
				});
			});
		}
	}
};
// const TransportMode = [
//   { name: "汽运", value: "AUTOMOBILE" },
//   { name: "火运", value: "TRAIN" },
//   { name: "船运", value: "SHIP" },
// ];
const customRender = (t, r, index) => {
	return parseInt(index) + 1;
};
export const carColumns = [
	{ title: '序号', dataIndex: 'no', customRender },
	{
		title: '车牌号',
		dataIndex: 'plateNumber'
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 90,
		align: 'center',
		scopedSlots: { customRender: 'action' }
	}
];

export const trainColumns = [
	{ title: '序号', dataIndex: 'no', width: 116, customRender },
	{
		// title: "发站",
		dataIndex: 'deliveryStation',
		slots: { title: 'deliveryStationTitle' },
		scopedSlots: { customRender: 'deliveryStation' }
	},
	{
		// title: "到站",
		dataIndex: 'arriveStation',
		slots: { title: 'arriveStationTitle' },
		scopedSlots: { customRender: 'arriveStation' }
	},
	{
		title: '收货人',
		dataIndex: 'receiverName',
		scopedSlots: { customRender: 'receiverName' }
	},
	{
		title: '托运人',
		dataIndex: 'shipperName',
		scopedSlots: { customRender: 'shipperName' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		// fixed: "right",
		width: 130,
		scopedSlots: { customRender: 'action' }
	}
];

export const shipColumns = [
	{
		title: '序号',
		dataIndex: 'no',
		width: 116,
		customRender
	},
	{
		dataIndex: 'shipNo',
		slots: { title: 'shipNoTitle' },
		scopedSlots: { customRender: 'shipNo' },
		width: 500
	},
	{
		title: '船舶名称',
		dataIndex: 'shipName',
		scopedSlots: { customRender: 'shipName' }
		// width: 400,
	},
	{
		title: '操作',
		dataIndex: 'action',
		// fixed: "right",
		width: 130,
		scopedSlots: { customRender: 'action' }
	}
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.requiredTableTitle {
	color: #f5222d;
	margin-right: 2px;
}
.slFormDetail {
	padding: 0 !important;
	margin: 0 !important;
}
.new-table {
	margin-top: 0px;
	margin-bottom: 20px;
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 13px 20px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-last-child(1) {
		border-left: 1px solid #e5e6eb;
	}
}

/deep/ .ant-form-explain {
	position: absolute;
}
/deep/ .ant-form-item-control {
	line-height: 32px;
}
</style>
