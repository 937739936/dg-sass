<template>
	<div class="otherForm">
		<a-row
			v-if="!noTitle"
			class="title"
			style="justify-content: start"
		>
			<h3 style="margin: 30px 0">货转清单</h3>
			<div style="margin-left: 20px; display: flex; align-items: center">
				<a
					:href="publicPath + 'files/货权-导入模板.xlsx'"
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
				rowKey="keyId"
				:class="editable ? '' : 'disabled'"
				class="detailsTable"
			>
				<!-- 品名-->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>{{ isSpecial ? '品名/材质' : '品名/材质/规格' }}</span
				>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-cascader
							:options="cascadeList"
							placeholder="请选择"
							@change="changeCascade(record)"
							v-model="record.calendar"
						/>
					</a-form-item>
				</template>
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>规格</span
				>
				<template
					slot="specs"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入规格"
							v-model.trim="record.specs"
							:disabled="!editable"
							:key="record.id"
						></a-input>
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
					<a-form-item>
						<a-select
							:placeholder="placeOfOriginPlaceholder"
							v-if="steelType == 'FINISHED_STEEL' && appointSpec == 1 && specialSteelTypeArr.includes(record.materialName)"
							v-model="record.placeOfOrigin"
							show-search
							style="width: 100%; min-width: 100px"
							:default-active-first-option="false"
							:filter-option="false"
							:not-found-content="fetching ? undefined : null"
							@change="changePlaceOfOrigin(record)"
							@focus="getOriginPlace('', record)"
							@search="getOriginPlace($event, record)"
							:key="record.id"
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
						>
						</a-input>
					</a-form-item>
				</template>
				<!-- 件数 -->
				<span slot="customTitles10"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>本次货转件数</span
				>
				<template
					slot="currentPieceQuantity"
					slot-scope="text, record"
				>
					<!-- 线材/建材/型材/管材/钢坯 -->
					<a-form-item>
						<a-input
							@blur="itemChange('currentPieceQuantity', record)"
							placeholder="请输入"
							v-model.trim="record.currentPieceQuantity"
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
					<a-form-item>
						<a-input
							:maxLength="50"
							placeholder="若无可输入/"
							@blur="itemChange('baleNo', record)"
							v-model.trim="record.baleNo"
							:disabled="!editable || record.isBaleNoDisabled"
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
					<a-form-item>
						<a-input
							placeholder="请输入计量方式"
							:maxLength="50"
							v-model.trim="record.metrologyWay"
						></a-input>
					</a-form-item>
				</template>
				<!-- 数量-->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>本次货转数量（吨）</span
				>
				<template
					slot="currentQuantity"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入数量"
							v-model.trim="record.currentQuantity"
							:disabled="!editable"
							@blur="itemChange('currentQuantity', record)"
							:key="record.id"
						></a-input>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="editable"
				>
					<span @click="addRow(index)">
						<a-icon
							type="plus-circle"
							style="color: var(--primary-color);font-size: 20px; margin-right: 15px; cursor: pointer"
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
import FileUpload from '@/v2/center/steels/components/upload/FileUpload.vue';
import { getOriginPlace, getMaterialCategory } from '@/v2/center/steels/api';
import { importPurchase } from '@/v2/center/steels/api';
import { goodsTransferImportPurchase } from '@/v2/center/steels/api/goodsTransfer.js';
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
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地', with: 200 },
	// 件数
	{ key: 'currentPieceQuantity', dataIndex: 'currentPieceQuantity', title: '件数' },
	// 捆包号
	{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号', with: 100 },
	// 计量方式
	{ key: 'metrologyWay', dataIndex: 'metrologyWay', title: '计量方式', with: 200 },
	// 数量
	{ key: 'currentQuantity', dataIndex: 'currentQuantity', title: '数量（吨）', with: 200 }
];
import { specialSteelTypeArr } from '@/v2/center/steels/config/constant.js';
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
			saveData: [],
			selected: this.selectedData,
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
			action: goodsTransferImportPurchase,
			isError: false,
			specialSteelTypeArr
		};
	},
	computed: {
		// 判断是否是不是废钢 并且未指定规格
		isSpecial() {
			return this.steelType != 'SCRAP_STEEL' && this.appointSpec == 0;
		},
		columns() {
			this.$forceUpdate();
			const columns = [
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
				{ key: 'materialName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'materialName' } },

				// 产地
				{ key: 'placeOfOrigin', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'placeOfOrigin' }, width: 300 },
				// 件数
				{
					key: 'currentPieceQuantity',
					slots: { title: 'customTitles10' },
					scopedSlots: { customRender: 'currentPieceQuantity' }
				},
				// 捆包号
				{ key: 'baleNo', slots: { title: 'customTitles11' }, scopedSlots: { customRender: 'baleNo' } },
				// 计量方式
				{ key: 'metrologyWay', slots: { title: 'customTitles13' }, scopedSlots: { customRender: 'metrologyWay' } },
				// 数量
				{ key: 'currentQuantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'currentQuantity' } },

				{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
			];
			const obj = { key: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' } };
			if (this.isSpecial) {
				columns.splice(2, 0, obj);
			}
			this.getMaterialCategory();
			return columns;
		},
		paramsData() {
			return {
				steelType: this.steelType,
				appointSpec: this.appointSpec,
				contractTemplate: this.contractTemplate,
				contractId: this.$route.query.contractId
			};
		}
	},
	props: {
		selectedData: {
			// 被选中的指标
			type: Array,
			required: false,
			default: () => []
		},
		editable: {
			// 是否可编辑
			type: Boolean
		},
		noTitle: {
			type: Boolean
		},
		appointSpec: {
			default: 1
		},
		// 钢材种类
		steelType: {
			default: 'FINISHED_STEEL'
		},
		// 是否禁用文件上传
		uploadDisabled: {
			default: false
		},
		contractTemplate: {
			default: ''
		}
	},
	created() {
		// 获取后台配置的 物资名称、规格、材质、质量标准
		this.updateData(this.selected);
	},
	methods: {
		updateData(data) {
			// 时刻更新选中数据
			if (data && data.length === 0) {
				this.selected = [
					{
						keyId: String(new Date().getTime()),
						materialName: undefined, //物资名称
						specs: undefined, //规格
						materialTexture: undefined, //材质
						currentQuantity: '', //数量
						// 产地
						placeOfOrigin: undefined,
						// 件数
						currentPieceQuantity: '',
						// 计量方式
						metrologyWay: '',
						// 捆包号
						baleNo: ''
					}
				];
				return;
			}
			this.selected = data;
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
		changeCascade(item) {
			const arr = item.calendar;
			item.materialName = arr[0];
			item.materialTexture = arr[1];
			if (!this.isSpecial) {
				item.specs = arr[2];
			}
			// 清除件数 清除理重 清除数量
			item.currentPieceQuantity = '';
			item.currentQuantity = '';
			item.isBaleNoDisabled = false;
			/** 判断捆包号 是否可以编辑 */
			if (specialSteelTypeArr.includes(item.materialName) && this.steelType == 'FINISHED_STEEL') {
				item.baleNo = '/';
				item.isBaleNoDisabled = true;
			}
			this.getOriginPlace('', item);
		},
		//添加行
		addRow(index = 0) {
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			const flag2 = this.selected.every(el => {
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.currentQuantity &&
					el.placeOfOrigin &&
					el.currentPieceQuantity &&
					el.metrologyWay &&
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
				keyId: String(new Date().getTime()),
				materialName: undefined, //物资名称
				specs: undefined, //规格
				materialTexture: undefined, //材质
				currentQuantity: '', //数量
				placeOfOrigin: '',
				// 件数
				currentPieceQuantity: '',
				calendar: [],
				baleNo: '',
				metrologyWay: ''
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
				steelType: this.steelType,
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
				if (this.steelType == 'FINISHED_STEEL' && this.appointSpec == 1 && specialSteelTypeArr.includes(item.materialName)) {
					this.$message.warning('请联系运营配置该品类对应得钢厂信息');
				}
			}
			this.$forceUpdate();
		},
		changePlaceOfOrigin(item) {
			const info = this.selectList.placeOfOrigin.find(el => el.text == item.placeOfOrigin) || {};
			if (info.theoreticalWeight) {
				item.theoreticalWeight = info.theoreticalWeight || '';
				item.currentQuantity = '';
				// 计算数量
				if (this.steelType == 'FINISHED_STEEL' && specialSteelTypeArr.includes(item.materialName)) {
					// 判断件数  判断是否指定规格
					if (item.currentPieceQuantity * item.theoreticalWeight) {
						item.currentQuantity = (item.theoreticalWeight * item.currentPieceQuantity).toFixed(3);
					}
				}
			}
			this.$forceUpdate();
		},
		//修改表单项脏值
		itemChange(name, record) {
			let item = record;
			// 判断是否指定规格 指定规格
			// 校验捆包号
			if (name == 'baleNo') {
				if (!item.baleNo) {
					this.$message.error('请输入捆包号');
					return;
				}
				// 若捆包号填写的有文字，件数输入值大于1，失去焦点和保存/提交合同时，若二次弹框提醒“xxx品类xx材质xx规格，件数大于1”（弱提醒
				/** 校验 */
				// if(item.baleNo && item.baleNo !== '/' && record.currentPieceQuantity > 1 && record.materialName && record.materialTexture && record.specs) {
				//   this.$message.warning(`${record.materialName}品类${record.materialTexture}材质${record.specs}规格，件数大于1`)
				// }
				const baleNoList = this.selected.filter(el => el.baleNo != '/').map(el => el.baleNo);
				const repeatList = Array.from(new Set(baleNoList));
				if (repeatList.length != baleNoList.length) {
					this.$message.error('捆包号不能重复');
					record.baleNo = '';
					return;
				}
			}
			// 校验特殊要求字段--数量不超过10000000吨，最多两位小数  单价不超过10000000元/吨，最多两位小数
			if (name === 'currentQuantity') {
				if (!item.currentQuantity) {
					this.$message.error('请输入数量');
					return;
				}
				let regs2 = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,4})?$/;
				if (!regs2.test(record[name]) || Number(record[name]) > 10000000) {
					record.currentQuantity = '';
					this.$message.error('数量不超过10000000吨，最多四位小数');
					return;
				}
			}
			// 判断件数
			if (name == 'currentPieceQuantity') {
				if (!record.currentPieceQuantity) {
					record.currentPieceQuantity = '';
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
				if (record.currentPieceQuantity !== '/') {
					let reg = /^[0-9]*[1-9][0-9]*$/;
					if (!reg.test(record.currentPieceQuantity)) {
						record.currentPieceQuantity = '';
						this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
						return;
					}
					if (record.currentPieceQuantity < 1 || record.currentPieceQuantity > 99999999999999) {
						record.currentPieceQuantity = '';
						this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
						return;
					}
					if (record.theoreticalWeight !== '/' && record.theoreticalWeight) {
						record.currentQuantity = (record.currentPieceQuantity * record.theoreticalWeight).toFixed(3);
					}
				}
			}
		},
		save() {
			const flag2 = this.selected.every(el => {
				//  不指定规格
				if (this.isSpecial) {
					el.mainId = `${el.materialName}${el.materialTexture}${el.placeOfOrigin}`;
				} else {
					el.mainId = `${el.materialName}${el.specs}${el.materialTexture}${el.placeOfOrigin}`;
				}
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.currentQuantity &&
					el.placeOfOrigin &&
					el.currentPieceQuantity &&
					el.metrologyWay &&
					el.baleNo
				) {
					return true;
				}
			});
			/** 有捆包号的 */
			const baleNoArr = this.selected.filter(el => el.baleNo != '/').map(el => el.baleNo);
			// 无捆包号的
			const noBaleNoArr = this.selected.filter(el => el.baleNo == '/').map(el => el.mainId);
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			const newBaleNoList = Array.from(new Set(baleNoArr));
			if (baleNoArr.length != newBaleNoList.length) {
				this.$message.error('捆包号不能重复');
				return;
			}
			const repeatArr = Array.from(new Set(noBaleNoArr));
			if (repeatArr.length != noBaleNoArr.length) {
				this.$message.error('同一个品名，不允许新增多条同属性记录');
				return;
			}
			return this.selected;
		},
		// 获取品名级联数据
		async getMaterialCategory() {
			if (!this.steelType) return;
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
				el.calendar = [el.materialName, el.materialTexture, el.specs];
				if (el.baleNo !== '/' && el.currentPieceQuantity > 1) {
					tip += `${el.materialName}品类${el.materialTexture}材质${el.specs}规格，件数大于1`;
				}
				if (this.isSpecial) {
					el.calendar = [el.materialName, el.materialTexture];
				}
				if (specialSteelTypeArr.includes(el.materialName) && this.steelType == 'FINISHED_STEEL') {
					el.isBaleNoDisabled = true;
				}
			});
			if (tip) {
				this.$message.warning(tip);
			}
			this.selected = this.previewList;
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
