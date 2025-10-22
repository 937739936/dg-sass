<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>客户信息详情</span
			>
			<div class="info">
				<a-form-model
					:model="formData"
					ref="formData"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 14 }"
				>
					<div class="info-item">
						<p class="title">
							{{ formData.name }}
							<span class="bg">{{ formData.type }}</span>
						</p>
						<p>
							<span v-if="formData.abbreviation">企业简称：{{ formData.abbreviation }}&nbsp;&nbsp;</span>
							<span v-if="formData.legalPersonName">法定代表人：{{ formData.legalPersonName }}&nbsp;&nbsp;</span>
							<span v-if="formData.creditCode">统一社会信用代码：{{ formData.creditCode }}</span>
						</p>
					</div>
					<div class="info-item">
						<p class="title">工商信息</p>
						<table
							cellspacing="0"
							cellpadding="0"
							class="modalTable"
							style="margin-bottom: 20px"
						>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									企业名称
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.name }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									统一社会信用代码
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.creditCode }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									法定代表人
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.legalPersonName }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									成立日期
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.establishDate }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									注册资本
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.registerCap }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									实缴资本
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.recCap }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									企业类型
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.econKind }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									营业期限
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.termStart }}&nbsp;至&nbsp;
									<template v-if="customerData.business.termEndDateIsLongValid"> 无固定期限 </template>
									<template v-else>
										{{ customerData.business.termEnd }}
									</template>
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									工商注册号
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.no }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									组织机构代码
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.orgNo }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									所属地区
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.area }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									所属行业
								</td>
								<td
									colspan="6"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.industry }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									注册地址
								</td>
								<td
									colspan="16"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.address }}
								</td>
							</tr>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									经营范围
								</td>
								<td
									colspan="16"
									class="left"
									v-if="customerData.business"
								>
									{{ customerData.business.scope }}
								</td>
							</tr>
						</table>
					</div>
					<div class="info-item">
						<p class="title">客户负责人信息</p>
						<table
							cellspacing="0"
							cellpadding="0"
							class="modalTable"
							style="margin-bottom: 20px"
						>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									负责人姓名
								</td>
								<td
									colspan="6"
									class="left"
								>
									{{ formData.headName }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									负责人电话
								</td>
								<td
									colspan="6"
									class="left"
								>
									{{ formData.headMobile }}
								</td>
							</tr>
						</table>
					</div>
					<div class="info-item">
						<p class="title">联系人信息</p>
						<table
							cellspacing="0"
							cellpadding="0"
							class="modalTable"
							style="margin-bottom: 20px"
						>
							<tr>
								<td
									colspan="4"
									class="bgTitle"
								>
									联系人姓名
								</td>
								<td
									colspan="6"
									class="left"
								>
									{{ customerData.linkMan.name }}
								</td>
								<td
									colspan="4"
									class="bgTitle"
								>
									联系人电话
								</td>
								<td
									colspan="6"
									class="left"
								>
									{{ customerData.linkMan.mobile }}
								</td>
							</tr>
						</table>
					</div>
					<div
						class="info-item"
						v-if="actualControllerData.length > 0"
					>
						<p class="title">疑似实控人（大数据分析）</p>
						<a-table
							style="width: 100%"
							rowKey="id"
							:scroll="{ x: true }"
							:columns="actualControllerColumns"
							:pagination="actualControllerpagination"
							:dataSource="actualControllerData"
							@change="actualControllerPaginationChange"
							:locale="{ emptyText: '暂无数据' }"
						>
							<template
								slot="name"
								slot-scope="item, record"
							>
								<span
									class="radiusSpan"
									id="radiusSpanTarget0"
									>{{ record.name.substr(0, 1) }}</span
								>
								{{ record.name }}
							</template>

							<template
								slot="amount"
								slot-scope="amount, record"
							>
								<div
									v-for="(item, index) in record.paths"
									:key="index"
								>
									<p>
										<strong>股权路径{{ index + 1 }}</strong>
									</p>
									<span>{{ item.name }}</span>
									<span
										v-for="(pro, order) in item.itemList"
										:key="order"
										class="treeBody"
									>
										<span class="arrow">
											<em>{{ pro.percent }}</em>
										</span>
										{{ pro.node }}
									</span>
								</div>
							</template>
						</a-table>
					</div>
					<div
						class="info-item"
						v-if="pubStockData.length > 0 || regStockData.length > 0"
					>
						<p class="title">股东信息</p>
						<a-tabs
							:default-active-key="activeKey"
							@change="tabsChange"
						>
							<a-tab-pane
								key="1"
								tab="最新公示"
							>
								<a-table
									style="width: 100%"
									rowKey="id"
									:scroll="{ x: true }"
									:columns="pubStockColumns"
									:pagination="pubStockpagination"
									:dataSource="pubStockData"
									@change="pubPaginationChange"
									:locale="{ emptyText: '暂无数据' }"
								>
									<template
										slot="stockName"
										slot-scope="item, record, index"
									>
										<span
											class="radiusSpan"
											:id="'radiusSpan' + index"
											>{{ record.stockName.substr(0, 1) }}</span
										>
										{{ record.stockName }}
									</template>
								</a-table>
							</a-tab-pane>
							<a-tab-pane
								key="2"
								tab="工商登记"
							>
								<a-table
									style="width: 100%"
									rowKey="id"
									:scroll="{ x: true }"
									:columns="regStockColumns"
									:pagination="regStockpagination"
									:dataSource="regStockData"
									@change="regPaginationChange"
									:locale="{ emptyText: '暂无数据' }"
								>
									<template
										slot="stockName"
										slot-scope="item, record, index"
									>
										<span
											class="radiusSpan"
											:id="'radiusSpanTwo' + index"
											>{{ record.stockName.substr(0, 1) }}</span
										>
										{{ record.stockName }}
									</template>
								</a-table>
							</a-tab-pane>
						</a-tabs>
					</div>
					<div class="info-item">
						<p class="title">纳税信息</p>

						<a-table
							rowKey="id"
							:scroll="{ x: true }"
							:columns="columns"
							:pagination="false"
							:dataSource="taxListData"
							:locale="{ emptyText: '暂无数据' }"
						>
							<template
								slot="operation"
								class="table-operation"
								slot-scope="record"
							>
								<a-space :size="10">
									<a
										@click="
											jumpPage('/center/account/company/tax/detail', {
												id: record.id
											})
										"
										>查看</a
									>
								</a-space>
							</template>
						</a-table>
						<i-pagination
							:pagination="pagination"
							@change="handleTableChange"
						/>
					</div>
				</a-form-model>
			</div>
			<a-row
				type="flex"
				justify="center"
			>
				<a-button
					ghost
					type="primary"
					@click="$router.go(-1)"
					>返回</a-button
				>
			</a-row>
		</a-card>
	</div>
</template>

<script>
import {
	API_COMPANYCUSTOMERTYPEID,
	API_CompanyCustomerNews,
	API_CompanyCustomerRegister,
	API_CompanyActualController,
	API_CompanyCustomerInfo,
	API_COMPANYTAX
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";

export default {
	components: {
		iPagination
	},
	data() {
		return {
			formData: {},
			taxListData: [],
			columns: [
				{
					title: '申报年度',
					dataIndex: 'year',
					key: 'year',
					customRender: text => {
						return text ? text + '年' : '';
					}
				},
				{
					title: '税种',
					dataIndex: 'taxCategoryDesc',
					key: 'taxCategoryDesc'
				},
				{
					title: '税种所属期间',
					dataIndex: 'taxPeriodStart',
					key: 'taxPeriodStart',
					customRender: (text, r) => {
						return text + '至' + r.taxPeriodEnd;
					}
				},
				{
					title: '实缴(退)金额',
					dataIndex: 'amount',
					key: 'amount',
					customRender: text => {
						let sum = text ? (text % 1 == 0 ? text.toLocaleString() + '.00' : text.toLocaleString()) : text;
						return `￥ ${sum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
					}
				},
				{
					title: '操作',
					key: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					align: 'center'
				}
			],
			id: '',
			customerData: {
				business: {},
				linkMan: {}
			},
			activeKey: '1',
			actualControllerColumns: [
				{
					title: '实际控制人名称',
					dataIndex: 'name',
					key: 'name',
					align: 'center',
					scopedSlots: {
						customRender: 'name'
					}
				},
				{ title: '总持股比例', dataIndex: 'percent', key: 'percent', align: 'center' },
				{
					title: '股权链',
					dataIndex: 'amount',
					key: 'amount',
					width: '60%',
					scopedSlots: {
						customRender: 'amount'
					}
				}
			],
			actualControllerParams: {},
			actualControllerData: [], // 实控人数据
			actualControllerpagination: {
				size: 'small',
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
				defaultPageSize: 10,
				current: 1,
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]}共${total}条`;
				},
				hideOnSinglePage: true
			},
			pubStockColumns: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '股东名称',
					key: 'stockName',
					scopedSlots: {
						customRender: 'stockName'
					}
				},
				{ title: '持股比例', dataIndex: 'stockPercent', key: 'stockPercent' },
				{ title: '持股数（股）', dataIndex: 'amount', key: 'amount' }
			],
			pubStockParams: {},
			pubStockData: [],
			pubStockpagination: {
				size: 'small',
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
				defaultPageSize: 10,
				current: 1,
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]}共${total}条`;
				},
				hideOnSinglePage: true
			},
			regStockColumns: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '发起人及出资信息',
					dataIndex: 'stockName',
					key: 'stockName',
					scopedSlots: {
						customRender: 'stockName'
					}
				},
				{ title: '持股比例', dataIndex: 'stockPercent', key: 'stockPercent' },
				{ title: '认缴出资额(万元)', dataIndex: 'shouldCapi', key: 'shouldCapi' },
				{ title: '认缴出资日期', dataIndex: 'shoudDate', key: 'shoudDate' },
				{ title: '参股日期', dataIndex: 'stakeDate', key: 'stakeDate' }
			],
			regStockParams: {},
			regStockData: [],
			regStockpagination: {
				size: 'small',
				showSizeChanger: true,
				showQuickJumper: true,
				total: 0,
				defaultPageSize: 10,
				current: 1,
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]}共${total}条`;
				},
				hideOnSinglePage: true
			},
			typeList: [], //客户类别
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			}
		};
	},
	created() {
		this.id = this.$route.query.id;
		if (this.id) {
			this.getDetail();
			this.getPubStockList();
			this.getActualController();
		} else {
			//如果没有id为异常，返回列表
			this.$router.push('/center/account/company/customer');
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		//加载详情
		async getDetail() {
			await API_COMPANYCUSTOMERTYPEID(this.id).then(res => {
				if (res.success) {
					this.formData = res.data;
					this.getTaxDetail();
				}
			});
			await API_CompanyCustomerInfo(this.id).then(res => {
				if (res.success) {
					this.customerData = res.data;
				}
			});
		},
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getTaxDetail();
		},
		getTaxDetail() {
			//加载纳税详情
			API_COMPANYTAX({ ...this.pagination, uscc: this.formData.creditCode }).then(res => {
				if (res.success) {
					this.taxListData = res.data.content;
					this.pagination.total = res.data?.totalElements;
				}
			});
		},

		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},

		tabsChange(index) {
			this.activeKey = index;
			if (index === '1') {
				this.getPubStockList();
			} else {
				this.getRegStockList();
			}
		},
		async getPubStockList() {
			//股东信息-最新公示
			this.pubStockParams.pageNo = this.pubStockpagination.current;
			this.pubStockParams.pageSize = this.pubStockpagination.pageSize;
			this.pubStockParams.id = this.id;
			await API_CompanyCustomerNews(this.pubStockParams).then(res => {
				this.pubStockData = res.data.content;
				if (this.pubStockData.length > 0) {
					if (this.pubStockData[0].holdType === 1) {
						this.pubStockColumns[this.pubStockColumns.length - 1] = { title: '持股数（股）', dataIndex: 'amount', key: 'amount' };
					} else {
						this.pubStockColumns[this.pubStockColumns.length - 1] = { title: '持股数（元）', dataIndex: 'amount', key: 'amount' };
					}
				}
				this.pubStockpagination.total = res.data.totalElements;
				setTimeout(() => {
					this.getColor(this.pubStockData, 'radiusSpan');
				}, 0);
			});
		},
		async getRegStockList() {
			//股东信息-工商登记
			this.regStockParams.pageNo = this.regStockpagination.current;
			this.regStockParams.pageSize = this.regStockpagination.pageSize;
			this.regStockParams.id = this.id;
			await API_CompanyCustomerRegister(this.regStockParams).then(res => {
				this.regStockData = res.data.content;
				this.regStockpagination.total = res.data.totalElements;
			});
			setTimeout(() => {
				this.getColor(this.regStockData, 'radiusSpanTwo');
			}, 0);
		},
		async getActualController() {
			// 获取实控人
			await API_CompanyActualController(this.id).then(res => {
				this.actualControllerData = this.formatData(res.data || []);
				setTimeout(() => {
					this.getColor(this.actualControllerData, 'radiusSpanTarget');
				}, 0);
			});
		},
		formatData(data) {
			let finalArr = [];
			if (data.length) {
				data.forEach(item => {
					let path = item.paths;
					let obj = {};
					(obj.name = item.name), (obj.percent = item.percent), (obj.paths = []);
					if (path.length) {
						try {
							path.forEach((pro, index) => {
								let pathsObj = {
									percent: item.percent,
									name: item.name,
									itemList: []
								};
								pathsObj.itemList = path.filter(target => Number(target.nextNode) === index + 1);
								if (pathsObj.itemList.length) {
									obj.paths.push(pathsObj);
								} else {
									finalArr.push(obj);
									throw '终止循环';
								}
							});
						} catch (e) {
							console.error('e');
						}
					}
				});
			}
			return finalArr;
		},
		// 分页组件回调事件
		pubPaginationChange() {
			this.getPubStockList();
		},

		// 分页组件回调事件
		regPaginationChange() {
			this.getRegStockList();
		},

		// 分页组件回调事件
		actualControllerPaginationChange() {
			this.getActualController();
		},

		getColor(data, target) {
			// 获取随机背景颜色
			for (let i = 0; i < data.length; i++) {
				var arr = ['#D5C6E9', '#E6BF76', '#EB997F', '#8499DF', '#98DBC1', '#93D8EF'];
				var n = Math.floor(Math.random() * arr.length + 1) - 1;
				let obj = document.getElementById(target + i);
				obj.style.backgroundColor = arr[n];
			}
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.info {
	background: #ffffff;
	margin-top: 20px;
	.info-item {
		margin-bottom: 30px;
		::v-deep .ant-descriptions-item-label {
			text-align: right;
			font-size: 14px;
			color: #999999;
			min-width: 130px;
		}
		::v-deep .ant-descriptions-item-content {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			text-align: left;
			max-width: calc(100% - 130px);
		}
		.title {
			margin-bottom: 10px;
			padding-bottom: 0;
			font-size: 14px;
			font-weight: 600;
		}
		.bg {
			display: inline-block;
			background: @primary-color;
			height: 30px;
			line-height: 30px;
			padding: 0 20px;
			font-size: 14px;
			color: #fff;
			font-weight: normal;
			border-radius: 15px;
		}
	}
}
.modalTable {
	width: 100%;
	height: 100%;
	border: 1px solid #ccc; /*设置边框粗细，实线，颜色*/
	text-align: center; /*文本居中*/
	border-collapse: collapse; /*边框重叠，否则你会看到双实线*/
	table-layout: fixed;
	th,
	td {
		height: 32px;
		border: 1px solid #ccc;
		color: rgba(0, 0, 0, 0.65);
		padding: 10px 6px;
	}
	.left {
		text-align: left;
		p {
			color: @primary-color;
			span {
				display: inline-block;
				width: 110px;
				color: rgba(0, 0, 0, 0.65);
			}
		}
	}
	.blue {
		color: @primary-color;
	}
}
.radiusSpan {
	display: inline-block;
	width: 30px;
	height: 30px;
	border-radius: 5px;
	color: #fff;
	line-height: 30px;
	text-align: center;
}
.treeBody {
	display: inline-block;
	margin: 5px 0;
	.arrow {
		margin: 0 10px;
		font-size: 10px;
		width: 78px;
		display: inline-block;
		text-align: center;
		position: relative;
		background: url(~assets/imgs/hold_arrow.png) no-repeat;
		background-position: 50%;
		em {
			position: relative;
			top: -8px;
			font-style: normal;
			color: #2972fa;
		}
	}
}
.bgTitle {
	background: #f7f8fa;
}
</style>
