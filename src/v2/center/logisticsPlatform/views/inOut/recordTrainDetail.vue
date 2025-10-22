<template>
  <div class="slMain">
    <Breadcrumb :type="type"/>
    <a-spin :spinning="loading">
      <a-card :bordered="false">
        <div class="methods-wrap">
          <span class="slTitle">{{typeText}}</span>
        </div>
        <div class="slTitleAssis">基本信息</div>
        <a-form :form="form">
          <a-descriptions bordered>
            <a-descriptions-item label="运输方式">{{data.transportModeText}}</a-descriptions-item>
            <a-descriptions-item :label="typestr+'库日期'">{{data.storageDate}}</a-descriptions-item>
            <template v-if="type=='IN'">
              <a-descriptions-item :label="typestr+'库重量(吨)'">{{data.weight}}</a-descriptions-item>
            </template>
            <template v-else-if="type=='OUT'">
              <a-descriptions-item label="车次号">{{data.trainSerialNo}}</a-descriptions-item>
              <a-descriptions-item label="启票重量(吨)">{{data.invoicingWeight}}</a-descriptions-item>
              <a-descriptions-item :label="typestr+'库重量(吨)'">{{data.weight}}</a-descriptions-item>
              <a-descriptions-item label="实收重量(吨)">
                <template v-if="view == 'edit'">
                  <a-form-item>
                    <a-input
                      placeholder="请输入实收重量"
                      v-decorator="[
                        'actualWeight',
                        { rules: valdater['actualWeight'] },
                      ]"
                      @blur="differenceWeightCalculate"
                    />
                  </a-form-item>
                </template>
                <template v-else>
                  {{data.actualWeight}}
                </template>
              </a-descriptions-item>
            </template>
            <a-descriptions-item label="煤种">{{data.coalType}}</a-descriptions-item>
            <a-descriptions-item label="发站">{{data.sendStation}}</a-descriptions-item>
            <a-descriptions-item label="到站">{{data.arriveStation}}</a-descriptions-item>
            <a-descriptions-item label="车数">{{data.trainNumber}}</a-descriptions-item>
            <a-descriptions-item label="托运人">{{data.shipper}}</a-descriptions-item>
            <a-descriptions-item label="运单号">{{data.waybillNo}}</a-descriptions-item>
            <template v-if="type=='OUT'">
              <a-descriptions-item label="站台盈亏(吨)">{{differenceWeightString}}</a-descriptions-item>
              <a-descriptions-item label="装车热值(千卡/公斤)">
                <template v-if="view == 'edit'">
                  <a-form-item>
                    <a-input
                      placeholder="请输入装车热值"
                      v-decorator="[
                        'loadingCv',
                        { rules: valdater['loadingCv'] },
                      ]"
                    />
                  </a-form-item>
                </template>
                <template v-else>
                  {{data.loadingCv}}
                </template>
              </a-descriptions-item>
            </template>
          </a-descriptions>
        </a-form>
        <div class="slTitleAssis">{{typestr}}明细</div>
        <div class="table-box">
          <a-table
            class="new-table"
            :bordered="false"
            :columns="columns"
            :rowKey="uid"
            :dataSource="data.items"
            :pagination="false"
            :scroll="{ x: true }"
          >
          ></a-table>
        </div>
        <div class="slTitleAssis">附件信息</div>
        <a-tabs class="mb40" :activeKey="attachmentKey" @change="(key) => attachmentKey=key">
          <a-tab-pane key="attachmentsList" tab="铁路大票" force-render>
            <div style="width:100%;margin-top: 20px;">
              <CustomUpload
                :ifEditable="view == 'edit'"
                @uploadFiles="getUploadFiles('attachmentsList')" 
                :fileDataSource="attachmentsList" 
                :type="'custom'"
                :defaultColumns="uploadColumns"
                :selectOptions="getSelectOption('attachment')"
                @onOk="onSave"
                @deleteFiles="deleteFiles"
              ></CustomUpload>
            </div>
          </a-tab-pane>
          <a-tab-pane key="trackScaleReportList" tab="轨道衡报告" force-render>
            <div style="width:100%;margin-top: 20px;">
              <CustomUpload
                :ifEditable="view == 'edit'"
                @uploadFiles="getUploadFiles('trackScaleReportList')" 
                :fileDataSource="trackScaleReportList" 
                :type="'custom'"
                :defaultColumns="uploadColumns"
                :selectOptions="getSelectOption()"
                @onOk="onSave"
                @deleteFiles="deleteFiles"
              ></CustomUpload>
            </div>
          </a-tab-pane>
        </a-tabs>
        <div class="slDetailBottom">
          <a-space>
            <a-button @click="() => $router.back()">返回</a-button>
            <a-button  type="primary" :loading="saveLoading" @click="outEdit" v-if="type=='OUT'&&view == 'edit'">确认</a-button>
          </a-space>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import {getTrainRecordDetail,getTrainRecordEdit,editRecords,deleteRecordAttachment} from "../../api";
import CustomUpload from "components/upload/CustomUpload";
import { validNumber } from "@/v2/utils/validForm";
import num from '@/untils/num.js'
import Breadcrumb from "@/v2/components/breadcrumb/index";
export default {
  components:{
    CustomUpload,
    Breadcrumb
  },
  data(){
    let {id,view,type} = this.$route.query;
    let typestr = type === 'IN'?'入库':'出库'
    return {
      id,
      view,
      type,
      typestr: typestr,
      typeText: view === 'edit' ? ('编辑'+ typestr + '记录'): (typestr+'详情'),
      columns:renderColumns(type),
      uploadColumns,
      attachmentKey:"attachmentsList",
      attachmentsList:[],//铁路大票附件
      trackScaleReportList:[],//轨道衡报告
      data:{},
      loading:false,
      saveLoading:false,
      differenceWeight:NaN,//站台盈亏
      form: this.$form.createForm(this),
      valdater: {
        actualWeight: [
          { required: false, message: "请输入实收重量" },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
        loadingCv: [
          { required: false, message: "请输入装车热值" },
          { validator: validNumber({ float: 4, min: 0, max: 999999.9999 }) },
        ],
      },
    }
  },
  computed: {
    differenceWeightString() {
      let differenceWeight = this.differenceWeight;
      if (differenceWeight > 0) {
        return "盈" + differenceWeight;
      } else if (differenceWeight < 0) {
        return "亏" + Math.abs(differenceWeight);
      } else if (differenceWeight == 0)  {
        return "0"
      }else{
        return "";
      }
    },
  },
  mounted(){
    this.doFetch();
  },
  methods:{
    getUploadFiles(key){
      return (source) => {
        this[key] = source
      }
    },
    doFetch(){
      this.loading = true;
      getTrainRecordDetail({id:this.id}).then((res) => {
        if(!res.success){
          return
        }
        this.data = res.data||{};
        (this.data.attachments||[]).forEach((item) => {
          let it = {
            id:item.id,
            type:item.fileType,
            typeName:item.fileTypeText,
            name:item.name,
            url:item.path
          }
          if(item.fileType == "TRACK_SCALE_REPORT"){
            this.trackScaleReportList.push(it);
          }else{
            this.attachmentsList.push(it)
          }
        });
        delete this.data.attachments;
        //站台盈亏
        this.differenceWeight = this.data.differenceWeight
        //出库记录修改，渲染表单值
        if(this.type=='OUT'&&this.view == 'edit'){
          this.$nextTick(()=>{
            this.form.setFieldsValue({
              actualWeight:this.data.actualWeight,
              loadingCv:this.data.loadingCv,
            })
          })
        }
      }).finally(() => {
        this.loading = false;
      })
      
    },
    async onSave(last){
      if(!last ){
        return
      }
      let data = {recordId:this.id,attachments:[{
        attachmentType:last.type,
        name:last.name,
        md5Hex:last.md5Hex,
        path:last.url
      }]};
      editRecords(data).then((res) => {
        if(!res.success){
          
          return
        }
        let last = this[this.attachmentKey].slice(-1)[0];
        last.id = res.data[0]
        this[this.attachmentKey].splice(-1,1,last);
      })
    },
    deleteFiles(data){
      deleteRecordAttachment({fileId:data.id}).then((res) => {
        if(!res.success){
          this[this.attachmentKey] = [...this[this.attachmentKey]]
          return
        }
        this.$message.success("操作成功")
      },(res) => {
        if(!res.data.success){
          this[this.attachmentKey] = [...this[this.attachmentKey]]
        }
      })
    },
    getSelectOption(type){
      if(type == "attachment"){
        return [
          {value:"RAILWAY_TICKET",text:"铁路大票"},
          {value:"TRAIN_NO_TABLE",text:"车号表"},
        ]
      }
      return [
        {value:"TRACK_SCALE_REPORT",text:"轨道衡报告"},
      ]
    },
    uid(){
      return Math.random().toString(36).slice(2);
    },
    asyncFn(fn){
      return new Promise((reslove) => {
        fn(reslove)
      })
    },
    //站台盈亏计算
    differenceWeightCalculate() {
      let actualWeight = this.form.getFieldValue("actualWeight")||0,
        invoicingWeight = this.data.invoicingWeight||0;
      if (!actualWeight) {
        this.differenceWeight = NaN;
        return;
      }
      this.differenceWeight = num.accSub(actualWeight,invoicingWeight);
    },
    async outEdit(){
      let { error, values } = await this.asyncFn((reslove) => {
        this.form.validateFieldsAndScroll((error, values) => {
          reslove({ error, values });
        });
      });
      if (error) {
        return;
      }
      values.id=this.id;
      values.differenceWeight=this.differenceWeight;
      this.saveLoading=true
      getTrainRecordEdit(values).then((res) => {
          if (!res.success) {
            return;
          }
          this.$message.success("修改成功");
          this.$router.back();
        })
        .finally(() => {
          this.saveLoading=false
        });
    }
    // handlePreview(url){
    //   // this.previewImg = window._CONFIG['domianURL'] + "/" + url
    //   this.previewImg = url
    //   this.$refs.viewer.$viewer.show();
    // }
  }
}
function renderColumns(type){
  let typestr = type == "IN" ? "入":"出";
  return [
    {title: "仓房",key: "houseName",dataIndex: "houseName",},
    {title: "货位",key: "goodsAllocation",dataIndex: "goodsAllocation",},
    {title: typestr+"库重量(吨)",key: "weight",dataIndex: "weight",},
  ]
}

const uploadColumns = [
  {title:"单据类型",key:"typeName",dataIndex:"typeName"},
  {title:"文件名",key:"name",dataIndex:"name"},
  {
    title: '操作',
    dataIndex: 'operation',
    align: "center",
    scopedSlots: { customRender: 'operation' },
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slDetailBottom {
  width: calc(100vw - 254px);
  min-width: 1186px;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 228px;
  z-index: 999;
}
.mb40 {
  margin-bottom: 40px;
}
</style>
