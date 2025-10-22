<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">质押物置换记录</span>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="action" slot-scope="action, items">
                        <a-space>
                            <router-link :to="{path:'/center/pledge/substitutionLogDetail', query: {id: items.id}}">详情</router-link>
                            <a @click="zuofei(items)" v-auth="'goods:pledge:replace:coreCompany'" v-if="items.status=='PUSH_BANK_FAIL'">作废</a>
                            <a @click="repush(items)" v-auth="'goods:pledge:replace:coreCompany'" v-if="items.status=='PUSH_BANK_FAIL'">重新推送</a>
                        </a-space>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
    </div>
</template>
<script>
    const columns = [
        { title: '置换编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo'},
        { title: '解质数量（吨）', dataIndex: 'redeemQuantity', key: 'redeemQuantity'},
        { title: '解质存货点', dataIndex: 'redeemInventoryPoint', key: 'redeemInventoryPoint'},
        { title: '解质货值（元）', dataIndex: 'redeemGoodsValue', key: 'redeemGoodsValue'},
        { title: '补货数量（吨）', dataIndex: 'addQuantity', key: 'addQuantity'},
        { title: '补货存货点', dataIndex: 'addInventoryPoint', key: 'addInventoryPoint'},
        { title: '补货货值（元）', dataIndex: 'addGoodsValue', key: 'addGoodsValue'},
        { title: '货押融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyNo'},
        { title: '货主名称', dataIndex: 'goodsCompanyName', key: 'goodsCompanyName'},
        { title: '仓储企业', dataIndex: 'storageCompanyName', key: 'storageCompanyName'},
        { title: '金融机构', dataIndex: 'bankName', key: 'bankName'},
        { title: '申请时间', dataIndex: 'createDate', key: 'createDate'},
        { title: '状态', dataIndex: 'statusText',fixed: 'right', key: 'statusText'},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    import { API_PledgeExchangeListLOG, API_SubstitutionListLOGMAINZF,API_SubstitutionListLOGMAINPUSH} from 'api'

    import iPagination from "@sub/components/iPagination"
    import { ListMixin } from "@/v2/components/mixin/ListMixin";
    export default {
        mixins: [ListMixin],
        props: {
            jr:{
                default(){
                    return false;
                }
            },
            cang:{
                default(){
                    return false;
                }
            }, 
        },
        data() {
            return {
                columns,
                searchList: [],
                url: {
                    list: API_PledgeExchangeListLOG
                },
                selfLoad: true,
            }
        },
        components: {
            iPagination
        },
        computed: {
        },
        created: function () {
            this.searchList = this.renderType()
            this.$nextTick(() => {
                this.getList()
            })
        },
        methods: {
            zuofei(record){
                this.$confirm({
                    centered:true,
                    title: "确定作废",
                    okText: '确定',
                    content:"系统将对该置换记录进行作废，确定要进行作废吗?",
                    cancelText: '取消',
                    onOk:()=> {
                        API_SubstitutionListLOGMAINZF({
                            exchangeApplyId:record.id,
                            message:''
                        }).then(res=>{
                            if (res.success) {
                                if(res.data) {
                                    this.$message.success('作废成功')
                                    this.getList()
                                }
                            }
                        })
                    },
                    onCancel() {}
                });
            },
            repush(record){
                this.$confirm({
                    centered:true,
                    title: "确定重新推送",
                    okText: '确定',
                    content:"系统将对该置换记录进行重新推送，确定吗?",
                    cancelText: '取消',
                    onOk:()=> {
                        API_SubstitutionListLOGMAINPUSH({
                            exchangeApplyId:record.id
                        }).then(res=>{
                            if (res.success) {
                                if(res.data) {
                                    this.$message.success('作废成功')
                                    this.getList()
                                }
                            }
                        })
                    },
                    onCancel() {}
                });
            },
            renderType(){
                return [
                    {
                        decorator: ["exchangeNo"],
                        addonBeforeTitle: "置换编号",
                        type: "input",
                        placeholder: "请输入置换编号",
                    },
                    {
                        decorator: ["financingApplyNo"],
                        addonBeforeTitle: "融资编号",
                        type: "input",
                        placeholder: "请输入融资编号",
                    },
                    {
                        decorator: ["storageCompanyName"],
                        addonBeforeTitle: "仓储企业",
                        type: "input",
                        placeholder: "请输入仓储企业",
                        isShow: !this.cang,
                    },
                    {
                        decorator: ["bankName"],
                        addonBeforeTitle: "金融机构",
                        type: "input",
                        placeholder: "请输入金融机构",
                    },
                    {
                        decorator: ["applyTime"],
                        addonBeforeTitle: "申请日期",
                        type: "rangePicker",
                        realKey: ["applyDateStart", "applyDateEnd"],
                    },
                    {
                        decorator: ["status"],
                        addonBeforeTitle: "状态",
                        type: "select",
                        placeholder: "请选择状态",
                        options: [
                            {
                                value: "OA_AUDIT",
                                label: "OA审核中",
                            },
                            {
                                value: "OA_REJECT",
                                label: "OA审核驳回",
                            },
                            {
                                value: "BANK_AUDIT",
                                label: "资方审核中",
                            },
                            {
                                value: "BANK_REJECT",
                                label: "资方审核驳回",
                            },
                            {
                                value: "COMPLETED",
                                label: "已完成",
                            },
                        ]
                    },
                    {
                        decorator: ["goodsCompanyName"],
                        addonBeforeTitle: "货主名称",
                        type: "input",
                        placeholder: "请输入货主名称",
                        isShow: this.jr || this.cang,
                    },
                ]
            }
        }
    }
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
    .divider {
      background: #f4f5f8;
      height: 1px;
      margin-top:20px;
      margin-left: -20px;
      margin-right: -20px;
    }
    .s-card-title{
        margin-top: 10px;
        font-family: PingFangSC-Medium;
        color: #141517;
        line-height: 24px;
        position: relative;
        &>button{
            position: absolute;
            right: 16px;
        }
    }
    ::v-deep.ant-form-item{
        display: block;
        margin-bottom: 14px;
    }
    ::v-deep.ant-form-item-label {
        padding-right: 30px;
    }
    ::v-deep.ant-table-body tr th {
        color: #333;
    }
</style>
