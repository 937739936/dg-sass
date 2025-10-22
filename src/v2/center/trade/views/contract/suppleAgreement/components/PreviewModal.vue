<template>
	<div>
		<a-modal
			width="726px"
			v-model="visible"
			class="slModal"
			:centered="false"
			destroyOnClose
		>
			<div slot="title">
				<!-- tabs -->
				<a-tabs
					@change="tabChange"
					v-model="key"
				>
					<a-tab-pane
						:key="1"
						tab="补协预览"
					>
						<Supple :contractData="contractData"></Supple>
					</a-tab-pane>
					<a-tab-pane
						:key="2"
						tab="合同预览"
					>
						<pdf-preview
							:url="contractData.contractPdfUrl"
							id="222"
						></pdf-preview>
					</a-tab-pane>
				</a-tabs>
			</div>
			<template slot="footer">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="() => (visible = false)"
						>关闭</a-button
					>
					<a-button
						type="primary"
						:loading="loading"
						@click="downFiles"
						>下载文件</a-button
					>
				</a-space>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { API_contractFileDownload } from '@/v2/center/trade/api/contract';
import { previewPdf } from '@/v2/center/trade/api/suppleAgreement';

import PdfPreview from '../pdf/index.vue';

import Supple from './pdf/Supple.vue';

import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export default {
	name: 'ContractPdfModal',
	props: {
		contractData: {
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			key: 1,
			tabsData: [
				{
					name: '补协预览',
					key: 1
				},
				{
					name: '合同预览',
					key: 2
				}
			],
			key: 1,
			loading: false,
			orderIndicators: []
		};
	},
	components: {
		Supple,
		PdfPreview
	},
	computed: {
		signDate() {
			return this.$store.state.supple.signDate;
		},
		changeData() {
			return this.$store.state.supple.changeData;
		},
		signContent() {
			return this.$store.state.supple.signContent;
		}
	},
	methods: {
		tabChange(key) {
			this.key = key;
		},
		showModal(orderIndicators) {
			this.visible = true;
		},
		formatArrayToString(obj) {
			for (const key in obj) {
				if (obj[key] && Array.isArray(obj[key])) {
					obj[key] = obj[key].join('');
				}
			}
		},
		// 下载文件
		async downFiles() {
			this.loading = true;
			const fileName = this.key == 1 ? '煤炭买卖合同.pdf' : '承诺函.pdf';

			let changeItems = this.changeData.map(el => el.changeItem);

			changeItems.forEach((el, i) => {
				el.changeItemStr = this.changeData[i].des;
				if (el.fieldName == 'quantity') {
					el.changeItemStr = el.changeItemStr.replace(/%/g, '&&');
				}
				el.itemDetails.forEach(el2 => {
					if (Array.isArray(el2.value)) {
						el2.value = el2.value.join(',');
					}
				});
			});

			const params = {
				contractNo: this.contractData.contractNo,
				id: this.$route.query.id,
				changeItems,
				signContent: this.signContent,
				signDate: this.signDate
				// changeItemStrList: this.changeData.map(el => el.des),
			};
			try {
				const res = await previewPdf(params);
				const date = moment(this.contractData.contract.signTime).format('LL');
				const name = `${this.contractData.contract.orderType == 'SELL' ? '销售合同' : '采购合同'}-${this.contractData.contract.sellerCompanyName}-${this.contractData.contract.buyerCompanyName}-${this.contractData.contract.contractNo}-${date}.zip`;
				comDownload(res, '', name);
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.slModal {
	::v-deep.ant-modal-wrap,
	::v-deep.ant-modal-mask {
		z-index: 1061;
	}
	::v-deep.ant-modal-header {
		padding: 0;
	}
	::v-deep.ant-tabs-bar {
		border: none;
		margin: 0;
	}
	::v-deep.ant-tabs-tab {
		margin-right: 40px;
		padding: 19px 0;
	}
	::v-deep.ant-tabs-ink-bar {
		bottom: 2px;
	}
	::v-deep.ant-modal-footer {
		text-align: center;
	}
	::v-deep.ant-modal-body {
		padding: 10px 20px;
	}

	::v-deep.ant-modal-header {
		background: #fff;
	}
	::v-deep.ant-tabs-content {
		// max-height: calc(80vh - 150px);
		box-sizing: border-box;
	}
	::v-deep.ant-tabs-tabpane-active {
		padding: 30px 60px;
	}
	::v-deep.ant-modal-body {
		display: none;
	}
	/deep/ .ant-modal-content {
		height: 600px;
		// max-height: calc(80vh - 150px);
	}
	::v-deep.ant-tabs-nav-wrap {
		width: 100%;
		background: #f3f5f6;
		padding: 0 30px;
		border-radius: 4px 4px 0 0;
	}
	/deep/ .ant-tabs-tabpane-active {
		padding: 10px 20px;
	}
}
/deep/ .supple {
	height: 460px !important;
	// max-height: calc(80vh - 150px);
	padding: 0;
}
/deep/ .wrap {
	//  height: 350px !important ;
	//  max-height: calc(80vh - 150px);
	height: 460px !important;
}
</style>
