<template>
	<div
		class="mySettleList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>结算单作废</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>

			<div
				class="record-list"
				style="margin-top: 30px"
			>
				<a-table
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					rowKey="id"
					class="new-table"
					@change="handleTableSort"
					:scroll="{ x: true }"
					:loading="loading"
				>
					<template
						slot="currentSettleAmount"
						slot-scope="currentSettleAmount, item"
					>
						<p>{{ item.currentSettleAmount.toLocaleString() }}</p>
					</template>
					<template
						slot="currentSettlePrice"
						slot-scope="currentSettlePrice, item"
					>
						<p>{{ item.currentSettlePrice.toLocaleString() }}</p>
					</template>
					<!-- 1-审批中，2-待签约，3-待确认 4-已确认，5-确认驳回，6-内部审批驳回，7-已取消-->
					<span slot="customTitle"> 操作 </span>
					<div
						slot="action"
						slot-scope="action, item"
						@click="onPageState"
					>
						<!-- 2-待签约，盖章、取消、查看、查看结算单-->
						<template v-if="item.cancelStatus == 'CANCEL_WAIT_SIGN'">
							<router-link
								v-if="VUEX_ST_COMPANYSUER.companyId != item.initiator"
								:to="{ path: '/center/steels/settle/settleCancelStamp', query: { id: item.id, url: item.cancelPdfPath } }"
								v-auth="'steel:statement:cancel:sign'"
								>盖章
							</router-link>
							<a
								href="javascript:;"
								v-auth="'steel:statement:mystatement:edit'"
								v-if="VUEX_ST_COMPANYSUER.companyId == item.initiator"
								@click="(settleId = item.id), (visible = true), (reasonName = '')"
								>取消</a
							>
							<a-dropdown>
								<a
									class="ant-dropdown-link"
									@click="e => e.preventDefault()"
								>
									更多
									<a-icon type="down" />
								</a>
								<a-menu slot="overlay">
									<a-menu-item>
										<a
											href="javascript:void(0)"
											@click="goView(item)"
											>查看</a
										>
									</a-menu-item>
									<a-menu-item>
										<a
											href="javascript:void(0)"
											@click="pdfShow(item.pdfPath)"
											>查看结算单</a
										>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</template>

						<!-- 3-待确认，确认、查看、查看结算单-->
						<template v-if="item.cancelStatus == 'CANCEL_WAIT_CONFIRM'">
							<router-link
								v-if="VUEX_ST_COMPANYSUER.companyId == item.initiator"
								:to="{ path: '/center/steels/settle/settleCancelConfirm', query: { id: item.id, url: item.cancelPdfPath } }"
								v-auth="'steel:statement:cancel:confirm'"
								>确认
							</router-link>
						</template>
						<!-- 1-审批中，4-已确认，5-确认驳回，6-内部审批驳回，7-已取消 查看、查看结算单-->
						<template v-if="item.cancelStatus != 'CANCEL_WAIT_SIGN'">
							<a
								href="javascript:void(0)"
								@click="goView(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.pdfPath"
								@click="pdfShow(item.pdfPath)"
								>查看结算单</a
							>
						</template>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>

		<a-modal
			centered
			title="文件"
			v-model="modalPdfIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-pdf"
		>
			<template slot="footer">
				<a-button @click="downPdf(pdfShowUrl)">下载PDF</a-button>
				<a-button
					type="primary"
					@click="modalPdfIsShow = false"
					>确定</a-button
				>
			</template>
			<pdf-preview
				v-if="pdfShowUrl"
				:url="pdfShowUrl"
			></pdf-preview>
		</a-modal>

		<div
			class="s-modal"
			v-if="visible"
			@click="visible = false"
		>
			<div
				@click.stop
				style="background: #fff; margin-top: 120px"
				@move.stop
			>
				<a-row
					class="content"
					@click.native.stop
				>
					<a-row>
						<a-input
							style="width: 90%; margin: 0 auto; margin-top: 20px"
							placeholder="请输入取消原因"
							v-model="reasonName"
						></a-input>
					</a-row>
					<a-row class="btn">
						<a-button
							type="primary"
							@click="visible = false"
							>取消</a-button
						>
						<a-button
							type="primary"
							style="margin-left: 20px"
							@click="cancelSettle"
							>确定</a-button
						>
					</a-row>
				</a-row>
			</div>
		</div>
		<sort-field
			:flag="flag"
			:arr="sortArr"
			@cancel="cancel"
			:menuType="menuType"
			@reload="reload"
		></sort-field>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GetTableSorter, API_DOWNLPREVIEWTE } from '@/v2/api';
import SortField from '@/v2/components/SortField';
import iPagination from '@sub/components/iPagination';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { API_SteelsStatementMyStatementList, API_SteelsStatementStatementCancelOff } from '@/v2/center/steels/api/settle.js';
import { filterCodeByValueName, filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

const columns = [
	{
		title: '结算单所属合同类型',
		dataIndex: 'statementTypeDesc',
		customRender: () => {
			return '采购结算单';
		}
	},
	{
		title: '结算单编号',
		dataIndex: 'statementNo'
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo'
	},
	{
		title: '结算单类型',
		dataIndex: 'type',
		customRender: text => {
			return text == 'PRE_STAT' ? '预结算单' : '结算单';
		}
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName'
		// sorter: true
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName',
		width: 150
		// sorter: true
	},
	{
		title: '作废申请日期',
		dataIndex: 'applyCancelTime',
		customRender: text => {
			return text && text.slice(0, 10);
		}
	},
	{
		title: '本次结算金额',
		dataIndex: 'settleAmount'
	},
	{
		title: '本次结算数量',
		dataIndex: 'particularQuantity'
	},
	{
		title: '作废状态',
		dataIndex: 'cancelStatus',
		customRender: text => {
			return filterCodeByValueName(text, 'statementCancelStatus') || text;
		}
	},
	{
		key: 'action',
		fixed: 'right',
		slots: {
			title: 'customTitle'
		},
		scopedSlots: {
			customRender: 'action'
		}
	}
];
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['statementNo'],
		addonBeforeTitle: '结算单编号',
		type: 'input',
		placeholder: '请输入结算单编号',
		allowClear: true
	},
	{
		decorator: ['sellerCompanyName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称',
		allowClear: true
	},
	{
		decorator: ['buyCompanyName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称',
		allowClear: true
	},

	{
		decorator: ['date2'],
		addonBeforeTitle: '作废日期',
		realKey: ['cancelApplyDateBegin', 'cancelApplyDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['statementType'],
		addonBeforeTitle: '结算单所属合同类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: 0, label: '全部' },
			{ value: 'BUY', label: '采购结算单' }
		]
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '结算单类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('statementType')
	},
	{
		decorator: ['cancelStatus'],
		addonBeforeTitle: '作废状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('statementCancelStatus')
	}
];
export default {
	name: 'MySettleList',
	mixins: [ListMixin],
	data() {
		return {
			colSpan,
			formLayout,
			searchList,
			url: {
				list: API_SteelsStatementMyStatementList
			},
			getPopupContainer,
			flag: false,
			sortArr: [],
			menuType: '',
			columns,

			item: [],
			dataSource: [],
			visible: false,
			reasonName: '',
			settleId: null,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			defaultParams: {
				freezeStatus: true
			},
			modalPdfIsShow: false,
			pdfShowUrl: '',
			loading: false
		};
	},
	components: {
		SortField,
		iPagination,
		PdfPreview
	},
	mounted() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		handleTableSort(pagination, filters, sorter, { currentDataSource }) {
			// 名称字段排序
			this.params.field = sorter.field;
			this.params.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		getOrder(data) {
			API_GetTableSorter(data).then(res => {
				if (res.success) {
					if (res.result != null) {
						this.reload(res.result.selected);
					}
				} else {
					this.$message.error('网络异常，请稍后重试！');
				}
			});
		},
		reload(data) {
			let newArr = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				for (let j = 0; j < this.oldColumns.length; j++) {
					if (item.key == this.oldColumns[j].key) {
						newArr.push(this.oldColumns[j]);
					}
					if (newArr.length == data.length) {
						newArr.push(this.oldColumns[this.oldColumns.length - 1]);
						this.columns = newArr;
						this.getList();
						return;
					}
				}
			}
		},
		sortVal() {
			this.sortArr = [];
			this.flag = true;
			for (let i = 0; i < this.columns.length; i++) {
				if (i < this.columns.length - 1) {
					let item = this.columns[i];
					let obj = {};
					obj.title = item.title;
					obj.key = item.key;
					if (this.sortArr.indexOf(obj) == '-1') {
						this.sortArr.push(obj);
					}
				}
			}
		},
		// 查看结算单
		goView(item) {
			const params = {
				contractId: item.contractId,
				generateWay: item.generateWay,
				contractType: item.contractType,
				deliveryMode: item.deliveryMode,
				type: 'view',
				statementId: item.id
			};
			this.$router.push({
				path: 'settleApplyDetail',
				query: params
			});
		},
		cancel() {
			this.flag = false;
		},
		onPageState() {
			//点击操作中的按钮，保存分页状态
			// this.VUEX_setListPamars(this.pagination)
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
			this.defaultParams = {
				freezeStatus: true
			};
		},

		// 取消结算单
		cancelSettle() {
			if (!this.reasonName) {
				this.$message.error('取消理由必填');
				this.visible = false;
				return;
			}
			const that = this;
			API_SteelsStatementStatementCancelOff({
				id: this.settleId,
				reason: this.reasonName
			}).then(res => {
				if (res.success) {
					this.visible = false;
					if (res.data == true) {
						that.$message.success('取消成功');
						that.getList();
					} else {
						that.$message.error(res.message);
						return;
					}
				}
			});
		},
		pdfShow(pdfPath) {
			this.modalPdfIsShow = true;
			this.pdfShowUrl = pdfPath;
		},
		// 下载
		downPdf(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="stylus">
.mySettleList
  .search-wrap
    .row
      .order-wrap
        label
          width: 120px

  .list-head
    li
      width 25%
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

  .s-modal
    width 100%
    height 100%
    position fixed
    left 0
    top 0
    background rgba(0, 0, 0, .4)
    z-index 9999
    flex-row(center, flex-start)

    .content
      width 400px
      height auto
      max-height 500px
      overflow-y auto
      background #ffffff
      padding 0 30px
      border-radius 8px
      position relative

    .btn
      width 90%
      margin 20px 0
      flex-row(flex-end, center)
      background #fff
</style>
