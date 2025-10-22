<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">服务费协议作废</span>
			</div>
			<div class="dateBox">
				<label> <span style="color: red">*</span> 签订日期：</label>
				<a-date-picker
					v-model="invalidDate"
					placeholder="请选择"
					valueFormat="YYYY-MM-DD"
					format="YYYY-MM-DD"
				/>
			</div>
			<a-row
				v-if="result"
				class="content-box"
			>
				<pdf-preview
					v-if="result"
					:url="result"
					type="base64"
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
				style="margin-top: 20px"
				v-if="result"
			>
				<a-checkbox v-model="commitChecked"> 已阅读并同意<a href="javascript:;">《服务费协议解除协议》</a> </a-checkbox>
			</a-row>
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
			>
				<a-space :size="30">
					<a-button
						type="primary"
						@click.native="submitSettle"
						:disabled="disabledClick"
						>确认</a-button
					>
					<a-button
						type="primary"
						style="margin: 0 50px"
						@click.native="$router.go(-1)"
						>取消</a-button
					>
				</a-space>
			</a-row>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';

import {
	getServiceFeeInvalidUrl,
	invalidServiceFee,
	afterGenerateInvalidFile,
	getInvalidPdfHashList,
	invalidAutoSignature
} from '../../api';
import { sign } from '@/v2/utils/sign.js';
import { mapGetters } from 'vuex';
import SignModal from '@/v2/components/signModal/index.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			result: '',
			signLoading: false,
			commitChecked: false,
			invalidDate: ''
		};
	},
	components: {
		PdfPreview,
		SignModal,
		ChooseStamp,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		disabledClick() {
			let result = true;
			if (this.result && !this.commitChecked) {
				result = false;
			}
			return !result;
		}
	},
	created() {
		this.getServiceFeeInvalidUrl();
	},
	methods: {
		// 确认订单
		async submitSettle() {
			if (!this.invalidDate) {
				this.$message.error('请选择签订日期');
				return;
			}
			await invalidServiceFee({ serialNo: this.$route.query.serialNo, invalidDate: this.invalidDate });
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, '/center/financeCenter/serviceFeeProtocol', isOrderModule);
			}
		},
		autoSignature() {
			this.signLoading = true;
			invalidAutoSignature({ serialNo: this.$route.query.serialNo })
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(() => this.$router.go(-1));
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		step1(obj) {
			return getInvalidPdfHashList({
				serialNo: this.$route.query.serialNo,
				cert: obj.cert
			});
		},
		step2() {
			return afterGenerateInvalidFile({
				serialNo: this.$route.query.serialNo
			});
		},
		async getServiceFeeInvalidUrl() {
			const res = await getServiceFeeInvalidUrl({ serialNo: this.$route.query.serialNo });
			this.result = res.data;
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
	.dateBox {
		margin: 15px 0;
		/deep/.ant-calendar-picker {
			width: 200px;
		}
	}
}
</style>
