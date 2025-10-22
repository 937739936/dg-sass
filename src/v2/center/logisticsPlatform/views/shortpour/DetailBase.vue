<template>
  <div>
    <a-descriptions bordered>
      <a-descriptions-item label="到站">{{ detail.sendStation }}</a-descriptions-item>
      <a-descriptions-item label="煤种">{{ detail.coalType }}</a-descriptions-item>
      <a-descriptions-item label="货主电话">{{ detail.shipperMobile||'--' }}</a-descriptions-item>
      <a-descriptions-item label="计划吨数(吨)">{{ detail.planWeight||'--' }}</a-descriptions-item>
      <a-descriptions-item label="派车数量上限(辆)">{{ detail.dispatchLimit ||'--'}}</a-descriptions-item>
      <a-descriptions-item label="备注">{{ detail.remark||'--' }}</a-descriptions-item>
    </a-descriptions>
    <div class="slTitleAssis">
      <span style="font-weight:bold;">派车列表</span>
      <a-button type="primary" style="margin-left:20px;" v-if="edit" @click="show">添加</a-button>
    </div>
    <a-table
      style="margin-top:20px;"
      :columns="columns"
      class="new-table new-table2"
      :bordered="false"
      rowKey="id"
      :dataSource="detail.truckList||[]"
      :pagination="false"
      :scroll="{ x: true }"
    >
      <template slot="driverName" slot-scope="text">
        {{ text||'--' }}
      </template>
      <template slot="driverMobile" slot-scope="text">
        {{ text||'--' }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a-space>
          <a @click.prevent="deleteTruck(record)">删除</a>
        </a-space>
      </template>
    </a-table> 
    <a-modal
      :visible="visible"
      title="选择车辆"
      @cancel="close"
      @ok="ok"
      :destroyOnClose="true"
      class="slModal"
    >
      <a-list
        item-layout="horizontal"
        :data-source="dataSource"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-checkbox   :checked="isChecked(item.licensePlateNumber)" @change="onCheckboxChange(item)">
            {{ item.licensePlateNumber }} {{ item.driverName }} {{ item.driverMobile }}
          </a-checkbox>
        </a-list-item>
      </a-list>
    </a-modal>
    <div style="margin-top:20px;text-align:center;">
      <a-space v-if="edit">
        <a-button @click="cancel" >取消</a-button>
        <a-button type="primary"  @click="save" :loading="saveLoading" v-if="detail.status !='FINISHED'">保存</a-button>
      </a-space>
      <a-space v-if="!edit">
        <a-button @click="back" >返回</a-button>
        <a-button type="primary"  @click="onEdit" v-if="detail.status !='FINISHED'">修改</a-button>
      </a-space>
    </div>
    
  </div>
</template>

<script>
import {
  getCoalPlanDetail,
  coalPlanAdd
} from "../../api";
import {truckListForPlan} from "../../api/shortPour";

export default {
  props:["id"],
  components:{
  },
  data(){
    return {
      columns,
      edit:false,
      visible:false,
      selectedIds:new Set,
      dataSource:[],
      detail:{},
      saveLoading:false,
    }
  },
  mounted(){
    this.getCoalPlanDetail();
    this.getList();
  },
  watch:{
    edit:function (val){
      let last = this.columns.slice(-1)[0]||{};
      if(val){
        if(last.key == "action"){
          return
        }
        this.columns.push({
          title: "操作", 
          dataIndex: "action", 
          key: "action",
          scopedSlots: { customRender: "action" }  
        })
      }else{
        if(last.key != "action"){
          return
        }
        this.columns.pop();
      }
    }
  },
  methods:{
    getList(){
      truckListForPlan({planId:this.id}).then(({success,data}) => {
        if(!success){
          return
        }
        this.dataSource = data||[];
      })
    },
    isChecked(licensePlateNumber){
      return this.selectedIds.has(licensePlateNumber);
    },
    onCheckboxChange(item){
      if(this.selectedIds.has(item.licensePlateNumber)){
        this.selectedIds.delete(item.licensePlateNumber)
      }else{
        this.selectedIds.add(item.licensePlateNumber)
      }
      this.selectedIds = new Set(Array.from(this.selectedIds));
    },
    
    deleteTruck(data){
      this.selectedIds.delete(data.licensePlateNumber);
      this.detail.truckList = this.dataSource.filter(item => this.selectedIds.has(item.licensePlateNumber));
      this.selectedIds = new Set(Array.from(this.selectedIds));
    },
    getCoalPlanDetail(){
      getCoalPlanDetail({id:this.id}).then(({success,data}) => {
        if(!success){
          return
        }
        this.detail = data;
        let selectedIds = data.truckList.map((item) => item.licensePlateNumber)
        
        this.selectedIds = new Set(selectedIds)
      })
    },
    save(){
      this.saveLoading = true;
      coalPlanAdd({...this.detail,bid:this.detail.id}).then(({success,data}) => {
        if(!success){
          return
        }
        this.$message.success("操作成功");
        this.cancel();
      }).finally(() => {
        this.saveLoading = false;
      })
    },
    ok(){
      this.detail.truckList = this.dataSource.filter(item => this.selectedIds.has(item.licensePlateNumber));
      this.close()
    },
    onEdit(){
      this.edit = true;
      
    },
    show(){
      this.visible = true;
    },
    close(){
      this.visible = false;
    },
    cancel(){
      this.edit = false;
     
      this.getCoalPlanDetail()
    },
    back(){
      this.$router.back();
    }
  }
}
const columns = [
  { title: "车牌号", dataIndex: "licensePlateNumber", key: "licensePlateNumber", },
  { title: "司机姓名", dataIndex: "driverName", key: "driverName",scopedSlots: { customRender: "driverName" } },
  { title: "联系方式", dataIndex: "driverMobile", key: "driverMobile",scopedSlots: { customRender: "driverMobile" } },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>