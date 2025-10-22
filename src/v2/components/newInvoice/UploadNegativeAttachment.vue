<template>
  <div class="negative-attachment-upload">
    <div v-if="uploadStatus === 'SUCCESS' && redSuccessInvoiceAttachment">
      <div class="redInvoiceImg" v-if="redSuccessInvoiceAttachment" @click="handlePreview(redSuccessInvoiceAttachment)">
        <img src="@/v2/assets/imgs/invoicetools/png-icon.png" alt="" style="width: 12px;margin-bottom: 2px">
        {{redInvoiceAttName}}
      </div>
    </div>
    <div v-if="uploadStatus === 'ERROR' && scanErrorMessages.length > 0">
      <div class="error-list">
        <img src="@/v2/assets/imgs/common/red_error_icon.png" alt="" class="error-icon"/>
        <div class="error-text">{{ scanErrorMessageText }}</div>
      </div>
    </div>
    <div v-else-if="uploadStatus === 'UPLOADING' || uploadStatus === 'PARSE' || uploadStatus === 'SCAN'" class="upload-progress-container">
      <div class="progress-box">
        <div class="progress-box-top">
          <div class="name-box ">
            <i style="margin-right:10px;color:#8495AA;font-size: 12px;" class="iconfont icon-fujianshangchuan "></i>
            <span class="name">{{progressFileName}}</span>
          </div>
          <span style="color: #8495AA;">{{ progressInfo.des }}</span>
        </div>
        <!-- <div class="progress">
          <div class="progress-now" :style="{ width: progressInfo.width,}"></div>
        </div> -->
      </div>
    </div>
    <a-upload
      v-if="uploadStatus === 'NORMAL' || uploadStatus === 'ERROR'"
      class="upload-btn"
      list-type="picture-card"
      name="file"
      :showUploadList="false"
      :accept="accept"
      :headers="headers"
      :disabled='uploadLoading'
      :multiple="false"
      :before-upload="beforeUpload"
    >
      <a-button type='primary' class="btn-link">{{ uploadStatus === 'ERROR' ? '重新上传负数发票' : '上传负数发票' }}</a-button>
    </a-upload>
    <p class="tip" v-if="uploadStatus !== 'SUCCESS'">支持上传单个附件100M以内的JPG、JGEG、PNG、PDF、OFD格式，单张图片上传不可包含多张发票</p>
    <img :src="previewImg" style="display: none" ref="viewer" v-viewer />
  </div>
</template>

<script>
import ENV from "@/v2/config/env";
import { mapGetters } from 'vuex'
import { FILE_UPLOAD_MULTIPLE, GET_INCREMENT_FILE, INCREMENT_FILE_PARSE, GET_INCREMENTFILE_PATH } from "@/v2/api/uploadMultiple";
import {
  API_RedInvoiceImgScan,
} from '@/v2/center/steels/api/invoice.js'
  export default {
    name: 'UploadNegativeAttachment',
    data() {
      return {
        timer: null, // 轮询定时器
        previewImg: '', // 预览图片路径
        fileListinvoiceImg: [],
        accept: '.jpg,.png,.gif,.pdf,.ofd,application/ofd',
        uploadLoading: false, // 上传进度条
        uploadFileList: [], // 准备上传文件
        uploadStatus: 'NORMAL', // 上传状态: NORMAL, UPLOADING, PARSE, ,SUCCESS, ERROR
        uploadInfo: {
          timeMillis: '', // 上传开始时间
          totalCount: 0, // 上传总个数
          finishList: [], // 上传成功文件列表
        },
        parseInfo: {
          timeMillis: '', // 解析开始时间
          totalCount: 0, // 解析总个数
          finishList: [], // 解析成功文件列表
        },
        scanErrorMessages: [], // 验真失败信息
        redSuccessInvoiceAttachment: '', // 上传成功的附件路径
      }
    },
    watch: {
      uploadFileList: {
        handler(val) {
          if (val.length > 0) {
            this.startUploadFiles(val)
          }
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters('user', {
        VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
      }),
      headers() {
        return {
          Authorization: this.VUEX_ST_TOKEN,
          Source: 'PC',
        }
      },
      // 红冲的名称
      redInvoiceAttName() {
        const arr = this.redSuccessInvoiceAttachment.split('/')
        if (arr.length === 0) {
          return ''
        }
        let name = arr[arr.length - 1]
        return decodeURIComponent(name);  
      },
      progressFileName() {
        let fileName = '';
        if (this.uploadFileList.length > 0) {
          fileName = this.uploadFileList[0].name;
          if (this.uploadFileList.length > 1) {
            fileName = `${fileName}等${this.uploadFileList.length}个`
          }
        }
        return fileName
      },
      // 进度条描述
      progressInfo() {
        let des = ''; 
        let width = '0%';
        if (this.uploadStatus === 'UPLOADING') {
          let {totalCount, finishList} = this.uploadInfo;
          let p = totalCount === 0 ? 0 : finishList.length / totalCount;
          width = Math.round(p * 100) + '%'
          des = '正在上传...'
        } else if (this.uploadStatus === 'PARSE') {
          let {totalCount, finishList} = this.parseInfo;
          let p = totalCount === 0 ? 0 : finishList.length / totalCount;
          width = Math.round(p * 100) + '%'
          des = '正在解析...'
        } else if (this.uploadStatus === 'SCAN') {
          des =  '正在验真...'
        } else {
          des =  ''
        }
        return {
          des,
          width
        }
      },
      scanErrorMessageText() {
        let text = '';
        this.scanErrorMessages.forEach((item,index) => {
          let num = index + 1;
          if (text.length > 0) {
            text += '\n';
          }
          text += `${num}.${item}`;
        });
        return text;
      }
    },
    methods: {
      // 预览
      handlePreview (path) {
        this.previewImg = ENV.BASE_NET + path;
        this.$refs.viewer.$viewer.show();
      },
      clearLoopTimer() {
        window.clearInterval(this.timer);
          this.timer = null;
      },
      // 上传失败，重置上传状态
      cleanUploadFile() {
        this.uploadLoading = false;
        this.uploadStatus = 'ERROR';
        this.uploadFileList = [];
        this.clearLoopTimer();
        // TODO: 上传失败，重置上传状态uploadInfo parseInfo
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
        const isPDF = file.type === 'application/pdf'
        const isOFD = file.type === 'application/ofd'
        if (!isJPG && !isPDF && !isOFD) {
          this.$message.error('请上传JPG、PNG、GIF、PDF、OFD格式的图片')
          return false
        }
        const isLt100M = file.size / 1024 / 1024 < 100
        if (!isLt100M) {
          this.$message.error('文件大小不能超过100M')
          return false
        }
        this.uploadFileList = [...this.uploadFileList, file]
        // this.uploadStatus = 'UPLOADING'
        return false
      },
      // 1. 开始上传，监听uploadFile有值时开始上传
      startUploadFiles(list) {
        let fileList = list || [];
        if (fileList.length === 0) {
          return
        }
        this.uploadStatus = 'UPLOADING'
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('files', file);
        });
        FILE_UPLOAD_MULTIPLE(formData).then(res => {
          if(res.success) {
            this.getUploadFileCount(res.data);
          }
        }).catch(err => {
          this.$message.error(`上传失败${JSON.stringify(err)},请重试`);
          this.cleanUploadFile();
        }).finally(() => {
          this.uploadFile = null;
        });
      },
      // 2. 获取已经上传成功的个数
      getUploadFileCount(data) {
        // 上传的附件数量，和上传时间戳
        let {count, timeMillis} = data;
        this.uploadInfo = {
          totalCount: count || 0,
          timeMillis: timeMillis || '',
          finishList: [],
        }
        // 开始轮询上传进度
        this.clearLoopTimer();
        this.timer = setInterval(() => {
          if (this.uploadInfo.finishList.length === this.uploadInfo.totalCount) {
            this.clearLoopTimer();
          } else {
            this.checkUploadProgress(data);
          }
        }, 100);
      },
      // 3. 轮询上传进度
      checkUploadProgress(data) {
        let {timeMillis} = data;
        GET_INCREMENT_FILE({
          timeMillis: timeMillis,
          t: new Date().getTime()
        }).then(res => {
          if (res.success) {
            let finishList = res.data || [];
            let finishCount = finishList.length;
            this.$set(this.uploadInfo, 'finishList', finishList);
            if (finishCount === this.uploadInfo.totalCount) {
              this.startParseUploadFile();
            }
          }
        }).catch(() => {
          this.cleanUploadFile();
        })
      },
      // 4. 开始解析上传成功的附件
      startParseUploadFile() {
        if (this.uploadStatus === 'PARSE') {
          return
        }
        this.clearLoopTimer();
        this.uploadStatus = 'PARSE';
        let {timeMillis} = this.uploadInfo;
        INCREMENT_FILE_PARSE({
          timeMillis: timeMillis,
          t: new Date().getTime()
        }).then(res => {
          if(res.success) {
            this.getIncrementFilePathLoop(res.data);
          }
        }).catch(() => {
          this.cleanUploadFile();
        });
      },
      getIncrementFilePathLoop(data) {
        let {count, timeMillis} = data;
        this.parseInfo = {
          totalCount: count || 0,
          timeMillis: timeMillis || '',
          finishList: [],
        }
        this.clearLoopTimer();
        this.timer = setInterval(() => {
          this.checkParseProgress();
        }, 2 * 1000);
      },
      // 5. 轮询解析进度
      checkParseProgress() {
        let {timeMillis, finishList} = this.parseInfo;
        let currentSize = finishList.length;
        GET_INCREMENTFILE_PATH({
          currentSize: currentSize,
          timeMillis: timeMillis,
          t: new Date().getTime()
        }).then(res => {
          if (res.success) {
            let cFinishList = res.data || [];
            let paresTotalCount = this.parseInfo.totalCount;
            if (cFinishList.length > 0) {
              let {totalImage} = cFinishList[0];
              paresTotalCount = totalImage;
              this.$set(this.parseInfo, 'totalCount', paresTotalCount);
            }
            let oldFinishList = this.parseInfo.finishList || [];
            let newFinishList = [...oldFinishList, ...cFinishList];
            this.$set(this.parseInfo, 'finishList', newFinishList);
            if (newFinishList.length >= paresTotalCount) {
              this.startInvoiceScan();
            }
          }
        }).catch(() => {
          this.cleanUploadFile();
        })
      },
      // 6. 开始发票验真
      startInvoiceScan() {
        if (this.uploadStatus === 'SCAN') {
          return
        }
        this.clearLoopTimer();
        this.uploadStatus = 'SCAN';
        this.scanErrorMessages = [];
        let {finishList} = this.parseInfo;
        if (finishList.length === 0) {
          return
        }
        let filePath = finishList[0].uploadFilePath || '';
        let params = {
          filePath: filePath,
          invoiceId: this.$route.query.id,
        }
        API_RedInvoiceImgScan(params).then(res => {
          if (res.success) {
            this.uploadStatus = 'SUCCESS';
            if (res.data.result === true) {
              this.redScanSuccess(filePath);
            } else {
              this.uploadStatus = 'ERROR';
              this.scanErrorMessages = res.data.errorMsg || [];
              this.cleanUploadFile();
            }
          } else {
            this.uploadStatus = 'ERROR';
            this.scanErrorMessages = []
            this.cleanUploadFile();
          }
        }).catch(() => {
          this.cleanUploadFile();
        });
      },
      // 手动红冲成功
      redScanSuccess(filePath) {
        this.redSuccessInvoiceAttachment = filePath;
        this.uploadStatus = 'SUCCESS';
        this.$emit('handleNegativeInvoiceSuccess');
        // this.$message.success('红冲成功');
      },
      errorTest() {
        this.uploadStatus = 'ERROR';
        this.scanErrorMessages = ['测试错误信息', '测试错误信息2', '测试错误信息3'];
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);  
      // clearTimeout(this.timerOut);
    },  
  }
</script>

<style lang="less" scoped>
/deep/ .ant-upload.ant-upload-select-picture-card {
  border: 0;
}
/deep/ .ant-upload-select-picture-card {
  background: #fff;
  height: inherit;
  margin: 0;
}
/deep/ .ant-upload {
  padding: 0 !important;
}
/deep/ .ant-btn {
  padding: 0 30px;
}
</style>
<style lang="less" scoped>
.negative-attachment-upload {
  .redInvoiceImg {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: @primary-color;
    cursor: pointer;
  }
  .error-list {
    background: #FFF8F8;
    border: 1px solid #FFB8B8;
    border-radius: 4px;
    padding: 10px 14px;
    min-width: 360px;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px; 
    .error-icon {
      width: 14px;
      height: 14px;
      margin-top: 3px; 
    }
    .error-text {
      flex: 1;
      white-space: pre-wrap;
      margin-left: 12px;
      font-size: 14px;
      line-height: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      text-align: left;
    }
  }
  .upload-btn {
    margin-top: 0;
  }
  .tip {
    margin-top: 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #77889D;
  }
  .upload-progress-container {
    background-color: #ffffff;
    .progress-box {
      border: 1px solid #E9EFFC;
      width: 430px;
      height: 60px;
      border-radius: 6px;
      padding:  0 14px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &-top {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .progress {
        width: 400px;
        height: 4px;
        border-radius: 6px;
        position: relative;
        background-color: rgba(70,130,243,0.2);
        .progress-now {
          width: 0;
          transition: width 0.5s;
          height: 100%;
          border-radius: 6px;
          position: relative;
          background-color: @primary-color;
        }
      }
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 200px;
    }
    .name-box {
      display: flex;
      align-items: center;
    }
  }
}

</style>