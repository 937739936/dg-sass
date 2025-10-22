<template>
	<div class="contentBox">
		<!-- 下游 -->
		<div class="">
			<div class="title">
				运输凭证信息<span
					class="redTips"
					v-if="editFlag"
					>必须存在附件</span
				>
			</div>
			<div class="divider"></div>
			<div class="content">
				<div>
					<p class="sub-title">运输信息</p>
					<!-- 运输凭证信息编辑模块 -->
					<template v-if="editFlag">
						<a-form :form="baseForm">
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-item
										label="运输方式"
										:colon="false"
										:label-col="{ span: 6 }"
										:wrapper-col="{ span: 14 }"
									>
										<a-select
											placeholder="请选择运输方式"
											@change="changeTransport"
											v-decorator="[
												`transType`,
												{
													rules: [{ required: true, message: `运输方式必填` }]
												}
											]"
										>
											<a-select-option
												v-for="(item, index) in [
													{ name: '汽运', value: 'AUTOMOBILE' },
													{ name: '火运', value: 'TRAIN' },
													{ name: '船运', value: 'SHIP' }
												]"
												:key="index"
												:value="item.value"
											>
												{{ item.name }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</a-col>
							</a-row>
							<template v-if="baseForm.getFieldValue('transType') == 'SHIP'">
								<div>
									<p>船运信息</p>
								</div>
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="装货港"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入装货港"
												v-decorator="[
													'shipLoadingPortName',
													{
														rules: [{ required: true, message: `装货港必填` }],
														validateTrigger: 'blur'
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="卸货港"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入卸货港"
												v-decorator="[
													'shipDischargingPortName',
													{
														rules: [{ required: true, message: `卸货港必填` }],
														validateTrigger: 'blur'
													}
												]"
											>
											</a-input>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="货物数量(吨)"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入货物数量"
												v-decorator="[
													`deliverQuantity`,
													{
														rules: [
															{ required: true, message: `货物数量必填` },
															{ pattern: numberReg, message: '请输入数字，最多两位小数' }
														]
													}
												]"
											>
											</a-input>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="装货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入装货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`deliverDate`,
													{
														rules: [{ required: true, message: `装货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="收货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入收货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`receiveDate`,
													{
														rules: [{ required: true, message: `收货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>
								</a-row>
								<div>
									<p>船舶信息<span style="color: red">（至少录入一个船舶信息）</span></p>
									<div style="text-align: right; margin-bottom: 10px">
										<a-button
											ghost
											type="primary"
											@click="addShip"
											>新增</a-button
										>
									</div>
									<a-table
										:pagination="false"
										:columns="shipEditColumns"
										:data-source="shipDataSource"
										:scroll="{ x: true }"
										rowKey="id"
									>
										<template
											slot="action"
											slot-scope="action, items, index"
										>
											<a
												style="margin-right: 10px"
												href="javascript:;"
												@click="editShip(items, index)"
												>编辑</a
											>
											<a href="javascript:;">删除</a>
											<a
												style="margin-left: 10px"
												href="javascript:;"
												@click="openGuiji(items, index)"
												v-if="items.id"
												>查看轨迹</a
											>
										</template>
									</a-table>
								</div>
							</template>
							<template v-if="baseForm.getFieldValue('transType') == 'TRAIN'">
								<div>
									<p>火运信息</p>
								</div>
								<a-alert
									message="为保证发运真实性，请确保当前发货申请中，仅包含一列火车的发运信息。如您有多列火车，请进行多次发货申请"
									type="info"
									style="margin-bottom: 24px"
									show-icon
								/>
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model
											ref="releaseForm"
											:rules="rules"
											:model="params"
										>
											<a-form-model-item
												prop="shipperName"
												label="托运人"
												:colon="false"
												:label-col="{ span: 6 }"
												:wrapper-col="{ span: 14 }"
											>
												<a-select
													:getPopupContainer="
														triggerNode => {
															return triggerNode.parentNode || document.body;
														}
													"
													placeholder="托运人"
													v-model="params.shipperName"
													show-search
													:default-active-first-option="false"
													:show-arrow="false"
													:filter-option="false"
													:not-found-content="fetching ? undefined : null"
													@select="handleShipperNameSelect"
													@search="handleShipperNameSearch"
													@focus="shipperNameTipsVisible = false"
												>
													<a-spin
														v-if="fetching"
														slot="notFoundContent"
														size="small"
													/>
													<a-select-option
														v-for="item in shipperNameList"
														:key="item.name"
														:title="item.name"
														>{{ item.name }}</a-select-option
													>
												</a-select>
												<a-tooltip v-if="shipperNameTipsVisible">
													<template slot="title"> 请仔细核对托运人是否与铁路大票中的一致 </template>
													<a-icon
														type="exclamation-circle"
														class="exclamation-circle"
													/>
												</a-tooltip>
											</a-form-model-item>
										</a-form-model>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="运单号"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="若存在多张铁路大票，输入一个即可"
												@blur="getTrainInfo"
												v-decorator="[
													`serialNo`,
													{
														validateTrigger: 'blur',
														rules: [
															{ required: true, message: `运单号必填` },
															{ pattern: /^\w{12,13}$/, message: '请录入正确的12或13位运单号' }
														]
													}
												]"
											>
											</a-input>
										</a-form-item>
									</a-col>

									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="发货数量(吨)"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入发货数量"
												v-decorator="[
													`deliverQuantity`,
													{
														rules: [
															{ required: true, message: `发货数量必填` },
															{ pattern: numberReg, message: '请输入数字，最多两位小数' }
														]
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="车数"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请与发运列车的车厢数保持一致"
												v-decorator="[
													`trainNum`,
													{
														rules: [
															{ required: true, message: `车数必填` },
															{ pattern: numberReg, message: '请输入数字，最多两位小数' }
														]
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="发货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入发货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`deliverDate`,
													{
														rules: [{ required: true, message: `发货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="收货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入收货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`receiveDate`,
													{
														rules: [{ required: true, message: `收货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="发站"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-select
												showSearch
												:disabled="hasserialNo"
												mode="multiple"
												:showArrow="false"
												:filterOption="false"
												:defaultActiveFirstOption="false"
												style="width: 100%"
												@search="fetchPlace"
												placeholder="请输入内容进行查询"
												v-decorator="[
													'deliveryStation',
													{
														rules: [{ required: true, message: `发站必填` }],
														validateTrigger: 'blur'
													}
												]"
											>
												<a-select-option
													v-for="(items, index) in placeData"
													:key="index"
													:value="items.name"
													>{{ items.name }}</a-select-option
												>
											</a-select>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="到站"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-select
												showSearch
												:disabled="hasserialNo"
												mode="multiple"
												:showArrow="false"
												:filterOption="false"
												:defaultActiveFirstOption="false"
												style="width: 100%"
												@search="fetchPlace"
												placeholder="请输入内容进行查询"
												v-decorator="[
													'arriveStation',
													{
														rules: [{ required: true, message: `到站必填` }],
														validateTrigger: 'blur'
													}
												]"
											>
												<a-select-option
													v-for="(items, index) in placeData"
													:key="index"
													:value="items.name"
													>{{ items.name }}</a-select-option
												>
											</a-select>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="铁路计划号"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入铁路计划号"
												:disabled="hasserialNo"
												v-decorator="[
													`railwayPlanNo`,
													{
														rules: [{ required: false }]
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
								</a-row>
								<div>
									<p>
										车皮信息<span
											style="color: red"
											v-if="!hasserialNo"
											>（至少录入一个车皮信息）</span
										>
									</p>
									<div style="text-align: right; margin-bottom: 10px">
										<a-button
											type="primary"
											@click="openTrainGuiji()"
											v-if="deliverInfo && deliverInfo.id"
											>查看轨迹</a-button
										>
										<a-button
											ghost
											type="primary"
											style="margin-left: 20px"
											@click="addTrain"
											v-if="!hasserialNo"
											v-show="baseForm.getFieldValue('serialNo')"
											>新增</a-button
										>
									</div>
									<a-table
										:pagination="false"
										:columns="hasserialNo ? trainColumns : trainEditColumns"
										:data-source="trainDataSource"
										:scroll="{ x: true }"
										rowKey="id"
									>
										<template
											slot="action"
											slot-scope="action, items, index"
										>
											<a
												style="margin-right: 10px"
												href="javascript:;"
												@click="editTrain(items, index)"
												>编辑</a
											>
											<a
												href="javascript:;"
												@click="deleteTrain(items, index)"
												>删除</a
											>
										</template>
									</a-table>
								</div>
							</template>
							<template v-if="baseForm.getFieldValue('transType') == 'AUTOMOBILE'">
								<div>
									<p>汽运信息</p>
								</div>
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="发货数量(吨)"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入发货数量"
												v-decorator="[
													`deliverQuantity`,
													{
														rules: [
															{ required: true, message: `发货数量必填` },
															{ pattern: numberReg, message: '请输入数字，最多两位小数' }
														]
													}
												]"
											>
											</a-input>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="车数"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入车数"
												v-decorator="[
													`trainNum`,
													{
														rules: [
															{ required: true, message: `车数必填` },
															{ pattern: numberReg, message: '请输入数字，最多两位小数' }
														]
													}
												]"
											>
											</a-input>
										</a-form-item>
									</a-col>

									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="发货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入发货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`deliverDate`,
													{
														rules: [{ required: true, message: `发货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-item
											label="收货日期"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												placeholder="请输入收货日期"
												format="YYYY-MM-DD"
												v-decorator="[
													`receiveDate`,
													{
														rules: [{ required: true, message: `收货日期必填` }]
													}
												]"
											>
											</a-date-picker>
										</a-form-item>
									</a-col>

									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="发货地址"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入发货地址"
												v-decorator="[
													`deliverAddr`,
													{
														rules: [{ required: true, message: `发货地址必填` }]
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="收货地址"
											:colon="false"
											:label-col="{ span: 6 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												placeholder="请输入收货地址"
												v-decorator="[
													`receiveAddr`,
													{
														rules: [{ required: true, message: `收货地址必填` }]
													}
												]"
											>
											</a-input>
										</a-form-model-item>
									</a-col>
								</a-row>
							</template>
						</a-form>
					</template>
					<!-- 运输凭证信息展示模块 -->
					<template v-if="!editFlag && deliverInfo">
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">运输方式</a-col>
									<a-col :span="18">{{ deliverInfo.transTypeDesc }}</a-col>
								</a-row>
							</a-col>
						</a-row>
						<template v-if="deliverInfo.transType == 'SHIP'">
							<div>
								<p>船运信息</p>
							</div>
							<a-row>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">装货港</a-col>
										<a-col :span="18">{{ deliverInfo.shipLoadingPortName }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="8">卸货港</a-col>
										<a-col :span="16">{{ deliverInfo.shipDischargingPortName }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">货物数量(吨)</a-col>
										<a-col :span="18">{{ deliverInfo.deliverQuantity }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">装货日期</a-col>
										<a-col :span="18">{{ deliverInfo.deliverDate }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">收货日期</a-col>
										<a-col :span="18">{{ deliverInfo.receiveDate }}</a-col>
									</a-row>
								</a-col>
							</a-row>
							<a-table
								:pagination="false"
								:columns="shipEditColumns"
								:data-source="shipDataSource"
								:scroll="{ x: true }"
								rowKey="path"
							>
								<template
									slot="type"
									slot-scope="type"
								>
									{{ CONSTANTS.fileType[type] }}
								</template>
								<template
									slot="name"
									slot-scope="name, items"
								>
									<a
										:href="items.path"
										target="_blank"
										>{{ name }}</a
									>
								</template>
								<template
									slot="action"
									slot-scope="action, items, index"
								>
									<a
										href="javascript:;"
										@click="openGuiji(items, index)"
										v-if="items.id"
										>查看轨迹</a
									>
								</template>
							</a-table>
						</template>
						<template v-if="deliverInfo.transType == 'TRAIN'">
							<div>
								<p>火运信息</p>
							</div>
							<a-row>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">托运人</a-col>
										<a-col :span="18">{{ deliverInfo.shipperName }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">运单号</a-col>
										<a-col :span="16">{{ deliverInfo.serialNo }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发货数量(吨)</a-col>
										<a-col :span="18">{{ deliverInfo.deliverQuantity }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">车数</a-col>
										<a-col :span="18">{{ deliverInfo.deliverQuantity }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发货日期</a-col>
										<a-col :span="18">{{ deliverInfo.deliverDate }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">收货日期</a-col>
										<a-col :span="18">{{ deliverInfo.receiveDate }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发站</a-col>
										<a-col :span="18">{{ deliverInfo.deliveryStation }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">到站</a-col>
										<a-col :span="18">{{ deliverInfo.arriveStation }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">铁路计划号</a-col>
										<a-col :span="18">{{ deliverInfo.railwayPlanNo }}</a-col>
									</a-row>
								</a-col>
							</a-row>
							<div style="text-align: right; margin-bottom: 10px">
								<a-button
									type="primary"
									@click="openTrainGuiji()"
									v-if="deliverInfo && deliverInfo.id"
									>查看轨迹</a-button
								>
							</div>
							<a-table
								:pagination="false"
								:columns="trainColumns"
								:data-source="trainDataSource"
								:scroll="{ x: true }"
								rowKey="path"
							>
							</a-table>
						</template>
						<template v-if="deliverInfo.transType == 'AUTOMOBILE'">
							<div>
								<p>汽运信息</p>
							</div>
							<a-row>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发货数量(吨)</a-col>
										<a-col :span="18">{{ deliverInfo.deliverQuantity }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">车数</a-col>
										<a-col :span="18">{{ deliverInfo.trainNum }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发货日期</a-col>
										<a-col :span="18">{{ deliverInfo.deliverDate }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">收货日期</a-col>
										<a-col :span="18">{{ deliverInfo.receiveDate }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">发货地址</a-col>
										<a-col :span="18">{{ deliverInfo.deliverAddr }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">收货地址</a-col>
										<a-col :span="18">{{ deliverInfo.receiveAddr }}</a-col>
									</a-row>
								</a-col>
							</a-row>
						</template>
					</template>
				</div>

				<div>
					<p class="sub-title">附件信息</p>
					<!-- 附件编辑模块 -->
					<template v-if="editFlag || editFile">
						<template v-if="baseForm.getFieldValue('transType') == 'AUTOMOBILE'">
							<Upload
								@uploadFiles="getUploadFiles"
								type="MANUAL_DELIVER_CREDENTIALS"
								btnText="上传运输凭证"
							></Upload>
						</template>
						<template v-if="baseForm.getFieldValue('transType') == 'SHIP'">
							<Upload
								@uploadFiles="getUploadFiles"
								type="MANUAL_DELIVER_CREDENTIALS"
								btnText="上传运输凭证"
							></Upload>
							<Upload
								@uploadFiles="getUploadFiles"
								type="MANUAL_DELIVER_WEIGHT"
								btnText="上传称重凭证"
							></Upload>
							<Upload
								@uploadFiles="getUploadFiles"
								type="MANUAL_DELIVER_OTHER_CREDENTIALS"
								btnText="上传其他凭证"
							></Upload>
						</template>
						<template v-if="baseForm.getFieldValue('transType') == 'TRAIN'">
							<Upload
								@uploadFiles="getUploadFiles"
								transType="TRAIN"
								type="MANUAL_DELIVER_BIG_TICKET"
								btnText="上传大票"
							></Upload>
							<Upload
								@uploadFiles="getUploadFiles"
								transType="TRAIN"
								type="MANUAL_DELIVER_CAR_NUMBER_TABLE"
								btnText="上传车号表"
							></Upload>
							<Upload
								@uploadFiles="getUploadFiles"
								transType="TRAIN"
								type="MANUAL_DELIVER_OTHER_CREDENTIALS"
								btnText="上传其他凭证"
							></Upload>
						</template>
						<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
							>单个文件最大支持100M，支持多个上传</span
						>
						<a-table
							:pagination="false"
							:columns="editFilesColumns"
							:data-source="fileListDataSource.filter(item => item.delFlag == 0)"
							:scroll="{ x: true }"
							rowKey="path"
						>
							<template
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
							<template
								slot="name"
								slot-scope="name, items"
							>
								<a
									:href="items.path"
									target="_blank"
									>{{ name }}</a
								>
							</template>
							<template
								slot="action"
								slot-scope="action, items, index"
							>
								<a-popconfirm
									v-if="!items.locked && (items.editFlag == null || items.editFlag == 1)"
									title="确定删除该附件?"
									okText="确定"
									cancelText="取消"
									@confirm="() => deleteFiles(items, index)"
								>
									<a href="javascript:;">删除</a>
								</a-popconfirm>
							</template>
						</a-table>
					</template>
					<!-- 情展示模块 -->
					<template v-if="!editFlag && !editFile">
						<a-table
							:pagination="false"
							:columns="filesColumns"
							:data-source="
								isZf
									? filterLockFile(fileListDataSource.filter(item => item.delFlag == 0))
									: fileListDataSource.filter(item => item.delFlag == 0)
							"
							:scroll="{ x: true }"
							rowKey="path"
						>
							<template
								slot="type"
								slot-scope="type"
							>
								{{ CONSTANTS.fileType[type] }}
							</template>
							<template
								slot="name"
								slot-scope="name, items"
							>
								<a
									:href="items.path"
									target="_blank"
									>{{ name }}</a
								>
							</template>
						</a-table>
					</template>
				</div>
			</div>
		</div>
		<a-modal
			class="modal"
			width="600px"
			:visible="shipVisible"
			:title="shipVisibleTitle"
			@ok="okShip"
			@cancel="
				() => {
					shipVisible = false;
				}
			"
		>
			<a-form
				:form="shipVisibleForm"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 15 }"
			>
				<a-form-item label="船舶mmsi">
					<a-input
						placeholder="请输入船舶mmsi"
						v-decorator="[
							`identifierNo`,
							{
								rules: [
									{ required: true, message: `船舶mmsi必填` },
									{ pattern: /^\d{9}$/, message: '请录入正确的九位mmis码' }
								]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="装货量(吨)">
					<a-input
						placeholder="请输入装货量"
						v-decorator="[
							`deliverQuantity`,
							{
								rules: [
									{ required: true, message: `装货量必填` },
									{ pattern: numberReg, message: '请输入数字，最多两位小数' }
								]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="航次号">
					<a-input
						placeholder="请输入航次号"
						v-decorator="[
							`voyageNo`,
							{
								rules: [{ required: false }, { pattern: /^.{0,30}$/, message: '最大输入30个字符' }]
							}
						]"
					>
					</a-input>
				</a-form-item>
			</a-form>
			<template slot="footer">
				<a-button
					key="back"
					@click="shipVisible = false"
				>
					取消
				</a-button>
				<a-button
					key="submit"
					type="primary"
					@click="okShip"
				>
					确定
				</a-button>
				<a-button
					key="submit1"
					type="primary"
					@click="okShip('more')"
					v-if="editShipFlag == null"
				>
					确定并继续添加
				</a-button>
			</template>
		</a-modal>
		<a-modal
			class="modal"
			width="600px"
			:visible="trainVisible"
			:title="trainVisibleTitle"
			@ok="okTrain"
			@cancel="
				() => {
					trainVisible = false;
				}
			"
		>
			<a-form
				:form="trainVisibleForm"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 15 }"
			>
				<a-form-item label="运单号">
					<a-input
						placeholder="请输入运单号"
						:disabled="true"
						v-decorator="[
							`serialNo`,
							{
								rules: [{ required: true, message: `运单号必填` }]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="车种">
					<a-input
						placeholder="请输入车种"
						v-decorator="[
							`trainType`,
							{
								rules: [{ required: false, message: `车种必填` }]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="车号">
					<a-input
						placeholder="请输入车号"
						v-decorator="[
							`trainNo`,
							{
								rules: [{ required: true, message: `车号必填` }]
							}
						]"
					>
					</a-input>
				</a-form-item>
				<a-form-item label="票重(吨)">
					<a-input
						placeholder="请输入票重"
						v-decorator="[
							`deliverQuantity`,
							{
								rules: [
									{ required: true, message: `票重必填` },
									{ pattern: numberReg, message: '请输入数字，最多两位小数' }
								]
							}
						]"
					>
					</a-input>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script>
import {
	API_STATION,
	API_getDeliverGetRpcShip,
	API_getDeliverInfoTrains,
	API_getApiTrainDeliverShipper,
	API_saveTrainDeliverShipper,
	API_getRouteInfo,
	API_GETTRAINRECORD
} from '@/v2/center/assets/api/index.js';
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../common/Upload.vue';
import { mapMutations } from 'vuex';
import num from '@/untils/num.js';
import { filterLockFile } from '@/untils/factory.js';
import reg from '@sub/utils/reg.js';
// import _ from 'lodash';
export default {
	name: 'Contract',
	data() {
		return {
			filterLockFile,
			isZf: this.$route.path === '/center/assets/receivable/JR/detail' || this.$route.path === '/oaReceivableDetail',
			baseForm: this.$form.createForm(this),
			shipVisibleForm: this.$form.createForm(this),
			trainVisibleForm: this.$form.createForm(this),
			autoVisibleForm: this.$form.createForm(this),
			accMul: num.accMul,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			shipVisibleTitle: '',
			shipVisible: false,
			shipDataSource: [],
			trainVisibleTitle: '',
			trainVisible: false,
			trainDataSource: [],
			placeData: [],
			editShipFlag: null,
			editTrainFlag: null,
			fetching: false,
			shipperNameList: [],
			params: {},
			pushFlag: false, // 判断是否属于人工手工输入托运人
			shipperNameTipsVisible: false,
			rules: {
				shipperName: [{ required: true, message: '请输入托运人', trigger: 'blur' }]
			},
			shipColumns: [
				{ title: '船舶名称', dataIndex: 'shipName', key: 'shipName' },
				{ title: '航次号', dataIndex: 'voyageNo', key: 'voyageNo' },
				{ title: '船舶mmsi', dataIndex: 'identifierNo', key: 'identifierNo' },
				{ title: '发货量(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' }
			],
			shipEditColumns: [
				{ title: '船舶名称', dataIndex: 'shipName', key: 'shipName' },
				{ title: '航次号', dataIndex: 'voyageNo', key: 'voyageNo' },
				{ title: '船舶mmsi', dataIndex: 'identifierNo', key: 'identifierNo' },
				{ title: '发货量(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			trainColumns: [
				{ title: '运单号', dataIndex: 'transTicketNo', key: 'transTicketNo' },
				{ title: '车种', dataIndex: 'trainType', key: 'trainType' },
				{ title: '车号', dataIndex: 'trainNo', key: 'trainNo' },
				{ title: '票重(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' }
			],
			trainEditColumns: [
				{ title: '运单号', dataIndex: 'transTicketNo', key: 'transTicketNo' },
				{ title: '车种', dataIndex: 'trainType', key: 'trainType' },
				{ title: '车号', dataIndex: 'trainNo', key: 'trainNo' },
				{ title: '票重(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],

			editFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			hasserialNo: true,
			fileListDataSource: [],
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
		};
	},
	props: ['editFlag', 'deliverInfo', 'contractInfo', 'editFile'],
	components: {
		Upload
	},
	computed: {},
	watch: {
		deliverInfo: function () {
			this.dealEditData();
		}
	},
	mounted() {
		this.handleShipperNameSearch();
		this.dealEditData();
	},
	methods: {
		...mapMutations({
			VUEX_SET_MANUAL_ASSET_OBJ: 'business/VUEX_SET_MANUAL_ASSET_OBJ'
		}),
		moment,
		openGuiji(items) {
			if (!this.deliverInfo.id) return;
			window.open(
				'/logistics/LogisticsDetailShip?source=ASSET_MANUAL&mmsi=' +
					items.identifierNo +
					'&shipName=' +
					items.shipName +
					'&type=realLocation&deliveryId=' +
					this.deliverInfo.id +
					'&from=yunkong'
			);
		},
		openTrainGuiji() {
			if (this.deliverInfo.wayBillId) {
				API_getRouteInfo({ id: this.deliverInfo.wayBillId, source: 'ASSET_MANUAL' }).then(res => {
					if (res.success) {
						let hasPath = false;
						if (res.data) {
							for (let i = 0; i < res.data.length; i++) {
								if (res.data[i].waybillPhaseTraceInfoVO.length) {
									hasPath = true;
									break;
								}
							}
						}
						if (!hasPath) {
							this.$message.error('该运单暂无轨迹');
						} else {
							window.open('/logistics/LogisticsDetailTrainNew?source=ASSET_MANUAL&waybillId=' + this.deliverInfo.wayBillId);
						}
					}
				});
			} else {
				API_GETTRAINRECORD({ deliverBatchNo: this.deliverInfo.batchNo, source: 'ASSET_MANUAL' }).then(res => {
					if (res.success) {
						if (this.deliverInfo.transType == this.CONSTANTS.despatchModeDict.TRAIN) {
							window.open('/logistics/LogisticsDetailTrain?source=ASSET_MANUAL&deliverBatchNo=' + this.deliverInfo.batchNo);
						}
					}
				});
			}
		},
		dealEditData() {
			if (!this.deliverInfo) return;
			this.baseForm.setFieldsValue({
				transType: this.deliverInfo.transType
			});
			this.VUEX_SET_MANUAL_ASSET_OBJ({
				transportMode: this.deliverInfo.transType,
				isFirst: true
			});
			this.params.shipperName = this.deliverInfo.shipperName;

			setTimeout(() => {
				this.baseForm.setFieldsValue({
					...this.deliverInfo,
					deliverDate: moment(this.deliverInfo.deliverDate),
					receiveDate: moment(this.deliverInfo.receiveDate)
				});

				this.shipDataSource = this.deliverInfo.terminalDeliverInfoShipList || [];
				this.trainDataSource = this.deliverInfo.terminalDeliverInfoTrainList || [];
				this.fileListDataSource = this.deliverInfo.list || [];
			}, 1000);
		},
		changeTransport(v) {
			this.baseForm.resetFields();
			this.$emit('changeTransType', v);
			this.VUEX_SET_MANUAL_ASSET_OBJ({
				transportMode: v,
				isFirst: false
			});
			this.fileListDataSource.forEach(item => {
				item.delFlag = 1;
			});
		},
		deleteTrain(item, _index) {
			this.trainDataSource.splice(_index, 1);
		},
		deleteShip(item, _index) {
			this.shipDataSource.splice(_index, 1);
		},
		editTrain(item, _index) {
			this.editTrainFlag = _index;
			this.trainVisible = true;
			this.trainVisibleTitle = '编辑车皮信息';
			this.trainVisibleForm.resetFields();
			this.trainVisibleForm.setFieldsValue({
				...item
			});
		},
		editShip(item, _index) {
			this.editShipFlag = _index;
			this.shipVisible = true;
			this.shipVisibleTitle = '编辑船舶信息';
			this.shipVisibleForm.resetFields();
			this.shipVisibleForm.setFieldsValue({
				...item
			});
		},
		okShip(more) {
			this.shipVisibleForm.validateFields((error, values) => {
				if (!error) {
					API_getDeliverGetRpcShip({ mmsi: values['identifierNo'] }).then(res => {
						if (res.result && res.result.shipName) {
							let temp = {};
							if (this.editShipFlag != null) {
								temp = this.shipDataSource[this.editShipFlag];
								this.shipDataSource.splice(this.editShipFlag, 1);
							}
							this.shipDataSource.push({
								...temp,
								...values,
								shipName: res.result.shipName
							});
							if (more == 'more') {
								this.shipVisibleForm.resetFields();
							} else {
								this.shipVisible = false;
							}
						}
					});
				}
			});
		},

		okTrain() {
			this.trainVisibleForm.validateFields((error, values) => {
				if (!error) {
					let temp = {};
					if (this.editTrainFlag != null) {
						temp = this.trainDataSource[this.editShipFlag];
						this.trainDataSource.splice(this.editShipFlag, 1);
					}
					this.trainDataSource.push({
						...temp,
						transTicketNo: values.serialNo,
						trainType: values.trainType,
						deliverQuantity: values.deliverQuantity,
						trainNo: values.trainNo
					});
					this.trainVisible = false;
				}
			});
		},
		addShip() {
			this.editShipFlag = null;
			this.shipVisible = true;
			this.shipVisibleTitle = '新增船舶信息';
			this.shipVisibleForm.resetFields();
		},
		addTrain() {
			this.trainVisible = true;
			this.trainVisibleTitle = '新增车皮信息';
			this.editTrainFlag = null;
			this.trainVisibleForm.resetFields();
			setTimeout(() => {
				this.trainVisibleForm.setFieldsValue({
					serialNo: this.baseForm.getFieldValue('serialNo')
				});
			});
		},
		// 获取出发站数据
		fetchPlace(data) {
			if (!data) return;
			API_STATION({
				keywords: encodeURIComponent(data)
			}).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.placeData = res.result;
			});
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
		},
		deleteFiles(items, _index) {
			// 删除附件
			this.fileListDataSource[_index].delFlag = 1;
		},
		getTrainInfo() {
			// 根据运单号获取车皮信息

			let code = this.params.code;
			let serialNo = this.baseForm.getFieldValue('serialNo');
			let shipperName = this.params.shipperName;
			if (code && serialNo && shipperName) {
				API_getDeliverInfoTrains({ shipperName: shipperName, code: code, serialNo: serialNo }).then(res => {
					let data = res.data || {};

					if (data.departureStation) {
						this.$message.info('复用该运单号信息');
						this.hasserialNo = true;
						this.baseForm.setFieldsValue({
							deliveryStation: data.departureStation,
							arriveStation: data.arriveStation,
							trainNum: data.trainNum,
							deliverQuantity: data.deliverQuantity,
							deliverDate: moment(data.departureTime),
							railwayPlanNo: data.demandNo
						});

						this.trainDataSource = [
							{
								transTicketNo: data.serialNo,
								trainType: data.trainType || data.carType,
								deliverQuantity: data.deliverQuantity,
								trainNo: data.trainNo || data.carNumber
							}
						];
					} else {
						this.$message.error('该运单号暂无信息');
						this.hasserialNo = false;
						this.baseForm.setFieldsValue({
							deliveryStation: [],
							arriveStation: [],
							trainNum: null,
							deliverQuantity: null,
							deliverDate: null,
							railwayPlanNo: null
						});
						this.trainDataSource = [];
					}
				});
			}
		},
		handleShipperNameSelect(val) {
			// 选中托运人

			// let val = this.baseForm.getFieldValue('shipername')
			this.shipperNameList.forEach(item => {
				if (item.name == val) {
					this.params.code = item.code;
					this.shipperNameTipsVisible = item.new ? true : this.pushFlag; // 如果选择的是人工手动输入的，则显示托运人提示框
					//不再推送
					if (this.baseForm.getFieldValue('serialNo')) {
						this.getTrainInfo();
					}
					if (!item.existed) {
						// 如果不存在则推送
						API_saveTrainDeliverShipper({
							shipperName: val
						}).then(res => {
							if (res.success) {
								this.params.code = res.data.code;
								if (this.baseForm.getFieldValue('serialNo')) {
									this.getTrainInfo();
								}
							}
						});
					} else {
						if (this.baseForm.getFieldValue('serialNo')) {
							this.getTrainInfo();
						}
					}
				}
			});

			this.params.shipperName = val;
		},
		handleShipperNameSearch(name) {
			//获取托运人列表（数据来源已存在和企查查获得）

			// alert(11)
			// api/waybill/shipper/list
			if (!name) return;
			if (!reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾');
				return;
			}
			this.shipperNameList = [];
			this.fetching = true;
			this.shipperNameTipsVisible = false; // 不展示托运人提示
			API_getApiTrainDeliverShipper({
				keyword: name
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.shipperNameList = (res.data || []).filter(item => item.name);
					setTimeout(() => {
						this.shipperNameList.forEach(item => {
							if (item.name == this.params.shipperName) {
								this.params.code = item.code;
							}
						});
					}, 1000);
				}
			});
		},
		onSubmitList() {
			return this.fileListDataSource || [];
		},
		onSubmit(callback) {
			// 整体提交
			this.baseForm.validateFields((error, values) => {
				if (!error) {
					if (this.fileListDataSource.filter(item => item.delFlag == 0).length == 0) {
						this.$message.error('运输凭证缺少附件');
						return;
					}
					if (this.shipDataSource.length == 0 && values.transType == 'SHIP') {
						this.$message.error('运输凭证缺少船舶信息');
						return;
					}
					let obj = {
						...values,
						deliverDate: values.deliverDate.format('YYYY-MM-DD'),
						receiveDate: values.receiveDate.format('YYYY-MM-DD'),
						deliveryStation:
							values.deliveryStation && values.deliveryStation.join ? values.deliveryStation.join(',') : values.deliveryStation,
						arriveStation:
							values.arriveStation && values.arriveStation.join ? values.arriveStation.join(',') : values.arriveStation,
						list: this.fileListDataSource,
						terminalDeliverInfoShipList: this.shipDataSource,
						terminalDeliverInfoTrainList: this.trainDataSource,
						shipperName: this.params.shipperName
					};

					callback(obj);
				} else {
					this.$message.error('运输凭证缺少必要内容');
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	.exclamation-circle {
		position: absolute;
		top: 1px;
		transform: translateX(5px);
		cursor: pointer;
	}
	& > div {
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		.sub-title {
			&:before {
				content: '';
				float: left;
				margin-right: 4px;
				margin-top: 3px;
				display: block;
				width: 4px;
				height: 14px;
				background: @primary-color;
			}
		}
		.divider {
			background: #f4f5f8;
			height: 1px;
			margin-top: 0;
		}
		.add-other {
			float: right;
			margin-right: 15px;
			margin-top: 8px;
		}
		.content {
			padding: 15px;
			.other-title {
				color: #383a3f;
				margin-bottom: 20px;
			}
			& > div {
				.row {
					height: 59px;
					margin-bottom: 0;
					::v-deep.ant-form-item-label {
						text-align: left;
					}
					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}
					::v-deep.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}
				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}
				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}
				p {
					font-family: PingFangSC-Medium;
					color: #383a3f;
					text-align: left;
					line-height: 18px;
					margin: 15px 0;
				}
				& > .ant-row {
					margin: 15px 0;
					.ant-col .ant-row .ant-col {
						margin-bottom: 3px;
					}
					.ant-col .ant-row .ant-col:first-child {
						color: #6b6f76;
					}
					.ant-col .ant-row .ant-col:last-child {
						color: #383a3f;
					}
				}
			}
		}
	}
	.red {
		color: #f24e4d !important;
	}

	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	.redTips {
		color: #f24e4d !important;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		float: right;
		display: inline-block;
		margin-right: 15px;
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
