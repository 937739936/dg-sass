<template>
  <div class="log">
    <a-table
      :columns="columns"
      class="new-table"
      :bordered="false"
      rowKey="id"
      :dataSource="list"
      :pagination="false"
      :scroll="{x:true}"
    >
    </a-table>
  </div>
</template>

<script>
const columns = [
  { title: "操作类型", dataIndex: "operate" },
  { title: "操作人", dataIndex: "operator" },
  { title: "所属公司", dataIndex: "companyName" },
  { title: "操作内容", dataIndex: "remark" },
  { title: "操作时间", dataIndex: "operateTime", fixed: 'right'},
];
export default {
  props: {
    list: {
      default: ()=> {return []}
    },
    columns: {
      default: () => {return columns }
    }
  },
  data() {
    return {
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="less" scoped>
@import url("../style/table.less");
</style>
<style scoped lang='less'>
.log {
  width: 100%;
  margin-top: 30px;
}
</style>
