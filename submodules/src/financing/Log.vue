<template>
   <div  style="width:100%;margin-top:30px">
      <a-table 
        :columns="viewHandleColumns"  
        rowKey="id"  
        class="new-table"
        :scroll="{x:true}" 
        :dataSource="list" 
        :pagination="false"  
        :locale="{emptyText: '暂无数据'}"
      >
    </a-table>
  </div>
</template>

<script>
const viewHandleColumns = [
  { title: '操作类型', key: 'operateTypeDesc', dataIndex: 'operateTypeDesc', },
  {title: '操作人员', key: 'createName',  dataIndex: 'createName',},
  {title: '所属公司', key: 'companyName',  dataIndex: 'companyName', customRender: t => t || '-'},
  {title: '操作内容', key: 'content',  dataIndex: 'content',},
  {title: '操作时间',key: 'createDate', dataIndex: 'createDate', fixed:'right'},
]
export default {
  props: {
    list: {
      default: () => []
    },
    viewHandleColumns: {
       default: () => viewHandleColumns
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

@import url("~@sub/style/table-cover.less");
</style>
<style scoped>
.fw {
  font-weight: bold;
}
</style>
