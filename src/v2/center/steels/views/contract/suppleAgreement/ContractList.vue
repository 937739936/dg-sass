<template>
	<div>
		<div class="s-title">
			<span>补充协议</span>
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
		<a-form
			:form="form"
			@submit="search"
			v-bind="formLayout"
			class="search-form-wrapper"
		>
			<a-row>
				<a-col :span="colSpan">
					<a-form-item
						label="企业名称"
						:colon="false"
					>
						<a-input
							v-model="params.companyName"
							placeholder="请输入企业名称"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="合同签订日期"
						:colon="false"
					>
						<a-range-picker
							@change="dateChange"
							v-model="date"
							format="YYYY-MM-DD"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="合同编号"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
							placeholder="请输入合同编号"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="下游企业简称"
						:colon="false"
					>
						<a-input
							v-model="params.downstreamCompanyAbbr"
							placeholder="请输入下游企业简称"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="钢材种类"
						class="order-wrap"
						:colon="false"
					>
						<a-select
							:allowClear="true"
							v-model="params.steelType"
							placeholder="请选择"
							:getPopupContainer="getPopupContainer"
						>
							<a-select-option
								v-for="item in steelType"
								:value="item.value"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label=" "
						:colon="false"
					>
						<a-space>
							<a-button
								@click="search"
								type="primary"
								html-type="submit"
								>查询</a-button
							>
							<a-button @click="reset">重置</a-button>
						</a-space>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			rowKey="contractNo"
			:rowSelection="rowSelection"
			:columns="columns"
			:dataSource="dataSource"
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
			<a-button @click="$router.go(-1)">取消</a-button>
			<a-button
				type="primary"
				@click="handleOk"
				>下一步</a-button
			>
		</div>

		<a-modal
			title="提示"
			v-model="visibleSuppleAgreement"
			@cancel="visibleSuppleAgreement = false"
		>
			<!-- destroyOnClose -->
			<template slot="footer">
				<a-button @click="visibleSuppleAgreement = false">取消</a-button>
				<a-button
					type="primary"
					@click="confirm()"
					>查看</a-button
				>
			</template>
			<p class="mb16">
				该合同下有正在进行中的补充协议，只有将此补充协议作废、删除或者双签完成才能发起新的补充协议。补充协议编号：{{ serialNo }}
			</p>
		</a-modal>
	</div>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { API_SupplementalAgreementContractPage, API_SupplementalAgreementLatest } from '@/v2/center/steels/api/contract.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterSteelsCodeByKey, filterCodeByKey } from '@sub/utils/globalCode.js';

const columns = [
	{ title: '合同类型', dataIndex: 'contractTypeDesc', fixed: 'left' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '钢材种类', dataIndex: 'steelTypeDesc' },
	{ title: '卖方企业名称', dataIndex: 'sellCompanyName' },
	{ title: '买方企业名称', dataIndex: 'buyCompanyName' },
	{ title: '合同总数量(吨)', dataIndex: 'quantity', customRender: text => text || '-' },
	{ title: '合同期限', dataIndex: 'effectiveStartDate', customRender: (text, record) => `${text} 至 ${record.effectiveEndDate}` },
	{ title: '合同签订日期', dataIndex: 'signTime' }
	// { title: '下游企业简称', dataIndex: 'downstreamCompanyAbbr' },
];

export default {
	name: 'ContractList',

	components: {
		iPagination
	},
	data() {
		return {
			columns,
			colSpan,
			formLayout,
			getPopupContainer,
			serialNo: '',
			date: [],
			steelType: filterSteelsCodeByKey('steelType'),
			visibleSuppleAgreement: false,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {},
			loading: false,
			selectedRowKeys: [],
			selectedData: {},
			pagination: { total: 0, pageNo: 1 },
			currentStep: 0,
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写补协信息'
				},
				{
					title: '完成'
				}
			]
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					this.selectedRowKeys = [record.contractNo];
					this.selectedData = record;
				}
			};
		}
	},
	mounted() {
		this.getList();
	},
	methods: {
		dateChange(value, dateString) {
			this.params.signStartDate = dateString[0];
			this.params.signEndDate = dateString[1];
		},

		async handleOk() {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.error('请先选择一条数据');
			} else {
				const {
					orderType,
					orderId,
					id,
					contractNo,
					orderNo,
					orderSerialNo,
					serialNo,
					supplementalAgreementStatus,
					steelType,
					contractTemplate
				} = this.selectedData;

				const latest = await API_SupplementalAgreementLatest({ contractNo });
				if (latest.data && latest.data.serialNo) {
					this.visibleSuppleAgreement = true;
					this.serialNo = latest.data.serialNo;
					return;
				}
				if (
					contractTemplate == 'STEEL_PROFILE' ||
					this.selectedData.steelType == 'SCRAP_STEEL' ||
					contractTemplate == 'RECEIVABLE_STEEL_BUY_002'
				) {
					this.$router.push({
						path: '/center/steels/suppleAgreement/createTwo',
						query: {
							type: orderType,
							orderId,
							contractNo,
							orderNo,
							orderSerialNo,
							contractId: id,
							steelType,
							contractTemplate
						}
					});
				} else {
					this.$message.error('当前合同暂不支持补充协议');
				}
			}
		},

		confirm() {
			// 确定
			this.$router.push({
				path: '/center/steels/suppleAgreement/list',
				query: {
					serialNo: this.serialNo
				}
			});
		},

		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_SupplementalAgreementContractPage(this.params).then(res => {
				if (res.success) {
					this.dataSource = res.data.records;
					this.pagination.total = res.data.total;
				}
			});
		},

		search(e) {
			e.preventDefault();
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.params = {};
			this.date = [];
			this.pagination.pageNo = 1;
			this.deliverDate = null;
			this.getList();
		},

		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.contractNo];
						this.selectedData = record;
					}
				}
			};
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep {
	.ant-table-tbody {
		tr {
			cursor: pointer;
		}
	}
}
.search-form-wrapper {
	margin-top: 30px;
}
</style>
