<template>
	<div>
		<p class="contract-title">
			<span>基本信息</span>
		</p>
		<a-form
			:form="form"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
			@submit="handleSubmit"
			labelAlign="left"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input v-decorator="['contractNo']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="卖方名称">
						<a-input v-decorator="['sellCompanyName']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="钢材种类">
						<a-input v-decorator="['steelTypeDesc']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="业务类型">
						<a-input v-decorator="['businessTypeDesc']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同期限">
						<a-input v-decorator="['validity']" />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="验收日期">
						<a-date-picker
							style="width: 100%"
							v-decorator="[
								'acceptanceDate',
								{
									rules: [{ required: true, message: '请选择验收日期!' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="货转开具日期">
						<a-date-picker
							style="width: 100%"
							v-decorator="[
								'cargoTransferIssueDate',
								{
									rules: [{ required: true, message: '请选择货转开具日期!' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<p class="contract-title">
			<span>待开具货转清单</span>
			<a-button type="primary">待开具导出</a-button>
		</p>
		<a-table
			:columns="columns"
			:scroll="{ x: 1200, y: 300 }"
			:row-selection="{
				selectedRowKeys: selectedRowKeys,
				onChange: onSelectChange,
				type: 'checkbox'
			}"
		>
		</a-table>
		<p class="contract-title">
			<span>本次货转清单</span>
			<span>
				<a-button type="link"> 模板下载 </a-button>
				<a-button type="primary">文件导入</a-button>
			</span>
		</p>
		<a-table
			:columns="columnsTrans"
			:pagination="false"
			:data-source="dataTrans"
			:scroll="{ x: 1200, y: 240 }"
		>
			<span slot="materialName"> <span class="table-required">*</span>品名 </span>
			<span slot="materialTexture"> <span class="table-required">*</span>材质 </span>
			<span slot="specs"> <span class="table-required">*</span>规格 </span>
			<span slot="placeOfOrigin"> <span class="table-required">*</span>产地 </span>
			<span slot="pieceQuantity"> <span class="table-required">*</span>本次货转件数 </span>
			<span slot="quantity"> <span class="table-required">*</span>数量 </span>
			<span
				slot="pieceNumber"
				slot-scope="text, record"
			>
				<a-input-number
					v-model="record.pieceNumber"
					:min="1"
					:max="99999999999999"
					size="small"
				/>
			</span>
			<span
				slot="weightTheory"
				slot-scope="text, record"
			>
				<a-input-number
					v-model="record.weightTheory"
					:min="1"
					:max="99999999999999"
					size="small"
				/>
			</span>
			<span
				slot="NumberEstimate"
				slot-scope="text, record"
			>
				<a-input-number
					v-model="record.NumberEstimate"
					:min="1"
					:max="99999999999999"
					size="small"
				/>
			</span>
			<span
				slot="customTitleMeasurement"
				slot-scope="text, record"
			>
				<a-input-number
					v-model="record.customTitleMeasurement"
					:min="1"
					:max="99999999999999"
					size="small"
				/>
			</span>
			<span
				slot="takeNumber"
				slot-scope="text, record"
			>
				<a-input-number
					v-model="record.takeNumber"
					:min="1"
					:max="99999999999999"
					size="small"
				/>
			</span>
			<span
				slot="warehousePosition"
				slot-scope="text, record"
			>
				<a-input
					v-model="record.warehousePosition"
					:maxLength="15"
					size="small"
				/>
			</span>
			<span
				slot="remarks"
				slot-scope="text, record"
			>
				<a-input
					v-model="record.remarks"
					:maxLength="50"
					size="small"
				/>
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
		<p class="contract-title">
			<span>货权证明</span>
		</p>
		<a-table
			:columns="columnsProve"
			:pagination="false"
			:scroll="{ x: 1200, y: 240 }"
		>
		</a-table>
		<a-button
			type="dashed"
			block
			@click="showModal"
		>
			<a-icon type="plus" />新增附件
		</a-button>
		<p class="footer-wrap">
			<a-button
				type=""
				@click="back"
			>
				返回
			</a-button>
			<a-button
				type="primary"
				style="margin-left: 20px"
				@click="next"
			>
				提交
			</a-button>
		</p>
		<a-modal
			title="附件信息"
			:visible="visible"
			:confirm-loading="confirmLoading"
			@ok="handleOk"
			@cancel="handleCancel"
		>
			<a-form
				:form="formModel"
				:label-col="{ span: 5 }"
				:wrapper-col="{ span: 12 }"
				@submit="handleSubmitModel"
			>
				<a-form-item label="附件类型">
					<a-select
						v-decorator="[
							'gender',
							{
								rules: [{ required: true, message: '请选择附件类型!' }]
							}
						]"
						placeholder="请选择附件类型"
					>
						<a-select-option value="male"> male </a-select-option>
						<a-select-option value="female"> female </a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="附件类型">
					<a-upload
						name="file"
						list-type="picture-card"
						class="avatar-uploader"
						:multiple="true"
						:action="action"
						:before-upload="beforeUpload"
						@change="handleChange"
						:accept="acceptFormat"
						:fileList="fileList"
						:headers="headers"
						v-decorator="[
							'file',
							{
								rules: [{ required: true, message: '请选择附件!' }]
							}
						]"
					>
						<div v-if="fileList.length < 100">
							<a-icon :type="loading ? 'loading' : 'plus'" />
							<div class="ant-upload-text">点击选择</div>
						</div>
					</a-upload>
				</a-form-item>
			</a-form>
			<div>
				<p>附件上传要求：</p>
				<p>可支持格式为jpg，jpeg，png，gif，pdf，docx，doc，xlsx，xls的附件，单个附件大小不得超过100M的文件。</p>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { columns, columnsTrans, columnsProve } from './config/step2Table';
import { API_UPLOAD_FILE } from '@/v2/api';
import { mapGetters } from 'vuex';
import { getContractInfo, saveSupplement } from '@/v2/api/transfer.js';
export default {
	props: {
		type: {
			type: String,
			default: 'PAYMENT_ACCOUNTING_TABLE'
		},
		contractNo: {
			type: String,
			default: ''
		},
		generateWay: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			formModel: this.$form.createForm(this, { name: 'formModel' }),
			selectedRowKeys: [],
			columns,
			columnsTrans,
			columnsProve,
			visible: false,
			confirmLoading: false,
			loading: false,
			action: API_UPLOAD_FILE,
			acceptFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls',
			fileList: [],
			dataTrans: []
		};
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
		}
	},
	watch: {
		contractNo: {
			handler(newValue) {
				if (newValue) {
					this.getConstractDeatis();
				}
			},
			immediate: true
		}
	},
	methods: {
		// 获取合同详情
		getConstractDeatis() {
			getContractInfo({
				generateWay: this.generateWay,
				contractNo: this.contractNo
			}).then(res => {});
		},
		back() {
			this.$emit('next', 0);
		},
		next() {
			this.form.validateFields((err, values) => {
				if (!err) {
					const { acceptanceDate, cargoTransferIssueDate } = this.form.getFieldsValue();
					saveSupplement({
						acceptanceDate,
						cargoTransferIssueDate,
						purchaseList: this.dataTrans,
						attachList: []
					}).then(res => {});
				}
			});
			this.$emit('next', 2);
		},
		handleChange(info) {
			this.fileList = info.fileList;
		},
		beforeUpload(file) {},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
				}
			});
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		showModal() {
			this.visible = true;
		},
		handleOk(e) {
			this.ModalText = 'The modal will be closed after two seconds';
			this.confirmLoading = true;
			setTimeout(() => {
				this.visible = false;
				this.confirmLoading = false;
			}, 2000);
		},
		handleCancel(e) {
			this.visible = false;
			this.formModel.resetFields();
		},
		handleSubmitModel(e) {
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
.contract-title {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
.table-required {
	color: #f5222d;
}
.footer-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}
</style>
