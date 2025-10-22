<template>
	<div>

		<TopTip :detailData='detailData' :activeMore='activeMore'></TopTip>
		<div class="slTitleAssis"><span>汇总统计</span></div>
		<div class="collect">
			<div class="collect-item">
				<div class="collect-item-top">
					<div class="collect-item-title">上游总合同量</div>
					<div class="collect-item-money">{{ formatMoney(upSummary.contractQuantity || 0) }}吨</div>
				</div>
				<div class="collect-item-bot">
					<div class="collect-item-title">上游总发运量</div>
					<div class="collect-item-money">{{ formatMoney(upSummary.deliveryQuantity || 0) }}吨</div>
				</div>
			</div>
			<div class="collect-item">
				<div class="collect-item-top">
					<div class="collect-item-title">上游总付款</div>
					<div class="collect-item-money">{{ formatMoney(upSummary.payAmount || 0) }}元</div>
				</div>
				<div class="collect-item-bot">
					<div class="collect-item-title">下游总回款</div>
					<div class="collect-item-money">{{ formatMoney(downSummary.receiveAmount || 0) }}元</div>
				</div>
			</div>
			<div class="collect-item">
				<div class="collect-item-top">
					<div class="collect-item-title">上游总结算</div>
					<div class="collect-item-money">{{ formatMoney(upSummary.settleQuantity || 0) }}吨 | {{ formatMoney(upSummary.settleAmount || 0) }}元 </div>
				</div>
				<div class="collect-item-bot">
					<div class="collect-item-title">下游游总结算</div>
					<div class="collect-item-money">{{ formatMoney(downSummary.settleQuantity || 0) }}吨 | {{ formatMoney(downSummary.settleAmount || 0) }}元</div>
				</div>
			</div>
			<div class="collect-item">
				<div class="collect-item-top">
					<div class="collect-item-title">上游总开票</div>
					<div class="collect-item-money">{{ formatMoney(upSummary.invoiceAmount || 0) }}元</div>
				</div>
				<div class="collect-item-bot">
					<div class="collect-item-title">下游总开票</div>
					<div class="collect-item-money">{{ formatMoney(downSummary.invoiceAmount || 0) }}元</div>
				</div>
			</div>
		</div>
    <div class="content">

      <!-- <MoreBusinessBaseInfo></MoreBusinessBaseInfo> -->
			<!-- 一对多 -->
			<template v-if="activeMore =='ONE_TO_MORE'">
				<MoreBusinessRight :detailData='detailData' :activeMore='activeMore' @selectDown='selectDown' @selectUp='selectUp' ></MoreBusinessRight>
      	<MoreBusinessBaseInfo  :detailData='detailData' :selectItem='selectDownInfo'  :type='type'></MoreBusinessBaseInfo>
			</template>
			<!-- 多对一 -->
			<template v-if="activeMore =='MORE_TO_ONE'">
      	<MoreBusinessBaseInfo   :detailData='detailData' :selectItem='selectUpInfo' :type='type'></MoreBusinessBaseInfo>
				<MoreBusinessRight  :detailData='detailData' :activeMore='activeMore' @selectDown='selectDown' @selectUp='selectUp'></MoreBusinessRight>
			</template>
     
      <!-- <a-row type="flex" style="with:100%">
        <a-col :flex='1'>
           <MoreBusinessRight></MoreBusinessRight>
        </a-col>
        <a-col flex="0 1 368px"> <MoreBusinessBaseInfo ></MoreBusinessBaseInfo></a-col>
      </a-row>
      -->
     
    </div>
	</div>
</template>

<script>
import TopTip from './TopTip.vue';
import MoreBusinessBaseInfo from './MoreBusinessBaseInfo.vue'
import MoreBusinessRight from './MoreBusinessRight.vue'
import { formatMoney } from '@sub/filters';

export default {
	props: {
		detailData: {
			default: () =>{ return {
				downSummary: {},
				upSummary: {},
			}}
		},
		activeMore: {
			default: ''
		},
		type: {
      default: 'rest',
    }
	},
	data() {
		return {
			selectUpInfo: {},
			selectDownInfo: {},
		};
	},
	computed: {
		// 判断当前是一对多还是多对一
		upSummary() {
			if(this.activeMore == 'ONE_TO_MORE') {
				const upContractNo = this.detailData.upContractNo 
				const item = this.detailData.upBusinessLineList.find(el => el.upContractNo == upContractNo)  || {}
				return item.upSummary || {}
			}
			return this.detailData.upSummary || {}
		},
		downSummary() {
			if(this.activeMore == 'MORE_TO_ONE') {
				const downContractNo = this.detailData.downContractNo 
				const item = this.detailData.downBusinessLineList.find(el => el.downContractNo == downContractNo)  || {}
				return item.downSummary || {}
			}
			return this.detailData.downSummary || {}
		}
	},
	mounted() {

	},
	methods: {
		formatMoney,
		selectDown(item) {
			this.selectDownInfo = item;
		},
		selectUp(item) {
			this.selectUpInfo = item;
		}
	},
	components: {
		TopTip,
    MoreBusinessBaseInfo,
    MoreBusinessRight,
	}
};
</script>

<style scoped lang="less">
.content {
  display: flex;
  margin-top: 20px;
  border-radius: 4px;
}
.collect {
	margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
	&-item {
		width: 388px;
		height: 156px;
		border-radius: 4px;
		// padding: 20px 0 20px 20px;
    margin-right: 20px;
		padding-left: 20px;
		background-color: #ebfaef;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		&:last-child {
			margin-right: 0;
		}
		&-top {
			border-bottom: 1px solid #dff0e3;
			padding-bottom: 10px;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		&-bot {
			padding-top: 10px;
			flex: 1;
			display: flex;
			flex-direction: column;
			// justify-content: flex-end;
		}
		&-title {
			color: rgba(0, 0, 0, 0.4);
			margin-bottom: 8px;
		}

		&-money {
			color: rgba(0, 0, 0, 0.8);
			font-size: 16px;
			font-weight: 600;
		}
	}
}
</style>
