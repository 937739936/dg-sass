<template>
  <div v-if="!noData" style="background-color: #fff">
    <div class="inner-content">
      <div class="title" style="margin-bottom: 10px; border: none; background: none">
        <i class="title_icon"></i>计算过程&nbsp;{{
          calcData.weightType == 1 ? '（本合同加权规则为日加权）' : '（本合同加权规则为合同周期加权）'
        }}
      </div>
      <div class="inner-content inner" v-if="calcData.weightType == 2">
        <div class="title" style="margin-bottom: 10px"><i class="title_icon"></i>加权结算批次</div>
        <div style="margin-bottom: 20px">&nbsp;加权批次：</div>
        <a-table
          :columns="columnsJia"
          :scroll="{ x: true }"
          :dataSource="dataSourceJia"
          :pagination="false"
          :rowKey="(record, index) => index"
        >
        </a-table>
        <div style="margin-bottom: 20px; margin-top: 10px">&nbsp;指标加权结果：</div>
        <a-table
          :columns="columnsInc"
          :scroll="{ x: true }"
          :dataSource="dataSourceInc"
          :pagination="false"
          :rowKey="(record, index) => index"
        >
        </a-table>

        <a-row class="row" style="margin-top: 20px">
          <a-col :span="12"> 数量总计：{{ calcData.weightInfo.weightRealQuantity }}吨 </a-col>
          <a-col :span="12"> 加权单价：{{ calcData.weightInfo.weightPrice }}元/吨 </a-col>
        </a-row>
        <a-row class="row">
          <a-col :span="17">
            额外扣罚：{{ calcData.weightInfo.weightDeduct }}（<span
              v-for="(item, index) in calcData.weightInfo.weightIndicatorInfoList"
              :key="item.no"
              >收货编号{{ item.no }}扣罚{{ Number(item.deduct)*(-1)
              }}<span v-if="index != calcData.weightInfo.weightIndicatorInfoList.length - 1">，</span></span
            >）
          </a-col>
        </a-row>
        <a-row class="row">
          <a-col :span="17">
            货值金额：{{ calcData.weightInfo.weightRealQuantity }} X {{ calcData.weightInfo.weightPrice }} +（{{
              calcData.weightInfo.weightDeduct
            }}）= {{ calcData.weightInfo.weightGoodsValue }}元
          </a-col>
        </a-row>
      </div>
      <div class="inner-content inner" v-show="calcData.singleBatchInfoList && calcData.singleBatchInfoList.length">
        <div class="title" style="margin-bottom: 10px">
          <i class="title_icon"></i>{{ calcData.weightType == 2 ? '单批次结算' : '结算批次' }}
        </div>
        <div style="margin-bottom: 20px">
          &nbsp;{{ calcData.weightType == 2 ? '单批次结算货物批次' : '结算批次收货数据' }}：
        </div>
        <a-table
          :columns="columnsDan"
          :scroll="{ x: true }"
          :dataSource="dataSourceDan"
          :pagination="false"
          :rowKey="(record, index) => index"
        >
        </a-table>
        <div style="margin-bottom: 20px; margin-top: 10px">&nbsp;各批次货值数据：</div>
        <a-table
          :columns="columnsBei"
          :scroll="{ x: true }"
          :dataSource="dataSourceBei"
          :pagination="false"
          :rowKey="(record, index) => index"
        >
        </a-table>
      </div>
      <div class="inner-content inner">
        <div class="title" style="margin-bottom: 10px"><i class="title_icon"></i>货值金额计算结果</div>
        <template v-if="calcData.weightType == 2">
          <a-row class="row">
            <a-col :span="2"> 货值金额： </a-col>
            <a-col :span="22"> = 加权结算批次货值金额 + 单批次结算货值金额 </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="2"> </a-col>
            <a-col :span="22"> = {{ calcData.weightInfo.weightGoodsValue }} + {{ danGoodValue.toFixed(2) }} </a-col>
          </a-row>
        </template>
        <template v-if="calcData.weightType == 1">
          <a-row class="row">
            <a-col :span="2"> 货值金额： </a-col>
            <a-col :span="22">
              = <span>{{ danGoodValueSingle.join(' + ') }}</span>
            </a-col>
          </a-row>
        </template>
        <a-row class="row">
          <a-col :span="2"> </a-col>
          <a-col :span="22">
            = <span style="font-size: 19px; color: red">{{ calcData.sumGoodsValue }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>

const columnsDan = [
        {
          title: '批次号',
          dataIndex: 'extraInfo.batchNo',
          align: 'center',
          width:150
        },
        {
          title: '收货编号',
          dataIndex: 'no',
          align: 'center',
          width:150
        },
        {
          title: '发货数量(吨)',
          dataIndex: 'extraInfo.deliverQuantity',
          align: 'center',
          width:150
        },
        {
          title: '发货日期',
          dataIndex: 'extraInfo.deliverDate',
          align: 'center',
          width:150
        },
        {
          title: '收货数量(吨)',
          dataIndex: 'quantity',
          align: 'center',
          width:150
        },
        {
          title: '收货日期',
          dataIndex: 'extraInfo.receiveDate',
          align: 'center',
          width:150
        },
      ]
export default {
  props: {
    calcData: {
      type: Object,
      default: () => {
        return {
          indicatorJson: '{}',
          indicatorJsonCH:'{}',
          weightIndicatorInfoList: [],
        }
      },
    },
  },

  data() {
    return {
      noData:false,
      danGoodValue: 0,
      danGoodValueSingle: [],
      dataSourceInc: [],
      dataSourceJia: [],
      dataSourceDan: [],
      dataSourceBei: [],
      columnsInc: [],
      columnsJia: [
        {
          title: '批次号',
          dataIndex: 'extraInfo.batchNo',
          align: 'center',
        },
        {
          title: '收货编号',
          dataIndex: 'no',
          align: 'center',
        },
        {
          title: '发货数量(吨)',
          dataIndex: 'extraInfo.deliverQuantity',
          align: 'center',
        },
        {
          title: '发货日期',
          dataIndex: 'extraInfo.deliverDate',
          align: 'center',
        },
        {
          title: '收货数量(吨)',
          dataIndex: 'quantity',
          align: 'center',
        },
        {
          title: '收货日期',
          dataIndex: 'extraInfo.receiveDate',
          align: 'center',
        },
      ],
      columnsDan: columnsDan,
      columnsBei: [
        {
          title: '批次号',
          dataIndex: 'extraInfo.batchNo',
          align: 'center',
        },
        {
          title: '收货编号',
          dataIndex: 'no',
          align: 'center',
        },
        {
          title: '单价（元/吨）',
          dataIndex: 'price',
          align: 'center',
        },
        {
          title: '数量（吨）',
          dataIndex: 'realQuantity',
          align: 'center',
        },
        {
          title: '额外扣罚',
          dataIndex: 'deduct',
          align: 'center',
        },
        {
          title: '货值金额（元）',
          dataIndex: 'goodsValue',
          align: 'center',
        },
      ],
    }
  },
  components: {},
  computed: {},

  mounted() {
    if(this.calcData.isShowGoodsValue == 0) {
      this.noData = true
    } else {
      
      this.initData()
    }
    
  },
  watch: {
    calcData: {
      handler(v) {
        this.initData(v)
      },
      deep: true,
    },
  },
  methods: {
    initData() {
      if (this.calcData.weightInfo == null) {
        this.calcData.weightInfo = {
          indicatorJson: '{}',
          indicatorJsonCH:'{}',
          weightIndicatorInfoList: [],
        }
      }

      this.initColumnsJia()
      this.initColumnsInc()
      this.initColumnsDan()
      this.initColumnsBei()
    },
    initColumnsJia() {
      this.dataSourceJia = []
      this.dataSourceJia = this.calcData.weightInfo.weightIndicatorInfoList
    },
    initColumnsInc() {
      this.columnsInc = []
      let incObj = JSON.parse(this.calcData.weightInfo.indicatorJsonCH)
      for (var key  in incObj) {
        this.columnsInc.push({
          title: key,
          dataIndex: key,
          align: 'center',
        })
      }
      this.dataSourceInc = []

      this.dataSourceInc = [incObj]
    },
    initColumnsDan() {
      let list = this.calcData.singleBatchInfoList || []
      let incObj = JSON.parse(list[0].indicatorJsonCH)
      this.columnsDan = [...columnsDan]
      for (var key  in incObj) {
        this.columnsDan.push({
          title: key,
          dataIndex: key,
          align: 'center',
        })
      }
      var _danGoodValue = 0
      var _danGoodValueSingle = []
      this.dataSourceDan = list.map((item) => {
        _danGoodValue = Number(_danGoodValue + Number(item.goodsValue))
        _danGoodValueSingle.push(item.goodsValue)
        let inc = JSON.parse(item.indicatorJsonCH)
        return {
          ...item,
          ...inc,
        }
      })
      this.danGoodValueSingle = _danGoodValueSingle
      this.danGoodValue = _danGoodValue
    },
    initColumnsBei() {
      let list = this.calcData.singleBatchInfoList
      this.dataSourceBei = list
    },
  },
}
</script>

<style lang="less" scoped>
.inner-content {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
  &.inner {
    border: 1px solid #e8e8e8;
  }
}

.row {
  margin-bottom: 20px;
  line-height: 40px;
}
.title {
  font-size: 15px;
  padding: 14px 0;
  margin-bottom: 30px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  .title_icon {
    opacity: 0;
    width: 14px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
  }
}

.makestr {
  margin-left: 35px;
  height: 300px;
  padding: 5px;
  overflow-y: auto;
}
</style>
