<template>
    <div id="oaPayDetail">
        <div class="title">
            <i class="title_icon"></i>付款信息
        </div>
        <a-form :form="oaPayForm" layout="inline">
            <a-row>
                <a-col :span=12 v-for="(item, index) in paymentData" :key="index" class="row">
        
                    <a-form-item
                            v-if="item.type == 'input'"
                            :label="item.label"
                            :colon=false
                    >
                        <a-input
                                :disabled="true"
                                v-model="info[item.value]"
            
                        />
                    </a-form-item>
                    <a-form-item v-if="status == 3 && item.type =='date'" :label="payType == '6' ? '应付账款到期日' : '付款日期'" :colon=false>
                        <a-date-picker :placeholder="payType == '6' ? '请输入应付账款到期日' : '请输入付款日期'"
                                       disabled
                                       v-decorator="['confirmTime']"
                        />
                    </a-form-item>
                    <a-form-item v-if="status != 3 && item.type =='date'" :label="payType == '6' ? '应付账款到期日' : '预计付款日期'" :colon=false>
                        <a-date-picker :placeholder="payType == '6' ? '请输入应付账款到期日' : '请输预计付款日期'"
                                       disabled
                                       v-decorator="['planPayDate']"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <template v-if="type == '预结算付款' && !isTrans">
            <div class="title">
                <i class="title_icon"></i>批次信息
            </div>
            <div class="table-wrap">
                <a-table
                        rowKey="batchNo"
                        :columns="goodsColumns"
                        :dataSource="goodsData"
                        :pagination=false
                        :defaultExpandAllRows="true"
                        :locale="{emptyText: '暂无数据'}"
                >
                    <div slot="hzzm" class="table-operation" slot-scope="record">
                        <FileList
                            :record="record"
                        />
                     </div>
                    <div slot="yspz" class="table-operation" slot-scope="record">
                        <FileList
                                :record="record"
                        />
                     </div>

                    <a-table
                            slot="expandedRowRender"
                            slot-scope="record"
                            :columns="innerColumns"
                            :data-source="record.receiveRecordInfoList"
                            rowKey="receiveNo"
                            :pagination="false"
                    >
                        <div slot="czpz" class="table-operation" slot-scope="record">
                            <FileList
                                    :record="record"
                            />
                        </div>
                        <div slot="hzzm" class="table-operation" slot-scope="record">
                            <FileList
                                    :record="record"
                            />
                        </div>
                        <div slot="hypz" class="table-operation" slot-scope="record">
                            <FileList
                                    :record="record"
                            />
                        </div>
                    </a-table>

                </a-table>
            </div>
        </template>
        <template v-if="type == '结算付款'">
            <div class="title">
                <i class="title_icon"></i>结算单列表
            </div>
            <div class="table-wrap">
                <a-table :dataSource="settleDataSource" :rowKey="(tex, index) => index" :columns="settleColumns" :pagination="false" :locale="{emptyText: '暂无数据'}">
                    <span slot="settleFile" class="table-operation" slot-scope="record">

                          <FileList
                                  :record="record"
                          />
                     </span>
                </a-table>
            </div>
        </template>
        <template v-if="hasInvoice == '是'">
            <template v-if="invoiceDataSourceUp.length">
                <div class="title">
                    <i class="title_icon"></i>{{isTrans ? '发票信息' : '进项发票信息（上游）'}}
                </div>
                <div class="table-wrap">
                    <a-table :dataSource="invoiceDataSourceUp" rowKey="invoiceNo" :columns="invoiceColumns" :pagination="false" :locale="{emptyText: '暂无数据'}">
                        <span slot="invoiceFile" class="table-operation" slot-scope="record">
                            <FileList
                                    :record="record"
                            />
                        </span>
                    </a-table>
                </div>
            </template>
            <template v-if="invoiceDataSourceDown.length">
                <div class="title">
                    <i class="title_icon"></i>销项发票信息（下游）
                </div>
                <div class="table-wrap">
                    <a-table :dataSource="invoiceDataSourceDown" rowKey="invoiceNo" :columns="invoiceColumns" :pagination="false" :locale="{emptyText: '暂无数据'}">
                        <span slot="invoiceFile" class="table-operation" slot-scope="record">
                            <FileList
                                    :record="record"
                            />
                        </span>
                    </a-table>
                </div>
            </template>
        </template>
        <template v-if="taxDataSource.length && !isTrans">
            <div class="title">
                <i class="title_icon"></i>税务信息
            </div>
            <div class="table-wrap">
                <a-table
                    rowKey="id"
                    :scroll="{ x: true }"
                    :columns="taxColumns"
                    :dataSource="taxDataSource"
                    :pagination="false"
                >
                    <span slot="action" slot-scope="text, record">
                        <a-space>
                            <a @click="goDetail('view', record)">查看</a>
                            <a @click="goDetail('down', record)">下载</a>
                        </a-space>
                    </span>
                </a-table>
            </div>
        </template>


        <div class="title">
            <i class="title_icon"></i>付款凭证
        </div>
        <PaymentPreview :fileDataSource="fileDataSource"></PaymentPreview>
        <image-viewer ref="imageViewer" />
    </div>
</template>

<script>
    /**
   * OA使用路径为"OaPayDetail?serialNo=资金流水号"
   */
    import moment from 'moment';
    import { API_GetOaPayDetail } from 'api';
    import FileList from './components/FileList'
    import PaymentPreview from "./components/PaymentPreview"
    import imageViewer from "@/v2/components/imageViewer.vue";

    import { API_GETCURRENTENV, API_getCommonDownload } from "@/api/index.js";
    import comDownload from '@sub/utils/comDownload.js';
    import { filePreview } from "@/v2/utils/file";
    import {
        filterCodeByValueName
    } from '@sub/utils/globalCode.js'
    export default {
        name : "OaPayDetail",
        mounted(){
            this.$nextTick(()=>{
                document.getElementsByClassName('searchDeliverTrain')[0].style.display="none" // 查询轨迹按钮不展示
            })
            this.getDetail();
        },
        components: {
            FileList,
            PaymentPreview,
            imageViewer
        },
        data(){
            return{
                payType: '', // 资金来源
                status: '', //付款状态
                oaPayForm:this.$form.createForm(this),
                taxDataSource: [],
                taxColumns: [
                    {
                        title: "类型",
                        align: "center",
                        dataIndex: "fileType",
                    },
                    {
                        title: "文件名",
                        align: "center",
                        dataIndex: "fileName",
                    },
                    {
                        title: "纳税所属期间",
                        align: "center",
                        dataIndex: "taxPeriodStart",
                        customRender: (r, o) => r + "~" + o.taxPeriodEnd,
                    },
                    {
                        title: "实缴（退）金额（元）",
                        align: "center",
                        dataIndex: "amount",
                    },
                    {
                        title: "操作",
                        dataIndex: "action",
                        align: "center",
                        width: 200,
                        fixed: "right",
                        scopedSlots: { customRender: "action" },
                    },
                ],
                paymentData:[
                    {
                        type:'input',
                        label:'付款类型',
                        value:'type'
                    },
                    {
                        type:'input',
                        label:'是否有票',
                        value:'hasInvoice'
                    },
                    {
                        type:'input',
                        label:'付款方式',
                        value:'methodName'
                    },
                    {
                        type:'input',
                        label:'收款方',
                        value:'sellerName'
                    },
                    {
                        type:'input',
                        label:'收款账号',
                        value:'receiveAccNo'
                    },
                    {
                        type:'input',
                        label:'收款账户名称',
                        value:'receiveAccName'
                    },
                    {
                        type:'input',
                        label:'付款金额(元)',
                        value:'payAmount'
                    },
                    {
                        type:'input',
                        label:'应付账款金额(元)',
                        value:'goodsValue'
                    },
                    {
                        type:'input',
                        label:'资金来源',
                        value:'payTypeName'
                    },
                    {
                        type:'date',
                        label:'付款日期',
                        value:'confirmTime'
                    },
                    {
                        type:'input',
                        label:'累计发货量(吨)',
                        value:'allDeliverQuantity'
                    },
                    {
                        type:'input',
                        label:'累计收货量(吨)',
                        value:'allReceiveQuantity'
                    },
                    {
                        type:'input',
                        label:'累计货转量(吨)',
                        value:'allGoodsTransferQuantity'
                    }
                ],
                type:'',
                hasInvoice:'',
                goodsData:[],
                goodsColumns:[
                    {
                        title: '批次号',
                        dataIndex: 'batchNo',
                        width:'100px'
                    },
                    {
                        title: '运输方式',
                        dataIndex: 'transTypeDesc',
                        width:'100px'
                    },
                    {
                        title: '发货日期',
                        dataIndex: 'deliverDate',
                        width:'120px'
                    },
                    {
                        title: '发货数量(吨)',
                        dataIndex: 'deliverQuantity',
                        width:'120px'
                    },
                    {
                        title: '货转证明',
                        scopedSlots: { customRender: 'hzzm' },
                        dataIndex:'hqzyzmPdfUrl',
                        width:'150px'
                    },
                    {
                        title: '运输凭证',
                        scopedSlots: { customRender: 'yspz' },
                        dataIndex:'yspzUrl',
                    }
                ],
                innerColumns:[
                    {
                        title:'收货编号',
                        dataIndex: 'receiveNo',
                        width:'100px'
                    },
                    {
                        title: '',
                        dataIndex: 'a1',
                        width:'100px'
                    },
                    {
                        title:'收货日期',
                        dataIndex: 'recentReceiveDate',
                        width:'120px'
                    },
                    {
                        title:'收货数量(吨)',
                        dataIndex: 'receiveQuantity',
                        width:'120px'
                    },
                    {
                        title: '货转证明',
                        scopedSlots: { customRender: 'hzzm' },
                        dataIndex:'hqzyzmPdfUrl',
                        width:'150px'
                    },
                    {
                        title: '称重凭证',
                        scopedSlots: { customRender: 'czpz' },
                        dataIndex:'czpzUrl',
                    },
                    {
                        title: '化验凭证',
                        scopedSlots: { customRender: 'hypz' },
                        dataIndex:'hypzUrl',
                    }
                ],
                settleColumns:[
                    {
                        title:'结算单编号',
                        dataIndex: 'statementNo',
                        width:190
                    },
                    {
                        title:'结算数量',
                        dataIndex: 'settleQuantity',
                    },
                    {
                        title:'结算单价',
                        dataIndex: 'settleUnitPrice',
                    },
                    {
                        title:'结算金额',
                        dataIndex: 'settleTotalAmount',
                    },
                    {
                        title:'附件',
                        scopedSlots: { customRender: 'settleFile' },
                        dataIndex: 'ticketPdfUrl',
                    },
                ],
                settleDataSource:[],
                invoiceDataSourceDown:[],
                invoiceDataSourceUp:[],
                invoiceColumns:[
                    {
                        title: '发票号码',
                        dataIndex: 'invoiceNo',
                    },
                    {
                        title: '数量',
                        dataIndex: 'totalQuantity',
                    },
                    {
                        title: '价税合计',
                        dataIndex: 'totalAmount',
                    },
                    {
                        title: '开票日期',
                        dataIndex: 'issuedDate',
                    },

                    {
                        title:'发票附件',
                        scopedSlots: { customRender: 'invoiceFile' },
                        dataIndex: 'attachment',
                    },
                ],
                fileDataSource:[],
                isTrans: false,
                info: {}
            }
        },
        watch:{
            type(data){
                // 付款类型对应不同
                if(this.isTrans) return
                if(data == '预结算付款'){
                    this.paymentData.push(
                        {
                            type:'input',
                            label:'本次发货量(吨)',
                            value:'totalDeliverQuantity'
                        },
                        {
                            type:'input',
                            label:'本次收货量(吨)',
                            value:'totalReceiveQuantity'
                        },
                        {
                            type:'input',
                            label:'本次货转量(吨)',
                            value:'totalGoodsTransferQuantity'
                        }
                    )
                }else if(data == '结算付款'){
                    this.paymentData.push(
                        {
                            type:'input',
                            label:'结算总数量(吨)',
                            value:'totalSettleQuantity'
                        },
                        {
                            type:'input',
                            label:'结算总金额(元)',
                            value:'totalSettleTotalAmount'
                        }
                    )
                }
            },
            hasInvoice(data){
                if(this.isTrans) return
                if(data == '是'){
                    this.paymentData.push(
                        {
                            type:'input',
                            label:'发票金额(元)',
                            value:'totalAmount'
                        },
                    )
                }
            }
        },
        methods:{
            moment,
            getDetail(){
                API_GetOaPayDetail(this.$route.query.serialNo).then(res=>{
                    if(res.success){
                        this.info = res.data
                        this.payType = res.data.payType
                        this.status = res.data.status
                        this.sellerUscc = res.data.sellerUscc
                        this.taxDataSource = res.data.companyTaxNewDTOList||[]
                        // 判断当前是否是 运输合同
                        this.isTrans = res.data.contractSource == 'LOGISTICS_CONTRACT_MANUAL'
                        if(this.isTrans) {
                            this.paymentData = [
                                    {
                                        type:'input',
                                        label:'付款类型',
                                        value:'type'
                                    },
                                    {
                                        type:'input',
                                        label:'是否有票',
                                        value:'hasInvoice'
                                    },
                                    {
                                        type:'input',
                                        label:'付款方式',
                                        value:'methodName'
                                    },
                                    {
                                        type:'input',
                                        label:'收款方',
                                        value:'sellerName'
                                    },
                                    {
                                        type:'input',
                                        label:'收款账号',
                                        value:'receiveAccNo'
                                    },
                                    {
                                        type:'input',
                                        label:'收款方银行',
                                        value:'receiveAccBank'
                                    },
                                    {
                                        type:'input',
                                        label:'收款账户名称',
                                        value:'receiveAccName'
                                    },
                                    {
                                        type:'input',
                                        label:'资金来源',
                                        value:'payTypeName'
                                    },
                                    {
                                        type:'date',
                                        label:'付款日期',
                                        value:'confirmTime'
                                    },
                                    {
                                        type:'input',
                                        label:'付款金额(元)',
                                        value:'payAmount'
                                    },
                                    {
                                        type:'input',
                                        label:'备注',
                                        value:'comments'
                                    },
                                    
                            ]
                            this.settleColumns = [
                                {
                                    title:'结算单编号',
                                    dataIndex: 'statementNo',
                                    width:190
                                },
                                {
                                    title:'结算数量',
                                    dataIndex: 'settleQuantity',
                                },
                                {
                                    title:'结算单价',
                                    dataIndex: 'settleUnitPrice',
                                },
                                {
                                    title:'结算金额',
                                    dataIndex: 'settleTotalAmount',
                                },
                            ]
                        }
                        this.$nextTick(function(){
                            let that = this
                             that.setFieldValue(res.data)
                            this.$nextTick(() => {
                                that.setFieldValue(res.data)
                            })
                        })
                    }
                })
            },
            goDetail(type, record) {
                if (type == "view") {
                    //判断文件是否为图片
                    let url = record?.filePath;
                    let ext = url.substr(url.lastIndexOf(".") + 1);
                    let zip = ["zip", "rar"].indexOf(ext.toLowerCase()) !== -1;
                    if (zip) {
                        API_getCommonDownload(record?.filePath).then((res) => {
                            comDownload(res, null, record?.fileName);
                        });
                    } else {
                        filePreview(
                            API_GETCURRENTENV(url),
                            this.$refs.imageViewer.show
                        );
                    }
                } else {
                    API_getCommonDownload(record?.filePath).then((res) => {
                        comDownload(res, null, record?.fileName);
                    });
                }
            },

            setFieldValue(result){
                this.type = result.type;
                this.hasInvoice = result.hasInvoice;
                this.oaPayForm.setFieldsValue({
                    type:result.type,
                    hasInvoice:result.hasInvoice,
                    methodName: result.methodName,
                    sellerName: result.sellerName,
                    receiveAccount: result.receiveAccount,
                    receiveAccName: result.receiveAccName,
                    payAmount:result.payAmount,
                    goodsValue:result.goodsValue == 0 ? '-' : result.goodsValue,
                    payTypeName: result.payTypeName,
                    
                    allDeliverQuantity:result.allDeliverQuantity,
                    allReceiveQuantity:result.allReceiveQuantity,
                    allGoodsTransferQuantity:result.allGoodsTransferQuantity
                })
                // 状态不同，对应付款日期字段不同
                if(this.status == 3){
                    this.oaPayForm.setFieldsValue({
                        "confirmTime":result.confirmTime ? moment(result.confirmTime) : null,
                    });
                    this.payDate = result.confirmTime
                }else{
                    this.oaPayForm.setFieldsValue({
                        "planPayDate":result.planPayDate ? moment(result.planPayDate) : null,
                    });
                    this.payDate = result.planPayDate
                }
                if(result.type == '结算付款'){
                    this.$nextTick(()=>{
                        this.oaPayForm.setFieldsValue({
                            totalSettleQuantity:result.totalSettleQuantity,
                            totalSettleTotalAmount:result.totalSettleTotalAmount
                        })
                    });
                    this.settleDataSource = result.oaStatementList
                }
                if(result.type == '预结算付款'){
                    this.$nextTick(()=>{
                        this.oaPayForm.setFieldsValue({
                            totalDeliverQuantity:result.totalDeliverQuantity,
                            totalReceiveQuantity:result.totalReceiveQuantity,
                            totalGoodsTransferQuantity:result.totalGoodsTransferQuantity,
                        })
                    })
                    this.goodsData = result.oaDeliverBatchList
                }
                if(result.hasInvoice == '是'){
                    this.$nextTick(()=>{
                        this.oaPayForm.setFieldsValue({
                            totalAmount:result.totalAmount,
                        })
                        this.invoiceDataSourceUp = result.upOAInvoiceList||[]
                        this.invoiceDataSourceDown = result.downOAInvoiceList||[]
                    })
                }
                // 附件
                this.fileDataSource = result.fileList;
            },

        }
    }
</script>

<style lang="less">
    ::-webkit-scrollbar{width:9px;height:9px;}
    #fileModal .ant-modal-close{top:10px;right:10px;z-index:1000;}
    #fileModal .ant-modal-close .ant-modal-close-x i{font-size: 24px;}
    #oaPayDetail{
        width:993px;
        margin: 30px auto;
        border:1px solid #ddd;
        padding:30px;
        .mainTitle{
            margin-bottom: 30px;
            text-align: center;
        }
        .table-wrap{
            margin-bottom: 30px;
            table{
                table-layout: fixed;
                td{
                    word-break: break-all;
                }
            }
            .ant-table-body{
                overflow: auto;
            }
        }
        .title{
            border-bottom:1px solid #D8D8D8;
            font-size: 18px;
            padding:14px 0;
            margin-bottom: 30px;
            .title_icon{
                width:12px;
                height: 16px;
                display: inline-block;
                vertical-align: middle;
                margin:0 14px;
                background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
            }
        }
        .row{margin-bottom: 14px;padding-left: 40px;}
        .ant-form-item-label{
            label{
                font-size: 16px;
                color: rgba(0,0,0,0.75);
                width:88px;
                margin-right: 46px;
                display: inline-block;
                text-align: left;

            }
        }
        .ant-form-item-control{
            input{
                width:240px;
            }
            .ant-select{
                width:240px;
            }
        }
    }
</style>
