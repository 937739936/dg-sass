import store from '@/store';

import CONSTANTS from './constants';

export function filterCodeByValueName(value, name, key = 'text') {
	let obj = store.state.VUEX_ST_ALLCODE ? store.state.VUEX_ST_ALLCODE : store.getters['config/VUEX_ST_ALLCODE'];
	let result = '';
	const data = obj[name];
	if (data && data.length) {
		data.map(el => {
			//判断value中是否存在分割
			let values = el.value.split(',');
			if (values.includes(String(value))) {
				result = el.label ? el['label'] : el[key];
			}
		});
		return result;
	} else {
		return value;
	}
}
export function filterCodeByTextName(text, name) {
	let obj = store.state.VUEX_ST_ALLCODE ? store.state.VUEX_ST_ALLCODE : store.getters['config/VUEX_ST_ALLCODE'];
	let result = '';
	const data = obj[name];
	if (data && data.length) {
		data.map(el => {
			if (el.text == text) {
				result = el.value;
			}
		});
	}
	return result;
}
const filter = {
	//用户列表过滤器
	registerSource: [
		//注册来源
		{ value: 0, text: '全部' },
		{ value: 1, text: 'PC' },
		{ value: 2, text: 'iOS' },
		{ value: 3, text: 'andriod' },
		{ value: 4, text: 'h5' }
	],
	certificate: [
		//认证
		{ value: 0, text: '全部' },
		{ value: 1, text: '已认证' },
		{ value: 2, text: '未认证' }
	],
	userType: [
		// 用户类型
		{ value: 0, text: '全部' },
		{ value: 1, text: '企业用户' },
		{ value: 2, text: '个人用户' }
	]
};
export function filterTextName(value, str) {
	// 用户列表表格赋值

	let result = '';
	let data = filter[str];
	if (data && data.length) {
		data.map(el => {
			if (el.value == value) {
				result = el.text;
			}
		});
	}
	return result;
}


export function filterCodeByKey(name)  {
  let obj =  store.state.VUEX_ST_ALLCODE ? store.state.VUEX_ST_ALLCODE : store.getters['config/VUEX_ST_ALLCODE']
  const data = obj[name]
  if (data && data.length)
  {


    return data
  } else
  {
    return []
  }
}

export function filterCodeBySteelKey(name) {
	const obj = store.state.VUEX_ST_STEELSALLCODE
		? store.state.VUEX_ST_STEELSALLCODE
		: store.getters['config/VUEX_ST_STEELSALLCODE'];
	const data = obj[name];
	if (data && data.length) {
		return data;
	} else {
		return [];
	}
}
// 金额转化大小写
export const convertCurrency = money => {
	//汉字的数字
	var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
	//基本单位
	var cnIntRadice = new Array('', '拾', '佰', '仟');
	//对应整数部分扩展单位
	var cnIntUnits = new Array('', '万', '亿', '兆');
	//对应小数部分单位
	var cnDecUnits = new Array('角', '分', '毫', '厘');
	//整数金额时后面跟的字符
	var cnInteger = '整';
	//整型完以后的单位
	var cnIntLast = '元';
	//最大处理的数字
	var maxNum = 999999999999999.9999;
	//金额整数部分
	var integerNum;
	//金额小数部分
	var decimalNum;
	//输出的中文金额字符串
	var chineseStr = '';
	//分离金额后用的数组，预定义
	var parts;
	if (money == '') {
		return '';
	}
	money = parseFloat(money);
	if (money >= maxNum) {
		//超出最大处理数字
		return '';
	}
	if (money == 0) {
		chineseStr = cnNums[0] + cnIntLast + cnInteger;
		return chineseStr;
	}
	//转换为字符串
	money = money.toString();
	if (money.indexOf('.') == -1) {
		integerNum = money;
		decimalNum = '';
	} else {
		parts = money.split('.');
		integerNum = parts[0];
		decimalNum = parts[1].substr(0, 4);
	}
	//获取整型部分转换
	if (parseInt(integerNum, 10) > 0) {
		var zeroCount = 0;
		var IntLen = integerNum.length;
		for (var i = 0; i < IntLen; i++) {
			var n = integerNum.substr(i, 1);
			var p = IntLen - i - 1;
			var q = p / 4;
			var m = p % 4;
			if (n == '0') {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					chineseStr += cnNums[0];
				}
				//归零
				zeroCount = 0;
				chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
			}
			if (m == 0 && zeroCount < 4) {
				chineseStr += cnIntUnits[q];
			}
		}
		chineseStr += cnIntLast;
	}
	//小数部分
	if (decimalNum != '') {
		var decLen = decimalNum.length;
		for (var i = 0; i < decLen; i++) {
			var n = decimalNum.substr(i, 1);
			if (n != '0') {
				chineseStr += cnNums[Number(n)] + cnDecUnits[i];
			}
		}
	}
	if (chineseStr == '') {
		chineseStr += cnNums[0] + cnIntLast + cnInteger;
	} else if (decimalNum == '') {
		chineseStr += cnInteger;
	}
	return chineseStr;
};

export function filterSteelsCodeByKey(name) {
	const obj = store.state.VUEX_ST_STEELSALLCODE ? store.state.VUEX_ST_STEELSALLCODE : store.getters['config/VUEX_ST_ALLCODE'];
	const data = obj[name];
	if (data && data.length) {
		return data;
	} else {
		return [];
	}
}
export function filterCodeByLableName(text, name) {
	let result = '';
	const obj = store.state.VUEX_ST_STEELSALLCODE ? store.state.VUEX_ST_STEELSALLCODE : store.getters['config/VUEX_ST_ALLCODE'];
	const data = obj[name];
	if (data && data.length) {
		data.map(el => {
			if (el.label == text) {
				result = el.value;
			}
		});
	}
	return result;
}
