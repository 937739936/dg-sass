<template>
	<div>
		<a-form
			style="margin-top: 15px"
			:form="form"
			v-bind="formLayout"
			layout="inline"
		>
			<a-row>
				<a-col :span="colSpan">
					<a-form-item
						label="工作人员"
						:colon="false"
					>
						<a-input
							v-model="params.workername"
							placeholder="请输入"
							:maxLength="20"
						/>
					</a-form-item>
				</a-col>

				<a-col :span="colSpan">
					<a-form-item
						label="钥匙名称"
						:colon="false"
					>
						<a-input
							v-model="params.keyname"
							placeholder="请输入"
							:maxLength="15"
						/>
					</a-form-item>
				</a-col>

				<a-col :span="colSpan">
					<a-form-item
						label="钥匙号码"
						:colon="false"
					>
						<a-input
							v-model="params.keyno"
							placeholder="请输入"
							:maxLength="12"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="操作时间"
						:colon="false"
					>
						<a-range-picker
							v-model="date"
							@change="formatDate"
							:disabled-date="disabledDate"
						/>
					</a-form-item>
				</a-col>

				<a-col :span="colSpan">
					<a-form-item
						label=" "
						:colon="false"
					>
						<a-button
							@click="search"
							type="primary"
							html-type="submit"
							class="search-btn"
						>
							查询
						</a-button>
						<a-button
							html-type="reset"
							@click="reset"
						>
							重置
						</a-button>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<a-tabs
			default-active-key="-1"
			@change="callback"
			style="width: 100%; margin: 0 10px"
		>
			<a-tab-pane
				v-for="item in tabs"
				:key="item.value"
				:tab="item.label"
			>
				<div
					class="record-list"
					style="width: 100%"
				>
					<a-table
						:columns="columns"
						:rowKey="record => record.id"
						:dataSource="dataSource"
						:pagination="false"
						:loading="loading"
						:scroll="{ x: true }"
					>
					</a-table>
					<i-pagination
						:pagination="pagination"
						@change="getList"
					/>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import { API_GetKeylostdatasByBatchId } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/v2/utils/factory';
import moment from 'moment';

const columns = [
	{ title: '锁具名称', dataIndex: 'lockname' },
	{ title: '钥匙名称', dataIndex: 'keyname' },
	{ title: '钥匙号码', dataIndex: 'keyno' },
	{ title: '库点名称', dataIndex: 'deptname' },
	{ title: '工作人员', dataIndex: 'workername' },
	{
		title: '操作类型',
		dataIndex: 'opttype',
		customRender: text => ['开锁', '关锁'][text]
	},
	{ title: '操作时间', dataIndex: 'opttime' }
];
export default {
	name: 'SwitchLockRecord',

	components: {
		iPagination
	},

	data() {
		return {
			tabs: [
				{ label: '全部', value: '-1' },
				{ label: '开锁', value: '0' },
				{ label: '关锁', value: '1' }
			],
			columns,
			getPopupContainer,
			date: [],
			earlyWarningType: [],
			formLayout: {
				labelCol: { span: 7 },
				wrapperCol: { span: 17 }
			},
			colSpan: 8,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {},
			loading: false,
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	mounted() {
		this.getList();
	},

	methods: {
		disabledDate(current) {
			return current > moment().endOf('day');
		},
		formatDate(value, dateString) {
			this.params.begintime = dateString[0];
			this.params.endtime = dateString[1];
		},
		callback(key) {
			// tabs切换
			this.params.opttype = key;
			this.getList();
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.params.batchId = this.$route.query.batchId;
			API_GetKeylostdatasByBatchId(this.params).then(res => {
				if (res.success) {
					this.dataSource = res.data.content;
					this.pagination.total = res.data.totalcount;
				}
			});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.date = [];
			this.params = {};
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep {
	.ant-card-body {
		padding-top: 0px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-form-item {
		display: block;
		margin-bottom: 14px;
	}
	.ant-form-item-label {
		padding-right: 5px;
	}
	.ant-calendar-picker {
		width: 100%;
	}
}
.search-btn {
	margin-right: 16px;
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
</style>
