<template>
	<div style="width: 100%">
		<div
			class="s-card-content"
			v-if="detailDataReceivalVO"
		>
			<div class="slTitleAssis">基本信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="应付账款金额"
					><span style="color: rgba(255, 128, 15, 1)">￥{{ detailDataReceivalVO.amount | formatMoney }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="拟融资金额"
					><span style="color: rgba(255, 128, 15, 1)">￥{{ detailDataReceivalVO.planFinancingAmount | formatMoney }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="应付账款类型">{{ detailDataReceivalVO.typeText || '-' }} </a-descriptions-item>
				<a-descriptions-item label="应付账款起始日期">{{ detailDataReceivalVO.beginDate || '-' }} </a-descriptions-item>
				<a-descriptions-item label="应付账款到期日期">{{ detailDataReceivalVO.endDate || '-' }} </a-descriptions-item>
				<a-descriptions-item label="上游合同货值"
					>{{ detailData.contractInfo.upContract.amount | formatMoney }}
				</a-descriptions-item>
			</a-descriptions>
		</div>
		<div class="s-card-content">
			<div class="methods-wrap">
				<a-space>
					<div class="slTitleAssis">
						<a-space :size="20">
							单据信息
							<div class="slTitleAssisSwitch">
								<a-switch
									v-model="toolTipVisible"
									@change="changeToolTipVisible"
								/>
								资产清单
							</div>
						</a-space>
					</div>
				</a-space>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="downSellerSign"
						v-show="detailDataReceivalVO.assetSellerSign == 1"
						>下载供应商盖章版材料</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="downloadAll"
						>一键下载所有文档</a-button
					>
				</a-space>
			</div>
			<a-row
				:gutter="20"
				type="flex"
				style="flex-wrap: nowrap"
			>
				<a-col flex="160px">
					<LeftTabs
						@tabChange="tabChange"
						:toolTipVisible="toolTipVisible"
						:activeIndex="activeIndex.toString()"
						:detailData="detailData"
					/>
				</a-col>
				<!-- 右侧数据展示模块 -->
				<a-col
					flex="auto"
					style="width: 0"
				>
					<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
						<!-- 合同 -->
						<contract
							v-show="activeIndex == 0"
							:contractInfo="detailData.contractInfo"
							ref="contract"
						></contract>
						<!-- 运输凭证 -->
						<transport-document
							v-show="activeIndex == 1"
							:deliverInfo="detailData.deliverInfo"
							ref="transport"
						></transport-document>
						<!-- 数质量凭证 -->
						<quality-document
							v-show="activeIndex == 2"
							:recvInfo="detailData.recvInfo"
							ref="quality"
						></quality-document>
						<!-- 货转凭证 -->
						<goods-transfer-document
							v-show="activeIndex == 3"
							:goodTransferInfo="detailData.goodTransferInfo"
							ref="transfer"
						></goods-transfer-document>
						<!-- 核算表 -->
						<accounts-table
							v-show="activeIndex == 4"
							:accountInfo="detailData.accountInfo"
							ref="accounts"
						></accounts-table>
						<!-- 确认函 -->
						<confirm-letter
							v-show="activeIndex == 5"
							:confirmLetterInfo="detailData.confirmLetterInfo"
							ref="confirm"
						></confirm-letter>
						<!-- 发票 -->
						<invoice
							v-show="activeIndex == 6"
							ref="invo"
							:invoiceInfo="detailData.invoiceInfo"
						></invoice>
						<!-- 其他材料 -->
						<other-files
							v-show="activeIndex == 7"
							:otherInfo="detailData.otherInfo"
							ref="other"
						></other-files>
						<!-- 结算单 -->
						<settles-files
							v-show="activeIndex == 8"
							:settleInfo="detailData.settlementInfo"
							ref="settles"
						></settles-files>
					</div>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import Contract from '@sub/componentsAssets/Contract.vue';
import TransportDocument from '@sub/componentsAssets/TransportDocument.vue';
import QualityDocument from '@sub/componentsAssets/QualityDocument.vue';
import GoodsTransferDocument from '@sub/componentsAssets/GoodsTransferDocument.vue';
import AccountsTable from '@sub/componentsAssets/AccountsTable.vue';
import ConfirmLetter from '@sub/componentsAssets/ConfirmLetter.vue';
import Invoice from '@sub/componentsAssets/Invoice.vue';
import OtherFiles from '@sub/componentsAssets/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import {
	API_AuditReceivableDownload,
	API_AuditReceivableSellerSignDownload,
	exportReceivableInvoice,
	API_GetInvoiceResult
} from '@/v2/center/assets/api/index.js';
import { API_getCommonBatchDownload } from '@/v2/api';
import { API_getCommonDownload } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import LeftTabs from '@sub/componentsAssets/LeftTabs.vue';

export default {
	props: {
		detailData: {},
		defaultIndex: {
			default: 0
		}
	},
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			industryType: 'COAL',
			activeIndex: 0,
			toolTipVisible: false
		};
	},
	watch: {
		defaultIndex(data) {
			this.activeIndex = data;
		}
	},
	provide() {
		return {
			getInvoiceResultParent: this.getInvoiceResult,
			exportInvoiceParent: this.exportInvoice,
			downFileParent: API_getCommonDownload,
			downFileAllParent: API_getCommonBatchDownload,
			serialNo: () => this.detailDataReceivalVO?.serialNo // 文件下载命名
		};
	},
	components: {
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		SettlesFiles,
		OtherFiles,
		LeftTabs
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		detailDataReceivalVO() {
			return this.detailData?.receivalVO || {};
		}
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		this.toolTipVisible = Cookies.get('assets-tooltip') === 'false' ? false : true;
	},
	methods: {
		changeToolTipVisible(e) {
			Cookies.set('assets-tooltip', e, { expires: 99999 });
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		// 选中发票导出
		exportInvoice(params) {
			return exportReceivableInvoice({ assetId: this.detailData.receivalVO.id, ...params });
		},
		// 查询发票信息详情
		getInvoiceResult(params) {
			return new Promise(resolve => {
				API_GetInvoiceResult(params).then(res => {
					if (res.success) {
						resolve(res.data);
					}
				});
			});
		},
		downloadAll() {
			// 一键下载所有文档
			// 资产买方简称-卖方简称-资金类型-资产流水号-资产附件-格式
			let { buyerAbbreviation, sellerAbbreviation, paymentTypeName, serialNo } = this.detailDataReceivalVO;
			let name = `${buyerAbbreviation}-${sellerAbbreviation}-${paymentTypeName}-${serialNo}-资产附件.zip`;
			API_AuditReceivableDownload({ id: this.$route.query.id }).then(res => {
				comDownload(res, null, name);
			});
		},
		downSellerSign() {
			// 盖章版材料下载
			API_AuditReceivableSellerSignDownload({ id: this.$route.query.id }).then(res => {
				comDownload(res, null, '供应商盖章版材料.zip');
			});
		}
	}
};
</script>

<style lang="less" scoped>
.s-card-content {
	padding: 0;
	background: #fff;
	.row .ant-col {
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}
	// .ant-row .ant-col {
	// 	margin-bottom: 18px;
	// }
	.slTitleAssis {
		display: inline-flex;
		align-items: center;
		margin-bottom: 20px;
		margin-top: 20px;
		.slTitleAssisSwitch {
			display: inline-block;
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.methods-wrap {
		margin-top: 20px;
		height: 54px;
		align-content: center;
		margin-bottom: 20px;
		justify-content: space-between;
	}

	::v-deep.ant-descriptions {
		font-weight: 400;
		line-height: 20px;
		padding: 0 !important;
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
			width: inherit;
			// width: 22%;
		}
	}
}
</style>
