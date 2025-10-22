<template>
  <div>
    <a-button> develop1</a-button>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
export default {
  data() {
    return {
      a: '1111'
    }
  },
  mounted() {
    console.log(cloneDeep(a))
  },
  methods: {
  },
  components: {

  }
}
</script>

<style scoped>

</style>
