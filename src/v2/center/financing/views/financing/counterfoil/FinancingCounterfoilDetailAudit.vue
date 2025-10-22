<template>
	<div
		class="FinancingDetail"
		:style="{ margin: '-20px' }"
	>
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>票据融资审核</span>
			</div>
		</div>

		<div class="rz-content">
			<div class="title">融资基本信息</div>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资方">
						{{ detailData.financier }}
					</a-form-item>
					<a-form-item label="出资机构">
						{{ detailData.bankName }}
					</a-form-item>
					<a-form-item label="融资金额（元）">
						{{ detailData.amount }}
					</a-form-item>

					<a-form-item label="收款账号">
						{{ detailData.loanNo }}
					</a-form-item>
					<a-form-item label="收款账号开户名">
						{{ detailData.loanBankName }}
					</a-form-item>
					<a-form-item label="融资说明">
						<div style="max-width: 400px">{{ detailData.remark }}</div>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资比例（%）">
						{{ detailData.financingRatio }}
					</a-form-item>
					<a-form-item label="融资利率（%）">
						{{ detailData.rate }}
					</a-form-item>
					<a-form-item label="逾期利率（%）">
						{{ detailData.overdueRate }}
					</a-form-item>
					<a-form-item label="收款账户开户行">
						{{ detailData.loanBankBranch }}
					</a-form-item>
				</a-col>
			</a-row>
		</div>
		<div class="rz-content">
			<div class="title">票据信息</div>
			<a-row>
				<a-table
					rowKey="billNo"
					:columns="rongzi"
					:dataSource="rongziDataSource"
					:pagination="false"
					:defaultExpandAllRows="true"
					:locale="{ emptyText: '暂无数据' }"
				>
					<div
						slot="billNo"
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
		<div class="rz-content">
			<div class="title">审核</div>
			<a-row>
				<a-col
					:span="24"
					class="row"
				>
					<a-form-item label="审核结果">
						<a-radio-group
							name="radioGroup"
							v-model="auditResult"
						>
							<a-radio value="PASS">通过</a-radio>
							<a-radio value="REJECT">驳回</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col
					:span="24"
					class="row"
				>
					<a-form-item label="审核意见">
						<a-textarea
							style="width: 700px; height: 80px"
							placeholder="请输入审核意见"
							:maxLength="100"
							v-model="auditOpinion"
						>
						</a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
			<div style="text-align: center; margin-top: 30px">
				<a-button
					type="primary"
					ghost
					@click="$router.back()"
					style="margin-right: 30px"
					>返回</a-button
				>
				<a-button
					type="primary"
					@click="sumbitAudit"
					>提交</a-button
				>
			</div>
		</div>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import num from '@/untils/num.js';
import { mapGetters } from 'vuex';
import {
	API_FinancingDetail,
	API_FinancingJROnlySignSave,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile,
	API_FinancingAudit
} from '@/v2/center/financing/api/index.js';

export default {
	data() {
		return {
			accSub: num.accSub,
			rongziDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			BASE_NET: ENV.BASE_NET,
			detailData: {},
			fangkuanData: {},
			auditOpinion: '',
			auditResult: 'PASS',
			rongzi: [
				{
					title: '云票编号',
					dataIndex: 'billNo',
					scopedSlots: { customRender: 'billNo' }
				},
				{
					title: '开立方',
					dataIndex: 'issuerName'
				},
				{
					title: '转让方',
					dataIndex: 'transferName'
				},
				{
					title: '接收方',
					dataIndex: 'receiverName'
				},
				{
					title: '云票金额（元）',
					dataIndex: 'billAmount'
				},
				{
					title: '开立日期',
					dataIndex: 'issueDate'
				},
				{
					title: '承诺付款日',
					dataIndex: 'acceptanceDate'
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
					title: '还款利息',
					dataIndex: 'repayInterest'
				}
			]
		};
	},
	components: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';
		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/counterfoil/record/yunDetail',
				query: {
					id: record.id
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
					this.rongziDataSource = [res.data.billDetail];
					this.xieyiDataSource = res.data.contractList || [];
				}
			});
		},

		sumbitAudit() {
			// 审核拒绝直接调接口 不盖章
			if (this.auditResult == 'REJECT') {
				this.$confirm({
					centered: true,
					content: '需要填写驳回意见',
					okText: '确定',
					icon: 'info-circle',
					title: '确认驳回？',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						if (!this.auditOpinion) {
							this.$message.error('请填写驳回意见');
							return;
						}
						let func = API_FinancingAudit;
						func({
							financingApplyId: this.financingApplyId,
							auditOpinion: this.auditOpinion
						}).then(() => {
							this.$message.success('操作成功');
							this.$router.back();
						});
					},
					onCancel() {}
				});

				return;
			}
			if (this.auditResult == 'PASS') {
				this.$confirm({
					centered: true,
					content: '系统将对融资合同进行签章，请确保信息无误',
					okText: '确定',
					icon: 'info-circle',
					title: '确认提示',
					closable: true,
					cancelText: '取消',
					onOk: () => {
						const o = {
							auditOpinion: this.auditOpinion,
							type: this.$route.query.type,
							id: this.financingApplyId
						};
						let func = API_FinancingJROnlySignSave;
						func({ financingApplyId: o.id, auditOpinion: o.auditOpinion }).then(res => {
							if (res.data) {
								if (
									this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
									this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
								) {
									this.$router.push({
										name: 'financingCounterfoilAuditSign',
										query: o
									});
								} else {
									this.$message.success('操作成功');
									this.$router.push('/center/financing/financingCounterfoilListJR');
								}
							}
						});
					},
					onCancel() {}
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingDetail {
	background-color: #f4f5f8;
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
	.ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}

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
	.ant-form-item-control {
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
	.ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
