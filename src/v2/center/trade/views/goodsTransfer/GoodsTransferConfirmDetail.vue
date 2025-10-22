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
				货转盖章
			</span>
			<pdf-preview
				v-if="result"
				:url="result"
			></pdf-preview>
			<SignModal ref="signModal"></SignModal>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
				type="electronic"
			/>
		</a-card>
		<div class="footer">
			<a-button
				type="primary"
				ghost
				@click.native="
					() => {
						rejectVisible = true;
					}
				"
				>货转驳回
			</a-button>
			<a-button
				type="primary"
				@click.native="sign"
				>确认盖章</a-button
			>
		</div>
		<a-modal
			:visible="rejectVisible"
			:footer="null"
			centered
			width="490px"
			@cancel="handleCancel"
			:title="null"
			:destroyOnClose="true"
		>
			<div class="title">确认驳回该货转？</div>
			<div style="padding: 0 20px 20px">
				<a-form :form="form">
					<a-form-item>
						<a-textarea
							placeholder="请输入驳回原因"
							class="zf-textarea"
							:maxLength="200"
							:auto-size="{ minRows: 3 }"
							v-decorator="[
								'reason',
								{
									rules: [
										{
											required: true,
											message: '驳回原因必填',
											whitespace: true
										},
										{ max: 200, message: '驳回原因不能超过200个字' }
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
						@click="handleReject"
						>确定</a-button
					>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import {
	API_GoodsTransferRejectConfirm,
	API_GoodsTransferConfirmGetToSigList,
	API_postApiGoodsTransferConfirm,
	API_GoodsTransferConfirmAutoSignature
} from '@/v2/center/trade/api/goodsTransfer';
import breadcrumb from '@/v2/components/breadcrumb/index';
import { sign } from '@/v2/utils/sign.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { mapGetters } from 'vuex';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

export default {
	name: 'GoodsTransferStampDetail',
	mounted() {
		this.getDetail();
	},
	data() {
		return {
			document,
			result: '',
			goodsTransferNo: '',
			rejectVisible: false, //驳回弹窗展示
			form: this.$form.createForm(this), //驳回
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
		})
	},
	methods: {
		//取消
		handleCancel() {
			this.rejectVisible = false;
		},
		handleReject() {
			// 驳回货转
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					API_GoodsTransferRejectConfirm({
						rejectReason: values.reason,
						goodsTransferNo: this.goodsTransferNo
					}).then(res => {
						if (res.success) {
							this.$message.success('驳回成功！');
							this.rejectVisible = false;
							this.$router.push('/center/transfer/goodsTransfer/list');
						}
					});
				}
			});
		},
		getDetail() {
			this.result = this.$route.query.pdfUrl;
			this.goodsTransferNo = this.$route.query.goodsTransferNo;
		},
		autoSignature() {
			this.signLoading = true;
			API_GoodsTransferConfirmAutoSignature({
				goodsTransferNo: this.goodsTransferNo,
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success({
									content: '盖章完成',
									duration: 5
								});
								this.$router.push('/center/transfer/goodsTransfer/list');
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		sign() {
			let obj = {
				industryType: 'COAL', // 行业 COAL代表煤块
				moduleSealType: 4, //模块编码 4代表货转
				moduleSealTypeDetail: 2 //1盖章 2确定盖章
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				that.$confirm({
					centered: true,
					title: '请确认信息无误并进行盖章？',
					okText: '确认',
					cancelText: '取消',
					onOk() {
						sign.call(that, that.step1, that.step2, '/center/transfer/goodsTransfer/list', true);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return API_GoodsTransferConfirmGetToSigList({
				goodsTransferNo: this.goodsTransferNo,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_postApiGoodsTransferConfirm(this.goodsTransferNo);
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
