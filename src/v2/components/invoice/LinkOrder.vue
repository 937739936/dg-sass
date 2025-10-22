<template>
  <div>
    <a-modal v-model="show" title="订单查询" width="1200px" @ok="ok">
      <a-form-model :labelCol="{ span: 8 }" :wrapperCol="{ span: 13 }">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="订单编号">
              <a-input v-model="queryForm.orderSerialNo"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号">
              <a-input v-model="queryForm.contractNo"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="卖方名称">
              <a-input v-model="queryForm.sellerName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="4" offset="7">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="reset">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-table
          :rowKey="(record) => record.orderId"
          :dataSource="list"
          :columns="columns"
          :rowSelection="rowSelection"
          :pagination="page"
          @change="pageChange"
        >
        </a-table>
      </a-form-model>
    </a-modal>
    <a-modal v-model="splitModal" @ok="submitSplit" width="1000px">
      <h3>发票拆分</h3>
      <SplitInvoiceInfo ref="SplitInvoiceInfo" :dataSource="invoicesInfo"></SplitInvoiceInfo>
    </a-modal>
  </div>
</template>

<script>
/**
 * 发票关联订单组件
 * @prop single Boolean 是否为单选 非必选 默认为false。
 * */
import { API_GET_LINKORDER, API_INVOICES_LINK_ORDER } from "@/v2/api/common";
import SplitInvoiceInfo from "./SplitInvoiceInfo.vue";
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
export default {
  name: "LinkInvoice",
  components: {
    SplitInvoiceInfo,
  },
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    rowSelection() {
      return {
        type: this.isRadio ? "radio" : "checkbox",
        onChange: (selectedRowKeys, selectedRow) => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedRow = selectedRow;
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectedKey = selectedRowKeys;
        },
        selectedRowKeys: this.selectedKey,
      };
    },
  },
  data() {
    return {
      isRadio: this.single,
      show: false,
      list: [],
      columns: [
        {
          align: "center",
          title: "订单编号",
          dataIndex: "orderSerialNo",
        },
        {
          align: "center",
          title: "卖方名称",
          dataIndex: "sellerName",
        },
        {
          align: "center",
          title: "买方名称",
          dataIndex: "buyerName",
        },
        {
          align: "center",
          title: "结算类型",
          dataIndex: "settlementType",
          customRender: (text) => {
            return filterCodeByValueName(text, "settleModeDict");
          },
        },
        {
          align: "center",
          title: "合同数量",
          dataIndex: "quantity",
        },
        {
          align: "center",
          title: "合同单价",
          dataIndex: "basicPrice",
        },
        {
          align: "center",
          title: "运输方式",
          dataIndex: "transType",
          customRender: (text) => {
            return filterCodeByValueName(text, "despatchTypeDict");
          },
        },
        {
          align: "center",
          title: "订单创建日期",
          dataIndex: "createTime",
        },
        {
          align: "center",
          title: "合同编号",
          dataIndex: "contractNo",
        },
      ],
      selectedRow: [],
      allRow: [],
      selectedKey: [],
      queryForm: {
        orderSerialNo: "",
        contractNo: "",
        sellerName: "",
      },
      page: {
        current: 1,
        total: 0,
      },
      invoicesInfo: [],
      splitModal: false,
    };
  },
  methods: {
    async init(selected) {
      /**
       * 在发票列表中
       * @selected object[ ] 初始化数据 当前已选中的数据
       *
       * */
      //去重
      let _arr = [];
      selected.forEach((item) => {
        let isExist = _arr.some((item2) => {
          //发票详情关联订单 orderId 作为key
          if (this.step === 1) {
            return item2.orderId === item.orderId;
          } else {
            //发票列表 id作为key
            return item2.id === item.id;
          }
        });
        if (!isExist) {
          _arr.push(item);
        }
      });

      if (this.step === 1) {
        this.selectedKey = _arr.map((item) => item.orderId);
        this.selectedRow = _arr;
      } else {
        this.invoicesInfo = _arr.map((item) => item);
        this.isRadio = _arr.length > 1;
      }
      this.show = true;
      this.query();
    },
    ok() {
      this.shake();
      if (this.selectedKey.length === 0) {
        this.$message.error("请选择需要关联的订单");
        return;
      }
      if (this.step === 1) {
        this.$emit("update", this.allRow);
      } else {
        //多个发票关联单个订单
        if (this.isRadio) {
          //订单编号
          let orderSerialNo = this.selectedRow[0].orderSerialNo;
          let orderAmount = this.selectedRow[0].quantity;
          let orderId = this.selectedRow[0].orderId;
          //订单数量

          //更新发票信息给拆分用
          this.invoicesInfo.forEach((item) => {
            item.orderSerialNo = orderSerialNo;
            item.orderAmount = orderAmount;
            item.orderId = orderId;
          });
        } else {
          //单张发票关联多个订单
          let tempArr = [];

          this.allRow.forEach((item) => {
            const _data = Object.assign({}, this.invoicesInfo[0]);
            _data.orderSerialNo = item.orderSerialNo;
            _data.orderAmount = item.quantity;
            _data.orderId = item.orderId;
            tempArr.push(_data);
          });
          this.invoicesInfo = tempArr;
        }

        this.splitModal = true;
      }

      this.show = false;
    },
    async query(current) {
      const pageNo = isNaN(current) ? 1 : current;
      const queryParams = Object.assign({}, this.queryForm, { pageNo: pageNo });
      let res = await API_GET_LINKORDER(queryParams);
      if (res.success) {
        this.list = res.result.records;
        this.$set(this.page, "total", res.result.total);
      }
    },
    reset() {
      this.queryForm = {
        orderSerialNo: "",
        contractNo: "",
        sellerName: "",
      };
      this.query();
    },
    async submitSplit() {
      //提交发票拆分
      let data = this.$refs.SplitInvoiceInfo.checkSplitAmount();
      let sendData = [];

      data.forEach((item) => {
        sendData.push({
          no: item.no,
          orderId: item.orderId,
          splitAmount: item.splitAmount,
          totalAmount: item.totalAmount,
        });
      });

      if (sendData.length) {
        let res = await API_INVOICES_LINK_ORDER(sendData);
        if (res.success) {
          this.$message.success("发票关联订单成功！");
          this.splitModal = false;
          this.$emit("update");
        }
      }
    },
    pageChange(pagination) {
      this.$set(this.page, "current", pagination.current);
      this.query(pagination.current);
    },
    //去除 key不存在的数据
    shake() {
      for (let i = 0; i < this.allRow.length; i++) {
        if (this.selectedKey.indexOf(this.allRow[i].orderId) === -1) {
          this.allRow.splice(i, 1);
          this.shake();
          break;
        }
      }
    },
  },
  watch: {
    show(isShow) {
      if (!isShow) {
        this.queryForm = {
          orderSerialNo: "",
          contractNo: "",
          sellerName: "",
        };
        this.selectedRow = [];
        this.selectedKey = [];
        this.page = {
          current: 1,
          total: 0,
        };
      }
    },
    selectedRow(n) {
      n.forEach((item) => {
        let isExist = this.allRow.some((item2) => {
          return item.orderId === item2.orderId;
        });
        if (!isExist) {
          this.allRow.push(item);
        }
      });
    },
  },
};
</script>

<style scoped></style>
