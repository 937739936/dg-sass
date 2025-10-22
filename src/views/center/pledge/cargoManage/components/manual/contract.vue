<template>
    <div class="contentBox">
        <!-- 下游 -->
        <div class="downstreamBox">
            <div class="title">采购合同<!-- <span class="redTips" v-if="editFlag">必须存在附件</span> --></div>
            <div class="divider"></div>
            <div class="content">
                <a-button-group>
                  <a-button
                    v-for="item in [{ label: '关联电子合同', value: 1 }, { label: '上传线下合同', value: 2 }]"
                    :key="item.value"
                    @click="typeChange(item)"
                    :type="item.value === typeIndex ? 'primary' : 'default'">
                      {{ item.label }}
                  </a-button>
                </a-button-group>
                <TypeContract ref="online" @offlineContractNoChange="offlineContractNoChange" :typeKey="1" v-bind="$props" key="1" v-show="typeIndex == 1" />
                <TypeContract ref="offline" @offlineContractNoChange="offlineContractNoChange" @contractNoFocusAndBlur="contractNoFocusAndBlur" :typeKey="2" v-bind="$props" key="2" v-show="typeIndex == 2" />
            </div>
        </div>
    </div>
</template>
<script>
    import { Empty } from 'ant-design-vue';
    import moment from 'moment';
    import Upload from "../Upload.vue"
    import { mapMutations,mapGetters } from "vuex";
    import num from '@/untils/num.js'
    import { API_COMPANYACCOUNTLIST,API_GetAccountsManualcheckContract, API_STORAGEGOODSONLINECONTRACTDETAIL } from "api";
    import ContractList from './ContractList.vue';
    import TypeContract from './TypeContract.vue';
    import {
      API_GetCompanyName
    } from 'api';
    // import _ from 'lodash';
    export default({
        name: 'Contract',
        data() {

            return {

                offlineSellerName: {},
                onlineContractDetail: '',
                contractForm:this.$form.createForm(this),
                accountForm:this.$form.createForm(this),
                editContractFlag:null,
                accMul:num.accMul,
                numberReg:/^(\d+)(\.\d{1,2})?$/,
                contractVisibleTitle:'',
                contractVisible:false,
                companyNameInfo: [],
                contractDetailColumns: [
                    { title: '标的货物名称', dataIndex: 'goodsName', key: 'goodsName'},
                    { title: '单价(元/吨)', dataIndex: 'price', key: 'price'},
                    { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity'},
                    { title: '总价(元)', dataIndex: 'totalPrice', key: 'totalPrice'},
                ],
                contractListDataSource:[],
                contractEditColumns: [
                    { title: '标的货物名称', dataIndex: 'goodsName', key: 'goodsName'},
                    { title: '单价(元/吨)', dataIndex: 'price', key: 'price'},
                    { title: '数量(吨)', dataIndex: 'quantity', key: 'quantity'},
                    { title: '总价(元)', dataIndex: 'totalPrice', key: 'totalPrice'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                filesColumns: [
                    { title: '单据类型', dataIndex: 'type' },
                    { title: '初始文件名', dataIndex: 'originalFileName' },
                    { title: '转换文件名', dataIndex: 'convertFileName' },
                ],
                editFilesColumns:[
                     { title: '凭证类型', dataIndex: 'fileType', key: 'fileType', scopedSlots: { customRender: 'fileType' }},
                    { title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots:{customRender: 'fileName'}},
                    { title: '转换文件名', dataIndex: 'convertFileName', key: 'convertFileName', customRender: (text) => text || '-' },
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                fileInfos:[],
                offlineBaseInfoForm: {},
                baseInfoForm: {
                    contractNo: '',
                    // sellerName: '',
                    // paperContractNo: '',
                    // contractSignTime: null,
                    // doubleSignTime: '',
                    // status: 2,
                    // execDate:null
                },
                offlineBaseInfoRules: {
                    contractNo: [ { required: true, message: '合同编号不能为空', trigger: 'change' },],
                    sellerName: [ { required: true, message: '卖方名称不能为空', trigger: 'change' } ],
                    signTime: [ { required: true, message: '签订⽇期不能为空', trigger: 'change' } ],
                    execDate: [ { required: true, message: '合同执行日期不能为空', trigger: 'change' } ],
                },
                baseInfoRules: {
                    contractNo: [ { required: true, message: '合同编号不能为空', trigger: 'change' },],
                },
                huikuanAccountList:[],
                currentAccountObj:{},
                fileListDataSource:[],
                emptyImage:Empty.PRESENTED_IMAGE_SIMPLE
            }
        },
        props:['editFlag', 'contractInfo','noFileName','lineId','editFile', 'typeIndex'],
        components: {
            TypeContract,
            Upload,
            ContractList,
        },

        computed: {
            ...mapGetters('business', {
                VUEX_MANUAL_ASSET_OBJ: 'VUEX_MANUAL_ASSET_OBJ'
            }),
            ...mapGetters('user', {
                VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
            }),
            mytotalprice(){
                return this.contractListDataSource.reduce((pre,cur)=>{
                    return pre+(cur.quantity*cur.price)
                },0).toFixed(2)
            },
        },
        // watch:{
        //     'contractInfo': function () { // 合同详情数据转成数组格式
        //         this.dealEditData()
        //     }
        // },
        mounted() {
            this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc)

            this.dealEditData()
        },
        methods: {
            moment,
            ...mapMutations({
                VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
            }),
            contractNoFocusAndBlur(value) {
                this.$emit('contractNoFocusAndBlur', value)
            },
            offlineContractNoChange(data) {
                this.$emit('offlineContractNoChange', data)
            },
            sellerNameChange(data) {
                this.offlineSellerName = data
            },
            typeChange(item) {
                this.$emit('typeChange', item.value)
                this.baseInfoForm = {}
                this.onlineContractDetail = ''
                this.fileListDataSource = []
                this.contractListDataSource = []
            },
            getCompanyInfo({ sellerName }) {
                this.baseInfoForm.sellerName = sellerName
            },
            inputCompany(v) {
                if (!v) {
                    return
                }
                API_GetCompanyName({ name: v }).then((res) => {
                const arr = res.data || [];
                if (arr.length === 0) {
                  this.$set(this.form, 'terminalCompanyName', v);
                  return (this.companyNameInfo = []);
                }
                this.companyNameInfo = arr.map((item) => ({
                  name: item.name,
                  value: item.creditCode,
                }));
              });
            },
            getOnlineContractDetail(contractNo) {
                this.baseInfoForm = { contractNo }
                API_STORAGEGOODSONLINECONTRACTDETAIL({ contractNo }).then((res) => {
                    if (res.success) {
                        this.onlineContractDetail = res.data
                        this.contractListDataSource = res.data.goodsList
                        this.contractListDataSource = this.contractListDataSource.map((item) => {
                            return {
                                ...item,
                                price: item.basePrice,
                            }
                        })
                        if (res.data.supplementAttachmentList) {
                            this.fileListDataSource = [...res.data.supplementAttachmentList]
                        }
                        if (res.data.contractAttachment) {
                            this.fileListDataSource = [res.data.contractAttachment, ...this.fileListDataSource ]
                        }
                        this.fileListDataSource = this.fileListDataSource.map((item) => {
                                return {
                                    ...item,
                                    fileName: item.originalFileName,
                                    fileType: item.type,
                                }
                            })
                    }
                })
            },
            showContractList() {
                this.$refs.contractList.showModal();
            },
            dealEditData(){

                if (!this.contractInfo) return
                this.baseInfoForm = {
                    id:this.contractInfo.id||null,
                    paperContractNo: this.contractInfo.paperContractNo,
                    contractSignTime: this.contractInfo.contractSignTime,
                    status: this.contractInfo.status,
                    execDate:[moment(this.contractInfo.execDateStart),moment(this.contractInfo.execDateEnd)]
                }

                this.contractListDataSource = this.contractInfo.manualGoodsVOList||[]

                
                setTimeout(()=>{
                    this.accountForm.setFieldsValue({
                        acctBankId:this.contractInfo.acctBankId
                    })
                    this.selectAccount(this.contractInfo.acctBankId)
                },1000)

                this.fileListDataSource = this.contractInfo.list || []

                if (this.contractInfo.reuseFlag == 1) {
                    this.VUEX_SET_MANUAL_ASSET_OBJ({
                        disableCopy:true
                    })
                }
                
            },

            getBankAccount(companyUscc){
              API_COMPANYACCOUNTLIST({uscc:companyUscc}).then(res=>{
                let data = res.data || []
                let _array = []
                data.forEach(item=>{
                  _array.push({
                    bankName:item.subbranchName,
                    bankNo:item.accountNo,
                    value:item.id,
                    bankAccountName:item.accountName
                  })
                })
                this.huikuanAccountList = _array

              })
            },
            checkContractNo(){
                // 编辑状态下
                if (this.$route.query.id) {
                    return
                }
                let v = this.baseInfoForm.paperContractNo
                API_GetAccountsManualcheckContract({paperContractNo:v,buyerUscc:this.VUEX_MANUAL_ASSET_OBJ.buyerUscc}).then(res=>{

                    if (res.success && res.data) {
                        this.$emit('refreshmanualTerminalContract',res.data.manualTerminalContract)
                        this.$message.info('该合同已在平台存在，将复用原合同信息')
                        this.VUEX_SET_MANUAL_ASSET_OBJ({
                            disableCopy:true
                        })
                    }
                })
                

            },
            selectAccount(c){

                this.currentAccountObj = {}

                this.huikuanAccountList.forEach(item=>{
                  if (item.value == c) {
                    this.currentAccountObj = item
                  }
                })
            },
            deleteContract(item,_index){
                this.contractListDataSource.splice(_index, 1)
            },
            editContract(item,_index){
                this.editContractFlag = _index
                this.contractForm.resetFields()
                this.contractVisible = true
                this.contractVisibleTitle = '编辑货物'
                this.contractForm.setFieldsValue({
                    ...item
                })
            },
            okContract(more){
                this.contractForm.validateFields((error,values)=>{
                    if (!error) {
                        let temp = {}
                        if (this.editContractFlag != null) {
                            temp = this.contractListDataSource[this.editContractFlag]
                            this.contractListDataSource.splice(this.editContractFlag, 1)
                        }
                        this.contractListDataSource.push({
                            ...temp,
                            ...values,
                            totalPrice:num.accMul(values.price,values.quantity),
                            // id:Date.now()
                        })

                        if (more == 'more') {
                            this.contractForm.resetFields()
                        } else {
                            this.contractVisible = false
                        }

                    }
                })
                
            },
            addContract(){
                this.editContractFlag = null
                this.contractForm.resetFields()
                this.contractVisible = true
                this.contractVisibleTitle = '新增货物'
            },

            disabledDate(current) {
                return current && current > moment().endOf('day');
            },
            // getUploadFiles(data) { // 上传文件 获取附件数据
            //     const tempArr = this.fileListDataSource.map((item) =>item.fileType)
            //     if (tempArr.includes('UP_CONTRACT') && data.fileType === 'UP_CONTRACT') {
            //         this.$message.error('只允许上传一个上游补录合同')
            //         return
            //     }
            //     data.forEach((item)=>{
            //         this.fileListDataSource.push(item)
            //     })
            // },
            deleteFiles(items, index) { // 删除附件:disabled="VUEX_MANUAL_ASSET_OBJ.disableCopy"
                 this.fileListDataSource.splice(index, 1)
                // if (this.VUEX_MANUAL_ASSET_OBJ.disableCopy == true && items.id) {
                //     this.$message.error('原合同附件无法删除')
                //     return
                // }
                // this.fileListDataSource[_index].delFlag = 1
            },

            getTime(value, dateString){ // 合同签订日期
                this.baseInfoForm.contractSignTime = dateString
                this.VUEX_SET_MANUAL_ASSET_OBJ({
                    contractSignTime:dateString
                })
            },
            getDoubleTime(value, dateString){ // 双签日期
                this.baseInfoForm.execDateStart = dateString[0]
                this.baseInfoForm.execDateEnd = dateString[1]
            },
            validDoubleTime(rule, value, callback) { // 验证双签日期

                if (!value[0]) {
                    return callback(new Error('请选择合同执行日期'))
                }

                if (this.baseInfoForm.contractSignTime) {
                    const date = moment(this.baseInfoForm.contractSignTime)
                    if (new Date(value[0]) < date) {
                        return callback(new Error('合同执行日期不能小于签订日期'))
                    }
                }
                    
                return callback()
            },
            onSubmitList(){
                return this.fileListDataSource||[]
            },
            onSubmit(callback) {  // 整体提交
                [this.$refs.online, this.$refs.offline][this.typeIndex-1].onSubmit(callback)
            }
        }
    })
</script>
<style lang="less" scoped>
    ::v-deep .fangkuan-select .ant-select-arrow {
        top:23%;
    }
    ::v-deep .fangkuan-select .ant-select-selection {
        height:65px;
    }
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
            .add-other {
                float:right;
                margin-right:15px;
                margin-top: 8px;
            }
            .content {
                padding: 15px;
                .other-title {
                    color: #383A3F;
                    margin-bottom:20px;
                }
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