<template>
  <div>
    <a-drawer
      class="slDrawer"
      :title="type==='IN'?'关联采购合同':'关联销售合同'"
      placement="right"
      :visible="orderRelationModal"
      @ok="handleSubmit"
      @close="onClose"
      :footer="null"
      destroyOnClose
    >
      <a-tabs v-model="contractType" @change="resetValuesRelation">
        <a-tab-pane key="ONLINE" tab="电子合同"> </a-tab-pane>
        <a-tab-pane key="OFFLINE" tab="线下合同"> </a-tab-pane>
      </a-tabs>
      <SlFormNew
        :list="searchList"
        layout="inline"
        ref='slFormNew'
        @change="getRelationOrderList"
        :isShowIcon="false"
        :isShowSearchBox="true"
        :colSpan="8"
      ></SlFormNew>
      <div v-if="tipMessage" class="alert-warning">
        <img src="~@/v2/assets/imgs/receive/alert-warning.png" alt="">
        {{tipMessage}}
      </div>
      <!-- 表格 -->
      <div class="table-box">
        <a-table
          class="new-table"
          :bordered="false"
          :scroll="{ x: true }"
          :rowSelection="rowSelection"
          :dataSource="relationOrderList"
          :columns="relationOrderListColumns"
          :pagination="false"
          :rowKey="(record) => record.id"
          :customRow="onClickRow"
          :loading="loading"
        >
          <template slot="contractNo" slot-scope="text, items">
            <p v-if="contractType === 'ONLINE'">{{ text }}</p>
            <p v-else>{{ items.paperContractNo }}</p>
          </template>
          <template slot="quantity" slot-scope="text, items">
            <p v-if="contractType === 'ONLINE'">{{ text }}</p>
            <p v-else>{{ items.contractQuantity }}</p>
          </template>
           <template slot="basePrice" slot-scope="text, info">
            <span v-if="info.followTheMarket">随行就市</span>
            <span v-if="info.basePrice !== undefined && info.basePrice !== null  && !info.followTheMarket && !info.basePriceDesc">
              <i v-if="info.basePrice == '随行就市'">{{info.basePrice}}</i>
              <i v-else>￥{{info.basePrice | formatMoney(2)}}/吨</i>
            </span>
            <i v-if="info.basePriceDesc && !info.followTheMarket">{{info.basePriceDesc || '-'}}</i>
          </template>

          
          <span slot="customTitle">{{type == 'IN' ? '卖方企业名称' : '买方企业名称'}}</span>
          <template slot="sellerName" slot-scope="text, items">
            <p v-if="type == 'IN' ">{{ items.sellerName }}</p>
            <p  v-else>{{ items.buyerName }}</p>

          </template>
        </a-table>
      </div>
      <i-pagination :pagination="paginationRelation" size="small" @change="handleTableChange" />
      <!-- 底部 -->
      <div class="footer">
        <a-space :size="30">
          <a-button class="cancel-btn" @click="onClose">取消</a-button>
          <a-button type="primary"  class="no-relation" @click="noRelation">暂不关联</a-button>
          <a-button type="primary" @click="handleSubmit" :disabled="!selectedRowKeys.length">确定</a-button>
        </a-space>
      </div>
    </a-drawer>
  </div>
</template>

<script>

import { filterCodeByKey } from '@sub/utils/globalCode.js';

import { getRelOrderContractList } from "../../../api/inout.js";
import {getStationDetail} from "../../../api";
import { getPopupContainer } from "@/v2/utils/factory.js";
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from "vuex";
const searchList = [
  {
    decorator: ["orderContractSerialNo"],
    addonBeforeTitle: "编号",
    type: "input",
    placeholder: "请输入订单或合同编号",
  },
  {
    decorator: ["companyName"],
    addonBeforeTitle: "企业名称",
    type: "input",
    placeholder: "请输入企业名称",
  },
   {
    decorator: ["receiverName"],
    addonBeforeTitle: "收货人",
    type: "input",
    placeholder: "请输入收货人",
  },
  {
    decorator: ["transType"],
    addonBeforeTitle: "运输方式",
    type: "select",
    placeholder: "请选择运输方式",
    // 火车运输/汽车运输/汽车和火车运输/船运运输”
    options: [],
  },
  {
    decorator: ["coalType"],
    addonBeforeTitle: "煤种",
    type: "select",
    placeholder: "请选择煤种",
    // 动力煤、焦煤、焦炭、兰炭、无烟煤、喷吹煤”
    options: [
      { value: 'STEAM_COAL', label: '动力煤' },
      { value: 'COKING_COAL', label: '焦煤' },
      { value: 'COKE', label: '焦炭' },
      { value: 'SEMI_COKE', label: '兰炭' },
      { value: 'SMOKELESS_COAL', label: '无烟煤' },
      { value: 'INJECTION_COAL', label: '喷吹煤' }
    ],
  },
  {
    decorator: ["businessType"],
    addonBeforeTitle: "业务类型",
    type: "select",
    placeholder: "请选择业务类型",
    // 应收、代理、标准仓押、代采、自营、其他”
    options: [
      { value: 'ACCOUNT_RECEIVABLE', label: '应收' },
      { value: 'AGENT', label: '代理' },
      { value: 'WAREHOUSE_RECEIPTS_PLEDGE', label: '标准仓押' },
      { value: 'SOURCING_AGENT', label: '代采' },
      { value: 'SELF_OPERATION', label: '自营' },
      { value: 'OTHER', label: '其他' },
    ],
  },
  {
    decorator: ["requestDate"],
    addonBeforeTitle: "签订日期",
    type: "rangePicker",
    realKey: ["signTimeBeginStr", "signTimeEndStr"],
  },
  {
    decorator: ["status"],
    addonBeforeTitle: "合同状态",
    type: "select",
    placeholder: "请选择合同状态",
    options: [
      { value: 'DRAFT', label: '草稿' },
      { value: 'AUDITING', label: '发起方审批中' },
      { value: 'WAIT_CONFIRM', label: '待接收方确认' },
      { value: 'AUDITING_RECEIVE', label: '接收方审批中' },
      { value: 'CONFIRM_WAIT_SIGN_SEAL', label: '待接收方盖章' },
      { value: 'WAIT_SIGN_SEAL', label: '待发起方盖章' },
      { value: 'EXECUTING', label: '执行中' },
    ],
  },
  
];
const  searchList2 = [
    {
      decorator: ["orderContractSerialNo"],
      addonBeforeTitle: "编号",
      type: "input",
      placeholder: "请输入订单或合同编号",
    },
    {
      decorator: ["companyName"],
      addonBeforeTitle: "企业名称",
      type: "input",
      placeholder: "请输入企业名称",
    },
    {
      decorator: ["receiverName"],
      addonBeforeTitle: "收货人",
      type: "input",
      placeholder: "请输入收货人",
    },
    {
      decorator: ["transType"],
      addonBeforeTitle: "运输方式",
      type: "select",
      placeholder: "请选择运输方式",
      // 火车运输/汽车运输/汽车和火车运输/船运运输”
      options: [],
    },
    {
      decorator: ["goodsName"],
      addonBeforeTitle: "品名",
      type: "input",
      placeholder: "请输入品名",
      // 动力煤、焦煤、焦炭、兰炭、无烟煤、喷吹煤”
    },
    {
      decorator: ["businessType"],
      addonBeforeTitle: "业务类型",
      type: "select",
      placeholder: "请选择业务类型",
      // 应收、代理、标准仓押、代采、自营、其他”
      options: [
        { value: 'ACCOUNT_RECEIVABLE', label: '应收' },
        { value: 'AGENT', label: '代理' },
        { value: 'WAREHOUSE_RECEIPTS_PLEDGE', label: '标准仓押' },
        { value: 'SOURCING_AGENT', label: '代采' },
        { value: 'SELF_OPERATION', label: '自营' },
        { value: 'OTHER', label: '其他' },
      ],
    },
    {
      decorator: ["requestDate"],
      addonBeforeTitle: "签订日期",
      type: "rangePicker",
      realKey: ["signTimeBeginStr", "signTimeEndStr"],
    },
    {
      decorator: ["status"],
      addonBeforeTitle: "合同状态",
      type: "select",
      placeholder: "请选择合同状态",
      options: [
        { value: 'DRAFT', label: '草稿' },
        { value: 'AUDITING', label: '发起方审批中' },
        { value: 'WAIT_CONFIRM', label: '待接收方确认' },
        { value: 'AUDITING_RECEIVE', label: '接收方审批中' },
        { value: 'CONFIRM_WAIT_SIGN_SEAL', label: '待接收方盖章' },
        { value: 'WAIT_SIGN_SEAL', label: '待发起方盖章' },
        { value: 'EXECUTING', label: '执行中' },
      ],
    },
  ]
const columns = [
  { title: "合同编号", dataIndex: "contractNo", fixed:'left',scopedSlots: { customRender: "contractNo"}},
  {  dataIndex: 'sellerName', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'sellerName' }},
  { title: "收货人", dataIndex: "consigneeCompanyName", customRender: t => t || '-'},
  { title: "交货期限", dataIndex: "deliveryStartDate", customRender: (txt, record) => {
   return record.deliveryStartDate ?  `${record.deliveryStartDate} - ${record.deliveryEndDate}` : ''
  } },
  { title: "签订日期", dataIndex: "signTime",},
  { title: "运输方式", dataIndex: "transportModeDesc", },
  { title: "数量", dataIndex: "quantity"},
  { title: "基准价格", dataIndex: "basePrice", scopedSlots: { customRender: "basePrice"}},
  { title: "品名", dataIndex: "goodsName", },
  { title: "煤种", dataIndex: "coalTypeDesc", customRender: t => t || '-' },
];
const columns2 = [
  { title: "合同编号", dataIndex: "contractNo", fixed:'left',scopedSlots: { customRender: "contractNo"}},
  {  dataIndex: 'sellerName', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'sellerName' }},
  { title: "收货人", dataIndex: "consigneeCompanyName", customRender: t => t || '-'},
  { title: "交货期限", dataIndex: "deliveryStartDate", customRender: (txt, record) => {
   return record.deliveryStartDate ?  `${record.deliveryStartDate} - ${record.deliveryEndDate}` : ''
  } },
  { title: "签订日期", dataIndex: "signTime",},
  { title: "运输方式", dataIndex: "transportModeDesc", },
  { title: "数量", dataIndex: "quantity"},
  { title: "基准价格", dataIndex: "basePrice",  scopedSlots: { customRender: "basePrice"}},
  { title: "品名", dataIndex: "goodsName", },
];
export default {
  name: "RelationContract",
  computed: {
    rowSelection() {
      const t = this;
      const { selectedRowKeys } = this;
      return {
        type: "radio",
        selectedRowKeys,
        onSelect: (record) => {
          t.selectedRowKeys = [record.id];
          t.$forceUpdate();
          t.selected = record;
        },
      };
    },
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
      VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),
    relationOrderListColumns() {
      if(this.contractType == 'ONLINE') {
        return columns
      }
      return columns2
    }
  },
  props: ["type", "relateOrderNo", 'source',"querySource", "tipMessage", "operationType"], // type=IN是关联采购合同，type=OUT是关联销售合同
  data() {
    return {
      getPopupContainer,
      signTime: null,
      typeData: filterCodeByKey("goods_type"),
      searchModalParamsRelation: {},
      selectedRowKeys: [],
      orderRelationModal: false,
      relationOrderList: [],
      paginationRelation: {
        current: 1,
        pageNo: 1,
        pageSize: 10,
      },
      selected: {}, // 关联合同被选中的数据
      contractType: "ONLINE", //合同类型，电子on,线下off
      searchList: [],
      loading: false
    };
  },
  components: {
    SlFormNew,
    iPagination
  },
  watch: {
    type: function () {
      if (this.orderRelationModal) {
        this.resetValuesRelation();
      }
    },
  },
  mounted() {
    this.searchList = searchList
    this.getStationDetail()
  },
  methods: {
    // 站台详情
    async getStationDetail() {
      const res = await getStationDetail()
      const status = res.data.stationStatus
      if(this.querySource == 'COAL_PALN'){
        this.searchList[3].options = [
          { value: 'AUTOMOBILE', label: '汽运' },
          { value: 'AUTOMOBILE_AND_TRAIN', label: '汽运和火运' },
        ]
       
        return
      }
      // 改造中
      if(status == 'IN_PROGRESS') {
        this.searchList[3].options = [
          { value: 'TRAIN', label: '火运' },
          { value: 'AUTOMOBILE', label: '汽运' },
          { value: 'AUTOMOBILE_AND_TRAIN', label: '汽运和火运' },
          { value: 'SHIP', label: '船运' },
        ]
      } else {
        this.searchList[3].options = [
          { value: 'TRAIN', label: '火运' },
          { value: 'AUTOMOBILE_AND_TRAIN', label: '汽运和火运' },
          { value: 'SHIP', label: '船运' },
        ]
      }


    },
    getRelationOrderList(data) {
      this.searchModalParamsRelation = data || {}
      this.loading = true;
      this.selectedRowKeys = [];
      this.selected = {};
      this.searchModalParamsRelation.orderType = this.type === 'IN' ? 'BUY' : 'SELL'
      if(this.contractType == 'OFFLINE') {
         this.searchModalParamsRelation.orderType = 'OFFLINE'

      }

      const params = {
        ... this.searchModalParamsRelation,
        storageGoodsInOutTypeEnum: this.type,
        stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
        pageNo: this.paginationRelation.pageNo,
        pageSize:  this.paginationRelation.pageSize,
        querySource:this.querySource ||'IN_OUT_STORAGE',
        operationType: this.operationType ?? ''
      }
      getRelOrderContractList(params).then((res) => {
        if (res.success) {
          let result = res.result || res.data;
          this.relationOrderList = result.records;
          const paginationRelation = {
            total: result.total,
            pageSize: this.paginationRelation.pageSize,
            current:  this.paginationRelation.pageNo,
            pageNo: this.paginationRelation.pageNo,
            showTotal: function (total) {
              return `共${total}条记录 第${this.paginationRelation.pageNo}页 `;
            },
          };
          this.paginationRelation = paginationRelation;
          if(this.relateOrderNo) {
            const resultIds = result.records.filter(item => (item.paperContractNo || item.contractNo )== this.relateOrderNo)[0]?.id;
            this.selectedRowKeys = [resultIds];
          }
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    //外部引用方法打开弹框
    show() {
      this.orderRelationModal = true;
      if (this.type) {
        this.resetValuesRelation();
      }
    },
    //切换头部，重置
    resetValuesRelation() {
      this.searchModalParamsRelation = {};
      this.signTime = null;
      this.relationOrderList = [];
      this.paginationRelation = {
        current: 1,
        pageNo: 1,
        pageSize: 10,
      };
      // 草稿、发起方审批中、待接收方确认、接收方审批中、待接收方盖章、待发起方盖章、执行中“
      if(this.contractType == 'ONLINE') {
        this.searchList = searchList
         this.searchList[7] = {
          decorator: ["status"],
          addonBeforeTitle: "合同状态",
          type: "select",
          placeholder: "请选择合同状态",
          options: [
            { value: 'DRAFT', label: '草稿' },
            { value: 'AUDITING', label: '发起方审批中' },
            { value: 'WAIT_CONFIRM', label: '待接收方确认' },
            { value: 'AUDITING_RECEIVE', label: '接收方审批中' },
            { value: 'CONFIRM_WAIT_SIGN_SEAL', label: '待接收方盖章' },
            { value: 'WAIT_SIGN_SEAL', label: '待发起方盖章' },
            { value: 'EXECUTING', label: '执行中' },
          ],
        }
      } else {
         this.searchList = searchList2
        // 待确认、已单签、执行中、审批中”
        this.searchList[7] = {
          decorator: ["offlineOrderStatusEnum"],
          addonBeforeTitle: "合同状态",
          type: "select",
          placeholder: "请选择合同状态",
          options: [
            { value: 'WAIT_CONFIRM', label: '待确认' },
            { value: 'SINGLE_SIGN', label: '已单签' },
            { value: 'EXECUTING', label: '执行中' },
            { value: 'DOUBLE_SIGN_AUDITING', label: '双签审批中' },
            { value: 'COMPLETED_AUDITING', label: '完结审批中' },
          ],
        }



      }
      this.getStationDetail()
      if (this.$refs.slFormNew) {
        this.$refs.slFormNew.resetSearchQuery()
      }
      
      this.getRelationOrderList();
    },
    handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10) {
      this.paginationRelation.pageSize = pageSize;
      this.paginationRelation.pageNo = pageNo;
      this.paginationRelation.current = pageNo;
      this.searchModalParamsRelation.pageNo = this.paginationRelation.current
      this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize
      this.getRelationOrderList(this.searchModalParamsRelation);
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            this.selectedRowKeys = [record.id];
            this.$forceUpdate();
            this.selected = record;
          },
        },
      };
    },
    selectHandle(data) {
      this.selectedRowKeys = [data.id];
      this.selected = data;
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warn("请选择要关联的合同");
        return
      }
      let selected = Object.assign({}, this.selected)
      selected.contractType= this.contractType
      this.orderRelationModal = false;
      this.$emit("relation", selected);
    },
    noRelation() {
      this.orderRelationModal = false;
      this.$emit("relation");
    },
    onClose() {
      this.orderRelationModal = false
      this.selectedRowKeys = []
    }
  },
};
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
  height: 32px;
  line-height: 32px;
}
::v-deep.ant-checkbox-wrapper {
  color: rgba(0,0,0,0.8)
}
.no-relation {
  border: 1px solid @primary-color;
  background: #fff;
  color: @primary-color;
}
.alert-warning {
  background: rgba(244, 131, 13, 0.1);
  border: 1px solid #FFD5B0;
  border-radius: 4px;
  line-height: 44px;
  margin-top: 20px;
  padding-left: 14px;
  color: rgba(0, 0, 0, 0.8);

  img {
    margin-right: 12px;
    height: 16px;
    width: 16px;
    vertical-align: sub;
  }
}

</style>