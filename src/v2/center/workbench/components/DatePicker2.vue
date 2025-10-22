<template>
	<span
		class="date-picker picker"
		id="picker2"
		:class="dateClass"
		@click="isOpen = true"
	>
		<span :class="[isShow ? '' : 'dateClass']">
			<!-- :getCalendarContainer="getCalendarContainer" -->
			<a-range-picker
				style="width: 250px"
				:open="isOpen"
				:allowClear="false"
				@change="change"
				v-model="date"
				format="YYYY-MM-DD"
				@openChange="openChange"
				value-format="YYYY-MM-DD"
			>
				<template slot="renderExtraFooter">
					<span
						class="quit"
						:class="{ active: item.value == currentValue }"
						v-for="item in list"
						@click="send(item.value)"
						:key="item.value"
						>{{ item.label }}</span
					>
				</template>
			</a-range-picker>
		</span>
	</span>
</template>

<script>
import moment from 'moment';
export default {
	props: {
		isShow: {
			default: true
		},
		dateClass: {
			default: ''
		}
	},
	data() {
		return {
			list: [
				{ value: 'WEEK', label: '本周' },
				{ value: 'MONTH', label: '本月' },
				{ value: 'QUARTER', label: '本季度' },
				{ value: 'YEAR', label: '本年' },
				{ value: 'TOTAL', label: '累计' }
			],
			currentValue: 'YEAR',
			date: [moment().startOf('year').format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD')],
			isOpen: false
		};
	},
	methods: {
		open() {
			this.isOpen = true;
		},
		send(value) {
			this.currentValue = value;
			const info = {
				WEEK: [moment().startOf('week').format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD')],
				MONTH: [moment().startOf('month').format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD')],
				QUARTER: [moment().startOf('quarter').format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD')],
				YEAR: [moment().startOf('year').format('YYYY-MM-DD'), moment().startOf('day').format('YYYY-MM-DD')],
				TOTAL: []
			};
			this.date = info[value];
			this.isOpen = false;
			let obj = {};
			if (value != 'TOTAL') {
				obj = {
					startDate: this.date[0],
					endDate: this.date[1]
				};
			}
			const item = this.list.find(el => el.value == this.currentValue) || {};
			this.$emit('send', obj, item.label);
		},
		change(flag) {
			this.currentValue = '';
			this.isOpen = false;
			let obj = {};
			if (this.currentValue != 'TOTAL') {
				obj = {
					startDate: this.date[0],
					endDate: this.date[1]
				};
			}
			const item = this.list.find(el => el.value == this.currentValue) || {};
			this.$emit('send', obj, item.label);
		},
		openChange(flag) {
			if (!flag) {
				this.isOpen = false;
			}
		},
		getCalendarContainer(triggerNode) {
			const dateClass = `.${this.dateClass}`;
			const a = document.querySelector(dateClass);
			return a || document.body;
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.date-picker {
	display: inline-block;
	position: relative;
}
.quit {
	margin-right: 5px;
	color: rgba(37, 45, 62, 0.65);
	cursor: pointer;
}
.quit:hover {
	color: @primary-color;
}
.quit.active {
	color: @primary-color;
}
.dateClass {
	visibility: hidden;
}
</style>
