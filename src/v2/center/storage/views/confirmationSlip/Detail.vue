<template>
	<div>
		<pdf-preview
			v-if="data"
			:url="data.pdfPath"
		></pdf-preview>
		<a-row
			v-if="type === 'confirm'"
			type="flex"
			justify="center"
			style="margin: 20px 0"
		>
			<a-checkbox v-model="agreementChecked"> 已详细阅读《商品确认单》且无异议，同意签章 </a-checkbox>
		</a-row>
		<div class="tc">
			<a-button
				v-if="type === 'confirm'"
				type="primary"
				@click="confirm"
				:disabled="!agreementChecked"
				>{{ confirmText }}</a-button
			>
			<a-button
				type="primary"
				style="margin: 0px 50px"
				@click="$router.go(-1)"
				>返回</a-button
			>
		</div>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>

<script lang="jsx">
import PdfPreview from '@sub/components/pdf/index.vue';
import { mapGetters } from 'vuex';
import SignModal from '@/v2/components/signModal/index';
import { sign } from '@/v2/utils/sign.js';
import {
	API_GrainConfirmationShipInfo,
	API_GrainConfirmationShipUkey, // 企业盖章[Ukey]
	API_GrainConfirmationShipAuto, // 企业盖章[托管]
	API_GrainConfirmationSealToConfirm, // 仓储企业签章并提交核心企业确认
	API_GrainConfirmationConfirm // 核心企业盖章并提交确认
} from '@/v2/center/storage/api';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

export default {
	name: 'ConfirmationSlipDetail',
	props: {
		type: {
			type: String,
			default: ''
		}
	},
	components: {
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	data() {
		return {
			agreementChecked: false,
			data: '',
			url: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		confirmText() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY' ? '盖章' : '确认';
		}
	},
	created() {
		this.id = this.$route.query.id;
		this.getConfirmDetail();
	},
	methods: {
		confirm() {
			this.$confirm({
				centered: true,
				title: '是否确认拟签章的《商品所有权确认单》信息无误？',
				// content: '',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.toSign();
				}
				// onCancel() {}
			});
		},
		// 盖章相关
		toSign() {
			this.id = this.$route.query.id;
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, '', isOrderModule);
			}
		},
		// 盖章
		step1(v) {
			return API_GrainConfirmationShipUkey({
				id: this.id,
				...v // sign方法传入的cert参数
			});
		},
		// 修改状态
		step2() {
			const func = {
				CORE_COMPANY: API_GrainConfirmationConfirm,
				WAREHOUSE: API_GrainConfirmationSealToConfirm
			};
			return func[this.VUEX_ST_COMPANYSUER.companyType](this.id);
		},

		// 自动盖章
		autoSignature() {
			this.signLoading = true;
			API_GrainConfirmationShipAuto(this.id)
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success('签署完成').then(() => this.$router.go(-1));
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

		getConfirmDetail() {
			API_GrainConfirmationShipInfo(this.id).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		}
	}
};
</script>
