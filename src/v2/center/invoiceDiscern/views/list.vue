<template>
	<div class="content">
		<div class="tabs-box">
			<div style="display: flex">
				<div
					class="tabs-box-item"
					:class="{ active: item.value == tabValue }"
					@click="changeTab(item.value)"
					v-for="item in tabsList"
					:key="item.value"
				>
					{{ item.label }}
				</div>
			</div>
			<a-button
				class="add-btn"
				type="primary"
				@click="add"
				>新增发票</a-button
			>
		</div>

		<div>
			<InvoiceDetailList v-if="tabValue == 1"></InvoiceDetailList>
			<InvoiceList v-else></InvoiceList>
		</div>
	</div>
</template>

<script>
import InvoiceDetailList from '../components/InvoiceDetailList.vue';
import InvoiceList from '../components/InvoiceList.vue';

export default {
	mixins: [],
	data() {
		return {
			defaultParams: {
				type: 'OUTPUT',
				industryType: 'STEEL'
			},
			tabsList: [
				{ value: '1', label: '发票明细' },
				{ value: '2', label: '发票' }
			],
			tabValue: '1'
		};
	},
	computed: {},

	mounted() {},
	methods: {
		changeTab(value) {
			this.tabValue = value;
		},
		add() {
			this.$router.push({
				path: '/invoice/discern/add'
			});
		}
	},
	components: {
		InvoiceDetailList,
		InvoiceList
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.content {
	// margin: 20px;

	padding: 20px 30px;
	min-height: 100%;
	background: #fff;
	box-sizing: border-box;
	padding-bottom: 0;
	.tabs-box {
		display: flex;
		align-items: center;
		width: 224px;
		color: #4682f3;
		border-radius: 4px;
		margin-bottom: 12px;
		justify-content: space-between;
		position: relative;
		width: 100%;

		&-item {
			width: 112px;
			// flex: 1;

			text-align: center;
			background: #fff;
			border: 1px solid var(--vi, #4682f3);
			height: 38px;
			line-height: 38px;

			cursor: pointer;
			&.active {
				fill: var(--vi, #4682f3);
				background: #4682f3;
				color: #fff;
				border: 0;
			}
		}
		div:first-child {
			border-radius: 4px 0 0 4px;
		}
		div:last-child {
			border-radius: 0px 4px 4px 0px;
		}
	}
	.add-btn {
		position: relative;
		bottom: -5px;
		right: 0;
		width: 94px;
	}
}
</style>
