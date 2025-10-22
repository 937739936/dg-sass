<template>
  <a-modal width="1000px" id="orderModal" title="订单查询" v-model="visible">
    <template slot="footer">
      <a-button key="back" @click="visible = false">取消</a-button>
    </template>
    <a-form layout="inline">
      <a-row>
        <a-col :span="8">
          <a-form-item label="订单编号" class="order-wrap" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
            <a-input v-model="params.orderSerialNo" placeholder="请选择订单编号"> </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同编号" class="order-wrap" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
            <a-input v-model="params.contractNo" placeholder="请选择合同编号"> </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="企业名称" class="order-wrap" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
            <a-input v-model="params.counterParty" placeholder="请输入企业名称"> </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="煤种" class="order-wrap" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
            <!-- <a-input v-model="params.sellerName"> </a-input> -->
            <a-select
              style="width: 100%"
              v-model="params.coalType"
              placeholder="请选择">
              <a-select-option
                v-for="(items, index) in typeData"
                :key="index"
                :value="items.value">
                {{ items.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="签订日期" class="order-wrap" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
            <a-range-picker v-model="date" valueFormat="YYYY-MM-DD" />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="8" v-show="false">
          <a-form-item label="买方" class="order-wrap" :colon="false">
            <a-input v-model="params.buyerName"> </a-input>
          </a-form-item>
        </a-col> -->
        <a-col :span="8">
          <a-form-item style="text-align: center;">
            <a-button type="primary" @click="searchSubmit" class="search-btn mr16">
              查询
            </a-button>
            <a-button html-type="reset" @click="resetValues"> 重置 </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      class="mt16"
      bordered
      :rowSelection="rowSelection"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: true }"
      rowKey="contractNo"
      :customRow="onClickRow"
      @change="handleTableChange"
    >
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
  </a-modal>
</template>
<script>
  import iPagination from "@sub/components/iPagination";
  import { filterCodeByKey } from '@sub/utils/globalCode.js';
  import {
    API_BUYCONTRACTLIST,
  } from 'api';

  const columns = [
    {
      title: "合同编号",
      dataIndex: "contractNo",
      fixed: 'left',
    },
    {
      title: "卖方企业名称",
      dataIndex: "sellCompany",
    },
    {
      title: "买方企业名称",
      dataIndex: "buyCompany",
    },
    {
      title: "煤种",
      dataIndex: "coalTypeDesc",
    },
    {
      title: "品名",
      dataIndex: "goodsName",
    },
    {
      title: "运输方式",
      dataIndex: "transTypeDesc",
    },
    {
      title: "数量",
      dataIndex: "quantity",
    },
    {
      title: "基准价格",
      dataIndex: "basicPrice",
    },
    {
      title: "签订日期",
      dataIndex: "signTime",
    },
    {
      title: "交货期限",
      dataIndex: "createTime",
      customRender: (text, record) => {
        return `${record.deliveryDateBegin} 至 ${record.deliveryDateEnd}`
      }
    },
    {
      title: "订单编号",
      dataIndex: "orderSerialNo",
    },
  ]

  export default {
  name: 'CargoManageList',
  data() {
      return {
        columns,
        date: [],
        dataSource: [],
        typeData: filterCodeByKey('goods_type'),
        visible: false,
        params: {},
        selectedRowKeys: [],
        pagination: {
          total: 0, // 总条数
          pageNo: 1,
        },
      }
    },
    components: {
    iPagination,
  },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this;
        const t = this;
        return {
          type: "radio",
          selectedRowKeys: selectedRowKeys,
          onSelect: (record) => {
            t.selectedRowKeys = [record.contractNo];
            t.$emit('getOnlineContractDetail', record.contractNo)
            t.visible = false
          },
        };
      },
    },
    methods: {
      handleTableChange(pagination) {
        this.params.pageNo = pagination.current;
        this.getList();
      },
      onClickRow(record) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [record.contractNo];
              this.$emit('getOnlineContractDetail', record.contractNo)
              this.visible = false
            },
          },
        };
      },
      showModal () {
        this.visible = true;
        this.getList()
      },
      getList(pageNo = this.pagination.pageNo, pageSize = 10) {
        this.pagination.pageNo = pageNo;
        this.params.pageNo = pageNo;
        this.params.pageSize = pageSize;
        this.params.minDeliveryDateBegin = this.date[0]
        this.params.maxDeliveryDateBegin = this.date[1]
        API_BUYCONTRACTLIST(this.params).then((res) => {
          this.dataSource = res.result.records || {};
          this.pagination.total = res.result.total;
        });
      },
      searchSubmit() {
        this.params.pageNo = 1;
        this.pagination.pageNo = 1;
        this.getList();
      },
      resetValues() {
        this.params =  {}
        this.date = []
        this.pagination.pageNo = 1
        this.getList()
      },
    }
  }
</script>
<style lang="less" scoped>
  .order-wrap{
    width: 100%;
  }
</style>

