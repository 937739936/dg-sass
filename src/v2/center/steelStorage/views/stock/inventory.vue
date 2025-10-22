<template>
	<div>
		<div class="s-title">
			<span>库存查看</span>
		</div>
		<div>
			<a-form
				style="margin-top: 20px"
				:form="form"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 16 }"
				labelAlign="right"
			>
				<a-row>
					<a-col :span="8">
						<WarehouseInput
							:label-col="{ span: 6 }"
							:wrapper-col="{ span: 16 }"
							v-model="searchParams.warehouseAbbreviation"
						>
						</WarehouseInput>
					</a-col>
					<a-col :span="8">
						<a-form-item label="货主">
							<a-input
								v-model="VUEX_ST_COMPANYSUER.companyName"
								disabled
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="客户">
							<a-input v-model="searchParams.customer" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="采购合同号">
							<a-input v-model="searchParams.purchaseContractNo" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="销售合同号">
							<a-input v-model="searchParams.sellContractNo" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							label="日期"
							:colon="false"
						>
							<a-date-picker
								placeholder="请选择时间"
								valueFormat="YYYY-MM-DD"
								v-model="searchParams.date"
								format="YYYY-MM-DD"
								:getCalendarContainer="getPopupContainer"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="产品大类">
							<a-select
								v-model="searchParams.steelType"
								mode="multiple"
							>
								<a-select-option
									v-for="item in steelTypeList"
									:value="item.value"
									:key="item.value"
								>
									{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<MaterialNameForm
							:label-col="{ span: 6 }"
							:wrapper-col="{ span: 16 }"
							mode="multiple"
							:steelType="searchParams.steelType"
							v-model="searchParams.materialName"
						>
						</MaterialNameForm>
					</a-col>
					<a-col :span="8">
						<a-row
							:gutter="24"
							justify="space-between"
						>
							<a-col :span="6">
								<a-form-item>
									<a-button
										type="primary"
										@click="search"
										icon="search"
										v-auth="'steelWarehouse:store:store:view'"
									>
										查询
									</a-button>
								</a-form-item>
							</a-col>
							<a-col
								:span="6"
								:offset="1"
							>
								<a-form-item>
									<a-button
										type=""
										@click="reset"
										icon="reload"
									>
										重置
									</a-button>
								</a-form-item>
							</a-col>
							<a-col :span="6">
								<a-form-item
									style="padding-left: 10px"
									v-auth="'steelWarehouse:store:store:view'"
								>
									<a-button
										type="primary"
										icon="export"
										@click="exportList"
										:disabled="disabledExport"
									>
										导出
									</a-button>
								</a-form-item>
							</a-col>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div>
			<div
				class="analysis"
				v-if="analysisInfo && searchParams.warehouseAbbreviation"
			>
				<div class="analysis-item">
					<p>仓库库存总量(吨)</p>
					<p style="color: red">{{ analysisInfo.totalStorage || 0 }}</p>
				</div>
				<div class="analysis-item">
					<p>仓库今日总入库量(吨)</p>
					<p style="color: red">{{ analysisInfo.inStorageByDay || 0 }}</p>
				</div>
				<div class="analysis-item">
					<p>仓库今日总出库量(吨)</p>
					<p style="color: red">{{ analysisInfo.outStorageByDay || 0 }}</p>
				</div>
			</div>
			<a-table
				:columns="columns"
				:data-source="list"
				:scroll="{ x: true }"
				:rowKey="record => record.id"
				style="margin-top: 18px"
				:pagination="false"
				:loading="loading"
			>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getPage"
			/>
		</div>
	</div>
</template>

<script>
import { getPopupContainer } from '@/untils/factory.js';
import iPagination from "@sub/components/iPagination";
import WarehouseInput from '../../components/warehouseInput.vue';
import comDownload from '@sub/utils/comDownload.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import { getInventoryList, getStorageList, exportInventory, getInventoryAnalysis } from '../../api';
import { mapMutations, mapGetters } from 'vuex';
import MaterialNameForm from '../../components/materialNameForm.vue';
const columns = [
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbreviation'
	},
	// {
	//   title: '采购合同号',
	//   dataIndex: 'purchaseContractNo',
	//   with:150
	// },
	{
		title: '货主',
		dataIndex: 'companyName'
	},
	// {
	//   title: '销售合同号',
	//   dataIndex: 'sellContractNo'
	// },
	// {
	//   title: '客户',
	//   dataIndex: 'customer'
	// },
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs'
	},
	{
		title: '厂家',
		dataIndex: 'factory'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo'
	},
	{
		title: '件数（件）',
		dataIndex: 'pieceQuantity'
	},
	{
		title: '理论重量（吨）',
		dataIndex: 'theoreticalWeight'
	},
	{
		title: '实际重量（吨）',
		dataIndex: 'quantity'
	},
	{
		title: '入件数（件）',
		dataIndex: 'inPieceQuantityDay'
	},
	{
		title: '入重量（吨）',
		dataIndex: 'inWeightDay'
	},
	{
		title: '出件数（件）',
		dataIndex: 'outPieceQuantityDay'
	},
	{
		title: '出重量（吨）',
		dataIndex: 'outWeightDay',
		fixed: 'right'
	}
];
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			getPopupContainer,
			pagination: {
				total: 50, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			loading: false,
			columns,
			searchParams: {
				date: moment().format('yyyy-MM-DD'),
				materialName: [],
				warehouseAbbreviation: ''
			},
			list: [],
			// 仓库列表
			storageList: [],
			// 仓库详情信息
			storageInfo: {},
			steelTypeList: filterSteelsCodeByKey('steelType'),

			disabledExport: false,
			// 分析数据
			analysisInfo: null
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.search();
	},
	methods: {
		search() {
			this.pagination.pageNo = 1;
			this.getList();
			this.getInventoryAnalysis();
		},
		reset() {
			this.pagination.pageNo = 1;
			this.searchParams = {
				date: moment().format('yyyy-MM-DD'),
				materialName: [],
				warehouseAbbreviation: ''
			};
			this.getList();
		},
		async getList() {
			const params = {
				...this.searchParams,
				...this.pagination,
				companyName: this.VUEX_ST_COMPANYSUER.companyName
			};
			if (params.steelType) {
				params.steelType = params.steelType.join();
			}
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			this.loading = true;
			try {
				const res = await getInventoryList(params);
				this.list = res.data.records;
				this.pagination.total = +res.data.total || 0;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		// 分页
		getPage(value) {
			this.pagination.pageNo = value;
			this.getList();
		},
		async exportList() {
			const params = {
				...this.searchParams,
				companyName: this.VUEX_ST_COMPANYSUER.companyName
			};

			if (params.steelType) {
				params.steelType = params.steelType.join();
			}
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			this.disabledExport = true;
			try {
				const res = await exportInventory(params);
				if (params.warehouseAbbreviation) {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}${params.warehouseAbbreviation}库存查看报表.xls`);
				} else {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}库存查看报表.xls`);
				}

				this.disabledExport = false;
			} catch (error) {
				this.disabledExport = false;
			}
		},
		// 获取数据分析
		async getInventoryAnalysis() {
			if (!this.searchParams.warehouseAbbreviation) {
				return;
			}
			const params = {
				warehouseAbbreviation: this.searchParams.warehouseAbbreviation,
				date: this.searchParams.date
			};
			const res = await getInventoryAnalysis(params);
			this.analysisInfo = res.data;
		}
	},
	components: {
		iPagination,
		WarehouseInput,
		MaterialNameForm
	}
};
</script>

<style scoped lang="less">
.analysis {
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: 20px 0;
	&-item {
		text-align: center;
		font-size: 14px;
		font-weight: 600;
	}
}
</style>
