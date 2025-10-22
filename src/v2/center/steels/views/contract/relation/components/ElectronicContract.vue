<template>
	<div>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="合同信息"
			>
				<div style="width: 100%">
					<a-descriptions
						title="基本信息"
						:column="2"
					>
						<a-descriptions-item label="合同编号">{{ contractData.contractNo }}</a-descriptions-item>
						<a-descriptions-item label="合同期限">
							{{ contractData.effectiveStartDate }} 至 {{ contractData.effectiveEndDate }}
						</a-descriptions-item>
						<a-descriptions-item label="卖方企业">{{ contractData.sellCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="买方企业">{{ contractData.buyCompanyName }}</a-descriptions-item>
						<a-descriptions-item label="合同总数量">{{ contractData.quantity }}吨</a-descriptions-item>
						<!-- <a-descriptions-item label="收货人">{{ contractData.downstreamCompanyName }}</a-descriptions-item> -->
						<a-descriptions-item label="运输方式">{{ contractData.transportModeDesc }}</a-descriptions-item>
					</a-descriptions>
					<a-descriptions
						title="银行账户信息"
						:column="2"
					>
						<a-descriptions-item label="卖方账号">
							{{ contractData.sellSubbranchName }}{{ contractData.sellBankAccountNo }}</a-descriptions-item
						>
						<a-descriptions-item label="买方账号">
							{{ contractData.buySubbranchName }}{{ contractData.buyBankAccountNo }}</a-descriptions-item
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
								<a @click="jumpToPage(record)">查看</a>
								<a
									@click="contractDownload(record)"
									href="javascript:;"
									class="edit-btn"
									style="padding-left: 8px"
									v-if="record.path"
									>下载</a
								>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
import { API_SteelsElectronicContractDownloadAll, API_SteelsDownloadFilesPath } from '@/v2/center/steels/api/contract.js';
import comDownload from '@sub/utils/comDownload.js';

const columns = [
	{ title: '附件名称', dataIndex: 'attachmentName' },
	{ title: '附件编号', dataIndex: 'attachmentNo' },
	{ title: '签订日期', dataIndex: 'signDate' },
	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
export default {
	name: 'ElectronicContract',
	props: ['contractData'],
	data() {
		return {
			columns
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
		// 合同下载
		async contractDownload(record) {
			const fileFormat = record.path.split('?')[0].split('.').pop().toLowerCase();
			const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			const flag = arr.includes(fileFormat);
			const res = await API_SteelsDownloadFilesPath({ filePath: record.path });
			const unit = flag ? fileFormat : 'pdf';
			comDownload(
				res,
				null,
				`${record.type}(${this.contractData.sellCompanyName}-${this.contractData.buyCompanyName})-${record.attachmentNo}.${unit}`
			);
		},
		batchDownload() {
			API_SteelsElectronicContractDownloadAll({ contractNo: this.contractData.contractNo }).then(res => {
				comDownload(
					res,
					undefined,
					this.contractData.contractNo + '-' + this.contractData.sellCompanyName + '-' + this.contractData.buyCompanyName + '.zip'
				);
			});
		}
	}
};
</script>
<style scoped>
.tab-title {
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding-bottom: 6px;
}
</style>
