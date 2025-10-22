<template>
	<div>
		<p class="contract-title">
			<span>提货方式</span>
		</p>
		<a-form
			:form="formType"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="提货方式">
						<a-select
							v-decorator="[
								'takeType',
								{
									rules: [{ required: true, message: '请选择提货方式!' }]
								}
							]"
							placeholder="请选择提货方式"
							:disabled="disabledAll"
							style="width: 100%;"
						>
							<a-select-option
								:value="item.value"
								v-for="item in takeTypeEnum"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<div v-if="formType.getFieldValue('takeType') == 'CARSHIPNO'">
				<p class="contract-title">
					<span class="card-info"
						>车辆信息录入方式
						<span style="color: #f5222d">(车船号和身份证号至少有一个必须填写)</span>
					</span>
					<span>
						<a-button
							type="default"
							:disabled="disabledAll"
							@click="templateDownloadApplyMethod"
							><a-icon type="download" />模板下载</a-button
						>
						<a-upload
							name="file"
							:multiple="false"
							:action="action"
							:headers="headers"
							@change="handleApplyChange"
							style="margin-left: 20px"
							:accept="acceptFormat"
							:showUploadList="false"
						>
							<a-button
								type="primary"
								:disabled="disabledAll"
							>
								<a-icon type="upload" /> 批量导入
							</a-button>
						</a-upload>
					</span>
				</p>
				<a-table
					rowKey="id"
					:columns="columnsCar"
					:data-source="dataCar"
					:scroll="{ x: 1000, y: 300 }"
					:pagination="false"
				>
					<span slot="carNumber"> <span class="table-required"></span>车船号 </span>
					<span
						slot="id"
						slot-scope="text, record"
					>
						{{ record.index }}
					</span>
					<span
						slot="carNumber"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carNumber"
							size="small"
							:disabled="disabledAll"
						/>
					</span>
					<span
						slot="carName"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carName"
							size="small"
							:disabled="disabledAll"
						/>
					</span>
					<span
						slot="carTel"
						slot-scope="text, record"
					>
						<a-input-number
							v-model="record.carTel"
							size="small"
							:maxLength="11"
							:disabled="disabledAll"
							style="width: 100%"
						/>
					</span>
					<span
						slot="carId"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carId"
							size="small"
							:maxLength="18"
							:disabled="disabledAll"
						/>
					</span>
					<a
						slot="methods"
						slot-scope="text, record"
					>
						<a-button
							type="primary"
							shape="circle"
							icon="plus"
							@click="addCar(record)"
							:disabled="disabledAll"
						/>
						<a-button
							style="margin-left: 10px"
							v-if="record.id >= 1"
							type="danger"
							shape="circle"
							icon="minus"
							@click="minusCar(record)"
							:disabled="disabledAll"
						/>
					</a>
				</a-table>
			</div>
		</a-form>
	</div>
</template>

<script>
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import ENV from '@/v2/config/env';
import { columnsCar } from '../../../config/stockStep2';
export default {
	props: {
		list: {
			default: () => []
		}
	},
	data() {
		return {
			formType: this.$form.createForm(this, { name: 'formType' }),
			takeTypeEnum: filterCodeBySteelKey('takeType'),
			acceptFormat: '.xlsx,.xls',
			action: `${ENV.BASE_GANG_API}/takeDeliveryApply/takeModelmportExcel`,
			dataCar: [],
			columnsCar,
			ENV,
			publicPath: process.env.BASE_URL
		};
	},
	watch: {
		list: {
			handler(val) {
				this.dataCar = val;
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
				// appointSpec: this.appointSpec
			};
		}
	},
	methods: {
		handleApplyChange({ file }) {
			const { response } = file;
			if (response && response?.success) {
				this.$message.success('导入成功');
				response.data.forEach((item, index) => {
					const currentIndex = ++index;
					item.id = currentIndex;
					item.index = currentIndex;
				});
				this.dataCar = response.data;
			}
			if (response && response.error) {
				this.$message.error(`导入失败:${response.error.message}`);
			}
		},
		templateDownloadApplyMethod() {
			window.location.href = this.publicPath + 'files/提货申请车船号导入模板.xlsx';
		},
		addCar() {
			let length = this.dataCar.length;
			let currentIndex = ++length;
			this.dataCar.push({
				id: currentIndex,
				index: currentIndex,
				carNumber: '',
				carName: '',
				carTel: '',
				carId: ''
			});
		},
		minusCar(item) {
			this.dataCar.splice(--item.index, 1);
		},
		init(takeType) {
			this.formType.setFieldsValue({ takeType });
		},
		save() {
			const takeType = this.formType.getFieldValue('takeType');
			if (!takeType) {
				this.$message.error('请选择提货方式');
				return;
			}
			return {
				takeType,
				dataCar: this.dataCar
			};
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.contract-title {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
</style>
