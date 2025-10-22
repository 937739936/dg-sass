<template>
	<div class="tabs-content">
		<!-- 所属业务线 -->
		<div class="slTitleAssis">
			<span>所属业务线</span>
			<!-- 双签审批中、双签审批驳回、执行中 -->
			<a-button
				v-if="data.businessLine && data.businessLine.length && ['EXECUTING'].includes(data.status)"
				type="primary"
				ghost
				class="slBtn"
				style="margin-left: 20px"
				@click="realteContract"
				>关联{{ $route.query.type === 'buy' ? '销售' : '采购' }}合同</a-button
			>
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
						<a-col :class="actionBtnDisabled ? 'flexStyle' : ''">
							<p class="label">当前合同尚未关联{{ type === 'BUY' ? '销售' : '采购' }}合同，未形成业务线</p>
							<a-button
								type="primary"
								class="slBtn"
								@click="realteContract"
								v-if="!actionBtnDisabled"
								>去关联</a-button
							>
						</a-col>
					</a-row>
				</div>
			</div>
		</div>
		<!-- 合同信息 -->
		<div class="slTitleAssis">合同信息</div>
		<div class="slTitleThird">基本信息</div>
		<ul class="grid-wrap">
			<li>
				<span class="label">合同单价</span>
				<span v-if="!data.followTheMarket && data.contractPrice">{{ data.contractPrice | formatMoney(3) }}元/吨</span>
				<span v-if="data.followTheMarket">随行就市 </span>
				<span v-if="!data.followTheMarket && !data.contractPrice">-</span>
			</li>
			<li>
				<span class="label">合同数量</span>
				<span v-if="data.contractQuantity">
					{{ data.contractQuantity | formatMoney(3) }}吨<template v-if="data.quantityOffset"
						>（±{{ data.quantityOffset }}%）</template
					></span
				>
				<span v-else>-</span>
			</li>
			<li>
				<span class="label">合同总价</span>
				<span v-if="data.contractAmount">￥{{ !data.contractAmount ? '-' : data.contractAmount | formatMoney(3) }}元</span>
				<span v-else>-</span>
			</li>
			<li>
				<span class="label">品名</span>
				<span v-if="data.goodsName">{{ data.goodsName }}</span>
				<span v-else>-</span>
			</li>
			<li>
				<span class="label">合同签订日期</span>
				<span v-if="data.contractSignTime">{{ data.contractSignTime }}</span>
				<span v-else>-</span>
			</li>
			<li>
				<span class="label">交货期限</span>
				<span v-if="data.execDateStart">{{ data.execDateStart }} 至{{ data.execDateEnd }} </span>
				<span v-else>-</span>
			</li>
			<li :style="data.doubleSignTime ? 'width:33.3%' : 'width: 99.9%'">
				<span class="label">签章状态</span>
				<span>
					<i
						class="status"
						style="padding: 2px 5px; border-radius: 3px"
						>{{ data.signStatusDesc }}</i
					>
				</span>
			</li>
			<li
				style="width: 66.6%"
				v-if="data.doubleSignTime"
			>
				<span class="label">双签合同获得日期</span>
				<span>{{ data.doubleSignTime || '-' }}</span>
			</li>
		</ul>
		<div
			class="slTitleThird"
			v-if="data.terminalDelivery && data.terminalDelivery.transportMode != 'NONE'"
		>
			运输信息
		</div>
		<!-- 汽运火运 -->
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalDelivery && data.terminalDelivery.transportMode === 'AUTOMOBILE_AND_TRAIN'"
		>
			<li>
				<span class="label">运输方式</span>
				<span>{{ data.terminalDelivery.transportModeDesc }}</span>
			</li>
			<li>
				<span class="label">发站</span>
				<span>{{ data.terminalDelivery.trainSendStationName }}</span>
			</li>
			<li>
				<span class="label">到站</span>
				<span>{{ data.terminalDelivery.trainArriveStationName }}</span>
			</li>
			<li>
				<span class="label">托运人</span>
				<span>{{ data.terminalDelivery.consignorCompanyName }}</span>
			</li>
			<li>
				<span class="label">发货地址</span>
				<span>{{ data.terminalDelivery.sendGoodsAddress }}</span>
			</li>
			<li>
				<span class="label">收货地址</span>
				<span>{{ data.terminalDelivery.receiveGoodsAddress }}</span>
			</li>
			<li style="width: 99.9%">
				<span class="label">收货人名称</span>
				<span>{{ data.terminalDelivery.consigneeCompanyName }}</span>
			</li>
		</ul>
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalDelivery && data.terminalDelivery.transportMode === 'SHIP'"
		>
			<li>
				<span class="label">运输方式</span>
				<span>{{ data.terminalDelivery.transportModeDesc }}</span>
			</li>
			<li>
				<span class="label">装货港</span>
				<span>{{ data.terminalDelivery.shipLoadingPortName }}</span>
			</li>
			<li>
				<span class="label">卸货港</span>
				<span>{{ data.terminalDelivery.shipDischargingPortName }}</span>
			</li>
			<li style="width: 99.9%">
				<span class="label">收货人名称</span>
				<span>{{ data.terminalDelivery.consigneeCompanyName }}</span>
			</li>
		</ul>
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalDelivery && data.terminalDelivery.transportMode === 'AUTOMOBILE'"
		>
			<li>
				<span class="label">运输方式</span>
				<span>{{ data.terminalDelivery.transportModeDesc }}</span>
			</li>
			<li>
				<span class="label">发货地址</span>
				<span>{{ data.terminalDelivery.sendGoodsAddress }}</span>
			</li>
			<li>
				<span class="label">收货地址</span>
				<span>{{ data.terminalDelivery.receiveGoodsAddress }}</span>
			</li>
			<li style="width: 99.9%">
				<span class="label">收货人名称</span>
				<span>{{ data.terminalDelivery.consigneeCompanyName }}</span>
			</li>
		</ul>
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalDelivery && data.terminalDelivery.transportMode === 'TRAIN'"
		>
			<li>
				<span class="label">运输方式</span>
				<span>{{ data.terminalDelivery.transportModeDesc }}</span>
			</li>
			<li>
				<span class="label">发站</span>
				<span>{{ data.terminalDelivery.trainSendStationName }}</span>
			</li>
			<li>
				<span class="label">到站</span>
				<span>{{ data.terminalDelivery.trainArriveStationName }}</span>
			</li>
			<li>
				<span class="label">托运人</span>
				<span>{{ data.terminalDelivery.consignorCompanyName }}</span>
			</li>
			<li style="width: 66.6%">
				<span class="label">收货人名称</span>
				<span>{{ data.terminalDelivery.consigneeCompanyName }}</span>
			</li>
		</ul>
		<div
			class="slTitleThird"
			v-if="data.terminalContractExtensionDto.companyInvoiceInfo"
		>
			下游开票信息
		</div>
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalContractExtensionDto.companyInvoiceInfo"
		>
			<li>
				<span class="label">购买方</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.companyName }}</span>
			</li>
			<li>
				<span class="label">税号</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.bizLicenseNo }}</span>
			</li>
			<li>
				<span class="label">企业地址</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.companyAddress }}</span>
			</li>
			<li>
				<span class="label">电话号码</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.companyPhone }}</span>
			</li>
			<li>
				<span class="label">开户行</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.openAccountBank }}</span>
			</li>
			<li>
				<span class="label">银行账号</span>
				<span>{{ data.terminalContractExtensionDto.companyInvoiceInfo.accountNo }}</span>
			</li>
		</ul>
		<div
			class="slTitleThird"
			v-if="data.terminalContractExtensionDto.signWay == 'EXPRESS_MAIL'"
		>
			合同签订留痕信息
		</div>
		<ul
			class="grid-wrap transportBox"
			v-if="data.terminalContractExtensionDto.signWay == 'EXPRESS_MAIL'"
		>
			<li>
				<span class="label">合同签订方式</span>
				<span>快递邮寄 </span>
			</li>
			<li>
				<span class="label">快递公司</span>
				<span>
					{{
						data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.expressMailType
							| filterCodeByValueName('expressMailEnum')
					}}</span
				>
			</li>
			<li>
				<span class="label">快递单号</span>
				<span> {{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.expressOrderNo }}</span>
			</li>
			<li>
				<span class="label">寄件人姓名</span>
				<span>{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.senderName }}</span>
			</li>
			<li>
				<span class="label">寄件人电话</span>
				<span> {{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.senderMobile }}</span>
			</li>
			<li>
				<span class="label">寄件人地址</span>
				<a-tooltip>
					<template slot="title">
						<span>
							{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendAddress }}-
							{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendDetailAddress }}</span
						>
					</template>
					<span>
						{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendAddress }}-
						{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendDetailAddress }}</span
					>
				</a-tooltip>
			</li>
			<li>
				<span class="label">收件人姓名</span>
				<span> {{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiverName }}</span>
			</li>
			<li>
				<span class="label">收件人电话</span>
				<span>{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiverMobile }}</span>
			</li>
			<li>
				<span class="label">收件地址</span>
				<a-tooltip>
					<template slot="title">
						<span>
							{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveAddress }}-
							{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveDetailAddress }}</span
						></template
					>
					<span>
						{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveAddress }}-
						{{ data.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveDetailAddress }}</span
					>
				</a-tooltip>
			</li>
		</ul>

		<div
			class="slTitleThird"
			v-if="data.contractType == 'DOWN'"
		>
			回款账户
		</div>
		<div
			class="bank-account-box"
			v-if="data.contractType == 'DOWN'"
		>
			<a-row type="flex">
				<a-col class="bank-account-item first">
					<p class="bank-account-title">
						<img
							src="@/v2/assets/imgs/contract/buyer_bank_car_icon.png"
							alt=""
							class="bank-account-icon"
						/>
						<span class="title">回款账户</span>
					</p>
					<a-row type="flex">
						<a-col flex="70px">
							<span class="label">账户名：</span>
						</a-col>
						<a-col flex="1">
							<TextOverFlow
								v-if="data.receivableAccountName"
								:content="data.receivableAccountName"
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
								v-if="data.receivableBankAccountNo"
								:content="formateBankNo(data.receivableBankAccountNo)"
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
								v-if="data.receivableBankName"
								:content="data.receivableBankName"
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
								v-if="data.receivableAccountOpenCity || data.receivableAccountOpenCity"
								:content="data.receivableAccountOpenCity"
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
		<p class="tip">合同相关附件</p>
		<div class="table-box">
			<a-table
				:columns="filesColumns"
				border
				class="new-table"
				:bordered="false"
				rowKey="fileUrl"
				:dataSource="data.contractAttachment"
				:pagination="false"
			>
				<template
					slot="fileList"
					slot-scope="text, record"
				>
					<span class="preview-box">
						<a-tooltip
							v-for="(item, i) in record.fileList"
							:key="i"
						>
							<template slot="title"> 上传时间：{{ item.uploadTime }} </template>
							<a
								href="javascript:;"
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}
							</a>
						</a-tooltip>
					</span>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						@click="download(items)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
		<div v-show="isShowSupp">
			<p class="tip">补充协议</p>
			<SuppleAgree
				handleType="detail"
				ref="suppleAgree"
			></SuppleAgree>
		</div>

		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
const businessLineColumns = [
	{ title: '业务线号', dataIndex: 'businessLineNo', width: '18%' },
	{ title: '业务线名称', dataIndex: 'businessLineName', width: '30%' },
	{ title: '采购合同编号', dataIndex: 'parentContractNo', width: '22%' },
	{ title: '销售合同编号', dataIndex: 'contractNo', width: '20%' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const filesColumns = [
	{ title: '单据类型', dataIndex: 'typeName', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GETCURRENTENV } from '@/v2/center/trade/api/contract';

import { downloadDownContract, downloadSingleFile } from '@/v2/center/trade/api/downcontract';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import ENV from '@/v2/config/env';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import SuppleAgree from '../SuppleAgree.vue';
import { API_GetDownloadRAR } from '@/v2/api/upload';
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
			maxWidth: 0, // 信息文案最大宽度
			previewImg: '',
			isShowSupp: false
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
		SuppleAgree
	},
	filters: {
		filterCodeByValueName
	},
	props: {
		data: {
			default: () => {
				return { terminalDelivery: {} };
			}
		},
		type: {},
		clientWidth: {},
		actionBtnDisabled: {}
	},
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
			let result = [];
			result = this.productIndicator.filter(
				item =>
					item.setValue &&
					item.setValue != '-' &&
					item.setValue != '≥' &&
					item.setValue != '≤' &&
					item.setValue != '>' &&
					item.setValue != '<' &&
					item.setValue != '='
			);
			return result;
		},
		getComputedTextByValue() {
			if (this.optionsList.length) {
				return {
					settleMode: this.optionsList.filter(item => item.value == this.data.settleMode)[0]?.label,
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
			this.$nextTick(() => {
				this.isShowSupp = !!this.data.supplementalInfo.length;
				this.$refs.suppleAgree.init(this.data);
			});
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		async download(record) {
			const params = {
				id: this.data.id,
				attachmentTypeCode: record.type
			};
			const res = await downloadSingleFile(params);

			comDownload(res.data, null, res.name);
		},
		downFile() {
			//压缩包命名规则：【原合同编号】-【卖方企业】-【买方企业】
			downloadDownContract({ id: this.data.id }).then(res => {
				comDownload(res.data, undefined, res.name);
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
			this.data.orderSerialNo = this.data.serialNo;
			this.VUEX_setRelationContract(this.data);
			this.$router.push({
				path: '/center/businessline/addAssociation',
				query: {
					type: this.type.toLowerCase(),
					orderType: this.type === 'SELL' ? 'DOWN' : 'UP',
					source: 'contract'
				}
			});
		},
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1 || this.previewImg.indexOf('.PDF') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg);
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
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
.status {
	background: #c5ecdd;
	color: #3eb384;
}
.name-box {
	display: flex;
	flex-wrap: wrap;
}
.name {
	// background: #F3F5F6;
	border-radius: 4px;
	padding: 6px;
	display: flex;
	align-items: center;
	color: @primary-color;
	margin-right: 14px;
	margin-bottom: 10px;
}
.preview {
	cursor: pointer;
	padding-right: 14px;
	padding-left: 14px;
	border-left: 1px solid #e9effc;
}
.preview-box {
	.preview:first-child {
		padding-left: 0;
		border-left: 0;
	}
}

.new-table {
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-right: 1px solid #e5e6eb;
	}
	/deep/ .ant-table-tbody > tr > :last-child {
		border-right: 0;
	}
}
.tip {
	color: #77889d;
	font-weight: 600;
	font-size: 14px;
	margin: 20px 0;
}
</style>
