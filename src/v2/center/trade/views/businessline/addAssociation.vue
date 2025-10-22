<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<template v-if="type=='buy'">
			<a-card :bordered="false">
				<div class="slTitle"><span>采购合同信息</span></div>
				<div class="line"></div>
				<ContractInfo
					:contractInfo="contractInfo"
					:isCurrentSelect="false"
					@goContractDetail="goContractBuyDetail"
				></ContractInfo>

			</a-card>
			<div class="bg"></div>
			<a-card
				:bordered="false"
				style="padding-bottom: 60px"
			>
	
				<LinkSellContract @select="getSellSelectInfo" :buyContractInfo='contractInfo'></LinkSellContract>
			</a-card>
		</template>
		<template v-if="type=='sell'">

			
			<a-card
				:bordered="false"
				style="padding-bottom: 60px"
			>
				<div class="slTitle"><span>销售合同信息</span></div>
				<div class="line"></div>
				<ContractInfo
					:contractInfo="contractInfo"
					:isCurrentSelect="false"
					@goContractDetail="goContractSellDetail"
				></ContractInfo>
				
			</a-card>
			<div class="bg"></div>
			<a-card :bordered="false">

				<LinkBuyContract @select="getBuySelectInfo"  :sellContractInfo='contractInfo'></LinkBuyContract>
			</a-card>
		</template>

		<div class="slDetailBottom">
			<div>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					style="margin-right: 30px"
					ghost
					>取消</a-button
				>
				<a-button
					type="primary"
					class="submit-btn"
					:disabled="!selectBuyContractList.length && !selectSellContractList.length"
					@click="submit"
					>提交</a-button
				>
			</div>
		</div>
		<DelModal
			ref="tipModal"
			tip="提交后，该采销合同将生成业务线。确认提交吗？"
			title="确认提交"
			@ok="confirmSave"
		></DelModal>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import LinkBuyContract from './components/LinkBuyContract.vue';
import LinkSellContract from './components/LinkSellContract.vue';
import DelModal from '@sub/components/DelModal.vue';

import { saveContractRel } from '@/v2/center/trade/api/businessLine';
import ContractInfo from './components/ContractInfo.vue'

export default {
	data() {
		return {
			buyContractInfo: {},
			selectBuyContractList: [],
			selectSellContractList: [],

			sellContractInfo: {}
		};
	},
	computed: {
		type() {
			return this.$route.query.type
		},
		contractInfo() {
			return this.$store.state.business.VUEX_RELATION_CONTRACT || {};
		}
	},
	methods: {
		submit() {
			if (!this.selectBuyContractList.length && this.$route.query.type == 'sell') {
				this.$message.error('请选择关联的销售合同');
				return;
			}
			if (!this.selectSellContractList.length && this.$route.query.type == 'buy') {
				this.$message.error('请选择关联的采购合同');
				return;
			}
			this.$refs.tipModal.open();
		},
		getBuySelectInfo(list) {
			this.selectBuyContractList = list
			// this.buyContractInfo = info;
		},
		getSellSelectInfo(list) {
			// console.log(info, 'getSellSelectInfo---------');
			// this.sellContractInfo = info;
			this.selectSellContractList = list;
		},
		goContractBuyDetail() {
			let path = `/center/contract/buy/online/detail?type=BUY`;
			if (this.contractInfo.paperContractNo) {
				path = `/center/contract/buy/offline/detail?id=&type=buy`;
			}
			let routerData = this.$router.resolve({
				path: path,
				query: {
					id: this.contractInfo.orderId || this.contractInfo.id,
					type: 'buy'
				}
			});
			window.open(routerData.href, '_blank');
		},
		goContractSellDetail() {
			let path = `/center/contract/sell/online/detail?type=SELL`;
			if (this.contractInfo.paperContractNo) {
				path = `/center/contract/sell/offline/detail?id=&type=sell`;
			}
			let routerData = this.$router.resolve({
				path: path,
				query: {
					id: this.contractInfo.orderId || this.contractInfo.id,
					type: 'sell'
				}
			});
			window.open(routerData.href, '_blank');
		},

		async confirmSave() {
		


			const relatedContractReqList = this.selectBuyContractList.length ? this.selectBuyContractList : this.selectSellContractList
			const params = {
				contractNo: this.contractInfo.contractNo,
				onlineFlag: this.contractInfo.paperContractNo ? false : true,
				relatedContractReqList: relatedContractReqList.map(el => {
					return {
						relateContractNo: el.contractNo,
						onlineFlag: el.paperContractNo ? false: true
					}
				})
			}
			await saveContractRel(params);
			this.$message.success('已生成业务线');
			this.$router.push({ path: '/center/businessline/list' });
			// this.$router.go(-1)
		}
	},
	components: {
		Breadcrumb,
		LinkBuyContract,
		LinkSellContract,
		ContractInfo,
		DelModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.line {
	background: #e5e6eb;
	height: 1px;
	width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
}
.bg {
	width: 100%;
	background: #f3f5f6;
	height: 20px;
}

.slDetailBottom {
	width: calc(100% - 238px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.submit-btn[disabled] {
		border: 0;
	}
}
</style>
