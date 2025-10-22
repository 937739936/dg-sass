<template>
	<div>
		<a-input
			autocomplete="off"
			ref="carPlateNumberInput"
			style="width: 170px"
			placeholder="请输入车牌号"
			:value="value"
			@input="inputChange"
			@blur="columnItemChange"
		>
			<div
				slot="suffix"
				@mousedown="e => e.preventDefault()"
			>
				<a-popover
					placement="right"
					@mousedown="e => e.preventDefault()"
				>
					<div
						slot="content"
						@mousedown="e => e.preventDefault()"
					>
						<div
							class="vector"
							@mousedown="e => e.preventDefault()"
						>
							<ul>
								<li
									v-for="item in S.split('')"
									:key="item"
									@mousedown="e => carPlateNumberEnter(e, item)"
								>
									{{ item }}
								</li>
							</ul>
							<ul>
								<li
									v-for="item in N.split('')"
									:key="item"
									@mousedown="e => carPlateNumberEnter(e, item)"
								>
									{{ item }}
								</li>
							</ul>
							<ul>
								<li
									v-for="item in Z.split('')"
									:key="item"
									@mousedown="e => carPlateNumberEnter(e, item)"
								>
									{{ item }}
								</li>
							</ul>
							<img
								src="~@/v2/assets/imgs/receive/delete.png"
								alt=""
								class="delete-item"
								@mousedown="e => carPlateNumberDelEnter(e)"
							/>
						</div>
					</div>
					<img
						class="vector-img"
						src="~@/v2/assets/imgs/logisticsPlatform/licensePlateNumber.png"
						alt=""
						style="width: 15px"
					/>
				</a-popover>
			</div>
		</a-input>
	</div>
</template>

<script>
let S = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领';
let N = '0123456789';
let Z = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
export default {
	name: 'LicensePlateNumberInput',
	props: {
		value: String
	},
	data() {
		return {
			S,
			N,
			Z, // 车牌号
			inputValue: ''
		};
	},
	mounted() {
		this.inputValue = this.value;
	},
	methods: {
		inputChange(e) {
			this.plateNumberChange(e.target.value);
		},
		carPlateNumberEnter(e, item) {
			this.$refs.carPlateNumberInput.focus();
			e.preventDefault();
			let newValue = this.value ? `${this.value}${item}` : item;
			this.plateNumberChange(newValue);
		},
		carPlateNumberDelEnter(e) {
			this.$refs.carPlateNumberInput.focus();
			e.preventDefault();
			if (this.value) {
				let newValue = this.value.slice(0, this.value.length - 1);
				this.plateNumberChange(newValue);
			}
		},
		columnItemChange() {
			this.$emit('blur');
		},
		plateNumberChange(newValue) {
			this.$emit('input', newValue);
			this.$emit('change', newValue);
		}
	}
};
</script>
<style lang="less" scoped>
// /deep/ .ant-popover {
// 	padding: 30px;
// }
// /deep/ .ant-popover > .ant-popover-content > .ant-popover-inner-content {
// 		padding: 0 0 !important;
// 		background: #4089f8;
// 	}
</style>

<style lang="less" scoped>
.vector {
	// padding: 12px 16px;
	width: 268px;
	height: 410px;
	position: relative;
	color: #000000cc;
	ul {
		display: flex;
		flex-wrap: wrap;
		li {
			margin-right: 16px;
			width: 24px;
			height: 24px;
			font-size: 14px;
			line-height: 24px;
			cursor: pointer;
			border-radius: 4px;
			text-align: center;
			margin-bottom: 14px;
			&:nth-child(7n + 7) {
				margin-right: 0;
			}
			&:hover {
				background-color: @primary-color;
				color: #ffffff;
			}
		}
	}
	.delete-item {
		height: 12px;
		position: absolute;
		right: 11px;
		bottom: 11px;
		cursor: pointer;
	}
	.status {
		padding: 3px 5px;
		height: 20px;
		line-height: 20px;
		border-radius: 4px;
		font-size: 14px;
		zoom: 0.85;
	}
	.ARRIVED {
		background: #c5ecdd;
		color: #3eb384;
	}
	.UNARRIVED {
		background: #c9daff;
		color: #596fa0;
	}
	.PARTARRIVED {
		background: #c1d7ff;
		color: #4682f3;
	}
}
</style>