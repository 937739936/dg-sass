<template>
  <a-row class="footer">
<!--    <ul>-->
<!--      <li>新手指导</li>-->
<!--      <a-divider type="vertical" />-->
<!--      <li>行业资讯</li>-->
<!--      <a-divider type="vertical" />-->
<!--      <li>增值服务</li>-->
<!--      <a-divider type="vertical" />-->
<!--      <li>关于我们</li>-->
<!--      <a-divider type="vertical" />-->
<!--      <li>网站导航</li>-->
<!--      <li>客服电话热线：400-960-1180</li>-->
<!--    </ul>-->
    <ul>
      <li>© {{copyYear}} {{ systemConfig.filingInformation.rightsReserved }}</li>
      <a-divider type="vertical" />
      <li>{{ systemConfig.filingInformation.company }}</li>
      <a-divider type="vertical" />
      <li>{{ systemConfig.filingInformation.no }}</li>
    </ul>
  </a-row>
</template>
<script>
import systemConfig from '@/v2/config/common';

    export default {
        name : "FooterCom",
        data(){
            return {
                copyYear:new Date().getFullYear(),
                systemConfig
            }
        }
    }
</script>
<style lang="stylus" scoped>
.footer ul
    flex-row(center, center)
    color #ffffff
    font-size 14px
    font-family PingFang-SC-Medium
    li
        margin 5px 15px
        cursor pointer
</style>
