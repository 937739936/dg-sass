<template>
	<div
		class="slMain"
		v-if="detailData"
	>
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul
				class="grid-wrap"
				v-if="detailData.contractInfo"
			>
				<li>
					<span class="label">合同编号</span>
					<span>
						<div
							@mouseenter="onMouseOverContractNo"
							@mouseleave="onMouseOutContractNo"
							style="diaplay: inline-block"
						>
							<a @click="viewContractDetail()">
								{{ detailData.contractInfo.contractNo }}
							</a>
							<em
								v-show="!copyContractNoVisible"
								class="copy-icon"
							>
								<Copy></Copy>
							</em>
							<em
								v-show="copyContractNoVisible"
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
								v-clipboard:copy="detailData.contractInfo.contractNo"
								class="copy-icon"
							>
								<CopyNow></CopyNow>
							</em>
						</div>
					</span>
				</li>
				<li>
					<span class="label">卖方企业</span>
					<span>{{ detailData.contractInfo.sellerName }}</span>
				</li>
				<li>
					<span class="label">买方企业</span>
					<span>{{ detailData.contractInfo.buyerName }}</span>
				</li>
				<li>
					<span class="label">品名</span>
					<TextOverFlow
						:content="detailData.contractInfo.goodsName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">基准价格</span>
					<TextOverFlow
						v-if="!detailData.contractInfo.followTheMarket && detailData.contractInfo.basePriceDesc"
						:content="detailData.contractInfo.basePriceDesc"
						:maxWidth="maxWidth"
					/>
					<span v-if="detailData.contractInfo.followTheMarket">随行就市</span>
					<span v-if="!detailData.contractInfo.followTheMarket && detailData.contractInfo.basePrice"
						>{{ detailData.contractInfo.basePrice | formatMoney(2) }}元/吨</span
					>
					<span v-if="!detailData.contractInfo.followTheMarket && !detailData.contractInfo.basePrice">-</span>
				</li>
				<li>
					<span class="label">数量</span>
					<span
						>{{ detailData.contractInfo.quantity | formatMoney(2) }}吨
						<template v-if="detailData.contractInfo.quantityOffset">（±{{ detailData.contractInfo.quantityOffset }}%）</template>
					</span>
				</li>
				<li>
					<span class="label">签订日期</span>
					<span>{{ detailData.contractInfo.signTime }}</span>
				</li>
				<li>
					<span class="label">交货期限</span>
					<span>{{ detailData.contractInfo.deliveryStartDate }}至{{ detailData.contractInfo.deliveryEndDate }}</span>
				</li>
				<li>
					<span class="label">运输方式</span>
					<span>{{ detailData.contractInfo.transportModeDesc || '无' }}</span>
				</li>
			</ul>
			<div class="slTitleAssis">业务线信息</div>
			<div class="table-box">
				<a-table
					:columns="businessLineColumns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="detailData.businessLineInfoList"
					:pagination="false"
				>
					<template
						slot="businessLineNo"
						slot-scope="text, items"
					>
						<a
							v-if="isCreator"
							href="javascript:;"
							@click="viewBusinessLineDetail(items)"
							>{{ text }}</a
						>
						<span v-else>{{ text }}</span>
					</template>
				</a-table>
			</div>
			<div class="slTitleAssis">追保函信息</div>
			<a-form
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="追保金额(元)">
							<a-input
								disabled
								v-model="'¥' + detailData.bondLetterData.recoveryAmountThousandth"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="签发日期">
							<a-input
								disabled
								v-model="detailData.bondLetterData.signTime"
							></a-input>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="追保截止日期">
							<a-input
								disabled
								v-model="detailData.bondLetterData.recoveryDeadline"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="slTitleAssis">附件信息</div>
			<div class="table-box files-box">
				<a-table
					:columns="filesColumns"
					class="new-table"
					:bordered="false"
					:dataSource="detailData.bondLetterData.attachmentList"
					:pagination="false"
				>
					<template
						slot="transferName"
						slot-scope="text, items"
					>
						<span
							class="fileName"
							@click="viewFile(items)"
							>{{ text }}</span
						>
					</template>
					<template
						slot="action"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							@click="downloadPdf(items)"
							>下载</a
						>
					</template>
				</a-table>
			</div>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="$router.push('/center/bondLetter/online/list')"
						>取消</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="cancel()"
						>驳回</a-button
					>
					<a-button
						type="primary"
						@click="confirm()"
						>确认</a-button
					>
				</a-space>
			</div>
		</a-card>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<CancelModal
			ref="cancelModal"
			v-on:clickOk="clickCancelOk"
			tips="驳回后，如再需开追保函，则需要重新走流程，如确需驳回，请继续操作"
			title="驳回"
		/>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
			:footerVisible="footerVisible"
		/>
		<ConfirmModal
			ref="signConfirmModal"
			@confirm="signConfirmFunc"
			@cancelConfirm="signCancelConfirmFunc"
			:cancelText="cancelText"
			:okText="okText"
		/>
		<ConfirmModal
			ref="jumpConfirmModal"
			@confirm="jumpConfirmFunc"
			:footerVisible="false"
			@cancelConfirm="jumpConfirmFunc"
		/>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_GetBondLetterDetail, API_BondLetterReject, API_BondLetterConfirm } from '@/v2/center/trade/api/bondLetter';
import { API_DOWNLPREVIEWTE } from '@/v2/api/common';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import comDownload from '@sub/utils/comDownload.js';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import { mapGetters } from 'vuex';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import ENV from '@/api/env';
import { Copy, CopyNow } from '@sub/components/svg';
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo', width: '33.3%', scopedSlots: { customRender: 'businessLineNo' } },
	{ title: '业务线名称', dataIndex: 'businessLineName', width: '33.3%' },
	{ title: '上游采购合同编号', dataIndex: 'parentContractNo', width: '20%' }
];
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeName', width: '40%' },
	{ title: '文件编号', dataIndex: 'transferName', width: '45%', scopedSlots: { customRender: 'transferName' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
export default {
	name: 'Detail',
	data() {
		return {
			detailData: null,
			copyContractNoVisible: false, // 复制合同编号icon
			businessLineColumns,
			filesColumns,
			footerVisible: true, // 确认弹窗是否有footer
			cancelText: '取消',
			okText: '确定',
			roleData: {},
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸
			previewImg: ''
		};
	},
	components: {
		Breadcrumb,
		CancelModal,
		ConfirmModal,
		TextOverFlow,
		Copy,
		CopyNow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCreator() {
			return this.VUEX_ST_COMPANYSUER.company.uscc === this.detailData.contractInfo.sellerUscc;
		}
	},
	async created() {
		this.init();
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	methods: {
		async init() {
			await this.getDetail();
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 220;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			} else {
				this.maxWidth = 350;
			}
		},
		// 获取详情
		getDetail() {
			return API_GetBondLetterDetail({ bondLetterId: this.$route.query.bondLetterId }).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		viewBusinessLineDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.parentOrderNo,
					downOrderNo: items.orderNo,
					businessLineType: items.type,
					businessLineNo: items.businessLineNo,
					contractType: 0,
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					downstreamActiveIndex: 0
				}
			});
			window.open(routerData.href, '_blank');
		},
		viewContractDetail() {
			let type = this.isCreator ? 'SELL' : 'BUY';
			let routerData = this.$router.resolve({
				path:
					'/center/contract/' + type.toLowerCase() + '/' + this.detailData.contractInfo.contractType.toLowerCase() + '/detail',
				query: {
					id: this.detailData.contractInfo.id,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		},
		downloadPdf(items) {
			let name = items.name;
			API_DOWNLPREVIEWTE(ENV.BASE_NET + items.url).then(res => {
				comDownload(res, undefined, name);
			});
		},
		// 作废
		cancel() {
			this.$refs.cancelModal.show();
		},
		clickCancelOk(cancelReason) {
			API_BondLetterReject({
				bondLetterId: this.$route.query.bondLetterId,
				reason: cancelReason
			}).then(res => {
				if (res.success && res.data) {
					this.$message.success('驳回成功');
					this.$router.go(-1);
				}
			});
		},
		confirm() {
			const modalObj = {
				modalTitle: '确认',
				modalText: '确定要进行追保函确认吗？'
			};
			this.footerVisible = true;
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			API_BondLetterConfirm({
				bondLetterId: this.$route.query.bondLetterId
			}).then(res => {
				if (res.success && res.data) {
					this.getCurrentCompanyRolesInfo();
				}
			});
		},
		jumpConfirmFunc() {
			this.$router.push('/center/bondLetter/online/list?active=online');
		},
		getCurrentCompanyRolesInfo() {
			const signFlag =
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer');
			if (!signFlag) {
				API_GET_COMPANY_ROLE_LIST().then(res => {
					if (res.success) {
						this.roleData = res.data;
						const modalObj = {
							modalTitle: '盖章',
							modalText: '追保函已确认，请联系签章员进行盖章。',
							modalTextNext: ''
						};
						if (this.roleData.signerUserVOList.length) {
							for (var i = 0; i < this.roleData.signerUserVOList.length; i++) {
								const item = this.roleData.signerUserVOList[i];
								modalObj.modalTextNext =
									'<p>' + modalObj.modalTextNext + '签章员：' + item.personalName + '(' + item.mobile + ')</p>';
							}
						}
						this.$refs.jumpConfirmModal.showModal(modalObj);
					}
				});
			} else {
				this.cancelText = '稍后盖章';
				this.okText = '立即盖章';
				const modalObj = {
					modalTitle: '盖章',
					modalText: '追保函已确认，需要盖章，是否现在进行盖章？'
				};
				this.footerVisible = false;
				this.$refs.signConfirmModal.showModal(modalObj);
			}
		},
		signConfirmFunc() {
			this.$router.push({
				path: '/center/bondLetter/online/stamp',
				query: {
					url: this.detailData.bondLetterData.pdfPath,
					serialNo: this.detailData.bondLetterData.serialNo,
					bondLetterId: this.detailData.bondLetterData.id
				}
			});
		},
		signCancelConfirmFunc() {
			this.$message.success('追保函确认成功');
			this.$router.push('/center/bondLetter/online/list?active=online');
		},
		viewFile(data) {
			let url = data.fileUrl || data.url;
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	.grid-wrap {
		margin-top: 20px;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;
		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;
			span,
			.textOverflow {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
				text-align: left;
			}
			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}
			.label {
				width: 120px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}
			span:last-child {
				width: 100%;
				padding-left: 132px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.textOverflow {
				left: 132px;
				padding: 0;
			}
		}
		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}
		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}
		li:last-child {
			border-radius: 0 0 3px 0;
		}
		li.special {
			border-radius: 0 3px 3px 0;
		}
	}
	.copy-icon {
		margin-left: 12px;
		cursor: pointer;
		position: relative;
		top: 1px;
		width: 14px;
		height: 14px;
	}
	.slDetailBottom {
		width: calc(100vw - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 228px;
	}
	.slFormDetail {
		.ant-col {
			height: 82px;
		}
		.ant-form-item {
			width: 364px;
			margin-bottom: 0;
		}
	}
	.files-box {
		margin-bottom: 40px;
	}
	.fileName:hover {
		color: @primary-color;
		cursor: pointer;
	}
}
</style>
