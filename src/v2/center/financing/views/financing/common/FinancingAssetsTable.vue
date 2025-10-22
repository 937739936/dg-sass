<template>
	<div class="rz-content">
		<div class="title">资产信息</div>
		<a-row>
			<a-table
				rowKey="receivableSerialNo"
				:columns="rongzi"
				:dataSource="rongziDataSource"
				:pagination="false"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
				<div
					slot="modifySerialNo"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="openChangeAssets(record)"
						>{{ text }}</a
					>
				</div>
				<div
					slot="receivableSerialNo"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="openAssets(record)"
						>{{ text }}</a
					>
				</div>
			</a-table>
		</a-row>
	</div>
</template>

<script>
import { API_FinancingJRDetail } from '@/v2/center/financing/api/index.js';

export default {
	name: 'FinancingAssetsTable',
	data() {
		return {
			rongziDataSource: [],
			rongzi: [
				{
					title: '应收账款流水号',
					dataIndex: 'receivableSerialNo',
					scopedSlots: { customRender: 'receivableSerialNo' }
				},
				{
					title: '买方名称',
					dataIndex: 'buyerName'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '应收账款金额',
					dataIndex: 'receivableAmount'
				},
				{
					title: '应收账款起始日期',
					dataIndex: 'beginDate'
				},
				{
					title: '应收账款到期日期',
					dataIndex: 'endDate'
				}
			]
		};
	},
	components: {},

	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/receivable/detail',
				query: {
					id: record.assetId,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		getDetail() {
			API_FinancingJRDetail({ financingApplyId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.rongziDataSource = [res.data];
				}
			});
		}
	}
};
</script>

<style lang="less">
.FinancingAudit {
	.downbtn {
		margin-bottom: 14px;
	}
	.ant-tabs-bar {
		background-color: #fff;
		margin-bottom: 0;
		border: none;
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	.ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	form .ant-form-item {
		margin-bottom: 24px;
	}
	margin: -20px;
	background-color: #f4f5f8;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
	}
	.ant-form-item-control {
		input,
		textarea {
			width: 254px;
		}
	}
	.textarea-wrap {
		textarea {
			width: 720px;
			text-align: left !important;
		}
	}
	.ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
