import { API_PERSONALDETAIL, API_GETKEY, API_GET_APPID, API_GET_APPID_YD } from 'api/account';
import { API_ISTERMINALDIRECTOR } from 'api';
import delay from 'lodash/delay';
import { message } from 'ant-design-vue';
import ENV from 'api/env.js';
import store from 'store';
import { JSEncrypt } from 'jsencrypt';
import SaveData from 'store/storage';
import { API_PERMISSION } from 'api/account';

export function passwordValid(values) {
	if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{7,}$/.test(values)) {
		return {
			flag: false,
			text: '必须含有数字和字母的8位以上组合'
		};
	}
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
			url: require('@/v2/assets/imgs/common/pdf.jpeg'),
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
		document.location.href.indexOf('/center/assets/receivable/change/detailJR') > -1
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

export function filterOption(input, option) {
	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
export function getPersonalDetail(callback) {
	const personalDetail = API_PERSONALDETAIL().then(res => {
		return res;
	});
	// const userRole = API_USERROLE().then((res) => {
	//   return res
	// })
	const getTerminalDirector = API_ISTERMINALDIRECTOR().then(res => {
		return res;
	});
	Promise.all([personalDetail, /*userRole,*/ getTerminalDirector])
		.then(values => {
			const [personaldetail, /*userRole,*/ terminalDirector] = values;
			const { companyUser } = personaldetail.data;

			let directorFlag = false;
			if (terminalDirector.success && terminalDirector.data) {
				directorFlag = true;
			}

			if (companyUser) {
				const { id, companyType, uscc, name } = companyUser.company;
				const companyUserRoles = (companyUser.roles || []).map(item => {
					return item.code.toLowerCase();
				});
				const companyUserData = {
					...companyUser,
					// companyUserRoles: companyUser.roles || [],
					companyId: id,
					companyType,
					companyUscc: uscc,
					companyUserRoles,
					companyName: name,
					companyUserId: companyUser.id,
					directorFlag
				};
				store.commit('user/VUEX_MU_COMPANYSUER', companyUserData);
			}

			const { personal } = personaldetail.data;
			if (personal) {
				/* this.VUEX_MU_PERSONALLINFO({
        ...personal,
        companys: personal.companyUserList,
        curCompanyId: companyUser && companyUser.company ? companyUser.company.id : '',
      }); */
				store.commit('user/VUEX_MU_PERSONALLINFO', {
					...personal,
					companys: personal.companyUserList,
					curCompanyId: companyUser && companyUser.company ? companyUser.company.id : ''
				});
				// 用户绑定企业展示轨迹查询入口，未绑定就不展示
				if (personal.companyUserList && personal.companyUserList.length > 0) {
					delay(() => {
						// 查询轨迹按钮不展示
						document.getElementsByClassName('searchDeliverTrain')[0].style.display = 'block';
					}, 300);
					// this.$nextTick(() => {
					//   // 查询轨迹按钮不展示
					//   document.getElementsByClassName('searchDeliverTrain')[0].style.display='block'
					// })
				}
			}
			// window.location.reload()

			if (callback) {
				/**
				 * 如果当前用户没有工作台模块权限，跳转至账户中心
				 * 如果当前用户有工作台模块权限，判断是否是核心企业，不是核心企业，跳转至账户中心
				 * 如果当前用户有工作台模块权限，是核心企业，判断是否完成使命认证，否，跳转至账户中心
				 */
				const { companyUserList } = personal;
				API_PERMISSION().then(res => {
					if (res.success) {
						if (res.data.includes('workbench')) {
							if (companyUserList?.length) {
								const { companyType } = companyUser.company;
								if (companyType == 'CORE_COMPANY') {
									if (personal.auth) {
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
					} else {
						message.error('获取用户权限错误,请重新登录');
					}
				});
			}
		})
		.catch(() => {
			SaveData.storage.setItem('VUEX_ST_TOKEN', '');
		});
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
		return num;
	}
	num = parseFloat(num);
	return (Math.round((num + Number.EPSILON) * Math.pow(10, digit)) / Math.pow(10, digit)).toFixed(digit);
}

/**
 * tencent验证码
 */
export function tencentCaptcha(callback, mobile, smsTemplateName = undefined) {
	API_GET_APPID({
		mobile,
		smsTemplateName,
		source: 'PC'
	}).then(res => {
		if (res.success) {
			const appIdWG = '196117135'; //无感
			let type = res.data == appIdWG ? 'WG' : 'HK';
			let sdkOptions = { needFeedBack: false, loading: type !== 'WG' };
			const Captcha = new window.TencentCaptcha(
				res.data,
				res => {
					if (res.ret === 0) {
						if (callback) {
							callback(res);
						}
					}
					if (res.ret !== 0 && res.ret !== 2) {
						message.error('验证错误，请重新验证。');
					}
				},
				sdkOptions
			);
			Captcha.show();
		}
	});
}

/**
 * tencent验证码  /首页右下角船运轨迹专用
 */
export function tencentCaptchaYD(callback, mobile, smsTemplateName = undefined) {
	API_GET_APPID_YD({
		mobile,
		smsTemplateName,
		source: 'PC'
	}).then(res => {
		if (res.success) {
			const appIdWG = '196117135'; //无感
			let type = res.data == appIdWG ? 'WG' : 'HK';
			let sdkOptions = { needFeedBack: false, loading: type !== 'WG' };
			const Captcha = new window.TencentCaptcha(
				res.data,
				res => {
					if (res.ret === 0) {
						if (callback) {
							callback(res);
						}
					}
					if (res.ret !== 0 && res.ret !== 2) {
						message.error('验证错误，请重新验证。');
					}
				},
				sdkOptions
			);
			Captcha.show();
		}
	});
}
/**
 * 清除当前页面keepalive缓存
 */
export function delKeep(that) {
	let vnode = that.$vnode;
	let parentVnode = vnode;
	// 循环向上寻找满足条件的父元素
	while (!(!parentVnode || parentVnode.componentInstance?.cache)) {
		parentVnode = parentVnode.parent;
	}
	if (parentVnode) {
		let cache = parentVnode.componentInstance.cache;
		//  清除相关联的缓存
		const delCache = vnodeItem => {
			let key =
				vnodeItem.key == null
					? vnodeItem.componentOptions.Ctor.cid + (vnodeItem.componentOptions.tag ? `::${vnodeItem.componentOptions.tag}` : '')
					: vnodeItem.key;
			let keys = parentVnode.componentInstance.keys;
			if (cache && cache[key]) {
				that.$destroy();
				// remove key
				if (keys.length) {
					let index = keys.indexOf(key);
					if (index > -1) {
						keys.splice(index, 1);
					}
				}
				cache[key] = null;
			}
			vnodeItem.componentOptions?.children?.map(item => {
				delCache(item);
				return null;
			});
		};
		delCache(parentVnode);
	}
}

//经纬度转换°分′秒″
export function FormatLonLat(value, type) {
	let val = value.toString();
	if (typeof val == 'undefined' || val == '') {
		return '';
	}
	var i = val.indexOf('.');
	var strDu = i < 0 ? val : val.substring(0, i); //获取度
	var strFen = 0;
	var strMiao = 0;
	if (i > 0) {
		var strFen = '0' + val.substring(i);
		strFen = strFen * 60 + '';
		i = strFen.indexOf('.');
		if (i > 0) {
			strMiao = '0' + strFen.substring(i);
			strFen = strFen.substring(0, i); //获取分
			strMiao = strMiao * 60 + '';
			i = strMiao.indexOf('.');
			strMiao = strMiao.substring(0, i + 4); //取到小数点后面三位
			strMiao = parseFloat(parseFloat(strMiao).toFixed(2)); //精确小数点后面两位
		}
	}
	let direction = '';
	if (type === 'lon') {
		direction = strDu > 0 ? 'E' : 'W';
	}
	if (type === 'lat') {
		direction = strDu > 0 ? 'N' : 'S';
	}
	return strDu + '°' + strFen + '′' + strMiao + '″' + direction;
}

// 表格相同字段合并行
export function TableRowSpanFunc(data, key) {
	// 将数据中key对应的值的数据相邻排列
	let keys = [];
	data.forEach(item => {
		if (!keys.includes(item[key])) {
			keys.push(item[key]);
		}
	});
	let temp = [];
	keys.forEach(item => {
		let k = 0;
		data.forEach(cell => {
			if (item === cell[key]) {
				let obj = JSON.parse(JSON.stringify(cell));
				temp.push(obj);
				k++;
			}
		});
	});
	// 设置表格数据的rowSpan
	const tableData = temp;
	let repeatItem = '';
	for (var i = 0; i < tableData.length; i++) {
		const item = tableData[i];
		if (item[key] !== repeatItem) {
			repeatItem = item[key];
		} else {
			break;
		}
		let count = 1;
		item[`${key}RowSpan`] = count;
		for (let j = i + 1; j < tableData.length; j++) {
			// 如果是同一个值，往后递增
			if (repeatItem === tableData[j][key]) {
				count++;
				// 往后相同的值都设为空单元格
				tableData[j][`${key}RowSpan`] = 0;
				// 只有同值第一个才设置合并的单元格数
				item[`${key}RowSpan`] = count;
				// 所有都是为同一个值的情况
				// 如果到了尾部，则循环结束
				if (j === tableData.length - 1) {
					break;
				}
			} else {
				// 指针跳转到下一个，从下一排开始
				i = j - 1;
				count = 1;
				tableData[j][`${key}RowSpan`] = 1;
				break;
			}
		}
	}
	return tableData;
}

// 获取当前日期 20200101
export function GetCurrentDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	let str = '';
	if (month >= 1 && month <= 9) {
		month = '0' + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = '0' + strDate;
	}
	str = year.toString() + month.toString() + strDate.toString();
	return str;
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

//base64附件下载
export function downloadBase64File(base64, fileName, fileType, mimetype) {
	const blob = base64ToBlob(base64, mimetype); // 转成blob对象
	downloadExportFile(blob, fileName, fileType); // 下载文件
}
export function downloadExportFile(blob, fileName, fileType) {
	const downloadElement = document.createElement('a');
	let href = blob;
	if (typeof blob === 'string') {
		downloadElement.target = '_blank';
	} else {
		href = window.URL.createObjectURL(blob); // 创建下载的链接
	}
	downloadElement.href = href;
	downloadElement.download = fileName + '.' + fileType; // 下载后文件名
	document.body.appendChild(downloadElement);
	downloadElement.click(); // 触发点击下载
	document.body.removeChild(downloadElement); // 下载完成移除元素
	if (typeof blob !== 'string') {
		window.URL.revokeObjectURL(href); // 释放掉blob对象
	}
}
export function base64ToBlob(base64, mime) {
	let raw = window.atob(base64); // 解码base64得到二进制字符串
	let rawLength = raw.length;
	let uInt8Array = new Uint8Array(rawLength); // 创建8位无符号整数值的类型化数组
	for (let i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i); // 数组接收二进制字符串
	}
	return new Blob([uInt8Array], { type: mime });
}
export function getFileType(type) {
	switch (type) {
		case 'txt':
			return 'text/plain';
		case 'doc':
			return 'application/msword';
		case 'docx':
			return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		case 'xls':
			return 'application/vnd.ms-excel';
		case 'xlsx':
			return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		case 'pdf':
			return 'application/pdf';
		case 'pptx':
			return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
		case 'ppt':
			return 'application/vnd.ms-powerpoint';
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/jpeg';
		case 'gif':
			return 'image/gif';
		case 'svg':
			return 'image/svg+xml';
		case 'ico':
			return 'image/x-icon';
		case 'bmp':
			return 'image/bmp,';
	}
}

// 获取当前日期 2020-01-01
export function GetCurrentDateFormat() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	let str = '';
	if (month >= 1 && month <= 9) {
		month = '0' + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = '0' + strDate;
	}
	str = year.toString() + '-' + month.toString() + '-' + strDate.toString();
	return str;
}

// 页面底部按钮区域fixed随页面滚动
export function handleScroll() {
	var thead = document.querySelector('.slDetailBottom');
	var lw = document.querySelector('#app');
	lw.addEventListener('scroll', function () {
		var sl = 228 - lw.scrollLeft;
		thead.style.left = sl + 'px';
	});
}
// 银行账号每隔4位分隔展示
export function formateBankNo(data) {
	let result = '';
	for (let i = 0; i < data.length; i++) {
		if (i % 4 == 0 && i != 0) {
			result += ' ' + data[i];
		} else {
			result += data[i];
		}
	}
	return result;
}
