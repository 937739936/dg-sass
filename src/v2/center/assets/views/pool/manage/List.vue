<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>池资产管理</span
				>
				<a-button
					@click="gotoAdd"
					type="primary"
					v-auth="'asset:pool:list:add'"
					>新增入池资产</a-button
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
					<div
						slot="action"
						slot-scope="action, items"
					>
						<router-link
							v-auth="'asset:pool:list:view'"
							:to="{ path: '/center/assets/pool/manage/detail', query: { id: items.id, activeIndex: 0 } }"
							>查看</router-link
						>
						<span v-if="items.status == 'TO_BE_VERIFY' || items.status == 'PLATFORM_REJECT' || items.status == 'COMMENTED'">
							<router-link
								v-auth="'asset:pool:list:edit'"
								style="margin-left: 8px"
								:to="{ path: '/center/assets/pool/manage/edit', query: { id: items.id, activeIndex: 0, isEdit: '1' } }"
								>编辑</router-link
							>
							<a
								v-auth="'asset:pool:list:cancel'"
								style="margin-left: 8px"
								@click="goZuofei(items)"
								>作废</a
							>
						</span>
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
			v-model="zuofeiVisible"
			title="作废原因"
			:width="500"
			@ok="submitZ"
			class="slModal"
		>
			<div
				@click.stop
				style="background: #fff"
				@move.stop
			>
				<a-row> 请输入作废原因： </a-row>
				<a-row>
					<a-textarea
						style="margin: 0 auto; margin-top: 20px"
						:maxLength="100"
						placeholder="作废原因"
						v-model="reasonName"
					></a-textarea>
				</a-row>
			</div>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{ title: '应收账款流水号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应收账款类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
	{ title: '应收账款金额(元)', dataIndex: 'amount', key: 'amount', scopedSlots: { customRender: 'amount' }, align: 'right' },
	{ title: '应收账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应收账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '应收账款申请日期', dataIndex: 'requestTime', key: 'requestTime' },
	{ title: '运输方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
	{ title: '数据来源', dataIndex: 'assetSourceDesc', key: 'assetSourceDesc' },
	{ title: '状态', dataIndex: 'status', key: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '应收账款流水号',
		type: 'input',
		placeholder: '请输入应收账款流水号'
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '应收账款类型',
		type: 'select',
		placeholder: '请选择应收账款类型',
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
		decorator: ['buyerName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业类型',
		type: 'select',
		placeholder: '请选择行业类型',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' },
			{ value: 'GRAIN', label: '粮食' }
		]
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('despatchTypeDict')
			.filter(item => item.value != 'TRAIN_ONESELF')
			.map(item => {
				return { value: item.value, label: item.text };
			})
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: filterCodeByKey('receivableStatusDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['assetSource'],
		addonBeforeTitle: '数据来源',
		type: 'select',
		placeholder: '请选择数据来源',
		options: [
			{ value: 'ASSET_MANAGE', label: '资产管理' },
			{ value: 'STEEL_SUPPLY', label: '钢材供应链' },
			{ value: 'DATA_SUPPLY', label: '数字供应链' }
		]
	}
];
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_GetAccountsPoolReceivableList, API_GetAccountsPayableZF } from '@/v2/center/assets/api/index.js';
import AssetsTipInfo from '@/v2/center/assets/components/common/AssetsTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	data() {
		return {
			zuofeiVisible: false,
			reasonName: '',
			columns,
			url: {
				list: API_GetAccountsPoolReceivableList
			},
			searchList
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
		gotoAdd() {
			this.$router.push('/center/assets/pool/manage/edit?&activeIndex=0');
		},

		goZuofei(item) {
			this.reasonName = '';
			this.zuofeiVisible = true;
			this.currentId = item.id;
		},
		submitZ() {
			if (!this.reasonName) {
				this.$message.error('请输入作废原因');
				return;
			}
			this.zuofeiVisible = false;
			this.$confirm({
				centered: true,
				title: '确定作废',
				okText: '确定',
				content: '系统将对池资产进行作废，确定要进行作废么?',
				cancelText: '取消',
				onOk: () => {
					API_GetAccountsPayableZF({
						message: this.reasonName,
						assetId: this.currentId
					}).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('作废成功');
								this.getList();
							}
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
