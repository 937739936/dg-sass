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
					<span class="label">预警日期</span>
					<span>{{ detail.alertDate }}</span>
				</li>
				<li>
					<span class="label">预警流水号</span>
					<span>{{ detail.recordNo }}</span>
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
					<span class="label">合同编号</span>
					<span>
						<a
							href="javascript:;"
							@click="goContractDetail(detail.orderContractId, detail.contractType)"
						>
							{{ detail.contractNo }}
						</a>
					</span>
				</li>
				<li>
					<span class="label">卖方名称</span>
					<span>{{ detail.sellerName }}</span>
				</li>
				<li>
					<span class="label">买方名称</span>
					<span>{{ detail.buyerName }}</span>
				</li>
				<li>
					<span class="label">站台名称</span>
					<span>{{ detail.stationName }}</span>
				</li>
			</ul>

			<div style="margin-top: 30px">
				<span class="slTitleAssis">预警明细</span>
			</div>
			<ul class="grid-wrap">
				<li style="width: 100%">
					<span class="label">预警明细</span>
					<a-tooltip>
						<template slot="title">
							{{ detail.alertContent }}
						</template>
						<span>{{ detail.alertContent }}</span>
					</a-tooltip>
				</li>
				<li>
					<span class="label">出库数量</span>
					<span>{{ detail.outboundQuantity }}吨</span>
				</li>
				<li>
					<span class="label">放货数量</span>
					<span>{{ detail.releaseQuantity }}吨</span>
				</li>
				<li v-if="detail.ruleNo == 'YJKC006'">
					<span class="label">超出数量</span>
					<span style="color: red">{{ detail.exceedQuantity }}吨</span>
				</li>
				<li
					v-if="detail.ruleNo == 'YJKC006'"
					style="width: 100%"
				>
					<span class="label">放货指令编号</span>
					<span v-if="detail.releaseInstructNo">
						<a @click="goReleaseInstruct(detail.releaseInstructId)">{{ detail.releaseInstructNo }}</a>
					</span>
					<span v-else>-</span>
				</li>
				<li v-else>
					<span class="label">放货指令编号</span>
					<span v-if="detail.releaseInstructNo">
						<a @click="goReleaseInstruct(detail.releaseInstructId)">{{ detail.releaseInstructNo }}</a>
					</span>
					<span v-else>-</span>
				</li>
			</ul>

			<div style="margin-top: 30px">
				<span class="slTitleAssis">人工处理明细</span>
			</div>
			<a-table
				:columns="recordColumns"
				rowKey="id"
				class="new-table"
				style="margin-top: 20px"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: 1000, y: 300 }"
			>
				<div
					slot="attachmentList"
					slot-scope="files, record"
				>
					<div
						v-if="record.attachmentList && record.attachmentList.length"
						style="display: flex; flex-direction: column"
					>
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
			<!-- 预警处理 -->
			<div v-if="isAppeal">
				<div style="margin-top: 30px">
					<span class="slTitleAssis">预警处理</span>
				</div>
				<a-form
					:form="form"
					:colon="false"
					class="slFormDetail"
				>
					<a-row>
						<a-col :span="6">
							<a-form-item label="实际出库数量">
								<a-input-number
									placeholder="请输入实际出库数量"
									:min="0.0001"
									:max="99999999.9999"
									v-decorator="[
										`realityOutboundQuantity`,
										{
											rules: [
												{ required: true, message: `实际出库数量必填` },
												{
													pattern: /^\d+(\.\d{0,4})?$/,
													message: '数量为非负数，最多四位小数'
												}
											],
											validateTrigger: ['blur']
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-form-item
							label="情况说明"
							style="width: 100%"
						>
							<a-textarea
								style="height: 80px"
								v-decorator="[
									`remark`,
									{
										rules: [{ required: true, message: '请输入情况说明' }],
										validateTrigger: ['blur']
									}
								]"
								:maxLength="100"
								placeholder="请输入预警情况说明。最多100字"
							/>
						</a-form-item>
					</a-row>
				</a-form>

				<AttachmentUpload
					@beginUpload="getBeginUpload"
					:showTip="false"
					:dataSource="fileList"
					ref="attachmentUpload"
					:accept="accept"
					:actionReturnId="true"
				/>
			</div>

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
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { filePreview } from '@/v2/utils/file';
import AttachmentUpload from '@/v2/components/upload/AttachmentUpload';
import imageViewer from '@/v2/components/imageViewer.vue';
import { mapGetters } from 'vuex';
import ENV from '@/v2/config/env';
import { API_GetInventoryWarningDetail } from '@/api';
import { artificialProcess } from '@/v2/center/message/api';

export default {
	components: {
		Breadcrumb,
		imageViewer,
		AttachmentUpload
	},
	data() {
		return {
			recordColumns: [
				{ title: '操作时间', dataIndex: 'createTime' },
				{ title: '操作人员', dataIndex: 'createdBy' },
				{ title: '操作类型', dataIndex: 'operationTypeDesc' },
				{ title: '处理意见', dataIndex: 'remark' },
				{
					title: '附件',
					dataIndex: 'attachmentList',
					scopedSlots: { customRender: 'attachmentList' }
				}
			],
			dataSource: [],
			form: this.$form.createForm(this),
			accept: '.pdf,.jpg,.jpeg,.png,.bmp',
			fileList: [{ type: 'DESCRIPTION', id: '', fileList: [], typeName: '说明材料' }],
			beginUpload: false,
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
		getBeginUpload(val) {
			this.disabled = val;
		},

		getDetail() {
			API_GetInventoryWarningDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.result.baseInfo;
					this.dataSource = res.result.processLogs;
					this.isAppeal = ['TO_BE_PROCESS', 'FOLLOWED'].includes(this.detail.alertStatus);
				}
			});
		},
		goContractDetail(orderContractId, contractType) {
			let type = this.$route.orderType ?? 'sell';
			let cType = contractType ?? 'ONLINE';
			this.$router.push({
				path: `/center/contract/${type.toLowerCase()}/${cType.toLowerCase()}/detail`,
				query: {
					id: orderContractId,
					type
				}
			});
		},
		goReleaseInstruct(id) {
			let path = `/center/ladingbill/delivery/detail?id=${id}`;
			window.open(path);
		},
		handlePreview(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
		},
		validateFile() {
			const files = this.$refs.attachmentUpload.dataSource;
			if (!files.length || (files.length && !files[0].fileList.length)) {
				this.$message.error('请上传说明材料');
				return false;
			}
			return true;
		},
		formateFileData(data) {
			if (data) {
				var arr = [];
				data[0].fileList.forEach(item => {
					var obj = {
						...item
					};
					obj.typeName = data[0].typeName;
					obj.type = data[0].type;
					arr.push(obj);
				});
				return arr;
			}
		},
		onSubmit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					if (!this.validateFile()) return;
					const params = {
						remark: values.remark,
						realityOutboundQuantity: values.realityOutboundQuantity,
						riskAlertNo: this.detail.recordNo,
						riskAlertId: this.detail.id,
						ruleTypeList: 'INVENTORY',
						type: 'PROCESSED',
						id: this.$route.query.id
					};
					const attachmentInfo = this.formateFileData(this.$refs.attachmentUpload.dataSource);
					if (attachmentInfo) {
						params.fileInfoList = attachmentInfo;
					}
					if (this.disabled) {
						return;
					}
					this.disabled = true;
					try {
						const res = await artificialProcess(params);
						this.$message.success('操作成功');
						this.disabled = false;
						this.$router.go(-1);
					} catch (error) {
						this.disabled = false;
					}
				}
			});
		}
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
.slFormDetail {
	padding: 0;
	.ant-form-item {
		margin-top: 20px;
	}
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

/deep/ .ant-form-item {
	margin-bottom: 5px;
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
