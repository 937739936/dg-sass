<template>
	<div class="s-card new-detail">
		<div style="margin-top: 12px">
			<a-form v-bind="formLayout">
				<div class="title"><i class="title_icon"></i>基本信息</div>
				<a-row>
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="资金流水号"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.serialNo"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="回款方式"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.collectionModeDesc"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="收款账号"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.receiveBankCardNo"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="对方户名"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.collectionAccount"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<!-- <a-col :span="colSpan" class="row">
            <a-form-item label="收款方户名" :colon="false">
              <a-input :disabled="disabled" v-model="detailInfo.collectionAccount"> </a-input>
            </a-form-item>
          </a-col> -->
					<!-- <a-col :span="colSpan" class="row">
            <a-form-item label="对方账号" :colon="false">
              <a-input :disabled="disabled" v-model="detailInfo.collectionAccount"> </a-input>
            </a-form-item>
          </a-col> -->
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="收款方开户行"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.receiveBankName"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<!-- <a-col :span="colSpan" class="row">
            <a-form-item label="对方开户行" :colon="false">
              <a-input :disabled="disabled" v-model="detailInfo.collectionAccount"> </a-input>
            </a-form-item>
          </a-col> -->
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="回款金额"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.collectionAmount"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="colSpan"
						class="row"
					>
						<a-form-item
							label="回款时间"
							:colon="false"
						>
							<a-input
								:disabled="disabled"
								v-model="detailInfo.collectionDate"
							>
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isShowGoodsValue="true"
							:columns="attachmentColumns"
							ref="customUpload"
							:isNeedRotate="true"
							:ifEditable="false"
							:fileDataSource="detailInfo.collectionAttachList"
							:type="'pay'"
							:allowFormat="[]"
							:accountingSeal="false"
						/>
					</div>
				</div>
			</a-form>
		</div>

		<div class="claimRecordBox">
			<div class="title"><i class="title_icon"></i>认领历史</div>
			<div class="table-wrap">
				<a-table
					:columns="detailColumns"
					:rowKey="record => record.id"
					:dataSource="detailInfo.oaClaimList"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="action"
						slot-scope="action, items"
					>
						<a
							href="javascript:;"
							@click="getOaCollectionList(items)"
							>使用情况</a
						>
					</template>
				</a-table>
			</div>
			<div
				class="tc"
				style="padding-top: 30px"
			>
				<a-button @click="$router.go(-1)">返回</a-button>
			</div>
		</div>
		<!-- 回款关联提单记录 -->
		<a-modal
			title="回款关联提单记录"
			:visible="visible"
			:footer="null"
			@cancel="
				() => {
					visible = false;
				}
			"
			width="80%"
		>
			<a-table
				:columns="relationColumns"
				:rowKey="record => record.id"
				:dataSource="relationList"
				:pagination="false"
				:scroll="{ x: true }"
			>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
import { collectionDetail, getOaCollectionList } from '@/v2/center/steels/api/funds.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';

import moment from 'moment';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
const attachmentColumns = [
	{ title: '类型', dataIndex: 'typeDesc' },
	{ title: '来源', dataIndex: 'sourceDesc' },
	{ title: '文件名', dataIndex: 'name' },
	{ title: '操作', scopedSlots: { customRender: 'operation' }, fixed: 'right' }
];
const detailColumns = [
	{ title: '序号', customRender: (t, r, index) => parseInt(index) + 1, fixed: 'left' },
	{ title: '认领金额', dataIndex: 'claimAmount' },
	{ title: '提单使用金额', dataIndex: 'takeDeliveryAmount' },
	{ title: '类型', dataIndex: 'fundTypeDesc' },
	{ title: '业务线号', dataIndex: 'businessLineFullNo' },
	{ title: '业务线号名称', dataIndex: 'companyName' },
	{ title: '上游合同编号', dataIndex: 'upContractNo' },
	{ title: '下游合同编号', dataIndex: 'contractNo' },
	{ title: '认领时间', dataIndex: 'createdDate' },
	{ title: '认领人员', dataIndex: 'createdName' },

	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
const relationColumns = [
	{ title: '序号', customRender: (t, r, index) => parseInt(index) + 1, fixed: 'left' },
	{ title: '提单编号', dataIndex: 'takeSerialNo' },
	{ title: '提单状态', dataIndex: 'statusDesc' },
	{ title: '关联回款金额', dataIndex: 'collectionAmount' },
	{ title: '实际使用回款金额', dataIndex: 'purchaseAmount' },
	{ title: '提单发起人', dataIndex: 'createdName' },
	{ title: '提单发起时间', dataIndex: 'createdDate' },
	{ title: '全部实提时间', dataIndex: 'realTakeDate', customRender: text => text || '-' }
];

export default {
	name: 'OaClaimDetail',
	components: {
		CustomUpload
	},
	data() {
		return {
			colSpan,
			formLayout,
			// 详情信息
			detailInfo: {},
			detailColumns,
			attachmentColumns,
			relationColumns,
			relationList: [],
			visible: false
		};
	},
	created() {
		this.disabled = true;
		this.getCollectionDetail();
	},
	methods: {
		async getCollectionDetail() {
			const res = await collectionDetail(this.$route.query.id);
			this.detailInfo = res.data;
			this.detailInfo.collectionAttachList = this.detailInfo.collectionAttachList || [];
			this.detailInfo.collectionAttachList.forEach(el => {
				el.url = el.filePath;
				el.typeName = el.typeDesc;
				el.name = el.fileName;
			});
		},
		// 获取使用情况
		async getOaCollectionList(item) {
			const res = await getOaCollectionList(item);
			this.visible = true;
			this.relationList = res.data;
		}
	}
};
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
	margin-bottom: 0;
}
.title {
	border-bottom: 1px solid #d8d8d8;
	font-size: 18px;
	padding: 14px 0;
	margin-bottom: 30px;

	.title_icon {
		width: 12px;
		height: 16px;
		display: inline-block;
		vertical-align: middle;
		margin: 0 14px;
		background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
	}
}
.fr {
	float: right;
}
.tc {
	text-align: center;
}
h3 {
	font-size: 18px;
	line-height: 30px;
	margin: 0 0 20px 0;
	width: 100%;
}
.row {
	font-size: 16px;
	color: #333;
	padding: 10px 0;
}
.flex-box {
	display: flex;
}
.flex-1 {
	flex: 1;
}
.center {
	align-items: center;
	justify-content: center;
}
.table {
	margin: 15px 8px;
	.cell {
		padding: 0 10px;
		height: 35px;
		line-height: 35px;
	}
}
.border {
	border: 1px solid #eef0f2;
}
.border-right {
	border-right: 1px solid #eef0f2;
}
.border-left {
	border-left: 1px solid #eef0f2;
}
.border-top {
	border-top: 1px solid #eef0f2;
}
.border-bottom {
	border-bottom: 1px solid #eef0f2;
}
.claimInfo {
	background: #fff;
	margin: 15px 0;
	padding: 16px 16px 0 16px;
	& > span {
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #383a3f;
		line-height: 24px;
	}
	& > .ant-btn {
		float: right;
	}
}
.row {
	padding-left: 30px;
	height: 60px;
	.detail-wrapper {
		width: fit-content;
		position: absolute;
		top: 10px;
		right: 0px;
	}
	::v-deep.has-error,
	.has-success {
		.ant-form-explain {
			position: absolute;
		}
	}
}
.formModel {
	margin-top: 20px;
}
.formModel ::v-deep.ant-form-item-label,
.formModel ::v-deep.ant-form-item-control-wrapper {
	text-align: left;
}
.formModel .alignRight ::v-deep.ant-form-item-label {
	text-align: right;
}
.formModel.ant-form .bigText ::v-deep.ant-form-item-label label {
	font-size: 16px;
	font-family: PingFangSC-Medium;
	color: #383a3f;
}
.ant-form-item-label {
	label {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.75);
		width: 84px;
		margin-right: 66px;
		display: inline-block;
		text-align: left;
	}
}
.claimInfo {
	.ant-row {
		line-height: 60px;
		.ant-col {
			text-align: center;
			p {
				line-height: 30px;
			}
			span {
				color: #f24e4d;
				font-size: 24px;
			}
			em {
				font-style: normal;
				color: @primary-color;
			}
		}
	}
}
</style>
