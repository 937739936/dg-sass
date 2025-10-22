<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">云票签收审核</span>
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
			<div class="new-detail-content">
				<div class="slTitleAssis">审核</div>
				<a-row>
					<a-form-model
						ref="auditForm"
						:model="auditForm"
						:rules="auditRules"
					>
						<a-row>
							<a-col
								:span="24"
								class="row"
							>
								<a-form-model-item
									ref="auditResult"
									label="审核结果"
									prop="auditResult"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-radio-group v-model="auditForm.auditResult">
										<a-radio value="1">签收</a-radio>
										<a-radio value="0">拒绝签收</a-radio>
									</a-radio-group>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row"
								v-if="auditForm.auditResult == '0'"
							>
								<a-form-model-item
									ref="auditOption"
									label="审核意见"
									prop="auditOption"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-textarea
										v-model="auditForm.auditOption"
										placeholder="请输入内容，最多输入1000个字符"
										:maxLength="1000"
									></a-textarea>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row"
								v-else
							>
								<a-form-model-item
									ref="auditOptionOth"
									label="审核意见"
									prop="auditOptionOth"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-textarea
										v-model="auditForm.auditOption"
										placeholder="请输入内容，最多输入1000个字符"
										:maxLength="1000"
									></a-textarea>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row btn-group"
							>
								<a-button
									type="primary"
									ghost
									@click="$router.back()"
									>取消</a-button
								>
								<a-button
									type="primary"
									class="submit_btn"
									@click="handleSubmit"
									v-debounceclick
									>确定</a-button
								>
							</a-col>
						</a-row>
					</a-form-model>
				</a-row>
			</div>
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
	API_GetCounterfoilAudit,
	API_GetCounterfoilYunDetail
} from '@/v2/center/counterfoil/api/index.js';

import YunStamp from '@/v2/center/counterfoil/components/YunStamp.vue';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			auditForm: {
				auditResult: '1',
				auditOption: ''
			},
			auditRules: {
				auditResult: [{ required: true, message: '审核结果不能为空', trigger: 'change' }],
				auditOption: [{ required: true, message: '内容不能为空', trigger: 'change' }],
				auditOptionOth: [{ required: false, message: '', trigger: 'change' }]
			},
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
					scopedSlots: { customRender: 'serialNo' }
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
			]
		};
	},
	components: {
		YunStamp,
		Breadcrumb
	},
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
		handleSubmit() {
			this.$refs.auditForm.validate(valid => {
				if (valid) {
					API_GetCounterfoilAudit({
						id: this.financingApplyId,
						result: this.auditForm.auditResult,
						rejectReason: this.auditForm.auditOption
					}).then(res => {
						if (res.data) {
							if (this.auditForm.auditResult == '0') {
								this.$message.success('操作成功');
								this.$router.push('/center/counterfoil/audit/list');
								return;
							}
							this.$confirm({
								centered: true,
								content: '系统将对云票协议进行签章，请确保信息无误',
								okText: '确定',
								icon: 'info-circle',
								title: '确认提示',
								closable: true,
								cancelText: '取消',
								onOk: () => {
									if (
										this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
										this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
									) {
										this.$router.push('//center/counterfoil/audit/sign?id=' + this.financingApplyId);
									} else {
										this.$message.success('操作成功');
										this.$router.push('/center/counterfoil/audit/list');
									}
								},
								onCancel() {}
							});
						}
					});
				}
			});
		},
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
.btn-group {
	text-align: center;
	margin-top: 16px;

	.submit_btn {
		margin-left: 16px;
	}
}
::v-deep .ant-form-item-label {
	text-align: left;
}
</style>
