<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>预警数据</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<a-space :size="10">
							<a
								v-auth="'warehouse:warnManage:warnData:view'"
								@click="jumpPage('/center/storageCenter/earlywarning/data/detail', record.id)"
								>查看</a
							>
							<a
								v-auth="'warehouse:warnManage:warnData:trace'"
								@click="jumpPage('/center/storageCenter/earlywarning/data/dispose', record.id)"
								>跟踪处理</a
							>
							<a
								v-if="record.eventVideoUrl"
								@click="previewVideo(record.eventVideoUrl)"
								>预警视频</a
							>
						</a-space>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
			<EarlyWarningVideo ref="earlyWarningVideo"></EarlyWarningVideo>
		</a-card>
	</div>
</template>

<script>
import {
	API_GrainSituationGetCoreCompanyEarlyWarning,
	API_GrainSituationEarlyWarningType,
	API_GrainSituationGetCoreCompanyList
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import EarlyWarningVideo from '../components/EarlyWarningVideo';
import { mapMutations, mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const columns = [
	{
		title: '预警流水号',
		fixed: 'left',
		align: 'center',
		dataIndex: 'earlyWarningNo'
	},
	{
		title: '预警日期',
		align: 'center',
		dataIndex: 'earlyWarningDate'
	},
	{
		title: '仓储企业',
		align: 'center',
		dataIndex: 'storageCompany'
	},
	{
		title: '库点',
		align: 'center',
		dataIndex: 'depotPoint'
	},
	{
		title: '仓房',
		align: 'center',
		dataIndex: 'storehouse'
	},
	{
		title: '商品名称',
		align: 'center',
		dataIndex: 'grainName'
	},
	{
		title: '预警类型',
		align: 'center',
		dataIndex: 'earlyWarningType'
	},
	{
		title: '预警等级',
		align: 'center',
		dataIndex: 'level'
	},
	{
		title: '预警状态',
		align: 'center',
		customRender: (text, row) => {
			return row.ifSolved ? '已处理' : '未处理';
		}
	},
	{
		title: '操作',
		// width: 100,
		fixed: 'right',
		align: 'center',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	mixins: [ListMixin],
	name: 'EarlyWarningList',
	components: {
		iPagination,
		EarlyWarningVideo
	},

	data() {
		return {
			getPopupContainer,
			coreCompanyList: [],
			earlyWarningDate: [],
			earlyWarningType: [],
			params: {},
			loading: false,
			url: {
				list: API_GrainSituationGetCoreCompanyEarlyWarning
			},
			searchList: [],
			selfLoad: true
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		this.columns = [...columns];
		if (this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG') {
			// 金融机构
			const coreCompanyColumn = {
				title: '权属企业',
				dataIndex: 'coreCompany'
			};
			this.columns.splice(2, 0, coreCompanyColumn);
		}
		this.searchList = this.renderType(this.VUEX_ST_COMPANYSUER.companyType);
		this.initData();
	},

	methods: {
		...mapMutations({
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		initData() {
			return new Promise(async resolve => {
				await this.getWarningType();
				await this.getGetCoreCompanyList();
				this.getList();
				resolve(true);
			});
		},
		handleChange(data) {
			if (data.earlyWarningStartDate) {
				data.earlyWarningStartDate = data.earlyWarningStartDate + ' 00:00:00';
				data.earlyWarningEndDate = data.earlyWarningEndDate + ' 23:59:59';
			}
			if (data.hasOwnProperty('ifSolved')) {
				data.ifSolved = Boolean(data.ifSolved);
			}
			this.changeSearch(data);
		},
		getGetCoreCompanyList() {
			API_GrainSituationGetCoreCompanyList().then(res => {
				if (res.success) {
					this.coreCompanyList = res.data.coreCompanyList || [];
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'coreCompanyList') {
							item.options = this.coreCompanyList.map(item => {
								return { value: item.coreCompanyName, label: item.coreCompanyName };
							});
						}
					});
				}
			});
		},
		getWarningType() {
			API_GrainSituationEarlyWarningType().then(res => {
				if (res.success) {
					this.earlyWarningType = res.data;
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'earlyWarningType') {
							item.options = this.earlyWarningType.map(item => {
								return { value: item.key, label: item.value };
							});
						}
					});
				}
			});
		},
		jumpPage(path, id) {
			const query = {};
			if (id) {
				query.id = id;
			}
			this.$router.push({
				path,
				query
			});
		},
		previewVideo(src) {
			this.$refs.earlyWarningVideo.showModal(src);
		},
		renderType(companyType) {
			return [
				{
					decorator: ['earlyWarningNo'],
					addonBeforeTitle: '预警流水号',
					type: 'input',
					placeholder: '请输入预警流水号'
				},
				{
					decorator: ['earlyWarningDate'],
					addonBeforeTitle: '预警日期',
					type: 'rangePicker',
					realKey: ['earlyWarningStartDate', 'earlyWarningEndDate']
				},
				{
					decorator: ['coreCompanyList'],
					addonBeforeTitle: '权属企业',
					type: 'select',
					placeholder: '请输入权属企业',
					isShow: companyType == 'FINANCIAL_ORG',
					options: []
				},
				{
					decorator: ['storageCompany'],
					addonBeforeTitle: '仓储企业',
					type: 'input',
					placeholder: '请输入仓储企业',
					isShow: ['FINANCIAL_ORG', 'TRADER', 'CORE_COMPANY'].includes(companyType)
				},
				{
					decorator: ['depotPoint'],
					addonBeforeTitle: '库点',
					type: 'input',
					placeholder: '请输入库点'
				},
				{
					decorator: ['storehouse'],
					addonBeforeTitle: '仓房',
					type: 'input',
					placeholder: '请输入仓房'
				},
				{
					decorator: ['earlyWarningType'],
					addonBeforeTitle: '预警类型',
					type: 'select',
					placeholder: '请选择预警类型',
					options: []
				},
				{
					decorator: ['warningLevel'],
					addonBeforeTitle: '预警等级',
					type: 'select',
					placeholder: '请选择预警等级',
					options: [
						{
							value: 'HIGH',
							label: '高'
						},
						{
							value: 'MIDDLE',
							label: '中'
						},
						{
							value: 'LOW',
							label: '低'
						}
					]
				},
				{
					decorator: ['ifSolved'],
					addonBeforeTitle: '预警状态',
					type: 'select',
					placeholder: '请选择预警等级',
					options: [
						{
							value: '1',
							label: '已处理'
						},
						{
							value: '0',
							label: '未处理'
						}
					]
				}
			];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
