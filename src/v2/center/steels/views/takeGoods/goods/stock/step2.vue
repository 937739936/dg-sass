<template>
	<div>
		<a-alert
			message="规则说明：系统根据您选择提货的库存明细，按照先进先出的原则自动匹配对应的订单，您也可以自行调整每个订单的提货数量或者件数。"
			type="info"
			show-icon
			style="margin-bottom: 20px"
		/>
		<p class="contract-title">
			<span>提货清单</span>
		</p>
		<a-table
			class="contract-table-wrap"
			:row-selection="rowSelection"
			:columns="columns"
			:data-source="data"
			:pagination="false"
			:scroll="{ x: 1200, y: 240 }"
		/>
		<p class="contract-title">
			<span>提货方式</span>
		</p>
		<a-form
			:form="formType"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			@submit="handleSubmitType"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="提货方式">
						<a-select
							v-decorator="[
								'gender',
								{
									rules: [{ required: true, message: '请选择提货方式!' }]
								}
							]"
							placeholder="请选择提货方式"
						>
							<a-select-option value="male"> male </a-select-option>
							<a-select-option value="female"> female </a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="预计提货日期">
						<a-date-picker
							style="width: 100%"
							v-decorator="[
								'date',
								{
									rules: [{ required: true, message: '请选择预计提货日期!' }]
								}
							]"
							placeholder="请选择预计提货日期"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<div>
				<p class="contract-title">
					<span class="card-info">车辆信息录入方式</span>
				</p>
				<a-tabs
					default-active-key="1"
					class="a-tabs-child-table"
				>
					<a-tab-pane
						key="1"
						tab="手动录入"
					>
						<a-table
							bordered
							:columns="columnsList"
							:data-source="dataList"
							:pagination="false"
							:scroll="{ y: 240 }"
						>
							<span slot="carNumber"> <span class="table-required">*</span>车船号 </span>
							<span
								slot="carNumber"
								slot-scope="text, record"
							>
								<a-input v-model="record.carNumber" />
							</span>
							<span
								slot="carName"
								slot-scope="text, record"
							>
								<a-input v-model="record.carName" />
							</span>
							<span
								slot="carTel"
								slot-scope="text, record"
							>
								<a-input v-model="record.carTel" />
							</span>
							<span
								slot="carId"
								slot-scope="text, record"
							>
								<a-input v-model="record.carId" />
							</span>
							<span
								slot="methods"
								slot-scope="text, record"
							>
								<a-button
									type="primary"
									shape="circle"
									icon="plus"
								/>
								<a-button
									style="margin-left: 10px"
									type="danger"
									shape="circle"
									icon="minus"
								/>
							</span>
						</a-table>
					</a-tab-pane>
					<a-tab-pane
						key="2"
						tab="Excel导入"
					>
						<div style="width: 100%">
							<div class="input-wrap">
								<div class="input-wrap-btn">
									<a-upload
										name="file"
										:multiple="false"
										:action="action"
										:accept="acceptFormat"
										:headers="headers"
										@change="handleChange"
									>
										<a-button> <a-icon type="upload" /> 上传文件 </a-button>
									</a-upload>
									<a-button
										type="primary"
										style="margin-left: 20px"
									>
										<a-icon type="download" />模板下载
									</a-button>
								</div>
								<a-alert
									style="width: 540px; position: relative; left: -400px"
									message="操作要求："
									type="info"
									show-icon
									description="1.该功能仅支持上传Excel文件（*.xls、*.xlsx），请下载模板填写后上传。2.请务必将必填字段填写准确完整，否则可能识别、添加失败。"
								/>
							</div>
							<a-table
								bordered
								:columns="columnsListUpload"
								:data-source="dataList"
								:pagination="false"
								:scroll="{ y: 240 }"
							>
							</a-table>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-form>

		<div class="footer-btn-wrap">
			<p>
				<a-button @click="prev">返回</a-button>
				<a-button style="margin-left: 40px">保存</a-button>
				<a-button
					type="primary"
					style="margin-left: 40px"
					@click="next"
					>提交</a-button
				>
			</p>
		</div>
	</div>
</template>

<script>
import Pagination from '../../components/pagination.vue';
import { columns, columnsList, columnsListUpload } from '../../config/stockStep2';
import { API_UPLOAD_FILE } from '@/v2/api';
import { mapGetters } from 'vuex';
export default {
	name: 'step2',
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			formType: this.$form.createForm(this, { name: 'formType' }),
			formCar: this.$form.createForm(this, { name: 'formCar' }),
			data: [],
			dataList: [],
			columns,
			selectedRowKeys: [],
			columnsList,
			columnsListUpload,
			acceptFormat: '.xlsx,.xls',
			action: API_UPLOAD_FILE
		};
	},
	components: {
		Pagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				type: 'checkbox',
				selections: [],
				onSelection: this.onSelection
			};
		}
	},
	methods: {
		handleChange(info) {},
		prev() {
			this.$emit('next', 0);
		},
		next() {
			this.$emit('next', 2);
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		handleSubmitType(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				}
			});
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
	margin-top: 40px;
}
.title-wrap {
	width: 100%;
	height: 30px;
	display: flex;
	flex-direction: row;
	font-weight: bold;
}
.contract-title {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
.contract-table-wrap {
	::v-deep .ant-table-thead tr:first-child th:first-child {
		padding-left: 0;
	}
}
.table-required {
	color: #f5222d;
}
.card-info::before {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	font-family: SimSun, sans-serif;
	line-height: 1;
	content: '*';
}
.input-wrap {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}
.input-wrap-btn {
	display: flex;
}
</style>
