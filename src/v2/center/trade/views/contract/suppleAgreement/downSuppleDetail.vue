<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>线下补充协议详情</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div class="titleInfoBox">
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">补</em>
								<div
									@mouseenter="copyContractNoVisible = true"
									@mouseleave="copyContractNoVisible = false"
								>
									<span style="cursor: pointer">补协编号：{{ suppleData.paperSupplementalAgreementNo || '-' }}</span>
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
										v-clipboard:copy="suppleData.paperSupplementalAgreementNo"
										class="copy-contract-icon"
									>
										<CopyNow></CopyNow>
									</span>
								</div>
								<p :class="'contract-status ' + suppleData.status">
									<span class="text">{{ suppleData.statusDesc }}</span>
								</p>
							</a-space>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row class="supple-info">
				<div
					class="titleInfoItem"
					@mouseenter="copyContractNoVisible2 = true"
					@mouseleave="copyContractNoVisible2 = false"
				>
					<span class="label">所属合同号：</span>
					<a-tooltip>
						<template slot="title">{{ suppleData.contractNo }}</template>

						<a
							class="omit"
							@click="goContactDetail"
							:style="{ 'max-width': `${maxWidth}px` }"
							>{{ suppleData.contractNo }}</a
						>
					</a-tooltip>

					<span
						v-show="!copyContractNoVisible2"
						class="copy-contract-icon"
					>
						<Copy></Copy>
					</span>
					<span
						v-show="copyContractNoVisible2"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="suppleData.contractNo"
						class="copy-contract-icon"
					>
						<CopyNow></CopyNow>
					</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">卖方企业：</span>
					<TextOverFlow
						style="left: 85px !important"
						v-if="suppleData.sellerCompanyName"
						:content="suppleData.sellerCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">买方企业：</span>
					<TextOverFlow
						style="left: 85px !important"
						v-if="suppleData.buyerCompanyName"
						:content="suppleData.buyerCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">创建时间：</span>
					<span>{{ suppleData.createDate }}</span>
				</div>
				<div
					class="titleInfoItem"
					style="width: 70%"
				>
					<span class="label">上传人：</span>
					<span v-if="suppleData.createCompanyName"
						>{{ suppleData.createCompanyName }}（{{ suppleData.createAccountName }}）</span
					>
					<span v-else>-</span>
				</div>
			</a-row>
		</a-card>

		<a-card
			:bordered="false"
			class="pt0"
			style="marin-bottom: 0"
		>
			<!-- tabs -->
			<a-tabs v-model="tab">
				<a-tab-pane
					key="contractInfo"
					tab="补协信息"
				>
					<div style="width: 100%">
						<div
							class="slTitleAssis"
							style="margin: 30px 0"
						>
							补协信息
						</div>
						<ul class="grid-wrap">
							<li>
								<span class="label">补协执行期</span>
								<span v-if="suppleData.execDateStart">{{ suppleData.execDateStart }} 至 {{ suppleData.execDateEnd }}</span>
								<span v-else> - </span>
							</li>
							<li>
								<span class="label">补协签订日期</span>
								<span v-if="suppleData.signDate">{{ suppleData.signDate }}</span>
								<span v-else>-</span>
							</li>
							<li>
								<span class="label">补协签章状态</span>
								<span>{{ suppleData.signStatus == 1 ? '单签' : '双签' }}</span>
							</li>
							<li
								style="width: 99.9%"
								v-if="suppleData.changeItemDesc && (suppleData.status != 'COMPLETED' || contractType != 'UP')"
							>
								<span class="label">变更项</span>
								<span>{{ suppleData.changeItemDesc }}</span>
							</li>
						</ul>
						<DownChangeList
							:list="suppleData.changeItems"
							style="margin-top: 30px"
							v-if="suppleData.status == 'COMPLETED' && contractType == 'DOWN'"
						></DownChangeList>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="contractOperation"
					:tab="`补协操作记录(${logList.length})`"
				>
					<LogList :logList="logList"></LogList>
				</a-tab-pane>
			</a-tabs>
			<div v-if="tab == 'contractInfo'">
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
					:dataSource="suppleData.terminalAttachments"
					:pagination="false"
				>
					<div
						slot="fileList"
						slot-scope="text, record, index"
					>
						<div class="name-box">
							<div
								v-for="(item, i) in record.fileList"
								:key="i"
								class="name detail"
							>
								<a-tooltip>
									<template slot="title">
										<span>上传时间：{{ item.uploadTime }}</span>
									</template>
									<a
										class="preview"
										@click="handlePreview(item)"
									>
										{{ item.fileName }}
									</a>
									<span v-if="i != 0 && i - 1 != record.fileList.length">;</span>
								</a-tooltip>
							</div>
						</div>
					</div>
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
							<span class="line"></span>
						</a-space>
					</template>
				</a-table>
			</div>
		</a-card>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { getOfflineSuppleDetail, getLogList, downloadCurrentSup } from '@/v2/center/trade/api/suppleAgreement';

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';

import LogList from './components/LogList.vue';

import breadcrumb from '@/v2/components/breadcrumb/index';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import DownChangeList from './components/downChangeList.vue';

import { getPopupContainer } from '@/v2/utils/factory.js';

import { mapGetters } from 'vuex';
import { Copy, CopyNow } from '@sub/components/svg';

const filesColumns = [
	{ title: '文件类型', dataIndex: 'type', width: '20%', customRender: text => '补充协议' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];

export default {
	props: ['source'],
	data() {
		return {
			getPopupContainer,
			copyContractNoVisible: false, // 复制合同编号icon
			copyContractNoVisible2: false,
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			// 详情信息
			suppleData: {},
			tab: 'contractInfo',

			logList: [],
			filesColumns,
			previewImg: ''
		};
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		// 电子补协 和 线下补协
		isOn() {
			return this.$route.query.suppleType == 'on';
		},
		contractType() {
			return this.suppleData.contractType;
		}
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
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
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getOfflineSuppleDetail(params);
			this.suppleData = res.data;
			this.suppleData.terminalAttachments = [{ fileList: this.suppleData.terminalAttachments }];
			this.getLog();
		},
		// 去往合同详情
		goContactDetail() {
			// center/contract/sell/online/detail?id=2325&type=SELL&initiatorUscc=91610138MA6X3K6K0G
			const type = this.contractType == 'DOWN' ? 'sell' : 'buy';
			this.$router.push({
				path: `/center/contract/${type}/offline/detail`,
				query: {
					id: this.suppleData.contractId,
					type
				}
			});
		},
		//返回
		goBack() {
			this.$router.back();
		},
		// 获取操作记录
		async getLog() {
			const params = {
				id: this.$route.query.id,
				supplementAgreementType: this.isOn ? 'ONLINE' : 'OFFLINE'
			};
			const res = await getLogList(params);
			this.logList = res.data;
		},

		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		async download(record) {
			const params = {
				id: this.$route.query.id,
				supplementAgreementType: 'OFFLINE'
			};
			const res = await downloadCurrentSup(params);
			comDownload(res.data, null, res.name);
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 120;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 150;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 240;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 280;
			} else {
				this.maxWidth = 320;
			}
		}
	},
	components: {
		breadcrumb,
		TextOverFlow,
		LogList,
		DownChangeList,
		Copy,
		CopyNow
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
	.supple-info {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		.titleInfoItem {
			width: 25%;
			display: inline-block;
			// padding-left: 112px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				display: inline-block;
				width: 85px;
				text-align: right;
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
	.contractTypeSymbol {
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
	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 2px;
		display: inline-block;
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

	.slBtn {
		margin-left: 30px;
		padding: 0 !important;
	}

	.mt32 {
		margin-top: 32px;
	}

	.textOverflow {
		left: 70px !important;
	}
}
// 小于1366 以1300为准
@media screen and (max-width: 1366px) {
	.flex-top-box {
		.ant-col:last-child {
			flex: 0 0 550px !important;
		}
	}
}
</style>
<style lang="less" scoped>
.contract-status {
	border-radius: 4px;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
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
}
.name-box {
	display: flex;
	flex-wrap: wrap;
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
</style>
