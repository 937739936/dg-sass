<template>
	<!-- 收发货车辆信息-->
	<div class="receive-car-info-wb">
    <div class="title">
      <i class="title_icon"></i>{{title}}
      <a-button
        type="primary"
        v-if="dataSource.length > 0 && !isNew"
        @click="handleExport">导出</a-button>
    </div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :rowKey="(record, index) => index"
      :locale="{emptyText: '暂无数据'}">
      <template
        slot="operation"
        slot-scope="text, record">
        <a-button class="preview-btn" @click="handleViewTrack(record)">查看轨迹</a-button>
        <a-button class="preview-btn" @click="handleViewReceipt(record)">查看单据</a-button>
      </template>
    </a-table>
    <ProofModel ref="proofModel" type="proof" :list="proofList"/>
  </div>
</template>

<script>
  import {
    API_getDeliverLogisticsTruckInfoExportXls
  } from 'api'
  import ProofModel from 'components/receive/ProofModel'
  import comDownload from '@sub/utils/comDownload.js';
  // import {filterCodeByKey} from '@sub/utils/globalCode.js'

  export default {
		name : "ReceiveCarInfoWB",
		props:{
		  // 新建不显示导出按钮
			isNew:{
				type: Boolean,
        default: false
			},
			data:{
				type: Array,
				default: () => {
					return []
				}
			},
      title: {
			  type: String,
        default: '车辆信息'
      },
      deliveryBatchId: {
			  type: String,
        default: ''
      },
      detail: {
			  type:Object,
        default: () => {
          return {}
        }
      }
		},
    data() {
      return {
        dataSource: [],
        columns:[
          {
            title: '运单号',
            dataIndex:'transTicketNo',
          },
          {
            title: '车牌号',
            dataIndex:'plateNumber',
          },
          {
            title: '发货量(吨)',
            dataIndex:'deliverQuantity',
          },
          {
            title: '装货日期',
            dataIndex:'deliveryTime',
          },
          {
            title: '卸货日期',
            dataIndex:'finishTime',
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' },
            dataIndex:'operation',
            width: 220,
            align: 'center'
          }
        ],
        // deliveryAttachTypeMap: {},
        // deliveryAttachTypeList:filterCodeByKey('deliver_attach_type'),
        currentRow: {},
        proofList: [] // 单据列表
      }
    },
    components: {ProofModel},
    mounted(){
      this.dataSource = this.data
    },
    methods:{
		  // 查看轨迹
      handleViewTrack(record) {
        window.open('/logistics/LogisticsDetailCar?record=' + encodeURI(JSON.stringify({
          id: record.deliverBatchId,
          receiveAddr: this.detail.receiveAddr,
          deliverAddr: this.detail.deliverAddr,
          deliverQuantity: record.deliverQuantity,
          deliveryTime: record.deliveryTime,
          plateNumber: record.plateNumber,
          transTicketNo: record.transTicketNo,
          finishTime: record.finishTime,
          publishNum: this.detail.publishNum,
          platformType: this.detail.platformType
        })))
      },
      // 查看单据
      handleViewReceipt(record) {
        this.currentRow = record
        this.proofList = []
        let obj = record
        if (obj.loadingUrl) {
          this.proofList.push({
            type: 1,
            list: (obj.loadingUrl && obj.loadingUrl.split(',')) || []
          })
        }
        if (obj.receiveUrl){
          this.proofList.push({
            type: 2,
            list: (obj.receiveUrl && obj.receiveUrl.split(',')) || []
          })
        }
        this.$refs.proofModel.init(this.proofList)
      },
      // 导出
      handleExport () {
        API_getDeliverLogisticsTruckInfoExportXls({
          deliveryBatchId: this.deliveryBatchId,
          publishNum: this.detail.publishNum,
          ownerName: this.detail.ownerName
        }).then(res => {
          comDownload(res, undefined, '无车承运平台发货记录车号明细表.xls')
        })
      }
    },
		watch:{
			data: {
			  handler() {
          this.dataSource = this.data;
        },
        deep: true
      }
		}
	}
</script>

<style lang="less" scoped>
.receive-car-info-wb{
  .preview-btn{
    &+.preview-btn{
      margin-left: 10px;
    }
  }
  ::v-deep.ant-table-header-column{
    white-space: nowrap;
  }
}

</style>
