<template>
	<!-- 其它合同 -->
	<div
		class="otherBox"
		style="margin-top: 20px"
	>
		<AssetsCompanyRelationChainModal
			ref="AssetsCompanyRelationChainModal"
			@addFin="addFin"
			panelType="contract"
		/>
		<div class="title">
			其他合同信息<a-button
				class="add-other"
				v-if="editFlag"
				@click="addOther"
				type="primary"
				ghost
				size="small"
				>新增</a-button
			>
		</div>
		<div class="divider"></div>
		<div
			style="padding-top: 25px"
			v-if="businessLineContractVO.length == 0"
		>
			<div style="text-align: center">暂无数据</div>
		</div>

		<div
			class="content"
			v-for="(item, index) in businessLineContractVO"
			:key="item.contractNo"
		>
			<p class="other-title">业务线合同-{{ index + 1 }}：</p>
			<a-popconfirm
				v-if="editFlag"
				title="确定删除?"
				@confirm="() => deleteOther(item)"
			>
				<a
					style="float: right"
					v-if="editFlag"
					>删除</a
				>
			</a-popconfirm>
			<div>
				<p class="sub-title">基本信息</p>
				<a-row>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="6">卖方企业名称</a-col>
							<a-col :span="18">{{ item.sellerName }}</a-col>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="8">买方企业名称</a-col>
							<a-col :span="16">{{ item.buyerName }}</a-col>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="6">合同编号</a-col>
							<a-col :span="18">{{ item.contractNo }}</a-col>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="8">合同金额</a-col>
							<a-col :span="16"
								><span class="red">{{ item.amount }}</span
								>&nbsp;元</a-col
							>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="6">签订日期</a-col>
							<a-col :span="18">{{ item.signDate }}</a-col>
						</a-row>
					</a-col>
					<a-col
						:span="12"
						:style="{ opacity: item.endDate ? '1' : '0' }"
					>
						<a-row :gutter="20">
							<a-col :span="8">到期日期</a-col>
							<a-col :span="16">{{ item.endDate }}</a-col>
						</a-row>
					</a-col>
					<a-col :span="12">
						<a-row :gutter="20">
							<a-col :span="6">签订状态</a-col>
							<a-col
								:span="18"
								:class="item.status == '2' ? 'doubleSign' : 'singleSign'"
								>{{ item.status == '2' ? '双签' : '单签' }}</a-col
							>
						</a-row>
					</a-col>
					<!-- 双签状态 -->
					<a-col
						:span="12"
						v-if="item.status == '2'"
					>
						<a-row :gutter="20">
							<a-col :span="8">双签版合同获得日期</a-col>
							<a-col :span="16">{{ item.doubelSignRecvDate }}</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>

			<div>
				<p class="sub-title">合同详情</p>
				<a-table
					:pagination="false"
					:columns="contractDetailColumns"
					:data-source="getOtherDetailData(item)"
					:scroll="{ x: true }"
					rowKey="id"
				></a-table>
			</div>

			<div>
				<p class="sub-title">附件信息</p>
				<!-- 上游附件信息详情模块 -->
				<a-table
					v-if="item.list"
					:pagination="false"
					:columns="filesColumns"
					:data-source="filterLockFile(item.list)"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="type"
						slot-scope="type"
					>
						{{ CONSTANTS.fileType[type] }}
					</template>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
				</a-table>
				<div v-else>暂无数据</div>
			</div>
		</div>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import AssetsCompanyRelationChainModal from './AssetsCompanyRelationChainModal.vue';
import { filterLockFile } from '@/untils/factory.js';
export default {
	name: 'ChooseOtherContract',
	props: ['data', 'editFlag', 'lineId'],
	components: {
		AssetsCompanyRelationChainModal
	},
	data() {
		return {
			filterLockFile: filterLockFile,
			contractDetailColumns: [
				{
					title: '标的货物名称',
					dataIndex: 'goodName',
					key: 'goodName'
				},
				{
					title: '单价(元/吨)',
					dataIndex: 'basePrice',
					key: 'basePrice'
				},
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' }
			],

			filesColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					scopedSlots: { customRender: 'type' }
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					key: 'name',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					key: 'transferName'
				}
			],
			businessLineContractVO: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
		};
	},

	watch: {
		data: {
			immediate: true,
			handler: function (data) {
				if (data && data.businessLineContractVO) {
					this.dealWithBusinessData(data);
				}
			}
		}
	},
	methods: {
		getbusData() {
			return this.businessLineContractVO.map(item => {
				return {
					contractType: item.contractType,
					contractId: item.contractId
				};
			});
		},
		dealWithBusinessData(data) {
			let map = {
				UP: 'upContract',
				ONLINE: 'onlineContract',
				DOWN: 'downContract'
			};
			this.businessLineContractVO = data.businessLineContractVO || [];
			try {
				this.businessLineContractVO = this.businessLineContractVO.map(item => {
					let type = item.contractType;
					let _item = item[map[type]];
					return {
						..._item,
						contractId: _item.contractId,
						contractType: type,
						goodName: type == 'DOWN' ? _item.goodsName : _item.goodName,
						basePrice: type == 'DOWN' ? _item.contractPrice : _item.basePrice,
						quantity: type == 'DOWN' ? _item.contractQuantity : _item.quantity,
						amount: type == 'DOWN' ? _item.contractAmount : _item.amount,
						signDate: type == 'DOWN' ? _item.contractSignTime : _item.signDate,
						endDate: type == 'DOWN' ? null : _item.endDate,
						status: type == 'DOWN' ? _item.status : _item.signStatus,
						doubelSignRecvDate: type == 'DOWN' ? _item.doubleSignTime : _item.doubelSignRecvDate
					};
				});
			} catch (e) {
				this.businessLineContractVO = [];
			}
		},
		getOtherDetailData(item) {
			let obj = {};
			let array = [];
			obj.goodName = item.goodName;
			obj.basePrice = item.basePrice;
			obj.quantity = item.quantity;
			array.push(obj);
			return array;
		},
		deleteOther(item) {
			this.$confirm;
			let index = _.findIndex(this.businessLineContractVO, {
				contractNo: item.contractNo
			});
			this.businessLineContractVO.splice(index, 1);
		},
		addOther() {
			this.$refs.AssetsCompanyRelationChainModal.init(this.lineId);
		},
		addFin(data) {
			let index = _.findIndex(this.businessLineContractVO, {
				contractNo: data.contractNo
			});
			if (index == -1) {
				this.businessLineContractVO.push(data);
			} else {
				this.$message.error('当前合同已经添加过');
			}
		}
	}
};
</script>
<style lang="less" scoped>
.add-other {
	float: right;
	margin-right: 15px;
	margin-top: 8px;
}
.other-title {
	color: #383a3f;
	margin-bottom: 20px;
	margin-top: 10px;
}
</style>
