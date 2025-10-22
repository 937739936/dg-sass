<template>
	<div class="background-wrapper">
		<!-- <a-form
      v-if="current === 1"
      :form="form"
      v-bind="formLayout"> -->
		<a-card
			class="custom-card-title mb16"
			title="解除封仓-开锁授权"
			:bordered="false"
		>
			<!-- <a-row>
          <a-col :span="12">
            <a-form-item label="工作人员" :colon="false">
              <a-select
                mode="multiple"
                placeholder="请选择工作人员"
                maxTagCount="3"
                :getPopupContainer="getPopupContainer"
                v-decorator="[
                  'sellerName1',
                  {
                    rules: [
                      { required: true, message: '请选择工作人员' },
                    ],
                  }
                ]">
                <a-select-option
                  v-for="item in detailData.workers"
                  :key="item.workerid"
                  :value="item.workerid">
                  {{ item.workername }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="钥匙名称" :colon="false">
              <a-select
                mode="multiple"
                placeholder="请选择钥匙"
                maxTagCount="3"
                :getPopupContainer="getPopupContainer"
                show-search
                v-decorator="[
                  'sellerName',
                  {
                    rules: [
                      { required: true, message: '请选择钥匙' },
                    ],
                  }]">
                <a-select-option
                  v-for="item in detailData.keyList"
                  :key="item.keyno"
                  :value="item.keyno">
                  {{ item.keyname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="锁具名称" :colon="false">
              <a-select
                mode="multiple"
                show-search
                placeholder="请选择锁具"
                maxTagCount="3"
                :getPopupContainer="getPopupContainer"
                v-decorator="[
                  'contractType',
                  {
                    rules: [
                      { required: true, message: '请选择锁具' },
                    ],
                  }
                ]">
                <a-select-option
                  v-for="item in detailData.locks"
                  :key="item.lockno"
                  :value="item.lockno">
                  {{ item.lockname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row> -->
			<template v-if="current === 1">
				<a-descriptions :column="1">
					<a-descriptions-item label="工作人员">
						{{ handleArray(detailData.workers, 'workername') }}
					</a-descriptions-item>
					<a-descriptions-item label="钥匙名称">
						{{ handleArray(detailData.keyList, 'keyname') }}
					</a-descriptions-item>
					<a-descriptions-item label="锁具名称">
						{{ handleArray(detailData.locks, 'lockname') }}
					</a-descriptions-item>
				</a-descriptions>
				<div class="tc">
					<a-button
						style="margin-right: 24px"
						@click="$router.go(-1)"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="save"
						>提交</a-button
					>
				</div>
			</template>
			<a-result
				v-if="current === 2"
				status="success"
				:title="$route.query.isNeedAudit == 'true' ? '提交成功，待金融机构审批通过后方可生效' : '提交成功'"
			>
				<template #extra>
					<a-button
						type="primary"
						@click="$router.go(-1)"
					>
						确定
					</a-button>
				</template>
			</a-result>
		</a-card>
		<!-- </a-form> -->
	</div>
</template>
<script>
import { getPopupContainer } from '@/v2/utils/factory';
import { API_GetKeyLockAndWorks, API_OpenWarehouse } from '@/v2/center/storage/api';

export default {
	name: 'OpenWarehouse',

	data() {
		return {
			getPopupContainer,
			current: 1,
			detailData: {
				workers: [],
				locks: [],
				keyList: []
			},
			formLayout: {
				labelCol: {
					span: 6
				},
				wrapperCol: {
					span: 14
				}
			},
			form: this.$form.createForm(this)
		};
	},
	created() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_GetKeyLockAndWorks(this.$route.query.batchId).then(res => {
				if (res.success) {
					this.detailData = res.data;
				}
			});
		},
		save() {
			const workerids = this.detailData.workers.map(item => item.workerid);
			const keynos = this.detailData.keyList.map(item => item.keyno);
			const locknos = this.detailData.locks.map(item => item.lockno);
			const params = {
				batchId: this.$route.query.batchId,
				workerids,
				keynos,
				locknos
			};
			API_OpenWarehouse(params).then(res => {
				if (res.success) {
					this.current = 2;
				}
			});

			// this.form.validateFieldsAndScroll((err, values) => {
			//   if (!err) {
			//   }
			// })
		},
		handleArray(array, key) {
			return array.map(item => item[key]).join('、');
		}
	}
};
</script>
