<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				填写发货信息
			</span>
			<div>
				<div class="sub-title">合同信息</div>
				<ContractGl
					ref="contractGl"
					:disabled="deliverInfo.status == 13 && !!deliverInfo.deliverId"
					@select="setSelectContractInfo"
					@change="onRelated"
				/>
			</div>
			<div>
				<div class="sub-title">发货信息</div>
				<DeliverInfo
					ref="deliverInfo"
					@changeTransType="changeTransType"
					@changeBatchType="changeBatchType"
					:deliverInfo="deliverInfo"
					:selectContractInfo="selectContractInfo"
				/>
			</div>
			<template>
				<ReleaseTrain
					:fireDetailDtoList="fireDetailDtoList"
					v-if="transType == 'TRAIN'"
					ref="releaseTrain"
					:selectContractInfo="selectContractInfo"
				/>
				<template v-if="transType == 'AUTOMOBILE'">
					<ReleaseCarMultiple
						v-if="batchType == 'MultipleBatch'"
						:automobileDetailDtoList="automobileDetailDtoList"
						ref="releaseCar"
						:isRelate="isRelate"
						:selectContractInfo="selectContractInfo"
					/>
					<ReleaseCar
						v-else
						:automobileDetailDtoList="automobileDetailDtoList"
						ref="releaseCar"
						:isRelate="isRelate"
						:selectContractInfo="selectContractInfo"
					/>
				</template>
				
				
				<ReleaseShip
					:shipDetailDtoList="shipDetailDtoList"
					:getRelatedContract="getRelatedContract"
					v-if="transType == 'SHIP'"
					:inLoading="deliverInfo.status == 13 && !!deliverInfo.deliverId"
					:deliverId="deliverInfo.deliverId"
					ref="releaseShip"
					:deliverSubmit="deliverSubmit"
					:isRelate="isRelate"
					:selectContractInfo="selectContractInfo"
				/>
			</template>
		</a-card>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractGl from '@/v2/center/trade/views/receive/components/ContractGl';
import DeliverInfo from '@/v2/center/trade/views/receive/components/DeliverInfo';
import ReleaseCar from '@/v2/center/trade/views/receive/components/ReleaseCar';
import ReleaseCarMultiple from '@/v2/center/trade/views/receive/components/ReleaseCarMultiple';
import ReleaseShip from '@/v2/center/trade/views/receive/components/ReleaseShip';
import ReleaseTrain from '@/v2/center/trade/views/receive/components/ReleaseTrain';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_getDeliverRecordInfo, API_checkCoalPlanByOrder } from '@/v2/center/trade/api/receive';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';

export default {
	data() {
		return {
			transType: '',
			batchType: 'SingleBatch', // 发货批次类型SingleBatch单批次，MultipleBatch多批次（汽运时需要判断）
			selectContractInfo: {},
			automobileDetailDtoList: [],
			shipDetailDtoList: [],
			fireDetailDtoList: [],
			deliverInfo: {},
			// 是否关联了合同
			isRelate: true
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		DeliverInfo,
		ReleaseCar,
		ReleaseShip,
		ReleaseTrain,
		ConfirmModal,
		ReleaseCarMultiple
	},
	mounted() {
		if (this.$route.query.deliverId) {
			this.init();
		}
		if (this.$route.query.orderId) {
			this.check();
		}
	},
	watch: {
		$route: {
			handler(value) {
				if (value.query.orderId) {
					this.check();
				}
			}
		}
	},
	methods: {
		// 检验关联的合同是否绑定了上下煤计划
		check() {
			API_checkCoalPlanByOrder({ orderId: this.$route.query.orderId }).then(res => {
				if (res.success) {
					if (res.result && (res.result.inCoalPlanSerialNoList || res.result.outCoalPlanSerialNoList)) {
						let str = '';
						let data = {};
						if (res.result.inCoalPlanSerialNoList) {
							str = str + res.result.inCoalPlanSerialNoList?.join('、');
							data = {
								modalTitle: '确定录入发货申请',
								modalText:
									'当前合同已关联汽运上煤计划，编号：' + str + '，系统将在入库记录生成一天后自动生成发货批次信息，请勿重复录入'
							};
						}
						if (res.result.outCoalPlanSerialNoList) {
							str = str + res.result.outCoalPlanSerialNoList.join('、');
							data = {
								modalTitle: '确定录入发货申请',
								modalText:
									'当前合同已关联汽运下煤计划，编号：' + str + '，系统将在出库记录生成一天后自动生成发货批次信息，请勿重复录入'
							};
						}
						this.$refs.confirmModal.showModal(data);
					}
				}
			});
		},
		confirmFunc() {},
		deliverSubmit() {
			return new Promise((reslove, reject) => {
				this.$refs.deliverInfo.form.validateFields((err, values) => {
					if (err) {
						reject(false);
					} else {
						reslove(true);
					}
				});
			});
		},
		//获取是否关联合同
		getRelatedContract() {
			return this.$refs.contractGl.form.getFieldValue('contractNo');
		},
		onRelated(contractNo) {
			this.isRelate = !!contractNo;
		},
		changeTransType(e) {
			if (!this.selectContractInfo?.transType?.includes(e) && this.$route.query.orderId) {
				this.$message.error(
					`关联失败，销售合同：【${this.selectContractInfo.contractNo}】运输方式为【${filterCodeByValueName(this.selectContractInfo.transType, 'despatchTypeDict')}】，与当前填写发货信息不一致`
				);
				this.$nextTick(() => {
					// this.transType = undefined;
					this.$refs.deliverInfo.form.setFieldsValue({
						transType: undefined
					});
				});
			} else {
				this.transType = e;
				// 运输类型变化后将发货批次类型重置
				this.changeBatchType('SingleBatch');
			}
		},
		// 发货批次类型发生变化
		changeBatchType(e) {
			this.batchType = e;
		},
		setSelectContractInfo(selectContractInfo) {
			this.selectContractInfo = selectContractInfo;
			if (selectContractInfo.transType != 'AUTOMOBILE_AND_TRAIN') {
				this.changeTransType(selectContractInfo.transType);
				this.$refs.deliverInfo.form.setFieldsValue({
					transType: selectContractInfo.transType
				});
			} else {
				this.transType = '';
				this.$refs.deliverInfo.form.setFieldsValue({
					transType: undefined
				});
			}
		},
		init() {
			API_getDeliverRecordInfo({ deliverId: this.$route.query.deliverId }).then(res => {
				if (!res.success) {
					return;
				}
				this.deliverInfo = res.result;
				if (res.result.transInfo.transType == 2) {
					this.transType = 'AUTOMOBILE';
					this.$refs.deliverInfo.form.setFieldsValue({
						transType: 'AUTOMOBILE'
					});
					this.$nextTick(() => {
						this.$refs.releaseCar.releaseForm.setFieldsValue({
							...res.result.transInfo
						});
						this.$refs.releaseCar.attachments = res.result.attachVOS;
						this.$refs.releaseCar.initAttach(res.result.attachVOS);
						this.automobileDetailDtoList = res.result.transInfo.automobileDetailDtoList;
					});
				} else if (res.result.transInfo.transType == 3) {
					this.transType = 'SHIP';
					this.$refs.deliverInfo.form.setFieldsValue({
						transType: 'SHIP'
					});
					this.$nextTick(() => {
						this.$refs.releaseShip.releaseForm.setFieldsValue({
							...res.result.transInfo
						});

						this.$refs.releaseShip.initAttach(res.result.attachVOS);
						this.shipDetailDtoList = res.result.transInfo.shipDetailDtoList;
						this.$nextTick(() => {
							this.$refs.releaseShip.releaseForm.setFieldsValue({
								payNode: res.result.transInfo.payNode
							});
						});
					});
				} else if (res.result.transInfo.transType == 1) {
					this.transType = 'TRAIN';
					this.$refs.deliverInfo.form.setFieldsValue({
						transType: 'TRAIN'
					});
					this.$nextTick(() => {
						this.$refs.releaseTrain.params = res.result.transInfo;
						this.$refs.releaseTrain.isLYGJ = res.result.transInfo.handInput == 0 || res.result.transInfo.handInput == 2;
						this.$refs.releaseTrain.departureTime = res.result.transInfo.departureTime;
						this.$refs.releaseTrain.attachments = res.result.attachVOS;
						this.$refs.releaseTrain.initAttach(res.result.attachVOS);
						this.fireDetailDtoList = res.result.transInfo.fireDetailDtoList;

						this.$refs.releaseTrain.trainInfoData = Object.assign({}, res.result, {
							serialNo: this.fireDetailDtoList[0].transTicketNo,
							weight: this.fireDetailDtoList[0].deliverQuantity,
							carNumber: this.fireDetailDtoList[0].trainNo,
							carType: this.fireDetailDtoList[0].trainType,
							departureStation: res.result.transInfo.deliveryStation,
							arriveStation: res.result.transInfo.arriveStation
						});
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
</style>
