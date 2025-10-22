<template>
	<div class="invoice-list">
		<div class="title">
			<div>{{ invoiceTitle }}</div>
			<div class="btn-box-title">
				<div
					class="btn"
					@click="goAdd"
				>
					<img
						class="icon"
						:src="addInvoce2"
						alt=""
					/>
					<span>新增发票</span>
				</div>
				<div
					class="btn"
					@click="exportFile"
				>
					<img
						class="icon2"
						:src="excelImport2"
						alt=""
					/>
					<span>Excel导出</span>
				</div>
			</div>
		</div>
		<!-- 查询区域 -->
		<SlForm
			:list="searchList"
			layout="inline"
			@change="changeSearch"
		></SlForm>
		<!-- <div class="search">
      <a-form-model layout="inline" :model="searchParams" >
        <a-row :class="{h80: isSpread}"> 
          <a-form-model-item class="col">
            <sl-input :style='iptStyle' addonBeforeTitle='合同编号' @blur="getList(1)" v-model="searchParams.contractNo"  placeholder="请输入合同编号按回车搜索"> </sl-input>
          </a-form-model-item>
          <a-form-model-item  class="col">
            <sl-input :style='iptStyle' addonBeforeTitle='销售方' @blur="getList(1)" v-model="searchParams.sellerName"  placeholder="输入销售方信息"> </sl-input>
          </a-form-model-item>
          <a-form-model-item  class="col"> 
            <sl-input addonBeforeTitle='购买方' :style='iptStyle' @blur="getList(1)" v-model="searchParams.buyerName"  placeholder="输入购买方信息"> </sl-input>
          </a-form-model-item>
          <a-form-model-item  class="col">
            <sl-range-picker
              v-model="issuedDate"
              :style='iptStyle'
              addonBeforeTitle='开票日期' 
              @change="changeSearch"
              value-format="YYYY-MM-DD"
              :placeholder="['', '']"
              format="YYYY-MM-DD"
            >
            </sl-range-picker>
          </a-form-model-item>
          <a-form-model-item  class="col">
            <sl-input addonBeforeTitle='发票代码' :style='iptStyle' @blur="getList(1)" v-model="searchParams.code"  placeholder="输入发票代码"> </sl-input>
          </a-form-model-item>
          <a-form-model-item  class="col" >
            <sl-input addonBeforeTitle='发票号码 ' :style='iptStyle' @blur="getList(1)" v-model="searchParams.no"  placeholder="输入发票号码"> </sl-input>
          </a-form-model-item>
          <a-form-model-item  class="col">
            <sl-select addonBeforeTitle='是否包含附件' :style='iptStyle' :getPopupContainer="triggerNode => triggerNode.parentNode" dropdownClassName="drop" @change="changeSearch" v-model="searchParams.whetherHasAttachment"  placeholder="请选择是/否">
              <a-select-option value=""> 全部 </a-select-option>
              <a-select-option value="0"> 否 </a-select-option>
              <a-select-option value="1"> 是 </a-select-option>
            </sl-select>
          </a-form-model-item>
          <a-form-model-item  class="col" >
            <sl-select addonBeforeTitle='状态' :style='iptStyle' :getPopupContainer="triggerNode => triggerNode.parentNode" @change="changeSearch" dropdownClassName="drop" v-model="searchParams.state"  placeholder="请选择当前状态">
              <a-select-option value=""> 全部 </a-select-option>
              <a-select-option :value="item.value" v-for="item in VUEX_ST_ALLCODE.invoiceStateDict"  :key="item.value">
                {{ item.text }}
              </a-select-option>
            </sl-select>
          </a-form-model-item>
        </a-row>
      </a-form-model>
      <div class="icon-box">
        <div v-if="!isSpread" @click="isSpread = true" class="icon-1">收起筛选 <i style="fontSize:12px"  class="iconfont icon-gengduoshaixuan-xialajiantou1-copy" /></div>
        <div v-else @click="isSpread = false" class="icon-2">更多筛选 <i style="fontSize:12px" class="iconfont  icon-gengduoshaixuan-xialajiantou1" /></div>
      </div>
    </div> -->
		<!-- 表格 -->
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				:rowKey="(record, index) => `${record.id}-${record.no}-${index}`"
				:dataSource="list"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<span
					slot="contractNo"
					slot-scope="text, record"
				>
					<div
						v-for="(item, index) in record.contractNoList"
						:key="index"
					>
						{{ item || '-' }}
					</div>
				</span>
				<span slot="customTitle2">
					开具金额(元)
					<a-tooltip>
						<template slot="title"> 不含税 </template>
						<i
							class="iconfont icon-liebiaobiaotou-shuoming"
							style="font-size: 12px"
						></i>
					</a-tooltip>
				</span>
				<span slot="notSplitAmount">
					发票可拆分金额(元)
					<a-tooltip>
						<template slot="title"> 含税 </template>
						<i
							class="iconfont icon-liebiaobiaotou-shuoming"
							style="font-size: 12px"
						></i>
					</a-tooltip>
				</span>
				<span slot="customTitle"> 操作 </span>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<div class="btn-box">
						<a
							href="javascript:;"
							class="btn"
							@click="goDetail('detail', record)"
							>查看</a
						>
						<!-- 判断是否是异常发票 -->
						<a
							href="javascript:;"
							v-if="record.state == 'NORMAL'"
							class="btn"
							@click="goDetail('modify', record)"
							>编辑</a
						>
						<!-- 异常发票判断 -->
						<a
							href="javascript:;"
							v-if="record.state != 'NORMAL'"
							class="btn"
							@click="del(record.id)"
							>删除</a
						>

						<a-dropdown
							v-else
							placement="bottomCenter"
						>
							<a
								class="ant-dropdown-link"
								@click="e => e.preventDefault()"
							>
								更多 <i class="iconfont icon-liebiaocaozuo-gengduoxiala caret-down"></i>
							</a>
							<a-menu
								slot="overlay"
								class="menu-box-invoice"
							>
								<a-menu-item>
									<a
										href="javascript:;"
										@click="spill(record)"
										>红冲</a
									>
								</a-menu-item>
								<a-menu-item>
									<a
										href="javascript:void(0)"
										@click="invalid(record)"
										>作废</a
									>
								</a-menu-item>
								<a-menu-item>
									<a
										href="javascript:;"
										@click="del(record.id)"
										>删除</a
									>
								</a-menu-item>
							</a-menu>
						</a-dropdown>
					</div>
				</div>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			size="small"
			@change="getList"
		/>
		<DelModal
			ref="delModal"
			@confirm="confirmDel"
		></DelModal>
	</div>
</template>

<script>
import SlForm from '@sub/components/ui-new/Form/sl-form.vue';
import SlInput from '@sub/components/ui-new/Form/sl-input.vue';
import SlRangePicker from '@sub/components/ui-new/Form/sl-range-picker.vue';
import SlSelect from '@sub/components/ui-new/Form/sl-select.vue';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { buyColumns, freightColumns } from './columns/columns.js';
import DelModal from './delModal.vue';
import { getInvoiceList, exportInvoiceXls, invalidInvoice, deleteInvoice, reverseInvoice } from '@/v2/center/trade/api/invoice';
import comDownload from '@sub/utils/comDownload.js';
import emptyImg from '@/assets/imgs/newInvoice/empty.png';
import { invoiceTypeInfo } from './columns/constant.js';
import moment from 'moment';
// 煤炭
const pathCoalInfo = {
	INPUT: {
		detail: '/center/invoice/buydetail',
		modify: '/center/invoice/buyedit'
	},
	OUTPUT: {
		detail: '/center/invoice/selldetail',
		modify: '/center/invoice/selledit'
	},
	DELIVER: {
		detail: '/center/invoice/Freightdetail',
		modify: '/center/invoice/freightEdit'
	}
};
// 钢材
const pathSteelInfo = {
	INPUT: {
		detail: '/center/steels/invoice/buydetail',
		modify: '/center/steels/invoice/buyedit'
	},
	OUTPUT: {
		detail: '/center/steels/invoice/selldetail',
		modify: '/center/steels/invoice/selledit'
	},
	DELIVER: {
		detail: '/center/steels/invoice/Freightdetail',
		modify: '/center/steels/invoice/freightEdit'
	}
};
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '销售方',
		type: 'input',
		placeholder: '输入销售方信息',
		allowClear: true
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '购买方',
		type: 'input',
		placeholder: '输入购买方信息',
		allowClear: true
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '开票日期',
		realKey: ['issuedDateBegin', 'issuedDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['code'],
		addonBeforeTitle: '发票代码',
		type: 'input',
		placeholder: '输入发票代码',
		allowClear: true
	},
	{
		decorator: ['no'],
		addonBeforeTitle: '发票号码',
		type: 'input',
		placeholder: '输入发票号码',
		allowClear: true
	},
	{
		decorator: ['whetherHasAttachment'],
		addonBeforeTitle: '是否包含附件',
		type: 'select',
		placeholder: '请选择是/否',
		allowClear: true,
		options: [
			{ value: '', label: '全部' },
			{ value: '0', label: '否' },
			{ value: '1', label: '是' }
		]
	}
];
export default {
	props: ['invoiceType', 'industryType'],
	data() {
		return {
			searchParams: {
				contractNo: '',
				sellerName: '',
				buyerName: ''
			},
			issuedDate: [],
			/** 筛选项操作 */
			isSpread: false,
			// 加载
			loading: false,
			list: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10,
			emptyImg,
			delId: '',
			searchList: [],
			addInvoce2: require('@/assets/imgs/newInvoice/add-invoce2.png'),
			excelImport2: require('@/assets/imgs/newInvoice/excel-import2.png')
		};
	},
	computed: {
		// 发票title
		invoiceTitle() {
			return invoiceTypeInfo[this.invoiceType];
		},
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		columns() {
			// 进项发票
			if (this.invoiceType == 'INPUT') {
				return buyColumns;
			}
			// 销项
			if (this.invoiceType == 'OUTPUT') {
				return buyColumns;
			}
			// 运费
			if (this.invoiceType == 'DELIVER') {
				return freightColumns;
			}
		},
		iptStyle() {
			if (window.screen.width < 1900) {
				return { width: '252px' };
			}
			return { width: '290px' };
		}
	},
	mounted() {
		this.searchList = [...searchList];
		this.searchList.push({
			decorator: ['state'],
			addonBeforeTitle: '状态',
			type: 'select',
			placeholder: '请选择当前状态',
			optionsConfig: {
				key: 'text',
				value: 'value'
			},
			allowClear: true,
			options: [{ value: '', text: '全部' }, ...this.VUEX_ST_ALLCODE.invoiceStateDict]
		});
		this.getList();
	},
	methods: {
		changeSearch(data) {
			this.searchParams = data;
			this.getList(1, this.pageSize);
		},
		// 获取发票列表
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			// if (this.searchParams.issuedDate && this.searchParams.issuedDate.length) {
			//   this.searchParams.issuedDateBegin = this.searchParams.issuedDate[0]
			//   this.searchParams.issuedDateEnd = this.searchParams.issuedDate[1]
			// } else {
			//   delete this.searchParams.issuedDateBegin
			//   delete this.searchParams.issuedDateEnd
			// }
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize,
				type: this.invoiceType,
				industryType: this.industryType
			};
			delete params.issuedDate;
			this.loading = true;
			try {
				const res = await getInvoiceList(params);
				this.list = res.data.records;
				this.pagination.total = res.data.total;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		// 去往详情和编辑
		goDetail(type, item) {
			const pathInfo = this.industryType == 'STEEL' ? pathSteelInfo : pathCoalInfo;
			const pathItem = pathInfo[this.invoiceType];
			this.$router.push({
				path: pathItem[type],
				query: {
					id: item.id,
					no: item.no,
					type,
					invoiceType: this.invoiceType,
					industryType: this.industryType
				}
			});
		},
		async spill(record) {
			// 红冲发票
			const res = await reverseInvoice({ invoiceId: record.id });
			if (res.data) {
				this.$message.success('发票号码为' + record.no + '的发票，已红冲');
				this.getList(1, this.pageSize);
			} else {
				this.$message.error('未查询到发票红冲，红冲失败');
			}
		},
		async invalid(record) {
			// 作废发票
			const res = await invalidInvoice({ invoiceId: record.id });
			if (res.data) {
				this.$message.success('发票号码为' + record.no + '的发票，已作废');
				this.getList(1, this.pageSize);
			} else {
				this.$message.error('未查询到发票作废，作废失败');
			}
		},
		// 新增发票
		goAdd() {
			const str = {
				INPUT: 'addBuy',
				OUTPUT: 'addSell',
				DELIVER: 'addFreight',
				invoiceType: this.invoiceType
			};
			// 判断是钢材新增还是发票新增
			const path =
				this.industryType == 'STEEL'
					? `/center/steels/invoice/${str[this.invoiceType]}`
					: `/center/invoice/${str[this.invoiceType]}`;
			this.$router.push(path);
		},
		del(id) {
			this.delId = id;
			this.$refs.delModal.open();
		},
		async confirmDel() {
			await deleteInvoice({ id: this.delId });
			this.$message.success('删除成功');
			this.$refs.delModal.close();
			this.getList(1, this.pageSize);
		},
		// 导出
		async exportFile() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				type: this.invoiceType,
				industryType: this.industryType
			};
			const res = await exportInvoiceXls(params);

			comDownload(res, undefined, `${this.invoiceTitle}_${moment().format('YYYYMMDD')}.xls`);
		}
	},
	components: {
		SlInput,
		SlRangePicker,
		SlSelect,
		iPagination,
		DelModal,
		SlForm
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.invoice-list {
  // margin: 10px;
  margin-top: 6px;
  .h80 {
    height: 80px;
    overflow: hidden;
  }
  .title {
    padding-bottom: 15px;
    font-size: 20px;
    color: rgba(0,0,0,0.8);
    font-weight: 600;
    border-bottom: 1px solid #E9EFFC;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Medium, PingFang SC,PingFangSC-Regular, PingFang SC;
  }
  .btn-box-title {
    display: flex;
    align-items: center;
    .btn {
      width: 126px;
      height: 44px;
      border-radius: 4px;
      border: 1px solid #4682F3;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #4682F3;
      font-size: 14px;
      margin-left: 20px;
      font-weight: 400;
      cursor: pointer;

    }
  }
  .col {
    margin-top: 28px;
  }
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: #4682F3;
    cursor: pointer;

    font-size: 12px;
    .icon-1, .icon-2 {
      width: 94px;
      height: 34px;
      border-radius: 4px;
      line-height: 34px;
      text-align: center;
    }
    .icon-1:hover, .icon-2:hover {
       background: rgba(132, 149, 170, .1) ;
    }
  }
  /deep/ .ant-form-item-control {
    line-height: 38px;
  }
 /deep/ .ant-form-item {
    margin-right: 20px;
  }
  .table-box {
    margin-top: 20px;
  }
  .btn-box {
    width: 170px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #4682F3;
    font-size: 14px;

  }
  .menu-box {
    width: 104px;
    height: 104px;
    background: #FFFFFF;
    border-radius: 4px;
  }
  .caret-down {
    color: #8495AA;
    height: 6px;
  }
  .ant-dropdown-link:hover {
    .caret-down {
      color: #4682F3;
    }
  }
  .icon, .icon2 {
    width:18px;
    vertical-align: middle;
    margin-right: 15px
    // height: 18px;
    // display: inline-block;
    // vertical-align: middle;
    // background: url(~assets/imgs/newInvoice/add-invoice.png) no-repeat;
    // background-size: contain;
    // margin-right: 10px ;
    // vertical-align: middle;
  }
  .icon3 {
    transform: ;
  }

}
/deep/ .drop2 {
  width: 100% !important;
  left: -96px  !important;
}
/deep/ .drop {
  width: 100% !important;
  left: 0px  !important;
}
</style>
