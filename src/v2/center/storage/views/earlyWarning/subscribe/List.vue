<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>预警管理</span
				>
				<a-button
					type="primary"
					v-auth="'warehouse:warnManage:add'"
					@click="add"
				>
					新增订阅
				</a-button>
			</div>
			<a-alert
				class="a-alert"
				type="info"
				show-icon
			>
				<template slot="message">
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col>
							尊敬的用户，由于您的仓储信息涉及您的商业机密，您申请向第三方进行信息推送告知服务意味着您同意并授权{{ systemConfig.name }}将您的商业信息以短信方式告知第三方，请您慎重考虑。如果您仍然选择项该服务，由此导致您的商业信息泄露{{ systemConfig.name }}不承担任何责任。
						</a-col>
					</a-row>
				</template>
			</a-alert>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.mobilePhone"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<span
						slot="receiverName"
						slot-scope="receiverName"
					>
						{{ receiverName || '-' }}
					</span>
					<div
						slot="action"
						slot-scope="action, item"
						@click="del(item.mobilePhone)"
					>
						<a
							v-auth="'warehouse:warnManage:deleted'"
							style="margin-right: 10px"
							>删除</a
						>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<AddSubscribe
			ref="addSubscribe"
			@addSuccess="getList"
		></AddSubscribe>
	</div>
</template>

<script lang="jsx">
import { API_GrainSituationEarlyWarningSubscriptionList, API_GrainEarlyWarningDeleteSubscription } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import AddSubscribe from './components/AddSubscribe.vue';
import { getPopupContainer } from '@/v2/utils/factory';
import systemConfig from '@/v2/config/common';

const columns = [
	{
		title: '订阅时间',
		fixed: 'left',
		dataIndex: 'subscriptionTime',
		width: 200
	},
	{
		title: '手机号码',
		dataIndex: 'mobilePhone',
		width: 135
	},
	{
		title: '订阅预警类型',
		dataIndex: 'subscriptionType',
		width: 100
	},
	{
		key: 'action',
		title: '操作',
		width: 100,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

const searchList = [
	{
		decorator: ['subscriptionTime'],
		addonBeforeTitle: '订阅日期',
		type: 'rangePicker',
		realKey: ['subscriptionStartTime', 'subscriptionEndTime']
	},
	{
		decorator: ['mobilePhone'],
		addonBeforeTitle: '手机号码',
		type: 'input',
		placeholder: '请输入手机号码'
	}
];
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	name: 'EarlyWarningSubscribe',
	components: {
		iPagination,
		AddSubscribe
	},
	data() {
		return {
			columns,
			getPopupContainer,
			loading: false,
			url: {
				list: API_GrainSituationEarlyWarningSubscriptionList
			},
			searchList,
			systemConfig
		};
	},
	mounted() {
		this.getList();
	},

	methods: {
		add() {
			this.$refs.addSubscribe.showModal();
		},
		del(mobilePhone) {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确定删除该数据？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.toDel(mobilePhone);
				},
				onCancel() {}
			});
		},

		toDel(mobilePhone) {
			API_GrainEarlyWarningDeleteSubscription(mobilePhone).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('删除成功');
						this.getList();
					} else {
						this.$message.error('删除失败');
					}
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.a-alert {
	margin: 24px 0;
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid @primary-color;
	border-radius: 4px;
}
::v-deep .ant-alert-info .ant-alert-icon {
	color: @primary-color;
}
</style>
