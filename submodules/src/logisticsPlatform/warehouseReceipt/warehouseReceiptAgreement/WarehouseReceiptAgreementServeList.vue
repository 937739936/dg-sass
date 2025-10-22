<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			style="margin: 10px 0"
			@change="handleChange"
			@resetFunc="resetFunc"
		></SlFormNew>
		<Tab
			:statusData="statusData"
			:currentStatus="status"
			@callback="changeTab"
			@export="exportData"
		></Tab>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				class="new-table"
				:pagination="false"
				:columns="columns"
				:data-source="listDataSource"
				:scroll="{ x: true }"
				rowKey="id"
				:loading="loading"
			>

				<template slot="statusText" 	slot-scope="text, record">
					<span class="status" :class="record.status">{{text}}</span>
				</template>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<!-- 核心企业 -->
					<template v-if="type == 'rest'">
						<a-space class="space">
							<a
								href="javascript:;"
								@click="gotoDetail(record)"
								>详情</a
							>
							<!-- 待接收方盖章 -->
							<a
								href="javascript:;"
								@click="gotoSign(record)"
								v-auth="'logisticsStorageCenter:warehouseReceiptManage:agreement:serviceAgreement:sign'"
								v-if="record.status == 'RECEIVER_SIGN'"
							>
								盖章</a
							>
							<!-- 待接收方确认 -->
							<a
								href="javascript:;"
								@click="gotoConfirm(record)"
								v-auth="'logisticsStorageCenter:warehouseReceiptManage:agreement:serviceAgreement:confirm'"
								v-if="record.status == 'RECEIVER_CONFIRM'"
							>
								确认</a
							>

							<!-- 审批中 待接收方确认 已生效 失效 驳回 已作废-->
							<a
								href="javascript:;"
								v-if="!['RECEIVER_SIGN'].includes(record.status)"
								@click="download(record)"
								>下载</a
							>
							<a-tooltip
								overlayClassName="more-btn-tooltips"
								placement="left"
								v-if="['RECEIVER_SIGN'].includes(record.status)"
								:getPopupContainer="getPopupContainer"
							>
								<template slot="title">
									<a
										href="javascript:;"
										@click="download(record)"
										>下载</a
									>
									<!-- 待发起方盖章 -->
									<a
										href="javascript:;"
										v-auth="'logisticsStorageCenter:warehouseReceiptManage:agreement:serviceAgreement:sign'"
										@click="cancellation(record)"
										>作废</a
									>
								</template>
								<a href="javascript:;">
									<span>更多</span>
									<em class="right-arrow"></em>
								</a>
							</a-tooltip>
						</a-space>
					</template>
					<!-- admin -->
					<template v-if="type == 'admin'">
						<a-space class="space">
						<!-- 待提交 -->
							<a
								href="javascript:;"
								v-if="record.status == 'DRAFT'"
								@click="gotoEdit(record)"
								>编辑</a
							>
							<a
								href="javascript:;"
								@click="gotoDetail(record)"
								>详情</a
							>
							<!-- 除了待提交的 -->
							<a
								href="javascript:;"
									v-if="record.status != 'DRAFT'"
								@click="download(record)"
								>下载</a
							>
							<a
								href="javascript:;"
								v-if="[ 'EFFECTIVE'].includes(record.status) && record.type =='OFFLINE'"
								@click="del(record)"
								>删除</a
							>
							<a-tooltip
								overlayClassName="more-btn-tooltips"
								placement="left"
								v-if="record.status == 'DRAFT'"
								:getPopupContainer="getPopupContainer"
							>
								<template slot="title">
									<a
										href="javascript:;"
										@click="download(record)"
										>下载</a
									>
									<a
										href="javascript:;"
										@click="del(record)"
										>删除</a
									>
								</template>
								<a href="javascript:;">
									<span>更多</span>
									<em class="right-arrow"></em>
								</a>
							</a-tooltip>
						</a-space>
					</template>
				</template>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
		<TipModal
			ref="delModal"
			@ok="confirmDel"
		>
			<div class="del-tip">确认要删除该协议吗，删除后无法恢复</div>
		</TipModal>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="确认作废？"
		>
			<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
			<a-textarea
				v-model="reason"
				style="border:0"
				placeholder="请输入作废原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import iPagination from '@sub/components/iPagination';
import Tab from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/Tab.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';
import TipModal from '@sub/components/DelModal.vue';



const customRender = t => t || '-';

const restColumns = [
	{ title: '协议编号', dataIndex: 'serialNo' },
	{ title: '企业名称', dataIndex: 'receiverCompanyName', },
	{ title: '平台方', dataIndex: 'initiatorCompanyName', },
	{ title: '协议类型', dataIndex: 'typeText' },
	{ title: '签订日期', dataIndex: 'signDate' },
	{ title: '签订状态', dataIndex: 'statusText', scopedSlots: { customRender: 'statusText' }, fixed: 'right', },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const adminColumns = [
	{ title: '协议编号', dataIndex: 'serialNo' },
	{ title: '企业名称', dataIndex: 'receiverCompanyName', },
	{ title: '企业类型', dataIndex: 'receiverCompanyTypeText', },
	{ title: '协议类型', dataIndex: 'typeText' },
	{ title: '签订日期', dataIndex: 'signDate' },
	{ title: '签订状态', dataIndex: 'statusText', scopedSlots: { customRender: 'statusText' }, fixed: 'right', },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	props: {
		listApi: {},
		statisticsApi: {},
		exportApi: {},
		downloadApi: {},
		delApi: {},
		cancelApi: {},

		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			// constants,
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			listDataSource: [],
			status: 'ALL',
			searchParams: {},
			loading: false,
			visible: false,
			currentItem: {},
			reason: ''
		};
	},
	components: {
		iPagination,
		Tab,
		SlFormNew,
		TipModal
	},

	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
		columns() {
			if(this.type == 'rest') {
				return restColumns
			}
			return adminColumns
		},
		statusData() {
			if(this.type == 'rest') {
				if(this.isWarehouse) {
					return [
						{ label: '全部', value: 'ALL',num: 0 },
						{ label: '待我方确认', value: 'RECEIVER_CONFIRM', num: 0 },
						{ label: '待我方盖章', value: 'RECEIVER_SIGN', num: 0 },
						{ label: '已生效', value: 'EFFECTIVE', num: 0},
						{ label: '无效', value: 'INVALID', num: 0},
					]
				}
				return [
					{ label: '全部', value: 'ALL',num: 0 },
					{ label: '审批中', value: 'AUDITING',num: 0 },
					{ label: '待我方确认', value: 'RECEIVER_CONFIRM', num: 0},
					{ label: '待我方盖章', value: 'RECEIVER_SIGN', num: 0 },
					{ label: '已生效', value: 'EFFECTIVE', num: 0},
					{ label: '无效', value: 'INVALID', num: 0},
				]
			}
			return [
				{ label: '全部', value: 'ALL',num: 0 },
				{ label: '待提交', value: 'DRAFT',num: 0 },

				{ label: '审批中', value: 'AUDITING',num: 0 },
				{ label: '待接收方确认', value: 'RECEIVER_CONFIRM', num: 0},
				{ label: '待接收方盖章', value: 'RECEIVER_SIGN' , num: 0},
				{ label: '已生效', value: 'EFFECTIVE',num: 0 },
				{ label: '无效', value: 'INVALID',num: 0 },
			]
			

		},
		searchList() {
			if (this.type == 'admin') {
				return [
					{
						decorator: ['serialNo'],
						addonBeforeTitle: '协议编号',
						type: 'input',
						placeholder: '请输入协议编号'
					},
					{
						decorator: ['receiverCompanyName'],
						addonBeforeTitle: '企业名称',
						type: 'input',
						placeholder: '请输入企业名称'
					},
					{
						decorator: ['type'],
						addonBeforeTitle: '协议类型',
						type: 'select',
						placeholder: '请选择协议类型',
						options: [
							{ value: 'ONLINE', label: '电子协议' },
							{ value: 'OFFLINE', label: '线下协议' }
						]
					},
					{
						decorator: ['beginDate'],
						addonBeforeTitle: '签订日期',
						type: 'rangePicker',
						realKey: ['signDateBegin', 'signDateEnd']
					}
				];
			}
			return [
				{
					decorator: ['serialNo'],
					addonBeforeTitle: '协议编号',
					type: 'input',
					placeholder: '请输入协议编号'
				},
				{
					decorator: ['type'],
					addonBeforeTitle: '协议类型',
					type: 'select',
					placeholder: '请选择协议类型',
					options: [
						{ value: 'ONLINE', label: '电子协议' },
						{ value: 'OFFLINE', label: '线下协议' }
					]
				},
				{
					decorator: ['beginDate'],
					addonBeforeTitle: '签订日期',
					type: 'rangePicker',
					realKey: ['signDateBegin', 'signDateEnd']
				}
			];
		}
	},
	mounted() {
		this.getList();
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.status = 'ALL';
			this.pagination.pageNo = 1;
			this.pageSize = 10;
			this.getTabStatistics();
		},
		handleChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.loading = true;
			this.pageSize = pageSize;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams,
				status: this.status
			};
			try {
				const res = await this.listApi(params);
				this.loading = false;

				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			} catch (error) {
				this.loading = false;
			}
		},
		gotoDetail(record) {
			let path =
				this.type == 'admin'
					? '/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/agreeServeDetail'
					: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/agreeServeDetail';
			this.$router.push({
				path,
				query: {
					id: record.bid
				}
			});
		},
		gotoEdit(record) {
			let path = record.type == 'OFFLINE'
				? '/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOfflineManage'
				: '/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/addOnlineManage';
			this.$router.push({
				path,
				query: {
					id: record.bid
				}
			});
		},
		// 导出
		async exportData() {
			// 仓单管理协议-【当前企业名称】-【导出日期】
			let name = `仓单服务协议-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}.xls`;
			if (this.type == 'admin') {
				name = `仓单服务协议-${moment().format('YYYY-MM-DD')}.xls`;
			}
			const res = await this.exportApi({ ...this.searchParams, status: this.status });
			comDownload(res, undefined, name);
		},
		// 切换tab
		changeTab(val) {
			this.status = val;
			this.getTabStatistics();
			this.getList(1, 10);
		},
		// 签章
		gotoSign(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/signServeAgree',
				query: {
					id: record.bid
				}
			});
		},
		// 确认
		gotoConfirm(record) {
			const query = {
				id: record.bid,
				handleType: 'audit',
			};
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/confirmServeAgree',
				query
			});
		},
		// 获取统计
		async getTabStatistics() {
			if (this.type == 'admin') return;
			if (!this.statisticsApi) return;
			const params = {
				...this.searchParams,
				status: this.status,
			};
			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				const item = list.find(el2 => el2.status == el.value) || {};
				el.num = item.count;
			});
			this.$forceUpdate();
		},
		// 作废
		cancellation(item) {
			this.currentItem = item;
			this.visible = true;
		},

		// 下载
		async download(item) {
			this.currentItem = item;
			// 电子仓单管理协议-协议编号-企业名称简称-仓储企业简称
			const res = await this.downloadApi({ id: item.bid });
		  comDownload(res.data, null, res.name);
		},
		// 确认作废
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}
			const params = {
				id: this.currentItem.bid,
				remark: this.reason,
				operatorType: 'CANCEL',
			};
			const res = await this.cancelApi(params);
			this.visible = false;
			this.$message.success('操作成功');
			this.pagination.pageNo = 1;
			this.getList();
			this.getTabStatistics();
		},
		del(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		// 确认删除
		async confirmDel() {
			const params = {
				id: this.currentItem.bid,
			}
			await this.delApi(params)
			this.$refs.delModal.close();
			this.pagination.pageNo = 1;
			this.getList();
			this.getTabStatistics();
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less">
.more-btn-tooltips {
	z-index: 100;
	.ant-tooltip-inner {
		padding: 10px 0;
		background-color: #fff;
		& > a {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 32px;
			display: block;
			height: 32px;
			padding: 0 15px;
			text-align: center;
		}
		a {
			margin-bottom: 0 !important;
		}
		& > a:active {
			background-color: #e4ebf4;
		}
		& > a:hover {
			background-color: #e4ebf4;
		}
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
</style>
<style lang="less" scoped>
.right-arrow {
	display: inline-block;
	width: 10px;
	height: 10px;
	background: url('~@sub/assets/right_more_icon.png') no-repeat 100% / cover;
	margin-left: 2px;
}
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
	}
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
.red {
	color: red;
}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #D3DFFB;
	color: #4682F3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.AUDITING {
	background:#FFDAC8;
	color: #FF7937;
}
.INITIATOR_SIGN, .RECEIVER_SIGN {
	background: #C5ECDD;
	color: #3EB384;
}
.RECEIVER_CONFIRM {
	background: #C9D9FF;
	color: #596FA0;
}
.EXPIRE {
	background: #E0E0E0;
	color: rgba(0, 0, 0, 0.25);
}
.REJECT,.CANCEL {
	background: #F2D0D0;
	color: #DD4444;
}
.space {
	/deep/ .ant-space-item {
		margin-right: 12px !important;
	}
	.ant-space-item:last-child {
		margin-right: 0 !important;
	}

}

</style>
