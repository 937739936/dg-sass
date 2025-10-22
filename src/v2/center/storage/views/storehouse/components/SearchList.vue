<template>
	<a-card :bordered="false">
		<a-form
			v-bind="formLayout"
			class="search-form-wrapper"
		>
			<a-row :gutter="rowGutter">
				<a-col :span="colSpan">
					<a-form-item label="库点名称">
						<a-select
							placeholder="请选择"
							v-model="queryParam.pointName"
							:options="[]"
						></a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item label="工作人员">
						<a-select
							placeholder="请选择"
							v-model="queryParam.workername"
							:options="[]"
						></a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item label="钥匙名称">
						<a-input
							placeholder="请输入"
							v-model="queryParam.keyname"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item label="钥匙号码">
						<a-input
							placeholder="请输入"
							v-model="queryParam.keyno"
						/>
					</a-form-item>
				</a-col>
				<template v-if="+type === 2">
					<a-col :span="colSpan">
						<a-form-item label="锁具名称">
							<a-input
								placeholder="请输入"
								v-model="queryParam.lockname"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="colSpan">
						<a-form-item label="操作类型">
							<a-select
								placeholder="请选择"
								v-model="queryParam.opttype"
								:options="[
									{ label: '全部', value: '1' },
									{ label: '开锁', value: '2' },
									{ label: '关锁', value: '3' }
								]"
							>
							</a-select>
						</a-form-item>
					</a-col>
				</template>
				<a-col
					:span="colSpan"
					v-if="+type === 1"
				>
					<a-form-item label="操作类型">
						<a-select
							placeholder="请选择"
							v-model="queryParam.opttype"
							:options="[
								{ label: '全部', value: '1' },
								{ label: '领出', value: '2' },
								{ label: '归还', value: '3' }
							]"
						>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-form-item label="日期">
						<a-range-picker
							v-model="date"
							@change="formatDate"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="colSpan">
					<a-space>
						<a-button
							type="primary"
							@click="searchQuery"
							icon="search"
							>查询</a-button
						>
						<a-button
							type="primary"
							@click="searchReset"
							icon="reload"
							>重置</a-button
						>
					</a-space>
				</a-col>
			</a-row>
		</a-form>
		<a-table
			class="mt8"
			rowKey="workerid"
			:columns="columns"
			:data-source="dataSource"
			:scroll="{ x: true }"
			:pagination="ipagination"
			@change="handleTableChange"
		>
		</a-table>
	</a-card>
</template>
<script lang="jsx">
import { rowGutter, colSpan, formLayout } from '@/v2/config/layoutConfig';

const keyColumns = [
	{ title: '钥匙号码', dataIndex: 'keyno' },
	{ title: '钥匙名称', dataIndex: 'keyname' },
	{ title: '所属企业？？？', dataIndex: 'coreCompanyName' },
	{ title: '使用人？？？', dataIndex: 'tel' },
	{ title: '操作类型', dataIndex: 'opttype', customRender: text => ['开锁', '关锁'][text] },
	{ title: '操作人???', dataIndex: 'pushTime', customRender: text => text && text.join(',') },
	{ title: '操作时间', dataIndex: 'opttime' },
	{ title: '状态？？？', dataIndex: 'pushTime', customRender: text => text && text.join(',') },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const lockColumns = [
	{ title: '锁具名称', dataIndex: 'lockname' },
	{ title: '钥匙名称', dataIndex: 'keyname' },
	{ title: '库点名称', dataIndex: 'pointName' },
	{ title: '使用人？？？', dataIndex: 'tel' },
	{ title: '操作类型', dataIndex: 'opttype' },
	{ title: '操作时间', dataIndex: 'opttime' }
];
const lossColumns = [
	{ title: '钥匙名称', dataIndex: 'keyname' },
	{ title: '库点名称', dataIndex: 'pointName' },
	{ title: '使用人？？？', dataIndex: 'pointName111' },
	{ title: '领出时间？？？', dataIndex: 'tel' },
	{ title: '丢失时间？？？', dataIndex: 'updatetime' },
	{ title: '操作人？？？', dataIndex: 'updatetime' }
];
export default {
	name: 'SearchList',

	props: {
		type: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			columns: [keyColumns, lockColumns, lossColumns][this.type - 1],
			colSpan,
			rowGutter,
			formLayout,
			selectedRowKeys: [],
			date: [],
			dataSource: [
				{
					workername: '王武',
					appusername: '王武',
					updatetime: '2022-01-07 13:09:54',
					workerid: 1,
					createtime: '2022-01-05 17:19:50',
					fingerprint: '',
					apppwd: '123',
					keylist: [
						{
							keyname: '测试钥匙'
						},
						{
							keyname: '测试钥匙'
						}
					],
					dept: {
						remark: '',
						deptname: '444',
						deptid: 6,
						children: [],
						sequence: '6-5-1',
						deptcode: '001002001',
						deptpwd: '3219B8',
						createtime: '2022-01-05 16:57:10',
						parentid: 5,
						updatetime: '2022-01-05 16:57:10'
					},
					approved: 1,
					ismanager: 0,
					address: '',
					gender: 0,
					fingerlist: [],
					platform: 0,
					token:
						'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VydHlwZSI6MSwiZXhwIjoxNjQxNDYzOTYwLCJ1c2VyaWQiOjEsInVzZXJuYW1lIjoiMTExIn0.Mq0d2r-CaN_3dXIWti-J180-hIK2Xh6IaNdIXJqY0v8',
					tel: '111',
					glat: 0,
					pointId: 1,
					pointName: '库点名称',
					coreCompanyId: 1,
					coreCompanyUscc: 'coreCompanyUscc',
					coreCompanyName: 'coreCompanyName'
				},
				{
					workername: '王武',
					appusername: '王武',
					updatetime: '2022-01-07 13:09:54',
					workerid: 2,
					createtime: '2022-01-05 17:19:50',
					fingerprint: '',
					apppwd: '123',
					keylist: [
						{
							keyname: '测试钥匙'
						},
						{
							keyname: '测试钥匙'
						}
					],
					dept: {
						remark: '',
						deptname: '444',
						deptid: 6,
						children: [],
						sequence: '6-5-1',
						deptcode: '001002001',
						deptpwd: '3219B8',
						createtime: '2022-01-05 16:57:10',
						parentid: 5,
						updatetime: '2022-01-05 16:57:10'
					},
					approved: 1,
					ismanager: 0,
					address: '',
					gender: 0,
					fingerlist: [],
					platform: 0,
					token:
						'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VydHlwZSI6MSwiZXhwIjoxNjQxNDYzOTYwLCJ1c2VyaWQiOjEsInVzZXJuYW1lIjoiMTExIn0.Mq0d2r-CaN_3dXIWti-J180-hIK2Xh6IaNdIXJqY0v8',
					tel: '111',
					glat: 0,
					pointId: 1,
					pointName: '库点名称',
					coreCompanyId: 1,
					coreCompanyUscc: 'coreCompanyUscc',
					coreCompanyName: 'coreCompanyName'
				},
				{
					workername: '王武',
					appusername: '王武',
					updatetime: '2022-01-07 13:09:54',
					workerid: 3,
					createtime: '2022-01-05 17:19:50',
					fingerprint: '',
					apppwd: '123',
					keylist: [
						{
							keyname: '测试钥匙'
						},
						{
							keyname: '测试钥匙'
						}
					],
					dept: {
						remark: '',
						deptname: '444',
						deptid: 6,
						children: [],
						sequence: '6-5-1',
						deptcode: '001002001',
						deptpwd: '3219B8',
						createtime: '2022-01-05 16:57:10',
						parentid: 5,
						updatetime: '2022-01-05 16:57:10'
					},
					approved: 1,
					ismanager: 0,
					address: '',
					gender: 0,
					fingerlist: [],
					platform: 0,
					token:
						'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VydHlwZSI6MSwiZXhwIjoxNjQxNDYzOTYwLCJ1c2VyaWQiOjEsInVzZXJuYW1lIjoiMTExIn0.Mq0d2r-CaN_3dXIWti-J180-hIK2Xh6IaNdIXJqY0v8',
					tel: '111',
					glat: 0,
					pointId: 1,
					pointName: '库点名称',
					coreCompanyId: 1,
					coreCompanyUscc: 'coreCompanyUscc',
					coreCompanyName: 'coreCompanyName'
				}
			],
			url: {
				list: ['/dg-grain-api/lock/getKeydatas', '/dg-grain-api/lock/getLockdatas', '/dg-grain-api/lock/getLockdatas'][this.type]
			}
		};
	},
	methods: {
		formatDate(value, dateString) {
			this.queryParam.begintime = dateString[0];
			this.queryParam.endtime = dateString[1];
		},
		// operation(id, type) {
		//   this.$confirm({
		//     centered: true,
		//     title: ['通过后钥匙权限被领出，请确认是否通过', '请确认是否拒绝'][type],
		//     // content: '',
		//     okText: '确定',
		//     cancelText: '取消',
		//     icon: () => {
		//       return <a-icon type="exclamation-circle" theme="filled" />
		//     },
		//     onOk: () => {
		//       API_SupplementalAgreementSubmit({ id }).then((res) => {
		//         if (res.success && res.data) {
		//           this.$message.success('操作成功');
		//         }
		//       })
		//     },
		//     // onCancel:
		//   })

		// },
		del() {},
		searchReset() {
			this.queryParam = {};
			this.data = [];
			this.loadData(1);
		}
	}
};
</script>
