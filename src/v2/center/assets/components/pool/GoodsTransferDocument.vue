<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">货转凭证信息</p>
			<div>
				<p class="sub-title">附件信息</p>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					:rowKey="(r, index) => index"
				>
					<template
						slot="type"
						slot-scope="type"
					>
						{{ CONSTANTS.fileType[type] }}
					</template>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
				</a-table>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import Upload from '../common/Upload.vue';
export default {
	name: 'GoodsTransferDocument',
	props: ['goodTransferInfo', 'deliverInfo', 'editFlag', 'editFile'],
	data() {
		return {
			moment,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' }
			],
			fileListDataSource: []
		};
	},
	components: {
		Upload
	},
	watch: {
		goodTransferInfo: function () {
			this.dealEditData();
		}
	},
	mounted() {
		this.dealEditData();
	},
	computed: {
		...mapGetters('business', {
			VUEX_POOL_ASSET_OBJ: 'VUEX_POOL_ASSET_OBJ'
		})
	},
	methods: {
		dealEditData() {
			if (!this.goodTransferInfo) return;

			this.fileListDataSource = this.goodTransferInfo.list || [];
		},

		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				const t = {
					...item
				};

				this.fileListDataSource.push(t);
			});
		},
		deleteFiles(items, _index) {
			// 删除附件
			this.fileListDataSource[_index].delFlag = 1;
		},

		onSubmit() {
			if (this.fileListDataSource.filter(item => item.delFlag == 0).length == 0) {
				this.$message.error('货转凭证缺少附件');
				return false;
			}

			return {
				list: this.fileListDataSource
			};
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;
	.content {
		padding: 0 15px;
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		p {
			margin-bottom: 15px;
		}

		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.partBox {
		margin-bottom: 30px;
		.littleTitle {
			margin-bottom: 10px;
			p {
				line-height: 28px;
				display: inline-block;
			}
			.typeBox {
				margin-left: 52px;
				display: inline-block;
				button {
					height: 28px;
					margin-right: 10px;
				}
			}
			span {
				float: right;
				color: #6b6f76;
				font-size: 12px;
				line-height: 28px;
			}
		}
		::v-deep.ant-table-wrapper {
			margin: 12px 0 10px 0;
		}
	}
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		float: right;
		display: inline-block;
		margin-right: 15px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
