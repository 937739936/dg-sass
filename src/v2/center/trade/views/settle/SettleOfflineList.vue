<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="changeSearch"
			:isShowIcon="false"
			:isShowSearchBox="true"
		></SlFormNew>
		<!-- tabs -->
		<div class="tabs-box">
			<a-tabs
				v-model="status"
				@change="tabChange"
			>
				<a-tab-pane
					:key="item.value"
					:tab="item.text"
					v-for="item in settleStatus"
				>
				</a-tab-pane>
				<div
					class="export-box"
					slot="tabBarExtraContent"
					@click="exportTime"
				>
					<ExportIcon class="export-icon"></ExportIcon>
					<span class="export-text">数据导出</span>
				</div>
			</a-tabs>
		</div>
		<div :class="'record-list table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="dataSource"
				rowKey="id"
				:scroll="{ x: true }"
				:loading="loading"
				class="new-table"
			>
				<span
					slot="Amount"
					slot-scope="text"
				>
					{{ text | formatMoney }}
				</span>
				<span
					slot="Quantity"
					slot-scope="text"
				>
					{{ text | formatMoney(4) }}</span
				>
				<div
					slot="statusDesc"
					slot-scope="status, item"
					:class="`delivery-status status-${item.status}`"
				>
					{{ status || '-' }}
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
		<modalInfo
			ref="modalInfoOk"
			title="删除提示"
			tip="确认要删除该结算单吗，删除后无法恢复"
			:loading="modalLoading"
			@verify="modalInfoOk"
		>
		</modalInfo>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_GetOffinleSettleList,
	API_DeleteSettle,
	API_GetOffinleSettleExport,
	API_DownloadSettleFiles
} from '@/v2/center/trade/api/settle';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import modalInfo from '@/v2/components/modalInfo/info';
import comDownload from '@sub/utils/comDownload.js';
import { SettleOfflineListColumns } from './columns/columns.js';
import { ExportIcon } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['searchNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、结算单号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: filterCodeByKey('offlineTransTypeDict')
	},
	{
		decorator: ['signdate'],
		addonBeforeTitle: '合同签订日期',
		type: 'rangePicker',
		placeholder: '请选择合同签订日期',
		realKey: ['contractSignTimeBegin', 'contractSignTimeEnd']
	},
	{
		decorator: ['date'],
		addonBeforeTitle: '结算日期',
		type: 'rangePicker',
		placeholder: '请选择结算日期',
		realKey: ['statementTimeBegin', 'statementTimeEnd']
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('orderBusinessTypeDescMap').filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	}
];
export default {
	components: {
		modalInfo,
		ExportIcon
	},
	mixins: [ListMixin],
	data() {
		let { meta } = this.$route;
		return {
			getPopupContainer,
			meta,
			searchList,
			status: '',
			url: {
				list: API_GetOffinleSettleList,
				export: API_GetOffinleSettleExport
			},
			defaultParams: {
				status: ''
			},
			settleStatus: [
				{
					text: '全部',
					value: ''
				},
				{
					text: '已单签',
					value: 'SINGLE_SIGN'
				},
				{
					text: '待确认',
					value: 'WAI_CONFIRM'
				},
				{
					text: '已生效',
					value: 'EFFECTIVE'
				},
				{
					text: '无效',
					value: 'UN_EFFECTIVE'
				}
			],
			activeId: '', //操作ID
			modalLoading: false //弹框loading状态
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER' //获取企业信息。用于导出时文件名称
		}),
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		//查询类型字段，需大写
		orderType() {
			return this.type.toUpperCase();
		},
		typeDesc() {
			//类型中文
			let typeDesc = '';
			switch (this.type) {
				case 'buy':
					typeDesc = '采购';
					break;
				case 'sell':
					typeDesc = '销售';
					break;
			}
			return typeDesc;
		},
		//表格头部筛选，采购结算单不展示买方企业，销售结算单不展示卖方企业
		columns() {
			let columns = SettleOfflineListColumns(this);
			let dataIndex = '';
			switch (this.type) {
				case 'buy':
					dataIndex = 'buyerName';
					break;
				case 'sell':
					dataIndex = 'sellerName';
					break;
			}
			return columns.filter(item => {
				return item.dataIndex !== dataIndex;
			});
		}
	},
	created() {
		this.defaultParams.orderType = this.orderType;
	},
	methods: {
		//导出
		exportTime() {
			//拼接导出文件名称
			let fileName = `线下${this.typeDesc}结算单-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}`;
			this.exportFile(fileName);
		},
		//修改查询类型
		tabChange(val) {
			this.defaultParams.status = val;
		},
		//操作栏
		actionMinList(item) {
			// 确认● 接收方为矿企类型，且已注册认证，点击后进入“线下结算单确认”页面
			//删除● 所属合同的状态非“已完结”、“完结审批中”，且未关联服务费流水数据
			let actionList = [
				{
					text: '修改',
					incident: 'edit',
					condition: item.status === 'SINGLE_SIGN'
				},
				{
					text: '详情',
					incident: 'viewDetail'
				},
				{
					text: '下载',
					incident: 'download'
				},
				{
					text: '删除',
					incident: 'delete',
					auth: 'monitor:dynamic:terminalStatement:del',
					condition:
						(item.status == 'REJECT' || item.status === 'SINGLE_SIGN' ||
							(item.status == 'EFFECTIVE' &&
								item.terminalContractStatus !== 'COMPLETED' &&
								item.terminalContractStatus !== 'COMPLETED_AUDITING')) &&
						!item.relServiceFeeBill
				}
			];
			return actionList;
		},
		// 编辑
		edit(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/offlineadd`,
				query: {
					id,
					type: 'edit'
				}
			});
		},
		//详情
		viewDetail(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/offlinedetail`,
				query: {
					id
				}
			});
		},
		//下载
		download(item) {
			let { id } = item;
			API_DownloadSettleFiles({ statementId: id }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		//删除
		delete(item) {
			let { id } = item;
			this.activeId = id;
			this.$refs.modalInfoOk.open();
		},
		modalInfoOk() {
			this.modalLoading = true;
			API_DeleteSettle({ statementId: this.activeId })
				.then(res => {
					if (res.success) {
						this.$message.success('删除成功');
						this.getList();
					}
				})
				.finally(() => {
					this.modalLoading = false;
					this.$refs.modalInfoOk.close();
				});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep.ant-calendar-picker {
	width: 100%;
}
.record-list {
	margin-top: 20px;
}
.tabs-box {
	.export-box {
		line-height: 50px;
		cursor: pointer;
		.export-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: 1px;
		}
		.export-text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 20px;
		}
	}
	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
	}
}

//默认待提交状态
.delivery-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	//待确认
	&.status-WAI_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	//已签约
	&.status-EFFECTIVE {
		background: #c5ecdd;
		color: #3eb384;
	}
	//驳回
	&.status-REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
}
</style>
