<template>
	<div
		class="new-detail"
		style="width: 100%"
	>
		<!-- 采购合同详情 -->
		<div class="new-detail-content detail-form">
			<h2>基本信息</h2>
			<a-row class="df">
				<a-form-item label="卖方">
					<a-input
						class="ipt"
						disabled
						v-model="info.sellCompanyName"
					></a-input>
				</a-form-item>
				<a-form-item label="买方">
					<a-input
						class="ipt"
						disabled
						v-model="info.buyCompanyName"
					></a-input>
				</a-form-item>
				<a-form-item label="钢材种类">
					<a-input
						class="ipt"
						disabled
						v-model="info.steelTypeDesc"
					></a-input>
				</a-form-item>
				<a-form-item label="合同模板">
					<a-input
						class="ipt"
						disabled
						v-model="info.contractTemplateDesc"
					></a-input>
				</a-form-item>
				<a-form-item label="业务类型">
					<a-input
						class="ipt"
						disabled
						v-model="info.businessTypeDesc"
					></a-input>
				</a-form-item>
				<a-form-item label="合同期限">
					<div class="fake-ipt">{{ info.effectiveStartDate }} - {{ info.effectiveEndDate }}</div>
				</a-form-item>
				<a-form-item
					label="交提货期限"
					v-if="['FINISHED_STEEL_SELL_005'].includes(info.contractTemplate)"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.takeDeliveryDeadline"
					></a-input>
				</a-form-item>
				<a-form-item
					label="交提货地点"
					v-if="['FINISHED_STEEL_SELL_002', 'FINISHED_STEEL_SELL_006'].includes(info.contractTemplate)"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.deliveryPlace"
					></a-input>
				</a-form-item>
				<a-form-item label="是否指定规格">
					<a-input
						class="ipt"
						disabled
						v-model="info.appointSpecDesc"
					></a-input>
				</a-form-item>
				<a-form-item label="合同签约地">
					<a-input
						class="ipt"
						disabled
						v-model="info.contractSignPlace"
					></a-input>
				</a-form-item>
				<a-form-item label="使用资金来源">
					<a-input
						class="ipt"
						disabled
						v-model="info.capitalSource"
					></a-input>
				</a-form-item>
				<a-form-item label="业务经理">
					<a-input
						class="ipt"
						disabled
						v-model="name"
					></a-input>
				</a-form-item>
				<a-form-item
					label="交提货方式"
					v-if="['FINISHED_STEEL_SELL_002', 'FINISHED_STEEL_SELL_006'].includes(info.contractTemplate)"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.deliveryModeDesc"
					></a-input>
				</a-form-item>
				<a-form-item
					label="其他"
					v-if="['OTHER_DELIVERY', 'OTHER'].includes(info.deliveryMode)"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.otherDeliveryMode"
					></a-input>
				</a-form-item>
				<a-form-item
					label="是否承兑业务"
					v-if="['FINISHED_STEEL_SELL_005', 'FINISHED_STEEL_SELL_007'].includes(info.contractTemplate)"
				>
					<div class="fake-ipt">{{ info.acceptancePayment == 1 ? '是' : '否' }}</div>
				</a-form-item>
				<a-form-item
					label="上游卖方企业名称"
					v-if="info.additionalCompanyName"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.additionalCompanyName"
					></a-input>
				</a-form-item>
				<a-form-item
					label="合同签订日期"
					v-if="info.contractSignDate"
				>
					<a-input
						class="ipt"
						disabled
						v-model="info.contractSignDate"
					></a-input>
				</a-form-item>
			</a-row>
		</div>
		<div class="new-detail-content detail-form">
			<h2>销售明细表</h2>
			<a-table
				:pagination="false"
				class="new-table"
				:columns="columns"
				:data-source="info.contractPurchaseList"
				:scroll="{ x: true }"
				rowKey="id"
			>
			</a-table>
		</div>
		<div class="new-detail-content detail-form">
			<a-row class="df">
				<a-form-item
					label="备注"
					v-if="info.remark"
				>
					<div class="fake-ipt">{{ info.remark }}</div>
				</a-form-item>
			</a-row>
		</div>
		<div class="new-detail-content detail-form">
			<h2>银行账户信息</h2>
			<a-row class="df">
				<a-form-item label="卖方账号">
					<div
						class="fake-ipt"
						disabled
					>
						{{ info.sellCompanyName }} {{ info.sellCompanyUscc }}
					</div>
				</a-form-item>
				<a-form-item label="开户行">
					<div class="fake-ipt">{{ info.sellCompanyName }}</div>
				</a-form-item>
				<a-form-item label="账号">
					<div class="fake-ipt">{{ info.sellBankNo }}</div>
				</a-form-item>
				<a-form-item label="买方账号">
					<div
						class="fake-ipt"
						disabled
					>
						{{ info.buyCompanyName }} {{ info.buyCompanyUscc }}
					</div>
				</a-form-item>
				<a-form-item label="开户行">
					<div class="fake-ipt">{{ info.buyCompanyName }}</div>
				</a-form-item>
				<a-form-item label="账号">
					<div class="fake-ipt">{{ info.buyBankNo }}</div>
				</a-form-item>
			</a-row>
		</div>
		<div
			class="new-detail-content detail-form"
			v-if="info.contractTemplate == 'FINISHED_STEEL_SELL_005'"
		>
			<h2>联系人信息</h2>
			<a-row class="df">
				<a-form-item label="甲方联系人">
					<div class="fake-ipt">{{ info.buyerContactName }}</div>
				</a-form-item>
				<a-form-item label="联系电话">
					<div class="fake-ipt">{{ info.buyerContactPhone }}</div>
				</a-form-item>
				<a-form-item label="微信">
					<div class="fake-ipt">{{ info.buyerWechatId }}</div>
				</a-form-item>
				<a-form-item label="联系邮箱">
					<div class="fake-ipt">{{ info.buyerContactEmail }}</div>
				</a-form-item>
				<a-form-item label="联系地址">
					<div class="fake-ipt">{{ info.buyerContactAddress }}</div>
				</a-form-item>
			</a-row>
			<a-row class="df">
				<a-form-item label="乙方联系人">
					<div class="fake-ipt">{{ info.sellerContactName }}</div>
				</a-form-item>
				<a-form-item label="联系电话">
					<div class="fake-ipt">{{ info.sellerContactPhone }}</div>
				</a-form-item>
				<a-form-item label="微信">
					<div class="fake-ipt">{{ info.buyerWechatId }}</div>
				</a-form-item>
				<a-form-item label="联系邮箱">
					<div class="fake-ipt">{{ info.sellerWechatId }}</div>
				</a-form-item>
				<a-form-item label="联系地址">
					<div class="fake-ipt">{{ info.sellerContactAddress }}</div>
				</a-form-item>
			</a-row>
		</div>
	</div>
</template>

<script>
const buyDetailsColumns2 = [
	{ title: '序号', customRender: (text, record, index) => `${index + 1}` },
	{ title: '品名', dataIndex: 'materialName', key: 'materialName' },
	{ title: '规格', dataIndex: 'specs', key: 'specs' },
	{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
	{ title: '产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin' },
	{ title: '件数', dataIndex: 'pieceQuantity', key: 'pieceQuantity' },
	{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
	{ title: '捆包号', dataIndex: 'baleNo', key: 'baleNo' },
	{ title: '理重', dataIndex: 'theoreticalWeight', key: 'theoreticalWeight' },
	{ title: '计量方式', dataIndex: 'metrologyWay', key: 'metrologyWay' },
	{ title: '含税单价（元/吨）', dataIndex: 'presetUnitPrice', key: 'presetUnitPrice' },
	{ title: '不含税单价（元/吨）', dataIndex: 'test3', key: 'test3' },
	{ title: '含税金额', dataIndex: 'test4', key: 'test4', fixed: 'right' }
];
import contract from '../../../mixins/contract.js';
export default {
	props: {
		info: {
			default: () => {}
		}
	},
	mixins: [contract],
	data() {
		return {};
	},
	computed: {
		columns() {
			return buyDetailsColumns2;
		},
		name() {
			const item = this.traderList.find(el => el.userId == this.info.assetTeamTraderId) || {};
			return `${item.realname} ${item.phone}`;
		}
	},
	mounted() {
		this.handleSearchTrader();
	},
	methods: {},
	components: {}
};
</script>

<style scoped lang="less">
.ipt {
	width: 310px;
	height: 40px;
	background: #f0f3fb;
	border-radius: 6px;
	font-size: 14px;
	color: #8495aa;
	border: 0;
}
.fake-ipt {
	width: 310px;
	height: 40px;
	background: #f0f3fb;
	border-radius: 6px;
	font-size: 14px;
	color: #8495aa;
	border: 0;
	padding: 4px 11px;
	display: flex;
	align-items: center;
}
.df {
	display: flex;
	flex-wrap: wrap;
	/deep/ .ant-form-item {
		width: 33%;
	}
}
</style>
