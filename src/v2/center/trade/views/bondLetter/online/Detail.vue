<template>
	<div
		class="slMain"
		v-if="detailData"
	>
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div class="titleInfoBox">
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">追</em>
								<div
									@mouseenter="onMouseOverLetterNo()"
									@mouseleave="onMouseOutLetterNo()"
								>
									<span style="cursor: pointer">追保函编号：{{ bondLetterData.serialNo || '-' }}</span>
									<span
										v-show="!copyLetterNoVisible"
										class="copy-contract-icon"
									>
										<Copy></Copy>
									</span>
									<span
										v-show="copyLetterNoVisible"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
										v-clipboard:copy="bondLetterData.serialNo"
										class="copy-contract-icon"
									>
										<CopyNow></CopyNow>
									</span>
								</div>
								<div v-if="['RECEIVER_REJECT', 'RECEIVER_CANCEL', 'INITIATOR_CANCEL'].includes(bondLetterData.status)">
									<a-tooltip
										placement="top"
										trigger="hover"
										overlayClassName="bondLetter-status-tooltips"
										:destroyTooltipOnHide="true"
										@visibleChange="e => visibleChange(e, this.bondLetterData)"
										:getPopupContainer="getPopupContainer"
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
											<p
												class="fz12 tooltipColor"
												v-if="tipShowText && bondLetterData.status === 'RECEIVER_REJECT'"
											>
												驳回原因：
											</p>
											<p
												class="fz12 tooltipColor"
												v-if="tipShowText && ['RECEIVER_CANCEL', 'INITIATOR_CANCEL'].includes(bondLetterData.status)"
											>
												作废原因：
											</p>
											<p class="fz12">{{ tipShowText }}</p>
										</template>
										<p :class="'contract-status ' + bondLetterData.status">
											<span class="text">{{ bondLetterData.statusDesc }}</span>
										</p>
									</a-tooltip>
								</div>
								<div v-else>
									<p :class="'contract-status ' + bondLetterData.status">
										<span class="text">{{ bondLetterData.statusDesc }}</span>
									</p>
								</div>
							</a-space>
						</div>
						<div
							class="titleInfoItem"
							@mouseenter="onMouseOverContractNo()"
							@mouseleave="onMouseOutContractNo()"
						>
							<span class="label">所属合同编号：</span>
							<TextOverFlow
								v-if="contractInfo.contractNo "
								:content="contractInfo.contractNo"
								:maxWidth="maxWidth"
								@clickFunc="viewContractDetail()"
							/>
							<span v-else>-</span>
							<div
								class="copy-icon-box"
								v-show="!copyContractNoVisible"
							>
								<span class="copy-icon">
									<Copy></Copy>
								</span>
							</div>
							<div
								class="copy-icon-box"
								v-show="copyContractNoVisible"
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
								v-if="bondLetterData.createDate"
								:content="bondLetterData.createDate"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
					</div>
				</a-col>
			</a-row>

			<a-tabs @change="tabChange">
				<a-tab-pane
					key="1"
					tab="追保函信息"
				>
					<div class="tabs-content">
						<div class="slTitleAssis">业务线信息</div>
						<div class="table-box">
							<a-table
								:columns="businessLineColumns"
								class="new-table"
								:bordered="false"
								rowKey="id"
								:dataSource="businessLineInfo"
								:pagination="false"
							>
								<template
									slot="businessLineNo"
									slot-scope="text, items"
								>
									<a
										v-if="isCreator"
										href="javascript:;"
										@click="viewBusinessLineDetail(items)"
										>{{ text }}</a
									>
									<span v-else>{{ text }}</span>
								</template>
							</a-table>
						</div>
						<div class="slTitleAssis">追保函信息</div>
						<a-form
							class="slFormDetail"
							:colon="false"
						>
							<a-row>
								<a-col :span="8">
									<a-form-item label="追保金额(元)">
										<a-input
											disabled
											v-model="'¥' + bondLetterData.recoveryAmountThousandth"
										></a-input>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="签发日期">
										<a-input
											disabled
											v-model="bondLetterData.signTime"
										></a-input>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="追保截止日期">
										<a-input
											disabled
											v-model="bondLetterData.recoveryDeadline"
										></a-input>
									</a-form-item>
								</a-col>
							</a-row>
						</a-form>
						<div class="slTitleAssis">附件信息</div>
						<div class="table-box">
							<a-table
								:columns="filesColumns"
								class="new-table"
								:bordered="false"
								:dataSource="bondLetterData.attachmentList"
								:pagination="false"
							>
								<template
									slot="transferName"
									slot-scope="text, items"
								>
									<span
										class="fileName"
										@click="viewFile(items)"
										>{{ text }}</span
									>
								</template>
								<template
									slot="action"
									slot-scope="text, items"
								>
									<a
										href="javascript:;"
										@click="downloadPdf(items)"
										>下载</a
									>
								</template>
							</a-table>
						</div>
					</div>
				</a-tab-pane>
				<a-tab-pane key="2">
					<div slot="tab">追保函操作记录({{ detailData.operationLogNum }})</div>
					<div class="tabs-content">
						<div class="table-box">
							<a-table
								:columns="recordColumns"
								class="new-table"
								:bordered="false"
								rowKey="id"
								:dataSource="recordList"
								:pagination="false"
							>
								<template
									slot="businessLineNo"
									slot-scope="text, items"
								>
									<a
										href="javascript:;"
										@click="viewBusinessLineDetail(items)"
										>{{ text }}</a
									>
								</template>
							</a-table>
						</div>
					</div>
				</a-tab-pane>
			</a-tabs>
			<img
				:src="previewImg"
				style="display: none"
				ref="viewer"
				v-viewer
			/>
		</a-card>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { API_GetOperationLogRecords, API_GetBondLetterDetail, API_GetStatusTip } from '@/v2/center/trade/api/bondLetter';
import { API_DOWNLPREVIEWTE } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/api/env';
import { mapGetters } from 'vuex';
import { Copy, CopyNow } from '@sub/components/svg';
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo', width: '33.3%', scopedSlots: { customRender: 'businessLineNo' } },
	{ title: '业务线名称', dataIndex: 'businessLineName', width: '33.3%' },
	{ title: '上游采购合同编号', dataIndex: 'parentContractNo', width: '20%' }
];
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeName', width: '40%' },
	{ title: '文件编号', dataIndex: 'transferName', width: '45%', scopedSlots: { customRender: 'transferName' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const recordColumns = [
	{ title: '操作类型', dataIndex: 'operationType', width: '20%' },
	{ title: '操作人', dataIndex: 'operatePerson', width: '20%' },
	{ title: '所属公司', dataIndex: 'operateCompanyName', width: '25%' },
	{ title: '操作内容', dataIndex: 'comments', width: '25%' },
	{ title: '操作时间', dataIndex: 'operationTime', width: '10%' }
];
export default {
	name: 'Detail',
	data() {
		return {
			getPopupContainer,
			detailData: null,
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸
			copyContractNoVisible: false, // 复制合同编号icon
			copyLetterNoVisible: false, // 复制订单编号icon
			businessLineColumns,
			filesColumns,
			recordColumns,
			recordList: [],
			tipShowText: '',
			contractInfo: {},
			businessLineInfo: [],
			bondLetterData: {},
			previewImg: ''
		};
	},
	components: {
		Breadcrumb,
		TextOverFlow,
		Copy,
		CopyNow
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		contractStatus() {
			return this.$route.query?.status || '';
		},
		isCreator() {
			return this.VUEX_ST_COMPANYSUER.company.uscc === this.contractInfo.sellerUscc;
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
			return API_GetBondLetterDetail({ bondLetterId: this.$route.query.bondLetterId }).then(res => {
				if (res.success) {
					this.detailData = res.data;
					this.contractInfo = res.data.contractInfo || {};
					this.businessLineInfo = res.data.businessLineInfoList || [];
					this.bondLetterData = res.data.bondLetterData || {};
				}
			});
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth >= 1920) {
				this.maxWidth = 260;
			}
			if (this.clientWidth < 1920) {
				this.maxWidth = 230;
			}
			if (this.clientWidth <= 1560) {
				this.maxWidth = 150;
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
		onMouseOverLetterNo() {
			this.copyLetterNoVisible = true;
		},
		// 鼠标移出
		onMouseOutLetterNo() {
			this.copyLetterNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		viewBusinessLineDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.parentOrderNo,
					downOrderNo: items.orderNo,
					businessLineType: items.type,
					businessLineNo: items.businessLineNo,
					contractType: 0,
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					downstreamActiveIndex: 0
				}
			});
			window.open(routerData.href, '_blank');
		},
		viewContractDetail() {
			let type = this.isCreator ? 'SELL' : 'BUY';
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + this.contractInfo.contractType.toLowerCase() + '/detail',
				query: {
					id: this.contractInfo.id,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		downloadPdf(items) {
			let name = items.name;
			API_DOWNLPREVIEWTE(ENV.BASE_NET + items.url).then(res => {
				comDownload(res, undefined, name);
			});
		},
		tabChange(key) {
			if (key == 2) {
				this.getRecordList();
			}
		},
		getRecordList() {
			API_GetOperationLogRecords({ bondLetterId: this.$route.query.bondLetterId }).then(res => {
				if (res.success) {
					this.recordList = res.data;
				}
			});
		},
		visibleChange(visible, items) {
			// 合同状态文案
			if (visible) {
				API_GetStatusTip({
					bondLetterId: items.id
				}).then(res => {
					this.tipShowTextMethods(items, res.data);
				});
			} else {
				this.tipShowText = '';
			}
		},
		tipShowTextMethods(row, data) {
			// 合同状态文案展示
			let text = '';
			if (row.status == 'RECEIVER_REJECT' && data?.rejectReason) {
				text = data?.rejectReason;
			}
			if ((row.status == 'RECEIVER_CANCEL' || row.status == 'INITIATOR_CANCEL') && data?.cancelReason) {
				text = data?.cancelReason;
			}
			this.tipShowText = text;
		},
		viewFile(data) {
			let url = data.fileUrl || data.url;
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
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
			width: 25%;
			display: inline-block;
			padding-left: 100px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				position: absolute;
				left: 0;
				top: 0;
				display: inline-block;
				width: 100px;
				text-align: right;
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
	}
	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}
	.ant-card:last-child {
		margin-bottom: 0;
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
	}
	.copy-icon {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
	.copy-icon-box {
		display: inline-block;
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
	.textOverflow {
		left: 100px !important;
	}
	.status-frozen {
		width: auto;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		padding: 1px 6px;
		border-radius: 4px;
		background: #f8dde8;
		color: #db81a5;
		font-size: 14px;
		zoom: 0.85;
	}
	.status-frozen-desc {
		width: auto;
		height: 20px;
		display: inline-block;
		line-height: 20px;
		padding: 1px 6px;
		border-radius: 4px;
		background: #ffdac8;
		font-size: 14px;
		color: #ff7937;
		zoom: 0.85;
	}

	.slTitleAssis {
		margin-top: 30px;
	}
	.tabs-content {
		width: 100%;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
	}
	.slFormDetail {
		.ant-form-item {
			width: 364px;
			margin-bottom: 0;
		}
	}
	.contract-status {
		border-radius: 4px;
		height: 20px;
		line-height: 19px;
		padding: 0 5px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		text-align: center;
		cursor: pointer;
		.text {
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -1px;
		}
	}
	.WAIT_RECEIVER_SEAL,
	.WAIT_INITIATOR_SEAL,
	.WAIT_RECEIVER_CONFIRM {
		background-color: #c9daff;
		color: #596fa0;
	}
	.RECEIVER_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
	.RECEIVER_CANCEL,
	.INITIATOR_CANCEL {
		color: #a8a8a8;
		background: #e0e0e0;
	}
	.COMPLETED {
		background: #c5ecdd;
		color: #3eb384;
	}
	.WAIT_ISSUE {
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
	color: rgba(255, 255, 255, 0.5);
}
.fileName:hover {
	color: @primary-color;
	cursor: pointer;
}
// 小于1366 以1300为准
@media screen and (min-width: 1561px) {
	.copy-icon-box {
		left: 330px !important;
	}
}
@media screen and (max-width: 1560px) {
	.copy-icon-box {
		left: 270px !important;
	}
}
</style>
<style lang="less">
.bondLetter-status-tooltips {
	.ant-tooltip-inner {
		background: #1f2329;
	}
}
</style>
