<template>
	<div class="">
			<div class="slTitleAssis">合同信息</div>
			<ul class="grid-wrap">
				<li>
					<span class="label">运输合同编号</span>
					<span
						class="contract-number"
						style="cursor: pointer;"
						
						>
            <i @click="contractDetail" > {{ contractData.paperContractNo }}</i>
           
                <img
                class="copy-contract-icon"
                src="@/v2/assets/imgs/common/copy_icon.png"
                alt=""
                style="width:14px;margin-left:5px;cursor: pointer;"
                v-clipboard:copy="contractData.paperContractNo"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            
            </span
					>
   
      
				</li>
				<li>
					<span class="label">托运人</span>
					<span>{{ contractData.consignorCompanyName }}</span>
				</li>
				<li>
					<span class="label">承运人</span>
					<span>{{ contractData.consigneeCompanyName }}</span>
				</li>
        <li>
					<span class="label">签订日期</span>
					<span>{{contractData.contractSignTime}}</span>
				</li>
        <li>
					<span class="label">合同有效期</span>
					<span>{{ contractData.execDateStart }} - {{ contractData.execDateEnd }}</span>
				</li>
        <li>
					<span class="label">合同类型</span>
					<span>{{contractData.contractTermTypeDesc}}</span>
				</li>
        <li style="width:99.99%">
					<span class="label">业务负责人</span>
					<span>{{businessDirector}}</span>
				</li>


			</ul>
	</div>
</template>
<script lang="jsx">

import { mapGetters } from 'vuex';
export default {
  props: {
    contractData: {
      default: () => {return {}}
    }
  },
  computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),

		businessDirector() {
			if(this.contractData.contractExtendInfo) {
				if(this.contractData.contractExtendInfo.businessDirectorUnitName) {
					return  this.contractData.contractExtendInfo?.businessDirectorUnitName + '-' +this.contractData.contractExtendInfo?.businessDirectorName +'-' + this.contractData.contractExtendInfo?.businessDirectorMobile
				}
			}
			return '-'
		}
	},
	data() {

		return {
			
			defaultParams: {
				productCode: 'LOGIC_DELIVER',
			},
		};
	},
	components: {

	},
	created() {},
	mounted() {
	},
	methods: {
    contractDetail() {
			let routeUrl = this.$router.resolve({
				path: `/center/logisticSupervise/contract/transport/detail`,
				query: {
					id: this.contractData.id
				}
			});
			window.open(routeUrl.href, '_blank');
		},
    		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},

	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/grid-wrap.less');
</style>
<style lang="less" scoped>
.slTitle {
	height: 45px;
	border-bottom: 1px solid #e5e6eb;
	box-sizing: border-box;
}
.ant-card-bordered {
	border: none;
}

.contract-detail {
	padding: 0 20px;
	.ant-col {
		margin-bottom: 15px;
	}
}
.ant-calendar-picker {
	width: 100%;
}
.order-wrap {
	::v-deep.ant-calendar-picker {
		width: auto;
	}
}
.custom-main-content-inner {
	margin-top: -20px;
}
.col-padding-left {
	padding-left: 80px;
}
.settle-form {
	margin-top: 20px;
}
.settle-form-item {
	width: 364px;
}
/deep/ .ant-form-item-label {
	label {
		color: rgba(0, 0, 0, 0.4);
	}
}
.contract-number {
	max-width: 500px;
	width: auto;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: @primary-color;
}
.file-tips {
	width: 100%;
	height: 12px;
	color: #77889d;
	font-size: 12px;
	line-height: 12px;
	margin: 22px 0 20px;
}
.method-btn {
	width: 114px;
}
.method-btn-blue {
	color: @primary-color;
	border-color: @primary-color;
}
</style>
