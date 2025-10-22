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
          <a-form-item label="中转方">
            <!-- 选择框 -->
            <a-select
              placeholder="请选择中转方"
              show-search
              :getPopupContainer="getPopupContainer"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              @search="handleSearch"
              v-decorator="[
                `transitParty`,
                {
                  rules: [
                    {
                      required: true,
                      message: `中转方必填`,
                      type: 'string'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="(items, index) in transferList"
                :key="index"
                :value="items.name"
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
				  	<a-form-item label="中转合同编号">
              <a-input
                placeholder="请输入中转合同编号"
                :maxLength="100"
                v-decorator="[
                  `transferNo`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `中转合同编号必填`,
                      }
                    ]
                  }
                ]">
              </a-input>
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
export default {
	data() {
    return {
      form: this.$form.createForm(this),
      transferList: [],
    }
	},
	async mounted() {
	},
	methods: {
    getPopupContainer,
    initFormData(data) {
      const val = data?.contractDynamicsFields
			return new Promise(async resolve => {
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            transitParty: val?.transitParty,
            transferNo: val?.transferNo,
          })
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
					this.transferList = res.result || [];
				}
			});
    },
    handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
            const obj = {
              ...value
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
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 999;
}
</style>

