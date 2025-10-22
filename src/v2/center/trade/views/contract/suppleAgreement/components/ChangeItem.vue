<template>
	<div>
		<template v-if="info.fieldName === 'basePrice'">
			<p
				:key="item.itemName"
				v-for="item in info.itemDetails"
			>
				<template> {{ item[type] }} 元/吨 </template>
			</p>
		</template>
		<template v-if="info.fieldName === 'basePriceDesc'">
			<p
				:key="item.itemName"
				v-for="item in info.itemDetails"
			>
				<template> {{ item[type] }} 元/吨 </template>
			</p>
		</template>
		<template v-if="info.fieldName === 'quantity'">
			<template v-for="item in info.itemDetails">
				<template v-if="type === 'value'">
					<template v-if="item.itemName === 'quantity'"> {{ item[type] }}吨 </template>
					<template v-if="item.itemName === 'quantityOffset' && item[type]"> (±{{ item[type] }}%) </template>
				</template>
				<template v-else>
					<template v-if="item.itemName === 'quantity'"> {{ item[type] }}吨 </template>
					<template v-if="item.itemName === 'quantityOffset' && item[type]"> (±{{ item[type] }}%) </template>
				</template>
			</template>
		</template>
		<template v-if="info.fieldName === 'deliveryDate'">
			<template v-for="item in info.itemDetails">
				<template v-if="item.itemName === 'deliveryStartDate'"> {{ moment(item[type]).format('LL') }} - </template>
				<template v-if="item.itemName === 'deliveryEndDate'">
					{{ moment(item[type]).format('LL') }}
				</template>
			</template>
		</template>

		<template v-if="info.fieldName === 'transportMode'">
			<template v-if="type !== 'value'">
				<p
					v-for="(item, i) in info.oldFileValue"
					:key="i"
				>
					<template> {{ item }} </template>
				</p>
			</template>
			<template v-else>
				<p
					:key="item.itemName"
					v-for="item in info.itemDetails"
				>
					<template v-if="item.itemName === 'transportMode'"> {{ item.itemCName }}：{{ item.valueDesc }} </template>
					<template v-else> {{ item.itemCName }}：{{ item.valueDesc }} </template>
				</p>
			</template>
		</template>
		<template v-if="!['basePrice', 'quantity', 'deliveryDate', 'transportMode', 'basePriceDesc'].includes(info.fieldName)">
			<p
				:key="item.itemName"
				v-for="item in info.itemDetails"
			>
				<template>
					<!-- <span> {{ item.itemCName }}：  </span> -->
					<span v-if="type === 'value'">{{ item.valueDesc || '-' }}</span>
					<span v-else>{{ item.oldValueDesc || '-' }}</span>
				</template>
			</p>
		</template>
	</div>
</template>
<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';

const CHANGE_MAP_OTHER = {
	// 运输负责方
	transportResponsibilityOther: 'transportResponsibility',
	// 交货方式
	deliveryGoodsClause: 'deliveryMode',
	// 运费支付方式
	freightPayModeOther: 'freightPayMode'
};
export default {
	name: 'ChangeItem',
	props: {
		info: {
			type: Object,
			default: () => {}
		},
		type: {
			type: String,
			default: 'value'
		},
		contractInfo: {
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			despatchTypeDict: filterCodeByKey('despatchTypeDict') || [],
			moment,
			CHANGE_MAP_OTHER
		};
	},

	computed: {
		getDespatchTypeDict() {
			const despatchTypeDict = {};
			this.despatchTypeDict.forEach(item => {
				despatchTypeDict[item.value] = item.text;
			});
			return despatchTypeDict;
		}
	},
	methods: {
		getOldFileValue() {
			return this.info.oldFileValue;
		}
	}
};
</script>
