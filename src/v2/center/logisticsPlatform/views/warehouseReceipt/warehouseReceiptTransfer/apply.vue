<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false" style="padding-bottom:70px">
			<div
				class="methods-wrap"
				@click="save"
			>
				<span class="slTitle">电子仓单过户申请</span>
			</div>
			<div class="slTitleAssis">销售合同信息</div>
			<TransferContractInfo
				:type="type"
				@sendRelationFlag="getContactRelation"
				ref="contractInfo"
				querySource="WAREHOUSE_RECEIPT_TRANSFER"
			></TransferContractInfo>
			<div class="slTitleAssis">选择采购合同</div>
			<div class="tips-box">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 20 20"
					fill="none"
				>
					<path
						d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
						fill="var(--primary-color)"
					/>
				</svg>
				<span> 下表展示当前销售合同关联业务线所对应的采购合同</span>
			</div>
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="buyContractList"
					:columns="buyColumns"
					:pagination="false"
					:rowKey="record => record.upContractId"
				>
					<template
						slot="buyerContractNo"
						slot-scope="text, record"
					>

						<a
							href="javascript:;"
							@click="goContractDetail(record)"
						
							>{{ record.upContractType == 'OFFLINE' ? record.upContractNo : text }}</a
						>
					</template>
				</a-table>
			</div>
			<div class="slTitleAssis">过户仓单信息</div>
			<div class="empty-box"  v-if="!transferInfoList.length"style="margin-top:20px">
				<svg
					width="66"
					height="66"
					viewBox="0 0 66 66"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						opacity="0.01"
						width="66"
						height="66"
						fill="#D8D8D8"
					/>
					<path
						d="M5 18C5 15.2386 7.23858 13 10 13H44C46.7614 13 49 15.2386 49 18V51H5V18Z"
						fill="#F6F6F6"
						stroke="#D4D4D4"
						stroke-width="2"
					/>
					<path
						d="M11 7C11 4.23858 13.2386 2 16 2H56C58.7614 2 61 4.23858 61 7V56H11V7Z"
						fill="#F6F6F6"
						stroke="#D4D4D4"
						stroke-width="2"
					/>
					<mask
						id="path-4-inside-1_10765_98103"
						fill="white"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M23.9726 48H6C2.68629 48 0 50.6863 0 54V59C0 62.3137 2.68629 65 6 65H60C63.3137 65 66 62.3137 66 59V54C66 50.6863 63.3137 48 60 48H42.0274C41.121 52.003 37.4235 55 33 55C28.5765 55 24.879 52.003 23.9726 48Z"
						/>
					</mask>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M23.9726 48H6C2.68629 48 0 50.6863 0 54V59C0 62.3137 2.68629 65 6 65H60C63.3137 65 66 62.3137 66 59V54C66 50.6863 63.3137 48 60 48H42.0274C41.121 52.003 37.4235 55 33 55C28.5765 55 24.879 52.003 23.9726 48Z"
						fill="#F6F6F6"
					/>
					<path
						d="M23.9726 48L25.9233 47.5583L25.5704 46H23.9726V48ZM42.0274 48V46H40.4296L40.0767 47.5583L42.0274 48ZM6 50H23.9726V46H6V50ZM2 54C2 51.7909 3.79086 50 6 50V46C1.58172 46 -2 49.5817 -2 54H2ZM2 59V54H-2V59H2ZM6 63C3.79086 63 2 61.2091 2 59H-2C-2 63.4183 1.58172 67 6 67V63ZM60 63H6V67H60V63ZM64 59C64 61.2091 62.2091 63 60 63V67C64.4183 67 68 63.4183 68 59H64ZM64 54V59H68V54H64ZM60 50C62.2091 50 64 51.7909 64 54H68C68 49.5817 64.4183 46 60 46V50ZM42.0274 50H60V46H42.0274V50ZM40.0767 47.5583C39.3828 50.623 36.517 53 33 53V57C38.3299 57 42.8591 53.3829 43.978 48.4417L40.0767 47.5583ZM33 53C29.483 53 26.6172 50.623 25.9233 47.5583L22.022 48.4417C23.1409 53.3829 27.6701 57 33 57V53Z"
						fill="#D4D4D4"
						mask="url(#path-4-inside-1_10765_98103)"
					/>
					<rect
						x="20"
						y="19"
						width="32"
						height="2"
						rx="1"
						fill="#D4D4D4"
					/>
					<rect
						x="20"
						y="27"
						width="32"
						height="2"
						rx="1"
						fill="#D4D4D4"
					/>
					<rect
						x="20"
						y="35"
						width="32"
						height="2"
						rx="1"
						fill="#D4D4D4"
					/>
					<rect
						x="20"
						y="11"
						width="32"
						height="2"
						rx="1"
						fill="#D4D4D4"
					/>
				</svg>

				<p>当前仓单未展示，请先选择采购合同</p>
			</div>
			<template v-else>
				<div class="tips-box" >
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
							fill="var(--primary-color)"
						/>
					</svg>
					<div style="margin-left: 10px">
						<p>若仓单全部过户，则生成过户子仓单；若仓单部分过户，则原仓单会拆分为存货子仓单、过户子仓单；</p>
						<p>
							仓储方审核通过盖章后，原仓单状态会更新为“已核销”，过户子仓单及存货子仓单状态更新为“生效中”；若仓单无需转让，则本次转让数量填写0即可。
						</p>
					</div>
				</div>
				<div>
					<a-descriptions
						bordered
						:column="3"
						size="middle"
					>
						<a-descriptions-item label="接收方">{{ selectContractInfo.buyerName }} </a-descriptions-item>
						<a-descriptions-item label="仓储企业">
							<span>{{ currentStorageCompanyInfo.storageCompanyName }}</span>
						</a-descriptions-item>

						<a-descriptions-item label="仓库名称">
							{{ currentStorageCompanyInfo.name }}
						</a-descriptions-item>
            <!-- <a-descriptions-item label="货物名称">
							{{ selectContractInfo.goodsName }}
						</a-descriptions-item>
            <a-descriptions-item label="转让数量合计">
              <span style="color: #ff7937">{{ detailData.transferQuantity | formatMoney }}</span>
              <span>吨</span> -->
            </a-descriptions-item>
					</a-descriptions>
					<WarehouseInfo
						style="margin-top: 20px"
            ref="warehouseInfo"
						:list="transferInfoList"
					></WarehouseInfo>
				</div>
			</template>
		</a-card>
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
    <a-modal
				class="slModal confirm-modal"
				:visible="confirmVisible"
				:width="460"
				@cancel="confirmVisible = false"
				title="确认提交"
			>
				<p class="label">请确认以下信息是否有误：</p>
				<div class="infoBox">
					<p>
						<span class="label">接收方：</span>
						<span>{{selectContractInfo.buyerName }}</span>
					</p>
					<p>
						<span class="label">本次转让仓单数量：</span>
						<span style="color:#F46332">{{allQuantity | formatMoney(4)}}吨</span>
					</p>
				</div>
				<template slot="footer">
					<a-button
						key="back"
						@click="confirmVisible = false"
						class="cancel-btn"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="submitConfirm"
						style="margin-left: 20px"
						>确定</a-button
					>
				</template>
		</a-modal>
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
					ghost
					@click="save"
					>保存</a-button
				>
				<a-button
					type="primary"
					@click="submit"
					>提交</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import TransferContractInfo from '../components/OpenContractInfo.vue';
import WarehouseInfo from '../components/WarehouseInfo.vue';
import ModalInfo from '@/v2/components/modalInfo/info';
import { deepCompare } from '@/v2/utils/factory';
import { 
		getWarehouseReceiptBusinessLineInfo, 
		getBuyContractTransferInfo, 
		saveOrUpdateWarehouseReceiptTransfer,
		getWarehouseReceiptTransferDetail
	} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import { getStationDetail } from '../../../api';
import TipModal from '@sub/components/DelModal.vue';
const buyColumns = [

	{ title: '合同编号', dataIndex: 'buyerContractNo', scopedSlots: { customRender: 'buyerContractNo' } },
	{ title: '卖方企业名称', dataIndex: 'sellerName' },
	{ title: '关联业务线名称', dataIndex: 'businessLineName' },
	{ title: '业务线号', dataIndex: 'businessLineNo' }
];
export default {
	data() {
		return {
			type: 'OUT',
			selectContractInfo: {},
			selectedRowKeys: [],
			selected: {},
			buyColumns,
			buyContractList: [],
			detailInfo: {},
			currentStorageCompanyInfo: {},
			transferInfoList: [],
      currentParams: {},
      confirmVisible: false,

			isNeedNext: true,
      // 缓存

      cacheInfo: {},


		};
	},

	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.upContractId];
					t.$forceUpdate();
					t.selected = record;
          t.getBuyContractTransferInfo()
				}
			};
		},
    allQuantity() {
      let num = 0
      let list = this.currentParams.transferInfoList || []
      list.forEach(el => {
        num += (el.transferQuantity || 0)
      })
      return num
    }
	},
	 beforeRouteLeave(to, form, next) {
   
    if(this.isNeedNext) {
      this.oldAndNew(next)
    } else {
      next()
    }
   
	},
	mounted() {
		this.getStationDetail();
		if(this.$route.query.id) {
			this.getDetail()
		}
		
	},
	methods: {
		// 获取详情
		async getDetail() {
			const params = {
				id: this.$route.query.id,

			}
			const res = await getWarehouseReceiptTransferDetail(params)

			this.detailInfo = res.data

			this.cacheInfo = {
				contractId: this.detailInfo.contractInfo.orderContractId,
				businessLineNo: this.detailInfo.businessLineNo,
				transferInfoList: this.detailInfo.transferInfoList.map(el => {
					return {
						id:el.id,
						warehouseReceiptNo: el.warehouseReceiptNo,
						transferQuantity: el.transferQuantity || 0,
					}
				})

			}

			// await this.getContactRelation(this.detailInfo.contractInfo)
		  this.selectContractInfo = this.detailInfo.contractInfo;
			// 获取关联的采购合同
			const params2 = {
				orderContractId: this.detailInfo.contractInfo.orderContractId,
				contractType: this.detailInfo.contractInfo.contractType
			};
			const res2 = await getWarehouseReceiptBusinessLineInfo(params2);
			
			this.buyContractList = res2.data || [];
			


			this.$nextTick(() => {
				 this.$refs.contractInfo.init(this.detailInfo.contractInfo, true)

				 this.$nextTick(() => {
									 /** 选择的采购合同 */
				 	const item = this.buyContractList.find(el => el.businessLineNo == this.detailInfo.businessLineNo) || {}
					this.selectedRowKeys= [item.upContractId]
					this.selected = item

					this.transferInfoList = this.detailInfo.transferInfoList
				 })





			})
		},
		async getContactRelation(info, isFirst) {
		

			this.selectContractInfo = info;
			// 获取关联的采购合同
			const params = {
				orderContractId: info.orderContractId,
				contractType: info.contractType
			};
			const res = await getWarehouseReceiptBusinessLineInfo(params);
			
			this.buyContractList = res.data || [];

			if(!isFirst) {
				this.selected = {}
				this.selectedRowKeys = []
				this.transferInfoList = []
				if(this.buyContractList.length == 1) {
					const item =  this.buyContractList[0]
					this.selected = item
					this.selectedRowKeys = [item.upContractId]

					/** 调用过户仓单列表 */
					this.getBuyContractTransferInfo()
				}
			}



			


		},
		// 获取站台信息
		async getStationDetail() {
			const res = await getStationDetail({ t: Math.random() });
			this.currentStorageCompanyInfo = res.data;
		},
		forceBack() {
      this.isNeedNext = false
      this.goBack()
    },
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/list');
		},
		// 去往合同详情
		goContractDetail(item) {
			let contractType = 'BUY';

			let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${item.upOrderId}&type=${contractType}`;

			if (item.upContractType == 'OFFLINE') {
				path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${item.upContractId}&type=${contractType.toLowerCase()}`;
			}
			window.open(path);
		},
    async getBuyContractTransferInfo() {
      const params = {
        orderContractId: this.selected.upOrderId || this.selected.upContractId ,
        contractType: this.selected.upContractType,
      }
      const res = await getBuyContractTransferInfo(params)
      this.transferInfoList = res.data || []
    },
		async save() {
			/** 判断是 */
			if(!this.selected.businessLineNo) {
				this.$message.error('请选择采购合同')
				return 
			}
			if(!this.transferInfoList.length) {
				this.$message.error('当前采购合同无过户仓单信息')
				return 
			}
      const params = {
        id: this.$route.query.id,
        operatorType: 'SAVE',
        contractType: this.selectContractInfo.contractType,
        contractId: this.selectContractInfo.orderContractId,
        businessLineNo: this.selected.businessLineNo,
        transferInfoList:[]
      }
      let transferInfoList =  this.$refs.warehouseInfo.save()
      if(!transferInfoList) return
      params.transferInfoList = transferInfoList
      await saveOrUpdateWarehouseReceiptTransfer(params)
			this.isNeedNext = false
      this.$message.success('保存成功')
			this.goBack()
    },
		async submit() {
			if(!this.selected.businessLineNo) {
				this.$message.error('请选择采购合同')
				return 
			}
			if(!this.transferInfoList.length) {
				this.$message.error('当前采购合同无过户仓单信息')
				return 
			}
      const params = {
        id: this.$route.query.id,
        operatorType: 'SUBMIT',
        contractType: this.selectContractInfo.contractType,
        contractId: this.selectContractInfo.orderContractId,
        businessLineNo: this.selected.businessLineNo,
        transferInfoList:[]
      }
      let transferInfoList =  this.$refs.warehouseInfo.save()
      if(!transferInfoList) return
      params.transferInfoList = transferInfoList
			this.currentParams = params
			this.confirmVisible = true
			
    },
    async submitConfirm() {
      await saveOrUpdateWarehouseReceiptTransfer(this.currentParams)
			this.isNeedNext = false
      this.$message.success('提交成功')
      // this.$router.go(-1)
			this.goBack()
    },
		async oldAndNew(next) {
			if(!this.selected.businessLineNo) {
				next()
				return 
			}
			if(!this.transferInfoList.length) {
				next()
				return 
			}
			let newObj = {
				contractId: this.selectContractInfo.orderContractId,
				businessLineNo: this.selected.businessLineNo,

      }
			let transferInfoList =  this.$refs.warehouseInfo.save2()
      if(!transferInfoList) {
				next()
				return
			}
      newObj.transferInfoList = transferInfoList
			if(!deepCompare(this.cacheInfo, newObj)) {
				this.openModal()
			} else {
				next()
			}


		},
    openModal() {
			this.$refs.modalInfoChange.open()
    },
	},
	components: {
		Breadcrumb,
		TransferContractInfo,
		WarehouseInfo,
    TipModal,
		ModalInfo,
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		width: 19%;
	}
}
.tips-box {
	color: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	border-radius: 4px;
	padding: 10px 10px;
	margin-bottom: 20px;
	margin-top: 30px;
	span {
		margin-left: 10px;
	}
}
.slDetailBottom {
	margin-top: 20px;
	width: calc(100vw - 254px);

	// width: 100%;
	// min-width: 1186px;
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
.empty-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: rgba(0, 0, 0, 0.25);
	border: 1px solid #e5e6eb;
	height: 162px;
	font-size: 12px;
	border-radius: 4px;
	p {
		margin-top: 20px;
	}
}
.slModal.confirm-modal {
	min-width: 408px;
	.infoBox {
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 32px;
		margin-top: 10px;
		p {
			padding-left: 13px;
			.label {
				display: inline-block;
				width: 140px;
				text-align: left;
			}
		}
		p:nth-child(2n) {
			background: #f3f5f6;
		}
	}
	.label {
		color: rgba(0, 0, 0, 0.4);
	}
}
</style>
