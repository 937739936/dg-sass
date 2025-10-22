<template>
	<a-modal
		width="60%"
		class="slModal"
		:visible="visible"
		@cancel="close"
		destroyOnClose
	>
		<template slot="title">
			<div class="title">
				<div class="name">{{ title }}</div>
			</div>
		</template>
		<a-spin :spinning="spinning">
			<div class="content">
				<a-table
					class="new-table"
					:dataSource="coalBlendingList"
					:columns="coalBlendingColumns"
					:pagination="false"
					:scroll="{ x: true }"
					rowKey="uuid"
				></a-table>
				<BlendingCoalProduceForm
					v-if="type === 'BLENDING_COAL'"
					ref="blendingCoalProduceForm"
					:isManager="isManager"
					:coalTypeAllList="coalTypeAllList"
					:houseAndGoodsAllocationTreeData="houseAndGoodsAllocationTreeData"
					:initialFormValues="initialFormValues"
					@onClickAddCoalType="onClickAddCoalType"
				></BlendingCoalProduceForm>
				<WashCoalProduceForm
					v-if="type === 'WASH_COAL'"
					ref="washCoalProduceForm"
					:isManager="isManager"
					:coalTypeAllList="coalTypeAllList"
					:houseAndGoodsAllocationTreeData="houseAndGoodsAllocationTreeData"
					:initialFormValues="initialFormValues"
					:blendCoalTotalQuantity="blendCoalTotalQuantity"
					@onClickAddCoalType="onClickAddCoalType"
				></WashCoalProduceForm>
			</div>
		</a-spin>
		<template slot="footer">
			<a-space :size="20">
				<div
					class="footer-btn cancel-btn"
					@click="close"
				>
					取消
				</div>
				<div
					class="footer-btn confirm-btn"
					@click="confirmBtnClick"
				>
					确定
				</div>
			</a-space>
		</template>
	</a-modal>
</template>

<script>
import { getStationHouseByShipper, getCoalTypeAllList } from '@/v2/center/logisticsPlatform/api';
import BlendingCoalProduceForm from './BlendingCoalProduceForm.vue';
import WashCoalProduceForm from './WashCoalProduceForm.vue';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
export default {
	name: 'CoalBlendingConfirmModal',
	components: {
		BlendingCoalProduceForm,
		WashCoalProduceForm
	},
	props: {
		// 货主企业uscc
		shipperCompanyUscc: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			title: '确认配煤信息', // 标题
			visible: false, // 是否显示
			spinning: false, // 是否正在加载
			coalTypeAllList: [], // 煤种列表
			houseAndGoodsAllocationTreeData: [], // 仓房&货位树形数据
			initialBlendingInfo: {} // 配煤信息
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		// 配煤类型
		type() {
			return this.initialBlendingInfo.type;
		},
		// 配煤信息列表
		coalBlendingList() {
			return this.initialBlendingInfo.coalBlendingList || [];
		},
		// 配煤总量
		blendCoalTotalQuantity() {
			let totle = 0;
			this.coalBlendingList.forEach(element => {
				totle += element.quantity;
			});
			totle = Math.round(totle * 100) / 100;
			return totle;
		},
		// 表单初始值
		initialFormValues() {
			let a = cloneDeep(this.initialBlendingInfo);
			let { coalTotalQuantity, produceCoalList, coalRecovery } = a;
			let tempCoalTotalQuantity = coalTotalQuantity || this.blendCoalTotalQuantity; // 出煤总量
			if (this.type === 'BLENDING_COAL') {
				tempCoalTotalQuantity = this.blendCoalTotalQuantity;
			} else {
				tempCoalTotalQuantity = coalTotalQuantity || this.blendCoalTotalQuantity;
			}
			let initialValues = {
				coalTotalQuantity: tempCoalTotalQuantity, // 出煤总量
				coalRecovery: coalRecovery, // 洗煤回收率
				produceCoalList: [] // 出煤
			};
			produceCoalList = produceCoalList || [];
			produceCoalList = produceCoalList.map(item => {
				item.houseAndGoodsAllocation = [item.houseId, item.goodsAllocationId];
				return item;
			});
			initialValues = { ...initialValues, produceCoalList };
			return initialValues;
		},
		// 配煤的列表项
		coalBlendingColumns() {
			let list = [];
			list = columns
			if (this.isManager) {
				list = list.filter(item => item.dataIndex !== 'price');
			}
			return [...list];
		}
	},
	created() {
		window.addEventListener('visibilitychange', this.visibilitychange);
	},
	destroyed() {
		window.removeEventListener('visibilitychange', this.visibilitychange);
	},
	methods: {
		visibilitychange(e) {
			if (e.target.visibilityState === 'visible' && this.visible) {
				this.initConfigInfo();
			}
		},
		// 显示弹窗
		show(info) {
			this.initConfigInfo();
			this.initialBlendingInfo = cloneDeep(info);
			this.visible = true;
		},
		// 关闭弹窗
		close() {
			this.visible = false;
		},
		// 确认按钮点击事件
		async confirmBtnClick() {
			try {
				let produceCoalInfo = this.initialFormValues;
				if (this.type === 'BLENDING_COAL') {
					produceCoalInfo = await this.$refs.blendingCoalProduceForm.validateProduceCoalInfo();
				} else if (this.type === 'WASH_COAL') {
					produceCoalInfo = await this.$refs.washCoalProduceForm.validateProduceCoalInfo();
				}
				// 点击确认按钮
				this.$emit('onConfirm', produceCoalInfo);
				this.close();
			} catch (error) {
				// 表单校验失败
				if (error) {
					this.$message.error(error);
				}
			}
		},
		initConfigInfo() {
			// 初始化配煤信息
			this.getCoalTypeList();
			this.getHouseAndGoodsAllocationTreeData();
		},
		// 煤种列表
		getCoalTypeList() {
			getCoalTypeAllList().then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.coalTypeAllList = data;
			});
		},
		// 打开煤种编辑页面
		onClickAddCoalType() {
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/coalConfig',
				query: {}
			});
			window.open(routerData.href, '_blank');
		},
		// 获取仓房&货位树形数据
		getHouseAndGoodsAllocationTreeData() {
			getStationHouseByShipper({ shipperCreditCode: this.shipperCompanyUscc }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				/*
				{id: 1, name: '仓房1', goodsAllocations: [{id: 11, name: '货位11'}, {id: 12, name: '货位12'}]}
				*/
				this.houseAndGoodsAllocationTreeData = data.map(item => {
					item.label = item.name;
					item.selectable = false;
					item.goodsAllocations = item.goodsAllocations.map(goods => {
						goods.label = `${item.name}&${goods.name}`;
						goods.key = `${item.id}-${goods.id}`;
						goods.houseAndGoodsAllocation = {
							houseId: item.id,
							houseName: item.name,
							goodsAllocationId: goods.id,
							goodsAllocationName: goods.name
						};
						return goods;
					});
					if (item.goodsAllocations.length === 0) {
						item.disabled = true;
					}
					return item;
				});
			});
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '配煤库存信息 ',
		dataIndex: 'coalTypeInventoryKey',
		width: '35%',
		customRender // 自定义序号列内容渲染// 固定左侧列
	},
	{
		title: '煤种单价(元/吨) ',
		dataIndex: 'price',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		}
	},
	{
		title: '配煤数量(吨) ',
		dataIndex: 'quantity',
		customRender: text => {
			if (text) {
				return text.toFixed(2);
			}
			return '-';
		} 
	},
	{
		title: '占总配煤比例',
		dataIndex: 'ratio',
		customRender: text => {
			if (text) {
				return `${text}%`;
			}
			return '-';
		} // 自定义序号列内容渲染
	}
];
</script>


<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slModal {
	min-width: 864px;
	.title {
		display: flex;
		align-items: center;
		height: 100%;
		.name {
			font-size: 18px;
			color: rgba(#000, 0.8);
			font-weight: 500;
		}
	}
	.footer-btn {
		height: 32px;
		width: 90px;
		line-height: 32px;
		border-radius: 4px;
		padding: 0 !important;
		cursor: pointer;
		text-align: center;
	}
	.cancel-btn {
		border: 1px solid #e5e6eb;
		border-color: #c3c3c3;
	}
	.cancel-btn:hover {
		color:  @primary-color;
		border-color: @primary-color;
	}
	.confirm-btn {
		background: @primary-color;
		color: white;
	}
	.content {
		padding: 0;
	}
}
</style>