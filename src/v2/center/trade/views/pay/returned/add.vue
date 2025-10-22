<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.query.id ? '编辑' : '新增' }}回款</span>
			</div>
			<div class="divider"></div>
			<div
				class="slTitleAssis"
				style="margin-top: 20px"
			>
				回款信息
			</div>
			<BaseInfo
				ref="baseInfo"
				@sendPrice="getPrice"
				@updatePayment="getPaymentInfo"
			>
			</BaseInfo>
			<div
				class="slTitleAssis"
				style="margin-top: 20px"
			>
				附件信息
			</div>
			<div class="attach-tip">回款凭证：可支持格式为jpg，jpeg，png，pdf的附件，支持多张，单个附件大小不得超过100M的文件。</div>
			<Attachment ref="attachment"></Attachment>
			<div
				class="slTitleAssis"
				style="margin-top: 50px; margin-bottom: 30px"
			>
				回款认领
			</div>
			<ReturnedInfo
				:returnedMoney="returnedMoney"
				:paymentInfo="paymentInfo"
				ref="returnedInfo"
			></ReturnedInfo>
		</a-card>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					>提交</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import BaseInfo from './components/BaseInfo.vue';
import Attachment from './components/Attachment.vue';
import ReturnedInfo from './components/ReturnedInfo.vue';
import { addReturned, getReturnedDetail } from '@/v2/center/trade/api/pay';
import {
	getTerminalContractById, //下游合同编号
	getBusinessLineListByCollection
} from '@/v2/center/trade/api/collectionFlow';

import moment from 'moment';

export default {
	data() {
		return {
			returnedMoney: 0,
			detailInfo: {},
			paymentInfo: {}
		};
	},
	mounted() {
		if (this.$route.query.receiveSerialNo) {
			this.getDetail();
		}
		if (this.$route.query.downOrderId && this.$route.query.source) {
			this.$nextTick(() => {
				this.downReflect();
			});
		}
	},
	methods: {
		// 获取回款方数据
		getPaymentInfo(info) {
			this.paymentInfo = info;
		},
		/** 编辑 获取详情 */

		async getDetail() {
			const params = {
				collectionNo: this.$route.query.receiveSerialNo
			};
			const res = await getReturnedDetail(params);
			this.detailInfo = res.data || {};
			// 回款金额
			this.returnedMoney = this.detailInfo.collectionFlowVo.receiveAmount;
			this.$nextTick(() => {
				this.$refs.baseInfo.init(this.detailInfo.collectionFlowVo);
				// 更新附件
				this.$refs.attachment.init(this.detailInfo.attachmentList || []);
				// 更新认领信息
				this.$refs.returnedInfo.init(this.detailInfo.collectionFlowClaimedVoList);
			});

			/** 初始化数据 */
		},
		//根据下游合同反显认领
		async downReflect() {
			//设置对方户名

			this.$nextTick(() => {
				const info = {
					// paymentName: this.$route.query.downCompany,
					paymentBizNo: this.$route.query.downUscc
				};
				this.$refs.baseInfo.init(info);
				// 更新认领信息
				// this.$refs.returnedInfo.init( this.detailInfo.collectionFlowClaimedVoList)
			});

			let res = await getTerminalContractById({ terminalContractId: this.$route.query.downOrderId });
			let info = res.data;

			const lineRes = await getBusinessLineListByCollection({
				pageNo: 1,
				pageSize: 500,
				businessLineNo: this.$route.query.businessLineNo
			});

			const list = lineRes.data.records || [];

			let newList = [];
			list.forEach(el => {
				const obj = {
					type: 'FINANCING_CLAIM',
					...info,
					info: el,
					id: info.id + Math.random()
				};
				newList.push(obj);
			});

			this.$nextTick(() => {
				// 更新认领信息
				this.$refs.returnedInfo.initBusiness(newList);
			});
		},

		goBack() {
			this.$router.go(-1);
		},
		async submit() {
			const baseInfo = await this.$refs.baseInfo.save();

			if (!baseInfo) {
				return;
			}

			const attachment = this.$refs.attachment.save();
			if (this.$refs.attachment.beginUpload) {
				return;
			}

			//  获取认领信息
			const list = await this.$refs.returnedInfo.save();

			if (!list) {
				return;
			}

			const claimRecordList = list.map(el => {
				return {
					type: el.type,
					lineNo: el.info?.lineNo || '',
					downContractId: el.info?.id || el.info?.terminalContractId,
					claimAmount: el.claimAmount,
					paymentType: el.paymentType,
					contractType: el.info?.contractType || ''
				};
			});
			const collectionFlowDto = {
				fileInfoList: attachment[0].fileList || [],
				...baseInfo,
				receiveDate: moment(baseInfo.receiveDate).format('yyyy-MM-DD hh:ss:mm')
			};
			if (this.$route.query.receiveSerialNo) {
				collectionFlowDto.id = this.$route.query.id;
			}
			const params = {
				collectionFlowDto,
				claimRecordList
			};

			const res = await addReturned(params);
			if (res.success && res.data) {
				this.$message.success('保存成功');
				this.$router.go(-1);
			}
		},
		// 获取回款金额
		getPrice(val) {
			this.returnedMoney = val;
		},
		save() {}
	},
	components: {
		Breadcrumb,
		BaseInfo,
		Attachment,
		ReturnedInfo
	}
};
</script>

<style scoped lang="less">
.attach-tip {
	display: flex;
	height: 44px;
	align-items: center;
	flex-shrink: 0;
	border-radius: 4px;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	color: var(--text-80, rgba(0, 0, 0, 0.8));
	font-size: 12px;
	margin-top: 30px;
	margin-bottom: 20px;
	padding-left: 12px;
}
.btn-box {
	display: flex;
	margin-top: 50px;
	align-items: center;
	height: 64px;
	justify-content: center;
	border-top: 1px solid #e5e6eb;
	.btn {
		width: 114px;
		color: #4682f3;
		border: 1px solid #4682f3;
		background: #fff;
	}
	.btn1 {
		margin-left: 20px;
		background: #4682f3;
		color: #fff;
	}
}
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	margin-bottom: -40px;
	.ant-card {
		padding: 20px 30px 20px 30px;
		.content-box {
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
		}
	}
	::v-deep {
		.ant-radio-group {
			.ant-radio-wrapper {
				margin-right: 18px;
			}
			.ant-radio-wrapper:last-child {
				margin-right: 8px;
			}
		}
	}
}

.slDetailBottom {
	width: calc(100vw - 254px);
	width: 100%;
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 9;
}
</style>
