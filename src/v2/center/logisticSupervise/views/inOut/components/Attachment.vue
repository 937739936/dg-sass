<template>
	<div>
		<div
			v-if="!transportMode"
			class="no-data"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="64"
				height="40"
				viewBox="0 0 110 69"
				fill="none"
			>
				<path
					d="M55 67.8643C85.3757 67.8643 110 62.5178 110 55.9224C110 49.3271 85.3757 43.9805 55 43.9805C24.6243 43.9805 0 49.3271 0 55.9224C0 62.5178 24.6243 67.8643 55 67.8643Z"
					fill="#F5F5F5"
				/>
				<path
					d="M94.5312 23.1122L77.0928 3.48989C76.2558 2.15239 75.0338 1.34375 73.7464 1.34375H36.2536C34.9663 1.34375 33.7442 2.15239 32.9072 3.48818L15.4688 23.1139V38.8756H94.5312V23.1122Z"
					stroke="#D9D9D9"
					stroke-width="1.71875"
				/>
				<path
					d="M71.5223 28.5217C71.5223 25.7836 73.2308 23.5232 75.35 23.5215H94.5312V54.463C94.5312 58.0849 92.2625 61.0533 89.4609 61.0533H20.5391C17.7375 61.0533 15.4688 58.0832 15.4688 54.463V23.5215H34.65C36.7692 23.5215 38.4777 25.7785 38.4777 28.5166V28.5542C38.4777 31.2923 40.205 33.5032 42.3225 33.5032H67.6775C69.795 33.5032 71.5223 31.2718 71.5223 28.5337V28.5217Z"
					fill="#FAFAFA"
					stroke="#D9D9D9"
					stroke-width="1.71875"
				/>
			</svg>
			<p>暂无数据</p>
		</div>
		<div
			class="attachment"
			v-else
		>
			<a-spin
				tip="上传中..."
				v-if="beginUpload"
				class="loading"
			/>
			<div class="tip-box">
				<div class="spread-box">
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
				</div>
				<div v-if="isSpread">
					<p
						v-for="(item, index) in dataSource"
						:key="index"
					>
						<span class="tip-title">{{ item.title }}</span
						>：可支持格式为{{ item.acceptTip }}的附件，支持多张，单个附件大小不得超过100M的文件
					</p>
				</div>
				<div v-else>
					<p
						v-for="(item, index) in isSpreadList"
						:key="index"
					>
						<span class="tip-title">{{ item.title }}</span
						>：可支持格式为{{ item.acceptTip }}的附件，支持多张，单个附件大小不得超过100M的文件
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
						<span v-if="record.type == 'AUTOMOBILE_TICKET'"
							><span
								class="red"
								v-if="!isManager"
								>*</span
							>
							磅单</span
						>
						<span v-if="record.type == 'AUTOMOBILE_TICKET_DETAIL'"
							><span
								class="red"
								v-if="!isManager"
								>*</span
							>磅单明细</span
						>
						<span v-if="record.type == 'AUTOMOBILE_LABORATORY_CERTIFICATE'"
							><span
								:class="record.require ? 'red' : 'opt'"
								v-if="!isManager"
								>*</span
							>化验凭证</span
						>
						<span v-if="record.type == 'TRAIN_RAILWAY_TICKET'"
							><span
								class="red"
								v-if="!isManager"
								>*</span
							>铁路大票</span
						>
						<span v-if="record.type == 'TRAIN_ENTRY_AND_EXIT_DETAIL'"
							><span
								class="red"
								v-if="!isManager"
								>*</span
							>出入库明细</span
						>
						<span v-if="record.type == 'TRAIN_LABORATORY_CERTIFICATE'"
							><span
								:class="record.require ? 'red' : 'opt'"
								v-if="!isManager"
							>
								*</span
							>化验凭证</span
						>
						<span v-if="record.type == 'SHIP_ONBOARD_MEASUREMENT_SHEET'"
							><span
								class="red"
								v-if="!isManager"
								>*</span
							>随船计量单</span
						>
						<span v-if="record.type == 'SHIP_LABORATORY_CERTIFICATE'"
							><span
								:class="record.require ? 'red' : 'opt'"
								v-if="!isManager"
								>*</span
							>化验凭证</span
						>
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
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
const acceptStr = '.jpg,.jpeg,.png,.pdf,.JPEG,.PNG,.JPG,.PDF';
import { mapGetters } from 'vuex';
import { commonUpload, API_UPLOAD_STATION } from '@/v2/api';
import moment from 'moment';
import ImageViewer from '@sub/components/viewer/image.vue';
// 运输类型
// 汽运 AUTOMOBILE
// AUTOMOBILE_TICKET AUTOMOBILE_TICKET_DETAIL AUTOMOBILE_LABORATORY_CERTIFICATE
// 磅单 磅单明细  化验凭证
// 火运 TRAIN
// TRAIN_RAILWAY_TICKET TRAIN_ENTRY_AND_EXIT_DETAIL TRAIN_LABORATORY_CERTIFICATE
// 铁路大票 出入库明细 化验凭证
// 船运 SHIP
// SHIP_ONBOARD_MEASUREMENT_SHEET SHIP_LABORATORY_CERTIFICATE
// 随船计量单  化验凭证

export default {
	props: ['transportMode', 'handleType', 'isCoreCompany', 'isManager'],
	data() {
		return {
			isSpread: false,
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
					type: 'AUTOMOBILE_TICKET',
					title: '磅单',
					require: true,
					list: [],
					accept: acceptStr,
					acceptTip: 'jpg，jpeg，png，pdf'
				},
				{
					type: 'AUTOMOBILE_TICKET_DETAIL',
					title: '磅单明细',
					require: true,
					list: [],
					accept: `${acceptStr},.xls,.xlsx`,
					acceptTip: 'jpg，jpeg，png，pdf，xls，xlsx'
				},
				{
					type: 'AUTOMOBILE_LABORATORY_CERTIFICATE',
					title: '化验凭证',
					require: false,
					list: [],
					accept: acceptStr,
					acceptTip: 'jpg，jpeg，png，pdf'
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
		},
		transportMode(val) {
			const require = this.handleType == 'OUT';
			if (this.transportMode == 'AUTOMOBILE') {
				this.dataSource = [
					{
						type: 'AUTOMOBILE_TICKET',
						title: '磅单',
						require: true,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					},
					{
						type: 'AUTOMOBILE_TICKET_DETAIL',
						title: '磅单明细',
						require: true,
						list: [],
						accept: `${acceptStr},.xls,.xlsx`,
						acceptTip: 'jpg，jpeg，png，pdf，xls，xlsx'
					},
					{
						type: 'AUTOMOBILE_LABORATORY_CERTIFICATE',
						title: '化验凭证',
						require: require,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					}
				];
			} else if (this.transportMode == 'TRAIN') {
				this.dataSource = [
					{
						type: 'TRAIN_RAILWAY_TICKET',
						title: '铁路大票',
						require: true,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					},
					{
						type: 'TRAIN_ENTRY_AND_EXIT_DETAIL',
						title: '出入库明细 ',
						require: true,
						list: [],
						accept: `${acceptStr},.xls,.xlsx`,
						acceptTip: 'jpg，jpeg，png，pdf，xls，xlsx'
					},
					{
						type: 'TRAIN_LABORATORY_CERTIFICATE',
						title: '化验凭证',
						require: require,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					}
				];
			} else {
				this.dataSource = [
					{
						type: 'SHIP_ONBOARD_MEASUREMENT_SHEET',
						title: '随船计量单',
						require: true,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					},
					{
						type: 'SHIP_LABORATORY_CERTIFICATE',
						title: '化验凭证',
						require: require,
						list: [],
						accept: acceptStr,
						acceptTip: 'jpg，jpeg，png，pdf'
					}
				];
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
			// let fileType = this.fileType;
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			// 获取当前上传的单据类型

			let isAllowFormat = false;
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
