<template>
	<div>
		<!-- 关联价格 -->
		<a-drawer
			class="slDrawer"
			title="选择市场价格"
			placement="right"
			:visible="visible"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				@resetFunc="resetFunc"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="record => record.id"
					:customRow="onClickRow"
					:loading="loading"
				>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="cancel-btn"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						type="primary"
            :disabled="!this.selectedRowKeys.length"
						@click="handleSubmit"
						>确定</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { formatMoney } from '@sub/filters'
import { 
  getPricePage,
  getIndexNameList,
  getIndicatorNameList,
  getLocationGroupList,
  getSourceList,
  saveRelatedPrice
} from '@/v2/center/logisticsPlatform/api/inventory';
import { uniq } from 'lodash'
const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toLowerCase() === input.toLowerCase();
};

const searchList = [
	{
		decorator: ['nameList'],
		addonBeforeTitle: '指数名称',
		type: 'select',
		placeholder: '请选择指数名称',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['indicatorName'],
		addonBeforeTitle: '指标名称',
		type: 'select',
		placeholder: '请选择指标名称',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['sourceList'],
		addonBeforeTitle: '数据来源',
		type: 'select',
		placeholder: '请选择数据来源',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['uniLocationCodeList'],
		addonBeforeTitle: '对应地点',
		type: 'select',
		placeholder: '请选择对应地点',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['updateFrequencyList'],
		addonBeforeTitle: '更新频率',
		type: 'select',
		placeholder: '请选择更新频率',
		options: [
      {value: 'DAY', label: '日更新'},
      {value: 'WEEK', label: '周更新'},
      {value: 'MONTH', label: '月更新'},
    ]
	}
];
const columns = [
  { title: "指数名称", dataIndex: "indexName", key: "indexName", width: 150, },
  { title: "指标名称", dataIndex: "indicatorName", key: "indicatorName", width: 150, },
  { title: "最新日期", dataIndex: "date", key: "date", width: 120,},
  { title: "最新价格（元/吨）", dataIndex: "price", key: "price", width: 160,
		customRender: (txt) => formatMoney(txt) 
	},
  { title: "对应地点", dataIndex: "location", key: "location", width: 120, },
  { title: "更新频率", dataIndex: "updateFrequencyDesc", key: "updateFrequencyDesc", width: 120,  },
  { title: "数据来源", dataIndex: "source", key: "source",  width: 150,},
]
export default {
	name: 'RelatedPrice',
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onChange: record => {
					t.selectedRowKeys = selectedRowKeys;
					t.currentOBj = record
				}
			};
		}
	},
	data() {
		return {
			formatMoney,
			columns,
			searchList,
			selectedRowKeys: [],
			visible: false,
			dataSource: [],
			paginationRelation: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10,
				current: 1,
			},
			loading: false,
			currentOBj: {},
			searchParams: {},
			coalTypeId: '',
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	methods: {
		//外部引用方法打开弹框
		showModal(data) {
      return new Promise(async (resolve) => {
				this.coalTypeId = data.id
        this.visible = true;
        this.selectedRowKeys = [];
				this.currentOBj = {}
				this.paginationRelation.pageNo = 1
				this.paginationRelation.current = 1
        await this.getList();
        await this.getLocationGroupList()
        await this.getSourceList()
        await this.getIndexList()
        await this.getIndicatorNameList()
        resolve(true)
      })
		},
		handleChange(data) {
      this.searchParams = data
      this.paginationRelation.pageNo = 1
			this.paginationRelation.current = 1
      this.getList(this.searchParams)
    },
		resetFunc() {
			this.searchParams = {};
			this.paginationRelation.pageNo =1
			this.paginationRelation.current = 1
			this.getList();
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = this.paginationRelation.pageSize) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.getList(this.searchParams);
		},
    async getList(data){
			this.searchParams = data || {}
			this.loading = true
			const params = {
				...this.searchParams,
				...this.paginationRelation,
				marketIndexType: 'THIRD_PART',
			};
			delete params.showTotal;
			try {
				const res = await getPricePage(params);
				let result = res.result || res.data;
				this.dataSource = uniq(result.records)
				const paginationRelation = {
					total: result.total,
					pageSize: result.size,
					current: result.current,
					pageNo: result.current,
					showTotal: function (total) {
						return `共${total}条记录 第${this.paginationRelation.current}页 `;
					}
				};
				this.paginationRelation = paginationRelation;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
    }, 
    async getLocationGroupList(){
      return getLocationGroupList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const locationList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'uniLocationCodeList') {
              item.options = locationList.map((item) => {
                return { value: item.code, label: item.content};
              })
            }
          })
        }
      })
    },
    async getSourceList(){
      return getSourceList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const sourceList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'sourceList') {
              item.options = sourceList.map((item) => {
                return { value: item, label: item};
              })
            }
          })
        }
      })
    },
    async getIndicatorNameList(){
      return getIndicatorNameList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const zbmcList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'indicatorName') {
              item.options = zbmcList.map((item) => {
                return { value: item, label: item};
              })
            }
          })
        }
      })
    },
    async getIndexList(){
      return getIndexNameList({marketIndexType: 'THIRD_PART'}).then(res=>{
        if(res.success){
          const zsmcList = uniq(res.data)
          this.searchList.forEach(item=>{
            if (item.decorator[0] === 'nameList') {
              item.options = zsmcList.map((item) => {
                return { value: item, label: item};
              })
            }
          })
        }
      })
    },
		onClickRow(record) {
			return {
				on: {
					click: () => {
            this.selectedRowKeys = [record.id]
						this.currentOBj = record
					}
				}
			};
		},
		handleSubmit() {
      const { indicatorName, indexName } = this.currentOBj
			saveRelatedPrice({
				coalTypeId: this.coalTypeId,
        indicatorId: this.currentOBj.id || this.currentOBj.indicatorId,
        indicatorName,
        indexName
      }).then(res => {
        if (res.success) {
          this.$message.success('关联成功')
          this.visible = false
          this.$emit('updateFunc')
        }
      })
		},
		onClose() {
			this.visible = false;
			this.selectedRowKeys = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.table-box {
	margin-top: 20px;
}
.slModal {
	::v-deep.ant-modal-body {
		padding-top: 10px;
	}
}
</style>
