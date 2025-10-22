<template>
	<div style="width: 100%">
		<List
			type="BUY"
			:columns="columns"
			@send="getList"
			ref="list"
			:loading="loading"
		>
			<template v-slot:titleAction>
				<div class="btn-box-title">
					<div
						class="btn"
						@click="createContract"
						v-auth="'steel:contract:buyContract:add'"
					>
						<AddIconSteel class="icon"/>
						<span>创建合同</span>
					</div>
					<div
						class="btn"
						@click="createSupplement"
						v-auth="'steel:contract:buyContract:additional'"
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
				<template
					v-if="items.status === CONSTANTSSTEELS.contractStatusDict.DRAFT && items.initiator == VUEX_ST_COMPANYSUER.companyUscc"
				>
					<a
						href="javascript:;"
						style="margin-left: 4px"
						v-auth="'steel:contract:buyContract:edit'"
						@click="editContract(items.id, items)"
						>修改</a
					>
					<a
						href="javascript:;"
						style="margin-left: 4px"
						v-auth="'steel:contract:buyContract:edit'"
						@click="deleteContract(items.id)"
						>取消</a
					>
				</template>
				<!-- 待签约状态下--盖章、详情 -->
				<template
					v-if="
						items.status === CONSTANTSSTEELS.contractStatusDict.TO_BE_CONFIRMED &&
						items.initiator != VUEX_ST_COMPANYSUER.companyUscc
					"
				>
					<a
						href="javascript:;"
						style="margin-left: 4px"
						v-auth="'steel:contract:buyContract:seal'"
						@click="confirmStamp(items)"
						>确认</a
					>
				</template>
				<!-- 草稿、待签约审批中、待确认、已完成、驳回状态下--详情 -->
				<a
					href="javascript:;"
					style="margin-left: 4px"
					v-auth="'steel:contract:buyContract:detail'"
					@click="detailContract(items)"
					>详情</a
				>
				<!-- 待签约状态下--盖章、详情 -->
				<template
					v-if="
						items.status === CONSTANTSSTEELS.contractStatusDict.TO_BE_SIGN_UP &&
						items.initiator == VUEX_ST_COMPANYSUER.companyUscc
					"
				>
					<a
						href="javascript:;"
						style="margin-left: 4px"
						v-auth="'steel:contract:buyContract:seal'"
						@click="goToStamp(items.id, items.contractNo)"
						>盖章</a
					>
				</template>
				<!-- 补录合同修改 -->
				<ActionButtons
					:items="items"
					@success="getList"
				></ActionButtons>
			</template>
		</List>
	</div>
</template>

<script>
import List from '../components/List';
import { API_SteelsContractDelete, getContractList } from '@/v2/center/steels/api/contract.js';
import ActionButtons from '../components/ActionButtons.vue';
// 钢材种类
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapMutations, mapGetters } from 'vuex';
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
		dataIndex: 'steelTypeDesc'
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		key: 'sellCompanyName',
		width: 150,
		sorter: true
	},
	{
		title: '合同数量（吨）',
		dataIndex: 'quantity',
		key: 'quantity',
		align: 'center',
		customRender: text => text || '-'
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
		title: '运输方式',
		dataIndex: 'transportModeDesc',
		key: 'transportModeDesc'
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
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		})
	},
	components: {
		ActionButtons,
		List,
		AddIconSteel
	},
	mounted() {
		this.getList({ pageNo: 1, pageSize: 10 });
	},
	methods: {
		async getList(obj) {
			const params = {
				...obj,
				contractType: 'BUY'
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
		// 创建合同
		createContract() {
			this.$router.push({
				path: '/center/steels/contract/buy/create'
			});
		},
		// 人工补录
		createSupplement() {
			this.$router.push('/center/steels/contract/buy/supplement');
		},
		// 修改合同
		editContract(id, item) {
			// 判断是否是补录
			if (item.generateWay == 'ARTIFICIAL_COLLECTION') {
				this.$router.push({
					path: '/center/steels/contract/buy/Supplement',
					query: {
						type: 'edit',
						contractId: id
					}
				});
				return;
			}
			this.$router.push({
				path: '/center/steels/contract/buy/create',
				query: {
					type: 'edit',
					contractId: id
				}
			});
		},
		// 合同详情
		detailContract({ id, steelType, generateWay }) {
			if (generateWay == 'ARTIFICIAL_COLLECTION') {
				this.$router.push({
					path: '/center/steels/contract/buy/Supplement',
					query: {
						type: 'detail',
						contractId: id
					}
				});
				return;
			}
			this.$router.push({
				path: '/center/steels/contract/buy/detail',
				query: {
					type: 'detail',
					contractId: id,
					flag: 'buy',
					steelType
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
					origin: 'buy'
				}
			});
		},
		// 确认合同盖章
		confirmStamp(items) {
			this.$router.push({
				path: '/center/steels/contract/sell/stamp',
				query: {
					id: items.id,
					contractNo: items.contractNo,
					origin: 'buy'
				}
			});
		},
		//取消合同
		deleteContract(id) {
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
							that.getList({ pageNo: 1 });
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
</style>
