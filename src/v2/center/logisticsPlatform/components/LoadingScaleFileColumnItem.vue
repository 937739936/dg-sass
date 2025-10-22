<template>
  <div>
    <div v-if="editable" class="uploadContain">
      <span v-if="fileName" class="fileView">
        <a-tooltip>
          <template slot="title">
            {{ fileTime }}
          </template>
          <div class="fileNameView">
            <span class="fileNameText" @click="handlePreview">{{
              fileName
            }}</span>
            <img
              class="detailDelete"
              :src="detailDelete"
              width="14px"
              height="14px"
              @click="deleteDetailTruckImg"
            />
          </div>
        </a-tooltip>
      </span>
      <a-upload
        v-else
        name="file"
        listType="picture-card"
        accept="image/png, image/jpeg, image/jpg, image/bmp"
        :action="truckAction"
        :headers="headers"
        :multiple="false"
        :before-upload="beforeUpload"
        :showUploadList="false"
        @change="handleDetailUploadChange"
      >
        <!-- <a-button type="primary" :ghost="true" class="uploadBtnStyle">上传</a-button> -->
        <div class="fileUploadBtn">
          <span>上传</span>
        </div>
      </a-upload>
    </div>
    <div v-else>
      <span v-if="fileName" class="fileNameText" @click="handlePreview">{{
        fileName
      }}</span>
      <span v-else class="fileNameEmptyText">-</span>
    </div>
    <img
      :src="previewImg"
      style="display: none"
      ref="viewer"
      v-viewer
    />
    <modalInfo
      ref="modalInfo"
      @verify="modalInfoOK"
      :title="'确认删除'"
      :tip="'确认要删除该附件吗，删除后无法恢复'"
    />
  </div>
</template>

<script>
import { API_UPLOAD_STATION } from "@/v2/center/storage/api";
import ENV from "@/v2/config/env";
import { mapGetters } from "vuex";
import detailDelete from "@/assets/imgs/logisticsPlatform/delete_truck.png";
import modalInfo from "@/v2/components/modalInfo/info";
export default {
  name: "LoadingScaleFileColumnItem",
  components: {
    modalInfo,
  },
  props: {
    editable: Boolean,
    originFile: Object,
    index: Number,
  },
  data() {
    return {
      truckAction: API_UPLOAD_STATION,
      scaleFile: null,
      detailDelete: detailDelete,
    };
  },
  mounted() {
    this.scaleFile = this.originFile;
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_TOKEN: "VUEX_ST_TOKEN",
    }),
    headers() {
      return {
        Authorization: this.VUEX_ST_TOKEN,
        Source: "PC",
      };
    },
    fileName: function () {
      return this.scaleFile?.name;
    },
    fileTime: function () {
      return this.scaleFile?.createdDate;
    },
    previewImg: function () {
      let urlPath = this.scaleFile?.path;
      if (!urlPath) {
        return "";
      }
      return urlPath;
    },
  },
  methods: {
    handlePreview() {
      this.$refs.viewer.$viewer.show();
    },
    beforeUpload(file) {
      const isIMG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";
      if (!isIMG) {
        this.$message.error("仅支持bmp，jpg，jpeg，png的格式");
        setTimeout(() => {
          this.fileList = [];
        }, 1);
        return false;
      }
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isLt) {
        this.$message.error("图片不能大于100M");
        setTimeout(() => {
          this.fileList = [];
        }, 1);
        return;
      }
      this.file = file;
    },
    handleDetailUploadChange({ file }) {
      if (file.status == "done") {
        let fildeData = file.response.data;
        this.scaleFile = {
          ...fildeData,
          fileUrl: fildeData.path,
          fileName: fildeData.name,
          md5Hex: fildeData.md5Hex,
        };
        this.$emit("scaleFileChange", this.index, this.scaleFile);
      }
      if (file.status == "error") {
        // this.$message.error(item.response.error.message)
      }
    },
    deleteDetailTruckImg() {
      this.$refs.modalInfo.open();
    },
    modalInfoOK() {
      this.scaleFile = null;
      this.$emit("scaleFileChange", this.index, null);
      this.$refs.modalInfo.close();
    },
  },
};
</script>

<style lang="less" scoped>
.uploadContain {
  display: flex;
  justify-self: center;
  text-align: left;
}
/deep/.ant-upload {
  line-height: 48px;
  margin: 0;
  background: none;
  height: auto;
  width: auto;
  float: none;
  border: none;
  padding: 0;
  align-items: center;
}
/deep/.ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0;
}
.fileUploadBtn {
  width: 64px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid @primary-color;
  color: @primary-color;
  font-size: 14px;
  line-height: 14px;
}

.fileView {
  display: flex;
  align-items: center;
}

.fileNameView {
  height: 28px;
  margin: 0;
  border-radius: 4px;
  background: #f3f5f6;
  display: flex;
  align-items: center;
  padding: 0 6px;
}
.fileNameText {
  color: @primary-color;
  font-size: 14px;
  margin-right: 8px;
}
.fileNameEmptyText {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  margin-right: 8px;
}
</style>