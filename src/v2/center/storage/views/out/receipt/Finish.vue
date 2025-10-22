<template>
	<div class="background-wrapper">
		<ReceiptInfo title="出仓单完结"></ReceiptInfo>

		<a-card
			class="tc"
			:bordered="false"
		>
			<a-button
				style="margin: 0px 50px"
				@click="$router.go(-1)"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="finish"
				>完结</a-button
			>
		</a-card>
		<OutRecord ref="outRecord"></OutRecord>
	</div>
</template>

<script lang="jsx">
import {
	API_OutWarehouseReceiptDetail,
	API_OutWarehouseReceiptFinish,
	API_OutWarehouseReceiptWhetherCanBeCompleted,
	API_GetCheckLast //判断出仓单是否最后一个
} from '@/v2/center/storage/api';
import OutRecord from './components/OutRecord.vue';
import ReceiptInfo from './components/ReceiptInfo.vue';

export default {
	name: 'storageCenterOutReceiptFinish',
	components: {
		OutRecord,
		ReceiptInfo
	},

	data() {
		return {
			data: {},
			id: ''
		};
	},

	methods: {
		getDetail() {
			API_OutWarehouseReceiptDetail(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		},
		outRecord(id) {
			this.$refs.outRecord.showModal(id);
		},
		finish() {
			API_OutWarehouseReceiptWhetherCanBeCompleted(this.id).then(res => {
				const { deliveryAmount, cumulativeDeliveryAmount } = res.data;
				if (deliveryAmount > cumulativeDeliveryAmount) {
					this.$confirm({
						title: '确认提示',
						centered: true, //居中展示
						content: (
							<div>
								当前出仓单数量为{deliveryAmount && deliveryAmount.toLocaleString()}吨，已执行数量
								{cumulativeDeliveryAmount && cumulativeDeliveryAmount.toLocaleString()}吨，请确认是否对该出仓单进行完结操作。
							</div>
						),
						okText: '确认完结',
						onOk: () => {
							this.lastToFinish();
						},
						icon: () => {
							return (
								<a-icon
									type="exclamation-circle"
									theme="filled"
								/>
							);
						}
					});
				} else if (deliveryAmount == cumulativeDeliveryAmount) {
					//出仓单数量等于已执行数量，判断是否最后一单
					this.lastToFinish();
				} else {
					this.toFinish();
				}
			});
		},
		jumpPage(path) {
			const query = {
				id: this.id
			};
			this.$router.push({
				path,
				query
			});
		},
		//完结前校验是否为最后一个出仓单
		async lastToFinish() {
			if (!this.data.storehouseId) {
				this.$message.error('数据加载中，请稍后重试！');
				return;
			}
			let res = await API_GetCheckLast({ storehouseId: this.data.storehouseId, deliveryAmount: this.data.deliveryAmount });
			if (res.success) {
				if (res.data.remind) {
					//前方有带签章出仓单，提示用户先进行上一个出仓单签章
					this.$confirm({
						title: '确认提示',
						centered: true, //居中展示
						content: '系统检测到当前仓房累计出库数量已接近累计入库数量，请确认，该出仓单完结后，当前仓房后续是否开具新的出仓单？',
						okText: '会开具',
						cancelText: '不会开具',
						maskClosable: false,
						onOk: () => {
							this.toFinish();
						},
						onCancel: () => {
							this.toFinish(true);
						},
						icon: () => {
							return (
								<a-icon
									type="exclamation-circle"
									theme="filled"
								/>
							);
						}
					});
				} else {
					await this.toFinish();
				}
			}
		},
		toFinish(last) {
			API_OutWarehouseReceiptFinish({ id: this.id, last: last || false }).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.jumpPage('/center/storageCenter/out/receipt');
				}
			});
		}
	},
	created() {
		this.id = this.$route.query.id;
		this.getDetail();
	}
};
</script>
