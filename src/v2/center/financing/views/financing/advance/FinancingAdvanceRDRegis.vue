<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 20px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>融单登记</span>
			</div>
			<div class="slTitleAssis">融单录入</div>
			<a-form
				class="slFormDetail"
				:colon="false"
				style="padding-top: 20px"
			>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="融单编号">
								<a-input
									style="width: 364px"
									v-model="bankBillNo"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="融单开立方">
								<a-input
									style="width: 364px"
									disabled
									:value="detailData.issuerName"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="开立日期">
								<a-input
									style="width: 364px"
									disabled
									:value="detailData.statusDesc"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="融单金额（元）">
								<a-input
									style="width: 364px"
									disabled
									:value="detailData.amount"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="融单接收方">
								<a-input
									style="width: 364px"
									disabled
									:value="detailData.receiverName"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="承诺付款日">
								<a-input
									style="width: 364px"
									disabled
									:value="detailData.acceptanceDate"
								></a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
			<div style="text-align: center; margin-top: 30px">
				<a-button
					type="primary"
					ghost
					@click="searchBill"
					style="margin-right: 30px"
					>查询</a-button
				>
				<a-button
					type="primary"
					@click="submitBill"
					>确认添加</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_FinancingRDSubmit, API_FinancingRDDetail } from '@/v2/center/financing/api/index.js';

import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {
			detailData: {},
			bankBillNo: ''
		};
	},
	components: {
		Breadcrumb
	},
	computed: {},
	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';

		// this.getDetail()
	},
	methods: {
		searchBill() {
			if (!this.bankBillNo) {
				this.$message.error('请输入融单编号');
				return;
			}
			API_FinancingRDDetail({ bankBillNo: this.bankBillNo })
				.then(res => {
					if (res.success) {
						this.detailData = res.data || {};
					}
				})
				.catch(() => {
					this.detailData = {};
				});
		},

		submitBill() {
			if (!this.bankBillNo) {
				this.$message.error('请输入融单编号');
				return;
			}
			this.$confirm({
				centered: true,
				content: '请仔细核对融单信息，添加成功后将无法修改',
				okText: '确定',
				icon: 'info-circle',
				title: '确认提示',
				closable: true,
				cancelText: '取消',
				onOk: () => {
					API_FinancingRDSubmit({ bankBillNo: this.bankBillNo, id: this.financingApplyId }).then(res => {
						if (res.success) {
							this.$router.back();
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingDetail {
	.downbtn {
		margin-bottom: 14px;
	}
	.ant-tabs-bar {
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
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
