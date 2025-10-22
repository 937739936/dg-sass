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
						<a-input v-decorator="['sellCompanyName']" />
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
							<a-select-option value="male"> male </a-select-option>
							<a-select-option value="female"> female </a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="合同开始日期">
						<a-date-picker
							v-decorator="['effectiveStartDate']"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同结束日期">
						<a-date-picker
							v-decorator="['effectiveEndDate']"
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
									type="primary"
									@click="reset"
								>
									重置
								</a-button>
							</a-form-item>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<a-alert
			message="规则说明：不指定规格的货物不在下表中统计显示。"
			type="info"
			show-icon
			style="margin-bottom: 20px"
		/>
		<a-table
			:row-selection="rowSelection"
			:columns="columns"
			:data-source="data"
			:pagination="false"
		>
			<span slot="本次提货件数">
				<a-input />
			</span>
			<span slot="本次提货数量">
				<a-input />
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
import { columns } from '../../config/stockStep1';
import { getContractList } from '@/v2/center/steels/api/orderApply';

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
			pageSize: 10
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
		getDataList(values = {}) {
			getContractList({
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				...values
			}).then(res => {});
		},
		pageChange(item) {
			this.pageNo = item.current;
			this.pageSize = item.pageSize;
			this.getDataList();
		},
		reset() {
			this.form.resetFields();
			this.pageNo = 1;
			this.pageSize = 10;
			this.getDataList();
		},
		search() {
			this.pageNo = 1;
			this.pageSize = 10;
			this.getDataList(this.form.getFieldsValue());
		},
		cancel() {
			this.$router.back();
		},
		next() {
			this.$emit('next', 1);
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				}
			});
		}
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
