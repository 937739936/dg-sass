<template>
	<a-modal
		title="分享"
		:visible="visible"
		:destroyOnClose="true"
		width="500px"
		@ok="visible = false"
		@cancel="
			visible = false;
			searchName = '';
		"
	>
		<div>
			<a-input-search
				size="large"
				:value="record.shareLink"
				@search="copy"
			>
				<!--      <a-input-search size="large" :value="record.shareLink">-->
				<a-button slot="enterButton"> 复制 </a-button>
			</a-input-search>
			<!--      <a-input prefix="+" placeholder="搜索用户名称" v-model="searchName">-->
			<!--        <div slot="suffix">-->
			<!--          <a href="javascript:;" @click="getPersonalList">通讯录</a>-->
			<!--        </div>-->
			<!--      </a-input>-->
			<!--      <ul class="list">-->
			<!--        <li class="list-item" v-for="item in personPerm.filter((item) => item.name.includes(searchName))" :key="item.personId">-->
			<!--          <div>-->
			<!--            {{ item.name }}-->
			<!--          </div>-->
			<!--          <a-select v-model="item.perm" style="width: 90px">-->
			<!--            <a-select-option value="READ_ONLY">-->
			<!--              只读-->
			<!--            </a-select-option>-->
			<!--            <a-select-option value="EDITABLE">-->
			<!--              可编辑-->
			<!--            </a-select-option>-->
			<!--          </a-select>-->
			<!--        </li>-->
			<!--      </ul>-->

			<a-modal
				title="通讯录"
				:visible="visible2"
				width="500px"
				@ok="pushPersonPerm"
				@cancel="
					visible2 = false;
					searchTxl = '';
				"
			>
				<div>
					<a-input-search
						placeholder="请输入"
						style="width: 70%; margin-bottom: 24px"
						v-model="searchTxl"
					/>
				</div>
				<div class="txl-list">
					<a-checkbox-group v-model="txl">
						<div
							style="margin-bottom: 12px"
							v-for="item in txlList.filter(item => item.name.includes(searchTxl))"
							:key="item.personalId"
						>
							<a-checkbox :value="item.personalId">
								{{ item.name }}
							</a-checkbox>
						</div>
					</a-checkbox-group>
				</div>
			</a-modal>
		</div>
	</a-modal>
</template>
<script>
import { shareHistoryWps, shareWpsInfo, shareListWps } from '@/v2/center/steels/api/statement.js';
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			visible: false,
			visible2: false,
			record: {},
			personPerm: [],
			txl: [],
			txlList: [],
			searchName: '',
			searchTxl: '',
			originalStatus: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	methods: {
		showModal(record) {
			this.record = record;
			this.getShareWpsInfo();
			this.visible = true;
		},
		copy() {
			var input = document.createElement('input'); // 创建input对象
			input.value = this.record.shareLink; // 设置复制内容
			document.body.appendChild(input); // 添加临时实例
			input.select(); // 选择实例内容
			document.execCommand('Copy'); // 执行复制
			document.body.removeChild(input); // 删除临时实例
			this.$message.success('复制成功');
		},
		getShareWpsInfo() {
			shareHistoryWps(this.record.id).then(res => {
				if (res.success) {
					this.personPerm = res.data;
				}
			});
		},
		getPersonalList() {
			this.originalStatus = [];
			this.txl = [];
			this.personPerm.map(item => {
				this.txl.push(item.personalId);
				if (item.perm === 'READ_ONLY') {
					this.originalStatus.push(item.personalId);
				}
			});
			this.visible2 = true;
			shareListWps({ fileId: this.record.fileId }).then(res => {
				if (res.success) {
					// 剔除当前用户
					this.txlList = res.data.filter(item => item.mobile != this.VUEX_ST_PERSONALLINFO.mobile);
				}
			});
		},
		pushPersonPerm() {
			this.visible2 = false;
			this.personPerm = [];
			this.txlList.map(item => {
				if (this.txl.includes(item.personalId)) {
					if (this.originalStatus.includes(item.personalId)) {
						this.$set(item, 'perm', 'READ_ONLY');
					} else {
						// item.perm = 'EDITABLE'
						this.$set(item, 'perm', 'EDITABLE');
					}

					this.personPerm.push(item);
				}
			});
		},
		share() {
			let submitObj = {
				id: this.record.id,
				personPerm: this.personPerm
			};
			shareWpsInfo(submitObj).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.visible = false;
				}
			});
		}
	}
};
</script>
<style lang="less">
.list {
	padding-top: 24px;
	.list-item {
		padding: 0 12px;
		margin-bottom: 12px;
		line-height: 32px;
		display: flex;
		justify-content: space-between;
	}
}
.txl-list {
	height: 320px;
	overflow-y: scroll;
}
</style>
