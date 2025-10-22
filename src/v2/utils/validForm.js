// 所有表单校验的工具方法，可以都写在这里

// 校验电话(固话+手机)
export function validIdTel(rule, value, callback) {
	const isMobilePhone = /1[0-9][0-9]{9}$/;
	const isFixMob1 = /0\d{2,3}-[1-9]\d{6,7}$/; //-连接
	const isFixMob2 = /\(0\d{2,3}\)[1-9]\d{6,7}$/; //英文括号
	const isFixMob3 = /（0\d{2,3}）[1-9]\d{6,7}$/; //中文括号
	const isFixMob4 = /0\d{2,3}-[1-9]\d{6,7}-[0-9]\d{2,3}$/; //-带分机
	const isFixMob5 = /\(0\d{2,3}\)[1-9]\d{6,7}\([0-9]\d{2,3}\)$/; //英文括号带分机
	const isFixMob6 = /（0\d{2,3}）[1-9]\d{6,7}（[0-9]\d{2,3}）$/; //中文括号带分机
	if (value) {
		if (
			isFixMob1.test(value) ||
			isFixMob2.test(value) ||
			isFixMob3.test(value) ||
			isFixMob4.test(value) ||
			isFixMob5.test(value) ||
			isFixMob6.test(value) ||
			isMobilePhone.test(value)
		) {
			callback();
		} else {
			callback('电话格式不正确');
		}
	} else {
		callback();
	}
}
// 汉字
export function validHanzi(rule, value, callback) {
	var isFix = /^[\u4e00-\u9fa5]{1,}$/;
	if (value) {
		if (isFix.test(value)) {
			callback();
		} else {
			callback('请输入汉字');
		}
	} else {
		callback();
	}
}
// 只允许包含数字、字母
export function validLetterAndNumber(rule, value, callback) {
	var isFix = /^[0-9a-zA-Z]{1,}$/;
	if (value) {
		if (isFix.test(value)) {
			callback();
		} else {
			callback('请输入数字、字母');
		}
	} else {
		callback();
	}
}
// 只允许包含数字、字母
export function validLetterOrNumberOrHanzi(rule, value, callback) {
	var isFix = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
	if (value) {
		if (isFix.test(value)) {
			callback();
		} else {
			callback('请输入汉字、数字、字母');
		}
	} else {
		callback();
	}
}
//校验车牌号
export function validLicencePlate(rule, value, callback) {
	let LICENCE_PLATE =
		/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/;
	if (!value) {
		callback();
		return;
	}
	if (!LICENCE_PLATE.test(value)) {
		callback('车牌号格式不正确');
		return;
	}
	callback();
}

export function isNumber(value, float) {
	return new RegExp(`^\\d{1,}(\\.\\d{0,${float}})?$`).test(value);
}

export function validNumber({ float = 2, min = -Infinity, max = Infinity, containMin = false }) {
	return (rule, value, callback) => {
		//此处不校验必填，除去空值
		if (!value) {
			callback();
		}
		value = Number(value);
		if (isNaN(value)) {
			callback('请输入数字');
			return;
		}
		if (containMin) {
			if (value < min) {
				callback(`数字不能小于${min}`);
				return;
			}
		} else {
			if (value <= min) {
				callback(`数字不能小于${min}`);
				return;
			}
		}
		if (value > max) {
			callback(`数字不能大于${max}`);
			return;
		}
		if (!new RegExp(`^\\d{1,}(\\.\\d{0,${float}})?$`).test(value)) {
			callback(`最多输入${float}位小数`);
			return;
		}
		callback();
	};
}
