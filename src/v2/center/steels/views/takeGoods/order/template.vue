<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-26 16:19:15
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-28 09:21:27
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/order/template.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<a-modal
		title="模板预览"
		centered
		:visible="visible"
		@ok="handleCancel"
		cancelText=""
		:closable="false"
		width="60%"
		:cancel-button-props="{ style: { display: 'none' } }"
		okText="我知道了"
	>
		<div>
			<table border="1">
				<tr>
					<th colspan="10">登录公司名称</th>
				</tr>
				<tr>
					<td
						colspan="10"
						style="text-align: left"
					>
						提货通知单单号：
					</td>
				</tr>
				<tr>
					<td style="width: 100px">品名</td>
					<td>规格</td>
					<td>材质</td>
					<td>产地</td>
					<td>数量</td>
					<td>重量</td>
					<td>计量方式</td>
					<td>捆包号</td>
					<td>库位</td>
					<td>备注</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>合计</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr style="height: 90px">
					<td>提货方式</td>
					<td colspan="4"></td>
					<td>备注</td>
					<td colspan="2"></td>
					<td>结算方式</td>
					<td colspan="2"></td>
				</tr>
				<tr>
					<td rowspan="2">制单员</td>
					<td
						rowspan="2"
						colspan="2"
					></td>
					<td>手机</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td>邮箱</td>
					<td colspan="6"></td>
				</tr>
				<tr>
					<td>仓库简称</td>
					<td colspan="2"></td>
					<td>仓库电话</td>
					<td style="width: 200px"></td>
					<td
						colspan="2"
						rowspan="3"
					>
						提单有效期
					</td>
					<td
						rowspan="3"
						colspan="3"
					></td>
				</tr>
				<tr>
					<td>仓库全称</td>
					<td colspan="4"></td>
				</tr>
				<tr>
					<td>仓库地址</td>
					<td colspan="4"></td>
				</tr>
				<tr style="height: 150px">
					<td rowspan="5">本单备注</td>
					<td
						rowspan="5"
						colspan="7"
					></td>
					<td
						rowspan="5"
						colspan="2"
						style="text-align: center"
					>
						盖章处
					</td>
				</tr>
			</table>
			<div>
				<p>附录：</p>
				<table border="1">
					<tr>
						<th>序号</th>
						<th>车船号</th>
						<th>司机姓名</th>
						<th>手机号</th>
						<th>身份证号</th>
					</tr>
				</table>
			</div>
		</div>
	</a-modal>
</template>

<script>
export default {
	data() {
		return {
			visible: false
		};
	},
	methods: {
		show() {
			this.visible = true;
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
</script>

<style lang="less" scoped>
table {
	width: 100%;
	height: auto;
	border-collapse: collapse;
}
tr {
	width: 100%;
	height: 30px;
}
/deep/ .ant-modal-footer {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>
