<template>
  <div class="slMain  mt-10">

    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">{{title}}</span>
      </div>
      <div>
        <div class="slTitleAssis">{{sTitle}}</div>
        <a-form :form="form" class="slFormDetail" :colon="false">
          <a-row>
            <a-col :span="8">
              <a-form-item label="企业账号">
                <a-input
                  autoComplete="off"
                  placeholder="请输入登录账号名称"
                  v-decorator="[
                    'account',
                    {
                      validateTrigger:'blur',
                      rules: [
                        { required: true, message: '请输入登录账号名称', },
                        { max: 200, message: '请输入200个字符以内', },
                      ],
                    },
                  ]">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item label="账号状态" class="statusItem">
                <a-radio-group
                  style="width: 100%;"
                  v-decorator="['status',
                    { rules: [
                        {required: true,message: '请选择账号状态',type: 'string',},
                      ],
                    },
                  ]"
                >
                  <a-row>
                    <a-col :span="8" v-for="(item, index) in statusList" :key="index">
                      <a-radio :value="item.value" >
                        {{ item.text }}
                      </a-radio>
                    </a-col>
                  </a-row>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="chooseRole">
            <a-col :span="24">
              <a-form-item>
                <div slot="label" style="display:inline-block;">
                  <span>选择角色</span> 
                  <a-checkbox class="labelTips" style="margin-left:40px" @change="changeAssign" v-model="assignRole" :disabled="!!(form.getFieldValue('roles') || []).length" :value="true"> 暂不分配角色</a-checkbox>
                </div>
                <div class="tip">
                  注：签章员请到"我的企业-企业详情-电子签章"页面进行操作，企业管理员只可变更，不可分配。如果为签章员，请勾选暂不分配角色选项
                </div>
                <a-checkbox-group
                  v-decorator="['roles',{
                    rules: [{ required: !assignRole, message: '请选择角色' }] 
                  }]"
                  @change="checkRoles"
                >
                  <a-checkbox 
                    class="checkItem" 
                    v-for="(item, index) in roleList" 
                    :key="index" 
                    :value="item.value" 
                    :disabled='assignRole'
                  >
                    {{ item.text }}
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
           
          
          <a-row class="authRole" v-if="showLogistics()">
            <div class="divider"></div>
                
            <!-- <a-form-item label="物流节点服务" style="min-height: unset;" required ></a-form-item> -->
            <a-form-item class="authRole-group" label="仓储权限">
              <a-checkbox-group
                @change="storageChange"
                v-decorator="['stationRoles',{rules:[{required:true,message:'请选择场地权限'}]}]"
              >
                <a-checkbox
                  class="checkItem"
                  v-for="item in storageList"
                  :value="item.stationId"
                  :key="item.stationId"
                >{{item.station}}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
            <a-form
              v-show="showStationList()"
              class="stationForm"
              :form="form1"
            >
              <div v-for="key in form.getFieldValue('stationRoles')" :key="key" class="station-roles">
                <a-row>
                  <a-col span="6" class="title">{{getStationName(key)}}</a-col>
                </a-row>
                <a-form-item label="智能称重客户端角色" v-if="(clientRoles[key]||[]).length > 0" >
                  <a-checkbox-group
                    v-decorator="[`clientRole_${key}`,{rules:[
                      {required:false,message:'请选择智能称重客户端角色'},
                      {validator:validRole(key)},
                    ]}]"
                  >
                    <a-checkbox
                      class="checkItem1"
                      v-for="item in clientRoles[key]"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item label="物流仓储中心角色" v-if="(cloudRoles[key]||[]).length > 0">
                  <a-checkbox-group
                  v-decorator="[`cloudRole_${key}`,{
                    rules:[
                      {required:false,message:'请选择物流仓储中心角色'},
                      {validator:validRole(key)},
                    ]
                  }]"
                  >
                    <a-checkbox
                      class="checkItem1"
                      v-for="item in cloudRoles[key]"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
                <a-form-item :label="isCoreCompany?'现场管理角色':'站台巡库角色'" v-if="(appSupervisorRoles[key]||[]).length > 0">
                  <a-radio-group
                  v-decorator="[`appSupervisorRoles_${key}`,{
                    rules:[
                      {required:false,message:'请选择站台巡库角色'},
                      {validator:validRole(key)},
                    ]
                  }]"
                  >
                    <a-radio
                      class="checkItem1"
                      v-for="item in appSupervisorRoles[key]"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label=" " :colon="false" v-if="(stationWarehouseList[key]||[]).length > 0 && (form1.getFieldValue(`appSupervisorRoles_${key}`)||[]).includes('LOGISTICS_STATION_SUPERVISOR')&&!(form1.getFieldValue(`appSupervisorRoles_${key}`)||[]).includes('LOGISTICS_STATION_SUPERVISOR_OBSERVER')">
                  <a-checkbox-group
                  v-decorator="[`stationWarehouseList_${key}`,{
                    rules:[
                      {required:false,message:'请选择仓房'},
                      {validator:validRole(key)},
                    ]
                  }]"
                  >
                    <a-checkbox
                      class="checkItem1"
                      v-for="item in stationWarehouseList[key]"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</a-checkbox>
                  </a-checkbox-group>
                </a-form-item>
              </div>
            </a-form>
          </a-row>
        </a-form>
      </div>
      <div class="slDetailBottom">
        <a-space :size="30">
          <a-button type="primary" ghost @click="cancel">取消</a-button>
          <a-button type="primary" @click="submit" >{{id?'保存':'提交'}}</a-button>
        </a-space>
      </div>
    </a-card>
    <ConfirmModal ref="backRef" @confirm="backOk"/>
  </div>
</template>

<script>
import { API_ROLES_STATION, API_GET_ROLES_STATION } from '@/v2/center/person/api';
import { API_USERROLECOMPANYTYPE, API_COMPANYUSERADD, API_COMPANYUSERMODIFY } from '@/v2/api/account';
import { mapMutations, mapGetters } from 'vuex';
import omit from 'lodash/omit';
import { filterCodeByValueName, filterCodeByKey, filterCodeByTextName } from '@sub/utils/globalCode.js';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
export default {
  components:{
    ConfirmModal
  },
  data() {
    return {
      id: this.$route.query.companyUserId,
      title: '添加企业账号',
      sTitle: '创建企业账号',
      form: this.$form.createForm(this),
      roleList: [], // 角色选择
      storageList: [],
      clientRoles:{}, //智能称重客户端角色
      cloudRoles:{},//物流仓储中心角色
      appSupervisorRoles: {}, // 站台巡库角色
      stationWarehouseList: {}, // 仓房列表
      loading: false,
      form1:this.$form.createForm(this),
      statusList: filterCodeByKey("companyStatusDict"),
      validRole:(key) => {
        return (rule,value,callback) => {
          let clientRole = this.form1.getFieldValue(`clientRole_${key}`)||[],
          cloudRole = this.form1.getFieldValue(`cloudRole_${key}`)||[],
          appSupervisorRoles = this.form1.getFieldValue(`appSupervisorRoles_${key}`),
            stationWarehouseList = this.form1.getFieldValue(`stationWarehouseList_${key}`);
          if (!clientRole.length && !cloudRole.length && !appSupervisorRoles) {
            let errorMessage = '智能称重客户端角色、物流仓储中心角色、站台巡库角色至少选择一个';
            if (this.isCoreCompany) {
              errorMessage = '智能称重客户端角色、物流仓储中心角色、现场管理角色至少选择一个';
            }
            callback(errorMessage);
            return
          }
          if (appSupervisorRoles === 'LOGISTICS_STATION_SUPERVISOR' && !stationWarehouseList) {
            callback('库房至少选择一个')
            this.form1.setFields({
              [`clientRole_${key}`]:{value:clientRole , errors:false},
              [`cloudRole_${key}`]:{value:cloudRole,errors:false},
              [`appSupervisorRoles_${key}`]:{value:appSupervisorRoles,errors:false},
            })
            return
          }
          this.form1.setFields({
            [`clientRole_${key}`]:{value:clientRole , errors:false},
            [`cloudRole_${key}`]:{value:cloudRole,errors:false},
            [`appSupervisorRoles_${key}`]:{value:appSupervisorRoles,errors:false},
            [`stationWarehouseList_${key}`]:{value:stationWarehouseList,errors:false}
          })
          callback()
        }
      },
      assignRole: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(){
      await this.getRoleList()
      await this.getUserRolesStation()
      this.handleScroll()
      if (this.$route.query.type === 'edit') {
        this.title = '编辑企业账号',
        this.sTitle = '编辑企业账号'
        this.getDetail()
      }
    },
    // fixed随页面滚动
    handleScroll(){
      this.$nextTick(()=>{
        var thead = document.querySelector(".slDetailBottom")
        var lw = document.querySelector("#app")
        lw.addEventListener('scroll', function(){
          var sl = 228-lw.scrollLeft;
          thead.style.left = sl + 'px';
        })
      })
    },
    getRoleList() {
      API_USERROLECOMPANYTYPE().then((res) => {
        this.roleList = res.data.map((item) => {
          return {
            value: item.id,
            text: item.name,
            code: item.code,
          };
        });
      });
    },
    sleep(ss){
      return new Promise((resolve) => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          resolve()
        },ss)
      })
    },
    getDetail() {
      let rolesIds = this.editUserData.rolesCache.map((item) => item.id);
     const has =  this.roleList.some((item) => rolesIds.includes(item.value));
     if(!has){
      rolesIds.length = 0;
      }
      let data = {
        account: this.editUserData.account,
        roles: rolesIds,
        status: this.editUserData.status,
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(data);
      })
      
      if(!has){
        return
      }
      API_GET_ROLES_STATION({
        id: this.id
      }).then(res => {
        if(!res.success) {
          return
        }
        if(res.data.length == 0){
          return
        }
        let form1Data ={};
        data.stationRoles = [];
        res.data.forEach((item) => {
          data.stationRoles.push(`${item.stationId}`);
          form1Data[`clientRole_${item.stationId}`] = item.clientRoles || [];
          form1Data[`cloudRole_${item.stationId}`] = item.cloudRoles || [];
          form1Data[`appSupervisorRoles_${item.stationId}`] = item.stationSupervisorRole ||[]
          form1Data[`stationWarehouseList_${item.stationId}`] = item.stationWarehouseIdList ||[]
        });
        this.storageChange(data.stationRoles)
       
        this.$nextTick(() => {
          this.form.setFieldsValue(data);
          this.sleep(100).then(() => {
            this.form.setFieldsValue({stationRoles:data.stationRoles});
          })
          
          this.form.$nextTick(() => {
            this.form1.setFieldsValue(form1Data)
            this.sleep(100).then(() => {
              res.data.forEach((item) => {
                this.form1.setFieldsValue({
                  [`stationWarehouseList_${item.stationId}`]:form1Data[`stationWarehouseList_${item.stationId}`]
                })
              })
            })
           
          })
        })
      })
     
    },
    getUserRolesStation() {
      return API_ROLES_STATION().then(res => {
        if(res.success) {
          this.storageList = res.data;
        }
      })
    },
    // selectChange() {
    //   let rolesIds = this.form.getFieldValue('roles');
    //   if(rolesIds?.length == 1 && rolesIds[0] == 'spec') {
    //     this.form.setFieldsValue({
    //       roles: []
    //     });
    //     rolesIds = [];
    //     this.form.validateFields(['roles']);
    //   }
    //   if(rolesIds?.length) {
    //     return true;
    //   }
    //   const ids = this.storageList.reduce((pre, cur) => {
    //     return pre.concat(cur.roleIds)
    //   }, []);
    //   if(!ids.length && !rolesIds?.length) {
    //     return false;
    //   } else {
    //     this.form.setFieldsValue({
    //       roles: ['spec']
    //     });
    //     return true;
    //   }
    // },
    getStationName(key){
      return this.storageList.filter((item) => item.stationId == key )[0]?.station;
    },
    storageChange(keys){
      for(let i = 0; i < this.storageList.length; i++ ){
        let item = this.storageList[i];
        if(keys.includes(item.stationId)){
          this.clientRoles[item.stationId] = [...item.clientRoles];
          if (this.isCoreCompany) {

            if (item.cloudRoles) {
              item.cloudRoles.forEach(item => { 
              if (item.name == '物流管理员') {
                item.name="配置管理员"
              }
              })
            }

            if (item.appSupervisorRoles) {
              item.appSupervisorRoles.forEach(item => { 
                if (item.name == '监管负责人') {
                  item.name='库管负责人'
                } else if (item.name == '监管员') {
                  item.name='库管员'
                } else if (item.name == '巡库观察员') {
                  item.name='库管观察员'
                }
              })
            }
   
          }
          this.cloudRoles[item.stationId] = [...item.cloudRoles];
          this.appSupervisorRoles[item.stationId] = [...(item.appSupervisorRoles)];
          this.stationWarehouseList[item.stationId] = [...(item.stationWarehouseList || [])]
        }
      }
    },
    handleStationRoles(values){
      return new Promise((resolve) => {
        if(values.stationRoles){
          this.form1.validateFields((error,roles) => {
            if(error){
              resolve(false);
              return
            }
            values.stationRoles = values.stationRoles.map((stationRole) => {
              let clientRole = roles[`clientRole_${stationRole}`]||[],
              cloudRole = roles[`cloudRole_${stationRole}`]||[],
              appSupervisorRoles =  roles[`appSupervisorRoles_${stationRole}`] ||[];
              if(!Array.isArray(appSupervisorRoles)){
                appSupervisorRoles = [appSupervisorRoles]
              }
              let stationWarehouseIdList = []
              if (appSupervisorRoles.length && appSupervisorRoles[0].includes('LOGISTICS_STATION_SUPERVISOR') && !appSupervisorRoles[0].includes('LOGISTICS_STATION_SUPERVISOR_OBSERVER')) {
                stationWarehouseIdList = roles[`stationWarehouseList_${stationRole}`]||[];
              }
              return {
                stationId:stationRole,
                stationName:this.storageList.filter((item) => item.stationId ==stationRole )[0]?.station,
                roleIds:[...clientRole,...cloudRole,...appSupervisorRoles],
                stationWarehouseIdList: stationWarehouseIdList
              }
            })
            resolve(true)
          })
          return
        }
        resolve(true)
      })
    },
    // 用户列表 修改
    modifyUserList(data) {
      if(data.roles && data.roles.length == 1 && data.roles[0] == 'spec') {
        data.roles = [];
      }
      if (data.roles) {
        data.roleIds = data.roles;
      }
      API_COMPANYUSERMODIFY(omit(data, ["roles", "id"]), data.id).then(
        (res) => {
          if (res.success) {
            this.$message.success("保存成功");
            this.$router.push('/center/account/company/user')
          }
        }
      );
    },
    // 用户列表 新增
    addUserList(data) {
      if(data.roles && data.roles.length == 1 && data.roles[0] == 'spec') {
        data.roles = [];
      }
      if (data.roles) {
        data.roleIds = data.roles;
      }
      API_COMPANYUSERADD(omit(data, ["roles"])).then((res) => {
        if (res.success && res.data) {
          this.$message.success("提交成功");
          this.$router.push('/center/account/company/user')
        }
      });
    },
    // 清除选择角色的提示
    changeAssign() {
      this.form.setFields({roles: { value: [], errors: null }})
    },
    cancel(){
      this.$refs.backRef.showModal({
        modalTitle: '取消',
        modalText: '点击取消后，该页面信息将不会保存，是否继续取消？'
      });
      
    },
    backOk(){
      this.$router.push('/center/account/company/user')
    },
    showLogistics(){
      let logisticsService = (this.form.getFieldValue('roles')||[]).some((item) => {
        return item.includes('LOGISTICS_SERVICE') || item.includes("WAREHOUSE_STATION_MANAGE_SERVICE")
      } )
      return logisticsService && this.storageList?.length > 0
    },
    showStationList(){
      if(!this.form.getFieldValue('stationRoles') ){
        return false
      }
      return this.showLogistics();
    },
    checkRoles(roles){
      let index = Math.max(roles.indexOf("WAREHOUSE_STATION_MANAGE_SERVICE"),roles.indexOf("WAREHOUSE_LOGISTICS_SERVICE"));
      if(index == -1){
        return
      }
      
      if(this.storageList.length <= 0){
        roles.splice(index,1)
        this.$message.error("无法勾选，请先添加仓储场地")
        return
      }
    },
    submit() {
      // this.selectChange()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.query.type == "edit") {
            if (
              filterCodeByTextName(values.status, "user_status") ==
              this.editUserData.status
            ) {
              values.status = this.editUserData.status;
            }
          }
          const params = {
            ...values,
            assignRole: !this.assignRole,
          }


          switch (this.$route.query.type) {
            case "add":
              // if(!this.selectChange()) return;
              this.handleStationRoles(params).then((isok) => {
                if(!isok){
                  return
                }
                this.addUserList(params);
              })
              break;
            case "edit":
              // if(!this.selectChange()) return;
              params.id = this.editUserData.companyUserId;
              this.handleStationRoles(params).then((isok) => {
                if(!isok){
                  return
                }
                this.modifyUserList(params);
              })
              break;
          }
        }
      });
    }
  },
 
  computed: {
    ...mapGetters('user', {
      VUEX_ST_EDITCOMPANYPROFILE: 'VUEX_ST_EDITCOMPANYPROFILE',
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
    }),
    isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
    roleData() {
      return filterCodeByKey("company_biz_role").filter((el) => {
        return el.value == 2; // 港口方只有业务员
      });
    },
    
    editUserData() {
      this.assignRole = !this.VUEX_ST_EDITCOMPANYPROFILE.assignRole
      return this.VUEX_ST_EDITCOMPANYPROFILE;
    }
  },
  filters: {
    filterCodeByValueName,
  },
};
</script>

<style lang="less" scoped>
  .slFormDetail {
    padding: 30px 0;
    ::v-deep.ant-form-item {
      margin-bottom: 30px;
    }
    ::v-deep.ant-form-item-label {
      margin-bottom: 20px;
    }
    ::v-deep.ant-checkbox-group {
      width: 100%;
    }
    ::v-deep.ant-radio-group {
      width: 100%;
    }
    ::v-deep.ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 0;
    }
    ::v-deep.ant-radio-wrapper {
      margin-right: 0;
    }
    ::v-deep.ant-form-item {
      margin-bottom: 0;
      min-height: 92px;
    }
    .statusItem {
      min-height: 86px;
    }
  }
  .chooseRole {
    ::v-deep.ant-form-item {
      margin-bottom: 30px;
    }
  }
  .slTitleAssis {
    margin-top: 30px;
  }
  .slDetailBottom {
    width: calc(100vw - 254px);
    min-width: 1186px;
    height: 64px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #E5E6EB;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 228px;
  }
  .labelTips {
    font-size: 14px;
    zoom: 0.85;
    color: rgba(0,0,0,0.25);
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .tip {
    color: rgba(0,0,0,0.25);
    margin-bottom: 20px;
  }
  .checkItem {
    width:16%;
    margin-bottom:10px;
    pointer-events: none;
    ::v-deep {
      span{
        pointer-events:all;
      }
    }
  }
  .checkItem:first-child {
    //margin-bottom: 20px;
  }
  .authRole-group {
    .checkItem:last-child{
      margin-bottom: 30px;
    }
  }

.divider {
	background: #e5e6eb;
	width: 100%;
	height: 1px;
	margin: 0 0 30px;
}
.stationForm {
	.station-roles {
		margin-bottom: 20px;
		border-radius: 4px;
		background: #f5fcff;
		padding: 20px 20px 10px 20px;
		.title {
			color: rgba(0, 0, 0, 0.8);
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 500;
			margin-bottom: 20px;
		}
		::v-deep.ant-form-item {
			display: flex;
			flex-direction: row;
			align-content: flex-start;
			min-height: 40px;
			margin-bottom: 0;
			.checkItem1 {
				width: 16%;
        pointer-events: none;
        span{
          pointer-events:all;
        }
			}
		}
		::v-deep.ant-form-item-control-wrapper {
			width: 100%;
		}
	}
	::v-deep.ant-form-item-label {
		width: 160px;
		text-align: left;
		margin-bottom: 0 !important;
	}
}
::v-deep.ant-checkbox-wrapper {
	color: rgba(0, 0, 0, 0.8);
}
::v-deep.ant-radio-wrapper {
	color: rgba(0, 0, 0, 0.8);
}

@media screen and (min-width: 1920px) {
	.checkItem {
		width: 14%;
	}
}
</style>
