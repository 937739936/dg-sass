<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>预警设置</span
				>
			</div>
			<template v-if="depotPoint.length > 0">
				<p style="margin-top: 20px;">库点</p>
				<a-tabs
					:activeKey="curDepotPointKey"
					@change="onChangeTab"
					style="padding-left: 0;"
				>
					<a-tab-pane
						:key="item.key"
						v-for="item in depotPoint"
					>
						<span slot="tab">
							<span
								class="r"
								v-if="item.isDepotNoData"
							></span>
							{{ item.value }}
						</span>
					</a-tab-pane>
				</a-tabs>
			</template>

			<a-form-model
				ref="form"
				:model="form"
				:rules="rules"
				layout="inline"
			>
				<a-table
					:columns="columns"
					:rowKey="record => record.storehouseId"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="warehouse"
						slot-scope="text, record"
					>
						<div class="item">
							<a-row
								:gutter="16"
								type="flex"
								justify="start"
							>
								<a-col style="width: 100px">
									<img :src="wareHouseImg" />
									<p class="tc">{{ record.storehouseName }}仓</p>
								</a-col>
								<a-col style="flex: 1">
									<a-row
										class="des"
										type="flex"
										justify="space-between"
									>
										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">商品名称</div>
											<div class="value">
												{{ record.grainVarieties }}
											</div>
										</a-col>
										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">金融机构</div>
											<div class="value">
												{{ record.bankName }}
											</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">实时库存</div>
											<div class="value">{{ record.currentCapacity }}吨</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">仓房状态</div>
											<div class="value">
												{{ record.statusDesc }}
											</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">仓房长度</div>
											<div class="value">{{ record.length }}m</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">仓房类型</div>
											<div class="value">
												{{ record.storehouseType }}
											</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">仓房宽度</div>
											<div class="value">{{ record.width }}m</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">设计仓容</div>
											<div class="value">{{ record.defaultCapacity && record.defaultCapacity.toLocaleString() }}吨</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">装粮线高</div>
											<div class="value">{{ record.height }}m</div>
										</a-col>

										<a-col
											:span="12"
											class="flex-box"
										>
											<div class="name">保管员</div>
											<div class="value">
												{{ record.keeper }}
											</div>
										</a-col>
									</a-row>
								</a-col>
							</a-row>
						</div>
					</template>
					<template
						slot="grainSetting"
						slot-scope="text, record"
					>
						<div class="setMain">
							<a-row :gutter="16">
								<a-col
									:span="12"
									v-for="(item, index) in record.warningItemSetting.filter(item => {
										return item.type == 'GRAIN_SITUATION';
									})"
									:key="index"
								>
									<div class="setMainItem">
										<template>
											<a-space align="center"
												><div :class="index % 2 == 0 ? 'setMainTit95' : 'setMainTit135'">
													<a-checkbox
														:checked="item.enableWarning"
														@change="
															e => {
																item.enableWarning = e.target.checked;
															}
														"
														>{{ item.title }}</a-checkbox
													>
												</div>
												<a-form-model-item :prop="`setting-judge-${record.storehouseId}-${item.name}`">
													<a-select
														placeholder="请选择判断条件"
														size="small"
														allowClear
														v-model="item.judge"
														:disabled="!item.enableWarning"
													>
														<a-select-option value="GREATER_THAN"> 实际值大于 </a-select-option>
														<a-select-option value="LESS_THAN"> 实际值小于 </a-select-option>
													</a-select>
												</a-form-model-item>
												<a-form-model-item :prop="`setting-criticalValue-${record.storehouseId}-${item.name}`">
													<a-input-number
														placeholder="请输入临界值"
														size="small"
														allowClear
														v-model="item.criticalValue"
														:disabled="!item.enableWarning"
													/>
												</a-form-model-item>
												<a-form-model-item :prop="`setting-level-${record.storehouseId}-${item.name}`">
													<a-select
														placeholder="请选择预警等级"
														size="small"
														allowClear
														:disabled="!item.enableWarning"
														v-model="item.level"
													>
														<a-select-option
															v-for="item in levelList"
															:key="item.value"
															:title="item.label"
															:value="item.value"
														>
															{{ item.label }}
														</a-select-option>
													</a-select>
												</a-form-model-item></a-space
											>
										</template>
									</div>
								</a-col>
							</a-row>
						</div>
					</template>
					<template
						slot="monitorSetting"
						slot-scope="text, record"
					>
						<div class="setMain">
							<a-row :gutter="16">
								<a-col
									:span="24"
									v-for="(item, index) in record.warningItemSetting.filter(item => {
										return item.type == 'MONITOR_SITUATION';
									})"
									:key="index"
								>
									<div class="setMainItem">
										<a-space align="center"
											><div class="setMainTit150">
												<a-checkbox
													:checked="item.enableWarning"
													@change="
														e => {
															item.enableWarning = e.target.checked;
														}
													"
													>{{ item.title }}</a-checkbox
												>
											</div>
											<a-form-model-item :prop="`setting-monitor-level-${record.storehouseId}-${item.name}`">
												<a-select
													placeholder="请选择预警等级"
													size="small"
													allowClear
													:disabled="!item.enableWarning"
													v-model="item.level"
												>
													<a-select-option
														v-for="item in levelList"
														:key="item.value"
														:title="item.label"
														:value="item.value"
													>
														{{ item.label }}
													</a-select-option>
												</a-select>
											</a-form-model-item></a-space
										>
									</div>
								</a-col>
							</a-row>
						</div>
					</template>
					<template
						slot="outSetting"
						slot-scope="text, record"
					>
						<div class="setMain">
							<a-row :gutter="16">
								<a-col
									:span="24"
									v-for="(item, index) in record.warningItemSetting.filter(item => {
										return item.type == 'WAREHOUSE_OUT_OVERAGE';
									})"
									:key="index"
								>
									<div class="setMainItem">
										<a-space align="center"
											><div class="setMainTit124">
												<a-checkbox
													disabled
													:checked="item.enableWarning"
													@change="
														e => {
															item.enableWarning = e.target.checked;
														}
													"
													>{{ item.title }}</a-checkbox
												>
											</div>
											<a-form-model-item :prop="`setting-out-level-${record.storehouseId}-${item.name}`">
												<a-select
													placeholder="请选择预警等级"
													size="small"
													disabled
													allowClear
													v-model="item.level"
												>
													<a-select-option
														v-for="item in levelList"
														:key="item.value"
														:title="item.label"
														:value="item.value"
													>
														{{ item.label }}
													</a-select-option>
												</a-select>
											</a-form-model-item></a-space
										>
									</div>
								</a-col>
							</a-row>
						</div>
					</template>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<a
							style="margin-right: 8px"
							@click="copy(record)"
							>复制</a
						>
						<a @click="paste(record)">粘贴</a>
					</template>
				</a-table>
			</a-form-model>
			<!-- <i-pagination :pagination="pagination" @change="getList" /> -->
			<div
				class="tc"
				style="padding: 10px"
			>
				<a-button
					@click="save"
					v-if="dataSource.length > 0"
					:disabled="disabled"
					type="primary"
				>
					保存
				</a-button>
			</div>
		</a-card>
	</div>
</template>

<script lang="jsx">
import {
	API_GrainEarlyWarningGetDepotEarlyWarning,
	API_GrainSaveEarlyWarningData,
	API_GrainGetAssociatedDepotPoint
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { deepCompare } from '@/v2/utils/factory';
//表头
const columns = [
	{
		title: '仓房信息',
		dataIndex: 'warehouse',
		width: 450,
		scopedSlots: { customRender: 'warehouse' }
	},
	// {
	//   title: "粮食预警设置（单位：℃）",
	//   dataIndex: "setting",
	//   scopedSlots: { customRender: "setting" },
	// },
	{
		title: '粮情预警设置',
		dataIndex: 'grainSetting',
		width: 1280,
		align: 'center',
		scopedSlots: { customRender: 'grainSetting' }
	},
	{
		title: '监控预警设置',
		dataIndex: 'monitorSetting',
		width: 350,
		align: 'center',
		scopedSlots: { customRender: 'monitorSetting' }
	},
	{
		title: '出库数量预警设置',
		dataIndex: 'outSetting',
		width: 320,
		align: 'center',
		scopedSlots: { customRender: 'outSetting' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 98
		// fixed: 'right',
	}
];
//GRAIN_SITUATION 粮情预警
//MONITOR_SITUATION 监控预警
//WAREHOUSE_OUT_OVERAGE 出库数量预警
//预警设置内容
const settingList = {
	grain: [
		{
			value: '温度(℃):',
			key: 'GRAIN_TEMP'
		},
		{
			value: '氧气(%):',
			key: 'O2_CONTENT'
		},
		{
			value: '湿度(%):',
			key: 'HUMIDITY'
		},
		{
			value: '二氧化碳(PPM):',
			key: 'CO2_CONTENT'
		},
		{
			value: '害虫(头):',
			key: 'PESTIS'
		},
		{
			value: '磷化氢(mg/m³):',
			key: 'PH3_CONTENT'
		}
	],
	monitor: [
		{
			value: '仓内移动侦测预警:',
			key: 'WAREHOUSE_ABNORMAL'
		},
		{
			value: '仓内视频掉线预警:',
			key: 'WAREHOUSE_VIDEO_LOSSL'
		},
		{
			value: '仓内画面遮盖预警:',
			key: 'WAREHOUSE_VIDEO_SHADE'
		}
	],
	out: [
		{
			value: '出库数量预警:',
			key: 'WAREHOUSE_OUT_OVERAGE'
		}
	]
};
//预警等级
const levelList = [
	{
		label: '高-预警等级',
		value: 'HIGH'
	},
	{
		label: '中-预警等级',
		value: 'MIDDLE'
	},
	{
		label: '低-预警等级',
		value: 'LOW'
	}
];
export default {
	name: 'EarlyWarningSetting',

	components: {
		iPagination
	},
	props: {
		type: {
			type: String,
			default: 'in'
		},
		columnsIndex: {
			type: Number,
			default: 0
		},
		isMonitor: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			columns,
			settingList,
			levelList,
			curTempData: [],
			depotPoint: [],
			curDepotPointKey: '',
			wareHouseImg: require('@/v2/assets/imgs/storage/wareHouse.png'),
			dataSource: [],
			oldForm: {}, //记录初始数据；
			loading: false,
			disabled: false, //保持按钮是否禁用，提交时禁用
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	computed: {
		//form
		form() {
			let obj = {};
			this.dataSource.map((ite, ind) => {
				ite.warningItemSetting.map((item, index) => {
					switch (item.type) {
						case 'GRAIN_SITUATION':
							obj['setting-enableWarning-' + ite.storehouseId + '-' + item.name] = item.enableWarning;
							obj['setting-judge-' + ite.storehouseId + '-' + item.name] = item.judge;
							obj['setting-criticalValue-' + ite.storehouseId + '-' + item.name] = item.criticalValue;
							obj['setting-level-' + ite.storehouseId + '-' + item.name] = item.level;
							break;
						case 'MONITOR_SITUATION':
							obj['setting-monitor-enableWarning-' + ite.storehouseId + '-' + item.name] = item.enableWarning;
							obj['setting-monitor-level-' + ite.storehouseId + '-' + item.name] = item.level;
							break;
						case 'WAREHOUSE_OUT_OVERAGE':
							obj['setting-out-enableWarning-' + ite.storehouseId + '-' + item.name] = item.enableWarning;
							obj['setting-out-level-' + ite.storehouseId + '-' + item.name] = item.level;
							break;
					}
				});
			});
			//判断对象是否为空,如果不是空并且oldForm为空，则该数据为第一组数据
			if (JSON.stringify(obj) != '{}' && JSON.stringify(this.oldForm) == '{}') {
				this.oldForm = { ...obj };
			}
			return obj;
		},
		//校验规则
		rules() {
			let obj = {};
			this.dataSource.map((ite, ind) => {
				ite.warningItemSetting.map((item, index) => {
					let rul = {
						required: item.enableWarning,
						message: '请填写预警内容',
						trigger: ['blur', 'change']
					};
					switch (item.type) {
						case 'GRAIN_SITUATION':
							obj['setting-judge-' + ite.storehouseId + '-' + item.name] = {
								...rul
							};
							obj['setting-criticalValue-' + ite.storehouseId + '-' + item.name] = {
								...rul
							};
							obj['setting-level-' + ite.storehouseId + '-' + item.name] = {
								...rul
							};
							break;
						case 'MONITOR_SITUATION':
							obj['setting-monitor-level-' + ite.storehouseId + '-' + item.name] = {
								...rul
							};
							break;
						case 'WAREHOUSE_OUT_OVERAGE':
							obj['setting-out-level-' + ite.storehouseId + '-' + item.name] = {
								...rul
							};
							break;
					}
				});
			});
			this.$nextTick(() => {
				this.$refs.form.validate(valid => {
					return false;
				});
			});
			return obj;
		}
	},

	created() {
		this.getAssociatedDepotPoint();
	},
	//跳转页面
	beforeRouteLeave(to, from, next) {
		//跳转页面前判断是否发生改动
		this.oldAndNew(next);
	},
	methods: {
		//fun执行函数，key函数参数
		save(fun, key) {
			this.$refs.form.validate(async valid => {
				if (valid) {
					//保存时禁用保存按钮；
					this.disabled = true;
					const earlyWarningSettingList = this.dataSource.map(item => {
						return {
							storehouseId: item.storehouseId,
							warningItemSettings: item.warningItemSetting
						};
					});
					let res = await API_GrainSaveEarlyWarningData({
						earlyWarningSettingList: earlyWarningSettingList
					});
					this.disabled = false;
					if (res) {
						if (res.data) {
							this.$message.success('保存成功');
							//判断是否有待执行函数，如果有，执行函数，没有刷新列表
							if (typeof fun == 'function') {
								fun(key);
							} else {
								this.getAssociatedDepotPoint();
								this.getList();
							}
						} else {
							this.$message.error('保存失败');
						}
					}
				} else {
					this.$message.warning('请将预警设置填写完整！');
					return false;
				}
			});
		},

		copy(data) {
			//记录当前输入状态
			let curTempData = [];
			data.warningItemSetting.forEach((i, index) => {
				curTempData.push({
					...i
				});
			});
			this.curTempData = curTempData;
		},

		paste(data) {
			if (this.curTempData.length <= 0) {
				return;
			}
			this.dataSource.forEach(item => {
				if (item.storehouseId == data.storehouseId) {
					let curTempData = [];
					this.curTempData.forEach((i, index) => {
						curTempData.push({
							...i
						});
					});
					item.warningItemSetting = curTempData;
				}
			});
		},

		onChangeTab(v) {
			this.oldAndNew(this.changeTab, v);
		},
		//切换仓库
		changeTab(v) {
			this.curDepotPointKey = v;
			this.getList();
		},
		//数据比对，看是否发生修改；
		//fun执行函数，key函数参数
		oldAndNew(fun, key) {
			//如果有原始数据并且原始数据与现有数据不一致，则发生了修改
			if (JSON.stringify(this.oldForm) != '{}' && !deepCompare(this.oldForm, this.form)) {
				//判断当前输入是否满足提交逻辑，满足进行修改保存提示
				this.$refs.form.validate(valid => {
					if (valid) {
						let modal = this.$confirm({
							centered: true,
							title: '您已对预警设置进行了修改，保存后生效，是否进行保存？',
							content: (
								<div>
									<br />
									<div style="float: right;">
										<a-space>
											<a-button
												onClick={() => {
													modal.destroy();
													return false;
												}}
											>
												返回
											</a-button>
											<a-button
												onClick={() => {
													modal.destroy();
													fun(key);
												}}
											>
												不保存
											</a-button>
											<a-button
												type="primary"
												onClick={() => {
													modal.destroy();
													this.save(fun, key);
												}}
											>
												保存
											</a-button>
										</a-space>
									</div>
								</div>
							),
							okButtonProps: {
								style: { display: 'none' }
							},
							cancelButtonProps: {
								style: { display: 'none' }
							},
							class: 'oldAndNewModal',
							icon: () => {
								return (
									<a-icon
										type="exclamation-circle"
										theme="filled"
									/>
								);
							}
						});
					} else {
						let modal = this.$confirm({
							centered: true,
							title: '您已对预警设置进行了修改，且预警参数未填写完善，请问您是否希望填写完善并保存？',
							okText: '是',
							icon: () => {
								return (
									<a-icon
										type="exclamation-circle"
										theme="filled"
									/>
								);
							},
							cancelText: '否',
							onOk: () => {
								modal.destroy();
								return false;
							},
							onCancel: () => {
								modal.destroy();
								return fun(key);
							}
						});
					}
				});
			} else {
				fun(key);
			}
		},
		getAssociatedDepotPoint() {
			API_GrainGetAssociatedDepotPoint().then(res => {
				if (res.success) {
					this.depotPoint = res.data;
					if (this.depotPoint.length > 0 && !this.curDepotPointKey) {
						this.curDepotPointKey = this.depotPoint[0].key;
						this.getList();
					}
				}
			});
		},

		getList() {
			// this.pagination.pageNo = pageNo;
			// this.params.pageNo = pageNo;
			// this.params.pageSize = pageSize;
			this.oldForm = {}; //清空保存数据
			this.dataSource = [];
			this.loading = true;
			API_GrainEarlyWarningGetDepotEarlyWarning(this.curDepotPointKey).then(res => {
				this.loading = false;
				if (res.success) {
					let data = res.data;
					//获取值后，如果没有预警设置列表，补充预警信息列表
					data = data.map(i => {
						let warningItemSetting = [];
						function mapList(it, type, enableWarning, level) {
							let warningItemSettingItem = {};
							//如果有值，取返回的值
							if (
								i.warningItemSetting &&
								i.warningItemSetting.some(ite => {
									return ite.name == it.key;
								})
							) {
								warningItemSettingItem = {
									...i.warningItemSetting.find(ite => {
										return ite.name == it.key;
									})
								};
							}
							//重新赋值，防止有些属性缺失报错
							warningItemSettingItem = {
								name: warningItemSettingItem.name || it.key,
								enableWarning: warningItemSettingItem.enableWarning || enableWarning || false,
								judge: warningItemSettingItem.judge || undefined,
								criticalValue: warningItemSettingItem.criticalValue || null,
								level: warningItemSettingItem.level || level || undefined,
								type: warningItemSettingItem.type || type
							};
							warningItemSettingItem.title = it.value;
							warningItemSetting.push(warningItemSettingItem);
						}
						settingList.grain.map(it => {
							mapList(it, 'GRAIN_SITUATION');
						});
						settingList.monitor.map(it => {
							mapList(it, 'MONITOR_SITUATION');
						});
						settingList.out.map(it => {
							mapList(it, 'WAREHOUSE_OUT_OVERAGE', true, 'HIGH');
						});
						i.warningItemSetting = warningItemSetting;
						return i;
					});
					this.dataSource = data;
					// this.pagination.total = res.data.total;
				}
			});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>
<style lang="less" scoped>
.ant-tabs {
	padding-left: 35px;
	.ant-tabs-tab {
		position: relative;
	}
	.r {
		position: absolute;
		top: 8px;
		right: 8px;
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #f5222d;
	}
}
::v-deep {
	.ant-table-tbody td {
		border-right: 1px solid #e8e8e8;
	}
	.ant-table-tbody td:last-child {
		border-right: 0;
	}
	.ant-card-body {
		padding-top: 0px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	//隐藏报错信息
	.ant-form-inline .ant-form-item-with-help {
		margin-bottom: 0;
		.ant-form-explain {
			display: none;
		}
	}
}
.item {
	.title {
		margin-bottom: 0;
		padding-bottom: 0;
	}
	img {
		width: 90px;
		height: 90px;
		margin-right: 20px;
		margin-bottom: 5px;
		border-radius: 8px;
	}
	.flex-box {
		display: flex;
		margin-bottom: 4px;
		.name {
			width: 90px;
			text-align: left;
			width: 80px;
			color: #9ba0aa;
		}
		.value {
			width: calc(100% - 90px);
			padding-right: 5px;
			font-size: 12px;
			line-height: 18px;

			color: #383a3f;
			word-wrap: break-word;
			word-break: break-all;
			span {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				letter-spacing: 0;
			}
		}
	}
}
.temp-input {
	margin: 0 16px 16px 0;
	line-height: 40px;
}
//预警设置样式
.setMain {
	.setMainItem {
		.setMainTit95 {
			width: 95px;
			text-align: left;
		}
		.setMainTit135 {
			width: 135px;
			text-align: left;
		}
		.setMainTit124 {
			width: 124px;
			text-align: left;
		}
		.setMainTit150 {
			width: 150px;
			text-align: left;
		}
		.ant-select-sm,
		.ant-input-number-sm,
		.ant-input-sm {
			width: 140px;
		}
	}
}
</style>
