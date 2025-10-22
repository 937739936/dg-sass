<template>
  <div class="upload-file-box">
    <a-upload
      name="file"
      :headers="headers"
      :action="action"
      :accept="accept"
      :data="data"
      :list-type="listType"
      :file-list="fileList"
      :beforeUpload="beforeUpload"
      :showUploadList="showUploadList"
      :disabled="disabled"
      :multiple="multiple"
      @preview="handlePreview"
      @change="handleChange"
      class="upload-file-content"
    >
      <slot v-if="!limit || fileList.length < 1">
        <a-button :loading="loading" :disabled="loading" :type="buttonType">
          <a-icon type="upload" />{{ title }}</a-button
        >
      </slot>
      <div class="des" v-if="showDesc">
        支持格式：{{ accept }}格式，单个文件不能超过{{ size }}MB
      </div>
    </a-upload>
    <image-viewer ref="imageViewer" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import imageViewer from "@/v2/components/imageViewer.vue";
import { filePreview } from "@/v2/utils/file";

export default {
  props: {
    accept: {
      type: String,
      default: ".pdf",
    },
    action: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 10,
    },
    value: {
      type: [String, Object, Array],
    },
    title: {
      type: String,
      default: "上传文件",
    },
    showDesc: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String,
      default: "text",
    },
    data: {
      type: Object,
      default: () => {},
    },
    buttonType: {
      type: String,
      default: "default",
    },
    defaultFileList: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Boolean,
      default: false,
    },
    showUploadList: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      fileList: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters('user', {
        VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
    }),
    headers() {
      return {
        Authorization: this.VUEX_ST_TOKEN,
        Source: "PC",
      };
    },
  },
  components: {
    imageViewer,
  },
  watch: {
    defaultFileList: {
      handler(newValue) {
        if (newValue.length) {
          let result = [];
          newValue.forEach((item, index) => {
            result.push({
              url: item.url,
              uid: item?.uid || index,
              status: item?.status || 'done',
              name: item.name,
              timestamp: item.timestamp,
              response: item.response || null
            })
          });
          this.fileList = result;
        }
      },
      immediate: true,
    },
    disabled: {
      handler() {
        // this.fileList = [];
      },
      immediate: true,
    }
  },
  methods: {
    resetFileList() {
      this.fileList = [];
      this.loading = false;
    },
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.size) {
        this.$message.error(`文件${file?.name}大小不能超过${this.size}M`);
        return false;
      }
    },
    handleChange(info) {
      const fileSize = info.file.size / 1024 / 1024;
      if (fileSize > this.size) {
        this.$message.error(`文件 ${info?.file?.name} 大小不能超过${this.size}M`);
        return;
      }
      this.fileList = info.fileList;
      if(info.file.type === 'application/pdf') {
        info.url = require('@/v2/assets/imgs/common/pdf.jpeg');
        const pdfItem = {
          url: require('@/v2/assets/imgs/common/pdf.jpeg'),
          ...this.fileList[this.getFileItemById(info.file.uid)]
        };
        this.$set(this.fileList, this.getFileItemById(info.file.uid), pdfItem);
      }
      this.getUploadFileList();
      if (info?.file?.status === "uploading") {
        this.loading = true;
      }
      this.$emit("change", this.getFileUrlOfFileList());
      if (info?.file?.status === "done") {
        this.loading = false;
        this.$emit("change", this.getFileUrlOfFileList());
        this.$message.success(`文件 ${info?.file?.name} 上传成功`);
      }
      if (info?.file?.status === "error") {
        const errMessage = info?.file?.response?.error?.message || "";
        this.$message.error(`文件 ${info?.file?.name} 上传失败.${errMessage}`);
        this.loading = false;
      }
      if (info?.file?.status === "removed") {
        this.$emit("change", this.getFileUrlOfFileList());
      }
    },
    getResponseFileUrl(file) {
      return file?.response?.data?.fileUrl || file?.response?.data || file?.response?.result || "";
    },
    /**
     * 从fileList中取得url
     * @function getFileUrlOfFileList
     * @params void
     * @return {String} 返回文件url列表字符串
    */
    getFileUrlOfFileList() {
      return this.fileList.map(item => (this.getResponseFileUrl(item))).join();
    },
    /**
     * 根据文件上传id从fileList中找到对应的索引
     * @function getFileItemById
     * @params {String} 文件上传id
     * @return {Number} 索引
    */
    getFileItemById(id) {
      for(let i = 0;i < this.fileList.length;i ++) {
        if(this.fileList[i].uid === id) {
          return i;
        }
      }
      return -1;
    },
    /**
     * 文件变更通知父组件/包含url，文件名，uid，文件上传状态
     * @function getUploadFileList
     * @params void
     * @return void
     */
    getUploadFileList() {
      const result = [];
      this.fileList.forEach((item) => {
        result.push({
          uid: item.uid,
          fileName: item.name,
          status: item.status,
          url: this.getResponseFileUrl(item),
          md5Hex: item?.response?.data?.md5Hex || "",
          timestamp: item?.lastModified
        });
      });
      this.$emit("upload", result);
    },
    handlePreview(file) {
      const url = file?.response?.data?.fileUrl || file?.response?.data || file?.response?.result || file.url || "";
      const previewUrl = url;
      filePreview(previewUrl, this.$refs.imageViewer.show);
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep {
  .ant-upload.ant-upload-select-picture-card {
    position: relative;
  }
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
