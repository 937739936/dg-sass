<template>
	<div class="detail-title">
		<div class="detail-title-bot">
			<div class="detail-title-bot-left">
				<p>
					<label>业务线号：</label>
					<a-tooltip placement="topLeft">
						<template slot="title">
							{{ detailData.businessLineNo }}
						</template>
						<span class="c8 special">{{ detailData.businessLineNo }}</span>
					</a-tooltip>
				</p>
				<p>
					<label>采购合同：</label>
					<a-tooltip placement="topLeft">
						<template slot="title">
							{{ detailData.upContractNo }}
						</template>
						<span class="c8 special">{{ detailData.upContractNo }}</span>
					</a-tooltip>
				</p>
				<p>
					<label>销售合同：</label>
					<a-tooltip placement="topLeft">
						<template slot="title">
							{{ detailData.downContractNo }}
						</template>
						<span class="c8 special">{{ detailData.downContractNo }}</span>
					</a-tooltip>
				</p>
				<p v-if="detailData.transContractNo">
					<label>运输合同：</label>
					<a-tooltip placement="topLeft">
						<template slot="title">
							{{ detailData.transContractNo }}
						</template>
						<span class="c8 special">{{ detailData.transContractNo }}</span>
					</a-tooltip>
				</p>
				<p v-if="!isBank && detailData.upStreamDirectorName">
					<label>上游实际负责人：</label>
					<a-tooltip
						class="omit"
						placement="topLeft"
					>
						<template slot="title">
							<p>
								<span v-if="detailData.upStreamDirectorBusinessUnitName">
									{{ detailData.upStreamDirectorBusinessUnitName }} -
								</span>
								{{ detailData.upStreamDirectorName }} - {{ detailData.upStreamDirectorPhone }}
							</p>
						</template>
						<span class="c8 omit">
							<span v-if="detailData.upStreamDirectorBusinessUnitName">{{ detailData.upStreamDirectorBusinessUnitName }} -</span>

							{{ detailData.upStreamDirectorName }}
						</span>
						<i
							style="margin-left: 4px; margin-right: 20px"
							v-if="detailData.upStreamDirectorName"
							><Phone
						/></i>
					</a-tooltip>
				</p>
				<p v-if="!isBank && detailData.downStreamDirectorName">
					<label>下游实际负责人：</label>
					<a-tooltip
						class="omit"
						placement="topLeft"
					>
						<template slot="title">
							<p>
								<span v-if="detailData.downStreamDirectorBusinessUnitName"
									>{{ detailData.downStreamDirectorBusinessUnitName }} -
								</span>
								{{ detailData.downStreamDirectorName }} - {{ detailData.downStreamDirectorPhone }}
							</p>
						</template>
						<span class="c8 omit">
							<span v-if="detailData.downStreamDirectorBusinessUnitName">
								{{ detailData.downStreamDirectorBusinessUnitName }} -</span
							>
							{{ detailData.downStreamDirectorName }}
						</span>
						<i
							style="margin-left: 4px; margin-right: 20px"
							v-if="detailData.downStreamDirectorName"
							><Phone
						/></i>
					</a-tooltip>
				</p>
				<p>
					<label>创建时间：</label>
					<a-tooltip placement="topLeft">
						<template slot="title">
							{{ detailData.createDate }}
						</template>
						<span class="c8 special">{{ detailData.createDate }}</span>
					</a-tooltip>
				</p>
				<p v-if="detailData.upStreamAuditChainAndOperator && !isBank">
					<label>上游流程发起人：</label>
					<a-tooltip
						v-for="(item, i) in detailData.upStreamAuditChainAndOperator.operatorInfo"
						:key="i"
						placement="topLeft"
					>
						<template slot="title">
							{{ item.systemName }}流程发起人 - {{ item.operatorName }}-{{ item.operatorMobile }}
						</template>
						<span class="c8 omit">{{ item.systemName }}流程发起人 - {{ item.operatorName }}</span>
						<i style="margin-left: 4px; margin-right: 20px"><Phone /></i>
					</a-tooltip>
				</p>
				<p v-if="detailData.downStreamAuditChainAndOperator && !isBank">
					<label>下游流程发起人：</label>
					<a-tooltip
						v-for="(item, i) in detailData.downStreamAuditChainAndOperator.operatorInfo"
						:key="i"
						placement="topLeft"
					>
						<template slot="title">
							{{ item.systemName }}流程发起人 - {{ item.operatorName }}-{{ item.operatorMobile }}
						</template>
						<span class="c8 omit">{{ item.systemName }}流程发起人 - {{ item.operatorName }}</span>
						<i style="margin-left: 4px; margin-right: 20px"><Phone /></i>
					</a-tooltip>
				</p>
				<div class="extra">
					<!-- 交互期限 -->
					<div class="extra-item">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M1.75 14H12.25C13.2165 14 14 13.2165 14 12.25V2.9166C14 1.95009 13.2165 1.16658 12.25 1.16658H10.5V0.583248C10.5 0.261115 10.2388 0 9.91667 0C9.59454 0 9.33338 0.261115 9.33333 0.583248V1.16658H4.66667V0.583248C4.66662 0.261115 4.40546 0 4.08333 0C3.7612 0 3.50005 0.261115 3.5 0.583248V1.16658H1.75C0.783502 1.16658 0 1.95009 0 2.9166V12.25C0 13.2165 0.783502 14 1.75 14ZM1.16667 12.25V5.27911H12.8333V12.25C12.8333 12.5722 12.5722 12.8333 12.25 12.8333H1.75C1.42783 12.8333 1.16667 12.5722 1.16667 12.25ZM1.16666 4.11219H12.8333V2.91634C12.8333 2.59418 12.5722 2.33301 12.25 2.33301H10.5V2.91634C10.4999 3.23848 10.2388 3.49959 9.91666 3.49959C9.59453 3.49959 9.33338 3.23848 9.33333 2.91634V2.33301H4.66666V2.91634C4.66662 3.23848 4.40546 3.49959 4.08333 3.49959C3.7612 3.49959 3.50005 3.23848 3.5 2.91634V2.33301H1.75C1.42783 2.33301 1.16666 2.59418 1.16666 2.91634V4.11219ZM5.845 10.8908C5.95258 10.9915 6.0943 11.0478 6.24167 11.0483C6.39756 11.0477 6.54671 10.9846 6.65583 10.8733L9.74167 7.82829C9.94163 7.59827 9.9308 7.25308 9.71682 7.03604C9.50284 6.81899 9.15784 6.80327 8.925 6.99996L6.23583 9.65414L5.06917 8.55163C4.83298 8.33663 4.46814 8.35034 4.24875 8.58245C4.02936 8.81456 4.03621 9.1796 4.26417 9.4033L5.845 10.8908Z"
								fill="#C3C3C3"
							/>
						</svg>
						<span style="margin-left: 5px">{{ detailData.deliveryDateStart }}至{{ detailData.deliveryDateEnd }}</span>
					</div>
					<!-- 运输方式 -->
					<div class="extra-item">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<path
								d="M0.000164096 6.28861C0.000164096 5.98761 0.235197 5.74368 0.525158 5.74368C0.815119 5.74368 1.05015 5.98779 1.05015 6.28861V11.613C1.05015 11.7134 1.12856 11.7947 1.22516 11.7947C1.25407 11.7947 1.28252 11.7873 1.30792 11.7731L3.84837 10.3593C4.03245 10.2567 4.23931 10.2047 4.44878 10.2085C4.65826 10.2123 4.8632 10.2718 5.04362 10.381L9.18685 12.8856C9.21185 12.9008 9.24015 12.9092 9.26917 12.9102C9.29819 12.9112 9.32698 12.9047 9.35292 12.8913L12.8529 11.0864C12.9124 11.0557 12.95 10.9927 12.95 10.9238V6.28861C12.95 5.98761 13.185 5.74368 13.475 5.74368C13.765 5.74368 14 5.98779 14 6.28861V10.9238C14 11.4064 13.7366 11.8474 13.3201 12.0623L9.82018 13.8672C9.63878 13.9609 9.43735 14.0063 9.23438 13.9993C9.03141 13.9923 8.83341 13.9331 8.65855 13.8272L4.51511 11.323C4.48934 11.3073 4.46007 11.2988 4.43013 11.2983C4.4002 11.2977 4.37064 11.3051 4.34433 11.3197L1.80388 12.7338C1.62617 12.8327 1.42718 12.8845 1.22498 12.8845C0.548438 12.8845 0 12.3155 0 11.6132V6.28861H0.000164096ZM11.025 4.06295C11.025 5.54051 9.82456 7.3092 7.464 9.4525C7.33601 9.56868 7.171 9.63281 7.00009 9.63281C6.82917 9.63281 6.66417 9.56868 6.53618 9.4525C4.17544 7.30938 2.97514 5.54051 2.97514 4.06295C2.97514 1.8168 4.77937 0 7.00009 0C9.22081 0 11.025 1.81682 11.025 4.06295ZM4.02513 4.06295C4.02513 5.09805 5.00477 6.57957 7.00009 8.43299C8.99541 6.57957 9.97505 5.09805 9.97505 4.06295C9.97505 2.41612 8.64524 1.07694 7.00009 1.07694C5.35494 1.07694 4.02513 2.41595 4.02513 4.06295ZM7.00009 5.20521C6.72162 5.20521 6.45455 5.09175 6.25764 4.88978C6.06073 4.68782 5.9501 4.41389 5.9501 4.12827C5.9501 3.84265 6.06073 3.56872 6.25764 3.36676C6.45455 3.16479 6.72162 3.05133 7.00009 3.05133C7.27856 3.05133 7.54563 3.16479 7.74254 3.36676C7.93945 3.56872 8.05008 3.84265 8.05008 4.12827C8.05008 4.41389 7.93945 4.68782 7.74254 4.88978C7.54563 5.09175 7.27856 5.20521 7.00009 5.20521Z"
								fill="#C3C3C3"
							/>
						</svg>
						<span style="margin-left: 5px">{{ detailData.transTypeDesc }}</span>
					</div>
					<!-- 业务类型 -->
					<div class="extra-item">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<path
								d="M0.958305 4.68119V11.1594C0.958305 11.6595 1.38907 12.0752 1.91817 12.0752H12.0849C12.6109 12.0782 13.0401 11.67 13.0433 11.1624V4.68119C13.0433 4.18112 12.6125 3.76541 12.0834 3.76541H1.91661C1.39064 3.7624 0.961427 4.17058 0.958305 4.67817V4.68119ZM3.66154 2.8421V2.37517C3.66466 1.61604 4.29989 1.00302 5.08651 1H8.93066C9.71728 0.998497 10.3556 1.61152 10.3572 2.37066V2.84361H12.0834C13.1369 2.84361 13.9938 3.66449 14 4.68269V11.1609C13.9984 12.1791 13.1416 13.0015 12.0881 13H1.91661C0.863099 13 0.00624303 12.1776 0 11.1609V4.68119C0.00156076 3.66299 0.858417 2.84059 1.91193 2.8421H3.66154ZM4.61672 2.8421H9.40045V2.37517C9.40045 2.12665 9.19287 1.92331 8.93534 1.92331H5.08651C4.82899 1.92482 4.61984 2.12665 4.61672 2.37517V2.8421ZM4.60736 6.99623C4.60892 6.23108 5.25039 5.61203 6.04326 5.61052H7.95674C8.74805 5.61052 9.39264 6.22505 9.39264 6.99623C9.39108 7.76139 8.74961 8.38044 7.95674 8.38195H6.04326C5.25195 8.38346 4.61048 7.76742 4.60736 7.00377V6.99623ZM5.5641 6.99623C5.5641 7.2553 5.77481 7.45714 6.04169 7.45714H7.95518C8.21739 7.45714 8.43278 7.24928 8.43278 6.99623C8.43434 6.74319 8.22519 6.53684 7.96299 6.53533H6.04326C5.77949 6.53684 5.56566 6.74168 5.5641 6.99623ZM0 6.53533H5.5641V7.45864H0V6.53533ZM8.4359 6.53533H14V7.45864H8.4359V6.53533Z"
								fill="#C3C3C3"
							/>
						</svg>
						<span style="margin-left: 5px">{{ detailData.businessTypeDesc }}</span>
					</div>
					<!-- 资金来源： -->
					<div class="extra-item">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M7 14.0002C3.88506 14.0002 1 12.8056 1 9.04183C1 5.27802 4.16563 3.58752 4.16563 3.58752C4.16563 3.58752 3.03634 2.34569 3.76927 1.10832C4.44837 -0.0380978 6.21335 -0.00829688 6.86668 0.00273436C6.91847 0.00360884 6.96327 0.00436536 7 0.00440863C7.03797 0.00445337 7.08458 0.00372207 7.13862 0.00287422C7.79614 -0.0074425 9.55353 -0.0350161 10.2308 1.10832C10.9637 2.34569 9.86382 3.58752 9.86382 3.58752C9.86382 3.58752 13 5.278 13 9.04183C13 12.8056 10.115 14.0002 7 14.0002ZM4.57481 1.68363C4.27894 2.79726 5.3631 3.91716 5.3631 3.91716C5.3631 3.91716 1.99998 5.45486 2 8.84228C2 12.2297 4.21966 12.9307 6.99785 12.9307C9.77608 12.9307 12 12.2297 12 8.84228C12 5.45484 8.68543 3.91716 8.68543 3.91716C8.68543 3.91716 9.75596 2.70134 9.42434 1.68363C8.9557 0.779668 7.17316 1.03626 7 1.08226C6.80177 1.03626 4.91312 0.744855 4.57481 1.68363ZM8.30141 6.55766C8.49668 6.36239 8.49668 6.04581 8.30141 5.85055C8.10615 5.65529 7.78957 5.65529 7.59431 5.85055L6.99996 6.4449L6.40568 5.85062C6.21042 5.65536 5.89383 5.65536 5.69857 5.85062C5.50331 6.04589 5.50331 6.36247 5.69857 6.55773L6.14084 7H5.5C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H6.5V8.72266H5.5C5.22386 8.72266 5 8.94651 5 9.22266C5 9.4988 5.22386 9.72266 5.5 9.72266H6.5V10.5C6.5 10.7761 6.72386 11 7 11C7.27614 11 7.5 10.7761 7.5 10.5V9.72266H8.5C8.77614 9.72266 9 9.4988 9 9.22266C9 8.94651 8.77614 8.72266 8.5 8.72266H7.5V8H8.5C8.77614 8 9 7.77614 9 7.5C9 7.22386 8.77614 7 8.5 7H7.85907L8.30141 6.55766Z"
								fill="#C3C3C3"
							/>
						</svg>
						<span style="margin-left: 5px">{{ detailData.payTypeDesc }}</span>
					</div>
				</div>
			</div>
			<div
				class="detail-title-bot-right"
				@click="warningFunc"
				v-if="!isBank && detailData.riskAlertCount"
			>
				<p class="warning-title">风险预警</p>
				<p class="warning-num">{{ detailData.riskAlertCount }}</p>
			</div>
		</div>
		<WarningDrawer
			ref="warningDrawer"
			:getBusinessLineRiskAlertList="getBusinessLineRiskAlertList"
			:type="type"
		></WarningDrawer>
	</div>
</template>

<script>
import { Phone } from '@sub/components/svg';
import WarningDrawer from './WarningDrawer.vue';

export default {
	props: {
		detailData: {
			default: () => {
				return {
					contract: {}
				};
			}
		},
		// 登录的企业信息
		VUEX_ST_COMPANYSUER: {
			default: () => {
				return {
					roles: []
				};
			}
		},
		// 使用的接口

		removeBusinessLineCheck: {},
		removeBusinessLine: {},
		checkBuyFinish: {},
		checkSellFinish: {},
		submitBuyFinish: {},
		submitSellFinish: {},
		// 业务线
		getBusinessLineRiskAlertList: {},


		isBank: {
			default: false
		},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			selectType: 'buy',
			// 下载
			downType: [],
			fileList: [],
			// 合同完结
			finishVisible: false,
			finishType: '',
			// 解除业务线信息
			removeBusinessErrorList: [],
			// admin 上下游完结审核
			modalFileForm: this.$form.createForm(this),
			adminAuditType: 'up',
			adminAuditVisible: false
		};
	},
	computed: {
		roles() {
			return this.VUEX_ST_COMPANYSUER.roles;
		},
		isFinishAuth() {
			return this.roles.some(el => ['ADMIN', 'OPERATOR'].includes(el));
		},
		auditTitle() {
			if (this.adminAuditType == 'up') {
				return '上游完结审核';
			}
			return '下游完结审核';
		},
		// 上下游按钮审核权限
		isShowAuthDownBtn() {
			return [
				'UP_EXECUTING_DOWN_COMPLETED_AUDIT_ING',
				'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_ING',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
				'COMPLETED_AUDIT_ING'
			].includes(this.detailData.businessLineDisplayStatus);
		},
		isShowAuthUpBtn() {
			return [
				'UP_COMPLETED_AUDIT_ING_DOWN_EXECUTING',
				'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_PASS',
				'COMPLETED_AUDIT_ING'
			].includes(this.detailData.businessLineDisplayStatus);
		},
		// 滚动的距离
		isShowFixedTitle() {
			if (this.type == 'rest') {
				return this.$store.state.scroll.scrollDistance >= 120;
			}
			return this.$store.state.scroll.scrollDistance >= 130;
		}
	},
	activated() {
		this.selectType = 'buy';
	},
	mounted() {},
	watch: {
		detailData: {
			handler(info) {
				// 判断当前有没有运输合同
				if (info.transContractNo) {
					this.downType = ['UP_STREAM', 'DOWN_STREAM', 'TRANS_CONTRACT'];
					this.fileList = [
						{ label: '上游附件', value: 'UP_STREAM' },
						{ label: '下游附件', value: 'DOWN_STREAM' },
						{ label: '运输合同附件', value: 'TRANS_CONTRACT' }
					];
				} else {
					this.downType = ['UP_STREAM', 'DOWN_STREAM'];
					this.fileList = [
						{ label: '上游附件', value: 'UP_STREAM' },
						{ label: '下游附件', value: 'DOWN_STREAM' }
					];
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		// 风险预警
		warningFunc() {
			if (!this.detailData.riskAlertCount) return;
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = 'hidden';
			document.body.style.setProperty('height', '100vh', 'important');

			document.addEventListener('touchmove', m, { passive: false }); //禁止页面
			this.$refs.warningDrawer.open();
		},
		changeTab(type) {
			this.selectType = type;
			this.$emit('changeTab', type);
		}
	},
	components: {
		Phone,
		WarningDrawer
	}
};
</script>
<style  lang='less' >
.white-bg-tooltips {
	a {
		display: block;
		margin: 5px 0;
		line-height: 22px;
	}
	.ant-tooltip-inner {
		background: #fff;
		padding: 10px 20px;
	}
	.ant-tooltip {
		color: #fff;
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
</style>
<style scoped  lang='less' >
.detail-title {
	margin-top: 10px;
	&-bot {
		display: flex;
		justify-content: space-between;
		i {
			// display: inline-block;
			margin-top: 2px;
		}
		&-left {
			display: flex;
			flex-wrap: wrap;
			// margin-top: 20px;
			flex: 1;
			p {
				display: flex;
				width: 25%;
				margin-top: 20px;
				label {
					color: var(--text-40, rgba(0, 0, 0, 0.4));
				}
				span {
					font-family: PingFang SC;
					font-size: 14px;
					display: inline-block;
					color: var(--text-80, rgba(0, 0, 0, 0.8));
				}
				.c8 {
					color: var(--text-80, rgba(0, 0, 0, 0.8)) !important;
				}
				span.special {
					display: inline-block !important;
				}
				span:nth-child(2) {
					flex: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: flex;
				}
			}
		}
		.extra {
			width: 100%;
			margin-top: 20px;
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 14px;
			display: flex;
			&-item {
				display: flex;
				align-items: center;
				padding: 6px 12px;
				background: var(---BG, #f3f5f6);
				margin-right: 20px;
				border-radius: 4px;
			}
		}
		&-right {
			width: 88px;
			height: 101px;
			background: #dae0e6;
			border-radius: 6px;
			padding: 4px;
			margin-top: 20px;
			margin-left: 40px;
			cursor: pointer;
			.warning-title {
				font-size: 14px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #ffffff;
				line-height: 24px;
				width: 80px;
				height: 24px;
				background: #ff800f;
				border-radius: 4px;
				text-align: center;
			}
			p {
				margin-bottom: 0;
			}
			.warning-num {
				width: 80px;
				height: 65px;
				background: #ffffff;
				border-radius: 4px;
				font-size: 40px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.8);
				line-height: 65px;
				margin-top: 4px;
				text-align: center;
			}
		}
	}
}
.business-line-title {
	display: flex;
	align-items: center;
}

.status {
	display: inline-block;
	padding: 3px 6px;
	align-items: flex-start;
	gap: 10px;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #ffdac8;
	color: #ff7937;
	margin-left: 20px;
	cursor: pointer;
	text-align: center;
}
.COMPLETED_AUDIT_REJECT,
.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING,
.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS,
.UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING,
.UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT {
	background: #f2d0d0;
	color: #d44;
}
.EXECUTING {
	background: #c1d7ff;
	color: var(--VI-, #4682f3);
}
.omit {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.c8 {
	color: rgba(0, 0, 0, 0.8);
}
.c4 {
	color: rgba(0, 0, 0, 0.4);
}
.ft600 {
	font-weight: 600;
}
</style>
