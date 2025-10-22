<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				{{ meta.title }}
			</span>
			<div class="sub">
				<div class="slTitleAssis">合同信息</div>
				<ContractOffline :contractInfo="contractInfo || {}" />
			</div>
			<div class="sub">
				<div class="slTitleAssis">结算单信息</div>
				<SettleOffline
					ref="settleOffline"
					:contractInfo="contractInfo || {}"
					@selectChange="selectChange"
				/>
			</div>
			<div class="sub">
				<div class="slTitleAssis">附件信息</div>
				<fileTable
					ref="file"
					fileType="settleDefault"
					:documentType="documentType"
					:fileData="attachmentList"
				/>
			</div>
			<div class="submit-btn">
				<a-button
					type="primary"
					ghost
					@click="judgeBack"
				>
					取消
				</a-button>
				<a-button
					type="primary"
					@click="submit"
					:loading="submitLoading"
				>
					提交
				</a-button>
			</div>
		</a-card>
		<modalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要提交后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="back"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="submit"
				>
					提交后返回
				</a-button>
			</div>
		</modalInfo>
		<modalMain
			ref="modalMain"
			title="提交"
			:width="408"
			@verify="modalMainOK"
			:loading="modalLoading"
		>
			<div class="main">
				<div class="title">请确认以下信息是否有误:</div>
				<div class="mainTable">
					<div class="item">
						<span class="label">结算金额:</span>
						<span class="red">{{ params.settleAmount | formatMoney }}元</span>
					</div>
					<div class="item">
						<span class="label">结算数量:</span>
						<span>{{ params.settleQuantity | formatMoney(4) }}吨</span>
					</div>
					<div class="item">
						<span class="label">供货周期:</span>
						<span>{{ params.supplyDateStart }}~{{ params.supplyDateEnd }}</span>
					</div>
					<div class="item">
						<span class="label">结算日期:</span>
						<span>{{ params.statementTime }}</span>
					</div>
				</div>
			</div>
		</modalMain>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import modalInfo from '@/v2/components/modalInfo/info';
import modalMain from '@/v2/components/modalInfo/main';
import fileTable from '@/v2/components/fileTable/FileTableNew';
import { API_JumpFromMonotoring, API_OffinleSettleSave, API_OffinleStatementDetail } from '@/v2/center/trade/api/settle';
import ContractOffline from './components/ContractOffline';
import SettleOffline from './components/SettleOffline';
export default {
	components: {
		breadcrumb,
		modalInfo,
		ContractOffline,
		SettleOffline,
		modalMain,
		fileTable
	},
	data() {
		let { meta, query } = this.$route;

		return {
			contractNo: query?.contractNo,
			id: query?.id,
			type: query?.type,
			meta, //获取title
			change: false, //内容有无修改
			contractInfo: {}, //合同信息
			submitLoading: false,
			modalLoading: false, //弹框loading状态
			params: {}, //提交参数
			documentType: [{ type: 'JSD', required: true, typeName: '线下贸易结算单' }] //附件种类
		};
	},
	watch: {},
	computed: {
		attachmentList() {
			return this.contractInfo.attachmentList || [];
		},
	},
	async created() {
		this.getDetail();
	},
	async mounted() {},
	methods: {
		//表单值发生了变化
		selectChange() {
			this.change = true;
		},
		//获取详情
		async getDetail() {
			let res;

			//如果修改详情
			if (this.id) {
				res = await API_OffinleStatementDetail({ statementId: this.id });
				if (res.success) {
					this.contractInfo = res.data;
					if (this.$refs.settleOffline) {
						this.$refs.settleOffline.initFormData(this.contractInfo );
					}
				}
				
			} else if (this.contractNo) {
				//被选中的合同模板详情
				res = await API_JumpFromMonotoring({ contractNo: this.contractNo });
				if (res.success) {
					this.contractInfo = res.data;
				}
			}
		},
		//返回
		back() {
			this.goReceivable();
		},
		//判断返回
		judgeBack() {
			//如果dangdang发生数据变化，提示是否保存
			if (this.change) {
				this.$refs.modalInfoChange.open();
			} else {
				this.back();
			}
		},
		//确认提交
		async modalMainOK() {
			this.modalLoading = true;
			API_OffinleSettleSave(this.params)
				.then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.back();
					}
				})
				.finally(() => {
					this.modalLoading = false;
					this.$refs.modalMain.close();
				});
		},
		//提交
		async submit() {
			//关闭提交返回弹框
			this.$refs.modalInfoChange.close();
			this.submitLoading = true;
			let params = await this.rulesParams();
			this.submitLoading = false;
			if (params) {
				this.params = { ...params, terminalContractId: this.contractInfo.id || this.contractInfo.terminalContractId, statementId: this.$route.query.id };
				this.$refs.modalMain.open();
			}
		},
		//rules校验数据
		async rulesParams() {
			let paramsList = [];
			if (this.$refs.settleOffline) {
				paramsList.push(this.$refs.settleOffline.validateFields());
			}
			paramsList.push(this.$refs.file.validateFields());
			let attachmentList = this.$refs.file.fileList;
			return new Promise(resolve => {
				Promise.all(paramsList).then(res => {
					if (!res.includes(false)) {
						let params = {
							attachmentList
						};
						res.map(item => {
							params = { ...params, ...item };
						});
						resolve(params);
					} else {
						resolve(false);
					}
				});
			});
		},
		// 判断是否从新增应收账款菜单进入的
		goReceivable() {
			this.$router.back();
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		text-align: center;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
	.sub {
		margin-bottom: 30px;
		.slTitleAssis {
			margin: 0 0 20px;
		}
		.title-tip {
			font-weight: 400;
			font-size: 14px;
			line-height: 14px;
			color: #77889d;
		}
		.subInfo {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
			letter-spacing: 0px;
			text-align: left;
			color: rgba(0, 0, 0, 0.8);
			span {
				color: rgba(0, 0, 0, 0.4);
			}
		}
		.slFormDetail {
			padding: 0;
		}
	}
}
.main {
	.title {
		color: rgba(0, 0, 0, 0.4);
		font-family: PingFang SC;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
	.mainTable {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 10px;
		.item {
			padding: 0 13px;
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			&:nth-child(2n) {
				background: #f3f5f6;
			}
			.label {
				color: rgba(0, 0, 0, 0.4);
				display: inline-block;
				margin-right: 5px;
			}
			.red {
				color: #d44;
			}
		}
	}
}
</style>
