<template>
    <div>
        <div class="title">
            <i class="title_icon"></i>费用项目
        </div>
        <a-row>
            <a-col :span="12" class="row">
                <a-form-item label="运费(元)"  :colon=false>
                    <a-input
                            @blur="emitCalTotalExpense"
                            :disabled="disabled"
                            v-decorator="[
                                      'freightFee',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入运费' },
                                            {
                                                validator: validateIndex
                                            }
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="row">
                <a-form-item label="滞期/速遣费(元)"  :colon=false>
                    <a-input
                            @blur="emitCalTotalExpense"
                            :disabled="disabled"
                            v-decorator="[
                                      'dispatchFee',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入运费' },
                                            {
                                                validator: validateIndex
                                            }
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="row">
                <a-form-item label="港建费(元)"  :colon=false>
                    <a-input
                            @blur="emitCalTotalExpense"
                            :disabled="disabled"
                            v-decorator="[
                                      'portConstructionFee',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入港建费' },
                                            {
                                                validator: validateIndex
                                            }
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="row">
                <a-form-item label="其他费用(元)"  :colon=false>
                    <a-input
                            @blur="emitCalTotalExpense"
                            :disabled="disabled"
                            v-decorator="[
                                      'otherFee',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入其他费用' },
                                            {
                                                validator: validateIndex
                                            }
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="row">
                <a-form-item label="税差(元)"  :colon=false>
                    <a-input
                            @blur="emitCalTotalExpense"
                            :disabled="disabled"
                            v-decorator="[
                                      'taxDifference',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入税差' },
                                            { pattern: /^\d+(\.\d{0,2})?$/, message:'税差为数字，最多两位小数'}
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
            <a-col :span="12" class="row">
                <a-form-item label="费用小计(元)"  :colon=false>
                    <a-input
                            :disabled="true"
                            v-decorator="[
                                      'feeTotal',
                                      {
                                          validateTrigger:'blur',
                                          rules: [
                                            { required: true, message: '请输入费用小计' },
                                            { pattern: /^\d+(\.\d{0,2})?$/, message:'费用小计为数字，最多两位小数'}
                                          ]
                                      },
                                    ]"
                    >
                    </a-input>
                </a-form-item>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    export default {
        name : "ExpenseItem",
        props:['disabled'],
        methods:{
            emitCalTotalExpense(){
                const expenseData = this.$parent.form.getFieldsValue([
                    "freightFee",
                    "dispatchFee",
                    "portConstructionFee",
                    "otherFee",
                    "taxDifference"
                ])
                this.$emit("expenseData",expenseData)
            },
            validateIndex(rule, value, callback){
                if(rule.field == "freightFee" || rule.field == "dispatchFee" || rule.field == "portConstructionFee" || rule.field == "otherFee"){
                    if(value){
                        if(!this.ifTwoDecimal(value) || !this.ifRange(value,0,99999999)){
                            callback('请输入0-99999999间数字，最多两位小数');
                        }
                    }
                    callback();
                }
                callback();
            },
            ifRange(value,value1,value2){
                if ((value >= value1 && value <= value2)) {
                    return true;
                } else {
                    return false;
                }
            },
            ifTwoDecimal(value){
                if(/^\d+(\.\d{0,2})?$/.test(value)){
                    return true;
                }else{
                    return false;
                }
            },
        }
    }
</script>

<style scoped>

</style>
