import { computeUnit } from '@sub/utils/factory';

const MIN_INPUT_NUMBER = 1000;
const POSITION_LIST = ['left', 'middle', 'right'];
const DEFAULT_POSITION = 'left';

/**
 * @function setTooltipPosition
 * 计算并设计tip位置
 * 居右对齐需要获取tips内容宽度
 * @param {string} position 'left|center|right' 默认left
 * @param {HTMLElement} elem tooltip元素
 * @param {HTMLElement} inputElem input元素
 * @param {boolean} tipsVisible 显示隐藏
 * @returns {void}
 */
const setTooltipPosition = (position, elem, inputElem, tipsVisible, uniqueId) => {
	if (position === 'left') {
		elem.style.left = `${inputElem.left}px`;
	} else if (position === 'center') {
		elem.style.left = `${inputElem.left + inputElem.width / 2}px`;
	} else {
		elem.style.visibility = 'hidden';
		setTimeout(() => {
			const self = document.querySelector(`#${uniqueId}-wrap`);
			if (self) {
				elem.style.left = `${inputElem.right - self.clientWidth}px`;
				if (!tipsVisible) {
					elem.style.visibility = 'visible';
				}
			}
		}, 0);
	}
	document.body.appendChild(elem);
};
const append = (parent, child) => {
	if (parent.append) {
		// 现代浏览器
		parent.append(child);
	} else if (parent.appendChild) {
		// 现代浏览器
		parent.appendChild(child);
	} else {
		// 旧版IE浏览器
		parent.insertBefore(child, parent.childNodes[parent.childNodes.length]);
	}
};

const inputTip = {
	bind(el, binding, vnode) {
		if (binding.value) {
			if (Object.prototype.toString.call(binding.value) !== '[object Object]') {
				throw new Error('指令参数必须为对象,eg: {min: 2000, position: "middle"}');
			}
			if (!POSITION_LIST.includes(binding.value.position)) {
				throw new Error('position只能为: left|center|right');
			}
			if (typeof binding.value.min !== 'number') {
				throw new Error('min只能为number类型');
			}
		}
		// 创建唯一标识
		let uniqueId = 'id' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
		el.setAttribute('data-unique-id', uniqueId);
		let ele;
		if (el.tagName.toLowerCase() === 'input') {
			ele = el;
		} else if (el.querySelector('input')) {
			ele = el.querySelector('input');
		} else {
			return;
		}
		ele.addEventListener('focus', () => {
			let value = ele.value;
			value = Math.abs(value);
			const bindValue = binding.value?.min || MIN_INPUT_NUMBER;
			const position = binding.value?.position || DEFAULT_POSITION;
			const input = el;
			const inputElem = input.getBoundingClientRect();
			// 创建 ant-tooltip
			const antToolTip = document.createElement('div');
			antToolTip.setAttribute('id', `${uniqueId}-wrap`);
			antToolTip.classList.add('ant-tooltip');
			antToolTip.style.boxSizing = 'border-box';
			antToolTip.style.color = 'rgba(0, 0, 0, 0.85)';
			antToolTip.style.fontSize = '14px';
			antToolTip.style.lineHeight = '1.5715';
			antToolTip.style.zIndex = `1070`;
			antToolTip.style.width = `max-content`;
			antToolTip.style.maxWidth = `250px`;
			antToolTip.style.margin = `0`;
			antToolTip.style.padding = `0`;
			antToolTip.style.position = 'absolute';
			antToolTip.style.top = `${inputElem.top - inputElem.height - 16}px`;
			antToolTip.style.transformOrigin = '50% -4px';
			antToolTip.style.paddingBottom = '14px';

			// 创建ant-tooltip-content
			const antTooltipContent = document.createElement('div');
			antTooltipContent.classList.add('ant-tooltip-content');
			antTooltipContent.style.position = 'relative';

			// 创建ant-tooltip-arrow
			const antTooltipArrow = document.createElement('div');
			// antTooltipArrow.classList.add('ant-tooltip-arrow');
			antTooltipArrow.style.position = 'absolute';
			antTooltipArrow.style.left = '50%';
			antTooltipArrow.style.bottom = '0';
			antTooltipArrow.style.transform = 'translateY(100%) translate(-50%)';
			antTooltipArrow.style.zIndex = '2';
			antTooltipArrow.style.width = '22px';
			antTooltipArrow.style.height = '22px';
			antTooltipArrow.style.pointerEvents = 'none';
			antTooltipArrow.style.overflow = 'hidden';
			antTooltipArrow.style.background = 'transparent';

			// 创建ant-tooltip-arrow-content
			const antTooltipArrowContent = document.createElement('span');
			antTooltipArrowContent.setAttribute('id', `${uniqueId}-arrow`);
			antTooltipArrowContent.classList.add('ant-tooltip-arrow-content');
			antTooltipArrowContent.style.background = 'linear-gradient(to right bottom, rgba(0, 0, 0, .65), rgba(0, 0, 0, .75))';
			antTooltipArrowContent.style.position = 'absolute';
			antTooltipArrowContent.style.display = 'block';
			antTooltipArrowContent.style.width = '11px';
			antTooltipArrowContent.style.height = '11px';
			antTooltipArrowContent.style.borderRadius = '0px 0px 2px';
			antTooltipArrowContent.style.margin = 'auto';
			antTooltipArrowContent.style.inset = '0px';
			antTooltipArrowContent.style.transform = 'translateY(-11px) rotate(45deg)';
			antTooltipArrowContent.style.boxShadow = '3px 3px 7px #00000012';
			append(antTooltipArrow, antTooltipArrowContent);
			append(antTooltipContent, antTooltipArrow);
			append(antToolTip, antTooltipContent);

			// 创建 ant-tooltip-inner
			const antTooltipInner = document.createElement('div');
			antTooltipInner.style.minWidth = '30px';
			antTooltipInner.style.minHeight = '32px';
			antTooltipInner.style.color = 'rgb(255, 255, 255)';
			antTooltipInner.style.textAlign = 'left';
			antTooltipInner.style.overflowWrap = 'break-word';
			antTooltipInner.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
			antTooltipInner.style.boxShadow =
				'rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.08) 0px 6px 16px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px';
			antTooltipInner.style.padding = '6px 8px';
			antTooltipInner.style.textDecoration = 'none';
			antTooltipInner.style.borderRadius = '2px';
			// 创建inner content
			const antTooltipInnerContent = document.createElement('span');
			antTooltipInnerContent.setAttribute('id', `${uniqueId}-content`);
			antTooltipInnerContent.innerHTML = computeUnit(value) || '';
			append(antTooltipInner, antTooltipInnerContent);
			append(antTooltipContent, antTooltipInner);

			const tipsVisible = !value || Number(value) < bindValue;
			setTooltipPosition(position, antToolTip, inputElem, tipsVisible, uniqueId);
			if (tipsVisible) {
				antToolTip.style.display = 'none';
			}
			function hasStyleWithContent(content) {
				// 获取head元素
				var head = document.head || document.getElementsByTagName('head')[0];
				if (!head) {
					return false; // 如果没有head元素，则返回false
				}

				// 遍历head中的所有子元素
				for (var i = 0; i < head.children.length; i++) {
					var child = head.children[i];

					// 检查是否是style标签，并且检查其内容是否匹配
					if (child.tagName.toLowerCase() === 'style' && child.textContent.trim() === content) {
						return true; // 如果找到匹配的style标签，则返回true
					}
				}

				return false; // 如果没有找到匹配的style标签，则返回false
			}
			const cssRule = `.ant-tooltip-arrow-content::before{
        box-sizing: border-box;
        position: absolute;
        top: -11px;
        left: -11px;
        width: 34px;
        height: 34px;
        background-image: ;
        background-size: ;
        background-attachment: ;
        background-origin: ;
        background-clip: ;
        background-color: ;
        background-repeat: no-repeat;
        content: "";
        clip-path: path("M 9.84924 24.0919 A 5 5 0 0 1 13.3848 22.6274 L 20.6274 22.6274 A 2 2 0 0 0 22.6274 20.6274 L 22.6274 13.3848 A 5 5 0 0 1 24.0919 9.84924 L 23.0919 9.84924 L 9.84924 23.0919 Z");
        background-position: -10px -10px;
      }`;

			if (!hasStyleWithContent(cssRule)) {
				const styleTag = document.createElement('style');
				document.head.appendChild(styleTag);
				styleTag.innerHTML = cssRule;
			}
			// 当输入框失去焦点时移除提示元素
			ele.addEventListener('blur', () => {
				const elem = document.querySelector(`#${uniqueId}-wrap`);
				if (elem) {
					document.body.removeChild(elem);
				}
			});
		});
	},
	inserted() {},
	update() {},
	componentUpdated(el, binding, vnode) {
		const input = el;
		const inputElem = input.getBoundingClientRect();
		const bindValue = binding.value?.min || MIN_INPUT_NUMBER;
		const position = binding.value?.position || DEFAULT_POSITION;
		let uniqueId = el.getAttribute('data-unique-id');
		if (!uniqueId) return;
		const elem = document.querySelector(`#${uniqueId}-wrap`);
		if (!elem) return;
		let value;
		if (el.tagName.toLowerCase() === 'input') {
			value = vnode.elm._value;
		} else if (el.querySelector('input')) {
			value = el.querySelector('input').value;
		} else {
			return;
		}
		value = Math.abs(value);
		const tipsVisible = !value || Number(value) < bindValue;
		setTooltipPosition(position, elem, inputElem, tipsVisible, uniqueId);
		if (value && !Number(value)) {
			elem.style.display = 'none';
			// throw new Error('输入内容必须为数字');
		}
		if (value && Number(value) >= bindValue) {
			elem.style.display = 'block';
		} else {
			elem.style.display = 'none';
		}
		document.querySelector(`#${uniqueId}-content`).innerHTML = computeUnit(value);
	},
	unbind() {}
};

export default inputTip;
