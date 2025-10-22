<template>
<div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">下煤短倒配置</span>
      </div>
      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-item label="是否添加短倒管理模块">
            <a-radio-group name="radioGroup" :value="status" @change="radioChange('status',$event)" >
              <a-radio :value="'OPEN'">添加</a-radio>
              <a-radio :value="'CLOSE'">不添加</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-item label="是否允许重复称重">
            <a-radio-group name="radioGroup" :value="hasRepeatWeigh"  @change="radioChange('hasRepeatWeigh',$event)">
              <a-radio :value="1">允许</a-radio>
              <a-radio :value="0">不允许</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="status === 'OPEN'">
        <!-- 查询区域 -->
        <SlFormNew
          :list="searchList"
          layout="inline"
          @change="handleChange"
        ></SlFormNew>
        <a-button style="margin-top: 20px;" type="primary" @click="showAddModal">添加短倒车辆</a-button>
        <div class="table-box" >
          <a-table
            :columns="columns"
            class="new-table"
            :bordered="false"
            rowKey="id"
            :dataSource="dataSource"
            :pagination="false"
            :scroll="{ x: true }"
          >
            <div slot="action" slot-scope="text, record">
              <a-space>
                <a  @click.prevent="deleteTruck(record)">删除</a>
              </a-space>
            </div>
          </a-table>
        </div>
      </template>
    </a-card>
    
    <a-modal 
      :visible="visible" 
      title="添加短倒车辆"
      @cancel="closeAddModal"
      :destroyOnClose="true"
      class="slModal"
      width="408px"
    >
      <template slot="footer">
        <a-space>
          <a-button type="primary" @click="closeAddModal"  ghost>取消</a-button>
          <a-button type="primary" @click="save" :loading="saveLoading">保存</a-button>
        </a-space>
      </template>
      <a-form
        :form="form"
        class="slFormDetail"
      >
        <a-row :gutter="20">
          <a-col :span="24">
            <a-form-item label="车牌号">
              <a-input 
                v-decorator="['licensePlateNumber', { rules: [
                  { required: true, message: '请输入车牌号' },
                  { validator:validLicencePlate}
                ]}]"
                placeholder="请输入车牌号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="司机姓名">
              <a-input 
                v-decorator="['driverName', { rules: [
                  { required: true, message: '请选择司机姓名' },
                  { max: 30, message: '最多30个字符' },
                ]}]"
                placeholder="请输入司机姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系方式">
              <a-input 
                v-decorator="['driverMobile', { rules: [
                  { required: true, message: '请选择联系方式' },
                  { pattern:/^[1-9]\d{10}$/, message: '联系方式不正确' },
                ]}]"
                placeholder="请输入联系方式"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  searchShortPlanStatus,
  useShortPlan,
  addTruck,
  deleteTruck,
  truckList
} from "../../api/shortPour";
import {validLicencePlate} from "@/v2/utils/validForm";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
const searchList = [
  {
    decorator: ["licensePlateNumber"],
    addonBeforeTitle: "车牌号",
    type: "input",
    placeholder: "请输入车牌号",
  }
]
export default {
  mixins: [ListMixin],
  data(){
    return {
      bid:null,
      columns,
      list:[],
      searchParams:{},
      form:this.$form.createForm(this),
      visible:false,
      saveLoading:false,
      status:'CLOSE',
      hasRepeatWeigh:0,
      validLicencePlate,
      selfLoad: true,
      url: {
        list: truckList
      },
      searchList,
    }
  },
  mounted(){
    this.searchShortPlanStatus();
    
  },
  methods:{
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    searchShortPlanStatus(){
      searchShortPlanStatus().then(({success,data}) => {
        if(!success){
          return
        }
        this.status = data.status 
        this.hasRepeatWeigh = Number(data.hasRepeatWeigh ||0)
        this.bid = data.bid;
        this.truckList();
      })
    },
    deleteTruck(data){
      this.$confirm({
        title:"确定删除?",
        onOk:() => {
          deleteTruck({id:data.id}).then((data) => {
            if(!data.success){
              return
            }
            this.$message.success("操作成功")
            this.truckList();
          });
        }
      })
      
    },
    confirm(){
      return new Promise((resolve) => {
        this.$confirm({
          title:"是否确定修改?",
          onOk:() => {
            resolve(true)
          },
          onCancel:() => {
            resolve(false)
          }
        })
      })
    },
    async radioChange(field,e){
      let isok = await this.confirm();
      if(!isok){
        this.searchShortPlanStatus()
        return
      }
      this[field] = e.target.value
      let params = {status:this.status,hasRepeatWeigh:this.hasRepeatWeigh};
      
      if(this.bid){
        params.bid = this.bid;
      }
      useShortPlan(params).then((data) => {
        if(!data.success){
          return
        }
      }).catch(() => {
        this.searchShortPlanStatus()
      })
    },
    showAddModal(){
      this.visible = true
    },
    closeAddModal(){
      if(this.saveLoading){
        return;
      }
      this.visible = false;
    },
    truckList(){
      if(this.status !== 'OPEN'){
        return;
      }
      this.getList()
    },
    save(){
      this.form.validateFields((errors,values) => {
        if(errors){
          return
        }
        this.saveLoading=true;
        addTruck({...values}).then((data) => {
          if(!data.success){
            return;
          }
          this.saveLoading=false;
          this.closeAddModal();
          this.truckList();
        }).finally(() => {
          this.saveLoading=false;
        })
      })
    }
  }
}
const columns = [
{ title: "车牌号", dataIndex: "licensePlateNumber", key: "licensePlateNumber", },
{ title: "司机姓名", dataIndex: "driverName", key: "driverName", },
{ title: "联系方式", dataIndex: "driverMobile", key: "driverMobile", },
{ title: "操作", dataIndex: "操作", key: "操作", scopedSlots: { customRender: "action" } },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
.a-space-wrap{
  /deep/.ant-input-affix-wrapper .ant-input:not(:first-child){
    padding-left:65px;
  }
}
.slModal {
  .slFormDetail {
    padding:0!important
  }
}
.special-item {
  height: auto!important;
}
</style>