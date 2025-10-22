<template>
	<div style="width: 100%">
		<div
			:bordered="false"
			v-if="detailData"
		>
			<!-- 只显⽰当前“平台驳回”的审核信息 -->
			<div>
				<AuditInfoView :detailData="detailData" />
			</div>
			<!-- 基本信息 -->
			<div class="s-card-content">
				<BaseinfoView :detailData="detailData" />
			</div>
			<!-- 应付账款信息 -->
			<div class="s-card-content">
				<AssetsInfoView
					:detailData="detailData"
					@receivalVOChange="receivalVOChange"
					ref="assetsInfoView"
				/>
			</div>
			<!-- 审批流程 -->
			<div class="s-card-content">
				<div class="slTitleAssis">
					<a-space :size="20">
						单据信息
						<div class="slTitleAssisSwitch">
							<a-switch
								v-model="toolTipVisible"
								@change="changeToolTipVisible"
							/>
							资产清单
						</div>
					</a-space>
				</div>
				<div class="divider"></div>
				<a-row
					:gutter="20"
					type="flex"
					style="flex-wrap: nowrap"
				>
					<a-col flex="160px">
						<LeftTabs
							@tabChange="tabChange"
							ref="leftTabs"
							:toolTipVisible="toolTipVisible"
							:activeIndex="activeIndex.toString()"
							:detailData="detailData"
						/>
					</a-col>
					<!-- 右侧数据展示模块 -->
					<a-col
						flex="auto"
						style="width: 0"
					>
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 合同 -->
							<contract
								v-show="activeIndex == 0"
								:editFlag="true"
								:contractInfo="detailData.contractInfo"
								ref="contract"
							></contract>
							<!-- 运输凭证 -->
							<transport-document
								v-show="activeIndex == 1"
								:editFlag="true"
								:transportRequired="transportRequired"
								:deliverInfo="detailData.deliverInfo"
								:transInfoBatchAttachList="transInfo.batchAttachList || []"
								ref="transport"
							></transport-document>
							<!-- 数质量凭证 -->
							<quality-document
								v-show="activeIndex == 2"
								:editFlag="true"
								:recvInfo="detailData.recvInfo"
								:transInfoRecvList="transInfo.recvList || []"
								:transInfoReceiveAttachList="transInfo.receiveAttachList || []"
								ref="quality"
							></quality-document>
							<!-- 货转凭证 -->
							<goods-transfer-document
								v-show="activeIndex == 3"
								:editFlag="true"
								:goodTransferInfo="detailData.goodTransferInfo"
								:transInfoGoodsTransferAttachList="transInfo.goodsTransferAttachList || []"
								ref="transfer"
							></goods-transfer-document>
							<!-- 核算表 -->
							<accounts-table
								v-show="activeIndex == 4"
								:editFlag="true"
								:accountInfo="detailData.accountInfo"
								ref="accounts"
							></accounts-table>
							<!-- 确认函 -->
							<confirm-letter
								v-show="activeIndex == 5"
								:editFlag="true"
								:confirmLetterInfo="detailData.confirmLetterInfo"
								ref="confirm"
							></confirm-letter>
							<!-- 发票 -->
							<invoice
								v-show="activeIndex == 6"
								ref="invo"
								:editFlag="true"
								:invoiceInfo="detailData.invoiceInfo"
							></invoice>
							<!-- 其他材料 -->
							<other-files
								v-show="activeIndex == 7"
								:editFlag="true"
								:otherInfo="detailData.otherInfo"
								:otherAttachList="otherAttachList"
								ref="other"
							></other-files>
							<!-- 结算单 -->
							<settles-files
								v-show="activeIndex == 8"
								:editFlag="true"
								:settleInfo="detailData.settlementInfo"
								:receivalVO="receivalVO"
								ref="settles"
							></settles-files>
						</div>
					</a-col>
				</a-row>
			</div>
		</div>
		<div class="btn-box">
			<div
				class="btn-wrap"
				v-if="detailData"
			>
				<a-button
					@click="$router.push('/center/assets/payable/manage/list')"
					type="primary"
					ghost
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="onSubmit('save')"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="onSubmit('submit')"
					>提交</a-button
				>
			</div>
		</div>
		<a-modal
			class="modal"
			:header="null"
			:footer="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="confirmModal"
				style="display: block; margin: 30px auto 0"
			>
				确定
			</a-button>
		</a-modal>
		<modalMain
			ref="modalMain"
			title="提交确认"
			:width="500"
			@verify="modalMainOK"
		>
			<div class="main">
				<div class="title">请确认以下信息是否有误:</div>
				<div class="mainTable">
					<div
						class="item"
						v-if="needPushOaShow"
					>
						<span class="label required">是否推送OA：</span>
						<a-radio-group
							name="radioGroup"
							v-model="needPushOa"
						>
							<a-radio :value="true"> 推送 </a-radio>
							<a-radio :value="false"> 不推送 </a-radio>
						</a-radio-group>
					</div>
					<div class="item">
						<span class="label">卖方企业：</span>
						<span>{{ detailData.receivalVO.sellerName || '-' }}</span>
					</div>
					<div class="item">
						<span class="label">资金类型：</span>
						<span>{{ detailData.receivalVO.paymentTypeName || '-' }}</span>
					</div>
					<div class="item">
						<span class="label">应付账款金额：</span>
						<span
							v-if="confirmSubmitObj"
							class="red"
							>{{ confirmSubmitObj.amount | formatMoney(4) }}元({{ convertCurrency(confirmSubmitObj.amount) }})</span
						>
						<span v-else>-</span>
					</div>
					<div class="item">
						<span class="label">拟融资金额：</span>
						<span
							v-if="confirmSubmitObj"
							class="red"
							>{{ confirmSubmitObj.planFinancingAmount | formatMoney(4) }}元({{
								convertCurrency(confirmSubmitObj.planFinancingAmount)
							}})</span
						>
						<span v-else>-</span>
					</div>
					<div class="item">
						<span class="label">应付账款起止日期：</span>
						<span v-if="confirmSubmitObj">{{ confirmSubmitObj.beginDate }}至{{ confirmSubmitObj.endDate }}</span>
						<span v-else>-</span>
					</div>
				</div>
			</div>
		</modalMain>
	</div>
</template>
<script>
import BaseinfoView from './BaseinfoView.vue';
import AssetsInfoView from './AssetsInfoView.vue';
import AuditInfoView from './AuditInfoView.vue';
import Cookies from 'js-cookie';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_UPLOAD_WATER_MARk } from '@/v2/api/upload';
import {
	API_EditAccountsPayable,
	API_GetDeliveryBatchByAssetId,
	API_GetTransInfo,
	API_GetTrack,
	API_GetInvoiceList,
	API_GetOtherAttach,
	API_GetGoodsTransByAssetId,
	API_RECEIVERECORDINFO,
	API_getRouteInfo,
	API_GETTRAINRECORD,
	API_GetInvoiceResult,
	exportReceivableInvoice,
	API_FullBusinessLineDetailV1,
	API_COMPANplatformRiskAudit
} from '@/v2/center/assets/api/index.js';
import { API_COMPANYOACHECKPOOL } from '@/api/index.js';
import { API_CYGetPaymentAccountVoByPaymentId, API_GetBankProductItem } from '@/v2/center/trade/api/pay';
import Contract from '@sub/componentsAssets/Contract.vue';
import TransportDocument from '@sub/componentsAssets/TransportDocument.vue';
import QualityDocument from '@sub/componentsAssets/QualityDocument.vue';
import GoodsTransferDocument from '@sub/componentsAssets/GoodsTransferDocument.vue';
import AccountsTable from '@sub/componentsAssets/AccountsTable.vue';
import ConfirmLetter from '@sub/componentsAssets/ConfirmLetter.vue';
import Invoice from '@sub/componentsAssets/Invoice.vue';
import OtherFiles from '@sub/componentsAssets/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import { mapGetters } from 'vuex';
import { convertCurrency } from '@/v2/utils/factory.js';
import LeftTabs from '@sub/componentsAssets/LeftTabs.vue';
import modalMain from '@/v2/components/modalInfo/main';

export default {
	data() {
		return {
			remainAmount: 0,
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.defaultIndex,
			strMsg: '', // 提交时发票状态错误提示信息内容
			visible: false, // 提交时发票状态错误提示信息弹窗
			validateMsgHideShowMIn: false,
			toolTipVisible: false,
			detailData: {},
			transInfo: {
				batchAttachList: [], // 发货附件列表
				recvList: [], // 收货列表
				receiveAttachList: [], // 收货附件列表
				goodsTransferAttachList: [] // 货转附件列表
			}, // 批次信息对应的收货、货转等信息
			otherAttachList: [], // 批次对应的其他材料
			confirmSubmitObj: undefined,
			convertCurrency,
			platformRiskAudit: true, // 判断是否需要平台风控审核
			needPushOa: true,
			oaflag: false
		};
	},
	props: {
		defaultIndex: {
			type: [Number, String],
			default: () => {
				return 0;
			}
		},
		defaultDetailData: {
			type: Object,
			default: undefined
		}
	},
	provide() {
		return {
			getDeliveryBatchByAssetIdParent: this.getDeliveryBatchByAssetId,
			actionParent: API_UPLOAD_WATER_MARk,
			openGuijiParent: this.openGuiji,
			getTransInfoParent: this.getTransInfo,
			getInvoiceListParent: this.getInvoiceList,
			getInvoiceResultParent: this.getInvoiceResult,
			getGoodsTransByAssetIdParent: this.getGoodsTransByAssetId,
			getOtherAttachParent: this.getOtherAttach,
			exportInvoiceParent: this.exportInvoice,
			getBankInfoParent: this.getBankInfo,
			orderNoParent: this.orderNo,
			detailDataReceivalVO: this.receivalVO,
			getBankProductItemParnet: API_GetBankProductItem,
			API_FullBusinessLineDetailV1
		};
	},
	watch: {
		defaultIndex(data) {
			this.tabChange(data);
		},
		defaultDetailData: {
			immediate: true,
			deep: true,
			handler(val) {
				this.detailData = val;
			}
		}
	},
	components: {
		BaseinfoView,
		AssetsInfoView,
		AuditInfoView,
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		SettlesFiles,
		OtherFiles,
		LeftTabs,
		modalMain
	},
	inject: {
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null }
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		// 若该资金类型运输凭证、数质量凭证有一个配置为必填，则必须至少勾选一个货物批次，
		transportRequired() {
			let transportRequired = false;
			if (this.detailData) {
				let { recvInfo, goodTransferInfo } = this.detailData;
				if (recvInfo && goodTransferInfo) {
					// 判断是否有必填
					let bankProductAssetConfigList = recvInfo.bankProductAssetConfigList || [];
					bankProductAssetConfigList = bankProductAssetConfigList.filter(item => item.status == 1);
					if (bankProductAssetConfigList.some(item => item.required)) {
						transportRequired = true;
					}
					bankProductAssetConfigList = goodTransferInfo.bankProductAssetConfigList || [];
					bankProductAssetConfigList = bankProductAssetConfigList.filter(item => item.status == 1);
					if (bankProductAssetConfigList.some(item => item.required)) {
						transportRequired = true;
					}
				}
			}
			return transportRequired;
		},
		// 资产信息，
		receivalVO() {
			return this.detailData?.receivalVO;
		},
		// 获取对应合同的订单编号，发票中绑定对应发票时使用
		orderNo() {
			let orderNo = '';
			if (this.detailData?.contractInfo) {
				let { upContract } = this.detailData.contractInfo;
				if (upContract?.orderNo) {
					orderNo = upContract.orderNo;
				}
			}
			return () => orderNo;
		},
		// 判断是否展示推送OA
		needPushOaShow() {
			// 不需平台风控审核，且对接OA的情况下展示
			// 陕煤系企业无论后端配置什么，都跳过平台风控审核
			return (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) && this.oaflag;
		}
	},
	mounted() {
		this.toolTipVisible = Cookies.get('assets-tooltip') === 'false' ? false : true;
	},
	methods: {
		changeToolTipVisible(e) {
			Cookies.set('assets-tooltip', e, { expires: 99999 });
		},
		// 获取银行信息，子组件使用
		getBankInfo() {
			return API_CYGetPaymentAccountVoByPaymentId({ paymentId: this.receivalVO?.paymentId });
		},
		// 资产信息变化
		receivalVOChange(params) {
			if (params.type) {
				// 改变账款类型
				let receivalVO = this.receivalVO;
				receivalVO.type = params.type;
				this.$set(this.detailData, 'receivalVO', receivalVO);
				// 如果不是发票结算，并且当前展示发票，切换当前展示
				if (params.type !== 'INVOICE' && this.activeIndex == 6) {
					this.tabChange(0);
				}
			}
		},
		// 选中发票导出
		exportInvoice(params) {
			// 获取实时参数，需要amount，endDate，
			let { endDate, amount } = this.$refs.assetsInfoView.paymentForm.getFieldsValue(['endDate', 'amount']);
			return exportReceivableInvoice({ assetId: this.receivalVO.id, endDate, amount, ...params });
		},
		// 查询发票信息详情
		getInvoiceResult(params) {
			return new Promise(resolve => {
				API_GetInvoiceResult(params).then(res => {
					if (res.success) {
						resolve(res.data);
					}
				});
			});
		},
		// 查询资产发票信息
		getInvoiceList(params) {
			return new Promise(resolve => {
				API_GetInvoiceList({ assetId: this.receivalVO.id, ...params }).then(res => {
					if (res.success) {
						resolve(res.data);
					}
				});
			});
		},
		// 根据资产id查询货转信息列表
		getGoodsTransByAssetId() {
			return API_GetGoodsTransByAssetId({ id: this.receivalVO.id });
		},
		// 根据发货批次id查询收货批次和货转信息等运输信息
		getTransInfo(deliverList) {
			let deliverIdList = deliverList.map(item => item.id).join(',');
			if (deliverIdList.length) {
				// 接口慢所以分开处理
				// 根据发货批次id查询收货批次和货转信息等运输信息
				API_GetTransInfo({ id: this.receivalVO.id, deliverIdList }).then(res => {
					if (res.success) {
						this.transInfo = res.data;
					}
				});
				// 接口生成文件速度慢，分开请求
				// 判断其他材料中是否有更新项
				API_GetTrack({ id: this.receivalVO.id, deliverIdList }).then(res => {
					if (res.success) {
						this.otherAttachList = res.data;
					}
				});
			} else {
				this.transInfo = {
					batchAttachList: [], // 发货附件列表
					recvList: [], // 收货列表
					receiveAttachList: [], // 收货附件列表
					goodsTransferAttachList: [] // 货转附件列表
				};
				this.otherAttachList = [];
			}
		},
		// 货转发生变化判断是否有下游货转附件
		getOtherAttach() {
			// 获取批次和货转编号
			let deliverIdList = (this.$refs.transport?.deliverList || []).map(item => item.id);
			let certNoList = (this.$refs.transfer?.selectedRows || []).map(item => item.no);
			// 判断是否有下游货转
			API_GetOtherAttach({ assetId: this.receivalVO.id, deliverIdList, certNoList }).then(res => {
				if (res.success) {
					this.otherAttachList = res.data;
				}
			});
		},
		// 查询轨迹子组件使用
		openGuiji(items, type) {
			return new Promise(resolve => {
				API_RECEIVERECORDINFO({ deliverId: items.id }).then(res => {
					if (type == 'SHIP') {
						let shipDataSource = (res.result.deliveryInfoShip || []).map(item => {
							return {
								...item,
								id: items.id
							};
						});
						resolve(shipDataSource);
					} else {
						this.jumpToTail(res.result);
					}
				});
			});
		},
		jumpToTail(params) {
			if (params.waybillId) {
				// 新数据  联运管家 传运单号
				// 判断是否是神华外购
				API_getRouteInfo({ id: params.waybillId }).then(res => {
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
							window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + params.waybillId);
						}
					}
				});
			} else {
				// 老数据 传批次号
				API_GETTRAINRECORD({ deliverBatchNo: params.batchNo }).then(res => {
					if (res.success) {
						if (params.despatchType == this.CONSTANTS.despatchModeDict.TRAIN) {
							window.open('/logistics/LogisticsDetailTrain?deliverBatchNo=' + params.batchNo);
						}
					}
				});
			}
		},
		// 根据资产查询发货批次-子组件使用
		getDeliveryBatchByAssetId() {
			return new Promise(resolve => {
				API_GetDeliveryBatchByAssetId({ id: this.receivalVO.id }).then(res => {
					if (res.success) {
						resolve(res.data);
					} else {
						resolve([]);
					}
				});
			});
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		modalMainOK() {
			// this.sendSubmit();
			this.$refs.modalMain.close();
			let obj = { ...this.confirmSubmitObj };
			if (this.needPushOaShow) {
				obj.needPushOa = this.needPushOa;
			}
			this.doSubmit(obj);
		},

		async confirmSubmit(obj) {
			this.confirmSubmitObj = obj;
			let paymentType = this.detailData.receivalVO?.paymentType;
			// 判断是否需要平台审核，
			if (paymentType) {
				let res = await API_COMPANplatformRiskAudit({ payType: paymentType });
				if (res.success) {
					this.platformRiskAudit = res.result;
				}
			}
			// 如果不需要平台审核，判断是否对接OA,
			// 陕煤系企业无论后端配置什么，都跳过平台审核
			if (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) {
				let res = await API_COMPANYOACHECKPOOL({
					bizType: 'ASSET_RECEIVABLE'
				});
				if (res.success) {
					this.oaflag = res.data;
				}
			}
			this.$refs.modalMain.open();
		},
		async getSubmitData() {
			let obj = {
				list: []
			};

			obj.id = this.$route.query.id;
			try {
				let assetsInfo = await this.$refs.assetsInfoView.onSubmit();
				obj = { ...obj, ...assetsInfo };
			} catch (error) {
				return;
			}

			// let contractData = this.$refs.contract.onSubmit();
			// if (contractData && checkMenuShow('contract', this.detailData)) {
			// 	if (contractData.errorStr) {
			// 		this.$message.error(contractData.errorStr);
			// 		return;
			// 	}
			// 	obj.list = [...obj.list, ...contractData.list];
			// 	obj.terminalContract = Object.assign({}, contractData.downContract);
			// 	obj.downTerminalContractModify = obj.terminalContract.downTerminalContractModify;
			// 	obj.businessLineContract = contractData.businessLineContract;
			// }
			let refsList = [
				{
					ref: 'transport', // 运输凭证校验
					value: 'transportDocument',
					index: 1
				},
				{
					ref: 'quality', // 数质量凭证校验
					value: 'qualityDocument',
					index: 2
				},
				{
					ref: 'transfer', // 货转凭证校验
					value: 'goodsTransferDocument',
					index: 3
				},
				{
					ref: 'accounts', // 核算表
					value: 'accountsTable',
					index: 4
				},
				{
					ref: 'invo', // 发票
					value: 'invoice',
					index: 6
				},
				{
					ref: 'other', // 其他
					value: 'otherFiles',
					index: 7
				}
			];
			let flag = false;
			for (let i = 0; i < refsList.length; i++) {
				let item = refsList[i];
				let check = this.$refs.leftTabs.checkMenuShow(item.value);
				if (check && this.$refs[item.ref]) {
					let data = this.$refs[item.ref].onSubmit();
					if (data.errorStr) {
						this.$message.error(data.errorStr);
						this.tabChange(item.index);
						flag = true;
						break;
					}
					if (data.list) {
						obj.list = [...obj.list, ...data.list];
					}
					// 判断是否有批次信息
					if (data.deliveryBatchList) {
						obj.deliveryBatchList = data.deliveryBatchList.map(item => {
							return {
								batchNo: item.batchNo,
								recvNo: item.recvNo
							};
						});
					}
					// 判断货转编号
					if (data.transferNoList) {
						obj.transferNoList = data.transferNoList.map(item => item.no);
					}
					// 关联业务线合同发票
					if (data.businessLineInvoice) {
						obj.businessLineInvoice = data.businessLineInvoice;
					}
					// 判断关联发票
					if (data.invoiceIdList) {
						obj.invoiceIdList = data.invoiceIdList;
					}
				}
			}
			if (flag) {
				return null;
			}
			// let settlesData = this.$refs.settles.onSubmit();

			// if (settlesData && checkMenuShow('settlesFiles', this.detailData)) {
			// 	if (settlesData.errorStr) {
			// 		this.$message.error(settlesData.errorStr);
			// 		return;
			// 	}

			// 	obj.list = [...obj.list, ...settlesData.list];
			// }

			return obj;
		},
		// 判断是否有判断外部变更，用于修改是进行页面拦截
		isNeedNextChange(change = true) {
			if (this.isNeedNextChangeParent) {
				this.isNeedNextChangeParent(change);
			}
		},
		async onSubmit(type) {
			// 取消变化
			let obj = await this.getSubmitData();
			if (obj == null) {
				return;
			}
			this.isNeedNextChange(false);
			if (type == 'save') {
				obj.submitType = '1';
				this.doSubmit(obj);
			} else {
				obj.submitType = '2';
				this.confirmSubmit(obj);
			}
		},
		doSubmit(obj) {
			if (obj) {
				API_EditAccountsPayable(obj).then(res => {
					if (res.success) {
						//应付账款提交  判断当前资产下所有发票的发票状态，是否含有红冲、作废的发票；若包含有红冲、作废的发票，不允许提交审核；
						if (res.data) {
							this.strMsg = res.data;
							this.visible = true;
						} else {
							this.$message.success('操作成功');
							this.$router.push('/center/assets/payable/manage/list');
						}
					}
				});
			}
		},
		confirmModal() {
			// 发票弹窗展示 消失
			this.visible = false;
		}
	}
};
</script>
<style lang="less" scoped>
.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;
	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;
		a {
			cursor: pointer;
		}
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}

.s-card-content {
	padding: 0 0;
	border-radius: 8px;
	background: #fff;
	// .row .ant-col {
	// 	margin-bottom: 8px;
	// 	text-overflow: ellipse;
	// 	white-space: nowrap;
	// 	overflow: hidden;
	// }
	// .ant-row .ant-col {
	// 	margin-bottom: 8px;
	// }
	// .ant-form-item {
	// 	margin-bottom: 0;
	// }

	// h2 {
	// 	font-style: normal;
	// 	font-family: PingFangSC-Medium;
	// 	font-size: 14px;
	// 	color: #141517;
	// 	line-height: 22px;
	// 	margin-bottom: 16px;
	// }
	// ::v-deep.ant-form-item-label {
	// 	display: inline-flex;
	// }

	.tip-item {
		display: inline-flex;
		align-items: center;
	}

	.cur {
		cursor: pointer;
		margin-left: 5px;
		vertical-align: middle;
	}
	.slTitleAssis {
		margin-bottom: 20px;
		.slTitleAssisSwitch {
			display: inline-block;
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.slFormDetail {
		padding: 0;
		margin: 0;
	}
	.ant-col {
		min-height: 82px;
	}
	.ant-form-item {
		width: 364px;
		margin-bottom: 0;
	}
}
.divider {
	background: #e5e6eb;
	height: 1px;
	margin: 20px 0;
}
.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar i {
	display: inline-block;
	width: 10px;
	height: 10px;
	background: red;
	border-radius: 50%;
	margin-top: 8px;
	margin-right: 10px;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar .tabs-icon {
	margin-right: 10px;
	em {
		display: block;
		width: 1px;
		height: 36px;
		background: @primary-color;
		border-radius: 1.5px 1.5px 0 0;
		margin: 5px 0 5px 6px;
	}
	img {
		width: 24px;
		height: 24px;
		margin-left: -5px;
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		color: #383a3f;
		line-height: 22px;
	}
	.blue {
		color: @primary-color;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}
.red {
	color: #f24e4d !important;
}
.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.contentBox {
	font-family: PingFangSC-Regular;
}
.green {
	background: #00ae9d !important;
}
.orange {
	background: #ff9726 !important;
}
.red_bg {
	background: #f24e4d !important;
}
.btn-box {
	width: calc(100% + 60px);
	margin-left: -30px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	background: #fff;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 9;
}
.btn-box .btn-wrap {
	margin: 0;
	padding: 0;
}

.main {
	.title {
		color: rgba(0, 0, 0, 0.4);
		font-family: PingFang SC;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
	.mainTable {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 10px;
		.item {
			padding: 0 13px;
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			&:nth-child(2n) {
				background: #f3f5f6;
			}
			.label {
				text-align: right;
				width: 130px;
				color: rgba(0, 0, 0, 0.4);
				display: inline-block;
				margin-right: 5px;
				&.required {
					position: relative;
					&::after {
						content: '*';
						color: #f5222d;
						position: absolute;
						right: 95px;
					}
				}
			}
			.red {
				color: #d44;
			}
		}
	}
	.footer-title {
		color: rgba(0, 0, 0, 0.8);
		margin-top: 20px;
	}
}
</style>
