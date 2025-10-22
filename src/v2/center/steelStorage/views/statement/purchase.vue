<template>
	<div>
		<div class="s-title">
			<span>仓库采购合同货物账龄查看</span>
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
						<a-row :gutter="24">
							<a-col :span="6">
								<a-form-item>
									<a-button
										type="primary"
										@click="search"
										icon="search"
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
									v-auth="'steelWarehouse:reportForm:storeDuration:export'"
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
import WarehouseInput from '../../components/warehouseInput.vue';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { getStoreDuration, exportStoreDuration } from '../../api';
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
		title: '开始入库时间',
		dataIndex: 'inOperationDate'
	},
	{
		title: '全部出库时间',
		dataIndex: 'outOperationDate'
	},
	{
		title: '账龄时间（天）',
		dataIndex: 'duration',
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
				warehouseAbbreviation: ''
			},
			list: [],
			disabledExport: false
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
		},
		reset() {
			this.pagination.pageNo = 1;
			this.searchParams = {
				warehouseAbbreviation: '',
				date: []
			};
			this.getList();
		},
		async getList() {
			const params = {
				...this.searchParams,
				companyName: this.VUEX_ST_COMPANYSUER.companyName,
				...this.pagination
			};
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			const res = await getStoreDuration(params);
			this.list = res.data.records;
			this.pagination.total = +res.data.total || 0;
		},
		getPage(value) {
			this.pagination.pageNo = value;
			this.getList();
		},
		async exportList() {
			const params = {
				...this.searchParams
			};
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			this.disabledExport = true;
			try {
				const res = await exportStoreDuration(params);
				if (params.warehouseAbbreviation) {
					comDownload(
						res,
						undefined,
						`${moment().format('YYYYMMDD')}${params.warehouseAbbreviation}仓库采购合同货物账龄报表.xls`
					);
				} else {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}仓库采购合同货物账龄报表.xls`);
				}

				this.disabledExport = false;
			} catch (error) {
				this.disabledExport = false;
			}
		}
	},
	components: {
		iPagination,
		WarehouseInput,
		MaterialNameForm
	}
};
</script>

<style scoped></style>
