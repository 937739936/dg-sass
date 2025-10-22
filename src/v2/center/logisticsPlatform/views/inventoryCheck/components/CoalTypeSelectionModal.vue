<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="649px"
    :forceRender="true"
    :destroyOnClose="true"
    class="slModal"
  >
    <template slot="title">
      <div class="title">
        <div class="name">煤种修改</div>
      </div>
    </template>
    <a-spin :spinning="spinning">
      <div class="content" v-if="!spinning && coalTypeList.length == 0">
        <div class="empty">
          <img src="@/v2/assets/imgs/person/msg-no.png" />
          <span class="empty_tip">暂无数据</span>
        </div>
      </div>
      <div class="content" v-else>
        <div class="content_title">选择煤种</div>
        <div class="select_list">
          <a-checkbox-group
            style="width: 100%"
            :value="selectCoalTypes"
            @change="selectedChange"
          >
            <a-row :gutter="[20, 20]">
              <a-col
                v-for="coalTypeItem in coalTypeList"
                :key="coalTypeItem.name"
                :span="6"
              >
                <a-checkbox :value="coalTypeItem.name">{{
                  coalTypeItem.name
                }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
    </a-spin>
    <template slot="footer">
      <div class="footer">
        <div class="back-action" @click="close">取消</div>
        <div class="save-action" @click="saveSelectedCoalType">保存</div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { getCoalTypeAllList, modifyInventoryTaskCoalType } from "../../../api";

export default {
  name: "CoalTypeSelectionModal",
  data() {
    return {
      visible: false,
      spinning: false,
      selectCoalTypes: [],
      coalTypeList: [],
      taskId: undefined,
    };
  },
  methods: {
    show(list, taskId) {
      if (!taskId) {
        // this.close()
        return;
      }
      this.coalTypeList = [];
      this.taskId = taskId;
      this.selectCoalTypes = list ?? [];
      this.visible = true;
      this.getCoalTypeList();
    },
    close() {
      this.visible = false;
    },
    selectedChange(checkedValue) {
      this.selectCoalTypes = checkedValue;
    },
    getCoalTypeList() {
      this.spinning = true;
      getCoalTypeAllList()
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.coalTypeList = res.data || [];
        })
        .catch(() => {})
        .finally(() => {
          this.spinning = false;
        });
    },
    // 保存
    saveSelectedCoalType() {
      let coalType = this.selectCoalTypes.join(",");
      this.spinning = true;
      modifyInventoryTaskCoalType({
        taskId: this.taskId,
        coalType: coalType,
      })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.coalTypeList = res.data || [];
          this.close();
          this.$emit("changeCoalTypeSuccess", coalType);
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
.slModal {
  ::v-deep {
    .ant-modal-mask,
    .ant-modal-wrap {
      z-index: 1002;
    }
    .ant-modal-header {
      padding: 0 20px;
      height: 58px;
      background-color: #f3f5f6;
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
  ::v-deep {
    .ant-checkbox-inner {
      border-radius: 4px;
      border-color: #c6cdd8;

      &:hover {
        border-radius: 4px;
      }

      &.ant-checkbox-disabled {
        background-color: #eeeeee;
        border-color: #c3c3c3 !important;
      }
    }

    .ant-checkbox-checked {
      .ant-checkbox-inner {
        border-color: @primary-color;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 9px;
          height: 7px;
          border: 0;
          background-image: url("~@/v2/assets/imgs/invoicetools/checkbox.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
          transform: none;
          content: "";
        }
      }
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
      margin-right: 30px;
      padding-left: 30px;
      padding-right: 30px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #e5e6eb;
      background: #fff;
      color: rgba(0, 0, 0, 0.8);
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .save-action {
      padding-left: 30px;
      padding-right: 30px;
      height: 32px;
      border-radius: 4px;
      background: @primary-color;
      color: white;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .content {
    padding: 20px;
    .content_title {
      color: rgba(0, 0, 0, 0.8);
      font-size: 14px;
      font-weight: 500;
    }
    .select_list {
      margin-top: 20px;
      display: flex;
      width: 100%;
    }
  }
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
}
</style>