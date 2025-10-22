<template>
  <div>
    <a-modal
      :visible="visible"
      class="slModal"
      @ok="confirm"
      @cancel="()=>{visible=false}">
        <p class="reminder-tips">提交后，该笔服务费结算单的作废将由数链进行确认！</p>
        <a-row class="content" @click.native.stop>
          <a-row>
            <a-input
              style="width: 90%; margin: 0 auto;margin-top:20px"
              placeholder="请输入原因"
              v-model.trim="reasonName"></a-input>
          </a-row>
        </a-row>
    </a-modal>
  </div>
</template>

<script>
import { suspend } from '@/v2/center/financeCenter/api/index'
export default {
  data() {
    return {
      visible: false,
      reasonName: '',
      info: {}
    }
  },
  methods: {
    show(info) {
      this.info = info
      this.visible = true
    },
    close() {
      this.visible = false
    },
    async confirm() {
      if (!this.reasonName) {
        this.$message.error('原因必填');
        return
      }
      const params = {
        id: this.$route.query.id,
        suspendRemarks: this.reasonName
      }
      await suspend(params)
      this.close()
      this.$message.success('操作成功')
      this.$router.go(-1)
      this.$emit('confirm')
    }
  },
  components: {

  }
}
</script>
<style lang="less" scoped>
  .tip {
    text-align: center;
    padding: 10px;
  }
</style>
<style scoped lang="stylus">
.s-modal
  width 100%
  height 100%
  position fixed
  left 0
  top 0
  background rgba(0,0,0,.4)
  z-index 9999
  flex-row(center, flex-start)
  .content
    width 400px
    height auto
    max-height 500px
    overflow-y auto
    background #ffffff
    padding 0 30px
    border-radius 8px
    position relative
  .btn
    width 90%
    margin 20px 0
    flex-row(flex-end, center)
    background #fff
.s-btn
  flex-row(center, center)

</style>
