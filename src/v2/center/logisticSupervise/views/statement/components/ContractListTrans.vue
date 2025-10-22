<template>
	<div>
		<a-modal
			id="contractModal"
			class="slModal"
			title="选择运输合同"
			v-model="contractSearchModal"
			@cancel="handleCancel"
			:destroyOnClose='true'
			@ok="handleOk"
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChangeSearch"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-table
				:rowSelection="rowSelection"
				:dataSource="contractList"
				:columns="contractColumns"
				:rowKey="record => record.id"
				:customRow="onClickRow"
				@change="handleTableChange"
				:loading="loading"
				class="new-table table-wrap"
				:pagination="false"
			>
				<template
					slot="contractPrice"
					slot-scope="contractPrice, items"
				>
					<p v-if="items.followTheMarket && contractForm.type === 'BUY'">随行就市</p>
					<p v-else>
						{{ contractPrice }}
					</p>
				</template>
				<template
					slot="execDateEnd"
					slot-scope="execDateEnd, items"
				>
					<p v-if="items.execDateStart">{{ items.execDateStart }}～{{ items.execDateEnd }}</p>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-modal>
	</div>
</template>
<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_transport_contract_list } from '@/v2/center/trade/api/transportContract';
import iPagination from "@sub/components/iPagination";
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const contractColumns = [
	{ title: '运输合同编号', key: 'paperContractNo', dataIndex: 'paperContractNo' },
	{ title: '托运人', key: 'buyerName', dataIndex: 'buyerName' },
	{ title: '承运人', key: 'sellerName', dataIndex: 'sellerName' },
	{ title: '运输方式', dataIndex: 'transportModeDesc', width: 100 }
];

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
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择',
		options:[
			{ label: '火运', value: 'TRAIN' },
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '船运', value: 'SHIP' },
		]
	}
];
export default {
	name: 'ContractList',
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			searchModalParams: {
				paperContractNo: '',
				companyName: '',
				transportMode: ''
			},
			contractSearchModal: false,
			contractColumns,
			getPopupContainer,
			signTime: null,
			contractList: [],
			selectedRowKeys: [],
			selected: {},
			typeData: filterCodeByKey('goods_type'),
			transportMode: filterCodeByKey('despatchTypeDict'),
			loading: false,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			params: {
				paperContractNo: '',
				companyName: '',
				transportMode: ''
			}
		};
	},
	components: {
		iPagination
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.selected = record;
				}
			};
		}
	},
	props: {
		contractForm: {
			default: {}
		}
	},
	methods: {
		handleChangeSearch(data) {
			this.pagination = {
				pageNo: 1,
				pageSize: 10
			};
			this.searchParams = data;
			this.getList();
		},
		resetFunc() {
			this.defaultParams.tabType = 'TAB_ALL';
			
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selected = record;
					}
				}
			};
		},
		handleTableChange(pagination) {
			this.searchModalParams.pageNo = pagination.current;
			this.getList();
		},
		showModel() {
			this.contractSearchModal = true;
			
			this.resetValues();
		},
		//选择合同重置
		resetValues() {
			this.searchParams = {
			
			};
			this.signTime = null;
			this.pagination = {
				pageNo: 1,
				pageSize: 10
			};
			this.getList();
		},
		//查询合同列表
		searchSubmit() {
			this.searchModalParams.pageNo = 1;
			this.pagination = {
				current: 1
			};
			this.getList();
		},
		//加载合同列表
		getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.loading = true;
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			API_transport_contract_list({
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				productCode: 'LOGIC_DELIVER',
			})
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.contractList = result.records;
						const pagination = {
							total: result.total,
							pageSize: result.size,
							pageNo: result.current
						};
						this.pagination = pagination;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//获取合同签订时间
		getSignTime(value, dateString) {
			this.searchModalParams.contractSignTimeBegin = dateString[0];
			this.searchModalParams.contractSignTimeEnd = dateString[1];
		},
		handleOk() {
			if (!this.selectedRowKeys.length) {
				this.$message.warn('请选择合同');
				return;
			}
			this.$emit('validateContract', this.selectedRowKeys, this.selected);
			this.contractSearchModal = false;
		},
		handleCancel() {
			this.contractSearchModal = false;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
#contractModal {
	/deep/.ant-modal {
		width: 80% !important;
		min-width: 800px;

		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
		.search-wrap {
			padding: 0;
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
.table-wrap {
	margin-top: 20px;
}
.slModal {
	::v-deep.ant-modal-body {
		padding-top: 0 !important;
	}
}
</style>
