<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span class="slTitle">服务费协议详情</span>
      </div>
      <div class="mt20">
        <div style="color:green;float:right;margin-right:20px; float:right">
          服务费协议状态：{{resultDetail.statusDesc}}
        </div>
      </div>
      <div>
        <h4> <strong>基本信息</strong></h4>
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16}" labelAlign="left">
          <a-row>
            <a-col :span="8">
              <a-form-item label="服务协议编号：">
                {{resultDetail.serialNo}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="企业类型：">
                {{resultDetail.companyTypeDesc}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="企业名称：">
                {{resultDetail.companyName}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="服务方：">
                {{resultDetail.serviceCompanyName}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="服务费协议模板：">
                  {{resultDetail.templateDesc}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="服务协议签订日期：">
                  {{resultDetail.signDate}}
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="签约地点：">
                {{resultDetail.signPlaceDesc}}
              </a-form-item>
            </a-col>
                      <a-col :span="8">
              <a-form-item label="结算单位：">
                {{resultDetail.settlementCompanyName}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div v-if="resultDetail.companyType !== 'FINANCIAL_ORG' && resultDetail.otherServiceExplanationStr">
        <h4 class="mb20"> <strong>其他服务说明</strong></h4>
        <Editor
          type="1"
          :disabled='true'
          value="otherAppointHtmlStr"
          :getData="getData"
          :defaultValue="resultDetail.otherServiceExplanationStr" />
      </div>
      <div class="mt20"  v-if="resultDetail.companyType !== 'FINANCIAL_ORG' && resultDetail.platformServiceFeeStandardAndBasicStr">
        <h4 class="mb20"> <strong>平台服务费收取标准和基础</strong></h4>
        <Editor
          type="2"
          :disabled='true'
          value="platformServiceFeeStr"
          :getData="getData"
          :defaultValue="resultDetail.platformServiceFeeStandardAndBasicStr" />
      </div>
      <div class="mt20" v-if="resultDetail.companyType == 'FINANCIAL_ORG' && resultDetail.fullTextStr ">
        <h4 class="mb20"> <strong>全文本信息</strong></h4>
        <Editor
          type="3"
          :disabled='true'
          value="fullTextStr"
          :getData="getData"
          :defaultValue="resultDetail.fullTextStr" />
      </div>
      <div class="mt20" v-if="resultDetail.url || resultDetail.invalidUrl">
        <h4 class="mb20"> <strong>服务协议文件</strong></h4>
        <div class="dfac">
          <div class="pdf"  v-if="resultDetail.url"  @click="pdfView(resultDetail.url)">
            <img src="~imgs/pdf.png">
            <p >服务协议</p>
          </div>
          <div class="pdf" v-if="resultDetail.invalidUrl"  @click="pdfView(resultDetail.invalidUrl)">
            <img src="~imgs/pdf.png">
            <p >服务协议作废确认书</p>
          </div>
        </div>
      
        
      </div>
      <div class="mt20" v-show="resultDetail.logList && resultDetail.logList.length">
        <h4 class="fw mb20"><strong>操作记录</strong></h4>
          <a-table 
            :columns="viewHandleColumns"  
            rowKey="createTime"  
            :scroll="{x:true}" 
            :dataSource="resultDetail.logList" 
            :pagination="false"  
            class="detailsTable"
          >
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import Editor from '../../components/Editor'
import { getServiceFeeDetail } from '../../api';
import { filePreview } from "@/v2/utils/file";
import Breadcrumb from "@/v2/components/breadcrumb/index";
const viewHandleColumns = [
  { title: '操作', key: 'operation', dataIndex: 'operation'},
  {title: '操作人', key: 'createName',  dataIndex: 'createName'},
  {title: '操作内容', key: 'content',  dataIndex: 'content'},
  {title: '操作时间',key: 'createTime',  dataIndex: 'createTime'},
  {title: '备注',key: 'remark',  dataIndex: 'remark', customRender:(v)=> v ||'-'},

]
export default {
  data() {
    return {
      viewHandleColumns,
      resultDetail: {
       
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getData(val) {
    },
    // 获取详情
    async getDetail() {
      const params = {
        serialNo: this.$route.query.serialNo
      }
      const res = await getServiceFeeDetail(params)
      this.resultDetail = res.data
    },
    pdfView(path) {
      filePreview(path);
		},
  },
  components: {
    Editor,
    Breadcrumb,
  }
}
</script>

<style scoped lang='less'>
.mt20 {
  margin-top: 20px;
}
.mb20 {
  margin-bottom: 20px;
}
.dfac {
  display: flex;
  align-items: center;
  // justify-content:;
}
.pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  img{ 
    width: 109px;
    height: 141px;
    object-fit: cover;
  }
}
/deep/.ant-row .ant-form-item {
  margin-bottom: 12px;
}
</style>
