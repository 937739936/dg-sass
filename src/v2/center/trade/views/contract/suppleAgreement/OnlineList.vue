<template>
	<div>
		<!-- 查询区域 -->
		<SlFormNew
			:list="searchList"
			ref="searchForm"
			layout="inline"
			@change="handleChange"
			@resetFunc="resetFunc"
		></SlFormNew>
		<!-- tabs -->
		<div class="tabs-box">
			<Tabs
				v-if="statusData"
				:statusData="statusData"
				:tabNum="tabNum"
				@callback="tabChange"
				ref="Tabs"
			/>
			<div
				class="export-box"
				@click="exportFunc"
			>
				<ExportIcon class="export-icon"></ExportIcon>
				<span class="export-text">数据导出</span>
			</div>
		</div>
		<!-- 表格 -->
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:columns="onlineSuppColumns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<!-- 合同信息 -->
				<template
					slot="contractInfo"
					slot-scope="contractInfo, items, index"
				>
					<div class="column-flex special">
						<a-space :size="12">
							<div
								@mouseenter="onMouseOverContractNo(index, 'copyContractNoVisible')"
								@mouseleave="onMouseOutContractNo(index, 'copyContractNoVisible')"
							>
								<em
									class="contractTypeSymbol"
									:class="[items.contractType.includes('销') ? 'SELL' : '']"
									>{{ items.contractType.includes('采') ? '采' : '销' }}</em
								>
								<span>合同编号：{{ items.contractNo || '-' }}</span>
								<span
									v-show="!items.copyContractNoVisible"
									class="copy-icon"
									>
									<Copy></Copy>
								</span>
								<span
									v-show="items.copyContractNoVisible"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="items.contractNo"
									class="copy-icon"
									>
									<CopyNow></CopyNow>
								</span>
							</div>
						</a-space>
						<a-row
							type="flex"
							justify="start"
							:gutter="15"
						>
							<a-col :span="24">
								<p v-if="VUEX_ST_COMPANYSUER.companyUscc == items.buyerCompanyUscc">
									<span class="label">卖方：</span>
									<TextOverFlow
										:content="items.sellerCompanyName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p v-else>
									<span class="label">买方：</span>
									<TextOverFlow
										:content="items.buyerCompanyName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p>
									<span class="label">收货人：</span>
									<TextOverFlow
										v-if="items.receiverName"
										:content="items.receiverName || '-'"
										:maxWidth="maxWidth"
									/>
									<span v-else>-</span>
								</p>

								<p>
									<span
										class="label"
										style="margin-bottom: 0"
										>交货期限：</span
									>
									<TextOverFlow
										v-if="items.deliveryStartDate"
										:content="(items.deliveryStartDate || '-') + '至' + (items.deliveryEndDate || '-')"
										:maxWidth="maxWidth"
									/>
									<span v-else>-</span>
								</p>
							</a-col>
						</a-row>
					</div>
				</template>
				<!-- 补协信息 -->
				<template
					slot="suppInfo"
					slot-scope="contractInfo, items, index"
				>
					<div class="column-flex special">
						<a-space :size="12">
							<div
								@mouseenter="onMouseOverContractNo(index, 'serialNoVisible')"
								@mouseleave="onMouseOutContractNo(index, 'serialNoVisible')"
							>
								<span>补协编号：{{ items.supplementalAgreementNo || '-' }}</span>
								<span
									v-show="!items.serialNoVisible"
									class="copy-icon"
									>
									<Copy></Copy>
								</span>
								<span
									v-show="items.serialNoVisible"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="items.supplementalAgreementNo"
									class="copy-icon"
									>
									<CopyNow></CopyNow>
								</span>
							</div>
							<a-tooltip
								placement="top"
								trigger="hover"
								:destroyTooltipOnHide="true"
								@visibleChange="e => visibleChange(e, items)"
							>
								<template slot="title">
									<a-spin v-if="!tipShowText">
										<a-icon
											slot="indicator"
											type="sync"
											style="font-size: 16px; color: #fff"
											spin
										/>
									</a-spin>
									<div
										v-else
										style="word-break: break-all"
									>
										{{ tipShowText }}
									</div>
								</template>
								<p :class="'contract-status ' + items.status">
									<span class="text">{{ items.statusDesc }}</span>
								</p>
							</a-tooltip>
						</a-space>
						<a-row
							type="flex"
							justify="start"
							:gutter="15"
						>
							<a-col :span="24">
								<div
									class="sup-item"
									:class="[child.class, child.valueDesc ? '' : 'opacity', index == 2 ? 'no-margin' : '']"
									:key="index"
									v-for="(child, index) in tiledArr(items.changeItems, items).list"
								>
									<span> {{ child.itemCName }}：</span>

									<div
										style="display: flex"
										class="omit"
										:style="{ 'max-width': `${maxWidth2}px` }"
									>
										<a-tooltip v-if="!child.class">
											<template slot="title">
												<span v-if="child.oldValueDesc">【{{ child.oldValueDesc }}】变更为</span>
												<span>【{{ child.valueDesc }}】</span>
											</template>
											<span
												style="color: rgba(0, 0, 0, 0.8)"
												class="omit"
												:style="{ 'max-width': `${maxWidth2}px` }"
											>
												<span
													class="omit"
													style="color: rgba(0, 0, 0, 0.8); vertical-align: bottom; max-width: 100%"
													v-if="child.oldValueDesc"
													>【{{ child.oldValueDesc }}】变更为</span
												>
												<span
													:style="{ width: `${!child.oldValueDesc ? '100%' : 'inherit'}` }"
													class="omit"
													style="color: rgba(0, 0, 0, 0.8); vertical-align: bottom"
													>【{{ child.valueDesc }}】</span
												>
											</span>
										</a-tooltip>
										<a-tooltip>
											<template slot="title">
												<p
													key="index"
													v-for="(child2, i) in tiledArr(items.changeItems, items).otherList"
													:key="i"
												>
													<span> {{ child2.itemCName }}：</span>
													<span>
														<span v-if="child2.oldValueDesc">【{{ child2.oldValueDesc }}】变更为</span>【{{
															child2.valueDesc
														}}】</span
													>
												</p>
											</template>
											<a
												v-if="tiledArr(items.changeItems, items).otherList.length && index == 2"
												style="font-size: 12px; margin-left: 10px"
												>更多</a
											>
										</a-tooltip>
									</div>
								</div>
							</a-col>
						</a-row>
					</div>
				</template>

				<template
					slot="signDate"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<!-- <p class="label" style="margin-bottom: 5px;">已付款金额(元):</p> -->
						<p>{{ items.signDate }}</p>
					</div>
				</template>

				<template
					slot="action"
					slot-scope="text, items"
				>
					<!-- 发起方 -->

					<div
						class="column-flex column-flex2"
						v-if="items.isInitiator"
					>
						<!-- 发起方盖章 -->
						<div
							@click="goSign(items)"
							v-auth="'dgChain:contract:supplementalAgreement:seal'"
							v-if="['WAIT_INITIATOR_SEAL'].includes(items.status)"
						>
							<a>补协盖章</a>
						</div>

						<div
							@click="goEdit(items)"
							v-auth="'dgChain:contract:supplementalAgreement:edit'"
							v-if="['DRAFT'].includes(items.status)"
						>
							<a>补协修改</a>
						</div>

						<div
							@click="goDetail(items)"
							v-if="!['WAIT_INITIATOR_SEAL'].includes(items.status)"
						>
							<a>补协详情</a>
						</div>
						<div
							@click="openDownload(items)"
							v-auth="'dgChain:contract:supplementalAgreement:download'"
						>
							<a>下载</a>
						</div>
						<!-- 草稿 发起方/接收方审批驳回  接收方驳回 发起方/接受放作废 -->
						<div
							@click="openDel(items)"
							v-auth="'dgChain:contract:supplementalAgreement:delete'"
							v-if="
								[
									'DRAFT',
									'INITIATOR_AUDIT_REJECT',
									'RECEIVER_REJECT',
									'RECEIVER_AUDIT_REJECT',
									'RECEIVER_CANCEL',
									'INITIATOR_CANCEL'
								].includes(items.status)
							"
						>
							<a>删除</a>
						</div>
					</div>
					<!-- 接收方 -->
					<div
						class="column-flex column-flex2"
						v-else
					>
						<!-- 待接收方盖章 -->
						<div
							@click="goSign(items)"
							v-auth="'dgChain:contract:supplementalAgreement:seal'"
							v-if="['WAIT_RECEIVER_SEAL'].includes(items.status)"
						>
							<a>补协盖章</a>
						</div>
						<!-- 待接收方确认 -->
						<div
							@click="goConfirmStamp(items)"
							v-auth="'dgChain:contract:supplementalAgreement:receiverConfrim'"
							v-if="['WAIT_RECEIVER_CONFIRM'].includes(items.status)"
						>
							<a>补协确认</a>
						</div>

						<div
							@click="goDetail(items)"
							v-if="!['WAIT_RECEIVER_CONFIRM', 'WAIT_RECEIVER_SEAL'].includes(items.status)"
						>
							<a>补协详情</a>
						</div>
						<div
							@click="openDownload(items)"
							v-auth="'dgChain:contract:supplementalAgreement:download'"
						>
							<a>下载</a>
						</div>
					</div>
				</template>
			</a-table>

			<i-pagination
				:pagination="pagination"
				size="small"
				v-show="pageSize < pagination.total"
				@change="getList"
			/>
			<TipModal
				tip="确认要删除该补协吗，删除后无法恢复。"
				title="提示"
				ref="del"
				@save="saveDel"
			/>
			<ConfirmModal
				ref="download"
				@save="saveConfirm"
			>
				<div class="radio-box">
					<a-radio-group v-model="radioValue">
						<p style="margin-bottom: 10px"><a-radio :value="0"> 原合同及历史补协一起下载 </a-radio></p>
						<p><a-radio :value="1"> 仅下载当前补协文件 </a-radio></p>
					</a-radio-group>
				</div>
			</ConfirmModal>
		</div>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {ExportIcon, Copy, CopyNow} from '@sub/components/svg'

import {
	getOnlineSupAgreementList,
	getSupTabNum,
	getStatusTip,
	exportXls,
	downloadAllSup,
	downloadCurrentSup,
	delOnlineSupp,
	check
} from '@/v2/center/trade/api/suppleAgreement';

import TipModal from './components/TipModal.vue';

import ConfirmModal from './components/ConfirmModal.vue';

import { mapGetters, mapMutations } from 'vuex';

import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';

import TextOverFlow from "@sub/components/TextOverflow.vue";
import tableTooltipSell from './tips.js';
import comDownload from '@sub/utils/comDownload.js';
import ContractFunc from '../components/ContractFunc.vue';
import { getContractAction } from '../action';

import reportCode from '@/v2/config/reportCode';

import Tabs from '../components/suppleAgreement/Tabs.vue';
import { isEqual } from 'lodash';
import moment from 'moment';

const searchList = [
	{
		decorator: ['no'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、补协编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},

	{
		decorator: ['contractType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		placeholder: '请选择合同类型',
		options: [
			{ value: 'BUY', label: '采购合同' },
			{ value: 'SELL', label: '销售合同' }
		]
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '合同日期',
		type: 'rangePicker',
		realKey: ['contractSignDateStart', 'contractSignDateEnd']
	},

	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '补协日期',
		type: 'rangePicker',
		realKey: ['signDateStart', 'signDateEnd']
	}
];
const onlineSuppColumns = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '补协信息', dataIndex: 'suppInfo', scopedSlots: { customRender: 'suppInfo' }, ellipsis: true },
	{ title: '补协签订日期', dataIndex: 'signDate', scopedSlots: { customRender: 'signDate' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineSuppColumns,
			getPopupContainer,
			url: {
				list: getOnlineSupAgreementList
			},
			columns: [],
			searchList,
			//排序参数
			isorter: {
				column: 'createTime',
				order: 'desc'
			},
			dataSource: [],
			statusData: filterCodeByKey('supplementalAgreementTabDict'),
			status: 'TAB_ALL',
			copyContractNoVisible: false, // 复制合同编号icon
			// 补协编号
			serialNoVisible: false,

			tipShowText: '', // 合同状态文案
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidth2: 0, // 合同信息左边文案最大宽度

			actionWidth: 80, // 操作列的宽度
			tabNum: {}, // 不同状态的数据统计
			clientWidth: null, //浏览器尺寸
			detailData: {},

			radioValue: 0,
			// 操作的对象
			currentItem: {},
			selfLoad: false
		};
	},
	props: ['type', 'supplementalAgreementNo'], // SELL销售 BUY采购
	components: {
		TextOverFlow,
		ContractFunc,
		Tabs,
		TipModal,
		ConfirmModal,
		ExportIcon,
		Copy,
		CopyNow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
		// 判断是否是发起方
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		},
		dataSource: {
			handler: function (data) {
				data.forEach(item => {
					item.copyContractNoVisible = item.copyContractNoVisible || false;
					item.serialNoVisible = item.serialNoVisible || false;
				});
			},
			immediate: true,
			deep: true
		}
	},
	created() {
		// 从合同过来
		if (this.$route.query.supplementalAgreementNo) {
			const data = [{ name: '编号', value: this.$route.query.supplementalAgreementNo, key: 'no', type: 'input' }];
			this.selfLoad = true;
			this.$nextTick(() => {
				this.$refs.searchForm.initDefault('no', data);
				this.handleChange({ no: this.$route.query.supplementalAgreementNo });
			});
		}
		this.getNum();
	},

	mounted() {
		this.clientWidth = document.body.clientWidth;

		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth <= 1440) {
				this.maxWidth = 200;
				this.maxWidth2 = 320;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 200;
				this.maxWidth2 = 320;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 250;
				this.maxWidth2 = 360;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 400;
				this.maxWidth2 = 500;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 400;
				this.maxWidth2 = 600;
			} else {
				this.maxWidth = 463;
				this.maxWidth2 = 600;
			}
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getNum();
			this.changeSearch(data);
		},
		// 获取数据统计数
		async getNum() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			const res = await getSupTabNum(params);
			let dataArr = res.data || [];
			dataArr.forEach((item, index) => {
				if (['TAB_WAIT_OWN_CONFIRM', 'TAB_WAIT_OWN_SIGN'].includes(item.tab)) {
					this.$set(this.tabNum, item.tab, item.quantity);
				}
			});
		},
		tabChange(val) {
			this.defaultParams.status = val;
			this.pagination.pageNo = 1;
			this.getNum();
			this.getList();
		},
		/** 平铺所有的更改项 */
		tiledArr(arr = [], item) {
			if (item.signContentStr) {
				item.signContentStr = item.signContentStr.replace(/&nbsp;/g, '');
				item.signContentStr = item.signContentStr.length >= 100 ? `${item.signContentStr.slice(0, 100)}...` : item.signContentStr;
			}

			let list = [];
			let tplList = [];
			let otherList = [];
			arr.forEach(el => {
				const tpl = el.itemDetails || [];
				if (el.fieldName == 'deliveryDate') {
					const obj = {
						itemCName: '交货期限',
						itemName: 'deliveryDate',
						oldValueDesc: `${tpl[0].oldValue}至${tpl[1].oldValue}`,
						valueDesc: `${tpl[0].valueDesc}至${tpl[1].valueDesc}`
					};
					list.push(obj);
					tplList.push(obj);
				} else if (el.fieldName == 'quantity') {
					const obj = {
						itemCName: '数量(吨)',
						itemName: 'quantity',
						oldValueDesc: `${tpl[0].oldValueDesc}吨`,
						valueDesc: `${tpl[0].valueDesc}吨`
					};
					if (tpl[1] && tpl[1].oldValueDesc) {
						obj.oldValueDesc += `（±${tpl[1].oldValueDesc}%）`;
					}
					if (tpl[1] && tpl[1].valueDesc) {
						obj.valueDesc += `（±${tpl[1].valueDesc}%）`;
					}

					list.push(obj);

					tplList.push(obj);
				} else if (el.fieldName == 'transportMode') {
					const obj = tpl.find(el => el.itemName == 'transportMode');
					list.push(obj);
					tplList.push(obj);
				} else {
					tpl.forEach(el2 => {
						list.push(el2);
						tplList.push(el2);
					});
				}
			});

			if (tplList.length == 0) {
				list = [{ class: 'opacity' }, { class: 'opacity' }, { class: 'opacity' }];
				if (item && item.signContentStr) {
					list[0] = {
						itemCName: '其他事项',
						value: item.signContentStr,
						valueDesc: item.signContentStr,
						itemName: 'other'
					};
				}
			} else if (tplList.length == 1) {
				list = [...list, { class: 'opacity' }, { class: 'opacity' }];
				if (item && item.signContentStr) {
					list[1] = {
						itemCName: '其他事项',
						value: item.signContentStr,
						valueDesc: item.signContentStr,
						itemName: 'other'
					};
				}
			} else if (tplList.length == 2) {
				list = [...list, { class: 'opacity' }];
				if (item && item.signContentStr) {
					list[2] = {
						itemCName: '其他事项',
						value: item.signContentStr,
						valueDesc: item.signContentStr,
						itemName: 'other'
					};
				}
			} else if (tplList.length >= 3) {
				/** 截取 */
				otherList = tplList.splice(3);
				list = tplList;
				if (item && item.signContentStr) {
					otherList[otherList.length] = {
						itemCName: '其他事项',
						value: item.signContentStr,
						valueDesc: item.signContentStr,
						itemName: 'other'
					};
				}
			}

			return {
				list,
				otherList
			};
		},

		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			exportXls({
				...this.defaultParams,
				...this.searchParams,
				supplementAgreementType: 'ONLINE'
			})
				.then(res => {
					comDownload(res, undefined, `电子补协-${this.VUEX_ST_COMPANYSUER.companyName}-${currentDate}.xls`);
				})
				.finally(() => {});
		},
		// 选择合同 弹窗 跳转
		initDefault(value) {
			const data = [{ name: '编号', value: value, key: 'no', type: 'input' }];
			this.$nextTick(() => {
				this.$refs.searchForm.initDefault('no', data);
				this.handleChange({ no: value });
			});
		},

		// 鼠标移入复制合同编号
		onMouseOverContractNo(index, key) {
			let obj = {
				...this.dataSource[index]
			};
			obj[key] = true;
			this.$set(this.dataSource, index, obj);
		},
		// 鼠标移出
		onMouseOutContractNo(index, key) {
			let obj = {
				...this.dataSource[index]
			};
			obj[key] = false;
			this.$set(this.dataSource, index, obj);
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		async visibleChange(visible, items) {
			// 合同状态文案
			if (visible) {
				const res = await getStatusTip({ id: items.id });
				this.tipShowTextMethods(items, res.data);
			} else {
				this.tipShowText = '';
			}
		},
		tipShowTextMethods(row, data) {
			// 合同状态文案展示
			let text = '';
			// 发起方
			if (row.isInitiator) {
				text = tableTooltipSell[row.status].a;
			} else {
				text = tableTooltipSell[row.status].b;
			}

			// 发起方审批驳回  接收方审批驳回

			if (['INITIATOR_AUDIT_REJECT', 'RECEIVER_AUDIT_REJECT'].includes(row.status) && data?.rejectReason) {
				text += '，驳回原因：' + data?.rejectReason;
			}

			// 接收方 发起方作废
			if (['RECEIVER_CANCEL', 'INITIATOR_CANCEL'].includes(row.status) && data?.cancelReason) {
				text += '，作废原因：' + data?.cancelReason;
			}

			text = text.replace('【审批部门】', data.auditDesc || '');
			this.tipShowText = text;
		},
		goSign(item) {
			this.$router.push({
				path: '/center/contract/agreement/stamp',
				query: {
					id: item.id,
					contractType: 'buy',
					suppleType: 'on',
					isInitiator: item.isInitiator
				}
			});
		},
		resetFunc() {
			this.defaultParams.status = 'TAB_ALL';
			this.$refs.Tabs.status = 'TAB_ALL';
		},
		async openDel(item) {
			const prams = {
				supplementAgreementId: item.id,
				operate: 'INITIATOR_DELETE'
			};
			await check(prams);
			this.currentItem = item;
			this.$refs.del.open();
		},
		openDownload(items) {
			this.currentItem = items;
			this.$refs.download.open();
		},
		goDetail(item) {
			this.$router.push({
				path: '/center/contract/agreement/detail',
				query: {
					id: item.id,
					contractType: 'buy',
					suppleType: 'on',
					isInitiator: item.isInitiator
				}
			});
		},
		async goEdit(item) {
			const prams = {
				supplementAgreementId: item.id,
				operate: 'INITIATOR_SAVE'
			};
			await check(prams);
			this.$router.push({
				path: '/center/contract/agreement/add',
				query: {
					id: item.id,
					contractType: 'buy',
					suppleType: 'on',
					orderId: item.orderId,
					contractNo: item.contractNo,
					isInitiator: item.isInitiator
				}
			});
		},
		// 确认盖章
		goConfirmStamp(item) {
			this.$router.push({
				path: '/center/contract/agreement/confirmStamp',
				query: {
					id: item.id,
					contractType: 'buy',
					suppleType: 'on',
					isInitiator: item.isInitiator
				}
			});
		},
		async saveConfirm() {
			const Api = this.radioValue == 0 ? downloadAllSup : downloadCurrentSup;

			const params = {
				id: this.currentItem.id,
				supplementAgreementType: 'ONLINE'
			};
			const res = await Api(params);

			if (this.radioValue === 0) {
				const date = moment(this.currentItem.contractSignTime).format('LL');
				const name = `${this.currentItem.contractType}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}-${this.currentItem.contractNo}-${date}.zip`;
				comDownload(res.data, '', name);
			} else {
				const name = `电子补充协议-${this.currentItem.supplementalAgreementNo}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}.pdf`;
				comDownload(res.data, '', name);
			}
			this.$refs.download.close();
		},

		async saveDel() {
			const params = {
				id: this.currentItem.id
			};
			await delOnlineSupp(params);
			this.$message.success('删除成功');
			this.$refs.del.close();
			this.getList();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.new-table {
	::v-deep .ant-table-tbody > tr > td {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		line-height: 22px;
		position: relative;
		.column-flex {
			& > p {
				line-height: 22px;
			}
			&::after {
				content: '';
				width: 1px;
				height: 80px;
				background: #e5e6eb;
				position: absolute;
				top: 50%;
				right: 0;
				margin-top: -40px;
			}
			& > .ant-space {
				margin-bottom: 20px;
				& > div {
					cursor: pointer;
					.copy-icon {
						margin-left: 12px;
						cursor: pointer;
						position: relative;
						top: 2px;
						width: 14px;
						height: 14px;
					}
				}
			}
			.ant-col {
				.label {
					width: 70px;
				}
			}
		}
		.column-flex.special {
			p {
				position: relative;
			}
		}
		.column-flex2::after {
			content: '';
			opacity: 0;
		}
		.label {
			display: inline-block;
			margin-bottom: 10px;
			color: rgba(0, 0, 0, 0.4);
		}
	}
	::v-deep .ant-table-tbody > tr > td:first-child {
		padding-left: 12px;
	}
	::v-deep .ant-table-tbody > tr > td:nth-child(2) {
		padding-left: 12px;
	}
	::v-deep .ant-table-thead > tr > th {
		padding: 10px 20px;
	}
	::v-deep .ant-table-thead > tr > th:first-child {
		padding-left: 12px;
	}
	::v-deep .ant-table-thead > tr > td:nth-child(2) {
		padding-left: 12px;
	}
	.contract-status {
		border-radius: 4px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		background: #c9d9ff;
		color: #596fa0;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		text-align: center;
		.text {
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -1px;
		}
	}
	.right-arrow {
		display: inline-block;
		width: 10px;
		height: 10px;
		background: url('~@/v2/assets/imgs/contract/right_more_icon.png') no-repeat 100% / cover;
		margin-left: 2px;
	}
}

.tabs-box {
	position: relative;
	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
	.export-box {
		position: absolute;
		right: 0;
		top: 16px;
		text-align: right;
		cursor: pointer;
		.export-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: 1px;
		}
		.export-text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 20px;
		}
	}
	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
	}
}
.table-box.fixedBottom {
	.new-table {
		margin-bottom: 2px;
	}
	.slPagination {
		margin-top: 10px;
		width: calc(100% - 254px);
		min-width: 1186px;
		background: #fff;
		padding: 10px 30px;
		position: fixed;
		bottom: 0;
		left: 228px;
	}
}
.sup-item {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	color: rgba(0, 0, 0, 0.8);
	span:first-child {
		display: inline-block;
		color: rgba(0, 0, 0, 0.4);
	}
}
.opacity {
	opacity: 0;
}
.radio-box {
	color: rgba(0, 0, 0, 0.8);

	/deep/ .ant-radio-inner::after {
		background: #fff;
	}
	/deep/ .ant-radio-checked .ant-radio-inner {
		background: @primary-color;
	}
}

.AUDITING {
	background: #ffdac8 !important;
	color: #ff7937 !important;
}
.EXECUTING {
	background: #c1d7ff !important;
	color: #4682f3 !important;
}
.DRAFT {
	background: #ffdbdb !important;
	color: #dd4444 !important;
}
.CONFIRM_WAIT_SIGN_SEAL,
.COMPLETED {
	background: #c5ecdd !important;
	color: #3eb384 !important;
}
.WAIT_CONFIRM {
	background: #c9d9ff !important;
	color: #596fa0 !important;
}
.TERMINATED {
	background: #e0e0e0 !important;
	color: rgba(0, 0, 0, 0.25) !important;
}

.FREEZING {
	background: #f8dde8 !important;
	color: #db81a5 !important;
}
//“驳回”、“退回”、“作废”
.REJECT,
.APPROVAL_FAIL,
.CANCELLATION,
.INITIATOR_CANCEL,
.RECEIVER_REJECT {
	background: #f2d0d0 !important;
	color: #dd4444 !important;
}
.WAIT_SIGN_SEAL,
.AUDITING_RECEIVE {
	background: #d3dffb !important;
	color: #4682f3 !important;
}
.WAIT_COMPLETE {
	background: #c2e6ff !important;
	color: #649dc7 !important;
}
.new-table {
	::v-deep .ant-table-tbody > tr {
		td:last-child {
			padding: 0 25px !important;
		}
	}
}
// <=1560
@media screen and (max-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 20px 10px;
			}
			td:first-child {
				width: 305px;
			}
			td:nth-child(2) {
				width: 450px;
			}
			td:nth-child(3) {
				width: 148px;
			}
			td:nth-child(4) {
				width: 180px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th:last-child {
				padding: 10px 10px;
			}
			th:first-child {
				width: 365px;
			}
			th:nth-child(2) {
				width: 450px;
			}
			th:nth-child(3) {
				width: 148px;
			}

			th:nth-child(4) {
				width: 180px;
			}
		}
	}
}
// <=1440
@media screen and (max-width: 1440px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 20px;
				box-sizing: border-box;
			}
			td:nth-child(1) {
				width: 315px;
			}
			td:nth-child(2) {
				width: 420px;
			}
			td:nth-child(3) {
				width: 128px;
			}
			td:nth-child(4) {
				width: 148px;
			}

			td:last-child {
				padding: 0 19px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 20px !important;
			}
			th:nth-child(1) {
				width: 315px;
				padding-left: 12px !important;
			}
			th:nth-child(2) {
				width: 420px;
				padding-left: 12px !important;
			}

			th:nth-child(3) {
				width: 128px;
			}
			th:nth-child(4) {
				width: 148px;
			}
		}
	}
}
// >=1560px
@media screen and (min-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child {
				width: 400px;
			}
			td:nth-child(2) {
				width: 500px !important;
			}
			td:nth-child(3) {
				width: 148px;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 400px;
			}
			th:nth-child(2) {
				width: 500px !important;
			}
			th:nth-child(3) {
				width: 148px;
			}
		}
	}
}
// >=1920px
@media screen and (min-width: 1920px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 22px 30px !important;
			}
			td {
				width: auto !important;
			}
			td:first-child,
			td:nth-child(2) {
				width: 600px !important;
				padding-left: 12px !important;
			}
			td:last-child {
				width: auto !important;
				// width: 148px!important;
			}
			td:nth-child(3) {
				width: auto !important;
				// width: 148px ! important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 30px !important;
			}
			// th{
			//   width: auto!important;
			// }
			th:first-child,
			th:nth-child(2) {
				width: 600px !important;
				padding-left: 12px !important;
			}
			th:last-child {
				// width: 148px!important;
				width: auto !important;
			}
			th:nth-child(3) {
				// width: 148px !important;
				width: auto !important;
			}
		}
	}
}
// >=2048px
@media screen and (min-width: 2048px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child,
			td:nth-child(2) {
				width: 800px !important;
			}
			td:last-child,
			td:nth-child(3) {
				width: auto !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child,
			th:nth-child(2) {
				width: 800px !important;
			}
			th:last-child,
			th:nth-child(3) {
				width: auto !important;
			}
		}
	}
}
// >=3000
@media screen and (min-width: 3000px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 30px 50px !important;
			}
			td:first-child,
			td:nth-child(2) {
				width: 1200px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 50px !important;
			}
			th:first-child,
			th:nth-child(2) {
				width: 1200px !important;
			}
		}
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
	top: 0px;
	margin-right: 12px;
}
.contractTypeSymbol.SELL {
	background: #ff800f;
}
.omit {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.no-margin {
	margin-bottom: 0;
}
</style>
