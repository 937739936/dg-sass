<template>
	<div>
		<div class="s-title">
			<span>关联资金方</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div class="relate-apply-form">
			<a-form
				:form="relateForm"
				layout="inline"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="仓储企业">
							<span>{{ detail.storageCompany }}</span>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="核心企业">
							<a-input
								disabled
								v-decorator="['coreCompany', { rules: [{ required: true, message: '核心企业必填' }] }]"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="库点">
							<span>{{ detail.depotPointName }}</span>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="金融机构">
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'bankId',
									{
										rules: [{ required: true, message: '金融机构必选，请选择' }]
									}
								]"
								@change="financialTypeChange"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in bankList"
									:key="index"
									:value="items.bankId"
									>{{ items.bankName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="仓房号">
							<span>{{ detail.storehouseNumber }}</span>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="资金类型">
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									'fundCode',
									{
										rules: [{ required: true, message: '资金类型必选，请选择' }]
									}
								]"
								placeholder="请选择"
							>
								<a-select-option
									v-for="(items, index) in fundsList"
									:key="index"
									:value="items.fundCode"
									>{{ items.fundName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="关联合同编号">
							<a-input
								readOnly
								placeholder="请点击选择关联合同编号"
								@click="showRelationOrderList"
								v-decorator="[
									`contractNo`,
									{
										rules: [
											{
												required: false,
												message: `请点击选择关联合同编号`,
												type: 'string'
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="仓房开始使用日期"
							:colon="false"
						>
							<a-date-picker
								:disabledDate="disabledDate"
								:getCalendarContainer="getPopupContainer"
								v-decorator="['bindingTime', { rules: [{ required: true, message: '仓房开始使用日期' }] }]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<div class="btn-wrap">
					<a-button @click="$router.go(-1)">返回</a-button>
					<a-button
						type="primary"
						@click="submitPayForm('submit')"
						>提交</a-button
					>
				</div>
			</a-form>
		</div>
		<!-- 合同查询弹窗 -->
		<a-modal
			id="orderRelationModal"
			title="合同查询"
			v-model="orderRelationModal"
			@ok="handleSubmit"
			@cancel="
				() => {
					orderRelationModal = false;
				}
			"
		>
			<a-form
				class="custom-form-style"
				:form="form"
				v-bind="formLayout"
				layout="inline"
			>
				<a-row>
					<a-col :span="colSpan">
						<a-form-item
							label="合同编号"
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
							label="合同签订日期"
							:colon="false"
						>
							<a-range-picker
								v-model="date"
								:getCalendarContainer="getPopupContainer"
								format="YYYY-MM-DD"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="商品名称"
							:colon="false"
						>
							<a-input
								v-model="params.productName"
								placeholder="请输入"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="卖方"
							:colon="false"
						>
							<a-input
								v-model="params.sellerName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="colSpan"
						v-if="VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG'"
					>
						<a-form-item
							label="买方"
							:colon="false"
						>
							<a-input
								v-model="params.buyerName"
								placeholder="请输入"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="交付日期"
							:colon="false"
						>
							<a-range-picker
								v-model="deliveryTime"
								:getCalendarContainer="getPopupContainer"
								format="YYYY-MM-DD"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="合同类型"
							:colon="false"
						>
							<a-select
								allowClear
								:getPopupContainer="getPopupContainer"
								v-model="params.contractType"
								placeholder="请选择"
							>
								<a-select-option
									v-for="item in contractTypeList"
									:key="item.value"
									:value="item.value"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label="合同状态"
							:colon="false"
						>
							<a-select
								allowClear
								show-search
								:getPopupContainer="getPopupContainer"
								v-model="params.status"
								placeholder="请选择"
							>
								<a-select-option
									v-for="item in contractStatusList"
									:key="item.value"
									:value="item.value"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item
							label=" "
							:colon="false"
						>
							<a-button
								@click="searchSubmitRelation"
								type="primary"
								html-type="submit"
								class="mr16"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetValuesRelation"
								>重置</a-button
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				:columns="relationOrderListColumns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:rowSelection="rowSelection"
				:customRow="onClickRow"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="contractType"
					slot-scope="text, record"
				>
					{{ text.cname }}
				</template>

				<template
					slot="status"
					slot-scope="text, record"
				>
					<span :class="setStyle(text.name)">{{ text.cname }}</span>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getRelationOrderList"
			/>
		</a-modal>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory';
import { contractTypeList, contractStatusList } from '@/v2/center/storage/config/dictionaryConfig';
import {
	API_GetWarehouseLDetail,
	API_GrainContractPage,
	API_SubmitRelatingFunds,
	API_GetBankList,
	API_GetFundsList
} from '@/v2/center/storage/api';
import { mapGetters } from 'vuex';
import moment from 'moment';

const relationOrderListColumns = [
	{
		title: '合同签订日期',
		dataIndex: 'signTime',
		width: 140
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo'
	},
	{
		title: '买方',
		dataIndex: 'buyerName'
	},
	{
		title: '卖方',
		dataIndex: 'sellerName'
	},
	{
		title: '商品名称',
		dataIndex: 'productName',
		width: 120
	},
	{
		title: '合同类型',
		dataIndex: 'contractType',
		scopedSlots: { customRender: 'contractType' }
	},
	{
		title: '合同开始日期',
		dataIndex: 'contractStartDate',
		width: 140
	},
	{
		title: '合同结束日期',
		dataIndex: 'contractEndDate',
		width: 140
	},
	{
		title: '交付日期',
		dataIndex: 'deliveryTime'
	},
	{
		title: '合同状态',
		dataIndex: 'status',
		scopedSlots: { customRender: 'status' },
		width: 120
	}
];
import iPagination from "@sub/components/iPagination";
export default {
	name: 'relatedFunds',
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.relateForm.setFieldsValue({
						contractNo: record.contractNo
					});
					t.$forceUpdate();
					t.selected = record;
				}
			};
		}
	},
	data() {
		return {
			getPopupContainer,
			steps: [
				{
					title: '关联资金方'
				},
				{
					title: '平台运营审核'
				},
				{
					title: '完成'
				}
			],
			relateForm: this.$form.createForm(this),
			financialType: {}, // 金融机构下拉选项
			capitalType: {}, // 资金下拉选项
			detail: {},
			currentStep: 0,
			orderRelationModal: false,
			paginationRelation: {},
			relationOrderListColumns,
			selectedRowKeys: [],
			relationOrderList: [],
			selected: {}, // 关联合同被选中的数据
			formLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 15 }
			},
			colSpan: 8,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {},
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			date: [],
			deliveryTime: [],
			contractTypeList,
			contractStatusList,
			bankList: [],
			fundsList: []
		};
	},
	mounted() {
		this.getDetail();
		this.getBankList();
		this.$nextTick(() => {
			this.relateForm.setFieldsValue({
				bindingTime: this.$route.query.time && moment(+this.$route.query.time)
			});
		});
	},
	methods: {
		disabledDate(value) {
			var start =
				moment(+this.$route.query.time).startOf('day').valueOf() > value.valueOf() ||
				value.valueOf() > moment().endOf('day').valueOf();
			return start;
		},
		setStyle(v) {
			return {
				EXECUTING: 'g',
				ARCHIVED: 'r'
			}[v];
		},
		getDetail() {
			API_GetWarehouseLDetail({
				batchId: this.$route.query.batchId,
				storehouseId: this.$route.query.storehouseId
			}).then(res => {
				if (res.success) {
					this.detail = res.data;
					this.relateForm.setFieldsValue({
						coreCompany: this.detail.coreCompany
					});
				}
			});
		},
		getBankList() {
			// 获取金融机构
			API_GetBankList().then(res => {
				if (res.success) {
					this.bankList = res.data;
				}
			});
		},
		financialTypeChange(e) {
			// 选择金融机构后获取对应资金类型
			// 当“金融机构”字段选择“无”时，显示“自有资金”选项，当为具体金融机构时，可选项
			API_GetFundsList({ bankId: e }).then(res => {
				if (res.success) {
					this.fundsList = res.data;
					this.relateForm.setFieldsValue({ fundCode: undefined });
				}
			});
		},
		submitPayForm() {
			this.relateForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let obj = {
						...values,
						batchId: this.$route.query.batchId,
						coreCompanyId: this.detail.coreCompanyId,
						bindingTime: moment(values.bindingTime).format('YYYY-MM-DD 00:00:00')
					};
					API_SubmitRelatingFunds(obj).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('提交成功！');
								this.$router.push('/center/storageCenter/storehouse/list');
							}
						}
					});
				}
			});
		},
		showRelationOrderList() {
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		searchSubmitRelation() {
			this.pagination.pageNo = 1;
			this.getRelationOrderList();
		},

		resetValuesRelation() {
			this.params = {};
			this.date = [];
			this.deliveryTime = [];
			this.pagination.pageNo = 1;
			this.getRelationOrderList();
		},
		getRelationOrderList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;

			if (this.date && this.date.length > 0) {
				this.params.signTimeStart = this.date[0].format('YYYY-MM-DD');
				this.params.signTimeEnd = this.date[1].format('YYYY-MM-DD');
			} else {
				delete this.params.signTimeStart;
				delete this.params.signTimeEnd;
			}

			if (this.deliveryTime && this.deliveryTime.length > 0) {
				this.params.deliveryTimeStart = this.deliveryTime[0].format('YYYY-MM-DD');
				this.params.deliveryTimeEnd = this.deliveryTime[1].format('YYYY-MM-DD');
			} else {
				delete this.params.deliveryTimeStart;
				delete this.params.deliveryTimeEnd;
			}
			API_GrainContractPage(this.params).then(res => {
				if (res.success) {
					this.dataSource = res.data.list;
					this.pagination.total = res.data.total;
				}
			});
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.relateForm.setFieldsValue({
							contractNo: record.contractNo
						});
						this.$forceUpdate();
						this.selected = record;
					}
				}
			};
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.error('请选择要关联的合同！');
				return;
			}
			this.orderRelationModal = false;
		}
	}
};
</script>

<style lang="less" scoped>
.steps-wrap {
	padding-bottom: 50px;
}
.relate-apply-form {
	padding-bottom: 60px;
	::v-deep.ant-form-item-control {
		input {
			width: 240px;
		}

		.ant-select {
			width: 240px;
		}
	}
	.row {
		padding-left: 30px;
		height: 60px;

		.detail-wrapper {
			width: fit-content;
			position: absolute;
			top: 10px;
			right: 0px;
		}

		::v-deep.has-error,
		.has-success {
			.ant-form-explain {
				position: absolute;
			}
		}
	}

	::v-deep.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 16px;
			display: inline-block;
			text-align: right;
		}
	}

	::v-deep.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}
	::v-deep.ant-input-number {
		width: 240px;
	}
}
#orderRelationModal {
	::v-deep.ant-modal {
		width: 80% !important;
		min-width: 800px;

		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
		.search-wrap {
			.order-wrap {
				.ant-form-item-children > input {
					width: 200px;
				}
				.ant-select {
					width: 200px;
				}
				.ant-calendar-picker-input input {
					width: 85px;
				}
			}
		}
		.ant-table td {
			white-space: nowrap;
		}
	}
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
</style>
