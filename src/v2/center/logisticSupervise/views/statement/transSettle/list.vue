<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="s-title-btn">
				<span
					slot="title"
					class="slTitle"
					>运输结算单</span
				>
				<a-button
					type="primary"
					@click="settleAdd"
					v-auth="'logicDeliverMonitor:statementManager:deliver:add'"
					><span class="btn-text">补录线下结算单</span></a-button
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChangeForm"
				@resetFunc="resetFunc"
				class="trans-settle-list-wrap"
			></SlFormNew>
			<div class="tabs-box">
				<a-tabs
					v-model="status"
					@change="tabChange"
				>
					<a-tab-pane
						:key="item.text"
						v-for="item in statusData"
					>
						<template slot="tab">
							{{ item.text }}
							<!-- 待我方确认和待我方盖章加载数量 -->
							<span
								class="tabNum"
								v-if="tabNum[item.value]"
							>
								({{ tabNum[item.value] }})
							</span>
						</template>
					</a-tab-pane>
				</a-tabs>
			</div>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:pagination="false"
					:columns="OfflineColumns"
					:data-source="dataSource"
					rowKey="id"
					@change="handleTableSort"
					:scroll="{ x: true }"
					:loading="loading"
					class="new-table table-wrap"
				>
					<template
						slot="serialNo"
						slot-scope="serialNo, item"
					>
						<a-tooltip placement="topLeft">
							<template slot="title">
								<span>{{ item.serialNo || '-' }}</span>
							</template>
							<p class="text-overflow">{{ item.serialNo || '-' }}</p>
						</a-tooltip>
					</template>
					<template
						slot="paperContractNo"
						slot-scope="paperContractNo, item"
					>
						<a-tooltip placement="top">
							<template slot="title">
								<span>{{ item.paperContractNo || '-' }}</span>
							</template>
							<p class="text-overflow">{{ item.paperContractNo || '-' }}</p>
						</a-tooltip>
					</template>
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
					<template
						slot="statusDesc"
						slot-scope="text, item"
					>
						<span :class="[item.status == 'EFFECTIVE' ? 'status-btn status-confirm' : 'status-btn status-staff']">{{
							text
						}}</span>
					</template>
					<!-- WAIT_SUBMIT待确认 2驳回 EFFECTIVE已确认-->
					<span slot="customTitle"> 操作</span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<template>
							<!-- 发起方-WAIT_SUBMIT-待确认  查看、下载-，EFFECTIVE-已确认  查看、编辑、下载、删除， 2客户驳回 编辑、删除 -->
							<template>
								<a-space>
									<a
										href="javascript:void(0)"
										@click="toDetail(item)"
										>查看</a
									>
									<a
										v-if="item.status != 'EFFECTIVE'"
										href="javascript:void(0)"
										@click="editSettle(item)"
										v-auth="'logicDeliverMonitor:statementManager:deliver:edit'"
										>编辑</a
									>
									<a
										href="javascript:void(0)"
										@click="deleteSettle(item)"
										v-auth="'logicDeliverMonitor:statementManager:deliver:delete'"
										>删除</a
									>
								</a-space>
							</template>
						</template>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>

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
		</a-card>
		<TipModal
			ref="delModal"
			@ok="confirmDel"
			title="提示"
			cancelBtnText="取消"
			okBtnText="确定"
		>
			<div
				class="tip-box"
				style="margin-top: 20px"
			>
				<p>确定要删除该结算单吗？删除后，将无法恢复！</p>
			</div>
		</TipModal>
		<ContractList
			ref="contractSearchModal"
			@validateContract="validateContract"
			:contractForm="contractForm"
		/>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_CANCELREASONSETTLE,
	API_DOWNLPREVIEWTE,
	API_SubmitSettlementCancel,
	API_DownloadSettleFiles,
	API_OFFLINEBUYERORDERDDOWNLOAD,
	API_OFFLINESELLERORDERDDOWNLOAD
} from '@/v2/center/logisticSupervise/api/settle';
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import { API_SettleList, API_SettleListAmount, API_transport_settle_delete } from '@/v2/center/trade/api/transportContract';
import ContractList from '../components/ContractListTrans';
import TipModal from '@sub/components/DelModal.vue';

const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '结算日期',
		type: 'rangePicker',
		realKey: ['statementTimeStart', 'statementTimeEnd']
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '结算单编号',
		type: 'input',
		placeholder: '请输入结算单编号'
	}
];

const OfflineColumns = [
	{
		title: '结算单编号',
		dataIndex: 'serialNo',
		key: 'serialNo',
		scopedSlots: {
			customRender: 'serialNo'
		}
	},
	{
		title: '运输合同编号',
		dataIndex: 'paperContractNo',
		key: 'paperContractNo',
		scopedSlots: {
			customRender: 'paperContractNo'
		}
	},
	{
		title: '托运人',
		dataIndex: 'buyerName',
		key: 'buyerName',
		width: 150
	},
	{
		title: '承运人',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 150
	},
	{
		title: '结算金额',
		dataIndex: 'settleAmount',
		key: 'settleAmount',
		scopedSlots: {
			customRender: 'settleAmount'
		}
	},
	{
		title: '结算数量',
		dataIndex: 'settleQuantity',
		key: 'settleQuantity'
	},
	{
		title: '结算日期',
		dataIndex: 'statementTime',
		key: 'statementTime'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		key: 'statusDesc',
		slots: {
			title: 'statusDesc'
		},
		scopedSlots: {
			customRender: 'statusDesc'
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
export default {
	name: 'MySettleList',
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			searchList,
			OfflineColumns,
			params: {
				paperContractNo: '',
				serialNo: '',
				companyName: '',
				status: undefined,
				type: undefined,
				statementTimeStart: '',
				statementTimeEnd: '',
				pageNo: ''
			},
			status: '全部',
			url: {
				list: API_SettleList,
				count: API_SettleListAmount
			},
			defaultParams: {
				status: null, //默认展示状态
				productCode: 'LOGIC_DELIVER'
			},
			OfflineSettleStatus: filterCodeByKey('terminalStatementStatusDict'),
			item: [],
			dataSource: [],
			modalPdfIsShow: false,
			pdfShowUrl: '',
			visible: false,
			reasonName: '',
			settleId: null,
			pagination: {
				type: 'mySettleListOFFLINE',
				total: 0, // 总条数
				pageNo: 1
			},
			cancelPdfShowUrl: '',
			modalCancelPdfIsShow: false,
			tipShowText: '',
			activeKey: this.$route.query.activeKey || '1',
			settleTime: null,
			loading: false,
			statusData: [
				{
					value: '',
					text: '全部'
				},
				{
					value: 'WAIT_SUBMIT',
					text: '待提交'
				},
				{
					value: 'EFFECTIVE',
					text: '已生效'
				}
			],
			contractData: {},
			contractForm: {
				type: 'BUY',
				paperContractNo: ''
			},
			currentItem: {}
		};
	},
	components: {
		PdfPreview,
		ContractList,
		TipModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyId() {
			return this.VUEX_ST_COMPANYSUER.companyId;
		},
		//统计数量
		tabNum() {
			let tabNum = {};
			let dataCountSource = this.dataCountSource;
			//对接口返回数据做对应处理
			if (dataCountSource?.length) {
				this.statusData.map(item => {
					let data = dataCountSource.find(items => items.tabType == item.value);
					if (data) {
						tabNum[item.value] = data.stateNum;
					}
				});
			}
			return tabNum;
		}
	},
	created() {},
	methods: {
		...mapMutations({
			VUEX_initListParmas: 'pagination/VUEX_initListParmas',
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		validateContract(key) {
			if (key.length === 0) {
				this.$message.error('请选择合同！');
				return;
			}
			this.$router.push({
				path: '/center/logisticSupervise/statement/transSettle/add',
				query: {
					contractId: key[0]
				}
			});
		},
		handleChangeForm(data) {
			this.pagination.pageNo = 1;
			this.pagination.pageSize = 10;
			this.searchParams = data;
			this.getList();
		},
		//修改查询类型
		tabChange(val) {
			let value = this.statusData.find(item => item.text == val).value;
			this.defaultParams.status = value || null;
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getList();
		},
		resetFunc() {
			this.defaultParams.status = null;
			this.status = '全部';
		},

		settleAdd() {
			this.$refs.contractSearchModal.showModel();
		},
		handleTableSort(pagination, filters, sorter) {
			// 名称字段排序
			this.params.field = sorter.field;
			this.params.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetValues() {
			this.params = {
				paperContractNo: '',
				serialNo: '',
				companyName: '',
				status: undefined,
				type: undefined,
				statementTimeStart: '',
				statementTimeEnd: '',
				pageNo: ''
			};
			this.pagination.pageNo = 1;
			this.settleTime = null;
			this.getList();
		},
		pdfShow(url) {
			this.modalPdfIsShow = true;
			this.pdfShowUrl = url;
		},
		deleteSettle(item) {
			const t = this;
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		confirmDel() {
			let t = this;
			API_transport_settle_delete({
				statementId: t.currentItem.id,
				productCode: t.defaultParams.productCode
			}).then(res => {
				if (res.success) {
					t.$message.success('删除成功');
					t.$refs.delModal.close();
					t.getList();
				}
			});
		},
		// 取消结算单
		cancelSettle() {
			if (!this.reasonName) {
				this.$message.error('取消理由必填');
				this.visible = false;
				return;
			}
			const that = this;
			API_CANCELREASONSETTLE({
				statementId: this.settleId,
				cancelReason: this.reasonName,
				productCode: this.defaultParams.productCode
			}).then(res => {
				this.visible = false;
				if (res.code != 200) {
					that.$message.error(res.message);
					return;
				}
				that.$message.success('操作成功');
				that.getList();
			});
		},

		// 下载
		downPdf(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},
		submitCancel() {
			// 提交结算单作废确认书
			API_SubmitSettlementCancel({
				statementId: this.settleId,
				validPdf: this.cancelPdfShowUrl,
				productCode: this.defaultParams.productCode
			}).then(res => {
				if (res.success) {
					this.modalCancelPdfIsShow = false;
					this.$message.success('作废成功');
					this.getList();
				}
			});
		},

		downloadSettleFiles(item) {
			if (!item.attachmentList || item.attachmentList.length == 0) {
				return;
			}
			let name = `${item.typeDesc}-${item.serialNo}-${item.paperContractNo}-${item.sellerName}-${item.buyerName}`;
			API_DownloadSettleFiles({ statementId: item.id, productCode: this.defaultParams.productCode }).then(res => {
				if (item.attachmentList.length > 1) {
					comDownload(res, null, `${name}.zip`);
				} else {
					comDownload(res, null, `${item.attachmentList[0].fileName}`);
				}
			});
		},
		deleteIn(item) {
			API_transport_settle_delete({ statementId: item.id, productCode: this.defaultParams.productCode }).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('删除成功！');
						this.getList();
					}
				}
			});
		},
		//结算单详情页
		toDetail(item) {
			this.$router.push({
				path: '/center/logisticSupervise/statement/transSettle/detail',
				query: {
					statementId: item.id
				}
			});
		},
		editSettle(item) {
			this.$router.push({
				path: '/center/logisticSupervise/statement/transSettle/edit',
				query: {
					statementId: item.id
				}
			});
		},
		toConfirm(item) {
			// 接收方结算确认
			this.$router.push({
				path: '/center/receive/coal/statement/detail',
				query: {
					id: item.id
				}
			});
		},
		downloadContractFiles(item) {
			// 接收方下载线下合同
			let API =
				item.sellerBizNo == this.VUEX_ST_COMPANYSUER.companyUscc
					? API_OFFLINESELLERORDERDDOWNLOAD
					: API_OFFLINEBUYERORDERDDOWNLOAD;
			API({ id: item.terminalContractId }).then(res => {
				comDownload(res, undefined, '合同附件.zip');
			});
		},
		settleGetTime(value, dateString) {
			this.params.statementTimeStart = dateString[0];
			this.params.statementTimeEnd = dateString[1];
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
@import url('~@/v2/style/tabs-box.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;

	.tabNum {
		color: @primary-color;
	}
}
.s-title-btn {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
::v-deep.ant-calendar-picker {
	width: 100%;
}
.search-btn {
	margin-right: 20px;
}
.table-wrap {
	margin-top: 20px;
}
.s-modal {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 9999;
	//flex-row:(center, flex-start);
	.content {
		width: 400px;
		height: 124px;
		background: #ffffff;
		padding: 0 30px;
		border-radius: 8px;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	.btn {
		width: 90%;
		margin: 20px 0;
		//flex-row: (flex-end, center)
		background: #fff;
	}
}
.btn-text {
	display: flex;
	align-items: center;
}
.status-btn {
	width: 48px;
	height: 20px;
	text-align: center;
	line-height: 20px;
	display: inline-block;
	border-radius: 4px;
	font-size: 12px;
}
.status-confirm {
	background: #c5ecdd;
	color: #3eb384;
}
.status-staff {
	background: #d3dffb;
	color: #4682f3;
}
.text-overflow {
	max-width: 180px;
	width: auto;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
