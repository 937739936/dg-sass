<template>
    <div class="slMain mt-10">
        <a-card :bordered="false">
            <div class="methods-wrap">
                <span slot="title" class="slTitle">发起赎货申请</span>
            </div>
            <a-form :form="baseForm" :label-col="{ span: 8}" :wrapper-col="{span: 14}">
                <div class="bottom-box">
                    <div class="s-card-content">
                        <h2>赎货信息</h2>
                        <a-row class="row">
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="货主名称">
                                    {{detailData.goodsCompanyName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="货物名称">
                                    {{detailData.goodsName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="质押货值（元）">
                                    {{detailData.pledgeGoodsValue}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="仓库名称">
                                    {{detailData.storageName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="存货点">
                                    {{detailData.inventoryPoint}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="解质中数量（吨）">
                                    {{detailData.redeemingNum}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                            <a-col span="8">
                                <a-row>
                                    <a-form-item label="仓储企业">
                                    {{detailData.storageCompanyName}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="质押数量（吨）">
                                    {{detailData.pledgeQuantity}}
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="可解质数量（吨）">
                                    {{((detailData.pledgeQuantity||0)-(detailData.redeemingNum||0)).toFixed(2)}}
                                    </a-form-item>
                                </a-row>
                            </a-col>
                        </a-row>
                        <a-row class="row">
                            <a-col span="8">
                                <a-form-item label="本次解质数量：">
                                    <a-input @change="changeV" type="number" v-decorator="[ 'thisQ', {
                                        rules: [
                                            { required: true, message: `本次解质数量必填`},
                                            { pattern:numberReg,message: '请输入数字，最多四位小数'},
                                            {validator:thisQvalidator}
                                        ],
                                        validateTrigger:'change'
                                    }]" placeholder="请输入本次解质数量" /> 吨
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <div style="display:flex">
                            <h2>融资信息：</h2><span>（按照融资开始日期，先融资的货物优先解质）</span>
                        </div>
                        <a-table
                            :columns="finColumn"
                            :dataSource="detailData.financingPledgeVOList||[]"
                            :pagination="false"
                            rowKey="index"
                            :scroll="{x:true}"
                            :locale="{emptyText: '暂无数据'}"
                        >
                        </a-table>
                        <div style="text-align:right;margin-top: 10px;margin-right: 10px;">本次解质总货值（元）：{{getSum()}}</div>
                    </div>

                </div>
            
                <div class="s-card-content" style="padding-bottom: 30px;" v-for="(item,index) in getGoodsList" :key="item.serialNo">
                    <h2>补货信息-融资编号：{{item.serialNo}}</h2>
                    <div class="card-desc">您需要补充{{item.thisV}}元货值的质押物，已补货物货值{{getCurPrice(item)}}元，仍需补{{Math.max(0,(item.thisV-getCurPrice(item))).toFixed(2)}}元的货值</div>
                    <a-button class="fr choose-btn" type="primary" @click="openChoose(item,index,getGoodsList)">选择货物</a-button>

                    <a-table
                        :columns="goodsColumn"
                        :dataSource="item.glist||[]"
                        :pagination="false"
                        :scroll="{x:true}"
                        rowKey="id"
                        :locale="{emptyText: '暂无数据'}"
                    >
                        <template slot="thisPledgeQuantity" slot-scope="text, record">
                            <a-input-number v-model="record.thisPledgeQuantity"  @change="calcNum(record)" :precision="4"></a-input-number>
                        </template>
                        <template slot="action" slot-scope="text, record" >
                            <a href="javascript:;" @click="deleteGItem(item,record)">删除</a>
                        </template>
                    </a-table>

                </div>
            </a-form>
            <FinancingLiu ref="FinancingLiu" bizType="MORTGAGE_REPLACE" />
            <div class="s-card-content" style="padding-bottom: 30px;">

                <div style="text-align:center;margin-top:40px;">
                    <a-button @click="$router.back()" type="primary" ghost>返回</a-button>
                    <a-button type="primary" @click="submitApply('2')" style="margin-left:10px">提交</a-button>
                </div>
            </div>
            <ChooseGoods ref="ChooseGoods" @chooseFinGoods="chooseFinGoods"/>
            <SubstitutionApplyModal ref="SubstitutionApplyModal" />

        </a-card>
    </div>
</template>
<script>
    import { filterCodeByValueName } from '@sub/utils/globalCode.js'
    import { API_PledgeExchangeDetailApply} from '@/api'
    import _ from 'lodash';
    import moment from 'moment';
    import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue'
    import ChooseGoods from '@/v2/center/assets/components/common/ChooseGoods.vue'
    import SubstitutionApplyModal from './SubstitutionApplyModal.vue'

    export default {
        data() {
            return {
                moment,
                baseForm:this.$form.createForm(this),
                detailData:{financingPledgeVOList:[{serialNo:'001',beginDate:'2022-2202',inboundId:'3',thisQ:0,thisV:0,glist:[],pledgeQuantity:2000,pledgePrice:2},{inboundId:'4',thisV:0,glist:[],serialNo:'002',thisQ:0,pledgeQuantity:2000,pledgePrice:2}]},
                filterCodeByValueName: filterCodeByValueName,
                numberReg:/^(\d+)(\.\d{1,4})?$/,
                goodsColumn:[
                    { title: '入库单号', dataIndex: 'number', key: 'number',fixed:'left'},
                    { title: '仓单编号', dataIndex: 'serialNo', key: 'serialNo',fixed:'left'},
                    { title: '存货点', dataIndex: 'inventoryPoint', key: 'inventoryPoint'},
                    { title: '方向', dataIndex: 'direction', key: 'direction'},
                    { title: '货物名称', dataIndex: 'goodsName', key: 'goodsName'},
                    { title: '入库数量（吨）', dataIndex: 'quantity', key: 'quantity'},
                    { title: '入库热值（Kcal/kg）', dataIndex: 'heatValue', key: 'heatValue'},
                    { title: '可质押数量（吨）', dataIndex: 'canPledgeQuantity', key: 'canPledgeQuantity' },
                    { title: '本次质押数量（吨）', dataIndex: 'thisPledgeQuantity', key: 'thisPledgeQuantity' , scopedSlots: { customRender: 'thisPledgeQuantity' },},
                    { title: '单价（元/吨）', dataIndex: 'thisPledgePrice', key: 'thisPledgePrice' },
                    { title: '本次质押货值（元）', dataIndex: 'thisPledgeGoods', key: 'thisPledgeGoods',customRender:(a,r)=>{

                        return (r.thisPledgeQuantity*r.thisPledgePrice).toFixed(2)
                    } },
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                finColumn:[
                    { title: '融资编号', dataIndex: 'serialNo', key: 'serialNo',fixed:'left'},
                    { title: '金融机构', dataIndex: 'bankName', key: 'bankName'},
                    { title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate'},
                    { title: '融资到期日', dataIndex: 'endDate', key: 'endDate' },
                    { title: '入库单号', dataIndex: 'number', key: 'number' },
                    { title: '当前质押数量（吨）', dataIndex: 'pledgeQuantity', key: 'pledgeQuantity',},
                    { title: '本次解质数量（吨）', dataIndex: 'thisQ', key: 'thisQ'},
                    { title: '单价（元/吨）', dataIndex: 'pledgePrice', key: 'pledgePrice'},
                    { title: '本次解质货值（元）', dataIndex: 'thisV1', key: 'thisV1',customRender:(a,r)=>{ // 展示用
                        return  ((r.thisQ||0)*r.pledgePrice).toFixed(2)
                    } },
                ]
            }
        },
        components: {
            FinancingLiu,
            ChooseGoods,
            SubstitutionApplyModal
        },
        computed: {
            getGoodsList(){

                var pureList = this.detailData.financingPledgeVOList.filter(n=>n.thisV)
                var map = {}
                for (var i = 0 ; i < pureList.length ; i++) {
                    var cur = pureList[i]
                    if (map[cur.serialNo]) {
                        map[cur.serialNo].push(cur)
                    } else {
                        map[cur.serialNo] = [cur]
                    }
                }
                let arrtemp = []
                for (var key in map){
                    if (map[key].length > 1) {
                        let thisQ = 0,thisV = 0
                        map[key].forEach(item=>{
                            thisQ = thisQ + Number(item.thisQ)
                            thisV = thisV + Number(item.thisV)
                        })
                        arrtemp.push({
                            ...map[key][0],
                            goodsRecordNos:map[key].map(n=>n.goodsRecordNo),
                            thisQ,
                            thisV
                        })
                    } else {
                        arrtemp.push({
                            ...map[key][0],
                            goodsRecordNos:[map[key][0].goodsRecordNo],
                        })
                    }
                }

                return arrtemp
            },
        },
        mounted: function () {

            let query = this.$route.query
            API_PledgeExchangeDetailApply({goodsCompanyUscc: query.goodsCompanyUscc,inventoryPointId:query.inventoryPointId}).then(res=>{
                if (res.success) {
                    this.detailData = res.data||{}
                    this.detailData.financingPledgeVOList = this.detailData.financingPledgeVOList.map(o=>{
                        return {
                            ...o,
                            thisQ:0,
                            glist:[],
                            thisV:0
                        }
                    })
                }
            })
        },
        methods: {
            getParams(){
                // 面板modal展示使用
                var pureList = this.detailData.financingPledgeVOList.filter(n=>n.thisV)
                var map = {}
                for (var i = 0 ; i < pureList.length ; i++) {
                    var cur = pureList[i]
                    var o = {...cur,inboundId:cur.inboundId,redeemQuantity:Number(cur.thisQ)}

                    if (map[cur.serialNo]) {
                        map[cur.serialNo].push(o)
                    } else {
                        map[cur.serialNo] = [o]
                    }
                }
                var list = []
                var m = {}
                for (var i = 0 ; i < pureList.length ; i++) {
                    var cur = pureList[i]  // 相同key只添加依次
                    var serialNo = cur.serialNo
                    if (m[serialNo]) {
                        continue
                    } else {
                        m[serialNo] = true
                    }
                    var item = {
                        ...cur,
                        need:cur.thisV-this.getCurPrice(cur) <=0,
                        serialNo: serialNo,
                        redeemGoodsList:map[serialNo],
                        addGoodsList:cur.glist.map(o=>{
                            return {
                                inboundNo:o.serialNo,
                                addQuantity:o.thisPledgeQuantity
                            }
                        }),
                        addGoodsListPure:cur.glist,
                    }

                    list.push(item)
                }
                return list
            },

            thisQvalidator(rule, value, callback){
              if (value > this.detailData.pledgeQuantity) {
                callback('本次解质数量不能大于质押数量')
                return
              }
              callback()
            },
            submitApply(){
                this.baseForm.validateFieldsAndScroll(async (err,values)=>{
                    if (!err) {
                        // 校验

                        let auditChainAndOperator = null
                        try {
                            auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck()
                        }catch(e){
                            auditChainAndOperator = e
                        }
                        
                        if (!auditChainAndOperator) {
                            return 
                        }
                        let flag = true
                        let list = this.getParams()
                        debugger

                        for (var i = 0 ; i < list.length ; i++) {
                            var k = list[i]
                            if (k.glist.length == 0 || k.need == false) {
                                flag = false
                                this.$message.error('融资编号：'+k.serialNo+'的补货物货值需大于等于质押物货值')
                                break
                            }
                        }
                        if (!flag) {
                            return
                        }

                        

                        this.$refs.SubstitutionApplyModal.show({
                            ...this.detailData,
                            financingPledgeVOList:list,
                            thisQ:values.thisQ,
                            thisV:this.getSum(),
                            
                            auditChainAndOperator: auditChainAndOperator== 'noflag' ? null: auditChainAndOperator,
                        })
                    }
                })
            },
            chooseFinGoods(r,item){
                this.detailData.financingPledgeVOList.filter(n=>n.thisV).forEach(i=>{
                    if (i.serialNo == item.serialNo) {
                        i.glist = r
                    }
                })
                this.$forceUpdate()
            },
            openChoose(item,index,getGoodsList){
                this.$refs.ChooseGoods.show(item.glist,this.detailData.storageNo,this.detailData.storageId,item)
            },
            calcNum(record){
                record.thisPledgeGoods = record.thisPledgeQuantity*record.thisPledgePrice
            },
            deleteGItem(item,record){
                //debugger
                this.detailData.financingPledgeVOList.filter(n=>n.thisV).forEach(i=>{
                    if (i.serialNo == item.serialNo) {
                        i.glist.splice(_.findIndex(i.glist,{id:record.id}),1)
                    }
                })
                // this.detailData.financingPledgeVOList[index].glist.splice(_.findIndex(this.detailData.financingPledgeVOList[index].glist,{id:record.id}),1)

            },
            changeV(e){
                let v = Number(e.target.value)
                if (v > this.detailData.pledgeQuantity) return
                let arr = this.detailData.financingPledgeVOList
                // 每次change恢复
                arr.forEach(i=>{
                    i.thisQ = 0
                    i.thisV = 0
                    i.glist = []
                })

                // 从上往下依次质押
                let i = 0
                while(v > 0 && i<arr.length) {
                    if (v >= arr[i].pledgeQuantity) {
                        arr[i].thisQ = arr[i].pledgeQuantity
                        arr[i].thisV = ((arr[i].thisQ||0)*arr[i].pledgePrice).toFixed(2)
                        v = v - arr[i].pledgeQuantity
                        i++
                    } else {
                        arr[i].thisQ = v
                        arr[i].thisV = ((arr[i].thisQ||0)*arr[i].pledgePrice).toFixed(2)
                        break
                    }
                }

            },

            getSum(){
                let n = 0
                this.detailData.financingPledgeVOList.forEach(o=>{
                    if (o.thisV) {
                        n = n + Number(o.thisV)
                    }
                })
                return n.toFixed(2)
            },
            getCurPrice(item){
                let list = item.glist,max = item.thisV,serialNo = item.serialNo
                let n = 0
                list.forEach(o=>{
                    if (o.thisPledgeGoods) {
                        n = n + Number(o.thisPledgeGoods)
                    }
                })
                if (n >= max) {
                    return n.toFixed(2)
                    
                }
                return n.toFixed(2)
            }


        }
        
    }
</script>
<style lang="less" scoped>
    ::v-deep .ant-form-item-label {
        text-align: left;
        label {
            color:#6B6F76;
        }
    }
    .card-desc {
        margin-bottom: 10px;
        font-size: 13px;
    }
    .choose-btn {
        margin-bottom: 20px;
        position: relative;
        z-index: 3;
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
            margin-top:8px;
			margin-bottom: 8px;
			text-overflow: ellipse;
			white-space: nowrap;
			overflow: hidden;
		}

		.ant-row .ant-col {
			margin-bottom: 8px;
            margin-top:8px;
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


</style>
