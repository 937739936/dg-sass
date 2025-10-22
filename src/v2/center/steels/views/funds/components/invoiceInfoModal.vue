<template>
	<a-modal
		title="票面信息"
		width="1000px"
		:footer="null"
		@cancel="handleCancel"
		:visible="visible"
	>
		<div>
			<template v-if="isEa">
				<a-row class="row">
					<a-col span="12">交易时间：{{ data.tradeTime }}</a-col>
					<a-col span="12">交易流水号：{{ data.tradeNo }}</a-col>
				</a-row>
			</template>

			<template v-else>
				<a-row class="row">
					<a-col span="12">出票日期：{{ data.issueDate }}</a-col>
					<a-col span="12">票据状态：{{ data.state }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col span="12">汇票到期日：{{ data.dueDate }}</a-col>
					<a-col span="12">票号：{{ data.tradeNo }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col span="12">票据类型：{{ data.collectionTypeText }}</a-col>
					<a-col span="12">签收日期：{{ data.collectionDate }}</a-col>
				</a-row>
			</template>
		</div>

		<div class="table border-top border-left">
			<div class="flex-box border-bottom">
				<div
					class="border-right flex-box center"
					style="width: 35px; height: 105px; padding: 0 10px"
				>
					出票人
				</div>

				<div
					class="border-right"
					style="width: 80px"
				>
					<div class="cell border-bottom">全称</div>
					<div class="border-bottom cell">账号</div>
					<div class="cell">开户银行</div>
				</div>

				<div class="flex-1">
					<div class="cell border-right border-bottom flex-box">
						{{ isEa ? data.payer : data.drawer }}
					</div>
					<div class="cell border-right border-bottom flex-box">
						{{ isEa ? data.payerAccount : data.drawerAccountNo }}
					</div>
					<div class="cell border-right flex-box">
						{{ isEa ? data.payerAccountBank : data.drawerBank }}
					</div>
				</div>

				<div class="flex-box flex-1">
					<div
						class="border-right flex-box center"
						style="width: 35px; height: 105px; padding: 0 10px"
					>
						收票人
					</div>
					<div class="flex-1">
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 80px"
							>
								全称
							</div>
							<div class="cell flex-1">
								{{ isEa ? data.payee : data.recipient }}
							</div>
						</div>
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 80px"
							>
								账号
							</div>
							<div class="cell flex-1">
								{{ isEa ? data.payeeAccount : data.recipientAccountNo }}
							</div>
						</div>
						<div
							class="border-right flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 80px"
							>
								开户银行
							</div>
							<div class="ellipsis cell flex-1">
								{{ isEa ? data.payeeAccountBank : data.recipientBank }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex-box">
				<div
					class="border-right cell border-bottom"
					style="width: 115px"
				>
					票据金额
				</div>
				<div
					class="cell border-bottom border-right flex-1"
					style="width: 35px"
				>
					<span style="font-family: PingFangSC-Regular">¥</span
					>{{ data.collectionAmount ? data.collectionAmount.toLocaleString() : data.collectionAmount }}
				</div>
			</div>

			<template v-if="!isEa">
				<div class="flex-box">
					<div
						class="border-right cell border-bottom"
						style="width: 115px; height: 70px; line-height: 70px"
					>
						承兑人信息
					</div>

					<div class="flex-1">
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 80px"
							>
								全称
							</div>
							<div class="cell flex-1">
								{{ data.acceptor }}
							</div>
						</div>
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 80px"
							>
								账号
							</div>
							<div class="cell flex-1">
								{{ data.acceptorAccount }}
							</div>
						</div>
					</div>

					<div class="flex-1">
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 95px"
							>
								开户行行号
							</div>
							<div class="cell flex-1">
								{{ data.acceptorBankNo }}
							</div>
						</div>
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 95px"
							>
								开户行名称
							</div>
							<div class="cell flex-1">
								{{ data.acceptorBank }}
							</div>
						</div>
					</div>
				</div>

				<div class="flex-box">
					<div
						class="border-right cell border-bottom"
						style="width: 115px"
					>
						交易合同号
					</div>
					<div class="flex-1">
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div class="cell flex-1">
								{{ data.tradeConNo }}
							</div>
						</div>
					</div>
					<div class="flex-1">
						<div
							class="border-right border-bottom flex-box"
							style="height: 35px"
						>
							<div
								class="border-right cell"
								style="width: 95px"
							>
								能否转让
							</div>
							<div class="cell flex-1">
								{{ data.transferText }}
							</div>
						</div>
					</div>
				</div>
			</template>

			<div class="flex-box">
				<div
					class="border-right cell border-bottom"
					style="width: 115px"
				>
					{{ isEa ? '描述信息' : '备注' }}
				</div>
				<div
					class="cell border-bottom border-right flex-1"
					style="width: 35px"
				>
					{{ isEa ? data.tradeDesc : data.remark }}
				</div>
			</div>
		</div>

		<div v-if="!isEa">
			<a-row class="row">
				<a-col span="12">被背书人名称：{{ data.endorsee }}</a-col>
				<a-col span="12">背书人名称：{{ data.endorser }}</a-col>
			</a-row>
			<a-row class="row">
				<a-col span="12">背书日期：{{ data.endorseDate }}</a-col>
			</a-row>
		</div>
	</a-modal>
</template>

<script>
import { API_GetCollectionCollectionBillDetail, API_GetCollectionCollectionTeleDetail } from '@/v2/center/steels/api/funds.js';
export default {
	name: 'InvoiceInfoModal',
	data() {
		return {
			isEa: '', // 是否是电汇类型
			data: {}
		};
	},
	props: ['id', 'type', 'visible'],

	watch: {
		visible: function (data) {
			if (data) {
				// 电汇 回款类型：collectionType ELECTRONIC_ACCEPT
				this.isEa = this.type === 'ELECTRONIC_ACCEPT' ? true : false;
				this.getDetail();
			}
		}
	},
	methods: {
		getDetail() {
			const func = this.isEa ? API_GetCollectionCollectionTeleDetail : API_GetCollectionCollectionBillDetail;
			func(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				} else {
					this.$message.error('网络异常，请稍后重试！');
				}
			});
		},
		handleCancel() {
			this.$emit('cancel');
		}
	}
};
</script>

<style lang="less" scoped>
.fr {
	float: right;
}
.tc {
	text-align: center;
}
.row {
	font-size: 16px;
	color: #333;
	padding: 10px 0;
	padding-left: 20px;
}
.flex-box {
	display: flex;
}
.flex-1 {
	flex: 1;
}
.center {
	align-items: center;
	justify-content: center;
}
.table {
	.cell {
		padding: 0 10px;
		height: 35px;
		line-height: 35px;
	}
}
.border {
	border: 1px solid #000000;
}
.border-right {
	border-right: 1px solid #000000;
}
.border-left {
	border-left: 1px solid #000000;
}
.border-top {
	border-top: 1px solid #000000;
}
.border-bottom {
	border-bottom: 1px solid #000000;
}
::v-deep.ant-modal-body {
	padding-bottom: 36px;
}
</style>
