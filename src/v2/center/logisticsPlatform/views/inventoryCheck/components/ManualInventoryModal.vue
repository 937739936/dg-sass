<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="683px"
    :forceRender="true"
    :destroyOnClose="true"
    class="slModal manual-modal"
  >
    <template slot="title">
      <div class="title">
        <div class="name">手动盘库</div>
      </div>
    </template>
    <!-- <template slot="closeIcon">
      <img
        src="~@/v2/assets/imgs/logisticsPlatform/modal_close_icon.png"
        width="22"
        alt=""
      />
    </template> -->
    <a-spin :spinning="spinning">
      <div class="content" v-if="!spinning && dataSource.length == 0">
        <div class="empty">
          <img src="@/v2/assets/imgs/person/msg-no.png" />
          <span class="empty_tip">暂无可盘点库房</span>
        </div>
      </div>
      <div class="content" v-else>
        <div
          v-for="houseItem in dataSource"
          :key="houseItem.id"
          class="house_item"
        >
          <div class="house_header">
            <div class="house_name">{{ houseItem.houseName }}</div>
            <div class="house_compony">
              {{ houseItem.goodsOwnerCompanyName }}
            </div>
          </div>
          <div class="good_list">
            <div
              class="good_item"
              v-for="goodsItem in houseItem.goodsAllocationList"
              :key="goodsItem.goodsAllocationId"
            >
              <div class="good_name">{{ goodsItem.goodsAllocationName }}</div>
              <div v-if="goodsItem.inventoryDate" class="good_check_message">
                盘点开始时间:
                <span class="good_check_time">{{
                  goodsItem.inventoryDate
                }}</span
                >，正在计算处理中，预计用时30分钟
              </div>
              <ConfigProvider v-else :autoInsertSpaceInButton="false">
                <a-button
                  class="check_btn"
                  type="ghost"
                  size="small"
                  :loading="goodsItem.goodsAllocationId == 1"
                  @click="onClickCheckBtn(goodsItem)"
                  >盘点</a-button
                >
              </ConfigProvider>
            </div>
          </div>
        </div>
        <modalInfo
          ref="modalInfo"
          @verify="modalInfoOK"
          title="盘库"
          tip="将启动盘库设备扫描，是否确认进行盘库操作？"
        />
      </div>
    </a-spin>
    <template slot="footer">
      <div class="footer">
        <div class="back-action" @click="close">返回</div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import {
  getGoodsAllocationCheckList,
  submitGoodsAllocationInventory,
} from "../../../api";
import modalInfo from "@/v2/components/modalInfo/info";
import { ConfigProvider } from "ant-design-vue";

export default {
  name: "ManualInventoryModal",
  components: {
    modalInfo,
    ConfigProvider,
  },
  data() {
    return {
      visible: false,
      spinning: true,
      dataSource: [],
      currentCheckGoodsAllocationId: undefined, // 当前正在进行盘库操作的货位id
    };
  },
  mounted() {},
  methods: {
    show() {
      this.currentCheckGoodsAllocationId = undefined;
      this.dataSource = [];
      this.visible = true;
      this.getCheckList();
    },
    close() {
      this.visible = false;
    },
    onClickCheckBtn(goodsItem) {
      this.currentCheckGoodsAllocationId = goodsItem.goodsAllocationId;
      this.$refs.modalInfo.open();
    },
    modalInfoOK() {
      this.$refs.modalInfo.close();
      if (this.currentCheckGoodsAllocationId == undefined) {
        return;
      }
      this.spinning = true;
      submitGoodsAllocationInventory({
        goodsAllocationId: this.currentCheckGoodsAllocationId,
      })
        .then((res) => {
          if (!res.success) {
            this.spinning = false;
            return;
          }
          this.getCheckList();
          this.$emit("startNewAutoCheck");
        })
        .catch(() => {
          this.spinning = false;
        })
        .finally(() => {
          this.currentCheckGoodsAllocationId = undefined;
        });
    },
    getCheckList() {
      this.spinning = true;
      getGoodsAllocationCheckList()
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.dataSource = res.data || [];
        })
        .catch(() => {})
        .finally(() => {
          this.spinning = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.manual-modal {
  ::v-deep {
    .ant-modal-header {
      padding: 0 20px;
      height: 58px;
      background-color: #f3f5f6;
      border-bottom: none;
      .ant-modal-title {
        height: 100%;
      }
    }
    .ant-modal-body {
      padding: 0px;
    }
    .ant-modal-footer {
      padding: 16px 20px;
    }
  }
  .title {
    display: flex;
    align-items: center;
    height: 100%;
    .name {
      font-size: 18px;
      color: rgba(#000, 0.8);
      font-weight: 500;
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    .back-action {
      margin-left: 30px;
      padding-left: 30px;
      padding-right: 30px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #c3c3c3;
      background: #fff;
      color: #00000066;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .content {
    padding: 20px;
    // padding: 0 0px;
    height: 326px;
    overflow-y: scroll;
    .empty {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      img {
        width: 66px;
        height: 66px;
      }
      .empty_tip {
        margin-top: 20px;
        color: rgba(0, 0, 0, 0.25);
        font-size: 14px;
      }
    }
    .house_item {
      border-radius: 4px;
      background: var(---BG, #f3f5f6);
      margin-bottom: 10px;
      padding: 0 0 0 20px;
    }
    .house_header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 14px 0px;
      border-bottom: 1px solid #e5e6eb;
      .house_name {
        color: rgba(0, 0, 0, 0.8);
        font-size: 16px;
        font-weight: bold;
      }
      .house_compony {
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
        margin-left: 10px;
      }
    }
    .good_list {
      padding: 9px 0px;
      .good_item {
        padding: 9px 0px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .good_name {
          color: rgba(0, 0, 0, 0.8);
          font-size: 14px;
          width: 128px;
          margin-right: 20px;
        }
        .good_check_message {
          color: rgba(0, 0, 0, 0.4);
          font-size: 14px;
        }
        .good_check_time {
          color: rgba(0, 0, 0, 0.8);
          font-size: 14px;
        }
        .check_btn {
          border: 1px solid @primary-color;
          color: @primary-color;
          padding: 0 16px;
          border-radius: 4px;
          height: 24px;
          word-spacing: 1px;
          font-size: 14px;
        }
      }
    }
  }
}
// .slModal {
//   .closeIcon {
//     width: 22px;
//     height: 22px;
//   }
// }
</style>