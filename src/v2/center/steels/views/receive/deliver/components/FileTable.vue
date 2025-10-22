<template>
	<div>
		<div>
			<div class="sub-title">
				<span
					v-for="item in addType"
					@click="setNowFileType(item)"
					:key="item.label"
				>
					<a-upload
						v-if="!disabled"
						name="file"
						:multiple="true"
						:action="action"
						style="margin-right: 20px"
						:headers="headers"
						:fileList="fileList"
						:showUploadList="false"
						:beforeUpload="beforeUpload"
						@change="fileChange"
					>
						<template v-if="item.tooltip">
							<a-space>
								<a-button
									:disabled="beginUpload"
									:type="item.required ? 'primary' : 'default'"
									:ghost="item.required"
								>
									<span>上传{{ item.label }}</span>
								</a-button>
								<a-tooltip>
									<template #title>{{ item.tooltip }}</template>
									<i
										class="iconfont icon-liebiaobiaotou-shuoming"
										style="font-size: 12px"
									></i>
								</a-tooltip>
							</a-space>
						</template>
						<template v-else>
							<a-button
								:disabled="beginUpload"
								:type="item.required ? 'primary' : 'default'"
								:ghost="item.required"
							>
								<span>上传{{ item.label }}</span>
							</a-button>
						</template>
					</a-upload>
				</span>
			</div>
		</div>
		<div
			class="tableTip"
			v-if="!disabled"
		>
			可支持上传{{ allowFormatString }}的附件，单个附件大小不超过100M的文件;
			<span
				v-for="(item, index) in requireTipArr"
				:key="index"
			>
				{{ item }};
			</span>
		</div>
		<!-- 附件表格 -->
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table-file"
				:bordered="false"
				:rowKey="(record, index) => String(index)"
				:dataSource="fileData"
				:pagination="false"
				:loading="beginUpload"
			>
				<a-space
					slot="typeName"
					slot-scope="action, items"
				>
					{{ action || items.typeDesc }}
				</a-space>
				<a-space
					slot="name"
					slot-scope="action, items"
				>
					<a
						href="javascript:void(0)"
						@click="fileLook(items)"
						>{{ action }}</a
					>
				</a-space>
				<a-space
					slot="action"
					slot-scope="action, items"
				>
					<a-popconfirm
						title="确定删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => toDelete(items)"
						v-if="!disabled"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							>删除</a
						>
					</a-popconfirm>
					<a
						href="javascript:void(0)"
						v-if="disabled"
						@click="download(items)"
					>
						下载
					</a>
				</a-space>
				<slot name="tableAction"></slot>
			</a-table>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_GetDownloadRAR, API_DOWNLPREVIEWTE } from '@/v2/api/upload';
import { API_SteelsUploadFileWaterMark } from '@/v2/center/steels/api';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';
//不同模块允许不同的类型文件
const fileTypeList = {
	fileDefault: ['jpg', 'jpeg', 'png', 'bmp', 'pdf'],
	fileType24: ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'xlsx', 'xls'],
	fileType27: ['jpg', 'jpeg', 'png', 'bmp', 'pdf', 'xlsx', 'xls']
};
export default {
	components: {
		ImageViewer
	},
	props: {
		// 上传的附件种类
		addType: {
			type: Array,
			default: () => {
				return [];
			}
		},
		fileType: {
			//允许上传的附件类型,用于显示文案
			type: String,
			default: 'fileDefault'
		},
		requireTip: {
			//文件上传提示
			type: [String, Array]
		},
		//文件列表
		fileData: {
			type: Array,
			default: () => {
				return [];
			}
		},
		//是否禁用
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			action: API_SteelsUploadFileWaterMark, //附件地址
			columns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					width: '46%',
					scopedSlots: { customRender: 'typeName' }
				},
				{
					title: '文件名',
					dataIndex: 'name',
					align: 'left',
					width: '33%',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '操作',
					key: 'action',
					align: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			fileList: [],
			beginUpload: false, //附件上传中,禁止文件操作
			nowfileType: {},
			isReceive: this.$route.query.from === 'receive'
		};
	},
	watch: {
		beginUpload(val) {
			// 文件上传状态，如果需要自行控制
			if (this.$listeners['beginUploadChange']) {
				this.$emit('beginUploadChange', val);
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
		//展示的限制
		allowFormat() {
			return fileTypeList[this.fileType] || [];
		},
		//所有的限制，
		allowFormatAll() {
			let allowFormat = [];
			if (this.nowfileType.fileType) {
				allowFormat = fileTypeList[this.nowfileType.fileType];
			} else {
				allowFormat = fileTypeList[this.fileType];
			}
			return allowFormat;
		},
		allowFormatString() {
			if (this.allowFormat?.length) {
				return this.allowFormat.join('，');
			} else {
				return '';
			}
		},
		allowFormatStringAll() {
			if (this.allowFormatAll?.length) {
				return this.allowFormatAll.join('，');
			} else {
				return '';
			}
		},
		//是否有提示
		requireTipArr() {
			let requireTipArr = [];
			if (this.requireTip) {
				if (typeof this.requireTip == 'string') {
					requireTipArr = [this.requireTip];
				} else {
					requireTipArr = this.requireTip;
				}
			}
			return requireTipArr;
		}
	},
	methods: {
		//上传前校验
		beforeUpload(file) {
			let allowFormat = this.allowFormatAll;
			let isAllowFormat = false;
			if (allowFormat.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) == -1) {
				this.$message.error('仅支持' + this.allowFormatStringAll + '的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}
			const t = this;

			function fileTypeJudge() {
				if (file.size / 1024 / 1024 > 100) {
					t.$message.error('单个附件大小不得超过100M');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}

			let ifOverSize = fileTypeJudge();
			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		//文件上传
		fileChange({ fileList }) {
			this.disabledSubmit = true;
			this.fileList = fileList;
			if (
				fileList.length &&
				fileList.some(item => {
					return item.status == 'uploading';
				})
			) {
				this.beginUpload = true;
			} else {
				let fileData = fileList
					.filter(item => {
						return !this.fileData.some(items => {
							return items.uid == item.uid;
						});
					})
					.map(item => {
						//判断文件类型,暂时取默认
						let fileType = this.nowfileType;
						return {
							...item.response.data,
							...item,
							key: fileType.key,
							type: fileType.key,
							id: item.response.data.id,
							typeName: fileType.label,
							name: item.response.data.name,
							url: item.response.data.path,
							md5Hex: item.response.data.md5Hex,
							path: item.response.data.path
						};
					});
				this.$emit('fileChange', [...this.fileData, ...fileData]);
				this.beginUpload = false;
			}
		},
		//查看附件
		fileLook(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.path;
			}
			if (data.url) {
				url = data.url;
			}
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		//删除附件
		toDelete(data) {
			let fileData = this.fileData;
			if (data.uid) {
				//表示当前文件为新上传删除
				this.fileList = this.fileList.filter(item => item.uid !== data.uid);
				fileData = fileData.filter(item => item.uid !== data.uid);
			} else if (data.id) {
				fileData = fileData.filter(item => item.id !== data.id);
			}
			this.$message.success('删除成功');
			this.$emit('fileChange', fileData);
		},
		emptyFileData() {
			this.fileList = [];
			this.$emit('fileChange', this.fileList);
		},
		//下载
		download(data) {
			// 下载货转证明附件
			if (data.attachId) {
				API_GetDownloadRAR(data.attachId).then(res => {
					comDownload(res, undefined, data.name);
				});
			}
			let url;
			if (data.response) {
				url = data.response.data.fileUrl;
			} else if (data.url) {
				url = data.url;
			} else if (data.path) {
				url = data.path;
			} else {
				return;
			}
			if (url) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url, data.name);
				});
			}
		},
		setNowFileType(nowfileType) {
			this.nowfileType = nowfileType;
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');

.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
}

.slTitleAssisBut {
	width: 100%;
	height: 100%;
}

.tableTip {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 12px;
	line-height: 12px;
	color: #77889d;
	margin-bottom: 20px;
	margin-top: 20px;
}
</style>
