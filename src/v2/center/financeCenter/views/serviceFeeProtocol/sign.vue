<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">服务费协议盖章</span>
			</div>
			<a-row
				v-if="result"
				class="content-box"
			>
				<spin-component
					:active="signLoading"
					text="加载中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="result"
					:url="result"
				></pdf-preview>
				<a-modal
					:visible="visible"
					okText="确定"
					cancelText="取消"
					width="400px"
					@ok="reject"
					@cancel="
						() => {
							visible = false;
						}
					"
				>
					<a-input
						style="width: 90%; margin: 0 auto"
						placeholder="请输入驳回原因"
						v-model.trim="remark"
					></a-input>
				</a-modal>
			</a-row>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					@click.native="confirmOrder"
					:disabled="disabled"
					>确认</a-button
				>
				<a-button
					type="primary"
					@click.native="visible = true"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					>返回</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/SpinComponent.vue';
import { rejectServiceFee, autoSignature, getPdfHashList, confirmToSeal } from '../../api';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			result: '',
			remark: '',
			visible: false,
			disabled: false,
			signLoading: false
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
		}),
		completedRoute() {
			return '/center/financeCenter/serviceFeeProtocol';
		}
	},
	created() {
		this.result = this.$route.query.url;
	},
	methods: {
		autoSignature() {
			this.signLoading = true;
			autoSignature({ serialNo: this.$route.query.serialNo })
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
		// 确认
		confirmOrder() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return getPdfHashList(
				Object.assign(
					{
						serialNo: this.$route.query.serialNo,
						cert: obj.cert
					},
					obj
				)
			);
		},
		step2(obj) {
			return confirmToSeal(
				Object.assign(
					{
						serialNo: this.$route.query.serialNo
					},
					obj
				)
			);
		},
		// 驳回合同
		async reject() {
			if (!this.remark) {
				this.$message.error('请填写驳回原因！');
				return;
			}
			await rejectServiceFee({ serialNo: this.$route.query.serialNo, remark: this.remark });
			this.$message.success('操作成功');
			this.$router.go(-1);
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
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
	}
}
</style>
