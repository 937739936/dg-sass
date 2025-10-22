<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 70px"
		>
			<div class="methods-wrap">
				<span class="slTitle">电子仓单过户审核</span>
			</div>
			<BaseInfo
				:type="type"
				source="audit"
				@viewPDF="handlePreview"
				@download="download"
				@viewCarousel="openCarousel"
				:detailData="detailData"
				@downloadAll="downloadAll"
			></BaseInfo>
		</a-card>
		<div class="slDetailBottom">
			<div>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="visible = true"
						style="margin-right: 30px"
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
		</div>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="reason"
				style="border: 0"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>确定要审核通过吗</p>
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
				<p>审核通过，需要为电子仓单进行盖章，是否现在进行盖章？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="确认提交"
		>
			<div class="tip-box">
				<p>协议通过，请联系签章员或管理员进行盖章。</p>
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
		<ViewCarousel
			:list="previewList"
			ref="viewCarousel"
			@ok="download"
			:isShowFooter="true"
		></ViewCarousel>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_GETCURRENTENV, API_GetDownloadRAR } from 'api';

import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload';
import ENV from '@/v2/config/env';
import TipModal from '@sub/components/DelModal.vue';
import PdfPreview from '@sub/components/pdf/index.vue';
import BaseInfo from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/BaseInfo';
import { mapGetters } from 'vuex';
import { API_getCommonDownload } from '@/v2/center/person/api';
import ViewCarousel from '../components/viewCarousel';
import {
	getWarehouseReceiptTransferDetail,
	downloadWarehouseReceiptTransfer,
	handleWarehouseReceiptTransfer
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
	data() {
		return {
			type: 'rest',
			detailData: {
				auditChainAndOperator: {}
			},
			visible: false,
			previewVisible: false,
			reason: '',
			previewList: [],
			detailData: {},
			roleData: {},
			previewImg: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否有盖章权限
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	mounted() {
		this.getDetail();
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/auditList');
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const front_url = url.split('?')[0]
			const fileFormat = front_url.split('.').pop().toLowerCase();
			if (['rar', 'zip'].includes(fileFormat)) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		async download(item) {
			const res = await API_getCommonDownload(item.path);
			comDownload(res, undefined, item.name);
		},
		async downloadAll(type) {
			const params = {
				id: this.$route.query.id,
				type
			};
			const res = await downloadWarehouseReceiptTransfer(params);
			comDownload(res.data, undefined, res.name);
		},
		async getDetail() {
			const res = await getWarehouseReceiptTransferDetail({ id: this.$route.query.id });
			this.detailData = res.data || {};
		},

		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
		openCarousel(list, index) {
			this.previewList = list;
			console.log(index, list);
			this.$refs.viewCarousel.show(index);
		},

		closeModal() {
			this.$refs.submitModal.close();
			this.$refs.signModal.close();
			this.$refs.signNeedModal.close();
		},
		confirm() {
			this.$refs.submitModal.open();
		},
		confirmSign() {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/sign',
				query: this.$route.query
			});
		},
		async confirmSubmit() {
			this.$refs.submitModal.close();
			const params = {
				id: this.$route.query.id,
				operatorType: 'PASS'
			};
			await handleWarehouseReceiptTransfer(params);
			if (this.isSignAuth) {
				this.$refs.signModal.open();
			} else {
				this.$refs.signNeedModal.open();
			}
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			const params = {
				remark: this.reason,
				id: this.$route.query.id,
				operatorType: 'REJECT'
			};
			const res = await handleWarehouseReceiptTransfer(params);
			this.$message.success('驳回成功');
			this.goBack();
		}
	},
	components: {
		Breadcrumb,
		TipModal,
		PdfPreview,
		BaseInfo,
		ViewCarousel,
		ImageViewer
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
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
	}
}
.slModal2 {
	/deep/ .ant-modal-body {
		max-height: inherit;
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
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
.red {
	color: red;
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
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
.btn {
	border: 0;
}
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: 19%;
	}
}
</style>
