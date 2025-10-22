<template>
  <a-popover
    v-model="visible"
    trigger="hover"
    @visibleChange="visibleChange"
    placement="bottomRight"
  >
    <template slot="content">
      <div v-if="!VUEX_ST_COMPANYSUER.company" class="unverified">
        <div class="userinfo">
          <img
            class="avatar"
            :src="
              VUEX_ST_PERSONALLINFO.picUrl
                ? VUEX_ST_PERSONALLINFO.picUrl
                : require('@/v2/assets/imgs/person/default-avatar.png')
            "
          />
          <div v-if="!VUEX_ST_PERSONALLINFO.name" class="name">
            个人认证
            <img src="../../v2/assets/imgs/person/wsm.png" alt="" class="rz" />
            <a href="javascript:;" @click="showModel"> 去实名 </a>
          </div>
          <div v-else class="name">
            {{ VUEX_ST_PERSONALLINFO.name }}
            <img src="../../v2/assets/imgs/person/ysm.png" alt="" class="rz" />
          </div>
        </div>
        <div
          style="
            margin-top: 13px;
            margin-left: 4px;
            margin-right: -16px;
            border-bottom: 1px solid #e5e6eb;
          "
        ></div>
        <div class="select-item" @click="goPage('/center/account/person/info')">
          个人信息
        </div>
        <div
          class="select-item"
          @click="goPage('/center/account/person/safety')"
        >
          安全管理
        </div>
        <div
          style="
            margin-left: 4px;
            margin-right: -16px;
            border-bottom: 1px solid #e5e6eb;
          "
        ></div>
        <div class="select-item" @click="logout" style="margin-bottom: -12px">
          安全退出
          <img
            src="../../v2/assets/imgs/person/over.png"
            alt=""
            style="margin-top: 17px"
          />
        </div>
      </div>
      <div class="verified" v-else>
        <div class="userinfoMain">
          <div class="userinfo">
            <img
              class="avatar"
              :src="
                VUEX_ST_PERSONALLINFO.picUrl
                  ? VUEX_ST_PERSONALLINFO.picUrl
                  : require('@/v2/assets/imgs/person/default-avatar.png')
              "
            />
            <div class="name">
              {{ VUEX_ST_PERSONALLINFO.name }}
              <img
                src="../../v2/assets/imgs/person/ysm.png"
                alt=""
                class="rz"
              />
            </div>
          </div>
          <!-- 核心企业有切换业务负责人权限 -->
          <div
            v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'"
            class="businessUser"
            @click="getDirectorByUser"
          >
            <a-tooltip>
              <template slot="title"> 切换业务负责人 </template>
              <i class="iconfont icon-zhanghuguanli"></i>
            </a-tooltip>
          </div>
        </div>
        <div
          style="
            margin-top: 13px;
            margin-left: 4px;
            margin-right: -16px;
            border-bottom: 1px solid #e5e6eb;
          "
        ></div>

        <div
          class="quick-entrance quick-entrance2"
          v-if="VUEX_ST_COMPANYSUER.company.group"
        >
          <div class="quick-btn" @click="goPage('/center/account/person/info')">
            个人信息
          </div>
          <div
            class="quick-btn"
            @click="goPage('/center/account/person/safety')"
          >
            安全管理
          </div>
          <template>
            <div class="quick-btn" @click="operation('applyJoinCompany')">
              加入新企业
            </div>
            <div class="quick-btn" @click="operation('verifyJoinCompany')">
              邀请码验证
            </div>
            <div class="quick-btn" @click="operation('companyTypeModal')">
              认证新企业
            </div>
          </template>
        </div>

        <div class="quick-entrance" v-else>
          <div
            style="width: 50%"
            @click="goPage('/center/account/person/info')"
          >
            个人信息
          </div>
          <div
            style="width: 50%"
            @click="goPage('/center/account/person/safety')"
          >
            安全管理
          </div>
        </div>
        <div
          style="
            margin-left: 4px;
            margin-right: -16px;
            border-bottom: 1px solid #e5e6eb;
          "
        ></div>

        <div class="company-list">
          <div
            class="item"
            v-for="item in otherCompany"
            :key="`${item.companyUscc}${item.mobile}`"
          >
            <div style="width: 310px" @click.stop="switchCompany(item)">
              <div class="company-name">
                {{ item.companyName }}
              </div>
              <div class="username">
                {{ item.personalName }}（{{ item.mobile }}）
              </div>
            </div>
            <div style="line-height: 48px">
              <img
                src="../../v2/assets/imgs/person/nowLogin.png"
                alt=""
                style="width: 76px; margin-bottom: 8px"
                v-if="item.currentLogin"
              />
              <template v-else>
                <a
                  href="javascript:;"
                  style="margin-right: 20px"
                  @click.stop="switchCompany(item)"
                  >切换账号</a
                >
                <a
                  href="javascript:;"
                  v-if="item.supportDel"
                  @click.stop="deleteCompany(item)"
                  >删除</a
                >
              </template>
            </div>
          </div>
        </div>
        <a-row class="logout" @click="logout" style="margin-bottom: -12px">
          <a-col :span="12" @click="logout">
            安全退出
            <img src="../../v2/assets/imgs/person/over.png" alt="" />
          </a-col>
          <a-col :span="12" @click="addAccount">
            添加账号
            <img src="../../v2/assets/imgs/person/add.png" alt="" />
          </a-col>
        </a-row>
      </div>
    </template>
    <div class="header-name-avatar header-name">
      <div class="nickname">
        <p
          class="name ellipsis"
          :style="{
            'line-height': !VUEX_ST_COMPANYSUER.company ? '35px' : '',
          }"
        >
          {{ VUEX_ST_PERSONALLINFO.name || "未认证" }}
        </p>
        <p class="name companyName ellipsis" v-if="VUEX_ST_COMPANYSUER.company">
          {{ VUEX_ST_COMPANYSUER.company.abbreviation }}
        </p>
      </div>
      <img
        class="avatar"
        :src="
          VUEX_ST_PERSONALLINFO.picUrl
            ? VUEX_ST_PERSONALLINFO.picUrl
            : require('@/v2/assets/imgs/person/default-avatar.png')
        "
      />
      <Login ref="login" />
      <CurrentDirector ref="currentDirector" />
      <CompanyTypeModal ref="companyTypeModal" :isGroup="true" />
      <ApplyJoinCompany ref="applyJoinCompany" :isGroup="true" />
      <VerifyJoinCompany ref="verifyJoinCompany" :isGroup="true" />
      <personValid ref="personValidModel" />
    </div>
  </a-popover>
</template>

<script>
import ENV from "api/env.js";
import {
  API_COMPANYGETSWITCHCOMPANY,
  API_COMPANYUSERSWITCH,
  API_COMPANYUSERDELETELOGINHISTORY
} from "api/account";
import { mapGetters, mapMutations, mapActions } from "vuex";
import CurrentDirector from "@/components/common/modules/CurrentDirector";
import CompanyTypeModal from "@/v2/center/person/components/CompanyTypeModal.vue";
import ApplyJoinCompany from "@/v2/center/person/components/ApplyJoinCompany.vue";
import VerifyJoinCompany from "@/v2/center/person/components/VerifyJoinCompany.vue";
import Login from "@/components/common/modules/Login";
import personValid from "@/v2/components/personValid";
import storage from "@sub/utils/storage";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getPersonalDetail } from "untils/factory.js";

export default {
  data() {
    return {
      ENV: ENV,
      visible: false,
      otherCompany: [],
    };
  },
  components: {
    CurrentDirector,
    Login,
    CompanyTypeModal,
    ApplyJoinCompany,
    VerifyJoinCompany,
    personValid,
  },
  computed: {
    ...mapGetters("user", {
      VUEX_GE_CENTERMENUS: "VUEX_GE_CENTERMENUS",
      VUEX_GE_CENTERMENUSMAP: "VUEX_GE_CENTERMENUSMAP",
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
    }),
    filterMenuList() {
      return this.VUEX_GE_CENTERMENUSMAP.filter(
        (item) =>
          item.menuList &&
          item.menuList.length > 0 &&
          item.name !== "invoiceTools"
      );
    },
  },
  mounted() {
    this.getOtherCompany();
  },
  methods: {
    ...mapMutations({
      VUEX_MU_USERTOKEN: "user/VUEX_MU_USERTOKEN",
      VUEX_MU_BACKURL: "user/VUEX_MU_BACKURL",
      VUEX_MU_CURRENT_PATH: "user/VUEX_MU_CURRENT_PATH",
    }),
    ...mapActions({
      VUEX_USER_LOGOUT: "user/VUEX_USER_LOGOUT",
    }),
    showModel() {
      this.unverifiedVisible = false;
      this.visible = true;
      this.$refs.personValidModel.showPersonValid();
    },
    reloadPage() {
      window.location.reload();
    },
    ...mapActions({
      VUEX_USER_LOGOUT: "user/VUEX_USER_LOGOUT",
    }),
    // 更新用户信息 权限信息
    operation(value) {
      this.$refs[value].showModal();
      this.visible = false;
    },
    switchCompany({
      companyUscc,
      status,
      rejectReason,
      companyName,
      authCompanyType,
      loginPassword,
      supportDel,
      companyUserId,
      currentLogin,
    }) {
      if (currentLogin) {
        return;
      }
      if (status === "EDIT") {
        this.$confirm({
          centered: true,
          title: `您发起的“${companyName}”的企业认证审核被驳回，驳回原因：${rejectReason}`,
          okText: "重新提交认证",
          cancelText: "取消",
          icon: () => <a-icon type="exclamation-circle" theme="filled" />,
          onOk: () =>
            this.$router.push({
              path: "/center/account/company/info/certified",
              query: {
                recertification: "recertification",
                uscc: companyUscc,
                name: companyName,
                type: authCompanyType,
              },
            }),
        });
        return;
      }
      if (status === "APPROVAL") {
        this.$confirm({
          centered: true,
          title: "当前企业正在审核，请等待审核结果",
          okText: "确定",
          okCancel: null,
          cancelText: "取消",
          icon: () => <a-icon type="exclamation-circle" theme="filled" />,
        });
        return;
      }
      API_COMPANYUSERSWITCH({
        companyUscc,
        loginPassword,
        supportDel,
        loginUniqueId: this.loginUniqueId,
        companyUserId,
      }).then((res) => {
        let ary = [];
        this.filterMenuList.map((item) => {
          item.menuList.map((r) => {
            if (r.link) {
              ary.push(r);
            } else if (r.children) {
              ary = ary.concat(r.children);
            }
          });
        });
        if (this.$route.matched[1].meta.authCode == "dgChain") {
          storage.session.set("nowAuthCode", "dgChain");
        } else {
          ary.map((i) => {
            if (this.$route.fullPath == i.link) {
              storage.session.set("nowAuthCode", i.authCode);
            }
          });
        }
        // 替换token 更新用户详情，以及权限
        if (res.success) {
          if (!res.data.result) {
            if (res.data.message.includes("冻结")) {
              this.$warning({
                title: "提示",
                content: res.data.message,
                okText: "取消",
                onOk: () => {},
              });
            } else {
              this.$warning({
                title: "提示",
                content: res.data.message,
                okText: "去登录",
                onOk: () => {
                  this.logout();
                },
              });
            }
          } else {
          const { token } = res.data.token;
          this.VUEX_MU_USERTOKEN(token);
          // 临时写法
          storage.session.set("switchCompany", true);
          getPersonalDetail(this.reloadPage);
          }
        }
      });
    },
    addAccount() {
      this.$refs.login.init();
    },
    async getvisitorId() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      storage.session.set("loginUniqueId", result.visitorId);
      this.loginUniqueId = result.visitorId;
    },
    async getOtherCompany() {
      if (!this.loginUniqueId) {
        await this.getvisitorId();
      }
      if (this.VUEX_ST_COMPANYSUER.companyName) {
        API_COMPANYGETSWITCHCOMPANY({
          loginUniqueId: this.loginUniqueId,
        }).then((res) => {
          if (res.success) {
            this.otherCompany = res.data || [];
          }
        });
      }
    },
    //切换业务负责人
    getDirectorByUser() {
      this.$refs.currentDirector.showModal();
    },
    visibleChange(v) {
      if (v) {
        this.getOtherCompany();
      }
    },
    goPage(url) {
      this.$router.push(url);
    },
    // 注销
    logout() {
      this.VUEX_USER_LOGOUT();
    },
    deleteCompany({ companyUserId }){
      this.$confirm({
        centered: true,
        content: '删除后需重新输入账号和密码登录，您确认删除吗？',
        title: '信息提示',
        okText: '确定',
        cancelText: '取消',
        icon: () => {
          return <a-icon type="exclamation-circle" theme="filled" />
        },
        onOk: () => {
          this.deleteCompanyHistory(companyUserId)
        },
        onCancel() {}
      })
    },
    deleteCompanyHistory( companyUserId ){
      API_COMPANYUSERDELETELOGINHISTORY({companyUserId,loginUniqueId:this.loginUniqueId }).then((res) => {
        // 替换token 更新用户详情，以及权限
        if (res.success) {
          this.$message.success('操作成功')
          this.getOtherCompany();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.header-name-avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
.header-name {
  height: 64px;
  font-size: 12px;
  color: #ffffff;

  .right-content {
    display: flex;
    cursor: pointer;
    margin-right: 30px;
    margin-left: 10px;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    margin-top: 3px;
    object-fit: cover;
  }
  .notice-icon {
    width: 18px;
    height: 18px;
    background-image: url(~@/v2/assets/imgs/home/notice_icon.png);
    margin-right: 24px;
    background-size: cover;
    position: relative;
    margin-top: 9px;
    .notice-count {
      height: 16px;
      padding: 0 5px;
      position: absolute;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      color: #ffffff;
      top: -5px;
      left: 18px;
      background: #e8372b;
      border-radius: 8px 8px 8px 0px;
    }
    &:hover {
      background-image: url(~@/v2/assets/imgs/home/notice_icon_hover.png);
    }
  }
  .notice-icon.has {
    width: 21px;
    height: 23px;
    background-image: url(~@/v2/assets/imgs/home/notice_icon_has.png);
    margin-top: 4px;
    &:hover {
      background-image: url(~@/v2/assets/imgs/home/notice_icon_has_hover.png);
    }
  }

  .nickname {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #141517;
    letter-spacing: 0;
    text-align: left;
    line-height: 40px;
    margin-left: 14px;
    .name {
      line-height: 18px;
      display: block;
      margin-right: 10px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
      text-align: right;
    }
    .companyName {
      max-width: 120px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.4);
    }
  }
}

/deep/ .ant-popover-inner-content {
  padding: 0 !important;
}

.unverified {
  width: 224px;
  .userinfo {
    display: flex;
    line-height: 38px;
    .name {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      line-height: 38px;
      .rz {
        width: 40px;
        height: 20px;
        margin-bottom: 2px;
        margin-left: 6px;
        margin-right: 8px;
      }
    }
    .avatar {
      width: 38px;
      height: 38px;
      margin-left: 4px;
      margin-right: 12px;
      border-radius: 50%;
    }
  }
  .select-item {
    height: 48px;
    line-height: 48px;
    padding-left: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    img {
      width: 14px;
      height: 14px;
    }
  }
}
.verified {
  width: 424px;
  .userinfoMain {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    .businessUser {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      text-align: center;
      font-size: 18px;
      line-height: 22px;
      cursor: pointer;
      &:hover {
        background: rgba(119, 136, 157, 0.1);
      }
    }
  }
  .userinfo {
    display: flex;
    line-height: 38px;
    .name {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      line-height: 38px;
      .rz {
        width: 40px;
        height: 20px;
        margin-bottom: 2px;
        margin-left: 6px;
        margin-right: 8px;
      }
    }
    .avatar {
      width: 38px;
      height: 38px;
      margin-left: 4px;
      margin-right: 12px;
      border-radius: 50%;
    }
  }
  .quick-entrance {
    display: flex;
    height: 48px;

    .quick-btn:hover {
      background: rgba(243, 245, 246, 1);
      border-radius: 4px;
    }
    div {
      width: 20%;
      text-align: center;
      line-height: 48px;
      font-weight: 400;
      cursor: pointer;
      color: @primary-color;
      font-size: 14px;
      &:after {
        content: "";
        float: right;
        display: block;
        width: 1px;
        height: 12px;
        background: #e5e6eb;
        margin-top: 16px;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
    }
  }
  .quick-entrance2 {
    padding: 5px 0;
    box-sizing: border-box;
    line-height: 38px;
    .quick-btn {
      line-height: 38px;
    }
  }

  .company-list {
    max-height: calc(100vh - 260px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-right: -16px;
    .item {
      line-height: 64px;
      height: 64px;
      margin-left: -16px;
      margin-right: -16px;
      display: flex;
      padding-left: 20px;
      padding-top: 10px;
      &:hover {
        background: rgba(228, 235, 244, 1) !important;
      }
      &:nth-child(2n + 2) {
        background: #f3f5f6;
      }
      &:hover {
        color: #0053db;
        cursor: pointer;
        white-space: nowrap;
      }
    }
    .company-name {
      width: 300px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      line-height: 20px;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .username {
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      line-height: 17px;
    }
  }
  .logout {
    div {
      height: 48px;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      &:first-child {
        &:after {
          content: "";
          float: right;
          display: block;
          width: 1px;
          height: 12px;
          background: #e5e6eb;
          margin-top: 16px;
        }
      }
      img {
        width: 14px;
        height: 14px;
        margin-left: 10px;
      }
      &:hover {
				color: @primary-color;
			}
    }
  }
}
</style>
