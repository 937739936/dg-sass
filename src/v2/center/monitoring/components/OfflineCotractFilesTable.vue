<template>
	<div>
		<a-table
			bordered
			v-if="table_contractAttachment.length || (!table_contractAttachment.length && !table_supplementalInfo.length)"
			:columns="columnsFile"
			:rowKey="record => record.id"
			:dataSource="table_contractAttachment"
			:pagination="false"
			:scroll="{ x: false }"
		>
			<template
				slot="fileName"
				slot-scope="text, record"
			>
				<a @click="handlePreview(record)">{{ text }}</a>
			</template>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a-space>
					<a @click="handlePreview(record)">查看</a>
				</a-space>
			</template>
		</a-table>
		<!-- 补充协议附件 -->
		<a-table
			v-if="table_supplementalInfo.length"
			bordered
			:dataSource="table_supplementalInfo"
			:columns="supplementalColumns"
			:rowKey="record => record.index"
			:pagination="false"
			:scroll="{ x: true }"
			style="margin-top: 20px"
		>
			<template
				slot="executionDate"
				slot-scope="text, record"
			>
				{{ record.executionDateStart }}
				<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
			</template>
			<template
				slot="fileName"
				slot-scope="text, record"
			>
				<a
					v-for="(item, index) in record.supplementalFile"
					:key="index"
					class="edit-btn"
					@click.prevent="handlePreview(item)"
				>
					{{ item.name }}
					<span v-if="index < record.supplementalFile.length - 1">,</span>
				</a>
			</template>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a-space>
					<a @click="handlePreview(record)">查看</a>
				</a-space>
			</template>
		</a-table>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_GetDownloadRAR } from '@/v2/center/trade/api/contract';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
export default {
	name: 'OfflineCotractFilesTable',
	data() {
		return {
			columnsFile: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeNameRowSpan
							}
						};
					}
				},
				{
					title: '文件名',
					dataIndex: 'fileName',
					align: 'center',
					scopedSlots: { customRender: 'fileName' }
				},
				{
					title: '上传时间',
					key: 'uploadTime',
					dataIndex: 'uploadTime',
					align: 'center'
				}
			],
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo?.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItemDesc',
					align: 'center'
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatusDesc',
					align: 'center'
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '文件名',
					dataIndex: 'fileName',
					align: 'center',
					scopedSlots: { customRender: 'fileName' }
				},
				{
					title: '上传时间',
					dataIndex: 'uploadTime',
					align: 'center'
				}
			],
			previewImg: '',
			table_contractAttachment: [],
			table_supplementalInfo: []
		};
	},
	props: ['contractAttachment', 'supplementalInfo'],
	watch: {
		contractAttachment: function (data) {
			this.table_contractAttachment = TableRowSpanFunc(data || [], 'typeName');
		},
		supplementalInfo: function (data) {
			this.table_supplementalInfo = data || [];
		}
	},
	async created() {},
	methods: {
		// 预览
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			filePreview(url, this.$refs.imageViewer.show);
		}
	},
	components: {
		imageViewer
	}
};
</script>

<style></style>
