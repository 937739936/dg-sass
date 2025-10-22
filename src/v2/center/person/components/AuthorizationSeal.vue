<template>
	<div>
		<a-form :form="form">
			<a-table
				v-if="selected && selected.length > 0"
				:columns="columns"
				:scroll="{ x: true }"
				:dataSource="selected"
				:pagination="false"
				rowKey="id"
				style="margin-top: 10px"
			>
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>印模内容
					<a-tooltip>
						<template #title>此处填写的授权代表名字，填写后将展示在印章上</template>
						<a-icon
							type="question-circle"
							theme="filled"
							style="fontsize: 16px; position: relative; top: 1px; left: 3px"
						/>
					</a-tooltip>
				</span>
				<template
					slot="name"
					slot-scope="text, record, index"
				>
					<a-form-item
						:validate-status="getFieldStatus('name', record).validateStatus"
						:help="getFieldStatus('name', record).errorMsg"
					>
						<a-input
							placeholder="请输入授权代表姓名"
							v-model.trim="record.name"
							@blur="itemChange('name', record, index)"
							:key="record.id"
							:max-length="10"
						></a-input>
					</a-form-item>
				</template>
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>授权代表身份证号</span
				>
				<template
					slot="idNumber"
					slot-scope="text, record, index"
				>
					<a-form-item
						:validate-status="getFieldStatus('idNumber', record).validateStatus"
						:help="getFieldStatus('idNumber', record).errorMsg"
					>
						<a-input
							placeholder="请输入授权代表身份证号"
							v-model.trim="record.idNumber"
							@blur="itemChange('idNumber', record, index)"
							:key="record.id"
							:max-length="20"
						></a-input>
					</a-form-item>
				</template>
				<span slot="customTitles3"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>使用场景</span
				>
				<template
					slot="applicationScenarios"
					slot-scope="text, record, index"
				>
					<a-form-item
						:validate-status="getFieldStatus('applicationScenarios', record).validateStatus"
						:help="getFieldStatus('applicationScenarios', record).errorMsg"
					>
						<a-input
							placeholder="请备注该印章将被盖在哪些单据上,最多20字"
							v-model.trim="record.applicationScenarios"
							@blur="itemChange('applicationScenarios', record, index)"
							:key="record.id"
							:max-length="20"
						></a-input>
					</a-form-item>
				</template>
				<span slot="customTitles4"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>授权时间</span
				>
				<template
					slot="authorizedDate"
					slot-scope="text, record, index"
				>
					<a-form-item
						:validate-status="getFieldStatus('authorizedDate', record).validateStatus"
						:help="getFieldStatus('authorizedDate', record).errorMsg"
					>
						<a-range-picker
							v-model="record.authorizedDate"
							:placeholder="['开始时间', '结束时间']"
							format="YYYY-MM-DD"
							@change="v => getTime(v, record, index)"
							@blur="itemChange('authorizedDate', record, index)"
							style="width: 100%"
						/>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
				>
					<span @click="removeRow(index)"
						><a-icon
							type="minus-circle"
							style="color: red; font-size: 20px; cursor: pointer"
					/></span>
				</template>
			</a-table>
		</a-form>
		<a-button
			v-if="selected && selected.length > 0"
			type="primary"
			@click="addRow(selected.length - 1)"
			>新增</a-button
		>
	</div>
</template>

<script>
import { encryptedData } from '@/v2/utils/factory';
import { API_CHECKIDCARD } from '@/v2/api/account';
import moment from 'moment';
const columns = [
	{ slots: { title: 'customTitles1' }, dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{ slots: { title: 'customTitles2' }, dataIndex: 'idNumber', key: 'idNumber', scopedSlots: { customRender: 'idNumber' } },
	{
		slots: { title: 'customTitles3' },
		dataIndex: 'applicationScenarios',
		key: 'applicationScenarios',
		scopedSlots: { customRender: 'applicationScenarios' }
	},
	{
		slots: { title: 'customTitles4' },
		dataIndex: 'authorizedDate',
		key: 'authorizedDate',
		scopedSlots: { customRender: 'authorizedDate' }
	},
	{ title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'BusinessSeal',
	data() {
		return {
			columns,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				scene: []
			},
			fetching: false,
			saveData: [],
			selected: this.selectedData,
			sameFlag: false, // 判断是否有相同材质的
			goodModelCountData: [],
			showErrorFlag: false
		};
	},
	props: {
		selectedData: {
			// 被选中的指标
			type: Array,
			required: false,
			default: function () {
				return [];
			}
		},
		editable: {
			// 是否可编辑
			type: Boolean
		},
		authorizationSealData: {
			type: Array,
			required: false,
			default: function () {
				return [];
			}
		}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			}
		}
	},
	created() {},
	methods: {
		moment,
		// 获取授权时间
		getTime(value, record, index) {
			if (value.length) {
				record.authorizedDateStart = moment(value[0]).format('YYYY-MM-DD');
				record.authorizedDateEnd = moment(value[1]).format('YYYY-MM-DD');
			} else {
				record.authorizedDateStart = '';
				record.authorizedDateEnd = '';
				record.authorizedDate = undefined;
			}
			this.itemChange('authorizedDate', record, index);
		},
		updateData(data) {
			// 时刻更新选中数据
			this.selected = data;
			if (this.selected.length > 0 && this.$route.query.type === 'edit') {
				this.selected.forEach(item => {
					if (this.authorizationSealData.length && item.name) {
						item.authorizedDate = [moment(item.authorizedDateStart), moment(item.authorizedDateEnd)];
					}
				});
			}
		},
		checkData() {
			// 每次删除数据后校验下印模内容是否重复
			if (this.selected.length) {
				this.selected.forEach((item, index) => {
					this.itemChange('name', item, index);
				});
			}
		},
		//删除行
		removeRow(index) {
			this.selected.splice(index, 1);
			this.checkData();
			this.showErrorFlag = false;
		},
		//添加行
		addRow(index) {
			let emptyRow = {
				id: new Date().getTime(),
				applicationScenarios: undefined,
				name: undefined,
				type: 'AUTHORIZED_PERSON_SEAL',
				authorizedDate: undefined,
				idNumber: undefined
			};
			if (this.selected && this.selected.length === 0) {
				this.selected.push(emptyRow);
				return;
			}

			this.selected.splice(index + 1, 0, emptyRow);
			this.showErrorFlag = false;
		},
		async validateIdCard(record) {
			// 校验身份证号
			let res = await API_CHECKIDCARD({ name: record.name, idCard: await encryptedData(record.idNumber) });
			if (!res.data.result) {
				return {
					validateStatus: 'error',
					errorMsg: res.data.message === '不一致' ? '姓名和身份证号不一致' : res.data.message
				};
			} else {
				return {
					validateStatus: 'success',
					errorMsg: ''
				};
			}
		},
		//修改表单项脏值
		async validateName(name, record, index) {
			let value = record[name];
			if (!value) {
				// 校验必填项
				return {
					validateStatus: 'error',
					errorMsg: '该选项必填'
				};
			}
			if (name == 'name' && value) {
				// 校验印模内容不能重复
				this.sameFlag = false;
				if (this.selected.length > 1) {
					for (let i = 0; i < this.selected.length; i++) {
						let obj = this.selected[i];
						if (value === obj.name && index !== i) {
							this.sameFlag = this.sameFlag || true;
						} else {
							this.sameFlag = this.sameFlag || false;
						}
					}
				}
				if (this.sameFlag) {
					return {
						validateStatus: 'error',
						errorMsg: '授权代表名称已存在'
					};
				} else {
					if (record.idNumber) {
						// 校验身份证号
						this.itemChange('idNumber', record, index);
					}
				}
			}
			if (name === 'idNumber' && value && record.name) {
				// 校验身份证号
				return await this.validateIdCard(record);
			}
			return {
				validateStatus: 'success',
				errorMsg: ''
			};
		},
		async itemChange(name, record, index) {
			// 表格项失去焦点
			let id = record.id;
			const newData = [...this.selected];
			const target = newData.filter(item => item.id === id)[0];
			if (target) {
				const { errorMsg, validateStatus } = await this.validateName(name, record, index);
				let flag = true;
				this.goodModelCountData.forEach(val => {
					if (val.id === id && val.name === name) {
						flag = false;
						(val.errorMsg = errorMsg), (val.validateStatus = validateStatus);
					}
				});
				if (flag) {
					this.goodModelCountData.push({
						id,
						errorMsg,
						validateStatus,
						name
					});
				}
				this.selected = newData;
			}
		},
		getFieldStatus(name, record) {
			const data = this.goodModelCountData.filter(item => record.id === item.id && name === item.name)[0];
			if (data) {
				return data;
			} else {
				if (this.showErrorFlag) {
					if (!record[name]) {
						return {
							errorMsg: '该选项必填',
							validateStatus: 'error'
						};
					} else {
						return {
							errorMsg: '',
							validateStatus: 'success'
						};
					}
				} else {
					return {
						errorMsg: '',
						validateStatus: 'success'
					};
				}
			}
		},
		save() {
			// 外部父组件保存调用 error不传值
			let isPass = true;
			for (let i = 0; i < this.selected.length; i++) {
				let project = this.selected[i];
				for (let pro in project) {
					if (pro !== 'id') {
						this.showErrorFlag = true;
						if (this.getFieldStatus(pro, project).validateStatus !== 'success') {
							isPass = isPass && false;
							break;
						} else {
							isPass = isPass && true;
						}
					}
				}
			}
			if (isPass) {
				return this.selected;
			}
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep {
	.ant-form-item {
		margin-bottom: 0;
	}
	.ant-form-explain {
		color: red;
	}
}
</style>
