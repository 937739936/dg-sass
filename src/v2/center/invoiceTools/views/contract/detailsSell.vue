<template>
	<div>
		<div class="info-desc">
			<p class="title">合同基本信息</p>
			<div class="info-wrap">
				<p>合同编号：{{ detailsData.downContractNo }}</p>
				<p>合同买方：{{ detailsData.buyerName }}</p>
				<p>合同卖方：{{ detailsData.sellerName }}</p>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">关联销项发票信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoiceOut"
					:data-source="detailsData.kitCommissionInfoList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a-button
							type="link"
							@click="detailsOut(scoped)"
							>查看</a-button
						>
					</span>
				</a-table>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">关联采购合同信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoiceSell"
					:data-source="detailsData.upContractList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a-button
							type="link"
							@click="detailsBuy(scoped)"
							>查看</a-button
						>
					</span>
				</a-table>
			</div>
		</div>

		<div class="footer-wrap">
			<a-button
				type="primary"
				ghost
				@click="back"
			>
				返回
			</a-button>
		</div>
		<OutDetails
			ref="outDetails"
			:showEdit="false"
		/>
	</div>
</template>

<script>
import { columnsInvoiceOut, columnsInvoiceSell } from './table';
import OutDetails from '../../components/outDetails.vue';
import { API_SELL_CONTRACT_DETAIL } from '@/v2/center/invoiceTools/api';
import { cloneDeep } from 'lodash';

export default {
	data() {
		return {
			columnsInvoiceOut,
			columnsInvoiceSell,
			detailsData: {}
		};
	},
	components: {
		OutDetails
	},
	methods: {
		back() {
			this.$router.back();
		},
		detailsBuy(item) {
			this.$router.push({
				path: '/center/admin/invoice/contract/buy/detail',
				query: {
					id: item.contractNo
				}
			});
		},
		detailsOut(item) {
			this.$refs.outDetails.showModal(item);
		},
		addKey(list) {
			const cloneList = cloneDeep(list);
			cloneList?.forEach((item, index) => {
				item.key = ++index;
			});
			return cloneList;
		},
		fetchData() {
			API_SELL_CONTRACT_DETAIL({
				downContractNo: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detailsData = res.data;
					this.detailsData.kitCommissionInfoList = this.addKey(res.data.kitCommissionInfoList);
					this.detailsData.upContractList = this.addKey(res.data.upContractList);
				}
			});
		}
	},
	mounted() {
		this.fetchData();
	}
};
</script>

<style lang="less" scoped>
.title {
	width: 100%;
	height: 24px;
	font-size: 16px;
	font-family:
		PingFangSC-Medium,
		PingFang SC;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 24px;
	padding-left: 16px;
	position: relative;
}
.title::before {
	content: '';
	width: 2px;
	height: 16px;
	background: #4682f3;
	display: inline-block;
	position: absolute;
	top: 4px;
	left: 0;
}
.info-wrap {
	width: 100%;
	height: 122px;
	background: #f5f7fd;
	border-radius: 10px;
	padding: 30px 20px 30px 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: 20px;
	p {
		width: 33.33%;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 20px;
	}
}
.margin-top-20 {
	margin-top: 30px;
}
.footer-wrap {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
}
</style>
