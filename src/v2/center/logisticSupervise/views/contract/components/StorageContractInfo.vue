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
          <a-form-item label="仓库名称">
            <!-- 选择框 -->
            <a-select
              placeholder="请选择仓库名称"
              show-search
              :getPopupContainer="getPopupContainer"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              @change="handleChange"
              v-decorator="[
                `warehouseId`,
                {
                  rules: [
                    {
                      required: true,
                      message: `仓库名称必填`,
                      type: 'string'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="(items, index) in warehouseList"
                :key="index"
                :value="items.id"
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
            <a-form-item label="仓储合同编号">
              <!-- 选择框 -->
              <a-row
                type="flex"
                justify="center"
              >
                <a-input
                  placeholder="请输入仓储合同编号"
                  v-decorator="[
                    `paperContractNo`,
                    {
                      rules: [
                        {
                          required: true,
                          message: `仓储合同编号必填`,
                        }
                      ]
                    }
                  ]">
                </a-input>
              </a-row>
            </a-form-item>
          </a-row>
				</a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="end"
          >
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
          </a-row>
        </a-col>
        <a-col :span="8">
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
        </a-col>
        <a-col :span="8">
          <a-row
            type="flex"
            justify="center"
          >
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
          </a-row>
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
	getTransferWarehouseList
} from '@/v2/center/logisticSupervise/api/settle';
import { getPopupContainer } from '@/v2/utils/factory.js';
import moment from 'moment';
export default {
	data() {
    return {
      form: this.$form.createForm(this),
      assetTeamTraderList: [],
      optionList: [],
      warehouseList: [],
      warehouseName: ''
    }
	},
	methods: {
    getPopupContainer,
    filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
    handleChange(val) {
      if (this.warehouseList.length) {
        const arr = this.warehouseList.filter(el=>el.id === val)
        this.warehouseName = arr[0]?.name
        this.$emit('getStorageCompanyName', arr.length ? arr[0]: null)
      }
    },
    initFormData(data) {
			return new Promise(async resolve => {
        await this.getBusinessOwnerList();
        await this.getWarehouseList()
        if (!data) return
        this.warehouseName = data?.contractDynamicsFields?.warehouseName
        this.$nextTick(()=>{
          this.form.setFieldsValue({
            warehouseId: data?.contractDynamicsFields?.warehouseId,
            paperContractNo: data?.paperContractNo,
            contractSignTime: data?.contractSignTime,
            execDate: [moment(data.execDateStart), moment(data.execDateEnd)],
            businessDirectorId: data?.contractExtendInfo?.businessDirectorId
          })
        })
        resolve(true);
      })
    },
    getWarehouseList() {
      return getTransferWarehouseList().then(res => {
				if (res.success) {
			  	this.warehouseList = res.data
				}
			});
    },
    getBusinessOwnerList() {
      return API_get_businessOwnerList().then(res => {
				if (res.success) {
					this.assetTeamTraderList = res.data;
				}
			});
		},
    handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
            const obj = {
              ...value,
	            execDateEnd: value.execDate[1].format('YYYY-MM-DD'),
							execDateStart: value.execDate[0].format('YYYY-MM-DD'),
              warehouseName: this.warehouseName
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

