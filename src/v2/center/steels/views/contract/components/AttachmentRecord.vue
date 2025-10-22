<template>
	<div
		style="width: 100%"
		class="new-detail"
	>
		<div class="new-detail-content detail-form">
			<h2>
				附件信息<a-button
					style="margin-left: 20px"
					type="primary"
					:ghost="true"
					@click="downAll"
					>全部下载</a-button
				>
			</h2>
		</div>
		<a-table
			rowKey="id"
			:columns="fileColumns"
			:pagination="false"
			class="new-table"
			:dataSource="info.attachList"
			:locale="{ emptyText: '暂无数据' }"
			:scroll="{ x: true }"
		>
			<span
				slot="operation"
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="contractDownload(record)"
					>下载</a
				>
			</span>
		</a-table>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_SteelsDownloadFilesPath, API_SteelsContractDownAll } from '@/v2/center/steels/api/contract.js';
export default {
	props: {
		info: {
			default: () => {}
		}
	},
	data() {
		return {
			fileColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type' },
				{ title: '文件来源', dataIndex: 'source', key: 'source' },
				{ title: '文件名', dataIndex: 'name', key: 'name' },
				{ title: '操作', scopedSlots: { customRender: 'operation' }, dataIndex: 'operation' }
			]
		};
	},
	methods: {
		// 合同下载
		async contractDownload(record) {
			const fileFormat = record.path.split('?')[0].split('.').pop().toLowerCase();
			const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			const flag = arr.includes(fileFormat);
			const res = await API_SteelsDownloadFilesPath({ filePath: record.path });
			const unit = flag ? fileFormat : 'pdf';
			comDownload(res, null, `${record.type}(${this.info.sellCompanyName}-${this.info.buyCompanyName}).${unit}`);
		},
		async downAll() {
			// 附件信息全部下载
			const res = await API_SteelsContractDownAll({ contractId: this.info.id });
			comDownload(res, undefined, '附件信息.zip');
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
