<template>
	<a-card
		class="custom-card-title"
		title="企业资料管理 - 企业财报详情"
		:bordered="false"
	>
		<a-button
			class="add"
			ghost
			type="primary"
			@click="$router.go(-1)"
		>
			返回
		</a-button>
		<div class="info">
			<a-form-model
				:model="formData"
				ref="formData"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 14 }"
			>
				<div class="info-item">
					<p class="title">基本信息</p>
					<a-row :gutter="10">
						<a-col :span="12">
							<a-col :span="24">
								<a-form-model-item label="财报类型">
									<a-input
										:value="formData.reportTypeDesc"
										disabled
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="24">
								<a-form-model-item label="财报年度">
									<a-input
										:value="formData.reportYear"
										disabled
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="24">
								<a-form-model-item label="企业名称">
									<a-input
										:value="formData.companyName"
										disabled
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="24">
								<a-form-model-item label="统一社会信用代码">
									<a-input
										:value="formData.companyCreditCode"
										disabled
									/>
								</a-form-model-item>
							</a-col>
						</a-col>
					</a-row>
				</div>
				<div class="info-item">
					<p class="title">企业财报</p>
					<a-table
						:columns="taxTableColumns"
						rowKey="path"
						:dataSource="formData.reportAttachList || []"
						:pagination="false"
						:scroll="{ x: true }"
					>
						<template
							slot="operation"
							class="table-operation"
							slot-scope="record"
						>
							<a-space :size="10">
								<a @click="taxLook(record)">查看</a>
								<a @click="download(record)">下载</a>
							</a-space>
						</template>
					</a-table>
				</div>
			</a-form-model>
			<image-viewer ref="imageViewer" />
		</div>
	</a-card>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_FinanceReportDetail } from '@/v2/api/account';
import { API_GETCURRENTENV, API_getCommonDownload } from '@/v2/api/common';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';

export default {
	data() {
		return {
			formData: {},
			id: '',
			taxTableColumns: [
				{
					title: '文件名称',
					dataIndex: 'name',
					key: 'name'
				},
				{
					title: '文件类型',
					dataIndex: 'type',
					key: 'type'
				},
				{
					title: '财报年度',
					dataIndex: 'reportYear',
					key: 'reportYear'
				},
				{
					title: '上传时间',
					dataIndex: 'createdDate',
					key: 'createdDate'
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					width: 150,
					align: 'center',
					fixed: 'right'
				}
			]
		};
	},
	components: {
		imageViewer
	},
	methods: {
		//加载详情
		async getDetail() {
			//加载详情
			await API_FinanceReportDetail(this.id).then(res => {
				if (res.success) {
					this.formData = res.data;
				}
			});
		},
		//查看附件
		taxLook(record) {
			//判断文件是否为图片
			let url = record.path;
			let ext = url.substr(url.lastIndexOf('.') + 1);
			let zip = ['zip', 'rar'].indexOf(ext.toLowerCase()) !== -1;
			if (zip) {
				API_getCommonDownload(record.path).then(res => {
					comDownload(res, null, record.name);
				});
			} else {
				filePreview(API_GETCURRENTENV(url), this.$refs.imageViewer.show);
			}
		},
		//下载附件
		download(record) {
			API_getCommonDownload(record.path).then(res => {
				comDownload(res, null, record.name);
			});
		}
	},
	created() {
		this.id = this.$route.query.id;
		this.type = this.$route.query.type;
		if (this.id) {
			this.getDetail();
		} else {
			//如果没有id为异常，返回列表
			this.$router.push('/center/account/company/customer');
		}
	}
};
</script>
<style lang="less" scoped>
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.info {
	background: #ffffff;
	.info-item {
		margin-bottom: 16px;
		::v-deep .ant-descriptions-item-label {
			text-align: right;
			font-size: 14px;
			color: #999999;
			min-width: 130px;
		}
		::v-deep .ant-descriptions-item-content {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			text-align: left;
			max-width: calc(100% - 130px);
		}
		.title {
			margin-bottom: 10px;
			padding-bottom: 0;
			font-size: 14px;
			font-weight: 600;
		}
	}
}
</style>
