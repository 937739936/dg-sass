<template>
	<div
		class="slMain mt-10 new-detail"
		v-if="detailData"
	>
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>池台账查询</span
				>
			</div>
			<div
				v-if="detailData"
				layout="vertical"
			>
				<div
					class="new-detail-content detail-form"
					style=""
				>
					<a-button
						style="float: right"
						type="primary"
						@click="sync"
						v-auth="'asset:pool:view:sync'"
						>同步</a-button
					>
					<h2>
						池额度信息<span class="gray-title">数据更新频率2小时，最新更新时间为{{ detailData.syncTime }}</span>
					</h2>

					<a-row>
						<a-col span="6">
							<a-row>
								<a-form-item label="企业名称">
									{{ detailData.companyName }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="总额度（元）">
									{{ detailData.creditAmount }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="可用敞口额度（元）">
									<a-tooltip>
										<template slot="title"> 可用敞口额度=总额度-已用敞口 </template>
										<a-icon
											type="exclamation-circle"
											style="margin-left: 5px; position: absolute; top: -37px; left: 130px"
										/>
									</a-tooltip>
									{{ detailData.creditAvaexAmount || '-' }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="同步时间">
									{{ detailData.syncTime }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="6">
							<a-row>
								<a-form-item label="金融机构">
									{{ detailData.bankName }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="融资余额（元）">
									{{ detailData.sumPutAmount }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="可用敞口（元）">
									<a-tooltip>
										<template slot="title"> 可用敞口=已入池资产总额*融资比例-已用敞口 </template>
										<a-icon
											type="exclamation-circle"
											style="margin-left: 5px; position: absolute; top: -37px; left: 100px"
										/>
									</a-tooltip>
									{{ detailData.sumAvaexpAmount || '-' }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="6">
							<a-row>
								<a-form-item label="池额度编号">
									{{ detailData.creditNo }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="保证金总额（元）">
									{{ detailData.sumAssAmount }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="起始日期">
									{{ detailData.beginDate }}
								</a-form-item>
							</a-row>
						</a-col>
						<a-col span="6">
							<a-row>
								<a-form-item label="资金类型">
									{{ detailData.bankProductName }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="已用敞口（元）">
									<a-tooltip>
										<template slot="title"> 已用敞口=融资余额-保证金总额 </template>
										<a-icon
											type="exclamation-circle"
											style="margin-left: 5px; position: absolute; top: -38px; left: 100px"
										/>
									</a-tooltip>
									{{ detailData.sumUseexpAmount || '-' }}
								</a-form-item>
							</a-row>
							<a-row>
								<a-form-item label="到期日期">
									{{ detailData.endDate }}
								</a-form-item>
							</a-row>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="new-detail-content">
				<h2>入池资产信息</h2>
				<div class="gray-title">
					应收账款有效净额（元）：<span class="desc">{{
						ruchiDataSource.reduce((pre, cur) => pre + cur.aramt || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;应收账款可抵敞口（元）：<span class="desc">{{
						ruchiDataSource.reduce((pre, cur) => pre + cur.finMaxAmount || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;应收账款逾期金额（元）：<span class="desc">{{
						ruchiDataSource.reduce((pre, cur) => pre + cur.dueAramt || 0, 0).toFixed(2)
					}}</span>
				</div>
				<a-table
					class="new-table"
					:columns="ruchiColumn"
					:dataSource="ruchiDataSource"
					:pagination="false"
					rowKey="number"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</div>
			<div class="new-detail-content">
				<h2>应收资产明细信息</h2>
				<a-table
					class="new-table"
					:columns="assetsColumn"
					:dataSource="assetsDataSource"
					:pagination="false"
					rowKey="number"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
					<div
						slot="assetNo"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							v-if="record.assetId"
							@click="goAssets(record)"
							>{{ text }}</a
						>
						<span v-else>{{ text }}</span>
					</div>
					<div
						slot="statusText"
						slot-scope="text, record"
					>
						<span
							v-if="text == '已入池'"
							class="has"
							>{{ text }}</span
						>
						<span
							v-else
							class="no-has"
							>{{ text }}</span
						>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getAccountReceivableList"
				/>
			</div>
			<div class="new-detail-content">
				<h2>未结清授信列表</h2>
				<div class="gray-title">
					融资余额（元）：<span class="desc">{{
						weiDataSource.reduce((pre, cur) => pre + cur.putAmount || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;保证金金额（元）：<span class="desc">{{
						weiDataSource.reduce((pre, cur) => pre + cur.assAmount || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;
				</div>
				<a-table
					class="new-table"
					:columns="weiColumn"
					:dataSource="weiDataSource"
					:pagination="false"
					rowKey="number"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</div>
			<div class="new-detail-content">
				<h2>放款中的授信列表</h2>
				<div class="gray-title">
					放款金额（元）：<span class="desc">{{
						fangDataSource.reduce((pre, cur) => pre + cur.putAmount || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;保证金金额（元）：<span class="desc">{{
						fangDataSource.reduce((pre, cur) => pre + cur.assAmount || 0, 0).toFixed(2)
					}}</span
					>&nbsp;&nbsp;占用敞口（元）：<span class="desc">{{
						fangDataSource.reduce((pre, cur) => pre + cur.expAmount || 0, 0).toFixed(2)
					}}</span>
				</div>
				<a-table
					class="new-table"
					:columns="fangColumn"
					:dataSource="fangDataSource"
					:pagination="false"
					rowKey="number"
					:scroll="{ x: true }"
					:locale="{ emptyText: '暂无数据' }"
				>
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
import {
	API_GetAssetsPoolZhangDetail,
	API_GetAssetsPoolZhangListDetail,
	API_GetAssetsPoolZhangSync
} from '@/v2/center/assets/api/index.js';
import _ from 'lodash';
import moment from 'moment';
import ENV from '@/v2/config/env';
import iPagination from "@sub/components/iPagination";

import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			moment,
			BASE_NET: ENV.BASE_NET,
			baseForm: this.$form.createForm(this),
			filterCodeByValueName: filterCodeByValueName,
			detailData: {}, // 详情数据

			params: {
				pageSize: 1,
				pageNo: 1
			},
			ruchiDataSource: [],
			ruchiColumn: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 70,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
				{ title: '应收账款有效净额（元）', dataIndex: 'aramt', key: 'aramt' },
				{ title: '融资比例（%）', dataIndex: 'rate', key: 'rate' },
				{ title: '应收账款可抵敞口（元）', dataIndex: 'finMaxAmount', key: 'finMaxAmount' },
				{ title: '应收账款逾期金额（元）', dataIndex: 'dueAramt', key: 'dueAramt' }
			],
			assetsColumn: [
				{
					title: '应收账款流水号',
					dataIndex: 'assetNo',
					key: 'assetNo',
					fixed: 'left',
					scopedSlots: { customRender: 'assetNo' }
				},
				{ title: '买方名称', dataIndex: 'buyerName', key: 'buyerName' },
				{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
				{ title: '应收账款金额', dataIndex: 'amount', key: 'amount' },
				{ title: '应收账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
				{ title: '应收账款到期日期', dataIndex: 'endDate', key: 'endDate' },
				{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
				{ title: '应收款类型', dataIndex: 'invoiceFlagText', key: 'invoiceFlagText' },
				{ title: '入池状态', dataIndex: 'statusText', key: 'statusText', scopedSlots: { customRender: 'statusText' } }
			],
			assetsDataSource: [],
			weiColumn: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 70,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{ title: '融资品种', dataIndex: 'finNo', key: 'finNo' },
				{ title: '银行融资申请编号', dataIndex: 'applyNo', key: 'applyNo' },
				{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate' },
				{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
				{ title: '融资余额（元）', dataIndex: 'putAmount', key: 'putAmount' },
				{ title: '保证金金额（元）', dataIndex: 'assAmount', key: 'assAmount' }
			],
			weiDataSource: [],
			fangColumn: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 70,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{ title: '融资品种', dataIndex: 'finNo', key: 'finNo' },
				{ title: '银行融资申请编号', dataIndex: 'applyNo', key: 'applyNo' },
				{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate' },
				{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
				{ title: '放款金额（元）', dataIndex: 'putAmount', key: 'putAmount' },
				{ title: '保证金金额（元）', dataIndex: 'assAmount', key: 'assAmount' },
				{ title: '占用敞口（元）', dataIndex: 'expAmount', key: 'expAmount' }
			],
			fangDataSource: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			fileListDataSource: []
		};
	},
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		})
	},
	mounted: function () {
		API_GetAssetsPoolZhangDetail().then(res => {
			if (res.success) {
				this.detailData = res.data;
				this.ruchiDataSource = this.detailData.poolBuyerList || [];
				this.weiDataSource = this.detailData.unPayoffList || [];
				this.fangDataSource = this.detailData.loanList || [];

				this.getAccountReceivableList();
			}
		});
	},
	methods: {
		sync() {
			API_GetAssetsPoolZhangSync().then(res => {
				if (res.success) {
					window.location.reload();
				}
			});
		},

		getAccountReceivableList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_GetAssetsPoolZhangListDetail({
				...this.params,
				creditId: this.detailData.id
			}).then(res => {
				if (!res.success) {
					return;
				}
				this.assetsDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		goAssets(items) {
			const { href } = this.$router.resolve({
				path: '/center/assets/pool/manage/detail',
				query: {
					id: items.assetId,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.new-detail-content {
	background: #fff;
	.gray-title {
		color: #8495aa;
		margin-bottom: 14px;
		.desc {
			color: rgba(0, 0, 0, 0.8);
			margin-right: 80px;
		}
	}
	h2 {
		.gray-title {
			color: #8495aa;
			font-size: 13px;
			margin-left: 20px;
			font-weight: normal;
		}
	}
}
.has {
	color: #f59a0c;
	background: #fef7e6;
	border-radius: 4px;
	padding-left: 13px;
	padding-right: 13px;
	padding-top: 4px;
	padding-bottom: 4px;
}
.no-has {
	color: #38b181;
	background: #f2fdf8;
	border-radius: 4px;
	padding-left: 13px;
	padding-right: 13px;
	padding-top: 4px;
	padding-bottom: 4px;
}
</style>
