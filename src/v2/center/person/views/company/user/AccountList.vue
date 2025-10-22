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
      rowKey="companyUserId" 
      :scroll="{ x: true }" 
      :columns="columns" 
      :pagination="pagination"
      :dataSource="dataSource" 
      @change="paginationChange" 
      :loading="loading" 
      :locale="{ emptyText: '暂无数据' }"
    >
      <span slot="status" slot-scope="status">
        {{ status | filterCodeByValueName("companyStatusDict") }}
      </span>
      <template slot="operation" slot-scope="record">
         <!-- 冻结状态  编辑、删除 正常状态，非企业管理员角色，未绑定员工  编辑、删除-->
         <a-space>
            <template v-if="hasEditAuth(record)">
              <a href="javascript:;" @click="showModal('edit', record)" v-auth="'company:user:edit'">编辑</a>
            </template>
            <!-- 正常状态
              企业管理员角色  更换企业管理员
              非企业管理员角色，已绑定员工    编辑、解绑 "
            -->
            <template v-else>
              <a 
                href="javascript:;" 
                v-auth="'company:user:change:admin'"
                v-if="record.roles && record.roles.indexOf('企业管理员') > -1"
                @click="$router.push('/center/account/company/user/changeOperator')"
              >更换企业管理员</a>
              <template v-if="record.roles.indexOf('企业管理员') == -1 && record.personalUserId">
                <a @click.prevent="showModal('edit', record)" v-auth="'company:user:edit'">编辑</a>
                <a 
                  v-if="VUEX_ST_COMPANYSUER.companyType == 'PLATFORM'" 
                  @click.prevent="showModal('editAuth', record)"
                  v-auth="'company:user:edit'"
                >巡检权限</a>
                <a 
                  v-auth="'company:user:unbound'" 
                  @click.prevent="unbindUserList(record.companyUserId, record)"
                >解绑</a>
              </template>
            </template>
          </a-space>
      </template>
    </a-table>
    <a-modal 
      :title="(editType=='add'?'创建':'编辑')+'企业账号'" 
      :visible="visible" 
      :footer="null" 
      width="700px" 
      class="slModal"
      @cancel="handleCancel"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item hidden>
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-row>
          <a-col span="24" >
            <a-form-item label="企业账号">
              <a-input 
                placeholder="请输入企业账号"
                v-decorator="['account',{
                  rules: [
                    {required: true,message: '请输入企业账号'},
                  ],},
                ]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="账号状态">
              <a-radio-group 
                v-decorator="['status',
                  {rules: [
                    { required: true, message: '请选择账号状态'},
                  ]},
                ]"
              >
                <a-radio v-for="(item, index) in statusList" :value="item.value" :key="index">
                  {{ item.text }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="24" >
            <a-form-item label="选择角色" v-if="VUEX_ST_COMPANYSUER" >
              <a-checkbox-group v-decorator="['roles',
                {
                  rules: [
                    { required: true, message: '请选择角色', type: 'array' },
                    { validator: validatorRolesSelect }
                  ],
                },
              ]">
                <a-row>
                  <a-col :span="12" v-for="(one, index) in roleList" :key="index" style="margin-bottom: 4px">
                    <a-checkbox :value="one.value">
                      {{ one.label }}
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <p style="width: 60%;font-size: 10px; color: #9ba0aa;margin-left: 160px">
            注：签章员请到“我的企业-企业详情-电子签章”页面进行操作，企业管理员只可变更，不可分配
          </p>
        </a-row>
        <div style="text-align:center; margin-top: 20px">
          <a-space>
            <a-button class="btnDark" @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleOk">
              确定
            </a-button>
          </a-space>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters ,mapMutations} from "vuex";
import {
  API_COMPANYUSERPAGE,
  API_COMPANYUSERINVITEUNBIND,
  API_CertApplyInfo,
  API_COMPANYUSERMODIFY,
  API_COMPANYUSERADD,
  API_USERROLECOMPANYTYPE
} from "@/v2/api/account";
import {
  filterCodeByValueName,
  filterCodeByKey,
  filterCodeByTextName,
} from '@sub/utils/globalCode.js';
import omit from "lodash/omit";
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
const searchList = [
  {
    decorator: ["roles"],
    addonBeforeTitle: "角色",
    type: "select",
    placeholder: "请选择角色",
    options:[]
  },
  {
    decorator: ["account"],
    addonBeforeTitle: "账号名称",
    type: "input",
    placeholder: "请输入账号名称",
  },
  {
    decorator: ["personalName"],
    addonBeforeTitle: "员工姓名",
    type: "input",
    placeholder: "请输入员工姓名",
  },
  {
    decorator: ["personalMobile"],
    addonBeforeTitle: "员工手机号",
    type: "input",
    placeholder: "请输入员工手机号",
  },
]
export default {
  components:{
    SlFormNew
  },
  data() {
    return {
      searchList,
      form:this.$form.createForm(this),
      roleList: [], // 角色选择
      columns,
      dataSource:[],
      loading:false,
      pagination: {
        total: 0,
        defaultPageSize: 10,
        current: 1,
        hideOnSinglePage: true,
      },
      userListParams: {
        // 账号列表查询字段
        roles: undefined,
        account: "",
        personalName: "",
        personalMobile: "",
      },
      statusList:filterCodeByKey("companyStatusDict"),
      visible:false,
      editType:"add"
    };
  },
  computed: {
    ...mapGetters('user', {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
    }),
    roleData() {
      return filterCodeByKey("company_biz_role").filter((el) => {
        return el.value == 2; // 港口方只有业务员
      });
    },
  },
  filters: {
    filterCodeByValueName,
  },
  activated(){
    this.getUserList();
  },
  created(){
    // this.getUserList();
    API_USERROLECOMPANYTYPE().then((res) => {
      this.roleList = res.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          // text: item.name,
          // code: item.code,
        };
      });
      this.searchList[0].options = this.roleList
    });
  },
  methods:{
    ...mapMutations({
      VUEX_MU_COMPANYSUER: 'user/VUEX_MU_COMPANYSUER',
      VUEX_MU_EDITCOMPANTPROFILE: 'user/VUEX_MU_EDITCOMPANTPROFILE'
    }),
    handleChange(data){
      this.pagination.current = 1;
      this.userListParams = data;
      this.getUserList();
    },
    // 用户列表
    getUserList() {
      this.userListParams.pageNo = this.pagination.current;
      this.userListParams.pageSize = this.pagination.defaultPageSize;
      this.loading = true;
      API_COMPANYUSERPAGE(this.userListParams).then((res) => {
        if (res.success) {
          this.dataSource = res.data.content.map((item) => {
            return {
              ...item.personal,
              ...item,
              roles: (item.roles || []).map((item) => item.name).join("、") || '-',
              roleIds: (item.roles || []).map((item) => item.id + ""),
              rolesCache: item.roles,

              account: item.account,
              status: item.status,
              linkTime: item.linkTime,
              personalUserId: item.personal && item.personal.id,
              companyUserId: item.id,
            };
          });
          this.pagination.total = res.data?.totalElements;
          // this.pagination.defaultPageSize = res.result.size
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    paginationChange(data) {
      this.pagination.current = data.current;
      this.pagination.defaultPageSize = data.defaultPageSize;
      this.getUserList();
    },
    // 用户列表 解绑
    async unbindUserList(id, item) {
      // 判断当前企业账户是否存在签章员角色
      const flag = item.rolesCache.some(el => el.code == 'SIGNER')
      if (flag) {
        this.$confirm({
          centered: true,
          content: "签章员角色不允许直接解绑，请通过更换签章员功能进行变更",
          icon: "info-circle",
          title: "提示",
          closable: true,
          cancelText: "取消",
          okText: '前往变更',
          onOk:async () => {
            const res = await API_CertApplyInfo()
            this.$router.push(`/center/account/company/info/changeSigner?id=${res.data.id}`)
          },
          onCancel() { },
        });
        return
      } 
      this.$confirm({
        centered: true,
        content:
          "解绑后，该员工将无法使用该企业抬头进行相关操作，确定要解绑吗?",
        okText: "确定",
        icon: "info-circle",
        title: "解绑",
        closable: true,
        cancelText: "取消",
        onOk:() => {
          API_COMPANYUSERINVITEUNBIND(id).then((res) => {
            if (res.success && res.data) {
              this.$message.success("操作成功");
              this.visible = false;
              this.getUserList();
            }
          });
        },
        onCancel() { },
      });

    },
    // 邀请企业员工 创建企业用户  修改企业用户弹框
    async showModal(type, record) {
      const companyType = this.VUEX_ST_COMPANYSUER.companyType
      /*** 判断当前是否是监控公司 且是新增和编辑企业账号 */
      if (companyType == 'SUPERVISING' ) {
        if (type === 'edit') {
          //保存数据
          this.VUEX_MU_EDITCOMPANTPROFILE(record)
        }
        this.$router.push({
          path: '/center/account/company/new',
          query: {
            companyUserId: record ? record.companyUserId : '',
            type,
          }
        })
        return
      }
      //主体平台编辑巡库权限
      if (companyType == 'PLATFORM' && ['editAuth'].includes(type)) {
        if (type === 'edit') {
          //保存数据
          this.VUEX_MU_EDITCOMPANTPROFILE(record)
        }
        this.$router.push({
          path: '/center/account/company/inspectAuthority',
          query: {companyUserId:record.companyUserId , type:"edit",}
        })
        return
      }
      // 核心企业-账号配置
      if (companyType == 'CORE_COMPANY' ) {
        if (type === 'edit') {
          
          //保存数据
          this.VUEX_MU_EDITCOMPANTPROFILE(record)
        }
        this.$router.push({
          path: '/center/account/company/user/addCompanyAccount',
          query: {
            companyUserId: record ? record.companyUserId : '',
            type,
          }
        })
        return
      }
      // 仓储企业-账号配置
      if (companyType == 'WAREHOUSE' ) {
        if (type === 'edit') {
          //保存数据
          this.VUEX_MU_EDITCOMPANTPROFILE(record)
        }
        this.$router.push({
          path: '/center/account/company/user/addCompanyAccount',
          query: {
            companyUserId: record ? record.companyUserId : '',
            type,
          }
        })
        return
      }
      this.visible = true;
      this.editType = type;
      if (type == "edit") {
        let {
          account,
          roleIds,
          status,
          companyUserId
        } = record;
        this.$nextTick(() => {
          this.form.setFieldsValue( {
          account,
          roles: roleIds,
          status: String(status),
          id:companyUserId
        });
        });
      } 
    },
    selectChange() {
      let rolesIds = this.form.getFieldValue('roles');
      if (rolesIds?.length == 1 && rolesIds[0] == 'spec') {
        this.form.setFieldsValue({roles: []});
        rolesIds = [];
        this.form.validateFields(['roles']);
      }
      if (rolesIds?.length) {
        return true;
      }
      const ids = this.storageList.reduce((pre, cur) => {
        return pre.concat(cur.roleIds)
      }, []);
      if (!ids.length && !rolesIds?.length) {
        return false;
      } else {
        this.form.setFieldsValue({
          roles: ['spec']
        });
        return true;
      }
    },
    handleCancel(){
      this.visible = false;
      this.form.resetFields()
    },
    handleOk() {
      let formItems = ["account", "roles", "status",'id'];
      this.form.validateFields(formItems, (err, values) => {
        if(err){
          return;
        }
        const selectChangeResult = this.selectChange();
        if(this.editType == 'add'){
          if (!selectChangeResult) return;
          this.addUserList(values)
          return
        }
        if (this.editType == "edit") {
          if (!selectChangeResult) return;
          this.modifyUserList(values);
        }
      });
    },
    // 用户列表 新增
    addUserList(data) {
      if (data.roles && data.roles.length == 1 && data.roles[0] == 'spec') {
        data.roles = [];
      }
      if (data.roles) {
        data.roleIds = data.roles;
      }
      API_COMPANYUSERADD(omit(data, ["roles"])).then((res) => {
        if (res.success && res.data) {
          this.$message.success("添加成功");
          this.visible = false;
          this.form.resetFields()
          this.storageList = [];
          this.getUserList();

        }
      });
    },
    // 用户列表 修改
    modifyUserList(data) {
      if (data.roles && data.roles.length == 1 && data.roles[0] == 'spec') {
        data.roles = [];
      }
      if (data.roles) {
        data.roleIds = data.roles;
      }
      API_COMPANYUSERMODIFY(omit(data, ["roles", "id"]), data.id).then(
        (res) => {
          if (res.success) {
            this.$message.success("修改成功");
            this.visible = false;
            this.form.resetFields()
            this.storageList = [];
            this.getUserList();
          }
        }
      );
    },
    validatorRolesSelect(rules, value, callback) {
      if (value && value.length) {
        callback();
      } else {
        callback('角色必选');
      }
    },
    // 冻结状态  编辑、删除 正常状态，非企业管理员角色，未绑定员工  编辑、删除-
    hasEditAuth(record){
      if(record.status == 'FREEZE'){
        return true
      }
      return record.roles.indexOf('企业管理员') == -1 &&  !record.personalUserId
    }
  }
};
const columns = [
  {
    title: "企业账号",
    dataIndex: "account",
    key: "account",
  },
  {
    title: "账号角色",
    dataIndex: "roles",
    // customRender: (text) => {
    //     return (text.map((item) => item.name)).join('、')
    //   }
  },
  {
    title: "账号状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "员工姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "员工手机号",
    dataIndex: "mobile",
    key: "mobile",
  },
  {
    title: "加入时间",
    dataIndex: "linkTime",
    key: "linkTime",
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: {
      customRender: "operation",
    },
    width: 180,
    fixed: "right",
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
