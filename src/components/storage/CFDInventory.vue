<!-- 曹妃甸-存货量 -->
<template>
  <div class="storage-inventory-cfd">
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
import {API_getWarehouseHarborInventoryListHncf} from 'api/storage'
import iPagination from "@sub/components/iPagination"

export default {
  name: 'StorageInventoryCFD',
  data () {
    return {
      dataSource: [],
      columns: [
        { title: '公司名称', dataIndex: 'companyName', key: 'companyName' },
        { title: '垛位号', width: 200, dataIndex: 'stackNo', key: 'stackNo' },
        { title: '煤种', dataIndex: 'category', key: 'category', width: 150},
        { title: '吨数', dataIndex: 'remainTons', key: 'remainTons', width: 200 }
      ],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getList()
  },
  components: {iPagination},
  methods: {
    getList(){
      API_getWarehouseHarborInventoryListHncf({
        harborType: 2 // 曹妃甸-1
      }, 2).then(resp => {
        if (resp.success){
          let obj = resp.result || {}
          this.dataSource = obj.records || []
          this.pagination.total = obj.total || 0
        }
      })
    },
    // 切换分页
    handleTableChange (page, size) {
      this.pagination.pageNo = page
      this.pagination.pageSize = size
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
.storage-inventory-cfd{
}
</style>