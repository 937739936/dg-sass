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
					<span>提货记录详情</span>
				</div>
				<div class="titleInfoBox">
					<div class="titleInfoTitle">
						<a-space :size="16">
							<em class="refundTypeSymbol">提</em>
							<div
								@mouseenter="onMouseOverBusinessNo()"
								@mouseleave="onMouseOutBusinessNo()"
							>
								<span style="cursor: pointer">提货单编号：{{ detailData.ladingNo || '-' }}</span>
								<span
									v-if="copyBusinessNoVisible"
									class="copy-contract-icon"
									v-clipboard:copy="detailData.ladingNo"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError">
									<CopyNow></CopyNow>
								</span>
								<span
									v-else
									class="copy-contract-icon">
									<Copy></Copy>
								</span>
							</div>
						</a-space>
					</div>
					<a-row>
						<a-col :span="8">
							<div
								class="titleInfoItem pl85 contract-box"
								@mouseenter="onMouseOverContractNo()"
								@mouseleave="onMouseOutContractNo()"
							>
								<span class="label w85">所属合同编号：</span>
								<TextOverFlow
									v-if="detailData.contractInfo.contractNo"
									:content="detailData.contractInfo.contractNo"
									:maxWidth="maxWidth"
									@clickFunc="viewContractDetail"
								/>
								<span v-else>-</span>
								<div
									class="copy-icon-box"
									v-show="!copyContractNoVisible"
								>
									<span
										class="copy-icon">
										<Copy></Copy>
									</span>
								</div>
								<div
									class="copy-icon-box"
									v-show="copyContractNoVisible"
								>
									<span
										class="copy-icon"
										v-clipboard:copy="detailData.contractInfo.contractNo"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError">
										<CopyNow></CopyNow>
									</span>
								</div>
							</div>
						</a-col>
						<a-col
							:span="8"
							v-if="detailData.releaseInstructNo"
						>
							<div
								class="titleInfoItem pl85 contract-box"
								@mouseenter="onMouseOverReleaseInstructNo()"
								@mouseleave="onMouseOutReleaseInstructNo()"
							>
								<span class="label w85">放货指令编号：</span>
								<TextOverFlow
									:content="detailData.releaseInstructNo"
									:maxWidth="maxWidth"
									@clickFunc="goReleaseInstruct"
								/>
								<div
									class="copy-icon-box"
									v-show="!copyReleaseInstructNoVisible"
								>
									<span
										class="copy-icon">
										<Copy></Copy>
									</span>
								</div>
								<div
									class="copy-icon-box"
									v-show="copyReleaseInstructNoVisible"
								>
									<span
										class="copy-icon"
										v-clipboard:copy="detailData.releaseInstructNo"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError">
										<CopyNow></CopyNow>
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
								<span class="label">创建人：</span>
								<TextOverFlow
									v-if="detailData.createName"
									:content="detailData.createName"
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
						tab="提货信息"
					>
						<div style="width: 100%">
							<div class="slTitleAssis">提货信息</div>
							<ul class="grid-wrap">
								<li>
									<span class="label">提货地点</span>
									<TextOverFlow
										v-if="detailData.place"
										:content="detailData.place"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">提货日期</span>
									<TextOverFlow
										v-if="detailData.beginDate"
										:content="getDate()"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">提货工具</span>
									<TextOverFlow
										v-if="detailData.transTypeDesc"
										:content="detailData.transTypeDesc"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li v-if="detailData.actualLadingUnit">
									<span class="label">实际提货单位</span>
									<TextOverFlow
										v-if="detailData.actualLadingUnit"
										:content="detailData.actualLadingUnit"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">提货联系人姓名</span>
									<TextOverFlow
										v-if="detailData.contactName"
										:content="detailData.contactName"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">提货人联系方式</span>
									<TextOverFlow
										v-if="detailData.contactMode"
										:content="detailData.contactMode"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">提货联系人身份证号</span>
									<TextOverFlow
										v-if="detailData.idNo"
										:content="detailData.idNo"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li v-if="detailData.actualReceivingUnit">
									<span class="label">实际收货单位</span>
									<TextOverFlow
										v-if="detailData.actualReceivingUnit"
										:content="detailData.actualReceivingUnit"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li v-if="detailData.actualReceivingUnit">
									<span class="label">提货数量(吨)</span>
									<TextOverFlow
										v-if="detailData.quantity"
										:content="detailData.quantity"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li
									v-else
									style="width: 100%"
								>
									<span class="label">提货数量(吨)</span>
									<TextOverFlow
										v-if="detailData.quantity"
										:content="detailData.quantity"
										:maxWidth="infoMaxWidth"
									/>
								</li>
							</ul>

							<div class="table-box">
								<a-table
									:columns="getColumns(this.detailData.transTypeDesc)"
									class="new-table"
									:bordered="false"
									rowKey="id"
									:dataSource="detailData.ladingTransInfoList || []"
									:pagination="false"
									:scroll="{ x: true }"
								>
								</a-table>
							</div>

							<div>
								<div class="rlRemark">备注</div>
								<div class="rlRemarkContent">
									<span class="textStyle">{{ this.detailData.remark || '' }}</span>
								</div>
							</div>

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
											style="display: inline-block; color: var(--primary-color)"
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
										slot-scope="text, items"
									>
										<a-space :size="20">
											<a
												href="javascript:;"
												@click="downloadFile(items)"
												>下载</a
											>
										</a-space>
									</template>
								</a-table>
							</div>
						</div>
					</a-tab-pane>

					<a-tab-pane key="2">
						<div slot="tab">
							操作记录<span v-if="operateLog.length">({{ operateLog.length }})</span>
						</div>
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
										<div
											style="word-wrap: break-word; word-break: break-all; white-space: initial"
											v-html="text"
										></div>
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
import { API_getLadingBillDataById, API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/lading';

import { API_downloadLadingFile, API_downloadReceiptFile } from '@/v2/center/trade/api/newLading';
import breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import {Copy, CopyNow} from '@sub/components/svg'
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{ title: '文件名', dataIndex: 'fileName', scopedSlots: { customRender: 'serialNo' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
export default {
	components: {
		TextOverFlow,
		imageViewer,
		breadcrumb,
		Copy,
		CopyNow
	},
	name: 'LetterNoticeDetail',
	data() {
		return {
			moment,
			copyBusinessNoVisible: false, // 复制提货编号icon
			copyContractNoVisible: false, // 复制合同编号icon
			copyReleaseInstructNoVisible: false, // 复制放货指令编号icon
			operateLog: [], //操作记录load
			maxWidth: 0, // 信息文案最大宽度
			infoMaxWidth: 0, // 信息文案最大宽度
			detailData: { contractInfo: {} },
			columns: [],
			attachments: [], //附件信息
			filesColumns,
			handleColumns: [
				{
					title: '操作类型',
					dataIndex: 'operateType',
					key: 'operateType'
				},

				{
					title: '操作内容',
					dataIndex: 'comments',
					key: 'comments',
					scopedSlots: { customRender: 'comments' }
				},
				{
					title: '操作人',
					dataIndex: 'operateName',
					key: 'operateName'
				},
				{
					title: '所属公司',
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{
					title: '操作时间',
					dataIndex: 'operateTime',
					key: 'operateTime'
				}
			],
			clientWidth: null, //浏览器尺寸
			SHIPColumns: [
				{
					title: '船舶名称',
					dataIndex: 'shipName'
				},
				{
					title: '船舶MMSI',
					dataIndex: 'shipNo'
				}
			],
			TRAINColumns: [
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
			AUTOMOBILEColumns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
				}
			],
			AUTOMOBILE_AND_TRAINColumns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
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

			carColumns: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
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
	computed: {},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth(), this.getInfoMaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		getColumns(type) {
			if (type == '火运') {
				return this.transColumns;
			} else if (type == '汽运') {
				return this.carColumns;
			} else if (type == '船运') {
				return this.shipColumns;
			} else {
				return [];
			}
		},

		getDate() {
			return this.detailData.beginDate + '~' + this.detailData.endDate;
		},
		handlePreview(items) {
			filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
		},

		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1560) {
				this.maxWidth = 140;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 190;
			} else {
				this.maxWidth = 220;
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
		// 鼠标移入收货证明编号
		onMouseOverBusinessNo() {
			this.copyBusinessNoVisible = true;
		},
		// 鼠标移出
		onMouseOutBusinessNo() {
			this.copyBusinessNoVisible = false;
		},
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 鼠标移入复制放货指令编号
		onMouseOverReleaseInstructNo() {
			this.copyReleaseInstructNoVisible = true;
		},
		// 鼠标移出
		onMouseOutReleaseInstructNo() {
			this.copyReleaseInstructNoVisible = false;
		},

		viewContractDetail() {
			let type = 'buy';
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
		goReleaseInstruct() {
			let releaseId = this.detailData.releaseInstructId;
			if (releaseId) {
				let path = `/center/ladingbill/delivery/detail?id=${releaseId}`;
				window.open(path);
			}
		},
		init() {
			API_getLadingBillDataById({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
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
			// 下载pdf
			API_downloadLadingFile({ id: this.detailData.id, type: item.type }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
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

	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: -1px;
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

	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 1px;
		display: inline-block;
		width: 14px;
		height: 14px;
	}

	.contract-box {
		color:  @primary-color;
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

		.more {
			overflow: inherit;
			width: 44%;
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

.fileBlock {
	display: inline-block;
	text-align: center;
	padding: 10px;
	padding-left: 70px;
}

.trans-track {
	margin-left: 30px;
	color: #1981ff;
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

.title-remark {
	&:after {
		color: #ff1515;
		font-size: 16px;
		padding-left: 44px;
	}
}

/deep/ .ant-table td {
	white-space: nowrap;
}

.ant-calendar-picker {
	width: 100%;
}

// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 340px !important;
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
