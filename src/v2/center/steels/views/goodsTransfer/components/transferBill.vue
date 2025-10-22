<template>
	<div>
		<template>
			<Property
				:goodsTransferData="goodsTransferData"
				:appointSpec="appointSpec"
				:uploadIds="receiveIds"
				@send="getSelectData"
			></Property>
			<div
				class="title"
				style="justify-content: space-between"
			>
				<span><i class="title_icon" />本次货转清单</span>
				<div class="upload">
					<a
						style="font-size: 12px; margin-right: 20px"
						:href="publicPath + 'files/货权-导入模板.xlsx'"
						class="downloadTemplate"
						>模板下载</a
					>
					<FileUpload
						:action="action"
						:btnDisabled="true"
						:paramsData="paramsData"
						@uploadFiles="getUploadFiles2"
					></FileUpload>
				</div>
			</div>
			<a-table
				:columns="columns"
				:scroll="{ x: true }"
				:dataSource="selectData"
				:pagination="false"
				:rowKey="record => `${record.mainId}-${record.keyId}`"
				:class="editable ? '' : 'disabled'"
				class="detailsTable"
			>
				<!-- 品名-->
				<span slot="customTitles1"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>品名</span
				>
				<template
					slot="materialName"
					slot-scope="text, record"
				>
					<a-form-item>
						<!-- 判断 是否是指定规格 -->
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-select
							placeholder="请选择"
							v-else
							v-model="record.materialName"
							style="width: 100%; min-width: 100px"
							:default-active-first-option="false"
						>
							<a-select-option
								v-for="item in materialNameList"
								:key="item"
								:value="item"
								>{{ item }}</a-select-option
							>
						</a-select>
					</a-form-item>
				</template>
				<!-- 规格-->
				<span slot="customTitles2"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>规格</span
				>
				<template
					slot="specs"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1"> {{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							v-model="record.specs"
						></a-input>
					</a-form-item>
				</template>
				<!-- 材质-->
				<span slot="customTitles3"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>材质</span
				>
				<template
					slot="materialTexture"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							v-model="record.materialTexture"
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
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							v-model="record.placeOfOrigin"
						></a-input>
					</a-form-item>
				</template>
				<!-- 件数 -->
				<span slot="customTitles5"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>本次货转件数</span
				>
				<template
					slot="currentPieceQuantity"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="若无可输入/"
							@blur="itemChange('currentPieceQuantity', record)"
							v-model="record.currentPieceQuantity"
						></a-input>
					</a-form-item>
				</template>
				<!-- 捆包号 -->
				<span slot="customTitles6"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>捆包号</span
				>
				<template
					slot="baleNo"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1">{{ text || '/' }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							v-model="record.baleNo"
						></a-input>
					</a-form-item>
				</template>
				<!-- 数量-->
				<span slot="customTitles7"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
					>本次货转数量（吨）</span
				>
				<template
					slot="currentQuantity"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input-number
							:min="0"
							:precision="4"
							:max="10000000"
							placeholder="请输入数量"
							v-model="record.currentQuantity"
							@blur="itemChange('currentQuantity', record)"
						></a-input-number>
					</a-form-item>
				</template>
				<span slot="customTitles8"
					><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i>计量方式</span
				>
				<template
					slot="metrologyWay"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入"
							:maxLength="50"
							v-model.trim="record.metrologyWay"
						></a-input>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="appointSpec != 1"
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
		</template>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { goodsTransferImportPurchase } from '@/v2/center/steels/api/goodsTransfer.js';
import FileUpload from '@/v2/center/steels/components/upload/FileUpload.vue';
import Property from './property.vue';
import { cloneDeep } from 'lodash';
import LeftTabsVue from '@/v2/center/assets/components/common/LeftTabs.vue';
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
	{
		key: 'materialName',
		dataIndex: 'materialName',
		slots: { title: 'customTitles1' },
		scopedSlots: { customRender: 'materialName' }
	},
	{ key: 'specs', dataIndex: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' } },
	{
		key: 'materialTexture',
		dataIndex: 'materialTexture',
		slots: { title: 'customTitles3' },
		scopedSlots: { customRender: 'materialTexture' }
	},
	{
		key: 'placeOfOrigin',
		dataIndex: 'placeOfOrigin',
		slots: { title: 'customTitles4' },
		scopedSlots: { customRender: 'placeOfOrigin' }
	},
	// 件数
	{
		key: 'currentPieceQuantity',
		dataIndex: 'currentPieceQuantity',
		slots: { title: 'customTitles5' },
		scopedSlots: { customRender: 'currentPieceQuantity' }
	},
	{ key: 'baleNo', dataIndex: 'baleNo', slots: { title: 'customTitles6' }, scopedSlots: { customRender: 'baleNo' } },
	{
		key: 'currentQuantity',
		dataIndex: 'currentQuantity',
		slots: { title: 'customTitles7' },
		scopedSlots: { customRender: 'currentQuantity' }
	},
	{
		key: 'metrologyWay',
		dataIndex: 'metrologyWay',
		slots: { title: 'customTitles8' },
		scopedSlots: { customRender: 'metrologyWay' }
	},
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
export default {
	props: ['handleType', 'appointSpec'],

	data() {
		return {
			columns,
			publicPath: process.env.BASE_URL,
			action: goodsTransferImportPurchase,
			// 上传需要参数
			paramsData: {},
			goodsTransferData: [], // 无收发货信息时，货转信息选中的数据
			selectData: [],
			editable: false,
			receiveIds: [],
			// 当前合同 所有的品名
			materialNameList: []
		};
	},
	mounted() {
		this.paramsData.contractId = this.$route.query.contractId;
		if (this.$route.query.goodsTransferId) {
			this.paramsData.goodsTransferId = this.$route.query.goodsTransferId;
		}
	},
	computed: {
		isEdit() {
			return this.$route.query.type == 'edit';
		}
	},
	methods: {
		getUploadFiles2(data) {
			this.receiveIds = [];
			if (this.appointSpec == 1) {
				this.receiveIds = [];
			}
			this.goodsTransferData.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
				el.tip = `${el.materialName},${el.specs},${el.materialTexture}`;
				data.forEach(el2 => {
					el2.mainId = `${el2.materialName}${el2.specs}${el2.placeOfOrigin}${el2.materialTexture}${el2.baleNo}`;
					el2.tip = `${el2.materialName},${el2.specs},${el2.materialTexture}`;
					if (el2.mainId == el.mainId) {
						el.currentPieceQuantity = el2.currentPieceQuantity;
						el.currentQuantity = el2.currentQuantity;
						if (this.appointSpec == 1) {
							this.receiveIds.push(el2.mainId);
						}
					}
				});
			});
			this.selectData = data;
		},
		// 初始化
		init(receiveIds, selectData, goodsTransferData) {
			this.receiveIds = receiveIds;
			this.selectData = selectData;
			this.goodsTransferData = goodsTransferData;
			/** 如果当前是不指定规格 获取当前合同中所有的品名 */
			let materialNameList = [];
			goodsTransferData.forEach(el => {
				const newArr = el.materialName.split(',');
				materialNameList = [...materialNameList, ...newArr];
			});
			// 去重
			const newMaterialNameList = Array.from(new Set(materialNameList));
			this.materialNameList = newMaterialNameList;

			// this.materialNameList = goodsTransferData.map(el => {
			//   return {
			//     value: el.materialName,
			//     label: el.materialName,
			//   }
			// })
		},
		itemChange(key, item) {
			// // 货转件数
			if (key == 'currentPieceQuantity') {
				if (!item.currentPieceQuantity) {
					item.currentPieceQuantity = '';
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (item.currentPieceQuantity !== '/') {
					if (!reg.test(item.currentPieceQuantity)) {
						item.currentPieceQuantity = '';
						this.$message.error('件数请输入/或者数字');
						return;
					}
					if (item.currentPieceQuantity < 1 || item.currentPieceQuantity > 99999999999999) {
						item.currentPieceQuantity = '';
						this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
						return;
					}
				}
			}
		},
		getSelectData(data) {
			const list = cloneDeep(data);
			// 如果当前是不指定规格 则重置 品名 规格 材质 产地
			if (this.appointSpec != 1) {
				list.forEach(el => {
					el.materialName = '';
					el.materialTexture = '';
					el.placeOfOrigin = '';
					el.specs = '';
				});
			}
			this.selectData = list;
		},
		//添加行
		addRow(index = 0) {
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			const flag2 = this.selectData.every(el => {
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
				materialName: '', //物资名称
				specs: undefined, //规格
				materialTexture: undefined, //材质
				currentQuantity: '', //数量
				placeOfOrigin: '',
				// 件数
				currentPieceQuantity: '',
				baleNo: '',
				metrologyWay: ''
			};

			this.selectData.splice(index + 1, 0, emptyRow);
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
					that.selectData.splice(index, 1);
				},
				onCancel() {}
			});
		}
	},
	components: {
		FileUpload,
		Property
	}
};
</script>

<style scoped></style>
