<template>
	<div>
		<div class="slMain">
			<a-spin :spinning="detailLoading">
				<breadcrumb></breadcrumb>
				<a-card :bordered="false">
					<div class="slTitle">
						<span>电子仓单提货申请审核</span>
					</div>
					<div>
						<div class="slTitleAssis">销售合同信息</div>
						<ContractInfoView :contractInfo="contractInfo" />
					</div>
					<div>
						<div class="slTitleAssis">提货详细信息</div>
						<LadingInfoDetailView :detailData="detailData"></LadingInfoDetailView>
					</div>
					<div>
						<div class="slTitleAssis">附件</div>
						<div class="table-box">
							<a-table
								:columns="filesColumns"
								class="new-table file-table"
								:bordered="false"
								rowKey="id"
								:dataSource="attachments || []"
								:pagination="false"
								:scroll="{ x: true }"
							>
								<template
									slot="serialNo"
									slot-scope="text, record"
								>
									<div
										v-for="(item, index) in record.fileLists"
										:key="index"
										style="display: inline-block; color: var(--primary-color)"
									>
										<a-tooltip>
											<template slot="title">
												<span>上传时间：{{ item.createdDate }}</span>
											</template>
											<a
												class="fileName"
												@click="handlePreview(item)"
												>{{ item.name }}</a
											>
										</a-tooltip>
										<span
											v-if="index != record.fileLists.length - 1"
											style="color: rgba(233, 239, 252, 1); margin: 0 14px"
										>
											|
										</span>
									</div>
								</template>
								<template
									slot="action"
									slot-scope="text, items"
								>
									<a-space :size="20">
										<a
											href="javascript:;"
											@click="downloadFile(items)"
											>下载</a
										>
									</a-space>
								</template>
							</a-table>
						</div>
					</div>
					<div>
						<div class="slTitleAssis">选择采购合同</div>
						<ContractSelectView
							ref="contractSelectView"
							:type="type"
							@viewContractDetail="viewContractDetail"
							@change="change"
						/>
					</div>
					<div>
						<div class="slTitleAssis">仓单提货信息</div>
						<LadingInfoReceiptView
							v-if="currentBusinessLine"
							ref="receiptLadingInfoView"
							:receiptHouseInfo="receiptHouseInfo"
							:editDeliveryInfoList="editDeliveryInfoList"
						/>
						<div v-else>
							<a-empty
								:image="emptyImage"
								description="当前仓单未展示，请先选择采购合同"
							/>
						</div>
					</div>
				</a-card>
				<div class="slDetailBottom">
					<div>
						<a-space>
							<a-button
								type="primary"
								ghost
								@click="$router.back()"
								style="margin-right: 30px"
								>返回</a-button
							>
							<a-button
								type="primary"
								ghost
								style="margin-right: 30px"
								@click="handleReject"
								>驳回</a-button
							>
							<a-button
								type="primary"
								class="btn"
								@click="handleSubmit"
								>通过</a-button
							>
						</a-space>
					</div>
				</div>
			</a-spin>
		</div>
		<a-modal
			class="slModal cancel-modal"
			:visible="rejectVisible"
			:width="460"
			@cancel="rejectVisible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="rejectReason"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>
			<template slot="footer">
				<a-button
					key="back"
					@click="rejectVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmReject"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<a-modal
			class="slModal confirm-modal"
			:visible="confirmVisible"
			:width="498"
			title="确认提交"
			@cancel="confirmVisible = false"
		>
			<p class="label">请确认以下信息是否有误：</p>
			<div class="infoBox">
				<p>
					<span class="label">提货方：</span>
					<span>{{ detailData.deliveryCompanyName }}</span>
				</p>
				<p>
					<span class="label">申请提货数量：</span>
					<span>{{ detailData.quantity | formatMoney(4) }}吨</span>
				</p>
				<p>
					<span class="label">本次仓单提货数量为：</span>
					<span class="red">{{ receiptInfo.quantity | formatMoney(4) }}吨</span>
				</p>
				<p>
					<span class="label">两者差额：</span>
					<span class="red">{{ (receiptInfo.quantity - detailData.quantity) | formatMoney(4) }}吨</span>
				</p>
			</div>
			<div class="tip">是否继续提交？</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="confirmVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmSubmit"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_warehouseReceiptDeliveryDetail,
	getWarehouseReceiptBusinessLineInfo,
	API_getWarehouseReceiptDeliveryInfo,
	API_deliveryAudit_noReceipt,
	API_warehouseReceiptDeliveryDownload
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';
import { Empty } from 'ant-design-vue';

import ContractInfoView from './components/ContractInfoView';
import LadingInfoReceiptView from './components/LadingInfoReceiptView';
import LadingInfoDetailView from './components/LadingInfoDetailView';
import ContractSelectView from './components/ContractSelectView';

import breadcrumb from '@/v2/components/breadcrumb/index';
import moment from 'moment';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload.js';

const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{ title: '文件编号', dataIndex: 'name', scopedSlots: { customRender: 'serialNo' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
export default {
	components: {
		imageViewer,
		LadingInfoDetailView,
		ContractInfoView,
		ContractSelectView,
		breadcrumb,
		LadingInfoReceiptView
	},
	data() {
		let { type } = this.$route.params;
		return {
			type,
			moment,
			detailLoading: false,
			detailData: { contractInfo: {} },
			contractInfo: {},
			businessLines: [], // 采购合同列表
			currentBusinessLine: null, // 当前选择的采购合同
			attachments: [], //附件信息
			filesColumns,
			rejectReason: '',
			rejectVisible: false,
			confirmVisible: false,
			receiptHouseInfo: {},
			editDeliveryInfoList: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			receiptInfo: {}
		};
	},
	mounted() {
		this.init();
	},
	computed: {},
	watch: {
		contractInfo: {
			handler() {
				this.queryBusinessLineByContractInfo();
			}
		},
		currentBusinessLine: {
			handler() {
				this.queryReceiptsByBusinessLine();
			}
		}
	},
	methods: {
		init() {
			this.queryDetailInfo();
		},
		queryDetailInfo() {
			const { id } = this.$route.query;
			if (!id) {
				return;
			}
			this.detailLoading = true;
			API_warehouseReceiptDeliveryDetail({ id })
				.then(res => {
					this.detailLoading = false;
					if (res.success) {
						this.detailData = res.data || {};
						this.contractInfo = this.detailData.contractInfo;
						this.initAttachments();
					}
				})
				.finally(() => {
					this.detailLoading = false;
				});
		},
		queryBusinessLineByContractInfo() {
			const { orderContractId, contractType } = this.contractInfo;
			if (!orderContractId) {
				return;
			}
			getWarehouseReceiptBusinessLineInfo({ orderContractId, contractType }).then(res => {
				if (res.success) {
					this.businessLines = res.data || [];
					this.$refs.contractSelectView.selectedRowKeys = [];
					this.$refs.contractSelectView.setData(this.businessLines);
				}
			});
		},
		queryReceiptsByBusinessLine() {
			if (!this.currentBusinessLine) {
				return;
			}
			const contractType = this.currentBusinessLine.type;
			let id = contractType == 'ONLINE' ? this.currentBusinessLine.upOrderId : this.currentBusinessLine.upContractId;

			API_getWarehouseReceiptDeliveryInfo({ orderContractId: id, contractType: contractType }).then(res => {
				if (res.success) {
					const { warehouseCompanyName, place, stationId, goodsName, deliveryCompanyName, quantity } = this.detailData;
					this.receiptHouseInfo = {
						// warehouseCompanyName,
						// stationName: place,
						// stationId,
						// goodsName,
						deliveryCompanyName,
						quantity
					};

					this.editDeliveryInfoList = res.data ?? [];
					if (this.editDeliveryInfoList.length > 0) {
						let info = res.data[0];
						const { warehouseCompanyName, stationName, stationId, goodsName } = info;
						this.receiptHouseInfo = {
							...this.receiptHouseInfo,
							...{ warehouseCompanyName, stationName, stationId, goodsName }
						};
					}

					this.$nextTick(() => {});
				}
			});
		},
		viewContractDetail(contractInfo) {
			if (!contractInfo) return;
			const type = 'BUY';
			const contractType = contractInfo.upContractType; // ONLINE | OFFLINE
			const contractId = contractType === 'OFFLINE' ? contractInfo.upContractId : contractInfo.upOrderId;
			let path = `/center/contract/${type.toLowerCase()}/${contractType.toLowerCase()}/detail?id=${contractId}&type=${type}`;
			const routeData = this.$router.resolve({
				path
			});
			window.open(routeData.href, '_blank');
		},
		initAttachments() {
			if (this.detailData.warehouseReceiptAttachmentList.length) {
				let fileMap = {};
				this.detailData.warehouseReceiptAttachmentList.forEach(function (item, index, arr) {
					if (fileMap[item.fileTypeDesc]) {
						fileMap[item.fileTypeDesc].push(item);
					} else {
						fileMap[item.fileTypeDesc] = [item];
					}
				});
				var key;
				for (key in fileMap) {
					this.attachments.push({
						typeDesc: fileMap[key][0].fileTypeDesc,
						fileLists: fileMap[key],
						type: fileMap[key][0].fileType
					});
				}
			}
		},

		downloadFile(item) {
			let params = {
				id: this.detailData.id,
				type: 1
			};
			// 下载pdf
			API_warehouseReceiptDeliveryDownload(params).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		change(no, data) {
			this.currentBusinessLine = data;
		},
		handlePreview(items) {
			filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
		},

		// 返回
		goBack() {
			// this.$router.go(-1);
			this.$router.back();
		},
		async handleSubmit() {
			if (!this.currentBusinessLine) {
				this.$message.error('请先选择采购合同');
				return;
			}
			try {
				let receiptInfo = await this.$refs.receiptLadingInfoView.onSave(true);
				this.receiptInfo = receiptInfo;
				this.confirmVisible = true;
			} catch (error) {}
		},
		// 通过
		confirmSubmit() {
			this.confirmVisible = false;
			this.detailLoading = true;
			const { deliveryInfoList } = this.receiptInfo;
			API_deliveryAudit_noReceipt({ id: this.detailData.id, deliveryInfo: deliveryInfoList, operatorType: 'PASS' })
				.then(res => {
					this.detailLoading = false;
					this.goBack();
				})
				.finally(() => {
					this.detailLoading = false;
				});
		},
		// 驳回
		handleReject() {
			this.rejectVisible = true;
		},
		async confirmReject() {
			if (!this.rejectReason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			this.rejectVisible = false;
			this.detailLoading = true;
			const { deliveryInfoList } = this.receiptInfo;
			API_deliveryAudit_noReceipt({
				id: this.detailData.id,
				deliveryInfo: deliveryInfoList,
				operatorType: 'REJECT',
				remark: this.rejectReason
			})
				.then(res => {
					this.detailLoading = false;
					if (res.data == true) {
						this.$message.success('驳回成功');
						this.goBack();
					}
				})
				.finally(() => {
					this.detailLoading = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;

	.slTitle {
		margin-bottom: 20px;
	}

	.ant-card {
		padding: 20px 30px;
		margin-bottom: 84px;
	}

	.ant-card:last-child {
		margin-bottom: 0;
	}
}
.slModal.confirm-modal {
	min-width: 408px;
	.infoBox {
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 32px;
		margin-top: 10px;
		p {
			padding-left: 13px;
			.label {
				display: inline-block;
				width: 140px;
				text-align: left;
			}
		}
		p:nth-child(2n) {
			background: #f3f5f6;
		}
	}
	.label {
		color: rgba(0, 0, 0, 0.4);
	}
	.content {
		color: rgba(0, 0, 0, 0.8);
	}
	.tip {
		margin-top: 20px;
		color: rgba(0, 0, 0, 0.8);
	}
	.red {
		color: #f46332;
	}
}
.slModal.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			border: none;
			height: 150px;
			padding: 14px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.tip {
		color: rgba(0, 0, 0, 0.25);
		font-size: 14px;
		margin-bottom: 14px;
	}

	.cancel-btn {
		border-color: #c6cdd8;
		color: rgba(0, 0, 0, 0.8);
	}
	.red {
		color: #dd4444;
	}
}
textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}

textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::-moz-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea:-ms-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::placeholder {
	color: #8191a9;
	font-size: 14px;
}

.slTitleAssis {
	// margin-top: 30px;
	margin-bottom: 30px;
}

/deep/ .ant-table td {
	white-space: nowrap;
}
.file-table {
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
		width: 88px;
	}
	/deep/ .ant-table-fixed-columns-in-body {
		border-left: 1px solid #e5e6eb;
		width: 88px;
	}
}

.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	z-index: 9;
}
</style>
