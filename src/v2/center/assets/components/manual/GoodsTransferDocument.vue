<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">
				货转凭证信息<span
					class="redTips"
					v-if="editFlag"
					>必须存在附件</span
				>
			</p>
			<!-- 运输方式为动力煤船运-->
			<div
				class="partBox"
				v-if="editFlag || editFile"
			>
				<Upload
					@uploadFiles="getUploadFiles"
					type="MANUAL_GOOD_TRANSFER_CERTIFICATION"
					btnText="上传货转证明"
				></Upload>
				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="path"
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
					<template
						slot="quantity"
						slot-scope="name, items"
					>
						<a-input-number
							:min="0"
							v-model="items.quantity"
							:disabled="items.editFlag == 0"
							@change="changeQ(items)"
						/>
					</template>
					<template
						slot="openTime"
						slot-scope="name, items"
					>
						<a-date-picker
							type="date"
							:disabled="items.editFlag == 0"
							v-model="items.openTime"
							@disabledDate="disabledDate"
							format="YYYY-MM-DD"
							placeholder="请选择"
						/>
					</template>
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
					<template
						slot="action"
						slot-scope="action, items, index"
					>
						<a-popconfirm
							v-if="!items.locked && (items.editFlag == null || items.editFlag == 1)"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items, index)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
			</div>
			<div v-if="!editFlag && !editFile">
				<p class="sub-title">附件信息</p>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
					:scroll="{ x: true }"
					rowKey="path"
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
					<template
						slot="openTime"
						slot-scope="name, items"
					>
						{{ moment(items.openTime).format('YYYY-MM-DD') }}
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
	props: ['goodTransferInfo', 'contractInfo', 'deliverInfo', 'editFlag', 'editFile'],
	data() {
		return {
			moment,
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '货转数量(吨)', dataIndex: 'quantity', key: 'quantity', scopedSlots: { customRender: 'quantity' } },
				{ title: '货转开具时间', dataIndex: 'openTime', key: 'openTime', scopedSlots: { customRender: 'openTime' } }
			],

			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '货转数量(吨)', dataIndex: 'quantity', key: 'quantity', scopedSlots: { customRender: 'quantity' }, width: 200 },
				{ title: '货转开具时间', dataIndex: 'openTime', key: 'openTime', scopedSlots: { customRender: 'openTime' }, width: 200 },
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 60, align: 'center' }
			], // 编辑附件表头
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
			VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
		})
	},
	methods: {
		dealEditData() {
			if (!this.goodTransferInfo) return;
			this.fileListDataSource = this.goodTransferInfo.list || [];
			this.fileListDataSource.forEach(item => {
				item.openTime = moment(item.openTime);
				// item.quantity = ''
			});
		},
		disabledDate(current) {
			if (!this.VUEX_MANUAL_ASSET_OBJ.contractTime) {
				return false;
			}
			return current && current > moment(this.VUEX_MANUAL_ASSET_OBJ.contractTime);
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				const t = {
					...item,
					quantity: 0
				};

				this.fileListDataSource.push(t);
			});
		},
		deleteFiles(items, _index) {
			// 删除附件
			this.fileListDataSource[_index].delFlag = 1;
		},
		changeQ(items) {},
		onSubmitList() {
			return this.onSubmit().list || [];
		},
		onSubmit() {
			if (this.fileListDataSource.filter(item => item.delFlag == 0).length == 0) {
				this.$message.error('货转凭证缺少附件');
				return false;
			}
			let flag = false;
			for (var i = 0; i < this.fileListDataSource.length; i++) {
				var item = this.fileListDataSource[i];
				if (!item.openTime || !item.quantity) {
					this.$message.error('货转凭证缺少必填信息');
					flag = true;
					break;
				}
				item.openTime = typeof item.openTime == 'string' ? item.openTime : item.openTime.format('YYYY-MM-DD');
				// item.quantity = item.quantityTemp
			}

			if (flag) return false;

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
