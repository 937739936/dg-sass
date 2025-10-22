<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">附件</span>
			</div>
			<a-form-model
				ref="ruleForm"
				:model="form"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<div class="slTitleAssis">附件信息</div>
				<div class="upload-wrap">
					<FilesUpload
						:ifEditable="$route.query.type == 'detail' ? false : true"
						@uploadFiles="getUploadFiles"
						:type="[7, 5]"
						:fileDataSource="fileDataSource"
						tabType="contract"
					/>
				</div>
				<a-form-model-item
					:wrapper-col="{ span: 14, offset: 4 }"
					class="btn-wrap"
				>
					<a-button
						style="margin-left: 10px"
						@click="$router.go(-1)"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit"
						v-if="$route.query.type != 'detail'"
						>提交</a-button
					>
				</a-form-model-item>
			</a-form-model>
		</a-card>
	</div>
</template>

<script>
import FilesUpload from '@/v2/center/monitoring/components/FilesUpload';
import { API_GetContractFilesInfo, API_SaveContractFiles } from 'api';
export default {
	name: 'FilesEdit',
	components: {
		FilesUpload
	},
	created() {
		if (this.$route.query.type == 'edit' || this.$route.query.type == 'detail') {
			this.getContractFilesInfo(this.$route.query.id);
		}
	},
	data() {
		return {
			labelCol: { span: 5 },
			wrapperCol: { span: 15 },
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			disabled: this.$route.query.type == 'detail' ? true : false,
			form: {}
		};
	},
	methods: {
		async getContractFilesInfo(id) {
			const res = await API_GetContractFilesInfo(id);
			this.fileInfos = this.fileDataSource = res.data.attachmentList;
		},
		onSubmit() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.fileInfos.length == 0) {
						this.$message.error('请上传附件');
						return false;
					}
					var bodyObj = [];
					this.fileInfos.forEach(element => {
						let item = {};
						item.serialNo = this.$route.query.contractSerialNo;
						item.type = element.type;
						item.fileUrl = element.url;
						item.fileName = element.fileName;
						item.md5Hex = element.md5Hex;
						bodyObj.push(item);
					});
					API_SaveContractFiles(bodyObj).then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							this.$router.go(-1);
						}
					});
				} else {
					return false;
				}
			});
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		}
	}
};
</script>

<style lang="less" scoped>
.ant-form {
	margin-top: 30px;
	.ant-form-item-label {
		text-align: left;
	}
	.ant-row .row {
		padding-left: 30px;
		.ant-form-item-children {
			position: relative;
			span {
				position: absolute;
				top: -10px;
				right: -20px;
			}
		}
	}
	.ant-row .row:nth-child(2) {
		.ant-form-item-children span {
			right: -40px;
		}
	}
}
.title {
	margin: 0 40px;
	line-height: 32px;
	padding-bottom: 10px;
	border-bottom: 1px solid #ccc;
}
.upload-wrap {
	padding: 10px 0;
	margin-top: 10px;
}
</style>
