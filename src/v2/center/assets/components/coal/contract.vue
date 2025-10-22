<template>
	<div>
		<!--煤炭-->
		<div
			class="contentBox"
			v-if="contractInfo"
			ref="CoalContract"
		>
			<!-- 上游 -->
			<div class="upstreamBox">
				<div class="title">上游合同信息</div>
				<div class="divider"></div>
				<div class="content">
					<div>
						<p class="sub-title">基本信息</p>
						<a-row>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">合同编号</a-col>
									<a-col :span="18">{{ contractInfo.upContract.contractNo }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同金额</a-col>
									<a-col :span="16">
										<span class="red">{{ contractInfo.upContract.amount || '-' }}</span>
										<span v-if="contractInfo.upContract.amount">&nbsp;元</span>
									</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订日期</a-col>
									<a-col :span="18">{{ contractInfo.upContract.signDate }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="8">合同执行期</a-col>
									<a-col :span="16">{{ contractInfo.upContract.execDateStart }}~{{ contractInfo.upContract.execDateEnd }}</a-col>
								</a-row>
							</a-col>
							<a-col :span="12">
								<a-row :gutter="20">
									<a-col :span="6">签订状态</a-col>
									<a-col
										:span="18"
										class="doubleSign"
										v-if="contractInfo.upContract.signStatus == '2'"
										>双签</a-col
									>
									<a-col
										:span="18"
										class="singleSign"
										v-if="contractInfo.upContract.signStatus == '1'"
										>单签</a-col
									>
								</a-row>
							</a-col>
							<!-- 双签状态 -->
							<a-col
								:span="12"
								v-if="contractInfo.upContract.signStatus == '2' && contractInfo.upContract.doubelSignRecvDate"
							>
								<a-row :gutter="20">
									<a-col :span="8">双签版合同获得日期</a-col>
									<a-col :span="16">{{ contractInfo.upContract.doubelSignRecvDate }}</a-col>
								</a-row>
							</a-col>
						</a-row>
					</div>

					<div>
						<p class="sub-title">合同详情</p>
						<a-table
							:pagination="false"
							:columns="contractDetailColumns"
							:data-source="upstreamContractDetailData"
							:scroll="{ x: true }"
							rowKey="id"
						>
							<template
								slot="basePrice"
								slot-scope="text, items"
							>
								<span>{{ items.basePrice || items.basePriceDesc || '-' }}</span>
							</template>
						</a-table>
					</div>

					<div>
						<p class="sub-title">附件信息</p>

						<!-- 上游附件信息详情模块 -->
						<a-table
							v-if="contractInfo.upContract"
							:pagination="false"
							:columns="noFileName ? noFileNameFilesColumns : filesColumns"
							:data-source="contractInfo.upContract.list"
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
						<div v-else>暂无数据</div>
					</div>
				</div>
			</div>
			<!-- 下游 -->
			<div class="downstreamBox">
				<div class="title">
					下游合同信息<span
						class="redTips"
						v-if="editFlag"
						>必须存在附件</span
					>
				</div>
				<div class="divider"></div>
				<div class="content">
					<div
						style="text-align: right"
						v-if="showEditorRadio"
					>
						编辑合同
						<a-radio-group v-model="editFlag">
							<a-radio :value="true"> 是 </a-radio>
							<a-radio :value="false"> 否 </a-radio>
						</a-radio-group>
					</div>
					<div>
						<p class="sub-title">基本信息</p>
						<!-- 下游基本信息编辑模块 -->
						<template v-if="editFlag">
							<a-form-model
								ref="baseInfoForm"
								:model="contractInfo.downContract"
								:rules="baseInfoRules"
							>
								<a-row>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="卖方企业名称"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												:disabled="true"
												v-model="contractInfo.downContract.sellerName"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											label="买方企业名称"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												:disabled="true"
												v-model="contractInfo.downContract.buyerName"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											ref="contractNo"
											label="合同编号"
											prop="contractNo"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												:disabled="true"
												v-model="baseInfoForm.contractNo"
												placeholder="请输入合同编号"
												:maxLength="50"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											ref="contractAmount"
											label="合同金额"
											prop="contractAmount"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-input
												:disabled="contractInfo.downContract.whetherEditAllBoo === false"
												v-model="baseInfoForm.contractAmount"
												:maxLength="50"
											/><em>元</em>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											ref="contractSignTime"
											label="签订日期"
											prop="contractSignTime"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												:disabled-date="disabledDate"
												:disabled="contractInfo.downContract.whetherEditAllBoo === false"
												v-model="baseInfoForm.contractSignTime"
												type="date"
												format="YYYY-MM-DD"
												style="width: 100%"
												@change="getTime"
												placeholder="请选择"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											ref="execDate"
											label="合同执行日期"
											prop="execDate"
											:colon="false"
											:rules="{ validator: validExecTime, trigger: 'change', required: true }"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-range-picker
												v-model="baseInfoForm.execDate"
												:disabled="contractInfo.downContract.whetherEditAllBoo === false"
												type="date"
												format="YYYY-MM-DD"
												style="width: 100%"
												@change="getExecTime"
											/>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
									>
										<a-form-model-item
											ref="status"
											label="签订状态"
											prop="status"
											:colon="false"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-radio-group
												v-model="baseInfoForm.status"
												@change="changeVal"
												:disabled="contractInfo.downContract.whetherEditAllBoo === false"
											>
												<a-radio
													:value="2"
													:disabled="
														assetsConfig.downDoubleDisable ||
														(['TO_BE_VERIFY', 'COMMENTED', 'PLATFORM_REJECT'].includes($route.query.status) &&
															baseInfoForm.status == 2)
													"
													>双签</a-radio
												>
												<a-radio
													:value="1"
													:disabled="
														assetsConfig.downSingleDisable ||
														(['TO_BE_VERIFY', 'COMMENTED', 'PLATFORM_REJECT'].includes($route.query.status) &&
															baseInfoForm.status == 2)
													"
													>单签</a-radio
												>
											</a-radio-group>
										</a-form-model-item>
									</a-col>
									<a-col
										:span="12"
										class="row"
										v-if="baseInfoForm.status == '2'"
									>
										<a-form-model-item
											ref="doubleSignTime"
											label="双签合同获得日期"
											prop="doubleSignTime"
											:colon="false"
											:rules="{ validator: validDoubleTime, trigger: 'change', required: true }"
											:label-col="{ span: 8 }"
											:wrapper-col="{ span: 14 }"
										>
											<a-date-picker
												:disabled="contractInfo.downContract.whetherEditAllBoo === false"
												v-model="baseInfoForm.doubleSignTime"
												type="date"
												format="YYYY-MM-DD"
												style="width: 100%"
												@change="getDoubleTime"
												placeholder="请选择"
											/>
										</a-form-model-item>
									</a-col>
								</a-row>
								<a-row>
									<!-- 运输凭证信息展示模块 -->
									<a-form-model
										ref="transForm"
										:model="transForm"
										:rules="transFormRules"
									>
										<a-row>
											<a-col
												:span="12"
												class="row"
											>
												<a-form-model-item
													label="运输方式"
													ref="transType"
													prop="transType"
													:colon="false"
													:label-col="{ span: 8 }"
													:wrapper-col="{ span: 14 }"
												>
													<a-select
														:disabled="contractInfo.downContract.whetherEditAllBoo === false"
														placeholder="请选择运输方式"
														@change="changeTransport"
														v-model="transForm.transType"
													>
														<a-select-option
															v-for="(item, index) in [
																{ name: '汽运和火运', value: 'AUTOMOBILE_AND_TRAIN' },
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
												</a-form-model-item>
											</a-col>
										</a-row>
										<template v-if="transForm.transType == 'AUTOMOBILE_AND_TRAIN'">
											<a-row>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="发站"
														ref="trainSendStationName"
														prop="trainSendStationName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															showSearch
															mode="multiple"
															:showArrow="false"
															:filterOption="false"
															:defaultActiveFirstOption="false"
															@search="fetchPlace"
															placeholder="请输入内容进行查询"
															v-model="transForm.trainSendStationName"
														>
															<a-select-option
																v-for="(items, index) in placeData"
																:key="index"
																:value="items.name"
																>{{ items.name }}</a-select-option
															>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="到站"
														:colon="false"
														ref="trainArriveStationName"
														prop="trainArriveStationName"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															showSearch
															mode="multiple"
															:showArrow="false"
															:filterOption="false"
															:defaultActiveFirstOption="false"
															@search="fetchPlace"
															placeholder="请输入内容进行查询"
															v-model="transForm.trainArriveStationName"
														>
															<a-select-option
																v-for="(items, index) in placeData"
																:key="index"
																:value="items.name"
																>{{ items.name }}</a-select-option
															>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="托运人"
														ref="consignorCompanyName"
														prop="consignorCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入托运人"
															v-bind="selectTagsProps"
															:maxLength="50"
															v-model="transForm.consignorCompanyName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="发货地址"
														ref="sendGoodsAddress"
														prop="sendGoodsAddress"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-input
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入发货地址"
															:maxLength="50"
															v-model="transForm.sendGoodsAddress"
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
														ref="receiveGoodsAddress"
														prop="receiveGoodsAddress"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-input
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入收货地址"
															:maxLength="50"
															v-model="transForm.receiveGoodsAddress"
														>
														</a-input>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="收货人名称"
														ref="consigneeCompanyName"
														prop="consigneeCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入收货人名称"
															v-model="transForm.consigneeCompanyName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
											</a-row>
										</template>
										<template v-if="transForm.transType == 'SHIP'">
											<a-row>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="装货港"
														ref="shipLoadingPortName"
														prop="shipLoadingPortName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入装货港"
															v-model="transForm.shipLoadingPortName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="卸货港"
														ref="shipDischargingPortName"
														prop="shipDischargingPortName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入卸货港"
															v-model="transForm.shipDischargingPortName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="收货人名称"
														ref="consigneeCompanyName"
														prop="consigneeCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入收货人名称"
															v-model="transForm.consigneeCompanyName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
											</a-row>
										</template>
										<template v-if="transForm.transType == 'TRAIN'">
											<a-row>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="发站"
														ref="trainSendStationName"
														prop="trainSendStationName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															showSearch
															mode="multiple"
															:showArrow="false"
															:filterOption="false"
															:defaultActiveFirstOption="false"
															@search="fetchPlace"
															placeholder="请输入内容进行查询"
															v-model="transForm.trainSendStationName"
														>
															<a-select-option
																v-for="(items, index) in placeData"
																:key="index"
																:value="items.name"
																>{{ items.name }}</a-select-option
															>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="到站"
														ref="trainArriveStationName"
														prop="trainArriveStationName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															showSearch
															mode="multiple"
															:showArrow="false"
															:filterOption="false"
															:defaultActiveFirstOption="false"
															@search="fetchPlace"
															placeholder="请输入内容进行查询"
															v-model="transForm.trainArriveStationName"
														>
															<a-select-option
																v-for="(items, index) in placeData"
																:key="index"
																:value="items.name"
																>{{ items.name }}</a-select-option
															>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="托运人"
														ref="consignorCompanyName"
														prop="consignorCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入托运人"
															v-bind="selectTagsProps"
															v-model="transForm.consignorCompanyName"
															:maxLength="50"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="收货人名称"
														ref="consigneeCompanyName"
														prop="consigneeCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入收货人名称"
															v-model="transForm.consigneeCompanyName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
											</a-row>
										</template>
										<template v-if="transForm.transType == 'AUTOMOBILE'">
											<a-row>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="发货地址"
														ref="sendGoodsAddress"
														prop="sendGoodsAddress"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-input
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入发货地址"
															:maxLength="50"
															v-model="transForm.sendGoodsAddress"
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
														ref="receiveGoodsAddress"
														prop="receiveGoodsAddress"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-input
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															placeholder="请输入收货地址"
															:maxLength="50"
															v-model="transForm.receiveGoodsAddress"
														>
														</a-input>
													</a-form-model-item>
												</a-col>
												<a-col
													:span="12"
													class="row"
												>
													<a-form-model-item
														label="收货人名称"
														ref="consigneeCompanyName"
														prop="consigneeCompanyName"
														:colon="false"
														:label-col="{ span: 8 }"
														:wrapper-col="{ span: 14 }"
													>
														<a-select
															:disabled="contractInfo.downContract.whetherEditAllBoo === false"
															v-bind="selectTagsProps"
															placeholder="请输入收货人名称"
															v-model="transForm.consigneeCompanyName"
														>
														</a-select>
													</a-form-model-item>
												</a-col>
											</a-row>
										</template>
									</a-form-model>
								</a-row>
							</a-form-model>
						</template>
						<!-- 下游基本信息详情展示模块 -->
						<template v-if="!editFlag">
							<a-row>
								<a-col
									:span="12"
									v-if="contractInfo.downContract.sellerName"
								>
									<a-row :gutter="20">
										<a-col :span="6">卖方企业名称</a-col>
										<a-col :span="18">{{ contractInfo.downContract.sellerName }}</a-col>
									</a-row>
								</a-col>
								<a-col
									:span="12"
									v-if="contractInfo.downContract.sellerName"
								>
									<a-row :gutter="20">
										<a-col :span="6">买方企业名称</a-col>
										<a-col :span="18">{{ contractInfo.downContract.buyerName }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">合同编号</a-col>
										<a-col :span="18">{{ contractInfo.downContract.contractNo }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">合同金额</a-col>
										<a-col :span="16">
											<span class="red">{{ contractInfo.downContract.contractAmount || '-' }}</span>
											<span v-if="contractInfo.downContract.contractAmount">&nbsp;元</span>
										</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">签订日期</a-col>
										<a-col :span="18">{{ contractInfo.downContract.contractSignTime }}</a-col>
									</a-row>
								</a-col>
								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">合同执行期</a-col>
										<a-col :span="16"
											>{{ contractInfo.downContract.execDateStart }}~{{ contractInfo.downContract.execDateEnd }}</a-col
										>
									</a-row>
								</a-col>

								<a-col :span="12">
									<a-row :gutter="20">
										<a-col :span="6">签订状态</a-col>
										<a-col
											:span="18"
											class="doubleSign"
											v-if="contractInfo.downContract.status == '2'"
											>双签</a-col
										>
										<a-col
											:span="18"
											class="singleSign"
											v-if="contractInfo.downContract.status == '1'"
											>单签</a-col
										>
									</a-row>
								</a-col>
								<!-- 双签状态 -->
								<a-col
									:span="12"
									v-if="contractInfo.downContract.status == '2' && contractInfo.downContract.doubleSignTime"
								>
									<a-row :gutter="20">
										<a-col :span="6">双签版合同获得日期</a-col>
										<a-col :span="16">{{ contractInfo.downContract.doubleSignTime }}</a-col>
									</a-row>
								</a-col>
							</a-row>
							<a-row v-if="contractInfo.downContract && contractInfo.downContract.terminalContractDeliveryVO">
								<a-row>
									<a-col :span="12">
										<a-row :gutter="20">
											<a-col :span="6">运输方式</a-col>
											<a-col :span="18">{{ contractInfo.downContract.transTypeDesc }}</a-col>
										</a-row>
									</a-col>
								</a-row>
								<template v-if="contractInfo.downContract.transType == 'AUTOMOBILE_AND_TRAIN'">
									<a-row>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">发站</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.trainSendStationName }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">到站</a-col>
												<a-col :span="18">{{
													contractInfo.downContract.terminalContractDeliveryVO.trainArriveStationName
												}}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">托运人</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consignorCompanyName }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">发货地址</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.sendGoodsAddress }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货地址</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.receiveGoodsAddress }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货人名称</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consigneeCompanyName }}</a-col>
											</a-row>
										</a-col>
									</a-row>
								</template>
								<template v-if="contractInfo.downContract.transType == 'SHIP'">
									<a-row>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">装货港</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.shipLoadingPortName }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">卸货港</a-col>
												<a-col :span="18">{{
													contractInfo.downContract.terminalContractDeliveryVO.shipDischargingPortName
												}}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货人名称</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consigneeCompanyName }}</a-col>
											</a-row>
										</a-col>
									</a-row>
								</template>
								<template v-if="contractInfo.downContract.transType == 'TRAIN'">
									<a-row>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">发站</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.trainSendStationName }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">到站</a-col>
												<a-col :span="18">{{
													contractInfo.downContract.terminalContractDeliveryVO.trainArriveStationName
												}}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">托运人</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consignorCompanyName }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货人名称</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consigneeCompanyName }}</a-col>
											</a-row>
										</a-col>
									</a-row>
								</template>
								<template v-if="contractInfo.downContract.transType == 'AUTOMOBILE'">
									<a-row>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">发货地址</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.sendGoodsAddress }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货地址</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.receiveGoodsAddress }}</a-col>
											</a-row>
										</a-col>
										<a-col :span="12">
											<a-row :gutter="20">
												<a-col :span="6">收货人名称</a-col>
												<a-col :span="18">{{ contractInfo.downContract.terminalContractDeliveryVO.consigneeCompanyName }}</a-col>
											</a-row>
										</a-col>
									</a-row>
								</template>
							</a-row>
						</template>
					</div>

					<div>
						<p class="sub-title">合同详情</p>
						<!-- 下游合同详情编辑模块 -->
						<template v-if="editFlag">
							<div>
								<a-form-model
									ref="contractDetailForm"
									:model="contractDetailForm"
									:rules="contractDetailRules"
								>
									<a-row>
										<a-col
											:span="12"
											class="row"
										>
											<a-form-model-item
												ref="goodsName"
												label="标的货物名称"
												prop="goodsName"
												:colon="false"
												:label-col="{ span: 8 }"
												:wrapper-col="{ span: 14 }"
											>
												<a-input
													:disabled="contractInfo.downContract.whetherEditAllBoo === false"
													v-model="contractDetailForm.goodsName"
													placeholder="请输入标的货物名称"
													:maxLength="50"
												/>
											</a-form-model-item>
										</a-col>
										<a-col
											:span="12"
											class="row"
										>
											<a-form-model-item
												ref="contractPrice"
												label="单价"
												prop="contractPrice"
												:colon="false"
												:label-col="{ span: 8 }"
												:wrapper-col="{ span: 14 }"
											>
												<a-input
													:disabled="contractInfo.downContract.whetherEditAllBoo === false"
													v-model="contractDetailForm.contractPrice"
												/><em style="right: -38px">元/吨</em>
											</a-form-model-item>
										</a-col>
										<a-col
											:span="12"
											class="row"
										>
											<a-form-model-item
												ref="contractQuantity"
												label="数量"
												prop="contractQuantity"
												:colon="false"
												:label-col="{ span: 8 }"
												:wrapper-col="{ span: 14 }"
											>
												<a-input
													:disabled="contractInfo.downContract.whetherEditAllBoo === false"
													v-model="contractDetailForm.contractQuantity"
													placeholder="请输入数量"
												/>
											</a-form-model-item>
										</a-col>
									</a-row>
								</a-form-model>
							</div>
						</template>
						<!-- 下游合同详情展示模块 -->
						<template v-if="!editFlag">
							<a-table
								:pagination="false"
								:columns="contractDetailColumns"
								:data-source="downstreamContractDetailData"
								:scroll="{ x: true }"
								rowKey="id"
							>
								<template
									slot="basePrice"
									slot-scope="text, items"
								>
									<span v-if="items.followTheMarket">随行就市</span>
									<span v-else>{{ items.basePrice || items.basePriceDesc || '-' }}</span>
								</template>
							</a-table>
						</template>
					</div>

					<div>
						<p class="sub-title">附件信息</p>
						<!-- 下游附件编辑模块 -->
						<template v-if="editFlag">
							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_DSIGN_FILE"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="TERMINAL_CONTRACT"
								btnText="上传下游合同"
								styleType="new"
							></Upload>
							<!-- <Upload v-if="assetsConfig.CONTRACT_DOWN_DSIGN_SUPPLEMEN" :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_SUPPLEMENT" btnText="上传补充协议"></Upload> -->
							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_DSIGN_BID_PROOF"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="TERMINAL_CONTRACT_BID_PROOF"
								btnText="上传中标佐证"
								styleType="new"
							></Upload>
							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_FILE"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="CONTRACT"
								btnText="上传下游合同"
								styleType="new"
							></Upload>
							<!-- <Upload v-if="assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_SUPPLEMEN" :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="CONTRACT_SUPPLEMENT" btnText="上传补充协议"></Upload> -->
							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="CONTRACT_OTHER_BID_PROOF"
								btnText="上传中标佐证"
								styleType="new"
							></Upload>

							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_SSIGN_FILE"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="TERMINAL_CONTRACT"
								btnText="上传下游合同"
								styleType="new"
							></Upload>
							<!-- <Upload v-if="assetsConfig.CONTRACT_DOWN_SSIGN_SUPPLEMEN" :receivalVO="receivalVO" @uploadFiles="getUploadFiles" type="TERMINAL_CONTRACT_SUPPLEMENT" btnText="上传补充协议"></Upload> -->
							<Upload
								v-if="assetsConfig.CONTRACT_DOWN_SSIGN_BID_PROOF"
								:receivalVO="receivalVO"
								@uploadFiles="getUploadFiles"
								type="TERMINAL_CONTRACT_BID_PROOF"
								btnText="上传中标佐证"
								styleType="new"
							></Upload>

							<template
								v-if="
									assetsConfig.CONTRACT_DOWN_DSIGN_SUPPLEMEN ||
									assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_SUPPLEMEN ||
									assetsConfig.CONTRACT_DOWN_SSIGN_SUPPLEMEN
								"
							>
								<!-- 补充协议上传 -->
								<SupplementUpload
									@uploadFiles="getUploadFilesSupplment"
									type="7"
									btnText="上传补充协议"
									:receivalVO="receivalVO"
								/>
							</template>
							<!-- <span style="font-family: PingFangSC-Regular;font-size: 12px;color: #C8CCD5;">单个文件最大支持100M，支持多个上传</span> -->
							<a-table
								bordered
								v-if="editDownContractList.length || (!editDownContractList.length && !supplementalInfo.length)"
								:pagination="false"
								:columns="editFilesColumns"
								:data-source="(editDownContractList || []).filter(i => i.delFlag == 0)"
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
								<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
								<template
									slot="action"
									slot-scope="action, items"
								>
									<a-popconfirm
										v-if="!items.locked"
										title="确定删除该附件?"
										okText="确定"
										cancelText="取消"
										@confirm="() => deleteFiles(items)"
									>
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</template>
							</a-table>
							<a-table
								v-if="supplementalInfo.length"
								bordered
								:dataSource="supplementalInfo"
								:columns="supplementalColumns"
								:rowKey="record => record.index"
								:pagination="false"
								:scroll="{ x: true }"
								style="margin-top: 20px"
							>
								<template
									slot="changeItem"
									slot-scope="text, record"
									v-if="record.changeItem"
								>
									<span
										v-for="(item, index) in record.changeItem.split(',')"
										:key="index"
									>
										{{ filterCodeByValueName(item, 'changeItemEnums') }}
										<span v-if="index < record.changeItem.split(',').length - 1">、</span>
									</span>
								</template>
								<template
									slot="executionDate"
									slot-scope="text, record"
								>
									{{ record.executionDateStart }}
									<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
								</template>
								<template
									slot="name"
									slot-scope="text, record"
								>
									<a
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
										:href="item.url"
										target="_blank"
									>
										{{ item.name }}
										<span v-if="index < record.supplementalFile.length - 1">,</span>
									</a>
								</template>
								<template
									slot="transferName"
									slot-scope="text, record"
								>
									<span
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
									>
										{{ item.transferName || '-' }}
										<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
									</span>
								</template>
								<template
									slot="operation"
									slot-scope="operation, record, index"
								>
									<a-space>
										<a-popconfirm
											title="确定删除该附件信息?"
											okText="确定"
											cancelText="取消"
											@confirm="() => deleteSupplementFiles(record, index)"
										>
											<a
												href="javascript:;"
												class="delete-btn"
												>删除</a
											>
										</a-popconfirm>
									</a-space>
								</template>
							</a-table>
						</template>
						<!-- 下游附件详情展示模块 -->
						<template v-if="!editFlag">
							<a-table
								bordered
								v-if="editDownContractList.length || (!editDownContractList.length && !supplementalInfo.length)"
								:pagination="false"
								:columns="noFileName ? noFileNameFilesColumns : filesColumns"
								:data-source="filterLockFile((editDownContractList || []).filter(i => i.delFlag == 0))"
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
							<a-table
								v-if="supplementalInfo.length"
								bordered
								:dataSource="supplementalInfo"
								:columns="supplementalDetailColumns"
								:rowKey="record => record.index"
								:pagination="false"
								:scroll="{ x: true }"
								style="margin-top: 20px"
							>
								<template
									slot="changeItem"
									slot-scope="text, record"
									v-if="record.changeItem"
								>
									<span
										v-for="(item, index) in record.changeItem.split(',')"
										:key="index"
									>
										{{ filterCodeByValueName(item, 'changeItemEnums') }}
										<span v-if="index < record.changeItem.split(',').length - 1">、</span>
									</span>
								</template>
								<template
									slot="executionDate"
									slot-scope="text, record"
								>
									{{ record.executionDateStart }}
									<span v-if="record.executionDateEnd">~{{ record.executionDateEnd }}</span>
								</template>
								<template
									slot="name"
									slot-scope="text, record"
								>
									<a
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
										:href="item.url"
										target="_blank"
									>
										{{ item.name }}
										<span v-if="index < record.supplementalFile.length - 1">,</span>
									</a>
								</template>
								<template
									slot="transferName"
									slot-scope="text, record"
								>
									<span
										v-for="(item, index) in record.supplementalFile"
										:key="index"
										class="edit-btn"
									>
										{{ item.transferName || '-' }}
										<span v-if="index < record.supplementalFile.length - 1 && item.transferName">,</span>
									</span>
								</template>
							</a-table>
						</template>
					</div>
				</div>
			</div>
			<!-- 贸易背景合同 -->
			<div
				class="tradeBox"
				v-if="assetsConfig.CONTRACT_TRADE_FILE"
			>
				<div class="title">贸易背景合同信息</div>
				<div class="divider"></div>
				<div
					class="content"
					style="padding-bottom: 0"
				>
					<div>
						<p class="sub-title">附件信息</p>
						<!-- 贸易背景合同编辑模块 -->
						<template v-if="editFlag">
							<Upload
								:receivalVO="receivalVO"
								@uploadFiles="(data, type) => getUploadFiles(data, type, 'editTradeContractList')"
								type="ASSET_TRADE_BACKGROUND_CONTRACT"
								btnText="上传贸易背景合同"
							></Upload>
							<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5"
								>单个文件最大支持100M，支持多个上传</span
							>
							<a-table
								v-if="contractInfo.tradeContract"
								:pagination="false"
								:columns="editFilesColumns"
								:data-source="(editTradeContractList || []).filter(i => i.delFlag == 0)"
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
								<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） -->
								<template
									slot="action"
									slot-scope="action, items"
								>
									<a-popconfirm
										v-if="!items.locked"
										title="确定删除该附件?"
										okText="确定"
										cancelText="取消"
										@confirm="() => deleteFiles(items, 'tradeContract')"
									>
										<a href="javascript:;">删除</a>
									</a-popconfirm>
								</template>
							</a-table>
							<div v-else>暂无数据</div>
						</template>
						<!-- 贸易背景合同详情展示模块 -->
						<template v-if="!editFlag">
							<a-table
								v-if="contractInfo.tradeContract"
								:pagination="false"
								:columns="noFileName ? noFileNameFilesColumns : filesColumns"
								:data-source="filterLockFile((editTradeContractList || []).filter(i => i.delFlag == 0))"
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
							<div v-else>暂无数据</div>
						</template>
					</div>
				</div>
			</div>
			<!-- 其它合同 -->
			<div v-if="assetsConfig.CONTRACT_BUSINESSLINE_FILE">
				<ChooseOtherContract
					:data="contractInfo"
					:editFlag="editFlag"
					:lineId="lineId"
					ref="ChooseOtherContract"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import Upload from '../common/Upload.vue';
import SupplementUpload from '../common/SupplementUpload.vue';
import { filterLockFile } from '@/untils/factory.js';
import _ from 'lodash';
import ChooseOtherContract from '../common/ChooseOtherContract.vue';
import { API_STATION } from '@/v2/center/assets/api/index.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

export default {
	name: 'Contract',
	data() {
		let validatePass = (rule, value, callback) => {
			// 校验合同金额
			let regs2 = /^\d+(\.\d{0,2})?$/;
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		let validatePass2 = (rule, value, callback) => {
			// 校验合同金额
			let regs2 = /^\d+(\.\d{0,3})?$/;
			if (!regs2.test(value) || Number(value) > rule.max) {
				return callback(new Error(rule.msg));
			} else {
				return callback();
			}
		};
		return {
			downTerminalContractModify: false, // 是否编辑下游线下合同 默认为false
			filterLockFile: filterLockFile,
			contractDetailColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice', scopedSlots: { customRender: 'basePrice' } },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' }
			],
			upstreamContractDetailData: [], // 上游合同详情数据
			downstreamContractDetailData: [], // 下游合同详情数据
			contractEditColumns: [
				{ title: '标的货物名称', dataIndex: 'goodName', key: 'goodName' },
				{ title: '单价(元/吨)', dataIndex: 'basePrice', key: 'basePrice', scopedSlots: { customRender: 'basePrice' } },
				{ title: '数量(吨)', dataIndex: 'quantity', key: 'quantity' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			filesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' }
			],
			noFileNameFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '文件名', dataIndex: 'transferName', key: 'transferName', scopedSlots: { customRender: 'name' } }
			],

			editFilesColumns: [
				{ title: '单据类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
				{ title: '初始文件名', dataIndex: 'name', key: 'name', scopedSlots: { customRender: 'name' } },
				{ title: '转换文件名', dataIndex: 'transferName', key: 'transferName' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			],
			placeData: [],
			fileInfos: [],
			selectTagsProps: {
				mode: 'tags',
				filterOption: false,
				// tokenSeparators:[',','.'],
				defaultActiveFirstOption: false
			},
			baseInfoForm: {
				contractNo: '',
				contractAmount: '',
				contractSignTime: '',
				// contractExpireDate:'',
				doubleSignTime: '',
				status: '',
				endTime: '',
				execDate: null
			},
			detailForm: {},
			baseInfoRules: {
				contractNo: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
				contractAmount: [{ required: true, message: '合同⾦额不能为空', trigger: 'change' }],
				contractSignTime: [{ required: true, message: '签订⽇期不能为空', trigger: 'change' }],
				// contractExpireDate: [ { required: true, message: '到期⽇期不能为空', trigger: 'change' } ],
				// endTime: [ { required: true, message: '请选择到期日期', trigger: 'change' } ],
				doubleSignTime: [{ required: true, message: '双签版合同获得⽇期不能为空', trigger: 'change' }]
			},
			editContractFlag: false, // 新增、修改合同详情,
			contractDetailForm: {
				goodsName: '',
				contractPrice: '',
				contractQuantity: ''
			},
			contractDetailRules: {
				goodsName: [{ required: true, message: '标的货物名称不能为空', trigger: 'blur' }],
				contractPrice: [
					{ required: true, message: '单价不能为空', trigger: 'blur' },
					{ validator: validatePass2, trigger: 'blur', max: 9999.999, msg: '请输入0-9999.999,最多三位小数' }
				],
				contractQuantity: [
					{ required: true, message: '数量不能为空', trigger: 'change' },
					{ validator: validatePass, trigger: 'blur', max: 9999999999, msg: '请输入0-9999999999,最多两位小数' }
				]
			},
			transForm: {
				transType: undefined,
				trainSendStationName: undefined,
				trainArriveStationName: undefined,
				consigneeCompanyName: undefined,
				consignorCompanyName: undefined,
				receiveGoodsAddress: undefined,
				sendGoodsAddress: undefined,
				shipDischargingPortName: undefined,
				shipLoadingPortName: undefined
			},
			transFormRules: {
				transType: [{ required: true, message: '运输方式不能为空', trigger: 'blur' }],
				trainSendStationName: [{ required: false, message: '发站必填', trigger: 'blur' }],
				trainArriveStationName: [{ required: true, message: '到站必填', trigger: 'blur' }],
				consigneeCompanyName: [{ required: true, message: '收货人名称必填', trigger: 'blur' }],
				consignorCompanyName: [{ required: false, message: '托运人必填', trigger: 'blur' }],
				receiveGoodsAddress: [{ required: true, message: '收货地址必填', trigger: 'blur' }],
				sendGoodsAddress: [{ required: false, message: '发货地址必填', trigger: 'blur' }],
				shipDischargingPortName: [{ required: true, message: '卸货港必填', trigger: 'blur' }],
				shipLoadingPortName: [{ required: true, message: '装货港必填', trigger: 'blur' }]
			},
			downContractInfoFlag: true, // 上游合同基本信息是否填写完整
			downContractFullFlag: true, // 上游合同新增合同详情是否填写完整
			downContractTransFullFlag: true, // 上游合同新增合同运输是否填写完整
			editTradeContractList: [],
			editUpContractList: [],
			editDownContractList: [],
			businessLineContractVO: [],
			assetsConfig: {
				downSingleDisable: false,
				downDoubleDisable: false
			},

			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			supplementalInfo: [], // 下游补充协议附件
			supplementalColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				},
				{
					title: '操作',
					dataIndex: 'operation',
					align: 'center',
					width: 150,
					fixed: 'right',
					scopedSlots: { customRender: 'operation' }
				}
			],
			supplementalDetailColumns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					align: 'center',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.supplementalInfo.length;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '变更项',
					dataIndex: 'changeItem',
					align: 'center',
					scopedSlots: { customRender: 'changeItem' }
				},
				{
					title: '执行期',
					dataIndex: 'executionDate',
					align: 'center',
					scopedSlots: { customRender: 'executionDate' }
				},
				{
					title: '签章状态',
					dataIndex: 'signStatus',
					align: 'center',
					customRender: text => {
						return text == '1' ? '单签' : text == '2' ? '双签' : '';
					}
				},
				{
					title: '签订日期',
					dataIndex: 'signDate',
					align: 'center'
				},
				{
					title: '初始文件名',
					dataIndex: 'name',
					align: 'center',
					scopedSlots: { customRender: 'name' }
				},
				{
					title: '转换文件名',
					dataIndex: 'transferName',
					align: 'center',
					scopedSlots: { customRender: 'transferName' }
				}
			],
			filterCodeByValueName: filterCodeByValueName
		};
	},
	props: ['showEditorRadio', 'editFlag', 'contractInfo', 'noFileName', 'lineId', 'isAdvance', 'receivalVO'],
	components: {
		Upload,
		SupplementUpload,
		ChooseOtherContract
	},

	watch: {
		contractInfo: function (data) {
			// 合同详情数据转成数组格式

			this.dealWithData(data);
		},
		'baseInfoForm.status': function () {
			this.checkAssetsConfig(this.contractInfo);
		}
	},
	mounted() {
		let data = this.contractInfo;
		this.dealWithData(data);
	},
	methods: {
		changeVal(e) {
			this.$emit('changeStatus', e.target.value);
		},
		moment,
		dealWithData(data) {
			if (data) {
				this.dealWithCommonData(data);
			}
		},
		dealWithCommonData(data) {
			this.upstreamContractDetailData = [];
			let obj = {};
			obj.id = 1;
			obj.goodName = data.upContract.goodName;
			obj.basePrice = data.upContract.basePrice || data.upContract.basePriceDesc;
			obj.quantity = data.upContract.quantity;
			if (data.upContract.goodsVOList) {
				this.upstreamContractDetailData = data.upContract.goodsVOList;
			} else {
				this.upstreamContractDetailData.push(obj);
			}

			this.downstreamContractDetailData = [];
			let pro = {};
			pro.id = 1;
			pro.goodName = data.downContract.goodsName;
			pro.basePrice = data.downContract.contractPrice || data.downContract.contractPriceDesc || data.downContract.basePriceDesc;
			pro.quantity = data.downContract.contractQuantity;
			pro.followTheMarket = data.downContract.followTheMarket;

			this.downstreamContractDetailData.push(pro);
			this.contractDetailForm = data.downContract;
			this.baseInfoForm = data.downContract;
			this.baseInfoForm.execDate = [moment(data.downContract.execDateStart), moment(data.downContract.execDateEnd)];

			this.transForm = {
				transType: data.downContract.transType
			};
			if (data.downContract && data.downContract.terminalContractDeliveryVO) {
				let _transform = {};
				for (var key in data.downContract.terminalContractDeliveryVO) {
					var v = data.downContract.terminalContractDeliveryVO[key];
					if (v && v.indexOf && v.indexOf(',') > -1) {
						_transform[key] = v.split(',');
					} else {
						_transform[key] = v || undefined;
					}
				}
				this.transForm = {
					..._transform,
					transType: data.downContract.transType
				};
			}

			this.editTradeContractList = Object.assign([], data.tradeContract ? data.tradeContract.list : []).filter(
				i => i.delFlag == 0
			);
			this.editUpContractList = Object.assign([], data.upContract ? data.upContract.list : []).filter(i => i.delFlag == 0);
			this.editDownContractList = Object.assign([], data.downContract ? data.downContract.list : []).filter(i => i.delFlag == 0);
			this.supplementalInfo = Object.assign([], data.downContract ? data.downContract.supplementalInfo : []);

			this.checkAssetsConfig(data);
		},

		// 资产包配置
		checkAssetsConfig(data) {
			let list = data.bankProductAssetConfigList || [{}];
			this.assetsConfig.downDoubleDisable = _.find(list, { item: 'CONTRACT_DOWN_STATUS_DSIGN' }).status == 0;
			this.assetsConfig.downSingleDisable = _.find(list, { item: 'CONTRACT_DOWN_STATUS_SSIGN' }).status == 0;

			var d = this.baseInfoForm.status == 2;
			var s = this.baseInfoForm.status == 1;

			this.assetsConfig.CONTRACT_DOWN_DSIGN_FILE = d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_FILE' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_SUPPLEMEN =
				d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_SUPPLEMEN' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_BID_PROOF =
				d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_BID_PROOF' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_FILE =
				d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_ONLINE_FILE' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_SUPPLEMEN =
				d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_ONLINE_SUPPLEMEN' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF =
				d && (_.find(list, { item: 'CONTRACT_DOWN_DSIGN_ONLINE_BID_PROOF' }) || {}).status == 1;

			this.assetsConfig.CONTRACT_DOWN_SSIGN_FILE = s && (_.find(list, { item: 'CONTRACT_DOWN_SSIGN_FILE' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_SSIGN_SUPPLEMEN =
				s && (_.find(list, { item: 'CONTRACT_DOWN_SSIGN_SUPPLEMEN' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_DOWN_SSIGN_BID_PROOF =
				s && (_.find(list, { item: 'CONTRACT_DOWN_SSIGN_BID_PROOF' }) || {}).status == 1;

			this.assetsConfig.CONTRACT_TRADE_FILE = (_.find(list, { item: 'CONTRACT_TRADE_FILE' }) || {}).status == 1;
			this.assetsConfig.CONTRACT_BUSINESSLINE_FILE = (_.find(list, { item: 'CONTRACT_BUSINESSLINE_FILE' }) || {}).status == 1;
			this.$forceUpdate();
		},

		checkAssetsSubmit(contractInfo) {
			var fileList = contractInfo.list;
			var businessLineContract = contractInfo.businessLineContract;
			let list = contractInfo.bankProductAssetConfigList || [];
			var obj = {};
			for (var key in this.assetsConfig) {
				if (key.startsWith('CONTRACT_DOWN_')) {
					var o = _.find(list, { item: key });
					if (this.assetsConfig[key] && o.required == 1) {
						if (!fileList.some(i => i.type == o.assetAttachType && i.delFlag == 0)) {
							obj.errorStr = '合同模块-缺少:' + o.itemDesc;
							break;
						}
					}
				}

				if (key.startsWith('CONTRACT_TRADE_FILE')) {
					var o = _.find(list, { item: key });
					if (this.assetsConfig[key] && o.required == 1) {
						if (!fileList.some(i => i.type == o.assetAttachType && i.delFlag == 0)) {
							obj.errorStr = '合同模块-缺少:' + o.itemDesc;
							break;
						}
					}
				}

				if (key.startsWith('CONTRACT_BUSINESSLINE_FILE')) {
					var o = _.find(list, { item: key });
					if (this.assetsConfig[key] && o.required == 1) {
						if (!businessLineContract) {
							obj.errorStr = '合同模块-缺少:其他合同信息';
							break;
						}
					}
				}
			}

			return obj;
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

		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		getUploadFiles(data, type, listKey) {
			// 上传文件 获取附件数据

			if (listKey) {
				this.editTradeContractList.push(data[0]);
			} else {
				this.editDownContractList.push(data[0]);
			}
		},
		deleteFiles(items, listKey) {
			// 删除附件
			if (listKey) {
				this.editTradeContractList[_.findIndex(this.editTradeContractList, { path: items.path })].delFlag = 1;
			} else {
				this.editDownContractList[_.findIndex(this.editDownContractList, { path: items.path })].delFlag = 1;
			}
		},
		getUploadFilesSupplment(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.supplementalInfo.push(item);
			});
		},
		deleteSupplementFiles(items, index) {
			// 删除补协附件
			this.supplementalInfo.splice(index, 1);
		},
		getTime(value, dateString) {
			// 合同签订日期
			this.baseInfoForm.contractSignTime = dateString;
		},
		getExpirTime(value, dateString) {
			// 合同签订日期
			this.baseInfoForm.contractExpireDate = dateString;
		},
		getDoubleTime(value, dateString) {
			// 双签日期
			this.doubleTime = value ? value._d : null;
			this.baseInfoForm.doubleSignTime = dateString;
		},
		getExecTime(value, dateString) {
			// 到期期限
			this.baseInfoForm.execDateStart = dateString[0];
			this.baseInfoForm.execDateEnd = dateString[1];
			this.$forceUpdate();
		},
		validDoubleTime(rule, value, callback) {
			// 验证双签日期
			if (!value) {
				return callback(new Error('请选择合同双签日期'));
			} else {
				const date = new Date();
				if (this.doubleTime > date) {
					return callback(new Error('双签日期不能大于当前日期'));
				}
				return callback();
			}
		},
		validExecTime(rule, value, callback) {
			value = this.baseInfoForm.execDate;
			if (!value[0]) {
				return callback(new Error('请选择合同执行期'));
			}

			return callback();
		},
		changeTransport(v, c) {
			for (var key in this.transForm) {
				if (key != 'transType') {
					this.transForm[key] = undefined;
				}
			}
		},
		onSubmit() {
			// 整体提交

			if (this.editFlag) {
				if (this.$refs.baseInfoForm) {
					this.$refs.baseInfoForm.validate(valid => {
						//提交下游合同基本信息
						this.downContractInfoFlag = valid;
					});
				}
				if (this.$refs.contractDetailForm) {
					this.$refs.contractDetailForm.validate(valid => {
						//提交编辑的下游合同详情
						this.downContractFullFlag = valid;
					});
				}
				if (this.$refs.transForm) {
					this.$refs.transForm.validate(valid => {
						//提交编辑的运输详情
						this.downContractTransFullFlag = valid;
					});
				}

				if (!this.downContractInfoFlag || !this.downContractFullFlag || !this.downContractTransFullFlag)
					return { errorStr: '合同缺失必填项' };
			}

			if (this.$refs.ChooseOtherContract) {
				this.contractInfo.businessLineContract = this.$refs.ChooseOtherContract.getbusData();
			}

			let _transform = {};
			for (var key in this.transForm) {
				var v = this.transForm[key];
				if (Array.isArray(v)) {
					_transform[key] = v.join(',');
				} else {
					_transform[key] = v || null;
				}
			}
			this.contractInfo.downContract.transType = _transform.transType;
			_transform.transportMode = _transform.transType;
			this.contractInfo.downContract.terminalContractDeliveryVO = _transform;

			delete this.contractInfo.downContract.execDate;

			this.contractInfo.list = [...this.editTradeContractList, ...this.editDownContractList];
			this.contractInfo.downContract.supplementalInfo = [...this.supplementalInfo];
			if (!this.contractInfo?.isOnlineContract) {
				this.contractInfo.downContract.list = [...this.editTradeContractList, ...this.editDownContractList];
				this.contractInfo.downContract.downTerminalContractModify = this.editFlag;
			}

			var checkRes = this.checkAssetsSubmit(this.contractInfo);
			if (checkRes && checkRes.errorStr) {
				return checkRes;
			}
			return this.contractInfo;
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	::v-deep& > div {
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
					.ant-form-item-label {
						text-align: left;
					}
					.ant-form-item-children em {
						position: absolute;
						right: -20px;
					}
					.ant-table-fixed-columns-in-body {
						text-align: left;
					}
				}
				& > .ant-row .ant-col .ant-row .ant-col:nth(1) {
					color: #6b6f76;
				}
				& > .ant-row .ant-col .ant-row .ant-col:odd {
					color: #383a3f;
				}
				p:not(.ant-empty-description) {
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
	.doubleSign {
		color: #00ae9d !important;
	}
	.singleSign {
		color: #ff9726 !important;
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
