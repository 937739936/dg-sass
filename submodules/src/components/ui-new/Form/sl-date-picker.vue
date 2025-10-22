<template>
	<div class="form-date">
		<div style="color: rgba(0, 0, 0, 0.4)">{{ addonBeforeTitle }}</div>
		<a-date-picker
			class="range"
			:value="value"
			v-bind="$attrsAll"
			v-on="$listenersAll"
			@change="changeDate"
			:allowClear="false"
			:getCalendarContainer="getCalendarContainer()"
		>
			<Calendar slot="suffixIcon"></Calendar>
		</a-date-picker>
	</div>
</template>

<script>
import { Calendar } from '../../svg';
export default {
	components: {
		Calendar
	},
	props: {
		addonBeforeTitle: {
			type: String,
			default: () => ''
		},
		value: {
			type: [Object, String]
		}
	},
	data() {
		return {};
	},
	computed: {
		$attrsAll() {
			return {
				value: this.value,
				...this.$attrs
			};
		},
		$listenersAll() {
			return Object.assign({}, this.$listeners);
		}
	},
	mounted() {},
	methods: {
		changeDate(value) {
			this.$emit('input', value);
		},
		getCalendarContainer() {
			return triggerNode => triggerNode.parentNode;
		}
	}
};
</script>

<style scoped lang='less'>
.form-date {
	display: flex;
	align-items: center;
	background: #fff;
	padding-left: 12px;
	border-radius: 4px;
	color: rgba(0, 0, 0, 0.4);
	border: 1px solid #e5e6eb;
	.range {
		flex: 1;
		padding-left: 12px !important;
		position: relative;
	}
	::v-deep {
		.ant-calendar-picker {
			padding: 0;
			border: 0;
		}
		.ant-calendar-picker-input {
			padding: 0;
			border: 0;
		}
		.ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled) {
			border: none;
			box-shadow: none;
		}
		.anticon-close-circle {
			font-size: 16px;
		}
	}
}
::v-deep {
	.ant-calendar-picker-icon {
		cursor: pointer;
	}
	.ant-calendar-range-picker-separator {
		line-height: 30px;
	}
	.ant-input-group-addon {
		border: 0;
		background: #fff;
	}
	.ant-input {
		border: none;
		background: #fff;
		height: 32px;
		padding: 0 12px;
		&:focus {
			border: none;
			box-shadow: none;
		}
	}
}
input::-webkit-input-placeholder {
	color: rgba(0, 0, 0, 0.25);
}
input::-moz-placeholder {
	color: rgba(0, 0, 0, 0.25);
}
input:-ms-input-placeholder {
	color: rgba(0, 0, 0, 0.25);
}
input::placeholder {
	color: rgba(0, 0, 0, 0.25);
}
</style>
