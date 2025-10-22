<template>
	<div class="table-box">
		<a-table
			v-if="businessLineData.length"
			:columns="businessLineColumns"
			class="new-table"
			:bordered="false"
			:dataSource="businessLineData"
			:pagination="false"
			:rowKey="record => record.businessLineNo"
			:rowSelection="{
				selectedRowKeys: selectedRowKeys,
				onChange: onSelectChange,
				type: 'radio'
			}"
			:customRow="onClickRow"
		>
			<template
				slot="businessLineNo"
				slot-scope="text, items"
			>
				<a @click="viewDetail(items)">{{text}}</a>
			</template>
		</a-table>
		<div
			v-else
			class="business-line-empty-box"
		>
			<div class="business-line-empty-content">
				<a-row
					type="flex"
					:gutter="30"
				>
					<a-col>
						<img
							src="@/v2/assets/imgs/contract/no_businessline_bg.png"
							alt=""
							style="width: 66px"
						/>
					</a-col>
					<a-col>
						<template>
							<p class="label">当前合同尚未关联{{ type === 'BUY' ? '销售' : '采购' }}合同，未形成业务线</p>
							<a-button
								type="primary"
								class="slBtn"
								@click="realteContract"
								>关联{{ type === 'BUY' ? '销售' : '采购' }}合同</a-button
							>
						</template>
					</a-col>
				</a-row>
			</div>
		</div>
	</div>
</template>

<script>
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo',scopedSlots: {
		customRender: 'businessLineNo'
	}, },
	{ title: '业务线名称', dataIndex: 'businessLineName',},
	{ title: '采购合同编号', dataIndex: 'buyerContractNo', },
	{ title: '销售合同编号', dataIndex: 'sellerContractNo' },
];
import { mapMutations } from 'vuex';
export default {
	props: {
		businessLineVo: {
			type: Array,
			default: () => {
				return [];
			}
		},
		contractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			businessLineColumns,
			businessLineData: [],
			selectedRowKeys: [], // 选中全业务线key
			type: 'BUY'
		};
	},
	watch: {
		businessLineVo(data) {
			this.businessLineData = data;
			if (this.businessLineData.length === 1) {
				this.selectedRowKeys = [this.businessLineData[0].businessLineNo];
			}
		},
		selectedRowKeys(data) {
			if (data.length) {
				let select = ''
				this.businessLineData.forEach(item => {
					if (item.businessLineNo == data[0]) {
						this.$emit('getReturnInfo', item)
					}
				});
			}
		}
	},
	computed: {
	},
	mounted() {
	},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract',
		}),
		// 编辑业务线
		async edit(businessLineVO) {
			this.selectedRowKeys = businessLineVO ? [businessLineVO] : [];
		},
		// 业务线详情
		viewDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/businessline/detail',
				query: {
					upOrderNo: items.upOrderNo,
					downOrderNo: items.downOrderNo,
					businessLineType: items.businessLineType,
					businessLineNo: items.businessLineNo,
				}
			});
			window.open(routerData.href, '_blank');
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		onClickRow(record) {
			// 选中全业务线一行
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.businessLineNo];
					}
				}
			};
		},
		// 关联合同
		realteContract() {
			if (this.$route.query.contractType === 'OFFLINE') {
				this.contractInfo.paperContractNo = this.contractInfo.contractNo
				this.contractInfo.execDateStart = this.contractInfo.deliveryStartDate
				this.contractInfo.execDateEnd = this.contractInfo.deliveryEndDate
				this.contractInfo.transType = this.contractInfo.transportMode
				this.contractInfo.contractNo = this.$route.query.serialNo
			}
			this.VUEX_setRelationContract(this.contractInfo);
			this.$router.push({
				path: '/center/businessline/addAssociation',
				query: {
					type: 'buy',
					orderType: this.$route.query.contractType === 'ONLINE' ? 'ONLINE' : 'UP',
					source: 'contract'
				}
			});
		},
		save() {
			return this.selectedRowKeys[0]
		}
	}
};
</script>
<style lang="less" scoped>
	@import url('~@/v2/style/table-cover.less');
	</style>
<style lang="less" scoped>
.business-line-empty-box {
	width: 100%;
	height: 88px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	text-align: center;
	.business-line-empty-content {
		width: 380px;
		margin: 11px auto;
		.label {
			line-height: 20px;
			margin-bottom: 10px;
		}
		.slBtn {
			margin-left: 0;
			float: left;
		}
	}
	.flexStyle {
		display: flex;
		align-items: center;
	}
}
</style>
