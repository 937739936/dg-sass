<template>
	<div class="slMain">
		<Breadcrumb :type="type" />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				style="border-bottom: none"
			>
				<span class="slTitle">汽运{{ type == 'IN' ? '上煤' : '下煤' }}计划详情</span>
			</div>
			<a-tabs
				v-model="activeTabKey"
				@change="onTabChange"
			>
				<a-tab-pane
					key="1"
					tab="基本信息"
				>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="运单信息"
				>
				</a-tab-pane>
				<template #tabBarExtraContent>
					<div v-if="detail.status == null || detail.status == 'FINISHED'"></div>
					<div
						v-else
						class="dispatchCarBtn"
						@click="pushToDispatchCar"
					>
						<img
							class="icon"
							src="@/v2/assets/imgs/logisticsPlatform/add_car_icon.png"
							alt=""
						/>
						<span>新增派车信息</span>
					</div>
				</template>
			</a-tabs>
			<div v-show="activeTabKey == '1'">
				<div
					class="slTitleAssis"
					v-if="!isManager"
				>
					计划信息
				</div>
				<a-descriptions
					bordered
					:column="3"
					size="middle"
				>
					<a-descriptions-item label="发货单位">
						{{ detail.deliveryCompanyName || '-' }}
					</a-descriptions-item>
					<a-descriptions-item label="收货单位">
						{{ detail.receivingCompanyName || '-' }}
					</a-descriptions-item>
					<a-descriptions-item
						v-if="detail.releaseInstructInfo && detail.releaseInstructInfo.actualLadingUnit"
						label="实际提货单位"
					>
						{{ detail.releaseInstructInfo.actualLadingUnit || '-' }}
					</a-descriptions-item>
					<a-descriptions-item
						v-if="detail.releaseInstructInfo && detail.releaseInstructInfo.actualReceivingUnit"
						label="实际收货单位"
					>
						{{ detail.releaseInstructInfo.actualReceivingUnit || '-' }}
					</a-descriptions-item>
					<a-descriptions-item label="煤种">
						{{ detail.coalType || '-' }}
					</a-descriptions-item>
					<a-descriptions-item label="仓房">
						{{ detail.house || '-' }}
					</a-descriptions-item>
					<a-descriptions-item label="货位">
						{{ detail.goodsAllocation || '-' }}
					</a-descriptions-item>
					<a-descriptions-item label="货主电话">
						{{ detail.shipperMobile || '无' }}
					</a-descriptions-item>
					<a-descriptions-item :label="type == 'IN' ? '发站' : '到站'">
						{{ detail.sendStation || '无' }}
					</a-descriptions-item>
					<a-descriptions-item label="计划吨数">
						{{ detail.planWeight || '无' }}
					</a-descriptions-item>
					<a-descriptions-item label="收货地址">
						<a-tooltip v-if="detail.receiveAddress">
							<a
								href="javascript:;"
								@click="openAddress"
							>
								{{ detail.addressKeywords || detail.receiveAddress || '无' }}
							</a>
							<template slot="title">
								{{ detail.receiveAddress || detail.addressKeywords || '无' }}
							</template>
						</a-tooltip>
						<span v-else>无</span>
					</a-descriptions-item>
					<a-descriptions-item label="备注">
						<a-tooltip>
							<template
								slot="title"
								v-if="detail.remark && detail.remark.length > 15"
							>
								<span>{{ detail.remark }}</span>
							</template>
							<span>{{ detail.remark || '-' }}</span>
						</a-tooltip>
					</a-descriptions-item>
				</a-descriptions>
				<template v-if="!isManager">
					<div
						class="slTitleAssis"
						style="margin-top: 50px"
					>
						合同信息
					</div>
					<template v-if="detail.onlineContract || detail.offlineContract || true">
						<a-descriptions
							v-if="detail.onlineContract"
							bordered
							:column="3"
							size="middle"
						>
							<a-descriptions-item label="合同编号">
								<span>
									<div
										@mouseenter="onMouseOverContractNo"
										@mouseleave="onMouseOutContractNo"
										style="diaplay: inline-block"
									>
										<a
											v-if="authFlag"
											:href="
												'/center/contract/' +
												contractType.toLocaleLowerCase() +
												'/online/detail?id=' +
												detail.onlineContract.id +
												'&type=' +
												contractType
											"
											target="_new"
										>
											{{ detail.contractNo }}
										</a>
										<span v-else>{{ detail.contractNo }}</span>
										<Copy
											v-show="!copyContractNoVisible"
											class="copy-icon"
										></Copy>
										<span
											v-show="copyContractNoVisible"
											v-clipboard:copy="detail.contractNo"
											v-clipboard:success="onCopy"
											v-clipboard:error="onError"
										>
											<CopyNow class="copy-icon"></CopyNow>
										</span>
									</div>
								</span>
							</a-descriptions-item>
							<a-descriptions-item label="订单编号">{{ detail.orderNo }} </a-descriptions-item>
							<a-descriptions-item label="基准价格">
								<span v-if="detail.onlineContract.basePrice">{{ detail.onlineContract.basePrice | formatMoney(3) }}元/吨</span>
								<span v-if="detail.onlineContract.basePriceDesc">{{ detail.onlineContract.basePriceDesc }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="数量">
								<span
									>{{ detail.onlineContract.quantity | formatMoney(3) }}吨<template v-if="detail.onlineContract.quantityOffset"
										>（±{{ detail.onlineContract.quantityOffset }}%）</template
									></span
								>
							</a-descriptions-item>
							<a-descriptions-item label="交货期限">
								<span>{{ detail.onlineContract.deliveryStartDate }}至{{ detail.onlineContract.deliveryEndDate }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="运输方式">{{ detail.onlineContract.transportModeDesc || '无' }}</a-descriptions-item>
							<a-descriptions-item label="交货方式">{{ detail.onlineContract.deliveryModeDesc || '无' }}</a-descriptions-item>
							<a-descriptions-item label="产地">{{ detail.onlineContract.originPlace || '无' }}</a-descriptions-item>
							<a-descriptions-item label="发货点">{{ detail.onlineContract.sendGoodsAddress || '无' }}</a-descriptions-item>
							<a-descriptions-item label="托运人">{{ detail.onlineContract.consignorCompanyName || '无' }}</a-descriptions-item>
							<a-descriptions-item label="收货人">{{ detail.onlineContract.consigneeCompanyName || '无' }}</a-descriptions-item>
							<a-descriptions-item label="运费支付方式">{{
								detail.onlineContract.freightPayModeDesc || '无'
							}}</a-descriptions-item>
							<a-descriptions-item
								v-if="detail.onlineContract.freightPayModeOther"
								label="其他运费支付方式"
								>{{ detail.onlineContract.freightPayModeOther || '无' }}</a-descriptions-item
							>
						</a-descriptions>
						<a-descriptions
							v-if="detail.offlineContract"
							bordered
							:column="3"
							size="middle"
						>
							<a-descriptions-item label="合同编号">
								<span>
									<div
										@mouseenter="onMouseOverContractNo"
										@mouseleave="onMouseOutContractNo"
									>
										<a
											v-if="authFlag"
											:href="
												'/center/contract/' +
												contractType.toLocaleLowerCase() +
												'/offline/detail?type=' +
												contractType +
												'&id=' +
												detail.offlineContract.id
											"
											target="_new"
										>
											{{ detail.offlineContract.paperContractNo }}
										</a>
										<span v-else>{{ detail.offlineContract.paperContractNo }}</span>
										<Copy
											v-show="!copyContractNoVisible"
											class="copy-icon"
										></Copy>
										<span
											v-show="copyContractNoVisible"
											v-clipboard:copy="detail.offlineContract.paperContractNo"
											v-clipboard:success="onCopy"
											v-clipboard:error="onError"
										>
											<CopyNow class="copy-icon"></CopyNow>
										</span>
									</div>
								</span>
							</a-descriptions-item>
							<a-descriptions-item label="基准价格">
								<span>{{ detail.offlineContract.contractPrice | formatMoney(3) }}元/吨</span>
							</a-descriptions-item>
							<a-descriptions-item label="数量">
								<span>{{ detail.offlineContract.contractQuantity | formatMoney(3) }}吨</span>
							</a-descriptions-item>
							<a-descriptions-item label="交货期限">
								<span>{{ detail.offlineContract.execDateStart }}至{{ detail.offlineContract.execDateEnd }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="运输方式">
								<span>{{ detail.offlineContract.transportModeDesc || '无' }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="发货地址">
								<span>{{ detail.offlineContract.sendGoodsAddress || '无' }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="收货地址">
								<span>{{ detail.offlineContract.receiveGoodsAddress || '无' }}</span>
							</a-descriptions-item>
							<a-descriptions-item label="收货人名称">
								<span>{{ detail.offlineContract.consigneeCompanyName || '无' }}</span>
							</a-descriptions-item>
						</a-descriptions>
					</template>
					<div
						v-else
						class="contract-empty-box"
					>
						<img
							src="@/v2/assets/imgs/contract/no_businessline_bg.png"
							alt=""
							style="width: 66px"
						/>
						<a-button
							type="primary"
							class="slBtn"
							@click="showRelationContractList"
							>关联合同</a-button
						>
					</div>
					<div v-show="detail.onlineContract || detail.offlineContract">
						<BusinessLine
							:type="type"
							ref="businessLine"
							action="view"
						></BusinessLine>
					</div>
					<div v-show="detail.releaseInstructInfo">
						<ReleaseInstruct
							ref="releaseInstruct"
							:type="type"
							action="view"
						/>
					</div>
				</template>
			</div>

			<template
				v-if="activeTabKey == '2'"
				style="margin-top: 30px"
			>
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
					@resetFunc="resetFunc"
				></SlFormNew>
				<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
					<div
						class="export-box"
						@click="doExport"
					>
						<ExportIcon class="export-icon"></ExportIcon>
						<span class="export-text">数据导出</span>
					</div>
					<a-table
						class="new-table"
						:bordered="false"
						:columns="columns"
						:rowKey="record => record.id"
						:dataSource="dataSource"
						:pagination="false"
						:loading="tableLoading"
						:scroll="{ x: true }"
					>
						<template
							slot="typeAction"
							slot-scope="action, record"
						>
							<span>{{ getTypeWithEng(record.generateType) }}</span>
						</template>
						<template
							slot="action"
							slot-scope="action, record"
						>
							<a-space :size="24">
								<a
									@click.prevent="openDetail(record.id)"
									v-auth="'logisticsStorageCenter:outManage:outCoalPlan:truckingOrder:view'"
									>查看</a
								>
								<!-- 修改车牌号功能暂时隐藏 -->
								<!-- <a
                  @click.prevent="openEditPlate(record)"
                  v-auth="'logisticsStorageCenter:outManage:outCoalPlan:truckingOrder:modifyLicensePlateNumber'"
                  v-if="record.status =='NOT_MARCH_IN'"
                >修改车牌号</a> -->
								<a
									@click.prevent="onEditTruckingOrder(record)"
									v-if="record.status != 'MARCH_OUT' && record.status != 'SECOND_WEIGH'"
									>修改运单</a
								>
								<a
									@click.prevent="onDelete(record.id)"
									v-auth="'logisticsStorageCenter:outManage:outCoalPlan:truckingOrder:delete'"
									v-if="record.status == 'NOT_MARCH_IN' || record.status == 'DEPARTURE_REGISTRATION'"
									>删除</a
								>
							</a-space>
						</template>
					</a-table>
					<i-pagination
						:pagination="pagination"
						@change="getList"
					/>
				</div>
			</template>
		</a-card>

		<a-modal
			:visible="updateDeliverVisible"
			title="修改运单"
			:forceRender="true"
			@ok="saveDeliverInfo"
			class="slModal"
			@cancel="cancelDeliverInfo"
			width="530px"
		>
			<template #footer>
				<a-button @click="cancelDeliverInfo">取消</a-button>
				<a-button
					type="primary"
					@click="saveDeliverInfo"
					>保存</a-button
				>
			</template>

			<div v-if="type == 'IN'">
				<a-form
					class="slFormDetail"
					:form="truckForm"
					:colon="false"
				>
					<div style="display: none">
						<a-form-item label="id">
							<a-input v-decorator="['id']" />
						</a-form-item>
					</div>

					<div style="display: none">
						<a-form-item label="planId">
							<a-input v-decorator="['planId']" />
						</a-form-item>
					</div>
					<div style="display: none">
						<a-form-item label="planNo">
							<a-input v-decorator="['planNo']" />
						</a-form-item>
					</div>

					<a-row :gutter="24">
						<a-col :span="12">
							<a-form-item
								label="车牌号"
								class="formItem"
							>
								<a-input
									placeholder="请输入车牌号"
									disabled
									v-decorator="['licensePlateNumber', {}]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="司机姓名">
								<a-input
									placeholder="请输入司机姓名"
									:disabled="inputStatus"
									v-decorator="[
										'driverName',
										{
											rules: [
												{
													max: 50,
													message: '长度不能超过50个字符',
													whitespace: false
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="24">
						<a-col :span="12">
							<a-form-item label="司机电话">
								<a-input
									placeholder="请输入司机电话"
									:disabled="inputStatus"
									v-decorator="[
										'driverMobile',
										{
											rules: [
												{ required: false, message: '请输入手机号!' },
												{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的电话号码' }
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="矿发时间">
								<a-date-picker
									v-decorator="[`loadingDate`, { rules: [{ required: false, message: `请选择矿发时间` }] }]"
									type="date"
									:showTime="{ format: 'HH:mm' }"
									value-format="YYYY-MM-DD HH:mm"
									format="YYYY-MM-DD HH:mm"
									style="width: 100%"
									placeholder="请选择矿发时间"
								>
									<span
										slot="suffixIcon"
										class="calendar"
									></span>
								</a-date-picker>
							</a-form-item>
						</a-col>
					</a-row>

					<a-row :gutter="24">
						<a-col :span="12">
							<a-form-item label="矿发净重(吨)">
								<a-input-number
									style="width: 100%"
									:max="200"
									:step="0.01"
									:precision="2"
									placeholder="请输入矿发净重"
									v-decorator="['loadingWeight']"
								/>
							</a-form-item>
						</a-col>
					</a-row>

					<a-form-item>
						<div
							slot="label"
							style="display: inline-block"
						>
							矿发磅单<span
								class="labelTips"
								style="color: #77889d"
								>支持上传单张图片，图片大小不得超过100MB</span
							>
						</div>
						<div v-if="!this.truckImg">
							<a-upload
								name="file"
								:action="truckAction"
								listType="picture-card"
								:headers="headers"
								:multiple="false"
								accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp"
								:before-upload="beforeUpload"
								:showUploadList="false"
								@change="handleFileChange"
							>
								<a-spin :spinning="loading">
									<img
										:src="addBg"
										class="file_icon"
									/>
								</a-spin>
							</a-upload>
						</div>
						<div
							v-else
							class="trunkGroupClass"
						>
							<img
								class="truchImgClass"
								:src="this.truckImg"
								width="60px"
								height="60px"
								@click="handleOpenPreview"
							/>
							<img
								class="iconDelteClass"
								:src="this.iconDelete"
								width="14px"
								height="14px"
								@click="deleteTruckImg"
							/>
						</div>
					</a-form-item>
					<a-modal
						width="700px"
						height="700px"
						:visible="truckPreviewVisiable"
						:footer="null"
						@cancel="handlePreviewCancel"
					>
						<a
							:href="truckImg"
							target="_blank"
						>
							<img
								alt="example"
								style="width: 100%"
								:src="truckImg"
							/>
						</a>
					</a-modal>
				</a-form>
			</div>
			<div v-else>
				<a-form
					class="slFormDetail"
					:form="truckForm"
					:colon="false"
				>
					<div style="display: none">
						<a-form-item label="id">
							<a-input v-decorator="['id']" />
						</a-form-item>
					</div>

					<div style="display: none">
						<a-form-item label="planId">
							<a-input v-decorator="['planId']" />
						</a-form-item>
					</div>
					<div style="display: none">
						<a-form-item label="planNo">
							<a-input v-decorator="['planNo']" />
						</a-form-item>
					</div>

					<a-form-item
						label="车牌号"
						class="formItem"
					>
						<a-input
							placeholder="请输入车牌号"
							disabled
							v-decorator="['licensePlateNumber', {}]"
						/>
					</a-form-item>

					<a-form-item label="司机姓名">
						<a-input
							placeholder="请输入司机姓名"
							v-decorator="[
								'driverName',
								{
									rules: [
										{
											max: 50,
											message: '长度不能超过50个字符',
											whitespace: false
										}
									]
								}
							]"
						/>
					</a-form-item>

					<a-form-item label="司机电话">
						<a-input
							placeholder="请输入司机电话"
							v-decorator="[
								'driverMobile',
								{
									rules: [
										{ required: false, message: '请输入手机号!' },
										{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的电话号码' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-form>
			</div>
			<div class="line"></div>
		</a-modal>
		<a-modal
			:visible="plateVisible"
			title="修改车牌号"
			@ok="savePlate"
			@cancel="cancelPlate"
			:forceRender="true"
		>
			<template #footer>
				<a-button @click="cancelPlate">取消</a-button>
				<a-button
					type="primary"
					@click="savePlate"
					:loading="savePlateLoading"
					>确定</a-button
				>
			</template>
			<a-form
				:form="plateForm"
				:label-col="{ span: 5 }"
				:wrapper-col="{ span: 16 }"
			>
				<div style="display: none">
					<a-form-item label="id">
						<a-input v-decorator="['id']" />
					</a-form-item>
				</div>
				<a-form-item label="车牌号">
					<a-input
						placeholder="请输入车牌号"
						v-decorator="[
							'licensePlateNumber',
							{
								rules: [{ required: true, message: '请输入车牌号' }, { validator: validLicencePlate }]
							}
						]"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			:visible="detailVisible"
			title="派车单详情"
			width="80%"
			@cancel="detailClose"
			class="slModal"
			:footer="null"
		>
			<a-card
				title="车辆信息"
				bordered
				size="small"
				style="margin-bottom: 20px"
			>
				<ul class="grid-wrap">
					<li>
						<span class="label">车牌号</span>
						<span>{{ truckingOrderDetail.licensePlateNumber }}</span>
					</li>
					<li>
						<span class="label">司机姓名</span>
						<span>{{ truckingOrderDetail.driverName }}</span>
					</li>
					<li>
						<span class="label">司机电话</span>
						<span>{{ truckingOrderDetail.driverMobile }}</span>
					</li>
				</ul>
			</a-card>
			<a-card
				title="称重信息"
				bordered
				size="small"
			>
				<ul
					class="grid-wrap"
					style="margin-bottom: 20px"
				>
					<li>
						<span class="label">{{ typestr }}库净重(吨)</span>
						<span class="red">{{ truckingOrderDetail.netWeight || '-' }}</span>
					</li>
					<li>
						<span class="label">{{ typestr }}库毛重(吨)</span>
						<span>{{ truckingOrderDetail.grossWeight || '-' }}</span>
					</li>
					<li>
						<span class="label">{{ typestr }}库皮重(吨)</span>
						<span>{{ truckingOrderDetail.tareWeight || '-' }}</span>
					</li>
					<li v-if="type == 'IN'">
						<span class="label">矿发净重(吨)</span>
						<span>{{ truckingOrderDetail.loadingWeight || '-' }}</span>
					</li>
					<li v-if="type == 'IN'">
						<span class="label">亏损(吨)</span>
						<span>{{ truckingOrderDetail.lossWeight || '-' }}</span>
					</li>
					<li v-if="type == 'IN'">
						<span class="label">扣水、杂(吨)</span>
						<span>{{ truckingOrderDetail.otherWeight || '-' }}</span>
					</li>
					<li v-if="type == 'IN'">
						<span class="label">
							<div class="kfbdStyle">
								矿发磅单
								<a-tooltip>
									<template slot="title"> 支持上传单张图片,图片大小不得超过100MB </template>
									<img
										:src="truckInstr"
										style="height: 14px; width: 14px; margin-left: 3px"
									/>
								</a-tooltip>
							</div>
						</span>
						<span
							v-if="detailTrunkPreview"
							class="detailTruckNameGroupStyle"
						>
							<!-- <img
                                    :src="stationImgUrl(truckingOrderDetail.loadingTicket)"
                                    alt="矿发磅单"
                                    @click="
                                        handlePreview(stationImgUrl(truckingOrderDetail.loadingTicket))
                                    "
                                /> -->
							<a-tooltip>
								<template slot="title">
									{{ this.detailTrunkTime }}
								</template>

								<div class="detailTruckNameStyle">
									<span
										class="detailTruckNameText"
										@click="handleDetailPreview()"
										>{{ this.detailTrunkName }}</span
									>
									<img
										:src="this.detailDelete"
										width="14px"
										height="14px"
										@click="deleteDetailTruckImg"
									/>
								</div>
							</a-tooltip>
							<a-modal
								width="700px"
								height="700px"
								:visible="detailPreviewVisiable"
								:footer="null"
								@cancel="cancelDetailPreview"
							>
								<a
									:href="detailTrunkPreview"
									target="_blank"
								>
									<img
										alt="example"
										style="width: 100%"
										:src="detailTrunkPreview"
									/>
								</a>
							</a-modal>
						</span>
						<div
							class="detailUploadStyle"
							v-else
						>
							<a-upload
								name="file"
								:action="truckAction"
								listType="picture-card"
								:headers="headers"
								:multiple="false"
								accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp"
								:before-upload="beforeUpload"
								:showUploadList="false"
								@change="handleDetailUploadChange"
							>
								<a-button
									type="primary"
									:ghost="true"
									class="uploadBtnStyle"
									>上传</a-button
								>
							</a-upload>
						</div>
					</li>
					<li v-if="type == 'IN'">
						<span class="label">矿发时间</span>
						<span>{{ truckingOrderDetail.loadingDate }}</span>
					</li>
					<li>
						<span class="label">过毛时间</span>
						<span>{{ truckingOrderDetail.grossWeightTime }}</span>
					</li>
					<li>
						<span class="label">过皮时间</span>
						<span>{{ truckingOrderDetail.tareWeightTime }}</span>
					</li>
					<li>
						<span class="label">场收员</span>
						<span>{{ truckingOrderDetail.unloadingName || '-' }}</span>
					</li>
					<li v-if="type == 'IN'">
						<span class="label"></span>
						<span></span>
					</li>
				</ul>
				<a-table
					class="new-table"
					:bordered="false"
					:columns="weightColumns"
					:rowKey="record => record.id"
					:dataSource="truckingOrderDetail.weighRecords || []"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="images"
						slot-scope="truckPic, record"
					>
						<div class="images">
							<div
								class="image"
								v-for="(item, index) in record.attachList"
								:key="index"
							>
								<img
									:src="item.url"
									:alt="item.typeDesc"
									@click="handlePreview(item.url)"
								/>
							</div>
						</div>
					</template>
					<template
						slot="weighCounter"
						slot-scope="text, record"
					>
						<span v-if="text == 1">第一次过磅</span>
						<span v-else-if="text == 2">第二次过磅</span>
						<span v-else>-</span>
					</template>
				</a-table>
			</a-card>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>

		<RelationContract
			ref="relationContract"
			@relation="goCreate"
			source="list"
			:type="detail.type"
			querySource="COAL_PALN"
		/>
		<ConfirmModal ref="confirm"></ConfirmModal>
		<AddressCheckPort
			ref="checkPort"
			@selectPort="selectPort"
		/>
	</div>
</template>
<script>
import {
	getCoalPlanDetail,
	getTruckingOrderList,
	getTruckingOrderDetail,
	truckingOrderEdit,
	truckingOrderDelete,
	truckingOrderExport,
	truckingUpdateEdit,
	truckingFileUpdate,
	deleteTruckingFileUpdate
} from '../api';
import { API_UPLOAD_STATION } from '@/v2/center/storage/api';
import { validLicencePlate } from '@/v2/utils/validForm';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import iPagination from '@sub/components/iPagination';
import RelationContract from './inOut/components/relationContract.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_USERCOMPANYSERVICE } from '@/v2/api/account';
import addBg from '@/assets/imgs/logisticsPlatform/add_bd.png';
import iconDelete from '@/assets/imgs/logisticsPlatform/icon_truck_delete.png';
import detailDelete from '@/assets/imgs/logisticsPlatform/delete_truck.png';
import truckInstr from '@/assets/imgs/logisticsPlatform/truck_instr.png';
import ENV from '@/v2/config/env';
import ConfirmModal from 'v2/components/modal/ConfirmModal';
import BusinessLine from '../components/coalPlan/BusinessLine.vue';
import ReleaseInstruct from '../components/coalPlan/ReleaseInstruct.vue';
import { existRelOrder } from '../api/inout';
import AddressCheckPort from '@/v2/center/logisticsPlatform/components/coalPlan/AddressCheckPort';
import { ExportIcon, Copy, CopyNow } from '@sub/components/svg';
const weightColumns = [
	{
		title: '过磅地址',
		key: 'scaleNo',
		dataIndex: 'scaleNo'
	},
	{
		title: '过磅次数',
		key: 'weighCounter',
		dataIndex: 'weighCounter',
		scopedSlots: { customRender: 'weighCounter' }
	},
	{
		title: '司磅员',
		key: 'weighName',
		dataIndex: 'weighName'
	},
	{
		title: '过磅图片',
		key: 'truckPic',
		dataIndex: 'truckPic',
		scopedSlots: { customRender: 'images' }
	}
];
const searchList = [
	{
		decorator: ['licensePlateNumber'],
		addonBeforeTitle: '车牌号',
		type: 'input',
		placeholder: '请输入车牌号'
	},
	{
		decorator: ['generateType'],
		addonBeforeTitle: '派车方式',
		type: 'select',
		placeholder: '请选择',
		options: [
			{
				title: '司机扫码',
				value: 'DRIVER_SCAN'
			},
			{
				title: '手动录入',
				value: 'MANUAL'
			}
		]
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		options: []
	},
	{
		decorator: ['createdDate'],
		addonBeforeTitle: '派车时间',
		type: 'rangePicker',
		realKey: ['startDate', 'endDate']
	}
];
export default {
	mixins: [ListMixin],
	components: {
		iPagination,
		RelationContract,
		Breadcrumb,
		ConfirmModal,
		BusinessLine,
		ReleaseInstruct,
		AddressCheckPort,
		ExportIcon,
		Copy,
		CopyNow
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_STATIONALLCODE: 'VUEX_ST_STATIONALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		authFlag() {
			return this.VUEX_ST_USERAUTH.includes('dgChain') && this.VUEX_ST_USERAUTH.includes('dgChain:contract');
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	data() {
		let { type } = this.$route.params;
		let { id } = this.$route.query;
		const activeTabKey = this.$storage.session.get('coalPlanDetail.activeTabKey');
		return {
			addBg,
			iconDelete,
			searchList,
			detailDelete,
			truckInstr,
			type,
			id,
			loading: false,
			typestr: type == 'IN' ? '入' : '出',
			contractType: type === 'IN' ? 'BUY' : 'SELL',
			activeTabKey: activeTabKey || '2',
			detail: {},
			openDetailId: '',
			columns: renderColumn(type),
			tableLoading: false,
			dataSource: [{ id: '1' }],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			plateVisible: false,
			savePlateLoading: false,
			updateDeliverVisible: false,
			inputStatus: false,
			plateForm: this.$form.createForm(this),
			searchForm: this.$form.createForm(this),
			truckForm: this.$form.createForm(this),
			detailVisible: false,
			weightColumns,
			weightData: [],
			truckingOrderStatusList: [],
			truckingOrderDetail: {},
			loadingScaleFile: {},
			truckPreviewVisiable: false,
			detailPreviewVisiable: false,
			validLicencePlate,
			previewImg: '',
			truckAction: API_UPLOAD_STATION,
			truckImg: '',
			detailTrunkPreview: '',
			detailTrunkName: '',
			detailTrunkTime: '',
			url: {
				list: getTruckingOrderList
			},
			defaultParams: {
				type,
				planId: id
			},
			copyContractNoVisible: false,
			addressInfo: {}
		};
	},

	mounted() {
		let statusDict = this.VUEX_ST_STATIONALLCODE.truckingOrderRestStatusDict;
		this.truckingOrderStatusList = Object.keys(statusDict).map(key => {
			return {
				value: key,
				label: statusDict[key]
			};
		});
		this.searchList.forEach(item => {
			if (item.decorator[0] === 'status') {
				item.options = this.truckingOrderStatusList;
			}
		});
		this.doFetch();
	},
	methods: {
		getTypeWithEng(type) {
			return type == 'MANUAL' ? '手动录入' : '司机扫码';
		},
		isIn() {
			let result = this.type == 'IN';
			return result;
		},
		openAddress() {
			let { receiveArea, receiveAddress, receiveLongitude, receiveLatitude, receiveElectronicFenceRadius } = this.detail;
			if (receiveLongitude && receiveLatitude) {
				this.addressInfo = {
					receiveArea,
					receiveAddress,
					receiveLongitude,
					receiveLatitude,
					receiveElectronicFenceRadius
				};
			}
			this.$refs.checkPort.show(this.addressInfo, false);
		},

		selectPort(res) {
			this.addressInfo = res;
		},

		cancelDetailPreview() {
			this.detailPreviewVisiable = false;
		},
		handleDetailPreview() {
			this.detailPreviewVisiable = true;
		},
		handleOpenPreview() {
			this.truckPreviewVisiable = true;
		},

		deleteDetailTruckImg() {
			this.$refs.confirm.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该附件吗，删除后无法恢复',
				confirm: () => {
					deleteTruckingFileUpdate(this.openDetailId).then(result => {
						if (!result.success) {
							this.$message.error('操作失败');
							return;
						}
						this.detailTrunkName = null;
						this.detailTrunkTime = null;
						this.detailTrunkPreview = null;
						this.$message.success('操作成功');
						this.getList();
					});
				}
			});
		},
		deleteTruckImg() {
			this.$refs.confirm.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该附件吗，删除后无法恢复',
				confirm: () => {
					this.truckImg = '';
				}
			});
		},

		handlePreviewCancel() {
			this.truckPreviewVisiable = false;
			this.truckForm.resetFields();
		},
		beforeUpload(file) {
			const isIMG =
				file.type === 'image/jpeg' ||
				file.type === 'image/jpg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif' ||
				file.type === 'image/bmp';
			if (!isIMG) {
				this.$message.error('仅支持bmp，jpg，jpeg，png，gif的格式');
				setTimeout(() => {
					this.fileList = [];
				}, 1);
				return false;
			}
			const isLt = file.size / 1024 / 1024 < 100;
			if (!isLt) {
				this.$message.error('图片不能大于100M');
				setTimeout(() => {
					this.fileList = [];
				}, 1);
				return;
			}
			this.file = file;
		},

		stationImgUrl(url) {
			let realUrl = url;
			if (/^http/.test(url)) {
				realUrl = url;
			}
			return realUrl;
		},

		onTabChange(key) {
			this.activeTabKey = key;
			this.$storage.session.set('coalPlanDetail.activeTabKey', key);
		},
		resetFunc() {},
		handleDetailUploadChange({ file }) {
			if (file.status == 'done') {
				let respPath = file.response.data.path;
				this.detailTrunkPreview = this.stationImgUrl(respPath);
				this.truckingOrderDetail.loadingTicket = respPath;
				this.detailTrunkName = file.response.data.name;
				this.detailTrunkTime = file.response.data.createdDate;
				let body = {
					fileUrl: respPath,
					fileName: this.detailTrunkName,
					md5Hex: file.response.data.md5Hex
				};
				truckingFileUpdate(this.openDetailId, body).then(result => {
					if (!result.success) {
						return;
					}
					this.$message.success('操作成功');
					this.getList();
				});
			}

			if (file.status == 'error') {
				// this.$message.error(item.response.error.message)
			}
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			let str = this.searchParams.licensePlateNumber || '';
			this.searchParams.licensePlateNumber = str.replace(/(^\s*)|(\s*$)/g, '');
			this.changeSearch(data);
		},
		handleFileChange({ file }) {
			this.loading = true;
			if (file.status == 'done') {
				this.loading = false;
				let respPath = file.response.data.path;
				this.truckImg = this.stationImgUrl(respPath);

				this.loadingScaleFile = {
					fileUrl: file.response.data.path,
					fileName: file.response.data.name,
					md5Hex: file.response.data.md5Hex
				};
			}
			if (file.status == 'error') {
				this.loading = false;
				// this.$message.error(item.response.error.message)
			}
		},
		doFetch() {
			getCoalPlanDetail({ id: this.id }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.detail = data;
				this.detail.copyContractNoVisible = false;
				if (data.businessLineNo) {
					this.$nextTick(() => {
						this.$refs.businessLine.setData([data.businessLineInfo]);
					});
				}
				if (data.releaseInstructInfo) {
					this.$nextTick(() => {
						this.$refs.releaseInstruct.setData([data.releaseInstructInfo]);
					});
				}
			});
		},
		doExport() {
			truckingOrderExport({ planId: this.id, ...this.searchParams }).then(res => {
				comDownload(res.data, null, res.name);
			});
		},
		onDelete(id) {
			this.$confirm({
				title: '提示',
				content: '删除后该数据将不能恢复，确定删除吗?',
				onOk: () => {
					truckingOrderDelete({ id }).then(result => {
						if (!result.success) {
							return;
						}
						this.$message.success('操作成功');
						this.getList();
					});
				}
			});
		},
		//详情
		getTruckingOrderDetail(id) {
			getTruckingOrderDetail({ id }).then(result => {
				if (!result.success) {
					return;
				}
				this.truckingOrderDetail = result.data;
				if (this.truckingOrderDetail.poundFile != null) {
					this.detailTrunkPreview = this.stationImgUrl(this.truckingOrderDetail.poundFile.fileUrl);
					this.detailTrunkName = this.truckingOrderDetail.poundFile.fileName;
					this.detailTrunkTime = this.truckingOrderDetail.poundFile.createdDate;
				} else {
					this.detailTrunkPreview = '';
					this.detailTrunkName = '';
					this.detailTrunkTime = '';
				}
			});
		},
		openEditPlate(data) {
			this.plateVisible = true;
			this.plateForm.setFieldsValue({
				licensePlateNumber: data.licensePlateNumber,
				id: data.id
			});
		},
		saveDeliverInfo() {
			this.truckForm.validateFields((error, values) => {
				if (error) {
					this.truckForm.validateTrigger();
					return;
				}
				let body = {
					planId: this.id,
					truckList: [{ ...values, loadingScaleFile: this.loadingScaleFile }]
				};
				this.updateDeliverVisible = false;
				truckingUpdateEdit(body).then(result => {
					if (!result.success) {
						return;
					}
					this.$message.success('操作成功');
					this.truckImg = '';
					this.getList();
				});
			});
		},
		cancelDeliverInfo() {
			this.updateDeliverVisible = false;
			this.truckImg = '';
		},

		savePlate() {
			this.plateForm.validateFields((error, values) => {
				if (error) {
					return;
				}
				this.savePlateLoading = true;
				truckingOrderEdit({ ...values })
					.then(result => {
						this.savePlateLoading = false;
						if (!result.success) {
							return;
						}
						this.$message.success('操作成功');
						this.cancelPlate();
						this.getList();
					})
					.finally(() => {
						this.savePlateLoading = false;
					});
			});
		},
		cancelPlate() {
			this.plateVisible = false;
			this.plateForm.resetFields();
		},
		openDetail(id) {
			this.detailVisible = true;
			this.getTruckingOrderDetail(id);
			this.openDetailId = id;
		},
		detailClose() {
			this.detailVisible = false;
		},
		handlePreview(src) {
			this.previewImg = src;
			this.$refs.viewer.$viewer.show();
		},
		showRelationContractList() {
			const params = {
				stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
				inOutTypeEnum: this.type,
				querySource: 'COAL_PALN'
			};
			existRelOrder(params).then(({ success, data }) => {
				if (!success) {
					return;
				}
				if (data === true) {
					this.$refs.relationContract.show();
					return;
				}
				this.goCreate();
			});
		},
		goCreate(selected) {
			const query = { id: this.id };
			if (selected) {
				query.serialNo = selected.serialNo;
				query.orderTypeEnum = selected.contractType;
			}
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/create`,
				query
			});
		},
		// getRelatedData(data) {
		//   const dataObj = {
		//     contractNo: data.contractNo,
		//     orderNo: data.serialNo,
		//     contractType: data.contractType,
		//     type: this.type,
		//     coalPlanNoList: [this.detail.serialNo],
		//     upContract: false,
		//   };
		//   if (data.contractType === "OFFLINE") {
		//     dataObj.contractNo = data.paperContractNo;
		//     dataObj.contractSerialNo = data.contractNo;
		//   }
		//   API_updateContract(dataObj).then((res) => {
		//     if (res.success && res.data) {
		//       this.doFetch();
		//     }
		//   });
		// },
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		onEditTruckingOrder(item) {
			this.truckForm.setFieldsValue({
				id: item.id,
				planId: item.planId,
				planNo: item.planNo,
				licensePlateNumber: item.licensePlateNumber,
				driverName: item.driverName,
				driverMobile: item.driverMobile,
				loadingDate: item.loadingDate,
				loadingWeight: item.loadingWeight
			});
			this.loadingScaleFile = item.poundFile;
			if (item.poundFile != null) {
				this.truckImg = this.stationImgUrl(item.poundFile.fileUrl);
			} else {
				this.trunkImg = '';
			}
			if (item.generateType == 'MANUAL') {
				this.inputStatus = false;
			} else {
				this.inputStatus = true;
			}
			this.updateDeliverVisible = true;
			this.isIn();
		},
		pushToDispatchCar() {
			this.$router.push({
				path: `/center/logisticsPlatform/coalplan/${this.type}/dispatchCarInput`,
				query: {
					coalplanId: this.id,
					contractType: this.contractType,
					title: '新增派车信息'
				}
			});
		}
	}
};

function renderColumn(type) {
	let typestr = type == 'IN' ? '入' : '出';
	const column = [
		{
			title: '编号',
			key: 'serialNo',
			dataIndex: 'serialNo'
		},
		{
			title: '车牌号',
			key: 'licensePlateNumber',
			dataIndex: 'licensePlateNumber'
		},
		{
			title: '矿发净重(吨)',
			key: 'loadingWeight',
			dataIndex: 'loadingWeight'
		},
		{
			title: `${typestr}库毛重(吨)`,
			key: 'grossWeight',
			dataIndex: 'grossWeight'
		},
		{
			title: `${typestr}库皮重(吨)`,
			key: 'tareWeight',
			dataIndex: 'tareWeight'
		},
		{
			title: `${typestr}库净重(吨)`,
			key: 'netWeight',
			dataIndex: 'netWeight'
		},
		{
			title: type == 'IN' ? '发站' : '到站',
			key: 'sendStation',
			dataIndex: 'sendStation'
		},
		{
			title: '派车方式',
			key: 'generateType',
			dataIndex: 'generateType',
			scopedSlots: { customRender: 'typeAction' }
		},
		{
			title: '状态',
			key: 'statusText',
			dataIndex: 'statusText'
		},
		{
			title: '派车时间',
			key: 'createdDate',
			dataIndex: 'createdDate'
		},
		{
			title: '矿发时间',
			key: 'loadingDate',
			dataIndex: 'loadingDate'
		},
		{
			title: '司机姓名',
			key: 'driverName',
			dataIndex: 'driverName'
		},
		{
			title: '联系电话',
			key: 'driverMobile',
			dataIndex: 'driverMobile'
		},
		{
			title: '操作',
			key: '操作',
			dataIndex: '操作',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	];
	if (type == 'OUT') {
		column.splice(2, 1);
		// 下煤不需要矿发时间
		column.splice(9, 1);
	}
	return column;
}
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.images {
	display: flex;
	margin-top: 4px;

	.image {
		margin-right: 5px;
		width: 40px;
		height: 40px;
		cursor: pointer;

		&:last-child {
			margin-right: 0;
		}

		img {
			width: 100%;
			height: 100%;
			vertical-align: top;
		}
	}
}

.empty-content {
	text-align: center;

	p {
		text-align: center;
	}

	::v-deep.ant-btn {
		margin: 20px auto;
	}
}

.slMain {
	.slTitleAssis {
		margin-top: 30px;
	}

	::v-deep.methods-wrap {
		border-bottom: 0px solid;
	}

	::v-deep.new-table {
		margin-top: 60px;
	}

	::v-deep.ant-tabs-bar {
		// border-bottom-color: transparent;
	}

	::v-deep.ant-descriptions-item-label {
		background-color: #f3f5f6;
		color: #77889d;
		border-color: #e5e6eb;
		min-height: 48px;
		padding: 12px;
	}

	::v-deep.ant-descriptions-item-content {
		color: rgab(0, 0, 0, 0.8);
		min-height: 48px;
		padding: 12px;
	}

	::v-deep.ant-descriptions {
		padding: 20px 0 0;
	}

	.contract-empty-box {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 60px;
		margin-bottom: 60px;
		width: 100%;
		.slBtn {
			margin-top: 10px;
		}
	}

	.table-box {
		position: relative;
		margin-top: 30px;

		.export-box {
			position: absolute;
			right: 0;
			top: -25px;
			text-align: right;
			cursor: pointer;

			.export-icon {
				width: 14px;
				height: 14px;
				margin-right: 5px;
				position: relative;
				top: 1px;
			}

			.export-text {
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				color: @primary-color;
				line-height: 20px;
			}
		}
	}
}

.copy-icon {
	margin-left: 12px;
	cursor: pointer;
	position: relative;
	top: 2px;
	width: 14px;
	height: 14px;
}

.grid-wrap {
	margin-top: 20px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;

	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;

		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
			text-align: left;
		}

		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}

		.label {
			width: 120px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}

		span:last-child {
			width: 100%;
			padding-left: 132px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}

	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}

	li:last-child {
		border-radius: 0 0 3px 0;
	}

	li.special {
		border-radius: 0 3px 3px 0;
	}
}

.slModal {
	::v-deep {
		.ant-card-head-title {
			font-weight: 500;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
		}
	}

	::v-deep.ant-upload {
		height: auto;
		width: auto;
		float: none;
		border: none;
		padding: 0;
	}

	.file_icon {
		margin: 0 auto;
		display: block;
		// background-color: #f5222d;
		// background: url(~/assets/imgs/logisticsPlatform/bg.png) no-repeat right center;
		width: 60px;
		height: 60px;
	}

	.detailUploadStyle {
		display: flex;
		justify-self: center;
		text-align: left;

		/deep/.ant-upload {
			line-height: 48px;
			margin: 0;
			background: none;
		}
	}

	.detailTruckNameGroupStyle {
		display: flex;
		align-items: center;
	}

	.kfbdStyle {
		display: flex;
		align-items: center;
	}

	.detailTruckNameStyle {
		height: 28px;
		margin: 0;
		background-color: #f3f5f6;
		border-radius: 4px;
		display: flex;
		align-items: center;
		padding-right: 10px;
		max-width: 100%;
		.detailTruckNameText {
			color: @primary-color;
			font-size: 14px;
			white-space: nowrap; /* 阻止文本自动换行 */
			overflow: hidden; /* 隐藏溢出的内容 */
			text-overflow: ellipsis; /* 显示省略号 */
			cursor: pointer;
		}
		img {
			cursor: pointer;
		}
	}

	.uploadBtnStyle {
		width: 64px;
		height: 24px;
		color: @primary-color;
	}

	.slFormDetail {
		padding: 0;

		.ant-form-item {
			height: 80px;
		}

		.formItem {
			margin: 0px;
		}

		.btn-box-title {
			.tip {
				font-size: 12px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #8495aa;
				margin-top: 10px;
			}
		}
	}

	.labelTips {
		font-size: 14px;
		zoom: 0.85;
		color: rgba(0, 0, 0, 0.25);
		display: inline-block;
		margin-left: 10px;
	}

	.truchImgClass {
		margin-top: 7px;
	}

	.iconDelteClass {
		margin-left: -7px;
	}

	.trunkGroupClass img {
		vertical-align: top;
		border-radius: 10px;
	}

	.line {
		height: 20px;
	}
}

.red {
	color: #f5222d;
}

.special.images {
	display: flex !important;
	justify-content: center;
	margin-top: 0;
	align-items: center;
}

.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}

.dispatchCarBtn {
	height: 32px;
	width: 132px;
	margin-top: 11px;
	// padding: 0 12px;
	background: @primary-color;
	border-radius: 4px;
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #ffffff;
	line-height: 22px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;

	.icon {
		width: 18px;
		vertical-align: middle;
		margin-right: 10px;
	}
}
</style>
