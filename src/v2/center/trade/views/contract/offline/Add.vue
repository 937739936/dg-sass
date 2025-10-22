<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.query.id ? '编辑' : '新增' }}线下{{ typeName }}合同</span>
			</div>
			<div class="divider"></div>
			<div
				class="slTitleAssis"
				style="margin-top: 0px"
			>
				合同信息
			</div>
			<BaseInfo
				ref="baseInfo"
				:isBuyContract="isBuyContract"
				:orderType="$route.query.type"
				@verifyBuyer="verifyBuyer"
				@signStatusChange="signStatusChange"
			></BaseInfo>
			<div v-if="isBuyContract">
				<div
					class="slTitleAssis"
					style="margin-top: 10px"
				>
					运输信息
				</div>
				<TransportInfo
					ref="transportInfo"
					:isBuyContract="isBuyContract"
					:orderType="$route.query.type"
				></TransportInfo>
			</div>
			<div v-if="!isBuyContract">
				<div
					class="slTitleAssis"
					style="margin-top: 10px"
				>
					开票信息
				</div>
				<InvoiceInfo
					ref="invoiceInfo"
					@changeWhetherSame="changeWhetherSame"
					@getBuyerCompanyName="getBuyerCompanyName"
				></InvoiceInfo>
			</div>

			<div
				class="slTitleAssis"
				style="margin-top: 0px"
			>
				签订过程留痕信息
			</div>
			<div>
				<p class="tips">合同签订方式:</p>
				<a-radio-group v-model="signWay">
					<a-radio
						:value="item.value"
						v-for="item in signWayList"
						:key="item.value"
					>
						<span style="color: rgba(0, 0, 0, 0.8)"> {{ item.text }}</span>
					</a-radio>
				</a-radio-group>

				<RemainsInfo
					v-if="signWay == 'EXPRESS_MAIL'"
					ref="remainsInfo"
					:isBuyContract="isBuyContract"
					:orderType="$route.query.type"
				></RemainsInfo>
			</div>
			<div
				class="slTitleAssis"
				:class="{ active: signWay != 'EXPRESS_MAIL' }"
				:style="{}"
			>
				附件信息
			</div>
			<Attachment
				:signWay="signWay"
				:isBuyContract="isBuyContract"
				ref="attachment"
				:whetherSame="whetherSame"
			></Attachment>
			<SuppleAgree
				v-if="suppleAgreeShow"
				:isBuyContract="isBuyContract"
				ref="suppleAgree"
			></SuppleAgree>
		</a-card>

		<!-- <CreatBankAccount ref="creatBankAccount" @change="getBankAccountList" /> -->
		<div class="btn-box">
			<a-button
				type="primary"
				class="btn"
				@click="goBack"
				>取消</a-button
			>
			<a-button
				type="primary "
				@click="buySubmit"
				class="btn btn1"
				>提交</a-button
			>
		</div>

		<a-modal
			class="sub-modal slModal"
			:visible="subVisible"
			:width="408"
			@cancel="subVisible = false"
			title="提交"
		>
			<div class="content-title">提交合同后将由平台进行审批，审批通过后，合同状态将变为执行中，请确认以下信息是否有误</div>

			<div class="content-box">
				<p>
					<span>卖方企业：</span> <span>{{ contractData.sellerName }}</span>
				</p>
				<p>
					<span>数量：</span>
					<span
						>{{ contractData.contractQuantity | formatMoney(3) }}吨<template v-if="contractData.quantityOffset"
							>（±{{ contractData.quantityOffset }}%）</template
						></span
					>
				</p>
				<p>
					<span>基准价格：</span>
					<span
						v-if="contractData.followTheMarket"
						style="color: #dd4444"
						>随行就市</span
					>
					<span
						v-else
						style="color: #dd4444"
					>
						{{ contractData.contractPrice | formatMoney(2) }}吨</span
					>
				</p>
				<p>
					<span>运输方式：</span> <span>{{ transportMode[contractData.terminalContractDelivery.transportMode] }}</span>
				</p>
				<p>
					<span>收货人：</span> <span>{{ contractData.terminalContractDelivery.consigneeCompanyName || '-' }}</span>
				</p>
			</div>

			<template slot="footer">
				<a-button
					key="back"
					@click="subVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<DelModal
			ref="delModal"
			@save="submit"
			title="请确认信息填写无误，是否提交？"
			:tip="tip"
			:tipNext="tipNext"
		></DelModal>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer, delKeep } from '@/v2/utils/factory.js';
import { mapMutations, mapGetters } from 'vuex';

import breadcrumb from '@/v2/components/breadcrumb/index';
import BaseInfo from '@/v2/center/trade/views/contract/components/downContract/BaseInfo.vue';
import TransportInfo from '@/v2/center/trade/views/contract/components/downContract/TransportInfo.vue';
import RemainsInfo from '@/v2/center/trade/views/contract/components/downContract/RemainsInfo.vue';
import Attachment from '@/v2/center/trade/views/contract/components/downContract/Attachment.vue';
import SuppleAgree from '@/v2/center/trade/views/contract/components/downContract/SuppleAgree.vue';
import InvoiceInfo from '@/v2/center/trade/views/contract/components/downContract/InvoiceInfo.vue';

import DelModal from '@/v2/center/trade/views/contract/components/downContract/DelModal.vue';
import {
	saveOrUpdateBuyDownContract,
	getBuyDownContractDetail,
	saveOrUpdateSellDownContract,
	getSellDownContractDetail,
	validEditDataSame
} from '@/v2/center/trade/api/downcontract';
export default {
	name: 'ContractOffLineAdd',
	data() {
		return {
			id: '',
			contractType: this.$route.query.type, //补录合同类型，
			linkOrderNo: this.$route.query.linkOrderNo, //关联合同号
			linkOrderType: this.$route.query.linkOrderType, //关联合同类型，电子合同，传递ONLINE,补录合同传递DOWN
			contractData: {
				terminalContractDelivery: {},
				terminalContractExtensionDto: {
					terminalContractSignLhDto: {
						expressMailInfo: {}
					}
				}
			},
			getPopupContainer,
			signWayList: filterCodeByKey('offlineContractSignWayEnum'), // 签订过程留痕信息-合同签订方式
			// 回款账号
			collectionAccountInfo: [],
			// 签订留痕
			signWay: '',
			suppleAgreeShow: true,
			subVisible: false,
			// 运输信息
			transportMode: {
				AUTOMOBILE_AND_TRAIN: '汽运和火运',
				AUTOMOBILE: '汽运',
				TRAIN: '火运',
				SHIP: '船运',
				NONE: '无'
			},
			btnDisabled: false,
			// 开票信息
			whetherSame: 'SAME',
			tip: '',
			tipNext: ''
		};
	},
	components: {
		breadcrumb,
		BaseInfo,
		TransportInfo,
		RemainsInfo,
		Attachment,
		SuppleAgree,
		InvoiceInfo,
		DelModal
	},
	beforeRouteLeave(to, from, next) {
		//如果是前往关联页面，保留当前页面数据，否则清空keepalive缓存
		if (to.path === '/center/businessline/addAssociation') {
			from.meta.keepAlive = true;
		} else {
			from.meta.keepAlive = false;
			delKeep(this);
		}
		next();
	},

	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('business', {
			collectionCompany: 'collectionCompany',
			zpCompany: 'zpCompany',
			sapCompany: 'sapCompany'
		}),
		//补录合同名称
		typeName() {
			return this.contractType === 'buy' ? '采购' : '销售';
		},
		//关联合同类型名称
		typeReleName() {
			return this.contractType === 'buy' ? '销售' : '采购';
		},
		//关联合同类型
		typeRele() {
			return this.contractType === 'buy' ? 'sell' : 'buy';
		},
		isBuyContract() {
			return this.contractType === 'buy';
		}
	},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		//从补协列表处进入，页面滚动到合同附件模块
		scrollPage() {
			if (this.$route.query.from === 'suppleAgreement') {
				//从补协列表处进入，页面滚动到合同附件模块
				this.$nextTick(() => {
					setTimeout(() => {
						document.getElementById('contractFilesBox').scrollIntoView('smooth');
					});
				});
			}
		},
		changeWhetherSame(val) {
			this.whetherSame = val;
		},
		// 合同信息中买方企业变动时，回调校验函数
		verifyBuyer() {
			if (this.whetherSame === 'DIFFERENT') {
				this.$refs.invoiceInfo.verifyBuyer();
			}
		},
		// 合同签章状态发生变化，判断签章状态，双签可以添加补协
		signStatusChange() {
			this.$nextTick(() => {
				let signStatus = this.$refs.baseInfo?.form.getFieldValue('signStatus');
				if (signStatus === 2) {
					this.suppleAgreeShow = true;
				} else {
					this.suppleAgreeShow = false;
				}
			});
		},
		// 获取合同信息中的买方企业
		getBuyerCompanyName() {
			this.$refs.invoiceInfo.buyerCompanyName = this.$refs.baseInfo.form.getFieldValue('buyerName');
		},
		//加载详情
		async getDetail() {
			let API;
			if (this.contractType == 'sell') {
				API = getSellDownContractDetail; //销售详情
			} else {
				API = getBuyDownContractDetail; //采购详情
			}
			const params = {
				id: this.$route.query.id
			};
			const res = await API(params);

			this.signWay = res.data.terminalContractExtensionDto.signWay;
			// 渲染 基本信息
			this.$nextTick(() => {
				if (res.data.signStatus === 2) {
					// 如果是双签
					this.suppleAgreeShow = true;
				} else {
					this.suppleAgreeShow = false;
				}
				this.$refs.baseInfo.init(res.data);

				this.$refs.transportInfo && this.$refs.transportInfo.init(res.data);

				this.$refs.remainsInfo && this.$refs.remainsInfo.init(res.data);
				this.$nextTick(() => {
					this.$refs.suppleAgree?.init(res.data);
					/** 开票信息 */
					this.whetherSame = res.data.terminalContractExtensionDto.whetherSame;

					this.$refs.invoiceInfo && this.$refs.invoiceInfo.init(res.data);

					this.$refs.attachment.init(res.data);
				});
			});
		},
		goBack() {
			this.$router.go(-1);
		},
		// 表单提交
		async buySubmit() {
			const baseInfo = await this.$refs.baseInfo.save();

			if (!baseInfo) {
				return;
			}
			// 运输费信息
			let terminalContractDelivery = {};
			if (this.$refs.transportInfo) {
				terminalContractDelivery = await this.$refs.transportInfo.save();
				if (!terminalContractDelivery) {
					return;
				}
				for (let key in terminalContractDelivery) {
					if (Array.isArray(terminalContractDelivery[key])) {
						terminalContractDelivery[key] = terminalContractDelivery[key].join(',');
					}
				}
			}

			// 签订留痕 发票信息
			let terminalContractExtensionDto = {
				signWay: this.signWay || null,
				companyInvoiceInfo: {},
				terminalContractSignLhDto: {
					expressMailInfo: {}
				}
			};

			// 销售合同的 发票信息
			if (this.contractType == 'sell') {
				const companyInvoiceInfo = await this.$refs.invoiceInfo.save();
				if (!companyInvoiceInfo) return;
				terminalContractExtensionDto.whetherSame = companyInvoiceInfo.whetherSame;
				terminalContractExtensionDto.companyInvoiceInfo = companyInvoiceInfo;
			}

			// 签订留痕
			if (this.$refs.remainsInfo) {
				const expressMailInfo = await this.$refs.remainsInfo.save();
				if (!expressMailInfo) {
					return;
				}
				expressMailInfo.sendProvince = expressMailInfo.sendA[0];
				expressMailInfo.sendCity = expressMailInfo.sendA[1];
				expressMailInfo.sendArea = expressMailInfo.sendA[2];
				expressMailInfo.receiveProvince = expressMailInfo.receiveA[0];
				expressMailInfo.receiveCity = expressMailInfo.receiveA[1];
				expressMailInfo.receiveArea = expressMailInfo.receiveA[2];
				terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo = expressMailInfo;
			}
			// 获取附件
			const attachmentInfo = this.$refs.attachment.save();

			if (!attachmentInfo) return;
			if (!this.signWay) {
				this.$message.error('请选择合同签订方式');
				return;
			}

			if (this.signWay == 'SCENE_SIGN') {
				terminalContractExtensionDto.terminalContractSignLhDto.fileInfoList = attachmentInfo.fileInfoList;
			}

			let attachmentReq = cloneDeep(attachmentInfo.otherFileInfoList);
			attachmentReq.forEach(item => {
				delete item.id;
			});

			/**开发票的附件 */
			if (this.contractType == 'sell' && this.whetherSame == 'DIFFERENT') {
				terminalContractExtensionDto.companyInvoiceInfo.invoiceFileInfoList = attachmentInfo.invoiceFileInfoList;
			}

			let supplementalInfo = [];
			if (this.suppleAgreeShow) {
				const supFileList = this.$refs.suppleAgree?.save();
				if (!supFileList) {
					return;
				}
				supplementalInfo = supFileList;
			}

			const params = {
				...baseInfo,
				terminalContractDelivery,
				terminalContractExtensionDto,
				attachmentReq,
				supplementalInfo,
				id: this.$route.query.id
			};
			// 业务线类型
			if (this.contractType == 'sell') {
				params.businessLineType = 'DOWN';
			} else {
				params.businessLineType = 'UP';
			}

			this.contractData = params;
			if (this.contractType == 'sell') {
				if (this.$route.query.id) {
					const res = await validEditDataSame(this.contractData);
					if (res.success && res.data) {
						(this.tip = '未修改任何合同数据'), (this.tipNext = '确定提交后，将由平台进行审核');
						this.$refs.delModal.open();
						return;
					}
				}
				(this.tip = '确定提交后，将由平台进行审核'), (this.tipNext = '');
				this.$refs.delModal.open();
			} else {
				this.subVisible = true;
			}
		},
		//提交
		async submit() {
			if (this.btnDisabled) return;
			this.btnDisabled = true;
			try {
				const Fn = this.contractType == 'sell' ? saveOrUpdateSellDownContract : saveOrUpdateBuyDownContract;
				const res = await Fn(this.contractData);

				this.btnDisabled = false;
				this.subVisible = false;
				this.$refs.delModal.close();
				this.$message.success('操作成功');
				// 判断是否是从  新增应收账款菜单进入的合同编辑和新增
				if (this.$route.query.source == 'receivable') {
					this.$router.push({
						path: '/center/assets/receivable/manual/edit?activeIndex=0',
						query: {
							paperContractNo: res.data.paperContractNo,
							contractNo: res.data.contractNo,
							contractId: res.data.id,
							id: this.$route.query.manuaId || '',
							poolReuse: this.$route.query.poolReuse
						}
					});
				} else if (this.$route.query.source == 'business') {
					this.$router.push('/center/businessline/list');
				} else {
					this.$router.go(-1);
				}
			} catch (error) {
				this.btnDisabled = false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
/deep/ .ant-radio-inner::after {
	background: #fff;
}
/deep/ .ant-radio-checked .ant-radio-inner {
	background:  @primary-color;
}
</style>
<style lang="less" scoped>
.warning-tips {
	color: #fc8002;
	padding: 0 30px 20px 30px;
	p {
		margin: 15px 0px;
	}
	ul {
		li {
			line-height: 28px;
			padding: 0 15px;
			list-style: inside;
		}
	}
}
.slTitleAssis.active {
	margin-top: 20px;
}
.card {
	padding: 10px;
	margin-right: 5px;
	box-shadow: 2px 2px 20px #f5f5f5;
	position: inherit;
	.title {
		font-size: 16px;
	}
}
.marginBottom0 {
	margin-bottom: 0;
	min-height: 64px;
}
.slMain {
	position: relative;
	min-height: calc(100vh - 64px);
	background: #fff;
}
.mb0 {
	margin-bottom: 0;
}
.loading-wrap {
	width: 100%;
	// height: 694px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	padding-top: 200px;
	top: 0;
	left: 0;
}
.divider {
	width: 100%;
	height: 1px;
	background-color: #e9effc;
	margin-bottom: 30px;
	margin-top: 20px;
}
// .content {
//   height: 694px;
// }
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
.tips {
	color: rgba(0, 0, 0, 0.4);
	margin-top: 20px;
	margin-bottom: 14px;
}
.btn-box {
	display: flex;
	margin-top: 30px;
	margin-bottom: 40px;
	align-items: center;
	justify-content: center;
	.btn {
		width: 114px;
		color:  @primary-color;
		border: 1px solid  @primary-color;
		background: #fff;
	}
	.btn1 {
		margin-left: 20px;
		background:  @primary-color;
		color: #fff;
	}
}
.sub-modal {
	/deep/ .ant-modal-body {
		padding-top: 14px;
		padding: 20px;
		padding-top: 14px;
	}
	/deep/ .ant-modal-title {
		font-weight: 600;
		font-size: 18px;
		color: rgba(0, 0, 0, 0.8);
		line-height: 26px;
	}
	/deep/ .ant-modal-header {
		padding-left: 20px;
	}
}
.content-title {
	font-size: 14px;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.4);
	margin-bottom: 14px;
}
.content-box {
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	padding: 0 10px;

	color: rgba(0, 0, 0, 0.4);
	p {
		height: 32px;
		line-height: 32px;

		span:first-child {
			width: 70px;
			display: inline-block;
			text-align: right;
			margin-left: 10px;
		}
		span:last-child {
			color: rgba(0, 0, 0, 0.8);
		}
	}
	p:nth-child(2n) {
		background: #f3f5f6;
	}
}
</style>
