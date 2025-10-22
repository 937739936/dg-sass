<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">新增{{ $route.query.typeRecord === 'PROFIT_IN' ? '盘盈' : '采购' }}入库</span>
			</div>
			<template v-if="!isManager">
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
			</template>
			<div class="slTitleAssis">入库信息</div>
			<BaseInfo
				:type="type"
				ref="baseInfo"
				:isRelation="isRelation"
				:selectContractInfo="selectContractInfo"
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
					handleType="IN"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				></Attachment>
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
import { addInOut, getInOutDetail } from '../../api/inout.js';
import BusinessLine from '../../components/coalPlan/BusinessLine.vue';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			// 是否关联合同
			isRelation: false,
			// 关联的合同信息
			selectContractInfo: {},
			// 运输方式
			transportMode: '',
			type: 'IN',
			disabled: false,
			detailInfo: {},
			businessLineNo: null,
			businessLineName: null,
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
		changeType() {
			this.transportMode = 'TRAIN';
		},
		getRelation(flag, info) {
			this.isRelation = flag;
			this.selectContractInfo = info;
			this.businessLineNo = null;
			this.businessLineName = null;
			this.$refs.businessLine.selectedRowKeys = [];
			this.$refs.businessLine.setData(info.businessLineList || []);
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
			params = {
				...params,
				...info,
				attachmentList
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
		BusinessLine
	}
};
</script>

<style scoped  lang='less' >
.slDetailBottom {
	margin-top: 20px;
	width: calc(100vw - 254px);

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
