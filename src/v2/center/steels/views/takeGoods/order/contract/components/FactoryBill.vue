<template>
	<div>
		<template>
			<Property
				:list="goodsTransferData"
				@sendWarehouse="sendWarehouse"
				:contractDetails="contractDetails"
				:appointSpec="appointSpec"
				:upDeliveryMode="upDeliveryMode"
				:businessLineFullNo="businessLineFullNo"
				:uploadIds="receiveIds"
				@send="getSelectData"
			></Property>
			<div
				class="title"
				style="justify-content: space-between;margin-top: 20px;"
			>
				<span><i class="title_icon" />申请提货清单</span>

				<div
					class="upload"
					v-if="isRealTake"
				>
					<a-button
						type="default"
						@click="templateDownloadMethod"
						style="margin-right: 10px"
						><a-icon type="download" />模板下载</a-button
					>
					<FileUpload
						:action="action"
						:btnDisabled="!disabledAll"
						:paramsData="paramsData"
						@uploadFiles="getUploadFiles"
					></FileUpload>
				</div>

				<div
					class="upload"
					v-else
				>
					<a-button
						type="default"
						@click="downloadRealTakeTemplateMethod"
						style="margin-right: 10px"
						><a-icon type="download" />模板下载</a-button
					>
					<FileUpload
						:action="action2"
						:btnDisabled="!disabledReal"
						:paramsData="uploadQuerydata"
						@uploadFiles="handleApplyChange"
					></FileUpload>
				</div>
			</div>
			<!-- 计算合计 -->
			<div class="total">
				<span>合计：</span>
				<span v-if="appointSpec == 1">可提件数： {{ computeTotalInfo.totalCanTakePieceQuantity }}</span>
				<span v-if="appointSpec == 1">可提数量： {{ computeTotalInfo.totalCanTakeQuantity }}(吨)</span>
				<span>预提件数： {{ computeTotalInfo.totalCurrentApplyPieceQuantity }}</span>
				<span>预提数量： {{ computeTotalInfo.totalCurrentApplyQuantity }}(吨)</span>
			</div>
			<a-table
				:columns="columns"
				:scroll="{ x: true }"
				:dataSource="selectData"
				:pagination="false"
				:rowKey="record => `${record.mainId}-${record.keyId}`"
				:class="!disabledAll ? '' : 'disabled'"
				class="detailsTable"
			>
				<span
					slot="realTakePieceQuantity"
					slot-scope="text, record"
				>
					<!-- 判断是否是核心企业 核心企业可以输入 / 和数字 -->
					<a-input
						v-model="record.realTakePieceQuantity"
						size="small"
						:disabled="['preview'].includes(typeModel)"
						:formatter="value => value && parseInt(value)"
						@blur="formateInputRealPieceOrQuantity(record, 'realTakePieceQuantity')"
						v-if="isCoreAndGeneral"
					/>
					<a-input-number
						v-model="record.realTakePieceQuantity"
						:min="0"
						:max="99999999999999"
						:step="1"
						size="small"
						:disabled="['preview'].includes(typeModel)"
						:formatter="value => value && parseInt(value)"
						@blur="formateInputRealPieceOrQuantity(record, 'realTakePieceQuantity')"
						v-if="!isCoreAndGeneral"
					/>
				</span>
				<span
					slot="realTakeQuantity"
					slot-scope="text, record"
				>
					<a-input-number
						v-model="record.realTakeQuantity"
						:min="0"
						:step="0.001"
						:max="99999999999999.999"
						size="small"
						:disabled="['preview'].includes(typeModel)"
						@blur="e => formateInputRealPieceOrQuantity(record, 'realTakeQuantity', e)"
					/>
				</span>
				<!-- 品名-->
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
							:disabled="disabledReal"
							@change="changeMaterialName(record, 'materialName')"
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
				<template
					slot="specs"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1"> {{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							@blur="changeMaterialName(record, 'specs')"
							:disabled="disabledReal"
							v-model="record.specs"
						></a-input>
					</a-form-item>
				</template>
				<!-- 材质-->
				<template
					slot="materialTexture"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							@blur="changeMaterialName(record, 'materialTexture')"
							:disabled="disabledReal"
							v-model="record.materialTexture"
						></a-input>
					</a-form-item>
				</template>
				<!-- 产地 -->
				<template
					slot="placeOfOrigin"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							:disabled="disabledReal"
							@blur="changeMaterialName(record, 'placeOfOrigin')"
							v-model="record.placeOfOrigin"
						></a-input>
					</a-form-item>
				</template>
				<!-- 预提件数-->
				<template
					slot="currentApplyPieceQuantity"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="若无可输入/"
							:disabled="disabledReal"
							@blur="itemChange('currentApplyPieceQuantity', record)"
							v-model="record.currentApplyPieceQuantity"
						></a-input>
					</a-form-item>
				</template>
				<!-- 预提数量-->
				<template
					slot="currentApplyQuantity"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input-number
							v-model="record.currentApplyQuantity"
							:min="0"
							:disabled="disabledReal"
							@change="computeNum(record)"
							:precision="4"
							:max="99999999999999"
							size="small"
						/>
					</a-form-item>
				</template>
				<!-- 提货单价 -->
				<span
					slot="takeUnitPrice"
					slot-scope="text, record"
				>
					<a-input-number
						v-model="record.takeUnitPrice"
						:min="0"
						:disabled="disabledAll"
						@change="computeNum(record)"
						:precision="2"
						:max="99999999999999"
						size="small"
					/>
				</span>
				<!-- 计量方式 -->
				<template
					slot="metrologyWay"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入"
							:maxLength="50"
							:disabled="disabledAll"
							v-model.trim="record.metrologyWay"
						></a-input>
					</a-form-item>
				</template>
				<!-- 预提捆包号 -->
				<template
					slot="baleNo"
					slot-scope="text, record"
				>
					<a-form-item>
						<span v-if="appointSpec == 1">{{ text }}</span>
						<a-input
							v-else
							placeholder="若无可输入/"
							@blur="changeMaterialName(record, 'baleNo')"
							:disabled="disabledReal"
							v-model.trim="record.baleNo"
						></a-input>
					</a-form-item>
				</template>
				<!-- 预提货物含税金额(元) -->
				<span
					slot="goodTaxMount"
					slot-scope="text, record"
				>
					<span>
						{{ text }}
					</span>
				</span>
				<!-- 库位 -->
				<template
					slot="warehouseInfo"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入"
							:maxLength="100"
							:disabled="disabledAll"
							v-model.trim="record.warehouseInfo"
						></a-input>
					</a-form-item>
				</template>
				<!-- 备注 -->
				<template
					slot="remark"
					slot-scope="text, record"
				>
					<a-form-item>
						<a-input
							placeholder="请输入"
							:maxLength="100"
							:disabled="disabledAll"
							v-model.trim="record.remark"
						></a-input>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="appointSpec != 1 && !disabledReal"
				>
					<span @click="addRow(index, record)">
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
		</template>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { mapMutations, mapGetters } from 'vuex';
import { goodsTransferImportPurchase } from '@/v2/center/steels/api/goodsTransfer.js';
import { importContractDetail, exportPurchaseRel, downloadRealTakeTemplate } from '@/v2/center/steels/api/orderApply.js';
import ENV from '@/v2/config/env';
import FileUpload from '@/v2/center/steels/components/upload/FileUpload.vue';
import Property from './property.vue';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { appointSpecColumns, noAppointSpecColumns, appointSpecRealColumns, noAppointSpecRealColumns } from './config.js';
export default {
	props: {
		// 没有实提
		realTakeStatusNo: {
			default: true
		},
		// 是否指定规格
		appointSpec: {
			default: 1
		},
		businessLineFullNo: {
			default: ''
		},
		// 判断 是入库 还是厂提
		upDeliveryMode: {
			default: ''
		},
		contractDetails: {
			default: () => {}
		}
	},

	data() {
		return {
			publicPath: process.env.BASE_URL,
			action: importContractDetail,
			action2: `${ENV.BASE_GANG_API}/takeDelivery/realTakeImport`,
			goodsTransferData: [], // 无收发货信息时，货转信息选中的数据
			selectData: [],
			editable: false,
			receiveIds: [],
			// 当前合同 所有的品名
			materialNameList: [],
			ids: [],
			templateDownloadBtn: false,
			// 总数
			computeTotalInfo: {}
		};
	},
	mounted() {},

	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreAndGeneral() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		typeModel() {
			return this.$route.query.type;
		},
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		// 实提
		disabledReal() {
			return ['preview', 'upload', 'relation', 'oa'].includes(this.$route.query.type);
		},
		// 判断是否是实提
		isRealTake() {
			return this.typeModel != 'input' && this.realTakeStatusNo;
		},
		// 本次货转清单的
		columns() {
			// 显示本次货转清单
			if (this.isRealTake) {
				if (this.appointSpec == 1) {
					return appointSpecColumns;
				}
				return noAppointSpecColumns;
			} else {
				// 显示实提
				if (this.appointSpec == 1) {
					return appointSpecRealColumns;
				}
				return noAppointSpecRealColumns;
			}
		},
		// 上传需要参数
		paramsData() {
			return {
				contractId: this.$route.query.contractId,
				businessLineFullNo: this.businessLineFullNo,
				takeDeliveryId: this.$route.query.num || '',
				isModify: this.typeModel == 'edit' ? 1 : 0,
				appointSpec: this.appointSpec
			};
		},
		// 实提上传参数
		uploadQuerydata() {
			return {
				contractId: this.$route.query.contractId,
				serialNo: this.$route.query.id,
				appointSpec: this.appointSpec
			};
		}
	},
	watch: {
		selectData: {
			handler(list) {
				// 计算算预提件数
				let totalCurrentApplyPieceQuantity = 0;
				// 计算预提数量
				let totalCurrentApplyQuantity = 0;
				// 可提件数
				let totalCanTakePieceQuantity = 0;

				// 可提数量
				let totalCanTakeQuantity = 0;

				list.forEach(el => {
					const num = el.currentApplyPieceQuantity ? (el.currentApplyPieceQuantity == '/' ? 0 : el.currentApplyPieceQuantity) : 0;

					totalCurrentApplyPieceQuantity += Number(num);

					totalCurrentApplyQuantity += Number(el.currentApplyQuantity || 0);

					totalCanTakeQuantity += Number(el.canTakeQuantity || 0);

					const num2 = el.canTakePieceQuantity ? (el.canTakePieceQuantity == '/' ? 0 : el.canTakePieceQuantity) : 0;

					totalCanTakePieceQuantity += Number(num2);
				});
				this.computeTotalInfo = {
					totalCurrentApplyPieceQuantity,
					totalCurrentApplyQuantity,
					totalCanTakePieceQuantity,
					totalCanTakeQuantity
				};
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		getUploadFiles(data) {
			this.receiveIds = [];
			this.goodsTransferData.forEach(el => {
				el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}_${el.warehouse}`;
				data.forEach(el2 => {
					el2.mainId = `${el2.materialName}_${el2.specs}_${el2.materialTexture}_${el2.placeOfOrigin}_${el2.baleNo}_${el2.warehouse}`;
					if (el2.mainId == el.mainId) {
						el.currentPieceQuantity = el2.currentPieceQuantity;
						el.currentQuantity = el2.currentQuantity;

						this.receiveIds.push(el2.mainId);
					}
				});
			});
			this.selectData = data;
		},
		// 初始化
		init(receiveIds, selectData, goodsTransferData) {
			this.receiveIds = receiveIds;
			this.ids = receiveIds;
			this.selectData = selectData;
			this.goodsTransferData = goodsTransferData;
			/** 如果当前是不指定规格 获取当前合同中所有的品名 */
			let materialNameList = [];
			// 区分 是 开提单 还是 实提
			if (this.typeModel == 'input') {
				selectData.forEach(el => {
					const newArr = el.materialName.split(',');
					// 理重
					el.theoreticalWeight = el.theoreticalWeight || '/';
					materialNameList = [...materialNameList, ...newArr];
				});
			} else {
				goodsTransferData.forEach(el => {
					const newArr = el.materialName.split(',');
					// 理重
					el.theoreticalWeight = el.theoreticalWeight || '/';
					materialNameList = [...materialNameList, ...newArr];
				});
			}

			// 去重
			const newMaterialNameList = Array.from(new Set(materialNameList));
			this.materialNameList = newMaterialNameList;
		},
		itemChange(key, item) {
			this.$forceUpdate();
			// // 预提件数
			if (key == 'currentApplyPieceQuantity') {
				if (!item.currentApplyPieceQuantity) {
					item.currentApplyPieceQuantity = '';
					this.$forceUpdate();
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (item.currentApplyPieceQuantity !== '/') {
					if (!reg.test(item.currentApplyPieceQuantity)) {
						item.currentApplyPieceQuantity = '';
						this.$forceUpdate();
						this.$message.error('件数请输入/或者数字');
						return;
					}
					if (item.currentApplyPieceQuantity < 1 || item.currentApplyPieceQuantity > 99999999999999) {
						item.currentApplyPieceQuantity = '';
						this.$forceUpdate();
						this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
						return;
					}
				}
			}
		},
		// 导出货物明细模板
		templateDownloadMethod() {
			this.templateDownloadBtn = true;
			exportPurchaseRel({
				contractId: this.$route.query.contractId,
				takeDeliveryId: this.$route.query.num || '',
				isModify: this.typeModel == 'edit' ? 1 : 0,
				businessLineFullNo: this.businessLineFullNo,
				appointSpec: this.appointSpec
			})
				.then(res => {
					comDownload(res, null, '提货申请列表导入模板.xls');
				})
				.finally(() => {
					this.templateDownloadBtn = false;
				});
		},
		getSelectData(data, ids) {
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
			list.forEach(item => {
				// 预提货物含税金额(元)
				item.goodTaxMount = ((item.presetUnitPrice || 0) * (item.availableQuantity || 0)).toFixed(6);
			});
			this.selectData = list;
			this.ids = ids || [];
		},
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
					el.currentApplyPieceQuantity &&
					el.currentApplyQuantity &&
					el.metrologyWay &&
					el.takeUnitPrice &&
					el.goodTaxMount &&
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
				mainId: String(new Date().getTime()),
				materialName: '', //物资名称
				specs: undefined, //规格
				materialTexture: undefined, //材质
				placeOfOrigin: '',
				baleNo: '',
				metrologyWay: ''
			};

			this.selectData.splice(index + 1, 0, { ...emptyRow, ...item, mainId: String(new Date().getTime()), baleNo: '', id: '' });
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
		},
		// 更改品名
		changeMaterialName(item, key) {
			if (key == 'materialName') {
				const newInfo = this.goodsTransferData.find(el => el.materialName.includes(item.materialName)) || {};
				// 计算理重
				item.theoreticalWeight = newInfo.theoreticalWeight || '/';
				// 预提件数 默认取合同信息栏目中的可提件数，
				item.currentApplyPieceQuantity = newInfo.availablePieceQuantity || null;
				// 预提数量 默认取合同信息栏目中的可提数量，
				item.currentApplyQuantity = newInfo.availableQuantity || null;
				// 提货单价(元/吨) 默认“合同含税单价（元/吨）”
				item.takeUnitPrice = newInfo.presetUnitPrice || item.takeUnitPrice || 0;
				// 合同含税单价(元/吨) 合同不含税单价（元/吨）
				item.presetUnitPrice = newInfo.presetUnitPrice || '/';
				item.excludingTaxAmount = newInfo.excludingTaxAmount || '/';
				// 预提货物含税金额(元)
				item.goodTaxMount = ((item.takeUnitPrice || 0) * (item.currentApplyQuantity || 0)).toFixed(6);
				this.$forceUpdate();
			}
			/** 校验五要素 */
			this.checkSingle(item, key);
		},
		// 计算
		computeNum(item) {
			// 计算预提货物含税金额(元)
			// 预提货物含税金额=提货单价(元/吨)*预提货数量(吨)
			item.goodTaxMount = ((item.takeUnitPrice || 0) * (item.currentApplyQuantity || 0)).toFixed(6);

			this.$forceUpdate();
		},
		// 检测五项唯一
		checkSingle(item, key) {
			const flag2 = this.selectData.some(el => {
				el.testId = `${el.materialName}${el.specs}${el.materialTexture}${el.placeOfOrigin}${el.baleNo}`;
				if (!el.materialName || !el.specs || !el.materialTexture || !el.placeOfOrigin || !el.baleNo) {
					return true;
				}
			});
			if (flag2) {
				return;
			}
			const tplArr = this.selectData.map(el => el.testId);
			const repeatArr = Array.from(new Set(tplArr));
			if (repeatArr.length != tplArr.length) {
				this.$message.error('品名规格材质产地捆包号重复');
				item[key] = '';
				return;
			}
		},
		formateInputRealPieceOrQuantity(item, type, e) {
			let index = null;
			for (let i = 0; i < this.selectData.length; i++) {
				if (this.selectData[i].id == item.id) {
					index = i;
					break;
				}
			}

			let cloneItem = cloneDeep(item);
			/** 判断 实提件数 是否是 / */
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity != '/') {
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (item.realTakePieceQuantity < 0 || item.realTakePieceQuantity > 99999999999999) {
					item.realTakePieceQuantity = '';
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
			}
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity == '/') {
				cloneItem[type] = '/';
			} else {
				cloneItem[type] = Math.round(item[type] * 1000) / 1000;
			}

			if (type == 'realTakeQuantity') {
				cloneItem.realTakeQuantity = e.target.value;
			}
			this.$set(this.selectData, index, cloneItem);
		},
		// 实提
		downloadRealTakeTemplateMethod() {
			downloadRealTakeTemplate({
				serialNo: this.$route.query.id,
				appointSpec: this.appointSpec
			}).then(res => {
				comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
			});
		},
		// 上传实提
		handleApplyChange(data) {
			this.$message.success('导入成功');
			const tempData = data;
			const currentData = cloneDeep(this.data);
			for (let j = 0; j < currentData.length; j++) {
				for (let i = 0; i < tempData.length; i++) {
					if (currentData[j].purchaseId == tempData[i].purchaseId) {
						if (tempData[i].realTakePieceQuantity) {
							if (typeof tempData[i].realTakePieceQuantity == 'number') {
								currentData[j].realTakePieceQuantity = Math.round(tempData[i].realTakePieceQuantity * 1000) / 1000;
							} else {
								currentData[j].realTakePieceQuantity = tempData[i].realTakePieceQuantity;
							}
						}
						if (tempData[i].realTakeQuantity) {
							currentData[j].realTakeQuantity = Math.round(tempData[i].realTakeQuantity * 1000) / 1000;
						}
					}
				}
			}
			this.selectData = currentData;
		},
		save() {
			// 校验捆包号 是否是必填
			const flag2 = this.selectData.some(el => {
				el.mainId = `${el.materialName}${el.specs}${el.materialTexture}${el.placeOfOrigin}${el.baleNo}`;
				if (
					!el.materialName ||
					!el.specs ||
					!el.materialTexture ||
					!el.placeOfOrigin ||
					!el.currentApplyPieceQuantity ||
					!el.currentApplyQuantity ||
					!el.metrologyWay ||
					!el.takeUnitPrice ||
					!el.baleNo ||
					!el.goodTaxMount
				) {
					return true;
				}
			});
			if (flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			const tplArr = this.selectData.map(el => el.mainId);
			const repeatArr = Array.from(new Set(tplArr));
			if (repeatArr.length != tplArr.length) {
				this.$message.error('品名规格材质产地捆包号重复');
				return;
			}
			return this.selectData;
		},
		sendWarehouse(info) {
			this.$emit('sendWarehouse', info);
		}
	},
	components: {
		FileUpload,
		Property
	}
};
</script>

<style scoped lang="less">
.title {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}
.upload {
	display: flex;
	align-items: center;
}
/deep/ .ant-form-item {
	margin-bottom: 0;
}
.total {
	span {
		margin-right: 5px;
	}
}
</style>
