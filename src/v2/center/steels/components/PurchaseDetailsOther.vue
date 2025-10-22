<template>
	<div class="otherForm">
		<a-row
			v-if="!noTitle"
			class="title"
			style="justify-content: start"
		>
			<h3 style="margin: 30px 0">{{ title }}</h3>
			<div style="margin-left: 20px; display: flex; align-items: center">
				<a
					:href="publicPath + 'files/货物信息模板.xlsx'"
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
				:rowKey="(record, index) => String(index)"
				:class="editable ? '' : 'disabled'"
				class="detailsTable"
			>
				<!-- 品名 -->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>品名/材质/规格</span
				>
				<span slot="customTitlesMaterialName"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>品名</span
				>
				<span slot="customTitlesMaterialTexture"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>材质</span
				>
				<span slot="customTitlesAppointSpec"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>规格</span
				>

				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-select
							v-if="appointSpec == '0'"
							mode="multiple"
							:options="cascadeList"
							placeholder="请选择品名"
							@change="changeCascade(record)"
							v-model="record.materialName"
							:disabled="!editable"
							:key="record.id"
							@blur="checkHasRepeat"
						/>
						<a-select
							v-else
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
							@change="changeCascadeMaterialTexture(record)"
							v-model="record.materialTexture"
							:disabled="!editable"
							:key="record.id"
							@blur="checkHasRepeat"
						/>
					</a-form-item>
				</template>
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
							@focus="changeCascadeMaterialTexture(record)"
							:options="cascadeListSpecs"
							placeholder="请选择规格"
							:disabled="!editable"
							:key="record.id"
							v-model="record.specs"
							@blur="checkHasRepeat"
						/>
					</a-form-item>
				</template>

				<!-- 产地 -->
				<span slot="customTitles4"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>产地</span
				>
				<template
					slot="placeOfOrigin"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-select
							:placeholder="placeOfOriginPlaceholder"
							v-if="steelType.includes('FINISHED_STEEL') && appointSpec == 1 && isThread(record)"
							v-model="record.placeOfOrigin"
							show-search
							:disabled="!editable"
							style="width: 100%"
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							@change="changePlaceOfOrigin(record)"
							@focus="getOriginPlace('', record)"
							@search="getOriginPlace($event, record)"
							:key="record.id"
							@blur="checkHasRepeat"
						>
							<a-spin
								v-if="fetching"
								slot="notFoundContent"
								size="small"
							/>
							<a-select-option
								v-for="item in selectList['placeOfOrigin']"
								:key="item.text"
								:title="item.text"
								>{{ item.text }}</a-select-option
							>
						</a-select>
						<a-input
							v-else
							placeholder="请输入产地"
							style="width: 100%"
							:maxLength="100"
							v-model.trim="record.placeOfOrigin"
							:disabled="!editable"
							@blur="checkHasRepeat"
						>
						</a-input>
					</a-form-item>
				</template>
				<!-- 件数 -->
				<span slot="customTitles10"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>件数</span
				>
				<template
					slot="pieceQuantity"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'">{{ isShowTotal ? record.pieceQuantity : '' }}</div>
					<!-- 线材/建材/型材/管材/钢坯 -->
					<a-form-item v-else>
						<a-input
							@blur="itemChange('pieceQuantity', record)"
							placeholder="若无可输入/"
							v-model.trim="record.pieceQuantity"
							:disabled="!editable"
						></a-input>
					</a-form-item>
				</template>
				<!-- 捆包号 -->
				<span slot="customTitles11">
					<!-- 热轧卷板/中厚板/冷轧卷板/涂镀卷板 -->
					<span>
						<i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>
					</span>
					捆包号
				</span>
				<template
					slot="baleNo"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<!-- 螺纹刚 指定规格 捆包号 禁用 -->
					<a-form-item v-else>
						<a-input
							:maxLength="50"
							placeholder="若无可输入/"
							@blur="itemChange('baleNo', record)"
							v-model.trim="record.baleNo"
							:disabled="!editable || (isThread(record) && appointSpec == 1)"
						></a-input>
					</a-form-item>
				</template>
				<!-- 理重 -->
				<span slot="customTitles12"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>理重</span
				>
				<template
					slot="theoreticalWeight"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							v-model.trim="record.theoreticalWeight"
							disabled
						></a-input>
					</a-form-item>
				</template>
				<!-- 计量方式 -->
				<span slot="customTitles13"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>计量方式</span
				>
				<template
					slot="metrologyWay"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入计量方式"
							:maxLength="50"
							:disabled="!editable"
							v-model.trim="record.metrologyWay"
						></a-input>
					</a-form-item>
				</template>
				<!-- 数量-->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>数量（吨）</span
				>
				<template
					slot="quantity"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'">{{ record.quantity }}</div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入数量"
							v-model.trim="record.quantity"
							:disabled="!editable"
							@blur="itemChange('quantity', record)"
							:key="record.id"
						></a-input>
					</a-form-item>
				</template>
				<!-- 仓库 -->
				<!-- 预设含税单价（元/吨）-->
				<span slot="customTitles6"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>含税单价（元/吨）</span
				>
				<template
					slot="presetUnitPrice"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							placeholder="请输入设含税单价"
							v-model.trim="record.presetUnitPrice"
							:disabled="!editable"
							:key="record.id"
							@blur="itemChange('presetUnitPrice', record)"
						></a-input>
					</a-form-item>
				</template>
				<span slot="customTitles8">不含税单价（元/吨）</span>
				<template
					slot="test3"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'"></div>
					<a-form-item v-else>
						<a-input
							v-model.trim="record.test3"
							:disabled="true"
						>
						</a-input>
					</a-form-item>
				</template>
				<span slot="customTitles9">含税金额（元）</span>
				<template
					slot="test4"
					slot-scope="text, record"
				>
					<div v-if="record.transferQuantity == '总计'">
						<a-form-item>
							<a-input
								style="width: 300px"
								v-model.trim="record.test4"
								disabled
								@blur="itemChange('test4', record, true)"
							>
							</a-input>
						</a-form-item>
					</div>
					<a-form-item v-else>
						<a-input
							style="width: 300px"
							v-model.trim="record.test4"
							@blur="itemChange('test4', record)"
							disabled
						>
						</a-input>
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
import { getPopupContainer } from '@/v2/utils/factory';
import FileUpload from './upload/FileUpload.vue';
import { getOriginPlace, getMaterialCategory, importPurchase } from '@/v2/center/steels/api';
import { previewColumns, columnsNormal, columnsSpec, columnsCommon } from './config/PurchaseDetailsOtherTable';

import { specialSteelTypeArr } from '@/v2/center/steels/config/constant.js';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
export default {
	name: 'OtherForm',
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this, { name: 'form' }),
			selectList: {
				placeOfOrigin: []
			},
			fetching: false,
			conditionTypeKey: [
				{
					type: 'steel_material_name',
					key: 'materialName'
				},
				{
					type: 'steel_spec',
					key: 'specs'
				},
				{
					type: 'steel_material_texture',
					key: 'materialTexture'
				}
			],
			saveData: [],
			selected: [],
			sameFlag: false, // 判断是否有相同材质的
			cascadeList: [],
			placeOfOriginPlaceholder: '请输入产地查询',
			publicPath: process.env.BASE_URL,
			// 操作类型
			handleType: 1,

			previewColumns,
			// 文件上传数据
			fileData: [],
			// 文件预览
			previewVisible: false,
			previewList: [],
			// 导入函数
			action: importPurchase,
			isError: false,
			specialSteelTypeArr,
			columns: [],
			columnsNormal,
			columnsSpec,
			cascadeListMaterial: [],
			cascadeListSpecs: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		title() {
			if (this.titleName) {
				return this.titleName;
			}
			if (this.type == 'sell') {
				return '销售明细表';
			}
			return '采购明细表';
		},
		// 判断是否是不是废钢 并且未指定规格
		isSpecial() {
			return !this.steelType.includes('SCRAP_STEEL') && this.appointSpec == 0;
		},
		btnDisabled() {
			const flag = this.steelType;
			if (this.steelType.includes('FINISHED_STEEL')) {
				return Boolean(flag && this.appointSpec);
			}
			return Boolean(flag);
		},
		paramsData() {
			return {
				steelType: Array.isArray(this.steelType) ? this.steelType.join(',') : this.steelType,
				appointSpec: this.appointSpec,
				contractTemplate: this.contractTemplate
			};
		},
		//是否属于铁瑞集团
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051';
		},
		moneyDisable() {
			// 电子采购004、005、销售002，005，006，007 可编辑含税金额
			if (!this.isBelongTieRui) return true;
			if (this.contractTemplate && this.from === 'online') {
				return ![
					'FINISHED_STEEL_BUY_004',
					'FINISHED_STEEL_BUY_005',
					'FINISHED_STEEL_SELL_002',
					'FINISHED_STEEL_SELL_005',
					'FINISHED_STEEL_SELL_006',
					'FINISHED_STEEL_SELL_007'
				].includes(this.contractTemplate);
			}
			// 采购补录-业务类型代采、代采+仓押、联营 可编辑含税金额
			if (this.businessType && this.from === 'supplement' && this.type === 'buySupplement') {
				return !['SOURCING_AGENT', 'SOURCING_AGENT_WAREHOUSE_PLEDGE', 'AFFILIATED_BUSINESS'].includes(this.businessType);
			}
			// 销售补录-钢材种类非废钢 可编辑含税金额
			if (this.steelType && this.from === 'supplement' && this.type === 'sellSupplement') {
				return ['SCRAP_STEEL'].includes(this.steelType);
			}
			return true;
		},
		// 表格是否增加总计行
		// 采购合同模板002、004、005、采购补录（代采、代采+仓押、联营）
		// 销售合同模板002、005、006、007,销售补录非废钢
		isAddTotalColumn() {
			return (
				[
					'FINISHED_STEEL_BUY_004',
					'FINISHED_STEEL_BUY_005',
					'FINISHED_STEEL_BUY_002',
					'FINISHED_STEEL_SELL_002',
					'FINISHED_STEEL_SELL_005',
					'FINISHED_STEEL_SELL_006',
					'FINISHED_STEEL_SELL_007'
				].includes(this.contractTemplate) ||
				this.type === 'buySupplement' ||
				this.type === 'sellSupplement'
			);
		},
		// 表格是否展示件数
		// 采购合同模板004、采购合同模板005、采购补录（代采、代采+仓押、联营）
		// 销售合同模板002、005、006、007,销售补录非废钢
		isShowTotal() {
			return (
				[
					'FINISHED_STEEL_BUY_004',
					'FINISHED_STEEL_BUY_005',
					'FINISHED_STEEL_SELL_002',
					'FINISHED_STEEL_SELL_005',
					'FINISHED_STEEL_SELL_006',
					'FINISHED_STEEL_SELL_007'
				].includes(this.contractTemplate) ||
				this.type === 'buySupplement' ||
				this.type === 'sellSupplement'
			);
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
		// 是否禁用文件上传
		uploadDisabled: {
			default: false
		},
		contractTemplate: {
			default: ''
		},
		titleName: {
			default: ''
		},
		businessType: {
			default: ''
		},
		// 来自电子还是补录
		from: {
			default: 'online'
		},
		resultDetail: {
			type: Object,
			default() {
				return {};
			}
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
		appointSpec: {
			handler(v) {
				/** 重置品名 */
				if (v == 1) {
					this.selected.forEach(el => {
						if (Array.isArray(el.materialName)) {
							el.materialName = el.materialName[0] || '';
						}
					});
				}
				if (v == 0) {
					this.selected.forEach(el => {
						if (!Array.isArray(el.materialName) && el.materialName) {
							el.materialName = [el.materialName] || '';
						}
					});
				}
				this.columns = columnsSpec.concat(columnsCommon);
				this.getMaterialCategory();
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
				if (!val) return;
				let newSelectedArr = val;
				let quantity = 0;
				let hasTotal = false;
				if (this.selected.length) {
					this.selected.forEach(item => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity');
					});
				}
				if (hasTotal) {
					newSelectedArr = this.selected.slice(0, this.selected.length - 1);
				}
				newSelectedArr.forEach(el => {
					quantity += Number(el.quantity || 0);
				});
				this.$emit('change', quantity, val);
			},
			deep: true,
			immediate: true
		},
		contractTemplate: {
			handler(v) {
				if (!v) return;
				let hasTotal = false;
				if (this.selected.length) {
					this.selected.forEach(item => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity');
					});
				}
				if (!hasTotal) {
					if (this.isAddTotalColumn) {
						this.selected.push({
							transferQuantity: '总计',
							quantity: '', //数量
							pieceQuantity: '', // 件数
							presetUnitPrice: '' // 含税价格
						});
						// 计算总计
						this.computedTotal();
						this.$forceUpdate();
					}
				}
			}
		}
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标准
		this.updateData(this.selectedData);
	},
	methods: {
		checkHasRepeat() {
			// 销售补录合同允许新增多条
			if (this.type === 'sellSupplement') {
				return true;
			}
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
						materialName: undefined, //物资名称
						specs: undefined, //规格
						materialTexture: undefined, //材质
						quantity: '', //数量
						presetUnitPrice: '', //预设含税单价（元/吨）
						// 产地
						placeOfOrigin: undefined,
						// 件数
						pieceQuantity: '',
						// 计量方式
						metrologyWay: '',
						// 理重
						theoreticalWeight: '/',
						// 捆包号
						baleNo: ''
					}
				];
				if (this.isAddTotalColumn) {
					if (!this.hasKeyInArrayOfObjects(this.selected, 'transferQuantity')) {
						this.selected.push({
							transferQuantity: '总计',
							quantity: '', //数量
							pieceQuantity: '', // 件数
							presetUnitPrice: '' // 含税价格
						});
					}
					// 计算总计
					this.computedTotal();
					this.$forceUpdate();
				}
				return;
			}
			if (this.appointSpec == '1') {
				data.forEach(item => {
					let materialNameArray = Array.isArray(item.materialName) ? item.materialName[0] : item.materialName;
					item.calendar = [materialNameArray, item.materialTexture, item.specs];
				});
			}
			data.forEach(el => {
				el.test3 = (el.presetUnitPrice / 1.13).toFixed(2);
				el.test4 = (el.presetUnitPrice * el.quantity).toFixed(2);
			});
			this.selected = data;
			if (this.isAddTotalColumn) {
				if (!this.hasKeyInArrayOfObjects(this.selected, 'transferQuantity')) {
					this.selected.push({
						transferQuantity: '总计',
						quantity: '', //数量
						pieceQuantity: '', // 件数
						presetUnitPrice: '' // 含税价格
					});
				}
				// 计算总计
				this.computedTotal(true);
				this.$forceUpdate();
			}
			// 不要问为啥这么改，这个地方有点乱，整理没时间
			let seselectedlected = this.selected.filter(item => item.transferQuantity !== '总计');
			this.$store.commit('steelContract/updatedList', seselectedlected);
			//  this.$emit('sendData', this.selected)
		},
		computedTotal(flag) {
			const lastItem = this.selected[this.selected.length - 1];
			let quantity = 0;
			let pieceQuantity = 0;
			let test4 = 0;
			this.selected.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					quantity += +(el.quantity || 0);
					if (el.pieceQuantity !== '/') {
						pieceQuantity += +(el.pieceQuantity || 0);
					}
					test4 += +(el.test4 || 0);
				}
			});
			lastItem.quantity = quantity.toFixed(4);
			lastItem.pieceQuantity = parseInt(pieceQuantity);
			lastItem.test4 = test4.toFixed(2);
			if (this.resultDetail?.totalTaxAmount && flag) {
				lastItem.test4 = this.resultDetail?.totalTaxAmount.toFixed(2);
			}
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
					this.computedTotal();
				},
				onCancel() {}
			});
		},
		changeCascadeMaterialTexture(item) {
			if (!item.materialTexture) {
				return;
			}
			this.cascadeListSpecs = this.cascadeListMaterial.filter(texture => texture.value === item.materialTexture)[0].children;
		},
		changeCascade(item) {
			if (this.appointSpec == 1) {
				this.cascadeListMaterial = this.cascadeList.filter(material => material.value === item.materialName)[0].children;
			}
			item.materialTexture = '';
			item.specs = '';
			// 清除件数 清除理重 清除数量
			item.pieceQuantity = '';
			item.theoreticalWeight = '/';
			item.quantity = '';
			item.isBaleNoDisabled = false;
			/** 判断捆包号 是否可以编辑 */
			if (specialSteelTypeArr.includes(item.materialName) && this.steelType.includes('FINISHED_STEEL')) {
				item.baleNo = '/';
				item.isBaleNoDisabled = true;
			}
			this.getOriginPlace('', item);
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
					el.pieceQuantity &&
					el.metrologyWay &&
					el.theoreticalWeight &&
					el.baleNo
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
				presetUnitPrice: '', //预设含税单价（元/吨）
				placeOfOrigin: '',
				// 件数
				pieceQuantity: '',
				calendar: [],
				baleNo: '',
				metrologyWay: '',
				theoreticalWeight: '/'
			};

			this.selected.splice(index + 1, 0, emptyRow);
		},
		// 查询产地
		async getOriginPlace(name, item) {
			if (!item.materialTexture || !item.materialName || !item.specs) {
				return;
			}
			item.placeOfOrigin = '';
			const params = {
				steelType: this.steelType.join(','),
				originPlace: name,
				materialName: Array.isArray(item.materialName) ? item.materialName.join(',') : item.materialName,
				materialTexture: item.materialTexture,
				specs: item.specs
			};
			const res = await getOriginPlace(params);
			res.data.forEach(el => {
				el.text = el.originPlace;
			});
			this.selectList.placeOfOrigin = res.data || [];

			if (this.selectList.placeOfOrigin.length) {
				this.placeOfOriginPlaceholder = '请输入产地查询';
			} else {
				this.placeOfOriginPlaceholder = '请联系运营配置该品类对应得钢厂信息';
				if (
					this.steelType.includes('FINISHED_STEEL') &&
					this.appointSpec == 1 &&
					specialSteelTypeArr.includes(item.materialName)
				) {
					this.$message.warning('请联系运营配置该品类对应得钢厂信息');
				}

				this.$forceUpdate();
			}
			// 判断理重赋值  钢材种类为建材，且钢材品名为“螺纹钢” 且指定规格
			if (
				this.steelType.includes('FINISHED_STEEL') &&
				specialSteelTypeArr.includes(item.materialName) &&
				this.appointSpec == '1'
			) {
				item.theoreticalWeight = '';
			} else {
				item.theoreticalWeight = '/';
			}

			this.$forceUpdate();
		},
		// 修改产地 获取理重
		changePlaceOfOrigin(item) {
			const info = this.selectList.placeOfOrigin.find(el => el.text == item.placeOfOrigin) || {};
			if (info.theoreticalWeight) {
				item.theoreticalWeight = info.theoreticalWeight || '';
				item.quantity = '';
				// 计算数量
				if (this.steelType.includes('FINISHED_STEEL') && specialSteelTypeArr.includes(item.materialName)) {
					// 判断件数  判断是否指定规格
					if (item.pieceQuantity && item.pieceQuantity !== '/' && this.appointSpec == '1') {
						item.quantity = (item.theoreticalWeight * item.pieceQuantity).toFixed(3);
					}
				}
			} else {
				item.theoreticalWeight = '/';
			}
			this.$forceUpdate();
		},
		//修改表单项脏值
		itemChange(name, record, flag) {
			//flag为true，代表可修改含税总金额
			let item = record;
			// 判断是否指定规格 指定规格
			// 校验捆包号
			if (name == 'baleNo') {
				if (!item.baleNo) {
					this.$message.error('请输入捆包号');
					return;
				}
				this.checkHasRepeat();
				// 若捆包号填写的有文字，件数输入值大于1，失去焦点和保存/提交合同时，若二次弹框提醒“xxx品类xx材质xx规格，件数大于1”（弱提醒
				/** 校验 */
				if (
					item.baleNo &&
					item.baleNo !== '/' &&
					record.pieceQuantity > 1 &&
					record.materialName &&
					record.materialTexture &&
					record.specs
				) {
					this.$message.warning(`${record.materialName}品类${record.materialTexture}材质${record.specs}规格，件数大于1`);
				}
				const baleNoList = this.selected.filter(el => el.baleNo != '/').map(el => el.baleNo);
				const repeatList = Array.from(new Set(baleNoList));
				if (repeatList.length != baleNoList.length) {
					this.$message.error('捆包号不能重复');
					record.baleNo = '';
					return;
				}
			}

			// 校验特殊要求字段--数量不超过10000000吨，最多两位小数  单价不超过10000000元/吨，最多两位小数
			if (name === 'quantity') {
				if (!item.quantity) {
					this.$message.error('请输入数量');
					return;
				}
				let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
				if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
					record.quantity = '';
					this.$message.error('数量不超过10000000吨，最多四位小数');
					return;
				}
				if (this.isAddTotalColumn) {
					// 计算总计
					this.computedTotal();
					this.$forceUpdate();
				}
			}
			// 单价
			if (name === 'presetUnitPrice') {
				if (!item.presetUnitPrice) {
					this.$message.error('请输入单价');
					return;
				}
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
						record.presetUnitPrice = '';
						this.$message.error('单价不超过10000000元/吨，最多两位小数');
						return;
					}
				}
			}
			// 判断件数
			if (name == 'pieceQuantity') {
				if (!record.pieceQuantity) {
					record.pieceQuantity = '';
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (record.pieceQuantity !== '/') {
					if (!reg.test(record.pieceQuantity)) {
						record.pieceQuantity = '';
						this.$message.error('件数请输入/或者数字');
						return;
					}
					if (record.pieceQuantity < 1 || record.pieceQuantity > 99999999999999) {
						record.pieceQuantity = '';
						this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
						return;
					}
					// 若捆包号填写的有文字，件数输入值大于1，失去焦点和保存/提交合同时，若二次弹框提醒“xxx品类xx材质xx规格，件数大于1”（弱提醒
					/** 校验 */
					if (
						item.baleNo &&
						item.baleNo !== '/' &&
						record.pieceQuantity > 1 &&
						record.materialName &&
						record.materialTexture &&
						record.specs
					) {
						this.$message.warning(`${record.materialName}品类${record.materialTexture}材质${record.specs}规格，件数大于1`);
					}
					if (
						this.steelType.includes('FINISHED_STEEL') &&
						this.appointSpec == 1 &&
						specialSteelTypeArr.includes(item.materialName)
					) {
						if (item.theoreticalWeight !== '/' && item.theoreticalWeight) {
							record.quantity = (item.pieceQuantity * item.theoreticalWeight).toFixed(3);
						}
					}
				}
				if (this.isAddTotalColumn) {
					// 计算总计
					this.computedTotal();
					this.$forceUpdate();
				}
			}

			/** 计算不含税单价  */
			if (name === 'presetUnitPrice') {
				this.$set(record, 'test3', (record[name] / 1.13).toFixed(2));
			}

			if (name === 'test4') {
				if (!item.test4) {
					this.$message.error('请输入含税金额');
					return;
				}
				if (record[name]) {
					let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
					if (!regs2.test(record[name]) || Number(record[name]) > 100000000000000) {
						record.test4 = '';
						this.$message.error('含税金额不超过100000000000000，最多两位小数');
						return;
					}
				}
				if (flag) {
					this.$forceUpdate();
					return;
				}
				if (this.isAddTotalColumn) {
					// 计算总计
					this.computedTotal();
				}
				this.$forceUpdate();
				return;
			}
			/** 计算含税金额  */
			if ((name === 'presetUnitPrice' || name === 'quantity') && record.presetUnitPrice && record.quantity) {
				this.$set(record, 'test4', (record.presetUnitPrice * record.quantity).toFixed(2));
				if (this.isAddTotalColumn) {
					// 计算总计
					this.computedTotal();
					this.$forceUpdate();
				}
				// 不要问为啥这么改，这个地方有点乱，整理没时间
				let seselectedlected = this.selected.filter(item => item.transferQuantity !== '总计');
				this.$store.commit('steelContract/updatedList', seselectedlected);
				// this.$emit('sendData', this.selected)
			}
			this.$forceUpdate();
		},
		// 判断数组对象中是否含有某个key
		hasKeyInArrayOfObjects(array, key) {
			return array.some(obj => obj.hasOwnProperty(key));
		},
		save() {
			let newSelectedArr = this.selected;
			let totalTaxAmount = null;
			if (this.hasKeyInArrayOfObjects(this.selected, 'transferQuantity')) {
				totalTaxAmount = this.selected[this.selected.length - 1]?.test4;
				newSelectedArr = this.selected.slice(0, this.selected.length - 1);
			}
			const flag2 = newSelectedArr.every(el => {
				//  不指定规格
				if (this.appointSpec == 1) {
					el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}`;
				} else {
					el.mainId = `${el.specs}_${el.materialTexture}_${el.placeOfOrigin}`;
				}
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.quantity &&
					el.presetUnitPrice &&
					el.placeOfOrigin &&
					el.pieceQuantity &&
					el.metrologyWay &&
					el.theoreticalWeight &&
					el.baleNo
				) {
					return true;
				}
			});
			/** 有捆包号的 */
			const baleNoArr = newSelectedArr.filter(el => el.baleNo != '/').map(el => el.baleNo);
			// 无捆包号的
			const noBaleNoArr = newSelectedArr.filter(el => el.baleNo == '/').map(el => el.mainId);
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			const newBaleNoList = Array.from(new Set(baleNoArr));
			if (baleNoArr.length != newBaleNoList.length) {
				this.$message.error('捆包号不能重复');
				return;
			}
			if (this.appointSpec == 0) {
				if (!this.checkHasRepeat()) {
					return;
				}
			}
			// const repeatArr = Array.from(new Set(noBaleNoArr));
			// if (repeatArr.length != noBaleNoArr.length) {
			//   this.$message.error("同一个品名，不允许新增多条同属性记录");
			//   return;
			// }
			if (!newSelectedArr?.length) {
				return {
					newSelectedArr
				};
			} else {
				return {
					resultArr: newSelectedArr,
					totalTaxAmount: totalTaxAmount
				};
			}
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
					if (!this.isSpecial) {
						el2.specsList.forEach(el3 => {
							el3.value = el3.specs;
							el3.label = el3.specs;
						});
						el2.children = el2.specsList;
					}
				});
				el.children = el.materialTextureList;
			});
			this.cascadeList = materialNameList;

			if (this.selected.length) {
				let materialName = this.selectedData[0]?.materialName[0];
				if (this.selected[0]?.materialName) {
					materialName = this.selected[0]?.materialName[0];
				}
				this.cascadeListMaterial = this.cascadeList.filter(material => material.value === materialName)[0]?.children || [];

				this.cascadeListSpecs = this.cascadeListMaterial.filter(texture => texture.value === materialName)[0]?.children;
			}
		},
		// 上传成功
		getUploadFiles(data) {
			this.previewVisible = true;
			this.previewList = data;
			this.isError = data.some(el => el.scanStatus == 'FAILURE');
		},
		// 文件上传
		handleOk() {
			if (this.isError) {
				this.$message.error('存在问题的数据， 请修改后重新上传');
				return;
			}
			this.previewVisible = false;
			let tip = '';
			this.previewList.forEach(el => {
				el.test3 = (el.presetUnitPrice / 1.13).toFixed(2);
				el.test4 = (el.presetUnitPrice * el.quantity).toFixed(2);
				el.calendar = [el.materialName, el.materialTexture, el.specs];
				if (el.baleNo !== '/' && el.pieceQuantity > 1) {
					tip += `${el.materialName}品类${el.materialTexture}材质${el.specs}规格，件数大于1`;
				}
				if (this.isSpecial) {
					el.calendar = [el.materialName, el.materialTexture];
				}
				if (specialSteelTypeArr.includes(el.materialName) && this.steelType.includes('FINISHED_STEEL')) {
					el.isBaleNoDisabled = true;
				}
			});
			if (tip) {
				this.$message.warning(tip);
			}

			this.selected = this.previewList;
			// this.fileData = this.previewList
			if (this.isAddTotalColumn) {
				if (!this.hasKeyInArrayOfObjects(this.selected, 'transferQuantity')) {
					this.selected.push({
						transferQuantity: '总计',
						quantity: '', //数量
						pieceQuantity: '', // 件数
						presetUnitPrice: '' // 含税价格
					});
				}
				// 计算总计
				this.computedTotal();
				this.$forceUpdate();
			}
			// 不要问为啥这么改，这个地方有点乱，整理没时间
			let seselectedlected = this.selected.filter(item => item.transferQuantity !== '总计');
			this.$store.commit('steelContract/updatedList', seselectedlected);
		},
		// 判断是是否是螺纹钢
		// 螺纹钢 产地需要 选择产地
		isThread(record) {
			if (typeof record.materialName == 'string') {
				return specialSteelTypeArr.includes(record.materialName);
			}
			if (Array.isArray(record.materialName)) {
				return record.materialName.some(el => specialSteelTypeArr.includes(el));
			}
			return false;
		}
	},
	components: {
		FileUpload
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
