<template>
  <div class="new-detail">
    <div class="new-detail-content detail-form">
       <h2>追保函信息</h2>
    </div>
    <a-table
     :rowSelection="rowSelection"
      :columns="columns"
      rowKey="id"
      :dataSource="list"
      :pagination="false"
      :scroll="{ x:true }">
    </a-table>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      default: () => []
    },
    bondLetterKeys: {
      default: () => []
    },
    disabled: {
      default: false,
    }
  },
  data() {
    return {
      columns: [
        {
          title: '追保函编号',
          dataIndex: 'serialNo',
        },
        {
          title: '买方名称',
          dataIndex: 'buyCompanyName',
        },
        {
          title: '追保金额',
          dataIndex: 'amount',
        },
        {
          title: '已追保金额',
          dataIndex: 'bondAmount',
        },
        {
          title: '签发日期',
          dataIndex: 'signDate',
        },
      ],
      selectedRowKeys: []
    }
  },
  watch: {
    bondLetterKeys: {
      handler(val) {
        this.selectedRowKeys = val || []
        this.$emit('send',  this.selectedRowKeys)
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {

  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      const t = this
      return {
        type: 'radio',
        selectedRowKeys: selectedRowKeys,
        onSelect: (record) => {
          console.log('record', record)
          t.selectedRowKeys = [record.id];
          t.$emit('send',  t.selectedRowKeys)
        },
        getCheckboxProps(record) {
          return {
            props: {
              disabled: t.$route.query.type == 'detail' || this.disabled
            }
          }
        }
      };
    }
  },
  components: {

  }
}
</script>

<style scoped>

</style>
