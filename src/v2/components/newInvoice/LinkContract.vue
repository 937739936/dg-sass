<template>
  <div>
    <PictureContract v-if="$route.query.handleType == 'img'"></PictureContract>
    <ExcelContract  v-if="$route.query.handleType == 'excel'"></ExcelContract>
  </div>
</template>

<script>
import  PictureContract from './PictureContract.vue'
import  ExcelContract from './ExcelContract.vue'

export default {
  data() {
    return {

    }
  },
  methods: {

  },
  components: {
    PictureContract,
    ExcelContract,
  }
}
</script>

<style scoped>

</style>
