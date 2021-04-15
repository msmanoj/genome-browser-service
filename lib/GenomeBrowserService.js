"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserMessagingType = void 0;
var action_1 = require("./action");
var subscriptions = new Map();
// TODO: This is temporary
var BrowserMessagingType;
(function (BrowserMessagingType) {
    BrowserMessagingType["BPANE_READY_QUERY"] = "bpane-ready-query";
    BrowserMessagingType["BPANE_ACTIVATE"] = "bpane-activate";
    BrowserMessagingType["BPANE"] = "bpane";
    BrowserMessagingType["BPANE_READY"] = "bpane-ready";
    BrowserMessagingType["BPANE_OUT"] = "bpane-out";
})(BrowserMessagingType = exports.BrowserMessagingType || (exports.BrowserMessagingType = {}));
var GenomeBrowserService = /** @class */ (function () {
    function GenomeBrowserService(elementId) {
        var _this = this;
        this.element = null;
        this.elementId = '';
        this.handleAction = function (event) {
            if (event.data.type !== BrowserMessagingType.BPANE_OUT) {
                return;
            }
            var _a = event.data, action = _a.action, payload = _a.payload;
            var type = action;
            var subscriptionsToAction = subscriptions.get(_this.elementId + "-" + type);
            subscriptionsToAction === null || subscriptionsToAction === void 0 ? void 0 : subscriptionsToAction.forEach(function (fn) { return fn(payload); });
        };
        this.send = function (action) {
            if (!_this.element) {
                return;
            }
            var type = action.type;
            if (type === action_1.ActionType.ACTIVATE_BROWSER) {
                type = BrowserMessagingType.BPANE_ACTIVATE;
            }
            else if (type === action_1.ActionType.ACTIVATE_BROWSER) {
                type = BrowserMessagingType.BPANE_ACTIVATE;
            }
            else if (type === action_1.ActionType.PING) {
                type = BrowserMessagingType.BPANE_READY_QUERY;
            }
            else {
                type = BrowserMessagingType.BPANE;
            }
            window.postMessage(__assign(__assign({}, action.payload), { type: type }), '*');
        };
        this.subscribe = function (action, callback) {
            var subscriptionsToAction = subscriptions.get(_this.elementId + "-" + action);
            if (subscriptionsToAction) {
                subscriptionsToAction.add(callback);
            }
            else {
                subscriptions.set(action, new Set([callback]));
            }
            return {
                unsubscribe: function () {
                    subscriptionsToAction === null || subscriptionsToAction === void 0 ? void 0 : subscriptionsToAction.delete(callback);
                }
            };
        };
        this.getElementId = function () { return _this.elementId; };
        this.clearElement = function () { return _this.element = null; };
        this.elementId = elementId;
        this.subscribeToActions();
        this.ping();
    }
    ;
    GenomeBrowserService.prototype.ping = function () {
        window.postMessage({
            type: action_1.ActionType.PING
        }, '*');
    };
    GenomeBrowserService.prototype.subscribeToActions = function () {
        window.addEventListener('message', this.handleAction);
    };
    return GenomeBrowserService;
}());
exports.default = GenomeBrowserService;
