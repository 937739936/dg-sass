<template>
	<span
		class="date-picker picker"
		@click.stop="isOpen = true"
	>
		<a-range-picker
			style="width: 250px"
			:allowClear="false"
			@change="change"
			:open="isOpen"
			v-model="date"
			format="YYYY-MM-DD"
			value-format="YYYY-MM-DD"
			@panelChange="panelChange"
			@openChange="openChange"
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
</template>

<script>
import moment from 'moment';
import { value } from 'lodash';
export default {
	props: {
		isShow: {
			default: true
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
			isOpen: false,
			obj: {}
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
			this.$emit('send', obj, this.currentValue);
		},
		change(value) {
			this.isOpen = false;
			this.obj = {
				startDate: value[0],
				endDate: value[1]
			};
			this.$emit('send', this.obj, this.currentValue);
		},
		panelChange(value) {
			console.log(value);
		},
		openChange(flag) {
			// if(!flag) {
			//   this.isOpen = false
			//   let obj = {}
			//   if(this.currentValue != 'TOTAL') {
			//     obj = {
			//       startDate: this.date[0],
			//       endDate: this.date[1],
			//     }
			//   }
			//   this.$emit('send', this.obj, this.currentValue)
			// }
		},
		getCalendarContainer(triggerNode) {
			const a = document.querySelector('.picker');
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
