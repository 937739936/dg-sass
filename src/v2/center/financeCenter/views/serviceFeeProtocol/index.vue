<template>
  <div class="mySettleList slMain" style="margin-top:-10px">
    <a-card title="" :bordered="false">
      <div class="s-title">
      <span  slot="title" class="slTitle"> 服务费协议管理</span>
    </div>
    <SlFormNew 
      :list="searchList" 
      layout="inline" 
      @change="changeSearch"
      :allowClear="false"
      @resetFunc="resetValues"
      :isShowIcon="false"
      :isShowSearchBox="true"
    ></SlFormNew>
      <div >
        <a-tabs default-active-key="" @change="callback">
          <a-tab-pane v-for="item in statusData" :key="item.value ||''" :tab="item.label">
          </a-tab-pane>
        </a-tabs>
        <a-table :pagination="false" :columns="columns" :data-source="dataSource" :scroll="{x:true}" rowKey="serialNo" :loading="loading" class="new-table" style="margin-top:30px">
          <div slot="action" slot-scope="action, item">
            <a style='margin-right:8px'  v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:detail'" @click="goView(item)">详情</a>
            <a style='margin-right:8px' v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:seal'"  v-if="item.status == 'WAIT_SIGN_SEAL'" @click="goSign(item)">盖章</a>
            <a style='margin-right:8px'  v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:invalid'" v-if="item.status == 'CONFIRMED'" @click="cancellation(item)">作废</a>
            <a style='margin-right:8px'  v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:detail'" @click="downPdf(item)">下载</a>
          </div>
    
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
  </div>
</template>

<script>
    import iPagination from "@sub/components/iPagination"
    import {getTemplateList, getServiceFeeList,downServiceFee,getSettlementList } from '../../api'
    import { mapGetters } from 'vuex'
    import comDownload from '@sub/utils/comDownload.js'

    const columns = [
        { title: '服务费协议编号', dataIndex: 'serialNo', key: 'serialNo'},
        { title: '状态', dataIndex: 'statusDesc', key: 'statusDesc'},
        { title: '服务协议模板', dataIndex: 'templateDesc', key: 'templateDesc'},
        { title: '结算单位', dataIndex: 'settlementCompanyName', key: 'settlementCompanyName'},

        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        { title: '签订日期', dataIndex: 'signDate', key: 'signDate'},
        { title: '操作',key: 'action', fixed: 'right',scopedSlots: { customRender: 'action' }}
    ];
    import { filterCodeByKey } from '@sub/utils/globalCode.js'
    const searchList = [
      {
        decorator: ['serialNo'],
        addonBeforeTitle: '服务费协议编号',
        type: 'input',
        placeholder: '请输入服务费协议编号',
        allowClear:true,
      },
    
      {
        decorator: ['template'],
        addonBeforeTitle: '服务协议模板',
        type: 'select',
        placeholder: '请选择服务协议模板',
        allowClear:true,
        options:[]
      },
      {
        decorator: ['date2'],
        addonBeforeTitle: '签订日期',
        realKey: ['signDateBegin', 'signDateEnd'],
        type: 'rangePicker',
        placeholder: ['', ''],

        allowClear:true,
      },
      {
        decorator: ['date'],
        addonBeforeTitle: '创建日期',
        realKey: ['createTimeBegin', 'createTimeEnd'],
        type: 'rangePicker',
        placeholder: ['', ''],

        allowClear:true,
      },
      {
        decorator: ['settlementCompanyUscc'],
        addonBeforeTitle: '结算单位',
        type: 'select',
        placeholder: '请选择',
        allowClear:true,
        options: []
      }
    ]
    import {  ListMixin } from "@/v2/components/mixin/ListMixin";

    export default {
        mixins: [ListMixin],
        data(){
          return{
              columns,
            
              settlementCompanyUsccList:[],
              searchList,
              url: {
                list: getServiceFeeList,
              },
              params:{
                serialNo:undefined,
                status:undefined,
                template: undefined,
                createTimeBegin: undefined,
                createTimeEnd: undefined,
                signDate: undefined,
                status: '',
              },
              resultDetail:[],
              // 模板
              templateList: [],
              pagination: {
                  total: 0, // 总条数
                  pageNo: 1,
              },
              loadingResultDetail: false
          }
        },
        components:{

        },
        mounted() {
          this.getTemplateList()
        },
        computed: {
          ...mapGetters('user', {
              VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
          }),

          statusData() {
            let list = [{ label: '全部', value: '' }]
            let arr =  filterCodeByKey('serviceFeeAgreementStatusDict')
            const newArr = arr.map(el => {
              return {
                label: el.text,
                value: el.value
              }
            })
            newArr.forEach((el, i, arr) => {
              if(el.value == 'DRAFT') {
                arr.splice(i, 1)
              }
            });

            list = [...list, ...newArr]
            return list
          }
        },
        methods:{
          searchSubmit(){
            this.pagination.pageNo = 1
            this.getList()
          },
          // 获取模板列表
          async getTemplateList() {
            const res = await getTemplateList()
            this.templateList = res.data
            this.searchList[1].options = res.data.map(el => {
              return {
                ...el,
                label: el.text,
              }
            })
            const resList = await getSettlementList()
            this.settlementCompanyUsccList = resList.result
            this.searchList[4].options = resList.result.map(el => {
              return {
                ...el,
                label: el.text
              }
            })
          },
          callback(status) {
            this.params.status = status
            this.defaultParams.status = status
            this.searchSubmit()
          },
           changeSearch(info) {
            this.pagination.pageNo = 1
            this.searchParams = info
            this.getList()

          },
          // 重置
          resetValues() {
            this.defaultParams.status = ''
            this.pagination.pageNo = 1
            this.getList()
          },
          // 作废
          cancellation(item) {
            const self = this
            this.$router.push({
              path: '/center/financeCenter/serviceFeeProtocol/invalid',
              query: {
                serialNo: item.serialNo
              }

            })
          },
          // 下载
          downPdf(item){
            downServiceFee({serialNo: item.serialNo}).then(res=>{
              comDownload(res, undefined, `${item.serialNo}-${item.companyName}.zip`)
            })
          },
          // 详情
          goView(item) {
            this.$router.push({
              path: '/center/financeCenter/serviceFeeProtocol/detail',
              query: {
                serialNo: item.serialNo
              }
            })
          },

          goSign(item) {
            this.$router.push({
              path: '/center/financeCenter/serviceFeeProtocol/sign',
              query: {
                url: item.url,
                serialNo: item.serialNo
              }

            })
          }

        }
    }
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
    .modal-pdf{
        .ant-modal-title,.ant-modal-footer{
            text-align:center;
        }
    }
    ::v-deep.ant-form-item {
		display: block;
        margin-bottom: 14px;
	}
	::v-deep.ant-form-item-label {
		padding-right: 30px;
	}
    .search-btn {margin-right: 20px;}
    ::v-deep.ant-table td{ white-space: nowrap; }
</style>
