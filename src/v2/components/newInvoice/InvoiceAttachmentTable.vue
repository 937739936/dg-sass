<template>
	<div class="sub-table-container">
		<div class="table-title">
			<div
				v-if="title"
				class="slTitleAssis"
			>
				{{ title }}
			</div>
		</div>
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="type"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<template
					slot="typeName"
					slot-scope="text, record"
				>
					<div class="type-name-column">
						<div class="type-name">
							<div class="required-mark">{{ record.isRequired ? '*' : '' }}</div>
							<span class="type-name-text"> {{ text }}</span>
						</div>
						<!-- 预留上传按钮-->
					</div>
				</template>
				<template
					slot="fileList"
					slot-scope="name, record"
				>
					<div class="file-names-column">
						<div
							v-for="(item, index) in record.fileList"
							:key="index"
							class="file-name"
						>
							<a-tooltip>
								<template
									v-if="item.uploadTime"
									slot="title"
								>{{ item.uploadTime }}</template>
								<span @click="filePreview(item)">{{ item.name }}</span>
							</a-tooltip>
						</div>
					</div>
				</template>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						class="download-Btn"
						@click="handleDownload(record)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import ImageViewer from '@sub/components/viewer/image.vue';
import { API_DOWNLPREVIEWTE, API_GETCURRENTENV } from "@/v2/center/assets/api/index.js";
import comDownload from '@sub/utils/comDownload.js';

export default {
	name: 'InvoiceAttachmentTable',
	props: {
		title: {
			type: String,
			default: ''
		},
		// // 数据源
		// dataSource: {
		// 	type: Array,
		// 	default: () => []
		// },
    detailData: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		ImageViewer
	},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	computed: {
    detailDataNotEmpty() {
      return this.detailData || {}
    },
    // 原发票信息
    invoiceVO() {
      return this.detailDataNotEmpty.invoiceVO || {}
    },
    // 原发票名称
    originInvoiceName() {
      let attachment = this.invoiceVO.attachment || ''
      const arr = attachment?.split('?')[0]?.split('/')
      if (arr.length === 0) {
        return ''
      }
      let name = arr.pop()
      return decodeURIComponent(name);
    },
    redInvoiceVO() {
      return this.detailDataNotEmpty.redInvoiceVO || {}
    },
    // 红冲发票名称
    redInvoiceName() {
      let attachment = this.redInvoiceVO.attachment?.split('?')[0] || ''
      const arr = attachment.split('/')
      if (arr.length === 0) {
        return ''
      }
      let name = arr[arr.length - 1]
      return decodeURIComponent(name);
    },
    dataSource() {
      let list = []
      if (this.originInvoiceName) {
        list.push({
          type: '原发票',
          typeName: '原发票',
          fileList: [{
            name: this.originInvoiceName,
            url: this.invoiceVO.attachment,
						uploadTime: this.invoiceVO.createTime,
          }]
        })
      }
      if (this.redInvoiceName) {
        list.push({
          type: '负数发票',
          typeName: '负数发票',
          fileList: [{
            name: this.redInvoiceName,
            url: this.redInvoiceVO.attachment,
						uploadTime: this.redInvoiceVO.createTime,
          }]
        })
      }
      return list;
    },
	},
	methods: {
		// 下载所有附件
		handleDownloadAll() {
			// this.attachmentList.push({ name: '38485959505.png' });
			this.$emit('downloadAttachment');
		},
		handleDownload(record) {
      if (record.fileList.length === 0) {
        return;
      }
      let file = record.fileList[0]
      let fileUrl = file.url || ''
      let fileName = file.name || ''
      API_DOWNLPREVIEWTE(API_GETCURRENTENV(fileUrl)).then(res => {
        comDownload(res, null, fileName);
      });
		},
		//查看附件
		filePreview(data) {
			this.$refs.imageViewer.showFile(data);
		}
	}
};

const columns = [
	{
		title: '单据类型',
		dataIndex: 'typeName',
		scopedSlots: { customRender: 'typeName' }, // 自定义序号列内容渲染
		width: 152
	},
	{
		title: '文件名称',
		dataIndex: 'fileList',
		scopedSlots: { customRender: 'fileList' } // 自定义序号列内容渲染
	},
	{
		key: 'action',
		title: '操作',
		scopedSlots: { customRender: 'action' }, // 自定义序号列内容渲染
		width: 90,
		fixed: 'right'
	}
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
  margin-bottom: 20px;
	.table-title {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.slTitleAssis {
			margin-top: 0;
		}
		.downloadAllBtn {
			color: #4682f3;
			background: #fff;
			border: 1px solid #4682f3;
			height: 28px;
			padding: 0 16px;
			margin-left: 20px;
			// width: 64px;
			span {
				display: inline-block;
				line-height: 28px;
				font-size: 14px;
			}
		}
	}
	.download-Btn {
		font-size: 14px;
		color: #4682f3;
		cursor: pointer;
	}
	.type-name-column {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		.type-name {
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			.type-name-text {
				flex: 1;
			}
			.required-mark {
				flex-shrink: 1;
				color: red;
				vertical-align: middle;
				width: 12px;
			}
		}
	}
	.file-names-column {
		display: inline-block;
		white-space: normal;
		color: #4682f3;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 14px; /* 100% */
		.file-name {
			display: inline-block;
			border-right: 1px solid #e9effc;
			padding: 0px 14px;
			line-height: 14px;
			padding-left: 0;
			margin: 6px 0;
			margin-right: 14px;
			cursor: pointer;
			&:first-child {
				padding-left: 0;
			}
			&:last-child {
				border: 0;
				// padding-left: 0;
			}
		}
	}
}
</style>
<style lang="less" scoped>
.sub-table-container {
	.new-table {
		margin-top: 20px;
		/deep/ .ant-table-tbody > tr:nth-child(2n) {
			background: #fff;
		}
		/deep/ .ant-table-thead > tr > th {
			padding: 10px 30px;
		}
		/deep/ .ant-table-tbody > tr > td {
			padding: 10px 30px;
			border-bottom: 1px solid #e5e6eb;
			border-left: 1px solid #e5e6eb;
		}
		/deep/ .ant-table-thead > tr > th:first-child {
			padding: 10px 20px;
		}
		/deep/ .ant-table-tbody > tr > td:first-child {
			padding: 4px 8px;
			border-left: none;
		}
		/deep/ .ant-table-fixed-right .ant-table-thead > tr > th {
			padding: 10px 10px;
			text-align: center;
		}
		/deep/ .ant-table-fixed-right .ant-table-tbody > tr > td {
			padding: 4px 10px;
			text-align: center;
		}
	}
}
</style>