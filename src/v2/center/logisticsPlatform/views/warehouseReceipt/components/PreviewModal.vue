<template>
	<div>
		<a-modal
			width="726px"
			v-model="visible"
			class="slModal"
			:centered="false"
			title="协议预览"
			destroyOnClose
		>
			<AgreementPdf ></AgreementPdf>
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

import AgreementPdf from './AgreementPdf.vue';


import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { 
downloadPreviewWarehouseReceiptAgreementManage
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'

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
			loading: false,
			orderIndicators: []
		};
	},
	components: {
		AgreementPdf,
	},
	computed: {
		agreeManageInfo() {
      return this.$store.state.logisticsPlatform.agreeManageInfo
    },
    signArea() {
			return this.$store.state.logisticsPlatform.agreeManageInfo.signArea;
		},
    effectiveStartDate() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.effectiveStartDate;
    },
    // 仓储企业
    storageCompanyInfo() {
      return this.$store.state.logisticsPlatform.storageCompanyInfo;
    },
    // 当前企业
    companyInfo() {
     return this.$store.state.user.VUEX_ST_COMPANYSUER.company ;
    },
    // 仓储地址
    storageCompanyAddress() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.storageCompanyAddress;
    },
    // 仓储合同号
    stationLeaseContractNo() {
      return this.$store.state.logisticsPlatform.agreeManageInfo.stationLeaseContractNo;
    },
	},
	methods: {
		tabChange(key) {
			this.key = key;
		},
		show(orderIndicators) {
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
			this.$emit('download')

		}
	}
};
</script>

<style lang="less" scoped>
 .slModal {
	/deep/ .agree {
		height: 100%;
	}
	/deep/ .ant-modal-footer {
		text-align: center
	}
	::v-deep.ant-modal-body {
		padding: 10px 20px;
		height: 600px;
	}

}
</style>
