<template>
	<div>
		<!-- 合同分为全在线模式、上游补录、下游补录 -->
		<a-row>
			<!--合同未完善--当前用户为下游负责人，可完善
          合同已完善--当前用户为下游负责人，可修改、查看
          合同已完善--当前用户不是下游负责人，只可查看-->
			<a-col span="6">
				<div class="tabs-bar">
					<div
						v-for="(item, index) in sideTabList"
						:key="index"
						@click="contentChange(item.value)"
					>
						<div class="tabs-icon">
							<img :src="item.icon" />
							<em v-if="index < sideTabList.length - 1"></em>
						</div>
						<div class="tabs-text">
							<p>{{ item.label }}</p>
							<span v-if="item.value === 0"> 签订日期：{{ dynamicMonitoringTransDetail.contractSignTime }} </span>
							<span
								v-if="
									dynamicMonitoringDetail[['latestDeliverDate', 'downstreamLatestDeliverDate'][contractType]] && item.value === 1
								"
							>
								最新更新时间：{{ dynamicMonitoringDetail[['latestDeliverDate', 'downstreamLatestDeliverDate'][contractType]] }}
							</span>
						</div>
						<img
							src="@/v2/assets/imgs/monitoring/arrow.png"
							class="arrow"
							v-show="contractContentActiveIndex === item.value"
						/>
					</div>
				</div>
			</a-col>
			<!-- 右侧数据展示模块 -->
			<a-col span="18">
				<template v-if="contractContentActiveIndex == 0">
					<template v-if="contractType == 5">
						<!-- 运输合同 -->
						<SupplementContractTrans
							:contractType="contractType"
							:orderNo="orderNo"
							:downOrderNo="dynamicMonitoringDetail.downOrderNo"
							:info="dynamicMonitoringDetail"
							:curUpstream="curUpstream"
							:transContractNo="transContractNo"
							@refresh="refreshDetail"
							ref="content"
						/>
					</template>
					<template v-else>
						<!-- 全在线模式合同 -->
						<ElectronicContract
							v-if="isElectronicContract"
							:contractType="contractType"
							:orderNo="orderNo"
							:downOrderNo="dynamicMonitoringDetail.downOrderNo"
							:curUpstream="curUpstream"
						/>
						<!-- 上下游合同 -->
						<SupplementContract
							v-else
							:contractType="contractType"
							:orderNo="orderNo"
							:downOrderNo="dynamicMonitoringDetail.downOrderNo"
							:dynamicMonitoringDetail="dynamicMonitoringDetail"
							:curUpstream="curUpstream"
							@refresh="refreshDetail"
							ref="content"
						/>
					</template>
				</template>

				<!-- 上游/下游合同 -->
				<template>
					<template v-if="contractContentActiveIndex === 1">
						<a-empty />
					</template>

					<template v-if="contractContentActiveIndex === 2">
						<CapitalTransFlow :transContractNo="transContractNo"></CapitalTransFlow>
						<!-- contractType==2业务线查看详情 activedCoverIndex 业务线查看详情才有这个参数，且上游为0 -->
						<!-- <a-empty /> -->
					</template>
					<SettlementListTrans
						v-if="contractContentActiveIndex === 3"
						:orderNo="orderNo"
						:contractNo="contractNo"
						:transContractNo="transContractNo"
						:curUpstream="curUpstream"
						:belongContractType="belongContractType"
						:contractType="contractType"
						:downOrderNo="dynamicMonitoringDetail.downOrderNo"
						:downOrderId="dynamicMonitoringDetail.downOrderId"
						:isElectronicContract="isElectronicContract"
						:dynamicMonitoringDetail="dynamicMonitoringDetail"
					/>
					<InvoiceListTrans
						v-if="contractContentActiveIndex === 4"
						:orderNo="orderNo"
						:curUpstream="curUpstream"
						:transContractNo="transContractNo"
						:belongContractType="belongContractType"
						:contractType="contractType"
						:dynamicMonitoringDetail="dynamicMonitoringDetail"
						:downOrderNo="dynamicMonitoringDetail.downOrderNo"
						:contractNo="contractNo"
					/>

					<template v-if="!isFinanceCompanyAndOnlineContract">
						<FileListTrans
							v-if="contractContentActiveIndex == 5"
							:isElectronicContract="isElectronicContract"
							:orderNo="orderNo"
							:contractNo="contractNo"
							:transContractNo="transContractNo"
							:curUpstream="curUpstream"
							:belongContractType="belongContractType"
							:contractType="contractType"
							:needAdd="true"
							:downOrderNo="dynamicMonitoringDetail.downOrderNo"
							:downOrderId="dynamicMonitoringDetail.downOrderId"
							:dynamicMonitoringDetail="dynamicMonitoringDetail"
							:contractId="dynamicMonitoringDetail.upOrderNo"
							:contractSerialNo="contractSerialNo"
						/>
					</template>
				</template>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import SupplementContract from './SupplementContract';
import SupplementContractTrans from './SupplementContractTrans';
import GoodsDelivery from './GoodsDelivery';
import SettlementListTrans from './SettlementListTrans';
import InvoiceListTrans from './InvoiceListTrans';
import CapitalFlow from './CapitalFlow';
import DownStreamSupplementCapitalFlow from './DownStreamSupplementCapitalFlow';
import FileListTrans from './FileListTrans';
import ElectronicContract from './ElectronicContract';
import ElectronicContractGoodsDelivery from './ElectronicContractGoodsDelivery';
import CapitalTransFlow from './CapitalTransFlow';

import contract from '@/v2/assets/imgs/monitoring/contract.png';
import delivery from '@/v2/assets/imgs/monitoring/delivery.png';
import payment from '@/v2/assets/imgs/monitoring/payment.png';
import settlement from '@/v2/assets/imgs/monitoring/settlement.png';
import invoice from '@/v2/assets/imgs/monitoring/invoice.png';
import file from '@/v2/assets/imgs/monitoring/file.png';

const sideTabList = [
	{ label: '合同签订', icon: contract, value: 0 },
	{ label: '货物运输', icon: delivery, value: 1 },
	// { label: "发运数据", icon: delivery, value: 1 },
	{ label: '资金流水', icon: payment, value: 2 },
	{ label: '结算单', icon: settlement, value: 3 },
	{ label: '发票', icon: invoice, value: 4 },
	{ label: '其他附件', icon: file, value: 5 }
];

export default {
	name: 'BusinessLineContract',
	components: {
		SupplementContract,
		SettlementListTrans,
		InvoiceListTrans,
		CapitalFlow,
		FileListTrans,
		GoodsDelivery,
		ElectronicContract,
		ElectronicContractGoodsDelivery,
		DownStreamSupplementCapitalFlow,
		SupplementContractTrans,
		CapitalTransFlow
	},
	props: [
		'orderNo',
		'upOrderNo',
		'contractNo',
		'dynamicMonitoringDetail',
		'canSubmitAudit',
		'contractSerialNo',
		'contractType', // 0-上游合同 1-下游合同 2-业务线查看详情页面（组建引用） 5-物流运输合同
		'curUpstream',
		'downOrderId',
		'belongContractType',
		'dynamicMonitoringTransDetail',
		'transContractNo'
	],
	data() {
		return {
			sideTabList: [...sideTabList],
			financeCompany: '',
			contractContentActiveIndex: +this.$route.query.contractContentActiveIndex || 0,
			businessLineType: this.$route.query.businessLineType,
			params: {},
			disabled: false, // 提交审核按钮的状态
			bingTerminalContract: '', // 最终合同
			terminalContractId: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否是电子合同
		isElectronicContract() {
			if (this.contractType == 5) {
				return false;
			}
			// 业务线查看
			if (this.contractType === 2) {
				if (this.businessLineType === 'ONLINE') {
					return true;
				}
				return false;
			}

			// 业务线监控
			if (this.businessLineType === 'ONLINE') {
				return true;
			}
			if (this.businessLineType === 'UP' && this.contractType === 1) {
				return true;
			}
			if (this.businessLineType === 'DOWN' && this.contractType === 0) {
				return true;
			}
			return false;
		},
		// 是金融机构并且是电子合同
		isFinanceCompanyAndOnlineContract() {
			if (this.financeCompany) {
				if (
					this.businessLineType === 'ONLINE' ||
					(this.contractType === 1 && this.businessLineType === 'UP') ||
					(this.contractType === 0 && this.businessLineType === 'DOWN')
				) {
					return true;
				}
				return false;
			}
			return false;
		},
		//获取当前展示的合同
		contractNoAt() {
			let contractNo;
			//如果不存在则在dynamicMonitoringDetail中提取
			if (this.contractType == 0) {
				//上游合同
				contractNo = this.dynamicMonitoringDetail.upContractNo;
			} else if (this.contractType == 1) {
				//下游合同
				contractNo = this.dynamicMonitoringDetail.downContractNo;
			} else {
				contractNo = this.contractNo.split(',')[this.$route.query.activedCoverIndex];
			}
			return contractNo;
		}
	},
	watch: {
		curUpstream() {
			if (this.curUpstream) {
				setTimeout(() => {
					this.contentChange(this.contractContentActiveIndex);
				});
			}
		},
		orderNo() {
			this.businessLineType = this.$route.query.businessLineType;
			this.handleSideTabList();
		},
		dynamicMonitoringTransDetail(val) {}
	},

	created() {
		this.handleSideTabList();
		this.contentChange(this.contractContentActiveIndex);
		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.financeCompany = companyType == 'FINANCIAL_ORG';
	},

	methods: {
		handleSideTabList() {
			let newSideTabList = [...sideTabList];
			//针对上下游均为补录的业务线数据，去掉原来的货物运输板块，新增“发运数据”板块('仅上游展示')
			if (this.businessLineType === 'OFFLINE') {
				newSideTabList = newSideTabList.filter(item => item.label !== '货物运输');
				if (
					this.contractType == 1 ||
					(this.$route.query.hasOwnProperty('activedCoverIndex') && this.$route.query.activedCoverIndex != 0)
				) {
					//下游
					newSideTabList = newSideTabList.filter(item => item.label !== '发运数据');
				}
			} else {
				newSideTabList = newSideTabList.filter(item => item.label !== '发运数据');
			}
			if (this.isFinanceCompanyAndOnlineContract) {
				newSideTabList = newSideTabList.filter(item => item.label !== '其他附件');
			}
			this.sideTabList = newSideTabList;
			//判断当前选中是否展示，如若没有，则展示第一个
			if (
				!this.sideTabList.find(item => {
					return item.value == this.contractContentActiveIndex;
				})
			) {
				this.contractContentActiveIndex = this.sideTabList[0].value;
			}
		},
		// 下游数据tabs切换
		contentChange(index) {
			const path =
				this.contractType === 2 ? '/center/monitoring/fullBusinessLine/detail' : '/center/monitoring/dynamicMonitoring/detail';
			if (+this.contractContentActiveIndex !== +index) {
				this.contractContentActiveIndex = index;
				this.$router.replace({
					path,
					query: {
						...this.$route.query,
						contractContentActiveIndex: index
					}
				});
			}
		},
		refreshDetail(data) {
			// 刷新详情数据和下游合同数据
			this.$emit('refresh', data);
		}
	}
};
</script>

<style lang="less" scoped>
.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar .arrow {
	width: 16px;
	height: 16px;
	float: right;
	margin: 2px 12px 0 0;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar .tabs-icon {
	margin-right: 10px;
	em {
		display: block;
		width: 1px;
		height: 36px;
		background: #0053db;
		border-radius: 1.5px 1.5px 0 0;
		margin: 5px 0 5px 6px;
	}
	img {
		width: 24px;
		height: 24px;
		margin-left: -5px;
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		font-size: 12px;
		color: #383a3f;
		line-height: 22px;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}
::v-deep.slick-list {
	padding-left: 20px;
	position: relative;
	top: -5px;
}
::v-deep.slick-slide {
	padding-right: 20px;
}
::v-deep.slick-dots {
	display: none !important;
}
::v-deep.ant-form-item {
	margin-bottom: 0;
	display: block;
}
::v-deep.ant-form-item-label > label {
	color: #6b6f76;
}
::v-deep.ant-form-item-children {
	color: #383a3f;
	display: inline-block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
</style>
