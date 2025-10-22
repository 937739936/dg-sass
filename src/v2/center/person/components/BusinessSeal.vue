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
						<template #title>此处选择的印模内容，后续将展示在印章上</template>
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
						:validate-status="getFieldStatus('name', record.id).validateStatus"
						:help="getFieldStatus('name', record.id).errorMsg"
					>
						<a-select
							placeholder="请选择"
							v-model="record.name"
							@blur="itemChange('name', record, index)"
							:key="record.id"
						>
							<a-select-option
								v-for="(items, index) in businessSealList"
								:key="index"
								:value="items.name"
							>
								{{ items.name }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</template>
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>使用场景</span
				>
				<template
					slot="applicationScenarios"
					slot-scope="text, record, index"
				>
					<a-form-item
						:validate-status="getFieldStatus('applicationScenarios', record.id).validateStatus"
						:help="getFieldStatus('applicationScenarios', record.id).errorMsg"
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
			style="margin-bottom: 20px"
			>新增</a-button
		>
	</div>
</template>

<script>
const columns = [
	{ slots: { title: 'customTitles1' }, dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{
		slots: { title: 'customTitles2' },
		dataIndex: 'applicationScenarios',
		key: 'applicationScenarios',
		scopedSlots: { customRender: 'applicationScenarios' }
	},
	{ title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
];
import { API_SealBusinessTypeList } from '@/v2/api/account';
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
			sameFlag: false, // 判断是否有相同印模内容
			goodModelCountData: [],
			businessSealList: []
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
		}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			}
		}
	},
	created() {
		this.getSealBusinessTypeList();
	},
	methods: {
		async getSealBusinessTypeList() {
			// 获取所有的业务章类型
			let res = await API_SealBusinessTypeList();
			this.businessSealList = res.data;
		},
		updateData(data) {
			// 时刻更新选中数据
			this.selected = data;
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
		},
		//添加行
		addRow(index) {
			let emptyRow = {
				id: new Date().getTime(),
				applicationScenarios: undefined,
				name: undefined,
				type: 'PICKUP_GOODS_SEAL'
			};
			if (this.selected && this.selected.length === 0) {
				this.selected.push(emptyRow);
				return;
			}

			this.selected.splice(index + 1, 0, emptyRow);
		},
		//修改表单项脏值
		validateName(name, value, index) {
			if (!value) {
				return {
					validateStatus: 'error',
					errorMsg: '该选项必填'
				};
			}
			if (name == 'name' && value) {
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
						errorMsg: '业务章名称已存在'
					};
				}
				return {
					validateStatus: 'success',
					errorMsg: ''
				};
			}
			return {
				validateStatus: 'success',
				errorMsg: ''
			};
		},
		itemChange(name, record, index) {
			let id = record.id;
			const newData = [...this.selected];
			const target = newData.filter(item => item.id === id)[0];
			if (target) {
				const { errorMsg, validateStatus } = this.validateName(name, record[name], index);
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
		getFieldStatus(name, id) {
			const data = this.goodModelCountData.filter(item => id === item.id && name === item.name)[0];
			if (data) {
				return data;
			}
			return {
				errorMsg: '',
				validateStatus: 'success'
			};
		},
		save() {
			// 外部父组件保存调用 error不传值
			let isPass = true;
			for (let i = 0; i < this.selected.length; i++) {
				let project = this.selected[i];
				for (let pro in project) {
					if (pro !== 'id') {
						if (pro !== 'idNumber' && pro !== 'authorizedDateStart' && pro !== 'authorizedDateEnd') {
							this.itemChange(pro, project, i);
							if (this.getFieldStatus(pro, project.id).validateStatus !== 'success') {
								isPass = isPass && false;
								break;
							} else {
								isPass = isPass && true;
							}
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
