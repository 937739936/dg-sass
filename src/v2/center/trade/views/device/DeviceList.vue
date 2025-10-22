<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>我的设备</span
			>
			<a-space
				slot="extra"
				:size="16"
			>
				<a-button
					v-auth="'dgChain:myDevice:myDevice:export'"
					@click="exportFile('我的设备.xls')"
					>导出设备</a-button
				>
				<a-button
					type="primary"
					v-auth="'dgChain:myDevice:myDevice:add'"
					@click="add"
					>新增设备</a-button
				>
			</a-space>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="deviceSerial"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="deviceStatus"
						slot-scope="text, items"
					>
						<span :class="'status ' + items.deviceStatusEnum">{{ text }}</span>
					</template>
					<template
						slot="active"
						slot-scope="text, items"
					>
						<a
							@click="detail(items)"
							v-auth="'dgChain:myDevice:myDevice:detail'"
							>详情</a
						>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					@change="getList"
					v-show="pageSize < pagination.total"
				/>
			</div>
		</a-card>
		<DeviceModal
			ref="DeviceModal"
			@confirm="getList"
		/>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_DEVICELIST, API_DEVICEEXPORT } from '@/v2/center/trade/api/device';
import DeviceModal from './components/DeviceModal.vue';
import { mapGetters } from 'vuex';

const searchList = [
	{
		decorator: ['deviceName'],
		addonBeforeTitle: '设备名称',
		type: 'input',
		placeholder: '请输入设备名称'
	},
	{
		decorator: ['deviceSerial'],
		addonBeforeTitle: '序列号',
		type: 'input',
		placeholder: '请输入序列号'
	},
	{
		decorator: ['deviceStatus'],
		addonBeforeTitle: '状态',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: [
			{
				value: 'ONLINE',
				label: '在线'
			},
			{
				value: 'OFFLINE',
				label: '离线'
			}
		]
	},
	{
		decorator: ['deviceModel'],
		addonBeforeTitle: '设备型号',
		type: 'input',
		placeholder: '请输入设备型号'
	}
];
const columns = [
	{ title: '序列号', dataIndex: 'deviceSerial' },
	{ title: '设备名称', dataIndex: 'deviceName' },
	{
		title: '设备状态',
		dataIndex: 'deviceStatus',
		scopedSlots: { customRender: 'deviceStatus' }
	},
	{ title: '设备型号', dataIndex: 'deviceModel' },
	{
		title: '操作',
		dataIndex: 'active',
		scopedSlots: { customRender: 'active' }
	}
];

export default {
	mixins: [ListMixin],
	components: {
		DeviceModal
	},
	data() {
		return {
			columns,
			url: {
				list: API_DEVICELIST,
				export: API_DEVICEEXPORT
			},
			searchList,
			dataSource: []
		};
	},
	created() {},
	mounted() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
	},
	methods: {
		handleChange(data) {
			this.changeSearch(data);
		},
		//新增
		add() {
			this.$refs.DeviceModal.show('add');
		},
		//详情
		detail(item) {
			this.$refs.DeviceModal.show('detail', item.deviceSerial);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.new-table {
		::v-deep .ant-table-fixed-right a {
			margin-right: 6px;
		}
		.status {
			padding: 4px 5px;
			height: 20px;
			line-height: 20px;
			border-radius: 4px;
			font-size: 12px;
			&.ONLINE {
				background: #c5ecdd;
				color: #3eb384;
			}
			&.OFFLINE {
				background: #f2d0d0;
				color: #dd4444;
			}
		}
	}
}
</style>
