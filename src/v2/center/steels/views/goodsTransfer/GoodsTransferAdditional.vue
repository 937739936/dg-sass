<template>
	<div id="goodsTransferApplyBuyer">
		<div class="steps-wrap">
			<a-steps :current="1">
				<a-step title="选择待开具货转的合同信息" />
				<a-step title="选择对应货物信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<div class="goods-form-apply">
			<a-form
				:form="searchForm"
				ref="goodsTransferForm"
				layout="inline"
				labelAlign="right"
			>
				<div class="title"><i class="title_icon"></i>基本信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="合同编号"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`contractNo`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="卖方名称"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`sellCompanyName`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="钢材种类"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`steelTypeDesc`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="业务类型"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`businessTypeDesc`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="合同期限"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`effectiveDate`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
						v-if="[2].includes(handleType)"
					>
						<a-form-item
							label="本次货转数量"
							:colon="false"
						>
							<!-- 代采+仓押业务 已对接仓库并且货转方式选择为手动挑选入库明细 禁止输入 -->
							<a-input
								v-decorator="[
									`transferQuantity`,
									{
										rules: [
											{ required: true, message: `本次货转数量必填` },
											{ pattern: numberReg, message: '请输入数字，最多四位小数' }
										],
										validateTrigger: 'blur'
									}
								]"
								placeholder="请输入"
								:maxLength="14"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="货转开具日期"
							:colon="false"
						>
							<a-date-picker
								format="YYYY-MM-DD"
								valueFormat="YYYY-MM-DD"
								v-decorator="[
									`issuedDate`,
									{
										rules: [{ required: true, message: `请选择日期`, type: 'string' }]
									}
								]"
								placeholder="请选择"
							>
							</a-date-picker>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="验收日期"
							:colon="false"
						>
							<a-date-picker
								format="YYYY-MM-DD"
								valueFormat="YYYY-MM-DD"
								v-decorator="[
									`acceptanceDate`,
									{
										rules: [{ required: true, message: `请选择日期`, type: 'string' }]
									}
								]"
								placeholder="请选择"
							>
							</a-date-picker>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
						v-if="[1].includes(handleType)"
					>
						<a-form-item
							label="仓库"
							:colon="false"
						>
							<a-select
								show-search
								placeholder="请输入"
								:filter-option="false"
								:default-active-first-option="false"
								:not-found-content="fetching ? undefined : null"
								@focus="getWarehouseList"
								@search="getWarehouseList"
								@select="selectWarehouse"
								v-decorator="[
									'warehouse',
									{
										rules: [{ required: handleType == 1, message: '请选择仓库' }]
									}
								]"
							>
								<a-spin
									v-if="fetching"
									slot="notFoundContent"
									size="small"
								/>
								<a-select-option
									v-for="(item, i) in warehouseList"
									:key="item.label"
								>
									{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- 是否对接仓库 -->
					<a-col
						:span="12"
						class="row"
						v-if="handleType == 1"
					>
						<a-form-item
							label="货转方式"
							:colon="false"
						>
							<a-select
								placeholder="请选择"
								@change="getGoodsTransferWay"
								:filter-option="false"
								:disabled="!isAbutment"
								v-decorator="[
									'goodsTransferWay',
									{
										rules: [{ required: true, message: '请选择货转方式' }]
									}
								]"
							>
								<a-select-option
									v-for="(item, i) in goodsTransferWayList"
									:key="item.value"
								>
									{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<!-- 未对接仓库 -->
				<div v-if="!isAbutment && handleType == 1">
					<TransferBill
						ref="transferBill"
						:appointSpec="contractInfo.appointSpec"
						:handleType="handleType"
					></TransferBill>
				</div>
				<!-- 对接仓库 -->
				<div v-if="isAbutment && handleType == 1">
					<!-- 判断 是合同填写明细  -->
					<TransferBill
						ref="transferBill"
						:appointSpec="contractInfo.appointSpec"
						:handleType="handleType"
						v-if="searchForm.getFieldValue('goodsTransferWay') == 'CONTRACT_DETAILS'"
					></TransferBill>
					<!-- 2 手工挑选 -->
					<WarehouseInfoModal
						@send="getConfirmSelectData"
						:warehouseAbbreviation="searchForm.getFieldValue('warehouse')"
						v-if="searchForm.getFieldValue('goodsTransferWay') == 'MANUAL_PICK'"
						:steelType="steelType"
						:handleType="handleType"
						ref="warehouseInfo"
					>
					</WarehouseInfoModal>
				</div>
			</a-form>
			<div>
				<div class="title"><i class="title_icon"></i>货权证明</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:ifEditable="true"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:businessType="contractInfo.businessType"
							:type="'additional'"
						>
						</CustomUpload>
					</div>
				</div>
			</div>

			<div class="btn-wrap">
				<a-button @click="prevContract">返回</a-button>
				<a-button
					type="primary"
					@click="submitGoodsTransferApplyForm('save')"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="submitGoodsTransferApplyForm('submit')"
					>提交</a-button
				>
			</div>
		</div>
		<a-modal
			v-model="errorInfo.visible"
			width="900px"
			@ok="save"
			okText="确定"
		>
			<div>本次挑选明细</div>
			<a-table
				:scroll="{ x: true }"
				:dataSource="errorInfo.list"
				rowKey="id"
				:columns="errorColumns"
				:pagination="false"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
			<div>{{ errorInfo.msg }}</div>
		</a-modal>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	getSupplementContractInfo,
	saveSupplement,
	updateSupplement,
	API_SteelsGoodstransferDetail,
	submitSupplement,
	goodsTransferImportPurchase,
	checkSupplementGoodsTransfer,
	getStorageList
} from '@/v2/center/steels/api/goodsTransfer.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';

import TransferBill from './components/transferBill.vue';
import WarehouseInfoModal from './components/warehouseInfoModal.vue';
import PurchaseDetails02 from './components/PurchaseDetails.vue';
const errorColumns = [
	{ key: 'materialName', dataIndex: 'materialName', title: '品名' },
	{ key: 'specs', dataIndex: 'specs', title: '规格' },
	{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质' },
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地' },
	{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号' },

	{ key: 'currentPieceQuantity', dataIndex: 'currentPieceQuantity', title: '件数/件' },
	{ key: 'currentQuantity', dataIndex: 'currentQuantity', title: '重量/吨', fixed: 'right' }
];

export default {
	name: 'goodsTransferApplyBuyer',
	mounted() {
		this.contractNo = this.$route.query.contractNo;
		// 修改 或者 详情
		if (this.$route.query.goodsTransferId) {
			this.getEditDetail();
		} else {
			this.getContractDetail();
		}
		this.getWarehouseList();
	},
	data() {
		return {
			searchForm: this.$form.createForm(this),
			id: '',
			pdfUrl: '',
			selectedRows: [], // 选中的批次数据
			fileInfos: [],
			fileDataSource: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
			editable: false,
			info: {},
			contractInfo: {},
			steelType: '',
			saveDisabled: false,
			paramsData: {},
			// 仓库列表
			warehouseList: [],
			fetching: false,
			// 是否对接仓库
			isAbutment: false,
			// 获取手动挑选的数据
			confirmSelectData: [],
			// 子组件需要
			selectReceiveIds: [],
			purchaseLists: [],
			toBeIssuedList: [],
			// 错误信息
			errorColumns,
			errorInfo: {
				list: [],
				msg: '',
				visible: false
			},
			cacheParams: {},
			// 采购合同明细数据
			purchaseDetailsData: []
		};
	},
	computed: {
		isSpecial() {
			return this.contractInfo.steelType != 'SCRAP_STEEL' && this.contractInfo.appointSpec == 0;
		},
		handleType() {
			// 代采 代采+仓押 仓押  其他 联营
			return 1;
		},
		isEdit() {
			return this.$route.query.type == 'edit';
		},
		goodsTransferWayList() {
			// 线上合同的仓押 和 补录合同的代采+仓押
			if ([1].includes(this.handleType)) {
				return [
					{
						value: 'CONTRACT_DETAILS',
						label: '合同明细填写'
					},
					{
						value: 'MANUAL_PICK',
						label: '手动挑选入库明细'
					}
				];
			}
			return [
				{
					value: 'ATTACHMENT_UPLOAD',
					label: '附件上传'
				},
				{
					value: 'MANUAL_PICK',
					label: '手动挑选入库明细'
				}
			];
		}
	},
	methods: {
		// 获取合同详情
		async getContractDetail() {
			const params = {
				generateWay: this.$route.query.generateWay,
				contractId: this.$route.query.contractId
			};
			const res = await getSupplementContractInfo(params);
			const info = res.data;
			this.contractInfo = res.data;
			this.steelType = res.data.steelType;
			this.$nextTick(() => {
				this.searchForm.setFieldsValue({
					steelTypeDesc: info.steelTypeDesc,
					contractNo: info.contractNo,
					sellCompanyName: info.sellCompanyName,
					// 合同期限
					effectiveDate: `${info.effectiveStartDate} - ${info.effectiveEndDate}`,
					businessTypeDesc: info.businessTypeDesc
				});
			});
			const list = info.purchaseList || [];
			/** 钢材种类为：线材/建材/型材/管材/钢坯，件数由业务员人工输入
			 */
			// isDisabledQuantity 判断本次货转数量可否修改
			list.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
			});
			//  货待开具货权数据
			this.toBeIssuedList = list;
			this.$nextTick(() => {
				this.$refs.transferBill && this.$refs.transferBill.init([], [], list);
				this.$refs.warehouseInfo && this.$refs.warehouseInfo.init([], [], list);
			});
		},
		// 获取货转详情
		async getEditDetail() {
			const res = await API_SteelsGoodstransferDetail({ id: this.$route.query.goodsTransferId, isDetail: 0 });
			const contractInfo = res.data.contract;
			this.contractInfo = contractInfo;
			const { goodsTransfer } = res.data;
			this.steelType = contractInfo.steelType;
			this.isAbutment = goodsTransfer.warehouseIsDocking;
			this.$nextTick(() => {
				this.searchForm.setFieldsValue({
					steelTypeDesc: contractInfo.steelTypeDesc,
					contractNo: contractInfo.contractNo,
					sellCompanyName: contractInfo.sellCompanyName,
					// 合同期限
					effectiveDate: `${contractInfo.effectiveStartDate} - ${contractInfo.effectiveEndDate}`,
					businessTypeDesc: contractInfo.businessTypeDesc,
					acceptanceDate: goodsTransfer.acceptanceDate,
					issuedDate: goodsTransfer.issuedDate,
					transferQuantity: goodsTransfer.transferQuantity,
					goodsTransferWay: goodsTransfer.goodsTransferWay,
					warehouse: goodsTransfer.warehouse
				});
				this.$nextTick(() => {
					this.searchForm.setFieldsValue({
						goodsTransferWay: goodsTransfer.goodsTransferWay,
						warehouse: goodsTransfer.warehouse
					});
				});
			});
			res.data.attachmentFileVO.forEach(el => {
				el.url = el.path;
			});
			this.fileInfos = res.data.attachmentFileVO || [];
			this.fileDataSource = res.data.attachmentFileVO || [];

			this.fileDataSource.map(i => {
				i.typeName = '入库单';
				if (contractInfo.businessType == 'SOURCING_AGENT') {
					i.typeName = '出库单';
				}
			});
			// /判断选中
			const purchaseLists = res.data.purchaseList || res.data.purchaseLists || [];
			const toBeIssuedList = res.data.toBeIssuedList || [];
			const receiveIds = [];
			//  如果是修改 剩余件数 和 剩余数量要 加上自己本身
			toBeIssuedList.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
				purchaseLists.forEach(el2 => {
					el2.mainId = `${el2.materialName}${el2.specs}${el2.placeOfOrigin}${el2.materialTexture}${el2.baleNo}`;
					if (el2.mainId == el.mainId) {
						el.currentPieceQuantity = el2.currentPieceQuantity;
						el.currentQuantity = el2.currentQuantity;
						receiveIds.push(el2.mainId);
					}
				});
			});
			const list = new Set(receiveIds);
			this.selectReceiveIds = Array.from(list);
			this.purchaseLists = purchaseLists;
			this.purchaseDetailsData = purchaseLists;
			this.toBeIssuedList = toBeIssuedList;
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$refs.transferBill && this.$refs.transferBill.init(receiveIds, purchaseLists, toBeIssuedList);
					this.$refs.warehouseInfo && this.$refs.warehouseInfo.init(receiveIds, purchaseLists, toBeIssuedList);
				});
			});
		},
		submitGoodsTransferApplyForm(type) {
			this.searchForm.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					let purchaseList = [];
					// 校验必填项 合同货转清单
					let selectData = this.$refs.transferBill ? this.$refs.transferBill.selectData : [];

					// 判断 是否是手工弹窗
					let confirmSelectData = this.confirmSelectData || [];

					if (values.goodsTransferWay == 'MANUAL_PICK') {
						if (!confirmSelectData.length) {
							this.$message.error('请选择货转清单');
							return;
						}

						purchaseList = JSON.parse(JSON.stringify(confirmSelectData || '[]'));
						purchaseList.forEach(el => {
							el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
							el.currentPieceQuantity = ['/', '-'].includes(el.currentPieceQuantity) ? null : el.currentPieceQuantity;
							el.pieceQuantity = ['/', '-'].includes(el.pieceQuantity) ? null : el.pieceQuantity;
						});
					}
					// 合同明细
					if (['CONTRACT_DETAILS'].includes(values.goodsTransferWay) && this.handleType == 1) {
						if (!selectData.length) {
							this.$message.error('请选择货转清单');
							return;
						}

						const flag = selectData.some(el => {
							if (el.metrologyWay === '' || el.metrologyWay === undefined || el.metrologyWay === null) {
								return true;
							}
							if (el.currentPieceQuantity === '' || el.currentPieceQuantity === undefined || el.currentPieceQuantity === null) {
								return true;
							}
							if (el.currentQuantity === '' || el.currentQuantity === undefined || el.currentQuantity === null) {
								return true;
							}
						});
						if (flag && this.handleType == 1) {
							this.$message.error('请完成货转清单的必填项操作');
							return;
						}
						purchaseList = JSON.parse(JSON.stringify(selectData || '[]'));
						purchaseList.forEach(el => {
							el.currentPieceQuantity = ['/', '-'].includes(el.currentPieceQuantity) ? null : el.currentPieceQuantity;
							el.pieceQuantity = ['/', '-'].includes(el.pieceQuantity) ? null : el.pieceQuantity;
						});
					}
					// 附件上传

					if (!this.fileInfos.length) {
						this.$message.error('请上传附件');
						return;
					}
					this.fileInfos.forEach(el => {
						el.fileId = el.fileId ? el.fileId : el.id;
					});

					let _this = this;

					const params = {
						contractId: _this.$route.query.contractId,
						acceptanceDate: values.acceptanceDate,
						issuedDate: values.issuedDate,
						purchaseList: purchaseList,
						attachList: _this.fileInfos,
						generateWay: _this.$route.query.generateWay,
						warehouse: values.warehouse || null,
						goodsTransferWay: values.goodsTransferWay || null
					};
					if (this.$route.query.goodsTransferId) {
						params.goodsTransferId = this.$route.query.goodsTransferId;
					}
					if ([2, 4].includes(this.handleType)) {
						params.transferQuantity = values.transferQuantity;
					}
					// 校验是否满足条件
					const res = await checkSupplementGoodsTransfer(params);
					let that = this;
					/** 获取汇总信息 */
					const obj = {};
					params.purchaseList.forEach(el => {
						if (!obj[el.mainId]) {
							obj[el.mainId] = [el];
						} else {
							obj[el.mainId].push(el);
						}
					});
					const temp = [];
					for (let key in obj) {
						let currentPieceQuantity = 0;
						let currentQuantity = 0;
						let ele = {};
						obj[key].forEach(el => {
							if (el.currentPieceQuantity != '/' && el.currentPieceQuantity != '' && el.currentPieceQuantity != null  && el.currentPieceQuantity != '-') {
								currentPieceQuantity += Number(el.currentPieceQuantity);
							}
							if (el.currentQuantity != '/' && el.currentQuantity != '' && el.currentQuantity != null) {
								currentQuantity += Number(el.currentQuantity);
							}
							ele = el;
						});
						temp.push({
							...ele,
							currentPieceQuantity: currentPieceQuantity.toFixed(3),
							currentQuantity: currentQuantity.toFixed(3)
						});
					}
					this.errorInfo.list = temp;
					this.errorInfo.msg = '';
					this.cacheParams = {
						type,
						params
					};
					// 这个判断必须这样写 不要改
					if (res.data !== true) {
						this.errorInfo.msg = res.data;
					}
					if ([1, 4].includes(this.handleType) && params.goodsTransferWay == 'MANUAL_PICK') {
						this.errorInfo.visible = true;
					} else {
						if (res.data !== true) {
							this.$confirm({
								centered: true,
								title: '提示',
								okText: '确定',
								content: res.data,
								cancelText: '取消',
								onOk: () => {
									that.submitGoodsTransferApplyFormFn(type, params);
								},
								onCancel() {
									that.saveDisabled = false;
								}
							});
						} else {
							this.submitGoodsTransferApplyFormFn(type, params);
						}
					}
				}
			});
		},
		save() {
			this.submitGoodsTransferApplyFormFn(this.cacheParams.type, this.cacheParams.params);
		},
		async submitGoodsTransferApplyFormFn(type, params) {
			if (this.saveDisabled) {
				return;
			}
			this.saveDisabled = true;
			let _this = this;
			try {
				if (type == 'save') {
					let Fn = this.$route.query.goodsTransferId ? updateSupplement : saveSupplement;
					await Fn(params);
				} else {
					await submitSupplement(params);
				}
				this.$message.success('操作成功！');
				this.saveDisabled = false;
				this.$router.push('/center/steels/goodsTransfer/goodsTransferReceiveList');
			} catch (error) {
				this.saveDisabled = false;
			} finally {
				this.saveDisabled = false;
			}
		},

		prevContract() {
			this.$router.go(-1);
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		// 获取仓库列表
		async getWarehouseList(name) {
			this.fetching = true;
			try {
				const res = await getStorageList({ condition: name });
				this.warehouseList = res.data;
				this.fetching = false;
			} catch (error) {
				this.fetching = false;
			}
		},
		// 选择仓库
		selectWarehouse(value) {
			// 选择的仓库
			const item = this.warehouseList.find(el => el.label == value);
			this.isAbutment = item.value;
			/** 仓押业务 和补录合同代采+仓押业务 */
			if ([1].includes(this.handleType)) {
				this.$nextTick(() => {
					this.searchForm && this.searchForm.setFieldsValue({ goodsTransferWay: 'CONTRACT_DETAILS' });
				});
			} else {
				this.$nextTick(() => {
					this.searchForm && this.searchForm.setFieldsValue({ goodsTransferWay: 'ATTACHMENT_UPLOAD' });
				});
			}
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$refs.transferBill && this.$refs.transferBill.init([], [], this.toBeIssuedList);
					this.$refs.warehouseInfo && this.$refs.warehouseInfo.init([], [], this.toBeIssuedList);
				});
			});
		},
		// 货转方式
		getGoodsTransferWay() {
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$refs.transferBill && this.$refs.transferBill.init([], [], this.toBeIssuedList);
					this.$refs.warehouseInfo && this.$refs.warehouseInfo.init([], [], this.toBeIssuedList);
				});
			});
		},
		// 判断是否设置货数量
		getConfirmSelectData(val) {
			this.confirmSelectData = val || [];
			if (this.handleType == 4 && this.searchForm.getFieldValue('goodsTransferWay') == 'MANUAL_PICK' && this.isAbutment) {
				// 统计数量
				let total = 0;
				this.confirmSelectData.forEach(el => {
					total += el.currentQuantity;
				});
				this.searchForm.setFieldsValue({ transferQuantity: total.toFixed(3) });
			}
		}
	},
	components: {
		CustomUpload,
		TransferBill,
		WarehouseInfoModal,
		PurchaseDetails02
	}
};
</script>

<style lang="less">
#goodsTransferApplyBuyer {
	color: rgba(0, 0, 0, 0.75);
	padding-bottom: 80px;

	.ant-table td,
	.ant-table th {
		white-space: nowrap;
	}

	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}

	.row {
		padding-left: 40px;
		line-height: 60px;
		margin-bottom: 0;
	}

	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}

	.ant-form-item-control {
		input {
			width: 240px;
		}

		.ant-select {
			width: 240px;
		}
	}

	.date-range {
		.ant-calendar-picker {
			width: 240px;

			input {
				width: 90px;
			}
		}
	}

	.weight-unit .ant-form-item-children {
		&:after {
			content: '吨';
			font-size: 12px;
			color: rgba(0, 0, 0, 0.75);
			margin-left: 10px;
		}
	}

	.table-wrap {
		margin-bottom: 30px;
	}

	.ant-form-inline .ant-form-item-with-help {
		margin-bottom: 0;
	}
}
.title {
	display: flex;
	align-items: center;
	// justify-content: space-between;
}
.upload {
	display: flex;
	align-items: center;
	margin-left: 20px;
}
</style>
