<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="slTitle">
				<span>{{ meta.title }}</span>
			</div>
			<spin-component
				:active="signLoading"
				text="结算单签署中，请稍后..."
			></spin-component>
			<pdf-preview
				v-if="result"
				:url="result"
			></pdf-preview>
		</a-card>
		<div class="submit-btn">
			<a-button
				type="primary"
				ghost
				@click="back"
			>
				返回
			</a-button>
			<a-button
				type="primary"
				ghost
				:loading="downloadLoading"
				@click="download"
			>
				下载
			</a-button>
			<a-button
				type="primary"
				ghost
				@click="cancel"
			>
				作废
			</a-button>
			<a-button
				type="primary"
				@click="sign"
				>盖章</a-button
			>
		</div>
		<modalBack
			ref="modalBack"
			title="确认作废?"
			width="440px"
			:loading="modalLoading"
			@verify="modalBackOK"
		>
			<div class="modalBack">
				<div class="tip">作废后，如再需签订结算单，则需要重新走流程，如确需作废，请继续操作</div>
				<a-form :form="form">
					<a-form-item>
						<a-textarea
							:maxLength="200"
							class="textarea"
							placeholder="请输入作废原因，最多200字"
							v-decorator="[
								'reason',
								{
									rules: [
										{
											required: true,
											message: '作废原因必填',
											whitespace: true
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-form>
			</div>
		</modalBack>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import breadcrumb from '@/v2/components/breadcrumb/index';
import { sign } from '@/v2/utils/sign.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import modalBack from '@/v2/components/modalInfo/back';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import {
	API_GETSETTLEDETAIL,
	API_POSTSTATEMENTseal,
	API_POSTSTATEMENTgetseal,
	API_DOWNLPREVIEWTE,
	API_POSTSETTLETEcancel
} from '@/v2/center/trade/api/settle';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';

export default {
	components: {
		breadcrumb,
		modalBack,
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	data() {
		let { meta, query } = this.$route;
		return {
			meta, //获取title
			id: query?.id,
			autoFocus: false,
			data: {}, //接口数据返回信息
			disabled: false,
			signLoading: false,
			cfcaSealList: [], // 印模集合
			form: this.$form.createForm(this),
			downloadLoading: false, //下载当前文件
			modalLoading: false //弹框loading状态
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER' //获取企业信息
		}),
		result() {
			let result = '';
			result = this.attachList.find(item => item.type == 'JSD')?.filePath || '';
			return result;
		},
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		//合同信息
		contractInfo() {
			return this.data.contractInfo || {};
		},
		//结算单信息
		statementInfo() {
			return this.data.statementInfo || {};
		},
		//附件信息
		attachList() {
			return this.data.attachList || [];
		}
	},
	created() {
		this.getDetail();
	},
	methods: {
		async autoSignature() {
			this.signLoading = true;
			await API_POSTSTATEMENTseal({
				id: this.id,
				cfcaSealList: this.cfcaSealList,
				onlyChangeStatusFlag: false
			})
				.then(res => {
					if (res.success) {
						this.$message.success({
							content: '盖章完成',
							duration: 5
						});
						this.back();
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
				moduleSealType: 5, //模块编码 5代表结算单
				moduleSealTypeDetail: 1 //1盖章 2确定盖章
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 盖章相关
		async submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				sign.call(that, that.step1, that.step2, that.back, true);
			}
		},
		step1(obj) {
			return API_POSTSTATEMENTgetseal({
				id: this.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_POSTSTATEMENTseal({
				id: this.id,
				cfcaSealList: this.cfcaSealList,
				onlyChangeStatusFlag: true
			});
		},
		//获取详情
		async getDetail() {
			if (this.id) {
				let res = await API_GETSETTLEDETAIL({ statementId: this.id });
				if (res.success) {
					let data = res.data;
					this.data = { ...data };
				}
			}
		},
		//返回
		back() {
			this.$router.back();
		},
		//作废
		cancel() {
			this.$refs.modalBack.open();
		},
		//作废确认
		modalBackOK() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.modalLoading = true;
					API_POSTSETTLETEcancel({ id: this.id, ...values })
						.then(res => {
							if (res.success) {
								this.$message.success('操作成功');
								this.back();
							}
						})
						.finally(() => {
							this.$refs.modalBack.close();
							this.modalLoading = false;
						});
				}
			});
		},
		//下载
		download() {
			this.downloadLoading = true;
			let BASE_NET = ENV.BASE_NET;
			let result = BASE_NET + this.result;
			let name = `电子结算单-${this.statementInfo.serialNo}-${this.contractInfo.sellerName}-${this.contractInfo.buyerName}-${this.contractInfo.contractNo}.pdf`;
			API_DOWNLPREVIEWTE(result)
				.then(res => {
					comDownload(res, null, name);
				})
				.finally(() => {
					this.downloadLoading = false;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.content {
		padding: 20px 20px 0;
		.slTitle {
			color: rgba(0, 0, 0, 0.8);
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			margin-bottom: 20px;
		}
	}

	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		border-top: 1px solid #e5e6eb;
		text-align: center;
		z-index: 100;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
}
.modalBack {
	.tip {
		color: rgba(0, 0, 0, 0.25);
		font-size: 14px;
		line-height: normal;
		margin-bottom: 16px;
	}
	.textarea {
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
}
</style>
