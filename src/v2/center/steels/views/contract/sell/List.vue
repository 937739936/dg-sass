<template>
	<div style="width: 100%">
		<List
			type="SELL"
			:columns="columns"
			@send="getList"
			ref="list"
			:loading="loading"
		>
			<template v-slot:titleAction>
				<div class="btn-box-title">
					<div
						class="btn"
						@click="contractSell"
						v-auth="'steel:contract:sellContract:addOnlineContract'"
					>
						<AddIconSteel class="icon"/>
						<span>创建合同</span>
					</div>
					<div
						class="btn"
						@click="contractSupplement"
						v-auth="'steel:contract:sellContract:add'"
						v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'"
					>
						<AddIconSteel class="icon"/>
						<span>合同补录</span>
					</div>
				</div>
			</template>
			<template
				slot="action"
				slot-scope="{ items }"
			>
				<!-- 区分销售合同  和 人工补录合同 -->
				<div v-if="items.generateWay == 'ARTIFICIAL_COLLECTION'">
					<!-- 发起方 -->
					<template v-if="items.initiator == VUEX_ST_COMPANYSUER.companyUscc">
						<!-- 草稿状态下--修改、取消、详情 -->
						<template v-if="items.status === CONSTANTSSTEELS.contractStatusDict.DRAFT">
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:edit'"
								@click="editContract(items.id, items)"
								>修改</a
							>
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:detail'"
								@click="detailContract(items.id, items)"
								>详情</a
							>
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:cancel'"
								@click="deleteContract(items.id, items)"
								>取消</a
							>
						</template>
						<!-- 执行中&补录--修改 -->
						<template
							v-if="
								items.status === CONSTANTSSTEELS.contractStatusDict.IN_EXECUTION &&
								items.generateWay === 'ARTIFICIAL_COLLECTION' &&
								items.initiator == VUEX_ST_COMPANYSUER.companyUscc
							"
						>
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:edit'"
								@click="editInExecutionContract(items.id)"
								>修改</a
							>
						</template>
						<!-- 执行中状态下--详情 -->
						<template v-if="items.status === CONSTANTSSTEELS.contractStatusDict.IN_EXECUTION">
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:detail'"
								@click="detailContract(items.id, items)"
								>详情</a
							>
							<a
								href="javascript:;"
								style="margin-left: 8px"
								v-auth="'steel:contract:sellContract:detail'"
								v-if="items.contractSignStatus === 'SINGLE_SIGN'"
								@click="setDoubleSignContract(items.id)"
								>上传双签合同</a
							>
						</template>
					</template>
					<!-- 接收方 -->
					<template v-else>
						<!-- 待确认状态下--确认、详情 -->
						<template v-if="items.status === CONSTANTSSTEELS.contractStatusDict.TO_BE_CONFIRMED">
							<a
								href="javascript:;"
								class="ml4"
								v-auth="'steel:contract:sellContract:confirm'"
								@click="confirmStamp(items)"
								>确认</a
							>
						</template>
						<a
							href="javascript:;"
							class="ml4"
							v-auth="'steel:contract:sellContract:detail'"
							@click="detailContract(items.id, items)"
							>详情</a
						>
					</template>
				</div>
				<div v-else>
					<a
						href="javascript:;"
						class="ml4"
						v-auth="'steel:contract:sellContract:detail'"
						@click="detailContract(items.id, items)"
						>详情</a
					>
					<!-- 判断核心企业  -->
					<template
						v-if="items.status === CONSTANTSSTEELS.contractStatusDict.DRAFT && items.initiator == VUEX_ST_COMPANYSUER.companyUscc"
					>
						<a
							href="javascript:;"
							class="ml4"
							v-auth="'steel:contract:sellContract:edit'"
							@click="editContract(items.id, items)"
							>修改</a
						>
						<a
							href="javascript:;"
							class="ml4"
							v-auth="'steel:contract:sellContract:cancel'"
							@click="deleteContract2(items.id, items)"
							>取消</a
						>
					</template>
					<template
						v-if="
							items.status === CONSTANTSSTEELS.contractStatusDict.TO_BE_SIGN_UP &&
							items.initiator == VUEX_ST_COMPANYSUER.companyUscc
						"
					>
						<a
							href="javascript:;"
							class="ml4"
							v-auth="'steel:contract:buyContract:seal'"
							@click="goToStamp(items.id, items.contractNo)"
							>盖章</a
						>
					</template>
					<template
						v-if="
							items.status === CONSTANTSSTEELS.contractStatusDict.TO_BE_CONFIRMED &&
							items.initiator != VUEX_ST_COMPANYSUER.companyUscc
						"
					>
						<a
							href="javascript:;"
							class="ml4"
							v-auth="'steel:contract:buyContract:seal'"
							@click="confirmStamp(items)"
							>确认</a
						>
					</template>
				</div>
				<ActionButtons
					:items="items"
					@success="getList"
				></ActionButtons>
			</template>
		</List>
	</div>
</template>

<script>
import {
	API_SteelsAdditionalContractDelete,
	API_SteelsContractDelete,
	getContractList
} from '@/v2/center/steels/api/contract.js';
import { mapMutations, mapGetters } from 'vuex';
import List from '../components/List.vue';
import ActionButtons from '../components/ActionButtons.vue';
import { AddIconSteel } from '@sub/components/svg'
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		key: 'statusDesc'
	},
	{
		title: '合同创建人',
		dataIndex: 'createdName'
	},
	{
		title: '钢材种类',
		dataIndex: 'steelTypeDesc',
		width: 200
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName',
		key: 'buyCompanyName',
		width: 150,
		sorter: true
	},
	{
		title: '合同数量（吨）',
		dataIndex: 'quantity',
		key: 'quantity',
		align: 'center',
		customRender: (text, record) => record.quantity || record.quantity || '-'
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		key: 'transportModeDesc'
	},
	{
		title: '合同生成方式',
		dataIndex: 'generateWayDesc',
		key: 'generateWayDesc'
	},
	{
		title: '业务类型',
		dataIndex: 'businessTypeDesc',
		key: 'businessTypeDesc'
	},
	{
		title: '合同期限',
		dataIndex: 'deliveryDateEnd',
		key: 'deliveryDateEnd',
		scopedSlots: {
			customRender: 'deliveryDateEnd'
		}
	},
	{
		title: '创建时间',
		dataIndex: 'createdDate',
		key: 'createdDate'
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: {
			customRender: 'action'
		}
	}
];
export default {
	data() {
		return {
			columns: [...columns],
			loading: false
		};
	},
	components: {
		ActionButtons,
		List,
		AddIconSteel
	},
	created() {
		this.getList({ pageNo: 1, pageSize: 10 });
	},
	computed: {
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreAndGeneral() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY' || this.VUEX_ST_COMPANYSUER.companyType == 'TRADER';
		}
	},
	methods: {
		deleteContract(id) {
			const that = this;
			that.$confirm({
				centered: true,
				title: '确认取消该合同吗?',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_SteelsAdditionalContractDelete(id).then(res => {
						if (res.success) {
							that.$message.success('取消成功');
							that.getList();
						}
					});
				},
				onCancel() {}
			});
		},
		//取消合同
		deleteContract2(id) {
			const that = this;
			that.$confirm({
				centered: true,
				title: '确认取消该合同吗?',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_SteelsContractDelete(id).then(res => {
						if (res.success) {
							that.$message.success('取消成功');
							that.getList();
						}
					});
				},
				onCancel() {}
			});
		},
		async getList(obj) {
			const params = {
				...obj,
				contractType: 'SELL'
			};
			if (!params.pageSize) {
				params.pageSize = this.pageSize;
			}
			if (!params.pageNo) {
				params.pageNo = 1;
			}
			this.loading = true;
			try {
				const res = await getContractList(params);
				this.$nextTick(() => {
					const pagination = {
						pageNo: params.pageNo || 1,
						total: res.data.total
					};
					this.$refs.list && this.$refs.list.init(res.data.records, pagination);
				});
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		// 合同补录
		contractSupplement() {
			this.$router.push({
				path: '/center/steels/contract/sell/supplement',
				query: {
					type: 'add'
				}
			});
			// this.$router.push('/center/steels/contract/sell/supplement?type=add')
		},
		// 创建销售合同
		contractSell() {
			this.$router.push({
				path: '/center/steels/contract/sell/create',
				query: {
					type: 'add'
				}
			});
		},
		// 修改合同合同补录
		editContract(id, item) {
			if (item.generateWay == 'SYSTEM_COLLECTION') {
				this.$router.push({
					path: '/center/steels/contract/sell/create',
					query: {
						type: 'edit',
						contractId: id
					}
				});
			} else {
				this.$router.push({
					path: '/center/steels/contract/sell/supplement',
					query: {
						type: 'edit',
						contractId: id
					}
				});
			}
		},
		// 修改执行中合同合同补录
		editInExecutionContract(id) {
			this.$router.push({
				path: '/center/steels/contract/sell/supplement',
				query: {
					type: 'in_execution',
					contractId: id
				}
			});
		},
		// 上传双签合同
		setDoubleSignContract(id) {
			this.$router.push({
				path: '/center/steels/contract/sell/supplement',
				query: {
					type: 'edit',
					contractId: id,
					doubleSign: true
				}
			});
		},
		// 合同补录详情
		detailContract(id, item) {
			if (item.generateWay == 'SYSTEM_COLLECTION') {
				this.$router.push({
					path: '/center/steels/contract/buy/detail',
					query: {
						type: 'detail',
						contractId: id,
						flag: 'sell'
					}
				});
			} else {
				this.$router.push({
					path: '/center/steels/contract/sell/supplement',
					query: {
						type: 'detail',
						contractId: id
					}
				});
			}
		},
		// 确认合同盖章
		confirmStamp(items) {
			this.$router.push({
				path: '/center/steels/contract/sell/stamp',
				query: {
					id: items.id,
					contractNo: items.contractNo,
					origin: 'sell'
				}
			});
		},
		// 合同盖章
		goToStamp(id, contractNo) {
			this.$router.push({
				path: '/center/steels/contract/buy/stamp',
				query: {
					id: id,
					contractNo: contractNo,
					origin: 'sell'
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.btn-box-title {
	display: flex;
	align-items: center;
	.btn {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		display: flex;
		justify-content: center;
		align-items: center;
		color: @primary-color;
		font-size: 14px;
		margin-left: 20px;
		font-weight: 400;
		cursor: pointer;
		font-weight: 600;
	}
}
.icon,
.icon2 {
	width: 18px;
	vertical-align: middle;
	margin-right: 15px;
}
.ml4 {
	margin-left: 4px;
}
</style>
