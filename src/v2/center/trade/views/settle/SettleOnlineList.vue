<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="changeSearch"
			:isShowIcon="false"
			:isShowSearchBox="true"
			ref="SlFormNew"
		></SlFormNew>
		<!-- tabs -->
		<div class="tabs-box">
			<a-tabs
				v-model="status"
				@change="tabChange"
			>
				<a-tab-pane
					:key="item.text"
					v-for="item in settleStatus"
				>
					<template slot="tab">
						{{ item.text }}
						<!-- 待我方确认和待我方盖章加载数量 -->
						<span
							v-if="['WAIT_ME_CONFIRM', 'WAIT_ME_SEAL'].includes(item.value) && tabNum[item.value]"
							class="tabNum"
						>
							({{ tabNum[item.value] }})
						</span>
					</template>
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
					slot="invalidStatusDesc"
					slot-scope="status, item"
					:class="`delivery-status status-${item.status}`"
				>
					<!-- ○ 如果结算单状态为“冻结中”，则展示结算单作废的状态，并且在作废状态前，要标识“作废”字样 -->
					<template v-if="item.status == 'FREEZING'"> 作废:{{ item.invalidStatusDesc }} </template>
					<template v-else>
						{{ status || '-' }}
					</template>
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
		<SettleCancelModal
			ref="settleCancel"
			@change="getList"
		/>
		<modalInfo
			ref="modalInfoOk"
			title="删除提示"
			tip="确认要删除该结算单吗，删除后无法恢复"
			:loading="modalLoading"
			@verify="modalInfoOk"
		>
		</modalInfo>
		<modalInfo
			ref="modalInfo"
			title="提示"
			:tip="tip"
			:footer="false"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import {
	API_GETSETTLELIST,
	API_GETSETTLECOUNT,
	API_GETSETTLEEXPORT,
	API_GETSETDownload,
	API_GETSETTLECANCEL,
	API_GETINVALIDCheck
} from '@/v2/center/trade/api/settle';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import comDownload from '@sub/utils/comDownload.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import modalInfo from '@/v2/components/modalInfo/info';
import SettleCancelModal from './components/SettleCancelModal';
import { SettleOnlineListColumns } from './columns/columns.js';
import { ExportIcon } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['keyword'],
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
		options: filterCodeByKey('onlineTransTypeDict')
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
		realKey: ['settleTimeBegin', 'settleTimeEnd']
	},
	{
		decorator: ['orderBusinessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('orderBusinessTypeDescMap').filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	}
];
export default {
	components: {
		SettleCancelModal,
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
			status: '全部',
			url: {
				list: API_GETSETTLELIST,
				count: API_GETSETTLECOUNT,
				export: API_GETSETTLEEXPORT
			},
			defaultParams: {
				summaryStatus: 'ALL' //默认展示状态
			},
			settleStatus: filterCodeByKey('statementSummaryStatus'),
			activeId: '', //要操作的数据ID
			modalLoading: false, //弹框loading状态
			tip: '' //状态提示
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
		//查询类型字段，需大写
		orderType() {
			return this.type.toUpperCase();
		},
		//统计数量
		tabNum() {
			let tabNum = {};
			let dataCountSource = this.dataCountSource;
			//对接口返回数据做对应处理
			if (dataCountSource?.length) {
				this.settleStatus.map(item => {
					let data = dataCountSource.find(items => items.summaryStatus == item.value);
					if (data) {
						tabNum[item.value] = data.count;
					}
				});
			}
			return tabNum;
		},
		//表格头部筛选，采购结算单不展示买方企业，销售结算单不展示卖方企业
		columns() {
			let columns = SettleOnlineListColumns(this);
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
	mounted() {
		if (this.$route.query?.contractNo) {
			this.$nextTick(() => {
				let data = [{ name: '编号', value: this.$route.query.contractNo, key: 'keyword', type: 'input' }];
				this.$refs.SlFormNew.initDefault('keyword', data);
				this.changeSearch({ keyword: this.$route.query.contractNo })
			});
		}	
	},
	methods: {
		//导出
		exportTime() {
			//拼接导出文件名称
			let fileName = `电子${this.typeDesc}结算单-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}`;
			this.exportFile(fileName);
		},
		//修改查询类型
		tabChange(val) {
			let value = this.settleStatus.find(item => item.text == val).value;
			this.defaultParams.summaryStatus = value;
		},
		//操作栏
		actionMinList(item) {
			//判断状态
			let statementOperations = item.statementOperations || [];
			//判断作废状态
			let invalidOperations = item.invalidOperations || [];
			let actionList = [
				{
					text: '修改',
					incident: 'edit',
					auth: 'dgChain:settle:update',
					condition: statementOperations.includes('UPDATE')
				},
				{
					text: '确认',
					incident: 'confirm',
					auth: 'dgChain:settle:confirm',
					condition: statementOperations.includes('RECEIVER_REJECT') || statementOperations.includes('RECEIVER_CONFIRM')
				},
				{
					text: '确认', //作废确认
					incident: 'cancelConfirm',
					auth: 'dgChain:settle:confirm',
					condition: invalidOperations.includes('RECEIVER_CONFIRM') || invalidOperations.includes('RECEIVER_REJECT')
				},
				{
					text: '盖章',
					incident: 'seal',
					auth: 'dgChain:settle:seal',
					condition:
						statementOperations.includes('RECEIVER_CANCEL') ||
						statementOperations.includes('RECEIVER_SEAL') ||
						statementOperations.includes('ORIGINATOR_CANCEL') ||
						statementOperations.includes('ORIGINATOR_SEAL')
				},
				{
					text: '盖章', //作废盖章
					incident: 'cancelSeal',
					auth: 'dgChain:settle:seal',
					condition:
						invalidOperations.includes('RECEIVER_CANCEL') ||
						invalidOperations.includes('RECEIVER_SEAL') ||
						invalidOperations.includes('ORIGINATOR_CANCEL') ||
						invalidOperations.includes('ORIGINATOR_SEAL')
				},
				{
					text: '详情',
					incident: 'viewDetail',
					auth: 'dgChain:settle:detail'
				},
				{
					text: '下载',
					incident: 'download',
					auth: 'dgChain:settle:download'
				},
				{
					text: '作废',
					incident: 'cancel',
					auth: 'dgChain:settle:invalid',
					condition: invalidOperations.includes('NEW')
				},
				{
					text: '删除',
					incident: 'delete',
					auth: 'dgChain:settle:delete',
					condition: statementOperations.includes('DELETE')
				}
			];
			return actionList;
		},
		//修改
		edit(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlineedit`,
				query: {
					id
				}
			});
		},
		//确认
		confirm(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlineconfirm`,
				query: {
					id
				}
			});
		},
		//盖章
		seal(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlineseal`,
				query: {
					id
				}
			});
		},
		//作废盖章
		cancelSeal(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlinecancelseal`,
				query: {
					id
				}
			});
		},
		//详情
		viewDetail(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlinedetail`,
				query: {
					id
				}
			});
		},
		//作废
		cancel(item) {
			let { id } = item;
			API_GETINVALIDCheck({ statementId: id }).then(res => {
				if (res.success && !res.data) {
					this.$refs.settleCancel.show(id);
				} else {
					this.tip = res.data;
					this.$refs.modalInfo.open();
				}
			});
		},
		//作废确认
		cancelConfirm(item) {
			let { id } = item;
			this.$router.push({
				path: `/center/settle/${this.type}/onlinecancel`,
				query: {
					id
				}
			});
		},
		//下载
		download(item) {
			let { id } = item;
			API_GETSETDownload({ statementId: id }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		//删除
		delete(item) {
			let { id } = item;
			this.activeId = id;
			this.$refs.modalInfoOk.open();
		},
		//确认删除
		modalInfoOk() {
			this.modalLoading = true;
			API_GETSETTLECANCEL({ id: this.activeId })
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
.tabs-box {
	.tabNum {
		color: @primary-color;
	}
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
::v-deep.ant-calendar-picker {
	width: 100%;
}
.record-list {
	margin-top: 20px;
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
	&.status-RECEIVER_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	//审批中
	&.status-WAIT_ORIGINATOR_INNER_AUDITING {
		background: #ffdbc8;
		color: #ff7937;
	}
	//待签约
	&.status-NEW {
		background: #f8dde8;
		color: #db81a5;
	}
	//已签约
	&.status-EFFECTIVE {
		background: #c5ecdd;
		color: #3eb384;
	}
	//已作废
	&.status-INVALID,
	&.status-ORIGINATOR_CANCEL,
	&.status-RECEIVER_CANCEL {
		background: #e0e0e0;
		color: #a8a8a8;
	}
	//退回
	&.status-FREEZING {
		background: #d2dfea;
		color: #7590b9;
	}
	//驳回
	&.status-ORIGINATOR_INNER_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
}
</style>
