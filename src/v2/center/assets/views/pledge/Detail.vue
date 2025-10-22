<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>查看货押资产</span
				>
			</div>
			<div class="bottom-box">
				<!-- 只显⽰当前“平台驳回”的审核信息 -->
				<div
					class="s-card-content"
					v-if="detailData.receivalVO && detailData.auditInfo && detailData.auditInfo.audit"
				>
					<h2>审核信息</h2>
					<a-row>
						<a-col :span="4">审批人</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditor }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核时间</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditTime }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核结果</a-col>
						<a-col
							:span="20"
							class="red"
							>{{ detailData.auditInfo.audit.auditResult == 'PASS' ? '通过' : '驳回' }}</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">审核意见</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditOpinion }}</a-col>
					</a-row>
				</div>

				<!-- 只显⽰当前“融资失败”且已批注的批注信息-->
				<div
					class="s-card-content"
					v-if="
						detailData.receivalVO &&
						detailData.receivalVO.status == 'COMMENTED' &&
						detailData.commentInfo &&
						detailData.commentInfo.comment
					"
				>
					<h2>批注信息</h2>
					<a-row>
						<a-col :span="4">批注人</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.commenter }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注时间</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.createDate }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注信息</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.remark }}</a-col>
					</a-row>
				</div>
			</div>
			<a-form
				:form="baseForm"
				:label-col="{ span: 9 }"
				:wrapper-col="{ span: 15 }"
				v-if="detailData.receivalVO"
			>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>基本信息</h2>
						<a-row>
							<a-col span="12">
								<a-form-item label="货押资产编号">
									{{ detailData.receivalVO.serialNo }}
								</a-form-item>
							</a-col>
						</a-row>
						<a-row class="row">
							<a-col span="12">
								<a-row>
									<a-form-item label="行业">
										{{ detailData.receivalVO.industryTypeDesc }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓库名称">
										{{ detailData.receivalVO.storageName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="资金类型">
										{{ detailData.receivalVO.paymentTypeName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="质押单价计算规则">
										{{ detailData.receivalVO.calculateTypeDesc }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="质押货值（元）">
										<span style="color: red">{{ detailData.receivalVO.pledgeGoods }}</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="状态">
										{{ detailData.receivalVO.statusText }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="货主名称">
										{{ VUEX_ST_COMPANYSUER.companyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="仓储企业">
										{{ detailData.receivalVO.companyName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="金融机构">
										{{ detailData.receivalVO.bankName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="质押数量（吨）">
										{{ detailData.receivalVO.pledgeQuantity }}
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item label="拟融资金额（元）">
										<span style="color: red">{{ detailData.receivalVO.planFinancingAmount }}</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="应收账款申请日期">
										{{ detailData.receivalVO.beginDate }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>
				<div class="bottom-box">
					<div class="s-card-content">
						<h2>下游合同信息</h2>
						<a-row>
							<a-col span="12">
								<a-form-item
									label="合同信息"
									:colon="false"
								></a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-form-item label="卖方名称">
									{{ detailData.pledgeTerminalContract.sellerName }}
								</a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-row>
									<a-form-item label="买方名称">
										{{ detailData.pledgeTerminalContract.buyerName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同编号">
										<div class="overflow">
											<a-tooltip>
												<template slot="title">{{ detailData.pledgeTerminalContract.paperContractNo }}</template>
												<span>{{ detailData.pledgeTerminalContract.paperContractNo }}</span>
											</a-tooltip>
										</div>
									</a-form-item>
								</a-row>

								<a-row>
									<a-form-item label="合同签订状态">
										{{ detailData.pledgeTerminalContract.statusDesc }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同执行期">
										{{ detailData.pledgeTerminalContract.execDateStart }}~{{ detailData.pledgeTerminalContract.execDateEnd }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="热力值标准（Kcal/kg）">
										{{ detailData.pledgeTerminalContract.calorificValue }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="标的货物名称">
										{{ detailData.pledgeTerminalContract.pledgeGoodsList[0].goodsName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同数量（吨）">
										{{ detailData.pledgeTerminalContract.pledgeGoodsList[0].quantity }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="买方企业信用代码">
										{{ detailData.pledgeTerminalContract.buyerBizNo }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同名称">
										{{ detailData.pledgeTerminalContract.contractName }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="签订日期">
										{{ detailData.pledgeTerminalContract.contractSignTime }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同单价（元/吨）">
										{{ detailData.pledgeTerminalContract.pledgeGoodsList[0].price }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="合同总价（元）">
										{{ detailData.pledgeTerminalContract.pledgeGoodsList[0].totalPrice }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="交货港">
										{{ detailData.pledgeTerminalContract.deliveryPlace }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="交货方式">
										{{ detailData.pledgeTerminalContract.deliveryModeDesc }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<a-row v-if="detailData.pledgeTerminalContract.deliveryMode == 'VEHICLE_BOARD'">
							<a-col span="12">
								<a-row>
									<a-form-item label="发站车次">
										{{ detailData.pledgeTerminalContract.deliveryNo }}
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="垛位">
										{{ detailData.pledgeTerminalContract.stackingPosition }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="发站地">
										{{ detailData.pledgeTerminalContract.deliveryStation }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-form-item
									label="应收账款信息"
									:colon="false"
								></a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col span="12">
								<a-row>
									<a-form-item label="应收账款金额（元）">
										<span style="color: red">{{ detailData.receivalVO.amount }}</span>
									</a-form-item>
								</a-row>
								<a-row>
									<a-form-item label="应收账款起始日期">
										{{ detailData.receivalVO.beginDate }}
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="12">
								<a-row>
									<a-form-item label="应收账款到期日期">
										{{ detailData.receivalVO.endDate }}
									</a-form-item>
								</a-row>
							</a-col>
						</a-row>
					</div>
				</div>
			</a-form>
			<div class="s-card-content">
				<h2>资产信息</h2>
				<a-table
					:columns="goodsColumn"
					:dataSource="goodsDataSource"
					:pagination="false"
					rowKey="number"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
				<h2 style="margin-top: 30px">仓单详情信息</h2>
				<div class="goods-container">
					<a-tabs
						:defaultActiveKey="0"
						v-show="goodsDataSource.length"
					>
						<a-tab-pane
							:tab="item.number"
							:key="index"
							v-for="(item, index) in goodsDataSource"
						>
							<InOutDetail
								:iid="item.id.toString()"
								ppageType="in"
								aactiveIndex="0"
							/>
						</a-tab-pane>
					</a-tabs>
				</div>
			</div>
			<div class="s-card-content">
				<h2>附件信息</h2>

				<!-- 附件展示 -->
				<a-table
					v-if="fileListDataSource.length || (!fileListDataSource.length && !supplementalInfo.length)"
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="name"
						slot-scope="name, items"
					>
						<a
							:href="BASE_NET + items.path"
							target="_blank"
							>{{ name }}</a
						>
					</template>
				</a-table>

				<a-table
					v-if="supplementalInfo.length"
					bordered
					:dataSource="supplementalInfo"
					:columns="supplementalDetailColumns"
					:rowKey="record => record.index"
					:pagination="false"
					:scroll="{ x: true }"
					style="margin-top: 20px"
				>
					<template
						slot="changeItem"
						slot-scope="text, record"
						v-if="record.changeItem"
					>
						<span
							v-for="(item, index) in record.changeItem.split(',')"
							:key="index"
						>
							{{ filterCodeByValueName(item, 'changeItemEnums') }}
							<span v-if="index < record.changeItem.split(',').length - 1">、</span>
						</span>
					</template>
					<template
						slot="executionDate"
						slot-scope="text, record"
					>
						{{ record.executionDateStart }}
						<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
					</template>
					<template
						slot="name"
						slot-scope="text, record"
					>
						<a
							v-for="(item, index) in record.supplementalFile"
							:key="index"
							class="edit-btn"
							:href="BASE_NET + item.url"
							target="_blank"
						>
							{{ item.name }}
							<span v-if="index < record.supplementalFile.length - 1">,</span>
						</a>
					</template>
					<template
						slot="transferName"
						slot-scope="text, record"
					>
						<span
							v-for="(item, index) in record.supplementalFile"
							:key="index"
							class="edit-btn"
						>
							{{ item.transferName || '-' }}
							<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
						</span>
					</template>
				</a-table>
			</div>
			<div class="btn-box">
				<div
					class="btn-wrap"
					v-if="detailData"
				>
					<a-button
						@click="$router.back()"
						type="primary"
						ghost
						>返回</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAssetsPledgeDetail } from '@/v2/center/assets/api/index.js';
import _ from 'lodash';
import moment from 'moment';
import Upload from '@/v2/center/assets/components/common/Upload.vue';
import ENV from '@/v2/config/env';
import InOutDetail from '@/views/center/pledge/cargoManage/InOutDetail.vue';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			moment,
			BASE_NET: ENV.BASE_NET,
			baseForm: this.$form.createForm(this),
			numberReg: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: {}, // 详情数据
			bankList: [{ paymentType: 1, name: 'xxx', bankName: 'bankName' }],
			bankName: '',
			endDate: '',
			goodsDataSource: [],
			buyerNameList: [{ companyName: 'companyName', uscc: '123' }],
			goodsColumn: [
				{ title: '编号', dataIndex: 'number', key: 'number', fixed: 'left' },
				{ title: '货物名称', dataIndex: 'goodsName', key: 'goodsName' },
				{ title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint' },
				{ title: '方向', dataIndex: 'direction', key: 'direction' },
				{ title: '数量（吨）', dataIndex: 'quantity', key: 'quantity' },
				{ title: '单价（元/吨）', dataIndex: 'thisPledgePrice', key: 'thisPledgePrice' },
				{ title: '货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods' },
				{ title: '已质押（吨）', dataIndex: 'hasPledgeQuantity', key: 'hasPledgeQuantity' },
				{ title: '可质押（吨）', dataIndex: 'canPledgeQuantity', key: 'canPledgeQuantity' },
				{ title: '本次质押（吨）', dataIndex: 'thisPledgeQuantity', key: 'thisPledgeQuantity' },
				{ title: '本次质押货值（元）', dataIndex: 'thisPledgeGoods', key: 'thisPledgeGoods' },
				{ title: '资产类型', dataIndex: 'assetType', key: 'assetType' }
			],
			filesColumns: [
				{
					title: '单据类型',
					dataIndex: 'type',
					key: 'type',
					customRender: (text, row) => {
						let typeName = this.CONSTANTS.fileType[text];
						return {
							children: `${typeName}`,
							attrs: {
								rowSpan: row.typeRowSpan
							}
						};
					}
				},
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			fileListDataSource: [],
			supplementalInfo: [], // 下游补充协议附件
			supplementalDetailColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				}
			]
		};
	},
	components: {
		Upload,
		InOutDetail,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	mounted: function () {
		API_GetAssetsPledgeDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
				this.goodsDataSource = this.detailData.pledgeInboundList || [];
				this.fileListDataSource = TableRowSpanFunc(this.detailData.pledgeTerminalContract.list || [], 'type');
				this.supplementalInfo = this.detailData.pledgeTerminalContract.supplementalInfo || [];
			}
		});
	},
	methods: {}
};
</script>
<style lang="less" scoped>
::v-deep .ant-form-item-label {
	text-align: left;
	label {
		color: #6b6f76;
	}
}
.s-card-content > h2 {
	font-family: PingFangSC-Medium;
	padding-left: 16px;
	text-align: left;
	line-height: 40px !important;
	font-size: 15px;
	height: 40px;
	background-color: rgba(0, 83, 219, 0.15);
}
.goods-container ::v-deep .inout-content {
	margin: 0 !important;
	.backbtn {
		display: none;
	}
	.top-box {
		box-shadow: none;
	}
	.s-card-content {
		margin: 0 !important;
	}
	.s-card-title {
		border: none !important;
		font-size: 14px;
	}
}
.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;
	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;
		a {
			cursor: pointer;
		}
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.bottom-box {
	.s-card-content .ant-row .ant-col:first-child {
		color: #6b6f76;
	}
	.s-card-content .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}
.s-card-content {
	padding: 20px 0 0 0;
	border-radius: 8px;
	background: #fff;
	.row .ant-col {
		margin-top: 8px;
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-row .ant-col {
		margin-bottom: 8px;
		margin-top: 8px;
	}
	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #141517;
		line-height: 22px;
		margin-bottom: 16px;
	}
}
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar i {
	display: none;
	// display: inline-block;
	width: 10px;
	height: 10px;
	float: right;
	background: red;
	border-radius: 50%;
	margin-top: 8px;
	margin-right: 10px;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar .tabs-icon {
	margin-right: 10px;
	em {
		display: block;
		width: 1px;
		height: 36px;
		background: @primary-color;
		border-radius: 1.5px 1.5px 0 0;
		margin: 5px 0 5px 6px;
	}
	img {
		width: 24px;
		height: 24px;
		margin-left: -5px;
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		color: #383a3f;
		line-height: 22px;
	}
	.blue {
		color: @primary-color;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}
.red {
	color: #f24e4d !important;
}
.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.contentBox {
	font-family: PingFangSC-Regular;
}
.green {
	background: #00ae9d !important;
}
.orange {
	background: #ff9726 !important;
}
.red_bg {
	background: #f24e4d !important;
}
.btn-box {
	background: #ffffff !important;
	border-radius: 8px;
	padding: 20px 0;
	margin-top: 20px;
}
.btn-box .btn-wrap {
	margin: 0;
}
</style>
