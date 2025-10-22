<!-- 泰州港-新增/修改出港信息 -->
<template>
  <div class="exit-add-tzg">
    <a-modal
      class="exit-add-tzg-model"
      v-model="visible"
      :title="title + '出港信息'"
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
        <!-- 不对字段内容进行控制，非易煤注册企业也可输入 -->
        <a-form-model-item prop="companyName" label="公司名称">
          <a-input v-model="form.companyName" placeholder="请输入公司名称" />
        </a-form-model-item>
        <a-form-model-item prop="outDate" label="日期">
          <a-date-picker v-model="form.outDate" format="YYYY-MM-DD" @change="handleDateChange" />
        </a-form-model-item>
        <a-form-model-item prop="operateType" label="作业方式">
          <a-select v-model="form.operateType" placeholder="请选择" @change="handleTypeChange">
            <a-select-option
              v-for="item in operateTypeList"
              :key="item.value"
              :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 1-出港装货 -->
        <a-form-model-item v-if="form.operateType == '1'" prop="shipName" label="船名">
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
import {
  API_postWarehouseHarborOutInsert,
  API_postWarehouseHarborOutUpdate
} from 'api/storage'
import { filterCodeByKey } from '@sub/utils/globalCode.js'

export default {
  name: 'ExitAddTZG',
  data () {
    return {
      title: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {},
      rules: {
        companyName: [{required: true,message: '请输入公司名称', trigger: ['blur', 'change']}],
        outDate: [{required: true,message: '请选择日期', trigger: ['blur', 'change']}],
        operateType: [{required: true,message: '请选择作业方式', trigger: ['blur', 'change']}],
        shipName: [{required: true,message: '请输入船名', trigger: ['blur', 'change']}],
        category: [{required: true,message: '请输入品种', trigger: ['blur', 'change']}],
        weightTons: [
          {required: true,message: '请输入过磅吨数', trigger: ['blur', 'change']},
          {pattern: /^\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change']}
        ],
        remainTons: [
          {required: true,message: '请输入剩余吨数', trigger: ['blur', 'change']},
          {pattern: /^-?\d+(\.\d*)?$/, message: '请输入数字', trigger: ['blur', 'change']}
        ]
      },
      visible: false,
      isEdit: false,
      inId: undefined,
      formCache: null
    }
  },
  computed: {
    operateTypeList(){
      let listDefault = filterCodeByKey('harbor_operate_type')
      let list = ["出港装货","场地货转出"]
      let arr = listDefault.filter(item => { return list.indexOf(item.text)>-1 })
      return arr
    }
  },
  methods: {
    moment(val){
      return moment(val).locale('zh-cn').format('YYYY-MM-DD')
    },
    init(isEdit, obj, inId){
      this.inId = inId
      this.isEdit = isEdit
      this.title = isEdit ? '修改' : '新增'
      if (isEdit) {
        this.form = {
          companyName: obj.companyName,
          outDate: obj.outDate,
          operateType: obj.operateType+'',
          shipName: obj.shipName,
          category: obj.category,
          weightTons: obj.weightTons,
          yard: obj.yard,
          remainTons: obj.remainTons,
          id: obj.id
        }
      } else {
        this.form = {outDate: this.moment(new Date()), inId: obj.id}
      }
      this.formCache = Object.assign({}, this.form)
      this.visible = true
    },
    // 修改日期
    handleDateChange (val, string) {
      this.form.outDate = string
    },
    // 修改作业方式
    handleTypeChange (val) {
      this.form.operateType = val
      this.form = {
        ...this.form,
        shipName: this.isEdit && val === this.formCache.operateType ? this.formCache.shipName : undefined
      }
    },
    // 确定修改/新增
    handleOk () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            inId: this.inId,
            harborType: 1 // 1-泰州港
          }
          if (this.isEdit){
            API_postWarehouseHarborOutUpdate(params).then(resp => {
              if (resp.success){
                this.visible = false
                this.$message.success('修改成功')
                this.$emit('updateConfirm')
              }
            })
          } else {
            API_postWarehouseHarborOutInsert(params).then(resp => {
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
.exit-add-tzg-model{
  ::v-deep.ant-calendar-picker{
    display: inline-block;
    width: 100%;
  }
}
</style>