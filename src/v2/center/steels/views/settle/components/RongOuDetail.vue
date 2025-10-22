<template>
	<div class="settle-apply-form">
		<a-form
			:form="settleApplyForm"
			layout="inline"
		>
			<div class="title"><i class="title_icon"></i>基础信息</div>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同编号"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['contractNo']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同数量（吨）"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['quantity']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="钢材种类"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['steelTypeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="业务类型"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['businessTypeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="是否指定规格"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['appointSpecDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="运输方式"
						:colon="false"
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['transportModeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
			</a-row>
			<div class="title"><i class="title_icon"></i>结算信息</div>
			<a-row>
				<div class="table-wrap">
					<a-table
						:columns="jsColumns"
						:dataSource="statementParticularList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</div>
			</a-row>
			<a-row
				class="row textarea-wrap"
				style="margin-top: 20px"
			>
				<a-col :span="12">
					<a-form-item
						label="结算日期"
						:colon="false"
					>
						<a-date-picker
							v-decorator="[
								'settleTime',
								{
									rules: [{ required: true, message: '请选择' }]
								}
							]"
							disabled
							type="date"
							format="YYYY-MM-DD"
							valueFormat="YYYY-MM-DD"
							style="width: 100%"
							placeholder="请选择"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="结算单类型"
						:colon="false"
					>
						<a-select
							disabled
							v-decorator="[
								'statementType',
								{
									rules: [{ required: true, message: '结算单类型必填' }]
								}
							]"
							style="width: 220px"
							placeholder="请选择"
						>
							<a-select-option value="PRE_STAT">预结算单</a-select-option>
							<a-select-option value="STAT">结算单</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					style="margin-top: 20px"
				>
					<a-form-item
						label="结算单金额"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="[
								'totalSettleAmount',
								{
									rules: [{ required: true, message: '结算单金额必填' }]
								}
							]"
							style="width: 220px"
							placeholder="请输入"
						>
						</a-input>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row
				class="row textarea-wrap"
				style="margin-top: 20px"
			>
				<a-col :span="24">
					<a-form-item
						label="备注"
						:colon="false"
					>
						<a-textarea
							v-decorator="['remark']"
							disabled
							placeholder="请输入内容，最多输入1000个字符"
							:maxLength="1000"
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
			<div>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="false"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:type="'yuShenSettle'"
						/>
					</div>
				</div>
			</div>
		</a-form>
	</div>
</template>

<script>
import { API_DOWNLPREVIEWTE } from '@/v2/center/steels/api';
import { API_SteelsStatementDetail, settleImportGoodsInfo } from '@/v2/center/steels/api/settle.js';
import comDownload from '@sub/utils/comDownload.js';
import PreviewModal from './PreviewModal.vue';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';

const fileColumns = [
	{
		title: '类型',
		dataIndex: 'typeName'
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
	}
];
export default {
	data() {
		return {
			settleApplyForm: this.$form.createForm(this),
			settleSelectedRowKeys: [],
			transferIds: [], //选中的货转id
			jsColumns: [
				// 货转信息table列
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
					align: 'center',
					customRender: function (t, r, index) {
						return r.transferQuantity != '总计' ? parseInt(index) + 1 : '';
					}
				},
				{
					title: '物料描述',
					dataIndex: 'materialName'
				},
				{
					title: '产地',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '本次结算数量（吨）',
					dataIndex: 'currentSettleQuantity'
				},
				{
					title: '结算不含税单价（元）',
					dataIndex: 'currentSettleNoAvePrice'
				},
				{
					title: '结算含税单价（元）',
					dataIndex: 'currentSettleAvePrice'
				},
				{
					title: '货款价税合计',
					dataIndex: 'currentSettleTotalPrice'
				}
			],
			particularQuantity: 0, // 本次结算数量总和
			settleSelectedRowKeysGoodTransfer: [], // 选中的货转数组 Obj
			statementParticularList: [],
			numberReg: /^(\d+)(\.\d{1,3})?$/,
			contract: {},
			info: {},
			publicPath: process.env.BASE_URL,
			fileColumns,
			action: settleImportGoodsInfo,
			fileInfos: [],
			fileDataSource: []
		};
	},
	mounted() {
		this.getEditDetail();
	},
	methods: {
		async getEditDetail() {
			const res = await API_SteelsStatementDetail({ id: this.$route.query.statementId || this.$route.query.id });
			this.info = res.data;
			let amountPaidTotalPrice = res.data.amountPaidTotalPrice;
			this.statementParticularList = res.data.statementParticularList;
			res.data.goodsTransferList.map(i => {
				this.transferIds.push(i.id);
			});
			this.contract = res.data.contract;
			this.particularQuantity = res.data.particularQuantity;
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: res.data.totalSettleAmount,
					statementType: res.data.type,
					amountPaidTotalPrice,
					...this.contract,
					remark: res.data.remark,
					quantity: this.contract.quantity || '-',
					transportModeDesc: this.contract.transportModeDesc,
					settleTime: res.data.settleTime
				});
			});
			const statementAttachList = res.data.statementAttachList || [];
			const obj = {
				statementAttachType: '货物变更佐证材料',
				OTHER: '其他',
				OFFLINE_STATEMENT: '线下结算单',
				PAYMENT_TICKET: '打款凭证'
			};
			statementAttachList.forEach(el => {
				el.typeName = obj[el.type];
				el.url = el.path || el.filePath;
			});
			this.fileDataSource = statementAttachList;
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		// 删除
		removeRow(index) {
			this.statementParticularList.forEach((el, i, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
		},
		// 全业务线基于货转开具结算单---下载货转附件
		downloadGoodsTransfer(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},
		// 全业务线基于货转开具结算单---查看货转详情
		handleViewDetail(item) {
			let routeUrl = this.$router.resolve({
				name: 'SteelsGoodsTransferApplyDetail',
				query: {
					id: item.id,
					hideBack: false
				}
			});
			window.open(routeUrl.href, '_blank');
		}
	},
	components: {
		PreviewModal,
		CustomUpload
	}
};
</script>

<style scoped lang="less">
.settle-apply-form {
	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;
	}
	.title_icon {
		display: inline-block;
		width: 12px;
		height: 16px;
		vertical-align: middle;
		margin: 0 14px;
		background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
	}
	.row {
		margin-bottom: 20px;
		padding-left: 40px;
	}
	::v-deep.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 84px;
			margin-right: 66px;
			display: inline-block;
			text-align: left;
		}
	}
}
.textarea-wrap {
	textarea {
		width: 684px;
		text-align: left !important;
	}
}
</style>
