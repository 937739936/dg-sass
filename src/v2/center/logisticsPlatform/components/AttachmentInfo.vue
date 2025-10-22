<template>
	<div>
		<a-table
			class="new-table"
			bordered
			:columns="columnsFile"
			:rowKey="record => record.id"
			:dataSource="datasource"
			:pagination="false"
			:scroll="{ x: false }"
		>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a-space>
					<a @click="handlePreview(record)">查看附件</a>
					<a @click="viewsDetail(record)">详情</a>
				</a-space>
			</template>
		</a-table>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<TrackScaleReport ref="trackScaleReport" />
		<RightConfirmLetter ref="rightConfirmLetter" />
		<RightChange ref="rightChange" />
		<ShipmentWorks ref="shipmentWorks" />
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/center/trade/api/contract';
import { getExtraAttachmentData } from '../api';
import TrackScaleReport from './TrackScaleReport.vue';
import RightConfirmLetter from './RightConfirmLetter.vue';
import RightChange from './RightChange.vue';
import ShipmentWorks from './ShipmentWorks.vue';
import ImageViewer from '@sub/components/viewer/image.vue';

import ENV from '@/v2/config/env';
export default {
	name: 'AttachmentInfo',
	data() {
		return {
			columnsFile: [
				{
					title: '单据类型',
					dataIndex: 'fileTypeText',
					align: 'center'
				},
				{
					title: '文件名',
					dataIndex: 'name',
					align: 'center'
				},
				{
					title: '操作',
					dataIndex: 'action',
					align: 'center',
					scopedSlots: { customRender: 'action' }
				}
			],
			previewImg: '',
			data: {}
		};
	},
	components: {
		TrackScaleReport,
		RightConfirmLetter,
		RightChange,
		ShipmentWorks,
		ImageViewer
	},
	props: ['datasource'],
	async created() {},
	methods: {
		handlePreview(data) {
			let url = data.path;
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
			this.$refs.imageViewer.showFile(url);
		},
		viewsDetail(record) {
			// 轨道衡报告
			getExtraAttachmentData({
				id: record.id
			}).then(res => {
				if (res.success) {
					if (res.data.records) {
						this.data = res.data.records;
						let fileType = record.fileType;
						switch (fileType) {
							case 'TRACK_SCALE_REPORT':
								this.$refs.trackScaleReport.init(this.data);
								break;
							case 'CONFIRM_LETTER_REPORT':
								this.$refs.rightConfirmLetter.init(this.data);
								break;
							case 'CHANGER_ORDER_REPORT':
								this.$refs.rightChange.init(this.data);
								break;
							case 'SHIPMENT_ORDER_REPORT':
								this.$refs.shipmentWorks.init(this.data);
								break;
						}
					} else {
						this.$message.error(res.data.mssage);
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
