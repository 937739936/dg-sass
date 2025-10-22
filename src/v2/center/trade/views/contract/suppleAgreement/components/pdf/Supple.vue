<template>
	<div
		class="supple thymeleaf-wrap"
		id="thymeleafWrap"
	>
		<!-- <p class="line"></p> -->
		<p style="text-align: center; font-size: 18px"><strong>补充协议</strong></p>
		<p
			class="signDate"
			style="text-align: right"
		>
			签订时间：<span th:text="${signDate}">{{ signDate }}</span>
		</p>
		<p style="text-align: right">
			签订地点：<span th:text="${signLoc}">{{ contractData.contract.contractSignPlace }}</span>
		</p>
		<p>
			甲方（买方）：<span th:text="${buyerName}">{{ contractData.contract.buyerCompanyName }}</span>
		</p>
		<p>
			乙方（卖方）：<span th:text="${sellerName}">{{ contractData.contract.sellerCompanyName }}</span>
		</p>
		<p class="indent">
			鉴于甲乙双方于<span th:text="${year}">{{ moment(contractData.contract.signTime).format('LL') }}</span
			>签订了编号为<span th:text="${contractNo}">{{ contractData.contract.contractNo }}</span> 的《<span
				th:text="${contractName}"
				>{{ completedSuppleAgreement.contractName }}</span
			>》
			<template v-for="(item, index) in completedSuppleAgreement.agreementList">
				<template if="index === 0">、</template>
				{{ moment(item.signDate).format('LL') }}签订了编号为{{ item.supplementAgreementNo }}的《{{ item.name }}》
			</template>
			（以下简称&ldquo;原合同&rdquo;）<span th:text="${supplementalAgreementList}"></span
			>，现经过甲乙双协商沟通一致，对原合同进行补充约定，以资各方共同遵守。
		</p>
		<p class="indent changData">一、对原合同煤种、数量、发站、托运人等补充约定</p>

		<div
			v-for="(item, index) in changeData"
			:key="index"
			class="indent"
		>
			<span style="margin-right: 2px">1.{{ index + 1 }} </span>
			<span>
				{{ item.des }}
			</span>
		</div>

		<p
			class="indent"
			v-if="!changeData.length"
			th:if="${details==null||details==''}"
		>
			无
		</p>
		<p></p>
		<p class="indent signContent">二、对其他事项的补充约定 <span></span></p>

		<p
			class="indent"
			th:utext="${signContent}"
			v-html="signContent"
			v-if="signContent"
		></p>
		<p
			class="indent"
			v-else
			th:utext="${signContent}"
		>
			无
		</p>

		<p class="indent otherContent">
			三、本补充协议是原合同以及相关补充协议（如有）的有效补充，与原合同以及相关补充协议（如有）合并执行。原合同对应条款内容与本协议不一致的，以本协议约定为准。本补充协议未涉及的内容，仍按照原合同及相关补充协议（如有）相关约定执行。
		</p>
		<p class="indent">四、有关本协议发生的争议，甲乙双方协商解决，协商不一致的，在本协议签订地有管辖权的人民法院提起诉讼解决。</p>
		<p class="indent">五、生效约定</p>
		<p class="indent">
			5.1
			本协议如果通过线下书面方式签订，自甲乙双方加盖合同章或公章后生效，线下书面协议一式四份，甲乙双方各执两份。本协议传真件、扫描件与原件具有同等法律效力。
		</p>
		<p class="indent">
			5.2
			本协议如果通过第三方互联网平台【https://www.shdatalink.com】采用电子签名方式签订的互联网线上电子合同，自双方在线加盖电子印章后合同立即生效，对双方具有法律约束力。经双方加盖电子印章后，电子合同的扫描件、复印件与原件具有同等法律效力。
		</p>

		<p>（以下无正文）</p>
		<p style="padding-right: 5px">
			甲方（签章）：<span th:text="${buyerName}"> {{ contractData.contract.buyerCompanyName }} </span
			><span style="float: right"
				>乙方（签章）：<span th:text="${sellerName}">{{ contractData.contract.sellerCompanyName }}</span></span
			>
		</p>
	</div>
</template>

<script>
import moment from 'moment';

import { getCompleted } from '@/v2/center/trade/api/suppleAgreement';

export default {
	props: {
		contractData: {
			default: () => {
				return { contract: {} };
			}
		}
	},
	data() {
		return {
			moment,
			completedSuppleAgreement: {}
		};
	},
	computed: {
		signDate() {
			return this.$store.state.supple.signDate;
		},
		changeData() {
			return this.$store.state.supple.changeData;
		},
		signContent() {
			return this.$store.state.supple.signContent;
		}
	},
	watch: {
		signDate(info) {
			this.goScroll('signDate', 120);
		},
		signContent() {
			this.goScroll('otherContent', 200);
		},
		changeData() {
			this.goScroll('signContent', 200);
		}
	},
	mounted() {
		this.getCompletedSuppleAgreementList();
	},
	methods: {
		// 获取合同名称
		async getCompletedSuppleAgreementList() {
			const res = await getCompleted({ contractNo: this.$route.query.contractNo });
			this.completedSuppleAgreement = res.data || {};
		},
		/** 滚动到位置 */
		goScroll(key, num) {
			const child = document.querySelector(`.${key}`);

			const supple = document.querySelector('.supple');
			supple.scrollTo({
				top: child.offsetTop - num, //
				behavior: 'smooth'
			});
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
html,
body {
	padding: 0px;
	margin: 0px;
	font-size: 14px;
	font-family: 'STXihei';
}
table {
	margin-right: auto;
	margin-left: auto;
	width: 100%;
	font-size: 14px;
	border-collapse: collapse;
	-fs-table-paginate: paginate;
	border-spacing: 0;
	color: red;
}

table.rich-table {
	border: 1px solid #000000;
}

td {
	padding: 0;
	border: 1px solid #000000;
	line-height: 15px;
	font-size: 13px;
}
td br {
	display: none;
}
td p {
	padding: 0;
	margin: 0;
	text-align: center;
}
p {
	margin: 8px 0px;
	line-height: 24px;
	font-size: 14px;
	font-family:
		tahoma,
		arial,
		Hiragino Sans GB,
		Hiragino Sans GB W3,
		Microsoft Yahei;
}
.indent {
	text-indent: 2em;
}
.supple {
	height: 168px;
	overflow: auto;
	padding: 0 100px;
	color: rgba(0, 0, 0, 0.8);
	font-size: 14px;
	font-family:
		tahoma,
		arial,
		Hiragino Sans GB,
		Hiragino Sans GB W3,
		Microsoft Yahei;
}
.line {
	width: 100%;
	height: 2px;
	background: #000;
	margin: 0 auto;
	margin-top: 20px;
	margin-bottom: 20px;
}
#thymeleafWrap {
	span {
		background: #fff !important;
	}
}
.indent {
	/deep/ span {
		background: #fff !important;
	}
}
</style>
