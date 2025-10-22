<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">云票签收签章</span>
			</div>
			<spin-component
				:active="signLoading"
				text="相关资料申请盖章中，请稍后..."
			></spin-component>

			<div class="top-nav">
				<div
					:class="{ active: item.url == currentPdf, 'nav-item': true }"
					@click="changeContract(item)"
					v-for="(item, index) in signList"
					:key="index"
				>
					{{ item.typeDesc }}
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
					@click="$router.push('/center/counterfoil/audit/list')"
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
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import PdfPreview from '@sub/components/pdf/index.vue';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp.vue';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import { sign } from '@/v2/utils/sign.js';

import {
	API_GetCounterfoilSignFile,
	API_GetCounterfoilautoSign,
	API_GetCounterfoilsignUpdate,
	API_GetCounterfoilsigList
} from '@/v2/center/counterfoil/api/index.js';

import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			signList: [],
			currentPdf: '',
			signLoading: false,
			ischeck: false
		};
	},
	components: {
		PdfPreview,
		SignModal,
		SpinComponent,
		ChooseStamp,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';

		API_GetCounterfoilSignFile({ id: this.financingApplyId }).then(res => {
			this.signList = (res.data || []).map(d => {
				return {
					...d,
					url: d.path
				};
			});

			this.currentPdf = this.signList.length ? this.signList[0].url : '';
		});
	},
	methods: {
		changeContract(item) {
			this.currentPdf = item.url;
		},

		autoSignature() {
			this.signLoading = true;
			API_GetCounterfoilautoSign({ id: this.financingApplyId })
				.then(res => {
					if (res.success) {
						API_GetCounterfoilsignUpdate({ id: this.financingApplyId }).then(res => {
							if (res.success) {
								this.$message.success('签署完成').then(() => this.$router.push('/center/counterfoil/record/list'));
								this.signLoading = false;
							} else {
								this.$message.error('签署失败，请联系管理员');
							}
						});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		step1(obj) {
			return API_GetCounterfoilsigList({
				id: this.financingApplyId,
				cert: obj.cert
			});
		},
		step2() {
			return API_GetCounterfoilsignUpdate({
				id: this.financingApplyId
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
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/counterfoil/record/list', true);
			}
		}
	}
};
</script>

<style lang="less" scoped>
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
		color: @primary-color;
	}
	&.active:after {
		content: '';
		width: 50%;
		height: 2px;
		position: absolute;
		background-color: @primary-color;
		bottom: 0;
		left: 25%;
	}
}
</style>
