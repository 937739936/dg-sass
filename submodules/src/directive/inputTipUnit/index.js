/**
 * 输入框金额单位提示指令
 * 使用方式：<a-input v-inputTip="{min: 2000, position: 'middle'}" /> 或者 <a-input v-inputTip />
 * min 默认值1000, 输入值超过1000才会有tip提示
 * position默认值 left
*/

import inputTip from './input';

const install = function(Vue) {
  Vue.directive('inputTip', inputTip);
};

inputTip.install = install;
export default inputTip;