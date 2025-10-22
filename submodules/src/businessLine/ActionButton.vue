<template>
  <div class="detail-title">
    <div>
      <a-tooltip placement="left" v-if="type == 'rest'" overlayClassName="white-bg-tooltips">
        <template slot="title">
          <!-- 当业务线状态为【执行中】、或者【上游为“上游完结审批驳回”、下游为执行中】、或者【上游为“执行中”、下游为“下游完结审批驳回”】、或者【业务线状态为“业务完结审批驳回”】时， 并且不是金融机构-->
          <a
            href="javascript:;"
            v-if="
              [
                'EXECUTING',
                'UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING',
                'UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT',
                'COMPLETED_AUDIT_REJECT',
              ].includes(detailData.businessLineDisplayStatus) && !isBank
            "
            @click="relieveBusiness"
            >解除业务线</a
          >
          <!-- ：针对企业管理员、业务员，且业务线的状态不是“业务已完结”、“完结审批中 ”时  并且不是金融机构-->
          <a
            href="javascript:;"
            v-if="
              isFinishAuth &&
              ![
                'COMPLETED_AUDIT_PASS',
                'COMPLETED_AUDIT_ING',
                'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_PASS',
                'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_ING',
              ].includes(detailData.businessLineDisplayStatus) &&
              !isBank
            "
            @click="finishVisible = true"
            >申请业务完结</a
          >
          <a href="javascript:;" @click="downloadVisible = true">一键下载附件</a>
          <a href="javascript:;" @click="toMonitor">查看监控</a>
        </template>
        <a-button class="slBtn" type="primary">操作</a-button>
      </a-tooltip>
      <a-tooltip placement="left" v-if="type == 'admin'" overlayClassName="white-bg-tooltips">
        <template
          slot="title"
          v-if="detailData.hasAuditPermission || detailData.hasFileDownloadPermission || detailData.payAmount > 0"
        >
          <a
            href="javascript:;"
            v-auth="'dataStatistics:dynamic:dataPerfect:audit'"
            v-if="isShowAuthUpBtn || isShowAuthDownBtn"
            @click="openAudit('down')"
            >完结审批</a
          >
          <a href="javascript:;" @click="goAfter" v-if="detailData.payAmount > 0">付款后管理视图</a>
          <a href="javascript:;" v-auth="'dataStatistics:dynamic:fileDownload'" @click="downloadVisible = true"
            >一键下载附件</a
          >
          <!-- dataStatistics:dynamic:dataPerfect:auditLog -->
          <a
            href="javascript:;"
            v-if="
              ['PLATFORM_REJECT', 'COMPLETED'].includes(detailData.downStreamDataStatus) ||
              ['PLATFORM_REJECT', 'COMPLETED'].includes(detailData.upStreamDataStatus)
            "
            v-auth="'dataStatistics:dynamic:dataPerfect:auditLog'"
            @click="openLog"
            >业务线审批记录</a
          >
        </template>

        <a-button
          class="slBtn"
          type="primary"
          v-if="detailData.hasAuditPermission || detailData.hasFileDownloadPermission || detailData.payAmount > 0"
          >操作</a-button
        >
      </a-tooltip>
    </div>
    <TipModal ref="tipModal" @ok="confirmRelieve" title="解除业务线">
      <p style="margin-top: 14px; color: rgba(0, 0, 0, 0.5)">
        解除后，该业务线将删除，不影响上下游合同数据。确认要解除吗？
      </p>
    </TipModal>

    <!-- 解除业务线错误提示 -->
    <a-modal
      class="del-modal slModal"
      :visible="removeBusinessVisible"
      :width="460"
      @cancel="removeBusinessVisible = false"
      title="解除业务线"
      :footer="null"
    >
      <div style="padding-bottom: 50px">
        <p class="c8 ft600">无法解除业务线</p>
        <div
          style="margin-left: 10px; margin-top: 10px"
          class="c4"
          v-for="(item, i) in removeBusinessErrorList"
          :key="i"
        >
          <p v-if="item.verifyEnum == 'GOODSTRANSFER_REFERRED_EXIST'">
            <span> 存在复用上游货转开具的货转数据，需要作废后才能解除业务线，货转编号：</span>
            <a href="javascript:;" v-for="(keyword, i2) in item.keywordInfoList" :key="i2" @click="goTransfer(keyword)">
              {{ keyword.goodsTransferNo }}
              {{ i2 == item.keywordInfoList.length - 1 ? '' : '、' }}
            </a>
          </p>
          <p v-if="item.verifyEnum == 'EFFECTIVE_PAYMENT_EXIST'">
            <span> 存在基于该业务线的付款数据，付款编号:</span>
            <a
              href="javascript:;"
              v-for="(keyword, i2) in item.keywordInfoList"
              :key="i2"
              @click="goPayDetail(keyword)"
            >
              {{ keyword.paymentNo }}
              {{ i2 == item.keywordInfoList.length - 1 ? '' : '、' }}
            </a>
          </p>
        </div>
      </div>
    </a-modal>
    <!-- 下载附件 -->
    <a-modal
      class="del-modal slModal"
      :visible="downloadVisible"
      :width="460"
      @cancel="downloadVisible = false"
      title="一键下载附件"
    >
      <div>
        <a-checkbox-group v-model="downType" style="margin: 10px 0" :options="fileList" />
      </div>
      <template slot="footer">
        <a-button key="back" @click="downloadVisible = false" class="cancel-btn">取消</a-button>
        <a-button type="primary" :loading="downLoading" @click="downloadFile" style="margin-left: 20px">确定</a-button>
      </template>
    </a-modal>

    <!-- 完结业务线 -->
    <a-modal
      class="del-modal slModal"
      :visible="finishVisible"
      :width="460"
      @cancel="finishVisible = false"
      title="业务线完结申请"
    >
      <div style="margin: 10px 0">
        <span style="margin-right: 5px">申请完结合同：</span>
        <a-radio-group name="radioGroup" v-model="finishType">
          <!-- 当上游处于“完结审批中”或者已完结时，则上游采购合同为禁用状态；同理当下游处于“完结审批中”或者已完结时，则下游销售合同为禁用状态 -->
          <a-radio :value="1" :disabled="['WAIT_AUDIT', 'COMPLETED'].includes(detailData.upStreamDataStatus)">
            上游采购合同</a-radio
          >
          <a-radio :value="2" :disabled="['WAIT_AUDIT', 'COMPLETED'].includes(detailData.downStreamDataStatus)">
            下游销售合同
          </a-radio>
        </a-radio-group>
      </div>
      <template slot="footer">
        <a-button key="back" @click="finishVisible = false" class="cancel-btn">取消</a-button>
        <a-button type="primary" @click="finishContract" style="margin-left: 20px">确定</a-button>
      </template>
    </a-modal>

    <!-- 上下游审核完结 -->
    <a-modal
      class="del-modal slModal"
      :visible="adminAuditVisible"
      :width="760"
      @cancel="adminAuditVisible = false"
      title="业务线完结审批"
    >
      <a-form layout="inline" :form="modalFileForm">
        <a-row>
          <a-form-item label="完结合同：" :colon="false">
            <a-radio-group
              name="radioGroup"
              @change="changeContact"
              v-decorator="['dataType', { rules: [{ required: true, message: '请选择' }] }]"
            >
              <a-radio value="UP_STREAM" v-if="isShowAuthUpBtn"> 上游采购合同</a-radio>
              <a-radio value="DOWN_STREAM" v-if="isShowAuthDownBtn"> 下游销售合同 </a-radio>
            </a-radio-group>
          </a-form-item>
          <div v-if="historyList.length">
            <div style="margin-bottom: 10px; color: rgba(0, 0, 0, 0.85); margin-left: 10px">审批历史：</div>
            <a-table
              bordered
              :pagination="false"
              :columns="historyColumns"
              class="new-table"
              :data-source="historyList"
              :scroll="{ x: true }"
              rowKey="id"
            >
            </a-table>
          </div>
          <div>
            <a-form-item label="审批结果：" :colon="false">
              <a-radio-group
                name="radioGroup"
                v-decorator="['auditType', { rules: [{ required: true, message: '请选择审批结果' }] }]"
              >
                <a-radio value="PASS"> 通过</a-radio>
                <a-radio value="REJECT"> 驳回 </a-radio>
              </a-radio-group>
            </a-form-item>
          </div>

          <a-form-item label="驳回原因" :colon="false" v-if="modalFileForm.getFieldValue('auditType') == 'REJECT'">
            <a-textarea
              style="width: 300px"
              :maxLength="200"
              placeholder="请输入内容"
              v-decorator="[
                'opinion',
                { rules: [{ required: true, message: '驳回原因必填' }], validateTrigger: 'blur' },
              ]"
            >
            </a-textarea>
          </a-form-item>
        </a-row>
        <p
          v-if="modalFileForm.getFieldValue('auditType') == 'PASS'"
          style="margin-top: 14px; color: rgba(0, 0, 0, 0.5)"
        >
          注：完结后，该合同将不能再做任何操作，请确认需要进行完结吗？
        </p>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="adminAuditVisible = false" class="cancel-btn">取消</a-button>
        <a-button type="primary" @click="confirmAudit" style="margin-left: 20px">确定</a-button>
      </template>
    </a-modal>
    <!-- 业务线审批记录 -->
    <a-modal
      class="del-modal slModal"
      :visible="adminAuditLogVisible"
      :width="760"
      @cancel="adminAuditLogVisible = false"
      :footer="null"
      title="业务线审批记录"
    >
      <a-row>
        <div>
          <a-table
            :pagination="false"
            :columns="historyAllColumns"
            class="new-table"
            :data-source="historyList"
            :scroll="{ x: true }"
            rowKey="id"
          >
          </a-table>
        </div>
      </a-row>
    </a-modal>
    <ContractFinish
      ref="contractFinish"
      :isLoading="isLoading"
      :message="message"
      :info="contractFinishInfo"
    ></ContractFinish>

    <WarningDrawer
      ref="warningDrawer"
      :getBusinessLineRiskAlertList="getBusinessLineRiskAlertList"
      :type="type"
    ></WarningDrawer>
  </div>
</template>

<script>
import TipModal from '@sub/components/DelModal.vue';
import WarningDrawer from './WarningDrawer.vue';
import ContractFinish from './ContractFinish.vue';

const historyColumns = [
  { title: '操作时间', dataIndex: 'createTime', fixed: 'left' },
  { title: '操作人', dataIndex: 'operator' },

  { title: '操作类型', dataIndex: 'result', customRender: (t) => (t == 'PASS' ? '通过' : '驳回') },
  { title: '操作意见', dataIndex: 'opinion' },
];
const historyAllColumns = [
  { title: '操作时间', dataIndex: 'createTime', fixed: 'left' },
  { title: '操作人', dataIndex: 'operator' },
  { title: '完结合同', dataIndex: 'dataType' },
  { title: '操作类型', dataIndex: 'result', customRender: (t) => (t == 'REJECT' ? '驳回' : '通过') },
  { title: '操作意见', dataIndex: 'opinion' },
];

export default {
  name: 'ActionButton',
  props: {
    detailData: {
      default: () => {
        return {
          contract: {},
        };
      },
    },
    // 登录的企业信息
    VUEX_ST_COMPANYSUER: {
      default: () => {
        return {
          roles: [],
        };
      },
    },
    // 使用的接口

    removeBusinessLineCheck: {},
    removeBusinessLine: {},
    checkBuyFinish: {},
    checkSellFinish: {},
    submitBuyFinish: {},
    submitSellFinish: {},
    // 业务线
    getBusinessLineRiskAlertList: {},
    // 上下游审核
    contractFinishAudit: {},
    // 历史记录
    getContractFinishLogList: {},

    isBank: {
      default: false,
    },
    type: {
      default: 'rest',
    },
  },
  data() {
    return {
      // 审批驳回的状态枚举值
      rejectStatusList: [
        'COMPLETED_AUDIT_REJECT',
        'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
        'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS',
        'UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING',
        'UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT',
        'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_REJECT',
        'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT',
      ],
      selectType: 'buy',
      // 解除业务线
      removeBusinessVisible: false,
      downloadVisible: false,
      // 下载
      downType: [],
      fileList: [],
      // 合同完结
      finishVisible: false,
      finishType: '',
      // 解除业务线信息
      removeBusinessErrorList: [],
      // admin 上下游完结审核
      modalFileForm: this.$form.createForm(this),
      adminAuditLogVisible: false,
      adminAuditVisible: false,
      historyColumns,
      historyAllColumns,
      historyList: [],
      isLoading: false,
      contractFinishInfo: {},
      message: '',
      downLoading: false,
    };
  },
  computed: {
    roles() {
      return this.VUEX_ST_COMPANYSUER.roles;
    },
    isFinishAuth() {
      return this.roles.some((el) => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el));
    },
    auditTitle() {
      if (this.adminAuditType == 'up') {
        return '上游完结审核';
      }
      return '下游完结审核';
    },
    // 上下游按钮审核权限
    isShowAuthDownBtn() {
      return [
        'UP_EXECUTING_DOWN_COMPLETED_AUDIT_ING',
        'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_ING',
        'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
        'COMPLETED_AUDIT_ING',
      ].includes(this.detailData.businessLineDisplayStatus);
    },
    isShowAuthUpBtn() {
      return [
        'UP_COMPLETED_AUDIT_ING_DOWN_EXECUTING',
        'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT',
        'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_PASS',
        'COMPLETED_AUDIT_ING',
      ].includes(this.detailData.businessLineDisplayStatus);
    },
    // 滚动的距离
    isShowFixedTitle() {
      if (this.type == 'rest') {
        return this.$store.state.scroll.scrollDistance >= 120;
      }
      return this.$store.state.scroll.scrollDistance >= 130;
    },
  },
  activated() {
    this.selectType = 'buy';
  },
  mounted() {},
  watch: {
    detailData: {
      handler(info) {
        // 判断当前有没有运输合同
        if (info.transContractNo) {
          this.downType = ['UP_STREAM', 'DOWN_STREAM', 'TRANS_CONTRACT'];
          this.fileList = [
            { label: '上游附件', value: 'UP_STREAM' },
            { label: '下游附件', value: 'DOWN_STREAM' },
            { label: '运输合同附件', value: 'TRANS_CONTRACT' },
          ];
        } else {
          this.downType = ['UP_STREAM', 'DOWN_STREAM'];
          this.fileList = [
            { label: '上游附件', value: 'UP_STREAM' },
            { label: '下游附件', value: 'DOWN_STREAM' },
          ];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 风险预警
    warningFunc() {
      if (!this.detailData.riskAlertCount) return;
      let m = function (e) {
        e.preventDefault();
      };
      document.body.style.overflow = 'hidden';
      document.body.style.setProperty('height', '100vh', 'important');

      document.addEventListener('touchmove', m, { passive: false }); //禁止页面
      this.$refs.warningDrawer.open();
    },
    // 解除业务线
    async relieveBusiness() {
      console.log(this.detailData);
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
      };
      const res = await this.removeBusinessLineCheck(params);
      const list = res.data || [];
      this.removeBusinessErrorList = res.data;
      // 有报错信息
      if (list.length) {
        this.removeBusinessVisible = true;
      } else {
        this.$refs.tipModal.open();
      }
    },
    // 确认解除业务线
    async confirmRelieve() {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
      };
      await this.removeBusinessLine(params);
      this.$message.success('业务线已解除');
      this.$router.push('/center/businessline/list');
    },
    // 下载附件
    async downloadFile() {
      if (!this.downType.length) {
        this.$message.error('请选择要下载的附件');
        return;
      }
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        typeList: this.downType,
        ...this.$route.query,
      };
      this.downLoading = true;
      await this.$emit('downloadFile', params);
      this.downLoading = false;
      this.downloadVisible = false;
    },
    // 完结合同
    async finishContract() {
      if (!this.finishType) {
        this.$message.error('请选择要完结的合同');
        return;
      }
      // const params = {
      // 	businessLineNo: this.$route.query.businessLineNo,
      // 	downType: this.downType
      // };
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        finishType: this.finishType,
      };
      // await this.checkBuyFinish(params);
      // await this.submitBuyFinish(params);
      this.finishVisible = false;
      this.$emit('finishContract', params);
      // /** 判断当前选择的上下游 */
      // if (this.finishType == 1) {
      // 	const params = {
      // 		businessLineNo: this.$route.query.businessLineNo,
      // 		finishType: this.finishType,
      // 	};
      // 	// await this.checkBuyFinish(params);
      // 	// await this.submitBuyFinish(params);
      // 	this.finishVisible = false;
      // 	this.$emit('finishContract', params);
      // }
      // if (this.finishType == 2) {
      // 	const params = {
      // 		businessLineNo: this.$route.query.businessLineNo,
      // 		finishType: this.finishType,
      // 	};
      // 	// await this.checkSellFinish(params);
      // 	// await this.submitSellFinish(params);
      // 	this.finishVisible = false;
      // 	this.$emit('finishContract', params);
      // }
    },
    // 去往货转
    goTransfer(keyword) {
      window.open(`/center/transfer/goodsTransfer/detail?goodsTransferNo=${keyword.goodsTransferNo}`);
    },
    // 去往付款
    goPayDetail(keyword) {
      const { href } = this.$router.resolve({
        path: '/center/fund/pay/record/detail',
        query: {
          id: keyword.paymentId,
          orderType: keyword.orderType,
          orderId: keyword.orderId,
          contractSource: keyword.contractSource || null,
          type: 'overview',
        },
      });
      window.open(href, '_new');
    },
    // 上下游完结审核
    openAudit() {
      // this.adminAuditType = type;
      this.adminAuditVisible = true;
      let dataType = 'UP_STREAM';
      if (this.isShowAuthDownBtn) {
        dataType = 'DOWN_STREAM';
      }
      if (this.isShowAuthUpBtn && this.isShowAuthDownBtn) {
        dataType = 'UP_STREAM';
      }

      this.getContractFinishLog(dataType);
      this.$nextTick(() => {
        this.modalFileForm.setFieldsValue({ dataType, auditType: 'PASS', opinion: undefined });
      });
    },
    changeContact(e) {
      this.getContractFinishLog(e.target.value);
    },
    // 获取历史记录
    async getContractFinishLog(dataType) {
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        dataType,
      };
      let res = await this.getContractFinishLogList(params);
      this.historyList = res.data;
    },
    openLog() {
      this.adminAuditLogVisible = true;
      this.getContractFinishLog(null);
    },
    // 确认审核
    confirmAudit() {
      this.modalFileForm.validateFields(async (err, values) => {
        if (!err) {
          const params = {
            ...this.$route.query,
            businessLineNo: this.$route.query.businessLineNo,
            ...values,
          };

          this.isLoading = true;

          if (values.auditType == 'PASS') {
            this.contractFinishInfo = { validPass: true };
            this.$refs.contractFinish.open();
          }

          try {
            const res = await this.contractFinishAudit(params);
            this.adminAuditVisible = false;
            if (values.auditType == 'PASS') {
              // 判断当前是通过还是拒绝
              if (res.data.validPass) {
                this.$refs.contractFinish.close();
                this.$message.success('校验通过');
                this.$emit('finishContract', params);
              } else {
                this.isLoading = false;
                this.contractFinishInfo = res.data;
                this.message = `${
                  values.dataType == 'UP_STREAM' ? '上游采购' : '下游销售'
                }合同存在以下问题，请处理后重新发起申请`;
              }
            } else {
              this.$message.success('操作成功');
              this.$emit('finishContract', params);
            }
          } catch (error) {
            this.isLoading = false;
            this.$refs.contractFinish.close();
          }

          // this.adminAuditVisible = false;
          // if (values.auditType == 'PASS') {
          // 	this.$message.success('审核已通过');
          // } else {
          // 	this.$message.success('审核已驳回');
          // }
        }
      });
    },
    goAfter() {
      this.$router.push('/data/payauditafter/detail?data=1&businessLineNo=' + this.$route.query.businessLineNo);
    },
    changeTab(type) {
      this.selectType = type;
      this.$emit('changeTab', type);
    },
    // 查看监控
    toMonitor() {
      this.$emit('toMonitor');
    },
  },
  components: {
    TipModal,
    WarningDrawer,
    ContractFinish,
  },
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less">
.white-bg-tooltips {
  a {
    display: block;
    margin: 5px 0;
    line-height: 22px;
  }
  .ant-tooltip-inner {
    background: #fff;
    padding: 10px 20px;
  }
  .ant-tooltip {
    color: #fff;
  }
  .ant-tooltip-arrow::before {
    background-color: #fff;
  }
}
</style>
