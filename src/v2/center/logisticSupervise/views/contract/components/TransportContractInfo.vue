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
					<a-form-item label="运输合同编号">
						<!-- 选择框 -->
						<a-input
              placeholder="请输入运输合同编号"
              v-decorator="[
								`paperContractNo`,
								{
									rules: [
										{
											required: true,
											message: `运输合同编号必填`,
										}
									]
								}
							]">
            </a-input>
					</a-form-item>
				</a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="center"
          >
            <a-form-item label="承运人">
              <!-- 选择框 -->
              <a-select
                placeholder="请输入承运人"
                show-search
                :getPopupContainer="getPopupContainer"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @select="handleSelect($event, 'consigneeList')"
                @search="handleSearch($event, 'consigneeList')"
                v-decorator="[
                  `sellerUscc`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `承运人必填`,
                        type: 'string'
                      }
                    ]
                  }
                ]"
              >
                <a-select-option
                  v-for="(items, index) in consigneeList"
                  :key="index"
                  :value="items.creditCode"
                >
                  {{ items.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="end"
          >
            <a-form-item label="托运人">
              <!-- 选择框 -->
              <a-select
                placeholder="请输入托运人"
                show-search
                :getPopupContainer="getPopupContainer"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @select="handleSelect($event, 'consignorList')"
                @search="handleSearch($event, 'consignorList')"
                v-decorator="[
                  `buyerUscc`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `托运人必填`,
                        type: 'string'
                      }
                    ]
                  }
                ]"
              >
                <a-select-option
                  v-for="(items, index) in consignorList"
                  :key="index"
                  :value="items.creditCode"
                >
                  {{ items.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-form-item label="签订日期">
            <a-date-picker
              placeholder="请选择签订日期"
              valueFormat="YYYY-MM-DD"
              v-decorator="[
                `contractSignTime`,
                {
                  rules: [
                    {
                      required: true,
                      message: `签订日期必填`
                    }
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
            <a-form-item label="合同类型">
              <a-select
                placeholder="请选择合同类型"
                v-decorator="[
                  `contractTermType`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `合同类型必填`
                      }
                    ]
                  }
                ]"
              >
                <a-select-option
                  v-for="(items, index) in contractTimeTypeList"
                  :key="index"
                  :value="items.value"
                >
                  {{ items.text }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="end"
          >
            <a-form-item label="合同有效期">
              <a-range-picker
                :placeholder="['开始日期', '结束日期']"
                v-decorator="[
                  `execDate`,
                  {
                    rules: [
                      {
                        required: true,
                        message: `合同有效期必填`
                      }
                    ]
                  }
                ]"
              />
            </a-form-item>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-form-item label="业务负责人">
            <!-- 选择框 -->
            <a-select
              placeholder="请选择业务负责人"
              show-search
              :getPopupContainer="getPopupContainer"
              :notFoundContent="!optionList.length ? '暂无数据' : '加载中...'"
              :filter-option="filterOption"
              v-decorator="[
                `businessDirectorId`,
                {
                  rules: [
                    {
                      required: true,
                      message: `业务负责人必填`,
                      type: 'string'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="(items, index) in assetTeamTraderList"
                :key="index"
                :value="items.id"
              >
                {{ items.businessUnitName }}-{{ items.memberName }}-{{ items.memberMobile }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import {
	API_get_businessOwnerList
} from '@/v2/center/trade/api/transportContract';
import {
	API_getCommonGetCompanyDetailFromQichacha,
} from '@/v2/center/trade/api/receive';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import moment from 'moment';
export default {
	data() {
    return {
      form: this.$form.createForm(this),
      consigneeList: [],
      sellerName: '',
      consignorList: [],
      buyerName: '',
      assetTeamTraderList: [],
      optionList: [],
      contractTimeTypeList: filterCodeByKey('contractTermEnums'), //合同类型
    }
	},
	async mounted() {
   
	},
	methods: {
    getPopupContainer,
    filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
    async initFormData(data) {
      await this.getBusinessOwnerList();
      if (!data) return
      await this.handleSearch(data?.sellerName || data?.consigneeCompanyName, 'consigneeList')
      await this.handleSearch(data?.buyerName || data?.consignorCompanyName, 'consignorList')
      this.$nextTick(()=>{
        this.form.setFieldsValue({
          paperContractNo: data?.paperContractNo,
          sellerUscc: data?.sellerUscc || data?.consigneeCompanyUscc,
          buyerUscc: data?.buyerUscc || data?.consignorCompanyUscc,
          contractSignTime: data?.contractSignTime,
          contractTermType: data?.contractTermType,
          execDate: [moment(data.execDateStart), moment(data.execDateEnd)],
          businessDirectorId: data?.contractExtendInfo?.businessDirectorId
        })
      })
      this.sellerName = data?.sellerName || data?.consigneeCompanyName
      this.buyerName = data?.buyerName || data?.consignorCompanyName
    },
    getBusinessOwnerList() {
      return API_get_businessOwnerList().then(res => {
				if (res.success) {
					this.assetTeamTraderList = res.data;
				}
			});
		},
    handleSearch(val, type) {
      return new Promise(async resolve => {
        if (val === '' || val?.length <4) {
          resolve(false)
        }
        const res = await API_getCommonGetCompanyDetailFromQichacha({
          keyword: val
        })
        if (res.success) {
          this[type] = res.result || [];
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    handleSelect(val, type) {
      const obj = {
        consigneeList: 'sellerName',
        consignorList: 'buyerName',
      }
      if (this[type].length) {
        const arr = this[type].filter(el=>el.creditCode === val)
        this[obj[type]] = arr[0]?.name
      }
    },
    handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
            const obj = {
              ...value,
	            execDateEnd: value.execDate[1].format('YYYY-MM-DD'),
							execDateStart: value.execDate[0].format('YYYY-MM-DD'),
              sellerName: this.sellerName,
              buyerName: this.buyerName,
            }
            delete obj.execDate
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

