<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">补货记录</span>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="action" slot-scope="action, items">
                        <router-link  :to="{path:items.addGoodsType == 'ADD_MARGIN' ? '/center/pledge/replenishmentCashDetail' : '/center/pledge/replenishmentDetail', query: {id: items.id}}" style="margin-right: 8px;">详情</router-link>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
    </div>
</template>
<script>
    const columns = [
        { title: '补货编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo'},
        { title: '货押融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyNo'},
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
        { title: '类型', dataIndex: 'addGoodsTypeText', key: 'addGoodsTypeText',customRender:(v)=>{
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
            decorator: ["financier"],
            addonBeforeTitle: "融资方",
            type: "input",
            placeholder: "请输入融资方",
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
    import { API_PledgeReplenList} from 'api'
    import iPagination from "@sub/components/iPagination"
    import { ListMixin } from "@/v2/components/mixin/ListMixin";
    export default {
        mixins: [ListMixin],
        data() {
            return {
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
        },
        methods: {
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
