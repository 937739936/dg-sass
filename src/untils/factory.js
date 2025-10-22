import { API_GETKEY } from 'api/account';
import { message } from 'ant-design-vue';
import ENV from 'api/env.js';
import store from 'store';
import { JSEncrypt } from 'jsencrypt';
import SaveData from 'store/storage';
import storage from '@sub/utils/storage';

export function passwordValid(values) {
	if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,}$/.test(values)) {
		return {
			flag: false,
			text: '必须含有数字和字母的8位以上组合'
		};
	}
	// if (allSame(values)) {
	// return {
	//   flag: false,
	//   text: '密码不能为连续相同字符或为连续字符'
	// }
	// }
}
export function formatNumber(value) {
	if (value == '.') value = '0' + '.';
	value = value.replace(/\,|￥/g, '');
	if (/\[0-9]+$/g.test(value)) {
		return '';
	}
	let arr, result;
	if (value.indexOf('.') != -1) {
		arr = value.split('.');
		if (value && arr[1] && arr[1].length > 2) value = Number(value).toFixed(2);
		arr = value.split('.');
		arr[0] = '￥' + String(arr[0]).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
		result = arr[0] + '.' + (arr[1] != '' ? arr[1] : '');
	} else {
		result = '￥' + String(value).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	}
	result = result.replace('-', '');
	return result;
}

// function allSame(value) {
//   let data = value.split('');
//   let chartCode = []; // 存放ASCII码
//   for (let i in data) {
//     chartCode.push(value.charCodeAt(i));
//   }
//   if (chartCode.length === data.length) {
//     for (let i = 0; i <= chartCode.length; i++) {
//       if (Math.abs(Number(chartCode[i]) - Number(chartCode[i - 1])) <= 1) {
//         return true
//       }
//     }
//   }
// }
export function CheckSocialCreditCode(Code) {
	var patrn = /^[0-9A-Z]+$/;
	//18位校验及大写校验
	if (Code.length != 18 || patrn.test(Code) == false) {
		return false;
	} else {
		var Ancode; //统一社会信用代码的每一个值
		var Ancodevalue; //统一社会信用代码每一个值的权重
		var total = 0;
		var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; //加权因子
		var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
		//不用I、O、S、V、Z
		for (var i = 0; i < Code.length - 1; i++) {
			Ancode = Code.substring(i, i + 1);
			Ancodevalue = str.indexOf(Ancode);
			total = total + Ancodevalue * weightedfactors[i];
			//权重与加权因子相乘之和
		}
		var logiccheckcode = 31 - (total % 31);
		if (logiccheckcode == 31) {
			logiccheckcode = 0;
		}
		var Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
		var Array_Str = Str.split(',');
		logiccheckcode = Array_Str[logiccheckcode];

		var checkcode = Code.substring(17, 18);
		if (logiccheckcode != checkcode) {
			return false;
		}
		return true;
	}
}

//省级地址码校验
function checkProv(val) {
	var pattern = /^[1-9][0-9]/;
	var provs = {
		11: '北京',
		12: '天津',
		13: '河北',
		14: '山西',
		15: '内蒙古',
		21: '辽宁',
		22: '吉林',
		23: '黑龙江 ',
		31: '上海',
		32: '江苏',
		33: '浙江',
		34: '安徽',
		35: '福建',
		36: '江西',
		37: '山东',
		41: '河南',
		42: '湖北 ',
		43: '湖南',
		44: '广东',
		45: '广西',
		46: '海南',
		50: '重庆',
		51: '四川',
		52: '贵州',
		53: '云南',
		54: '西藏 ',
		61: '陕西',
		62: '甘肃',
		63: '青海',
		64: '宁夏',
		65: '新疆',
		71: '台湾',
		81: '香港',
		82: '澳门'
	};
	if (pattern.test(val)) {
		if (provs[val]) {
			return true;
		}
	}
	return false;
}

//出生日期码校验
function checkDate(val) {
	var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
	if (pattern.test(val)) {
		var year = val.substring(0, 4);
		var month = val.substring(4, 6);
		var date = val.substring(6, 8);
		var date2 = new Date(year + '-' + month + '-' + date);
		if (date2 && date2.getMonth() == parseInt(month) - 1) {
			return true;
		}
	}
	return false;
}

//校验码校验
function checkCode(val) {
	var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
	var code = val.substring(17);
	if (p.test(val)) {
		var sum = 0;
		for (var i = 0; i < 17; i++) {
			sum += val[i] * factor[i];
		}
		if (parity[sum % 11] == code.toUpperCase()) {
			return true;
		}
	}
	return false;
}

//校验整体身份证
export function checkID(val) {
	if (checkCode(val)) {
		var date = val.substring(6, 14);
		if (checkDate(date)) {
			if (checkProv(val.substring(0, 2))) {
				return true;
			}
		}
	}
	return false;
}

export function beforeUpload(file, limitFileSize = 10) {
	const isSupportFileType =
		file.type === 'image/jpeg' ||
		file.type === 'image/jpg' ||
		file.type === 'image/png' ||
		file.type === 'image/bmp' ||
		file.type === 'application/pdf';
	if (!isSupportFileType) {
		message.error('仅支持bmp，jpg，png，pdf的文件格式');
	}
	const isLimitFileSize = file.size / 1024 / 1024 <= limitFileSize;
	if (!isLimitFileSize) {
		message.error(`文件大小不能超过${limitFileSize}M`);
	}
	return isSupportFileType && isLimitFileSize;
}

export function handleUploadChange(info, type, callback) {
	const pdfFileList = [
		{
			name: 'pdf文件',
			url: require('../assets/imgs/pdf.jpeg'),
			type: 'image/jpeg',
			uid: '-1'
		}
	];

	if (!info.file.status) return;
	const fileList = [...info.fileList];
	if (info.file.status === 'removed') {
		this[`fileList${type}`] = [];
		setTimeout(() => {
			this.form.resetFields([type]);
		}, 10);
	}
	this[`fileList${type}`] = fileList;
	if (fileList[0] && fileList[0].response) {
		this[type] = fileList[0].response.result;
	}

	switch (info.file.status) {
		case 'done':
			this[`fileList${type}`] = info.file.type === 'application/pdf' ? pdfFileList : this[`fileList${type}`];

			if (info.file.response && info.file.response.error && info.file.response.error.message) {
				this.$message.error(info.file.response.error.message);
				if (callback) {
					callback('', info, type);
				}
				return;
			}

			this.$message.success('上传成功');
			if (callback) {
				callback(info, type);
			}
			break;
		case 'error':
			setTimeout(() => {
				this.form.resetFields([type]);
			}, 50);
			this.$message.error((info.file.response && info.file.response.error && info.file.response.error.message) || '上传失败');
			if (callback) {
				callback('', type, info);
			}
			break;
	}
}

export function down(url, name = '') {
	if (!url) {
		return;
	}
	const a = document.createElement('a');
	a.download = name;
	a.href = url;
	a.click();
}

export function fillDecimal(v, length = 2) {
	const decimal = '.00';
	if ((v + '').indexOf('.') === -1) {
		return v + decimal;
	} else {
		if ((v + '').substring((v + '').indexOf('.')).length == 2) {
			return v + '0';
		} else {
			return v;
		}
	}
}

export function filterLockFile(arr) {
	if (
		document.location.href.indexOf('/center/assets/receivable/JR/audit') > -1 ||
		document.location.href.indexOf('/center/assets/receivable/JR/detail') > -1 ||
		document.location.href.indexOf('center/assets/receivable/change/detailJR') > -1 ||
		document.location.href.indexOf('/center/assets/receivable/JR/manual/detail') > -1 ||
		document.location.href.indexOf('/oaReceivableDetail') > -1
	) {
		if (!arr) return arr;
		return arr.filter(item => {
			return !(item.locked == 0);
		});
	}

	return arr;
}

/**
 * [getPopupContainer 设置select，date等组件的挂载节点
 * 日期组件使用 :getCalendarContainer="getPopupContainer"
 * 其他使用 :getPopupContainer="getPopupContainer"]
 * @param  {HTMLElement} node [description]
 * @return {HTMLElement}      [description]
 */
export function getPopupContainer(node) {
	return (node && node.parentNode) || document.body;
}

export async function getPersonalDetail(callback) {
	if (process.env.NODE_ENV === 'development') {
		store.dispatch('config/VUEX_AT_GETALLCODE');
	} else {
		await store.dispatch('config/VUEX_AT_GETALLCODE');
	}
	try {
		await store.dispatch('user/VUEX_USER_PERSONAL_DETAILS');
		await store.dispatch('user/VUEX_PERMISSION_LIST');
	} catch (error) {
		console.error(error);
	}

	const permissionList = store.getters['user/VUEX_ST_USERAUTH'];
	const { companyUserList } = store.getters['user/VUEX_ST_PERSONALLINFO'];
	const { auth } = store.getters['user/VUEX_ST_PERSONALLINFO'];
	const currentLoginCompany = store.getters['user/VUEX_ST_COMPANYSUER'];
	let nowAuthCode = storage.session.get('nowAuthCode');
	let switchCompany = storage.session.get('switchCompany');
	if (switchCompany && switchCompany == 'true') {
		storage.session.set('switchCompany', false);
		// 切换的铁瑞系公司特殊处理
		const href = window.location.href;
		const passFlag =
			href.indexOf('/center/account') !== -1 ||
			href.indexOf('/center/monitoring') !== -1 ||
			href.indexOf('/center/assets') !== -1 ||
			href.indexOf('/center/financing') !== -1 ||
			href.indexOf('/center/financeCenter') !== -1;
		if (!passFlag && currentLoginCompany.company?.group?.code === 'JT0051') {
			window.location.href = '/center/account/person/info';
			return;
		}
		if (!window.location.href.endsWith('/list')) {
			window.location.href = '/center/account/person/info';
			return;
		}
		if (nowAuthCode && nowAuthCode != 'undefined') {
			if (!permissionList.includes(nowAuthCode)) {
				window.location.href = '/center/account/person/info';
				return;
			}
		} else {
			window.location.reload();
		}
	}

	if (callback) {
		if (permissionList.includes('workbench')) {
			if (companyUserList?.length) {
				const { companyType } = currentLoginCompany;
				if (companyType == 'CORE_COMPANY') {
					if (auth) {
						callback('/');
					} else {
						callback('/center/account/person/info');
					}
				} else {
					callback('/center/account/person/info');
				}
			}
		} else {
			callback('/center/account/person/info');
		}
	}
}

export function getOfficeFileViewUrl(url) {
	return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
}
export function encryptedData(data) {
	const getEncryptedData = (publicKey, data) => {
		const encryptor = new JSEncrypt();
		encryptor.setPublicKey(publicKey);
		return encryptor.encrypt(data);
	};
	return new Promise((resolve, reject) => {
		const publicKey = SaveData.session.getItem('publicKey');
		if (publicKey) {
			resolve(getEncryptedData(publicKey, data));
		} else {
			API_GETKEY().then(res => {
				if (res.success) {
					SaveData.session.setItem('publicKey', res.data);
					resolve(getEncryptedData(res.data, data));
				}
			});
		}
	});
}

export function getQueryVariable(variable) {
	const query = window.location.search.substring(1);
	const vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return false;
}

export function previewAttachment(url) {}
//对比两个对象是否相同
export function deepCompare(x, y) {
	let i, l, leftChain, rightChain;

	function compare2Objects(x, y) {
		let p;

		// remember that NaN === NaN returns false
		// and isNaN(undefined) returns true
		if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
			return true;
		}

		// Compare primitives and functions.
		// Check if both arguments link to the same object.
		// Especially useful on the step where we compare prototypes
		if (x === y) {
			return true;
		}

		// Works in case when functions are created in constructor.
		// Comparing dates is a common scenario. Another built-ins?
		// We can even handle functions passed across iframes
		if (
			(typeof x === 'function' && typeof y === 'function') ||
			(x instanceof Date && y instanceof Date) ||
			(x instanceof RegExp && y instanceof RegExp) ||
			(x instanceof String && y instanceof String) ||
			(x instanceof Number && y instanceof Number)
		) {
			return x.toString() === y.toString();
		}

		// At last checking prototypes as good as we can
		if (!(x instanceof Object && y instanceof Object)) {
			return false;
		}

		if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
			return false;
		}

		if (x.constructor !== y.constructor) {
			return false;
		}

		if (x.prototype !== y.prototype) {
			return false;
		}

		// Check for infinitive linking loops
		if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			return false;
		}

		// Quick checking of one object being a subset of another.
		// todo: cache the structure of arguments[0] for performance
		for (p in y) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}
		}

		for (p in x) {
			if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
				return false;
			} else if (typeof y[p] !== typeof x[p]) {
				return false;
			}

			switch (typeof x[p]) {
				case 'object':
				case 'function':
					leftChain.push(x);
					rightChain.push(y);

					if (!compare2Objects(x[p], y[p])) {
						return false;
					}

					leftChain.pop();
					rightChain.pop();
					break;

				default:
					if (x[p] !== y[p]) {
						return false;
					}
					break;
			}
		}

		return true;
	}

	if (arguments.length < 1) {
		return true; //Die silently? Don't know how to handle such case, please help...
		// throw "Need two or more arguments to compare";
	}

	for (i = 1, l = arguments.length; i < l; i++) {
		leftChain = []; //Todo: this can be cached
		rightChain = [];

		if (!compare2Objects(arguments[0], arguments[i])) {
			return false;
		}
	}

	return true;
}

/**
 * 保留小数点几位数, 自动补零, 四舍五入
 * @param num: 数值
 * @param digit: 小数点后位数
 * @returns string
 */
export function myFixed(num, digit) {
	if (Object.is(parseFloat(num), NaN)) {
		throw new Error(`传入的值：${num}不是一个数字`);
	}
	num = parseFloat(num);
	return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
}
/**
 * 清除当前页面keepalive缓存
 */
export function delKeep(that) {
	let vnode = that.$vnode;
	let parentVnode = vnode && vnode.parent;
	if (parentVnode && parentVnode.componentInstance && parentVnode.componentInstance.cache) {
		var key =
			vnode.key == null
				? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '')
				: vnode.key;
		var cache = parentVnode.componentInstance.cache;
		var keys = parentVnode.componentInstance.keys;
		if (cache[key]) {
			that.$destroy();
			// remove key
			if (keys.length) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
				}
			}
			cache[key] = null;
		}
	}
}
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
