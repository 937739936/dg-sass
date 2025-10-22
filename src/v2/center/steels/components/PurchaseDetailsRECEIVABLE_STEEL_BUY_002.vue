<template>
	<div class="otherForm">
		<a-row>
			<h3 style="margin: 30px 0; float: left">采购明细表</h3>
			<div style="margin-left: 20px; margin-top: 32px; display: flex; align-items: center; color: red; float: left">
				<span>数量合计（吨）：{{ totalQuantity == 0 ? 0 : totalQuantity.toFixed(3) }}</span>
				<span style="margin-left: 20px">金额合计（元）：{{ totalAmount == 0 ? 0 : totalAmount.toFixed(2) }}</span>
			</div>
			<div style="float: right; display: flex; align-items: center; margin-top: 30px">
				<a
					:href="publicPath + 'files/采购明细.xlsx'"
					class="downloadTemplate"
					style="margin-right: 10px; font-size: 10px"
					>模板下载</a
				>
				<FileUpload
					:action="action"
					:btnDisabled="editable"
					:paramsData="paramsData"
					@uploadFiles="getUploadFiles"
				></FileUpload>
			</div>
		</a-row>
		<a-form :form="form">
			<a-table
				:columns="columns"
				:scroll="{ x: true }"
				:dataSource="selected"
				:pagination="false"
				:rowKey="record => String(record.uuid) + record.id"
				:class="editable ? '' : 'disabled'"
				class="detailsTable"
			>
				<!-- 品名 -->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>品名</span
				>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-select
							:options="cascadeList"
							placeholder="请选择品名"
							@change="changeCascade(record)"
							v-model="record.materialName"
							:disabled="!editable"
							:key="record.id"
							@blur="checkHasRepeat"
						/>
					</a-form-item>
				</template>
				<!--        材质-->
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>材质</span
				>
				<template
					slot="materialTexture"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							v-if="appointSpec == '0'"
							placeholder="请输入材质"
							v-model.trim="record.materialTexture"
							:disabled="!editable"
							:key="record.id"
							@blur="checkHasRepeat"
						></a-input>
						<a-select
							v-else
							:options="cascadeListMaterial"
							placeholder="请选择材质"
							@focus="focusMaterialTexture(record)"
							v-model="record.materialTexture"
							:disabled="!editable"
							:key="record.id"
						/>
					</a-form-item>
				</template>
				<!--        规格-->
				<span slot="customTitles3"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>规格</span
				>
				<template
					slot="specs"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							v-if="appointSpec == '0'"
							placeholder="请输入规格"
							v-model.trim="record.specs"
							:disabled="!editable"
							:key="record.id"
							@blur="checkHasRepeat"
						></a-input>
						<a-select
							v-else
							@focus="focusCascadeMaterialTexture(record)"
							:options="cascadeListSpecs"
							placeholder="请选择规格"
							:disabled="!editable"
							:key="record.id"
							v-model="record.specs"
						/>
					</a-form-item>
				</template>
				<!-- 厂家 -->
				<span slot="customTitles4"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>厂家</span
				>
				<template
					slot="placeOfOrigin"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入厂家"
							style="width: 100%"
							:maxLength="50"
							v-model.trim="record.placeOfOrigin"
							:disabled="!editable"
						/>
					</a-form-item>
				</template>
				<!-- 数量-->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>数量</span
				>
				<template
					slot="quantity"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'">{{record.quantity}}</div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入数量"
							v-model.trim="record.quantity"
							:disabled="!editable"
							@blur="itemChange('quantity', record)"
							@change="computedData"
							:key="record.id"
						></a-input>
					</a-form-item>
				</template>
				<!-- 单位-->
				<span slot="customTitles5_1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>单位</span
				>
				<template
					slot="unit"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入计量单位"
							v-model.trim="record.unit"
							:disabled="!editable"
							@blur="itemChange('unit', record)"
							@change="computedData"
							:key="record.id"
						></a-input>
					</a-form-item>
				</template>
				<!-- 单价（元）-->
				<span slot="customTitles6"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>单价（元）</span
				>
				<template
					slot="presetUnitPrice"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入单价"
							v-model.trim="record.presetUnitPrice"
							:disabled="!editable"
							:key="record.id"
							@blur="itemChange('presetUnitPrice', record)"
							@change="computedData"
						></a-input>
					</a-form-item>
				</template>
				<!-- 交货期限-->
				<span slot="customTitles7"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>交货期限</span
				>
				<template
					slot="deliveryDeadline"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							:maxLength="50"
							placeholder="请输入交货期限"
							v-model.trim="record.deliveryDeadline"
							:disabled="!editable"
							:key="record.id"
							@blur="itemChange('deliveryDeadline', record)"
						></a-input>
					</a-form-item>
				</template>
				<!-- 交货期限-->
				<span slot="customTitles8">备注</span>
				<template
					slot="remark"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							:maxLength="50"
							placeholder="请输入备注"
							v-model.trim="record.remark"
							:disabled="!editable"
							:key="record.id"
							@blur="itemChange('remark', record)"
						></a-input>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="editable && index != selected.length - 1"
				>
					<span @click="addRow(index)">
						<a-icon
							type="plus-circle"
							style="color: var(--primary-color); font-size: 20px; margin-right: 15px; cursor: pointer"
					/></span>
					<span
						v-if="index > 0"
						@click="removeRow(index)"
						><a-icon
							type="minus-circle"
							style="color: red; font-size: 20px; cursor: pointer"
					/></span>
				</template>
			</a-table>
		</a-form>
		<!-- 预览 文件上传 -->
		<a-modal
			title="上传文件预览"
			:visible="previewVisible"
			@ok="handleOk"
			:width="1200"
			@cancel="previewVisible = false"
		>
			<p
				style="color: red"
				v-if="isError"
			>
				存在问题的数据， 请修改后重新上传！
			</p>
			<a-table
				:scroll="{ x: 1500, y: 600 }"
				:columns="previewColumns"
				:pagination="false"
				rowKey="id"
				:dataSource="previewList"
			>
				<template
					slot="scanResult"
					slot-scope="text, item, index"
				>
					<span :style="{ color: item.scanStatus == 'FAILURE' ? 'red' : '#222' }">{{ text }}</span>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
import { getMaterialCategory, importPurchase2 } from '@/v2/center/steels/api';
import { cloneDeep } from 'lodash';
import FileUpload from './upload/FileUpload.vue';
import { specialSteelTypeArr } from '@/v2/center/steels/config/constant';
const columns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		}
	},
	{ key: 'materialName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'materialName' } },
	{ key: 'materialTexture', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'specs', slots: { title: 'customTitles3' }, scopedSlots: { customRender: 'specs' } },
	{ key: 'placeOfOrigin', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'placeOfOrigin' } },
	{ key: 'quantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'quantity' } },
	{ key: 'unit', slots: { title: 'customTitles5_1' }, scopedSlots: { customRender: 'unit' } },
	{ key: 'presetUnitPrice', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'presetUnitPrice' } },
	{ key: 'deliveryDeadline', slots: { title: 'customTitles7' }, scopedSlots: { customRender: 'deliveryDeadline' } },
	{ key: 'remark', slots: { title: 'customTitles8' }, scopedSlots: { customRender: 'remark' } },
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
const previewColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	// 品名
	{ key: 'materialName', dataIndex: 'materialName', title: '品名', with: 100 },
	{ key: 'specs', dataIndex: 'specs', title: '规格', with: 100 },
	{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', with: 100 },
	// 产地
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '厂家', with: 200 },
	// 数量
	{ key: 'quantity', dataIndex: 'quantity', title: '数量', with: 200 },
	// 单位
	{ key: 'unit', dataIndex: 'unit', title: '单位', with: 200 },
	// 单价
	{ key: 'presetUnitPrice', dataIndex: 'presetUnitPrice', title: '单价（元）', with: 300 },
	// 数量
	{ key: 'deliveryDeadline', dataIndex: 'deliveryDeadline', title: '交货期限', with: 200 },
	// 备注
	{ key: 'remark', dataIndex: 'remark', title: '备注', with: 200 },
	{ key: 'scanResult', dataIndex: 'scanResult', title: '文件上传结果', with: 300, scopedSlots: { customRender: 'scanResult' } },
	{
		key: 'position',
		dataIndex: 'position',
		title: '位置',
		with: 100,
		customRender: function (t, r, index) {
			return r.scanStatus == 'FAILURE' ? t : '';
		}
	}
];

export default {
	data() {
		return {
			columns,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				placeOfOrigin: []
			},
			publicPath: process.env.BASE_URL,
			fetching: false,
			saveData: [],
			selected: [],
			sameFlag: false, // 判断是否有相同材质的
			cascadeList: [],
			cascadeListMaterial: [],
			allCascadeListMaterial: [],
			cascadeListSpecs: [],
			allCascadeListSpecs: [],
			// 导入函数
			action: importPurchase2,
			previewVisible: false,
			previewColumns,
			previewList: [],
			totalAmount: 0,
			totalQuantity: 0,
			isError: false
		};
	},
	components: {
		FileUpload
	},
	computed: {
		paramsData() {
			return {
				steelType: Array.isArray(this.steelType) ? this.steelType.join(',') : this.steelType,
				appointSpec: this.appointSpec,
				contractTemplate: 'RECEIVABLE_STEEL_BUY_002'
			};
		}
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
		type: {
			default: 'buy'
		},
		noTitle: {
			default: false
		},
		// 钢材种类
		steelType: {
			default: ['FINISHED_STEEL']
		},
		// 是否指定规格
		appointSpec: {
			default: 0
		},
		contractTemplate: {
			default: ''
		}
	},
	watch: {
		selectedData: {
			handler(v) {
				this.updateData(v);
			},
			immediate: true,
			deep: true
		},
		steelType: {
			handler(newVal, oldVal) {
				if (newVal.join(',') !== oldVal.join(',')) {
					this.getMaterialCategory();
				}
			},
			deep: true
		},
		selected: {
			handler(val) {
				let quantity = 0;
				val.forEach(el => {
					quantity += Number(el.quantity || 0);
				});
				this.$emit('change', quantity, val);
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标准
		this.getMaterialCategory();
		this.updateData(this.selectedData);
	},
	methods: {
		checkHasRepeat() {
			this.selected.forEach(item => {
				item.unid = `${item.specs}_${item.materialTexture}_${item.placeOfOrigin}_${item.baleNo}`;
			});
			const unidsAll = this.selected.map(item => item.unid);
			const itemsRepeat = [];
			const unidsRepeat = unidsAll.filter((item, index) => unidsAll.indexOf(item) !== index);
			if (unidsRepeat.length > 0) {
				this.selected.forEach(item => {
					if (unidsRepeat.includes(item.unid)) {
						itemsRepeat.push(item.materialName);
					}
				});
			}
			const itemsRepeatFlat = itemsRepeat.flat();
			const materialNameRepeat = itemsRepeatFlat.filter((item, index) => itemsRepeatFlat.indexOf(item) !== index);
			if (materialNameRepeat.length) {
				this.$message.error('同一个品名，不允许新增多条同属性记录');
			}
			return materialNameRepeat.length === 0;
		},

		updateData(list) {
			let data = cloneDeep(list);
			// 时刻更新选中数据
			if (data && data.length === 0) {
				this.selected = [
					{
						uuid: new Date().getTime(),
						materialName: undefined, //品名
						specs: undefined, //规格
						materialTexture: undefined, //材质
						quantity: '', //数量
						presetUnitPrice: '', //单价（元/吨）
						placeOfOrigin: undefined, // 产地
						deliveryDeadline: '', // 交货期限
						remark: '' // 备注
					}
				];
				this.selected.push({
					transferQuantity: '总计',
					quantity: '', //数量
				});
				// 计算总计
				this.computedTotal();
				this.$forceUpdate();
				return;
			}
			data.forEach(el => {
				el.test3 = (el.presetUnitPrice / 1.13).toFixed(2);
				el.test4 = (el.presetUnitPrice * el.quantity).toFixed(2);
			});
			this.selected = data;
			this.selected.push({
				transferQuantity: '总计',
				quantity: '', //数量
			});
			// 计算总计
			this.computedTotal();
			this.$forceUpdate();
			this.$store.commit('steelContract/updatedList', this.selected);
			//  this.$emit('sendData', this.selected)
		},
		computedTotal() {
			const lastItem = this.selected[this.selected.length - 1];
			let quantity = 0
			this.selected.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					quantity += +(el.quantity || 0);
				}
			});
			lastItem.quantity = quantity.toFixed(4);
			this.$forceUpdate();
		},
		//删除行
		removeRow(index) {
			let that = this;
			that.$confirm({
				centered: true,
				title: '确定要删除该物资记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					that.selected.splice(index, 1);
				},
				onCancel() {}
			});
		},
		focusMaterialTexture(item) {
			let materialName = typeof item.materialName === 'object' ? item.materialName[0] : item.materialName;
			if (materialName) {
				const filteredMaterials = this.cascadeList
					.filter(cascade => cascade.materialName === materialName)
					.map(cascade => cascade.materialTextureList);
				const cascadeListMaterial = [...new Set(filteredMaterials.flat())];
				this.cascadeListMaterial = cascadeListMaterial.map(item => ({
					label: item.specs,
					value: item.specs,
					...item
				}));
			} else {
				this.cascadeListMaterial = this.allCascadeListMaterial;
			}
		},
		focusCascadeMaterialTexture(item) {
			let materialTexture = item.materialTexture;
			if (materialTexture) {
				const filteredCascadeListSpecs = this.cascadeListMaterial
					.filter(cascade => cascade.materialTexture === materialTexture)
					.map(cascade => cascade.specsList);
				const cascadeListSpecs = [...new Set(filteredCascadeListSpecs.flat())];
				this.cascadeListSpecs = cascadeListSpecs.map(item => ({
					label: item.specs,
					value: item.specs,
					...item
				}));
			} else {
				this.cascadeListSpecs = this.allCascadeListSpecs;
			}
		},
		changeCascade(item) {
			item.materialTexture = '';
			item.specs = '';
			item.quantity = '';
		},
		//添加行
		addRow(index = 0) {
			let newSelectedArr = this.selected.slice(0, this.selected.length - 1);
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			const flag2 = newSelectedArr.every(el => {
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.quantity &&
					el.presetUnitPrice &&
					el.placeOfOrigin &&
					el.deliveryDeadline
				) {
					return true;
				}
			});
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			let emptyRow = {
				uuid: new Date().getTime(),
				materialName: undefined, //物资名称
				specs: undefined, //规格
				materialTexture: undefined, //材质
				quantity: '', //数量
				presetUnitPrice: '', //单价（元/吨）
				placeOfOrigin: '',
				deliveryDeadline: '',
				remark: ''
			};
			this.selected.splice(index + 1, 0, emptyRow);
		},
		//修改表单项脏值
		itemChange(name, record) {
			let item = record;
			// 校验特殊要求字段--数量不超过10000000吨，最多两位小数  单价不超过10000000元/吨，最多两位小数
			if (name === 'quantity') {
				if (!item.quantity) {
					this.$message.error('请输入数量');
					this.computedData();
					return;
				}
				let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
				if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
					record.quantity = '';
					this.$message.error('数量不超过10000000吨，最多四位小数');
					this.computedData();
					return;
				}
				// 计算总计
				this.computedTotal();
				this.$forceUpdate();
			}
			// 单价
			if (name === 'presetUnitPrice') {
				if (!item.presetUnitPrice) {
					this.$message.error('请输入单价');
					this.computedData();
					return;
				}
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
						record.presetUnitPrice = '';
						this.$message.error('单价不超过10000000元/吨，最多两位小数');
						this.computedData();
						return;
					}
				}
			}
			if (name === 'unit') {
				if (!item.unit) {
					this.$message.error('请输入计量单位');
					this.computedData();
					return;
				}
				if (item.unit.length > 10) {
					this.$message.error('计量单位不超过10个字');
					this.computedData();
					return;
				}
			}

			this.$forceUpdate();
		},
		computedData() {
			this.totalAmount = 0;
			this.totalQuantity = 0;
			let regs1 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,3})?$/;
			let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

			let computedList = cloneDeep(this.selected);
			computedList.map(i => {
				i.quantity = regs1.test(i.quantity) ? i.quantity / 1 : 0;
				i.presetUnitPrice = regs2.test(i.presetUnitPrice) ? i.presetUnitPrice / 1 : 0;
				this.totalQuantity += i.quantity;
				this.totalAmount += (i.quantity * i.presetUnitPrice) / 1;
			});
		},
		// 上传成功
		getUploadFiles(data) {
			this.previewVisible = true;
			this.previewList = data;
			this.isError = data.some(el => el.scanStatus == 'FAILURE');
		},
		save() {
			let newSelectedArr = this.selected.slice(0, this.selected.length - 1);
			const flag2 = newSelectedArr.every(el => {
				el.mainId = `${el.specs}_${el.materialTexture}_${el.placeOfOrigin}`;
				if (
					el.materialName &&
					el.materialTexture &&
					el.specs &&
					el.quantity &&
					el.presetUnitPrice &&
					el.placeOfOrigin &&
					el.deliveryDeadline
				) {
					return true;
				}
			});
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			return newSelectedArr;
		},
		// 获取品名级联数据
		async getMaterialCategory() {
			if (!this.steelType.length) return;
			const params = {
				steelType: Array.isArray(this.steelType) ? this.steelType?.join(',') : this.steelType,
				t: new Date().getTime()
			};
			const res = await getMaterialCategory(params);

			const materialNameList = (res.data[0] || {}).materialNameList || [];
			materialNameList.forEach(el => {
				el.value = el.materialName;
				el.label = el.materialName;
				el.materialTextureList.forEach(el2 => {
					el2.value = el2.materialTexture;
					el2.label = el2.materialTexture;
					el2.specsList.forEach(el3 => {
						el3.value = el3.specs;
						el3.label = el3.specs;
					});
				});
			});
			this.cascadeList = materialNameList;

			// 整理材质的数据并去重
			let cascadeListMaterial = [];
			for (const item of materialNameList) {
				cascadeListMaterial = cascadeListMaterial.concat(item.materialTextureList);
			}
			this.cascadeListMaterial = cascadeListMaterial.reduce((uniqueList, item) => {
				const materialTexture = item.materialTexture;
				if (!uniqueList.some(obj => obj.materialTexture === materialTexture)) {
					uniqueList.push(item);
				}
				return uniqueList;
			}, []);
			this.allCascadeListMaterial = cloneDeep(this.cascadeListMaterial);

			// 整理规格的数据并去重
			let cascadeListSpecs = [];
			for (const item of cascadeListMaterial) {
				cascadeListSpecs = cascadeListSpecs.concat(item.specsList);
			}
			this.cascadeListSpecs = cascadeListSpecs.reduce((uniqueList, item) => {
				const specs = item.specs;
				if (!uniqueList.some(obj => obj.specs === specs)) {
					uniqueList.push(item);
				}
				return uniqueList;
			}, []);
			this.allCascadeListSpecs = cloneDeep(this.cascadeListSpecs);
		},
		// 文件上传
		handleOk() {
			if (this.isError) {
				this.$message.error('存在问题的数据， 请修改后重新上传');
				return;
			}
			this.previewVisible = false;
			this.selected = this.previewList;
			this.$emit('upload', this.selected);
			// this.fileData = this.previewList
		}
	}
};
</script>

<style lang="less" scoped>
.detailsTable {
	.ant-input {
		width: 120px;
	}
	.ant-select {
		width: 150px;
	}
	.ant-select.special {
		width: 260px;
	}
	.ant-form-item {
		margin-bottom: 0;
	}
}
.title {
	display: flex;
	align-items: center;
}
.upload-box {
	display: flex;
	align-items: center;
}
</style>
