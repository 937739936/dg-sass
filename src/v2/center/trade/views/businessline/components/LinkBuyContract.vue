<template>
	<div>
		<div class="slTitle">
			<span>采购合同信息</span>
			<a-button
				type="primary"
				class="btn"
				v-if="selectContactList.length"
				@click="open"
				>选择采购合同
		</a-button>
		</div>
		<div class="line"></div>
		<div class="select-box" v-if="selectContactList.length">
			
			<span class="select-box-title">已选择采购合同</span>
			<span v-for="item in selectContactList" :key="item.id" class="select-box-item">
				<span>{{item.paperContractNo || item.contractNo}}</span>
				<span class="del" @click="confirmDel(item)">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM8.41423 4.17195C8.80476 3.78143 9.43792 3.78143 9.82844 4.17195C10.219 4.56247 10.219 5.19564 9.82844 5.58616L8.41458 7.00003L9.82854 8.41399C10.2191 8.80451 10.2191 9.43768 9.82854 9.8282C9.43801 10.2187 8.80485 10.2187 8.41432 9.8282L7.00037 8.41424L5.5858 9.8288C5.19528 10.2193 4.56211 10.2193 4.17159 9.8288C3.78107 9.43828 3.78107 8.80512 4.17159 8.41459L5.58615 7.00003L4.17168 5.58556C3.78116 5.19504 3.78116 4.56187 4.17168 4.17135C4.56221 3.78082 5.19537 3.78082 5.5859 4.17135L7.00037 5.58582L8.41423 4.17195Z" fill="#8495AA"/>
					</svg>
				</span>
			</span>
			
		</div>
		<div
			class="no_contract"
			v-if="!selectContactList.length"
		>
			<a-button
				type="primary"
				class="btn"
				@click="open"
				>选择采购合同</a-button
			>
			<div class="tip">
				<p>如果采购合同不存在，可能原因：</p>
				<p>1.如果是电子采购合同，可能合同未完成双方签章，请双方签章后再进行操作</p>
				<p>
					2.如果是线下采购合同，可能合同尚未上传到系统，您可点击“<a
						href="javascript:;"
						class="underline"
						@click="goDownloadBuy"
						>新增线下采购合同</a
					>”进行上传
				</p>
			</div>
		</div>
		<template v-else>
			<div v-for="(contractInfo, i) in selectContactList" :key="i" >
				<ContractInfo
					:contractInfo="contractInfo"
					:isCurrentSelect="true"
					@goContractDetail="goContractDetail"
					@confirmDel="confirmDel"
				></ContractInfo>
				<div
					class="error"
					v-if="getWarnList(contractInfo).length"
				>
					<p class="title">所选的采销合同可能存在以下问题，如果你确定要继续关联，请忽略以下提示：</p>
					<p
						v-for="(item, i) in getWarnList(contractInfo)"
						:key="i"
					>
						<span> {{ i + 1 }}.</span>
						<span>{{ errorInfo[item.verifyEnum] }}</span>
						<a
							href="javascript:;"
							@click="goBusinessLineDetail(businessLine)"
							v-for="(businessLine, i2) in item.keywordInfoList"
						>
							{{ businessLine.businessLineNo }}
							{{ i2 == item.keywordInfoList.length - 1 ? '' : '、' }}
						</a>
					</p>
				</div>
			</div>
		</template>


		<RelationContract
			type="buy"
			ref="RelationContract"
			source="business"
			:relateOrderNo='relateOrderNo'
			@detail="getRelationOrderDetail"
			:relCompanyUscc="relCompanyUscc"
		/>
	</div>
</template>

<script>
import RelationContract from '@/v2/center/trade/views/contract/components/RelationContract.vue';
import ContractInfo from './ContractInfo.vue';
import { contractVerify } from '@/v2/center/trade/api/businessLine';
import { errorInfo } from './constant';



export default {
	props: {
		sellContractInfo:{
			default: () => {return {}}
		}
	},
	data() {
		return {
			// 是否是当前页面选择的合同信息
			isCurrentSelect: true,
			// 当前页面选择的合同
			currentContractInfo: {},
			errorInfo,
			warnList: [
					{verifyEnum: 'BUY_CONTRACT_NO'},
				{verifyEnum: 'BUY_CONTRACT_NO'},
				{verifyEnum: 'BUY_CONTRACT_NO'},
				{verifyEnum: 'BUY_CONTRACT_NO'},
				{verifyEnum: 'BUY_CONTRACT_NO'},
			],
			// 选择的采购合同
			selectContactList: [],
			warnList:[],
		};
	},
	computed: {
		

		// 获取选择的销售合同信息
		// sellContractInfo() {
		// 	return this.$store.state.business.VUEX_RELATION_CONTRACT;
		// },
		relateOrderNo() {
			return this.selectContactList.map(el=>el.paperContractNo || el.contractNo).join(',')
		},
		relCompanyUscc() {
			return this.sellContractInfo.buyerUscc;
		}
	},
	watch: {

	},
	methods: {
		open() {
			this.$refs.RelationContract.showRelationOrderList([...this.selectContactList]);
		},
		// 获取当前选择的合同信息
		async getRelationOrderDetail(list) {
			this.selectContactList = list
			this.$emit('select', this.selectContactList)
			let params = {
				contractNo: this.sellContractInfo.contractNo,
				onlineFlag: this.sellContractInfo.paperContractNo ? false : true,
				relatedContractReqList: this.selectContactList.map(el => {
					return {
						relateContractNo: el.contractNo,
						onlineFlag: el.paperContractNo ? false : true
					}
				})
			}

			const res = await contractVerify(params);
		
			this.warnList = res.data || [];
		},
		goDownloadBuy() {
			const query = {
				linkOrderNo: this.sellContractInfo.orderSerialNo || this.sellContractInfo.orderNo,
				linkContractNo: this.sellContractInfo.contractNo,
				linkOrderType: 'ONLINE',
				linkPaperContractNo: this.sellContractInfo.paperContractNo,
				disabled: true,
				type: 'buy',
				source: 'business'
			};
			this.$router.push({
				path: '/center/contract/buy/offline/add',
				query
			});
		},
		goContractDetail(item) {
			let path = `/center/contract/sell/online/detail?type=SELL`;
			if (item.paperContractNo) {
				path = `/center/contract/sell/offline/detail?id=&type=sell`;
			}
			let routerData = this.$router.resolve({
				path: path,
				query: {
					id: item.orderId || item.id,
					type: 'sell'
				}
			});
			window.open(routerData.href, '_blank');
		},
		// 去往业务线详情
		goBusinessLineDetail(item) {
			const routeData = this.$router.resolve({
				path: '/center/businessline/detail',
				query: {
					businessLineNo: item.businessLineNo
				}
			});
			window.open(routeData.href, '_blank');
		},
		confirmDel(info) {
			this.selectContactList = this.selectContactList.filter(el => el.id != info.id)
			this.$emit('select', this.selectContactList)
			
		},
		// 获取当前合同关联的告警信息
		 getWarnList(info) {
			let item = {verifyList: []}
			this.warnList.forEach(el => {
				if(el.contract && el.contract.contractId == info.id) {
					item = el
				}
			})
			return item.verifyList || []
		}
	},
	components: {
		RelationContract,
		ContractInfo,
	}
}

</script>

<style scoped lang="less">
.no_contract {
	.btn {
		display: inline-flex;
		padding: 9px 30px;
		align-items: center;
		gap: 10px;
		border-radius: 4px;
		background: @primary-color;
	}
	.tip {
		height: 90px;
		flex-shrink: 0;
		padding: 12px;
		border-radius: 4px;
		border: 1px solid #d0dfff;
		background: #e1eafe;
		border-radius: 5px;
		margin-top: 30px;
		p {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 12px;
			line-height: 22px; /* 183.333% */
		}
	}
	.underline {
		text-decoration: underline;
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
.transportBox {
	.textOverflow {
		height: 48px;
		line-height: 48px;
		left: 160px;
		padding: 0 10px;
	}
}
.curp {
	cursor: pointer;
	margin-left: 4px;
	position: absolute;
	top: 2px;
}
.omit {
	max-width: 85%;
	overflow: hidden;

	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
}
.error-box {
	padding-top: 0px;
	margin-top: -10px;
}
.error {
	border-radius: 4px;
	border: 1px solid #ffefc7;
	background: #fefcf2;
	padding: 12px;
	color: var(--text-40, rgba(0, 0, 0, 0.4));
	margin-top: 30px;
	margin-bottom: 30px;
	font-family: PingFang SC;
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 12px;
	}
}
.slTitle {
	font-size: 20px;
	color: rgba(0, 0, 0, 0.8);
	font-weight: 500;
	font-family: PingFangSC-Medium, PingFang SC;
		display: flex;
	justify-content: space-between
}
.line {
	background: #e5e6eb;
	height: 1px;
	width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
}
.select-box {
	font-size: 14px;
	margin-top: 25px;
	margin-bottom: 10px;
	&-title {
		color: #8495AA;
		margin-right: 12px;
	}
	&-item {
		height:32px;
		padding:0 12px ;
		background: #F3F5F6;
		border-radius: 4px;
		display: inline-block;
		line-height: 32px;
		margin-right: 12px;
		margin-bottom: 10px;
		.del {
			margin-left: 10px;
			position: relative;
			top: 2px;
			cursor: pointer;
		}
	}
}
</style>
