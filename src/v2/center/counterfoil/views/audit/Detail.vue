<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">云票详情</span>
				<div
					class="back-icon"
					@click="$router.back()"
				>
					返回
				</div>
			</div>
			<a-tabs default-active-key="1">
				<a-tab-pane
					key="1"
					tab="云票信息"
					style="flex-direction: column"
				>
					<div
						class="new-detail-content"
						style="margin-bottom: 0; margin-top: 20px"
						v-if="detailData && detailData.assetBillVO && detailData.assetBillVO.auditTime"
					>
						<div class="title">审核结果</div>
						<a-row>
							<a-form-item label="审核人">
								<span>{{ detailData.assetBillVO.auditOperator }}</span>
							</a-form-item>
							<a-form-item label="审核时间">
								<span>{{ detailData.assetBillVO.auditTime }}</span>
							</a-form-item>
							<a-form-item label="审核结果">
								<span style="color: red">{{ detailData.assetBillVO.auditResultText }}</span>
							</a-form-item>
							<a-form-item label="审核意见">
								<span>{{ detailData.assetBillVO.auditOpinion }}</span>
							</a-form-item>
						</a-row>
					</div>
					<div class="new-detail-content">
						<div class="slTitleAssis">云票</div>
						<YunStamp :assetBillVO="detailData.assetBillVO"></YunStamp>
					</div>
					<div class="new-detail-content">
						<div class="slTitleAssis">资产信息</div>
						<a-row>
							<a-table
								class="new-table"
								rowKey="serialNo"
								:columns="rongzi"
								:dataSource="rongziDataSource"
								:pagination="false"
								:defaultExpandAllRows="true"
								:scroll="{ x: true }"
							>
								<div
									slot="serialNo"
									slot-scope="text, record"
								>
									<a
										href="javascript:;"
										@click="openAssets(record)"
										>{{ text }}</a
									>
								</div>
							</a-table>
						</a-row>
					</div>
					<div class="new-detail-content">
						<div class="slTitleAssis">云票协议</div>
						<a-row>
							<a-button
								type="primary"
								ghost
								class="downbtn"
								@click="downAll"
								>下载所有协议</a-button
							>
							<a-table
								class="new-table"
								rowKey="name"
								:columns="xieyi"
								:dataSource="xieyiDataSource"
								:pagination="false"
								:defaultExpandAllRows="true"
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
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="票据详情"
					style="flex-direction: column"
				>
					<div
						class="new-detail-content"
						v-if="detailData.assetBillVO"
					>
						<div class="slTitleAssis">票据开立信息</div>
						<a-row style="padding-bottom: 0">
							<a-col
								:span="12"
								class="row"
							>
								<a-form-item label="云票编号">
									{{ detailData.assetBillVO.serialNo }}
								</a-form-item>
								<a-form-item label="票据金额（元）">
									{{ detailData.assetBillVO.amount }}
								</a-form-item>
								<a-form-item label="票据开立方">
									{{ detailData.assetBillVO.issuerName }}
								</a-form-item>
								<a-form-item label="开立日期">
									{{ detailData.assetBillVO.issueDate }}
								</a-form-item>
								<a-form-item label="票据生成时间">
									{{ detailData.assetBillVO.createDate }}
								</a-form-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-item label="票据类型">
									{{ detailData.assetBillVO.billTypeDesc }}
								</a-form-item>
								<a-form-item label="票据接收方">
									{{ detailData.assetBillVO.receiverName }}
								</a-form-item>
								<a-form-item label="承诺付款日">
									{{ detailData.assetBillVO.acceptanceDate }}
								</a-form-item>
								<a-form-item label="云票状态">
									{{ detailData.assetBillVO.statusDesc }}
								</a-form-item>
							</a-col>
						</a-row>
					</div>
					<div class="new-detail-content">
						<div class="slTitleAssis">票据贴现信息</div>
						<a-row>
							<a-table
								class="new-table"
								:pagination="false"
								:columns="tiexianColumn"
								:data-source="tiexianDataSource"
								:scroll="{ x: true }"
								rowKey="id"
							></a-table>
						</a-row>
					</div>
					<div class="new-detail-content">
						<div class="slTitleAssis">票据还款信息</div>
						<a-row>
							<a-table
								class="new-table"
								:pagination="false"
								:columns="fangkuanColumn"
								:data-source="fangkuanDataSource"
								:scroll="{ x: true }"
								rowKey="id"
							></a-table>
						</a-row>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import comDownload from '@sub/utils/comDownload.js';

import {
	API_CounterfoilDetaildownloadFileAll,
	API_CounterfoilDetaildownloadFile,
	API_CounterfoilDetailViewFile,
	API_GetCounterfoilYunDetail
} from '@/v2/center/counterfoil/api/index.js';
import YunStamp from '@/v2/center/counterfoil/components/YunStamp.vue';

export default {
	data() {
		return {
			rongziDataSource: [],
			tiexianDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			detailData: {},
			fangkuanData: {},
			rongzi: [
				{
					title: '应付账款流水号',
					dataIndex: 'serialNo',
					scopedSlots: { customRender: 'serialNo' },
					fixed: 'left'
				},
				{
					title: '卖方名称',
					dataIndex: 'sellerName'
				},
				{
					title: '买方名称',
					dataIndex: 'buyerName'
				},

				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '应付账款金额（元）',
					dataIndex: 'amount'
				},
				{
					title: '应付账款起始日期',
					dataIndex: 'beginDate'
				},
				{
					title: '应付账款到期日期',
					dataIndex: 'endDate'
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
					dataIndex: 'typeDesc'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc'
				},
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			tiexianColumn: [
				{
					title: '贴现编号',
					dataIndex: 'applyNo'
				},
				{
					title: '贴现金额',
					dataIndex: 'amount'
				},
				{
					title: '贴现方',
					dataIndex: 'discountedName'
				},
				{
					title: '贴现金融机构',
					dataIndex: 'bankName'
				},
				{
					title: '贴现时间',
					dataIndex: 'discountedDate'
				},
				{
					title: '利息',
					dataIndex: 'interest'
				}
			],
			fangkuanColumn: [
				{
					title: '还款时间',
					dataIndex: 'repayDate'
				},
				{
					title: '还款总额',
					dataIndex: 'repayAmount'
				},
				{
					title: '还款本金',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '还款利息',
					dataIndex: 'repayInterest'
				},
				{
					title: '还款发起方',
					dataIndex: 'financier'
				},
				{
					title: '收款方',
					dataIndex: 'bankName'
				}
			]
		};
	},
	components: {
		YunStamp,
		Breadcrumb
	},
	computed: {},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';

		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/payable/manage/detail',
				query: {
					id: record.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		downPDF(record) {
			API_CounterfoilDetaildownloadFile({
				type: record.type,
				assetId: this.assetId,
				path: record.path
			}).then(res => {
				comDownload(res, undefined, record.typeDesc + '.pdf');
			});
		},
		viewPDF(record) {
			if (record.path) {
				window.open(record.path, '_blank');
				return;
			}
			API_CounterfoilDetailViewFile({
				type: record.type,
				assetId: this.assetId
			}).then(res => {
				window.open(res.data, '_blank');
			});
		},
		downAll() {
			API_CounterfoilDetaildownloadFileAll({
				assetId: this.assetId
			}).then(res => {
				comDownload(res, undefined, `云票协议.zip`);
			});
		},
		getDetail() {
			API_GetCounterfoilYunDetail({ id: this.financingApplyId }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.assetId = res.data.receivalVO.id;

					this.rongziDataSource = [res.data.receivalVO];
					this.xieyiDataSource = res.data.assetBillFileVOList || [];

					this.tiexianDataSource = res.data.assetBillDiscountedVOList || [];
					this.fangkuanDataSource = res.data.financingRepayVOList || [];
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	.slTitleAssis {
		margin: 30px 0;
	}
}
.downbtn {
	margin-bottom: 14px;
}
.new-detail-content {
	.ant-form-item {
		display: flex;
	}
}
</style>
