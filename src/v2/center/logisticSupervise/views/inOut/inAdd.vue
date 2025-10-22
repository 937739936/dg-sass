<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">{{ title }}</span>
			</div>
			<template>
				<ContractInfo
					:contractData="selectContractInfo"
					:isRelation="true"
					ref="contractInfo"
				></ContractInfo>
			</template>
			<div v-if="relationType === '0'">
				<div class="slTitleAssis">入库信息</div>
				<BaseInfo
					:type="type"
					ref="baseInfo"
					:isRelation="isRelation"
					:selectContractInfo="selectContractInfo"
					@sendTransportMode="getTransportMode"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				/>
				<div class="slTitleAssis">附件信息</div>
				<Attachment
					:transportMode="transportMode"
					ref="attachment"
					handleType="IN"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				></Attachment>
			</div>
			<div v-else>
				<div class="slTitleAssis">入库信息</div>
				<InventorySurplusForm
					ref="inventorySurplusFormInfo"
					:type="type"
					:isRelation="isRelation"
					:selectContractInfo="selectContractInfo"
					@sendTransportMode="getTransportMode"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				/>
				<div class="slTitleAssis">附件信息</div>
				<AttachmentInventorySurplus
					:transportMode="transportMode"
					handleType="IN"
					ref="attachmentInventorySurplus"
					:isCoreCompany="isCoreCompany"
					:isManager="isManager"
				/>
			</div>
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
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_contractDetail } from '@/v2/center/trade/api/transportContract';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfo from './components/contractInfo.vue';
import BaseInfo from './components/BaseInfo.vue';
import Attachment from './components/Attachment.vue';
import AttachmentInventorySurplus from './components/AttachmentInventorySurplus.vue';
import InventorySurplusForm from './components/InventorySurplusForm.vue';
import { addInOut, getInOutDetail } from '../../api/inout.js';

export default {
	data() {
		return {
			// 是否关联合同
			// isRelation:false,
			// 关联的合同信息
			selectContractInfo: {},
			// 运输方式
			transportMode: '',
			type: 'IN',
			disabled: false,
			detailInfo: {},
			businessLineNo: null,
			businessLineName: null
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		// 是否是核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		isRelation() {
			return !!this.selectContractInfo.id;
		},
		title() {
			if (this.$route.query.type === '0') {
				return '新增采购入库记录';
			}
			return '新增盘盈入库记录';
		},
		relationType() {
			return this.$route.query.type;
		}
	},

	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		} else {
			this.getDetailsData();
		}
	},
	methods: {
		// 获取合同详情
		getDetailsData() {
			const id = this.$route.query.contractId;
			if (!id) return;
			API_contractDetail({
				id,
				serialNo: this.$route.query.serialNo,
				productCode: 'LOGIC_DELIVER',
				source: 'LOGIC_DELIVER',
				contractType: 'TRANSFER',
				storageGoodsInOutTypeEnum: 'IN',
				orderTypeEnum: 'OFFLINE'
			}).then(res => {
				if (res.success) {
					this.selectContractInfo = res.data;
				}
			});
		},
		// 获取详情
		async getDetail() {
			const params = {
				id: this.$route.query.id,
				source: 'LOGIC_DELIVER'
			};
			const res = await getInOutDetail(params);
			this.detailInfo = res.data;
			this.transportMode = this.detailInfo.transportMode;
			this.$nextTick(() => {
				if (!this.isManager) {
					this.$refs.contractInfo.init(res.data);
				}
				this.$refs.baseInfo.init(res.data);
				this.$refs.attachment.init(res.data);
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
				id: this.$route.query.id
			};
			if (!this.isManager) {
				/** 获取 合同详情 */
				const contractInfo = this.selectContractInfo;
				if (!contractInfo) {
					return;
				}
				if (contractInfo.contractNo) {
					params.contractNo = contractInfo.paperContractNo;
					params.contractId = contractInfo.id;
					params.orderNo = contractInfo.contractNo;
					params.contractType = 'TRANSFER';
				}
			}
			const info = this.relationType === '0' ? await this.$refs.baseInfo.save() : await this.$refs.inventorySurplusFormInfo.save();
			if (!info) {
				return;
			}
			const list = this.relationType === '0' ? this.$refs.attachment.save() : this.$refs.attachmentInventorySurplus.save();
			if (!list && !this.isManager) {
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
				attachmentList,
				source: 'LOGIC_DELIVER',
				storageType: this.$route.query.typeRecord
			};
			if (this.disabled) return;
			this.disabled = true;
			try {
				await addInOut(params);
				this.$message.success('保存成功');
				this.goBack();
				this.disabled = false;
			} catch (error) {
				this.disabled = false;
			}
		}
	},
	components: {
		Breadcrumb,
		ContractInfo,
		BaseInfo,
		Attachment,
		InventorySurplusForm,
		AttachmentInventorySurplus
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
