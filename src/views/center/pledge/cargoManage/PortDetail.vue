<template>
  <div class="s-card">
    <div>
      <div class="s-card-title">
        {{ detailData.storageName }}-{{ detailData.inventoryPoint }}
        <span style="position: absolute; right: 0; top: 0;">
          <a-button type="primary" class="mr8" v-auth="'goods:goods:edit'" @click="jumpPage('in')">新增入库</a-button>
          <a-button type="primary" v-auth="'goods:goods:edit'" @click="jumpPage('out')">新增出库</a-button>
        </span>
      </div>
    </div>
    <div class="divider"></div>
    <div class="mt16">
      <p class="tr" style="line-height: 30px;">更新时间：{{ detailData.lastModifiedDate }}</p>
      <a-row class="tc mb16" type="flex" :gutter="8" justify="space-between">
        <a-col :span="6" class="item">
          <p class="name">当前库存（吨）</p>
          <p>{{ detailData.inventoryQuantity }}</p>
        </a-col>
        <a-col :span="6" class="item">
          <p class="name">当前预估货值（元）</p>
          <p>{{ detailData.inventoryValue }}</p>
        </a-col>
        <a-col :span="6" class="item">
          <p class="name">当前质押吨位（吨）</p>
          <p>{{ detailData.pledgeQuantity }}</p>
        </a-col>
        <a-col :span="6" class="item">
          <p class="name">当前质押预估货值（元）</p>
          <p>{{ detailData.pledgeValue }}</p>
        </a-col>
      </a-row>
    </div>
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="入库数据">
      </a-tab-pane>
      <a-tab-pane key="2" tab="出库数据" force-render>
      </a-tab-pane>
    </a-tabs>
    <template v-if="detailData.id">
      <InOutList key="1" type="in" :goodsId="detailData.id" v-if="activeKey === '1'" />
      <InOutList key="2" type="out" :goodsId="detailData.id" v-if="activeKey === '2'" />
    </template>
  </div>
</template>
<script>
  import { API_STORAGEGOODSPOINTDETAIL } from '@/api'
  import InOutList from './components/InOutList.vue'

  export default {
      name: 'CargoManageList',
      components: {
        InOutList
      },
      data() {
          return {
              goodsId: '',
              activeKey: '1',
              detailData: {},
              applyTime: null,
              accountPayableList: [],
          }
      },
      created() {
        this.goodsId = this.$route.query.goodsId;
        this.getDetail()
        // this.$router.push({
        //     path: '',
        //     query: {}
        //   })
      },
      methods: {
        getDetail() {
          API_STORAGEGOODSPOINTDETAIL({ id: this.goodsId }).then((res) => {
            if (res.success) {
              this.detailData = res.data
            }
          })
        },
        jumpPage(pageType) {
            this.$router.push({
              path: '/center/pledge/cargoManageCreateInOut',
              query: {
                pageType,
                activeIndex: pageType === 'in' ? 0 : 1,
                goodsId: this.$route.query.goodsId,
                pointId: this.$route.query.pointId,
                storageId: this.$route.query.storageId,
              }
            })
          },
      }
  }
</script>

<style lang="less" scoped>
.divider {
    background: #f4f5f8;
    height: 1px;
    margin-top:20px;
    margin-left: -20px;
    margin-right: -20px;
  }
  .s-card-title{
      margin-top: 10px;
      font-family: PingFangSC-Medium;
      color: #141517;
      line-height: 24px;
      position: relative;
      &>button{
          position: absolute;
          right: 16px;
      }
  }
  .item{
    line-height: 30px;
    font-weight: bold;
  }
</style>