<template>
	<div class="com-accounting-detail">
		<div class="detail-wrapper">
			<a-tabs v-model="active">
				<a-tab-pane
					key="1"
					tab="货值总金额明细"
				/>
				<a-tab-pane
					key="2"
					tab="合同核算办法明细"
				/>
			</a-tabs>
			<div class="table-com-container">
				<total-amount-detail
					v-if="active === '1'"
					ref="totalAmountDetail"
					:indexList="evaluationIndexList"
					:detail="totalAmountDetail"
				/>
				<accounting-method-detail
					:selected="selected"
					:selectedOther="selectedOther"
					v-if="active === '2'"
					:detail="detail"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import TotalAmountDetail from './TotalAmountDetail';
import AccountingMethodDetail from './AccountingMethodDetail';
import { API_GetIndicatorTemplateAccountingDetail, API_GetIndicatorTemplateViewDetail } from '@/v2/center/steels/api';
export default {
	name: 'ComAccountingDetail',
	components: {
		TotalAmountDetail,
		AccountingMethodDetail
	},
	props: {
		// 初始化数据是从外部传入还是组建自己请求接口，false代表从外部传入,例如新建付款申请时数据从外部传入，查看付款申请时数据组件内部获取
		isSelfLoad: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			orderId: '',
			paymentId: '',
			selected: [],
			selectedOther: [],
			active: '1',
			detail: {},
			totalAmountDetail: {},
			evaluationIndexList: [], // 已选考核指标
			templateTypes: ['1', '2', '3', '4', '5', '6'], // 所有考核指标
			templateOtherTypes: ['7', '8', '9', '10', '11', '12'] // 所有其他考核指标
		};
	},
	methods: {
		init(data, totalAmountData) {
			this.active = '1';
			// 详情时，组件自己获取数据
			if (this.isSelfLoad) {
				this.getData();
				return false;
			} else {
				this.dealData(data, totalAmountData);
			}
		},
		// 获取初始化数据
		getData() {
			this.orderId = this.$route.query.orderId;
			this.paymentId = this.$route.query.id;
			if (!this.orderId || !this.paymentId) {
				return false;
			}
			API_GetIndicatorTemplateAccountingDetail({
				orderId: this.orderId
			}).then(res => {
				let accountingDetail = {};
				if (res.success) accountingDetail = res.data || {};
				API_GetIndicatorTemplateViewDetail({
					paymentId: this.paymentId
				}).then(resp => {
					let amountDetail = {};
					if (resp.success) amountDetail = resp.data || {};
					this.dealData(accountingDetail, amountDetail);
				});
			});
		},
		dealData(data, totalAmountData) {
			// 从外部组件传入数据
			let selected = [];
			let selectedOther = [];
			this.detail = Object.assign({}, data);
			this.totalAmountDetail = Object.assign({}, totalAmountData);
			let indicatorList = this.detail.indicatorList || [];
			indicatorList.forEach(item => {
				if (this.templateTypes.indexOf(item.type + '') > -1) {
					selected.push(item);
					this.evaluationIndexList.push(item.type + '');
				} // 考核指标
				if (this.templateOtherTypes.indexOf(item.type + '') > -1) {
					selectedOther.push(item);
				} // 其他考核指标
			});
			this.selected = selected;
			this.selectedOther = selectedOther;
			this.active = '1';
		}
	}
};
</script>
<style lang="less" scoped></style>
