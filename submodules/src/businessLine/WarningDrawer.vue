<template>
  <div>
    <!-- 关联采购、销售合同弹窗 -->
    <a-drawer
      class="slDrawer slDrawer2"
      :title="title"
      placement="right"
      :visible="visible"
      @close="onClose"
      :footer="null"
      destroyOnClose
    >
    <div v-for="(item, i) in list" :key="i" class="warn-item"  @click="goWarnDetail(item)" >
      <div class="warn-item-title">
        <p>【{{item.alertTypeBelongDesc}}】 {{item.alertContent}}</p>
        <p class="date">{{item.createTime}}</p>
      </div>
      <span class="status" :class="item.riskLevel">{{item.riskLevelDesc}}</span>

    </div>

    </a-drawer>
  </div>
</template>

<script>




export default {
  name: "warningDrawer",
  props: {
    getBusinessLineRiskAlertList: {},
    type: {
      default: 'rest',
    },
  },
  data() {
    return {

      list:[],
      visible: false,
    };
  },
  computed: {
    title() {
      if(this.list.length) {
        return `业务线风险预警信息（${this.list.length}）`
      }
      return '业务线风险预警信息'
    }
  },
  components: {

  },
  created() {
  
  },
  methods: {
    open() {
      this.visible = true
      this.getList()
    },
    onClose() {
      let m =function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.body.style.height='';
      document.removeEventListener("touchmove",m,{ passive:true });
      this.visible = false
    },
    async getList() {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
      }
      const res = await this.getBusinessLineRiskAlertList(params)
      this.list = res.data || []
      console.log(this.list)
    },
    goWarnDetail(record) {
      if(this.type != 'admin') {
        this.goWarnRestDetail(record)
      } else {
        this.goWarnAdminDetail(record)
      }

    },
    goWarnRestDetail(record) {
      let path = record.alertType === 'YJZS' ? '/center/message/riskControlCertDetail': '/center/message/riskControlDetail'
      let query = {
          id: record.id,
          orderType: record.orderType,
        };
      if(record.alertType === 'YJSXT') {
        path = '/center/message/facilityDetail'
      }
      // 价格下跌
      if(record.alertTypeBelong === 'PRICE_FAIL') {
        path = '/center/message/riskControlPriceDeclineDetail'
      }
      if(record.alertTypeBelong === 'INVENTORY') {
        if(record.ruleNo == 'YJKC006' || record.ruleNo == 'YJKC005') {
          // 放货指令 临额|超额
          path = '/center/message/instructDetail'
        } else {
          path = '/center/message/inventoryDetail'
        }
      }
      if (record.ruleNo == 'YJSF0018' || record.ruleNo == 'YJSF0019') {
        // 出|入 库称重异常
        path = '/center/message/weightingDetail';
        query = { id: record.id, ruleNo:record.ruleNo };
			} 
      const {href} =  this.$router.resolve({
        path,
        query: query,
      });
      window.open(href)
    },
    // admin 跳转预警详情
    goWarnAdminDetail(record) {
      let path 
      // 企业监控
      if(record.monitorCategory == 'COMPANY') {
        path = `/data/risk/subjectDetail?id=${record.id}`
        // 交易监控
      } else if (record.monitorCategory == 'TRADE') {
        if(record.alertType == 'YJWL') {
           path = `/data/risk/shipDetail?id=${record.id}`
        } else {
           path = `/data/risk/detail?id=${record.id}`
        }
      
        // 设备监控
      } else if (record.monitorCategory == 'DEVICE') {
        path = `/data/risk/deviceDetail?id=${record.id}`
     
        // 价格波动
      } else if (record.monitorCategory == 'MARKET_PRICE') {
        if(record.relatedContractFlag === 1) {
           path = `/data/risk/priceWarningDetail?id=${record.id}`
         } else {
          path = `/data/makeToMarket/earlyWarning/detail?id=${record.id}&serialNo=${record.serialNo}`
         }
        // 库存监控
      } else if (record.monitorCategory == 'INVENTORY') {
         path = `/data/risk/inventoryDetail?id=${record.id}`
        // 其他监控
      } else if (record.monitorCategory == 'OTHER') {
         path = `/data/risk/certDetail?id=${record.id}`
      }
      window.open(path)


    }
  },
};
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
  height: 32px;
  line-height: 32px;
}
.slDrawer2 {
  ::v-deep .ant-drawer-content-wrapper {
    width: 500px !important;
  }
  ::v-deep .ant-drawer-header {
     width: 500px !important;
     padding-left: 20px !important;
  }
  /deep/ .ant-drawer-body {
    padding-left: 0px !important;
    padding-right: 0 !important;
  }
}
.status {
  display: inline-flex;
  padding: 1px 6px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: #C5ECDD;
  color: #3EB384;

  font-family: "PingFang SC";
  font-size: 12px;
  margin-left: 20px;
}
.HIGH {
  background: #FFBEBE;
  color: var(--VI-, #D44);
}
.MEDIUM {
  color: var(--VI-, #FF800F);
  background: #FFE3C9;
}

.warn-item {
  width: 100%;
  height: 88px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(---Line, #E5E6EB);
  cursor: pointer;
  &:hover {
    background: #F1F4F6;
  }
  &-title {
    flex: 1;
    overflow: hidden;
    color: var(--text-80, rgba(0, 0, 0, 0.80));
    p:first-child {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
      width: 100%;
    }
  }
  .date {
    color: rgba(0, 0, 0, 0.40);
    margin-top: 10px;
    font-size: 12px;
  }

}
.warn-item:last-child {
  // border-bottom: 0;
}
</style>