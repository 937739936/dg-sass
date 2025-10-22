<template>
  <div class="returned-info">
    <div class="returned-info-top">
      <div class="returned-info-left">
        <div class="returned-info-top-item">
          <p class="c4 ft12">合同回款金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(detailInfo.contractCollectionGoodsAmount)}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">当前业务线货款金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(detailInfo.businessLineCollectionGoodsAmount)}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">当前业务线保证金金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(detailInfo.businessLineCollectionMarginAmount)}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">其他业务线金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(detailInfo.otherBusinessLineCollectionAmount)}}</p>
        </div>
        <div class="returned-info-top-item common">
          <p class="c4 ft12">未上线业务金额(元)</p>
          <p class="c8 ft20 fw600">{{formatMoney(detailInfo.noBusinessCollectionAmount)}}</p>
        </div>
      </div>
      
    </div>
    <div style="display:flex;justify-content: flex-end;">
      <a-button type='primary' class="returned-info-right" v-if="isRoleAuth && !isBank" @click="goAdd">新增回款</a-button>
    </div>
        <!-- :expandIcon='expandIcon' -->
    <div class="table-box">
      <a-table
        :columns="columns"
        class="new-table new-table2"
        :bordered="false"
        rowKey="no"

        :scroll='{x:400}'

        :expandRowByClick="false"
        :dataSource="detailInfo.collectionFlowVOList"
        :pagination="false"
      >
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          class="expanded-table"
          :columns="innerColumns"

          :data-source="record.claimedList"
          rowKey="id"
          
          :pagination="false">

          <template slot="sellerContractNo" slot-scope="text,item2">  

           <span style="margin-right:10px"> {{text}}</span> <Current v-if="item2.isCurrentSellerContractNo" style="vertical-align: middle;" />
          </template>
           <template slot="businessLineNo" slot-scope="text,item2">  
            <span style="margin-right:10px">{{text}}</span> <Current v-if="item2.isCurrentBusinessLineNo" style="vertical-align: middle;" />
          </template>
        </a-table>
        <template slot="claimStatusDesc" slot-scope="text,items">
            <!-- 状态 -->
          <span class="status">{{items.claimStatusDesc}}</span>
        </template>

        <template slot="action" slot-scope="text,items">
          <a-space :size="20" >
            <a href="javascript:;" @click="goDetail(items)" >详情</a>

            <a href="javascript:;" v-if="items.editBtnBoo && type == 'rest'" @click="goEdit(items)">修改</a>
            <a href="javascript:;"  v-if="items.delBtnBoo && type == 'rest'" @click="deleteReturn(items)" >删除</a>
          </a-space>
        </template>
      </a-table>
    </div>
    <DelModal ref="delModal" tip="确认要删除该笔回款流水吗，删除后无法恢复" title="确认删除"  @ok="confirmDelReturn"></DelModal>

  </div>
</template>

<script>

import {
ExpandClose,
ExpandOpen,
Current,
} from '@sub/components/svg'
import DelModal from '@sub/components/DelModal.vue'
import { formatMoney } from '@sub/filters'


// colums
 const columns = [
  { title: "回款编号", dataIndex: "receiveSerialNo", width: 150 },
  { title: "回款日期", dataIndex: "receiveDate" ,width: 130 },
  { title: "回款金额(元)", dataIndex: "receiveAmount" ,width: 120, customRender: t => formatMoney(t) },
  { title: "认领至本合同金额(元)", dataIndex: "contractClaimedAmount" ,width: 180, customRender: t => formatMoney(t) },
  { title: "认领至当前业务线金额(元)", dataIndex: "businessLineClaimedAmount" ,width: 205, customRender: t => formatMoney(t) },
  { title: "可认领余额(元)", dataIndex: "canClaimedAmount", width: 140, customRender: t => formatMoney(t)  },
  { title: "数据来源", dataIndex: "dataSource", width: 100, customRender: txt => txt == 2 ? '手动添加' : 'OA同步'  },
  { title: "认领状态", dataIndex: "claimStatusDesc",  scopedSlots: { customRender: "claimStatusDesc" } ,width: 100 },
  { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" },width:165},

]
export default {
  props: {
    // 回款接口
    getDownstreamCollectionInfo: {},
    // 删除回款
    delReturnedData: {},
    // 合同信息
    contractInfo: {},
    // 企业信息
    VUEX_ST_COMPANYSUER: {},
     // 金融机构
    isBank: {
      default: false,
    },
    type: {
      default: 'rest'
    }

  },
  data() {
    return {
      columns,
      innerColumns : [
        { title: "认领类型", dataIndex: "claimTypeDesc", width: 150, },
        { title: "业务线号", dataIndex: "businessLineNo", width: 150,
            customRender: (text, row, index) => {

            if (row.claimType === 'NON_FINANCING_CLAIM') {
              return {
                children: <span style='color:rgba(0, 0, 0, 0.40);font-size: 12px'>注：下游合同未在数链平台补录，或者该笔流水属于保证金等</span> ,
                attrs: {
                  colSpan: 4,
                },
              };
            }
            if(row.isCurrentBusinessLineNo) {
                return <div> {text || '-'} <Current  style="vertical-align: middle;margin-left:10px"  /> </div>
            }
            return <div> {text || '-'} </div>
          },
        },
        { title: "采购合同编号", dataIndex: "buyerContractNo", width: 150,  customRender: (value, row, index) => {
            const obj = {
              children: value || '-',
              attrs: {},
            };
            if (row.claimType === 'NON_FINANCING_CLAIM') {
              obj.attrs.colSpan = 0;
            }
            return obj;
          },
        },
        { title: "销售合同编号", dataIndex: "sellerContractNo", width: 150 ,
         customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if(row.isCurrentSellerContractNo) {
                obj.children = <div> {value || '-'} <Current  style="vertical-align: middle;margin-left:10px"  /> </div>
            } 
            if (row.claimType === 'NON_FINANCING_CLAIM') {
              obj.attrs.colSpan = 0;
            }
            return obj;
          },
        },
        { title: "收款类型", dataIndex: "paymentTypeDesc", width: 150 ,
         customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {},
            };
            if (row.claimType === 'NON_FINANCING_CLAIM') {
              obj.attrs.colSpan = 0;
            }
            return obj;
          },
        },
        { title: "认领金额(元)", dataIndex: "claimedAmount", width: 150, customRender: (value, row, index) => {

          const val = value || 0
            const obj = {
              children: formatMoney(val),
              attrs: {},
            };
            if (row.claimType === 'NON_FINANCING_CLAIM') {
              obj.attrs.colSpan = 1;
            }
            return obj;
          },
        },
      ],
      detailInfo: {
        collectionFlowVOList: [

        ]
      },
      currentItem: {},
      
    }
  },
  computed: {
    isRoleAuth() {
     return this.VUEX_ST_COMPANYSUER?.roles?.some(el => ["ADMIN","OPERATOR"].includes(el))
    },
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    formatMoney,
    expandIcon(props) {
      const {
        onExpand,
        expanded,
      } = props;


      if (expanded) {
        return <ExpandOpen onClick={onExpand} />;
      } else {
        return <ExpandClose onClick={onExpand} />;
      }
    },
    // 获取详情
    async getInfo() {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        ...this.$route.query
      }
      
      const res = await this.getDownstreamCollectionInfo(params)
      this.detailInfo = res.data 

    },
    // 去往回款详情
    goDetail(item) {
      if(this.type == 'rest') {
        window.open(`/center/fund/returned/detail?receiveSerialNo=${item.receiveSerialNo}`, '_blank')
      } else {
        window.open(`/biz/collection/water/detail?receiveSerialNo=${item.receiveSerialNo}`, '_blank')
      }
      
    },
    goAdd(item) {
    
      this.$router.push({
          path:'/center/collection/stream/add',
          query: {
              downOrderId: this.contractInfo.id,
              source:'business',
              downUscc: this.contractInfo.buyerCompanyUscc,
              businessLineNo: this.$route.query.businessLineNo,
              downCompany: this.contractInfo.buyerCompanyName,
          }
        });
    
    },
    // 编辑
    goEdit(item) {
      this.$router.push({
        path: `/center/fund/returned/add?receiveSerialNo=${item.receiveSerialNo}&id=${item.id}`, 
      })
    },
    deleteReturn(item) {
      this.currentItem = item
      this.$refs.delModal.open()
    },

    async confirmDelReturn() {

      // 删除回款
      const params = {
        receiveSerialNo: this.currentItem.receiveSerialNo
      }
      await this.delReturnedData(params)
      this.$message.success("删除成功");
      this.$refs.delModal.close()
      this.getInfo()
    },
    
  },
  components: {
    Current,
    DelModal,

  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style scoped  lang='less' >
.new-table2 {
  ::v-deep .ant-table-body {
    
  }
  ::v-deep tr.ant-table-expanded-row td {
    border-top: 1px solid #E5E6EB;
  }
  /deep/ .ant-table-row-expand-icon-cell {
    svg {
      position: relative;
      left: -3px;
      top: 3px;
    }
  }
}
.expanded-table {
  margin-top: -10px !important; 
  margin-bottom: -10px !important; 

  ::v-deep .ant-table-body {
    border: 0;
    border-radius: 0;
    font-size: 12px;
    tr:last-child td:first-child {
      border-radius: 0;
    }
    tr td {
      border-bottom: 0 !important;
      border-radius: 0 !important;
      border-top:1px solid #E5E6EB !important;
     font-size: 12px;
    }
  }
  ::v-deep .ant-table-thead {
    border-radius: 0;
    font-size: 12px;
    tr > th {
      border-top: 0;
      border-radius: 0;
    }
  }
}

.returned-info {
  margin-top: 30px;
  &-top {
    display: flex;
    justify-content: space-between;
    align-items:flex-end;
    &-item {
      width: 168px;
      height: 72px;
      flex-shrink: 0;
      padding: 12px;
      box-sizing: border-box;
      border-radius: 6px;
      background: #F0F8FF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 20px;
      &.common {
        background: #EBFAEF;
      }

    }

  }
  &-left {
    display: flex;
    align-items: center;
  }
  &-right {
    display:flex;
    width: 116px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    margin-top: 20px;
  }
  .status {
    display: inline-block;
    border-radius: 4px;
    background: #C5ECDD;
    padding: 1px 6px;
    color: #3EB384;
    font-family: PingFang SC;
    font-size: 12px;
  }
}
.c4 {
  color: rgba(0, 0, 0, 0.40);
}
.c8 {
  color: rgba(0, 0, 0, 0.80);
}
.ft12 {
  font-size: 12px;
}
.ft20 {
  font-size: 20px;
}
.fw600 {
  font-weight: 600;
}
/deep/ .ant-table-row-collapsed {
  width: 0;
  height: 0;
  border: transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid #C3C3C3;
  // border-right: 7px solid transparent;
  border-top: 5px solid transparent;
  background: transparent ;
  position: relative;
   border-radius: 0;
   
}
/deep/ .ant-table-row-collapsed:after {
   content: '';
   
}
/deep/ .ant-table-row-expanded {
    width: 0;
    height: 0;
    border: transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 7px solid #C3C3C3;
    background: transparent ;
    border-radius: 0;
 }
 /deep/ .ant-table-row-expanded::after {
  content: '';
 }
</style>
