<template>
  <div class="slMain">
    <Breadcrumb />

    <a-card :bordered="false" class="content">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">盘库详情</span>
      </div>
      <a-spin :spinning="detailInfoLoading">
        <div>
          <ul class="grid-wrap">
            <li>
              <span class="label">仓房</span>
              <span> {{ detailInfo.houseName || "-" }} </span>
            </li>
            <li>
              <span class="label">货位</span>
              <span> {{ detailInfo.goodsAllocationName || "-" }}</span>
            </li>
            <li>
              <span class="label">所属货主</span>
              <span> {{ detailInfo.goodsOwnerCompanyName || "-" }}</span>
            </li>
            <li>
              <span class="label">盘库时间</span>
              <span> {{ detailInfo.inventoryDate || "-" }} </span>
            </li>
            <li>
              <span class="label">盘库类型</span>
              <span> {{ detailInfo.inventoryTypeText || "-" }}</span>
            </li>
            <li>
              <span class="label">煤种</span>
              <div class="coalTypes-view">
                <a-tooltip placement="topLeft">
                  <template v-if="detailInfo.coalType" slot="title">
                    <span>
                      {{ detailInfo.coalType }}
                    </span>
                  </template>
                  <span class="coalType-Content">{{
                    detailInfo.coalType || "-"
                  }}</span>
                </a-tooltip>
                <img
                  src="@/v2/assets/imgs/logisticsPlatform/edit_icon.png"
                  alt=""
                  class="edit-icon"
                  @click="changeCoalType"
                />
              </div>
            </li>
            <li>
              <span class="label">体积（m³）</span>
              <span> {{ transformNumberInfo(detailInfo.volume) }} </span>
            </li>
            <li>
              <span class="label">密度（吨/m³）</span>
              <span v-if="isDensityCanEdit && isDensityEditing">
                <div class="density_edit">
                  <a-input-number
                    class="density_input"
                    :min="0"
                    :max="100"
                    :step="0.01"
                    :precision="2"
                    :value="modifyDensity"
                    @change="onChangeDensity"
                  />

                  <div class="density_actions">
                    <div
                      class="cancle-action"
                      @click="changeDensityStatus(false)"
                    >
                      取消
                    </div>
                    <div class="save-action" @click="saveModifyDensity()">
                      保存
                    </div>
                  </div>
                </div>
              </span>
              <span v-else>
                {{ densityShowText
                }}<img
                  v-if="isDensityCanEdit"
                  src="@/v2/assets/imgs/logisticsPlatform/edit_icon.png"
                  alt=""
                  class="edit-icon"
                  @click="changeDensityStatus(true)"
              /></span>
            </li>
            <li>
              <span class="label">重量（吨）</span>
              <span> {{ transformNumberInfo(detailInfo.weight) }}</span>
            </li>
          </ul>
          <div class="slTitleAssis" style="margin: 30px 0">货物3D可视图</div>
          <div class="points-cloud" v-if="!detailInfoLoading">
            <PointsCloud :inventoryStatus="detailInfo.status"></PointsCloud>
          </div>
        </div>
      </a-spin>
    </a-card>
    <CoalTypeSelectionModal
      ref="coalTypeSelectionModal"
      @changeCoalTypeSuccess="changeCoalTypeSuccess"
    />
  </div>
</template>

<script>
import Breadcrumb from "@/v2/components/breadcrumb/index";
import PointsCloud from "@sub/logisticsPlatform/components/PointsCloud";
import CoalTypeSelectionModal from "./components/CoalTypeSelectionModal.vue";
import { getInventoryTaskDetail, modifyInventoryTaskDensity } from "../../api";


export default {
  components: {
    Breadcrumb,
    PointsCloud,
    CoalTypeSelectionModal,
  },
  data() {
    let { id } = this.$route.query;
    return {
      taskId: id,
      detailInfoLoading: false,
      isDensityEditing: false,
      modifyDensity: undefined, // 准备修改的密度
      detailInfo: {},
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    // 煤种列表
    coalTypeList() {
      let coalType = this.detailInfo.coalType ?? "";
      coalType = coalType.replace("，", ",");
      let coalTypeList = coalType.split(",");
      return coalTypeList;
    },
    // 密度显示文字
    densityShowText() {
      if (this.coalTypeList.length > 1) {
        // 当所选煤种数>=2时，不支持修改，取值重置为“-”
        return "-";
      }
      if (this.detailInfo.density == 0) {
        return "0";
      }
      return this.detailInfo.density || "-";
    },
    // 是否可以编辑密度
    isDensityCanEdit() {
      // 煤种大于一个时不可编辑
      return this.coalTypeList.length <= 1;
    },
  },
  methods: {
    // 修改煤种
    changeCoalType() {
      this.$refs.coalTypeSelectionModal.show(this.coalTypeList, this.taskId);
    },
    changeCoalTypeSuccess(newCoalType) {
      this.$set(this.detailInfo, "coalType", newCoalType);
      this.getDetail();
    },
    getDetail() {
      this.detailInfoLoading = true;
      getInventoryTaskDetail({ taskId: this.taskId })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.detailInfo = res.data || {};
        })
        .catch(() => {})
        .finally(() => {
          this.detailInfoLoading = false;
        });
    },
    // 改变密度修改状态
    changeDensityStatus(edit) {
      if (edit) {
        this.modifyDensity = this.detailInfo.density;
      }
      this.isDensityEditing = edit;
    },
    onChangeDensity(v) {
      this.modifyDensity = v;
    },
    // 修改密度
    saveModifyDensity() {
      // this.spinning = true;
      modifyInventoryTaskDensity({
        taskId: this.taskId,
        density: this.modifyDensity,
      })
        .then((res) => {
          if (!res.success) {
            return;
          }
          this.changeDensityStatus(false);
          this.getDetail();
        })
        .catch(() => {})
        .finally(() => {
          this.changeDensityStatus(false);
        });
    },
    transformNumberInfo(value) {
      if (value == 0) {
        return "0";
      }
      return value || "-";
    },
  },
};
</script>

<style lang="less" scoped>
.slMain {
  .grid-wrap {
    margin-top: 30px;
    width: 100%;
    border-radius: 3px;
    height: auto;
    overflow: hidden;
    border-left: 1px solid #e5e6eb;
    li {
      width: 33.3%;
      height: 48px;
      float: left;
      border-bottom: 1px solid #e5e6eb;
      border-right: 1px solid #e5e6eb;
      overflow: hidden;
      position: relative;
      span {
        display: inline-block;
        height: 48px;
        line-height: 48px;
        padding: 0 12px;
        color: rgba(0, 0, 0, 0.8);
      }
      & > span:first-child {
        border-right: 1px solid #e5e6eb;
      }
      .label {
        width: 160px;
        background: #f3f5f6;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #77889d;
        position: absolute;
        left: 0;
        top: 0;
      }
      span:last-child {
        width: 100%;
        padding-left: 172px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    li:nth-child(1),
    li:nth-child(2),
    li:nth-child(3) {
      border-top: 1px solid #e5e6eb;
    }
    li:nth-child(3) {
      border-radius: 0 3px 0 0;
    }
    li:last-child {
      border-radius: 0 0 3px 0;
    }
    li.special {
      border-radius: 0 3px 3px 0;
    }
    .coalType-Content {
      padding-left: 0px;
      padding-right: 0px;
      max-width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
    }
    .coalTypes-view {
      height: 48px;
      width: 100%;
      padding-left: 172px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
  .edit-icon {
    width: 14px;
    height: 14px;
    // display: inline-block;
    margin-left: 16px;
    cursor: pointer;
  }
  .density_edit {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: 100%;
    .density_input {
      width: 30%;
      height: 30px;
      margin-right: 8%;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 4px;
      border: 1px solid rgba(132, 149, 170, 0.3);
      background: #fff;
    }
    .density_actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 2;
    }
    .cancle-action {
      margin-right: 10px;
      padding-left: 12px;
      padding-right: 12px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #c3c3c3;
      background: #fff;
      color: rgba(0, 0, 0, 0.4);
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .save-action {
      padding-left: 12px;
      padding-right: 12px;
      height: 24px;
      border-radius: 4px;
      background: #fff;
      color: @primary-color;
      border: 1px solid @primary-color;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>