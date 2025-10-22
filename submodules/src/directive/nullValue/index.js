/**
 * 数据空值判断，没有值展示-
 * 使用方式：<span v-nulValue="value">${{value}}</span>
 */

import nullValue from './value';

const install = function (Vue) {
	Vue.directive('nullValue', nullValue);
};

nullValue.install = install;
export default nullValue;
