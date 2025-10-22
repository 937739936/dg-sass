<template>
  <div class="table-box">
    <a-table
      class="new-table"
      :bordered="false"
      :columns="cameraColumns"
      :rowKey="(record) => record.id"
      :dataSource="data"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: true }"
    >
      <template slot="remark" slot-scope="remark">
        <a-tooltip>
          {{(remark||"").substr(0,20)}}
          <template slot="title" v-if="(remark||'').length >20">{{remark}}</template>
          <template v-if="(remark||'').length >20">....</template>
        </a-tooltip>
      </template>
      <!-- <template #title v-if="type=='edit'"> 
        <a-button type="primary" @click.prevent="openChangeCameras" >关联摄像头</a-button>
      </template> -->
    </a-table>
    <!-- <a-modal 
      :visible="camarasVisible" 
      @ok="saveChangeCamaras"
      @cancel="cancelChangeCamaras"
      title="关联摄像头" 
    >
      <template #footer>
        <a-button @click="cancelChangeCamaras">取消</a-button>
        <a-button type="primary" @click="saveChangeCamaras" :loading="saveCamarasLoading">保存</a-button>
      </template>
      <a-transfer
        class="transfer"
        :dataSource="camarasList"
        :titles="['未选中摄像头', '已选中摄像头']"
        :targetKeys="targetKeys"
        :selectedKeys="selectedKeys"
        :render="item => item.title"
        @change="handleChange"
        @selectChange="handleSelectChange"
      >
      </a-transfer>
    </a-modal> -->
  </div>
</template>

<script>
import {
  getEquipmentScaleCameraListRel,
  getEquipmentScaleCameraAllList,
} from "../../../api";
const cameraColumns = [
  {
    title: "监控名称",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "类型",
    key: "userTo",
    dataIndex: "userTo",
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
  },
]
export default {
  props:["type","id"],
  data(){
    return {
      cameraColumns,
      data:[],
      loading:true,
      targetKeys:[],
      selectedKeys:[],
      camarasVisible:false,
      saveCamarasLoading:false,
      camarasList:[]
    }
  },
  mounted(){
    this.getEquipmentScaleCameraListRel();
    if(this.type == "edit"){
      this.getEquipmentScaleCameraAllList();
    }
  },
  methods:{
    
    handleChange(keys){
      this.targetKeys = keys;
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys){
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
    
     //已关联摄像头信息
    getEquipmentScaleCameraListRel(){
      getEquipmentScaleCameraListRel({scaleId:this.id}).then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.data = data;
        if(this.type == "edit"){
          this.targetKeys = data.map((item) => item.id );
        }
      })
    },
    //获取所有摄像头信息
    getEquipmentScaleCameraAllList(){
      getEquipmentScaleCameraAllList({scaleId:this.id}).then(({success,data}) => {
        if(!success){
          return
        }
        this.camarasList = data.map((item) => {
          return {
            key: item.id,
            title: item.name,
            description: item.remark,
          }
        });
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>