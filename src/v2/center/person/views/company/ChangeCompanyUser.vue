<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>添加企业账号</span
				>
			</div>

			<div class="wrapper">
				<div class="slTitleAssis">账号基本信息</div>
				<a-form
					:form="form"
					class="slFormDetail"
					:colon="false"
				>
					<a-row>
						<a-col :span="6">
							<a-form-item label="企业账号">
								<a-input
									placeholder="请输入登录账号名称"
									v-decorator="['account', { rules: [{ required: true, message: `企业账号必填` }] }]"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="6"
							style="margin-left: 80px"
						>
							<a-form-item label="账号状态">
								<a-radio-group
									class="accountStatusGroup"
									v-decorator="[
										`status`,
										{
											rules: [
												{
													required: true,
													message: `账号状态必选`,
													type: 'string'
												}
											]
										}
									]"
								>
									<a-radio
										v-for="(one, index) in statusList"
										:value="one.value"
										:key="index"
									>
										{{ one.text }}
									</a-radio>
								</a-radio-group>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
				<a-tabs
					:defaultActiveKey="defaultActiveKey"
					tabPosition="top"
					@change="tabChanged"
				>
					<a-tab-pane
						tab="粮库配置"
						key="1"
						v-if="showGrainTab"
					>
						<div style="width: 100%">
							<a-form
								class="slFormDetail"
								:form="form"
							>
								<a-form-item
									label="所有权限"
									label-align="left"
									class="flow"
								>
									<a-checkbox
										:checked="allHousePermission"
										@change="changeSet"
									>
										开通所有粮库及仓房权限</a-checkbox
									>
								</a-form-item>
								<a-form-item
									label="角色"
									labelAlign="left"
									class="flow"
								>
									<a-radio-group
										class="rolesGroup"
										@change="changeRole"
										v-decorator="[
											`roleIds`,
											{
												rules: [
													{
														required: true,
														message: `请选择账号角色`,
														type: 'string'
													}
												]
											}
										]"
									>
										<a-radio
											:value="one.value"
											v-for="(one, index) in roleList"
											:key="index"
										>
											{{ one.text }}
											<a-tooltip v-if="one.code == 'OBSERVER'">
												<template slot="title">
													<p>默认可看所有数据，但不能进行操作</p>
												</template>
												<i class="questionIcon"></i>
											</a-tooltip>
										</a-radio>
									</a-radio-group>
								</a-form-item>
								<a-row v-if="!selectRoleCode.includes('OBSERVER')">
									<a-col span="6">
										<a-form-item
											label="所属地区"
											:colon="false"
										>
											<a-cascader
												:getPopupContainer="getPopupContainer"
												:options="residences"
												placeholder="请选择城市"
												v-model="searchParams.area"
											/>
										</a-form-item>
									</a-col>
									<!-- <a-col span="2"> </a-col> -->
									<a-col
										span="6"
										style="margin-left: 107px"
									>
										<a-form-item
											label="粮库名称"
											key=""
											:colon="false"
										>
											<a-input
												v-model="searchParams.pointName"
												placeholder="请输入粮库名称"
											/>
										</a-form-item>
									</a-col>
									<!-- <a-col span="2"> </a-col> -->
									<a-col
										span="6"
										style="margin-left: 60px"
									>
										<a-form-item
											label=" "
											:colon="false"
										>
											<a-space :size="30">
												<a-button
													type="primary"
													html-type="submit"
													class="search-btn"
													@click="getList(1, 10, true)"
												>
													查询
												</a-button>
												<a-button
													html-type="reset"
													@click="resetValues"
													class="btnDark"
												>
													重置</a-button
												>
											</a-space>
										</a-form-item>
									</a-col>
								</a-row>
								<a-table
									class="new-table"
									:pagination="false"
									v-if="!selectRoleCode.includes('OBSERVER')"
									:columns="columns"
									style="margin-top: 10px"
									:data-source="list"
									:scroll="{ x: true }"
									rowKey="id"
								>
									<div slot="customTitle">
										<div>
											<a-checkbox
												class="alwaysShowBox"
												:checked="allCheck"
												@change="changeAll"
												:disabled="allHousePermission"
											>
											</a-checkbox>
											仓房
										</div>
									</div>
									<template
										slot="customRender"
										slot-scope="text, record"
									>
										<a-checkbox-group
											class="houseGroup"
											v-model="record.checkboxList"
											:disabled="allHousePermission"
										>
											<a-checkbox
												v-for="item in record.supervisionHouseDtoList"
												:value="item.houseId"
												:key="item.houseId"
											>
												{{ item.houseName }}</a-checkbox
											>
										</a-checkbox-group>
									</template>
								</a-table>
							</a-form>
						</div>
					</a-tab-pane>
					<a-tab-pane
						tab="站台配置"
						key="2"
						v-if="showStationTab"
					>
						<div style="width: 100%">
							<a-form
								class="slFormDetail"
								:form="form"
							>
								<a-form-item
									label="所有权限"
									class="flow"
									labelAlign="left"
								>
									<a-checkbox
										:checked="stationAllHousePermission"
										@change="changeSet"
									>
										开通所有站台及仓房权限</a-checkbox
									>
								</a-form-item>

								<a-form-item
									label="角色"
									class="flow"
									labelAlign="left"
								>
									<a-radio-group
										class="rolesGroup"
										@change="changeRole"
										v-decorator="[
											`stationRoleIds`,
											{
												rules: [
													{
														required: true,
														message: `请选择账号角色`,
														type: 'string'
													}
												]
											}
										]"
									>
										<a-radio
											:value="one.value"
											v-for="(one, index) in stationRoleList"
											:key="index"
										>
											{{ one.text }}
											<a-tooltip v-if="one.code == 'LOGISTICS_STATION_SUPERVISOR_OBSERVER'">
												<template slot="title">
													<p>默认可看所有数据，但不能进行操作</p>
												</template>
												<i class="questionIcon"></i>
											</a-tooltip>
										</a-radio>
									</a-radio-group>
								</a-form-item>

								<a-row v-if="!stationSelectRoleCode.includes('LOGISTICS_STATION_SUPERVISOR_OBSERVER')">
									<a-col span="6">
										<a-form-item label="所属地区">
											<a-cascader
												:getPopupContainer="getPopupContainer"
												:options="residences"
												placeholder="请选择城市"
												v-model="stationSearchParams.area"
											/>
										</a-form-item>
									</a-col>
									<a-col
										span="6"
										style="margin-left: 107px"
									>
										<a-form-item label="站台名称">
											<a-input
												v-model="stationSearchParams.pointName"
												placeholder="请输入站台名称"
											/>
										</a-form-item>
									</a-col>
									<a-col span="6">
										<a-form-item
											label=" "
											:colon="false"
											style="margin-left: 60px"
										>
											<a-space :size="30">
												<a-button
													type="primary"
													html-type="submit"
													class="search-btn"
													@click="getList(1, 10, true)"
												>
													查询
												</a-button>
												<a-button
													html-type="reset"
													@click="resetValues"
													class="btnDark"
												>
													重置</a-button
												>
											</a-space>
										</a-form-item>
									</a-col>
								</a-row>
								<div>
									<a-table
										class="new-table"
										:pagination="true"
										v-if="!stationSelectRoleCode.includes('LOGISTICS_STATION_SUPERVISOR_OBSERVER')"
										:columns="
											stationSelectRoleCode.includes('LOGISTICS_STATION_ADVANCED_SUPERVISOR')
												? advancedStationColumns
												: stationColumns
										"
										style="margin-top: 10px"
										:data-source="stationList"
										:scroll="{ x: true }"
										rowKey="id"
									>
										<div slot="advancedCustomTitle">
											<div>
												<a-checkbox
													class="alwaysShowBox"
													:checked="advancedStationAllCheck"
													@change="changeAll"
													:disabled="stationAllHousePermission"
												>
												</a-checkbox>
												<span style="margin-left: 10px">站台名称</span>
											</div>
										</div>
										<template
											slot="advancedCustomRender"
											slot-scope="text, record"
										>
											<a-checkbox-group
												class="alwaysShowBox"
												v-model="record.advancedCheckboxList"
												:disabled="stationAllHousePermission"
											>
												<a-checkbox
													:value="record.id"
													:key="record.id"
													>{{ record.name }}</a-checkbox
												>
											</a-checkbox-group>
										</template>

										<div slot="stationCustomTitle">
											<div>
												<a-checkbox
													class="alwaysShowBox"
													:checked="stationAllCheck"
													@change="changeAll"
													:disabled="stationAllHousePermission"
												>
												</a-checkbox>
												<span style="margin-left: 10px">仓房</span>
											</div>
										</div>
										<template
											slot="staionCustomRender"
											slot-scope="text, record"
										>
											<a-checkbox-group
												class="houseGroup"
												v-model="record.stationCheckboxList"
												:disabled="stationAllHousePermission"
											>
												<a-checkbox
													v-for="item in record.warehouseList"
													:value="item.id"
													:key="item.id"
												>
													{{ item.name }}</a-checkbox
												>
											</a-checkbox-group>
										</template>
									</a-table>
								</div>
							</a-form>
						</div>
					</a-tab-pane>
				</a-tabs>
				<!-- <i-pagination :pagination="pagination" @change="getList" /> -->
			</div>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type=""
						class="search-btn"
						@click="$router.back()"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="submit"
					>
						确定
					</a-button>
				</a-space>
			</div>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { area } from '@sub/utils/area.js';
import { API_USERROLECOMPANYTYPE, API_USERCOMPANYSERVICE } from '@/v2/api/account';
import {
	getAllSupervisionHouseList,
	addSupervisionAccount,
	updateSupervisionAccount,
	getSelectSupervisionHouseList,
	getSupervisionDetail,
	getAllSupervisionStationList,
	getSelectSupervisionStationList
} from '@/v2/center/person/api';
import iPagination from '@sub/components/iPagination';
import { getPopupContainer } from '@/v2/utils/factory';
export default {
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this),
			allHousePermission: false,
			stationAllHousePermission: false,
			searchParams: { pointName: '', area: [] },
			stationSearchParams: { pointName: '', area: [] },
			residences: area,
			statusList: filterCodeByKey('companyStatusDict'),
			roleList: [],
			stationRoleList: [],
			columns: [
				{ title: '粮库名称', dataIndex: 'pointName' },
				{ title: '粮库企业名称', dataIndex: 'coreCompanyName' },
				{ title: '地区', dataIndex: 'newArea' },
				{
					dataIndex: 'supervisionHouseDtoList',
					slots: { title: 'customTitle' },
					scopedSlots: { customRender: 'customRender' }
				}
			],
			stationColumns: [
				{ title: '站台名称', dataIndex: 'name' },
				{ title: '站台企业名称', dataIndex: 'companyName' },
				{ title: '地区', dataIndex: 'address' },
				{
					dataIndex: 'warehouseList',
					slots: { title: 'stationCustomTitle' },
					scopedSlots: { customRender: 'staionCustomRender' }
				}
			],
			advancedStationColumns: [
				{
					dataIndex: 'id',
					slots: { title: 'advancedCustomTitle' },
					scopedSlots: { customRender: 'advancedCustomRender' }
				},
				{ title: '站台企业名称', dataIndex: 'companyName' },
				{ title: '地区', dataIndex: 'address' }
			],
			list: [],
			stationList: [],
			// 全选
			allCheck: false,
			stationAllCheck: false,
			advancedStationAllCheck: false,
			pagination: {
				total: 0, // 总条数
				pageNum: 1
			},
			stationPagination: {
				total: 0, // 总条数
				pageNum: 1
			},

			pageSize: 100,
			selectRoleCode: [],
			stationSelectRoleCode: [],
			defaultActiveKey: '1',
			showStationTab: false,
			showGrainTab: false
		};
	},
	computed: {
		handleType() {
			return this.$route.query.type;
		}
	},
	mounted() {
		this.getCompanyService();
		this.handleScroll();
	},
	methods: {
		// fixed随页面滚动
		handleScroll() {
			this.$nextTick(() => {
				var thead = document.querySelector('.slDetailBottom');
				var lw = document.querySelector('#app');
				lw.addEventListener('scroll', function () {
					var sl = 228 - lw.scrollLeft;
					thead.style.left = sl + 'px';
				});
			});
		},
		tabChanged(data) {
			this.defaultActiveKey = data;
			if (
				(this.defaultActiveKey == 1 && this.roleList.length == 0) ||
				(this.defaultActiveKey == 2 && this.stationRoleList.length == 0)
			) {
				this.getRoleList();
			}
			if ((this.defaultActiveKey == 1 && this.list.length == 0) || (this.defaultActiveKey == 2 && this.stationList.length == 0)) {
				this.getList(1, 10, false);
			}
		},
		changeRole(e) {
			if (this.defaultActiveKey == 1) {
				this.selectRoleCode = [];
				const item = this.roleList.find(el => el.value == e.target.value);
				this.selectRoleCode.push(item.code);
			} else {
				this.stationSelectRoleCode = [];
				const item = this.stationRoleList.find(el => el.value == e.target.value);
				this.stationSelectRoleCode.push(item.code);
			}
		},
		/**查询该企业已开通的服务*/
		async getCompanyService() {
			const res = await API_USERCOMPANYSERVICE();
			const data = res.data;
			let serviceList = data.serviceList || [];
			this.companyType = data.companyType;
			if (data.companyType == 'PLATFORM') {
				serviceList = ['LOGISTICS_STATION_SUPERVISOR'];
			}
			this.showGrainTab = serviceList.includes('GRAIN_SUPERVISION');
			this.showStationTab = serviceList.includes('LOGISTICS_STATION_SUPERVISOR');
			this.defaultActiveKey = this.showGrainTab ? '1' : '2';
			this.getRoleList();
			this.getList(1, 10, false);
		},

		/**获取角色列表 */
		async getRoleList() {
			if (this.companyType == 'PLATFORM') {
				this.stationRoleList = [
					{ value: 'SUPERVISING@LOGISTICS_STATION_SUPERVISOR', text: '巡检员', code: 'LOGISTICS_STATION_SUPERVISOR' },
					{
						value: 'SUPERVISING@LOGISTICS_STATION_ADVANCED_SUPERVISOR',
						text: '巡检负责人',
						code: 'LOGISTICS_STATION_ADVANCED_SUPERVISOR'
					},
					{
						value: 'SUPERVISING@LOGISTICS_STATION_SUPERVISOR_OBSERVER',
						text: '巡检观察员',
						code: 'LOGISTICS_STATION_SUPERVISOR_OBSERVER'
					}
				];
				return;
			}

			const res = await API_USERROLECOMPANYTYPE({
				companySupervisingRoleTypeEnum: this.defaultActiveKey == 1 ? 'GRAIN' : 'LOGISTICS_STATION'
			});
			const roleList = res.data.map(item => {
				return {
					value: item.id,
					text: item.name,
					code: item.code
				};
			});
			if (this.defaultActiveKey == 1) {
				this.roleList = roleList;
			} else {
				this.stationRoleList = roleList;
			}
		},
		// 获取站台列表
		async getStationList(pageNo = this.stationPagination.pageNum, pageSize = this.pageSize, flag) {
			this.stationPagination.pageNum = pageNo;
			this.pageSize = pageSize;
			let area = this.stationSearchParams.area[0] || '';
			if (this.stationSearchParams.area[1]) {
				area += '/';
				area += this.stationSearchParams.area[1];
			}
			if (this.stationSearchParams.area[2]) {
				area += '/';
				area += this.stationSearchParams.area[2];
			}

			const params = {
				name: this.stationSearchParams.pointName,
				area: area,
				pageNo: this.stationPagination.pageNum,
				pageSize: this.pageSize
			};
			const res = await getAllSupervisionStationList(params);
			res.data.records.forEach(el => {
				el.advancedCheckboxList = [];
				el.stationCheckboxList = [];
			});
			this.stationList = res.data.records;
			this.stationPagination.total = res.data.total;
			/** 获取 */
			if (this.$route.query.companyUserId && !flag) {
				// 获取已选择的仓库
				const info = await this.getSelectSupervisionStationList(this.$route.query.companyUserId);
				this.stationAllHousePermission = info.data.allPermission;
				this.stationList.forEach(el => {
					info.data.stationList.forEach(el2 => {
						if (el2.id == el.id) {
							if (el2.warehouseIdList) {
								el.advancedCheckboxList.push(el.id);
								el2.warehouseIdList.forEach(el2 => {
									if (el2) {
										el.stationCheckboxList.push(el2);
									}
								});
							}
						}
					});
				});
				// 获取基本信息
				const detailRes = await getSupervisionDetail(this.$route.query.companyUserId);
				let id = '';
				if (detailRes.data.stationSupervisorRole) {
					id = detailRes.data.stationSupervisorRole.id;
					this.stationSelectRoleCode = [detailRes.data.stationSupervisorRole.code];
				}
				this.form.setFieldsValue({
					account: detailRes.data.account,
					status: detailRes.data.status,
					stationRoleIds: id
				});
			}
		},
		// 获取粮库列表
		async getList(pageNo = this.pagination.pageNum, pageSize = this.pageSize, flag) {
			if (this.defaultActiveKey == 2) {
				// 站台
				this.getStationList(pageNo, 100, flag);
				return;
			}

			this.pagination.pageNum = pageNo;
			this.pageSize = pageSize;
			const params = {
				pointName: this.searchParams.pointName,
				province: this.searchParams.area[0] || '',
				city: this.searchParams.area[1] || '',
				area: this.searchParams.area[2] || '',
				pageNum: this.pagination.pageNum,
				pageSize: 100
			};
			const res = await getAllSupervisionHouseList(params);
			res.data.list.forEach(el => {
				el.checkboxList = [];
				let newAreaDes = '';
				if (el.province) {
					newAreaDes += el.province;
				}
				if (el.city) {
					newAreaDes += newAreaDes.length ? '/' : '';
					newAreaDes += `${el.city}`;
				}
				if (el.area) {
					newAreaDes += newAreaDes.length ? '/' : '';
					newAreaDes += `${el.area}`;
				}
				el.newArea = newAreaDes.length > 0 ? newAreaDes : '无';
			});
			this.list = res.data.list;
			this.pagination.total = res.data.total;
			/** 获取 */
			if (this.$route.query.companyUserId && !flag) {
				// 获取选择的仓库
				const info = await this.getSelectSupervisionHouseList();
				this.allHousePermission = info.data.allHousePermission;
				this.list.forEach(el => {
					info.data.houseIds.forEach(el2 => {
						// 查找对应的仓库ID
						const flag = el.supervisionHouseDtoList.some(el3 => el3.houseId == el2);
						if (flag) {
							// 回显选择
							el.checkboxList.push(String(el2));
						}
					});
				});
				// 获取基本信息
				const detailRes = await getSupervisionDetail(this.$route.query.companyUserId);
				let id = '';
				if (detailRes.data.grainRole) {
					id = detailRes.data.grainRole.id;
				}
				this.form.setFieldsValue({
					account: detailRes.data.account,
					status: detailRes.data.status,
					roleIds: id
				});
				this.selectRoleCode = [detailRes.data.grainRole.code];
			}
		},
		// 获取用户选择的仓库
		async getSelectSupervisionHouseList() {
			const params = {
				companyUserId: this.$route.query.companyUserId
			};
			return await getSelectSupervisionHouseList(params);
		},
		// 获取用户选择的站台仓库
		async getSelectSupervisionStationList() {
			const params = {
				companyUserId: this.$route.query.companyUserId
			};
			return await getSelectSupervisionStationList(params);
		},

		// 重置
		resetValues() {
			this.pagination.pageNum = 1;
			if (this.defaultActiveKey == 1) {
				this.searchParams = {
					pointName: '',
					area: []
				};
			} else {
				this.stationSearchParams = {
					pointName: '',
					area: []
				};
			}
			this.getList(1, 10, true);
		},

		// 更改粮仓配置
		changeSet(e) {
			if (this.defaultActiveKey == 1) {
				this.allHousePermission = e.target.checked;
			} else {
				this.stationAllHousePermission = e.target.checked;
			}
		},
		changeAll(e) {
			if (this.defaultActiveKey == 1) {
				this.allCheck = e.target.checked;
				// 所有仓库全选
				this.list.forEach(el => {
					el.checkboxList = [];
					if (this.allCheck) {
						el.supervisionHouseDtoList.forEach(el2 => {
							el.checkboxList.push(el2.houseId);
						});
					}
				});
			} else {
				if (this.stationSelectRoleCode.includes('LOGISTICS_STATION_ADVANCED_SUPERVISOR')) {
					this.advancedStationAllCheck = e.target.checked;
					// 所有站点全选
					this.stationList.forEach(el => {
						el.advancedCheckboxList = [];
						if (this.advancedStationAllCheck) {
							el.advancedCheckboxList.push(el.id);
						}
					});
				} else {
					// 所有仓库全选
					this.stationAllCheck = e.target.checked;
					this.stationList.forEach(el => {
						el.stationCheckboxList = [];
						if (this.stationAllCheck) {
							el.warehouseList.forEach(el2 => {
								el.stationCheckboxList.push(el2.id);
							});
						}
					});
				}
			}
		},
		// 提交
		submit() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const params = {
						account: values.account,
						status: values.status
					};
					let roleIds = [];
					if (this.showGrainTab) {
						// 获取当前所勾选的仓库
						let relHouseIds = [];
						this.list.forEach(el => {
							relHouseIds = [...relHouseIds, ...el.checkboxList];
						});
						// ■针对“监管员”、“监管负责人”、“防化员”角色，如果未配置仓库权限，则提示：请配置粮库权限
						const specArr = ['SUPERVISOR', 'ADVANCED_SUPERVISOR', 'PROTECT'];
						const selectCode = [];
						/** 反查出 角色的code */
						const item = this.roleList.find(el => el.value == values.roleIds);
						selectCode.push(item.code);
						///判断当前勾选的角色是否包含 这三个角色
						const flag = selectCode.some(el => specArr.includes(el));
						if (flag && !this.allHousePermission && !relHouseIds.length) {
							this.$message.error('请配置粮库权限');
							return;
						}
						roleIds = [...[values.roleIds]];
						params.roleIds = roleIds;
						params.supervisionHouseRelReq = {
							allHousePermission: this.allHousePermission,
							relHouseIds
						};
					}

					if (this.showStationTab) {
						// 站台相关
						let relStationList = [];
						let stationAllHousePermission = this.stationAllHousePermission;
						if (this.stationSelectRoleCode.includes('LOGISTICS_STATION_SUPERVISOR')) {
							//监管员
							this.stationList.forEach(el => {
								if (el.stationCheckboxList && el.stationCheckboxList.length > 0) {
									let warehouseIdList = [];
									el.stationCheckboxList.forEach(houseId => {
										warehouseIdList.push(houseId);
									});
									relStationList = [...relStationList, ...[{ id: el.id, warehouseIdList: warehouseIdList }]];
								}
							});
						} else if (this.stationSelectRoleCode.includes('LOGISTICS_STATION_ADVANCED_SUPERVISOR')) {
							//监管负责人
							this.stationList.forEach(el => {
								if (el.advancedCheckboxList && el.advancedCheckboxList.length > 0) {
									let warehouseIdList = [];
									el.warehouseList.forEach(house => {
										if (house) {
											warehouseIdList.push(house.id);
										}
									});
									relStationList = [...relStationList, ...[{ id: el.id, warehouseIdList: warehouseIdList }]];
								}
							});
						} else if (this.stationSelectRoleCode.includes('LOGISTICS_STATION_SUPERVISOR_OBSERVER')) {
							//巡库观察员
							stationAllHousePermission = true;
						}
						params.stationSupervisionWarehouseRelReq = {
							allPermission: stationAllHousePermission,
							stationList: relStationList
						};
						roleIds = [...roleIds, ...[values.stationRoleIds]];
						params.roleIds = roleIds;
					}

					this.$confirm({
						centered: true,
						title: '请确认信息填写正确',
						okText: '确定',
						cancelText: '取消',
						onOk: async () => {
							// 判断是否是编辑

							if (this.$route.query.companyUserId) {
								params.id = this.$route.query.companyUserId;
								params.supervisionRole = this.companyType == 'PLATFORM';
								await updateSupervisionAccount(params);
								this.$message.success('更新创建成功');
							} else {
								await addSupervisionAccount(params);
								this.$message.success('账号创建成功');
							}
							this.$router.back();
						},
						onCancel() {}
					});
				}
			});
		}
	},
	components: {
		iPagination
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	.slFormDetail {
		padding: 30px 0;
		color: rgba(0, 0, 0, 0.8);
		::v-deep.ant-form-item {
			margin-bottom: 20px;
		}
	}
	.flow {
		display: flex;
		::v-deep.ant-form-item-label {
			margin-bottom: 0px;
			width: 70px;
			margin-right: 20px;
		}
	}
	::v-deep.ant-tabs {
		margin-top: 0;
	}
	::v-deep.ant-tabs .ant-tabs-bar .ant-tabs-nav .ant-tabs-tab {
		padding-top: 0;
	}
	.questionIcon {
		display: inline-block;
		width: 12px;
		height: 12px;
		background: url(~@/v2/assets/imgs/common/question_icon.png) no-repeat 100% / cover;
		position: relative;
		top: 1px;
	}
	.slDetailBottom {
		width: calc(100vw - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 228px;
	}
	.new-table .ant-table-column-title div {
		font-family: PingFangSC-Medium, PingFang SC !important;
	}
}
.alwaysShowBox {
	::v-deep.ant-checkbox:not(.ant-checkbox-checked) {
		display: inline-block !important;
	}
}
.houseGroup {
	::v-deep.ant-checkbox:not(.ant-checkbox-checked) {
		display: inline-block !important;
	}
	::v-deep.ant-checkbox-wrapper {
		margin-left: 0px;
		margin-right: 20px;
	}
}
.rolesGroup {
	::v-deep.ant-radio-wrapper {
		margin-left: 0px;
		margin-right: 30px;
		min-width: 100px;
	}
}
.accountStatusGroup {
	line-height: 31px;
	::v-deep.ant-radio-wrapper {
		margin-left: 0px;
		margin-right: 40px;
	}
}
::v-deep.ant-checkbox-wrapper {
	color: rgba(0, 0, 0, 0.8);
}
::v-deep.ant-radio-wrapper {
	color: rgba(0, 0, 0, 0.8);
}

.title {
	font-size: 16px;
	font-weight: 600;
	border-bottom: 1px solid #f5f5f5;
	line-height: 40px;
	margin-bottom: 20px;
}
.box {
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
