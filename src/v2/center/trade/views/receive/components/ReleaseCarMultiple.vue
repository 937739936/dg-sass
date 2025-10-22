<template>
	<div class="release-form-car">
		<a-form
			:form="releaseForm"
			class="slFormDetail"
		>
			<a-row class="row">
				<a-col :span="8">
					<a-form-item
							label="发货地址"
							:colon="false"
						>
							<a-input
								placeholder="发货地址"
								autocomplete="off"
								v-decorator="[
									'deliverAddr',
									{
										rules: [{ required: true, message: '请输入发货地址' }],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item
							label="收货地址"
							:colon="false"
							class="textarea-wrap"
						>
							<a-input
								placeholder="收货地址"
								autocomplete="off"
								v-decorator="[
									'receiveAddr',
									{
										rules: [{ required: true, message: '请输入收货地址' }]
									}
								]"
							/>
						</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<CarBatchInfo title="批次信息" ref="carBatchInfo" :accountReceivable="isAccountAndCar"/>
		<div class="submit-btn">
			<a-button
				type="primary"
				ghost
				@click="goBack"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="submitReleaseForm"
				>提交</a-button
			>
		</div>
		<ConfirmReturn ref="confirmReturn" />
		<ConfirmModal ref="confirmModal" :hideIcon="true"></ConfirmModal>
	</div>
</template>

<script>

import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn';
import { API_DELIVERYSAVE } from '@/v2/center/trade/api/receive';
import CarBatchInfo from '@/v2/center/trade/views/receive/components/CarBatchInfo';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';

export default {
	name: 'ReleaseCarMultiple',
	props: {
		selectContractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		automobileDetailDtoList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		isRelate: {
			default: true
		}
	},
	components: {
		ConfirmReturn,
		CarBatchInfo,
		ConfirmModal
	},
	computed: {
		// 是否是汽运 并且是 应收业务
		isAccountAndCar() {
			return this.selectContractInfo.businessType == 'ACCOUNT_RECEIVABLE' && this.isRelate;
		}
	},
	watch: {
		selectContractInfo() {
			this.releaseForm.setFieldsValue({
				deliverAddr: this.selectContractInfo.deliveryStationList,
				receiveAddr: this.selectContractInfo.arriveStationList
			});
		}
	},
	data() {
		return {
			releaseForm: this.$form.createForm(this),
			signLoading: false,
			fileType: []
		};
	},
	mounted() {
		this.releaseForm.setFieldsValue({
			deliverAddr: this.selectContractInfo.deliveryStationList,
			receiveAddr: this.selectContractInfo.arriveStationList
		});
	},
	methods: {

		async submitReleaseForm() {

			this.releaseForm.validateFieldsAndScroll(async (err, values) => {

				if (err) {
					return
				}
				try {
					let transInfo = await this.$refs.carBatchInfo.onValidateTransInfo()
					transInfo.map(item=>{
						item.deliverAddr = values.deliverAddr,
						item.receiveAddr = values.receiveAddr
					})
					let bodyObj = {
						orderId: this.$route.query.orderId,
						deliverId: this.$route.query.deliverId,
						transInfo: transInfo,
					};
					const that = this;
					this.openModel(that, bodyObj);
				} catch (err) {
					if (err) {
						this.$message.error(err);
					}
				}

			});

			
		},
		openModel(that, obj) {
			that.$refs.confirmModal.showModal({
				modalTitle: '  ',
				modalText: `本条发货信息将形成${obj.transInfo.length}条发货批次，是否确定提交？`,
				confirm: () => {
					return API_DELIVERYSAVE(obj)
						.then(res => {
							if (res.success) {
								that.$message.success('发货申请提交成功');
								that.$router.push('/center/receive/send/list');
							}
						})
						.finally(() => {});
				}
			});
		},
		goBack() {
			this.$refs.confirmReturn.init('/center/receive/send/list');
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	height: 82px;
}

.ant-form-item {
	width: 364px;
}

.submit-btn {
	text-align: center;
	margin-top: 52px;

	.ant-btn {
		margin: 0 10px;
		width: 114px;
		height: 38px;
		line-height: 38px;
	}
}
.slFormDetail {
	.ant-row {
		.ant-col-8:nth-child(3n + 1) {
			display: flex;
			justify-content: left;
		}
		.ant-col-8:nth-child(3n + 2) {
			display: flex;
			justify-content: center;
		}
		.ant-col-8:nth-child(3n) {
			display: flex;
			justify-content: right;
		}
	}
}
</style>
