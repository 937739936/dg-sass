<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>补充协议</span
				>
				<a-button
					type="primary"
					@click="add"
					v-auth="'steel:contract:supplementAgreement:add'"
				>
					<span style="font-size: 14px">新增补协</span>
				</a-button>
			</div>
			<SlForm
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetFunc"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlForm>
			<div class="tabs-box">
				<Tabs
					:statusData="supplementalAgreementTabDict"
					:tabNum="0"
					initStatus=""
					@callback="onChangeTab"
					ref="Tabs"
				/>
			</div>
			<a-table
				:columns="columns"
				rowKey="id"
				class="new-table"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<span slot="customTitle"> 操作 </span>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<!-- 待提交-- 修改、取消、详情、下载
            审批中-- 详情、下载
            待确认-- 确认、详情、下载
            待签约-- 盖章、详情、下载
            已双签-- 详情、下载
            驳回  -- 详情、下载 -->
					<a
						v-if="record.status === 'DRAFT'"
						v-auth="'steel:contract:supplementAgreement:edit'"
						class="mr8"
						@click="
							jumpPage('/center/steels/suppleAgreement/createTwo', {
								id: record.id,
								contractTemplate: record.contractTemplate,
								contractNo: record.contractNo,
								contractId: record.contractId,
								steelType: record.steelType
							})
						"
						>修改</a
					>
					<a
						v-if="record.isInitiator && record.status === 'WAIT_SIGN_SEAL'"
						v-auth="'steel:contract:supplementAgreement:seal'"
						class="mr8"
						@click="jumpPage('/center/steels/suppleAgreementSign', { id: record.id })"
						>盖章</a
					>

					<a
						v-auth="'steel:contract:supplementAgreement:seal'"
						v-if="!record.isInitiator && record.status === 'WAIT_CONFIRM'"
						class="mr8"
						@click="jumpPage('/center/steels/suppleAgreementSign', { id: record.id })"
					>
						确认</a
					>

					<a
						v-auth="'steel:contract:supplementAgreement:edit'"
						v-if="record.status === 'DRAFT'"
						class="mr8"
						@click="del(record.id)"
						>取消</a
					>

					<a
						v-auth="'steel:contract:supplementAgreement:detail'"
						class="mr8"
						@click="jumpPage('/center/steels/suppleAgreementDetail', { id: record.id, steelType: record.steelType })"
						>详情</a
					>

					<a
						class="mr8"
						@click="down(record)"
						>下载</a
					>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>

		<a-modal
			v-model="visible"
			destroyOnClose
			class="suppleAgreement-list"
			title="下载补充协议"
			@ok="ok"
			@cancel="visible = false"
		>
			<a-radio-group
				:defaultValue="activeValue"
				button-style="solid"
				@change="handleChange"
			>
				<a-radio-button :value="0"> 原合同及历史补协一起下载 </a-radio-button>
				<a-radio-button :value="1"> 仅下载当前补协文件 </a-radio-button>
			</a-radio-group>
		</a-modal>
	</div>
</template>
<script lang="jsx">
import {
	API_SupplementalAgreementList,
	API_SupplementalAgreementSingleFile,
	API_SupplementalAgreementAllFile,
	API_SupplementalAgreementDelete
} from '@/v2/center/steels/api/contract.js';

import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { getPopupContainer } from '@/v2/utils/factory.js';
import comDownload from '@sub/utils/comDownload.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

const columns = [
	{ title: '补充协议编号', dataIndex: 'serialNo' },
	{ title: '状态', dataIndex: 'statusDesc' },
	{ title: '所属合同编号', dataIndex: 'contractNo' },
	{ title: '合同类型', dataIndex: 'contractTypeDesc' },
	{ title: '卖方企业名称', dataIndex: 'sellCompanyName' },
	{ title: '买方企业名称', dataIndex: 'buyCompanyName' },
	{ title: '补协合同编号', dataIndex: 'supplementalAgreementNo', align: 'center' },
	// { title: '下游企业简称', dataIndex: 'downstreamCompanyName' },
	{ title: '补充协议签订日期', dataIndex: 'signDate' },
	{ title: '补充协议创建时间', dataIndex: 'createdDate' },
	{ title: '补充协议创建人', dataIndex: 'createdName' },
	{ title: '生成方式', dataIndex: 'sourceFromDesc' },
	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
import SlForm from '@sub/components/ui-new/Form/sl-form';
import Tabs from '@/v2/center/steels/components/Tabs.vue';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '补充编号',
		type: 'input',
		placeholder: '请输入补充编号',
		allowClear: true
	},
	{
		decorator: ['supplementalAgreementNo'],
		addonBeforeTitle: '补协合同编号',
		type: 'input',
		placeholder: '请输入补协合同编号',
		allowClear: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '所属合同编号',
		type: 'input',
		placeholder: '请输入所属合同编号',
		allowClear: true
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称',
		allowClear: true
	},
	{
		decorator: ['date'],
		addonBeforeTitle: '补协签订日期',
		realKey: ['signStartDate', 'signEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	}
];
export default {
	name: 'SuppleAgreementList',

	components: {
		iPagination,
		SlForm,
		Tabs
	},

	data() {
		return {
			columns,
			colSpan,
			formLayout,
			searchList,
			getPopupContainer,
			supplementalAgreementTabDict: filterSteelsCodeByKey('supplementalAgreementStatus'),
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
			visible: false,
			params: {},
			date: [],
			form: this.$form.createForm(this),
			dataSource: [],
			status: '',
			pagination: { total: 0, pageNo: 1 },
			activeValue: 0,
			loading: false,
			pageSize: 10
		};
	},

	computed: {},

	created() {
		this.supplementalAgreementTabDict.forEach(el => {
			el.value = el.value || '';
		});

		const { serialNo } = this.$route.query;
		this.params.serialNo = serialNo;
		this.getList();
	},

	methods: {
		changeSearch(info) {
			this.params = info;
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetFunc() {
			this.pagination.pageNo = 1;
			this.status = '';
			this.$refs.Tabs.status = '';
		},
		changeDate(value, dateString) {
			this.params.signStartDate = dateString[0];
			this.params.signEndDate = dateString[1];
		},
		previewPdf(data) {
			const { contractNo, contractId, buyCompanyName, sellCompanyName, supplementalAgreementNo } = data;
			this.$router.push({
				path: '/center/contract/detail',
				query: {
					contractNo,
					contractId,
					zipFileName: `${contractNo}-${buyCompanyName}-${sellCompanyName}.zip`,
					no: supplementalAgreementNo
				}
			});
		},
		down(data) {
			this.id = data.id;
			this.curSuppleAgreementData = data;
			this.visible = true;
		},
		del(id) {
			this.$confirm({
				centered: true,
				title: '确认取消该补充协议吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_SupplementalAgreementDelete(id).then(res => {
						if (res.success) {
							this.$message.success('取消成功');
							this.getList();
						}
					});
				}
				// onCancel() {}
			});
		},
		// 下载附件
		async downFile(type) {
			const fn = [API_SupplementalAgreementAllFile, API_SupplementalAgreementSingleFile][type];
			const res = await fn(this.id);
			const { contractNo, sellCompanyName, buyCompanyName, serialNo } = this.curSuppleAgreementData;
			const fileName = [
				`补充协议(${sellCompanyName}-${buyCompanyName})-${contractNo}.zip`,
				`补充协议(${sellCompanyName}-${buyCompanyName})-${serialNo}.pdf`
			];
			comDownload(res, '', fileName[type]);
			this.visible = false;
		},
		ok() {
			// 确定下载附件
			this.downFile(this.activeValue);
			this.visible = false;
		},
		search(e) {
			e.preventDefault();
			this.pagination.pageNo = 1;
			this.getList();
		},
		jumpPage(path, query) {
			this.$router.push({
				path,
				query
			});
		},
		onChangeTab(v) {
			this.status = v;
			this.getList();
		},

		add() {
			// 新增补协
			this.$router.push({
				path: '/center/steels/suppleAgreement/createOne'
			});
		},

		getList(pageNo, pageSize) {
			this.pagination.pageNo = pageNo || this.pagination.pageNo;
			this.pageSize = pageSize;
			this.params.pageNo = this.pagination.pageNo;
			this.params.status = this.status;
			this.params.pageSize = pageSize || 10;
			this.loading = true;
			API_SupplementalAgreementList(this.params)
				.then(res => {
					if (res.success) {
						this.dataSource = res.data.records;
						this.pagination.total = res.data.total;
					} else {
						this.dataSource = [];
						this.pagination.total = 0;
					}
				})
				.catch(() => {
					// this.dataSource = []
					// this.pagination.total = 0
				})
				.finally(() => {
					this.loading = false;
				});
		},

		handleChange(e) {
			this.activeValue = e.target.value;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
::v-deep.ant-calendar-picker {
	width: 100%;
}
.tabs-box {
	margin-bottom: 30px;
}
</style>
