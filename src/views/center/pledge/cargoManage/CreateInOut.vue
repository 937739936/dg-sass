<template>
  <div class="s-card" v-if="detailData">
    <div style="margin: -10px -20px -20px -20px;">
      <div class="top-box" style="background:#fff;">
        <div class="s-card-title">
          <span v-if="isEdit">编辑{{ pageTypeText }}</span>
            <span v-else>新增{{ pageTypeText }}</span>
          <a href="javascript:;" @click="jumpPage">返回</a>
        </div>
        <div class="divider"></div>
        <!-- 只显⽰当前“平台驳回”的审核信息 -->
        <div class="s-card-content" v-if="detailData.receivalVO && detailData.receivalVO.status == 'PLATFORM_REJECT' && detailData.auditInfo && detailData.auditInfo.audit && detailData.auditInfo.audit.auditResult != 'PASS'">
          <h2>审核信息</h2>
                    <a-row>
            <a-col :span="4">审批人</a-col>
            <a-col :span="20">{{detailData.auditInfo.audit.auditor}}</a-col>
          </a-row>
          <a-row>
            <a-col :span="4">审核时间</a-col>
            <a-col :span="20">{{detailData.auditInfo.audit.auditTime}}</a-col>
          </a-row>
          <a-row>
            <a-col :span="4">审核结果</a-col>
            <a-col :span="20" class="red">驳回</a-col>
          </a-row>
          <a-row>
            <a-col :span="4">驳回原因</a-col>
            <a-col :span="20">{{detailData.auditInfo.audit.auditOpinion}}</a-col>
          </a-row>
        </div>

      </div>
            <!-- 只显⽰当前“融资失败”且已批注的批注信息-->
            <div class="s-card-content" v-if="detailData.receivalVO && detailData.receivalVO.status == 'COMMENTED' && detailData.commentInfo && detailData.commentInfo.comment">
                <h2>批注信息</h2>
                <a-row>
                    <a-col :span="4">批注人</a-col>
                    <a-col :span="20">{{detailData.commentInfo.comment.commenter}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="4">批注时间</a-col>
                    <a-col :span="20">{{detailData.commentInfo.comment.createDate}}</a-col>
                </a-row>
                <a-row>
                    <a-col :span="4">批注信息</a-col>
                    <a-col :span="20">{{detailData.commentInfo.comment.remark}}</a-col>
                </a-row>

            </div>
      <div class="bottom-box">
        <div class="s-card-content">
                    <a-form :form="baseForm">
                        <h2>{{ pageTypeText }}信息</h2>
                        <a-row class="row">
                            <a-col span="12">
                                <a-row>
                                    <a-form-item label="货主名称"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <span>{{ VUEX_ST_COMPANYSUER.companyName }}</span>
                                    </a-form-item>

                                </a-row>
                                <a-row>
                                    <a-form-item label="仓储企业"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    {{ storageCompanyName }}
                                    </a-form-item>
                                </a-row>
                                <!-- <a-row>
                                    <a-form-item label="货物名称"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <a-select
                                        placeholder="请选择货物"
                                            v-decorator="[
                                                    `industryType`,
                                                    {
                                                        rules: [
                                                        { required: true, message: `货物必填`},
                                                        ],
                                                    },
                                                ]"
                                            >
                                        <a-select-option
                                            v-for="(item, index) in [{name:'煤炭',value:'COAL'},{name:'钢材',value:'STEEL'}]"
                                            :key="index"
                                            :value="item.value">
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>

                                    </a-form-item>
                                </a-row> -->
                                <a-row>
                                    <a-form-item label="存货点"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 14}"
                                    >
                                        <a-select
                                            showSearch
                                            @change="inventoryPointChange"
                                            :filterOption="false"
                                            :defaultActiveFirstOption="false"
                                            placeholder="请先选择仓库再选择存货点"
                                                v-decorator="[
                                                        `inventoryPoint`,
                                                        {
                                                            rules: [
                                                            { required: true, message: `存货点必填`},
                                                            ],
                                                        },
                                                    ]"
                                                >
                                            <a-select-option
                                                v-for="(item, index) in pointList"
                                                :key="index"
                                                :value="item.value">
                                                {{ item.label }}
                                            </a-select-option>
                                        </a-select>

                                    </a-form-item>
                                </a-row>
                                <!-- <a-row>
                                    <a-form-item label="应收账款类型"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                        <a-radio-group button-style="solid"
                                           v-decorator="[
                                                `type`,
                                                {
                                                    initialValue:'PROOF',
                                                    rules: [
                                                    { required: true, message: `应收账款类型必填`},
                                                    ],
                                                },
                                            ]">
                                            <a-radio-button value="PROOF">凭证结算</a-radio-button>
                                            <a-radio-button value="INVOICE">发票结算</a-radio-button>
                                        </a-radio-group>
                                    </a-form-item>
                                </a-row> -->
                                <!-- <a-row>
                                    <a-form-item label="应收账款起始日期"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <a-date-picker
                                        @change="changeBeginDate"
                                        :disabled-date="disabledDate"
                                        v-decorator="[
                                        `beginDate`,
                                        {
                                        rules: [{ required: true, message: `应收账款起始日期必填` }],validateTrigger:'change'
                                        }]"></a-date-picker>
                                    </a-form-item>
                                </a-row> -->

                                <a-row>
                                    <a-form-item
                                        :label="`${pageTypeText}单号`"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 14}"
                                    >
                                      <a-input
                                        :placeholder="`请输入${pageTypeText}单号`"
                                        @focus="disabled = true"
                                        @blur="verifyData"
                                        v-decorator="[
                                                `number`,
                                                {
                                                    rules: [
                                                    { required: true, message: `${pageTypeText}单号必填`},
                                                    { max: 20, message: `${pageTypeText}单号长度不能超过20个字符` }
                                                    // {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                                    ],
                                                },
                                            ]"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="数量(吨)"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 14}"
                                    >
                                      <a-input-number
                                        placeholder="请输入数量"
                                        :min="0"
                                        :precision="4"
                                        :max="999999999"
                                        style="width: 100%"
                                        @focus="disabled = true"
                                        @blur="verifyData"
                                        v-decorator="[
                                                `quantity`,
                                                {
                                                    rules: [
                                                    { required: true, message: `数量必填`},
                                                    // { pattern: numberReg,message:'请输入数字，最多两位小数'},
                                                    // { validator: validplanFinancingAmount, trigger: 'change',message: `拟融资金额大于应收账款金额`}
                                                    ],
                                                },
                                            ]"
                                        >
                                        </a-input-number>
                                    </a-form-item>
                                </a-row>
                                <!-- <a-row>
                                    <a-form-item label="资金类型"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 14}"
                                    >
                                        <a-select
                                            showSearch
                                            :filterOption="false"
                                            :defaultActiveFirstOption="false"
                                            @change="changeBankName"
                                            placeholder="请输入资金类型"
                                                v-decorator="[
                                                        `paymentType`,
                                                        {
                                                            rules: [
                                                            { required: true, message: `资金类型必填`},
                                                            ],
                                                        },
                                                    ]"
                                                >
                                            <a-select-option
                                                v-for="(item, index) in bankList"
                                                :key="index"
                                                :value="item.paymentType">
                                                {{ item.name }}
                                            </a-select-option>
                                        </a-select>

                                    </a-form-item>
                                </a-row> -->
                                <!-- <a-row>
                                    <a-form-item label="状态"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <span v-if="detailData.receivalVO">{{filterCodeByValueName(detailData.receivalVO.status,'receivableStatusDict')}}</span>
                                    <span v-else>待提交</span>
                                    </a-form-item>
                                </a-row> -->
                                <a-row>
                                    <a-form-item label="运输方式"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 14}"
                                    >
                                        <a-select
                                            showSearch
                                            :filterOption="false"
                                            :defaultActiveFirstOption="false"
                                            placeholder="请选择运输方式"
                                            @change="verifyData"
                                                v-decorator="[
                                                        `transportMode`,
                                                        {
                                                            rules: [
                                                            { required: true, message: `运输方式必填`},
                                                            ],
                                                        },
                                                    ]"
                                                >
                                            <a-select-option
                                                v-for="(item, index) in transportModeList"
                                                :key="index"
                                                :value="item.value">
                                                {{ item.text }}
                                            </a-select-option>
                                        </a-select>

                                    </a-form-item>
                                </a-row>
                            </a-col>
                            <a-col span="12">
                                <a-row>
                                    <a-form-item label="仓库名称"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <a-select
                                        placeholder="请选择仓库"
                                        @change="resetInventoryPoint()"
                                            v-decorator="[
                                                    `storageId`,
                                                    {
                                                        rules: [
                                                        { required: true, message: `仓库必填`},
                                                        ],
                                                    },
                                                ]"
                                            >
                                        <a-select-option
                                            @click="storageChange(item)"
                                            v-for="(item, index) in storageList"
                                            :key="index"
                                            :value="item.value">
                                            {{ item.label }}
                                        </a-select-option>
                                    </a-select>

                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item label="货物名称"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                        <a-input
                                            placeholder="请输入货物名称"
                                            @focus="disabled = true"
                                            @blur="verifyData"
                                            v-decorator="[
                                                `goodsName`,
                                                {
                                                    rules: [
                                                    { required: true, message: `货物名称必填`},
                                                    { max: 20, message: '货物名称长度不能超过20个字符' },
                                                    // {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                                    ],
                                                },
                                            ]"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </a-row>
                               <!--  <a-row>
                                    <a-form-item label="金融机构"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                        <span v-if="bankName">{{bankName}}</span>
                                        <span v-else-if="detailData.receivalVO">{{detailData.receivalVO.bankName}}</span>
                                        <span v-else>-</span>
                                    </a-form-item>
                                </a-row> -->
                                <a-row>
                                    <a-form-item label="方向"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <a-select
                                        :filterOption="false"
                                        :defaultActiveFirstOption="false"
                                        @change="verifyData"
                                        placeholder="请输入方向"
                                            v-decorator="[
                                                    `direction`,
                                                    {
                                                        rules: [
                                                        { required: true, message: `方向必填`},
                                                        ],
                                                    },
                                                ]"
                                            >
                                        <a-select-option
                                            v-for="(item, index) in directionList"
                                            :key="index"
                                            :value="item">
                                            {{ item }}
                                        </a-select-option>
                                    </a-select>

                                    </a-form-item>
                                </a-row>
                                <!-- <a-row>
                                    <a-form-item label="应收账款到期日期"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >

                                    <span v-if="endDate">{{endDate}}</span>
                                        <span v-else-if="detailData.receivalVO">{{detailData.receivalVO.endDate}}</span>
                                        <span v-else>-</span>
                                    </a-form-item>
                                </a-row> -->
                                <a-row>
                                    <a-form-item
                                    :label="`${pageTypeText}日期`"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <a-date-picker
                                        style="width: 100%"
                                        @change="changeBeginDate"
                                        :disabled-date="disabledDate"
                                        valueFormat="YYYY-MM-DD"
                                        v-decorator="[
                                        `inoutDate`,
                                        {
                                        rules: [{ required: true, message: `${pageTypeText}日期必填` }],validateTrigger:'change'
                                        }]"></a-date-picker>
                                    </a-form-item>
                                </a-row>
                                <a-row>
                                    <a-form-item
                                        :label="`${pageTypeText}热值(Kcal/kg)`"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                      <a-input-number
                                            style="width: 100%"
                                            :min="1000"
                                            :precision="2"
                                            :max="7500"
                                            @focus="disabled = true"
                                            @blur="verifyData"
                                            :placeholder="`请输入${pageTypeText}热值`"
                                            v-decorator="[
                                                `heatValue`,
                                                {
                                                    rules: [
                                                    { required: true, message: `${pageTypeText}热值必填`},
                                                    // {pattern: numberReg,message:'请输入数字，最多两位小数'},
                                                    // { validator: validplanFinancingAmount, trigger: 'change',message: `拟融资金额大于应收账款金额`}
                                                    ],
                                                },
                                            ]"
                                        >
                                        </a-input-number>
                                    </a-form-item>
                                </a-row>
                                <!-- <a-row>
                                    <a-form-item label="应收账款申请日期"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    <span v-if="detailData.receivalVO">{{detailData.receivalVO.requestTime}}</span>
                                    <span v-else>{{moment().format('YYYY-MM-DD HH:mm:ss')}}</span>
                                    </a-form-item>
                                </a-row> -->
                                <!-- <a-row>
                                    <a-form-item label="数据来源"
                                        :label-col="{ span: 9}"
                                        :wrapper-col="{span: 15}"
                                    >
                                    资产管理
                                    </a-form-item>
                                </a-row> -->
                            </a-col>
                        </a-row>
                    </a-form>
        </div>

      </div>
      <div class="s-card-content" style="padding-bottom: 30px;">
        <a-row :gutter="40">
          <a-col span="4">
            <div class="tabs-bar">
              <div @click="tabChange(0)" v-if="pageType === 'in'">
                <div class="tabs-icon">
                  <img src="@/assets/imgs/monitoring/contract.png" alt="">
                  <em></em>
                </div>
                <div class="tabs-text">
                  <p :class="activeIndex == 0 ? 'blue': ''">采购合同</p>
                </div>
                <i :class="judgeColor(0)"></i>
              </div>
              <div @click="tabChange(1)">
                <div class="tabs-icon">
                  <img src="@/assets/imgs/monitoring/delivery.png" alt="">
                  <em></em>
                </div>
                <div class="tabs-text">
                  <p :class="activeIndex == 1 ? 'blue': ''">{{pageTypeText}}单据</p>
                </div>
                <i :class="judgeColor(1)"></i>
              </div>
              <div @click="tabChange(2)">
                <div class="tabs-icon">
                  <img src="@/assets/imgs/monitoring/file.png" alt="">
                </div>
                <div class="tabs-text">
                  <p :class="activeIndex == 2 ? 'blue': ''">其他材料</p>
                </div>
                <i :class="judgeColor(2)"></i>
              </div>

            </div>
          </a-col>
          <!-- 右侧数据展示模块 -->
          <a-col span="20">
            <div style="min-height: 520px;display: flex;flex-direction: column;justify-content: space-between;">
              <!-- 合同 -->
              <!-- {{ contractInfo }} -->
            <!-- {{ otherAttachment }} -->
            <!-- {{ bill }} -->
            <template v-if="pageType === 'in'">
                <contract
                    v-show="activeIndex == 0"
                    :editFlag="true"
                    @contractNoFocusAndBlur="contractNoFocusAndBlur"
                    :typeIndex="typeIndex"
                    :contractInfo="contractInfo"
                    ref="contract"
                    @typeChange="typeChange"
                    @offlineContractNoChange="offlineContractNoChange"
                    @refreshmanualTerminalContract="refreshmanualTerminalContract"></contract>
            </template>
              <InOutBill v-show="activeIndex == 1" :pageType="pageType" :editFlag="true" :otherInfo="bill" :receivalVO="detailData.receivalVO" ref="inOutBill" />
              <other-files v-show="activeIndex == 2" :pageType="pageType" :editFlag="true" :otherInfo="otherAttachment" :receivalVO="detailData.receivalVO" ref="other"></other-files>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="btn-box">
        <div class="btn-wrap">
          <a-button @click="jumpPage" type="primary" ghost>取消</a-button>
          <!-- <a-button type="primary" @click="getSubmitData('save')">保存</a-button> -->
          <a-button type="primary" @click="getSubmitData('submit')" :disabled="disabled">提交</a-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="jsx">
  import { filterCodeByValueName } from '@sub/utils/globalCode.js'
  import {
    API_GetAccountsManualDetail,
    API_asset_getManualBankProduct,
    API_assetmanual_getManualBuyer,
    API_assetmanual_getEndDate,
    API_STORAGEGOODSSTORAGELIST,
    API_STORAGEGOODSOUTRECORDSAVE,
    API_STORAGEGOODSPOINTLIST,
    API_STORAGEGOODSDETAIL,
    API_STORAGEGOODSONLINECONTRACTDETAIL,
    API_STORAGEGOODSOUTRECORDASSETSTATUS,

    API_STORAGEGOODSOUTRECORDCONTRACT,
    API_STORAGEGOODSOUTRECORDOTHERATTACHMENT,
    API_STORAGEGOODSOUTRECORDBILLS,
    API_STORAGEGOODSOUTRECORDDETAIL,
    API_STORAGEGOODSSTORAGEDIRECTION,
} from 'api'
  import Contract from "./components/manual/contract.vue"
  import TransportDocument from "./components/manual/TransportDocument.vue"
  import QualityDocument from "./components/manual/QualityDocument.vue"
  import GoodsTransferDocument from "./components/manual/GoodsTransferDocument.vue"
  import AccountsTable from "./components/manual/AccountsTable.vue"
  import Invoice from "./components/manual/Invoice.vue"
  import OtherFiles from "./components/manual/OtherFiles.vue"
  import InOutBill from "./components/manual/InOutBill.vue"
    import SettlesFiles from "./components/manual/SettlesFiles.vue"
  import { mapMutations,mapGetters } from 'vuex'
    import _ from 'lodash';
    import moment from 'moment';
    import { filterCodeByKey } from '@sub/utils/globalCode.js'

    export default {
        data() {
            return {
                id: '',
                goodsId: '',
                disabled: false,
                bill: [],
                otherAttachment: [],
                contractInfo: {},

                typeIndex: 1,
                transportModeList: filterCodeByKey("storageGoodsOutTransModelDict"),
                storageCompanyName: '',
                moment,
                directionList: [],
                // goodsId: '',
                storageList: [],
                pointList: [],
                pageType: '',
                pageTypeText: '',
                baseForm:this.$form.createForm(this),
        filterCodeByValueName: filterCodeByValueName,
        activeIndex: this.$route.query.activeIndex,
                numberReg:/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
                bankList:[{paymentType:1,name:'xxx',bankName:'bankName'}],
                bankName:'',
                endDate:'',
                buyerNameList:[{companyName:'companyName','uscc':'123'}],
        detailData: {}, // 详情数据
                isEdit:false,
        strMsg:'', // 提交时发票状态错误提示信息内容
                visible: false // 提交时发票状态错误提示信息弹窗
            }
    },
    components: {
      Contract,
      TransportDocument,
      QualityDocument,
      GoodsTransferDocument,
      AccountsTable,
      // ConfirmLetter,
      Invoice,
      OtherFiles,
    SettlesFiles,
    InOutBill,
    },
    computed: {
    ...mapGetters('user', {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
    }),
        },
        mounted: function () {
            this.pageType = this.$route.query.pageType
            this.pageTypeText = { in: '入库', out: '出库' }[this.pageType]

            if (this.pageType === 'in') {
                this.transportModeList = filterCodeByKey("storageGoodsInTransModelDict")
            }

            this.tabChange(this.$route.query.activeIndex)
            this.isEdit = this.$route.query.id ? true : false
            if (this.$route.query.id) {
                this.id = this.$route.query.id
            }
            this.goodsId = this.$route.query.goodsId

            API_STORAGEGOODSSTORAGELIST().then((res) => {
                if (res.success) {
                    this.storageList = res.data.map((item) => {
                        return {
                            label: item.name,
                            value: item.id,
                            storageCompanyName: item.storageCompanyName,
                        }
                    })
                    if (this.$route.query.storageId) {
                        let storageCompanyName = ''
                        this.storageList.forEach((item) => {
                            if (item.value == this.$route.query.storageId) {
                                storageCompanyName = item.storageCompanyName
                            }
                        })
                        this.storageChange({ value: this.$route.query.storageId, storageCompanyName })
                    }

                }
            })
            if (this.id) {
                this.getAllDetailData()
            }
            if (this.$route.query.storageId) {
                this.$nextTick(() => {
                    this.baseForm.setFieldsValue({
                        storageId: +this.$route.query.storageId,
                        inventoryPoint: +this.$route.query.pointId,
                    })
                })
                this.getDirectionList(this.$route.query.storageId)
            }

            // this.VUEX_SET_MANUAL_ASSET_OBJ({
            //     disableCopy:false
            // })

            // if (this.isEdit) {
            //     API_GetAccountsManualDetail({id: this.$route.query.id}).then(res=>{

            //         if (res.success) {

            //             this.detailData = res.data||{}

            //             this.dealEditData()
            //         }
            //     })
            // }



            // API_asset_getManualBankProduct().then(res=>{
            //     this.bankList = res.data||[]
            // })
            // API_assetmanual_getManualBuyer().then(res=>{
            //     this.buyerNameList = res.data||[]
            // })
        },
        methods: {
            ...mapMutations({
                VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
            }),
            getDirectionList(storageId) {
                API_STORAGEGOODSSTORAGEDIRECTION({ storageId }).then((res) => {
                    if (res.success) {
                        this.directionList = res.data
                    }
                })
            },
            typeChange(value) {
                this.typeIndex = value
            },
            contractNoFocusAndBlur(value) {
                this.disabled = value
            },
            offlineContractNoChange(data) {
                this.contractInfo = data
            },
            getAllDetailData() {
                const params = {id: this.id, type: this.pageType }
                API_STORAGEGOODSOUTRECORDDETAIL(params).then(res=>{
                    if (res.success) {
                        this.baseForm.setFieldsValue({
                            ...res.data,
                        })
                        const { storageId, storageCompanyName, goodsId } = res.data
                        this.$nextTick(() => {
                            this.storageChange({ value: storageId, storageCompanyName })
                            this.goodsId = goodsId
                        })
                        this.getDirectionList(storageId)
                    }
                })
                API_STORAGEGOODSOUTRECORDBILLS(params).then((res) => {
                    if (res.success) {
                        this.bill = res.data
                    }
                })
                API_STORAGEGOODSOUTRECORDOTHERATTACHMENT(params).then((res) => {
                    if (res.success) {
                        this.otherAttachment = res.data
                    }
                })
                if (this.pageType === 'in') {
                    API_STORAGEGOODSOUTRECORDCONTRACT(params).then((res) => {
                        if (res.success) {
                            if (res.data.contractType == 'OFFLINE') {
                                this.typeIndex = 2
                            }
                            this.contractInfo = res.data
                        }
                    })
                }
            },
            jumpPage() {
                this.$router.go(-1)
                // this.$router.push({
                //     path: '/center/pledge/portdetail',
                //     query: {
                //         id: this.$route.query.pointId,
                //     }
                // })
            },
            resetInventoryPoint() {
                this.baseForm.resetFields(['inventoryPoint'])
                this.goodsId = ''
            },
            verifyData() {
                const keyList = ["storageId", 'inventoryPoint', 'direction', 'goodsName', 'number', 'inoutDate', 'quantity', 'heatValue', 'transportMode']
                this.$nextTick(() => {
                    this.baseForm.validateFields(keyList, (err, values) => {
                        if (!err) {
                            const { inventoryPoint, direction, quantity, goodsName } = values
                            let point = this.pointList.find(o=>{
                                return o.inventoryPointId == inventoryPoint
                            })

                            API_STORAGEGOODSOUTRECORDASSETSTATUS({ inventoryPoint:point.inventoryPoint, direction, quantity, goodsName }).then((res) => {
                            if (res.success) {
                                if (!res.data) {
                                    this.notAvailable()
                                }
                            }
                        }).finally(() => {
                            this.disabled = false
                        })
                        } else {
                            this.disabled = false
                        }
                    })
                })
            },
            inventoryPointChange(inventoryPointId) {
                this.goodsId = ''
                API_STORAGEGOODSDETAIL({ inventoryPointId, storageId: this.baseForm.getFieldValue('storageId') }).then((res) => {
                    if (res.success) {
                        this.goodsId = res.data.id
                    }
                })
                this.verifyData()
            },
            storageChange({ value, storageCompanyName }) {
                this.storageCompanyName = storageCompanyName
                API_STORAGEGOODSPOINTLIST({ storageId: value }).then((res) => {
                    if (res.success) {
                      this.pointList = res.data.map((item) => {
                        return {
                            label: item.inventoryPoint,
                            value: item.inventoryPointId,
                            inventoryPointId:item.inventoryPointId,
                            inventoryPoint:item.inventoryPoint,
                        }
                      })
                    }
                  })
            },
            dealEditData(){
                this.baseForm.setFieldsValue({
                    ...this.detailData.receivalVO,
                    beginDate:moment(this.detailData.receivalVO.beginDate)
                })
                setTimeout(()=>{
                    this.changeBankName(this.detailData.receivalVO.paymentType)
                    this.changeBuyname(this.detailData.receivalVO.buyerUscc)
                },1600)


            },
      tabChange(index) { // 下游数据tabs切换
        this.activeIndex = index
      },
            disabledDate(current) {
                return current && current > moment().endOf('day');
            },
            refreshmanualTerminalContract(data){
                this.baseForm.setFieldsValue({
                    buyerUscc:data.buyerBizNo
                })
                this.changeBuyname(data.buyerBizNo)
                this.detailData.manualTerminalContract = data

            },
            saveAsset(){
                this.getSubmitData('save','nojump')
            },
            validplanFinancingAmount(rule, value, callback){
                let amount = this.baseForm.getFieldValue('amount')
                if (amount && Number(value) > Number(amount)) {
                    callback(true)
                } else {
                    callback()
                }
            },
            judgeColor(){},
      // judgeColor(index) {
            //     return
      //  // 项下各必备附件存在数据时，标记绿色
      //  // 项下附件存在数据时，标记桔色
      //  // 项下附件无数据时，标记红色
      //  //0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
      //  if (!this.detailData) return
      //  if (index == 0) { // 合同
      //    if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) || (this.detailData.contractInfo.tradeContract && this.detailData.contractInfo.tradeContract.list.length>0) || (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
      //      if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) && (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
      //        return 'green'
      //      } else {
      //        return 'orange'
      //      }
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 1) { // 运输凭证
      //    if (this.detailData.deliverInfo.attachList && this.detailData.deliverInfo.attachList.length>0) {
      //      return 'green'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 2) { // 数质量凭证
      //    if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length>0) {
      //      return 'green'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 3) { // 货转凭证
      //    if (this.detailData.goodTransferInfo.list && this.detailData.goodTransferInfo.list.length>0) {
      //      return 'orange'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 4) { // 核算表凭证
      //    if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length>0) {
      //      return 'green'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 5) { // 确认函
      //    if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length>0) {
      //      return 'orange'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 6) { // 发票
      //    if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length>0) {
      //      return 'orange'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 7) { // 其他材料
      //    if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length>0) {
      //      return 'orange'
      //    } else {
      //      return 'red'
      //    }
      //  } else if (index == 8) { // 结算单
      //    if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length>0) {
      //      return 'orange'
      //    } else {
      //      return 'red'
      //    }
      //  }
      // },

      getSubmitData(type,jump){

                // this.$refs.transport.onSubmit()
                this.baseForm.validateFields((error,values)=>{
                    if (!error) {

                        const baseInfo = _.pick(values, ['inventoryPoint', 'goodsName', 'direction', 'number', 'inoutDate', 'quantity', 'heatValue', 'transportMode'])
                        baseInfo.goodsId = this.goodsId
                        // baseInfo.inoutDate = baseInfo.inoutDate.format('YYYY-MM-DD')
                        if (this.id) {
                            baseInfo.id = this.id
                        }
                        if (this.pageType === 'out') {
                            const billList = this.$refs.inOutBill.onSubmit()
                            const otherFileList = this.$refs.other.onSubmit()
                            if (billList.length <= 0) {
                                this.$message.error(`请上传${this.pageTypeText}单据`)
                                return
                            }

                            let obj = {
                                baseInfo,
                                type: this.pageType.toUpperCase(),
                                billList,
                                otherFileList,
                            }
                            this.doSubmit(obj,jump)
                            return
                        }
                        this.$refs.contract.onSubmit((contractInfo) => {

                            const billList = this.$refs.inOutBill.onSubmit()
                            const otherFileList = this.$refs.other.onSubmit()
                            if (billList.length <= 0) {
                                this.$message.error(`请上传${this.pageTypeText}单据`)
                                return
                            }

                            let obj = {
                                baseInfo,
                                type: this.pageType.toUpperCase(),
                                billList,
                                otherFileList,
                            }
                            if (this.pageType === 'in') {
                                obj.contractInfo = contractInfo
                            }
                            this.doSubmit(obj,jump)
                        })
                    } else {
                        this.$message.error('基本信息内容填写不完整')
                    }
                })
      },

            getEndDate(){

                let beginDate = this.baseForm.getFieldValue('beginDate') ? this.baseForm.getFieldValue('beginDate').format('YYYY-MM-DD') : null
                let paymentType = _.find(this.bankList,{bankName:this.bankName}) ? _.find(this.bankList,{bankName:this.bankName}).paymentType:null
                if (paymentType && beginDate) {
                    API_assetmanual_getEndDate({paymentType,beginDate}).then(res=>{
                        this.endDate = res.data||''
                    })
                }

            },
            changeBankName(v){
                this.bankName = _.find(this.bankList,{paymentType:v}).bankName
                this.bankUscc = _.find(this.bankList,{paymentType:v}).bankUscc
                this.getEndDate()
            },
            changeBeginDate(){
                this.verifyData()
                this.getEndDate()
            },
            notAvailable() {
                this.$confirm({
                  closable: true,
                  content: '对应货物港口验证未通过，请重新填写',
                  okText: '确认',
                  icon: () => {
                    return <a-icon type="exclamation-circle" theme="filled" />
                  },
                  onOk: () => {},
                  cancelButtonProps: {
                    style: { display: "none" },
                  },
                  onCancel() {}
                });
            },
      doSubmit(obj,jump){
        if (obj) {
            this.$confirm({
              closable: true,
              content: '请确认数据填写无误，是否提交？',
              okText: '确认',
              icon: () => {
                return <a-icon type="exclamation-circle" theme="filled" />
              },
              onOk: () => {
                if (this.pageType === 'in') {
                    const { inventoryPoint, direction, quantity, goodsName } = obj.baseInfo
                    let point = {};
                    if(this.$route.query.pointId) {
                        point = this.pointList.find(o=>{
                            return o.inventoryPointId == inventoryPoint
                        })
                    } else {
                        point = this.pointList.find(o=>{
                            return o.inventoryPoint == inventoryPoint
                        })
                    }
                    API_STORAGEGOODSOUTRECORDASSETSTATUS({ inventoryPoint:point.inventoryPoint, direction, quantity, goodsName }).then((res) => {
                        if (res.success) {
                            if (res.data) {
                                API_STORAGEGOODSOUTRECORDSAVE(obj).then(res=>{
                                    if(res.success) {
                                      this.$message.success('操作成功')
                                      this.jumpPage()
                                    }
                                })
                                return
                            }
                            this.notAvailable()
                        }
                    })
                    return
                }


                API_STORAGEGOODSOUTRECORDSAVE(obj).then(res=>{
                    if(res.success) {
                      this.$message.success('操作成功')
                      this.jumpPage()
                    }
                  })

              },
              cancelText: '取消',
              onCancel() {}
            });
        }
      },

            changeBuyname(v){
                this.buyerName = _.find(this.buyerNameList,{uscc:v}).companyName
                this.VUEX_SET_MANUAL_ASSET_OBJ({
                    buyerName:this.buyerName,
                    buyerUscc:v
                })
            }
    }

    }
</script>
<style lang="less" scoped>
    ::v-deep .ant-form-item-label {
        text-align: left;
        label {
            color:#6B6F76;
        }
    }
  .top-box {
    overflow: hidden;
    border-radius: 8px;
    background: #fff;
    .s-card-title {
      margin-left: 20px;
      margin-top: 20px;
      font-family: PingFangSC-Medium;
      color: #141517;
      line-height: 24px;
      justify-content: space-between;
      padding-right: 20px;
      a {
        cursor: pointer;
      }
    }
    .s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
      color: #6B6F76;
    }
    .s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
      color: #383A3F;
    }
  }
  .bottom-box {
    .s-card-content .ant-row .ant-col:first-child {
      color: #6B6F76;
    }
    .s-card-content .ant-row .ant-col:last-child {
      color: #383A3F;
    }
  }
  .s-card-content{
    padding: 20px 16px 24px 16px;
    border-radius: 8px;
    background: #fff;
    margin: 14px 0 0 0;
    .row .ant-col {
            margin-top:8px;
      margin-bottom: 8px;
      text-overflow: ellipse;
      white-space: nowrap;
      overflow: hidden;
    }

    .ant-row .ant-col {
      margin-bottom: 8px;
            margin-top:8px;
    }
    h2 {
      font-style: normal;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #141517;
      line-height: 22px;
      margin-bottom: 16px;
    }
  }
  .divider {
      background: #f4f5f8;
      height: 1px;
      margin-top:20px;
      margin-left: -20px;
      margin-right: -20px;
    }
  .tabs-bar {
        display: flex;
        flex-direction: column;
        cursor: pointer;
    }
    .tabs-bar i {
        display: none;
    // display: inline-block;
        width: 10px;
        height: 10px;
        float: right;
    background: red;
        border-radius: 50%;
    margin-top: 8px;
    margin-right: 10px;
    }
    .tabs-bar > div > div {
        float: left;
    }
    .tabs-bar .tabs-icon {
        margin-right: 10px;
        em {
            display: block;
            width: 1px;
            height: 36px;
            background: @primary-color;
            border-radius: 1.5px 1.5px 0 0;
            margin: 5px 0 5px 6px;
        }
        img {
            width: 24px;
            height: 24px;
            margin-left:-5px;
        }
    }
    .tabs-bar .tabs-text {
        p {
            font-family: PingFangSC-Medium;
            color: #383A3F;
            line-height: 22px;
        }
    .blue {
      color: @primary-color;
    }
        span {
            font-family: PingFangSC-Regular;
            font-size: 10px;
            color: #9BA0AA;
        }
    }
  .red {color:#F24E4D!important;}
  .overflow {overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
  .contentBox{font-family: PingFangSC-Regular;}
  .green{background: #00AE9D!important;}
  .orange{background: #FF9726!important;}
  .red_bg{background: #F24E4D!important;}
  .btn-box{background: #ffffff!important;border-radius:8px;padding:20px 0;margin-top:20px;}
  .btn-box .btn-wrap{margin:0;}
</style>
