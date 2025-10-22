<template>
	<div class="attachment">
		<div>
			<a-spin
				tip="上传中..."
				v-if="beginUpload"
				class="loading"
			/>
			<div class="tip-box">
				<p>
					<span class="tip-title">说明</span
					>：可支持格式为jpg，jpeg，png，bmp，pdf的附件，支持多张，单个附件大小不得超过100M的文件
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
				style="padding-top: 8px"
			>
				<div>
					<span v-if="record.type == 'OTHER_PROFIT_LOSS_TICKET'"> 超亏吨凭证</span>
				</div>
				<a-upload
					:headers="headers"
					:beforeUpload="beforeUpload"
					:action="action"
					:multiple="true"
					:accept="accept"
					:fileList="fileList"
					name="file"
				>
					<a-button
						type="primary"
						@click="getMouseInfo(record)"
						class="upload"
						:disabled="beginUpload"
					>
						上传
					</a-button>
				</a-upload>
			</div>
			<div
				slot="fileList"
				slot-scope="text, record"
			>
				<div class="name-box">
					<div
						v-for="(item, index) in record.list"
						:key="index"
						class="name"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.createdDate }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.name }}</span
							>
							<img
								class="del"
								@click="del(record, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
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
				<img
					src="@sub/assets/imgs/trade/warning.png"
					style="width: 20px"
					alt=""
				/>
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
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
const acceptStr = '.jpg,.jpeg,.png,.pdf,.JPEG,.PNG,.JPG,.PDF,.bmp';
import { mapGetters } from 'vuex';
import { commonUpload, API_UPLOAD_STATION } from '@/v2/api';
import moment from 'moment';
import ImageViewer from '@sub/components/viewer/image.vue';
export default {
	props: ['transportMode', 'handleType', 'isCoreCompany', 'isManager'],
	data() {
		return {
			columns,
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			uploadItem: {},
			type: null,
			uploadFileList: [],
			action: API_UPLOAD_STATION,
			editShowDelete: true,
			dataSource: [
				{
					type: 'OTHER_PROFIT_LOSS_TICKET',
					title: '超亏吨凭证',
					require: false,
					list: [],
					accept: acceptStr,
					acceptTip: 'jpg，jpeg，png，bmp，pdf'
				}
			],
			detailInfo: {},
			isSpread: true
		};
	},
	mounted() {},
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
			return this.uploadItem.accept;
		},
		isSpreadList() {
			const item = this.dataSource[0];
			return [item];
		}
	},
	watch: {
		uploadFileList(val) {
			if (val.length) {
				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	methods: {
		init(info) {
			this.detailInfo = info;
			info.attachmentList.forEach(el => {
				const item = this.dataSource.find(el2 => el2.type == el.fileType) || { list: [] };
				item.list.push(el);
			});
		},
		//上传前校验
		beforeUpload(file) {
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			// 获取当前上传的单据类型
			if (!flag) {
				this.$message.error(`仅支持上传${this.accept}格式的附件`);
				this.uploadFileList = [];
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
				const item = this.dataSource.find(el => el.type == this.uploadItem.type);
				obj.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
				obj.fileType = item.type;
				item.list.push(obj);
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
			if (this.isManager) {
				return this.dataSource;
			}
			/** 判断 当前附件 是不是需要上传 */
			const flag = this.dataSource.some(el => el.require && !el.list.length);
			const item = this.dataSource.find(el => el.require && !el.list.length);
			if (flag) {
				this.$message.error(`请上传${item.title}`);
				return;
			}
			return this.dataSource;
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
			const list = item.list || [];
			list.forEach((el, index, arr) => {
				if (index == this.currentIndex) {
					arr.splice(index, 1);
				}
			});
			this.$forceUpdate();
			this.delVisible = false;
		},
		handlePreview(data) {
			let url = data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		handlePreview(data) {
			let url = data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		getMouseInfo(info) {
			this.uploadFileList = [];
			this.uploadItem = info;
		}
	},
	components: {
		ImageViewer
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
		color: @primary-color;
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
		margin-top: 8px;
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
		padding-top: 0;
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
.red {
	color: red;
	margin-right: 4px;
}
.opt {
	opacity: 0;
}
.tip-box {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	color: rgba(0, 0, 0, 0.8);
	font-size: 12px;
	line-height: 22px;
	margin-top: 20px;
	position: relative;
	overflow: hidden;
	.spread-box {
		position: absolute;
		right: 10px;
		top: 10px;
	}
	.tip-title {
		font-weight: 600;
	}
}
.spread {
	height: inherit;
}
.no-spread {
	height: 38px;
}
.no-data {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	color: var(--character-disabled-placeholder-25, rgba(0, 0, 0, 0.25));
	text-align: center;
	font-family: Roboto;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 27.5px; /* 196.429% */
	margin-top: 50px;
}
</style>
