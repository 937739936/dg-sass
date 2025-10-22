<template>
  <div class="log">
    <div class="title">煤种库存列表</div>
    <a-table
      :columns="tableColumns"
      class="new-table"
      :bordered="false"
      rowKey="id"
      :dataSource="list"
      :pagination="false"
      :scroll="{x:true}"
    >
      <template slot="coalType" slot-scope="text">
        <div class="coalType-column-container">
          <TextOverflowTooltip :tipText="text">
            <span>{{ text }}</span>
          </TextOverflowTooltip>
        </div>
      </template>
      <template slot="action" slot-scope="text,record">
          <a-space>
            <template>
              <a  @click.prevent="goInOutDetail(record, 'in')" >入库明细</a>
              <a  @click.prevent="goInOutDetail(record, 'out')" >出库明细</a>
            </template>
          
          </a-space>
      </template>
    </a-table>
  </div>
</template>

<script>

import { formatMoney } from '@sub/filters';
import TextOverflowTooltip from '@sub/components/base/TextOverflowTooltip';

const columns = [
  { title: "品名", dataIndex: "coalType", scopedSlots: { customRender: "coalType" } },
  { title: "账面库存（吨）", dataIndex: "totalInventory", customRender: t => formatMoney(t) },
  { title: "库存货值（元）", dataIndex: "totalGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计入库（吨）", dataIndex: "inInventory",customRender: t => formatMoney(t)},
  { title: "累计入库货值（元）", dataIndex: "inGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计出库（吨）", dataIndex: "outInventory" , customRender: t => formatMoney(t)},
  { title: "累计出库货值（元）", dataIndex: "outGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计掺配产出（吨）", dataIndex: "blendingOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计掺配消耗（吨）", dataIndex: "blendingUseInventory" , customRender: t => formatMoney(t)},
  { title: "累计洗煤产出（吨）", dataIndex: "washOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计洗煤消耗（吨）", dataIndex: "washUseInventory" , customRender: t => formatMoney(t)},
  { title: "操作", dataIndex: "操作",fixed:"right", scopedSlots: { customRender: "action" },},
];
const adminColumns = [
  { title: "品名", dataIndex: "coalType", scopedSlots: { customRender: "coalType" } },
  { title: "站台名称", dataIndex: "stationName" },
  { title: "账面库存（吨）", dataIndex: "totalInventory", customRender: t => formatMoney(t) },
  { title: "库存货值（元）", dataIndex: "totalGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计入库（吨）", dataIndex: "inInventory",customRender: t => formatMoney(t)},
  { title: "累计入库货值（元）", dataIndex: "inGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计出库（吨）", dataIndex: "outInventory" , customRender: t => formatMoney(t)},
  { title: "累计出库货值（元）", dataIndex: "outGoodsValue", customRender: t => formatMoney(t) },
  { title: "累计掺配产出（吨）", dataIndex: "blendingOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计掺配消耗（吨）", dataIndex: "blendingUseInventory" , customRender: t => formatMoney(t)},
  { title: "累计洗煤产出（吨）", dataIndex: "washOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计洗煤消耗（吨）", dataIndex: "washUseInventory" , customRender: t => formatMoney(t)},
  { title: "操作", dataIndex: "操作",fixed:"right", scopedSlots: { customRender: "action" },},
];
export default {
  components: {
    TextOverflowTooltip,
  },
  props: {
    list: {
      default: ()=> {return []}
    },
    columns: {
      default: () => {return columns }
    },
    source:{
      type:String,
      default:() => "rest"
    },
    isManager: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      adminColumns,
    }
  },
  computed: {
    tableColumns() {
      let columnsList = [];
      if (this.source === 'admin') {
        columnsList = this.adminColumns;
      } else {
        columnsList = this.columns;
      }
      if (this.isManager) {
        // 过滤totalGoodsValue 、inGoodsValue、outGoodsValue
        columnsList = columnsList.filter(item => {
          return item.dataIndex !== 'totalGoodsValue' && item.dataIndex !== 'inGoodsValue' && item.dataIndex !== 'outGoodsValue'
        });
      }
      return [...columnsList];
    }
  },
  methods: {
    goInOutDetail(item, type) {
      this.$emit('goInOutDetail', item, type)
    }
  },
}
</script>

<style lang="less" scoped>
@import url("../style/table.less");
</style>
<style scoped lang='less'>
.log {
  width: 100%;
  margin-top: 30px;
}
  .title{
    padding-left:16px;
    position: relative;
    font-size:16px;
    color:rgba(#000,0.8);
    line-height:22px;
    margin-bottom: 20px;
    &::before{
      content:"";
      position:absolute;
      top:50%;
      left:0;
      width:4px;
      height:18px;
      background-color:@primary-color;
      transform:translateY(-50%);
      border-radius:1px;
    }
  }
  .coalType-column-container {
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap;
  }
</style>
