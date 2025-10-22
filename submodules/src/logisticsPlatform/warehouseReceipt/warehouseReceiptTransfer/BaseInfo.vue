<template>
	<div style="width: 100%">

		<template v-if="!isWarehouse">
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				关联合同信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="合同编号">
					<a
						v-if="!isWarehouse"
						@click="goContract"
						href="javascript:;"
						>{{ contractInfo.contractNo }}</a
					>
					<span v-else>{{ contractInfo.contractNo }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="卖方企业">{{ contractInfo.sellerName }} </a-descriptions-item>
				<a-descriptions-item label="买方企业">
					<span>{{ contractInfo.buyerName }}</span>
				</a-descriptions-item>

				<a-descriptions-item label="品名">
					{{ contractInfo.goodsName }}
				</a-descriptions-item>
				<a-descriptions-item :label="contractInfo.contractType == 'OFFLINE' ? '合同价格' : '基准价格'">
						<span v-if="contractInfo.followTheMarket">随行就市</span>
						<span v-if="contractInfo.basePrice !== undefined && contractInfo.basePrice !== null  && !contractInfo.followTheMarket && !contractInfo.basePriceDesc">
							<i v-if="contractInfo.basePrice == '随行就市' || contractInfo.basePrice == 0 ">随行就市</i>
							<i v-else>{{contractInfo.basePrice | formatMoney(2)}} 元/吨</i>
						</span>
						<i v-if="contractInfo.basePriceDesc && !contractInfo.followTheMarket">{{contractInfo.basePriceDesc || '-'}}</i>
					<!-- <span>{{
						contractInfo.followTheMarket
							? '随行就市'
							: contractInfo.basePrice
								? formatMoney(contractInfo.basePrice) + '元/吨'
								: '-'
					}}</span> -->
				</a-descriptions-item>
				<a-descriptions-item label="数量">
					<span
						>{{ contractInfo.quantity ? formatMoney(contractInfo.quantity) + '吨' : '-' }}
						<i v-if="contractInfo.quantityOffset">(±{{ contractInfo.quantityOffset }}%)</i>
					</span>
				</a-descriptions-item>
				<a-descriptions-item label="交货期限">{{ contractInfo.startDate }} 至 {{ contractInfo.endDate }}</a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ contractInfo.transportModeDesc }}</a-descriptions-item>
				<a-descriptions-item label="收货人">{{ contractInfo.consigneeCompanyName || '-' }}</a-descriptions-item>
			</a-descriptions>
		</template>
		<!-- 审核才有 -->
		<template v-if="source == 'audit'">
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				转让信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="转让方">
					{{ detailData.transferorName }}
				</a-descriptions-item>
				<a-descriptions-item label="接收方">{{ detailData.receiverName }} </a-descriptions-item>
				<a-descriptions-item label="仓库名称">
					<span>{{ detailData.stationName }}</span>
				</a-descriptions-item>

				<a-descriptions-item label="货物名称">
					{{ detailData.goodsName }}
				</a-descriptions-item>
				<a-descriptions-item label="转让数量合计">
					<span style="color: #ff7937">{{ detailData.transferQuantity | formatMoney(4) }}</span>
					<span>吨</span>
				</a-descriptions-item>
			</a-descriptions>
		</template>

		<WarehouseInfo :list="detailData.transferInfoList" @viewCarousel='viewCarousel'></WarehouseInfo>
		<!-- !-- 审核才有 -->
		<template v-if="source == 'audit'">
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				<span>仓储合同信息</span>
				<span class="receiver">接收方</span>
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="仓储合同编号">
					{{ detailData.warehouseContractNo }}
				</a-descriptions-item>
				<a-descriptions-item label="存储期间"
					>{{ detailData.storageTimeStart }} - {{ detailData.storageTimeEnd }}
				</a-descriptions-item>
				<a-descriptions-item label="仓储费用">
					<span>￥{{ detailData.storageFees | formatMoney(4) }}</span>
				</a-descriptions-item>
			</a-descriptions>
		</template>
		<!-- 、审核才有 -->
		<template v-if="source == 'audit'">
			<div
				class="slTitleAssis"
				v-if="JSON.stringify(insuranceInfo) !='{}'"
				style="margin-bottom: 20px"
			>
				<span>保险信息</span>
				<span class="receiver">接收方</span>
			</div>
			<a-descriptions
				bordered
				v-if="JSON.stringify(insuranceInfo) !='{}'"
				:column="3"
				size="middle"
			>
				<a-descriptions-item
					label="保险险种"
					>{{ insuranceInfo.insuranceTypeDesc || '-'}}
				</a-descriptions-item>
				<a-descriptions-item
					label="保险自定义"
					v-if="insuranceInfo.insuranceTypeHandInput"
					>{{ insuranceInfo.insuranceTypeHandInput }}
				</a-descriptions-item>
				<a-descriptions-item
					label="保险单号"
				>
					<span>{{ insuranceInfo.policyNo || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item
					label="保险人"
				>
					<span>{{ insuranceInfo.policyHolder || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item
					label="被保险人"
				>
					<span>{{ insuranceInfo.insurant || '-' }}</span>
				</a-descriptions-item>
				<a-descriptions-item
					label="保险期限"
				>
					<span>{{ insuranceInfo.insurancePeriodStart }} - {{ insuranceInfo.insurancePeriodEnd }} </span>
				</a-descriptions-item>
				<a-descriptions-item
					label="保险金额"
					
				>
					<span v-if="insuranceInfo.insuranceAmount">{{ insuranceInfo.insuranceAmount | formatMoney }}元</span>
					<span v-else>-</span>
				</a-descriptions-item>
			</a-descriptions>
		</template>

		<div class="file-box">
			<div class="slTitleAssis">附件信息</div>
			<a-button
				type="primary"
				class="btn"
				v-if="detailData.warehouseReceiptAttachmentList"
				ghost
				@click="downloadAll(1)"
			>
				一键下载
			</a-button>
		</div>
		<a-row>
			<a-table
				rowKey="name"
				class="new-table"
				:columns="fileColumns"
				:dataSource="detailData.warehouseReceiptAttachmentList"
				:pagination="false"
				:scroll="{x:true}"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<a
							href="javascript:;"
							@click="viewPDF(record)"
							>查看</a
						>
						<a
							href="javascript:;"
							style="margin-left: 24px"
							@click="download(record)"
							>下载</a
						>
					</a-space>
				</div>
			</a-table>
		</a-row>

		<template v-if="source == 'audit'">
			<div class="file-box">
				<div class="slTitleAssis">待盖章电子仓单</div>
				<a-button
					type="primary"
					class="btn"
					ghost
					@click="downloadAll(2)"
				>
					一键下载
				</a-button>
			</div>
			<a-row>

				<a-table
					rowKey="name"
					class="new-table"
					:columns="fileColumns2"
					:dataSource="detailData.waitSignAttachmentList"
					:pagination="false"
					:scroll="{x:true}"
					:defaultExpandAllRows="true"
					:locale="{ emptyText: '暂无数据' }"
				>
					<div
						slot="action"
						slot-scope="text, record, index"
					>
						<a-space>
							<a
								href="javascript:;"
								@click="viewCarousel(detailData.waitSignAttachmentList,index)"
								>查看</a
							>
							<a
								href="javascript:;"
								style="margin-left: 24px"
								@click="download(record)"
								>下载</a
							>
						</a-space>
					</div>
				</a-table>
			</a-row>
		</template>
	</div>
</template>

<script>
import {formatMoney } from '@sub/filters'
import WarehouseInfo from './WarehouseInfo.vue'


const fileColumns = [
	{
		title: '文件类型',
		dataIndex: 'fileTypeDesc',
	},
	{
		title: '文件名称',
		dataIndex: 'name',
	},
	{
		title: '文件编号',
		dataIndex: 'fileNo'
	},
  {
		title: '签订日期',
		dataIndex: 'signDate'
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 160,
		fixed: 'right'
	}
];
const fileColumns2 = [
	{
		title: '文件类型',
		dataIndex: 'fileTypeDesc',
	},
	{
		title: '存货人',
		dataIndex: 'bailorCompanyName',
	},
	{
		title: '仓单编号',
		dataIndex: 'warehouseReceiptNo'
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 160,
		fixed: 'right'
	}
];


export default {
	props: {
		detailData: {
			default: () => {
				return { feeList: [], contractList: [] };
			}
		},
		operatorInfo: {
			default: () => {
				return {};
			}
		},
		type: {
			default: 'rest'
		},
		source: {
			default: 'detail'
		}
	},
	components: {
		WarehouseInfo,
	},
	computed: {
			// 合同信息
		contractInfo() {
			return this.detailData.contractInfo || {}
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
		// 保险信息
		insuranceInfo() {
			return this.detailData.insuranceInfo || {}
		}
	},
	data() {
		return {
			fileColumns,
			fileColumns2


		};
	},

	methods: {
		formatMoney,
		download(item) {
			this.$emit('download', item);
		},
		viewCarousel(list, index) {
			this.$emit('viewCarousel', list, index)
		},
		// 去往合同

    goContract() {
			// let contractType = 'sell'

			let contractType = this.VUEX_ST_COMPANYSUER.companyUscc == this.contractInfo.buyerUscc ? 'buy' : 'sell';
      let path = `/center/contract/${contractType}/online/detail?id=${this.contractInfo.orderContractId}&type=${contractType.toUpperCase()}`
      if(this.type == 'rest') {
        if(this.contractInfo.contractType == 'OFFLINE') {
          path = `/center/contract/${contractType}/offline/detail?id=${this.contractInfo.orderContractId}&type=${contractType}`
        }
      } else {
        path = `/sys/contract/online/detail?id=${this.contractInfo.orderContractId}`
        if(this.contractInfo.contractType == 'OFFLINE') {
          path = `/sys/contract/offline/detail?id=${this.contractInfo.orderContractId}&contractNo=${this.contractInfo.orderNo}`
        }
      }


      const routeData = this.$router.resolve({
        path,
      })


      window.open(routeData.href, '_blank')
    },
		viewPDF(item) {
			this.$emit('viewPDF', item);
		},
		// viewCarousel(index) {
		// 	this.$emit('viewCarousel', index);
		// },
    downloadAll(type) {
      this.$emit('downloadAll', type);
    }
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0 !important;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: 19%;
	}
}
.trade {
	/deep/ .ant-descriptions-item-content {
		width: 40%;
	}
}
.bank-account-box {
	margin-top: 10px;
	::v-deep.ant-row-flex {
		flex-wrap: nowrap !important;
	}
	::v-deep.textOverflow {
		left: 0;
	}
	.bank-account-item {
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		border-radius: 6px;
		margin-right: 50px;
		line-height: 24px;
		width: 350px;
		.bank-account-title {
			margin-bottom: 10px;
			line-height: 22px;
		}
		.bank-account-icon {
			width: 30px;
			height: 22px;
			vertical-align: top;
		}
		::v-deep.ant-col {
			.label {
				color: rgba(0, 0, 0, 0.4);
			}
		}
		.title {
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #77889d;
			margin-left: 10px;
		}
	}
	.bank-account-item.first {
		background: #f0f8ff;
	}
	.bank-account-item.second {
		background: #fff9e9;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}

.status,
.receiver {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	// font-family: PingFang SC;
	font-size: 12px;
	// margin-left: 4px;
	background: #ffdbc8;
	color: #ff7937;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.receiver {
	background: rgba(70, 130, 243, 0.1);
	color: #77889d;
	margin-left: 10px;
	padding: 0;
	height: 20px;
	width: 52px;
	line-height: 20px;
}
.indicator {
	/deep/ .ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	/deep/ .ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		// width: 19%;
		width: inherit;
	}
}
.new-table {
	/deep/ tbody {
		tr td:last-child {
			border-left: 1px solid #e5e6eb;
		}
	}
}
.new-table2 {
	/deep/ tbody {
		tr td:last-child {
			border-left: 0;
		}
	}
}
.file-box {
	display: flex;
	margin-bottom: 20px;
	margin-top: 30px;
	align-items: center;
	.slTitleAssis {
		margin-top: 0;
		margin-right: 20px;
	}
	.btn {
		height: 28px;
		width: 88px;
	}
}
.tips-box {
	color: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	border-radius: 4px;
	padding: 10px 10px;
	margin-bottom: 20px;
	span {
		margin-left: 10px;
	}
}
.goods-tips {
	margin-top: 20px;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	span:nth-child(2n) {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
	}
}
</style>
