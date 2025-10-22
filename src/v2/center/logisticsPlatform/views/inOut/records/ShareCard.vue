<template>
  <div class="main">
    <a-spin :spinning="loading" tip="加载中...">
      <div class="top-bg">
        <div class="sl-logo"></div>
      </div>
      <section class="compay-card">
        <div class="row title">
          <span class="coal" v-if="detail.type =='IN'">入库：{{detail.coalType}}</span>
          <span class="coal out" v-if="detail.type =='OUT'">出库：{{detail.coalType}}</span>
          <span class="station">{{ detail.stationName }}</span>
        </div>
        <div class="row line">
          <i class="icon receive-icon"></i>
          <span>{{ detail.receivingCompanyName }}</span>
        </div>
        <div class="row">
          <i class="icon send-icon"></i>
          <span>{{ detail.deliveryCompanyName }}</span>
        </div>
        <!-- <div class="text">
          {{ detail.sendStation }} {{ detail.stationName }}
        </div>
        <div class="text">
          {{ detail.house }} {{ detail.goodsAllocation }} {{ detail.coalType }}
          <span v-if="detail.shipperMobile"
            >货主电话:{{ detail.shipperMobile }}</span
          >
        </div>
        <div class="text" v-if="detail.remark">备注：{{ detail.remark }}</div> -->
      </section>
      <section class="erm-card">
        <div class="erm">
          <img :src="detail.qrCode" alt="" />
        </div>
        <div class="erm-text">微信扫码，自动派车接单</div>

        <div class="bottom-text">创建时间：{{ detail.createdDate }}</div>
        <div class="bottom-text">编号：{{ detail.serialNo }}</div>
      </section>
      
      <div class="pd45"></div>
    </a-spin>
  </div>
</template>
<script>
import { coalPlaQrCode } from "@/v2/center/logisticsPlatform/api";
import html2canvas from "html2canvas";

export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      detail: {},
      loading: false,
    };
  },
  watch: {
    id() {
      this.getDetail();
    },
  },
  mounted(){
      this.getDetail();
  },
  methods: {
    getDetail() {
      let id = this.id;
      if (!id) return;
      this.loading = true;
      this.detail = {};
      coalPlaQrCode({ id })
        .then((result) => {
          if (!result.success) {
            return;
          }
          result.data.qrCode = "data:image/png;base64," + result.data.qrCode;
          this.detail = result.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    copy(){
      html2canvas(document.querySelector(".main"),{scale:2,dpi:300}).then((canvas) => {
        canvas.toBlob((blob) => {
          const item = new ClipboardItem({'image/png': blob});
          navigator.clipboard.write([item]).then(() => {
            this.$message.success("复制成功");
          }).catch((error) => {
            this.$message.success("复制失败");
          });
      });
      })
    }
  },
};
</script>
<style lang="less" scoped>
.main {
  background-color: rgba(237, 238, 240, 1);
  width: 375px;
  zoom: 0.8;
}
.top-bg {
  position: relative;
  height: 147px;
  background-image: url("~assets/imgs/logisticsPlatform/bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
.top-bg .sl-logo {
  position: absolute;
  top: 34px;
  right: 22px;
  width: 102px;
  height: 30px;
  background-image: url("~assets/imgs/logisticsPlatform/sl_logo.png");
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.compay-card {
  position: relative;
  /* position:relative;
  top:-59px; */
  margin: auto;
  padding: 25px 14px 12px;
  margin-top: -59px;
  width: 343px;
  background-color: #fff;
  background-image: url("~assets/imgs/logisticsPlatform/card_bg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-sizing: border-box;
  z-index: 2;
  .row {
    display: flex;
    margin-top: 4px;
    margin-bottom: 18px;
    font-size: 16px;
    color: #333;
    line-height: 22px;
    &.title{
      flex-direction: column;
      font-weight: bold;
      line-height: 1.5;
      .coal{
        color:#E43939;
        font-size: 32px;
        &.out{
          color:#34C759;
        }
      }
      .station{
        color:rgba(0, 0, 0, 0.6);
        font-size:14px;
        line-height: 28px;
      }
     
    
    }
    &.line{
      position: relative;
      &::before{
        content: "";
        position: absolute;
        left: 12px;
        top: 27px;
        bottom: -15px;
        width: 1px;
        background-color: #E8E8E8;
        transform: translateX(-50%);
      }
    }
    span{
      color: inherit;
    }
    .icon {
      margin-right: 8px;
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      &.receive-icon {
        background-image: url("~assets/imgs/logisticsPlatform/receive_icon.png");
      }
      &.send-icon {
        background-image: url("~assets/imgs/logisticsPlatform/send_icon.png");
      }
      
    }
    
  }
  .text {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 20px;
    color: rgba(51, 51, 51, 0.6);
    &::first-child {
      margin-top: 0;
    }
  }
}

.erm-card {
  margin: 0 auto 30px;
  padding: 40px 0 30px;
  width: 343px;
  background-color: #fff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.erm-card .erm {
  margin: 0 auto;
  width: 166px;
  height: 166px;
}
.erm-card .erm img {
  width: 100%;
  height: 100%;
}
.erm-card .erm-text {
  margin-bottom: 30px;
  margin-top: 8px;
  font-size: 14px;
  color: rgba(#000,0.8);
  line-height: 20px;
  text-align: center;
}

.bottom-text {
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(51, 51, 51, 0.6);
  line-height: 20px;
  text-align: center;
}
.pd45 {
  height: 45px;
}
</style>
