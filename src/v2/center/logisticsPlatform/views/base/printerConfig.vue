<template>
   <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">打印机配置</span>
      </div>
       <!-- 查询区域 -->
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
      ></SlFormNew>
      
      <div class="table-box">
        <a-table
          class="new-table"
          :bordered="false"
          :columns="columns"
          :rowKey="(record) => record.id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
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
              <a @click.prevent="edit(record)">编辑</a>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
    <a-modal 
      :visible="visible" 
      title="编辑" 
      @ok="ok"
      @cancel="cancel"
      :forceRender="true"
      class="slModal"
      width="408px"
    >
      <template #footer>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok" :loading="saveLoading">保存</a-button>
      </template>
      <a-form 
        :form="form"
        class="slFormDetail"
      >
        <div style="display:none">
          <a-form-item label="id">
            <a-input v-decorator="['id']"/>
          </a-form-item>
        </div>
        <a-form-item label="名称">
          <a-input 
            placeholder="请输入名称" 
            v-decorator="['name', { rules: [
              { required: true, message:'请输入名称'  },
              { max: 30, message:'最多30个字符'  },
            ] }]"
          />
        </a-form-item>
        <a-form-item label="备注" class="special-item">
          <a-textarea
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            v-decorator="['remark',{ rules:[
              {validator:(rule,value,callback) => {
                if(!value){
                  callback();
                  return
                }
                if(value.length > 100){
                  callback('最多输入100个字符')
                  return
                }
                callback();
              }}
            ]}]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {getEquipmentPrinterList,equipmentPrinterEdit} from "../../api";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
const columns = [
  {
    title: "打印机名称",
    key: "name",
    dataIndex: "name",
    width: '25%'
  },
  {
    title: "所属磅房",
    key: "scale",
    dataIndex: "scale",
    width: '25%'
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: '25%'
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
    width: '25%'
  },
]
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "打印机名称",
    type: "input",
    placeholder: "请输入打印机名称",
  }
]
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
  },
  data(){
    return {
      columns,
      tableLoading:false,
      dataSource:[],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10
      },
      form:this.$form.createForm(this),
      searchForm:this.$form.createForm(this),
      visible:false,
      saveLoading:false,
      url: {
        list: getEquipmentPrinterList
      },
      searchList,
    }
  },
  methods:{
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    edit(data){
      this.visible = true;
      this.form.setFieldsValue({
        id:data.id,
        name:data.name,
        remark:data.remark
      })
    },
    ok(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true
        equipmentPrinterEdit({...values}).then((result) => {
          this.saveLoading = false;
          if(!result.success){
            return
          }
          this.$message.success("操作成功");
          this.getList(1)
          this.cancel();
        })
      })
      
    },
    cancel(){
      this.visible = false;
      this.form.resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
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

