<template>
	<div class="settle-apply-form">
		<a-form
			:form="settleApplyForm"
			layout="inline"
		>
			<template>
				<div class="title"><i class="title_icon"></i>货转信息</div>
				<div class="table-wrap">
					<a-table
						:columns="goodsTransferColumns"
						:rowKey="record => record.id"
						:dataSource="goodsTransferData"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</div>
			</template>

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
			<a-row style="margin-top: 20px">
				<a-col
					:span="12"
					class="row"
				>
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
				<a-col
					:span="12"
					class="row"
				>
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
					class="row"
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
			<a-row class="textarea-wrap">
				<a-col
					:span="24"
					class="row"
				>
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
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_SteelsStatementDetail, settleImportGoodsInfo } from '@/v2/center/steels/api/settle.js';
import PreviewModal from './PreviewModal.vue';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
import { appJsColumns } from './config.js';

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
			goodTransferNos: '', // 货转编号
			goodsTransferData: [],
			goodsTransferColumns: [
				// 货转信息table列
				{
					title: '货转编号',
					dataIndex: 'transferNo'
				},
				{
					title: '货转开具时间',
					dataIndex: 'createdDate'
				},
				{
					title: '货转数量（吨）',
					dataIndex: 'transferQuantity'
				},
				{
					title: '运输方式',
					dataIndex: 'transportMode',
					customRender: text => {
						return filterCodeByValueName(text, 'transportMode');
					}
				},
				{
					title: '状态',
					dataIndex: 'status',
					customRender: text => {
						return filterCodeByValueName(text, 'goodsTransferStatus');
					}
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
	watch: {
		statementParticularList: {
			handler(v) {
				if (!v || !v.length) return;
				let hasTotal = false;
				if (this.statementParticularList.length) {
					this.statementParticularList.forEach(item => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity');
					});
				}
				if (!hasTotal) {
					this.statementParticularList.push({
						transferQuantity: '总计',
						currentSettleQuantity: '', //结算数量
						currentSettleAmount: '' // 价税合计
					});
					// 计算总计
					if (this.statementParticularList.length) {
						this.computedTotal(true);
						this.computedAmountTotal(true);
					} else {
						this.computedTotal();
						this.computedAmountTotal();
					}
					this.$forceUpdate();
				}
			},
			immediate: true,
			deep: true
		}
	},
	computed: {
		jsColumns() {
			return appJsColumns;
		}
	},
	methods: {
		computedTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,4})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleQuantity = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleQuantity !== '/' && numberReg.test(Number(el.currentSettleQuantity))) {
						currentSettleQuantity += +(Number(el.currentSettleQuantity) || 0);
					}
				}
			});
			lastItem.currentSettleQuantity = currentSettleQuantity.toFixed(4);
			if (this.info?.currentSettleQuantityTotal && flag) {
				lastItem.currentSettleQuantity = this.info?.currentSettleQuantityTotal.toFixed(4);
			}
			this.$forceUpdate();
		},
		computedAmountTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,2})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleAmount = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleAmount !== '/' && numberReg.test(Number(el.currentSettleAmount))) {
						currentSettleAmount += +(Number(el.currentSettleAmount) || 0);
					}
				}
			});
			lastItem.currentSettleAmount = currentSettleAmount.toFixed(2);
			if (this.info?.currentSettleAmountTotal && flag) {
				lastItem.currentSettleAmount = this.info?.currentSettleAmountTotal.toFixed(2);
			}
			this.$forceUpdate();
		},

		async getEditDetail() {
			const res = await API_SteelsStatementDetail({ id: this.$route.query.statementId || this.$route.query.id });
			this.info = res.data;
			let amountPaidTotalPrice = res.data.amountPaidTotalPrice;
			res.data.statementParticularList.forEach(el => {
				el.currentSettleAmount = el.currentSettleAmount;
				el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
				el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
			});
			this.statementParticularList = res.data.statementParticularList;
			res.data.goodsTransferList.map(i => {
				this.transferIds.push(i.id);
			});
			this.contract = res.data.contract;
			this.particularQuantity = res.data.particularQuantity;
			// const nextRes = await API_SteelsStatementNextStep({id:this.contract.id, takeDeliverSerialNos: ''})
			this.goodsTransferData = res.data.goodsTransferList;
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
}
.row {
	margin-bottom: 20px;
	padding-left: 40px;
}
.textarea-wrap {
	textarea {
		width: 684px;
		text-align: left !important;
	}
}
</style>
