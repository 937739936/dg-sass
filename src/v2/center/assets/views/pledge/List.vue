<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>货押资产管理</span
				>
				<a-button
					@click="gotoAdd"
					type="primary"
					v-auth="'asset:pledge:corecompany:add'"
					>新增货押资产</a-button
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
					<div
						slot="action"
						slot-scope="action, items"
					>
						<router-link
							v-auth="'asset:pledge:corecompany:view'"
							:to="{ path: '/center/assets/pledge/detail', query: { id: items.id, activeIndex: 0 } }"
							style="margin-right: 8px"
							>查看</router-link
						>
						<!-- 状态为“待确认”、"平台驳回"或"已批注"时，可编辑 -->
						<a
							v-auth="'asset:pledge:corecompany:edit'"
							href="javascript:;"
							@click="goToEdit(items)"
							v-if="items.status == 'PLATFORM_REJECT' || items.status == 'COMMENTED' || items.status == 'TO_BE_VERIFY'"
							>编辑</a
						>
						<!-- 状态为“待确认，待确权”、"平台驳回"或"已批注" “可融资”时，可作废 -->
						<a
							v-auth="'asset:pledge:corecompany:cancel'"
							style="margin-left: 10px"
							href="javascript:;"
							@click="goZuofei(items)"
							v-if="
								(items.status == 'TODO' && items.assetCancel == 1) ||
								items.status == 'PLATFORM_REJECT' ||
								items.status == 'COMMENTED' ||
								items.status == 'TO_BE_CONFIRM' ||
								items.status == 'TO_BE_VERIFY'
							"
							>作废</a
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
	{ title: '货押资产编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{ title: '仓库名称', dataIndex: 'storageName', key: 'storageName' },
	{ title: '仓储企业', dataIndex: 'companyName', key: 'companyName' },
	{ title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity' },
	{ title: '质押货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '拟融资金额（元）', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount' },
	{ title: '货押资产申请日期', dataIndex: 'requestTime', key: 'requestTime' },
	{ title: '资产状态', dataIndex: 'status', fixed: 'right', key: 'status', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '货押资产编号',
		type: 'input',
		placeholder: '请输入货押资产编号'
	},
	{
		decorator: ['storageName'],
		addonBeforeTitle: '仓库名称',
		type: 'select',
		placeholder: '请选择仓库名称',
		options: []
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '仓储企业',
		type: 'input',
		placeholder: '请输入仓储企业'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['requestDate'],
		addonBeforeTitle: '申请日期',
		type: 'rangePicker',
		realKey: ['requestDateBegin', 'requestDateEnd']
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
		decorator: ['status'],
		addonBeforeTitle: '资产状态',
		type: 'select',
		placeholder: '请选择资产状态',
		options: filterCodeByKey('receivableStatusDict').map(item => {
			return { value: item.value, label: item.text };
		})
	}
];
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_GetPledgePayableList, API_GetAccountsPayableZF, API_AssetsWareList } from '@/v2/center/assets/api/index.js';
import AssetsTipInfo from '@/v2/center/assets/components/common/AssetsTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	data() {
		return {
			zuofeiVisible: false,
			reasonName: '',
			storageList: [],
			columns,
			selfLoad: true,
			url: {
				list: API_GetPledgePayableList
			},
			searchList
		};
	},
	components: {
		AssetsTipInfo
	},
	mounted: function () {
		this.initData();
	},
	methods: {
		initData() {
			return new Promise(async resolve => {
				await this.getWareList();
				this.getList();
				resolve(true);
			});
		},
		getWareList() {
			return API_AssetsWareList().then(res => {
				if (!res.success) {
					return;
				}
				this.storageList = res.data || [];
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'storageName') {
						item.options = this.storageList.map(item => {
							return { value: item.name, label: item.name };
						});
					}
				});
			});
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(this.searchParams);
		},
		goToEdit(item) {
			// 编辑
			if (item.id) {
				this.$router.push('/center/assets/pledge/edit?id=' + item.id + '&edit=1');
			}
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
				content: '系统将对该货押资产进行作废，确定要进行作废吗?',
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
		},

		gotoAdd() {
			this.$router.push('/center/assets/pledge/edit');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
