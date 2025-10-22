<template>
	<div
		class="FinancingPledgeDetail"
		:style="{ margin: '-20px' }"
	>
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-top: 0; margin-left: 0px"
			>
				<span>货押融资详情</span>
			</div>
		</div>

		<a-tabs default-active-key="1">
			<a-tab-pane
				key="1"
				tab="融资信息"
				style="flex-direction: column"
			>
				<div
					class="rz-content"
					v-if="detailData.auditResult"
					style="margin-bottom: 20px"
				>
					<div class="title">审核结果</div>
					<a-row>
						<a-form-item label="审核人">
							<span>{{ detailData.auditOperator }}</span>
						</a-form-item>
						<a-form-item label="审核时间">
							<span>{{ detailData.auditTime }}</span>
						</a-form-item>
						<a-form-item label="审核结果">
							<span style="color: red">{{ detailData.auditResultText }}</span>
						</a-form-item>
						<a-row style="margin-bottom: 20px">
							<a-col
								span="5"
								style="width: 120px; text-align: right; margin-right: 14px"
								>审核意见：</a-col
							>
							<a-col
								span="15"
								style="word-break: break-all"
							>
								{{ detailData.auditOpinion }}
							</a-col>
						</a-row>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">融资基本信息</div>

					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="出资机构">
								{{ detailData.bankName }}
							</a-form-item>
							<a-form-item label="预计融资起息日期">
								{{ detailData.applyBeginDate }}
							</a-form-item>
							<a-form-item label="是否可提前还款">
								{{ detailData.prepayment == 1 ? '是' : '否' }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融资申请金额（元）">
								{{ detailData.amount }}
							</a-form-item>
							<a-form-item label="预计融资到期日期">
								{{ detailData.applyEndDate }}
							</a-form-item>
							<a-form-item label="可提前还款日期">
								{{ detailData.prepaymentDate }}
							</a-form-item>
						</a-col>
					</a-row>
					<a-row style="margin-top: 20px">
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融资收款账号">
								{{ detailData.loanNo }}
							</a-form-item>
							<a-form-item label="融资收款账号开户名">
								{{ detailData.loanBankName }}
							</a-form-item>
							<a-form-item label="融资收款账号开户行">
								{{ detailData.loanBankBranch }}
							</a-form-item>
							<a-form-item
								label="资金方收款账号"
								style="margin-top: 40px"
							>
								{{ detailData.acctNo }}
							</a-form-item>
							<a-form-item label="资金方收款账号开户名">
								{{ detailData.acctBankName }}
							</a-form-item>
							<a-form-item label="资金方收款账号开户行">
								{{ detailData.acctBankBranch }}
							</a-form-item>
							<a-form-item label="融资说明">
								<div style="max-width: 400px">{{ detailData.remark }}</div>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="资金监管账号">
								{{ detailData.fundNo }}
							</a-form-item>
							<a-form-item label="资金监管账号开户名">
								{{ detailData.fundBankName }}
							</a-form-item>
							<a-form-item label="资金监管账号开户行">
								{{ detailData.fundBankBranch }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">费用明细</div>
					<div
						v-for="(item, index) in detailData.feeList"
						:key="index"
					>
						<div style="font-size: 14px; margin-bottom: 10px">{{ item.feeTypeText }}</div>
						<a-row>
							<a-col :span="12">
								<a-form-item label="是否收取">
									{{ item.isFeeText || '-' }}
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="计费规则">
									{{ item.serviceMethodText || '-' }}
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="计费方式">
									{{ item.feeModeText || '-' }}
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="费率（%）">
									{{ item.rate || '-' }}
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="收取方式">
									{{ item.collectionMethodText || '-' }}
								</a-form-item>
							</a-col>
							<a-col
								:span="12"
								v-if="item.incomeByDayText"
							>
								<a-form-item label="是否按日计息">
									{{ item.incomeByDayText || '-' }}
								</a-form-item>
							</a-col>
						</a-row>
					</div>
				</div>
				<div class="rz-content">
					<div class="title">资产信息</div>
					<a-row>
						<a-table
							rowKey="receivableSerialNo"
							:columns="rongzi"
							:dataSource="rongziDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="receivableSerialNo"
								slot-scope="text, record"
							>
								<a @click="openAssets(record)">{{ text }} </a>
							</div>
						</a-table>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">融资协议</div>
					<a-row>
						<a-button
							type="primary"
							ghost
							class="downbtn"
							@click="downAll"
							>下载所有协议</a-button
						>
						<a-table
							rowKey="name"
							:columns="xieyi"
							:dataSource="xieyiDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="action"
								slot-scope="text, record"
							>
								<a
									href="javascript:;"
									style="margin-right: 10px"
									@click="viewPDF(record)"
									>查看</a
								>
								<a
									href="javascript:;"
									@click="downPDF(record)"
									>下载</a
								>
							</div>
						</a-table>
					</a-row>
				</div>
				<div
					class="rz-content"
					v-if="detailData.auditChainAndOperator && detailData.auditChainAndOperator.maiData"
				>
					<div class="title">审批流</div>
					<a-row>
						<a-col :span="12">
							<a-form-item label="流程选择">
								{{ detailData.auditChainAndOperator.chainName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							v-if="detailData.auditChainAndOperator.maiData.CCS_OA"
						>
							<a-form-item label="CCS流程发起人">
								{{ detailData.auditChainAndOperator.maiData.CCS_OA.operatorName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							v-if="detailData.auditChainAndOperator.maiData.MS_OA"
						>
							<a-form-item label="麦数流程发起人">
								{{ detailData.auditChainAndOperator.maiData.MS_OA.operatorName }}
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="提交时间">
								{{ detailData.applyDate }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="2"
				tab="放还款信息"
				style="flex-direction: column"
			>
				<div class="rz-content">
					<div class="title">放款信息</div>
					<a-row>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="出资机构">
								{{ fangkuanData.bankName }}
							</a-form-item>
							<a-form-item label="融资申请日期">
								{{ fangkuanData.applyDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="融资金额">
								{{ fangkuanData.applyAmount }}
							</a-form-item>
							<a-form-item label="放款金额">
								{{ fangkuanData.finAmount }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="融资起息日">
								{{ fangkuanData.beginDate }}
							</a-form-item>
							<a-form-item label="融资到期日期">
								{{ fangkuanData.endDate }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">还款信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="应还本金（元）">
								{{ fangkuanData.finAmount }}
							</a-form-item>
							<a-form-item label="已还本金合计（元）">
								{{ accSub(fangkuanData.finAmount, fangkuanData.unPayPrincipal) }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="未还本金合计（元）">
								{{ fangkuanData.unPayPrincipal }}
							</a-form-item>
							<a-form-item label="已还款总额（元）">
								{{ fangkuanData.totalRepayAmount }}
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-form-item label="融资状态">
							{{ fangkuanData.statusText }}
						</a-form-item>
					</a-row>
					<a-row>
						<a-table
							rowKey="receivableSerialNo"
							:columns="fangkuan"
							:dataSource="fangkuanDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
					</a-row>
				</div>
			</a-tab-pane>
		</a-tabs>
		<div style="text-align: center; margin-top: -10px; margin-bottom: 10px; background-color: #fff">
			<a-button
				@click="$router.back()"
				style="margin-right: 30px"
				>返回</a-button
			>
		</div>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_FinancingDetail,
	API_FinancingDetailFK,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile
} from '@/v2/center/financing/api/index.js';

import num from '@/untils/num.js';

export default {
	name: 'FinancingPledgeDetail',
	data() {
		return {
			rongziDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			BASE_NET: ENV.BASE_NET,
			detailData: {},
			accSub: num.accSub,
			fangkuanData: {},
			rongzi: [
				{
					title: '货押资产编号',
					dataIndex: 'receivableSerialNo',
					scopedSlots: { customRender: 'receivableSerialNo' }
				},
				{
					title: '货主名称',
					dataIndex: 'sellerName'
				},
				{
					title: '质押数量（吨）',
					dataIndex: 'pledgeQuantity'
				},
				{
					title: '质押货值（元）',
					dataIndex: 'pledgeGoods'
				},
				{
					title: '拟融资金额（元）',
					dataIndex: 'planFinancingAmount'
				},
				{
					title: '仓储企业',
					dataIndex: 'warehouseCompanyName'
				}
			],
			xieyi: [
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
					title: '合同名称',
					dataIndex: 'name'
				},
				{
					title: '状态',
					dataIndex: 'statusText'
				},
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			fangkuan: [
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
					title: '还款日期',
					dataIndex: 'repayDate'
				},
				{
					title: '还款总额（元）',
					dataIndex: 'repayAmount'
				},
				{
					title: '还款本金（元）',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '还款利息（元）',
					dataIndex: 'repayInterest'
				},
				{
					title: '其他费用（元）',
					dataIndex: 'serviceCharge'
				}
			]
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';

		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/pledge/detail',
				query: {
					id: record.assetId
				}
			});

			window.open(href, '_new');
		},
		downPDF(record) {
			API_FinancingDetaildownloadFile({
				contractFileId: record.id
			}).then(res => {
				comDownload(res, record.url, null);
			});
		},
		viewPDF(record) {
			window.open(record.url, '_blank');
		},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.financingApplyId
			}).then(res => {
				comDownload(res, undefined, `融资协议.zip`);
			});
		},
		getDetail() {
			API_FinancingDetail({ financingApplyId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.rongziDataSource = [res.data];
					this.xieyiDataSource = res.data.contractList || [];

					if (this.detailData.auditChainAndOperator && this.detailData.auditChainAndOperator.operatorInfo) {
						var maiData = {};
						this.detailData.auditChainAndOperator.operatorInfo.forEach(item => {
							maiData[item.systemCode] = item;
						});
						this.detailData.auditChainAndOperator.maiData = maiData;
						debugger;
					}
				}
			});
			API_FinancingDetailFK({ financingApplyId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data || {};

					this.fangkuanDataSource = res.data.repayList || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingPledgeDetail {
	.downbtn {
		margin-bottom: 14px;
	}
	::v-deep .ant-tabs-bar {
		background-color: #fff;
		margin-bottom: 0;
		border: none;
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	::v-deep .ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}

	background-color: #f4f5f8;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
	}
	::v-deep .ant-form-item-control {
		input,
		textarea {
			width: 254px;
		}
	}
	.textarea-wrap {
		textarea {
			width: 720px;
			text-align: left !important;
		}
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			min-width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
