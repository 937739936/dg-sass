<template>
	<div class="attachment">
		<a-table
			class="new-table bordered"
			:columns="columns"
			bordered
			:data-source="dataSource"
			:rowKey="(record, index) => index"
			:pagination="false"
		>
			<template slot="typeName"> 补充协议 </template>
			<div
				slot="fileList"
				slot-scope="text, record, index"
			>
				<div class="name-box">
					<div
						v-for="(item, i) in record.fileList"
						:key="i"
						class="name detail"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.uploadTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}</span
							>
						</a-tooltip>
					</div>
				</div>
			</div>

			<div
				slot="remark"
				slot-scope="text, record, index"
			>
				<div v-show="record.signDate">
					<p class="remark-item">
						<span class="remark-top">补协签订日期：</span>
						<span>{{ record.signDate }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协签章状态：</span>
						<span>{{ record.signStatus == 2 ? '双签' : '单签' }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">补协执行日期：</span>
						<span>{{ record.executionDateStart }} 至 {{ record.executionDateEnd }}</span>
					</p>
					<p class="remark-item">
						<span class="remark-top">变更项目信息：</span>
						<span>
							<span
								v-for="(item, i) in record.changeItem"
								:key="i"
								>{{ item.text }} {{ i == record.changeItem.length - 1 ? '' : '、' }}</span
							></span
						>
					</p>
				</div>
			</div>
		</a-table>
	</div>
</template>

<script>
import { API_GETCURRENTENV } from 'api/index';
export default {
	props: {},
	data() {
		return {
			columns: [
				{ title: '单据类型', dataIndex: 'typeName', scopedSlots: { customRender: 'typeName' }, width: 210 },
				{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
				{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 394 }
			],
			dataSource: [],

			fileList: []
		};
	},
	computed: {},
	watch: {},
	methods: {
		init(info) {
			this.detailInfo = info;
			const supplementalInfo = info.supplementalInfo || [];

			supplementalInfo.forEach(el => {
				let changeItemList = [];
				let changeItem = (el.changeItem && el.changeItem.split(',')) || [];

				let changeItemDesc = (el.changeItemDesc && el.changeItemDesc.split(',')) || [];

				changeItem.forEach((el2, i) => {
					changeItemList.push({ value: el2, text: changeItemDesc[i] });
				});

				el.executeDate = [el.executionDateStart, el.executionDateEnd];
				el.supplementalFile = el.supplementalFile || [];
				el.supplementalFile.forEach(el2 => {
					el2.fileName = el2.name;
				});
				el.changeItem = changeItemList;

				el.fileList = el.supplementalFile;
			});

			if (supplementalInfo.length) {
				this.dataSource = supplementalInfo;
			} else {
				this.dataSource = [];
			}
		},
		handlePreview(data) {
			this.$emit('handlePreview', data);
		},
		// 去往补充协议详情
		look(item) {
			let path = `/center/contract/agreement/downSuppleDetail?id=${item.supplementalAgreementId}`;
			window.open(path);
		},
		async downloadSupple(item) {
			this.$emit('downloadSupple', item.serialNo);
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	.title {
		margin-top: 30px;
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
		color:  @primary-color;
		margin-right: 14px;
		margin-bottom: 10px;
	}
	.detail {
		background: #fff;
		.preview {
			cursor: pointer;
			padding-right: 14px;
			padding-left: 14px;
			border-left: 1px solid #e9effc;
		}
		.preview:first-child {
			padding-left: 0;
			border-left: 0;
		}
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
	img {
		width: 16px;
		height: 16px;
	}
}
.upload {
	color:  @primary-color;
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
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr:first-child > td:first-child {
		height: 48px;
	}
	/deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
		background: #fff !important;
	}
}
.remark-item {
	color: #77889d;
	font-size: 14px;
	line-height: 22px;
}
.btn-box {
	display: flex;
	align-items: center;
	justify-content: space-around;
}
</style>
