<template>
	<a-card
		class="custom-card-title"
		title="纳税信息"
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
								<a-form-model-item label="税种">
									<a-input
										:value="formData.taxCategoryDesc"
										disabled
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="24">
								<a-form-model-item label="税款所属期间">
									<a-input
										:value="`${formData.taxPeriodStart}至${formData.taxPeriodEnd}`"
										disabled
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="24">
								<a-form-model-item label="实缴(退)金额">
									<a-input-number
										:formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
										:precision="2"
										:min="0"
										:value="formData.amount"
										:step="0.01"
										style="width: 100%"
										disabled
										:parser="value => value.replace(/\￥\s?|(,*)/g, '')"
									/>
								</a-form-model-item>
							</a-col>
						</a-col>
					</a-row>
				</div>
				<div class="info-item">
					<p class="title">纳税申报表</p>
					<a-table
						:columns="taxTableColumns"
						rowKey="id"
						:dataSource="formData.taxTable || []"
						:pagination="false"
						:scroll="{ x: true }"
					>
						<template
							slot="operation"
							class="table-operation"
							slot-scope="record"
						>
							<a-space :size="10">
								<a @click="taxLook(record.path)">查看</a>
								<a @click="download(record)">下载</a>
							</a-space>
						</template>
					</a-table>
				</div>
				<div class="info-item">
					<p class="title">完税证明</p>
					<a-table
						:columns="taxTableColumns"
						rowKey="id"
						:dataSource="formData.taxPaidProof || []"
						:pagination="false"
						:scroll="{ x: true }"
					>
						<template
							slot="operation"
							class="table-operation"
							slot-scope="record"
						>
							<a-space :size="10">
								<a
									@click="taxLook(record.path)"
									v-auth="'company:attachment:tax:view'"
									>查看</a
								>
								<a
									@click="download(record)"
									v-auth="'company:attachment:tax:view'"
									>下载</a
								>
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
import { API_COMPANYTAXID } from '@/v2/api/account';
import { API_getCommonDownload } from '@/v2/center/person/api';
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
			await API_COMPANYTAXID(this.id).then(res => {
				if (res.success) {
					this.formData = res.data;
					this.formData.taxPaidProof.forEach((item, index) => (item.id = index));
					this.formData.taxTable.forEach((item, index) => (item.id = index));
				}
			});
		},
		//查看附件
		taxLook(url) {
			filePreview(url, this.$refs.imageViewer.show);
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
		if (this.type == 'edit') {
			this.getType();
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
