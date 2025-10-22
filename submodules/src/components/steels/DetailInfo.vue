<template>
	<div class="new-detail">
		<MySteelInfo
			v-if="isMySteel"
			:contract="materialInfo.contract"
			:marketPrice="materialInfo.marketPrice"
			:bondCalcInfo="materialInfo"
		></MySteelInfo>
		<OtherInfo
			v-else
			:contract="materialInfo.contract"
		></OtherInfo>
		<div class="new-detail-content detail-form">
			<h2>追保信息</h2>
			<a-row class="df">
				<a-form-item label="追保金额">
					<div class="fake-ipt">{{ materialInfo.amount }}</div>
				</a-form-item>
				<a-form-item label="收款账号">
					<div class="fake-ipt">{{ materialInfo.receiveAccountName }}</div>
				</a-form-item>

				<a-form-item label="开户行">
					<div class="fake-ipt">{{ materialInfo.receiveBankName }}</div>
				</a-form-item>

				<a-form-item label="签发日期">
					<div class="fake-ipt">{{ materialInfo.signDate }}</div>
				</a-form-item>

				<a-form-item label="追保截止日期">
					<div class="fake-ipt">{{ materialInfo.deadLineDate }}</div>
				</a-form-item>

				<a-form-item label="账号">
					<div class="fake-ipt">{{ materialInfo.receiveBankCardNo }}</div>
				</a-form-item>
			</a-row>
		</div>
		<div class="new-detail-content detail-form">
			<h2>追保函附件</h2>
			<a-row class="df">
				<div class="box">
					<div
						class="img-box"
						@click="openPdf"
					>
						<img
							class="cp"
							style="display: inline-block; width: 100%"
							src="@/assets/imgs/pdf.png"
						/>
					</div>
				</div>
			</a-row>
		</div>
		<a-row
			type="flex"
			justify="center"
			style="margin: 50px 0"
		>
			<a-col
				span="24"
				style="text-align: center"
			>
				<a-button
					class="btn"
					@click.native="$router.back()"
					style="margin-left: 50px"
					>返回</a-button
				>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import OtherInfo from './OtherInfo.vue';
import MySteelInfo from './MySteelInfo.vue';

export default {
	props: {
		materialInfo: {
			default: () => {
				return {
					contract: {},
					marketPrice: []
				};
			}
		}
	},
	data() {
		return {};
	},
	computed: {
		isMySteel() {
			return this.$route.query.marketPriceSource == 'MYSTEEL_COM';
		}
	},
	mounted() {},
	methods: {
		openPdf() {
			window.open(this.materialInfo.pdfPath, '_blank');
		}
	},
	components: {
		OtherInfo,
		MySteelInfo
	}
};
</script>

<style scoped lang="less">
.df {
	display: flex;
	flex-wrap: wrap;
}

.df {
	::v-deep .ant-form-item-label {
		width: 33%;
		text-align: left;
	}
	::v-deep .ant-form-item {
		width: 33%;
	}
}
.ipt {
	width: 364px;
	height: 40px;
	background: #f0f3fb;
	border-radius: 6px;
	color: #8495aa;
	border: 0;
}
.fake-ipt {
	width: 364px;
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
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.img-box {
	width: 100px;
	height: 200px;
}
.btn {
	width: 126px;
	height: 44px;
	background: #ffffff;
	border-radius: 6px;
	border: 1px solid #4682f3;
	color: #4682f3;
}
</style>
