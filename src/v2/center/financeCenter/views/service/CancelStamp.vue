<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">{{ $route.meta.title }}</span>
			</div>
			<a-row class="content-box">
				<spin-component
					:active="signLoading"
					text="服务费结算单作废盖章中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="result"
					:url="result"
				></pdf-preview>
			</a-row>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<div class="slDetailBottom">
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
			>
				<a-space :size="30">
					<a-button @click.native="$router.go(-1)">返回</a-button>
					<a-button @click.native="downPdf">下载PDF</a-button>
					<a-button
						type="primary"
						@click.native="cancelServiceFee"
						>盖章</a-button
					>
				</a-space>
			</a-row>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_ServiceFeeDetailNew,
	API_DOWNLPREVIEWTE,
	API_serviceFeeStatementInvalidAutoSignature,
	API_serviceFeeStatementInvalidGetInvalidPdfHashList,
	API_serviceFeeStatementInvalidConfirmToSeal
} from '@/v2/center/financeCenter/api/index';
import { sign } from 'untils/sign.js';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import comDownload from '@sub/utils/comDownload.js';
import SignModal from 'components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			result: '',
			autoFocus: false,
			rejectReason: '',
			disabled: false,
			signLoading: false,
			// 服务协议是否签约
			info: {},
			agreementChecked: false,
			serviceFeeInfo: {}
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		this.getCancelDetail();
	},
	props: {
		type: {
			required: false,
			default: 'old',
			type: String
		}
	},
	methods: {
		async autoSignature() {
			this.signLoading = true;
			try {
				await API_serviceFeeStatementInvalidAutoSignature({ serviceFeeId: this.$route.query.id });
				this.$message.success('签署完成');
				this.$router.go(-1);
			} catch (error) {
			} finally {
				this.signLoading = false;
			}
		},
		async cancelServiceFee() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/financeCenter/service/myServiceFee', true);
			}
		},
		step1(obj) {
			return API_serviceFeeStatementInvalidGetInvalidPdfHashList({
				serviceFeeId: this.$route.query.id,
				cert: obj.cert
			});
		},
		step2() {
			return API_serviceFeeStatementInvalidConfirmToSeal({
				serviceFeeId: this.$route.query.id
			});
		},
		// 获取确认订单详情
		async getCancelDetail() {
			const res = await API_ServiceFeeDetailNew({ id: this.$route.query.id });
			this.info = res.data;
			this.result = res.data.invalidPdfPath;
		},
		// 下载
		downPdf() {
			API_DOWNLPREVIEWTE(this.result).then(res => {
				comDownload(res, this.result);
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
	margin-bottom: -40px;
	.methods-wrap {
		border-bottom: none;
	}
	.ant-card {
		padding: 20px 30px 0 30px;
		.content-box {
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
		}
	}
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
