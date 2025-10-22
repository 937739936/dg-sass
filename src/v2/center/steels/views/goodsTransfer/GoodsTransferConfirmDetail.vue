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
					type="primary"
					@click.native="sign"
					>确认盖章</a-button
				>
				<a-button
					type="primary"
					@click.native="
						() => {
							rejectVisible = true;
						}
					"
					style="margin: 0 50px"
					>驳回货转</a-button
				>
				<a-button @click.native="$router.go(-1)">返回</a-button>
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
		<!-- 驳回盖章弹窗 -->
		<a-modal
			:visible="rejectVisible"
			okText="确定"
			title="驳回货转"
			@cancel="
				() => {
					rejectVisible = false;
				}
			"
			@ok="handleReject"
			width="30%"
		>
			<a-form :form="form">
				<a-row>
					<a-row>
						<a-col :span="24">
							<a-form-item label="">
								<a-textarea
									placeholder="请输入驳回原因"
									:auto-size="{ minRows: 3 }"
									v-decorator="[
										'reason',
										{
											rules: [
												{ required: true, message: '驳回原因必填' },
												{ max: 200, message: '驳回原因不能超过200个字' }
											],
											validateTrigger: 'blur'
										}
									]"
								>
								</a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</a-row>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
import {
	API_GoodsTransferRejectConfirm,
	API_GoodsTransferConfirmGetToSigList,
	API_postApiGoodsTransferConfirm,
	API_GoodsTransferConfirmAutoSignature
} from '@/v2/center/steels/api/goodsTransfer.js';

import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

export default {
	name: 'GoodsTransferStampDetail',
	mounted() {
		this.getDetail();
	},
	data() {
		return {
			result: '',
			no: '',
			rejectVisible: false, //驳回弹窗展示
			form: this.$form.createForm(this), //驳回
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
	methods: {
		handleReject() {
			// 驳回货转
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					API_GoodsTransferRejectConfirm({ rejectReason: values.reason }, this.$route.query.no).then(res => {
						if (res.success) {
							this.$message.success('驳回成功！');
							this.rejectVisible = false;
							this.$router.push('/center/goodsTransfer/goodsTransferReceiveList');
						}
					});
				}
			});
		},
		getDetail() {
			this.result = this.$route.query.pdfUrl;
			this.no = this.$route.query.no;
		},
		autoSignature() {
			this.signLoading = true;
			API_GoodsTransferConfirmAutoSignature({
				goodsTransferNo: this.no,
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
								this.$router.push('goodsTransferReceiveList');
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
				moduleSealType: 12 //模块编码
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
				that.$confirm({
					centered: true,
					title: '请确认信息无误并进行盖章？',
					okText: '确认',
					cancelText: '取消',
					onOk() {
						sign.call(that, that.step1, that.step2, 'goodsTransferReceiveList', true);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return API_GoodsTransferConfirmGetToSigList({
				goodsTransferNo: this.no,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_postApiGoodsTransferConfirm(this.no);
		}
	}
};
</script>

<style scoped></style>
