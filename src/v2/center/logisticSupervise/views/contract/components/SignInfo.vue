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
          <a-form-item label="签章状态" :colon=false>
              <a-radio-group
                v-decorator="[
                  `signStatus`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `签章状态必填`,
                      }
                    ]
                  }
                ]"
              >
                  <a-radio :value="2">两方签署</a-radio>
                  <a-radio :value="3">三方签署</a-radio>
              </a-radio-group>
          </a-form-item>
        </a-col>
			</a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="仓储方名称" :colon=false>
            <a-input
              disabled
              v-decorator="[
                `sellerName`,
                {
                  rules: [
                    {
                      required: true,
                      message: `仓储方名称必填`,
                    }
                  ]
                }
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="center"
          >
            <a-form-item label="承租方名称" :colon=false>
              <a-input
                disabled
                v-decorator="[
                  `buyerName`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `承租方名称必填`,
                      }
                    ]
                  }
                ]"
              >
              </a-input>
            </a-form-item>
           </a-row>
        </a-col>
        <a-col :span="8" v-if="form.getFieldValue('signStatus') === 3">
          <a-row
            type="flex"
            justify="end"
          >
            <a-form-item label="付费方名称" :colon=false>
               <a-select
                placeholder="请输入付费方名称"
                show-search
                :getPopupContainer="getPopupContainer"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearch"
                v-decorator="[
                  `payCompanyName`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `付费方必填`,
                        type: 'string'
                      }
                    ]
                  }
                ]"
              >
                <a-select-option
                  v-for="(items, index) in payList"
                  :key="index"
                  :value="items.name"
                >
                  {{ items.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
           </a-row>
        </a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import {
	API_getCommonGetCompanyDetailFromQichacha,
} from '@/v2/center/trade/api/receive';
import { mapGetters } from 'vuex';
export default {
	data() {
    return {
      form: this.$form.createForm(this),
      payList: [],
      sellerUscc: '',
    }
	},
  computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
		})
	},
  mounted() {
    this.$nextTick(()=>{
      this.form.setFieldsValue({
        buyerName: this.VUEX_ST_COMPANYSUER.companyName,
      })
    })
  },
	methods: {
    getPopupContainer,
    setSellerName(data) {
      this.sellerUscc = data.storageCompanyUscc
      this.form.setFieldsValue({
        sellerName: data.storageCompanyName,
      })
    },
    initFormData(data) {
			return new Promise(async resolve => {
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            signStatus: data?.signStatus,
            sellerName: data?.sellerName,
            buyerName: data?.buyerName,
          })
          this.sellerUscc = data?.sellerUscc || data?.consigneeCompanyUscc
          if (data?.signStatus === 3) {
            setTimeout(()=>{
              this.form.setFieldsValue({
                payCompanyName: data?.contractDynamicsFields?.payCompanyName
              })
            }, 0)
          }
        })
        resolve(true);
      })
    },
    handleSearch(val) {
      if (val === '' || val.length <4) return
      API_getCommonGetCompanyDetailFromQichacha({
        keyword: val
      }).then(res => {
				if (res.success) {
					this.payList = res.result || [];
				}
			});
    },
    handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
            const obj = {
              ...value,
              sellerUscc: this.sellerUscc,
              buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
            }
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

