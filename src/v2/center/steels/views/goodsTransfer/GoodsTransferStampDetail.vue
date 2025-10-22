<template>
	<div id="goodsTransferStampDetail">
		<div class="s-title">
			<div style="width: 150px">
				<span>货转盖章</span>
			</div>
			<a-row
				type="flex"
				justify="center"
				style="padding: 50px 0"
			>
				<a-button
					@click.native="prevNext"
					style="margin: 0 50px"
					>返回</a-button
				>
				<a-button
					type="primary"
					@click.native="sign"
					>盖章</a-button
				>
			</a-row>
		</div>
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
	</div>
</template>

<script>
import {
	API_SteelsGoodstransferDetail,
	API_SteelsGoodstransferSignAuto,
	API_SteelsGoodstransferSignAfterConfirm,
	API_SteelsGoodstransferSignUkey
} from '@/v2/center/steels/api/goodsTransfer.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

export default {
	name: 'GoodsTransferStampDetail',
	data() {
		return {
			result: '',
			no: '',
			cfcaSealList: [] // 印模集合
		};
	},
	components: {
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			if (this.$route.query.pdfPath) {
				this.result = this.$route.query.pdfPath;
			} else {
				API_SteelsGoodstransferDetail({ id: this.$route.query.id }).then(res => {
					if (res.success) {
						this.result = res.data.attachmentFileVO[0].path;
					}
				});
			}
		},
		autoSignature() {
			this.signLoading = true;
			API_SteelsGoodstransferSignAuto({
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
								this.$router.push('goodsTransferIssueList');
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
				moduleSealType: 12 // 模块编码
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				that.$confirm({
					centered: true,
					title: '请确认信息无误并进行盖章？',
					okText: '确认',
					cancelText: '取消',
					onOk() {
						sign.call(that, that.step1, that.step2, 'goodsTransferIssueList', isOrderModule);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return API_SteelsGoodstransferSignUkey({
				id: this.$route.query.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_SteelsGoodstransferSignAfterConfirm({ id: this.$route.query.id });
		},
		prevNext() {
			this.$router.push('goodsTransferIssueList');
		}
	}
};
</script>

<style scoped></style>
