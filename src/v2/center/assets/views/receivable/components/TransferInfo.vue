<template>
	<div class="returned-info">
		<p class="title">货转凭证信息</p>
		<div class="returned-info-top">
			<div class="returned-info-left">
				<div
					class="slTitleThird"
					style="margin-top: 0"
				>
					<span class="sub-title sub-title2">货转凭证信息</span>
				</div>
				<Upload
					@uploadFiles="getUploadFiles"
					style="margin-left: 20px"
					class="returned-info-right"
					v-if="editFlag"
					type="MANUAL_GOOD_TRANSFER_CERTIFICATION"
					btnText="上传货转证明"
				></Upload>
				<!-- <div class="returned-info-top-item">
          <p class="c4 ft12">货转张数</p>
          <p class="c8 ft20 fw600">{{effectiveList.length}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">货转总数(吨)</p>
          <p class="c8 ft20 fw600">{{formatMoney(allQuantity)}}</p>
        </div> -->
			</div>
			<!-- <a-button type='primary' class="returned-info-right"  @click="addSettle">上传货转证明</a-button> -->
		</div>
		<!-- 结算单信息 -->
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				:rowKey="(r, index) => index"
				:scroll="{ x: 400 }"
				:dataSource="effectiveList"
				:pagination="false"
			>
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
						v-if="editFlag"
						:min="0.01"
						:precision="2"
						v-model="items.quantity"
					/>
					<span v-else>{{ items.quantity }}</span>
				</template>
				<template
					slot="openTime"
					slot-scope="name, items"
				>
					<a-date-picker
						type="date"
						v-model="items.openTime"
						@disabledDate="disabledDate"
						v-if="editFlag"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						placeholder="请选择"
					/>
					<span v-else>{{ items.openTime }}</span>
				</template>
				<template
					slot="action"
					slot-scope="action, items, index"
				>
					<a-popconfirm
						title="确定删除该附件?"
						okText="确定"
						v-if="editFlag"
						cancelText="取消"
						@confirm="() => deleteFiles(items, index)"
					>
						<a href="javascript:;">删除</a>
					</a-popconfirm>
				</template>
			</a-table>
			<div
				v-if="editFlag"
				style="margin-top: 20px"
			>
				<span>货转张数：{{ list.length }}张</span>
				<span style="margin: 0 20px">货转总数：{{ formatMoney(allQuantity) }}吨</span>
			</div>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import Upload from '@/v2/center/assets/components/common/Upload.vue';
import moment from 'moment';
// colums
const columns = [
	{ title: '凭证类型', dataIndex: 'type', customRender: t => '货权转移证明', width: 150 },
	{ title: '初始文件名', dataIndex: 'name', scopedSlots: { customRender: 'name' }, width: 300 },
	{ title: '转换文件名', dataIndex: 'transferName', customRender: t => t || '-', width: 150 },
	{ title: '货转数量(吨)', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' }, width: 200 },
	{ title: '货转开具时间', dataIndex: 'openTime', scopedSlots: { customRender: 'openTime' }, width: 200 },
	{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
];
import ENV from '@/v2/config/env';
export default {
	props: {
		// 结算单信息
		contractInfo: {
			default: () => {
				return {};
			}
		},
		editFlag: {
			default: true
		},
		// 是否是金融机构
		isJr: {
			default: false
		},
		manualTransfer: {
			default: () => {
				return { list: [] };
			}
		}
	},
	data() {
		return {
			// columns,
			list: [],
			selectedRowKeys: [],
			previewImg: '',
			ENV
		};
	},
	computed: {
		// 计算货转吨数
		allQuantity() {
			let num = 0;
			this.effectiveList.forEach(el => {
				num += el.quantity || 0;
			});
			return num;
		},
		// 有效货转数据
		effectiveList() {
			return this.list.filter(el => el.delFlag == 0);
		},
		columns() {
			if (this.isJr || !this.editFlag) {
				return [
					{ title: '凭证类型', dataIndex: 'type', customRender: t => '货权转移证明', width: 150 },
					{ title: '初始文件名', dataIndex: 'name', scopedSlots: { customRender: 'name' }, width: 300 },
					{ title: '转换文件名', dataIndex: 'transferName', customRender: t => t || '-', width: 150 },
					{ title: '货转数量(吨)', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' }, width: 200 },
					{ title: '货转开具时间', dataIndex: 'openTime', scopedSlots: { customRender: 'openTime' }, width: 200 }
					// { title: '操作', key: 'action', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
				];
			}
			return columns;
		}
	},
	watch: {
		manualTransfer: {
			handler(info) {
				if (info) {
					const arr = info.list || [];
					this.list = arr.filter(el => el.locked == 1);
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {},

	methods: {
		formatMoney,
		init(data) {
			this.list = data;
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		disabledDate(current) {
			if (!this.VUEX_MANUAL_ASSET_OBJ.contractTime) {
				return false;
			}
			return current && current > moment(this.VUEX_MANUAL_ASSET_OBJ.contractTime);
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			this.list = [...this.list, ...data];
		},
		// 删除附件
		deleteFiles(items, _index) {
			this.list[_index].delFlag = 1;
		},
		onSubmit() {
			// 检测当前缺少必填项
			if (!this.list.length) {
				this.$message.error('缺少货转信息');
				return false;
			}
			const flag = this.list.some(el => !el.openTime || !el.quantity);
			if (flag) {
				this.$message.error('货转信息日期和数量必填');
				return false;
			}
			if (!this.effectiveList.length) {
				this.$message.error('缺少货转信息');
				return;
			}
			this.list.forEach(el => {
				el.openTime = moment(el.openTime).format('YYYY-MM-DD');
			});

			return { list: this.list };
		}
	},
	components: {
		Upload
	}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.sub-title {
	font-family: PingFangSC-Medium;
	position: relative;
	margin-left: 10px;

	&:before {
		content: '';
		float: left;
		position: absolute;
		left: -10px;
		top: 3px;
		width: 4px;
		height: 14px;
		background: @primary-color;
	}
}
.title {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
	margin-bottom: 20px;
	color: #000;
}
.new-table2 {
	/deep/ .ant-table-body {
	}
	/deep/ tr.ant-table-expanded-row td {
		border-top: 1px solid #e5e6eb;
	}
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.returned-info {
	&-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		&-item {
			width: 188px;
			height: 80px;
			flex-shrink: 0;
			padding: 12px;
			box-sizing: border-box;
			border-radius: 6px;
			background: #f0f8ff;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-right: 20px;
			&.common {
				background: #ebfaef;
			}
		}
	}
	&-left {
		display: flex;
		align-items: center;
	}
	&-right {
		display: flex;
		width: 116px;
		height: 32px;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
	}
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
	}
}
.c4 {
	color: rgba(0, 0, 0, 0.4);
}
.c8 {
	color: rgba(0, 0, 0, 0.8);
}
.ft12 {
	font-size: 12px;
}
.ft20 {
	font-size: 20px;
}
.fw600 {
	font-weight: 600;
}
</style>
