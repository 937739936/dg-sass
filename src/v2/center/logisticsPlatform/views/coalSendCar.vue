<template>
  <div class="custom-main-content-inner">
    <div class="page-title"><span>{{type == 'in' ? "上":"下"}}煤派车</span></div>
    <a-card :bordered="false">
      <a-descriptions   :column="3">
        <a-descriptions-item label="发货单位">蒙东矿业</a-descriptions-item>
        <a-descriptions-item label="收货单位">蒙东矿业</a-descriptions-item>
        <a-descriptions-item label="派车数量上限">无</a-descriptions-item>
        <a-descriptions-item label="已派车数">121</a-descriptions-item>
        <a-descriptions-item label="已送达车数" :span="2">10</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" style="margin-top:10px;">
      <template #title>
        <a-radio-group :value="addWay" button-style="solid" @change="onAddWayChange">
          <a-radio-button value="add">
            逐条新增
          </a-radio-button>
          <a-radio-button value="import">
            批量导入
          </a-radio-button>
        </a-radio-group>
      </template>
      <template v-if="addWay == 'add'">
        <a-form
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-row>
            <a-col :span="8">
              <a-form-item label="车牌号">
                <a-input
                  placeholder="请输入车牌号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="联系电话">
                <a-input placeholder="请输入联系电话" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-button type="primary" >确定</a-button>
            </a-col>
          </a-row>
        </a-form>
        <a-table
          :bordered="false"
          :columns="addColumns"
          :rowKey="(record) => record.id"
          :dataSource="addData"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template #title>
            <b style="font-size:16px;">派车信息</b>
          </template>
          <template slot="action" slot-scope="action, record">
              <a >删除</a>
          </template>
        </a-table>
      </template>
      
      <template v-if="addWay == 'import'">
        <a-row>
          <a-col :span="12">
            <h2 class="h2">1.请按照模板格式标准需要导入的数据</h2>
            <div class="btn-text">
              <a-button><a-icon type="download" />模板下载</a-button>
              <span>请务必将必填字段铁屑准确万智，否则可能识别，添加失败</span>
            </div>
            <h2  class="h2">2.请选择需要导入的文件</h2>
            <div class="btn-text">
              <a-upload
                name="file"
                :multiple="true"
                @change="handleChange"
                :file-list="[]"
                :custom-request="customRequest"
                accept="application/vnd.ms-excel"
              >
                <a-button type="primary">
                  <a-icon type="upload" />上传文件
                </a-button>
                <span>改功能仅支持上传Excel文件(*.xls、*.xlsx)</span>
              </a-upload>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="upload-result-pannel">
              <div class="file-list">
                <a-icon type="paper-clip" />
                <span>阿萨德浪费加拉时代峻峰辣三丁.xls</span>
              </div>
              <div class="file-list error">
                <a-icon type="paper-clip" />
                <span>阿萨德浪费加拉时代峻峰辣三丁.xls</span>
              </div>
            </div>
          </a-col>
        </a-row>
        
        <a-table
          :bordered="false"
          :columns="importColumns"
          :rowKey="(record) => record.id"
          :dataSource="importData"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template #title>
            <a-space>
              <span>派车总数：<span class="primary-color">14</span>条</span>
              <span>识别失败：<span class="red">4</span>条</span>
            </a-space>
          </template>
          <template slot="status" slot-scope="text">
            识别成功
          </template>
        </a-table>
      </template>
    </a-card>
    
  </div>  
</template>
<script>
const  addColumns = [
  {
    title: "序号",
    key: "序号",
    dataIndex: "序号",
  },
  {
    title: "车牌号码",
    key: "车牌号码",
    dataIndex: "车牌号码",
  },
  {
    title: "联系电话",
    key: "联系电话",
    dataIndex: "联系电话",
  },
  {
    title: "派车时间",
    key: "派车时间",
    dataIndex: "派车时间",
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
  },
]
const importColumns = [
  {
    title: "序号",
    key: "序号",
    dataIndex: "序号",
  },
  {
    title: "车牌号码",
    key: "车牌号码",
    dataIndex: "车牌号码",
  },
  {
    title: "联系电话",
    key: "联系电话",
    dataIndex: "联系电话",
  },
  {
    title: "状态",
    key: "状态",
    dataIndex: "状态",
    scopedSlots: { customRender: "status" },
  },
]
export default {
  
  data(){
    let {type} = this.$route.params;
    return {
      type,
      addWay:"import" ,//add 逐条新增，import 导入
      tableLoading:false,
      addColumns,
      importColumns,
      addData:[],
      importData:[]
    }
  },
  methods:{
    onAddWayChange(e){
      this.addWay = e.target.value;
    },
    handleChange(file){
      
    },
    customRequest(aa){
      
    }
  }
}
</script>
<style lang="less" scoped>
.red{
  color:#FA5271;
}
.primary-color{
  color:#0053DB
}
.upload-result-pannel{
  min-width:312px;
  min-height: 150px;
  border: 1px dashed #0053DB;
  background-color:rgba(#0053DB,0.14);
  border-radius:3px;
  padding: 26px 18px;
  .file-list{
    line-height:22px;
    margin-bottom:8px;
    &:last-child{
      margin-bottom:0;
    }
    span{
      font-size:14px;
      color:rgba(#252D3E,0.65);
    }
    &.error{
      span{
        color:#FA5271
      }
    }
  }
}
.h2{
  margin-bottom:14px;
  font-size:14px;
}
.btn-text{
  margin-bottom:20px;
  span{
    padding-left:8px;
    font-size:14px;
    color:rgba(#000,0.4);
  }
}
  
</style>

