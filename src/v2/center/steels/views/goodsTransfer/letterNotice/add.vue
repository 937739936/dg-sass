<template>
	<div id="goodsTransferApplyBuyer">
		<div class="steps-wrap">
			<a-steps :current="1">
				<a-step title="选择销售合同" />
				<a-step title="填写货物信息" />
				<a-step title="完成" />
			</a-steps>
		</div>
		<div class="goods-form-apply">
			<a-form
				ref="goodsTransferForm"
				:form="applyForm"
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
								v-model="info.contractNo"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="买方名称"
							:colon="false"
						>
							<a-input
								disabled
								v-model="info.buyCompanyName"
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
								v-model="info.steelTypeDesc"
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
								v-model="info.businessTypeDesc"
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
								v-model="info.effectiveStartDate"
								placeholder=""
							></a-input>
						</a-form-item>
					</a-col>

					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="货权所属企业">
							<a-select
								show-search
								:filter-option="filterOption"
								:disabled="$route.query.type == 'edit'"
								@select="selectCompany"
								v-decorator="[
									'powerCompanyId',
									{
										rules: [{ required: true, message: `货权所属企业必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in companyList"
									:key="index"
									:value="items.value"
								>
									{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="仓库方">
							<a-select
								:disabled="$route.query.type == 'edit'"
								v-decorator="[
									'warehouseParty',
									{
										rules: [{ required: true, message: `仓库方必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in warehouseList"
									:key="index"
									:value="items.value"
								>
									{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<PurchaseList
				:goodsTransferData="info.purchaseList"
				@send="getSelectData"
				:uploadIds="purchaseId"
			/>
			<PurchaseDetailsOtherPurchaseList
				v-if="info.businessType === 'OTHER_MIDDLE'"
				ref="purchaseDetailsOther"
				type="sell"
				typeMode="letterNotice"
				:steelType="[info.steelType]"
				:appointSpec="info.appointSpec"
				:selectedData="selectedDataList"
				:editable="true"
				:purchaseList="info.purchaseList"
				:contractId="$route.query.contractId"
				@upload="getUploadData"
			/>
			<div v-else>
				<!-- <GoodsDetailsList /> -->
				<PurchaseGoods
					ref="purchaseDetails"
					type="sell"
					contractTemplate="FINISHED_STEEL_SELL_002"
					:steelType="[info.steelType]"
					:appointSpec="info.appointSpec"
					:editable="true"
					:contractId="$route.query.contractId"
					:selectedData="selectedDataList"
				></PurchaseGoods>
			</div>
			<div class="btn-wrap">
				<a-button
					@click="submit('preview')"
					style="width: 140px"
					>预览放货通知单</a-button
				>
				<a-button @click="prevContract">返回</a-button>
				<a-button
					type="primary"
					@click="submit('save')"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="submit('submit')"
					>提交</a-button
				>
			</div>
			<a-modal
				title="放货通知单"
				:visible="pdfPath ? true : false"
				width="700px"
				@cancel="pdfPath = false"
				class="modal-pdf"
			>
				<template slot="footer">
					<a-button
						key="down"
						@click="download"
						style="margin: 0 10px"
						type="primary"
						>下载</a-button
					>
					<a-button
						key="back"
						@click="pdfPath = false"
						style="margin: 0 10px"
						>关闭</a-button
					>
				</template>
				<pdf-preview
					v-if="pdfPath"
					:url="pdfPath"
					type="base64"
				></pdf-preview>
			</a-modal>
		</div>
		<PreviewNotice ref="previewNotice"></PreviewNotice>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import PurchaseGoods from '@/v2/center/steels/components/PurchaseGoods.vue';
import PreviewNotice from '../components/PreviewNotice.vue';
import { specialSteelTypeArr } from '@/v2/center/steels/config/constant.js';
import { down } from '@/v2/utils/factory.js';
import {
	getSupplementContractInfo,
	API_SteelswarehouseContractRelease,
	API_SteelsGoodstransferReleasePrevDetail,
	API_SteelsGoodstransferReleaseSaveDetail,
	API_SteelsGoodstransferReleaseDetail,
	API_SteelsGoodstransferReleaseSubmitDetail,
	API_SteelsGoodstransferReleaseSubmitCheckDetail
} from '@/v2/center/steels/api/goodsTransfer.js';
import { API_FinancingsellerList, API_DOWNLPREVIEWTE } from '@/v2/api';
import PurchaseDetailsOtherPurchaseList from '@/v2/center/steels/components/PurchaseDetailsOtherPurchaseList.vue';
import GoodsDetailsList from '../components/GoodsDetailsList.vue';
import PurchaseList from '../components/purchaseList.vue';
import { cloneDeep } from 'lodash';

export default {
	name: '',

	data() {
		return {
			applyForm: this.$form.createForm(this),
			companyList: [],
			warehouseList: [],
			fileDataSource: [],
			numberReg: /^(\d+)(\.\d{1,3})?$/,
			editable: false,
			info: {},
			contractInfo: {},
			saveDisabled: false,
			purchaseDetailsData: [],
			pdfPath: false,
			selectedDataList: [],
			purchaseId: []
		};
	},
	computed: {},
	mounted() {
		this.getContractDetail();
		API_FinancingsellerList().then(res => {
			this.companyList = (res.data || []).map(r => {
				return {
					text: r.name,
					value: r.id
				};
			});
		});
	},
	methods: {
		getUploadData(list) {
			this.selectedDataList = list;
		},
		getSelectData(list, flag = true) {
			let listTemp = cloneDeep(list);
			listTemp.forEach((item, index) => {
				item.id = index;
			});
			if (this.info.appointSpec == 0) {
				listTemp.forEach(item => {
					item.materialNameOld = item.materialName;
					if (flag) {
						item.materialName = [];
						item.materialTexture = '';
						item.specs = '';
					}
				});
			}
			this.selectedDataList = listTemp;
		},
		download() {
			let v = this.pdfPath;
			down(`data:application/pdf;base64,${this.pdfPath}`, `放货通知单.pdf`);
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		selectCompany(v) {
			var companyName = this.companyList.find(r => {
				return r.value == v;
			}).text;
			API_SteelswarehouseContractRelease({ companyName: companyName }).then(res => {
				this.warehouseList = (res.data.length ? res.data : []).map(r => {
					return {
						text: r,
						value: r
					};
				});
			});
		},
		prevContract() {
			this.$router.go(-1);
		},
		// 获取合同详情
		async getContractDetail() {
			const params = {
				generateWay: this.$route.query.generateWay,
				contractId: this.$route.query.contractId
			};
			const res = await getSupplementContractInfo(params);
			this.info = res.data;
			this.info.effectiveStartDate = this.info.effectiveStartDate + '~' + this.info.effectiveEndDate;

			if (this.$route.query.type == 'edit') {
				API_SteelsGoodstransferReleaseDetail({ id: this.$route.query.id }).then(res => {
					if (res.success) {
						let arr = res.data.transferReleaseGoodsList || [];
						this.purchaseId = res.data.purchaseId;
						arr.forEach(el => {
							el.calendar = [el.materialName, el.materialTexture, el.specs];
							if (this.info.steelType !== 'SCRAP_STEEL' && this.info.appointSpec == 0) {
								el.calendar = [el.materialName, el.materialTexture];
							}
							el.isBaleNoDisabled = false;
							if (specialSteelTypeArr.includes(el.materialName) && this.info.steelType == 'FINISHED_STEEL') {
								el.isBaleNoDisabled = true;
							}
							el.theoreticalWeight = el.theoreticalWeight || '/';
							el.pieceQuantity = el.pieceQuantity || '/';
						});

						this.purchaseDetailsData = arr;
						this.selectedDataList = arr;
						this.applyForm.setFieldsValue({
							powerCompanyId: res.data.powerCompanyId,
							warehouseParty: res.data.warehouseParty
						});
						this.$nextTick(() => {
							this.getSelectData(arr, false);
						});
					}
				});
			}
		},
		// 保存
		submit(type) {
			this.applyForm.validateFieldsAndScroll((err, values) => {
				if (err) return;
				if (this.$refs.purchaseDetails && !this.$refs.purchaseDetails.save()) {
					return;
				}

				let warehouseArr = [];
				if (this.$refs.purchaseDetails) {
					warehouseArr = JSON.parse(JSON.stringify(this.$refs.purchaseDetails.save() || '[]'));
				}
				if (this.$refs.purchaseDetailsOther) {
					if (!this.selectedDataList.length) {
						this.$message.warn('放货清单不能为空');
						return;
					}
					if (!this.$refs.purchaseDetailsOther.save()) {
						return;
					}
					warehouseArr = JSON.parse(JSON.stringify(this.$refs.purchaseDetailsOther.save() || '[]'));
				}
				warehouseArr.forEach(el => {
					el.pieceQuantity = el.pieceQuantity == '/' ? '' : el.pieceQuantity;
					el.theoreticalWeight = el.theoreticalWeight == '/' ? '' : el.theoreticalWeight;
				});
				let o = {
					id: this.$route.query.id || null,
					contractId: this.$route.query.contractId,
					goods: warehouseArr,
					powerCompanyId: values.powerCompanyId,
					powerCompanyName: this.companyList.find(r => r.value == values.powerCompanyId).text,
					warehouseParty: values.warehouseParty,
					purchaseId: this.selectedDataList.map(item => item.purchaseId)
				};
				if (type == 'preview') {
					API_SteelsGoodstransferReleasePrevDetail(o).then(res => {
						this.pdfPath = res.data;
					});
				}
				if (type == 'save') {
					API_SteelsGoodstransferReleaseSaveDetail(o).then(res => {
						if (res.success) {
							this.$message.success('保存成功');
							this.$router.push({
								path: `/center/steels/goodsTransfer/letterNotice/list`
							});
						}
					});
				}
				if (type == 'submit') {
					API_SteelsGoodstransferReleaseSubmitCheckDetail({ contractId: o.contractId }).then(r => {
						if (r.error && r.error.message) {
							this.$confirm({
								centered: true,
								title: r.error.message,
								okText: '去关联',
								cancelText: '取消',
								onOk: () => {
									this.$router.push({
										path: `/center/steels/relation/create`
									});
								},
								onCancel() {}
							});
						} else {
							this.$confirm({
								centered: true,
								title: '您确认信息无误并提交?',
								okText: '确定',
								cancelText: '取消',
								onOk: () => {
									API_SteelsGoodstransferReleaseSubmitDetail(o).then(res => {
										if (res.success) {
											this.$message.success('提交成功');
											this.$router.push({
												path: `/center/steels/goodsTransfer/letterNotice/list`
											});
										}
									});
								},
								onCancel() {}
							});
						}
					});
				}
			});
		}
	},
	components: {
		PurchaseGoods,
		PreviewNotice,
		PdfPreview,
		PurchaseDetailsOtherPurchaseList,
		GoodsDetailsList,
		PurchaseList
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
