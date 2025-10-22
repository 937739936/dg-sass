<template>
    <div class="contentBox">
        <div class="content" v-if="accountInfo">
            <p class="title">核算表信息</p>
            <p class="sub-title">附件信息</p>
            <!-- 编辑模块 -->
            <template v-if="editFlag">
                <!-- accountInfo.accountingSeal=1核算表需要盖章 -->
                <Upload :receivalVO="receivalVO" v-if="accountInfo.accountingSeal != 1" @uploadFiles="getUploadFiles" type="PAYMENT_ACCOUNTING_TABLE" btnText="上传核算表"></Upload>
                <span v-if="accountInfo.accountingSeal != 1" style="font-family: PingFangSC-Regular;font-size: 12px;color: #C8CCD5;">单个文件最大支持100M，支持多个上传</span>
                <!-- 附件展示 -->
                <a-table :pagination="false" :columns="editFilesColumns" :data-source="editFilesList"  :scroll="{x:true}" rowKey="index">
                    <template slot="type" slot-scope="type">
                        {{CONSTANTS.fileType[type]}}
                    </template>
                    <template slot="name" slot-scope="name,items">
                        <a :href="items.path" target="_blank">{{name}}</a>
                    </template>
                    <!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
                    <template slot="action" slot-scope="action,items" v-if="accountInfo.accountingSeal != 1" >
                        <a-popconfirm
                            v-if="!items.locked && accountInfo.accountingSeal != 1"
                            title="确定删除该附件?"
                            okText="确定"
                            cancelText="取消"
                            @confirm="() => deleteFiles(items)"
                        >
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                </a-table>
            </template>
            <!-- 详情模块 -->
            <template v-if="!editFlag">
                <a-table :pagination="false" :columns="noFileName ? noFileNameFilesColumns:filesColumns" :data-source="filterLockFile(accountInfo.list)"  :scroll="{x:true}" rowKey="index">
                    <template slot="type" slot-scope="type">
                        {{CONSTANTS.fileType[type]}}
                    </template>
                    <template slot="name" slot-scope="name,items">
                        <a :href="items.path" target="_blank">{{name}}</a>
                    </template>
                </a-table>
            </template>
        </div>
    </div>
</template>
<script>
    import Upload from "./Upload.vue"
    import {filterLockFile} from "@/untils/factory.js"
    export default({
        name: 'AccountsTable',
        data() {
            return {
                filterLockFile,
                filesColumns: [
                    { title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots:{customRender: 'name'}},
                    { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'},
                ],
                noFileNameFilesColumns: [
                    { title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots:{customRender: 'name'}},
                ],
                editFilesColumns:[
                    { title: '凭证类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' }},
                    { title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots:{customRender: 'name'}},
                    { title: '转换文件名', dataIndex: 'transferName', key: 'transferName'},
                    { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' },width: 100, align:'center'}
                ], // 编辑附件表头
                fileInfos:[], // 附件信息
                editFilesList: [] // 编辑情况下，附件列表数据
            }
        },
        props: ['editFlag', 'accountInfo','noFileName','receivalVO'],
        components: {
            Upload
        },
        watch: {
            'accountInfo': function () {

                this.initData()
            }
        },
        mounted() {

            this.initData()
        },
        methods: {
            initData(){
                if (this.editFlag) { // 编辑情况下，给表格数据初始化
                    this.editFilesList = Object.assign([],(this.accountInfo||{}).list||[])
                }


            },
            getUploadFiles(data) { // 上传文件 获取附件数据
                this.fileInfos = data;

                // 判断相同类型下不可上传文件名相同且内容相同的文件--start
                let obj = this.accountInfo
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
                this.$message.success('添加成功')
                // 判断相同类型下不可上传文件名相同且内容相同的文件--end

                for (let j=0;j<this.fileInfos.length;j++) {
                    let element = {...this.fileInfos[j]}
                    this.accountInfo.list.push(element)
                    // 对编辑模块数据进行更新
                    if (this.editFlag) {
                        this.editFilesList.push(element)
                    }
                }
            },
            deleteFiles(items) { // 删除附件
                let arr = this.accountInfo.list
                let changeArr = this.editFilesList
                let index = 0
                changeArr.forEach((element,_index)=>{
                    if (element.id == items.id && element.md5Hex == items.md5Hex && element.type == items.type && element.name == items.name) {
                        index = _index
                    }
                })
                changeArr.splice(index,1)
                arr.forEach((element)=>{
                    if (element.id == items.id && element.md5Hex == items.md5Hex && element.type == items.type && element.name == items.name) {
                        element.delFlag = 1
                    }
                })
            },
            onSubmit() {
                return this.accountInfo||{list:[]}
            }
        }
    })
</script>
<style lang="less" scoped>
    .contentBox{
        font-size: 14px;
        color: #141517;
        .content {
            padding: 0 15px;
            .title {
                font-family: PingFangSC-Medium;
                padding-left: 16px;
                text-align: left;
                line-height: 40px;
                font-size: 15px;
                height: 40px;
                background-color: rgba(0, 83, 219,0.15);
            }
            p {
                margin-bottom: 15px;
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
            .redTips {
                color:#F24E4D!important;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                display: inline-block;
                float: right;
                margin-right: 15px;
            }
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
        ::v-deep.ant-table-fixed tr td {height: 42px;}
    }

</style>