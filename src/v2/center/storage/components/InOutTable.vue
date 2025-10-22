<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				v-if="!isMonitor"
			>
				<span
					slot="title"
					class="slTitle"
					>{{ typeText[type] }}管理</span
				>
			</div>
			<SlFormNew
				v-if="!isMonitor"
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:columns="columns"
					rowKey="index"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="attachmentExist"
						slot-scope="text"
					>
						<span
							class="g"
							v-if="text"
							>有</span
						>
						<span
							class="r"
							v-else
							>无</span
						>
					</template>
					<span
						slot="receiverName"
						slot-scope="receiverName"
					>
						{{ receiverName || '-' }}
					</span>
					<span slot="customTitle"> 操作 </span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<template v-if="type == 'in'">
							<a
								v-auth="'warehouse:putManage:view'"
								style="margin-right: 10px"
								@click="jumpPage('detail', item)"
								>查看</a
							>

							<template v-if="!isMonitor">
								<a
									v-auth="'warehouse:putManage:edit'"
									@click="jumpPage('creat', item)"
									>编辑</a
								>
							</template>
						</template>
						<template v-if="type == 'out'">
							<a
								v-auth="'warehouse:outManage:view'"
								style="margin-right: 10px"
								@click="jumpPage('detail', item)"
								>查看</a
							>
							<template v-if="!isMonitor">
								<a
									v-auth="'warehouse:outManage:edit'"
									@click="jumpPage('creat', item)"
									>编辑</a
								>
							</template>
						</template>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import {
	API_WarehousePutPage,
	API_WarehouseOutPage,
	API_GrainSituationWarehouseGoodsPutPage,
	API_GrainSituationWarehouseGoodsOutPage,
	API_GrainSituationGetCoreCompanyList
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	name: 'InOutTable',
	props: {
		type: {
			type: String,
			default: 'in'
		},
		columnsIndex: {
			type: Number,
			default: 0
		},
		isMonitor: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			getPopupContainer,
			coreCompanyList: [],
			func: [
				API_WarehousePutPage,
				API_WarehouseOutPage,
				API_GrainSituationWarehouseGoodsPutPage,
				API_GrainSituationWarehouseGoodsOutPage
			],
			colSpan: 8,
			monitor: '',
			typeText: {
				in: '入库',
				out: '出库'
			},
			dataSource: [],
			isAbnormalCollection: false,
			storageTime: null,
			flag: false,
			menuType: '',
			loading: false,
			url: {
				list: ''
			},
			selfLoad: true,
			searchList: []
		};
	},

	components: {
		iPagination
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},

	created() {
		this.searchList = this.renderType(this.type, this.VUEX_ST_COMPANYSUER.companyType);
		this.columnsList = [
			[
				{
					title: '入库流水号',
					dataIndex: 'serialNumber',
					width: 135
				},
				{
					title: '入库时间',
					dataIndex: 'storageTime',
					customRender: item => {
						return item && item.slice(0, 10);
					},
					width: 135
				},
				{
					title: '粮食名称',
					dataIndex: 'grainName',
					width: 100
				},
				{
					title: '粮食等级',
					dataIndex: 'grainLevel',
					width: 100
				},
				{
					title: '商品数量(KG)',
					dataIndex: 'clearingWeight',
					width: 130,
					customRender: item => {
						return item && item.toLocaleString();
					}
				},
				{
					title: '结算金额',
					dataIndex: 'clearingPrice',
					width: 120,
					customRender: item => {
						return item && '¥' + item.toLocaleString();
					}
				},
				/* {
            title: '仓储企业',
            dataIndex: 'storageCompany',
            width: 150,
            colSpan: (this.VUEX_ST_COMPANYSUER.coreCompanyType == 23 ||
                  this.VUEX_ST_COMPANYSUER.coreCompanyType == 5 ||
                  this.VUEX_ST_COMPANYSUER.coreCompanyType == 0) ? 1 : 0
          },
          {
            title: '权属企业',
            dataIndex: 'coreCompany',
            width: 150,
            colSpan: this.VUEX_ST_COMPANYSUER.coreCompanyType == 7 ? 1 : 0
          }, */
				{
					title: '库点',
					dataIndex: 'depotPoint',
					width: 150
				},
				{
					title: '仓房',
					dataIndex: 'storehouse',
					width: 80
				},
				{
					title: '收款人',
					dataIndex: 'payee',
					width: 100
				},
				{
					title: '结算方式',
					dataIndex: 'clearingForm',
					width: 100
				},
				/* {
            title: '确认单编号',
            dataIndex: 'pa',
            width: 150
          },
          {
            title: '合同编号',
            dataIndex: 'nk',
            width: 150
          }, */
				// {
				//   title: '仓单方式',
				//   dataIndex: 'p',
				//   width: 150
				// },
				// {
				//   title: '仓单编号',
				//   dataIndex: 'pa',
				//   width: 150
				// },
				{
					title: '有无附件',
					dataIndex: 'attachmentExist',
					width: 100,
					scopedSlots: { customRender: 'attachmentExist' }
				},
				{
					key: 'action',
					slots: { title: 'customTitle' },
					width: 100,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			[
				{
					title: '出库流水号',
					dataIndex: 'serialNumber',
					width: 135
				},
				{
					title: '出库时间',
					dataIndex: 'storageTime',
					width: 135
				},
				{
					title: '粮食名称',
					dataIndex: 'grainName',
					width: 100
				},
				{
					title: '粮食等级',
					dataIndex: 'grainLevel',
					width: 100
				},
				{
					title: '商品数量(KG)',
					dataIndex: 'clearingWeight',
					width: 130,
					customRender: item => {
						return item && item.toLocaleString();
					}
				},
				{
					title: '库点',
					dataIndex: 'depotPoint',
					width: 150
				},
				{
					title: '仓房',
					dataIndex: 'storehouse',
					width: 80
				},
				// {
				//   title: '权属企业',
				//   dataIndex: 'coreCompany',
				//   width: 150,
				//   colSpan: this.VUEX_ST_COMPANYSUER.coreCompanyType == 7 ? 1 : 0
				// },
				{
					title: '有无附件',
					dataIndex: 'attachmentExist',
					width: 100,
					scopedSlots: { customRender: 'attachmentExist' }
				},
				{
					key: 'action',
					slots: { title: 'customTitle' },
					width: 100,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			[
				{
					title: '入库流水号',
					dataIndex: 'serialNumber',
					width: 135
				},
				{
					title: '入库时间',
					dataIndex: 'storageTime',
					width: 135
				},
				{
					title: '粮食名称',
					dataIndex: 'grainName',
					width: 100
				},
				{
					title: '粮食等级',
					dataIndex: 'grainLevel',
					width: 100
				},
				{
					title: '商品数量(KG)',
					dataIndex: 'clearingWeight',
					width: 130,
					customRender: item => {
						return item && item.toLocaleString();
					}
				},
				{
					title: '结算金额',
					dataIndex: 'clearingPrice',
					width: 120,
					customRender: item => {
						return item && '¥' + item.toLocaleString();
					}
				},

				{
					title: '收款人',
					dataIndex: 'payee',
					width: 100
				},
				{
					title: '结算方式',
					dataIndex: 'clearingForm',
					width: 100
				},
				{
					key: 'action',
					slots: { title: 'customTitle' },
					width: 100,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			[
				{
					title: '出库流水号',
					dataIndex: 'serialNumber',
					width: 135
				},
				{
					title: '出库时间',
					dataIndex: 'storageTime',
					width: 135
				},
				{
					title: '粮食名称',
					dataIndex: 'grainName',
					width: 100
				},
				{
					title: '粮食等级',
					dataIndex: 'grainLevel',
					width: 100
				},
				{
					title: '商品数量(KG)',
					dataIndex: 'clearingWeight',
					width: 130,
					customRender: item => {
						return item && item.toLocaleString();
					}
				},
				{
					key: 'action',
					slots: { title: 'customTitle' },
					width: 100,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			]
		];
		// 入库贸易商平台-仓储企业，仓储平台-权属企业，金融机构-仓储企业

		// 出库贸易商-仓储企业，仓储平台-权属企业，金融机构-仓储企业

		if (this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE') {
			// 仓储平台
			const coreCompanyColumn = {
				title: '权属企业',
				dataIndex: 'coreCompany',
				width: 150
			};
			this.columnsList[0].splice(7, 0, coreCompanyColumn);
			this.columnsList[1].splice(7, 0, coreCompanyColumn);
		}

		if (['FINANCIAL_ORG', 'TRADER', 'CORE_COMPANY'].includes(this.VUEX_ST_COMPANYSUER.companyType)) {
			const storageCompanyColumn = {
				title: '仓储企业',
				dataIndex: 'storageCompany',
				width: 150
			};
			this.columnsList[0].splice(5, 0, storageCompanyColumn);
			this.columnsList[1].splice(5, 0, storageCompanyColumn);
		}
		this.columns = this.columnsList[this.columnsIndex];
	},

	mounted() {
		// 如果是金融机构
		if (this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG' && !this.isMonitor) {
			this.getGetCoreCompanyList();
			return;
		}
		// 否则直接
		if (this.isMonitor) {
			this.searchParams = {
				...this.searchParams,
				storehouseId: this.$route.query.id,
				// 如果是金融机构并且是监控模块
				coreCompanyId:
					this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG' && this.isMonitor
						? this.$route.query.coreCompanyId
						: this.VUEX_ST_PERSONALLINFO.curCompanyId // ？？当前所选企业？
			};
		}
		this.searchParams.batchId = this.$route.query.batchId;
		if (this.searchParams.attachmentExist) {
			this.searchParams.attachmentExist = this.searchParams.attachmentExist == 1;
		}
		this.url.list = this.func[this.columnsIndex];
		this.getList();
	},

	methods: {
		handleChange(data) {
			if (data.attachmentExist) {
				data.attachmentExist = data.attachmentExist == 1;
			}
			this.changeSearch(data);
		},
		getGetCoreCompanyList() {
			API_GrainSituationGetCoreCompanyList().then(res => {
				if (res.success) {
					this.coreCompanyList = res.data.coreCompanyList;
					if (this.coreCompanyList && this.coreCompanyList.length > 0) {
						this.searchParams = {
							coreCompanyId: this.coreCompanyList[0].coreCompanyId
						};

						if (res.data.selectedCoreCompany) {
							this.coreCompanyList.forEach(item => {
								if (item.coreCompanyId == res.data.selectedCoreCompany.coreCompanyId) {
									this.searchParams = {
										coreCompanyId: item.coreCompanyId
									};
								}
							});
						}
						if (this.searchParams.attachmentExist) {
							this.searchParams.attachmentExist = [true, false][this.searchParams.attachmentExist - 1];
						}
						this.getList();
					}
				}
			});
		},
		jumpPage(str, data) {
			const monitorStr = this.isMonitor ? '/monitor' : '';
			this.$router.push({
				path: `/center/storageCenter${monitorStr}/${this.type}/${str}`,
				query: {
					id: data.id
				}
			});
		},
		renderType(type, companyType) {
			let typeText = {
				in: '入库',
				out: '出库'
			};
			return [
				{
					decorator: ['coreCompanyId'],
					addonBeforeTitle: '权属企业',
					type: 'select',
					placeholder: '请选择权属企业',
					options: [],
					isShow: companyType == 'CORE_COMPANY'
				},
				{
					decorator: ['serialNumber'],
					addonBeforeTitle: `${typeText[type]}流水号`,
					type: 'input',
					placeholder: `请输入${typeText[type]}流水号`
				},
				{
					decorator: ['date'],
					addonBeforeTitle: `${typeText[type]}时间`,
					type: 'rangePicker',
					realKey: ['storageTimeStart', 'storageTimeEnd']
				},
				{
					decorator: ['grainName'],
					addonBeforeTitle: '粮食名称',
					type: 'input',
					placeholder: '请输入粮食名称'
				},
				{
					decorator: ['depotPoint'],
					addonBeforeTitle: '库点',
					type: 'input',
					placeholder: '请输入库点'
				},
				{
					decorator: ['storehouse'],
					addonBeforeTitle: '仓房',
					type: 'input',
					placeholder: '请输入仓房'
				},
				{
					decorator: ['storageCompany'],
					addonBeforeTitle: '仓储企业',
					type: 'input',
					placeholder: '请输入仓储企业',
					isShow: ['FINANCIAL_ORG', 'TRADER', 'CORE_COMPANY'].includes(companyType)
				},
				{
					decorator: ['coreCompanyName'],
					addonBeforeTitle: '权属企业',
					type: 'input',
					placeholder: '请输入权属企业',
					isShow: companyType == 'WAREHOUSE'
				},
				{
					decorator: ['attachmentExist'],
					addonBeforeTitle: '有无附件',
					type: 'select',
					placeholder: '请选择',
					options: [
						{
							value: 1,
							label: '有'
						},
						{
							value: 2,
							label: '无'
						}
					]
				}
			];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
</style>
