<template>
	<div class="background-wrapper">
		<a-card
			class="custom-card-title"
			title="合同归档"
			:bordered="false"
		>
			<a-row>
				<a-col :span="8"
					><span>合同编号</span>
					<span class="ellipsis">
						<a-tooltip :title="data.contractNo">
							<div class="ellipsis value">{{ data.contractNo }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>买方</span>
					<span class="ellipsis">
						<a-tooltip :title="data.buyerName">
							<div class="ellipsis value">{{ data.buyerName }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>合同起始日期</span>
					<span class="ellipsis">
						<a-tooltip :title="`${data.contractStartDate}~${data.contractEndDate}`">
							<div class="ellipsis value">{{ data.contractStartDate }}~{{ data.contractEndDate }}</div>
						</a-tooltip>
					</span>
				</a-col>

				<a-col :span="8"
					><span>合同状态</span>
					<span class="ellipsis">
						<a-tooltip :title="data.status.cname">
							<div
								class="ellipsis value"
								:class="setStyle(data.status.name)"
							>
								{{ data.status.cname }}
							</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="8"
					><span>卖方</span>
					<span class="ellipsis">
						<a-tooltip :title="data.sellerName">
							<div class="ellipsis value">{{ data.sellerName }}</div>
						</a-tooltip>
					</span></a-col
				>
				<a-col :span="8"
					><span>交付日期</span>
					<span class="ellipsis">
						<a-tooltip :title="data.deliveryTime">
							<div class="ellipsis value">{{ data.deliveryTime }}</div>
						</a-tooltip>
					</span>
				</a-col>
				<a-col :span="24">
					<span style="flex: 1">商品确权单</span>
					<span style="flex: 8">
						该合同下共生成
						<em class="num">
							{{
								data.confirmationSlipInfo.confirmationSlipNum && data.confirmationSlipInfo.confirmationSlipNum.toLocaleString()
							}} </em
						>笔《商品确权单》，结算数量合计：{{
							data.confirmationSlipInfo.clearingWeightTotal && data.confirmationSlipInfo.clearingWeightTotal.toLocaleString()
						}}吨，结算金额合计：¥{{
							data.confirmationSlipInfo.clearingPriceTotal && data.confirmationSlipInfo.clearingPriceTotal.toLocaleString()
						}}元，您可以点击
						<a
							class="more"
							@click="jumpPage('/center/storageCenter/contract/detail')"
							>更多</a
						>
						查询详情信息。
					</span>
				</a-col>

				<a-col
					style="text-align: left"
					:span="24"
				>
					<span style="flex: 1">合同附件</span>
					<span style="flex: 8">
						<a
							class="mr16"
							:key="index"
							v-for="(item, index) in data.attachmentList"
						>
							{{ item.typeName }}
						</a>
					</span>
				</a-col>
			</a-row>
		</a-card>

		<a-card
			class="tc"
			:bordered="false"
		>
			<a-button
				style="margin-right: 24px"
				@click="$router.go(-1)"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="save"
				>归档</a-button
			>
		</a-card>
	</div>
</template>

<script lang="jsx">
import { API_GrainContractArchive, API_GrainContractDetail } from '@/v2/center/storage/api';

export default {
	name: 'storageCenterContractArchive',

	data() {
		return {
			data: {
				status: {},
				confirmationSlipInfo: {}
			}
		};
	},

	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	},

	methods: {
		getDetail() {
			API_GrainContractDetail(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		},

		setStyle(v) {
			return {
				EXECUTING: 'g',
				ARCHIVED: 'r'
			}[v];
		},

		save() {
			this.$confirm({
				closable: true,
				title: '确认要归档吗？',
				content: '请确认要归档的合同信息，归档成功后，该合同将无法进行后续操作。您确认要归档该合同吗？',
				okText: '确认',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_GrainContractArchive(this.id).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('归档成功');
								this.$router.go(-1);
							}
						}
					});
				},
				cancelText: '取消',
				onCancel() {}
			});
		},

		preview(v) {
			window.open(v, '_blank');
		},

		jumpPage(path) {
			this.$router.push({
				path,
				query: {
					id: this.id
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	display: flex;
	line-height: 32px;
	margin-bottom: 3px;
	/* border: 1px solid red; */
	span {
		display: inline-block;
		flex: 3;
	}
	span:nth-of-type(2) {
		flex: 6;
		padding-right: 5px;
	}
	.value {
		display: inline-block;
		max-width: 100%;
	}
	.num {
		font-size: 18px;
		color: rgb(242, 78, 77);
		font-weight: 600;
	}
	.more {
		font-size: 18px;
	}
}
::v-deep {
	.ant-table-footer {
		border: 1px solid #eef0f2;
	}
	.ant-table-body > table,
	.ant-table-fixed-left table,
	.ant-table-fixed-right table {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
}
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
</style>
