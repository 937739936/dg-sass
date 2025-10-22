<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">价格盯市</span>
            </div>
            <div class="s-card-content" style="margin-top:14px;display:flex;justify-content: space-around;" v-show="priceList.length">
                <div class="price-item" v-for="(item,index) in priceList" :key="index">
                    <div class="price-top">
                        <div class="title">{{item.name}}</div>
                        <div>{{item.updateDate}}</div>
                    </div>
                    <div class="price-top">
                        <div><span class="num" :style="getPriceStype(item.priceChangeRangeScale,item)">{{item.price}}</span> 元/吨</div>
                        <div><span :style="getPriceStype(item.priceChangeRangeScale,item)">{{item.priceChangeRangeScale+''}}</span>&nbsp;&nbsp;&nbsp;<span :style="getPriceStype(item.priceChangeRangeDiff,item)">{{item.priceChangeRangeDiff+'%'}}</span></div>
                    </div>
                </div>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="levelDesc" slot-scope="levelDesc, items">
                        <span v-if="items.level == '3'" style="color:red">{{levelDesc}}</span>
                        <span v-else-if="items.level == '2'" style="color:#F59A23">{{levelDesc}}</span>
                        <span v-else>{{levelDesc}}</span>
                    </div>
                    <div slot="pledgeRate" slot-scope="pledgeRate, items">
                        <span v-if="items.level == '3'" style="color:red">{{pledgeRate}}%</span>
                        <span v-else-if="items.level == '2'" style="color:#F59A23">{{pledgeRate}}%</span>
                        <span v-else>{{pledgeRate}}%</span>
                    </div>
                    
                    <div slot="action" slot-scope="action, items">
                        <a @click="openDetail(items)" v-auth="'goods:warning:price:view'" style="margin-right: 8px;">预警详情</a>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
        <a-modal :visible="detailModalVis"
            title="预警详情"
            :width="1200"
            :footer="null"
            @cancel="()=>{detailModalVis = false}">
            <a-form :label-col="{ span: 6}" :wrapper-col="{span: 18}"> 
                <h4 style="margin-bottom:30px;">融资信息</h4>
                <a-row class="row">
                    <a-col span="8">
                        <a-row>
                            <a-form-item label="货押融资编号">
                            {{detailData.applyNo}}
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="融资起息日">
                            {{detailData.beginDate}}
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="待还本金（元）":label-col="{ span: 9}" :wrapper-col="{span: 14}">
                            {{detailData.unpayAmount}}
                            </a-form-item>
                        </a-row>
                    </a-col>
                    <a-col span="8">
                        <a-row>
                            <a-form-item label="融资方">
                            {{detailData.financName}}
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="融资到期日">
                            {{detailData.endDate}}
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="当前质押数量（吨）"  :label-col="{ span: 9}" :wrapper-col="{span: 14}">
                            {{detailData.pledgeQuantity}}
                            </a-form-item>
                        </a-row>
                    </a-col>
                    <a-col span="8">
                        <a-row>
                            <a-form-item label="出资机构">
                            {{detailData.bankName}}
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="融资金额（元）" :label-col="{ span: 9}" :wrapper-col="{span: 14}">
                            {{detailData.finAmount}}
                            </a-form-item>
                        </a-row>
                    </a-col>
                </a-row>
                <h4 style="margin-bottom:30px;margin-top:30px">预警信息</h4>
                <a-row :class="['row',detailData.level == 1 ? 'yujing':'yujing-red' ]" >
                    <a-col span="12">
                        <a-row>
                            <a-form-item label="预警标准">
                            预警线：预警质押率 {{detailData.productPledgeRate}}%
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="预警信息">
                                当前质押货值：<span class="redt">{{detailData.pledgeGoods}}</span>元    
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="处置方案">
                            应补充价值<span class="redt"> {{detailData.pledgeGoods}}</span>元的货物，或还款<span class="redt"> {{detailData.unpayAmount}}</span>元
                            </a-form-item>
                        </a-row>
                    </a-col>
                    <a-col span="12">
                        <a-row>
                            <a-form-item label="处置线">
                            处置质押率 {{detailData.productDisposalRate}}%
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="" :label-col="{ span: 2}" :wrapper-col="{span: 22}">
                            <template v-if="detailData.level == 1">
                               当前质押率 : <span class="redt"> {{detailData.pledgeRate}}%</span> ＜ 预警线：<span class="redt"> {{detailData.productAlertRate}}%</span>
                            </template>
                            <template v-if="detailData.level == 2">
                                预警线：<span class="redt"> {{detailData.productAlertRate}}%</span> ≤ 当前质押率 : <span class="redt"> {{detailData.pledgeRate}}%</span> ＜ 处置线：<span class="redt"> {{detailData.productDisposalRate}}%</span>
                            </template>
                            <template v-if="detailData.level == 3">
                                当前质押率 : <span class="redt"> {{detailData.pledgeRate}}%</span> ≥ 处置线：<span class="redt"> {{detailData.productDisposalRate}}%</span>
                            </template>
                            ， 风险等级 <span class="redt">{{detailData.levelDesc}}</span>
                            </a-form-item>
                        </a-row>
                    </a-col>
                </a-row>
                <h4 style="margin-bottom:30px;margin-top:30px">质押货物清单</h4>
                <a-table  class="new-table" :pagination="false" :columns="zhiyacolumns" :data-source="detailData.inboundDetailVOList||[]"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">

                </a-table>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    const columns = [
        { title: '货押融资编号', fixed: 'left', dataIndex: 'applyNo', key: 'applyNo',fixed:'left'},
        { title: '当前质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity'},
        { title: '当前质押货值（元）', dataIndex: 'pledgeGoods', key: 'pledgeGoods'},
        { title: '待还本金（元）', dataIndex: 'unpayAmount', key: 'unpayAmount'},
        { title: '风险等级', dataIndex: 'levelDesc', key: 'levelDesc',scopedSlots: { customRender: 'levelDesc' }},
        { title: '当前质押率', dataIndex: 'pledgeRate', key: 'pledgeRate',scopedSlots: { customRender: 'pledgeRate' }},
        { title: '风险敞口（元）', dataIndex: 'riskExposure', key: 'riskExposure',customRender:(v)=>v||'-'},
        { title: '融资方', dataIndex: 'financName', key: 'financName'},
        { title: '仓储企业', dataIndex: 'warehouseName', key: 'warehouseName'},
        { title: '出资机构', dataIndex: 'bankName', key: 'bankName'},
        { title: '预警时间', dataIndex: 'updateDate', key: 'updateDate'},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    const searchList = [
        {
            decorator: ["applyNo"],
            addonBeforeTitle: "货押融资编号",
            type: "input",
            placeholder: "请输入货押融资编号",
        },
        {
            decorator: ["bankName"],
            addonBeforeTitle: "出资机构",
            type: "input",
            placeholder: "请输入出资机构",
        },
        {
            decorator: ["level"],
            addonBeforeTitle: "风险等级",
            type: "select",
            placeholder: "请选择风险等级",
            options: [
                {
                    label: "无风险",
                    value: "1",
                },
                {
                    label: "预警风险",
                    value: "2",
                },
                {
                    label: "处置风险",
                    value: "3",
                },
            ]
        },
        {
            decorator: ["updateDate"],
            addonBeforeTitle: "预警时间",
            type: "rangePicker",
            realKey: ["updateDateStart", "updateDateEnd"],
        },
    ]
    import { API_AssetsPriceDingDetail, API_AssetsPriceDingList,API_AssetsPriceDing} from 'api'
    import iPagination from "@sub/components/iPagination"
    import moment from 'moment'
    import { ListMixin } from "@/v2/components/mixin/ListMixin";
    export default {
        mixins: [ListMixin],
        data() {
            return {
                detailData:{},
                zhiyacolumns:[
                    { title: '入库单号', dataIndex: 'number', key: 'number',fixed:'left'},
                    { title: '仓单编号', dataIndex: 'goodsRecordNo', key: 'goodsRecordNo',fixed:'left'},
                    { title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
                    { title: '方向', dataIndex: 'direction', key: 'direction'},
                    { title: '货物名称', dataIndex: 'goodsName', key: 'goodsName'},
                    { title: '质押数量（吨）', dataIndex: 'num', key: 'num'},
                    { title: '入库日期', dataIndex: 'inoutDate', key: 'inoutDate'},
                    { title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue'},
                    { title: '货主名称', dataIndex: 'sellerName', key: 'sellerName'},
                    { title: '仓储企业', dataIndex: 'companyName', key: 'companyName'},
                    { title: '仓库名称', dataIndex: 'storageName', key: 'storageName'},
                ],
                detailModalVis:false,
                priceList:[],
                columns,
                searchList,
                url: {
                    list: API_AssetsPriceDingList
                },
            }
        },
        components: {
            iPagination
        },
        computed: {
        },
        mounted: function () {
            API_AssetsPriceDing().then(res=>{
                this.priceList = res.data||[{priceChangeRangeScale:-3,priceChangeRangeDiff:-3,price:'123',updateDate:'2022-01-01'}]
            })

        },
        methods: {
            getPriceStype(v,item){
                if (moment() > moment(item.updateDate)) {
                    return 'color:gray'
                }
                if (v > 0) {
                    return 'color:red'
                } else if (v < 0) {
                    return 'color:green'
                } else {
                    return 'color:gray' 
                }
            },
            openDetail(record){
                API_AssetsPriceDingDetail({id:record.id}).then(res=>{
                    this.detailData = res.data||{}
                    // this.detailData.level = 3
                    this.detailModalVis = true
                })
                
            },
        }
    }
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
    .yujing-red {
        .redt {
            color:red
        }
    }
    .price-item {
        padding-top:15px;
        flex: 1;
        border: 1px solid #9e9e9e;
        border-radius: 3px;
        margin-left: 15px;
        .num {
            color:red;
            font-size:20px;
        }
        .title {
            font-weight: bold;
        }
    }
    .price-top {
        display:flex;
        margin-bottom: 12px;
        justify-content: space-around;
        align-items: center;
    }
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
    ::v-deep .ant-form-item-label {
        text-align: left;
        label {
            color:#6B6F76;
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
