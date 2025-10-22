<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">质押物管理</span>
            </div>
            <SlFormNew
                :list="searchList"
                layout="inline"
                @change="changeSearch"
                @resetFunc="resetFunc"
            ></SlFormNew>
            <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
                <a-table
                    class="new-table"
                    :pagination="false" :columns="columns" :data-source="dataSource"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">
                    <div slot="action" slot-scope="action, items">
                        <router-link :to="{path:'/center/pledge/substitutionDetail', query: {goodsCompanyUscc: items.goodsCompanyUscc,inventoryPointId:items.inventoryPointId}}" style="margin-right: 8px;">详情</router-link>
                        <router-link v-auth="'goods:pledge:manage:edit'" :to="{path:'/center/pledge/substitutionApply', query: {goodsCompanyUscc: items.goodsCompanyUscc,inventoryPointId:items.inventoryPointId}}" style="margin-right: 8px;">质押物置换</router-link>
                    </div>
                </a-table>
                <i-pagination :pagination="pagination" @change="getList" />
            </div>
        </a-card>
    </div>
</template>
<script>

    const columns = [
        { title: '仓库名称', dataIndex: 'storageName', key: 'storageName'},
        { title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
        { title: '货物名称', dataIndex: 'goodsName', key: 'goodsName'},
        { title: '质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity'},
        { title: '质押货值（元）', dataIndex: 'pledgeGoodsValue', key: 'pledgeGoodsValue'},
        { title: '质押融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyNo'},
        { title: '最近到期时间', dataIndex: 'minEndDate', key: 'minEndDate'},
        { title: '仓储企业', dataIndex: 'storageCompanyName', key: 'storageCompanyName'},
        { title: '货主名称', dataIndex: 'goodsCompanyName', key: 'goodsCompanyName'},
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
    ];
    const searchList =[
        {
            decorator: ["financingApplyNo"],
            addonBeforeTitle: "融资编号",
            type: "input",
            placeholder: "请输入融资编号",
        },
        {
            decorator: ["storageName"],
            addonBeforeTitle: "仓库名称",
            type: "select",
            placeholder: "请选择仓库名称",
            options: []
        },
        {
            decorator: ["inventoryPointId"],
            addonBeforeTitle: "存货点",
            type: "select",
            placeholder: "请选择存货点",
            options: []
        },
    ]
    import { API_PledgeExchangeList,API_AssetsWareList,API_STORAGEGOODSPOINTLIST} from 'api'
    import _ from 'lodash'
    import iPagination from "@sub/components/iPagination"
    import { ListMixin } from "@/v2/components/mixin/ListMixin";

    export default {
        mixins: [ListMixin],
        data() {
            return {
                storageList:[],
                columns,
                goodsModalHuoList:[],
                searchList,
                url: {
                    list: API_PledgeExchangeList
                },
                selfLoad: true,
            }
        },
        components: {
            iPagination
        },
        computed: {
        },
        watch:{
            'searchParams.storageName'(v){
                var cur = _.find(this.storageList,{name:v})
                if (!cur) return
                API_STORAGEGOODSPOINTLIST({storageId:cur.id}).then(res=>{
                    this.goodsModalHuoList = res.data||[]
                    this.searchList.forEach(item=>{
                        if (item.decorator[0] === 'inventoryPointId') {
                            item.options = this.goodsModalHuoList.map((item) => {
                                return { value: item.id, label: item.inventoryPoint};
                            })
                        }
                    })
                })
            }
        },
        mounted: function () {
            this.initData()
        },
        methods: {
            initData() {
                return new Promise(async (resolve) => {
                    await this.getAssetsWareList();
                    this.getList()
                    resolve(true);
                })
            },
            getAssetsWareList() {
                return API_AssetsWareList().then(res=>{
                    this.storageList = res.data||[]
                    this.searchList.forEach(item=>{
                        if (item.decorator[0] === 'storageName') {
                            item.options = this.storageList.map((item) => {
                                return { value: item.name, label: item.name};
                            })
                        }
                    })
                })
            },
            resetFunc() {
                this.goodsModalHuoList = []
                this.searchList.forEach(item=>{
                    if (item.decorator[0] === 'inventoryPointId') {
                        item.options = this.goodsModalHuoList.map((item) => {
                            return { value: item.id, label: item.inventoryPoint};
                        })
                    }
                })
                this.getList();
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
