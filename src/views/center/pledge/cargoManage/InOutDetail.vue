<template>
    <div class="s-card" v-if="detailData">
        <div style="margin: -10px -20px -20px -20px;background: #f4f5f8;" class="inout-content">
            <div class="top-box" style="background:#fff;">
                <div class="s-card-title">
                    <span>{{ pageTypeText }}详情</span>
                    <a href="javascript:;"  @click="jumpPage" class="backbtn">返回</a>
                </div>
                <div class="divider"></div>
                <div class="s-card-content" style="margin-top:0">
                    <a-descriptions>
                        <a-descriptions-item label="货主名称">{{ detailData.goodsCompanyName }}</a-descriptions-item>
                        <a-descriptions-item label="仓库名称">{{ detailData.storageName }}</a-descriptions-item>
                        <a-descriptions-item label="仓储企业">{{ detailData.storageCompanyName }}</a-descriptions-item>
                        <a-descriptions-item label="货物名称">{{ detailData.goodsName }}</a-descriptions-item>
                        <a-descriptions-item label="存货点">{{ detailData.inventoryPoint }}</a-descriptions-item>
                        <a-descriptions-item label="方向">{{ detailData.direction }}</a-descriptions-item>
                        <a-descriptions-item :label="`${pageTypeText}单号`">{{ detailData.number }}</a-descriptions-item>
                        <a-descriptions-item :label="`${pageTypeText}日期`">{{ detailData.inoutDate }}</a-descriptions-item>
                        <a-descriptions-item label="数量">{{ detailData.quantity }}</a-descriptions-item>
                        <a-descriptions-item :label="`${pageTypeText}热值`">{{ detailData.heatValue }} </a-descriptions-item>
                        <a-descriptions-item label="运输方式">{{ detailData.transportModeDesc }}</a-descriptions-item>
                        <a-descriptions-item label="添加人">{{ detailData.createdName }}</a-descriptions-item>
                        <a-descriptions-item label="添加时间">{{ detailData.createdDate }}</a-descriptions-item>
                        <a-descriptions-item label="仓单编号">{{ detailData.serialNo }}</a-descriptions-item>
                      </a-descriptions>
                    <!-- <a-row class="row" :gutter="40" v-if="detailData.receivalVO">
                        <a-col span="8">
                            <a-row :gutter="20">
                                <a-col span="9">应收账款流水号</a-col>
                                <a-col span="15" class="overflow">
                                    <a-tooltip>
                                        <template slot="title">{{detailData.receivalVO.serialNo}}</template>
                                        <span>{{detailData.receivalVO.serialNo}}</span>
                                    </a-tooltip>
                                </a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">卖方名称</a-col>
                                <a-col span="15" class="overflow">
                                    <a-tooltip>
                                        <template slot="title">{{detailData.receivalVO.sellerName}}</template>
                                        <span>{{detailData.receivalVO.sellerName}}</span>
                                    </a-tooltip>
                                </a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">买方名称</a-col>
                                <a-col span="15" class="overflow">
                                    <a-tooltip>
                                        <template slot="title">{{detailData.receivalVO.buyerName}}</template>
                                        <span>{{detailData.receivalVO.buyerName}}</span>
                                    </a-tooltip>
                                </a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">状态</a-col>
                                <a-col span="15">
                                    <span>{{filterCodeByValueName(detailData.receivalVO.status,'receivableStatusDict')}}</span>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col span="8">
                            <a-row :gutter="20">
                                <a-col span="9">应收账款类型</a-col>
                                <a-col span="15">
                                    <span v-if="detailData.receivalVO.type == 'PROOF'">凭证结算</span>
                                    <span v-if="detailData.receivalVO.type == 'INVOICE'">发票结算</span>
                                </a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">应收账款金额</a-col>
                                <a-col span="15"><span class="red">{{detailData.receivalVO.amount}}</span>&nbsp;元</a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">应收账款起始日期</a-col>
                                <a-col span="15">{{detailData.receivalVO.beginDate}}</a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">应收账款到期日期</a-col>
                                <a-col span="15">{{detailData.receivalVO.endDate}}</a-col>
                            </a-row>
                        </a-col>
                        <a-col span="8">
                            <a-row :gutter="20">
                                <a-col span="9">金融机构</a-col>
                                <a-col span="15">{{detailData.receivalVO.bankName}}</a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">拟融资金额</a-col>
                                <a-col span="15"><span class="red">{{detailData.receivalVO.planFinancingAmount}}</span>&nbsp;元</a-col>
                            </a-row>
                            <a-row :gutter="20">
                                <a-col span="9">应收账款申请日期</a-col>
                                <a-col span="15">{{detailData.receivalVO.requestTime}}</a-col>
                            </a-row>
                        </a-col>
                    </a-row> -->
                </div>
            </div>
            <div class="s-card-content" style="padding-bottom: 30px;">
                <!-- <div style="text-align:right;margin-bottom:10px;"><a-button type="primary" @click="downloadAll">一键下载所有文档</a-button></div> -->
                <a-row :gutter="40">
                    <a-col span="4">
                        <div class="tabs-bar">
                            <div @click="tabChange(0)" v-if="pageType === 'in'">
                                <div class="tabs-icon">
                                    <img src="@/assets/imgs/monitoring/contract.png" alt="">
                                    <em></em>
                                </div>
                                <div class="tabs-text">
                                    <p :class="activeIndex == 0 ? 'blue': ''">采购合同</p>
                                </div>
                                <i :class="judgeColor(0)"></i>
                            </div>
                            <!-- <div @click="tabChange(1)">
                                <div class="tabs-icon">
                                    <img src="@/assets/imgs/monitoring/file.png" alt="">
                                </div>
                                <div class="tabs-text">
                                    <p :class="activeIndex == 1 ? 'blue': ''">其他材料</p>
                                </div>
                                <i :class="judgeColor(1)"></i>
                            </div> -->
                            <div @click="tabChange(1)">
                                <div class="tabs-icon">
                                    <img src="@/assets/imgs/monitoring/delivery.png" alt="">
                                    <em></em>
                                </div>
                                <div class="tabs-text">
                                    <p :class="activeIndex == 1 ? 'blue': ''">{{ pageTypeText }}单据</p>
                                </div>
                                <i :class="judgeColor(1)"></i>
                            </div>
                            <div @click="tabChange(2)">
                                <div class="tabs-icon">
                                    <img src="@/assets/imgs/monitoring/file.png" alt="">
                                </div>
                                <div class="tabs-text">
                                    <p :class="activeIndex == 2 ? 'blue': ''">其他材料</p>
                                </div>
                                <i :class="judgeColor(2)"></i>
                            </div>
                        </div>
                    </a-col>
                    <a-col span="20">
                        <template v-if="pageType === 'in'">
                            <contract
                                v-show="activeIndex == 0"
                                :editFlag="false"
                                :contractInfo="contractInfo"
                                :receivalVO="detailData.receivalVO" />
                        </template>
                        <InOutBill
                            v-show="activeIndex == 1"
                            :pageTypeText="pageTypeText"
                            :editFlag="false"
                            :otherInfo="bill"
                            :receivalVO="detailData.receivalVO" />
                        <OtherFiles
                            v-show="activeIndex == 2"
                            :editFlag="false"
                            :otherInfo="otherAttachment"
                            :receivalVO="detailData.receivalVO" />
                    </a-col>
                </a-row>
            </div>
            <div class="bottom-box">
                <div class="s-card-content" v-if="detailData.auditInfo && detailData.auditInfo.audit">
                    <h2>审核信息</h2>
                    <a-row>
                        <a-col :span="4">审核人</a-col>
                        <a-col :span="20">{{detailData.auditInfo.audit.auditor}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4">审核时间</a-col>
                        <a-col :span="20">{{detailData.auditInfo.audit.auditTime}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4">审核结果</a-col>
                        <a-col :span="20" class="red">{{detailData.auditInfo.audit.auditResult == 'PASS' ? '通过':'驳回'}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4">审核意见</a-col>
                        <a-col :span="20">{{detailData.auditInfo.audit.auditOpinion}}</a-col>
                    </a-row>
                </div>
                <!-- 只显⽰当前“融资失败”且已批注的批注信息-->
                <div class="s-card-content" v-if="detailData.receivalVO && detailData.receivalVO.status == 'COMMENTED' && detailData.commentInfo && detailData.commentInfo.comment">
                    <h2>批注信息</h2>
                    <a-row>
                        <a-col :span="4">批注时间</a-col>
                        <a-col :span="20">{{detailData.commentInfo.comment.createDate}}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="4">批注信息</a-col>
                        <a-col :span="20">{{detailData.commentInfo.comment.remark}}</a-col>
                    </a-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        API_GetAccountsDetail,
        API_AuditReceivableDownload,
        API_STORAGEGOODSOUTRECORDDETAIL,
        API_STORAGEGOODSOUTRECORDCONTRACT,
        API_STORAGEGOODSOUTRECORDBILLS,
        API_STORAGEGOODSOUTRECORDOTHERATTACHMENT,
    } from 'api'
    import Contract from "./components/contract.vue"
    import TransportDocument from "./components/TransportDocument.vue"
    import QualityDocument from "./components/QualityDocument.vue"
    import GoodsTransferDocument from "./components/GoodsTransferDocument.vue"
    import AccountsTable from "./components/AccountsTable.vue"
    import ConfirmLetter from "./components/ConfirmLetter.vue"
    import Invoice from "./components/Invoice.vue"
    import OtherFiles from "./components/OtherFiles.vue"
    import InOutBill from "./components/InOutBill.vue"
    import SettlesFiles from "./components/SettlesFiles.vue"

    import { filterCodeByValueName } from '@sub/utils/globalCode.js'
    import comDownload from '@sub/utils/comDownload.js';

    export default {
        props: ['iid', 'ppointId','ppageType','aactiveIndex','storageGoodsInoutRecordDetailVO'],
        data() {
            return {
                filterCodeByValueName:filterCodeByValueName,
                activeIndex: 0,
                industryType:'COAL',
                detailData: {}, // 详情数据
                contractInfo: {},
                bill: [],
                otherAttachment: [],
                pageType: '',
                pageTypeText: '',
            }
        },
        components: {
            Contract,
            TransportDocument,
            QualityDocument,
            GoodsTransferDocument,
            AccountsTable,
            ConfirmLetter,
            Invoice,
            SettlesFiles,
            OtherFiles,
            InOutBill,
        },
        mounted: function () {
            if (this.ppageType) {

                this.activeIndex = this.aactiveIndex
                this.pageType = this.ppageType
                this.id = this.iid
                this.pointId = this.ppointId
            }

            if (!this.ppageType) {
                this.activeIndex = this.$route.query.activeIndex
                this.pageType = this.$route.query.pageType
                this.id = this.$route.query.id
                this.pointId = this.$route.query.pointId
            }
            this.pageTypeText = { in: '入库', out: '出库' }[this.pageType]

            this.tabChange(this.activeIndex)
            const params = {id: this.id, type: this.pageType }
            API_STORAGEGOODSOUTRECORDDETAIL(params).then(res=>{
                if (res.success) {
                    this.detailData = res.data
                }
            })
            API_STORAGEGOODSOUTRECORDBILLS(params).then((res) => {
                if (res.success) {
                    this.bill = res.data
                }
            })
            API_STORAGEGOODSOUTRECORDOTHERATTACHMENT(params).then((res) => {
                if (res.success) {
                    this.otherAttachment = res.data
                }
            })
            if (this.pageType === 'in') {
                API_STORAGEGOODSOUTRECORDCONTRACT(params).then((res) => {
                    if (res.success) {
                        this.contractInfo = res.data
                    }
                })
            }
        },
        methods: {
            jumpPage() {
                this.$router.go(-1)
                // this.$router.push({
                //     path: '/center/pledge/portdetail',
                //     query: {
                //         id: this.pointId
                //     }
                // })
            },
            tabChange(index) { // 下游数据tabs切换
                this.activeIndex = index
                // if (!this.ppageType) {
                //     this.$router.push({
                //         path: '/center/pledge/cargoManageInOutDetail',
                //         query: {
                //             ...this.$route.query,
                //             activeIndex: index,
                //         }
                //     })
                // }
                
            },
            downloadAll() { // 一键下载所有文档

                API_AuditReceivableDownload({id: this.id}).then((res) => {
                    comDownload(res, null, '资产附件.zip');

                })
            },
            judgeColor(index) {
                // 项下各必备附件存在数据时，标记绿色
                // 项下附件存在数据时，标记桔色
                // 项下附件无数据时，标记红色
                //0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
                if (!this.contractInfo) return
                switch (index) {
                    case 0:
                        if (this.contractInfo.contractAttachment && this.contractInfo.contractAttachment.path) {
                                return 'green'
                            }
                        break;
                    case 1:
                        if (this.bill.length > 0) {
                                return 'green'
                            }
                      break;
                    case 2:
                        if (this.otherAttachment.length > 0) {
                            return 'orange'
                        }
                      break;
                    default:
                      // code...
                      break;
                  }
                /* if (index == 0) { // 合同
                    if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) || (this.detailData.contractInfo.tradeContract && this.detailData.contractInfo.tradeContract.list.length>0) || (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
                        if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) && (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
                            return 'green'
                        } else {
                            return 'orange'
                        }
                    } else {
                        return 'red'
                    }
                } else if (index == 1) { // 运输凭证
                    if (this.detailData.deliverInfo.attachList && this.detailData.deliverInfo.attachList.length>0) {
                        return 'green'
                    } else {
                        return 'red'
                    }
                } else if (index == 2) { // 数质量凭证
                    if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length>0) {
                        return 'green'
                    } else {
                        return 'red'
                    }
                } else if (index == 3) { // 货转凭证
                    if (this.detailData.goodTransferInfo.list && this.detailData.goodTransferInfo.list.length>0) {
                        return 'orange'
                    } else {
                        return 'red'
                    }
                } else if (index == 4) { // 核算表凭证
                    if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length>0) {
                        return 'green'
                    } else {
                        return 'red'
                    }
                } else if (index == 5) { // 确认函
                    if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length>0) {
                        return 'orange'
                    } else {
                        return 'red'
                    }
                } else if (index == 6) { // 发票
                    if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length>0) {
                        return 'orange'
                    } else {
                        return 'red'
                    }
                } else if (index == 7) { // 其他材料
                    if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length>0) {
                        return 'orange'
                    } else {
                        return 'red'
                    }
                } else if (index == 8) { // 结算单
                    if (this.detailData.settlementInfo && this.detailData.settlementInfo.list && this.detailData.settlementInfo.list.length>0) {
                        return 'orange'
                    } else {
                        return 'red'
                    }
                }*/
            },
            
        }
    }
</script>
<style lang="less" scoped>
    ::v-deep .ant-descriptions-item{
        padding-bottom: 8px;
    }
    .top-box {
        box-shadow: 0 2px 10px 0 #DDDFE4;
        overflow: hidden;
        border-radius: 8px;
        background: #fff;
        .s-card-title {
            margin-left: 20px;
            margin-top: 20px;
            font-family: PingFangSC-Medium;
            color: #141517;
            line-height: 24px;
            justify-content: space-between;
            padding-right: 20px;
            a {
                cursor: pointer;
            }
        }
        .s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
            color: #6B6F76;
        }
        .s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
            color: #383A3F;
        }
    }
    .bottom-box {
        .s-card-content .ant-row .ant-col:first-child {
            color: #6B6F76;
        }
        .s-card-content .ant-row .ant-col:last-child {
            color: #383A3F;
        }
    }
    .s-card-content{
        padding: 20px 16px 24px 16px;
        border-radius: 8px;
        background: #fff;
        margin: 14px 0 0 0;
        .row .ant-col {
            margin-bottom: 8px;
            text-overflow: ellipse;
            white-space: nowrap;
            overflow: hidden;
        }
        .ant-row .ant-col {
            margin-bottom: 8px;
        }
        h2 {
            font-style: normal;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #141517;
            line-height: 22px;
            margin-bottom: 16px;
        }
    }
    .divider {
      background: #f4f5f8;
      height: 1px;
      margin-top:20px;
      margin-left: -20px;
      margin-right: -20px;
    }
    .tabs-bar {
        display: flex;
        flex-direction: column;
        cursor: pointer;
    }
    .tabs-bar i {
        display: inline-block;
        width: 10px;
        height: 10px;
        float: right;
        background: red;
        border-radius: 50%;
        margin-top: 8px;
        margin-right: 10px;
    }
    .tabs-bar > div > div {
        float: left;
    }
    .tabs-bar .tabs-icon {
        margin-right: 10px;
        em {
            display: block;
            width: 1px;
            height: 36px;
            background: @primary-color;
            border-radius: 1.5px 1.5px 0 0;
            margin: 5px 0 5px 6px;
        }
        img {
            width: 24px;
            height: 24px;
            margin-left:-5px;
        }
    }
    .tabs-bar .tabs-text {
        p {
            font-family: PingFangSC-Medium;
            color: #383A3F;
            line-height: 22px;
        }
        .blue {
            color: @primary-color;
        }
        span {
            font-family: PingFangSC-Regular;
            font-size: 10px;
            color: #9BA0AA;
        }
    }
    .red {color:#F24E4D!important;}
    .overflow {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
    .contentBox{font-family: PingFangSC-Regular;}
    .green{background: #00AE9D!important;}
    .orange{background: #FF9726!important;}
    .red_bg{background: #F24E4D!important;}
</style>
