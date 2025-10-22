<template>
    <span
        >{{s}}
        <a-tooltip placement="top" trigger="click">
            <template slot="title">
                <span>{{t}}</span>
            </template>
            <a-icon type="question-circle" theme="filled" />
        </a-tooltip>
    </span>
</template>

<script>
export default {
  name: 'tableTooltip',
  props: {
    t: { // 提示语
      type: String,
      default: ''
    },
    s: { // 状态
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  mounted() {
  }
}
</script>

<style></style>
