<template>
	<div class="wrapper">
		<a-card
			class="custom-card-title"
			style="position: relative; margin: -10px -20px"
			title="报表管理-编辑页"
			:bordered="false"
		>
			<a-button
				slot="extra"
				ghost
				@click="$router.go(-1)"
				type="primary"
			>
				返回
			</a-button>
			<a-form
				:form="form"
				v-bind="formLayout"
				@submit="handleSubmit"
			>
				<a-row class="card">
					<a-col :span="12">
						<a-form-item label="地区">
							<a-input
								v-decorator="[
									`district`,
									{
										rules: [{ required: true, message: `请输入地区` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="地址">
							<a-input
								v-decorator="[
									`address`,
									{
										rules: [{ required: true, message: `请输入地址` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="仓库名称">
							<a-input
								v-decorator="[
									`pointName`,
									{
										rules: [{ required: true, message: `请输入仓库名称` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="业务模式">
							<a-input v-decorator="[`businessModel`]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="业务线">
							<a-input v-decorator="[`businessLine`]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="保管方名称">
							<a-input
								v-decorator="[
									`store`,
									{
										rules: [{ required: true, message: `请输入保管方` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="仓号">
							<a-input
								v-decorator="[
									`houseNum`,
									{
										rules: [{ required: true, message: `请输入仓号` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="品种">
							<a-input
								v-decorator="[
									`variety`,
									{
										rules: [{ required: true, message: `请输入品种` }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="仓容(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`capacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入仓容(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="当日入库(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`dayInCapacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入当日入库(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="累计入库(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`sumInCapacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入累计入库(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="当日出库(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`dayOutCapacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入当日出库(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="累计出库(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`sumOutCapacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入累计出库(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="现有库存(吨)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`currentCapacity`,
									{
										rules: [
											{
												required: true,
												message: `请输入现有库存(吨)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="货值合计(元)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`totalCost`,
									{
										rules: [
											{
												required: true,
												message: `请输入货值合计(元)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="每吨均价(元)">
							<a-input-number
								style="width: 100%"
								step="100"
								:min="0"
								v-decorator="[
									`averageCost`,
									{
										rules: [
											{
												required: true,
												message: `请输入每吨均价(元)`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="驻库监管员">
							<a-input v-decorator="[`custodian`]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="库存状态">
							<a-input v-decorator="[`pointStatus`]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="业务负责人">
							<a-input v-decorator="[`principal`]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="备注">
							<a-textarea v-decorator="[`remark`]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row
					type="flex"
					justify="center"
					style="margin: 50px 0; text-align: center"
				>
					<a-col span="12">
						<a-button
							@click="$router.go(-1)"
							style="width: 120px; height: 40px"
						>
							取消
						</a-button>
						<a-button
							type="primary"
							style="width: 120px; height: 40px; margin-left: 50px"
							html-type="submit"
						>
							提交
						</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import {
	reportDetail, //详情
	reportUpdate, //更新
	reportLoc //获取经纬度
} from '@/v2/center/storage/api';
import { formLayout } from '@/config/layoutConfig';
export default {
	name: 'ReportDetail',

	components: {},

	data() {
		return {
			formLayout,
			form: this.$form.createForm(this),
			id: '',
			oldData: {}
		};
	},

	created() {
		this.id = this.$route.query.id;
		if (this.id) {
			this.getDetail();
		} else {
			this.$router.go(-1);
		}
	},

	computed: {},

	methods: {
		//获取详情
		async getDetail() {
			let res = await reportDetail({ id: this.id });
			if (res.success) {
				this.oldData = res.data;
				this.$nextTick(() => {
					this.form.setFieldsValue(this.oldData);
				});
			}
		},
		//修改提交

		//表单提交
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (!err) {
					let form = { id: this.id, ...values };
					let res = await reportUpdate(form);
					if (res.success) {
						this.$message.success('修改成功');
						// 比较库点地址是否发生修改
						if (this.oldData.address !== form.address) {
							this.$confirm({
								title: '您修改了库点地址，请重新获取经纬度',
								okText: '获取经纬度',
								centered: true,
								onOk: () => {
									this.reportLoc();
								},
								onCancel: () => {
									this.$router.go(-1);
								}
							});
						} else {
							this.$router.go(-1);
						}
					}
				}
			});
		},
		//重新获取经纬度
		async reportLoc() {
			let res = await reportLoc();
			if (res.success) {
				this.$message.success('更新成功');
				this.$router.go(-1);
			}
		}
	}
};
</script>
