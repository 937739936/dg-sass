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
					<template v-if="handleType == 1">
						<a-col :span="12">
							<a-form-model-item
								label="运输方式"
								:colon="false"
							>
								<a-input
									:disabled="true"
									v-model="goodsTransferForm.transportMode"
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
					</template>
					<template v-else>
						<a-col :span="12">
							<a-form-model-item
								label="卖方名称"
								:colon="false"
							>
								<a-input
									:disabled="true"
									v-model="goodsTransferForm.sellCompanyName"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item
								label="货转开具日期"
								:colon="false"
							>
								<a-input
									:disabled="true"
									v-model="goodsTransferForm.issuedDate"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item
								label="验收日期"
								:colon="false"
							>
								<a-input
									:disabled="true"
									v-model="goodsTransferForm.acceptanceDate"
								/>
							</a-form-model-item>
						</a-col>
					</template>
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
							label="合同期限"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.goodsTransferTime"
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
					<a-col
						:span="12"
						v-if="[2, 5, 4].includes(handleType)"
					>
						<a-form-model-item
							label="本次货转数量"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.transferQuantity"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						v-if="goodsTransferForm.warehouse"
					>
						<a-form-model-item
							label="仓库"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.warehouse"
							/>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						v-if="goodsTransferForm.goodsTransferWayDesc"
					>
						<a-form-model-item
							label="货转方式"
							:colon="false"
						>
							<a-input
								:disabled="true"
								v-model="goodsTransferForm.goodsTransferWayDesc"
							/>
						</a-form-model-item>
					</a-col>
				</a-row>

				<template v-if="handleType == 1">
					<div class="title"><i class="title_icon"></i>收发货信息</div>
					<a-table
						:columns="goodsTransferColumns"
						:rowKey="record => record.id"
						:dataSource="goodsTransferData"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<template v-if="[3, 5, 6].includes(handleType)">
					<div class="title"><i class="title_icon"></i>待开具货转清单</div>
					<a-table
						:columns="
							[5].includes(handleType)
								? warehousesColumns4
								: detailInfo.contract.appointSpec == 1
									? warehousesColumns
									: noWarehousesColumns
						"
						:rowKey="record => record.id"
						:dataSource="detailInfo.toBeIssuedList"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<template v-if="[3, 5, 6].includes(handleType)">
					<div
						v-if="goodsTransferForm.goodsTransferWay != 'MANUAL_PICK'"
						class="title"
					>
						<i class="title_icon"></i>本次货转清单
					</div>
					<a-table
						v-if="goodsTransferForm.goodsTransferWay != 'MANUAL_PICK'"
						:columns="warehousesColumns2"
						:rowKey="record => record.id"
						:dataSource="warehousesData"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<!-- 手工挑选本次货转清单 -->
				<template v-if="goodsTransferForm.goodsTransferWay == 'MANUAL_PICK'">
					<div class="title"><i class="title_icon"></i>本次货转清单</div>
					<a-table
						:columns="warehousesColumns3"
						:rowKey="record => record.storageDetailId"
						:dataSource="warehousesData"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>

				<template>
					<div class="title"><i class="title_icon"></i>{{ handleType == 1 ? '货转证明' : '货权证明' }}</div>
					<div class="upload-wrap-detail">
						<div class="upload-block">
							<CustomUpload1
								:isNeedRotate="true"
								:ifEditable="false"
								:fileDataSource="fileDataSource"
								:type="[3]"
								:hasDownload="true"
							/>
						</div>
					</div>
				</template>
				<template>
					<div class="title"><i class="title_icon"></i>操作历史</div>
					<Log :logList="detailInfo.transferLog"></Log>
				</template>
				<template v-if="goodsTransferForm.status == 'CANCEL'">
					<div class="title"><i class="title_icon"></i>作废原因</div>
					<a-row
						:gutter="24"
						style="padding-bottom: 8px"
					>
						<a-col :span="12">
							<a-form-model-item class="labelClass">
								<a-textarea
									v-model="goodsTransferForm.cancelReason"
									disabled
									class="labelClass"
									style="width: 929px"
								/>
							</a-form-model-item>
						</a-col>
					</a-row>
				</template>
			</a-form-model>
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
import { API_SteelsGoodstransferDetail } from '@/v2/center/steels/api/goodsTransfer.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import CustomUpload1 from '@/v2/center/steels/components/upload/CustomUpload1.vue';
import Log from '@/v2/center/steels/components/Log.vue';
export default {
	name: 'goodsTransferApplyDetail',
	components: {
		CustomUpload1,
		Log
	},
	data() {
		return {
			goodsTransferForm: {
				receiveData: {}
			},
			goodsTransferColumns: [
				{
					title: '批次号',
					dataIndex: 'shipmentNo'
				},
				{
					title: '收货编号',
					dataIndex: 'receiptNo'
				},
				// {
				//   title: '钢材种类',
				//   dataIndex: 'steelType'
				// },
				{
					title: '收货日期',
					dataIndex: 'receiptDate'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiptQuantity'
				}
			],
			warehousesColumns: [
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
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
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},

				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '合同件数',
					dataIndex: 'pieceQuantity'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '合同数量（吨）',
					dataIndex: 'quantity'
				},
				{
					title: '剩余件数',
					dataIndex: 'surplusPieceQuantity'
				},
				{
					title: '剩余数量(吨)',
					dataIndex: 'surplusQuantity'
				},
				{
					title: '计量方式',
					dataIndex: 'metrologyWay'
				}
			],
			noWarehousesColumns: [
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
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
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},

				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '合同件数',
					dataIndex: 'pieceQuantity'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '合同数量（吨）',
					dataIndex: 'quantity'
				},
				{
					title: '计量方式',
					dataIndex: 'metrologyWay'
				}
			],
			// 榆神
			warehousesColumns4: [
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
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
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},

				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '合同件数',
					dataIndex: 'pieceQuantity'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '合同数量（吨）',
					dataIndex: 'quantity'
				},
				{
					title: '计量方式',
					dataIndex: 'metrologyWay'
				}
			],
			warehousesColumns2: [
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
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
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},

				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '本次货转件数',
					dataIndex: 'currentPieceQuantity'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '本次货转数量',
					dataIndex: 'currentQuantity'
				},
				{
					title: '计量方式',
					dataIndex: 'metrologyWay'
				}
			],
			warehousesColumns3: [
				{
					title: '入库单号',
					dataIndex: 'notifyNo'
				},
				{
					title: '运单号',
					dataIndex: 'transportNo'
				},
				{
					title: '车牌号',
					dataIndex: 'licensePlate'
				},
				{
					title: '品名',
					dataIndex: 'materialName'
				},
				{
					title: '规格',
					dataIndex: 'specs'
				},
				{
					title: '材质',
					dataIndex: 'materialTexture'
				},
				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '件数（件）',
					dataIndex: 'currentPieceQuantity'
				},
				{
					title: '数量（吨）',
					dataIndex: 'currentQuantity'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '入库时间',
					dataIndex: 'operationDate',
					fixed: 'right'
				}
			],
			handleColumns: [
				{
					title: '货转编号',
					dataIndex: 'transferNo',
					key: 'transferNo'
				},
				{
					title: '操作',
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
					dataIndex: 'lastModifiedDate',
					key: 'lastModifiedDate'
				},
				{
					title: '操作内容',
					dataIndex: 'content',
					key: 'content'
				}
			],

			warehousesData: [],
			goodsTransferData: [], //货转数据
			fileDataSource: [],
			detailInfo: {
				contract: {},
				goodsTransfer: {}
			}
		};
	},
	computed: {
		// 判断业务类型
		handleType() {
			if (
				this.detailInfo.contract.steelType == 'SCRAP_STEEL' ||
				['RECEIVABLE_STEEL_BUY_002'].includes(this.$route.query.contractTemplate)
			) {
				return 1;
			}
			if (
				['SOURCING_AGENT', 'SOURCING_AGENT_OTHER', 'SOURCING_AGENT_WAREHOUSE_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE_OTHER'].includes(
					this.detailInfo.contract.businessType
				) &&
				this.detailInfo.contract.generateWay == 'ARTIFICIAL_COLLECTION'
			) {
				return 6;
			}
			//  代采+ 仓押
			if (
				['SOURCING_AGENT', 'SOURCING_AGENT_OTHER', 'SOURCING_AGENT_WAREHOUSE_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE_OTHER'].includes(
					this.detailInfo.contract.businessType
				)
			) {
				return 4;
			}
			// 榆神
			if (['ACCOUNT_RECEIVABLE_OTHER'].includes(this.detailInfo.contract.businessType)) {
				return 5;
			}
			// 仓押
			return 3;
		}
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			API_SteelsGoodstransferDetail({ id: this.$route.query.id, isDetail: 1 }).then(res => {
				if (res.success) {
					this.detailInfo = res.data;
					this.fileDataSource = res.data.attachmentFileVO;
					this.fileDataSource.map(i => {
						i.url = i.path;
						i.typeName = i.typeDesc;
					});
					this.goodsTransferForm = { ...res.data.contract, ...res.data.goodsTransfer } || {};
					this.warehousesData = res.data.purchaseLists || res.data.purchaseList || [];
					this.goodsTransferForm.status = res.data.goodsTransfer.status;
					this.goodsTransferForm.cancelReason = res.data.goodsTransfer.cancelReason;
					this.goodsTransferForm.goodsTransferTime = `${this.goodsTransferForm.effectiveStartDate}-${this.goodsTransferForm.effectiveEndDate}`;
					this.goodsTransferData = res.data.receiveList;
					this.goodsTransferForm.steelType = filterCodeByValueName(this.goodsTransferForm.steelType, 'steelType');
					this.goodsTransferForm.transportMode = filterCodeByValueName(this.goodsTransferForm.transportMode, 'transportMode');
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
