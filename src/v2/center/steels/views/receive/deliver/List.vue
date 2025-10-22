<template>
	<div
		class="releaseRecordList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>发货管理</span
				>
				<a-button
					type="primary"
					@click="goToApply"
					v-auth="'steel:shipmentReceipt:shipemnt:add'"
				>
					<div>发货申请</div>
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
					:data-source="dataSource"
					class="new-table"
					:scroll="{ x: true }"
					:rowKey="
						(record, index) => {
							return record.id;
						}
					"
				>
					<span
						slot="downstreamCompanyAbbr"
						slot-scope="downstreamCompanyAbbr"
					>
						{{ downstreamCompanyAbbr || '-' }}
					</span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!-- 待提交状态下 -->
						<template v-if="item.status === 'UNCOMMITTED'">
							<a
								@click.prevent="handleModify(item)"
								v-auth="'steel:shipmentReceipt:shipemnt:update'"
								>修改</a
							>
							<a
								@click.prevent="handleSubmit(item)"
								v-auth="'steel:shipmentReceipt:shipemnt:submit'"
								>提交</a
							>
							<a
								@click.prevent="deleteItem(item.id)"
								v-auth="'steel:shipmentReceipt:shipemnt:cancel'"
								>取消</a
							>
						</template>
						<!-- 已发货状态下 作废、详情-->
						<template v-if="item.status === 'SHIPPED'">
							<a
								@click.prevent="toVoid(item)"
								v-auth="'steel:shipmentReceipt:shipemnt:invalid'"
								>作废</a
							>
						</template>
						<!-- 已发货、已收货状态下 -->
						<template
							v-if="item.status !== 'UNCOMMITTED'"
							v-auth="'steel:shipmentReceipt:shipemnt:detail'"
						>
							<a @click.prevent="handleView(item)">查看</a>
						</template>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
		<a-modal
			:visible="visible"
			@cancel="visible = false"
			@ok="cancelOrder"
		>
			<a-row>
				作废原因：<a-input
					style="margin: 0 auto; margin-top: 20px; float: right"
					placeholder="请输入作废原因"
					v-model.trim="reasonName"
				></a-input>
			</a-row>
		</a-modal>
	</div>
</template>

<script>
import { API_SteelsDeliverList, API_SteelsDeliverDelete, API_SteelsDeliverVoid } from '@/v2/center/steels/api/receive.js';
import { mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
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
		decorator: ['buyCompanyName'],
		addonBeforeTitle: '买方',
		type: 'input',
		placeholder: '请输入买方',
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
			getPopupContainer,
			url: {
				list: API_SteelsDeliverList
			},
			searchList,
			flag: false,
			columns: [
				{ title: '发货批次号', dataIndex: 'shipmentNo', key: 'shipmentNo' },
				{ title: '买方名称', dataIndex: 'buyCompanyName', key: 'buyCompanyName' },
				// { title: '下游企业简称', dataIndex: 'downstreamCompanyAbbr', key: 'downstreamCompanyAbbr',scopedSlots: { customRender: 'downstreamCompanyAbbr'} },
				{ title: '钢材种类', dataIndex: 'steelTypeDesc' },
				{ title: '货转开具标识', dataIndex: 'goodsTransferFlagDesc' },
				{ title: '发货日期', dataIndex: 'shipmentDate', key: 'shipmentDate' },
				{ title: '发货数量(吨)', dataIndex: 'quantity', key: 'quantity', align: 'center' },
				{ title: '发运方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
				{ title: '状态', dataIndex: 'statusDesc', key: 'statusDesc' },
				{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
			],
			resultList: [],
			pagination: {
				type: 'SteelsDeliverList',
				total: 0, // 总条数
				pageNo: 1
			},
			visible: false,
			reasonName: '',
			reasonId: ''
		};
	},
	mounted() {},
	methods: {
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			// Object.assign(this.searchParams, info)
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		deleteItem(deliverId) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '确定要删除该条数据？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_SteelsDeliverDelete(deliverId).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
							t.getList();
						}
					});
				}
			});
		},
		// 列表修改操作
		handleModify(item) {
			this.$router.push({
				path: '/center/steels/receive/deliver/releaseApply',
				query: {
					deliverId: item.id,
					flag: 'edit',
					steelType: item.steelType
				}
			});
		},
		// 列表提交操作
		handleSubmit(item) {
			this.$router.push({
				path: '/center/steels/receive/deliver/detail',
				query: {
					deliverId: item.id,
					flag: 'submit'
				}
			});
		},
		goToApply() {
			// 发货申请
			this.$router.push({
				path: '/center/steels/receive/deliver/applyList'
			});
		},
		toVoid(item) {
			// 作废
			this.visible = true;
			this.reasonId = item.id;
		},
		// 作废发货批次
		cancelOrder() {
			if (!this.reasonName) {
				this.$message.error('作废理由必填');
				return;
			}
			API_SteelsDeliverVoid({
				deliverId: this.reasonId,
				reason: this.reasonName
			}).then(res => {
				if (res.success) {
					this.visible = false;
					this.$message.success('操作成功');
					this.getList();
				}
			});
		},
		// 查看
		handleView(item) {
			this.$router.push({
				path: '/center/steels/receive/deliver/detail',
				query: {
					deliverId: item.id,
					flag: 'view',
					steelType: item.steelType
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="stylus" scoped>
    .releaseRecordList
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
