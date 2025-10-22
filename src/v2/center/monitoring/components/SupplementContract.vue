<template>
	<div style="display: inline-block; width: 100%">
		<div style="text-align: right; margin-bottom: 15px">
			<a-button
				v-if="showModifyBtn()"
				type="primary"
				v-auth="'monitor:dynamic:terminalContract:edit'"
				@click="editContractContent"
				>编辑</a-button
			>
		</div>
		<div
			class="contract-content"
			v-show="detailForm"
		>
			<a-descriptions :column="2">
				<a-descriptions-item
					:label="`${contractTypeText}合同生效状态`"
					v-if="detailForm.effectiveStatusText"
				>
					<a-tooltip>
						<template slot="title">
							{{ detailForm.effectiveStatusText }}
						</template>
						<span>{{ detailForm.effectiveStatusText }}</span>
					</a-tooltip>
				</a-descriptions-item>
				<a-descriptions-item
					label="审核记录"
					v-if="detailForm.existAudit"
				>
					<span
						style="color: #0053db; cursor: pointer"
						@click="showRecord(detailForm)"
						>审核记录</span
					>
				</a-descriptions-item>
				<a-descriptions-item :label="`${contractTypeText}企业名称`">
					<a-tooltip
						v-if="detailForm.terminalCompanyName"
						:title="detailForm.terminalCompanyName"
					>
						<span>{{ detailForm.terminalCompanyName }}</span>
					</a-tooltip>
				</a-descriptions-item>
				<a-descriptions-item label="社会统一信用代码">
					<a-tooltip
						v-if="detailForm.bizNo"
						:title="detailForm.bizNo"
					>
						<span>{{ detailForm.bizNo }}</span>
					</a-tooltip>
				</a-descriptions-item>
				<a-descriptions-item :label="`${contractTypeText}纸质合同`">
					<a-tooltip v-if="detailForm.paperContractNo">
						<template slot="title"
							><span style="white-space: pre">{{ detailForm.paperContractNo }}</span></template
						>
						<span style="white-space: pre">{{ detailForm.paperContractNo }}</span>
					</a-tooltip>
				</a-descriptions-item>
				<a-descriptions-item label="煤种">{{ detailForm.coalTypeName }}</a-descriptions-item>
				<a-descriptions-item label="品名">{{ detailForm.goodsName }}</a-descriptions-item>
				<a-descriptions-item
					label="运输方式"
					v-if="!detailForm.terminalContractDelivery"
					>{{ detailForm.transTypeName }}</a-descriptions-item
				>
				<template v-if="detailForm.terminalContractDelivery">
					<a-descriptions-item label="运输方式">{{ detailForm.terminalContractDelivery.transportModeDesc }}</a-descriptions-item>
					<template v-if="detailForm.terminalContractDelivery.transportMode == 'SHIP'">
						<a-descriptions-item label="装货港">{{
							detailForm.terminalContractDelivery.shipLoadingPortName
						}}</a-descriptions-item>
						<a-descriptions-item label="卸货港">{{
							detailForm.terminalContractDelivery.shipDischargingPortName
						}}</a-descriptions-item>
					</template>
					<template v-if="['AUTOMOBILE_AND_TRAIN', 'TRAIN'].includes(detailForm.terminalContractDelivery.transportMode)">
						<a-descriptions-item label="发站">{{
							detailForm.terminalContractDelivery.trainSendStationName || '--'
						}}</a-descriptions-item>
						<a-descriptions-item label="到站">{{
							detailForm.terminalContractDelivery.trainArriveStationName
						}}</a-descriptions-item>
						<a-descriptions-item label="托运人">{{
							detailForm.terminalContractDelivery.consignorCompanyName
						}}</a-descriptions-item>
					</template>
					<template v-if="['AUTOMOBILE_AND_TRAIN', 'AUTOMOBILE'].includes(detailForm.terminalContractDelivery.transportMode)">
						<a-descriptions-item label="发货地址">{{ detailForm.terminalContractDelivery.sendGoodsAddress }}</a-descriptions-item>
						<a-descriptions-item label="收货地址">{{
							detailForm.terminalContractDelivery.receiveGoodsAddress
						}}</a-descriptions-item>
					</template>
					<a-descriptions-item label="收货人名称">{{
						detailForm.terminalContractDelivery.consigneeCompanyName
					}}</a-descriptions-item>
				</template>
				<a-descriptions-item label="合同单价(元/吨)">{{
					detailForm.followTheMarket ? '随行就市' : detailForm.contractPrice
				}}</a-descriptions-item>
				<a-descriptions-item label="合同数量">{{ detailForm.contractQuantity }}吨</a-descriptions-item>
				<a-descriptions-item label="合同总价"
					>{{ detailForm.contractAmount }}<span v-if="!detailForm.followTheMarket">元</span></a-descriptions-item
				>
				<a-descriptions-item label="合同签订状态">{{ detailForm.signStatusDesc }}</a-descriptions-item>
				<a-descriptions-item
					label="双签合同获得日期"
					v-if="detailForm.doubleSignTime"
					>{{ detailForm.doubleSignTime }}</a-descriptions-item
				>
				<a-descriptions-item label="合同有效期">{{
					detailForm.execDateStart ? detailForm.execDateStart + '-' + detailForm.execDateEnd : detailForm.contractExpireDate
				}}</a-descriptions-item>
				<a-descriptions-item label="合同类型">{{ detailForm.contractTermTypeDesc }}</a-descriptions-item>
				<a-descriptions-item label="回款账号">
					<!-- <span class="collection-account"> -->
					<a-tooltip>
						<template slot="title"> {{ detailForm.receivableBankName }}{{ detailForm.receivableBankNo }} </template>
						<span>{{ detailForm.receivableBankName }}{{ detailForm.receivableBankNo }}</span>
					</a-tooltip>
					<!-- </span> -->
				</a-descriptions-item>
				<!-- 全业务线 -->
				<a-descriptions-item
					label="合同附件"
					v-if="contractType == '2'"
				>
					<FilesUpload
						:contractId="detailForm.id || ''"
						:ifEditable="false"
						@uploadFiles="getUploadFiles"
						:type="[1]"
						:fileDataSource="fileDataSource"
						tabType="contract"
					/>
				</a-descriptions-item>
			</a-descriptions>
			<!-- 线下销售合同 -->
			<template v-if="contractType == '1' || (contractType == '2' && businessLineType == 'DOWN')">
				<template v-if="detailForm.terminalContractExtensionDto && detailForm.terminalContractExtensionDto.whetherSame">
					<p class="contract-title">下游企业开票信息</p>
					<a-descriptions :column="2">
						<a-descriptions-item label="发票购买方与购买方是否一致">
							{{ detailForm.terminalContractExtensionDto.whetherSame === 'SAME' ? '是' : '否' }}
						</a-descriptions-item>
						<!-- 一致时不展示以下信息 -->
						<template
							v-if="
								detailForm.terminalContractExtensionDto.whetherSame !== 'SAME' &&
								detailForm.terminalContractExtensionDto.companyInvoiceInfo
							"
						>
							<a-descriptions-item label="购买方">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.companyName
							}}</a-descriptions-item>
							<a-descriptions-item label="税号">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.bizLicenseNo
							}}</a-descriptions-item>
							<a-descriptions-item label="企业地址">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.companyAddress
							}}</a-descriptions-item>
							<a-descriptions-item label="电话号码">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.companyPhone
							}}</a-descriptions-item>
							<a-descriptions-item label="开户行">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.openAccountBank
							}}</a-descriptions-item>
							<a-descriptions-item label="银行账户">{{
								detailForm.terminalContractExtensionDto.companyInvoiceInfo.accountNo
							}}</a-descriptions-item>
						</template>
					</a-descriptions>
					<a-table
						v-if="
							detailForm.terminalContractExtensionDto.whetherSame !== 'SAME' &&
							detailForm.terminalContractExtensionDto.companyInvoiceInfo
						"
						:columns="filesColumns"
						:dataSource="detailForm.terminalContractExtensionDto.companyInvoiceInfo.invoiceFileInfoList"
						:pagination="false"
						:rowKey="record => record.id"
						:locale="{ emptyText: '暂无数据' }"
					>
						<span
							slot="action"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="handlePreview(record)"
								>查看</a
							>
						</span>
					</a-table>
				</template>
			</template>
			<!-- 纸质合同均展示, 全业务线查看contractType=2不展示-->
			<template v-if="contractType != '2'">
				<p class="contract-title">合同附件</p>
				<OfflineCotractFilesTable
					:contractAttachment="detailForm.contractAttachment || []"
					:supplementalInfo="detailForm.supplementalInfo || []"
				/>
			</template>

			<template v-if="detailForm.terminalContractExtensionDto && detailForm.terminalContractExtensionDto.signWay">
				<p class="contract-title">签订过程留痕信息</p>
				<p style="margin: 0 0 10px 0">
					合同签订方式：{{
						detailForm.terminalContractExtensionDto.signWay | filterCodeByValueName('offlineContractSignWayEnum')
					}}
				</p>
				<a-descriptions
					:column="2"
					v-if="detailForm.terminalContractExtensionDto.signWay == 'EXPRESS_MAIL'"
				>
					<a-descriptions-item label="快递公司">
						{{
							detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.expressMailType
								| filterCodeByValueName('expressMailEnum')
						}}
					</a-descriptions-item>
					<a-descriptions-item label="快递单号">
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.expressOrderNo }}
					</a-descriptions-item>
					<a-descriptions-item label="发件人姓名">
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.senderName }}
					</a-descriptions-item>
					<a-descriptions-item label="发件人电话">
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.senderMobile }}
					</a-descriptions-item>
					<a-descriptions-item
						label="发件地址"
						:span="2"
					>
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendAddress }}-
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.sendDetailAddress }}
					</a-descriptions-item>
					<a-descriptions-item label="收件人姓名">
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiverName }}
					</a-descriptions-item>
					<a-descriptions-item label="收件人电话">
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiverMobile }}
					</a-descriptions-item>
					<a-descriptions-item
						label="收件地址"
						:span="2"
					>
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveAddress }}-
						{{ detailForm.terminalContractExtensionDto.terminalContractSignLhDto.expressMailInfo.receiveDetailAddress }}
					</a-descriptions-item>
				</a-descriptions>
				<a-table
					v-if="
						detailForm.terminalContractExtensionDto.signWay == 'SCENE_SIGN' &&
						detailForm.terminalContractExtensionDto.terminalContractSignLhDto
					"
					:columns="filesColumns"
					:dataSource="detailForm.terminalContractExtensionDto.terminalContractSignLhDto.fileInfoList"
					:pagination="false"
					:rowKey="(record, index) => String(index)"
					:locale="{ emptyText: '暂无数据' }"
				>
					<span
						slot="action"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="handlePreview(record)"
							>查看</a
						>
					</span>
				</a-table>
			</template>
		</div>
		<a-modal
			:visible="recordListVisible"
			:width="1200"
			:footer="false"
			title="审核记录"
			dialogClass="recordListVisible"
			@cancel="
				() => {
					recordListVisible = false;
				}
			"
		>
			<a-table
				:columns="columns"
				:dataSource="recordListDataSource"
				bordered
				:pagination="false"
				:rowKey="record => record.id"
				:locale="{ emptyText: '暂无数据' }"
			>
				<span
					slot="action"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="showRecordDetail(record)"
						>详情</a
					>
				</span>
			</a-table>
		</a-modal>
		<a-modal
			:visible="recordDetailVisible"
			:width="1200"
			title="详情"
			:footer="false"
			dialogClass="recordDetailVisible"
			@cancel="
				() => {
					recordDetailVisible = false;
				}
			"
		>
			<div>
				<a-row>
					<a-col :span="12">
						<a-form-item :label="`${contractTypeText}企业名称`">
							{{ [recordDetail.sellerName, recordDetail.buyerName][contractType] }}
						</a-form-item>
						<a-form-item :label="`${contractTypeText}纸质合同号`">
							{{ recordDetail.paperContractNo }}
						</a-form-item>
						<a-form-item label="运输方式">
							{{ recordDetail.transTypeName }}
						</a-form-item>
						<a-form-item label="合同总量">
							{{ recordDetail.contractQuantity }}
						</a-form-item>
						<a-form-item label="合同签订状态">
							{{ recordDetail.statusText }}
						</a-form-item>
						<a-form-item label="双签合同获得日期">
							{{ recordDetail.doubleSignTime }}
						</a-form-item>
						<a-form-item
							label="合同附件"
							v-if="recordDetail.attachment"
						>
							<a
								:href="recordDetail.attachment.fileUrl"
								target="_blank"
							>
								{{
									recordDetail.attachment.fileUrl
										? recordDetail.attachment.fileUrl.split('?')[0]
										: recordDetail.attachment.fileUrl
								}}
							</a>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="社会统一信用代码">
							{{ [recordDetail.sellerBizNo, recordDetail.buyerBizNo][contractType] }}
						</a-form-item>
						<a-form-item label="品名">
							{{ recordDetail.goodsName }}
						</a-form-item>
						<a-form-item label="合同单价">
							{{ recordDetail.contractPrice }}
						</a-form-item>

						<a-form-item label="合同总价">
							{{ recordDetail.contractAmount }}
						</a-form-item>
						<a-form-item label="合同日期">
							{{ recordDetail.contractSignTime }}
						</a-form-item>
						<a-form-item label="回款账户">
							{{ recordDetail.receivableBankName }}-{{ recordDetail.receivableBankNo }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>
		</a-modal>
		<image-viewer ref="imageViewer" />
		<a-modal
			:visible="videoVisible"
			:footer="null"
			wrapClassName="modal-none-padding"
			destroyOnClose
			width="520px"
			@cancel="videoVisible = false"
		>
			<video
				width="520"
				controls
				autoplay
			>
				<source
					:src="previewImg"
					type="video/ogg"
				/>
				<source
					:src="previewImg"
					type="video/mp4"
				/>
				<source
					:src="previewImg"
					type="video/webm"
				/>
				<object
					width="520"
					data="movie.mp4"
				>
					<embed :src="previewImg" />
				</object>
				您的浏览器不支持 video 标签,请下载观看。
			</video>
		</a-modal>
	</div>
</template>

<script>
import {
	// API_SaveManualEdit,TODO:需确认删除
	// API_getSAPContractDetail,TODO:需确认删除
	// API_GetDetailByPaperContractNo,TODO:需确认删除
	// API_SyncSAPContract,TODO:需确认删除
	// API_BusinessMonitoringUpstreamAddOrUpdate,TODO:需确认删除
	// API_BusinessMonitoringDownstreamAddOrUpdate,TODO:需确认删除
	// API_GetDownstreamCompanyList,TODO:需确认删除
	// API_COMPANYACCOUNTLIST,TODO:需确认删除
	API_GetDetailRecordDetailContractNo,
	API_GetDetailRecordContractNo,
	API_BusinessMonitoringUpstreamContractDetail,
	API_BusinessMonitoringDownstreamContractDetail,
	API_FullBusinessLineDetailContractDetail,
	API_GetDownloadRAR
} from '@/v2/center/monitoring/api';
import FilesUpload from '@/v2/center/monitoring/components/FilesUpload';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { filePreview } from '@/v2/utils/file';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import OfflineCotractFilesTable from './OfflineCotractFilesTable';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

const columns = [
	{ title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
	{ title: '审核状态', dataIndex: 'auditStatusText', key: 'auditStatusText' },
	{ title: '审核意见', dataIndex: 'rejectReason', key: 'rejectReason' },
	{ title: '审核时间', dataIndex: 'auditTime', key: 'auditTime' },
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 100
	}
];
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeName', key: 'typeName' },
	{ title: '文件格式', dataIndex: 'ext', key: 'ext' },
	{ title: '文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
	{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 100 }
];

export default {
	name: 'ContractContent',
	components: {
		FilesUpload,
		imageViewer,
		OfflineCotractFilesTable
	},
	props: {
		dynamicMonitoringDetail: {
			type: [Object, String],
			default: () => {}
		},
		contractType: {
			type: [Number, String],
			default: 0
		},
		downOrderNo: {
			type: [Number, String],
			default: ''
		},
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	filters: {
		filterCodeByValueName
	},
	data() {
		return {
			columns,
			contractTypeText: '',
			recordDetailVisible: false,
			recordListVisible: false,
			detailForm: {},
			params: {},
			fileDataSource: [], // 从详情接口获取的数据
			fileInfos: [], // 从上传子组件传回的数据
			recordDetail: {
				attachment: {}
			},
			recordListDataSource: [], //审核记录
			businessLineType: '',
			filesColumns,
			previewImg: '',
			videoVisible: false
		};
	},
	computed: {},
	watch: {
		curUpstream() {
			this.detailForm = {};
			this.params = {};
			this.fileDataSource = [];
			this.getContractData();
		},
		orderNo() {
			this.detailForm = {};
			this.fileDataSource = [];
			this.getContractData();
			this.getContractTypeText();
		}
	},
	created() {
		this.getContractTypeText();
		this.getContractData();
	},
	methods: {
		getContractTypeText() {
			this.businessLineType = this.$route.query.businessLineType;
			let contractTypeText = ['上游', '下游'][this.contractType];
			if (this.contractType === 2) {
				const text = {
					UP: '上游',
					DOWN: '下游'
				};
				contractTypeText = text[this.businessLineType];
				//如果没有取到值，则从地址栏取参数（上下游均为补录）
				if (!contractTypeText) {
					contractTypeText = +this.$route.query.activedCoverIndex == 0 ? '上游' : '下游';
				}
			}
			this.contractTypeText = contractTypeText;
		},
		getRecord(contractNo) {
			API_GetDetailRecordContractNo({
				contractNo
			}).then(res => {
				this.recordListDataSource = res.data || [];
				this.$nextTick(() => {
					this.recordListVisible = true;
				});
			});
		},
		showRecord(data) {
			this.getRecord(data.contractNo);
		},
		showRecordDetail(data) {
			API_GetDetailRecordDetailContractNo({
				id: data.id
			}).then(res => {
				this.recordDetail = res.data || {};
				this.$nextTick(() => {
					this.recordDetailVisible = true;
				});
			});
		},
		getContractData() {
			switch (this.contractType) {
				case 0:
					// 是上游合同且已经选中上游合同，否则为上游补录
					if (this.curUpstream.upOrderNo) {
						this.getContractInfo(this.curUpstream.upOrderNo);
					}
					break;
				case 1:
					// 下游合同
					if (this.dynamicMonitoringDetail.downOrderNo) {
						this.getContractInfo(this.curUpstream.upOrderNo);
					}
					break;
				case 2:
					this.getContractInfo(this.curUpstream.upOrderNo);
					break;
				default:
					break;
			}
		},
		showModifyBtn() {
			if (
				this.contractType === 0 &&
				(this.detailForm.status == 'REJECT' ||
					this.detailForm.status == 'EXECUTING' ||
					this.detailForm.status == 'COMPLETED_REJECT' ||
					this.detailForm.status == 'SINGLE_SIGN' ||
					this.detailForm.status == 'DOUBLE_SIGN_AUDITING_REJECT')
			) {
				//采购"驳回、执行中、完结审批驳回、双签审批驳回"可修改
				return true;
			} else if (
				this.contractType === 1 &&
				(this.detailForm.status == 'SINGLE_SIGN' ||
					this.detailForm.status == 'EXECUTING' ||
					this.detailForm.status == 'COMPLETED_REJECT' ||
					this.detailForm.status == 'DOUBLE_SIGN_AUDITING_REJECT')
			) {
				//销售--合同状态为“已单签、执行中、双签审批驳回、完结审批驳回”时可修改
				return true;
			} else if (
				this.contractType === 2 &&
				this.businessLineType === 'DOWN' &&
				(this.detailForm.status == 'SINGLE_SIGN' ||
					this.detailForm.status == 'EXECUTING' ||
					this.detailForm.status == 'COMPLETED_REJECT' ||
					this.detailForm.status == 'DOUBLE_SIGN_AUDITING_REJECT')
			) {
				//全业务线查看 下游--合同状态为“已单签、执行中、双签审批驳回、完结审批驳回”时可修改
				return true;
			} else {
				return false;
			}
		},
		// 获取上游/下游合同信息
		async getContractInfo(upOrderNo) {
			const { businessLineType } = this.$route.query;
			const fct = [
				API_BusinessMonitoringUpstreamContractDetail,
				API_BusinessMonitoringDownstreamContractDetail,
				API_FullBusinessLineDetailContractDetail
			][this.contractType];
			const params = {
				orderNo: this.orderNo,
				upOrderNo: upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType,
				t: new Date().getTime() + 3
				// orderNo: 'SKBT202110180006',
			};
			const res = await fct(params);
			if (!res.success) {
				return;
			}
			// 表格数据按照key='typeName'值相同的行合并
			res.data.supplementalInfo = TableRowSpanFunc(res.data.supplementalInfo || [], 'typeName');
			res.data.contractAttachment = TableRowSpanFunc(res.data.contractAttachment || [], 'typeName');
			this.params = res.data || {};

			this.detailForm = res.data;
			const {
				sellerCompanyName,
				buyerCompanyName,
				sellerCompanyUscc,
				buyerCompanyUscc,
				contractStatus
				// contractPrice,
				// contractQuantity,
			} = res.data;
			this.detailForm.terminalCompanyName =
				[sellerCompanyName, buyerCompanyName][this.contractType] ||
				(+this.$route.query.activedCoverIndex == 0 ? sellerCompanyName : buyerCompanyName);
			this.detailForm.bizNo =
				[sellerCompanyUscc, buyerCompanyUscc][this.contractType] ||
				(+this.$route.query.activedCoverIndex == 0 ? sellerCompanyUscc : buyerCompanyUscc);
			this.detailForm.contractStatus = contractStatus;
			if (this.contractType === 2 && this.businessLineType !== 'OFFLINE') {
				const companyData = {
					UP: {
						terminalCompanyName: sellerCompanyName,
						bizNo: sellerCompanyUscc
					},
					DOWN: {
						terminalCompanyName: buyerCompanyName,
						bizNo: buyerCompanyUscc
					}
				};
				this.detailForm.terminalCompanyName = companyData[this.businessLineType]?.terminalCompanyName;
				this.detailForm.bizNo = companyData[this.businessLineType]?.bizNo;
			}
			this.fileDataSource = [];
			if (res.data.contractAttachment) {
				if (Array.isArray(res.data.contractAttachment)) {
					this.fileDataSource = res.data.contractAttachment;
				} else {
					this.fileDataSource.push(res.data.contractAttachment);
				}
			}
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		// 修改合同
		editContractContent() {
			//上下游 为补录时修改跳转到对应页面,ONLINE电子合同
			let type = this.contractTypeText == '上游' ? 'buy' : 'sell';
			//判断关联合同类型
			let linkOrderNo, linkOrderType;
			if (type == 'buy') {
				//修改的是上游，关联的就是下游
				linkOrderNo = this.$route.query.downOrderNo;
			} else {
				linkOrderNo = this.$route.query.upOrderNo;
			}
			if (this.businessLineType === 'OFFLINE') {
				//如果上下游均为补录,关联类型为线下
				linkOrderType = 'OFFLINE';
			} else {
				//此页面只有线下合同进来，所以关联关系出去OFFLINE，均为电子对线下
				linkOrderType = 'ONLINE';
			}
			this.$router.push({
				path: `/center/contract/${type}/offline/add`,
				query: {
					id: this.params.id,
					type,
					linkOrderType,
					linkOrderNo,
					disabled: true,
					whetherEditAllBoo: type === 'sell' ? this.detailForm.whetherEditAllBoo : undefined,
					whetherHaveRelAuditBoo: type === 'sell' ? this.detailForm.whetherHaveRelAuditBoo : undefined
				}
			});
		},
		handlePreview(data, isStaticFile = false) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				return;
			}
			filePreview(this.previewImg, this.$refs.imageViewer.show);
		}
	}
};
</script>

<style lang="less" scoped>
.collection-account {
	display: table-cell;
	margin-right: 5px;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.recordDetailVisible .ant-form-item {
	display: flex;
	font-size: 14px;
}
.contract-title {
	font-weight: bold;
	margin: 20px 0;
	font-size: 16px;
}
::v-deep.ant-descriptions {
	padding: 0;
}
::v-deep.ant-descriptions .ant-descriptions-item:has(.ant-descriptions-item-content) {
	padding-bottom: 14px;
}
</style>
