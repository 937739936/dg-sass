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
				货转盖章确认
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
				@click.native="sign"
				>盖章</a-button
			>
		</div>
	</div>
</template>

<script>
import {
	API_getApiGoodsTransferDOApplyGetToSignList,
	API_postApiGoodsTransferDOToConfirm,
	API_CfcaGoodsTransferAutoSignature
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
		getDetail() {
			this.result = this.$route.query.pdfUrl;
			this.goodsTransferNo = this.$route.query.goodsTransferNo;
		},
		autoSignature() {
			this.signLoading = true;
			API_CfcaGoodsTransferAutoSignature({
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
								this.$router.push(`/center/transfer/goodsTransfer/list`);
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
				moduleSealType: 4, //模块编码 2代表补充协议
				moduleSealTypeDetail: 1 //1盖章 2确定盖章
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
						sign.call(that, that.step1, that.step2, `/center/transfer/goodsTransfer/list`, true);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return API_getApiGoodsTransferDOApplyGetToSignList({
				goodsTransferNo: this.goodsTransferNo,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_postApiGoodsTransferDOToConfirm(this.goodsTransferNo);
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
