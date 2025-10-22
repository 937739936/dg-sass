<template>
	<div>
		<a-modal
			id="orderModal"
			title="网价查询"
			width="1200"
			v-model="orderSearchModal"
			@ok="submit"
		>
			<div>
				<SlForm
					:list="searchList"
					layout="inline"
					@change="changeSearch"
					:isShowIcon="false"
				></SlForm>
				<!-- 表格 -->
				<div class="table-box">
					<a-table
						:columns="columns"
						:rowSelection="rowSelection"
						class="new-table"
						:bordered="false"
						rowKey="id"
						:customRow="clickCustomRow"
						:dataSource="list"
						:pagination="false"
						:loading="loading"
						:scroll="{ x: 1600, y: 400 }"
					>
						<template
							slot="raise"
							slot-scope="text, record"
						>
							<div
								style="color: #45bf83"
								v-if="record.raise < 0"
								s
							>
								<img
									class="up"
									:src="down"
									alt=""
								/>
								{{ record.raise }}
							</div>
							<div
								style="color: #dd4444"
								v-else-if="record.raise > 0"
							>
								<img
									class="up"
									:src="up"
									alt=""
								/>
								+{{ record.raise }}
							</div>
							<div v-else>-</div>
						</template>
						<div
							slot="tendency"
							slot-scope="text, record"
						>
							<div
								class="btn-box"
								@click="goDetail(record)"
							>
								<span class="svg-line">{{ record.tendency }}</span>
							</div>
						</div>
					</a-table>
				</div>
				<i-pagination
					:pagination="pagination"
					size="small"
					:pageSizeOptions="['50', '100', '150', '200']"
					:defaultPageSize="100"
					@change="getList"
				/>
			</div>
		</a-modal>
	</div>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import SlForm from '@sub/components/ui-new/Form/sl-form';
import { getMarketPriceList } from '@/v2/center/steels/api/statement.js';
import up from '@/assets/imgs/storage/up.png';
import down from '@/assets/imgs/storage/down.png';
import moment from 'moment';
export default {
	props: ['marketPriceId'],
	data() {
		return {
			searchList: [
				{
					decorator: [
						'date',
						{
							initialValue: moment().startOf('day').format('YYYY-MM-DD')
						}
					],
					addonBeforeTitle: '日期',
					type: 'datePicker',
					placeholder: '请输入',
					allowClear: false
				},
				{
					decorator: ['area'],
					addonBeforeTitle: '区域',
					type: 'input',
					placeholder: '请输入区域',
					allowClear: true
				},
				{
					decorator: ['steelType'],
					addonBeforeTitle: '钢材种类',
					type: 'input',
					placeholder: '请输入钢材种类',
					allowClear: true
				},
				{
					decorator: ['materialName'],
					addonBeforeTitle: '品名',
					type: 'input',
					placeholder: '请输入品名',
					allowClear: true
				},
				{
					decorator: ['placeOfOrigin'],
					addonBeforeTitle: '钢厂/产地',
					type: 'input',
					placeholder: '请输入钢厂/产地',
					allowClear: true
				}
			],
			searchParams: {},
			pagination: {
				total: 100, // 总条数
				pageNo: 1
			},
			orderSearchModal: false,
			columns: [
				{ title: '来源', dataIndex: 'sourceFromDesc', key: 'sourceFromDesc' },
				{ title: '日期', dataIndex: 'date', key: 'date', width: 150 },
				{ title: '时间', dataIndex: 'time', key: 'time' },
				{ title: '区域', dataIndex: 'area', key: 'area' },
				{ title: '钢材种类', dataIndex: 'steelType', key: 'steelType' },
				{ title: '品名', dataIndex: 'materialName', key: 'materialName' },
				{ title: '规格', dataIndex: 'specs', key: 'specs' },
				{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
				{ title: '钢厂/产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin', width: 150 },
				{ title: '价格(元/吨)', dataIndex: 'unitPrice', key: 'unitPrice', width: 150 },
				{ title: '涨跌(元/吨)', dataIndex: 'raise', key: 'raise', scopedSlots: { customRender: 'raise' }, width: 100 },
				{ title: '备注', dataIndex: 'note', key: 'note' }
			],
			pageSize: 100,
			loading: false,
			list: [],
			selectedRowKeys: [],
			selectedRows: [],
			up,
			down
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				fixed: true,
				selectedRowKeys: selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys;
					this.selectedRows = selectedRows;
				}
			};
		}
	},
	watch: {
		marketPriceId: {
			handler(val) {
				if (!val) return;
				this.selectedRowKeys = [val];
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		open() {
			this.orderSearchModal = true;
			this.getList();
		},
		close() {
			this.orderSearchModal = false;
		},
		clickCustomRow(record, index) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selectedRows = [record];
					}
				}
			};
		},
		submit() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择');
				return;
			}
			this.$emit('send', this.selectedRowKeys[0], this.selectedRows);
			this.close();
		},
		changeSearch(info) {
			this.searchParams = info;
			this.getList(1);
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			if (!params.date) {
				params.date = moment().startOf('day').format('YYYY-MM-DD');
			}
			this.loading = true;
			try {
				const res = await getMarketPriceList(params);
				res.data.records.forEach(el => {
					el.tendency = el?.miniCharts?.join();
				});
				this.list = res.data.records;
				this.pagination.total = res.data.total;
				this.loading = false;
				this.$nextTick(() => {
					$('.svg-line').peity('line');
				});
			} catch (error) {
				this.loading = false;
			}
		}
	},
	components: {
		iPagination,
		SlForm
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
/deep/ .ant-modal {
	width: 1200px;
}
/deep/ .ant-table-thead > tr > th {
	padding: 12px 16px;
}
/deep/ .ant-table-tbody > tr > td {
	padding: 12px 16px;
}
.page-title {
	display: flex;
}
.icon,
.icon2 {
	width: 18px;
	vertical-align: middle;
	margin-right: 15px;
}
.btn-box-title {
	display: flex;
	align-items: center;
	.btn {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		display: flex;
		justify-content: center;
		align-items: center;
		color: @primary-color;
		font-size: 14px;
		margin-left: 20px;
		font-weight: 400;
		cursor: pointer;
	}
}
.table-box {
	margin-top: 40px;
}
.up {
	width: 25px;
	height: 25px;
	background: rgba(231, 255, 243, 0.5);
	border-radius: 7px;
}
.btn {
	margin-left: 5px;
}
</style>
