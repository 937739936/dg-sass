<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>全业务线查看</span
				>
			</div>
			<a-tabs :default-active-key="1">
				<a-tab-pane
					tab="煤炭"
					:key="1"
					forceRender
				>
					<div style="width: 100%">
						<div
							class="company-name-box"
							v-if="capitalFlag"
						>
							<img
								src="@/v2/assets/imgs/monitoring/company.png"
								alt=""
								style="width: 36px; height: 36px"
							/>
							<a-dropdown
								style="margin-left: 10px"
								:trigger="['click']"
								v-if="capitalCompany.length > 1"
							>
								<span style="cursor: pointer">
									<span style="display: inline-block; margin-right: 12px">{{ capitalCompanyName }}</span>
									<template>
										<img
											src="@/v2/assets/imgs/monitoring/change-company.png"
											alt=""
											style="width: 12px; height: 12px; margin-bottom: 2px"
										/>
										<span style="color: #0053db; display: inline-block; margin-left: 3px">切换公司</span>
									</template>
								</span>
								<a-menu slot="overlay">
									<a-menu-item
										v-for="(items, index) in capitalCompany"
										:key="index"
									>
										<a
											href="javascript:;"
											@click="changeCompany(items)"
											>{{ items.companyName }}</a
										>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
							<span
								style="margin-left: 10px"
								v-if="capitalCompany.length == 1"
								>{{ capitalCompanyName }}</span
							>
						</div>

						<div class="custom-card-title">
							<SlFormNew
								:list="searchList"
								layout="inline"
								@change="handleChange"
								@resetFunc="resetFunc"
							></SlFormNew>
							<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
								<a-table
									:columns="columns"
									rowKey="id"
									:dataSource="dataSource"
									:pagination="false"
									:loading="loading"
									:scroll="{ x: true }"
									class="new-table"
								>
									<template
										slot="action"
										slot-scope="record"
									>
										<a-button
											type="link"
											@click="jumpPage(record)"
											>查看</a-button
										>
									</template>
								</a-table>
								<i-pagination
									:pagination="pagination"
									@change="getList"
									v-show="params.pageSize < pagination.total"
								/>
							</div>
						</div>
					</div>
				</a-tab-pane>
				<a-tab-pane
					tab="钢材"
					:key="2"
					forceRender
				>
					<SteelFullBusinessLineList></SteelFullBusinessLineList>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import {
	API_FullBusinessLineList,
	API_FullBusinessLineBankPage,
	API_GetCCSDynamicMonitoringListCompany
} from '@/v2/center/monitoring/api/index';
import iPagination from "@sub/components/iPagination";
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import SteelFullBusinessLineList from './steel/SteelFullBusinessLineList.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		})
	}
];
export default {
	mixins: [ListMixin],
	name: 'FullBusinessLineList',
	components: {
		iPagination,
		SteelFullBusinessLineList
	},
	data() {
		return {
			getPopupContainer,
			searchList,
			capitalFlag: '', // 是否是资方
			columns: [
				{ title: '煤种', dataIndex: 'coalType' },
				{ title: '交易参与企业', dataIndex: 'companyAbbreviation', width: 350 },
				{ title: '合同编号', dataIndex: 'contractNo', width: 350 },
				{ title: '完结状态', dataIndex: 'status' },
				{
					title: '操作',
					scopedSlots: { customRender: 'action' },
					fixed: 'right'
				}
			],
			dataSource: [],
			params: {},
			loading: false,
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			},
			capitalCompanyUscc: '',
			capitalCompany: [],
			capitalCompanyName: '',
			selfLoad: true,
			url: {
				list: API_FullBusinessLineList
			}
		};
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	mounted() {
		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.capitalFlag = companyType == 'FINANCIAL_ORG';
		if (this.capitalFlag) {
			this.searchParams.companyUscc = this.capitalCompanyUscc;
		}
		this.url.list = this.capitalFlag ? API_FullBusinessLineBankPage : API_FullBusinessLineList;
		API_GetCCSDynamicMonitoringListCompany({
			bankUscc: this.VUEX_ST_COMPANYSUER.companyUscc
		}).then(res => {
			const d = (res.data || []).map(item => ({
				companyName: item.name,
				companyUscc: item.uscc
			}));

			this.capitalCompanyUscc = d[0] ? d[0].companyUscc : '';
			this.capitalCompanyName = d[0] ? d[0].companyName : '';
			this.capitalCompany = d;

			this.searchParams.companyUscc = this.capitalCompanyUscc;
			if (this.capitalFlag && this.capitalCompanyUscc == '') {
				this.$message.error('请在后台进行数据监控配置！');
				return;
			}

			this.getList();
		});
	},

	methods: {
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			if (this.capitalFlag) {
				this.searchParams.companyUscc = this.capitalCompanyUscc;
			}
			this.changeSearch(this.searchParams);
		},

		changeCompany(items) {
			// 切换企业账号
			this.capitalCompanyName = items.companyName;
			this.capitalCompanyUscc = items.companyUscc;
			if (this.capitalFlag) {
				this.searchParams.companyUscc = this.capitalCompanyUscc;
			}
			this.getList();
		},

		resetFunc() {
			this.searchParams = {
				coreCompanyId: this.searchParams.coreCompanyId
			};
			if (this.capitalFlag) {
				this.searchParams.companyUscc = this.capitalCompanyUscc;
			}
			this.pagination.pageNo = 1;
			this.getList();
		},

		jumpPage(record) {
			let id = record.id;
			let businessLineNo = record.businessLineNo ? record.businessLineNo.split(',') : [];
			businessLineNo = businessLineNo[businessLineNo.length - 1];
			this.$router.push({
				path: '/center/monitoring/fullBusinessLine/detail',
				query: {
					id,
					businessLineNo
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.custom-card-title {
	width: 100%;
}
.company-name-box {
	margin-top: 20px;
	::v-deep.ant-select {
		width: 200px;
	}
}
</style>
