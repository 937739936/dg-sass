<template>
  <div>
    <div class="tip" v-if="!disabled">
      <!-- 设置默认提示 -->
      <!-- 默认展示支持格式和附件大小 -->
      <slot name="tip">
        <!-- 如果是judgmentType是不是空,所有文件只有一种类型，否则循环展示 -->
        <div v-if="judgmentType.length">
          可支持格式为 {{ judgmentType.join("，") }} 的附件，
          单个附件大小不超过100M；
        </div>
        <template v-else>
          <div v-for="item in tableData" :key="item.key">
            【{{ item.typeName }}】 可支持格式为
            {{ item.documentType.join("，") }} 的附件， 单个附件大小不超过100M；
          </div>
        </template>
        <div v-for="(item, index) in requireTipArr" :key="index">
          {{ item }}；
        </div>
      </slot>
    </div>
    <!-- 附件表格 -->
    <div class="table-box">
      <a-table
        :columns="columns"
        class="new-table"
        bordered
        :rowKey="(record, index) => String(index)"
        :dataSource="tableData"
        :pagination="false"
      >
        <div class="typeName" slot="typeName" slot-scope="typeName, record">
          <a-row type="flex" justify="space-between" align="middle">
            <!-- 禁用状态不展示必填和上传按钮 -->
            <a-col>
              <div class="red" v-if="!disabled">
                <template v-if="record.required">*</template>
              </div>
              {{ typeName }}
            </a-col>
            <a-col v-if="!disabled">
              <a-upload
                :headers="headers"
                :beforeUpload="(e) => beforeUpload(e, record.documentType)"
                :accept="
                  record.documentType
                    .map((item) => {
                      return `.${item}`;
                    })
                    .toString()
                "
                :action="action"
                :showUploadList="false"
                :multiple="true"
                :fileList="fileList"
                @change="(e) => fileChange(e, record)"
                name="file"
              >
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  class="upload"
                  :disabled="beginUpload"
                >
                  {{ beginUpload ? "上传中" : "上传" }}
                </a-button>
              </a-upload>
            </a-col>
          </a-row>
        </div>
        <div class="nameMain" slot="name" slot-scope="name, record">
          <a-tooltip v-for="(item, index) in record.fileList" :key="index">
            <template slot="title"> 上传时间：{{ item.uploadTime }} </template>
            <div class="nameEdit" v-if="!disabled">
              <span @click="fileLook(item)">{{ item.name || item.fileName }}</span>
              <a-popconfirm title="确认删除吗？" @confirm="toDelete(item)">
                <img
                  class="del"
                  src="@sub/assets/imgs/trade/del-icon.png"
                  alt=""
                />
              </a-popconfirm>
            </div>
            <div class="name" v-else>
              <span @click="fileLook(item)">{{
                item.name || item.fileName
              }}</span>
            </div>
          </a-tooltip>
        </div>
        <template slot="active" slot-scope="active, record">
          <a @click="download(record)">下载</a>
        </template>
      </a-table>
    </div>
    <FileLook ref="fileLook"></FileLook>
  </div>
</template>

<script>
import moment from "moment";
import { API_UPLOAD_FILE } from "@/v2/api/upload";
import { mapGetters } from "vuex";
import FileLook from "./FileLook";
//不同模块允许不同的类型文件
const fileTypeList = {
  fileDefault: ["jpg", "jpeg", "png", "pdf"],
  settleDefault: ["jpg", "jpeg", "png", "gif", "pdf", "docx", "xls", "xlsx"],
};
export default {
  components: {
    FileLook,
  },
  props: {
    fileType: {
      //允许文件类型
      type: String,
      default: "fileDefault",
    },
    requireTip: {
      //额外的文件上传提示信息，
      type: [String, Array],
    },
    //文件列表
    fileData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**单据类型,所上传的单据类型
     * 对象数组，
     * type 单据类型-必填
     * typeName 单据名称-必填
     * required 单据必填
     * documentType 数组 此类型单据支持上传的文件类型
     * */
    documentType: {
      type: Array,
      default: () => {
        return [];
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
    fileData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val?.length) {
          this.fileList = [...val];
        } else {
          this.fileList = [];
        }
      },
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
    //表头
    columns() {
      let columns = [
        {
          title: "单据类型",
          dataIndex: "typeName",
          width: 250,
          scopedSlots: { customRender: "typeName" },
        },
        {
          title: "文件名称",
          dataIndex: "name",
          align: "left",
          scopedSlots: { customRender: "name" },
        },
      ];
      //如果是禁用有下载按钮
      if (this.disabled) {
        columns.push({
          title: "操作",
          dataIndex: "active",
          width: 100,
          scopedSlots: { customRender: "active" },
        });
      }
      return columns;
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
    //根据单据类型生成表格数据
    tableData() {
      // 如果没有文件,并且禁止上传，直接返回空
      if (!this.fileList.length && Boolean(this.disabled)) {
        return [];
      }
      return this.documentType.map((item) => {
        //从fileList中寻找对应的文件
        let fileList = this.fileList.filter((items) => {
          return items.type == item.type;
        });
        //如果没有限制文件类型，采用默认类型
        if (!item.documentType) {
          item.documentType = fileTypeList[this.fileType] || [];
        }
        //记录数据，方便统计
        return {
          ...item,
          fileList,
        };
      });
    },
    //判断所有附件是单文件类型还是多文件类型
    judgmentType() {
      let judgment = true;
      let documentType = [];
      //对所有的文件类型进行循环
      this.tableData.map((item) => {
        //文件类型中所有设置文件限制进行循环
        item.documentType.map((items) => {
          //如果不存在，进行添加
          let name = items.toLowerCase();
          if (!documentType.includes(name)) {
            documentType.push(name);
          }
        });
      });
      //判断其中是否存在不等值
      if (
        this.tableData.some(
          (item) => item.documentType?.length != documentType.length
        )
      ) {
        judgment = false;
      }
      if (judgment) {
        return documentType;
      } else {
        return [];
      }
    },
  },
  methods: {
    //上传前校验
    beforeUpload(file, allowFormat) {
      let isAllowFormat = false;
      if (
        allowFormat.indexOf(
          file.name.split(".")[file.name.split(".").length - 1].toLowerCase()
        ) == -1
      ) {
        this.$message.error("仅支持" + allowFormat.toString() + "的格式");
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
    fileChange({ fileList }, fileType) {
      this.fileList = fileList;
      if (
        fileList.length &&
        fileList.some((item) => {
          return item.status == "uploading";
        })
      ) {
        this.beginUpload = true;
      } else {
        this.fileList = fileList.map((item) => {
          //判断文件类型,暂时取默认
          return {
            uploadTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            ...item?.response?.data,
            ...item,
            key: fileType.type,
            type: fileType.type,
            typeName: fileType.typeName,
            dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
            name: item?.response?.data.fileName || item.fileName,
            url: item?.response?.data.fileUrl || item.fileUrl,
            md5Hex: item?.response?.data.md5Hex || item.md5Hex,
            path: item?.response?.data.fileUrl || item.fileUrl,
          };
        });
        this.beginUpload = false;
      }
    },
    //查看附件
    fileLook(data) {
      this.$refs.fileLook.fileLook(data);
    },
    //删除附件
    toDelete(data) {
      let fileList = this.fileList;
      if (data.uid) {
        //表示当前文件为新上传删除
        this.fileList = fileList.filter((item) => item.uid !== data.uid);
      } else if (data.id) {
        this.fileList = fileList.filter((item) => item.id !== data.id);
      }
    },
    //下载
    download(data) {
      // this.$refs.fileLook.fileDown(data);
      //判断是否有下载函数
      if (this.$listeners.download) {
        this.$emit("download", data);
        return;
      }
      this.$refs.fileLook.fileDown(data.fileList[0]);
    },
    //获取数据校验
    validateFields() {
      // 判断所有必填项中是否有空
      let judgment = true;
      this.tableData.map((item) => {
        if (item.required && !item.fileList?.length) {
          this.$message.error(`请上传【${item.typeName}】文件`);
          judgment = false;
        }
      });
      if (judgment) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
.tip {
  border-radius: 4px;
  border: 1px solid #d0dfff;
  background: #e1eafe;
  color: rgba(0, 0, 0, 0.8);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 183.333% */
  padding: 12px;
}
.typeName {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 100% */
  .red {
    width: 8px;
    display: inline-block;
    color: #ea5530;
    margin-right: 4px;
  }
  .upload {
    padding: 0 18px;
  }
}
.nameMain {
  white-space: normal;
  color: #4682f3;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px; /* 100% */
  .nameEdit {
    background: #f3f5f6;
    display: inline-block;
    margin: 2px 8px;
    border-radius: 4px;
    padding: 6px;
    span {
      cursor: pointer;
      vertical-align: middle;
    }
    .del {
      width: 14px;
      cursor: pointer;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .name {
    display: inline-block;
    border-left: 1px solid #e9effc;
    padding: 0px 14px;
    line-height: 14px;
    margin: 6px 0;
    &:first-child {
      border: 0;
    }
  }
}
</style>
