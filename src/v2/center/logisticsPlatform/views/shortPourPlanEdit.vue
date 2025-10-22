<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">创建下煤短倒计划</span>
      </div>
      <a-form
        :layout="'vertical'"
        :form="form"
        class="slFormDetail"
      >
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item label="到站">
              <a-input 
                v-decorator="['sendStation', { rules: [
                  { required: true, message: '请选择到站' },
                  { max:50, message: '最多50个字符' },
                ]}]"
                placeholder="请输入到站"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="煤种">
              <a-select 
                placeholder="请选择煤种"
                mode="tags" 
                @change="coalTypeChange"
                v-decorator="['coalType', { rules: [
                  { required: true, message: '请选择煤种' },
                ]}]"
              >
                <a-select-option 
                  v-for="item in coalTypeAllList"
                  :value="item.name"
                  :key="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="计划吨数">
              <a-input 
                v-decorator="['planWeight', { rules: [
                  { validator:(rule,value,callback) => {
                    if(!value ){
                      callback();
                      return
                    }
                    value = Number(value);
                    if(isNaN(value)){
                      callback('请输入数字')
                      return
                    }
                    if(value <= 0){
                      callback('必须大于0')
                      return
                    }
                    if(!/^\d{1,}(\.\d{1,4})?$/.test(value)){
                      callback('最多4位小数')
                      return
                    }
                    if(value > 999999.9999){
                      callback('最大999999.9999')
                      return
                    }
                    callback();
                  } },
                ]}]"
                placeholder="请输入计划吨数"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item label="货主电话">
              <a-input 
                v-decorator="['shipperMobile', { rules: [
                  { validator:(rule,value,callback) => {
                    if(!value){
                      callback();
                      return
                    }
                    if(value.length > 20 ){
                      callback('不能超过20个字符')
                      return
                    }
                    callback();
                  }}
                ]}]"
                placeholder="请输入货主电话"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="派车数量上限">
              <a-input 
                v-decorator="['dispatchLimit', { rules: [
                  { validator: (rule,value,callback) => {
                    if(!value && value !== 0){
                      callback()
                      return
                    }
                    if(!/^\d{1,}$/.test(value)){
                      callback('必须为正整数')
                      return
                    }
                    value = Number(value);
                    if(value > 99999 || value <= 0){
                      callback('必须为1-99999之间的数字')
                      return
                    }
                    callback()
                  } },
                ]}]"
                placeholder="请输入派车数量上限"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="16">
            <a-form-item label="描述">
              <a-textarea
                v-decorator="['remark', { rules: [
                  { validator:(rule,value,callback) => {
                    if(!value){
                      callback()
                      return
                    }
                    if(value.length > 200){
                      callback('最多输入200个字符')
                      return
                    }
                    callback()
                  }},
                  ]}]"
                placeholder="请输入描述"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="24">
            <a-form-item label="派车列表" >
              <SelectCars ref="selectCars"></SelectCars>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="slDetailBottom">
        <a-space>
          <a-button @click="back">返回</a-button>
          <a-button type="primary" @click="save" :loading="saveLoading" v-if="isSupportShort">保存</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  getCoalTypeAllList,
  coalPlanAdd
} from "../api";
import {
  searchShortPlanStatus,
} from "../api/shortPour";
import SelectCars from "../components/SelectCars";
import Breadcrumb from "@/v2/components/breadcrumb/index";
export default {
  components:{
    SelectCars,
    Breadcrumb
  },
  data(){
    return {
      isSupportShort:false,
      form:this.$form.createForm(this),
      coalTypeAllList:[],
      houseList:[],
      goodsAllocationMap:{},
      saveLoading:false,
      
      
    }
  },
  mounted(){
    this.searchShortPlanStatus();
    this.getCoalTypeAllList();
  },
  methods:{
    searchShortPlanStatus(){
      searchShortPlanStatus().then(({success,data}) => {
        if(!success){
          return
        }
        this.isSupportShort = data.status  == "OPEN"
      })
    },
    getCoalTypeAllList(){
      getCoalTypeAllList().then(({success,data}) => {
        if(!success){
          return
        }
        this.coalTypeAllList = data;
      })
    },
    coalTypeChange(values){
      let timer = setTimeout(() => {
        clearTimeout(timer)
        let text = (values.slice(-1)[0]||'').substr(0,30);
        this.form.setFieldsValue({
          coalType:[text]
        })
      },1)
    },
    save(){
      let truckList = this.$refs.selectCars.selectedList
      this.form.validateFields((error,value) => {
        if(error){
          return
        }
        let val = {...value,coalType:value.coalType.join(""),truckList,type:"SHORT"}
        this.saveLoading = true;
        coalPlanAdd(val).then(({success}) => {
          if(!success){
            return
          }
          this.$message.success("操作成功")
          this.back();
        }).finally(() => {
          this.saveLoading = false;
        })
      })
    },
    back(){
      this.$router.back();
    }
  }
}
</script>

<style lang="less" scoped>
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