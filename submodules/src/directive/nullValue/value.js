// 获取元素值
const getItem = binding => {
	let value = binding.value;
	// 判断value类型，如果是数字或字符串不做其他处理，其他情况转成字符串展示
	if (typeof value === 'number') {
		value = String(value);
	}
	return { value };
};

// 数据为空时展示
const nullHtml = '<span class="nullHtml" style="display:none;color:rgba(0,0,0,0.25)">-</span>';
// 获取当前元素之后的所有兄弟元素
function hasNextElement(currentElement) {
	var nextSiblings = [];
	var sibling = currentElement.nextElementSibling;
	while (sibling) {
		if (sibling.className === 'nullHtml') {
			return sibling; // 如果找到了匹配的元素，则返回
		}
		sibling = sibling.nextElementSibling;
	}
	return null; // 如果没有找到，则返回null
}
const nullValue = {
	bind() {},
	inserted(el, binding, vnode) {
		// value
		let { value } = getItem(binding);
		el.insertAdjacentHTML('afterend', nullHtml);
		let nullEl = hasNextElement(el);
		if (value) {
			nullEl.style.display = 'none';
			el.style.display = 'inline-block';
		} else {
			nullEl.style.display = 'inline-block';
			el.style.display = 'none';
		}
	},
	update(el, binding, vnode) {
		let { value } = getItem(binding);
		let nullEl = hasNextElement(el);
		if (value) {
			nullEl.style.display = 'none';
			el.style.display = 'inline-block';
		} else {
			nullEl.style.display = 'inline-block';
			el.style.display = 'none';
		}
	},
	componentUpdated() {},
	unbind() {}
};

export default nullValue;
