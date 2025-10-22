<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<div
			class="title"
			style="font-size: 14px"
		>
			合同相关附件
		</div>
		<div class="tips">
			<p class="handle">
				<span
					>【线下合同】必须上传，只能上传一份PDF文件，或者图片(可多张)，单个附件大小不得超过100M；请上传已双签的合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息</span
				>
				<span
					v-show="!isSpread"
					class="btn"
					@click="isSpread = true"
					>展开
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-down.png"
						alt=""
					/>
				</span>
				<span
					v-show="isSpread"
					class="btn"
					@click="isSpread = false"
				>
					收起
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-up.png"
						alt=""
					/>
				</span>
			</p>
			<div
				v-show="isSpread"
				style="color: #000"
			>
				<p>【中标佐证】如果有中标佐证，请上传，可上传多份，请上传相关中标文件或截图，支持pdf和图片，单个附件大小不得超过100M</p>
				<p>【贸易背景合同】如果有贸易背景材料，请上传，可上传多份，支持pdf和图片，单个附件大小不得超过100M</p>
				<p v-if="!isBuyContract">
					【开票变更材料】如果合同中已约定发票购买方则无需上传附件；如未约定请提供开票变更函或其他证明文件，支持pdf和图片，单个附件大小不得超过100M。
				</p>
				<p>
					【合同签订现场材料】请拍摄并上传业务人员与公司门头和办公场所的合照，支持pdf，图片、视频，单个附件大小不得超过100M的文件
				</p>
			</div>
		</div>
		<a-table
			class="new-table"
			:columns="columns"
			:data-source="dataSource"
			:rowKey="(record, index) => record.id"
			style="margin-top: 30px; margin-bottom: 10px"
			:pagination="false"
		>
			<div
				slot="type"
				slot-scope="text, record"
				class="type"
			>
				<!-- 线下合同 -->
				<div
					v-if="record.type == 'OFFLINE_CONTRACT'"
					class="df"
				>
					<span class="red">*</span>
					<span>线下合同</span>
				</div>
				<!-- 中标佐证 -->
				<div v-if="record.type == 'BID_PROOF'">
					<span
						class="red"
						style="opacity: 0"
						>*</span
					>
					<span>中标佐证</span>
				</div>
				<div v-if="record.type == 'ASSET_TRADE_BACKGROUND_CONTRACT'">
					<span
						class="red"
						style="opacity: 0"
						>*</span
					>
					<span>贸易背景合同</span>
				</div>
				<div v-if="record.type == 'SCENE_SIGN_IMG'">
					<span class="red">*</span>
					<span>现场签订材料</span>
				</div>
				<div v-if="record.type == 'INFO_CHANGE_FILE'">
					<span
						class="red"
						style="opacity: 0"
						>*</span
					>
					<span>开票变更函</span>
				</div>
				<a-upload
					:headers="headers"
					:beforeUpload="beforeUpload"
					:accept="accept"
					:action="action"
					:multiple="true"
					:fileList="fileList"
					name="file"
				>
					<a-button
						type="primary"
						@click="upload(record.type)"
						class="upload"
						:disabled="beginUpload"
					>
						{{ beginUpload ? '上传中' : '上传' }}
					</a-button>
				</a-upload>
			</div>
			<div
				slot="fileList"
				slot-scope="text, record"
			>
				<div class="name-box">
					<div
						v-for="(item, index) in record.fileList"
						:key="index"
						class="name"
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
								@click="del(record, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
								v-if="editShowDelete || !item.typeName || item.type == 'OFFLINE_CONTRACT'"
							/>
						</a-tooltip>
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
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
import ENV from '@/v2/config/env';
import { mapGetters } from 'vuex';
import { commonUpload, API_UPLOAD_WATER_MARk } from 'api';
import moment from 'moment';
import { GetCurrentDate } from '@/v2/utils/factory';
import { customAlphabet } from 'nanoid';
import { ConfirmIcon } from '@sub/components/svg';
const nanoid = customAlphabet('1234567890', 4);

export default {
	props: {
		signWay: {
			default: ''
		},
		isBuyContract: {
			default: true
		},
		whetherSame: {
			default: ''
		}
	},
	data() {
		return {
			isSpread: false,
			columns,
			dataSource: [
				{ type: 'OFFLINE_CONTRACT', id: 'OFFLINE_CONTRACT', fileList: [], typeName: '线下合同' },
				{ type: 'BID_PROOF', id: 'BID_PROOF', fileList: [], typeName: '中标佐证' },
				{ type: 'ASSET_TRADE_BACKGROUND_CONTRACT', fileList: [], typeName: '贸易背景合同' }
			],
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: [],
			action: API_UPLOAD_WATER_MARk,
			editShowDelete: true
		};
	},
	mounted() {
		// 销售合同 编辑
		if (this.$route.query.id && this.$route.query.type === 'sell') {
			if (this.$route.query.whetherEditAllBoo === 'false' && !(this.$route.query.whetherHaveRelAuditBoo === 'true')) {
				// 只可上传新的附件
				this.editShowDelete = false;
			}
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},

		accept() {
			// 只能上传pdf 和图片
			if (this.type == 1) {
				return '.jpg,.png,.gif,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF';
			}
			if (this.type == 8) {
				return '.jpg,.png,.gif,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF';
			}
			if (this.type == 7) {
				return '.jpg,.png,.gif,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF';
			}
			return '.jpg,.png,.gif,.pdf,.mp4,.avi,.3gp,.mkv,.jpeg,.JPEG,.PNG,.JPG,.PDF';
		}
	},
	watch: {
		signWay(val) {
			if (val == 'SCENE_SIGN') {
				this.dataSource.push({
					type: 'SCENE_SIGN_IMG',
					id: 57,
					fileList: [],
					typeName: '合同现场签订材料'
				});
			} else {
				const item = this.dataSource.find(el => el.type == 'SCENE_SIGN_IMG');
				if (item) {
					this.dataSource.forEach((el, i, arr) => {
						if (el.type == 'SCENE_SIGN_IMG') {
							arr.splice(i, 1);
						}
					});
				}
			}
			this.$forceUpdate();
		},
		whetherSame(val) {
			if (val == 'DIFFERENT') {
				this.dataSource.push({
					type: 'INFO_CHANGE_FILE',
					id: nanoid(),
					fileList: [],
					typeName: '开票变更函'
				});
			} else {
				const item = this.dataSource.find(el => el.type == 'INFO_CHANGE_FILE');
				if (item) {
					this.dataSource.forEach((el, i, arr) => {
						if (el.type == 'INFO_CHANGE_FILE') {
							arr.splice(i, 1);
						}
					});
				}
			}
			this.$forceUpdate();
		},
		uploadFileList(val) {
			if (val.length) {
				const item = this.dataSource.find(el => el.type == this.type) || {};
				const list = item.fileList;

				const rule = '.jpg,.png,.gif,.jpeg,.JPEG,.PNG,.JPG';
				if (this.type == 'OFFLINE_CONTRACT') {
					let flag = true;
					// 如果上传的文件 有 pdf 同时 还有 图片
					if (val.length > 1) {
						flag = val.every(file => {
							const fileFormat = file.name.split('.').pop().toLowerCase();
							return rule.includes(fileFormat);
						});

						if (!flag) {
							this.$message.error('PDF和图片只允许上传一个格式，请重新选择');
							return;
						}

						flag = val.every(file => {
							const fileFormat = file.name.split('.').pop().toLowerCase();
							return fileFormat.includes('pdf');
						});
						if (flag) {
							this.$message.error('只允许上传一张pdf文件，请重新选择');
							return;
						}
						/** 如果已经存在pdf 并且上传的是图片*/
						flag = val.every(file => {
							const fileFormat = file.name.split('.').pop().toLowerCase();
							return rule.includes(fileFormat);
						});

						const isExistPdf = list.some(file => (file.fileName || file.name).includes('pdf'));
						if (isExistPdf && flag) {
							this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
							return;
						}
					}
					if (val.length == 1) {
						const fileName = val[0].name;
						const fileFormat = fileName.split('.').pop().toLowerCase();
						/** 如果已经存在pdf 并且上传的是图片*/
						const isExistPdf = list.some(file => (file.fileName || file.name).includes('pdf'));
						if (isExistPdf && fileFormat.includes('pdf')) {
							this.$message.error('只允许上传一张pdf文件，请重新选择');
							return;
						}

						if (isExistPdf && rule.includes(fileFormat)) {
							this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
							return;
						}
						const isExistPng = list.some(file => {
							const fileFormat = (file.fileName || file.name).split('.').pop().toLowerCase();
							return rule.includes(fileFormat);
						});

						// 如果已有图片 上传pdf
						if (isExistPng && fileFormat.includes('pdf')) {
							this.$message.error('PDF和图片只允许上传一个格式，如上传错误，请删除后重新上传');
							return;
						}
					}
				}

				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	methods: {
		init(info) {
			// 线下合同
			const contractAttachment = info.contractAttachment || [];
			this.$nextTick(() => {
				contractAttachment.forEach(el => {
					el.name = el.fileName;
					el.url = el.fileUrl;
					const item = this.dataSource.find(el2 => el2.type == el.type);
					if (item) {
						item.fileList.push(el);
					}
				});
			});
		},
		//上传前校验
		beforeUpload(file) {
			// let fileType = this.fileType;
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			// 获取当前上传的单据类型

			let isAllowFormat = false;
			if (!flag) {
				this.$message.error('当前文件格式不支持');
				return;
			}

			// 只能上传一份PDF文件，或者图片（可多张）

			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return true;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return true;
			}
			this.uploadFileList.push(file);
			return false;
		},
		// 1.上传
		async handleUpload(file, t) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			try {
				const res = await commonUpload(formData);

				const obj = res.data;

				const item = this.dataSource.find(el => el.type == this.type) || {};
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
				obj.name = obj.fileName;

				obj.url = obj.fileUrl;
				item.fileList.push(obj);

				this.$forceUpdate();
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		fileChange(info) {},
		save() {
			if (this.signWay == 'SCENE_SIGN') {
				const item = this.dataSource.find(el => el.type == 'SCENE_SIGN_IMG') || { fileList: [] };
				if (!item.fileList.length) {
					this.$message.error('请上传现场签订材料');
					return false;
				}
			}
			if (!this.dataSource[0].fileList.length) {
				this.$message.error('请上传线下合同');
				return false;
			}

			// 现场签订的材料
			let fileInfoList = [];

			// 其他的材料
			let otherFileInfoList = [];
			// 发票变更
			let invoiceFileInfoList = [];

			this.dataSource.forEach(el => {
				el.fileList.forEach(el2 => {
					if (el.type == 'SCENE_SIGN_IMG') {
						fileInfoList.push({ ...el2, ...el });
					} else if (el.type == 'INFO_CHANGE_FILE') {
						invoiceFileInfoList.push({ ...el2, ...el });
					} else {
						otherFileInfoList.push({ ...el2, ...el });
					}
				});
			});
			return {
				otherFileInfoList,
				fileInfoList,
				invoiceFileInfoList
			};
		},
		// 上传的附件类型
		upload(type) {
			this.uploadFileList = [];
			this.type = type;
		},
		del(item, index) {
			this.delVisible = true;
			this.currentIndex = index;
			this.currentItem = item;
		},
		saveDel() {
			const item = this.dataSource.find(el => el.type == this.currentItem.type) || {};
			const list = item.fileList || [];
			list.forEach((el, index, arr) => {
				if (index == this.currentIndex) {
					arr.splice(index, 1);
				}
			});
			this.$forceUpdate();
			this.delVisible = false;
		},
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
		}
	},
	components: {
		ConfirmIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	position: relative;
	.title {
		margin-top: 20px;
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
		margin-right: 5px;
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
	vertical-align: sub;
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
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
}
.loading {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	z-index: 999;
}
</style>
