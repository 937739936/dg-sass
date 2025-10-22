<template>
	<div class="financing">
		<div class="financing-title">
			<a-dropdown
				:trigger="['hover']"
				v-if="capitalCompany.length > 1"
			>
				<div class="company-box">
					<p class="company">{{ capitalCompanyName }}</p>
					<template>
						<div class="chang-btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="12"
								viewBox="0 0 14 12"
								fill="none"
							>
								<path
									d="M11.2625 5.42816H1.22178C0.82079 5.42816 0.5 5.08159 0.5 4.64838C0.5 4.21516 0.82079 3.86859 1.22178 3.86859H11.2625L8.74429 1.15668C8.5037 0.896751 8.5037 0.463538 8.74429 0.194946C8.98489 -0.064982 9.38587 -0.064982 9.63448 0.194946L13.3155 4.17184C13.4358 4.30181 13.5 4.47509 13.5 4.64838C13.5 4.87365 13.4439 5.41083 13.0589 5.41083L11.2625 5.42816ZM2.73751 6.56318H12.7782C13.1792 6.56318 13.5 6.90975 13.5 7.34296C13.5 7.77617 13.1792 8.12274 12.7782 8.12274H2.73751L5.25571 10.8433C5.4963 11.1032 5.4963 11.5365 5.25571 11.8051C5.01511 12.065 4.61413 12.065 4.36552 11.8051L0.684454 7.82816C0.564158 7.69819 0.5 7.52491 0.5 7.35162C0.5 7.12635 0.556138 6.58917 0.941086 6.58917L2.73751 6.56318Z"
									fill="#4682F3"
								/>
							</svg>
							<span style="margin-left: 8px">切换公司</span>
						</div>
					</template>
				</div>
				<a-menu slot="overlay">
					<a-menu-item
						v-for="(items, index) in capitalCompany"
						:key="index"
					>
						<a
							href="javascript:;"
							@click="changeCompany(items)"
							>{{ items.companyName }}</a
						>
					</a-menu-item>
				</a-menu>
			</a-dropdown>
			<p
				class="company"
				v-else
			>
				{{ capitalCompanyName }}
			</p>
		</div>
		<div class="financing-content">
			<div class="financing-content-item">
				<p>已发货(吨)</p>
				<p>{{ capitalDetail.deliveryQuantity | formatMoney(2) }}</p>
			</div>
			<div
				class="financing-content-item"
				style="background: #fff9f0"
			>
				<p>已付款(元)</p>
				<p>{{ capitalDetail.payAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="financing-content-item"
				style="background: #ebfaef"
			>
				<p>业务线回款(元)</p>
				<p>{{ capitalDetail.receiveAmount | formatMoney(2) }}</p>
			</div>
			<div class="financing-content-item">
				<p>已融资(元)</p>
				<p>{{ capitalDetail.financeAmount | formatMoney(2) }}</p>
			</div>
			<div
				class="financing-content-item"
				style="background: #fff9f0"
			>
				<p>已还款(元)</p>
				<p>{{ capitalDetail.repaymentAmount | formatMoney(2) }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { API_GetCCSDynamicMonitoringListCompany, API_GetCapitalDynamicMonitoringDetail } from 'api';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			capitalCompanyName: '',
			capitalCompany: [],
			capitalCompanyUscc: '',
			capitalCompanyName: '',
			capitalCoreCompanyId: '',
			// 统计信息
			capitalDetail: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {},
	methods: {
		// 获取金融机构所有公司
		async init(list) {
			const d = list.map(item => ({
				companyName: item.name,
				companyUscc: item.uscc,
				id: item.id
			}));

			this.capitalCompanyUscc = d[0] ? d[0].companyUscc : '';
			this.capitalCompanyName = d[0] ? d[0].companyName : '';
			this.capitalCoreCompanyId = d[0] ? d[0].id : '';
			this.capitalCompany = d;
			const infoStr = localStorage.getItem('bankInfo');
			if (infoStr) {
				const newInfo = JSON.parse(infoStr);
				this.capitalCompanyUscc = newInfo.capitalCompanyUscc;
				this.capitalCompanyName = newInfo.capitalCompanyName;
				this.capitalCoreCompanyId = newInfo.capitalCoreCompanyId;
			} else {
				/** 前端缓存 当前选择的企业账号 */
				const query = {
					capitalCompanyName: this.capitalCompanyName,
					capitalCompanyUscc: this.capitalCompanyUscc,
					capitalCoreCompanyId: this.capitalCoreCompanyId
				};
				localStorage.setItem('bankInfo', JSON.stringify(query));
			}
			this.$emit('bankInfo', { coreCompanyUscc: this.capitalCompanyUscc });

			this.getCapitalDynamicMonitoringDetail();
		},
		async getCapitalDynamicMonitoringDetail() {
			// 资方顶部详情
			const params = {
				coreCompanyUscc: this.capitalCompanyUscc,
				coreCompanyId: this.capitalCoreCompanyId
			};
			const res = await API_GetCapitalDynamicMonitoringDetail(params);
			this.capitalDetail = res.data;
		},
		changeCompany(items) {
			// 切换企业账号
			this.capitalCompanyName = items.companyName;
			this.capitalCompanyUscc = items.companyUscc;
			this.capitalCoreCompanyId = items.id;
			const query = {
				capitalCompanyName: items.companyName,
				capitalCompanyUscc: items.companyUscc,
				capitalCoreCompanyId: items.id
			};
			/** 前端缓存 当前选择的企业账号 */
			localStorage.setItem('bankInfo', JSON.stringify(query));
			this.$emit('bankInfo', { coreCompanyUscc: items.companyUscc });
			this.getCapitalDynamicMonitoringDetail();
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.financing {
	margin-top: 20px;
}
.financing-title {
	display: flex;
	margin-bottom: 20px;
	.company-box {
		display: flex;
	}
	.company {
		color: rgba(0, 0, 0, 0.8);
		font-family: 'PingFang SC';
		font-size: 18px;
		font-weight: 500;
	}
	.chang-btn {
		border-radius: 4px;
		border: 1px solid var(--VI-, #4682f3);
		padding: 2px 8px;
		display: flex;
		align-items: center;
		color: var(--VI-, #4682f3);
		font-family: 'PingFang SC';
		font-size: 14px;
		margin-left: 20px;

		cursor: pointer;
	}
}
.financing-content {
	display: flex;
	justify-content: space-around;
	align-items: center;
	&-item {
		padding: 14px 12px;
		height: 88px;
		flex: 1;
		border-radius: 6px;
		box-sizing: border-box;
		background: #f0f8ff;
		margin-right: 20px;
		p:first-child {
			color: rgba(0, 0, 0, 0.4);
			font-family: 'PingFang SC';
			font-size: 14px;
		}
		p:last-child {
			color: rgba(0, 0, 0, 0.8);
			font-family: 'PingFang SC';
			font-size: 20px;
			font-weight: 600;
			margin-top: 12px;
		}
	}
}
</style>
