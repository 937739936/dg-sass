<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="788px"
    :forceRender="true"
    :destroyOnClose="true"
    class="slModal"
  >
    <template slot="title">
      <div class="title">
        <div class="name">编辑</div>
      </div>
    </template>
    <a-spin :spinning="spinning">
      <div class="content">
        <a-form class="slFormDetail" :form="form" :colon="false">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="站台名称">
                <a-input
                  placeholder="请输入站台名称"
                  v-decorator="['stationName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="仓房名称">
                <a-input
                  placeholder="请输入仓房名称"
                  v-decorator="['houseName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="货位名称">
                <a-input
                  placeholder="请输入货位名称"
                  v-decorator="['goodsAllocationName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="所属货主">
                <a-input
                  placeholder="请输入所属货主"
                  v-decorator="['goodsOwnerCompanyName']"
                  disabled
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="定时盘库时间">
                <a-time-picker
                  class="slTimepicker"
                  style="width: 100%"
                  placeholder="请选择定时盘库时间"
                  :defaultOpenValue="defaultOpenTime"
                  :allowClear="false"
                  :disabledMinutes="disabledMinutes"
                  :disabledSeconds="disabledSeconds"
                  v-decorator="[
                    'inventoryTime',
                    {
                      rules: [
                        { required: true, message: `请选择定时盘库时间` },
                      ],
                    },
                  ]"
                >
                  <template #suffixIcon>
                    <img
                      src="@/v2/assets/imgs/logisticsPlatform/time_icon.png"
                      width="14"
                      alt=""
                    />
                  </template>
                </a-time-picker>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="盘库间隔（天）">
                <a-input-number
                  placeholder="请输入盘库间隔"
                  style="width: 100%"
                  :min="1"
                  :max="365"
                  :step="1"
                  v-decorator="[
                    'inventoryInterval',
                    {
                      rules: [{ required: true, message: `请输入盘库间隔` }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-spin>
    <template slot="footer">
      <div class="footer">
        <div class="back-action" @click="close">取消</div>
        <div class="save-action" @click="saveModifyInfo">确定</div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import moment from "moment";
import {
  getInventoryConfigDetail,
  modifyInventoryConfigDetail,
} from "../../../api";
import { range } from "lodash";

export default {
  name: "InventoryConfigEditModal",
  data() {
    return {
      visible: false,
      spinning: false,
      detailInfo: {},
      record: {},
      form: this.$form.createForm(this),
      defaultOpenTime: moment("00:00:00"),
    };
  },

  methods: {
    show(record) {
      this.record = record;
      this.visible = true;
      this.getConfigDetail();
    },
    close() {
      this.visible = false;
      this.detailInfo = {};
      this.form.resetFields();
    },
    // 获取配置详情
    getConfigDetail() {
      this.spinning = true;
      getInventoryConfigDetail({ configId: this.record.id })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.detailInfo = res.data || [];
          let inventoryTime = this.detailInfo.inventoryTime
            ? moment(this.detailInfo.inventoryTime, "HH:mm:ss")
            : null;
          this.form.setFieldsValue({
            ...this.detailInfo,
            inventoryTime: inventoryTime,
          });
        })
        .catch(() => {})
        .finally(() => {
          // this.form.setFieldsValue({ ...this.record });
          this.spinning = false;
        });
    },
    // 保存
    saveModifyInfo() {
      this.form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.spinning = true;
        const { inventoryTime, inventoryInterval } = values;
        modifyInventoryConfigDetail({
          configId: this.record.id,
          inventoryTime: inventoryTime.format("HH:mm:ss"),
          inventoryInterval: inventoryInterval,
        })
          .then((res) => {
            if (!res.success) {
              return;
            }
            this.close();
            this.$emit("changeConfigSuccess");
          })
          .catch(() => {})
          .finally(() => {
            this.spinning = false;
          });
      });
    },
    disabledMinutes() {
      return range(0, 60);
    },
    disabledSeconds() {
      return range(0, 60);
    },
  },
};
</script>
<style lang="less">
.ant-time-picker-panel {
  /* 你的样式 */
  // background-color: red;

  .ant-time-picker-panel-select {
    color: #000000cc;
    border-left: 1px solid #e5e6eb;
  }
  .ant-time-picker-panel-select li {
    padding: 0;
    text-align: center;
  }
  .ant-time-picker-panel-select:first-child {
    border-left: 0;
  }
}
</style>

<style lang="less" scoped>
.slModal {
  .closeIcon {
    width: 22px;
    height: 22px;
  }
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
      border: 1px solid #c3c3c3;
      background: #fff;
      color: #00000066;
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

    .slTimepicker {
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
}
</style>