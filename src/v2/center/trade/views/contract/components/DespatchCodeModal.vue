<template>
	<div>
		<a-modal
			:title="titleText"
			:visible="editVisible"
			centered
			:confirm-loading="confirmLoading"
			okText="提交"
			@ok="handleOk"
			@cancel="close"
			class="slModal"
		>
			<a-form
				layout="horizontal"
				:form="form"
				:label-col="{ span: 24 }"
				:wrapper-col="{ span: 24 }"
			>
				<a-form-item label="派车单位">
					<a-input
						placeholder="请输入派车单位"
						:maxLength="40"
						@input="v => handleInput(v, 'deliveryCompanyName')"
						@blur="v => handleBlur(v, 'deliveryCompanyName')"
						:class="cssFlag.deliveryCompanyName ? 'active' : ''"
						v-decorator="[
							`deliveryCompanyName`,
							{
								rules: [{ required: true, message: `请输入派车单位` }]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="装货地">
					<a-input
						placeholder="请输入装货地"
						:maxLength="100"
						:class="cssFlag.loadPlace ? 'active' : ''"
						@input="v => handleKeyWordSearch(v, 'loadPlace')"
						@blur="v => handleBlur(v, 'loadPlace')"
						@focus="v => handleKeyWordSearch(v, 'loadPlace')"
						autoComplete="off"
						v-decorator="[
							`loadPlace`,
							{
								rules: [{ required: true, message: `请输入装货地` }]
							}
						]"
					/>
					<i class="location-icon" />
					<template v-if="loadPlaceLoading">
						<div
							class="keyword-box"
							style="height: 40px"
						>
							<a-spin></a-spin>
						</div>
					</template>
					<template v-else>
						<div
							class="keyword-box"
							v-if="loadPlaceList && loadPlaceList.length > 0"
						>
							<div
								class="keyword-item"
								v-for="(item, index) in loadPlaceList"
								:key="index"
								@click="chooseLoadPlace(item)"
							>
								<i class="location-icon" />
								<a-tooltip>
									<template #title>
										<span>
											<em class="address">
												<template v-if="item.addr === keyWord">
													<i class="keyword-self">{{ item.addr }}</i>
												</template>
												<template v-else>
													<strong
														v-for="(pro, index) in item.addr.split(keyWord)"
														:key="index"
													>
														<template v-if="pro === ''">
															<i class="keyword-self">{{ keyWord }}</i>
														</template>
														<template v-else>{{ pro }}</template>
													</strong>
												</template>
											</em>
											{{ item.addressDetail }}
										</span>
									</template>
									<span>
										<em class="address">
											<template v-if="item.addr === keyWord">
												<i class="keyword-self">{{ item.addr }}</i>
											</template>
											<template v-else>
												<strong
													v-for="(pro, index) in item.addr.split(keyWord)"
													:key="index"
												>
													<template v-if="pro === ''">
														<i class="keyword-self">{{ keyWord }}</i>
													</template>
													<template v-else>{{ pro }}</template>
												</strong>
											</template>
										</em>
										{{ item.addressDetail }}
									</span>
								</a-tooltip>
							</div>
						</div>
					</template>
				</a-form-item>
				<a-form-item label="卸货地">
					<a-input
						placeholder="请输入卸货地"
						:maxLength="100"
						:class="cssFlag.destination ? 'active' : ''"
						@input="v => handleKeyWordSearch(v, 'destination')"
						@blur="v => handleBlur(v, 'destination')"
						@focus="v => handleKeyWordSearch(v, 'destination')"
						autoComplete="off"
						v-decorator="[
							`destination`,
							{
								rules: [{ required: true, message: `请输入卸货地` }]
							}
						]"
					/>
					<i class="location-icon" />
					<template v-if="destinationLoading">
						<div
							class="keyword-box"
							style="height: 40px"
						>
							<a-spin></a-spin>
						</div>
					</template>
					<template v-else>
						<div
							class="keyword-box"
							v-if="destinationList && destinationList.length > 0"
						>
							<div
								class="keyword-item"
								v-for="(item, index) in destinationList"
								:key="index"
								@click="chooseDestination(item)"
							>
								<i class="location-icon" />
								<a-tooltip>
									<template #title>
										<span>
											<em class="address">
												<template v-if="item.addr === keyWord">
													<i class="keyword-self">{{ item.addr }}</i>
												</template>
												<template v-else>
													<strong
														v-for="(pro, index) in item.addr.split(keyWord)"
														:key="index"
													>
														<template v-if="pro === ''">
															<i class="keyword-self">{{ keyWord }}</i>
														</template>
														<template v-else>{{ pro }}</template>
													</strong>
												</template>
											</em>
											{{ item.addressDetail }}
										</span>
									</template>
									<span>
										<em class="address">
											<template v-if="item.addr === keyWord">
												<i class="keyword-self">{{ item.addr }}</i>
											</template>
											<template v-else>
												<strong
													v-for="(pro, index) in item.addr.split(keyWord)"
													:key="index"
												>
													<template v-if="pro === ''">
														<i class="keyword-self">{{ keyWord }}</i>
													</template>
													<template v-else>{{ pro }}</template>
												</strong>
											</template>
										</em>
										{{ item.addressDetail }}
									</span>
								</a-tooltip>
							</div>
						</div>
					</template>
				</a-form-item>
				<a-form-item label="收货人">
					<a-select
						v-bind="selectTagsProps"
						:getPopupContainer="getPopupContainer"
						placeholder="请输入收货人名称"
						:class="cssFlag.consigneeCompanyName ? 'active' : ''"
						@focus="v => handleInput(v, 'consigneeCompanyName')"
						@blur="v => handleBlur(v, 'consigneeCompanyName')"
						v-decorator="[
							`consigneeCompanyName`,
							{
								rules: [
									{
										required: true,
										message: `请输入收货人名称`
									}
								]
							}
						]"
					>
					</a-select>
				</a-form-item>
				<a-form-item label="发运周期">
					<a-range-picker
						style="width: 100%"
						:allowClear="false"
						valueFormat="YYYY-MM-DD"
						:placeholder="['开始时间', '结束时间']"
						v-decorator="[
							`deliveryDate`,
							{
								rules: [{ required: true, message: `发运周期必填` }]
							}
						]"
					>
					</a-range-picker>
				</a-form-item>
				<a-form-item label="联系电话">
					<a-input
						:class="cssFlag.contactPhone ? 'active' : ''"
						@input="v => handleInput(v, 'contactPhone')"
						@blur="v => handleBlur(v, 'contactPhone')"
						placeholder="请输入联系电话"
						:maxLength="11"
						v-decorator="[`contactPhone`]"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<a-modal
			:visible="imgVisible"
			centered
			wrapClassName="modal-none-padding"
			@cancel="close"
			:footer="null"
			width="350px"
		>
			<a-icon
				type="close"
				slot="closeIcon"
				:style="{ color: '#fff' }"
			/>
			<div class="imgModal">
				<div
					:class="{ imgShare: true, imgShareDownload: imgShareDownload }"
					ref="shareImg"
				>
					<div class="imgShareMain">
						<div
							class="imgShareMainCon"
							ref="imgShareMainCon"
						>
							<img
								width="75"
								height="22"
								src="@/assets/imgs/travel/share_logo.png"
								alt=""
							/>
							<div class="shareTitle">派车计划</div>
							<div class="shareMain">
								<div class="shareMainItem">
									<a-space
										align="start"
										:size="6"
									>
										<img
											width="13"
											height="13"
											src="@/assets/imgs/travel/share_main_1.png"
											alt=""
										/>
										<span class="shareMainItemTitle">派车单位:</span>
										<span>{{ info.deliveryCompanyName }}</span>
									</a-space>
								</div>
								<div class="shareMainItem">
									<a-space
										align="start"
										:size="2"
									>
										<img
											width="17"
											height="17"
											class="relative"
											src="@/assets/imgs/travel/start.png"
											alt=""
										/>
										<span>{{ info.loadPlace }}</span>
									</a-space>
									<p>{{ info.loadPlaceAddressDetail }}</p>
								</div>
								<div class="shareMainItem">
									<a-space
										align="start"
										:size="2"
									>
										<img
											class="relative"
											width="17"
											height="17"
											style="position: relative; left: -2px"
											src="@/assets/imgs/travel/end.png"
											alt=""
										/>
										<!-- <span class="shareMainItemTitle">卸货地:</span> -->
										<span>{{ info.destination }}</span>
									</a-space>
									<p>{{ info.destinationAddressDetail }}</p>
								</div>
								<div class="shareMainItem special">
									<a-space
										align="start"
										:size="6"
									>
										<img
											width="13"
											height="13"
											src="@/assets/imgs/travel/share_main_4.png"
											alt=""
										/>
										<span class="shareMainItemTitle">发运周期:</span>
										<span>{{ info.deliveryStartDate }}~{{ info.deliveryEndDate }}</span>
									</a-space>
								</div>
								<div class="shareMainItem special">
									<a-space
										align="start"
										:size="6"
									>
										<img
											width="13"
											height="13"
											src="@/assets/imgs/travel/share_main_3.png"
											alt=""
										/>
										<span class="shareMainItemTitle">收货人名称:</span>
										<span>{{ info.consigneeCompanyName }}</span>
									</a-space>
								</div>
								<div class="shareMainItem special">
									<a-space
										align="start"
										:size="6"
									>
										<img
											width="13"
											height="13"
											src="@/assets/imgs/travel/share_main_5.png"
											alt=""
										/>
										<span class="shareMainItemTitle">联系电话:</span>
										<span>{{ info.contactPhone }}</span>
									</a-space>
								</div>
							</div>
						</div>
						<div class="shareDivision"></div>
						<div class="imgShareMainCon">
							<div class="imgShareMainConFlow">
								<div class="imgShareMainConFlowTitle">操作流程</div>
								<a-timeline>
									<a-timeline-item>
										<div
											class="dotBor"
											slot="dot"
										>
											<div class="dot"><span>1</span></div>
										</div>
										<span class="lineTitle">识别二维码</span><span>(按图片识别二维码)</span>
									</a-timeline-item>
									<a-timeline-item>
										<div
											class="dotBor"
											slot="dot"
										>
											<div class="dot"><span>2</span></div>
										</div>
										<span class="lineTitle">首次使用二维码</span><span>(注册、登录，并绑定车辆)</span>
									</a-timeline-item>
									<a-timeline-item>
										<div
											class="dotBor"
											slot="dot"
										>
											<div class="dot"><span>3</span></div>
										</div>
										<span class="lineTitle">发车时</span><span>(确认车牌号和发车时间)</span>
									</a-timeline-item>
									<a-timeline-item>
										<div
											class="dotBor"
											slot="dot"
										>
											<div class="dot"><span>4</span></div>
										</div>
										<span class="lineTitle">到站时</span><span>(确认车牌号和到站时间)</span>
									</a-timeline-item>
								</a-timeline>
								<img
									width="100"
									height="100"
									v-if="info.qrCode"
									:src="`data:image/Jpeg;base64,${info.qrCode}`"
									alt="二维码"
								/>
								<div>长按识别二维码</div>
								<div style="color: #999; transform: scale(0.85)">{{ info.serialNo }}</div>
							</div>
						</div>
					</div>
				</div>
				<div
					class="imgModalFooter"
					slot="footer"
				>
					<a-button
						type="primary"
						@click="editCode"
					>
						编辑
					</a-button>
					<a-button
						type="primary"
						@click="imgShare"
					>
						分享
					</a-button>
					<a-button
						type="primary"
						@click="download"
					>
						下载
					</a-button>
				</div>
			</div>
		</a-modal>
		<a-modal
			:visible="imgShareVisible"
			centered
			title="分享派车计划"
			@cancel="imgShareHide"
			:footer="null"
		>
			<div class="imgShareVisible">
				<div class="imgShareCode">
					<img
						width="250"
						height="250"
						v-if="previewImg"
						:src="`data:image/Jpeg;base64,${previewImg}`"
					/>
					<span>微信扫码可分享派车计划</span>
				</div>
				<a-button
					type="primary"
					@click="imgShareHide"
				>
					关闭
				</a-button>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { dispatchByOrderSerialNo, dispatchSaveOrUpdate, dispatchShare, getAddressDetail } from '@/v2/center/trade/api/contract';
export default {
	data() {
		return {
			orderSerialNo: '', //订单编号
			editVisible: false, //编辑弹框
			titleText: '', // 弹窗标题
			confirmLoading: false, //提交中
			imgVisible: false, //派车计划弹框
			imgShareVisible: false, //分享弹框
			form: this.$form.createForm(this),
			getPopupContainer,
			selectTagsProps: {
				mode: 'tags',
				filterOption: false,
				defaultActiveFirstOption: false
			},
			info: {},
			previewImg: '',
			imgShareDownload: false, //下载时有像素偏差，进行调节
			loadPlaceList: [], // 装货地列表
			destinationList: [], //卸货地列表
			cssFlag: {
				deliveryCompanyName: false,
				consigneeCompanyName: false,
				loadPlace: false,
				destination: false,
				contactPhone: false
			},
			loadPlaceSelected: {},
			destinationSelected: {},
			keyWord: '', // 装货地、卸货地的关键字
			destinationLoading: false,
			loadPlaceLoading: false
		};
	},
	methods: {
		handleInput(e, type) {
			this.cssFlag[type] = true;
			if (type === 'contactPhone') {
				let val = '';
				val = e.target.value.replace(/\D/g, '');
				this.form.setFieldsValue({
					contactPhone: val
				});
			}
		},
		handleBlur(e, type) {
			this.cssFlag[type] = false;
			let that = this;
			setTimeout(function () {
				that[type + 'List'] = [];
			}, 1000);
		},
		handleOk() {
			this.confirmLoading = true;
			this.form.validateFieldsAndScroll(async (err, values) => {
				// 校验表单数据
				if (!err) {
					let newValues = {
						...values,
						orderSerialNo: this.orderSerialNo,
						id: this.info?.id,
						deliveryStartDate: values.deliveryDate[0],
						deliveryEndDate: values.deliveryDate[1],
						destinationAddressDetail: this.destinationSelected.addressDetail,
						destinationLatitude: this.destinationSelected.latitude,
						destinationLongitude: this.destinationSelected.longitude,
						loadPlaceAddressDetail: this.loadPlaceSelected.addressDetail,
						loadPlaceLongitude: this.loadPlaceSelected.longitude,
						loadPlaceLatitude: this.loadPlaceSelected.latitude
					};
					delete newValues.deliveryDate;
					//判断时间是否规范
					if (moment(newValues.deliveryStartDate).diff(moment(newValues.deliveryEndDate), 'days') > 0) {
						this.$message.error('发运周期的开始日期不能大于结束日期');
						this.confirmLoading = false;
						return;
					}
					for (let k in newValues) {
						if (newValues[k] && typeof newValues[k] === 'object') {
							newValues[k] = newValues[k].join(',');
						}
					}
					//提交，显示派车计划
					let res = await dispatchSaveOrUpdate(newValues).catch(() => {
						this.confirmLoading = false;
					});
					this.confirmLoading = false;
					if (res.success && res.data) {
						this.info = res.data;
						this.editVisible = false;
						this.imgVisible = true;
					}
				} else {
					this.confirmLoading = false;
				}
			});
		},
		async show(info, from) {
			// 从派车计划列表进入
			if (from === 'DispatchPlanList') {
				//直接编辑或查看
				if (info.type === 'edit') {
					this.info = info;
					this.orderSerialNo = info.orderSerialNo;
					this.editCode();
				} else {
					this.info = info;
					this.imgVisible = true;
				}
				return;
			}
			// 从订单列表进入
			this.info = {};
			//根据订单编号查询派车计划
			this.orderSerialNo = info.serialNo;
			let res = await dispatchByOrderSerialNo({
				orderSerialNo: this.orderSerialNo
			});
			if (res.success) {
				if (res.data?.id) {
					//有派车计划直接展示
					this.info = res.data;
					this.imgVisible = true;
				} else {
					//如果未生成过派车计划，展示派车计划编辑弹框
					this.editVisible = true;
					this.titleText = '创建派车计划';
					this.$nextTick(() => {
						this.form.setFieldsValue({
							deliveryCompanyName: info.sellerName || info.sellerCompanyName || '', //派车单位
							consigneeCompanyName: info.receiverName ? info.receiverName.split(',') : [], //收货人
							deliveryDate: [moment().format('YYYY-MM-DD'), info.deliveryDateEnd],
							loadPlace: '',
							destination: '',
							contactPhone: ''
						});
					});
				}
			}
		},
		close() {
			this.editVisible = false;
			this.confirmLoading = false;
			this.imgVisible = false;
			this.imgShareDownload = false;
		},
		//打开分享tank
		imgShare() {
			//关闭派车计划
			this.previewImg = '';
			dispatchShare({ id: this.info.id }).then(res => {
				if (res.success && res.data) {
					this.previewImg = res.data;
					this.imgVisible = false;
					this.imgShareVisible = true;
				}
			});
		},
		//关闭分享
		imgShareHide() {
			this.imgShareVisible = false;
			//打开派车计划
			this.imgVisible = true;
		},
		//编辑，重新填写信息
		editCode() {
			this.close();
			this.editVisible = true;
			this.titleText = '编辑派车计划';
			this.$nextTick(() => {
				this.form.setFieldsValue({
					deliveryCompanyName: this.info.deliveryCompanyName || '', //派车单位
					loadPlace: this.info.loadPlace || '', //目的地
					destination: this.info.destination || '', //目的地
					consigneeCompanyName: this.info.consigneeCompanyName ? this.info.consigneeCompanyName.split(',') : [], //收货人
					deliveryDate: [this.info.deliveryStartDate, this.info.deliveryEndDate],
					contactPhone: this.info.contactPhone
				});
				this.loadPlaceSelected = {
					addr: this.info.loadPlace,
					addressDetail: this.info.loadPlaceAddressDetail,
					latitude: this.info.loadPlaceLatitude,
					longitude: this.info.loadPlaceLongitude
				};
				this.destinationSelected = {
					addr: this.info.destination,
					addressDetail: this.info.destinationAddressDetail,
					latitude: this.info.destinationLatitude,
					longitude: this.info.destinationLongitude
				};
			});
		},
		download() {
			//下载对应派车计划-派车计划.jpg
			this.imgShareDownload = true;
			this.$nextTick(() => {
				html2canvas(this.$refs.shareImg).then(canvas => {
					// 转成图片，生成图片地址
					let imgUrl = canvas.toDataURL('image/png'); //可将 canvas 转为 base64 格式
					let a = document.createElement('a');
					a.href = imgUrl;
					a.download = '派车计划-' + this.info.serialNo + '.jpg'; //文件名
					document.body.appendChild(a);
					a.click(); // 触发点击
					document.body.removeChild(a); // 然后移除
					this.imgShareDownload = false;
				});
			});
		},
		handleKeyWordSearch(e, type) {
			// 获取装货地检索字段
			this.cssFlag[type] = true;
			this.keyWord = e.target.value;
			// 检索字段必须不小于两个字符时才调接口
			if (e.target.value == '' || e.target.value.length < 2) return;
			this.loading = true;
			this[type + 'Loading'] = true;
			if (type === 'loadPlace') {
				this.destinationList = [];
			} else {
				this.loadPlaceList = [];
			}
			getAddressDetail({ addr: e.target.value }).then(res => {
				if (res.data) {
					this[type + 'Loading'] = false;
					// 检索次数用完或者无结果，取用户输入的值
					this[type + 'List'] = res.data.addr || [];
					if (res.data.code == 500 || !res.data.addr.length) {
						this[type + 'Selected'] = {
							addr: this.keyWord,
							addressDetail: '',
							latitude: '',
							longitude: ''
						};
						return;
					}
				}
			});
		},
		chooseLoadPlace(item) {
			// 选中装货地
			this.loadPlaceList = [];
			this.form.setFieldsValue({
				loadPlace: item.addr
			});
			this.loadPlaceSelected = item;
		},
		chooseDestination(item) {
			// 选中装货地
			this.destinationList = [];
			this.form.setFieldsValue({
				destination: item.addr
			});
			this.destinationSelected = item;
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
.imgModal {
	position: relative;
	width: 350px;
	overflow: hidden;
	.imgShare {
		width: 100%;
		min-height: 676px;
		padding: 37px 30px;
		background: linear-gradient(180deg, #2b7bfa 0%, #1647df 100%);
		&:after {
			content: '';
			position: absolute;
			width: 342px;
			height: 126px;
			top: 22px;
			right: 0;
			background: url('~@/assets/imgs/travel/share_bg_1.png');
			background-size: 100% 100%;
			-moz-background-size: 100% 100%; /* 老版本的 Firefox */
			background-repeat: no-repeat;
		}
		&:before {
			content: '';
			position: absolute;
			width: 100%;
			height: 46px;
			bottom: 0;
			left: 0;
			background: url('~@/assets/imgs/travel/share_bg_2.png');
			background-size: 100% 100%;
			-moz-background-size: 100% 100%; /* 老版本的 Firefox */
			background-repeat: no-repeat;
		}
		.imgShareMain {
			width: 289px;
			min-height: 602px;
			background: #ffffff;
			border-radius: 9px;
			overflow: hidden;
			position: relative;
			z-index: 1;
			&:after {
				content: '';
				position: absolute;
				width: 154px;
				height: 154px;
				top: 117px;
				left: 161px;
				border-radius: 50%;
				background: rgba(38, 111, 244, 0.04);
			}
			&:before {
				content: '';
				position: absolute;
				width: 126px;
				height: 126px;
				top: 332px;
				right: 196px;
				border-radius: 50%;
				background: rgba(38, 111, 244, 0.04);
			}
			.imgShareMainCon {
				padding: 10px 14px;
				.shareTitle {
					font-size: 31px;
					font-family:
						PingFangSC-Semibold,
						PingFang SC;
					font-weight: 600;
					color: #387dff;
					line-height: 43px;
					text-align: center;
					margin: 12px 0 17px;
					width: auto;
				}
				.shareMain {
					.shareMainItem {
						font-size: 14px;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.8);
						line-height: 19px;
						margin-bottom: 9px;
						.shareMainItemTitle {
							display: inline-block;
							white-space: nowrap;
						}
						img,
						span {
							vertical-align: middle;
							word-break: break-word;
						}
						p {
							padding-left: 20px;
							color: #6a6a6a;
							font-family:
								PingFangSC-Regular,
								PingFang SC;
							font-weight: 500;
							font-size: 12px;
							margin-top: 5px;
						}
						span {
							line-height: 20px;
						}
						.relative {
							position: relative;
							left: -3px;
						}
					}
					.shareMainItem.special {
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						color: rgba(0, 0, 0, 0.8);
						font-weight: 500;
					}
				}
				.imgShareMainConFlow {
					width: 100%;
					height: 320px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					font-size: 13px;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: #333333;
					line-height: 19px;
					.imgShareMainConFlowTitle {
						height: 21px;
						background: rgba(83, 143, 255, 0.12);
						border-radius: 3px;
						border: 1px solid #246af1;
						font-size: 12px;
						font-family:
							PingFangSC-Medium,
							PingFang SC;
						font-weight: 500;
						color: #4988ff;
						line-height: 17px;
						text-align: center;
						padding: 0 22px;
						line-height: 21px;
						margin-bottom: 5px;
					}
					/deep/.ant-timeline {
						margin-top: 5px;
						.ant-timeline-item {
							font-size: 13px;
							font-family: PingFang-SC-Medium, PingFang-SC;
							font-weight: 500;
							color: #333333;
							padding-bottom: 15px;
							.ant-timeline-item-tail {
								border-left: 1px dotted rgba(255, 172, 0, 0.7);
								top: 15px;
								height: calc(100% - 20px);
							}
							.ant-timeline-item-head {
								background: none;
							}
							.ant-timeline-item-head-custom {
								padding: 0;
								top: 5px;
							}
							.dotBor {
								border-radius: 50%;
								border: 1.5px solid rgba(255, 167, 0, 0.17);
								.dot {
									width: 14px;
									height: 14px;
									background: #ffac00;
									font-size: 12px;
									font-family: PingFang-SC-Regular, PingFang-SC;
									font-weight: 400;
									color: #ffffff;
									text-align: center;
									display: flex;
									justify-content: center;
									align-items: center;
									border-radius: 50%;
									box-sizing: content-box;
									margin: 0;
									span {
										color: #ffffff;
										margin: 0;
										display: block;
										height: 12px;
									}
								}
							}
							.lineTitle {
								font-family:
									PingFangSC-Medium,
									PingFang SC;
								font-weight: 600;
								color: #333333;
							}
							span {
								display: inline-block;
								font-size: 12px;
								font-family:
									PingFangSC-Regular,
									PingFang SC;
								font-weight: 400;
								color: #8c9095;
								margin-left: 6px;
							}
							&.ant-timeline-item-last {
								padding-bottom: 5px;
								.ant-timeline-item-content {
									min-height: auto;
								}
							}
						}
					}
				}
			}
			.shareDivision {
				width: calc(100% + 10px);
				height: 14px;
				background: url('~@/assets/imgs/travel/share_division.png');
				background-size: 100% 100%;
				-moz-background-size: 100% 100%; /* 老版本的 Firefox */
				background-repeat: no-repeat;
				margin: 0 -5px;
			}
		}
		&.imgShareDownload {
			.imgShareMainCon {
				.shareMainItem {
					img {
						margin-top: 2px;
					}
				}
				.imgShareMainConFlow {
					/deep/.ant-timeline {
						.dot {
							align-items: flex-start !important;
						}
					}
				}
			}
		}
	}
	.imgModalFooter {
		position: absolute;
		width: 100%;
		height: 50px;
		bottom: -50px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		transition: All 0.3s ease;
		-webkit-transition: All 0.3s ease;
		-moz-transition: All 0.3s ease;
		-o-transition: All 0.3s ease;
		z-index: 2;
	}
	&:hover {
		.imgModalFooter {
			bottom: 0;
			transition: All 0.3s ease;
			-webkit-transition: All 0.3s ease;
			-moz-transition: All 0.3s ease;
			-o-transition: All 0.3s ease;
		}
	}
}
.imgShareVisible {
	height: 400px;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
	.imgShareCode {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
	}
}
.slModal {
	::v-deep.ant-modal {
		width: 490px !important;
		//height: 672px!important;
		border-radius: 8px;
	}
	::v-deep.ant-modal-body {
		padding: 30px;
		height: 650px !important;
		max-height: 650px !important;
		overflow-y: auto;
	}
	::v-deep.ant-form-item {
		margin-bottom: 30px;
		.ant-form-item-control-wrapper {
			height: 40px;
		}
		.ant-form-item-label {
			padding-bottom: 12px;
			label {
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.8);
				line-height: 20px;
			}
		}
		.ant-input {
			height: 40px;
			line-height: 40px;
			border-radius: 6px;
			border-color: rgba(139, 157, 184, 0.3);
			padding-right: 25px;
			&::placeholder {
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(139, 157, 184, 0.8);
				line-height: 30px;
			}
		}
		.location-icon {
			width: 20px;
			height: 20px;
			display: inline-block;
			vertical-align: middle;
			background: url(~@/v2/assets/imgs/receive/location-icon.png) no-repeat;
			background-size: contain;
			line-height: 38px !important;
			position: absolute;
			right: 3px;
			top: 0;
		}
		.ant-select {
			min-height: 40px; // 下拉多选框样式
			line-height: 40px;
			.ant-select-selection__placeholder {
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(139, 157, 184, 0.8);
			}
			.ant-select-selection {
				min-height: 40px; // 下拉多选框样式
				line-height: 40px;
				border-radius: 6px;
				border-color: rgba(139, 157, 184, 0.3);
				.ant-select-selection__rendered {
					padding: 8px 0;
					height: 40px;
					line-height: 40px;
					& > ul {
						li {
							margin-top: 0;
						}
					}
				}
				.ant-select-search__field__wrap {
					height: 24px;
					line-height: 24px;
				}
			}
			.ant-select-selection--multiple .ant-select-selection__rendered > ul {
				& > .ant-select-selection__choice {
					background: #f3f5f6;
					border-radius: 4px;
					font-size: 14px;
					font-family:
						PingFangSC-Regular,
						PingFang SC;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.8);
					line-height: 24px;
					padding-left: 12px;
					padding-right: 26px;
					border: none;
				}
			}
			.ant-select-selection__choice__remove {
				display: inline-block;
				width: 14px;
				height: 14px;
				background: url(~@/v2/assets/imgs/common/delete_icon.png) no-repeat 100% / cover;
				margin-top: 5px;
				.anticon {
					display: none;
				}
			}
		}
		.ant-calendar-picker {
			height: 40px;
			line-height: 40px;
			.ant-calendar-picker-input {
				height: 40px;
				line-height: 40px;
				border-color: rgba(139, 157, 184, 0.3);
				.ant-calendar-range-picker-input {
					height: 32px;
					line-height: 32px;
					position: relative;
					top: -5px;
					text-align: left;
					&::placeholder {
						font-size: 14px;
						font-family:
							PingFangSC-Regular,
							PingFang SC;
						font-weight: 400;
						color: rgba(139, 157, 184, 0.8);
						line-height: 32px;
					}
				}
				.ant-calendar-range-picker-input:nth-child(3) {
					text-align: right;
				}
				.ant-calendar-range-picker-separator {
					position: relative;
					top: -5px;
				}
				.ant-calendar-picker-icon {
					width: 20px;
					height: 20px;
					display: inline-block;
					vertical-align: middle;
					background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
					background-size: contain;
					line-height: 38px !important;
					top: 40%;
				}
			}
		}
		.ant-form-explain {
			padding-top: 2px;
		}
		.ant-input.active {
			border-color: @primary-color;
			background-color: #eaf1ff;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
		}
		.ant-select.active {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			.ant-select-selection {
				border-color: @primary-color;
				background-color: #eaf1ff;
			}
			.ant-select-selection__choice {
				background-color: #eaf1ff;
			}
		}
		.has-error .ant-input,
		.has-error .ant-input:hover {
			border-color: #f5222d !important;
		}
		.has-error .ant-select-selection {
			border-color: #f5222d !important;
		}
	}
	::v-deep.ant-form-item:last-child {
		margin-bottom: 0;
	}
	.keyword-box {
		width: 100%;
		height: 224px;
		background: #ffffff;
		box-shadow: 0px 2px 12px 0px rgba(212, 217, 231, 0.5);
		border-radius: 6px;
		position: relative;
		overflow-y: auto;
		padding: 0 12px;
		z-index: 10;
		cursor: pointer;
		.keyword-item {
			height: 44px;
			line-height: 44px;
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			padding-left: 25px;
			position: relative;
			span {
				display: inline-block;
				width: 100%;
				height: 44px;
				line-height: 44px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #a4b2c8;
				.keyword-self {
					color: @primary-color;
					font-style: normal;
				}
				.address {
					font-style: normal;
					color: rgba(0, 0, 0, 0.8);
				}
			}
			.location-icon {
				position: absolute;
				left: 0;
				top: 11px;
			}
		}
	}
}
</style>
