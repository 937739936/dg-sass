<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">补货通知</span>
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
                            <router-link  :to="{path:items.addGoodsType == 'ADD_MARGIN' ? '/center/pledge/replenishmentCashDetail' : '/center/pledge/replenishmentDetail', query: {id: items.id}}">详情</router-link>
                            <router-link v-auth="'goods:warning:replenishment:edit'" :to="{path:'/center/pledge/replenishmentApply',  query: {id: items.id}}" v-if="items.status=='INIT'">补货</router-link>
                            <router-link v-auth="'goods:warning:replenishment:edit'" :to="{path:'/center/pledge/replenishmentCashApply',  query: {id: items.id}}" v-if="items.status=='INIT'">补保证金</router-link>
                            <a @click="openModal(items)" v-if="items.status == 'TO_BE_IMPROVED'">打款确认</a>
                            <!--”重新补货“：”OA驳回“、”资方驳回“ 资产添加失败 状态显示该按钮-->
                            <template  v-if="items.status=='OA_REJECT'||items.status=='BANK_REJECT'||items.status=='ADD_GOODS_FAIL'">
                                <router-link v-auth="'goods:warning:replenishment:edit'" :to="{path:'/center/pledge/replenishmentApply', query: {id: items.id,repeat:1}}">重新补货</router-link>
                                <router-link v-auth="'goods:warning:replenishment:edit'" :to="{path:'/center/pledge/replenishmentCashApply', query: {id: items.id}}">重新补保证金</router-link>
                            </template>

                            <a @click="zuofei(items)" v-if="items.status=='PUSH_BANK_FAIL'" v-auth="'goods:warning:replenishment:coreCompany'">作废</a>
                            <a @click="repush(items)" v-if="items.status=='PUSH_BANK_FAIL'" v-auth="'goods:warning:replenishment:coreCompany'">重新推送</a>
                        </a-space>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
        <a-modal 
            v-model="modelVisible"
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
                        <br/>
                        <p>附件上传要求：可支持格式为bmp，jpg，png，pdf的文件格式的附件，单个附件大小不得超过100M的文件。</p>
                    </div>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script>
    const columns = [
        { title: '补货编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo'},
        { title: '货押融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyId'},
        { title: '状态', dataIndex: 'statusText', key: 'statusText'},
        { title: '融资方', dataIndex: 'financier', key: 'financier'},
        { title: '出资机构', dataIndex: 'bankName', key: 'bankName'},
        { title: '当前质押货值（元）', dataIndex: 'pledgeGoodsValue', key: 'pledgeGoodsValue'},
        { title: '需补货值（元）', dataIndex: 'lossAmount', key: 'lossAmount'},
        { title: '补货货值（元）', dataIndex: 'addGoodsValue', key: 'addGoodsValue'},
        { title: '补保证金（元）', dataIndex: 'marginAmount', key: 'marginAmount'},
        { title: '补货数量（吨）', dataIndex: 'addGoodsQuantity', key: 'addGoodsQuantity'},
        { title: '补货存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
        { title: '通知时间', dataIndex: 'noticeTime', key: 'noticeTime'},
        { title: '类型', fixed: 'right' ,dataIndex: 'addGoodsTypeText', key: 'addGoodsTypeText',customRender:(v)=>{
            return v||'-'
        }},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    const searchList = [
        {
            decorator: ["noticeNo"],
            addonBeforeTitle: "补货编号",
            type: "input",
            placeholder: "请输入补货编号",
        },
        {
            decorator: ["financingApplyNo"],
            addonBeforeTitle: "融资编号",
            type: "input",
            placeholder: "请输入融资编号",
        },
        {
            decorator: ["bankName"],
            addonBeforeTitle: "出资机构",
            type: "input",
            placeholder: "请输入出资机构",
        },
        {
            decorator: ["noticeDate"],
            addonBeforeTitle: "通知日期",
            type: "rangePicker",
            realKey: ["noticeDateStart", "noticeDateEnd"],
        },
        {
            decorator: ["status"],
            addonBeforeTitle: "状态",
            type: "select",
            placeholder: "请选择状态",
            options: [
                {
                    label: "待处理",
                    value: "INIT",
                },
                {
                    label: "待完善",
                    value: "TO_BE_IMPROVED",
                },
                {
                    label: "OA审核中",
                    value: "OA_AUDIT",
                },
                {
                    label: "OA审核驳回",
                    value: "OA_REJECT",
                },
                {
                    label: "资产添加失败",
                    value: "ADD_GOODS_FAIL",
                },
                {
                    label: "资方审核中",
                    value: "BANK_AUDIT",
                },
                {
                    label: "资方审核驳回",
                    value: "BANK_REJECT",
                },
                {
                    label: "已完成",
                    value: "COMPLETED",
                },
            ]
        },
        {
            decorator: ["addGoodsType"],
            addonBeforeTitle: "类型",
            type: "select",
            placeholder: "请选择类型",
            options: [
                {
                    label: "全部",
                    value: "",
                },
                {
                    label: "补货",
                    value: "ADD_GOODS",
                },
                {
                    label: "补保证金",
                    value: "ADD_MARGIN",
                },
            ]
        },
        
    ]
    import { API_UPLOAD,API_PledgeReplenList, API_ReplenishmentListMAINPUSH,API_ReplenishmentListMAINZF,API_FinancingApplypledgeCashDa} from '@/api'

    import { mapGetters } from 'vuex'
    import iPagination from "@sub/components/iPagination"
    import { ListMixin } from "@/v2/components/mixin/ListMixin";
    export default {
        mixins: [ListMixin],
        data() {
            return {
                modelVisible:false,
                action:API_UPLOAD,
                curObj:{},
                columns,
                searchList,
                url: {
                    list: API_PledgeReplenList
                },
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
        methods: {
            submitZ(){
                if (!this.curObj.file) {
                    this.$message.error('请上传文件')
                    return
                }

                API_FinancingApplypledgeCashDa({
                    addApplyId:this.curObj.addApplyId,
                    certPath:this.curObj.file.file.response.result
                }).then(res=>{
                    this.modelVisible = false
                    this.getList()
                }).catch(e=>{
                    this.modelVisible = false
                })
            },
            openModal(record){
                this.curObj = {
                    file:null,
                    ...record
                }
                this.modelVisible = true

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
            zuofei(record){
                this.$confirm({
                    centered:true,
                    title: "确定作废",
                    okText: '确定',
                    content:"系统将对该补货记录进行作废，确定要进行作废吗?",
                    cancelText: '取消',
                    onOk:()=> {
                        API_ReplenishmentListMAINZF({
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
            repush(record){
                this.$confirm({
                    centered:true,
                    title: "确定重新推送",
                    okText: '确定',
                    content:"系统将对该补货记录进行重新推送，确定吗?",
                    cancelText: '取消',
                    onOk:()=> {
                        API_ReplenishmentListMAINPUSH({
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
