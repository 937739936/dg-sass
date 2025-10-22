/**
 * 数字格式化，移入Tip大些提示指令
 * 使用方式：<span v-mainTip="{position: 'center',value:'提示语'}"></span> 或者 <div v-mainTip="提示语" />12</div>
 * position默认值 center
 */

import mainTip from './tip';

const install = function (Vue) {
	Vue.directive('mainTip', mainTip);
};

mainTip.install = install;
export default mainTip;
