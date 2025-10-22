<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 70px"
		>
			<div class="methods-wrap">
				<span class="slTitle"> 应收融资申请 </span>
			</div>
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				资产信息
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="应收账款流水号">
					<a
						href="javascript:;"
						@click="openAssets"
					>
						{{ receivableInfo.serialNo }}
					</a>
					<span
						@click="editReceivable"
						style="margin-left: 4px"
					>
						<Edit style="cursor: pointer"></Edit>
					</span>
				</a-descriptions-item>
				<a-descriptions-item label="应收账款金额">￥{{ formatMoney(receivableInfo.amount) }}</a-descriptions-item>
				<a-descriptions-item label="拟融资金额">￥{{ formatMoney(receivableInfo.planFinancingAmount) }}</a-descriptions-item>
				<a-descriptions-item label="合同编号">
					<a
						href="javascript:;"
						@click="goContract"
					>
						{{ receivableInfo.contractNo || '-' }}
					</a>
					<span
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="receivableInfo.contractNo"
					>
						<Copy class="cur"></Copy>
					</span>
				</a-descriptions-item>
				<a-descriptions-item label="买方名称">{{ receivableInfo.buyerName || '-' }}</a-descriptions-item>
				<a-descriptions-item label="卖方名称">{{ receivableInfo.sellerName || '-' }}</a-descriptions-item>
			</a-descriptions>
			<div
				class="slTitleAssis"
				style="margin-bottom: 20px"
			>
				融资信息
			</div>
			<components
				:is="applyInner"
				ref="FinancingApplyInner"
				@changePostponement="changePostponement"
			/>
			<FileList
				:list="xieyiDataSource"
				@viewPDF="viewPDF"
			></FileList>
		</a-card>
		<a-modal
			centered
			title="查看协议"
			:width="1000"
			v-model="modalPdfIsShow"
			:mask="true"
			:footer="null"
			:maskClosable="false"
			class="modal-pdf"
		>
			<pdf-preview :url="modalPdfUrl"></pdf-preview>
		</a-modal>

		<div class="slDetailBottom">
			<div>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
					>
						返回
					</a-button>
					<a-button
						type="primary"
						class="btn"
						@click="sumbitApply"
					>
						提交
					</a-button>
				</a-space>
			</div>
		</div>
		<TipModal
			ref="tipModal"
			@ok="saveConfirm"
			title="确认提交"
		>
			<div class="tip-box">
				<p>确定要提交该笔应收融资申请吗？</p>
				<p>
					拟融资金额：<span style="margin-right: 50px">￥{{ formatMoney(cacheParameter.amount) }}元</span>
				</p>
			</div>
		</TipModal>
		<TipModal
			ref="signModal"
			@ok="confirmSign"
			@cancel="goBack"
			title="盖章"
			cancelBtnText="稍后盖章"
			okBtnText="立即盖章"
		>
			<div class="tip-box">
				<p>是否需要立即盖章？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="盖章"
		>
			<div class="tip-box">
				<p>您暂无盖章权限，请联系企业签章员或管理员进行盖章</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.signerUserVOList"
						:key="item.personalId"
					>
						{{ item.personalName }}({{ item.mobile }})
					</span>
				</p>
				<p
					class="tip-wrap-desc"
					v-else
				>
					管理员：
					<span
						style="margin-left: 5px"
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
					>
						{{ item.personalName }}({{ item.mobile }})
					</span>
				</p>
			</div>
		</TipModal>
		<FinancingApplyDraw
			ref="financingApplyDraw"
			type="apply"
		></FinancingApplyDraw>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import FileList from '../components/FileList.vue';
import { formatMoney } from '@sub/filters';
import { Edit } from '@sub/components/svg/index';
import comDownload from '@sub/utils/comDownload.js';
import TipModal from '@sub/components/DelModal.vue';
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_FinancingApplyXieyi,
	API_FinancingApplyXieyiView,
	API_FinancingApplyXieyiDown,
	API_FinancingApplyXieyiDownAll
} from '@/v2/center/financing/api/index.js';

import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';

import FinancingApplyDraw from '@/v2/center/financing/components/FinancingApplyDraw.vue';
// 华能云成 91120118MA06DFA24M
import HuaNanApply from '../components/HuaNanApply.vue';
// 中航租赁
import ZhongHangApply from '../components/ZhongHangApply.vue';
// 华夏银行
import HuaXiaApply from '../components/HuaXiaApply.vue';
// 万物易联
import WanWuApply from '../components/WanWuApply.vue';
// 善美保理
import ShanMeiApply from '../components/ShanMeiApply.vue';
// 兜底的
import CommonApply from '../components/CommonApply.vue';

import { Copy } from '@sub/components/svg/index';

export default {
	data() {
		return {
			oaList: [],
			oaflag: false,
			xieyiDataSource: [],
			modalPdfIsShow: false,
			modalPdfUrl: '',
			// 缓存参数
			cacheParameter: {},
			cacheId: '',
			// 判断是否有盖章需求
			isNeedSign: true,
			visibleConfirmSubmit: true,
			roleData: {}
		};
	},
	computed: {
		receivableInfo() {
			return this.$store.state.financing.receivableInfo;
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 是不是上海银行
		isShangHai() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == '913101150935451053';
		},

		// 判断组件渲染

		applyInner() {
			// 判断是否是华能云成
			this.getDetail();
			if (this.receivableInfo.bankUscc == '91120118MA06DFA24M') {
				return 'HuaNanApply';
			}
			// 判断中航租赁
			if (this.receivableInfo.bankUscc == '91120118MA07GD9T0P') {
				return 'ZhongHangApply';
			}
			// 华夏银行
			if (this.receivableInfo.bankUscc == '91410000594878354X') {
				return 'HuaXiaApply';
			}
			// 万物易联
			if (this.receivableInfo.bankUscc == '91654004MACNA8B65D') {
				return 'WanWuApply';
			}
			// 善美保理-下游营收
			if (this.receivableInfo.productItemType === 'receivable-shanmei-down') {
				return 'ShanMeiApply';
			}
			// 兜底
			return 'CommonApply';
		},
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	mounted() {
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		formatMoney,
		editReceivable() {
			this.$refs.financingApplyDraw.showRelationOrderList();
		},
		changePostponement(postponement) {
			this.getDetail(this.receivableInfo.id || this.receivableInfo.modifyAssetId, postponement);
		},
		getDetail(receivableId = this.receivableInfo.id, postponement) {
			API_FinancingApplyXieyi({ receivableId, postponement }).then(res => {
				if (res.success) {
					this.xieyiDataSource = res.data || [];
				}
			});
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function () {
			this.$message.success('复制成功');
		},
		onError: function () {
			this.$message.error('复制失败');
		},
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},

		viewPDF(record, type) {
			if (record.url) {
				this.modalPdfIsShow = true;
				this.modalPdfUrl = record.url;
			} else {
				this.$refs.FinancingApplyInner.getApplySaveData().then(res => {
					var params = res;
					params.contractType = record.contractType;
					params.func = null;
					if (type == 'down') {
						API_FinancingApplyXieyiDown(params).then(res => {
							comDownload(res, null, record.name + '.pdf');
						});
					} else if (type == 'view') {
						API_FinancingApplyXieyiView(params).then(res => {
							if (res.data) {
								this.modalPdfIsShow = true;
								this.modalPdfUrl = res.data;
							}
						});
					} else {
						API_FinancingApplyXieyiDownAll(params).then(res => {
							comDownload(res, null, `${this.VUEX_ST_COMPANYSUER.companyName}-${this.receivableInfo.bankName}.zip`);
						});
					}
				});
			}
		},
		openConfirm() {
			this.$refs.signNeedModal.open();
		},
		async saveConfirm() {
			let func = this.cacheParameter.func;

			const params = {
				...this.cacheParameter
			};
			delete params.func;

			const res = await func({ ...this.cacheParameter });
			this.cacheId = res.data.applyId;
			this.isNeedSign = res.data.sign;
			if (this.cacheParameter.isShowOa) {
				this.goBack();
			} else {
				// 有权限盖章
				if (this.isNeedSign) {
					this.$refs.tipModal.close();
					if (this.isSignAuth) {
						this.$refs.signModal.open();
					} else {
						this.$refs.signNeedModal.open();
					}
				} else {
					this.goBack();
				}
			}
		},
		async sumbitApply() {
			const res = await this.$refs.FinancingApplyInner.getApplySaveData();
			this.cacheParameter = res;
			this.$refs.tipModal.open();
		},
		confirmSign() {
			this.$router.push({
				path: '/center/financing/financingSign',
				query: {
					id: this.cacheId
				}
			});
		},
		openAssets(record) {
			if (this.receivableInfo.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL') {
				const { href } = this.$router.resolve({
					path: '/center/assets/receivable/manual/detail',
					query: {
						id: record.id,
						activeIndex: '0'
					}
				});

				window.open(href, '_new');
			} else {
				if (this.receivableInfo.originalId) {
					const { href } = this.$router.resolve({
						path: '/center/assets/payable/change/detail',
						query: {
							id: this.receivableInfo.id,
							activeIndex: '2'
						}
					});

					window.open(href, '_new');
				} else {
					const { href } = this.$router.resolve({
						path: '/center/assets/receivable/detail',
						query: {
							id: this.receivableInfo.id,
							activeIndex: '0'
						}
					});

					window.open(href, '_new');
				}
			}
		},
		// 去往合同详情
		goContract() {
			let path = `/center/contract/${this.receivableInfo.orderType.toLowerCase()}/online/detail?id=${this.receivableInfo.contractId}&type=${this.receivableInfo.orderType}`;
			if (this.receivableInfo.contractType == 'DOWN') {
				path = `/center/contract/${this.receivableInfo.orderType.toLowerCase()}/offline/detail?id=${this.receivableInfo.contractId}&type=${this.receivableInfo.orderType.toLowerCase()}`;
			}

			const routeData = this.$router.resolve({
				path
			});

			window.open(routeData.href, '_blank');
		},
		goBack() {
			this.$router.go(-1);
		}
	},
	components: {
		Breadcrumb,
		Edit,
		TipModal,
		FinancingApplyDraw,
		FileList,
		PdfPreview,
		HuaNanApply,
		ZhongHangApply,
		HuaXiaApply,
		WanWuApply,
		ShanMeiApply,
		CommonApply,
		Copy
	}
};
</script>

<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
	}
}
::v-deep .fangkuan-select .ant-select-arrow {
	top: 23%;
}
::v-deep .fangkuan-select .ant-select-selection {
	height: 65px;
}
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	.bot-1 {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.25);
	}
	.bot-2 {
		position: absolute;
		left: 20px;
		font-size: 12px;
		vertical-align: middle;
		margin-top: 2px;
		color: red;
	}
	/deep/ .ant-checkbox-inner {
		width: 14px;
		height: 14px;
		border-radius: 4px;
	}
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
.cur {
	cursor: pointer;
	margin-left: 4px;
	vertical-align: middle;
}
</style>
