<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
				style="margin-bottom: 0"
			>
				收货信息详情
			</div>
			<div
				class="sub-title"
				style="margin-bottom: 20px"
			>
				合同信息
			</div>
			<ContractGl
				:disabled="disabled"
				:contractVo="contractVo"
			/>
			<div
				class="sub-title"
				style="margin: 20px 0"
			>
				发货信息
			</div>
			<DeliverInfo
				:isDetail="true"
				:deliverList="deliverList"
				:contractVo="contractVo"
				:deliverId="deliverId"
				disabled
			/>
			<div
				class="sub-title"
				style="margin: 20px 0"
			>
				收货信息
			</div>
			<a-table
				:columns="shColumns"
				class="new-table sh-table"
				:bordered="false"
				:scroll="{ x: true }"
				:dataSource="receiveList"
				:pagination="false"
			>
				<div
					slot="fileInfoList"
					slot-scope="text, record"
				>
					<span
						v-for="(item, index) in text"
						@click="fileLook(item)"
						:key="index"
						class="fileName"
					>
						<a-tooltip
							:title="item.typeName"
							placement="topLeft"
						>
							<a>
								{{ item.name }}
							</a>
						</a-tooltip>
					</span>
				</div>
				<div
					slot="receiveType"
					slot-scope="text, record"
				>
					<span v-if="text == 1">部分收货</span>
					<span v-if="text == 2">全部收货</span>
					<span v-if="text == 3">全部收货(本次收货数量为0)</span>
				</div>
			</a-table>
			<FileLook ref="fileLook"></FileLook>
		</a-card>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractGl from '@/v2/center/trade/views/receive/components/ContractGl';
import DeliverInfo from '@/v2/center/trade/views/receive/components/DeliverInfo';
import { API_getReceiveRecordInfo } from '@/v2/center/trade/api/receive';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import FileLook from './components/FileLook';

// 普通业务类型收货
const shCommonColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
	{
		title: '关联发货批次',
		dataIndex: 'deliverNo',
		key: 'deliverNo',
		scopedSlots: { customRender: 'deliverNo' }
	},
	{
		title: '收货方式',
		dataIndex: 'receiveType',
		key: 'receiveType',
		scopedSlots: { customRender: 'receiveType' }
	},
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
	{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{
		title: '附件',
		dataIndex: 'fileInfoList',
		key: 'fileInfoList',
		width: 300,
		scopedSlots: { customRender: 'fileInfoList' }
	}
];
// 标准仓押的收货信息
const shWarehouseColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
	{
		title: '关联发货批次',
		dataIndex: 'deliverNo',
		key: 'deliverNo',
		scopedSlots: { customRender: 'deliverNo' }
	},
	{
		title: '收货方式',
		dataIndex: 'receiveType',
		key: 'receiveType',
		scopedSlots: { customRender: 'receiveType' }
	},
	{ title: '货物是否入库', dataIndex: 'inStoraged', key: 'inStoraged', customRender: t => (t ? '是' : '否') },
	{ title: '站台', dataIndex: 'stationName', key: 'stationName', customRender: t => t || '-' },

	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
	{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{ title: '品名', dataIndex: 'goodsName', key: 'goodsName', customRender: t => t || '-' },

	{
		title: '附件',
		dataIndex: 'fileInfoList',
		key: 'fileInfoList',
		width: 300,
		scopedSlots: { customRender: 'fileInfoList' },
		fixed: 'right'
	}
];
export default {
	data() {
		return {
			contractVo: {},
			attachments: [],
			disabled: true,
			dataSource: [],
			receiveList: [],
			deliverList: [],
			deliverId: this.$route.query.deliverId
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		DeliverInfo,
		FileLook
	},
	mounted() {
		this.init();
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		shColumns() {
			if (this.contractVo.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE') {
				return shWarehouseColumns;
			}
			return shCommonColumns;
		}
	},
	methods: {
		init() {
			API_getReceiveRecordInfo({ receiveId: this.$route.query.receiveId, deliverId: this.$route.query.deliverId }).then(res => {
				if (res.success) {
					this.contractVo = res.result.contractVo;
					this.deliverList = res.result.deliverList;
					this.receiveList = res.result.receiveList;
				}
			});
		},
		fileLook(data) {
			this.$refs.fileLook.fileLook(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');

.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
.fileName {
	border-right: 1px solid #e9effc;
	display: inline-block;
	height: 20px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 48%;
	&:nth-child(2n + 2) {
		border-right: 0;
		padding-left: 10%;
	}
	&:last-child {
		border-right: 0;
	}
}
/deep/ .sh-table .ant-table td {
	&:last-child {
		white-space: break-spaces;
	}
}
</style>
