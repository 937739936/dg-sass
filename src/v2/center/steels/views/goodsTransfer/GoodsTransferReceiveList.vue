<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>我收到的货转</span
				>
				<div>
					<a-button
						v-auth="'steel:goodsTransfer:receiveGT:additional'"
						type="primary"
						@click="goSelectContract"
					>
						<span style="font-size: 14px">补录货转</span>
					</a-button>
				</div>
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
				<div class="bulk-download-btn">
					<a-button
						type="primary"
						@click="handleBulkDownload"
						v-auth="'steel:goodsTransfer:receiveGT:batchdownload'"
						>批量下载</a-button
					>
				</div>
				<a-table
					:rowSelection="rowSelection"
					:pagination="false"
					:columns="columns"
					class="new-table"
					:data-source="dataSource"
					:scroll="{ x: true }"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
				>
					<span slot="customTitle"> 操作 </span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!-- 待提交 -->
						<template v-if="item.status == 'WAIT_SUBMIT'">
							<a
								href="javascript:void(0)"
								v-if="item.steelType != 'SCRAP_STEEL' && item.initiator"
								@click="handleModify(item)"
								>修改</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.initiator"
								@click="cancelGoodsTransfer(item.id)"
								>取消</a
							>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								>查看</a
							>
						</template>
						<!-- 待确认 -->
						<template v-if="item.status == 'WAIT_CONFIRM'">
							<!-- 货转确认 -->
							<a
								href="javascript:void(0)"
								v-if="!item.initiator"
								v-auth="'steel:goodsTransfer:receiveGT:confirm'"
								@click.self="transferConfirm(item)"
								>确认</a
							>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:receiveGT:view'"
								>查看</a
							>
						</template>
						<!-- 待签约 -->
						<template v-if="item.status == 'WAIT_SIGN'">
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:receiveGT:view'"
								>查看</a
							>
						</template>
						<!-- 已签约 -->
						<template v-if="item.status == 'SIGNED'">
							<a
								href="javascript:void(0)"
								@click.self="hzShow(item)"
								>查看货转</a
							>
							<!-- 必须是发起方 -->
							<template v-if="item.initiator">
								<a
									href="javascript:void(0)"
									@click.prevent="invalid(item.id)"
									>作废</a
								>
							</template>

							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:receiveGT:view'"
								>查看</a
							>
						</template>
						<!-- 已作废 驳回 -->
						<template v-if="item.status == 'CANCEL' || item.status == 'REJECT'">
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:receiveGT:view'"
								>查看</a
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
				<a-button
					key="back"
					@click="modalPdfIsShow = false"
					style="margin: 0 10px"
					>关闭</a-button
				>
			</template>
			<pdf-preview
				v-if="pdfUrl"
				:url="pdfUrl"
			></pdf-preview>
		</a-modal>
		<a-modal
			v-model="visible"
			title="作废原因"
			@ok="handleOk"
			cancelText="取消"
			okText="确定"
			@cancel="visible = false"
		>
			<a-input
				v-model.trim="invalidParams.reason"
				placeholder="请输入作废原因"
			/>
		</a-modal>
		<sort-field
			:flag="flag"
			:arr="sortArr"
			@cancel="cancel"
			:menuType="menuType"
			@reload="reload"
		></sort-field>
		<ProofModel
			ref="proofModel"
			type="hzzm"
			:show="false"
		/>
		<AccessoryModal ref="multiAttachmentPreview"></AccessoryModal>
	</div>
</template>

<script>
import { API_GetTableSorter, API_getCommonBatchDownload, API_DOWNLPREVIEWTE } from '@/v2/api';
import {
	API_SteelsGoodstransferBatchDownload,
	API_SteelsGoodstransferDetail,
	API_SteelsGoodstransferCancel,
	API_SteelsGoodstransferQuit,
	API_SteelsGoodstransferPageRecevieGoodsTransfer
} from '@/v2/center/steels/api/goodsTransfer.js';
import SortField from '@/v2/components/SortField';
import iPagination from '@sub/components/iPagination';
import { mapMutations } from 'vuex';

import PdfPreview from '@sub/components/pdf/index.vue';
import AccessoryModal from '@/v2/center/steels/components/funds/AccessoryModal.vue';
import { filterSteelsCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import ProofModel from '@/v2/components/receive/ProofModel';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['transferNo'],
		addonBeforeTitle: '货转编号',
		type: 'input',
		placeholder: '请输入货转编号',
		allowClear: true
	},
	{
		decorator: ['steelType'],
		addonBeforeTitle: '钢材种类',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('steelType')
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('contractBusinessType')
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
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
		addonBeforeTitle: '货转日期',
		realKey: ['transferProcessTimeBegin', 'transferProcessTimeEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('goodsTransferStatus').filter(i => {
			return i.value != 'QUIT';
		})
	}
];

export default {
	name: 'GoodsTransferReceiveList',
	mixins: [ListMixin],
	data() {
		return {
			flag: false,
			url: {
				list: API_SteelsGoodstransferPageRecevieGoodsTransfer
			},
			colSpan,
			formLayout,
			sortArr: [],
			menuType: '',
			searchList,
			selectedRowKeys: [],
			columns: [
				{
					title: '货转编号',
					dataIndex: 'transferNo'
				},
				{
					title: '货转开具时间',
					dataIndex: 'transferProcessTime',
					customRender: text => {
						return text ? text.slice(0, 10) : '-';
					}
				},
				{
					title: '货转数量(吨)',
					dataIndex: 'transferQuantity'
				},
				{
					title: '状态',
					dataIndex: 'status',
					key: 'status',
					customRender: text => {
						return filterCodeByValueName(text, 'goodsTransferStatus') || text;
					}
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '卖方名称',
					dataIndex: 'sellCompanyName'
				},
				{
					title: '钢材种类',
					dataIndex: 'steelTypeDesc'
				},
				{
					title: '业务类型',
					dataIndex: 'businessTypeDesc'
				},
				// {
				//   title: '收货人简称',
				//   dataIndex: 'downstreamCompanyAbbr',
				//   customRender: (text) => {
				//     return text || '-'
				//   },
				//   sorter: true
				// },
				{
					title: '发运方式',
					dataIndex: 'transportMode',
					customRender: text => {
						return filterCodeByValueName(text, 'transportMode') || text;
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
			],

			receiveDate: null,
			recordList: [],
			pdfUrl: '',
			modalPdfIsShow: false,
			visible: false,
			// 作废
			invalidParams: {
				goodsTransferId: '',
				reason: ''
			},
			pagination: {
				type: 'GoodsTransferReceiveList',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false
		};
	},
	components: {
		SortField,
		iPagination,
		PdfPreview,
		ProofModel,
		AccessoryModal
	},
	computed: {
		rowSelection() {
			const _this = this;
			return {
				type: 'checkbox',
				selectedRowKeys: _this.selectedRowKeys,
				onChange: keys => {
					_this.selectedRowKeys = keys;
				}
			};
		}
	},
	mounted() {},
	methods: {
		downloadPdf(url) {
			if (url.indexOf(',') == -1) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url);
				});
			} else {
				API_getCommonBatchDownload({
					zipFileName: '货转证明',
					files: url
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		...mapMutations({
			VUEX_initListParmas: 'pagination/VUEX_initListParmas',
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		onClickRow(record) {
			return {
				on: {
					click: () => {
						let index = this.selectedRowKeys.findIndex(id => {
							return id === record.id;
						});
						index === -1 ? this.selectedRowKeys.push(record.id) : this.selectedRowKeys.splice(index, 1);
					}
				}
			};
		},
		handleTableSort(pagination, filters, sorter, { currentDataSource }) {
			// 名称字段排序
			this.params.field = sorter.field;
			this.params.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		getOrder(data) {
			//页面加载获取表格字段顺序
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
			//组件排序后回调函数
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
			//初始化表格字段，传入组件
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
			// 关闭排序弹窗回调函数
			this.flag = false;
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		// 查看货转pdf
		hzShow(item) {
			if (item.pdfPath) {
				this.modalPdfIsShow = true;
				this.pdfUrl = item.pdfPath;
			} else {
				this.lookHz(item);
			}
		},
		lookHz(item) {
			API_SteelsGoodstransferDetail({
				id: item.id
			}).then(res => {
				if (res.success) {
					res.data.attachmentFileVO.forEach(element => {
						element.typeName = element.typeDesc;
						element.url = element.path;
					});
					if (res.data && res.data.attachmentFileVO && res.data.attachmentFileVO.length) {
						this.$refs.multiAttachmentPreview.showModal(res.data.attachmentFileVO);
					}
				}
			});
		},
		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `goodsTransferApplyDetail?id=${item.id}`,
				query: {
					contractTemplate: item.contractTemplate
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/godsTransferAdditional',
				query: {
					goodsTransferId: item.id,
					contractId: item.contractId,
					generateWay: item.generateWay,
					type: 'edit',
					serialNo: item.transferNo
				}
			});
		},
		// 批量下载
		handleBulkDownload() {
			if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
				this.$message.error('请先选择一条数据');
			} else {
				API_SteelsGoodstransferBatchDownload({
					goodsTransferIds: this.selectedRowKeys.join(',')
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		// 货转确认
		transferConfirm(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/GoodsTransferConfirmApply',
				query: {
					contractTemplate: item.contractTemplate,
					id: item.id,
					flag: 'add'
				}
			});
		},
		// 盖章
		stamp(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/goodsTransferStampDetail',
				query: {
					id: item.id,
					pdfPath: item.pdfPath
				}
			});
		},
		// 补录货转
		goSelectContract() {
			this.$router.push({
				path: '/center/steels/goodsTransfer/goodsTransferAdditionalList'
			});
		},
		// 作废
		invalid(id) {
			this.visible = true;
			this.invalidParams.reason = '';
			this.invalidParams.goodsTransferId = id;
		},
		handleOk() {
			if (this.invalidParams.reason != null && this.invalidParams.reason != '' && this.invalidParams.reason != undefined) {
				API_SteelsGoodstransferCancel(this.invalidParams).then(res => {
					if (res.success) {
						this.$message.success('作废成功！');
						this.visible = false;
						this.getList();
					} else {
						this.$message.error(res.message);
					}
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 取消、删除
		cancelGoodsTransfer(id) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除该条数据？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_SteelsGoodstransferQuit({ goodsTransferId: id }).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
							t.getList();
						}
					});
				}
			});
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.record-list {
	.bulk-download-btn {
		text-align: right;
		margin-bottom: 10px;
	}

	.ant-table-wrapper {
		a {
			display: inline-block;
			margin-right: 8px;

			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
