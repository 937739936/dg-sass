<template>
	<div class="wrap">
		<a-form
			:form="form"
			:label-col="{ span: 2 }"
			:wrapper-col="{ span: 12 }"
			labelAlign="left"
		>
			<a-form-item label="导入委托单">
				<i-upload
					:action="action"
					:accept="accept"
					list-type="picture-card"
					:showDesc="false"
					:showUploadList="true"
					:limit="true"
					v-on:upload="uploadChange"
					v-decorator="['file', { rules: [{ required: true, message: '请上传委托单!' }] }]"
				>
					<p class="upload-btn"><a-icon type="plus" />上传委托单</p>
				</i-upload>
			</a-form-item>
		</a-form>
		<div>
			<p>导入要求：</p>
			<p>
				1.该功能仅支持上传Excel文件（*.xls、*.xlsx），请
				<a
					type="link"
					:href="publicPath + 'files/invoice/销项开票申请格式 v3.xlsx'"
					>下载模板</a
				>
				填写后上传，或导出历史表格修改数据后上传。
			</p>
			<p>2.请务必将必填字段填写准确完整，否则可能识别、添加失败。</p>
		</div>
		<div class="footer-wrap">
			<a-button
				class="width126px-height44px-button"
				type=""
				@click="cancel"
				>取消</a-button
			>
			<a-button
				class="width126px-height44px-button"
				type="primary"
				style="margin-left: 20px"
				@click="next"
				>下一步</a-button
			>
		</div>
	</div>
</template>

<script>
import iUpload from '@/v2/components/upload.vue';
import { API_UPLOAD_COMMISSION } from '@/v2/center/invoiceTools/api';
import storage from "@sub/utils/storage";

export default {
	data() {
		return {
			action: API_UPLOAD_COMMISSION,
			accept: '.xls,.xlsx',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			publicPath: process.env.BASE_URL
		};
	},
	components: {
		iUpload
	},
	methods: {
		uploadChange(file) {
			if (file[0]?.status === 'done') {
				storage.session.set('outExcelList', file[0].url);
			}
		},
		cancel() {
			this.$router.back();
		},
		next() {
			this.form.validateFields((err, values) => {
				if (!err) {
					this.$router.push('/center/admin/invoice/out/add/confirm');
				}
			});
		}
	},
	created() {
		storage.session.remove('outExcelList');
	}
};
</script>

<style lang="less" scoped>
.footer-wrap {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 50px;
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/common.less');
</style>
