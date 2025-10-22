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
				提货通知单盖章
			</span>
			<pdf-preview
				v-if="result"
				:url="result"
			></pdf-preview>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<div class="footer">
			<a-button
				type="primary"
				ghost
				@click.native="handleBack"
				>返回
			</a-button>
			<a-button
				type="primary"
				ghost
				@click.native="handleDownload"
				>下载
			</a-button>
			<a-button
				type="primary"
				ghost
				@click.native="
					() => {
						invalidVisible = true;
					}
				"
				>作废
			</a-button>
			<a-button
				type="primary"
				@click.native="confirmOrder"
				>确认盖章</a-button
			>
		</div>
		<a-modal
			:visible="invalidVisible"
			:footer="null"
			centered
			width="490px"
			@cancel="handleCancel"
			:title="null"
			:destroyOnClose="true"
		>
			<div class="title">确认作废该提货通知单？</div>
			<div style="padding: 0 20px 20px">
				<a-form :form="form">
					<a-form-item>
						<a-textarea
							placeholder="请输入作废原因"
							class="zf-textarea"
							:maxLength="200"
							:auto-size="{ minRows: 3 }"
							v-decorator="[
								'reason',
								{
									rules: [
										{
											required: true,
											message: '作废原因必填',
											whitespace: true
										},
										{ max: 200, message: '作废原因不能超过200个字' }
									],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-textarea>
					</a-form-item>
				</a-form>
				<div class="modalFooter">
					<a-button @click="handleCancel">取消</a-button>
					<a-button
						type="primary"
						@click="handleInvalid"
						>确定</a-button
					>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import {
	API_LadingSealReleaseUkey,
	API_LadingSealReleaseAuto,
	API_LadingSignReleaseAfterConfirm
} from '@/v2/center/trade/api/lading';
import { API_invalidLading } from '@/v2/center/trade/api/newLading';
import { API_getCommonDownload } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload.js';

import breadcrumb from '@/v2/components/breadcrumb/index';
import { sign } from '@/v2/utils/sign.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { mapGetters } from 'vuex';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

export default {
	mounted() {
		this.getDetail();
	},
	data() {
		return {
			document,
			result: '',
			ladingInfoId: '',
			invalidVisible: false, //作废弹窗展示
			form: this.$form.createForm(this), //作废
			cfcaSealList: [] // 印模集合
		};
	},
	components: {
		breadcrumb,
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		completedRoute() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return `/center/${modulePath}/lading/list`;
		}
	},
	methods: {
		// 返回
		handleBack() {
			this.$router.push(this.completedRoute);
		},
		// 下载
		handleDownload() {
			// todo 下载文件命名
			API_getCommonDownload(this.result).then(res => {
				comDownload(res, null, `提货通知单.pdf`);
			});
		},
		//取消作废
		handleCancel() {
			this.invalidVisible = false;
		},
		// 作废
		handleInvalid() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					API_invalidLading({
						remark: values.reason,
						id: this.ladingInfoId
					}).then(res => {
						if (res.success) {
							this.$message.success('作废成功！');
							this.invalidVisible = false;
							this.$router.push(this.completedRoute);
						}
					});
				}
			});
		},
		async getDetail() {
			const url = await this.$RsaDecrypt.generateFileUrl(this.$route.query.pdfUrl);
			this.result = url;
			this.ladingInfoId = this.$route.query.id;
		},
		autoSignature() {
			this.signLoading = true;
			API_LadingSealReleaseAuto({ id: this.$route.query.id })
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(() => this.$router.push(this.completedRoute));
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		// 判断签章类型
		confirmOrder() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			// 子组件回调盖章
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return API_LadingSealReleaseUkey(
				Object.assign(
					{
						id: this.$route.query.id,
						cert: window.CryptoAgent.GetSignCertInfo('CertContent')
					},
					obj
				)
			);
		},
		step2(obj) {
			return API_LadingSignReleaseAfterConfirm(
				Object.assign(
					{
						id: this.$route.query.id
					},
					obj
				)
			);
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}
/deep/ .ant-modal-content {
	border-radius: 10px;
}
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	padding-left: 20px;
}
.zf-textarea {
	width: 450px;
	height: 150px !important;
	font-size: 14px;
	line-height: 20px;
	padding: 16px 14px;
	background: #f3f5f6;
	color: rgba(0, 0, 0, 0.8);

	&::-webkit-input-placeholder {
		color: #8191a9;
	}
}
.modalFooter {
	text-align: right;

	.ant-btn {
		margin-left: 20px;
		width: 90px;
		color: rgba(0, 0, 0, 0.8);
		border: 1px solid #c6cdd8;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}

.footer {
	position: sticky;
	bottom: 0;
	padding: 20px;
	border-top: 1px solid #e5e6eb;
	background: #ffffff;
	text-align: center;
	.ant-btn {
		margin: 0 10px;
		padding: 0 43px;
		height: 38px;
	}
}
</style>
