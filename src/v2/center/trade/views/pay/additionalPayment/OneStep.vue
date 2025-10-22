<template>
	<div>
		<div class="s-title">
			<span>追加付款</span>
		</div>
		<PaymentStep :currentStep="0" />
		<a-form
			@submit="search"
			v-bind="formLayout"
			class="search-form-wrapper mt16"
		>
			<a-row>
				<a-col :span="colSpan">
					<a-form-item
						label="订单编号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.orderNo"
							placeholder="请输入"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="合同编号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
							placeholder="请输入"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="资金流水号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.serialNo"
							placeholder="请输入"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="收款方"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.sellerName"
							placeholder="请输入"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="资金来源"
						class="order-wrap"
						:colon="false"
					>
						<a-select
							v-model="params.bankProductItemCode"
							title="text"
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
							:options="paymentType"
						>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label=" "
						class="order-wrap"
						:colon="false"
					>
						<a-space>
							<a-button
								type="primary"
								@click="search"
								class="search-btn"
								>查询</a-button
							>
							<a-button @click="resetValues">重置</a-button>
						</a-space>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			:rowSelection="rowSelection"
			:columns="columns"
			rowKey="serialNo"
			:dataSource="data"
			:pagination="false"
			:loading="loading"
			:customRow="onClickRow"
			:scroll="{ x: true }"
		>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
		<div class="btn-wrap">
			<a-button
				type="primary"
				@click="nextStep()"
				:disabled="data.length == 0"
				>下一步</a-button
			>
		</div>
		<a-modal
			class="errorModal"
			title="错误提示"
			:visible="visible"
			@ok="visible = false"
			@cancel="visible = false"
		>
			<p>
				<a-icon
					type="exclamation-circle"
					style="color: #faad14; display: inline-block; margin-right: 3px"
				/>
				下游合同不存在，请关联下游合同或通知下游负责人{{ terminalUserName }}{{ terminalMobile }}维护。
			</p>
		</a-modal>
	</div>
</template>

<script>
import { API_GetAvailableProductFromPayment, API_GetAdditionalPaymentList } from '@/v2/center/trade/api/pay';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import PaymentStep from './components/PaymentStep.vue';

const columns = [
	{ title: '资金流水号', dataIndex: 'serialNo', fixed: 'left' },
	{ title: '订单编号', dataIndex: 'orderNo' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '收款方', dataIndex: 'sellerName' },
	{ title: '资金来源', dataIndex: 'bankProductItemName' },
	{ title: '付款金额', dataIndex: 'payAmount' },
	{ title: '付款日期', dataIndex: 'planPayDate' },
	{ title: '付款类型', dataIndex: 'typeDesc' },
	{ title: '付款状态', dataIndex: 'statusDesc' },
	{ title: '创建时间', dataIndex: 'createTime' }
];

export default {
	name: 'PayAdditionalPaymentOneStep',

	components: {
		iPagination,
		PaymentStep
	},
	data() {
		return {
			columns,
			getPopupContainer,
			paymentType: [],
			formLayout: { labelCol: { span: 8 }, wrapperCol: { span: 15 } },
			colSpan: 8,
			flag: false,
			currentStep: 0,
			params: {},
			data: [],
			selectedRowKeys: [],
			selectedData: {},
			loading: false,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			visible: false, // 校验下游合同错误弹窗隐藏
			terminalUserName: '', // 下游负责人
			terminalMobile: '', // 下游手机号
			coalTypeData: filterCodeByKey('goods_type')
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: (record, selected, selectsedRows) => {
					this.selectedRowKeys = [record.serialNo];
					this.selectedData = record;
					this.orderId = record.id;
				}
			};
		}
	},
	created() {
		this.getPaymentType();
		this.getList();
	},
	methods: {
		getPaymentType() {
			API_GetAvailableProductFromPayment().then(res => {
				if (res.success) {
					this.paymentType = res.data.map(item => {
						return {
							label: item.name,
							value: item.code
						};
					});
				}
			});
		},
		getList(pageNo, pageSize) {
			this.pagination.pageNo = pageNo || this.pagination.pageNo;
			this.params.pageNo = this.pagination.pageNo;
			this.params.pageSize = pageSize || 10;
			API_GetAdditionalPaymentList(this.params).then(res => {
				if (res.success) {
					this.data = res.data.records || [];
					if (this.data.length > 0) {
						this.data.forEach(item => {
							item.key = item.id + item.orderType;
						});
					}
					this.pagination.total = res.data.total;
				}
			});
		},
		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.serialNo];
						this.selectedData = record;
					}
				}
			};
		},
		nextStep() {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.error('请先选择一条行数据');
				return;
			}
			const { id, orderNo, orderId, serialNo, orderType, contractTemplate } = this.selectedData;
			this.$router.push({
				path: '/center/fund/pay/additional/payment/twoStep',
				query: {
					id,
					orderNo,
					orderId,
					serialNo,
					orderType,
					contractTemplate,
					type: 'overview',
					additionalPayment: 'additionalPayment',
					isAdditionalPaymentCreat: 'isAdditionalPaymentCreat'
				}
			});
			return;
			// if (orderId == '') {
			//   this.$message.error('请先选择一条行数据');
			// } else if (this.selectedData.isWaitingAudit) {
			//   // 对应下游合同正在审核中，暂不允许付款
			//   this.$message.error('对应下游合同正在审核中，暂不允许付款');
			// } else {
			//   // 付款时需要判断销售合同是否完善
			//   API_JudgeContractNew({ orderSerialNo: this.selectedData.orderNo }).then((res) => {
			//     if (res.success) {
			//       if (res.result && !res.result.exist) {
			//         this.terminalUserName = res.result.terminalUserName;
			//         this.terminalMobile = res.result.terminalMobile;
			//         this.visible = true;
			//         return;
			//       }
			//     }
			//   });
			// }
		},
		resetValues() {
			this.params = {
				// orderName:'',
				contractNo: '',
				sellerName: '',
				minQuantity: '',
				maxQuantity: '',
				orderNo: '',
				status: undefined,
				receiverName: ''
			};
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>

<style lang="less">
.search-form-wrapper {
	::v-deep .ant-form-item {
		margin-bottom: 14px;
	}
}
</style>
