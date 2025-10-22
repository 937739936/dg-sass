/* eslint-disable no-undef */
import appConfig from '../config/base';

export function pageResize(el) {
	let init = () => {
		let wScale = window.innerWidth / appConfig.screen.width;
		el.setAttribute(
			'style',
			`
            width:${appConfig.screen.width}px;
            -webkit-transform:scale(${wScale});
            transform:scale(${wScale});
            -webkit-transform-origin:left top;
            transform-origin:left top;
        `
		);
		if (document.querySelector('#home-header')) {
			document.body.style.overflowX = 'hidden';
			document.querySelector('#app').style.minWidth = '0px';
		}
		if (window.__PRERENDER_INJECTED__) {
			el.style.opacity = 0;
		} else {
			el.style.opacity = 1;
		}
	};
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	window.addEventListener(resizeEvt, init, false);
	document.documentElement.addEventListener('DOMContentLoaded', init, false);
	document.documentElement.scrollTop = 0; //切换页面时滚动到顶部
	unset();
	if (/mobile/gi.test(navigator.userAgent)) {
		el.style.opacity = 0;
		let timer = setTimeout(() => {
			clearTimeout(timer);
			init();
			el.style.opacity = 1;
		}, 500);
	} else {
		init();
	}
}

const htmlElem = document.getElementsByTagName('html')[0];
const bodyElem = document.getElementsByTagName('body')[0];
const appElem = document.getElementById('app');

export function cancelUnset() {
	if (htmlElem) {
		// htmlElem.style.minWidth = '1440px';
	}
	if (bodyElem) {
		bodyElem.classList.remove('mobile-min-width-unset');
	}
	if (appElem) {
		appElem.classList.remove('mobile-min-width-unset');
	}
}

export function unset() {
	if (htmlElem) {
		// htmlElem.style.minWidth = 'unset';
	}
	if (bodyElem) {
		bodyElem.classList.add('mobile-min-width-unset');
	}
	if (appElem) {
		appElem.classList.add('mobile-min-width-unset');
	}
}
