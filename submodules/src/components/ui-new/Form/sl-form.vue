<template>
  <div class="sl-form">
    <!-- 当前检索项 -->
    <a-row
      v-if="searchArrFilterNull.length > 0 && isShowReset"
      class="search-box"
      type="flex"
      justify="start"
      :gutter="12"
    >
      <a-col> 当前搜索： </a-col>
      <a-col type="flex" justify="start" v-for="(item, index) in searchArrFilterNull" :key="index">
        <div class="search-item">
          <span class="search-item-text">{{ item.name }}：{{ item.value }}</span>
          <em class="clear-icon" @click="delSearchItems(item)"></em>
        </div>
      </a-col>
      <a-col class="rest-btn" @click="reset()">清除全部</a-col>
    </a-row>
    <!-- form表单 -->
    <a-form :form="form" v-bind="$attrs">
      <a-row :gutter="{ xs: 24, sm: 24, xxl: 60 }">
        <a-col 
          v-if="customRender(item)"
          v-for="(item, index) in formList" 
          :key="index"
          :xs="item.xs||12" :sm="item.sm||8" :md="item.md||8" :lg="item.lg||(colSpan ? colSpan : 6)" 
        >
          <template v-if="customRender(item)">
            <a-form-model-item class="col" style="height: 34px">
              <!-- 输入框 -->
              <sl-input
                :class="item.inputFlag ? 'focus' : ''"
                v-if="item.type == 'input'"
                @blur="blurFunc(item, $event)"
                @keyup.enter="enter"
                :maxLength="item.maxLength || Infinity"
                v-bind="item"
                @focus="focusFunc(item, $event)"
                @input="input(item, $event)"
                v-decorator="item.decorator"
              >
              </sl-input>
              <!-- 下拉框 -->
              <sl-select
                :class="item.inputFlag ? 'focus' : ''"
                v-if="item.type == 'select'"
                v-bind="item"
                v-decorator="item.decorator"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                dropdownClassName="drop"
                @change="selectChange($event, item)"
                :labelInValue="true"
                @dropdownVisibleChange="(v) => dropdown(v, item)"
              >
                <a-select-option v-for="(opt, i) in item.options" :key="i" :value="opt.value">
                  {{ opt.label }}
                </a-select-option>
              </sl-select>
              <!-- 下拉框--分组-->
              <div class="form-select" v-if="item.type == 'selectOptGroup'">
                <div>{{ item.addonBeforeTitle }}</div>
                <a-select
                  :class="item.inputFlag ? 'focus select' : 'select'"
                  v-decorator="item.decorator"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  dropdownClassName="drop"
                  :labelInValue="true"
                  @change="selectChange($event, item)"
                  @dropdownVisibleChange="(v) => dropdown(v, item)"
                  @search="searchChange($event, item)"
                  option-label-prop="label"
                  :showSearch="item.search"
                  placeholder="请输入指标名称"
                  :filterOption="false"
                >
                  <a-select-opt-group v-for="(items, index) in item.options" :key="index">
                    <span slot="label">{{ items.location }}</span>
                    <a-select-option
                      :value="pro.indicatorId"
                      v-for="(pro, key) in items.selectList"
                      :key="key"
                      :label="items.location + '/' + pro.indexName + '/' + pro.indicatorName + '/' + pro.businessType"
                    >
                      <div slot>
                        <span style="display: inline-block; margin-right: 10px">{{ pro.indexName }}</span
                        ><span style="display: inline-block; margin-right: 10px">{{ pro.indicatorName }}</span
                        ><span style="display: inline-block; margin-right: 10px">{{ pro.businessType }}</span>
                      </div>
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </div>
              <!-- 日期组件 起始日期 和 结束日期 -->
              <sl-range-picker
                :class="item.inputFlag ? 'focus' : ''"
                v-if="item.type == 'rangePicker'"
                v-decorator="item.decorator"
                @openChange="(v) => openChangeOne(v, item)"
                @change="selectChange($event, item)"
                :value-format="item.valueFormat || 'YYYY/MM/DD'"
                :format="item.format || 'YYYY/MM/DD'"
                v-bind="item"
              >
              </sl-range-picker>
              <!-- 日期 -->
              <sl-date-picker
                v-if="item.type == 'datePicker'"
                v-decorator="item.decorator"
                @change="selectChange($event, item)"
                :value-format="item.valueFormat || 'YYYY-MM-DD'"
                :format="item.format || 'YYYY-MM-DD'"
                v-bind="item"
              />
              <!-- 多个输入框 -->
              <div class="multiple" v-if="item.type == 'multiple'">
                <a-input v-decorator="item.children[0].decorator" v-bind="item.children[0]" class="multiple-one">
                  <span slot="addonBefore" v-if="item.addonBeforeTitle">{{ item.addonBeforeTitle }}</span>
                </a-input>
                <p>{{ item.midfix || '-' }}</p>
                <a-input v-decorator="item.children[1].decorator" v-bind="item.children[1]">
                  <span slot="addonAfter" v-if="item.addonAfter">{{ item.addonAfter }}</span>
                </a-input>
              </div>
              <div class="multiple input-group" v-if="item.type == 'input-group'" style="display: flex">
                <a-input
                  v-decorator="item.children[0].decorator"
                  v-bind="item.children[0]"
                  class="multiple-one"
                  @blur="blurFunc(item.children[0])"
                  style="flex: 2"
                >
                  <span slot="addonBefore" v-if="item.addonBeforeTitle">{{ item.addonBeforeTitle }}</span>
                </a-input>
                <p class="input-gird">{{ item.midfix || '-' }}</p>
                <a-input
                  v-decorator="item.children[1].decorator"
                  v-bind="item.children[1]"
                  @blur="blurFunc(item.children[1])"
                  style="flex: 1"
                >
                  <span slot="addonAfter" v-if="item.addonAfter">{{ item.addonAfter }}</span>
                </a-input>
              </div>
            </a-form-model-item>
          </template>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import SlInput from './sl-input.vue';
import SlRangePicker from './sl-range-picker.vue';
import SlSelect from './sl-select.vue';
import SlDatePicker from './sl-date-picker.vue';
import { cloneDeep } from 'lodash';
import moment from 'moment';
export default {
  props: {
    // 展示的数据
    list: {
      type: Array,
      default: () => [],
    },
    // 组件中的col值
    colSpan: {
      type: Number,
      default: 0,
    },
    isShowReset: {
      default: true,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formList: [],
      /** 输出的对象 */
      obj: {},
      searchArr: [], // 搜索项汇总
    };
  },
  watch: {
    list: {
      handler(val) {
        const arr = val || [];
        arr.forEach((el) => {
          // 下拉框
          if (el.optionsConfig && el.options && el.options.length) {
            // 判断 当前 options 数组是否需要转换
            el.options.forEach((opt) => {
              opt.value = opt[el.optionsConfig.value] || el.value || '';
              opt.label = opt[el.optionsConfig.key] || el.label;
            });
          }
          el.inputFlag = false;
        });
        this.formList = arr;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    searchArrFilterNull() {
      if (this.searchArr.length) {
        return this.searchArr.filter((item) => item.value);
      }
      return [];
    },
  },
  methods: {
    // 更新回显数据
    clearFormSearchItem(key, value) {
      this.searchArr = this.searchArr.filter((item) => item.key !== key);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ...this.form.getFieldsValue(),
          [key]: value,
        });
      });
    },
    // 回显检索数据
    initData(data) {
      let initData = cloneDeep(data);
      let that = this;
      // form表单赋值 key：中文 value: 对应的值
      that.formList.forEach((item) => {
        const key1 = item.decorator[0];
        if (initData.hasOwnProperty(key1) && item.type === 'select') {
          const value = initData[key1];
          let itemArr = [];
          let itemObj = {};
          itemArr = item.options.filter((pro) => {
            return pro.value === value;
          });
          if (itemArr.length) {
            itemObj.name = item.addonBeforeTitle;
            itemObj.key = itemArr[0].label;
            itemObj.value = itemArr[0].value;
          }
          initData[key1] = itemObj;
        }
      });
      that.$nextTick(() => {
        that.form.setFieldsValue(initData);
      });
      // 检索条件复制赋值 key：英文标题 value: 中文
      let newData = cloneDeep(data);
      that.formList.forEach((item) => {
        const key1 = item.decorator[0];
        if (newData.hasOwnProperty(key1)) {
          let itemObj = {};
          itemObj.name = item.addonBeforeTitle;
          itemObj.key = key1;
          itemObj.type = item.type;
          if (item.type === 'select') {
            itemObj.value = initData[key1].key;
            newData[key1] = itemObj;
            this.obj[key1] = {
              key: initData[key1].value,
              label: initData[key1].key,
              type: item.type,
            };
          } else if (item.type === 'rangePicker') {
            itemObj.value =
              moment(initData[key1][0]).format('YYYY-MM-DD') + '~' + moment(initData[key1][1]).format('YYYY-MM-DD');
            itemObj.realKey = item.realKey;
            newData[key1] = itemObj;
            delete newData[item.realKey[0]];
            delete newData[item.realKey[1]];
            this.obj[key1] = [
              moment(initData[key1][0]).format('YYYY-MM-DD'),
              moment(initData[key1][1]).format('YYYY-MM-DD'),
            ];
            this.obj[item.realKey[0]] = moment(initData[key1][0]).format('YYYY-MM-DD');
            this.obj[item.realKey[1]] = moment(initData[key1][1]).format('YYYY-MM-DD');
          } else {
            itemObj.value = newData[key1];
            newData[key1] = itemObj;
          }
        }
      });
      let arr = [];
      for (const pro in newData) {
        arr.push(newData[pro]);
      }
      that.searchArr = arr;
    },
    // 回显默认数据
    initDefault(key = 'serialNo', data) {
      let that = this;
      const obj = {};
      obj[key] = data[0].value;
      that.$nextTick(() => {
        that.form.setFieldsValue(obj);
      });
      that.searchArr = data;
    },
    focusFunc(item, e) {
      item.inputFlag = true;
      /** 记录当前获取焦点的时候的值 */
      item.focusFuncValue = e.target.value;
      this.$forceUpdate();
    },
    blurFunc(item, e) {
      let $event = e || { target: '' };

      item.inputFlag = false;
      this.$forceUpdate();
      if (!e) {
        this.getList();
        return;
      }
      if ($event.target.value !== item.focusFuncValue) {
        this.getList();
      }
    },
    enter(e) {
      if (e) {
        e.srcElement.blur();
      } else {
        this.getList();
      }
    },
    dropdown(open, item) {
      // 下拉
      item.inputFlag = open;
      this.$forceUpdate();
    },
    openChangeOne(status, item) {
      item.inputFlag = status;
      this.$forceUpdate();
    },
    getList() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const newParams = { ...values, ...this.obj };
          //重置检索项
          this.searchArr = [];
          this.formList.forEach((el) => {
            // 隐藏的删除
            const flag = this.customRender(el);

            const key = el.decorator[0];
            if (!flag) {
              delete newParams[key];
            } else {
              if (el.type != 'rangePicker' && newParams[key]) {
                const value =
                  el.type == 'select' && el.mode == 'multiple'
                    ? newParams[key].map((el) => el.label).join(',')
                    : newParams[key];
                let itemsObj = {
                  name: el.addonBeforeTitle,
                  value: value,
                  key: key,
                  type: el.type,
                };

                if (el.type == 'select' && el.mode == 'multiple') {
                  newParams[key] = newParams[key].map((el) => el.key).join(',');
                }
                if (el.type == 'select' && el.mode != 'multiple' && el.mode != 'tags') {
                  itemsObj.value = newParams[key].label;
                  newParams[key] = newParams[key].key;
                }
                if (el.type == 'select' && el.mode == 'tags') {
                  itemsObj.value = newParams[key].map((el) => el.label).join();
                  newParams[key] = newParams[key].map((el) => el.key).join();
                }
                if (el.type == 'selectOptGroup') {
                  itemsObj.value = newParams[key].label;
                  newParams[key] = newParams[key].key;
                }
                this.searchArr.push(itemsObj);
              }
              if (el.type === 'input-group') {
                let itemsObj = {
                  name: el.addonBeforeTitle,
                  value: '',
                  key: key,
                  type: el.type,
                  realKey: [el.realKey[0], el.realKey[1]],
                };
                if (newParams[el.realKey[0]] && !newParams[el.realKey[1]]) {
                  itemsObj.value = '>=' + newParams[el.realKey[0]];
                }
                if (!newParams[el.realKey[0]] && newParams[el.realKey[1]]) {
                  itemsObj.value = '<=' + newParams[el.realKey[1]];
                }
                if (newParams[el.realKey[0]] && newParams[el.realKey[1]]) {
                  itemsObj.value = newParams[el.realKey[0]] + ' - ' + newParams[el.realKey[1]];
                }
                this.searchArr.push(itemsObj);
              }
              // 日期范围选择-获取检索项
              if (el.type === 'rangePicker' && newParams[key] !== undefined) {
                let itemsObj = {
                  name: el.addonBeforeTitle,
                  value: this.obj[el.realKey[0]] + '~' + this.obj[el.realKey[1]],
                  key: key,
                  type: el.type,
                  realKey: [el.realKey[0], el.realKey[1]],
                };
                this.searchArr.push(itemsObj);
                newParams[el.realKey[0]] = this.obj[el.realKey[0]].split('/').join('-');
                newParams[el.realKey[1]] = this.obj[el.realKey[1]].split('/').join('-');
                delete newParams[key];
              }
            }
          });
          for (let key in newParams) {
            if (newParams[key] === undefined) {
              delete newParams[key];
            }
            if (Array.isArray(newParams[key])) {
              delete newParams[key];
            }
          }
          this.$emit('change', newParams);
        }
      });
    },
    input(item, val) {
      if (item.trimSpace == true) {
        const keyStr = item.decorator[0];
        this.form.setFieldsValue({
          [keyStr]: val.replace(/\s/g, ''),
        });
      }
    },
    selectChange(val, item) {
      item.inputFlag = false;
      this.$forceUpdate();
      const key = item.decorator[0];
      this.obj[key] = val;
      /*** 判断 真实的 接口需要的日期 字段 */
      if (item.realKey && item.type == 'rangePicker') {
        const key1 = item.realKey[0];
        const key2 = item.realKey[1];
        if (val.length) {
          this.obj[key1] = val[0];
          this.obj[key2] = val[1];
        } else {
          // 日期选择范围删除后更新
          delete this.obj[item.decorator[0]];
          delete this.obj[key1];
          delete this.obj[key2];
        }
      }
      this.customRender(item);
      this.getList();
    },
    searchChange(val, item) {
      this.$emit('searchChange', val);
    },
    // 判断渲染
    customRender(item) {
      if (item.isShow === undefined || item.isShow === null || item.isShow) {
        return true;
      }
      if (typeof item.isShow == 'function') {
        const key = item.decorator[0];
        const values = this.form.getFieldsValue();
        const params = { ...values, ...this.obj };
        return item.isShow(params[key], params);
      }
    },
    // 方便外部进行联动删除
    deleteSearchItemByKey(key) {
      if (!this.searchArrFilterNull || this.searchArrFilterNull.length == 0) {
        return;
      }
      let deleteItem;
      this.searchArrFilterNull.forEach((item) => {
        if (item.key == key) {
          deleteItem = item;
        }
      });
      if (deleteItem) {
        this.delSearchItems(deleteItem);
      }
    },
    // 删除某个检索项
    delSearchItems(item) {
      let key = item.key;

      this.form.setFieldsValue({
        [key]: undefined,
      });
      // 特殊处理--删除下拉框、日期内容
      if (item.type === 'select') {
        delete this.obj[item.key];
      }
      if (item.type === 'datePicker') {
        delete this.obj[item.key];
      }
      if (item.type === 'rangePicker') {
        delete this.obj[item.key];
        delete this.obj[item.realKey[0]];
        delete this.obj[item.realKey[1]];
      }
      if (item.type == 'selectOptGroup') {
        delete this.obj[item.key];
      }
      this.getList();
    },
    // 重置检索项
    reset() {
      // 重置按钮回调父组件函数--重置tabs状态
      this.$emit('resetFunc');
      this.form.resetFields();
      if (this.formList.length) {
        this.formList.forEach((item) => {
          delete this.obj[item.decorator[0]];
          if (item.type === 'rangePicker') {
            delete this.obj[item.realKey[0]];
            delete this.obj[item.realKey[1]];
          }
        });
      }
      if (this.searchArr.length) {
        this.searchArr.forEach((item) => {
          delete this.obj[item.key];
        });
      }
      this.searchArr = [];
      this.getList();
    },
    resetSearchQuery() {
      this.$emit('resetFunc');
      this.form.resetFields();
      if (this.formList.length) {
        this.formList.forEach((item) => {
          delete this.obj[item.decorator[0]];
          if (item.type === 'rangePicker') {
            delete this.obj[item.realKey[0]];
            delete this.obj[item.realKey[1]];
          }
        });
      }
      if (this.searchArr.length) {
        this.searchArr.forEach((item) => {
          delete this.obj[item.key];
        });
      }
      this.searchArr = [];
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.getWidth);
  },
  components: {
    SlInput,
    SlRangePicker,
    SlSelect,
    SlDatePicker,
  },
};
</script>

<style scoped lang="less">
.sl-form {
  padding-left: 1px;
  margin: 10px 0;
  .col {
    margin-top: 20px;
    margin-right: 0;
    width: 100%;
    ::v-deep .ant-form-item-control-wrapper {
      width: 100%;
    }
  }
}
/deep/ .ant-form-item-control {
  line-height: initial !important;
}
.multiple {
  display: flex;
  align-items: center;
  background: #f5f7fd !important;
  border-radius: 4px;
  line-height: 38px;
  /deep/ .ant-input-group-addon {
    border: 0;
    background: #f5f7fd;
    color: 000;
    border-radius: 0;
  }
  /deep/ .ant-input {
    border: none;
    background: #f5f7fd;
    border-radius: 0;
    &:focus {
      border: none;
      box-shadow: none;
    }
  }
  /deep/ .ant-input-group-wrapper {
    top: 0;
  }
  input::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
  input::-moz-placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
  input:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
  input::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
}
.input-group {
  background: #fff !important;
  border-radius: 4px;
  border: 1px solid #e5e6eb;
  height: 34px;
  box-sizing: border-box;
  /deep/ .ant-input-group-addon {
    background: #fff !important;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.4);
  }
  /deep/ .ant-input {
    background: #fff;
    border-radius: 4px;
    padding-left: 4px;
  }
  .input-gird {
    // width: 50px;
  }
  p {
    color: rgba(0, 0, 0, 0.4);
  }
}
.input-group:active {
  border: 1px solid @primary-color;
}
.search-box {
  margin-top: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8495aa;
  line-height: 32px;
  .search-item {
    padding: 0 12px !important;
    background: #f3f5f6;
    border-radius: 4px;
    margin-bottom: 6px;
    .search-item-text {
      color: rgba(0, 0, 0, 0.8);
      display: inline-block;
      margin-right: 12px;
    }
    .clear-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url(~@sub/assets/imgs/common/delete_icon.png) no-repeat 100% / cover;
      position: relative;
      top: 2px;
      cursor: pointer;
    }
  }
  .rest-btn {
    cursor: pointer;
    margin-left: 6px;
  }
}
.form-select {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  padding-left: 12px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.4);
  border: 1px solid #e5e6eb;
  width: 100%;
  .select {
    width: 1%;
    flex: 1;
    position: relative;
  }
  ::v-deep .ant-select-selection {
    border: none;
    box-shadow: none;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.8);
    background: #fff;
    line-height: 32px;
    height: 32px;
  }
  ::v-deep .ant-select-selection__rendered {
    margin-left: 12px;
    height: 32px;
    line-height: 32px;
  }
  ::v-deep .ant-select-arrow {
    color: #c3c3c3;
  }
  ::v-deep .anticon-close-circle {
    font-size: 14px;
    position: relative;
    left: -3px;
    top: -1px;
  }
  ::v-deep.ant-select-dropdown {
    width: 100% !important;
    left: -0px !important;
  }
  ::v-deep.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #e4ebf4 !important;
  }
  ::v-deep.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #fff !important;
  }
  ::v-deep.ant-select-dropdown-menu-item-selected {
    background-color: #fff !important;
    font-weight: normal !important;
  }
  ::v-deep.ant-select-open .ant-select-arrow {
    transform: rotate(180deg);
  }
  ::v-deep.ant-select {
    flex: 1;
  }
}
</style>
