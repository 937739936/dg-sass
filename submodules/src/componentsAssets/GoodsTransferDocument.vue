<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20"> 货转凭证信息 </a-space>
		</div>
		<ErrorPanel
			v-if="audit"
			:assetValidateList="goodTransferInfo.assetValidateList || goodTransferInfo.paymentValidates || []"
		></ErrorPanel>
		<div
			class="mb50 content"
			v-if="!showSelect"
		>
			<div class="table-box">
				<a-table
					class="new-table"
					:dataSource="goodsList"
					:columns="deliverColumns"
					:pagination="false"
					row="recvNoType"
				>
					<a
						slot="no"
						slot-scope="text, record"
						@click="handlePreview(record)"
					>
						{{ text }}
					</a>
					<template
						slot="number"
						slot-scope="number"
					>
						{{ formatMoney(number) }}
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
				<a-row
					type="flex"
					class="select"
				>
					<a-col flex="auto">
						货转张数：<span class="selectAll">{{ formatMoney(goodsList.length || 0) }}张</span>
					</a-col>
					<a-col flex="none">
						<div>
							<a-space :size="10">
								货转总数<span class="number">{{ formatMoney(goodTransferCount.quantity) || 0 }}</span>
							</a-space>
							吨
						</div>
					</a-col>
				</a-row>
			</div>
		</div>
		<div
			class="mb50 content"
			v-else
		>
			<div class="tip-box">
				<span class="tip-title">说明：选择本次融资所需要的货转凭证，可多选</span>
			</div>
			<div class="table-box">
				<a-table
					:columns="fileColumns"
					class="new-table"
					:row-selection="rowSelection"
					rowKey="id"
					:dataSource="goodsList"
					:pagination="false"
				>
					<a
						href="javascript:;"
						slot="name"
						slot-scope="text, record"
						@click="handlePreview(record)"
					>
						{{ record.fileName || record.name }}
					</a>
				</a-table>
				<a-row
					type="flex"
					class="select"
				>
					<a-col flex="auto">
						货转张数：<span class="selectAll">{{ selectedRows.length || 0 }}张</span>
					</a-col>
					<a-col flex="none">
						<div>
							<a-space :size="10">
								货转总数<span class="number">{{ formatMoney(goodTransferCount.quantity) || 0 }}</span>
							</a-space>
							吨
						</div>
					</a-col>
				</a-row>
			</div>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { formatMoney } from '@sub/filters';
import comDownload from '@sub/utils/comDownload.js';
import ImageViewer from '@sub/components/viewer/image.vue';
import ErrorPanel from './components/ErrorPanel.vue';
const customRender = text => text || '-';
const deliverColumns = [
	{ title: '凭证类型', dataIndex: 'typeDesc' },
	{ title: '货转编号', dataIndex: 'no', scopedSlots: { customRender: 'no' } },
	{ title: '发货批次号', dataIndex: 'batchNo', customRender },
	{ title: '货转数量(吨)', dataIndex: 'quantity' },
	{ title: '货转开具时间', dataIndex: 'openTime' }
];
export default {
	name: 'QualityDocument',
	components: {
		ImageViewer,
		ErrorPanel
	},
	data() {
		return {
			formatMoney,
			deliverColumns,
			goodsList: [], // 货转信息
			selectedRows: [],
			showSelect: false,
			fileColumns: [
				{
					title: '货转编号',
					dataIndex: 'no'
				},
				{
					title: '货转数量',
					dataIndex: 'quantity',
					scopedSlots: { customRender: 'number' }
				},
				{
					title: '货转开具日期',
					dataIndex: 'openTime'
				},
				{
					title: '发货方式',
					dataIndex: 'transferTypeDesc'
				},
				{
					title: '文件名称',
					dataIndex: 'name',
					align: 'left',
					scopedSlots: { customRender: 'name' }
				}
			]
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
		goodTransferInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		transInfoGoodsTransferAttachList: {
			type: [Array, undefined],
			default: undefined
		}
	},
	inject: {
		refreshParent: { form: 'refreshParent', default: null },
		downFileAllParent: { form: 'downFileAllParent', default: null },
		getGoodsTransByAssetIdParent: { form: 'getGoodsTransByAssetIdParent', default: null },
		getOtherAttachParent: { form: 'getOtherAttachParent', default: null },
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	filters: {},
	watch: {
		goodTransferInfo: {
			deep: true,
			immediate: true,
			handler(data) {
				this.goodsList = data?.list || [];
				this.selectedRows = data?.list || [];
				// 判断是直接展示还是进行选择
				// selectGoodsTransferType 1、根据收发货选择货转；2、直接选择货转
				if (this.goodTransferInfo.selectGoodsTransferType) {
					// 选择货转，并且是编辑状态
					if (this.goodTransferInfo.selectGoodsTransferType == 2 && this.editFlag) {
						this.showSelect = true;
					}
					//
				}
			}
		},
		// 批次发生变化后批次重新回显货转凭证信息
		transInfoGoodsTransferAttachList(data) {
			// 如果是直接展示，并且有回显数据
			if (data && !this.showSelect) {
				this.goodsList = [...data];
			}
			this.selectedRows = [...data];
			// 如果选中批次发生变化，并且是编辑状态，重新获取下游货转文件
			if (this.getOtherAttachParent) {
				this.getOtherAttachParent();
			}
		},
		// 判断是回显还是选择
		showSelect: {
			immediate: true,
			handler(data, old) {
				// 如果是进行选择，加载次资产所有关联的货转信息
				if (data) {
					if (this.getGoodsTransByAssetIdParent) {
						this.getGoodsTransByAssetIdParent().then(res => {
							if (res.success) {
								this.goodsList = res.data;
							}
						});
					}
				}
				// 如果是admin端，展示锁定
				if (this.type === 'admin') {
					this.deliverColumns = [
						...deliverColumns,
						{
							dataIndex: 'locked',
							slots: { title: 'lockedTitle' },
							scopedSlots: { customRender: 'locked' },
							width: '15%',
							align: 'center'
						}
					];
				} else {
					// 如果不是编辑，展示下载
					if (this.editFlag) {
						this.deliverColumns = [...deliverColumns];
					} else {
						this.deliverColumns = [
							...deliverColumns,
							{
								title: '操作',
								dataIndex: 'action',
								scopedSlots: { customRender: 'action' },
								align: 'center'
							}
						];
					}
				}
			}
		}
	},
	mounted() {},
	computed: {
		// 当前加载环境
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		// 选择货转信息统计
		goodTransferCount() {
			let quantity = 0;
			this.selectedRows.forEach(item => {
				quantity += item.quantity || 0;
			});
			let goodTransferCount = { quantity };
			return goodTransferCount;
		},
		rowSelection() {
			const t = this;
			return {
				type: 'checkbox',
				selectedRowKeys: t.selectedRows.map(item => item.id),
				onSelect(record, selected, selectedRows) {
					t.isNeedNextChange();
					t.selectedRows = selectedRows;
					// 如果选中批次发生变化，并且是编辑状态，重新获取下游货转文件
					if (t.getOtherAttachParent) {
						t.getOtherAttachParent();
					}
				},
				onSelectAll(selected, selectedRows) {
					t.isNeedNextChange();
					t.selectedRows = selectedRows;
					// 如果选中批次发生变化，并且是编辑状态，重新获取下游货转文件
					if (t.getOtherAttachParent) {
						t.getOtherAttachParent();
					}
				}
			};
		},
		// 上传附件限制种类
		bankProductAssetConfigList() {
			let bankProductAssetConfigList = this.goodTransferInfo?.bankProductAssetConfigList || [];
			bankProductAssetConfigList = bankProductAssetConfigList
				.filter(item => item.status == 1)
				.map(item => {
					let accept = '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF,.bmp';
					return {
						key: item.assetAttachType,
						label: item.itemDesc,
						accept,
						required: Boolean(item.required)
					};
				});
			return bankProductAssetConfigList;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.goodsList.length) {
				let locked = this.goodsList.every(item => Boolean(item[this.lockedKey]));
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
			if (this.goodsList?.length) {
				let arr = [];
				this.goodsList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: this.goodsList, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		download(record) {
			let files = record.path;
			let zipFileName = record.transferName;
			if (this.serialNo) {
				zipFileName = `${this.serialNo()}-${zipFileName}`;
			}
			if (this.downFileAllParent) {
				this.downFileAllParent({ zipFileName, files }).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		//查看附件
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		// 数据输出整理
		onSubmit() {
			var checkRes = this.checkAssetsSubmit(this.deliverInfo);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return { transferNoList: this.selectedRows };
		},
		checkAssetsSubmit() {
			var obj = {};
			// 判断附件中是否有必填
			let requiredList = this.bankProductAssetConfigList.filter(item => item.required);
			// 如果是必填，判断是否有绑定批次
			if (!requiredList.length) {
				return obj;
			}
			if (requiredList.length && !this.selectedRows?.length) {
				obj.errorStr = '请在货转凭证模块选择货转证明';
				return obj;
			}
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
					font-weight: 400;
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
