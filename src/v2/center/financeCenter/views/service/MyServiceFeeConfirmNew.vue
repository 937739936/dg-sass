<template>
    <div class="slMain myServiceFeeConfirm">
        <Breadcrumb/>
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span class="slTitle">服务费结算单确认</span>
                <div class="content-title">
                    <div v-if="feeStatus=='已确认'" class="fee-status" style="color:green;">服务费结算单状态：已确认</div>
                    <div v-if="feeStatus=='待确认'" class="fee-status" style="color:#ff9d35;">服务费结算单状态：待确认</div>
                    <div v-if="feeStatus=='待签约'" class="fee-status" style="color:#ff9d35;">服务费结算单状态：待签约</div>
                </div>
            </div>
            <div class="myServiceFeeConfirmForm">
                <div class="slTitleAssis">服务费流水明细</div>
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="myServiceFeeFlowDetail" :scroll="{x:true}" rowKey="id">
                    <template slot="orderNo" slot-scope="orderNo, item">
                        <a @click="openOrder(item)">{{orderNo}}</a>
                    </template>
                    <!-- 金额格式转化 1000=1,000.00 -->
                    <template slot="serviceFeeAmount" slot-scope="serviceFeeAmount, item">
                        <span v-if="serviceFeeAmount">{{serviceFeeAmount|formatMoney(2)}}</span>
                        <span v-else>{{serviceFeeAmount}}</span>
                    </template>
                    <template slot="finAmount" slot-scope="finAmount, item">
                        <span v-if="finAmount">{{finAmount|formatMoney(2)}}</span>
                        <span v-else>{{finAmount}}</span>
                    </template>
                    <template slot="repayAmount" slot-scope="repayAmount, item">
                        <span v-if="repayAmount">{{repayAmount|formatMoney(2)}}</span>
                        <span v-else>{{repayAmount}}</span>
                    </template>
                    <template slot="repayPrincipal" slot-scope="repayPrincipal, item">
                        <span v-if="repayPrincipal">{{repayPrincipal|formatMoney(2)}}</span>
                        <span v-else>{{repayPrincipal}}</span>
                    </template>
                    <template slot="repayInterest" slot-scope="repayInterest, item">
                        <span v-if="repayInterest">{{repayInterest|formatMoney(2)}}</span>
                        <span v-else>{{repayInterest}}</span>
                    </template>
                </a-table>
            </div>
            <div class="fw-content">
                <div class="slTitleAssis">服务费信息</div>
                <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18}">
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务费结算单号">
                                {{myServiceFeeConfirmserviceFeeInfoModel.serialNo}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="服务费结算日期">
                                {{myServiceFeeConfirmserviceFeeInfoModel.creatDate}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-item label="付款方">
                                {{myServiceFeeConfirmserviceFeeInfoModel.payerName}}
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
                    </a-row>
                    <a-row>
                        <a-col :span="12" class="row" style="padding-left:10px;">
                            <a-form-item label="服务费金额（元）">
                                <span style="color:#f45655;font-size:18px;" v-if="myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount">
                                    {{myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount|formatMoney(2)}}元</span>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-item label="备注">
                                {{myServiceFeeConfirmserviceFeeInfoModel.remarks}}
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="kaipiao-content">
                <div class="slTitleAssis">开票信息<span style="color:rgb(244, 86, 85);">（请仔细核对开票信息是否有误，平台将以此信息进行开票）</span></div>
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
            <!-- <div class="address-content">
                <div class="slTitleAssis">收件地址<span style="color:rgb(244, 86, 85);">（请仔细核对发票接收地址是否有误，平台将以此信息邮寄发票）</span></div>
                <a-form-model
                    layout="inline"
                    ref="ruleForm"
                    :model="addressForm"
                    :rules="rules"
                >
                    <a-row>
                        <a-col :span="12" class="row">
                            <a-form-model-item label="收件人" ref="name" prop="name">
                                <a-input v-model= "addressForm.name"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12" class="row">
                            <a-form-model-item label="手机号" ref="phone" prop="phone">
                                <a-input v-model = "addressForm.phone" :maxLength="11"></a-input>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="24" class="row">
                            <a-form-model-item label="收件地址" ref="area" prop="area">
                                <a-cascader
                                    v-model = "addressForm.area"
                                    :options="area"
                                    placeholder="请选择地区"
                                />
                            </a-form-model-item>
                            <a-form-model-item ref="address" prop="address">
                                <a-input v-model = "addressForm.address" placeholder="详细地址" />
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </a-form-model>
            </div> -->
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

                <ConfirmMyServiceFeeDetail type="new"/>
            </a-modal>
            <Dissent ref="dissent"></Dissent>
        </a-card>
        <div class="slDetailBottom">
             <a-row type="flex" justify="center" style="margin: 20px 0;">
                <a-space :size="30">
                    <a-button @click="$router.go(-1)">返回</a-button>
                    <a-button v-auth="'financialCenter:serviceFee:serviceFeeStatement:confirm'" v-if="feeStatus=='待确认'" type="primary" @click="submitResult">确认</a-button>
                    <a-button v-if="feeStatus=='待确认'" type="primary" @click="openDissent">申请作废</a-button>
                    <a-button v-auth="'financialCenter:serviceFee:serviceFeeStatement:seal'" v-if="feeStatus=='待签约'" type="primary" @click="modalConfirm">盖章</a-button>
                </a-space>
            </a-row>
        </div>
    </div>
</template>

<script>
    import { area } from '@sub/utils/area.js'
    import { API_FUWUFCOMFIRMNEW, API_ServiceFeeDetailNew } from '@/v2/center/financeCenter/api/index';
    import {hasAuth} from '@/v2/utils/checkAuth.js'
    import ConfirmMyServiceFeeDetail from './ConfirmMyServiceFeeDetail'
    import { mapGetters } from 'vuex'
    import { validIdTel } from 'untils/validForm.js'
    import Dissent from './components/Dissent.vue'
    import Breadcrumb from "@/v2/components/breadcrumb/index";
    export default {
        name : "MyServiceFeeConfirm",
        data(){
            let validAddressPhone =  (rule, value, callback) => {
                var isMobilePhone = /1[0-9][0-9]{9}$/
                if(value!=''){
                    if(isMobilePhone.test(value)){
                        callback()
                    }else{
                        callback('手机号格式不正确')
                    }
                }else{
                    callback()
                }
            };
            return{
                myServiceFeeConfirmForm:this.$form.createForm(this),
                myServiceFeeConfirmserviceFeeInfoModel:{},
                myServiceFeeConfirmKaipiao:{},
                validIdTel:validIdTel,
                feeStatus:'',
                ticketPdfUrl:'',
                modalPdfIsShow:false,
                myServiceFeeFlowDetail:[], //流水明细
                columns: [
                    { title: '服务费流水编号', dataIndex: 'serialNo', key: 'serialNo',width:150},
                    { title: '生成时间', dataIndex: 'createTime', key: 'createTime',width:150},
                    { title: '服务费金额', dataIndex: 'serviceFeeAmount', key: 'serviceFeeAmount', scopedSlots: { customRender: 'serviceFeeAmount' },width:150},
                    { title: '付款方', dataIndex: 'payerName', key: 'payerName',width:150},
                    { title: '金融机构', dataIndex: 'bankName', key: 'bankName' ,width:150},
                    { title: '服务费率', dataIndex: 'serviceFeeRate', key: 'serviceFeeRate',width:120},
                    { title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate',width:120},
                    { title: '融资到期日', dataIndex: 'endDate', key: 'endDate',width:120},
                    { title: '融资金额', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' },width:150},
                    { title: '还款日期', dataIndex: 'repayDate', key: 'repayDate',width:120},
                    { title: '还款总额', dataIndex: 'repayAmount', key: 'repayAmount', scopedSlots: { customRender: 'repayAmount' },width:150},
                    { title: '还款本金', dataIndex: 'repayPrincipal', key: 'repayPrincipal',scopedSlots: { customRender: 'repayPrincipal' },width:150},
                    { title: '还款利息', dataIndex: 'repayInterest', key: 'repayInterest',scopedSlots: { customRender: 'repayInterest' },width:150},
                    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo',scopedSlots: { customRender: 'orderNo' },width:180},
                    { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo',width:180},
                    { title: '服务费协议编号', dataIndex: 'serviceFeeAgreementNo', key: 'serviceFeeAgreementNo',width:180},
                    { title: '应收账款流水号', dataIndex: 'receivableNo', key: 'receivableNo',width:180},
                    { title: '预付流水号', dataIndex: 'prePaymentAssetNo', key: 'prePaymentAssetNo',width:180},
                    { title: '票据号', dataIndex: 'assetBillNo', key: 'assetBillNo',width:180},
                ], //流水明细表格字段
                area:area,
                rules: {
                    name: [
                        { required: true, message: '请输入收件人', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: validAddressPhone, trigger: 'blur'}
                    ],
                    area: [
                        { required: true, message: '请选择地区', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入详细地址', trigger: 'blur' },
                    ]
                },
                addressForm: {  // 收件地址
                    name: '',
                    phone: '',
                    area: [],
                    address: '',
                },
                personalReceiveAddress:'' //收件人信息
            }
        },
        components:{
            ConfirmMyServiceFeeDetail,
            Dissent,
            Breadcrumb
        },
        computed: {
            ...mapGetters('user', {
                VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
            }),
            isLogisticsCompany() {
                return this.VUEX_ST_COMPANYSUER.company.companyType == 'LOGISTICS';
            }
        },
        mounted(){
            if(this.isLogisticsCompany) {
                this.columns.splice(5, 0, { title: '下游结算数量', dataIndex: 'downStatementQuantity', key: 'downStatementQuantity',width:150}, { title: '每吨费用', dataIndex: 'cost', key: 'cost',width:150});
            }
            this.getDetail()
        },
        methods:{
            // 打开合同详情页
            openOrder(item){
                let routerData = this.$router.resolve({
                    path: '/center/contract/'+item.orderType+'/online/detail',
                    query: {
                        id: item.orderId,
                        type: item.orderType.toUpperCase()
                    }
                })
                window.open(routerData.href, '_blank')
            },
            getDetail(){
                API_ServiceFeeDetailNew({id:this.$route.query.id}).then(res=>{
                    if(res.success){
                        this.feeStatus = res.data.statusText
                        this.myServiceFeeConfirmserviceFeeInfoModel = res.data.serviceFeeInfo
                        this.myServiceFeeConfirmKaipiao = res.data.invoiceInfo
                        this.myServiceFeeConfirmForm.setFieldsValue(this.myServiceFeeConfirmKaipiao)
                        if (res.data.personalReceiveAddress.area) {
                            if (res.data.personalReceiveAddress.area.indexOf(',') > -1) {
                                res.data.personalReceiveAddress.area = res.data.personalReceiveAddress.area ? res.data.personalReceiveAddress.area.split(',') : null
                            } else if (res.data.personalReceiveAddress.area.indexOf('/') > -1) {
                                res.data.personalReceiveAddress.area = res.data.personalReceiveAddress.area ? res.data.personalReceiveAddress.area.split('/') : null
                            } else {
                                res.data.personalReceiveAddress.area =  null
                            }
                        }
                        this.personalReceiveAddress = Object.assign({},res.data.personalReceiveAddress)
                        this.addressForm = res.data.personalReceiveAddress //收件地址
                        this.myServiceFeeFlowDetail = res.data.billList //流水明细
                    }
                })
            },

            submitResult(){
                this.myServiceFeeConfirmForm.validateFields((err,values)=>{
                    if(!err){
                        const t = this;
                        let obj = {
                            'id':t.$route.query.id,
                            'invoiceAddress' : values.address,
                            'bizNo' : t.myServiceFeeConfirmKaipiao.bizNo,
                            'companyName' : t.myServiceFeeConfirmKaipiao.companyName,
                            'subbranchName' : values.subbranchName,
                            'accountNo' : values.accountNo,
                            "contactPhone":values.contractPhone,
                            "receiveModified":t.ifChangeReceiver(),
                        }
                        if(t.ifChangeInvoice()){
                            t.$confirm({
                                title: '请确认',
                                content: '是否将开票信息同步到企业开票信息中？',
                                okText: '确定',
                                cancelText: '取消',
                                onOk:()=> {
                                    API_FUWUFCOMFIRMNEW({
                                        ...obj,
                                        'invoiceModified':true,
                                        'invoiceIsSave': true
                                    }).then(res=>{
                                        if(res.success){
                                            this.modalConfirm()

                                        }
                                    })
                                },
                                onCancel: () => {
                                    API_FUWUFCOMFIRMNEW({
                                        ...obj,
                                        'invoiceModified':true,
                                        'invoiceIsSave': false
                                    }).then(res=>{
                                        if(res.success){
                                            this.modalConfirm()

                                        }
                                    })
                                }
                            });
                        }else{
                            API_FUWUFCOMFIRMNEW({
                                ...obj,
                                'invoiceModified':false,
                                'invoiceIsSave': true
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
                
                return JSON.stringify(newInvoiceObj) != JSON.stringify({address,subbranchName,accountNo,contractPhone});
            },
            ifChangeReceiver(){ // 收件人信息是否改变
                const newReceiverObj = Object.assign({},this.addressForm)
                let {name,phone,area,address} = this.personalReceiveAddress
                return JSON.stringify(newReceiverObj) != JSON.stringify({name,phone,area,address});
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
        .rongzi-content,.kaipiao-content,.fw-content,.address-content {
            background-color:#fff;
            margin-bottom: 10px;
        }
        .rongzi-content{
            padding: 20px 0;
        }

        .row{line-height: 60px;}
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
    .ant-table td{ white-space: nowrap; }
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
