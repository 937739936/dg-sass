<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false" :loading="loading">
      <div class="methods-wrap">
        <span class="slTitle">{{id?"编辑":"新增"}}线下租赁合同</span>
      </div>
      <div class="slTitleAssis">
        合同信息
      </div>
      <a-form :form="form" :colon="false" class="slFormDetail">
        <a-row :gutter="200">
          <a-col :span="8">
            <a-form-item label="合同编号" required>
              <a-input 
                placeholder="请输入合同编号" 
                v-decorator="[
                  'bizContractNo',
                  { rules: validator['bizContractNo'] },
                ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="签订日期" required>
              <sl-date-picker
                style="width: 100%"
                placeholder="请选择签订日期"
                v-decorator="[
                  'signDate',
                  { rules: [{required:true,message:'请选择签订日期'}] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生效时间" required>
              <sl-range-picker
                style="width:100%"
                :value-format="'YYYY-MM-DD'"
                v-decorator="[
                  'effective',
                  { rules: [{required:true,message:'请选择生效时间'}] },
                ]"
              >
             
              </sl-range-picker>
              
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="200">
          <a-col :span="8">
            <a-form-item label="业务实际负责人" required>
              <a-select 
                placeholder="请选择业务实际负责人" 
                :filterOption="filterOptionBusiness" 
                showSearch
                :getPopupContainer="triggerNode => triggerNode.parentNode" 
                v-decorator="[
                  'businessOwnershipTeamConfigId',
                  { rules: [{required:true,message:'请选择业务实际负责人'}] },
                ]"
                @change="onChangeBusiness"
              >
                <a-select-option v-for="item in businessList" :key="item.id" :value="item.id" :item="item">
                  {{item.businessUnitName}}-{{item.memberName}}-{{item.notHiddenMemberMobile}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="slTitleAssis" style="margin-bottom:30px">签章状态</div>
        <a-row :gutter="200">
          <a-col :span="8">
            <a-form-item label="签章状态" required>
              <a-radio-group 
                name="签章状态" 
                v-decorator="['signStatus',{ rules: {required:true,message:'请选择签章方'}},]"
                @change="onSignStatus"
              >
                <a-radio value="TWO">两方签署</a-radio>
                <a-radio value="THREE">三方签署</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="200">
          <a-col :span="8">
            <a-form-item label="仓储方名称" required>
              <a-input 
                placeholder="请输入仓储方名称" 
                v-decorator="['warehouseOwnerCompanyName']"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="承租方名称" required>
              <a-input 
                placeholder="请输入承租方名称" 
                v-decorator="['warehouseTenantCompanyName']"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="submitExtraData.signStatus == 'THREE'">
            <a-form-item label="付费方名称" required>
              <a-input 
                placeholder="请输入付费方名称" 
                @blur="onCheckCompany" 
                v-decorator="[
                  'payerCompanyName',
                  { rules: submitExtraData.signStatus == 'THREE'?validator.payerCompanyName:[]},
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="slTitleAssis">附件信息</div>
      <div class="a-alert">
        【线下合同】必须上传，只能上传一份PDF文件，或者图片（可多张），单个附件大小不得超过100M。合同需单签或双签，未签章的合同请不要上传，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。
      </div>
      <a-table
        class="new-table"
        :bordered="true"
        :columns="columns"
        :rowKey="(record) => record.type"
        :dataSource="attachmentList"
        :pagination="false"
        :scroll="{ x: true }"
      >
        <template slot="type" slot-scope="action, record">
          <div class="type-label">
            <span class="required">线下合同</span>
            <a-upload
              :headers="headers"
              :beforeUpload="beforeUpload"
              :accept='accept'
              :multiple="true"
              :fileList="[]"
              name="file"
            >
            <a-button type="primary" :disabled="acceptType=='pdf' && attachmentList[0].fileList.length == 1" ghost>上传</a-button>
            </a-upload>
          </div>
        </template>
        <template slot="fileList" slot-scope="list, record">
          <template v-for="(item,index) in list">
            <a-tooltip :key="item.path">
              <template #title>{{item.createdDate}}</template>
              <div class="filetag" @click="viewFile(item)">
                <span>{{item.name}}</span>
                <div @click.stop="onDel(list,index)" class="icon">
                  <FullDel ></FullDel>
                </div>
              </div>
            </a-tooltip> 
          </template>
          
          
        </template>
      </a-table>
    </a-card>
    <div class="fixed-bottom">
      <a-space :size="30">
        <a-button class="btn" type="primary" @click="back"  ghost>取消</a-button>
        <a-button class="btn" type="primary" @click="onSubmit" :loading="saveLoading">确定 </a-button>
      </a-space>
    </div>
    <ConfirmModal ref="confirm" ></ConfirmModal>
    <ImageViewer ref="imageViewer" />
  </div>
</template>
<script>
import Breadcrumb from "@/v2/components/breadcrumb/index";
import {FullDel} from "v2/components/svg";
import ConfirmModal from "v2/components/modal/ConfirmModal";
import SlRangePicker from "@sub/components/ui-new/Form/sl-range-picker";
import SlDatePicker from "@sub/components/ui-new/Form/sl-date-picker";
import { mapGetters } from "vuex";
import { commonStationUpload} from "v2/api/upload";
import {API_listTerminalDirector} from "v2/center/trade/api/contract";
import {getContractBoth,editOfflineContract,getDetail,searchCompany} from "../../../api/contract";
import moment from "moment";
import ImageViewer from "@sub/components/viewer/image" 
import reg from '@sub/utils/reg.js'

const columns = [
  {
    title: "单据类型",
    key: "type",
    width:210,
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "文件名称",
    key: "fileList",
    dataIndex: "fileList",
    scopedSlots: { customRender: "fileList" },
  },
]
export default {
  components:{
    Breadcrumb,
    FullDel,
    ConfirmModal,
    SlRangePicker,
    SlDatePicker,
    ImageViewer
  },
  data(){
    return {
      id :this.$route.query.id,
      form: this.$form.createForm(this),
      loading:false,
      columns,
      attachmentList:[{type:"offlineContract",fileList:[]}],
      validator:{
        bizContractNo:[
        {validator:function(rule, value, callback){
            if(!value){
              callback("请输入合同编号")
              return
            }
            if(/[\s]/.test(value)){
              callback("不允许输入空格")
              return
            }
            if(/[\u4E00-\u9FA5]/.test(value)){
              callback("不允许输入汉字")
              return
            }
            if(value.length > 50){
              callback("最多50个字符")
              return
            }
            callback()
          }},
        ],
        payerCompanyName:[
        {required:true,message:'请输入付费方名称'},
          {whitespace:true,message:"不允许输入空格"},
          {max:50,message:"最多50个字符"},
        ]
      },
      acceptType:"",
     
      businessList:[],//业务实际负责人列表，
      submitExtraData:{
        payerCompanyUscc:"",//付费方uscc
        signStatus:"THREE",//签署方式
        businessOwnershipTeamConfigBusinessUnitName: "", //业务归属团队事业部名称
        businessOwnershipTeamConfigMemberName: "", //业务归属团队成员姓名
        businessOwnershipTeamConfigMemberMobile: "", //业务归属团队成员手机号
        lastModifiedDate:""
      },
      saveLoading:false
    }
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_TOKEN: "VUEX_ST_TOKEN",
    }),
    headers() {
      return {
        Authorization: this.VUEX_ST_TOKEN,
        Source: "PC",
      };
    },
    accept() {
      // 只能上传pdf 和图片
      if(this.acceptType == "image") {
        return 'image/png,image/jpeg'
      }
      if(this.acceptType == "pdf") {
        return 'application/pdf'
      }
      return "image/png,image/jpeg,application/pdf"
    },
  },
  mounted(){
    this.getBusinessList();
    this.getContractBoth();
   
    this.getDetail();
    // this.$message.loading("上传中",0)
  },
  methods:{
    //获取详情
    getDetail(){
      const id = this.id;
      if(!id){
        this.form.setFieldsValue({signStatus:this.submitExtraData.signStatus})
        return
      }
      this.loading = true;
      getDetail(id).then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        Object.keys(this.submitExtraData).forEach((key) => {
          this.submitExtraData[key] = data[key]
        })
      
        this.form.setFieldsValue({
          bizContractNo:data.bizContractNo,
          businessOwnershipTeamConfigId:data.businessOwnershipTeamConfigId,
          effective:[moment(data.effectiveStartDate),moment(data.effectiveEndDate)],
          signDate:moment(data.signDate),
          signStatus:data.signStatus,
          payerCompanyName:data.payerCompanyName||""
        })
        let ispdf = data.attachmentList.some((item) => item.path.endsWith("pdf"))
        if(ispdf){
          this.acceptType = "pdf"
        }else{
          this.acceptType = "image"
        }
        this.attachmentList[0].fileList = data.attachmentList
      })
    },
    //获取业务实际负责人
    getBusinessList(){
      API_listTerminalDirector().then(({success,data}) => {
        if(!success){
          return
        }
        this.businessList = data;
      })
    },
    //获取仓储方和承租方
    getContractBoth(){
      getContractBoth().then(({success,data}) => {
        if(!success){
          return
        }
        this.form.setFieldsValue({
          warehouseOwnerCompanyName:data.warehouseOwnerCompanyName,
          warehouseTenantCompanyName:data.warehouseTenantCompanyName
        })
      })
    },
    //修改签署方式
    onSignStatus(e){
      const val = e.target.value;
      this.submitExtraData.signStatus = val;
      if(val == "TWO"){
        this.form.resetFields(["payerCompanyName"])
      }
    },
    //选择业务实际负责人
    onChangeBusiness(value,e){
      const item = e.data.attrs.item ||{};
      //业务归属团队事业部名称
      this.submitExtraData.businessOwnershipTeamConfigBusinessUnitName = item.businessUnitName
      //业务归属团队成员姓名
      this.submitExtraData.businessOwnershipTeamConfigMemberName = item.memberName
      //业务归属团队成员手机号
      this.submitExtraData.businessOwnershipTeamConfigMemberMobile = item.notHiddenMemberMobile
    },
    //提交
    onSubmit(){
      this.form.validateFieldsAndScroll((error,values) => {
        if(error){
          return
        }
        if(this.attachmentList[0].fileList.length == 0){
          this.$message.error("请上传线下合同")
          return
        }
        this.save({...values,...this.submitExtraData})
      })
    },    
    save(values){
      const effective = values.effective;
      delete values.effective;
      values.effectiveStartDate = effective[0]
      values.effectiveEndDate = effective[1]
      if(effective[0] instanceof moment){
        values.effectiveStartDate = effective[0].format("YYYY-MM-DD");
        values.effectiveEndDate = effective[1].format("YYYY-MM-DD");
      }
      
      values.signDate = values.signDate.format("YYYY-MM-DD");
      values.attachmentList = [...this.attachmentList[0].fileList]
      if(this.id){
        values.id = this.id
      }else{
        delete values.lastModifiedDate
      }
      this.saveLoading = true;
      editOfflineContract(values).then(({success}) => {
        if(!success){
          this.saveLoading = false;
          return
        }
        this.$router.back();
      }).catch(() => {
        this.saveLoading = false;
      })
    },
    filterOptionBusiness(value,option){
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(value.toLowerCase())
      );
    },
    onDel(list,index){
      this.$refs.confirm.showModal({
        modalTitle:"确认删除",
        modalText:"确认要删除该附件吗，删除后无法恢复",
        confirm:() => {
          list.splice(index,1);
          this.attachmentList[0].fileList = list
          if(list.length == 0){
            this.acceptType = "";
          }
        }
      })
    },
    back(){
      this.$router.go(-1)
    },
    beforeUpload(file,files){
      let types = new Set(files.map((item) => {
        if(item.type.includes("image")){
          return "image";
        }
        return "pdf";
      }));
      if(types.size > 1){
        this.$message.error("PDF和图片只允许上传一个格式，请重新选择");
        return false;
      }
      if(file.type.includes("image")){
        this.acceptType = "image"
      }else{
        this.acceptType = "pdf"
      }
      const t = this;
      if (file.size / 1024 / 1024 > 100) {
        t.$message.error("单个附件大小不得超过100M");
        return true;
      }
      if (
        file.name.indexOf("/") > 0 ||
        file.name.indexOf("\\") > 0 ||
        file.name.indexOf("%") > 0
      ) {
        t.$message.error("文件名不要包含特殊符号");
        return true;
      }
      this.handleUpload(file)
      return false
    },
    async  handleUpload(file) {
      this.beginUpload = true;
      const formData = new FormData();
      formData.append('file', file);
      try {
        this.$message.loading("上传中...",0)
        const {data} = await commonStationUpload(formData)
        this.$message.destroy();
        const obj = {
          name:file.name,
          path:data.path , 
          attachmentType:"OFFLINE_CONTRACT",
          createdDate: data.createdDate
        }

        const item = this.attachmentList[0]
        item.fileList.push(obj)

        this.$forceUpdate()

      } catch (err) {
         const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试'
         this.$message.error(tip);
      } 
    },
    //检索
    onCheckCompany(e){
      const val = e.target.value;
      if(!val) return
      if(!reg.hanZi.test(val)) {
          this.$message.error('请输入至少两个汉字且以汉字结尾')
          return
      }
      this.submitExtraData.payerCompanyUscc = "";
      this.saveLoading = true;
      
      searchCompany({name:val}).then(({data}) => {
        this.saveLoading = false;
        if(!data || !data.creditCode){
          this.form.setFields({ 
            ["payerCompanyName"]: { 
              errors:[{message:"未查询到相关企业信息",field: "payerCompanyName"},] ,
              value:val
            } });
          return
        }
        this.submitExtraData.payerCompanyUscc = data.creditCode
      })
    },
    viewFile(data){
      let url = data?.fileUrl || data?.url || data?.path
			if (!url) return
			this.$refs.imageViewer.showFile(url);
    }
  }
}
</script>
<style lang="less" scoped>
  
  .slMain .slFormDetail{
    padding-top:30px;
  }
  .a-alert{
    margin-top: 30px;
    padding:11px 12px;
    font-size:12px;
    line-height:22px;
    background-color:#E1EAFE;
    border:1px solid #D0DFFF;
    border-radius: 4px;;
    color:rgba(#000,0.8);
  }
  .new-table{
    margin-top: 20px;
    margin-bottom: 30px;
    .type-label{
      display:flex;
      align-items: center;
      justify-content: space-between;
      .required{
        &:before{
          display: inline-block;
          margin-right: 4px;
          color: #f5222d;
          font-size: 14px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: '*';
        }
      }
    }
    ::v-deep{
      th.ant-table-row-cell-break-word{
        border-right: 0;
      }
    }
  }
  .fixed-bottom{
    display: flex;
    align-items:center;
    justify-content: center;
    position: sticky;
    bottom: 0;
    height: 64px;
    z-index:10;
    background-color:#fff;
    border-top:1px solid #e5e6eb;
    .btn{
      width:88px;
      height:32px;
    }
  }
  .filetag{
    margin-bottom: 5px;
    display: inline-flex;
    align-items: center;
    margin-right:10px;
    padding:6px;
    height: 28px;
    background-color:#F3F5F6;
    border-radius:4px;
    cursor: pointer;
    span{
      margin-right: 8px;
      font-size:14px;
      color: @primary-color;
    }
    .icon{
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
</style>