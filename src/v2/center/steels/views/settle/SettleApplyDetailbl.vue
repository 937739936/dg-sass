<template>
	<div :class="isOa ? 'oa-wrapper' : ''">
		<div class="settle-apply-form">
			<a-form
				:form="settleApplyForm"
				layout="inline"
				labelAlign="right"
			>
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
							label="钢材种类"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['steelTypeDesc']"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="业务类型"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['businessTypeDesc']"
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
								v-decorator="['transportModeDesc']"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 合同货物明细 -->
				<div class="title"><i class="title_icon"></i>合同货物明细</div>
				<div class="table-wrap">
					<a-table
						:columns="columns"
						:dataSource="contractPurchaseList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="action"
							slot-scope="action, item"
						>
							<a
								href="javascript:void(0)"
								style="margin-right: 15px"
								@click="handleViewDetail(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								@click="downloadGoodsTransfer(item.pdfPath)"
								>下载</a
							>
						</div>
					</a-table>
				</div>
				<!-- 结算明细 -->
				<div class="title"><i class="title_icon"></i>结算信息</div>
				<a-row>
					<div class="table-wrap">
						<a-table
							:columns="jsColumns"
							:dataSource="statementParticularList"
							:scroll="{ x: true }"
							:pagination="false"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
					</div>
				</a-row>
				<div class="title"><i class="title_icon"></i>结算信息</div>
				<a-row class="row textarea-wrap">
					<a-col
						:span="12"
						style="margin-top: 20px"
					>
						<a-form-item
							label="结算数量（吨）"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['particularQuantity']"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						style="margin-top: 20px"
					>
						<a-form-item
							label="总结算金额（元）"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['totalSettleAmount']"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						style="margin-top: 20px"
					>
						<a-form-item
							label="结算日期"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['settleTime']"
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
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="false"
							:fileDataSource="fileDataSource"
							:type="'settleAdditional'"
						/>
					</div>
				</div>
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
import { API_DOWNLPREVIEWTE } from '@/v2/api';
import {
	API_SteelsStatementDetail,
	API_GETSETTLESUBMITCONFIRMDETAIL,
	API_GETLOGINBYMOBILE,
	API_SteelsStatementSubmit2,
	submitSupplStatement2
} from '@/v2/center/steels/api/settle.js';
import { mapGetters, mapMutations } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { getPersonalDetail } from '@/v2/utils/factory.js';
import Log from '@/v2/center/steels/components/Log.vue';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
import { appJsColumns } from './components/config.js';
const columns = [
	// 货转信息table列
	{ key: 'materialName', dataIndex: 'materialName', title: '品名', with: 100 },
	{ key: 'specs', dataIndex: 'specs', title: '规格', with: 100 },
	{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', with: 100 },
	// 产地
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地', with: 200 },
	// 件数
	{ key: 'pieceQuantity', dataIndex: 'pieceQuantity', title: '件数' },
	// 捆包号
	{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号', with: 100 },
	{ key: 'quantity', dataIndex: 'quantity', title: '重量(吨)', with: 100 },

	// 计量方式
	{ key: 'metrologyWay', dataIndex: 'metrologyWay', title: '计量方式', with: 200 }
];
const fileColumns = [
	{
		title: '类型',
		dataIndex: 'type',
		customRender: function () {
			return '线下结算单';
		}
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
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
		jsColumns() {
			return appJsColumns;
		},
		type() {
			return this.$route.query.type;
		}
	},
	watch: {
		statementParticularList: {
			handler(v) {
				if (!v || !v?.length) return;
				let hasTotal = false;
				if (this.statementParticularList.length) {
					this.statementParticularList.forEach(item => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity');
					});
				}
				if (!hasTotal) {
					this.statementParticularList.push({
						transferQuantity: '总计',
						currentSettleQuantity: '', //结算数量
						currentSettleAmount: '' // 价税合计
					});
					// 计算总计
					if (this.statementParticularList.length) {
						this.computedTotal(true);
						this.computedAmountTotal(true);
					} else {
						this.computedTotal();
						this.computedAmountTotal();
					}
					this.$forceUpdate();
				}
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			columns,
			contractPurchaseList: [],
			statementParticularList: [],
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
			fileColumns,
			settleApplyForm: this.$form.createForm(this),
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
			recordList: [],
			info: {},
			contract: {},
			attachmentFileVOS: [],
			fileDataSource: []
		};
	},
	components: {
		PdfPreview,
		AuditRecords,
		Log,
		CustomUpload
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
		computedTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,4})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleQuantity = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleQuantity !== '/' && numberReg.test(el.currentSettleQuantity)) {
						currentSettleQuantity += +(el.currentSettleQuantity || 0);
					}
				}
			});
			lastItem.currentSettleQuantity = currentSettleQuantity.toFixed(4);
			if (this.info?.currentSettleQuantityTotal && flag) {
				lastItem.currentSettleQuantity = this.info?.currentSettleQuantityTotal.toFixed(4);
			}
			this.$forceUpdate();
		},
		computedAmountTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,2})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleAmount = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleAmount !== '/' && numberReg.test(el.currentSettleAmount)) {
						currentSettleAmount += +(el.currentSettleAmount || 0);
					}
				}
			});
			lastItem.currentSettleAmount = currentSettleAmount.toFixed(2);
			if (this.info?.currentSettleAmountTotal && flag) {
				lastItem.currentSettleAmount = this.info?.currentSettleAmountTotal.toFixed(2);
			}
			this.$forceUpdate();
		},
		async getDetail() {
			const params = {
				id: this.$route.query.statementId
			};
			const res = await API_SteelsStatementDetail(params);
			this.statementParticularList = res.data.statementParticularList;
			this.contractPurchaseList = res.data.contractPurchaseList;
			this.contract = res.data.contract;
			this.recordList = res.data.statementOperatorLogs;
			this.attachmentFileVOS = res.data.attachmentFileVOS;
			this.fileDataSource = res.data.statementAttachList;

			this.info = res.data;
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: res.data.totalSettleAmount,
					settleTime: res.data.settleTime,
					particularQuantity: res.data.particularQuantity,
					statementType: res.data.type,
					amountPaidTotalPrice: res.data.amountPaidTotalPrice,
					...this.contract,
					remark: res.data.remark,
					quantity: this.contract.quantity || '-',
					transportMode: '汽运'
				});
			});
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

	.ant-form-item-control {
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

	/deep/ .ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 140px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		margin-top: 20px;
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
