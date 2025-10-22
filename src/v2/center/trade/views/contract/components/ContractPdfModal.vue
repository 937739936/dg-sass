<template>
	<div>
		<a-modal
			width="688px"
			v-model="visible"
			class="slModal"
			destroyOnClose
		>
			<div slot="title">
				<!-- tabs -->
				<a-tabs
					:defaultActiveKey="key"
					@change="tabChange"
				>
					<a-tab-pane
						:key="1"
						tab="合同预览"
					>
						<Thymeleaf
							:content="VUEX_GET_THYMELEAF_CONTENT"
							:multiGoodsNameFlag="multiGoodsNameFlag"
						/>
					</a-tab-pane>
					<a-tab-pane
						:key="2"
						tab="承诺函预览"
						v-if="VUE_GET_THYMELEAF_COMMITMENT"
					>
						<Thymeleaf
							:showCoalTitle="false"
							:content="VUE_GET_THYMELEAF_COMMITMENT"
						/>
					</a-tab-pane>
				</a-tabs>
			</div>
			<!-- <div class="content-wrap" v-if="key=='1'">
        <Thymeleaf :content="VUEX_GET_THYMELEAF_CONTENT" />
      </div>
      <div class="content-wrap" v-if="key=='2' && VUE_GET_THYMELEAF_COMMITMENT">
        <Thymeleaf :showCoalTitle="false" :content="VUE_GET_THYMELEAF_COMMITMENT" />
      </div> -->
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
import Thymeleaf from '../diy/components/Thymeleaf.vue';
import { API_contractFileDownload } from '@/v2/center/trade/api/contract';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export default {
	name: 'ContractPdfModal',
	data() {
		return {
			visible: false,
			tabsData: [
				{
					name: '合同预览',
					key: 1
				},
				{
					name: '承诺函预览',
					key: 2
				}
			],
			key: 1,
			loading: false,
			orderIndicators: []
		};
	},
	props: {
		multiGoodsNameFlag: {
			type: Number,
			default: 0
		}
	},
	components: {
		Thymeleaf
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_THYMELEAF_CONTENT: 'VUEX_GET_THYMELEAF_CONTENT',
			VUE_GET_THYMELEAF_COMMITMENT: 'VUE_GET_THYMELEAF_COMMITMENT'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		tabChange(key) {
			this.key = key;
		},
		showModal(orderIndicators) {
			this.orderIndicators = orderIndicators || [];
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
		downFiles() {
			this.loading = true;
			const fileName = this.key == 1 ? '煤炭买卖合同.pdf' : '承诺函.pdf';
			// ${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同 ${moment(new Date()).format("YYYY-MM-DD")}.zip
			let cloneResult = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			this.formatArrayToString(cloneResult.contractDelivery);
			API_contractFileDownload({
				submit: false,
				...cloneResult,
				contract: {
					orderType: this.$route.query.type,
					...cloneResult.acceptUser,
					...cloneResult.contract
				},
				contractDelivery: {
					...cloneResult.contract,
					...cloneResult.contractDelivery
				},
				orderIndicators: this.orderIndicators
			})
				.then(res => {
					if (this.VUE_GET_THYMELEAF_COMMITMENT) {
						comDownload(
							res,
							'',
							`${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同 ${moment(new Date()).format('YYYY-MM-DD')}.zip`
						);
					} else {
						comDownload(res, '', `${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同.pdf`);
					}
				})
				.finally(() => {
					this.loading = false;
				});
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
		padding: 30px 60px;
	}
	.thymeleaf-wrap {
		border: none !important;
		padding: 0;
	}
	::v-deep.ant-modal-header {
		background: #fff;
	}
	::v-deep.ant-tabs-content {
		max-height: calc(80vh - 150px);
		box-sizing: border-box;
	}
	::v-deep.ant-tabs-tabpane-active {
		padding: 30px 60px;
	}
	::v-deep.ant-modal-body {
		display: none;
	}
	::v-deep.ant-tabs-nav-wrap {
		width: 100%;
		background: #f3f5f6;
		padding: 0 30px;
		border-radius: 4px 4px 0 0;
	}
}
// .preview-modal {
//   ::v-deep.ant-tabs {
//     margin-bottom: -16px;
//   }
//   ::v-deep.ant-tabs-bar {
//     margin-bottom: 0;
//     border-bottom: none;
//   }
//   ::v-deep.ant-tabs-nav {
//     .ant-tabs-tab {
//       padding: 12px 0;
//     }
//     .ant-tabs-tab::before {
//       border-top: 2px solid transparent
//     }
//   }
//   /deep/ .ant-modal-content {
//     height: 800px;
//   }
//   /deep/ .ant-modal-header {
//     height: 58px;
//   }
//   /deep/ .ant-modal-body {
//     height: 678px !important;
//     overflow: hidden;
//     overflow-y: auto;
//   }
//   /deep/ .ant-modal-footer {
//     height: 62px;
//     display: flex;
//     justify-content: center;
//   }
//   .content-wrap {
//     height: 678px;
//   }
// }
</style>
