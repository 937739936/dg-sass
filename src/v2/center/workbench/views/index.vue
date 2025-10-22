<template>
	<div class="bench-content">
		<!-- 核心企业加载数据概览 -->
		<div
			class="content"
			v-if="VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'"
		>
			<a-row
				:gutter="[20, 20]"
				v-auth="'dgChain'"
			>
				<a-col :span="24">
					<div class="overview">
						<div class="overview-header">
							<div class="overview-title">
								<span class="desc"> 数据概览 </span>
								<span class="time"> 数据更新时间：{{ overview.updateTime || '' }} </span>
							</div>
							<div>
								<a-select
									v-model="overviewForm.type"
									@change="changeType"
									v-if="VUEX_ST_COMPANYSUER.company && VUEX_ST_COMPANYSUER.company.group"
								>
									<img
										src="../../../assets/imgs/workbench/down.png"
										alt=""
										slot="suffixIcon"
										style="width: 14px; position: relative; top: -2px"
									/>
									<a-select-option value="COMPANY"> 企业统计 </a-select-option>
									<a-select-option value="GROUP"> 集团统计 </a-select-option>
								</a-select>
								<a-tooltip title="导出">
									<img
										src="../../../assets/imgs/workbench/export.png"
										alt=""
										style="width: 14px; margin-left: 30px; cursor: pointer"
										@click="setExportFilesType(1, 'TOTAL')"
									/>
								</a-tooltip>
							</div>
						</div>
						<div class="overview-main">
							<div class="overview-main-item">
								<div class="item-main">
									<div class="item-main-title">
										<img src="../../../assets/imgs/workbench/u95.png" />
									</div>
									<div class="item-main-sum">
										<div class="name">上游供应商</div>
										<div class="num">
											{{ unit(overview.upProviderCount) }}
										</div>
									</div>
								</div>
							</div>
							<div class="overview-main-item">
								<div class="item-main">
									<div class="item-main-title">
										<img src="../../../assets/imgs/workbench/u102.png" />
									</div>
									<div class="item-main-sum">
										<div class="name">金融机构</div>
										<div class="num">
											{{ unit(overview.bankProviderCount) }}
										</div>
									</div>
								</div>
							</div>
							<div class="overview-main-item">
								<div class="item-main">
									<div class="item-main-title">
										<img src="../../../assets/imgs/workbench/u109.png" />
									</div>
									<div class="item-main-sum">
										<div class="name">下游客户</div>
										<div class="num">
											{{ unit(overview.downProviderCount) }}
										</div>
									</div>
								</div>
							</div>
							<div class="overview-main-item">
								<div class="item-main">
									<div class="item-main-title">
										<img src="../../../assets/imgs/workbench/u116.png" />
									</div>
									<div class="item-main-sum">
										<div class="name">执行中业务线数</div>
										<div class="num">
											{{ unit(overview.businessLineCount) }}
										</div>
									</div>
								</div>
							</div>
							<div class="overview-main-item">
								<div class="item-main">
									<div class="item-main-title">
										<img src="../../../assets/imgs/workbench/u124.png" />
									</div>
									<div class="item-main-sum">
										<div class="name">累计放款金额</div>
										<div class="num">
											{{ overview.totalLoanAmount }}<span class="unit">{{ overview.unit }}元</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="9">
					<div class="contract">
						<div class="title">
							合同签署情况
							<div style="float: right; position: relative; top: -4px">
								<DatePicker
									@send="getContract"
									dateClass="getContract"
								></DatePicker>
								<a-tooltip title="导出">
									<img
										src="../../../assets/imgs/workbench/export.png"
										alt=""
										style="width: 14px; height: 14px; margin-left: 30px; cursor: pointer"
										@click="setExportFilesType(2, contractDate)"
									/>
								</a-tooltip>
							</div>
						</div>
						<a-row>
							<a-col :span="24">
								<div
									class="sum"
									style="margin-bottom: 24px"
								>
									新增采购合同量
									<span>{{ totalDespatchQuantityByNewContract }}</span
									>{{ totalDespatchQuantityByNewContractUnit }}(吨)
								</div>
							</a-col>
							<a-col :span="24">
								<div
									style="text-align: center; margin-bottom: 48px; padding-top: 24px"
									v-if="totalDespatchQuantityByNewContract == 0 && !contractLoading"
								>
									<div class="nodata-title">煤炭品类</div>
									<img
										src="../../../assets/imgs/workbench/nodata.png"
										alt=""
										style="width: 189px; height: 232px; margin: 0"
									/>
								</div>
								<div v-else>
									<div
										id="transportSum3"
										style="height: 295px; width: 100%; display: inline-block; margin-bottom: 24px"
									></div>
								</div>
							</a-col>
							<a-col :span="24">
								<div
									style="text-align: center"
									v-if="totalDespatchQuantityByNewContract == 0 && !contractLoading"
								>
									<div class="nodata-title">运输方式</div>
									<img
										src="../../../assets/imgs/workbench/nodata.png"
										alt=""
										style="width: 189px; height: 232px; margin: 0"
									/>
								</div>
								<div v-else>
									<div
										id="transportSum4"
										style="height: 295px; width: 100%; display: inline-block"
									></div>
								</div>
							</a-col>
						</a-row>
					</div>
				</a-col>
				<a-col :span="10">
					<div class="contract">
						<div class="title">
							发运情况
							<div style="float: right; position: relative; top: -4px">
								<DatePicker
									@send="getDespatc"
									dateClass="getDespatc"
								>
								</DatePicker>
								<a-tooltip title="导出">
									<img
										src="../../../assets/imgs/workbench/export.png"
										alt=""
										style="width: 14px; height: 14px; margin-left: 30px; cursor: pointer"
										@click="setExportFilesType(3, despatcDate)"
									/>
								</a-tooltip>
							</div>
						</div>
						<a-row>
							<a-col :span="24">
								<div
									class="sum"
									style="margin-bottom: 24px"
								>
									发运量
									<span>{{ totalDespatchQuantity }}</span
									>{{ totalDespatchQuantityUnit }}(吨)
								</div>
							</a-col>
							<a-col :span="24">
								<div
									style="text-align: center; margin-bottom: 48px; padding-top: 24px"
									v-if="totalDespatchQuantity == 0 && !despatchLoading"
								>
									<div class="nodata-title">煤炭品类</div>
									<img
										src="../../../assets/imgs/workbench/nodata.png"
										alt=""
										style="width: 189px; height: 232px; margin: 0"
									/>
								</div>
								<div v-else>
									<div
										id="transportSum1"
										style="height: 295px; width: 100%; display: inline-block; margin-bottom: 24px"
									></div>
								</div>
							</a-col>
							<a-col :span="24">
								<div
									style="text-align: center"
									v-if="totalDespatchQuantity == 0 && !despatchLoading"
								>
									<div class="nodata-title">运输方式</div>
									<img
										src="../../../assets/imgs/workbench/nodata.png"
										alt=""
										style="width: 189px; height: 232px; margin: 0"
									/>
								</div>
								<div v-else>
									<div
										id="transportSum2"
										style="height: 295px; width: 100%; display: inline-block"
									></div>
								</div>
							</a-col>
						</a-row>
					</div>
				</a-col>
				<a-col :span="5">
					<a-row>
						<div
							class="capital"
							style="margin-bottom: 20px"
						>
							<div class="title">
								自有资金
								<div style="">
									<DatePicker2
										style="position: absolute"
										ref="datePicker"
										:isShow="false"
										dateClass="getOwnerPay"
										@send="getOwnerPay"
									></DatePicker2>
									<div class="new-date">
										<span
											@click="openDatePicker"
											style="color: rgba(0, 0, 0, 0.65); font-size: 14px; vertical-align: sub; cursor: pointer"
										>
											{{ ownerTime }}
											<img
												src="../../../assets/imgs/workbench/down.png"
												alt=""
												slot="suffixIcon"
												style="width: 14px; height: 14px; position: relative; top: -2px"
											/>
										</span>
										<a-tooltip title="导出">
											<img
												src="../../../assets/imgs/workbench/export.png"
												alt=""
												style="width: 14px; height: 14px; margin-left: 30px; cursor: pointer"
												@click="setExportFilesType(4, ownerDate)"
											/>
										</a-tooltip>
									</div>
								</div>
							</div>
							<div class="capital-item">
								<img
									src="../../../assets/imgs/workbench/capital-1.png"
									alt=""
								/>
								<div style="flex: 1">
									付款金额
									<div class="sum">
										<span>{{ ownerPay.payAmount }}</span
										><i>{{ ownerPay.unit }}元</i>
									</div>
								</div>
							</div>
							<div
								class="capital-item"
								style="background: #f4fbfa"
							>
								<img
									src="../../../assets/imgs/workbench/capital-2.png"
									alt=""
								/>
								<div style="flex: 1">
									回款金额
									<div class="sum">
										<span>{{ ownerPay.repayAmount }}</span
										><i>{{ ownerPay.reUnit }}元</i>
									</div>
								</div>
							</div>
						</div>
						<div class="capital">
							<div class="title">
								融资资金
								<div
									style="float: right"
									class="uscc-select"
								>
									<DatePicker2
										ref="datePicker2"
										:isShow="false"
										dateClass="getbankUscc"
										@send="getbankUscc"
									></DatePicker2>
									<div class="new-date2">
										<a-select
											v-model="bankUscc"
											@change="getbankUscc(bankUsccDate, organizationTime)"
											:dropdownMatchSelectWidth="false"
											style="width: 70px"
										>
											<img
												src="../../../assets/imgs/workbench/down.png"
												alt=""
												slot="suffixIcon"
												style="width: 14px; height: 14px; position: relative; top: -2px"
											/>
											<a-select-option
												:value="item.bankUscc"
												v-for="(item, index) in bankUsccListOne"
												:key="index"
											>
												{{ item.bankName.replace('郑州'+systemConfig.name+'有限公司', '供应链资金') }}
											</a-select-option>
										</a-select>
										<span
											@click="openDatePicker2"
											class="new-date-arrow"
										>
											{{ organizationTime }}
										</span>
										<img
											src="../../../assets/imgs/workbench/down.png"
											alt=""
											slot="suffixIcon"
											style="width: 14px; height: 14px; position: relative; top: -2px"
										/>
										<span style="display: inline-block; width: 10%">
											<a-tooltip title="导出">
												<img
													src="../../../assets/imgs/workbench/export.png"
													alt=""
													style="width: 14px; height: 14px; margin-left: 10px; cursor: pointer; vertical-align: baseline"
													@click="setExportFilesType(5, bankUsccDate)"
												/>
											</a-tooltip>
										</span>
									</div>
								</div>
							</div>
							<div
								class="capital-item"
								style="background: #f5f3ff"
							>
								<img
									src="../../../assets/imgs/workbench/capital-3.png"
									alt=""
								/>
								<div style="flex: 1">
									放款金额
									<div class="sum">
										<span>{{ organizationPay.payAmount }}</span
										><i>{{ organizationPay.unit }}元</i>
									</div>
								</div>
							</div>
							<div
								class="capital-item"
								style="background: #fff5f0"
							>
								<img
									src="../../../assets/imgs/workbench/capital-4.png"
									alt=""
								/>
								<div style="flex: 1">
									还款金额
									<div class="sum">
										<span>{{ organizationPay.repayAmount }}</span
										><i>{{ organizationPay.reUnit }}元</i>
									</div>
								</div>
							</div>
						</div>
					</a-row>
				</a-col>
			</a-row>
		</div>
		<div class="risk-control">
			<a-row :gutter="20">
				<a-col :span="12">
					<div class="title">
						预警提醒<img
							src="../../../assets/imgs/workbench/icon.png"
							alt=""
							style="width: 8px; margin-bottom: 0"
						/>
					</div>
					<a-row :gutter="20">
						<a-col :span="8">
							<div class="item h">
								<img
									src="../../../assets/imgs/workbench/h.png"
									alt=""
								/>
								<div class="num">{{ riskData.highCount }} <span>/项</span></div>
								<div class="level">高风险</div>
								<div class="text">有风险记得要及时处理</div>
								<div
									class="handle-btn"
									@click="goRisk('HIGH')"
								>
									立即处理<span></span>
								</div>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="item m">
								<img
									src="../../../assets/imgs/workbench/m.png"
									alt=""
								/>
								<div class="num">{{ riskData.mediumCount }} <span>/项</span></div>
								<div
									class="level"
									style="background: #fef5eb; color: #fb9f3e"
								>
									中风险
								</div>
								<div class="text">有风险记得要及时处理</div>
								<div
									class="handle-btn"
									@click="goRisk('MEDIUM')"
								>
									立即处理<span></span>
								</div>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="item l">
								<img
									src="../../../assets/imgs/workbench/l.png"
									alt=""
								/>
								<div class="num">{{ riskData.lowCount }} <span>/项</span></div>
								<div
									class="level"
									style="background: #eef4fe; color: #4682f3"
								>
									低风险
								</div>
								<div class="text">很棒!目前暂无风险存在</div>
								<div
									class="handle-btn"
									@click="goRisk('LOW')"
								>
									立即处理<span></span>
								</div>
							</div>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="12">
					<div class="title">公告</div>
					<div class="gong">
						<AutoList :listData="gongList" />
						<div
							v-if="!gongList.length"
							class="no-msg"
						>
							暂无公告
						</div>
					</div>
				</a-col>
			</a-row>
		</div>
		<div class="to-title">待办事项</div>
		<div class="todo-content">
			<div>
				<!-- 区分钢材和煤炭 -->
				<div class="todo-top">
					<div class="todo-top-title">
						<div
							v-for="item in backlogTap"
							:key="item.value"
							class="todo-backlog"
							v-auth="item.auth"
							:class="{ active: backlogValue == item.value }"
							@click="changeBacklogTap(item.value)"
						>
							{{ item.label }}
						</div>
					</div>
					<div class="top-list">
						<div
							class="top-list-item"
							v-for="(item, index) in topData"
							:key="index"
							@click="changeTab(item, $event)"
						>
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
			<div class="todo-bottom">
				<AgencyTable
					:data="currentData"
					:columnsData="currentColumns"
				/>
			</div>
		</div>
		<a-modal
			:title="false"
			:visible="exportFilesVisible"
			centered
			:footer="null"
			@cancel="exportFilesVisible = false"
			width="490px"
		>
			<div class="export-title">您确定要导出该数据吗？</div>
			<div class="export-desc">成功导出后可在保存路径中查看，无需下载可直接关闭退出该操作</div>
			<div class="export-btn">
				<div
					@click="exportFilesVisible = false"
					class="normal"
				>
					退出
				</div>
				<div
					@click="exportFiles"
					class="primary"
				>
					开始下载
				</div>
			</div>
		</a-modal>
		<!-- 铁瑞系公司跳转导航 -->
		<TieRuiGuide ref="tieRuiGuide" v-if="isBelongTieRui"/>
	</div>
</template>
<script>
import { tradeData, steelsCommonTradeData, steelsCoreTradeData } from '../config/columnsd.js';
import {
	API_workbenchConfigList,
	API_workbenchGongList,
	API_GetRiskWorkbenchList,
	API_GetWorkDataOverview,
	API_GetWorkDespatchData,
	API_GetWorkOwnData,
	API_GetWorkBankList,
	API_GetWorkBankData,
	API_GetWorkBankExportOverview,
	API_GetWorkContractExport,
	API_GetWorkBankExportDespatch,
	API_GetWorkBankExportMoney,
	API_GetWorkBankExportFund,
	API_GetWorkContractData
} from '../api/index';
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
import AutoList from '../components/AutoList';
import AgencyTable from '../components/AgencyTable';
import comDownload from '@sub/utils/comDownload.js';
import DatePicker from '../components/DatePicker.vue';
import DatePicker2 from '../components/DatePicker2.vue';
import systemConfig from '@/v2/config/common';
import { hasAuth } from '@/v2/utils/checkAuth';
import moment from 'moment';
import TieRuiGuide from "@/components/TieRuiGuide/index.vue";
import { cancelUnset } from '@/v2/center/home/lib/rem';
function getTextWidth(text, fontSize) {
	// 创建一个canvas元素用于测量文本
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	// 设置字体大小
	context.font = `${fontSize}px Arial`;

	// 测量文本宽度
	const metrics = context.measureText(text);
	return metrics.width;
}
export default {
	data() {
		return {
			systemConfig,
			currentColumns: [],
			currentData: [],
			gongList: [],
			riskData: {},
			overviewForm: {
				type: 'COMPANY',
				time: 'YEAR'
			},
			ownerPay: {
				payAmount: '',
				repayAmount: ''
			},
			contractDate: {},
			despatcDate: {},
			ownerDate: {},
			ownerTime: '本年',
			organizationTime: '本年',
			despatchTime: 'YEAR',
			contractTime: 'YEAR',
			despatchLoading: true,
			contractLoading: true,
			totalDespatchQuantity: 0,
			totalDespatchQuantityUnit: '',
			organizationPay: {
				payAmount: '',
				repayAmount: ''
			},

			overview: {
				unit: ''
			},
			//发运情况
			totalDespatchQuantityByNewContract: 0,
			totalDespatchQuantityByNewContractUnit: '',
			transportOptions1: {
				legend: {
					orient: 'horizontal',
					top: 'bottom',
					icon: 'circle',
					itemWidth: 12,
					itemHeight: 12,
					textStyle: {
						fontSize: '14'
					}
				},
				series: [
					{
						type: 'pie',
						radius: ['36%', '63%'],
						center: ['50%', '50%'],
						data: [],
						startAngle: 60,
						minAngle: 15,
						label: {
							normal: {
								//formatter: '{icon|●}{b|{b}{c}吨}{per|{d}%}',
								formatter: params => {
									let { value, name, percent } = params;
									if (getTextWidth(value, 14) > 30) {
										return `{icon|●}{b|${name}}\n{b|${value}吨}{per|${percent}%}`;
									}
									return `{icon|●}{b|${name}}{b|${value}吨}{per|${percent}%}`;
								},
								backgroundColor: '#fff',
								shadowColor: 'rgba(6,31,77,0.1)',
								shadowOffsetX: 2,
								shadowOffsetY: 2,
								shadowBlur: 15,
								position: 'outer',
								alignTo: 'edge',
								edgeDistance: 10,
								borderRadius: 4,
								lineHeight: 21,
								padding: [7, 8],
								rich: {
									b: {
										color: 'rgba(0,0,0,0.8)',
										fontSize: 14
									},
									icon: {
										color: 'inherit',
										padding: [0, 8, 0, 0]
									},
									per: {
										color: 'inherit',
										fontSize: 14,
										padding: [0, 8, 0, 4]
									}
								}
							}
						},
						hoverAnimation: false,
						color: [
							'#4682F3',
							'rgba(70,130,243,0.85)',
							'rgba(70,130,243,0.75)',
							'rgba(70,130,243,0.65)',
							'rgba(70,130,243,0.55)',
							'rgba(70,130,243,0.4)',
							'rgba(70,130,243,0.3)'
						]
					}
				]
			},
			transportOptions3: {
				legend: {
					orient: 'horizontal',
					top: 'bottom',
					icon: 'circle',
					itemWidth: 12,
					itemHeight: 12,
					textStyle: {
						fontSize: '14'
					}
				},
				series: [
					{
						label: {
							normal: {
								formatter: params => {
									let { value, name, percent } = params;
									if (getTextWidth(value, 14) > 30) {
										return `{icon|●}{b|${name}}\n{b|${value}吨}{per|${percent}%}`;
									}
									return `{icon|●}{b|${name}}{b|${value}吨}{per|${percent}%}`;
								},
								backgroundColor: '#fff',
								shadowColor: 'rgba(6,31,77,0.1)',
								shadowOffsetX: 2,
								shadowOffsetY: 2,
								shadowBlur: 15,
								position: 'outer',
								alignTo: 'edge',
								edgeDistance: 10,
								borderRadius: 4,
								lineHeight: 21,
								padding: 8,
								rich: {
									b: {
										color: 'rgba(0,0,0,0.8)',
										fontSize: 14
									},
									icon: {
										color: 'inherit',
										padding: [0, 8, 0, 0]
									},
									per: {
										color: 'inherit',
										fontSize: 14,
										padding: [0, 8, 0, 4]
									}
								}
							}
						},
						type: 'pie',
						minAngle: 10,
						startAngle: 60,
						radius: ['36%', '63%'],
						center: ['50%', '50%'],
						data: [],
						hoverAnimation: false,
						color: [
							'#4682F3',
							'rgba(70,130,243,0.85)',
							'rgba(70,130,243,0.75)',
							'rgba(70,130,243,0.65)',
							'rgba(70,130,243,0.55)',
							'rgba(70,130,243,0.4)',
							'rgba(70,130,243,0.3)'
						]
					}
				]
			},
			transportOptions2: {
				legend: {
					orient: 'horizontal',
					top: 'bottom',
					icon: 'circle',
					itemWidth: 12,
					itemHeight: 12,
					textStyle: {
						fontSize: '14'
					}
				},
				series: [
					{
						label: {
							normal: {
								formatter: params => {
									let { value, name, percent } = params;
									if (getTextWidth(value, 14) > 30) {
										return `{icon|●}{b|${name}}\n{b|${value}吨}{per|${percent}%}`;
									}
									return `{icon|●}{b|${name}}{b|${value}吨}{per|${percent}%}`;
								},
								backgroundColor: '#fff',
								shadowColor: 'rgba(6,31,77,0.1)',
								shadowOffsetX: 2,
								shadowOffsetY: 2,
								shadowBlur: 15,
								position: 'outer',
								alignTo: 'edge',
								edgeDistance: 10,
								borderRadius: 4,
								lineHeight: 21,
								padding: 8,
								rich: {
									b: {
										color: 'rgba(0,0,0,0.8)',
										fontSize: 14
									},
									icon: {
										color: 'inherit',
										padding: [0, 8, 0, 0]
									},
									per: {
										color: 'inherit',
										fontSize: 14,
										padding: [0, 8, 0, 4]
									}
								}
							}
						},
						type: 'pie',
						startAngle: 30,
						radius: ['36%', '63%'],
						center: ['50%', '50%'],
						data: [],
						hoverAnimation: false,
						color: ['#FF9C86', '#4682F3', '#67D2CA', '#FFC95D', '#F9775B', '#7AA1FF', '#d3d3d3', '#e9e9e9']
					}
				]
			},
			transportOptions4: {
				legend: {
					orient: 'horizontal',
					top: 'bottom',
					icon: 'circle',
					itemWidth: 12,
					itemHeight: 12,
					textStyle: {
						fontSize: '14'
					}
				},
				series: [
					{
						type: 'pie',
						startAngle: 30,
						radius: ['36%', '63%'],
						center: ['50%', '50%'],
						data: [],
						hoverAnimation: false,
						color: ['#FF9C86', '#4682F3', '#67D2CA', '#FFC95D', '#F9775B', '#7AA1FF', '#d3d3d3', '#e9e9e9'],
						label: {
							normal: {
								formatter: params => {
									let { value, name, percent } = params;
									if (getTextWidth(value, 14) > 30) {
										return `{icon|●}{b|${name}}\n{b|${value}吨}{per|${percent}%}`;
									}
									return `{icon|●}{b|${name}}{b|${value}吨}{per|${percent}%}`;
								},
								backgroundColor: '#fff',
								shadowColor: 'rgba(6,31,77,0.1)',
								shadowOffsetX: 2,
								shadowOffsetY: 2,
								shadowBlur: 15,
								position: 'outer',
								alignTo: 'edge',
								edgeDistance: 10,
								borderRadius: 4,
								lineHeight: 21,
								padding: 8,
								rich: {
									b: {
										color: 'rgba(0,0,0,0.8)',
										fontSize: 14
									},
									icon: {
										color: 'inherit',
										padding: [0, 8, 0, 0]
									},
									per: {
										color: 'inherit',
										fontSize: 14,
										padding: [0, 8, 0, 4]
									}
								}
							}
						}
					}
				]
			},
			bankUsccList: [
				{
					bankName: '全部',
					bankUscc: 'All'
				}
			], //资方列表
			bankUscc: '', //资金使用情况
			bankUsccDate: {},
			exportFilesVisible: false, //导出弹框
			exportFilesType: '1', //导出模块类型
			exportTime: '', // 导出日期
			exportFilesTypeList: [
				{
					text: '数据概览',
					value: '1',
					url: API_GetWorkBankExportOverview
				},
				{
					text: '合同签署情况',
					value: '2',
					url: API_GetWorkContractExport
				},
				{
					text: '发运情况',
					value: '3',
					url: API_GetWorkBankExportDespatch
				},
				{
					text: '自有资金',
					value: '4',
					url: API_GetWorkBankExportMoney
				},
				{
					text: '融资资金',
					value: '5',
					url: API_GetWorkBankExportFund
				}
			], //模块列表
			// 待办事项
			backlogTap: [
				{
					value: 'coal',
					label: '煤炭',
					auth: ''
				},
				{
					value: 'steels',
					label: '钢材',
					auth: 'steel'
				}
			],
			backlogValue: 'coal',
			templeteData: ''
		};
	},
	components: {
		AutoList,
		AgencyTable,
		DatePicker,
		DatePicker2,
		TieRuiGuide
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051'
		},
		bankUsccListOne() {
			return this.bankUsccList;
		},
		bankUsccListTwo() {
			return this.bankUsccList.slice(3);
		},
		// 是否是核心企业
		isCore() {
			return this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY';
		},
		topData() {
			let data = [];
			if (this.backlogValue == 'coal') {
				data = tradeData.filter(item => hasAuth(item.auth));
			} else {
				if (this.isCore) {
					data = steelsCoreTradeData.filter(item => !item.auth || hasAuth(item.auth));
				} else {
					data = steelsCommonTradeData.filter(item => !item.auth || hasAuth(item.auth));
				}
			}
			if (data.length == 0) return;
			data.map(item => {
				item.columns.map(i => {
					if (i.title === '操作') {
						i.scopedSlots = { customRender: 'action' };
					}
				});
			});
			this.currentColumns = data[0].columns;
			this.API_workbenchConfigList(data[0]);
			this.$nextTick(() => {
				$('.top-list').find('.top-list-item').eq(0).addClass('active');
			});

			return data;
		}
	},
	beforeRouteLeave(to, from, next) {
		// 铁瑞系公司登录系统-非账户中心菜单下展示提示弹窗
		const passFlag = to.fullPath.indexOf('/center/account') !== -1 || to.fullPath.indexOf('/center/monitoring') !== -1 || to.fullPath.indexOf('/center/assets') !== -1 || to.fullPath.indexOf('/center/financing') !== -1 || to.fullPath.indexOf('/center/financeCenter') !== -1
		if (this.isBelongTieRui) {
			if (!passFlag) {
				this.$refs.tieRuiGuide.showModal()
			} else {
				next()
			}
		} else {
			next()
		}
	},
	mounted: function () {
		cancelUnset();
		this.getGongData();
		this.getRiskData();
		//核心企业加载数据概览
		if (this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY') {
			this.getOverview();
			this.getContract();
			this.getDespatc();
			this.getOwnerPay();
			this.getbankUscc();
			this.getbankUsccList();
		}
		if (this.isBelongTieRui) {
			this.$refs.tieRuiGuide.showModal()
		}
	},
	methods: {
		changeBacklogTap(value) {
			this.backlogValue = value;
			const list = $('.top-list').find('.top-list-item');
			for (let i = 0; i < list.length; i++) {
				const item = list[i];
				item.classList?.remove('active');
			}
		},
		changeTab(item, e) {
			e && $(e.target).addClass('active');
			e &&$ (e.target).siblings().removeClass('active');
			this.currentColumns = item.columns;
			this.API_workbenchConfigList(item);
		},
		getGongData() {
			API_workbenchGongList().then(res => {
				this.gongList = res.data || [];
			});
		},
		goRisk(level) {
			this.$router.push({
				path: '/center/message/index',
				query: {
					riskLevel: level
				}
			});
		},
		getRiskData() {
			API_GetRiskWorkbenchList().then(res => {
				this.riskData = res.result || {};
			});
		},
		//加载数据概览
		getOverview() {
			API_GetWorkDataOverview({
				type: this.overviewForm.type,
				time: 'TOTAL'
			}).then(res => {
				if (res.success) {
					this.overview = res.data;
					this.overview.totalLoanAmount = this.unit(this.overview.totalLoanAmount || 0);
					if (typeof this.overview.totalLoanAmount === 'string') {
						if (this.overview.totalLoanAmount.includes('万') || this.overview.totalLoanAmount.includes('亿')) {
							this.overview.unit = this.overview.totalLoanAmount[this.overview.totalLoanAmount.length - 1];
							this.overview.totalLoanAmount = this.overview.totalLoanAmount.slice(0, -1);
						}
					}
				}
			});
			// //加载发运情况
			// this.getDespatc();
			// //加载资金使用情况
			// //加载自由资金情况
			// // this.getOwnerPay()
			//
			// this.getbankUscc()
		},
		getDespatc(obj) {
			this.despatchLoading = true;
			let params = {};
			if (!obj) {
				params = {
					startDate: moment().startOf('year').format('YYYY-MM-DD'),
					endDate: moment().startOf('day').format('YYYY-MM-DD'),
					type: this.overviewForm.type
				};
			} else {
				params = {
					type: this.overviewForm.type,
					...obj
				};
			}
			this.despatcDate = {
				startDate: params.startDate || null,
				endDate: params.endDate || null
			};
			API_GetWorkDespatchData(params).then(result => {
				if (result.success) {
					this.despatchLoading = false;
					const res = result.data;
					this.totalDespatchQuantity = this.unit(res.totalDespatchQuantity || 0);
					if (typeof this.totalDespatchQuantity === 'string') {
						if (this.totalDespatchQuantity.includes('万') || this.totalDespatchQuantity.includes('亿')) {
							this.totalDespatchQuantityUnit = this.totalDespatchQuantity[this.totalDespatchQuantity.length - 1];
							this.totalDespatchQuantity = this.totalDespatchQuantity.slice(0, -1);
						}
					}
					if (res.coalTypeDataList) {
						this.transportOptions1.series[0].data = res.coalTypeDataList.map(item => {
							return {
								value: item.quantity,
								unit: this.unit(item.quantity),
								name: item.typeDesc
							};
						});
					} else {
						this.transportOptions1.series[0].data = [];
					}
					this.transportOptions1.series[0].data.sort((a, b) => {
						return b.value - a.value;
					});
					if (res.transTypeDataList) {
						this.transportOptions2.series[0].data = res.transTypeDataList.map(item => {
							return {
								value: item.quantity,
								unit: this.unit(item.quantity),
								name: item.typeDesc
							};
						});
					} else {
						this.transportOptions2.series[0].data = [];
					}
					this.transportOptions2.series[0].data.sort((a, b) => {
						return b.value - a.value;
					});
					if (res.totalDespatchQuantity) {
						//渲染图像
						this.$nextTick(() => {
							let transportSum1 = document.getElementById('transportSum1');
							let transportchart1 = echarts.init(transportSum1);
							transportchart1.setOption(this.transportOptions1);
							let transportSum2 = document.getElementById('transportSum2');
							let transportchart2 = echarts.init(transportSum2);
							transportchart2.setOption(this.transportOptions2);
						});
					}
				}
			});
		},
		getContract(obj) {
			this.contractLoading = true;
			let params = {};
			if (!obj) {
				params = {
					startDate: moment().startOf('year').format('YYYY-MM-DD'),
					endDate: moment().startOf('day').format('YYYY-MM-DD'),
					type: this.overviewForm.type
				};
			} else {
				params = {
					type: this.overviewForm.type,
					...obj
				};
			}
			this.contractDate = { startDate: params.startDate || null, endDate: params.endDate || null };

			API_GetWorkContractData(params).then(result => {
				if (result.success) {
					this.contractLoading = false;
					const res = result.data;
					this.totalDespatchQuantityByNewContract = this.unit(res.totalDespatchQuantityByNewContract || 0);
					if (typeof this.totalDespatchQuantityByNewContract === 'string') {
						if (
							this.totalDespatchQuantityByNewContract.includes('万') ||
							this.totalDespatchQuantityByNewContract.includes('亿')
						) {
							this.totalDespatchQuantityByNewContractUnit =
								this.totalDespatchQuantityByNewContract[this.totalDespatchQuantityByNewContract.length - 1];
							this.totalDespatchQuantityByNewContract = this.totalDespatchQuantityByNewContract.slice(0, -1);
						}
					}
					if (res.coalTypeDataListByNewContract) {
						this.transportOptions3.series[0].data = res.coalTypeDataListByNewContract.map(item => {
							return {
								value: item.quantity,
								unit: this.unit(item.quantity),
								name: item.typeDesc
							};
						});
					} else {
						this.transportOptions3.series[0].data = [];
					}
					this.transportOptions3.series[0].data.sort((a, b) => {
						return b.value - a.value;
					});
					if (res.transTypeDataListByNewContract) {
						this.transportOptions4.series[0].data = res.transTypeDataListByNewContract.map(item => {
							return {
								value: item.quantity,
								unit: this.unit(item.quantity),
								name: item.typeDesc
							};
						});
					} else {
						this.transportOptions4.series[0].data = [];
					}
					this.transportOptions4.series[0].data.sort((a, b) => {
						return b.value - a.value;
					});
					if (res.totalDespatchQuantityByNewContract) {
						this.$nextTick(() => {
							let transportSum3 = document.getElementById('transportSum3');
							let transportchart3 = echarts.init(transportSum3);
							transportchart3.setOption(this.transportOptions3);
							let transportSum4 = document.getElementById('transportSum4');
							let transportchart4 = echarts.init(transportSum4);
							transportchart4.setOption(this.transportOptions4);
						});
					}
				}
			});
		},
		//加载资金使用情况
		async getbankUsccList() {
			this.bankUsccList = []; //资方列表
			this.bankUscc = '';
			await API_GetWorkBankList({
				type: this.overviewForm.type
			}).then(res => {
				if (res.success) {
					this.bankUsccList = res.data.concat(this.bankUsccList).concat([
						{
							bankName: '全部',
							bankUscc: ''
						}
					]);
					this.bankUscc = '';
				}
			});
		},
		//加载资金使用情况
		async getbankUscc(obj, organizationTime) {
			this.organizationTime = organizationTime;
			if (!obj && !organizationTime) {
				this.organizationTime = '本年';
			}
			if (!organizationTime && obj) {
				this.organizationTime = '自定义';
			}
			let params = {};
			if (!obj) {
				params = {
					startDate: moment().startOf('year').format('YYYY-MM-DD'),
					endDate: moment().startOf('day').format('YYYY-MM-DD'),
					type: this.overviewForm.type,
					bankUscc: this.bankUscc
				};
			} else {
				params = {
					type: this.overviewForm.type,
					bankUscc: this.bankUscc,
					...obj
				};
			}
			this.bankUsccDate = {
				startDate: params.startDate || null,
				endDate: params.endDate || null
			};
			await API_GetWorkBankData(params).then(res => {
				if (res.success) {
					this.organizationPay = res.data;
					this.organizationPay.payAmount = this.unit(this.organizationPay.payAmount || 0);
					this.organizationPay.repayAmount = this.unit(this.organizationPay.repayAmount || 0);
					if (typeof this.organizationPay.payAmount === 'string') {
						if (this.organizationPay.payAmount.includes('万') || this.organizationPay.payAmount.includes('亿')) {
							this.organizationPay.unit = this.organizationPay.payAmount[this.organizationPay.payAmount.length - 1];
							this.organizationPay.payAmount = this.organizationPay.payAmount.slice(0, -1);
						}
					}
					if (typeof this.organizationPay.repayAmount === 'string') {
						if (this.organizationPay.repayAmount.includes('万') || this.organizationPay.repayAmount.includes('亿')) {
							this.organizationPay.reUnit = this.organizationPay.repayAmount[this.organizationPay.repayAmount.length - 1];
							this.organizationPay.repayAmount = this.organizationPay.repayAmount.slice(0, -1);
						}
					}
				}
			});
		},
		openDatePicker() {
			this.$refs.datePicker.open();
		},
		openDatePicker2() {
			this.$refs.datePicker2.open();
		},
		getOwnerPay(obj, ownerTime) {
			this.ownerTime = ownerTime;
			if (!obj && !ownerTime) {
				this.ownerTime = '本年';
			}
			if (!ownerTime && obj) {
				this.ownerTime = '自定义';
			}
			let params = {};
			if (!obj) {
				params = {
					startDate: moment().startOf('year').format('YYYY-MM-DD'),
					endDate: moment().startOf('day').format('YYYY-MM-DD'),
					type: this.overviewForm.type
				};
			} else {
				params = {
					type: this.overviewForm.type,
					...obj
				};
			}
			this.ownerDate = {
				startDate: params.startDate || null,
				endDate: params.endDate || null
			};
			API_GetWorkOwnData(params).then(res => {
				if (res.success) {
					this.ownerPay = res.data;
					this.ownerPay.payAmount = this.unit(this.ownerPay.payAmount || 0);
					this.ownerPay.repayAmount = this.unit(this.ownerPay.repayAmount || 0);
					if (typeof this.ownerPay.payAmount === 'string') {
						if (this.ownerPay.payAmount.includes('万') || this.ownerPay.payAmount.includes('亿')) {
							this.ownerPay.unit = this.ownerPay.payAmount[this.ownerPay.payAmount.length - 1];
							this.ownerPay.payAmount = this.ownerPay.payAmount.slice(0, -1);
						}
					}
					if (typeof this.ownerPay.repayAmount === 'string') {
						if (this.ownerPay.repayAmount.includes('万') || this.ownerPay.repayAmount.includes('亿')) {
							this.ownerPay.reUnit = this.ownerPay.repayAmount[this.ownerPay.repayAmount.length - 1];
							this.ownerPay.repayAmount = this.ownerPay.repayAmount.slice(0, -1);
						}
					}
				}
			});
		},
		//单位换算
		unit(sum) {
			if (sum) {
				if (Number(sum) > 100000000) {
					return Math.round(Number(sum) / 1000000) / 100 + '亿';
				} else if (Number(sum) > 10000) {
					return Math.round(Number(sum) / 100) / 100 + '万';
				} else {
					return Math.round(Number(sum) * 100) / 100;
				}
			} else {
				return '0';
			}
		},
		setExportFilesType(exportFilesType, exportTime) {
			this.exportFilesVisible = true;
			this.exportFilesType = exportFilesType;
			this.exportTime = exportTime;
		},
		//导出数据概览
		exportFiles() {
			this.exportFilesVisible = false;
			let { text, url } = this.exportFilesTypeList.find(item => {
				return item.value == this.exportFilesType;
			});
			let params = {};
			if (this.exportTime == 'TOTAL') {
				params.time = 'TOTAL';
			} else {
				params = {
					...this.exportTime
				};
			}
			url(params).then(res => {
				comDownload(res, undefined, `${text}.xls`);
			});
		},
		// 获取待办数据
		API_workbenchConfigList(item) {
			this.currentData = [];
			API_workbenchConfigList({
				apipath: item.api,
				query: item.query || {},
				methods: item.methods
			}).then(res => {
				// 需要转换参数
				if (Array.isArray(res.data)) {
					this.currentData = res.data || [];
				} else {
					this.currentData = res.data.records || [];
				}

				if (item.api.includes('statement/confirmStatementList')) {
					this.currentData = this.currentData.map(el => el.statement);
				}

				this.currentData.forEach(el => {
					// 合同签章的 发货申请

					if (item.api.includes('api/workbench/getAllContract') || item.api.includes('contract/shipmentToDoContract')) {
						el.contractId = el.contractId ? el.contractId : el.id;
						el.origin = el.contractType == '销售合同' ? 'sell' : 'buy';
					}
					// 收货确认
					if (item.api.includes('receive/getReceivingPage')) {
						el.deliverId = el.id;
					}
					// 开提单
					if (item.api.includes('takeDelivery/getApplyPageList')) {
						el.date = `${el.effectiveStartDate}-${el.effectiveEndDate}`;
					}
					/** 判断是否是合同确认 上游合同签章 上游合同确认 */
					if (
						item.api.includes('api/workbench/upstreamContractConfirm') ||
						item.api.includes('api/workbench/upstreamContractSignature') ||
						item.api.includes('api/workbench/confirmContract')
					) {
						el.type = this.VUEX_ST_COMPANYSUER.companyUscc == el.buyerUscc ? 'buy' : 'sell';
					}

					// 关联回款 填写实提
					if (
						item.api.includes('takeDelivery/getCollectionTakeDeliveryList') ||
						item.api.includes('takeDelivery/getRealTakeDeliveryList')
					) {
						//  不用调整任何顺序
						el.date = `${el.takeStartDate}-${el.takeEndDate}`;
						el.num = el.id;
						el.id = el.serialNo;
						el.serialNo = el.applyTakeSerialNo;
					}
				});
			});
		},
		changeType() {
			this.getOverview();
			this.getContract();
			this.getDespatc();
			this.getOwnerPay();
			this.getbankUscc();
			this.getbankUsccList();
		}
	}
};
</script>
<style lang="less" scoped>
.bench-content {
	background: #f0f1f5;
	position: absolute;
	left: -20px;
	top: -20px;
	right: -20px;
	padding: 20px 28px 26px;
}
.content {
	position: relative;
}

.overview {
	.overview-header {
		line-height: 27px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		.overview-title {
			color: #333333;
			.desc {
				font-size: 20px;
				color: #2a2a2a;
				margin-right: 12px;
				font-weight: bold;
				font-family: PingFangSC-Medium;
				vertical-align: middle;
			}
			.time {
				color: rgba(4, 1, 18, 0.8);
				font-size: 14px;
				font-weight: 400;
				vertical-align: middle;
			}
		}
	}

	.overview-main {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 16px;
		padding: 0 28px;
		margin-bottom: 10px;
		.overview-main-item {
			position: relative;
			height: 120px;
			padding: 32px 0 22px;
			width: 20%;
			.item-main {
				display: flex;
				.item-main-title {
					width: 66px;
					height: 66px;
					margin-right: 12px;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.item-main-sum {
					font-size: 24px;
					font-weight: 600;
					color: #383a3f;
					.name {
						height: 20px;
						font-size: 14px;
						font-weight: 400;
						color: rgba(37, 45, 62, 0.65);
						line-height: 20px;
					}
					.num {
						height: 40px;
						font-size: 28px;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.8);
						line-height: 40px;
						margin-top: 6px;
					}
					.unit {
						height: 20px;
						font-size: 14px;
						font-weight: 400;
						color: #666666;
						line-height: 20px;
					}
				}
			}
			&:after {
				display: block;
				content: '';
				width: 2px;
				height: 48px;
				background: #f7f7f7;
				position: absolute;
				right: 22px;
				top: 36px;
			}
			&:last-child {
				&:after {
					display: none;
				}
			}
		}
	}

	.capital {
		padding: 10px 0 0;
		height: 100%;

		.capital-d {
			height: 154px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.capital-d-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.capital-d-r {
					display: inline-block;

					.capital-d-r-c {
						color: #b0b0b0;
						font-size: 12px;
					}
				}
			}
		}

		.capital-com {
			background: #c8e0f6;
			height: 144px;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.capital-com-item {
				width: 50%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #5c5c5c;
				font-size: 12px;

				.item-sum {
					display: flex;
					justify-content: space-around;

					span {
						display: inline-block;
						color: #145dd4;
						font-size: 18px;
					}

					.item-sum-c {
						color: #5c5c5c;
						font-size: 12px;
					}
				}

				.item-title {
					margin-top: 10px;
				}
			}
		}

		.capital-con {
			background: #fff;
			height: 144px;
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;
		}
	}
}

.overview-two {
	background: #2f80ed; /* fallback for old browsers */
	background: -webkit-linear-gradient(to right, #2f80ed, #6090f7); /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(to right, #2f80ed, #6090f7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	padding: 5px 20px;
	border-radius: 4px;
	height: 230px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.overview-two-item {
		flex: 1;
		color: #fff;
		border-bottom: 1px solid #e8e8e8;

		.item-main {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item-main-sum {
				font-size: 16px;
				span {
					font-size: 12px;
				}

				.item-main-title {
					margin-top: 8px;
					font-size: 12px;
				}
			}

			img {
				width: 36px;
				height: 36px;
			}
		}
	}

	.overview-two-item:last-child {
		border: 0;
	}
}
.todo-top {
	background: #fff;
	border-radius: 10px 10px 0px 0px;
	&-title {
		height: 50px;
		line-height: 50px;
		display: flex;
		color: rgba(37, 45, 62, 0.65);
		padding-left: 28px;
		align-items: center;
		border-bottom: 1px solid #f7f7f7;
	}
	.todo-backlog {
		padding: 0 13px;
		height: 100%;
		display: flex;
		margin-right: 62px;
		align-items: center;
		cursor: pointer;
		&.active {
			color: rgba(0, 0, 0, 0.8);
			border-bottom: 2px solid @primary-color;
			font-weight: 500;
		}
	}
}
.to-title {
	margin: 26px 0 20px;
	line-height: 27px;
	font-size: 20px;
	font-weight: bold;
	font-family: PingFangSC-Medium;
	color: rgba(0, 0, 0, 0.8);
}
.todo-content {
	background-color: #fff;
	border-radius: 18px;
}

.risk-control {
	position: relative;
	z-index: 999;
	overflow: hidden;

	.title {
		height: 27px;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		line-height: 27px;
		font-weight: bold;
		margin-bottom: 20px;
	}

	.item {
		flex: 1;
		position: relative;
		height: 330px;
		padding-top: 30px;
		background: #ffffff;
		text-align: center;
		border-radius: 16px;
	}

	img {
		width: 70px;
		margin-bottom: 32px;
	}

	.num {
		font-size: 24px;
		font-weight: 600;
		height: 17px;
		color: #2e3642;
		line-height: 17px;
		span {
			font-size: 12px;
			color: rgba(37, 45, 62, 0.45);
		}
	}
	.level {
		width: 74px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		border-radius: 6px;
		background: #fdf3f3;
		color: #ee3f2c;
		margin: 24px auto 14px;
	}

	.text {
		color: rgba(37, 45, 62, 0.45);
		margin-bottom: 30px;
	}
	.handle-btn {
		width: 100px;
		height: 30px;
		line-height: 30px;
		margin: 0 auto;
		border-radius: 4px;
		cursor: pointer;
		color: #9599a1;
		&:hover {
			color: @primary-color;
			background: rgba(62, 110, 251, 0.1);
			span {
				background: url('../../../assets/imgs/workbench/right.png') no-repeat;
				background-size: cover;
			}
		}
		span {
			display: inline-block;
			width: 12px;
			height: 12px;
			margin-left: 11px;
			margin-bottom: 0;
			background: url('../../../assets/imgs/workbench/right-2.png') no-repeat;
			background-size: cover;
		}
	}
}
.todo-bottom {
	padding: 0 20px 18px;
	margin-bottom: 89px;
	position: relative;
}

.top-list {
	display: flex;
	padding: 18px 20px 0;
}

.top-list-item {
	border-bottom: none;
	padding: 5px 8px;
	color: rgba(37, 45, 62, 0.65);
	background-color: #fff;
	cursor: pointer;
	margin-bottom: 20px;

	&.active {
		background: rgba(70, 130, 243, 0.1);
		border-radius: 4px;
		color: @primary-color;
	}
}

.bottom-content {
	display: flex;
	top: -16px;
	position: relative;
}

.gong,
.message {
	background-color: #fff;
	padding-top: 0;
	box-shadow: 0px 2px 10px 0px #dddfe4;
	border-radius: 4px;
	overflow: hidden;
	position: relative;

	.title {
		padding: 0 16px;
		border-bottom: 1px solid #eef0f2;
		padding-bottom: 15px;
		color: #383a3f;

		position: relative;
	}
}

.check-du {
	font-size: 13px;
	color: #0053db;
	position: absolute;
	right: 7px;
	top: 6px;
	cursor: pointer;
}

.dot {
	font-size: 12px;
	background-color: #f24e4d;
	// position: absolute;
	color: #fff;

	padding: 1px;
	padding-left: 2px;
	padding-right: 2px;
	border-radius: 3px;
	margin-left: 4px;
}

.no-msg {
	position: absolute;
	left: 50%;
	top: 50%;
	font-size: 17px;
	color: #b0b0b0;
	transform: translate(-50%, -50%);
}

.capital {
	background: #ffffff;
	color: #383a3f;
	height: 378px;
	padding: 20px 11px 16px;
	border-radius: 16px;
	.title {
		font-size: 16px;
		font-weight: 500;
		margin-left: 5px;
		color: rgba(0, 0, 0, 0.8);
		line-height: 22px;
		padding-bottom: 20px;
		border-bottom: 1px solid #f7f7f7;
		margin-bottom: 15px;
	}
	.capital-item {
		height: 132px;
		background: #f0faff;
		margin-bottom: 20px;
		display: flex;
		padding-top: 37px;
		padding-left: 12px;
		border-radius: 16px;
		padding-right: 16px;
		font-weight: 400;
		color: rgba(37, 45, 62, 0.65);
		img {
			width: 50px;
			height: 50px;
			margin-right: 12px;
		}
		.sum {
			color: #383a3f;
			font-weight: 400;
			margin-top: 4px;
			line-height: 30px;
			span {
				font-size: 22px;
				font-weight: 600;
			}
			i {
				float: right;
				color: #666666;
			}
		}
	}
}
.contract {
	background: #ffffff;
	color: #383a3f;
	height: 778px;
	padding: 16px 20px;
	border-radius: 16px;
	margin-bottom: 26px;
	.title {
		font-size: 16px;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		line-height: 22px;
		border-bottom: 1px solid #f7f7f7;
		padding-bottom: 20px;
	}
	img {
		width: 36px;
		height: 36px;
		margin: 0 8px 0 28px;
	}
	.sum {
		height: 32px;
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 32px;
		padding: 14px 0 26px;
		span {
			font-weight: 600;
			font-size: 22px;
			margin-left: 20px;
			margin-right: 8px;
		}
	}
}
.section {
	.ant-row {
		height: 121px;
	}
	.title {
		margin-top: 0;
	}
	.sum {
		margin-top: 55px;
		display: inline-block;
		margin-left: 0;
		font-size: 24px;
		height: 24px;
		margin-bottom: 64px;
	}
}
::v-deep {
	.ant-btn-sm {
		padding: 0 13px;
		img {
			margin-right: 8px;
			position: relative;
			bottom: 1px;
		}
	}
	.ant-select-selection-selected-value {
		margin-right: 12px;
	}
	.ant-select-selection {
		border: none !important;
		background: none !important;
		box-shadow: none !important;
	}
	.ant-modal-body {
		padding: 24px 20px;
	}
	.ant-modal-content {
		border-radius: 20px;
	}
}
.export-title {
	height: 28px;
	font-size: 20px;
	font-weight: bold;
	font-family: PingFangSC-Medium;
	color: rgba(0, 0, 0, 0.8);
	line-height: 28px;
	margin-bottom: 18px;
}
.export-desc {
	height: 20px;
	font-size: 14px;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.5);
	line-height: 20px;
	margin-bottom: 50px;
}
.export-btn {
	display: flex;
	justify-content: right;
	div {
		padding: 9px 29px;
		border-radius: 8px;
		cursor: pointer;
	}
	.normal {
		border: 1px solid #eff0f3;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
	}
	.primary {
		background: #3e6efb;
		font-weight: 400;
		color: #ffffff;
		margin-left: 20px;
	}
}
.uscc-select {
	position: relative;
	top: -3px;
	span {
		text-align: right;
	}
}
@media screen and (max-width: 1500px) {
	.uscc-select {
		width: 55%;
	}
	.num {
		font-size: 24px !important;
	}
}
@media screen and (min-width: 1500px) {
	.uscc-select {
		width: 70%;
	}
}
.new-date {
	position: absolute;
	top: 16px;
	right: 10px;
}
.new-date2 {
	position: absolute;
	top: 0px;
	display: flex;
	align-items: center;
	right: 10px;
	justify-content: flex-end;
}
.new-date-arrow {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	vertical-align: sub;
	cursor: pointer;
	width: 50px;
	margin-right: 5px;
}
.nodata-title {
	height: 22px;
	font-size: 16px;
	font-family: PingFangSC-Medium;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 22px;
	margin-bottom: 12px;
}
</style>
