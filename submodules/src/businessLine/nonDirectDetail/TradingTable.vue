<template>
  <div class="trading-info">
    <div class="content" v-if="list.length">
      <div class="table-box" v-for="(item, i) in list" :key="i">
        <div class="table-box-top">
          <div class="table-box-top-left">
            <p class="table-box-top-left-title"> 
              <span class="name ft600 c8">融资编号：</span>
              <a href="javascript:;" class="ft600" v-if="type == 'rest'" @click="goFinancingDetail(item, 'financing')">{{item.serialNo}}</a>
              <a href="javascript:;" class="ft600" v-else @click="goAdminFinancingDetail(item, 'financing')">{{item.serialNo}}</a>

              <span class="status-base" :class="item.status">{{item.statusDesc}}</span>
            </p>
            <p style="margin-top:20px">
              <span class="c4">金融机构：</span>
              <span class="c8">{{item.bankName}}</span>
            </p>
            <p style="margin-top:10px">
              <span class="c4">融资企业：</span>
              <span class="c8">{{item.financier}}</span>
            </p>
            <p style="margin-top:10px">
              <span class="c4">资产编号：</span>
              <span class="c8" v-if="type == 'rest'" >
                <span v-if="item.receivableSerialNo" @click="goFinancingDetail(item, 'property')" style="text-decoration: underline;cursor: pointer"> {{item.receivableSerialNo}}</span>
                <span v-else>-</span>
               
              </span>
              <template v-if="type == 'admin'">
                <span class="c8"  v-if="item.receivableSerialNo" @click="goAdminFinancingDetail(item, 'property')" style="text-decoration: underline;cursor: pointer">
                  {{item.receivableSerialNo}}
                </span>
                <span v-else>-</span>
              </template>
      


            </p>
            <p style="margin-top:10px" class="dfac" v-if="item.loanBankName || item.loanBankBranch || item.loanNo ">
              <span class="c4">收款账号：</span>
              <span class="c8" style="margin-right:10px">{{item.loanBankName}}</span>
              <a-tooltip :overlayStyle="{maxWidth: 'inherit !important'}">
                <template slot="title">
                  <p> <span>名称：</span><span>{{item.loanBankName}}</span></p>
                  <p> <span>开户行：</span><span>{{item.loanBankBranch}}</span></p>
                  <p > <span>账号：</span><span>{{formatAccountNumber(item.loanNo)}}</span></p>
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M3.55208 5.53125C3.11025 5.53125 2.75208 5.88942 2.75208 6.33125C2.75208 6.77308 3.11025 7.13125 3.55208 7.13125H5.95208C6.3939 7.13125 6.75208 6.77308 6.75208 6.33125C6.75208 5.88942 6.3939 5.53125 5.95208 5.53125H3.55208Z" fill="var(--primary-color)"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H14C15.1046 12 16 11.1046 16 10V2C16 0.895431 15.1046 0 14 0H2ZM14 1.6H2C1.77909 1.6 1.6 1.77909 1.6 2V2.92578H14.4V2C14.4 1.77909 14.2209 1.6 14 1.6ZM1.6 10V4.52578H14.4V10C14.4 10.2209 14.2209 10.4 14 10.4H2C1.77909 10.4 1.6 10.2209 1.6 10Z" fill="var(--primary-color)"/>
                </svg>
              </a-tooltip>
            </p>
          </div>
          <div class="table-box-top-right">
            <!-- 待还款 -->
            <template v-if="item.status == 'WAITING_LOAN'">
              <div>
                <p class="c4">待放款金额(元)</p>
                <p>{{formatMoney(item.waitFinAmount)}}</p>
              </div>
            </template>
            <!-- 已放款 -->
            <template v-if="item.status == 'LOANED'">
              <div >
                <p class="c4">放款金额(元)</p>
                <p>{{formatMoney(item.finAmount)}}</p>
              </div>
              <div style="margin-top:20px">
                <p class="c4">待还本金(元)</p>
                <p>{{formatMoney(item.unPayPrincipal)}}</p>
              </div>
            </template>
            <!-- 部分还款 -->
             <template v-if="item.status == 'PART_REPAY'">
              <div >
                <p class="c4">放款金额(元)</p>
                <p>{{formatMoney(item.finAmount)}}</p>
              </div>
     
              <div style="margin-top:20px">
                <p class="c4">已还本金(元)</p>
                <p>{{formatMoney(item.repayPrincipal)}}</p>
              </div>
              <div style="margin-top:20px">
                <p class="c4">待还本金(元)</p>
                <p>{{formatMoney(item.unPayPrincipal)}}</p>
              </div>
            </template>
            <!-- 结清状态 -->
            <template v-if="item.status == 'CLEARED'">
              <div >
                <p class="c4">放款金额(元)</p>
                <p>{{formatMoney(item.finAmount)}}</p>
              </div>

              <div style="margin-top:20px">
                <p class="c4">还款总额(元)</p>
                <p>{{formatMoney(item.totalRepayAmount)}}</p>
              </div>
  

            </template>
            
            


          </div>
        </div>
        <div class="table-box-bot">
          <div class="dfac">
            <div class="extra-item">
              <a-tooltip>
                <template slot="title">
                  资金类型
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7 14.0002C3.88506 14.0002 1 12.8056 1 9.04183C1 5.27802 4.16563 3.58752 4.16563 3.58752C4.16563 3.58752 3.03634 2.34569 3.76927 1.10832C4.44837 -0.0380978 6.21335 -0.00829688 6.86668 0.00273436C6.91847 0.00360884 6.96327 0.00436536 7 0.00440863C7.03797 0.00445337 7.08458 0.00372207 7.13862 0.00287422C7.79614 -0.0074425 9.55353 -0.0350161 10.2308 1.10832C10.9637 2.34569 9.86382 3.58752 9.86382 3.58752C9.86382 3.58752 13 5.278 13 9.04183C13 12.8056 10.115 14.0002 7 14.0002ZM4.57481 1.68363C4.27894 2.79726 5.3631 3.91716 5.3631 3.91716C5.3631 3.91716 1.99998 5.45486 2 8.84228C2 12.2297 4.21966 12.9307 6.99785 12.9307C9.77608 12.9307 12 12.2297 12 8.84228C12 5.45484 8.68543 3.91716 8.68543 3.91716C8.68543 3.91716 9.75596 2.70134 9.42434 1.68363C8.9557 0.779668 7.17316 1.03626 7 1.08226C6.80177 1.03626 4.91312 0.744855 4.57481 1.68363ZM8.30141 6.55766C8.49668 6.36239 8.49668 6.04581 8.30141 5.85055C8.10615 5.65529 7.78957 5.65529 7.59431 5.85055L6.99996 6.4449L6.40568 5.85062C6.21042 5.65536 5.89383 5.65536 5.69857 5.85062C5.50331 6.04589 5.50331 6.36247 5.69857 6.55773L6.14084 7H5.5C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H6.5V8.72266H5.5C5.22386 8.72266 5 8.94651 5 9.22266C5 9.4988 5.22386 9.72266 5.5 9.72266H6.5V10.5C6.5 10.7761 6.72386 11 7 11C7.27614 11 7.5 10.7761 7.5 10.5V9.72266H8.5C8.77614 9.72266 9 9.4988 9 9.22266C9 8.94651 8.77614 8.72266 8.5 8.72266H7.5V8H8.5C8.77614 8 9 7.77614 9 7.5C9 7.22386 8.77614 7 8.5 7H7.85907L8.30141 6.55766Z" fill="#C3C3C3"/>
                </svg>
              </a-tooltip>
              <span style="margin-left:5px">{{item.name}}</span>
            </div>
            <div class="extra-item">
              <a-tooltip>
                <template slot="title">
                  融资类型
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1H4.46154C5.01382 1 5.46154 1.44772 5.46154 2V4.46154C5.46154 5.01382 5.01382 5.46154 4.46154 5.46154H2C1.44772 5.46154 1 5.01382 1 4.46154V2C1 1.44772 1.44772 1 2 1ZM0 2C0 0.895432 0.89543 0 2 0H4.46154C5.56611 0 6.46154 0.89543 6.46154 2V4.46154C6.46154 5.56611 5.56611 6.46154 4.46154 6.46154H2C0.895432 6.46154 0 5.56611 0 4.46154V2ZM2 8.53846H4.46154C5.01382 8.53846 5.46154 8.98618 5.46154 9.53846V12C5.46154 12.5523 5.01382 13 4.46154 13H2C1.44772 13 1 12.5523 1 12V9.53846C1 8.98618 1.44772 8.53846 2 8.53846ZM0 9.53846C0 8.43389 0.89543 7.53846 2 7.53846H4.46154C5.56611 7.53846 6.46154 8.43389 6.46154 9.53846V12C6.46154 13.1046 5.56611 14 4.46154 14H2C0.895432 14 0 13.1046 0 12V9.53846ZM12 1H9.53846C8.98618 1 8.53846 1.44772 8.53846 2V4.46154C8.53846 5.01382 8.98618 5.46154 9.53846 5.46154H12C12.5523 5.46154 13 5.01382 13 4.46154V2C13 1.44772 12.5523 1 12 1ZM9.53846 0C8.43389 0 7.53846 0.895432 7.53846 2V4.46154C7.53846 5.56611 8.43389 6.46154 9.53846 6.46154H12C13.1046 6.46154 14 5.56611 14 4.46154V2C14 0.89543 13.1046 0 12 0H9.53846ZM9.53846 8.53846H12C12.5523 8.53846 13 8.98618 13 9.53846V12C13 12.5523 12.5523 13 12 13H9.53846C8.98618 13 8.53846 12.5523 8.53846 12V9.53846C8.53846 8.98618 8.98618 8.53846 9.53846 8.53846ZM7.53846 9.53846C7.53846 8.43389 8.43389 7.53846 9.53846 7.53846H12C13.1046 7.53846 14 8.43389 14 9.53846V12C14 13.1046 13.1046 14 12 14H9.53846C8.43389 14 7.53846 13.1046 7.53846 12V9.53846Z" fill="#C3C3C3"/>
                </svg>
              </a-tooltip>
              <span style="margin-left:5px">{{item.financingTypeDesc}}</span>
            </div>
            <div class="extra-item">
              <a-tooltip>
                <template slot="title">
                  融资利率
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="0.5" width="10" height="13" rx="1.5" stroke="#C3C3C3"/>
                  <rect x="3.5" y="2" width="7" height="2" fill="#C3C3C3"/>
                  <rect x="3.5" y="5" width="5" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="3.5" y="7" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="3.5" y="9" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="3.5" y="11" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="6.5" y="7" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="6.5" y="9" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="6.5" y="11" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="9.5" y="7" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                  <rect x="9.5" y="9" width="1" height="3" rx="0.5" fill="#C3C3C3"/>
                  <rect x="9.5" y="5" width="1" height="1" rx="0.5" fill="#C3C3C3"/>
                </svg>
              </a-tooltip>

              <span style="margin-left:5px">{{item.rate}}%</span>
            </div>
            <div class="extra-item" v-if="item.beginDate">
              <a-tooltip>
                <template slot="title">
                  融资期限
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.75 14H12.25C13.2165 14 14 13.2165 14 12.25V2.9166C14 1.95009 13.2165 1.16658 12.25 1.16658H10.5V0.583248C10.5 0.261115 10.2388 0 9.91667 0C9.59454 0 9.33338 0.261115 9.33333 0.583248V1.16658H4.66667V0.583248C4.66662 0.261115 4.40546 0 4.08333 0C3.7612 0 3.50005 0.261115 3.5 0.583248V1.16658H1.75C0.783502 1.16658 0 1.95009 0 2.9166V12.25C0 13.2165 0.783502 14 1.75 14ZM1.16667 12.25V5.27911H12.8333V12.25C12.8333 12.5722 12.5722 12.8333 12.25 12.8333H1.75C1.42783 12.8333 1.16667 12.5722 1.16667 12.25ZM1.16699 4.11121H12.8337V2.91537C12.8337 2.5932 12.5725 2.33203 12.2503 2.33203H10.5003V2.91537C10.5003 3.2375 10.2391 3.49862 9.91699 3.49862C9.59486 3.49862 9.33371 3.2375 9.33366 2.91537V2.33203H4.66699V2.91537C4.66694 3.2375 4.40579 3.49862 4.08366 3.49862C3.76153 3.49862 3.50037 3.2375 3.50033 2.91537V2.33203H1.75033C1.42816 2.33203 1.16699 2.5932 1.16699 2.91537V4.11121ZM5.84527 10.8899C5.95285 10.9906 6.09456 11.0469 6.24193 11.0474C6.39783 11.0468 6.54698 10.9837 6.6561 10.8724L9.74193 7.82738C9.9419 7.59736 9.93107 7.25216 9.71709 7.03512C9.50311 6.81808 9.1581 6.80236 8.92527 6.99904L6.2361 9.65322L5.06943 8.55072C4.83325 8.33572 4.46841 8.34942 4.24901 8.58153C4.02962 8.81364 4.03648 9.17868 4.26443 9.40239L5.84527 10.8899Z" fill="#C3C3C3"/>
                </svg>
              
              </a-tooltip>
              <span style="margin-left:5px">{{item.beginDate}}</span>

              
            </div>
            <div class="extra-item" v-if="item.endDate">
              <a-tooltip>
                <template slot="title">
                  融资期限
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#C3C3C3"/>
                  <path d="M7 2.5V7L9.5 9.5" stroke="#C3C3C3" stroke-linecap="round"/>
                </svg>
                
              </a-tooltip>
              <span style="margin-left:5px">{{item.endDate}}</span>
            
            </div>
          </div>
          <a-button class="btn" type='primary' @click="goRepayment(item)" v-if="item.applyReplyButtonShow && !isBank && type == 'rest' ">发起还款</a-button>
      



        </div>
      </div>
    </div>
    <div class="content content2" v-else>
      <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0 1)" fill="none" fillRule="evenodd">
          <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
          <g fillRule="nonzero" stroke="#D9D9D9">
            <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
            <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path>
          </g>
        </g>
      </svg>
      <p class="c4">暂无数据</p>
    </div>
  </div>
</template>

<script>

import { formatAccountNumber }  from '@sub/utils/factory.js'
import { formatMoney } from '@sub/filters'

// NONE("非融资")
// LIQUIDITY_LOANS("流贷融资")
// ACCOUNTS_RECEIVABLE_LOANS("应收账款融资")
// ACCOUNTS_RECEIVABLE_LIKE_LOANS("类应收账款融资")
// PRE_PAYMENT_LOANS("预付融资")
// PLEDGE_ACCOUNTS_RECEIVABLE("货押融资")
// BILL_LOANS("票据")
// POOL_FACTORING_LOANS("池保理融资")
// COUNTERFOIL_LOANS("云票融资")
export default {
  props: {
    tradingApi: {},
    API_goAdvanceLoanCheck: {},
    // 金融机构
    isBank: {
      default: false,
    },
    type: {
      default: 'admin'
    },
    list: {
      default: []
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    // this.getList()
  },
  computed: {


  },
  methods: {
    formatAccountNumber,
    formatMoney,
    async getList() {
      const params = {
        ...this.$route.query
      }
      
      const res = await this.tradingApi(params)
      this.list = res.data || []
    },
    // 去往融资详情 和资产详情
    goFinancingDetail(item, type) {
      
      // 融资详情、资产详情页
      let path1, path2
      // 应收账款融资 
      if( [ 'ACCOUNTS_RECEIVABLE_LOANS'].includes(item.financingType)) {

        path1 = `/center/financing/financingDetail?id=${item.id}`

       

        // 池保理融资
      } else if( ['POOL_FACTORING_LOANS'].includes(item.financingType)) {
        path1 = `/center/loan/loanDetail?id=${item.financingLoanId}`



         // 预付融资 票据
      }  else if ( ['PRE_PAYMENT_LOANS'].includes(item.financingType)) {

        path1 = `/center/financing/financingAdvanceDetail?id=${item.id}&type=detail`
       
        // 货押融资
      }


      if([ 'PRE_PAYMENT'].includes(item.assetType)) {
        // 预付
         path2 = `/center/assets/advance/detail?id=${item.receivableId}&activeIndex=0`
       

      } else if ([ 'ACCOUNTS_RECEIVABLE'].includes(item.assetType)) {
        // 应付账款
        if(this.isBank) {
           path2 = `/center/assets/receivable/JR/detail?id=${item.receivableId}&activeIndex=0`
        } else {
           path2 = `/center/assets/payable/manage/detail?id=${item.receivableId}&activeIndex=0`
       
        }
      
      } else if ([ 'ACCOUNTS_RECEIVABLE_MODIFY'].includes(item.assetType)) {
         // 应付账款变更
         path2 = `/center/assets/payable/change/detail?id=${item.receivableId}&activeIndex=2`
      
      }  else { 
        // 下游应收账款-手动录入
          path2 = `/center/assets/receivable/manual/detail?id=${item.receivableId}&activeIndex=0`

      }

      //  融资
       if(type == 'financing') {
        window.open(path1)
       } else {
        // 资产
        window.open(path2)
       }

       

    },
    // admin 去往融资详情 和资产详情
    goAdminFinancingDetail(item, type) {
       let path1, path2
      // 应收账款融资 
      if( ['ACCOUNTS_RECEIVABLE_LOANS'].includes(item.financingType)) {

        path1 = `/financing/financingDetail?id=${item.id}`

 


       
       
       
      // 池保理融资
      } else if( ['POOL_FACTORING_LOANS'].includes(item.financingType)) {
        path1 = `/financing/financingDetail?id=${item.id}`



         // 预付融资 票据
      } else if ( ['PRE_PAYMENT_LOANS'].includes(item.financingType)) {

        path1 = `/financing/loanAdvanceDetailMAIN?id=${item.id}&type=detail`

      

      }
       if([ 'PRE_PAYMENT'].includes(item.assetType)) {
        // 预付
         path2 = `/assets/AdvanceAuditRecord?id=${item.receivableId}&activeIndex=0`
       

      } else if ([ 'ACCOUNTS_RECEIVABLE'].includes(item.assetType)) {
        // 应付账款
        path2 = `/assets/AssetsAuditRecord?id=${item.receivableId}&activeIndex=0`
       
      } else if ([ 'ACCOUNTS_RECEIVABLE_MODIFY'].includes(item.assetType)) {
         // 应付账款变更
         path2 = `/assets/accountsPayableChangeDetail?id=${item.receivableId}&activeIndex=2`
      
      }  else { 
        // 下游应收账款-手动录入
          path2 = `/assets/AssetsAuditManualRecord?id=${item.receivableId}&activeIndex=0`

      }

      //  融资
       if(type == 'financing') {
        window.open(path1)
       } else {
        // 资产
        window.open(path2)
       }
    },
    // 发起还款
    async goRepayment(item) {
      let path
      // 应收账款融资 池保理融资
      if( ['POOL_FACTORING_LOANS', 'ACCOUNTS_RECEIVABLE_LOANS'].includes(item.financingType)) {
        let key
        let s = item.status != 'CLEARED' // 状态+未结清
        if (item.repayObject == 'BANK') {
          // 上海银行还款申请
          if (item.repayApplyFlag == 'REPAY_PAYOFF' && s) {
              key = 'loanApplySh'
          }
          // 南商银行还款申请
          if (item.repayApplyFlag == 'REPAY_PRINCIPAL' && s) {
              key = 'loanApplyNS'
          } else {
              // 善美还款申请
              key = 'loanApply'
          }
        }
        if (item.repayObject == 'SELLER') {
            key = 'loanApplySupplier'
        }
        if(!key) return
        //  window.open(`/center/loan/${key}?id=${item.financingLoanId}`)
         this.$router.push({
          path: `/center/loan/${key}?id=${item.financingLoanId}`
         })
        // 预付融资
      } else if ( ['PRE_PAYMENT_LOANS'].includes(item.financingType)) {
        await  this.API_goAdvanceLoanCheck({loanId:item.financingLoanId})
        this.$router.push({
          path: `/center/loan/loanAdvanceApply?id=${item.financingLoanId}`
         })
        // window.open()
        
      }
    }

  },
  components: {

  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style scoped  lang='less' >
p {
  margin-bottom: 0;
}
.content2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 100px;
}
.content{
  .table-box:last-child {
    border: 0 !important;
  }
}
.table-box {
  padding-bottom: 30px;
  margin-top: 30px;
  border-bottom: 1px solid #E5E6EB;

}
.table-box-top {
  display: flex;
  justify-content: space-between;
  padding-right: 25px;
  .status-base {
    display: inline-block;
    border-radius: 4px;
    background: #FF7937;
    padding: 1px 6px;
    color: #FFDAC8;
    font-family: PingFang SC;
    font-size: 12px;
    margin-left: 12px;
  }
  .WAITING_LOAN {
    background: #C9D9FF;
    color: #596FA0;
  }
  .LOANED {
    color: #3EB384;
    background: #C5ECDD;
  }
  .PART_REPAY {
    background: #D3DFFB;
    color: var(--VI-, #4682F3);
  }
  .CLEARED {
    background: #E0E0E0;
    color: rgba(0, 0, 0, 0.25);
  }
}
.table-box-bot {
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  padding-right: 25px;
  .extra-item {
    display: flex;
    align-items: center;
    padding:5.5px 12px;
    background: var(---BG, #F3F5F6);
    margin-right: 20px;
    border-radius: 4px;
  }
}
.ft600 {
  font-weight: 600;
}
.c4 {
  color: rgba(0, 0, 0, 0.40);
}
.c8 {
  color: rgba(0, 0, 0, 0.80);
}
.dfac {
  display: flex;
  align-items: center;
}
.btn {
  width: 80px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
}
</style>
