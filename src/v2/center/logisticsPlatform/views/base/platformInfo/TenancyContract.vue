<template>
  <div>
    <a-table
      class="new-table"
      :bordered="false"
      :columns="columns"
      :rowKey="(record) => record.id"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: true }"
    >
      <template slot="businessMemberName" slot-scope="text,record">
        <a-tooltip 
          v-if="text && text.length > 30" 
          :getPopupContainer="triggerNode => triggerNode.parentNode || document.body "
        >
          <template #title>{{text}}</template>
          {{text.slice(0,30)}}...
        </a-tooltip>
        <template v-else>
          {{text}}
        </template>
      </template>
      <template slot="action" slot-scope="action, record">
        <a-space>
          <a @click.prevent="viewAttachment(record)">查看附件</a>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              更多 
              <Arrow />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;" @click="doDownload(record.id)">下载</a>
                </a-menu-item>
                <a-menu-item v-auth="'logisticsStorageCenter:systemManager:stationInfoManager:editLeaseContract'">
                  <a 
                    href="javascript:;" 
                    @click="edit(record.id)" 
                  >编辑</a>
                </a-menu-item>
                <a-menu-item 
                v-if="record.status != 'CANCELLATION'"
                  v-auth="'logisticsStorageCenter:systemManager:stationInfoManager:cancellationLeaseContract'"
                >
                  <a 
                    href="javascript:;" 
                    @click="cancelId=record.id"
                  >作废</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="viewLog(record.id)">操作记录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </template> 
    </a-table>
    <i-pagination :pagination="pagination" @change="getList" />
    <a-modal 
      :visible="!!cancelId" 
      title="作废" 
      class="slModal cancelModal"
      width="490px"
      destroyOnClose
      @ok="saveCancel"
      @cancel="onCancel"
      :confirmLoading="cancelLoading"
      :forceRender="true"
    >
      <div class="tips-text">请输入作废原因</div>
      <a-form :form="form">
        <a-form-item >
          <a-textarea  
            placeholder="请输入作废原因" 
            :rows="6"  
            class="a-textarea" 
            v-decorator="[
              'cancellationCause',
              { rules: [{
                validator:function(rule, value, callback){
                  if(!value){
                    callback('请输入作废原因')
                    return
                  }
                  if(/[\s]/.test(value)){
                    callback('不允许输入空格')
                    return
                  }
                  if(value.length > 200){
                    callback('最多200个字符')
                    return
                  }
                  callback()
                }
              }]},
            ]"
          />
        </a-form-item>
      </a-form>
      
    </a-modal>
   <RecordModal ref="record" />
   <image-viewer ref="imageViewer" />
  </div>
</template>
<script>
import ImageViewer from "@sub/components/viewer/image" 
import {Arrow} from "v2/components/svg";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
import RecordModal from "./RecordModal";
import {getContractPage,cancellation,getAttachmentById} from "../../../api/contract";
import download from "v2/utils/download"
import ENV from "@/v2/config/env";

const columns = [
  {
    title: "合同编号",
    key: "bizContractNo",
    dataIndex: "bizContractNo",
  },
  {
    title: "站台名称",
    key: "stationName",
    dataIndex: "stationName",
  },
  {
    title: "合同状态",
    key: "statusDesc",
    dataIndex: "statusDesc",
  },
  {
    title: "签订日期",
    key: "signDate",
    dataIndex: "signDate",
  },
  {
    title: "生效日期",
    key: "effectiveDate",
    dataIndex: "effectiveDate",
  },
  {
    title: "业务实际负责人",
    key: "businessMemberName",
    dataIndex: "businessMemberName",
    scopedSlots: { customRender: "businessMemberName" },
  },
  {
    title: "签章状态",
    key: "signStatusDesc",
    dataIndex: "signStatusDesc",
  },
  {
    title: "仓储方名称",
    key: "warehouseOwnerCompanyName",
    dataIndex: "warehouseOwnerCompanyName",
  },
  {
    title: "承租方名称",
    key: "warehouseTenantCompanyName",
    dataIndex: "warehouseTenantCompanyName",
  },
  {
    title: "付费方名称",
    key: "payerCompanyName",
    dataIndex: "payerCompanyName",
    customRender:(text) => {
      return text || "-"
    }
  },
  {
    title: "操作",
    key: "action",
    fixed:"right",
    width:150,
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
]
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
    Arrow,
    RecordModal,
    ImageViewer
  },
  data(){
    return {
      form: this.$form.createForm(this),
      columns,
      dataSource:[],
      pagination: {
        type: "",
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      loading:false,
      cancelLoading:false,
      cancelId:"",
      
      url: {
        list: getContractPage
      },
    }
  },
  mounted(){
  },
  methods:{
    //下载合同
    doDownload(id){
      const url = `${ENV.BASE_STATION_API}/api/station/lease/contract/downloadAttachmentById`
      download(url,{id},"GET")
    },
    saveCancel(){
      this.form.validateFields((error,values) => {
        if(error){
          return
        }
        this.cancelLoading = true
        cancellation({id:this.cancelId,...values}).then(({success}) => {
          if(!success){
            return;
          }
          this.$message.success("操作成功");
          this.getList();
          this.onCancel();
        }).finally(() => {
          this.cancelLoading = false
        })
      })
     
    },
    onCancel(){
      this.cancelId = "";
      this.form.resetFields()
    },
    viewAttachment(data){
      const id = data.id
      getAttachmentById(id).then(({success,data}) => {
        if(!success){
          return
        }
        if(data.isPdf){
          this.$router.push({
            path:"/center/logisticsPlatform/platformInfo/previewContract",
            query:{
              id,
              url:data.pdfFileInfo.path,
            }
          })
          return
        }
        const urls = data.imgFileInfoList.map(item => item.url);
        this.$refs.imageViewer.show(urls)
      })
    },
    viewLog(id){
      this.$refs.record.show(id)
    },
    edit(id){
      this.$router.push({
        path:"/center/logisticsPlatform/platformInfo/tenancyContractEdit",
        query:{id}
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .new-table{
    ::v-deep{
      .ant-table-fixed-right{
        .ant-table-body-inner{
          .ant-table-fixed{
            border-right:1px solid #EEF0F2;
            .ant-table-tbody{
              tr:last-child{
                td{
                  border: 0;
                }
              }
            }
          }
        }
      }
    }
  }

  .cancelModal{
    ::v-deep{
      .ant-modal-header{
        padding:20px;
        padding-bottom:14px;
        background-color:#fff;
        .ant-modal-title{
          font-size:20px;
        }
      }
      .ant-modal-body{
        padding-top:0px;
      }
      .ant-modal-footer{
        border-top:0;
      }
    }
    .tips-text{
      font-size:14px;
      color:rgba(#000,0.25);
      line-height:20px;
      margin-bottom: 8px;
      &::before{
        padding-right:5px;
        content: "*";
        color: #f5222d;
      }
    }
    .a-textarea{
      padding:14px;
      // border: 0;
      font-size:14px;
      background-color:rgba(#8191A9,0.1);
      &::input-placeholder {
        font-size: inherit;
        color: #8191A9;
        word-break: break-all;
      }
      &::-webkit-input-placeholder {
        font-size: inherit;
        color: #8191A9;
        word-break: break-all;
      }
    }
  }
</style>