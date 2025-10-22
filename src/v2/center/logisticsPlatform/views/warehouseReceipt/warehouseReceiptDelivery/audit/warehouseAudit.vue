<template>
	<div class="slMain">
		<a-spin :spinning="detailLoading">
			<div style="padding-bottom: 64px">
				<breadcrumb></breadcrumb>
				<a-card :bordered="false">
					<div class="methods-wrap">
						<div class="slTitle">
							<span>电子仓单提货审核</span>
						</div>
					</div>
					<div>
						<div class="slTitleAssis">提货信息</div>
						<LadingInfoView
							:detailData="detailData"
							:contractInfo="contractInfo"
						/>
					</div>
					<div>
						<div class="slTitleAssis">提货仓单信息</div>
						<ReceiptInfoDetailView :deliveryReceipts="deliveryReceipts" />
					</div>
					<div>
						<div class="slTitleAssis">提货详细信息</div>
						<LadingInfoDetailView :detailData="detailData"></LadingInfoDetailView>
					</div>
					<div>
						<div class="slTitleAssis">
							待盖章电子仓单
							<a-button
								class="download-all-btn"
								type="primary"
								ghost
								@click="downloadAll"
								>一键下载</a-button
							>
						</div>

						<div class="table-box">
							<a-table
								:columns="waitSignListColumns"
								class="new-table"
								:bordered="false"
								rowKey="id"
								:dataSource="waitSignAttachmentList || []"
								:pagination="false"
								:scroll="{ x: true }"
							>
								<template
									slot="action"
									slot-scope="text, item, index"
								>
									<a-space :size="20">
										<a @click="previewReceipts(waitSignAttachmentList, index)">查看</a>
										<a @click="downloadFile(item)">下载</a>
									</a-space>
								</template>
							</a-table>
						</div>
					</div>
				</a-card>
			</div>
			<div class="slDetailBottom">
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="goBack"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						style="margin-right: 30px"
						@click="reject"
						>驳回</a-button
					>
					<a-button
						type="primary"
						class="btn"
						@click="confirm"
						>通过</a-button
					>
				</a-space>
			</div>
		</a-spin>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>确定要审核通过吗？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signModal"
			@ok="confirmSign"
			@cancel="goBack"
			title="提示"
			cancelBtnText="稍后盖章"
			okBtnText="现在去盖章"
		>
			<div class="tip-box">
				<p>审核通过，需要对电子仓单进行盖章，是否现在进行盖章？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="确认提交"
		>
			<div class="tip-box">
				<p>审核通过，请联系签章员或管理员对电子仓单进行进行盖章。</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.signerUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
				<p
					class="tip-wrap-desc"
					v-else
				>
					管理员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
			</div>
		</TipModal>
		<a-modal
			class="slModal cancel-modal"
			:visible="rejectVisible"
			:width="460"
			@cancel="rejectVisible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="rejectReason"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>
			<template slot="footer">
				<a-button
					key="back"
					@click="rejectVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmReject"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<ViewCarousel
			:list="waitSignAttachmentList"
			ref="viewCarousel"
			@ok="downloadFile"
			:isShowFooter="true"
		></ViewCarousel>
	</div>
</template>

<script>
import {
	API_warehouseReceiptDeliveryDetail,
	API_deliveryAudit_receipt,
	API_warehouseReceiptDeliveryDownload
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';
import { API_getCommonDownload } from '@/v2/center/person/api';

import LadingInfoView from './components/LadingInfoView';
import LadingInfoDetailView from './components/LadingInfoDetailView';
import ReceiptInfoDetailView from './components/ReceiptInfoDetailView';

import breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import comDownload from '@sub/utils/comDownload.js';
import TipModal from '@sub/components/DelModal.vue';
import { mapGetters } from 'vuex';
import ViewCarousel from '../../components/viewCarousel.vue';

const waitSignListColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeDesc' },
	{ title: '存货人', dataIndex: 'bailorCompanyName' },
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
export default {
	components: {
		TipModal,
		LadingInfoDetailView,
		LadingInfoView,
		breadcrumb,
		ReceiptInfoDetailView,
		ViewCarousel
	},
	name: 'LetterNoticeDetail',
	data() {
		return {
			moment,
			detailLoading: false,
			detailData: { contractInfo: {} },
			contractInfo: {},
			deliveryReceipts: [], // 提货仓单信息
			waitSignAttachmentList: [], //待盖章电子仓单
			waitSignListColumns,
			rejectReason: '',
			rejectVisible: false,
			roleData: {}
		};
	},
	mounted() {
		this.init();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	watch: {},
	methods: {
		init() {
			const { id } = this.$route.query;
			if (!id) {
				return;
			}
			API_warehouseReceiptDeliveryDetail({ id }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.contractInfo = this.detailData.contractInfo;
					this.deliveryReceipts = this.detailData.deliveryInfo;
					this.waitSignAttachmentList = this.detailData.waitSignAttachmentList;
				}
			});
		},
		viewContractDetail() {
			let type = 'BUY';
			let orderLineType = this.contractInfo.contractType;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + orderLineType.toLowerCase() + '/detail',
				query: {
					id: this.contractInfo.orderContractId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		goBack() {
			this.$router.back();
		},
		closeModal() {
			this.$refs.submitModal.close();
			this.$refs.signModal.close();
			this.$refs.signNeedModal.close();
		},

		reject() {
			this.rejectVisible = true;
		},
		confirm() {
			this.$refs.submitModal.open();
		},
		async confirmSubmit() {
			this.closeModal();
			const params = {
				id: this.detailData.id,
				operatorType: 'PASS'
			};
			this.detailLoading = true;
			API_deliveryAudit_receipt(params)
				.then(res => {
					if (res.data == true) {
						if (this.detailData.allOutbound == 1) {
							// 部分提货 -> 盖章
							if (this.isSignAuth) {
								this.$refs.signModal.open();
							} else {
								this.$refs.signNeedModal.open();
							}
						} else {
							this.goBack();
						}
					}
				})
				.finally(() => {
					this.detailLoading = false;
				});
		},
		confirmSign() {
			let path = '/center/logisticsPlatform/warehouseReceipt/delivery/sign';
			this.$router.push({
				path,
				query: {
					id: this.detailData.id
				}
			});
		},
		// 驳回
		async confirmReject() {
			if (!this.rejectReason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			const params = {
				remark: this.rejectReason,
				id: this.detailData.id,
				operatorType: 'REJECT'
			};
			this.closeModal();
			this.detailLoading = true;
			API_deliveryAudit_receipt(params)
				.then(res => {
					if (res.data == true) {
						this.$message.success('驳回成功');
						this.goBack();
					}
				})
				.finally(() => {
					this.detailLoading = false;
				});
		},
		downloadAll() {
			let params = {
				id: this.detailData.id,
				type: 2
			};
			API_warehouseReceiptDeliveryDownload(params).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		async downloadFile(item) {
			const res = await API_getCommonDownload(item.path);
			comDownload(res, undefined, item.name);
		},
		download(item) {},
		previewReceipts(list, index) {
			this.$refs.viewCarousel.show(index);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;

	.slTitleAssis {
		margin-bottom: 30px;
	}

	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}

	.ant-card:last-child {
		margin-bottom: 0;
	}
}

.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			border: none;
			height: 150px;
			padding: 14px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
		color: rgba(0, 0, 0, 0.8);
	}
}
textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}

textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::-moz-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea:-ms-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::placeholder {
	color: #8191a9;
	font-size: 14px;
}
.tip {
	color: rgba(0, 0, 0, 0.25);
	font-size: 14px;
	margin-bottom: 20px;
}
.red {
	color: #dd4444;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}

.download-all-btn {
	width: 88px;
	height: 28px;
	margin-left: 20px;
}

/deep/ .ant-table td {
	white-space: nowrap;
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	z-index: 9;
}
</style>
