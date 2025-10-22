/*oa交易凭证附件预览*/
<template>
  <div>
    <div class="categoryUpload">
      <a-table :dataSource="fileData" :columns="columns" :pagination="false">
        <template slot="see" slot-scope="text, record, index">
          <a href="javascript:;" class="edit-btn" @click="seeFileInfo(record, index)">查看</a>
        </template>
        <template slot="download" slot-scope="text, record, index">
          <a href="javascript:;" class="edit-btn" @click="downFile(record, index)">下载</a>
        </template>
      </a-table>
    </div>
    <div class="modal-wrap" v-if="previewVisible">
      <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel" :id="hasAllImage ? '' : 'fileModal'">
        <a-carousel arrows>
          <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px; zindex: 1">
            <a-icon type="left-circle" />
          </div>
          <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
            <a-icon type="right-circle" />
          </div>
          <div v-for="(item, index) in fileList" :key="index">
            <template v-if="item.url.indexOf('.pdf') > -1">
              <iframe :src="item.url" frameborder="0" style="width: 100%; height: 100%"></iframe>
            </template>
            <template
              v-else-if="item.url.indexOf('.doc') > -1 || item.url.indexOf('.docx') > -1 || item.url.indexOf('.xlsx') > -1 || item.url.indexOf('.xls') > -1"
            >
              <iframe
                :src="'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(item.url)"
                frameborder="0"
                style="width: 100%; height: 100%"
              ></iframe>
            </template>
            <template v-else>
              <div class="img-wrapper">
                <div id="preview-img-id">
                  <a :href="item.url" target="_blank">
                    <img alt="example" :src="item.url" />
                  </a>
                </div>
              </div>
              <div style="text-align: center"><a-button @click="handleClick">旋转</a-button></div>
            </template>
          </div>
        </a-carousel>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { API_UPLOAD, API_GETCURRENTENV, API_OneClickDownload } from "api";
import comDownload from '@sub/utils/comDownload.js'
export default {
  name: "PaymentPreview",
  props: {
    fileDataSource: {
      default() {
        return [];
      },
    },
  },
  watch: {
    fileDataSource: {
      immediate: true,
      handler(data) {
        const fileData = [];
        var key = 1,
          typeName = "";
        data.forEach((item) => {
          const fileList = [];
          item.fileUrl.split(",").forEach((it) => {
            fileList.push({
              uid: key++,
              name: it,
              status: "done",
              url: API_GETCURRENTENV(it),
            });
          });
          // this.fileTypeList.forEach(i=>{
          //     if(i.value == item.type){
          //         typeName = i.text
          //     }
          // });
          fileData.push({
            key: item.type,
            type: item.type,
            typeName: item.typeName,
            uploadFiles: {
              fileList: fileList,
            },
          });
        });
        this.fileData = fileData;
      },
    },
  },
  data() {
    return {
      fileData: [],
      columns: [
        {
          title: "类型",
          dataIndex: "typeName",
          width: "50%",
        },
        {
          title: "一键查看",
          width: "25%",
          dataIndex: "see",
          scopedSlots: { customRender: "see" },
          align: "center",
        },
        {
          title: "一键下载",
          width: "25%",
          dataIndex: "download",
          scopedSlots: { customRender: "download" },
          align: "center",
        },
      ],
      modalFileWrapIsShow: false,
      modalFileForm: this.$form.createForm(this),
      action: API_UPLOAD,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      ifAddStatus: false,
      modifyIndex: 0,
      resultData: [],
      fileTypeList: [
        {
          value: "GXHT",
          disabled: false,
          text: "购销合同",
          isShow: false,
        },
        {
          value: 'CZPZ',
          disabled: false,
          text: "称重凭证",
          isShow: false,
        },
        {
          value: 'GKHZPZ',
          disabled: false,
          text: "货转凭证",
          isShow: false,
        },
        {
          value: 'HYPZ',
          disabled: false,
          text: "化验凭证",
          isShow: false,
        },
        {
          value: 'YSPZ',
          disabled: false,
          text: "运输凭证",
          isShow: false,
        },
        {
          value: 'DFZM',
          disabled: false,
          text: "代发证明",
          isShow: false,
        },
        {
          value: 'WTJSH',
          disabled: false,
          text: "委托结算函",
          isShow: false,
        },
        {
          value: 'JSD',
          disabled: false,
          text: "结算单",
          isShow: false,
        },
        {
          value: 'ZZHD',
          disabled: false,
          text: "转账回单",
          isShow: false,
        },
        {
          value: 'QTDJ',
          disabled: false,
          text: "其他单据",
          isShow: false,
        },
        {
          value: 'GKHZPZ',
          disabled: false,
          text: "港口货转凭证",
          isShow: false,
        },
        {
          value: 'TMD',
          disabled: false,
          text: "提煤单",
          isShow: false,
        },
        {
          value: 'YHDZHD',
          disabled: false,
          text: "银行电子回单",
          isShow: false,
        },
        {
          value: 'PCD',
          disabled: false,
          text: "派车单",
          isShow: false,
        },
        {
          value: 'SHZM',
          disabled: false,
          text: "收货证明",
          isShow: false,
        },
        {
          value: 'JJD',
          disabled: false,
          text: "交接单",
          isShow: false,
        },
        {
          value: 'COMMITMENT',
          disabled: false,
          text: "承诺函",
          isShow: false,
        },
        {
          value: 'SERVICEFEE',
          disabled: false,
          text: "服务费协议",
          isShow: false,
        },
        {
          value: 'BID_PROOF',
          disabled: false,
          text: "中标佐证",
          isShow: false,
        },
      ],
      hasAllImage: true, //判断预览的是否只有图片
      deg: 0,
      ele: null,
    };
  },
  methods: {
    seeFileInfo(record, index) {
      //一键查看预览
      this.hasAllImage = true;
      this.previewVisible = true;
      this.ifAddStatus = false;
      this.fileList = [];
      this.fileList = record.uploadFiles.fileList;
      this.fileList.map((el) => {
        if (
          el.url.indexOf(".pdf") > -1 ||
          el.url.indexOf(".doc") > -1 ||
          el.url.indexOf(".docx") > -1 ||
          el.url.indexOf(".xlsx") > -1 ||
          el.url.indexOf(".xls") > -1
        ) {
          this.hasAllImage = this.hasAllImage & false;
          return;
        } else {
          this.hasAllImage = this.hasAllImage & true;
        }
      });
      this.repeatOptionJudge();
    },
    downFile(record, index) {
      //一键下载
      API_OneClickDownload({ serialNo: this.$route.query.serialNo, attachType: record.type }).then((res) => {
        comDownload(res, undefined, record.typeName + `.zip`);
      });
    },
    repeatOptionJudge() {
      this.fileTypeList.map((i) => {
        i.disabled = false;
      });
      this.fileData.forEach((item) => {
        if (item.type) {
          this.fileTypeList.map((i) => {
            if (i.value == item.type) {
              i.disabled = true;
            }
          });
        }
      });
    },
    handlePreviewCancel() {
      this.previewVisible = false;
    },
    // 旋转图片
    handleClick(e) {
      this.deg = (this.deg + 90) % 360;
      let parentEle = e.target.offsetParent;
      if (parentEle) {
        this.ele = parentEle.querySelector("#preview-img-id");
        this.ele.style.transform = `rotate(${this.deg}deg)`;
      }
    },
  },
};
</script>
<style lang="less">
.categoryUpload {
  .edit-btn {
    color: #0053db;
  }
  .delete-btn {
    color: #ff2929;
  }
  .line {
    padding: 0 10px;
  }
  .ant-table-placeholder {
    border-bottom: none;
  }
  .ant-table-row {
    td {
      overflow: hidden;
      word-break: break-all;
    }
  }
  .add-wrap {
    width: 100% !important;
    margin-top: 30px;
    background: #f9f9f9;
    border-top: 1px dashed #ddd;
    border-bottom: 1px dashed #ddd;
    text-align: center;
    padding: 10px 0;
    i {
      font-size: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      position: relative;
      top: -2px;
    }
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
}
.modal-file-info {
  width: 90% !important;
  label {
    width: 100px;
    display: inline-block;
    text-align: left;
  }
  .file_icon {
    margin: 0 auto;
    display: block;
    background: url(~@/assets/imgs/upload/file_icon.png) no-repeat right center;
    width: 28px;
    height: 22px;
    margin-bottom: 10px;
  }
  .file-notice {
    color: #333;
    font-size: 14px;
  }
  .unEditable {
    .anticon-delete {
      display: none;
    }
  }
}
.row {
  margin-bottom: 10px;
}
.ant-modal-wrap {
  display: flex;
  align-items: center;
  justify-items: center;
}
.ant-modal-wrap .ant-modal {
  padding-bottom: 0;
  top: 0;
  width: 700px !important;
  height: 700px !important;
}
#fileModal .ant-modal-wrap .ant-modal {
  width: 100% !important;
  height: 100% !important;
}
#fileModal .ant-modal-wrap .ant-modal,
#fileModal .ant-modal-body,
#fileModal .ant-modal-content,
#fileModal .ant-carousel,
#fileModal .slick-slider,
#fileModal .slick-list,
#fileModal .slick-track,
#fileModal .ant-modal-wrap .ant-carousel .slick-slide > div,
#fileModal .ant-modal-wrap .ant-carousel .slick-slide > div > div {
  height: 100%;
}
.ant-modal-wrap .ant-modal-body {
  padding: 36px;
}
#fileModal .ant-modal-wrap .ant-modal-body {
  padding: 32px 55px;
}
.ant-modal-wrap .ant-carousel .custom-slick-arrow {
  width: 30px;
  height: 30px;
  font-size: 30px;
  color: #333;
  opacity: 0.3;
}
#fileModal .ant-modal-wrap .ant-carousel .custom-slick-arrow {
  width: 45px;
  height: 45px;
  font-size: 45px;
}
.ant-modal-wrap .ant-carousel .slick-prev:hover,
.ant-carousel .slick-next:hover,
.ant-carousel .slick-prev:focus,
.ant-carousel .slick-next:focus {
  color: #333 !important;
}
.ant-modal-wrap .ant-carousel .custom-slick-arrow.slick-prev {
  left: -33px !important;
}
#fileModal .ant-modal-wrap .ant-carousel .custom-slick-arrow.slick-prev {
  left: -48px !important;
}
.ant-modal-wrap .ant-carousel .custom-slick-arrow.slick-next {
  right: -33px !important;
}
#fileModal .ant-modal-wrap .ant-carousel .custom-slick-arrow.slick-next {
  right: -48px !important;
}

#fileModal .ant-modal-wrap .ant-carousel .slick-active > div > div {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
.ant-modal-wrap .ant-carousel .custom-slick-arrow:before {
  display: none;
}
.ant-modal-wrap .ant-carousel .custom-slick-arrow:hover {
  opacity: 0.5;
}
.ant-modal-wrap .ant-modal-close-x {
  width: 30px;
  height: 30px;
  line-height: 30px;
}
.ant-modal-wrap .slick-dots {
  display: none !important;
}
.ant-modal-wrap .slick-track {
  display: flex;
  justify-items: center;
  align-items: center;
}
.img-wrapper {
  margin: auto;
  position: relative;
  height: 600px;
  width: 600px;
  #preview-img-id {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    a {
      user-select: none;
    }
    img {
      max-width: 600px;
      max-height: 600px;
      pointer-events: none;
    }
  }
  &:hover .rotate-wrapper {
    display: flex;
  }
  .rotate-wrapper {
    justify-content: center;
    align-items: center;
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .rotate-icon {
      font-size: 80px;
      color: rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
  }
}
</style>
