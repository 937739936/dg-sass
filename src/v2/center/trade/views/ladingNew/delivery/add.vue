<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<a-spin :spinning="detailLoading">
				<div class="methods-wrap">
					<span
						slot="title"
						class="slTitle"
					>
						{{ meta.title }}
					</span>
				</div>
				<div class="sub">
					<div class="slTitleAssis">合同信息</div>
					<ContractInfoView
						:loading="contractLoading"
						:contractInfo="contractInfo"
						@changeContract="changeContract"
					/>
				</div>
				<div class="sub">
					<div class="slTitleAssis">放货信息</div>
					<DeliveryInfoView
						ref="deliveryInfoView"
						:editableLadingInfo="editableLadingInfo"
					/>
				</div>
				<div class="sub">
					<div class="slTitleAssis">附件信息</div>
					<AttachmentView
						ref="file"
						:dataSource="attachmentDataSource"
						uploadModule="LADING"
					/>
				</div>
			</a-spin>
			<div class="bottom-actions">
				<a-button
					class="btn cancel-btn"
					type="primary"
					ghost
					@click="cancelBack"
				>
					取消
				</a-button>
				<a-button
					class="btn ok-btn"
					type="primary"
					@click="submit"
					:loading="submitLoading"
				>
					提交
				</a-button>
			</div>
		</a-card>
		<SelectContractModal
			ref="selectContractModal"
			:source="source"
			@confirmSelectContract="confirmSelectContract"
		/>
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfoView from '../components/ContractInfoView';
import DeliveryInfoView from '../components/DeliveryInfoView';
import AttachmentView from '../components/AttachmentView';
import SelectContractModal from './contractList';
import { API_getLadingBillSave, API_getContractInfo, API_getLadingDetailById } from '@/v2/center/trade/api/instruct';

export default {
	components: {
		breadcrumb,
		ContractInfoView,
		DeliveryInfoView,
		AttachmentView,
		SelectContractModal
	},
	data() {
		let { meta } = this.$route;
		return {
			meta,
			detailLoading: false, // 详情信息加载loading
			submitLoading: false, // 提交信息loading
			contractLoading: false, // 合同信息加载loading
			contractInfo: {}, // 合同信息
			ladingDetailInfo: undefined, // 提货详情信息
			relStationData: {} // 绑定的站台信息
		};
	},
	mounted() {
		// 页面加载是获取已知信息（方法内部判断）
		// 加载合同如果路由参数中包含合同id信息进行加载
		let { orderContractId, contractType } = this.$route.query;
		this.getContractInfo(orderContractId, contractType);
		// 加载详情如果路由参数中包含详情id信息进行加载
		this.getLadingDetailInfo();
	},
	computed: {
		// 可编辑的信息
		editableLadingInfo: function () {
			// 先判断合同信息获取运输方式
			// 合同信息
			let contractInfo = this.contractInfo;
			let ladingDetailInfo = this.ladingDetailInfo;
			let transType = contractInfo?.transportMode;
			if (ladingDetailInfo?.transType) {
				// 如果详情里面有运输信息优先使用详情中的
				transType = ladingDetailInfo?.transType;
			}
			let beginDate = ladingDetailInfo?.beginDate;
			let endDate = ladingDetailInfo?.endDate;
			let stationInfo = ladingDetailInfo?.stationInfo;
			return {
				beginDate: beginDate,
				endDate: endDate,
				quantity: ladingDetailInfo?.quantity,
				stationInfo: stationInfo,
				contactName: ladingDetailInfo?.contactName,
				contactMode: ladingDetailInfo?.contactMode,
				idNo: ladingDetailInfo?.idNo,
				transType: transType,
				remark: ladingDetailInfo?.remark,
				ladingTransInfoList: ladingDetailInfo?.transInfoList || [], // 运输方式信息列表
				orderContractId: contractInfo?.orderContractId,
				contractType: contractInfo?.contractType
			};
		},
		attachmentDataSource: function () {
			let ladingDetailInfo = this.ladingDetailInfo;
			let attachVOList = ladingDetailInfo?.attachVOList ?? [];
			let payAttachmentList = [];
			let goodAttachmentList = [];
			let otherAttachmentList = [];
			attachVOList.map(file => {
				let tFile = {
					...file,
					id: `${file.id}`,
					name: file.fileName,
					createTime: file.createDate,
					url: file.fileUrl
				};
				if (file.type == 'FKHD') {
					payAttachmentList.push(tFile);
				} else if (file.type == 'LADING') {
					goodAttachmentList.push(tFile);
				} else if (file.type == 'OTHER') {
					otherAttachmentList.push(tFile);
				}
			});
			let dataSource = [
				{
					type: 'FKHD',
					typeName: '付款回单',
					required: true,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: payAttachmentList
				},
				{
					type: 'LADING',
					typeName: '提货通知单',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: goodAttachmentList
				},
				{
					type: 'OTHER',
					typeName: '其他凭证',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: otherAttachmentList
				}
			];
			return dataSource;
		},
		source() {
			let source = this.$route.path.includes('/logisticsPlatform/') ? 'LOGISTICS_STORAGE_CENTER' : 'DG_CHAIN';
			return source;
		}
	},
	methods: {
		// 修改合同信息
		changeContract() {
			this.$refs.selectContractModal.showModal();
		},
		// 确认信息选择的合同信息
		confirmSelectContract(contractInfo) {
			this.contractInfo = contractInfo;
			this.getContractInfo(contractInfo.orderContractId, contractInfo.contractType);
		},
		// 获取合同信息根据选择的id
		getContractInfo(orderContractId, contractType) {
			let isNeed = orderContractId && contractType;
			if (!isNeed) {
				return;
			}
			this.contractLoading = true;
			API_getContractInfo({
				orderContractId: orderContractId,
				contractType: contractType
			})
				.then(res => {
					//
					if (res.success) {
						this.contractInfo = res.data;
					}
				})
				.catch(() => {
					//
				})
				.finally(() => {
					//
					this.contractLoading = false;
				});
		},
		// 获取编辑的提货详情信息
		getLadingDetailInfo() {
			let { id } = this.$route.query;
			if (!id) {
				return;
			}
			this.detailLoading = true;
			API_getLadingDetailById({
				id: id
			})
				.then(res => {
					//
					if (res.success) {
						this.ladingDetailInfo = res.data;
						this.contractInfo = res.data.contractInfo;
					}
				})
				.catch(() => {
					//
				})
				.finally(() => {
					//
					this.detailLoading = false;
				});
		},
		// 返回
		cancelBack() {
			// 取消
			this.$router.back();
		},
		// 提交信息
		async submit() {
			try {
				this.detailLoading = true;
				let inputInfo = await this.$refs.deliveryInfoView.onValidateInputInfo();
				let attachmentList = await this.$refs.file.validateAttachmentFiels();
				let params = {
					contractType: this.contractInfo.contractType, // 合同类型
					orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
					source: this.source,
					contractNo: this.contractInfo.contractNo,
					...inputInfo,
					attachDTOList: attachmentList
				};
				if (this.ladingDetailInfo?.id) {
					// id存在则为编辑
					params.id = this.ladingDetailInfo?.id;
				}
				let res = await API_getLadingBillSave(params);

				if (!res.success) {
					this.detailLoading = false;
					return;
				}
				this.$message.success('提交成功', 1, () => {
					this.$router.back();
					this.detailLoading = false;
				});
			} catch (error) {
				this.detailLoading = false;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		// margin-bottom: 30px;
	}
	.content {
		.sub {
			margin-top: 20px;
			.slTitleAssis {
				margin: 0 0 20px;
			}
		}
	}

	.bottom-actions {
		// position: sticky;
		// bottom: 0;
		margin-top: 78px;
		padding: 10px 20px;
		background: #ffffff;
		text-align: center;
		.ant-btn {
			margin: 0 15px;
			// padding: 0 30px;
			border-radius: 6px;
			height: 38px;
			border: 1px solid @primary-color;
		}
		.cancel-btn {
			width: 86px;
		}
		.ok-btn {
			width: 114px;
		}
	}
}
</style>
