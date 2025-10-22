<template>
	<div>
		<a-form
			:form="form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			@submit="handleSubmit"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="卖方名称">
						<a-select
							show-search
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:not-found-content="null"
							v-decorator="['sellCompanyName']"
							@search="handleSearch"
							@change="handleChange"
						>
							<a-select-option
								v-for="d in nameList"
								:key="d"
							>
								{{ d }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input v-decorator="['contractNo']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="钢材种类">
						<a-select v-decorator="['steelType']">
							<a-select-option
								v-for="item in steelType"
								:value="item.value"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="合同开始日期">
						<a-date-picker
							v-decorator="['effectiveStartDate', { required: false }]"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同结束日期">
						<a-date-picker
							v-decorator="['effectiveEndDate', { required: false }]"
							style="width: 100%"
						/>
					</a-form-item>
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
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			:row-selection="rowSelection"
			:columns="columns"
			:data-source="data"
			:pagination="false"
			:loading="loading"
			rowKey="contractId"
			:scroll="{ x: 1200 }"
			:customRow="onClickRow"
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
		<div class="footer-btn-wrap">
			<p>
				<a-button @click="cancel">取消</a-button>
				<a-button
					type="primary"
					style="margin-left: 20px"
					@click="next"
					>下一步</a-button
				>
			</p>
		</div>
	</div>
</template>

<script>
import Pagination from '../../components/pagination.vue';
import { columns } from '../../config/goodsStep2';
import { getContractList, getSellNameList } from '@/v2/center/steels/api/orderApply';
import moment from 'moment';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import { debounce } from 'lodash';
export default {
	name: 'step1',
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			data: [],
			columns,
			selectedRowKeys: [],
			total: 0,
			pageNo: 1,
			pageSize: 10,
			loading: false,
			steelType: filterCodeBySteelKey('steelType'),
			loadingName: false,
			nameList: []
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
						this.selectedRowKeys = [record.contractId];
					}
				}
			};
		},
		getNameList: debounce(function (name) {
			getSellNameList({
				sellName: name
			}).then(res => {
				if (res.success) {
					this.nameList = res.data;
				}
			});
		}, 200),
		handleSearch(value) {
			this.getNameList(value);
		},
		handleChange(value) {
			this.getNameList(value);
		},
		reset() {
			this.pageNo = 1;
			this.pageSize = 10;
			this.selectedRowKeys = [];
			this.form.resetFields();
			this.getDataList();
		},
		search() {
			this.pageNo = 1;
			this.pageSize = 10;
			this.selectedRowKeys = [];
			const getFieldsValue = this.form.getFieldsValue();
			if (getFieldsValue.effectiveStartDate) {
				getFieldsValue.effectiveStartDate = moment(getFieldsValue.effectiveStartDate).format('YYYY-MM-DD');
			}
			if (getFieldsValue.effectiveEndDate) {
				getFieldsValue.effectiveEndDate = moment(getFieldsValue.effectiveEndDate).format('YYYY-MM-DD');
			}
			this.getDataList(getFieldsValue);
		},
		pageChange(item) {
			this.pageNo = item.current;
			this.pageSize = item.pageSize;
			this.getDataList();
		},
		getDataList(values = {}) {
			this.loading = true;
			getContractList({
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				...values
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
		cancel() {
			this.$router.back();
		},
		next() {
			if (!this.selectedRowKeys.length) {
				this.$message.warning('请选择提货申请');
				return;
			}
			this.$emit('next', {
				view: 1,
				id: this.selectedRowKeys[0] || ''
			});
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		onSelection(selectedRowKeys) {},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				}
			});
		}
	},
	mounted() {
		this.getDataList();
	}
};
</script>

<style lang="less" scoped>
.footer-btn-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
</style>
