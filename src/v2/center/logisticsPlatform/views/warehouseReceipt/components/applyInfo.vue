<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			style="padding-top:10px"
			:colon="false"
		>
			<div class="slTitleAssis" style="margin-top:0">
				<span>仓储合同信息</span>
				<a-button
					style="margin-left: 20px"
					type="primary"
					ghost
					@click="link"
					>关联仓储合同信息</a-button
				>
			</div>
			<a-row style="margin-top: 20px">
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="仓储合同号">
							<a-input
								style="width: 364px"
								placeholder="请输入仓储合同号"
								disabled
								v-decorator="[
									'stationLeaseContractNo',
									{
										rules: [{ required: true, message: `请输入仓储合同号` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="仓储企业"
							required
						>
							<a-input
								style="width: 364px"
								placeholder="请输入仓储企业"
								:value="currentStorageCompanyInfo.storageCompanyName"
								disabled
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="存储期间">
							<a-range-picker
								style="width: 364px"
								class="storage-time"
								valueFormat="YYYY-MM-DD"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								v-decorator="[
									'storageTime',
									{
										rules: [{ required: true, message: `请选择存储期间` }]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-range-picker>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="仓储费">
							<a-input-number
								style="width: 364px"
								:precision="4"
								:min="0"
								:max="9999999999.9999"
								v-if="storageFeesType == 'NUMER'"
								placeholder="请输入仓储费收费金额，可最多保留4位小数"
								v-decorator="['storageFees', { rules: [{ required: true, message: '请输入仓储费' }] }]"
							></a-input-number>
							<a-input
								style="width: 364px"
								precision
								v-else
								:maxLength="200"
								placeholder="请输入仓储费收费要求，上限200字"
								v-decorator="['storageFees', { rules: [{ required: true, message: '请输入仓储费' }] }]"
							></a-input>
						</a-form-item>
						<a-radio-group
							v-model="storageFeesType"
							@change="changeLossStorageFees"
							class="tab-box"
						>
							<a-radio-button
								v-for="item in textAndNumberList"
								:key="item.value"
								:value="item.value"
								>{{ item.label }}
							</a-radio-button>
						</a-radio-group>
					</a-row>
				</a-col>
			</a-row>
			<div class="slTitleAssis" style="margin-top: 15px" >保险信息</div>
			<a-row style="margin-top: 20px">
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="险种">
							<div class="insurance">
								<a-select
									placeholder="请选择险种"
									v-model="insuranceInfo.insuranceType"
								>
									<a-select-option value="ASSETS_BASE_INSURE">财产基本险</a-select-option>
									<a-select-option value="ASSETS_COMPOSITE_INSURE">财产综合险</a-select-option>
									<a-select-option value="ASSETS_ALL_INSURE">财产一切险</a-select-option>
									<a-select-option value="OTHER">其他</a-select-option>
								</a-select>
								<a-input
									v-if="insuranceInfo.insuranceType == 'OTHER'"
									placeholder="请输入"
									style="margin-left: 10px"
									v-model="insuranceInfo.insuranceTypeHandInput"
									:maxLength="20"
								/>
							</div>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="保险单号">
							<a-input
								style="width: 364px"
								placeholder="请输入保险单号"
								v-model="insuranceInfo.policyNo"
								:maxLength="50"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="保险人">
							<a-input
								style="width: 364px"
								:maxLength="50"
								v-model="insuranceInfo.policyHolder"
								placeholder="请输入保险人"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="被保险人">
							<a-input
								style="width: 364px"
								:maxLength="50"
								v-model="insuranceInfo.insurant"
								placeholder="请输入被保险人"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="保险期限">
							<a-range-picker
								style="width: 364px"
								:allowClear="false"
								format="YYYY-MM-DD"
								class="storage-time"
								:placeholder="['开始时间', '结束时间']"
								v-model="insuranceInfo.insurancePeriod"
								valueFormat="YYYY-MM-DD"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-range-picker>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="保险金额(元)">
							<a-input-number
								style="width: 364px"
								placeholder="请输入保险金额"
								:min="0.01"
								:precision="2"
								:max="9999999999.99"
								v-model="insuranceInfo.insuranceAmount"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>

		<LinkStorageContractDraw
			ref="linkContractDraw"
			:listApi="listApi"
			@select="selectStorageContract"
		></LinkStorageContractDraw>
		<TipModal
			ref="tip"
			@ok="goApply"
			@cancel="close"
			title="操作提示"
			cancelBtnText="稍后签署"
			okBtnText="现在去签署"
		>
			<div class="tip-box">
				<p>请完成与{{currentStorageCompanyInfo.storageCompanyName}}的电子仓单管理协议签署后，再进行此操作，是否现在签署</p>
			</div>
		</TipModal>
	</div>
</template>

<script>
import LinkStorageContractDraw from './LinkStorageContractDraw.vue';
import {getStationDetail} from "../../../api";
import TipModal from '@sub/components/DelModal.vue';
export default {
	props: {
		listApi: {},
	},
	data() {
		return {
       form: this.$form.createForm(this),
       storageFeesType: 'TEXT',
       textAndNumberList: [
        {value: 'TEXT', label: "文本"},
        {value: "NUMER", label: "数值"},
       ],
			//  选择的仓储合同
			 selectStorageContractInfo: {},
			//  当前站台信息
			 currentStorageCompanyInfo: {},
			//  保险信息
			 insuranceInfo: {
				insurancePeriod: [],
				insuranceTypeHandInput: undefined,
				insuranceType: undefined,
				policyNo: undefined,
				policyHolder: undefined,
				insurant: undefined,
				insurancePeriodStart: undefined,
				insurancePeriodEnd: undefined,
				insuranceAmount: undefined,
			 }
    };
	},
	mounted() {
		this.getStationDetail()
	},
	methods: {
		// 初始化数据
		init(info = {}) {

			this.selectStorageContractInfo = info
			this.selectStorageContractInfo.id = info.warehouseContractId
			this.$nextTick(() => {
				this.storageFeesType = info.storageFeesType
				this.insuranceInfo = info.insuranceInfo || {}
				if(info.insuranceInfo && info.insuranceInfo.insurancePeriodStart) {
					this.insuranceInfo.insurancePeriod = [info.insuranceInfo.insurancePeriodStart, info.insuranceInfo.insurancePeriodEnd]
				}
				

				this.form.setFieldsValue({
					stationLeaseContractNo: info.warehouseContractNo,
					storageTime: [info.storageTimeStart, info.storageTimeEnd],
					storageFees: info.storageFees,

				})
			})
		},
		async link() {
			
			const res =	await this.listApi({pageSize: 10, pageNo: 1, })
			const list = res.data.records || []


			if(list.length) {
					this.$refs.linkContractDraw.show();
			} else {
				this.$refs.tip.open()
			}
		
		},
		changeLossStorageFees() {
			this.form.setFieldsValue({
        storageFees: this.storageFeesType == 'TEXT' ? undefined : 0
      })
		},
		selectStorageContract(info) {
			this.selectStorageContractInfo = info
			this.form.setFieldsValue({
        stationLeaseContractNo: info.bizContractNo,
        storageTime: [info.effectiveStartDate, info.effectiveEndDate],
      })
			this.$emit('select', info)
		},
		 // 获取当前站台信息
    async getStationDetail() {
      const res = await getStationDetail()
      this.currentStorageCompanyInfo = res.data
    },
		close() {
			this.$refs.tip.close()
		},
		goApply() {
			this.close()
			window.open('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list')
		},
    save() {
     return new Promise((resolve, reject) => {
        this.form.validateFields((err, value) => {
          if(!err) {
						const info = {
							warehouseContractId: this.selectStorageContractInfo.id,
							storageFees: value.storageFees,
							storageFeesType: this.storageFeesType,
							storageTimeStart: value.storageTime[0],
							storageTimeEnd: value.storageTime[1],
							insuranceInfo: {...this.insuranceInfo},
						}

						if(this.insuranceInfo.insurancePeriod && this.insuranceInfo.insurancePeriod.length) {
							info.insuranceInfo.insurancePeriodStart = this.insuranceInfo.insurancePeriod[0]
							info.insuranceInfo.insurancePeriodEnd = this.insuranceInfo.insurancePeriod[1]
						}

						delete info.insuranceInfo.insurancePeriod

						if(info.insuranceInfo.insuranceType !== 'OTHER') {
							info.insuranceInfo.insuranceTypeHandInput = null
						}

						for(let key in info.insuranceInfo) {
							if(!info.insuranceInfo[key]) {
								delete info.insuranceInfo[key]
							}
						}
						if(JSON.stringify(info.insuranceInfo) == '{}') {
							info.insuranceInfo = null
						}


            resolve(info)
          } else {
            resolve(false)
          }
        })
      })
     }
	},
	components: {
		LinkStorageContractDraw,
		TipModal
	}
};
</script>

<style scoped lang="less">
.tab-box {
	position: absolute;
	left: 264px;
	top: 0;
	/deep/ .ant-radio-button-wrapper {
		height: 24px;
		line-height: 24px;
		width: 50px;
		font-size: 12px;
		padding: 0;
		text-align: center;
	}
}
.storage-time {
	/deep/ .ant-calendar-range-picker-input {
		padding-left: 30px;
	}
}
.insurance {
	width: 364px;
	display: flex;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
