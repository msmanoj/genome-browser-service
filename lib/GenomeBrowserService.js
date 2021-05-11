"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserMessagingType = void 0;
var action_1 = require("./action");
var peregrine_ensembl_js_1 = __importStar(require("../lib/peregrine/peregrine_ensembl.js"));
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
        this.elementId = '';
        this.genomeBrowser = null;
        this.handleAction = function (event) {
            if (event.data.type !== BrowserMessagingType.BPANE_OUT) {
                return;
            }
            var _a = event.data, action = _a.action, payload = _a.payload;
            var type = action;
            var subscriptionsToAction = subscriptions.get(_this.elementId + "-" + type);
            subscriptionsToAction === null || subscriptionsToAction === void 0 ? void 0 : subscriptionsToAction.forEach(function (fn) { return fn(payload); });
        };
        this.handleIncoming = function (message) {
            console.log(message);
        };
        this.send = function (action) {
            var _a;
            if (!_this.elementId || !_this.genomeBrowser) {
                return;
            }
            var type = action.type;
            if (type === action_1.OutgoingActionType.ACTIVATE_BROWSER) {
                type = BrowserMessagingType.BPANE_ACTIVATE;
                _this.genomeBrowser.go();
            }
            else if (type === action_1.OutgoingActionType.PING) {
                _this.ping();
            }
            else if (action.type === action_1.OutgoingActionType.SET_FOCUS) {
                _this.genomeBrowser.set_stick((_a = action.payload) === null || _a === void 0 ? void 0 : _a.focus);
            }
            else if (action.type === action_1.OutgoingActionType.TOGGLE_TRACKS) {
                console.log(action.payload);
                _this.genomeBrowser.set_switch(["Track"]);
            }
            else {
                type = BrowserMessagingType.BPANE;
            }
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
        this.elementId = elementId;
        this.subscribeToActions();
        this.ping();
    }
    ;
    GenomeBrowserService.prototype.ping = function () {
        var _a;
        if (!((_a = document.getElementById(this.elementId)) === null || _a === void 0 ? void 0 : _a.innerHTML)) {
            peregrine_ensembl_js_1.default();
            this.genomeBrowser = new peregrine_ensembl_js_1.GenomeBrowser();
            this.genomeBrowser.set_message_reporter(this.handleIncoming);
        }
    };
    GenomeBrowserService.prototype.subscribeToActions = function () {
        window.addEventListener('message', this.handleAction);
    };
    return GenomeBrowserService;
}());
exports.default = GenomeBrowserService;
