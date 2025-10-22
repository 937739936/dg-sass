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
					:contractVo="selectContractInfo"
				/>
			</div>
			<div>
				<div class="sub-title">发货信息</div>
				<DeliverInfo
					ref="deliverInfo"
					@changeTransType="changeTransType"
					:contractVo="selectContractInfo"
					@portNameHistoryListChange="portNameHistoryListChange"
				/>
			</div>
			<template>
				<ReleaseTrain
					:fireDetailDtoList="fireDetailDtoList"
					v-if="transType == 'TRAIN'"
					ref="releaseTrain"
					:selectContractInfo="selectContractInfo"
				/>
				<ReleaseShip
					:shipDetailDtoList="shipDetailDtoList"
					:getRelatedContract="getRelatedContract"
					:portNameHistoryInfo="portNameHistoryInfo"
					v-if="transType == 'SHIP'"
					:inLoading="deliverInfo.status == 13 && !!deliverInfo.deliverId"
					:deliverId="deliverInfo.deliverId"
					ref="releaseShip"
					:deliverSubmit="deliverSubmit"
					:isRelate="isRelate"
					:selectContractInfo="selectContractInfo"
				/>
			</template>
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
		</a-card>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractGl from '@/v2/center/logisticSupervise/views/receive/components/ContractGl';
import DeliverInfo from '@/v2/center/logisticSupervise/views/receive/components/DeliverInfo';
import ReleaseShip from '@/v2/center/logisticSupervise/views/receive/components/ReleaseShip';
import ReleaseTrain from '@/v2/center/logisticSupervise/views/receive/components/ReleaseTrain';
import { API_queryOfflineContractDetail } from '@/v2/center/logisticSupervise/api/receive';
import { API_DELIVERYSAVE } from '@/v2/center/trade/api/receive';

export default {
	data() {
		return {
			deliverId: this.$route.query.deliverId,
			orderId: this.$route.query.orderId,
			transType: '',
			selectContractInfo: {},
			automobileDetailDtoList: [],
			shipDetailDtoList: [],
			fireDetailDtoList: [],
			deliverInfo: {},
			// 是否关联了合同
			isRelate: true,
			portNameHistoryInfo: {} // 历史港口信息
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		DeliverInfo,
		ReleaseShip,
		ReleaseTrain
	},
	mounted() {
		if (this.orderId) {
			this.getSelectDetail();
		}
	},
	watch: {},
	methods: {
		getSelectDetail() {
			API_queryOfflineContractDetail({ id: this.orderId }).then(res => {
				if (res.success) {
					this.selectContractInfo = res.result;
				}
			});
		},
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
			this.transType = e;
		},
		goBack() {
			this.$router.back();
		},
		// 提交
		submitReleaseForm() {
			// 获取系统校验参数
			let refsList = ['deliverInfo', 'releaseTrain', 'releaseShip'];
			let promiseAllList = [];
			refsList.map(item => {
				if (this.$refs[item]) {
					promiseAllList.push(this.$refs[item].submitReleaseForm());
				}
			});
			if (promiseAllList.length < 2) {
				this.$message.warning('数据异常，请检查参数或重新选择合同');
				return;
			}
			Promise.all(promiseAllList).then(res => {
				if (!res.some(item => !item)) {
					let deliverDynamicsFields = res[0];
					let params = res[1];
					params.transInfo[0].deliverDynamicsFields = deliverDynamicsFields;
					params.productCode = this.selectContractInfo.productCode;
					this.openModel(params);
				}
			});
		},
		openModel(obj) {
			this.$confirm({
				centered: true,
				title: '请确认发货信息无误并提交发货申请吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return API_DELIVERYSAVE(obj)
						.then(res => {
							if (res.success) {
								this.goBack();
							}
						})
						.finally(() => {});
				},
				onCancel() {}
			});
		},
		portNameHistoryListChange(protNameInfo) {
			console.log('portNameHistoryListChange', protNameInfo);
			this.portNameHistoryInfo = protNameInfo;
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
}
</style>
