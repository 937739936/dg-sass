<template>
	<div class="goodsTransferApplyDetail">
		<div class="goods-form-apply">
			<a-form-model
				:model="goodsTransferForm"
				layout="inline"
			>
				<div class="title"><i class="title_icon"></i>基本信息</div>
				<a-row type="flex">
					<a-col :span="12">
						<a-form-model-item
							label="合同编号"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.contractNo"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="买方名称"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.buyCompanyName"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="钢材种类"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.steelTypeDesc"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="业务类型"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.businessTypeDesc"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="合同期限"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.effectiveStartDate"
							/>
						</a-form-model-item>
					</a-col>

					<a-col :span="12">
						<a-form-model-item
							label="货权所属企业"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.powerCompanyName"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="仓库方"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.warehouseParty"
							/>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item
							label="放货通知单号"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.releaseNo"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>
				<template v-if="contractInfo.businessType === 'OTHER_MIDDLE'">
					<PurchaseList
						:goodsTransferData="contractInfo.purchaseList"
						:uploadIds="purchaseId"
						:editable="false"
						class="purchase-list-detail"
					/>
					<PurchaseDetailsOtherPurchaseList
						type="sell"
						typeMode="letterNotice"
						:steelType="[contractInfo.steelType]"
						:appointSpec="contractInfo.appointSpec"
						:selectedData="detailInfo.transferReleaseGoodsList"
						:editable="false"
						:purchaseList="contractInfo.purchaseList"
					/>
				</template>
				<template v-else>
					<div class="title"><i class="title_icon"></i>货物信息</div>
					<a-table
						:columns="columns"
						:rowKey="record => record.id"
						:dataSource="detailInfo.transferReleaseGoodsList || []"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<template>
					<div class="title"><i class="title_icon"></i>附件</div>
					<a-row
						type="flex"
						justify="start"
						:gutter="24"
					>
						<a-col>
							<img
								v-if="(detailInfo.pdfPath || '').indexOf('.pdf') === -1"
								:src="detailInfo.pdfPath"
								v-viewer
							/>
							<img
								style="width: 130px; cursor: pointer"
								v-else
								src="~imgs/pdf.png"
								@click="openPdf(detailInfo.pdfPath)"
							/>
							<p style="text-align: center; margin-top: 8px">{{ '放货通知单' }}</p>
						</a-col>
					</a-row>
				</template>
				<template>
					<div class="title"><i class="title_icon"></i>操作历史</div>
					<Log :logList="detailInfo.transferReleaseLogList"></Log>
				</template>
			</a-form-model>
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
				></pdf-preview>
			</a-modal>

			<div
				class="btn-wrap"
				v-if="!$route.query.hideBack"
			>
				<a-button @click="$router.go(-1)">返回</a-button>
			</div>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import Log from '@/v2/center/steels/components/Log.vue';
import { API_SteelsGoodstransferReleaseDetail, getSupplementContractInfo } from '@/v2/center/steels/api/goodsTransfer.js';
import { API_GETLOGINBYMOBILE } from '@/v2/center/steels/api/contract.js';
import { API_DOWNLPREVIEWTE } from '@/v2/api';
import comDownload from '@sub/utils/comDownload.js';
import { mapMutations } from 'vuex';
import PurchaseDetailsOtherPurchaseList from '@/v2/center/steels/components/PurchaseDetailsOtherPurchaseList.vue';
import PurchaseList from '../components/purchaseList.vue';
import { cloneDeep } from 'lodash';

export default {
	name: 'goodsTransferApplyDetail',
	components: {
		PdfPreview,
		Log,
		PurchaseDetailsOtherPurchaseList,
		PurchaseList
	},
	data() {
		return {
			pdfPath: null,
			goodsTransferForm: {
				receiveData: {}
			},
			handleColumns: [
				{
					title: '操作类型',
					dataIndex: 'pointName',
					key: 'pointName'
				},

				{
					title: '操作人',
					dataIndex: 'createdName',
					key: 'createdName'
				},
				{
					title: '操作时间',
					dataIndex: 'createdDate',
					key: 'createdDate'
				},
				{
					title: '操作内容',
					dataIndex: 'content',
					key: 'content'
				},
				{
					title: '备注',
					dataIndex: 'remark',
					key: 'remark'
				}
			],
			columns: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '品名',
					dataIndex: 'materialName'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},
				{
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '数量（吨）',
					dataIndex: 'quantity'
				}
			],
			transferLog: [],
			detailInfo: {},
			contractInfo: {},
			selectedDataList: [],
			purchaseId: []
		};
	},
	mounted() {
		const { contractId, companyUserId } = this.$route.query;
		this.isOa = this.$route.name === 'OaLetterNoticeDetail';
		if (this.isOa) {
			API_GETLOGINBYMOBILE({
				contractId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				this.initData();
			});
			return;
		}
		this.initData();
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		getSelectData(list, flag = true) {
			let listTemp = cloneDeep(list);
			listTemp.forEach((item, index) => {
				item.id = index;
			});
			if (this.contractInfo.appointSpec == 0) {
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
		getContractDetails(id) {
			getSupplementContractInfo({
				contractId: id
			}).then(res => {
				if (res.success) {
					this.contractInfo = res.data;
				}
			});
		},
		openPdf(url) {
			this.pdfPath = url;
		},
		download() {
			let v = this.pdfPath;
			API_DOWNLPREVIEWTE(v).then(res => {
				comDownload(res, v, null);
			});
		},
		initData() {
			API_SteelsGoodstransferReleaseDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailInfo = res.data;
					this.goodsTransferForm = res.data || {};
					this.goodsTransferForm.effectiveStartDate =
						this.goodsTransferForm.effectiveStartDate + '~' + this.goodsTransferForm.effectiveEndDate;
					this.purchaseId = res.data.purchaseId;
					this.getContractDetails(res.data.contractId);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.goodsTransferApplyDetail {
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
	::v-deep .ant-row {
		margin-bottom: 14px;
		padding-left: 40px;
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}
	::v-deep .ant-form-item-control {
		input {
			width: 240px;
		}
	}
}
</style>
