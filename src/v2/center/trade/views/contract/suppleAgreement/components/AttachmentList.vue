<template>
	<div>
		<a-table
			:columns="filesColumns"
			border
			class="new-table"
			:bordered="false"
			rowKey="fileUrl"
			:dataSource="list"
			:pagination="false"
		>
			<template
				slot="no"
				slot-scope="text, record"
			>
				<span class="preview-box">
					<a
						href="javascript:;"
						class="preview"
						@click="handlePreview(record)"
					>
						{{ text }}
					</a>
				</span>
			</template>
			<template
				slot="action"
				slot-scope="text, items"
			>
				<a-space
					:size="20"
					v-if="source !== 'oa'"
				>
					<a
						href="javascript:;"
						@click="downloadModal"
						>下载</a
					>
					<!-- <span class="line"></span> -->
				</a-space>
			</template>
		</a-table>
		<ConfirmModal
			ref="download"
			@save="saveConfirm"
		>
			<div class="radio-box">
				<a-radio-group v-model="radioValue">
					<p style="margin-bottom: 10px"><a-radio :value="0"> 原合同及历史补协一起下载 </a-radio></p>
					<p><a-radio :value="1"> 仅下载当前补协文件 </a-radio></p>
				</a-radio-group>
			</div>
		</ConfirmModal>

		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import ConfirmModal from './ConfirmModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { downloadAllSup, downloadCurrentSup } from '@/v2/center/trade/api/suppleAgreement';
const filesColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeText', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileName', width: '20%' },
	{ title: '文件编号', dataIndex: 'no', scopedSlots: { customRender: 'no' } },
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		currentItem: {
			default: () => {
				return {};
			}
		},
		source: {
			default: ''
		}
	},
	data() {
		return {
			filesColumns,
			previewImg: '',
			radioValue: 0
		};
	},
	methods: {
		handlePreview(data) {
			let url = data.fileUrl;
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		downloadModal() {
			this.$refs.download.open();
		},
		async saveConfirm() {
			const Api = this.radioValue == 0 ? downloadAllSup : downloadCurrentSup;

			const params = {
				id: this.currentItem.id,
				supplementAgreementType: 'ONLINE'
			};
			const res = await Api(params);
			if (this.radioValue === 0) {
				const date = moment(this.currentItem.contractSignTime).format('LL');
				const name = `${this.currentItem.contractType}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}-${this.currentItem.contractNo}-${date}.zip`;
				comDownload(res.data, '', name);
			} else {
				const name = `电子补充协议-${this.currentItem.supplementalAgreementNo}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}.pdf`;
				comDownload(res.data, '', name);
			}
			this.$refs.download.close();
		}
	},
	components: {
		ConfirmModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.new-table {
	/deep/ .ant-table-thead > tr > th {
		border-bottom: 0 !important;
	}
}
</style>
