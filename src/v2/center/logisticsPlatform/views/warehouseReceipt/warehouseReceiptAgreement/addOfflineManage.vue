<template>
	<div class="slMain" >
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="border-radius: 5px;padding-bottom:70px"
		>
			<div class="methods-wrap">
				<span class="slTitle">新增线下仓单管理协议</span>
			</div>
			<div class="slTitleAssis">协议信息</div>
			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="仓储企业" required>
									<a-input
										style="width:364px"
										disabled
										placeholder="请输入仓储企业"
										:value='currentStorageCompanyInfo.storageCompanyName'

									/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="仓单管理协议编号">
								<a-input
									style="width: 364px"
									:maxLength="50"
									placeholder="请输入仓单管理协议编号"
									v-decorator="[
										'serialNo',
										{
											rules: [{ required: true, message: `请输入仓单管理协议编号` }],
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
							justify="end"
						>
							<a-form-item label="签订日期">
								<a-date-picker
									style="width: 364px"
									placeholder="请选择签订日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										'signDate',
										{
											rules: [{ required: true, message: `签订日期必填` }]
										}
									]"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="签章状态" required>
								<a-input style="width:364px"
										disabled
										placeholder="请输入签章状态" value='双签'></a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<div
					class="slTitleAssis"
					style="margin-top: 10px"
				>
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
                    style="width:364px"
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
							<a-form-item label="存储期间">
							    <a-input
                    style="width:364px"
                    placeholder="请输入存储期间"
										disabled
                    v-decorator="[
                      'effectiveDate',
                      {
                        rules: [{ required: true, message: `请输入存储期间` }],
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
							justify="end"
						>
							<a-form-item label="仓储地址">
								  <a-input
                      style="width:364px"
                      placeholder="请输入仓储地址"
											:maxLength="50"
                      v-decorator="[
                        'storageCompanyAddress',
                        {
                          rules: [{ required: true, message: `请输入仓储地址` }],
                          validateTrigger: ['blur']
                        }
                      ]"
                    />
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<!-- 审批流 -->
			</a-form>

			<div
				class="slTitleAssis"
				style="margin-top: 0px"
			>
				附件
			</div>
			<Attachment
				style="margin-top: 20px"
				ref="attachment"
				:list="attachmentList"
			>
			</Attachment>


		</a-card>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="goBack"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					>提交</a-button
				>
			</a-space>
		</div>
		<LinkStorageContractDraw ref="linkContractDraw"  @select='selectStorageContract' :listApi="getWarehouseReceiptLeaseContractList"></LinkStorageContractDraw>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="确定"
		>
			<div class="tip-box">
				<p>系统将提交，请确保信息无误</p>
			</div>
		</TipModal>
		<ModalInfo
			ref="modalInfoChange"
			title="提示确认提交"
			tip="内容已被修改，是否要保存后再返回？"
		>
			<div slot="footer">
				<a-button @click="$refs.modalInfoChange.close()"> 取消 </a-button>
				<a-button @click="forceBack"> 直接返回 </a-button>
				<a-button
					type="primary"
					@click="submit"
				>
					提交后返回
				</a-button>
			</div>
		</ModalInfo>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import TipModal from '@sub/components/DelModal.vue';
import LinkStorageContractDraw from '../components/LinkStorageContractDraw.vue';
import { mapGetters } from 'vuex';
import Attachment from '../components/Attachment.vue';
import { deepCompare } from '@/v2/utils/factory';
import {getStationDetail} from "../../../api";
import comDownload from '@sub/utils/comDownload';
import ModalInfo from '@/v2/components/modalInfo/info';
import { 
 saveOrSubmitWarehouseReceiptAgreementManage,
 getWarehouseReceiptAgreementManageDetail,
 downloadPreviewWarehouseReceiptAgreementManage,
 getWarehouseReceiptLeaseContractList,
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt'

export default {
	data() {
		return {
			form: this.$form.createForm(this),
			detailInfo: {},
			// 现有参数
			currentParams: {},
			// 附件
			attachmentList: [
				{
					key: 'YSPZ',
					label: '电子仓单管理协议',
					accept: '.jpg,.png,.pdf,.jpeg,.JPEG,.PNG,.JPG,.PDF, .bmp',
					tip: '【电子仓单管理协议】必须上传，只能上传一份PDF文件，或者图片(可多张)，单个附件大小不得超过100M；请上传已双签的合同，且确保协议文件与录入信息一致，避免出现与本协议无关的信息',
					required: true
				}
			],
			// 站台详情
			currentStorageCompanyInfo: {},
			// 选择的仓储合同
			selectStorageContractInfo: {},
			cacheInfo: {},
			isNeedNext: true,
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
	},
	beforeRouteLeave(to, form, next) {
   
    if(this.isNeedNext) {
      this.oldAndNew(next)
    } else {
      next()
    }
   
	},
	created() {
		this.getStationDetail()
	},
	methods: {
		getWarehouseReceiptLeaseContractList,
		async getDetail() {
      const params = {
        id: this.$route.query.id,
      }
      const res = await getWarehouseReceiptAgreementManageDetail(params)
      this.detailInfo = res.data
      const cacheInfo = {
        storageCompanyAddress: this.detailInfo.storageCompanyAddress,
        stationLeaseContractNo: this.detailInfo.stationLeaseContractNo,
        effectiveDate: `${this.detailInfo.effectiveDate} - ${this.detailInfo.effectiveEndDate}`,
				serialNo: this.detailInfo.serialNo,
				signDate: this.detailInfo.signDate,
      }
      this.oldInfo = cacheInfo
      this.$nextTick(() => {
        this.form.setFieldsValue(cacheInfo)
      })
    },
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		fullScreenView() {
			this.$refs.previewModal.show();
		},
		forceBack() {
      this.isNeedNext = false
      this.goBack()
    },
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list');
		},
		    // 选择的仓储合同信息
   	 selectStorageContract(info) {
      this.selectStorageContractInfo = info;
      this.form.setFieldsValue({
        stationLeaseContractNo: info.bizContractNo,
        effectiveDate: info.effectiveDate,
        storageCompanyAddress: this.currentStorageCompanyInfo.address,
      })
    },
		// 获取当前站台信息
    async getStationDetail() {
      const res = await getStationDetail()
      this.currentStorageCompanyInfo = res.data
    },
		link() {
			this.$refs.linkContractDraw.show();
		},
		closeModal() {
			this.$refs.submitModal.close()
		},
		submit() {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					const params = {
            operatorType: 'SUBMIT',
            type: 'OFFLINE',
            stationLeaseContractId: this.selectStorageContractInfo.id || this.detailInfo.stationLeaseContractId,
            ...values,
            bid: this.$route.query.id,
          }
					const list = this.$refs.attachment.save();
					if (!list) {
						return;
					}
					params.attachmentList = list.map(el => {
						return {
							...el,
							attachmentType: 'OFFLINE_FILE',
							createdDate: el.uploadTime,
							path: el.path,

						}
					})
					this.currentParams = params
					this.$refs.submitModal.open();

				}
			});
		},
		async confirmSubmit() {
			this.$refs.submitModal.close();
			await saveOrSubmitWarehouseReceiptAgreementManage(this.currentParams)
			this.$message.success('提交成功')
			this.isNeedNext = false
			this.goBack()
		},
		async oldAndNew(next) {
			//如果有原始数据并且原始数据与现有数据不一致，则发生了修改
      /** 判断当前必填项都已经完成 */
      this.form.validateFields(async (err, values) => {


        if(!err) {
					const list = this.$refs.attachment.dataSource || [{fileList: []}]; 
					const item = list[0]
					if (!item.fileList.length) {
						next()
						return;
					}
					this.openModal()
          
        } else {
          next()
        }
         
      })
		},
    openModal() {
			this.$refs.modalInfoChange.open()
    },
	},
	components: {
		Breadcrumb,
		LinkStorageContractDraw,
		TipModal,
		Attachment,
		ModalInfo
	}
};
</script>

<style scoped lang="less">
.preview-wrap {
	height: 168px;
	width: 100%;
	border: 1px solid #eaebed;
	overflow: hidden;
	border-top: 0;
}
::v-deep.ant-tabs {
	margin-bottom: 30px;
	.ant-tabs-extra-content {
		cursor: pointer;
		.fullScreenIcon {
			display: inline-block;
			width: 14px;
			height: 14px;
			margin-right: 3px;
			margin-top: -2px;
		}
	}
}
::v-deep.ant-tabs-tabpane {
	height: 168px;
}
.line {
	width: 100%;
	height: 20px;
	background: #f3f5f6;
}
.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	z-index: 9;

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
