<template>
    <div class="s-card">
        <div class="s-card-content" style="margin-top:14px;">
            <a-form layout="inline">
                <a-row>
                    <a-col span="8">
                        <a-form-item label="仓单编号" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
                            <a-input placeholder="请输入仓单编号" v-model="params.serialNo"></a-input>
                        </a-form-item>
                        <a-form-item :label="`${pageTypeText}单号`" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
                            <a-input :placeholder="`请输入${pageTypeText}单号`" v-model="params.number"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item :label="`${pageTypeText}日期`" :colon="false" :label-col="{ span: 8 }" :wrapper-col="{ span: 15}">
                            <a-range-picker v-model="date" valueFormat="YYYY-MM-DD" />
                            <!-- <a-select
                                :showArrow="true"
                                style="width: 100%"
                                placeholder="请选择"
                                v-model="params.type"
                            >
                                <a-select-option value="PROOF">凭证结算</a-select-option>
                                <a-select-option value="INVOICE">发票结算</a-select-option>
                            </a-select> -->
                        </a-form-item>
                    </a-col>
                    <a-col span="8">
                        <a-form-item style="text-align: center;">
                            <a-button type="primary" @click="searchSubmit" class="search-btn" style="margin-right:16px;">
                                查询
                            </a-button>
                            <a-button type="primary" @click="resetValues" :ghost="true"> 重置 </a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <a-table  :pagination="false" :columns="columns[type]" :data-source="accountPayableList"  :scroll="{x:true}" rowKey="id" style="margin-top:22px;">

                <span slot="amount" slot-scope="amount">¥{{amount}}</span>
                <span slot="planFinancingAmount" slot-scope="planFinancingAmount">¥{{planFinancingAmount}}</span>
                <div slot="action" slot-scope="action, items">

                    <a class="mr8" v-if="items.canOpt || type === 'out'" v-auth="'goods:goods:edit'" @click="jumpPage({ ...items, type: 'edit' })">编辑</a>

                    <a class="mr8" v-auth="'goods:goods:view'" @click="jumpPage({ ...items, type: 'detail' })">详情</a>
                    <a class="mr8" v-if="items.canOpt || type === 'out'" v-auth="'goods:goods:edit'" @click="del(items)">删除</a>
                </div>
            </a-table>
            <i-pagination :pagination="pagination" @change="getAccountPayableList" />
        </div>
        
        <a-modal 
            v-model="zuofeiVisible"
            title="作废原因"
            :width="500"
            @ok="submitZ">
            <div @click.stop style="background:#fff"  @move.stop>
                <a-row>
                    请输入作废原因：
                </a-row>
                <a-row>
                    <a-textarea style=" margin: 0 auto;margin-top:20px" :maxLength="100" placeholder="作废原因" v-model="reasonName"></a-textarea>
                </a-row>
            </div>
        </a-modal>
    </div>
</template>
<script lang="jsx">
    const columns = {
        in: [
            { title: '仓单编号', dataIndex: 'serialNo' },
            { title: '入库单号', dataIndex: 'number' },
            { title: '货物名称', dataIndex: 'goodsName' },
            { title: '入库数量（吨)', dataIndex: 'quantity' },
            { title: '入库热值 (Kcal/kg)', dataIndex: 'heatValue' },
            { title: '入库日期', dataIndex: 'inoutDate' },
            { title: '方向', dataIndex: 'direction' },
            { title: '运输方式', dataIndex: 'transportModeDesc' },
            { title: '采购合同编号', dataIndex: 'contractNo' },
            { title: '卖方企业', dataIndex: 'sellerName' },
            { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
        ],
        out: [
            { title: '仓单编号', dataIndex: 'serialNo' },
            { title: '出库单号', dataIndex: 'number' },
            { title: '出库日期', dataIndex: 'inoutDate' },
            { title: '货物名称', dataIndex: 'goodsName' },
            { title: '出库数量(吨)', dataIndex: 'quantity' },
            { title: '出库热值(Kcal/kg)', dataIndex: 'heatValue' },
            { title: '方向', dataIndex: 'direction' },
            { title: '运输方式', dataIndex: 'transportModeDesc' },
            { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }}
        ],
    }

    import { filterCodeByValueName,filterCodeByKey } from '@sub/utils/globalCode.js'
    import {
        API_GetAdvancePayableList,
        API_SyncPayable,API_GetAccountsPayableZF,
        API_STORAGEGOODSINRECORDPAGE,
        API_STORAGEGOODSOUTRECORDPAGE,
        API_STORAGEGOODSOUTRECORDDEL,
    } from 'api'

    import { mapGetters,mapMutations } from 'vuex'
    import iPagination from "@sub/components/iPagination"

    export default {
        props: {
            type: {
              type: String,
              default: 'in'
            },
            goodsId: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                pageTypeText: '',
                form: this.$form.createForm(this),
                zuofeiVisible:false,
                reasonName:'',
                date: [],
                params: {
                    serialNo: '',
                    buyerName: '',
                    contractNo: '',
                    type: undefined,
                    bankName:'',
                    status: undefined,
                    pageSize: 1,
                    pageNo: 1,
                },
                applyTime: null,
                pagination: {
                    type: 'accountsPayable',
                    total: 0, // 总条数
                    pageNo: 1
                },
                columns,
                accountPayableList: [],
                statusData: filterCodeByKey("receivableStatusDict"),
            }
        },
        components: {
            iPagination
        },
        computed: {
            ...mapGetters('pagination', {
                listParmas: 'listParmas',
                pageSize: 'pageSize'
            }),
            ...mapGetters('user', {
                VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
            }),
        },
        mounted: function () {
            this.pageTypeText = {
                in: '入库',
                out: '出库',
            }[this.type]
            this.$nextTick(() => {
                let listParmas = this.listParmas
                if (listParmas.type == this.pagination.type) {
                    this.getAccountPayableList(listParmas.pageNo)
                    this.VUEX_initListParmas()
                } else {
                    this.getAccountPayableList()
                }
            })
        },
        methods: {
            ...mapMutations({
                VUEX_initListParmas: "pagination/VUEX_initListParmas",
                VUEX_setListPamars: "pagination/VUEX_setListPamars"
            }),
            jumpPage({ id, type, goodsId }) {
                const path = {
                    edit: '/center/pledge/cargoManageCreateInOut',
                    detail: '/center/pledge/cargoManageInOutDetail',
                }
                this.$router.push({
                    path: path[type],
                    query: {
                        id,
                        goodsId,
                        pointId: this.$route.query.id,
                        pageType: this.type,
                        activeIndex: this.type === 'in' ? 0 : 1,
                    }
                })
            },
            del({ id }) {
                this.$confirm({
                  // closable: true,
                  title: '确定要删除该条数据吗？',
                  // content: '确定要删除该条数据吗？',
                  // okText: '确认',
                  icon: () => {
                    return <a-icon type="exclamation-circle" theme="filled" />
                  },
                  onOk: () => {
                    API_STORAGEGOODSOUTRECORDDEL({ id, type: this.type, }).then((res) => {
                        if(res.success) {
                            this.$message.success('删除成功')
                            this.getAccountPayableList()
                        }
                    })
                  },
                  // cancelText: '取消',
                  // onCancel() {}
                });
            },
            getAccountPayableList(pageNo = this.pagination.pageNo, pageSize = this.pageSize){
                this.pagination.pageNo = pageNo
                this.params.pageNo = pageNo
                this.params.pageSize = pageSize
                if (this.date && this.date[0]) {
                    this.params.inoutDateStart = this.date[0]
                    this.params.inoutDateEnd = this.date[1]
                }
                const fct = {
                    in: API_STORAGEGOODSINRECORDPAGE,
                    out: API_STORAGEGOODSOUTRECORDPAGE
                }
                fct[this.type]({
                    ...this.params,
                    goodsId: this.goodsId,
                }).then(res=>{
                    if(!res.success){
                        return
                    }
                    this.accountPayableList = res.data.records
                    this.pagination.total = res.data.total
                })
            },
            // 获取应付账款申请日期
            getTime(value, dateString){
                this.params.requestDateBegin = dateString[0]
                this.params.requestDateEnd = dateString[1]
            },
            searchSubmit(){ // 查询按钮
                this.pagination.pageNo = 1
                delete this.params.pageNo
                this.getAccountPayableList()
            },
            resetValues(){ // 重置
                this.params =  {}
                this.date = []
                this.pagination.pageNo = 1
                this.getAccountPayableList()
            },
            goToEdit(item){ // 编辑应付账款
                if (item.id) {
                    this.$router.push('/center/assets/pledge/edit?id='+item.id +'&activeIndex=0')
                }
            },
            goZuofei(item){
                this.reasonName = ''
                this.zuofeiVisible = true
                this.currentId = item.id
            },
            goTijiao(item){
                if (item.id) {
                    this.$router.push('/center/assets/advance/edit?id='+item.id +'&submit=1&activeIndex=0')
                }
            },
            submitZ(){
                if (!this.reasonName) {
                    this.$message.error('请输入作废原因')
                    return
                }
                this.zuofeiVisible = false
                this.$confirm({
                    centered:true,
                    title: "确定作废",
                    okText: '确定',
                    content:"系统将对该应付账款进行作废，确定要进行作废么?",
                    cancelText: '取消',
                    onOk:()=> {
                        API_GetAccountsPayableZF({
                            message:this.reasonName,
                            assetId:this.currentId
                        }).then(res=>{
                            if (res.success) {
                                if(res.data) {
                                    this.$message.success('作废成功')
                                    this.resetValues()
                                }
                            }
                        })
                    },
                    onCancel() {}
                });

            },
            syncStatus() { // 同步状态
                API_SyncPayable().then(res=>{
                    if (res.success) {
                        if(res.data) {
                            this.$message.success('同步成功')
                            this.getAccountPayableList()
                        }
                    }
                })
            }
        }
    }
</script>
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
