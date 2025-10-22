<template>
    <header >
      <router-link to='/'>
        <img :src="systemConfig.pageLogin.logo">
      </router-link>
    </header>
</template>

<script lang="js">
import systemConfig from '@/v2/config/common';

export default {
  data () {
    return {
      systemConfig
    }
  }
}
</script>
<style lang="less" scoped>
header{
  position: fixed;
  top: 26px;
  left: 82px;
  width: 100%;
  height: 100px;
  z-index: 1;
  img{
    width: 317px;
    height: 100px;
  }
}
</style>
