<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span class="slTitle">磅房{{typestr}}</span>
      </div>
      <a-form 
        class="slFormDetail"
        :form="form"
      >
        <div style="display:none;" v-if="type=='edit'">
          <a-form-item label="id" >
            <a-input v-decorator="['id']"/>
          </a-form-item>
        </div>
        <a-row>
          <a-col :span="8">
            <a-form-item label="磅房名称" >
              <a-input 
                placeholder="请输入磅房名称" 
                v-decorator="['name', { rules: [
                  { required: true, message: '请输入磅房名称' },
                  { max: 30, message: '最多输入30个字符' },
                ] }]"
                v-if="type=='edit'"
              />
              <span v-else>{{detail.name}}</span>  
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态" >
              <a-select 
                v-if="type=='edit'"
                v-decorator="['enable', { rules: [{ required: true, message: '请选择状态' }] }]"
                placeholder="请选择状态"
              >
                <a-select-option :value="1">启用</a-select-option>
                <a-select-option :value="0">禁用</a-select-option>
              </a-select>
              <span v-else>{{detail.enable ? "启用":"禁用"}}</span>  
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="未预约是否允许进场" >
              <a-select 
                v-if="type=='edit'"
                v-decorator="['hasAppointment', { rules: [{ required: true, message: '请选择未预约是否允许进场' }] }]"
                placeholder="请选择未预约是否允许进场"
              >
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
              <span v-else>{{detail.hasAppointment ? "是":"否"}}</span>  
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否需要打印磅单" >
              <a-select 
                v-if="type=='edit'"
                v-decorator="['hasPrint', { rules: [{ required: true, message: '请选择未预约是否允许进场' }] }]"
                placeholder="请选择是否需要打印磅单"
              >
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
              <span v-else>{{detail.hasPrint ? "是":"否"}}</span>  
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="二次过磅前是否需要确认卸货" >
              <a-select 
                v-if="type=='edit'"
                v-decorator="['hasUnload', { rules: [{ required: true, message: '请选择是否需要确认卸货' }] }]"
                placeholder="请选择是否需要确认卸货"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
              <span v-else>{{detail.hasUnload? "是":"否"}}</span>  
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注" >
              <a-input 
                placeholder="请输入备注" 
                v-decorator="['remark', { rules: [
                  { validator:(rule,value,callback) => {
                    if(!value){
                      callback()
                      return
                    }
                    if(value.length > 100){
                      callback('最多输入100个字符')
                      return
                    }
                    callback()
                  } }
                ] }]"
                v-if="type=='edit'"
              />
              <span style="word-break: break-all" v-else>{{detail.remark||"--"}}</span>  
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    
      <a-card 
        class="tab-card"
        :bordered="false"
        :tab-list="tabList"
        :active-tab-key="tabKey"
        @tabChange="onTabChange"
      >
        <Camera :type="type" :id="id" v-if="tabKey =='1'"></Camera>
        <Print :type="type" :id="id" v-if="tabKey =='2'"></Print>
        
      </a-card>
      <div class="slDetailBottom" v-if="type == 'edit'">
        <a-space>
          <a-button @click="$router.go(-1)">返回</a-button>
          <a-button 
            type="primary" 
            @click="save" 
            :loading="saveLoading"
          >保存</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>
<script>
import {
  getEquipmentScaleDetail,
  equipmentScaleEdit
} from "../../api";
import Camera from "./weighthouse/Camera";
import Print from "./weighthouse/Print"
import Breadcrumb from "@/v2/components/breadcrumb/index";

export default {
  components:{
    Camera,
    Print,
    Breadcrumb
  },
  data(){
    return {
      type:this.$route.params?.view||"detail",
      id:this.$route.params?.id,
      typestr: this.$route.params?.view=='detail'?'详情':'编辑',
      stationId:"",
      detail:{},
      tabKey:"1",
      tabList: [
        {
          key: '1',
          tab: '监控信息',
        },
        {
          key: '2',
          tab: '打印机信息',
        },
      ],
      saveLoading:false,
      form:this.$form.createForm(this),

    }
  },
  created(){
  },
  mounted(){
    this.doFetch();
  },
  methods:{
    doFetch(){
      getEquipmentScaleDetail({id:this.id}).then(({success,data}) => {
        if(!success){
          return
        }
        this.stationId = data.stationId;
        if(this.type != "edit"){
          this.detail = data;
          return
        }
        this.form.setFieldsValue({
          id:data.id,
          name:data.name,
          hasAppointment:Number(data.hasAppointment),
          enable:Number(data.enable),
          hasPrint:Number(data.hasPrint),
          hasUnload:data.hasUnload?'1':'0',
          remark:data.remark
        })
        
      })
    },
    
    onTabChange(key){
      this.tabKey = key
    },
    handleScroll(){

    },
    save(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true;
        values.hasUnload = values.hasUnload=='1' ? true : false
        equipmentScaleEdit({...values}).then((result) => {
          this.saveLoading = false;
          if(!result.success){
            return
          }
          this.$message.success("操作成功");
          this.$router.go(-1);
        })
      })
    }

  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-table-title{
  padding-top:0;
}
::v-deep .ant-form-item label{
  white-space: break-spaces;
}
.transfer{
  display:flex;
  align-items:center;
  justify-content:center;
}
.ant-col {
  height:82px;
}
.ant-form-item {
  width: 364px;
  margin-bottom: 0;
}
.tab-card {
  padding: 0;
  ::v-deep.ant-card-head {
    height: 56px;
  }
}
.slDetailBottom {
  width: calc(100vw - 254px);
  min-width: 1186px;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 228px;
  z-index: 999;
}
</style>