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
						电子仓单提货申请
					</span>
				</div>
				<div class="sub">
					<div class="slTitleAssis">采购合同信息</div>
					<ContractInfoView
						:loading="contractLoading"
						:contractInfo="contractInfo"
						@changeContract="changeContract"
					/>
				</div>
				<div
					class="sub"
					v-if="warehouseReceiptDeliveryType == 'WAREHOUSE_RECEIPT'"
				>
					<div class="slTitleAssis">仓单提货信息</div>
					<LadingInfoReceiptView
						ref="ladingInfoReceiptView"
						:receiptHouseInfo="receiptHouseInfo"
						:editDeliveryInfoList="editDeliveryInfoList"
					/>
				</div>
				<div class="sub">
					<div class="slTitleAssis">提货详细信息</div>
					<LadingInfoView
						ref="ladingInfoView"
						:warehouseReceiptDeliveryType="warehouseReceiptDeliveryType"
						:editableLadingInfo="editableLadingInfo"
					/>
				</div>
				<div
					class="sub"
					v-if="warehouseReceiptDeliveryType == 'NO_WAREHOUSE_RECEIPT'"
				>
					<div class="slTitleAssis">附件信息</div>
					<AttachmentView
						ref="file"
						:dataSource="attachmentDataSource"
						uploadModule="LADING"
					/>
				</div>
			</a-spin>
		</a-card>
		<div class="bottom-actions">
			<a-button
				class="btn cancel-btn"
				type="primary"
				ghost
				@click="cancelBack"
			>
				返回
			</a-button>
			<a-button
				class="btn cancel-btn"
				type="primary"
				ghost
				@click="submit('SAVE')"
			>
				保存
			</a-button>
			<a-button
				class="btn ok-btn"
				type="primary"
				@click="submit('SUBMIT')"
				:loading="submitLoading"
			>
				提交
			</a-button>
		</div>

		<RelationContract
			:isNoRelation="false"
			ref="selectContractModal"
			querySource="WAREHOUSE_RECEIPT_DELIVERY"
			@relation="confirmSelectContract"
			type="IN"
		>
		</RelationContract>
		<modalMain
			ref="modalMain"
			title="提交确认"
			:width="500"
			@verify="modalMainOK"
		>
			<div class="main">
				<div class="title">请确认以下信息是否有误:</div>
				<div class="mainTable">
					<div class="item">
						<span class="label">提货方：</span>
						<span>{{ deliveryCompanyName || '-' }}</span>
					</div>
					<div class="item">
						<span class="label">本次仓单提货数量为：</span>
						<span class="red">{{ params.quantity | formatMoney(4) }}吨</span>
					</div>
				</div>
				<div class="title footer-title">是否继续提交？</div>
			</div>
		</modalMain>
		<ModalInfo
			ref="modalInfoChange"
			title="确认返回"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="tipBack"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="saveAndBack"
				>
					提交并返回
				</a-button>
			</div>
		</ModalInfo>
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import modalMain from '@/v2/components/modalInfo/main';

import ContractInfoView from './components/ContractInfoView';
import LadingInfoView from './components/LadingInfoView';
import LadingInfoReceiptView from './components/LadingInfoReceiptView';
import AttachmentView from './components/AttachmentView';
import RelationContract from '../../components/RelationContract.vue';
import { deepCompare } from '@/v2/utils/factory';
import ModalInfo from '@/v2/components/modalInfo/info';

import {
	API_getWarehouseReceiptDeliveryInfo,
	API_saveOrUpdateWarehouseReceiptDelivery,
	getWarehouseReceiptContractDetail,
	API_warehouseReceiptDeliveryDetail,
	API_getWarehouseReceiptDetail
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';

export default {
	components: {
		breadcrumb,
		modalMain,
		ModalInfo,
		ContractInfoView,
		LadingInfoView,
		LadingInfoReceiptView,
		AttachmentView,
		RelationContract
	},
	data() {
		return {
			deliveryCompanyName: '',
			warehouseReceiptDeliveryType: '', // 仓单提货|无仓单提货
			detailLoading: false, // 详情信息加载loading
			submitLoading: false, // 提交信息loading
			contractLoading: false, // 合同信息加载loading
			contractInfo: {}, // 合同信息
			editDeliveryInfoList: [], // 仓单提货信息
			receiptHouseInfo: {},
			ladingDetailInfo: undefined, // 提货详情信息
			params: {}, //提交参数
			isNeedNext: true,
			oldInfo: {}
		};
	},
	mounted() {
		this.deliveryCompanyName = this.VUEX_ST_COMPANYSUER.companyName;

		let { warehouseReceiptDeliveryType, contractId, contractType, id, receiptid } = this.$route.query;
		if (receiptid) {
			// 仓单查询列表 - 发起提货
			warehouseReceiptDeliveryType = 'WAREHOUSE_RECEIPT';
		}
		this.warehouseReceiptDeliveryType = warehouseReceiptDeliveryType;
		this.getContractInfo(contractId, contractType);
		// 编辑提货申请
		this.getLadingDetailInfo(id);
		// 仓单查询列表 - 发起提货
		this.getWarehouseReceiptDetail(receiptid);
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 可编辑的提货信息
		editableLadingInfo: function () {
			// 先判断合同信息获取运输方式
			// 合同信息
			let contractInfo = this.contractInfo;
			let ladingDetailInfo = this.ladingDetailInfo;
			let transType = contractInfo?.transportMode;
			let beginDate = contractInfo?.startDate;
			let endDate = contractInfo?.endDate;
			if (ladingDetailInfo?.transType) {
				// 如果详情里面有运输信息优先使用详情中的
				transType = ladingDetailInfo?.transType;
			}
			let stationInfo = {
				stationName: ladingDetailInfo?.place,
				stationId: ladingDetailInfo?.stationId
			};
			if (ladingDetailInfo?.beginDate && ladingDetailInfo?.endDate) {
				beginDate = ladingDetailInfo?.beginDate;
				endDate = ladingDetailInfo?.endDate;
			}
			return {
				beginDate: beginDate,
				endDate: endDate,
				quantity: ladingDetailInfo?.quantity,
				stationInfo,
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
			let attachDTOList = ladingDetailInfo?.warehouseReceiptAttachmentList ?? [];
			let attachmentList = [];
			attachDTOList.map(file => {
				if (file.fileType == 'PAYMENT_VOUCHER') {
					let tFile = {
						name: file.name,
						md5Hex: file.md5Hex,
						fileUrl: file.url,
						createTime: file.createdDate
					};
					attachmentList.push(tFile);
				}
			});

			let dataSource = [
				{
					type: 'PAYABLE_VOUCHER',
					typeName: '付款凭证',
					required: true,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: attachmentList
				}
			];
			return dataSource;
		}
	},
	beforeRouteLeave(to, from, next) {
		if (this.isNeedNext) {
			this.oldAndNew(next);
		} else {
			next();
		}
	},
	methods: {
		// 修改合同信息
		changeContract() {
			this.$refs.selectContractModal.show();
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
			getWarehouseReceiptContractDetail({
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
					this.contractLoading = false;
					this.getDeliveryInfo(orderContractId, contractType);
				});
		},
		// 仓单提货信息-仓单列表信息
		getDeliveryInfo(orderContractId, contractType) {
			let isNeed = orderContractId && contractType;
			if (!isNeed) {
				return;
			}
			API_getWarehouseReceiptDeliveryInfo({
				orderContractId: orderContractId,
				contractType: contractType
			})
				.then(res => {
					//
					if (res.success) {
						if (res.data && res.data.length) {
							let info = res.data[0];
							const { warehouseCompanyName, stationName, stationId, goodsName } = info;
							this.receiptHouseInfo = { warehouseCompanyName, stationName, stationId, goodsName };
						}
						this.editDeliveryInfoList = res.data;
					}
				})
				.catch(() => {})
				.finally(() => {});
		},
		// 获取编辑的提货详情信息
		getLadingDetailInfo(id) {
			if (!id) {
				return;
			}
			this.detailLoading = true;
			API_warehouseReceiptDeliveryDetail({
				id: id
			})
				.then(res => {
					if (res.success) {
						this.ladingDetailInfo = res.data;
						this.contractInfo = res.data.contractInfo;
						this.warehouseReceiptDeliveryType = res.data.type;
						this.deliveryCompanyName = res.data.deliveryCompanyName;
						this.$nextTick(() => {
							const { warehouseCompanyName, place, stationId, goodsName } = res.data;
							this.receiptHouseInfo = { warehouseCompanyName, stationName: place, stationId, goodsName };
							this.editDeliveryInfoList = res.data.deliveryInfo;
						});
						this.cacheDetailInfo();
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
		// 来自仓单查询列表-发起提货,根据仓单id获取仓单详情
		getWarehouseReceiptDetail(receiptid) {
			if (!receiptid) {
				return;
			}
			this.detailLoading = true;
			API_getWarehouseReceiptDetail({ id: receiptid })
				.then(result => {
					if (result.success) {
						this.contractInfo = result.data.contractInfo;
						const { warehouseCompanyName, stationName, stationId, goodsName } = result.data;
						this.receiptHouseInfo = { warehouseCompanyName, stationName, stationId, goodsName };
						this.getDeliveryInfo(this.contractInfo?.orderContractId, this.contractInfo?.contractType);
					}
				})
				.catch(err => {})
				.finally(() => {
					this.detailLoading = false;
				});
		},
		cacheDetailInfo() {
			let baseParam = this.getBaseParam();
			const { id, beginDate, endDate, quantity, place, stationId, contactMode, contactName, idNo, remark, transType } =
				this.ladingDetailInfo;
			if (this.warehouseReceiptDeliveryType == 'WAREHOUSE_RECEIPT') {
				const deliveryInfoList = this.ladingDetailInfo.deliveryInfo?.map(e => {
					const { id, outBoundQuantity, warehouseReceiptNo } = e;
					return { id, outBoundQuantity, warehouseReceiptNo };
				});
				baseParam.deliveryInfoList = deliveryInfoList;
				// baseParam.stationId = stationId;
			}
			const transInfoList = this.ladingDetailInfo.transInfoList;
			if (this.warehouseReceiptDeliveryType == 'NO_WAREHOUSE_RECEIPT') {
				const attachDTOList = this.ladingDetailInfo.warehouseReceiptAttachmentList?.map(e => {
					return { name: e.name, md5Hex: e.md5Hex, path: e.path, attachmentType: e.fileType };
				});
				baseParam.attachDTOList = attachDTOList;
				// baseParam.stationId = stationId;
			}
			const oldInfo = {
				...baseParam,
				id,
				beginDate,
				endDate,
				quantity,
				place,
				stationId,
				contactMode,
				contactName,
				idNo,
				remark,
				transType,
				transInfoList: transInfoList ?? []
			};
			this.oldInfo = oldInfo;
		},
		// 返回
		cancelBack() {
			// 取消
			this.$router.back();
		},
		// 直接返回
		tipBack() {
			this.goBack();
		},
		getBaseParam() {
			return {
				warehouseReceiptDeliveryType: this.warehouseReceiptDeliveryType,
				contractType: this.contractInfo.contractType, // 合同类型
				contractId: this.contractInfo.orderContractId // 订单id补录合同id
			};
		},
		async getParam(needError) {
			// 未校验通过 返回null
			try {
				let baseParam = this.getBaseParam();

				if (this.warehouseReceiptDeliveryType == 'WAREHOUSE_RECEIPT') {
					// 仓单提货
					let ladingReceiptInfo = await this.$refs.ladingInfoReceiptView.onSave(needError);
					const { deliveryInfoList, place, stationId, quantity } = ladingReceiptInfo;
					baseParam.deliveryInfoList = deliveryInfoList;
					baseParam.place = place;
					baseParam.quantity = quantity;
					baseParam.stationId = stationId;
				}
				let inputInfo = await this.$refs.ladingInfoView.onValidateInputInfo();
				if (this.warehouseReceiptDeliveryType == 'NO_WAREHOUSE_RECEIPT') {
					let attachmentList = await this.$refs.file.validateAttachmentFiels();
					let attachDTOList =
						attachmentList?.map(item => {
							return {
								attachmentType: 'PAYMENT_VOUCHER',
								name: item.name,
								md5Hex: item.md5Hex,
								path: item.fileUrl
							};
						}) ?? [];
					baseParam.attachDTOList = attachDTOList;
				}
				let param = {
					...baseParam,
					...inputInfo
				};
				if (this.ladingDetailInfo?.id) {
					// id存在则为编辑
					param.id = this.ladingDetailInfo?.id;
				}
				return param;
			} catch (error) {
				return null;
			}
		},
		modalMainOK() {
			this.sendSubmit();
		},
		// 保存并返回
		async saveAndBack() {
			this.$refs.modalInfoChange.close();
			await this.submit('SUBMIT');
		},
		// 提交信息
		async submit(operatorType) {
			let param = await this.getParam(true);
			if (param) {
				param.operatorType = operatorType;
				this.params = param;
				if (operatorType == 'SUBMIT') {
					// 提交确认
					await this.$refs.modalMain.open();
				} else {
					await this.sendSubmit();
				}
			}
		},
		async sendSubmit() {
			this.$refs.modalMain.close();

			if (!this.params) {
				return;
			}
			this.detailLoading = true;
			try {
				let res = await API_saveOrUpdateWarehouseReceiptDelivery(this.params);
				this.detailLoading = false;
				if (res.success) {
					this.$message.success(this.params.operatorType == 'SUBMIT' ? '提交成功' : '保存成功');
					this.goBack();
				}
			} catch (error) {
				this.detailLoading = false;
			}
		},

		goBack() {
			// 直接返回
			this.isNeedNext = false;
			// this.$router.go(-1);
			this.$router.back();
		},

		async oldAndNew(fun) {
			let param = await this.getParam(false);
			if (this.ladingDetailInfo?.id) {
				// 编辑
				const newInfo = await this.getParam(false);
				console.log('oldinfo', this.oldInfo);
				console.log('newinfo', newInfo);
				if (!deepCompare(this.oldInfo, newInfo)) {
					//内容已被修改，是否提交后再返回？
					this.$refs.modalInfoChange.open();
					fun(false);
					return;
				}
				fun(true);
				return;
			}

			// ■ 新增时：校验当前页面数据是否必填都已填写
			if (param) {
				this.$refs.modalInfoChange.open();
				fun(false);
			} else {
				this.isNeedNext = false;
				fun(true);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		background-color: white;
	}
	.content {
		.sub {
			margin-top: 30px;
			.slTitleAssis {
				margin-bottom: 30px;
			}
		}
	}

	padding-bottom: 44px;
	.bottom-actions {
		width: calc(100vw - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		background: #fff;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		z-index: 9;

		.btn {
			margin: 0 15px;
			width: 88px;
			height: 32px;
			border: 1px solid @primary-color;
			border-radius: 6px;
		}
	}
}
.main {
	.title {
		color: rgba(0, 0, 0, 0.4);
		font-family: PingFang SC;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
	.mainTable {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 10px;
		.item {
			padding: 0 13px;
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			&:nth-child(2n) {
				background: #f3f5f6;
			}
			.label {
				color: rgba(0, 0, 0, 0.4);
				display: inline-block;
				margin-right: 5px;
			}
			.red {
				color: #d44;
			}
		}
	}
	.footer-title {
		color: rgba(0, 0, 0, 0.8);
		margin-top: 20px;
	}
}
</style>
