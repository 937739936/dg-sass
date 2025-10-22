<template>
    <a-tooltip  placement="topLeft" :visible="quantityShow">
      <template slot="title">
        <span > {{computeUnit(value)}}</span>
      </template>
      <a-input
        placeholder="请输入融资金额"
        v-bind="$attrsAll" 
        v-on="$listenersAll"
        @blur="quantityShow = false"
        @focus="changeFocus"
        @change="changeValue"
      />
    </a-tooltip>
</template>

<script>
export default {
  props: {
    value: {}
  },
  data() {
    return {
      quantityShow: false,
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
  methods: {
    changeFocus(e) {
      const val = e.target.value
      this.quantityShow = false
      if(val >= 1000) {
        this.quantityShow = true
      }
      this.$emit('focus', e)
    },
    changeBlur(e) {

      this.quantityShow = false
      this.$emit('blur', e)
    },
    changeValue(e) {
      let val = e.target ? e.target.value : e
      this.quantityShow = false
      if(val >= 1000) {
        this.quantityShow = true
      }
      this.$emit('change', e)
    },
    computeUnit(val) {
      let priceUnit  = ''
      if(!val) return 
      if(val >= 1000 && val <10000) {
        priceUnit = '千'
      } else if ( val >= 10000 && val < 100000) {
        priceUnit = '万'
      }  else if ( val >= 100000  && val < 1000000) {
        priceUnit = '十万'
      }  else if (val >= 1000000 && val < 10000000) {
        priceUnit = '百万'
      }  else if (val >= 10000000 && val < 100000000) {
        priceUnit = '千万'
      } else if ( val >= 100000000 &&  val < 1000000000) {
        priceUnit = '亿'
      } else if ( val >= 1000000000 &&  val < 10000000000) {
        priceUnit = '十亿'
      } else if ( val >= 10000000000) {
        priceUnit = '百亿'
      }
      return priceUnit
    },

  },
  components: {

  }
}
</script>

<style scoped  lang='less' >

</style>
