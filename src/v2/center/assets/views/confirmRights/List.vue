<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>确权盖章管理</span
				>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					style="margin-top: 22px"
				>
					<span
						slot="type"
						slot-scope="type"
						>{{ type == 'INVOICE' ? '发票结算' : '凭证结算' }}</span
					>
					<span
						slot="amount"
						slot-scope="amount"
						>¥{{ amount }}</span
					>
					<span
						slot="planFinancingAmount"
						slot-scope="planFinancingAmount"
						>{{ planFinancingAmount }}</span
					>
					<a
						slot="confirmNo"
						slot-scope="confirmNo, items"
						:href="items.path"
						target="_blank"
						>{{ confirmNo }}</a
					>
					<div
						slot="action"
						slot-scope="action, items"
					>
						<a
							v-auth="'asset:confirm:view'"
							style="margin-right: 8px"
							@click="goToDetail(items)"
							>查看</a
						>
						<!-- 状态为"待确权"时 -->
						<a
							v-auth="'asset:confirm:sign'"
							v-if="items.status == 'TO_BE_CONFIRM'"
							href="javascript:;"
							@click="confirmRight(items)"
							>盖章</a
						>
					</div>

					<div
						slot="status"
						slot-scope="text, record"
					>
						<AssetsTipInfo :item="record" />
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<a-modal
			class="modal"
			:header="null"
			:footer="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="confirmModal"
				style="display: block; margin: 30px auto 0"
				>确定</a-button
			>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{ title: '应付账款流水号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应付账款类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
	{ title: '应付账款金额(元)', dataIndex: 'amount', key: 'amount', scopedSlots: { customRender: 'amount' }, align: 'right' },
	{ title: '应付账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应付账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'planFinancingAmount' },
		align: 'right'
	},
	{ title: '应付账款申请日期', dataIndex: 'requestTime', key: 'requestTime' },
	{ title: '确认函编号', dataIndex: 'confirmNo', key: 'confirmNo', scopedSlots: { customRender: 'confirmNo' } },
	{ title: '状态', dataIndex: 'status', key: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '应付账款流水号',
		type: 'input',
		placeholder: '请输入应付账款流水号'
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '应付账款类型',
		type: 'select',
		placeholder: '请选择应付账款类型',
		options: [
			{ value: 'PROOF', label: '凭证结算' },
			{ value: 'INVOICE', label: '发票结算' }
		]
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '申请日期',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	}
];
import { API_GetConfirmAssetsList, API_JudgeConfirm } from '@/v2/center/assets/api/index.js';
import AssetsTipInfo from '@/v2/center/assets/components/common/AssetsTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			strMsg: '', // 确权时发票状态错误提示信息内容
			visible: false, // 确权时发票状态错误提示信息弹窗
			url: {
				list: API_GetConfirmAssetsList
			},
			searchList,
			defaultParams: {
				status: 'TO_BE_CONFIRM'
			}
		};
	},
	components: {
		AssetsTipInfo
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		goToDetail(item) {
			let id = item.id;
			if (item.modifyId) {
				id = item.modifyId;
				this.$router.push('/center/assets/payable/change/detail?id=' + id + '&fc=1&activeIndex=2');
				return;
			}
			if (item.assetType == 'POOL_ACCOUNTS_RECEIVABLE') {
				this.$router.push('/center/assets/pool/manage/detail?id=' + id + '&activeIndex=0');
				return;
			}
			this.$router.push('/center/assets/payable/manage/detail?id=' + id + '&activeIndex=0');
		},
		confirmRight(item) {
			// 确权盖章 判断当前资产下所有发票的发票状态，是否含有红冲、作废的发票；若包含有红冲作废的发票，不允许提交审核
			let id = item.id;
			if (item.modifyId) {
				id = item.modifyId;
			}
			API_JudgeConfirm({ assetId: id }).then(res => {
				if (res.success) {
					if (res.data) {
						this.strMsg = res.data;
						this.visible = true;
					} else {
						this.$router.push('/center/assets/confirmRights/stamp?id=' + id);
					}
				}
			});
		},
		confirmModal() {
			// 确权盖章弹窗展示 消失
			this.visible = false;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
