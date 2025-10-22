<template>
  <div class="breadcrumb-wrap">
    <a-breadcrumb :routes="routes" v-if="routes.length">
      <template slot="itemRender" slot-scope="{ route, params, routes }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.name }}
        </span>
        <span class="route-item" v-else @click="routeChange(route.path)">
          {{ route.name }}
        </span>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script>
export default {
  name: "breadcrumb",
  data() {
    return {
      backInterceptList: ['/center/contract/transport/add']
    };
  },
  props: {
    type: {

    }
  },
  methods: {
    routeChange(path) {
      if(this.backInterceptList.includes(this.$route.path)) {
        this.$emit('routeChange', path);
        return;
      }
      if(path.includes(':type')) {
        let pathArr = path.split(':type')
        if (pathArr.length && pathArr.length === 2) {
          path = pathArr[0] + this.type + pathArr[1]
        }
      }
      this.$router.push(path);
    }
  },
  computed: {
    routes() {
      const pathArr = [];
      let name = 'title'
      if(this.type == 'OUT') {
        name = 'reverseTitle'
      }
      this.$route.matched.forEach(item => {
        pathArr.push({
          path: item.path,
          name:  item.meta[name] || item.meta.title,
        })
      });
      // 站台 物流 特殊处理
      if(this.type == 'OUT') {
        pathArr[1].name = '出库管理'
      }
      if(this.$route.query.id){
        pathArr[pathArr.length - 1].name = pathArr[pathArr.length - 1].name?.replace('新增', '编辑');
      }
      return pathArr.slice(1, pathArr.length);
    },
  },
};
</script>
<style lang="less" scoped>
.breadcrumb-wrap {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0,0,0,0.4);
  line-height: 20px;
  position: sticky;
  top:0;
  z-index: 999;
  padding: 15px 0;
  background-color: #f3f5f6;
  width: 100%;
  ::v-deep.ant-breadcrumb{
    line-height: 20px;
    &>span:last-child {
      .ant-breadcrumb-link {
        font-family: PingFangSC-Medium, PingFang SC!important;;
        font-weight: 500!important;;
        color: rgba(0,0,0,0.4)!important;
      }
    }
  }
  .route-item {
    cursor: pointer;
  }
}
</style>
