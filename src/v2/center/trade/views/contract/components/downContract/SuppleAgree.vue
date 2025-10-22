<template>
	<div class="attachment">
		<div
			class="title"
			style="font-size: 14px"
			v-if="handleType != 'detail'"
		>
			补充协议
		</div>
		<div
			class="tips"
			v-if="handleType != 'detail'"
			style="margin-bottom: 30px"
		>
			<p class="handle">
				<span
					>【补充协议】如果该合同签署了多个补协，请分开上传，一个补协只能上传一个pdf，或者图片(可多张)，补协需要双签，未双签的补协请不要上传；单个附件大小不得超过100M
				</span>
			</p>
		</div>
		<a-table
			class="new-table bordered"
			:columns="columns"
			bordered
			:data-source="dataSource"
			:rowKey="(record, index) => index"
			:pagination="false"
		>
			<div
				slot="fileList"
				slot-scope="text, record, index"
			>
				<div class="name-box">
					<div
						v-for="(item, i) in record.fileList"
						:key="i"
						class="name"
						:class="{ detail: handleType == 'detail' }"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.uploadTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName }}</span
							>
							<img
								class="del"
								v-if="handleType != 'detail'"
								@click="del(record, i, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
							/>
						</a-tooltip>
					</div>
				</div>
			</div>

			<div
				slot="remark"
				slot-scope="text, record, index"
			>
				<div v-show="record.signDate">
					<p class="remark-item">
						<span class="remark-top">补协编号：</span>
						<span>{{ record.paperSupplementalAgreementNo }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协签订日期：</span>
						<span>{{ record.signDate }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协签章状态：</span>
						<span>{{ record.signStatus == 2 ? '双签' : '单签' }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协执行日期：</span>
						<span>{{ record.executionDateStart }} 至 {{ record.executionDateEnd }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">变更项目信息：</span>
						<span>
							<span
								v-for="(item, i) in record.changeItem"
								:key="i"
								>{{ item.text }} {{ i == record.changeItem.length - 1 ? '' : '、' }}</span
							></span
						>
					</p>
				</div>
			</div>
			<div
				slot="action"
				slot-scope="text, record, index"
			>
				<div class="btn-box">
					<div v-if="handleType != 'detail'">
						<template v-if="!(record.supplementalAgreementStatus === 'EXECUTING' && record.signStatus === 2)">
							<a
								href="javascript:;"
								v-if="record.fileList && record.fileList.length"
								@click="edit(record, index)"
								>编辑</a
							>
							<a
								href="javascript:;"
								style="margin-left: 10px"
								@click="delDataSource(index)"
								>删除</a
							>
						</template>
					</div>
					<div v-else>
						<a
							href="javascript:;"
							@click="edit(record, index)"
							>查看</a
						>
						<a
							href="javascript:;"
							style="margin-left: 10px"
							@click="download(record)"
							>下载</a
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
			<div class="tip">确认要删除该附件吗，删除后无法恢复</div>
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
		<UploadSuppleAgree
			ref="upload"
			@send="updateDataSource"
			:handleType="handleType"
		></UploadSuppleAgree>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import { API_UPLOAD_WATER_MARk } from 'api';
import { downloadSingleFile } from '@/v2/center/trade/api/downcontract';

import UploadSuppleAgree from './UploadSuppleAgree.vue';
import { ConfirmIcon } from '@sub/components/svg';
export default {
	props: {
		signWay: {
			default: ''
		},
		handleType: {
			default: ''
		}
	},
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
				{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
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
	watch: {},
	methods: {
		init(info) {
			this.detailInfo = info;
			const supplementalInfo = info.supplementalInfo || [];

			supplementalInfo.forEach(el => {
				let changeItemList = [];
				let changeItem = (el.changeItem && el.changeItem.split(',')) || [];

				let changeItemDesc = (el.changeItemDesc && el.changeItemDesc.split(',')) || [];

				changeItem.forEach((el2, i) => {
					changeItemList.push({ value: el2, text: changeItemDesc[i] });
				});

				el.executeDate = [el.executionDateStart, el.executionDateEnd];
				el.supplementalFile = el.supplementalFile || [];
				el.supplementalFile.forEach(el2 => {
					el2.realUrl = `${el2.url}`;
					el2.fileName = el2.name;
				});
				el.changeItem = changeItemList;

				el.fileList = el.supplementalFile;
			});

			if (supplementalInfo.length) {
				this.dataSource = supplementalInfo;
			} else {
				if (this.handleType != 'detail') {
					this.dataSource = [{}];
				} else {
					this.dataSource = [];
				}
			}
		},
		// 上传的附件类型
		upload(type) {
			this.uploadFileList = [];
			this.type = type;
		},
		del(item, index, parIndex) {
			this.delType = 'file';
			this.delVisible = true;
			this.currentIndex = index;
			this.parIndex = parIndex;
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
				const list = item.fileList || [];
				list.forEach((el, index, arr) => {
					if (index == this.currentIndex) {
						arr.splice(index, 1);
					}
				});
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
					<span>补充协议</span>
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
			this.$refs.upload.editOpen(item, index);
		},
		updateDataSource(obj, type) {
			if (type == 'edit') {
				this.dataSource[this.editIndex] = {
					...this.dataSource[this.editIndex],
					...obj
				};
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
		async download(item) {
			const params = {
				id: this.detailInfo.id,
				terminalSupplementalAgreementNo: item.serialNo
			};
			const res = await downloadSingleFile(params);
			comDownload(res.data, null, res.name);
		},

		save() {
			const newList = JSON.parse(JSON.stringify(this.dataSource));

			const item = newList[0];

			if (JSON.stringify(item) == '{}') {
				// this.$message.error('请上传补充协议')
				return [];
			}

			const list = [];

			this.dataSource.forEach(el => {
				el.type = 'BCXY';
				el.key = 'BCXY';
				el.typeName = '补充协议';

				el.fileList.forEach(el2 => {
					el2.name = el2.fileName;
					el2.type = 'BCXY';
					el2.key = 'BCXY';
					el2.attachId = el2.attachId || '';
					el2.typeName = '补充协议';
				});
				const obj = {
					supplementalFile: el.fileList,
					...el,
					changeItem: el.changeItem.map(el3 => el3.value).join(',')
				};
				delete obj.executeDate;
				delete obj.fileList;
				list.push(obj);
			});
			const flag = list.some(el => !el.supplementalFile.length);
			if (flag) {
				this.$message.error('请上传补充协议文件');
				return false;
			}

			return list;
		}
	},
	components: {
		UploadSuppleAgree,
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
		color: @primary-color;
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
		color: @primary-color;
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
	color: @primary-color;
	background: #fff;
	border: 1px solid @primary-color;
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
