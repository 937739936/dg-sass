<template>
	<div style="width: 100%">
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			ref="SlFormNew"
		></SlFormNew>
		<div class="top-nav">
			<div
				:class="{ active: item.status == status, 'nav-item': true }"
				@click="changeTab(item)"
				v-for="(item, index) in tabList"
				:key="index"
			>
				{{ item.name }} ({{ item.count }})
			</div>
		</div>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				class="new-table"
				:pagination="false"
				:columns="columns"
				:data-source="dataSource"
				:scroll="{ x: true }"
				rowKey="serialNo"
				:loading="loading"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<template v-if="record.status == '5' && VUEX_ST_COMPANYSUER.companyUscc == record.issuerUscc">
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter-manage-list:seal'"
								@click="$router.push('/center/counterfoil/open/sign?id=' + record.id)"
								>盖章</a
							>
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter-manage-list:cancel'"
								@click="goZuofei(record)"
								>作废</a
							>
						</template>
						<template v-if="record.status == '6' && VUEX_ST_COMPANYSUER.companyUscc == record.receiverUscc">
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter-manage-list:check'"
								@click="$router.push('/center/counterfoil/audit/audit?id=' + record.id)"
								>审核</a
							>
						</template>
						<template v-if="record.status == '7' && VUEX_ST_COMPANYSUER.companyUscc == record.receiverUscc">
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter-manage-list:seal'"
								@click="$router.push('/center/counterfoil/audit/sign?id=' + record.id)"
								>盖章</a
							>
						</template>
						<template v-if="record.status == '1' && VUEX_ST_COMPANYSUER.companyUscc == record.receiverUscc">
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter-manage-list:fin'"
								@click="$router.push('/center/financing/financingCounterfoilApply?id=' + record.id)"
								>发起融资</a
							>
						</template>
						<a
							href="javascript:;"
							v-auth="'shanmeiBillCenter-manage-list:detail'"
							@click="$router.push('/center/counterfoil/record/yunDetail?id=' + record.id)"
							>查看</a
						>
					</a-space>
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
		<a-modal
			v-model="zuofeiVisible"
			title="作废原因"
			:width="500"
			@ok="submitZ"
		>
			<div
				@click.stop
				style="background: #fff"
				@move.stop
			>
				<a-row> 请输入作废原因： </a-row>
				<a-row>
					<a-textarea
						style="margin: 0 auto; margin-top: 20px"
						:maxLength="100"
						placeholder="作废原因"
						v-model="reasonName"
					></a-textarea>
				</a-row>
			</div>
		</a-modal>
	</div>
</template>
<script>
const columns = [
	{ title: '云票编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '云票金额（元）', dataIndex: 'billAmount', key: 'billAmount' },
	{ title: '开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{ title: '转让方', dataIndex: 'issuerName1', key: 'issuerName1', customRender: (i, record) => record.issuerName },
	{ title: '接收方', dataIndex: 'receiverName', key: 'receiverName' },
	{ title: '开立日期', dataIndex: 'issueDate', key: 'issueDate' },
	{ title: '承诺付款日', dataIndex: 'acceptanceDate', key: 'acceptanceDate' },
	{ title: '云票状态', dataIndex: 'statusDesc', key: 'statusDesc' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '云票编号',
		type: 'input',
		placeholder: '请输入云票编号'
	},
	{
		decorator: ['issuerName1'],
		addonBeforeTitle: '开立方',
		type: 'input',
		placeholder: '请输入开立方'
	},
	{
		decorator: ['issuerName2'],
		addonBeforeTitle: '转让方',
		type: 'input',
		placeholder: '请输入转让方'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '接收方',
		type: 'input',
		placeholder: '请输入接收方'
	},
	{
		decorator: ['issueDate'],
		addonBeforeTitle: '开立日期',
		type: 'rangePicker',
		realKey: ['issueDateStart', 'issueDateEnd']
	},
	{
		decorator: ['acceptanceDate'],
		addonBeforeTitle: '承诺付款日',
		type: 'rangePicker',
		realKey: ['acceptanceDateStart', 'acceptanceDateEnd']
	}
];
import {
	API_GetCounterfoilYunList,
	API_GetCounterfoilYunListCount,
	API_GetCounterfoilYunZF
} from '@/v2/center/counterfoil/api/index.js';

import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/untils/factory.js';
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
//     票据状态枚举：
// ISSUED("1", "已出票"),
// RECEIVED("2", "已签收"),
// DISCOUNTED("3", "已贴现"),
// REPAID("4", "已还款"),

// TOBE_SIGN("5", "待签约"),
// TOBE_RECEIVED("6", "待签收"),
// TOBE_RECEIVE_SIGN("7", "待签收方盖章"),
// REJECT("8", "已驳回"),
// DOING("9", "融资中"),
// CANCEL("10", "已作废"),
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			zuofeiVisible: false,
			reasonName: '',
			tabList: [
				{
					name: '全部',
					status: '',
					count: ''
				},
				{
					name: '待开立方签章',
					status: '5',
					count: ''
				},
				{
					name: '待签收',
					status: '6,7',
					count: ''
				},
				{
					name: '已签收',
					status: '1',
					count: ''
				},
				{
					name: '融资中',
					status: '9',
					count: ''
				},
				{
					name: '已贴现',
					status: '3',
					count: ''
				},
				{
					name: '已还款',
					status: '4',
					count: ''
				},
				{
					name: '已驳回',
					status: '8',
					count: ''
				}
			],
			columns,
			searchList,
			selfLoad: true,
			status: '',
			url: {
				list: API_GetCounterfoilYunList
			},
			defaultParams: {
				status: ''
			}
		};
	},
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.initData();
	},
	methods: {
		async initData() {
			return new Promise(async resolve => {
				await this.getStatusCount();
				this.getList();
				resolve(true);
			});
		},
		handleChange(data) {
			this.changeSearch(data);
		},
		changeTab(item) {
			this.status = item.status;
			this.defaultParams.status = item.status;
			this.getList();
		},
		getStatusCount() {
			API_GetCounterfoilYunListCount({ ...this.params, applyTime2: null, applyTime1: null, status: null }).then(res => {
				this.tabList[0].count = res.data.all;
				this.tabList[1].count = res.data.toBeSign;
				this.tabList[2].count = res.data.toBeReceivedAndToBeReceiveSign;
				this.tabList[3].count = res.data.issued;
				this.tabList[4].count = res.data.doing;
				this.tabList[5].count = res.data.discounted;
				this.tabList[6].count = res.data.repaid;
				this.tabList[7].count = res.data.reject;
			});
		},
		goZuofei(item) {
			this.reasonName = '';
			this.zuofeiVisible = true;
			this.currentId = item.id;
		},
		submitZ() {
			if (!this.reasonName) {
				this.$message.error('请输入作废原因');
				return;
			}
			this.zuofeiVisible = false;
			this.$confirm({
				centered: true,
				title: '确定作废',
				okText: '确定',
				content: '系统将对该比数据进行作废，确定要进行作废么?',
				cancelText: '取消',
				onOk: () => {
					API_GetCounterfoilYunZF({
						cancelReason: this.reasonName,
						id: this.currentId
					}).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('作废成功');
								this.getList();
							}
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
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.top-nav {
	width: 100%;
	display: flex;
	background-color: #fff;
	height: 50px;
	justify-content: flex-start;
	margin-bottom: -10px;
	margin-top: 10px;
	font-size: 14px;
	border-bottom: 1px solid #f0f0f0;
}

.nav-item {
	text-align: center;
	line-height: 50px;
	position: relative;
	cursor: pointer;
	font-family: PingFang SC;
	color: rgba(0, 0, 0, 0.4);
	margin-right: 40px;
	&.active {
		color: @primary-color;
		font-family: PingFangSC-Medium;
		font-weight: 500;
	}
	&.active:after {
		content: '';
		width: 100%;
		height: 2px;
		position: absolute;
		background-color: @primary-color;
		bottom: 0;
		left: 0;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.s-card-title {
	margin-top: 10px;
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
::v-deep.ant-space {
	.ant-space-item:first-child {
		margin-left: 0 !important;
	}
}
</style>
