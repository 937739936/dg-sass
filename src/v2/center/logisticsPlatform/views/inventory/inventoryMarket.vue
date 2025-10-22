<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">库存盯市</span>
      </div>
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
      ></SlFormNew>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
          :columns="columns"
          class="new-table"
          :bordered="false"
          rowKey="id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <div
            slot="price"
            slot-scope="text, record"
          >
            <div>{{ formatMoney(record.price) }}&nbsp;<a-icon v-if="record.lastFluctuateValue < 0" type="arrow-down" style="color: red"/><a-icon type="arrow-up" v-if="record.lastFluctuateValue > 0"  style="color: green"/></div>
          </div>
          <div
            slot="action"
            slot-scope="text, record"
          >
            <a-space>
              <a v-if="typeof record.indicatorId === 'undefined' || record.indicatorId == null || record.indicatorId === ''" href="javascript:;" @click="relatedPrice(record)" v-auth="'logisticsStorageCenter:inventoryManage:price:add'">关联价格</a>
              <template v-else>
                <a href="javascript:;" @click="viewTrend(record)">查看趋势</a>
                <a href="javascript:;" @click="relatedPrice(record)" v-auth="'logisticsStorageCenter:inventoryManage:price:modify'">编辑</a>
              </template>
            </a-space>
          </div>
        </a-table>
        <i-pagination 
          :pagination="pagination"
          @change="getList"
        />
      </div>
    </a-card>
    <RelatedPrice ref="relatedPrice" @updateFunc="getList"></RelatedPrice>
  </div>
</template>

<script>
import { formatMoney } from '@sub/filters'
const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const customRender = text => text || '-';
const columns = [
  { title: "库存品名", dataIndex: "coalType", key: "coalType", },
  { title: "库存数量（吨）", dataIndex: "inventory", key: "inventory",
    customRender: (txt) => formatMoney(txt) 
  },
  { title: "指数名称", dataIndex: "indexName", key: "indexName",customRender },
  { title: "指标名称", dataIndex: "indicatorName", key: "indicatorName",customRender },
  { title: "最新日期", dataIndex: "date", key: "date",customRender},
  { title: "最新价格（元/吨）", dataIndex: "price", key: "price", scopedSlots: { customRender: "price" },},
  { title: "更新频率", dataIndex: "updateFrequencyDesc", key: "updateFrequencyDesc",customRender },
  { title: "操作", key: "action", scopedSlots: { customRender: "action" }, fixed: 'right' },
]
const searchList = [
  {
    decorator: ['coalType'],
    addonBeforeTitle: '品名',
    type: 'select',
    placeholder: '请输入品名',
    showSearch: true,
		filterOption: filterOption,
		options: []
  },
  {
    decorator: ['indexName'],
    addonBeforeTitle: '指数名称',
    type: 'select',
    placeholder: '请选择指数名称',
    showSearch: true,
		filterOption: filterOption,
		options: []
  },
  {
    decorator: ['indicatorName'],
    addonBeforeTitle: '指标名称',
    type: 'select',
    placeholder: '请选择指标名称',
    showSearch: true,
		filterOption: filterOption,
		options: []
  },
]
import { ListMixin } from "@/v2/components/mixin/ListMixin";
import {
  getInventoryMarketPage,
  getIndexNameList,
  getIndicatorNameList,
} from "@/v2/center/logisticsPlatform/api/inventory"
import {
  getCoalTypeAllList,
} from "@/v2/center/logisticsPlatform/api"

import { ExportIcon } from '@sub/components/svg';
import { uniq } from 'lodash'
import RelatedPrice from "@/v2/center/logisticsPlatform/views/inventory/components/relatedPrice"
export default {
  mixins: [ListMixin],
  components: {
    ExportIcon,
    RelatedPrice
  },
  data(){
    return {
      formatMoney,
      columns,
      searchList,
      tableLoading:false,
      searchParams: {},
      pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
      url: {
        list: getInventoryMarketPage
      },
    }
  },
  mounted(){
    this.initData();
  },
  methods:{
    initData() {
      return new Promise(async (resolve) => {
        await this.getCoalTypeList()
        await this.getIndexList()
        await this.getIndicatorNameList()
        resolve(true)
      })
    },
    async getCoalTypeList(){
      return getCoalTypeAllList().then(res=>{
        if(res.success){
          const coalList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'coalType') {
              item.options = coalList.map((item) => {
                return { value: item.name, label: item.name};
              })
            }
          })
        }
      })
    },
    async getIndicatorNameList(){
      return getIndicatorNameList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const zbmcList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'indicatorName') {
              item.options = zbmcList.map((item) => {
                return { value: item, label: item};
              })
            }
          })
        }
      })
    },
    async getIndexList(){
      return getIndexNameList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const zsmcList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'indexName') {
              item.options = zsmcList.map((item) => {
                return { value: item, label: item};
              })
            }
          })
        }
      })
    },
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    relatedPrice(record) {
      this.$refs.relatedPrice.showModal(record);
    },
    viewTrend(record) {
      this.$router.push({
        path: '/center/logisticsPlatform/inventoryMarket/priceTrend',
        query: {
          indicatorId: record.indicatorId
        },
      })
    }
  }
}



</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
  .table-box {
    margin-top: 30px;
  }
}
.tip-box {
	display: flex;
	justify-content: flex-end;
}
.export-box {
	display: flex;
	align-items: center;
	color: @primary-color;
	cursor: pointer;
	.export-text {
		margin-left: 6px;
		position: relative;
		top: 2px;
	}
}
</style>