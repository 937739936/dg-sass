<template>
	<div>
		<div class="info-desc">
			<p class="title">合同基本信息</p>
			<div class="info-wrap">
				<p>合同编号：{{ detailsData.upContractNo }}</p>
				<p>合同买方：{{ detailsData.sellerName }}</p>
				<p>合同卖方：{{ detailsData.buyerName }}</p>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">关联进项发票信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoice"
					:data-source="detailsData.buyInvoiceList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a-button
							type="link"
							@click="detailsIn(scoped)"
							>查看</a-button
						>
					</span>
				</a-table>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">关联运费发票信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoiceTrans"
					:data-source="detailsData.deliverInvoiceList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a-button
							type="link"
							@click="detailsTrans(scoped)"
							>查看</a-button
						>
					</span>
				</a-table>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">关联销售合同信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoiceSell"
					:data-source="detailsData.downContractList"
					:pagination="false"
					rowKey="key"
				>
					<span
						slot="action"
						slot-scope="text, scoped"
					>
						<a-button
							type="link"
							@click="detailsSellContract(scoped)"
							>查看</a-button
						>
					</span>
				</a-table>
			</div>
		</div>
		<div class="info-desc margin-top-20">
			<p class="title">下游开具销项发票信息</p>
			<div class="new-table margin-top-20">
				<a-table
					:columns="columnsInvoiceDown"
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
import { columnsInvoice, columnsInvoiceTrans, columnsInvoiceSell, columnsInvoiceDown } from './table';
import OutDetails from '../../components/outDetails.vue';
import { API_BUY_CONTRACT_DETAIL } from '@/v2/center/invoiceTools/api';
import { cloneDeep } from 'lodash';

export default {
	data() {
		return {
			columnsInvoice,
			columnsInvoiceTrans,
			columnsInvoiceSell,
			columnsInvoiceDown,
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
		detailsIn(item) {
			this.$router.push({
				path: '/center/admin/invoice/in/detail',
				query: {
					id: item.id
				}
			});
		},
		detailsTrans(item) {
			this.$router.push({
				path: '/center/admin/invoice/transport/add/detail',
				query: {
					id: item.id
				}
			});
		},
		detailsSellContract(item) {
			this.$router.push({
				path: '/center/admin/invoice/contract/sell/detail',
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
			API_BUY_CONTRACT_DETAIL({
				upContractNo: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detailsData = res.data;
					this.detailsData.buyInvoiceList = this.addKey(res.data.buyInvoiceList);
					this.detailsData.deliverInvoiceList = this.addKey(res.data.deliverInvoiceList);
					this.detailsData.downContractList = this.addKey(res.data.downContractList);
					this.detailsData.kitCommissionInfoList = this.addKey(res.data.kitCommissionInfoList);
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
