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
					>
						<a-form-item
							label="本次货转数量"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`transferQuantity`]"
								placeholder=""
							></a-input>
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
								:disabled="ifEditable"
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
								:disabled="ifEditable"
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
					>
						<a-form-item
							label="仓库"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[`warehouse`]"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<!-- 是否对接仓库 -->
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="货转方式"
							:colon="false"
						>
							<a-select
								placeholder="请选择"
								:filter-option="false"
								disabled
								v-decorator="[
									'goodsTransferWay',
									{
										rules: [{ required: true, message: '请选择货转方式' }]
									}
								]"
							>
								<a-select-option
									key="CONTRACT_DETAILS"
									value="CONTRACT_DETAILS"
								>
									合同明细填写
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<TransferBill
					ref="transferBill"
					:appointSpec="contractInfo.appointSpec"
					@send="getTransferQuantity"
				></TransferBill>
			</a-form>
			<!-- 代采业务 || 上传 || 未对接仓库 -->
			<div>
				<div class="title"><i class="title_icon"></i>货权证明</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:ifEditable="!ifEditable"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:businessType="contractInfo.businessType"
							:type="'yuShen'"
						>
						</CustomUpload>
					</div>
				</div>
			</div>

			<div class="btn-wrap">
				<a-button @click="prevContract">返回</a-button>
				<a-button
					v-if="!ifEditable"
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

import TransferBill from './components/transferBillYuShen.vue';
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
	},
	data() {
		return {
			searchForm: this.$form.createForm(this),
			id: '',
			pdfUrl: '',
			selectedRows: [], // 选中的批次数据
			fileInfos: [],
			fileDataSource: [],
			numberReg: /^(\d+)(\.\d{1,3})?$/,
			editable: false,
			info: {},
			contractInfo: {},
			steelType: '',
			saveDisabled: false,
			paramsData: {},
			// 子组件需要
			selectReceiveIds: [],
			purchaseLists: [],
			toBeIssuedList: [],
			// 错误信息
			cacheParams: {}
		};
	},
	computed: {
		handleType() {
			// 仓押
			return 1;
		},
		isEdit() {
			return this.$route.query.type == 'edit';
		},
		// 提交
		ifEditable() {
			return this.$route.query.flag == 'submit';
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
					businessTypeDesc: info.businessTypeDesc,
					goodsTransferWay: 'CONTRACT_DETAILS'
				});
			});
			const list = info.purchaseList || [];
			/** 钢材种类为：线材/建材/型材/管材/钢坯，件数由业务员人工输入
			 */
			// isDisabledQuantity 判断本次货转数量可否修改
			list.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
				el.tip = `${el.materialName},${el.specs},${el.materialTexture}`;
			});
			//  货待开具货权数据
			this.toBeIssuedList = list;
			this.$nextTick(() => {
				this.$refs.transferBill && this.$refs.transferBill.init([], [], list);
			});
		},
		// 获取货转详情
		async getEditDetail() {
			const res = await API_SteelsGoodstransferDetail({ id: this.$route.query.goodsTransferId, isDetail: 0 });
			const contractInfo = res.data.contract;
			this.contractInfo = res.data.contract;
			const { goodsTransfer } = res.data;
			this.steelType = contractInfo.steelType;
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
					goodsTransferWay: 'CONTRACT_DETAILS',
					warehouse: goodsTransfer.warehouse
				});
			});
			res.data.attachmentFileVO.forEach(el => {
				el.url = el.path;
				el.typeName = el.typeDesc;
			});
			this.fileInfos = res.data.attachmentFileVO || [];
			this.fileDataSource = res.data.attachmentFileVO || [];
			// /判断选中
			const purchaseLists = res.data.purchaseList || res.data.purchaseLists || [];
			const toBeIssuedList = res.data.toBeIssuedList || [];
			const receiveIds = [];
			//  如果是修改 剩余件数 和 剩余数量要 加上自己本身
			toBeIssuedList.forEach(el => {
				el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
				purchaseLists.forEach(el2 => {
					el2.mainId = `${el2.materialName}${el2.specs}${el2.placeOfOrigin}${el2.materialTexture}${el2.baleNo}`;
					el2.tip = `${el2.materialName},${el2.specs},${el2.materialTexture}`;
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
			this.toBeIssuedList = toBeIssuedList;
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$refs.transferBill && this.$refs.transferBill.init(receiveIds, purchaseLists, toBeIssuedList);
				});
			});
		},
		submitGoodsTransferApplyForm(type) {
			this.searchForm.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					let purchaseList = [];
					// 校验必填项 合同货转清单
					let selectData = this.$refs.transferBill.selectData;

					// 合同明细
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
					if (flag) {
						this.$message.error('请完成货转清单的必填项操作');
						return;
					}
					purchaseList = JSON.parse(JSON.stringify(selectData || '[]'));
					purchaseList.forEach(el => {
						el.currentPieceQuantity = el.currentPieceQuantity == '/' ? '' : el.currentPieceQuantity;
						el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
					});
					// 附件上传
					if (this.fileInfos.length) {
						this.fileInfos.forEach(el => {
							el.fileId = el.fileId ? el.fileId : el.id;
						});
					}

					let _this = this;

					const params = {
						contractId: _this.$route.query.contractId,
						acceptanceDate: values.acceptanceDate,
						issuedDate: values.issuedDate,
						purchaseList: purchaseList,
						attachList: _this.fileInfos,
						generateWay: _this.$route.query.generateWay,
						goodsTransferWay: values.goodsTransferWay
					};
					if (this.$route.query.goodsTransferId) {
						params.goodsTransferId = this.$route.query.goodsTransferId;
					}
					const obj = {};
					params.purchaseList.forEach((el, index) => {
						if (!obj[el.mainId]) {
							el.repeatIndex = index + 1;
							obj[el.mainId] = [el];
						} else {
							el.repeatIndex = index + 1;
							obj[el.mainId].push(el);
						}
					});
					let temp = {
						mainId: '',
						list: []
					};
					for (let key in obj) {
						if (obj[key].length > 1 && !temp.mainId) {
							temp = {
								mainId: key,
								list: obj[key]
							};
						}
					}
					if (temp.mainId) {
						const repeatIndexList = temp.list.map(el => el.repeatIndex);
						this.$message.error(`第${repeatIndexList.join(',')}行的品名，规格，材质，产地，捆包号重复请您核对`);
						return;
					}

					// 校验是否满足条件
					const res = await checkSupplementGoodsTransfer(params);
					let that = this;

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
				this.$router.push('/center/steels/goodsTransfer/goodsTransferIssueList');
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
		// 获取货转数量
		getTransferQuantity(total) {
			this.$nextTick(() => {
				this.searchForm.setFieldsValue({
					transferQuantity: total
				});
			});
		}
	},
	components: {
		CustomUpload,
		TransferBill
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
