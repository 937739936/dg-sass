<template>
    <div id="shipInfo">
        <div class="title">
            <i class="title_icon"></i>船舶信息
            <span class="remarks" v-if="freightPayType != filterCodeByTextName('下游支付', 'freightPayTypeDict') && !disabled">(至少录入一个船舶信息)</span>
        </div>
        <div class="train-times-wrap">
            <a-table :dataSource="tableDataSource" :columns="columns" :pagination="false" :locale="{emptyText: '暂无数据'}" :scroll="{x: true}">
                <template slot="operation" v-if="!disabled" slot-scope="text, record, index">
                    <a href="javascript:;" class="edit-btn" @click="editShipInfo(record,index)">编辑</a>
                    <span class="line">|</span>
                    <a-popconfirm
                            v-if="tableDataSource.length"
                            title="确定删除该船舶信息?"
                            okText="确定"
                            cancelText="取消"
                            @confirm="() => onDelete(record.key)"
                    >
                        <a href="javascript:;" class="delete-btn">删除</a>
                    </a-popconfirm>

                </template>
            </a-table>
            <p class="add-wrap"  v-if="!disabled" @click="editShipInfo"><i>+</i>新增船舶</p>
        </div>
        <div class="modal-wrap">
            <a-modal
                title="船舶信息"
                centered
                v-model="modalShipInfoIsShow"
                okText="提交"
                cancelText="取消"
                @ok="modalFormSubmit"
                @cancel="modalCancel"
                class="modal-ship-info"
            >
                <a-form :form="shipInfoform" @submit="modalFormSubmit" layout="inline">
                    <a-row  class="row">
                        <a-col :span="24">
                            <a-form-item label="船舶MMSI" :colon=true>
                                <a-input
                                    :maxLength="9"
                                    placeholder="请输入9位船舶MMSI编号"
                                    v-decorator="['identifierNo', { rules: [
                                        { required: true, message: '请输入船舶MMSI' },
                                        { pattern: /^\d{9}$/, message:'请录入正确的九位MMSI码'},
                                        { validator: validateMMSI }
                                    ],validateTrigger:'blur'}]"
                                    @blur="blurMMSI"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row class="row">
                        <a-col :span="24">
                            <a-form-item label="船舶名称" :colon=false>
                                <a-input v-decorator="['shipName']" disabled />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row  class="row">
                      <a-col :span="24">
                            <a-form-item label="装货量(吨)" :colon=true>
                                <a-input
                                    placeholder="请输入装货量(吨)"
                                    v-decorator="['deliverQuantity', {
                                        rules: [
                                            { required: true, message: '请输入装货量' },
                                            { pattern: /^\d+(\.\d{0,3})?$/, message:'正数，最多精确到小数点后三位小数'},
                                            { validator: validDeliverQuantity }
                                        ] }]"
                                />
                            </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row class="row">
                        <a-col :span="24">
                            <a-form-item label="航次号" :colon=true>
                                <a-input
                                    placeholder="请输入航次号"
                                    v-decorator="['voyageNo', {
                                        rules: [
                                        { pattern: /^.{0,30}$/, message:'最大输入30个字符'},
                                        ]
                                    }]"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row class="row">
                        <a-col :span="24">
                            <a-form-item label="始发港" :colon=true>
                                <a-select
                                    :allowClear = "true"
                                    :getPopupContainer="triggerNode => {
                                        return triggerNode.parentNode || document.body;
                                    }"
                                    placeholder="船舶始发港口名称"
                                    v-decorator="['originPortName', {
                                        rules: [ { required: true, message: '请从靠港记录中选择始发港名称' },  ]
                                    }]"
                                    show-search
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="fetching ? undefined : null"
                                    @select="(v)=>handleStartPortSelect(v,'pri')"
                                    @search="handleStartPortSearch"
                                    @focus="handleStartPortSearch">
                                    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                                    <a-select-option
                                        v-for="item in originPortNameList"
                                        :key="item"
                                        :title="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row class="row">
                        <a-col :span="24">
                            <a-form-item label="到达始发港时间" :colon=true>
                                <a-date-picker
                                    v-if="!originPortInTimeData.length || originPortInTimeData.length === 1"
                                    :show-time="{ format: 'HH:mm' }"
                                    format="YYYY-MM-DD HH:mm"
                                    :getCalendarContainer="triggerNode => {
                                        return triggerNode.parentNode || document.body;
                                    }"
                                    :disabled-date="disabledDate"
                                    :disabled-time="disabledDateTime"
                                    placeholder="请选择到达始发港时间"
                                    v-decorator="['originPortInTime', {
                                        validateTrigger: 'change',
                                        rules: [ { required: true, message: '请选择到达始发港时间' },  ]
                                    }]"
                                    :disabled="!Boolean(shipInfoform.getFieldValue('originPortName'))"
                                    @focus="originPortInTimeFocus"
                                />
                                <a-select
                                    v-else
                                    :allowClear = "true"
                                    :getPopupContainer="triggerNode => {
                                        return triggerNode.parentNode || document.body;
                                    }"
                                    placeholder="请选择到达始发港时间"
                                    v-decorator="['originPortInTime', {
                                        rules: [ { required: true, message: '请选择到达始发港时间' },  ]
                                    }]"
                                    show-search
                                    :default-active-first-option="false"
                                    :filter-option="false"
                                    @focus="originPortInTimeFocus">
                                    <a-select-option
                                        v-for="(item) in originPortInTimeData"
                                        :key="item"
                                        :title="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row class="row">
                        <a-col :span="24">
                            <a-form-item label="目的港" :colon=true>
                                <a-select
                                    :allowClear = "true"
                                    :getPopupContainer="triggerNode => {
                                        return triggerNode.parentNode || document.body;
                                    }"
                                    placeholder="船舶目的港口名称"
                                    v-decorator="['destinationPortName', {
                                        rules: [ { required: true, message: '请从靠港记录中选择目的港名称' },  ]
                                    }]"
                                    show-search
                                    :default-active-first-option="false"
                                    :show-arrow="false"
                                    :filter-option="false"
                                    :not-found-content="fetching ? undefined : null"
                                    @search="handleEndPortSearch"
                                    @focus="handleEndPortSearch">
                                    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                                    <a-select-option
                                        v-for="(item) in destinationPortNameList"
                                        :key="item"
                                        :title="item">{{item}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <p>船舶信息填写要求：</p>
                <p>1. 请从系统港口清单中选择该船舶的始发港和目的港，无需填写具体码头和地址，选择所属的港口即可。</p>
                <p>2. 请选择或者精确填写船舶到达始发港时间。</p>
            </a-modal>

        </div>
    </div>
</template>

<script>
    import {
        API_getDeliverGetRpcShip,
        API_GetPortList,
        API_GetPortTimeList,
    } from 'api'
    import {filterCodeByTextName} from '@sub/utils/globalCode.js'
    import moment from 'moment';
    import { debounce } from 'lodash';
    export default {
        name : "shipInfo",
        props:{
            freightPayType:{
                required:true
            },
            dataSource:{
                type: Array,
                default: function() {
                    return [];
                }
            },
            disabled:{}
        },
        watch: {
            'dataSource': function(data) { // 发运信息补录切换合同，船舶信息更新
                this.tableDataSource = data
            }
        },
        computed: {
        },
        data() {
            return {
                columns:[
                    { title: '船舶名称', dataIndex:'shipName', },
                    { title: '船舶MMSI', dataIndex:'identifierNo', },
                    { title: '装货量（吨）', dataIndex:'deliverQuantity', },
                    { title: '航次号', dataIndex:'voyageNo', },
                    { title: '始发港', dataIndex:'originPortName', },
                    { title: '到达始发港时间', dataIndex:'originPortInTime', },
                    { title: '目的港', dataIndex:'destinationPortName', },
                    { title: '操作', scopedSlots: { customRender: 'operation' }, dataIndex:'operation', width:120, fixed:'right'}
                ],
                modalShipInfoIsShow:false,
                modifyIndex:0,
                modifyStatus:false,
                shipInfoform: this.$form.createForm(this),
                filterCodeByTextName: filterCodeByTextName,
                fetching: false,
                originPortNameList: [],
                originPortInTimeData: [],
                destinationPortNameList: [],
                shipId: '', // 船舶id
                beforeIdentifierNo: '',
                beforeOriginPort: '',
                beforeDestinatioPort: '',
                tableDataSource: this.dataSource,
                record: {} // 编辑的对象
            }
        },
        mounted(){
          if(this.disabled){
              this.columns = this.columns.filter(item=>{
                  return item.dataIndex != 'operation'
              })
          }
        },
        methods:{
            moment,
            editShipInfo:function (record,index) {
                this.record = record
                this.modalShipInfoIsShow = true;
                this.modifyIndex = index
                this.originPortNameList = [],
                this.originPortInTimeData = [],
                this.destinationPortNameList = [],
                this.$nextTick(()=>{
                    if(typeof record.key !="undefined"){
                        this.modifyStatus = true
                        // 保留编辑前的mmsi、始发港、目的港
                        this.beforeIdentifierNo = record.identifierNo
                        this.beforeOriginPort = record.originPortName
                        this.beforeDestinatioPort = record.destinationPortName
                        // 编辑时恢复数据
                        this.shipInfoform.setFieldsValue({
                            ...record
                        })
                        this.shipId = record.shipId
                        if (record.originPortName) this.handleStartPortSelect(record.originPortName, 'first')
                        if (record.destinationPortName)  this.handleEndPortSelect(record.destinationPortName, 'first')
                    }
                })

            },
            modalFormSubmit: debounce(function (e) {
                e.preventDefault();
                this.shipInfoform.validateFields((err, values) => {
                    if (!err) {
                        if (values.originPortName === values.destinationPortName) {
                            this.$message.error('始发港与目的港不能相同！')
                            return
                        }
                        values.originPortInTime = typeof(values.originPortInTime) === 'object' ? values.originPortInTime.format('YYYY-MM-DD HH:mm') : values.originPortInTime
                        if (values.destinationPortInTime) {
                             values.destinationPortInTime = typeof(values.destinationPortInTime) === 'object' ? values.destinationPortInTime.format('YYYY-MM-DD HH:mm') : values.destinationPortInTime
                        }
                        values.shipId = this.shipId
                        let obj = {
                            ...values,
                            key:new Date().getTime(),
                        }
                        API_getDeliverGetRpcShip({
                            mmsi: values.identifierNo
                        }).then(res => {
                            if (res.result) {
                                obj.shipName = res.result && res.result.shipName
                                this.shipInfoform.setFieldsValue({
                                    'shipName': res.result.shipName
                                })
                                if(!this.modifyStatus){
                                    this.$message.success('添加成功');
                                    this.tableDataSource.push(obj)
                                }else{
                                    this.$message.success('修改成功');
                                    this.tableDataSource.splice(this.modifyIndex,1,obj)
                                }
                                this.modifyStatus = false
                                this.modalShipInfoIsShow = false;
                                this.shipInfoform.resetFields()
                                this.$emit("dataSource",this.tableDataSource)
                            }
                        })
                       
                    }
                });
            }),
            modalCancel:function(){
                this.modifyStatus = false
                this.shipInfoform.resetFields()
            },
            onDelete:function (key) {
                const dataSource = [...this.tableDataSource];
                this.tableDataSource = dataSource.filter(item => item.key !== key);
                this.$message.success('删除成功');
                this.$emit("dataSource",this.tableDataSource)
            },
            validDeliverQuantity(rule, value, callback){
                if(!value) {
                    callback()
                    return
                }
                if(value > 99999999){
                    callback('装货量不能大于99999999')
                }
                callback()
            },

            validateMMSI(rule, value, callback) { // 船舶真实性检查，返回船舶名称
                let passFlag = true
                if (this.tableDataSource.length > 0) {
                    this.tableDataSource.forEach((item) => {
                        if (this.modifyStatus) {
                            if (item.identifierNo != this.beforeIdentifierNo) {
                                passFlag = passFlag && !(item.identifierNo == value)
                            }
                        } else {
                            passFlag = passFlag && !(item.identifierNo == value)
                        }
                    })
                }
                if (!passFlag) {
                    callback('当前发货批次下已添加该船舶，无法重复添加')
                    return
                }
                callback()
            },
            blurMMSI() { // 校验船舶mmsi的真实性
                const identifierNo = this.shipInfoform.getFieldValue('identifierNo')
                let reg = /^\d{9}$/
                if (reg.test(identifierNo)) {
                    this.shipInfoform.setFieldsValue({
                        'shipName': null
                    })
                    API_getDeliverGetRpcShip({mmsi: identifierNo}).then(res => {
                        if (res.result) {
                            this.shipId = res.result.shipId
                            this.shipInfoform.setFieldsValue({
                                'shipName': res.result.shipName
                            })
                            // 编辑时若修改了mmsi,则所有值重置
                            if (this.modifyStatus) {
                                if (identifierNo != this.beforeIdentifierNo) {
                                    this.shipInfoform.setFieldsValue({
                                        'originPortName': null,
                                        'originPortInTime': null,
                                        'destinationPortName': null,
                                        'destinationPortInTime': null,
                                    })
                                }
                            }
                        }
                    })
                } 
            },
            
            handleStartPortSearch: debounce(function(name){ //获取始发港口名称
                this.shipInfoform.validateFields(['identifierNo'],(err) => {
                    if (!err) {
                        if (name && name.length > 100) {
                            this.$message.error('始发港名城不能超过100个字符！')
                            return
                        }
                        this.fetching = true
                        API_GetPortList({
                            keyword: name
                        }).then(res => {
                            this.fetching = false
                            this.originPortNameList = []
                            this.originPortNameList = res.result || []
                            if (!this.originPortNameList.length) {
                                this.originPortNameList.unshift(name)
                            } else {
                                let flag = true
                                this.originPortNameList.forEach(item => {
                                    flag = flag && (item != name)
                                })
                                if (flag) {
                                    this.originPortNameList.unshift(name)
                                }
                            }
                        })
                        
                    }
                })
            }),
            handleStartPortSelect(val,type) { // 选中始发港口名称,获取到达始发港时间数据
                // 始发港每换一个新值，就清除始发港时间
                if (val != this.beforeOriginPort) {
                    this.shipInfoform.setFieldsValue({'originPortInTime': null})
                }
                API_GetPortTimeList({
                    portName: val,
                    mmsi:  this.shipInfoform.getFieldValue('identifierNo')
                }).then(res=>{
                    this.originPortInTimeData = res.result
                    if (this.originPortInTimeData.length === 1) {
                        let flag = true
                        if (this.shipInfoform.getFieldValue('destinationPortInTime')) {
                            let start = new Date(this.originPortInTimeData[0]).getTime()
                            let end = new Date(this.shipInfoform.getFieldValue('destinationPortInTime')).getTime()
                            if (start >= end) {
                                flag = false
                            }
                        }
                        if (flag) {
                            this.shipInfoform.setFieldsValue({'originPortInTime': this.originPortInTimeData[0]})
                        }
                    }
                    if(this.modifyStatus && type == 'first') { // 编辑首次进入恢复默认值
                        this.shipInfoform.setFieldsValue({
                            originPortInTime: this.record.originPortInTime
                        })
                    }
                    this.beforeOriginPort = val
                })
            },
            originPortInTimeFocus() { // 到达港时间获取焦点
                this.shipInfoform.validateFields(['originPortName'],(err) => {
                    if (!err){}
                })
            },
            handleEndPortSearch(name) { //获取到达港口名称
                this.shipInfoform.validateFields(['identifierNo','originPortName','originPortInTime'],(err) => {
                    if (!err) {
                        if (name && name.length > 100) {
                            this.$message.error('目的港名称不能超过100个字符！')
                            return
                        }
                        this.fetching = true
                        API_GetPortList({
                            keyword: name
                        }).then(res => {
                            this.fetching = false
                            this.destinationPortNameList = []
                            this.destinationPortNameList = res.result || []
                            if (!this.destinationPortNameList.length) {
                                this.destinationPortNameList.unshift(name)
                            } else {
                                let flag = true
                                this.destinationPortNameList.forEach(item => {
                                    flag = flag && (item != name)
                                })
                                if (flag) {
                                    this.destinationPortNameList.unshift(name)
                                }
                            }
                        })
                        
                    }
                })
            },
            disabledDate(current) { // 收货日期大于等于该批次的发货日期且小于等于当天日期
                return current && current > moment().endOf("day")
            },
            rangeHours(start, end, value, chooseday, day) {
                const result = []
                if (chooseday === day) {
                    for (let i = start; i < end; i++) {
                        if (i > value) {
                            result.push(i)
                        }
                    }
                }
                return result
            },
            rangeMinutes(start, end, value, chooseday, day, chooseh, h) {
                const result = []
                if (chooseday === day && chooseh === h) {
                    for (let i = start; i < end; i++) {
                        if (i > value) {
                            result.push(i)
                        }
                    }
                }
                return result
            },
            disabledDateTime(date) {
                // 选中的时间
                const choosetime = moment(date).format('HH-mm-ss')
                const chooseday = parseInt(moment(date).format('YYYY-MM-DD').split('-')[2])
                const chooseh = parseInt(choosetime.split('-')[0])
                // 当前时间
                const nowtime = moment().format('HH-mm-ss')
                const day = parseInt(moment().format('YYYY-MM-DD').split('-')[2])
                const h = parseInt(nowtime.split('-')[0])
                const m = parseInt(nowtime.split('-')[1])
                return {
                    disabledHours: () => this.rangeHours(0, 24, h, chooseday, day),
                    disabledMinutes: () => this.rangeMinutes(0, 60, m, chooseday, day, chooseh, h)
                }
            },
        }
    }
</script>

<style lang="less">
#shipInfo{
    .remarks{
        color:#ff1515;
        font-size: 16px;
        padding-left: 44px;
    }
    .train-times-wrap{
        margin-bottom: 30px;
        font-size: 0;
    }
    .add-wrap{
        width:100%;
        margin-top: 30px;
        background: #f9f9f9;
        border-top: 1px dashed #ddd;
        border-bottom: 1px dashed #ddd;
        text-align: center;
        padding:10px 0;
        font-size: 14px;
        i{
            font-size: 20px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            position: relative;
            top: -2px;
        }
        &:hover{
            opacity: .8;
            cursor: pointer;
        }
    }
}
</style>
<style lang="less" scoped>
.modal-ship-info{
  ::v-deep.ant-modal-content{
    width:560px !important;
  }
  ::v-deep.ant-form-item-label{
    width:120px !important;
    display: inline-block;
    text-align: right;
  }
  ::v-deep.row{
    margin-bottom: 18px;
  }
  ::v-deep.ant-form-explain{
    position: absolute !important;
  }
  ::v-deep.ant-form-item-with-help{
    margin-bottom: 0px;
  }
  input{
    width:300px;
  }
  ::v-deep.ant-select{
    width:300px;
  }
  ::v-deep.ant-calendar-picker{
    width:300px;
  }
  ::v-deep.ant-modal-body {
    padding: 12px 24px;
  }
  ::v-deep.ant-modal-header {
    padding: 12px 24px;
  }
}
.line { padding: 0 10px; }

</style>