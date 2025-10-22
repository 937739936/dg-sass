<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					><span>服务费结算单</span></span
				>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				ref="SlFormNew"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:loading="loading"
				>
					<!-- 金额格式转化 1000=1,000.00 -->
					<template
						slot="serviceFeeAmount"
						slot-scope="serviceFeeAmount, item"
					>
						<span v-if="serviceFeeAmount">{{ serviceFeeAmount | formatMoney(2) }}</span>
						<span v-else>{{ serviceFeeAmount }}</span>
					</template>
					<template
						slot="receiveAmount"
						slot-scope="receiveAmount, item"
					>
						<span v-if="receiveAmount">{{ receiveAmount | formatMoney(2) }}</span>
						<span v-else>{{ receiveAmount }}</span>
					</template>
					<template
						slot="settlementCompanyName"
						slot-scope="settlementCompanyName, item"
					>
						<a-tooltip overlayClassName="bank-info-tooltip">
							<template slot="title">
								<div
									class="bank-tip-first-line"
									@mouseenter="()=>{copyContractNoVisible= true}"
									@mouseleave="()=>{copyContractNoVisible= false}"
								>
									<p>收款单位：{{ item.settlementCompanyBankConfig.accountName }}</p>
									<a-row
										type="flex"
										justify="center"
										class="copy-btn"
										v-clipboard:copy="
											`收款单位：${item.settlementCompanyBankConfig.accountName}\n银行账号：${item.settlementCompanyBankConfig.account}\n开户行：${item.settlementCompanyBankConfig.accountBank}\n支行行号：${item.settlementCompanyBankConfig.branchNumber}`
										"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
									>
										<span
											v-show="!copyContractNoVisible"
											class="copy-icon"
											>
											<Copy></Copy>
										</span>
										<span
											v-show="copyContractNoVisible"
											v-clipboard:copy="
												`收款单位：${item.settlementCompanyBankConfig.accountName}\n银行账号：${item.settlementCompanyBankConfig.account}\n开户行：${item.settlementCompanyBankConfig.accountBank}\n支行行号：${item.settlementCompanyBankConfig.branchNumber}`
											"
											v-clipboard:success="onCopy"
											v-clipboard:error="onError"
											class="copy-icon"
											>
											<CopyNow></CopyNow>
										</span>
										<a-col flex="auto"><a class="copy-text">复制</a></a-col>
									</a-row>
									
								</div>
								<p>银行账号：{{ item.settlementCompanyBankConfig.account }}</p>
								<p>开户行：{{ item.settlementCompanyBankConfig.accountBank }}</p>
								<p>支行行号：{{ item.settlementCompanyBankConfig.branchNumber }}</p>
							</template>
							<a-space align="center">
								<span>{{ settlementCompanyName }}</span>
								<img
									class="bank-card-icon"
									src="@/v2/assets/imgs/common/bank_card_icon.png"
									alt=""
								/>
							</a-space>
							<!-- <a-row type="flex">
                                <a-col flex="auto"><span>{{settlementCompanyName}}</span></a-col>
                                <a-col flex="16px">
                                    <img
                                        class="bank-card-icon"
                                        src="@/v2/assets/imgs/common/bank_card_icon.png"
                                        alt=""
                                    />
                                </a-col>
                            </a-row> -->
						</a-tooltip>
					</template>
					<span slot="customTitle">
						操作
						<!-- <a-icon type="setting" @click="sortVal" style="display: inline-block;margin-left:2px;font-size:15px;"/> -->
					</span>
					<div
						slot="action"
						slot-scope="action, item"
						class="action-btn"
					>
						<!-- 待签约状态下  查看、盖章、下载-->
						<!-- 已确认状态下  申请作废、查看、下载-->
						<!-- 待平台审核状态下  查看、下载-->
						<!-- 待作废确认状态下  盖章、查看、下载-->
						<!-- 已作废 查看、删除 -->
						<template v-if="['CONFIRMED'].includes(item.status)">
							<a
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:applyInvalid'"
								@click="$router.push({ path: 'cancelApply?id=' + item.id })"
								>申请作废</a
							>
						</template>
						<template v-if="item.status == 'WAIT_INVALID_CONFIRM'">
							<router-link
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:invalidSeal'"
								:to="{ path: 'cancelStamp', query: { id: item.id, isNew: item.isNew, orderNo: item.orderNo } }"
							>
								盖章
							</router-link>
						</template>
						<template v-if="item.status == 'WAIT_CONFIRM'">
							<!-- isNew为true代表是新数据 否则是老数据-->
							<a
								v-if="!item.isNew"
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:confirm'"
								@click="$router.push({ path: 'myServiceFeeConfirm?id=' + item.id })"
								>确认</a
							>
							<a
								v-if="item.isNew"
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:confirm'"
								@click="$router.push({ path: 'myServiceFeeConfirmNew?id=' + item.id })"
								>确认</a
							>
						</template>
						<template v-if="['WAIT_SIGN_SEAL', 'CONFIRMED', 'INVALID', 'SUSPEND', 'WAIT_INVALID_CONFIRM'].includes(item.status)">
							<!-- isNew为true代表是新数据 否则是老数据-->
							<a
								v-if="!item.isNew"
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:detail'"
								@click="$router.push({ path: 'myServiceFeeDetail?id=' + item.id })"
								>查看</a
							>
							<a
								v-if="item.isNew"
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:detail'"
								@click="$router.push({ path: 'myServiceFeeDetailNew?id=' + item.id })"
								>查看</a
							>
						</template>
						<template v-if="item.status == 'WAIT_SIGN_SEAL'">
							<router-link
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:seal'"
								:to="{
									path: '/center/financeCenter/service/confirm/seal',
									query: { id: item.id, isNew: item.isNew, orderNo: item.orderNo }
								}"
							>
								盖章
							</router-link>
						</template>
						<template v-if="['INVALID'].includes(item.status)">
							<a
								v-auth="'financialCenter:serviceFee:serviceFeeStatement:invalidDel'"
								@click="del(item.id)"
								>删除</a
							>
						</template>
						<a
							v-if="item.status != 'INVALID'"
							v-auth="'financialCenter:serviceFee:serviceFeeStatement:detail'"
							@click="downLoad(item)"
							>下载</a
						>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>

<script>
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '服务费结算单号',
		type: 'input',
		placeholder: '请输入服务费结算单号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('serviceFeeStatementStatusDict')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DRAFT')
	},
	{
		decorator: ['chargeStatus'],
		addonBeforeTitle: '付款情况',
		type: 'select',
		placeholder: '请选择',
		options: [
			{ label: '全部', value: null },
			{ label: '未付款', value: 'UNPAID' },
			{ label: '部分付款', value: 'PART_PAID' },
			{ label: '已全部付款', value: 'ALL_PAID' },
			{ label: '付款超出', value: 'OVER_PAID' }
		]
	},
	{
		decorator: ['settlementCompanyUscc'],
		addonBeforeTitle: '结算单位',
		type: 'select',
		placeholder: '请选择',
		options: []
	}
];
import {
	API_GetServiceFeeStatementList,
	getSignSettlementList,
	API_delServiceFee,
	API_downloadServiceFee
} from '@/v2/center/financeCenter/api/index';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { Copy, CopyNow } from '@sub/components/svg'
export default {
	mixins: [ListMixin],
	name: 'MyServiceFee',
	components: {
		ConfirmModal,
		Copy,
		CopyNow
	},
	data() {
		return {
			flag: false,
			settlementCompanyUsccList: [],
			columns: [
				{ title: '服务费结算单号', dataIndex: 'serialNo', key: 'serialNo' },
				{ title: '结算日期', dataIndex: 'createDate', key: 'createDate' },
				{
					title: '服务费金额(元)',
					dataIndex: 'serviceFeeAmount',
					key: 'serviceFeeAmount',
					align: 'center',
					scopedSlots: { customRender: 'serviceFeeAmount' }
				},
				{
					title: '已付款金额（元）',
					dataIndex: 'receiveAmount',
					key: 'receiveAmount',
					align: 'center',
					scopedSlots: { customRender: 'receiveAmount' }
				},
				{ title: '付款情况', dataIndex: 'chargeStatusText', key: 'chargeStatusText' },
				{
					title: '结算单位',
					dataIndex: 'settlementCompanyName',
					key: 'settlementCompanyName',
					scopedSlots: { customRender: 'settlementCompanyName' }
				},
				{ title: '结算单状态', dataIndex: 'statusText', key: 'statusText' },
				{ key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
			],
			modalPdfIsShow: false,
			ticketPdfUrl: '',
			loading: false,
			searchList,
			selfLoad: true,
			url: {
				list: API_GetServiceFeeStatementList
			},
			confirmObj: {},
			copyContractNoVisible: false
		};
	},
	mounted() {
		this.initData();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isLogisticsCompany() {
			return this.VUEX_ST_COMPANYSUER.company?.companyType == 'LOGISTICS';
		}
	},
	methods: {
		initData() {
			return new Promise(async resolve => {
				if (this.isLogisticsCompany) {
					this.columns.splice(
						4,
						0,
						{ title: '下游结算数量', dataIndex: 'downStatementQuantity', key: 'downStatementQuantity', width: 150 },
						{ title: '每吨费用', dataIndex: 'cost', key: 'cost', width: 150 }
					);
				}
				await this.getSignSettlementList();
				this.getList();
				resolve(true);
			});
		},
		getSignSettlementList() {
			getSignSettlementList().then(resList => {
				this.settlementCompanyUsccList = resList.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'settlementCompanyUscc') {
						item.options = this.settlementCompanyUsccList.map(item => {
							return { value: item.value, label: item.text };
						});
					}
				});
			});
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		del(id) {
			this.confirmObj = {
				id
			};
			const modalObj = {
				modalTitle: '删除确认',
				modalText: '确认要删除该作废记录吗？删除后，将无法恢复。'
			};
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			API_delServiceFee(this.confirmObj).then(res => {
				if (res.success && res.data) {
					this.$message.success('删除成功');
					this.getList();
				}
			});
		},
		downLoad(record) {
			API_downloadServiceFee({ serialNo: record.serialNo }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.modal-pdf {
	.ant-modal-title,
	.ant-modal-footer {
		text-align: center;
	}
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
.search-btn {
	margin-right: 20px;
}
::v-deep.ant-table td {
	white-space: nowrap;
}
.settlement-company {
	justify-content: center;
	align-items: center;
}
.bank-card-icon {
	// margin-left: 4px;
	width: 16px;
	vertical-align: sub;
}
.action-btn {
	& > a {
		display: inline-block;
		margin-right: 8px;
	}
	& > a:last-child {
		margin-right: 0;
	}
}
</style>
<style lang="less">
.bank-info-tooltip {
	max-width: 600px;
	// .ant-tooltip-inner {
	//     width: 600px;
	// }
	.bank-tip-first-line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.copy-btn {
		// margin-left: 10px;
		text-align: center;
		align-items: center;
		.copy-icon {
			width: 14px;
			height: 14px;
			margin-right: 4px;
			cursor: pointer;
			position: relative;
			top: -1px;
		}
		.copy-text {
			color: #fff;
		}
		&:hover {
			.copy-text {
				color: @primary-color;
			}
		}
	}
}
</style>
