(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReportSDK = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var base = 'https://monitor.shanghaishulian.com';
    var REPORTLOG_DETAULT_URL = base + '/rapi/log/create';
    var REPORT_DETAULT_URL = base + '/rapi/report/create';
    var REPORTSPEED_DETAULT_URL = base + '/rapi/report/createspeed';
    var default_o = {
        appid: '',
        host: '',
        reportLogUrl: REPORTLOG_DETAULT_URL,
        reportUrl: REPORT_DETAULT_URL,
        reportSpeedUrl: REPORTSPEED_DETAULT_URL
    };
    var deviceIdKey = "DG_REPORT_DEVICE_ID";
    var ReportSDK = /** @class */ (function () {
        function ReportSDK(config) {
            this.deviceId = this.getDeviceId();
            this.option = __assign(__assign({}, default_o), config);
        }
        ReportSDK.prototype.init = function () {
            return this;
        };
        ReportSDK.prototype.sendImage = function (url) {
            if (!(window.location.host == this.option.host))
                return;
            url += "&deviceId=".concat(this.deviceId || this.getDeviceId());
            new Image().src = url;
        };
        ReportSDK.prototype.sendPost = function (url, data) {
            if (!(window.location.host == this.option.host))
                return;
            var client = new XMLHttpRequest();
            client.open("POST", url);
            client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            client.setRequestHeader("cookies", document.cookie);
            client.setRequestHeader("deviceId", this.deviceId || this.getDeviceId());
            client.send(JSON.stringify(data));
        };
        ReportSDK.prototype.reportLog = function (data) {
            if (data === void 0) { data = {}; }
            var appid = this.option.appid;
            var reportLogUrl = this.option.reportLogUrl;
            this.sendPost(reportLogUrl + '/' + appid, data);
        };
        ReportSDK.prototype.reportEvent = function (code, data) {
            var reportUrl = this.option.reportUrl;
            // 带数据的统计上报
            if (data && Object.keys(data).length > 0) {
                data.code = code;
                this.sendPost(reportUrl, data);
            }
            else {
                this.sendImage(reportUrl + '?code=' + code);
            }
        };
        ReportSDK.prototype.reportSpeed = function (data) {
            var reportSpeedUrl = this.option.reportSpeedUrl;
            this.sendImage(reportSpeedUrl + '?code=' + data.code + '&d=' + data.d);
        };
        ReportSDK.prototype.getDeviceId = function () {
            var _a;
            var deviceId = Math.random().toString(36).slice(2).toUpperCase();
            if (!navigator.cookieEnabled && !window.localStorage) {
                return deviceId;
            }
            var cookieDeviceId = (_a = document.cookie.split("; ").find(function (item) { return item.startsWith("".concat(deviceIdKey, "=")); })) === null || _a === void 0 ? void 0 : _a.replace("".concat(deviceIdKey, "="), "");
            if (cookieDeviceId) {
                localStorage.setItem(deviceIdKey, cookieDeviceId);
                return cookieDeviceId;
            }
            var stroageDeviceId = localStorage.getItem(deviceIdKey);
            if (stroageDeviceId) {
                document.cookie = "".concat(deviceIdKey, "=").concat(stroageDeviceId);
                return stroageDeviceId;
            }
            document.cookie = "".concat(deviceIdKey, "=").concat(deviceId);
            localStorage.setItem(deviceIdKey, deviceId);
            return deviceId;
        };
        return ReportSDK;
    }());

    return ReportSDK;

}));
//# sourceMappingURL=index.umd.js.map
