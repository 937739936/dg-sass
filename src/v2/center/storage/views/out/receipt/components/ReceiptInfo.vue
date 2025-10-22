<template>
	<a-card
		class="custom-card-title"
		:title="title"
		:bordered="false"
	>
		<a-button
			class="add"
			ghost
			type="primary"
			@click="$router.go(-1)"
		>
			返回
		</a-button>
		<div class="info">
			<p class="title">基本信息</p>
			<a-row>
				<a-col :span="12">
					<a-col
						:span="24"
						class="flex-box"
						v-if="showNum"
					>
						<div class="name">出仓单编号</div>
						<div class="value">
							{{ data.deliveryNum }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">仓储企业</div>
						<div class="value">
							{{ data.storageCompany }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">储存库点</div>
						<div class="value">
							{{ data.depotPoint }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">提货人名称</div>
						<div class="value">
							{{ data.consignee }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">出仓单实际重量</div>
						<div class="value">
							{{ data.deliveryAmount && data.deliveryAmount.toLocaleString() }}
							吨
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">出仓单附件</div>
						<div class="value">
							<a
								@click="previewAttachment(item)"
								:key="index"
								v-for="(item, index) in data.attachList"
							>
								附件{{ index + 1 }}
							</a>
						</div>
					</a-col>
				</a-col>
				<a-col :span="12">
					<a-col
						:span="24"
						class="flex-box"
						v-if="showNum"
					>
						<div class="name">出仓单状态</div>
						<div class="value">
							{{ data.statusDesc }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">货权方</div>
						<div class="value">
							{{ data.coreCompany }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">仓房号</div>
						<div class="value">
							{{ data.storehouse }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">商品名称</div>
						<div class="value">
							{{ data.grainName }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
					>
						<div class="name">已执行数量</div>
						<div class="value">{{ data.issuedWeight && data.issuedWeight.toLocaleString() }} 吨</div>
					</a-col>
				</a-col>
				<a-col :span="24">
					<a-col
						:span="24"
						class="flex-box"
						v-if="data.cancelCause"
					>
						<div class="name">作废事由</div>
						<div class="value">
							{{ data.cancelCause }}
						</div>
					</a-col>
					<a-col
						:span="24"
						class="flex-box"
						v-if="data.auditOpinion"
					>
						<div class="name">审核意见</div>
						<div class="value">
							{{ data.auditOpinion }}
						</div>
					</a-col>
				</a-col>
			</a-row>
		</div>

		<div
			class="info"
			style="margin-top: 16px"
		>
			<p class="title">还款信息</p>
			<a-table
				:columns="columns"
				rowKey="repaymentSerialNo"
				:dataSource="data.paymentInfoList || []"
				:pagination="false"
				:scroll="{ x: true }"
			>
			</a-table>
		</div>
	</a-card>
</template>

<script>
import { API_OutWarehouseReceiptDetail } from '@/v2/center/storage/api';

const columns = [
	{
		title: '银行还款流水号',
		dataIndex: 'repaymentSerialNo',
		width: 200,
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '还款时间',
		dataIndex: 'repaymentTime',
		width: 200
	},
	{
		title: '对应还款金额(元)',
		dataIndex: 'repaymentAmount',
		width: 200,
		customRender: text => {
			return text && text.toLocaleString();
		}
	}
];

export default {
	name: 'ReceiptInfo',
	props: {
		title: {
			type: String,
			default: ''
		},
		showNum: {
			type: Boolean,
			default: true
		},
		isDetail: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			columns,
			data: {},
			id: ''
		};
	},
	computed: {},
	methods: {
		previewAttachment(url) {
			if(!url) return
			window.open(url, '_blank');
		},

		getDetail() {
			API_OutWarehouseReceiptDetail(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		}
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	}
};
</script>
<style lang="less" scoped>
::v-deep .ant-descriptions-item-label {
	width: 130px;
	text-align: right;
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.info {
	background: #ffffff;
	.title {
		margin-bottom: 10px;
		padding-bottom: 0;
		font-size: 14px;
		font-weight: 600;
	}
	.flex-box {
		display: flex;
		margin-top: 10px;
		> div {
			width: calc(100% - 150px);
			padding-right: 10px;
			color: #6b6f76;
			line-height: 18px;
		}
		.name {
			width: 150px;
			text-align: right;
			padding-right: 20px;
			// width: 80px;
		}
		.value {
			color: #383a3f;
			span {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				letter-spacing: 0;
			}
		}
	}
}
</style>
