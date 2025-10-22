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
				货转信息详情
			</span>
			<div
				class="warningStatus"
				v-if="detail.goodsTransferStatus == '6'"
			>
				<div class="lable">作废原因：</div>
				{{ detail.cancelReason }}
			</div>
			<div
				class="warningStatus"
				v-if="detail.goodsTransferStatus == '8'"
			>
				<div class="lable">驳回原因：</div>
				{{ detail.rejectReason }}
			</div>
			<div class="sub">
				<div class="slTitleAssis">合同信息</div>
				<ContractGl
					:orderId="detail.serialId"
					v-if="detail.contractType == 'ONLINE'"
				/>
				<ContractOff
					:orderId="detail.serialId"
					v-if="detail.contractType == 'OFFLINE'"
				/>
			</div>
			<!-- 1. 如合同无可关联收发货信息；但有可复用上游电子货转，展示“货转信息”模块； -->
			<div
				class="sub"
				v-if="detail.goodsTransferType === 'GOODS_TRANSFER_REFERRED'"
			>
				<div class="slTitleAssis">货转信息</div>
				<Referreds
					type="detail"
					disabled
					:dataSource="goodsTransferDetailInfo.referreds || []"
				/>
			</div>
			<div
				v-else-if="detail.goodsTransferType !== 'NOT_TRANSPORT'"
				class="sub"
			>
				<div class="slTitleAssis">收发货信息</div>
				<!-- 根据不同的运输方式展示不同的信息 -->
				<!-- 火运 -->
				<div
					class="title-tip"
					v-if="['AUTOMOBILE_AND_TRAIN'].includes(detail.transType)"
				>
					火运信息
				</div>
				<DeliverTrains
					disabled
					:dataSource="goodsTransferDetailInfo.deliverTrains"
					v-if="['TRAIN', 'AUTOMOBILE_AND_TRAIN'].includes(detail.transType)"
				/>
				<!-- 船运 -->
				<DeliverShips
					disabled
					:dataSource="goodsTransferDetailInfo.deliverShips"
					v-if="['SHIP'].includes(detail.transType)"
				/>
				<!-- 汽运 -->
				<div
					class="title-tip"
					v-if="['AUTOMOBILE_AND_TRAIN'].includes(detail.transType)"
				>
					汽运信息
				</div>
				<DeliverTrunks
					disabled
					:dataSource="goodsTransferDetailInfo.receiveTrunks"
					v-if="['AUTOMOBILE', 'AUTOMOBILE_AND_TRAIN'].includes(detail.transType)"
				/>
			</div>
			<!-- 货转证明 -->
			<!-- 如果不是货转复用要有货转证明 -->
			<div
				class="sub"
				v-if="detail.goodsTransferType !== 'GOODS_TRANSFER_REFERRED'"
			>
				<div class="slTitleAssis">货转证明</div>
				<div class="sub-title-con">
					<a-space :size="40">
						<a-space :size="10">
							<span class="lable">货转开具方式</span>
							{{ detail.goodsTransferIssueMethodDesc }}
						</a-space>
					</a-space>
				</div>
				<div class="sub-title-con">
					<a-space :size="40">
						<a-space
							:size="10"
							v-if="detail.signDate"
						>
							<span class="lable">货转开具日期</span>
							{{ detail.signDate }}
						</a-space>
						<a-space
							:size="10"
							v-if="detail.goodsTransferIssueMethod == 'OFFLINE_GOODSTRANSFER' && detail.goodsTransferQuantity"
						>
							<span class="lable">货转开具数量(吨)</span>
							{{ detail.goodsTransferQuantity }}
						</a-space>
						<template v-if="detailNotTransport">
							<a-space
								:size="10"
								v-if="detailNotTransport.deliverQuantity"
							>
								<span class="lable">交货量(吨)</span>
								{{ detailNotTransport.deliverQuantity }}
							</a-space>
							<a-space
								:size="10"
								v-if="detailNotTransport.deliveryPlace"
							>
								<span class="lable">交货地点</span>
								<TextOverFlow
									:content="detailNotTransport.deliveryPlace"
									:maxWidth="150"
								/>
							</a-space>
							<a-space
								:size="10"
								v-if="detailNotTransport.deliveryDate"
							>
								<span class="lable">交货日期</span>
								{{ detailNotTransport.deliveryDate }}
							</a-space>
							<a-space
								:size="10"
								v-if="detailNotTransport.receiverName"
							>
								<span class="lable">收货人</span>
								<TextOverFlow
									:content="detailNotTransport.receiverName"
									:maxWidth="150"
								/>
							</a-space>
						</template>
						<!-- 铁瑞系公司展示 -->
						<template v-if="isBelongTieRui && detail.goodsTransferIssueMethod == 'OFFLINE_GOODSTRANSFER'">
							<a-space
								:size="10"
								v-if="detail.signStatusDesc"
							>
								<span class="lable">签章状态</span>
								{{ detail.signStatusDesc }}
							</a-space>
						</template>
					</a-space>
				</div>
				<FileTable
					:fileData="detail.fileInfoList"
					:titleShow="false"
					:disabled="true"
					@download="downloadFile"
					ref="File"
				/>
			</div>
			<div
				class="sub"
				v-if="detail.auditChainAndOperator"
			>
				<div class="slTitleAssis">审批流</div>
				<div class="sub-title-con">
					<a-space :size="60">
						<a-space :size="20">
							<span class="lable">流程发起人</span>
							<span
								v-for="(pro, index) in detail.auditChainAndOperator.operatorInfo"
								:key="index"
							>
								{{ pro.systemName }}：{{ pro.operatorName }}
								<a-tooltip
									:getPopupContainer="getPopupContainer"
									v-if="pro.operatorMobile"
								>
									<template slot="title">{{ pro.operatorMobile }}</template>
									<img
										class="mobile-icon"
										src="@/v2/assets/imgs/contract/mobile_icon.png"
										alt=""
									/>
								</a-tooltip>
							</span>
						</a-space>
					</a-space>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { API_goodsTransferDetail, API_GETLOGINBYMOBILE } from '@/v2/center/trade/api/goodsTransfer';
import breadcrumb from '@/v2/components/breadcrumb/index';
import FileTable from '@/v2/components/fileTable/FileTable';
import { getPersonalDetail } from '@/v2/utils/factory.js';
import ContractGl from './components/ContractGl';
import ContractOff from './components/ContractOff';
import DeliverTrains from './components/DeliverTrains';
import DeliverShips from './components/DeliverShips';
import DeliverTrunks from './components/DeliverTrunks';
import Referreds from './components/Referreds';
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			getPopupContainer,
			goodsTransferNo: this.$route.query.goodsTransferNo, //货转编号
			detail: {},
			isOa: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
		}),
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051';
		},
		detailNotTransport() {
			let detailNotTransport = this.detail.detailNotTransport;
			if (detailNotTransport) {
				return detailNotTransport;
			} else {
				return null;
			}
		},
		//收发货信息
		goodsTransferDetailInfo() {
			let goodsTransferDetailInfo = this.detail.goodsTransferDetailInfo || {};
			let selectIdList = this.detail.goodsTransferDetailInfoSelectIdList;
			//筛选其中展示字段
			let { deliverShips, deliverTrains, receiveTrunks, referreds } = goodsTransferDetailInfo;
			if (deliverShips) {
				deliverShips = deliverShips.filter(item => {
					return selectIdList.find(items => {
						return items == item.batchNo;
					});
				});
			} else {
				deliverShips = [];
			}
			if (deliverTrains) {
				deliverTrains = deliverTrains.filter(item => {
					return selectIdList.find(items => {
						return items == item.batchNo;
					});
				});
			} else {
				deliverTrains = [];
			}
			if (receiveTrunks) {
				receiveTrunks = receiveTrunks.filter(item => {
					return selectIdList.find(items => {
						return items == item.receiveNo;
					});
				});
			} else {
				receiveTrunks = [];
			}
			//货转复用在当前页时展示当前货转信息
			referreds = [this.detail];
			return { deliverShips, deliverTrains, receiveTrunks, referreds };
		}
	},
	components: {
		breadcrumb,
		TextOverFlow,
		ContractGl,
		ContractOff,
		DeliverTrains,
		DeliverShips,
		DeliverTrunks,
		Referreds,
		FileTable
	},
	async created() {
		this.isOa = this.$route.name === 'OaGoodsTransferApplyDetail';
		const { orderId, companyUserId } = this.$route.query;
		if (this.isOa) {
			API_GETLOGINBYMOBILE({
				orderId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				getPersonalDetail(this.getDetail);
			});
			return;
		}
		//货转详情
		await this.getDetail();
	},
	mounted() {},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		//获取货转详情
		getDetail() {
			let { goodsTransferNo } = this;
			API_goodsTransferDetail({ goodsTransferNo }).then(res => {
				if (res.success) {
					this.detail = res.data;
				}
			});
		},
		//下载文件
		downloadFile(items) {
			let data = { ...items };
			let type = data.type;
			//如果文件类型是25，重新命名下载文件名称
			if (type == 25) {
				let { buyerCompanyAbbreviation, sellerCompanyAbbreviation, goodsTransferQuantity } = this.detail;
				let name = `${sellerCompanyAbbreviation}-${buyerCompanyAbbreviation}`;
				//如果有吨数，拼接上吨数
				if (goodsTransferQuantity !== null) {
					name += `-${goodsTransferQuantity}吨`;
				}
				name += `.${data.ext}`;
				data.name = name;
			}
			this.$refs.File.download(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.sub {
	margin-bottom: 30px;
	.slTitleAssis {
		margin: 0 0 20px;
	}
	.title-tip {
		font-weight: 400;
		font-size: 14px;
		line-height: 14px;
		color: #77889d;
	}
	.sub-title-con {
		font-weight: 400;
		font-size: 14px;
		line-height: 14px;
		color: rgba(0, 0, 0, 0.8);
		margin-bottom: 14px;
	}
	.lable {
		font-weight: 400;
		font-size: 14px;
		line-height: 14px;
		color: #77889d;
	}
	/deep/.textOverflow {
		position: unset;
	}
}
.warningStatus {
	margin-bottom: 20px;
	margin-top: -10px;
	background: rgba(244, 131, 13, 0.1);
	border: 1px solid #ffd5b0;
	border-radius: 4px;
	padding: 14px 14px 18px;
	font-weight: 400;
	font-size: 14px;
	line-height: 24px;
	color: rgba(0, 0, 0, 0.8);
	.lable {
		color: #f65927;
	}
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
	.mobile-icon {
		margin: -3px 14px 0 6px;
		cursor: pointer;
		width: 14px;
		height: 14px;
	}
}
</style>
