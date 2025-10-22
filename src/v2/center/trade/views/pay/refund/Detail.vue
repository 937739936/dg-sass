<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
			v-if="resultDetails"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>退款详情</span>
			</div>
			<div class="titleInfoBox">
				<div class="titleInfoTitle">
					<a-space :size="16">
						<em class="refundTypeSymbol">退</em>
						<div
							@mouseenter="onMouseOverContractNo()"
							@mouseleave="onMouseOutContractNo()"
						>
							<span style="cursor: pointer">资金流水号：{{ resultDetails.serialNo || '-' }}</span>
							<span
								v-show="!copyContractNoVisible"
								class="copy-contract-icon"
								>
								<Copy></Copy>
							</span>
							<span
								v-show="copyContractNoVisible"
								v-clipboard:success="onCopy" 
								v-clipboard:error="onError"  
								v-clipboard:copy="resultDetails.serialNo"
								class="copy-contract-icon"
								>
								<CopyNow></CopyNow>
							</span>
						</div>
						<p :class="'refund-status ' + resultDetails.status">
							<span class="text">{{ resultDetails.statusDesc }}</span>
						</p>
					</a-space>
				</div>
				<div
					class="titleInfoItem pl85 contract-box"
					@mouseenter="onMouseOverOrderNo()"
					@mouseleave="onMouseOutOrderNo()"
				>
					<span class="label w85">所属合同编号：</span>
					<TextOverFlow
						v-if="contractInfo.contractNo"
						:content="contractInfo.contractNo"
						:maxWidth="maxWidth"
						@clickFunc="viewContractDetail"
					/>
					<span v-else>-</span>
					<div
						class="copy-icon-box"
						v-show="!copyOrderNoVisible"
					>
						<span class="copy-icon">
							<Copy></Copy>
						</span>
					</div>
					<div
						class="copy-icon-box"
						v-show="copyOrderNoVisible"
					>
						<span
							v-clipboard:success="onCopy" 
							v-clipboard:error="onError"  
							v-clipboard:copy="contractInfo.contractNo"
							class="copy-icon"
							>
							<CopyNow></CopyNow>
						</span>
					</div>
				</div>
				<div class="titleInfoItem">
					<span class="label">卖方企业：</span>
					<TextOverFlow
						v-if="contractInfo.sellerName"
						:content="contractInfo.sellerName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">买方企业：</span>
					<TextOverFlow
						v-if="contractInfo.buyerName"
						:content="contractInfo.buyerName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">创建时间：</span>
					<TextOverFlow
						v-if="resultDetails.createTime"
						:content="resultDetails.createTime"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div
					:class="`titleInfoItem ${resultDetails.auditChainAndOperator ? 'pl85 more' : 'more'}`"
					v-if="resultDetails.auditChainAndOperator"
				>
					<span :class="{ label: true, w130: resultDetails.auditChainAndOperator }">流程发起人：</span>
					<span
						v-for="(pro, index) in resultDetails.auditChainAndOperator.operatorInfo"
						:key="index"
					>
						{{ pro.systemName }}-{{ pro.operatorName }}
						<a-tooltip
							:getPopupContainer="getPopupContainer"
							v-if="pro.operatorMobile"
						>
							<template slot="title">
								{{ pro.operatorMobile }}
							</template>
							<img
								class="mobile-icon"
								src="@/v2/assets/imgs/contract/mobile_icon.png"
								alt=""
							/>
						</a-tooltip>
					</span>
				</div>
			</div>
		</a-card>
		<a-card
			:bordered="false"
			style="padding: 34px 16px"
		>
			<a-row
				type="flex"
				class="twenty-percent"
			>
				<a-col
					class="flex-box"
					v-for="(item, index) in processChains"
					:key="index"
				>
					<i :class="item.businessStatus + ' ' + item.status"></i>
					<div class="flex-text">
						<p class="label">{{ item.time }}</p>
						<p
							class="red"
							v-if="item.status === 'FAIL'"
						>
							{{ item.name }}
							<a-tooltip :getPopupContainer="getPopupContainer">
								<template slot="title">{{ item.remark }}</template>
								<img
									class="questionIcon"
									src="@/v2/assets/imgs/refund/question_icon.png"
									alt=""
								/>
							</a-tooltip>
						</p>
						<p v-else>{{ item.name }}</p>
					</div>
				</a-col>
			</a-row>
		</a-card>
		<a-card :bordered="false">
			<a-tabs>
				<a-tab-pane
					key="1"
					tab="退款信息"
				>
					<div style="width: 100%">
						<div class="slTitleAssis">退款信息</div>
						<ul class="grid-wrap">
							<li>
								<span class="label">退款方</span>
								<TextOverFlow
									v-if="contractInfo.sellerName"
									:content="contractInfo.sellerName"
									:maxWidth="infoMaxWidth"
								/>
							</li>
							<li>
								<span class="label">收款方</span>
								<TextOverFlow
									v-if="contractInfo.buyerName"
									:content="contractInfo.buyerName"
									:maxWidth="infoMaxWidth"
								/>
							</li>
							<li>
								<span class="label">资金来源</span>
								<span>{{ resultDetails.fundsSourceDesc }}</span>
							</li>
							<li>
								<span class="label">收款账号名称</span>
								<TextOverFlow
									v-if="resultDetails.receiveAccName"
									:content="resultDetails.receiveAccName"
									:maxWidth="infoMaxWidth"
								/>
							</li>
							<li>
								<span class="label">收款账号开户行</span>
								<TextOverFlow
									v-if="resultDetails.receiveAccBank"
									:content="resultDetails.receiveAccBank"
									:maxWidth="infoMaxWidth"
								/>
							</li>
							<li>
								<span class="label">收款账号</span>
								<span>{{ resultDetails.receiveAccNo }}</span>
							</li>
							<li>
								<span class="label">退款方式</span>
								<span>{{ resultDetails.methodDesc }}</span>
							</li>
							<li>
								<span class="label">退款日期</span>
								<span>{{ resultDetails.refundDate }}</span>
							</li>
							<li>
								<span class="label">退款金额(元)</span>
								<span style="color: #f46332">{{ resultDetails.refundAmount }}</span>
							</li>
							<li>
								<span class="label">退款类型</span>
								<span>{{ resultDetails.refundTypeDesc }}</span>
							</li>
							<li style="width: 66.6%">
								<span class="label">退款原因</span>
								<span>{{ resultDetails.refundReason }}</span>
							</li>
						</ul>
						<div class="slTitleAssis">附件</div>
						<div class="table-box">
							<a-table
								:columns="filesColumns"
								class="new-table"
								:bordered="false"
								rowKey="id"
								:dataSource="attachments"
								:pagination="false"
								:scroll="{ x: true }"
							>
								<template
									slot="serialNo"
									slot-scope="text, record"
									style="width: 50%"
								>
									<div
										v-for="(item, index) in record.attachments"
										:key="index"
										style="display: inline-block; color: var(--primary-color)"
									>
										<a-tooltip>
											<template slot="title">
												<span>上传时间：{{ item.createTime }}</span>
											</template>
											<a
												class="fileName"
												@click="handlePreview(item)"
												>{{ item.name }}</a
											>
										</a-tooltip>
										<span v-if="index != record.attachments.length - 1">，</span>
									</div>
								</template>
								<template
									slot="action"
									slot-scope="text, record"
								>
									<a
										href="javascript:;"
										@click="downloadPdf(record)"
										>下载</a
									>
								</template>
							</a-table>
						</div>
					</div>
				</a-tab-pane>
				<a-tab-pane key="2">
					<div slot="tab">操作记录</div>
					<div class="tabs-content">
						<div class="table-box">
							<a-table
								:columns="recordColumns"
								class="new-table"
								:bordered="false"
								:dataSource="operateLog"
								:pagination="false"
								:scroll="{ x: true }"
							>
							</a-table>
						</div>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import { API_REFUNDDETAIL, API_RefundDownload } from '@/v2/center/trade/api/pay';
import { API_DOWNLPREVIEWTE } from 'api';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import { Copy, CopyNow } from '@sub/components/svg'
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{ title: '文件编号', dataIndex: 'serialNo', scopedSlots: { customRender: 'serialNo' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
const recordColumns = [
	{ title: '操作类型', dataIndex: 'operateName', width: '20%' },
	{
		title: '操作人',
		dataIndex: 'operationBy',
		width: '20%',
		customRender(text) {
			return text ? text.split('-')[0] : text;
		}
	},
	{
		title: '所属公司',
		dataIndex: 'operation',
		width: '25%',
		customRender(text, record) {
			return record.operationBy ? record.operationBy.split('-')[1] : '';
		}
	},
	{ title: '操作内容', dataIndex: 'comments', width: '25%' },
	{ title: '操作时间', dataIndex: 'operationTime', width: '10%' }
];
export default {
	name: 'ContractOnLineDetail',
	data() {
		return {
			ENV,
			getPopupContainer,
			copyContractNoVisible: false, // 复制合同编号icon
			copyOrderNoVisible: false, // 复制订单编号icon
			contractInfo: {}, //合同信息,
			attachments: [], //附件信息
			operateLog: [], //操作记录load
			resultDetails: {},
			processChains: {}, // 流程进展
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			infoMaxWidth: 0, // 信息文案最大宽度
			filesColumns,
			recordColumns
		};
	},
	components: {
		breadcrumb,
		TextOverFlow,
		imageViewer,
		Copy,
		CopyNow,
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth(), this.getInfoMaxWidth();
			},
			immediate: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		isBuyerInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc === this.contractInfo.buyCompanyUscc;
		}
	},
	async created() {
		this.init();
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
		async init() {
			await this.getDetail();
		},
		// 获取详情
		getDetail() {
			return API_REFUNDDETAIL({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.resultDetails = res.data;
					this.drawingData(res.data);
				}
			});
		},
		//渲染数据
		async drawingData(data) {
			if (data.attachments?.length) {
				//附件列表
				let obj = {};
				obj.typeDesc = data.attachments[0].typeDesc;
				obj.attachments = data.attachments;
				this.attachments = [obj];
				delete data.attachments;
			}
			if (data.operationLogs?.length) {
				//操作记录
				this.operateLog = data.operationLogs;
				delete data.operationLogs;
			}
			if (data.contractInfo) {
				//合同信息
				this.contractInfo = data.contractInfo;
				delete data.contractInfo;
			}
			if (data.processChains) {
				this.processChains = data.processChains;
				delete data.processChains;
			}
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1560) {
				this.maxWidth = 140;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 250;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 320;
			} else {
				this.maxWidth = 360;
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
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 鼠标移入复制合同编号
		onMouseOverOrderNo() {
			this.copyOrderNoVisible = true;
		},
		// 鼠标移出
		onMouseOutOrderNo() {
			this.copyOrderNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		handlePreview(items) {
			filePreview(items.url || items.path, this.$refs.imageViewer.show);
		},
		downloadPdf(items) {
			if (items.attachments.length > 1) {
				let name =
					'退款凭证' +
					'-' +
					this.resultDetails.serialNo +
					'-' +
					this.contractInfo.sellerName +
					'-' +
					this.contractInfo.buyerName +
					'-' +
					this.contractInfo.contractNo +
					'.zip';
				API_RefundDownload({ id: this.$route.query.id }).then(res => {
					comDownload(res, undefined, name);
				});
			} else {
				let url = items.attachments[0].path;
				let name = items.attachments[0].name;
				let BASE_NET = ENV.BASE_NET;
				API_DOWNLPREVIEWTE(BASE_NET + url).then(res => {
					comDownload(res, url, name);
				});
			}
		},
		viewContractDetail() {
			let type = this.resultDetails.createContractType;
			let orderLineType = this.resultDetails.orderLineType;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + orderLineType.toLowerCase() + '/detail',
				query: {
					id: this.resultDetails.orderId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
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
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
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
		}
		.titleInfoItem {
			padding-left: 130px;
			.textOverflow {
				left: 130px !important;
			}
		}
		.titleInfoTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
		.titleInfoItem.more {
			width: 80%;
		}
	}
	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}
	.ant-card:last-child {
		margin-bottom: 0;
	}
	.refundTypeSymbol {
		display: inline-block;
		width: 18px;
		height: 18px;
		background: #8497b4;
		color: #fff;
		text-align: center;
		line-height: 18px;
		border-radius: 4px;
		font-style: normal;
		font-size: 14px;
		position: relative;
		top: -1px;
	}
	.refund-status {
		border-radius: 4px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		text-align: center;
		width: auto;
		display: inline-block;
		.text {
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -1px;
		}
	}
	.WAITING_OPERATION,
	.WAITING_RISK,
	.WAITING_OA {
		background-color: #ffdac8;
		color: #ff7937;
	}
	.OPERATION_REJECT,
	.RISK_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
	.COMPLETE {
		background: #c5ecdd;
		color: #3eb384;
	}
	.DISCARD {
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
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
	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 1px;
		display: inline-block;
		width: 14px;
		height: 14px;
	}
	.mobile-icon {
		margin: -3px 14px 0 6px;
		cursor: pointer;
		width: 14px;
		height: 14px;
	}
	.pt0 {
		padding-top: 0;
	}
	.tabs-content {
		width: 100%;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
	}
	::v-deep.ant-descriptions {
		font-weight: 400;
		line-height: 20px;
		padding-top: 10px;
		.ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
		}
		.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.twenty-percent {
		.flex-box {
			width: 20%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			& > img {
				width: 72px;
				height: 72px;
			}
			.flex-text {
				flex: 1;
				display: inline-block;
				font-size: 14px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
				line-height: 20px;
				margin-left: 16px;
				.label {
					font-size: 14px;
					color: rgba(0, 0, 0, 0.25);
					line-height: 22px;
					margin: 5px 0 10px 0;
				}
			}
			.progress-icon {
				width: 14px;
				height: 14px;
				cursor: pointer;
			}
			&::after {
				content: '';
				width: 1px;
				height: 32px;
				background: #e5e6eb;
				position: absolute;
				right: 16px;
				top: 20px;
			}
			& > i {
				display: inline-block;
				width: 72px;
				height: 72px;
			}
			.START {
				background: url('~@/v2/assets/imgs/refund/refund_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.WAITING_OPERATION {
				background: url('~@/v2/assets/imgs/refund/operate_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.WAITING_RISK {
				background: url('~@/v2/assets/imgs/refund/riskcontrol_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.WAITING_OA {
				background: url('~@/v2/assets/imgs/refund/oa_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.WAITING_OPERATION.WAIT,
			.WAITING_RISK.WAIT,
			.WAITING_OA.WAIT {
				background: url('~@/v2/assets/imgs/refund/audit_no_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.COMPLETE.WAIT {
				background: url('~@/v2/assets/imgs/refund/finish_no_icon.png') no-repeat;
				background-size: 100% 100%;
			}
			.COMPLETE {
				background: url('~@/v2/assets/imgs/refund/finish_icon.png') no-repeat;
				background-size: 100% 100%;
			}
		}
		.flex-box:last-child {
			&::after {
				display: none;
			}
		}
	}

	.red {
		color: #f5222d;
		position: relative;
	}
	.questionIcon {
		width: 12px;
		height: 12px;
		margin-left: 12px;
	}
	.grid-wrap {
		margin-top: 10px;
		width: 100%;
		border-radius: 3px;
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
	.contract-box {
		color: @primary-color;
	}
}
// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 310px !important;
	}
}
@media screen and (max-width: 1366px) {
	.flex-top-box {
		.ant-col:last-child {
			flex: 0 0 88px !important;
		}
	}
}
@media screen and (max-width: 1919px) {
	.copy-icon-box {
		left: 310px !important;
	}
}
@media screen and (max-width: 1559px) {
	.copy-icon-box {
		left: 260px !important;
	}
}
@media screen and (max-width: 1560px) {
	.flex-text {
		margin-left: 2px !important;
		.label {
			margin: 2px 0 6px 0 !important;
		}
	}
	.questionIcon {
		margin-left: 2px !important;
	}
}
</style>
