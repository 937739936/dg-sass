<template>
  <div class="new-detail">
    <div class="top-box">
      <div class="page-title">查仓报告详情</div>
    </div>
    <div class="divider"></div>
    <div class="new-detail-content detail-form">
      <h2>基本信息</h2>
      <a-row class="df">
        <a-form-item label="仓储企业">
          <div class="fake-ipt">{{ info.warehouseName }}</div>
        </a-form-item>
        <a-form-item label="货权所属企业">
          <div class="fake-ipt">{{ info.companyName }}</div>
        </a-form-item>
        <a-form-item label="货物品名">
          <a-textarea class="ipt" v-model="info.materialName"></a-textarea>
        </a-form-item>
        <a-form-item label="查仓人员">
          <div class="fake-ipt">{{ info.createdName }}</div>
        </a-form-item>
        <a-form-item label="查仓日期">
          <div class="fake-ipt">{{ info.checkDate }}</div>
        </a-form-item>
        <a-form-item label="查仓报告编号">
          <div class="fake-ipt">{{ info.serialNo }}</div>
        </a-form-item>
      </a-row>
    </div>
    <div class="new-detail-content detail-form">
      <h2>查仓信息</h2>
      <a-row class="df">
        <a-form-item label="查仓定位信息">
          <a-textarea class="ipt" v-model="info.address" disabled></a-textarea>
        </a-form-item>
        <a-form-item label="台账记录是否异常">
          <div class="fake-ipt">
            <span v-if="info.ledgerState">正常</span>
            <span v-else style="color: red">异常</span>
          </div>
        </a-form-item>
        <a-form-item label="货物是否存在生锈、破损、卷散等问题">
          <div class="fake-ipt">
            <span v-if="info.goodsState">正常</span>
            <span v-else style="color: red">异常</span>
          </div>
        </a-form-item>
        <a-form-item label="仓库经营是否异常">
          <div class="fake-ipt">
            <span v-if="info.warehouseState">正常</span>
            <span v-else style="color: red">异常</span>
          </div>
        </a-form-item>
        <a-form-item label="查仓结果">
          <div class="fake-ipt">
            <span v-if="info.checkResult">正常</span>
            <span v-else style="color: red">异常</span>
          </div>
        </a-form-item>
        <a-form-item label="异常原因" v-if="info.abnormalReason">
          <a-textarea class="ipt" v-model="info.abnormalReason" disabled></a-textarea>
        </a-form-item>
        <a-form-item label="查仓建议">
          <a-textarea class="ipt" v-model="info.suggest" disabled></a-textarea>
        </a-form-item>
        <a-form-item label="通知负责人" v-if="noticeLabel">
          <a-textarea class="ipt" v-model="noticeLabel" disabled></a-textarea>
        </a-form-item>
      </a-row>
    </div>
    <div class="new-detail-content detail-form">
      <h2>货物信息</h2>
      <a-table
        :columns="columns"
        class="new-table"
        :bordered="false"
        rowKey="id"
        :dataSource="info.purchaseList"
        :pagination="false"
        :loading="false"
        :scroll="{ x: true }"
      >
        <template slot="quantity" slot-scope="record">
          <span v-if="record.quantity">{{ record.quantity }}</span>
          <span v-if="record.pieceQuantity">/{{ record.pieceQuantity }}</span>
        </template>
        <template slot="warehouseQuantity" slot-scope="record">
          <span v-if="record.warehouseQuantity">{{ record.warehouseQuantity }}</span>
          <span v-if="record.warehousePieceQuantity">/{{ record.warehousePieceQuantity }}</span>
        </template>
        <template slot="realQuantity" slot-scope="record">
          <span v-if="record.realQuantity">{{ record.realQuantity }}</span>
          <span v-if="record.realPieceQuantity">/{{ record.realPieceQuantity }}</span>
        </template>
      </a-table>
    </div>
    <div class="new-detail-content detail-form">
      <div v-for="(item, index) in info.attachList" :key="index">
        <h2>{{ item.typeDesc }}</h2>
        <div class="box2">
          <viewer class="box" :images="item.firstList">
            <div class="img-box" v-for="(imgs, i) in item.firstList" :key="i">
              <img style="width: 100%; height: 100%" :src="domainUrl + imgs.filePath" />
              <p style="margin-top: 5px">{{ imgs.fileName }}</p>
            </div>
          </viewer>
          <div
            class="img-box"
            v-for="(imgs, i2) in item.senList"
            :key="i2"
            style="margin-left: 10px; width: 160px"
            @click="openPdf(imgs.filePath)"
          >
            <img class="cp" style="display: inline-block; width: 100%" src="@/assets/imgs/pdf.png" />
            <!-- <img style="width:100%;height:100%" :src='domainUrl + imgs.filePath' /> -->
            <p style="margin-top: 5px">{{ imgs.fileName }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="new-detail-content detail-form" v-if="info.pdfPath">
      <h2>查仓报告</h2>
      <div class="box">
        <div class="img-box2" style="width: 164px" @click="openPdf(info.pdfPath)">
          <img class="cp" style="display: inline-block; width: 100%" src="@/assets/imgs/pdf.png" />
        </div>
      </div>
    </div>
    <img :src="previewImg" style="display: none" ref="viewer" v-viewer />
    <div style="display: flex; justify-content: center">
      <a-button type="primary" @click="goBack"> 返回 </a-button>
    </div>
  </div>
</template>

<script>
// import ENV from "@/v2/config/env";

export default {
  props: {
    info: {
      default: () => {},
    },
    ENV: {
      default: () => {},
    },
    type: {
      default: 'rest',
    },
  },
  data() {
    return {
      list: [],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1;
          },
        },
        { title: '货物品名', dataIndex: 'materialName', key: 'materialName' },
        { title: '我司账面库存(吨位/件数)', scopedSlots: { customRender: 'quantity' } },
        { title: '仓库账面库存(吨位/件数)', scopedSlots: { customRender: 'warehouseQuantity' } },
        { title: '仓库实盘库存(吨位/件数)', scopedSlots: { customRender: 'realQuantity' } },
        { title: '差异件数', dataIndex: 'diffPieceQuantity', key: 'diffPieceQuantity' },
        { title: '差异吨位', dataIndex: 'diffQuantity', key: 'diffQuantity', fixed: 'right' },
      ],
      previewImg: '',
    };
  },
  computed: {
    noticeLabel() {
      let str = '';
      if (!this.info.noticeUsers) return str;
      this.info.noticeUsers.forEach((el) => {
        if (el.noticeName && el.noticePhone) {
          str += `${el.noticeName}-${el.noticePhone},`;
        } else if (!el.noticeName && el.noticePhone) {
          str += `${el.noticePhone},`;
        }
      });
      return str;
    },
    domainUrl() {
      if (this.type == 'rest') {
        return this.ENV.BASE_NET;
      }
      return this.ENV.VUE_APP_BASEURL + '/';
    },
  },
  watch: {
    info(obj) {
      const attachList = obj.attachList || [];
      attachList.forEach((el) => {
        const arr = el.fileList.filter((el2) => el2.filePath.includes('.pdf'));
        const arr2 = el.fileList.filter((el2) => !el2.filePath.includes('.pdf'));
        el.firstList = arr2;
        el.senList = arr;
      });
      obj.attachList = attachList;
    },
  },
  methods: {
    // 查看
    view(item) {
      this.previewImg = item.filePath;

      this.$refs.viewer.$viewer.show();
    },
    openPdf(pdfPath) {
      window.open(pdfPath, '_blank');
    },

    goBack() {
      this.$router.go(-1);
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.box2 {
  display: flex;
  flex-wrap: wrap;
}
.box {
  // display: flex;
  margin-bottom: 10px;
  .img-box {
    width: 200px;
    height: 200px;
    display: inline-block;
    text-align: center;
    margin: 10px;
    cursor: pointer;
  }
}
.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
  }
}
.ipt {
  width: 310px;
  height: 40px;
  background: #f0f3fb;
  border-radius: 6px;
  color: #8495aa;
  border: 0;
}
.fake-ipt {
  width: 310px;
  height: 40px;
  background: #f0f3fb;
  border-radius: 6px;
  border: 0;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  color: #8495aa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
