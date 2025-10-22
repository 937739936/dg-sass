<template>
  <div class="slMain">
    <Breadcrumb />
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">巡库配置</span>
      </div>
      <!-- 查询区域 -->
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
      ></SlFormNew>

      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
          class="new-table"
          :bordered="false"
          :columns="columns"
          :rowKey="(record) => record.id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template slot="action" slot-scope="action, record">
            <a-space>
              <a-popconfirm
                title="确定删除?"
                okText="确定"
                cancelText="取消"
                @confirm="() => edit(record)">
                <a class="btn-item" href="javascript:;">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  getSupervisorList,
  supervisorDelete
} from "../../api";
import iPagination from "@sub/components/iPagination";
import Breadcrumb from "@/v2/components/breadcrumb/index";

import { ListMixin } from "@/v2/components/mixin/ListMixin";
const columns = [
  {
    title: "姓名",
    key: "name",
    dataIndex: "name",
    width: "20%",
  },
  {
    title: "联系方式",
    key: "phone",
    dataIndex: "phone",
    width: "20%",
  },
  {
    title: "身份证号",
    key: "idCard",
    dataIndex: "idCard",
    width: "20%",
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
    width: "20%",
  },
];
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "姓名",
    type: "input",
    placeholder: "请输入姓名",
  },
  {
    decorator: ["phone"],
    addonBeforeTitle: "联系方式",
    type: "input",
    placeholder: "请输入联系方式",
  },
];
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
    Breadcrumb
  },
  data() {
    let {houseId} = this.$route.query;
    return {
      houseId,
      columns,
      tableLoading: false,
      dataSource: [],
      searchList,
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10,
      },
      searchForm: this.$form.createForm(this),
      // url: {
      //   list: getSupervisorList,
      // },

    };
  },
  mounted() {
    this.getSupervisorList();
  },
  methods: {
    handleChange(data) {
      this.searchParams = data;
      this.changeSearch(this.searchParams);
    },
    getSupervisorList(pageNo = this.pagination.pageNo,pageSize = this.pagination.pageSize) {
      this.tableLoading = true;
      getSupervisorList({pageNo,pageSize,warehouseId:this.houseId}).then((result) => {
        this.tableLoading = false;
        if (!result.success) {
          return;
        }
        this.dataSource = result.data.records;
      });
    },
    edit(data) {
      if (data) {
        supervisorDelete({id:data.id}).then((result) => {
          if (!result.success) {
            return;
          }
          this.$message.success("删除成功");
          this.getSupervisorList();

        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
</style>