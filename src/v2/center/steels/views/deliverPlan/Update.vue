<template>
	<div class="slMain">
		<Breadcrumb :routes="routes" />
		<a-card
			:bordered="false"
			class="a-card-border-bottom"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>修改发货计划</span>
			</div>
			<div>
				<div class="slTitleAssis">基本信息</div>
				<a-form
					:form="baseInfoForm"
					:colon="false"
					class="slFormDetail"
				>
					<a-row>
						<a-col :span="8">
							<a-form-item label="发货企业">
								<a-input
									disabled
									v-model="detail.sellCompanyName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="收货仓库">
								<a-input
									disabled
									v-model="detail.warehouseAbbreviation"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="货主企业">
								<a-input
									disabled
									v-model="VUEX_ST_COMPANYSUER.companyName"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="运输方式">
								<a-input
									disabled
									v-model="detail.transportModeDesc"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="到库通知人员">
								<a-input
									disabled
									v-model="detail.noticeUsers"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item label="上游合同号">
								<a-input
									disabled
									v-model="detail.contractNo"
								></a-input>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>

				<div class="slTitleAssis">发运货物明细</div>
				<DeliverDetails
					ref="deliverDetails"
					type="update"
					:transportMode="detail.transportMode"
					:datas="particularsList"
				/>
				<div class="slTitleAssis">
					附件信息
					<a-button
						type="primary"
						ghost
						style="margin-left: 30px"
						@click="addFiles"
						>新增附件</a-button
					>
				</div>
				<div class="upload-wrap">
					<FileUpload
						:ifEditable="true"
						@uploadFiles="getUploadFiles"
						:fileDataSource="fileDataSource"
						:type="'deliverPlan'"
						:transType="detail.transportMode"
						ref="uploadFiles"
					>
					</FileUpload>
				</div>
			</div>
			<div class="btn-wrap">
				<a-button
					type="primary"
					@click="handleSubmit()"
					>提交</a-button
				>
				<a-button @click="$router.push('/center/steels/deliverPlan/list')">取消</a-button>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/center/steels/components/Breadcrumb.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import DeliverDetails from './components/DeliverDetails.vue';
import FileUpload from './components/FileUpload.vue';
import { API_ShipmentPlanDetail, API_ShipmentPlanUpdateParticulars } from '@/v2/center/steels/api/deliverPlan.js';
import { mapGetters } from 'vuex';
export default {
	name: 'Update',
	data() {
		return {
			getPopupContainer,
			baseInfoForm: this.$form.createForm(this, { name: 'baseInfo' }),
			routes: [
				{
					path: '',
					name: '发货计划管理'
				},
				{
					path: '/center/steels/deliverPlan/list',
					name: '发货计划'
				},
				{
					path: '/center/steels/deliverPlan/update',
					name: '修改发货计划'
				}
			],
			fileInfos: [],
			fileDataSource: [],
			fileType: {
				TRUCKS: [
					{
						key: 'SHIPMENT_PLAN_PARTICULARS',
						label: '钢厂发货计划清单',
						required: true
					}
				]
			},
			detail: {},
			particularsList: []
		};
	},
	components: {
		Breadcrumb,
		DeliverDetails,
		FileUpload
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		}
	},
	methods: {
		getDetail() {
			API_ShipmentPlanDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detail = res.data || {};
					let str = '';
					if (this.detail.noticeUsers.length) {
						this.detail.noticeUsers.forEach(item => {
							str = str + item.noticeName + '-' + item.noticePhone;
						});
					}
					this.detail.noticeUsers = str;
					this.fileDataSource = this.detail.attachList || [];
					this.fileInfos = this.detail.attachList || [];
					this.particularsList = this.detail.particularsList || [];
					if (this.detail.particularsList.length) {
						// 未到库
						let NOT_ARRIVED_ARR = this.detail.particularsList.filter(item => item.arriveStatus === 'NOT_ARRIVED');
						// 部分到库
						let PART_ARRIVED_ARR = this.detail.particularsList.filter(item => item.arriveStatus === 'PART_ARRIVED');
						// 已到库
						let ARRIVED_ARR = this.detail.particularsList.filter(item => item.arriveStatus === 'ARRIVED');
						this.particularsList = NOT_ARRIVED_ARR.concat(PART_ARRIVED_ARR).concat(ARRIVED_ARR);
					}
				}
			});
		},
		validMobile(rule, value, callback) {
			var numReg = /^[0-9]*$/;
			if (numReg.test(value)) {
				if (!/^1[3456789]\d{9}$/.test(value)) {
					callback('请输入正确的手机号');
				}
				callback();
			}
			callback();
		},
		validLength(rule, value, callback) {
			if (value.length && value.length > 60) {
				callback('长度要在1和60之间');
			}
			callback();
		},
		addFiles() {
			this.$refs.uploadFiles.addFileType();
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		verifyFile() {
			let transType = this.detail.transportMode;
			let fileType = '';
			let success = true;
			this.fileInfos.map(item => {
				fileType += item.attachmentType;
			});
			this.fileType[transType]
				.filter(item => item.required)
				.map(item => {
					if (!fileType.includes(item.key)) {
						this.$message.error(`请上传${item.label}附件`);
						success = false;
					}
				});
			return success;
		},
		handleSubmit() {
			// 校验发运明细
			let dataSource = this.$refs.deliverDetails.form.tableDataSource;
			let detailsValid = this.$refs.deliverDetails.handleSubmit();
			if (!detailsValid) {
				return;
			}
			let dataObj = {};
			dataObj.id = this.$route.query.id || '';
			dataObj.particularsList = dataSource;
			// 校验附件
			if (!this.verifyFile()) {
				return;
			}
			dataObj.attachList = this.fileInfos;
			API_ShipmentPlanUpdateParticulars(dataObj).then(res => {
				if (res.success) {
					this.$message.success('提交成功');
					this.$router.push('/center/steels/deliverPlan/list');
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.upload-wrap {
	margin-top: 20px;
}
/deep/.ant-select-selection__rendered,
/deep/.ant-select-selection {
	height: auto !important;
}
</style>
