<template>
  <div style="width: 100%" v-if="isShow" >
    <a-menu theme="light" mode="vertical" class="logistics-menu" v-if="isLogisticsPlatform">
      <a-sub-menu key="sub1" popupClassName="popup-sub-menu" >
        <span slot="title" class="station-title">
          <div class="title-wrap">
            {{VUEX_CURRENT_PLATEFORM.label}}
          </div>
          <div class="swap">
          </div>
        </span>
        <a-menu-item 
          :key="item.stationId+'-'+item.companyCreditCode" 
          v-for="item in logisticsPlatformList"
          @click="changePlatform"
        >
          {{item.label}}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <a-menu
      mode="inline"
      theme="light"
      :selectedKeys="[currentSelectedRoutePath]"
      :openKeys="openKeys"
      @openChange="openChange"
      id="left-menu"
    >
      <template v-for="item in menuList" >
        <a-sub-menu :key="item.name" v-if="item.children">
          <span class="menu-icon" slot="title">
            <img v-if="item.icon && item.icon.includes('png')" :src="item.icon"/>
            <span v-else :class="[item.icon, 'icon-menu-class', 'iconfont']"></span>
            <span class="menu-title">{{ item.name }}</span>
          </span>
          <a-menu-item
            :key="itm.link"
            v-for="(itm) in item.children"
            >
              <router-link :to="toPath(itm)">{{ itm.name }}</router-link>
            </a-menu-item
          >
        </a-sub-menu>
        <a-menu-item v-else :key="item.name">
          <router-link :to="item.link">
            <span class="menu-icon">
              <img v-if="item.icon && item.icon.includes('png')" :src="item.icon" />
              <span
                v-else
                :class="[item.icon, 'icon-menu-class', 'iconfont']"
              ></span>
              <span class="menu-title">{{ item.name }}</span>
            </span>
          </router-link>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import storage from "@sub/utils/storage";
import {getSubsystemOptions,subsystemOptionsEdit} from "@/v2/center/logisticsPlatform/api";
import { getQueryString } from '@/v2/utils/index';

export default {
  data() {
    return {
      collapsed: true,
      isShow: true,
      currentSelectedRoutePath: "",
      openKeys: [],
      currentSecondPath: [],
      isLogisticsPlatform:false,
      logisticsPlatformList:[],
      currentLogisticsPlatform:{}
    };
  },
  watch: {
    VUEX_GE_CENTERMENUS(value) {
      if(value.length) {
        const itemsList = value.reduce((pre, cur) => {
          if(cur.link){
           return pre?.concat(cur)
          }else if(cur?.children){
            //防止没有children情况
            return pre?.concat(cur?.children);
          }else{
            return pre
          }
        }, []);
        this.currentSecondPath = itemsList.map(item => item.link);
        //针对物流仓储中心特殊处理
        // if(!this.currentSecondPath.includes(this.currentSelectedRoutePath)){
        //   let link = this.currentSecondPath[0];
        //   if(link.startsWith('/center/logisticsPlatform') && 
        //   this.currentSelectedRoutePath.startsWith('/center/logisticsPlatform')
        //   ){
        //     this.$router.replace(link)
        //     this.currentSelectedRoutePath = link
        //   }
        // }
      }
    },
    $route: {
      handler(v) {
        this.currentSelectedRoutePath = v.path;
        this.openKeys = [...new Set(this.openKeys.concat(v?.matched[1]?.meta?.title || ''))];
        const elem = document.querySelector("#mainContent");
        if (elem && elem.scrollTop !== 0) {
          elem.scrollTop = 0;
        }
        if(v.path) {
          const pathArr = v.path.split('/');
          if(this.currentSecondPath.includes(this.$route.path)) {
            this.VUEX_MU_CURRENT_PATH(this.$route.path);
            this.SET_VUEX_GE_CENTERMENUS({path: `/${pathArr[1]}/${pathArr[2]}/`});
          } else {
            this.SET_VUEX_GE_CENTERMENUS({path: `/${pathArr[1]}/${pathArr[2]}/`});
          }
          if(v.path.includes('/center/logisticsPlatform')){
            this.isLogisticsPlatform = true;
          }else{
            this.isLogisticsPlatform = false;
          }
        }
        let path = v.path;
        let item = this.getOpenKey(path);
        if (v.query.selectKey) {
          path = v.query.selectKey;
        }
        if (item) {
          this.currentSelectedRoutePath = item.link;
          if (this.openKeys.indexOf(item.name) <= -1) {
            let list = [...this.openKeys, item.name];
            if (list.length > 2) {
              this.openKeys = list.slice(1);
            } else {
              this.openKeys = list;
            }
            storage.session.set("openKeys", this.openKeys);
          }
        }
      },
      immediate: true,
    },
    openKeys: {
      handler(value) {
        if(value && value.length > 2) {
          this.openKeys = this.openKeys.slice(1);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      SET_VUEX_GE_CENTERMENUS: 'user/SET_VUEX_GE_CENTERMENUS',
      VUEX_MU_CURRENT_PATH: 'user/VUEX_MU_CURRENT_PATH',
      SET_VUEX_CURRENT_PLATEFORM: 'user/SET_VUEX_CURRENT_PLATEFORM'
    }),
    /**
     * 如果是从另外一个系统跳转到个人中心
     * url参数会带上redirect_url
     * 此时在个人中心跳转也需要带上redirect_url
     * 退出登录时要跳转到redirect_url
    */
    toPath(item) {
      if(!item.link.startsWith('/center/account')) {
        return item.link;
      }
      const redirect_url = getQueryString('redirect_url');
      if(redirect_url) {
        return `${item.link}${window.location.search}`;
      } else {
        return item.link;
      }
    },
    resetCurrentPath() {
      this.openKeys = [];
    },
    activeCurrentPath(item) {
      let flag = false;
      if(this.$route.path === item.link) {
        flag = true;
      }
      return {
        'ant-menu-item-selected': flag
      }
    },
    getOpenKey(v) {
      let currentKey = "";
      const arr = this.VUEX_GE_CENTERMENUS;
      arr.forEach((item) => {
        if(item.link){
          if (item.link == v) {
              currentKey = {
                name: item.name,
                link: item.link,
              };
            }
        }
        if (item.children && item.children.length) {
          item.children.forEach((_item) => {
            if (_item.link == v) {
              currentKey = {
                name: item.name,
                link: _item.link,
              };
              return;
            }
          });
        }
      });
      return currentKey;
    },
    openChange(v) {
      // 最多开2两个菜单
      this.openKeys = v;
    },
    goPointPage(item, name) {
      this.VUEX_MU_CURRENT_PATH(item.link);
      if (this.$route.path == item.link) return;
      // storage.session.set("openKeys", [name]);
      this.$router.replace(item.link);
    },
    changePlatform(selected){
      let {stationId,companyCreditCode} = this.currentLogisticsPlatform;
      let key = stationId+'-'+companyCreditCode
      if(key == selected.key){
        return
      }
      let current = this.logisticsPlatformList.filter((item) => item.stationId+'-'+item.companyCreditCode == selected.key )[0];
      subsystemOptionsEdit({
        stationId:current.stationId,
        companyCreditCode:current.companyCreditCode
      }).then((res) => {
        if(!res.success){
          return
        }
       
        // this.$router.push({path: '/center/logisticsPlatform/coalplan/IN'})
        // this.$router.go()
        this.$router
          .push({ path: "/center/logisticsPlatform/coalplan/IN" })
          .then(() => {
            this.$router.go();
          });

      })

    },
    getSubsystemOptions(){
      getSubsystemOptions().then(({success,data}) => {
        if(!success){
          return
        }
        this.logisticsPlatformList = data;
        this.currentLogisticsPlatform = data.filter((item) => item.selected)[0];
        if(!this.currentLogisticsPlatform){
          let current ={ ...(data[0]||{}),selected:true};
          this.currentLogisticsPlatform = current
          this.changePlatform({key:current.stationId+'-'+current.companyCreditCode})
          
        }
        this.SET_VUEX_CURRENT_PLATEFORM({
          ...this.currentLogisticsPlatform,
          allStationList: data,
        })
      })
    }
  },
  computed: {
    ...mapGetters("user", {
      VUEX_GE_CENTERMENUS: "VUEX_GE_CENTERMENUS",
      VUEX_GE_CURRENT_PATH: "VUEX_GE_CURRENT_PATH",
      VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),
    menuList() {
      return this.VUEX_GE_CENTERMENUS?.filter(item => item?.children?.length > 0);
    }
  },
  mounted() {
    
    // this.currentSelectedRoutePath = this.$route.path;
    
    // this.openKeys = storage.session.get("openKeys");
    this.getSubsystemOptions();
    
  },
};
</script>

<style lang="less" scoped>
.menu-icon {
  width: 100%;
  img {
    width: 16px;
    height: 16px;
    position: relative;
    top: -2px;
  }
}
/deep/ .ant-menu-submenu-title,#left-menu>.ant-menu-item {
  width: 208px;
  height: 48px;
  font-size: 16px;
  padding-left: 20px !important;
  vertical-align: middle;
}
/deep/ #left-menu>.ant-menu-item {
  font-size: 14px;
  a{
    color:rgba(0, 0, 0, 0.8);
  }
}
/deep/ .ant-menu-item {
  font-size: 14px;
  margin: 0 !important;
  position: relative;
}

.logistics-menu{
  // background-color:#0049C2 !important;
  &.ant-menu-vertical{
    border-right:none;
  }
  .ant-menu-submenu-title{
    padding-left:10px !important;
  }
  .station-title{
    display:flex;
    align-items:center;
    justify-content:space-between;
    width: 184px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #E9EEF0;
    padding: 10px;
    margin-left: -10px;
    margin-right: 10px;
    .title-wrap {
      color: #000;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      width:100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .swap {
      width: 14px;
      height: 14px;
      background: url(~@/v2/assets/imgs/common/change_icon.png) no-repeat 100%/cover;
      position: relative;
      top: 1px;
    }
  }
  /deep/ .ant-menu-submenu-arrow{
    display:none !important;
  }
  
}
.popup-sub-menu{
  text-align:left;
  width:20px;
  .ant-menu-vertical.ant-menu-sub{
    min-width:120px;
  }
  .ant-menu-item{
    padding-left:20px !important;
  }
}

.icon-menu-class {
  width: 16px;
  height: 14px;
  display: inline-block;
}
#left-menu {
  /deep/ .ant-menu-submenu-title {
    width: 208px;
    height: 48px;
    line-height: 48px;
    margin: 0;
    padding: 0;
  }
}
.menu-title {
  margin-left: 10px;
}
.router-link-active {
  font-weight: 500;
  color: @primary-color;
  font-family: PingFangSC-Medium, PingFang SC;
}
.router-link-active::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 26px;
  background: @primary-color;
  position: absolute;
  top: 11px;
  left: 0;
}
</style>
