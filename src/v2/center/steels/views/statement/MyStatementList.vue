<template>
	<div class="my-invoice-list">
		<div class="s-title">
			<span>我的报表</span>
			<div v-if="isCheckWhether">
				<a-dropdown>
					<a-button
						type="primary"
						style="margin-right: 20px"
						@click="e => e.preventDefault()"
					>
						<span style="font-size: 14px"> 新增报表 </span>
					</a-button>
					<a-menu slot="overlay">
						<a-menu-item style="border-bottom: 1px solid #eeeeee">
							<a
								href="javascript:;"
								@click="add('FILE')"
							>
								<img
									src="~/assets/imgs/statement/file.png"
									alt=""
									style="width: 20px; margin-right: 8px"
								/>
								表格
							</a>
						</a-menu-item>
						<a-menu-item>
							<a
								href="javascript:;"
								@click="add('FOLDER')"
							>
								<img
									src="~/assets/imgs/statement/folder.png"
									alt=""
									style="width: 20px; margin-right: 8px"
								/>
								文件夹
							</a>
						</a-menu-item>
					</a-menu>
				</a-dropdown>
				<a-upload
					name="file"
					:action="action"
					:accept="accept"
					:beforeUpload="beforeUpload"
					:headers="headers"
					:data="{ parentId: barList.length ? barList[barList.length - 1].fileId : '' }"
					:showUploadList="false"
					@change="handleChange"
				>
					<a-button
						ghost
						type="primary"
					>
						<span style="font-size: 14px">导入</span></a-button
					>
				</a-upload>
			</div>
		</div>
		<a-form
			v-if="isCheckWhether"
			layout="inline"
			style="margin-top: 15px"
			v-bind="formLayout"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item
						label="文件名称"
						:colon="false"
					>
						<a-input
							v-model="params.fileName"
							placeholder="请输入"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label=" "
						class="order-wrap"
						:colon="false"
					>
						<a-button
							type="primary"
							style="margin-right: 16px"
							@click="search"
						>
							查询
						</a-button>
						<a-button
							html-type="reset"
							@click="reset"
						>
							重置</a-button
						>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<div
				class="returnPage"
				v-if="barList.length"
			>
				<a-icon
					type="arrow-left"
					style="margin-right: 8px"
					@click="returnPage"
				/>
				<span @click="returnFist">我的报表</span>>
				<span
					v-for="(item, index) in barList"
					:class="index + 1 == barList.length ? 'normal' : ''"
					@click="assignPage(item, index)"
				>
					{{ item.fileName }}<span v-if="index + 1 < barList.length">></span>
				</span>
			</div>
			<a-table
				:columns="columns"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<div
					slot="fileName"
					slot-scope="text, record"
					style="color: var(--primary-color)"
				>
					<div
						style="cursor: pointer"
						@click="detail(record)"
					>
						<img
							src="~/assets/imgs/statement/folder.png"
							alt=""
							style="width: 20px; margin-right: 8px; vertical-align: sub"
							v-if="record.fileType === 'FOLDER'"
						/>
						<img
							src="~/assets/imgs/statement/file.png"
							alt=""
							style="width: 20px; margin-right: 8px; vertical-align: sub"
							v-else
						/>
						{{ text }}
					</div>
				</div>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<!--          非分享文件才可以操作-->
					<template v-if="record.fileType !== 'SHAREFILE'">
						<a
							href="javascript:;"
							@click="downLoad(record)"
							v-if="record.fileType == 'FILE'"
							>下载</a
						>
						<a-dropdown>
							<a
								class="ant-dropdown-link"
								@click="e => e.preventDefault()"
							>
								更多
								<a-icon type="down" />
							</a>
							<a-menu slot="overlay">
								<a-menu-item
									@click="copy(record)"
									v-if="checkMove"
								>
									复制
								</a-menu-item>
								<a-menu-item
									@click="move(record)"
									v-if="checkMove"
								>
									移动
								</a-menu-item>
								<a-menu-item @click="edit(record)"> 重命名 </a-menu-item>
								<!--                文件才可以分享、文件夹不可以-->
								<a-menu-item
									@click="share(record)"
									v-if="record.fileType == 'FILE'"
								>
									分享
								</a-menu-item>
								<a-menu-item @click="deleteConfirm(record)"> 删除 </a-menu-item>
							</a-menu>
						</a-dropdown>
					</template>
				</div>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			v-if="pagination.total > 10"
			@change="changePagination"
		/>
		<Add
			ref="add"
			@refresh="getList"
			:barList="barList"
		/>
		<Move
			ref="move"
			@refresh="getList"
		/>
		<Share ref="share" />
	</div>
</template>
<script>
import iPagination from '@sub/components/iPagination';
import Add from './components/Add';
import Move from './components/Move';
import Share from './components/Share';
import {
	getWpsFileList,
	deleteWpsFile,
	wpsFileUpload,
	checkWhetherPushWps,
	downloadCloudDoc,
	API_isExistFolderWps
} from '@/v2/center/steels/api/statement.js';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';

const columns = [
	{ title: '名称', dataIndex: 'fileName', scopedSlots: { customRender: 'fileName' } },
	{ title: '文件大小', dataIndex: 'fileSize' },
	{ title: '创建时间', dataIndex: 'createdTime' },
	{ title: '创建人', dataIndex: 'createdName' },
	{ fixed: 'right', title: '操作', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'MyStatementList',
	data() {
		return {
			action: wpsFileUpload,
			formLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 15 }
			},
			columns,
			accept: '.xls,.xlsx',
			params: {},
			dataSource: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				hideSize: true
			},
			selectedKey: [],
			fileList: [],
			barList: [],
			loading: true,
			isCheckWhether: false,
			checkMove: false
		};
	},
	components: {
		iPagination,
		Add,
		Move,
		Share
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	mounted() {
		this.checkWhether();
	},
	methods: {
		changePagination(pageNo, pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			this.getList();
		},
		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		reset() {
			this.params = {};
			this.pagination.pageNo = 1;
			this.getList();
		},
		getList() {
			this.loading = true;
			this.params.pageNo = this.pagination.pageNo;
			this.params.pageSize = this.pagination.pageSize;
			if (this.barList.length) {
				this.params.parentId = this.barList[this.barList.length - 1].fileId;
			}
			getWpsFileList({
				...this.params
			})
				.then(res => {
					if (res.success) {
						this.dataSource = res.data.records;
						this.pagination.total = res.data.total;
						this.checkIsExistFolderWps();
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		downLoad(record) {
			downloadCloudDoc(record.fileId).then(res => {
				comDownload(res, undefined, record.fileName);
			});
		},
		add(fileType) {
			this.$refs.add.showModal(fileType, 'add');
		},
		edit(record) {
			this.$refs.add.showModal(record.fileType, 'edit', record);
		},
		copy(record) {
			this.$refs.move.showModal(record, 'copy');
		},
		move(record) {
			this.$refs.move.showModal(record, 'move');
		},
		detail(record) {
			if (record.fileType === 'FOLDER') {
				this.params = {};
				this.pagination.pageNo = 1;
				this.barList.push(record);
				this.getList();
			} else {
				this.$router.push(`/center/steels/statement/iframeWps?id=${record.id}`);
			}
		},
		returnPage() {
			this.barList.pop();
			this.reset();
		},
		assignPage(item, index) {
			this.barList = this.barList.splice(0, index + 1);
			this.reset();
		},
		share(record) {
			this.$refs.share.showModal(record);
		},
		returnFist() {
			this.barList = [];
			this.reset();
		},
		deleteConfirm(record) {
			this.$confirm({
				title: `您确认删除“${record.fileName}”吗？`,
				onOk: () => {
					this.deleteFiles(record.id);
				}
			});
		},
		deleteFiles(id) {
			deleteWpsFile(id).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.getList();
				}
			});
		},
		handleChange(info) {
			if (info.file.status === 'done') {
				this.$message.success('操作成功');
				this.getList();
			} else {
				if (info.file?.response?.error?.message) {
					this.$message.error(info.file.response.error.message);
				}
			}
		},
		checkWhether() {
			checkWhetherPushWps().then(res => {
				if (res.success) {
					this.isCheckWhether = res.data;
					if (this.isCheckWhether) {
						this.getList();
					} else {
						this.loading = false;
						this.$message.error('您没有该菜单的权限。');
					}
				}
			});
		},
		beforeUpload(file) {
			const allowFormat = ['xlsx', 'xls'];
			let isAllowFormat = false;
			let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if (allowFormat.indexOf(ext) == -1) {
				this.$message.error('仅支持xlsx，xls的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}

			return new Promise((resolve, reject) => {
				if (isAllowFormat) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		checkIsExistFolderWps() {
			API_isExistFolderWps().then(res => {
				if (res.success) {
					this.checkMove = res.data;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep {
	.ant-form-item {
		display: block;
		margin-bottom: 14px;
	}

	.ant-form-item-label {
		padding-right: 30px;
	}

	.ant-calendar-picker {
		width: 100%;
	}
}

.my-invoice-list {
	padding-bottom: 24px;

	.btn-wrap {
		text-align: left;
		padding: 15px 0px;
		padding-top: 0;
		margin: 0;

		.ant-btn {
			width: auto;
		}

		.btns {
			margin-right: 30px;
		}
	}

	.operation-line {
		display: inline-block;
		padding: 0 5px;
	}

	.ant-table-wrapper {
		a {
			display: inline-block;
			margin-right: 8px;
		}

		a:last-child {
			margin-right: 0;
		}
	}
}
.returnPage {
	font-size: 14px;
	margin-bottom: 12px;
	line-height: 24px;
	color: @primary-color;
	cursor: pointer;
	padding-left: 12px;
	span {
		font-size: 14px;
		vertical-align: revert;
	}
	.normal {
		color: #666666;
		cursor: auto;
	}
}
</style>
