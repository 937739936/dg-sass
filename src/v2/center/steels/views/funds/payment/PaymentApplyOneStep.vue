<template>
	<div>
		<div class="s-title"><span>付款申请</span></div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="(item, index) in steps"
					:key="index"
					:title="item"
				/>
			</a-steps>
		</div>
		<div class="payApplyList">
			<a-form v-bind="formLayout">
				<a-row>
					<a-col :span="colSpan">
						<a-form-item
							label="合同编号"
							:colon="false"
						>
							<a-input
								v-model="params.contractNo"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="企业名称"
							:colon="false"
						>
							<a-input
								v-model="params.companyName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label=" "
							:colon="false"
						>
							<a-space>
								<a-button
									type="primary"
									@click="search"
								>
									查询
								</a-button>
								<a-button
									html-type="reset"
									@click="reset"
									>重置</a-button
								>
							</a-space>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="table-wrap">
				<a-tabs
					v-model="contractType"
					@change="onChangeTab"
				>
					<a-tab-pane
						:key="item.value"
						:tab="item.label"
						v-for="item in contractList"
					></a-tab-pane>
				</a-tabs>
				<a-table
					:rowSelection="rowSelection"
					:columns="columns"
					:rowKey="record => record.id"
					:scroll="{ x: true }"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:customRow="onClickRow"
				>
					<span
						slot="receiverName"
						slot-scope="receiverName"
					>
						{{ receiverName || '-' }}
					</span>
					<template
						slot="settlementType"
						slot-scope="settlementType"
					>
						<span v-if="settlementType == 1">未结算</span>
						<span v-if="settlementType == 2">结算中</span>
						<span v-if="settlementType == 3">已结算</span>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
			<div class="btn-wrap">
				<a-button
					type="primary"
					class="next-btn"
					@click="nextStep()"
					>下一步</a-button
				>
			</div>
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
				{{ errorTitle }}请通知下游负责人{{ terminalUserName }}{{ terminalMobile }}维护。
			</p>
		</a-modal>
	</div>
</template>

<script>
import {
	paymentContractPage,
	checkBusinessLine,
	getPaymentSellContractPage,
	checkCollection
} from '@/v2/center/steels/api/funds.js';

import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { contractTypeOpt } from '@/v2/center/steels/config/constant.js';

export default {
	name: 'PaymentApplyOneStep',
	components: {
		iPagination
	},
	data() {
		return {
			colSpan,
			formLayout,
			currentStep: 0,
			steps: ['选择合同', '填写付款信息', '完成'],
			params: {},
			dataSource: [],
			loading: false,
			currentRow: null,
			orderId: '',
			selectedRowKeys: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			visible: false, //校验下游合同错误弹窗隐藏
			errorTitle: '', //校验下游合同错误提示title
			terminalUserName: '', // 下游负责人
			terminalMobile: '', // 下游手机号
			// 合同类型
			contractList: contractTypeOpt,
			contractType: 'BUY'
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			const itSelf = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: (record, selected, selectsedRows) => {
					itSelf.selectedRowKeys = [record.id];
					itSelf.orderId = record.id;
					itSelf.currentRow = record;
				}
			};
		},
		columns() {
			let newColumns = [
				{ title: '合同编号', dataIndex: 'contractNo' },
				{ title: '钢材种类', dataIndex: 'steelTypeDesc' },

				{ title: '业务类型', dataIndex: 'businessTypeDesc' },

				{ title: '已付款金额（元）', dataIndex: 'paymentAmount' },
				{ title: '最后一次付款时间', dataIndex: 'paymentDate' },
				{
					title: '合同期限',
					dataIndex: 'effectiveStartDate',
					customRender: (text, record, index) => `${record.effectiveStartDate}至${record.effectiveEndDate}`
				}
			];
			if (this.contractType == 'BUY') {
				newColumns.splice(1, 0, { title: '卖方名称', dataIndex: 'sellCompanyName' });
			} else {
				newColumns.splice(1, 0, { title: '买方名称', dataIndex: 'buyCompanyName' });
			}
			return newColumns;
		}
	},
	created() {
		this.getList();
	},
	methods: {
		onChangeTab(value) {
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1
			};
			this.contractType = value;
			this.selectedRowKeys = [];
			this.currentRow = null;
			this.orderId = '';
			this.getList(1);
		},
		cancel() {
			this.flag = false;
		},
		async getList(pageNo, pageSize) {
			this.params.pageSize = pageSize || 10;
			this.pagination.pageNo = pageNo || this.pagination.pageNo;
			this.params.pageNo = this.pagination.pageNo;
			this.params.contractType = this.contractType;
			// getPaymentSellContractPage
			let Fn = paymentContractPage;
			if (this.contractType == 'SELL') {
				Fn = getPaymentSellContractPage;
			}
			const res = await Fn(this.params);
			this.dataSource = res.data.records;
			this.pagination.total = res.data.total;
		},
		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.orderId = record.id;
						this.currentRow = record;
					}
				}
			};
		},
		nextStep() {
			if (this.orderId == '') {
				this.$message.error('请先选择一条行数据');
				return;
			}
			if (this.currentRow.isWaitingAudit) {
				// 对应下游合同正在审核中，暂不允许付款
				this.$message.error('对应下游合同正在审核中，暂不允许付款');
				return;
			}
			this.jumpPage();
		},
		async jumpPage() {
			const { contractNo, sellCompanyName, buyCompanyName, sellCompanyId, id, steelType, contractTemplate } = this.currentRow;

			const params = {
				contractNo,
				id,
				contractId: id
			};
			// let res = await checkBusinessLine(params)
			// if(!res.data) {
			//   this.$message.error('该笔付款所属合同尚未关联业务线')
			//   return
			// }

			// 判断是否是销售合同

			// contractType 合同类型  1 采购合同 2 采购补录合同 3 销售合同
			this.$router.push({
				path: '/center/steels/funds/payment/paymentApplyTwoStep',
				query: {
					contractTemplate,
					contractNo,
					contractId: id,
					companyName: this.contractType == 'BUY' ? sellCompanyName : buyCompanyName,
					companyId: this.contractType == 'BUY' ? sellCompanyId : this.currentRow.buyCompanyId,
					companyUscc: this.contractType == 'BUY' ? this.currentRow.sellCompanyUscc : this.currentRow.buyCompanyUscc,
					generateWay: this.currentRow.generateWay,
					steelType,
					contractType: this.currentRow.contractType,
					businessType: this.currentRow.businessType
				}
			});
		},
		reset() {
			this.params = {};
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>

<style lang="less" scoped>
.steps-wrap {
	margin: 0 auto;
}
.payApplyList {
	.btn-wrap {
		text-align: center;
		padding: 30px 0;
		.ant-btn {
			margin-right: 0;
		}
	}
}
.errorModal .ant-modal-footer .ant-btn:first-child {
	display: none;
}
</style>
