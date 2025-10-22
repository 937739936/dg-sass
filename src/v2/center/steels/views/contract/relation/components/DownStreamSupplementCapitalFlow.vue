<template>
	<div>
		<a-tabs
			:default-active-key="cashTabIndex"
			@change="tabChange"
		>
			<a-tab-pane
				key="0"
				tab="回款数据"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="columns"
						:data-source="receivableList"
						rowKey="id"
						:scroll="{ x: true }"
						style="width: 100%"
					>
						<span
							slot="payAmount"
							slot-scope="text"
						>
							{{ text ? money(text, 2) : text }}</span
						>
						<span
							slot="claimedAmount"
							slot-scope="text"
						>
							{{ text ? money(text, 2) : text }}</span
						>
						<span
							slot="canClaimAmount"
							slot-scope="text"
						>
							{{ text ? money(text, 2) : text }}</span
						>
						<div
							slot="action"
							slot-scope="record"
							@click="onPageState"
						>
							<a @click="goToDetail('no', record)">查看</a>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="认领明细"
			>
				<div style="width: 100%">
					<p style="margin-bottom: 10px; font-weight: bold">线上业务回款</p>
					<a-table
						:pagination="false"
						:columns="financingColumns"
						:data-source="platformClaimList"
						rowKey="index"
						:scroll="{ x: true }"
						style="width: 100%"
					>
						<div
							slot="repayAmount"
							slot-scope="repayAmount"
						>
							{{ repayAmount ? money(repayAmount, 2) : repayAmount }}元
						</div>
						<div
							slot="action"
							slot-scope="record"
							@click="onPageState"
						>
							<a @click="goToDetail('yes', record)">查看</a>
						</div>
					</a-table>

					<p
						style="margin-bottom: 10px; font-weight: bold"
						v-if="false"
					>
						非线上业务回款
					</p>
					<a-table
						:pagination="false"
						v-if="false"
						:columns="noFinancingColumns"
						:data-source="nonPlatformClaimList"
						rowKey="index"
						:scroll="{ x: true }"
						style="width: 100%; margin-top: 30px"
						class="unFinanceTable"
					>
						<div
							slot="unFinanceTotalAmount"
							slot-scope="unFinanceTotalAmount"
						>
							{{ unFinanceTotalAmount ? money(unFinanceTotalAmount, 2) : unFinanceTotalAmount }}元
						</div>
						<div
							slot="action"
							slot-scope="record"
							@click="onPageState"
						>
							<a
								href="javascript:;"
								@click="goToDetail('no', record)"
								>查看</a
							>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
const columns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '回款时间', dataIndex: 'payDate' },
	{ title: '认领状态', dataIndex: 'claimStatus' },
	{ title: '回款金额(元)', dataIndex: 'payAmount', scopedSlots: { customRender: 'payAmount' } },
	{ title: '已认领金额', dataIndex: 'claimedAmount', scopedSlots: { customRender: 'claimedAmount' } },
	{ title: '可认领金额', dataIndex: 'canClaimAmount', scopedSlots: { customRender: 'canClaimAmount' } },
	{ title: '回款方式', dataIndex: 'receiveCategory', align: 'center' },
	{ title: '操作', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
];
const financingColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		customRender(t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '采销关联编号', dataIndex: 'businessLineNo', key: 'businessLineNo' },
	{ title: '上游企业名称', dataIndex: 'upstreamSellerCompany', key: 'upstreamSellerCompany' },
	{ title: '认领金额(元)', dataIndex: 'repayAmount', key: 'repayAmount', scopedSlots: { customRender: 'repayAmount' } },
	{ title: '认领时间', dataIndex: 'time', key: 'time' },
	{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
];
const noFinancingColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		customRender(t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '认领金额(元)', dataIndex: 'repayAmount', key: 'repayAmount', scopedSlots: { customRender: 'repayAmount' } },
	{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
];
import { mapMutations, mapGetters } from 'vuex';
export default {
	name: 'DownStreamCapitalFlow',
	data() {
		return {
			columns,
			financingColumns,
			noFinancingColumns,
			financeTotalAmount: '', // 线上业务回款金额
			noFinancingData: [],
			receivableList: '',
			claimRecordData: null,
			businessLineType: '',
			pagination: {
				type: 'contractCash',
				total: 0, // 总条数
				pageNo: 1
			},
			isZYYH: true, // 回款账号是否是中原银行
			showFlag: false, // 用户是下游负责人或管理员且状态未完结未发起审核
			terminalModel: '', // 下游企业回款类型 0-手动录入；1-SAP同步；2-银企直连 4是从sap同步，但回款是手动添加
			cashTabIndex: this.$route.query.cashTabIndex, // 手动模式下回款认领tabIndex
			nonPlatformClaimList: [],
			platformClaimList: []
		};
	},
	props: ['contractData'],
	watch: {
		contractData: {
			handler(data) {
				if (!data.receivable) return;
				this.receivableList = data.receivable?.receivableList;
				this.platformClaimList = data.receivable?.platformClaimList;
				this.nonPlatformClaimList = data.receivable.nonPlatformClaimList;
			},
			deep: true,
			immediate: true
		}

		// : function(data) {
		//   this.receivableList = data.receivable.receivableList
		//   this.platformClaimList = data.receivable.platformClaimList
		//   this.nonPlatformClaimList = data.receivable.nonPlatformClaimList
		// }
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		})
	},
	created() {
		// this.businessLineType = this.$route.query.businessLineType;
	},
	methods: {
		...mapMutations({
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		onPageState() {
			// 点击操作中的按钮，保存分页状态
			this.VUEX_setListPamars(this.pagination);
		},
		goToDetail(flag, data) {
			let path = '/center/steels/funds/collection/claimDetail';
			if (data.dataSource == 'CCSOA') {
				path = '/center/steels/funds/collection/oaClaimDetail';
			}
			// 查看认领回款明细
			let temp = {
				path,
				query: {
					type: 'detail',
					id: data.id,
					collectionType: data.collectionType
				}
			};
			this.$router.push(temp);
		},
		money(s, n) {
			// 金额每3位用逗号隔开，小数点后保留n位，s代表金额，n表示小数点后位置
			n = n > 0 && n <= 20 ? n : 2;
			s = `${parseFloat(`${s}`.replace(/[^\d\.-]/g, '')).toFixed(n)}`;
			const l = s.split('.')[0].split('').reverse();
			const r = s.split('.')[1];
			let t = '';
			for (let i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
			}
			return `${t.split('').reverse().join('')}.${r}`;
		},
		tabChange(value) {
			// 手动模式下回款认领tab切换
			const path = '/center/steels/relation/detail';
			this.$router.push({
				path,
				query: {
					...this.$route.query,
					cashTabIndex: value
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
			margin-right: 8px;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
::v-deep.unFinanceTable .ant-table-thead > tr:first-child > th:first-child {
	font-weight: bold;
	color: rgba(0, 0, 0, 0.65);
}
</style>
