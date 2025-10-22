<template>
  <a-modal
    title="选择合同"
    width="1100px"
    class="contract-list-gbb"
    destroyOnClose
    @ok="handleOk"
    style="top:20px"
    v-model="visible"
    :zIndex="9999"
    >
    <div slot="closeIcon"><i  class="icon-danchuang-closeicon iconfont" style="fontSize:25px"></i></div>
    <a-form  layout="inline" :form="form" class="search-wrap">
        <a-form-item label="" class="order-wrap col" :colon="false">
          <SlInput addonBeforeTitle='卖方名称' @blur="getList(1)" v-model="params.sellerName"  placeholder="请输入"></SlInput>
        </a-form-item>
        <a-form-item label=""  class="order-wrap col" :colon="false">
          <SlInput addonBeforeTitle='买方名称' @blur="getList(1)" v-model="params.buyerName"  placeholder="请输入"></SlInput>
        </a-form-item>
        <a-form-item label=""  class="order-wrap col" :colon="false">
          <SlInput addonBeforeTitle='合同编号' @blur="getList(1)" v-model="params.contractNo"  placeholder="请输入"></SlInput>
        </a-form-item>
        <a-form-item label=""  class="order-wrap col" :colon="false">
          <SlInput addonBeforeTitle='订单编号' @blur="getList(1)" v-model="params.orderNo"  placeholder="请输入"></SlInput>
        </a-form-item>
    </a-form>
    <div class="table-wrap">
      <a-table
        :rowSelection="rowSelection"
        :columns="columns"
        class="new-table"
        :rowKey="(record) => record.orderNo"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: true }">
        <template slot="basePrice" slot-scope="text, items">
          {{items.followTheMarket?'随行就市': (text || items.basePriceDesc)}}
        </template>
      </a-table>
    </div>
    <i-pagination size='small' :pagination="pagination" @change="getList" v-show='params.pageSize < pagination.total'  />
  </a-modal>
</template>

<script>

  import iPagination from "@sub/components/iPagination";
  import { filterCodeByValueName } from '@sub/utils/globalCode.js'
  import {getContractList} from  '@/v2/center/steels/api/invoice.js'
  import {cloneDeep} from 'lodash'
  import SlInput from '@sub/components/ui-new/Form/sl-input.vue'
  const columns = [
    {
      title: '卖方',
      fixed: 'left',
      dataIndex: 'sellerName',
    },
    {
      title: '买方',
      dataIndex: 'buyerName',
    },
    {
      title: '合同数量(吨)',
      dataIndex: 'quantity',
      customRender: (text) => {
        return text?.toLocaleString()
      }
    },
    {
      title: '合同单价(元/吨)',
      dataIndex: 'basePrice',
      scopedSlots: { customRender: "basePrice" }
    },
    {
      title: '运输方式',
      dataIndex: 'transportMode',
      customRender: (text) => {
        return filterCodeByValueName(text,'despatchTypeDict') ||filterCodeByValueName(text,'offlineTransTypeDict') || text
      }
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      customRender: (text, record) => {
        return  record.contractId == record.orderNo ? '' : text
      }
    }
  ]

  export default {
    name: 'ContractList',

    props: {
      type: {
        type: String,
        default: ''
      },
      selectCheckType: {
        type: Number,
        default: 0
      }
    },
    components: {
      iPagination,
      SlInput
    },
    data() {
      return {
        columns,
        form: this.$form.createForm(this),
        visible: false,
        dataSource: [],
        selectedRowData: [],
        params: {
          pageSize: 10,
        },
        loading: false,
        selectedRowKeys: [],
        lineData: {},
        pagination: {
          type: '',
          total: 0,
          pageNo: 1
        },
        invoiceId:'' //发票id
      };
    },
    computed: {
      rowSelection() {
        const itSelf = this
        const { selectedRowKeys } = this
        return {
          type: this.selectCheckType == 1 ? 'radio' : 'checkbox',
          selectedRowKeys: selectedRowKeys,
          getCheckboxProps: record => ({
            props: {
              disabled: (this.disabledRowKeys || []).includes(record.orderNo)
            },
          }),
          onSelect: (record) => {
            if(this.selectCheckType == 1) {
              itSelf.selectedRowKeys = [record.orderNo]
              itSelf.selectedRowData = [record]
              return
            }
            if (itSelf.selectedRowKeys.includes(record.orderNo)) {
              itSelf.selectedRowKeys.splice(itSelf.selectedRowKeys.findIndex(item => item === record.orderNo), 1)
              itSelf.selectedRowData.splice(itSelf.selectedRowKeys.findIndex(item => item === record.orderNo), 1)
            } else {
              itSelf.selectedRowKeys = [ ...itSelf.selectedRowKeys, record.orderNo]
              itSelf.selectedRowData = [ ...itSelf.selectedRowData, record]
            }
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            if (selected) {
              const tempArr = selectedRows.map((item) => {
                return item.orderNo
              })
              itSelf.selectedRowKeys = [...new Set([...tempArr, ...itSelf.selectedRowKeys])]
              itSelf.selectedRowData = [...new Set([...selectedRows, ...itSelf.selectedRowKeys])]
            } else {
              // 待剔除合同
              const tempArr = changeRows.map((item) => {
                return item.orderNo
              })
              const selectedRowKeysCopy  = [...itSelf.selectedRowKeys]

              itSelf.selectedRowKeys.forEach((item) => {
                if (tempArr.includes(item)) {
                  selectedRowKeysCopy.splice(selectedRowKeysCopy.findIndex(i => item === i), 1)
                  itSelf.selectedRowData.splice(selectedRowKeysCopy.findIndex(i => item === i), 1)
                }
              })
              itSelf.selectedRowKeys = selectedRowKeysCopy
            }
          },
        };
      }
    },
    methods: {
      showModal (orderNoList, hasPamentOrderNoList,invoiceId) {
        this.invoiceId = invoiceId || ''
        this.visible = true
        this.pagination.pageNo = 1
        this.selectedRowKeys = cloneDeep(orderNoList || [])
        this.selectedRowData = []
        this.disabledRowKeys = hasPamentOrderNoList || []
        this.getList()
      },

      handleOk () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.error('请至少选择一条行数据');
        } else {
          this.visible = false
          this.$emit('getContract', this.selectedRowKeys, this.selectedRowData, this.selectCheckType)
        }
      },

      async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
        this.pagination.pageNo = pageNo;
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
        this.loading = true;
        const params = {
          ...this.params,
          type: this.$route.query.invoiceType,
          industryType: this.$route.query.industryType,
        }
        if(this.$route.query.invoiceType == 'DELIVER') {
          params.invoiceId = this.invoiceId;
        }
        try {
          const res = await  getContractList(params)
          res.data.records.forEach(el => {
            el.orderNo = el.orderNo || el.contractId
          })
          this.dataSource = res.data.records;
          this.pagination.total = res.data.total;
        } catch (error) {
          
        } finally {
          this.loading = false;
        }
        
      },

      search() {
        this.pagination.pageNo = 1;
        this.getList();
      },

      reset() {
        this.params = {
          pageSize: 10,
        };
        this.pagination.pageNo = 1;
        this.getList();
      },

      /*onClickRow(record) {
        return {
          on: {
            click: () => {
              this.lineData = record
              this.selectedRowKeys = [record.lineNo];
            }
          }
        };
      },*/
    }
  };
</script>
<style lang="less">
  .contract-list-gbb {
    .ant-modal-header {
      border-bottom: 0;
      .ant-modal-title {
        font-weight: 600;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(0,0,0,0.8);
      }

    }
    .ant-modal-footer {
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: 0;
    }
  }
</style>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
  .search-btn{
    margin-left: 100px;
  }
  .search-wrap {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .order-wrap {
      margin-bottom: 20px;
      // max-width: 300px;
      margin-right: 20px;
    }
    .row:nth-child(even) {
      .order-wrap {
        label {
          width: 78px;
        }
      }
    }
  }
  .setting-icon {
    display: inline-block;
    margin-left: 2px;
    font-size: 15px;
  }
  /deep/ .form-input {
    width: 400px;
  }
</style>