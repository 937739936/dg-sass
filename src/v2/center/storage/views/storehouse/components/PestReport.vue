<template>
	<a-row
		type="flex"
		:gutter="8"
		justify="space-between"
	>
		<a-col
			:span="12"
			class="item"
		>
			<a-table
				:columns="columns"
				:rowSelection="rowSelection"
				:rowKey="record => record.pgId"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:scroll="{ x: 300 }"
			>
				<span
					slot="receiverName"
					slot-scope="receiverName"
				>
					{{ receiverName || '-' }}
				</span>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-col>
		<a-col
			:span="12"
			class="item"
		>
			<div
				class="table"
				v-if="data.everyLayerDetailList.length > 0"
			>
				<div
					class="flex-box"
					v-for="(item, index) in data.everyLayerDetailList"
					:key="index"
				>
					<div
						class="border-right flex-box center border-bottom"
						style="width: 46px; height: 175px; padding: 0 3px"
					>
						第{{ index + 1 }}层
					</div>
					<div class="cell-wrapper">
						<div
							class="border-bottom flex-box"
							v-for="(i, idx) in item"
							:key="idx"
						>
							<div
								class="border-right cell flex-box"
								:style="{ height: '34px', width: 100 / 14 + '%' }"
								v-for="(j, jIdex) in i"
								:key="jIdex"
							>
								<span
									class="ellipsis"
									v-if="j[0]"
								>
									<a-tooltip placement="top">
										<template slot="title">
											<span>{{ j[0] }}/{{ j[1] == -1 ? '--' : j[1] }}</span>
										</template>
										<em
											class="r"
											v-if="j[1] > 0"
											>{{ j[0] }}/{{ j[1] }}</em
										>
										<template v-else>{{ j[0] }}/{{ j[1] == -1 ? '--' : j[1] }}</template>
									</a-tooltip>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="flex-box">
					<div
						v-for="(item, index) in data.layerPestsCountList"
						:key="index"
						:style="{ width: 100 / data.layerPestsCountList.length + '%' }"
					>
						<div class="border-bottom cell tc border-right">
							{{ index + 1 >= data.layerPestsCountList.length ? '整仓' : `${index + 1}层` }}
						</div>
						<div class="flex-box">
							<div :style="{ width: 100 / 3 + '%' }">
								<div class="cell border-bottom border-right">
									<span class="ellipsis">最高</span>
								</div>
								<div class="cell border-bottom border-right">
									<span class="ellipsis">{{ item.pestsMax }}</span>
								</div>
							</div>

							<div :style="{ width: 100 / 3 + '%' }">
								<div class="cell border-bottom border-right">
									<span class="ellipsis">最低</span>
								</div>
								<div class="cell border-bottom border-right">
									<span class="ellipsis">{{ item.pestsMin }}</span>
								</div>
							</div>

							<div :style="{ width: 100 / 3 + '%' }">
								<div class="cell border-bottom border-right">
									<span class="ellipsis">平均</span>
								</div>
								<div class="cell border-bottom border-right">
									<span class="ellipsis">{{ item.pestsAverage }}</span>
								</div>
							</div>
						</div>
					</div>
					<!-- <div :style="{ width: 100/(3+1) + '%' }" v-if="data.layerPestsCountList.length > 0">
            <div class="border-bottom cell tc border-right">
              整仓
            </div>
            <div class="flex-box">
              <div :style="{ width: 100/3 + '%' }" :key="i">
                <div class="cell border-bottom border-right">
                  最高
                </div>
                <div class="cell border-bottom border-right">
                  1231
                </div>
              </div>
            </div>
          </div> -->
				</div>

				<!-- <div class="flex-box">
          <div
            v-for="item in 3"
            :key="item"
            :style="{ width: 100/3 + '%' }">
            <div>
              <div class="cell flex-box border-bottom border-right">
                <div style="width: 50%" class="border-right">
                  粮食品种
                </div>
                <div style="width: 50%">
                  123
                </div>
              </div>
              <div class="cell flex-box border-bottom border-right">
                <div style="width: 50%" class="border-right">
                  粮食品种
                </div>
                <div style="width: 50%">
                  12312312312312
                </div>
              </div>
              <div class="cell flex-box border-bottom border-right">
                <div style="width: 50%" class="border-right">
                  粮食品种
                </div>
                <div style="width: 50%">
                  123000
                </div>
              </div>
            </div>
          </div>
        </div> -->

				<div class="cell border-bottom border-right">
					<span class="ellipsis">备注：1/20其中1代表通道号20代表虫害数量，1/--1代表通道号--代表未检测</span>
				</div>
			</div>
			<div
				class="border tc"
				style="min-height: 230px; padding-top: 80px"
				v-else
			>
				暂无虫害数据
			</div>
		</a-col>
	</a-row>
</template>

<script>
import { API_GrainSituationPestReport, API_GrainSituationPointPestsDetail } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";

const columns = [
	{
		title: '检测时间',
		dataIndex: 'detectTime',
		fixed: 'left',
		width: 90
	},
	{
		title: '害虫平均数量（头）',
		dataIndex: 'pestisCount',
		width: 160
	},
	{
		title: '害虫最大数量（头）',
		dataIndex: 'pestisMax',
		width: 160
	},
	{
		title: '害虫最小数量（头）',
		dataIndex: 'pestisMin',
		// fixed: 'right',
		width: 160
	}
];

export default {
	name: 'PestReport',

	props: {
		dateObj: {
			type: Object,
			default: () => {}
		},
		coreCompanyId: {
			type: String,
			default: ''
		},
		depotPointFlag: {
			type: String,
			default: ''
		}
	},

	components: {
		iPagination
	},

	data() {
		return {
			columns,
			form: this.$form.createForm(this),
			dataSource: [],
			data: {
				everyLayerDetailList: [],
				layerPestsCountList: []
			},
			selectedRowKeys: [],
			params: {},
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const itSelf = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					if (itSelf.selectedRowKeys[0] == record.pgId) {
						return;
					}
					itSelf.selectedRowKeys = [record.pgId];
					itSelf.getDetail(record.pgId);
				}
			};
		}
	},

	methods: {
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;

			API_GrainSituationPestReport({
				...this.params,
				...this.dateObj,
				storehouseId: this.$route.query.id,
				coreCompanyId: this.coreCompanyId,
				batchId: this.$route.query.batchId
			}).then(res => {
				if (res.success) {
					this.dataSource = res.data.list || [];
					this.pagination.total = res.data.total;
					if (this.dataSource.length <= 0) {
						this.data = {
							everyLayerDetailList: [],
							layerPestsCountList: []
						};
						return;
					}
					this.selectedRowKeys = [this.dataSource[0].pgId];
					this.getDetail(this.selectedRowKeys[0]);
				}
			});
		},

		getDetail(pgId) {
			API_GrainSituationPointPestsDetail(pgId, this.depotPointFlag)
				.then(res => {
					this.data = {
						everyLayerDetailList: [],
						layerPestsCountList: []
					};
					if (res.success) {
						if (!res.data.everyLayerDetailList) {
							return;
						}
						this.data = {
							...this.data,
							...res.data
						};
						// 填充数组
						const one = [];
						this.data.everyLayerDetailList.forEach((item, index) => {
							const two = [];
							[...new Array(5).keys()].forEach(i => {
								const three = [];
								[...new Array(14).keys()].forEach(j => {
									const index = i * 14 + j;
									const value = item[index] ? item[index] : ['', ''];
									three.push(value);
								});
								two.push(three);
							});
							one.push(two);
						});
						this.data.everyLayerDetailList = one;
					}
				})
				.catch(() => {
					this.data = {
						everyLayerDetailList: [],
						layerPestsCountList: []
					};
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
						if (this.selectedRowKeys[0] == record.pgId) {
							return;
						}
						this.selectedRowKeys = [record.pgId];
						this.getDetail(record.pgId);
					}
				}
			};
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.ant-table-thead > tr > th.ant-table-selection-column,
	.ant-table-tbody > tr > td.ant-table-selection-column {
		width: 1%;
		padding-left: 12px;
		padding-right: 5px;
	}
}
.item {
	width: 50%;
}
.table {
	border-top: 1px solid #000000;
	border-left: 1px solid #000000;
	.flex-box {
		display: flex;
	}
	.flex-1 {
		flex: 1;
	}
	.center {
		align-items: center;
		justify-content: center;
	}
	.cell-wrapper {
		width: calc(100% - 46px);
	}
	.cell {
		height: 35px;
		line-height: 35px;
		text-align: center;
		span {
			width: 100%;
			display: block;
			font-size: 10px;
		}
		.r {
			color: #f24e4d;
		}
	}
	.border {
		border: 1px solid #000000;
	}
	.border-right {
		border-right: 1px solid #000000;
	}
	.border-left {
		border-left: 1px solid #000000;
	}
	.border-top {
		border-top: 1px solid #000000;
	}
	.border-bottom {
		border-bottom: 1px solid #000000;
	}
}
::v-deep {
	.ant-table-tbody {
		tr {
			cursor: pointer;
		}
	}
}
</style>
