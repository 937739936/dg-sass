<template>
	<div
		class="slMain receiveRecordList"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>收货管理</span
				>
				<a-button
					type="primary"
					@click="goToApply"
					v-auth="'steel:shipmentReceipt:receipt:confirm'"
				>
					<div>收货确认</div>
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<div
				class="record-list"
				style="margin-top: 30px"
			>
				<a-table
					:pagination="false"
					:columns="columns"
					class="new-table"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
				>
					<span
						slot="downstreamCompanyAbbr"
						slot-scope="downstreamCompanyAbbr"
					>
						{{ downstreamCompanyAbbr || '-' }}
					</span>
					<span
						slot="receiveQuantity"
						slot-scope="receiveQuantity, item"
					>
						{{ item.quantity }}
					</span>

					<div
						slot="action"
						slot-scope="action, item"
						@click="onPageState"
					>
						<!-- 已发货、已收货状态下 -->
						<a
							v-auth="'steel:shipmentReceipt:receipt:detail'"
							@click.prevent="handleView(item)"
							>查看</a
						>
						<a
							v-auth="'steel:shipmentReceipt:receipt:changeStatus'"
							@click.prevent="changeStatus(item)"
							v-if="item.status === 'PORTION_RECEIVE'"
							>变更状态</a
						>
						<a
							v-auth="'steel:shipmentReceipt:receipt:changeStatus'"
							@click.prevent="undo(item)"
							v-if="item.showCancel"
							>撤销</a
						>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
			<ReceiptRecord
				ref="receiptRecord"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script lang="jsx">
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_SteelsReceiveList,
	API_SteelsReceiveChangeStatus,
	API_SteelsReceiveCancelShipment
} from '@/v2/center/steels/api/receive.js';
import { mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import ReceiptRecord from './components/ReceiptRecord.vue';

const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['shipmentNo'],
		addonBeforeTitle: '批次号',
		type: 'input',
		placeholder: '请输入批次号',
		allowClear: true
	},
	{
		decorator: ['sellCompanyName'],
		addonBeforeTitle: '卖方',
		type: 'input',
		placeholder: '请输入卖方',
		allowClear: true
	},
	{
		decorator: ['date'],
		addonBeforeTitle: '发货日期',
		realKey: ['shipmentStartDate', 'shipmentEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['date2'],
		addonBeforeTitle: '收货日期',
		realKey: ['receiptStartDate', 'receiptEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		addonBeforeTitle: '收货数量',
		decorator: ['total'],
		type: 'input-group',
		realKey: ['quantityLower', 'quantityUpper'],
		children: [
			{
				decorator: ['quantityLower'],
				addonBeforeTitle: '合同总数量'
			},
			{
				decorator: ['quantityUpper']
			}
		],
		midfix: '至',
		placeholder: '请输入',
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('shipmentStatus')
	},
	{
		decorator: ['steelType'],
		addonBeforeTitle: '钢材种类',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('steelType')
	},
	{
		decorator: ['goodsTransferFlag'],
		addonBeforeTitle: '货转标识',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('goodsTransferFlag')
	}
];

export default {
	name: 'DeliverList',
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			url: {
				list: API_SteelsReceiveList
			},
			flag: false,
			columns: [
				{ title: '发货批次号', dataIndex: 'shipmentNo' },
				{ title: '卖方名称', dataIndex: 'sellCompanyName' },
				// { title: '下游企业简称', dataIndex: 'downstreamCompanyAbbr', scopedSlots: { customRender: 'downstreamCompanyAbbr'},},
				{ title: '钢材种类', dataIndex: 'steelTypeDesc' },
				{ title: '货转开具标识', dataIndex: 'goodsTransferFlagDesc' },
				{ title: '收货日期', dataIndex: 'receiptDate' },
				{ title: '收货数量(吨)', dataIndex: 'receiptQuantity', customRender: text => text || '-' },
				{ title: '发货数量(吨)', dataIndex: 'quantity', align: 'center' },
				{ title: '发运方式', dataIndex: 'transportModeDesc' },
				{ title: '状态', dataIndex: 'statusDesc' },
				{ title: '合同编号', dataIndex: 'contractNo' },
				{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
			],
			resultList: [],
			params: {
				quantityLower: null,
				quantityUpper: null,
				shipmentStartDate: null,
				shipmentEndDate: null,
				receiptStartDate: null,
				receiptEndDate: null
			},
			deliverDate: null,
			receiveDate: null,
			pagination: {
				type: 'SteelsReceiveList',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		ReceiptRecord
	},
	computed: {},
	mounted() {},
	methods: {
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			// Object.assign(this.searchParams, info)
			this.getList();
		},
		undo({ id }) {
			this.$refs.receiptRecord.showModal(id);
		},
		changeStatus({ id }) {
			this.$confirm({
				centered: true,
				title: '确认要将该笔记录的收货状态改为全部收货吗？',
				content: () => <span style="color: #ff4d4f">注：部分收货改为全部收货，状态不可逆</span>,
				// okText: '',
				cancelText: '取消',
				icon: () => (
					<a-icon
						type="exclamation-circle"
						theme="filled"
					/>
				),
				onOk: () => {
					API_SteelsReceiveChangeStatus(id).then(res => {
						if (res.success && res.data) {
							this.$message.success('收货状态修改成功！');
							this.getList();
						}
					});
				}
				// onCancel() {}
			});
		},
		onPageState() {
			//点击操作中的按钮，保存分页状态
			this.VUEX_setListPamars(this.pagination);
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		// 查看
		handleView(item) {
			this.$router.push({
				path: '/center/steels/receive/receipt/detail',
				query: {
					deliverId: item.id,
					steelType: item.steelType
				}
			});
		},
		goToApply() {
			// 收货确认
			this.$router.push({
				path: '/center/steels/receive/receipt/confirmList'
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="stylus" scoped>
    .slMain {
        margin-top: -10px !important;
    }
    .receiveRecordList
        .search-wrap
            .order-wrap
                label
                    width 84px
            .range-input .ant-input-number
                width 115px
        .list-head
            li
                overflow hidden
                text-overflow ellipsis
                white-space nowrap

        .s-modal
            width 100%
            height 100%
            position fixed
            left 0
            top 0
            background rgba(0,0,0,.4)
            z-index 9999
            flex-row(center, flex-start)
            .content
                width 400px
                height auto
                max-height 500px
                overflow-y auto
                background #ffffff
                padding 0 30px
                border-radius 8px
                position relative
            .btn
                width 90%
                margin 20px 0
                flex-row(flex-end, center)
                background #fff
::v-deep.ant-calendar-picker
	width 100%
::v-deep.ant-input-number
	width 84px
</style>
