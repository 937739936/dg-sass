<template>
	<div class="wrapper">
		<a-card
			title="签章配置"
			:bordered="false"
		>
			<a-form
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 16 }"
				labelAlign="left"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="行业">
							<a-select
								v-model="params.industryType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<template v-for="item in VUEX_ST_ALLCODE.industryTypeEnum">
									<a-select-option
										v-if="item.value !== 'GRAIN'"
										:key="item.value"
										:value="item.value"
									>
										{{ item.text }}
									</a-select-option>
								</template>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="电子单据">
							<a-input
								v-model="params.docName"
								placeholder="请输入电子单据"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="印模类型">
							<a-select
								v-model="params.sealType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<a-select-option
									v-for="item in sealTypeList"
									:key="item.value"
									:value="item.value"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="印模名称">
							<a-input
								v-model="params.sealName"
								placeholder="请输入印模名称"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						style="float: right; margin-bottom: 24px; text-align: center"
					>
						<a-space
							align="baseline"
							:size="20"
						>
							<a-button
								type="primary"
								class="search-btn"
								@click="searchSubmit"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetValues"
							>
								重置
							</a-button>
						</a-space>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="resultDetail"
				:scroll="{ x: true }"
				rowKey="serialNo"
				:loading="loadingResultDetail"
			>
				<template
					slot="sealType"
					slot-scope="text, record"
				>
					<div
						v-for="(item, index) in record.cfcaSealList"
						:key="index"
						style="height: 28px"
					>
						<td style="line-height: 28px; padding: 0">
							{{ filterCodeByValueName(item.sealType, 'cfca_seal_type') }}
						</td>
						<br />
					</div>
				</template>
				<template
					slot="sealName"
					slot-scope="text, record"
				>
					<div
						v-for="(item, index) in record.cfcaSealList"
						:key="index"
						style="height: 28px"
					>
						<td style="line-height: 28px; padding: 0">
							{{ item.sealName }}
						</td>
						<br />
					</div>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_GetConfigSignatureList } from '@/v2/api/account';
import iPagination from "@sub/components/iPagination";
import { filterCodeByKey, filterCodeByValueName } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory';

const columns = [
	{ title: '行业', dataIndex: 'industryName', key: 'industryName' },
	{ title: '电子单据', dataIndex: 'docName', key: 'docName' },
	{ title: '印模类型', dataIndex: 'sealType', key: 'sealType', scopedSlots: { customRender: 'sealType' } },
	{ title: '印模名称', dataIndex: 'sealName', key: 'sealName', scopedSlots: { customRender: 'sealName' } }
];

export default {
	name: 'ConfigSignature',
	data() {
		return {
			getPopupContainer,
			columns,
			sealTypeList: filterCodeByKey('cfca_seal_type'),
			params: {
				industryType: undefined,
				docName: undefined,
				sealType: undefined,
				sealName: undefined
			},
			resultDetail: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			loadingResultDetail: false,
			filterCodeByValueName: filterCodeByValueName
		};
	},
	components: {
		iPagination
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('pagination', {
			listParmas: 'listParmas',
			pageSize: 'pageSize'
		})
	},
	mounted() {
		this.getList();
	},
	methods: {
		searchSubmit() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 获取列表
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loadingResultDetail = true;
			API_GetConfigSignatureList(this.params)
				.then(res => {
					this.resultDetail = res.data.records;
					this.pagination.total = res.data.total;
				})
				.finally(() => {
					this.loadingResultDetail = false;
				});
		},
		// 重置
		resetValues() {
			(this.params = {
				industryType: undefined,
				docName: undefined,
				sealType: undefined,
				sealName: undefined
			}),
				(this.pagination.pageNo = 1);
			this.getList();
		}
	}
};
</script>
<style lang="less" scoped>
.wrapper {
	background-color: #f4f5f8;
	margin: -10px -20px;
	::v-deep {
		.ant-card-head-title {
			font-size: 16px;
			color: #141517;
			line-height: 24px;
			position: relative;
			padding-left: 10px;
		}
		.ant-card-head-title:before {
			position: absolute;
			content: '';
			display: block;
			width: 2px;
			height: 15px;
			background: @primary-color;
			top: 21px;
			left: 0;
		}
		.ant-table-tbody > tr > td {
			padding: 10px 16px !important;
		}
	}
}
</style>
