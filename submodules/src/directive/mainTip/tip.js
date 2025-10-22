const POSITION_LIST = ['left', 'center', 'right'];
const DEFAULT_POSITION = 'center';
/**
 * @function setTooltipPosition
 * 计算并设计tip位置
 * 居右对齐需要获取tips内容宽度
 * @param {string} position 'left|center|right' 默认DEFAULT_POSITION
 * @param {HTMLElement} elem tooltip元素
 * @param {HTMLElement} Elem 被绑定元素元素
 * @returns {void}
 */
const setTooltipPosition = (position, elem, Elem) => {
	setTimeout(() => {
		if (position === 'left') {
			elem.style.left = `0px`;
		} else if (position === 'center') {
			elem.style.left = `${Elem.offsetWidth / 2 - elem.offsetWidth / 2}px`;
		} else {
			elem.style.right = `0px`;
		}
	});
};
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
// 获取元素值
const getItem = binding => {
	let value = '';
	let position = DEFAULT_POSITION;
	if (binding.value) {
		if (Object.prototype.toString.call(binding.value) === '[object Object]') {
			value = binding.value.value;
			position = binding.value.position;
			if (!binding.value.hasOwnProperty('value')) {
				throw new Error('未能捕获到value值,支持value值直接传入或使用包含value键值的对象');
			}
		} else {
			value = binding.value;
		}
		if (!POSITION_LIST.includes(binding.value.position)) {
			position = DEFAULT_POSITION;
		}
	}
	// 判断value类型，如果是数字或字符串不做其他处理，其他情况转成字符串展示
	if (!(typeof value === 'string' || typeof value === 'number')) {
		value = String(value || '');
	}
	return { value, position };
};
// 渲染tip 是否展示
const tipDomChange = props => {
	let { el } = props;
	let uniqueId = el.getAttribute('data-unique-id');
	let elem = document.querySelector(`#${uniqueId}-wrap`);
	if (!elem) {
		return;
	}
	let hover = el.getAttribute('data-unique-hover');
	let value = el.getAttribute('data-unique-value');
	hover = hover === 'true' ? true : false;
	if (hover && value) {
		elem.style.visibility = 'visible';
	} else {
		elem.style.visibility = 'hidden';
	}
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
const mainTip = {
	bind() {},
	inserted(el, binding, vnode) {
		// 创建唯一标识
		let uniqueId = 'id' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
		el.setAttribute('data-unique-id', uniqueId);
		el.setAttribute('data-unique-hover', false);
		el.setAttribute('style', 'position: relative');
		// 需要有提示语，提示语可直接是内容，可以是 对象包含内容形式，对象中可添加定位属性
		// value,position
		let { value, position } = getItem(binding);
		el.setAttribute('data-unique-value', value);
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
		antToolTip.style.bottom = '100%';
		antToolTip.style.transformOrigin = '50% -4px';
		antToolTip.style.paddingBottom = '14px';
		antToolTip.style.visibility = 'hidden';
		antToolTip.style.transition = 'all 0.3s ease-in-out';

		// 创建ant-tooltip-content
		const antTooltipContent = document.createElement('div');
		antTooltipContent.classList.add('ant-tooltip-content');
		antTooltipContent.style.position = 'relative';

		// 创建ant-tooltip-arrow
		const antTooltipArrow = document.createElement('div');
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
		let antTooltipInner = document.createElement('div');
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
		let antTooltipInnerContent = document.createElement('span');
		antTooltipInnerContent.setAttribute('id', `${uniqueId}-content`);
		antTooltipInnerContent.innerHTML = value;
		append(antTooltipInner, antTooltipInnerContent);
		append(antTooltipContent, antTooltipInner);
		el.insertBefore(antToolTip, null);
		setTooltipPosition(position, antToolTip, el);
		el.addEventListener('mouseover', () => {
			setTimeout(() => {
				el.setAttribute('data-unique-hover', true);
				tipDomChange({ el });
			});
		});
		// 当输入框失去焦点时移除提示元素
		el.addEventListener('mouseout', () => {
			el.setAttribute('data-unique-hover', false);
			tipDomChange({ el });
		});
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
	},
	update(el, binding, vnode) {
		let uniqueId = el.getAttribute('data-unique-id');
		if (!uniqueId) return;
		let hover = el.getAttribute('data-unique-hover');
		hover = hover === 'true' ? true : false;
		let { value, position } = getItem(binding);
		el.setAttribute('data-unique-value', value);
		// 判断是否存在弹框，如果存在不进行创建，更新数据
		let self = document.querySelector(`#${uniqueId}-wrap`);
		if (self) {
			let selfContent = document.querySelector(`#${uniqueId}-content`);
			selfContent.innerHTML = value;
			setTooltipPosition(position, self, el);
			tipDomChange({ el });
		}
	},
	componentUpdated() {},
	unbind() {}
};

export default mainTip;
