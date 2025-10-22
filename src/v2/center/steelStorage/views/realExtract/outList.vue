<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<!-- <div class="breadcrumb">实提记录查询 <span style="margin:0 8px">/</span> <span style="font-weight:600">新增实提单</span></div> -->
		<a-card :bordered="false">
			<div style="display: flex">
				<span class="slTitle">新增实提</span>
			</div>
			<div class="divider"></div>
			<SlStep
				class="sl-step"
				:list="stepList"
				:currentStep="currentStep"
			></SlStep>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-table
				class="new-table"
				:columns="columns"
				:rowSelection="rowSelection"
				:data-source="dataSource"
				:scroll="{ x: true }"
				:rowKey="record => record.id"
				style="margin-top: 30px; margin-bottom: 10px"
				:pagination="false"
				:loading="loading"
			>
				<span
					slot="statusDesc"
					slot-scope="text, record"
				>
					<span>{{ record.statusDesc }}</span>
				</span>
			</a-table>
			<i-pagination
				:pagination="pagination"
				v-show="pagination.total >= pageSize"
				@change="getList"
			/>
			<div class="slDetailBottom">
				<a-button
					type="primary"
					style="width: 88px; margin-top: 0px; padding: 0"
					@click="next"
					>下一步</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { getContractList } from '@/v2/center/steels/api/contract.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import SlStep from '../../components/sl-step.vue';
import { getAllWarehouseList, getOutStorageList } from '../../api';

import { mapMutations, mapGetters } from 'vuex';

const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const columns = [
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbr'
	},
	{
		title: '出库单号',
		dataIndex: 'serialNo'
	},
	{
		title: '出库日期',
		dataIndex: 'operationDate'
	},

	{
		title: '出库方式',
		dataIndex: 'outboundWayDesc'
	},
	{
		title: '货权接收方',
		dataIndex: 'customer'
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc'
	},
	{
		title: '出库数量',
		dataIndex: 'quantity'
	},
	{
		title: '出库重量(吨)',
		dataIndex: 'weight'
	},
	{
		title: '类型',
		dataIndex: 'sourceDesc'
	},

	{
		title: '状态',
		dataIndex: 'statusDesc',
		align: 'center',
		fixed: 'right',
		scopedSlots: { customRender: 'statusDesc' }
	}
];
const searchList = [
	{
		decorator: ['warehouseId'],
		addonBeforeTitle: '仓库简称',
		type: 'select',
		placeholder: '请选择',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '出库单号',
		type: 'input',
		placeholder: '请输入出库单号'
	},
	{
		decorator: ['source'],
		addonBeforeTitle: '出库日期',
		type: 'rangePicker',
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['startDate', 'endDate']
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		mode: 'multiple',
		type: 'select',
		filterOption: filterOption,
		showSearch: true,
		placeholder: '请选择',
		options: filterSteelsCodeByKey('warehouseTransportMode')
	},
	{
		decorator: ['customer'],
		addonBeforeTitle: '货权接收方',
		type: 'input',
		placeholder: '请输入'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchList,
			disabledExport: false,
			url: {
				list: getOutStorageList
			},
			defaultParams: {
				status: 'DELIVERED'
			},
			stepList: ['选择出库记录', '填写实提', '完成'],
			currentStep: 0,
			selectedRowKeys: []
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'checkbox',
				// fixed: true,
				selectedRowKeys: selectedRowKeys,
				onChange: (record, itemList) => {
					t.selectedRowKeys = record;
				}
			};
		}
	},
	mounted() {
		this.getStorageList();
		window.addEventListener('resize', () => {
			this.handleScroll();
		});
	},
	methods: {
		resetFunc() {},
		handleScroll() {
			this.$nextTick(() => {
				var thead = document.querySelector('.slDetailBottom');
				var lw = document.querySelector('#app');
				lw.addEventListener('scroll', function () {
					var sl = 228 - lw.scrollLeft;
					thead.style.left = sl + 'px';
				});
			});
		},
		// 获取仓库列表
		async getStorageList() {
			const res = await getAllWarehouseList({});
			const list = res.data || [];
			this.searchList[0].options = list.map(el => {
				return {
					value: el.warehouseId,
					label: el.warehouseAbbr
				};
			});
		},
		next() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择出库单');
				return;
			}
			/** 反查当前勾选的 出库单 的仓库 */
			const warehouseIdList = [];
			this.dataSource.forEach(el => {
				const flag = this.selectedRowKeys.includes(el.id);
				if (flag) {
					warehouseIdList.push(el.warehouseId);
				}
			});
			// 去重
			const tplList = [...new Set(warehouseIdList)];
			if (tplList.length > 1) {
				this.$message.error('请选择同一个仓库的出库单');
				return;
			}
			this.$router.push({
				path: '/center/steelStorage/realExtract/add',
				query: {
					idList: this.selectedRowKeys.join()
				}
			});
		}
	},
	components: {
		SlStep,
		Breadcrumb
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	margin-left: -30px;
	margin-right: -30px;
	padding-bottom: 74px;
	background: #fff;
	.breadcrumb {
		background: #f4f5f8;
		padding-bottom: 15px;
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
	}
}

.ant-card {
	padding: 30px !important;
	padding-bottom: 0 !important;
}
.divider {
	margin-top: 30px;
	margin-bottom: 48px;
	background: #e5e6eb;
}
.sl-step {
	margin-bottom: 28px;
}
.btn {
	padding: 9px 30px;
	gap: 10px;
	width: 144px;
	height: 38px;
	background: @primary-color;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 14px;
	box-sizing: border-box;
	cursor: pointer;
}
/deep/ .ant-card {
	padding: 0px;
	padding-top: 20px;
}
// 待提交
.statusDesc {
	padding: 2px 6px;
	background: #c1d7ff;
	color: #4682f3;
	font-size: 12px;
	border-radius: 4px;
}
.statusDesc.DELIVERED {
	color: #3eb384;
	background: #c5ecdd;
}
.statusDesc.INVALID {
	color: rgba(0, 0, 0, 0.24995);
	background: #e0e0e0;
}
.statusDesc.IN_EXTRACTING {
	color: #ff7937;
	background: #ffdac8;
}
.statusDesc .FINISHED {
	color: rgba(0, 0, 0, 0.24995);
	background: #e0e0e0;
}
.new-table {
	/deep/ tr td {
		// padding: 0 !important;
		padding-top: 8px !important;
		padding-bottom: 8px !important;
		line-height: 17px;
	}
	/deep/ .ant-table-fixed-right tr {
		// height: 42px !important;
	}
}
/deep/ .ant-btn {
	padding: 0 10px;
}

/deep/ .ant-table-column-title {
	font-weight: 600;
}
/deep/ .ant-table-row-selected {
	td {
		background: #fff !important;
	}
}
/deep/ .ant-table-row-selected:nth-child(2n) {
	td {
		background: #f3f5f6 !important;
	}
}
.btn-box {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 64px;
	border-top: 1px solid #e5e6eb;
	margin-top: 14px;
}
.upload-file {
	width: 116px;
	height: 32px;
	background: #ffffff;
	border: 1px solid @primary-color;
	border-radius: 4px;
	color: @primary-color;
	margin-left: 30px;
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 999;
}
</style>
