<template>
	<div class="contentBox">
		<div class="upstreamBox">
			<div class="title">上游合同信息</div>
			<div class="divider"></div>
			<div class="content">
				<div>
					<p class="sub-title">基本信息</p>
					<a-row>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">合同编号</a-col>
								<a-col :span="18">
									<a
										v-if="contractInfo.contractType == 'ONLINE'"
										@click="jumpPage"
										>{{ contractInfo.no }}</a
									>
									<span v-else>{{ contractInfo.no }}</span>
								</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">签订日期</a-col>
								<a-col :span="18">{{ contractInfo.signTime }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="8">卖方名称</a-col>
								<a-col :span="16">{{ contractInfo.sellerName }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="6">买方名称</a-col>
								<a-col :span="16">{{ contractInfo.buyerName }}</a-col>
								<!-- <a-col :span="18" class="doubleSign" v-if="contractInfo.upContract.signStatus=='2'">双签</a-col>
                                <a-col :span="18" class="singleSign" v-if="contractInfo.upContract.signStatus=='1'">单签</a-col> -->
							</a-row>
						</a-col>
						<!-- 双签状态 -->
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="8">合同签订状态</a-col>
								<a-col :span="16">{{ contractInfo.status }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="8">合同执行期</a-col>
								<a-col :span="16">{{ contractInfo.startDate }} 至 {{ contractInfo.endDate }}</a-col>
							</a-row>
						</a-col>
						<a-col :span="12">
							<a-row :gutter="20">
								<a-col :span="8">合同形式</a-col>
								<a-col :span="16">{{ { ONLINE: '电子合同', OFFLINE: '线下合同' }[contractInfo.contractType] }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>

				<div>
					<p class="sub-title">合同详情</p>
					<a-table
						rowKey="id"
						:pagination="false"
						:columns="contractDetailColumns"
						:data-source="contractInfo.goodsList || []"
						:scroll="{ x: true }"
					></a-table>
				</div>

				<div>
					<p class="sub-title">附件信息</p>
					<!-- 上游附件信息详情模块 -->
					<a-table
						v-if="fileListDataSource.length || (!fileListDataSource.length && !supplementalInfo.length)"
						:pagination="false"
						:columns="noFileName ? noFileNameFilesColumns : filesColumns"
						:data-source="fileListDataSource"
						:scroll="{ x: true }"
						rowKey="path"
					>
						<template
							slot="name"
							slot-scope="name, items"
						>
							<a
								target="_blank"
								@click="preview(items.path)"
								>{{ name }}</a
							>
						</template>
					</a-table>

					<a-table
						v-if="supplementalInfo.length"
						bordered
						:dataSource="supplementalInfo"
						:columns="supplementalColumns"
						:rowKey="record => record.index"
						:pagination="false"
						:scroll="{ x: true }"
						style="margin-top: 20px"
					>
						<template
							slot="changeItem"
							slot-scope="text, record"
							v-if="record.changeItem"
						>
							<span
								v-for="(item, index) in record.changeItem.split(',')"
								:key="index"
							>
								{{ filterCodeByValueName(item, 'changeItemEnums') }}
								<span v-if="index < record.changeItem.split(',').length - 1">、</span>
							</span>
						</template>
						<template
							slot="executionDate"
							slot-scope="text, record"
						>
							{{ record.executionDateStart }}
							<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
						</template>
						<template
							slot="name"
							slot-scope="text, record"
						>
							<a
								v-for="(item, index) in record.supplementalFile"
								:key="index"
								class="edit-btn"
								@click.prevent="preview(item.url)"
							>
								{{ item.name }}
								<span v-if="index < record.supplementalFile.length - 1">,</span>
							</a>
						</template>
						<template
							slot="transferName"
							slot-scope="text, record"
						>
							<span
								v-for="(item, index) in record.supplementalFile"
								:key="index"
								class="edit-btn"
							>
								{{ item.transferName }}
								<span v-if="index < record.supplementalFile.length - 1">,</span>
							</span>
						</template>
					</a-table>
				</div>
			</div>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import { filterLockFile } from '@/untils/factory.js';
import _ from 'lodash';
import { getOfficeFileViewUrl } from 'untils/factory.js';

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';

export default {
	name: 'Contract',
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验合同金额
			let regs2 = /^\d+(\.\d{0,2})?$/;
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			previewImg: '',
			filterLockFile: filterLockFile,
			fileListDataSource: [],
			contractDetailColumns: [
				{ title: '标的货物名称', dataIndex: 'goodsName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice' },
				{ title: '数量(吨)', dataIndex: 'quantity' },
				{ title: '总价(元)', dataIndex: 'totalPrice' }
			],
			upstreamContractDetailData: [], // 上游合同详情数据
			downstreamContractDetailData: [], // 下游合同详情数据
			contractEditColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice' },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{
					title: '单据类型',
					dataIndex: 'typeDesc',
					key: 'typeDesc',
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeDescRowSpan
							}
						};
					}
				},
				{ title: '初始文件名', dataIndex: 'originalFileName', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'convertFileName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{
					title: '单据类型',
					dataIndex: 'typeDesc',
					key: 'typeDesc',
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeDescRowSpan
							}
						};
					}
				},
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],

			editFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			fileInfos: [],
			baseInfoForm: {
				contractNo: '',
				contractAmount: '',
				contractSignTime: '',
				doubleSignTime: '',
				status: '',
				endTime: ''
			},
			detailForm: {},
			baseInfoRules: {
				contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
				contractAmount: [{ required: true, message: '合同⾦额不能为空', trigger: 'change' }],
				contractSignTime: [{ required: true, message: '签订⽇期不能为空', trigger: 'change' }],
				endTime: [{ required: true, message: '请选择到期日期', trigger: 'change' }],
				doubleSignTime: [{ required: true, message: '双签版合同获得⽇期不能为空', trigger: 'change' }]
			},
			editContractFlag: false, // 新增、修改合同详情,
			contractDetailForm: {
				goodsName: '',
				contractPrice: '',
				contractQuantity: ''
			},
			contractDetailRules: {
				goodsName: [{ required: true, message: '标的货物名称不能为空', trigger: 'blur' }],
				contractPrice: [
					{ required: true, message: '单价不能为空', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur', max: 9999999999, msg: '请输入0-9999999999,最多两位小数' }
				],
				contractQuantity: [
					{ required: true, message: '数量不能为空', trigger: 'change' },
					{ validator: validatePass, trigger: 'blur', max: 9999999999, msg: '请输入0-9999999999,最多两位小数' }
				]
			},
			downContractInfoFlag: true, // 上游合同基本信息是否填写完整
			downContractFullFlag: true, // 上游合同新增合同详情是否填写完整
			editTradeContractList: [],
			editUpContractList: [],
			editDownContractList: [],
			businessLineContractVO: [],
			downContractStatus: false,
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			supplementalInfo: [], // 下游补充协议附件
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row) => {
						return {
							children: `${text}`,
							attrs: {
								rowSpan: row.typeNameRowSpan
							}
						};
					},
					fixed: 'left'
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : '双签';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				}
			],
			filterCodeByValueName: filterCodeByValueName
		};
	},
	props: ['editFlag', 'contractInfo', 'noFileName', 'lineId', 'isAdvance', 'receivalVO'],
	// components: {
	//     Upload,
	//     AssetsCompanyRelationChainModal,
	// },

	watch: {
		contractInfo: function (data) {
			// 合同详情数据转成数组格式
			// if (data.supplementAttachmentList) {
			//     this.fileListDataSource = [...data.supplementAttachmentList]
			// }
			if (data.supplementalInfo) {
				this.supplementalInfo = [...data.supplementalInfo];
				this.supplementalInfo = TableRowSpanFunc(this.supplementalInfo, 'typeName');
			}
			if (data.contractAttachment) {
				this.fileListDataSource = [data.contractAttachment, ...this.fileListDataSource];
				this.fileListDataSource = TableRowSpanFunc(this.fileListDataSource, 'typeDesc');
			}
			// this.fileListDataSource = this.fileListDataSource.map((item) => {
			//     return {
			//         ...item,
			//         fileName: item.fileName || item.originalFileName,
			//         fileType: item.fileType || item.type,
			//         fileUrl:  item.fileUrl || item.path
			//     }
			// })
			// this.dealWithData(data)
		}
	},
	mounted() {
		let data = this.contractInfo;
		this.dealWithData(data);
	},
	methods: {
		moment,
		dealWithData(data) {
			if (data) {
				// this.dealWithCommonData(data)
				this.dealWithBusinessData(data);
			}
		},
		jumpPage() {
			let routerData = this.$router.resolve({
				path: '/center/contract/buy/online/detail',
				query: {
					id: this.contractInfo.orderId,
					type: 'BUY'
				}
			});
			window.open(routerData.href, '_blank');
		},
		preview(url) {
			// previewAttachment(url)
			const front_url = url.split('?')[0];
			const fileFormat = front_url.split('.').pop().toLowerCase();
			const previewUrl = url;
			switch (fileFormat) {
				case 'pdf':
					window.open(previewUrl, '_blank');
					break;
				case 'xls':
				case 'xlsx':
				case 'doc':
				case 'docx':
					window.open(getOfficeFileViewUrl(url), '_blank');
					break;
				default:
					this.previewImg = previewUrl;
					this.$refs.viewer.$viewer.show();
					break;
			}
		},
		dealWithCommonData(data) {
			// this.upstreamContractDetailData=[]
			// let obj = {}
			// obj.id = 1
			// obj.goodName = data.upContract.goodName
			// obj.basePrice = data.upContract.basePrice
			// obj.quantity = data.upContract.quantity
			// if (data.upContract.goodsVOList) {
			//     this.upstreamContractDetailData = data.upContract.goodsVOList
			// } else {
			//     this.upstreamContractDetailData.push(obj)
			// }

			this.downstreamContractDetailData = [];
			let pro = {};
			pro.id = 1;
			pro.goodName = data.downContract.goodsName;
			pro.basePrice = data.downContract.contractPrice;
			pro.quantity = data.downContract.contractQuantity;
			this.downContractStatus = data.downContract.status == 2;
			this.downstreamContractDetailData.push(pro);
			this.contractDetailForm = data.downContract;
			this.baseInfoForm = data.downContract;

			// 编辑附件模块table初始化数据
			if (this.editFlag) {
				this.editTradeContractList = Object.assign([], data.tradeContract ? data.tradeContract.list : []);
				this.editUpContractList = Object.assign([], data.upContract ? data.upContract.list : []);
				this.editDownContractList = Object.assign([], data.downContract ? data.downContract.list : []);
			}
		},
		dealWithBusinessData(data) {
			if (!this.isAdvance) return;
			let map = {
				UP: 'upContract',
				ONLINE: 'onlineContract',
				DOWN: 'downContract'
			};
			this.businessLineContractVO = data.businessLineContractVO || [];
			try {
				this.businessLineContractVO = this.businessLineContractVO.map(item => {
					let type = item.contractType;
					let _item = item[map[type]];
					return {
						..._item,
						contractId: _item.contractId,
						contractType: type,
						goodName: type == 'DOWN' ? _item.goodsName : _item.goodName,
						basePrice: type == 'DOWN' ? _item.contractPrice : _item.basePrice,
						quantity: type == 'DOWN' ? _item.contractQuantity : _item.quantity,
						amount: type == 'DOWN' ? _item.contractAmount : _item.amount,
						signDate: type == 'DOWN' ? _item.contractSignTime : _item.signDate,
						endDate: type == 'DOWN' ? null : _item.endDate,
						status: type == 'DOWN' ? _item.status : _item.signStatus,
						doubelSignRecvDate: type == 'DOWN' ? _item.doubleSignTime : _item.doubelSignRecvDate
					};
				});
			} catch (e) {
				this.businessLineContractVO = [];
			}
		},
		getOtherDetailData(item) {
			let obj = {};
			let array = [];
			obj.goodName = item.goodName;
			obj.basePrice = item.basePrice;
			obj.quantity = item.quantity;
			array.push(obj);
			return array;
		},
		deleteOther(item) {
			this.$confirm;
			let index = _.findIndex(this.businessLineContractVO, { contractNo: item.contractNo });
			this.businessLineContractVO.splice(index, 1);
		},
		addOther() {
			this.$refs.AssetsCompanyRelationChainModal.init(this.lineId);
		},
		addFin(data) {
			let index = _.findIndex(this.businessLineContractVO, { contractNo: data.contractNo });
			if (index == -1) {
				this.businessLineContractVO.push(data);
			} else {
				this.$message.error('当前合同已经添加过');
			}
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		getUploadFiles(data, type) {
			// 上传文件 获取附件数据
			this.fileInfos = data;
			// 遍历arr，把元素分别放入tmp数组(不存在才放)
			let tmp = new Array();
			let obj = {};
			if (type == 'CONTRACT_SUPPLEMENT') obj = this.contractInfo.upContract; // 上游合同补充文档
			if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF')
				obj = this.contractInfo.downContract; // 下游合同、下游合同补充文档
			if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') obj = this.contractInfo.tradeContract; // 贸易背景合同

			// 判断相同类型下不可上传文件名相同且内容相同的文件--start
			let sameFlag = true;
			for (var i in data) {
				if (obj && obj.list) {
					obj.list.forEach(item => {
						if (
							item.md5Hex == data[i].md5Hex &&
							item.delFlag == data[i].delFlag &&
							item.name == data[i].name &&
							item.type == data[i].type
						) {
							this.$message.error('同类型的附件不能上传相同的文件');
							sameFlag = false;
						}
					});
				}
			}
			if (!sameFlag) return;
			// 判断相同类型下不可上传文件名相同且内容相同的文件--end
			this.$message.success('添加成功');

			let project = {};
			let list = [];
			for (let i = 0; i < this.fileInfos.length; i++) {
				let element = this.fileInfos[i];
				// 对contractInfo数据进行更新
				if (obj) {
					obj.list.push(element);
				} else {
					list.push(element);
					if (i == this.fileInfos.length - 1) {
						project.list = list;
						if (obj) {
							obj = project;
						} else {
							if (type == 'CONTRACT_SUPPLEMENT') this.contractInfo.upContract = project;
							if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF')
								this.contractInfo.downContract = project;
							if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') this.contractInfo.tradeContract = project;
						}
					}
				}
				// 对编辑模块数据进行更新
				if (this.editFlag) {
					if (type == 'CONTRACT_SUPPLEMENT') {
						this.editUpContractList.push(element);
					}
					if (type == 'TERMINAL_CONTRACT' || type == 'TERMINAL_CONTRACT_SUPPLEMENT' || type == 'TERMINAL_CONTRACT_BID_PROOF') {
						this.editDownContractList.push(element);
					}
					if (type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
						this.editTradeContractList.push(element);
					}
				}
			}
		},
		deleteFiles(items) {
			// 删除附件
			let arr = [];
			let changeArr = [];
			if (items.type == 'CONTRACT_SUPPLEMENT') {
				// 上游合同补充文档
				arr = this.contractInfo.upContract.list;
				changeArr = this.editUpContractList;
			}
			if (
				items.type == 'TERMINAL_CONTRACT' ||
				items.type == 'TERMINAL_CONTRACT_SUPPLEMENT' ||
				items.type == 'TERMINAL_CONTRACT_BID_PROOF'
			) {
				// 下游合同、下游合同补充文档、中标佐证
				arr = this.contractInfo.downContract.list;
				changeArr = this.editDownContractList;
			}
			if (items.type == 'ASSET_TRADE_BACKGROUND_CONTRACT') {
				// 贸易背景合同
				arr = this.contractInfo.tradeContract.list;
				changeArr = this.editTradeContractList;
			}
			let index = 0;
			changeArr.forEach((element, _index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					index = _index;
				}
			});
			changeArr.splice(index, 1);
			arr.forEach((element, index) => {
				if (
					element.id == items.id &&
					element.md5Hex == items.md5Hex &&
					element.type == items.type &&
					element.name == items.name
				) {
					element.delFlag = 1;
				}
			});
		},
		getEndTime(value, dateString) {
			// 合同到期日期
			this.baseInfoForm.endTime = dateString;
		},
		getTime(value, dateString) {
			// 合同签订日期
			this.baseInfoForm.contractSignTime = dateString;
		},
		getDoubleTime(value, dateString) {
			// 双签日期
			this.doubleTime = value ? value._d : null;
			this.baseInfoForm.doubleSignTime = dateString;
		},
		validDoubleTime(rule, value, callback) {
			// 验证双签日期
			if (!value) {
				return callback(new Error('请选择合同双签日期'));
			} else {
				const date = new Date();
				if (this.doubleTime > date) {
					return callback(new Error('双签日期不能大于当前日期'));
				}
				return callback();
			}
		},
		onSubmit() {
			// 整体提交

			if (this.editFlag) {
				if (this.$refs.baseInfoForm) {
					this.$refs.baseInfoForm.validate(valid => {
						//提交下游合同基本信息
						this.downContractInfoFlag = valid;
					});
				}
				if (this.$refs.contractDetailForm) {
					this.$refs.contractDetailForm.validate(valid => {
						//提交编辑的下游合同详情
						this.downContractFullFlag = valid;
					});
				}

				if (!this.downContractInfoFlag || !this.downContractFullFlag) return;
			}

			this.contractInfo.businessLineContract = this.businessLineContractVO.map(item => {
				return {
					contractType: item.contractType,
					contractId: item.contractId
				};
			});
			return this.contractInfo;
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	& > div {
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
		.divider {
			background: #f4f5f8;
			height: 1px;
			margin-top: 0;
		}
		.add-other {
			float: right;
			margin-right: 15px;
			margin-top: 8px;
		}
		.content {
			padding: 15px;
			.other-title {
				color: #383a3f;
				margin-bottom: 20px;
			}
			& > div {
				.row {
					height: 59px;
					margin-bottom: 0;
					::v-deep.ant-form-item-label {
						text-align: left;
					}
					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}
					::v-deep.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}
				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}
				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}
				p {
					font-family: PingFangSC-Medium;
					color: #383a3f;
					text-align: left;
					line-height: 18px;
					margin: 15px 0;
				}
				& > .ant-row {
					margin: 15px 0;
					.ant-col .ant-row .ant-col {
						margin-bottom: 3px;
					}
					.ant-col .ant-row .ant-col:first-child {
						color: #6b6f76;
					}
					.ant-col .ant-row .ant-col:last-child {
						color: #383a3f;
					}
				}
			}
		}
	}
	.doubleSign {
		color: #00ae9d !important;
	}
	.singleSign {
		color: #ff9726 !important;
	}
	.red {
		color: #f24e4d !important;
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		float: right;
		display: inline-block;
		margin-right: 15px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
.ant-table td {
	white-space: nowrap;
}
</style>
