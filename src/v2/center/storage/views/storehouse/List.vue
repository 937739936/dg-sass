<template>
	<div class="slMain mt-10 wrapper">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>仓房管理</span
				>
			</div>
			<template>
				<div class="content-wrap">
					<!-- <p style="width:40px;float:left;padding-top:13px;padding-right: 10px;font-size: 14px;font-weight: 500;">库点</p> -->
					<div :class="{ 'warehouse-list': true, 'warehouse-list-left': !leftHide }">
						<p class="warehouse-list-search-wrap">
							<a-input-search
								placeholder="请输入仓库名称"
								v-model="warehouseName"
								allowClear
								@change="searchWarehouse"
							/>
						</p>
						<div class="infinite-container">
							<a-tree
								:show-icon="false"
								v-if="dataSource.length > 0"
								:defaultExpandedKeys="defaultExpandedKeys"
								:defaultExpandAll="!!warehouseName"
								:defaultSelectedKeys="defaultSelectedKeys"
								:autoExpandParent="true"
								:defaultExpandParent="true"
							>
								<a-tree-node
									:key="item1.code"
									v-for="item1 in dataSource"
									:selectable="false"
								>
									<span slot="title">{{ item1.name }}</span>
									<a-tree-node
										:key="item2.code"
										v-for="item2 in item1.children"
										:selectable="!item2.children"
									>
										<span slot="title">
											<span
												:class="[currentTreeValue == item2.code ? 'active' : '']"
												@click="onSelect(item2)"
												>{{ item2.name }}
											</span>
										</span>
										<a-tree-node
											:key="item3.code"
											v-for="item3 in item2.children"
											:selectable="false"
										>
											<span slot="title">{{ item3.name }}</span>
											<a-tree-node
												:key="item3.id"
												v-for="item3 in item3.warehousePoints"
											>
												<span slot="title">
													<span
														:class="[currentTreeValue == item3.id ? 'active' : '']"
														@click="onSelect(item3)"
														>{{ item3.name }}
													</span>
												</span>
											</a-tree-node>
										</a-tree-node>
									</a-tree-node>
								</a-tree-node>
							</a-tree>
							<p
								v-else
								class="loading-wrap"
							>
								<a-spin />
							</p>
						</div>
					</div>
					<div :class="{ 'gray-line': true, 'gray-line-left': !leftHide }"></div>
					<div :class="{ 'record-list': true, 'record-list-left': !leftHide }">
						<p class="current-item-name">
							<a-row type="flex">
								<a-col flex="auto">
									<a-space align="center">
										<a-icon
											:type="leftHide ? 'menu-fold' : 'menu-unfold'"
											:style="{ fontSize: '16px' }"
											@click="leftHide = !leftHide"
										/>
										<span class="current-item-name-title">{{ currentItem.name }}</span>
									</a-space>
								</a-col>
								<a-col
									flex="380px"
									v-show="selectedKey.length"
								>
									<a-space>
										批量修改粮食保管等级：
										<a-select
											v-model="levelAll"
											style="width: 75px"
											size="small"
										>
											<a-select-option
												:value="item.value"
												v-for="item in custodyClassList"
												:key="item.value"
											>
												{{ item.text }}
											</a-select-option>
										</a-select>
										<a-button
											type="primary"
											:loading="storeUpdatLevelAllLoading"
											size="small"
											@click="storeUpdatLevelAll"
											>确定</a-button
										>
										<a-button
											size="small"
											@click="storeUpdatLevelClass"
											>取消</a-button
										>
									</a-space>
								</a-col>
							</a-row>
						</p>
						<a-table
							class="new-table"
							:pagination="false"
							:columns="columns"
							:data-source="tableData"
							:scroll="{ x: true }"
							rowKey="storehouseId"
							style="width: 100%"
							:rowSelection="rowSelection"
							:bordered="false"
							:rowClassName="
								() => {
									return 'tableLine';
								}
							"
							:loading="loading"
						>
							<template slot="grainInfoTitle">
								粮食信息
								<a-tooltip>
									<template slot="title">
										<p>保管等级为：安全，监管员需7天巡检一次粮温</p>
										<p>保管等级为：半安全，监管员需3天巡检一次粮温</p>
										<p>保管等级为：危险，监管员需1天巡检一次粮温</p>
										<p>当粮食保管等级为：暂无，监管员无需对仓房巡检</p>
									</template>
									<a-icon type="exclamation-circle" />
								</a-tooltip>
							</template>
							<template
								slot="baseInfo"
								slot-scope="baseInfo, record"
							>
								<div>
									<div class="image-title-wrap">
										<img
											:src="wareHouseImg"
											style="width: 40px; height: 40px"
										/>
										<span class="tc">{{ record.storehouseName }}仓</span>
									</div>
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
												<div class="name">仓房长度：</div>
												<div class="value">{{ record.length }}m</div>
											</a-col>
											<a-col
												:span="12"
												class="flex-box"
											>
												<div class="name">仓房宽度：</div>
												<div class="value">{{ record.width }}m</div>
											</a-col>
											<a-col
												:span="12"
												class="flex-box"
											>
												<div class="name">装粮线高：</div>
												<div class="value">{{ record.height }}m</div>
											</a-col>
											<a-col
												:span="12"
												class="flex-box"
											>
												<div class="name">设计仓容：</div>
												<div class="value">{{ record.defaultCapacity }}吨</div>
											</a-col>
											<a-col
												:span="12"
												class="flex-box"
											>
												<div class="name">仓房类型：</div>
												<div class="value">{{ record.storehouseType }}</div>
											</a-col>
											<a-col
												:span="12"
												class="flex-box"
											>
												<div class="name">保管员：</div>
												<div class="value">{{ record.keeper }}</div>
											</a-col>
										</a-row>
									</a-col>
								</div>
							</template>

							<template
								slot="grainInfo"
								slot-scope="grainInfo, record"
							>
								<div>
									<div class="image-title-wrap">
										<img
											:src="foodstuffImg"
											style="width: 40px; height: 40px"
										/>
										<span class="tc"><span class="tc-goods-name">商品名称：</span>{{ record.grainVarieties }}</span>
									</div>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">商品等级：</div>
										<div class="value">{{ record.grainLevel }}</div>
									</a-col>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">保管等级：</div>
										<div class="value valueSpan">
											<a-space>
												<template v-if="!storeUpdateObj[record.storehouseId].show">
													<a-tag :color="custodyClass(record.custodianLevel)">
														{{ custodyClass(record.custodianLevel, 'name') }}
													</a-tag>
													<a
														class="custodyUpdate"
														@click="storeUpdatLevelShow(record.storehouseId)"
														>修改</a
													>
												</template>
												<template v-if="storeUpdateObj[record.storehouseId].show">
													<a-select
														v-model="storeUpdateObj[record.storehouseId].level"
														style="width: 75px"
														size="small"
													>
														<a-select-option
															:value="item.value"
															v-for="item in custodyClassList"
															:key="item.value"
														>
															{{ item.text }}
														</a-select-option>
													</a-select>
													<a @click="storeUpdatLevel(record.storehouseId)">确定</a>
												</template>
											</a-space>
										</div>
									</a-col>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">温度：</div>
										<div class="value">{{ record.inTemp }}°C</div>
									</a-col>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">湿度：</div>
										<div class="value">{{ record.inHumidity }}%</div>
									</a-col>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">水分：</div>
										<div class="value">{{ record.moisture }}%</div>
									</a-col>
									<a-col
										:span="12"
										class="flex-box"
									>
										<div class="name">杂质率：</div>
										<div class="value">{{ record.impurities }}%</div>
									</a-col>
								</div>
							</template>

							<template
								slot="action"
								slot-scope="action, record"
							>
								<!-- USING("USING", "使用中"),
                FREE("FREE", "空闲中"),
                CLOSE("CLOSE", "封仓"),
                BANK_APPROVE("BANK_APPROVE","关联资金方待审批"),
                OPEN_APPROVE("OPEN_APPROVE","解除封仓待审批") -->

								<!-- 核心企业按钮操作 -->
								<template v-if="VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'">
									<!-- 
                    空闲中状态---关联资金方、详情&监控
                    关联资方待审批状态---详情&监控、撤回
                    解除封仓待审批状态---详情&监控
                    使用中状态--- 封仓、详情&监控、关联资金方（未关联资方时）、仓清确认
                    已封仓状态--- 解除封仓、详情&监控、关联资金方（未关联资方时
                  -->
									<template v-if="record.status == 'USING'">
										<a
											v-auth="'warehouse:monitor:closeWarehouse'"
											@click="blockWarehouse(record)"
											>封仓</a
										>
										<br />
									</template>
									<template v-if="record.status == 'CLOSE'">
										<a
											v-auth="'warehouse:monitor:openWarehouse'"
											@click="openWarehouse(record)"
											>解除封仓</a
										>
										<br />
									</template>
									<template v-if="record.status == 'FREE' || record.status == 'USING' || record.status == 'CLOSE'">
										<a
											v-auth="'warehouse:monitor:addBanRel'"
											@click="jumpPage('/center/storageCenter/storehouse/relatedFunds', record)"
											v-if="!record.relationSuccess"
											>关联资金方</a
										>
										<br />
									</template>
									<template v-if="record.status == 'BANK_APPROVE'">
										<a @click="recall(record)">撤回关联资方</a>
										<br />
									</template>
									<a
										v-auth="'warehouse:monitor:view'"
										@click="jumpPage('/center/storageCenter/storehouse/detail', record)"
										>详情&监控</a
									>
									<br />
									<template v-if="record.status == 'USING'">
										<!-- 对于自有资金类型，才显示仓清确认的按钮-->
										<a
											v-auth="'warehouse:monitor:clearWarehouse'"
											v-if="record.ourFund"
											@click="clearWarehouse(record)"
											>仓清确认</a
										>
										<br />
									</template>
								</template>

								<!-- 仓储企业端按钮操作 -->
								<template v-if="VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE'">
									<!--详情&监控 -->
									<a
										v-auth="'warehouse:monitor:view'"
										@click="jumpPage('/center/storageCenter/storehouse/detail', record)"
										>详情&监控</a
									>
									<br />
								</template>

								<!-- 金融机构端按钮操作 -->
								<template v-if="VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG'">
									<!-- 解除封仓待审批状态---通过、驳回 -->
									<div
										v-if="record.status == 'OPEN_APPROVE'"
										v-auth="'warehouse:monitor:openApprove'"
									>
										<a @click="audit(record, 1)">通过</a>
										<a @click="audit(record, 0)">驳回</a>
									</div>
									<!--使用中、已封仓、解除封仓待审批状态 ----详情&监控 -->
									<a
										v-auth="'warehouse:monitor:view'"
										@click="jumpPage('/center/storageCenter/storehouse/detail', record)"
										>详情&监控</a
									>
									<br />
								</template>
							</template>
						</a-table>
					</div>
				</div>
			</template>
		</a-card>
	</div>
</template>

<script lang="jsx">
import {
	API_BlockWarehouse,
	API_CheckBlockWarehouse,
	API_ClearWarehouse,
	API_AuditReleaseWarehouse,
	API_OutReceiptnExecution,
	API_RecallRelatingFunds,
	API_GetKeyLockAndWorks,
	API_OpenWarehouse,
	API_WAREHOUSEGRAINSITUATIONHAVELOCK,
	getDepotPointWareHouse,
	getWareHouseList,
	modifyCustodianLevel
} from '@/v2/center/storage/api';
import { mapGetters } from 'vuex';
import moment from 'moment';
import infiniteScroll from 'vue-infinite-scroll';
import debounce from 'lodash/debounce';
const columns = [
	{
		title: '仓房基本信息',
		dataIndex: 'baseInfo',
		scopedSlots: { customRender: 'baseInfo' },
		width: 500
	},
	{
		dataIndex: 'grainInfo',
		slots: { title: 'grainInfoTitle' },
		scopedSlots: { customRender: 'grainInfo' },
		width: 450
	},
	{
		title: '实时库存',
		dataIndex: 'currentCapacity',
		customRender: text => {
			return text + '吨';
		},
		width: 100
	},
	{ title: '金融机构', dataIndex: 'bankName', width: 200 },
	{
		title: '仓房开始使用日期',
		dataIndex: 'startTime',
		customRender: text => text && moment(text).startOf('day').format('YYYY-MM-DD'),
		width: 200
	},
	{ title: '仓房状态', dataIndex: 'statusDesc', width: 100 },
	{
		title: '操作',
		dataIndex: 'action',
		width: 190,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const custodyClassList = [
	{ color: '#3fc534', text: '安全', value: 'SAFETY' },
	{ color: '#ffad36', text: '半安全', value: 'RISK' },
	{ color: '#F5222D', text: '危险', value: 'DANGER' },
	{ color: '#0090fa', text: '暂无', value: 'NONE' }
];
export default {
	name: 'MonitorList',
	directives: { infiniteScroll },
	data() {
		return {
			columns,
			custodyClassList,
			loading: false,
			params: {},
			dataSource: [],
			defaultActiveKey: 0,
			tableData: [],
			wareHouseImg: require('@/v2/assets/imgs/storage/house.png'),
			foodstuffImg: require('@/v2/assets/imgs/storage/foodstuff.png'),
			busy: false,
			currentItem: {},
			pageNo: 1,
			pageSize: 999,
			warehouseName: '',
			total: 0,
			currentTreeValue: '',
			// 操作对象
			handleItem: {},
			defaultExpandedKeys: [],
			defaultSelectedKeys: [],
			storeUpdateObj: {}, //修改的仓房
			selectedKey: [], //选中的仓房
			levelAll: 'SAFETY', //批量等级设置
			storeUpdatLevelAllLoading: false, //批量提交中
			leftHide: true
		};
	},
	created() {
		this.warehouseName = '';
		this.init();
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		tableScrollY() {
			return document.body.clientHeight - 280;
		},
		rowSelection() {
			return {
				type: 'checkbox',
				onChange: selectedRowKeys => {
					// eslint-disable-next-line vue/no-side-effects-in-computed-properties
					this.selectedKey = selectedRowKeys;
				},
				selectedRowKeys: this.selectedKey
			};
		}
	},
	methods: {
		searchWarehouse: debounce(function () {
			this.init();
		}, 300),
		init() {
			this.pageNo = 1;
			this.dataSource = [];
			this.tableData = [];
			this.storeUpdateObj = {};
			this.currentItem = {};
			this.getList();
		},
		selectItem(item) {
			this.currentItem = item;
			this.loading = true;
			getDepotPointWareHouse({
				pointId: item.id
			})
				.then(res => {
					this.tableData = res.data.depots;
					//储存个仓房保管等级
					let storeUpdateObj = {};
					this.tableData.map(item => {
						storeUpdateObj[item.storehouseId] = {
							level: item.custodianLevel,
							show: false
						};
					});
					this.storeUpdateObj = storeUpdateObj;
					this.selectedKey = []; //选中的仓房
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//保管等级颜色
		custodyClass(value, type) {
			let color = '#3fc534',
				name = '安全';
			for (let i = 0; i < custodyClassList.length; i++) {
				let item = custodyClassList[i];
				if (item.value == value) {
					color = item.color;
					name = item.text;
					break;
				}
			}
			if (type == 'name') {
				return name;
			} else {
				return color;
			}
		},
		//展示修改
		storeUpdatLevelShow(storehouseId) {
			let item = this.storeUpdateObj[storehouseId];
			item.show = true;
			this.$set(this.storeUpdateObj, storehouseId, item);
		},
		//修改保管等级
		storeUpdatLevel(storehouseId) {
			if (storehouseId) {
			}
			let data = {
				houseIds: storehouseId,
				level: this.storeUpdateObj[storehouseId].level
			};
			this.storeUpdatLevelPut(data);
		},
		//批量修改保管等级
		storeUpdatLevelAll() {
			let data = {
				houseIds: this.selectedKey.join(','),
				level: this.levelAll
			};
			this.storeUpdatLevelPut(data);
		},
		storeUpdatLevelPut(data) {
			this.storeUpdatLevelAllLoading = true;
			modifyCustodianLevel(data)
				.then(res => {
					if (res.success && res.data) {
						this.$message.success('修改成功！');
						this.selectItem(this.currentItem);
					} else {
						this.$message.error('修改失败！');
					}
				})
				.catch(() => {
					this.$message.error('修改失败！');
				})
				.finally(() => {
					this.storeUpdatLevelAllLoading = false;
				});
		},
		//取消仓房管理修改
		storeUpdatLevelClass() {
			this.selectedKey = [];
		},
		// 选择
		onSelect(info) {
			if (info.children) {
				return;
			}
			this.currentTreeValue = info.code || info.id;
			this.selectItem(info);
		},
		async getList() {
			this.busy = true;
			try {
				const res = await getWareHouseList({ pointName: this.warehouseName });
				const warehousePoints = res.data.warehousePoints || [];
				const areaPointRespList = res.data.areaPointRespList || [];
				let dataSource = [];
				// 未设置区域的
				if (warehousePoints.length) {
					warehousePoints.forEach(el => {
						el.code = el.id;
					});
					const newObj = {
						name: '未设置区域',
						code: '20220607',
						children: warehousePoints
					};
					dataSource = [...areaPointRespList, newObj];
				} else {
					dataSource = areaPointRespList;
				}
				this.$nextTick(() => {
					if (!this.currentItem.id && dataSource.length) {
						let item = {};
						let parentItem = {};
						if (!areaPointRespList.length) {
							parentItem = {
								name: '未设置区域',
								code: '20220607'
							};
							item = warehousePoints[0];
						} else {
							parentItem = areaPointRespList[0].children[0].children[0];
							item = areaPointRespList[0].children[0].children[0].warehousePoints[0];
						}

						this.currentTreeValue = item.id;
						this.defaultExpandedKeys = [parentItem.code];
						this.dataSource = dataSource;
						this.selectItem(item);
					} else {
						this.dataSource = dataSource;
					}
				});
			} catch (error) {
			} finally {
				this.busy = false;
			}
		},
		jumpPage(path, data) {
			// 跳转页面
			const { batchId, storehouseId, coreCompanyId, isNeedAudit, startTime } = data;
			this.$router.push({
				path,
				query: {
					batchId: batchId,
					id: storehouseId,
					coreCompanyId,
					storehouseId,
					isNeedAudit,
					time: startTime && moment(startTime).valueOf()
				}
			});
		},
		recall(record) {
			// 撤回
			API_RecallRelatingFunds({
				batchId: record.batchId
			}).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('撤回成功！');
						this.selectItem(this.currentItem);
						// this.getList()
					}
				}
			});
		},
		blockWarehouse({ batchId }) {
			API_WAREHOUSEGRAINSITUATIONHAVELOCK(batchId).then(res => {
				if (res.success && res.data) {
					// this.toBlockWarehouse({ batchId })
					this.$confirm({
						title: '确认提示',
						content: '封仓后，电子锁钥匙权限将会收回，请确认所有电子锁已经锁于对应库门。',
						onOk: () => {
							this.toBlockWarehouse({ batchId });
							this.selectItem(this.currentItem);
						}
						// onCancel: () => {},
					});
					return;
				}
				this.toBlockWarehouse({ batchId });
			});
		},
		toBlockWarehouse({ batchId }) {
			// 封仓
			API_CheckBlockWarehouse({ batchId }).then(res => {
				if (res.success) {
					if (!res.data) {
						API_BlockWarehouse({ batchId }).then(res => {
							if (res.success) {
								this.$message.success('封仓成功！');
								this.selectItem(this.currentItem);
							}
						});
					} else {
						this.$message.error('当前仓房下有电子锁处于开锁状态，无法封仓，请先联系驻库员关锁后再进行封仓');
					}
				}
			});
		},
		clearWarehouse(record) {
			//仓清确认
			let that = this;
			that.$confirm({
				title: '确认提示',
				content: '请确认当前仓库粮食已出清，并进行仓清！',
				onOk() {
					API_ClearWarehouse({ batchId: record.batchId }).then(res => {
						if (res.success) {
							if (res.data) {
								that.$message.success('仓清确认成功！');
								that.selectItem(that.currentItem);
								// that.getList()
							}
						}
					});
				},
				onCancel() {},
				class: 'test'
			});
		},
		openWarehouse(data) {
			// 如果是自有资金，则弹框确认是否解除封仓，判断是否有开关锁逻辑，有则跳转到解除封仓-开锁授权页面，提交后解除封仓成功，无则直接解锁
			if (data.ourFund) {
				this.$confirm({
					title: '确认提示',
					content: '是否解除封仓？',
					onOk: () => {
						this.judgeCanOpen(false, data);
					},
					onCancel() {}
				});
				return;
			}
			// 如果非自有资金，首先判断是否有正在执行中的出仓单，有则不需要金融机构审批，则弹框确认是否解除封仓，判断是否有开关锁逻辑，有则跳转到解除封仓-开锁授权页面，提交后解除封仓成功；；没有则需要金融机构审批，直接跳转到解除封仓-开锁授权页面，用户也可以点击出仓单按钮，跳转到出仓单开具页面。
			API_OutReceiptnExecution({ batchId: data.batchId }).then(res => {
				if (res.success) {
					if (res.data) {
						this.$confirm({
							title: '确认提示',
							content: '是否解除封仓？',
							onOk: () => {
								this.judgeCanOpen(false, data);
							}
						});
						return;
					}
					const modal = this.$confirm({
						title: '确认提示',
						content: (
							<div>
								该仓房下当前没有正在执行中的出仓单，若您仍需要解除封仓，需要金融机构审批，是否确认解除？
								<br />
								<br />
								<br />
								<a-space>
									<a-button
										type="primary"
										ghost
										onClick={() => {
											modal.destroy();
										}}
									>
										取消
									</a-button>
									<a-button
										type="primary"
										onClick={() => {
											this.jumpPage('/center/storageCenter/out/receipt/create', {});
											modal.destroy();
										}}
									>
										开具新的出仓单
									</a-button>
									<a-button
										type="primary"
										onClick={() => {
											this.judgeCanOpen(true, data);
											modal.destroy();
										}}
									>
										解除
									</a-button>
								</a-space>
							</div>
						),
						okText: '是',
						cancelText: '否',
						// mask:false,
						okButtonProps: {
							style: { display: 'none' }
						},
						cancelButtonProps: {
							style: { display: 'none' }
						},
						icon: () => {
							return (
								<a-icon
									type="exclamation-circle"
									theme="filled"
								/>
							);
						}
					});
				}
			});
		},
		judgeCanOpen(flag, data) {
			// 判断是否有开关锁逻辑，有则跳转，无则直接解锁
			API_GetKeyLockAndWorks(data.batchId).then(res => {
				if (res.success) {
					if (res.data) {
						this.jumpPage('/center/storageCenter/storehouse/openWarehouse', {
							...data,
							isNeedAudit: flag
						});
					} else {
						const params = { batchId: data.batchId };
						API_OpenWarehouse(params).then(res => {
							if (res.success) {
								this.$message.success('解除封仓成功！');
								this.selectItem(this.currentItem);
								// this.getList()
							}
						});
					}
				}
			});
		},
		audit(record, status) {
			//解除封仓待审批
			API_AuditReleaseWarehouse({
				batchId: record.batchId,
				status: status
			}).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success(status === 0 ? '驳回成功！' : '通过成功！');
						this.selectItem(this.currentItem);
						// this.getList()
					}
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
.wrapper {
	::v-deep {
		.ant-divider {
			margin: 20px 0 0 0;
		}
		.ant-tree-node-selected {
			background-color: #fff !important;
		}
	}

	::v-deep {
		table {
			// border: none;
		}
		.ant-table-wrapper {
			background-color: #fff;
		}
		.ant-card-head {
		}
		.ant-card-head-title {
			font-size: 16px;
			color: #141517;
			line-height: 24px;
			position: relative;
			padding-left: 10px;
		}
		.ant-card-body {
			padding: 0;
		}
	}
	.flex-box {
		display: flex;
		margin-bottom: 5px;
		.value {
			width: calc(100% - 90px);
			padding-right: 5px;
			font-size: 14px;
			color: #383a3f;
			line-height: 18px;
		}
		.name {
			// width: 65px;
			text-align: left;
			line-height: 30px;
			color: #9ba0aa;
			font-size: 14px;
		}
		.value {
			color: #383a3f;
			word-wrap: break-word;
			word-break: break-all;
			line-height: 30px;
			// overflow: hidden;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			// letter-spacing:0;
			span {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				letter-spacing: 0;
			}
			&.valueSpan {
				span {
					width: 40px;
					display: inline;
				}
			}
		}
		.bold {
			font-weight: bold;
		}
	}
	.block {
		.flex-box {
			display: flex;
			margin-bottom: 5px;
			.value {
				width: calc(100% - 55px);
			}
		}
		.name {
			width: 55px;
			color: #9ba0aa;
		}
		.item {
			border: 1px solid #eef0f2;
			border-radius: 4px;
			padding: 16px;
			padding-bottom: 0;
			overflow: hidden;
			.img {
				width: 90px;
				img {
					width: 90px;
					height: 90px;
					margin: 0;
					border-radius: 4px;
				}
			}
			.des {
				flex: 1;
				padding-left: 10px;
				line-height: 30px;
			}
		}
		.r {
			color: #f24e4d;
		}
		.button {
			line-height: 30px;
			background: @primary-color;
			margin: 0 -24px;
			color: #ffffff;
			cursor: pointer;
			margin-top: 15px;
		}
	}
	.content-wrap {
		width: 100%;
		display: flex;
		flex-direction: row;
		.gray-line {
			width: 12px;
			height: calc(100vh - 160px);
			margin-top: 1px;
			transition: width 0.5s;
			&.gray-list-left {
				width: 0;
			}
		}
		.ant-list-item {
			border: none;
			height: 40px;
			line-height: 40px;
			padding: 0;
			span {
				width: 100%;
				height: 100%;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				padding-left: 12px;
				line-height: 40px;
			}
		}
		.warehouse-list {
			position: sticky;
			top: 10px;
			width: 20%;
			padding-top: 12px;
			height: calc(100vh - 172px);
			overflow: hidden;
			box-sizing: border-box;
			background: #fff;
			transition: width 0.5s;
			.warehouse-list-search-wrap {
				width: 100%;
				padding: 0 12px 0 10px;
			}
			.active {
				// width: 100%;
				// height: 40px;
				// display: inline-block;
				// background: rgba(0, 83, 219, 0.08);
			}
			.normal {
				color: rgba(0, 0, 0, 0.65);
				cursor: pointer;
			}
			.infinite-container {
				height: calc(100vh - 232px);
				overflow: auto;
				// padding-bottom: 20px;
				margin-top: 10px;
			}
			&.warehouse-list-left {
				width: 0;
			}
		}
		.record-list {
			width: 80%;
			padding: 0 0 20px 0;
			transition: width 0.5s;
			.tableLine {
				.custodyUpdate {
					display: none;
				}
				&:hover {
					.custodyUpdate {
						display: unset;
					}
				}
			}
			&.record-list-left {
				width: 100%;
			}
		}
	}
	.current-item-name {
		width: 100%;
		height: 50px;
		line-height: 50px;
		padding-left: 16px;
		background-color: #fff;
		.current-item-name-title {
			font-size: 16px;
			color: #383a3f;
			font-weight: bold;
		}
	}
	.record-list-table-wrap {
		width: 100%;
		// height: calc(100vh - 236px);
		overflow: scroll;
	}
	.tc {
		width: 200px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		font-weight: 500;
		color: #383a3f;
		text-align: left;
		padding-left: 10px;
	}
	.image-title-wrap {
		display: flex;
		height: 40px;
		align-items: center;
	}
	.tc-goods-name {
		color: #9ba0aa;
	}
	.active {
		background: #bae7ff !important;
	}
}
.loading-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
