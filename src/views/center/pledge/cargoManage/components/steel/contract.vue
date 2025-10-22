<template>
    <div class="contentBox" v-if="contractInfo">
        <!-- 上游 -->
        <div class="upstreamBox">
            <div class="title">上游合同信息</div>
            <div class="divider"></div>
            <div class="content">
                <div>
                    <p  class="sub-title">基本信息</p>
                    <a-row>
                        <a-col :span="12">
                            <a-row :gutter="20">
                                <a-col :span="6">合同编号</a-col>
                                <a-col :span="18">{{contractInfo.upContract.contractNo}}</a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="12">
                            <a-row :gutter="20">
                                <a-col :span="6">签订日期</a-col>
                                <a-col :span="18">{{contractInfo.upContract.signDate}}</a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="12">
                            <a-row :gutter="20">
                                <a-col :span="8">到期日期</a-col>
                                <a-col :span="16">{{contractInfo.upContract.endDate}}</a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="12">
                            <a-row :gutter="20">
                                <a-col :span="6">签订状态</a-col>
                                <a-col :span="18" class="doubleSign" v-if="contractInfo.upContract.signStatus=='2'">双签</a-col>
                                <a-col :span="18" class="singleSign" v-if="contractInfo.upContract.signStatus=='1'">单签</a-col>
                            </a-row>
                        </a-col>

                    </a-row>
                </div>

                <div>
                    <p class="sub-title">合同详情</p>
                    <a-table :pagination="false" :columns="contractDetailColumns" :data-source="upstreamContractDetailData"  :scroll="{x:true}" rowKey="id"></a-table>
                </div>

                <div>
                    <p class="sub-title">附件信息</p>
                    <!-- 上游附件信息详情模块 -->
                    <a-table v-if="contractInfo.upContract" :pagination="false" :columns="noFileName ? noFileNameFilesColumns:filesColumns" :data-source="contractInfo.upContract.list"  :scroll="{x:true}" rowKey="path">
                        <template slot="type" slot-scope="type">
                            {{CONSTANTS.fileType[type]}}
                        </template>
                        <template slot="name" slot-scope="name,items">
                            <a :href="items.path" target="_blank">{{name}}</a>
                        </template>
                    </a-table>
                    <div v-else>
                        暂无数据
                    </div>
                </div>
            </div>
        </div>
        <!-- 下游 -->
        <div class="downstreamBox">
            <div class="title">下游合同信息<span class="redTips" v-if="editFlag">必须存在附件</span></div>
            <div class="divider"></div>
            <div class="content">
                <div>
                    <p class="sub-title">基本信息</p>

                    <!-- 下游基本信息详情展示模块 -->
                    <template>
                        <a-row>
                            <a-col :span="12">
                                <a-row :gutter="20">
                                    <a-col :span="6">合同编号</a-col>
                                    <a-col :span="18">{{contractInfo.downContract.contractNo}}</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12">
                                <a-row :gutter="20">
                                    <a-col :span="6">签订日期</a-col>
                                    <a-col :span="18">{{contractInfo.downContract.contractSignTime}}</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12" style="opacity: 0;">
                                <a-row :gutter="20">
                                    <a-col :span="8">1</a-col>
                                    <a-col :span="16">1</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12">
                                <a-row :gutter="20">
                                    <a-col :span="6">签订状态</a-col>
                                    <a-col :span="18" class="doubleSign" v-if="contractInfo.downContract.status=='2'">双签</a-col>
                                    <a-col :span="18" class="singleSign" v-if="contractInfo.downContract.status=='1'">单签</a-col>
                                </a-row>
                            </a-col>

                            <a-col :span="12" v-if="contractInfo.downContract.sellerName">
                                <a-row :gutter="20">
                                    <a-col :span="6">卖方企业名称</a-col>
                                    <a-col :span="18">{{contractInfo.downContract.sellerName}}</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="12" v-if="contractInfo.downContract.sellerName">
                                <a-row :gutter="20">
                                    <a-col :span="6">买方企业名称</a-col>
                                    <a-col :span="18">{{contractInfo.downContract.buyerName}}</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </template>
                </div>

                <div>
                    <p class="sub-title">附件信息</p>
                    <!-- 下游附件编辑模块 -->
                    <template v-if="editFlag">
                        
                        <Upload :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT" btnText="上传下游合同"></Upload>
                        <Upload :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_SUPPLEMENT" btnText="上传补充协议"></Upload>
                        <Upload :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_BID_PROOF" btnText="上传中标佐证"></Upload>
                        <span style="font-family: PingFangSC-Regular;font-size: 12px;color: #C8CCD5;">单个文件最大支持100M，支持多个上传</span>
                        <a-table v-if="contractInfo.downContract" :pagination="false" :columns="editFilesColumns" :data-source="editDownContractList"  :scroll="{x:true}" rowKey="path">
                            <template slot="type" slot-scope="type">
                                {{CONSTANTS.fileType[type]}}
                            </template>
                            <template slot="name" slot-scope="name,items">
                                <a :href="items.path" target="_blank">{{name}}</a>
                            </template>
                            <!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
                            <template slot="action" slot-scope="action,items" >
                                <a-popconfirm
                                    v-if="!items.locked"
                                    title="确定删除该附件?"
                                    okText="确定"
                                    cancelText="取消"
                                    @confirm="() => deleteFiles(items)"
                                >
                                    <a href="javascript:;">删除</a>
                                </a-popconfirm>
                            </template>
                        </a-table>
                        <div v-else>
                            暂无数据
                        </div>
                    </template>
                    <!-- 下游附件详情展示模块 -->
                    <template v-if="!editFlag">
                        <a-table v-if="contractInfo.downContract" :pagination="false" :columns="noFileName ? noFileNameFilesColumns:filesColumns" :data-source="filterLockFile(contractInfo.downContract.list)"  :scroll="{x:true}" rowKey="path">
                            <template slot="type" slot-scope="type">
                                {{CONSTANTS.fileType[type]}}
                            </template>
                            <template slot="name" slot-scope="name,items">
                                <a :href="items.path" target="_blank">{{name}}</a>
                            </template>
                        </a-table>
                        <div v-else>
                            暂无数据
                        </div>
                    </template>
                </div>
            </div>
        </div>


      </div>
    </div>
</template>
<script>
    import { Empty } from 'ant-design-vue';
    import moment from 'moment';
    import Upload from "../Upload.vue"
    import {filterLockFile} from "@/untils/factory.js"
    import _ from 'lodash';
    export default({
        name: 'SteelContract',
        data() {
            let validatePass = (rule, value, callback) => {  // 校验合同金额
                    let regs2 = /^\d+(\.\d{0,2})?$/
                    if (!regs2.test(value) || Number(value) > rule.max) {
                        return callback(new Error(rule.msg))
                    } else {
                        return callback()
                    }
                }
            return {
                filterLockFile:filterLockFile,
                contractDetailColumns: [
                    { title: '标的货物名称', dataIndex: 'goodName', key: 'goodName'},
                    { title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice'},
                    { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity'},
                ],
                upstreamContractDetailData:[], // 上游合同详情数据
                downstreamContractDetailData:[], // 下游合同详情数据
                contractEditColumns: [
                    { title: '标的货物名称', dataIndex: 'goodName', key: 'goodName'},
                    { title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice'},
                    { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                filesColumns: [
                    { title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots:{customRender: 'name'}},
                    { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'}
                ],
                noFileNameFilesColumns: [
                    { title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots:{customRender: 'name'}}
                ],
                
                editFilesColumns:[
                    { title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots:{customRender: 'name'}},
                    { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                fileInfos:[],
                baseInfoForm: {
                    contractNo: '',
                    contractAmount: '',
                    contractSignTime: '',
                    doubleSignTime: '',
                    status: '',
                    endTime: ''
                },
                detailForm: {},
                baseInfoRules: {
                    contractNo: [ { required: true, message: '合同编号不能为空', trigger: 'blur' } ],
                    contractAmount: [
                        { required: true, message: '合同⾦额不能为空', trigger: 'change' }
                    ],
                    contractSignTime: [ { required: true, message: '签订⽇期不能为空', trigger: 'change' } ],
                    endTime: [ { required: true, message: '请选择到期日期', trigger: 'change' } ],
                    doubleSignTime: [ { required: true, message: '双签版合同获得⽇期不能为空', trigger: 'change' } ]
                },
                editContractFlag: false, // 新增、修改合同详情,
                contractDetailForm: {
                    goodsName: '',
                    contractPrice: '',
                    contractQuantity: ''
                },
                contractDetailRules: {
                    goodsName: [ { required: true, message: '标的货物名称不能为空', trigger: 'blur' } ],
                    contractPrice: [
                        { required: true, message: '单价不能为空', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur', max: 9999999999, msg:'请输入0-9999999999,最多两位小数'}
                    ],
                    contractQuantity: [ { required: true, message: '数量不能为空', trigger: 'change' },
                        {validator: validatePass, trigger: 'blur', max: 9999999999, msg:'请输入0-9999999999,最多两位小数'}
                    ]
                },
                downContractInfoFlag: true, // 上游合同基本信息是否填写完整
                downContractFullFlag: true, // 上游合同新增合同详情是否填写完整
                editTradeContractList: [],
                editUpContractList: [],
                editDownContractList: [],
                emptyImage:Empty.PRESENTED_IMAGE_SIMPLE
            }
        },
        props:['editFlag', 'contractInfo','noFileName','lineId','receivalVO'],
        components: {
            Upload,
        },

        watch:{
            'contractInfo': function (data) { // 合同详情数据转成数组格式

                this.dealWithData(data)
            }
        },
        mounted() {
            let data = this.contractInfo
            this.dealWithData(data)
        },
        methods: {
            moment,
            dealWithData(data){
                if (data){
                    this.dealWithCommonData(data)
                }
            },
            dealWithCommonData(data){
                this.upstreamContractDetailData=[]
                let obj = {}
                obj.id = 1
                obj.goodName = data.upContract.goodName
                obj.basePrice = data.upContract.basePrice
                obj.quantity = data.upContract.quantity
                if (data.upContract.goodsVOList) {
                    this.upstreamContractDetailData = data.upContract.goodsVOList
                } else {
                    this.upstreamContractDetailData.push(obj)
                }
                
                this.downstreamContractDetailData=[]
                let pro = {}
                pro.id = 1
                pro.goodName = data.downContract.goodsName
                pro.basePrice = data.downContract.contractPrice
                pro.quantity = data.downContract.contractQuantity
                this.downstreamContractDetailData.push(pro)
                this.contractDetailForm = data.downContract
                this.baseInfoForm = data.downContract


                
                // 编辑附件模块table初始化数据
                if (this.editFlag) {
                    this.editTradeContractList = Object.assign([],data.tradeContract ? data.tradeContract.list : [])
                    this.editUpContractList = Object.assign([],data.upContract ? data.upContract.list : [])
                    this.editDownContractList = Object.assign([],data.downContract ? data.downContract.list : [])
                }
            },


            getUploadFiles(data, type) { // 上传文件 获取附件数据
                this.fileInfos = data;
                 // 遍历arr，把元素分别放入tmp数组(不存在才放)
                let tmp = new Array();
                let obj = {}
                if (type == 'CONTRACT_SUPPLEMENT') obj = this.contractInfo.upContract // 上游合同补充文档
                if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type=='TERMINAL_CONTRACT_BID_PROOF') obj = this.contractInfo.downContract // 下游合同、下游合同补充文档
                if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') obj = this.contractInfo.tradeContract // 贸易背景合同
                
                // 判断相同类型下不可上传文件名相同且内容相同的文件--start
                let sameFlag = true
                for(var i in data){
                    if(obj && obj.list){
                        obj.list.forEach((item)=>{
                            if (item.md5Hex == data[i].md5Hex && item.delFlag == data[i].delFlag && item.name == data[i].name && item.type == data[i].type) {
                                this.$message.error('同类型的附件不能上传相同的文件')
                                sameFlag = false
                            }
                        })
                    }
                }
                if(!sameFlag) return
                // 判断相同类型下不可上传文件名相同且内容相同的文件--end
                this.$message.success('添加成功')

                let project = {}
                let list = []
                for (let i=0; i< this.fileInfos.length; i++) {
                    let element = this.fileInfos[i]
                    // 对contractInfo数据进行更新
                    if (obj) {
                        obj.list.push(element)
                    } else {
                        list.push(element)
                        if (i == this.fileInfos.length-1) {
                            project.list = list
                            if (obj) {
                                obj= project
                            } else {
                                if (type == 'CONTRACT_SUPPLEMENT') this.contractInfo.upContract = project
                                if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type=='TERMINAL_CONTRACT_BID_PROOF') this.contractInfo.downContract = project
                                if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') this.contractInfo.tradeContract = project
                            }
                        }
                    }
                    // 对编辑模块数据进行更新
                    if (this.editFlag) {
                        if (type == 'CONTRACT_SUPPLEMENT') {
                            this.editUpContractList.push(element)
                        }
                        if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT'||type=='TERMINAL_CONTRACT_BID_PROOF') {
                            this.editDownContractList.push(element)
                        }
                        if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
                            this.editTradeContractList.push(element)
                        }
                    }
                }
            },
            deleteFiles(items) { // 删除附件
                let arr = []
                let changeArr = []
                if (items.type == 'CONTRACT_SUPPLEMENT'){ // 上游合同补充文档
                    arr = this.contractInfo.upContract.list
                    changeArr = this.editUpContractList
                }
                if (items.type == 'TERMINAL_CONTRACT' || items.type == 'TERMINAL_CONTRACT_SUPPLEMENT'|| items.type=='TERMINAL_CONTRACT_BID_PROOF'){// 下游合同、下游合同补充文档、中标佐证
                    arr = this.contractInfo.downContract.list
                    changeArr = this.editDownContractList
                }
                if (items.type == 'ASSET_TRADE_BACKGROUND_CONTRACT'){// 贸易背景合同
                    arr = this.contractInfo.tradeContract.list
                    changeArr = this.editTradeContractList
                }
                let index = 0
                changeArr.forEach((element,_index)=>{
                    if (element.id == items.id && element.md5Hex == items.md5Hex && element.type == items.type && element.name == items.name) {
                        index = _index
                    }
                })
                changeArr.splice(index,1)
                arr.forEach((element,index)=>{
                    if (element.id == items.id && element.md5Hex == items.md5Hex && element.type == items.type && element.name == items.name) {
                        element.delFlag = 1
                    }
                })
            },
            onSubmit() {  // 整体提交
                if (this.editFlag) {
                    if (this.$refs.baseInfoForm) {
                        this.$refs.baseInfoForm.validate(valid=>{ //提交下游合同基本信息
                            this.downContractInfoFlag = valid
                        })
                    }
                    if (this.$refs.contractDetailForm) {
                        this.$refs.contractDetailForm.validate(valid=>{  //提交编辑的下游合同详情
                            this.downContractFullFlag = valid
                        })
                    }
                    
                    
                    if (!this.downContractInfoFlag || !this.downContractFullFlag) return
                }

                return  this.contractInfo
            }
        }
    })
</script>
<style lang="less" scoped>
    .contentBox{
        font-size: 14px;
        color: #141517;

        &>div {
            .title {
                font-family: PingFangSC-Medium;
                padding-left: 16px;
                text-align: left;
                line-height: 40px;
                font-size: 15px;
                height: 40px;
                background-color: rgba(0, 83, 219,0.15);
            }
            .sub-title {
                &:before {
                    content:'';
                    float:left;
                    margin-right: 4px;
                    margin-top: 3px;
                    display: block;
                    width: 4px;
                    height: 14px;
                    background: @primary-color;
                }
            }
            .divider {
                background: #f4f5f8;
                height: 1px;
                margin-top:0;
            }

            .content {
                padding: 15px;

                &>div {
                    .row {
                        height: 59px;
                        margin-bottom: 0;
                        ::v-deep.ant-form-item-label {
                            text-align: left;
                        }
                        .ant-form-item-children em{
                            position: absolute;
                            right: -20px;
                        }
                        ::v-deep.ant-table-fixed-columns-in-body {
                            text-align: left;
                        }
                    }
                    &>.ant-row .ant-col .ant-row .ant-col:nth(1) {
                        color: #6B6F76;
                    }
                    &>.ant-row .ant-col .ant-row .ant-col:odd {
                        color: #383A3F;
                    }
                    p {
                        font-family: PingFangSC-Medium;
                        color: #383A3F;
                        text-align: left;
                        line-height: 18px;
                        margin: 15px 0;
                    }
                    &> .ant-row{
                        margin: 15px 0;
                        .ant-col .ant-row .ant-col{
                            margin-bottom: 3px;
                        }
                        .ant-col .ant-row .ant-col:first-child {
                            color: #6B6F76;
                        }
                        .ant-col .ant-row .ant-col:last-child {
                            color: #383A3F;
                        }
                    }
                }
            }
        }
        .doubleSign {
            color: #00AE9D!important;
        }
        .singleSign {
            color: #FF9726!important;
        }
        .red {
            color:#F24E4D!important;
        }
        ::v-deep.ant-table {
            td {
                padding: 10px 12px;
            }
            th {
                padding: 10px 12px;
            }
            .ant-table-thead > tr > th span{
                font-family: PingFangSC-Medium;
                color: #383A3F;
            }
        }
        .redTips {
            color:#F24E4D!important;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            float: right;
            display: inline-block;
            margin-right: 15px;
        }
        ::v-deep.ant-table-fixed tr td {height: 42px;}
    }

</style>