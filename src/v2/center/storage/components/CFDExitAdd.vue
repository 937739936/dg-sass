<!-- 曹妃甸-新增/修改出港信息 -->
<template>
	<div class="admission-add-cfd">
		<a-modal
			class="admission-add-cfd-model"
			v-model="visible"
			:title="title + '出港信息'"
			okText="保存"
			@ok="handleOk"
			@cancel="visible = false"
			:width="890"
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
					prop="outDate"
					label="出港时间"
				>
					<a-date-picker
						v-model="form.outDate"
						format="YYYY-MM-DD"
						@change="handleDateChange"
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
				<!-- 1-出港装货 -->
				<a-form-model-item
					v-if="form.operateType == '1'"
					prop="shipName"
					label="船名"
				>
					<a-input
						v-model="form.shipName"
						placeholder="请输入船名"
					/>
				</a-form-model-item>

				<a-form-model
					v-for="(row, index) in list"
					:key="index"
					class="admission-add-cfd-form"
					:ref="'addFormInner' + index"
					:model="row"
					:rules="rulesInner"
				>
					<a-row :gutter="24">
						<a-col :span="10">
							<a-form-model-item
								:label-col="{ span: 10 }"
								:wrapper-col="{ span: 10 }"
								prop="stackNo"
								label="取出垛位号"
							>
								<a-input
									v-model="row.stackNo"
									placeholder="请输入取出垛位号"
								/>
								<!-- 修改时，只能修改已有数据，不能添加垛位号 -->
								<img
									v-if="!isEdit && index === 0 && list.length < 5"
									class="operation-btn"
									@click="handleAddItem"
									:src="addIcon"
								/>
								<img
									v-if="!isEdit && index !== 0"
									class="operation-btn"
									@click="handleDeleteItem(index)"
									:src="deleteIcon"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="6">
							<a-form-model-item
								:label-col="labelColInner"
								:wrapper-col="wrapperColInner"
								prop="category"
								label="煤种"
							>
								<a-input
									v-model="row.category"
									placeholder="请输入煤种"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="6">
							<a-form-model-item
								:label-col="labelColInner"
								:wrapper-col="wrapperColInner"
								prop="weightTons"
								label="吨数"
							>
								<a-input
									v-model="row.weightTons"
									placeholder="请输入吨数"
								/>
							</a-form-model-item>
						</a-col>
					</a-row>
				</a-form-model>

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
	API_postWarehouseHarborHncfOutInsert,
	API_postWarehouseHarborOutUpdate,
	API_getCompanyProfileListCoreCompanyByName
} from '@/v2/center/storage/api';
export default {
	name: 'AdmissionAddCFD',
	data() {
		return {
			title: '',
			addIcon: require('@/v2/assets/imgs/storage/add.png'),
			deleteIcon: require('@/v2/assets/imgs/storage/delete.png'),
			labelCol: { span: 4 },
			wrapperCol: { span: 12 },
			labelColInner: { span: 7 },
			wrapperColInner: { span: 17 },
			form: {},
			rulesInner: {
				stackNo: [
					{ required: true, message: '请输入取出垛位号', trigger: ['blur', 'change'] },
					{ pattern: /^\d+-\d+$/, message: '请用短横线前后数字，样式如1-1', trigger: ['blur', 'change'] }
				],
				category: [{ required: true, message: '请输入煤种', trigger: ['blur', 'change'] }],
				weightTons: [
					{ required: true, message: '请输入吨数', trigger: ['blur', 'change'] },
					{ pattern: /^\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change'] }
				]
			},
			rules: {
				companyName: [{ required: true, message: '请输入公司名称', trigger: ['blur', 'change'] }],
				outDate: [{ required: true, message: '请选择出港时间', trigger: ['blur', 'change'] }],
				operateType: [{ required: true, message: '请选择作业方式', trigger: ['blur', 'change'] }],
				shipName: [{ required: true, message: '请输入船名', trigger: ['blur', 'change'] }]
			},
			list: [],
			visible: false,
			isEdit: false,
			fetching: false,
			companyNameList: [],
			timer: null,
			formCache: null
		};
	},
	computed: {
		operateTypeList() {
			let listDefault = filterCodeByKey('harbor_operate_type');
			let list = ['出港装货', '场地货转出'];
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
		// 初始化新增/修改数据
		init(isEdit, obj) {
			this.companyNameList = [];
			this.isEdit = isEdit;
			this.title = isEdit ? '修改' : '新增';
			if (isEdit) {
				this.form = {
					companyName: obj.companyName,
					companyId: obj.companyId,
					outDate: obj.outDate,
					operateType: obj.operateType + '',
					shipName: obj.shipName,
					remark: obj.remark,
					id: obj.id
				};
				this.list = [
					{
						category: obj.category,
						stackNo: obj.stackNo,
						weightTons: obj.weightTons
					}
				];
			} else {
				this.form = { outDate: this.moment(new Date()) };
				this.list = [{}];
			}
			this.formCache = Object.assign({}, this.form);
			this.visible = true;
		},
		// 修改出港时间
		handleDateChange(val, string) {
			this.form.outDate = string;
		},
		// 修改出港方式
		handleTypeChange(val) {
			this.form.operateType = val;
			this.form = {
				...this.form,
				shipName: this.isEdit && val === this.formCache.operateType ? this.formCache.shipName : undefined
			};
		},
		// 确定添加/修改出港信息
		handleOk() {
			this.$refs.addForm.validate(valid => {
				let validInner = true;
				for (let i = 0; i < this.list.length; i++) {
					// 校验每一条取出跺号与相关信息
					this.$refs['addFormInner' + i][0].validate(res => {
						if (!res) validInner = false;
						// 最后一条校验通过，且所有的校验都是true，再往下走逻辑
						if (valid && validInner && i === this.list.length - 1) {
							if (this.isEdit) {
								// 修改
								let params = {
									...this.form,
									...this.list[0],
									harborType: 2 // 2-华能曹妃甸
								};
								API_postWarehouseHarborOutUpdate(params).then(resp => {
									if (resp.success) {
										this.visible = false;
										this.$message.success('修改成功');
										this.$emit('updateConfirm');
									}
								});
							} else {
								// 新增
								let params = {
									...this.form,
									outDetails: this.list,
									harborType: 2 // 2-华能曹妃甸
								};
								API_postWarehouseHarborHncfOutInsert(params).then(resp => {
									if (resp.success) {
										this.visible = false;
										this.$message.success('新增成功');
										this.$emit('addConfirm');
									}
								});
							}
						}
					});
				}
			});
		},
		// 新增一条取出垛位号
		handleAddItem() {
			this.list.push({});
			this.list = [].concat(this.list);
		},
		// 删除一条取出垛位号
		handleDeleteItem(index) {
			this.list.splice(index, 1);
		},
		// 获取公司名称
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
	.admission-add-cfd-form {
		::v-deep.ant-col.ant-col-6 {
			padding-left: 0px !important;
			padding-right: 5px !important;
		}
	}
	.operation-btn {
		position: absolute;
		left: 160px;
		top: 0px;
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
}
</style>
