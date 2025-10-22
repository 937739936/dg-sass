<template>
	<a-modal
		:visible="visible"
		title="选择仓单信息"
		:width="1200"
		@cancel="
			() => {
				visible = false;
			}
		"
		@ok="okInc"
	>
		<a-row style="margin-top: 20px">
			<a-form
				:label-col="{
					span: 8
				}"
				:wrapper-col="{
					span: 14
				}"
			>
				<a-col
					:span="9"
					class="row"
				>
					<a-form-item label="存货点">
						<a-select
							:showArrow="true"
							style="width: 100%"
							placeholder="请选择"
							v-model="queryParams.id"
						>
							<a-select-option
								v-for="(items, index) in goodsModalHuoList"
								:key="index"
								:value="items.inventoryPointId"
								>{{ items.inventoryPoint }}</a-select-option
							>
						</a-select>
					</a-form-item>
					<a-form-item label="入库单号">
						<a-input v-model="queryParams.number"></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="9"
					class="row"
				>
					<a-form-item label="入库日期">
						<a-range-picker
							v-model="applyTime"
							:placeholder="['开始时间', '结束时间']"
							format="YYYY-MM-DD"
							@change="getTime"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="6"
					class="row"
				>
					<a-form-item
						label=" "
						:colon="false"
					></a-form-item>
					<a-form-item
						label=" "
						:colon="false"
					>
						<a-button
							type="primary"
							@click.native="searchSubmit()"
							>查询</a-button
						>
						<a-button
							style="margin-left: 20px"
							@click.native="resetValues"
							>重置</a-button
						>
					</a-form-item>
				</a-col>
			</a-form>
		</a-row>
		<a-row>
			<a-table
				:columns="goodsModalColumns"
				:dataSource="goodsModalDataSource"
				bordered
				:pagination="pagination"
				@change="handleTableChange"
				:scroll="{ x: 1000 }"
				:rowKey="record => record.id"
				:rowSelection="rowSelection"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
		</a-row>
	</a-modal>
</template>
<script>
import {
	API_AssetsGoodsModalFINList,
	API_STORAGEGOODSPOINTLIST,
	API_AssetsGoodsModalList
} from '@/v2/center/assets/api/index.js';
import _ from 'lodash';
export default {
	name: 'ChooseGoods',
	// props: ["showChoose", "contractId", "contractType"],
	components: {},
	data() {
		return {
			visible: false,
			queryParams: {},

			pagination: {
				total: 0,
				pageSize: 5,
				current: 1
			},
			selectedRows: [],
			goodsModalHuoList: [],
			goodsModalDataSource: [],
			applyTime: null,
			goodsModalColumns: [
				{ title: '入库单号', dataIndex: 'number', key: 'number' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '质押数量（吨）', dataIndex: 'hasPledgeQuantity', key: 'hasPledgeQuantity' },
				{ title: '可质押数量（吨）', dataIndex: 'canPledgeQuantity', key: 'canPledgeQuantity' },
				{ title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue' },
				{ title: '入库日期', dataIndex: 'inoutDate', key: 'inoutDate' },
				{ title: '运输方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
				{ title: '采购合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' }
			]
		};
	},

	computed: {
		rowSelection() {
			return {
				type: 'checkbox',
				selectedRowKeys: this.selectedRows.map(i => i.id),
				onSelect: (record, selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						this.selectedRows = this.selectedRows.filter(o => o.id != record.id);
					}
				},
				onSelectAll: (selected, selectedRows) => {
					if (selected) {
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						this.selectedRows = this.selectedRows.filter(o => !selectedRows.some(k => k.id == o.id));
					}
				}
			};
		}
	},

	methods: {
		getGoodsList() {
			API_STORAGEGOODSPOINTLIST({ storageId: this.storageId }).then(res => {
				this.goodsModalHuoList = res.data || [];
			});
			this.queryParams.pageNo = this.pagination.current;
			this.queryParams.pageSize = this.pagination.pageSize;
			API_AssetsGoodsModalFINList({
				...this.queryParams,
				storageNo: this.storageNo || 'WH0001',
				goodsRecordNos: this.currentItem ? Array.from(new Set(this.currentItem.goodsRecordNos)).join(',') : null,
				serialNo: this.currentItem ? this.currentItem.serialNo : null
			}).then(res => {
				this.goodsModalDataSource = res.data.records || [];

				this.pagination.total = res.data.total;
			});
		},
		getGoodsListAss() {
			this.queryParams.pageNo = this.pagination.current;
			this.queryParams.pageSize = this.pagination.pageSize;
			API_AssetsGoodsModalList({
				...this.queryParams,
				calculateType: this.calculateType,
				storageNo: this.storageNo,
				price: this.price
			}).then(res => {
				this.goodsModalDataSource = res.data.records || [];
				this.pagination.total = res.data.total;
			});
		},
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;

			this.getList();
		},
		getTime(value, dateString) {
			this.queryParams.inoutDateBegin = dateString[0];
			this.queryParams.inoutDateEnd = dateString[1];
		},
		resetValues() {
			this.pagination.current = 1;
			this.applyTime = null;
			this.queryParams = {};

			this.searchSubmit();
		},
		searchSubmit() {
			this.pagination.current = 1;
			this.getList();
		},
		getList() {
			if (this.calculateType) {
				this.getGoodsListAss();
			} else {
				this.getGoodsList();
			}
		},
		innerShow(selectedRows) {
			this.visible = true;
			this.selectedRows = selectedRows;
			this.originSelectedRows = JSON.parse(JSON.stringify(selectedRows));
			API_STORAGEGOODSPOINTLIST({ storageId: this.storageId }).then(res => {
				this.goodsModalHuoList = res.data || [];
			});
			this.resetValues();
		},
		show(selectedRows, storageNo, storageId, item) {
			this.storageId = storageId;
			this.storageNo = storageNo;
			this.currentItem = item || null;
			this.innerShow(selectedRows);
		},
		showAss(selectedRows, storageNo, calculateType, price, storageId) {
			this.calculateType = calculateType;
			this.storageNo = storageNo;
			this.price = price;
			this.storageId = storageId;
			this.innerShow(selectedRows);
		},
		okInc() {
			let map = {};
			for (var i = 0; i < this.originSelectedRows.length; i++) {
				map[this.originSelectedRows[i].id] = this.originSelectedRows[i];
			}
			let list = [];
			for (var i = 0; i < this.selectedRows.length; i++) {
				if (map[this.selectedRows[i].id]) {
					list.push(map[this.selectedRows[i].id]);
				} else {
					list.push(this.selectedRows[i]);
				}
			}
			this.$emit('chooseFinGoods', list, this.currentItem);
			this.visible = false;
		}
	}
};
</script>
<style lang="less" scoped></style>
