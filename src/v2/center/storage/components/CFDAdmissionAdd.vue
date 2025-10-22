<!-- 曹妃甸-新增/修改入港信息 -->
<template>
	<div class="admission-add-cfd">
		<a-modal
			class="admission-add-cfd-model"
			v-model="visible"
			:title="title + '入港信息'"
			okText="保存"
			@ok="handleOk"
			@cancel="visible = false"
			:width="660"
		>
			<a-form-model
				v-if="visible"
				ref="addForm"
				:model="form"
				:rules="rules"
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
			>
				<!-- 输入时只能是易煤的核心企业类型，模糊显示10条核心企业清单 -->
				<a-form-model-item
					prop="companyName"
					label="公司名称"
				>
					<a-select
						v-model="form.companyName"
						show-search
						placeholder="请输入公司名称"
						:default-active-first-option="false"
						:show-arrow="false"
						:not-found-content="fetching ? undefined : '暂无数据'"
						@select="handleNameSelect"
						@search="getCompanyList"
					>
						<a-spin
							v-if="fetching"
							slot="notFoundContent"
							size="small"
						/>
						<a-select-option
							v-for="item in companyNameList"
							:key="item.id"
							:value="JSON.stringify(item)"
							>{{ item.name }}</a-select-option
						>
					</a-select>
				</a-form-model-item>
				<a-form-model-item
					prop="inDate"
					label="进港时间"
				>
					<a-date-picker
						v-model="form.inDate"
						format="YYYY-MM-DD"
						@change="handleDateChange"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="stackNo"
					label="存放垛位号"
				>
					<a-input
						v-model="form.stackNo"
						placeholder="请输入存放垛位号"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="operateType"
					label="作业方式"
				>
					<a-select
						v-model="form.operateType"
						placeholder="请选择"
						@change="handleTypeChange"
					>
						<a-select-option
							v-for="item in operateTypeList"
							:key="item.value"
							:value="item.value"
							>{{ item.text }}</a-select-option
						>
					</a-select>
				</a-form-model-item>
				<!-- 3-列车入港卸货 4-船舶入港卸货 -->
				<a-form-model-item
					v-if="form.operateType == '4' || form.operateType == '3'"
					prop="shipName"
					label="车次/船名"
				>
					<a-input
						v-model="form.shipName"
						placeholder="请输入车次/船名"
					/>
				</a-form-model-item>
				<a-form-model-item
					v-if="form.operateType == '3'"
					prop="firstTrainNo"
					label="首车号"
				>
					<a-input
						v-model="form.firstTrainNo"
						placeholder="请输入首车号"
					/>
				</a-form-model-item>
				<a-form-model-item
					v-if="form.operateType == '3'"
					prop="lastTrainNo"
					label="尾车号"
				>
					<a-input
						v-model="form.lastTrainNo"
						placeholder="请输入尾车号"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="category"
					label="煤种"
				>
					<a-input
						v-model="form.category"
						placeholder="请输入煤种"
					/>
				</a-form-model-item>
				<a-form-model-item
					prop="weightTons"
					label="吨数"
				>
					<a-input
						v-model="form.weightTons"
						placeholder="请输入吨数"
					/>
				</a-form-model-item>
				<a-form-model-item label="备注">
					<a-input
						v-model="form.remark"
						placeholder="请输入备注"
					/>
				</a-form-model-item>
			</a-form-model>
		</a-modal>
	</div>
</template>
<script>
import moment from 'moment';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_postWarehouseHarborInInsert,
	API_postWarehouseHarborInUpdate,
	API_getCompanyProfileListCoreCompanyByName
} from '@/v2/center/storage/api';
export default {
	name: 'AdmissionAddCFD',
	data() {
		return {
			title: '新增',
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			form: {},
			rules: {
				companyName: [{ required: true, message: '请输入公司名称', trigger: ['blur', 'change'] }],
				inDate: [{ required: true, message: '请选择进港时间', trigger: ['blur', 'change'] }],
				operateType: [{ required: true, message: '请选择作业方式', trigger: ['blur', 'change'] }],
				stackNo: [
					{ required: true, message: '请输入存放垛位号', trigger: ['blur', 'change'] },
					{ pattern: /^\d+-\d+$/, message: '请用短横线前后数字，样式如1-1', trigger: ['blur', 'change'] }
				],
				shipName: [{ required: true, message: '请输入车次/船名', trigger: ['blur', 'change'] }],
				firstTrainNo: [{ required: true, message: '请输入首车号', trigger: ['blur', 'change'] }],
				lastTrainNo: [{ required: true, message: '请输入尾车号', trigger: ['blur', 'change'] }],
				category: [{ required: true, message: '请输入煤种', trigger: ['blur', 'change'] }],
				weightTons: [
					{ required: true, message: '请输入吨数', trigger: ['blur', 'change'] },
					{ pattern: /^\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change'] }
				]
			},
			isEdit: false,
			visible: false,
			fetching: false,
			companyNameList: [],
			timer: null,
			formCache: null
		};
	},
	computed: {
		operateTypeList() {
			let listDefault = filterCodeByKey('harbor_operate_type');
			let list = ['列车入港卸货', '场地货转入', '船舶入港卸货'];
			let arr = listDefault.filter(item => {
				return list.indexOf(item.text) > -1;
			});
			return arr;
		}
	},
	methods: {
		moment(val) {
			return moment(val).locale('zh-cn').format('YYYY-MM-DD');
		},
		init(isEdit, obj) {
			this.companyNameList = [];
			this.isEdit = isEdit;
			this.title = isEdit ? '修改' : '新增';
			this.form = isEdit ? Object.assign({}, obj) : { inDate: this.moment(new Date()) };
			if (isEdit) {
				this.form = {
					companyName: obj.companyName,
					companyId: obj.companyId,
					inDate: obj.inDate,
					operateType: obj.operateType + '',
					shipName: obj.shipName,
					remark: obj.remark,
					category: obj.category,
					stackNo: obj.stackNo,
					firstTrainNo: obj.firstTrainNo,
					lastTrainNo: obj.lastTrainNo,
					weightTons: obj.weightTons,
					id: obj.id
				};
				this.getCompanyList(obj.companyName, true);
			} else {
				this.form = { inDate: this.moment(new Date()) };
			}
			this.formCache = Object.assign({}, this.form);
			this.visible = true;
		},
		handleDateChange(val, string) {
			this.form.inDate = string;
		},
		// 对于车次/船名、首车号、尾车号这三个字段，切换作业方式时，如果是新建则清空，如果是修改，作业方式和初始值一致时，使用原始值，否则请清空
		handleTypeChange(val) {
			this.form.operateType = val;
			if (this.isEdit && val === this.formCache.operateType) {
				this.form = {
					...this.form,
					shipName: this.formCache.shipName,
					firstTrainNo: this.formCache.firstTrainNo,
					lastTrainNo: this.formCache.lastTrainNo
				};
			} else {
				this.form = {
					...this.form,
					shipName: undefined,
					firstTrainNo: undefined,
					lastTrainNo: undefined
				};
			}
		},
		handleOk() {
			this.$refs.addForm.validate(valid => {
				if (valid) {
					let params = {
						...this.form,
						harborType: 2 // 2-华能曹妃甸
					};
					if (this.isEdit) {
						API_postWarehouseHarborInUpdate(params).then(resp => {
							if (resp.success) {
								this.visible = false;
								this.$message.success('修改成功');
								this.$emit('updateConfirm');
							}
						});
					} else {
						API_postWarehouseHarborInInsert(params).then(resp => {
							if (resp.success) {
								this.visible = false;
								this.$message.success('新增成功');
								this.$emit('addConfirm');
							}
						});
					}
				}
			});
		},
		// 模糊查询公司名称
		getCompanyList(name, isInit) {
			if (!name) return false;
			clearTimeout(this.timer);
			this.fetching = true;
			this.timer = setTimeout(() => {
				API_getCompanyProfileListCoreCompanyByName({
					keyword: name
				}).then(resp => {
					this.fetching = false;
					if (resp.success) {
						let list = resp.result || [];
						let arr = [];
						list.forEach(item => {
							arr.push({
								id: item.id,
								name: item.name
							});
						});
						this.companyNameList = arr;
						if (isInit) this.handleNameSelect(this.form.companyId);
					}
				});
			}, 300);
		},
		handleNameSelect(val) {
			let obj = JSON.parse(val);
			this.form.companyName = obj.name;
			this.form.companyId = obj.id;
		}
	}
};
</script>
<style lang="less" scoped>
.admission-add-cfd-model {
	::v-deep.ant-calendar-picker {
		display: inline-block;
		width: 100%;
	}
}
</style>
