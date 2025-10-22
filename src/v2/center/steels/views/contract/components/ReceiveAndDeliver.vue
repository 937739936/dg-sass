<template>
	<div
		style="width: 100%"
		class="new-detail"
	>
		<div class="new-detail-content detail-form">
			<h2>发运统计</h2>
			<template v-if="info.statisticsShipment">
				<div
					id="shippingChart"
					style="height: 400px; width: 100%"
				></div>
			</template>
			<div v-else>暂无数据</div>
			<h2>发运详情</h2>
			<div class="record-list">
				<template v-if="info.statisticsShipment && info.statisticsShipment.shipmentList">
					<div
						class="list-block"
						v-for="(item, index) in info.statisticsShipment.shipmentList"
						:key="index"
					>
						<div class="list-head">
							<ul>
								<li>批次号：{{ item.shipmentNo }}</li>
								<li>发货日期：{{ item.shipmentDate }}</li>
							</ul>
						</div>
						<div class="list-content">
							<ul>
								<li class="w20">
									<p>{{ item.transportModeDesc }}</p>
								</li>
								<li class="w40">
									<p>发货数量(吨)：{{ item.quantity }}</p>
									<p v-if="item.status === 'RECEIVED'">收货数量（吨）：{{ item.receiptQuantity }}</p>
									<p v-if="item.status === 'RECEIVED'">收货日期：{{ item.receiptDate }}</p>
								</li>
								<li class="w20 txt-center status">
									<p
										class="status-wait"
										v-if="item.status === 'UNCOMMITTED'"
									>
										待提交
									</p>
									<p
										class="status-release-complete"
										v-if="item.status === 'SHIPPED'"
									>
										已发货
									</p>
									<p
										class="status-part"
										v-if="item.status === 'RECEIVED'"
									>
										已收货
									</p>
									<p
										class="status-receive-complete"
										v-if="item.status === 'INVALID'"
									>
										已作废
									</p>
								</li>
								<li class="w20 txt-center">
									<div v-if="type == 'rest'">
										<a
											v-if="item.status === 'RECEIVED'"
											:href="'/center/steels/receive/receipt/detail?deliverId=' + item.id"
											target="_new"
											>查看</a
										>
										<a
											v-if="item.status === 'SHIPPED'"
											:href="'/center/steels/receive/deliver/detail?deliverId=' + item.id"
											target="_new"
											>查看</a
										>
									</div>
									<div v-else>
										<a
											href="javascript:;"
											@click="viewDetail(item)"
											>查看</a
										>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</template>
				<div v-else>暂无数据</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		info: {},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {};
	},
	mounted() {
		this.$nextTick(() => {
			this.initShippingChart();
		});
	},
	methods: {
		initShippingChart() {
			this.$nextTick(() => {
				let myChart = this.$echarts.init(document.getElementById('shippingChart'));
				if (!this.info.statisticsShipment) return;
				let shippingInfo = this.info.statisticsShipment || {};
				// 运输类型为船运，展示字段不同
				let transDataSource = [
					[shippingInfo.contractQuantity, '合同数量（吨）'],
					[shippingInfo.receivedQuantity, '已收货数量（吨）'],
					[shippingInfo.notYetShippedQuantity, '未发货数量（吨）'],
					[shippingInfo.scheduledQuantity, '在途量（吨）']
				];
				myChart.setOption({
					grid: {
						left: '150px'
					},
					dataset: {
						source: transDataSource
					},
					xAxis: { name: '' },
					yAxis: {
						type: 'category'
					},
					color: '#3497ff',
					series: [
						{
							type: 'bar',
							encode: {
								// 可以定义 data 的哪个维度被编码成什么
								x: 'amount',
								y: 'product'
							},
							barWidth: '40px'
						}
					],
					tooltip: {
						show: true
					}
				});
			});
		},
		viewDetail(item) {
			this.$emit('viewDetail', item);
		}
	},
	components: {}
};
</script>

<style scoped></style>
