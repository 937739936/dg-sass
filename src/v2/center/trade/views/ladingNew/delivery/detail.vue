<template>
	<div>
		<div class="slMain">
			<breadcrumb></breadcrumb>
			<a-card
				:bordered="false"
				style="padding-bottom: 12px; margin-bottom: 10px"
			>
				<div
					slot="title"
					class="slTitle"
				>
					<span>放货指令详情</span>
				</div>
				<div class="titleInfoBox">
					<div class="titleInfoTitle">
						<a-space :size="16">
							<em class="refundTypeSymbol">放</em>
							<div
								@mouseenter="onMouseOverBusinessNo('releaseInstructNo')"
								@mouseleave="onMouseOutBusinessNo()"
							>
								<span style="cursor: pointer">放货指令编号：{{ detailData.releaseInstructNo || '-' }}</span>
								<span
									v-if="copyBusinessFlag === 'releaseInstructNo'"
									class="copy-instruct-icon"
									v-clipboard:copy="detailData.releaseInstructNo"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError">
									<CopyNow></CopyNow>
								</span>
								<span
									v-else
									class="copy-instruct-icon"
									>
									<Copy></Copy>
								</span>
							</div>
							<a-tooltip @visibleChange="e => visibleChange(e, detailData.id)">
								<template
									slot="title"
									v-if="['EFFECTIVE_NEAR_LIMIT', 'OVER_LIMIT'].includes(detailData.status)"
								>
									<a-spin v-if="!tipShowText">
										<a-icon
											slot="indicator"
											type="sync"
											style="font-size: 16px; color: #fff"
											spin
										/>
									</a-spin>
									<p
										class="fz12 tooltipColor"
										v-if="tipShowText"
									>
										{{ tipShowText }}
									</p>
								</template>
								<div :class="`statusDes status-${detailData.status}`">
									{{ detailData.statusDesc || '-' }}
								</div>
							</a-tooltip>
						</a-space>
						<a-button
							v-if="['EFFECTIVE_NEAR_LIMIT', 'OVER_LIMIT'].includes(detailData.status)"
							type="primary"
							@click="goHandle"
						>
							<span style="font-size: 14px">处理</span>
						</a-button>
					</div>
					<a-row>
						<a-col :span="8">
							<div
								class="titleInfoItem pl85 contract-box"
								@mouseenter="onMouseOverBusinessNo('contractNo')"
								@mouseleave="onMouseOutBusinessNo()"
							>
								<span class="label w85">所属合同编号：</span>
								<TextOverFlow
									v-if="detailData.contractInfo.contractNo"
									:content="detailData.contractInfo.contractNo"
									:maxWidth="maxWidth"
									@clickFunc="viewContractDetail"
								/>
								<span v-else>-</span>
								<div class="copy-icon-box">
									<span
										v-if="copyBusinessFlag === 'contractNo'"
										class="copy-icon"
										v-clipboard:copy="detailData.contractInfo.contractNo"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError">
										<CopyNow></CopyNow>
									</span>
									<span
										v-else
										class="copy-icon">
										<Copy></Copy>
									</span>
								</div>
							</div>
						</a-col>
						<a-col
							:span="8"
							v-if="detailData.type === 'SYSTEM'"
						>
							<div
								class="titleInfoItem pl85 contract-box"
								@mouseenter="onMouseOverBusinessNo('ladingNo')"
								@mouseleave="onMouseOutBusinessNo()"
							>
								<span class="label w85">提货编号：</span>
								<TextOverFlow
									v-if="detailData.ladingNo"
									:content="detailData.ladingNo"
									:maxWidth="maxWidth"
									@clickFunc="viewLadingDetail"
								/>
								<span v-else>-</span>

								<div class="copy-icon-box-th">
									<span
										v-if="copyBusinessFlag === 'ladingNo'"
										class="copy-icon"
										v-clipboard:copy="detailData.ladingNo"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError">
										<CopyNow></CopyNow>
									</span>
									<span
										v-else
										class="copy-icon">
										<Copy></Copy>
									</span>
								</div>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="titleInfoItem">
								<span class="label">卖方企业：</span>
								<TextOverFlow
									v-if="detailData.contractInfo.sellerName"
									:content="detailData.contractInfo.sellerName"
									:maxWidth="maxWidth"
								/>
								<span v-else>-</span>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="titleInfoItem">
								<span class="label">买方企业：</span>
								<TextOverFlow
									v-if="detailData.contractInfo.buyerName"
									:content="detailData.contractInfo.buyerName"
									:maxWidth="maxWidth"
								/>
								<span v-else>-</span>
							</div>
						</a-col>
						<a-col
							:span="8"
							v-if="detailData.type === 'HAND'"
						>
							<div class="titleInfoItem">
								<span class="label">创建人：</span>
								<TextOverFlow
									v-if="detailData.createName"
									:content="detailData.createName"
									:maxWidth="maxWidth"
								/>
								<span v-else>-</span>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="titleInfoItem">
								<span class="label">创建时间：</span>
								<TextOverFlow
									v-if="detailData.createDate"
									:content="detailData.createDate"
									:maxWidth="maxWidth"
								/>
								<span v-else>-</span>
							</div>
						</a-col>
						<a-col :span="8">
							<div class="titleInfoItem">
								<span class="label">生效时间：</span>
								<TextOverFlow
									v-if="detailData.effectiveDate"
									:content="detailData.effectiveDate"
									:maxWidth="maxWidth"
								/>
								<span v-else>-</span>
							</div>
						</a-col>
					</a-row>
				</div>
			</a-card>
			<a-card
				:bordered="false"
				class="tabInfo"
			>
				<a-tabs>
					<a-tab-pane
						key="1"
						tab="放货信息"
					>
						<div style="width: 100%">
							<div class="slTitleAssis">放货信息</div>
							<ul class="grid-wrap">
								<li>
									<span class="label">仓库名称</span>
									<TextOverFlow
										v-if="detailData.place"
										:content="detailData.place"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li>
									<span class="label">放货日期</span>
									<TextOverFlow
										v-if="detailData.beginDate"
										:content="getDate()"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li>
									<span class="label">运输方式</span>
									<TextOverFlow
										v-if="detailData.transTypeDesc"
										:content="detailData.transTypeDesc"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li v-if="detailData.actualLadingUnit">
									<span class="label">实际提货单位</span>
									<TextOverFlow
										v-if="detailData.actualLadingUnit"
										:content="detailData.actualLadingUnit"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li>
									<span class="label">提货联系人姓名</span>
									<TextOverFlow
										v-if="detailData.contactName"
										:content="detailData.contactName"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li>
									<span class="label">提货人联系方式</span>
									<TextOverFlow
										v-if="detailData.contactMode"
										:content="detailData.contactMode"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li>
									<span class="label">提货联系人身份证号</span>
									<TextOverFlow
										v-if="detailData.idNo"
										:content="detailData.idNo"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li v-if="detailData.actualReceivingUnit">
									<span class="label">实际收货单位</span>
									<TextOverFlow
										v-if="detailData.actualReceivingUnit"
										:content="detailData.actualReceivingUnit"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>

								<li>
									<span class="label">品名</span>
									<TextOverFlow
										v-if="detailData.goodsName"
										:content="detailData.goodsName"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>

								<li>
									<span class="label">放货数量(吨)</span>
									<TextOverFlow
										v-if="detailData.quantity"
										:content="detailData.quantity"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li
									v-if="detailData.actualReceivingUnit"
									style="width: 66.6%"
								>
									<span class="label">出库数量(吨)</span>
									<TextOverFlow
										v-if="detailData.outboundQuantity"
										:content="detailData.outboundQuantity"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
								<li v-else>
									<span class="label">出库数量(吨)</span>
									<TextOverFlow
										v-if="detailData.outboundQuantity"
										:content="detailData.outboundQuantity"
										:maxWidth="infoMaxWidth"
									/><span v-else>-</span>
								</li>
							</ul>

							<div
								class="table-box"
								v-if="detailData.type === 'HAND' && this.detailData.transType != 'AUTOMOBILE'"
							>
								<a-table
									:columns="getColumns(this.detailData.transTypeDesc)"
									class="new-table"
									:bordered="false"
									rowKey="id"
									:dataSource="detailData.transInfoList || []"
									:pagination="false"
									:scroll="{ x: true }"
								>
								</a-table>
							</div>

							<div v-if="detailData.type === 'HAND'">
								<div class="rlRemark">备注</div>
								<div class="rlRemarkContent">
									<span class="textStyle">{{ this.detailData.remark || '' }}</span>
								</div>
							</div>

							<div v-if="detailData.type === 'HAND'">
								<div
									class="slTitleAssis"
									style="margin-top: 50px; margin-bottom: 30px"
								>
									附件信息
								</div>
								<div class="table-box">
									<a-table
										:columns="filesColumns"
										class="new-table"
										:bordered="false"
										rowKey="id"
										:dataSource="this.attachments || []"
										:pagination="false"
										:scroll="{ x: true }"
									>
										<template
											slot="serialNo"
											slot-scope="text, record"
											style="width: 50%"
										>
											<div
												v-for="(item, index) in record.fileLists"
												:key="index"
												style="display: inline-block; color:var(--primary-color)"
											>
												<a-tooltip>
													<template slot="title">
														<span>上传时间：{{ item.createDate }}</span>
													</template>
													<a
														class="fileName"
														@click="handlePreview(item)"
														>{{ item.fileName }}</a
													>
												</a-tooltip>
												<span v-if="index != record.fileLists.length - 1">，</span>
											</div>
										</template>
										<template
											slot="action"
											slot-scope="text, item"
										>
											<a-space :size="20">
												<a
													href="javascript:;"
													@click="downloadFile(item)"
													>下载</a
												>
											</a-space>
										</template>
									</a-table>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="2">
						<div slot="tab">出库记录</div>
						<div class="tabs-content">
							<div>
								<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
									<a-table
										:columns="outBoundColumns"
										class="new-table"
										:bordered="false"
										rowKey="id"
										:dataSource="dataSource || []"
										:pagination="false"
										:scroll="{ x: true }"
									>
										<template
											slot="serialNo"
											slot-scope="serialNo, record"
										>
											<a
												href="javascript:;"
												@click="goOutBoundDetail(record)"
												>{{ record.serialNo }}</a
											>
										</template>
										<template
											slot="coalPlanNo"
											slot-scope="coalPlanNo, record"
										>
											<a
												href="javascript:;"
												@click="goCoalPlanDetail(record)"
												>{{ record.coalPlanNo }}</a
											>
										</template>
									</a-table>
									<div class="bottomDesc">
										放货数量：<span
											v-if="detailData.quantity"
											class="bottomValue"
											>{{ detailData.quantity }}吨</span
										>
										<span v-else>-</span>
										<div class="paddingLeft">
											出库数量：<span
												v-if="detailData.outboundQuantity"
												class="bottomValue"
												>{{ detailData.outboundQuantity }}吨</span
											>
											<span v-else>-</span>
										</div>
									</div>
									<i-pagination
										:pagination="pagination"
										@change="getList"
									/>
								</div>
							</div>
						</div>
					</a-tab-pane>
					<a-tab-pane key="3">
						<div slot="tab">操作记录</div>
						<div class="tabs-content">
							<div class="table-box">
								<a-table
									:columns="handleColumns"
									class="new-table"
									:bordered="false"
									:dataSource="detailData.ladingOperationList || []"
									:pagination="false"
									:scroll="{ x: true }"
								>
									<template
										slot="comments"
										slot-scope="text, record"
									>
										<p
											style="word-wrap: break-word; word-break: break-all; white-space: initial"
											v-html="text"
										></p>
									</template>
								</a-table>
							</div>
						</div>
					</a-tab-pane>
				</a-tabs>
			</a-card>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_getLadingDetailById,
	API_getLadingOutBoundById,
	API_downloadLadingFile,
	API_GetStatusTipById
} from '@/v2/center/trade/api/instruct';
import { getSubsystemOptions, subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';

import { ListMixin } from '@/v2/components/mixin/ListMixin';
import breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import {Copy, CopyNow} from '@sub/components/svg'

const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{
		title: '文件名',
		dataIndex: 'fileName',
		scopedSlots: { customRender: 'serialNo' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' },
		align: 'center',
		fixed: 'right'
	}
];
export default {
	mixins: [ListMixin],
	components: {
		TextOverFlow,
		imageViewer,
		breadcrumb,
		CopyNow,
		Copy,
	},
	name: 'LetterNoticeDetail',
	data() {
		const statusList = [
			{
				label: '已超限',
				value: 'BUSINESS_AUDIT'
			},
			{
				label: '生效中（已临额）',
				value: 'BUSINESS_REJECT'
			},
			{
				label: '生效中',
				value: 'FINANCE_AUDIT'
			}
		];
		const customRender = text => text || '-';
		return {
			url: {
				list: API_getLadingOutBoundById
			},
			defaultParams: {
				id: this.$route.query.id
			},
			moment,
			statusList,
			copyBusinessFlag: '', // 高亮复制字段icon
			// operateLog: [], //操作记录load
			maxWidth: 0, // 信息文案最大宽度
			infoMaxWidth: 0, // 信息文案最大宽度
			detailData: { contractInfo: {} },
			columns: [],
			attachments: [], //附件信息
			filesColumns,
			tipShowText: '',

			handleColumns: [
				{
					title: '操作类型',
					dataIndex: 'operateType',
					key: 'operateType'
				},
				{
					title: '操作人员',
					dataIndex: 'operateName',
					key: 'operateName'
				},
				{
					title: '所属公司',
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{
					title: '操作内容',
					dataIndex: 'comments',
					key: 'comments',
					scopedSlots: { customRender: 'comments' }
				},
				{
					title: '操作时间',
					dataIndex: 'operateTime',
					key: 'operateTime'
				}
			],
			outBoundColumns: [
				{
					title: '出库编号',
					dataIndex: 'serialNo',
					scopedSlots: { customRender: 'serialNo' }
				},
				{
					title: '关联下煤计划编号',
					dataIndex: 'coalPlanNo',
					scopedSlots: { customRender: 'coalPlanNo' }
				},
				{
					title: '出库日期',
					dataIndex: 'storageDate',
					customRender
				},
				{
					title: '仓房&货位',
					dataIndex: 'warehouseGoodsAllocationName',
					customRender
				},
				{
					title: '出库数量(吨)',
					dataIndex: 'weight',
					customRender
				},
				{
					title: '车数(辆)',
					dataIndex: 'carsNumber',
					customRender
				}
			],
			clientWidth: null, //浏览器尺寸

			transColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '发站',
					dataIndex: 'deliveryStation'
				},
				{
					title: '到站',
					dataIndex: 'arriveStation'
				},
				{
					title: '收货人',
					dataIndex: 'receiverName'
				},
				{
					title: '托运人',
					dataIndex: 'shipperName'
				}
			],

			shipColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '船舶MMSI',
					dataIndex: 'shipNo'
				},
				{
					title: '船舶名称',
					dataIndex: 'shipName'
				}
			],

			tiColumns: [
				{
					title: '提货单编号',
					dataIndex: 'ladingNo'
				},
				{
					title: '创建时间',
					dataIndex: 'createDate'
				},
				{
					title: '运输方式',
					dataIndex: 'transTypeDesc'
				},
				{
					title: '提货时间',
					dataIndex: 'endDate',
					customRender: (v, r) => r.beginDate + '~' + r.endDate
				},
				{
					title: '提货数量',
					dataIndex: 'quantity'
				},
				{
					title: '卖方企业名称',
					dataIndex: 'sellerName'
				},
				{
					title: '买方企业名称',
					dataIndex: 'buyerName'
				}
			],
			fileColumns: [
				{
					title: '类型',
					dataIndex: 'typeDesc'
				},
				{
					title: '文件名',
					dataIndex: 'fileName'
				},
				{
					title: '操作',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			]
		};
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
		this.init();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		modulePath() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return modulePath;
		}
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth(), this.getInfoMaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		...mapMutations({
			SET_VUEX_CURRENT_PLATEFORM: 'user/SET_VUEX_CURRENT_PLATEFORM'
		}),

		getColumns(type) {
			if (type == '火运') {
				return this.transColumns;
			} else if (type == '船运') {
				return this.shipColumns;
			} else {
				return [];
			}
		},

		getDate() {
			return this.detailData.beginDate + '至' + this.detailData.endDate;
		},
		handlePreview(items) {
			filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
		},

		// 预警处理详情页，用户操作后，本条数据状态变更为”已完成“
		goHandle() {
			if (!this.detailData.riskAlertId) {
				return;
			}
			let path = '/center/message/instructDetail';
			this.$router.push({
				path: path,
				query: {
					id: this.detailData.riskAlertId,
					orderType: this.detailData.contractInfo.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell'
				}
			});
		},
		async goOutBoundDetail(record) {
			if (!record.id) {
				return;
			}
			let isChanged = await this.changePlatformIfNeed(record);
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/out/detail',
				query: {
					id: record.id
				}
			});
			window.open(routerData.href, '_blank');
			if (isChanged) {
				this.$router.go();
			}
		},
		async goCoalPlanDetail(record) {
			if (!record.coalPlanId) {
				return;
			}
			let isChanged = await this.changePlatformIfNeed(record);
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/coalplan/OUT/detail',
				query: {
					contractType: this.detailData.contractInfo.contractType,
					id: record.coalPlanId
				}
			});
			window.open(routerData.href, '_blank');
			if (isChanged) {
				this.$router.go();
			}
		},
		async changePlatformIfNeed(record) {
			if (record.stationId && this.VUEX_CURRENT_PLATEFORM.stationId != record.stationId) {
				let res = await subsystemOptionsEdit({
					stationId: record.stationId,
					companyCreditCode: record.stationCompanyUscc
				});
				if (!res.success) {
					return;
				}
				// 更新vuex
				let { success, data } = await getSubsystemOptions();
				if (!success) {
					return;
				}
				let currentPlatform = data.filter(item => item.selected)[0] || {};
				this.SET_VUEX_CURRENT_PLATEFORM({
					...currentPlatform,
					allStationList: data
				});
				return true;
			}
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 300;
			} else {
				this.maxWidth = 340;
			}
		},
		// 获取退款信息字段的最小宽度
		getInfoMaxWidth() {
			if (this.clientWidth < 1600) {
				this.infoMaxWidth = 215;
			} else if (this.clientWidth < 1920) {
				this.infoMaxWidth = 280;
			} else if (this.clientWidth < 2160) {
				this.infoMaxWidth = 365;
			} else if (this.clientWidth < 3000) {
				this.infoMaxWidth = 440;
			} else {
				this.infoMaxWidth = 720;
			}
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function () {
			this.$message.success('复制成功');
		},
		onError: function () {
			this.$message.error('复制失败');
		},
		// 鼠标移入
		onMouseOverBusinessNo(flag) {
			this.copyBusinessFlag = flag || '';
		},
		// 鼠标移出
		onMouseOutBusinessNo() {
			this.copyBusinessFlag = '';
		},
		viewContractDetail() {
			let type = this.detailData.contractInfo.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell';
			let orderLineType = this.detailData.contractInfo.contractType;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + orderLineType.toLowerCase() + '/detail',
				query: {
					id: this.detailData.contractInfo.orderContractId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		viewLadingDetail() {
			if (!this.detailData.ladingId) {
				return;
			}
			let routerData = this.$router.resolve({
				path: `/center/${this.modulePath}/lading/detail`,
				query: {
					id: this.detailData.ladingId
				}
			});
			window.open(routerData.href, '_blank');
		},

		visibleChange(visible, id) {
			// 合同状态文案
			if (visible) {
				API_GetStatusTipById({
					id
				}).then(res => {
					this.tipShowText = res.data || '';
				});
			} else {
				this.tipShowText = '';
			}
		},

		init() {
			API_getLadingDetailById({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					// this.detailData.ladingOperationList = [{
					//       "id": 402,
					//       "type": "RELEASE_INSTRUCT",
					//       "businessNo": "101",
					//       "operateType": "业务审核通过",
					//       "comments": "编辑放货信息：放货日期:变更前2024-03-06~2024-03-08,变更后2024-03-12~2024-04-17;\n放货数量:变更前1,变更后12;提货联系人姓名:变更前发生的,变更后严佳怡;\n提货人联系方式:变更前15677777777,变更后11256777772;\n提货联系人身份证号:变更前432432432432,变更后330521200006241529;",
					//       "operateTime": "2024-03-04 16:41:17",
					//       "operateId": null,
					//       "operateName": "张慧芳",
					//       "companyId": null,
					//       "companyName": "系统",
					//       "companyAbbreviation": null
					//   }]
					if (this.detailData.transType) {
						this.columns = this[this.detailData.transType + 'Columns'];
					}
					this.initAttachments();
				}
			});
		},
		initAttachments() {
			if (this.detailData.attachVOList.length) {
				let fileMap = {};
				this.detailData.attachVOList.forEach(function (item, index, arr) {
					if (fileMap[item.typeDesc]) {
						fileMap[item.typeDesc].push(item);
					} else {
						fileMap[item.typeDesc] = [item];
					}
				});
				var key;
				for (key in fileMap) {
					this.attachments.push({
						typeDesc: fileMap[key][0].typeDesc,
						fileLists: fileMap[key],
						type: fileMap[key][0].type
					});
				}
			}
		},
		downloadFile(item) {
			if (!item?.fileLists.length) {
				return;
			}
			let fileName = `${item.typeDesc}.zip`;
			if (item.fileLists.length == 1) {
				fileName = item.fileLists[0].fileName;
			}
			// 下载pdf
			API_downloadLadingFile({
				id: this.detailData.id,
				type: item.type
			}).then(res => {
				comDownload(res, undefined, fileName);
			});
		},
		openPdf(v) {
			window.open(window._CONFIG['pdfViewURL'] + v.fileUrl);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	::v-deep .tabInfo.ant-card {
		padding: 1px 30px 20px;
	}

	.tabs-content {
		width: 100%;
		padding-top: 10px;
		padding-bottom: 10px;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
	}

	.rlRemark {
		line-height: 22px;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 20px;
		size: 14px;
	}

	.rlRemarkContent {
		min-height: 80px;
		width: 100%;
		padding: 14px 12px;
		background-color: #f3f5f6;
		margin-top: 12px;
		border-radius: 1px;

		.textStyle {
			size: 14px;
			color: #77889d;
		}
	}

	.refundTypeSymbol {
		display: inline-block;
		width: 18px;
		height: 18px;
		background: #45c041;
		color: #fff;
		text-align: center;
		line-height: 18px;
		border-radius: 4px;
		font-style: normal;
		font-size: 14px;
		position: relative;
		top: -1px;
	}

	.grid-wrap {
		margin-top: 10px;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;
		padding-left: 0;

		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;

			span {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
			}

			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}

			.label {
				width: 160px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}

			span:last-child {
				width: 100%;
				padding-left: 172px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}

		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}

		li:last-child {
			border-radius: 0 0 3px 0;
		}

		li.special {
			border-radius: 0 3px 3px 0;
		}

		.textOverflow {
			height: 48px;
			line-height: 48px;
			left: 160px;
			padding: 0 10px;
		}
	}

	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}

	.slTitle {
		margin-bottom: 20px;
	}

	.copy-instruct-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 1px;
		display: inline-block;
		width: 14px;
		height: 14px;
	}

	.copy-icon {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}

	.copy-icon-box {
		display: inline-block;
		padding-left: 10px;
		position: absolute;
		top: 1px;
	}
	.copy-icon-box-th {
		display: inline-block;
		padding-left: 10px;
		position: absolute;
		top: 1px;
	}

	.contract-box {
		color: @primary-color;
	}

	.titleInfoBox {
		.titleInfoItem {
			width: 22%;
			margin-right: 3%;
			display: inline-block;
			padding-left: 130px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				position: absolute;
				left: 0;
				top: 0;
				display: inline-block;
				width: 130px;
				text-align: right;
			}

			.w85 {
				width: 130px;
			}

			.pl85 {
				padding-left: 130px;
			}

			.w130 {
				width: 130px;
			}

			.textOverflow {
				left: 130px !important;
			}
		}
		.titleInfoTitle {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
	}

	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}

	.ant-card:last-child {
		margin-bottom: 0;
	}
}

.title {
	border-bottom: 1px solid #d8d8d8;
	font-size: 17px;
	font-weight: bold;
	color: #000c17;
	padding: 14px 0;
	margin-bottom: 30px;
	padding-top: 20px;
}
.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	&.status-BUSINESS_AUDIT,
	&.status-FINANCE_AUDIT {
		background: #ffdac8;
		color: #ff7937;
	}

	&.status-OVER_LIMIT,
	&.status-BUSINESS_REJECT,
	&.status-FINANCE_REJECT {
		background: #f2d0d0;
		color: #d44;
	}

	&.status-COMPLETED,
	&.status-CANCEL {
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}

	&.status-EFFECTIVE_NEAR_LIMIT,
	&.status-EFFECTIVE {
		background: #d3dffb;
		color: #4682f3;
	}
}
.fz12 {
	font-size: 14px;
	zoom: 0.86;
	line-height: 24px;
}
.tooltipColor {
	color: white;
}
/deep/ .ant-table td {
	white-space: nowrap;
}

.bottomDesc {
	display: inline-flex;
	padding-top: 20px;
	padding-right: 40px;
	font-size: 14px;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.4);
	.paddingLeft {
		padding-left: 40px;
	}
	.bottomValue {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
	}
}

@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 340px !important;
	}
	.copy-icon-box-th {
		left: 460px !important;
	}
}
@media screen and (max-width: 1919px) {
	.copy-icon-box {
		left: 340px !important;
	}
	.copy-icon-box-th {
		left: 420px !important;
	}
}
@media screen and (max-width: 1559px) {
	.copy-icon-box {
		left: 340px !important;
	}
	.copy-icon-box-th {
		left: 340px !important;
	}
}
// @media screen and (max-width: 1365px) {
//   .copy-icon-box {
//     left: 340px !important;
//   }
//   .copy-icon-box-th {
//     left: 340px !important;
//   }
// }
</style>
