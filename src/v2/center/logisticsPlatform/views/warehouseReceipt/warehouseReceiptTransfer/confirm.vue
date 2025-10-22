<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 70px"
		>
			<div
				class="methods-wrap"
				@click="save"
			>
				<span class="slTitle">电子仓单过户申请确认</span>
			</div>
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				基本信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="合同编号">
					<a
						@click="goContract"
						href="javascript:;"
						>{{ contractInfo.contractNo }}</a
					>
				</a-descriptions-item>
				<a-descriptions-item label="卖方企业">{{ contractInfo.sellerName }} </a-descriptions-item>
				<a-descriptions-item label="买方企业">
					<span>{{ contractInfo.buyerName }}</span>
				</a-descriptions-item>

				<a-descriptions-item label="品名">
					{{ contractInfo.goodsName }}
				</a-descriptions-item>
				<a-descriptions-item :label="contractInfo.contractType == 'OFFLINE' ? '合同价格' : '基准价格'">
					<span v-if="contractInfo.followTheMarket">随行就市</span>
						<span v-if="contractInfo.basePrice !== undefined && contractInfo.basePrice !== null  && !contractInfo.followTheMarket && !contractInfo.basePriceDesc">
							<i v-if="contractInfo.basePrice == '随行就市' || contractInfo.basePrice == 0 ">随行就市</i>
							<i v-else>{{contractInfo.basePrice | formatMoney(2)}} 元/吨</i>
						</span>
						<i v-if="contractInfo.basePriceDesc && !contractInfo.followTheMarket">{{contractInfo.basePriceDesc || '-'}}</i>
				</a-descriptions-item>
				<a-descriptions-item label="数量">
					<span
						>{{ contractInfo.quantity ? formatMoney(contractInfo.quantity) + '吨' : '-' }}
						<i v-if="contractInfo.quantityOffset">(±{{ contractInfo.quantityOffset }}%)</i>
					</span>
				</a-descriptions-item>
				<a-descriptions-item label="交货期限">{{ contractInfo.startDate }} 至 {{ contractInfo.endDate }}</a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ contractInfo.transportModeDesc }}</a-descriptions-item>
				<a-descriptions-item label="收货人">{{ contractInfo.consigneeCompanyName || '-' }}</a-descriptions-item>
			</a-descriptions>
			<template>
				<div
					class="slTitleAssis"
					style="margin-bottom: 20px"
				>
					转让信息
				</div>
				<a-descriptions
					bordered
					:column="3"
					size="middle"
				>
					<a-descriptions-item label="转让方">
						{{ detailData.transferorName }}
					</a-descriptions-item>
					<a-descriptions-item label="接收方">{{ detailData.receiverName }} </a-descriptions-item>
					<a-descriptions-item label="仓库名称">
						<span>{{ detailData.stationName }}</span>
					</a-descriptions-item>

					<a-descriptions-item label="货物名称">
						{{ detailData.goodsName }}
					</a-descriptions-item>
					<a-descriptions-item label="转让数量合计">
						<span style="color: #ff7937">{{ detailData.transferQuantity | formatMoney(4) }}</span>
						<span>吨</span>
					</a-descriptions-item>
				</a-descriptions>
			</template>
			<WarehouseInfo :list="detailData.transferInfoList" :isShowTip='false' :goodsColumns='goodsColumns' style="margin-bottom:20px"></WarehouseInfo>
			<ApplyInfo ref="applyInfo" :listApi="getWarehouseReceiptOpenContractList" @select="getSelectStorageContractInfo"></ApplyInfo>
			<div
				class="slTitleAssis"
				style="margin-top: 0"
			>
				附件
			</div>
			<AttachmentOpen
				ref="attachmentOpen"
				style="margin-top: 30px"
				:list="attachmentList"
			></AttachmentOpen>
		</a-card>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>确定要进行仓单过户确认吗？</p>
			</div>
		</TipModal>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="reason"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<div class="slDetailBottom">
			<div>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="goBack"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="visible = true"
						style="margin-right: 30px"
						>驳回</a-button
					>
					<a-button
						type="primary"
						class="btn"
						@click="confirm"
						>确认</a-button
					>
				</a-space>
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import OpenContractInfo from '../components/OpenContractInfo.vue';
import ApplyInfo from '../components/applyInfo.vue';
import AttachmentOpen from '../components/AttachmentOpen.vue';
import TipModal from '@sub/components/DelModal.vue';
import { formatMoney } from '@sub/filters';
import { API_FinancingDetail } from '@/v2/center/financing/api/index.js';
import {
	getWarehouseReceiptTransferDetail,
	downloadWarehouseReceiptTransfer,
	handleWarehouseReceiptTransfer,
	getWarehouseReceiptOpenContractList,
	confirmWarehouseReceiptTransfer,
	getLatestWarehouseContract
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';

import WarehouseInfo from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/WarehouseInfo.vue'
const goodsColumns = [
	{
		title: '过户子仓单编号',
		dataIndex: 'transferChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'transferChildWarehouseReceiptNo' }, fixed: 'left'
	},
	{ title: '原仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' }, },
	{ title: '转让方', dataIndex: 'transferorName' },
	{ title: '接收方', dataIndex: 'receiverName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{
		title: '仓房-货位',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	},
	{ title: '过户数量(吨)', dataIndex: 'transferQuantity', customRender: t => formatMoney(t) },
	{ title: '仓单状态', dataIndex: 'transferChildStatusDesc', scopedSlots: { customRender: 'transferChildStatusDesc' }, },
];
export default {
	data() {
		return {
			detailData: {},
			goodsColumns,
			list: [],
			visible: false,
			reason: '',
			attachmentList: [
				{
					key: 'MANAGE_AGREEMENT',
					label: '电子仓单管理协议',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					tip: '说明：可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件。',
					required: true,
          isShowBtn: false,
				},
        {
					key: 'OFFLINE_CONTRACT',
					label: '仓储合同',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
          isShowBtn: false,
          required: true,
				},
        {
					key: 'INSURANCE_POLICY',
					label: '保险单',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
          isShowBtn: true,
				},
        {
					key: 'OTHER',
					label: '其他材料',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
          isShowBtn: true,
				}
			],
			currentParams: {},
			selectStorageContractInfo: {},
			type: 'rest'
			
		};
	},
	computed: {
		// 合同信息
		contractInfo() {
			return this.detailData.contractInfo || {};
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
	},
	mounted() {
		this.getDetail();
		this.getLatestWarehouseContract()
	},
	methods: {
		formatMoney,
		getWarehouseReceiptOpenContractList,
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/list')
		},
		async getDetail() {
			const params = {
				id: this.$route.query.id,
				financingApplyId: this.$route.query.id
			};
			const res = await getWarehouseReceiptTransferDetail(params);
			this.detailData = res.data || {};
		},
		getSelectStorageContractInfo(info) {
			this.selectStorageContractInfo = info;
			  const warehouseContractAttachmentList = info.warehouseContractAttachmentList || []
			  const warehouseReceiptAttachmentList = info.warehouseReceiptAttachmentList || []

				warehouseReceiptAttachmentList.forEach(el => {
					el.type = 'MANAGE_AGREEMENT'
					el.key = 'MANAGE_AGREEMENT',
					el.isShowBtn = false
				})
				warehouseContractAttachmentList.forEach(el => {
					el.type = 'OFFLINE_CONTRACT'
					el.key = 'OFFLINE_CONTRACT'
					el.isShowBtn = false

				})

				const list = [
				...warehouseReceiptAttachmentList,
				...warehouseContractAttachmentList

				]
				this.$refs.attachmentOpen.init(list)
		},
		// 去往合同
		goContract() {
			// 判断当前合同信息 是采购还是销售
			
			let contractType = this.VUEX_ST_COMPANYSUER.companyUscc == this.contractInfo.buyerUscc ? 'buy' : 'sell';

			let path = `/center/contract/${contractType}/online/detail?id=${this.contractInfo.orderContractId}&type=${contractType.toUpperCase()}`;
			if (this.type == 'rest') {
				if (this.contractInfo.contractType == 'OFFLINE') {
					path = `/center/contract/${contractType}/offline/detail?id=${this.contractInfo.orderContractId}&type=${contractType}`;
				}
			} else {
				path = `/sys/contract/online/detail?id=${this.contractInfo.orderContractId}`;
				if (this.contractInfo.contractType == 'OFFLINE') {
					path = `/sys/contract/offline/detail?id=${this.contractInfo.orderContractId}&contractNo=${this.contractInfo.orderNo}`;
				}
			}

			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		},
		async save() {

			const info = await this.$refs.applyInfo.save()
			if(!info) return
			let params = {
				...info,
				id: this.$route.query.id,
			}
			const list = this.$refs.attachmentOpen.save()
			if(!list) return
			this.currentParams = params

		},
		goContractDetail() {},
		async confirmSubmit() {


			await confirmWarehouseReceiptTransfer(this.currentParams)
			this.$refs.submitModal.close();
			this.$message.success('确认成功')
			this.goBack()
			// if (!this.isSignAuth) {
			// 	this.$refs.signModal.open();
			// } else {
			// 	this.$refs.signNeedModal.open();
			// }
		},
		async confirm() {
			const info = await this.$refs.applyInfo.save()
			if(!info) return
			let params = {
				...info,
				id: this.$route.query.id,
			}
			const list = this.$refs.attachmentOpen.save()
			if(!list) return
       let warehouseReceiptAttachmentList = list.filter(el => ['OTHER', 'INSURANCE_POLICY'].includes(el.type) ).map(el => {
					return {
						...el,
						attachmentType: el.type,
					}
				})
				params.warehouseReceiptAttachmentList = warehouseReceiptAttachmentList

			this.currentParams = params


			this.$refs.submitModal.open();
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			const params = {
				remark: this.reason,
				id: this.$route.query.id,
				operatorType: 'REJECT',
			};
			const res = await handleWarehouseReceiptTransfer(params);
			this.$message.success('驳回成功');
			this.goBack();
		},
		closeModal() {
			this.$refs.submitModal.close();
		},
		// 新增的时候获取默认的 仓储合同
    async getLatestWarehouseContract() {
      const res = await getLatestWarehouseContract()
      const info = res.data || {}
      this.$nextTick(() => {
         this.$refs.applyInfo.selectStorageContract(info)
      })

    }
	},
	components: {
		Breadcrumb,
		OpenContractInfo,
		ApplyInfo,
		AttachmentOpen,
		TipModal,
		WarehouseInfo
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
	}
}
.slModal2 {
	/deep/ .ant-modal-body {
		max-height: inherit;
	}
}
textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}

textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::-moz-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea:-ms-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::placeholder {
	color: #8191a9;
	font-size: 14px;
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
.red {
	color: red;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
.btn {
	border: 0;
}
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: 19%;
	}
}
</style>
