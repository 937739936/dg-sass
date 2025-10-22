<template>
	<div class="returned-info">
		<p class="title">结算单信息</p>
		<div class="returned-info-top">
			<div class="returned-info-left">
				<div
					class="slTitleThird"
					style="margin-top: 0"
				>
					<span class="sub-title sub-title2">结算单信息</span>
				</div>
				<a-button
					style="margin-left: 20px"
					type="primary"
					v-if="editFlag"
					class="returned-info-right"
					ghost
					@click="addSettle"
					>新增结算单</a-button
				>

				<!-- <div class="returned-info-top-item">
          <p class="c4 ft12">结算单数量</p>
          <p class="c8 ft20 fw600">{{list.length}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">已结算数量(吨)</p>
          <p class="c8 ft20 fw600">{{formatMoney(allSettleAmount)}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">已结算金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(allSettlePrice)}}</p>
        </div> -->
			</div>
		</div>
		<!-- 结算单信息 -->
		<div class="table-box">
			<a-table
				:columns="settleColumns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:rowSelection="rowSelection"
				:scroll="{ x: 400 }"
				:dataSource="list"
				:pagination="false"
			>
				<template
					slot="status"
					slot-scope="text, items"
				>
					<!-- 状态 -->
					<span
						class="status"
						:class="`status-${items.status}`"
						>{{ items.statusDesc }}</span
					>
				</template>

				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-tooltip placement="topLeft">
						<template slot="title">
							<p
								class="cur"
								v-for="item in items.attachmentList"
								:key="item.fileUrl"
								@click="handlePreview(item)"
							>
								{{ item.fileName }}
							</p>
						</template>
						<a
							class="omit"
							href="javascript:;"
							v-for="item in items.attachmentList"
							:key="item.fileUrl"
							@click="handlePreview(item)"
							>{{ item.fileName }}</a
						>
					</a-tooltip>
				</template>
			</a-table>
			<div
				v-if="editFlag"
				style="margin-top: 20px"
			>
				<span>本次选择：结算单数量{{ selectedRowKeys.length }}张</span>
				<span style="margin: 0 20px">已结算数量：{{ formatMoney(allSettleQuantity) }}吨</span>
				<span>已结算金额：{{ formatMoney(allSettleAmount) }}元</span>
			</div>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { mapGetters } from 'vuex';
import { API_GETCURRENTENV } from 'api';
// colums
const settleColumns = [
	{ title: '结算单编号', dataIndex: 'serialNo', width: 250 },
	{ title: '结算日期', dataIndex: 'statementTime', width: 150 },
	{ title: '结算金额(元)', dataIndex: 'settleAmount', width: 150, customRender: t => formatMoney(t) },
	{ title: '结算单价(元/吨)', dataIndex: 'settleUnitPrice', width: 150, customRender: t => formatMoney(t) },
	{ title: '结算数量(吨)', dataIndex: 'settleQuantity', width: 150, customRender: t => formatMoney(t) },
	{ title: '结算状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: 100 },
	{ title: '文件名称', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 200, ellipsis: true }
];
import ENV from '@/v2/config/env';
export default {
	props: {
		// 结算单信息
		contractInfo: {
			default: () => {
				return {};
			}
		},
		settlesInfo: {
			default: () => {
				return { list: [] };
			}
		},
		editFlag: {
			default: true
		},
		// 金融机构
		isJr: {
			default: false
		}
	},
	data() {
		return {
			settleColumns,
			list: [],
			selectedRowKeys: [],
			previewImg: '',
			selectedList: []
		};
	},
	computed: {
		...mapGetters('business', {
			VUEX_POOL_ASSET_OBJ: 'VUEX_POOL_ASSET_OBJ'
		}),
		rowSelection() {
			if (this.isJr || !this.editFlag) return null;
			const { selectedRowKeys } = this;
			const t = this;
			return {
				selectedRowKeys: selectedRowKeys,
				getCheckboxProps: record => ({
					props: {
						disabled: !this.editFlag
					}
				}),
				onSelect: (record, selected, selectedRows) => {
					t.selectedRowKeys = selectedRows.map(el => el.id);
					this.selectedList = selectedRows;
				},
				onSelectAll: (selected, selectedRows) => {
					t.selectedRowKeys = selectedRows.map(el => el.id);
					this.selectedList = selectedRows;
				}
			};
		},
		// 计算结算已结算数量
		allSettleAmount() {
			let num = 0;
			this.selectedList.forEach(el => {
				num += el.settleAmount;
			});
			return num;
		},
		// 计算已结算金额
		allSettleQuantity() {
			let num = 0;
			this.selectedList.forEach(el => {
				num += el.settleQuantity;
			});
			return num;
		}
	},
	watch: {
		settlesInfo: {
			handler(info) {
				if (!info) return;
				this.selectedRowKeys = info.list.map(el => String(el.id));
				if (this.isJr && info.list) {
					info.list.forEach(el => {
						const item = el.attachmentList[0];
						el.locked = item.locked;
					});
					this.list = info.list.filter(el => el.locked == 1);
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {},
	methods: {
		formatMoney,
		init(list) {
			this.list = list;
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		// 新增结算单
		addSettle() {
			if (!this.contractInfo.id) {
				this.$message.error('请选择合同');
				return;
			}
			let path = `/center/settle/sell/onlineadd?orderId=${this.contractInfo.orderId}&contractId=${this.contractInfo.id}`;
			// 线下
			if (this.contractInfo.contractType == 'DOWN') {
				path = `/center/settle/sell/offlineadd?contractNo=${this.contractInfo.serialNo}&contractId=${this.contractInfo.id}`;
			}

			this.$router.push({ path });
		},
		onSubmit() {
			// 检测当前缺少必填项
			if (!this.list.length) {
				this.$message.error('缺少结算单信息');
				return false;
			}
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择结算单');
				return false;
			}

			return this.selectedRowKeys;
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.sub-title {
	font-family: PingFangSC-Medium;
	position: relative;
	margin-left: 10px;

	&:before {
		content: '';
		float: left;
		position: absolute;
		left: -10px;
		top: 3px;
		width: 4px;
		height: 14px;
		background: @primary-color;
	}
}
.title {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
	margin-bottom: 20px;
	color: #000;
}
.new-table2 {
	/deep/ .ant-table-body {
	}
	/deep/ tr.ant-table-expanded-row td {
		border-top: 1px solid #e5e6eb;
	}
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.returned-info {
	&-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		&-item {
			width: 188px;
			height: 80px;
			flex-shrink: 0;
			padding: 12px;
			box-sizing: border-box;
			border-radius: 6px;
			background: #f0f8ff;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-right: 20px;
			&.common {
				background: #ebfaef;
			}
		}
	}
	&-left {
		display: flex;
		align-items: center;
	}
	&-right {
		display: flex;
		width: 116px;
		height: 32px;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
	}
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
	}
}
.c4 {
	color: rgba(0, 0, 0, 0.4);
}
.c8 {
	color: rgba(0, 0, 0, 0.8);
}
.ft12 {
	font-size: 12px;
}
.ft20 {
	font-size: 20px;
}
.fw600 {
	font-weight: 600;
}
.cur {
	cursor: pointer;
}
</style>
