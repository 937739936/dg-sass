<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>收货证明</span
				>
				<div v-auth="['dgChain:lading:receipt:apply', 'logisticsStorageCenter:lading:receipt:apply']">
					<a-button
						type="primary"
						@click="receiptProveApply"
					>
						<span style="font-size: 14px">开具收货证明</span>
					</a-button>
				</div>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handleSearchChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-tabs
				v-model="defaultParams.issuedFlag"
				@change="issuedFlagChange"
			>
				<a-tab-pane
					key="2"
					tab="已收到"
				>
				</a-tab-pane>
				<a-tab-pane
					key="1"
					tab="已开具"
				>
				</a-tab-pane>
			</a-tabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<div
						slot="statusDesc"
						slot-scope="text, item"
						:class="`statusDes status-${item.status}`"
					>
						{{ text || '-' }}
					</div>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<a-space>
							<!-- OA审批中--查看、下载
              待签约--查看、盖章、删除
              已作废--查看
              OA审批驳回--查看、编辑、删除
              已生效--查看、下载、作废 -->
							<a
								href="javascript:void(0)"
								v-auth="['dgChain:lading:receipt:view']"
								@click="handleViewDetail(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								v-auth="['dgChain:lading:receipt:edit', 'logisticsStorageCenter:lading:receipt:edit']"
								@click="handleModify(item)"
								v-if="item.status == 'OA_REJECT'"
								>编辑</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:seal'"
								@click="goStamp(item)"
								v-if="item.status == 'TO_BE_SIGN'"
								>盖章</a
							>
							<a
								href="javascript:void(0)"
								v-auth="['dgChain:lading:receipt:download', 'logisticsStorageCenter:lading:receipt:download']"
								@click="downloadPdf(item)"
								v-if="item.status == 'OA_AUDIT' || item.status == 'EFFECTIVE'"
								>下载</a
							>
							<a
								href="javascript:void(0)"
								v-auth="['dgChain:lading:receipt:cancel', 'logisticsStorageCenter:lading:receipt:cancel']"
								@click="startInvalid(item.id)"
								v-if="item.status == 'EFFECTIVE' && defaultParams.issuedFlag == '1'"
								>作废</a
							>
							<a
								href="javascript:void(0)"
								v-auth="['dgChain:lading:receipt:delete', 'logisticsStorageCenter:lading:receipt:delete']"
								@click="deleteItem(item)"
								v-if="item.status == 'OA_REJECT' || item.status == 'TO_BE_SIGN'"
								>删除</a
							>
						</a-space>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<SelectRecordModal
			ref="selectRecordModal"
			@confirmSelectRecordOutList="confirmSelectRecordOutList"
		/>
		<a-modal
			v-model="isShowInvalidModal"
			title="作废原因"
			@ok="confirmInvalid"
			cancelText="取消"
			okText="确定"
			@cancel="isShowInvalidModal = false"
		>
			<a-input
				v-model.trim="invalidParams.remark"
				placeholder="请输入作废原因"
				:maxLength="255"
			/>
		</a-modal>
		<modalInfo
			ref="deleteModalInfo"
			@verify="confirmDeleteItem"
			:title="'提示信息'"
			:tip="'确认删除该条数据？'"
		/>
	</div>
</template>

<script>
import {
	API_getReceiptList,
	API_downLoadReceiptFile,
	API_invalidReceiptFile,
	API_deleteReceiptFile
} from '@/v2/center/trade/api/newLading';
import modalInfo from '@/v2/components/modalInfo/info';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import comDownload from '@sub/utils/comDownload.js';
import SelectRecordModal from './record';
export default {
	mixins: [ListMixin],
	components: {
		SelectRecordModal,
		modalInfo
	},
	data() {
		return {
			searchList: searchList,
			// issuedFlag: "2",
			url: {
				list: API_getReceiptList
			},
			defaultParams: {
				issuedFlag: '2'
			},
			isShowInvalidModal: false,
			invalidParams: {
				id: '',
				remark: ''
			}, // 作废信息
			deleteId: '' // 删除条目id
		};
	},
	computed: {
		columns() {
			let list = columns;
			list = columns.filter(item => {
				if (this.defaultParams.issuedFlag == '1') {
					// 已开具
					return item.dataIndex != 'initiatorName';
				} else if (this.defaultParams.issuedFlag == '2') {
					// 已收到
					return item.dataIndex != 'receiverName';
				}
			});
			return list;
		},
		modulePath() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return modulePath;
		}
	},
	methods: {
		resetFunc() {},
		handleSearchChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		issuedFlagChange() {
			// this.defaultParams.issuedFlag = this.issuedFlag;
			// this.getList();
			this.resetSearchQuery();
		},
		resetSearchQuery() {
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
		},
		receiptProveApply() {
			// 开具收货证明
			this.$refs.selectRecordModal.showModal();
		},
		// 选择出库记录
		confirmSelectRecordOutList(recordOutList) {
			let outIdLists = '';
			recordOutList.forEach(value => {
				outIdLists = outIdLists + value.serialNo + ',';
			});

			outIdLists = outIdLists.substr(0, outIdLists.length - 1);

			this.$router.push({
				path: `/center/${this.modulePath}/receipt/add`,
				query: {
					contractType: recordOutList[0].contractType,
					orderContractId: recordOutList[0].contractId,
					outboundNoList: outIdLists
				}
			});
		},
		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/receipt/detail`,
				query: {
					id: item.id
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/receipt/add`,
				query: {
					recordId: item.id,
					contractType: item.contractType,
					contractId: item.contractId,
					edit: 'edit'
				}
			});
		},
		// 盖章
		goStamp(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/receipt/stamp`,
				query: {
					contractTemplate: item.contractTemplate,
					id: item.id
				}
			});
		},
		downloadPdf(item) {
			// 下载pdf
			API_downLoadReceiptFile({ id: item.id })
				.then(res => {
					comDownload(res.data, undefined, res.name);
					// if (res.success) {
					// }
					// if (res?.error?.message) {
					//   this.$message.error(res?.error?.message);
					// }
				})
				.catch(e => {
					console.error('下载报错：', e);
				});
		},
		startInvalid(id) {
			// 开启作废
			this.isShowInvalidModal = true;
			this.invalidRemark = '';
			this.invalidParams.id = id;
		},
		confirmInvalid() {
			// 确认作废
			if (this.invalidParams.remark != null && this.invalidParams.remark != '' && this.invalidParams.remark != undefined) {
				API_invalidReceiptFile({
					...this.invalidParams
				}).then(res => {
					this.$message.success('作废成功！');
					this.isShowInvalidModal = false;
					this.getList();
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 删除
		deleteItem(record) {
			this.deleteId = record.id;
			this.$refs.deleteModalInfo.open();
		},
		// 确定删除
		confirmDeleteItem() {
			API_deleteReceiptFile({
				id: this.deleteId
			}).then(res => {
				this.$refs.deleteModalInfo.close();
				if (res.success && res.data) {
					this.deleteId = '';
					this.$message.success('删除成功！');
					this.getList();
				}
			});
		}
	}
};
const statusList = [
	{
		label: 'OA审批中',
		value: 'OA_AUDIT'
	},
	{
		label: '待签约',
		value: 'TO_BE_SIGN'
	},
	{
		label: 'OA审批驳回',
		value: 'OA_REJECT'
	},
	{
		label: '已作废',
		value: 'CANCEL'
	},
	{
		label: '已生效',
		value: 'EFFECTIVE'
	}
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、收货证明或出库编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入收货证明开具方或接收方企业名称'
	},
	{
		decorator: ['openDate'],
		addonBeforeTitle: '提货日期',
		type: 'rangePicker',
		realKey: ['openDateStart', 'openDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: statusList
	}
];
const customRender = text => text || '-';
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		// width: 150,
		customRender
	},
	{
		title: '收货证明编号',
		dataIndex: 'receiptNo',
		// width: 150,
		customRender
	},
	{
		title: '关联出库编号',
		dataIndex: 'outboundNos',
		width: 320,
		customRender
	},
	{
		title: '收货证明开具方',
		dataIndex: 'initiatorName',
		// width: 150,
		customRender
	},
	{
		title: '收货证明接收方',
		dataIndex: 'receiverName',
		// width: 150,
		customRender
	},

	{
		title: '收货数量(吨)',
		dataIndex: 'quantity',
		// width: 150,
		customRender
	},
	{
		title: '收货证明开具日期',
		dataIndex: 'openDate',
		// width: 150,
		customRender
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		// width: 150,
		scopedSlots: {
			customRender: 'statusDesc'
		}
	},
	{
		title: '最新操作时间',
		dataIndex: 'updateDate',
		// width: 150,
		customRender
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: {
			customRender: 'action'
		},
		fixed: 'right'
	}
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.export-box {
	//   cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: -2px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: @primary-color;
		line-height: 20px;
	}
}

.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	&.status-OA_AUDIT {
		// OA审批中
		background: #ffdac8;
		color: #ff7937;
	}
	&.status-TO_BE_SIGN {
		// 待签约
		background: #d3dffb;
		color: #4682f3;
	}
	&.status-OA_REJECT {
		// OA申请驳回
		background: #f2d0d0;
		color: #dd4444;
	}
	&.status-CANCEL {
		// 已作废
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
	&.status-EFFECTIVE {
		// 已生效
		background: #c5ecdd;
		color: #3eb384;
	}
}
</style>
