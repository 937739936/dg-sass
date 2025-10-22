<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span class="slTitle">货位管理</span>
      </div>
      <a-form
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        :form="form"
        :colon="false"
        class="slFormDetail"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item label="货位名称">
              <a-input
                placeholder="请输入货位名称"
                v-decorator="['name', { rules: [
                  { required: true, message: '请输入货位名称' },
                  { max: 30, message: '最大为30个汉字' },
                ] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="描述">
              <a-input 
                placeholder="请输入描述" 
                v-decorator="['remark', { rules: [{ validator: remarkValidator }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <div style="text-align:center;">
          <a-button 
            type="primary" 
            style="width:100px;"
            @click="save"
            :loading="saveLoading"
          >保存</a-button>
        </div>
      </a-form>
      <div class='slTitleAssis'>货位信息</div>
      <div class="table-box">
        <a-table
          :bordered="false"
          :columns="columns"
          :rowKey="(record) => record.id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
          class="new-table"
        >
          <template slot="remark" slot-scope="remark">
            <a-tooltip>
              {{(remark||"").substr(0,20)}}
              <template slot="title" v-if="(remark||'').length >20">{{remark}}</template>
              <template v-if="(remark||'').length >20">....</template>
            </a-tooltip>
          </template>
          <template slot="action" slot-scope="action, record">
            <a-space>
              <a @click="edit(record)">编辑</a>
              <a @click="onDelete(record.id)">删除</a>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
    <a-modal
      :visible="editVisible"
      title="编辑"
      :forceRender="true"
      @ok="onEditSave"
      @cancel="onEditCancel"
      class="slModal"
      width="50%"
    >
      <template #footer>
        <a-button @click="onEditCancel">取消</a-button>
        <a-button type="primary" @click="onEditSave" :loading="saveLoading">保存</a-button>
      </template>
      <a-form
        :form="editForm"
        class="slFormDetail"
      >
        <div style="display:none;">
          <a-form-item label="隐藏ID">
            <a-input v-decorator="['id']"/>
          </a-form-item>
        </div>
        <a-form-item label="货位名称">
          <a-input
            placeholder="请输入货位名称"
            v-decorator="['name', { rules: [
              { required: true, message: '请输入货位名称' },
              { max: 30, message: '最大为30个汉字' },
            ] }]"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input 
            placeholder="请输入描述" 
            v-decorator="['remark', { rules: [{ validator: remarkValidator }] }]"
          />
        </a-form-item>
        <a-form-item label="关联摄像头" class="special-item">
          <a-transfer
            class="transfer"
            :dataSource="camarasList"
            :titles="['未选中摄像头', '已选中摄像头']"
            :targetKeys="targetKeys"
            :selectedKeys="selectedKeys"
            :render="item => item.title"
            @change="handleChange"
            @selectChange="handleSelectChange"
            @scroll="handleScroll"
            v-decorator="['cameraIds', { rules: [{ validator: remarkValidator }] }]"
          >
          </a-transfer>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {
  getGoodsAllocationList,
  goodsAllocationAdd,
  goodsAllocationEdit,
  goodsAllocationDelete,
  getEquipmentScaleCameraAllList,
  goodsAllocationCameraListRel
} from "../../api"
import iPagination from "@sub/components/iPagination";
import Breadcrumb from "@/v2/components/breadcrumb/index";
const columns = [
  // {
  //   title: "编号",
  //   key: "serialNo",
  //   dataIndex: "serialNo",
  // },
  {
    title: "货位名称",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "描述",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    fixed:"right",
    scopedSlots: { customRender: "action" },
  },
]
export default {
  components: {
    iPagination,
    Breadcrumb
  },
  data(){
    let {houseId} = this.$route.query;
    return {
      houseId,
      columns,
      tableLoading:false,
      dataSource:[],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      saveLoading:false,
      editVisible:false,
      form:this.$form.createForm(this),
      editForm:this.$form.createForm(this),
      remarkValidator:(rule,value,callback) => {
        if(!value){
          callback()
          return
        }
        if(value.length > 100){
          callback("最大为100个汉字");
          return
        }
        callback()
      },
      camarasList:[],
      targetKeys:[],
      selectedKeys:[]
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(pageNo = this.pagination.pageNo,pageSize = this.pagination.pageSize){
      this.tableLoading = true;
      getGoodsAllocationList({pageNo,pageSize,houseId:this.houseId}).then(({success,data}) => {
        this.tableLoading = false;
        if(!success){
          return
        }
        this.dataSource = data.records;
        this.pagination.total = data.total;
        this.pagination.pageSize = pageSize;
        this.pagination.pageNo = pageNo;
      })
    },
    //获取所有摄像头信息
    getGoodsAllocationCameraAllList(goodsAllocationId){
      getEquipmentScaleCameraAllList({goodsAllocationId}).then((result) => {
        this.camarasList = result.data.map((item) => {
          return {
            key: item.id,
            title: item.name,
            description: item.remark||"",
          }
        });
      })
    },
    //获取已关联的摄像头信息
    getGoodsAllocationCameraListRel(goodsAllocationId){
      goodsAllocationCameraListRel({goodsAllocationId}).then((result) => {
        this.targetKeys = result.data.map((item) => { 
          return item.id;
        });
      })
    },
    save(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true;
        goodsAllocationAdd({...values,houseId:this.houseId}).then(({success}) => {
          this.saveLoading = false;
          if(!success){
            return
          }
          this.$message.success("操作成功");
          this.form.resetFields();
          this.getList();
        })
      })
    },
    edit(data){
      this.getGoodsAllocationCameraAllList(data.id);
      this.getGoodsAllocationCameraListRel(data.id)
      this.editVisible = true;
      this.editForm.setFieldsValue({
        id:data.id,
        name:data.name,
        remark:data.remark
      });
    },
    onEditSave(){
      this.editForm.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true;
        goodsAllocationEdit({...values,houseId:this.houseId}).then((result) => {
          this.saveLoading = false;
          if(!result.success){
            return
          }
          this.$message.success("操作成功");
          this.getList();
          this.onEditCancel();
        })
      })
    },
    onEditCancel(){
      this.editVisible = false;
      this.camarasList =[];
      this.targetKeys =[];
      this.selectedKeys =[];
      this.editForm.resetFields();
    },
    onDelete(id){
      this.$confirm({
        title:"提示",
        content:"确认删除吗?",
        onOk:() => {
          goodsAllocationDelete({id}).then((result) => {
            if(!result.success){
              return;
            }
            this.$message.success("操作成功")
            this.getList();
          })
        },
      })
    },
    handleChange(keys){
      this.targetKeys = keys;
    },
    handleSelectChange(keys,targetKeys){
      if(keys.length > 0){
        this.selectedKeys = keys;
      }else if(targetKeys.length > 0){
        this.selectedKeys = targetKeys;
      }else{
        this.selectedKeys = []
      }
      
    },
    handleScroll(){

    }
  }
}
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
  .slFormDetail {
    ::v-deep.ant-form-item-label {
      line-height: 32px!important;
      margin-bottom: 0!important;
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
