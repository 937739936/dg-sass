<template>
  <div class="form-select">
    <div>{{addonBeforeTitle}}</div>
    <a-select 
      :value='value' 
      class="select"
      v-on="$listenersAll" 
      @change="changeSelect"
      v-bind="$attrsAll" 
    >
    <i slot="suffixIcon" class=" icon-gengduoshaixuan-xialajiantou1 iconfont" style="font-size:14px" />
    <slot></slot>
    </a-select>
  </div>
</template>

<script>
export default {
   props: ['addonBeforeTitle', 'value'],
  data() {
    return {

    }
  },
  computed: {
    $attrsAll() {
      return {
        value: this.value,
        allowClear:true,
        ...this.$attrs,
      }
    },
    $listenersAll() {
      return Object.assign({}, this.$listeners)
    }
  },
  mounted() {
  },
  methods: {
    changeSelect(value) {
      this.$emit('input', value)
    }
  },

  components: {

  }
}
</script>

<style scoped lang='less'>
.form-select:hover {
  border-color: #CED1DD;
}
.form-select.focus {
  border-color: @primary-color;
}
.form-select {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  padding-left: 12px;
  border-radius: 4px;
  color: rgba(0,0,0,0.4);
  border: 1px solid #E5E6EB;
  width:100%;
  .select {
    flex: 1;
    width: 1%;
    position: relative;
  }
  ::v-deep .ant-select-selection {
    border: none;
    box-shadow: none;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,0.8);
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
    color: #C3C3C3;
  }
  ::v-deep .anticon-close-circle {
    font-size: 14px;
    position: relative;
    left: -3px;
    top: -1px;
  }
  ::v-deep.ant-select-dropdown{
    width: 100%!important;
    left: -0px!important;
  }
  ::v-deep.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #E4EBF4!important;
  }
  ::v-deep.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled) {
    background-color: #f3f5f6!important;
  }
  ::v-deep.ant-select-dropdown-menu-item-selected {
    background-color: #f3f5f6!important;
    font-weight:normal!important;
  }
}

  ::v-deep .ant-input {
    border: none !important;;
    height: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,0.8);
    &:focus {
      border: none;
      box-shadow: none;
    }
  }
  input::-webkit-input-placeholder {
    color:#ABB3C1;
  }
  input::-moz-placeholder {
    color:#ABB3C1;
  }
  input:-ms-input-placeholder{
    color:#ABB3C1;
  }
  input::placeholder{
    color:#ABB3C1;
  }
</style>
