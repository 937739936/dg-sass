<template>
	<div class="ladingDetail">
		<div class="goods-form-apply">
			<a-form-model layout="inline">
				<div class="title"><i class="title_icon"></i>合同信息</div>
				<a-row type="flex">
					<a-col
						:span="12"
						v-if="detailData.ladingAddContractVO.orderNo"
					>
						<a-form-model-item label="订单编号">
							<a @click="openOrder">{{ detailData.ladingAddContractVO.orderNo }}</a>
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="合同编号">
							{{ detailData.ladingAddContractVO.contractNo }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="卖方企业名称">
							{{ detailData.ladingAddContractVO.sellerName }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="买方企业名称">
							{{ detailData.ladingAddContractVO.buyerName }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="煤种">
							{{ detailData.ladingAddContractVO.coalTypeDesc }}
						</a-form-model-item>
					</a-col>

					<a-col :span="12">
						<a-form-model-item label="品名">
							{{ detailData.ladingAddContractVO.goodsName }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="合同数量（吨）">
							{{ detailData.ladingAddContractVO.contractQuantity }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="交（提）货地点">
							{{ detailData.ladingAddContractVO.deliveryPlace }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="运输方式">
							{{ detailData.ladingAddContractVO.transportModeDesc }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="交货方式">
							{{ detailData.ladingAddContractVO.deliveryModeDesc }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="交货期限">
							{{ detailData.ladingAddContractVO.startDate }}~{{ detailData.ladingAddContractVO.endDate }}
						</a-form-model-item>
					</a-col>
				</a-row>
				<template v-if="detailData.ladingVOList && detailData.ladingVOList.length">
					<div class="title"><i class="title_icon"></i>关联提货单</div>
					<a-table
						:columns="tiColumns"
						:rowKey="record => record.id"
						:dataSource="detailData.ladingVOList.filter(r => r.selected == 1)"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<div class="title"><i class="title_icon"></i>提货信息</div>
				<a-row type="flex">
					<a-col :span="12">
						<a-form-model-item label="开具方式">
							{{ detailData.openTypeDesc }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="是否需运输">
							{{ detailData.requireTrans ? '是' : '否' }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货时间"> {{ detailData.beginDate }}~{{ detailData.endDate }} </a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货数量（吨）">
							{{ detailData.quantity }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货地点">
							{{ detailData.place }}
						</a-form-model-item>
					</a-col>

					<a-col :span="12">
						<a-form-model-item label="提货单开具时间">
							{{ detailData.openDate }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货联系人姓名">
							{{ detailData.contactName }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货人联系方式">
							{{ detailData.contactMode }}
						</a-form-model-item>
					</a-col>
					<a-col :span="12">
						<a-form-model-item label="提货联系人身份证">
							{{ detailData.idNo }}
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						v-if="detailData.transTypeDesc"
					>
						<a-form-model-item label="提货工具">
							{{ detailData.transTypeDesc }}
						</a-form-model-item>
					</a-col>
				</a-row>
				<template v-if="detailData.ladingTransInfoList && detailData.ladingTransInfoList.length">
					<div class="title"><i class="title_icon"></i>运输信息</div>
					<a-table
						:columns="columns"
						:rowKey="record => record.id"
						:dataSource="detailData.ladingTransInfoList || []"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</template>
				<template>
					<div class="title"><i class="title_icon"></i>提货单附件</div>
					<a-table
						:columns="fileColumns"
						:rowKey="record => record.id"
						:dataSource="(detailData.attachVOList || []).filter(r => r.delFlag == 0 || r.delFlag == null)"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="action"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="openPdf(record)"
								>查看</a
							>
						</div>
					</a-table>
				</template>
				<template>
					<div class="title"><i class="title_icon"></i>操作记录</div>
					<a-table
						:columns="handleColumns"
						:rowKey="record => record.id"
						:dataSource="detailData.ladingOperationList || []"
						:pagination="false"
						:scroll="{ x: true }"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
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
import { API_getLadingBillDataById, API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/lading';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import { mapMutations } from 'vuex';
export default {
	name: 'LadingDetail',
	components: {},
	data() {
		return {
			detailData: { ladingAddContractVO: {} },
			handleColumns: [
				{
					title: '操作类型',
					dataIndex: 'operateType',
					key: 'operateType'
				},

				{
					title: '操作内容',
					dataIndex: 'comments',
					key: 'comments'
				},
				{
					title: '操作人',
					dataIndex: 'operateName',
					key: 'operateName'
				},
				{
					title: '所属公司',
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{
					title: '操作时间',
					dataIndex: 'operateTime',
					key: 'operateTime'
				}
			],
			SHIPColumns: [
				{
					title: '船舶名称',
					dataIndex: 'shipName'
				},
				{
					title: '船舶MMSI',
					dataIndex: 'shipNo'
				}
			],
			TRAINColumns: [
				{
					title: '发站',
					dataIndex: 'deliveryStation'
				},
				{
					title: '到站',
					dataIndex: 'arriveStation'
				},
				{
					title: '收货人',
					dataIndex: 'receiverName'
				},
				{
					title: '托运人',
					dataIndex: 'shipperName'
				}
			],
			AUTOMOBILEColumns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
				}
			],
			AUTOMOBILE_AND_TRAINColumns: [
				{
					title: '车牌号',
					dataIndex: 'plateNumber'
				},
				{
					title: '发站',
					dataIndex: 'deliveryStation'
				},
				{
					title: '到站',
					dataIndex: 'arriveStation'
				},
				{
					title: '收货人',
					dataIndex: 'receiverName'
				},
				{
					title: '托运人',
					dataIndex: 'shipperName'
				}
			],
			tiColumns: [
				{
					title: '提货单编号',
					dataIndex: 'ladingNo',
					fixed: 'left'
				},
				{
					title: '创建时间',
					dataIndex: 'createDate'
				},
				{
					title: '运输方式',
					dataIndex: 'transTypeDesc'
				},
				{
					title: '提货时间',
					dataIndex: 'endDate',
					customRender: (v, r) => r.beginDate + '~' + r.endDate
				},
				{
					title: '提货数量',
					dataIndex: 'quantity'
				},
				{
					title: '卖方企业名称',
					dataIndex: 'sellerName'
				},
				{
					title: '买方企业名称',
					dataIndex: 'buyerName'
				}
			],
			fileColumns: [
				{
					title: '类型',
					dataIndex: 'typeDesc'
				},
				{
					title: '文件名',
					dataIndex: 'fileName'
				},
				{
					title: '操作',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			],
			columns: []
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		openPdf(v) {
			window.open(v.fileUrl, '_blank');
		},
		openOrder() {
			let routerData = this.$router.resolve({
				path: '/center/contract/' + this.detailData.ladingAddContractVO.orderType.toLowerCase() + '/online/detail',
				query: {
					id: this.detailData.ladingAddContractVO.orderId,
					type: this.detailData.ladingAddContractVO.orderType
				}
			});
			window.open(routerData.href, '_blank');
		},
		download() {
			let v = this.pdfPath;
			API_DOWNLPREVIEWTE(v).then(res => {
				comDownload(res, v, null);
			});
		},
		getDetail() {
			API_getLadingBillDataById({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.result || {};
					if (this.detailData.transType) {
						this.columns = this[this.detailData.transType + 'Columns'];
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ladingDetail {
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
			//   display: none;
		}
	}

	::v-deep .ant-row {
		margin-bottom: 14px;
		padding-left: 40px;
	}

	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: #666;
			margin-right: 46px;
			display: inline-block;
			text-align: right;
			width: 140px;
		}
	}
	::v-deep .ant-form-item-control-wrapper {
		font-size: 14px;
	}

	::v-deep .ant-form-item-control {
		input {
			width: 240px;
		}
	}
}
</style>
