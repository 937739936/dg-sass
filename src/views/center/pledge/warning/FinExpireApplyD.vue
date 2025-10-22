<template>
	<div class="s-card">
		<div style="margin: -10px -20px -20px -20px; background: #f4f5f8">
			<div
				class="top-box"
				style="background: #fff"
			>
				<div class="s-card-title">
					<span>发起到期兑付申请</span>
				</div>
				<div class="divider"></div>
			</div>
			<a-form
				:form="baseForm"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 14 }"
			>
				<div class="s-card-content">
					<h2>融资信息</h2>
					<a-row class="row">
						<a-col span="8">
							<a-row>
								<a-form-item label="货押融资编号">
									<a @click="openFin(detailData)">{{ $route.query.financingApplyNo }}</a>
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="融资起息日">
									{{ detailData.beginDate }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="融资金额（元）">
									{{ detailData.finAmount }}
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
								<a-form-item label="融资到期日">
									{{ detailData.endDate }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row>
								<a-form-item label="出资机构">
									{{ detailData.bankName }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="融资利率（%）">
									{{ detailData.rate }}
								</a-form-item>
							</a-row>
						</a-col>
					</a-row>
					<h2>赎货信息</h2>
					<a-row class="row">
						<a-col span="8">
							<a-row>
								<a-form-item
									label="本次解质数量（吨）"
									:label-col="{ span: 10 }"
									:wrapper-col="{ span: 14 }"
								>
									{{ detailData.pledgeQuantity }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row>
								<a-form-item
									label="本次解质货值（元）"
									:label-col="{ span: 10 }"
									:wrapper-col="{ span: 14 }"
								>
									{{ detailData.pledgeGoodsValue }}
								</a-form-item>
							</a-row>
						</a-col>
					</a-row>
					<a-table
						:columns="goodsColumn"
						:dataSource="detailData.goodsList || []"
						:pagination="false"
						:scroll="{ x: true }"
						rowKey="id"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</div>

				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<h2>还款信息</h2>
					<a-row class="row">
						<a-col span="8">
							<a-row>
								<a-form-item label="收款账户名称">
									{{ detailData.fundBankName }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="还款日期">
									<a-date-picker
										@change="changeDate"
										:disabled="true"
										:disabled-date="disabledDate"
										v-decorator="[
											`repayDate`,
											{
												rules: [{ required: true, message: `还款日期` }],
												validateTrigger: 'change'
											}
										]"
									></a-date-picker>
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="还款总额（元）">
									<span style="color: red">{{ detailData.totalAmount }}</span>
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row>
								<a-form-item label="收款方银行">
									<div class="overflow">
										<a-tooltip>
											<template slot="title">{{ detailData.fundBankBranch }}</template>
											<span>{{ detailData.fundBankBranch }}</span>
										</a-tooltip>
									</div>
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="还款本金（元）">
									{{ detailData.principal }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row>
								<a-form-item label="收款方银行账号">
									{{ detailData.fundNo }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="还款利息（元）">
									{{ detailData.interest }}
								</a-form-item>
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
							:dataSource="fileList || []"
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
						bizType="MORTGAGE_REDEEM"
					/>
				</div>
				<div style="text-align: center; padding-bottom: 40px; margin-top: -10px; background-color: #fff">
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="sumbitApply"
						>提交</a-button
					>
				</div>
			</a-form>
		</div>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_UPLOAD,
	API_PledgeFinExpireApplyDetail,
	API_PledgeFinExpireApplyDetailXie,
	API_PledgeFinExpireDetaildownloadFile,
	API_PledgeFinExpireDetaildownloadFileAll,
	API_PledgeFinExpireDetaildownloadFileView,
	API_PledgeFinExpireDetailrepaymentTrial,
	API_PledgeReplenApplySave
} from 'api';
import moment from 'moment';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';

export default {
	data() {
		return {
			moment,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			detailData: {},
			showupload: false,
			dafileList: [],
			action: API_UPLOAD,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			fileList: [],
			goodsColumn: [
				{ title: '入库单号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '仓单编号', dataIndex: 'goodsRecordNo', key: 'goodsRecordNo', fixed: 'left' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '入库日期', dataIndex: 'inoutDate', key: 'inoutDate' },
				{ title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue' },
				{ title: '本次解质数量（吨）', dataIndex: 'num', key: 'num' },
				{ title: '单价（元/吨）', dataIndex: 'price', key: 'price' },
				{ title: '本次解质货值（元）', dataIndex: 'goodsValue', key: 'goodsValue' }
			],
			xieyiColumn: [
				{ title: '附件类型', dataIndex: 'fileType' },
				{ title: '文件名', dataIndex: 'fileName' },
				{ title: '文件类型', dataIndex: 'ext' },
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
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
		API_PledgeFinExpireApplyDetail({ financingApplyNo: this.$route.query.financingApplyNo }).then(res => {
			if (res.success) {
				this.detailData = res.data || {};
				this.checkInitData();
			}
		});

		API_PledgeFinExpireApplyDetailXie({ repayType: 'REPAYMENT_DUE' }).then(res => {
			this.fileList = res.data || [];
		});
		// 不对接oa并且到期兑付 才展示上传
		setTimeout(() => {
			this.showupload = this.$refs.FinancingLiu.oaflag == false;
		}, 1000);
	},
	methods: {
		disabledDate(current) {
			// this.detailData.endDate11 = '2022-05-03'
			if (this.detailData.endDate && current) {
				var start = moment().subtract(1, 'd').valueOf() > current;
				var end = moment(this.detailData.endDate).valueOf() < current;
				return end || start;
			}
			return false;
		},
		checkInitData() {
			var cur = moment();
			cur = moment(this.detailData.endDate);
			this.baseForm.setFieldsValue({
				repayDate: cur
			});
			this.changeDate(cur);
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
		changeDate(v) {
			let d = v.format('YYYY-MM-DD');
			API_PledgeFinExpireDetailrepaymentTrial({
				repayType: 'REPAYMENT_DUE',
				financingApplyNo: this.$route.query.financingApplyNo,
				repayDate: d
			}).then(res => {
				this.detailData.repayDate = d;
				this.detailData.principal = res.data.principal;
				this.detailData.interest = res.data.interest;
				this.detailData.totalAmount = res.data.totalAmount;
				this.$forceUpdate();
			});
		},
		async sumbitApply() {
			let auditChainAndOperator = null;
			try {
				auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
			} catch (e) {
				auditChainAndOperator = e;
			}

			if (!auditChainAndOperator) {
				return;
			}

			this.baseForm.validateFields((error, values) => {
				if (error) return;
				if (this.showupload && this.dafileList.length == 0) {
					this.$message.error('请上传附件');
					return;
				}
				this.$confirm({
					centered: true,
					title: '确定提交',
					okText: '确定',
					content: '请确认数据填写无误，是否提交?',
					cancelText: '取消',
					onOk: () => {
						API_PledgeReplenApplySave({
							financingApplyNo: this.$route.query.financingApplyNo,
							repayType: 'REPAYMENT_DUE',
							repayDate: this.detailData.repayDate,
							repayInterest: this.detailData.interest,
							repayPrincipal: this.detailData.principal,
							repayFee: 0,
							auditChainAndOperator: auditChainAndOperator == 'noflag' ? null : auditChainAndOperator,
							certPath: this.dafileList.length ? this.dafileList[0].response.result : null
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
			if (!this.detailData.repayDate) {
				this.$message.error('请输入还款日期');
				return;
			}
			API_PledgeFinExpireDetaildownloadFileAll({
				...this.getParams()
			}).then(res => {
				comDownload(res, undefined, `到期兑付-${this.$route.query.financingApplyNo}.zip`);
			});
		},
		getParams() {
			return {
				financingApplyNo: this.$route.query.financingApplyNo,
				repayType: 'REPAYMENT_DUE',
				repayDate: this.detailData.repayDate,
				repayInterest: this.detailData.interest,
				repayFee: 0
			};
		},
		downPDF(record) {
			if (!this.detailData.repayDate) {
				this.$message.error('请输入还款日期');
				return;
			}
			API_PledgeFinExpireDetaildownloadFile({
				...this.getParams(),
				contractType: record.contractType
			}).then(res => {
				comDownload(res, null, record.fileName + '.pdf');
			});
		},
		viewPDF(record) {
			if (!this.detailData.repayDate) {
				this.$message.error('请输入还款日期');
				return;
			}
			API_PledgeFinExpireDetaildownloadFileView({
				...this.getParams(),
				contractType: record.contractType
			}).then(res => {
				if (res.data) {
					window.open(res.data, '_blank');
				}
			});
		},
		openFin(record) {
			const { href } = this.$router.resolve({
				path: '/center/financing/financingPledgeDetail',
				query: {
					id: record.financingApplyId
				}
			});
			window.open(href, '_new');
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
.file-notice {
	color: #bdbbbb;
	font-size: 13px;
}
.card-desc {
	margin-bottom: 10px;
	font-size: 13px;
}
.downbtn {
	margin-bottom: 14px;
	float: right;
	position: relative;
	z-index: 2;
}
.choose-btn {
	margin-bottom: 20px;
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
.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
</style>
