<template>
	<div>
		<template v-if="data.fieldName === 'effectiveDate'">
			<template v-for="item in data.itemDetails">
				<template v-if="item.itemName === 'effectiveStartDate'"> {{ item[type] }} ~ </template>
				<template v-if="item.itemName === 'effectiveEndDate'">
					{{ item[type] }}
				</template>
			</template>
		</template>

		<template v-if="data.fieldName === 'buyerContactId'">
			<!-- 判断是否是仓押 -->
			<template>
				<template v-for="item in data.itemDetails">
					<template v-if="item.itemName === 'buyerContactName'">
						<p>姓名：{{ item[type] }}</p>
					</template>
					<template v-if="item.itemName === 'buyerContactPhone'">
						<p>手机号：{{ item[type] }}</p>
					</template>
					<template v-if="item.itemName === 'buyerContactIdCard'">
						<p>身份证号：{{ item[type] }}</p>
					</template>
				</template>
			</template>
		</template>
		<template>
			<template v-if="data.fieldName === 'sellerContactId'">
				<template v-for="item in data.itemDetails">
					<template v-if="item.itemName === 'sellerContactName'">
						<p>姓名：{{ item[type] }}</p>
					</template>
					<template v-if="item.itemName === 'sellerContactPhone'">
						<p>手机号：{{ item[type] }}</p>
					</template>
				</template>
			</template>
		</template>
	</div>
</template>
<script>
export default {
	name: 'ChangeItem',
	props: {
		data: {
			type: Object,
			default: () => {}
		},
		type: {
			type: String,
			default: 'value'
		}
	}
};
</script>
