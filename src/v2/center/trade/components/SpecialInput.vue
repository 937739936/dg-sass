<template>
  <div class="special" :class="[ disabled? 'disabled'   : '']" @click="openModal">
    <span class="fake-placeholder" v-if="!contactNos">{{placeholder}}</span>
    <div v-for="(item, i) in contactNoList" :key="item" class="item" >
      <span class="contract" style='margin-right:3px'> {{item}}</span>
      <span class="del" @click.stop="del(i)" v-if="!disabled">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM8.41423 4.17195C8.80476 3.78143 9.43792 3.78143 9.82844 4.17195C10.219 4.56247 10.219 5.19564 9.82844 5.58616L8.41458 7.00003L9.82854 8.41399C10.2191 8.80451 10.2191 9.43768 9.82854 9.8282C9.43801 10.2187 8.80485 10.2187 8.41432 9.8282L7.00037 8.41424L5.5858 9.8288C5.19528 10.2193 4.56211 10.2193 4.17159 9.8288C3.78107 9.43828 3.78107 8.80512 4.17159 8.41459L5.58615 7.00003L4.17168 5.58556C3.78116 5.19504 3.78116 4.56187 4.17168 4.17135C4.56221 3.78082 5.19537 3.78082 5.5859 4.17135L7.00037 5.58582L8.41423 4.17195Z" fill="#8495AA"/>
        </svg>
      </span>
     
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false
    },
    placeholder: {
      default: ''
    },
    contactNos: {
      default: null,
    }
  },
  data() {
    return {
      contactNoList: [],
    }
  },
  computed: {

  },
  watch: {
    contactNos: {
      handler(val) {

        if(!val) {
          this.contactNoList = []
          return
        }
        this.contactNoList = val.split(',') || []
      },
      deep: true,
      immediate: true

    }
  },
  methods: {
    del(i) {
      this.contactNoList = this.contactNoList.filter((el, index) => index != i)
      this.$emit('send', this.contactNoList)
    },
    openModal() {
      if(this.disabled) return
      this.$emit('openModal')
    }

  },
  components: {

  }
}
</script>

<style scoped  lang='less' >
.special {
  // width: 364px;
  min-height: 30px;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  text-align: left;
  padding: 5px 10px;
  color: rgba(0, 0, 0, .8);
  max-height: 120px;
  overflow: auto;
  &.disabled {
    background: #F3F5F6;
  }
  .fake-placeholder {
    text-align:left;
    line-height:30px;
    color: rgba(0, 0, 0, .4);
  }
  .item {
    display: flex;
    align-items: center;
    line-height: 22px;
    background: #F3F5F6;
    padding: 2px 5px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 3px;
    margin-top: 3px;
    margin-right: 3px;
  
  }
  .contract {
    display: inline-block;

  }
  .del {
    position: relative;
    top: 2px;
  }
}
</style>
