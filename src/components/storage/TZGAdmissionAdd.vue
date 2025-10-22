<!-- 泰州港-新增/修改入港信息 -->
<template>
  <div class="admission-add-tzg">
    <a-modal
      class="admission-add-tzg-model"
      v-model="visible"
      :title="title + '入港信息'"
      okText="保存"
      @ok="handleOk"
      @cancel="visible=false"
      :width="660">
      <a-form-model
        v-if="visible"
        ref="addForm"
        :model="form"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <!-- 输入时只能是易煤的核心企业类型，模糊显示10条核心企业清单 -->
        <a-form-model-item prop="companyName" label="公司名称">
          <a-select
            v-model="form.companyName"
            show-search
            placeholder="请输入公司名称"
            :default-active-first-option="false"
            :show-arrow="false"
            :not-found-content="fetching ? undefined : '暂无数据'"
            @select="handleNameSelect"
            @search="getCompanyList">
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="(item) in companyNameList"
              :key="item.id"
              :value="JSON.stringify(item)">{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="inDate" label="日期">
          <a-date-picker v-model="form.inDate" format="YYYY-MM-DD" @change="handleDateChange" />
        </a-form-model-item>
        <a-form-model-item prop="operateType" label="作业方式">
          <!--作业方式，对应字典harbor_operate_type-->
          <a-select v-model="form.operateType" placeholder="请选择" @change="handleTypeChange">
            <a-select-option
              v-for="item in operateTypeList"
              :key="item.value"
              :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 6-入港卸货 -->
        <a-form-model-item v-if="form.operateType == '6'" prop="shipName" label="船名">
          <a-input v-model="form.shipName" placeholder="请输入船名" />
        </a-form-model-item>
        <a-form-model-item prop="category" label="品种">
          <a-input v-model="form.category" placeholder="请输入品种" />
        </a-form-model-item>
        <a-form-model-item prop="weightTons" label="过磅吨数">
          <a-input v-model="form.weightTons" placeholder="请输入过磅吨数" />
        </a-form-model-item>
        <a-form-model-item label="堆场">
          <a-input v-model="form.yard" placeholder="请输入堆场" />
        </a-form-model-item>
        <a-form-model-item prop="remainTons" label="剩余吨数">
          <a-input v-model="form.remainTons" placeholder="请输入剩余吨数" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import { filterCodeByKey } from '@sub/utils/globalCode.js'
import {
  API_postWarehouseHarborInInsert,
  API_postWarehouseHarborInUpdate,
  API_getCompanyProfileListCoreCompanyByName
} from 'api/storage'
export default {
  name: 'AdmissionAddTZG',
  data () {
    return {
      title: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {},
      rules: {
        companyName: [{required: true,message: '请输入公司名称', trigger: ['blur', 'change']}],
        inDate: [{required: true,message: '请选择日期', trigger: ['blur', 'change']}],
        operateType: [{required: true,message: '请选择作业方式', trigger: ['blur', 'change']}],
        shipName: [{required: true,message: '请输入船名', trigger: ['blur', 'change']}],
        category: [{required: true,message: '请输入品种', trigger: ['blur', 'change']}],
        weightTons: [
          {required: true,message: '请输入过磅吨数', trigger: ['blur', 'change']},
          {pattern: /^\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change']}
        ],
        remainTons: [
          {required: true,message: '请输入剩余吨数', trigger: ['blur', 'change']},
          {pattern: /^\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change']}
        ]
      },
      isEdit: false,
      visible: false,
      fetching: false,
      companyNameList: [],
      timer: null,
      id: '',
      formCache: null
    }
  },
  computed: {
    operateTypeList(){
      let listDefault = filterCodeByKey('harbor_operate_type')
      let list = ["入港卸货","场地货转入"]
      let arr = listDefault.filter(item => { return list.indexOf(item.text)>-1 })
      return arr
    }
  },
  methods: {
    moment(val){
      return moment(val).locale('zh-cn').format('YYYY-MM-DD')
    },
    init(isEdit, obj){
      this.companyNameList = []
      this.isEdit = isEdit
      this.title = isEdit ? '修改' : '新增'
      if (this.isEdit) this.id = obj.id
      if (isEdit) {
        this.form = {
          companyName: obj.companyName,
          companyId: obj.companyId,
          inDate: obj.inDate,
          operateType: obj.operateType+'',
          shipName: obj.shipName,
          category: obj.category,
          weightTons: obj.weightTons,
          yard: obj.yard,
          remainTons: obj.remainTons,
          id: obj.id
        }
        this.getCompanyList(obj.companyName)
      } else {
        this.form = {inDate: this.moment(new Date())}
      }
      this.formCache = Object.assign({}, this.form)
      this.visible = true
    },
    handleDateChange (val, string) {
      this.form.inDate = string
    },
    handleTypeChange (val) {
      this.form.operateType = val
      this.form = {
        ...this.form,
        shipName: this.isEdit && val === this.formCache.operateType ? this.formCache.shipName : undefined
      }
    },
    // 模糊查询公司名称
    getCompanyList(name, isInit){
      if (!name) return false
      clearTimeout(this.timer)
      this.fetching = true
      this.timer = setTimeout(() => {
        API_getCompanyProfileListCoreCompanyByName({
          keyword: name
        }).then(resp => {
          this.fetching = false
          if (resp.success){
            let list = resp.result || []
            let arr = []
            list.forEach(item => {
              arr.push({
                id: item.id,
                name: item.name
              })
            })
            this.companyNameList = arr
            if (isInit) this.handleNameSelect(this.form.companyId)
          }
        })
      }, 300)
    },
    handleNameSelect(val){
      let obj = JSON.parse(val)
      this.form.companyName = obj.name
      this.form.companyId = obj.id
    },
    handleOk () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            harborType: 1 // 1-泰州港
          }
          if (this.isEdit) {
            API_postWarehouseHarborInUpdate(params).then(resp => {
              if (resp.success){
                this.visible = false
                this.$message.success('修改成功')
                this.$emit('updateConfirm')
              }
            })
          } else {
            API_postWarehouseHarborInInsert(params).then(resp => {
              if (resp.success){
                this.visible = false
                this.$message.success('新增成功')
                this.$emit('addConfirm')
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.admission-add-tzg-model{
  ::v-deep.ant-calendar-picker{
    display: inline-block;
    width: 100%;
  }
}
</style>