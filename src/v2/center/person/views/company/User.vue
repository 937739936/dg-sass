<template>
  <div class="wrapper slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">企业账号管理</span>
        <span>
          <a-button 
            slot="tabBarExtraContent"
            type="primary" 
            v-if="activeKey == 1" 
            @click="createAccount"
            v-auth="'company:user:add'"
          >创建企业账号</a-button>
          <a-button 
            slot="tabBarExtraContent" 
            type="primary" 
            v-if="activeKey == 3"
            @click="inviteAccount"
          >邀请企业员工</a-button>
        </span>
      </div>
      <div>
        <a-tabs :activeKey="activeKey" tabPosition="top" @change="onTabChange">
          <a-tab-pane tab="账号列表" key="1">
            <div style="width: 100%;">
              <AccountList ref="account"></AccountList>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="申请列表" key="2">
            <div style="width: 100%;">
              <ApplyList ref="apply"></ApplyList>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="邀请列表" key="3">
            <div style="width: 100%;">
              <InviteList ref="invite"></InviteList>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>
<script>

import {
  filterCodeByValueName,
} from '@sub/utils/globalCode.js';
import AccountList from "./user/AccountList";
import ApplyList from "./user/ApplyList";
import InviteList from "./user/InviteList";

export default {
  components:{
    AccountList,
    ApplyList,
    InviteList
  },
  data() {
    return {
      activeKey: this.$route.query.activeKey || '1',
    };
  },
  
  created() {
    
  },
  methods: {
    createAccount(){
      this.$refs.account.showModal("add")
    },
    inviteAccount(){
      this.$refs.invite.showModal()
    },
    // 获取分配企业用户角色及状态
    getSelectData(data) {
      let roles = this.unAssignList.filter((el) => {
        return data == el.id;
      });
      if (roles && roles.length && roles[0].roles) {
        if (this.editUserType == "invite") {
          this.form.setFieldsValue({
            roles: filterCodeByValueName(roles[0].roles, "company_biz_role"),
          });
        } else {
          this.form.setFieldsValue({
            roles: filterCodeByValueName(roles[0].roles, "company_biz_role"),
          });
          this.form.setFieldsValue({
            status: filterCodeByValueName(roles[0].status, "user_status"),
          });
        }
      }
    },
    // tab切换事件
    onTabChange(key) {
      this.activeKey = key;
      switch (key) {
        case "1":
          this.$refs.account?.getUserList();
          break;
        case "2":
          this.$refs.apply?.getUserApplyList();
          break;
        case "3":
          this.$refs.invite?.getUserInviteList();
          break;
      }
    },
  },
  
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}

// .center-user {
//   .control-wrap {
//     a {
//       display: inline-block;
//       padding: 0 6px;
//     }
//   }

//   .search-wrap {
//     padding: 0 0 16px 0;

//     .ant-select {
//       width: 100%;
//     }
//   }

//   .s-card-title {
//     margin: 6px 0 16px;
//     font-family: PingFangSC-Medium;
//     font-size: 16px;
//     color: #141517;
//     letter-spacing: 0;
//     line-height: 24px;
//   }

//   .s-card-content {
//     border-top: 1px solid#EEF0F2;
//   }

//   .order-wrap {
//     button {
//       width: 104px;
//     }
//   }
// }

// ::v-deep .ant-checkbox-group {
//   width: 100%;
// }

// ::v-deep.ant-table-wrapper {
//   width: 100%;
// }

// ::v-deep.ant-tabs-tabpane {
//   display: block !important;
// }

// ::v-deep.ant-tabs-bar {
//   border: none;
// }

// ::v-deep.ant-form-item {
//   margin-bottom: 14px;
// }

// ::v-deep.ant-form-item-label {
//   text-align: left;
// }

// ::v-deep.ant-modal-body {
//   padding: 20px 32px 12px 20px;
// }

// ::v-deep.ant-modal-title {
//   font-family: PingFangSC-Medium;
//   font-size: 16px;
//   color: #383a3f;
//   letter-spacing: 0;
//   line-height: 24px;
// }

// .station-roles {
//   padding-top: 10px;
//   margin-bottom: 10px;
//   background-color: rgba(#efefef, 0.5);
// }

// .methods-wrap {
//   width: 100%;
//   height: 48px;
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
//   padding-bottom: 14px;
//   box-sizing: border-box;
//   border-bottom: 1px solid #e5e6eb;
// }
</style>
