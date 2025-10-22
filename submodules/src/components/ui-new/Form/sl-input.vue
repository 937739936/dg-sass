<template>
  <div class="form-input">
    <a-input class="ipt"  
      v-bind="$attrsAll" 
      v-on="$listenersAll" 
      :value='value'
      :allowClear="false"
      autoComplete="off"
    >
      <span slot="addonBefore" >{{addonBeforeTitle}}</span>
    </a-input>
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
        ...this.$attrs,
      }
    },
    $listenersAll() {
      return Object.assign({}, this.$listeners, {input:(event) => this.$emit('input',event.target.value)})
    }
  },
  mounted() {
  },
  methods: {
  },
  components: {

  }
}
</script>

<style scoped lang='less'>
  .ipt {
    border-radius: 4px;
    border: 1px solid #E5E6EB;
  }
  .form-input:hover {
    .ipt {
      border-color: #CED1DD;
    }
  }
  .form-input.focus {
    .ipt {
      border-color: @primary-color;
      caret-color: @primary-color;
    }
  }
  ::v-deep .ant-input-group {
    line-height: 32px !important;
  }
  ::v-deep .ant-input-group-addon {
    border: 0;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,0.4);
    background: #fff;
    padding: 0 12px;
  }
  ::v-deep .ant-input {
    border: none !important;
    background: none;
    height: 32px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,0.8);
    padding: 0;
    &:focus {
      border: none;
      background: none;
      box-shadow: none;
    }
  }

  input::-webkit-input-placeholder {
    color:rgba(0,0,0,0.25);
  }
  input::-moz-placeholder {
    color:rgba(0,0,0,0.25);
  }
  input:-ms-input-placeholder{
    color:rgba(0,0,0,0.25);
  }
  input::placeholder{
    color:rgba(0,0,0,0.25);
  }
</style>
