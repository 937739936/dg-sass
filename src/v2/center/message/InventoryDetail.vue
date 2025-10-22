<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 0"
		>
			<span
				slot="title"
				class="slTitle"
			>
				预警详情
			</span>
			<div class="divider"></div>
			<span class="slTitleAssis">基本信息</span>
			<ul class="grid-wrap">
				<li>
					<span class="label">预警流水号</span>
					<span>{{ detail.recordNo }}</span>
				</li>
				<li>
					<span class="label">预警日期</span>
					<span>{{ detail.alertDate }}</span>
				</li>
				<li>
					<span class="label">预警状态</span>
					<span>
						<div
							class="yj-status"
							:class="detail.alertStatus"
						>
							{{ detail.alertStatusDesc }}
						</div>
					</span>
				</li>
				<li>
					<span class="label">预警内容</span>
					<a-tooltip>
						<template slot="title">
							{{ detail.alertContent }}
						</template>
						<span>{{ detail.alertContent }}</span>
					</a-tooltip>
				</li>
				<li>
					<span class="label">规则名称</span>
					<span>{{ detail.ruleName }}</span>
				</li>
				<li>
					<span class="label">下游合同编号</span>
					<span>
						<a
							href="javascript:;"
							@click="goContractDetail(detail.downStreamContractNo, 'SELL')"
						>
							{{ detail.downStreamContractNo }}
						</a>
					</span>
				</li>
				<li>
					<span class="label">上游合同编号</span>
					<span>
						<a
							href="javascript:;"
							@click="goContractDetail(detail.upStreamContractNo, 'BUY')"
						>
							{{ detail.upStreamContractNo }}
						</a>
					</span>
				</li>
				<li>
					<span class="label">业务线号</span>
					<span>
						<a
							href="javascript:;"
							@click="goBusinessDetail"
						>
							{{ detail.businessLineNo }}
						</a>
					</span>
				</li>
				<li>
					<span class="label">业务线</span>
					<span>{{ detail.businessLineName }}</span>
				</li>
				<li>
					<span class="label">下游卖方名称</span>
					<span>{{ detail.sellerName }}</span>
				</li>
				<li>
					<span class="label">下游买方名称</span>
					<span>{{ detail.buyerName }}</span>
				</li>
				<li>
					<span class="label">站台名称</span>
					<span>{{ detail.stationName }}</span>
				</li>
				<li style="width: 100%">
					<span class="label">库房名称</span>
					<span>{{ detail.houseName }}</span>
				</li>
				<li style="width: 100%">
					<span class="label">货位名称</span>
					<span>{{ detail.goodsAllocationName }}</span>
				</li>
				<li style="width: 100%">
					<span class="label">货主手机号</span>
					<span>{{ detail.shipperMobile }}</span>
				</li>
			</ul>

			<div style="margin-top: 50px">
				<span class="slTitleAssis">预警明细</span>
				<a-button
					v-if="
						(this.detail.alertStatus === 'TO_BE_PROCESS' ||
							this.detail.alertStatus === 'APPROVED_REJECT' ||
							this.detail.alertStatus === 'FOLLOWED') &&
						this.detail.ruleNo !== 'YJKC001'
					"
					type="primary"
					class="btn"
					@click="isAppeal = !isAppeal"
					>申诉
				</a-button>
			</div>
			<a-row class="a-row">
				<a-col
					:span="6"
					class="row"
				>
					<div class="yj-label">
						<span>交货期限：</span>
						{{ detail.deliveryStartDate }} - {{ detail.deliveryEndDate }}
					</div>
				</a-col>
				<a-col
					:span="4"
					class="row"
				>
					<div class="yj-label">
						<span>累计入库量：</span>
						{{ detail.inboundQuantityTotal || 0 }}吨
					</div>
				</a-col>
				<a-col
					:span="4"
					class="row"
				>
					<div class="yj-label">
						<span>累计出库量：</span>
						{{ detail.outboundQuantityTotal || 0 }}吨
					</div>
				</a-col>
			</a-row>
			<div
				v-if="isAppeal"
				style="margin-bottom: 50px"
			>
				<div class="yj-title">预警申诉信息</div>
				<div class="tip">
					<img
						src="@/assets/imgs/warning/warning.png"
						alt=""
					/>
					<span>业务处理后状态仍为“未处理”，请说明原因，由平台风控人员审核后，将预警进行人工处理</span>
				</div>
				<a-form :form="form">
					<a-form-item>
						<div class="remark-box">
							<a-textarea
								:rows="5"
								:autosize="false"
								:maxLength="100"
								class="remark yj-textarea"
								v-decorator="['remark', { rules: [{ required: true, message: '请输入', whitespace: true }] }]"
								placeholder="业务处理后状态仍为“未处理”的情况说明..."
							/>

							<span class="max">100</span>
						</div>
					</a-form-item>

					<div class="yj-title">附件上传</div>
					<div class="tip">
						<img
							src="@/assets/imgs/warning/warning.png"
							alt=""
						/>
						<span>请上传证明材料进行辅助说明，如业务处理的截图、其他材料等</span>
					</div>
					<a-form-item>
						<div class="attach-box">
							<div
								class="upload-box"
								v-for="(item, index) in attachList"
								:key="index"
							>
								<img
									class="del"
									@click="del(index)"
									src="@/assets/imgs/warning/del.png"
									alt=""
								/>
								<img
									@click="handlePreview(item)"
									v-if="isPdf(item.url)"
									class="pdf"
									src="@/assets/imgs/warning/pdf.png"
									alt=""
								/>
								<img
									@click="handlePreview(item)"
									v-else
									:src="ENV.BASE_NET + item.url"
									alt=""
								/>
							</div>
							<a-upload
								name="file"
								class="picture-card"
								list-type="picture-card"
								:multiple="false"
								:headers="headers"
								:accept="accept"
								:fileList="fileList"
								:size="100"
								v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
								:showUploadList="false"
								:beforeUpload="beforeUpload"
								@change="fileChange"
							>
								<div class="upload-box-btn">
									<img
										src="@/v2/assets/imgs/storage/steel/upload.png"
										alt=""
									/>
								</div>
							</a-upload>
						</div>
					</a-form-item>
					<div class="tip2">
						<p>支持pdf，jpg，jpeg，png，bmp格式，文件大小不超过100M</p>
					</div>
				</a-form>
			</div>
			<div>
				<span class="slTitleAssis">人工处理日志</span>
			</div>
			<a-table
				:columns="columns"
				rowKey="id"
				class="new-table"
				style="margin-top: 20px"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<div
					slot="attachmentList"
					slot-scope="files, record"
				>
					<div v-if="record.attachmentList && record.attachmentList.length">
						<a
							v-for="item in record.attachmentList"
							:key="item.attachmentId"
							@click="handlePreview(item)"
							style="margin-left: 5px"
							>{{ item.fileName }}
						</a>
					</div>
					<div v-else>-</div>
				</div>
			</a-table>
			<div class="btn-wrapper">
				<a-button @click="$router.go(-1)">返回</a-button>
				<a-button
					type="primary"
					@click="onSubmit"
					v-if="isAppeal"
					>提交</a-button
				>
			</div>
		</a-card>
		<image-viewer ref="imageViewer" />
		<VideoMonitorModal ref="videoMonitorModal" />
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import VideoMonitorModal from './components/VideoMonitorModal.vue';
import { API_BusinessMonitoringCoreCompanyList } from 'api';
import { contractAttachFilesUpload } from '@/v2/api/upload';
import { mapGetters } from 'vuex';
import ENV from '@/v2/config/env';
import { API_GetInventoryWarningDetail, API_PostInventorySaveComplainData } from '@/api';
import { API_pageOrderContractList } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			columns: [
				{ title: '操作时间', dataIndex: 'createTime' },
				{ title: '操作人员', dataIndex: 'createdBy' },
				{ title: '操作类型', dataIndex: 'operationTypeDesc' },
				{ title: '处理意见', dataIndex: 'remark' },
				{ title: '附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' } }
			],
			dataSource: [],
			form: this.$form.createForm(this),
			fileList: [],
			accept: '.pdf,.jpg,.jpeg,.png,.bmp',
			beginUpload: false,
			attachList: [],
			disabled: false,
			visible: false,
			detail: {},
			isAppeal: false,
			ENV
		};
	},
	watch: {
		$route() {
			this.getDetail();
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_GetInventoryWarningDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.result.baseInfo;
					this.dataSource = res.result.processLogs;
				}
			});
		},
		goContractDetail(orderContractSerialNo, type) {
			API_pageOrderContractList({ orderContractSerialNo, orderType: type }).then(res => {
				if (res.success) {
					let detail = res.data.records[0];
					this.$router.push({
						path: '/center/contract/' + type.toLowerCase() + '/online/detail',
						query: {
							id: detail.id,
							type,
							initiatorUscc: detail.initiatorUscc,
							status: detail.status,
							statusDesc: detail.statusDesc,
							terminalContractStatus: detail.terminalContractStatus,
							terminalContractInitiatorUscc: detail.terminalContractInitiatorUscc
						}
					});
				}
			});
		},
		goBusinessDetail() {
			API_BusinessMonitoringCoreCompanyList({ businessLineNo: this.detail.businessLineNo, type: 'DynamicMonitoring' }).then(
				res => {
					if (res.success) {
						let data = res.data.records[0];
						const { upOrderNo, downOrderNo, businessLineType, businessLineNo } = data;
						this.$router.push({
							path: '/center/monitoring/dynamicMonitoring/detail',
							query: {
								upOrderNo,
								downOrderNo,
								businessLineType,
								businessLineNo,
								contractType: upOrderNo ? 0 : 1, //有上游展示上游，没有上游展示下游
								contractContentActiveIndex: 0,
								cashTabIndex: 0
							}
						});
					}
				}
			);
		},
		handlePreview(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
		},
		handlePreview2(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
			// const url = `${ENV.BASE_NET}${items.url}`
			// filePreview(url, this.$refs.imageViewer.show);
		},
		//上传前校验
		beforeUpload(file) {
			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return true;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return true;
			}
			this.handleUpload(file);
			return false;
		},
		// 1.上传
		async handleUpload(file) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			formData.append('terminalContractId', '');

			try {
				const res = await contractAttachFilesUpload(formData);
				const obj = res.data;
				obj.name = obj.fileName;
				obj.url = `${obj.fileUrl}`;
				obj.type = 'DESCRIPTION';

				this.attachList.push(obj);
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		fileChange() {},
		del(index) {
			this.attachList.forEach((el, i, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
		},
		isPdf(url) {
			const str = url.split('?')[0].split('.').pop().toLowerCase();
			return str.includes('pdf');
		},
		onSubmit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					const params = {
						remark: values.remark,
						fileInfoList: this.attachList,
						riskAlertNo: this.detail.recordNo,
						riskAlertId: this.detail.id,
						ruleTypeList: 'INVENTORY',
						type: 'INVENTORY'
					};
					if (this.disabled) {
						return;
					}
					this.disabled = true;
					try {
						const res = await API_PostInventorySaveComplainData(params);
						this.$message.success('操作成功');
						this.disabled = false;
						this.$router.go(-1);
					} catch (error) {
						this.disabled = false;
					}
				}
			});
		}
	},
	components: {
		Breadcrumb,
		imageViewer,
		VideoMonitorModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	overflow: hidden;
}

.divider {
	margin-bottom: 30px;
}

.grid-wrap {
	margin-top: 20px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;

	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;

		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}

		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}

		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}

		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: rgba(0, 0, 0, 0.8);
		}
	}

	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}

	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}

	li:last-child {
		border-radius: 0 0 3px 0;
	}

	li.special {
		border-radius: 0 3px 3px 0;
	}
}

.warning-status {
	// display: inline-block;
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}

.warning-status.TO_BE_PROCESS {
	background: #c1d7ff;
	color: #4682f3;
}

.warning-status.DELAY_HANDLE {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.TO_BE_APPROVED {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.APPROVED_REJECT {
	background: #f8dde8;
	color: #db81a5;
}

.warning-status.PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}

.warning-status.ARTIFICIAL_PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}

.HIGH {
	color: #f25f56;
}

.MEDIUM {
	color: #f5822e;
}

.LOW {
	color: #147cf6;
}

.level-box {
	display: flex !important;
	align-items: center;
	// justify-content: center;
}

.omit {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.rule-detail {
	display: flex;
	align-items: center;
	margin-top: 20px;

	img {
		width: 16px;
		margin-right: 5px;
	}

	span {
		color: rgba(0, 0, 0, 0.4);
	}
}

.tip {
	background: #e1eafe;
	border: 1px solid #d0dfff;
	border-radius: 4px;
	display: flex;
	align-items: center;
	padding: 10px 14px;
	color: rgba(0, 0, 0, 0.8);
	margin-top: 10px;
	margin-bottom: 20px;

	img {
		width: 16px;
		margin-right: 12px;
	}
}

.tip2 {
	color: rgba(119, 136, 157, 1);
	font-size: 12px;
}

.upload-box {
	width: 192px;
	height: 112px;
	margin-right: 14px;
	margin-bottom: 14px;

	border: 1px solid #e5e6eb;
	border-radius: 4px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;

	.file {
		color: #4682f3;
		cursor: pointer;
		font-size: 20px;
	}

	img {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.del {
		position: absolute;
		width: 16px;
		height: 16px;
		background: #000000;
		right: 14px;
		top: 14px;
		opacity: 0.2;
		border-radius: 61.8333px;
	}

	.pdf {
		width: 36px;
		height: 36px;
	}
}

.remark-box {
	position: relative;

	.max {
		position: absolute;
		right: 12px;
		bottom: 12px;
		color: rgba(119, 136, 157, 0.5);
	}
}

/deep/ .ant-upload.ant-upload-select-picture-card {
	border: 0;
	margin: 0;
	width: 192px;
	height: 112px;
	background: #f3f5f6;
	border: 1px dashed #e5e6eb;
	border-radius: 4px;
}

/deep/ .ant-form-item {
	margin-bottom: 5px;
}

.attach-box {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}

/deep/ .ant-upload-picture-card-wrapper {
	width: inherit;
	margin-bottom: 14px;
}

.btn-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 1px solid rgba(229, 230, 235, 1);
	width: 100vw;
	margin-left: -30px;
	margin-top: 70px;
	padding: 13px 0;

	button {
		width: 114px;
		height: 38px;
		margin: 0 5px;
	}
}

.off-line {
	/deep/ .ant-modal {
		width: 850px !important;
	}

	/deep/ .ant-modal-content {
		background: transparent;
		box-shadow: none;
		width: 850px;
		height: 450px;
	}

	/deep/ .ant-modal-body {
		width: 100%;
		height: 100%;
		padding: 0;
	}

	.off-box {
		width: 850px;
		height: 450px;
		background: rgba(23, 24, 26, 0.3);
		backdrop-filter: blur(7px);
		position: relative;
	}

	.off-tip {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		text-align: center;
		color: #fff;

		p {
			margin-top: 20px;
		}
	}

	.off-del {
		position: absolute;
		right: -20px;
		top: -10px;
		width: 20px;
		cursor: pointer;
	}
}

.yj-title {
	font-family: PingFang SC;
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.8);
}

.yj-textarea {
	width: 616px;
	height: 110px;
	padding: 14px 12px;
	margin-bottom: 30px;
}

.btn {
	width: 88px;
	float: right;
}

.yj-label {
	margin-top: 20px;
	margin-bottom: 50px;
	color: rgba(0, 0, 0, 0.8);

	span {
		color: rgba(0, 0, 0, 0.4);
	}
}

.yj-status {
	padding: 0 6px;
	line-height: 20px;
	color: #4682f3;
	display: inline-block;
	font-size: 12px;
	font-family: PingFang SC;
	border-radius: 4px;
	background: #c1d7ff;
}
.TO_BE_APPROVED {
	color: #ff7937;
	background: #ffdbc8;
}
.APPROVED_REJECT {
	color: #db81a5;
	background: #f8dde8;
}
.FOLLOWED,
.PROCESSED,
.ARTIFICIAL_PROCESSED {
	color: #3eb384;
	background: #c5ecdd;
}
</style>
