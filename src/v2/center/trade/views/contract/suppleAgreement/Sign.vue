<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>电子补充协议盖章</span>
			</div>
		</a-card>
		<div class="preview-box">
			<div class="preview">
				<pdf-preview
					v-if="detailData.pdfPath"
					:url="detailData.pdfPath"
				></pdf-preview>
			</div>
		</div>

		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="downFile"
					>下载</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="reject"
					>作废</a-button
				>
				<a-button
					type="primary"
					@click="sign"
					>盖章</a-button
				>
			</a-space>
		</div>
		<RejectModal
			ref="reject"
			type="cancel"
		></RejectModal>
		<SignFn
			ref="signFn"
			@successSign="submit"
		></SignFn>
	</div>
</template>
<script>
import {
	getOnlineSuppleDetail,
	getOfflineSuppleDetail,
	getLogList,
	receiverConfirm,
	downloadCurrentSup
} from '@/v2/center/trade/api/suppleAgreement';

import RejectModal from './components/RejectModal.vue';
import SignFn from './components//SignFn.vue';
import { mapGetters } from 'vuex';
import PdfPreview from '@sub/components/pdf/index.vue';

import comDownload from '@sub/utils/comDownload.js';

import breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	name: 'SuppleAgreementSign',

	components: {
		PdfPreview,
		breadcrumb,
		RejectModal,
		SignFn
	},

	data() {
		return {
			url: '',
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			form: this.$form.createForm(this),
			isInitiator: false,
			id: '',
			detailData: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		const { id, isInitiator } = this.$route.query;
		this.id = id;
		this.isInitiator = isInitiator == 'true';
		this.getDetail();
	},

	methods: {
		getDetail() {
			getOnlineSuppleDetail({ id: this.id }).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		async downFile() {
			const params = {
				id: this.detailData.id,
				supplementAgreementType: 'ONLINE'
			};
			const res = await downloadCurrentSup(params);
			const name = `电子补充协议-${this.detailData.supplementalAgreementNo}-${this.detailData.sellerCompanyName}-${this.detailData.buyerCompanyName}.pdf`;
			comDownload(res.data, '', name);
		},
		reject() {
			this.$refs.reject.open();
		},
		sign() {
			this.$refs.signFn.sign();
		},
		submit() {
			this.$router.push({
				path: '/center/contract/agreement/list'
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
	}
	.preview-box {
		background: #fff;
		padding: 0 30px;
		.preview {
			border: 1px solid #e5e6eb;
		}
	}
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 916px;
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
