<template>
  <a-modal 
    :visible="visible" 
    title="编辑"
    class="slModal"
    forceRender
    @cancel="cancel"
  >
    <template #footer>
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="ok" :loading="saveLoading">保存</a-button>
    </template>
    <a-form 
      :form="form"
      class="slFormDetail"
    >
      <a-form-item label="车牌号">
        <a-input 
          placeholder="请输入车牌号" 
          v-decorator="['licensePlateNumber']"
        />
      </a-form-item>
      <a-form-item label="司机姓名">
        <a-input 
          placeholder="请输入司机姓名" 
          v-decorator="['driverName',  validator.limit('driverName',50)]"
        />
      </a-form-item>
      <a-form-item label="司机电话">
        <a-input 
          placeholder="请输入司机电话" 
          v-decorator="['driverMobile',validator['driverMobile'] ]"
        />
      </a-form-item>
      <a-form-item label="到站">
        <a-input 
          placeholder="请输入到站" 
          v-decorator="['sendStation', validator.limit('sendStation',50)]"
        />
      </a-form-item>
      <a-form-item label="卸货电话">
        <a-input 
          placeholder="请输入卸货电话" 
          v-decorator="['unloadedMobile',validator['driverMobile'] ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import {automobileRecordEdit} from "v2/center/logisticsPlatform/api/inout"
import {validIdTel} from "v2/utils/validForm";
export default {
  props:["id"],
  data(){
    return {
      visible:false,
      form: this.$form.createForm(this),
      saveLoading:false,
      validator:{
        "driverMobile":{ rules: [
          { validator:(rule, value, callback) => {
            if(!value){
              callback();
              return
            }
            if(!/^1\d{10}$/.test(value)){
              callback("请输入正确的电话号码");
              return
            }
            callback();
          } },
        ]},
        "unloadedMobile":{ rules: [
          { validator:validIdTel,}
        ]},
        limit:(name,length=50) => {
          return {rules:[{
          validator:(rule,value,callback) => {
            if(value && value.length > length){
              this.form.setFieldsValue({[name]:value.slice(0,length)})
            }
            callback();
          }
        }]}
        },
      }
    }
  },
  methods:{
    show({data,weightInfo}){
      this.visible = true;
      this.form.setFieldsValue({
        licensePlateNumber:weightInfo.licensePlateNumber,
        driverMobile:weightInfo.driverMobile,
        driverName:weightInfo.driverName,
        loadingDate:weightInfo.loadingDate,
        sendStation:weightInfo.sendStation,
        loadingWeight:weightInfo.loadingWeight,
        unloadedMobile:data.unloadedMobile
      })
    },
    ok(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true
        automobileRecordEdit({id:this.id,...values}).then((success,data) => {
          this.saveLoading = false
          if(!success){
            return
          }
          this.cancel()
          this.$message.success("操作成功")
          this.$emit("reload")
        }).catch(() => {
          this.saveLoading = false
        })
      })
    },
    cancel(){
      this.form.resetFields();
      this.loadingScaleFile = []
      this.visible = false;
    },
  }
}
</script>