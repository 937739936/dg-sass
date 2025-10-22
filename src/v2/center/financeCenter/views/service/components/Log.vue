<template>
   <div class="mt20">
      <a-table 
        :columns="viewHandleColumns"  
        rowKey="createTime"  
        :scroll="{x:true}" 
        :dataSource="logList" 
        :pagination="false"  
        class="detailsTable"
      >
    </a-table>
  </div>
</template>

<script>
const viewHandleColumns = [
  { title: '操作', key: 'operation', dataIndex: 'operation', },
  {title: '操作人', key: 'createName',  dataIndex: 'createName',},
  {title: '操作内容', key: 'content',  dataIndex: 'content',},
  {title: '操作时间',key: 'createTime', dataIndex: 'createTime',},
  {title: '备注',key: 'remark', dataIndex: 'remark', customRender:(v) => v ||'-'},

]
export default {
  props: {
    logList: {
      default: () => []
    }
  },
  data() {
    return {
      viewHandleColumns,
    }
  },

  methods: {

  },
  components: {

  }
}
</script>

<style scoped>
.fw {
  font-weight: bold;
}
</style>
