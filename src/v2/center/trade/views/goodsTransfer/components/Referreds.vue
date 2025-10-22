<template>
	<div>
		<a-table
			:columns="columns"
			class="new-table"
			:rowKey="key"
			:dataSource="dataSource"
			:pagination="false"
			:scroll="{ x: true }"
			:row-selection="disabled ? null : rowSelection"
		>
			<span
				slot="Amount"
				slot-scope="text"
			>
				{{ text | formatMoney(2) }}</span
			>
			<div
				slot="goodsTransferNo"
				slot-scope="goodsTransferNo, item"
			>
				<a
					href="javascript:void(0)"
					@click="handleViewDetail(item)"
					>{{ goodsTransferNo }}</a
				>
			</div>
		</a-table>
		<FileLook ref="fileLook" />
	</div>
</template>

<script>
import { referredsColumns } from '../columns/columns.js';
import FileLook from '@/v2/components/fileTable/FileLook';
export default {
	components: {
		FileLook
	},
	props: {
		dataSource: {
			type: Array,
			default: () => {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		//调取类型，如果是查看详情，则货转编号打开PDf
		type: {
			type: String,
			default: ''
		},
		selectIdList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			columns: referredsColumns,
			key: 'goodsTransferNo', //表单唯一值，select选中值
			selectedRows: [] //选中
		};
	},
	computed: {
		rowSelection() {
			let that = this;
			return {
				type: 'radio',
				columnWidth: 29,
				getCheckboxProps: rescord => {
					return {
						props: {
							disabled: !rescord.canSelect
						}
					};
				},
				selectedRowKeys: that.selectedRows,
				onSelect: record => {
					that.selectedRows = [record[that.key]];
					that.electNoChange();
				}
			};
		}
	},
	watch: {
		selectIdList(val) {
			this.selectedRows = val;
		}
	},
	filters: {},
	mounted() {
		this.selectedRows = this.selectIdList || [];
	},
	methods: {
		electNoChange() {
			//不能数据监听，方式外部修改导致重复赋值
			if (this.$listeners.electNoChange) {
				this.$emit('electNoChange', {
					data: this.selectedRows,
					ref: 'referreds'
				});
			}
		},
		handleViewDetail(item) {
			if (this.type == 'detail') {
				this.$refs.fileLook.fileLook({ url: item.pdfPath });
			} else {
				let routeUrl = this.$router.resolve({
					path: '/center/transfer/goodsTransfer/detail',
					query: {
						goodsTransferNo: item.goodsTransferNo
					}
				});
				window.open(routeUrl.href, '_blank');
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.new-table {
	margin: 20px 0;
}
</style>
