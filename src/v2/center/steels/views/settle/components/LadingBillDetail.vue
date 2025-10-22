<template>
	<div>
		<a-form
			:form="settleApplyForm"
			layout="inline"
		>
			<div class="title"><i class="title_icon"></i>提单信息</div>
			<div class="table-wrap">
				<a-table
					:columns="billColumns"
					:rowSelection="rowSelection"
					:rowKey="record => record.serialNo"
					:dataSource="billList"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<a
							href="javascript:void(0)"
							style="margin-right: 15px"
							@click="goTakeOrder(item)"
							>查看</a
						>
					</div>
				</a-table>
			</div>
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
							style="width: 300px"
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
							style="width: 300px"
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
							v-decorator="['transportMode']"
						></a-input>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row class="row textarea-wrap">
				<a-col :span="12">
					<a-form-item
						label="备注"
						:colon="false"
					>
						<a-textarea
							v-decorator="['remark']"
							style="width: 300px"
							disabled
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
			<div class="title"><i class="title_icon"></i>结算信息</div>
			<a-row>
				<p>明细信息</p>
				<div class="table-wrap">
					<a-table
						:columns="jsColumns"
						:dataSource="statementList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</div>
			</a-row>
			<a-row>
				<p>合同信息</p>
				<div class="table-wrap">
					<a-table
						:columns="contractColumns"
						:dataSource="contractList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="currentSettleAmount"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
							<a-form-item
								:colon="false"
								v-else
							>
								{{ currentSettleAmount }}
							</a-form-item>
						</template>
					</a-table>
				</div>
			</a-row>
			<a-row v-if="fileDataSource.length">
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							ref="customUpload"
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="false"
							:fileDataSource="fileDataSource"
							type="settle"
						/>
					</div>
				</div>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getTakeDeliverIng, API_SteelsStatementSave } from '@/v2/center/steels/api/settle.js';
const jsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '结算单实提数量（吨）',
		dataIndex: 'realTakeQuantity'
	},
	{
		title: '单价（元）',
		dataIndex: 'unitPrice'
	},
	{
		title: '金额',
		dataIndex: 'mount'
	}
];
const billColumns = [
	{
		title: '提单号',
		dataIndex: 'serialNo'
	},
	{
		title: '提单开具时间',
		dataIndex: 'issueDate'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '提单申请数量（吨）',
		dataIndex: 'quantityTotal'
	},
	{
		title: '实提数量（吨）',
		dataIndex: 'totalRealTakeQuantity'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: {
			customRender: 'action'
		}
	}
];
const contractColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
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
		title: '实提数量(吨)',
		dataIndex: 'realTakeQuantity',
		scopedSlots: {
			customRender: 'realTakeQuantity'
		}
	},
	{
		title: '计算不含税单价（元）',
		dataIndex: 'currentSettleNoAvePrice'
	},
	{
		title: '计算含税单价（元）',
		dataIndex: 'currentSettleAvePrice'
	},
	{
		title: '货款价税合计',
		dataIndex: 'currentSettleAmount'
	}
];
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
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
export default {
	props: {
		info: {
			default: () => {}
		},
		contract: {}
	},
	data() {
		return {
			jsColumns,
			billColumns,
			fileColumns,
			statementList: [],
			billList: [],
			contractColumns,
			contractList: [],
			settleApplyForm: this.$form.createForm(this),
			receiveIds: [],
			fileDataSource: []
		};
	},
	watch: {
		info: {
			handler(newVal) {
				const val = JSON.parse(JSON.stringify(newVal));
				this.billList = val.takeDeliveries || [];
				this.receiveIds = [];
				this.billList.forEach(el => {
					if (el.detailCheck) {
						this.receiveIds.push(el.serialNo);
					}
				});
				// 结算单
				this.statementList = val.statementTakeDeliverDetails || [];
				if (this.statementList.length) {
					this.statementList.push({ transferQuantity: '总计' });
					// 计算总计
					this.computedSettleTotal();
				}
				// 合同信息列表
				this.contractList = val.statementContractRels || [];
				if (this.contractList.length) {
					this.contractList.push({ transferQuantity: '总计' });
					// 计算总计
					this.computedContractTotal();
				}
				const statementAttachList = val.statementAttachList || [];
				statementAttachList.forEach(el => {
					el.typeName = '货物变更佐证材料';
					el.url = el.filePath;
				});
				this.fileDataSource = statementAttachList;
				this.$forceUpdate();
			},
			deep: true,
			immediate: true
		},
		contract: {
			handler(val) {
				// 更新合同信息
				this.$nextTick(() => {
					this.settleApplyForm.setFieldsValue({
						contractNo: val.contractNo,
						quantity: val.quantity,
						transportMode: val.transportModeDesc || '-',
						remark: this.info.remark,
						appointSpecDesc: val.appointSpecDesc,
						businessTypeDesc: val.businessTypeDesc,
						steelTypeDesc: val.steelTypeDesc
					});
				});
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		rowSelection() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds,
				onChange: (selectedRowKeys, selectedRows) => {},
				getCheckboxProps: record => ({
					props: {
						disabled: true
					}
				})
			};
		}
	},
	mounted() {},
	methods: {
		// 计算结算单12
		handleChange(value, i, key) {
			const item = this.statementList[i];
			item[key] = value;
			/** 计算金额  */
			// 当key 是实提数量的时候
			if (item.realTakeQuantity && item.unitPrice) {
				item.mount = (item.realTakeQuantity * item.unitPrice).toFixed(2);
			}
			this.computedSettleTotal();
			this.$forceUpdate();
		},
		computedSettleTotal() {
			// 计算所有的实提数量和  金额
			const lastItem = this.statementList[this.statementList.length - 1];
			// 计算总数量
			let totalNum = 0,
				totalMoney = 0,
				quantity = 0,
				applyQuantity = 0;

			this.statementList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					totalNum += +(el.realTakeQuantity || 0);
					totalMoney += +(el.mount || 0);
					quantity += +(el.quantity || 0);
					applyQuantity += +(el.applyQuantity || 0);
				}
			});
			lastItem.realTakeQuantity = totalNum.toFixed(3);
			lastItem.mount = totalMoney.toFixed(2);
			lastItem.quantity = quantity.toFixed(3);
			lastItem.applyQuantity = applyQuantity.toFixed(3);
			this.$forceUpdate();
		},
		// 计算合同
		handleChangeContract(value, i, key) {
			const item = this.contractList[i];
			item[key] = value;
			// 计算所有的实提数量和  金额
			this.computedContractTotal();
			this.$forceUpdate();
		},
		computedContractTotal() {
			const lastItem = this.contractList[this.contractList.length - 1];

			// 计算总数量
			let realTakeQuantity = 0,
				currentSettleAmount = 0;
			/** 获取总共的提单数量 */
			const totalTakeOrderNum = this.statementList[this.statementList.length - 1];

			this.contractList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					el.currentSettleAvePrice = el.currentSettleAmount
						? (el.currentSettleAmount / totalTakeOrderNum.realTakeQuantity).toFixed(2)
						: 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
					realTakeQuantity += +(el.realTakeQuantity || 0);
					currentSettleAmount += +(el.currentSettleAmount || 0);
				}
			});
			lastItem.realTakeQuantity = realTakeQuantity.toFixed(3);
			lastItem.currentSettleAmount = currentSettleAmount.toFixed(2);
			this.$forceUpdate();
		},
		goTakeOrder(item) {
			this.$router.push({
				path: '/center/take/order/step',
				query: {
					contractId: this.contract.id,
					serialNo: item.applyTakeSerialNo,
					id: item.serialNo,
					type: 'preview'
				}
			});
		}
	},
	components: {
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
</style>
