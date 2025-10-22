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
					<span>收货证明详情</span>
				</div>
				<div class="titleInfoBox">
					<div class="titleInfoTitle">
						<a-space :size="16">
							<em class="refundTypeSymbol">收</em>
							<div
								@mouseenter="onMouseOverReceiveNo()"
								@mouseleave="onMouseOutReceiveNo()"
							>
								<span style="cursor: pointer"> 收货证明编号：{{ detailData.receiptNo || '-' }}</span>
								<span
									v-show="copyReceiveNoVisible"
									class="copy-contract-icon"
									v-clipboard:copy="detailData.receiptNo"
									v-clipboard:success="onCopy"
									v-clipboard:error="onError"
								>
									<CopyNow></CopyNow>
								</span>
								<span
									v-show="!copyReceiveNoVisible"
									class="copy-contract-icon"
								>
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
									<span class="copy-icon">
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
										v-clipboard:error="onError"
									>
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
				style="width: 100%"
				class="tabInfo"
			>
				<a-tabs>
					<a-tab-pane
						key="1"
						tab="收货证明信息"
					>
						<div style="width: 100%">
							<div class="slTitleAssis">收货证明信息</div>
							<ul class="grid-wrap">
								<li>
									<span class="label">收货日期</span>
									<TextOverFlow
										v-if="detailData.beginDate"
										:content="getDate()"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">品名</span>
									<TextOverFlow
										v-if="detailData.goodsName"
										:content="detailData.goodsName"
										:maxWidth="infoMaxWidth"
									/>
								</li>
								<li>
									<span class="label">收货数量(吨)</span>
									<span>{{ detailData.quantity | formatMoney(3) }}</span>
								</li>

								<li>
									<span class="label">交货地点</span>
									<TextOverFlow
										v-if="detailData.deliveryPlace"
										:content="detailData.deliveryPlace"
										:maxWidth="infoMaxWidth"
									/>
								</li>

								<li>
									<span class="label">交货方式</span>
									<span>{{ detailData.deliveryModeDesc }}</span>
								</li>
								<li>
									<span class="label">收货证明开具日期</span>
									<TextOverFlow
										v-if="detailData.openDate"
										:content="detailData.openDate"
										:maxWidth="infoMaxWidth"
									/>
								</li>
							</ul>
							<div
								class="slTitleAssis"
								style="margin: 30px 0"
							>
								关联出库信息
							</div>

							<div class="table-box">
								<a-table
									:columns="outboundColumns"
									class="new-table"
									:bordered="false"
									rowKey="id"
									:dataSource="detailData.outboundVOList || []"
									:pagination="false"
									:scroll="{ x: true }"
								>
									<template
										slot="ountboundAction"
										slot-scope="text, record"
									>
										<a
											href="javascript:;"
											@click="gotoOutDetail(record)"
											>{{ text }}</a
										>
									</template>
									<template
										slot="remark"
										slot-scope="text, record"
									>
										<div
											v-for="(item, index) in record.remark"
											:key="index"
										>
											<div style="color: #3377889d">{{ item.createdDate }}</div>
											<a-tooltip>
												<template slot="title">
													{{ item.remark }}
												</template>
												<div class="remarkContent">{{ item.remark }}</div>
											</a-tooltip>
										</div>
									</template>
								</a-table>
							</div>

							<div
								class="slTitleAssis"
								style="margin: 30px 0"
							>
								附件
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
									>
										<div
											v-for="(item, index) in record.fileLists"
											:key="index"
											style="display: inline-block; color: var(--dg-primary-color)"
										>
											<a-tooltip>
												<template slot="title">
													<span>上传时间：{{ item.createDate }}</span>
												</template>
												<a
													class="fileName"
													@click="handlePreview(item)"
													>{{ item.fileName || '文件' }}</a
												>
											</a-tooltip>
											<span v-if="index != record.fileLists.length - 1">，</span>
										</div>
									</template>
									<template
										slot="more"
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
									:columns="recordColumns"
									class="new-table"
									:bordered="false"
									rowKey="id"
									:dataSource="detailData.ladingOperationList || []"
									:pagination="false"
									:scroll="{ x: true }"
								>
									<template
										slot="comments"
										slot-scope="text, record"
									>
										<div style="word-wrap: break-word; word-break: break-all; white-space: initial">
											{{ text }}
										</div>
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
import { API_getReceiptProveDataById, API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/lading';
import breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import { API_downloadReceiptFile } from '@/v2/center/trade/api/newLading';
import { Copy, CopyNow } from '@sub/components/svg';
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{ title: '文件名', dataIndex: 'fileName', scopedSlots: { customRender: 'serialNo' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'more' }, align: 'center', fixed: 'right' }
];

const recordColumns = [
	{ title: '操作类型', dataIndex: 'operateType', width: '20%' },
	{
		title: '操作人',
		dataIndex: 'operateName',
		width: '20%',
		customRender(text) {
			return text ? text.split('-')[0] : text;
		}
	},
	{
		title: '所属公司',
		dataIndex: 'companyName',
		width: '25%'
	},
	{ title: '操作内容', dataIndex: 'comments', width: '25%', scopedSlots: { customRender: 'comments' } },
	{ title: '操作时间', dataIndex: 'operateTime', width: '10%' }
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
			copyReceiveNoVisible: false, // 复制合同编号icon
			copyContractNoVisible: false, // 复制订单编号icon
			operateLog: [], //操作记录load
			maxWidth: 0, // 信息文案最大宽度
			infoMaxWidth: 0, // 信息文案最大宽度
			detailData: { contractInfo: {} },
			clientWidth: null, //浏览器尺寸
			columns: [],
			filesColumns,
			outboundColumns: [],
			recordColumns,
			attachments: [], //附件信息
			handleColumns: [
				{
					title: '操作类型',
					dataIndex: 'operateType',
					key: 'operateType'
				},

				{
					title: '操作内容',
					dataIndex: 'comments',
					key: 'comments'
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
					dataIndex: 'id'
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
		detailData: {
			immediate: true,
			handler(detail) {
				//关联出出库信息
				let acts = detail.warehouseToReceivable
					? [
							{ title: '实际提货单位', dataIndex: 'actualLadingUnit' },
							{ title: '实际收货单位', dataIndex: 'actualReceivingUnit' }
						]
					: [];
				this.outboundColumns = [
					{ title: '出库编号', dataIndex: 'outboundNo', scopedSlots: { customRender: 'ountboundAction' } },
					{
						title: '出库日期',
						dataIndex: 'deliveryDate'
					},
					{
						title: '出库数量',
						dataIndex: 'outboundQuantity',
						width: 100
					},
					{ title: '品名', dataIndex: 'goodsName' },
					...acts,
					{ title: '备注', dataIndex: 'remark', width: 300, scopedSlots: { customRender: 'remark' } }
				];
			}
		},
		clientWidth: {
			handler: function () {
				this.getmaxWidth(), this.getInfoMaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		//进入出库记录详情
		gotoOutDetail(record) {
			let query = { id: record.outboundId };
			this.$router.push({
				path: '/center/logisticsPlatform/out/detail',
				query
			});
			return;
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
					this.attachments.push({ typeDesc: fileMap[key][0].typeDesc, fileLists: fileMap[key], type: fileMap[key][0].type });
				}
			}
		},
		openTiDetail(record) {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			const { href } = this.$router.resolve({
				path: `/center/${modulePath}/lading/detail`,
				query: {
					id: record.id
				}
			});
			window.open(href, '_new');
		},
		// 鼠标移入收货证明编号
		onMouseOverReceiveNo() {
			this.copyReceiveNoVisible = true;
		},
		// 鼠标移出
		onMouseOutReceiveNo() {
			this.copyReceiveNoVisible = false;
		},
		async handlePreview(record) {
			const url = await this.$RsaDecrypt.generateFileUrl(record.fileUrl);
			window.open(url, '_blank');
			// filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
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
		init() {
			API_getReceiptProveDataById({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					if (this.detailData.transType) {
						this.columns = this[this.detailData.transType + 'Columns'];
					}
					this.initAttachments();
				}
			});
		},
		downloadFile(item) {
			// 下载pdf
			API_downloadReceiptFile({ id: this.detailData.id, type: item.type })
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.catch(e => {
					console.error('下载报错：', e);
				});
		},
		openPdf(v) {
			window.open(v.fileUrl, '_blank');
		},

		getDate() {
			return this.detailData.beginDate + '~' + this.detailData.endDate;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.cur {
	cursor: pointer;
}

.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	::v-deep .tabInfo.ant-card {
		padding: 1px 30px 20px;
	}

	.remarkContent {
		color: #77889d;
		width: 320px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		white-space: pre-wrap;
	}
	.tabs-content {
		width: 100%;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
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
		color: @primary-color;
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

/*上面的为新增*/

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
