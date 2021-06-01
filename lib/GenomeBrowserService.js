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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
        this.bpPerScreen = 1000000;
        this.x = 2500000;
        this.inited = false;
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
        this.send = function (action) { return __awaiter(_this, void 0, void 0, function () {
            var type, _i, _a, track_id, _b, _c, track_id, _d, _e, track_id, _f, _g, track_id;
            var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            return __generator(this, function (_v) {
                console.log(action);
                type = action.type;
                if (type === action_1.OutgoingActionType.ACTIVATE_BROWSER) {
                    this.init();
                    return [2 /*return*/];
                }
                if (action.type === action_1.OutgoingActionType.SET_FOCUS) {
                    (_h = this.genomeBrowser) === null || _h === void 0 ? void 0 : _h.set_stick((_j = action.payload) === null || _j === void 0 ? void 0 : _j.focus);
                }
                else if (action.type === action_1.OutgoingActionType.TURN_ON_TRACKS) {
                    for (_i = 0, _a = action.payload.track_ids; _i < _a.length; _i++) {
                        track_id = _a[_i];
                        (_k = this.genomeBrowser) === null || _k === void 0 ? void 0 : _k.set_switch(["track", track_id]);
                        (_l = this.genomeBrowser) === null || _l === void 0 ? void 0 : _l.set_switch(["track", track_id, "label"]);
                    }
                }
                else if (action.type === action_1.OutgoingActionType.TURN_OFF_TRACKS) {
                    for (_b = 0, _c = action.payload.track_ids; _b < _c.length; _b++) {
                        track_id = _c[_b];
                        (_m = this.genomeBrowser) === null || _m === void 0 ? void 0 : _m.clear_switch(["track", track_id]);
                        (_o = this.genomeBrowser) === null || _o === void 0 ? void 0 : _o.clear_switch(["track", track_id, "label"]);
                    }
                }
                else if (action.type === action_1.OutgoingActionType.TURN_ON_LABELS) {
                    for (_d = 0, _e = action.payload.track_ids; _d < _e.length; _d++) {
                        track_id = _e[_d];
                        (_p = this.genomeBrowser) === null || _p === void 0 ? void 0 : _p.set_switch(["track", track_id, "label"]);
                    }
                }
                else if (action.type === action_1.OutgoingActionType.TURN_OFF_LABELS) {
                    for (_f = 0, _g = action.payload.track_ids; _f < _g.length; _f++) {
                        track_id = _g[_f];
                        (_q = this.genomeBrowser) === null || _q === void 0 ? void 0 : _q.clear_switch(["track", track_id, "label"]);
                    }
                }
                else if (action.type === action_1.OutgoingActionType.ZOOM_IN) {
                    this.bpPerScreen = this.bpPerScreen - 10000;
                    (_r = this.genomeBrowser) === null || _r === void 0 ? void 0 : _r.set_bp_per_screen(this.bpPerScreen);
                }
                else if (action.type === action_1.OutgoingActionType.ZOOM_OUT) {
                    this.bpPerScreen = this.bpPerScreen + 10000;
                    (_s = this.genomeBrowser) === null || _s === void 0 ? void 0 : _s.set_bp_per_screen(this.bpPerScreen);
                }
                else if (action.type === action_1.OutgoingActionType.MOVE_LEFT) {
                    this.x = this.x - 10000;
                    (_t = this.genomeBrowser) === null || _t === void 0 ? void 0 : _t.set_x(this.x);
                }
                else if (action.type === action_1.OutgoingActionType.MOVE_RIGHT) {
                    this.x = this.x + 10000;
                    (_u = this.genomeBrowser) === null || _u === void 0 ? void 0 : _u.set_x(this.x);
                }
                else {
                    type = BrowserMessagingType.BPANE;
                }
                return [2 /*return*/];
            });
        }); };
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
    }
    ;
    GenomeBrowserService.prototype.init = function () {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!!this.inited) return [3 /*break*/, 2];
                        return [4 /*yield*/, peregrine_ensembl_js_1.default()];
                    case 1:
                        _g.sent();
                        this.genomeBrowser = new peregrine_ensembl_js_1.GenomeBrowser();
                        (_a = this.genomeBrowser) === null || _a === void 0 ? void 0 : _a.go();
                        _g.label = 2;
                    case 2:
                        this.inited = true;
                        (_b = this.genomeBrowser) === null || _b === void 0 ? void 0 : _b.set_stick("homo_sapiens_GCA_000001405_27:1");
                        (_c = this.genomeBrowser) === null || _c === void 0 ? void 0 : _c.set_switch(["track"]);
                        (_d = this.genomeBrowser) === null || _d === void 0 ? void 0 : _d.set_x(this.x);
                        (_e = this.genomeBrowser) === null || _e === void 0 ? void 0 : _e.set_bp_per_screen(this.bpPerScreen);
                        (_f = this.genomeBrowser) === null || _f === void 0 ? void 0 : _f.set_message_reporter(this.handleIncoming);
                        console.log(this.genomeBrowser);
                        return [2 /*return*/];
                }
            });
        });
    };
    GenomeBrowserService.prototype.subscribeToActions = function () {
        window.addEventListener('message', this.handleAction);
    };
    return GenomeBrowserService;
}());
exports.default = GenomeBrowserService;
