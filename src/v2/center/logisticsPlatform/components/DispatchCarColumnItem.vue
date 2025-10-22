<template >
  <div>
    <a-form-model-item v-if="record.editable">
      <LicensePlateNumberInput
        v-if="columnTitle == 'licensePlateNumber'"
        v-model="record[columnTitle]"
        v-on:columnItemChange="columnItemChange"
      />
      <a-input-number
        v-else-if="columnTitle == 'loadingWeight'"
        v-model="record[columnTitle]"
        :min="0.01"
        :max="200"
        :step="0.01"
        :precision="2"
        style="width: 170px"
        :placeholder="placeholder"
        @blur="columnItemChange"
      />
      <a-date-picker
        v-else-if="columnTitle == 'loadingDate'"
        style="width: 180px"
        :placeholder="placeholder"
        :showTime="{ format: 'HH:mm' }"
        format="YYYY-MM-DD HH:mm"
        valueFormat="YYYY-MM-DD HH:mm"
        v-model="record[columnTitle]"
      >
        <span slot="suffixIcon" class="calendar"></span>
      </a-date-picker>
      <a-input
        v-else
        v-model="record[columnTitle]"
        style="width: 170px"
        :placeholder="placeholder"
        :max-length="columnTitle == 'driverName' ? 50 : null"
        @blur="columnItemChange"
      />
      <div class="table-row-explain-contain">
        <div v-show="isHasInputError" class="table-row-explain">
          <span>{{ isHasInputError }}</span>
        </div>
      </div>
    </a-form-model-item>
    <div
      v-else-if="isEmptyStr(text) == false"
      style="position: relative; width: 170px"
    >
      <a-tooltip placement="topLeft">
        <template
          slot="title"
          v-if="text && text.length > 12 && columnTitle == 'driverName'"
        >
          <span>{{ text }}</span>
        </template>
        <div class="table-row-normal-text">
          <span>{{ text }}</span>
        </div>
      </a-tooltip>
      <div class="table-row-explain-contain">
        <div v-show="isHasInputError" class="table-row-explain">
          <span>{{ isHasInputError }}</span>
        </div>
      </div>
    </div>
    <div v-else style="width: 170px">
      <div class="table-row-error-text">
        <span>{{ isHasInputError }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { checkBoundTruck } from "../api";
import LicensePlateNumberInput from "../components/LicensePlateNumberInput";
export default {
  name: "DispatchCarColumnItem",
  components: {
    LicensePlateNumberInput,
  },
  props: {
    recordItem: Object,
    text: [String, Number],
    index: Number,
    columnTitle: String,
    placeholder: String,
    planId: String,
  },
  data() {
    return {
      record: {},
    };
  },
  computed: {
    isHasInputError: function () {
      let errors = this.record.errors;
      if (errors && errors[this.columnTitle]) {
        return errors[this.columnTitle];
      }
      return null;
    },
  },
  mounted() {
    this.record = this.recordItem;
  },
  methods: {
    isEmptyStr(str) {
      if (str == null || str === "") {
        return true;
      }
      return false;
    },
    isHasInputErrorFuc(record, columnTitle) {
      let errors = record.errors;
      if (errors && errors[columnTitle]) {
        return errors[columnTitle];
      }
      return null;
    },
    async columnItemChange() {
      let errors = this.record.errors ?? {};
      let inputValue = this.record[this.columnTitle];
      let itemError;
      if (this.columnTitle == "licensePlateNumber") {
        let isT =
          /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(
            inputValue
          );
        // 司机姓名  非空 1-50
        if (inputValue == null || inputValue == "") {
          itemError = "请输入车牌号";
        } else if (
          !/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(
            inputValue
          )
        ) {
          itemError = "请输入正确的车牌号";
        } else {
          let res = await checkBoundTruck({
            planId: this.planId,
            licensePlateNumber: inputValue,
          });
          if (!res.success) {
            itemError = "校验失败";
          } else if (res.success && res.data == false) {
            //res.data == true 车牌不存在 , false 车牌存在
            itemError = "该车牌号已录入";
          }
        }
      } else if (this.columnTitle == "driverName") {
        // 司机姓名  非空 1-50

        if (inputValue != null) {
          // let isCh = /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/.test(inputValue)
          // if (!isCh) {
          //     itemError = '请输入正确的司机姓名'
          // }
        }
      } else if (this.columnTitle == "driverMobile") {
        if (
          inputValue != null &&
          inputValue.length > 0 &&
          !/^1[3456789]\d{9}$/.test(inputValue)
        ) {
          itemError = "请输入正确的电话号码";
        }
      } else if (this.columnTitle == "loadingWeight") {
        if (inputValue > 200) {
          itemError = "请输入正确的矿发净重";
        }
      }
      errors[this.columnTitle] = itemError;
      this.$set(this.record, "errors", { ...errors });
      this.$emit(
        "columnItem-Change",
        this.index,
        this.record,
        errors,
        this.columnTitle
      );
      // // this.record.errors = errors
      // this.record = {...this.record, errors}
    },
  },
};
</script>

<style lang="less" scoped>
.table-row-normal-text {
  line-height: 38px;
  height: 38px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-row-empty-text {
  line-height: 0px;
  height: 0;
}
.table-row-error-text {
  color: #d44;
  font-size: 14px;
}
.table-row-explain-contain {
  // background-color: aqua;
  position: relative;
  display: flex;
}
.table-row-explain {
  position: absolute;
  color: #d44;
  font-size: 12px;
  line-height: 0px;
  margin-top: 3px;
}
.calendar {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
  background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
  background-size: contain;
  line-height: 38px !important;
  top: 16px;
}
</style>