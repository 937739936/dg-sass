<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">还款赎货记录</span>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="action" slot-scope="action, items">
                        <router-link :to="{path:'/center/pledge/substitutionReplyDetail', query: {id: items.id}}" style="margin-right: 8px;">详情</router-link>
                        <a @click="openModal(items)" v-if="items.status == 'BANK_TOBE_CONFIRM'" v-auth="'goods:pledge:redeem:coreCompany'">打款确认</a>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
        <a-modal 
            v-model="zuofeiVisible"
            title="打款凭证"
            :width="500"
            @ok="submitZ">
            <a-row>
                <a-col :span="24">
                    <a-upload
                        :beforeUpload="beforeUpload"
                        :action="action"
                        :headers="headers"
                        :multiple="false"
                        :showUploadList="false"
                        @change="handleChange"
                        :remove="removeFile"
                        name="file">
                        <a-button type="primary" icon="upload">上传附件</a-button>
                    </a-upload>
                    <div v-if="curObj.file" style="margin-top:10px;">{{curObj.file.file.name}}</div>
                    <div class="file-notice">
                        <p>附件上传要求：可支持格式为bmp，jpg，png，pdf的文件格式的附件，单个附件大小不得超过100M的文件。</p>
                    </div>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script>
    const columns = [
        { title: '还款编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo'},
        { title: '状态', dataIndex: 'statusText', key: 'statusText'},
        { title: '还款类型', dataIndex: 'repayTypeText', key: 'repayTypeText'},
        { title: '货押融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyNo'},
        { title: '还款日期', dataIndex: 'repayDate', key: 'repayDate'},
        { title: '还款总额（元）', dataIndex: 'repayAmount', key: 'repayAmount'},
        { title: '还款本金（元）', dataIndex: 'repayPrincipal', key: 'repayPrincipal'},
        { title: '还款利息（元）', dataIndex: 'repayInterest', key: 'repayInterest'},
        { title: '解质数量（吨）', dataIndex: 'num', key: 'num'},
        { title: '解质货值（元）', dataIndex: 'amount', key: 'amount'},
        { title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
        { title: '赎货方', dataIndex: 'financier', key: 'financier'},
        { title: '仓储企业', dataIndex: 'storageCompanyName', key: 'storageCompanyName'},
        { title: '金融机构', dataIndex: 'bankName', key: 'bankName'},
        { title: '申请时间', dataIndex: 'createDate', key: 'createDate'},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    import { API_PledgeReplyList, API_UPLOAD,API_FinancingApplypledgeDa} from 'api'

    import { mapGetters } from 'vuex'
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
                zuofeiVisible:false,
                action:API_UPLOAD,
                main:true,
                curObj:{},
                columns,
                searchList: [],
                url: {
                    list: API_PledgeReplyList
                },
                selfLoad: true,
            }
        },
        components: {
            iPagination
        },
        computed: {
            ...mapGetters('user', {
                VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
            }),
            headers() {
                return {
                    Authorization: this.VUEX_ST_TOKEN,
                    Source: 'PC',
                }
            },
        },
        created: function () {
            this.searchList = this.renderType()
            this.$nextTick(() => {
                this.getList()
            })
        },
        methods: {
            openModal(record){
                this.curObj = {
                    file:null,
                    ...record
                }
                this.zuofeiVisible = true

            },
            submitZ(){
                if (!this.curObj.file) {
                    this.$message.error('请上传文件')
                    return
                }

                API_FinancingApplypledgeDa({
                    repayApplyId:this.curObj.id,
                    certPath:this.curObj.file.file.response.result
                }).then(res=>{
                    this.zuofeiVisible = false
                    this.getList()
                }).catch(e=>{
                    this.zuofeiVisible = false
                })
            },
            handleChange(info){
                if (info.file.status === 'done') {
                    this.curObj.file = info
                    this.$forceUpdate()
                }
                
            },
            removeFile(){

                this.curObj.file = null
                this.$forceUpdate()
            },
            beforeUpload(file) {
                const isSupportFileType =
                    file.type === 'image/jpeg' ||
                    file.type === 'image/jpg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/bmp' ||
                    file.type === 'application/pdf'
                if (!isSupportFileType) {
                    this.$message.error('仅支持bmp，jpg，png，pdf的文件格式');
                }

                return isSupportFileType;
            },
            renderType(){
                return [
                    {
                        decorator: ["serialNo"],
                        addonBeforeTitle: "还款编号",
                        type: "input",
                        placeholder: "请输入还款编号",
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
                        decorator: ["financier"],
                        addonBeforeTitle: "赎货方",
                        type: "input",
                        placeholder: "请输入赎货方",
                        isShow: this.jr || this.cang,
                    },
                    {
                        decorator: ["repayDate"],
                        addonBeforeTitle: "还款日期",
                        type: "rangePicker",
                        realKey: ["repayDateStart", "repayDateEnd"],
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
                                value: "ADD_GOODS_FAIL",
                                label: "资产添加失败",
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
                                value: "BANK_CONFIRM",
                                label: "资方确认中",
                            },
                            {
                                value: "BANK_CONFIRM_REJECT",
                                label: "资方确认驳回",
                            },
                            {
                                value: "COMPLETED",
                                label: "已完成",
                            },
                        ]
                    },
                    {
                        decorator: ["repayType"],
                        addonBeforeTitle: "还款类型",
                        type: "select",
                        placeholder: "请选择还款类型",
                        options: [
                            {
                                value: "PRE_PAYMENT",
                                label: "提前还款",
                            },
                            {
                                value: "PRE_PART_PAYMENT",
                                label: "提前部分还款",
                            },
                            {
                                value: "REPAYMENT_DUE",
                                label: "到期还款",
                            },
                        ]
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
    .file-notice{
        margin-top:20px;
        color: #bdbbbb;
        font-size: 13px;
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
