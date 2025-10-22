<template>
    <div class="contentBox">
        <div class="">
            <div class="title">结算单信息</div>
            <div class="divider"></div>
            <div class="content">
                <div>
                    <!-- 编辑模块 -->
                    <template v-if="editFlag">

                        <div style="text-align:right;margin-bottom:10px;">
                            <a-button ghost type="primary" @click="addSettle">新增</a-button>
                        </div>
                        <a-table :pagination="false" :columns="settleEditColumns" :data-source="fileListDataSource"  :scroll="{x:true}" rowKey="path">
                            <template slot="type" slot-scope="type">
                                {{CONSTANTS.fileType[type]}}
                            </template>
                            <template slot="name" slot-scope="name,items">
                                <a :href="items.fileUrl" target="_blank">{{name}}</a>
                            </template>
                            <template slot="action" slot-scope="action,items,index" >
                                <a style="margin-right:10px;" href="javascript:;" @click="editSettles(items,index)">编辑</a>
                                <a-popconfirm
                                    title="确定删除?"
                                    okText="确定"
                                    cancelText="取消"
                                    @confirm="() => deleteSettles(items,index)"
                                >
                                    <a href="javascript:;">删除</a>
                                </a-popconfirm>
                            </template>
                        </a-table>
                        
                    </template>
                    <!-- 展示模块 -->
                    <template v-if="!editFlag">
                        <a-table :pagination="false" :columns="settleColumns" :data-source="fileListDataSource"  :scroll="{x:true}" rowKey="path">
                            <template slot="type" slot-scope="type">
                                {{CONSTANTS.fileType[type]}}
                            </template>
                            <template slot="name" slot-scope="name,items">
                                <a :href="items.fileUrl" target="_blank">{{name}}</a>
                            </template>
                        </a-table>
                    </template>
                </div>
            </div>
        </div>

        <a-modal
            class="modal"
            width="1000px"
            :visible="settleVisible"
            :title="settleVisibleTitle"
            @ok="okSettle"
            @cancel="()=>{settleVisible=false}">
            <a-form :form="settleVisibleForm"  :label-col="{span: 6}" :wrapper-col="{span: 15 }">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="结算单号">
                            <a-input
                            placeholder="请输入结算单号"
                            v-decorator="[
                                    `serialNo`,
                                    {
                                        rules: [
                                            { required: true, message: `结算单号必填`,whitespace:true},
                                        ],
                                    },
                                ]"
                            >
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item label="结算单价(元/吨)">
                        <a-input
                        placeholder="请输入结算单价"
                        @change="changePrice"
                        v-decorator="[
                                `settleUnitPrice`,
                                {
                                    rules: [
                                        { required: true, message: `结算单价必填`},
                                        {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                    ],
                                },
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item label="结算数量(吨)">
                        <a-input
                        placeholder="请输入结算数量"
                        @change="changePrice"
                        v-decorator="[
                                `settleQuantity`,
                                {
                                    rules: [
                                        { required: true, message: `结算数量必填`},
                                        {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                    ],
                                },
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item label="结算金额(元)">
                        <a-input
                        placeholder=""
                        :disabled="true"
                        v-decorator="[
                                `settleAmount`,
                                {
                                    rules: [
                                        { required: true, message: `结算金额必填`},
                                        {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                    ],
                                },
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    </a-col>
                    <a-col :span="12">
                    <a-form-item label="结算日期" >
                        <a-date-picker
                            placeholder="请输入结算日期"
                            format="YYYY-MM-DD"
                            v-decorator="[
                                `statementTime`,
                                {
                                    rules: [
                                        { required: true, message: `结算日期必填`},
                                    ],
                                },
                            ]"
                            >
                        </a-date-picker>
                    </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <Upload @uploadFiles="getUploadFiles" type="MANUAL_STATEMENT" btnText="上传结算单"></Upload>
            <a-table :pagination="false" :columns="editFilesColumns" :data-source="settleFileList"  :scroll="{x:true}" rowKey="path">
                <template slot="type" slot-scope="type">
                    {{CONSTANTS.fileType[type]}}
                </template>
                <template slot="name" slot-scope="name,items">
                    <a :href="items.fileUrl" target="_blank">{{name}}</a>
                </template>
                <template slot="action" slot-scope="action,items,index" >
                    <a-popconfirm
                        title="确定删除?"
                        okText="确定"
                        cancelText="取消"
                        @confirm="() => deleteFiles(items,index)"
                    >
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
            
        </a-modal>
    </div>
</template>
<script>
    // import { API_STATION} from "api";
    import { Empty } from 'ant-design-vue';
    import moment from 'moment';
    import Upload from "../Upload.vue"
    import { mapGetters } from "vuex";
    import num from '@/untils/num.js'
    // import _ from 'lodash';
    export default({
        name: 'SettlesFiles',
        data() {

            return {
                settleVisibleForm:this.$form.createForm(this),
                accMul:num.accMul,
                numberReg:/^(\d+)(\.\d{1,2})?$/,
                settleVisibleTitle:'',
                settleVisible:false,
                settleFileList:[],
                fileListDataSource:[],
                dataListSource:[],
                settleColumns: [
                    { title: '结算单号', dataIndex: 'serialNo', key: 'serialNo'},
                    { title: '结算日期', dataIndex: 'statementTime', key: 'statementTime'},
                    { title: '结算金额', dataIndex: 'settleAmount', key: 'settleAmount'},
                    { title: '结算数量（吨）', dataIndex: 'settleQuantity', key: 'settleQuantity'},
                    { title: '结算单价（元/吨）', dataIndex: 'settleUnitPrice', key: 'settleUnitPrice'},
                    // { title: '有无附件', dataIndex: 'quantity111', key: 'quantity111'},
                    
                ],
                settleEditColumns: [
                    { title: '结算单号', dataIndex: 'serialNo', key: 'serialNo'},
                    { title: '结算日期', dataIndex: 'statementTime', key: 'statementTime'},
                    { title: '结算金额', dataIndex: 'settleAmount', key: 'settleAmount'},
                    { title: '结算数量（吨）', dataIndex: 'settleQuantity', key: 'settleQuantity'},
                    { title: '结算单价（元/吨）', dataIndex: 'settleUnitPrice', key: 'settleUnitPrice'},
                    // { title: '有无附件', dataIndex: 'quantity111', key: 'quantity111'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],

                filesColumns: [
                    { title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots:{customRender: 'name'}},
                    // { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'}
                ],

                
                editFilesColumns:[
                    { title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots:{customRender: 'name'}},
                    // { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ],
                emptyImage:Empty.PRESENTED_IMAGE_SIMPLE
            }
        },
        props: ['editFlag', 'settlesInfo','noFileName','receivalVO'],
        components: {
            Upload,
        },
        computed: {
            ...mapGetters('user', {
                VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
            }),
        },
        watch:{
            'settlesInfo': function () { // 合同详情数据转成数组格式
                this.dealEditData()
                
            }
        },
        mounted() {
            this.dealEditData()
        },
        methods: {
            moment,
            dealEditData(){
                if (!this.settlesInfo) return
                
                this.fileListDataSource = this.settlesInfo.list || []
            },
            changePrice(){
                let settleQuantity = this.settleVisibleForm.getFieldValue('settleQuantity')
                let settleUnitPrice = this.settleVisibleForm.getFieldValue('settleUnitPrice')
                if (settleQuantity && settleUnitPrice) {
                    this.settleVisibleForm.setFieldsValue({
                        settleAmount:(Number(settleQuantity)*Number(settleUnitPrice)).toFixed(2)
                    })
                }
            },
            editSettles(item,_index){
                this.editSettleFlag = _index
                this.settleVisible = true
                this.settleVisibleTitle = '编辑结算单信息'
                this.settleVisibleForm.resetFields()
                setTimeout(()=>{
                    this.settleVisibleForm.setFieldsValue({
                        ...item,
                        statementTime:moment(item.statementTime)
                    })
                })

                this.settleFileList = item.attachmentList||[]
            },

            deleteSettles(item,_index){
                this.fileListDataSource.splice(_index, 1)
            },

            okSettle(){
                this.settleVisibleForm.validateFields((error,values)=>{
                    if (!error) {
                        let temp = {}
                        if (this.editSettleFlag != null) {
                            temp = this.fileListDataSource[this.editSettleFlag]
                            this.fileListDataSource.splice(this.editSettleFlag, 1)
                        }
                        this.fileListDataSource.push({
                            ...temp,
                            ...values,
                            
                            statementTime:values.statementTime.format('YYYY-MM-DD'),
                            attachmentList:this.settleFileList
                        })

                        this.settleVisible = false
                    }
                })
            },


            addSettle(){
                this.settleVisible = true
                this.settleVisibleTitle = '新增结算单信息'
                this.settleVisibleForm.resetFields()
                this.editSettleFlag = null
                this.settleFileList = []
            },
            getUploadFiles(data) { // 上传文件 获取附件数据

                data.forEach((item)=>{
                    item.fileName = item.name
                    item.fileUrl = item.path
                    this.settleFileList.push(item)
                })
            },
            deleteFiles(items,_index) { // 删除附件
                this.settleFileList.splice(_index, 1)
            },

            onSubmitList(){
                return this.fileListDataSource||[]
            },

            onSubmit() {  // 整体提交

                return  {
                    list:this.fileListDataSource
                }
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
                    background:  @primary-color;
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