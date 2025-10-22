<template>
	<div class="slMain warningDetail">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">预警详情</span>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">基本信息</div>
				<a-row class="a-row">
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警流水号">
							{{ detail.serialNo }}
						</a-form-item>
						<a-form-item label="预警类型">
							{{ detail.alertTypeBelongDesc }}
						</a-form-item>
						<a-form-item label="预警状态">
							{{ detail.alertStatusDesc }}
						</a-form-item>
						<a-form-item label="订单编号">
							<a @click="openOrder">{{ detail.orderNo }}</a>
						</a-form-item>
						<a-form-item label="业务线号">
							<a
								v-if="detail.industry == 'COAL'"
								@click="openLine"
								>{{ detail.lineNo }}</a
							>
							<span v-else>{{ detail.lineNo }}</span>
						</a-form-item>
						<a-form-item label="上游负责人"> {{ detail.director }}&nbsp;{{ detail.directorMobile }} </a-form-item>
						<a-form-item :label="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' ? '应付账款编号' : '应收账款编号'">
							<a @click="openAsset">{{ detail.assetNo }}</a>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警日期">
							{{ detail.alertDate }}
						</a-form-item>
						<a-form-item label="预警名称">
							{{ detail.ruleName }}
						</a-form-item>
						<a-form-item label="风险等级">
							{{ detail.riskLevelDesc }}
						</a-form-item>
						<a-form-item label="合同编号">
							{{ detail.contractNo }}
						</a-form-item>
						<a-form-item label="业务线名称">
							{{ detail.businessLineName }}
						</a-form-item>
						<a-form-item label="下游负责人"> {{ detail.terminalDirector }}&nbsp;{{ detail.terminalDirectorMobile }} </a-form-item>
						<a-form-item label="资金类型">
							{{ detail.paymentName }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>

			<div class="yj-content">
				<div class="slTitleAssis">预警明细</div>
				<!-- 待处理、审批驳回状态下展示申诉按钮 -->
				<a-button
					v-if="
						this.detail.alertStatus === 'TO_BE_PROCESS' ||
						this.detail.alertStatus === 'APPROVED_REJECT' ||
						this.detail.alertStatus === 'FOLLOWED'
					"
					type="primary"
					class="btn"
					@click="appeal"
					>申诉</a-button
				>
				<a-row class="a-row">
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="预警内容">
							{{ detail.alertContent || '' }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row class="a-row">
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="预警明细">
							{{ detail.riskDetail || '' }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>

			<div class="yj-content">
				<div class="slTitleAssis">人工处理明细</div>
				<a-table
					:columns="columns"
					rowKey="createTime"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<div
						slot="files"
						slot-scope="files, record"
					>
						<a @click="viewFiles(record.attachmentList)">查看附件</a>
					</div>
				</a-table>

				<div
					class="btn-wrapper"
					v-if="!appealFlag"
				>
					<a-button @click="$router.push('/center/message/index')">返回</a-button>
				</div>
			</div>

			<div
				class="yj-content appealBox"
				ref="appealBody"
				v-show="appealFlag"
			>
				<div class="title">预警申诉信息</div>
				<a-row class="a-row">
					<a-form-model
						ref="ruleForm"
						:model="form"
						:rules="rules"
					>
						<a-form-model-item
							ref="remark"
							label="情况说明"
							prop="remark"
							:colon="false"
							:wrapper-col="{ span: 20 }"
						>
							<div class="tips">
								<a-icon type="exclamation-circle" />
								<span>业务处理后状态仍为“未处理”，请说明原因，由平台风控人员审核后，将预警进行人工处理</span>
							</div>
							<a-textarea
								:rows="5"
								:maxLength="500"
								v-model="form.remark"
								placeholder="请输入0-500字的内容"
							/>
						</a-form-model-item>
						<a-form-model-item
							ref="file"
							label="附件信息"
							prop="file"
							:colon="false"
							:wrapper-col="{ span: 20 }"
						>
							<div class="tips">
								<a-icon type="exclamation-circle" />
								<span>请上传证明材料进行辅助说明，如业务处理的截图、其他材料等</span>
							</div>
							<div class="upload-wrap">
								<FilesUpload
									:ifEditable="true"
									@uploadFiles="getUploadFiles"
									:type="['DESCRIPTION', '']"
									:fileDataSource="fileDataSource"
									tabType="RiskControalWarning"
								/>
							</div>
						</a-form-model-item>
					</a-form-model>
					<div
						class="btn-wrapper"
						v-if="appealFlag"
					>
						<a-button @click="$router.go(-1)">返回</a-button>
						<a-button
							type="primary"
							@click="onSubmit"
							>确定</a-button
						>
					</div>
				</a-row>
			</div>
		</a-card>
		<a-modal
			title="附件信息"
			:visible="filesModalVisible"
			width="80%"
			@cancel="
				() => {
					filesModalVisible = false;
				}
			"
			:footer="null"
		>
			<a-table
				:pagination="false"
				:columns="filesColumns"
				:data-source="filesList"
				rowKey="id"
				:scroll="{ x: true }"
			>
				<div
					slot="action"
					slot-scope="action, items"
				>
					<a
						href="javascript:;"
						v-if="items != null"
						@click="handlePreview(items)"
						>查看</a
					>
				</div>
			</a-table>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import FilesUpload from '@/v2/center/monitoring/components/FilesUpload';
import { API_riskAlertDetail, API_saveComplainData, API_GETCURRENTENV } from '@/v2/center/monitoring/api';
import { mapGetters } from 'vuex';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';

export default {
	data() {
		return {
			BASE_NET: ENV.BASE_NET,
			columns: [
				{ title: '操作时间', dataIndex: 'createTime' },
				{
					title: '操作人',
					dataIndex: 'createName',
					scopedSlots: { customRender: 'createName' }
				},
				{ title: '操作类型', dataIndex: 'operationTypeDesc' },
				{ title: '处理意见', dataIndex: 'remark' },
				{
					title: '附件',
					scopedSlots: { customRender: 'files' },
					fixed: 'right'
				}
			],
			filesColumns: [
				{ title: '类型', dataIndex: 'typeDesc', key: 'typeDesc' },
				{ title: '文件名', dataIndex: 'name', key: 'name' },
				{
					title: '操作',
					scopedSlots: { customRender: 'action' },
					fixed: 'right'
				}
			],
			dataSource: [],
			loading: false,
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			},
			params: {},
			detail: {},
			form: {},
			rules: {
				remark: [{ required: true, message: '请输入情况说明', trigger: 'blur' }]
			},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			appealFlag: false, // 是否申诉
			filesModalVisible: false,
			filesList: []
		};
	},
	components: {
		FilesUpload,
		imageViewer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		appealFlag: function (data) {
			this.appealFlag = data;
		},
		$route(to) {
			this.getDetail();
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_riskAlertDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.result ? res.result.riskAlertRecordVO : {};
					this.dataSource = res.result ? res.result.processLogList : [];
				}
			});
		},
		viewFiles(fileInfoList) {
			fileInfoList.forEach((item, index) => {
				item.id = index;
			});
			this.filesModalVisible = true;
			this.filesList = fileInfoList;
		},
		getUploadFiles(data) {
			const result = [];
			data.forEach((item, index) => {
				result.push({
					name: item.name,
					url: item.url,
					type: item.type,
					id: index,
					dataSource: item.dataSource,
					md5Hex: item.md5Hex
				});
			});
			this.fileInfos = result;
		},
		appeal() {
			this.appealFlag = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.appealBody.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				});
			});
		},
		onSubmit() {
			// 提交申诉
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					let dataObj = {};
					dataObj.remark = this.form.remark;
					dataObj.riskAlertId = this.detail.id;
					dataObj.riskAlertNo = this.detail.serialNo;
					dataObj.fileInfoList = this.fileInfos;
					API_saveComplainData(dataObj).then(res => {
						if (res.success) {
							this.$message.success('提交成功！');
							this.$router.back();
						}
					});
				}
			});
		},
		openAsset() {
			const { href } = this.$router.resolve({
				path:
					this.VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY'
						? '/center/assets/payable/manage/detail'
						: '/center/assets/receivable/detail',
				query: {
					id: this.detail.assetId,
					activeIndex: '0'
				}
			});
			window.open(href, '_new');
		},
		openOrder() {
			let path = '/center/contract/' + this.$route.query.orderType + '/online/detail';
			const query = {
				id: this.detail.orderId,
				type: this.$route.query.orderType.toUpperCase()
			};
			if (this.detail.industry == 'STEEL') {
				path = '/center/steels/contract/buy/detail';
				query.flag = 'sell';
			}

			const { href } = this.$router.resolve({
				path,
				query
			});

			window.open(href, '_new');
		},
		openLine() {
			const { href } = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: this.detail.upOrderNo,
					downOrderNo: this.detail.downOrderNo,
					businessLineType: this.detail.businessLineType,
					contractContentActiveIndex: '0',
					cashTabIndex: '0',
					contractType: '0',
					downstreamActiveIndex: '0',
					businessLineNo: this.detail.businessLineNo || this.detail.lineNo
				}
			});
			window.open(href, '_new');
		},
		handlePreview(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.slTitleAssis {
		margin-bottom: 10px;
	}
}
.warningDetail {
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	::v-deep .ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	background-color: #f4f5f8;
	.yj-content {
		background-color: #fff;
		margin-bottom: 10px;
		position: relative;
		border-radius: 2px;
	}
	.title {
		font-size: 15px;
		padding: 15px 0;
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			min-width: 100px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
	.btn {
		position: absolute;
		top: 30px;
		right: 30px;
		z-index: 99;
	}
	textarea {
		resize: none;
	}
	.appealBox ::v-deep.ant-form-item-control-wrapper {
		padding: 0 20px;
		width: 100%;
	}
	.tips {
		color: orange;
		a-text {
			margin-left: 5px;
		}
	}
	.btn-wrapper {
		text-align: center;
		margin-top: 40px;
		button + button {
			margin-left: 50px;
		}
	}
}
</style>
