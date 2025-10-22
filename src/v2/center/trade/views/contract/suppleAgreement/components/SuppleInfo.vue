<template>
	<div class="supple-info-box">
		<p class="title">对原合同价格、数量、发站、托运人等补充约定</p>
		<a-table
			:columns="agreementColumns"
			class="new-table"
			:bordered="false"
			rowKey="id"
			:dataSource="detailInfo.changeItems"
			:pagination="false"
			:scroll="{ x: true }"
		>
			<template
				slot="fieldCName"
				slot-scope="text, record"
			>
				{{ text }}
				<span
					v-if="record.fieldName === 'deliveryDate'"
					style="position: relative; top: 1px"
				>
					<div
						v-show="detailInfo.contractTermType === 'LONG_TERM_CONTRACT'"
						class="LONG_TERM_CONTRACT"
					>
						<span class="text">长协</span>
					</div>
				</span>
			</template>
			<template
				slot="itemDetailsOld"
				slot-scope="text, record"
			>
				<ChangeItem
					:info="record"
					:contractInfo="contractInfo"
					type="oldValue"
				></ChangeItem>
			</template>
			<template
				slot="itemDetails"
				slot-scope="text, record"
			>
				<ChangeItem
					:info="record"
					:contractInfo="contractInfo"
					type="value"
				></ChangeItem>
			</template>
		</a-table>
		<p class="title">其他事项补充约定</p>
		<div
			v-html="detailInfo.signContent"
			class="other-info"
			v-if="detailInfo.signContent"
		></div>
		<div
			class="other-info2"
			v-else
		>
			<img
				src="@/v2/assets/imgs/contract/empty-img-simple.png"
				alt=""
			/>
			<p>暂无数据</p>
		</div>
	</div>
</template>

<script>
const agreementColumns = [
	{ title: '序号', dataIndex: 'serialNumber' },
	{ title: '字段名称', dataIndex: 'fieldCName', scopedSlots: { customRender: 'fieldCName' } },
	{ title: '基于原合同条款', dataIndex: 'regulation' },
	{ title: '变更前', dataIndex: 'itemDetailsOld', scopedSlots: { customRender: 'itemDetailsOld' } },
	{ title: '变更后', dataIndex: 'itemDetails', scopedSlots: { customRender: 'itemDetails' } },
	{ title: '变更说明', dataIndex: 'description', fixed: 'right', width: 150 }
];
import ChangeItem from './ChangeItem.vue';
export default {
	props: {
		detailInfo: {
			default: () => {
				return {};
			}
		},
		contractInfo: {
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			agreementColumns
		};
	},
	methods: {},
	components: {
		ChangeItem
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.supple-info-box {
	width: 100%;
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-size: 14px;
		font-weight: 600;
		margin-top: 30px;
		margin-bottom: 10px;
	}
	.other-info,
	.other-info2 {
		border-radius: 4px;
		border: 1px solid var(--line, #e5e6eb);
		background: #fff;
		padding: 12px;
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		box-sizing: border-box;
		min-height: 124px;
	}
	.other-info2 {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: var(--character-disabled-placeholder-25, rgba(0, 0, 0, 0.25));
		img {
			width: 64px;
		}
	}
	.new-table {
		/deep/ .ant-table-thead > tr {
			background: #f3f5f6;
		}
	}
}
.other-info {
	/deep/ table {
		margin-right: auto;
		margin-left: auto;
		width: 100%;
		font-size: 14px;
		border-collapse: collapse;
		-fs-table-paginate: paginate;
		border-spacing: 0;
		// color:red;
	}
	/deep/ table.rich-table {
		border: 1px solid #000000;
	}
	/deep/ td {
		padding: 0;
		border: 1px solid #000000;
		line-height: 15px;
		font-size: 13px;
	}
	/deep/ td br {
		display: none;
	}
	/deep/ td p {
		padding: 0;
		margin: 0;
		text-align: center;
	}

	p {
		margin: 8px 0px;
		line-height: 24px;
		font-size: 14px;
		font-family:
			tahoma,
			arial,
			Hiragino Sans GB,
			Hiragino Sans GB W3,
			Microsoft Yahei;
	}
	.indent {
		text-indent: 2em;
	}
}
.LONG_TERM_CONTRACT {
	position: relative;
	margin-left: 10px;
	border-radius: 4px;
	border: 1px solid @primary-color;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	display: inline-block;
	.text {
		text-align: center;
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -2px;
		color: @primary-color;
	}
}
</style>
