<template>
  <a-modal
    class="slModal cancel-modal-wrap"
    :visible="visible"
    :title="title"
    width="408px"
    @cancel="close"
  >
    <a-form class="slFormDetail" :form="form">
      <a-form-item label="">
        <a-textarea 
          placeholder="请输入作废原因，最多200字"
          :maxLength="200"
          v-decorator="[
            'reason',
            {
              rules: [
                {
                  required: true,
                  message: '请输入作废原因' 
                }
              ],
            },
          ]"
          class="textarea-wrap"
        />
      </a-form-item>
    </a-form>
    <template slot="footer">
      <a-button key="back" @click="visible = false" class="cancel-btn"> 取消 </a-button>
      <a-button key="submit" type="primary" @click="submit"> 提交 </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: this.$form.createForm(this, {name: "cancelModal" }),
      visible: false,
      title: '',
    };
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
  },
  methods: {
    show(data) {
      this.form.resetFields()
      this.title = data;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('cancelSubmit', values.reason)
        }
      })
    },
  },
};
</script>
<style lang="less" scoped>
  .slModal {
    .slFormDetail {
      padding: 0;
    }
  }
  .textarea-wrap {
		width: 450px;
		height: 150px;
		background: rgba(129, 145, 169, 0.1);
		resize: none;
	}
  .cancel-modal-wrap {
    /deep/ .ant-modal-body {
      height: 200px;
    }
  }
</style>
