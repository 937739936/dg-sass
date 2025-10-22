<template>
	<div>
		<template>
			<PropertyYuShen
				:goodsTransferData="goodsTransferData"
				:uploadIds="receiveIds"
				@send="getSelectData"
			></PropertyYuShen>
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
						:btnDisabled="!ifEditable"
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
				rowKey="id"
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
						{{ text }}
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
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="请输入"
							:disabled="ifEditable"
							v-model="record.specs"
							@change="changeMainId"
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
							placeholder="请输入"
							:disabled="ifEditable"
							v-model="record.materialTexture"
							@change="changeMainId"
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
							placeholder="请输入"
							:disabled="ifEditable"
							v-model="record.placeOfOrigin"
							@change="changeMainId"
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
							:disabled="ifEditable"
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
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="请输入"
							:disabled="ifEditable"
							v-model="record.baleNo"
							@change="changeMainId"
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
							:disabled="ifEditable"
							:min="1"
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
						{{ text }}
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="!ifEditable"
				>
					<span
						v-if="appointSpec == 0"
						@click="addRow(index, record)"
					>
						<a-icon
							type="plus-circle"
							style="color: var(--primary-color);font-size: 20px; margin-right: 15px; cursor: pointer"
					/></span>
					<span
						v-if="selectData.length > 0"
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
import PropertyYuShen from './propertyYuShen.vue';

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
	}
];
export default {
	// 是否指定规格
	props: ['appointSpec'],
	data() {
		return {
			goodsTransferData: [],
			publicPath: process.env.BASE_URL,
			action: goodsTransferImportPurchase,
			// 上传需要参数
			paramsData: {},
			goodsTransferData: [], // 无收发货信息时，货转信息选中的数据
			selectData: [],
			editable: true,
			receiveIds: []
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
		},
		// 提交
		ifEditable() {
			return this.$route.query.flag == 'submit';
		},
		columns() {
			if (this.ifEditable) {
				return columns;
			} else {
				return [
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
					{
						title: '操作',
						dataIndex: 'action',
						key: 'action',
						fixed: 'right',
						scopedSlots: { customRender: 'action' },
						width: 100
					}
				];
			}
		}
	},
	watch: {
		selectData: {
			handler(data) {
				let total = 0;
				data.forEach(el => {
					el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
					if (el.currentQuantity) {
						total += el.currentQuantity || 0;
					}
				});
				this.$emit('send', total);
			},
			deep: true
		}
	},
	methods: {
		getUploadFiles2(data) {
			this.receiveIds = [];
			this.goodsTransferData.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
				el.tip = `${el.materialName},${el.specs},${el.materialTexture}`;
				data.forEach(el2 => {
					el2.mainId = `${el2.materialName}${el2.specs}${el2.placeOfOrigin}${el2.materialTexture}${el2.baleNo}`;
					el2.tip = `${el2.materialName},${el2.specs},${el2.materialTexture}`;
					if (el2.mainId == el.mainId) {
						el.currentPieceQuantity = el2.currentPieceQuantity;
						el.currentQuantity = el2.currentQuantity;
						this.receiveIds.push(el2.mainId);
					}
				});
			});
			this.selectData = data;
			this.$forceUpdate();
		},
		// 初始化
		init(receiveIds, selectData, goodsTransferData) {
			this.receiveIds = receiveIds;
			this.selectData = selectData;
			this.goodsTransferData = goodsTransferData;
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
		changeMainId() {},
		//添加行
		addRow(index = 0, item) {
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			const flag2 = this.selectData.every(el => {
				if (
					el.materialName &&
					el.specs &&
					el.materialTexture &&
					el.placeOfOrigin &&
					el.currentPieceQuantity &&
					el.baleNo &&
					el.currentQuantity
				) {
					return true;
				}
			});
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			this.selectData.splice(index + 1, 0, JSON.parse(JSON.stringify(item)));
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

					// 同步上面选择的交互
					const mainIdList = that.selectData.map(el => el.mainId);
					const receiveIds = [...new Set(mainIdList)];
					that.receiveIds = receiveIds;
					that.$forceUpdate();
				},
				onCancel() {}
			});
		},
		getSelectData(data) {
			this.selectData = JSON.parse(JSON.stringify(data));
		}
	},
	components: {
		FileUpload,
		PropertyYuShen
	}
};
</script>

<style scoped></style>
