<template>
	<div style="margin: 0 5px">
		<!-- 必须是上游合同补录 既采购合同补录 -->
		<template>
			<a
				href="javascript:;"
				class="btn"
				v-if="
					['IN_EXECUTION'].includes(items.status) && items.contractSignStatus == 'SINGLE_SIGN' && items.contractCategory == 'UP'
				"
				@click="goSupplement(items.id, items)"
				>上传双签合同</a
			>
		</template>
		<!-- 修改OA -->
		<a
			href="javascript:;"
			class="btn"
			v-if="
				['TO_BE_SIGN_UP', 'TO_BE_CONFIRMED', 'IN_EXECUTION'].includes(items.status) &&
				items.dockingOa == 1 &&
				items.initiator == VUEX_ST_COMPANYSUER.companyUscc
			"
			@click="goOaEdit(items)"
			>修改信息</a
		>
		<!-- 执行中的合同 且是代采 代采+仓押 仓押 业务 -->
		<template v-if="isCore">
			<a
				href="javascript:;"
				class="btn"
				v-if="['IN_EXECUTION'].includes(items.status) && arr.includes(items.businessType)"
				@click="overContract(items)"
				>合同完结</a
			>
			<!-- 执行中 代采 代采+仓押 仓押业务 必须是线上合同 -->
			<a
				href="javascript:;"
				class="btn"
				v-if="['IN_EXECUTION'].includes(items.status) && arr.includes(items.businessType)"
				@click="freeze(items, true)"
				>冻结</a
			>
			<a
				href="javascript:;"
				class="btn"
				v-if="['FREEZING'].includes(items.status) && arr.includes(items.businessType)"
				@click="freeze(items, false)"
				>启用</a
			>
		</template>
		<EditOAModal
			ref="editOaModal"
			@success="searchSubmit"
		></EditOAModal>
	</div>
</template>

<script>
import EditOAModal from './EditOAModal.vue';
import { freezeContract, completedContract } from '@/v2/center/steels/api/contract.js';
import { mapGetters } from 'vuex';
export default {
	props: {
		items: {
			default: {}
		}
	},
	data() {
		return {
			arr: [
				'WAREHOUSE_RECEIPTS_PLEDGE',
				'OTHER_MIDDLE',
				'SOURCING_AGENT',
				'SOURCING_AGENT_WAREHOUSE_PLEDGE',
				'ACCOUNT_RECEIVABLE_OTHER'
			]
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否是核心企业
		isCore() {
			return this.VUEX_ST_COMPANYSUER.companyUscc === this.items.initiator;
		}
		// items.generateWay == 'ARTIFICIAL_COLLECTION'
	},
	methods: {
		// 合同完结
		overContract(item) {
			const that = this;
			that.$confirm({
				centered: true,
				title: '确认要完结该合同吗？',
				okText: '确定',
				cancelText: '取消',
				async onOk() {
					const params = {
						contractId: item.id
					};
					await completedContract(params);
					that.$message.success('操作成功');
					that.$emit('success');
				},
				onCancel() {}
			});
		},
		// 合同冻结和启用
		freeze(item, isFreeze) {
			const that = this;
			const title = isFreeze ? '合同冻结后，将不能发起后续流程，确定冻结该合同吗？' : '确认要启用该合同吗？';
			that.$confirm({
				centered: true,
				title,
				okText: '确定',
				cancelText: '取消',
				async onOk() {
					const params = {
						contractId: item.id,
						isFreeze
					};
					await freezeContract(params);
					that.$message.success('操作成功');
					that.$emit('success');
				},
				onCancel() {}
			});
		},
		goOaEdit(item) {
			this.$refs.editOaModal.show(item);
		},
		searchSubmit() {
			this.$emit('success');
		},
		// 上传双签合同
		goSupplement(id, item) {
			this.$router.push({
				path: '/center/steels/contract/buy/Supplement',
				query: {
					type: 'edit',
					contractId: id,
					handleType: '1'
				}
			});
		}
	},
	components: {
		EditOAModal
	}
};
</script>

<style scoped lang="less">
.btn {
	margin-left: 4px;
}
</style>
