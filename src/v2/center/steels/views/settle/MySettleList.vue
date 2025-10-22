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
					>我的结算单</span
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
					:scroll="{ x: true }"
					:loading="loading"
				>
					<template
						slot="settleAmount"
						slot-scope="settleAmount, item"
					>
						<p>{{ item.settleAmount.toLocaleString() }}</p>
					</template>
					<template
						slot="settleUnitPrice"
						slot-scope="settleUnitPrice, item"
					>
						<p>{{ item.settleUnitPrice.toLocaleString() }}</p>
					</template>

					<div
						slot="action"
						slot-scope="action, item"
						@click="onPageState"
					>
						<!-- 1-待提交，修改、删除、提交、下载-->
						<template v-if="item.status == 'WAIT_SUBMIT'">
							<a
								href="javascript:void(0)"
								v-auth="'steel:statement:mystatement:edit'"
								v-if="item.initiator == VUEX_ST_COMPANYSUER.companyId"
								@click="edit(item)"
								>修改</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'steel:statement:mystatement:edit'"
								v-if="item.initiator == VUEX_ST_COMPANYSUER.companyId"
								@click="submit(item)"
							>
								提交
							</a>
							<a-dropdown>
								<a
									class="ant-dropdown-link"
									@click="e => e.preventDefault()"
								>
									更多
									<a-icon type="down" />
								</a>
								<a-menu slot="overlay">
									<a-menu-item v-auth="'steel:statement:mystatement:edit'">
										<a
											href="javascript:void(0)"
											@click="deleteSettle(item.id)"
											>删除</a
										>
									</a-menu-item>
									<a-menu-item v-if="item.pdfPath">
										<a
											href="javascript:void(0)"
											@click="downPdf(item)"
											>下载</a
										>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</template>
						<!-- 3-待确认，确认、查看、查看结算单-->
						<template v-if="item.status == 'WAIT_CONFIRM'">
							<div v-if="item.initiator == VUEX_ST_COMPANYSUER.companyId">
								<a
									@click="settleConfirm(item)"
									v-auth="'steel:statement:mystatement:view'"
								>
									确认
								</a>
							</div>
						</template>
						<!-- 4-已确认，作废、查看、查看结算单-->
						<template
							v-if="item.status == 'CONFIRMED' && item.initiator == VUEX_ST_COMPANYSUER.companyId && item.source !== 'RORY_ERP'"
							v-auth="'steel:statement:cancel'"
						>
							<a
								href="javascript:void(0)"
								v-auth="'steel:statement:mystatement:edit'"
								@click="toVoid(item.id)"
								>作废</a
							>
						</template>
						<!-- 2-审批中，5-内部审批驳回，6-确认驳回，7-已取消，8-已作废, 10冻结中。 查看、查看结算单-->
						<template v-if="item.status != 'WAIT_SUBMIT' && item.status != 'WAIT_SIGN'">
							<a
								href="javascript:void(0)"
								@click="goView(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.pdfPath"
								@click="pdfShow(item)"
								>查看结算单</a
							>
						</template>
						<!-- 9-待签约，盖章、取消、查看、查看结算单-->

						<template v-if="item.status == 'WAIT_SIGN'">
							<div v-if="item.initiator != VUEX_ST_COMPANYSUER.companyId">
								<router-link
									v-auth="'steel:statement:mystatement:sign'"
									:to="{ path: '/center/steels/settle/settleApply/submit/seal', query: { id: item.id } }"
									>盖章
								</router-link>
							</div>
							<a
								href="javascript:;"
								v-if="item.initiator == VUEX_ST_COMPANYSUER.companyId"
								@click="cancelSettle(item.id)"
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
									<a-menu-item v-if="item.pdfPath">
										<a
											href="javascript:void(0)"
											@click="pdfShow(item)"
											>查看结算单</a
										>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
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
				<a-button @click="downPdf(currentPreviewInfo)">下载PDF</a-button>
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

		<!-- 结算单作废确认书 -->
		<a-modal
			centered
			title="结算单作废确认书"
			v-model="modalCancelPdfIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-pdf"
		>
			<template slot="footer">
				<a-button
					type="primary"
					@click="submitCancel"
					>提交</a-button
				>
				<a-button @click="modalCancelPdfIsShow = false">取消</a-button>
			</template>
			<pdf-preview
				v-if="cancelPdfShowUrl"
				:url="cancelPdfShowUrl"
			></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GetTableSorter } from '@/v2/api';
import SortField from '@/v2/components/SortField';
import iPagination from '@sub/components/iPagination';
import {
	API_SteelsStatementMyStatementList,
	API_SteelsDownloadFilesPath,
	API_SubmitSettlementCancel,
	API_SteelsStatementDelete,
	API_SteelsStatementStatementCancel,
	API_SteelsStatementStatementQuit
} from '@/v2/center/steels/api/settle.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { filterCodeByValueName, filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const columns = [
	{
		title: '结算单所属合同类型',
		dataIndex: 'contractType',
		customRender: (text, item) => {
			return text == 'BUY' ? '采购结算单' : '销售结算单';
		}
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo'
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName'
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName'
	},
	{
		title: '结算单类型',
		dataIndex: 'type',
		customRender: text => {
			return text == 'PRE_STAT' ? '预结算单' : '结算单';
		}
	},
	{
		title: '结算金额（元）',
		dataIndex: 'settleAmount',
		key: 'settleAmount',
		scopedSlots: {
			customRender: 'settleAmount'
		}
	},
	{
		title: '结算日期',
		dataIndex: 'settleTime',
		customRender: text => {
			return text ? text.slice(0, 10) : '-';
		}
	},
	{
		title: '状态',
		dataIndex: 'status',
		customRender: text => {
			return filterCodeByValueName(text, 'statementStatus') || text;
		}
	},
	{
		title: '结算单编号',
		dataIndex: 'statementNo'
	},
	{
		title: '生成方式',
		dataIndex: 'sourceDesc',
		key: 'sourceDesc'
	},
	{
		key: 'action',
		fixed: 'right',
		title: '操作',
		scopedSlots: {
			customRender: 'action'
		}
	}
];
const searchList = [
	{
		decorator: ['statementNo'],
		addonBeforeTitle: '结算单编号',
		type: 'input',
		placeholder: '请输入结算单编号',
		allowClear: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['sellerCompanyName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称',
		allowClear: true
	},
	{
		decorator: ['buyCompanyName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称',
		allowClear: true
	},
	{
		decorator: ['date2'],
		addonBeforeTitle: '结算日期',
		realKey: ['settleDateBegin', 'settleDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
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
		decorator: ['status'],
		addonBeforeTitle: '结算单状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('statementStatus')
	}
];
export default {
	name: '',
	mixins: [ListMixin],
	data() {
		return {
			colSpan,
			formLayout,
			getPopupContainer,
			flag: false,
			sortArr: [],
			menuType: '',
			columns,
			params: {
				// orderName:'',
				contractNo: '',
				serialNo: '',
				settleAmount: '',
				companyName: '',
				buyerName: '',
				status: '',
				settleDateBegin: '',
				settleDateEnd: '',
				pageNo: ''
			},
			confirmTime: null,
			settleStatus: filterSteelsCodeByKey('statementStatus'),
			settleType: filterSteelsCodeByKey('statementType'),
			item: [],
			dataSource: [],
			modalPdfIsShow: false,
			pdfShowUrl: '',
			visible: false,
			reasonName: '',
			settleId: null,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			url: {
				list: API_SteelsStatementMyStatementList
			},
			cancelPdfShowUrl: '',
			modalCancelPdfIsShow: false,
			currentPreviewInfo: {},
			loading: false,
			searchList
		};
	},
	components: {
		SortField,
		iPagination,
		PdfPreview
	},
	mounted() {
		let arr = window.location.pathname.split('/');
		this.menuType = arr[arr.length - 1];
		this.oldColumns = this.columns;
		// this.getOrder({
		//   menuType: this.menuType,
		//   companyId: this.VUEX_ST_COMPANYSUER.companyId
		// })
		// this.$nextTick(() => {
		//   let listParmas = this.listParmas
		//   if (listParmas.type == this.pagination.type) {
		//     this.getList(listParmas.pageNo)
		//   } else {
		//     this.getList()
		//   }
		// })
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		...mapMutations({}),
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
		cancel() {
			this.flag = false;
		},
		onPageState() {
			//点击操作中的按钮，保存分页状态
			// this.VUEX_setListPamars(this.pagination)
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			// this.params = {
			//   // orderName:'',
			//   contractNo: '',
			//   serialNo: '',
			//   settleAmount: '',
			//   companyName: '',
			//   buyerName: '',
			//   status: '',
			//   settleDateBegin: '',
			//   settleDateEnd: '',
			//   pageNo: '',
			// }
			this.pagination.pageNo = 1;
			// this.confirmTime = null
			// this.getList()
		},
		confirmGetTime(value, dateString) {
			this.params.settleDateBegin = dateString[0];
			this.params.settleDateEnd = dateString[1];
		},
		// getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
		//   this.pagination.pageNo = pageNo
		//   this.params.pageNo = pageNo
		//   this.params.pageSize = pageSize
		//   for (const k in this.params) {
		//     if(!this.params[k]){
		//       delete this.params[k]
		//     }
		//   }
		//   const params = {
		//     ...this.searchParams,
		//     pageSzie: this.pageSize,

		//   }
		//   this.loading = true;
		//   API_SteelsStatementMyStatementList(this.params).then(res => {
		//     if (res.success) {
		//       this.dataSource = res.data.records;
		//       this.pagination.total = res.data.total
		//     }
		//   }).finally(() => {
		//     this.loading = false;
		//   })
		// },
		pdfShow(item) {
			this.currentPreviewInfo = item;
			this.modalPdfIsShow = true;
			this.pdfShowUrl = item.pdfPath;
		},
		deleteSettle(id) {
			const t = this;
			this.$confirm({
				centered: true,
				title: '提示',
				content: '您确定删除该条信息？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_SteelsStatementDelete({ id }).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
							t.getList();
						}
					});
				}
			});
		},
		// 取消结算单
		cancelSettle(id) {
			const that = this;
			API_SteelsStatementStatementQuit(id).then(res => {
				if (res.success) {
					that.$message.success('操作成功');
					that.getList();
				}
			});
		},

		// 下载
		async downPdf(record) {
			const fileFormat = record.pdfPath.split('?')[0].split('.').pop().toLowerCase();
			const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			const res = await API_SteelsDownloadFilesPath({ filePath: record.pdfPath });
			comDownload(res, null, `结算单(${record.sellCompanyName}-${record.buyCompanyName})-${record.statementNo}.${fileFormat}`);
		},
		//作废
		toVoid(id) {
			const t = this;
			this.$confirm({
				centered: true,
				title: '提示',
				content: '您确定作废该条结算单？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					t.settleId = id;
					API_SteelsStatementStatementCancel({ id }).then(res => {
						if (res.success) {
							if (!(res.data == true)) {
								t.$message.error(res.data);
								return;
							} else {
								// API_GetSettlementCancelPDF({statementId: id}).then(rest => {
								//   if (rest.success) {
								//     this.cancelPdfShowUrl = rest.data
								//     this.modalCancelPdfIsShow = true
								//   }
								// })
								t.getList();
								t.$message.success('操作成功');
							}
						}
					});
				}
			});
		},
		submitCancel() {
			// 提交结算单作废确认书
			API_SubmitSettlementCancel({
				statementId: this.settleId,
				validPdf: this.cancelPdfShowUrl
			}).then(res => {
				if (res.success) {
					this.modalCancelPdfIsShow = false;
					this.$message.success('作废成功');
					this.getList();
				}
			});
		},
		// 修改
		edit(item) {
			const query = {
				contractTemplate: item.contractTemplate,
				contractType: item.contractType,
				steelType: item.steelType,
				contractId: item.contractId,
				contractNo: item.contractNo,
				businessType: item.businessType,
				generateWay: item.generateWay,
				contractType: item.contractType,
				type: 'edit',
				deliveryMode: item.deliveryMode
			};

			const flag1 = ['SOURCING_AGENT'].includes(item.businessType);
			const flag2 = ['AFFILIATED_BUSINESS'].includes(item.businessType) && item.deliveryMode == 'FACTORY_MENTION';

			// 只能是代采 和 联营厂提的
			if (item.source == 'PLATFORM_SUPPLEMENT' && (flag1 || flag2)) {
				this.$router.push({
					path: '/center/steels/settle/additional',
					query: {
						statementId: item.id,
						type: 'edit',
						contractId: item.contractId,
						generateWay: item.generateWay,
						contractType: item.contractType,
						deliveryMode: item.deliveryMode
					}
				});
				return;
			}
			this.$router.push({
				path: 'settleApply?statementId=' + item.id + '&type=edit',
				query
			});
		},
		// 提交
		submit(item) {
			const flag1 = ['SOURCING_AGENT'].includes(item.businessType);
			const flag2 = ['AFFILIATED_BUSINESS'].includes(item.businessType) && item.deliveryMode == 'FACTORY_MENTION';
			if (item.source == 'PLATFORM_SUPPLEMENT' && (flag1 || flag2)) {
				this.$router.push({
					path: '/center/steels/settle/additional',
					query: {
						statementId: item.id,
						contractId: item.contractId,
						generateWay: item.generateWay,
						contractType: item.contractType,
						deliveryMode: item.deliveryMode,
						type: 'submit'
					}
				});
			} else {
				this.$router.push({
					path: 'settleApplyDetail',
					query: {
						statementId: item.id,
						type: 'submit',
						contractId: item.contractId,
						generateWay: item.generateWay,
						contractType: item.contractType,
						deliveryMode: item.deliveryMode
					}
				});
			}
		},
		// 确认
		settleConfirm(item) {
			// :to="{path:'settleConfirmDetail?orderId=' + item.orderId + '&id=' + item.id + '&contractId=' + item.contractId + '&statementId=' + item.id}">
			const query = {
				id: item.id,
				statementId: item.id,
				orderId: item.orderId || '',
				type: 'view',
				contractId: item.contractId,
				contractType: item.contractType,
				deliveryMode: item.deliveryMode,
				generateWay: item.generateWay
			};
			this.$router.push({
				path: 'settleConfirmDetail',
				query
			});
		},
		// 查看
		goView(item) {
			const query = {
				statementId: item.id,
				type: 'view',
				contractId: item.contractId,
				contractType: item.contractType,
				deliveryMode: item.deliveryMode,
				generateWay: item.generateWay
			};
			// 采购合同 --业务类型代采、联营（厂提）依据采购合同的货物明细补录结算单--补录结算单
			// 采购-业务类型为应收（非废钢）、代采+仓押、仓押、联营（“是否入库”选择为入库）时，依据货转开具结算单--补录结算单
			if (item.source == 'PLATFORM_SUPPLEMENT' && item.contractType == 'BUY') {
				this.$router.push({
					path: 'settleApplyDetailbl',
					query
				});
			} else {
				// 采购-应收（废钢）--依据货转开具结算单--线上结算单
				// 采购-业务类型为其他（中间）--依据放货通知单开具结算单--电子结算单--未测试

				// 业务类型为应收时，通过补录方式开具结算单--补录结算单
				// 销售合同补录生成时，无论业务类型，通过补录方式开具结算单--补录结算单
				this.$router.push({
					path: 'settleApplyDetail',
					query
				});
			}
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
    .row:nth-child(even)
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
