<template>
  <div class="errorPanel">
    <a-collapse expand-icon-position="right" v-if="type === 'admin' && assetValidateList.length">
      <a-collapse-panel key="1">
        <div slot="header">
          <a-space>
            <a-button type="danger" ghost size="small" @click.stop="ignoreAll"> 忽略 </a-button>
            系统校验错误提示：共{{ assetValidateList.length }}项
          </a-space>
        </div>
        <div v-for="item in assetValidateList" :key="item.id" class="msgItem">
          <a-button type="danger" ghost size="small" @click="() => ignoreOne(item)"> 忽略 </a-button>
          <span v-html="item.msg"></span>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
export default {
  name: 'ErrorPanel',
  inject: {
    ignoreOneParent: { form: 'ignoreOneParent', default: null },
    ignoreAllParent: { form: 'ignoreAllParent', default: null },
  },
  computed: {
    type() {
      return process.env.VUE_APP_SYSTEM_TYPE;
    },
  },
  data() {
    return {};
    //[{msg: "1拟融资金额超出应付账款金额*融资比例"},{msg: "2拟融资金额超出应付账款金额*融资比例"},{msg: "3拟融资金额超出应付账款金额*融资比例"}]
  },
  props: {
    assetValidateList: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
  },
  methods: {
    ignoreAll() {
      if (this.ignoreAllParent) {
        let params = {
          type: this.assetValidateList[0].type,
        };
        this.ignoreAllParent(params);
      }
    },
    async ignoreOne(params, index) {
      if (this.ignoreOneParent) {
        this.ignoreOneParent(params);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.errorPanel {
  ::v-deep {
    .ant-collapse {
      background: #f3f5f6;
      border-color: #e5e6eb;
      margin-bottom: 50px;
      .ant-collapse-item,
      .ant-collapse-content {
        border-color: #e5e6eb;
      }
    }
  }
  .msgItem {
    margin-bottom: 20px;
    &:last-child {
      margin: 0;
    }
    .ant-btn {
      margin-right: 8px;
    }
  }
}
</style>
