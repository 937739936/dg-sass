<template>
	<div class="sub-table-container">
		<div
			v-if="title"
			class="slTitleAssis"
		>
			{{ title }}
		</div>
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="receiveSerialNo"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template
					slot="LINK"
					slot-scope="text, record"
				>
					<a @click="openDetail(record)">{{ text }}</a>
				</template>
				<template
					slot="MONEY"
					slot-scope="text"
				>
					<NumberFormatView
						:value="text"
						:isShowMoneyTip="true"
					/>
				</template>
			</a-table>
			<TableStatisticalInfo
				v-if="dataSource.length > 0"
				:statisticsList="statisticsList"
			/>
			<div
				v-else
				class="statistical-empty"
			></div>
		</div>
	</div>
</template>
 
<script>
import TableStatisticalInfo from './TableStatisticalInfo.vue';
import NumberFormatView from '../NumberFormatView';

export default {
	// 付款对应业务线下游为线下合同时使用
	name: 'OffLineBusinessLineDownCollectTable',
	components: {
		NumberFormatView,
		TableStatisticalInfo
	},
	props: {
		title: {
			type: String,
			default: ''
		},
		collectionVO: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	computed: {
		collectionVONotEmpty() {
			return this.collectionVO || {};
		},
		dataSource() {
			return this.collectionVONotEmpty.collectionInfoList || [];
		},
		statisticsList() {
			let collectionVO = this.collectionVONotEmpty;
			return [
				{
					title: '累计回款金额',
					value: collectionVO.accumulateClaimedAmount,
					isMonetary: true // 是否是货币单位
				},
				{
					title: '其中累计认领保证金回款金额',
					value: collectionVO.accumulateClaimedMarginAmount,
					isMonetary: true // 是否是货币单位
				},
				{
					title: '累计认领货款回款金额',
					value: collectionVO.accumulateClaimedGoodsAmount,
					isMonetary: true // 是否是货币单位
				}
			];
		}
	},
	methods: {
		openDetail(record) {
			this.$emit('openNewTabPage', 'RETURNED_DETAIL', record);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '回款编号',
		dataIndex: 'receiveSerialNo',
		scopedSlots: {
			customRender: 'LINK'
		}
	},
	{
		title: '回款日期',
		dataIndex: 'receiveDate',
		customRender
	},
	{
		title: '回款类型',
		dataIndex: 'paymentTypeDesc',
		customRender
	},
	{
		title: '已认领金额',
		dataIndex: 'claimedAmount',
		scopedSlots: {
			customRender: 'MONEY'
		}
	}
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	.statistical-empty {
		height: 50px;
	}
	/deep/ .ant-table {
    td,
    th {
      white-space: nowrap;
      // text-overflow: ellipsis;
      // overflow: hidden;
    }
  }
}
</style>