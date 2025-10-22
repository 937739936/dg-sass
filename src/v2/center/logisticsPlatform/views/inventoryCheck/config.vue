<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">盘库管理</span>
      </div>
      <SlFormNew
        ref="searchForm"
        :list="searchList"
        layout="inline"
        @change="handleFilterChange"
      ></SlFormNew>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
          class="new-table"
          :bordered="false"
          :columns="columns"
          :rowKey="(record) => record.id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="false"
          :scroll="{ x: true }"
        >
          <div slot="autoInventoryEnable" slot-scope="checked, record">
            <a-switch :checked="checked" @click="showInventoryModal(record)" />
          </div>
          <div slot="action" slot-scope="text, record">
            <a-space>
              <a @click.prevent="editDetail(record)" style="padding-right: 10px"
                >编辑</a
              >
            </a-space>
          </div>
        </a-table>
        <i-pagination
          :pagination="pagination"
          size="small"
          :pageSizeOptions="['10', '50', '100', '150', '200']"
          :defaultPageSize="10"
          @change="getList"
        />
      </div>
    </a-card>
    <InventoryConfigEditModal
      ref="inventoryConfigEditModal"
      @changeConfigSuccess="changeConfigSuccess"
    />
    <modalInfo
      ref="modalInfo"
      @verify="modifyAutoSwitch"
      title="启用状态"
      :tip="modalInfoMessage"
    />
  </div>
</template>

<script>
import { getHouseListNew } from "../../api/selectData";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
import InventoryConfigEditModal from "./components/InventoryConfigEditModal.vue";
import modalInfo from "@/v2/components/modalInfo/info";
import { getInventoryConfigList, modifyInventoryAutoEnable } from "../../api";
import { isEqual } from "lodash";
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
    InventoryConfigEditModal,
    modalInfo,
  },
  data() {
    return {
      searchList: DefaultSearchList,
      columns: Columns,
      url: {
        list: getInventoryConfigList,
      },
      modifyRecord: {}, // 正在修改开关的
      modalInfoMessage: "信息内容",
      houseList: [], // 仓房列表{value,lable,goodsAllocations}
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    handleFilterChange(data) {
      // 处理筛选条件变化
      let searchParams = { ...data };
      if (isEqual(searchParams, this.searchParams)) {
        return;
      }
      if (searchParams.houseId != this.searchParams.houseId) {
        this.configGoodsAllocationList(searchParams.houseId);
        if (searchParams.goodsAllocationId) {
          // 这里会重新执行handleFilterChange
          this.$refs.searchForm.deleteSearchItemByKey("goodsAllocationId");
          return;
        }
      }
      this.searchParams = searchParams;
      this.changeSearch(searchParams);
    },
    // 初始化数据
    initData() {
      this.requestHouseList();
    },
    // 获取仓房列表
    requestHouseList() {
      getHouseListNew().then((res) => {
        if (!res.success) {
          return;
        }
        let houseList = res.data ?? [];
        houseList = houseList.map((item) => {
          let itemGoodsAllocations = item.goodsAllocations ?? [];
          const goodsAllocations = itemGoodsAllocations.map((good) => {
            return { value: good.id, label: good.name };
          });
          return {
            value: item.id,
            label: item.name,
            goodsAllocations: goodsAllocations,
          };
        });
        this.houseList = houseList;
        this.searchList.forEach((item) => {
          if (item.decorator[0] === "houseId") {
            item.options = houseList;
          }
        });
      });
    },
    // 获取货位名称列表
    configGoodsAllocationList(houseId) {
      let goodsAllocations = [];
      if (houseId) {
        // 当前选中的仓房对象
        const selectHouseItem = this.houseList.find(
          (houseItem) => houseItem.value == houseId
        );
        goodsAllocations = selectHouseItem?.goodsAllocations ?? [];
      }
      this.searchList.forEach((item) => {
        if (item.decorator[0] === "goodsAllocationId") {
          item.options = goodsAllocations;
        }
      });
    },
    editDetail(record) {
      //
      console.log("编辑详情", record);
      this.$refs.inventoryConfigEditModal.show(record);
    },
    showInventoryModal(record) {
      this.modifyRecord = record;
      let autoInventoryEnable = record.autoInventoryEnable;
      this.modalInfoMessage = autoInventoryEnable
        ? "将关闭定时盘库，是否继续操作？"
        : "将启动定时盘库，是否继续操作？";
      this.$refs.modalInfo.open();
    },
    // 修改开关
    async modifyAutoSwitch() {
      this.spinning = true;
      let record = this.modifyRecord;
      modifyInventoryAutoEnable({
        configId: record.id,
        autoInventoryEnable: !record.autoInventoryEnable,
      })
        .then((res) => {
          if (!res.success) {
            return;
          }
        })
        .catch(() => {})
        .finally(() => {
          this.spinning = false;
          this.$refs.modalInfo.close();
          this.getList();
        });
    },
    // 修改条目配置详情成功
    changeConfigSuccess() {
      this.getList();
    },
  },
};

// 默认搜索表单数据
const DefaultSearchList = [
  {
    decorator: ["houseId"],
    addonBeforeTitle: "仓房名称",
    type: "select",
    placeholder: "请选择仓房名称",
    options: [],
  },
  {
    decorator: ["goodsAllocationId"],
    addonBeforeTitle: "货位名称",
    type: "select",
    placeholder: "请选择货位名称",
    options: [],
  },
];

const customRender = (text) => {
  if (text == 0) {
    return "0";
  }
  return text ?? "-";
};
const Columns = [
  { title: "仓房名称", dataIndex: "houseName", key: "houseName", customRender },
  {
    title: "货位名称",
    dataIndex: "goodsAllocationName",
    key: "goodsAllocationName",
    customRender,
  },
  {
    title: "所属货主",
    dataIndex: "goodsOwnerCompanyName",
    key: "goodsOwnerCompanyName",
    customRender,
  },
  {
    title: "设定盘库时间",
    dataIndex: "inventoryTime",
    key: "inventoryTime",
    customRender,
  },

  {
    title: "盘库间隔（天）",
    dataIndex: "inventoryInterval",
    key: "inventoryInterval",
    customRender,
  },
  {
    title: "上次定时盘库时间",
    dataIndex: "lastInventoryTime",
    key: "lastInventoryTime",
    customRender,
  },
  {
    title: "定时盘库启用状态",
    dataIndex: "autoInventoryEnable",
    key: "autoInventoryEnable",
    scopedSlots: { customRender: "autoInventoryEnable" },
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
    fixed: "right",
  },
];
</script>



<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
  ::v-deep.ant-switch {
    background-color: #c5c8ce;
    height: 20px;
    width: 34px;
    min-width: 34px;
    margin: 4px 0 4px;
    box-sizing: border-box;
    .ant-switch-inner {
      position: relative;
      top: -1px;
      margin-left: 20px;
      font-size: 14px;
      zoom: 0.85;
      line-height: 20px;
    }
  }
  ::v-deep.ant-switch-checked {
    background-color: @primary-color;
    .ant-switch-inner {
      margin-right: 20px;
      margin-left: 8px;
    }
  }
  ::v-deep.ant-switch-loading-icon,
  .ant-switch::after {
    width: 14px;
    height: 14px;
    top: 2px;
  }
}
</style>