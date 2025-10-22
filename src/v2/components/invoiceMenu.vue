<template>
  <a-menu
    class="menu-wrap menu-wrap-invoice"
    :open-keys.sync="openKeysInvoice"
    mode="inline"
    :selected-keys="selectedKeys"
    @click="handleClick"
  >
    <a-sub-menu :key="item.name" v-for="item in VUEX_GE_CENTERMENUS">
      <span slot="title" class="menu-icon">
        <img class="" :src="currentSrc(item)" />
        <span>{{ item.name }}</span>
      </span>
      <a-menu-item :key="itm.link" v-for="itm in item.children">
        <router-link :to="itm.link">{{ itm.name }}</router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
<script>
import { mapGetters } from "vuex";
import storage from "@sub/utils/storage";

export default {
  data() {
    return {
      openKeysInvoice: ["进项发票"],
      activeMenuIcon: {
        进项发票: require("@/v2/assets/imgs/menu/invoice/in-active.png"),
        销项发票: require("@/v2/assets/imgs/menu/invoice/out-active.png"),
        运费发票: require("@/v2/assets/imgs/menu/invoice/transport-active.png"),
        合同管理: require("@/v2/assets/imgs/menu/invoice/contract-active.png"),
      },
      activeMenu: "进项发票",
      selectedKeys: [],
    };
  },
  watch: {
    "$route.path": {
      handler(value) {
        if (value) {
          const elem = document.querySelector(".content-wrap");
          if (elem) {
            elem.scrollTop = 0;
          }
        }
      },
    },
  },
  computed: {
    ...mapGetters("user", {
      VUEX_GE_CENTERMENUS: "VUEX_GE_CENTERMENUS",
      VUEX_GE_CURRENT_PATH: "VUEX_GE_CURRENT_PATH",
    }),
  },
  methods: {
    currentSrc(item) {
      return this.activeMenu == item.name
        ? this.activeMenuIcon[item.name]
        : item.icon;
    },
    handleClick(e) {
      storage.session.set("selectedKeys", e.key);
      storage.session.set("openKeysInvoice", e.keyPath[1]);
      this.selectedKeys = [e.key];
      this.activeMenu = e.keyPath[1];
    },
    setSelectedKeys() {
      const storagePath = storage.session.get("selectedKeys");
      const storageOpenKeys = storage.session.get("openKeysInvoice");
      const path = storagePath
        ? [storagePath]
        : ["/center/admin/invoice/in/list"];
      const pathOpen = storageOpenKeys
        ? Array.isArray(storageOpenKeys)
          ? storageOpenKeys
          : [storageOpenKeys]
        : ["进项发票"];
      this.selectedKeys = path;
      this.openKeysInvoice = pathOpen;
      this.activeMenu = storageOpenKeys;
    },
  },
  mounted() {
    this.setSelectedKeys();
  },
  beforeDestroy() {
    storage.session.remove("selectedKeys");
    storage.session.remove("openKeysInvoice");
  },
};
</script>

<style lang="less" scoped>
.menu-wrap-invoice {
  .menu-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      display: inline-block;
      margin-right: 8px;
    }
  }
  /deep/ .ant-menu-submenu-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /deep/ .ant-menu-submenu-arrow {
    width: 14px !important;
    height: 14px;
    background: url("~@/v2/assets/imgs/menu/invoice/down.png");
    background-size: 14px 14px;
    background-repeat: no-repeat;
    background-position: center;
    position: relative !important;
    top: 0 !important;
    left: 10px;
  }
  /deep/ .ant-menu-submenu-arrow::before {
    display: none;
  }
  /deep/ .ant-menu-submenu-arrow::after {
    display: none;
  }
  /deep/
    .ant-menu-submenu-open.ant-menu-submenu-inline
    > .ant-menu-submenu-title
    .ant-menu-submenu-arrow {
    width: 14px !important;
    height: 14px;
    background: url("~@/v2/assets/imgs/menu/invoice/down.png");
    background-size: 14px 14px;
    background-repeat: no-repeat;
    background-position: center;
    top: 40%;
    transform: rotate(180deg);
  }
}
</style>