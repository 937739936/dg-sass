<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-07-01 13:46:04
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-07-01 20:32:06
 * @FilePath: /dg-trade-frontend/src/views/oa/oaApplyOrder.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="take-order-step2-wrap">
    <div class="content">
    <!-- 更具提货申请 -->
      <take-order-step2 v-if="$route.query.serialNo" :labelCol="9" :isOaPage="true" />
      <!-- 更具合同 -->
      <TakeOrderStep v-else></TakeOrderStep>
    </div>
  </div>
</template>

<script>
import TakeOrderStep2 from "@/v2/center/steels/views/takeGoods/order/step2.vue";

import TakeOrderStep from "@/v2/center/steels/views/takeGoods/order/contract/stepTwo.vue";



export default {
  data() {
    return {};
  },
  computed: {
  },
  components: {
    TakeOrderStep2,
    TakeOrderStep,
  },
  methods: {
    // this.financingApplyId = this.$route.query.id||''
  },
  mounted() {

  },
};
</script>

<style lang="less" scoped>
.take-order-step2-wrap {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.content {
  width: 990px;
  height: auto;
  border: 1px solid #ddd;
  box-sizing: border-box;
  padding: 30px;
}
</style>
