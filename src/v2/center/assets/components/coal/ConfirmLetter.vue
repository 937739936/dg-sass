<template>
	<div class="contentBox">
		<div
			class="content"
			v-if="confirmLetterInfo"
		>
			<p class="title">确认函信息</p>
			<p class="sub-title">附件信息</p>
			<a-table
				:pagination="false"
				:columns="noFileName ? noFileNameFilesColumns : filesColumns"
				:data-source="confirmLetterInfo.list"
				:scroll="{ x: true }"
				rowKey="index"
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
</template>
<script>
export default {
	name: 'ConfirmLetter',
	props: ['confirmLetterInfo', 'noFileName'],
	data() {
		return {
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } }
			],
			noFileNameFilesColumns: [
				{ title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			]
		};
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
}
</style>
