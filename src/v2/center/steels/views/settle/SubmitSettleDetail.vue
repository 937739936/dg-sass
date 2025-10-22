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
				style="margin: 50px 0"
			>
				<a-button
					type="primary"
					@click.native="sign"
					>盖章</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					style="margin: 0 50px"
					>返回</a-button
				>
			</a-row>
		</a-row>
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
	API_SteelsStatementDetail,
	API_SteelsStatementSealAuto,
	API_SteelsStatementSealUkey,
	API_SteelsStatementSignAfterConfirm
} from '@/v2/center/steels/api/settle.js';

export default {
	data() {
		return {
			result: '',
			autoFocus: false,
			disabled: false,
			signLoading: false,
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
		})
	},
	created() {
		this.getSubmitDetail();
	},
	methods: {
		autoSignature() {
			this.signLoading = true;
			API_SteelsStatementSealAuto({
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
								this.$router.push('/center/steels/settle/mySettleList');
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
				moduleSealType: 10 // 模块编码
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
				sign.call(that, that.step1, that.step2, '/center/steels/settle/mySettleList', isOrderModule);
			}
		},
		step1(obj) {
			return API_SteelsStatementSealUkey({
				id: this.$route.query.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_SteelsStatementSignAfterConfirm(this.$route.query.id);
		},
		// 获取确认订单详情
		getSubmitDetail() {
			API_SteelsStatementDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.result = res.data.attachmentFileVOS[0].path;
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
