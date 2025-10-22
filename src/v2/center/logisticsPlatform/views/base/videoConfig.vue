<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">视频配置</span>
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
          <template slot="online" slot-scope="online">
            {{online ? "在线":"离线"}}
          </template>
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
    >
      <template #footer>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" @click="ok" :loading="saveLoading">保存</a-button>
      </template>
      <a-form 
        :form="editForm"
        class="slFormDetail"
      >
        <div style="display:none">
          <a-form-item label="id" >
            <a-input v-decorator="['id']"/>
          </a-form-item>
        </div>
        <a-form-item label="名称" >
          <a-input 
            placeholder="请输入名称" 
            :disabled="true"
            v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="类型" >
          <a-select 
            placeholder="请选择类型" 
            :disabled="true"
            v-decorator="['type', { rules: [{ required: true, message: '请选择类型' }] }]"
          >
            <a-select-option value="枪机">枪机</a-select-option>
            <a-select-option value="球机">球机</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注" class="special-item">
          <a-textarea
            placeholder="请输入备注"
            v-decorator="['remark', { rules: [{ 
              validator:(rule,value,callback) => {
                if(!value){
                  callback()
                  return
                }
                if(value.length > 100){
                  callback('最多输入100个字符')
                  return
                }
                callback()
              }
            }] }]"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {getEquipmentCameraList,equipmentCameraEdit} from "../../api";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
const columns = [
  {
    title: "监控名称",
    key: "name",
    dataIndex: "name",
    width: '16.6%'
  },
  {
    title: "类型",
    key: "type",
    dataIndex: "type",
    width: '16.6%'
  },
  {
    title: "所属货位",
    key: "goodsAllocation",
    dataIndex: "goodsAllocation",
    width: '16.6%'
  },
  {
    title: "状态",
    key: "online",
    dataIndex: "online",
    scopedSlots: { customRender: "online" },
    width: '16.6%'
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: '16.6%'
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
    width: '16.6%'
  },
]
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "监控名称",
    type: "input",
    placeholder: "请输入监控名称",
  },
  {
    decorator: ["type"],
    addonBeforeTitle: "类型",
    type: "select",
    placeholder: "请选择类型",
    options: [
      { value: "枪机", label: "枪机"},
      { value: "球机", label: "球机"}
    ]
  },
  {
    decorator: ["online"],
    addonBeforeTitle: "状态",
    type: "select",
    placeholder: "请选择状态",
    options: [
      { value: 1, label: "在线"},
      { value: 0, label: "离线"}
    ]
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
      saveLoading:false,
      dataSource:[{id:"1"}],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10
      },
      visible:false,
      searchForm:this.$form.createForm(this),
      editForm:this.$form.createForm(this),
      url: {
        list: getEquipmentCameraList
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
      this.editForm.setFieldsValue({
        id:data.id,
        type:data.type,
        name:data.name,
        remark:data.remark
      })
    },
    ok(){
      this.editForm.validateFields((error,values) => {
        if(error){
          return
        }
        this.saveLoading = true;
        equipmentCameraEdit({...values}).then((result) => {
          this.saveLoading = false;
          if(!result.success){
            return
          }
          this.$message.success("操作成功");
          this.getList();
          this.cancel();
        })
      })
    },
    cancel(){
      this.visible = false;
      this.editForm.resetFields()
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
