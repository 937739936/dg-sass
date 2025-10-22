<!-- 我的仓储-泰州港-出入场记录 -->
<template>
  <div class="storage-admission-cfd">
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
  API_getWarehouseHarborHncfListHncfIn,
  API_getWarehouseHarborHncfStoreInExportXls
} from 'api/storage'
export default {
  name: 'StorageAdmissionCFD',
  data(){
    return{
      dataSource: [],
      columns: [
        { title: '入港时间', width: 120, dataIndex: 'inDate', key: 'inDate' },
        {
          title: '作业方式',
          dataIndex: 'operateType',
          key: 'operateType',
          width: 120,
          customRender(text){
            return filterCodeByValueName(text+'','harbor_operate_type');
          }
        },
        { title: '车次/船名',  dataIndex: 'shipName',  key: 'shipName',  width: 100 },
        { title: '首车号', dataIndex: 'firstTrainNo', key: 'firstTrainNo', width: 80 },
        { title: '尾车号', dataIndex: 'lastTrainNo', key: 'lastTrainNo', width: 80 },
        { title: '存放垛位号', dataIndex: 'stackNo', key: 'stackNo', width: 120},
        { title: '煤种', dataIndex: 'category', key: 'category', width: 80 },
        { title: '吨数', dataIndex: 'weightTons', key: 'weightTons', width: 80 },
        { title: '备注', dataIndex: 'remark', key: 'remark', width: 150 }
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
      API_getWarehouseHarborHncfListHncfIn(this.params).then(resp=>{
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
        func: API_getWarehouseHarborHncfStoreInExportXls(data),
        name: '华能曹妃甸港入场详情'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.storage-admission-cfd{

}
</style>