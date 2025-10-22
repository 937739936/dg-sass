<template>
  <div class="invoice-img">
    <a-upload
      list-type="picture-card"
      name="file"
      :action='action2'
      :showUploadList="false"
      :accept="accept"
      :headers="headers"
      :multiple="false"
      :data='uploadData'
      :openFileDialogOnClick='disabled'
      :fileList="fileListinvoiceImg"
      :before-upload="beforeUploadInvoice"
      @change="handleChange"
    >
      <div class="invoice-box">
        <img class="img" :src="invoiceUrl" alt="">
        <div class="mask">
          <div class="up" :class="{'up2': itemInfo.scanStatus === 0}">
            <span class="up-2" @click="view"> <i  style="fontSize:12px;margin-right:4px" class="iconfont icon-chakan"></i> <span>查看</span> </span>
            <span class="up-1 up-2" @click="del"> <i  style="fontSize:12px;margin-right:4px" class="iconfont icon-shanchu"></i> <span>删除</span> </span>
            <span v-if="itemInfo.scanStatus !== 0" class="up-2"  @mouseenter="changeEnter"  @mouseleave="changeLeave">
              <i style="fontSize:12px;margin-right:4px" class="iconfont icon-tihuan"></i> 
              <span>替换</span> 
            </span>
          </div>
          <div class="down" v-if="itemInfo.scanStatus !== 0" @click="again">
             <span> <i style="fontSize:12px;margin-right:4px" class="iconfont icon-zhongxinshibie"></i> <span>重新识别</span> </span>
          </div>
        </div>
      </div>
    </a-upload>
    <div style="text-align:center">
        <span  class="tip">{{itemInfo.errorMsg || itemInfo.scanReason || '验证成功' }}</span>
        <i v-if="itemInfo.scanStatus == 0" class="icon-fapiaoxiaoyan-chenggong iconfont success" style="color:#53C199;margin-left:2px;fontSize:14px;vertical-align: middle;"></i>
        <a-tooltip v-else-if="itemInfo.scanStatus == 1">
          <template slot="title">
            请保证图片清晰，单张图片不大于3M，可点击 “替换”并单选JPG/JPEG/PNG格式替换后重新 识别
          </template>
          <i class="icon-fapiaoshibie-shibai iconfont fail"  style="color:#E45757;margin-left:2px;fontSize:14px;vertical-align: middle;"></i>
        </a-tooltip>
       <i v-else class="icon-fapiaoshibie-shibai iconfont fail" style="color:#E45757;margin-left:2px;fontSize:14px;vertical-align: middle;"></i>
    </div>
   
    <img :src="invoiceUrl"  ref="viewer" v-viewer style="display:none" />
  </div>
</template>

<script>
import {handleUploadChange, beforeUpload} from '@/v2/utils/factory.js';
import { againCheckInvoice, replaceInvoice, API_SteelsUploadFileWaterMark} from '@/v2/center/steels/api/invoice.js'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash';
import ENV from "@/v2/config/env";
export default {
  props: {
    info: {
      default: () => {}
    },
    // 操作的数组key
    type:{},
    // 操作的索引
    handleIndex: {},
    // 缓存数组key
    tplKey: {}
  },
  data() {
    return {
      uploadKeyList: ['invoiceImg'],
      action2: API_SteelsUploadFileWaterMark,
      accept: '.jpg,.png,.gif,.ofd,application/ofd',
      disabled: false,
      itemInfo: {},
      fileListinvoiceImg: [],
      uploadLoading: false,
      ENV,
      uploadData:{}
    }
  },
  watch: {
    info: {
      handler(val) {
        this.itemInfo = cloneDeep(val)
      },
      deep: true,
      immediate: true,
    },
    fileListinvoiceImg: {
      handler(value) {
        if(value.length) {
          this.handleUpload();
        }
      },
      deep: true
    },
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
    invoiceUrl() {
      if( this.info.myInvoiceDO) {
        return  this.info.myInvoiceDO.invoiceUrl || this.info.myInvoiceDO.attachment
      }
      if(this.info.attachment) {
        return this.info.invoiceUrl || this.info.attachment
      }
      return ''
    }
  },
  created() {
    // this.uploadKeyList.forEach((item) => {
    //   this[`fileList${item}`] = []
    //   this[`handleChange${item}`] = (info) => {
    //     this.uploadLoading = true
    //     handleUploadChange.call(this, info, item, this[`getPath${item}`] )
    //   }
    //   this[item] = item
    // });
  },
  methods: {
    getPathinvoiceImg(info, key) {
   
    },
    handleChange() {},
    beforeUploadInvoice(file) {
       const isLimitFileSize = file.size / 1024 / 1024 <= 100
      if (!isLimitFileSize) {
        this.$message.error(`文件大小不能超过100M`);
        return;
      }
      this.fileListinvoiceImg = [file];

      return false;
    },
    // 1.上传
    async  handleUpload() {
      this.uploadLoading = true;
      const formData = new FormData();
      formData.append('file', this.fileListinvoiceImg[0]);
      // 编辑 和 新增逻辑返回不一样
       let newInfo = {
        ...this.itemInfo,
        industryType: this.$route.query.industryType,
        invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 'DELIVER_INVOICE' : 'TRADE_INVOICE',
       }
      if(this.$route.query.type == 'modify') {
        if(!this.itemInfo.myInvoiceDO) {
            newInfo = {
              industryType: this.$route.query.industryType,
              invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 'DELIVER_INVOICE' : 'TRADE_INVOICE',
              myInvoiceDO: {
                ...this.itemInfo,
                industryType: this.$route.query.industryType,
                invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 2 : 1
              }
          }
        }
      }
      formData.append('invoiceContent', JSON.stringify(newInfo));
      formData.append('taskId', this.$route.query.taskId || '');
      formData.append('index', this.itemInfo.originalIndex);

      try {
        const res = await replaceInvoice(formData)
        // 替换成功
        this.$emit('replace', res.data, this.itemInfo, 'replace')
      } catch (err) {
        this.$message.error(`上传失败${JSON.stringify(err)},请重试`);
      } finally  {
        this.fileListinvoiceImg = [];
        this.uploadLoading = false
      }
    },
    // 删除
    del() {
      this.$emit('del', this.itemInfo, this.handleIndex, this.type, this.tplKey)
    },
    // 查看
    view() {
      this.disabled = false
       this.$refs.viewer.$viewer.show();
    },
     // 阻塞上传
    changeEnter() {
      this.disabled = true
    },
    changeLeave() {
       this.disabled = false
    },
    // 替换
    replaceImg() {
       this.$emit('replace', this.itemInfo)
    },
    // 重新识别
    async again() {
      let params = {
        ...this.itemInfo,
       industryType: this.$route.query.industryType,
       invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 'DELIVER_INVOICE' : 'TRADE_INVOICE',

      }
      // 编辑 和 新增逻辑返回不一样
      if(this.$route.query.type == 'modify') {
        if(!this.itemInfo.myInvoiceDO) {
          params = {
            industryType: this.$route.query.industryType,
            invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 'DELIVER_INVOICE' : 'TRADE_INVOICE',
            myInvoiceDO: {
              ...this.itemInfo,
              industryType: this.$route.query.industryType,
              invoiceType: this.$route.query.invoiceType == 'DELIVER' ? 2 : 1,
            }
          }
        }

      }
      const res =  await againCheckInvoice(params)
      /** 更新信息 */
      // this.itemInfo = res.data
      this.$emit('again', res.data, this.itemInfo, 'again')
    }
  },
  components: {

  }
}
</script>

<style scoped lang='less'>
.invoice-img {
   width: 300px;

  /deep/ .ant-upload  {
    border: 0;
    margin: 0;
    cursor: pointer;
    padding: 0;
  }
  .tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0,0,0,0.8);
    line-height: 24px;
    width: 100%;
    text-align: center;
  }
}
.invoice-box {
  position: relative;
  background: #F0F3FB;
  border-radius: 6px;
  border: 1px solid #CCD1DF;
  &:hover {
    .mask {
      display: block;
    }
  }
}
.img {
  width: 300px;
  height: 150px;
  border-radius: 6px;
  object-fit: contain;

}
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 150px;
  background: rgba(0,0,0,0.5);
  font-size: 14px;
  border-radius: 5px;
  font-family: PingFangSC-Regular, PingFang SC;
  .up {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    height: 106px;
    &-1 {
      margin: 0 26px ;
    }
    .up-2 {
      width: 58px;
      height: 28px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .up-2:hover {
       background: rgba(0,0,0,0.3);
    }
  }
  .up2 {
    height: 100%;
  }
  .down {
    height: 44px;
    width: 100%;
    background: rgba(0,0,0,0.3);
    border-radius: 0px 0px 4px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}

</style>
