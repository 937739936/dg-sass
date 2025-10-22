<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>{{ title }}
				</span>
			</div>
			<a-spin :spinning="loading">
				<div class="content">
					<template v-if="isManager">
						<div class="slTitleAssis">货主信息</div>
						<ShipperInfo
							ref="businessLineInfo"
							:shipperList="shipperList"
							:shipperInfo="shipperInfo"
							@onSelectedShipperInfoChange="onSelectedShipperInfoChange"
						/>
					</template>
					<template v-else>
						<div class="slTitleAssis">业务线信息</div>
						<BusinessLineInfo
							ref="businessLineInfo"
							:businessLineDetail="businessLineDetail"
							@handleNotContractChange="handleNotContractChange"
							@handleBusinessLineClick="handleBusinessLineClick"
						/>
					</template>

					<div class="slTitleAssis">配煤信息</div>
					<CoalBlendingInfoEdit
						ref="coalBlendingInfo"
						:isManager="isManager"
						:ownerCompanyUscc="currentCompanyUscc"
						:businessLineNo="businessLineNo"
						:coalBlendingOriginInfo="coalBlendingOriginInfo"
						:coalTypeInventoryList="coalTypeInventoryList"
						@onBlendedCoalConfirm="onBlendedCoalConfirm"
					/>
					<div class="remark-title">备注</div>
					<a-textarea
						class="remark-input"
						v-model="remarks"
						placeholder="请输入备注信息，最多500字..."
						:maxLength="500"
					/>
					<div class="slTitleAssis">附件上传</div>
					<AttachmentUploadTable
						ref="attachmentUploadTable"
						:tip="attachmentTip"
						:uploadUrl="uploadUrl"
						:dataSource="attachmentDataSource"
					/>
				</div>
			</a-spin>
			<div class="bottom-btn-box">
				<div class="btn-wrap">
					<a-button
						@click="$router.back()"
						type="primary"
						ghost
						>返回</a-button
					>
					<a-button
						@click="onSubmit"
						type="primary"
						>提交</a-button
					>
				</div>
			</div>
		</a-card>
		<BusinessLineSelectModel
			ref="businessLineSelectModel"
			@onCancel="handleBusinessLineSelect({})"
			@handleBusinessLineSelect="handleBusinessLineSelect"
		/>
		<CoalBlendingConfirmModal
			ref="CoalBlendingConfirmModal"
			:shipperCompanyUscc="shipperCompanyUscc"
			@onConfirm="onSaveCoalBlendingProduceCoalInfo"
		/>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import BusinessLineSelectModel from '@/v2/center/logisticsPlatform/views/coalBlending/models/BusinessLineSelectModel';

import CoalBlendingConfirmModal from './models/CoalBlendingConfirmModal.vue';
import AttachmentUploadTable from './components/AttachmentUploadTable.vue';
import ShipperInfo from '@sub/logisticsPlatform/coalBlending/components/ShipperInfo';
import BusinessLineInfo from '@sub/logisticsPlatform/coalBlending/components/BusinessLineInfo';
// import CoalBlendingInfo from '@sub/logisticsPlatform/coalBlending/components/CoalBlendingInfo';
import CoalBlendingInfoEdit from './components/CoalBlendingInfoEdit';
import {
	getCoalTypeInventory,
	saveCoalBlendingInfo,
	getBusinessLineDetail,
	getCoalBlendingeDetail
} from '@/v2/center/logisticsPlatform/api/coalBlending';
import { getShipperList } from '@/v2/center/logisticsPlatform/api';
import { API_STATION_UPLOAD_FILE } from '@/v2/api/upload';

import { mapGetters } from 'vuex';

export default {
	components: {
		Breadcrumb,
		ShipperInfo,
		BusinessLineInfo,
		CoalBlendingInfoEdit,
		BusinessLineSelectModel,
		CoalBlendingConfirmModal,
		AttachmentUploadTable
	},
	data() {
		let { id, businessLineNo } = this.$route.query;
		let title = this.$route.meta.title || '新增配煤记录';
		return {
			title,
			loading: false,
			id, // 配煤记录ID
			coalTypeInventoryList: [], // 煤种库存列表
			shipperList: [], // 货主列表
			shipperInfo: {}, // 货主信息
			detailInfo: {}, // 配煤记录详情
			businessLineDetail: {
				businessLineNo: businessLineNo // 业务线编号
			}, // 业务线详情
			remarks: '', // 备注信息
			uploadUrl: API_STATION_UPLOAD_FILE, // 上传附件接口地址
			coalBlendingOriginInfo: {} // 原配煤信息
		};
	},
	computed: {
		attachmentTip() {
			return '可支持格式为png，jpeg，jpg，pdf，doc，docx，xlsx，xls，ppt，pptx，zip，rar，txt等的附件，单个附件大小不得超过100M的文件';
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		currentCompanyUscc() {
			if (this.shipperInfo.ownerCompanyUscc) {
				return this.shipperInfo.ownerCompanyUscc;
			}
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		// 业务线编号
		businessLineNo() {
			let detail = this.businessLineDetail || {};
			return detail.businessLineNo;
		}, // 业务线编号
		shipperCompanyUscc() {
			return this.currentCompanyUscc;
		},
		attachmentDataSource: function () {
			let attachVOList = this.detailInfo.attachments || [];
			let blendingAttachmentList = [];
			attachVOList.map(file => {
				let tFile = {
					...file,
					id: `${file.fileId}`,
					type: file.fileType,
					name: file.name,
					path: file.path,
					createTime: file.createdDate,
					url: file.url
				};
				if (file.fileType == 'BLENDING_COAL_DETAIL') {
					blendingAttachmentList.push(tFile);
				}
			});
			let dataSource = [
				{
					type: 'BLENDING_COAL_DETAIL',
					typeName: '掺配明细',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'zip', 'rar', 'txt'],
					maxSize: 100,
					attachmentList: blendingAttachmentList
				}
			];
			return dataSource;
		}
	},
	mounted() {
		if (this.businessLineNo) {
			this.getSelectedBusinessLineDetail();
		}
		this.getDetail();
	},
	methods: {
		// 获取配置信息
		getAllConfigInfo() {
			this.getCoalTypeInventoryList();
			this.getShipperSlectList();
		},
		// 配置信息： 获取煤种库存列表
		getCoalTypeInventoryList() {
			getCoalTypeInventory({ ownerCompanyUscc: this.currentCompanyUscc, id: this.id, businessLineNo: this.businessLineNo }).then(
				res => {
					if (!res.success) {
						return;
					}
					this.coalTypeInventoryList = res.data;
				}
			);
		},
		// 获取货主列表
		getShipperSlectList() {
			getShipperList().then(result => {
				if (!result.success) {
					return;
				}
				this.shipperList = result.data;
			});
		},
		// 获取选择的当前业务线详情
		getSelectedBusinessLineDetail() {
			if (!this.businessLineNo) {
				return;
			}
			getBusinessLineDetail({ businessLineNo: this.businessLineNo }).then(res => {
				if (!res.success) {
					return;
				}
				this.businessLineDetail = res.data;
			});
		},
		// 获取配煤详情信息
		getDetail() {
			if (!this.id) {
				this.getAllConfigInfo();
				return;
			}
			this.loading = true;
			getCoalBlendingeDetail(this.id)
				.then(res => {
					if (!res.success) {
						return;
					}
					let detailInfo = res.data;
					this.detailInfo = res.data;
					this.remarks = detailInfo.remarks;
					this.shipperInfo = {
						ownerCompanyUscc: detailInfo.ownerCompanyUscc,
						ownerCompanyName: detailInfo.ownerCompanyName
					};
					this.businessLineDetail = detailInfo.businessLine;
					this.coalBlendingOriginInfo = {
						type: detailInfo.type, // 配煤类型
						blendingDate: detailInfo.blendingDate, // 配煤日期
						coalTotalQuantity: detailInfo.coalTotalQuantity, // 出煤总量
						coalRecovery: detailInfo.coalRecovery, // 出煤回收率
						detailList: detailInfo.detailList, // 配煤选择列表
						extractionList: detailInfo.extractionList // 出煤信息
					};
					this.getAllConfigInfo();
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 提交保存配煤信息
		async onSubmit() {
			try {
				let businessLineInfoPromise = this.$refs.businessLineInfo.validateBusinessLineInfo();
				let attachmentPromise = this.$refs.attachmentUploadTable.validateAttachmentFiels();
				let coalBlendingInfoPromise = this.$refs.coalBlendingInfo.onValidateCoalBlendingInfo();
				let [businessLineInfo, attachmentList, coalBlendingInfo] = await Promise.all([
					businessLineInfoPromise,
					attachmentPromise,
					coalBlendingInfoPromise
				]);
				attachmentList = attachmentList.map(file => {
					let tFile = {
						attachType: file.type,
						name: file.name,
						path: file.path
					};
					return tFile;
				});
				let params = {
					...this.detailInfo,
					...coalBlendingInfo,
					...businessLineInfo,
					remarks: this.remarks,
					businessLineNo: this.businessLineNo,
					attachments: attachmentList
				};
				this.loading = true;
				saveCoalBlendingInfo(params)
					.then(res => {
						if (!res.success) {
							return;
						}
						this.$message.success('提交成功');
						this.$router.back();
					})
					.finally(() => {
						this.loading = false;
					});
			} catch (error) {
				if (error) {
					this.$message.error(error);
				}
				
			}
		},
		handleNotContractChange(isNotContract) {
			if (!isNotContract) {
				this.$refs.businessLineSelectModel.showModal();
			}
		},
		handleBusinessLineSelect(obj) {
			let { businessLineNo } = obj;
			this.businessLineDetail = {
				businessLineNo: businessLineNo
			};
			this.getSelectedBusinessLineDetail();
			this.getCoalTypeInventoryList();
			if (businessLineNo) {
				this.$refs.coalBlendingInfo.resetCoalBlendingInfo();
			}
		},
		handleBusinessLineClick(businessLineNo) {
			let routerData = this.$router.resolve({
				path: '/center/businessline/detail',
				query: {
					businessLineNo: businessLineNo
				}
			});
			window.open(routerData.href, '_blank');
		},
		// 货主信息变更
		onSelectedShipperInfoChange(shipperInfo) {
			if (this.shipperInfo != shipperInfo) {
				this.$refs.coalBlendingInfo.resetCoalBlendingInfo();
			}
			this.shipperInfo = shipperInfo;
			this.getCoalTypeInventoryList();
		},
		// 掺配确认弹窗
		onBlendedCoalConfirm(data) {
			this.$refs.CoalBlendingConfirmModal.show(data);
		},
		// 保存配煤出煤信息
		onSaveCoalBlendingProduceCoalInfo(data) {
			this.$refs.coalBlendingInfo.updateCoalBlendingProduceCoalInfo(data);
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.slTitleAssis {
		margin: 30px 0 20px;
	}
	.content {
		padding-bottom: 137px;
	}
	.bottom-btn-box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		// margin-top: 100px;
		background: #ffffff;
		padding: 16px 0;
		border-top: 1px solid #e5e6eb;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
	}
	.bottom-btn-box .btn-wrap {
		margin: 0;
	}
	.remark-title {
		font-size: 14px;
		color: #00000066;
		margin-bottom: 10px;
		margin-top: 20px;
	}
	.remark-input {
		min-height: 96px;
		padding: 10px 14px;
	}
}
</style>