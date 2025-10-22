<template>
	<a-modal
		:title="`将${record.fileName}${operate == 'copy' ? '复制' : '移动'}到...`"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		:destroyOnClose="true"
		width="700px"
		@cancel="handleCancel"
	>
		<div style="min-height: 300px">
			<div v-if="!loading">
				<p
					style="border-bottom: 1px solid #cccccc; padding-bottom: 4px"
					@click="returnPage"
					v-if="parentIds.length"
				>
					返回上一级
				</p>
				<ul
					class="file-list"
					v-if="dataSource.length"
				>
					<li
						v-for="item in dataSource"
						:key="item.id"
						:class="item.fileType === 'FOLDER' && item.fileId != record.fileId ? 'folder' : ''"
						@click="nextPage(item)"
					>
						<img
							src="~/assets/imgs/statement/folder.png"
							alt=""
							style="width: 20px; margin-right: 8px"
							v-if="item.fileType == 'FOLDER'"
						/>
						<img
							src="~/assets/imgs/statement/file.png"
							alt=""
							style="width: 20px; margin-right: 8px"
							v-else
						/>
						{{ item.fileName }}
					</li>
				</ul>
				<p
					style="text-align: center; padding-top: 124px; padding-bottom: 100px"
					v-else
				>
					这里暂无文件/文件夹
				</p>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { getWpsFileList, copyWpsFile, moveWpsFile } from '@/v2/center/steels/api/statement.js';
export default {
	data() {
		return {
			visible: false,
			confirmLoading: false,
			operate: '',
			form: this.$form.createForm(this),
			record: {
				name: '11111.xlsx'
			},
			id: '',
			parentIds: [],
			dataSource: [],
			loading: false
		};
	},
	methods: {
		showModal(record, operate) {
			this.record = record;
			this.operate = operate;
			this.id = record.id;
			this.visible = true;
			this.parentIds = [];
			this.getList();
		},
		handleOk(e) {
			e.preventDefault();
			let fetch = this.operate === 'copy' ? copyWpsFile : moveWpsFile;
			this.confirmLoading = true;
			fetch({
				id: this.id,
				targetParentId: this.parentIds.length ? this.parentIds[this.parentIds.length - 1] : null
			})
				.then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						this.$emit('refresh');
						this.visible = false;
					}
				})
				.finally(() => {
					this.confirmLoading = false;
				});
		},
		getList(parentId) {
			this.loading = true;
			getWpsFileList({
				pageNo: 1,
				pageSize: 10000,
				parentId
			})
				.then(res => {
					if (res.success) {
						this.dataSource = res.data.records || [];
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		nextPage(item) {
			if (item.fileType === 'FOLDER' && item.fileId !== this.record.fileId) {
				this.parentIds.push(item.fileId);
				this.getList(this.parentIds[this.parentIds.length - 1]);
			}
		},
		handleCancel() {
			this.visible = false;
		},
		returnPage() {
			this.parentIds.pop();
			if (this.parentIds.length) {
				this.getList(this.parentIds[this.parentIds.length - 1]);
			} else {
				this.getList();
			}
		}
	}
};
</script>
<style lang="less">
.file-list {
	margin-top: 24px;
	height: 320px;
	margin-bottom: 24px;
	overflow-y: scroll;
	li {
		height: 32px;
		line-height: 32px;
		color: #cccccc;
	}
	.folder {
		color: #333333;
		cursor: pointer;
	}
}
</style>
