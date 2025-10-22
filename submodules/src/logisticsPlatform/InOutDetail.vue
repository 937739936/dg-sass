<template>
	<div>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ titleStr }}库信息详情</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div class="titleInfoBox">
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">{{ titleStr }}</em>
								<div
									@mouseenter="copyVisible = true"
									@mouseleave="copyVisible = false"
									style="margin-right: 20px"
								>
									<span
										class="cur"
										style="margin-right: 10px"
										>{{ titleStr }}库编号：{{ detailInfo.serialNo }}</span
									>
									<Copy
										class="cur"
										v-show="!copyVisible"
									></Copy>
									<span
										v-show="copyVisible"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
										v-clipboard:copy="detailInfo.serialNo"
									>
										<CopyNow class="cur"></CopyNow>
									</span>
								</div>
							</a-space>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row class="supple-info">
				<div
					class="titleInfoItem"
					v-if="detailInfo.contractNo && !isManager"
				>
					<span
						class="label"
						style="width: 100px"
						>所属合同编号：</span
					>
					<span
						@mouseenter="copyVisible1 = true"
						@mouseleave="copyVisible1 = false"
					>
						<a
							href="javascript:;"
							@click="goContract(detailInfo)"
							v-if="!isManager"
							>{{ detailInfo.contractNo }}</a
						>
						<span v-else>{{ detailInfo.contractNo }}</span>
						<Copy
							class="cur"
							style="position: relative; top: 2px; margin-left: 10px"
							v-show="!copyVisible1"
						></Copy>
						<span
							v-show="copyVisible1"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="detailInfo.contractNo"
						>
							<CopyNow
								class="cur"
								style="position: relative; top: 2px; margin-left: 10px"
							></CopyNow>
						</span>
					</span>
				</div>
				<div
					class="titleInfoItem"
					v-if="detailInfo.releaseInstructNo"
				>
					<span
						class="label"
						style="width: 100px"
						>放货指令编号：</span
					>
					<span
						@mouseenter="copyVisible3 = true"
						@mouseleave="copyVisible3 = false"
					>
						<a
							href="javascript:;"
							@click="goReleaseInstruct(detailInfo)"
							v-if="!isManager"
							>{{ detailInfo.releaseInstructNo }}</a
						>
						<span v-else>{{ detailInfo.releaseInstructNo }}</span>
						<Copy
							class="cur"
							style="position: relative; top: 2px; margin-left: 10px"
							v-show="!copyVisible3"
						></Copy>
						<span
							v-show="copyVisible3"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="detailInfo.releaseInstructNo"
						>
							<CopyNow
								class="cur"
								style="position: relative; top: 2px; margin-left: 10px"
							></CopyNow>
						</span>
					</span>
				</div>
				<div
					class="titleInfoItem"
					style="display: flex"
				>
					<span class="label">卖方企业：</span>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailInfo.deliveryCompanyName }}
							</template>
							{{ detailInfo.deliveryCompanyName }}
						</a-tooltip>
					</span>
					<!-- <span v-else>-</span> -->
				</div>
				<div
					class="titleInfoItem"
					style="display: flex"
				>
					<span class="label">买方企业：</span>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailInfo.receivingCompanyName }}
							</template>
							{{ detailInfo.receivingCompanyName }}
						</a-tooltip>
					</span>
				</div>
				<div
					class="titleInfoItem"
					v-if="detailInfo.receiveNo"
				>
					<span
						class="label"
						style="width: 100px"
						>关联收货编号：</span
					>
					<span
						@mouseenter="copyVisible2 = true"
						@mouseleave="copyVisible2 = false"
					>
						<a
							href="javascript:;"
							v-if="!isManager"
						>
							<i
								v-for="(item, i) in detailInfo.receiveNoList"
								:key="item"
								@click="goGoods(detailInfo, i)"
								>{{ item }} {{ i + 1 == detailInfo.receiveNoList.length ? '' : ',' }}</i
							>
						</a>
						<span v-else>
							<i
								v-for="(item, i) in detailInfo.receiveNoList"
								:key="item"
								>{{ item }} {{ i + 1 == detailInfo.receiveNoList.length ? '' : ',' }}</i
							>
						</span>
						<Copy
							class="cur"
							style="position: relative; top: 2px; margin-left: 10px"
							v-show="!copyVisible2"
						></Copy>
						<span
							v-show="copyVisible2"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="detailInfo.receiveNo"
						>
							<CopyNow
								class="cur"
								style="position: relative; top: 2px; margin-left: 10px"
							></CopyNow>
						</span>
					</span>
				</div>
				<template v-if="!isManager">
					<div class="titleInfoItem">
						<span class="label">关联业务线号：</span>
						<span class="c8">
							<a
								@click="openBusinessLine"
								class="business-no"
								v-if="!isManager"
								>{{ detailInfo.businessLineNo || '-' }}</a
							>
							<span v-else>{{ detailInfo.businessLineNo || '-' }}</span>
						</span>
					</div>
					<div class="titleInfoItem">
						<span class="label">业务线名称：</span>
						<span
							class="c8"
							v-if="detailInfo.businessLineInfo"
							>{{ detailInfo.businessLineInfo.businessLineName }}</span
						>
						<span
							class="c8"
							v-else
							>-</span
						>
					</div>
				</template>

				<div
					class="titleInfoItem"
					v-if="detailInfo.coalPlanNo"
				>
					<span
						class="label"
						style="width: 100px"
						>关联{{ type == 'IN' ? '上煤' : '下煤' }}编号：</span
					>
					<span
						@mouseenter="copyVisible2 = true"
						@mouseleave="copyVisible2 = false"
					>
						<a
							href="javascript:;"
							@click="goCoalplan(detailInfo)"
							>{{ detailInfo.coalPlanNo }}</a
						>
						<Copy
							class="cur"
							style="position: relative; top: 2px; margin-left: 10px"
							v-show="!copyVisible2"
						></Copy>
						<span
							v-show="copyVisible2"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="detailInfo.coalPlanNo"
						>
							<CopyNow
								class="cur"
								style="position: relative; top: 2px; margin-left: 10px"
							></CopyNow>
						</span>
					</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">创建人员：</span>
					<span class="c8">{{ detailInfo.createdName }}</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">创建时间：</span>
					<span class="c8">{{ detailInfo.createdDate }}</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">数据类型：</span>
					<span class="c8">{{ detailInfo.sourceTypeText }}</span>
				</div>
			</a-row>
		</a-card>
		<a-card
			:bordered="false"
			class="pt0 bot"
		>
			<a-tabs
				@change="tabChange"
				:activeKey="tabKey"
			>
				<a-tab-pane
					key="contractInfo"
					:tab="`${titleStr}库信息`"
				>
					<div>
						<div
							class="slTitleAssis"
							style="margin: 30px 0"
						>
							{{ titleStr }}库信息
						</div>
						<div>
							<ul class="grid-wrap transportBox">
								<li>
									<span class="label">{{ titleStr }}库数量(吨)</span>
									<span>{{ detailInfo.weight || '-' }}</span>
								</li>
								<li>
									<span class="label">{{ titleStr }}库日期</span>
									<span>{{ detailInfo.storageDate || '-' }}</span>
								</li>
								<li v-if="type == 'IN'">
									<span class="label">坑/矿口</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.originPlace || '-' }}</span>
										</template>
										<span>{{ detailInfo.originPlace || '-' }}</span>
									</a-tooltip>
								</li>
								<li>
									<span class="label">煤种</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.goodsName || '-' }}</span>
										</template>
										<span>{{ detailInfo.goodsName || '-' }}</span>
									</a-tooltip>
								</li>
								<li>
									<span class="label">发货单位</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.deliveryCompanyName || '-' }}</span>
										</template>
										<span>{{ detailInfo.deliveryCompanyName || '-' }}</span>
									</a-tooltip>
								</li>
								<li>
									<span class="label">收货单位</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.receivingCompanyName || '-' }}</span>
										</template>
										<span>{{ detailInfo.receivingCompanyName || '-' }}</span>
									</a-tooltip>
								</li>
								<li v-if="detailInfo.actualLadingUnit">
									<span class="label">实际提货单位</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.actualLadingUnit || '-' }}</span>
										</template>
										<span>{{ detailInfo.actualLadingUnit || '-' }}</span>
									</a-tooltip>
								</li>
								<li v-if="detailInfo.actualReceivingUnit">
									<span class="label">实际收货单位</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.actualReceivingUnit || '-' }}</span>
										</template>
										<span>{{ detailInfo.actualReceivingUnit || '-' }}</span>
									</a-tooltip>
								</li>

								<li>
									<span class="label">运输方式</span>
									<span>{{ detailInfo.transportModeDesc || '-' }}</span>
								</li>
								<li>
									<span class="label">{{ titleStr }}库车数</span>
									<span>{{ detailInfo.carsNumber || '-' }}</span>
								</li>
								<!-- <li :class="type"> -->
								<li :style="getWarehouseGoodsAllocationNameStyle()">
									<span class="label">仓房&货位</span>
									<a-tooltip>
										<template slot="title">
											<span>{{ detailInfo.warehouseGoodsAllocationName || '-' }}</span>
										</template>
										<span>{{ detailInfo.warehouseGoodsAllocationName || '-' }}</span>
									</a-tooltip>
								</li>
								<!-- <li v-if="detailInfo.actualReceivingUnit">
                  <span class="label"></span>
                  <a-tooltip>
                    <span></span>
                  </a-tooltip>
                </li> -->

								<li class="last-li">
									<span class="label">备注</span>
									<span class="remark">
										<div v-if="detailInfo.remarkList && detailInfo.remarkList.length">
											<div
												v-for="item in detailInfo.remarkList"
												:key="item.id"
											>
												<p style="color: rgba(0, 0, 0, 0.5); font-size: 12px">{{ item.createdDate }}</p>
												<p
													class="remark-p"
													style="color: var(--, rgba(0, 0, 0, 0.8)); font-size: 14px"
												>
													<a-tooltip placement="left">
														<template slot="title">
															{{ item.remark || '-' }}
														</template>
														{{ item.remark || '-' }}
													</a-tooltip>
												</p>
											</div>
										</div>
										<span v-else></span>
									</span>
								</li>
							</ul>
						</div>
						<div v-if="filesList.length">
							<div
								class="slTitleAssis"
								style="margin: 30px 0"
							>
								附件
							</div>
							<a-table
								:columns="filesColumns"
								border
								class="new-table"
								:bordered="false"
								rowKey="fileUrl"
								:dataSource="filesList"
								:pagination="false"
							>
								<template
									slot="no"
									slot-scope="text, record"
								>
									<span
										class="preview-box"
										v-for="(item, index) in record.list"
										:key="index"
									>
										<a-tooltip placement="topLeft">
											<template slot="title">
												{{ item.createdDate }}
											</template>
											<a
												href="javascript:;"
												class="preview"
												@click="handlePreview(item)"
											>
												{{ item.name }}
											</a>
										</a-tooltip>
										<span
											class="line"
											style="margin: 0 14px; vertical-align: sub"
											v-if="index != record.list.length - 1"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="2"
												height="14"
												viewBox="0 0 2 14"
												fill="none"
											>
												<path
													d="M1 0V14"
													stroke="#E9EFFC"
												/>
											</svg>
										</span>
									</span>
								</template>
								<template
									slot="action"
									slot-scope="text, items"
								>
									<a-space :size="20">
										<a
											href="javascript:;"
											@click="download(items)"
											>下载</a
										>
									</a-space>
								</template>
							</a-table>
						</div>
					</div>
				</a-tab-pane>
				<!-- 判断当前是否关联了上下煤计划  v-if="detailInfo.coalPlanNo"-->
				<a-tab-pane
					key="detail"
					:tab="`${titleStr}库明细`"
				>
					<InOutParticulars
						:Fn="getInOutDetailList"
						@exportDetailData="exportDetailData"
						@goCoalplan="goCoalplan"
						@goInOutDetail="goInOutDetail"
						:type="type"
						:detailInfo="detailInfo"
						:showActualLadingUnit="showActualLadingUnit"
					></InOutParticulars>
				</a-tab-pane>
				<a-tab-pane
					key="contractOperation"
					tab="操作记录"
				>
					<LogList
						:list="logList"
						:columns="logColumns"
					></LogList>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg/index';
import LogList from '@sub/components/LogList.vue';
import { formatMoney } from '@sub/filters';
import { formatAccountNumber } from '@sub/utils/factory.js';
import InOutParticulars from './InOutParticulars.vue';
import storage from '@sub/utils/storage';
const filesColumns = [
	{ title: '文件类型', dataIndex: 'title', width: 120 },
	{ title: '文件编号', dataIndex: 'no', scopedSlots: { customRender: 'no' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', width: 120 }
];
const columns = [
	{ dataIndex: 'claimTypeDesc', title: '认领类型' },
	{ dataIndex: 'type', title: '认领信息', scopedSlots: { customRender: 'type' }, width: 420 },
	{ dataIndex: 'downstreamSettleAmount', title: '下游结算金额(元)', scopedSlots: { customRender: 'downstreamSettleAmount' } },
	{ dataIndex: 'claimedAmount', title: '已认领金额(元)', scopedSlots: { customRender: 'claimedAmount' } },
	{ dataIndex: 'currentClaimedAmount', title: '本次领金额(元)', scopedSlots: { customRender: 'currentClaimedAmount' } }
];

export default {
	props: {
		logList: {
			default: () => {
				return [];
			}
		},
		detailInfo: {
			businessLineInfo: {}
		},
		type: {
			default: 'IN'
		},
		isCoreCompany: {
			type: Boolean,
			default: () => true
		},
		isManager: {
			type: Boolean,
			default: () => false
		},
		getInOutDetailList: {}
	},

	watch: {
		detailInfo(info) {
			this.showActualLadingUnit = info.actualLadingUnit;
			if (info.transportMode == 'AUTOMOBILE') {
				this.filesList = [
					{ type: 'AUTOMOBILE_TICKET', title: '矿发磅单', require: true, list: [] },
					{ type: 'AUTOMOBILE_TICKET_DETAIL', title: '磅单明细', require: true, list: [] },
					{ type: 'AUTOMOBILE_LABORATORY_CERTIFICATE', title: '化验凭证', require: false, list: [] },
					{ type: 'OTHER', title: '其他', require: false, list: [] }
				];
			} else if (info.transportMode == 'TRAIN') {
				this.filesList = [
					{ type: 'TRAIN_RAILWAY_TICKET', title: '铁路大票', require: true, list: [] },
					{ type: 'TRAIN_ENTRY_AND_EXIT_DETAIL', title: '出入库明细 ', require: true, list: [] },
					{ type: 'TRAIN_LABORATORY_CERTIFICATE', title: '化验凭证', require: false, list: [] },
					{ type: 'OTHER', title: '其他', require: false, list: [] }
				];
			} else {
				this.filesList = [
					{ type: 'SHIP_ONBOARD_MEASUREMENT_SHEET', title: '随船计量单', require: true, list: [] },
					{ type: 'SHIP_LABORATORY_CERTIFICATE', title: '化验凭证', require: false, list: [] },
					{ type: 'OTHER', title: '其他', require: false, list: [] }
				];
			}
			info.attachmentList.forEach(el => {
				const item = this.filesList.find(el2 => el2.type == el.fileType) || { list: [] };
				item.list.push(el);
			});
			this.filesList = this.filesList.filter(el => el.list.length);
		}
	},
	data() {
		return {
			tabKey: storage.session.get('in-out-detail-tabkey') || 'contractInfo',
			copyVisible: false,
			copyVisible1: false,
			copyVisible2: false,
			copyVisible3: false,
			showActualLadingUnit: false,
			filesColumns,
			columns,
			logColumns: [
				{ title: '操作类型', dataIndex: 'optType' },
				{ title: '操作人', dataIndex: 'optName' },
				{ title: '所属公司', dataIndex: 'optCompanyName' },
				{ title: '操作内容', dataIndex: 'remark' },
				{ title: '操作时间', dataIndex: 'optTime', fixed: 'right' }
			],
			filesList: [
				{ type: 'AUTOMOBILE_TICKET', title: '矿发磅单', require: true, list: [] },
				{ type: 'AUTOMOBILE_TICKET_DETAIL', title: '磅单明细', require: true, list: [] },
				{ type: 'AUTOMOBILE_LABORATORY_CERTIFICATE', title: '化验凭证', require: false, list: [] },
				{ type: 'OTHER', title: '其他', require: false, list: [] }
			]
		};
	},
	computed: {
		titleStr() {
			return this.type == 'IN' ? '入' : '出';
		}
	},

	methods: {
		formatMoney,
		formatAccountNumber,
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},
		// 预览
		handlePreview(item) {
			this.$emit('handlePreview', {...item, fileUrl: item.url});
		},
		// 去往合同详情
		goContract(item) {
			this.$emit('goContract', item);
		},
		goReleaseInstruct(item) {
			this.$emit('goReleaseInstruct', item);
		},
		// 收货
		goGoods(item, i) {
			this.$emit('goGoods', item, i);
		},
		// 下载
		download(item) {
			this.$emit('download', item);
		},
		// 上下煤
		goCoalplan(item) {
			this.$emit('goCoalplan', item);
		},
		// 导出
		exportDetailData(item) {
			this.$emit('exportDetailData', item);
		},
		goInOutDetail(item) {
			this.$emit('goInOutDetail', item);
		},
		tabChange(key) {
			storage.session.set('in-out-detail-tabkey', key);
			this.tabKey = key;
		},
		openBusinessLine() {
			this.$emit('openBusinessLine', this.detailInfo.businessLineInfo || {});
		},
		getWarehouseGoodsAllocationNameStyle() {
			let width = '33.3% !important';
			if (this.detailInfo.actualReceivingUnit) {
				width = '99.9% !important';
			} else if (this.type == 'OUT') {
				width = '66.6% !important';
			} else {
				width = '33.3% !important';
			}
			return { width };
		}
	},
	components: {
		Copy,
		CopyNow,
		LogList,
		InOutParticulars
	}
};
</script>
<style lang="less" scoped>
@import url('../style/table.less');
@import url('../style/table.less');
</style>
<style scoped lang="less">
::v-deep .ant-table-thead {
	background: #f3f5f6;
}
::v-deep .ant-tabs-nav .ant-tabs-tab {
	color: rgba(0, 0, 0, 0.4);
}
.c8 {
	color: rgba(0, 0, 0, 0.8);
}
.cur {
	cursor: pointer;
}
.slMain {
	font-family: PingFangSC-Regular, PingFang SC;
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
	}
	.titleInfoBox {
		.titleInfoTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
	}
	.supple-info {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		.titleInfoItem {
			padding-right: 20px;
			width: 33%;
			display: flex;
			position: relative;
			height: 40px;
			.label {
				flex-shrink: 0;
				display: inline-block;
				width: 100px;
				text-align: left;
			}
			.omit {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: inline-block;
				vertical-align: bottom;
			}
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
.contract-status {
	border-radius: 4px;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	background: #c9d9ff;
	color: #596fa0;
	font-family: PingFangSC-Regular, PingFang SC;
	text-align: center;
	.text {
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -1px;
	}
}
.contractTypeSymbol {
	display: inline-block;
	width: 18px;
	height: 18px;
	background: @primary-color;
	color: #fff;
	text-align: center;
	line-height: 18px;
	border-radius: 4px;
	font-style: normal;
	font-size: 14px;
	position: relative;
	top: -1px;
	font-weight: 600;
}
.bot {
	margin-bottom: 0px !important;
	padding-bottom: 64px !important;
	padding-top: 0px !important;
	background: #fff !important;
}
.grid-wrap {
	margin-top: 10px;
	width: 100%;
	width: calc(100vw - 316px);
	border-radius: 3px;
	padding: 0;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
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
			font-family: PingFangSC-Regular, PingFang SC;
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
			color: rgba(0, 0, 0, 0.8);
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
	.last-li {
		display: flex;
		align-items: center;
		height: auto;
		min-height: 48px;
		overflow: inherit;
		width: 99.9%;
		// max-width: 70%;
		background: #f3f5f6;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.label {
			height: 100%;
			display: flex;
			align-items: center;
		}
		.remark {
			line-height: inherit;
			flex: 1;
			overflow: inherit;
			background: #fff;
			height: inherit;
			&-p {
				max-width: calc(100vw - 500px);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				span {
					padding: 0;
					line-height: 24px;
					height: 24px;
				}
			}
		}
	}
}
.transportBox {
	.textOverflow {
		height: 48px;
		line-height: 48px;
		left: 160px;
		padding: 0 10px;
	}
}
.preview-box {
}
.line {
}
.money-box {
	display: flex;
	margin-bottom: 30px;
	&-item {
		width: 250px;
		height: 88px;
		flex-shrink: 0;
		border-radius: 6px;
		background: #f0f8ff;
		margin-right: 30px;
		padding: 14px 0;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		p:last-child {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
.business-box {
	p {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 12px;
	}
	P:first-child {
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		margin-bottom: 10px;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
}
.business-box2 {
	color: var(--text-40, rgba(0, 0, 0, 0.4));
	font-size: 14px;
}
.status {
	border-radius: 4px;
	background: #c1d7ff;
	display: inline-flex;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	color: #4682f3;
	font-family: PingFang SC;
	font-size: 12px;
}
.PART_CLAIM {
	background: #ffdac8;
	color: #ff7937;
}
.CLAIMED {
	color: #3eb384;
	background: #c5ecdd;
}
.IN {
	width: 33.3% !important;
}
.OUT {
	width: 66.6% !important;
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
	flex: 1;
	color: rgba(0, 0, 0, 0.8);
}
.business-no {
	cursor: pointer;
}
</style>
