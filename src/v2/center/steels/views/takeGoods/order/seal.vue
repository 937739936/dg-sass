<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-24 09:25:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-11 09:59:32
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/order/seal.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="seal-wrap">
		<div class="iframe-wrap">
			<pdf-preview
				v-if="signPreviewUrl"
				:url="signPreviewUrl"
			></pdf-preview>
		</div>
		<p class="methods-list">
			<a-button
				type="primary"
				@click="$router.back()"
			>
				返回
			</a-button>
			<a-button
				type="primary"
				style="margin-left: 40px"
				@click="sign"
				:disabled="disabledSubmit"
			>
				盖章
			</a-button>
			<a-button
				type="primary"
				style="margin-left: 40px"
				@click="downPdf"
			>
				下载pdf
			</a-button>
		</p>
		<signModal ref="signModal"></signModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import { showTakeDeliveryInfo, ukeySignature, autoSignature, changeStatusAfterSign } from '@/v2/center/steels/api/orderApply';
import { sign } from '@/v2/utils/signSteels.js';
import { mapGetters } from 'vuex';
import signModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import { API_DOWNLPREVIEWTE } from '@/v2/center/steels/api';
export default {
	data() {
		return {
			takeDelivery: {},
			disabledSubmit: false,
			cfcaSealList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		getRouteParamsId() {
			return this.$route.query.id;
		},
		getRouteParamscontractId() {
			return this.$route.query.contractId;
		},
		signPreviewUrl() {
			return this.$route.query.pdfPath;
		}
	},
	components: {
		signModal,
		ChooseStamp,
		PdfPreview
	},
	methods: {
		autoSignature() {
			this.apply();
		},
		// 盖章第一步，获取签章
		step1(obj) {
			return ukeySignature({
				cert: obj.cert,
				id: this.getRouteParamsId,
				contractId: this.getRouteParamscontractId,
				cfcaSealList: this.cfcaSealList
			});
		},
		// 盖章第二部，修改状态
		step2() {
			return changeStatusAfterSign({
				id: this.getRouteParamsId
			});
		},
		// 提货单-企业盖章[托管]
		apply() {
			autoSignature({
				id: this.getRouteParamsId,
				contractId: this.getRouteParamscontractId,
				cfcaSealList: this.cfcaSealList
			}).then(res => {
				if (res.success) {
					this.$message.success({
						content: '盖章完成',
						duration: 5
					});
					this.step2();
					this.back();
				}
			});
		},
		// 获取订单详情
		getDeatils() {
			showTakeDeliveryInfo({
				serialNo: this.$route.query.serialNo
			}).then(res => {
				if (res.success) {
					this.takeDelivery = res.data.takeDelivery;
				}
			});
		},
		// 盖章相关
		sign() {
			let obj = {
				moduleSealType: 9 // 模块编码
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1, this.step2, this.back, true, this.VUEX_ST_COMPANYSUER.companyUscc);
			}
		},
		back() {
			this.$message.success({
				content: '盖章完成',
				duration: 5
			});
			this.$router.back();
		},
		// 下载
		downPdf() {
			let url = this.signPreviewUrl;
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		}
	},
	mounted() {
		this.getDeatils();
	}
};
</script>

<style lang="less" scoped>
.seal-wrap {
	iframe {
		width: 100%;
		height: 100%;
	}
	.methods-list {
		position: sticky;
		bottom: 0;
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: #fff;
	}
	.iframe-wrap {
		width: 100%;
		height: 600px;
		overflow: scroll;
	}
}
</style>
