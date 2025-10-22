<template>
  <div>
    <a-button type="primary" @click="show" style="margin: 20px 0;">选择车辆</a-button>
    <a-table
      :columns="columns"
      class="new-table"
      :bordered="false"
      rowKey="id"
      :dataSource="selectedList"
      :pagination="false"
      :scroll="{ x: true }"
    >
      <div slot="action" slot-scope="text, record">
        <a-space>
          <a @click.prevent="deleteTruck(record)">删除</a>
        </a-space>
      </div>
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
          <a-checkbox   :checked="isChecked(item.id)" @change="onCheckboxChange(item)">
            {{ item.licensePlateNumber }} {{ item.driverName }} {{ item.driverMobile }}
          </a-checkbox>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>

<script>
import {truckListForPlan} from "../api/shortPour"; 
export default {
  data(){
    return {
      columns,
      visible:false,
      selectedIds:new Set,
      selectedList:[],
      dataSource:[]
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(){
      truckListForPlan().then(({success,data}) => {
        if(!success){
          return
        }
        this.dataSource = data||[];
        
      })
    },
    isChecked(id){
      return this.selectedIds.has(id);
    },
    onCheckboxChange(item){
      if(this.selectedIds.has(item.id)){
        this.selectedIds.delete(item.id)
      }else{
        this.selectedIds.add(item.id)
      }

      this.selectedIds = new Set(Array.from(this.selectedIds));
      
    },
    deleteTruck(data){
      this.selectedIds.delete(data.id);
      this.selectedList = this.dataSource.filter(item => this.selectedIds.has(item.id));
      this.selectedIds = new Set(Array.from(this.selectedIds));
    },
    ok(){
      this.selectedList = this.dataSource.filter(item => this.selectedIds.has(item.id));
      this.close();
    },
    show(){
      this.visible = true;
    },
    close(){
      this.visible = false;
    }
  }
}
const columns = [
  { title: "车牌号", dataIndex: "licensePlateNumber", key: "licensePlateNumber", },
  { title: "司机姓名", dataIndex: "driverName", key: "driverName", },
  { title: "联系方式", dataIndex: "driverMobile", key: "driverMobile", },
  { title: "操作", dataIndex: "操作", key: "操作",scopedSlots: { customRender: "action" }  },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
