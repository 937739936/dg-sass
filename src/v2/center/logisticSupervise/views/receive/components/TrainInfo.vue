<template>
	<div id="shipInfo">
		<div
			class="sub-title"
			:class="isReceive ? 'sub-title-small' : ''"
		>
			运输信息
			<!-- 业务类型为非其他时展示轨迹 -->
			<a-button
				v-if="deliverInfo.transInfo && deliverInfo.transInfo.waybillId"
				type="primary"
				ghost
				style="margin-left: 30px"
				@click.native="jumpToTail()"
				>查看运输轨迹</a-button
			>
			<a-button
				v-if="!disabled"
				@click="add"
				style="margin-left: 25px"
				type="primary"
				ghost
			>
				新增
			</a-button>
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
					:scroll="{ x: true }"
					class="new-table"
					:dataSource="form.tableDataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="(record, index) => index"
				>
					<template
						slot="transTicketNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							:prop="'tableDataSource.' + index + '.transTicketNo'"
							:rules="rules.transTicketNo"
							v-if="!disabled"
						>
							<a-input
								ref="transTicketNo"
								v-model="record.transTicketNo"
								@blur="handleSubmit"
								@change="e => handleTransTicketNoChange(e, record, index)"
							/>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="trainType"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="trainType"
							v-if="!disabled"
						>
							<a-input
								:maxLength="29"
								v-model="record.trainType"
							/>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="trainNo"
						slot-scope="text, record, index"
					>
						<a-form-model-item
							ref="trainNo"
							:prop="'tableDataSource.' + index + '.trainNo'"
							:rules="rules.trainNo"
							v-if="!disabled"
						>
							<a-input
								:maxLength="29"
								v-model="record.trainNo"
								@blur="handleSubmit"
							/>
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
							:rules="rules.deliverQuantity"
							v-if="!disabled"
						>
							<a-input-number
								style="width: 100%"
								v-model="record.deliverQuantity"
							/>
						</a-form-model-item>
						<div v-else>{{ text || '-' }}</div>
					</template>
					<template
						slot="operation"
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
		</div>
	</div>
</template>

<script>
import { filterCodeByTextName } from '@sub/utils/globalCode.js';
import moment from 'moment';
import { API_getRouteInfo } from '@/v2/center/trade/api/receive';
export default {
	name: 'transInfo',
	props: {
		dataSource: {
			type: Array,
			default: function () {
				return [];
			}
		},
		deliverInfo: {
			type: Object,
			default: function () {
				return {};
			}
		},
		disabled: {},
		firstTransTicketNo: {
			type: String,
			default: ''
		}
	},
	watch: {
		dataSource: function (data) {
			// 发运信息补录切换合同，船舶信息更新
			this.form.tableDataSource = data;
		}
	},
	computed: {},
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
		return {
			columns: [
				{ title: '运单号', dataIndex: 'transTicketNo', scopedSlots: { customRender: 'transTicketNo' } },
				{ title: '车种', dataIndex: 'trainType', scopedSlots: { customRender: 'trainType' } },
				{ title: '车号', dataIndex: 'trainNo', scopedSlots: { customRender: 'trainNo' } },
				{ title: '票重(吨)', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'deliverQuantity' } },
				{ title: '操作', scopedSlots: { customRender: 'operation' }, dataIndex: 'operation', width: 120 }
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
				tableDataSource: []
			},
			rules: {
				transTicketNo: [
					{ required: true, message: '运单号必填', trigger: ['change', 'blur'] },
					{ validator: validatePass, trigger: 'blur', max: 99999, msg: '运单号为12位或者13位' }
				],
				trainNo: [{ required: true, message: '车号必填', trigger: ['change', 'blur'] }],
				deliverQuantity: [{ pattern: /^\d{1,9}$|^\d{1,9}[.]\d{1,3}$/, message: '票重为数字，整数最多9位，小数最多3位' }]
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
		}
		this.form.tableDataSource = this.dataSource;
	},
	methods: {
		handleSubmit() {
			let val = false;
			new Promise((res, rej) => {
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						val = true;
					}
				});
			});
			return val;
		},
		moment,
		add() {
			var transTicketNo = undefined;
			if (this.form.tableDataSource.length == 0) {
				transTicketNo = this.firstTransTicketNo;
			}
			this.form.tableDataSource.push({
				transTicketNo: transTicketNo
			});
		},
		onDelete(key) {
			this.form.tableDataSource = this.form.tableDataSource.filter((item, index) => index !== key);
			this.$message.success('删除成功');
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
		jumpToTail() {
			API_getRouteInfo({ id: this.deliverInfo.transInfo.waybillId }).then(res => {
				if (res.success) {
					let hasPath = false;
					if (res.data) {
						for (let i = 0; i < res.data.length; i++) {
							if (res.data[i].waybillPhaseTraceInfoVO.length) {
								hasPath = true;
								break;
							}
						}
					}
					if (!hasPath) {
						this.$message.error('该运单暂无轨迹');
					} else {
						window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + this.deliverInfo.transInfo.waybillId);
					}
				}
			});
		},
		handleTransTicketNoChange(e, record, index) {
			let val = e.target.value;
			if (index === 0) {
				this.$emit('changeFirstTransTicketNo', val);
			}
		},
		setFirstTransTicketNo(val) {
			if (this.form.tableDataSource.length == 0) {
				return
			}
			this.form.tableDataSource[0].transTicketNo = val;
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
/deep/ [key='trainType'] .ant-table-column-title {
	&:before {
		display: none;
	}
}
/deep/ [key='deliverQuantity'] .ant-table-column-title {
	&:before {
		display: none;
	}
}
/deep/ [key='operation'] .ant-table-column-title {
	&:before {
		display: none;
	}
}

/deep/ .ant-form-explain {
	position: absolute;
}
/deep/ .ant-table-body {
	overflow-y: hidden;
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
</style>
