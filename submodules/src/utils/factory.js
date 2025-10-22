export function getPopupContainer(node) {
	return (node && node.parentNode) || document.body;
}

// 处理银行卡号
// 处理银行卡分为
export const formatAccountNumber = accountNumber => {
	if (!accountNumber) return;
	// 去除所有空格
	accountNumber = accountNumber.replace(/\s/g, '');
	// 每4个数字加一个空格
	let formattedAccountNumber = '';
	for (let i = 0; i < accountNumber.length; i++) {
		if (i % 4 === 0 && i !== 0) {
			formattedAccountNumber += ' ';
		}
		formattedAccountNumber += accountNumber[i];
	}

	return formattedAccountNumber;
};
// 价格单位
export const computeUnit = val => {
	let num = Number(val);
	if (!num || num < 1000) {
		return '';
	}
	let numUnitList = [
		'万',
		'亿',
		'兆',
		'京',
		'垓',
		'秭',
		'穰',
		'沟',
		'涧',
		'正',
		'载',
		'极',
		'恒河沙',
		'那由他',
		'无量',
		'大数',
		'无穷大'
	];
	let numValueList = numUnitList.map((item, index) => {
		return Math.pow(2, 2 + index);
	});
	let unit = '';
	while (num >= Math.pow(10, 4) && unit !== '无穷大') {
		let index = numValueList.findIndex(item => Math.pow(10, item) > num);
		if (index < 0) {
			unit = '无穷大';
		} else {
			unit = numUnitList[index - 1] + unit;
		}
		num = num / Math.pow(10, numValueList[index - 1]);
	}
	if (unit === '无穷大') {
		return unit;
	}
	let minUnitList = ['', '十', '百', '千'];
	let i = 0;
	let minUnit = '';
	while (num >= 10) {
		minUnit = minUnitList[i + 1];
		i++;
		num = num / 10;
	}
	unit = minUnit + unit;
	return unit;
};
export const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};

// 金额转化大小写
export const convertCurrency = money => {
	//汉字的数字
	let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
	//基本单位
	let cnIntRadice = new Array('', '拾', '佰', '仟');
	//对应整数部分扩展单位
	let cnIntUnits = new Array('', '万', '亿', '兆');
	//对应小数部分单位
	let cnDecUnits = new Array('角', '分', '毫', '厘');
	//整数金额时后面跟的字符
	let cnInteger = '整';
	//整型完以后的单位
	let cnIntLast = '元';
	//最大处理的数字
	let maxNum = 999999999999999.9999;
	//金额整数部分
	let integerNum;
	//金额小数部分
	let decimalNum;
	//输出的中文金额字符串
	let chineseStr = '';
	//分离金额后用的数组，预定义
	let parts;
	if (money == '') {
		return '';
	}
	money = parseFloat(money);
	let sign = '';
	if (money < 0) {
		sign = '负';
		money = Math.abs(money);
	}
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
		let zeroCount = 0;
		let IntLen = integerNum.length;
		for (let i = 0; i < IntLen; i++) {
			let n = integerNum.substr(i, 1);
			let p = IntLen - i - 1;
			let q = p / 4;
			let m = p % 4;
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
		let decLen = decimalNum.length;
		for (let i = 0; i < decLen; i++) {
			let n = decimalNum.substr(i, 1);
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
	return sign + chineseStr;
};
