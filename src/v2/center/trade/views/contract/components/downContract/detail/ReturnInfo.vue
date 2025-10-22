<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="30"
		>
			<a-col>
				<div class="slTitleAssis">回款列表</div>
			</a-col>
			<!-- <a-col class="mt32">
        <span class="label">已结算数量：</span>
        <span>{{detail.statementedQuantity|formatMoney(2)}}吨</span>
      </a-col>
      <a-col class="mt32">
        <span class="label">已结算金额：</span>
        <span>{{detail.statementedAmount|formatMoney(2)}}元</span>
      </a-col> -->
		</a-row>
		<div class="num-box">
			<a-row type="flex">
				<a-col>
					<p>回款笔数/笔</p>
					<span>{{ detail.terminalContractReceivedNum | formatMoney(2) }}</span>
				</a-col>
				<a-col>
					<p>认领至本合同金额/元</p>
					<span>{{ detail.terminalContractClaimAmount | formatMoney(2) }}</span>
				</a-col>
			</a-row>
		</div>

		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="detail.terminalContractReceivedList"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="payAmount"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="collectionType"
					slot-scope="text"
				>
					{{ trans(text) }}
				</template>

				<template
					slot="currentContractClaimedAmount"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="canClaimAmount"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space>
						<a @click="jumpPage({ collectionNo: items.serialNo, type: 'detail' })">详情</a>

						<a
							v-if="items.dataSource == 2 && ['DOUBLE_SIGN_AUDITING_REJECT', 'EXECUTING'].includes(contractData.status)"
							@click="jumpPage({ collectionNo: items.serialNo, type: 'edit' })"
							>修改</a
						>

						<!-- <a
							v-if="items.dataSource == 2 && ['DOUBLE_SIGN_AUDITING_REJECT', 'EXECUTING'].includes(contractData.status)"
							@click="openDel(items)"
							>作废</a
						> -->
					</a-space>
				</template>
			</a-table>
		</div>
		<DelModal
			ref="delModal"
			@save="save"
			title="操作确认"
			tip="确认要作废该笔回款流水吗？"
		></DelModal>
	</div>
</template>

<script>
const columns = [
	{ title: '收款编号', dataIndex: 'serialNo' },
	{ title: '回款时间', dataIndex: 'payDate' },
	{ title: '回款金额（元）', dataIndex: 'payAmount', scopedSlots: { customRender: 'payAmount' } },
	{
		title: '认领至本合同金额(元)',
		dataIndex: 'currentContractClaimedAmount',
		scopedSlots: { customRender: 'currentContractClaimedAmount' }
	},
	{ title: '可以认领余额（元）', dataIndex: 'canClaimAmount', scopedSlots: { customRender: 'canClaimAmount' } },
	{ title: '回款方式', dataIndex: 'receiveCategory' },
	{ title: '认领状态', dataIndex: 'claimStatus' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
];
import DelModal from '../DelModal.vue';
import { getDownContractPayInfo } from '@/v2/center/trade/api/downcontract';
import { checkBusinessLineEnd, invalidCollectionFlow } from '@/v2/center/trade/api/collectionFlow';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	data() {
		return {
			columns,
			currentItem: {},
			collectionTypeList: filterCodeByKey('collectionTypeDict')
		};
	},
	props: {
		detail: {
			default: () => {
				return {};
			}
		},
		contractData: {
			default: () => {
				return {};
			}
		}
	},

	methods: {
		trans(value) {
			return this.collectionTypeList.find(el => (el.value = value)).text;
		},
		async jumpPage(data = {}) {
			//判断是否可修改
			if (data.type == 'edit') {
				let res = await checkBusinessLineEnd({
					collectionNo: data.collectionNo
				});
				if (res.success) {
					if (res.result || res.data) {
						this.$message.error('该流水关联有已完结的业务线，不允许修改！');
						return;
					}
				} else {
					return;
				}
			}
			let routerData = this.$router.resolve({
				path: '/center/collection/stream/add',
				query: {
					type: data.type,
					collectionNo: data.collectionNo,
					receiveSerialNo: data.collectionNo
				}
			});
			window.open(routerData.href, '_blank');
		},
		openDel(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		async save() {
			const params = {
				receiveSerialNo: this.currentItem.serialNo
			};
			const res = await invalidCollectionFlow(params);
			this.$message.success('操作成功');
			this.$refs.delModal.close();
			this.$emit('update');
		}
	},
	components: {
		DelModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 30px;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.mt32 {
	margin-top: 32px;
}

.num-box {
	margin-top: 20px;
	.ant-row-flex {
		// justify-content: space-between;
		.ant-col {
			height: 100px;
			width: 24%;
			background: #f0f8ff;
			border-radius: 6px;
			padding: 20px;
			margin-right: 20px;
			span {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 20px;
				line-height: 28px;
				color: rgba(0, 0, 0, 0.8);
			}
			p {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 14px;
				line-height: 20px;
				color: rgba(0, 0, 0, 0.4);
				margin-bottom: 11px;
			}
		}
		.ant-col:nth-child(2),
		.ant-col:nth-child(4) {
			background: #fff9e9;
		}
		.ant-col:nth-child(4) {
			margin-right: 0px;
		}
	}
}
/deep/ .ant-table-thead {
	background: #f3f5f6;
}
</style>
