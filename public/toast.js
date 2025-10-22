/* eslint-disable */
let timerService = null;
let timerTools = null;

function showToast(flag) {
  const elem = document.querySelector("#" + flag + "-icon-wrap");
  if (elem) {
    elem.classList.remove(flag + "-icon-hide");
    elem.classList.add(flag + "-icon-show");
  }
}

function hideToast(flag) {
  const elem = document.querySelector("#" + flag + "-icon-wrap");
  if (elem) {
    elem.classList.add(flag + "-icon-hide");
    elem.classList.remove(flag + "-icon-show");
  }
}

function jumpInvoiceTools() {
  window.sessionStorage.setItem("loginType", "invoiceTools");
  window.sessionStorage.setItem("selectedKeys", "/center/admin/invoice/in/list");
  window.sessionStorage.setItem("openKeysInvoice", "进项发票");
  window.open("/center/admin/invoice/in/list");
}

function changeToastClassIconSingle() {
  const elem = document.querySelector("#tools-icon-content");
  if (elem) {
    elem.classList.remove("tools-icon");
    elem.classList.add("tools-icon-single");
    const toolsIconWrap = document.querySelector(".invoice-tools");
    toolsIconWrap.style.display = "none";
  }
}

function changeToastClassIconNormal() {
  const elem = document.querySelector("#tools-icon-content");
  if (elem) {
    elem.classList.remove("tools-icon-single");
    elem.classList.add("tools-icon");
    const toolsIconWrap = document.querySelector(".invoice-tools");
    toolsIconWrap.style.display = "flex";
  }
}

window.onload = function() {
  if(!window.localStorage.getItem("VUEX_ST_TOKEN")) {
    changeToastClassIconSingle();
  }
  const serviceElem = document.querySelector("#service-icon");
  const serviceIconWrapElem = document.querySelector("#service-icon-wrap");
  const toolsIconElem = document.querySelector("#tools-icon");
  const toolsIconWrapElem = document.querySelector("#tools-icon-wrap");
  if (serviceElem) {
    serviceElem.addEventListener("mouseenter", function() {
      showToast("service");
      hideToast("tools");
      clearTimeout(timerService);
    });
    serviceElem.addEventListener("mouseleave", function() {
      timerService = setTimeout(function() {
        hideToast("service");
      }, 500);
    });
  }
  if (serviceIconWrapElem) {
    serviceIconWrapElem.addEventListener("mouseenter", function() {
      showToast("service");
      hideToast("tools");
      clearTimeout(timerService);
    });
    serviceIconWrapElem.addEventListener("mouseleave", function() {
      timerService = setTimeout(function() {
        hideToast("service");
      }, 500);
    });
  }
  if (toolsIconElem) {
    toolsIconElem.addEventListener("mouseenter", function() {
      showToast("tools");
      hideToast("service");
      clearTimeout(timerTools);
    });
    toolsIconElem.addEventListener("mouseleave", function() {
      timerTools = setTimeout(function() {
        hideToast("tools");
      }, 500);
    });
  }
  if (toolsIconWrapElem) {
    toolsIconWrapElem.addEventListener("mouseenter", function() {
      showToast("tools");
      hideToast("service");
      clearTimeout(timerTools);
    });
    toolsIconWrapElem.addEventListener("mouseleave", function() {
      timerTools = setTimeout(function() {
        hideToast("tools");
      }, 500);
    });
  }
};

function serviceToastShow() {
  const elStyle = document.querySelector("#card-contact-wrap");
  if (Array.prototype.slice.call(elStyle.classList).includes("card-contact-wrap-hide")) {
    document.querySelector("#card-contact-wrap").classList.remove("card-contact-wrap-hide");
    document.querySelector("#card-contact-wrap").classList.add("card-contact-wrap-show");
  } else {
    document.querySelector("#card-contact-wrap").classList.remove("card-contact-wrap-hide");
    document.querySelector("#card-contact-wrap").classList.add("card-contact-wrap-show");
  }
}
function serviceToastHide() {
  document.querySelector("#card-contact-wrap").classList.remove("card-contact-wrap-show");
  document.querySelector("#card-contact-wrap").classList.add("card-contact-wrap-hide");
}