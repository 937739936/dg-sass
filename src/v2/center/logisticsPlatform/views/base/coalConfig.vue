<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">煤种配置</span>
        <a-button class="add-btn" type="primary" @click="openAdd">新增煤种</a-button>
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
          <template slot="action" slot-scope="action, record">
            <a-space>
              <a @click.prevent="onDelete(record.id)">删除</a>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
    <a-modal  
      :visible="visible"
      title="新增"
      @ok="ok"
      @cancel="cancel"
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
        <a-form-item label="煤种名称">
          <a-input 
            placeholder="请输入煤种名称" 
            v-decorator="['name', { rules: [
              { required: true,message: '请输入煤种名称'  },
              { max: 30,message: '最多30个字符'  },
            ] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {getCoalTypeList,coalTypeAdd,coalTypeDelete} from "../../api";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
const columns = [
  {
    title: "编号",
    key: "serialNo",
    dataIndex: "serialNo",
    width: '40%'
  },
  {
    title: "煤种名称",
    key: "name",
    dataIndex: "name",
    width: '40%'
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
    width: '20%'
  },
]
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "煤种名称",
    type: "input",
    placeholder: "请输入煤种名称",
  },
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
        type: "",
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      visible:false,
      searchForm:this.$form.createForm(this),
      form:this.$form.createForm(this),
      saveLoading:false,
      url: {
        list: getCoalTypeList
      },
      searchList,
    };
  },
  methods:{
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    async onDelete(id){
      let isok = await this.isAsync((resolve) => {
        this.$confirm({
          title:"提示",
          content:"删除后将不可恢复，确定删除吗?",
          onOk(){
            resolve(true)
          },
          onCancel(){
            resolve(false)
          }
        })
      })
      if(!isok){
        return
      }
      coalTypeDelete({id}).then((result) => {
        if(!result.success){
          return
        }
        this.$message.success("操作成功");
        this.getList();
      })
    },
    openAdd(){
      this.visible = true;
    },
    ok(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true;
        coalTypeAdd({...values}).then((result) => {
          this.saveLoading = false;
          if(!result.success){
            return
          }
          this.$message.success("操作成功");
          this.getList(1);
          this.cancel();
        },() => {
          this.saveLoading = false;
        })
      })
      // 
    },
    cancel(){
      this.visible = false;
      this.form.resetFields();
    },
    isAsync(fn){
      return new Promise(fn);
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
