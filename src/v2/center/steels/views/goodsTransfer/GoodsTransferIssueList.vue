<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>我开具的货转</span
				>
				<a-button
					type="primary"
					@click="$router.push('/center/steels/goodsTransfer/goodsTransferApplyList')"
					v-auth="'steel:goodsTransfer:openGT:add'"
				>
					<div style="font-size: 14px">货转开具</div>
				</a-button>
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
			<div class="record-list">
				<div class="bulk-download-btn">
					<a-button
						v-auth="'steel:goodsTransfer:openGT:batchdownload'"
						type="primary"
						@click="handleBulkDownload"
						>批量下载
					</a-button>
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
					<span slot="customTitle"> 操作</span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!---待提交 -->
						<template v-if="item.status == 'WAIT_SUBMIT'">
							<template v-if="item.initiator">
								<a
									href="javascript:void(0)"
									@click="handleModify(item)"
									v-auth="'steel:goodsTransfer:openGT:edit'"
									>修改</a
								>
								<a
									href="javascript:void(0)"
									@click="handleSubmit(item)"
									v-auth="'steel:goodsTransfer:openGT:edit'"
									>提交</a
								>
								<a
									href="javascript:void(0)"
									@click="cancelGoodsTransfer(item.id)"
									v-auth="'steel:goodsTransfer:openGT:edit'"
									>取消</a
								>
							</template>
							<template v-else>
								<a
									href="javascript:void(0)"
									@click="handleViewDetail(item)"
									v-auth="'steel:goodsTransfer:openGT:view'"
									>查看</a
								>
							</template>
						</template>
						<!-- 待签约  -->
						<template v-if="item.status == 'WAIT_SIGN'">
							<a
								href="javascript:void(0)"
								v-if="item.initiator"
								@click.self="stamp(item)"
								v-auth="'steel:goodsTransfer:openGT:sign'"
								>盖章</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.initiator"
								@click.prevent="invalid(item.id)"
								v-auth="'steel:goodsTransfer:openGT:edit'"
								>作废</a
							>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:openGT:view'"
								>查看</a
							>
						</template>
						<!-- 已签约-->
						<template v-if="item.status == 'SIGNED'">
							<a
								href="javascript:void(0)"
								@click.self="hzShow(item)"
								>查看货转</a
							>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:openGT:view'"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.initiator"
								@click.prevent="invalid(item.id)"
								v-auth="'steel:goodsTransfer:openGT:edit'"
								>作废</a
							>
							<a
								href="javascript:void(0)"
								v-if="item.initiator"
								@click.prevent="downloadPdf(item)"
								v-auth="'steel:goodsTransfer:receiveGT:download'"
								>下载</a
							>
						</template>
						<!-- 已作废 待确认 驳回-->
						<template v-if="item.status == 'CANCEL'">
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:openGT:view'"
								>查看</a
							>
						</template>
						<!-- 待确认 -->
						<template v-if="item.status == 'WAIT_CONFIRM'">
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:openGT:view'"
								>查看</a
							>
						</template>
						<!-- 驳回 -->
						<template v-if="item.status == 'REJECT'">
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
								v-auth="'steel:goodsTransfer:openGT:view'"
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

		<ProofModel
			ref="proofModel"
			type="hzzm"
			:show="false"
		/>
		<AccessoryModal ref="multiAttachmentPreview"></AccessoryModal>
	</div>
</template>

<script>
import { API_GetTableSorter, API_getCommonBatchDownload } from '@/v2/api';
import {
	API_SteelsGoodstransferBatchDownload,
	API_SteelsGoodstransferPageGoodsTransfer,
	API_SteelsGoodstransferCancel,
	API_SteelsGoodstransferQuit,
	API_SteelsGoodstransferDetail,
	API_SteelsDownloadFilesPath
} from '@/v2/center/steels/api/goodsTransfer.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { filterCodeByValueName, filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import ProofModel from '@/v2/components/receive/ProofModel';
import AccessoryModal from '@/v2/center/steels/components/funds/AccessoryModal.vue';
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
	name: 'SteelsGoodsTransferIssueList',
	mixins: [ListMixin],
	data() {
		return {
			url: {
				list: API_SteelsGoodstransferPageGoodsTransfer
			},
			searchList,
			flag: false,
			sortArr: [],
			menuType: '',
			selectedRowKeys: [],
			columns: [
				{
					title: '货转编号',
					dataIndex: 'transferNo'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
					// sorter: true
				},
				{
					title: '货转开具时间',
					dataIndex: 'transferProcessTime',
					customRender: text => {
						return text ? text.slice(0, 10) : '-';
					}
					// sorter: true
				},
				{
					title: '货转数量(吨)',
					dataIndex: 'transferQuantity'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc',
					key: 'statusDesc'
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
					// sorter: true
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
				//   key: 'downstreamCompanyAbbr',
				//   customRender: (text) => {
				//     return text || '-'
				//   },
				//   width: 130
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
					slots: { title: 'customTitle' },
					scopedSlots: { customRender: 'action' }
				}
			],
			receiveDate: null,
			recordList: [],
			pdfUrl: '',
			modalPdfIsShow: false,
			visible: false,
			invalidParams: {
				goodsTransferId: '',
				reason: ''
			},

			loading: false
		};
	},
	components: {
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
				},
				getCheckboxProps: record => ({
					props: {
						disabled: this.$route.query.flag == 'submit'
					}
				})
			};
		}
	},
	mounted() {},
	watch: {
		// dataSource(list) {
		//   this.recordList.forEach(item => {
		//       this.$set(item, 'disabled', item.status !== 'WAIT_SIGN' && item.status !== 'SIGNED')
		//     })
		// }
	},
	methods: {
		async downloadPdf(item) {
			if (item.pdfPath.indexOf(',') == -1) {
				const fileFormat = item.pdfPath.split('?')[0].split('.').pop().toLowerCase();
				const res = await API_SteelsDownloadFilesPath({ filePath: item.pdfPath });
				comDownload(res, null, `货转证明(${item.sellCompanyName}-${item.buyCompanyName})-${item.transferNo}.${fileFormat}`);
			} else {
				const res = await API_getCommonBatchDownload({ zipFileName: '货转证明', files: item.pdfPath });
				comDownload(res.data, undefined, res.name);
			}
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						if (record.status === 'WAIT_SIGN' || record.status === 'SIGNED') {
							let index = this.selectedRowKeys.findIndex(id => {
								return id === record.no;
							});
							index === -1 ? this.selectedRowKeys.push(record.no) : this.selectedRowKeys.splice(index, 1);
						}
					}
				}
			};
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
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
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
		},
		// 查看货转详情
		stamp(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/goodsTransferStampDetail',
				query: {
					id: item.id,
					pdfPath: item.pdfPath
				}
			});
		},
		confirm(item) {
			//确认盖章
			this.$router.push({
				name: 'goodsTransferConfirmDetail',
				query: {
					pdfUrl: item.pdfUrl,
					no: item.no
				}
			});
		},
		hzShow(item) {
			if (item.pdfPath) {
				this.modalPdfIsShow = true;
				this.pdfUrl = item.pdfPath;
			} else {
				this.lookHz(item);
			}
		},
		// 仓押业务
		lookHz(item) {
			API_SteelsGoodstransferDetail({
				id: item.id
			}).then(res => {
				if (res.success) {
					res.data.attachmentFileVO.forEach(element => {
						element.typeName = element.typeDesc;
						element.url = element.path;
					});
					this.$refs.multiAttachmentPreview.showModal(res.data.attachmentFileVO);
				}
			});
		},
		// 修改
		handleModify(item) {
			if (item.businessType == 'ACCOUNT_RECEIVABLE_OTHER') {
				this.$router.push({
					path: '/center/steels/goodsTransfer/GoodsTransferAdditionalApply',
					query: {
						contractNo: item.contractNo,
						contractTemplate: item.contractTemplate,
						contractId: item.contractId,
						generateWay: item.generateWay,
						goodsTransferId: item.id
					}
				});
			} else {
				this.$router.push({
					path: `goodsTransferApply?id=${item.id}&flag=edit`,
					query: {
						contractTemplate: item.contractTemplate
					}
				});
			}
		},
		// 提交
		handleSubmit(item) {
			if (item.businessType == 'ACCOUNT_RECEIVABLE_OTHER') {
				this.$router.push({
					path: '/center/steels/goodsTransfer/GoodsTransferAdditionalApply',
					query: {
						contractNo: item.contractNo,
						contractTemplate: item.contractTemplate,
						contractId: item.contractId,
						generateWay: item.generateWay,
						goodsTransferId: item.id,
						flag: 'submit'
					}
				});
			} else {
				this.$router.push({
					path: `goodsTransferApply?id=${item.id}&flag=submit`,
					query: {
						contractTemplate: item.contractTemplate
					}
				});
			}
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
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			if (this.url?.list) {
				this.pageSize = pageSize;
				this.pagination.pageNo = pageNo;
				const params = {
					...this.isorter,
					...this.defaultParams,
					...this.searchParams,
					...this.pagination,
					pageSize
				};
				delete params.issuedDate;
				this.loading = true;
				try {
					const res = await this.url.list(params);
					this.dataSource = res.data ? res.data.records : res.result.records;
					this.dataSource.forEach(item => {
						this.$set(item, 'disabled', item.status !== 'WAIT_SIGN' && item.status !== 'SIGNED');
					});
					this.pagination.total = res.data ? res.data.total : res.result.total;
					this.loading = false;
				} catch (error) {
					this.loading = false;
				}
			}
		},
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
		}
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

.search-btn {
	margin-right: 24px;
}
</style>
