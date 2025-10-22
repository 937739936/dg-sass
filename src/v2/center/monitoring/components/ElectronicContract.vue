<style lang="less" scoped>
.a-divider {
	margin: 0;
	margin-bottom: 20px;
	&::before {
		width: 0;
	}
	&/deep/.ant-divider-inner-text {
		padding-left: 0;
		font-size: 15px;
	}
}
</style>
<template>
	<div>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="合同信息"
			>
				<div style="width: 100%">
					<!-- <div> -->
					<a-descriptions
						title="基本信息"
						:column="2"
						class="specialItem"
					>
						<a-descriptions-item label="订单编号">{{ contractData.orderNo }}</a-descriptions-item>
						<a-descriptions-item label="合同编号">{{ contractData.contractNo }}</a-descriptions-item>
						<a-descriptions-item label="卖方企业">{{ contractData.sellerCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="买方企业">{{ contractData.buyerCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="煤种">{{ contractData.coalTypeName }}</a-descriptions-item>
						<a-descriptions-item label="品名">{{ contractData.goodsName }}</a-descriptions-item>
						<a-descriptions-item label="数量">{{ contractData.contractQuantity }}吨</a-descriptions-item>
						<a-descriptions-item label="基准价格">
							<TextOverFlow
								v-if="contractData.contractPriceDesc"
								:content="contractData.contractPriceDesc"
								:maxWidth="300"
							/>
							<TextOverFlow
								v-else-if="contractData.contractPrice"
								:content="contractData.contractPrice + '元/吨'"
								:maxWidth="300"
							/>
							<span v-else>-</span>
						</a-descriptions-item>
						<a-descriptions-item label="结算类型">{{ contractData.settleModeDesc }}</a-descriptions-item>
						<a-descriptions-item label="交货期限">
							{{ contractData.deliveryDateBegin }} 至
							{{ contractData.deliveryDateEnd }}
						</a-descriptions-item>
						<a-descriptions-item label="运输方式">{{ contractData.transTypeName }}</a-descriptions-item>
					</a-descriptions>
					<template v-if="contractData.terminalContractDelivery">
						<template v-if="contractData.transType == 'SHIP'">
							<a-descriptions
								:column="2"
								size="small"
							>
								<a-descriptions-item label="装货港">{{
									contractData.terminalContractDelivery.shipLoadingPortName
								}}</a-descriptions-item>
								<a-descriptions-item label="卸货港">{{
									contractData.terminalContractDelivery.shipDischargingPortName
								}}</a-descriptions-item>
								<a-descriptions-item label="收货人姓名">{{
									contractData.terminalContractDelivery.consigneeCompanyName
								}}</a-descriptions-item>
							</a-descriptions>
						</template>
						<template v-if="['AUTOMOBILE_AND_TRAIN', 'TRAIN'].includes(contractData.transType)">
							<a-divider
								class="a-divider"
								orientation="left"
								v-if="contractData.transType == 'AUTOMOBILE_AND_TRAIN'"
								>火运信息</a-divider
							>
							<a-descriptions :column="2">
								<a-descriptions-item label="发站">{{
									contractData.terminalContractDelivery.trainSendStationName
								}}</a-descriptions-item>
								<a-descriptions-item label="到站">{{
									contractData.terminalContractDelivery.trainArriveStationName
								}}</a-descriptions-item>
								<a-descriptions-item label="托运人">{{
									contractData.terminalContractDelivery.consignorCompanyName
								}}</a-descriptions-item>
								<a-descriptions-item label="收货人姓名">{{
									contractData.terminalContractDelivery.consigneeCompanyName
								}}</a-descriptions-item>
							</a-descriptions>
						</template>
						<template v-if="['AUTOMOBILE_AND_TRAIN', 'AUTOMOBILE'].includes(contractData.transType)">
							<a-divider
								class="a-divider"
								orientation="left"
								v-if="contractData.transType == 'AUTOMOBILE_AND_TRAIN'"
								>汽运信息</a-divider
							>
							<a-descriptions :column="2">
								<a-descriptions-item label="发货地址">{{
									contractData.terminalContractDelivery.sendGoodsAddress
								}}</a-descriptions-item>
								<a-descriptions-item label="收货地址">{{
									contractData.terminalContractDelivery.receiveGoodsAddress
								}}</a-descriptions-item>
								<a-descriptions-item label="收货人姓名">{{
									contractData.terminalContractDelivery.consigneeCompanyName
								}}</a-descriptions-item>
							</a-descriptions>
						</template>
					</template>
					<a-descriptions
						title="银行账户信息"
						:column="1"
					>
						<a-descriptions-item label="卖方账号"
							>{{ contractData.sellerSubbranchName }} {{ contractData.sellerBankNo }}</a-descriptions-item
						>
						<a-descriptions-item label="买方账号"
							>{{ contractData.buySubbranchName }} {{ contractData.buyBankNo }}</a-descriptions-item
						>
					</a-descriptions>
					<div
						class="slTitleThird"
						v-if="productIndicatorObjList.length && productIndicatorObjList[0].productIndicator.length"
					>
						基准质量指标
					</div>
					<div
						v-if="productIndicatorObjList.length && productIndicatorObjList[0].productIndicator.length"
						class="productIndicatorBody"
					>
						<div
							v-for="(pro, index2) in productIndicatorObjList"
							:key="index2"
						>
							<div
								v-if="contractData.productIndicator.length > 1"
								class="productIndicatorBox"
							>
								<a-row>
									<a-col
										span="4"
										class="label"
										>品名{{ index2 + 1 }}</a-col
									>
									<a-col
										span="4"
										class="label heavyColor"
										>{{ pro.goodsName }}</a-col
									>
									<a-col
										span="4"
										class="label"
										>基准价格(含税)</a-col
									>
									<a-col
										span="4"
										class="label heavyColor"
										>{{ pro.basePrice }}</a-col
									>
									<a-col
										span="4"
										class="label"
										>基准价格(不含税))</a-col
									>
									<a-col
										span="4"
										class="label heavyColor"
										>{{ pro.excludeTaxBasePrice }}</a-col
									>
								</a-row>
								<a-row
									class="flexRow"
									v-if="pro.productIndicator && pro.productIndicator.length"
								>
									<a-col
										span="4"
										class="left"
										:style="'height:' + 96 * Math.ceil(pro.productIndicator.length / 5) + 'px'"
									>
										<span>基准质量指标</span>
									</a-col>
									<a-col
										span="20"
										class="right"
									>
										<ul>
											<li
												v-for="(item, index) in pro.productIndicator"
												:key="index + '1'"
											>
												<span class="label">{{ item.indicatorName }}</span>
												<span>{{ item.setValue }}</span>
											</li>
											<template v-if="pro.productIndicator.length % 5">
												<li
													v-for="(project, indent) in 5 - (pro.productIndicator.length % 5)"
													:key="indent + '2'"
												>
													<span class="label"></span>
													<span></span>
												</li>
											</template>
										</ul>
									</a-col>
								</a-row>
							</div>
							<ul
								v-else
								class="grid-wrap specialIndicator"
							>
								<li
									v-for="(item, index) in pro.productIndicator"
									:key="index"
									:class="pro.productIndicator.length < 4 && index === pro.productIndicator.length - 1 ? 'special' : ''"
								>
									<span class="label">
										<TextOverFlow
											:content="item.indicatorName"
											:maxWidth="136"
										/>
									</span>
									<span>{{ item.setValue }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="合同附件"
			>
				<div style="width: 100%">
					<div
						class="tr mb16"
						v-if="attachList.length > 0"
					>
						<a-button
							type="primary"
							:ghost="true"
							@click="batchDownload()"
							>打包下载合同</a-button
						>
					</div>
					<a-table
						:pagination="false"
						:columns="columns"
						:data-source="attachList"
						:scroll="{ x: true }"
						:rowKey="record => record.url || record.fileUrl"
					>
						<span
							slot="status"
							slot-scope="text"
						>
							<template>
								{{ filterCodeByValueName(text, 'deliver_status') }}
							</template>
						</span>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="viewPDF(record.url || record.fileUrl)">查看</a>
								<a @click="downFile(record.url || record.fileUrl)">下载</a>
							</a-space>
						</template>
					</a-table>
					<iPagination
						:pagination="pagination"
						@change="getList"
					/>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
import {
	API_BusinessMonitoringUpstreamContractDetail,
	API_BusinessMonitoringUpstreamAttachList,
	API_BusinessMonitoringDownstreamContractDetail,
	API_BusinessMonitoringDownstreamAttachList,
	API_BusinessMonitoringUpstreamAttachDownload,
	API_BusinessMonitoringDownstreamAttachDownload,
	API_FullBusinessLineDetailContractDetail,
	API_FullBusinessLineDetailAttachList,
	API_FullBusinessLineAttachDownload,
	API_DOWNLPREVIEWTE
} from '@/v2/center/monitoring/api';
import iPagination from '@sub/components/iPagination';
import coalTypeData from '@/v2/utils/coalTypeData';
import comDownload from '@sub/utils/comDownload.js';
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
import TextOverFlow from '@sub/components/TextOverflow.vue';
const columns = [
	{ title: '类型', dataIndex: 'typeName' },
	{ title: '附件名称', dataIndex: 'name' },
	{ title: '签订日期', dataIndex: 'signTime' },
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		width: 100,
		fixed: 'right'
	}
];
export default {
	name: 'ElectronicContract',

	components: {
		iPagination,
		TextOverFlow
	},
	props: {
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		// 下游合同编号
		downOrderNo: {
			type: String,
			default: ''
		},
		// 合同类型
		contractType: {
			type: [Number, String],
			default: 0
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			columns,
			contractData: {},
			attachList: [],
			pagination: {
				total: 0,
				pageNo: 1
			},
			productIndicator: []
		};
	},
	computed: {
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		}),
		productIndicatorObjList() {
			this.productIndicator.forEach(pro => {
				let result = [];
				result = pro.productIndicator.filter(
					item =>
						item.setValue &&
						item.setValue != '-' &&
						item.setValue != '≥' &&
						item.setValue != '≤' &&
						item.setValue != '>' &&
						item.setValue != '<' &&
						item.setValue != '='
				);
				pro.productIndicator = result;
			});
			return this.productIndicator;
		}
	},
	watch: {
		curUpstream() {
			this.getContractData();
		},
		orderNo() {
			this.getContractData();
		}
	},
	created() {
		this.getContractData();
	},
	methods: {
		getContractData() {
			this.getContract();
			this.getAttachList();
		},
		getContract() {
			const { businessLineType } = this.$route.query;
			const fct = [
				API_BusinessMonitoringUpstreamContractDetail,
				API_BusinessMonitoringDownstreamContractDetail,
				API_FullBusinessLineDetailContractDetail
			][this.contractType];
			const params = {
				businessLineType,
				orderNo: this.orderNo,
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				t: new Date().getTime() + 2
			};
			fct(params).then(res => {
				if (res.success) {
					this.contractData = res.data;
					this.getTempleteList();
				}
			});
		},
		getAttachList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			const { businessLineType } = this.$route.query;
			const params = {
				pageNo,
				pageSize,
				businessLineType,
				orderNo: this.orderNo,
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || ''
			};
			const fct = [
				API_BusinessMonitoringUpstreamAttachList,
				API_BusinessMonitoringDownstreamAttachList,
				API_FullBusinessLineDetailAttachList
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.attachList = res.data.records;
					this.pagination.total = res.data.total;
				}
			});
		},
		viewPDF(url) {
			window.open(url, '_blank');
		},
		batchDownload() {
			const fct = [
				API_BusinessMonitoringUpstreamAttachDownload,
				API_BusinessMonitoringDownstreamAttachDownload,
				API_FullBusinessLineAttachDownload
			][this.contractType];
			const params = {
				upOrderNo: this.curUpstream.upOrderNo,
				downOrderNo: this.downOrderNo,
				orderNo: this.orderNo
			};
			fct(params).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		// downPDF(record){
		//   API_FinancingDetaildownloadFile({
		//     contractFileId:record.id
		//   }).then(res=>{
		//     comDownload(res, record.url, null);
		//   })
		// },
		downFile(url) {
			API_DOWNLPREVIEWTE(`${url}`)
				.then(res => {
					comDownload(res, url);
				})
				.catch(() => {
					this.$message.error('下载失败');
				});
		},
		getList() {},
		callback(key) {},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		getTempleteList() {
			const orderIndicators = this.contractData.productIndicator;
			if (!orderIndicators) return;
			orderIndicators.forEach(pro => {
				const productIndicatorList = pro.productIndicatorList || [];
				let obj = Object.assign(pro);
				let productIndicator = null;
				productIndicatorList.forEach(item => {
					const v1 = item.value1;
					const v2 = item.value2;
					if (item.inputType == 'RANGE') {
						if (this.isNull(v1) || this.isNull(v2)) {
							item.setValue = v1 || v2;
						} else {
							const max = Math.max(v1, v2);
							const min = Math.min(v1, v2);
							if (min === max) {
								item.setValue = min;
							} else {
								item.setValue = min + '-' + max;
							}
						}
					} else {
						item.setValue = (item.symbol == '无符号' ? '' : item.symbol) + v1;
					}
				});
				productIndicator = productIndicatorList?.sort((a, b) => a.sortOrder - b.sortOrder);
				obj.productIndicator = productIndicator;
				this.productIndicator.push(obj);
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slTitleThird {
	color: rgba(0, 0, 0, 0.85);
	font-size: 16px;
	line-height: 1.5;
	margin-bottom: 20px;
	font-weight: bold;
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
.productIndicatorBody {
	& > div {
		.productIndicatorBox {
			color: rgba(0, 0, 0, 0.8);
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			border-left: 1px solid #e5e6eb;
			border-top: 1px solid #e5e6eb;
			::v-deep.ant-col {
				line-height: 48px;
				box-sizing: border-box;
				text-align: center;
				border-bottom: 1px solid #e5e6eb;
				border-right: 1px solid #e5e6eb;
			}
			.flexRow {
				.left {
					height: 100%;
					color: #77889d;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.right {
					border: none;
				}
				.label {
					background: #fff;
				}
			}
			.label {
				background: #f3f5f6;
				font-weight: 400;
				color: #77889d;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			ul {
				overflow: hidden;
				margin: 0;
				padding: 0;
				li {
					width: 20%;
					text-align: center;
					float: left;
					list-style: none;
					span {
						display: block;
						height: 48px;
						border-right: 1px solid #e5e6eb;
						border-bottom: 1px solid #e5e6eb;
					}
					& > span:first-child {
						border-top: 0;
					}
				}
			}
		}
	}
	& > div:last-child {
		.productIndicatorBox {
			margin-top: 0;
			border-top: none;
		}
	}
	& > div:first-child {
		.productIndicatorBox {
			margin-top: 10px;
			border-top: 1px solid #e5e6eb;
		}
	}
	.thinColor {
		color: #77889d;
	}
	.heavyColor {
		color: rgba(0, 0, 0, 0.8);
	}
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 2px;
		left: 0;
	}
}
.specialIndicator {
	.textOverflow {
		position: relative;
		left: 0;
	}
}
::v-deep.ant-descriptions {
	padding: 0;
}
::v-deep.ant-descriptions .ant-descriptions-item:has(.ant-descriptions-item-content) {
	padding-bottom: 14px;
}
</style>
