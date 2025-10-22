<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 100px"
		>
			<div class="methods-wrap">
				<span class="slTitle">电子仓单开立审核</span>
			</div>
			<template>
				<div
					class="slTitleAssis"
					style="margin-bottom: 20px"
				>
					基本信息
				</div>
				<a-descriptions
					bordered
					:column="3"
					size="middle"
				>
					<a-descriptions-item label="存货人">
						{{ detailData.bailorCompanyName }}
					</a-descriptions-item>
					<a-descriptions-item label="仓储企业">
						{{ detailData.warehouseCompanyName }}
					</a-descriptions-item>
					<a-descriptions-item label="仓库名称">
						{{ detailData.stationName }}
					</a-descriptions-item>
				</a-descriptions>
			</template>
			<BaseInfo
				:type="type"
				:detailData="detailData"
				@viewPDF="handlePreview"
				@download="download"
				@downloadAll="downloadAll"
			></BaseInfo>
		</a-card>
		<div class="slDetailBottom">
			<div>
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
						@click="previewVisible = true"
						style="margin-right: 30px"
						>预览</a-button
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
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
		>
			<div class="content">
				<pdf-preview :url="currentPdf"></pdf-preview>
				<div
					class="left-arrow"
					@click="changeLeft"
					v-if="currentIndex > 0"
				>
					<svg
						width="38"
						height="38"
						viewBox="0 0 38 38"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M19.0007 34.8346C10.2561 34.8346 3.16732 27.7458 3.16732 19.0013C3.16732 10.2568 10.2561 3.16797 19.0007 3.16797C27.7452 3.16797 34.834 10.2568 34.834 19.0013C34.834 27.7458 27.7452 34.8346 19.0007 34.8346Z"
							fill="#EDF0F5"
						/>
						<path
							d="M21.7715 13.4557L16.2298 18.9974L21.7715 24.5391"
							stroke="black"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div
					class="right-arrow"
					@click="changeRight"
					v-if="currentIndex < attachmentList.length - 1"
				>
					<svg
						width="38"
						height="38"
						viewBox="0 0 38 38"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18.9993 34.8346C27.7439 34.8346 34.8327 27.7458 34.8327 19.0013C34.8327 10.2568 27.7439 3.16797 18.9993 3.16797C10.2548 3.16797 3.16602 10.2568 3.16602 19.0013C3.16602 27.7458 10.2548 34.8346 18.9993 34.8346Z"
							fill="#EDF0F5"
						/>
						<path
							d="M16.2285 13.4557L21.7702 18.9974L16.2285 24.5391"
							stroke="black"
							stroke-opacity="0.8"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>
		</a-modal>
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
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import BaseInfo from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/BaseInfo';
import { API_FinancingDetail } from '@/v2/center/financing/api/index.js';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload';
import ENV from '@/v2/config/env';
import TipModal from '@sub/components/DelModal.vue';
import PdfPreview from '@sub/components/pdf/index.vue';
import { mapGetters } from 'vuex';

import { API_getCommonDownload } from '@/v2/center/person/api';
import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';
import {
	getWarehouseReceiptOpenDetail,
	downloadWarehouseReceiptOpenFiles,
	handleWarehouseReceiptOpen
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import ImageViewer from '@sub/components/viewer/image.vue';
export default {
	data() {
		return {
			type: 'rest',
			detailData: {},
			visible: false,
			previewVisible: false,
			reason: '',
			detailData: {},
			roleData: {},
			previewImg: '',
			currentIndex: 0
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
		},
		// 附件信息
		attachmentList() {
			return [this.detailData.fileUrl];
		},
		currentPdf() {
			return this.attachmentList[this.currentIndex];
		}
	},
	mounted() {
		this.getDetail();
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/list');
		},
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getWarehouseReceiptOpenDetail(params);
			// 过滤电子仓单
			const info = res.data || {};
			const warehouseReceiptAttachmentList = info.warehouseReceiptAttachmentList.filter(el => el.fileType != 'WAREHOUSE_RECEIPT');
			info.warehouseReceiptAttachmentList = warehouseReceiptAttachmentList;

			this.detailData = info || {};
		},
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
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
		async downloadAll() {
			const res = await downloadWarehouseReceiptOpenFiles({ id: this.$route.query.id });
			comDownload(res.data, undefined, res.name);
		},
		changeLeft() {
			if (this.currentIndex <= 0) {
				return;
			}

			this.currentIndex--;
		},
		changeRight() {
			if (this.currentIndex >= this.attachmentList.length - 1) {
				return;
			}

			this.currentIndex++;
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
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/sign',
				query: this.$route.query
			});
		},
		async confirmSubmit() {
			this.$refs.submitModal.close();
			const params = {
				id: this.$route.query.id,
				operatorType: 'PASS'
			};
			await handleWarehouseReceiptOpen(params);
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
			const res = await handleWarehouseReceiptOpen(params);
			this.$message.success('驳回成功');
			this.goBack();
		}
	},
	components: {
		Breadcrumb,
		BaseInfo,
		TipModal,
		PdfPreview,
		ImageViewer
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0 !important;
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
.content {
	position: relative;
	.left-arrow {
		position: absolute;
		top: 50%;
		left: 0%;
		transform: translateY(-50%);
		cursor: pointer;
	}
	.right-arrow {
		position: absolute;
		top: 50%;
		right: 0%;
		transform: translateY(-50%);
		cursor: pointer;
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
</style>
