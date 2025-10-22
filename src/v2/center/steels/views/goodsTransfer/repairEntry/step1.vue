<template>
	<div>
		<a-form
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			:form="form"
			@submit="handleSubmit"
			style="margin-top: 20px"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="卖方名称">
						<a-input
							placeholder="请输入卖方名称"
							v-decorator="['sellCompanyName']"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input
							placeholder="请输入合同编号"
							v-decorator="['contractNo']"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同起始日">
						<a-date-picker
							style="width: 100%"
							v-decorator="['effectiveStartDate']"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同截止日">
						<a-date-picker
							style="width: 100%"
							v-decorator="['effectiveEndDate']"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item>
						<a-button
							type="primary"
							@click="search"
						>
							查询
						</a-button>
						<a-button
							@click="reset"
							style="margin-left: 40px"
						>
							重置
						</a-button>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			:loading="loading"
			:columns="columns"
			:data-source="data"
			:scroll="{ x: 1200, y: 300 }"
			:row-selection="{
				selectedRowKeys: selectedRowKeys,
				onChange: onSelectChange,
				type: 'radio'
			}"
		>
			<span
				slot="effectiveStartDate"
				slot-scope="text, row"
			>
				{{ row.effectiveStartDate }}-{{ row.effectiveEndDate }}
			</span>
		</a-table>
		<div class="pagination-wrap">
			<a-pagination
				:current="pageNum"
				:show-total="total => `共 ${total} 条`"
				:total="total"
				show-size-changer
				:page-size-options="pageSizeOptions"
				@change="onChange"
				@showSizeChange="onShowSizeChange"
			>
			</a-pagination>
		</div>
		<p class="next-btn-wrap">
			<a-button
				type=""
				@click="prev"
				>返回</a-button
			>
			<a-button
				type="primary"
				@click="next"
				style="margin-left: 20px"
				>下一步</a-button
			>
		</p>
	</div>
</template>

<script>
import { columns } from './config/step1Table';
import { getContractList } from '@/v2/api/transfer.js';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			columns,
			total: 0,
			pageSizeOptions: ['10', '20', '30', '40', '50'],
			pageSize: 10,
			pageNum: 1,
			selectedRowKeys: [],
			loading: false,
			data: []
		};
	},
	methods: {
		reset() {
			this.form.resetFields();
			this.pageNum = 1;
			this.pageSize = 10;
			this.getDataList();
		},
		search() {
			this.pageNum = 1;
			this.pageSize = 10;
			this.getDataList();
		},
		onChange() {},
		onShowSizeChange(current, pageSize) {
			this.pageSize = pageSize;
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				}
			});
		},
		prev() {
			this.$router.back();
		},
		next() {
			if (!this.selectedRowKeys.length) {
				this.$message.warning('请选择待开具货转的合同');
				// return;
			}
			// const { generateWay, contractNo } = this.selectedRowKeys[0];
			this.$emit('next', {
				view: 1
				// generateWay,
				// contractNo,
			});
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		getDataList() {
			this.loading = true;
			getContractList({
				...this.form.getFieldsValue(),
				pageNum: this.pageNum,
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
		}
	},
	mounted() {
		this.getDataList();
	}
};
</script>

<style lang="less" scoped>
.pagination-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.next-btn-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
