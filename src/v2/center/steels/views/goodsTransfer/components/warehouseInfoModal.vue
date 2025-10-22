<template>
	<div>
		<a-modal
			v-model="visible"
			width="900px"
			@ok="saveSelect"
			okText="添加"
		>
			<a-form
				style="margin-top: 20px"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 16 }"
				labelAlign="left"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="入库单号">
							<a-input v-model="searchParams.notifyNo" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="运单号">
							<a-input v-model="searchParams.transportNo" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="车牌号">
							<a-input v-model="searchParams.licensePlate" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="品名">
							<a-select
								v-model="searchParams.materialNameList"
								mode="multiple"
							>
								<a-select-option
									v-for="item in materialNameList"
									:value="item"
									:key="item"
								>
									{{ item }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item>
							<a-button
								type="primary"
								@click="search"
								icon="search"
							>
								查询
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				:rowSelection="rowSelection"
				:scroll="{ x: true }"
				:dataSource="list"
				rowKey="storageDetailId"
				:columns="columns"
				:pagination="false"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
			<div class="test">
				<i-pagination
					:pagination="pagination"
					:pageSizeOptions="['10']"
					@change="getPageByGoodsTransfer"
				/>
			</div>
		</a-modal>
		<Property
			:goodsTransferData="goodsTransferData"
			v-if="![3, 4].includes(handleType)"
			:uploadIds="uploadIds"
			@send="getSelectData"
		></Property>
		<div
			class="title"
			style="display: flex; justify-content: space-between; margin: 10px 0"
		>
			<span><i class="title_icon" />本次货转清单</span>
			<a-space>
				<a-button
					type="primary"
					@click="openModal"
				>
					手工挑选
				</a-button>
				<a-button
					type="primary"
					@click="del"
				>
					删除
				</a-button>
			</a-space>
		</div>
		<a-table
			:rowSelection="rowSelection2"
			:scroll="{ x: true }"
			:dataSource="confirmSelectData"
			rowKey="storageDetailId"
			:columns="columns"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
import { getPageByGoodsTransfer, getMaterialNameBySteelType } from '@/v2/center/steels/api/goodsTransfer.js';
import Property from './property.vue';
import iPagination from "@sub/components/iPagination";
const columns = [
	{
		title: '入库单号',
		dataIndex: 'notifyNo'
	},
	{
		title: '运单号',
		dataIndex: 'transportNo'
	},
	{
		title: '车牌号',
		dataIndex: 'licensePlate'
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		with: 150
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
		title: '件数（件）',
		dataIndex: 'currentPieceQuantity'
	},
	{
		title: '数量（吨）',
		dataIndex: 'currentQuantity'
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo',
		fixed: 'right'
	},
	{
		title: '入库时间',
		dataIndex: 'operationDate',
		fixed: 'right'
	}
];

export default {
	props: {
		steelType: {},
		handleType: {},
		warehouseAbbreviation: {}
	},
	data() {
		return {
			columns,
			visible: false,
			list: [],
			receiveIds: [],
			uploadIds: [],
			goodsTransferData: [],
			// 选择的数据
			selectData: [],
			// 确认选择的数据
			confirmSelectData: [],
			// 当前页面展示的数据
			receiveIds2: [],
			// 选择的数据
			selectData2: [],
			searchParams: {},
			// 选择的货权清单
			propertyData: [],
			materialNameList: [],
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			}
		};
	},
	computed: {
		rowSelection() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds,
				onChange: (selectedRowKeys, selectedRows) => {
					that.receiveIds = selectedRowKeys;
					that.selectData = selectedRows;
				}
			};
		},
		rowSelection2() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds2,
				onChange: (selectedRowKeys, selectedRows) => {
					that.receiveIds2 = selectedRowKeys;
					that.selectData2 = selectedRows;
				}
			};
		}
	},
	watch: {
		confirmSelectData(val) {
			this.$emit('send', val);
		}
	},

	methods: {
		// 初始化
		init(uploadIds, confirmSelectData, goodsTransferData) {
			this.uploadIds = uploadIds;
			this.confirmSelectData = confirmSelectData;
			this.goodsTransferData = goodsTransferData;
			if (![3, 4].includes(this.handleType)) {
				this.getMaterialNameBySteelType();
			}
		},
		search() {
			this.pagination.pageNo = 1;
			this.getPageByGoodsTransfer();
		},
		saveSelect() {
			if (!this.selectData.length) {
				this.$message.error('请选择');
				return;
			}
			this.receiveIds = [];
			this.visible = false;
			const list = JSON.parse(JSON.stringify(this.selectData));
			this.confirmSelectData = [...this.confirmSelectData, ...list];
			this.selectData = [];
		},
		async getPageByGoodsTransfer(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			const params = {
				...this.searchParams,
				...this.pagination,
				serialNo: this.$route.query.serialNo || '',
				warehouseAbbreviation: this.warehouseAbbreviation,
				idList: this.confirmSelectData.map(el => el.storageDetailId)
			};
			// 判断是否有待开具的清单
			if ([3, 4].includes(this.handleType)) {
				params.steelType = this.steelType;
			} else {
				params.productIdList = this.propertyData.map(el => el.purchaseId);
			}
			const res = await getPageByGoodsTransfer(params);
			this.list = res.data.records;
			this.pagination.total = res.data.total || 0;
		},
		// 打开弹窗
		openModal() {
			if (!this.propertyData.length && ![3, 4].includes(this.handleType)) {
				this.$message.error('请选择待开具的货权清单');
				return;
			}
			this.visible = true;
			this.search();
		},
		// 删除
		del() {
			if (!this.receiveIds2.length) {
				this.$message.error('请选择');
				return;
			}
			this.$confirm({
				title: '提示',
				content: '是否确认删除',
				onOk: () => {
					for (let i = this.confirmSelectData.length - 1; i >= 0; i--) {
						const item = this.confirmSelectData[i];
						const index = this.receiveIds2.find(el2 => el2 == item.storageDetailId);
						if (index) {
							this.confirmSelectData.splice(i, 1);
						}
					}
					this.receiveIds2 = [];
				},
				onCancel() {}
			});
		},
		// 获取选择的带开具货权清单
		getSelectData(data) {
			this.propertyData = data;
			const list = this.propertyData.map(el => el.materialName);
			const setList = new Set(list);
			const newList = Array.from(setList);
			this.materialNameList = newList;
			// 如果当前已经有选择的数据 判断取消勾选的时候 去掉对应的数据
			if (this.confirmSelectData.length) {
				let temp = [];
				let newConfirmSelectData = [];
				this.confirmSelectData.forEach((el, i, arr) => {
					el.mainId = `${el.materialName}${el.specs}${el.placeOfOrigin}${el.materialTexture}${el.baleNo}`;
					data.forEach(el2 => {
						if (el.mainId == el2.mainId) {
							if (!temp.includes(el.id)) {
								temp.push(el.id);
								newConfirmSelectData.push(el);
							}
						}
					});
				});
				this.confirmSelectData = newConfirmSelectData;
			}
		},
		// 获取品名列表
		async getMaterialNameBySteelType() {
			const params = {
				steelType: this.steelType.join()
			};
			const res = await getMaterialNameBySteelType(params);
			this.materialNameList = res.data;
		}
	},
	components: {
		Property,
		iPagination
	}
};
</script>

<style scoped></style>
