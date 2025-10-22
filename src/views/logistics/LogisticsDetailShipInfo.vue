<template>
  <div class="third-fin-ship-info">
    <div class="ship-info-container">
      <div class="train-times-wrap">
        <a-table
            :dataSource="dataSource"
            :columns="columnsShip"
            :pagination="false"
            :locale="{emptyText: '暂无数据'}">
          <span slot="operation" slot-scope="text,record">
             <!-- <a v-if="record.status == 2 || record.status == 3" @click.self="jumpToShipTail(1,record)">实时位置</a>
             <a v-if="record.status == 4" @click.self="jumpToShipTail(2,record)">历史轨迹</a> -->
             <a @click.self="jumpToShipTail(2,record)">轨迹查询</a>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 给云控使用的船舶信息页面
 */
import { API_SOAGetShipGetShipTrackFlag, API_SOAGetShipDeliverInfoShips } from "api/index";

export default {
  name: 'ThirdFinShipInfo',
  data () {
    return {
      deliverId: '', //发货批次id
      batchNo: '', //发货批次号
      dataSource: [],
      columnsShip:[
        {
          title: '船舶名称',
          dataIndex:'shipName',
        },
        {
          title: '航次号',
          dataIndex:'voyageNo',
        },
        {
          title: 'mmsi',
          dataIndex:'identifierNo',
        },
        {
          title: '装货量（吨）',
          dataIndex:'deliverQuantity',
        },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: {
            customRender: 'operation'
          },
        }
      ]
    }
  },
  mounted() {
    this.deliverId = this.$route.query.deliverId || ''
    this.source = this.$route.query.source || 'BUSINESS_LINE'
    if (this.deliverId) {
      this.getDetail()
    } else {
      this.$message.error('缺少相关参数')
    }
  },
  methods: {
    getDetail () {
      API_SOAGetShipDeliverInfoShips(this.deliverId, { deliverId: this.deliverId,source:this.source }).then( res =>{
        if (!res.success) {
          this.$message.error(res.message)
          return false
        }
        this.dataSource = res.data || []
      })
    },
    jumpToShipTail(type,record){
      this.deliverId = record.deliverBatchId
      if(type == 1){
        window.open('/logistics/LogisticsDetailShip?source='+this.source+'&mmsi=' + record.identifierNo + '&shipName=' + record.shipName + '&type=realLocation&deliveryId=' + this.deliverId + '&from=yunkong')
      }
      if(type == 2) {
        API_SOAGetShipGetShipTrackFlag({
          deliveryId: this.deliverId,
          mmsiOrName : record.identifierNo || record.shipName,
          matchType: record.identifierNo ? 'mmsi' : 'name',
          source:this.source
        }).then(res => {
          if (res.success) {
            window.open('/logistics/LogisticsDetailShip?source='+this.source+'&mmsi=' + record.identifierNo + '&shipName=' + record.shipName + '&type=historyLocation&deliveryId=' + this.deliverId + '&from=yunkong')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.third-fin-ship-info{
  width: 100%;
  .ship-info-container{
    width: 800px;
    margin: auto;
  }
  .train-times-wrap{
    margin-bottom: 30px;
  }
}
</style>
<style>
html, body, #app, .lay-container{
  min-width: 800px;
}
</style>
