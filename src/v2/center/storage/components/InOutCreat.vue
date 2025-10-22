<template>
	<div class="slMain mt-10 wrapper">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>{{ page === 'creat' ? '编辑' : '查看' }}</span
				>
				<a-button
					class="op"
					ghost
					@click="$router.go(-1)"
					type="primary"
				>
					返回
				</a-button>
			</div>
			<div class="item block-wrapper">
				<p class="title">基本信息</p>
				<a-row>
					<a-col :span="8">
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">{{ typeName[type] }}流水号</div>
							<div class="value">
								{{ goodsInfo.baseInfo.serialNumber }}
							</div>
						</a-col>
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">库点</div>
							<div class="value">
								{{ goodsInfo.baseInfo.depotPoint }}
							</div>
						</a-col>
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">仓房</div>
							<div class="value">
								{{ goodsInfo.baseInfo.storehouse }}
							</div>
						</a-col>
					</a-col>
					<a-col :span="8">
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">{{ typeName[type] }}日期</div>
							<div class="value">
								{{ baseInfoStorageTime }}
							</div>
						</a-col>
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">仓储企业</div>
							<div class="value">
								{{ goodsInfo.baseInfo.storageCompany }}
							</div>
						</a-col>
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">权属企业</div>
							<div class="value">
								{{ goodsInfo.baseInfo.coreCompany }}
							</div>
						</a-col>
					</a-col>
					<a-col :span="8">
						<template v-if="type == 'out'">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">粮食品种</div>
								<div class="value">
									{{ goodsInfo.baseInfo.grainName }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">粮食等级</div>
								<div class="value">
									{{ goodsInfo.baseInfo.grainLevel }}
								</div>
							</a-col>
						</template>

						<template v-if="type == 'in'">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">售粮人（企业）</div>
								<div class="value">
									{{ goodsInfo.baseInfo.grainSeller }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">粮食产地</div>
								<div class="value">
									{{ goodsInfo.baseInfo.grainAddress }}
								</div>
							</a-col>
						</template>
						<a-col
							:span="24"
							class="flex-box"
						>
							<div class="name">收获年份</div>
							<div class="value">
								{{ goodsInfo.baseInfo.yearOfHarvest }}
							</div>
						</a-col>
					</a-col>
				</a-row>
			</div>
			<div class="block-wrapper">
				<div class="item">
					<p class="title">车辆信息</p>
					<a-row>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">车牌号</div>
								<div class="value">
									{{ goodsInfo.carInfo.licensePlate }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">承运人</div>
								<div class="value">
									{{ goodsInfo.carInfo.driver }}
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">承运人身份证号码</div>
								<div class="value">
									{{ goodsInfo.carInfo.driverIdCard }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">联系电话</div>
								<div class="value">
									{{ goodsInfo.carInfo.driverPhone }}
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">车辆入库时间</div>
								<div class="value">
									{{ goodsInfo.carInfo.carInTime }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">车辆出库时间</div>
								<div class="value">
									{{ goodsInfo.carInfo.carOutTime }}
								</div>
							</a-col>
						</a-col>
					</a-row>
				</div>
			</div>
			<div
				class="block-wrapper"
				v-if="type == 'in'"
			>
				<div class="item">
					<a-row
						type="flex"
						justify="space-between"
					>
						<p class="title">质检信息</p>
					</a-row>
					<a-row>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">质检单号</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.number }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">粮食品种</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.grainName }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">粮食等级</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.grainLevel }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">检验结果</div>
								<div class="value">
									<em class="g">合格</em>
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">检验员</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.inspector }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">检验时间</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.inspectionTime }}
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.moisture"
							>
								<div class="name">水分</div>
								<div class="value">{{ goodsInfo.qualityTesting.moisture }} %</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.impurities"
							>
								<div class="name">杂质</div>
								<div class="value">{{ goodsInfo.qualityTesting.impurities }} %</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="type == 'in' && goodsInfo.qualityTesting.bulkDensity"
							>
								<div class="name">容重</div>
								<div class="value">{{ goodsInfo.qualityTesting.bulkDensity }} g/L</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.imperfectGrain"
							>
								<div class="name">不完善颗粒</div>
								<div class="value">{{ goodsInfo.qualityTesting.imperfectGrain }} %</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.nivalenol"
							>
								<div class="name">脱氧雪腐镰刀菌烯醇</div>
								<div class="value">{{ goodsInfo.qualityTesting.nivalenol }} μg/kg</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.zearalmone"
							>
								<div class="name">玉米赤霉烯酮</div>
								<div class="value">{{ goodsInfo.qualityTesting.zearalmone }} μg/kg</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.qualityTesting.colorSmell"
							>
								<div class="name">色泽气味</div>
								<div class="value">
									{{ goodsInfo.qualityTesting.colorSmell }}
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">扣水</div>
								<div class="value">{{ goodsInfo.qualityTesting.deductMoisture }} %</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">扣杂</div>
								<div class="value">{{ goodsInfo.qualityTesting.deductImpurity }} %</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">质检扣重</div>
								<div class="value">
									<em class="r">{{ goodsInfo.qualityTesting.checkBuckle }}</em> %
								</div>
							</a-col>
						</a-col>
					</a-row>
				</div>
			</div>

			<div class="block-wrapper">
				<div class="item">
					<p class="title">过磅信息</p>
					<a-row>
						<a-col :span="8">
							<template v-if="type == 'in'">
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重</div>
									<div class="value">{{ goodsInfo.weighInfo.grossWeight }} KG</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重称重时间</div>
									<div class="value">
										{{ goodsInfo.weighInfo.grossWeightTime }}
									</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重司磅员</div>
									<div class="value">
										{{ goodsInfo.weighInfo.grossWeightInspector }}
									</div>
								</a-col>
							</template>
							<template v-if="type == 'out'">
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重</div>
									<div class="value">{{ goodsInfo.weighInfo.tareWeight }} KG</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重称重时间</div>
									<div class="value">
										{{ goodsInfo.weighInfo.tareWeightTime }}
									</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重司磅员</div>
									<div class="value">
										{{ goodsInfo.weighInfo.tareWeightInspector }}
									</div>
								</a-col>
							</template>
						</a-col>
						<a-col :span="8">
							<template v-if="type == 'in'">
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重</div>
									<div class="value">{{ goodsInfo.weighInfo.tareWeight }} KG</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重称重时间</div>
									<div class="value">
										{{ goodsInfo.weighInfo.tareWeightTime }}
									</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">皮重司磅员</div>
									<div class="value">
										{{ goodsInfo.weighInfo.tareWeightInspector }}
									</div>
								</a-col>
							</template>
							<template v-if="type == 'out'">
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重</div>
									<div class="value">{{ goodsInfo.weighInfo.grossWeight }} KG</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重称重时间</div>
									<div class="value">
										{{ goodsInfo.weighInfo.grossWeightTime }}
									</div>
								</a-col>
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">毛重司磅员</div>
									<div class="value">
										{{ goodsInfo.weighInfo.grossWeightInspector }}
									</div>
								</a-col>
							</template>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">净重</div>
								<div class="value">{{ goodsInfo.weighInfo.netWeight }} KG</div>
							</a-col>

							<template v-if="type == 'in'">
								<a-col
									:span="24"
									class="flex-box"
								>
									<div class="name">现场扣重</div>
									<div class="value">
										<em class="r">{{ goodsInfo.weighInfo.buckleHeavy }}</em> KG
									</div>
								</a-col>
							</template>
						</a-col>
					</a-row>
				</div>
			</div>

			<div class="block-wrapper info">
				<div class="item">
					<p class="title">监拍图片</p>
					<a-row
						type="flex"
						justify="start"
					>
						<template v-if="goodsInfo.watchPictures && goodsInfo.watchPictures.length > 0">
							<a-col
								v-for="(item, index) in goodsInfo.watchPictures"
								:key="item.imgUrl"
							>
								<img
									v-viewer
									:src="item.imgUrl"
								/>
								<a-row
									style="width: 240px"
									type="flex"
									justify="space-between"
								>
									<a-col class="des">
										{{ item.type }}
									</a-col>
									<a-col class="time">
										{{ item.shootingTime }}
										<!-- moment(new Date()).format('YYYY-MM-DD') -->
									</a-col>
								</a-row>
							</a-col>
						</template>
						<div
							class="tc"
							style="min-height: 50px; line-height: 50px; width: 100%"
							v-else
						>
							暂无监控图片
						</div>
					</a-row>
				</div>
			</div>

			<div
				class="block-wrapper"
				v-if="type == 'in'"
			>
				<div class="item">
					<a-row
						type="flex"
						justify="space-between"
					>
						<p class="title">结算信息</p>
					</a-row>
					<a-row>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算单号</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.number }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算数量</div>
								<div class="value">
									<em class="r">
										{{ goodsInfo.settlementInfo.clearingWeight && goodsInfo.settlementInfo.clearingWeight.toLocaleString() }}
									</em>
									KG
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算单价</div>
								<div class="value">
									<em class="r">
										{{
											goodsInfo.settlementInfo.clearingUnitPrice && goodsInfo.settlementInfo.clearingUnitPrice.toLocaleString()
										}}
									</em>
									元/KG
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算金额</div>
								<div class="value">
									<em class="r">
										{{ goodsInfo.settlementInfo.clearingPrice && goodsInfo.settlementInfo.clearingPrice.toLocaleString() }}
									</em>
									元
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算方式</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.clearingForm }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">结算人员</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.clearingPersonnel }}
								</div>
							</a-col>
						</a-col>
						<a-col :span="8">
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">收款人</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.payee }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
							>
								<div class="name">收款人账号</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.payeeBankAccount }}
								</div>
							</a-col>
							<a-col
								:span="24"
								class="flex-box"
								v-if="goodsInfo.settlementInfo.clearingForm == '转账'"
							>
								<div class="name">收款账号开户行</div>
								<div class="value">
									{{ goodsInfo.settlementInfo.payeeBank }}
								</div>
							</a-col>
						</a-col>
					</a-row>
				</div>
			</div>

			<div class="block-wrapper">
				<p class="title">附件信息</p>
				<a-form
					:form="form"
					layout="inline"
					v-if="page == 'creat'"
					style="padding-bottom: 10px"
				>
					<a-row type="flex">
						<a-col
							:span="4"
							v-if="type == 'in'"
						>
							<a-form-item
								:label="false"
								:colon="false"
							>
								<i-upload
									:data="{ source: 'GRAIN' }"
									:accept="accept"
									:action="action"
									:size="50"
									v-decorator="[uploadKeyList[0]]"
									v-on:upload="file => setFileList(file, 'q')"
									title="上传质检凭证"
									:showDesc="false"
									buttonType="primary"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="4">
							<a-form-item
								:label="false"
								:colon="false"
							>
								<i-upload
									:accept="accept"
									:action="action"
									:size="50"
									v-decorator="[uploadKeyList[1]]"
									v-on:upload="file => setFileList(file, 's')"
									title="上传结算单"
									:showDesc="false"
									buttonType="primary"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="4"
							v-if="type == 'in'"
						>
							<a-form-item
								:label="false"
								:colon="false"
							>
								<i-upload
									:accept="accept"
									:action="action"
									:size="50"
									v-decorator="[uploadKeyList[2]]"
									v-on:upload="file => setFileList(file, 'b')"
									title="上传采购发票"
									:showDesc="false"
									buttonType="primary"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="10">
							<span class="upload-text">单个文件最大支持50M，支持多个上传</span>
						</a-col>
					</a-row>
				</a-form>
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.path"
					:dataSource="goodsInfo.attachments"
					:pagination="false"
				>
					<template
						slot="originalFileName"
						slot-scope="text, record"
					>
						<a @click="handlePreview(record.path)">{{ text }}</a>
					</template>
					<span slot="customTitle"> 操作 </span>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<a
							style="margin-right: 10px"
							@click="del(item)"
							>删除</a
						>
					</div>
					<div
						slot="actionDetail"
						slot-scope="action, record"
					>
						<a
							style="margin-right: 10px"
							@click="handlePreview(record.path)"
							>查看</a
						>
						<a
							style="margin-right: 10px"
							@click="downPdf(record.path, 'pdf')"
							>下载</a
						>
					</div>
				</a-table>

				<a-row
					type="flex"
					justify="center"
					v-if="page == 'creat'"
					style="margin-top: 20px"
				>
					<a-button
						style="margin-right: 22px; width: 104px; height: 28px"
						@click="$router.go(-1)"
						type="primary"
						ghost
					>
						取消
					</a-button>
					<a-button
						style="width: 104px; height: 28px"
						type="primary"
						:disabled="loading"
						@click="save"
					>
						确定
					</a-button>
				</a-row>
			</div>
			<div
				class="block-wrapper"
				v-auth="'warehouse:putManage:edit'"
			>
				<p class="title">数据记录</p>

				<a-table
					class="new-table"
					:columns="columnsData"
					:rowKey="record => record.path"
					:dataSource="goodsInfo.modifyLogs"
					:pagination="false"
				>
					<template
						slot="fileList"
						slot-scope="text, record"
					>
						<div
							v-for="(item, index) in record.fileList"
							:key="index"
						>
							<a @click="handlePreview(item.path)">{{ item.name }}</a>
						</div>
					</template>
				</a-table>
			</div>
			<img
				:src="previewImg"
				style="display: none"
				ref="viewer"
				v-viewer
			/>
			<image-viewer ref="imageViewer" />
		</a-card>
	</div>
</template>

<script lang="jsx">
import {
	API_UPLOAD_GRAIN,
	API_WarehousePutDetail,
	API_WarehouseOutDetail,
	API_WarehousePutAttachmentSave,
	API_WarehousePutAttachmentDel,
	API_WarehouseOutAttachmentSave,
	API_WarehouseOutAttachmentDel,
	API_DOWNLPREVIEWTE
} from '@/v2/center/storage/api';
import { handleUploadChange, beforeUpload } from '@/v2/utils/factory';
import moment from 'moment';
import comDownload from '@sub/utils/comDownload.js';
import iUpload from '@/v2/components/upload.vue';
import cloneDeep from 'lodash/cloneDeep';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer';

const columns = [
	{
		title: '单据类型',
		fixed: 'left',
		dataIndex: 'typeName',
		width: 120
	},
	{
		title: '文件名',
		dataIndex: 'originalFileName',
		scopedSlots: { customRender: 'originalFileName' },
		width: 135
	}
];
const columnsData = [
	{
		title: '时间',
		fixed: 'left',
		dataIndex: 'modifyTime'
	},
	{
		title: '数据记录',
		dataIndex: 'type'
	},
	{
		title: '附件',
		dataIndex: 'fileList',
		scopedSlots: { customRender: 'fileList' }
	}
];

export default {
	name: 'InOutCreat',

	props: {
		type: {
			type: String,
			default: 'in'
		},
		page: {
			type: String,
			default: 'creat'
		}
	},

	components: {
		iUpload,
		imageViewer
	},

	data() {
		return {
			moment,
			columns,
			columnsData,
			typeName: {
				in: '入库',
				out: '出库'
			},
			attachmentsNew: [],
			colSpan: 8,
			id: '',
			loading: false,
			formLayout: {
				labelCol: {
					span: 7
				},
				wrapperCol: {
					span: 15
				}
			},
			uploadKeyList: ['q', 's', 'b'],
			attachmentTypeList: {
				q: {
					text: '质检凭证',
					value: 'QUALITY_INSPECTION_CERTIFICATE'
				},
				s: {
					text: '结算单',
					value: 'STATEMENT'
				},
				b: {
					text: '采购发票',
					value: 'BUY_INVOICE'
				}
			},
			dataSource: [],
			form: this.$form.createForm(this),
			action: API_UPLOAD_GRAIN,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			previewImg: '',
			goodsInfo: {
				baseInfo: {},
				carInfo: {
					licensePlate: ''
				},
				qualityTesting: {},
				weighInfo: {},
				watchPictures: [],
				settlementInfo: {},
				attachments: []
			},
			loadingq: false,
			loadings: false,
			loadingb: false
		};
	},

	computed: {
		// goodsInfo.baseInfo.storageTime.slice(0,10)
		baseInfoStorageTime() {
			return this.goodsInfo.baseInfo?.storageTime?.slice(0, 10);
		}
	},

	created() {
		// 设置上传相关字段及方法
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[`loading${item}`] = false;
			this[`handleChange${item}`] = info => {
				if (info.file.size / 1024 / 1024 >= 50) {
					return;
				}
				this[`loading${item}`] = true;
				handleUploadChange.call(this, info, item, this.setAttachments);
			};
			this[item] = item;
		});
		this.id = this.$route.query.id;
		this.getDetail();
		if (this.page == 'creat') {
			this.columns = [
				...this.columns,
				{
					key: 'action',
					slots: { title: 'customTitle' },
					width: 120,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			];
		}
		if (this.page == 'detail') {
			this.columns = [
				...this.columns,
				{
					key: 'actionDetail',
					slots: { title: 'customTitle' },
					width: 120,
					fixed: 'right',
					scopedSlots: { customRender: 'actionDetail' }
				}
			];
		}
	},

	methods: {
		setFileList(file, type) {
			const fileItem = file.filter(item => item.status == 'done')[file.length - 1];
			if (!fileItem) return;
			let fileObj = {
				originalFileName: fileItem.fileName,
				typeName: this.attachmentTypeList[type].text,
				type: this.attachmentTypeList[type].value,
				path: fileItem.url,
				md5Hex: fileItem.md5Hex
			};
			let cloneObj = cloneDeep(this.goodsInfo);
			cloneObj.attachments.push(fileObj);
			this.attachmentsNew.push(fileObj);
			this.goodsInfo = cloneObj;
		},
		handlePreview(url) {
			this.previewImg = url;
			filePreview(this.previewImg, this.$refs.imageViewer.show);
		},

		getDetail() {
			const func = this.type == 'in' ? API_WarehousePutDetail : API_WarehouseOutDetail;
			func(this.id).then(res => {
				if (res.success) {
					res.data.mzPic = [];
					res.data.pzPic = [];
					res.data.watchPictures.map(item => {
						if (item.type == '毛重过磅') {
							res.data.mzPic.push(item);
						}
						if (item.type == '皮重过磅') {
							res.data.pzPic.push(item);
						}
					});
					res.data.watchPictures = [];
					res.data.mzPic.map((item, index) => {
						res.data.watchPictures.push({ ...item, type: `${item.type}${index + 1}` });
					});
					res.data.pzPic.map((item, index) => {
						res.data.watchPictures.push({ ...item, type: `${item.type}${index + 1}` });
					});
					this.goodsInfo = {
						...this.goodsInfo,
						...res.data
					};
				}
			});
		},

		setAttachments(info, type) {
			this[`loading${type}`] = false;
			if (!info) {
				return;
			}
			const file = {
				typeName: this.attachmentTypeList[type].text,
				type: this.attachmentTypeList[type].value,
				path: info.file.response.data.fileUrl,
				originalFileName: info.file.name,
				md5Hex: info.file.response.data.md5Hex
				// convertFileName: info.file.response.result.convertFileName,
			};
			this.attachmentsNew = [...this.attachmentsNew, file];
			this.goodsInfo.attachments = [...this.goodsInfo.attachments, file];
		},

		del(data) {
			this.$confirm({
				closable: true,
				content: '确定要删除吗？',
				okText: '确认',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.toDel(data);
				},
				cancelText: '取消',
				onCancel() {}
			});
		},

		toDel(data) {
			const del = () => {
				if (this.goodsInfo.attachments.findIndex(item => item.path === data.path) >= 0) {
					this.goodsInfo.attachments.splice(
						this.goodsInfo.attachments.findIndex(item => item.path === data.path),
						1
					);
				}
				if (this.attachmentsNew.findIndex(item => item.path === data.path) >= 0) {
					this.attachmentsNew.splice(
						this.attachmentsNew.findIndex(item => item.path === data.path),
						1
					);
				}
			};
			if (data.convertFileName) {
				const func = this.type == 'in' ? API_WarehousePutAttachmentDel : API_WarehouseOutAttachmentDel;
				func(data.fileId).then(res => {
					if (res.success) {
						this.$message.success('删除成功');
						del();
					}
				});
			} else {
				del();
			}
		},

		beforeUpload(file) {
			return beforeUpload(file, 50);
		},

		save() {
			if (this.loadings || this.loadingb || this.loadingq) {
				this.$message.warning('请等待文件上传完成');
				return;
			}
			if (this.attachmentsNew.length <= 0) {
				this.$message.success('提交成功');
				this.$router.go(-1);
				return;
			}
			const files = this.attachmentsNew.map(item => {
				return {
					name: item.originalFileName,
					type: item.type,
					path: item.path,
					md5Hex: item.md5Hex
				};
			});
			const params = {
				warehousId: this.id,
				files
			};
			this.loading = true;
			const func = this.type == 'in' ? API_WarehousePutAttachmentSave : API_WarehouseOutAttachmentSave;
			func(params)
				.then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.$router.go(-1);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 下载
		downPdf(path) {
			let url = path;
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep {
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
}

.wrapper {
	background-color: rgb(244, 245, 248);
	.title {
		text-align: left;
		color: #383a3f;
	}
	.item {
		.name {
			width: 80px;
			text-align: left;
		}
		background: #ffffff;
		.title {
			margin-bottom: 10px;
			padding-bottom: 0;
		}
		img {
			width: 240px;
			height: 150px;
			margin-right: 20px;
			margin-top: 15px;
			margin-bottom: 5px;
			border-radius: 8px;
			cursor: pointer;
		}
	}
	p {
		color: #383a3f;
		line-height: 20px;
		font-weight: 600;
		font-size: 14px;
	}
	.flex-box {
		display: flex;
		margin-top: 10px;
		> div {
			width: calc(100% - 80px);
			padding-right: 10px;
			color: #6b6f76;
			line-height: 18px;
		}
		.name {
			width: 150px;
			text-align: left;
		}
		.value {
			color: #383a3f;
			span {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				letter-spacing: 0;
			}
		}
	}

	.block-wrapper {
		background: #ffffff;
		padding: 20px 0;
		& > .title {
			margin-bottom: 20px;
		}
		.des {
			color: #383a3f;
		}
		.time {
			font-size: 10px;
			color: #9ba0aa;
		}
		.r {
			color: #f24e4d;
		}
		.g {
			color: #00ae9d;
		}
		.upload-text {
			line-height: 40px;
			font-size: 10px;
			color: #9ba0aa;
		}
	}
}
</style>
