<template>
	<div class="slMain">
		<Breadcrumb type="OUT"></Breadcrumb>
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">新增{{ $route.query.typeRecord === 'LOSS_OUT' ? '盘亏' : '销售' }}出库</span>
			</div>
			<template v-if="isCoreCompany">
				<div class="slTitleAssis">合同信息</div>
				<ContractInfo
					:type="type"
					@sendRelationFlag="getRelation"
					ref="contractInfo"
				></ContractInfo>
				<div v-show="!!isRelation">
					<BusinessLine
						ref="businessLine"
						@change="onSelectedBusinessLine"
						:type="type"
					/>
				</div>
				<div v-show="selectContractInfo.releaseInstructList && selectContractInfo.releaseInstructList.length > 0">
					<ReleaseInstruct
						ref="releaseInstruct"
						@change="onSelectedReleaseInstruct"
						:type="type"
					/>
				</div>
			</template>
			<div class="slTitleAssis">出库信息</div>
			<BaseInfo
				:type="type"
				ref="baseInfo"
				:isRelation="isRelation"
				:selectContractInfo="selectContractInfo"
				:releaseInstructData="releaseInstructData"
				@sendTransportMode="getTransportMode"
				:isCoreCompany="isCoreCompany"
				:isManager="isManager"
				:logisticsPlatformCenter="logisticsPlatformCenter"
			>
			</BaseInfo>
			<template v-if="logisticsPlatformCenter">
				<div class="slTitleAssis">附件信息</div>
				<Attachment
					:transportMode="transportMode"
					ref="attachment"
					handleType="OUT"
					:isRelation="isRelation"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				></Attachment>
				<WeightAttachment
					v-if="isRelation && transportMode == 'AUTOMOBILE'"
					ref="weightAttachment"
					:list="weightFileType"
				></WeightAttachment>
			</template>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="goBack"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="submit"
						:loading="loading"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfo from './components/contractInfo.vue';
import BaseInfo from './components/BaseInfo.vue';
import Attachment from './components/Attachment.vue';
import WeightAttachment from './components/weightAttachment.vue';
import { addInOut, getInOutDetail } from '../../api/inout.js';
import BusinessLine from '../../components/coalPlan/BusinessLine.vue';
import { mapGetters } from 'vuex';
import ReleaseInstruct from '../../components/coalPlan/ReleaseInstruct.vue';

export default {
	data() {
		return {
			// 是否关联合同
			isRelation: false,
			// 关联的合同信息
			selectContractInfo: {},
			// 运输方式
			transportMode: '',
			type: 'OUT',
			disabled: false,
			detailInfo: {},
			businessLineNo: null,
			businessLineName: null,
			releaseInstructData: null,
			maxOutWeight: 0,
			// 磅单明细上传
			weightFileType: [
				{
					key: 'AUTOMOBILE_TICKET_DETAIL',
					label: '磅单明细',
					required: true,
					fileType: 'fileType24',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp,.xlsx，.xls',
					tip: '【磅单明细】支持上传jpg，jpeg，png，bmp，pdf，xlsx，xls的附件，单个附件大小不超过100M '
				}
			],
			loading: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
    isWarehouseCompany() {
      return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
    },
		// 是否是核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		logisticsPlatformCenter() {
			const { path } = this.$route;
			if (
				[
					'/center/logisticsPlatform/in/profit/add',
					'/center/logisticsPlatform/out/profit/add'
				].includes(path)
			) {
				return false;
			}
			return true;
		}
	},
	created() {},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		}
	},
	methods: {
		// 获取详情
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getInOutDetail(params);
			this.detailInfo = res.data;
			this.transportMode = this.detailInfo.transportMode;
			this.$nextTick(() => {
				if (!this.isManager) {
					this.$refs.contractInfo.init(res.data);
				}
				this.$refs.baseInfo.init(res.data);
				if (this.$refs.attachment) {
					this.$refs.attachment.init(res.data);
				}
			});
		},

		getRelation(flag, info) {
			this.isRelation = flag;
			this.selectContractInfo = info;
			this.businessLineNo = null;
			this.businessLineName = null;
			this.$refs.businessLine.selectedRowKeys = [];
			this.$refs.businessLine.setData(info.businessLineList || []);

			this.releaseInstructData = null;
			this.$refs.releaseInstruct.selectedRowKeys = [];
			this.$refs.releaseInstruct.setData(info.releaseInstructList || []);
		},
		// 获取运输方式
		getTransportMode(type) {
			this.transportMode = type;
		},
		goBack() {
			this.$router.go(-1);
		},
		onSelectedBusinessLine(keys, data) {
			this.businessLineNo = keys;
			this.businessLineName = data.businessLineName;
		},
		onSelectedReleaseInstruct(keys, data) {
			this.releaseInstructData = data;
		},
		async submit() {
			let params = {
				storageRecordType: this.type,
				id: this.$route.query.id,
				stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
				storageType: this.$route.query.typeRecord
			};
      if (!this.isWarehouseCompany) {
        params.source = 'LOGIC_DELIVER';
      }
			if (!this.isManager) {
				/** 获取 合同详情 */
				const contractInfo = await this.$refs.contractInfo.geInfo();
				if (!contractInfo) {
					return;
				}
				if (contractInfo.contractNo && !this.businessLineNo) {
					this.$message.error('请至少选择一条业务线');
					return;
				}
				if (contractInfo.contractNo) {
					params.contractNo = contractInfo.contractNo;
					params.contractType = contractInfo.paperContractNo ? 'OFFLINE' : 'ONLINE';
					params.contractSerialNo = contractInfo.paperContractNo;
					params.contractId = contractInfo.id;
					params.orderNo = contractInfo.serialNo;
				}
				if (this.businessLineNo) {
					params.businessLineNo = this.businessLineNo;
					params.businessLineName = this.businessLineName;
				}
				if (this.releaseInstructData) {
					params.releaseInstructId = this.releaseInstructData?.id;
					params.releaseInstructNo = this.releaseInstructData?.serialNo;
				}
			}

			const info = await this.$refs.baseInfo.save();
			if (!info) {
				return;
			}
			let list = [];
			if (this.$refs.attachment) {
				list = this.$refs.attachment.save();
			}
			if (!list && !this.isManager && this.logisticsPlatformCenter) {
				return;
			}
			if (info.remark) {
				info.remarkList = [{ remark: info.remark }];
			}
			let attachmentList = [];
			list.forEach(el => {
				attachmentList = [...el.list, ...attachmentList];
			});

			let vehicleInfoList = [];
			if (this.isRelation && this.transportMode == 'AUTOMOBILE') {
				// 榜单明细
				const obj = this.$refs.weightAttachment.save();
				if (!obj) {
					return;
				}
				attachmentList = [...attachmentList, ...obj.newAttachList];
				obj.vehicleInfoList.forEach(el => {
					vehicleInfoList.push({
						...el,
						plateNumberList: el.plateNumberList
					});
				});
			}

			params = {
				...params,
				...info,
				attachmentList,
				vehicleInfoList
			};
			if (this.disabled) return;
			this.disabled = true;
			try {
				this.loading = true;
				await addInOut(params);
				this.$message.success('保存成功');
				this.goBack();
				this.disabled = false;
				this.loading = false;
			} catch (error) {
				this.disabled = false;
				this.loading = false;
			}
		}
	},
	components: {
		Breadcrumb,
		ContractInfo,
		BaseInfo,
		Attachment,
		BusinessLine,
		ReleaseInstruct,
		WeightAttachment
	}
};
</script>

<style scoped  lang='less' >
.slDetailBottom {
	width: calc(100vw - 254px);
	margin-top: 20px;
	width: 100%;
	// min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	// border-top: 1px solid #E5E6EB;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 9;
}
</style>
