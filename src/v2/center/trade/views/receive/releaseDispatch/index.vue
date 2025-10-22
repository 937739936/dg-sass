<template>
	<div class="invoice-list slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>汽车派车计划</span
				>
				<div class="btn-box-title">
					<div
						class="btn"
						@click="exportFile"
					>
						<ExportBgIcon class="icon2"></ExportBgIcon>
						<span>导出</span>
					</div>
				</div>
			</div>
			<!-- 查询区域 -->
			<!-- <SlForm :list="searchList" layout="inline" @change="changeSearch" :allowClear="false" :isShowIcon="true" :isShowSearchBox="true"></SlForm> -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					:rowKey="(record, index) => `${record.id}-${index}`"
					:dataSource="list"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<span slot="customTitle">操作</span>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<div class="btn-box">
							<a-space>
								<a
									v-auth="'steel:shipmentReceipt:deliverDispatchPlan:edit'"
									href="javascript:;"
									class="btn"
									@click="despatchCode(record, 'edit')"
									>编辑</a
								>
								<a
									v-auth="'steel:shipmentReceipt:deliverDispatchPlan:detail'"
									href="javascript:;"
									class="btn"
									@click="despatchCode(record, 'detail')"
									>查看</a
								>
								<a
									v-auth="'steel:shipmentReceipt:deliverDispatchPlan:carNumberTableDetail'"
									href="javascript:;"
									class="btn"
									@click="details(record)"
									>发运明细</a
								>
							</a-space>
						</div>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					v-show="pageSize < pagination.total"
					@change="getList"
				/>
			</div>
			<DespatchCodeModal ref="despatchCodeModal" />
		</a-card>
	</div>
</template>

<script>
import SlForm from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import { API_getDispatchPlanList, API_getDispatchPlanDetail, API_exportDispatchPlan } from '@/v2/center/trade/api/receive';
import { columns } from './config/columns';
import DespatchCodeModal from './components/DespatchCodeModal';
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { ExportBgIcon } from '@sub/components/svg'

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '派车计划编号',
		type: 'input',
		maxLength: 30,
		placeholder: '请输入派车计划编号',
		allowClear: true
	},
	{
		decorator: ['deliveryCompanyName'],
		addonBeforeTitle: '派车单位',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入派车单位',
		allowClear: true
	},
	{
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人名称',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入收货人名称',
		allowClear: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		maxLength: 50,
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['loadPlace'],
		addonBeforeTitle: '装货地',
		type: 'input',
		maxLength: 100,
		placeholder: '请输入装货地',
		allowClear: true
	},
	{
		decorator: ['destination'],
		addonBeforeTitle: '卸货地',
		type: 'input',
		maxLength: 100,
		placeholder: '请输入卸货地',
		allowClear: true
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchParams: {},
			issuedDate: [],
			/** 筛选项操作 */
			isSpread: false,
			// 加载
			loading: false,
			list: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10,
			delId: '',
			searchList: [],
			searchArr: [], // 搜索项汇总
			despatchCodeType: '' //edit编辑，detail详情
		};
	},
	components: {
		iPagination,
		SlForm,
		DespatchCodeModal,
		ExportBgIcon
	},
	mounted() {
		this.searchList = [...searchList];
		this.getList();
	},
	methods: {
		resetFunc() {},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		changeSearch(data) {
			this.searchParams = data;
			this.getList(1, this.pageSize);
		},
		// 获取发车计划列表
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			this.loading = true;
			try {
				const res = await API_getDispatchPlanList(params);
				this.list = res.data.records;
				this.pagination.total = res.data.total;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		details(item) {
			// 发车计划详情
			this.$router.push({
				path: '/center/receive/carplan/detail',
				query: {
					id: item.id
				}
			});
		},
		// 导出
		async exportFile() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize
			};
			const res = await API_exportDispatchPlan(params);
			comDownload(res, undefined, `派车计划列表.xls`);
		},
		// 打开派车计划
		async despatchCode(record, type) {
			let res = await API_getDispatchPlanDetail({ id: record.id });
			if (res.success) {
				record = res.data;
			}
			record.type = type;
			this.$refs.despatchCodeModal.show(record, 'DispatchPlanList');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/pagination.less');
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	margin-top: -10px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
.invoice-list {
	.title {
		padding-bottom: 15px;
		font-size: 20px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		line-height: 28px;
		border-bottom: 1px solid #e9effc;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.btn-box-title {
		display: flex;
		align-items: center;
		.btn {
			width: 80px;
			height: 38px;
			border-radius: 4px;
			border: 1px solid @primary-color;
			display: flex;
			justify-content: center;
			align-items: center;
			color: @primary-color;
			font-size: 14px;
			margin-left: 20px;
			font-weight: 400;
			cursor: pointer;
		}
	}
	.table-box {
		margin-top: 20px;
	}
	.btn-box {
		display: flex;
		align-items: center;
		justify-content: space-around;
		color: @primary-color;
		font-size: 14px;
	}
	.icon2 {
		width: 18px;
		height: 18px;
		vertical-align: middle;
		margin-right: 10px;
	}
}
</style>
