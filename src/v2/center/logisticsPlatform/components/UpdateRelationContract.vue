<template>
  <div>
    <a-modal
      class="slModal"
      :visible="visible"
      :title="info.type == 'update'?'修改归属合同':'关联合同'"
      @cancel="close"
      width="408px"
    >
      <p class="reminder-tips" v-if="info.type == 'update'">修改后当前归属合同的发货批次：{{batchNo}}将自动作废；同时系统将为修改后归属合同自动生成对应发货批次。</p>
      <p class="reminder-tips" v-else>修改后归属合同将自动生成对应发货批次。</p>
      <a-form class="slFormDetail" :form="form">
        <a-form-item label="当前归属合同：">
          <a-input
            placeholder="请选择计划对应业务合同"
            disabled
            v-decorator="[
              `contractNoOri`,
              {
                rules: [
                  {
                    required: !form.getFieldValue('relateOrder'),
                    message: `请选择计划归属合同或暂不关联`,
                  },
                ],
              },
            ]"
          />
          <a-checkbox
            disabled
            v-decorator="[
              `relateOrder`,
              {
                valuePropName: 'checked',
                rules: [
                  {
                    required: false,
                    message: `归属合同必填`,
                  },
                ],
              },
            ]"
          >暂不关联</a-checkbox>
        </a-form-item>
        <a-form-item label="修改后归属合同">
          <a-input
            placeholder="请选择计划对应业务合同"
            :disabled="form.getFieldValue('relateOrderAfter')"
            @click="showRelationContractList"
            v-decorator="[
              `contractNo`,
              {
                rules: [
                  {
                    required: !form.getFieldValue('relateOrderAfter'),
                    message: `请选择计划归属合同`,
                  },
                  { validator: validContract }
                ],
              },
            ]"
          />
          <a-checkbox
            @change="onChange"
            v-decorator="[
              `relateOrderAfter`,
              {
                valuePropName: 'checked',
                rules: [
                  {
                    required: false,
                  },
                  { validator: validContractChecked }
                ],
              },
            ]"
          >暂不关联</a-checkbox>
          <div class="warningTips" v-if="warningTipsFlag">修改后归属合同与修改前一致，请重新选择</div>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="visible = false"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleSubmit"> 确定 </a-button>
      </template>
    </a-modal>
    <!-- <RelationContract ref="relationContract" @detail="getRelatedData" :type="type"/> -->
  </div>
</template>

<script>
import { getPopupContainer } from "@/v2/utils/factory.js";
// import RelationContract from "./RelationContract.vue";
import {API_getBatchByCoalPlanNo,API_updateContract,API_checkContract} from "@/v2/center/trade/api/contract";

export default {
  data() {
    return {
      getPopupContainer,
      visible: false,
      acceptUserList: [],
      form: this.$form.createForm(this),
      info: {},
      batchNo: '',
      selected: '',
      warningTipsFlag: false
    };
  },
  components: {
    RelationContract
  },
  props: ['type'],
  methods: {
    show(data) {
      this.form.resetFields()
      this.info = data;
      this.visible = true;
      this.warningTipsFlag = false
      if (this.info.type === 'add') {
        this.form.setFieldsValue({
          relateOrder: true
        });
      } else {
        this.checkFunc()
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            contractNoOri: this.info.contractNo
          })
        })
      }
    },
    checkFunc() {
      API_getBatchByCoalPlanNo({coalPlanNo: this.info.serialNo}).then(res=>{
        if(!res.success){
          return
        }
        this.batchNo =  res.data.length ? res.data.join('、') : '-'
      })
    },
    close() {
      this.visible = false;
    },
    validContract(rule,value, callback){
      if(value && value === this.form.getFieldValue('contractNoOri')) {
        callback('修改后归属合同与修改前一致，请重新选择')
        return
      }
      callback()
    },
    validContractChecked(rule,value, callback){
      if(value && this.form.getFieldValue('relateOrderAfter') && this.form.getFieldValue('relateOrderAfter') === this.form.getFieldValue('relateOrder')) {
        this.warningTipsFlag = true
      } else {
        this.warningTipsFlag = false
      }
      callback()
    },
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (this.warningTipsFlag) return
          const dataObj = {
            contractNo: values.contractNo,
            orderNo: this.selected?.serialNo,
            contractType: this.selected?.contractType || this.info.contractType,
            type: this.type,
            coalPlanNoList: [this.info.serialNo],
            upContract: this.info.type === 'update'
          }
          if (dataObj?.contractType === 'OFFLINE') {
            dataObj.contractNo = this.selected?.paperContractNo
            dataObj.contractSerialNo = this.selected?.contractNo
          }
          if (dataObj?.contractType === 'ONLINE' && this.info.type === 'update' && !values.relateOrderAfter) {
            const resp = await API_checkContract({orderNo: this.selected.serialNo, type: this.type,coalPlanNo: this.info.serialNo })
            if ((resp.success && !resp.data) || !resp.success) {
              return
            }
          }
          API_updateContract(dataObj).then(res=>{
            if (res.success) {
              this.visible = false
              this.$emit('refresh')
            }
          })
        }
      })
    },
    onChange(e) {
      const { checked } = e.target;
      if(checked) {
        this.selected = null
        this.form.setFieldsValue({
          contractNo: null
        })
      }
    },
    showRelationContractList() {
      this.$refs.relationContract.showRelationOrderList();
    },
    getRelatedData(data) {
      this.selected = data
      this.form.setFieldsValue({
        contractNo: this.selected.contractType === "OFFLINE" ? data.paperContractNo : data.contractNo
      });
    },
  },
};
</script>

<style lang="less" scoped>
  .slModal {
    .slFormDetail .ant-form-item {
      height: 112px;
    }
  }
  ::v-deep.ant-checkbox-wrapper {
    margin-top: 10px;
    margin-bottom: 6px;
    .ant-checkbox-inner {
      border-radius: 5px;
    }
  }
  .warningTips {
    color: #f5222d;
    font-size: 14px;
    zoom: 0.85;
  }
  ::v-deep.ant-checkbox-wrapper {
    color: rgba(0,0,0,0.8)
  }
</style>
