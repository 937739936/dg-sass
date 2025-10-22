<!-- 我的仓储-泰州港-出入场记录 -->
<template>
  <div class="storage-exit-cfd">
    <a-table
      :rowKey="(record, index) => {return index}"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"/>
    <i-pagination
      v-if="pagination.total > 10"
      :pagination="pagination"
      @change="handleTableChange" />
  </div>
</template>
<script>
import iPagination from "@sub/components/iPagination"
import { filterCodeByValueName } from '@sub/utils/globalCode.js'
import {
  API_getWarehouseHarborHncfListHncfOut,
  API_getWarehouseHarborHncfStoreOutExportXls
} from 'api/storage'
export default {
  name: 'StorageExitCFD',
  data(){
    return{
      dataSource: [],
      columns: [
        { title: '出港时间', width: 120, dataIndex: 'outDate', key: 'outDate' },
        {
          title: '作业方式',
          dataIndex: 'operateType',
          key: 'operateType',
          width: 120 ,
          customRender(text){
            return filterCodeByValueName(text+'','harbor_operate_type');
          }
        },
        { title: '船名', dataIndex: 'shipName', key: 'shipName', width: 100 },
        { title: '取出垛位号', dataIndex: 'stackNo', key: 'stackNo', width: 120 },
        { title: '煤种', dataIndex: 'category', key: 'category', width: 100},
        { title: '吨数', dataIndex: 'weightTons', key: 'weightTons', width: 100 },
        { title: '备注', dataIndex: 'remark', key: 'remark', width: 200 }
      ],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10
      },
      params: {}
    }
  },
  components: {iPagination},
  methods: {
    // 切换分页
    handleTableChange (page, size) {
      this.pagination.pageNo = page
      this.pagination.pageSize = size
      this.getList()
    },
    getList(data){
      if (data)this.params = Object.assign({}, data)
      this.params = Object.assign({}, this.params, {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      })
      API_getWarehouseHarborHncfListHncfOut(this.params).then(resp=>{
        if(resp.success){
          let obj = resp.result || {}
          this.dataSource = obj.records || []
          this.pagination.total = obj.total
          this.$emit('update', this.params, this.pagination.total)
        }
      })
    },
    reset(data){
      this.pagination.pageNo = 1
      this.getList(data)
    },
    exportXls (data) {
      return {
        func: API_getWarehouseHarborHncfStoreOutExportXls(data),
        name: '华能曹妃甸港出场详情'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.storage-exit-cfd{

}
</style>