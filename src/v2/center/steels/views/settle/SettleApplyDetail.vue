<template>
	<div :class="isOa ? 'oa-wrapper' : ''">
		<div class="settle-apply-form">
			<a-form
				:form="settleApplyForm"
				layout="inline"
				labelAlign="right"
			>
				<div v-if="handleType == 1">
					<div class="title"><i class="title_icon"></i>货转信息</div>
					<div class="table-wrap">
						<a-table
							:columns="goodsTransferColumns"
							:rowKey="record => record.id"
							:dataSource="goodsTransferData"
							:pagination="false"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="action"
								slot-scope="action, item"
							>
								<a
									v-if="!isOa"
									href="javascript:void(0)"
									style="margin-right: 15px"
									@click="handleViewDetail(item)"
									>查看</a
								>
								<a
									href="javascript:void(0)"
									@click="downloadGoodsTransfer(item)"
									>下载</a
								>
							</div>
						</a-table>
					</div>
					<div class="title"><i class="title_icon"></i>基础信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="合同编号"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="['contractNo']"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="合同数量（吨）"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="['quantity']"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="运输方式"
								:colon="false"
							>
								<a-input
									disabled
									v-decorator="['transportMode']"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="结算单类型"
								:colon="false"
							>
								<a-select
									v-decorator="['statementType']"
									disabled
									style="width: 220px"
								>
									<a-select-option value="PRE_STAT">预结算单</a-select-option>
									<a-select-option value="STAT">结算单</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row textarea-wrap">
						<a-col :span="12">
							<a-form-item
								label="总结算金额（元）"
								:colon="false"
							>
								<a-input
									v-decorator="[
										'totalSettleAmount',
										{
											initialValue: '0.00'
										}
									]"
									disabled
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="已付款金额（元）"
								:colon="false"
							>
								<a-input
									v-decorator="[
										'amountPaidTotalPrice',
										{
											initialValue: '0.00'
										}
									]"
									disabled
								></a-input>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row textarea-wrap">
						<a-col :span="24">
							<a-form-item
								label="备注"
								:colon="false"
							>
								<a-textarea
									v-decorator="['remark']"
									disabled
								></a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
					<div class="title"><i class="title_icon"></i>结算信息</div>
					<a-row>
						<div class="table-wrap">
							<a-table
								:columns="jsColumns"
								:dataSource="statementParticularList"
								:pagination="false"
								:locale="{ emptyText: '暂无数据' }"
							>
							</a-table>
						</div>
					</a-row>
				</div>
				<div v-if="handleType == 3">
					<LadingBillDetail
						:contract="contract"
						:info="info"
					></LadingBillDetail>
				</div>
				<div v-if="handleType == 2">
					<YuShenDetail></YuShenDetail>
				</div>
				<div v-if="handleType == 4">
					<AdditionalDetail></AdditionalDetail>
				</div>
				<div v-if="handleType == 5">
					<OtherMiddleDetail />
				</div>
				<div v-if="handleType == 6">
					<RongOuDetail />
				</div>
				<div v-if="handleType == 7">
					<SellDetail
						:contract="contract"
						:info="info"
					/>
				</div>
				<template v-if="status == 5 || status == 6">
					<div class="title"><i class="title_icon"></i>驳回原因</div>
					<a-row class="row textarea-wrap">
						<a-col :span="24">
							<a-form-item
								label=""
								:colon="false"
							>
								<a-textarea
									disabled
									v-decorator="['reason']"
								></a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</template>
				<template v-if="status == 7">
					<div class="title"><i class="title_icon"></i>取消原因</div>
					<a-row class="row textarea-wrap">
						<a-col :span="24">
							<a-form-item
								label=""
								:colon="false"
							>
								<a-textarea
									disabled
									v-decorator="['cancelReason']"
								></a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</template>
				<template v-if="attachmentFileVOS && attachmentFileVOS.length > 0 && handleType != 7">
					<div class="title"><i class="title_icon"></i>结算单附件</div>
					<a-row
						type="flex"
						justify="start"
						:gutter="24"
					>
						<a-col
							v-for="(pro, index) in attachmentFileVOS"
							:key="index"
						>
							<img
								v-if="pro.path"
								style="width: 130px; cursor: pointer"
								src="~imgs/pdf.png"
								@click="openPdf(pro.path)"
							/>
							<p
								v-if="pro.path"
								style="text-align: center; margin-top: 8px"
							>
								{{ pro.name }}
							</p>
						</a-col>
					</a-row>
				</template>

				<template v-if="$route.query.type == 'view'">
					<div class="title"><i class="title_icon"></i>操作历史</div>
					<Log :logList="recordList"></Log>
				</template>
				<div class="btn-wrap">
					<a-button
						@click="$router.go(-1)"
						v-if="!isOa"
						>返回</a-button
					>
					<a-button
						v-if="$route.query.type == 'submit'"
						type="primary"
						@click="submitSettleForm()"
						>提交</a-button
					>
				</div>
				<template v-if="showAudit">
					<div class="title"><i class="title_icon"></i>审批进度</div>
					<audit-records :dataSource="auditProgressRecord" />
				</template>
			</a-form>
		</div>
		<a-modal
			centered
			title="文件"
			v-model="modalPdfIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-pdf"
		>
			<template slot="footer">
				<a-button
					@click.native="modalPdfIsShow = false"
					style="margin: 0 10px"
					>取消</a-button
				>
				<a-button
					type="primary"
					icon="download"
					@click="downPdf(pdfUrl)"
					style="margin: 0 10px"
					>下载
				</a-button>
				<a-button
					type="primary"
					key="back"
					@click="modalPdfSubmit"
					style="margin: 0 10px"
					>确定</a-button
				>
			</template>
			<pdf-preview
				v-if="pdfUrl"
				:url="pdfUrl"
			></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import AuditRecords from '@/v2/components/AuditRecords';
import LadingBillDetail from './components/LadingBillDetail.vue';
import YuShenDetail from './components/YuShenDetail.vue';
import RongOuDetail from './components/RongOuDetail.vue';
import AdditionalDetail from './additional.vue';
import SellDetail from './components/SellDetail.vue';
import { API_DOWNLPREVIEWTE } from '@/v2/api';
import {
	API_SteelsStatementDetail,
	API_GETSETTLESUBMITCONFIRMDETAIL,
	API_GETLOGINBYMOBILE,
	API_SteelsDownloadFilesPath,
	API_SteelsStatementSubmit2,
	submitSupplStatement2
} from '@/v2/center/steels/api/settle.js';
import { mapGetters, mapMutations } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { getPersonalDetail } from '@/v2/utils/factory.js';
import Log from '@/v2/center/steels/components/Log.vue';
import OtherMiddleDetail from './components/OtherMiddleDetail.vue';
const recordColumns = [
	{ title: '结算单编号', dataIndex: 'statementNo', key: 'statementNo' },
	{ title: '操作', dataIndex: 'pointName', key: 'pointName' },
	{ title: '操作时间', dataIndex: 'createdDate', key: 'createdDate' },
	{ title: '操作内容', dataIndex: 'content', key: 'content' }
];
const noWarehousesColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '';
		}
	},
	{
		title: '品种',
		dataIndex: 'materialName',
		width: 150
	},
	{
		title: '货转总数量（吨）',
		dataIndex: 'transferQuantity'
	},
	{
		title: '已结算数量（吨）',
		dataIndex: 'settledQuantity'
	},
	{
		title: '已结算金额（元）',
		dataIndex: 'settledAmount'
	},
	{
		title: '本次结算数量（吨）',
		dataIndex: 'currentSettleQuantity'
	},
	{
		title: '本次结算金额（元）',
		dataIndex: 'currentSettleAmount'
	},
	{
		title: '本次结算单价（元/吨）',
		dataIndex: 'currentSettleAvePrice'
	}
];
export default {
	name: 'SettleApply',
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		//是否展示审批进度栏目
		showAudit() {
			if (this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY') {
				//核心企业，审批记录为空 不展示栏目
				return this.auditProgressRecord.length > 0;
			} else {
				//一般贸易商，没有风控审批记录 不展示栏目
				return this.auditProgressRecord.filter(item => item.source === '易煤风控').length > 0;
			}
		},
		handleType() {
			// 判断是否是补录
			if (this.info.source == 'PLATFORM_SUPPLEMENT') {
				// 业务类型为应收时，通过补录方式开具结算单--补录结算单
				// 销售合同补录生成时，无论业务类型，通过补录方式开具结算单--补录结算单
				if (
					(this.info.contractType == 'SELL' && this.contract.generateWay === 'ARTIFICIAL_COLLECTION') ||
					(['ACCOUNT_RECEIVABLE'].includes(this.contract.businessType) && this.info.contractType == 'SELL')
				) {
					return 7;
				}
				// 采购-业务类型为应收（非废钢）、代采+仓押、仓押、联营（“是否入库”选择为入库）时，依据货转开具结算单--补录结算单
				if (['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(this.contract.businessType)) {
					return 2;
				}
				if (['AFFILIATED_BUSINESS'].includes(this.contract.businessType) && this.$route.query.deliveryMode == 'WAREHOUSING') {
					return 2;
				}
				return 4;
			} else {
				if (this.info.source === 'RORY_ERP') {
					//蓉欧  是补录结算单
					return 6;
				}
				// 中间类型
				if (this.contract.businessType == 'OTHER_MIDDLE') {
					return 5;
				}
				// 榆神
				if (this.contract.businessType == 'ACCOUNT_RECEIVABLE_OTHER') {
					return 2;
				}
				if (this.info.contractType == 'BUY') {
					return 1;
				}
				// 基于销售合同
				if (this.info.contractType == 'SELL') {
					return 3;
				}
				return '';
			}
		},
		jsColumns() {
			return noWarehousesColumns;
		}
	},
	data() {
		return {
			isOa: false,
			qualityData: [], // 品质奖罚数据
			currentStep: 1,
			steps: [
				{
					title: '选择订单'
				},
				{
					title: '填写结算信息'
				},
				{
					title: '完成'
				}
			],
			settleApplyForm: this.$form.createForm(this),
			statementParticularList: [],
			receiveData: [],
			deliveryIds: '',
			pdfShowUrl: '',
			pdfUrl: '',
			modalPdfIsShow: false,
			auditProgressRecord: [],
			status: '',
			coalType: 0,
			contractTemplate: '',
			deliveryType: '',
			ticketPdfUrl: '',
			goodsTransferColumns: [
				// 货转信息table列
				{
					title: '货转编号',
					dataIndex: 'transferNo'
				},
				{
					title: '货转开具时间',
					dataIndex: 'createdDate'
				},
				{
					title: '货转数量（吨）',
					dataIndex: 'transferQuantity'
				},
				{
					title: '运输方式',
					dataIndex: 'transportModeDesc'
					// customRender: text => {
					//   return filterCodeByValueName(text, 'transportMode')
					// }
				},
				{
					title: '状态',
					dataIndex: 'statusDesc'
					// customRender: text => {
					//   return filterCodeByValueName(text, 'goodsTransferStatus')
					// }
				},
				{
					title: '操作',
					dataIndex: 'action',
					scopedSlots: {
						customRender: 'action'
					}
				}
			],
			goodsTransferData: [], // 货转信息table数据
			goodTransferNos: '', // 基于哪些货转编号开具结算单
			resultDetail: {},
			recordColumns,
			recordList: [],
			info: {},
			contract: {},
			attachmentFileVOS: []
		};
	},
	components: {
		PdfPreview,
		AuditRecords,
		LadingBillDetail,
		YuShenDetail,
		AdditionalDetail,
		Log,
		OtherMiddleDetail,
		RongOuDetail,
		SellDetail
	},
	mounted() {
		this.isOa = this.$route.name === 'OaSteelsSettleApplyDetail';
		const { contractId, companyUserId } = this.$route.query;
		if (this.isOa) {
			API_GETLOGINBYMOBILE({
				contractId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				getPersonalDetail(this.getDetail);
			});
			return;
		}

		this.getDetail();
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		async getDetail() {
			const params = {
				id: this.$route.query.statementId
			};
			const res = await API_SteelsStatementDetail(params);
			this.statementParticularList = res.data.statementParticularList;
			this.contract = res.data.contract;
			this.goodsTransferData = res.data.goodsTransferList;
			this.recordList = res.data.statementOperatorLogs;
			this.attachmentFileVOS = res.data.attachmentFileVOS;
			this.info = res.data;
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: res.data.totalSettleAmount,
					statementType: res.data.type,
					amountPaidTotalPrice: res.data.amountPaidTotalPrice,
					...this.contract,
					remark: res.data.remark,
					quantity: this.contract.quantity || '-',
					transportMode: '汽运'
				});
			});
		},
		// 获取和设置品质奖罚都在这里
		setPinZhiQuantity(values) {
			const obj = {
				basicHeatingValMin: values.basicHeatingValMin,
				basicHeatingValMax: values.basicHeatingValMax,
				basicSulfurContent: values.basicSulfurContent,
				basicVolatileContentMin: values.basicVolatileContentMin,
				basicVolatileContentMax: values.basicVolatileContentMax,
				basicWaterContent: values.basicWaterContent,
				offsetHeatingVal: values.offsetHeatingVal,
				offsetOther: values.offsetOther,
				offsetSulfurContent: values.offsetSulfurContent,
				offsetTotal: values.offsetTotal,
				offsetVolatileContent: values.offsetVolatileContent,
				offsetWaterContent: values.offsetWaterContent,
				realHeatingVal: values.realHeatingVal,
				realSulfurContent: values.realSulfurContent,
				realVolatileContent: values.realVolatileContent,
				realWaterContent: values.realWaterContent,
				receiveQuantity: values.receiveQuantity,
				realQgrContent: values.realQgrContent,
				settleTotalAmount: values.settleTotalAmount,
				realHgiContent: values.realHgiContent,
				realMjContent: values.realMjContent,
				realFcContent: values.realFcContent,
				realSizeContent: values.realSizeContent,
				realKnaContent: values.realKnaContent,
				realHeatContent: values.realHeatContent,
				realNContent: values.realNContent,
				realPContent: values.realPContent,
				realGContent: values.realGContent,
				realYContent: values.realYContent,
				realYxContent: values.realYxContent,
				realRqdContent: values.realRqdContent,
				basicAshContent: values.basicAshContent,
				basicVolatileContent: values.basicVolatileContent,
				realAshContent: values.realAshContent,
				offsetAshContent: values.offsetAshContent
			};

			return obj;
		},

		submitSettleForm() {
			const params = {
				id: this.$route.query.statementId,
				contractId: this.contract.id
			};
			let fn = API_SteelsStatementSubmit2;
			const flag1 = ['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(this.contract.businessType);
			const flag2 =
				['AFFILIATED_BUSINESS'].includes(this.contract.businessType) && this.$route.query.deliveryMode == 'WAREHOUSING';
			// 补录结算单提交
			if (this.info.source == 'PLATFORM_SUPPLEMENT' && (flag1 || flag2)) {
				fn = submitSupplStatement2;
			}

			fn(params).then(r => {
				if (r.success) {
					if (r.success) {
						this.$router.push('settleSuccess');
					}
				}
			});
		},
		modalPdfSubmit() {
			let result = {};
			if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
				// 用户上传合同
				result = {
					pdfpath: this.ticketPdfUrl,
					statementId: this.$route.query.id
				};
			} else {
				// 自动生成合同
				result = {
					pdfpath: this.pdfUrl,
					statementId: this.$route.query.id
				};
			}
			API_GETSETTLESUBMITCONFIRMDETAIL(result).then(res => {
				if (res.success) {
					this.$router.push('settleSuccess');
				}
			});
		},

		// 下载
		downPdf(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},

		// 全业务线基于货转开具结算单---查看货转详情
		handleViewDetail(item) {
			let routeUrl = this.$router.resolve({
				name: 'SteelsGoodsTransferApplyDetail',
				query: {
					id: item.id
				}
			});
			window.open(routeUrl.href, '_blank');
		},

		// 全业务线基于货转开具结算单---下载货转附件
		async downloadGoodsTransfer(record) {
			const fileFormat = record.pdfPath.split('?')[0].split('.').pop().toLowerCase();
			const res = await API_SteelsDownloadFilesPath({ filePath: record.pdfPath });
			comDownload(res, null, `${record.sellCompanyName}-${record.buyCompanyName}-${record.transferNo}.${fileFormat}`);
		},
		openPdf(url) {
			window.open(url, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
.oa-wrapper {
	padding: 20px;
}
.settle-apply-form {
	padding-bottom: 60px;

	.table-wrap {
		margin-bottom: 30px;

		table {
			white-space: nowrap;
		}

		.ant-table-body {
			overflow: auto;
		}
	}

	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}

	::v-deep.ant-form-item-control {
		input {
			width: 220px;
		}

		.ant-select {
			width: 200px;
		}

		.sealesman-select {
			width: 220px;
		}
	}

	.range-input {
		input {
			width: 98px;
		}

		.range-text {
			display: inline-block;
			padding: 0 5px;
		}
	}

	.pay-account-wrap {
		.ant-select {
			width: 400px;
		}
	}

	.row {
		margin-bottom: 20px;
		padding-left: 40px;
	}

	::v-deep.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		textarea {
			width: 686px;
			text-align: left !important;
		}
	}

	.btn-wrap {
		margin-top: 30px;
		padding-left: 40px;

		.ant-btn {
			width: 96px;
			height: 34px;
			margin-right: 30px;
		}
	}

	.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}

	.m0 {
		margin: 0;
	}

	.white-space .ant-form-item-label label {
		white-space: pre-wrap;
		line-height: 18px;
	}
}
</style>
