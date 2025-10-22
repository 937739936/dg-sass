<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>补保证金申请</span
				>
				<span
					style="font-size: 15px"
					v-if="detailData.statusText"
					>状态：{{ detailData.statusText }}</span
				>
			</div>
			<a-form
				:form="baseForm"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 14 }"
			>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>补货通知</h2>
						<a-row class="row">
							<a-col span="8">
								<a-row>
									<a-form-item label="补货编号">
										{{ detailData.serialNo }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="出资机构">
										{{ detailData.bankName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="融资金额（元）">
										{{ detailData.finAmount }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="需补货值（元）">
										<span style="color: red">{{ detailData.lossAmount }}</span>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="货押融资编号">
										<a @click="$router.push('/center/financing/financingPledgeDetail?id=' + detailData.financingApplyId + '')">{{
											detailData.financingApplyNo
										}}</a>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓库名称">
										{{ detailData.storageName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="当前质押数量（吨）"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ detailData.pledgeQuantity }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="通知时间">
										{{ detailData.noticeTime }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row>
									<a-form-item label="融资方">
										{{ detailData.financier }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓储企业">
										{{ detailData.storageCompanyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item
										label="当前质押货值（元）"
										:label-col="{ span: 9 }"
										:wrapper-col="{ span: 14 }"
									>
										{{ detailData.pledgeGoodsValue }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>

				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<h2>补保证金信息</h2>

					<a-row class="row">
						<a-col span="8">
							<a-row>
								<a-form-item label="补保证金日期">
									<a-date-picker
										:disabled-date="disabledDate"
										v-decorator="[
											`repayDate`,
											{
												rules: [{ required: true, message: `请输入补保证金日期` }],
												validateTrigger: 'change'
											}
										]"
									></a-date-picker>
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="收款账户名称"> 华能云成商业保理（天津）有限公司 </a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row>
								<a-form-item label="补保证金金额（元）">
									{{ detailData.lossAmount }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="收款方银行"> 交通银行股份有限公司北京市分行营业部 </a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row style="opacity: 0">
								<a-form-item label="test"> test </a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="收款方银行账号"> 1100 6014 9013 0005 17549 </a-form-item>
							</a-row>
						</a-col>
					</a-row>
					<a-row v-if="showupload">
						<a-col :span="24">
							<a-form-item
								label="打款凭证"
								:colon="false"
							>
								<a-upload
									v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
									:beforeUpload="beforeUpload"
									:action="action"
									:headers="headers"
									:multiple="false"
									:remove="removeFile"
									@change="fileChange"
									:fileList="dafileList"
									name="file"
								>
									<a-button
										type="primary"
										icon="upload"
										>上传附件</a-button
									>（未对接OA审批时，请线下打款后发起流程，并上传打款凭证）
								</a-upload>
							</a-form-item>
							<div class="file-notice">
								<p>附件上传要求：可支持格式为bmp，jpg，png，pdf的文件格式的附件，单个附件大小不得超过100M的文件。</p>
							</div>
						</a-col>
					</a-row>
				</div>
				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<h2>附件信息</h2>
					<a-row>
						<a-button
							type="primary"
							ghost
							class="downbtn"
							@click="downAll"
							>一键下载</a-button
						>
						<a-table
							rowKey="name"
							:columns="xieyiColumn"
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
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<FinancingLiu
						ref="FinancingLiu"
						bizType="MARGIN_REPLENISHMENT"
					/>
					<div style="text-align: center; margin-top: 40px">
						<a-button
							@click="$router.back()"
							type="primary"
							ghost
							>返回</a-button
						>
						<a-button
							type="primary"
							@click="submitApply('2')"
							style="margin-left: 10px"
							>提交</a-button
						>
					</div>
				</div>
			</a-form>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_UPLOAD,
	API_PledgeReplenDetail,
	API_PledgeReplenDetaildownloadFile,
	API_PledgeReplenApplyXie,
	API_PledgeReplenApplydownloadFileView,
	API_PledgeReplenApplydownloadFileAll,
	API_PledgeReplenApplydownloadFile,
	API_PledgeReplenAddSave
} from '@/api';
import moment from 'moment';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import comDownload from '@sub/utils/comDownload.js';

import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			showupload: false,
			dafileList: [],
			action: API_UPLOAD,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			detailData: {},
			xieyiDataSource: [],
			xieyiColumn: [
				{ title: '附件类型', dataIndex: 'fileType' },
				{ title: '文件名', dataIndex: 'fileName' },
				{ title: '文件类型', dataIndex: 'ext' },
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			logColumn: [
				{ title: '操作类型', dataIndex: 'auditResult', key: 'auditResult' },
				{ title: '操作人', dataIndex: 'auditOperatorName', key: 'auditOperatorName' },
				{ title: '所属公司', dataIndex: 'auditOperatorCompany', key: 'auditOperatorCompany' },
				{ title: '操作内容', dataIndex: 'auditOpinion', key: 'auditOpinion' },
				{ title: '操作时间', dataIndex: 'auditTime', key: 'auditTime' }
			]
		};
	},
	components: {
		FinancingLiu
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	mounted: function () {
		API_PledgeReplenApplyXie({ noticeId: this.$route.query.id, addGoodsType: 'ADD_MARGIN' }).then(res => {
			this.xieyiDataSource = res.data || [];
		});
		API_PledgeReplenDetail({ noticeId: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
			}
		});
		// 不对接oa并且到期兑付 才展示上传
		setTimeout(() => {
			this.showupload = this.$refs.FinancingLiu.oaflag == false; // && this.detailData.status == 'TO_BE_IMPROVED'
		}, 1000);
	},
	methods: {
		disabledDate(current) {
			if (this.detailData.endDate && current) {
				var start = moment().subtract(1, 'd').valueOf() > current;
				var end = moment(this.detailData.endDate).valueOf() < current;
				return end || start;
			}
			return false;
		},
		removeFile() {
			this.dafileList = [];
		},
		beforeUpload(file) {
			const isSupportFileType =
				file.type === 'image/jpeg' ||
				file.type === 'image/jpg' ||
				file.type === 'image/png' ||
				file.type === 'image/bmp' ||
				file.type === 'application/pdf';
			if (!isSupportFileType) {
				this.$message.error('仅支持bmp，jpg，png，pdf的文件格式');
			}

			return isSupportFileType;
		},
		fileChange({ fileList, file }) {
			if (file.status) {
				this.dafileList = fileList;
			}
		},
		getParams() {
			return {
				noticeId: this.$route.query.id,
				addGoodsType: 'ADD_MARGIN',
				marginAmount: this.detailData.lossAmount,
				marginDate: this.baseForm.getFieldValue('repayDate').format('YYYY-MM-DD'),
				certPath: this.dafileList.length ? this.dafileList[0].response.result : null
			};
		},
		async submitApply() {
			if (this.showupload && this.dafileList.length == 0) {
				this.$message.error('请上传附件');
				return;
			}

			this.baseForm.validateFields(async (err, values) => {
				if (err) return;
				let auditChainAndOperator = null;
				try {
					auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
				} catch (e) {
					auditChainAndOperator = e;
				}

				if (!auditChainAndOperator) {
					return;
				}
				this.$confirm({
					centered: true,
					title: '确定提交',
					okText: '确定',
					content: '请确认数据填写无误，是否提交?',
					cancelText: '取消',
					onOk: () => {
						API_PledgeReplenAddSave({
							...this.getParams(),
							auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator
						}).then(res => {
							if (res.success) {
								this.$message.success('操作成功');
								this.$router.back();
							}
						});
					},
					onCancel() {}
				});
			});
		},
		downAll() {
			API_PledgeReplenApplydownloadFileAll({
				...this.getParams()
			}).then(res => {
				comDownload(res, undefined, `补保证金-${this.detailData.serialNo}.zip`);
			});
		},
		downPDF(record) {
			if (record.attachmentId) {
				API_PledgeReplenDetaildownloadFile({
					contractFileId: record.attachmentId
				}).then(res => {
					comDownload(res, null, record.fileName + '.pdf');
				});
			} else {
				API_PledgeReplenApplydownloadFile({
					...this.getParams(),
					contractType: record.contractType
				}).then(res => {
					comDownload(res, null, record.fileName + '.pdf');
				});
			}
		},
		viewPDF(record) {
			if (record.path) {
				window.open(record.path, '_blank');
			} else {
				API_PledgeReplenApplydownloadFileView({
					...this.getParams(),
					contractType: record.contractType
				}).then(res => {
					if (res.data) {
						window.open(res.data, '_blank');
					}
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .ant-form-item-label {
	text-align: left;
	label {
		color: #6b6f76;
	}
}
.card-desc {
	margin-bottom: 10px;
	font-size: 13px;
}
.choose-btn {
	margin-bottom: 20px;
	position: relative;
	z-index: 3;
}
.downbtn {
	margin-bottom: 14px;
	float: right;
	position: relative;
	z-index: 3;
}
.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;
	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;
		a {
			cursor: pointer;
		}
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.bottom-box {
	.s-card-content .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.s-card-content {
	padding: 20px 16px 24px 16px;
	border-radius: 8px;
	background: #fff;
	margin: 14px 0 0 0;
	.row .ant-col {
		margin-top: 8px;
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-row .ant-col {
		margin-bottom: 8px;
		margin-top: 8px;
	}
	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #141517;
		line-height: 22px;
		margin-bottom: 16px;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
</style>
