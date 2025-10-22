<template>
	<div class="attachment">
		<div
			class="tips"
			v-if="handleType != 'detail'"
			style="margin-bottom: 30px"
		>
			<p class="handle">
				<span
					>【保证金支付凭证】若有多个凭证附件，请分开上传，一个支付凭证附件只能上传一个pdf，或者一张图片，单个附件大小不得超过100M
				</span>
			</p>
		</div>
		<a-table
			class="new-table"
			:columns="columns"
			bordered
			:data-source="dataSource"
			:rowKey="(record, index) => index"
			:pagination="false"
		>
			<div
				slot="fileInfo"
				slot-scope="text, i, index"
			>
				<div
					class="name-box"
					v-if="text"
				>
					<div class="name">
						<a-tooltip>
							<template
								slot="title"
								v-if="text.uploadTime"
							>
								<span>上传时间：{{ text.uploadTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(text)"
							>
								{{ text.name }}</span
							>
							<img
								class="del"
								v-if="handleType != 'detail' && text.name"
								@click="del(text, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
							/>
						</a-tooltip>
					</div>
				</div>
			</div>

			<div
				slot="remark"
				slot-scope="text, record"
			>
				<div v-if="record.paymentDate">
					<p class="remark-item">
						<span class="remark-top">付款日期：</span>
						<span>{{ record.paymentDate }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">付款人户名：</span>
						<span>{{ record.paymentCompanyName }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">付款人账号：</span>
						<span>{{ record.paymentAccountNo }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">付款人开户行：</span>
						<span>{{ record.paymentBankName }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">收款金额：</span>
						<span>{{ record.collectionAmount }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">收款人户名：</span>
						<span>{{ record.collectionCompanyName }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">收款人账号：</span>
						<span>{{ record.collectionAccountNo }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">收款人开户行：</span>
						<span>{{ record.collectionBankName }}</span>
					</p>
				</div>
			</div>
			<div
				slot="action"
				slot-scope="text, record, index"
			>
				<div class="btn-box">
					<div v-if="handleType != 'detail'">
						<a
							href="javascript:;"
							v-if="record.paymentDate"
							@click="edit(record, index)"
							>编辑</a
						>
						<a
							href="javascript:;"
							v-if="record.paymentDate"
							style="margin-left: 10px"
							@click="delDataSource(index)"
							>删除</a
						>
					</div>
					<div v-else>
						<a
							href="javascript:;"
							@click="edit(record, index)"
							>查看</a
						>
					</div>
				</div>
			</div>
		</a-table>
		<a-modal
			class="del-modal slModal"
			:visible="delVisible"
			:width="460"
			@cancel="delVisible = false"
			title=""
		>
			<div class="title-box">
				<ConfirmIcon></ConfirmIcon>
				<span class="title">确认删除</span>
			</div>
			<div class="tip">确认要删除该{{ this.delType === 'file' ? '附件' : '凭证' }}吗，删除后无法恢复</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="delVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="saveDel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<DepositPaymentUpload
			ref="upload"
			@send="updateDataSource"
			:handleType="handleType"
			:orderDetail="orderDetail"
			:businessLineFullId="businessLineFullId"
			:fileTypeInfo="fileTypeInfo"
		></DepositPaymentUpload>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import { API_UPLOAD_WATER_MARk } from 'api';
import DepositPaymentUpload from './DepositPaymentUpload.vue';
import { ConfirmIcon } from '@sub/components/svg';
export default {
	data() {
		return {
			isSpread: false,
			columns: [
				{
					title: '单据类型',
					dataIndex: 'typeName',
					scopedSlots: { customRender: 'typeName' },
					width: 210,
					customRender: (text, row, index) => {
						const obj = {
							children: this.renderText(),
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.dataSource.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{ title: '文件名称', dataIndex: 'fileInfo', scopedSlots: { customRender: 'fileInfo' } },
				{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 394 },
				{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 120 }
			],
			dataSource: [{}],
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			// 父级
			parIndex: 0,
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: [],
			action: API_UPLOAD_WATER_MARk,
			openFileDialogOnClick: false,
			// 删除类型
			delType: 'file',
			editIndex: 0,
			detailInfo: {}
		};
	},
	computed: {},
	props: {
		handleType: {
			default: ''
		},
		orderDetail: {
			type: [Object],
			default: () => ({})
		},
		businessLineFullId: {
			default: ''
		},
		fileTypeInfo: {
			type: [Object],
			default: () => ({})
		},
		fileData: {
			type: [Array],
			default: () => []
		}
	},
	watch: {
		fileData: function (data) {
			this.dataSource = data;
		}
	},
	mounted() {
		this.dataSource = this.fileData;
	},
	methods: {
		// 上传的附件类型
		upload(type) {
			this.uploadFileList = [];
			this.type = type;
		},
		del(item, index) {
			this.delType = 'file';
			this.delVisible = true;
			this.currentIndex = index;
			this.parIndex = index;
			this.currentItem = item;
		},
		delDataSource(index) {
			this.delVisible = true;
			this.currentIndex = index;
			this.delType = 'dataSource';
		},
		saveDel() {
			if (this.delType == 'file') {
				const item = this.dataSource[this.parIndex] || {};
				item.fileList = [];
				item.fileInfo = null;
			} else {
				if (this.currentIndex === 0 && this.dataSource.length == 1) {
					this.dataSource = [{}];
				} else {
					this.dataSource.forEach((el, i, arr) => {
						if (i == this.currentIndex) {
							arr.splice(i, 1);
						}
					});
				}
			}
			this.$forceUpdate();

			this.delVisible = false;
		},
		renderText() {
			return (
				<div class="type">
					<span>保证金支付凭证</span>
					{this.handleType != 'detail' ? (
						<a-button
							type="primary"
							class="upload"
							onClick={this.open}
						>
							{' '}
							上传{' '}
						</a-button>
					) : (
						''
					)}
				</div>
			);
		},
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1 || this.previewImg.indexOf('.PDF') != -1) {
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
		open() {
			this.$refs.upload.open();
		},
		edit(item, index) {
			this.editIndex = index;
			if (!item.fileList) {
				item.fileList = item.fileInfo ? [item.fileInfo] : [];
			}
			this.$refs.upload.editOpen(item, index);
		},
		updateDataSource(obj, type) {
			if (type == 'edit') {
				this.dataSource[this.editIndex] = obj;
			} else {
				const item = this.dataSource[0];
				if (JSON.stringify(item) == '{}') {
					this.dataSource[0] = obj;
				} else {
					this.dataSource.push(obj);
				}
			}
			this.$forceUpdate();
		},
		save() {
			return this.dataSource;
		}
	},
	components: {
		DepositPaymentUpload,
		ConfirmIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	.title {
		margin-top: 30px;
		margin-bottom: 16px;
		color: #77889d;
	}
	.tips {
		padding: 10px 12px;
		background: #e1eafe;
		border: 1px solid #d0dfff;
		border-radius: 4px;
		font-size: 12px;
		line-height: 22px;
		position: relative;
	}
	.handle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000;
	}
	.btn {
		color: #4682f3;
		cursor: pointer;
	}
	.red {
		color: red;
		vertical-align: middle;
	}
	.df {
		display: flex;
		align-items: center;
	}
	.name-box {
		display: flex;
		flex-wrap: wrap;
	}
	.name {
		background: #f3f5f6;
		border-radius: 4px;
		padding: 6px;
		display: flex;
		align-items: center;
		color: #4682f3;
		margin-right: 14px;
		margin-bottom: 10px;
	}
	.detail {
		background: #fff;
		.preview {
			cursor: pointer;
			padding-right: 14px;
			padding-left: 14px;
			border-left: 1px solid #e9effc;
		}
		.preview:first-child {
			padding-left: 0;
			border-left: 0;
		}
	}
	.del {
		width: 14px;
		cursor: pointer;
		margin-left: 8px;
	}
}
.title-box {
	display: flex;
	align-items: center;
	.icon {
		color: #4682f3;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 5px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
	margin-top: 20px;
}
.icon {
	width: 16px;
	height: 16px;
	img {
		width: 16px;
		height: 16px;
	}
}
.upload {
	color: #4682f3;
	background: #fff;
	border: 1px solid #4682f3;
	height: 24px;
	width: 64px;
}
.type {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.preview {
	cursor: pointer;
}
/deep/ .ant-modal-body {
	padding-top: 30px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.new-table {
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr:first-child > td:first-child {
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr > td:last-child {
		border-right: none;
	}
	/deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
		background: #fff !important;
	}
}
.remark-item {
	color: #77889d;
	font-size: 14px;
	line-height: 22px;
}
.btn-box {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
