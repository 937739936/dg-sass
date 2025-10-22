<template>
	<div class="tabs-content">
		<!-- 所属业务线 -->
		<div v-if="showStopContent">
			<div class="slTitleAssis">合同终止信息</div>
			<ContractStop
				ref="contractStop"
				:data="data"
			/>
		</div>
		<div class="slTitleAssis">
			<span>所属业务线</span>
			<a-button v-if="data.businessLine && data.businessLine.length &&  data.contract.status == 'EXECUTING'" type="primary"	ghost class="slBtn" style="margin-left:20px" @click="realteContract">关联{{ type === 'BUY' ? '销售' : '采购' }}合同</a-button>
		</div>
		<div class="table-box">
			<a-table
				v-if="data.businessLine && data.businessLine.length"
				:columns="businessLineColumns"
				class="new-table business-line-table"
				:bordered="false"
				rowKey="id"
				:dataSource="data.businessLine"
				:pagination="false"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a @click="viewBusinessLineDetail(items)">业务线详情</a>
				</template>
			</a-table>
			<div
				v-else
				class="business-line-empty-box"
			>
				<div class="business-line-empty-content">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<img
								src="@/v2/assets/imgs/contract/no_businessline_bg.png"
								alt=""
								style="width: 66px"
							/>
						</a-col>
						<a-col :class="actionBtnDisabled || data.contract.paperContractNo || data.contract.relateOrderNo ? 'flexStyle' : ''">
							<template v-if="!data.contract.paperContractNo && !data.contract.relateOrderNo">
								<p class="label">当前合同尚未关联{{ type === 'BUY' ? '销售' : '采购' }}合同，未形成业务线</p>
								<a-button
									type="primary"
									class="slBtn"
									@click="realteContract"
									v-if="!actionBtnDisabled"
									>去关联</a-button
								>
							</template>
							<p
								class="label"
								v-else
							>
								当前合同已关联{{ type === 'BUY' ? '销售' : '采购' }}合同，未形成业务线
							</p>
						</a-col>
					</a-row>
				</div>
			</div>
		</div>
		<!-- 合同信息 -->
		<div class="slTitleAssis">合同信息</div>
		<div class="slTitleThird">质数量等信息</div>
		<ul class="grid-wrap transportBox">
			<li>
				<span class="label">基准价格</span>
				<TextOverFlow
					v-if="data && data.contract && data.contract.basePrice"
					:content="data.contract.basePrice + '元/吨'"
					:maxWidth="maxWidth"
				/>
				<TextOverFlow
					v-else-if="data && data.contract && data.contract.basePriceDesc"
					:content="data.contract.basePriceDesc"
					:maxWidth="maxWidth"
				/>
				<span v-else>-</span>
			</li>
			<li>
				<span class="label">数量</span>
				<span
					>{{ data.contract.quantity | formatMoney(3) }}吨<template v-if="data.contract.quantityOffset"
						>（±{{ data.contract.quantityOffset }}%）</template
					></span
				>
			</li>
			<li>
				<span class="label">保证金/违约金</span>
				<span>{{ !data.contract.depositAmount ? 0 : data.contract.depositAmount | formatMoney(2) }}元</span>
			</li>
			<li>
				<span class="label">结算类型</span>
				<span>{{ getComputedTextByValue.settleMode }}</span>
			</li>
			<li>
				<span class="label">交货期限</span>
				<span>{{ data.contractDelivery.deliveryStartDate }}至{{ data.contractDelivery.deliveryEndDate }}</span>
			</li>
			<li>
				<span class="label">合同签订日期</span>
				<span>{{ data.contract.signTime }}</span>
			</li>
		</ul>
		<div class="slTitleThird">运输信息</div>
		<ul class="grid-wrap transportBox">
			<template v-for="(item, key) in transportationInfo">
				<li :key="key">
					<span class="label">{{ item }}</span>
					<TextOverFlow
						:content="getComputedTextByValue[key] || data.contractDelivery[key]"
						:maxWidth="maxWidth"
					/>
				</li>
			</template>
			<template v-if="Object.getOwnPropertyNames(transportationInfo).length % 3 === 2">
				<li>
					<span class="label"></span>
					<span></span>
				</li>
			</template>
			<template v-if="Object.getOwnPropertyNames(transportationInfo).length % 3 === 1">
				<li>
					<span class="label"></span>
					<span></span>
				</li>
				<li>
					<span class="label"></span>
					<span></span>
				</li>
			</template>
		</ul>
		<div
			class="slTitleThird"
			v-if="productIndicatorObjList.length && productIndicatorObjList[0].productIndicator.length"
		>
			基准质量指标
		</div>
		<div
			v-if="productIndicatorObjList.length && productIndicatorObjList[0].productIndicator.length"
			class="productIndicatorBody"
		>
			<div
				v-for="(pro, index2) in productIndicatorObjList"
				:key="index2"
			>
				<div
					v-if="data && data.contract && data.contract.multiGoodsNameFlag"
					class="productIndicatorBox"
				>
					<a-row>
						<a-col
							span="4"
							class="label"
							>品名{{ index2 + 1 }}</a-col
						>
						<a-col
							span="4"
							class="label heavyColor"
							>{{ pro.goodsName }}</a-col
						>
						<a-col
							span="4"
							class="label"
							>基准价格(含税)</a-col
						>
						<a-col
							span="4"
							class="label heavyColor"
							>{{ pro.basePrice }}</a-col
						>
						<a-col
							span="4"
							class="label"
							>基准价格(不含税)</a-col
						>
						<a-col
							span="4"
							class="label heavyColor"
							>{{ pro.excludeTaxBasePrice }}</a-col
						>
					</a-row>
					<a-row
						class="flexRow"
						v-if="pro.productIndicator && pro.productIndicator.length"
					>
						<a-col
							span="4"
							class="left"
							:style="'height:' + 96 * Math.ceil(pro.productIndicator.length / 5) + 'px'"
						>
							<span>基准质量指标</span>
						</a-col>
						<a-col
							span="20"
							class="right"
						>
							<ul>
								<li
									v-for="(item, index) in pro.productIndicator"
									:key="index + '1'"
								>
									<span class="label">{{ item.indicatorName }}</span>
									<span>{{ item.setValue }}</span>
								</li>
								<template v-if="pro.productIndicator.length % 5">
									<li
										v-for="(project, indent) in 5 - (pro.productIndicator.length % 5)"
										:key="indent + '2'"
									>
										<span class="label"></span>
										<span></span>
									</li>
								</template>
							</ul>
						</a-col>
					</a-row>
				</div>
				<ul
					v-else
					class="grid-wrap"
				>
					<li
						v-for="(item, index) in pro.productIndicator"
						:key="index"
						:class="pro.productIndicator.length < 4 && index === pro.productIndicator.length - 1 ? 'special' : ''"
					>
						<span class="label">
							<TextOverFlow
								:content="item.indicatorName"
								:maxWidth="136"
							/>
						</span>
						<span>{{ item.setValue }}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="slTitleThird">银行账户信息</div>
		<div class="bank-account-box">
			<a-row type="flex">
				<a-col class="bank-account-item first">
					<p class="bank-account-title">
						<img
							src="@/v2/assets/imgs/contract/buyer_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">买方银行账户</span>
					</p>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账户名：</span>
						</a-col>
						<a-col flex="1">
							<TextOverFlow
								v-if="data.contract.buyBankAccountName"
								:content="data.contract.buyBankAccountName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账号：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.buyBankNo"
								:content="formateBankNo(data.contract.buyBankNo)"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户行：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.buySubbranchName"
								:content="data.contract.buySubbranchName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户城市：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.buyBankProvince || data.contract.buyBankCity"
								:content="data.contract.buyBankProvince + data.contract.buyBankCity"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
				</a-col>
				<a-col class="bank-account-item second">
					<p class="bank-account-title">
						<img
							src="@/v2/assets/imgs/contract/seller_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">卖方银行账户</span>
					</p>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账户名：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.sellerBankAccountName"
								:content="data.contract.sellerBankAccountName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账号：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.sellerBankNo"
								:content="formateBankNo(data.contract.sellerBankNo)"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户行：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.sellerSubbranchName"
								:content="data.contract.sellerSubbranchName"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">开户城市：</span>
						</a-col>
						<a-col flex="auto">
							<TextOverFlow
								v-if="data.contract.sellerBankProvince || data.contract.sellerBankCity"
								:content="data.contract.sellerBankProvince + data.contract.sellerBankCity"
								:maxWidth="240"
							/>
							<span v-else>-</span>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
		</div>

		<!-- 合同附件 -->
		<div class="slTitleAssis">
			合同附件
			<a-button
				type="primary"
				ghost
				class="slBtn"
				style="margin-left: 30px"
				@click="downFile"
				>一键下载</a-button
			>
		</div>
		<div class="table-box">
			<a-table
				:columns="filesColumns"
				class="new-table"
				:bordered="false"
				rowKey="no"
				:dataSource="data.contractDetailFileRespList"
				:pagination="false"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							href="javascript:;"
							@click="viewContractDetail(items)"
							v-if="items.fileUrl"
							>查看</a
						>
						<a
							href="javascript:;"
							@click="downloadPdf(items)"
							v-if="items.fileUrl"
							>下载</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { API_getTempleteByCode } from '@/v2/api/diy';
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo', width: '18%' },
	{ title: '业务线名称', dataIndex: 'businessLineName', width: '30%' },
	{ title: '采购合同编号', dataIndex: 'parentContractNo', width: '22%' },
	{ title: '销售合同编号', dataIndex: 'contractNo', width: '20%' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const filesColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeText', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileName', width: '25%' },
	{ title: '文件编号', dataIndex: 'no', width: '25%' },
	{ title: '签订日期', dataIndex: 'signTime', width: '19%' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '16%', align: 'center' }
];
import { API_GETCURRENTENV, API_downloadAllContractAttachment } from '@/v2/center/trade/api/contract';
import { API_DOWNLPREVIEWTE } from '@/v2/center/assets/api/index.js';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import ENV from '@/v2/config/env';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import ContractStop from './ContractStop';
import { formateBankNo } from '@/v2/utils/factory.js';

export default {
	data() {
		return {
			formateBankNo,
			businessLineColumns,
			filesColumns,
			templeteData: {},
			optionsList: [],
			productIndicator: [],
			BASE_NET: ENV.BASE_NET,
			maxWidth: 0 // 信息文案最大宽度
		};
	},
	watch: {
		data: function () {
			this.init();
		},
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	components: {
		TextOverFlow,
		ContractStop
	},
	props: ['data', 'type', 'clientWidth', 'actionBtnDisabled', 'showStopContent'],
	computed: {
		...mapGetters('contract', {
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA'
		}),
		transportationInfo() {
			const result = {};
			const list = this.VUEX_GET_FORM_SCHEMA?.formList?.transportation.filter(item => item.style.display != 'none');
			list?.forEach(item => {
				result[item.label] = item.title;
			});
			// 过滤掉没有数值的key
			for (let key in result) {
				if (!(this.getComputedTextByValue[key] || this.data.contractDelivery[key])) {
					delete result[key];
				}
			}
			return result;
		},
		productIndicatorObjList() {
			this.productIndicator.forEach(pro => {
				let result = [];
				result = pro.productIndicator.filter(
					item =>
						item.setValue &&
						item.setValue != '-' &&
						item.setValue != '≥' &&
						item.setValue != '≤' &&
						item.setValue != '>' &&
						item.setValue != '<' &&
						item.setValue != '='
				);
				pro.productIndicator = result;
			});
			return this.productIndicator;
		},
		getComputedTextByValue() {
			if (this.optionsList.length) {
				return {
					settleMode: this.optionsList.filter(item => item.value == this.data.contract.settleMode)[0]?.label,
					transportMode: this.optionsList.filter(item => item.value == this.data.contractDelivery.transportMode)[0]?.label,
					deliveryMode: this.optionsList.filter(item => item.value == this.data.contractDelivery.deliveryMode)[0]?.label,
					freightPayMode: this.optionsList.filter(item => item.value == this.data.contractDelivery.freightPayMode)[0]?.label
				};
			}
			return {};
		}
	},
	mounted() {},
	methods: {
		API_GETCURRENTENV,
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract',
			VUEX_SET_FORM_SCHEMA_INIT: 'contract/VUEX_SET_FORM_SCHEMA_INIT',
			VUEX_UPDATE_FORM_SCHEMA: 'contract/VUEX_UPDATE_FORM_SCHEMA'
		}),
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1600) {
				this.maxWidth = 215;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 280;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 365;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 440;
			} else {
				this.maxWidth = 720;
			}
		},
		// 根据code获取对应的text
		init() {
			this.getTempleteData();
			this.getTempleteList();
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		getTempleteList() {
			const orderIndicators = this.data.orderIndicators;
			if (!orderIndicators) return;
			orderIndicators.forEach(pro => {
				const productIndicatorList = pro.productIndicatorList || [];
				let obj = Object.assign(pro);
				let productIndicator = null;
				productIndicatorList.forEach(item => {
					const v1 = item.value1;
					const v2 = item.value2;
					if (item.inputType == 'RANGE') {
						if (this.isNull(v1) || this.isNull(v2)) {
							item.setValue = v1 || v2;
						} else {
							const max = Math.max(v1, v2);
							const min = Math.min(v1, v2);
							if (min === max) {
								item.setValue = min;
							} else {
								item.setValue = min + '-' + max;
							}
						}
					} else {
						item.setValue = (item.symbol == '无符号' ? '' : item.symbol) + v1;
					}
				});
				productIndicator = productIndicatorList?.sort((a, b) => a.sortOrder - b.sortOrder);
				obj.productIndicator = productIndicator;
				this.productIndicator.push(obj);
			});
		},
		// 根据煤炭种类获取对应的配置文件
		getTempleteData() {
			API_getTempleteByCode({
				templateCode: this.data.contract.contractTemplateName,
				type: 'contractInfo'
			}).then(res => {
				if (res.success) {
					this.templeteData = JSON.parse(res.data.templateJson);
					this.VUEX_SET_FORM_SCHEMA_INIT(this.templeteData);
					this.optionsList = res.data.transportMode;
					this.getOptionsList();
					const { transportMode, deliveryMode, transportResponsibility, freightPayMode } = this.data?.contractDelivery;
					this.VUEX_UPDATE_FORM_SCHEMA({ field: 'transportation', values: { freightPayMode, label: 'freightPayMode' } });
					this.VUEX_UPDATE_FORM_SCHEMA({
						field: 'transportation',
						values: { transportResponsibility, label: 'transportResponsibility' }
					});
					this.VUEX_UPDATE_FORM_SCHEMA({ field: 'transportation', values: { deliveryMode, label: 'deliveryMode' } });
					this.VUEX_UPDATE_FORM_SCHEMA({ field: 'transportation', values: { transportMode, label: 'transportMode' } });
				}
			});
		},
		// 存储配置文件中所有下拉选项的options
		getOptionsList() {
			const tempArr = [];
			for (const key in this.templeteData?.formList) {
				if (this.templeteData.formList[key].length) {
					this.templeteData.formList[key].forEach(item => {
						if (item.options && item.options.length) {
							tempArr.push(item.options);
						}
					});
				}
			}
			this.optionsList = this.optionsList.concat(tempArr.flat());
		},
		viewContractDetail(record) {
			// 电子合同 查看-跳转到合同详情
			let routeUrl = this.$router.resolve({
				path: `/center/contract/${this.$route.query.type.toLowerCase()}/agreement/pdf/detail`,
				query: {
					contractNo: this.data.contract.contractNo,
					contractId: this.data.contract.id,
					zipFileName:
						this.data.contract.contractNo +
						'-' +
						this.data.contract.sellerCompanyName +
						'-' +
						this.data.contract.buyerCompanyName +
						'.zip',
					no: record.no,
					newTab: 'newTab'
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		downFile() {
			let zipFileName =
				this.data.contract.contractNo +
				'-' +
				this.data.contract.sellerCompanyName +
				'-' +
				this.data.contract.buyerCompanyName +
				'.zip';
			//压缩包命名规则：【原合同编号】-【卖方企业】-【买方企业】
			API_downloadAllContractAttachment({ orderId: this.data.contract.id }).then(res => {
				comDownload(res, undefined, zipFileName);
			});
		},
		// 业务线详情
		viewBusinessLineDetail(items) {
			let routerData = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.parentOrderNo,
					downOrderNo: items.orderNo,
					businessLineType: items.businessLineType,
					businessLineNo: items.businessLineNo,
					contractType: 0,
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					downstreamActiveIndex: 0
				}
			});
			window.open(routerData.href, '_blank');
		},
		// 关联合同
		realteContract() {
			this.data.contract.orderSerialNo = this.data.contract.serialNo;

			this.VUEX_setRelationContract({ ...this.data.contract, ...this.data.contractDelivery });
			this.$router.push({
				path: '/center/businessline/addAssociation',
				query: {
					type: this.type.toLowerCase(),
					orderType: 'ONLINE',
					source: 'contract'
				}
			});
		},
		downloadPdf(items) {
			let name = '';
			if (items.fileName === '服务费协议') {
				name =
					'服务费协议-' + this.data.serviceFeeAgreementNo + '-' + this.data.companyName + '-' + this.data.settlementCompanyName;
				name = name + (this.data.thirdPartyCompanyName ? '-' + this.data.thirdPartyCompanyName + '.pdf' : '.pdf');
			} else if (items.fileTypeText === '补充协议') {
				name =
					'电子补充协议-' +
					items.no +
					'-【' +
					this.data.contract.sellerCompanyName +
					'】-【' +
					this.data.contract.buyerCompanyName +
					'】.pdf';
			} else {
				name =
					'贸易合同-' +
					this.data.contract.contractNo +
					'-【' +
					this.data.contract.sellerCompanyName +
					'】-【' +
					this.data.contract.buyerCompanyName +
					'】';
				name = name + (items.fileName === '承诺函' ? '-承诺函.pdf' : '.pdf');
			}
			API_DOWNLPREVIEWTE(ENV.BASE_NET + items.fileUrl).then(res => {
				comDownload(res, undefined, name);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 30px;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.bank-account-box {
	margin-top: 10px;
	::v-deep.ant-row-flex {
		flex-wrap: nowrap !important;
	}
	.textOverflow {
		left: 0;
	}
	.bank-account-item {
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		border-radius: 6px;
		margin-right: 50px;
		line-height: 24px;
		width: 350px;
		.bank-account-title {
			margin-bottom: 10px;
			line-height: 22px;
		}
		.bank-account-icon {
			width: 30px;
			height: 22px;
			vertical-align: top;
		}
		::v-deep.ant-col {
			.label {
				color: rgba(0, 0, 0, 0.4);
			}
		}
		.title {
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #77889d;
			margin-left: 10px;
		}
	}
	.bank-account-item.first {
		background: #f0f8ff;
	}
	.bank-account-item.second {
		background: #fff9e9;
	}
}
.business-line-empty-box {
	width: 100%;
	height: 88px;
	border-radius: 4px;
	border: 1px solid #e5e6eb;
	text-align: center;
	.business-line-empty-content {
		width: 380px;
		margin: 11px auto;
		.label {
			line-height: 20px;
			margin-bottom: 10px;
		}
		.slBtn {
			margin-left: 0;
			float: left;
		}
	}
	.flexStyle {
		display: flex;
		align-items: center;
	}
}
.grid-wrap {
	margin-top: 10px;
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
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
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
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
.transportBox {
	.textOverflow {
		height: 48px;
		line-height: 48px;
		left: 160px;
		padding: 0 10px;
	}
}
.label {
	.textOverflow {
		left: 12px;
	}
}
.productIndicatorBody {
	& > div {
		.productIndicatorBox {
			color: rgba(0, 0, 0, 0.8);
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			border-left: 1px solid #e5e6eb;
			border-top: 1px solid #e5e6eb;
			::v-deep.ant-col {
				line-height: 48px;
				box-sizing: border-box;
				text-align: center;
				border-bottom: 1px solid #e5e6eb;
				border-right: 1px solid #e5e6eb;
			}
			.flexRow {
				.left {
					height: 100%;
					color: #77889d;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.right {
					border: none;
				}
				.label {
					background: #fff;
				}
			}

			.label {
				background: #f3f5f6;
				font-weight: 400;
				color: #77889d;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			ul {
				overflow: hidden;
				margin: 0;
				padding: 0;
				li {
					width: 20%;
					text-align: center;
					float: left;
					list-style: none;
					span {
						display: block;
						height: 48px;
						border-right: 1px solid #e5e6eb;
						border-bottom: 1px solid #e5e6eb;
					}
					& > span:first-child {
						border-top: 0;
					}
				}
			}
		}
	}
	& > div:last-child {
		.productIndicatorBox {
			margin-top: 0;
			border-top: none;
		}
	}
	& > div:first-child {
		.productIndicatorBox {
			margin-top: 10px;
			border-top: 1px solid #e5e6eb;
		}
	}
	.thinColor {
		color: #77889d;
	}
	.heavyColor {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
