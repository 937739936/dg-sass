<template>
	<a-modal
		title="选择线下合同"
		width="1000px"
		v-model="visible"
		class="model-c"
	>
		<template slot="footer">
			<a-button @click="() => (visible = false)">取消</a-button>
			<a-button
				type="primary"
				@click="handleOk"
				>下一步</a-button
			>
		</template>
		<a-form
			:form="form"
			@submit="search"
			v-bind="formLayout"
			class="search-form-wrapper"
		>
			<a-row>
				<a-col :span="colSpan">
					<a-form-item
						label="合同类型"
						:colon="false"
					>
						<a-select
							v-model="params.contractType"
							placeholder="请选择合同类型"
							:getPopupContainer="getPopupContainer"
						>
							<a-select-option
								:value="item.value"
								v-for="item in [
									{ value: 'DOWN', label: '销售合同' },
									{ value: 'UP', label: '采购合同' }
								]"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="合同编号"
						:colon="false"
					>
						<a-input
							v-model="params.paperContractNo"
							placeholder="请输入合同编号"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="企业名称"
						:colon="false"
					>
						<a-input
							v-model="params.compayName"
							placeholder="请输入企业名称"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="煤种"
						placeholder="请选择煤种"
						:colon="false"
					>
						<a-select
							v-model="params.coalType"
							placeholder="请选择煤种"
							:getPopupContainer="getPopupContainer"
						>
							<!-- <a-select-option value="">全部</a-select-option> -->
							<a-select-option
								:value="item.value"
								v-for="item in coalTypeDict"
								:key="item.value"
							>
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item
						label="签订日期"
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
			<span
				slot="receiverName"
				slot-scope="text, record"
			>
				{{ text || '-' }}
			</span>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>

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
					@click="jumpPage()"
					>查看补协</a-button
				>
			</template>
			<p class="mb16">当前合同有正在进行中的补协，只有将此补协作废、删除、或者双签完成才能发起新的补充协议。</p>
			<p>补协ID：{{ serialNo }}</p>
		</a-modal>
	</a-modal>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { API_OfflineSupplementalAgreementContractPage, API_SupplementalAgreementLatest } from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

const columns = [
	{
		title: '合同类型',
		dataIndex: 'contractType',
		fixed: 'left'
	},
	{ title: '合同编号', dataIndex: 'paperContractNo' },
	{ title: '卖方企业名称', dataIndex: 'sellerName' },
	{ title: '买方企业名称', dataIndex: 'buyerName' },
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transTypeDesc' },
	{ title: '数量(吨)', dataIndex: 'contractQuantity' },
	{ title: '基准价格(元/吨)', dataIndex: 'contractPrice', width: 150 },
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{ title: '交货期限', dataIndex: 'execDateStart', customRender: (text, record) => `${text} 至 ${record.execDateEnd}` }
];

export default {
	name: 'OfflineContractList',

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
			visibleSuppleAgreement: false,
			coalTypeDict: filterCodeByKey('goods_type'),
			form: this.$form.createForm(this),
			visible: false,
			dataSource: [],
			params: {},
			loading: false,
			selectedRowKeys: [],
			selectedData: {},
			pagination: { total: 0, pageNo: 1 }
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					this.selectedRowKeys = [record.paperContractNo];
					this.selectedData = record;
				}
			};
		}
	},

	methods: {
		dateChange(value, dateString) {
			this.params.minSignDate = dateString[0];
			this.params.maxSignDate = dateString[1];
		},

		jumpPage() {
			this.visibleSuppleAgreement = false;
			this.visible = false;
			this.$emit('change', this.serialNo);
		},

		showModal() {
			this.visible = true;
			this.getList();
		},

		async handleOk() {
			if (this.selectedRowKeys.length <= 0) {
				this.$message.error('请先选择一条数据');
			} else {
				const { contractType, id, contractNo } = this.selectedData;
				const latest = await API_SupplementalAgreementLatest({ contractNo });
				if (latest.data && latest.data.serialNo) {
					this.visibleSuppleAgreement = true;
					this.serialNo = latest.data.serialNo;
					return;
				}
				this.visible = false;
				const type = contractType.includes('销售') ? 'sell' : 'buy';
				this.$router.push({
					path: `/center/contract/${type}/offline/add`,
					query: {
						type: type,
						disabled: false,
						id,
						from: 'suppleAgreement'
					}
				});
			}
		},

		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_OfflineSupplementalAgreementContractPage(this.params).then(res => {
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
.model-c ::v-deep {
	.ant-table-tbody {
		tr {
			cursor: pointer;
		}
	}
}
</style>
