<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20"> 数质量凭证信息 </a-space>
		</div>
		<ErrorPanel
			v-if="audit"
			:assetValidateList="assetValidateList"
		></ErrorPanel>
		<div class="mb50 content">
			<div
				class="tip-box"
				v-if="editFlag"
			>
				<span class="tip-title">
					【上传附件】可支持格式为jpg，jpeg，png，bmp，pdf的附件，单个附件大小不得超过100M的文件
					<template v-if="bankProductAssetConfigList.some(item => item.key === 'RECEIVE_WEIGHT_NOTES_DETAIL')">
						; 其中“磅单明细”同时支持xlsx，xls格式
					</template>
					。
				</span>
			</div>
			<div class="table-box">
				<a-table
					class="new-table"
					:dataSource="recvList"
					:columns="recvColumns"
					:pagination="false"
					:rowKey="(record, index) => String(index)"
				>
					<template
						slot="number"
						slot-scope="number"
					>
						{{ formatMoney(number) }}
					</template>
					<a-space
						:size="24"
						slot="action"
						slot-scope="text, record"
					>
						<a-dropdown
							:getPopupContainer="getPopupContainer"
							v-if="editFlag"
						>
							<a-menu slot="overlay">
								<a-menu-item
									v-for="item in bankProductAssetConfigList.filter(item => item.secondaryCategory.includes(record.transferType))"
									:key="item.type"
								>
									<a-upload
										:headers="headers"
										:beforeUpload="beforeUpload"
										:accept="item.accept"
										:action="actionParent"
										:multiple="true"
										name="file"
										@change="e => fileChange(e, item, record)"
									>
										<div :class="item.required ? 'required' : ''">{{ item.label }}</div>
									</a-upload>
								</a-menu-item>
							</a-menu>
							<a>上传附件<a-icon type="right" /></a>
						</a-dropdown>
					</a-space>
				</a-table>
				<a-row
					type="flex"
					class="select"
				>
					<a-col flex="auto">
						已选：<span class="selectAll">{{ recvList.length }}个批次</span>
					</a-col>
					<a-col flex="none">
						<a-space :size="20">
							<div>
								<a-space :size="10">
									发货数量合计<span class="number">{{ formatMoney(recvCount.deliverQuntity) }}</span> </a-space
								>吨
							</div>
							<div>
								<a-space :size="10">
									收货数量合计<span class="number">{{ formatMoney(recvCount.recvQuntity) }}</span> </a-space
								>吨
							</div>
						</a-space>
					</a-col>
				</a-row>
			</div>
		</div>
		<!-- 如果是金融机构，文件数据为空也不展示 -->
		<template v-if="!(isBank && !attachFileList.length)">
			<div class="title">附件信息</div>
			<div class="mb50 content">
				<div class="table-box">
					<a-table
						:columns="editFlag ? fileColumns : filesColumns"
						class="new-table-file"
						bordered
						:rowKey="(record, index) => String(index)"
						:dataSource="attachFileList"
						:pagination="false"
					>
						<div
							slot="typeDesc"
							slot-scope="typeDesc, record"
							class="typeDesc"
						>
							<div style="margin-right: 20px; line-height: 24px">
								<span :style="{ color: record.required ? 'red' : 'transparent' }"> * </span>
								<span>{{ typeDesc }}</span>
							</div>
						</div>
						<div
							class="nameMain"
							slot="name"
							slot-scope="name, record"
						>
							<a-tooltip
								v-for="(item, fileIndex) in record.fileList"
								:key="fileIndex"
							>
								<template
									slot="title"
									v-if="item.transferName"
								>
									{{ item.transferName }}
								</template>
								<div class="nameEdit">
									<span @click="handlePreview(item)">{{ item.name }}</span>
									<a-popconfirm
										v-if="(item.locked || item.checked) != 1"
										title="确认删除？"
										@confirm="deleteFiles(item)"
									>
										<img
											class="del"
											src="@sub/assets/imgs/trade/del-icon.png"
											alt=""
										/>
									</a-popconfirm>
								</div>
							</a-tooltip>
						</div>
						<template
							slot="fileList"
							slot-scope="text, record"
						>
							<span class="preview-box">
								<a-tooltip
									v-for="(item, i) in record.fileList"
									:key="i"
								>
									<template slot="title"> {{ item.transferName }} </template>
									<a
										href="javascript:;"
										class="preview"
										@click="handlePreview(item)"
									>
										{{ item.fileName || item.name }}
									</a>
								</a-tooltip>
							</span>
						</template>
						<template
							slot="action"
							slot-scope="text, items"
						>
							<a
								href="javascript:;"
								@click="download(items)"
							>
								下载
							</a>
						</template>
						<template slot="lockedTitle">
							锁定
							<a-switch
								:checked="lockedAll"
								@change="onChangeAll"
								:disabled="!audit"
							/>
						</template>
						<template
							slot="locked"
							slot-scope="text, record"
						>
							<a-switch
								:disabled="!audit"
								:checked="Boolean(record[lockedKey])"
								@change="onChange(record)"
							/>
						</template>
					</a-table>
				</div>
			</div>
		</template>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ImageViewer from '@sub/components/viewer/image.vue';
import { formatMoney } from '@sub/filters';
import comDownload from '@sub/utils/comDownload.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import ErrorPanel from './components/ErrorPanel.vue';
const recvColumns = [
	{ title: '收货编号', dataIndex: 'recvNo' },
	{ title: '收货数量(吨)', dataIndex: 'recvQuntity', scopedSlots: { customRender: 'number' } },
	{ title: '收货日期', dataIndex: 'recvDate' },
	{ title: '关联发货批次', dataIndex: 'batchNo', width: 160 },
	{ title: '品名', dataIndex: 'goodName' },
	{ title: '发货方式', dataIndex: 'transferTypeDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
];
const filesRestColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '收货编号', dataIndex: 'recvNo' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const filesAdminColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '收货编号', dataIndex: 'recvNo' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{
		dataIndex: 'locked',
		slots: { title: 'lockedTitle' },
		scopedSlots: { customRender: 'locked' },
		width: '15%',
		align: 'center'
	}
];
export default {
	name: 'QualityDocument',
	components: {
		ImageViewer,
		ErrorPanel
	},
	data() {
		return {
			getPopupContainer,
			formatMoney,
			fileColumns: [
				{
					title: '单据类型',
					dataIndex: 'typeDesc',
					width: 210,
					scopedSlots: { customRender: 'typeDesc' }
				},
				{ title: '收货编号', dataIndex: 'recvNo' },
				{
					title: '文件名称',
					dataIndex: 'name',
					align: 'left',
					scopedSlots: { customRender: 'name' }
				}
			],
			recvList: [],
			attachList: [], // 附件列表
			assetValidateList: [] // 校验错误信息
		};
	},
	props: {
		editFlag: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		audit: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		isBank: {
			type: Boolean,
			default: false
		},
		recvInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		transInfoRecvList: {
			type: [Array, undefined],
			default: undefined
		},
		transInfoReceiveAttachList: {
			type: [Array, undefined],
			default: undefined
		}
	},
	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		actionParent: { form: 'actionParent', default: null },
		downFileAllParent: { form: 'downFileAllParent', default: null },
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	filters: {},
	watch: {
		recvInfo: {
			deep: true,
			immediate: true,
			handler(data) {
				let fileList = data.attachList;
				if (fileList?.length) {
					this.attachList = fileList;
				}
				if (data?.recvList) {
					this.recvList = data.recvList || [];
				}
				if (data.assetValidateList) {
					this.assetValidateList = data.assetValidateList || [];
				}
				if (data.paymentValidates) {
					this.assetValidateList = data.paymentValidates || [];
				}
			}
		},
		recvList() {
			this.recvListChange();
		},
		transInfoRecvList(data) {
			if (data) {
				this.recvList = data;
			}
		},
		// 批次发生变化后批次重新传入回显附件
		transInfoReceiveAttachList(data) {
			if (data) {
				// 将新的不存在与现有附件列表中的数据添加到列表中
				data.forEach(item => {
					if (!this.attachList.find(items => items.id === item.id)) {
						this.attachList.push(item);
					}
				});
			}
		}
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
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		recvColumns() {
			if (this.type === 'admin' || !this.editFlag) {
				return recvColumns.filter(item => item.dataIndex !== 'action');
			}
			return recvColumns;
		},
		filesColumns() {
			if (this.type === 'rest') {
				return filesRestColumns;
			}
			return filesAdminColumns;
		},
		// 批次信息统计
		recvCount() {
			let deliverQuntity = 0;
			let recvQuntity = 0;
			this.recvList.forEach(item => {
				deliverQuntity += item.deliverQuntity || 0;
				recvQuntity += item.recvQuntity || 0;
			});
			let recvCount = { deliverQuntity, recvQuntity };
			return recvCount;
		},
		// 上传附件限制种类
		bankProductAssetConfigList() {
			let bankProductAssetConfigList = this.recvInfo?.bankProductAssetConfigList || [];
			bankProductAssetConfigList = bankProductAssetConfigList
				.filter(item => item.status == 1)
				.map(item => {
					let accept = '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.bmp';
					if (item.assetAttachType === 'RECEIVE_WEIGHT_NOTES_DETAIL') {
						accept = '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.bmp.xlsx,.xls,.XLSX,.XLS';
					}
					return {
						key: item.assetAttachType,
						label: item.itemDesc,
						accept,
						secondaryCategory: item.secondaryCategory,
						required: Boolean(item.required)
					};
				});
			return bankProductAssetConfigList;
		},
		// 所有的附件信息整理
		attachFileList() {
			let list = this.attachList.filter(item => item.delFlag != 1);
			let obj = {};
			let listAdmin = [];
			list.forEach(el => {
				let { receiveNo, type, locked, checked, typeDesc, id } = el;
				let recvNo = receiveNo;
				let required = false;
				let typeItem = this.bankProductAssetConfigList.find(item => item.key === type);
				if (typeItem) {
					typeDesc = typeItem?.label;
					required = typeItem?.required;
				}
				let recvNoType = recvNo + type;
				let elObj = { required, id, locked, checked, typeDesc, recvNo, type, recvNoType };
				if (!obj[recvNoType]) {
					obj[recvNoType] = { fileList: [], ...elObj };
				}
				listAdmin.push({ fileList: [el], ...elObj });
				obj[recvNoType].fileList.push(el);
			});
			list = [];
			for (let k in obj) {
				list.push(obj[k]);
			}
			if (this.type === 'rest') {
				return list;
			}
			// admin端不做合并处理
			return listAdmin;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.attachFileList.length) {
				let locked = this.attachFileList.every(item => Boolean(item[this.lockedKey]));
				return locked;
			}
			return false;
		}
	},
	methods: {
		// 判断是否有判断外部变更，用于修改是进行页面拦截
		isNeedNextChange() {
			if (this.isNeedNextChangeParent) {
				this.isNeedNextChangeParent();
			}
		},
		// 如果批次发生变化，将附件中找不到对应批次的文件删除
		recvListChange() {
			this.attachList = this.attachList.filter(item => {
				return this.recvList.some(items => items.batchNo === item.batchNo);
			});
		},
		download(record) {
			let fileList = record.fileList;
			let files = fileList.map(item => item.path);
			let zipFileName = '';
			if (files.length === 0) {
				return;
			}
			if (files.length === 1) {
				zipFileName = fileList[0].transferName;
			} else {
				zipFileName = (record.typeDesc || record.itemDestc) + '.zip';
			}
			if (this.serialNo) {
				zipFileName = `${this.serialNo()}-${zipFileName}`;
			}
			files = files.join(',');
			if (this.downFileAllParent) {
				this.downFileAllParent({ zipFileName, files }).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		//上传前校验
		beforeUpload(file) {
			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return false;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return false;
			}
		},
		//文件上传
		fileChange(e, fileTypeObj, record) {
			let { file, fileList } = e;
			let uploadingList = fileList ?? [];
			let isContainUploading = uploadingList.some(item => {
				return item.status == 'uploading';
			});
			if (file.status == 'done') {
				// 上传成功
				let fileData = file.response.data; // 更换原有上传接口需要展示名称
				let ext = fileData.fileName.split('.')[fileData.fileName.split('.').length - 1].toLowerCase();
				let newFile = {
					...file,
					...fileData,
					path: fileData.fileUrl,
					ext,
					batchNo: record.batchNo,
					receiveNo: record.recvNo,
					transType: record.transferType,
					name: fileData.fileName, // 更换原有上传接口需要展示名称
					createTime: fileData.createTime ?? moment().format('YYYY-MM-DD HH:mm:ss'),
					type: fileTypeObj.key,
					typeName: fileTypeObj.label,
					delflag: 0
				};
				this.attachList.push(newFile);
				this.isNeedNextChange();
			}
			let isContainNoStatus = uploadingList.some(item => {
				if (item.status) {
					return false;
				}
				return true;
			});
			if (isContainNoStatus || isContainUploading) {
				return;
			}
			if (!isContainUploading) {
				// 不包含上传状态时 改变按钮状态
				let errorNames = [];
				uploadingList.map(item => {
					if (item.status == 'error') {
						errorNames.push(item.name);
					}
				});
				if (errorNames.length > 0) {
					let errorNameString = errorNames.join('，');
					this.$message.error(`${record.typeName}: ${errorNameString}上传失败！`);
				}
			}
		},
		//查看附件
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		deleteFiles(items) {
			// 删除附件
			this.attachList = this.attachList.map(element => {
				if ((items.id && element.id == items.id) || (items.uid && element.uid == items.uid)) {
					element.delFlag = 1;
				}
				return element;
			});
			this.isNeedNextChange();
		},
		onChange(record) {
			let fileId = '';
			if (record.fileList?.length) {
				let arr = [];
				record.fileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			} else {
				fileId = record.id;
			}
			if (!fileId) {
				return;
			}
			let params = { type: record.type, fileId: fileId, lock: Boolean(!record[this.lockedKey]) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		onChangeAll() {
			let fileId = '';
			if (this.attachFileList?.length) {
				let arr = [];
				this.attachFileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: this.attachList, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		// 数据输出整理
		onSubmit() {
			var checkRes = this.checkAssetsSubmit();
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return { list: this.attachList };
		},
		checkAssetsSubmit() {
			var obj = {};
			// 判断附件中是否有必填
			let requiredList = this.bankProductAssetConfigList.filter(item => item.required);
			// 如果是必填，判断是否有绑定批次
			if (!requiredList.length) {
				return obj;
			}
			if (requiredList.length && !this.recvList?.length) {
				obj.errorStr = '数质量凭证模块缺少批次';
				return obj;
			}
			// 有批次的情况下，判断所有的批次是否包含必填附件信息
			let list = this.attachList.filter(item => item.delFlag != 1);
			this.recvList.forEach(item => {
				let requiredListKey = requiredList.filter(items => {
					items.secondaryCategory.includes(item.transferType);
				});
				// 得到所有的必填类型
				let flag = requiredListKey.every(items =>
					list.some(itemss => itemss.receiveNo === item.recvNo && itemss.type === items.key)
				);
				if (!flag) {
					obj.errorStr = '数质量凭证模块-缺少必填附件';
				}
			});
			return obj;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.contentBox {
	font-size: 14px;
	color: #141517;
	background: none;
	margin: 0;
	min-width: 100%;

	::v-deep {
		.title {
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 500;
			line-height: 32px;
			color: rgba(0, 0, 0, 0.8);
			margin-bottom: 15px;
			.ant-btn {
				padding: 0 10px;
			}
			div {
				font-family: PingFang SC;
			}
		}
		.mb50 {
			margin-bottom: 50px;
		}
		.content {
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
				position: relative;
				overflow: hidden;
				.tip-title {
					// font-weight: 600;
				}
			}
			.ant-dropdown-menu-item {
				padding-left: 20px;
				padding-right: 20px;
				cursor: default;
				div {
					cursor: pointer;
				}
				.required {
					position: relative;
					&::before {
						position: absolute;
						top: 50%;
						bottom: 50%;
						margin: auto;
						right: 100%;
						width: 14px;
						height: 14px;
						line-height: 14px;
						color: #ea5530;
						content: '*';
					}
				}
				&.ant-dropdown-menu-item-active {
					background: #e4ebf4;
					color: @primary-color;
					.ant-upload {
						color: @primary-color;
					}
				}
				.ant-upload-list {
					display: none;
				}
			}
			.select {
				margin: 20px 0;
				font-family: PingFang SC;
				font-size: 14px;
				font-weight: 400;
				line-height: 26px;
				text-align: left;
				color: #77889d;
				.selectAll {
					font-family: PingFang SC;
					font-size: 14px;
					font-weight: 400;
					text-align: left;
					color: #000000;
				}
				.number {
					font-family: D-DIN-PRO;
					font-size: 18px;
					font-weight: 500;

					font-size: 18px;
					color: #f46332;
				}
			}

			.nameMain {
				white-space: normal;
				color: @primary-color;
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: 14px; /* 100% */
				.nameEdit {
					background: #f3f5f6;
					display: inline-block;
					margin: 2px 8px;
					border-radius: 4px;
					padding: 6px;
					span {
						cursor: pointer;
						vertical-align: middle;
					}
					.del {
						width: 14px;
						cursor: pointer;
						vertical-align: middle;
						margin-left: 8px;
					}
				}
				.name {
					display: inline-block;
					border-left: 1px solid #e9effc;
					padding: 0px 14px;
					line-height: 14px;
					margin: 6px 0;
					&:first-child {
						border: 0;
					}
				}
			}
			.preview {
				cursor: pointer;
				margin-right: 14px;
				padding-right: 14px;
				border-right: 1px solid #e9effc;
			}
			.preview-box {
				.preview:last-child {
					border-right: 0;
				}
			}
		}
	}
}
.slModel {
	.title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 500;
		font-size: 18px;
		line-height: 58px;
		color: rgba(0, 0, 0, 0.8);
		background: #f3f5f6;
		padding-left: 20px;
		border-radius: 8px 8px 0px 0px;
	}

	/deep/ .ant-modal-body {
		padding: 0;
	}
	// /deep/ .ant-modal-close-x {
	//   background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	//   background-size: cover;
	//   .ant-modal-close-icon {
	//     display: none;
	//   }
	// }
	.select {
		margin: 20px 0;
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: #77889d;
		.selectAll {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 400;
			text-align: left;
			color: #000000;
		}
		.number {
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;

			font-size: 18px;
			color: #f46332;
		}
	}
	.footer {
		text-align: right;

		.ant-btn {
			margin-left: 20px;
			width: 90px;
			color: rgba(0, 0, 0, 0.8);
			border: 1px solid #c6cdd8;
			height: 34px;
		}

		.ant-btn-primary {
			color: #ffffff;
			border: none;
		}
	}
}
</style>
