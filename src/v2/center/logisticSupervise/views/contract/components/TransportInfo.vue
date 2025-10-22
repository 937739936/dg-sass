<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
			@submit="handleSubmit"
		>
			<a-row>
				<a-col :span="8">
          <a-form-item label="运输方式">
            <a-select
              mode="multiple"
              placeholder="请选择运输方式"
              v-decorator="[
                `transportMode`,
                {
                  rules: [
                    {
                      required: true,
                      message: `运输方式必填`
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="(items, index) in transportMode"
                :key="index"
                :value="items.value"
              >
                {{ items.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="center"
          >
				  	<a-form-item label="起运地">
              <a-input
                placeholder="请输入起运地"
                :maxLength="100"
                v-decorator="[
                  `origin`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `起运地必填`,
                      }
                    ]
                  }
                ]">
              </a-input>
					  </a-form-item>
          </a-row>
				</a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="end"
          >
				  	<a-form-item label="目的地">
              <a-input
                :maxLength="100"
                placeholder="请输入目的地"
                v-decorator="[
                  `destination`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `目的地必填`,
                      }
                    ]
                  }
                ]">
              </a-input>
					  </a-form-item>
          </a-row>
				</a-col>
        <a-col :span="8">
          <a-form-item label="合同价格(元/吨)">
            <a-input-number
              placeholder="请输入合同价格"
              :max="999999999.99"
              :min="0"
              v-decorator="[
                `contractPrice`,
                {
                  rules: [
                    {
                      required: true,
                      message: `合同价格必填`
                    },
                    { pattern: /^\d+(\.\d{0,2})?$/, message:'最多两位小数'}
                  ]
                }
              ]"
            />
          </a-form-item>
				</a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="center"
          >
				  	<a-form-item label="运输吨数">
              <a-input-number
                  placeholder="请输入运输吨数"
                  :max="999999999.9999"
                  :min="0"
                  v-decorator="[
                    `contractQuantity`,
                    {
                      rules: [
                        {
                          required: false,
                          message: `运输吨数必填`
                        },
                        { pattern: /^\d+(\.\d{0,4})?$/, message:'最多四位小数'}
                      ]
                    }
                  ]"
                />
					  </a-form-item>
          </a-row>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
export default {
	data() {
    return {
      form: this.$form.createForm(this),
      transportMode: [
				{ name: '汽运', value: 'AUTOMOBILE' },
				{ name: '火运', value: 'TRAIN' },
				{ name: '船运', value: 'SHIP' }
			],
    }
	},
	methods: {
    getPopupContainer,
    initFormData(data) {
			return new Promise(async resolve => {
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            transportMode: data?.transportMode?.split(','),
            origin: data?.origin,
            destination: data?.destination,
            contractPrice: data?.contractPrice,
            contractQuantity: data?.contractQuantity,
          })
        })
        resolve(true);
      })
    },
    handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
            const obj = Object.assign(value)
            const transportMode = value?.transportMode.join(',')
            obj.transportMode = transportMode
						resolve(obj);
					} else {
						resolve(false);
					}
				});
			});
		},
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding-top: 0;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.slMain {
	/deep/ .ant-calendar-range-picker-input {
		text-align: center !important;
	}
}
</style>

