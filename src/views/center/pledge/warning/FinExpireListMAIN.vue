<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">融资到期提醒</span>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table class="new-table" :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="remainingDay" slot-scope="remainingDay, items">
                        <span v-if="items.remainingDay == 0"><span style="color:red">0</span></span>
                        <span v-if="items.remainingDay > 0">{{items.remainingDay}}</span>
                        <span v-if="items.remainingDay < 0"><span style="color:red">已逾期{{Math.abs(items.remainingDay)}}天</span></span>
                    </div>
                    <div slot="action" slot-scope="action, items">
                        <a-space>
                            <router-link v-auth="'goods:warning:remind:view'" :to="{path:'/center/financing/financingPledgeDetail', query: {id: items.financingApplyId}}">融资详情</router-link>
                            <router-link v-auth="'goods:warning:remind:cash'" :to="{path:'/center/pledge/finExpireApplyT', query: {financingApplyNo: items.financingApplyNo}}" v-if="items.remainingDay>3">提前还款</router-link>
                            <router-link v-auth="'goods:warning:remind:cash'" :to="{path:'/center/pledge/finExpireApplyD', query: {financingApplyNo: items.financingApplyNo}}" v-if="items.remainingDay<=3">到期兑付</router-link>
                        </a-space>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
    </div>
</template>
<script lang="jsx">
    const columns = [
        { title: '货押融资编号', fixed: 'left', dataIndex: 'financingApplyNo', key: 'financingApplyNo'},
        { title: '融资方', dataIndex: 'financier', key: 'financier'},
        { title: '出资机构', dataIndex: 'bankName', key: 'bankName'},
        { title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate'},
        { title: '融资到期日', dataIndex: 'endDate', key: 'endDate'},
        { title: '融资到期剩余天数（天）', dataIndex: 'remainingDay', key: 'remainingDay',scopedSlots: { customRender: 'remainingDay' }},
        { title: '融资金额（元）', dataIndex: 'finAmount', key: 'finAmount'},
        { title: '剩余待还本金（元）', dataIndex: 'remainingAmount', key: 'remainingAmount'},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    import { API_PledgeFinExpireList} from 'api'

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
        },
        data() {
            return {
                columns,
                searchList: [],
                url: {
                    list: API_PledgeFinExpireList
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
            renderType(){
                return [
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
                        isShow: !this.jr
                    },
                    {
                        decorator: ["financier"],
                        addonBeforeTitle: "融资方",
                        type: "input",
                        placeholder: "请输入融资方",
                        isShow: this.jr,
                    },
                    {
                        decorator: ["endDate"],
                        addonBeforeTitle: "融资到期日",
                        type: "rangePicker",
                        realKey: ["endDateStart", "endDateEnd"],
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
