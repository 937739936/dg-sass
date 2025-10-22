<template>
	<div>
		<a-row v-if="result">
			<spin-component
				:active="signLoading"
				text="结算单签署中，请稍后..."
			></spin-component>
			<pdf-preview
				v-if="result"
				:url="result"
			></pdf-preview>
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
				v-if="result"
			>
				<a-checkbox v-model="commitChecked"> 已阅读并同意<a href="javascript:;">《结算单作废确认书》</a> </a-checkbox>
			</a-row>
			<a-row
				type="flex"
				justify="center"
				style="margin: 50px 0"
			>
				<a-button
					type="primary"
					@click.native="sign"
					:disabled="disabledClick"
					>确认</a-button
				>
				<a-button
					type="primary"
					style="margin: 0 50px"
					@click.native="visible = true"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					>返回</a-button
				>
			</a-row>
		</a-row>
		<a-modal
			:visible="visible"
			okText="确定"
			cancelText="取消"
			width="400px"
			@ok="rejectContract"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<a-input
				style="width: 90%; margin: 0 auto"
				placeholder="请输入驳回原因"
				v-model="rejectReason"
			></a-input>
		</a-modal>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import {
	API_SteelsstatementCancelCanccl,
	API_SteelsStatementCancelSealAuto,
	API_SteelsStatementCancelSealUkey,
	API_SteelsStatementCancelSignAfterConfirm
} from '@/v2/center/steels/api/settle.js';

export default {
	data() {
		return {
			result: this.$route.query.url,
			signLoading: false,
			commitChecked: false,
			visible: false,
			rejectReason: '',
			cfcaSealList: []
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp
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
	created() {},
	methods: {
		autoSignature() {
			this.signLoading = true;
			API_SteelsStatementCancelSealAuto({
				id: this.$route.query.id,
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
								this.$router.push('/center/steels/settle/settleCancelList');
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
		// 盖章相关
		sign() {
			let obj = {
				moduleSealType: 11 // 模块编码
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, '/center/settle/settleCancelList', isOrderModule);
			}
		},
		step1(obj) {
			return API_SteelsStatementCancelSealUkey({
				id: this.$route.query.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_SteelsStatementCancelSignAfterConfirm(this.$route.query.id);
		},
		// 驳回合同
		rejectContract() {
			if (this.rejectReason == '') {
				this.$message.error('驳回原因不能为空');
				return;
			}
			API_SteelsstatementCancelCanccl({
				id: this.$route.query.id,
				reason: this.rejectReason
			}).then(res => {
				if (res.success) {
					this.$router.go(-1);
					this.$message.success('操作成功');
				} else {
					this.$message.error(res.message);
				}
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
.name-items
  width 100%
  height 40px

  .name
    font-size 16px
    color #333
    margin-left 20px
</style>
