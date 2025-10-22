<template>
	<div style="display: inline-block; width: 100%">
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="合同信息"
			>
				<div style="width: 100%">
					<a-descriptions
						title="基本信息"
						:column="2"
						v-if="contractType == 0"
					>
						<a-descriptions-item label="上游企业名称">{{ contractData.sellCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="社会统一信用代码">{{ contractData.sellCompanyUscc }}</a-descriptions-item>
						<a-descriptions-item label="上游纸质合同编号">{{ contractData.contractNo }}</a-descriptions-item>
						<a-descriptions-item label="合同签订状态">{{ contractData.contractSignStatus }}</a-descriptions-item>
						<a-descriptions-item label="合同总数量">{{ contractData.quantity }}吨</a-descriptions-item>
						<a-descriptions-item label="钢材种类">{{ contractData.steelTypeDesc }}</a-descriptions-item>
						<a-descriptions-item label="合同期限"
							>{{ contractData.effectiveStartDate }}~{{ contractData.effectiveEndDate }}</a-descriptions-item
						>
					</a-descriptions>
					<a-descriptions
						title="基本信息"
						:column="2"
						v-if="contractType == 1"
					>
						<a-descriptions-item label="下游企业名称">{{ contractData.buyCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="社会统一信用代码">{{ contractData.buyCompanyUscc }}</a-descriptions-item>
						<a-descriptions-item label="下游纸质合同编号">{{ contractData.contractNo }}</a-descriptions-item>
						<a-descriptions-item label="合同签订状态">{{ contractData.contractSignStatus }}</a-descriptions-item>
						<a-descriptions-item label="合同总数量">{{ contractData.quantity }}吨</a-descriptions-item>
						<a-descriptions-item label="运输方式">{{ contractData.transportModeDesc }}</a-descriptions-item>
						<a-descriptions-item label="合同期限"
							>{{ contractData.effectiveStartDate }}~{{ contractData.effectiveEndDate }}</a-descriptions-item
						>
					</a-descriptions>
				</div>
			</a-tab-pane>

			<a-tab-pane
				key="1"
				tab="合同附件"
			>
				<div style="width: 100%">
					<div
						class="tr mb16"
						v-if="contractData.contractAttachList && contractData.contractAttachList.length > 0"
					>
						<a-button
							type="primary"
							:ghost="true"
							@click="batchDownload()"
							>一键下载</a-button
						>
					</div>
					<a-table
						:pagination="false"
						:columns="columns"
						:data-source="contractData.contractAttachList"
						:scroll="{ x: true }"
						rowKey="path"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="preview(record)">查看</a>
								<a
									:href="record.path"
									target="_new"
									class="edit-btn"
									style="padding-left: 8px"
									download
									v-if="record.path"
									>下载</a
								>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_SteelsSupplementContractDownloadAll } from '@/v2/api/steels.js';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
const columns = [
	{ title: '附件名称', dataIndex: 'attachmentName' },
	{ title: '附件编号', dataIndex: 'attachmentNo' },
	{ title: '签订日期', dataIndex: 'signDate' },
	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];

export default {
	name: 'ContractContent',
	props: ['contractData', 'contractType'],
	components: {
		imageViewer
	},
	data() {
		return {
			columns,
		};
	},
	methods: {
		jumpToPage(record) {
			const { href } = this.$router.resolve({
				path: '/center/steels/contract/buy/serviceFeeAgreementPdf',
				query: {
					url: record.path
				}
			});
			window.open(href);
		},
		batchDownload() {
			API_SteelsSupplementContractDownloadAll({ contractId: this.contractData.contractId }).then(res => {
				comDownload(
					res,
					undefined,
					this.contractData.contractNo + '-' + this.contractData.sellCompanyName + '-' + this.contractData.buyCompanyName + '.zip'
				);
			});
		},
		// 预览
		preview(items) {
			let url = items.path
			filePreview(url, this.$refs.imageViewer.show);
		},
	}
};
</script>
<style lang="less" scoped>
::v-deep.ant-descriptions {
	padding: 0;
}
::v-deep.ant-descriptions .ant-descriptions-item:has(.ant-descriptions-item-content) {
	padding-bottom: 14px;
}
</style>
