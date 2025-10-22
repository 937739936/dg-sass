<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20"> 其他材料信息 </a-space>
		</div>
		<div class="mb50 content">
			<template v-if="editFlag">
				<div class="tip-box">
					<span class="tip-title">
						可支持格式为jpg，jpeg，png，bmp，pdf，doc，docx，xlsx，xls的附件，单个附件大小不得超过100M的文件。
					</span>
				</div>
				<AttachmentView
					ref="attachmentView"
					:dataSource="dataFileSource"
				/>
			</template>
			<FileList
				:list="attachList"
				:locked="audit"
				v-else
			/>
		</div>
	</div>
</template>
<script>
import AttachmentView from './components/AttachmentView.vue';
import FileList from './components/FileList.vue';
export default {
	name: 'OtherFiles',
	components: {
		AttachmentView,
		FileList
	},
	data() {
		return {
			attachList: [], // 文件列表
			defaultAssetConfigList: [] // 附件类型列表
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
		otherInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		otherAttachList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	filters: {},
	watch: {
		// 附件信息变化
		otherInfo: {
			deep: true,
			immediate: true,
			handler(data) {
				this.attachList = data.list || [];
				this.defaultAssetConfigList = this.otherInfo?.bankProductAssetConfigList || [];
			}
		},
		// 批次变化后会重新生成关联文件，进行同类型替换
		otherAttachList(data) {
			if (data) {
				data.forEach(item => {
					// 判断是否展示此类是否存在
					// 如果这一类存在，将状态设置为1
					this.defaultAssetConfigList = this.defaultAssetConfigList.map(items => {
						if (items.assetAttachType === item.type) {
							return {
								...items,
								status: 1
							};
						}
						return items;
					});
					if (this.bankProductAssetConfigList.some(items => items.key === item.type)) {
						// 踢出原先类型
						this.attachList = this.attachList.filter(items => {
							return items.type !== item.type;
						});
					}
				});
				// 重新进行添加
				data.forEach(item => {
					this.attachList.push(item);
				});
			}
		}
	},
	mounted() {},
	computed: {
		// 上传附件限制种类
		bankProductAssetConfigList() {
			let bankProductAssetConfigList = this.defaultAssetConfigList;
			bankProductAssetConfigList = bankProductAssetConfigList
				.filter(item => item.status == 1 && item.assetAttachType !== 'ACCOUNT_TABLE_PDF')
				.map(item => {
					let accept = ['png', 'jpeg', 'jpg', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
					if (item.assetAttachType === 'ACCOUNT_TABLE_EXCEL') {
						accept = ['xls', 'xlsx'];
					}
					return {
						key: item.assetAttachType,
						label: item.itemDesc,
						conditionDesc: item.conditionDesc,
						accept,
						required: Boolean(item.required)
					};
				});
			return bankProductAssetConfigList;
		},
		// 文件数据
		dataFileSource() {
			let list = this.bankProductAssetConfigList.map(item => {
				let type = item.key;
				let attachmentList = this.attachList.filter(items => {
					return items.type === type;
				});
				return {
					type,
					typeName: item.label,
					required: item.required,
					acceptFile: item.accept,
					conditionDesc: item.conditionDesc,
					attachmentList
				};
			});
			return list;
		}
	},
	methods: {
		// 数据输出整理
		onSubmit() {
			let attachList = this.attachList;
			if (this.editFlag) {
				attachList = this.$refs.attachmentView.attachmentList;
			}
			var checkRes = this.checkAssetsSubmit(attachList);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return { list: attachList };
		},
		checkAssetsSubmit(attachList) {
			var obj = {};
			// 判断附件中是否有必填
			let requiredList = this.bankProductAssetConfigList.filter(item => item.required);
			if (!requiredList.length) {
				return obj;
			}
			// 有批次的情况下，判断所有的附件是否包含必填附件信息
			let list = attachList.filter(item => item.delFlag != 1);
			let flag = requiredList.every(items => list.some(itemss => itemss.type === items.key));
			if (!flag) {
				obj.errorStr = '其他材料模块-缺少必填附件';
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
		}
	}
}
</style>
