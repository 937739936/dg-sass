<template>
	<div>
		<pdf-preview
			v-if="detailData.pdfPath"
			:url="detailData.pdfPath"
		></pdf-preview>
		<div
			class="tc"
			style="margin-top: 20px"
		>
			<a-space>
				<a-button
					type="primary"
					ghost
					@click="$router.go(-1)"
					>返回</a-button
				>
				<a-button
					v-if="!isInitiator"
					type="primary"
					ghost
					@click="visibleReject = true"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click="sign"
					>盖章</a-button
				>
				<a-button
					type="primary"
					ghost
					@click="downFile"
					>下载PDF</a-button
				>
			</a-space>
		</div>
		<a-modal
			v-model="visibleReject"
			destroyOnClose
			title="补充协议驳回"
			@ok="handleOkReject"
			@cancel="visibleReject = false"
		>
			<a-form :form="form">
				<a-form-model-item
					:labelCol="labelCol"
					:wrapperCol="wrapperCol"
					label="驳回理由"
					:colon="false"
				>
					<a-textarea
						autoSize
						placeholder="请输入驳回理由"
						v-decorator="[
							'remark',
							{
								rules: [
									{ required: true, message: '请输入驳回理由' },
									{ max: 1000, message: '驳回理由长度不能超过1000个字符' }
								]
							}
						]"
					/>
				</a-form-model-item>
			</a-form>
		</a-modal>

		<SignModal ref="signModal" />
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>
<script>
import {
	API_SupplementalAgreementReject,
	API_SupplementalAgreementToConfirm,
	API_SupplementalAgreementSingleFile,
	API_SupplementalAgreementDetail,
	API_SupplementalAgreementGetPdfHashList,
	API_SupplementalAgreementAutoSign
} from '@/v2/api/steels.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import comDownload from '@sub/utils/comDownload.js';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
export default {
	name: 'SuppleAgreementSign',

	components: {
		PdfPreview,
		SignModal,
		ChooseStamp
	},

	data() {
		return {
			url: '',
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			form: this.$form.createForm(this),
			visibleReject: false,
			isInitiator: '',
			id: '',
			detailData: {},
			cfcaSealList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		const { id, isInitiator } = this.$route.query;
		this.id = id;
		this.isInitiator = isInitiator;
		this.getDetail();
	},

	methods: {
		getDetail() {
			API_SupplementalAgreementDetail({ id: this.id }).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		handleOkReject() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					const params = {
						id: this.id,
						rejectReason: values.remark
					};
					API_SupplementalAgreementReject(params).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success('操作成功');
								this.$router.go(-1);
								this.visibleReject = false;
							} else {
								this.$message.error('操作失败');
							}
						}
					});
				}
			});
		},
		downFile() {
			API_SupplementalAgreementSingleFile(this.id).then(res => {
				const { serialNo, buyCompanyName, sellCompanyName } = this.detailData;
				comDownload(res, '', `补充协议-${serialNo}-${sellCompanyName}-${buyCompanyName}.pdf`);
			});
		},
		// 盖章相关
		sign() {
			let obj = {
				moduleSealType: 8 // 模块编码
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const self = this;
				const isOrderModule = true;
				sign.call(self, self.ukeySign, self.changeDataStatus, '', isOrderModule);
			}
		},
		// ukey盖章
		ukeySign(obj) {
			return API_SupplementalAgreementGetPdfHashList({
				id: this.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},

		// 修改数据状态
		changeDataStatus() {
			const fct = API_SupplementalAgreementToConfirm;
			return fct(this.id);
		},

		// 自动托管盖章
		autoSignature() {
			this.signLoading = true;
			API_SupplementalAgreementAutoSign({
				id: this.id,
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.changeDataStatus()
							.then(() => {
								this.$message.success({
									content: '盖章完成',
									duration: 5
								});
								this.$router.go(-1);
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.catch(() => (this.signLoading = false));
		}
	}
};
</script>
