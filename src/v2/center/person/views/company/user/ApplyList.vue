<template>
  <div>
    <SlFormNew 
      :list="searchList"
      layout="inline"
      @change="handleChange"
    />
    
    <a-table 
      class="new-table"
      style="margin-top: 30px;"
      :scroll="{ x: true }" 
      rowKey="id" 
      :columns="columns"
      :pagination="pagination" 
      :dataSource="dataSource" 
      @change="paginationChange"
      :locale="{ emptyText: '暂无数据' }" 
      :loading="loading"
    >
      <span slot="status" slot-scope="status">
        {{
          status | filterCodeByValueName("company_user_apply_status")
        }}
      </span>
      <span slot="auth" slot-scope="auth">
        {{ auth == 1 ? "已认证" : "未认证" }}
      </span>
      <!-- 待验证1 通过2 拒绝3 待审核状态下  显示“通过”、”拒绝“按钮  -->
      <template slot="operation" slot-scope="record">
        <div class="control-wrap" v-if="record.status == 'DEFAULT'">
          <a-space>
            <a href="javascript:;" @click="showModal(record)">通过</a>
            <a href="javascript:;" @click="aduitFailUserApplyList(record.id)">拒绝</a>
          </a-space>
        </div>
      </template>
    </a-table>
    <a-modal 
      title="审核通过" 
      :visible="visible" 
      :footer="null" 
      width="700px" 
      class="slModal"
      @cancel="handleCancel"
    >
      
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item hidden>
              <a-input v-decorator="['id']"/>
            </a-form-item>
          </a-col>
        <a-row>
          <a-col span="24" >
            <a-form-item label="员工姓名">
              <a-input v-decorator="['name']" disabled/>
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="员工手机号">
              <a-input v-decorator="['mobile']" disabled/>
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="实名认证">
              <a-input v-decorator="['auth']" disabled/>
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="分配企业账号">
              <a-select placeholder="请选择企业账号" v-decorator="['companyUserId',{rules:[{required:true,message:'请选择企业账号'}]}]" >
                <a-select-option 
                  v-for="(items, index) in unAssignList" 
                  :key="index" 
                  :value="items.id"
                >
                  {{ items.account}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <div style="text-align:center; margin-top: 20px">
          <a-space>
            <a-button class="btnDark" @click="handleCancel">取消</a-button>
            <a-button type="primary" :loading="saveLoading" @click="handleOk">
              确定
            </a-button>
          </a-space>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {
  API_COMPANYUSERAPPLYPAGE,
  API_COMPANYUSERREJECT,
  API_COMPANYUSERLISTUNASSIGNED,
  API_COMPANYUSERAPPLYPASS
} from "@/v2/api/account";
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
  {
    decorator: ["mobile"],
    addonBeforeTitle: "手机号",
    type: "input",
    placeholder: "请输入手机号",
  },
]
export default {
  components:{
    SlFormNew
  },
  data(){
    return {
      searchList,
      loading:false,
      saveLoading:false,
      form:this.$form.createForm(this),
      unAssignList:[],
      columns,
      applyListParams: {
        // 申请列表查询字段
        name: "",
        mobile: "",
      },
      dataSource:[],
      pagination: {
        total: 0,
        defaultPageSize: 10,
        current: 1,
      },
      visible:false,
    }
  },
  mounted(){
    this.getUserApplyList();
  },
  activated(){
    this.getUserApplyList();
  },
  methods:{
    handleChange(data){
      this.applyListParams = data;
      this.pagination.current = 1;
      this.getUserApplyList();
    },
    // 申请列表
    getUserApplyList() {
      this.applyListParams.pageNo = this.pagination.current;
      this.applyListParams.pageSize = this.pagination.defaultPageSize;
      this.loadingApply = true;
      API_COMPANYUSERAPPLYPAGE(this.applyListParams).then((res) => {
        if (res.success) {
          this.dataSource = res.data.content;
          this.pagination.total = res.data?.totalElements;
        }
      }).finally(() => {
        this.loadingApply = false;
      })
    },
     // 分页组件回调事件
     paginationChange(data) {
      this.pagination.current = data.current;
      this.pagination.defaultPageSize = data.defaultPageSize;
      this.getUserApplyList();
    },
    // 申请列表 审核失败
    aduitFailUserApplyList(id) {
      this.$confirm({
        centered: true,
        title: "审核拒绝",
        icon: "info-circle",
        closable: true,
        okText: "确定",
        cancelText: "取消",
        content: "确定要拒绝该用户的加入企业申请吗？",
        onOk:() => {
          API_COMPANYUSERREJECT(id).then((res) => {
            if (!res.success) {
             return
            }
            this.visible = false;
            this.$message.success("操作成功");
            this.getUserApplyList();
          });
        },
      });
    },
    // 获取为分配的企业账号列表
    getUnAssignedList() {
      API_COMPANYUSERLISTUNASSIGNED().then((res) => {
        if (res.success) {
          this.unAssignList = res.data;
        }
      });
    },
    showModal(record){
      this.visible = true;
      this.form.resetFields();
      this.getUnAssignedList();
      let { name, mobile, auth ,id} = record;

      this.$nextTick(() => {
        this.form.setFieldsValue({
          id,
          name,
          mobile,
          auth: auth == 1 ? "已认证" : "未认证",
        });
      });
    },
    handleCancel(){
      this.visible = false;
      this.form.resetFields()
    },
    handleOk() {
      let formItems = ["id","companyUserId", "roles"];
      
      this.form.validateFields(formItems, (err, values) => {
        if(err){
          return;
        }
        
        this.aduitSuccessUserApplyList(values);
      });
    },
     // 申请列表 审核成功
    aduitSuccessUserApplyList(data) {
      this.$confirm({
        centered: true,
        title: "确认通过审核?",
        okText: "确定",
        cancelText: "取消",
        onOk:()=> {
          this.saveLoading = true
          API_COMPANYUSERAPPLYPASS(
            { companyUserId: data.companyUserId },
            data.id
          ).then((res) => {
            if (res.success) {
              this.visible = false;
              this.$message.success("操作成功");
              this.getUserApplyList();
            }
          }).finally(() => {
            this.saveLoading = false
          });
        },
        onCancel() { },
      });
    },
  }
}
const columns = [
  // 申请列表
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "手机号",
    dataIndex: "mobile",
    key: "mobile",
    width: 150,
  },
  {
    title: "实名认证",
    dataIndex: "auth",
    key: "auth",
    customRender: (text) => {
      return text ? "已认证" : "未认证";
    },
    width: 300,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    customRender: (text) => {
      return {
        DEFAULT: "待验证",
        PASSED: "通过",
        REJECTED: "拒绝",
      }[text];
    },
    width: 150,
  },
  {
    title: "申请时间",
    dataIndex: "applyTime",
    key: "applyTime",
    width: 150,
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: {
      customRender: "operation",
    },
    align: "center",
    width: 150,
    fixed: "right",
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
