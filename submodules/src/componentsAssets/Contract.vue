<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20">
				合同信息
				<a-button
					type="primary"
					ghost
					@click="goEditContract"
					v-if="editFlag && isShowBtn"
				>
					编辑下游合同信息/附件
				</a-button>
				<div
					v-if="type === 'admin' && Object.keys(countCompany).length"
					class="warning"
				>
					<a-space>
						主体预警
						<div
							:class="{ 'warning-item': true, 'warning-item-disabled': !countCompany[item.companyCreditCode] }"
							v-for="(item, index) in warningList"
							:key="index"
							@click="messageNotice(item)"
						>
							{{ item.abbreviation || item.name }}(
							<span class="warning-risk">{{ countCompany[item.companyCreditCode] || 0 }}</span>
							)
						</div>
					</a-space>
				</div>
			</a-space>
		</div>
		<ErrorPanel
			v-if="audit"
			:assetValidateList="assetValidateList"
		></ErrorPanel>
		<div class="content mb50">
			<a-descriptions
				layout="vertical"
				bordered
			>
				<a-descriptions-item label=" "> 合同编号 </a-descriptions-item>
				<a-descriptions-item>
					<div
						slot="label"
						class="descriptionsTitleHeader"
					>
						<a-tag color="var(--primary-color)"> 上游 </a-tag>
						<div
							class="descriptionsTitle"
							v-if="contractInfoUpContract.buyerName"
						>
							<a-tooltip>
								<template slot="title"> {{ contractInfoUpContract.sellerName }}</template>
								<div
									class="ellipsis"
									:style="{ 'max-width': descriptionsTitleWidth }"
								>
									{{ contractInfoUpContract.sellerName }}
								</div>
							</a-tooltip>
							<div class="segmentation"></div>
							<a-tooltip>
								<template slot="title"> {{ contractInfoUpContract.buyerName }}</template>
								<div
									class="ellipsis"
									:style="{ 'max-width': descriptionsTitleWidth }"
								>
									{{ contractInfoUpContract.buyerName }}
								</div>
							</a-tooltip>
						</div>
					</div>
					<template>
						<span v-nullValue="contractInfoUpContract.contractNo">{{ contractInfoUpContract.contractNo }}</span>
						<span
							v-if="!contractInfoUpContract.contractTermType === 'LONG_TERM_CONTRACT'"
							class="LONG_TERM_CONTRACT"
							>长协
						</span>
					</template>
				</a-descriptions-item>
				<a-descriptions-item>
					<div
						slot="label"
						class="descriptionsTitleHeader"
					>
						<a-row type="flex">
							<a-col flex="auto">
								<a-tag color="var(--primary-color)"> 下游 </a-tag>
								<div
									class="descriptionsTitle"
									v-if="downContract('buyerName')"
								>
									<a-tooltip>
										<template slot="title"> {{ downContract('sellerName') || '' }}</template>
										<div
											class="ellipsis"
											:style="{ 'max-width': descriptionsTitleWidth2 }"
										>
											{{ downContract('sellerName') || '' }}
										</div>
									</a-tooltip>
									<div class="segmentation"></div>
									<a-tooltip>
										<template slot="title"> {{ downContract('buyerName') || '' }}</template>
										<div
											class="ellipsis"
											:style="{ 'max-width': descriptionsTitleWidth2 }"
										>
											{{ downContract('buyerName') || '' }}
										</div>
									</a-tooltip>
								</div></a-col
							>
							<a-col
								flex="80px"
								v-if="adminBuyer"
							>
								<a-button
									type="primary"
									ghost
									@click="contractAuditDownSample"
									size="small"
								>
									历史合同
								</a-button>
							</a-col>
						</a-row>
					</div>
					<template>
						<span v-nullValue="downContract('contractNo')">{{ downContract('contractNo') }}</span>
						<span
							v-if="downContract('contractTermType') === 'LONG_TERM_CONTRACT'"
							class="LONG_TERM_CONTRACT"
							>长协
						</span>
					</template>
				</a-descriptions-item>
				<a-descriptions-item> 标的货物名称 </a-descriptions-item>
				<a-descriptions-item
					><span v-nullValue="contractInfoUpContractGoodsVO.goodName">
						{{ contractInfoUpContractGoodsVO.goodName }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('goodName', 'goodsName')">
						{{ downContract('goodName', 'goodsName') }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 单价(元/吨) </a-descriptions-item>
				<a-descriptions-item>
					<span
						v-nullValue="contractInfoUpContractGoodsVO.basePrice"
						v-mainTip="convertCurrency(contractInfoUpContractGoodsVO.basePrice)"
					>
						<span class="money">¥{{ formatMoney(contractInfoUpContractGoodsVO.basePrice, 4) }}</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span
						v-nullValue="downContract('basePrice', 'contractPrice')"
						v-mainTip="convertCurrency(downContract('basePrice', 'contractPrice'))"
					>
						<span class="money">¥{{ formatMoney(downContract('basePrice', 'contractPrice'), 4) }}</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 数量(吨) </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContractGoodsVO.quantity">
						{{ formatMoney(contractInfoUpContractGoodsVO.quantity) }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('quantity', 'contractQuantity')">
						{{ formatMoney(downContract('quantity', 'contractQuantity')) }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 合同金额(元) </a-descriptions-item>
				<a-descriptions-item>
					<span
						v-nullValue="contractInfoUpContract.amount"
						v-mainTip="convertCurrency(contractInfoUpContract.amount)"
					>
						<span class="money">¥{{ formatMoney(contractInfoUpContract.amount) }}</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span
						v-nullValue="downContract('amount', 'contractAmount')"
						v-mainTip="convertCurrency(downContract('amount', 'contractAmount'))"
					>
						<span class="money">¥{{ formatMoney(downContract('amount', 'contractAmount')) }}</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 签订日期 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContract.signDate">
						{{ contractInfoUpContract.signDate }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('signDate', 'contractSignTime')">
						{{ downContract('signDate', 'contractSignTime') }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 合同执行期 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContract.execDateStart || contractInfoUpContract.execDateEnd">
						{{ contractInfoUpContract.execDateStart }}——{{ contractInfoUpContract.execDateEnd }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('execDateStart') || downContract('execDateEnd')">
						{{ downContract('execDateStart') }}——{{ downContract('execDateEnd') }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 签订状态 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContract.signStatus">
						<span
							class="singleSign"
							v-if="contractInfoUpContract.signStatus == '1'"
						>
							单签
						</span>
						<span
							class="doubleSign"
							v-else-if="contractInfoUpContract.signStatus == '2'"
						>
							双签
						</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('signStatus', 'status')">
						<span
							class="singleSign"
							v-if="downContract('signStatus', 'status') == '1'"
						>
							单签
						</span>
						<span
							class="doubleSign"
							v-else-if="downContract('signStatus', 'status') == '2'"
						>
							双签
						</span>
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 双签版合同获得日期 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContract.doubelSignRecvDate || contractInfoUpContract.doubleSignRecvDate">
						{{ contractInfoUpContract.doubelSignRecvDate || contractInfoUpContract.doubleSignRecvDate }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span
						v-nullValue="
							downContract('doubelSignRecvDate', 'doubleSignTime') || downContract('doubleSignRecvDate', 'doubleSignTime')
						"
					>
						{{ downContract('doubelSignRecvDate', 'doubleSignTime') || downContract('doubleSignRecvDate', 'doubleSignTime') }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 合同回款账户 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="contractInfoUpContract.receivableAccountInfo">
						{{ contractInfoUpContract.receivableAccountInfo }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="downContract('receivableAccountInfo', 'receivableAccountInfo')">
						{{ downContract('receivableAccountInfo', 'receivableAccountInfo') }}
					</span>
				</a-descriptions-item>
				<a-descriptions-item> 业务实际负责人 </a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="businessDirectorPair.up"> {{ businessDirectorPair.up }} </span>
				</a-descriptions-item>
				<a-descriptions-item>
					<span v-nullValue="businessDirectorPair.down"> {{ businessDirectorPair.down }} </span>
				</a-descriptions-item>
			</a-descriptions>
		</div>
		<!-- 附件查看和编辑展示不一样，不知道咋想的 -->
		<div class="title">上游合同附件</div>
		<div class="mb50">
			<FileList
				v-if="editFlag"
				:list="contractInfoUpContract.list || []"
				disabled
			/>
			<ContractUpFile
				:showContract="showContract"
				:contract="contractInfoUpContract"
				:locked="audit"
				v-else
			/>
		</div>
		<div class="title">下游合同附件</div>
		<div class="mb50">
			<FileList
				:list="downContractList"
				:locked="audit"
				:disabled="editFlag"
			/>
		</div>
		<template v-if="contractInfoDownContract.supplementalInfo && contractInfoDownContract.supplementalInfo.length">
			<div class="title">下游补充协议</div>
			<div class="mb50">
				<SuppleAgree
					:locked="audit"
					:editFlag="editFlag"
					:downContract="contractInfoDownContract"
					ref="suppleAgree"
				/>
			</div>
		</template>
		<Message ref="message" />
	</div>
</template>
<script>
import moment from 'moment';
import { convertCurrency } from '@sub/utils/factory';
import { formatMoney } from '@sub/filters';
import SuppleAgree from './components/SuppleAgree.vue';
import ContractUpFile from './components/ContractUpFile.vue';
import FileList from './components/FileList.vue';
import ErrorPanel from './components/ErrorPanel.vue';
import Message from './components/Message.vue';

export default {
	name: 'Contract',
	inject: {
		countCompanyRiskParent: { form: 'countCompanyRiskParent', default: null }
	},
	data() {
		return {
			moment,
			formatMoney,
			convertCurrency,
			assetValidateList: [], // 校验错误信息
			editDownContractList: [],
			supplementalInfo: [], // 下游补充协议附件
			countCompany: {}
		};
	},
	props: {
		editFlag: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		// 审核，展示系统校验错误
		audit: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		// 资方不能查看合同
		showContract: {
			type: Boolean,
			default: () => {
				return true;
			}
		},
		contractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {
		SuppleAgree,
		ContractUpFile,
		FileList,
		ErrorPanel,
		Message
	},

	watch: {
		contractInfo: {
			deep: true,
			immediate: true,
			handler(data) {
				if (data.assetValidateList) {
					this.assetValidateList = data.assetValidateList || [];
				}
				if (data.paymentValidates) {
					this.assetValidateList = data.paymentValidates || [];
				}
			}
		},
		// 主体预警企业变化
		warningList: {
			deep: true,
			immediate: true,
			handler(data) {
				// 查询预警数量
				this.countCompanyRisk(data);
			}
		}
	},
	computed: {
		// 是否可以查看历史合同
		adminBuyer() {
			return this.type === 'admin' && this.downContract('buyerUscc', 'buyerBizNo');
		},
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		// 获取流程企业
		warningList() {
			if (!this.countCompanyRiskParent) {
				return [];
			}
			let list = [];
			list.push({
				abbreviation: this.contractInfoUpContract.sellerAbbreviation,
				name: this.contractInfoUpContract.sellerName,
				companyCreditCode: this.contractInfoUpContract.sellerUscc
			});
			list.push({
				abbreviation: this.contractInfoUpContract.buyerAbbreviation,
				name: this.contractInfoUpContract.buyerName,
				companyCreditCode: this.contractInfoUpContract.buyerUscc
			});
			list.push({
				abbreviation: this.downContract('buyerAbbreviation'),
				name: this.downContract('buyerName'),
				companyCreditCode: this.downContract('buyerUscc', 'buyerBizNo')
			});
			return list;
		},
		descriptionsTitleWidth() {
			let viewWidth = window.innerWidth || document.documentElement.clientWidth;
			let width = (viewWidth - 1100) / 4;
			return width + 'px';
		},
		descriptionsTitleWidth2() {
			let viewWidth = window.innerWidth || document.documentElement.clientWidth;
			let width = (viewWidth - 1100) / 4;
			if (this.adminBuyer) {
				width -= 40;
			}
			return width + 'px';
		},
		// 上游合同信息
		contractInfoUpContract() {
			return this.contractInfo?.upContract || {};
		},
		// 上游合同货物信息
		contractInfoUpContractGoodsVO() {
			let goodsVOList = this.contractInfoUpContract?.goodsVOList || [];
			return goodsVOList[0] || {};
		},
		// 上游合同附件
		contractInfoUpFileListList() {
			let list = [];
			return list;
		},
		// 下游合同信息
		contractInfoDownOnlineContract() {
			return this.contractInfo?.downOnlineContract || this.contractInfo?.downContract || {};
		},
		contractInfoDownContract() {
			return this.contractInfo?.downContract || {};
		},
		// 下游合同获取信息,货物信息
		contractInfoDownContractGoodsVO() {
			let goodsVOList = this.contractInfoDownOnlineContract?.goodsVOList || this.contractInfoDownContract?.goodsVOList || [];
			return goodsVOList[0] || {};
		},
		// 判断贸易合同附件
		tradeContractFist() {
			return this.contractInfo?.tradeContract?.list || [];
		},
		// 下游合同附件
		downContractList() {
			let list = this.contractInfoDownContract.list || this.contractInfoDownOnlineContract.list || [];
			// 如果是admin端。下游合同过滤补充协议
			if (this.type === 'admin') {
				list = list.filter(item => item.type !== 'BCXY');
			}
			if (this.tradeContractFist.length) {
				list = list.concat(this.tradeContractFist);
			}
			return list;
		},
		// 业务负责人信息
		businessDirectorPair() {
			let businessDirectorPair = {
				up: this.contractInfoUpContract.upDirector || '',
				down: this.contractInfoUpContract.downDirector || ''
			};
			if (this.contractInfoUpContract.businessDirectorPair) {
				businessDirectorPair = this.contractInfoUpContract.businessDirectorPair;
			}
			return businessDirectorPair;
		},
		isShowBtn() {
			let { contractId } = this.contractInfoDownContract;
			return Boolean(contractId);
		}
	},
	mounted() {},
	methods: {
		// 查看下游历史合同
		contractAuditDownSample() {
			let uscc = this.downContract('buyerUscc', 'buyerBizNo');
			window.open(`/contract/downSample?type=contrast&uscc=${uscc}`);
		},
		// 预警消息查询
		async messageNotice(Obj) {
			let code = Obj.companyCreditCode;
			// 如果有数量打开弹框
			if (this.countCompany[code]) {
				this.$refs.message.init(Obj);
			}
		},
		// 查询预警数量
		async countCompanyRisk(data) {
			if (!data.length) {
				return;
			}
			let list = data.filter(item => item.companyCreditCode);
			let companyCreditCode = list.map(item => item.companyCreditCode).join(',');
			// 查询预警数量
			if (!companyCreditCode) {
				return;
			}
			let countCompany = await this.countCompanyRiskParent(companyCreditCode);
			let obj = {};
			countCompany.map(item => {
				obj[item.companyCreditCode] = item.riskCount || 0;
			});
			this.countCompany = obj;
		},
		// 下游合同信息摘取
		downContract(onlineKey, key = '') {
			let value;
			if (!key) {
				key = onlineKey;
			}
			if (this.contractInfoDownOnlineContract.hasOwnProperty(onlineKey)) {
				value = this.contractInfoDownOnlineContract[onlineKey];
			} else if (this.contractInfoDownContract.hasOwnProperty(key)) {
				value = this.contractInfoDownContract[key];
			}
			// 如果是货物，判断contractInfoDownContractGoodsVO中是否存在
			if (['goodName', 'basePrice', 'quantity'].includes(onlineKey)) {
				value = this.contractInfoDownContractGoodsVO[onlineKey] || value;
			}
			return value;
		},
		// 去往合同编辑或者新增
		goEditContract() {
			let { contractId } = this.contractInfoDownContract;
			// 编辑
			let path = `/center/contract/sell/offline/add`;
			let query = {
				id: contractId,
				type: 'sell',
				manuaId: this.$route.query.id
			};
			this.$router.push({ path, query });

			// window.open(routeData.href, '_blank')
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;
	background: none;
	margin: 0;
	min-width: 100%;

	::v-deep {
		.title {
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 500;
			line-height: 32px;
			color: rgba(0, 0, 0, 0.8);
			margin-bottom: 15px;
			div {
				font-family: PingFang SC;
			}
			.ant-btn {
				padding: 0 10px;
			}
			.warning {
				font-weight: 400;
				font-size: 14px;
				padding: 0 10px;
				border: 1px solid #f25f56;
				border-radius: 4px;
				.warning-item {
					color: #4682f3;
					cursor: pointer;
					.warning-risk {
						color: #f46332;
					}
					&.warning-item-disabled {
						color: rgba(0, 0, 0, 0.4);
						cursor: default;
						.warning-risk {
							color: rgba(0, 0, 0, 0.4);
						}
					}
				}
			}
		}
		.mb50 {
			margin-bottom: 50px;
		}
		.content {
			.ant-descriptions {
				padding: 0;
				.ant-descriptions-row:has(th:empty) {
					display: none;
				}
				.ant-descriptions-bordered .ant-descriptions-item-content {
					border-color: #e5e6eb;
				}
				.ant-descriptions-row {
					.ant-descriptions-item-label {
						font-family: PingFang SC;
						font-size: 14px;
						font-weight: 500;
						line-height: 20px;
						text-align: left;
						color: rgba(0, 0, 0, 0.8);
						padding: 15px 0px;
						background: #f3f5f6;
						border-width: 0;
						.descriptionsTitleHeader {
							white-space: nowrap;
							min-width: max-content;
							.ant-tag {
								line-height: 16px;
							}
						}
						.descriptionsTitle {
							display: inline-flex;
							position: relative;
							margin: 0 32px;
							.ellipsis {
								min-width: 60px;
							}
							.segmentation {
								width: 52px;
								height: 1px;
								background: rgba(0, 0, 0, 0.8);
								margin: 9px 14px;
								display: inline-block;
							}
							&::before {
								position: absolute;
								top: 0;
								bottom: 0;
								margin: auto;
								left: -20px;
								width: 16px;
								height: 16px;
								border-radius: 4px;
								font-family: PingFang SC;
								font-size: 12px;
								font-weight: 500;
								line-height: 16px;
								text-align: center;
								color: @primary-color;
								background: rgba(70, 130, 243, 0.1);
								border-radius: 4px;
								display: inline-block;
								content: '卖';
							}
							&::after {
								position: absolute;
								top: 0;
								bottom: 0;
								margin: auto;
								right: -20px;
								width: 16px;
								height: 16px;
								border-radius: 4px;
								font-family: PingFang SC;
								font-size: 12px;
								font-weight: 500;
								line-height: 16px;
								text-align: center;
								color: @primary-color;
								background: rgba(70, 130, 243, 0.1);
								border-radius: 4px;
								display: inline-block;
								content: '买';
							}
						}
					}
					.LONG_TERM_CONTRACT {
						background: #ffead7;
						font-family: PingFang SC;
						font-size: 12px;
						font-weight: 400;
						line-height: 20px;
						color: #ec7b13;
						padding: 0 6px;
						border-radius: 4px;
						margin-left: 4px;
						position: unset;
					}
					.ant-descriptions-item-content {
						font-family: PingFang SC;
						font-size: 14px;
						font-weight: 400;
						line-height: 19.6px;
						color: rgba(0, 0, 0, 0.8);
						padding: 20px;
						&:first-child {
							color: #77889d;
							min-width: 170px;
						}
						.money {
							color: #f46332;
						}
						.doubleSign {
							display: inline-block;
							font-family: PingFang SC;
							font-size: 14px;
							font-weight: 400;
							line-height: 14px;
							color: #43c0a2;
							background: #f1fcfa;
							border-radius: 4px;
							padding: 5px 10px;
						}
						.singleSign {
							display: inline-block;
							font-family: PingFang SC;
							font-size: 14px;
							font-weight: 400;
							line-height: 14px;
							color: #4682f3;
							background: rgba(70, 130, 243, 0.1);
							border-radius: 4px;
							padding: 5px 10px;
						}
					}
				}
			}
		}
	}
}
</style>
