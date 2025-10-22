<template>
    <div class="slMain myServiceFeeConfirm">
        <Breadcrumb/>
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span class="slTitle">服务费结算单确认</span>
                <div class="content-title">
                   <div v-if="feeStatus=='CONFIRMED'" class="fee-status" style="color:green;">服务费结算单状态：已确认</div>
                    <div v-if="feeStatus=='WAIT_CONFIRM'" class="fee-status" style="color:#ff9d35;">服务费结算单状态：待确认</div>
                    <div v-if="feeStatus=='WAIT_SIGN_SEAL'" class="fee-status" style="color:#ff9d35;">服务费结算单状态：待签约</div>
                </div>
            </div>

            <div class="myServiceFeeConfirmForm">
                <div class="slTitleAssis">贸易结算信息</div>
                <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18}">
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-item label="订单编号">
                                <a @click="openOrder">{{myServiceFeeConfirmModel.orderNo}}</a>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="合同编号">

                                {{myServiceFeeConfirmModel.contractNo}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="卖方名称">

                                {{myServiceFeeConfirmModel.sellerCompanyName}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="买方名称">

                                {{myServiceFeeConfirmModel.buyerCompanyName}}
                            </a-form-item>
                        </a-col>
                    </a-row>
                     <div class="slTitleAssis">融资明细</div>
                    <a-row>
                        <a-table
                            class="new-table"
                            rowKey="finBeginDate"
                            :columns="rongzi"
                            :dataSource="myServiceFeeConfirmDataSource"
                            :pagination=false
                            :defaultExpandAllRows="true"
                        >
                            <a-table
                                    slot="expandedRowRender"
                                    slot-scope="record"
                                    :columns="rongziInner"
                                    :data-source="record.repayList"
                                    rowKey="repayDate"
                                    :pagination="false"
                            >

                            </a-table>
                        </a-table>
                    </a-row>
                </a-form>
            </div>
            <div class="fw-content">
                <div class="slTitleAssis">服务费信息</div>
                <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18}">
                    <a-row>
                        <a-col :span="12" class="row" style="padding-left:10px;">
                            <a-form-item label="服务费金额（元）">
                                <span style="color:#f45655;font-size:18px;">{{myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount}}元</span>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务费结算单号">

                                {{myServiceFeeConfirmserviceFeeInfoModel.serialNo}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务费协议编号">

                                {{myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAgreementNo}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务费结算日期">

                                {{myServiceFeeConfirmserviceFeeInfoModel.creatDate}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="结算单位">
                                {{myServiceFeeConfirmserviceFeeInfoModel.settlementCompanyName}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务项目">

                                {{myServiceFeeConfirmserviceFeeInfoModel.serviceItem}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="备注">

                                {{myServiceFeeConfirmserviceFeeInfoModel.remarks}}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="kaipiao-content">
                <div class="slTitleAssis">开票信息</div>
                <a-form :form="myServiceFeeConfirmForm" layout="inline">
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-item label="企业名称">
                                {{myServiceFeeConfirmKaipiao.companyName}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="税号">
                                {{myServiceFeeConfirmKaipiao.bizNo}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="电话号码">
                                <a-input

                                        v-decorator="[
                                        'contractPhone',
                                        {
                                            validateTrigger:'blur',
                                            rules: [
                                                { required: true, message: '请输入电话号码' },
                                                { validator: this.validIdTel }
                                            ]
                                        },
                                        ]"
                                >
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="企业地址">
                                <a-textarea style="height:32px;"
                                        v-decorator="[
                                        'address',
                                        {
                                            validateTrigger:'blur',
                                            rules: [
                                                { required: true, message: '请输入企业地址' },
                                            ]
                                        },
                                        ]"
                                >
                                </a-textarea>
                            </a-form-item>
                        </a-col>

                        <a-col :span="12" class="row">
                            <a-form-item label="开户行">
                                <a-input
                                        v-decorator="[
                                        'subbranchName',
                                        {
                                            validateTrigger:'blur',
                                            rules: [
                                                { required: true, message: '请输入开户行' },
                                            ]
                                        },
                                        ]"
                                >
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="银行账号">
                                <a-input
                                        v-decorator="[
                                        'accountNo',
                                        {
                                            validateTrigger:'blur',
                                            rules: [
                                                { required: true, message: '请输入银行账号' },
                                            ]
                                        },
                                        ]"
                                >
                                </a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-modal
                    centered
                    title="服务费结算单"
                    :width="1000"
                    v-model="modalPdfIsShow"
                    :mask=true
                    :footer="null"
                    :maskClosable=false
                    class="modal-pdf"
            >

                <ConfirmMyServiceFeeDetail />
            </a-modal>
            <Dissent ref="dissent"></Dissent>
        </a-card>
        <div class="slDetailBottom">
             <a-row type="flex" justify="center" style="margin: 20px 0;">
                <a-space :size="30">
                    <a-button @click="$router.go(-1)">返回</a-button>
                        <a-button v-auth="['dgChain:serviceFee:serviceFee:confirm', 'steel:serviceFee:bill:confirm']" v-if="feeStatus=='WAIT_CONFIRM'" type="primary" @click="submitResult">确认</a-button>
                        <a-button v-if="feeStatus=='WAIT_CONFIRM'" type="primary" @click="openDissent">申请作废</a-button>
                        <a-button v-auth="['dgChain:serviceFee:serviceFee:seal', 'steel:serviceFee:bill:seal']" v-if="feeStatus=='WAIT_SIGN_SEAL'" type="primary" @click="modalConfirm">盖章</a-button>
                </a-space>
            </a-row>
        </div>
    </div>
</template>

<script>
    import {
        API_ServiceFeeStatementPreviewContract,
        API_FUWUFCOMFIRM,
    } from '@/v2/center/financeCenter/api/index';

    import {hasAuth} from '@/v2/utils/checkAuth.js'
    import ConfirmMyServiceFeeDetail from './ConfirmMyServiceFeeDetail'
    import { mapGetters } from 'vuex'
    import Dissent from './components/Dissent.vue'
    import { validIdTel } from 'untils/validForm.js'
    import Breadcrumb from "@/v2/components/breadcrumb/index";
    
    export default {
        name : "MyServiceFeeConfirm",
        data(){
            return{
                myServiceFeeConfirmForm:this.$form.createForm(this),
                myServiceFeeConfirmModel:{},
                myServiceFeeConfirmserviceFeeInfoModel:{},
                myServiceFeeConfirmKaipiao:{},
                myServiceFeeConfirmDataSource:[],
                validIdTel:validIdTel,
                feeStatus:'',
                ticketPdfUrl:'',
                modalPdfIsShow:false,
                rongzi:[
                    {
                        title: '融资起息日',
                        dataIndex: 'finBeginDate',
                    },
                    {
                        title: '融资到息日',
                        dataIndex: 'finEndDate',
                    },
                    {
                        title: '融资金额（元）',
                        dataIndex: 'finAmount',
                    },
                    {
                        title: '金融机构',
                        dataIndex: 'bankName',
                    },
                ],
                rongziInner:[
                    {
                        title: '序号',
                        customRender: (text, record, index) => `${index + 1}`
                    },
                    {
                        title: '还款日期',
                        dataIndex: 'repayDate',
                    },
                    {
                        title: '还款总额（元）',
                        dataIndex: 'repayAmount',
                    },
                    {
                        title: '还款本金（元）',
                        dataIndex: 'repayPrincipal',
                    },
                    {
                        title: '还款利息（元）',
                        dataIndex: 'repayInterest',
                    },
                ],

            }
        },
        components:{
            Dissent,
            ConfirmMyServiceFeeDetail,
            Breadcrumb
        },
        computed: {
            ...mapGetters('user', {
                VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
            })
        },
        mounted(){
            this.getDetail()
        },
        methods:{
            // 打开合同详情页
            openOrder(){
                let routerData = this.$router.resolve({
                    path: '/center/contract/'+this.orderType+'/online/detail',
                    query: {
                        id: this.orderId,
                        type: this.orderType.toUpperCase()
                    }
                })
                window.open(routerData.href, '_blank')
            },
            getDetail(){
                API_ServiceFeeStatementPreviewContract({serviceFeeId:this.$route.query.id}).then(res=>{

                    if(res.success){
                        this.feeStatus = res.data.status
                        this.orderId = res.data.orderId
                        this.orderType = (res.data.orderType||'').toLowerCase()
                        this.myServiceFeeConfirmModel = res.data.tradeInfo
                        this.myServiceFeeConfirmDataSource = res.data.tradeInfo.financing
                        this.myServiceFeeConfirmserviceFeeInfoModel = res.data.serviceFeeInfo
                        this.myServiceFeeConfirmKaipiao = res.data.invoiceInfo
                        this.myServiceFeeConfirmForm.setFieldsValue(this.myServiceFeeConfirmKaipiao)


                    }
                })
            },

            submitResult(){
                this.myServiceFeeConfirmForm.validateFields((err,values)=>{
                    if(!err){
                        const t = this;

                        if(!t.ifChangeInvoice()){
                            let obj = {
                                'serviceFeeId':t.$route.query.id,
                                'address' : values.address,
                                'bizNo' : t.myServiceFeeConfirmKaipiao.bizNo,
                                'companyName' : t.myServiceFeeConfirmKaipiao.companyName,
                                'subbranchName' : values.subbranchName,
                                'accountNo' : values.accountNo,
                                "contractPhone":values.contractPhone,
                            }
                            t.$confirm({
                                title: '请确认',
                                content: '是否将开票信息同步到企业开票信息中？',
                                okText: '确定',
                                cancelText: '取消',
                                onOk:()=> {
                                    API_FUWUFCOMFIRM({
                                        ...obj,
                                        'modified':true,
                                        'isSave': true
                                    }).then(res=>{
                                        if(res.success){
                                            this.modalConfirm()

                                        }
                                    })
                                },
                                onCancel() {
                                    API_FUWUFCOMFIRM({
                                        ...obj,
                                        'modified':true,
                                        'isSave': false
                                    }).then(res=>{
                                        if(res.success){
                                            this.modalConfirm()

                                        }
                                    })
                                }
                            });
                        }else{
                            API_FUWUFCOMFIRM({
                                'serviceFeeId':t.$route.query.id,
                                'address' : values.address,
                                'bizNo' : t.myServiceFeeConfirmKaipiao.bizNo,
                                'companyName' : t.myServiceFeeConfirmKaipiao.companyName,
                                'subbranchName' : values.subbranchName,
                                'accountNo' : values.accountNo,
                                "contractPhone":values.contractPhone,
                                'modified':false,
                                'isSave': true
                            }).then(res=>{
                                if(res.success){
                                    this.modalConfirm()

                                }
                            })
                        }
                    }
                })
            },
            ifChangeInvoice(){
                const newInvoiceObj = this.myServiceFeeConfirmForm.getFieldsValue([
                    'address',
                    'subbranchName',
                    'accountNo',
                    'contractPhone'
                ]);
                let {address,subbranchName,accountNo,contractPhone} = this.myServiceFeeConfirmKaipiao
                
                return JSON.stringify(newInvoiceObj) == JSON.stringify({address,subbranchName,accountNo,contractPhone});
            },

            modalConfirm(){
                if (!hasAuth('dgChain:serviceFee:serviceFee:seal') || !hasAuth('steel:serviceFee:bill:seal')){ // 签章权限
                    this.$confirm({
                        title: '提示',
                        content: '服务费结算单已确认，请联系签章员进行盖章',
                        okText: '确定',
                        cancelText: '取消',
                        onOk:()=> {
                            this.$router.push({
                                path: '/center/financeCenter/service/myServiceFee'
                            })
                        },
                        onCancel:()=> {
                            
                        }
                    });

                }else {

                    this.modalPdfIsShow = true;
                }
            },
            openDissent() {
                this.$refs.dissent.show()
            },
    


        }
    }
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less">
    .myServiceFeeConfirm{
        background-color:#f4f5f8;
        .rongzi-content,.kaipiao-content,.fw-content {
            background-color:#fff;
            margin-bottom: 10px;
        }

        .row{margin-bottom: 20px;}
        .title{
            font-size: 15px;
            padding:14px 0;
            margin-bottom: 30px;
            .title_icon{
                opacity:0;
                width:4px;
                height: 16px;
                display: inline-block;
                vertical-align: middle;
                background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
            }
        }
        .ant-form-item-control{
            input,textarea{
                width:254px;
            }
        }
        .textarea-wrap{
            textarea{
                width:720px;
                text-align: left!important;
            }
        }
        .ant-form-item-label{
            label{
                font-size: 14px;
                color: rgba(0,0,0,0.75);
                width:137px;
                margin-right: 15px;
                display: inline-block;
                text-align: right;
            }
        }
        .ant-form-item-with-help {
            margin-bottom: 0
        }
        .ant-form-item{ margin-bottom: 0; }
    }
    .serviceInvoiceModal{
        p{
            font-size: 16px;
            text-align: center;
        }
        .ant-modal-header,.ant-modal-footer{
            border:none;
        }
    }
    .serviceFeeInfo{border-bottom:1px solid #dfdfdf;margin:20px 0;}
    .serviceFeeInfo ul{width:100%;overflow: hidden;color:rgba(0, 0, 0, 0.65);}
    .serviceFeeInfo ul.tableHead{background:#f7f7f7;border-bottom:1px solid #dfdfdf;color:rgba(0, 0, 0, 0.85);}
    .serviceFeeInfo ul li{float:left;text-align:center;min-height: 54px;padding:16px;overflow-wrap:break-word;height:100%;}
    .serviceFeeInfo ul li:nth-child(1){width:10%;}
    .serviceFeeInfo ul li:nth-child(2){width:25%;}
    .serviceFeeInfo ul li:nth-child(3){width:20%;}
    .serviceFeeInfo ul li:nth-child(4){width:30%;}
    .serviceFeeInfo ul li:nth-child(5){width:15%;}
    .content-title {
        height: 56px;
        position: relative;
        margin-top: 0;
        padding: 0 24px;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0,0,0,0.85);
        font-weight: 500;
    }
    .slTitleAssis {
        margin-bottom: 20px;
    }
    .slMain{
        margin-bottom: -40px;
        .slDetailBottom {
            width: 100% ;
            min-width: 1186px;
            border-top: 1px solid #E5E6EB;
            box-sizing: border-box;
            position: sticky;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
    
</style>
