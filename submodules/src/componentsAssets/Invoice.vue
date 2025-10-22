<template>
  <div class="contentBox slMain">
    <div class="title">
      <a-row type="flex">
        <a-col flex="auto">
          <a-space :size="20">
            上游发票信息
            <a-button v-if="editFlag" type="primary" ghost @click="selectInvoice"> 关联发票 </a-button>
          </a-space>
        </a-col>
        <a-col flex="none">
          <a-button type="primary" ghost v-if="exportInvoiceParent" @click="exportInvoice"> 导出 </a-button>
        </a-col>
      </a-row>
    </div>
    <ErrorPanel v-if="audit" :assetValidateList="assetValidateList"></ErrorPanel>
    <div class="mb50 content">
      <div class="table-box">
        <a-table
          v-if="invoiceList.length || (!invoiceList.length && !transList.length)"
          class="new-table"
          :pagination="false"
          :columns="invoiceColumns"
          :data-source="invoiceList"
          :scroll="{ x: true }"
          rowKey="id"
        >
          <span slot="amount" slot-scope="amount" v-mainTip="convertCurrency(amount)">
            ¥{{ formatMoney(amount) }}
          </span>
          <template slot="hasAttach" slot-scope="hasAttach">
            <span class="green" v-if="hasAttach">有</span>
            <span class="orange" v-if="!hasAttach">无</span>
          </template>
          <template slot="fileName" slot-scope="fileName, record">
            <a @click="handlePreview(record)">{{ fileName }}</a>
          </template>
          <template slot="transferName" slot-scope="transferName, record">
            <a @click="handlePreview(record)">{{ transferName }}</a>
          </template>

          <a-space :size="24" slot="action" slot-scope="text, record">
            <a @click="getResult(record)">查验结果</a>
            <a v-if="editFlag" @click="deleteSelect(record.id)">删除</a>
          </a-space>
        </a-table>

        <a-table
          v-if="transList.length"
          style="margin-top: 20px"
          class="new-table"
          :pagination="false"
          :columns="transColumns"
          :data-source="transList"
          :scroll="{ x: true }"
          rowKey="id"
        >
          <span slot="amount" slot-scope="amount" v-mainTip="convertCurrency(amount)">
            ¥{{ formatMoney(amount) }}
          </span>
          <template slot="hasAttach" slot-scope="hasAttach">
            <span class="green" v-if="hasAttach">有</span>
            <span class="orange" v-if="!hasAttach">无</span>
          </template>
          <template slot="fileName" slot-scope="fileName, record">
            <a @click="handlePreview(record)">{{ fileName }}</a>
          </template>
          <template slot="transferName" slot-scope="transferName, record">
            <a @click="handlePreview(record)">{{ transferName }}</a>
          </template>
          <a-space :size="24" slot="action" slot-scope="text, record">
            <a @click="getResult(record)">查验结果</a>
            <a v-if="editFlag" @click="deleteSelect(record.id)">删除</a>
          </a-space>
        </a-table>
        <a-row type="flex" class="select">
          <a-col flex="auto">
            发票总数：<span class="selectAll">{{ invoiceList.length + transList.length }}张</span>
          </a-col>
          <a-col flex="none">
            <a-space :size="20">
              <div>
                <a-space :size="10">
                  价税合计
                  <span class="number" v-mainTip="convertCurrency(invoiceCount.totalAmount)"
                    >¥{{ formatMoney(invoiceCount.totalAmount) }}</span
                  >
                </a-space>
              </div>
              <div>
                <a-space :size="10">
                  归属价税合计
                  <span class="number" v-mainTip="convertCurrency(invoiceCount.splitAmount)"
                    >¥{{ formatMoney(invoiceCount.splitAmount) }}</span
                  >
                </a-space>
              </div>
            </a-space>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 下游的发票信息 -->
    <template>
      <div class="title">
        <a-row type="flex">
          <a-col flex="auto"> 下游发票信息 </a-col>
          <a-col flex="none">
            <a-button type="primary" ghost v-if="exportInvoiceParent" @click="exportDownInvoice"> 导出 </a-button>
          </a-col>
        </a-row>
      </div>
      <div class="mb50 content">
        <div class="table-box">
          <a-table
            v-if="downInvoiceList.length || (!downInvoiceList.length && !downTransList.length)"
            class="new-table"
            :pagination="false"
            :columns="invoiceColumns"
            :data-source="downInvoiceList"
            :scroll="{ x: true }"
            rowKey="id"
          >
            <span slot="amount" slot-scope="amount" v-mainTip="convertCurrency(amount)">
              ¥{{ formatMoney(amount) }}
            </span>
            <template slot="hasAttach" slot-scope="hasAttach">
              <span class="green" v-if="hasAttach">有</span>
              <span class="orange" v-if="!hasAttach">无</span>
            </template>
            <template slot="fileName" slot-scope="fileName, record">
              <a @click="handlePreview(record)">{{ fileName }}</a>
            </template>
            <template slot="transferName" slot-scope="transferName, record">
              <a @click="handlePreview(record)">{{ transferName }}</a>
            </template>
            <a-space :size="24" slot="action" slot-scope="text, record">
              <a @click="getResult(record)">查验结果</a>
              <a v-if="editFlag" @click="deleteSelect(record.id)">删除</a>
            </a-space>
          </a-table>
          <a-table
            v-if="downTransList.length"
            style="margin-top: 20px"
            class="new-table"
            :pagination="false"
            :columns="transColumns"
            :data-source="downTransList"
            :scroll="{ x: true }"
            rowKey="id"
          >
            <span slot="amount" slot-scope="amount" v-mainTip="convertCurrency(amount)">
              ¥{{ formatMoney(amount) }}
            </span>
            <template slot="hasAttach" slot-scope="hasAttach">
              <span class="green" v-if="hasAttach">有</span>
              <span class="orange" v-if="!hasAttach">无</span>
            </template>
            <template slot="fileName" slot-scope="fileName, record">
              <a @click="handlePreview(record)">{{ fileName }}</a>
            </template>
            <template slot="transferName" slot-scope="transferName, record">
              <a @click="handlePreview(record)">{{ transferName }}</a>
            </template>
            <a-space :size="24" slot="action" slot-scope="text, record">
              <a @click="getResult(record)">查验结果</a>
              <a v-if="editFlag" @click="deleteSelect(record.id)">删除</a>
            </a-space>
          </a-table>
          <a-row type="flex" class="select">
            <a-col flex="auto">
              发票总数：<span class="selectAll">{{ downInvoiceList.length + downTransList.length }}张</span>
            </a-col>
            <a-col flex="none">
              <a-space :size="20">
                <div>
                  <a-space :size="10">
                    价税合计
                    <span class="number" v-mainTip="convertCurrency(downInvoiceCount.totalAmount)"
                      >¥{{ formatMoney(downInvoiceCount.totalAmount) }}</span
                    >
                  </a-space>
                </div>
                <div>
                  <a-space :size="10">
                    归属价税合计
                    <span class="number" v-mainTip="convertCurrency(downInvoiceCount.splitAmount)"
                      >¥{{ formatMoney(downInvoiceCount.splitAmount) }}</span
                    >
                  </a-space>
                </div>
              </a-space>
            </a-col>
          </a-row>
        </div>
      </div>
    </template>
    <template v-if="attachShow">
      <div class="title">附件信息</div>
      <div class="mb50 content">
        <template v-if="editFlag">
          <div class="tip-box">
            <span class="tip-title">可支持格式为xls，xlsx的附件，单个附件大小不得超过100M的文件。</span>
          </div>
          <AttachmentView ref="attachmentView" :dataSource="dataFileSource" />
        </template>
        <!-- 如果是金融机构，文件数据为空也不展示 -->
        <FileList v-else :locked="audit" :list="attachList" />
      </div>
    </template>

    <!-- 如果是金融机构，文件数据为空也不展示 -->
    <template v-if="businesslineOther && !(isBank && !otherInvoList.length)">
      <div class="title">
        <a-space :size="20">
          业务线其他发票信息
          <a-button v-if="editFlag" type="primary" ghost @click="addOther"> 新增 </a-button>
        </a-space>
      </div>
      <div class="mb50 content">
        <div class="table-box" v-for="(item, index) in otherInvoList" :key="item.contractId">
          <a-row type="flex" style="margin-bottom: 20px">
            <a-col flex="auto">
              <a-space :size="20">
                <span style="display: inline-block">业务线发票-{{ index + 1 }}：</span>
                <span style="font-size: 13px; color: red">
                  发票总数（张）：{{ item.icount }}<em style="display: inline-block; width: 25px"></em> 价税合计（元）：
                  <span v-mainTip="convertCurrency(item.itotal)">{{ formatMoney(item.itotal) }}</span>
                  <em style="display: inline-block; width: 25px"></em>归属价税合计（元）：
                  <span v-mainTip="convertCurrency(item.isplit)">{{ formatMoney(item.isplit) }}</span>
                </span>
              </a-space>
            </a-col>
            <a-col flex="none" v-if="editFlag">
              <a-popconfirm title="确定删除?" @confirm="() => deleteOther(item.contractId)">
                <a v-if="editFlag">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
          <a-table
            class="new-table"
            :pagination="false"
            :columns="invoiceColumns"
            :data-source="item.invoiceList"
            :scroll="{ x: true }"
            rowKey="id"
          >
            <span slot="amount" slot-scope="amount" v-mainTip="convertCurrency(amount)">
              ¥{{ formatMoney(amount) }}
            </span>
            <template slot="hasAttach" slot-scope="hasAttach">
              <span class="green" v-if="hasAttach">有</span>
              <span class="orange" v-if="!hasAttach">无</span>
            </template>
            <template slot="fileName" slot-scope="fileName, record">
              <a @click="handlePreview(record)">{{ fileName }}</a>
            </template>
            <template slot="transferName" slot-scope="transferName, record">
              <a @click="handlePreview(record)">{{ transferName }}</a>
            </template>
            <a-space :size="24" slot="action" slot-scope="text, record">
              <a @click="getResult(record)">查验结果</a>
            </a-space>
          </a-table>
        </div>
      </div>
    </template>
    <InvoiceModal ref="invoice" />
    <ImageViewer ref="imageViewer" />
    <ChooseInvoice
      ref="chooseInvoice"
      :selectFinancedInvoice="selectFinancedInvoice"
      @chooseFinInvo="chooseFinInvo"
      v-if="type === 'rest'"
    />
    <AssetsCompanyRelationChainModal
      ref="AssetsCompanyRelationChainModal"
      :selectFinancedInvoice="selectFinancedInvoice"
      @addFin="addFin"
    />
  </div>
</template>
<script>
import ImageViewer from '@sub/components/viewer/image.vue';
import comDownload from '@sub/utils/comDownload.js';
import { convertCurrency } from '@sub/utils/factory';
import { formatMoney } from '@sub/filters';
import InvoiceModal from './components/InvoiceModal.vue';
import ChooseInvoice from './components/ChooseInvoice.vue';
import AttachmentView from './components/AttachmentView.vue';
import FileList from './components/FileList.vue';
import ErrorPanel from './components/ErrorPanel.vue';
import AssetsCompanyRelationChainModal from './components/AssetsCompanyRelationChainModal';

export default {
  name: 'Invoice',
  components: {
    ChooseInvoice,
    AssetsCompanyRelationChainModal,
    AttachmentView,
    FileList,
    InvoiceModal,
    ImageViewer,
    ErrorPanel,
  },
  data() {
    return {
      formatMoney,
      convertCurrency,
      invoiceColumns: [
        { title: '发票代码', dataIndex: 'code', key: 'code' },
        { title: '发票号码', dataIndex: 'no', key: 'no' },
        { title: '开票日期', dataIndex: 'issuedDate', key: 'issuedDate' },
        {
          title: '价税合计(元)',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          scopedSlots: { customRender: 'amount' },
        },
        { title: '贸易合同编号', dataIndex: 'contractNo', key: 'contractNo' },
        {
          title: '归属价税合计(元)',
          dataIndex: 'splitAmount',
          key: 'splitAmount',
          scopedSlots: { customRender: 'amount' },
        },
        { title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
        { title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
        {
          title: '转换文件名',
          dataIndex: 'transferName',
          key: 'transferName',
          scopedSlots: { customRender: 'transferName' },
        },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } },
      ],

      transColumns: [
        { title: '发票代码', dataIndex: 'code', key: 'code' },
        { title: '发票号码', dataIndex: 'no', key: 'no' },
        { title: '开票日期', dataIndex: 'issuedDate', key: 'issuedDate' },
        {
          title: '价税合计(元)',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          scopedSlots: { customRender: 'amount' },
        },
        {
          title: '是否包含印花税',
          dataIndex: 'stampTaxFlag',
          align: 'center',
          customRender: (text) => ['否', '是'][text - 1],
          width: 180,
        },
        {
          title: '印花税税额(元)',
          dataIndex: 'stampTaxFlagAmount',
          align: 'center',
          customRender: (text) => (text && text.toLocaleString()) || '-',
          width: 180,
        },
        {
          title: '含印花税合计(元)',
          align: 'center',
          dataIndex: 'stampTaxFlagTotalAmount',
          customRender: (text) => (text && text.toLocaleString()) || '-',
          width: 180,
        },
        { title: '贸易合同编号', dataIndex: 'contractNo', key: 'contractNo' },
        {
          title: '归属价税合计(元)',
          dataIndex: 'splitAmount',
          key: 'splitAmount',
          scopedSlots: { customRender: 'amount' },
        },
        { title: '有无附件', dataIndex: 'hasAttach', key: 'hasAttach', scopedSlots: { customRender: 'hasAttach' } },
        { title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
        {
          title: '转换文件名',
          dataIndex: 'transferName',
          key: 'transferName',
          scopedSlots: { customRender: 'transferName' },
        },
        { title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } },
      ],
      invoiceList: [], // 上游的发票信息
      downInvoiceList: [], // 下游的发票信息
      transList: [], // 上游的发票信息
      downTransList: [], // 下游的发票信息
      assetValidateList: [], // 校验错误信息
      otherInvoList: [],
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
    isBank: {
      type: Boolean,
      default: false,
    },
    invoiceInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  inject: {
    exportInvoiceParent: { form: 'exportInvoiceParent', default: null },
    isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null },
    detailDataReceivalVO: { form: 'detailDataReceivalVO', default: null },
  },
  filters: {},
  watch: {
    invoiceInfo: {
      deep: true,
      immediate: true,
      handler(data) {
        let {
          list,
          upList,
          downList,
          upTransList,
          downTransList,
          assetValidateList,
          paymentValidates,
          assetBusinessLineInvoiceVOList,
        } = data;
        if (list?.length) {
          this.invoiceList = list;
        }
        if (upList?.length) {
          this.invoiceList = upList;
        }
        if (downList?.length) {
          this.downInvoiceList = downList;
        }
        if (upTransList?.length) {
          this.transList = upTransList;
        }
        if (downTransList?.length) {
          this.downTransList = downTransList;
        }
        if (assetValidateList) {
          this.assetValidateList = assetValidateList || [];
        }
        if (paymentValidates) {
          this.assetValidateList = paymentValidates || [];
        }
        // 判断业务线关联发票
        if (assetBusinessLineInvoiceVOList?.length) {
          this.otherInvoList = assetBusinessLineInvoiceVOList;
        }
      },
    },
  },
  mounted() {},
  computed: {
    // 上游发票信息统计
    invoiceCount() {
      let totalAmount = 0;
      let splitAmount = 0;
      this.invoiceList.forEach((item) => {
        totalAmount += Number(item.totalAmount) || 0;
        splitAmount += Number(item.splitAmount) || 0;
      });
      this.transList.forEach((item) => {
        totalAmount += Number(item.totalAmount) || 0;
        splitAmount += Number(item.splitAmount) || 0;
      });
      let invoiceCount = { totalAmount, splitAmount };
      return invoiceCount;
    },
    // 上游发票信息ID
    invoiceIDList() {
      return this.invoiceList.map((item) => item.id);
    },
    // 下游发票信息统计
    downInvoiceCount() {
      let totalAmount = 0;
      let splitAmount = 0;
      this.downInvoiceList.forEach((item) => {
        totalAmount += Number(item.totalAmount) || 0;
        splitAmount += Number(item.splitAmount) || 0;
      });
      this.downTransList.forEach((item) => {
        totalAmount += Number(item.totalAmount) || 0;
        splitAmount += Number(item.splitAmount) || 0;
      });
      let downInvoiceCount = { totalAmount, splitAmount };
      return downInvoiceCount;
    },
    // 下游发票信息ID
    downInvoiceIDList() {
      return this.downInvoiceList.map((item) => item.id);
    },
    // 判断是否展示 选择业务线其他发票
    businesslineOther() {
      let bankProductAssetConfigList = this.invoiceInfo?.bankProductAssetConfigList || [];
      let businesslineOther = bankProductAssetConfigList.find(
        (item) => item.item === 'INVOICE_BUSINESSLINE_OTHER' && item.status == 1
      );
      return businesslineOther;
    },
    // 上传附件限制种类
    bankProductAssetConfigList() {
      let bankProductAssetConfigList = this.invoiceInfo?.bankProductAssetConfigList || [];
      bankProductAssetConfigList = bankProductAssetConfigList
        .filter(
          (item) => item.status == 1 && item.item !== 'INVOICE_UP_INFO' && item.item !== 'INVOICE_BUSINESSLINE_OTHER'
        )
        .map((item) => {
          let accept = ['xls', 'xlsx'];
          return {
            key: item.assetAttachType,
            label: item.itemDesc,
            accept,
            required: Boolean(item.required),
          };
        });
      return bankProductAssetConfigList;
    },
    // 判断附件信息是否展示
    attachShow() {
      // 判断是否存在upInvoiceDetailList字段，没有不展示
      if (this.invoiceInfo.hasOwnProperty('upInvoiceDetailList')) {
        // 如果是金融机构，文件数据为空也不展示
        if (this.isBank && !this.attachList.length) {
          return false;
        }
        return true;
      }
      return false;
    },
    // 附件信息
    attachList() {
      return this.invoiceInfo?.upInvoiceDetailList || [];
    },
    // 文件数据
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
    type() {
      return process.env.VUE_APP_SYSTEM_TYPE;
    },
    // 此资产能否选择已融资发票
    selectFinancedInvoice() {
      let selectFinancedInvoice = false;
      if (this.invoiceInfo.selectFinancedInvoice) {
        selectFinancedInvoice = true;
      }
      return selectFinancedInvoice;
    },
  },
  methods: {
    // 判断是否有判断外部变更，用于修改是进行页面拦截
    isNeedNextChange() {
      if (this.isNeedNextChangeParent) {
        this.isNeedNextChangeParent();
      }
    },
    // 新增其他发票信息
    addOther() {
      let fullBusinessLineId = this.detailDataReceivalVO?.fullBusinessLineId;
      if (fullBusinessLineId) {
        this.$refs.AssetsCompanyRelationChainModal.init(fullBusinessLineId);
      }
    },
    addFin(data) {
      let index = _.findIndex(this.otherInvoList, { contractId: data.contractId });
      if (index > -1) {
        this.$message.error('当前发票已经添加过');
        return;
      }
      let curInvoList = data.curInvoList || [];
      let icount = curInvoList.length;
      let itotal = curInvoList.reduce((pre, cur) => pre + cur.totalAmount, 0).toFixed(2);
      let isplit = curInvoList.reduce((pre, cur) => pre + cur.splitAmount, 0).toFixed(2);
      this.otherInvoList = this.otherInvoList.concat({
        invoiceList: curInvoList,
        icount,
        itotal,
        isplit,
        contractId: data.contractId,
        contractType: data.contractType,
        // _id:this.get_id(),
      });
    },
    deleteOther(contractId) {
      let index = _.findIndex(this.otherInvoList, { contractId: contractId });
      this.otherInvoList.splice(index, 1);
    },
    // 关联发票
    selectInvoice() {
      this.$refs.chooseInvoice.show({ selectedRowKeys: this.invoiceList });
    },
    // 选中关联发票
    chooseFinInvo(data) {
      this.isNeedNextChange();
      this.invoiceList = data;
    },
    // 删除选中
    deleteSelect(id) {
      this.invoiceList = this.invoiceList.filter((item) => item.id !== id);
      this.isNeedNextChange();
    },
    // 导出发票
    async exportInvoice() {
      if (this.invoiceIDList.length) {
        if (this.exportInvoiceParent) {
          let res = await this.exportInvoiceParent({ invoiceIds: this.invoiceIDList.join(',') });
          comDownload(res, undefined, `发票信息.xls`);
        }
      } else {
        this.$message.warning('请选择关联发票');
      }
    },
    // 导出下游发票
    async exportDownInvoice() {
      if (this.downInvoiceIDList.length) {
        if (this.exportInvoiceParent) {
          let res = await this.exportInvoiceParent({ invoiceIds: this.downInvoiceIDList.join(',') });
          comDownload(res, undefined, `发票信息.xls`);
        }
      } else {
        this.$message.warning('请选择关联发票');
      }
    },
    // 查看附件
    handlePreview(record) {
      this.$refs.imageViewer.showFile(record);
    },
    getResult(record) {
      this.$refs.invoice.showModal(record.id);
    },
    onSubmit() {
      let attachList = this.attachList;
      if (this.editFlag) {
        attachList = this.$refs.attachmentView.attachmentList;
      }
      let obj = {
        list: attachList || [],
        invoiceIdList: this.invoiceIDList,
        businessLineInvoice: this.otherInvoList.map((item) => {
          return {
            contractType: item.contractType,
            contractId: item.contractId,
            invoiceList: item.invoiceList.map((o) => o.id),
          };
        }),
      };

      var checkRes = this.checkAssetsSubmit(attachList);
      if (checkRes && checkRes.errorStr) {
        return checkRes;
      }
      return obj;
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
        obj.errorStr = '发票模块-缺少必填附件';
      }
      // 判断是否缺少业务线发票
      if (this.businesslineOther) {
        if (this.businesslineOther.required === 1 && !this.otherInvoList.length) {
          obj.errorStr = '发票模块-缺少:业务线发票';
        }
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
  width: 100%;
  min-width: 100%;

  ::v-deep {
    .title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.8);
      margin-bottom: 15px;
      .ant-btn {
        padding: 0 10px;
      }
      div {
        font-family: PingFang SC;
      }
    }
    .mb50 {
      margin-bottom: 50px;
    }
    .ant-table td {
      white-space: nowrap;
    }
    .content {
      .tip-box {
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #d0dfff;
        background: #e1eafe;
        color: rgba(0, 0, 0, 0.8);
        font-size: 12px;
        line-height: 22px;
        position: relative;
        overflow: hidden;
        .tip-title {
          // font-weight: 600;
        }
      }
      .ant-dropdown-menu-item {
        padding-left: 20px;
        padding-right: 20px;
        cursor: default;
        div {
          cursor: pointer;
        }
        .required {
          position: relative;
          &::before {
            position: absolute;
            top: 50%;
            bottom: 50%;
            margin: auto;
            right: 100%;
            width: 14px;
            height: 14px;
            line-height: 14px;
            color: #ea5530;
            content: '*';
          }
        }
        &.ant-dropdown-menu-item-active {
          background: #e4ebf4;
          color: @primary-color;
          .ant-upload {
            color: @primary-color;
          }
        }
      }
      .select {
        margin: 20px 0;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 26px;
        text-align: left;
        color: #77889d;
        .selectAll {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
          color: #000000;
        }
        .number {
          font-family: D-DIN-PRO;
          font-size: 18px;
          font-weight: 500;

          font-size: 18px;
          color: #f46332;
        }
      }

      .nameMain {
        white-space: normal;
        color: @primary-color;
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

      .preview {
        cursor: pointer;
        margin-right: 14px;
        padding-right: 14px;
        border-right: 1px solid #e9effc;
      }
      .preview-box {
        .preview:last-child {
          border-right: 0;
        }
      }
    }
  }
}
</style>
