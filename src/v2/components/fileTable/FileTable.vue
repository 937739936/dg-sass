<template>
  <div>
    <div class="slTitleAssis" v-if="titleShow">
      <div class="slTitleAssisBut">
        <span>附件信息</span>
        <a-upload
          v-if="!disabled"
          name="file"
          :multiple="true"
          :action="action"
          :headers="headers"
          :fileList="fileList"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          @change="fileChange"
        >
          <a-button type="primary" ghost>
            <a-space>
              <img
                width="18"
                height="18"
                src="@/assets/imgs/newInvoice/add-invoce2.png"
              />
              <span>新增附件</span>
            </a-space>
          </a-button>
        </a-upload>
      </div>
    </div>
    <!-- 附件表格 -->
    <div class="table-box">
      <a-table
        :columns="columns"
        class="new-table-file"
        :bordered="false"
        :rowKey="(record, index) => String(index)"
        :dataSource="fileData"
        :pagination="false"
        :loading="beginUpload"
        :scroll="{ x: true }"
      >
        <a-space slot="typeName" slot-scope="action, items">
          {{ action || items.typeDesc }}
        </a-space>
        <a-space slot="name" slot-scope="action, items">
          <a href="javascript:void(0)" @click="fileLook(items)">{{ action }}</a>
        </a-space>
        <a-space slot="action" slot-scope="action, items">
          <a
            href="javascript:void(0)"
            v-if="!disabled"
            @click="fileDelte(items)"
          >
            删除
          </a>
          <a
            href="javascript:void(0)"
            v-if="disabled"
            @click="downloadFile(items)"
          >
            下载
          </a>
        </a-space>
      </a-table>
      <div class="tableTip" v-if="!disabled">
        系统提示：附件支持{{ allowFormatString }}格式，文件大小不超过100M；
        <span v-for="(item, index) in requireTipArr" :key="index">
          {{ item }}；
        </span>
      </div>
    </div>
    <FileLook ref="fileLook"></FileLook>
  </div>
</template>

<script>
import { API_UPLOAD_FILE, API_DOWNLPREVIEWTE } from "@/v2/api/upload";
import ENV from "@/v2/config/env";
import comDownload from "@sub/utils/comDownload.js";
import { mapGetters } from "vuex";
import FileLook from "./FileLook";
//不同模块允许不同的类型文件
const fileTypeList = {
  fileDefault: ["jpg", "jpeg", "png", "pdf", "bmp"],
};
export default {
  components: {
    FileLook,
  },
  props: {
    //头部是否展示
    titleShow: {
      type: Boolean,
      default: true,
    },
    fileType: {
      //允许文件类型
      type: String,
      default: "fileDefault",
    },
    requireTip: {
      //文件上传提示
      type: [String, Array],
    },
    //文件列表
    fileData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //默认文件类型
    initialValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      action: API_UPLOAD_FILE, //附件地址
      columns: [
        {
          title: "附件类型",
          dataIndex: "typeName",
          width: "46%",
          scopedSlots: { customRender: "typeName" },
        },
        {
          title: "附件",
          dataIndex: "name",
          align: "left",
          width: "33%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          scopedSlots: { customRender: "action" },
        },
      ],
      fileList: [],
      beginUpload: false, //附件上传中,禁止文件操作
    };
  },
  watch: {
    beginUpload(val) {
      // 文件上传状态，如果需要自行控制
      if (this.$listeners["beginUploadChange"]) {
        this.$emit("beginUploadChange", val);
      }
    },
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
    allowFormat() {
      return fileTypeList[this.fileType] || [];
    },
    allowFormatString() {
      if (this.allowFormat?.length) {
        return this.allowFormat.join("，");
      } else {
        return "";
      }
    },
    //是否有提示
    requireTipArr() {
      let requireTipArr = [];
      if (this.requireTip) {
        if (typeof this.requireTip == "string") {
          requireTipArr = [this.requireTip];
        } else {
          requireTipArr = this.requireTip;
        }
      }
      return requireTipArr;
    },
    //是否有默认类型
    hasInitialValue() {
      let initialValue = this.initialValue;
      return initialValue.key && initialValue.label;
    },
  },
  methods: {
    //上传前校验
    beforeUpload(file) {
      let allowFormat = this.allowFormat;
      let isAllowFormat = false;
      if (
        allowFormat.indexOf(
          file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
        ) == -1
      ) {
        this.$message.error("仅支持" + this.allowFormatString + "的格式");
        isAllowFormat = false;
      } else {
        isAllowFormat = true;
      }
      const t = this;
      function fileTypeJudge() {
        if (file.size / 1024 / 1024 > 100) {
          t.$message.error("单个附件大小不得超过100M");
          return true;
        }
        if (
          file.name.indexOf("/") > 0 ||
          file.name.indexOf("\\") > 0 ||
          file.name.indexOf("%") > 0
        ) {
          t.$message.error("文件名不要包含特殊符号");
          return true;
        }
      }
      let ifOverSize = fileTypeJudge();
      return new Promise((resolve, reject) => {
        if (isAllowFormat && !ifOverSize) {
          return setTimeout(() => {
            resolve(file);
          }, 1);
        } else {
          return setTimeout(() => {
            reject(file);
          }, 1);
        }
      });
    },
    //文件上传
    fileChange({ fileList }) {
      this.fileList = fileList;
      if (
        fileList.length &&
        fileList.some((item) => {
          return item.status == "uploading";
        })
      ) {
        this.beginUpload = true;
      } else {
        let fileData = fileList
          .filter((item) => {
            return !this.fileData.some((items) => {
              return items.uid == item.uid;
            });
          })
          .map((item) => {
            //判断文件类型,暂时取默认
            let fileType = this.initialValue;
            return {
              key: fileType.key,
              type: fileType.key,
              typeName: fileType.label,
              dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
              name: item.response.data.fileName,
              url: item.response.data.fileUrl,
              md5Hex: item.response.data.md5Hex,
              path: item.response.data.fileUrl,
              ...item.response.data,
              ...item,
            };
          });
        this.$emit("fileChange", [...this.fileData, ...fileData]);
        this.beginUpload = false;
      }
    },
    //查看附件
    fileLook(data) {
      this.$refs.fileLook.fileLook(data);
    },
    //删除附件
    toDelete(data) {
      let fileData = this.fileData;
      if (data.uid) {
        //表示当前文件为新上传删除
        this.fileList = this.fileList.filter((item) => item.uid !== data.uid);
        fileData = fileData.filter((item) => item.uid !== data.uid);
      } else if (data.id) {
        fileData = fileData.filter((item) => item.id !== data.id);
      }
      this.$emit("fileChange", fileData);
    },
    fileDelte(data) {
      this.toDelete(data);
    },
    //文件下载，
    downloadFile(data) {
      // 判断有无特殊处理，没有直接进行下载
      if (this.$listeners.download) {
        this.$emit("download", data);
      } else {
        this.download(data);
      }
    },
    //下载
    download(data) {
      let url;
      if (data.response) {
        url = data.response.data.fileUrl;
      } else if (data.url) {
        url = data.url;
      } else if (data.path) {
        url = data.path;
      } else {
        return;
      }
      if (url.indexOf(ENV.BASE_API) == -1) {
        url = ENV.BASE_NET + url;
      }
      if (url) {
        API_DOWNLPREVIEWTE(url).then((res) => {
          comDownload(res, url, data.name);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");

.slTitleAssisBut {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tableTip {
  padding: 20px 30px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8191a9;
  line-height: 20px;
}
</style>
