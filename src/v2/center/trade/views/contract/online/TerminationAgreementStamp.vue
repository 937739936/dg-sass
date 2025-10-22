<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			class="content"
			style="min-height: calc(100vh - 70px)"
		>
			<span
				slot="title"
				class="slTitle gird-line"
				>合同终止协议盖章</span
			>
			<pdf-preview
				v-if="relieveContractPdfPath"
				:url="relieveContractPdfPath"
			></pdf-preview>
			<div class="methods-footer-wrap">
				<a-space size="large">
					<a-button
						type="primary"
						ghost
						@click="visible = true"
						>作废</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="downFile"
						>下载</a-button
					>
					<a-button
						type="primary"
						@click="sign"
						:loading="loadingStamp"
						>盖章</a-button
					>
				</a-space>
			</div>
		</a-card>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
		<a-modal
			title=""
			:visible="visible"
			@ok="handleOk"
			@cancel="visible = false"
			class="cancel-modal"
			width="490px"
		>
			<p class="model-title">
				<span class="tip-wrap">
					<span>确认作废？</span>
				</span>
				<span
					class="close-icon"
					@click="visible = false"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<path
							d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
							fill="#C3C3C3"
						/>
					</svg>
				</span>
			</p>
			<p class="desc-tip">驳回后，如再需终止合同则需要重新走流程，如确需驳回，请继续操作！</p>
			<a-form :form="form">
				<a-form-item label="">
					<a-textarea
						placeholder="请输入作废原因..."
						class="textarea-wrap"
						v-decorator="['cancellationReason', { rules: [{ required: true, message: '作废原因必填，请在上方输入作废原因' }] }]"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import ENV from '@/api/env.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import SignModal from '@/v2/components/signModal/index';
import { sign } from '@/v2/utils/sign.js';
import {
	API_STOPSELLORDERGETTOSUBMITSIGLIST,
	API_SUBMITTOCONFIRMSTOPSELLORDER,
	API_CfcaStopOrderAutoSignature,
	API_CONTRACT_TERMINATE_CANCEL,
	API_listOrderTerminateLog,
	API_getOrderContractDetailById
} from '@/v2/center/trade/api/contract';
import { API_DOWNLPREVIEWTE } from 'api';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'reject' }),
			relieveContractPdfPath: '',
			cfcaSealList: [],
			visible: false,
			logId: null,
			loadingStamp: false
		};
	},
	computed: {
		downloadFile() {
			return this.relieveContractPdfPath.split('/').pop();
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否是发起方
		isInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == this.$route.query.terminalContractInitiatorUscc;
		}
	},
	components: {
		PdfPreview,
		Breadcrumb,
		ChooseStamp,
		SignModal
	},
	mounted() {
		API_listOrderTerminateLog({ orderId: this.$route.query.id }).then(res => {
			if (res.success) {
				if (res.data.length) {
					this.logId = res.data.shift().id;
				}
			}
		});
		API_getOrderContractDetailById({
			orderId: this.$route.query.id
		}).then(res => {
			// 获取解除合同协议
			if (res.success) {
				this.relieveContractPdfPath = res.data.terminatePdfPath;
			}
		});
	},
	methods: {
		backToContractList() {
			const type = this.$route.query.type?.toLowerCase();
			this.$router.replace({
				path: `/center/contract/${type}/list`
			});
		},
		downFile() {
			API_DOWNLPREVIEWTE(`${ENV.BASE_NET}${this.relieveContractPdfPath}`)
				.then(res => {
					comDownload(res, this.relieveContractPdfPath);
				})
				.catch(() => {
					this.$message.error('文件下载失败');
				});
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_CONTRACT_TERMINATE_CANCEL({
						orderId: this.$route.query.id,
						logId: this.logId,
						...values
					}).then(res => {
						if (res.success) {
							this.$message.success('操作成功').then(() => {
								this.backToContractList();
							});
						}
					});
				}
			});
		},
		getRouterType(buyRouter) {
			return buyRouter;
		},
		step1(obj) {
			return this.getRouterType(API_STOPSELLORDERGETTOSUBMITSIGLIST)(
				Object.assign(
					{
						orderId: this.$route.query.id,
						cert: obj.cert,
						terminalContractZzLogId: this.logId,
						cfcaSealList: this.cfcaSealList
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(API_SUBMITTOCONFIRMSTOPSELLORDER)(
				Object.assign(
					{
						orderId: this.$route.query.id,
						logId: this.logId
					},
					obj
				)
			);
		},
		autoSignature() {
			this.signLoading = true;
			API_CfcaStopOrderAutoSignature({
				orderSerialNo: this.$route.query.serialNo,
				terminalContractZzLogId: this.logId,
				ccsFlag: this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY',
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message
									.success({
										content: '盖章完成',
										duration: 5
									})
									.then(() => {
										this.backToContractList();
									});
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
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				var that = this;
				const isOrderModule = true;
				that.$confirm({
					centered: true,
					title: '请确认合同信息无误并进行盖章？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						sign.call(
							that,
							that.step1,
							that.step2,
							that.completedRoute, // 盖章后回调router
							isOrderModule
						);
					},
					onCancel() {}
				});
			}
		},
		sign() {
			let obj = {
				industryType: 'COAL', // 行业 COAL代表煤块
				moduleSealType: 3, //模块编码 3代表合同终止模块
				moduleSealTypeDetail: 2 //1盖章 2确定盖章
			};
			this.$refs.chooseStamp.showModal(obj);
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	padding-bottom: 80px;
}
/deep/.ant-card-head {
	margin-bottom: 0;
}
.gird-line {
	width: 100%;
	padding-bottom: 20px;
	display: inline-block;
	border-bottom: 1px solid #e5e6eb;
}
.close-icon {
	width: 22px;
	height: 22px;
	display: inline-block;
	cursor: pointer;
}
.methods-footer-wrap {
	width: calc(100% - 248px);
	height: 76px;
	position: fixed;
	left: 228px;
	bottom: 0;
	background: #fff;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
}
.cancel-modal {
	/deep/ .ant-modal-body {
		padding: 20px;
	}
	/deep/ .ant-modal-close {
		display: none;
	}
	.model-title {
		width: 100%;
		height: 26px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		span {
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 500;
			line-height: 28px;
		}
	}
	.tip-wrap {
		span {
			height: 26px;
			display: inline-block;
			font-size: 18px;
			font-style: normal;
			font-weight: 500;
		}
		width: 140px;
		height: 26px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}
}
.textarea-wrap {
	width: 450px;
	height: 150px;
	background: rgba(129, 145, 169, 0.1);
	resize: none;
}
.desc-tip {
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	color: rgba(0, 0, 0, 0.25);
	margin: 14px 0 16px 0;
}
/deep/.ant-modal-footer {
	border: none;
	padding: 10px 20px;
	.ant-btn {
		width: 90px;
	}
	button + button {
		margin-left: 20px;
	}
}
</style>
