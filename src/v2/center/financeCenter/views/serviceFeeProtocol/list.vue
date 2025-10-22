<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span slot="title" class="slTitle"><span>服务费协议管理</span></span>
			</div>
			<!-- 查询区域 -->
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="changeSearch"
        ref="SlFormNew"
      ></SlFormNew>
			<a-tabs default-active-key="" @change="callback">
				<a-tab-pane v-for="item in statusData" :key="item.value ||''" :tab="item.label">
				</a-tab-pane>
			</a-tabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource" :scroll="{x:true}" rowKey="serialNo" :loading="loading">
					<div slot="action" slot-scope="action, item">
						<a-space>
							<a v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:detail'" @click="goView(item)">详情</a>
							<a v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:seal'" v-if="item.status == 'WAIT_SIGN_SEAL'" @click="goSign(item)">盖章</a>
							<a v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:invalid'" v-if="item.status == 'CONFIRMED'" @click="cancellation(item)">作废</a>
							<a v-auth="'financialCenter:serviceFeeAgreement:serviceFeeAgreement:detail'" @click="downPdf(item)">下载</a>
						</a-space>
					</div>
				</a-table>
				<i-pagination :pagination="pagination" @change="getList" />
			</div>
		</a-card>
	</div>
</template>

<script>
    import iPagination from "@sub/components/iPagination"
    import {getTemplateList,getServiceFeeList,downServiceFee,getSettlementList } from '../../api'
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
		const searchList = [
			{
				decorator: ["serialNo"],
				addonBeforeTitle: "服务费协议编号",
				type: "input",
				placeholder: "请输入服务费协议编号",
			},
			{
				decorator: ["template"],
				addonBeforeTitle: "服务协议模板",
				type: "select",
				placeholder: "请选择",
				options:[],
			},
			{
				decorator: ["signDate"],
				addonBeforeTitle: "签订日期",
				type: "rangePicker",
				realKey: ["signDateBegin", "signDateEnd"],
			},
			{
				decorator: ["createTime"],
				addonBeforeTitle: "创建日期",
				type: "rangePicker",
				realKey: ["createTimeBegin", "createTimeEnd"],
			},
			{
				decorator: ["settlementCompanyUscc"],
				addonBeforeTitle: "结算单位",
				type: "select",
				placeholder: "请选择",
				options:[],
			},
		];
    import { filterCodeByKey } from '@sub/utils/globalCode.js'
    import {  ListMixin } from "@/v2/components/mixin/ListMixin";
    export default {
        mixins: [ListMixin],
        data(){
          return{
						columns,
						settlementCompanyUsccList:[],
						// 模板
						templateList: [],
						loading: false,
						searchList,
						defaultParams: {
							status: ''
			  		},
			  		selfLoad: true,
						url: {
							list: getServiceFeeList,
						}
          }
        },
        components:{
            iPagination
        },
        mounted() {
					this.initData()
        },
        computed: {
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
					initData() {
						return new Promise(async (resolve)=>{
							await this.getTemplateList()
							this.getList()
							resolve(true)
						})
					},
					// 获取模板列表
					async getTemplateList() {
						const res = await getTemplateList()
						this.templateList = res.data
						this.searchList.forEach(item=>{
							if (item.decorator[0] === 'template') {
								item.options = this.templateList.map((item) => {
									return { value: item.value, label: item.text};
								})
							}
						})
						const resList = await getSettlementList()
						this.settlementCompanyUsccList = resList.result
						this.searchList.forEach(item=>{
							if (item.decorator[0] === 'settlementCompanyUscc') {
								item.options = this.settlementCompanyUsccList.map((item) => {
									return { value: item.value, label: item.text};
								})
							}
						})
					},
					callback(status) {
						this.defaultParams.status = status
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
