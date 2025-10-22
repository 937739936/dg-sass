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
      <!-- 未注册1 未关联2 已关联3 已取消4
                    未关联状态下  显示“取消邀请”、“重新邀请”按钮 -->
      <template slot="operation"  slot-scope="record" v-if="record.status == 'UNLINKED'">
        <div class="control-wrap">
          <a-space>
            <a href="javascript:;" @click="cancelInviteInviteList(record.id)">取消邀请</a>
            <a href="javascript:;" @click="reInviteInviteList(record.id)">重新邀请</a>
          </a-space>
        </div>
      </template>
    </a-table>

    <a-modal 
      title="邀请员工加入" 
      :visible="visible" 
      :footer="null" 
      width="700px" 
      class="slModal"
      @cancel="() => {
        visible = false;
        form.resetFields()
      }"
    >
      
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-row>
          <a-col span="24"  style="margin-bottom: 20px">
            注：发送邀请后，员工将收到一条邀请短信，短信中包含邀请码，员工通过邀请码即可加入企业。邀请信息有效期为24小时，超时需要重新发送邀请
          </a-col>
          <a-col span="24" >
            <a-form-item label="员工手机号">
              <a-input 
                placeholder="请输入员工手机号"  
                v-decorator="['mobile',{rules:[
                  {required:true,message:'请输入员工手机号'},
                  {validator:checkMobile}
                ]}]" 
              />
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="员工姓名">
              <a-input 
                placeholder="请输入员工姓名"  
                v-decorator="['name',{rules:[{required:true,message:'请输入员工姓名'}]}]" 
              />
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="分配企业账号">
              <a-select 
                placeholder="请选择企业账号"
                v-decorator="['companyUserId',{rules:[{required:true,message:'请选择企业账号'}]}]" 
              >
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
  API_COMPANYUSERINVITECANCEL,
  API_COMPANYUSERINVITEREINVITE,
  API_COMPANYUSERINVITEPAGE,
  API_COMPANYUSERINVITE,
  API_COMPANYUSERLISTUNASSIGNED,
  API_COMPANYUSERINVITEVALIDATED
} from "@/v2/api/account";
import { tencentCaptcha } from "@/v2/utils/factory";
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
      unAssignList:[],
      form:this.$form.createForm(this),
      inviteListParams: {
        // 邀请列表查询字段
        name: "",
        mobile: "",
      },
      pagination: {
        total: 0,
        defaultPageSize: 10,
        current: 1,
        hideOnSinglePage: true,
      },
      columns,
      dataSource:[],
      visible:false
    }
  },
  mounted(){
    this.getUserInviteList()
  },
  activated(){
    this.getUserInviteList();
  },
  methods:{
    // 获取为分配的企业账号列表
    getUnAssignedList() {
      API_COMPANYUSERLISTUNASSIGNED().then((res) => {
        if (res.success) {
          this.unAssignList = res.data;
        }
      });
    },
    handleChange(data){
      this.inviteListParams = data;
      this.pagination.current = 1;
      this.getUserInviteList();
    },
    // 邀请列表
    getUserInviteList() {
      this.inviteListParams.pageNo = this.pagination.current;
      this.inviteListParams.pageSize = this.pagination.defaultPageSize;
      this.loading = true;
      API_COMPANYUSERINVITEPAGE(this.inviteListParams).then((res) => {
        console.log(res)
        if (res.success) {
          this.dataSource = res.data.content;
          this.pagination.total = res.data?.totalElements;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    paginationChange(data) {
      this.pagination.current = data.current;
      this.pagination.defaultPageSize = data.defaultPageSize;
      this.getUserInviteList();
   },
   // 邀请列表 取消邀请
   cancelInviteInviteList(id) {
      const that = this;
      this.$confirm({
        centered: true,
        title: "取消邀请",
        okText: "确定",
        cancelText: "取消",
        icon: "info-circle",
        closable: true,
        content: "取消邀请后，该员工将无法完成激活并加入企业，确定要取消吗？",
        onOk() {
          API_COMPANYUSERINVITECANCEL(id).then((res) => {
            if (res.success && res.data) {
              that.$message.success("操作成功");
              that.getUserInviteList();
            }
          });
        },
        onCancel() { },
      });
    },
    // 邀请列表 重新邀请
    reInviteInviteList(id) {
      const that = this;
      this.$confirm({
        centered: true,
        title: "重新邀请",
        okText: "确定",
        closable: true,
        icon: "info-circle",
        cancelText: "取消",
        content:
          "重新邀请后，系统将向员工手机号重新发送邀请码，原邀请自动失效，确定要重新邀请吗？",
        onOk() {
          API_COMPANYUSERINVITEREINVITE(id).then((res) => {
            if (res.success && res.data) {
              that.$message.success("操作成功");
              that.getUserInviteList();
            }
          });
        },
        onCancel() { },
      });
    },
     // 邀请企业员工 创建企业用户  修改企业用户弹框
    showModal() {
      this.visible = true;
      this.form.resetFields();
      this.getUnAssignedList();
    },
    handleCancel(){
      this.visible = false;
      this.form.resetFields();
    },
    handleOk() {
      let formItems = ["name", "mobile", "companyUserId"];
      this.form.validateFields(formItems, (err, values) => {
        if(err){
          return
        }
        this.saveLoading = true;
        this.inviteUserInviteList(values);
      });
    },
    // 邀请列表 邀请企业员工
    inviteUserInviteList(values) {
      this.inviteInfo = values
      tencentCaptcha(this.inviteUser, values.mobile)
    },
    inviteUser({ ticket, randstr }) {
      API_COMPANYUSERINVITE({
        ...this.inviteInfo,
        ticket,
        randstr
      }).then((res) => {
        if (res.success) {
          this.visible = false;
          this.$message.success("邀请成功");
          this.getUserInviteList();
        }
      }).finally(() => {
        this.saveLoading = false;
      });
    },
    checkMobile(rule, value, callback) {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
        return;
      }
      API_COMPANYUSERINVITEVALIDATED({ mobile: value })
        .then((res) => {
          if (res.success) {
            if (!res.data.result) {
              callback(res.data.message);
              return;
            }
            callback();
            return;
          }
          callback("手机号验证失败");
        })
        .catch(() => {
          callback("手机号验证失败");
        });
    },
  }
}
const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "手机号",
    dataIndex: "mobile",
    key: "mobile",
  },
  {
    title: "企业账号",
    dataIndex: "account",
    key: "account",
  },
  {
    title: "角色",
    dataIndex: "roles",
    customRender: (text) => text && text.join("、"),
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    customRender: (text) => {
      return {
        UNREG: "未注册",
        UNLINKED: "未关联",
        LINKED: "已关联",
        CANCELED: "已取消",
      }[text];
    },
  },
  {
    title: "申请时间",
    dataIndex: "inviteTime",
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: {
      customRender: "operation",
    },
    align: "center",
    width: 180,
    fixed: "right",
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>