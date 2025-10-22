<template>
	<div style="width: 100%">
		<!-- 仓储端不展示 -->
		<template v-if="!isWarehouse">
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				采购合同信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="合同编号">			
					<template  v-if="!isWarehouse">
						 <a	@click="goContract" href="javascript:;">{{ contractInfo.contractNo  }}</a> 
						 	<span
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
								v-clipboard:copy="contractInfo.contractNo"
							>
								<Copy class="cur"></Copy>
						</span>
					</template>
         
					<span v-else>{{ contractInfo.contractNo  }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="卖方企业">{{ contractInfo.sellerName }} </a-descriptions-item>
				<a-descriptions-item label="买方企业">
					<span>{{ contractInfo.buyerName }}</span>
				</a-descriptions-item>

				<a-descriptions-item label="品名">
          {{ contractInfo.goodsName }}
				</a-descriptions-item>
				<a-descriptions-item :label="contractInfo.contractType == 'OFFLINE' ? '合同价格': '基准价格'">
          <!-- <span>{{ contractInfo.followTheMarket ? "随行就市" : (contractInfo.basePrice? formatMoney(contractInfo.basePrice)+"元/吨" :'-' ) }}</span> -->
					  <span v-if="contractInfo.followTheMarket">随行就市</span>
						<span v-if="contractInfo.basePrice !== undefined && contractInfo.basePrice !== null  && !contractInfo.followTheMarket && !contractInfo.basePriceDesc">
							<i v-if="contractInfo.basePrice == '随行就市' || contractInfo.basePrice == 0 ">随行就市</i>
							<i v-else>{{contractInfo.basePrice | formatMoney(2)}} 元/吨</i>
						</span>
						<i v-if="contractInfo.basePriceDesc && !contractInfo.followTheMarket">{{contractInfo.basePriceDesc || '-'}}</i>
        </a-descriptions-item>
				<a-descriptions-item label="数量">
					<span>{{contractInfo.quantity? formatMoney(contractInfo.quantity)+"吨" : '-' }}  <i v-if="contractInfo.quantityOffset">(±{{contractInfo.quantityOffset}}%)</i> </span>
				</a-descriptions-item>
				<a-descriptions-item label="交货期限">{{ contractInfo.startDate }} 至 {{ contractInfo.endDate }}</a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ contractInfo.transportModeDesc }}</a-descriptions-item>
				<a-descriptions-item label="收货人">{{ contractInfo.consigneeCompanyName }}</a-descriptions-item>



			</a-descriptions>
		</template>


    <div	class="slTitleAssis"	style="margin-bottom: 20px"	>货物明细</div>
    <a-table
      rowKey="name"
      class="new-table new-table2" 
      :columns="goodsColumns"
      :dataSource="detailData.inStorageList"
      :pagination="false"
			:scroll='{x:true}'
      :defaultExpandAllRows="true"
      :locale="{ emptyText: '暂无数据' }"
    >
        <template slot="inStorageNo" slot-scope="text, record">
          <a href="javascript:;" @click="goInDetail(record)">{{text}}</a>
        </template>
        <template slot="warehouseGoodsAllocationName" slot-scope="text">
          <a-tooltip v-if="text">
            <template slot="title">{{text}}</template>
            <p class="omit"> {{text || '-'}}</p>
          </a-tooltip>
          <span v-else>-</span>
        </template>
    </a-table>
    <div class="goods-tips">
      <span>入库数量：</span>
      <span>{{allQuantity}}吨</span>
      <span style="margin-left:30px">损耗标准：</span>
      <span v-if="detailData.lossStandardType =='TEXT'">{{detailData.lossStandard}}</span>
      <span v-else>±{{detailData.lossStandard}}%</span>

    </div>
     <div	class="slTitleAssis"	style="margin-bottom: 20px"	v-if="productIndicatorList.length">质量指标</div>
    <a-descriptions
				bordered
				:column="3"
				v-if="productIndicatorList.length"
				class="indicator"
				size="middle"
			>
				<a-descriptions-item  v-for="(item, index) in productIndicatorList" :key="index" :label="`${item.indicatorName}`">
					
					<span v-if="item.inputType =='RANGE'">{{ item.value1 }} -  {{ item.value2 }}</span>
					<span v-else>{{item.symbol}} {{ item.value1 }} </span>

				</a-descriptions-item>
			</a-descriptions>

      <div	class="slTitleAssis"	style="margin-bottom: 20px"	>仓储合同信息</div>
      <a-descriptions
				bordered
				:column="3"
				size="middle"
			>
      	<a-descriptions-item label="仓储合同编号">			
          {{ detailData.warehouseContractNo }}
				 </a-descriptions-item>
				<a-descriptions-item label="仓储期间">{{ detailData.storageTimeStart }} - {{ detailData.storageTimeEnd }}  </a-descriptions-item>
				<a-descriptions-item label="仓储费">
					<span v-if="detailData.storageFeesType =='TEXT'">{{ detailData.storageFees}}</span>
					<span v-else>￥{{ detailData.storageFees | formatMoney(4) }}</span>

				</a-descriptions-item>
			</a-descriptions>
      <div	class="slTitleAssis" v-if="JSON.stringify(insuranceInfo) !='{}'" 	style="margin-bottom: 20px"	>保险信息</div>
      <a-descriptions
				bordered
				v-if="JSON.stringify(insuranceInfo) !='{}'"
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="保险险种">{{ insuranceInfo.insuranceTypeDesc || '-' }} </a-descriptions-item>
				<a-descriptions-item
					label="保险自定义"
					v-if="insuranceInfo.insuranceTypeHandInput"
					>{{ insuranceInfo.insuranceTypeHandInput }}
				</a-descriptions-item>
				<a-descriptions-item label="保险单号" >
					<span>{{ insuranceInfo.policyNo || '-'}}</span>
				</a-descriptions-item>
        <a-descriptions-item label="保险人" >
					<span>{{ insuranceInfo.policyHolder || '-' }}</span>
				</a-descriptions-item>
        <a-descriptions-item label="被保险人" >
					<span>{{ insuranceInfo.insurant || '-' }}</span>
				</a-descriptions-item>
        <a-descriptions-item label="保险期限" >
					<span >{{ insuranceInfo.insurancePeriodStart }} - {{ insuranceInfo.insurancePeriodEnd }} </span>
				</a-descriptions-item>
        <a-descriptions-item label="保险金额" >
					<span v-if="insuranceInfo.insuranceAmount">￥{{ insuranceInfo.insuranceAmount | formatMoney(2) }}</span>
					<span v-else>-</span>
				</a-descriptions-item>
			</a-descriptions>


		<!-- 协议附件 -->
    <div class="file-box">
			<div class="slTitleAssis">附件信息</div>
			<a-button
				type="primary"
				class="btn"
				ghost
				@click="downloadAll"
			>
				一键下载
			</a-button>
		</div>
		<a-row>
			<a-table
				:rowKey="(t,r,i) => i"
				class="new-table"
				:columns="fileColumns"
				:dataSource="detailData.warehouseReceiptAttachmentList"
				:pagination="false"
				:scroll='{x:true}'
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
							@click="downPDF(record)"
							>下载</a
						>
					</a-space>
				</div>
			</a-table>
		</a-row>
	</div>
</template>

<script>
import {formatMoney } from '@sub/filters'
import { Copy, CopyNow } from '@sub/components/svg/index';
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
		fixed:'right',
		width: 160
	}
];
const goodsColumns = [
	{ title: '入库编号',dataIndex: 'inStorageNo', scopedSlots: { customRender: 'inStorageNo' },fixed:'left'},
	{ title: '入库日期',dataIndex: 'storageDate',},
	{ title: '品名',dataIndex: 'goodsName',},
	{ title: '入库数量(吨)',dataIndex: 'quantity', customRender: t => formatMoney(t)},
	{ title: '发货单位',dataIndex: 'deliveryCompanyName',},
	{ title: '仓库名称',dataIndex: 'stationName',},
	{ title: '仓房&货位',dataIndex: 'warehouseGoodsAllocationName',scopedSlots: { customRender: "warehouseGoodsAllocationName" }},
];
export default {
	props: {
		detailData: {
			default: () => {
				return { feeList: [], contractList: [] };
			}
		},
		type: {
			default: 'rest'
		}
	},
	components: {
		Copy,
		// CopyNow,
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
		allQuantity() {
			let num = 0
			let list = this.detailData.inStorageList || []
			list.forEach(el => {
				num+= el.quantity
			})
			return formatMoney(num)
		},
		// 指标信息
		productIndicatorList() {
			return this.detailData.productIndicatorList || []
		},
		// 保险信息
		insuranceInfo() {
			return this.detailData.insuranceInfo || {}
		}
		
	},
	data() {
		return {
			fileColumns,
      goodsColumns,

		};
	},
	

	methods: {
		formatMoney,
	// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},
		download(item) {
			this.$emit('download', item);
		},
		    // 去往合同
    goContract() {
			let contractType = 'buy'
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
		// 入库详情
		goInDetail(item) {
			if(this.type == 'rest') {
				let path = `/center/logisticsPlatform/in/detail?id=${item.id}`
				window.open(path, '_blank')
			} else {
				let path = `/logisticsPlatform/in/detail?id=${item.id}`
				window.open(path, '_blank')
			}

		},

		viewPDF(item) {
			this.$emit('viewPDF', item);
		},
    downloadAll() {
      this.$emit('downloadAll');
    },
		downPDF(item) {
			this.$emit('download', item);
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
.indicator {
	/deep/ .ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
			width: 200px;
			max-width: 200px;
			height: 48px;
			padding: 0;
			padding-left: 10px;
		}
	/deep/	.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
			padding-left: 12px;
			padding-right: 12px;
			// width: 19%;
			width: inherit;
		}
	
}
.indicator2 {
		/deep/ .ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
			width: 160px;
			height: 48px;
			padding: 0;
			padding-left: 10px;
		}
	/deep/	.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
			padding-left: 12px;
			padding-right: 12px;
			width: 19%;
			// width: inherit;
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
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	// margin-left: 4px;
	background: #ffdbc8;
	color: #ff7937;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
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
.goods-tips {
  margin-top: 20px;
  font-size: 14px ;
  color: rgba(0, 0, 0, 0.4);
  span:nth-child(2n) {
     color: rgba(0, 0, 0, 0.8);
     font-weight: 600;
  }
}
</style>
