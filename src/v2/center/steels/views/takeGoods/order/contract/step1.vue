<template>
	<div>
		<a-form
			:form="form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="企业名称">
						<a-input v-decorator="['companyName']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同日期">
						<a-range-picker
							v-decorator="['validity']"
							format="YYYY-MM-DD"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input v-decorator="['contractNo']" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
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
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			:loading="loading"
			:row-selection="rowSelection"
			:columns="contractStep1Columns"
			:data-source="data"
			:pagination="false"
			:scroll="{ x: 1200 }"
			:customRow="onClickRow"
			rowKey="id"
		>
			<span
				slot="effectiveDate"
				slot-scope="text, record"
			>
				{{ record.effectiveStartDate }}-{{ record.effectiveEndDate }}
			</span>
		</a-table>
		<pagination
			:total="total"
			:current="pageNo"
			:pageSize="pageSize"
			v-on:page-change="pageChange"
		/>
		<p class="footer-btn-wrap">
			<a-button @click="prev">取 消</a-button>
			<a-button
				type="primary"
				style="margin-left: 20px"
				@click="next"
			>
				下一步
			</a-button>
		</p>
	</div>
</template>

<script>
import Pagination from '../../components/pagination.vue';
import { contractStep1Columns } from '../../config/orderStep1';
import { exportFirstTakeExcel, getTakeOrderContractList } from '@/v2/center/steels/api/orderApply';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			data: [],
			contractStep1Columns,
			total: 0,
			pageNo: 1,
			pageSize: 10,
			takeType: filterCodeBySteelKey('takeType'),
			steelType: filterCodeBySteelKey('steelType'),
			selectedRowKeys: [],
			loading: false,
			disabledExport: false
		};
	},
	components: {
		Pagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				type: 'radio',
				selections: [],
				onSelection: this.onSelection
			};
		}
	},
	methods: {
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
					}
				}
			};
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		onSelection(selectedRowKeys) {},
		reset() {
			this.pageNo = 1;
			this.pageSize = 10;
			this.form.resetFields();
			this.getDataList();
		},
		search() {
			this.pageNo = 1;
			this.pageSize = 10;
			this.getDataList();
		},
		pageChange(item) {
			this.pageNo = item.current;
			this.pageSize = item.pageSize;
			this.getDataList();
		},
		getFieldsValueData() {
			const getFieldsValue = this.form.getFieldsValue();
			if (getFieldsValue.validity?.length) {
				getFieldsValue.startDate = moment(getFieldsValue.validity[0]).format('YYYY-MM-DD');
				getFieldsValue.endDate = moment(getFieldsValue.validity[1]).format('YYYY-MM-DD');
			}
			delete getFieldsValue.validity;
			return getFieldsValue;
		},
		getDataList() {
			this.loading = true;
			getTakeOrderContractList({
				...this.getFieldsValueData(),
				pageNo: this.pageNo,
				pageSize: this.pageSize
			})
				.then(res => {
					if (res.success) {
						this.data = res.data.records;
						this.total = res.data.total;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		prev() {
			this.$router.back();
		},
		next() {
			if (!this.selectedRowKeys.length) {
				this.$message.warning('请选择开具提单的合同');
				return;
			}
			const item = this.getSelectedRowItem(this.selectedRowKeys[0]) || {};
			this.$router.push({
				path: item?.generateWay === 'ARTIFICIAL_COLLECTION' ? '/center/take/order/contract/stepTwoAdditional' : '/center/take/order/contract/stepTwo',
				query: {
					contractId: item.id,
					type: 'add'
				}
			});
		},
		getSelectedRowItem(id) {
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i].id === id) {
					return this.data[i];
				}
			}
		}
	},
	mounted() {
		this.getDataList();
	}
};
</script>

<style lang="less" scoped>
.ant-advanced-search-form {
	margin-top: 20px;
}
.footer-btn-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
