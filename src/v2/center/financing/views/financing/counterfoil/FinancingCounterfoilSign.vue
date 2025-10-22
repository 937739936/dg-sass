<template>
	<div class="FinancingSign">
		<spin-component
			:active="signLoading"
			text="相关资料申请盖章中，请稍后..."
		></spin-component>
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>票据融资盖章</span>
			</div>
		</div>
		<div class="top-nav">
			<div
				:class="{ active: item.url == currentPdf, 'nav-item': true }"
				@click="changeContract(item)"
				v-for="(item, index) in signList"
				:key="index"
			>
				{{ item.name }}
			</div>
		</div>
		<div
			class="content"
			v-if="signList.length"
		>
			<pdf-preview :url="currentPdf"></pdf-preview>
		</div>

		<a-row style="text-align: center; margin-top: 30px">
			<a-checkbox v-model="ischeck">
				我已经认真阅读并知悉上述融资相关协议文件的内容，自愿承担融资相关协议文件的义务和风险。
			</a-checkbox>
		</a-row>

		<div style="text-align: center; margin-top: 30px">
			<a-button
				type="primary"
				ghost
				@click="$router.back()"
				style="margin-right: 30px"
				>返回</a-button
			>
			<a-button
				type="primary"
				@click="signApply"
				:disabled="!ischeck"
				v-debounceclick
				>盖章</a-button
			>
		</div>

		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import PdfPreview from '@sub/components/pdf/index.vue';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import { sign } from 'untils/sign.js';
import {
	API_FinancingCounterfoilSignList,
	API_FinancingCounterSignSave,
	API_FinancingCounterfoilGetSigList,
	API_CfcaCounterfoilMAINAutoSignature
} from '@/v2/center/financing/api/index.js';

import { mapGetters } from 'vuex';

export default {
	name: 'FinancingSign',
	data() {
		return {
			signList: [],
			BASE_NET: ENV.BASE_NET,
			currentPdf: '',
			signLoading: false,
			ischeck: false
		};
	},
	components: {
		PdfPreview,
		SignModal,
		SpinComponent,
		ChooseStamp
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';
		API_FinancingCounterfoilSignList({ financingApplyId: this.financingApplyId }).then(res => {
			this.signList = res.data || [];

			this.currentPdf = this.signList.length ? this.signList[0].url : '';
		});
	},
	methods: {
		changeContract(item) {
			this.currentPdf = item.url;
		},

		openPdf() {
			window.open(this.ticketPdfUrl, '_blank');
		},
		autoSignature() {
			this.signLoading = true;
			API_CfcaCounterfoilMAINAutoSignature({ financingApplyId: this.financingApplyId })
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(() => this.$router.push('/center/financing/financingCounterfoilListLOG'));
						this.signLoading = false;
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		step1(obj) {
			return API_FinancingCounterfoilGetSigList({
				financingApplyId: this.financingApplyId,
				cert: obj.cert
			});
		},
		step2() {
			return API_FinancingCounterSignSave({
				financingApplyId: this.financingApplyId
			});
		},
		signApply() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/financing/financingCounterfoilListLOG', true);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingSign {
	background-color: #fff;

	.top-nav {
		width: 100%;
		display: flex;
		background-color: #fff;
		height: 40px;
		justify-content: center;
		border-bottom: 1px solid #eef0f2;
		font-size: 14px;
	}
	.content {
		background-color: #fff;
	}
	.nav-item {
		width: 200px;
		text-align: center;
		line-height: 40px;
		position: relative;
		cursor: pointer;
		&.active {
			color: #0053db;
		}
		&.active:after {
			content: '';
			width: 50%;
			height: 2px;
			position: absolute;
			background-color: #0053db;
			bottom: 0;
			left: 25%;
		}
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}

	margin: -20px;
	padding-bottom: 20px;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}
}
</style>
