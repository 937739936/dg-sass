<template>
	<div style="width: 100%">
		<a-button
			type="primary"
			@click="downAllElectronicContracts"
			style="float: right; margin-bottom: 15px; z-index: 10"
			>一键下载</a-button
		>
		<a-table
			rowKey="index"
			class="new-table"
			:columns="columns"
			:pagination="false"
			:dataSource="info.electronicContracts"
			:locale="{ emptyText: '暂无数据' }"
		>
			<template
				slot="operation"
				slot-scope="text, record"
			>
				<a
					v-if="record.path"
					@click="openPdf(record.path, record)"
					>查看</a
				>
				<a
					href="javascript:;"
					@click="contractDownload(record)"
					class="edit-btn"
					style="padding-left: 8px"
					v-if="record.path"
					>下载</a
				>
			</template>
		</a-table>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import {
	API_SteelsContractDownAll,
	API_SteelsElectronicContractDownloadAll,
	API_SteelsDownloadFilesPath
} from '@/v2/center/steels/api/contract.js';
export default {
	props: {
		info: {
			default: () => {}
		},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			columns: [
				{
					title: '文件类型',
					dataIndex: 'contractName',
					key: 'contractName',
					align: 'center'
				},
				{
					title: '编号',
					dataIndex: 'serialNumber',
					key: 'serialNumber',
					align: 'center'
				},
				{
					title: '签订时间',
					dataIndex: 'signTime',
					key: 'signTime',
					align: 'center'
				},
				{
					title: '操作',
					scopedSlots: {
						customRender: 'operation'
					},
					dataIndex: 'operation',
					align: 'center',
					fixed: 'right'
				}
			]
		};
	},
	methods: {
		async downAllElectronicContracts() {
			// 电子合同全部下载
			if (this.type == 'rest') {
				const res = await API_SteelsElectronicContractDownloadAll({ contractNo: this.info.contractNo });
				comDownload(
					res,
					undefined,
					this.info.contractNo + '-' + this.info.sellCompanyName + '-' + this.info.buyCompanyName + '.zip'
				);
			} else {
				this.$emit('downAllElectronicContracts');
			}
		},
		async openPdf(url, record) {
			if (this.type == 'rest') {
				window.open(url, '_blank');
			} else {
				this.$emit('openPdf', record);
			}
		},
		// 合同下载
		async contractDownload(record) {
			if (this.type == 'rest') {
				const fileFormat = record.path.split('?')[0].split('.').pop().toLowerCase();
				const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
				const flag = arr.includes(fileFormat);
				const res = await API_SteelsDownloadFilesPath({ filePath: record.path });
				const unit = flag ? fileFormat : 'pdf';
				comDownload(
					res,
					null,
					`${record.type}(${this.info.sellCompanyName}-${this.info.buyCompanyName})-${record.serialNumber}.${unit}`
				);
			} else {
				this.$emit('contractDownload', record);
			}
		}
	},
	components: {}
};
</script>
<style lang="less" scoped></style>
