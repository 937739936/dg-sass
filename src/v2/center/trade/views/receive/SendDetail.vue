<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				发货信息详情
			</span>
			<div
				class="sub-title"
				style="margin-bottom: 20px"
			>
				合同信息
			</div>
			<ContractGl
				:disabled="disabled"
				:contractVo="contractVo"
				:deliverInfo="deliverInfo"
			/>
			<ReleaseInfo
				:deliverInfo="deliverInfo"
				:transInfo="transInfo"
			/>
			<TrainInfo
				:deliverInfo="deliverInfo"
				:dataSource="dataSource"
				:disabled="disabled"
				v-if="transInfo.transType == 1"
			/>
			<ShipInfo
				:dataSource="dataSource"
				:status="deliverInfo.status"
				:deliverId="deliverId"
				:disabled="disabled"
				v-if="transInfo.transType == 3"
			/>
			<CarInfo
				:datas="dataSource"
				:disabled="disabled"
				v-if="transInfo.transType == 2"
				:transInfo="transInfo"
			/>
			<!-- <FileTable
          :add-type="fileType"
          :fileData="attachments"
          :disabled="true"
      /> -->
			<AttachmentDetail
				:list="attachments"
				:deliverInfo="deliverInfo"
				:transInfo="transInfo"
			></AttachmentDetail>
		</a-card>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import ContractGl from '@/v2/center/trade/views/receive/components/ContractGl';
import FileTable from '@/v2/center/trade/views/receive/components/FileTable';
import ShipInfo from '@/v2/center/trade/views/receive/components/ShipInfo';
import CarInfo from '@/v2/center/trade/views/receive/components/CarInfo';
import TrainInfo from '@/v2/center/trade/views/receive/components/TrainInfo';
import ReleaseInfo from '@/v2/center/trade/views/receive/components/ReleaseInfo';
import { API_getDeliverRecordInfo, API_getDeliverRecordBusinessInfo } from '@/v2/center/trade/api/receive';
import AttachmentDetail from './components/AttachmentDetail.vue';

export default {
	data() {
		return {
			attachments: [],

			disabled: true,
			dataSource: [],
			deliverId: this.$route.query.deliverId,
			contractVo: {},
			transInfo: {},
			fileType: [
				{
					key: '2',
					label: '运输凭证'
				}
			],
			deliverInfo: {},
			fileTypeList: []
		};
	},
	components: {
		breadcrumb,
		ContractGl,
		FileTable,
		ShipInfo,
		CarInfo,
		TrainInfo,
		ReleaseInfo,
		AttachmentDetail
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			let Fn = API_getDeliverRecordInfo;
			let params = {
				deliverId: this.deliverId,
				deliverBatchId: this.deliverId
			};
			if (this.$route.query.businessLineNo) {
				Fn = API_getDeliverRecordBusinessInfo;
				params.businessLineNo = this.$route.query.businessLineNo;
				if (this.$route.query.coreCompanyUscc) {
					params.coreCompanyUscc = this.$route.query.coreCompanyUscc;
				}
			}
			Fn(params).then(res => {
				if (res.success) {
					const info = res.result || res.data || {};
					this.contractVo = info.contractVo;
					this.deliverInfo = info;
					this.transInfo = info.transInfo;
					if (this.transInfo.transType == 3) {
						this.dataSource = info.transInfo.shipDetailDtoList;
					} else if (this.transInfo.transType == 2) {
						this.dataSource = info.transInfo.automobileDetailDtoList;
					} else if (this.transInfo.transType == 1) {
						this.dataSource = info.transInfo.fireDetailDtoList;
					}
					/** 获取所有的附件类型 */
					// 5 运输凭证 21 化验报告 2称重凭证
					const obj = {};
					const list = info.attachVOS || [];
					list.forEach(el => {
						const key = obj[el.type];
						if (key) {
							obj[el.type].fileList.push(el);
						} else {
							obj[el.type] = {
								type: el.type,
								label: el.typeName,
								typeName: el.typeName,
								disabled: !['CZPZ', 'HYPZ'].includes(el.type),
								fileList: [el],
								accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
							};
						}
					});
					// 排序。。。。。
					// 运输凭证
					obj['YSPZ'] && this.attachments.push(obj['YSPZ']);
					// 化验报告
					if (obj['HYPZ']) {
						this.attachments.push(obj['HYPZ']);
					} else {
						if (this.transInfo.payNode == 'SHIPMENT') {
							this.attachments.push({
								type: 'HYPZ',
								label: '化验凭证',
								typeName: '化验凭证',
								fileList: [],
								disabled: false,
								accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
							});
						}
					}
					// 称重凭证
					if (obj['CZPZ']) {
						this.attachments.push(obj['CZPZ']);
					} else {
						if (this.transInfo.payNode == 'SHIPMENT') {
							this.attachments.push({
								type: 'CZPZ',
								label: '称重凭证',
								typeName: '称重凭证',
								fileList: [],
								disabled: false,
								accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp'
							});
						}
					}
					// 港口确认凭证
					obj['DELIVER_SHIP_HARBOR'] && this.attachments.push(obj['DELIVER_SHIP_HARBOR']);
					//  大票
					obj['DP'] && this.attachments.push(obj['DP']);
					//  车号表
					obj['CHB'] && this.attachments.push(obj['CHB']);
					// 其他
					obj['OTHER'] && this.attachments.push(obj['OTHER']);

					// this.attachments = res.result.attachVOS
				}
			});
		},
		attachmentsChange(attachments) {
			this.attachments = attachments;
		}
	}
};
</script>
<style lang="less" scoped>
.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
</style>
