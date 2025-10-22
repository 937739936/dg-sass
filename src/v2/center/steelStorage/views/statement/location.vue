<template>
	<div>
		<div class="s-title">
			<span>库位分布查看</span>
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
						<a-form-item label="储区">
							<a-input v-model="searchParams.storeArea" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="储位">
							<a-input v-model="searchParams.storePos" />
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
									v-auth="'steelWarehouse:reportForm:store:export'"
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
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import WarehouseInput from '../../components/warehouseInput.vue';
import MaterialNameForm from '../../components/materialNameForm.vue';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { exportLocation, getLocation } from '../../api';
const columns = [
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbreviation'
	},
	{
		title: '货主',
		dataIndex: 'companyName'
	},
	{
		title: '储区',
		dataIndex: 'storeArea'
	},
	{
		title: '储位',
		dataIndex: 'storePos'
	},
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
		title: '实际重量（吨）',
		dataIndex: 'quantity'
	}
];
export default {
	data() {
		return {
			form: this.$form.createForm(this),
			getPopupContainer,
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			loading: false,
			columns,
			searchParams: {
				warehouseAbbreviation: '',
				materialName: []
			},
			list: [],
			steelTypeList: filterSteelsCodeByKey('steelType'),
			disabledExport: false
		};
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
				materialName: []
			};
			this.getList();
		},
		async getList() {
			const params = {
				...this.searchParams,
				...this.pagination
			};
			if (params.steelType) {
				params.steelType = params.steelType.join();
			}
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			const res = await getLocation(params);
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

			if (params.steelType) {
				params.steelType = params.steelType.join();
			}
			if (params.materialName) {
				params.materialName = params.materialName.join();
			}
			this.disabledExport = true;
			try {
				const res = await exportLocation(params);
				if (params.warehouseAbbreviation) {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}${params.warehouseAbbreviation}仓库库位分布查看报表.xls`);
				} else {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}仓库库位分布查看报表.xls`);
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
