<template>
	<div
		class="business-line"
		ref="businessLine"
		v-if="companyChain.length > 0"
	>
		<div
			@click.stop
			class="actived-cover"
			:style="{ left: `${activedCoverLeft}px` }"
		></div>
		<div
			class="item cp"
			:key="index"
			v-for="(item, index) in companyChain"
			@click="selectCompany($event)"
		>
			<div class="company">
				<img
					class="company-icon"
					src="@/v2/assets/imgs/monitoring/company-icon.png"
				/>
				<div
					class="company tc"
					v-if="item.list"
				>
					<a-dropdown class="dropdown">
						<a
							class="ant-dropdown-link"
							@click.stop
						>
							<a-tooltip
								placement="top"
								:title="curFirstCompany.name"
							>
								<p
									class="ellipsis"
									style="width: calc(100% - 20px)"
								>
									{{ curFirstCompany.name }}
								</p>
							</a-tooltip>
							<a-icon
								class="icon"
								type="down"
							/>
						</a>
						<a-menu slot="overlay">
							<a-menu-item
								:key="idx"
								v-for="(i, idx) in item.list"
								@click="selectFirstCompany(i, idx)"
							>
								<a>{{ i.name }}</a>
							</a-menu-item>
						</a-menu>
					</a-dropdown>
				</div>
				<a-tooltip
					v-else
					placement="bottom"
					:title="item.name"
				>
					<p
						class="tc ellipsis"
						@click="stop($event, index)"
					>
						{{ item.name }}
					</p>
				</a-tooltip>
			</div>
			<a-divider
				v-if="index < companyChain.length - 1"
				class="divider"
			/>
		</div>
	</div>
</template>
<script>
export default {
	name: 'CompanyRelationChain',
	components: {},
	props: {
		companyChain: {
			type: Array,
			default: () => []
		},
		contractChain: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			activedCoverLeft: 0,
			activedCoverIndex: 0,
			activedCoverMoveBaseWidth: 206,
			curFirstCompany: '',
			curFirsContract: '',
			firstCompanyIndex: 0
		};
	},
	created() {
		let params = {};
		if (this.companyChain[0]?.list) {
			this.curFirstCompany = this.companyChain[0]?.list[0];
		}
		if (this.contractChain[0]?.contractList) {
			this.curFirsContract = this.contractChain[0]?.contractList[0];
		}
		this.handleActived(params);
	},
	methods: {
		// 第一个公司有多个时
		selectFirstCompany(data, index) {
			if (this.firstCompanyIndex === index && this.activedCoverIndex === 0) {
				return;
			}
			this.firstCompanyIndex = index;
			this.activedCoverIndex = 0;
			this.curFirstCompany = data;
			if (this.contractChain[0].contractList) {
				this.curFirsContract = this.contractChain[0].contractList[index];
			}
			this.handleActived();
		},
		selectCompany(e) {
			const { businessLine } = this.$refs;
			// 根据鼠标点击坐标等计算出一个合适的X轴坐标位置
			let left =
				e.clientX - businessLine.getBoundingClientRect().left - this.activedCoverMoveBaseWidth / 3 + businessLine.scrollLeft;
			if (left <= 0) {
				left = 0;
			}

			let activedCoverIndex = Math.floor(left / this.activedCoverMoveBaseWidth);
			activedCoverIndex =
				activedCoverIndex >= this.companyChain.length * 2 ? this.companyChain.length * 2 - 1 : activedCoverIndex;
			if (this.companyChain[activedCoverIndex + 1]) {
				if (activedCoverIndex === this.activedCoverIndex) {
					return;
				}
				this.activedCoverIndex = activedCoverIndex;
				this.handleActived();
				return;
			}

			activedCoverIndex -= 1;
			if (activedCoverIndex === this.activedCoverIndex) {
				return;
			}
			this.activedCoverIndex = activedCoverIndex;
			this.handleActived();
		},
		handleActived(data) {
			this.setActivedCoverLeft();
			let upCompany = this.companyChain[this.activedCoverIndex - 1] || {};
			let upContract = this.contractChain[this.activedCoverIndex - 1] || {};

			let curCompany = this.companyChain[this.activedCoverIndex];
			let curContract = this.contractChain[this.activedCoverIndex];
			if (this.activedCoverIndex === 1) {
				upCompany = this.curFirstCompany ? this.curFirstCompany : upCompany;
				upContract = this.curFirsContract ? this.curFirsContract : upContract;
			}
			if (this.activedCoverIndex === 0) {
				upCompany = {};
				upContract = {};
				curCompany = this.curFirstCompany ? this.curFirstCompany : curCompany;
				curContract = this.curFirsContract ? this.curFirsContract : curContract;
			}
			const params = {
				upCompany,
				upContract: upContract.contract ? upContract.contract : upContract,
				curCompany,
				curContract: curContract.contract ? curContract.contract : curContract,
				downCompany: this.companyChain[this.activedCoverIndex + 1],
				activedCoverIndex: this.activedCoverIndex,
				...data
			};
			this.$emit('change', params);
		},
		setActivedCoverLeft(index) {
			if (index) {
				this.activedCoverIndex = index;
			}
			this.activedCoverLeft = this.activedCoverIndex * this.activedCoverMoveBaseWidth;
		},
		stop(e, index) {
			// e.stopPropagation();
			// if (this.activedCoverIndex === index) {
			//   // e.stopPropagation();
			// }
		}
	}
};
</script>
<style lang="less" scoped>
.business-line {
	display: flex;
	overflow-x: auto;
	position: relative;
	padding: 5px 0px;
	.company-icon {
		display: block;
		margin: 0 auto;
		width: 44px;
		height: 44px;
	}
	.dropdown {
		position: relative;
		z-index: 1;
		.icon {
			position: relative;
			top: -5px;
		}
	}
	.actived-cover {
		position: absolute;
		width: 353px;
		height: 75px;
		top: 0px;
		background: rgba(0, 83, 219, 0.08);
		border-radius: 4px;
		// pointer-events: none;
	}
	.divider {
		width: 50px;
		min-width: 50px;
		margin-right: 3px;
		margin-left: 3px;
		background: #dddfe4;
	}
	.item {
		display: flex;
	}
	.company {
		width: 150px;
		padding: 0px 3px;
		p {
			position: relative;
			z-index: 1;
			width: 100%;
		}
	}
}
</style>
