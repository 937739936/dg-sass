<template>
  <div class="contentBox slMain">
    <div class="title">
      <a-space :size="20"> 核算表信息 </a-space>
    </div>
    <div class="mb50 content">
      <AttachmentView v-if="editFlag" isShowTip ref="attachmentView" :dataSource="dataFileSource" />
      <FileList :list="attachList" :locked="audit" v-else />
    </div>
  </div>
</template>
<script>
import AttachmentView from './components/AttachmentView.vue';
import FileList from './components/FileList.vue';
export default {
  name: 'AccountsTable',
  components: {
    AttachmentView,
    FileList,
  },
  data() {
    return {
      attachList: [],
    };
  },
  props: {
    editFlag: {
      type: Boolean,
      default: false,
    },
    audit: {
      type: Boolean,
      default: false,
    },
    accountInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  filters: {},
  watch: {
    accountInfo: {
      deep: true,
      immediate: true,
      handler(data) {
        let fileList = data.list;
        if (fileList?.length) {
          this.attachList = fileList;
        }
      },
    },
  },
  mounted() {},
  computed: {
    // 上传附件限制种类
    bankProductAssetConfigList() {
      let bankProductAssetConfigList = this.accountInfo?.bankProductAssetConfigList || [];
      bankProductAssetConfigList = bankProductAssetConfigList
        .filter((item) => item.status == 1 && item.assetAttachType !== 'PAYMENT_ACCOUNTING_TABLE')
        .map((item) => {
          let accept = ['png', 'jpeg', 'jpg', 'bmp'];
          if (item.assetAttachType === 'PAYMENT_ACCOUNTING_TABLE_EXCEL') {
            accept = ['xls', 'xlsx'];
          }
          return {
            key: item.assetAttachType,
            label: item.itemDesc,
            accept,
            required: Boolean(item.required),
          };
        });
      return bankProductAssetConfigList;
    },
    // 核算表数据
    dataFileSource() {
      let list = this.bankProductAssetConfigList.map((item) => {
        let type = item.key;
        let attachmentList = this.attachList.filter((items) => {
          return items.type === type;
        });
        return {
          type,
          typeName: item.label,
          required: item.required,
          acceptFile: item.accept,
          attachmentList,
        };
      });
      return list;
    },
  },
  methods: {
    // 数据输出整理
    onSubmit() {
      // 判断附件
      let attachList = this.attachList;
      if (this.editFlag) {
        attachList = this.$refs.attachmentView.attachmentList;
      }
      var checkRes = this.checkAssetsSubmit(attachList);
      if (checkRes && checkRes.errorStr) {
        return checkRes;
      }
      return { list: attachList };
    },
    checkAssetsSubmit(attachList) {
      var obj = {};
      // 判断附件中是否有必填
      let requiredList = this.bankProductAssetConfigList.filter((item) => item.required);
      if (!requiredList.length) {
        return obj;
      }
      // 判断所有的附件是否包含必填附件信息
      let list = attachList.filter((item) => item.delFlag != 1);
      let flag = requiredList.every((items) => list.some((itemss) => itemss.type === items.key));
      if (!flag) {
        obj.errorStr = '核算表模块-缺少必填附件';
      }
      return obj;
    },
  },
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.contentBox {
  font-size: 14px;
  color: #141517;
  background: none;
  margin: 0;
  min-width: 100%;

  ::v-deep {
    .title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 15px;
      div {
        font-family: PingFang SC;
      }
      .ant-btn {
        padding: 0 10px;
      }
    }
    .mb50 {
      margin-bottom: 50px;
    }
    .content {
    }
  }
}
</style>
