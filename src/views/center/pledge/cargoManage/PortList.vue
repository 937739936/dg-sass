<template>
  <div class="s-card">
    <div class="s-card-title">货物管理</div>
    <div class="divider"></div>
    <a-tabs @change="callback">
      <a-tab-pane :key="item.id" :tab="item.name" v-for="(item) in list"></a-tab-pane>
    </a-tabs>
    <div class="s-card-content" style="margin-top:14px;">
      <a-row type="flex" :gutter="16" justify="space-between">
        <a-col :span="11" v-for="(item, index) in pointList" :key="index" :index="index">
          <div class="mb16 item-wrapper">
            <div class="item">
              <img src="@/assets/imgs/cargoManage.png">
              <div class="name">
                <span>{{ item.inventoryPoint }}</span>
              </div>
              <div>
                <p>更新时间：{{ item.lastModifiedDate || '-' }}</p>
                <p>当前库存：{{ item.inventoryQuantity || '-' }}</p>
                <p style="margin-bottom: 0">质押吨位：{{ item.pledgeQuantity || '-' }}</p>
              </div>
            </div>
            <div class="button" @click="jumpPage(item)">进入</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import { API_STORAGEGOODSSTORAGELIST, API_STORAGEGOODSPOINTLIST } from '@/api'
  export default {
      name: 'CargoManageList',
      data() {
          return {
              list: [],
              pointList: [],
              applyTime: null,
              accountPayableList: [],
          }
      },
      created() {
        API_STORAGEGOODSSTORAGELIST().then((res) => {
          if (res.success) {
            this.list = res.data
            if (res.data && res.data[0]) {
              this.getPointList(res.data[0].id)
            }
          }
        })
      },
      methods: {
        getPointList(storageId) {
          this.storageId = storageId
          API_STORAGEGOODSPOINTLIST({ storageId }).then((res) => {
            if (res.success) {
              this.pointList = res.data
            }
          })
        },
        callback(storageId) {
          this.getPointList(storageId)
        },
        jumpPage({ inventoryPointId, id }) {
              this.$router.push({
                  path: '/center/pledge/portdetail',
                  query: {
                    goodsId: id,
                    pointId: inventoryPointId,
                    storageId: this.storageId,

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
  .item-wrapper{
    border: 1px solid rgba(220, 222, 226, 1);
    border-radius: 3px;
    overflow: hidden;
    .item{
      padding: 16px;
      display: flex;
      position: relative;
      .name{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 16px;
        left: 16px;
        width: 115px;
        height: 115px;
        span{
          font-size: 16px;
          font-weight: bold;
        }
      }
      img {
        width: 115px;
        height: 115px;
        margin-right: 8px;
      }
      p{
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
    .button{
      width: 100%;
      height: 30px;
      background-color: @primary-color;
      color: #ffffff;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
</style>