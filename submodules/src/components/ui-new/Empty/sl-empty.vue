<template>
  <div>
    <a-empty v-bind="$attrs" :image='emptyImg' ><span slot="description" style="#8B9DB8">当前列表暂无任何信息哦 </span></a-empty>
  </div>
</template>

<script>
import emptyImg from '@/assets/imgs/newInvoice/empty.png'
export default {
  data() {
    return {
      emptyImg,
      
    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped>

</style>
