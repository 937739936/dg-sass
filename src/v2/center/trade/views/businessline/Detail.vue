<template>
	<div class="slMain business-line">
		<Breadcrumb />
		<a-card :bordered="false">
			<DetailHeader
				ref="detailHeader"
				platformType="REST"
				:detailData="businessDetail"
				:scrollDistance="scrollDistance"
				@changeSelectCompany="changeSelectCompany"
			>
				<template slot="businessLineHeaderExtra">
					<!-- <a-button
						class="slBtn"
						type="primary"
						>操作</a-button
					> -->
					<ActionButton
						:detailData="businessDetail"
						:VUEX_ST_COMPANYSUER="VUEX_ST_COMPANYSUER"
						:type="type"
						:isBank="isBank"
						:scrollDistance="scrollDistance"
						:removeBusinessLine="removeBusinessLine"
						:removeBusinessLineCheck="removeBusinessLineCheck"
						:checkBuyFinish="checkBuyFinish"
						:submitBuyFinish="submitBuyFinish"
						:checkSellFinish="checkSellFinish"
						:submitSellFinish="submitSellFinish"
						:getBusinessLineRiskAlertList="getBusinessLineRiskAlertList"
						@downloadFile="downloadFile"
						@toMonitor="toMonitor"
						@finishContract="finishContract"
					/>
				</template>
			</DetailHeader>
			<DetailTitle
				v-if="isDirectlyChain"
				:detailData="businessDetail"
				:VUEX_ST_COMPANYSUER="VUEX_ST_COMPANYSUER"
				:type="type"
				:isBank="isBank"
				:scrollDistance="scrollDistance"
				:removeBusinessLine="removeBusinessLine"
				:removeBusinessLineCheck="removeBusinessLineCheck"
				:checkBuyFinish="checkBuyFinish"
				:submitBuyFinish="submitBuyFinish"
				:checkSellFinish="checkSellFinish"
				:submitSellFinish="submitSellFinish"
				:getBusinessLineRiskAlertList="getBusinessLineRiskAlertList"
				@downloadFile="downloadFile"
				@finishContract="finishContract"
				ref="detailTitle"
			>
			</DetailTitle>
		</a-card>
		<div class="line"></div>
		<div v-if="isDirectlyChain">
			<DetailMid
				:detailData="businessDetail"
				:type="type"
			></DetailMid>
			<div class="line"></div>
			<a-card :bordered="false">
				<DetailBot
					@changeContractType="changeContractType"
					@selectInfo="selectInfo"
					:isBank="isBank"
					:selectType="selectType"
					:detailData="businessDetail"
					:companyCreditCode="VUEX_ST_COMPANYSUER.companyUscc"
					@exportChart="exportChart"
					@goInOutDetail="goInOutDetail"
					:inventoryApi="inventoryApi"
				>
					<!-- 合同详情 -->
					<ContractInfo
						:contractApi="contractApi"
						:isBank="isBank"
						:detailData="businessDetail"
						:VUEX_ST_COMPANYSUER="VUEX_ST_COMPANYSUER"
						:contractType="contractType"
						:type="type"
						:ENV="ENV"
						ref="contract"
						@downloadAllContractFile="downloadAllContractFile"
						@handlePreview="handlePreview"
						@downloadSingleContractFile="downloadSingleContractFile"
						@getContractInfo="getContractInfo"
						@downloadSupple="downloadSupple"
						v-if="selectKey == 'contract'"
					>
					</ContractInfo>
					<!-- 货物运输 -->
					<GoodsInfo
						:getUpstreamDeliverBatchList="getUpstreamDeliverBatchList"
						:getUpstreamGoodsTransferList="getUpstreamGoodsTransferList"
						:getDownstreamDeliverBatchList="getDownstreamDeliverBatchList"
						:getDownstreamGoodsTransferList="getDownstreamGoodsTransferList"
						:getTransDeliverBatchList="getTransDeliverBatchList"
						:API_getRouteInfo="API_getRouteInfo"
						:API_GetShipTrackFlag="API_GetShipTrackFlag"
						:businessLineType="businessDetail.businessLineType"
						:contractType="contractType"
						:type="type"
						:isBank="isBank"
						@downloadGoodsTransferFile="downloadGoodsTransferFile"
						style="width: 100%"
						v-if="selectKey == 'goods'"
					>
					</GoodsInfo>
					<!-- 资金流水 -->
					<FundInfo
						:fundApi="fundApi"
						:type="type"
						:isBank="isBank"
						:contractType="contractType"
						v-if="selectKey == 'fund'"
					>
					</FundInfo>
					<!-- 结算单 -->
					<SettleInfo
						:settleApi="settleApi"
						:type="type"
						:isBank="isBank"
						:contractType="contractType"
						:contractInfo="contractInfo"
						@downloadSettleFile="downloadSettleFile"
						@handlePreview="handlePreview"
						v-if="selectKey == 'settle'"
					>
					</SettleInfo>
					<!-- 发票 -->
					<InvoiceInfo
						:getUpstreamTransInvoiceList="getUpstreamTransInvoiceList"
						:getUpstreamTradeInvoiceList="getUpstreamTradeInvoiceList"
						:getDownstreamTransInvoiceList="getDownstreamTransInvoiceList"
						:getDownstreamTradeInvoiceList="getDownstreamTradeInvoiceList"
						:getTransInvoiceList="getTransInvoiceList"
						:getInvoiceNumCount="getInvoiceNumCount"
						:contractInfo="contractInfo"
						@handlePreview="handlePreview"
						:VUEX_ST_COMPANYSUER="VUEX_ST_COMPANYSUER"
						:type="type"
						:isBank="isBank"
						:contractType="contractType"
						v-if="selectKey == 'invoice'"
					></InvoiceInfo>
					<!-- 融资 -->
					<TradingInfo
						:tradingApi="tradingApi"
						:API_goAdvanceLoanCheck="API_goAdvanceLoanCheck"
						:contractType="contractType"
						:type="type"
						:isBank="isBank"
						v-if="selectKey == 'trading'"
					></TradingInfo>
					<!-- 回款 -->
					<ReturnedInfo
						:getDownstreamCollectionInfo="getDownstreamCollectionInfo"
						:delReturnedData="delReturnedData"
						:contractInfo="contractInfo"
						:VUEX_ST_COMPANYSUER="VUEX_ST_COMPANYSUER"
						:isBank="isBank"
						v-if="selectKey == 'returned'"
					>
					</ReturnedInfo>
				</DetailBot>
			</a-card>
		</div>
		<UnDirectUpDownDetail
			v-else
			:contractInfo="selectCompany.contractInfo"
			:fullBusinessLineId="businessDetail.fullBusinessLineId"
			:businessLineNo="businessDetail.businessLineNo"
			:api="unDirectApi"
			@downloadAllContractFile="downloadAllContractFile"
			@downloadSingleContractFile="downloadSingleContractFile"
			@handlePreview="handlePreview"
			@downloadGoodsTransferFile="downloadGoodsTransferFile"
			@downloadSettleFile="downloadSettleFile"
		/>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<ContractFinish
			title="业务线完结申请"
			ref="contractFinish"
			:info="contractFinishInfo"
			:isLoading="isLoading"
			:message="message"
		></ContractFinish>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import DetailTitle from '@sub/businessLine/DetailTitle.vue';
import DetailMid from '@sub/businessLine/DetailMid.vue';
import DetailBot from '@sub/businessLine/DetailBot.vue';

import ContractInfo from '@sub/businessLine/ContractInfo.vue';
import GoodsInfo from '@sub/businessLine/GoodsInfo.vue';
import SettleInfo from '@sub/businessLine/SettleInfo.vue';
import FundInfo from '@sub/businessLine/FundInfo.vue';
import InvoiceInfo from '@sub/businessLine/InvoiceInfo.vue';
import TradingInfo from '@sub/businessLine/TradingInfo.vue';
import ReturnedInfo from '@sub/businessLine/ReturnedInfo.vue';
import DetailHeader from '@sub/businessLine/DetailHeader.vue';
import UnDirectUpDownDetail from '@sub/businessLine/nonDirectDetail/UnDirectUpDownDetail.vue';
import ActionButton from '@sub/businessLine/ActionButton.vue';
import ContractFinish from '@/v2/center/trade/views/contract/components/ContractFinish.vue';

import {
	getCoreBusinessLineDetail,
	// 移除业务线校验
	removeBusinessLineCheck,
	// 移除业务线
	removeBusinessLine,
	// 检测采购合同完结
	checkBuyFinish,
	// 采购合同完结
	submitBuyFinish,
	// 检测销售合同完结
	checkSellFinish,
	// 销售合同完结
	submitSellFinish,
	// 下载业务线附件
	downBusinessAttach,
	// 下载合同附件
	downAttachBusinessContract,
	// 预警消息
	getBusinessLineRiskAlertList,

	// 合同详情接口
	getBusinessLineUpstreamContractDetail,
	getBusinessLineDownstreamContractDetail,
	getBusinessLineTransContractDetail,
	// 货物运输相关
	getUpstreamDeliverBatchList,
	getUpstreamGoodsTransferList,
	getDownstreamDeliverBatchList,
	getDownstreamGoodsTransferList,
	getTransDeliverBatchList,

	// 资金流水
	getUpstreamPaymentList,
	getDownstreamPaymentList,
	getTransPaymentList,

	// 结算单
	getUpstreamStatementList,
	getDownstreamStatementList,
	getTransStatementList,

	// 发票
	getUpstreamTransInvoiceList,
	getUpstreamTradeInvoiceList,
	getDownstreamTransInvoiceList,
	getDownstreamTradeInvoiceList,
	getTransInvoiceList,
	getInvoiceNumCount,

	// 融资
	getUpstreamFinanceList,
	getDownstreamFinanceList,
	// 回款
	getDownstreamCollectionInfo
} from '@/v2/center/trade/api/businessLine';

//  电子合同 一件下载
// 线下合同
import { downloadDownContract, downloadSingleFile } from '@/v2/center/trade/api/downcontract';
// 运输合同
import { API_downloadAllTransContractAttachment } from '@/v2/center/trade/api/transportContract';
// 电子合同单个文件下载
import { API_DOWNLPREVIEWTE } from '@/v2/center/assets/api/index.js';
// 货转下载
import { API_goodsTransferBatchDownload } from '@/v2/center/trade/api/goodsTransfer';
// 结算单下载
import { API_GETSETDownload, API_DownloadSettleFiles } from '@/v2/center/trade/api/settle';
// 删除回款
import { delReturnedData } from '@/v2/center/trade/api/pay';
// 火运 船运轨迹查询
import { API_getRouteInfo } from '@/v2/center/assets/api/index.js';
import { API_GetShipTrackFlag } from '@/v2/center/monitoring/api';
// 判断预付融资还款
import { API_goAdvanceLoanCheck } from '@/v2/center/financing/api/index.js';

import downlodFile from '@/v2/utils/download.js';
// 库存台账
import {
	getBusinessLineDetail,
	getOverviewEcharts,
	exportBusinessLineEchart,
	countQueryByBusinessLine,
	getBusinessLineRiskPage,
	getCoalTypeinventoryList
} from '@/v2/center/logisticsPlatform/api/inventory';
import { getSubsystemOptions, subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
import { mapGetters, mapMutations } from 'vuex';

import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import {
	getUnDirectStreamContractDetail,
	getUnDirectStreamDeliverBatchList,
	getUnDirectStreamGoodsTransferList,
	getUnDirectStreamPaymentList,
	getUnDirectStreamStatementList,
	getUnDirectStreamTradeInvoiceList,
	getUnDirectStreamTransInvoiceList,
	contractFinishApplyBusiness
} from '@/v2/center/trade/api/businessLine';

export default {
	data() {
		return {
			selectType: 'up',
			// 用来区分 admin 和 rest
			type: 'rest',
			// 业务线详情
			businessDetail: {},
			// 预览
			previewImg: '',
			// 选择的模块
			selectKey: 'contract',
			// 用来兼容合同类型 采购 销售  运输
			contractType: 'buy',
			// 当前选择的合同信息
			contractInfo: {},
			selectCompany: {
				type: 'DIRECTLY_UPDOWN',
				key: 'buy'
			},
			ENV,
			contractFinishInfo: { validPass: true },
			isLoading: false,
			message: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		VUEX_ST_COMPANYSUER() {
			let obj = this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			const roles = (obj.roles || []).map(el => el.code);
			return { ...obj, roles };
		},
		// 合同详情接口
		contractApi() {
			if (this.contractType == 'buy') {
				return getBusinessLineUpstreamContractDetail;
			}
			if (this.contractType == 'sell') {
				return getBusinessLineDownstreamContractDetail;
			}
			return getBusinessLineTransContractDetail;
		},
		// 资金流水接口api
		fundApi() {
			if (this.contractType == 'buy') {
				return getUpstreamPaymentList;
			}
			if (this.contractType == 'sell') {
				return getDownstreamPaymentList;
			}
			return getTransPaymentList;
		},
		// 结算单api
		settleApi() {
			if (this.contractType == 'buy') {
				return getUpstreamStatementList;
			}
			if (this.contractType == 'sell') {
				return getDownstreamStatementList;
			}
			return getTransStatementList;
		},
		// 融资接口api
		tradingApi() {
			if (this.contractType == 'buy') {
				return getUpstreamFinanceList;
			}
			return getDownstreamFinanceList;
		},
		// 是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		// 滚动的距离
		scrollDistance() {
			return this.$store.state.scroll.scrollDistance;
		},
		isDirectlyChain() {
			return this.selectCompany.type == 'DIRECTLY_UPDOWN';
		},
		unDirectApi() {
			return {
				getUnDirectStreamContractDetail,
				getUnDirectStreamDeliverBatchList,
				getUnDirectStreamGoodsTransferList,
				getUnDirectStreamPaymentList,
				getUnDirectStreamStatementList,
				getUnDirectStreamTradeInvoiceList,
				getUnDirectStreamTransInvoiceList,
				API_GetShipTrackFlag,
				API_getRouteInfo
			};
		},
		// 库存台账api
		inventoryApi() {
			return {
				getBusinessLineDetail,
				getOverviewEcharts,
				exportBusinessLineEchart,
				countQueryByBusinessLine,
				getBusinessLineRiskPage,
				getCoalTypeinventoryList
			};
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		...mapMutations({
			SET_VUEX_CURRENT_PLATEFORM: 'user/SET_VUEX_CURRENT_PLATEFORM'
		}),
		//  <---------------------------->
		// 头部使用的接口
		removeBusinessLineCheck,
		removeBusinessLine,
		checkBuyFinish,
		submitBuyFinish,
		checkSellFinish,
		submitSellFinish,
		getBusinessLineRiskAlertList,
		// 下载附件 title一件下载附件
		async downloadFile(params) {
			const res = await downBusinessAttach(params);

			comDownload(res.data, '', res.name);

			this.$refs.detailTitle.downloadVisible = false;
		},
		// 完结合同
		async finishContract(info) {
			// contractFinishApplyBusiness
			this.isLoading = true;
			this.$refs.contractFinish.open();
			this.contractFinishInfo = { validPass: true };
			this.isLoading = true;

			const params = {
				businessLineNo: this.$route.query.businessLineNo,
				dataType: info.finishType == 1 ? 'UP_STREAM' : 'DOWN_STREAM'
			};
			try {
				const res = await contractFinishApplyBusiness(params);
				if (res.data.validPass) {
					this.$refs.contractFinish.close();
					this.$message.success('校验通过');
					this.getDetail();
				} else {
					this.isLoading = false;
					this.contractFinishInfo = res.data;
					this.message = `${info.finishType == 1 ? '上游采购' : '下游销售'}合同存在以下问题，请处理后重新发起申请`;
				}
			} catch (error) {
				this.isLoading = false;
				this.$refs.contractFinish.close();
			}
		},

		// <---------------------------->
		// 合同相关 切换模块
		selectInfo(key) {
			this.selectKey = key;
		},
		// 切换合同tab
		changeContractType(type) {
			this.contractType = type;
			this.selectKey = 'contract';

			this.$refs.detailHeader.changeSelectCompanyKey(type);
			// 重新获取合同数据
			this.$nextTick(() => {
				if (this.$refs.contract) {
					this.$refs.contract.getContactInfo();
				}
			});
		},
		// 切换选择的公司
		changeSelectCompany(company) {
			this.selectType = company.key;
			// 非直接上下游需要里面的信息
			this.selectCompany = company;
		},
		getContractInfo(info) {
			this.contractInfo = info;
		},
		// 合同一件下载
		async downloadAllContractFile(info, type) {
			const params = {
				id: info.id,
				orderId: info.id,
				businessLineNo: this.$route.query.businessLineNo,
				coreCompanyUscc: null
			};
			if (this.isBank) {
				params.coreCompanyUscc = this.$route.query.coreCompanyUscc || this.businessDetail.coreCompanyUscc;
			}

			let res;
			// 运输合同
			if (type == 'trans') {
				const zipFileName =
					info.consigneeCompanyName +
					'_' +
					info.consignorCompanyName +
					'_' +
					info.paperContractNo +
					'_' +
					info.contractSignTime +
					'.zip';
				res = await API_downloadAllTransContractAttachment(params);
				comDownload(res, undefined, zipFileName);
				return;
			}
			// 线下
			if (info.paperContractNo) {
				res = await downloadDownContract(params);
				comDownload(res.data, undefined, res.name);
				return;
			}

			// const zipFileName = info.contractNo + '-' + info.sellerCompanyName + '-' + info.buyerCompanyName + '.zip';
			res = await downAttachBusinessContract(params);
			comDownload(res.data, undefined, res.name);
		},
		// 合同单个下载
		async downloadSingleContractFile(items, contractInfo, type) {
			// 运输
			if (type == 'trans') {
				const res = await API_DOWNLPREVIEWTE(items.fileUrl);
				comDownload(res, null, items.fileName);
				return;
			}
			// 线下
			if (contractInfo.paperContractNo) {
				const params = {
					id: contractInfo.id,
					attachmentTypeCode: items.type
				};
				const res = await downloadSingleFile(params);

				comDownload(res.data, null, res.name);
				return;
			}
			// 电子
			let name = '';
			if (items.fileName === '服务费协议') {
				name =
					'服务费协议-' +
					contractInfo.serviceFeeAgreementNo +
					'-' +
					contractInfo.companyName +
					'-' +
					contractInfo.settlementCompanyName;
				name = name + (contractInfo.thirdPartyCompanyName ? '-' + contractInfo.thirdPartyCompanyName + '.pdf' : '.pdf');
			} else {
				name =
					'贸易合同-' +
					contractInfo.contractNo +
					'-【' +
					contractInfo.sellerCompanyName +
					'】-【' +
					contractInfo.buyerCompanyName +
					'】';
				name = name + (items.fileName === '承诺函' ? '-承诺函.pdf' : '.pdf');
			}
			const res = await API_DOWNLPREVIEWTE(items.fileUrl);
			comDownload(res, undefined, name);
		},
		// 预览
		handlePreview(url) {
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (url.indexOf('.doc') > -1 || url.indexOf('.docx') > -1 || url.indexOf('.xlsx') > -1 || url.indexOf('.xls') > -1) {
				// url = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.previewImg);
				window.open('https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url), '_blank');
				// window.open(url);
				return;
			}
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		// 补充协议下载
		async downloadSupple(query) {
			const res = await downloadSingleFile(query);
			comDownload(res.data, null, res.name);
		},
		//  <---------------------------->
		// 底部使用 货物运输相关
		getUpstreamDeliverBatchList,
		getUpstreamGoodsTransferList,
		getDownstreamDeliverBatchList,
		getDownstreamGoodsTransferList,
		getTransDeliverBatchList,
		API_getRouteInfo,
		API_GetShipTrackFlag,
		// 下载货转pdf
		async downloadGoodsTransferFile(goodsTransferNo) {
			const res = await API_goodsTransferBatchDownload({ goodsTransferNoList: [goodsTransferNo] });
			comDownload(res.data, undefined, res.name);
		},
		// <---------------------------->
		// 下载结算单
		async downloadSettleFile(info, type) {
			// if(type == 'trans') {
			//   const res = await  API_DOWNLPREVIEWTE(API_GETCURRENTENV(url))
			//   comDownload(res,  null, info.fileName);
			//   return
			// }
			if (info.dataType == 'ONLINE') {
				const res = await API_GETSETDownload({ statementId: info.id });
				comDownload(res.data, undefined, res.name);
				return;
			}
			if (info.dataType == 'OFFLINE' || type == 'trans') {
				const res = await API_DownloadSettleFiles({ statementId: info.id });
				comDownload(res.data, undefined, res.name);
			}
		},

		// <---------------------------->
		//  发票相关
		getUpstreamTransInvoiceList,
		getUpstreamTradeInvoiceList,
		getDownstreamTransInvoiceList,
		getDownstreamTradeInvoiceList,
		getTransInvoiceList,
		getInvoiceNumCount,
		//  <---------------------------->
		// 回款
		getDownstreamCollectionInfo,
		delReturnedData,
		//  <---------------------------->
		// 融资相关
		API_goAdvanceLoanCheck,

		// 获取业务线详情
		async getDetail() {
			const params = {
				...this.$route.query
			};
			const res = await getCoreBusinessLineDetail(params);

			this.businessDetail = res.data;
		},
		// 库存台账
		exportChart(startDate, endDate) {
			this.lineLoading = true;
			downlodFile(
				exportBusinessLineEchart,
				{ startDate, endDate, businessLineNo: this.$route.query.businessLineNo },
				'GET',
				() => {
					this.lineLoading = false;
				}
			);
		},
		// 出入库
		async goInOutDetail(record, type) {
			record.id = record.id || record.stationId;
			if (!record.id) {
				return;
			}
			let isChanged = await this.changePlatformIfNeed(record);
			let routerData = this.$router.resolve({
				path: `/center/logisticsPlatform/${type}/list`,
				query: {
					goodsName: '动力煤'
				}
			});
			window.open(routerData.href, '_blank');
			if (isChanged) {
				this.$router.go();
			}
		},
		// 去往监控
		async toMonitor(record) {
			// let isChanged = await this.changePlatformIfNeed(record);
			let routerData = this.$router.resolve({
				path: `/center/logisticsPlatform/monitorList`
			});
			window.open(routerData.href, '_blank');
			// if (isChanged) {
			// 	this.$router.go();
			// }
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
		}
	},
	components: {
		Breadcrumb,
		DetailTitle,
		DetailMid,
		DetailBot,
		ContractInfo,
		GoodsInfo,
		SettleInfo,
		FundInfo,
		InvoiceInfo,
		TradingInfo,
		ReturnedInfo,
		DetailHeader,
		UnDirectUpDownDetail,
		ActionButton,
		ContractFinish
	}
};
</script>

<style scoped lang="less">
.line {
	background: #f3f5f6;
	height: 20px;
}
</style>
